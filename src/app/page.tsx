import React from "react";
import Hero from "@/components/hero/hero";
import ContactForm from "@/components/contact_form/contact_form";
import { HeroCTAs } from "@/components/landing/hero_ctas";
import { LandingBookCTAs } from "@/components/landing/landing_book_ctas";
import { LandingHighlights } from "@/components/landing/landing_highlights";
import { TestimonialsCarousel } from "@/components/landing/testimonials_carousel";
import { getTranslations } from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("landing_page.hero");

  return (
    <div className="bg-brand-linen w-full h-full">
      <Hero
        headline={t("sub_title")}
        text={t("main_text")}
        overlayColor="rgba(0, 0, 0, 0.5)"
      >
        <HeroCTAs />
      </Hero>
      <section id="discover" className="scroll-mt-24 bg-brand-stone">
        <LandingHighlights />
        <TestimonialsCarousel />
      </section>
      <LandingBookCTAs />
      <section id="contact">
        <ContactForm />
      </section>
    </div>
  );
}
