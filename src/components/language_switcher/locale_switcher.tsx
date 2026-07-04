"use client";

import { useLocale, useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";
import LanguageToggle from "./language_toggle";

export default function LocaleSwitcher() {
  const t = useTranslations("locale_switcher");
  const locale = useLocale() as Locale;

  return (
    <LanguageToggle
      locale={locale}
      groupLabel={t("label")}
      ariaLabels={{
        en: t("en"),
        it: t("it"),
      }}
    />
  );
}
