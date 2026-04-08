"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Currency,
  ZakatSchool,
  ZakatAssets,
  MetalPrices,
  ZakatResult,
} from "@/lib/zakat/types";
import { DEFAULT_ASSETS } from "@/lib/zakat/types";
import { getDefaultExchangeRates, getFallbackPrices } from "@/lib/zakat/nisab";
import { calculateZakat } from "@/lib/zakat/calculator";
import { SCHOOL_RULES } from "@/lib/zakat/schools";

import StepIndicator from "./ui/StepIndicator";
import Step0Intro from "./steps/Step0Intro";
import Step1Cash from "./steps/Step1Cash";
import Step2Metals from "./steps/Step2Metals";
import Step3Investments from "./steps/Step3Investments";
import Step4Stock from "./steps/Step4Stock";
import Step5Receivables from "./steps/Step5Receivables";
import Step6Debts from "./steps/Step6Debts";
import Step7Results from "./steps/Step7Results";

const TOTAL_STEPS = 8;
const STORAGE_KEY = "diyae-zakat-draft";

interface WizardState {
  currentStep: number;
  assets: ZakatAssets;
  currency: Currency;
  school: ZakatSchool;
  hawlStart: string;
  metalPrices: MetalPrices | null;
  exchangeRates: Record<Currency, number>;
  result: ZakatResult | null;
}

function getInitialState(): WizardState {
  return {
    currentStep: 0,
    assets: { ...DEFAULT_ASSETS },
    currency: "MAD",
    school: "maliki",
    hawlStart: "",
    metalPrices: null,
    exchangeRates: getDefaultExchangeRates(),
    result: null,
  };
}

interface ZakatWizardProps {
  locale: string;
}

export default function ZakatWizard({ locale }: ZakatWizardProps) {
  const isAr = locale === "ar";
  const [state, setState] = useState<WizardState>(getInitialState);

  // Load draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<WizardState>;
        setState((prev) => ({
          ...prev,
          ...parsed,
          metalPrices: prev.metalPrices, // Don't restore cached prices
          result: null, // Always recalculate
        }));
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save draft to localStorage
  useEffect(() => {
    if (state.currentStep > 0 && state.currentStep < 7) {
      try {
        const { metalPrices, result, ...rest } = state;
        void metalPrices;
        void result;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state]);

  // Fetch metal prices
  useEffect(() => {
    async function fetchPrices() {
      try {
        const res = await fetch("/api/metals-price");
        if (res.ok) {
          const data = await res.json();
          setState((prev) => ({
            ...prev,
            metalPrices: {
              goldPerGram: data.goldPerGram,
              silverPerGram: data.silverPerGram,
              currency: data.currency,
              updatedAt: data.updatedAt,
              source: data.source,
            },
          }));
        }
      } catch {
        setState((prev) => ({
          ...prev,
          metalPrices: getFallbackPrices(),
        }));
      }
    }
    fetchPrices();
  }, []);

  const updateAsset = useCallback(
    (field: keyof ZakatAssets, value: number) => {
      setState((prev) => ({
        ...prev,
        assets: { ...prev.assets, [field]: value },
      }));
    },
    []
  );

  const goNext = () => {
    if (state.currentStep === 6) {
      // Calculate before showing results
      const prices = state.metalPrices || getFallbackPrices();
      const result = calculateZakat({
        assets: state.assets,
        currency: state.currency,
        nisabType: SCHOOL_RULES[state.school].nisabReference,
        school: state.school,
        hawlStart: state.hawlStart || new Date().toISOString(),
        metalPrices: prices,
        exchangeRates: state.exchangeRates,
      });
      setState((prev) => ({ ...prev, currentStep: 7, result }));
    } else {
      setState((prev) => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, TOTAL_STEPS - 1),
      }));
    }
  };

  const goBack = () => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  };

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(getInitialState());
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 0:
        return (
          <Step0Intro
            currency={state.currency}
            onCurrencyChange={(c) => setState((p) => ({ ...p, currency: c }))}
            school={state.school}
            onSchoolChange={(s) => setState((p) => ({ ...p, school: s }))}
            metalPrices={state.metalPrices}
            exchangeRates={state.exchangeRates}
            locale={locale}
          />
        );
      case 1:
        return (
          <Step1Cash
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            locale={locale}
          />
        );
      case 2:
        return (
          <Step2Metals
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            metalPrices={state.metalPrices}
            exchangeRates={state.exchangeRates}
            school={state.school}
            locale={locale}
          />
        );
      case 3:
        return (
          <Step3Investments
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            locale={locale}
          />
        );
      case 4:
        return (
          <Step4Stock
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            locale={locale}
          />
        );
      case 5:
        return (
          <Step5Receivables
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            locale={locale}
          />
        );
      case 6:
        return (
          <Step6Debts
            assets={state.assets}
            onUpdate={updateAsset}
            currency={state.currency}
            hawlStart={state.hawlStart}
            onHawlStartChange={(d) => setState((p) => ({ ...p, hawlStart: d }))}
            locale={locale}
          />
        );
      case 7:
        return state.result ? (
          <Step7Results
            result={state.result}
            onReset={handleReset}
            locale={locale}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Step indicator */}
      <StepIndicator
        currentStep={state.currentStep}
        totalSteps={TOTAL_STEPS}
        locale={locale}
      />

      {/* Step content */}
      <div className="bg-white rounded-3xl shadow-xl border border-green-deep/5 p-6 md:p-8">
        {renderStep()}

        {/* Navigation buttons */}
        {state.currentStep < 7 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-green-deep/5">
            {state.currentStep > 0 ? (
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

            <button
              onClick={goNext}
              className="px-8 py-3 rounded-xl bg-gold text-green-deep font-cairo font-bold
                         hover:bg-gold-light shadow-lg hover:shadow-xl transition-all"
            >
              {state.currentStep === 6
                ? isAr
                  ? "احسب الزكاة"
                  : "Calculer la Zakat"
                : isAr
                ? "التالي ←"
                : "Suivant →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
