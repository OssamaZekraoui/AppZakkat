"use client";

import type { Currency, ZakatAssets, MetalPrices, ZakatSchool } from "@/lib/zakat/types";
import { SCHOOL_RULES } from "@/lib/zakat/schools";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

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
  const rules = SCHOOL_RULES[school];
  const rate = exchangeRates[currency] || 1;
  const goldPrice = (metalPrices?.goldPerGram ?? 0) * rate;
  const silverPrice = (metalPrices?.silverPerGram ?? 0) * rate;

  const goldValue = assets.goldGrams * goldPrice;
  const silverValue = assets.silverGrams * silverPrice;
  const jewelryValue = assets.goldJewelryGrams * goldPrice;

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const gram = pickText(locale, { ar: "غ", fr: "g", en: "g" });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "الذهب والفضة", fr: "Or et argent", en: "Gold and silver" })}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Gold (grams)"
          labelFr="Or (grammes)"
          labelAr="ذهب (غرام)"
          icon="coins"
          value={assets.goldGrams}
          onChange={(v) => onUpdate("goldGrams", v)}
          suffix={gram}
          locale={locale}
        />
        {assets.goldGrams > 0 && (
          <div className="bg-gold/5 rounded-lg px-4 py-2 text-sm font-lato text-green-deep/60 -mt-2" dir="ltr">
            = {fmt(goldValue)} {currency}
          </div>
        )}

        <AssetInput
          label="Gold jewelry (grams)"
          labelFr="Bijoux en or (grammes)"
          labelAr="حلي ذهبية (غرام)"
          icon="gem"
          value={assets.goldJewelryGrams}
          onChange={(v) => onUpdate("goldJewelryGrams", v)}
          suffix={gram}
          locale={locale}
          hint={
            rules.goldJewelryZakatable
              ? pickText(locale, {
                  ar: "تُزكى الحلي في هذا المذهب",
                  fr: "Les bijoux sont zakatables dans cette école",
                  en: "Jewelry is zakatable in this school",
                })
              : pickText(locale, {
                  ar: "لا تُزكى الحلي في هذا المذهب",
                  fr: "Les bijoux ne sont pas zakatables dans cette école",
                  en: "Jewelry is not zakatable in this school",
                })
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
                ({pickText(locale, { ar: "غير محتسبة", fr: "non comptée", en: "not counted" })})
              </span>
            )}
          </div>
        )}

        <AssetInput
          label="Silver (grams)"
          labelFr="Argent (grammes)"
          labelAr="فضة (غرام)"
          icon="scale"
          value={assets.silverGrams}
          onChange={(v) => onUpdate("silverGrams", v)}
          suffix={gram}
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
