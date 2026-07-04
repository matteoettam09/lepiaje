"use client";

import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "../logo/logo";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-sand bg-brand-stone text-brand-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center justify-center w-[5em] space-x-4">
            <Logo height="h-[6em]" width="w-[6em]" blur="blur-lg" />
          </div>

          <div className="flex space-x-6">
            <Link href="mailto:giulianaclementini.ad@gmail.com" className="text-brand-muted hover:text-brand-terracotta transition-colors">
              <Mail size={21} />
              <span className="sr-only">Email</span>
            </Link>
            <Link href="tel:+393383032673" className="text-brand-muted hover:text-brand-terracotta transition-colors">
              <Phone size={20} />
              <span className="sr-only">Phone</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full flex py-4 justify-center items-center">
        <span className="text-sm text-brand-muted">
          {t("copyright", { year })}
        </span>
      </div>
    </footer>
  );
}
