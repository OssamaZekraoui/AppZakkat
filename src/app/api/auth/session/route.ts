import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { clearSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = getAuthUser(request);

  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) {
    const response = NextResponse.json(
      { authenticated: false, user: null },
      { status: 401 }
    );
    clearSessionCookie(response);
    return response;
  }

  return NextResponse.json({ authenticated: true, user });
}
