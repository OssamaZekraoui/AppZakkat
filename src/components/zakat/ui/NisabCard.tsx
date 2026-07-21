"use client";

import type { MetalPrices, Currency, NisabType } from "@/lib/zakat/types";
import { calculateNisabValue, convertPriceToCurrency } from "@/lib/zakat/nisab";
import { numberLocale, pickText } from "../zakatText";
import AppIcon from "@/components/ui/AppIcon";

interface NisabCardProps {
  metalPrices: MetalPrices | null;
  currency: Currency;
  exchangeRates: Record<Currency, number>;
  selectedType: NisabType;
  onTypeChange: (type: NisabType) => void;
  locale: string;
}

export default function NisabCard({
  metalPrices,
  currency,
  exchangeRates,
  selectedType,
  onTypeChange,
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

  const goldNisab = calculateNisabValue("gold", metalPrices, currency, exchangeRates);
  const silverNisab = calculateNisabValue("silver", metalPrices, currency, exchangeRates);
  const goldPrice = convertPriceToCurrency(
    metalPrices.goldPerGram,
    metalPrices.currency,
    currency,
    exchangeRates
  );
  const silverPrice = convertPriceToCurrency(
    metalPrices.silverPerGram,
    metalPrices.currency,
    currency,
    exchangeRates
  );

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
      : metalPrices.source === "manual"
      ? pickText(locale, { ar: "يدوي", fr: "Manuel", en: "Manual" })
      : pickText(locale, { ar: "احتياطي", fr: "Fallback", en: "Fallback" });

  const sourceColor =
    metalPrices.source === "live"
      ? "bg-green-medium"
      : metalPrices.source === "cached"
      ? "bg-gold"
      : metalPrices.source === "manual"
      ? "bg-green-deep"
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
        <button
          type="button"
          onClick={() => onTypeChange("gold")}
          aria-pressed={selectedType === "gold"}
          className={`bg-white rounded-xl p-3 border-2 text-start transition-colors ${
            selectedType === "gold" ? "border-gold" : "border-gold/20"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AppIcon name="coins" className="h-4 w-4 text-gold" />
            <span className="text-xs font-cairo text-green-deep/60">
              {pickText(locale, { ar: "ذهب", fr: "Or", en: "Gold" })} (85g)
            </span>
          </div>
          <p className="font-lato font-bold text-green-deep text-sm" dir="ltr">
            {formatPrice(goldNisab)} {currency}
          </p>
          <p className="text-[10px] text-green-deep/40 font-lato mt-0.5" dir="ltr">
            {formatPrice(goldPrice)} {currency}/g
          </p>
        </button>

        <button
          type="button"
          onClick={() => onTypeChange("silver")}
          aria-pressed={selectedType === "silver"}
          className={`bg-white rounded-xl p-3 border-2 text-start transition-colors ${
            selectedType === "silver" ? "border-gold" : "border-green-deep/10"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <AppIcon name="scale" className="h-4 w-4 text-green-deep/60" />
            <span className="text-xs font-cairo text-green-deep/60">
              {pickText(locale, { ar: "فضة", fr: "Argent", en: "Silver" })} (595g)
            </span>
          </div>
          <p className="font-lato font-bold text-green-deep text-sm" dir="ltr">
            {formatPrice(silverNisab)} {currency}
          </p>
          <p className="text-[10px] text-green-deep/40 font-lato mt-0.5" dir="ltr">
            {formatPrice(silverPrice)} {currency}/g
          </p>
        </button>
      </div>
      <p className="mt-3 text-xs font-cairo text-green-deep/55">
        {pickText(locale, {
          ar: "اختر معيار النصاب الذي تتبعه؛ الاختيار مستقل عن المذهب.",
          fr: "Choisissez le r\u00e9f\u00e9rentiel du nisab que vous suivez; ce choix est distinct de l'\u00e9cole juridique.",
          en: "Choose the nisab reference you follow; this choice is separate from the legal school.",
        })}
      </p>
    </div>
  );
}
