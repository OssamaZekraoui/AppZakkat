import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global", nisabType: "GOLD" },
  });

  return NextResponse.json({ nisabType: settings.nisabType.toLowerCase() });
}

export async function PUT(request: NextRequest) {
  const user = getAuthUser(request);
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as { nisabType?: unknown } | null;
  if (body?.nisabType !== "gold" && body?.nisabType !== "silver") {
    return NextResponse.json({ error: "Invalid nisab type" }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "global" },
    update: { nisabType: body.nisabType === "gold" ? "GOLD" : "SILVER" },
    create: {
      id: "global",
      nisabType: body.nisabType === "gold" ? "GOLD" : "SILVER",
    },
  });

  return NextResponse.json({ success: true, nisabType: settings.nisabType.toLowerCase() });
}
