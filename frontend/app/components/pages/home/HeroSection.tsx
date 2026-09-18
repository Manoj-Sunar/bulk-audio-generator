// app/components/pages/home/HeroSection.tsx
// ✅ Server Component


import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, ArrowRight, Bot } from "lucide-react";

import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";

import { Background } from "../../ui/Background";



/**
 * Hero YouTube video — the demo video shown in the right column.
 * Change this URL to any YouTube link to update the hero.
 */


export const DocsHeroSection = async () => {
  // Fetch YouTube metadata on the server (cached for 1 hour).
  // Falls back gracefully to null if the video is unavailable.
 

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-background">
      <Background />

      <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* LEFT — Content (Server-rendered) */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="animate-slideInLeft">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2 shadow-sm">
                <Sparkles size={16} className="text-primary" />
                <Paragraph size="sm" className="font-semibold text-primary">
                  Powered by ElevenLabs & Google AI Studio
                </Paragraph>
              </div>
            </div>

            {/* ✅ H1 — Primary keyword exact-match */}
            <h1 className="animate-slideInLeft animation-delay-200 text-4xl font-extrabold leading-[1.05] tracking-tight text-on-background sm:text-5xl lg:text-6xl">
              Free AI Voice Generator{" "}
              <Span
                size="6xl"
                weight="extrabold"
                className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              >
                Generate Bulk AI Voice Files
              </Span>{" "}
              in One Click
            </h1>

            {/* Description */}
            <p className="animate-slideInLeft animation-delay-400 max-w-xl text-lg leading-8 text-on-surface-variant/80">
              Convert hundreds of text scripts into natural AI voices using your own{" "}
              <strong className="font-semibold text-primary">ElevenLabs API</strong>{" "}
              or{" "}
              <strong className="font-semibold text-secondary">
                Google AI Studio
              </strong>{" "}
              key. Supports 70+ languages, voice cloning, and emotional inflections.
              Download all audio files instantly as a ZIP — no credit card required.
            </p>

            {/* Buttons */}
            <div className="animate-slideInLeft animation-delay-600 flex flex-wrap gap-4">
              <Link href="/generator">
                <Button
                  size="lg"
                  className="group rounded-full px-8 shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
                >
                  Get Started Free
                  <ArrowRight
                    size={18}
                    className="ml-2 transition-transform group-hover:translate-x-1"
                  />
                </Button>
              </Link>
              <Link href="/bulk-audio/documentation">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-outline-variant bg-white/50 px-8 backdrop-blur-sm transition-all hover:border-primary hover:bg-primary/5"
                >
                  View Documentation
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="animate-slideInBottom animation-delay-600 flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Zap size={16} className="text-primary" />
                </div>
                <Paragraph size="sm" className="font-medium">
                  Lightning Fast
                </Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <ShieldCheck size={16} className="text-primary" />
                </div>
                <Paragraph size="sm" className="font-medium">
                  Secure API Keys
                </Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <span className="text-sm">📦</span>
                </div>
                <Paragraph size="sm" className="font-medium">
                  Instant ZIP Export
                </Paragraph>
              </div>
            </div>

            {/* Provider Badges */}
            <div className="animate-slideInBottom animation-delay-600 flex flex-wrap gap-3 pt-2">
              <a
                href="https://elevenlabs.io/app/home"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-primary/10 bg-primary-fixed/30 px-4 py-1.5"
              >
                <Sparkles size={14} className="text-primary" />
                <Paragraph size="sm" className="font-medium text-primary">
                  ElevenLabs
                </Paragraph>
              </a>
              <a
                href="https://aistudio.google.com/prompts/new_chat"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-secondary/10 bg-secondary-fixed/30 px-4 py-1.5"
              >
                <Bot size={14} className="text-secondary" />
                <Paragraph size="sm" className="font-medium text-secondary">
                  Google AI Studio
                </Paragraph>
              </a>
            </div>
          </div>

          {/* RIGHT — YouTube Video (thumbnail + click-to-play) */}
          <div className="animate-slideInRight animation-delay-400 relative flex justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[120px]" />

           
          </div>
        </div>
      </div>
    </section>
  );
};