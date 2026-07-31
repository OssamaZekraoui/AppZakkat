import { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, verifySessionToken } from "@/lib/session";

export function getAuthUser(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  const bearerToken = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;
  const token = bearerToken || request.cookies.get(AUTH_COOKIE_NAME)?.value;

  return token ? verifySessionToken(token) : null;
}
