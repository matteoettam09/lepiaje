"use client";

import { useRef, useState } from "react";

export function HeroBackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    if (Number.isFinite(video.duration)) {
      video.currentTime = Math.max(video.duration - 0.05, 0);
    }
  };

  return (
    <div className="absolute inset-0 bg-brand-ink" aria-hidden>
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setIsReady(true)}
        onEnded={handleEnded}
      >
        <source
          src="/assets/villa_perlata/esterni/hero_video.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
}
