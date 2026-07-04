"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";
import ingresso from "../../../public/assets/ingresso.png";

type Milestone = {
  year: string;
  event: string;
};

export function OurHistory() {
  const t = useTranslations("about_us_page.our_history");
  const milestones = t.raw("milestones") as Milestone[];

  return (
    <AnimateOnScroll index={4} className="py-16 bg-brand-linen">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-brand-ink">
          {t("title")}
        </h2>

        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(260px,380px)] lg:gap-12">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-brand-sand md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-10">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex ${
                    index % 2 === 0 ? "md:justify-start" : "md:justify-end"
                  }`}
                >
                  <div
                    className={`w-full md:w-5/12 ${
                      index % 2 === 0
                        ? "md:pr-10 md:text-right"
                        : "md:pl-10 md:text-left"
                    } pl-10 md:pl-0`}
                  >
                    <div className="absolute left-[13px] top-2 h-3 w-3 rounded-full bg-brand-terracotta md:left-1/2 md:-translate-x-1/2" />
                    <h3 className="font-bold text-xl text-brand-ink">
                      {milestone.year}
                    </h3>
                    <p className="text-brand-muted">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-md lg:sticky lg:top-28 lg:max-w-none">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-brand-sand shadow-soft">
              <Image
                src={ingresso}
                alt={t("image_alt")}
                fill
                sizes="(max-width: 1024px) 80vw, 380px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
