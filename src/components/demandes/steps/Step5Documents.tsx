"use client";

import { useState, useCallback } from "react";
import type { RequestFormData, UploadedDocument, RequestCategory } from "@/types/demandes";
import { REQUIRED_DOCS } from "@/types/demandes";
import type { DocumentVerificationResult } from "@/types/verification";
import DocumentUploader from "../ui/DocumentUploader";
import AppIcon from "@/components/ui/AppIcon";

interface Step5Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
  onVerificationResults?: (results: DocumentVerificationResult[]) => void;
}

type VerifyingState = Record<string, "pending" | "done">;

export default function Step5Documents({
  data,
  onChange,
  errors,
  locale,
  onVerificationResults,
}: Step5Props) {
  const isAr = locale === "ar";
  const category = (data.category || "PERSONAL") as RequestCategory;
  const requirements = REQUIRED_DOCS[category] || [];
  const documents = (data.documents || []) as UploadedDocument[];

  const [verifications, setVerifications] = useState<Record<string, DocumentVerificationResult>>({});
  const [verifying, setVerifying] = useState<VerifyingState>({});

  const triggerVerification = useCallback(
    async (doc: UploadedDocument) => {
      setVerifying((prev) => ({ ...prev, [doc.id]: "pending" }));
      try {
        const res = await fetch("/api/documents/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentId: doc.id,
            documentUrl: doc.url,
            mimeType: doc.mimeType,
            category: doc.category,
            userProvidedData: {
              displayName: data.displayName,
              targetAmount: data.targetAmount,
              country: data.country,
              city: data.city,
            },
          }),
        });
        if (res.ok) {
          const result: DocumentVerificationResult = await res.json();
          setVerifications((prev) => {
            const updated = { ...prev, [doc.id]: result };
            // Notify parent
            if (onVerificationResults) {
              onVerificationResults(Object.values(updated));
            }
            return updated;
          });
        }
      } catch {
        // silently fail for verification - it's supplementary
      } finally {
        setVerifying((prev) => ({ ...prev, [doc.id]: "done" }));
      }
    },
    [data.displayName, data.targetAmount, data.country, data.city, onVerificationResults]
  );

  const handleUpload = (doc: UploadedDocument) => {
    onChange("documents", [...documents, doc]);
    // Trigger AI verification async
    triggerVerification(doc);
  };

  const handleRemove = (id: string) => {
    onChange("documents", documents.filter((d) => d.id !== id));
    setVerifications((prev) => {
      const updated = { ...prev };
      delete updated[id];
      if (onVerificationResults) {
        onVerificationResults(Object.values(updated));
      }
      return updated;
    });
    setVerifying((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // Simple approach: match by index in requirements list
  const getDocForRequirement = (reqIndex: number) => {
    return documents[reqIndex];
  };

  const getVerificationBadge = (docId: string | undefined) => {
    if (!docId) return null;

    if (verifying[docId] === "pending") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-cairo text-blue-500">
          <span className="animate-spin inline-block w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full" />
          {isAr ? "جاري التحقق..." : "Vérification..."}
        </span>
      );
    }

    const result = verifications[docId];
    if (!result) return null;

    if (result.status === "verified") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-cairo text-emerald-600 font-bold">
          <span>&#10003;</span> {result.confidenceScore}%
        </span>
      );
    }
    if (result.status === "warning") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-cairo text-amber-600 font-bold">
          <span>&#9888;</span> {result.confidenceScore}%
        </span>
      );
    }
    if (result.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-cairo text-red-500 font-bold">
          <span>&#10007;</span> {result.confidenceScore}%
        </span>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "الوثائق الداعمة" : "Documents justificatifs"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "أرفق الوثائق المطلوبة حسب فئة طلبك"
            : "Joignez les documents requis selon la catégorie de votre demande"}
        </p>
      </div>

      <div className="space-y-4">
        {requirements.map((req, i) => {
          const doc = getDocForRequirement(i);
          return (
            <div key={`${req.category}-${i}`}>
              <div className="flex items-center justify-between mb-1">
                <div />
                {getVerificationBadge(doc?.id)}
              </div>
              <DocumentUploader
                label={`${isAr ? req.labelAr : req.labelFr}${req.required ? "" : ` (${isAr ? "اختياري" : "optionnel"})`}`}
                required={req.required}
                category={req.category}
                uploaded={doc}
                onUpload={handleUpload}
                onRemove={handleRemove}
                locale={locale}
              />
            </div>
          );
        })}

        {/* Extra document */}
        <details className="group">
          <summary className="font-cairo text-xs text-gold cursor-pointer hover:text-green-deep transition-colors">
            {isAr ? "+ إضافة وثيقة أخرى" : "+ Ajouter un autre document"}
          </summary>
          <div className="mt-2">
            <DocumentUploader
              label={isAr ? "وثيقة إضافية" : "Document supplémentaire"}
              required={false}
              category="OTHER"
              onUpload={handleUpload}
              onRemove={handleRemove}
              locale={locale}
            />
          </div>
        </details>
      </div>

      {errors.documents && (
        <p className="text-xs text-red-500 font-cairo">{errors.documents}</p>
      )}

      {/* Uploaded count */}
      {documents.length > 0 && (
        <div className="bg-green-pale/20 rounded-xl p-3 text-center">
          <span className="font-cairo text-sm text-green-deep">
            {isAr
              ? `${documents.length.toLocaleString("ar-MA")} وثائق مرفقة`
              : `${documents.length} document(s) joint(s)`}
          </span>
        </div>
      )}

      {/* Privacy note */}
      <div className="flex items-center gap-2 p-3">
        <AppIcon name="lock" className="h-4 w-4 shrink-0 text-green-deep/50" />
        <p className="font-cairo text-xs text-green-deep/40">
          {isAr
            ? "وثائقك محمية — تُراجع فقط من طرف مسؤول ضياء للتحقق. لن تُشارك مع أي جهة خارجية."
            : "Vos documents sont protégés — vérifiés uniquement par l'équipe Diyae. Jamais partagés avec des tiers."}
        </p>
      </div>
    </div>
  );
}
