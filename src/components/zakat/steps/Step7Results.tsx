"use client";

import { useState } from "react";
import type { ZakatResult, ZakatSchool } from "@/lib/zakat/types";
import ZakatResultCard from "../ui/ZakatResultCard";

interface Step7Props {
  result: ZakatResult;
  onReset: () => void;
  locale: string;
}

const SCHOOL_LABELS: Record<ZakatSchool, { ar: string; fr: string }> = {
  hanafi: { ar: "حنفي", fr: "Hanafite" },
  maliki: { ar: "مالكي", fr: "Malikite" },
  shafiite: { ar: "شافعي", fr: "Chaféite" },
  hanbalite: { ar: "حنبلي", fr: "Hanbalite" },
};

export default function Step7Results({
  result,
  onReset,
  locale,
}: Step7Props) {
  const isAr = locale === "ar";
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showSchoolComp, setShowSchoolComp] = useState(false);

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {isAr ? "نتائج الحساب" : "Résultats du calcul"}
        </h2>
      </div>

      {/* Main result card */}
      <ZakatResultCard result={result} locale={locale} />

      {/* Financial summary */}
      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <div className="p-4 bg-green-pale/20 border-b border-green-deep/10">
          <h3 className="font-cairo font-bold text-green-deep">
            {isAr ? "الملخص المالي" : "Résumé financier"}
          </h3>
        </div>
        <div className="divide-y divide-green-deep/5">
          <Row
            label={isAr ? "إجمالي الأصول" : "Total actifs bruts"}
            value={`${fmt(result.totalGrossAssets)} ${result.currency}`}
          />
          <Row
            label={isAr ? "الخصومات (ديون)" : "Déductions (dettes)"}
            value={`- ${fmt(result.totalDeductions)} ${result.currency}`}
            className="text-red-500"
          />
          <Row
            label={isAr ? "الأصول الصافية الخاضعة للزكاة" : "Actif net zakatable"}
            value={`${fmt(result.netZakatableAssets)} ${result.currency}`}
            bold
          />
          <Row
            label={isAr ? `النصاب (${result.nisabType === "gold" ? "ذهب" : "فضة"})` : `Nisab (${result.nisabType === "gold" ? "or" : "argent"})`}
            value={`${fmt(result.nisabThreshold)} ${result.currency}`}
          />
        </div>
      </div>

      {/* Breakdown accordion */}
      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full p-4 bg-green-pale/20 border-b border-green-deep/10 flex items-center justify-between"
        >
          <h3 className="font-cairo font-bold text-green-deep">
            {isAr ? "التفاصيل حسب الفئة" : "Détail par catégorie"}
          </h3>
          <span className="text-green-deep/40">{showBreakdown ? "▲" : "▼"}</span>
        </button>
        {showBreakdown && (
          <div className="divide-y divide-green-deep/5">
            {result.breakdown
              .filter((b) => b.amount !== 0)
              .map((b, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <span className="font-cairo text-sm text-green-deep">
                      {isAr ? b.categoryAr : b.category}
                    </span>
                    {!b.isZakatable && (
                      <span className="ms-2 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {isAr ? "غير محتسبة" : "Non zakatable"}
                      </span>
                    )}
                    {b.note && (
                      <p className="text-[10px] text-green-deep/40 font-cairo">
                        {b.note}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-lato text-sm font-bold ${
                      b.amount < 0 ? "text-red-500" : "text-green-deep"
                    }`}
                    dir="ltr"
                  >
                    {fmt(b.amount)} {result.currency}
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* School comparison accordion */}
      <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
        <button
          onClick={() => setShowSchoolComp(!showSchoolComp)}
          className="w-full p-4 bg-green-pale/20 border-b border-green-deep/10 flex items-center justify-between"
        >
          <h3 className="font-cairo font-bold text-green-deep">
            {isAr ? "مقارنة بين المذاهب" : "Comparaison inter-école"}
          </h3>
          <span className="text-green-deep/40">{showSchoolComp ? "▲" : "▼"}</span>
        </button>
        {showSchoolComp && (
          <div className="divide-y divide-green-deep/5">
            {(Object.entries(result.schoolComparison) as [ZakatSchool, number][]).map(
              ([school, amount]) => (
                <div
                  key={school}
                  className={`px-4 py-3 flex items-center justify-between ${
                    school === result.school ? "bg-gold/5" : ""
                  }`}
                >
                  <span className="font-cairo text-sm text-green-deep">
                    {isAr ? SCHOOL_LABELS[school].ar : SCHOOL_LABELS[school].fr}
                    {school === result.school && (
                      <span className="ms-1 text-gold text-xs">
                        ({isAr ? "المختار" : "choisi"})
                      </span>
                    )}
                  </span>
                  <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
                    {fmt(amount)} {result.currency}
                  </span>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onReset}
          className="flex-1 px-6 py-3 rounded-xl bg-green-deep/5 text-green-deep font-cairo font-bold
                     hover:bg-green-deep/10 transition-colors"
        >
          {isAr ? "حساب جديد" : "Nouveau calcul"}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-green-deep/40 font-cairo">
        {isAr
          ? "هذا الحساب تقديري — استشر عالماً للتأكد"
          : "Ce calcul est indicatif — consultez un savant pour confirmation"}
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
      <span
        className={`font-cairo text-sm ${
          bold ? "font-bold text-green-deep" : "text-green-deep/70"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-lato text-sm ${
          bold ? "font-bold text-green-deep" : ""
        } ${className || ""}`}
        dir="ltr"
      >
        {value}
      </span>
    </div>
  );
}
