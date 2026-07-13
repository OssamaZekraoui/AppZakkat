import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { adminText, getAdminLocale } from "@/lib/adminText";

export default async function AdminUsersPage() {
  const locale = getAdminLocale(await getLocale());
  const t = adminText[locale];
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-cairo text-sm font-bold text-gold">{t.adminPanel}</p>
          <h1 className="mt-1 font-amiri text-4xl font-bold text-green-deep">
            {t.users}
          </h1>
          <p className="mt-2 font-cairo text-sm text-green-deep/58">
            {t.usersSubtitle}
          </p>
        </div>
        <span className="rounded-full border border-gold/25 bg-white px-5 py-2 font-lato text-sm font-black text-green-deep shadow-sm">
          {users.length} {t.total}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-green-deep/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] font-cairo">
            <thead className="bg-green-pale/45 text-sm text-green-deep">
              <tr>
                <th className="p-4 text-start font-black">{t.name}</th>
                <th className="p-4 text-start font-black">{t.email}</th>
                <th className="p-4 text-start font-black">{t.role}</th>
                <th className="p-4 text-start font-black">{t.joined}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-deep/6">
              {users.map((user) => (
                <tr key={user.id} className="transition hover:bg-green-pale/18">
                  <td className="p-4 font-bold text-green-deep">
                    {user.name || t.notAvailable}
                  </td>
                  <td className="p-4 font-lato text-green-deep/68">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-[11px] font-black ${
                        user.role === "ADMIN"
                          ? "border-gold/35 bg-gold/16 text-green-deep"
                          : "border-green-deep/10 bg-green-pale/55 text-green-deep"
                      }`}
                    >
                      {user.role === "ADMIN" ? t.admin : t.user}
                    </span>
                  </td>
                  <td className="p-4 font-lato text-sm text-green-deep/48">
                    {user.createdAt.toLocaleDateString(locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US")}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-12 text-center font-cairo text-green-deep/45">
                    {t.noUsers}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
