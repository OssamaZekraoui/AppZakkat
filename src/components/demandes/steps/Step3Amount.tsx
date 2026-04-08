"use client";

import type { RequestFormData, AmountBreakdown, Currency, RequestCategory } from "@/types/demandes";

interface Step3Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
}

const CURRENCY_OPTIONS: { value: Currency; label: string; flag: string }[] = [
  { value: "MAD", label: "MAD", flag: "🇲🇦" },
  { value: "EUR", label: "EUR", flag: "🇪🇺" },
  { value: "USD", label: "USD", flag: "🇺🇸" },
  { value: "GBP", label: "GBP", flag: "🇬🇧" },
];

const DURATION_OPTIONS = [
  { days: 30, labelAr: "٣٠ يوماً", labelFr: "30 jours" },
  { days: 60, labelAr: "٦٠ يوماً", labelFr: "60 jours" },
  { days: 90, labelAr: "٩٠ يوماً", labelFr: "90 jours" },
  { days: 0, labelAr: "بدون حد", labelFr: "Sans limite" },
];

const BREAKDOWN_SUGGESTIONS: Partial<Record<RequestCategory, string[]>> = {
  MEDICAL: ["تكلفة العملية", "أدوية", "إقامة المستشفى", "نقل المريض"],
  EDUCATION: ["الرسوم الدراسية", "الكتب والأدوات", "التنقل", "السكن"],
  RELIGIOUS: ["مواد البناء", "أجرة العمال", "التجهيزات", "الترخيص"],
  FUNERAL: ["تجهيز الجنازة", "نقل الجثمان", "مصاريف الدفن"],
};

export default function Step3Amount({
  data,
  onChange,
  errors,
  locale,
}: Step3Props) {
  const isAr = locale === "ar";
  const breakdown = (data.breakdown || []) as AmountBreakdown[];
  const breakdownTotal = breakdown.reduce((s, b) => s + (b.amount || 0), 0);
  const suggestions = BREAKDOWN_SUGGESTIONS[data.category as RequestCategory] || [];

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", { maximumFractionDigits: 0 });

  const addLine = () => {
    onChange("breakdown", [...breakdown, { label: "", amount: 0 }]);
  };

  const updateLine = (index: number, field: keyof AmountBreakdown, value: unknown) => {
    const updated = [...breakdown];
    updated[index] = { ...updated[index], [field]: value };
    onChange("breakdown", updated);
  };

  const removeLine = (index: number) => {
    onChange("breakdown", breakdown.filter((_, i) => i !== index));
  };

  const addSuggestion = (label: string) => {
    if (!breakdown.some((b) => b.label === label)) {
      onChange("breakdown", [...breakdown, { label, amount: 0 }]);
    }
  };

  const setDeadlineDays = (days: number) => {
    if (days === 0) {
      onChange("deadline", null);
    } else {
      const d = new Date();
      d.setDate(d.getDate() + days);
      onChange("deadline", d.toISOString().split("T")[0]);
    }
  };

  const currentDuration = () => {
    if (!data.deadline) return 0;
    const diff = Math.round(
      (new Date(data.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diff <= 35) return 30;
    if (diff <= 65) return 60;
    if (diff <= 95) return 90;
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "المبلغ المطلوب" : "Montant demandé"}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Amount + currency */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "المبلغ المستهدف" : "Montant cible"} *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min={100}
              value={data.targetAmount || ""}
              onChange={(e) => onChange("targetAmount", parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="flex-1 px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato text-lg
                         focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              dir="ltr"
            />
            <div className="flex gap-1">
              {CURRENCY_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onChange("currency", c.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    data.currency === c.value
                      ? "bg-gold text-green-deep shadow"
                      : "bg-white text-green-deep/50 border border-green-deep/10"
                  }`}
                >
                  <span>{c.flag}</span> <span className="font-lato">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
          {errors.targetAmount && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.targetAmount}</p>
          )}
        </div>

        {/* Breakdown */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-2">
            {isAr ? "تفصيل المصاريف" : "Ventilation des dépenses"} *
          </label>

          {/* Suggestions */}
          {suggestions.length > 0 && breakdown.length === 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => addSuggestion(s)}
                  className="px-3 py-1.5 rounded-lg bg-gold/10 text-xs font-cairo text-green-deep
                             hover:bg-gold/20 transition-colors border border-gold/20"
                >
                  + {s}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-2">
            {breakdown.map((line, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={line.label}
                  onChange={(e) => updateLine(i, "label", e.target.value)}
                  placeholder={isAr ? "البند" : "Poste"}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-green-deep/10 bg-white font-cairo text-sm
                             focus:border-gold outline-none transition-all"
                />
                <input
                  type="number"
                  min={0}
                  value={line.amount || ""}
                  onChange={(e) => updateLine(i, "amount", parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-28 px-3 py-2.5 rounded-lg border border-green-deep/10 bg-white font-lato text-sm
                             focus:border-gold outline-none transition-all
                             [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  dir="ltr"
                />
                <button
                  onClick={() => removeLine(i)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addLine}
            className="mt-2 px-4 py-2 rounded-lg border-2 border-dashed border-green-deep/15 text-sm font-cairo
                       text-green-deep/50 hover:border-green-deep/30 hover:text-green-deep transition-all w-full"
          >
            {isAr ? "+ إضافة بند" : "+ Ajouter un poste"}
          </button>

          {/* Total vs target */}
          {breakdown.length > 0 && (
            <div
              className={`mt-3 p-3 rounded-xl text-sm flex items-center justify-between ${
                breakdownTotal === (data.targetAmount || 0)
                  ? "bg-green-pale/30 text-green-deep"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              <span className="font-cairo font-bold">
                {isAr ? "مجموع البنود" : "Total postes"}
              </span>
              <span className="font-lato font-bold" dir="ltr">
                {fmt(breakdownTotal)} / {fmt(data.targetAmount || 0)} {data.currency}
              </span>
            </div>
          )}

          {errors.breakdown && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.breakdown}</p>
          )}
        </div>

        {/* Duration */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-2">
            {isAr ? "مدة الجمع" : "Durée de collecte"}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map((opt) => (
              <button
                key={opt.days}
                onClick={() => setDeadlineDays(opt.days)}
                className={`py-2.5 rounded-xl text-sm font-cairo font-bold transition-all ${
                  currentDuration() === opt.days
                    ? "bg-gold text-green-deep shadow"
                    : "bg-white text-green-deep/50 border border-green-deep/10 hover:border-green-deep/20"
                }`}
              >
                {isAr ? opt.labelAr : opt.labelFr}
              </button>
            ))}
          </div>
          {data.deadline === null && (
            <p className="mt-2 text-xs font-cairo text-green-deep/40">
              {isAr
                ? "سيتم الإغلاق يدوياً من طرفك أو الإدارة"
                : "La collecte sera clôturée manuellement par vous ou l'administration"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
