// app/components/ui/YouTubeHeroCard.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

import { Card, CardContent } from "./Card";
import { Paragraph } from "../typography/Paragraph";
import type { YouTubeMetadata } from "@/app/lib/youtube";
import { cn } from "@/app/lib/helpers";

interface YouTubeHeroCardProps {
  metadata: YouTubeMetadata | null;
  /** Optional className for the outer wrapper */
  className?: string;
}

/**
 * Hero-optimized YouTube card.
 *
 * - Renders the thumbnail instantly (no iframe cost on first paint)
 * - Click the play button → swaps in a YouTube iframe (autoplay)
 * - Keeps the decorative floating stat cards from the original design
 */
export function YouTubeHeroCard({ metadata, className }: YouTubeHeroCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  /* -------------------------------------------------------------- */
  /* Fallback: metadata failed to load                              */
  /* -------------------------------------------------------------- */
  if (!metadata) {
    return (
      <Card
        className={cn(
          "rounded-[36px] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl",
          className
        )}
      >
        <CardContent className="flex aspect-video items-center justify-center rounded-[28px] bg-gradient-to-br from-slate-100 to-slate-200">
          <Paragraph size="sm" color="muted">
            Video unavailable
          </Paragraph>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "rounded-[36px] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20",
        className
      )}
    >
      <CardContent className="p-0">
        {/* ---------------- Video Container ---------------- */}
        <div className="relative aspect-video w-full overflow-hidden rounded-[28px] bg-slate-900 shadow-lg">
          {isPlaying ? (
            /* ---------- Playing: iframe ---------- */
            <iframe
              src={`${metadata.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={metadata.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            /* ---------- Idle: thumbnail + play button ---------- */
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play video: ${metadata.title}`}
              className="group absolute inset-0 h-full w-full cursor-pointer"
            >
              <Image
                src={metadata.thumbnailUrl}
                alt={metadata.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized // YouTube CDN is already optimized
              />

              {/* Dark gradient overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                  <Play className="ml-1 h-9 w-9 fill-white text-white" />
                </div>
              </div>

              {/* Title overlay at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-left sm:p-5">
                <Paragraph
                  size="xs"
                  weight="semibold"
                  className="mb-1 inline-block rounded-full bg-red-600 px-2 py-0.5 text-white"
                >
                  ▶ YouTube
                </Paragraph>
                <Paragraph
                  size="sm"
                  weight="semibold"
                  className="line-clamp-2 text-white drop-shadow-md sm:text-base"
                >
                  {metadata.title}
                </Paragraph>
                <Paragraph size="xs" className="mt-0.5 text-white/70">
                  {metadata.authorName}
                </Paragraph>
              </div>
            </button>
          )}
        </div>

        {/* ---------------- Floating Stat: Top-Left ---------------- */}
        <div className="animate-slideInLeft animation-delay-600 absolute -left-6 top-10 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:px-5 sm:py-4">
          <Paragraph className="text-base font-bold sm:text-xl">
            ⚡ 10,000+
          </Paragraph>
          <Paragraph size="sm" color="muted">
            Voices Generated
          </Paragraph>
        </div>

        {/* ---------------- Floating Stat: Bottom-Right ---------------- */}
        <div className="animate-slideInRight animation-delay-600 absolute -right-6 bottom-10 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:px-5 sm:py-4">
          <Paragraph className="text-base font-bold sm:text-xl">
            🚀 5× Faster
          </Paragraph>
          <Paragraph size="sm" color="muted">
            Than Manual Workflow
          </Paragraph>
        </div>
      </CardContent>
    </Card>
  );
}