import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

type AuthTokenPayload = {
  userId: string;
  email: string;
};

export function getAuthUser(request: NextRequest): AuthTokenPayload | null {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (
      typeof payload === "object" &&
      payload !== null &&
      typeof payload.userId === "string" &&
      typeof payload.email === "string"
    ) {
      return { userId: payload.userId, email: payload.email };
    }
  } catch {
    return null;
  }

  return null;
}
