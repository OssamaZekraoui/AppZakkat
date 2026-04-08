"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-green-deep text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="font-reem-kufi text-2xl font-bold">{t("brand")}</span>
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
                <a href="/" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("home")}
                </a>
              </li>
              <li>
                <a href="#requests" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("about")}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("contact")}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-cairo font-bold text-gold mb-3">{t("legal")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Transparency */}
          <div>
            <h4 className="font-cairo font-bold text-gold mb-3">{t("transparency")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("annualReport")}
                </a>
              </li>
              <li>
                <a href="#" className="text-white/60 hover:text-white font-cairo text-sm transition-colors">
                  {t("financialStatements")}
                </a>
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
