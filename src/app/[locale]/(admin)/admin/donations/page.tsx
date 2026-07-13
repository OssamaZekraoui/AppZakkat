import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { adminText, getAdminLocale, labelFor, statusLabels } from "@/lib/adminText";

export default async function AdminDonationsPage() {
  const locale = getAdminLocale(await getLocale());
  const t = adminText[locale];
  const donations = await prisma.siteDonation.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-cairo text-sm font-bold text-gold">{t.adminPanel}</p>
          <h1 className="mt-1 font-amiri text-4xl font-bold text-green-deep">
            {t.donations}
          </h1>
          <p className="mt-2 font-cairo text-sm text-green-deep/58">
            {t.donationsSubtitle}
          </p>
        </div>
        <span className="rounded-full border border-gold/25 bg-white px-5 py-2 font-lato text-sm font-black text-green-deep shadow-sm">
          {donations.length} {t.total}
        </span>
      </div>

      <div className="overflow-hidden rounded-3xl border border-green-deep/8 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] font-cairo">
            <thead className="bg-green-pale/45 text-sm text-green-deep">
              <tr>
                <th className="p-4 text-start font-black">{t.amount}</th>
                <th className="p-4 text-start font-black">{t.donor}</th>
                <th className="p-4 text-start font-black">{t.method}</th>
                <th className="p-4 text-start font-black">{t.status}</th>
                <th className="p-4 text-start font-black">{t.date}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-deep/6 whitespace-nowrap">
              {donations.map((donation) => (
                <tr key={donation.id} className="transition hover:bg-green-pale/18">
                  <td className="p-4 font-lato text-base font-black text-green-deep" dir="ltr">
                    {Number(donation.amount).toLocaleString()} {donation.currency}
                  </td>
                  <td className="p-4 text-green-deep/72">
                    {donation.user?.name || t.anonymous}
                  </td>
                  <td className="p-4 text-sm font-bold text-green-deep/55">
                    {donation.method.replaceAll("_", " ")}
                  </td>
                  <td className="p-4">
                    <span className="rounded-full border border-gold/25 bg-gold/12 px-3 py-1 text-[11px] font-black text-green-deep">
                      {labelFor(statusLabels, donation.status, locale)}
                    </span>
                  </td>
                  <td className="p-4 font-lato text-sm text-green-deep/48">
                    {donation.createdAt.toLocaleDateString(locale === "ar" ? "ar-MA" : locale === "fr" ? "fr-FR" : "en-US")}
                  </td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center font-cairo text-green-deep/45">
                    {t.noDonations}
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
