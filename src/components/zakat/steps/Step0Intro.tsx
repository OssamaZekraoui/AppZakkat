"use client";

import type { Currency, MetalPrices, ZakatSchool } from "@/lib/zakat/types";
import NisabCard from "../ui/NisabCard";
import SchoolSelector from "../ui/SchoolSelector";
import CurrencySelector from "../ui/CurrencySelector";
import { pickText } from "../zakatText";

interface Step0Props {
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  school: ZakatSchool;
  onSchoolChange: (s: ZakatSchool) => void;
  metalPrices: MetalPrices | null;
  exchangeRates: Record<Currency, number>;
  locale: string;
}

export default function Step0Intro({
  currency,
  onCurrencyChange,
  school,
  onSchoolChange,
  metalPrices,
  exchangeRates,
  locale,
}: Step0Props) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="font-amiri text-3xl md:text-4xl font-bold text-green-deep mb-2">
          {pickText(locale, {
            ar: "حاسبة الزكاة الشاملة",
            fr: "Calculateur de Zakat complet",
            en: "Complete Zakat calculator",
          })}
        </h2>
        <p className="font-cairo text-green-deep/60">
          {pickText(locale, {
            ar: "احسب زكاتك بدقة وفق المذاهب الفقهية الأربعة",
            fr: "Calculez votre Zakat avec précision selon les quatre écoles juridiques",
            en: "Calculate your Zakat accurately according to the four schools of jurisprudence",
          })}
        </p>
      </div>

      <div className="bg-green-pale/30 rounded-2xl p-6 border border-green-deep/10 text-center">
        <p className="font-amiri text-xl text-green-deep leading-relaxed mb-2">
          خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
        </p>
        <p className="font-cairo text-sm text-green-deep/50">
          {pickText(locale, {
            ar: "التوبة : ١٠٣",
            fr: "At-Tawbah : 103",
            en: "At-Tawbah: 103",
          })}
        </p>
      </div>

      <NisabCard
        metalPrices={metalPrices}
        currency={currency}
        exchangeRates={exchangeRates}
        locale={locale}
      />

      <div>
        <label className="block font-cairo font-bold text-green-deep mb-3">
          {pickText(locale, {
            ar: "العملة",
            fr: "Devise",
            en: "Currency",
          })}
        </label>
        <CurrencySelector value={currency} onChange={onCurrencyChange} />
      </div>

      <div>
        <label className="block font-cairo font-bold text-green-deep mb-3">
          {pickText(locale, {
            ar: "المذهب الفقهي",
            fr: "École juridique",
            en: "Jurisprudence school",
          })}
        </label>
        <SchoolSelector
          value={school}
          onChange={onSchoolChange}
          locale={locale}
        />
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
