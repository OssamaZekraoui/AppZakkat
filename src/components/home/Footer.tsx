"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-green-deep text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="mb-3">
              <span className="font-amiri text-2xl font-bold">{t("brand")}</span>
            </div>
            <p className="text-white/60 font-cairo text-sm leading-relaxed">
              {t("tagline")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-cairo font-bold text-gold mb-3">{t("navigation")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("about")}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:ossama.zekaroui@gmail.com?subject=Support%20Diyae"
                  className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  {t("technicalSupport")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-cairo font-bold text-gold mb-3">{t("legal")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/conditions" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency */}
          <div>
            <h4 className="font-cairo font-bold text-gold mb-3">{t("transparency")}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/transparence#rapport-annuel" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("annualReport")}
                </Link>
              </li>
              <li>
                <Link href="/transparence#etats-financiers" className="inline-flex min-h-11 items-center rounded-md text-white/70 hover:text-white font-cairo text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
                  {t("financialStatements")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 font-cairo text-sm">
            {t("nonprofitNote")}
          </p>
          <p className="text-white/30 font-lato text-xs">
            © 2026 Diyae — {t("allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}
