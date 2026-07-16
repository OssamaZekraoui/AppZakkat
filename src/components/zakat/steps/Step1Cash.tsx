"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

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
  const subtotal = assets.cash + assets.bankAccounts + assets.savings;

  const fmt = (n: number) =>
    n.toLocaleString(numberLocale(locale), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, {
            ar: "الأموال السائلة",
            fr: "Liquidités",
            en: "Cash assets",
          })}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {pickText(locale, {
            ar: "أدخل إجمالي ما تمتلكه في هذه الفئة بتاريخ اليوم",
            fr: "Saisissez le total que vous possédez dans cette catégorie aujourd'hui",
            en: "Enter the total you own in this category as of today",
          })}
        </p>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Cash"
          labelFr="Espèces"
          labelAr="نقد"
          icon="banknote"
          value={assets.cash}
          onChange={(v) => onUpdate("cash", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Bank accounts"
          labelFr="Comptes bancaires"
          labelAr="حسابات بنكية"
          icon="building"
          value={assets.bankAccounts}
          onChange={(v) => onUpdate("bankAccounts", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Savings"
          labelFr="Épargne"
          labelAr="توفير"
          icon="wallet"
          value={assets.savings}
          onChange={(v) => onUpdate("savings", v)}
          suffix={currency}
          locale={locale}
        />
      </div>

      <div className="bg-green-pale/30 rounded-xl p-4 flex items-center justify-between">
        <span className="font-cairo font-bold text-green-deep">
          {pickText(locale, {
            ar: "المجموع الفرعي",
            fr: "Sous-total",
            en: "Subtotal",
          })}
        </span>
        <span className="font-lato font-bold text-green-deep text-lg" dir="ltr">
          {fmt(subtotal)} {currency}
        </span>
      </div>
    </div>
  );
}
