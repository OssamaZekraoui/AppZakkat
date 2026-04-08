"use client";

import { useState } from "react";
import type { RequestFormData, UrgencyLevel } from "@/types/demandes";

interface Step2Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
}

const URGENCY_OPTIONS: {
  value: UrgencyLevel;
  labelAr: string;
  labelFr: string;
  descAr: string;
  descFr: string;
  color: string;
}[] = [
  {
    value: "NORMAL",
    labelAr: "عادي",
    labelFr: "Normal",
    descAr: "الأجل العادي",
    descFr: "Délai standard",
    color: "border-green-medium/20 bg-green-pale/10",
  },
  {
    value: "URGENT",
    labelAr: "عاجل",
    labelFr: "Urgent",
    descAr: "وضع عاجل لكنه مستقر",
    descFr: "Situation urgente mais stable",
    color: "border-orange-300 bg-orange-50",
  },
  {
    value: "CRITICAL",
    labelAr: "حرج",
    labelFr: "Critique",
    descAr: "طوارئ طبية أو وضع خطير",
    descFr: "Urgence médicale ou situation critique",
    color: "border-red-300 bg-red-50",
  },
];

export default function Step2Details({
  data,
  onChange,
  errors,
  locale,
}: Step2Props) {
  const isAr = locale === "ar";
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "اشرح وضعك" : "Décrivez votre situation"}
        </h2>
      </div>

      <div className="space-y-4">
        {/* Title AR */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "عنوان الطلب بالعربية" : "Titre en arabe"} *
          </label>
          <input
            type="text"
            value={data.titleAr || ""}
            onChange={(e) => onChange("titleAr", e.target.value)}
            placeholder={isAr ? "مثال : تكاليف عملية جراحية عاجلة لطفل" : "Ex: Frais d'opération urgente pour un enfant"}
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          />
          <div className="flex justify-between mt-1">
            {errors.titleAr && (
              <p className="text-xs text-red-500 font-cairo">{errors.titleAr}</p>
            )}
            <span className="text-xs font-lato text-green-deep/30 ms-auto" dir="ltr">
              {(data.titleAr || "").length}/100
            </span>
          </div>
        </div>

        {/* Title FR (optional) */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "عنوان بالفرنسية (اختياري)" : "Titre en français (optionnel)"}
          </label>
          <input
            type="text"
            value={data.titleFr || ""}
            onChange={(e) => onChange("titleFr", e.target.value)}
            placeholder="Ex: Frais d'opération chirurgicale urgente"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-2">
            {isAr ? "مستوى الاستعجال" : "Niveau d'urgence"} *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {URGENCY_OPTIONS.map((opt) => {
              const selected = data.urgencyLevel === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onChange("urgencyLevel", opt.value)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selected
                      ? `${opt.color} border-current shadow-sm`
                      : "border-green-deep/10 bg-white hover:border-green-deep/20"
                  }`}
                >
                  <span className="font-cairo text-sm font-bold text-green-deep block">
                    {isAr ? opt.labelAr : opt.labelFr}
                  </span>
                  <span className="font-cairo text-[10px] text-green-deep/50">
                    {isAr ? opt.descAr : opt.descFr}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description AR */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="font-cairo text-sm font-semibold text-green-deep">
              {isAr ? "وصف تفصيلي بالعربية" : "Description détaillée en arabe"} *
            </label>
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="text-xs font-cairo text-gold hover:text-green-deep transition-colors"
            >
              {isAr ? "نصائح الكتابة" : "Guide de rédaction"} {showGuide ? "▲" : "▼"}
            </button>
          </div>

          {showGuide && (
            <div className="bg-gold/5 rounded-xl p-4 mb-2 border border-gold/20">
              <p className="font-cairo text-sm text-green-deep font-bold mb-2">
                {isAr ? "نصائح لكتابة طلب مقنع :" : "Conseils pour un bon dossier :"}
              </p>
              <ul className="space-y-1 font-cairo text-xs text-green-deep/60">
                <li>• {isAr ? "اشرح وضعك بوضوح وصدق" : "Expliquez votre situation clairement et honnêtement"}</li>
                <li>• {isAr ? "اذكر سبب الحاجة للمساعدة" : "Mentionnez la raison du besoin d'aide"}</li>
                <li>• {isAr ? "حدد كيف ستستخدم التبرعات" : "Précisez l'utilisation des dons"}</li>
                <li>• {isAr ? "كن محدداً في الأرقام والتواريخ" : "Soyez précis dans les chiffres et les dates"}</li>
              </ul>
            </div>
          )}

          <textarea
            value={data.descriptionAr || ""}
            onChange={(e) => onChange("descriptionAr", e.target.value)}
            rows={6}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo text-sm
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
            placeholder={isAr ? "اشرح وضعك بالتفصيل..." : "Décrivez votre situation en détail..."}
          />
          <div className="flex justify-between mt-1">
            {errors.descriptionAr && (
              <p className="text-xs text-red-500 font-cairo">{errors.descriptionAr}</p>
            )}
            <span
              className={`text-xs font-lato ms-auto ${
                (data.descriptionAr || "").length < 150
                  ? "text-orange-500"
                  : "text-green-deep/30"
              }`}
              dir="ltr"
            >
              {(data.descriptionAr || "").length}/2000
              {(data.descriptionAr || "").length < 150 &&
                ` (min 150)`}
            </span>
          </div>
        </div>

        {/* Description FR (optional) */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "وصف بالفرنسية (اختياري)" : "Description en français (optionnel)"}
          </label>
          <textarea
            value={data.descriptionFr || ""}
            onChange={(e) => onChange("descriptionFr", e.target.value)}
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo text-sm
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
            placeholder="Description en français (optionnel)..."
          />
        </div>
      </div>
    </div>
  );
}
