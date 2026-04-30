import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function AdminDonationsPage() {
  const donations = await prisma.siteDonation.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="font-amiri text-2xl font-bold text-green-deep">Site Donations</h1>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-cairo min-w-[600px]">
            <thead className="bg-gray-50 text-gray-500 text-sm">
              <tr>
                <th className="p-4">Amount</th>
                <th className="p-4">Donor</th>
                <th className="p-4">Method</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 whitespace-nowrap">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-lato font-bold text-green-deep">{Number(d.amount)} {d.currency}</td>
                  <td className="p-4 text-gray-600">{d.user?.name || "Anonymous"}</td>
                  <td className="p-4 text-sm text-gray-500">{d.method}</td>
                  <td className="p-4">
                     <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${d.status === "SUCCEEDED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-sm">{d.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No donations recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
