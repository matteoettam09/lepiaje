"use server";

import { cookies } from "next/headers";
import {
  COOKIE_NAME,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/i18n/config";

export async function getUserLocale(): Promise<Locale> {
  const cook = await cookies();
  const localeCookie = cook.get(COOKIE_NAME)?.value;

  if (localeCookie && isLocale(localeCookie)) {
    return localeCookie;
  }

  return defaultLocale;
}

export async function setUserLocale(locale: Locale) {
  const setLocaleCookie = await cookies();
  setLocaleCookie.set(COOKIE_NAME, locale);
}
