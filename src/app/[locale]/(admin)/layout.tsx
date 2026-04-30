import { verifyAdminSession } from "@/lib/authSession";
import { AdminClientLayout } from "./AdminClientLayout";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifyAdminSession();

  return <AdminClientLayout>{children}</AdminClientLayout>;
}
