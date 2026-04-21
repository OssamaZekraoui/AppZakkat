"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const pathname = usePathname();
  const isAr = locale === "ar";

  const navItems = [
    {
      href: "/admin/demandes",
      label: t("requests"),
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir={isAr ? "rtl" : "ltr"}>
      {/* Sidebar */}
      <aside className="w-64 bg-green-deep text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="block">
            <span className="text-gold font-amiri text-2xl font-bold">
              {isAr ? "ضياء" : "Diyae"}
            </span>
            <span className="block text-white/50 text-xs font-cairo mt-1">
              {t("adminPanel")}
            </span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-cairo transition-colors ${
                  isActive
                    ? "bg-gold/20 text-gold font-bold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-cairo transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t("backToSite")}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden bg-green-deep text-white p-4 flex items-center justify-between">
          <span className="text-gold font-amiri text-xl font-bold">
            {isAr ? "ضياء" : "Diyae"} — {t("adminPanel")}
          </span>
          <Link
            href="/"
            className="text-white/50 hover:text-white text-xs font-cairo"
          >
            {t("backToSite")}
          </Link>
        </div>
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
