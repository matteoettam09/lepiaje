import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "react-day-picker/style.css";
import LocaleSwitcher from "@/components/language_switcher/locale_switcher";
import WhatsAppAndEmail from "@/components/whatsapp_email_buttons/whatsapp_email_buttons";
import { fontDisplay, fontBody } from "@/lib/brand/fonts";

export const metadata: Metadata = {
  title: "Le Piaje",
  description: "Azienda Agricola",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${fontDisplay.variable} ${fontBody.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          {children}
          <LocaleSwitcher />
          <Footer />
          <WhatsAppAndEmail />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
