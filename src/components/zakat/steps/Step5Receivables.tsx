"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";

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
  const isAr = locale === "ar";
  const subtotal =
    assets.loansGiven + assets.rentalIncome + assets.agriculturalOutput;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {isAr ? "إيرادات أخرى" : "Autres revenus"}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Loans given (Qard Hassan)"
          labelAr="قروض حسنة ممنوحة"
          icon="🤝"
          value={assets.loansGiven}
          onChange={(v) => onUpdate("loansGiven", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Rental income"
          labelAr="إيرادات إيجارية متراكمة"
          icon="🏠"
          value={assets.rentalIncome}
          onChange={(v) => onUpdate("rentalIncome", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Agricultural output"
          labelAr="إنتاج زراعي"
          icon="🌾"
          value={assets.agriculturalOutput}
          onChange={(v) => onUpdate("agriculturalOutput", v)}
          suffix={currency}
          locale={locale}
          hint={
            isAr
              ? "الزكاة الزراعية لا تشترط الحول — 5% مسقي، 10% بعل"
              : "La Zakat agricole ne requiert pas le Hawl — 5% irrigué, 10% naturel"
          }
        />
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
