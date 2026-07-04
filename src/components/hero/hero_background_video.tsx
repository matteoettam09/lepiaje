"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HERO_POSTER,
  HERO_VIDEO_DESKTOP,
  HERO_VIDEO_MOBILE,
} from "@/constants/hero_video";
import heroPoster from "../../../public/assets/villa_perlata/esterni/main.jpeg";

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function shouldSkipVideo() {
  const connection = (
    navigator as Navigator & {
      connection?: {
        saveData?: boolean;
        effectiveType?: string;
      };
    }
  ).connection;
  if (!connection) return false;

  if (connection.saveData) return true;

  const effectiveType = connection.effectiveType;
  return effectiveType === "slow-2g" || effectiveType === "2g";
}

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobileViewport();
  const [skipVideo, setSkipVideo] = useState(false);
  const [failed, setFailed] = useState(false);

  const showVideo = !prefersReducedMotion && !skipVideo && !failed;
  const videoSrc = isMobile ? HERO_VIDEO_MOBILE : HERO_VIDEO_DESKTOP;

  useEffect(() => {
    setSkipVideo(shouldSkipVideo());
  }, []);

  useEffect(() => {
    setFailed(false);
  }, [videoSrc, showVideo]);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (Number.isFinite(video.duration)) {
      video.currentTime = Math.max(video.duration - 0.05, 0);
    }
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => setFailed(true));
  };

  return (
    <div className="absolute inset-0">
      <Image
        src={heroPoster}
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover"
      />
      {showVideo ? (
        <video
          ref={videoRef}
          key={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          playsInline
          preload={isMobile ? "metadata" : "auto"}
          poster={HERO_POSTER}
          aria-hidden
          onError={() => setFailed(true)}
          onLoadedData={handleLoadedData}
          onEnded={handleEnded}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
