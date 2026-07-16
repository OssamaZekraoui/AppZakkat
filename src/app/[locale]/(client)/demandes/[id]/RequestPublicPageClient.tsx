"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import type { RequestWithStatus } from "@/types/demandes";
import RequestPublicPage from "@/components/demandes/RequestPublicPage";
import AppIcon from "@/components/ui/AppIcon";

interface Props {
  locale: string;
}

export default function RequestPublicPageClient({ locale }: Props) {
  const params = useParams();
  const id = params.id as string;
  const isAr = locale === "ar";

  const [request, setRequest] = useState<RequestWithStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/demandes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRequest(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 bg-green-deep/5 rounded-xl w-3/4" />
        <div className="h-40 bg-green-deep/5 rounded-2xl" />
        <div className="h-60 bg-green-deep/5 rounded-2xl" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-green-pale/60 text-green-deep">
          <AppIcon name="clipboard" className="h-7 w-7" />
        </div>
        <h2 className="font-amiri text-2xl font-bold text-green-deep mb-2">
          {isAr ? "الطلب غير موجود" : "Demande introuvable"}
        </h2>
        <p className="font-cairo text-sm text-green-deep/50 mb-6">
          {isAr
            ? "قد يكون الطلب محذوفاً أو لم يُنشر بعد"
            : "La demande a peut-être été supprimée ou n'est pas encore publiée"}
        </p>
        <a
          href={`/${locale}`}
          className="inline-block px-6 py-3 rounded-xl bg-gold text-green-deep font-cairo font-bold"
        >
          {isAr ? "العودة إلى الرئيسية" : "Retour à l'accueil"}
        </a>
      </div>
    );
  }

  return <RequestPublicPage request={request} locale={locale} />;
}
