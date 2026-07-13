"use client";

import type { MetalPrices, Currency } from "@/lib/zakat/types";
import { numberLocale, pickText } from "../zakatText";

interface NisabCardProps {
  metalPrices: MetalPrices | null;
  currency: Currency;
  exchangeRates: Record<Currency, number>;
  locale: string;
}

export default function NisabCard({
  metalPrices,
  currency,
  exchangeRates,
  locale,
}: NisabCardProps) {
  if (!metalPrices) {
    return (
      <div className="bg-green-pale/30 rounded-2xl p-5 animate-pulse">
        <div className="h-6 bg-green-deep/10 rounded w-1/2 mb-3" />
        <div className="h-4 bg-green-deep/10 rounded w-3/4" />
      </div>
    );
  }

  const rate = exchangeRates[currency] || 1;
  const goldNisab = 85 * metalPrices.goldPerGram * rate;
  const silverNisab = 595 * metalPrices.silverPerGram * rate;

  const formatPrice = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const sourceLabel =
    metalPrices.source === "live"
      ? pickText(locale, { ar: "مباشر", fr: "Live", en: "Live" })
      : metalPrices.source === "cached"
      ? pickText(locale, { ar: "مخزن مؤقتاً", fr: "Cache", en: "Cached" })
      : pickText(locale, { ar: "احتياطي", fr: "Fallback", en: "Fallback" });

  const sourceColor =
    metalPrices.source === "live"
      ? "bg-green-medium"
      : metalPrices.source === "cached"
      ? "bg-gold"
      : "bg-orange-400";

  return (
    <div className="bg-gradient-to-br from-green-pale/40 to-white rounded-2xl p-5 border border-green-deep/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-cairo font-bold text-green-deep">
          {pickText(locale, { ar: "النصاب", fr: "Nisab", en: "Nisab" })}
        </h3>
        <span
          className={`${sourceColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}
        >
          {sourceLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-3 border border-gold/20">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">🥇</span>
            <span className="text-xs font-cairo text-green-deep/60">
              {pickText(locale, { ar: "ذهب", fr: "Or", en: "Gold" })} (85g)
            </span>
          </div>
          <p className="font-lato font-bold text-green-deep text-sm" dir="ltr">
            {formatPrice(goldNisab)} {currency}
          </p>
          <p className="text-[10px] text-green-deep/40 font-lato mt-0.5" dir="ltr">
            {formatPrice(metalPrices.goldPerGram * rate)} {currency}/g
          </p>
        </div>

        <div className="bg-white rounded-xl p-3 border border-green-deep/10">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-lg">🥈</span>
            <span className="text-xs font-cairo text-green-deep/60">
              {pickText(locale, { ar: "فضة", fr: "Argent", en: "Silver" })} (595g)
            </span>
          </div>
          <p className="font-lato font-bold text-green-deep text-sm" dir="ltr">
            {formatPrice(silverNisab)} {currency}
          </p>
          <p className="text-[10px] text-green-deep/40 font-lato mt-0.5" dir="ltr">
            {formatPrice(metalPrices.silverPerGram * rate)} {currency}/g
          </p>
        </div>
      </div>
    </div>
  );
}
