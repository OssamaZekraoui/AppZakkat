import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/home/Navbar";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Navbar />
      <AuthForm mode="register" locale={locale} />
    </>
  );
}
