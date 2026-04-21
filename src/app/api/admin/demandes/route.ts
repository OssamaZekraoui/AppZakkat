import { NextRequest, NextResponse } from "next/server";

// Shared reference to the in-memory store from /api/demandes
// In production, both routes would use Prisma
// For dev, we import the same store to keep data consistent
import { getRequestsStore } from "@/lib/stores/requestsStore";

// GET /api/admin/demandes — List all requests for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const store = getRequestsStore();
    let results = Object.values(store);

    // Filter by status
    if (status) {
      results = results.filter(
        (r) => (r as Record<string, unknown>).status === status
      );
    }

    // Filter by category
    if (category) {
      results = results.filter(
        (r) => (r as Record<string, unknown>).category === category
      );
    }

    // Sort by newest first
    results.sort((a, b) => {
      const dateA = new Date((a as Record<string, unknown>).createdAt as string).getTime();
      const dateB = new Date((b as Record<string, unknown>).createdAt as string).getTime();
      return dateB - dateA;
    });

    const total = results.length;
    const paginated = results.slice((page - 1) * limit, page * limit);

    return NextResponse.json({
      requests: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin list requests error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
