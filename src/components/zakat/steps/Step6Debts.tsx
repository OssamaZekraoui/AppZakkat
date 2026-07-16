"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";
import { numberLocale, pickText } from "../zakatText";

interface Step6Props {
  assets: ZakatAssets;
  onUpdate: (field: keyof ZakatAssets, value: number) => void;
  currency: Currency;
  hawlStart: string;
  onHawlStartChange: (date: string) => void;
  locale: string;
}

export default function Step6Debts({
  assets,
  onUpdate,
  currency,
  hawlStart,
  onHawlStartChange,
  locale,
}: Step6Props) {
  let hawlEndStr = "";
  let daysLeft = 0;
  let hawlCompleted = false;

  if (hawlStart) {
    const start = new Date(hawlStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 354);
    hawlEndStr = end.toLocaleDateString(numberLocale(locale));

    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    hawlCompleted = diff >= 354;
    daysLeft = hawlCompleted ? 0 : 354 - diff;
  }

  let hijriDate = "";
  if (hawlStart) {
    try {
      const start = new Date(hawlStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 354);
      hijriDate = end.toLocaleDateString(locale === "ar" ? "ar-SA" : numberLocale(locale), {
        calendar: "islamic",
        year: "numeric",
        month: "long",
        day: "numeric",
      } as Intl.DateTimeFormatOptions);
    } catch {
      // Hijri calendar not supported in all browsers
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="font-amiri text-2xl font-bold text-green-deep">
          {pickText(locale, { ar: "الديون والخصومات", fr: "Dettes et déductions", en: "Debts and deductions" })}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Short-term debts"
          labelFr="Dettes à court terme"
          labelAr="ديون قصيرة الأجل (أقل من سنة)"
          icon="trend-down"
          value={assets.shortTermDebts}
          onChange={(v) => onUpdate("shortTermDebts", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Essential expenses"
          labelFr="Dépenses essentielles"
          labelAr="مصاريف أساسية فورية"
          icon="house"
          value={assets.essentialExpenses}
          onChange={(v) => onUpdate("essentialExpenses", v)}
          suffix={currency}
          locale={locale}
          hint={pickText(locale, {
            ar: "إيجار، طعام، فواتير مستحقة...",
            fr: "Loyer, nourriture, factures dues...",
            en: "Rent, food, due bills...",
          })}
        />
      </div>

      <div className="border-t border-green-deep/10 pt-6">
        <label className="block font-cairo font-bold text-green-deep mb-2">
          {pickText(locale, { ar: "تاريخ بداية الحول", fr: "Date de début du Hawl", en: "Hawl start date" })}
        </label>
        <input
          type="date"
          value={hawlStart}
          onChange={(e) => onHawlStartChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato
                     focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          dir="ltr"
        />

        {hawlStart && (
          <div className="mt-4 space-y-2">
            <div
              className={`rounded-xl p-4 ${
                hawlCompleted
                  ? "bg-green-pale/30 border border-green-medium/20"
                  : "bg-orange-50 border border-orange-200"
              }`}
            >
              <p className="font-cairo text-sm text-green-deep">
                {pickText(locale, {
                  ar: "يكتمل الحول في",
                  fr: "Le Hawl se complète le",
                  en: "Hawl completes on",
                })}{" "}
                : <span className="font-bold">{hawlEndStr}</span>
              </p>
              {hijriDate && (
                <p className="font-cairo text-xs text-green-deep/50 mt-1">
                  {hijriDate}
                </p>
              )}
              {hawlCompleted ? (
                <p className="font-cairo text-sm text-green-medium font-bold mt-2">
                  {pickText(locale, {
                    ar: "✓ الحول مكتمل",
                    fr: "✓ Le Hawl est complété",
                    en: "✓ Hawl is complete",
                  })}
                </p>
              ) : (
                <p className="font-cairo text-sm text-orange-600 mt-2">
                  {pickText(locale, {
                    ar: `⏳ ${daysLeft.toLocaleString("ar-MA")} يوماً متبقياً`,
                    fr: `⏳ ${daysLeft} jours restants`,
                    en: `⏳ ${daysLeft} days remaining`,
                  })}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
