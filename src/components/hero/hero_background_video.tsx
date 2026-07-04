"use client";

import { useRef } from "react";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (Number.isFinite(video.duration)) {
      video.currentTime = Math.max(video.duration - 0.05, 0);
    }
  };

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster="/assets/farm/melograni.jpeg"
      aria-hidden
      onEnded={handleEnded}
    >
      <source src="/assets/hero_video.mp4" type="video/mp4" />
    </video>
  );
}
