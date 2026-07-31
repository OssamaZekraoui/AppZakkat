import jwt from "jsonwebtoken";
import type { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "auth_token";
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60;

export type SessionPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET or NEXTAUTH_SECRET is not configured");
  }
  return secret;
}

export function createSessionToken(payload: SessionPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: SESSION_MAX_AGE });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string" &&
      (payload.role === "USER" || payload.role === "ADMIN")
    ) {
      return {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }
  } catch {
    // An absent, expired, or invalid token is simply an anonymous session.
  }
  return null;
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
}
