"use client";

import { FormEvent, useState } from "react";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { adminText, getAdminLocale } from "@/lib/adminText";

export default function LoginPage() {
  const locale = getAdminLocale(useLocale());
  const t = adminText[locale];
  const isAr = locale === "ar";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        router.push(data.data.user.role === "ADMIN" ? "/admin" : "/");
        router.refresh();
      } else {
        setError(data.error || t.loginError);
      }
    } catch {
      setError(t.unexpectedError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="islamic-pattern flex min-h-screen items-center justify-center bg-green-deep p-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md rounded-[2rem] border border-gold/25 bg-white p-7 shadow-2xl shadow-black/20 sm:p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="font-amiri text-4xl font-bold text-green-deep">
              {t.brand}
            </span>
          </Link>
          <h1 className="mt-5 font-amiri text-3xl font-bold text-green-deep">
            {t.login}
          </h1>
          <p className="mt-2 font-cairo text-sm text-green-deep/58">
            {t.secureAccess}
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center font-cairo text-sm font-bold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <label className="block">
            <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
              {t.email}
            </span>
            <input
              type="email"
              required
              dir="ltr"
              className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
              {t.password}
            </span>
            <input
              type="password"
              required
              dir="ltr"
              className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gold px-6 py-4 font-cairo text-lg font-black text-green-deep shadow-lg shadow-gold/25 transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? t.loggingIn : t.login}
          </button>
        </form>
      </div>
    </main>
  );
}
