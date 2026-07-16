"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import AppIcon from "@/components/ui/AppIcon";

const AUTH_TOKEN_KEY = "diyae-auth-token";
const AUTH_USER_KEY = "diyae-auth-user";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem(AUTH_TOKEN_KEY)));
  }, []);

  function handleLogout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setIsAuthenticated(false);
    setMobileOpen(false);
  }

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
          <Link href="/" className="group flex items-center gap-2">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white-off p-1 shadow-sm ring-1 ring-gold/25">
              <Image
                src="/diyae-logo.png"
                alt=""
                width={44}
                height={44}
                className="h-full w-full object-contain"
                priority
              />
            </span>
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
            <div className="hidden sm:flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-gold/35 px-4 py-2 font-cairo text-sm font-bold text-white transition hover:bg-white/10"
                >
                  {t("logout")}
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-full px-4 py-2 font-cairo text-sm font-bold text-white/82 transition hover:text-white"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-full bg-gold px-4 py-2 font-cairo text-sm font-black text-green-deep shadow-sm transition hover:bg-gold-light"
                  >
                    {t("register")}
                  </Link>
                </>
              )}
            </div>

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
              className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
              aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileOpen}
            >
              <AppIcon name={mobileOpen ? "close" : "menu"} className="h-6 w-6" />
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

          <div className="border-t border-gold/15 pt-3">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-xl border border-gold/35 px-4 py-3 text-center font-cairo font-bold text-white"
              >
                {t("logout")}
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-white/15 px-4 py-3 text-center font-cairo font-bold text-white"
                >
                  {t("login")}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-gold px-4 py-3 text-center font-cairo font-black text-green-deep"
                >
                  {t("register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
