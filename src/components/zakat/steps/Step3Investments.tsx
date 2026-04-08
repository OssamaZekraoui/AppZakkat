"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";

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
  const isAr = locale === "ar";
  const subtotal =
    assets.halalStocks + assets.islamicFunds + assets.dividends + assets.cryptoHalal;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {isAr ? "الاستثمارات" : "Investissements"}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Halal stocks"
          labelAr="أسهم حلال"
          icon="📈"
          value={assets.halalStocks}
          onChange={(v) => onUpdate("halalStocks", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Islamic funds"
          labelAr="صناديق إسلامية"
          icon="📊"
          value={assets.islamicFunds}
          onChange={(v) => onUpdate("islamicFunds", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Dividends"
          labelAr="أرباح متراكمة"
          icon="💹"
          value={assets.dividends}
          onChange={(v) => onUpdate("dividends", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Crypto (halal)"
          labelAr="عملات رقمية حلال"
          icon="🪙"
          value={assets.cryptoHalal}
          onChange={(v) => onUpdate("cryptoHalal", v)}
          suffix={currency}
          locale={locale}
        />

        {/* Crypto warning */}
        {assets.cryptoHalal > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm">
            <p className="font-cairo text-amber-700">
              {isAr
                ? "⚠️ اختلف العلماء في حكم زكاة العملات الرقمية — استشر عالماً"
                : "⚠️ Les savants divergent sur la Zakat des cryptomonnaies — consultez un savant"}
            </p>
          </div>
        )}
      </div>

      <div className="bg-green-pale/30 rounded-xl p-4 flex items-center justify-between">
        <span className="font-cairo font-bold text-green-deep">
          {isAr ? "المجموع الفرعي" : "Sous-total"}
        </span>
        <span className="font-lato font-bold text-green-deep text-lg" dir="ltr">
          {fmt(subtotal)} {currency}
        </span>
      </div>
    </div>
  );
}
