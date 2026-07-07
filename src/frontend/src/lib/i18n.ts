/**
 * Internationalization (i18n) configuration for bashar.ai.
 * Supports English (LTR) and Arabic (RTL) locales.
 */

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/**
 * Dictionary loader — dynamically imports locale JSON files.
 */
export async function getDictionary(locale: Locale) {
  const dict = await import(`@/dictionaries/${locale}.json`);
  return dict.default;
}
