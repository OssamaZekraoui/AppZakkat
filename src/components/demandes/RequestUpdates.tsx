"use client";

import type { RequestUpdate } from "@/types/demandes";

interface RequestUpdatesProps {
  updates: RequestUpdate[];
  locale: string;
}

export default function RequestUpdates({
  updates,
  locale,
}: RequestUpdatesProps) {
  const isAr = locale === "ar";

  return (
    <div className="bg-white rounded-2xl border border-green-deep/10 p-6">
      <h3 className="font-cairo font-bold text-green-deep mb-5">
        {isAr ? "مستجدات القضية" : "Mises à jour"}
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute start-4 top-0 bottom-0 w-0.5 bg-green-deep/10" />

        <div className="space-y-6">
          {updates.map((update) => (
            <div key={update.id} className="relative ps-10">
              {/* Dot */}
              <div
                className={`absolute start-2.5 top-1 w-3 h-3 rounded-full border-2 border-white ${
                  update.authorRole === "ADMIN"
                    ? "bg-gold"
                    : "bg-green-medium"
                }`}
              />

              {/* Content */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-cairo font-bold px-2 py-0.5 rounded-full ${
                      update.authorRole === "ADMIN"
                        ? "bg-gold/10 text-gold"
                        : "bg-green-pale/50 text-green-deep"
                    }`}
                  >
                    {update.authorRole === "ADMIN"
                      ? isAr ? "تحديث من الإدارة" : "Mise à jour admin"
                      : isAr ? "تحديث من صاحب الطلب" : "Mise à jour demandeur"}
                  </span>
                  <span className="font-lato text-[10px] text-green-deep/30">
                    {new Date(update.createdAt).toLocaleDateString(
                      isAr ? "ar-MA" : "fr-FR",
                      { year: "numeric", month: "short", day: "numeric" }
                    )}
                  </span>
                </div>

                <p className="font-cairo text-sm text-green-deep/70 leading-relaxed">
                  {update.contentAr}
                </p>
                {update.contentFr && (
                  <p className="font-cairo text-xs text-green-deep/40 mt-1">
                    {update.contentFr}
                  </p>
                )}

                {/* Photos */}
                {update.photos.length > 0 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {update.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo}
                        alt={`Update photo ${i + 1}`}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
