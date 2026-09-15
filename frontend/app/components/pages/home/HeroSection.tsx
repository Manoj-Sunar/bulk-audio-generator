// app/components/pages/home/HeroSection.tsx
// ✅ Server Component

import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, ShieldCheck, ArrowRight, Bot } from "lucide-react";

import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Background } from "../../ui/Background";

export const DocsHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center">
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

            {/* ✅ H1 — Main keyword exact-match */}
            <h1 className="animate-slideInLeft animation-delay-200 text-4xl font-extrabold leading-[1.05] tracking-tight text-on-background sm:text-5xl lg:text-6xl">
              Bulk Audio Generator —{" "}
              <Span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Generate 100+ AI Voices
              </Span>{" "}
              in One Click
            </h1>

            {/* Description */}
            <p className="animate-slideInLeft animation-delay-400 max-w-xl text-lg leading-8 text-on-surface-variant/80">
              Convert hundreds of text scripts into natural-sounding AI voices
              using your own{" "}
              <strong className="font-semibold text-primary">ElevenLabs</strong>{" "}
              or{" "}
              <strong className="font-semibold text-secondary">
                Google AI Studio
              </strong>{" "}
              API key. Download all generated audio files instantly as a ZIP
              archive — save hours of manual work.
            </p>

            {/* Buttons */}
            <div className="animate-slideInLeft animation-delay-600 flex flex-wrap gap-4">
              <Link href="/bulk-audio/generator">
                <Button
                  size="lg"
                  className="rounded-full px-8 shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 group"
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

          {/* RIGHT — Hero Image */}
          <div className="animate-slideInRight animation-delay-400 relative flex justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[120px]" />

            <div className="animate-float relative overflow-visible">
              <Card className="rounded-[36px] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20">
                <CardContent className="p-0">
                  <Image
                    src="/hero.jpg"
                    alt="Bulk Audio Generator interface showing batch text-to-speech generation with ElevenLabs and Google AI Studio"
                    width={700}
                    height={700}
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
                    className="rounded-[28px] object-cover shadow-lg"
                  />
                </CardContent>

                {/* Floating Stats — ✅ mobile मा पनि देखिन्छ */}
                <div className="animate-slideInLeft animation-delay-600 absolute -left-6 top-10 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:px-5 sm:py-4">
                  <Paragraph className="font-bold text-base sm:text-xl">
                    ⚡ 10,000+
                  </Paragraph>
                  <Paragraph size="sm" color="muted">
                    Voices Generated
                  </Paragraph>
                </div>

                <div className="animate-slideInRight animation-delay-600 absolute -right-6 bottom-10 rounded-2xl border border-white/50 bg-white/90 px-4 py-3 shadow-xl backdrop-blur sm:px-5 sm:py-4">
                  <Paragraph className="font-bold text-base sm:text-xl">
                    🚀 5× Faster
                  </Paragraph>
                  <Paragraph size="sm" color="muted">
                    Than Manual Workflow
                  </Paragraph>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};