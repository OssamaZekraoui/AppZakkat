"use client";

import type { ZakatResult } from "@/lib/zakat/types";

interface ZakatResultCardProps {
  result: ZakatResult;
  locale: string;
}

export default function ZakatResultCard({
  result,
  locale,
}: ZakatResultCardProps) {
  const isAr = locale === "ar";

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Hawl not completed
  if (!result.hawlCompleted && !result.zakatDue) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h3 className="font-amiri text-2xl text-orange-800 mb-2">
          {isAr ? "لم يكتمل الحول بعد" : "Le Hawl n'est pas encore complété"}
        </h3>
        <p className="font-cairo text-orange-600 text-lg">
          {isAr
            ? `${result.daysUntilHawl?.toLocaleString("ar-MA")} يوماً متبقياً`
            : `${result.daysUntilHawl} jours restants`}
        </p>
      </div>
    );
  }

  // Nisab not met
  if (!result.nisabMet) {
    const gap = result.nisabThreshold - result.netZakatableAssets;
    return (
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-8 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="font-amiri text-2xl text-gray-700 mb-2">
          {isAr
            ? "لم تبلغ أموالك النصاب بعد"
            : "Vos biens n'atteignent pas le Nisab"}
        </h3>
        <p className="font-cairo text-gray-500">
          {isAr ? "الفرق" : "Différence"} :{" "}
          <span className="font-lato font-bold" dir="ltr">
            {fmt(gap)} {result.currency}
          </span>
        </p>
      </div>
    );
  }

  // Zakat is due
  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-deep to-green-medium p-8 text-center text-white shadow-xl">
      <p className="font-cairo text-white/70 mb-1">
        {isAr ? "الزكاة الواجبة عليك" : "Votre Zakat due"}
      </p>
      <p className="font-amiri text-5xl md:text-6xl font-bold text-gold mb-2" dir="ltr">
        {fmt(result.zakatAmount)} <span className="text-2xl">{result.currency}</span>
      </p>
      <p className="font-lato text-white/50 text-sm" dir="ltr">
        2.5% × {fmt(result.netZakatableAssets)} {result.currency}
      </p>
    </div>
  );
}
