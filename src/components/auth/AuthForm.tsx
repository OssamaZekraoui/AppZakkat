"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { Link, useRouter } from "@/i18n/navigation";
import AppIcon from "@/components/ui/AppIcon";

type AuthMode = "login" | "register";
type AuthLocale = "ar" | "fr" | "en";

type AuthFormProps = {
  mode: AuthMode;
  locale: string;
};

type AuthResponse = {
  success: boolean;
  requiresVerification?: boolean;
  email?: string;
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
const AUTH_NOTICE_KEY = "diyae-auth-notice";

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
    google: "المتابعة باستخدام Google",
    or: "أو",
    otpTitle: "تفعيل الحساب",
    otpSubtitle: "أرسلنا رمزاً من 6 أرقام إلى بريدك الإلكتروني",
    otpLabel: "رمز التفعيل",
    otpButton: "تفعيل الحساب",
    otpLoading: "جارٍ التحقق...",
    resend: "إعادة إرسال الرمز",
    resendSent: "تم إرسال رمز جديد.",
    invalidOtp: "الرمز غير صحيح أو انتهت صلاحيته.",
    emailUnavailable: "تعذر إرسال البريد الإلكتروني. حاول مرة أخرى.",
    changeEmail: "تغيير البريد الإلكتروني",
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
    google: "Continuer avec Google",
    or: "ou",
    otpTitle: "Activer votre compte",
    otpSubtitle: "Nous avons envoyé un code à 6 chiffres à votre adresse e-mail",
    otpLabel: "Code d’activation",
    otpButton: "Activer le compte",
    otpLoading: "Vérification...",
    resend: "Renvoyer le code",
    resendSent: "Un nouveau code a été envoyé.",
    invalidOtp: "Le code est incorrect ou a expiré.",
    emailUnavailable: "L’e-mail n’a pas pu être envoyé. Réessayez.",
    changeEmail: "Modifier l’adresse e-mail",
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
    google: "Continue with Google",
    or: "or",
    otpTitle: "Activate your account",
    otpSubtitle: "We sent a 6-digit code to your email address",
    otpLabel: "Activation code",
    otpButton: "Activate account",
    otpLoading: "Verifying...",
    resend: "Resend code",
    resendSent: "A new code was sent.",
    invalidOtp: "The code is incorrect or has expired.",
    emailUnavailable: "The email could not be sent. Please try again.",
    changeEmail: "Change email address",
  },
} as const;

function getLocale(locale: string): AuthLocale {
  return locale === "ar" || locale === "en" ? locale : "fr";
}

