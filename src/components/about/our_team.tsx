"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "../animate_view_on_scroll/animate_view_on_scroll";
import { motion } from "framer-motion";

interface OurTeamImagesProps {
  imageUrls: string[];
}

export function OurTeam({ imageUrls }: OurTeamImagesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const teamMembers = useMemo(
    () => [
      {
        name: "Name here",
        role: "Role here",
        image: imageUrls[0],
        bio: "some words and descriptions of what they do or how contributed",
      },
      {
        name: "Name here",
        role: "Role here",
        image: imageUrls[1],
        bio: "some words and descriptions of what they do or how contributed",
      },
      {
        name: "Name here",
        role: "Role here",
        image: imageUrls[2],
        bio: "some words and descriptions of what they do or how contributed",
      },
      {
        name: "Name here",
        role: "Role here",
        image: imageUrls[3],
        bio: "some words and descriptions of what they do or how contributed",
      },
    ],
    [imageUrls]
  );

  return (
    <AnimateOnScroll
      index={2}
      className="py-16 sm:py-24 bg-brand-linen"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 text-center text-brand-ink">
          Meet Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="bg-brand-stone border border-brand-sand overflow-hidden"
              whileHover={{ y: -5 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            >
              <div className="relative w-full h-64 sm:h-72">
                <Image
                  src={member.image}
                  alt={member.name}
                  className="transition-opacity duration-300"
                  fill
                  sizes="100%"
                  style={{
                    opacity: hoveredIndex === index ? 0.7 : 1,
                    objectFit: "cover",
                  }}
                />
                {hoveredIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                    <p className="text-white text-sm">{member.bio}</p>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-brand-ink mb-2">
                  {member.name}
                </h3>
                <p className="text-brand-terracotta font-medium">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimateOnScroll>
  );
}
