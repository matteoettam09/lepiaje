"use client";

import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ceramica from "../../../public/assets/who_we_are/ceramica.jpeg";

export function OurMission() {
  const t = useTranslations("about_us_page.our_mission");

  const bullets = [
    t("bullet_point_one"),
    t("bullet_point_two"),
    t("bullet_point_three"),
    t("bullet_point_four"),
  ].filter(Boolean);

  return (
    <AnimateOnScroll
      index={1}
      className="pt-28 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-brand-stone"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 max-w-md mx-auto lg:max-w-none md:max-2xl:h-[28em] h-[24em] relative rounded-lg shadow-lg overflow-hidden">
            <Image
              src={ceramica}
              alt="Our mission"
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl text-brand-ink font-bold">
              {t("title")}
            </h2>
            <p className="text-base sm:text-lg text-brand-muted">{t("main_text")}</p>
            {bullets.length > 0 && (
              <ul className="list-disc list-inside text-brand-muted space-y-2">
                {bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
