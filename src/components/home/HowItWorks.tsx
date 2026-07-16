"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

const steps = [
  { num: 1, icon: "file-edit", titleKey: "step1Title", descKey: "step1Desc" },
  { num: 2, icon: "search", titleKey: "step2Title", descKey: "step2Desc" },
  { num: 3, icon: "building", titleKey: "step3Title", descKey: "step3Desc" },
  { num: 4, icon: "badge-check", titleKey: "step4Title", descKey: "step4Desc" },
] satisfies ReadonlyArray<{ num: number; icon: AppIconName; titleKey: string; descKey: string }>;

export default function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();

  return (
    <section id="how-it-works" className="bg-cream py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-green-deep font-amiri text-3xl sm:text-4xl font-bold text-center mb-12">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="rounded-lg border border-green-pale/50 bg-white p-6 text-center shadow-sm transition-shadow duration-200 hover:shadow-md"
            >
              {/* Step number */}
              <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-gold font-amiri text-2xl font-bold">
                  {locale === "ar" ? step.num.toLocaleString("ar-MA") : step.num}
                </span>
              </div>

              {/* Icon */}
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-green-pale/70 text-green-deep">
                <AppIcon name={step.icon} className="h-6 w-6" />
              </div>

              {/* Title */}
              <h3 className="text-green-deep font-cairo font-bold text-lg mb-2">
                {t(step.titleKey)}
              </h3>

              {/* Description */}
              <p className="text-gray-600 font-cairo text-sm leading-relaxed">
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
