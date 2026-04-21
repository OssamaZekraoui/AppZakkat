import { NextRequest, NextResponse } from "next/server";
import { getRequestsStore } from "@/lib/stores/requestsStore";

// POST /api/admin/demandes/[id]/review — Submit review decision
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { decision, note } = body;

    if (!decision || !["APPROVED", "REJECTED"].includes(decision)) {
      return NextResponse.json(
        { error: "Invalid decision. Must be APPROVED or REJECTED." },
        { status: 400 }
      );
    }

    const store = getRequestsStore();
    const req = store[id] as Record<string, unknown> | undefined;

    const newStatus = decision === "APPROVED" ? "PUBLISHED" : "REJECTED";

    if (req) {
      // Update the request in the store
      req.status = newStatus;
      req.updatedAt = new Date().toISOString();
      if (decision === "REJECTED" && note) {
        req.rejectionReason = note;
      }
      req.reviewNote = note || "";
      req.reviewedAt = new Date().toISOString();
    }

    return NextResponse.json({
      id,
      status: newStatus,
      decision,
      note: note || "",
      reviewedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Admin review error:", error);
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
