"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/types/demandes";

interface AdminRequest {
  id: string;
  referenceCode: string;
  titleAr: string;
  titleFr?: string;
  category: string;
  status: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  country: string;
  city: string;
  createdAt: string;
  displayName: string;
  isAnonymous: boolean;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  SUBMITTED: "bg-blue-100 text-blue-700",
  REVIEW: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-red-100 text-red-600",
  CLOSED: "bg-gray-200 text-gray-500",
};

export default function AdminDemandesPage() {
  const t = useTranslations("admin");
  const locale = useLocale();
  const isAr = locale === "ar";

  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch("/api/admin/demandes");
        if (res.ok) {
          const data = await res.json();
          setRequests(data.requests || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-amiri text-2xl font-bold text-green-deep">
            {t("requests")}
          </h1>
          <p className="font-cairo text-sm text-gray-500 mt-1">
            {t("requestsDescription")}
          </p>
        </div>
        <span className="bg-green-deep/10 text-green-deep font-lato font-bold text-sm px-4 py-2 rounded-full">
          {requests.length} {t("total")}
        </span>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                </div>
                <div className="h-6 w-20 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-4">📋</div>
          <p className="font-cairo text-gray-400 text-lg">{t("noRequests")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const cat = CATEGORIES.find((c) => c.value === req.category);
            return (
              <Link
                key={req.id}
                href={`/admin/demandes/${req.id}`}
                className="block bg-white rounded-xl p-5 border border-gray-100 hover:border-gold/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{cat?.icon || "📄"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-amiri text-base font-bold text-green-deep truncate">
                        {req.titleAr}
                      </h3>
                      <span className="font-lato text-[10px] text-gray-400 flex-shrink-0">
                        {req.referenceCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-cairo text-gray-400">
                      <span>{isAr ? cat?.labelAr : cat?.labelFr}</span>
                      <span>-</span>
                      <span>
                        {req.isAnonymous
                          ? (isAr ? "مجهول" : "Anonyme")
                          : req.displayName}
                      </span>
                      <span>-</span>
                      <span>{req.city}, {req.country}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="font-lato text-sm font-bold text-green-deep" dir="ltr">
                      {req.targetAmount?.toLocaleString()} {req.currency}
                    </span>
                    <span
                      className={`text-[11px] font-bold font-cairo px-3 py-1 rounded-full ${STATUS_COLORS[req.status] || "bg-gray-100 text-gray-500"}`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
