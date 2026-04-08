import { useLocale } from "next-intl";
import ZakatWizard from "@/components/zakat/ZakatWizard";

export default function ZakatPage() {
  const locale = useLocale();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/20 py-8 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <p className="font-amiri text-green-deep/40 text-sm mb-1">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
      </div>

      <ZakatWizard locale={locale} />
    </main>
  );
}
