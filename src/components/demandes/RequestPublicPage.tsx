"use client";

import { useState } from "react";
import type { RequestWithStatus } from "@/types/demandes";
import { CATEGORIES, COUNTRIES } from "@/types/demandes";
import RequestStatusBadge from "./ui/RequestStatusBadge";
import RequestUpdates from "./RequestUpdates";

interface RequestPublicPageProps {
  request: RequestWithStatus;
  locale: string;
}

export default function RequestPublicPage({
  request,
  locale,
}: RequestPublicPageProps) {
  const isAr = locale === "ar";
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const cat = CATEGORIES.find((c) => c.value === request.category);
  const country = COUNTRIES.find((c) => c.code === request.country);
  const progress = request.targetAmount > 0
    ? Math.min(100, Math.round((request.currentAmount / request.targetAmount) * 100))
    : 0;

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", { maximumFractionDigits: 0 });

  const copyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(request.iban);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = isAr
    ? `ساعدوا في قضية "${request.titleAr}" على منصة ضياء`
    : `Aidez la cause "${request.titleAr}" sur Diyae`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xl">{cat?.icon}</span>
          <span className="font-cairo text-xs bg-green-pale/50 text-green-deep px-2.5 py-1 rounded-full font-bold">
            {isAr ? cat?.labelAr : cat?.labelFr}
          </span>
          {request.urgencyLevel === "CRITICAL" && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-cairo">
              {isAr ? "حرج" : "Critique"}
            </span>
          )}
          {request.urgencyLevel === "URGENT" && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-cairo">
              {isAr ? "عاجل" : "Urgent"}
            </span>
          )}
          <RequestStatusBadge status={request.status} locale={locale} />
        </div>

        <h1 className="font-amiri text-2xl md:text-3xl font-bold text-green-deep leading-snug mb-1">
          {request.titleAr}
        </h1>
        {request.titleFr && (
          <p className="font-cairo text-sm text-green-deep/40 mb-3">{request.titleFr}</p>
        )}

        <div className="flex items-center gap-4 text-sm font-cairo text-green-deep/50">
          <span>
            📍 {request.city}, {country?.flag} {isAr ? country?.labelAr : country?.labelFr}
          </span>
          <span>
            📅 {new Date(request.createdAt).toLocaleDateString(isAr ? "ar-MA" : "fr-FR")}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-green-deep/10 p-5">
        <div className="h-3 bg-green-deep/5 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-green-medium to-gold rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-lato text-2xl font-bold text-green-deep" dir="ltr">
              {fmt(request.currentAmount)} <span className="text-sm text-green-deep/50">{request.currency}</span>
            </p>
            <p className="font-cairo text-xs text-green-deep/40">
              {isAr ? "تم جمعه من" : "collecté sur"}{" "}
              <span className="font-bold">{fmt(request.targetAmount)} {request.currency}</span>
            </p>
          </div>
          <div className="text-end">
            <p className="font-lato text-3xl font-bold text-gold" dir="ltr">{progress}%</p>
          </div>
        </div>
      </div>

      {/* IBAN Block — the most important */}
      <div className="bg-gradient-to-br from-cream to-gold/10 rounded-2xl border-2 border-gold/30 p-6">
        <h3 className="font-cairo font-bold text-green-deep mb-1">
          🏦 {isAr ? "تبرع عبر تحويل بنكي مباشر" : "Don par virement bancaire direct"}
        </h3>
        <p className="font-cairo text-xs text-green-deep/50 mb-4">
          {isAr
            ? "حوّل المبلغ الذي تريد مباشرة إلى هذا الحساب"
            : "Transférez le montant souhaité directement vers ce compte"}
        </p>

        <div className="bg-white rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-cairo text-xs text-green-deep/50">IBAN</span>
            <button
              onClick={copyIBAN}
              className="text-xs font-cairo font-bold text-gold hover:text-green-deep transition-colors"
            >
              {copied ? (isAr ? "تم النسخ ✓" : "Copié ✓") : (isAr ? "نسخ RIB" : "Copier RIB")}
            </button>
          </div>
          <code className="block font-lato text-lg font-bold text-green-deep tracking-widest" dir="ltr">
            {request.iban.replace(/(.{4})/g, "$1 ").trim()}
          </code>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="font-cairo text-xs text-green-deep/40">{isAr ? "صاحب الحساب" : "Titulaire"}</span>
            <p className="font-cairo font-bold text-green-deep">{request.beneficiaryName}</p>
          </div>
          <div>
            <span className="font-cairo text-xs text-green-deep/40">{isAr ? "البنك" : "Banque"}</span>
            <p className="font-cairo font-bold text-green-deep">{request.bankName}</p>
          </div>
        </div>

        {request.referenceCode && (
          <div className="mt-3 pt-3 border-t border-gold/20">
            <span className="font-cairo text-xs text-green-deep/40">
              {isAr ? "مرجع التحويل" : "Référence du virement"}
            </span>
            <p className="font-lato font-bold text-green-deep">{request.referenceCode}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-green-deep/10 p-6">
        <h3 className="font-cairo font-bold text-green-deep mb-3">
          {isAr ? "تفاصيل الوضع" : "Description de la situation"}
        </h3>
        <div className="font-cairo text-sm text-green-deep/70 leading-relaxed whitespace-pre-line">
          {request.descriptionAr}
        </div>
        {request.descriptionFr && (
          <div className="mt-4 pt-4 border-t border-green-deep/5 font-cairo text-sm text-green-deep/50 leading-relaxed whitespace-pre-line">
            {request.descriptionFr}
          </div>
        )}
      </div>

      {/* Breakdown accordion */}
      {request.breakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-green-deep/10 overflow-hidden">
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="w-full p-5 flex items-center justify-between"
          >
            <h3 className="font-cairo font-bold text-green-deep">
              {isAr ? "تفصيل المصاريف" : "Ventilation des dépenses"}
            </h3>
            <span className="text-green-deep/30">{showBreakdown ? "▲" : "▼"}</span>
          </button>
          {showBreakdown && (
            <div className="px-5 pb-5 divide-y divide-green-deep/5">
              {request.breakdown.map((b, i) => (
                <div key={i} className="py-2 flex items-center justify-between">
                  <span className="font-cairo text-sm text-green-deep/70">{b.label}</span>
                  <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
                    {fmt(b.amount)} {request.currency}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Updates */}
      {request.updates.length > 0 && (
        <RequestUpdates updates={request.updates} locale={locale} />
      )}

      {/* Share */}
      <div className="bg-white rounded-2xl border border-green-deep/10 p-5">
        <h3 className="font-cairo font-bold text-green-deep mb-3">
          {isAr ? "شارك هذه القضية" : "Partagez cette cause"}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigator.clipboard.writeText(shareUrl)}
            className="px-4 py-2 rounded-lg bg-green-deep/5 text-sm font-cairo text-green-deep hover:bg-green-deep/10 transition-colors"
          >
            🔗 {isAr ? "نسخ الرابط" : "Copier le lien"}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-green-600/10 text-sm font-cairo text-green-700 hover:bg-green-600/20 transition-colors"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-blue-50 text-sm font-cairo text-blue-600 hover:bg-blue-100 transition-colors"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-gray-50 text-sm font-cairo text-gray-700 hover:bg-gray-100 transition-colors"
          >
            X / Twitter
          </a>
        </div>
      </div>

      {/* Requester info */}
      <div className="text-center py-4">
        <p className="font-cairo text-xs text-green-deep/30">
          {isAr ? "صاحب الطلب" : "Demandeur"} :{" "}
          {request.isAnonymous
            ? isAr ? "مجهول الهوية" : "Anonyme"
            : request.displayName}{" "}
          · {request.referenceCode}
        </p>
      </div>
    </div>
  );
}
