"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/types/demandes";
import type { RequestVerificationSummary } from "@/types/verification";
import AIVerificationPanel from "@/components/admin/AIVerificationPanel";
import { adminText, getAdminLocale, labelFor, statusLabels, urgencyLabels } from "@/lib/adminText";

interface AdminRequestDetail {
  id: string;
  referenceCode: string;
  titleAr: string;
  titleFr?: string;
  descriptionAr: string;
  descriptionFr?: string;
  category: string;
  status: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  country: string;
  city: string;
  displayName: string;
  isAnonymous: boolean;
  contactEmail: string;
  contactPhone?: string;
  iban: string;
  bic: string;
  bankName: string;
  bankCountry?: string;
  urgencyLevel: string;
  breakdown?: Array<{ label: string; amount: number }>;
  documents: Array<{
    id: string;
    filename: string;
    originalName: string;
    url: string;
    category: string;
    mimeType: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-white text-green-deep border border-green-deep/12",
  SUBMITTED: "bg-gold/20 text-green-deep border border-gold/35",
  REVIEW: "bg-amber-50 text-amber-700 border border-amber-200",
  PUBLISHED: "bg-green-pale/75 text-green-deep border border-green-light/20",
  REJECTED: "bg-red-50 text-red-700 border border-red-200",
  CLOSED: "bg-white text-green-deep/48 border border-green-deep/10",
};

const URGENCY_CONFIG: Record<string, { color: string }> = {
  NORMAL: { color: "bg-white text-green-deep border border-green-deep/12" },
  URGENT: { color: "bg-amber-50 text-amber-700 border border-amber-200" },
  CRITICAL: { color: "bg-red-50 text-red-700 border border-red-200" },
};

export default function AdminRequestReviewPage() {
  const rawLocale = useLocale();
  const locale = getAdminLocale(rawLocale);
  const t = adminText[locale];
  const isAr = locale === "ar";
  const params = useParams();
  const id = params.id as string;

  const [request, setRequest] = useState<AdminRequestDetail | null>(null);
  const [verification, setVerification] = useState<RequestVerificationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [reqRes, verRes] = await Promise.all([
          fetch(`/api/admin/demandes/${id}`),
          fetch(`/api/documents/verify?requestId=${id}`),
        ]);
        if (reqRes.ok) {
          const data = await reqRes.json();
          setRequest(data);
        }
        if (verRes.ok) {
          const data = await verRes.json();
          if (data.documentResults?.length > 0) {
            setVerification(data);
          }
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleReview = async (decision: "APPROVED" | "REJECTED") => {
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/admin/demandes/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, note: reviewNote }),
      });
      if (res.ok) {
        setReviewResult(decision);
        if (request) {
          setRequest({
            ...request,
            status: decision === "APPROVED" ? "PUBLISHED" : "REJECTED",
          });
        }
      }
    } catch {
      // ignore
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse space-y-6">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded-xl" />
        <div className="h-48 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-16">
        <p className="font-cairo text-green-deep/45 text-lg">{t.notFound}</p>
        <Link
          href="/admin/demandes"
          className="inline-block mt-4 text-gold hover:text-green-deep font-cairo text-sm"
        >
          {t.backToList}
        </Link>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.value === request.category);
  const urgency = URGENCY_CONFIG[request.urgencyLevel] || URGENCY_CONFIG.NORMAL;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/demandes"
          className="inline-flex items-center gap-2 rounded-full border border-green-deep/10 bg-white px-4 py-2 font-cairo text-sm font-bold text-green-deep shadow-sm transition hover:border-gold/45 hover:bg-green-pale/35"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t.backToList}
        </Link>
        <div className="flex items-center gap-2">
          {request.urgencyLevel && request.urgencyLevel !== "NORMAL" && (
            <span
              className={`text-[10px] font-bold font-cairo px-3 py-1 rounded-full ${urgency.color}`}
            >
              {labelFor(urgencyLabels, request.urgencyLevel, locale)}
            </span>
          )}
          <span
            className={`text-xs font-bold font-cairo px-3 py-1 rounded-full ${STATUS_COLORS[request.status] || ""}`}
          >
            {labelFor(statusLabels, request.status, locale)}
          </span>
        </div>
      </div>

      {/* Request summary */}
      <div className="bg-white rounded-3xl border border-green-deep/8 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{cat?.icon}</span>
          <div className="flex-1">
            <h1 className="font-amiri text-xl font-bold text-green-deep">
              {request.titleAr}
            </h1>
            {request.titleFr && (
              <p className="font-cairo text-sm text-gray-400">{request.titleFr}</p>
            )}
          </div>
        </div>

        {/* Key info grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="font-cairo text-[10px] text-gray-400 mb-0.5">
              {t.reference}
            </p>
            <p className="font-lato text-sm font-bold text-green-deep">
              {request.referenceCode}
            </p>
          </div>
          <div>
            <p className="font-cairo text-[10px] text-gray-400 mb-0.5">
              {t.amount}
            </p>
            <p className="font-lato text-sm font-bold text-green-deep" dir="ltr">
              {request.targetAmount?.toLocaleString()} {request.currency}
            </p>
          </div>
          <div>
            <p className="font-cairo text-[10px] text-gray-400 mb-0.5">
              {t.location}
            </p>
            <p className="font-cairo text-sm text-green-deep">
              {request.city}, {request.country}
            </p>
          </div>
          <div>
            <p className="font-cairo text-[10px] text-gray-400 mb-0.5">
              {t.requester}
            </p>
            <p className="font-cairo text-sm text-green-deep">
              {request.isAnonymous ? t.anonymous : request.displayName}
            </p>
          </div>
        </div>

        {/* Submission date */}
        <div className="mb-4">
          <p className="font-cairo text-[10px] text-gray-400 mb-0.5">
            {t.submittedAt}
          </p>
          <p className="font-lato text-sm text-green-deep">
            {new Date(request.createdAt).toLocaleDateString(isAr ? "ar-MA" : "fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Description */}
        <div className="border-t border-gray-100 pt-4">
          <p className="font-cairo text-[10px] text-gray-400 mb-1">
            {t.description}
          </p>
          <p className="font-cairo text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {request.descriptionAr}
          </p>
          {request.descriptionFr && (
            <p className="font-cairo text-sm text-gray-400 leading-relaxed mt-2 whitespace-pre-wrap">
              {request.descriptionFr}
            </p>
          )}
        </div>

        {/* Amount Breakdown */}
        {request.breakdown && request.breakdown.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="font-cairo text-[10px] text-gray-400 mb-2">
              {t.breakdown}
            </p>
            <div className="space-y-1.5">
              {request.breakdown.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                >
                  <span className="font-cairo text-xs text-green-deep">{item.label}</span>
                  <span className="font-lato text-xs font-bold text-green-deep" dir="ltr">
                    {item.amount.toLocaleString()} {request.currency}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between bg-green-deep/5 rounded-lg px-3 py-2 border border-green-deep/10">
                <span className="font-cairo text-xs font-bold text-green-deep">
                  {t.total}
                </span>
                <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
                  {request.targetAmount.toLocaleString()} {request.currency}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact info */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <p className="font-cairo text-[10px] text-gray-400 mb-2">
            {t.bankingInfo}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-gray-400 font-cairo">IBAN</span>
              <p className="font-lato text-xs text-green-deep" dir="ltr">
                {request.iban}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-cairo">BIC</span>
              <p className="font-lato text-xs text-green-deep" dir="ltr">
                {request.bic}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-cairo">
                {t.bank}
              </span>
              <p className="font-cairo text-xs text-green-deep">{request.bankName}</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-cairo">
                {t.email}
              </span>
              <p className="font-lato text-xs text-green-deep">{request.contactEmail}</p>
            </div>
            {request.contactPhone && (
              <div>
                <span className="text-[10px] text-gray-400 font-cairo">
                  {t.phone}
                </span>
                <p className="font-lato text-xs text-green-deep" dir="ltr">
                  {request.contactPhone}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        {request.documents && request.documents.length > 0 && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <p className="font-cairo text-[10px] text-gray-400 mb-2">
              {t.documents} ({request.documents.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {request.documents.map((doc) => (
                <a
                  key={doc.id}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-50 rounded-lg p-3 flex items-center gap-3 hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    {doc.mimeType?.startsWith("image/") ? (
                      <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-cairo text-xs text-green-deep truncate group-hover:text-gold transition-colors">
                      {doc.originalName}
                    </p>
                    <p className="font-lato text-[10px] text-gray-400">
                      {doc.category} &middot; {(doc.size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-gold transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Verification Panel */}
      {verification && (
        <AIVerificationPanel verification={verification} locale={locale} />
      )}

      {/* Review actions */}
      {(request.status === "SUBMITTED" || request.status === "REVIEW") && !reviewResult && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-amiri text-lg font-bold text-green-deep mb-4">
            {t.reviewDecision}
          </h3>
          <textarea
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder={t.reviewNotesPlaceholder}
            className="w-full rounded-xl border border-gray-200 p-4 font-cairo text-sm text-green-deep resize-none h-24 focus:outline-none focus:border-gold/50 mb-4"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleReview("APPROVED")}
              disabled={submittingReview}
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-cairo font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t.approve}
            </button>
            <button
              onClick={() => handleReview("REJECTED")}
              disabled={submittingReview}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-cairo font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {t.reject}
            </button>
          </div>
        </div>
      )}

      {/* Review result */}
      {reviewResult && (
        <div
          className={`rounded-2xl p-6 text-center ${
            reviewResult === "APPROVED"
              ? "bg-emerald-50 border border-emerald-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <div className={`w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center ${
            reviewResult === "APPROVED" ? "bg-emerald-100" : "bg-red-100"
          }`}>
            {reviewResult === "APPROVED" ? (
              <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <p
            className={`font-cairo font-bold text-lg ${
              reviewResult === "APPROVED" ? "text-emerald-700" : "text-red-600"
            }`}
          >
            {reviewResult === "APPROVED" ? t.approved : t.rejected}
          </p>
          <Link
            href="/admin/demandes"
            className="inline-block mt-3 text-sm font-cairo text-gray-400 hover:text-green-deep transition-colors"
          >
            {t.backToList}
          </Link>
        </div>
      )}
    </div>
  );
}
