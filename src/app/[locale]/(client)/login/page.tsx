import AuthForm from "@/components/auth/AuthForm";
import Navbar from "@/components/home/Navbar";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Navbar />
      <AuthForm mode="login" locale={locale} />
    </>
  );
}
