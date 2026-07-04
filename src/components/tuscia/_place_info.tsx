import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlaceInfoProps {
  name: string;
  about: string;
  image: string;
  link: string;
  linkLabel: string;
}

export default function PlaceInfo({
  name,
  about,
  image,
  link,
  linkLabel,
}: PlaceInfoProps) {
  const isExternal = link.startsWith("http");

  return (
    <Card className="flex h-full max-h-full w-full flex-col overflow-hidden">
      <CardHeader className="shrink-0 pb-3">
        <CardTitle className="text-brand-ink">{name}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-4 overflow-y-auto text-brand-muted">
        {image ? (
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg">
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        ) : null}
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
