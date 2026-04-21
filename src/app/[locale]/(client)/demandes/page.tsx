import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import DemandesListClient from "./DemandesListClient";

export default function DemandesPage() {
  const locale = useLocale();
  const t = useTranslations("demandes");
  const isAr = locale === "ar";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <p className="font-amiri text-green-deep/30 text-sm mb-2">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </p>
            <h1 className="font-amiri text-3xl md:text-4xl font-bold text-green-deep mb-3">
              {t("myRequests")}
            </h1>
            <p className="font-cairo text-sm text-green-deep/50 mb-6">
              {isAr
                ? "استعرض الطلبات النشطة أو قدّم طلب مساعدة جديد"
                : "Consultez les demandes actives ou soumettez une nouvelle demande"}
            </p>
            <Link
              href="/demandes/nouvelle"
              className="inline-block px-8 py-3 rounded-xl bg-gold text-green-deep font-cairo font-bold
                         hover:bg-gold-light shadow-lg hover:shadow-xl transition-all"
            >
              {t("makeRequest")}
            </Link>
          </div>

          <DemandesListClient locale={locale} />
        </div>
      </main>
      <Footer />
    </>
  );
}
