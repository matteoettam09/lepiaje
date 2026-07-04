"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Lightbulb, Heart, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";

const VALUE_KEYS = [
  {
    icon: Shield,
    titleKey: "trust_title",
    descriptionKey: "trust_description",
  },
  {
    icon: Users,
    titleKey: "collaboration_title",
    descriptionKey: "collaboration_description",
  },
  {
    icon: Lightbulb,
    titleKey: "innovation_title",
    descriptionKey: "innovation_description",
  },
  {
    icon: Heart,
    titleKey: "passion_title",
    descriptionKey: "passion_description",
  },
] as const;

export function OurValues() {
  const t = useTranslations("about_us_page.our_values");

  return (
    <AnimateOnScroll index={3} className="py-16 bg-brand-stone">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-brand-ink"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("title")}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUE_KEYS.map((value, index) => (
            <ValueCard
              key={value.titleKey}
              icon={value.icon}
              title={t(value.titleKey)}
              description={t(value.descriptionKey)}
              index={index}
            />
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}

function ValueCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-brand-linen border border-brand-sand shadow-soft p-6 transition-colors duration-300 hover:bg-brand-stone"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        animate={{ scale: isHovered ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <Icon className="w-16 h-16 mx-auto mb-4 text-brand-terracotta" />
      </motion.div>
      <h3 className="font-bold text-xl mb-2 text-brand-ink">{title}</h3>
      <p className="text-brand-muted">{description}</p>
    </motion.div>
  );
}
