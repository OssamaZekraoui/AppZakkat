"use client";

import type { RequestFormData } from "@/types/demandes";
import AppIcon from "@/components/ui/AppIcon";
import { COUNTRIES } from "@/types/demandes";
import IBANInput from "../ui/IBANInput";

interface Step4Props {
  data: Partial<RequestFormData>;
  onChange: (field: keyof RequestFormData, value: unknown) => void;
  errors: Record<string, string>;
  locale: string;
}

export default function Step4Banking({
  data,
  onChange,
  errors,
  locale,
}: Step4Props) {
  const isAr = locale === "ar";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "حساب التحويل البنكي" : "Coordonnées bancaires"}
        </h2>
      </div>

      {/* Important explanation */}
      <div className="bg-cream rounded-2xl p-5 border-2 border-gold/30">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-gold/15 text-green-deep">
            <AppIcon name="building" className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-cairo font-bold text-green-deep mb-1">
              {isAr ? "كيف تصلك التبرعات؟" : "Comment recevez-vous les dons ?"}
            </h3>
            <p className="font-cairo text-sm text-green-deep/70 leading-relaxed">
              {isAr
                ? "ضياء لا يتعامل مع أموالك — المتبرعون يحوّلون مباشرة إلى حسابك البنكي. سيظهر رقم IBAN الخاص بك للعموم في صفحة طلبك."
                : "Diyae ne touche pas à votre argent — les donateurs effectuent des virements directs vers votre compte. Votre IBAN sera affiché publiquement."}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Beneficiary name */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            {isAr ? "اسم صاحب الحساب البنكي" : "Titulaire du compte"} *
          </label>
          <input
            type="text"
            value={data.beneficiaryName || ""}
            onChange={(e) => onChange("beneficiaryName", e.target.value)}
            placeholder={isAr ? "الاسم الكامل كما يظهر في RIB" : "Nom exact sur le RIB"}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
          />
          {errors.beneficiaryName && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.beneficiaryName}</p>
          )}
        </div>

        {/* IBAN */}
        <IBANInput
          value={data.iban || ""}
          onChange={(v) => onChange("iban", v)}
          error={errors.iban}
          locale={locale}
        />

        {/* BIC */}
        <div>
          <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
            BIC / SWIFT *
          </label>
          <input
            type="text"
            value={data.bic || ""}
            onChange={(e) => onChange("bic", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
            placeholder="XXXXXXXX"
            maxLength={11}
            className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-lato tracking-wider
                       focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            dir="ltr"
          />
          {errors.bic && (
            <p className="mt-1 text-xs text-red-500 font-cairo">{errors.bic}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bank name */}
          <div>
            <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
              {isAr ? "اسم البنك" : "Nom de la banque"} *
            </label>
            <input
              type="text"
              value={data.bankName || ""}
              onChange={(e) => onChange("bankName", e.target.value)}
              placeholder={isAr ? "مثال: CIH Bank" : "Ex: CIH Bank"}
              className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                         focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            />
            {errors.bankName && (
              <p className="mt-1 text-xs text-red-500 font-cairo">{errors.bankName}</p>
            )}
          </div>

          {/* Bank country */}
          <div>
            <label className="block font-cairo text-sm font-semibold text-green-deep mb-1.5">
              {isAr ? "بلد البنك" : "Pays de la banque"} *
            </label>
            <select
              value={data.bankCountry || "MA"}
              onChange={(e) => onChange("bankCountry", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-green-deep/10 bg-white font-cairo
                         focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {isAr ? c.labelAr : c.labelFr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Security note */}
      <div className="bg-green-pale/20 rounded-xl p-3 flex items-center gap-2">
        <AppIcon name="lock" className="h-4 w-4 shrink-0 text-green-deep/50" />
        <p className="font-cairo text-xs text-green-deep/50">
          {isAr
            ? "يُحفظ رقم IBAN بشكل آمن. لن نطلب منك كلمة سر أو رمز SMS أبداً."
            : "Votre IBAN est stocké de manière sécurisée. Nous ne vous demanderons jamais de mot de passe ou code SMS."}
        </p>
      </div>

      {/* Alternative */}
      <details className="group">
        <summary className="font-cairo text-xs text-gold cursor-pointer hover:text-green-deep transition-colors">
          {isAr
            ? "لا تمتلك حساباً بنكياً شخصياً؟"
            : "Vous n'avez pas de compte bancaire personnel ?"}
        </summary>
        <div className="mt-2 p-3 bg-white rounded-xl border border-green-deep/10 font-cairo text-xs text-green-deep/60 space-y-1">
          <p>
            {isAr
              ? "• يمكنك استخدام حساب شخص آخر (قريب، زوج...)"
              : "• Vous pouvez utiliser le compte d'un proche (parent, conjoint...)"}
          </p>
          <p>
            {isAr
              ? "• أو حساب جمعية أو منظمة"
              : "• Ou le compte d'une association ou organisation"}
          </p>
          <p>
            {isAr
              ? "• اتصل بنا للمساعدة : contact@diyae.org"
              : "• Contactez-nous : contact@diyae.org"}
          </p>
        </div>
      </details>
    </div>
  );
}
