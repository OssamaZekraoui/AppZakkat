"use client";

import type { RequestFormData, AmountBreakdown, UploadedDocument } from "@/types/demandes";
import { CATEGORIES, COUNTRIES } from "@/types/demandes";
import AppIcon from "@/components/ui/AppIcon";

interface Step6Props {
  data: Partial<RequestFormData>;
  onEdit: (step: number) => void;
  onDeclarationChange: (field: "declarationAccepted" | "honorAccepted", value: boolean) => void;
  errors: Record<string, string>;
  locale: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function maskIBAN(iban: string): string {
  if (iban.length < 8) return iban;
  const start = iban.slice(0, 4);
  const end = iban.slice(-4);
  const middle = iban.slice(4, -4).replace(/./g, "*");
  return `${start} ${middle.replace(/(.{4})/g, "$1 ").trim()} ${end}`;
}

export default function Step6Review({
  data,
  onEdit,
  onDeclarationChange,
  errors,
  locale,
}: Step6Props) {
  const isAr = locale === "ar";
  const cat = CATEGORIES.find((c) => c.value === data.category);
  const country = COUNTRIES.find((c) => c.code === data.country);
  const breakdown = (data.breakdown || []) as AmountBreakdown[];
  const documents = (data.documents || []) as UploadedDocument[];

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", { maximumFractionDigits: 0 });

  const urgencyLabels = {
    NORMAL: { ar: "عادي", fr: "Normal" },
    URGENT: { ar: "عاجل", fr: "Urgent" },
    CRITICAL: { ar: "حرج", fr: "Critique" },
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "المراجعة والإرسال" : "Récapitulatif et soumission"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "تحقق من المعلومات قبل الإرسال"
            : "Vérifiez vos informations avant de soumettre"}
        </p>
      </div>

      {/* Category */}
      <ReviewBlock
        title={isAr ? "الفئة" : "Catégorie"}
        onEdit={() => onEdit(0)}
        locale={locale}
      >
        <div className="flex items-center gap-2">
          {cat?.icon && <AppIcon name={cat.icon} className="h-5 w-5 text-green-deep" />}
          <span className="font-cairo font-bold text-green-deep">
            {isAr ? cat?.labelAr : cat?.labelFr}
          </span>
        </div>
      </ReviewBlock>

      {/* Identity */}
      <ReviewBlock
        title={isAr ? "الهوية" : "Identité"}
        onEdit={() => onEdit(1)}
        locale={locale}
      >
        <div className="space-y-1 font-cairo text-sm text-green-deep/70">
          <p>
            <span className="font-bold">{isAr ? "الاسم المعروض" : "Nom affiché"} : </span>
            {data.isAnonymous
              ? isAr ? "مجهول الهوية" : "Anonyme"
              : data.displayName || "—"}
          </p>
          <p className="flex items-center gap-1.5">
            <AppIcon name="location" className="h-4 w-4 shrink-0" />
            {data.city}, {country?.flag} {isAr ? country?.labelAr : country?.labelFr}
          </p>
        </div>
      </ReviewBlock>

      {/* Situation */}
      <ReviewBlock
        title={isAr ? "الوضع" : "Situation"}
        onEdit={() => onEdit(2)}
        locale={locale}
      >
        <div className="space-y-2">
          <h4 className="font-amiri text-lg text-green-deep font-bold">
            {data.titleAr || "—"}
          </h4>
          {data.titleFr && (
            <p className="font-cairo text-xs text-green-deep/40">{data.titleFr}</p>
          )}
          <span
            className={`inline-block text-xs font-cairo font-bold px-2 py-0.5 rounded-full ${
              data.urgencyLevel === "CRITICAL"
                ? "bg-red-100 text-red-600"
                : data.urgencyLevel === "URGENT"
                ? "bg-orange-100 text-orange-600"
                : "bg-green-pale text-green-deep"
            }`}
          >
            {urgencyLabels[data.urgencyLevel || "NORMAL"]?.[isAr ? "ar" : "fr"]}
          </span>
          <p className="font-cairo text-sm text-green-deep/60 leading-relaxed">
            {(data.descriptionAr || "").slice(0, 200)}
            {(data.descriptionAr || "").length > 200 && "..."}
          </p>
        </div>
      </ReviewBlock>

      {/* Financial */}
      <ReviewBlock
        title={isAr ? "المبلغ" : "Montant"}
        onEdit={() => onEdit(3)}
        locale={locale}
      >
        <div className="space-y-2">
          <p className="font-lato text-xl font-bold text-green-deep" dir="ltr">
            {fmt(data.targetAmount || 0)} {data.currency}
          </p>
          {breakdown.length > 0 && (
            <div className="space-y-1">
              {breakdown.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-cairo text-green-deep/60">{b.label}</span>
                  <span className="font-lato text-green-deep/60" dir="ltr">
                    {fmt(b.amount)} {data.currency}
                  </span>
                </div>
              ))}
            </div>
          )}
          <p className="font-cairo text-xs text-green-deep/40">
            {data.deadline
              ? `${isAr ? "الموعد النهائي" : "Échéance"} : ${new Date(data.deadline).toLocaleDateString(isAr ? "ar-MA" : "fr-FR")}`
              : isAr ? "بدون حد زمني" : "Sans limite de temps"}
          </p>
        </div>
      </ReviewBlock>

      {/* Banking */}
      <ReviewBlock
        title={isAr ? "الحساب البنكي" : "Compte bancaire"}
        onEdit={() => onEdit(4)}
        locale={locale}
      >
        <div className="space-y-1 text-sm">
          <p className="font-cairo text-green-deep/70">{data.beneficiaryName}</p>
          <p className="font-lato text-green-deep/50 tracking-wider" dir="ltr">
            {maskIBAN(data.iban || "")}
          </p>
          <p className="font-cairo text-green-deep/40 text-xs">
            {data.bankName}
          </p>
        </div>
      </ReviewBlock>

      {/* Documents */}
      <ReviewBlock
        title={isAr ? "الوثائق" : "Documents"}
        onEdit={() => onEdit(5)}
        locale={locale}
      >
        <div className="space-y-1">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 text-sm">
              <AppIcon name={doc.mimeType.startsWith("image/") ? "file-image" : "file"} className="h-4 w-4 shrink-0 text-green-deep/50" />
              <span className="font-lato text-green-deep/60 truncate">
                {doc.originalName}
              </span>
              <span className="font-lato text-green-deep/30 text-xs flex-shrink-0">
                {formatSize(doc.size)}
              </span>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="font-cairo text-sm text-red-500">
              {isAr ? "لم يتم رفع أي وثيقة" : "Aucun document joint"}
            </p>
          )}
        </div>
      </ReviewBlock>

      {/* Declarations */}
      <div className="border-t border-green-deep/10 pt-6 space-y-4">
        <h3 className="font-cairo font-bold text-green-deep">
          {isAr ? "الإقرارات الإلزامية" : "Déclarations obligatoires"}
        </h3>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.declarationAccepted || false}
            onChange={(e) => onDeclarationChange("declarationAccepted", e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-green-deep/20 text-gold focus:ring-gold"
          />
          <span className="font-cairo text-sm text-green-deep/70">
            {isAr
              ? "أقر بأن جميع المعلومات المقدمة صحيحة ودقيقة، وأوافق على شروط استخدام منصة ضياء."
              : "Je certifie que toutes les informations fournies sont exactes et j'accepte les conditions d'utilisation de Diyae."}
          </span>
        </label>
        {errors.declarationAccepted && (
          <p className="text-xs text-red-500 font-cairo ms-8">{errors.declarationAccepted}</p>
        )}

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={data.honorAccepted || false}
            onChange={(e) => onDeclarationChange("honorAccepted", e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-green-deep/20 text-gold focus:ring-gold"
          />
          <span className="font-cairo text-sm text-green-deep/70">
            {isAr
              ? "أصرح على الشرف أنني بحاجة فعلية لهذه المساعدة وأن الأموال ستستخدم فيما ذُكر أعلاه فقط."
              : "Je déclare sur l'honneur que j'ai réellement besoin de cette aide et que les fonds seront utilisés uniquement aux fins mentionnées."}
          </span>
        </label>
        {errors.honorAccepted && (
          <p className="text-xs text-red-500 font-cairo ms-8">{errors.honorAccepted}</p>
        )}
      </div>
    </div>
  );
}

function ReviewBlock({
  title,
  onEdit,
  locale,
  children,
}: {
  title: string;
  onEdit: () => void;
  locale: string;
  children: React.ReactNode;
}) {
  const isAr = locale === "ar";
  return (
    <div className="bg-white rounded-xl border border-green-deep/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-cairo font-bold text-green-deep text-sm">{title}</h3>
        <button
          onClick={onEdit}
          className="text-xs font-cairo text-gold hover:text-green-deep transition-colors"
        >
          {isAr ? "تعديل" : "Modifier"}
        </button>
      </div>
      {children}
    </div>
  );
}
