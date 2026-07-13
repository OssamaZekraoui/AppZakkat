import { Link } from "@/i18n/navigation";
import ZakatWizard from "@/components/zakat/ZakatWizard";

export default async function ZakatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 py-8 px-4">
      <div className="max-w-5xl mx-auto mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-green-deep/10 bg-white/80 px-4 py-2 font-cairo text-sm font-bold text-green-deep shadow-sm transition-all hover:border-gold/40 hover:bg-white"
        >
          <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>
          <span>
            {locale === "ar"
              ? "العودة للرئيسية"
              : locale === "en"
              ? "Back to home"
              : "Retour à l'accueil"}
          </span>
        </Link>
      </div>

      <div className="text-center mb-8">
        <p className="font-amiri text-green-deep/40 text-sm mb-1">
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </p>
      </div>

      <ZakatWizard locale={locale} />
    </main>
  );
}
