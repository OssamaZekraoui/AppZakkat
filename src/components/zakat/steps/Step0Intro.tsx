"use client";

import type { Currency, MetalPrices, ZakatSchool } from "@/lib/zakat/types";
import NisabCard from "../ui/NisabCard";
import SchoolSelector from "../ui/SchoolSelector";
import CurrencySelector from "../ui/CurrencySelector";

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
  const isAr = locale === "ar";

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="font-amiri text-3xl md:text-4xl font-bold text-green-deep mb-2">
          {isAr ? "حاسبة الزكاة الشاملة" : "Calculateur de Zakat complet"}
        </h2>
        <p className="font-cairo text-green-deep/60">
          {isAr
            ? "احسب زكاتك بدقة وفق المذاهب الفقهية الأربعة"
            : "Calculez votre Zakat avec précision selon les 4 écoles juridiques"}
        </p>
      </div>

      {/* Quranic verse */}
      <div className="bg-green-pale/30 rounded-2xl p-6 border border-green-deep/10 text-center">
        <p className="font-amiri text-xl text-green-deep leading-relaxed mb-2">
          خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا
        </p>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr ? "التوبة : ١٠٣" : "At-Tawbah : 103"}
        </p>
      </div>

      {/* Nisab card */}
      <NisabCard
        metalPrices={metalPrices}
        currency={currency}
        exchangeRates={exchangeRates}
        locale={locale}
      />

      {/* Currency */}
      <div>
        <label className="block font-cairo font-bold text-green-deep mb-3">
          {isAr ? "العملة" : "Devise"}
        </label>
        <CurrencySelector value={currency} onChange={onCurrencyChange} />
      </div>

      {/* School */}
      <div>
        <label className="block font-cairo font-bold text-green-deep mb-3">
          {isAr ? "المذهب الفقهي" : "École juridique"}
        </label>
        <SchoolSelector
          value={school}
          onChange={onSchoolChange}
          locale={locale}
        />
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
