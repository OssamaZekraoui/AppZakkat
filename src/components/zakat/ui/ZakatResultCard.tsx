"use client";

import type { ZakatResult } from "@/lib/zakat/types";
import { numberLocale, pickText } from "../zakatText";
import AppIcon from "@/components/ui/AppIcon";

interface ZakatResultCardProps {
  result: ZakatResult;
  locale: string;
}

export default function ZakatResultCard({
  result,
  locale,
}: ZakatResultCardProps) {
  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (!result.hawlCompleted && !result.zakatDue) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 p-8 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h3 className="font-amiri text-2xl text-orange-800 mb-2">
          {pickText(locale, {
            ar: "لم يكتمل الحول بعد",
            fr: "Le Hawl n'est pas encore complété",
            en: "Hawl is not complete yet",
          })}
        </h3>
        <p className="font-cairo text-orange-600 text-lg">
          {pickText(locale, {
            ar: `${result.daysUntilHawl?.toLocaleString("ar-MA")} يوماً متبقياً`,
            fr: `${result.daysUntilHawl} jours restants`,
            en: `${result.daysUntilHawl} days remaining`,
          })}
        </p>
      </div>
    );
  }

  if (!result.nisabMet) {
    const gap = result.nisabThreshold - result.netZakatableAssets;
    return (
      <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-gray-600">
          <AppIcon name="chart" className="h-7 w-7" />
        </div>
        <h3 className="font-amiri text-2xl text-gray-700 mb-2">
          {pickText(locale, {
            ar: "لم تبلغ أموالك النصاب بعد",
            fr: "Vos biens n'atteignent pas le Nisab",
            en: "Your assets have not reached the Nisab",
          })}
        </h3>
        <p className="font-cairo text-gray-500">
          {pickText(locale, { ar: "الفرق", fr: "Différence", en: "Gap" })} :{" "}
          <span className="font-lato font-bold" dir="ltr">
            {fmt(gap)} {result.currency}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-green-deep to-green-medium p-8 text-center text-white shadow-xl">
      <p className="font-cairo text-white/70 mb-1">
        {pickText(locale, {
          ar: "الزكاة الواجبة عليك",
          fr: "Votre Zakat due",
          en: "Your Zakat due",
        })}
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
