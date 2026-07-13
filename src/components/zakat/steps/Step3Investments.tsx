"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

interface Step3Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  locale: string;
}

export default function Step3Investments({
  assets,
  onUpdate,
  currency,
  locale,
}: Step3Props) {
  const subtotal =
    assets.halalStocks + assets.islamicFunds + assets.dividends + assets.cryptoHalal;

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "الاستثمارات", fr: "Investissements", en: "Investments" })}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput label="Halal stocks" labelFr="Actions halal" labelAr="أسهم حلال" icon="📈" value={assets.halalStocks} onChange={(v) => onUpdate("halalStocks", v)} suffix={currency} locale={locale} />
        <AssetInput label="Islamic funds" labelFr="Fonds islamiques" labelAr="صناديق إسلامية" icon="📊" value={assets.islamicFunds} onChange={(v) => onUpdate("islamicFunds", v)} suffix={currency} locale={locale} />
        <AssetInput label="Dividends" labelFr="Dividendes" labelAr="أرباح متراكمة" icon="💹" value={assets.dividends} onChange={(v) => onUpdate("dividends", v)} suffix={currency} locale={locale} />
        <AssetInput label="Crypto (halal)" labelFr="Crypto halal" labelAr="عملات رقمية حلال" icon="🪙" value={assets.cryptoHalal} onChange={(v) => onUpdate("cryptoHalal", v)} suffix={currency} locale={locale} />

        {assets.cryptoHalal > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
            <p className="font-cairo text-amber-700">
              {pickText(locale, {
                ar: "⚠️ اختلف العلماء في حكم زكاة العملات الرقمية — استشر عالماً",
                fr: "⚠️ Les savants divergent sur la Zakat des cryptomonnaies — consultez un savant",
                en: "⚠️ Scholars differ on Zakat for cryptocurrencies — consult a scholar",
              })}
            </p>
          </div>
        )}
      </div>

      <div className="bg-green-pale/30 rounded-xl p-4 flex items-center justify-between">
        <span className="font-cairo font-bold text-green-deep">
          {pickText(locale, { ar: "المجموع الفرعي", fr: "Sous-total", en: "Subtotal" })}
        </span>
        <span className="font-lato font-bold text-green-deep text-lg" dir="ltr">
          {fmt(subtotal)} {currency}
        </span>
      </div>
    </div>
  );
}
