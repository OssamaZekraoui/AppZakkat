"use client";

import { useEffect, useMemo, useState } from "react";
import { Link } from "@/i18n/navigation";
import AppIcon, { type AppIconName } from "@/components/ui/AppIcon";

const AUTH_TOKEN_KEY = "diyae-auth-token";

type Locale = "ar" | "fr" | "en";
type Tab = "requests" | "notifications";

type UserRequest = {
  id: string;
  referenceCode: string;
  titleAr: string;
  titleFr: string | null;
  category: string;
  status: string;
  targetAmount: number;
  currentAmount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

type Calculation = {
  id: string;
  currency: string;
  netAssets: number;
  zakatAmount: number;
  school: string;
  createdAt: string;
};

type Activity = {
  id: string;
  date: string;
  icon: AppIconName;
  tone: string;
  title: string;
  body: string;
};

const copy = {
  fr: {
    eyebrow: "Votre espace personnel",
    title: "Mes demandes et notifications",
    subtitle: "Suivez vos demandes d’aide, vos calculs de Zakat et les décisions de l’administration.",
    requests: "Mes demandes",
    notifications: "Notifications",
    newRequest: "Nouvelle demande",
    calculate: "Calculer ma Zakat",
    noRequests: "Vous n’avez pas encore envoyé de demande.",
    noNotifications: "Aucune notification pour le moment.",
    submitted: "Demande envoyée",
    approved: "Demande approuvée",
    rejected: "Demande rejetée",
    review: "Demande en cours d’examen",
    draft: "Brouillon",
    published: "Publiée",
    closed: "Clôturée",
    calculation: "Calcul de Zakat enregistré",
    calculationBody: (amount: string) => `Votre calcul indique une Zakat de ${amount}.`,
    requestBody: (reference: string) => `La demande ${reference} a été ajoutée et attend la vérification de l’administration.`,
    approvedBody: (reference: string) => `La demande ${reference} a été approuvée et est maintenant visible sur le site.`,
    rejectedBody: (reference: string) => `La demande ${reference} n’a pas été approuvée.`,
    error: "Impossible de charger votre espace. Reconnectez-vous puis réessayez.",
  },
  en: {
    eyebrow: "Your personal space", title: "My requests and notifications", subtitle: "Track your aid requests, Zakat calculations and admin decisions.",
    requests: "My requests", notifications: "Notifications", newRequest: "New request", calculate: "Calculate Zakat",
    noRequests: "You have not submitted a request yet.", noNotifications: "No notifications yet.", submitted: "Request submitted",
    approved: "Request approved", rejected: "Request rejected", review: "Under review", draft: "Draft", published: "Published", closed: "Closed",
    calculation: "Zakat calculation saved", calculationBody: (amount: string) => `Your calculation shows Zakat of ${amount}.`,
    requestBody: (reference: string) => `Request ${reference} was added and is awaiting admin review.`,
    approvedBody: (reference: string) => `Request ${reference} was approved and is now visible on the site.`,
    rejectedBody: (reference: string) => `Request ${reference} was not approved.`, error: "Unable to load your space. Please sign in again.",
  },
  ar: {
    eyebrow: "فضاؤك الشخصي", title: "طلباتي وإشعاراتي", subtitle: "تابع طلبات المساعدة وحسابات الزكاة وقرارات الإدارة.",
    requests: "طلباتي", notifications: "الإشعارات", newRequest: "طلب جديد", calculate: "حساب الزكاة",
    noRequests: "لم ترسل أي طلب بعد.", noNotifications: "لا توجد إشعارات حالياً.", submitted: "تم إرسال الطلب",
    approved: "تم قبول الطلب", rejected: "تم رفض الطلب", review: "قيد المراجعة", draft: "مسودة", published: "منشور", closed: "مغلق",
    calculation: "تم حفظ حساب الزكاة", calculationBody: (amount: string) => `قيمة الزكاة المحسوبة هي ${amount}.`,
    requestBody: (reference: string) => `تمت إضافة الطلب ${reference} وهو في انتظار مراجعة الإدارة.`,
    approvedBody: (reference: string) => `تم قبول الطلب ${reference} وأصبح ظاهراً على الموقع.`,
    rejectedBody: (reference: string) => `لم تتم الموافقة على الطلب ${reference}.`, error: "تعذر تحميل فضائك. يرجى تسجيل الدخول من جديد.",
  },
} as const;

const statusTone: Record<string, string> = {
  DRAFT: "border-slate-200 bg-slate-50 text-slate-700",
  SUBMITTED: "border-gold/35 bg-gold/15 text-green-deep",
  REVIEW: "border-amber-200 bg-amber-50 text-amber-800",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-800",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  CLOSED: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function UserSpace({ locale }: { locale: string }) {
  const currentLocale: Locale = locale === "ar" || locale === "en" ? locale : "fr";
  const t = copy[currentLocale];
  const isAr = currentLocale === "ar";
  const [tab, setTab] = useState<Tab>("requests");
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return;
    fetch("/api/me/activity", { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        if (!response.ok) throw new Error("activity");
        return response.json();
      })
      .then((data) => {
        setRequests(data.requests || []);
        setCalculations(data.calculations || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const activities = useMemo<Activity[]>(() => {
    const items: Activity[] = [];
    for (const request of requests) {
      items.push({
        id: `request-${request.id}`,
        date: request.createdAt,
        icon: "file",
        tone: "bg-gold/15 text-green-deep",
        title: t.submitted,
        body: t.requestBody(request.referenceCode),
      });
      if (request.status === "PUBLISHED") items.push({ id: `approved-${request.id}`, date: request.updatedAt, icon: "success", tone: "bg-emerald-100 text-emerald-700", title: t.approved, body: t.approvedBody(request.referenceCode) });
      if (request.status === "REJECTED") items.push({ id: `rejected-${request.id}`, date: request.updatedAt, icon: "error", tone: "bg-red-100 text-red-700", title: t.rejected, body: t.rejectedBody(request.referenceCode) });
    }
    for (const calculation of calculations) {
      const amount = `${calculation.zakatAmount.toLocaleString(isAr ? "ar-MA" : currentLocale === "fr" ? "fr-FR" : "en-US")} ${calculation.currency}`;
      items.push({ id: `zakat-${calculation.id}`, date: calculation.createdAt, icon: "calculator", tone: "bg-green-pale text-green-deep", title: t.calculation, body: t.calculationBody(amount) });
    }
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [calculations, currentLocale, isAr, requests, t]);

  const statusLabel = (status: string) => ({ DRAFT: t.draft, SUBMITTED: t.submitted, REVIEW: t.review, PUBLISHED: t.published, REJECTED: t.rejected, CLOSED: t.closed }[status] || status);
  const dateLabel = (date: string) => new Intl.DateTimeFormat(isAr ? "ar-MA" : currentLocale === "fr" ? "fr-FR" : "en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));

  return (
    <main className="min-h-screen bg-gradient-to-b from-white-off to-green-pale/25 px-4 pb-16 pt-28" dir={isAr ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-5xl">
        <section className="islamic-pattern overflow-hidden rounded-3xl bg-green-deep p-6 text-white shadow-xl md:p-9">
          <p className="font-cairo text-sm font-black text-gold-light">{t.eyebrow}</p>
          <div className="mt-2 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="font-amiri text-4xl font-bold md:text-5xl">{t.title}</h1>
              <p className="mt-3 max-w-2xl font-cairo text-sm leading-7 text-white/75 md:text-base">{t.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/demandes/nouvelle" className="rounded-full bg-gold px-5 py-3 font-cairo text-sm font-black text-green-deep transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">{t.newRequest}</Link>
              <Link href="/zakat" className="rounded-full border border-white/25 bg-white/10 px-5 py-3 font-cairo text-sm font-black text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">{t.calculate}</Link>
            </div>
          </div>
        </section>

        <div className="mt-6 flex rounded-2xl border border-green-deep/10 bg-white p-1.5 shadow-sm" role="tablist" aria-label={t.title}>
          {(["requests", "notifications"] as Tab[]).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)} className={`flex min-h-12 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 font-cairo text-sm font-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${tab === item ? "bg-green-deep text-white" : "text-green-deep/65 hover:bg-green-pale/50 hover:text-green-deep"}`}>
              <AppIcon name={item === "requests" ? "file" : "bell"} className="h-5 w-5" />
              {item === "requests" ? t.requests : t.notifications}
              <span className={`rounded-full px-2 py-0.5 font-lato text-xs ${tab === item ? "bg-gold text-green-deep" : "bg-green-pale text-green-deep"}`}>{item === "requests" ? requests.length : activities.length}</span>
            </button>
          ))}
        </div>

        {loading ? <div className="mt-6 grid gap-4"><div className="h-28 animate-pulse rounded-2xl bg-white"/><div className="h-28 animate-pulse rounded-2xl bg-white"/></div> : error ? <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 font-cairo font-bold text-red-700">{t.error}</div> : tab === "requests" ? (
          <section className="mt-6 space-y-4" role="tabpanel">
            {requests.length === 0 ? <Empty icon="inbox" text={t.noRequests} /> : requests.map((request) => (
              <article key={request.id} className="rounded-2xl border border-green-deep/10 bg-white p-5 shadow-sm transition-colors hover:border-gold/35">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><span className="font-lato text-xs font-black text-gold">{request.referenceCode}</span><span className={`rounded-full border px-3 py-1 font-cairo text-xs font-black ${statusTone[request.status] || statusTone.DRAFT}`}>{statusLabel(request.status)}</span></div>
                    <h2 className="mt-2 truncate font-amiri text-2xl font-bold text-green-deep">{isAr ? request.titleAr : request.titleFr || request.titleAr}</h2>
                    <p className="mt-1 font-cairo text-xs text-green-deep/55">{dateLabel(request.createdAt)}</p>
                  </div>
                  <div className="sm:text-end"><p className="font-lato text-xl font-black text-green-deep">{request.targetAmount.toLocaleString()} {request.currency}</p>{request.status === "PUBLISHED" && <Link href={`/demandes/${request.id}`} className="mt-2 inline-flex items-center gap-1 font-cairo text-xs font-black text-green-medium hover:text-green-deep"><AppIcon name="eye" className="h-4 w-4" />{t.published}</Link>}</div>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <section className="mt-6 space-y-3" role="tabpanel">
            {activities.length === 0 ? <Empty icon="bell" text={t.noNotifications} /> : activities.map((item) => (
              <article key={item.id} className="flex gap-4 rounded-2xl border border-green-deep/10 bg-white p-5 shadow-sm">
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><AppIcon name={item.icon} className="h-5 w-5" /></span>
                <div><h2 className="font-cairo text-base font-black text-green-deep">{item.title}</h2><p className="mt-1 font-cairo text-sm leading-6 text-green-deep/65">{item.body}</p><time className="mt-2 block font-lato text-xs font-bold text-green-deep/40">{dateLabel(item.date)}</time></div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function Empty({ icon, text }: { icon: AppIconName; text: string }) {
  return <div className="rounded-3xl border border-dashed border-green-deep/15 bg-white p-12 text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-pale text-green-deep"><AppIcon name={icon} className="h-7 w-7" /></span><p className="mt-4 font-cairo font-bold text-green-deep/60">{text}</p></div>;
}
