"use client";

import { useState } from "react";
import type { ZakatResult, ZakatSchool } from "@/lib/zakat/types";
import ZakatResultCard from "../ui/ZakatResultCard";
import { numberLocale, pickText } from "../zakatText";
import AppIcon from "@/components/ui/AppIcon";

interface Step7Props {
  result: ZakatResult;
  onReset: () => void;
  locale: string;
}

const SCHOOL_LABELS: Record<ZakatSchool, { ar: string; fr: string; en: string }> = {
  hanafi: { ar: "حنفي", fr: "Hanafite", en: "Hanafi" },
  maliki: { ar: "مالكي", fr: "Malikite", en: "Maliki" },
  shafiite: { ar: "شافعي", fr: "Chaféite", en: "Shafi'i" },
  hanbalite: { ar: "حنبلي", fr: "Hanbalite", en: "Hanbali" },
};

export default function Step7Results({
  result,
  onReset,
  locale,
}: Step7Props) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showSchoolComp, setShowSchoolComp] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const nisabMetal = result.nisabType === "gold"
    ? pickText(locale, { ar: "ذهب", fr: "or", en: "gold" })
    : pickText(locale, { ar: "فضة", fr: "argent", en: "silver" });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "نتائج الحساب", fr: "Résultats du calcul", en: "Calculation results" })}
        </h2>
      </div>

      <ZakatResultCard result={result} locale={locale} />

      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <div className="p-4 bg-green-pale/20 border-b border-green-deep/10">
          <h3 className="font-cairo font-bold text-green-deep">
            {pickText(locale, { ar: "الملخص المالي", fr: "Résumé financier", en: "Financial summary" })}
          </h3>
        </div>
        <div className="divide-y divide-green-deep/5">
          <Row label={pickText(locale, { ar: "إجمالي الأصول", fr: "Total actifs bruts", en: "Total gross assets" })} value={`${fmt(result.totalGrossAssets)} ${result.currency}`} />
          <Row label={pickText(locale, { ar: "الخصومات (ديون)", fr: "Déductions (dettes)", en: "Deductions (debts)" })} value={`- ${fmt(result.totalDeductions)} ${result.currency}`} className="text-red-500" />
          <Row label={pickText(locale, { ar: "الأصول الصافية الخاضعة للزكاة", fr: "Actif net zakatable", en: "Net zakatable assets" })} value={`${fmt(result.netZakatableAssets)} ${result.currency}`} bold />
          <Row label={`${pickText(locale, { ar: "النصاب", fr: "Nisab", en: "Nisab" })} (${nisabMetal})`} value={`${fmt(result.nisabThreshold)} ${result.currency}`} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <button onClick={() => setShowBreakdown(!showBreakdown)} className="w-full p-4 bg-green-pale/20 border-b border-green-deep/10 flex items-center justify-between">
          <h3 className="font-cairo font-bold text-green-deep">
            {pickText(locale, { ar: "التفاصيل حسب الفئة", fr: "Détail par catégorie", en: "Breakdown by category" })}
          </h3>
          <AppIcon name={showBreakdown ? "chevron-up" : "chevron-down"} className="h-5 w-5 text-green-deep/50" />
        </button>
        {showBreakdown && (
          <div className="divide-y divide-green-deep/5">
            {result.breakdown.filter((b) => b.amount !== 0).map((b, i) => (
              <div key={i} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <span className="font-cairo text-sm text-green-deep">
                    {locale === "ar" ? b.categoryAr : b.category}
                  </span>
                  {!b.isZakatable && (
                    <span className="ms-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {pickText(locale, { ar: "غير محتسبة", fr: "Non zakatable", en: "Not zakatable" })}
                    </span>
                  )}
                  {b.note && locale === "ar" && (
                    <p className="text-[10px] text-green-deep/40 font-cairo">{b.note}</p>
                  )}
                </div>
                <span className={`font-lato text-sm font-bold ${b.amount < 0 ? "text-red-500" : "text-green-deep"}`} dir="ltr">
                  {fmt(b.amount)} {result.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <button onClick={() => setShowSchoolComp(!showSchoolComp)} className="w-full p-4 bg-green-pale/20 border-b border-green-deep/10 flex items-center justify-between">
          <h3 className="font-cairo font-bold text-green-deep">
            {pickText(locale, { ar: "مقارنة بين المذاهب", fr: "Comparaison entre écoles", en: "School comparison" })}
          </h3>
          <AppIcon name={showSchoolComp ? "chevron-up" : "chevron-down"} className="h-5 w-5 text-green-deep/50" />
        </button>
        {showSchoolComp && (
          <div className="divide-y divide-green-deep/5">
            {(Object.entries(result.schoolComparison) as [ZakatSchool, number][]).map(([school, amount]) => (
              <div key={school} className={`px-4 py-3 flex items-center justify-between ${school === result.school ? "bg-gold/5" : ""}`}>
                <span className="font-cairo text-sm text-green-deep">
                  {pickText(locale, SCHOOL_LABELS[school])}
                  {school === result.school && (
                    <span className="ms-1 text-gold text-xs">
                      ({pickText(locale, { ar: "المختار", fr: "choisi", en: "selected" })})
                    </span>
                  )}
                </span>
                <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
                  {fmt(amount)} {result.currency}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onReset} className="flex-1 px-6 py-3 rounded-xl bg-green-deep/5 text-green-deep font-cairo font-bold hover:bg-green-deep/10 transition-colors">
          {pickText(locale, { ar: "حساب جديد", fr: "Nouveau calcul", en: "New calculation" })}
        </button>
      </div>

      <p className="text-center text-xs text-green-deep/40 font-cairo">
        {pickText(locale, {
          ar: "هذا الحساب تقديري — استشر عالماً للتأكد",
          fr: "Ce calcul est indicatif — consultez un savant pour confirmation",
          en: "This calculation is indicative — consult a scholar for confirmation",
        })}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  className,
}: {
  label: string;
  value: string;
  bold?: boolean;
  className?: string;
}) {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
      <span className={`font-cairo text-sm ${bold ? "font-bold text-green-deep" : "text-green-deep/70"}`}>
        {label}
      </span>
      <span className={`font-lato text-sm ${bold ? "font-bold text-green-deep" : ""} ${className || ""}`} dir="ltr">
        {value}
      </span>
    </div>
  );
}
