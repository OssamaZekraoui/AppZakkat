import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import jwt from "jsonwebtoken";
import type { NextResponse } from "next/server";

export const REGISTRATION_COOKIE_NAME = "diyae_registration";
export const OTP_TTL_SECONDS = 10 * 60;
export const OTP_RESEND_DELAY_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;

export type PendingRegistration = {
  email: string;
  name: string;
  passwordHash: string;
  otpDigest: string;
  attempts: number;
  resendAfter: number;
};

function getSecret() {
  const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("Authentication secret is not configured");
  return secret;
}

export function generateOtp() {
  return randomInt(100000, 1000000).toString();
}

export function digestOtp(otp: string) {
  return createHmac("sha256", getSecret()).update(otp).digest("hex");
}

export function otpMatches(otp: string, digest: string) {
  const actual = Buffer.from(digestOtp(otp), "hex");
  const expected = Buffer.from(digest, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createPendingRegistrationToken(payload: PendingRegistration) {
  return jwt.sign(payload, getSecret(), { expiresIn: OTP_TTL_SECONDS });
}

export function readPendingRegistrationToken(token?: string) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, getSecret());
    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof payload.email === "string" &&
      typeof payload.name === "string" &&
      typeof payload.passwordHash === "string" &&
      typeof payload.otpDigest === "string" &&
      typeof payload.attempts === "number" &&
      typeof payload.resendAfter === "number"
    ) {
      return {
        email: payload.email,
        name: payload.name,
        passwordHash: payload.passwordHash,
        otpDigest: payload.otpDigest,
        attempts: payload.attempts,
        resendAfter: payload.resendAfter,
      };
    }
  } catch {
    return null;
  }
  return null;
}

export function hasOtpAttemptsRemaining(attempts: number) {
  return attempts < MAX_OTP_ATTEMPTS;
}

export function setPendingRegistrationCookie(response: NextResponse, token: string) {
  response.cookies.set(REGISTRATION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: OTP_TTL_SECONDS,
    path: "/",
  });
}

export function clearPendingRegistrationCookie(response: NextResponse) {
  response.cookies.set(REGISTRATION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });
}
