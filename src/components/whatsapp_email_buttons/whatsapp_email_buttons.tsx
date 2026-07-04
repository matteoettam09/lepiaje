"use client";
import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useScrollToForm } from "@/hooks/use_scroll_to_section";
import { INSTAGRAM_URL } from "@/constants/social_links";
import {
    buildWhatsAppUrl,
    getWhatsAppPhoneFromEnv,
} from "@/lib/integrations/whatsapp";

const floatingButtonClass =
    "flex p-1 items-center justify-center h-[2em] w-[2em] bg-[#ffff] rounded-full transition-all ease-linear hover:scale-110 active:scale-90";

export default function WhatsAppAndEmail() {
  const t = useTranslations("whatsapp");
  const phoneNumber = getWhatsAppPhoneFromEnv() ?? "";
  const message = t("opener");
  const { scrollToForm } = useScrollToForm();
  const whatsappUrl = phoneNumber
    ? buildWhatsAppUrl(phoneNumber, message)
    : "#";

  return (
    <div className="z-50 fixed bottom-0 right-0 pr-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] sm:pr-4">
      <div className="flex items-center gap-x-3 justify-center">
        <button
          type="button"
          onClick={() => scrollToForm()}
          aria-label="Contact us"
          className={floatingButtonClass}
        >
          <Mail color="#121212" size={20} />
        </button>
        <Link
          target="_blank"
          href={whatsappUrl}
          aria-label="WhatsApp"
          className={floatingButtonClass}
        >
          <FaWhatsapp color="#25d366" size={21} />
        </Link>
        <Link
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          className={floatingButtonClass}
        >
          <FaInstagram color="#E4405F" size={20} />
        </Link>
      </div>
    </div>
  );
}
