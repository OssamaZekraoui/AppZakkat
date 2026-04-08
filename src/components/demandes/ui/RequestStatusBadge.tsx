"use client";

import type { RequestStatus } from "@/types/demandes";

interface RequestStatusBadgeProps {
  status: RequestStatus;
  locale: string;
}

const STATUS_CONFIG: Record<
  RequestStatus,
  { labelAr: string; labelFr: string; bg: string; text: string }
> = {
  DRAFT: {
    labelAr: "مسودة",
    labelFr: "Brouillon",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  SUBMITTED: {
    labelAr: "قيد الانتظار",
    labelFr: "En attente",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  REVIEW: {
    labelAr: "تحت المراجعة",
    labelFr: "En cours de révision",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  PUBLISHED: {
    labelAr: "منشورة ✓",
    labelFr: "Publiée ✓",
    bg: "bg-green-pale/50",
    text: "text-green-deep",
  },
  REJECTED: {
    labelAr: "مرفوضة",
    labelFr: "Refusée",
    bg: "bg-red-50",
    text: "text-red-600",
  },
  CLOSED: {
    labelAr: "مغلقة",
    labelFr: "Clôturée",
    bg: "bg-gray-200",
    text: "text-gray-700",
  },
};

export default function RequestStatusBadge({
  status,
  locale,
}: RequestStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const isAr = locale === "ar";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-cairo font-bold ${config.bg} ${config.text}`}
    >
      {isAr ? config.labelAr : config.labelFr}
    </span>
  );
}
