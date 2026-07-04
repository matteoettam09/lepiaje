import React from "react";
import Image from "next/image";
import heroBackgroundImage from "../../../public/assets/farm/melograni.jpeg";

interface HeroProps {
  title: string;
  subtitle?: string;
  overlayColor?: string;
  text?: string;
  children?: React.ReactNode;
}

export default function Hero({
  title,
  subtitle,
  overlayColor,
  text,
  children,
}: HeroProps) {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Image
        src={heroBackgroundImage}
        alt="Hero background"
        fill
        sizes="100%"
        className="blur-sm"
      />
      <div
        className="absolute border-0 inset-0"
        style={{ backgroundColor: overlayColor }}
      ></div>
      <div className="md:max-2xl:px-40 px-5 md:max-2xl:pb-0 pb-20 gap-y-8 relative z-10 flex h-full flex-col items-center justify-center text-center text-zinc-200">
        <div>
          <h1 className="text-brand-gold mb-4 text-4xl font-bold md:max-2xl:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="text-brand-gold font-thin text-2xl italic  md:text-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {text && <p className="text-brand-cream text-xl md:text-xl">{text}</p>}
        {children}
      </div>
    </div>
  );
}