function authError(message: string | undefined, locale: AuthLocale) {
  if (message === "Invalid credentials") return text[locale].invalidCredentials;
  if (message === "User already exists") return text[locale].userExists;
  if (message === "Invalid or expired code" || message === "Too many attempts") return text[locale].invalidOtp;
  if (message === "Email delivery unavailable") return text[locale].emailUnavailable;
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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const title = otpSent ? t.otpTitle : isRegister ? t.registerTitle : t.loginTitle;
  const subtitle = otpSent ? `${t.otpSubtitle}: ${email}` : isRegister ? t.registerSubtitle : t.loginSubtitle;
  const submitText = isRegister ? t.registerButton : t.loginButton;
  const loadingText = isRegister ? t.loadingRegister : t.loadingLogin;

  async function storeSession(result: AuthResponse) {
    if (!result.data?.token || !result.data.user) {
      throw new Error("Missing session");
    }

    localStorage.setItem(AUTH_TOKEN_KEY, result.data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.data.user));
    sessionStorage.setItem(AUTH_NOTICE_KEY, "login");
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
        if (registerResult.requiresVerification) {
          setOtpSent(true);
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

  async function handleOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResendMessage("");
    if (!/^\d{6}$/.test(otp)) {
      setError(t.invalidOtp);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const result: AuthResponse = await response.json();
      if (!response.ok || !result.success) {
        setError(authError(result.error, currentLocale));
        return;
      }
      await storeSession(result);
    } catch {
      setError(t.generic);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setError("");
    setResendMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register/resend", { method: "POST" });
      const result: AuthResponse = await response.json();
      if (!response.ok || !result.success) {
        setError(authError(result.error, currentLocale));
        return;
      }
      setOtp("");
      setResendMessage(t.resendSent);
    } catch {
      setError(t.generic);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);

    try {
      await signIn("google", {
        callbackUrl: `${window.location.origin}/${currentLocale}/auth/google`,
      });
    } catch {
      setError(t.generic);
      setGoogleLoading(false);
    }
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
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

              {otpSent && (
                <form onSubmit={handleOtpSubmit} className="space-y-5">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-pale text-green-deep">
                    <AppIcon name="mail" className="h-8 w-8" />
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-center font-cairo text-sm font-bold text-green-deep">
                      {t.otpLabel}
                    </span>
                    <input
                      value={otp}
                      onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-4 text-center font-lato text-3xl font-black tracking-[0.35em] text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                      dir="ltr"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      autoFocus
                    />
                  </label>
                  {error && <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-cairo text-sm font-bold text-red-700">{error}</div>}
                  {resendMessage && <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-cairo text-sm font-bold text-emerald-800">{resendMessage}</div>}
                  <button type="submit" disabled={loading || otp.length !== 6} className="w-full cursor-pointer rounded-2xl bg-gold px-6 py-4 font-cairo text-lg font-black text-green-deep shadow-lg shadow-gold/25 transition-colors duration-200 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? t.otpLoading : t.otpButton}
                  </button>
                  <div className="flex flex-col items-center gap-2 font-cairo text-sm">
                    <button type="button" disabled={loading} onClick={handleResendOtp} className="min-h-11 cursor-pointer font-black text-green-deep underline decoration-gold/60 underline-offset-4 hover:text-gold disabled:cursor-not-allowed disabled:opacity-60">{t.resend}</button>
                    <button type="button" onClick={() => { setOtpSent(false); setOtp(""); setError(""); setResendMessage(""); }} className="min-h-11 cursor-pointer text-green-deep/65 transition-colors hover:text-green-deep">{t.changeEmail}</button>
                  </div>
                </form>
              )}

              {!otpSent && <>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={googleLoading || loading}
                className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-green-deep/12 bg-white px-5 py-3 font-cairo text-base font-black text-green-deep transition-colors duration-200 hover:border-gold/55 hover:bg-green-pale/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 shrink-0"
                >
                  <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.06H12v3.9h5.38a4.6 4.6 0 0 1-2 3.02v2.53h3.24c1.9-1.75 2.98-4.33 2.98-7.39Z" />
                  <path fill="#34A853" d="M12 22c2.7 0 4.98-.9 6.64-2.43l-3.24-2.53c-.9.6-2.05.96-3.4.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.61A10 10 0 0 0 12 22Z" />
                  <path fill="#FBBC05" d="M6.39 13.87A6 6 0 0 1 6.08 12c0-.65.11-1.28.31-1.87V7.52H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.48l3.35-2.61Z" />
                  <path fill="#EA4335" d="M12 6c1.47 0 2.79.51 3.83 1.5l2.88-2.88A9.66 9.66 0 0 0 12 2a10 10 0 0 0-8.96 5.52l3.35 2.61C7.18 7.76 9.39 6 12 6Z" />
                </svg>
                <span>{googleLoading ? loadingText : t.google}</span>
              </button>

              <div className="my-6 flex items-center gap-4" aria-hidden="true">
                <span className="h-px flex-1 bg-green-deep/12" />
                <span className="font-cairo text-xs font-bold uppercase text-green-deep/45">
                  {t.or}
                </span>
                <span className="h-px flex-1 bg-green-deep/12" />
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

                <div className="block">
                  <label htmlFor="auth-password" className="mb-2 block font-cairo text-sm font-bold text-green-deep">
                    {t.password}
                  </label>
                  <div className="relative">
                  <input
                    id="auth-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border-2 border-green-deep/12 bg-white py-4 ps-5 pe-16 text-left font-lato text-lg text-green-deep outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15"
                    dir="ltr"
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegister ? "new-password" : "current-password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? (currentLocale === "ar" ? "إخفاء كلمة المرور" : currentLocale === "en" ? "Hide password" : "Masquer le mot de passe") : (currentLocale === "ar" ? "إظهار كلمة المرور" : currentLocale === "en" ? "Show password" : "Afficher le mot de passe")}
                    aria-pressed={showPassword}
                    className="absolute end-2 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-green-deep/60 transition-colors hover:bg-green-pale/50 hover:text-green-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <AppIcon name="eye" className="h-5 w-5" />
                  </button>
                  </div>
                </div>

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
                  <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-cairo text-sm font-bold text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full cursor-pointer rounded-2xl bg-gold px-6 py-4 font-cairo text-lg font-black text-green-deep shadow-lg shadow-gold/25 transition hover:bg-gold-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/25 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? loadingText : submitText}
                </button>
              </form>
              </>}

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
