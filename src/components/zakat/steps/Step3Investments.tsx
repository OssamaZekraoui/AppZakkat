"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";
import AppIcon from "@/components/ui/AppIcon";

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
        <AssetInput
          label="Zakatable portion of stocks"
          labelFr="Part zakatable des actions"
          labelAr="الجزء الخاضع للزكاة من الأسهم"
          icon="chart"
          value={assets.halalStocks}
          onChange={(v) => onUpdate("halalStocks", v)}
          suffix={currency}
          locale={locale}
          hint={pickText(locale, {
            ar: "للمتاجرة: القيمة السوقية كاملة. للاستثمار الطويل: صافي الأصول الزكوية للشركات.",
            fr: "Revente: valeur marchande compl\u00e8te. Long terme: votre part des actifs zakatables des soci\u00e9t\u00e9s.",
            en: "Trading: full market value. Long term: your share of the companies' zakatable assets.",
          })}
        />
        <AssetInput
          label="Zakatable portion of Islamic funds"
          labelFr="Part zakatable des fonds islamiques"
          labelAr="الجزء الخاضع للزكاة من الصناديق الإسلامية"
          icon="chart-pie"
          value={assets.islamicFunds}
          onChange={(v) => onUpdate("islamicFunds", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput label="Dividends" labelFr="Dividendes" labelAr="أرباح متراكمة" icon="circle-dollar" value={assets.dividends} onChange={(v) => onUpdate("dividends", v)} suffix={currency} locale={locale} />
        <AssetInput label="Crypto (halal)" labelFr="Crypto halal" labelAr="عملات رقمية حلال" icon="bitcoin" value={assets.cryptoHalal} onChange={(v) => onUpdate("cryptoHalal", v)} suffix={currency} locale={locale} />

        {assets.cryptoHalal > 0 && (
          <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">
            <AppIcon name="alert" className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p className="font-cairo text-amber-700">
              {pickText(locale, {
                ar: "اختلف العلماء في حكم زكاة العملات الرقمية — استشر عالماً",
                fr: "Les savants divergent sur la Zakat des cryptomonnaies — consultez un savant",
                en: "Scholars differ on Zakat for cryptocurrencies — consult a scholar",
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
