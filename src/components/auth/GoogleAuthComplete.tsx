"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";

const AUTH_TOKEN_KEY = "diyae-auth-token";
const AUTH_USER_KEY = "diyae-auth-user";

const messages = {
  ar: {
    loading: "جارٍ إكمال تسجيل الدخول باستخدام Google...",
    error: "تعذر إكمال تسجيل الدخول باستخدام Google. حاول مرة أخرى.",
  },
  fr: {
    loading: "Finalisation de la connexion avec Google...",
    error: "Impossible de terminer la connexion Google. Veuillez réessayer.",
  },
  en: {
    loading: "Completing your Google sign-in...",
    error: "Google sign-in could not be completed. Please try again.",
  },
} as const;

type ExchangeResponse = {
  success: boolean;
  error?: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      role: "USER" | "ADMIN";
    };
  };
};

export default function GoogleAuthComplete({ locale }: { locale: string }) {
  const router = useRouter();
  const currentLocale = locale === "ar" || locale === "en" ? locale : "fr";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    async function exchangeGoogleSession() {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const response = await fetch("/api/auth/google/exchange", {
          method: "POST",
        });
        const result = (await response.json()) as ExchangeResponse;

        if (response.ok && result.success && result.data) {
          return result.data;
        }

        if (response.status !== 401 || attempt === 2) {
          throw new Error(result.error || "Google exchange failed");
        }

        await new Promise((resolve) => window.setTimeout(resolve, 400));
      }

      throw new Error("Google exchange failed");
    }

    async function completeSignIn() {
      try {
        const data = await exchangeGoogleSession();

        localStorage.setItem(AUTH_TOKEN_KEY, data.token);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
        router.replace(data.user.role === "ADMIN" ? "/admin" : "/");
      } catch {
        if (active) setFailed(true);
      }
    }

    void completeSignIn();
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white-off px-4">
      <div className="w-full max-w-md rounded-3xl border border-green-deep/10 bg-white p-8 text-center shadow-xl">
        <div
          className={`mx-auto h-12 w-12 rounded-full border-4 border-green-pale ${
            failed ? "border-red-200 bg-red-50" : "animate-spin border-t-gold"
          }`}
        />
        <p className="mt-6 font-cairo text-base font-bold text-green-deep">
          {failed ? messages[currentLocale].error : messages[currentLocale].loading}
        </p>
      </div>
    </main>
  );
}
