import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");

  const [totalRequests, pendingReviews, totalUsers] = await Promise.all([
    prisma.request.count(),
    prisma.request.count({ where: { status: "SUBMITTED" } }),
    prisma.user.count(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-amiri text-3xl font-bold text-green-deep">
          {t("adminPanel")}
        </h1>
        <p className="font-cairo text-gray-500">Overview of platform statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cairo text-gray-500 font-bold">Total Users</h3>
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">👥</span>
          </div>
          <p className="font-lato text-4xl font-bold text-green-deep">{totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cairo text-gray-500 font-bold">Total Requests</h3>
            <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">📄</span>
          </div>
          <p className="font-lato text-4xl font-bold text-green-deep">{totalRequests}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-cairo text-gray-500 font-bold">Pending Reviews</h3>
            <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">⚠️</span>
          </div>
          <p className="font-lato text-4xl font-bold text-amber-600">{pendingReviews}</p>
        </div>
      </div>
    </div>
  );
}
