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
import { getSiteUrl } from "@/lib/site-url";

const siteDescription =
  "Agriturismo in Montefiascone, Tuscia — farm stay near Lake Bolsena with two guest houses and local experiences.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Le Piaje",
    template: "%s | Le Piaje",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: ["en_US"],
    siteName: "Le Piaje",
    title: "Le Piaje",
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Le Piaje",
    description: siteDescription,
  },
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
