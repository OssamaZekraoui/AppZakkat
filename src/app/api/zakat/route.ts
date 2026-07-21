import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { calculateZakat } from "@/lib/zakat/calculator";
import { parseZakatInput, ZakatValidationError } from "@/lib/zakat/validation";
import type { ZakatSchool } from "@/lib/zakat/types";

function getUserIdFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

const SCHOOL_TO_DB: Record<ZakatSchool, "HANAFI" | "MALIKI" | "SHAFIITE" | "HANBALITE"> = {
  hanafi: "HANAFI",
  maliki: "MALIKI",
  shafiite: "SHAFIITE",
  hanbalite: "HANBALITE",
};

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.zakatCalculation.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return NextResponse.json({ success: true, data: records });
}

export async function POST(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body: unknown = await request.json();
    const input = parseZakatInput(body);
    const result = calculateZakat(input);

    const record = await prisma.zakatCalculation.create({
      data: {
        userId,
        currency: result.currency,
        nisabType: result.nisabType === "gold" ? "GOLD" : "SILVER",
        goldPrice: input.metalPrices.goldPerGram,
        silverPrice: input.metalPrices.silverPerGram,
        totalAssets: result.totalGrossAssets,
        debts: result.totalDeductions,
        netAssets: result.netZakatableAssets,
        zakatAmount: result.zakatAmount,
        hawlStart: new Date(result.hawlStart),
        hawlEnd: new Date(result.hawlEnd),
        school: SCHOOL_TO_DB[result.school],
        items: {
          create: result.breakdown
            .filter((item) => item.amount !== 0)
            .map((item) => ({
              category: item.category,
              amount: item.amount,
              amountBase: item.amount,
              notes: item.note,
            })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    if (error instanceof ZakatValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 422 }
      );
    }
    console.error("Create zakat calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
