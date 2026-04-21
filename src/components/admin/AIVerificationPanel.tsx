"use client";

import { useState } from "react";
import type {
  RequestVerificationSummary,
  DocumentVerificationResult,
  VerificationFlag,
  DataMismatch,
} from "@/types/verification";

interface AIVerificationPanelProps {
  verification: RequestVerificationSummary;
  locale: string;
}

const SCORE_COLORS = {
  high: "text-emerald-600 bg-emerald-50 border-emerald-200",
  medium: "text-amber-600 bg-amber-50 border-amber-200",
  low: "text-red-600 bg-red-50 border-red-200",
};

const RECOMMENDATION_CONFIG = {
  APPROVE: {
    labelAr: "يُوصى بالموافقة",
    labelFr: "Approbation recommandée",
    labelEn: "Approval recommended",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "\u2713",
  },
  REVIEW: {
    labelAr: "يحتاج مراجعة إضافية",
    labelFr: "Examen supplémentaire requis",
    labelEn: "Additional review needed",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "!",
  },
  REJECT: {
    labelAr: "يُوصى بالرفض",
    labelFr: "Rejet recommandé",
    labelEn: "Rejection recommended",
    color: "bg-red-100 text-red-700 border-red-200",
    icon: "\u2717",
  },
};

const STATUS_LABELS: Record<string, { ar: string; fr: string; en: string }> = {
  verified: { ar: "تم التحقق", fr: "Vérifié", en: "Verified" },
  warning: { ar: "تحذير", fr: "Avertissement", en: "Warning" },
  rejected: { ar: "مرفوض", fr: "Rejeté", en: "Rejected" },
  pending: { ar: "قيد الانتظار", fr: "En attente", en: "Pending" },
};

const STATUS_DOT: Record<string, string> = {
  verified: "bg-emerald-500",
  warning: "bg-amber-500",
  rejected: "bg-red-500",
  pending: "bg-gray-400",
};

function getScoreLevel(score: number) {
  if (score >= 80) return "high";
  if (score >= 50) return "medium";
  return "low";
}

function SeverityBadge({ severity, isAr }: { severity: string; isAr: boolean }) {
  const config: Record<string, { label: string; class: string }> = {
    info: { label: isAr ? "معلومة" : "Info", class: "bg-blue-100 text-blue-600" },
    warning: { label: isAr ? "تحذير" : "Avertissement", class: "bg-amber-100 text-amber-600" },
    error: { label: isAr ? "خطير" : "Critique", class: "bg-red-100 text-red-600" },
    low: { label: isAr ? "منخفض" : "Faible", class: "bg-gray-100 text-gray-600" },
    medium: { label: isAr ? "متوسط" : "Moyen", class: "bg-amber-100 text-amber-600" },
    high: { label: isAr ? "مرتفع" : "Élevé", class: "bg-red-100 text-red-600" },
  };
  const c = config[severity] || config.info;
  return (
    <span className={`text-[10px] font-bold font-cairo px-2 py-0.5 rounded-full ${c.class}`}>
      {c.label}
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const level = getScoreLevel(score);
  const colorMap = { high: "#059669", medium: "#d97706", low: "#dc2626" };
  const strokeColor = colorMap[level];
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-20 h-20">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="6"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          fill="none"
          stroke={strokeColor}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-lato text-lg font-bold text-green-deep">{score}</span>
      </div>
    </div>
  );
}

