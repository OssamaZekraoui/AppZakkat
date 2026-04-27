"use client";

import { useTranslations, useLocale } from "next-intl";
import { CrescentMoon } from "@/components/icons/IslamicPattern";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-deep via-[#1e5233] to-green-medium overflow-hidden">
      {/* Islamic geometric pattern overlay */}
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      {/* Crescent moon decorative */}
      <CrescentMoon className="absolute top-20 end-10 w-32 h-32 text-gold/15 hidden lg:block" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        {/* Bismillah */}
        <p className="text-gold/70 font-amiri text-lg sm:text-xl mb-6">
          {t("bismillah")}
        </p>

        {isArabic ? (
          <>
            {/* Title: Arabic then Latin */}
            <h1 className="font-amiri text-white font-bold leading-tight mb-1" style={{ fontSize: "clamp(52px, 10vw, 96px)" }}>
              ضياء
            </h1>
            <p className="text-white/40 tracking-[0.1em] text-lg sm:text-xl mb-6 font-crimson font-semibold">
              Diyae
            </p>
            {/* Slogan: Arabic then French */}
            <p className="text-gold font-cairo text-xl sm:text-2xl font-bold mb-1">
              {t("sloganAr")}
            </p>
            <p className="text-white/40 font-lato italic text-sm sm:text-base mb-8">
              {t("sloganFr")}
            </p>
          </>
        ) : (
          <>
            {/* Title: Latin then Arabic */}
            <h1 className="font-crimson text-white font-bold leading-tight mb-1" style={{ fontSize: "clamp(52px, 10vw, 96px)" }}>
              Diyae
            </h1>
            <p className="text-white/40 font-amiri text-2xl sm:text-3xl font-bold mb-6">
              ضياء
            </p>
            {/* Slogan: current language then Arabic */}
            <p className="text-gold font-lato text-lg sm:text-xl font-semibold mb-1">
              {t("sloganFr")}
            </p>
            <p className="text-white/40 font-cairo text-sm sm:text-base mb-8">
              {t("sloganAr")}
            </p>
          </>
        )}

        {/* Badge */}
        <div className="inline-block bg-white/10 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-10">
          <span className="text-green-pale font-cairo text-sm">
            {t("badge")}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#requests"
            className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-green-deep font-cairo font-bold rounded-xl transition-all transform hover:scale-105 text-center min-h-[44px]"
          >
            🤲 {t("ctaExplore")}
          </a>
          <a
            href="#zakat"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-cairo font-bold rounded-xl transition-all text-center min-h-[44px]"
          >
            🌙 {t("ctaZakat")}
          </a>
        </div>

        {/* Stats bar */}
        <div className="hidden md:flex items-center justify-center gap-8 lg:gap-16 bg-white/5 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/10">
          <StatItem value="1,200+" label={t("statsBeneficiaries")} />
          <div className="w-px h-10 bg-white/20" />
          <StatItem value="48" label={t("statsActiveCauses")} />
          <div className="w-px h-10 bg-white/20" />
          <StatItem value="12" label={t("statsCountries")} />
          <div className="w-px h-10 bg-white/20" />
          <StatItem value="100%" label={t("statsTransparency")} />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white-off to-transparent" />
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-gold font-lato font-bold text-2xl">{value}</p>
      <p className="text-white/60 font-cairo text-xs">{label}</p>
    </div>
  );
}
