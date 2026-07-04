"use client";

import { useRef, useState } from "react";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (Number.isFinite(video.duration)) {
      video.currentTime = Math.max(video.duration - 0.05, 0);
    }
  };

  if (failed) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-hidden
      onError={() => setFailed(true)}
      onEnded={handleEnded}
    >
      <source
        src="/assets/villa_perlata/esterni/hero_video.mp4"
        type="video/mp4"
      />
    </video>
  );
}
