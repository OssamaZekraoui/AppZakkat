"use client";

import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";

const AUTH_TOKEN_KEY = "diyae-auth-token";

const text = {
  ar: {
    title: "تسجيل الدخول مطلوب",
    body: "لإرسال طلب مساعدة، يجب إنشاء حساب أو تسجيل الدخول أولاً.",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
  },
  fr: {
    title: "Connexion requise",
    body: "Pour soumettre une demande d'aide, vous devez créer un compte ou vous connecter.",
    login: "Se connecter",
    register: "Créer un compte",
  },
  en: {
    title: "Login required",
    body: "To submit a support request, you need to create an account or log in first.",
    login: "Log in",
    register: "Create an account",
  },
} as const;

type AuthGateProps = {
  children: React.ReactNode;
  locale: string;
};

export default function AuthGate({ children, locale }: AuthGateProps) {
  const router = useRouter();
  const currentLocale = locale === "ar" || locale === "en" ? locale : "fr";
  const t = text[currentLocale];
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const hasToken = Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
    setAuthenticated(hasToken);
    setReady(true);

    if (!hasToken) {
      const timer = window.setTimeout(() => router.replace("/login"), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-white-off pt-28">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-green-pale" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white-off px-4 pt-28">
        <div className="mx-auto max-w-md rounded-3xl border border-green-deep/8 bg-white p-8 text-center shadow-xl">
          <h1 className="font-amiri text-3xl font-bold text-green-deep">
            {t.title}
          </h1>
          <p className="mt-3 font-cairo text-green-deep/60">{t.body}</p>
          <div className="mt-7 flex justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-gold px-5 py-3 font-cairo font-black text-green-deep"
            >
              {t.login}
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-green-deep/15 px-5 py-3 font-cairo font-bold text-green-deep"
            >
              {t.register}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
