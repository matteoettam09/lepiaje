"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";
import villaPerlata6 from "../../../public/assets/villa_perlata/6.jpg"; // TODO: Replace with actual image desired
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations("about_us_page.hero");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <AnimateOnScroll
      index={0}
      className="relative w-full h-screen md:max-2xl:min-h-[600px] flex items-center justify-center overflow-hidden "
    >
      <div className="absolute inset-0 w-full h-full bg-brand-ink">
        <Image
          src={villaPerlata6}
          alt="Le Piaje About Us Hero Background Image"
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>
      <motion.div
        className="relative w-full z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {t("title")}
        </motion.h1>
        <motion.p
          className="text-xl sm:text-2xl md:text-3xl max-w-2xl mx-auto mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {t("sub_title")}
        </motion.p>
      </motion.div>
    </AnimateOnScroll>
  );
}
