"use client";

const STEP_LABELS_AR = [
  "الإعداد",
  "السيولة",
  "المعادن",
  "الاستثمار",
  "التجارة",
  "الإيرادات",
  "الديون",
  "النتائج",
];

const STEP_LABELS_FR = [
  "Config",
  "Liquidités",
  "Métaux",
  "Investir",
  "Commerce",
  "Revenus",
  "Dettes",
  "Résultats",
];

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  locale: string;
}

export default function StepIndicator({
  currentStep,
  totalSteps,
  locale,
}: StepIndicatorProps) {
  const labels = locale === "ar" ? STEP_LABELS_AR : STEP_LABELS_FR;

  return (
    <div className="w-full mb-8">
      {/* Progress bar */}
      <div className="relative h-2 bg-green-pale rounded-full mb-4 overflow-hidden">
        <div
          className="absolute top-0 start-0 h-full bg-gold rounded-full transition-all duration-500"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between items-start">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const isActive = i === currentStep;
          const isCompleted = i < currentStep;
          return (
            <div key={i} className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-gold text-green-deep scale-110 shadow-lg"
                    : isCompleted
                    ? "bg-green-medium text-white"
                    : "bg-white/80 text-green-deep/40 border border-green-deep/20"
                }`}
              >
                {isCompleted ? "✓" : locale === "ar" ? (i + 1).toLocaleString("ar-MA") : i + 1}
              </div>
              <span
                className={`text-[10px] font-cairo text-center leading-tight hidden sm:block ${
                  isActive
                    ? "text-gold font-bold"
                    : isCompleted
                    ? "text-green-medium"
                    : "text-green-deep/40"
                }`}
              >
                {labels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
