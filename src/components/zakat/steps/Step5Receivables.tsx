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
  const subtotal = assets.loansGiven + assets.rentalIncome;

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
        <AssetInput label="Recoverable loans given" labelFr="Prêts dont le remboursement est probable" labelAr="قروض مرجوة السداد" icon="handshake" value={assets.loansGiven} onChange={(v) => onUpdate("loansGiven", v)} suffix={currency} locale={locale} />
        <AssetInput label="Rental income" labelFr="Revenus locatifs accumulés" labelAr="إيرادات إيجارية متراكمة" icon="house" value={assets.rentalIncome} onChange={(v) => onUpdate("rentalIncome", v)} suffix={currency} locale={locale} />
      </div>

      <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-cairo text-amber-800">
        {pickText(locale, {
          ar: "زكاة الزروع والثمار لها نصاب وطريقة حساب مستقلان، لذلك لا تدخل في حاسبة زكاة المال هذه.",
          fr: "La Zakat agricole poss\u00e8de un nisab et des r\u00e8gles d'irrigation propres; elle n'est pas incluse dans ce calcul de patrimoine.",
          en: "Agricultural Zakat has its own nisab and irrigation rules, so it is not included in this wealth calculation.",
        })}
      </p>

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
