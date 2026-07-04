"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TUSCIA_IMAGE_PLACEHOLDER } from "@/constants/tuscia_place_images";

interface PlaceInfoProps {
  name: string;
  about: string;
  image: string;
  link: string;
  linkLabel: string;
  priority?: boolean;
}

export default function PlaceInfo({
  name,
  about,
  image,
  link,
  linkLabel,
  priority = false,
}: PlaceInfoProps) {
  const isExternal = link.startsWith("http");
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const displayImage = failed || !image ? TUSCIA_IMAGE_PLACEHOLDER : image;

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
  }, [image]);

  return (
    <Card className="flex w-full flex-col lg:h-full lg:max-h-full lg:overflow-hidden">
      <CardHeader className="shrink-0 pb-3">
        <CardTitle className="text-brand-ink">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-brand-muted lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div className="relative aspect-[3/2] max-h-[140px] w-full shrink-0 overflow-hidden rounded-lg bg-brand-stone lg:aspect-[16/10] lg:max-h-none">
          {!loaded && !failed ? (
            <div className="absolute inset-0 animate-pulse bg-brand-sand" />
          ) : null}
          <Image
            key={displayImage}
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            priority={priority}
            className={`object-cover transition-opacity duration-200 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setFailed(true);
              setLoaded(true);
            }}
          />
        </div>
        <p className="whitespace-pre-line text-sm leading-relaxed">{about}</p>
        {isExternal ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-brand-terracotta transition-colors hover:text-brand-terracotta-dark hover:underline"
          >
            {linkLabel}
          </a>
        ) : (
          <Link
            href={link}
            className="inline-block text-sm font-semibold text-brand-terracotta transition-colors hover:text-brand-terracotta-dark hover:underline"
          >
            {linkLabel}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
