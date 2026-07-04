import { defaultLocale, type Locale } from "./config";

function parseAcceptLanguage(acceptLanguage: string | null): Locale | null {
  if (!acceptLanguage) {
    return null;
  }

  for (const part of acceptLanguage.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;

    if (tag.startsWith("it")) {
      return "it";
    }
    if (tag.startsWith("en")) {
      return "en";
    }
  }

  return null;
}

export function detectLocale(
  acceptLanguage: string | null,
  country: string | undefined
): Locale {
  const fromHeader = parseAcceptLanguage(acceptLanguage);
  if (fromHeader) {
    return fromHeader;
  }

  if (country === "IT") {
    return "it";
  }

  return defaultLocale;
}
