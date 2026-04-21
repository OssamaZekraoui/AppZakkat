"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { RequestFormData, RequestCategory } from "@/types/demandes";
import { DEFAULT_FORM_DATA } from "@/types/demandes";
import { validateStep } from "@/lib/validations/demande";
import type { DocumentVerificationResult } from "@/types/verification";

import Step0Category from "./steps/Step0Category";
import Step1Identity from "./steps/Step1Identity";
import Step2Details from "./steps/Step2Details";
import Step3Amount from "./steps/Step3Amount";
import Step4Banking from "./steps/Step4Banking";
import Step5Documents from "./steps/Step5Documents";
import Step6Review from "./steps/Step6Review";

const TOTAL_STEPS = 7;
const STORAGE_KEY = "diyae-request-draft";
const AUTO_SAVE_INTERVAL = 30_000; // 30s

const STEP_LABELS_AR = ["الفئة", "الهوية", "الوضع", "المبلغ", "البنك", "الوثائق", "المراجعة"];
const STEP_LABELS_FR = ["Catégorie", "Identité", "Situation", "Montant", "Banque", "Documents", "Révision"];

interface NewRequestWizardProps {
  locale: string;
}

export default function NewRequestWizard({ locale }: NewRequestWizardProps) {
  const isAr = locale === "ar";
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Partial<RequestFormData>>({ ...DEFAULT_FORM_DATA });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [documentVerifications, setDocumentVerifications] = useState<DocumentVerificationResult[]>([]);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore
    }
  }, []);

  // Auto-save draft
  useEffect(() => {
    autoSaveTimer.current = setInterval(() => {
      if (step > 0 && step < 6) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
          setLastSaved(new Date());
        } catch {
          // ignore
        }
      }
    }, AUTO_SAVE_INTERVAL);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [formData, step]);

  const updateField = useCallback(
    (field: keyof RequestFormData, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for this field
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const goNext = () => {
    // Validate current step
    const { success, errors: stepErrors } = validateStep(step, formData as Record<string, unknown>);
    if (!success) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  };

  const goToStep = (s: number) => {
    setErrors({});
    setStep(s);
  };

  const handleSubmit = async () => {
    // Validate step 6
    const { success, errors: stepErrors } = validateStep(6, formData as Record<string, unknown>);
    if (!success) {
      setErrors(stepErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, status: "SUBMITTED", documentVerifications }),
      });

      if (res.ok) {
        const data = await res.json();
        setReferenceCode(data.referenceCode || "DY-2026-0001");
        setSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
      } else {
        setErrors({ submit: isAr ? "فشل الإرسال — حاول مجدداً" : "Échec — réessayez" });
      }
    } catch {
      setErrors({ submit: isAr ? "خطأ في الاتصال" : "Erreur de connexion" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-medium flex items-center justify-center animate-[scale-in_0.5s_ease]">
          <span className="text-gold text-4xl font-bold">✓</span>
        </div>
        <h2 className="font-amiri text-3xl font-bold text-green-deep mb-3">
          {isAr ? "تم إرسال طلبك بنجاح" : "Votre demande a été soumise"}
        </h2>
        <p className="font-cairo text-green-deep/60 mb-2">
          {isAr ? "رقم المرجع" : "Numéro de référence"}
        </p>
        <p className="font-lato text-2xl font-bold text-gold mb-6">{referenceCode}</p>
        <p className="font-cairo text-sm text-green-deep/50 mb-8">
          {isAr
            ? "ستتلقى إشعاراً بالبريد الإلكتروني عند مراجعة طلبك"
            : "Vous recevrez un email lors de l'examen de votre demande"}
        </p>
        <a
          href={`/${locale}`}
          className="inline-block px-8 py-3 rounded-xl bg-gold text-green-deep font-cairo font-bold
                     hover:bg-gold-light shadow-lg transition-all"
        >
          {isAr ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </a>
      </div>
    );
  }

  const stepLabels = isAr ? STEP_LABELS_AR : STEP_LABELS_FR;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="relative h-2 bg-green-pale rounded-full mb-4 overflow-hidden">
          <div
            className="absolute top-0 start-0 h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="flex justify-between">
          {stepLabels.map((label, i) => {
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex flex-col items-center gap-1 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? "bg-gold text-green-deep scale-110 shadow"
                      : isDone
                      ? "bg-green-medium text-white"
                      : "bg-white text-green-deep/30 border border-green-deep/15"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </div>
                <span
                  className={`text-[9px] font-cairo text-center leading-tight hidden sm:block ${
                    isActive ? "text-gold font-bold" : isDone ? "text-green-medium" : "text-green-deep/30"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white rounded-3xl shadow-xl border border-green-deep/5 p-6 md:p-8">
        {step === 0 && (
          <Step0Category
            value={formData.category as RequestCategory}
            onChange={(c) => updateField("category", c)}
            locale={locale}
          />
        )}
        {step === 1 && (
          <Step1Identity
            data={formData}
            onChange={updateField}
            errors={errors}
            locale={locale}
          />
        )}
        {step === 2 && (
          <Step2Details
            data={formData}
            onChange={updateField}
            errors={errors}
            locale={locale}
          />
        )}
        {step === 3 && (
          <Step3Amount
            data={formData}
            onChange={updateField}
            errors={errors}
            locale={locale}
          />
        )}
        {step === 4 && (
          <Step4Banking
            data={formData}
            onChange={updateField}
            errors={errors}
            locale={locale}
          />
        )}
        {step === 5 && (
          <Step5Documents
            data={formData}
            onChange={updateField}
            errors={errors}
            locale={locale}
            onVerificationResults={setDocumentVerifications}
          />
        )}
        {step === 6 && (
          <Step6Review
            data={formData}
            onEdit={goToStep}
            onDeclarationChange={(field, value) => updateField(field, value)}
            errors={errors}
            locale={locale}
          />
        )}

        {/* Submit error */}
        {errors.submit && (
          <p className="mt-4 text-center text-sm text-red-500 font-cairo">{errors.submit}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-green-deep/5">
          {step > 0 ? (
            <button
              onClick={goBack}
              className="px-6 py-3 rounded-xl border-2 border-green-deep/10 text-green-deep font-cairo font-bold
                         hover:border-green-deep/20 transition-colors"
            >
              {isAr ? "→ السابق" : "← Précédent"}
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={goNext}
              className="px-8 py-3 rounded-xl bg-gold text-green-deep font-cairo font-bold
                         hover:bg-gold-light shadow-lg hover:shadow-xl transition-all"
            >
              {isAr ? "التالي ←" : "Suivant →"}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-green-deep text-white font-cairo font-bold
                         hover:bg-green-medium shadow-lg hover:shadow-xl transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isAr ? "جاري الإرسال..." : "Envoi en cours..."
                : isAr ? "إرسال الطلب" : "Soumettre la demande"}
            </button>
          )}
        </div>

        {/* Auto-save indicator */}
        {lastSaved && step > 0 && step < 6 && (
          <p className="text-center text-[10px] font-cairo text-green-deep/30 mt-3">
            {isAr ? "تم الحفظ تلقائياً" : "Sauvegardé automatiquement"}{" "}
            {lastSaved.toLocaleTimeString(isAr ? "ar-MA" : "fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </div>
  );
}
