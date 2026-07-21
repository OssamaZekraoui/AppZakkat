import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { fullRequestSchema } from "@/lib/validations/demande";

function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DY-${year}-${rand}`;
}

// POST /api/demandes - Create a new request
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);

    if (!authUser) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const body = await request.json();
    const userId = authUser.userId;

    // If draft, minimal validation
    if (body.status === "DRAFT") {
      const referenceCode = generateReferenceCode();
      const created = await prisma.request.create({
        data: {
          userId,
          category: body.category || "PERSONAL",
          titleAr: body.titleAr || "",
          descriptionAr: body.descriptionAr || "",
          targetAmount: body.targetAmount || 0,
          iban: body.iban || "",
          referenceCode,
          country: body.country || "MA",
          isUrgent: body.urgencyLevel === "URGENT" || body.urgencyLevel === "CRITICAL",
          isAnonymous: body.isAnonymous || false,
          deadline: body.deadline ? new Date(body.deadline) : null,
          titleFr: body.titleFr || null,
          documents: body.documents || [],
          status: "DRAFT",
        },
      });
      return NextResponse.json({ id: created.id, referenceCode, status: "DRAFT" });
    }

    // Full validation for submission
    const validation = fullRequestSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        errors[issue.path.join(".")] = issue.message;
      }
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    const data = validation.data;
    const referenceCode = generateReferenceCode();

    const created = await prisma.request.create({
      data: {
        userId,
        category: data.category,
        titleAr: data.titleAr,
        titleFr: data.titleFr || null,
        descriptionAr: data.descriptionAr,
        targetAmount: data.targetAmount,
        iban: data.iban,
        referenceCode,
        country: data.country,
        isUrgent: data.urgencyLevel === "URGENT" || data.urgencyLevel === "CRITICAL",
        isAnonymous: data.isAnonymous,
        deadline: data.deadline ? new Date(data.deadline) : null,
        documents: data.documents,
        status: "SUBMITTED",
      },
    });

    return NextResponse.json({
      id: created.id,
      referenceCode,
      status: "SUBMITTED",
    });
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/demandes - List requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};

    // This is the public catalogue: a request must never be exposed before
    // an administrator has approved it. Status filtering belongs to the
    // protected admin endpoint (/api/admin/demandes).
    where.status = "PUBLISHED";

    if (category) {
      where.category = category;
    }
    if (country) {
      where.country = country;
    }

    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { name: true },
          },
          updates: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
        },
      }),
      prisma.request.count({ where }),
    ]);

    const formatted = requests.map((r) => {
      const docs = (r.documents as Record<string, unknown>) || {};
      return {
        id: r.id,
        referenceCode: r.referenceCode,
        category: r.category,
        titleAr: r.titleAr,
        titleFr: r.titleFr,
        descriptionAr: r.descriptionAr,
        targetAmount: Number(r.targetAmount),
        currentAmount: Number(r.currentAmount),
        currency: (docs.currency as string) || "MAD",
        progressPercent: Number(r.targetAmount) > 0
          ? Math.round((Number(r.currentAmount) / Number(r.targetAmount)) * 100)
          : 0,
        status: r.status,
        country: r.country,
        city: (docs.city as string) || "",
        isUrgent: r.isUrgent,
        urgencyLevel: r.isUrgent ? "URGENT" : "NORMAL",
        isAnonymous: r.isAnonymous,
        iban: r.iban,
        deadline: r.deadline?.toISOString() || null,
        documents: Array.isArray(docs.files)
          ? docs.files
          : Array.isArray(r.documents)
            ? r.documents
            : [],
        donorCount: 0,
        displayName: r.isAnonymous ? "" : (r.user?.name || ""),
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
        updates: r.updates.map((u) => ({
          id: u.id,
          contentAr: u.contentAr,
          contentFr: u.contentFr,
          photos: u.photos,
          createdAt: u.createdAt.toISOString(),
        })),
      };
    });

    return NextResponse.json({
      requests: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