function DocumentResultCard({
  result,
  isAr,
  index,
}: {
  result: DocumentVerificationResult;
  isAr: boolean;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const statusLabel = STATUS_LABELS[result.status] || STATUS_LABELS.pending;
  const level = getScoreLevel(result.confidenceScore);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors text-start"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[result.status]}`} />
        <div className="flex-1 min-w-0">
          <p className="font-cairo text-sm font-bold text-green-deep">
            {isAr ? "وثيقة" : "Document"} #{index + 1}
            <span className="text-gray-400 font-normal mx-2">—</span>
            <span className="text-gray-500 font-normal text-xs">
              {result.extractedData.documentType}
            </span>
          </p>
          <p className="font-cairo text-[10px] text-gray-400 mt-0.5">
            {isAr ? statusLabel.ar : statusLabel.fr}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`font-lato text-sm font-bold px-2 py-0.5 rounded-lg border ${SCORE_COLORS[level]}`}
          >
            {result.confidenceScore}%
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4 bg-gray-50/30">
          {/* Extracted data */}
          {result.extractedData && (
            <div>
              <p className="font-cairo text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
                {isAr ? "البيانات المستخرجة" : "Données extraites"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {result.extractedData.personName && (
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 font-cairo">
                      {isAr ? "الاسم" : "Nom"}
                    </p>
                    <p className="text-xs text-green-deep font-cairo font-bold">
                      {result.extractedData.personName}
                    </p>
                  </div>
                )}
                {result.extractedData.amounts && result.extractedData.amounts.length > 0 && (
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 font-cairo">
                      {isAr ? "المبالغ" : "Montants"}
                    </p>
                    <p className="text-xs text-green-deep font-lato font-bold" dir="ltr">
                      {result.extractedData.amounts.map((a) => a.toLocaleString()).join(", ")}
                    </p>
                  </div>
                )}
                {result.extractedData.dates && result.extractedData.dates.length > 0 && (
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 font-cairo">
                      {isAr ? "التواريخ" : "Dates"}
                    </p>
                    <p className="text-xs text-green-deep font-lato font-bold">
                      {result.extractedData.dates.join(", ")}
                    </p>
                  </div>
                )}
                {result.extractedData.documentType && (
                  <div className="bg-white rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 font-cairo">
                      {isAr ? "نوع الوثيقة" : "Type"}
                    </p>
                    <p className="text-xs text-green-deep font-cairo font-bold">
                      {result.extractedData.documentType}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mismatches */}
          {result.mismatches.length > 0 && (
            <div>
              <p className="font-cairo text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
                {isAr ? "تناقضات" : "Incohérences"} ({result.mismatches.length})
              </p>
              <div className="space-y-1.5">
                {result.mismatches.map((m: DataMismatch, i: number) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-2.5 flex items-center gap-3 border border-amber-100"
                  >
                    <SeverityBadge severity={m.severity} isAr={isAr} />
                    <div className="flex-1 min-w-0">
                      <p className="font-cairo text-[10px] text-gray-400">{m.field}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-cairo text-xs text-red-500 line-through">
                          {m.userProvided}
                        </span>
                        <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                        <span className="font-cairo text-xs text-green-deep font-bold">
                          {m.extracted}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flags */}
          {result.flags.length > 0 && (
            <div>
              <p className="font-cairo text-[10px] text-gray-400 mb-2 uppercase tracking-wider">
                {isAr ? "تنبيهات" : "Alertes"} ({result.flags.length})
              </p>
              <div className="space-y-1.5">
                {result.flags.map((f: VerificationFlag, i: number) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-2.5 flex items-center gap-3"
                  >
                    <SeverityBadge severity={f.severity} isAr={isAr} />
                    <p className="font-cairo text-xs text-gray-600 flex-1">{f.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIVerificationPanel({
  verification,
  locale,
}: AIVerificationPanelProps) {
  const isAr = locale === "ar";
  const rec = RECOMMENDATION_CONFIG[verification.recommendation];
  const level = getScoreLevel(verification.overallScore);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-deep/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="font-amiri text-lg font-bold text-green-deep">
              {isAr ? "التحقق الآلي (IA)" : "Vérification automatique (IA)"}
            </h3>
            <p className="font-cairo text-[10px] text-gray-400">
              {isAr ? "تحليل آلي للوثائق المقدمة" : "Analyse automatique des documents soumis"}
            </p>
          </div>
        </div>

        {/* Score + Recommendation */}
        <div className="flex items-center gap-6">
          <ScoreRing score={verification.overallScore} />
          <div className="flex-1">
            <p className="font-cairo text-[10px] text-gray-400 mb-1">
              {isAr ? "درجة الثقة العامة" : "Score de confiance global"}
            </p>
            <p className={`font-lato text-2xl font-bold ${
              level === "high" ? "text-emerald-600" : level === "medium" ? "text-amber-600" : "text-red-600"
            }`}>
              {verification.overallScore}%
            </p>
            <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border text-xs font-bold font-cairo ${rec.color}`}>
              <span className="text-sm">{rec.icon}</span>
              {isAr ? rec.labelAr : rec.labelFr}
            </div>
          </div>
        </div>
      </div>

      {/* Document Results */}
      <div className="p-6">
        <p className="font-cairo text-[10px] text-gray-400 mb-3 uppercase tracking-wider">
          {isAr ? "نتائج الوثائق" : "Résultats par document"} ({verification.documentResults.length})
        </p>
        <div className="space-y-2">
          {verification.documentResults.map((result, index) => (
            <DocumentResultCard
              key={result.documentId}
              result={result}
              isAr={isAr}
              index={index}
            />
          ))}
        </div>

        {/* Timestamp */}
        {verification.verifiedAt && (
          <p className="font-cairo text-[10px] text-gray-300 mt-4 text-center">
            {isAr ? "تم التحقق في" : "Vérifié le"}{" "}
            {new Date(verification.verifiedAt).toLocaleString(isAr ? "ar-MA" : "fr-FR")}
          </p>
        )}
      </div>
    </div>
  );
}
