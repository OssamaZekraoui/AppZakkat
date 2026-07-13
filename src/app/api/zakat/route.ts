import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { calculateTotalAssets, calculateZakat } from "@/lib/zakat";

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

function getHawlDates(year: number) {
  const hawlStart = new Date(Date.UTC(year, 0, 1));
  const hawlEnd = new Date(hawlStart);
  hawlEnd.setUTCDate(hawlEnd.getUTCDate() + 354);
  return { hawlStart, hawlEnd };
}

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
    const body = await request.json();
    const {
      goldValue = 0,
      silverValue = 0,
      cashValue = 0,
      stocksValue = 0,
      debts = 0,
      nisabValue,
      year,
      currency = "MAD",
    } = body;

    if (!nisabValue || !year) {
      return NextResponse.json(
        { success: false, error: "nisabValue and year are required" },
        { status: 400 }
      );
    }

    const totalAssets = calculateTotalAssets({ goldValue, silverValue, cashValue, stocksValue });
    const netAssets = Math.max(0, totalAssets - Number(debts));
    const zakatAmount = calculateZakat(netAssets, Number(nisabValue));
    const { hawlStart, hawlEnd } = getHawlDates(Number(year));

    const record = await prisma.zakatCalculation.create({
      data: {
        userId,
        currency,
        nisabType: "GOLD",
        goldPrice: goldValue,
        silverPrice: silverValue,
        totalAssets,
        debts,
        netAssets,
        zakatAmount,
        hawlStart,
        hawlEnd,
        school: "MALIKI",
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch (error) {
    console.error("Create zakat calculation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
