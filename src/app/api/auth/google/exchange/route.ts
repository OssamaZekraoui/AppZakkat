import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  let googleToken;

  try {
    googleToken = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET,
    });
  } catch (error) {
    console.error("Unable to decode Google session", error);
    return NextResponse.json(
      { success: false, error: "google_token_error" },
      { status: 500 }
    );
  }
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

  let user;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    const generatedPassword = existingUser
      ? existingUser.password
      : await bcrypt.hash(randomBytes(32).toString("hex"), 12);

    user = await prisma.user.upsert({
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
  } catch (error) {
    console.error("Unable to persist Google user", error);
    return NextResponse.json(
      { success: false, error: "google_user_error" },
      { status: 500 }
    );
  }

  let token;

  try {
    token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Unable to create application session", error);
    return NextResponse.json(
      { success: false, error: "application_session_error" },
      { status: 500 }
    );
  }

  const response = NextResponse.json({
    success: true,
    data: { token, user },
  });

  setSessionCookie(response, token);

  return response;
}
