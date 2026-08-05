"use client";

import AppIcon from "@/components/ui/AppIcon";

export type AuthNoticeKind = "login" | "logout";

const noticeCopy = {
  ar: { login: "تم تسجيل الدخول بنجاح", logout: "تم تسجيل الخروج بنجاح" },
  fr: { login: "Connexion réussie", logout: "Déconnexion réussie" },
  en: { login: "Signed in successfully", logout: "Signed out successfully" },
} as const;

export function AuthNotice({
  locale,
  notice,
  onClose,
}: {
  locale: string;
  notice: AuthNoticeKind;
  onClose: () => void;
}) {
  const copy = noticeCopy[locale as keyof typeof noticeCopy] || noticeCopy.fr;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-green-deep/35 p-4 backdrop-blur-[2px] motion-safe:animate-[fadeIn_.2s_ease-out]">
      <div
        role="status"
        aria-live="polite"
        className="relative flex w-full max-w-sm flex-col items-center rounded-3xl border border-emerald-200 bg-white px-6 py-8 text-center text-green-deep shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={locale === "ar" ? "إغلاق" : locale === "en" ? "Close" : "Fermer"}
          className="absolute end-3 top-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-green-deep/55 transition-colors duration-200 hover:bg-green-pale hover:text-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <AppIcon name="close" className="h-5 w-5" />
        </button>
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <AppIcon name={notice === "login" ? "success" : "logout"} className="h-8 w-8" />
        </span>
        <p className="mt-4 font-amiri text-2xl font-bold">{copy[notice]}</p>
      </div>
    </div>
  );
}
