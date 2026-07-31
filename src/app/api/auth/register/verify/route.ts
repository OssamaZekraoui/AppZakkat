import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import {
  clearPendingRegistrationCookie,
  createPendingRegistrationToken,
  hasOtpAttemptsRemaining,
  otpMatches,
  readPendingRegistrationToken,
  REGISTRATION_COOKIE_NAME,
  setPendingRegistrationCookie,
} from "@/lib/registrationOtp";

export async function POST(request: NextRequest) {
  const pending = readPendingRegistrationToken(
    request.cookies.get(REGISTRATION_COOKIE_NAME)?.value
  );
  const body = await request.json().catch(() => ({}));
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!pending || !/^\d{6}$/.test(otp)) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 400 }
    );
  }

  if (!hasOtpAttemptsRemaining(pending.attempts) || !otpMatches(otp, pending.otpDigest)) {
    const attempts = pending.attempts + 1;
    const response = NextResponse.json(
      { success: false, error: attempts >= 5 ? "Too many attempts" : "Invalid or expired code" },
      { status: attempts >= 5 ? 429 : 400 }
    );
    if (attempts >= 5) clearPendingRegistrationCookie(response);
    else setPendingRegistrationCookie(
      response,
      createPendingRegistrationToken({ ...pending, attempts })
    );
    return response;
  }

  const existingUser = await prisma.user.findUnique({ where: { email: pending.email } });
  if (existingUser) {
    const response = NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 409 }
    );
    clearPendingRegistrationCookie(response);
    return response;
  }

  const user = await prisma.user.create({
    data: { email: pending.email, name: pending.name, password: pending.passwordHash },
    select: { id: true, email: true, name: true, role: true },
  });
  const token = createSessionToken({ userId: user.id, email: user.email, role: user.role });
  const response = NextResponse.json({ success: true, data: { token, user } });
  clearPendingRegistrationCookie(response);
  setSessionCookie(response, token);
  return response;
}
