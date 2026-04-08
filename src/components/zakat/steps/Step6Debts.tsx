"use client";

import type { Currency, ZakatAssets } from "@/lib/zakat/types";
import AssetInput from "../ui/AssetInput";

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
  const isAr = locale === "ar";

  // Calculate hawl end (354 lunar days)
  let hawlEndStr = "";
  let daysLeft = 0;
  let hawlCompleted = false;

  if (hawlStart) {
    const start = new Date(hawlStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 354);
    hawlEndStr = end.toLocaleDateString(isAr ? "ar-MA" : "fr-FR");

    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    hawlCompleted = diff >= 354;
    daysLeft = hawlCompleted ? 0 : 354 - diff;
  }

  // Hijri date display
  let hijriDate = "";
  if (hawlStart) {
    try {
      const start = new Date(hawlStart);
      const end = new Date(start);
      end.setDate(end.getDate() + 354);
      hijriDate = end.toLocaleDateString(isAr ? "ar-SA" : "fr-FR", {
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
          {isAr ? "الديون والخصومات" : "Dettes et déductions"}
        </h2>
      </div>

      <div className="space-y-4">
        <AssetInput
          label="Short-term debts"
          labelAr="ديون قصيرة الأجل (أقل من سنة)"
          icon="📉"
          value={assets.shortTermDebts}
          onChange={(v) => onUpdate("shortTermDebts", v)}
          suffix={currency}
          locale={locale}
        />
        <AssetInput
          label="Essential expenses"
          labelAr="مصاريف أساسية فورية"
          icon="🏠"
          value={assets.essentialExpenses}
          onChange={(v) => onUpdate("essentialExpenses", v)}
          suffix={currency}
          locale={locale}
          hint={
            isAr
              ? "إيجار، طعام، فواتير مستحقة..."
              : "Loyer, nourriture, factures dues..."
          }
        />
      </div>

      {/* Hawl date */}
      <div className="border-t border-green-deep/10 pt-6">
        <label className="block font-cairo font-bold text-green-deep mb-2">
          {isAr ? "تاريخ بداية الحول" : "Date de début du Hawl"}
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
                {isAr ? "يكتمل الحول في" : "Le Hawl se complète le"} :{" "}
                <span className="font-bold">{hawlEndStr}</span>
              </p>
              {hijriDate && (
                <p className="font-cairo text-xs text-green-deep/50 mt-1">
                  {hijriDate}
                </p>
              )}
              {hawlCompleted ? (
                <p className="font-cairo text-sm text-green-medium font-bold mt-2">
                  {isAr ? "✓ الحول مكتمل" : "✓ Le Hawl est complété"}
                </p>
              ) : (
                <p className="font-cairo text-sm text-orange-600 mt-2">
                  {isAr
                    ? `⏳ ${daysLeft.toLocaleString("ar-MA")} يوماً متبقياً`
                    : `⏳ ${daysLeft} jours restants`}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
