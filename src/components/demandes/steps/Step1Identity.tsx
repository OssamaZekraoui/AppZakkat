"use client";

import type { RequestFormData } from "@/types/demandes";
import { COUNTRIES } from "@/types/demandes";

interface Step1Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
}

export default function Step1Identity({
  data,
  onChange,
  errors,
  locale,
}: Step1Props) {
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "معلوماتك" : "Votre identité"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50">
          {isAr
            ? "بياناتك الشخصية محمية — لن تُعرض علنياً"
            : "Vos données personnelles sont protégées — jamais affichées publiquement"}
        </p>
      </div>

      <div className="space-y-4">
        {/* Display name */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "الاسم المعروض للجمهور" : "Nom affiché publiquement"}
          </label>
          <input
            type="text"
            value={data.displayName || ""}
            onChange={(e) => onChange("displayName", e.target.value)}
            placeholder={isAr ? "مثال : أحمد م." : "Ex: Ahmed M."}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          />
          {errors.displayName && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.displayName}</p>
          )}
        </div>

        {/* Anonymous toggle */}
        <div className="bg-green-pale/20 rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={data.isAnonymous || false}
              onChange={(e) => onChange("isAnonymous", e.target.checked)}
              className="w-5 h-5 rounded border-green-deep/20 text-gold focus:ring-gold"
            />
            <div>
              <span className="font-cairo text-sm font-bold text-green-deep">
                {isAr ? "أرغب في البقاء مجهول الهوية" : "Je souhaite rester anonyme"}
              </span>
              <p className="font-cairo text-xs text-green-deep/50 mt-0.5">
                {isAr
                  ? "خيار الإخفاء يحمي هويتك — لن يرى أحد اسمك الحقيقي. فقط المسؤول يمكنه رؤية بياناتك للتحقق."
                  : "L'anonymat protège votre identité — seul l'administrateur peut voir vos données pour vérification."}
              </p>
            </div>
          </label>
        </div>

        {/* Country */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "البلد" : "Pays"} *
          </label>
          <select
            value={data.country || "MA"}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {isAr ? c.labelAr : c.labelFr}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.country}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "المدينة" : "Ville"} *
          </label>
          <input
            type="text"
            value={data.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder={isAr ? "مثال : الدار البيضاء" : "Ex: Casablanca"}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          />
          {errors.city && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.city}</p>
          )}
        </div>

        {/* Contact email */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "البريد الإلكتروني (خاص)" : "Email de contact (privé)"} *
          </label>
          <input
            type="email"
            value={data.contactEmail || ""}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            placeholder="email@example.com"
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            dir="ltr"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.contactEmail}</p>
          )}
        </div>

        {/* Phone (optional) */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "الهاتف (اختياري — خاص)" : "Téléphone (optionnel — privé)"}
          </label>
          <input
            type="tel"
            value={data.contactPhone || ""}
            onChange={(e) => onChange("contactPhone", e.target.value)}
            placeholder="+212 6XX XXX XXX"
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
