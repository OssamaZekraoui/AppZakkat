import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";

const reviewSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(2000).optional(),
});

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
    
    const parsed = reviewSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid review decision" }, { status: 400 });
    }

    const { decision } = parsed.data;
    const status = decision === "APPROVED" ? "PUBLISHED" : "REJECTED";
    const { id } = await params;

    // Only a submitted request can be moderated. This prevents drafts,
    // already-published requests, and rejected requests from being changed
    // through a replayed approval call.
    const result = await prisma.request.updateMany({
      where: { id, status: { in: ["SUBMITTED", "REVIEW"] } },
      data: { status }
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Request is not awaiting review" },
        { status: 409 },
      );
    }

    const updated = await prisma.request.findUnique({ where: { id } });
    return NextResponse.json({ success: true, request: updated });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
