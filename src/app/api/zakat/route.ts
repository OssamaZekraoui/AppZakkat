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

export async function GET(request: NextRequest) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const records = await prisma.zakatRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
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
    const { goldValue = 0, silverValue = 0, cashValue = 0, stocksValue = 0, nisabValue, year, currency = "DZD", notes } = body;

    if (!nisabValue || !year) {
      return NextResponse.json(
        { success: false, error: "nisabValue and year are required" },
        { status: 400 }
      );
    }

    const totalAssets = calculateTotalAssets({ goldValue, silverValue, cashValue, stocksValue });
    const zakatAmount = calculateZakat(totalAssets, nisabValue);

    const record = await prisma.zakatRecord.create({
      data: {
        userId,
        year,
        goldValue,
        silverValue,
        cashValue,
        stocksValue,
        totalAssets,
        nisabValue,
        zakatAmount,
        currency,
        notes,
      },
    });

    return NextResponse.json({ success: true, data: record }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
