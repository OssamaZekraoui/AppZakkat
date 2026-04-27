"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useState } from "react";

const localeLabels: Record<string, string> = {
  ar: "ع",
  fr: "FR",
  en: "EN",
};

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/demandes", label: t("requests"), isRoute: true },
    { href: "#zakat", label: t("zakatCalculator"), isRoute: false },
    { href: "#how-it-works", label: t("howItWorks"), isRoute: false },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-green-deep/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-0">
            {locale === "ar" ? (
              <span className="relative select-none">
                <span className="text-gold font-amiri text-3xl sm:text-4xl font-bold drop-shadow-[0_0_8px_rgba(201,168,76,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(201,168,76,0.6)] transition-all duration-300">
                  ضياء
                </span>
                <span className="absolute -bottom-1 right-0 w-full h-[2px] bg-gradient-to-l from-gold via-gold-light to-transparent rounded-full" />
              </span>
            ) : (
              <span className="relative select-none">
                <span className="text-gold font-crimson text-3xl sm:text-4xl font-semibold leading-none drop-shadow-[0_0_8px_rgba(201,168,76,0.4)] group-hover:drop-shadow-[0_0_12px_rgba(201,168,76,0.6)] transition-all duration-300">
                  Diyae
                </span>
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full" />
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-cairo transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/80 hover:text-white text-sm font-cairo transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
            <a
              href="#support-site"
              className="text-gold hover:text-gold-light text-sm font-cairo font-bold transition-colors"
            >
              {t("supportSite")}
            </a>
          </div>

          {/* Language switcher + mobile menu */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full px-1 py-0.5">
              {(["ar", "fr", "en"] as const).map((loc) => (
                <Link
                  key={loc}
                  href={pathname || "/"}
                  locale={loc}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    locale === loc
                      ? "bg-gold text-green-deep font-bold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {localeLabels[loc]}
                </Link>
              ))}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-white p-2"
              aria-label="Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-green-deep border-t border-gold/20 px-4 py-4 space-y-3">
          {navLinks.map((link) =>
            link.isRoute ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white font-cairo py-2"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-white/80 hover:text-white font-cairo py-2"
              >
                {link.label}
              </a>
            )
          )}
          <a
            href="#support-site"
            onClick={() => setMobileOpen(false)}
            className="block text-gold font-cairo font-bold py-2"
          >
            {t("supportSite")}
          </a>
        </div>
      )}
    </nav>
  );
}
