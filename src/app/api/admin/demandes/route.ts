import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
      if (decoded.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { name: true }
          }
        }
      }),
      prisma.request.count({ where })
    ]);

    const formatted = requests.map(req => ({
      ...req,
      displayName: req.user?.name || "Unknown",
    }));

    return NextResponse.json({
      requests: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin list requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
