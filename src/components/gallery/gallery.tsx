"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import galleryBackground from "../../../public/assets/villa_perlata/esterni/12.jpg";

export default function Gallery() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleOverlayClick = () => {
    setExpandedIndex(null);
  };

  return (
    <div
      className="relative z-40 bg-cover bg-center w-full h-auto bg-brand-stone"
      style={{
        backgroundImage: `url(${galleryBackground})`,
      }}
    >
      <Image
        src={galleryBackground}
        alt="Hero background"
        fill
        sizes="100%"
        style={{ objectFit: "cover" }}
        className="blur-sm"
      />

      <AnimatePresence>
        {expandedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-brand-ink/75 z-40"
            onClick={handleOverlayClick}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
