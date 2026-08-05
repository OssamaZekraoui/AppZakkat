export const siteUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://diyae-zakkat.vercel.app").replace(/\/$/, "");

export const locales = ["ar", "fr", "en"] as const;

export const seoCopy = {
  ar: {
    homeTitle: "ضياء | منصة الزكاة والتبرعات الموثوقة",
    homeDescription: "منصة إسلامية غير ربحية لحساب الزكاة، دعم الحالات الإنسانية والتبرع المباشر بشفافية.",
    zakatTitle: "حاسبة الزكاة الدقيقة مجاناً | ضياء",
    zakatDescription: "احسب زكاة المال والذهب والفضة والاستثمارات بدقة وفق المذاهب الفقهية الأربعة.",
    requestsTitle: "حالات إنسانية وطلبات مساعدة موثوقة | ضياء",
    requestsDescription: "تصفح طلبات المساعدة والحالات الإنسانية الموثقة وساهم بالتبرع المباشر للمستفيدين.",
  },
  fr: {
    homeTitle: "Diyae | Plateforme de Zakat et de dons transparents",
    homeDescription: "Plateforme islamique à but non lucratif pour calculer la Zakat, soutenir des causes vérifiées et donner directement en toute transparence.",
    zakatTitle: "Calculateur de Zakat gratuit et précis | Diyae",
    zakatDescription: "Calculez gratuitement votre Zakat sur l'argent, l'or, l'argent métal et les investissements selon les quatre écoles juridiques.",
    requestsTitle: "Causes solidaires et demandes d'aide vérifiées | Diyae",
    requestsDescription: "Découvrez des demandes d'aide vérifiées et soutenez directement des bénéficiaires grâce à des dons transparents.",
  },
  en: {
    homeTitle: "Diyae | Transparent Zakat and Donation Platform",
    homeDescription: "A nonprofit Islamic platform to calculate Zakat, support verified causes and donate directly with transparency.",
    zakatTitle: "Free and Accurate Zakat Calculator | Diyae",
    zakatDescription: "Calculate Zakat on cash, gold, silver and investments according to the four Islamic schools of jurisprudence.",
    requestsTitle: "Verified Charitable Causes and Aid Requests | Diyae",
    requestsDescription: "Explore verified aid requests and support beneficiaries directly through transparent donations.",
  },
} as const;

export function getLocale(locale: string) {
  return (locales.includes(locale as (typeof locales)[number]) ? locale : "ar") as keyof typeof seoCopy;
}

export function localizedPath(locale: string, path = "") { return `${siteUrl}/${locale}${path}`; }

export function languageAlternates(path = "") {
  return { ar: localizedPath("ar", path), fr: localizedPath("fr", path), en: localizedPath("en", path), "x-default": localizedPath("ar", path) };
}
