"use client";

import { useTranslations } from "next-intl";

export default function NonprofitBanner() {
  const t = useTranslations("nonprofit");

  return (
    <section className="bg-green-deep border-b-4 border-gold py-6 px-4">
      <div className="max-w-5xl mx-auto text-center space-y-2">
        <p className="text-white font-cairo font-bold text-base sm:text-lg leading-relaxed">
          ✦ {t("text")}
        </p>
        <p className="text-gold/80 font-lato italic text-sm">
          {t("textFr")}
        </p>
      </div>
    </section>
  );
}
