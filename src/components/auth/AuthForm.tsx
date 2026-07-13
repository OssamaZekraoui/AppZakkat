"use client";

import { FormEvent, useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";

type AuthMode = "login" | "register";
type AuthLocale = "ar" | "fr" | "en";

type AuthFormProps = {
  mode: AuthMode;
  locale: string;
};

type AuthResponse = {
  success: boolean;
  error?: string;
  message?: string;
  data?: {
    token?: string;
    user?: {
      id: string;
      email: string;
      name: string | null;
      role?: "USER" | "ADMIN";
    };
  };
};

const AUTH_TOKEN_KEY = "diyae-auth-token";
const AUTH_USER_KEY = "diyae-auth-user";

const text = {
  ar: {
    loginTitle: "تسجيل الدخول",
    registerTitle: "إنشاء حساب",
    loginSubtitle: "ادخل إلى حسابك لمتابعة طلباتك وحسابات الزكاة",
    registerSubtitle: "أنشئ حسابك لحفظ معلوماتك ومتابعة نشاطك",
    name: "الاسم الكامل",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    loginButton: "دخول",
    registerButton: "إنشاء الحساب",
    loadingLogin: "جار تسجيل الدخول...",
    loadingRegister: "جار إنشاء الحساب...",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    createAccount: "إنشاء حساب",
    loginLink: "تسجيل الدخول",
    backHome: "العودة للرئيسية",
    required: "املأ جميع الحقول المطلوبة.",
    mismatch: "كلمتا المرور غير متطابقتين.",
    shortPassword: "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل.",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
    userExists: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
    generic: "حدث خطأ، حاول مرة أخرى.",
  },
  fr: {
    loginTitle: "Connexion",
    registerTitle: "Créer un compte",
    loginSubtitle: "Accédez à votre compte pour suivre vos demandes et vos calculs de Zakat",
    registerSubtitle: "Créez votre compte pour sauvegarder vos informations et suivre votre activité",
    name: "Nom complet",
    email: "Adresse e-mail",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loginButton: "Se connecter",
    registerButton: "Créer le compte",
    loadingLogin: "Connexion...",
    loadingRegister: "Création du compte...",
    noAccount: "Vous n'avez pas de compte ?",
    hasAccount: "Vous avez déjà un compte ?",
    createAccount: "Créer un compte",
    loginLink: "Se connecter",
    backHome: "Retour à l'accueil",
    required: "Veuillez remplir tous les champs obligatoires.",
    mismatch: "Les mots de passe ne correspondent pas.",
    shortPassword: "Le mot de passe doit contenir au moins 6 caractères.",
    invalidCredentials: "Email ou mot de passe incorrect.",
    userExists: "Un compte existe déjà avec cet email.",
    generic: "Une erreur est survenue, réessayez.",
  },
  en: {
    loginTitle: "Login",
    registerTitle: "Create an account",
    loginSubtitle: "Access your account to follow your requests and Zakat calculations",
    registerSubtitle: "Create your account to save your information and track your activity",
    name: "Full name",
    email: "Email address",
    password: "Password",
    confirmPassword: "Confirm password",
    loginButton: "Log in",
    registerButton: "Create account",
    loadingLogin: "Logging in...",
    loadingRegister: "Creating account...",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    createAccount: "Create an account",
    loginLink: "Log in",
    backHome: "Back to home",
    required: "Please fill in all required fields.",
    mismatch: "Passwords do not match.",
    shortPassword: "Password must be at least 6 characters.",
    invalidCredentials: "Incorrect email or password.",
    userExists: "An account already exists with this email.",
    generic: "Something went wrong, please try again.",
  },
} as const;

function getLocale(locale: string): AuthLocale {
  return locale === "ar" || locale === "en" ? locale : "fr";
}

function authError(message: string | undefined, locale: AuthLocale) {
  if (message === "Invalid credentials") return text[locale].invalidCredentials;
  if (message === "User already exists") return text[locale].userExists;
  return text[locale].generic;
}

async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

export default function AuthForm({ mode, locale }: AuthFormProps) {
  const router = useRouter();
  const currentLocale = getLocale(locale);
  const t = text[currentLocale];
  const isRegister = mode === "register";
  const isRtl = currentLocale === "ar";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const title = isRegister ? t.registerTitle : t.loginTitle;
  const subtitle = isRegister ? t.registerSubtitle : t.loginSubtitle;
  const submitText = isRegister ? t.registerButton : t.loginButton;
  const loadingText = isRegister ? t.loadingRegister : t.loadingLogin;

  async function storeSession(result: AuthResponse) {
    if (!result.data?.token || !result.data.user) {
      throw new Error("Missing session");
    }

    localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.data.user));
    router.push(result.data.user.role === "ADMIN" ? "/admin" : "/");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email || !password || (isRegister && !name)) {
      setError(t.required);
      return;
    }

    if (password.length < 6) {
      setError(t.shortPassword);
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setError(t.mismatch);
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const registerResponse = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const registerResult: AuthResponse = await registerResponse.json();

        if (!registerResult.success) {
          setError(authError(registerResult.error, currentLocale));
          return;
        }
      }

      const loginResult = await login(email, password);

      if (!loginResult.success) {
        setError(authError(loginResult.error, currentLocale));
        return;
      }

      await storeSession(loginResult);
    } catch {
      setError(t.generic);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen bg-white-off pt-24 pb-14"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <section className="islamic-pattern bg-green-deep text-white">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center px-4 py-12">
          <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_480px]">
            <div className="hidden lg:block">
              <p className="mb-4 font-cairo text-sm font-bold uppercase tracking-[0.18em] text-gold-light">
                DIYAE
              </p>
              <h1 className="max-w-xl font-amiri text-5xl font-bold leading-tight text-white">
                {title}
              </h1>
              <p className="mt-5 max-w-xl font-cairo text-lg leading-8 text-white/78">
                {subtitle}
              </p>
              <div className="mt-10 h-1 w-28 rounded-full bg-gold" />
            </div>

            <div className="rounded-[2rem] border border-gold/25 bg-white p-6 shadow-2xl shadow-green-deep/25 sm:p-8">
              <div className="mb-8 text-center">
                <p className="font-amiri text-4xl font-bold text-green-deep">
                  {title}
                </p>
                <p className="mt-3 font-cairo text-base leading-7 text-green-deep/62">
                  {subtitle}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {isRegister && (
                  <label className="block">
                    <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
                      {t.name}
                    </span>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 font-cairo text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                      dir={isRtl ? "rtl" : "ltr"}
                      autoComplete="name"
                    />
                  </label>
                )}

                <label className="block">
                  <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
                    {t.email}
                  </span>
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                    dir="ltr"
                    type="email"
                    autoComplete="email"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
                    {t.password}
                  </span>
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                    dir="ltr"
                    type="password"
                    autoComplete={isRegister ? "new-password" : "current-password"}
                  />
                </label>

                {isRegister && (
                  <label className="block">
                    <span className="mb-2 block font-cairo text-sm font-bold text-green-deep">
                      {t.confirmPassword}
                    </span>
                    <input
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                      dir="ltr"
                      type="password"
                      autoComplete="new-password"
                    />
                  </label>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-cairo text-sm font-bold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-gold px-6 py-4 font-cairo text-lg font-black text-green-deep shadow-lg shadow-gold/25 transition hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? loadingText : submitText}
                </button>
              </form>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 font-cairo text-sm text-green-deep/68">
                <span>{isRegister ? t.hasAccount : t.noAccount}</span>
                <Link
                  href={isRegister ? "/login" : "/register"}
                  className="font-black text-green-deep underline decoration-gold/60 underline-offset-4 hover:text-gold"
                >
                  {isRegister ? t.loginLink : t.createAccount}
                </Link>
              </div>

              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-green-deep/12 px-5 py-2 font-cairo text-sm font-bold text-green-deep shadow-sm transition hover:border-gold/45 hover:bg-green-pale/35"
                >
                  <span>{isRtl ? "→" : "←"}</span>
                  <span>{t.backHome}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
