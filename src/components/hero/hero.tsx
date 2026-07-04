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
        className="blur-sm object-cover"
      />
      <div
        className="absolute border-0 inset-0"
        style={{ backgroundColor: overlayColor ?? "rgba(42, 38, 34, 0.45)" }}
      ></div>
      <div className="md:max-2xl:px-40 px-5 md:max-2xl:pb-0 pb-20 gap-y-8 relative z-10 flex h-full flex-col items-center justify-center text-center text-brand-linen">
        <div>
          <h1 className="text-brand-linen mb-4 text-4xl font-bold md:max-2xl:text-6xl drop-shadow-sm">
            {title}
          </h1>
          {subtitle && (
            <p className="text-brand-linen/90 font-thin text-2xl italic md:text-2xl drop-shadow-sm">
              {subtitle}
            </p>
          )}
        </div>
        {text && <p className="text-brand-linen/90 text-xl md:text-xl drop-shadow-sm">{text}</p>}
        {children}
      </div>
    </div>
  );
}
