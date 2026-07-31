import GoogleAuthComplete from "@/components/auth/GoogleAuthComplete";

export default async function GoogleAuthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <GoogleAuthComplete locale={locale} />;
}
