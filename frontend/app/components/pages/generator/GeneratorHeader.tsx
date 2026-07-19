"use client";

import {
  AudioLines,
  Sparkles,
  Zap,
  Download,
} from "lucide-react";
import { Paragraph } from "../../typography/Paragraph";
import { Heading } from "../../typography/Heading";
import { Span } from "../../typography/Span";
import { Card } from "../../ui/Card";



const STATS = [
  {
    icon: AudioLines,
    title: "Unlimited",
    subtitle: "Audio Generation",
  },
  {
    icon: Zap,
    title: "Parallel",
    subtitle: "Voice Processing",
  },
  {
    icon: Download,
    title: "ZIP",
    subtitle: "One Click Download",
  },
];

export const GeneratorHeader = () => {
  return (
    <section className="relative overflow-hidden">

      {/* Background */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="animate-hero-glow absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />

        <div className="animate-hero-glow absolute bottom-0 right-0 h-[480px] w-[480px] rounded-full bg-secondary/10 blur-[160px]" />

        <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-fixed/40 blur-[120px]" />

      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center">

        {/* Badge */}

        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary-fixed px-5 py-2 shadow-sm">

          <Sparkles
            size={18}
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
          size="4xl"
          weight="extrabold"
          className="max-w-5xl leading-tight"
        >
          Generate

          <Span
            className="mx-3 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
            weight="extrabold"
          >
            Bulk AI Voices
          </Span>

          in Seconds
        </Heading>

        {/* Description */}

        <Paragraph
          size="lg"
          className="mt-8 max-w-3xl leading-8 text-on-surface-variant"
        >
          Convert hundreds of text scripts into natural sounding AI voices
          using your own ElevenLabs API key. Generate multiple audio files
          simultaneously and automatically download everything as a ZIP archive.
        </Paragraph>

        {/* Stats */}

        <div className="mt-14 grid w-full gap-6 md:grid-cols-3">

          {STATS.map(({ icon: Icon, title, subtitle }) => (

            <Card
              key={title}
              className="group rounded-3xl border-outline-variant bg-surface transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl"
            >

              <div className="flex flex-col items-center p-8">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary transition-transform duration-300 group-hover:scale-110">

                  <Icon size={30} />

                </div>

                <Heading
                  as="h3"
                  size="xl"
                  weight="bold"
                >
                  {title}
                </Heading>

                <Paragraph
                  className="mt-2 text-center text-on-surface-variant"
                >
                  {subtitle}
                </Paragraph>

              </div>

            </Card>

          ))}

        </div>

      </div>
    </section>
  );
};