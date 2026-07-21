import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const authUser = getAuthUser(request);

  if (!authUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const [requests, calculations] = await Promise.all([
    prisma.request.findMany({
      where: { userId: authUser.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referenceCode: true,
        titleAr: true,
        titleFr: true,
        category: true,
        status: true,
        targetAmount: true,
        currentAmount: true,
        documents: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.zakatCalculation.findMany({
      where: { userId: authUser.userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        currency: true,
        netAssets: true,
        zakatAmount: true,
        school: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    requests: requests.map((item) => {
      const documents = (item.documents as Record<string, unknown>) || {};
      return {
        ...item,
        targetAmount: Number(item.targetAmount),
        currentAmount: Number(item.currentAmount),
        currency: typeof documents.currency === "string" ? documents.currency : "MAD",
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    }),
    calculations: calculations.map((item) => ({
      ...item,
      netAssets: Number(item.netAssets),
      zakatAmount: Number(item.zakatAmount),
      createdAt: item.createdAt.toISOString(),
    })),
  });
}
