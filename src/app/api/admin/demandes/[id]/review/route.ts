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

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    try { await verifyAdmin(); } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: e.message === "Forbidden" ? 403 : 401 });
    }
    
    const body = await request.json();
    const { decision } = body; 
    
    const status = decision === "APPROVED" ? "PUBLISHED" : "REJECTED";
    const { id } = await params;
    
    const updated = await prisma.request.update({
      where: { id },
      data: { status }
    });
    
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
