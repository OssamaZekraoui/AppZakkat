"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";

interface Step1Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  locale: string;
}

export default function Step1Cash({
  assets,
  onUpdate,
  currency,
  locale,
}: Step1Props) {
  const isAr = locale === "ar";
  const subtotal = assets.cash + assets.bankAccounts + assets.savings;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {isAr ? "الأموال السائلة" : "Liquidités"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "أدخل إجمالي ما تمتلكه في هذه الفئة بتاريخ اليوم"
            : "Saisissez le total de vos liquidités à la date d'aujourd'hui"}
        </p>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Cash"
          labelAr="نقد"
          icon="💵"
          value={assets.cash}
          onChange={(v) => onUpdate("cash", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Bank accounts"
          labelAr="حسابات بنكية"
          icon="🏦"
          value={assets.bankAccounts}
          onChange={(v) => onUpdate("bankAccounts", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Savings"
          labelAr="توفير"
          icon="💰"
          value={assets.savings}
          onChange={(v) => onUpdate("savings", v)}
          suffix={currency}
          locale={locale}
        />
      </div>

      {/* Subtotal */}
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
