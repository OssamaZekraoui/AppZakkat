import { useLocale } from "next-intl";
import NewRequestWizard from "@/components/demandes/NewRequestWizard";

export default function NewRequestPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 py-8 px-4">
      {/* Breadcrumb */}
      <nav className="max-w-2xl mx-auto mb-6">
        <ol className="flex items-center gap-2 font-cairo text-xs text-green-deep/40">
          <li>
            <a href={`/${locale}`} className="hover:text-green-deep transition-colors">
              {isAr ? "الرئيسية" : "Accueil"}
            </a>
          </li>
          <li className="text-green-deep/20">/</li>
          <li>
            <a href={`/${locale}/demandes`} className="hover:text-green-deep transition-colors">
              {isAr ? "الطلبات" : "Demandes"}
            </a>
          </li>
          <li className="text-green-deep/20">/</li>
          <li className="text-green-deep font-bold">
            {isAr ? "طلب جديد" : "Nouvelle demande"}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-amiri text-green-deep/30 text-sm mb-2">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
        <h1 className="font-amiri text-3xl md:text-4xl font-bold text-green-deep mb-2">
          {isAr ? "تقديم طلب مساعدة" : "Soumettre une demande d'aide"}
        </h1>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "أكمل الخطوات التالية لتقديم طلبك — سيتم مراجعته خلال 48 إلى 72 ساعة"
            : "Complétez les étapes suivantes — votre demande sera examinée sous 48 à 72h"}
        </p>
      </div>

      <NewRequestWizard locale={locale} />
    </main>
  );
}
