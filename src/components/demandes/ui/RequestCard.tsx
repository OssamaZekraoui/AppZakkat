"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import type { RequestWithStatus } from "@/types/demandes";
import { CATEGORIES } from "@/types/demandes";
import RequestStatusBadge from "./RequestStatusBadge";

interface RequestCardProps {
  request: RequestWithStatus;
  locale: string;
}

export default function RequestCard({ request, locale }: RequestCardProps) {
  const isAr = locale === "ar";
  const [copied, setCopied] = useState(false);

  const cat = CATEGORIES.find((c) => c.value === request.category);
  const progress = request.targetAmount > 0
    ? Math.min(100, Math.round((request.currentAmount / request.targetAmount) * 100))
    : 0;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const copyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(request.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/demandes/${request.id}`} className="block cursor-pointer">
        {/* Header */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat?.icon}</span>
              <span className="font-cairo text-xs text-green-deep/50">
                {isAr ? cat?.labelAr : cat?.labelFr}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {request.urgencyLevel === "CRITICAL" && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo">
                  {isAr ? "حرج" : "Critique"}
                </span>
              )}
              {request.urgencyLevel === "URGENT" && (
                <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-cairo">
                  {isAr ? "عاجل" : "Urgent"}
                </span>
              )}
            </div>
          </div>

          <h3 className="font-amiri text-lg font-bold text-green-deep leading-snug mb-1">
            {request.titleAr}
          </h3>
          {request.titleFr && (
            <p className="font-cairo text-xs text-green-deep/40 mb-2">
              {request.titleFr}
            </p>
          )}

          <div className="flex items-center gap-1 text-xs text-green-deep/50 font-cairo">
            <span>{request.city}, {request.country}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="px-5 pb-3">
          <div className="h-2 bg-green-deep/5 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-green-medium to-gold rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
              {fmt(request.currentAmount)} / {fmt(request.targetAmount)} {request.currency}
            </span>
            <span className="font-lato text-xs text-green-deep/40" dir="ltr">
              {progress}%
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <RequestStatusBadge status={request.status} locale={locale} />
          <span className="font-lato text-[10px] text-green-deep/30">
            {request.referenceCode}
          </span>
        </div>
      </Link>

      {/* IBAN - outside Link to allow copy button interaction */}
      {request.status === "PUBLISHED" && request.iban && (
        <div className="mx-5 mb-4 bg-cream rounded-xl p-3 border border-gold/20">
          <p className="font-cairo text-[10px] text-green-deep/50 mb-1">
            {isAr ? "التبرع بالتحويل البنكي مباشرة" : "Don par virement bancaire direct"}
          </p>
          <div className="flex items-center justify-between gap-2">
            <code className="font-lato text-xs text-green-deep tracking-wider" dir="ltr">
              {request.iban.replace(/(.{4})/g, "$1 ").trim()}
            </code>
            <button
              onClick={copyIBAN}
              className="text-xs font-cairo text-gold hover:text-green-deep transition-colors flex-shrink-0"
            >
              {copied ? (isAr ? "تم ✓" : "Copié ✓") : (isAr ? "نسخ" : "Copier")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
