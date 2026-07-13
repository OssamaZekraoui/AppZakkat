export type ZakatLocale = "ar" | "fr" | "en";

export function getZakatLocale(locale: string): ZakatLocale {
  return locale === "ar" || locale === "en" ? locale : "fr";
}

export function pickText(
  locale: string,
  text: { ar: string; fr: string; en: string }
) {
  return text[getZakatLocale(locale)];
}

export function numberLocale(locale: string) {
  const current = getZakatLocale(locale);
  if (current === "ar") return "ar-MA";
  if (current === "en") return "en-US";
  return "fr-FR";
}
