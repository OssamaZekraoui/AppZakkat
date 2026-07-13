import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export async function verifyAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const locale = await getLocale();

  if (!token) {
    redirect(`/${locale}/login`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string; userId: string };
    if (decoded.role !== "ADMIN") {
      redirect(`/${locale}`);
    }
    return decoded;
  } catch (error) {
    redirect(`/${locale}/login`);
  }
}
