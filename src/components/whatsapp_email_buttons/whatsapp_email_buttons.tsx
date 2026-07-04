"use client";
import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { useScrollToForm } from "@/hooks/use_scroll_to_section";
import {
    buildWhatsAppUrl,
    getWhatsAppPhoneFromEnv,
} from "@/lib/integrations/whatsapp";

export default function WhatsAppAndEmail() {
  const t = useTranslations("whatsapp");
  const phoneNumber = getWhatsAppPhoneFromEnv() ?? "";
  const message = t("opener");
  const { scrollToForm } = useScrollToForm();
  const whatsappUrl = phoneNumber
    ? buildWhatsAppUrl(phoneNumber, message)
    : "#";

  return (
    <div className="z-50 fixed bottom-0 right-0 pr-4 pb-4">
      <div className="flex items-center gap-x-4 justify-center">
        <div
          onClick={() => scrollToForm()}
          style={{ borderRadius: "100%" }}
          className="flex p-1 items-center justify-center h-[2em] w-[2em] bg-[#ffff] transition-all ease-linear hover:scale-110 active:scale-90"
        >
          <Mail color="#121212" size={20} />
        </div>
        {/* <p>{t("title")}</p> */}
        <div
          style={{ borderRadius: "100%" }}
          className="flex p-1 items-center justify-center h-[2em] w-[2em] bg-[#ffff] transition-all ease-linear hover:scale-110 active:scale-90"
        >
          <Link target="_blank" href={whatsappUrl}>
            <FaWhatsapp color="#25d366" size={21} />
          </Link>
        </div>
      </div>
    </div>
  );
}
