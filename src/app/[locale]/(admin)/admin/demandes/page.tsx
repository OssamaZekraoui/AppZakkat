"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATEGORIES } from "@/types/demandes";
import { adminText, getAdminLocale, labelFor, statusLabels } from "@/lib/adminText";

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
  DRAFT: "bg-white text-green-deep border-green-deep/12",
  SUBMITTED: "bg-gold/20 text-green-deep border-gold/35",
  REVIEW: "bg-amber-50 text-amber-700 border-amber-200",
  PUBLISHED: "bg-green-pale/75 text-green-deep border-green-light/20",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  CLOSED: "bg-white text-green-deep/48 border-green-deep/10",
};

export default function AdminDemandesPage() {
  const locale = getAdminLocale(useLocale());
  const t = adminText[locale];
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
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-cairo text-sm font-bold text-gold">{t.adminPanel}</p>
          <h1 className="mt-1 font-amiri text-4xl font-bold text-green-deep">
            {t.requests}
          </h1>
          <p className="mt-2 font-cairo text-sm text-green-deep/58">
            {t.requestsDescription}
          </p>
        </div>
        <span className="rounded-full border border-gold/25 bg-white px-5 py-2 font-lato text-sm font-black text-green-deep shadow-sm">
          {requests.length} {t.total}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-green-deep/8 bg-white p-5 shadow-sm">
              <div className="flex animate-pulse items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-green-pale" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-green-pale" />
                  <div className="h-3 w-1/4 rounded bg-green-pale/70" />
                </div>
                <div className="h-7 w-24 rounded-full bg-green-pale" />
              </div>
            </div>
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-green-deep/8 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-pale text-2xl">
            📋
          </div>
          <p className="font-cairo text-lg font-bold text-green-deep/58">{t.noRequests}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => {
            const cat = CATEGORIES.find((c) => c.value === req.category);
            const title = locale === "ar" ? req.titleAr : req.titleFr || req.titleAr;

            return (
              <Link
                key={req.id}
                href={`/admin/demandes/${req.id}`}
                className="block rounded-2xl border border-green-deep/8 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold/35 hover:shadow-lg hover:shadow-green-deep/8"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-4 md:flex-1">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-green-pale/70 text-2xl">
                      {cat?.icon || "📄"}
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-amiri text-xl font-bold text-green-deep">
                          {title}
                        </h3>
                        <span className="font-lato text-[11px] font-bold text-green-deep/38">
                          {req.referenceCode}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 font-cairo text-xs text-green-deep/55">
                        <span>{isAr ? cat?.labelAr : cat?.labelFr}</span>
                        <span className="text-gold">•</span>
                        <span>{req.isAnonymous ? t.anonymous : req.displayName || t.notAvailable}</span>
                        <span className="text-gold">•</span>
                        <span>{req.city}, {req.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 md:justify-end">
                    <span className="font-lato text-base font-black text-green-deep" dir="ltr">
                      {req.targetAmount?.toLocaleString()} {req.currency}
                    </span>
                    <span
                      className={`rounded-full border px-3 py-1 font-cairo text-[11px] font-black ${STATUS_COLORS[req.status] || STATUS_COLORS.DRAFT}`}
                    >
                      {labelFor(statusLabels, req.status, locale)}
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
