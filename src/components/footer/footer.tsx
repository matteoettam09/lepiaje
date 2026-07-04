"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-sand bg-brand-stone text-brand-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center py-4">
          <span className="text-sm text-brand-muted">
            {t("copyright", { year })}
          </span>
        </div>
      </div>
    </footer>
  );
}
