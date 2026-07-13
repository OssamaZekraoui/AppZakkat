import AuthGate from "@/components/auth/AuthGate";
import NewRequestWizard from "@/components/demandes/NewRequestWizard";

const text = {
  ar: {
    home: "الرئيسية",
    requests: "الطلبات",
    current: "طلب جديد",
    back: "العودة للطلبات",
    title: "تقديم طلب مساعدة",
    subtitle: "أكمل الخطوات التالية لتقديم طلبك، وسيتم مراجعته خلال 48 إلى 72 ساعة.",
  },
  fr: {
    home: "Accueil",
    requests: "Demandes",
    current: "Nouvelle demande",
    back: "Retour aux demandes",
    title: "Soumettre une demande d'aide",
    subtitle: "Complétez les étapes suivantes, votre demande sera examinée sous 48 à 72h.",
  },
  en: {
    home: "Home",
    requests: "Requests",
    current: "New request",
    back: "Back to requests",
    title: "Submit a support request",
    subtitle: "Complete the following steps, your request will be reviewed within 48 to 72 hours.",
  },
} as const;

export default async function NewRequestPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const currentLocale = locale === "ar" || locale === "en" ? locale : "fr";
  const t = text[currentLocale];
  const isRtl = currentLocale === "ar";

  return (
    <AuthGate locale={locale}>
      <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 py-8 px-4">
        <div className="mx-auto mb-6 flex max-w-2xl flex-wrap items-center justify-between gap-4">
          <a
            href={`/${locale}/demandes`}
            className="inline-flex items-center gap-2 rounded-full border border-green-deep/10 bg-white px-5 py-2.5 font-cairo text-sm font-bold text-green-deep shadow-sm transition hover:border-gold/45 hover:bg-green-pale/40"
          >
            <span>{isRtl ? "→" : "←"}</span>
            <span>{t.back}</span>
          </a>

          <nav>
            <ol className="flex items-center gap-2 font-cairo text-xs text-green-deep/40">
              <li>
                <a href={`/${locale}`} className="transition-colors hover:text-green-deep">
                  {t.home}
                </a>
              </li>
              <li className="text-green-deep/20">/</li>
              <li>
                <a
                  href={`/${locale}/demandes`}
                  className="transition-colors hover:text-green-deep"
                >
                  {t.requests}
                </a>
              </li>
              <li className="text-green-deep/20">/</li>
              <li className="font-bold text-green-deep">{t.current}</li>
            </ol>
          </nav>
        </div>

        <div className="mb-8 text-center">
          <p className="mb-2 font-amiri text-sm text-green-deep/30">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h1 className="mb-2 font-amiri text-3xl font-bold text-green-deep md:text-4xl">
            {t.title}
          </h1>
          <p className="font-cairo text-sm text-green-deep/50">{t.subtitle}</p>
        </div>

        <NewRequestWizard locale={locale} />
      </main>
    </AuthGate>
  );
}
