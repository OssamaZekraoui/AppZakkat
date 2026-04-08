import { NextRequest, NextResponse } from "next/server";
import { fullRequestSchema } from "@/lib/validations/demande";

// In-memory store for development (replace with Prisma in production)
const requests: Record<string, unknown> = {};
let requestCount = 0;

function generateReferenceCode(): string {
  requestCount++;
  const year = new Date().getFullYear();
  return `DY-${year}-${String(requestCount).padStart(4, "0")}`;
}

// POST /api/demandes — Create a new request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // If draft, minimal validation
    if (body.status === "DRAFT") {
      const id = crypto.randomUUID();
      const referenceCode = generateReferenceCode();
      requests[id] = {
        ...body,
        id,
        referenceCode,
        status: "DRAFT",
        currentAmount: 0,
        progressPercent: 0,
        donorCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        updates: [],
      };
      return NextResponse.json({ id, referenceCode, status: "DRAFT" });
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

    const id = crypto.randomUUID();
    const referenceCode = generateReferenceCode();

    requests[id] = {
      ...validation.data,
      id,
      referenceCode,
      status: "SUBMITTED",
      currentAmount: 0,
      progressPercent: 0,
      donorCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [],
    };

    return NextResponse.json({
      id,
      referenceCode,
      status: "SUBMITTED",
    });
  } catch (error) {
    console.error("Create request error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/demandes — List published requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const country = searchParams.get("country");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let results = Object.values(requests).filter(
      (r: unknown) => (r as Record<string, unknown>).status === "PUBLISHED"
    );

    if (category) {
      results = results.filter(
        (r: unknown) => (r as Record<string, unknown>).category === category
      );
    }
    if (country) {
      results = results.filter(
        (r: unknown) => (r as Record<string, unknown>).country === country
      );
    }

    const total = results.length;
    const paginated = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      requests: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
