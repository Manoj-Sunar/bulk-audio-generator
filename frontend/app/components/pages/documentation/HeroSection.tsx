import Image from "next/image";
import { Sparkles, Zap, ShieldCheck } from "lucide-react";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";

import { Button } from "../../ui/Button";
import {
  Card,
  CardContent,
} from "../../ui/Card";

export const DocsHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background */}

      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="animate-hero-glow absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[150px]" />

        <div className="animate-hero-glow absolute -right-52 bottom-0 h-[550px] w-[550px] rounded-full bg-secondary/15 blur-[180px]" />

        <div className="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-primary-fixed/30 blur-[140px]" />
      </div>

      <div className="container mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-20 px-6 py-16 lg:grid-cols-2 lg:px-10">

        {/* LEFT */}

        <div className="space-y-8">

          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2 shadow-sm">

            <Sparkles
              size={16}
              className="text-primary"
            />

            <Paragraph
              size="sm"
              className="font-semibold text-primary"
            >
              Powered by ElevenLabs API
            </Paragraph>

          </div>

          {/* Heading */}

          <Heading
            as="h1"
            size="3xl"
            weight="extrabold"
            className="leading-[1.05] tracking-tight text-on-background"
          >
            Generate

            <Span className="mx-2 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent text-5xl font-bold">
              100+
            </Span>

            Bulk AI Voices {""}

          

            <Span className="text-on-background" size="5xl" weight="bold">
              in One Click
            </Span>
          </Heading>

          {/* Description */}

          <Paragraph
            size="lg"
            className="max-w-xl leading-8 text-on-surface-variant"
          >
            Upload hundreds of scripts, generate AI voices in parallel,
            and download everything instantly using your own
            ElevenLabs API key. Save hours of manual work with
            blazing-fast AI voice generation.
          </Paragraph>

          {/* Buttons */}

          <div className="flex flex-wrap gap-4">

            <Button
              size="lg"
              className="rounded-full px-8 shadow-xl shadow-primary/25"
            >
              Get Started
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="rounded-full border-outline bg-surface px-8"
            >
              Documentation
            </Button>

          </div>

          {/* Features */}

          <div className="flex flex-wrap gap-6 pt-4">

            <div className="flex items-center gap-2">

              <Zap
                size={18}
                className="text-primary"
              />

              <Paragraph size="sm">
                Lightning Fast
              </Paragraph>

            </div>

            <div className="flex items-center gap-2">

              <ShieldCheck
                size={18}
                className="text-primary"
              />

              <Paragraph size="sm">
                Secure API Keys
              </Paragraph>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="relative flex justify-center">

          {/* Glow */}

          <div className="absolute inset-0 rounded-full bg-primary/15 blur-[120px]" />

          {/* Floating Card */}

          <Card className="animate-hero-float relative overflow-visible rounded-[36px] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:rotate-0 hover:scale-[1.02]">

            <CardContent className="p-0">

              <Image
                src="/hero.jpg"
                alt="Bulk Voice Generator"
                width={700}
                height={700}
                priority
                className="rounded-[28px] object-cover shadow-lg"
              />

            </CardContent>

            {/* Floating Stat */}

            <Card className="animate-hero-float-slow absolute -left-8 top-10 hidden rounded-2xl border-none bg-white/90 px-5 py-4 shadow-xl backdrop-blur lg:block">

              <Paragraph
                className="font-bold"
              >
                ⚡ 10,000+
              </Paragraph>

              <Paragraph
                size="sm"
                color="muted"
              >
                Voices Generated
              </Paragraph>

            </Card>

            {/* Floating Stat */}

            <Card className="animate-hero-float absolute -right-8 bottom-10 hidden rounded-2xl border-none bg-white/90 px-5 py-4 shadow-xl backdrop-blur lg:block">

              <Paragraph
                className="font-bold"
              >
                🚀 5× Faster
              </Paragraph>

              <Paragraph
                size="sm"
                color="muted"
              >
                Than Manual Workflow
              </Paragraph>

            </Card>

          </Card>

        </div>

      </div>
    </section>
  );
};