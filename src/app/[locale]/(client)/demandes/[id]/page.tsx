import { useLocale } from "next-intl";
import RequestPublicPageClient from "./RequestPublicPageClient";

export default function RequestDetailPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 py-8 px-4">
      <RequestPublicPageClient locale={locale} />
    </main>
  );
}
