"use client";

import { useTranslations, useLocale } from "next-intl";
import { CrescentMoon } from "@/components/icons/IslamicPattern";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-deep via-[#1e5233] to-green-medium overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-30" />

      <CrescentMoon className="absolute top-20 end-10 w-24 h-24 text-gold-light/55 drop-shadow-[0_0_24px_rgba(201,168,76,0.28)] hidden lg:block" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
        <p className="text-gold/70 font-amiri text-lg sm:text-xl mb-6">
          {t("bismillah")}
        </p>

        {isArabic ? (
          <>
            <h1 className="font-reem-kufi text-white font-bold leading-tight mb-1 text-[clamp(52px,10vw,96px)]">
              ضياء
            </h1>
            <p className="text-white/40 tracking-[0.1em] text-lg sm:text-xl mb-6 font-lato font-semibold">
              Diyae
            </p>
            <p className="text-gold font-cairo text-xl sm:text-2xl font-bold mb-1">
              {t("sloganAr")}
            </p>
            <p className="text-white/40 font-lato italic text-sm sm:text-base mb-8">
              {t("sloganFr")}
            </p>
          </>
        ) : (
          <>
            <h1 className="font-lato text-white font-bold tracking-[0.15em] leading-tight mb-1 text-[clamp(52px,10vw,96px)]">
              DIYAE
            </h1>
            <p className="text-white/40 font-amiri text-2xl sm:text-3xl font-bold mb-6">
              ضياء
            </p>
            <p className="text-gold font-lato text-lg sm:text-xl font-semibold mb-1">
              {t("sloganFr")}
            </p>
            <p className="text-white/40 font-cairo text-sm sm:text-base mb-8">
              {t("sloganAr")}
            </p>
          </>
        )}

        <div className="inline-block bg-white/10 backdrop-blur-sm border border-gold/30 rounded-full px-6 py-2 mb-10">
          <span className="text-green-pale font-cairo text-sm">
            {t("badge")}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#requests"
            className="w-full sm:w-auto px-8 py-4 bg-gold hover:bg-gold-light text-green-deep font-cairo font-bold rounded-xl transition-all transform hover:scale-105 text-center min-h-[44px]"
          >
            🙌 {t("ctaExplore")}
          </a>
          <a
            href="#zakat"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-cairo font-bold rounded-xl transition-all text-center min-h-[44px]"
          >
            🌙 {t("ctaZakat")}
          </a>
        </div>

        <div className="relative z-20 hidden md:grid grid-cols-4 gap-10 max-w-4xl mx-auto">
          <StatItem value="1,200+" label={t("statsBeneficiaries")} />
          <StatItem value="48" label={t("statsActiveCauses")} />
          <StatItem value="12" label={t("statsCountries")} />
          <StatItem value="100%" label={t("statsTransparency")} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white-off via-white-off/70 to-transparent" />
    </section>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-card relative px-5 py-3 text-center">
      <p className="relative z-10 text-green-deep font-lato font-black text-3xl leading-none">
        {value}
      </p>
      <p className="relative z-10 mt-2 text-green-deep font-cairo text-sm font-black leading-tight">
        {label}
      </p>
    </div>
  );
}
