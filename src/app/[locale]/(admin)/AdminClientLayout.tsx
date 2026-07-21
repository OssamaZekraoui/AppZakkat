"use client";

import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { adminText, getAdminLocale } from "@/lib/adminText";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

const AUTH_TOKEN_KEY = "diyae-auth-token";
const AUTH_USER_KEY = "diyae-auth-user";

export function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getAdminLocale(locale);
  const t = adminText[currentLocale];
  const isAr = currentLocale === "ar";

  const navItems = [
    { href: "/admin", label: t.dashboard, icon: "dashboard" as AppIconName },
    { href: "/admin/demandes", label: t.requests, icon: "file" as AppIconName },
    { href: "/admin/donations", label: t.donations, icon: "hand-heart" as AppIconName },
    { href: "/admin/users", label: t.users, icon: "users" as AppIconName },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    router.replace("/login");
    router.refresh();
  }

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
                className={`flex min-h-11 items-center gap-3 rounded-lg px-4 py-3 font-cairo text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                  isActive
                    ? "bg-gold text-green-deep shadow-lg shadow-gold/15"
                    : "text-white/72 hover:bg-white/8 hover:text-white"
                }`}
              >
                <AppIcon name={item.icon} className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative border-t border-gold/20 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-11 w-full items-center gap-2 rounded-lg px-4 py-3 font-cairo text-sm font-bold text-white/72 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <AppIcon name="logout" className="h-5 w-5" />
            <span>{t.logout}</span>
          </button>
        </div>
      </aside>

      <div className="md:ps-72">
        <header className="sticky top-0 z-30 border-b border-green-deep/8 bg-white-off/92 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-4">
            <Link href="/admin" className="font-amiri text-2xl font-bold text-green-deep">
              {t.brand}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-green-deep/10 bg-white px-4 py-2 font-cairo text-xs font-bold text-green-deep shadow-sm"
            >
              {t.logout}
            </button>
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
