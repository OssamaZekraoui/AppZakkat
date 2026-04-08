"use client";

import type { Currency, ZakatAssets, MetalPrices, ZakatSchool } from "@/lib/zakat/types";
import { SCHOOL_RULES } from "@/lib/zakat/schools";
import AssetInput from "../ui/AssetInput";

interface Step2Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  metalPrices: MetalPrices | null;
  exchangeRates: Record<Currency, number>;
  school: ZakatSchool;
  locale: string;
}

export default function Step2Metals({
  assets,
  onUpdate,
  currency,
  metalPrices,
  exchangeRates,
  school,
  locale,
}: Step2Props) {
  const isAr = locale === "ar";
  const rules = SCHOOL_RULES[school];
  const rate = exchangeRates[currency] || 1;
  const goldPrice = (metalPrices?.goldPerGram ?? 0) * rate;
  const silverPrice = (metalPrices?.silverPerGram ?? 0) * rate;

  const goldValue = assets.goldGrams * goldPrice;
  const silverValue = assets.silverGrams * silverPrice;
  const jewelryValue = assets.goldJewelryGrams * goldPrice;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {isAr ? "الذهب والفضة" : "Or et Argent"}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Gold */}
        <AssetInput
          label="Gold (grams)"
          labelAr="ذهب (غرام)"
          icon="🥇"
          value={assets.goldGrams}
          onChange={(v) => onUpdate("goldGrams", v)}
          suffix={isAr ? "غ" : "g"}
          locale={locale}
        />
        {assets.goldGrams > 0 && (
          <div className="bg-gold/5 rounded-lg px-4 py-2 text-sm font-lato text-green-deep/60 -mt-2" dir="ltr">
            = {fmt(goldValue)} {currency}
          </div>
        )}

        {/* Gold jewelry */}
        <AssetInput
          label="Gold jewelry (grams)"
          labelAr="حلي ذهبية (غرام)"
          icon="💍"
          value={assets.goldJewelryGrams}
          onChange={(v) => onUpdate("goldJewelryGrams", v)}
          suffix={isAr ? "غ" : "g"}
          locale={locale}
          hint={
            rules.goldJewelryZakatable
              ? isAr
                ? "تُزكى الحلي في هذا المذهب"
                : "Les bijoux sont zakatables dans cette école"
              : isAr
              ? "لا تُزكى الحلي في هذا المذهب"
              : "Les bijoux ne sont PAS zakatables dans cette école"
          }
        />
        {assets.goldJewelryGrams > 0 && (
          <div
            className={`rounded-lg px-4 py-2 text-sm font-lato -mt-2 ${
              rules.goldJewelryZakatable
                ? "bg-gold/5 text-green-deep/60"
                : "bg-gray-100 text-gray-400 line-through"
            }`}
            dir="ltr"
          >
            = {fmt(jewelryValue)} {currency}
            {!rules.goldJewelryZakatable && (
              <span className="text-xs no-underline ms-2">
                ({isAr ? "غير محتسبة" : "non comptée"})
              </span>
            )}
          </div>
        )}

        {/* Silver */}
        <AssetInput
          label="Silver (grams)"
          labelAr="فضة (غرام)"
          icon="🥈"
          value={assets.silverGrams}
          onChange={(v) => onUpdate("silverGrams", v)}
          suffix={isAr ? "غ" : "g"}
          locale={locale}
        />
        {assets.silverGrams > 0 && (
          <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm font-lato text-green-deep/60 -mt-2" dir="ltr">
            = {fmt(silverValue)} {currency}
          </div>
        )}
      </div>
    </div>
  );
}
