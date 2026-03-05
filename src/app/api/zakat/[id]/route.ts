import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const record = await prisma.zakatRecord.findFirst({ where: { id, userId } });

  if (!record) {
    return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: record });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const record = await prisma.zakatRecord.findFirst({ where: { id, userId } });

  if (!record) {
    return NextResponse.json({ success: false, error: "Record not found" }, { status: 404 });
  }

  await prisma.zakatRecord.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Record deleted" });
}
