"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { farmImages as images } from "../../../public/assets/farm";

interface CarouselProps {
  autoSlide?: boolean;
  images?: string[];
}
//TODO images should be passed as props to the carousel so that we can reuse it in different components|pages
export default function Carousel({ autoSlide = true }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, []);

  useEffect(() => {
    const seconds_to_slide = 5000; //5seconds
    if (autoSlide) {
      const interval = setInterval(nextSlide, seconds_to_slide);
      return () => clearInterval(interval);
    }
  }, [autoSlide, nextSlide]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div id="discover" className="relative scroll-mt-24">
      <div className="w-full">
        <div className="absolute z-10 h-full w-full inset-0 bg-[rgba(0,0,0,0.3)]"></div>
        <Image
          src={images[2]}
          alt="Carousel background Image"
          fill
          sizes="100%"
          style={{ objectFit: "cover" }}
          className="blur-sm"
        />
      </div>
      <div className="max-w-4xl mx-auto relative z-10 p-4">
        <React.Fragment>
          <h1 className="text-brand-linen font-thin text-4xl text-center pb-8">
            A peak into our world
          </h1>
          <div className="relative  h-[30em]  mb-4 overflow-hidden rounded-lg">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Selected image`}
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-brand-ink/50 text-brand-linen p-2 rounded-full hover:bg-brand-ink/70 transition-all z-10"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-ink/50 text-brand-linen p-2 rounded-full hover:bg-brand-ink/70 transition-all z-10"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </React.Fragment>
      </div>
      <div className="relative z-40 scrollbar-thin scrollbar-track-brand-sand scrollbar-thumb-brand-terracotta flex w-full justify-center space-x-2 px-4 overflow-x-scroll pb-2">
        {images.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentIndex(index)}
            className={`cursor-pointer flex-shrink-0 ${
              index === currentIndex ? "ring-2 ring-brand-terracotta" : ""
            }`}
          >
            <div className="relative h-[7em] w-[6em]">
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                className="object-cover rounded"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
