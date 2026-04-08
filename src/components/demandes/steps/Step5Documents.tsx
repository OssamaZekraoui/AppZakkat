"use client";

import type { RequestFormData, UploadedDocument, RequestCategory } from "@/types/demandes";
import { REQUIRED_DOCS } from "@/types/demandes";
import DocumentUploader from "../ui/DocumentUploader";

interface Step5Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
}

export default function Step5Documents({
  data,
  onChange,
  errors,
  locale,
}: Step5Props) {
  const isAr = locale === "ar";
  const category = (data.category || "PERSONAL") as RequestCategory;
  const requirements = REQUIRED_DOCS[category] || [];
  const documents = (data.documents || []) as UploadedDocument[];

  const handleUpload = (doc: UploadedDocument) => {
    onChange("documents", [...documents, doc]);
  };

  const handleRemove = (id: string) => {
    onChange("documents", documents.filter((d) => d.id !== id));
  };

  const getUploadedForCategory = (cat: string, index: number) => {
    return documents.find(
      (d) => d.category === cat && documents.indexOf(d) === index
    ) || documents.filter((d) => d.category === cat)[
      requirements
        .filter((r) => r.category === cat)
        .indexOf(requirements.filter((r) => r.category === cat).find((_, i2) => i2 === requirements.slice(0, requirements.indexOf(requirements[index])).filter(r2 => r2.category === cat).length) || requirements[0])
    ];
  };

  // Simple approach: match by index in requirements list
  const getDocForRequirement = (reqIndex: number) => {
    return documents[reqIndex];
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
        {requirements.map((req, i) => (
          <DocumentUploader
            key={`${req.category}-${i}`}
            label={`${isAr ? req.labelAr : req.labelFr}${req.required ? "" : ` (${isAr ? "اختياري" : "optionnel"})`}`}
            required={req.required}
            category={req.category}
            uploaded={getDocForRequirement(i)}
            onUpload={handleUpload}
            onRemove={handleRemove}
            locale={locale}
          />
        ))}

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
        <span className="text-sm">🔒</span>
        <p className="font-cairo text-xs text-green-deep/40">
          {isAr
            ? "وثائقك محمية — تُراجع فقط من طرف مسؤول ضياء للتحقق. لن تُشارك مع أي جهة خارجية."
            : "Vos documents sont protégés — vérifiés uniquement par l'équipe Diyae. Jamais partagés avec des tiers."}
        </p>
      </div>
    </div>
  );
}
