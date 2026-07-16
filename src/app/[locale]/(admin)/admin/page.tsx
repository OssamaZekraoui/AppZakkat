import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { adminText, getAdminLocale } from "@/lib/adminText";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: "green" | "gold" | "pale";
  icon: AppIconName;
}) {
  const tones = {
    green: "border-green-deep/10 bg-white text-green-deep",
    gold: "border-gold/30 bg-gold/12 text-green-deep",
    pale: "border-green-pale bg-green-pale/45 text-green-deep",
  };

  return (
    <div className={`rounded-lg border p-6 shadow-sm ${tones[tone]}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="font-cairo text-sm font-bold text-green-deep/62">{label}</p>
        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-green-deep shadow-sm">
          <AppIcon name={icon} className="h-5 w-5" />
        </span>
      </div>
      <p className="font-lato text-5xl font-black leading-none text-green-deep">{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const locale = getAdminLocale(await getLocale());
  const t = adminText[locale];

  const [totalRequests, pendingReviews, totalUsers, publishedRequests] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: "SUBMITTED" } }),
    prisma.user.count(),
    prisma.request.count({ where: { status: "PUBLISHED" } }),
  ]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-green-deep p-7 text-white shadow-xl shadow-green-deep/12 islamic-pattern">
        <p className="font-cairo text-sm font-bold text-gold-light">{t.adminPanel}</p>
        <h1 className="mt-2 font-amiri text-4xl font-bold leading-tight">{t.dashboard}</h1>
        <p className="mt-3 max-w-2xl font-cairo text-sm leading-7 text-white/68">
          {t.dashboardSubtitle}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t.totalUsers} value={totalUsers} tone="green" icon="users" />
        <StatCard label={t.totalRequests} value={totalRequests} tone="pale" icon="file" />
        <StatCard label={t.pendingReviews} value={pendingReviews} tone="gold" icon="clock" />
        <StatCard label={locale === "ar" ? "منشورة" : locale === "fr" ? "Publiées" : "Published"} value={publishedRequests} tone="green" icon="success" />
      </section>
    </div>
  );
}
