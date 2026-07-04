"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Lightbulb, Heart, LucideIcon } from "lucide-react";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";

const values = [
  {
    icon: Shield,
    title: "Trust",
    description: "some words about trust here",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "some words about collaboration here",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "some words about Innovation here",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "some words about passion here",
  },
];

export function OurValues() {
  return (
    <AnimateOnScroll index={3} className="py-16 bg-brand-stone">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-4xl font-bold mb-12 text-center text-brand-ink"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Values
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} index={index} />
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}

function ValueCard({
  value,
  index,
}: {
  value: { icon: LucideIcon; title: string; description: string };
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
        <value.icon className="w-16 h-16 mx-auto mb-4 text-brand-terracotta" />
      </motion.div>
      <h3 className="font-bold text-xl mb-2 text-brand-ink">{value.title}</h3>
      <p className="text-brand-muted">{value.description}</p>
    </motion.div>
  );
}
