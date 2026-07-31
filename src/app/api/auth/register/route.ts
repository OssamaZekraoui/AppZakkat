import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendRegistrationOtp } from "@/lib/email";
import {
  createPendingRegistrationToken,
  digestOtp,
  generateOtp,
  OTP_RESEND_DELAY_SECONDS,
  setPendingRegistrationCookie,
} from "@/lib/registrationOtp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!email || !password || !name || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otp = generateOtp();
    const pendingToken = createPendingRegistrationToken({
      email,
      name,
      passwordHash,
      otpDigest: digestOtp(otp),
      attempts: 0,
      resendAfter: Date.now() + OTP_RESEND_DELAY_SECONDS * 1000,
    });
    await sendRegistrationOtp(email, name, otp);

    const response = NextResponse.json(
      { success: true, requiresVerification: true, email },
      { status: 202 }
    );
    setPendingRegistrationCookie(response, pendingToken);
    return response;
  } catch (error) {
    console.error("Unable to start registration verification", error);
    return NextResponse.json(
      { success: false, error: "Email delivery unavailable" },
      { status: 503 }
    );
  }
}
