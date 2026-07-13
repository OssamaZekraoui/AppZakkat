"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { adminText, getAdminLocale } from "@/lib/adminText";

function Icon({ name }: { name: "home" | "requests" | "donations" | "users" | "back" }) {
  const paths = {
    home: "M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10",
    requests: "M7 4h7l4 4v12H7V4zm7 0v5h5M9 13h6M9 17h6",
    donations: "M12 21s-7-4.35-7-10a4 4 0 017-2.65A4 4 0 0119 11c0 5.65-7 10-7 10z",
    users: "M16 11a4 4 0 10-8 0M4 21a8 8 0 0116 0M20 8a3 3 0 00-3-3M4 8a3 3 0 013-3",
    back: "M19 12H5m0 0l6-6m-6 6l6 6",
  };

  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths[name]} />
    </svg>
  );
}

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const currentLocale = getAdminLocale(locale);
  const t = adminText[currentLocale];
  const isAr = currentLocale === "ar";

  const navItems = [
    { href: "/admin", label: t.dashboard, icon: "home" as const },
    { href: "/admin/demandes", label: t.requests, icon: "requests" as const },
    { href: "/admin/donations", label: t.donations, icon: "donations" as const },
    { href: "/admin/users", label: t.users, icon: "users" as const },
  ];

  return (
    <div className="min-h-screen bg-white-off text-green-deep" dir={isAr ? "rtl" : "ltr"}>
      <aside className="fixed inset-y-0 z-40 hidden w-72 flex-col overflow-hidden bg-green-deep text-white md:flex">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="relative border-b border-gold/20 p-6">
          <Link href="/" className="group inline-block">
            <span className="block font-amiri text-4xl font-bold leading-none text-gold drop-shadow-[0_0_14px_rgba(201,168,76,0.25)]">
              {t.brand}
            </span>
            <span className="mt-2 block font-cairo text-xs font-bold text-white/58">
              {t.adminPanel}
            </span>
          </Link>
        </div>

        <nav className="relative flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : Boolean(pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-cairo text-sm font-bold transition ${
                  isActive
                    ? "bg-gold text-green-deep shadow-lg shadow-gold/15"
                    : "text-white/72 hover:bg-white/8 hover:text-white"
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-gold/20 p-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-2xl px-4 py-3 font-cairo text-sm font-bold text-white/62 transition hover:bg-white/8 hover:text-white"
          >
            <Icon name="back" />
            <span>{t.backToSite}</span>
          </Link>
        </div>
      </aside>

      <div className="md:ps-72">
        <header className="sticky top-0 z-30 border-b border-green-deep/8 bg-white-off/92 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="font-amiri text-2xl font-bold text-green-deep">
              {t.brand}
            </Link>
            <Link
              href="/"
              className="rounded-full border border-green-deep/10 bg-white px-4 py-2 font-cairo text-xs font-bold text-green-deep shadow-sm"
            >
              {t.backToSite}
            </Link>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full bg-white px-4 py-2 font-cairo text-xs font-bold text-green-deep shadow-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-h-screen px-4 py-6 md:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
