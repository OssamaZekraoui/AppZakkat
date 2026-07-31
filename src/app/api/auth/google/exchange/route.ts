import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  const googleToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
  });
  const email =
    typeof googleToken?.email === "string"
      ? googleToken.email.trim().toLowerCase()
      : null;
  const name = typeof googleToken?.name === "string" ? googleToken.name : null;

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Google session not found" },
      { status: 401 }
    );
  }

  const generatedPassword = await bcrypt.hash(randomBytes(32).toString("hex"), 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      name: name || undefined,
    },
    create: {
      email,
      name,
      password: generatedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  const token = createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.json({
    success: true,
    data: { token, user },
  });

  setSessionCookie(response, token);

  return response;
}
