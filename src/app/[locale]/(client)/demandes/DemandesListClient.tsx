"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { RequestWithStatus, RequestCategory } from "@/types/demandes";
import { CATEGORIES } from "@/types/demandes";
import RequestCard from "@/components/demandes/ui/RequestCard";
import AppIcon from "@/components/ui/AppIcon";

interface DemandesListClientProps {
  locale: string;
}

export default function DemandesListClient({ locale }: DemandesListClientProps) {
  const t = useTranslations("demandes");
  const isAr = locale === "ar";

  const [requests, setRequests] = useState<RequestWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<RequestCategory | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (activeCategory !== "ALL") {
        params.set("category", activeCategory);
      }
      const res = await fetch(`/api/demandes?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        <button
          onClick={() => { setActiveCategory("ALL"); setPage(1); }}
          className={`px-4 py-2 rounded-full text-sm font-cairo font-bold transition-all ${
            activeCategory === "ALL"
              ? "bg-gold text-green-deep shadow"
              : "bg-white text-green-deep/60 border border-green-deep/10 hover:border-gold/40"
          }`}
        >
          {t("filterAll")}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => { setActiveCategory(cat.value); setPage(1); }}
            className={`px-4 py-2 rounded-full text-sm font-cairo font-bold transition-all flex items-center gap-1.5 ${
              activeCategory === cat.value
                ? "bg-gold text-green-deep shadow"
                : "bg-white text-green-deep/60 border border-green-deep/10 hover:border-gold/40"
            }`}
          >
            <AppIcon name={cat.icon} className="h-4 w-4" />
            <span>{isAr ? cat.labelAr : cat.labelFr}</span>
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-green-deep/5 p-5 animate-pulse"
            >
              <div className="h-4 bg-green-deep/5 rounded w-1/3 mb-4" />
              <div className="h-5 bg-green-deep/5 rounded w-2/3 mb-2" />
              <div className="h-3 bg-green-deep/5 rounded w-1/2 mb-4" />
              <div className="h-2 bg-green-deep/5 rounded-full mb-2" />
              <div className="h-3 bg-green-deep/5 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && requests.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-pale/50 text-green-medium">
            <AppIcon name="inbox" className="h-7 w-7" />
          </div>
          <p className="font-cairo text-green-deep/50 text-lg">
            {t("noRequests")}
          </p>
        </div>
      )}

      {!loading && requests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} locale={locale} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                page === i + 1
                  ? "bg-gold text-green-deep shadow"
                  : "bg-white text-green-deep/50 border border-green-deep/10 hover:border-gold/40"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
