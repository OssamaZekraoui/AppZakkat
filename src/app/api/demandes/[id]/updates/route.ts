import { NextRequest, NextResponse } from "next/server";

// POST /api/demandes/[id]/updates — Add a field update
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { contentAr, contentFr, photos } = body;

    if (!contentAr || contentAr.length < 10) {
      return NextResponse.json(
        { error: "Content too short (min 10 characters)" },
        { status: 400 }
      );
    }

    const update = {
      id: crypto.randomUUID(),
      requestId: id,
      contentAr,
      contentFr: contentFr || null,
      photos: photos || [],
      createdAt: new Date().toISOString(),
      authorRole: "REQUESTER",
    };

    return NextResponse.json(update);
  } catch (error) {
    console.error("Create update error:", error);
    return NextResponse.json({ error: "Failed to create update" }, { status: 500 });
  }
}
