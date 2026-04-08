"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

// Demo data — will be replaced by API calls
const demoCauses = [
  {
    id: "1",
    titleAr: "علاج طفل مصاب بمرض نادر",
    category: "PERSONAL",
    categoryIcon: "🤝",
    country: "المغرب 🇲🇦",
    targetAmount: 25000,
    currentAmount: 18500,
    iban: "MA76 1234 5678 9012 3456 7890 12",
    referenceCode: "DY-2026-0012",
    isUrgent: true,
  },
  {
    id: "2",
    titleAr: "بناء مسجد في قرية نائية",
    category: "RELIGIOUS",
    categoryIcon: "🕌",
    country: "الجزائر 🇩🇿",
    targetAmount: 50000,
    currentAmount: 32000,
    iban: "DZ58 0001 2345 6789 0123 4567",
    referenceCode: "DY-2026-0008",
    isUrgent: false,
  },
  {
    id: "3",
    titleAr: "زكاة المال لعائلات محتاجة",
    category: "ZAKAT",
    categoryIcon: "🌙",
    country: "تونس 🇹🇳",
    targetAmount: 15000,
    currentAmount: 4200,
    iban: "TN59 1000 6035 1835 9847 8831",
    referenceCode: "DY-2026-0021",
    isUrgent: true,
  },
];

export default function ActiveCauses() {
  const t = useTranslations("causes");

  return (
    <section id="requests" className="py-16 sm:py-24 px-4 bg-white-off">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-green-deep font-amiri text-3xl sm:text-4xl font-bold text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoCauses.map((cause) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="/demandes"
            className="inline-block px-8 py-3 bg-green-medium hover:bg-green-deep text-white font-cairo font-bold rounded-xl transition-colors min-h-[44px]"
          >
            {t("viewAll")}
          </a>
        </div>
      </div>
    </section>
  );
}

function CauseCard({
  cause,
}: {
  cause: (typeof demoCauses)[number];
}) {
  const t = useTranslations("causes");
  const [copied, setCopied] = useState(false);

  const progress = Math.round((cause.currentAmount / cause.targetAmount) * 100);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cause.iban.replace(/\s/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-green-pale/30 overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{cause.categoryIcon}</span>
          {cause.isUrgent && (
            <span className="bg-red-100 text-red-700 text-xs font-cairo font-bold px-3 py-1 rounded-full">
              {t("urgent")}
            </span>
          )}
        </div>

        <h3 className="text-green-deep font-cairo font-bold text-lg leading-relaxed mb-2">
          {cause.titleAr}
        </h3>

        <p className="text-gray-500 font-cairo text-sm">
          📍 {cause.country}
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between text-sm font-cairo mb-1">
          <span className="text-green-medium font-bold">
            {t("raised")} {cause.currentAmount.toLocaleString()}
          </span>
          <span className="text-gray-400">
            {t("of")} {cause.targetAmount.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2 bg-green-pale rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-medium to-gold rounded-full transition-all"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-end text-xs text-gray-400 mt-1 font-lato">{progress}%</p>
      </div>

      {/* RIB Block */}
      <div className="mx-4 mb-4 bg-cream border-2 border-dashed border-gold/40 rounded-xl p-4">
        <p className="text-green-deep font-cairo text-sm font-bold mb-2">
          🏦 {t("donateViaTransfer")}
        </p>
        <p className="font-mono text-sm text-gray-700 bg-white rounded-lg px-3 py-2 mb-2 break-all select-all">
          {cause.iban}
        </p>
        <button
          onClick={handleCopy}
          className="w-full py-2 bg-gold/10 hover:bg-gold/20 text-gold-light font-cairo text-sm font-bold rounded-lg transition-colors min-h-[44px] flex items-center justify-center gap-2"
        >
          {copied ? (
            <>✅ {t("copied")}</>
          ) : (
            <>📋 {t("copyRib")}</>
          )}
        </button>
        <p className="text-gray-500 text-xs font-cairo mt-2">
          {t("reference")}: <span className="font-mono font-bold text-green-medium">{cause.referenceCode}</span>
        </p>
      </div>
    </div>
  );
}
