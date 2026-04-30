import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) throw new Error("Unauthorized");
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
  if (decoded.role !== "ADMIN") throw new Error("Forbidden");
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    try { await verifyAdmin(); } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
    }
    
    const { id } = await params;
    const req = await prisma.request.findUnique({
      where: { id },
      include: { user: true }
    });
    
    if (!req) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const formatted = {
      ...req,
      displayName: req.user?.name || "Unknown",
      contactEmail: req.user?.email || "N/A",
      bic: "N/A",
      bankName: "Registered Bank",
      targetAmount: Number(req.targetAmount),
      currentAmount: Number(req.currentAmount)
    };
    
    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
