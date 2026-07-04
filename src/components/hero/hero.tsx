import React from "react";
import { HeroBackgroundVideo } from "./hero_background_video";

interface HeroProps {
  headline: string;
  text?: string;
  overlayColor?: string;
  children?: React.ReactNode;
}

export default function Hero({
  headline,
  text,
  overlayColor,
  children,
}: HeroProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <HeroBackgroundVideo />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: overlayColor ?? "rgba(42, 38, 34, 0.45)" }}
      />

      {children && (
        <div className="absolute inset-x-0 top-24 bottom-28 z-10 flex items-center justify-center px-5 md:bottom-32">
          {children}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 z-10 w-full border-t border-brand-terracotta-dark/40 bg-brand-terracotta/90 px-5 py-5 text-center shadow-soft backdrop-blur-[2px] md:px-10 md:py-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-display text-2xl font-semibold text-brand-linen md:text-3xl lg:text-4xl">
            {headline}
          </h1>
          {text && (
            <p className="mt-2 font-sans text-sm leading-relaxed text-brand-linen/95 md:text-base">
              {text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
