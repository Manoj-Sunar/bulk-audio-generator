// app/components/pages/documentation/QuickStartGuide.tsx
import {
  KeyRound,
  FileText,
  Zap,
  Download,
  ArrowRight,
} from "lucide-react";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";
import Link from "next/link";

const STEPS = [
  {
    icon: KeyRound,
    title: "Get Your API Key",
    description:
      "Log in to ElevenLabs, navigate to Developers → API Keys, and create a new API key.",
  },
  {
    icon: FileText,
    title: "Enter Your Scripts",
    description:
      "Paste your scripts in the editor. Separate each script with a blank line.",
  },
  {
    icon: Zap,
    title: "Generate Audio",
    description:
      "Click Generate Audio and watch as your files are created in real-time.",
  },
  {
    icon: Download,
    title: "Download Files",
    description:
      "Download all generated audio files individually or as a single ZIP archive.",
  },
] as const;

export const QuickStartGuide = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* ✅ एक blur मात्र */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 px-5 py-2 backdrop-blur-sm shadow-sm">
            <Zap size={18} className="text-primary" />
            <Paragraph size="sm" className="font-medium text-primary">
              Quick Start Guide
            </Paragraph>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold" className="text-center">
            Get Started in
            <Span size="5xl" weight="extrabold" className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              4 Simple Steps
            </Span>
          </Heading>

          <Paragraph
            size="lg"
            className="mt-6 text-on-surface-variant/80 text-center max-w-2xl mx-auto"
          >
            Follow these steps to start generating bulk AI voices with
            ElevenLabs.
          </Paragraph>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="group h-full rounded-2xl border border-primary/5 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/10 hover:shadow-md hover:shadow-primary/5"
              >
                <CardContent className="flex h-full flex-col items-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
                      <Icon size={28} />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-primary text-xs font-semibold shadow-sm">
                      {index + 1}
                    </div>
                  </div>
                  <Heading
                    as="h4"
                    size="lg"
                    weight="semibold"
                    className="text-on-surface"
                  >
                    {step.title}
                  </Heading>
                  <Paragraph className="mt-3 text-on-surface-variant/80 text-sm leading-relaxed">
                    {step.description}
                  </Paragraph>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex justify-center">
          <Link href={"/generator"}>
          <Button
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            className="shadow-sm shadow-primary/10 transition-transform duration-200 hover:scale-105"
            >
            Start Generating Audio
          </Button>
            </Link>
        </div>
      </div>
    </section>
  );
};