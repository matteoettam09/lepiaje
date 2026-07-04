export type Locale = (typeof locales)[number];

export const locales = ["en", "it"] as const;
export const defaultLocale: Locale = "it";
export const COOKIE_NAME = "NEXT_LOCALE";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
