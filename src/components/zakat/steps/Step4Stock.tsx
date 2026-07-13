"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

interface Step4Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  locale: string;
}

export default function Step4Stock({
  assets,
  onUpdate,
  currency,
  locale,
}: Step4Props) {
  const subtotal = assets.businessInventory + assets.businessReceivables;

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "عروض التجارة", fr: "Stock commercial", en: "Business assets" })}
        </h2>
      </div>

      <div className="bg-green-pale/20 rounded-xl p-3 text-sm font-cairo text-green-deep/60 mb-2">
        {pickText(locale, {
          ar: "يُقدَّر المال التجاري بقيمته السوقية يوم حلول الزكاة",
          fr: "Le stock commercial est évalué à sa valeur marchande le jour du calcul de la Zakat",
          en: "Business assets are valued at market value on the day Zakat is due",
        })}
      </div>

      <div className="space-y-4">
        <AssetInput label="Business inventory" labelFr="Valeur du stock commercial" labelAr="قيمة المخزون التجاري" icon="📦" value={assets.businessInventory} onChange={(v) => onUpdate("businessInventory", v)} suffix={currency} locale={locale} />
        <AssetInput label="Business receivables" labelFr="Créances commerciales dues" labelAr="ديون تجارية مستحقة لك" icon="📋" value={assets.businessReceivables} onChange={(v) => onUpdate("businessReceivables", v)} suffix={currency} locale={locale} />
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
