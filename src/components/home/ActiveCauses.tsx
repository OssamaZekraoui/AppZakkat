"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

// Demo data — will be replaced by API calls
const demoCauses = [
  {
    id: "1",
    titleAr: "علاج طفل مصاب بمرض نادر",
    category: "PERSONAL",
    categoryIcon: "handshake" as AppIconName,
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
    categoryIcon: "landmark" as AppIconName,
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
    categoryIcon: "moon" as AppIconName,
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
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const numberLocale = locale === "ar" ? "ar-MA" : locale === "en" ? "en-GB" : "fr-FR";

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
    <div className="overflow-hidden rounded-lg border border-green-pale/30 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-pale/70 text-green-deep">
            <AppIcon name={cause.categoryIcon} className="h-6 w-6" />
          </span>
          {cause.isUrgent && (
            <span className="bg-red-100 text-red-700 text-xs font-cairo font-bold px-3 py-1 rounded-full">
              {t("urgent")}
            </span>
          )}
        </div>

        <h3 className="text-green-deep font-cairo font-bold text-lg leading-relaxed mb-2">
          {cause.titleAr}
        </h3>

        <p className="flex items-center gap-1.5 text-sm text-gray-500 font-cairo">
          <AppIcon name="location" className="h-4 w-4 shrink-0" />
          {cause.country}
        </p>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between text-sm font-cairo mb-1">
          <span className="text-green-medium font-bold">
            {t("raised")} {cause.currentAmount.toLocaleString(numberLocale)}
          </span>
          <span className="text-gray-400">
            {t("of")} {cause.targetAmount.toLocaleString(numberLocale)}
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
        <p className="mb-2 flex items-center gap-2 text-sm font-bold text-green-deep font-cairo">
          <AppIcon name="building" className="h-4 w-4" />
          {t("donateViaTransfer")}
        </p>
        <p className="font-mono text-sm text-gray-700 bg-white rounded-lg px-3 py-2 mb-2 break-all select-all">
          {cause.iban}
        </p>
        <button
          onClick={handleCopy}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-gold/10 py-2 text-sm font-bold text-gold-light transition-colors hover:bg-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold font-cairo"
        >
          <AppIcon name={copied ? "check" : "copy"} className="h-4 w-4" />
          {copied ? t("copied") : t("copyRib")}
        </button>
        <p className="text-gray-500 text-xs font-cairo mt-2">
          {t("reference")}: <span className="font-mono font-bold text-green-medium">{cause.referenceCode}</span>
        </p>
      </div>
    </div>
  );
}
