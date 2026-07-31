import { NextRequest, NextResponse } from "next/server";
import { sendRegistrationOtp } from "@/lib/email";
import {
  createPendingRegistrationToken,
  digestOtp,
  generateOtp,
  OTP_RESEND_DELAY_SECONDS,
  readPendingRegistrationToken,
  REGISTRATION_COOKIE_NAME,
  setPendingRegistrationCookie,
} from "@/lib/registrationOtp";

export async function POST(request: NextRequest) {
  const pending = readPendingRegistrationToken(
    request.cookies.get(REGISTRATION_COOKIE_NAME)?.value
  );
  if (!pending) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired code" },
      { status: 400 }
    );
  }
  if (Date.now() < pending.resendAfter) {
    return NextResponse.json(
      { success: false, error: "Please wait before requesting another code" },
      { status: 429 }
    );
  }

  try {
    const otp = generateOtp();
    await sendRegistrationOtp(pending.email, pending.name, otp);
    const token = createPendingRegistrationToken({
      ...pending,
      otpDigest: digestOtp(otp),
      attempts: 0,
      resendAfter: Date.now() + OTP_RESEND_DELAY_SECONDS * 1000,
    });
    const response = NextResponse.json({ success: true });
    setPendingRegistrationCookie(response, token);
    return response;
  } catch (error) {
    console.error("Unable to resend registration code", error);
    return NextResponse.json(
      { success: false, error: "Email delivery unavailable" },
      { status: 503 }
    );
  }
}
