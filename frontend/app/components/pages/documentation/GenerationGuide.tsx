// app/components/pages/documentation/GenerationGuide.tsx
"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  FileText,
  Mic,
  Download,
  Zap,
  CheckCircle2,
  ArrowRight,
  Play,
  FolderArchive,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";
import { ImageWithLightbox } from "../../ui/ImageWithLightBox";


const steps = [
  {
    icon: KeyRound,
    title: "Enter Your API Key",
    description: "Paste your ElevenLabs API key into the secure input field. Your key is stored locally and never leaves your browser.",
    image: "/api_key_card.png",
    alt: "ElevenLabs API Key Input",
  },
  {
    icon: FileText,
    title: "Write Your Scripts",
    description: "Type or paste your scripts in the editor. Separate each script with a blank line to generate individual audio files.",
    image: "/script.png",
    alt: "Script Editor",
  },
  {
    icon: Mic,
    title: "Choose Voice Profile",
    description: "Select your preferred voice from the available profiles. The Adam voice is selected by default.",
    image: "/voice_list.png",
    alt: "Voice Selection",
  },
  {
    icon: Zap,
    title: "Generate Audio",
    description: "Click Generate Audio and watch as your scripts are processed in parallel. Real-time progress shows each completed file.",
    image: "/generating.png",
    alt: "Generating Audio",
  },
  {
    icon: Download,
    title: "Download Your Files",
    description: "Once generation completes, download all files individually or as a single ZIP archive.",
    image: "/generation_success.png",
    alt: "Download Audio Files",
  },
];

export const GenerateGuide = () => {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2">
            <Zap size={18} className="text-primary" />
            <Paragraph size="sm" className="font-semibold text-primary">
              Step-by-Step Guide
            </Paragraph>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold">
            Generate Bulk Audio
            <Span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              In 5 Simple Steps
            </Span>
          </Heading>

          <Paragraph size="lg" className="mt-6 text-on-surface-variant">
            Follow this visual guide to generate hundreds of AI voices with
            ElevenLabs. Each step includes a screenshot to help you navigate
            the process. Click any image to enlarge.
          </Paragraph>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-16"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div key={step.title} variants={fadeInUp}>
                <Card className="overflow-hidden rounded-3xl border-outline-variant shadow-sm transition-all duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <div className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-center p-8 lg:p-12">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                            <Icon size={28} />
                          </div>
                          <div>
                            <Paragraph size="sm" className="font-semibold uppercase tracking-widest text-primary">
                              Step {index + 1}
                            </Paragraph>
                            <Heading as="h4" size="xl" weight="bold">
                              {step.title}
                            </Heading>
                          </div>
                        </div>

                        <Paragraph className="max-w-lg leading-8 text-on-surface-variant">
                          {step.description}
                        </Paragraph>

                        {index === 0 && (
                          <div className="mt-6 rounded-2xl bg-primary-fixed p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                                <CheckCircle2 size={16} />
                              </div>
                              <div>
                                <Paragraph size="sm" className="font-semibold text-primary">
                                  Privacy First
                                </Paragraph>
                                <Paragraph size="sm" className="text-on-surface-variant">
                                  Your API key is saved only in your browser's localStorage.
                                  It is never stored on our servers.
                                </Paragraph>
                              </div>
                            </div>
                          </div>
                        )}

                        {index === 4 && (
                          <div className="mt-6 flex flex-wrap gap-3">
                            <Button size="sm" rightIcon={<FolderArchive size={16} />}>
                              Download ZIP
                            </Button>
                            <Button size="sm" variant="outline" rightIcon={<Play size={16} />}>
                              Preview Audio
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Image with Lightbox */}
                      <div className="flex-1 bg-surface-container/50 p-6 lg:p-8">
                        <ImageWithLightbox
                          src={step.image}
                          alt={step.alt}
                          width={600}
                          height={400}
                          containerClassName="aspect-[4/3]"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Tips - unchanged */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="rounded-3xl border-primary/20 bg-primary-fixed shadow-sm">
            <CardContent className="p-10">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">
                  <Zap size={32} />
                </div>

                <Heading as="h3" size="2xl" weight="bold">
                  Quick Tips for Success
                </Heading>

                <div className="mt-8 grid gap-6 text-left md:grid-cols-2">
                  <div className="rounded-2xl bg-white/50 p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary" size={20} />
                      <Paragraph weight="semibold">Separate Scripts</Paragraph>
                    </div>
                    <Paragraph className="mt-2 text-on-surface-variant">
                      Use a blank line between each script to generate separate audio files.
                    </Paragraph>
                  </div>

                  <div className="rounded-2xl bg-white/50 p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary" size={20} />
                      <Paragraph weight="semibold">API Key Format</Paragraph>
                    </div>
                    <Paragraph className="mt-2 text-on-surface-variant">
                      Your ElevenLabs API key starts with "sk_" followed by a long string.
                    </Paragraph>
                  </div>

                  <div className="rounded-2xl bg-white/50 p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary" size={20} />
                      <Paragraph weight="semibold">Real-time Progress</Paragraph>
                    </div>
                    <Paragraph className="mt-2 text-on-surface-variant">
                      Watch live progress with file count and estimated time remaining.
                    </Paragraph>
                  </div>

                  <div className="rounded-2xl bg-white/50 p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-primary" size={20} />
                      <Paragraph weight="semibold">ZIP Download</Paragraph>
                    </div>
                    <Paragraph className="mt-2 text-on-surface-variant">
                      All generated files are available for download as a single ZIP archive.
                    </Paragraph>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <Button size="lg" rightIcon={<ArrowRight size={18} />}>
            Start Generating Audio
          </Button>
        </motion.div>
      </div>
    </section>
  );
};