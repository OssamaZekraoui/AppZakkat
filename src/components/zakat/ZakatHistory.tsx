"use client";

import { useState, useEffect } from "react";

interface HistoryEntry {
  id: string;
  zakatAmount: number;
  currency: string;
  school: string;
  createdAt: string;
  netAssets: number;
}

interface ZakatHistoryProps {
  locale: string;
}

export default function ZakatHistory({ locale }: ZakatHistoryProps) {
  const isAr = locale === "ar";
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/zakat/history");
        if (res.ok) {
          const data = await res.json();
          setEntries(data.calculations || []);
        }
      } catch {
        // Silent fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const fmt = (n: number) =>
    n.toLocaleString(isAr ? "ar-MA" : "fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-green-deep/5 rounded-xl" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">📋</div>
        <p className="font-cairo text-green-deep/50">
          {isAr ? "لا توجد حسابات سابقة" : "Aucun calcul précédent"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-cairo font-bold text-green-deep mb-4">
        {isAr ? "سجل الحسابات" : "Historique des calculs"}
      </h3>
      {entries.map((entry) => {
        let hijri = "";
        try {
          hijri = new Date(entry.createdAt).toLocaleDateString(
            isAr ? "ar-SA" : "fr-FR",
            {
              calendar: "islamic",
              year: "numeric",
              month: "short",
              day: "numeric",
            } as Intl.DateTimeFormatOptions
          );
        } catch {
          // Hijri not supported
        }

        return (
          <div
            key={entry.id}
            className="bg-white rounded-xl p-4 border border-green-deep/10 flex items-center justify-between"
          >
            <div>
              <p className="font-cairo text-sm text-green-deep">
                {new Date(entry.createdAt).toLocaleDateString(
                  isAr ? "ar-MA" : "fr-FR"
                )}
              </p>
              {hijri && (
                <p className="font-cairo text-xs text-green-deep/40">
                  {hijri}
                </p>
              )}
              <p className="font-cairo text-xs text-green-deep/50 mt-1">
                {entry.school}
              </p>
            </div>
            <div className="text-end">
              <p className="font-lato font-bold text-gold text-lg" dir="ltr">
                {fmt(entry.zakatAmount)} {entry.currency}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
