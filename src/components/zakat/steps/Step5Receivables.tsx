"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

interface Step5Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  locale: string;
}

export default function Step5Receivables({
  assets,
  onUpdate,
  currency,
  locale,
}: Step5Props) {
  const subtotal =
    assets.loansGiven + assets.rentalIncome + assets.agriculturalOutput;

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "إيرادات أخرى", fr: "Autres revenus", en: "Other income" })}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput label="Loans given (Qard Hasan)" labelFr="Prêts accordés (Qard Hassan)" labelAr="قروض حسنة ممنوحة" icon="handshake" value={assets.loansGiven} onChange={(v) => onUpdate("loansGiven", v)} suffix={currency} locale={locale} />
        <AssetInput label="Rental income" labelFr="Revenus locatifs accumulés" labelAr="إيرادات إيجارية متراكمة" icon="house" value={assets.rentalIncome} onChange={(v) => onUpdate("rentalIncome", v)} suffix={currency} locale={locale} />
        <AssetInput
          label="Agricultural output"
          labelFr="Production agricole"
          labelAr="إنتاج زراعي"
          icon="wheat"
          value={assets.agriculturalOutput}
          onChange={(v) => onUpdate("agriculturalOutput", v)}
          suffix={currency}
          locale={locale}
          hint={pickText(locale, {
            ar: "الزكاة الزراعية لا تشترط الحول — 5% مسقي، 10% بعل",
            fr: "La Zakat agricole ne requiert pas le Hawl — 5% irrigué, 10% naturel",
            en: "Agricultural Zakat does not require Hawl — 5% irrigated, 10% naturally watered",
          })}
        />
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
