import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/demandes/[id] — Get request details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const r = await prisma.request.findUnique({
      where: { id },
      include: {
        user: { select: { name: true } },
        updates: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!r) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Parse documents JSON — may contain city, breakdown, banking details etc.
    const docs = (r.documents as Record<string, unknown>) || {};

    const formatted = {
      id: r.id,
      referenceCode: r.referenceCode,
      category: r.category,
      displayName: r.isAnonymous ? "" : (r.user?.name || ""),
      isAnonymous: r.isAnonymous,
      country: r.country,
      city: (docs.city as string) || "",
      contactEmail: (docs.contactEmail as string) || "",
      titleAr: r.titleAr,
      titleFr: r.titleFr || "",
      descriptionAr: r.descriptionAr,
      urgencyLevel: r.isUrgent ? "URGENT" : "NORMAL",
      targetAmount: Number(r.targetAmount),
      currentAmount: Number(r.currentAmount),
      currency: (docs.currency as string) || "MAD",
      deadline: r.deadline?.toISOString() || null,
      breakdown: (docs.breakdown as unknown[]) || [],
      beneficiaryName: (docs.beneficiaryName as string) || "",
      iban: r.iban,
      bic: (docs.bic as string) || "",
      bankName: (docs.bankName as string) || "",
      bankCountry: (docs.bankCountry as string) || r.country,
      documents: Array.isArray(docs.files) ? docs.files : (Array.isArray(r.documents) ? r.documents : []),
      status: r.status,
      progressPercent:
        Number(r.targetAmount) > 0
          ? Math.round((Number(r.currentAmount) / Number(r.targetAmount)) * 100)
          : 0,
      donorCount: 0,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      declarationAccepted: true,
      honorAccepted: true,
      updates: r.updates.map((u) => ({
        id: u.id,
        contentAr: u.contentAr,
        contentFr: u.contentFr || "",
        photos: u.photos || [],
        createdAt: u.createdAt.toISOString(),
        authorRole: "REQUESTER" as const,
      })),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Get request detail error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/demandes/[id] — Update request
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    // Placeholder — in production, update via Prisma
    return NextResponse.json({
      id,
      ...body,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update request error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
