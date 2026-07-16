"use client";

import { useTranslations } from "next-intl";
import AppIcon from "@/components/ui/AppIcon";

export default function NonprofitBanner() {
  const t = useTranslations("nonprofit");

  return (
    <section className="mt-4 bg-green-deep border-b-4 border-gold py-6 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-2">
        <p className="flex items-center justify-center gap-2 text-base font-bold leading-relaxed text-white sm:text-lg font-cairo">
          <AppIcon name="sparkles" className="h-5 w-5 shrink-0 text-gold" />
          {t("text")}
        </p>
        <p className="text-gold/80 font-lato italic text-sm">
          {t("textFr")}
        </p>
      </div>
    </section>
  );
}
