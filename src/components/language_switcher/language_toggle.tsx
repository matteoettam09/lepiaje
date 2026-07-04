"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Locale, locales } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  it: "IT",
};

type Props = {
  locale: Locale;
  groupLabel: string;
  ariaLabels: Record<Locale, string>;
};

export default function LanguageToggle({
  locale,
  groupLabel,
  ariaLabels,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;

    startTransition(async () => {
      await setUserLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className="fixed bottom-4 left-4 z-50 flex rounded-md border border-brand-sand bg-brand-linen/95 p-0.5 shadow-soft backdrop-blur-sm"
    >
      {locales.map((value) => {
        const isActive = locale === value;

        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            aria-label={ariaLabels[value]}
            disabled={isPending}
            onClick={() => switchLocale(value)}
            className={`rounded-[calc(var(--radius)-2px)] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-terracotta focus-visible:ring-offset-2 focus-visible:ring-offset-brand-linen disabled:opacity-60 ${
              isActive
                ? "bg-brand-ink text-brand-linen"
                : "text-brand-muted hover:text-brand-ink"
            }`}
          >
            {localeLabels[value]}
          </button>
        );
      })}
    </div>
  );
}
