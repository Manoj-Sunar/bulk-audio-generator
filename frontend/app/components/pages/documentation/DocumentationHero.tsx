"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Sparkles,
  Terminal,
} from "lucide-react";

import {
  fadeInLeft,
  fadeInRight,
  fadeInUp,
  floatAnimation,
} from "@/app/lib/animations";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { FaGithub } from "react-icons/fa";

export const DocumentationHero = () => {
  return (
    <section className="relative overflow-hidden py-24">

      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/10 blur-[150px]" />

        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] rounded-full bg-secondary/10 blur-[180px]" />

      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-20 px-6 lg:flex-row">

        {/* Left */}

        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex-1"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2">

            <Sparkles
              size={18}
              className="text-primary"
            />

            <Paragraph
              size="sm"
              className="font-semibold text-primary"
            >
              Complete Documentation
            </Paragraph>

          </div>

          <Heading
            as="h1"
            size="4xl"
            weight="extrabold"
            className="leading-tight"
          >
            Everything you need to
            <br />

            <Span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Install, Configure &
              Generate
            </Span>

            <br />

            Bulk AI Voices
          </Heading>

          <Paragraph
            size="lg"
            className="mt-8 max-w-2xl leading-8 text-on-surface-variant"
          >
            Learn how to install the project, configure
            ElevenLabs, generate hundreds of AI voices,
            download ZIP files, and integrate your own
            backend. This guide covers everything from
            beginner setup to production deployment.
          </Paragraph>

          <div className="mt-10 flex flex-wrap gap-4">

            <Button
              size="lg"
              leftIcon={<BookOpen size={18} />}
            >
              Start Reading
            </Button>

            <Button
              variant="outline"
              size="lg"
              leftIcon={<FaGithub size={18} />}
            >
              View Source
            </Button>

          </div>

          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">

            <HeroStat
              value="10+"
              label="Guides"
            />

            <HeroStat
              value="15"
              label="Sections"
            />

            <HeroStat
              value="5 min"
              label="Setup"
            />

            <HeroStat
              value="100%"
              label="Open Source"
            />

          </div>

        </motion.div>

        {/* Right */}

        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex-1"
        >
          <motion.div
            {...floatAnimation}
          >
            <Card className="overflow-hidden rounded-[32px] border-outline-variant bg-white/80 shadow-2xl backdrop-blur">

              <CardContent className="space-y-6 p-8">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-primary-fixed p-3">

                    <Terminal className="text-primary" />

                  </div>

                  <Heading
                    as="h3"
                    size="lg"
                    weight="bold"
                  >
                    Quick Installation
                  </Heading>

                </div>

                <div className="space-y-4 rounded-2xl bg-[#111827] p-6 font-mono text-sm text-green-400">

                  <p>git clone your-repository</p>

                  <p>cd bulk-audio-generator</p>

                  <p>npm install</p>

                  <p>npm run dev</p>

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <FeatureCard
                    icon={<Download size={18} />}
                    title="ZIP Export"
                    desc="Download every generated voice instantly."
                  />

                  <FeatureCard
                    icon={<Terminal size={18} />}
                    title="Developer Ready"
                    desc="Next.js + FastAPI architecture."
                  />

                </div>

              </CardContent>

            </Card>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

interface HeroStatProps {
  value: string;
  label: string;
}

function HeroStat({
  value,
  label,
}: HeroStatProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="rounded-2xl border border-outline-variant bg-surface-container p-5"
    >
      <Heading
        as="h3"
        size="xl"
        weight="bold"
        className="text-primary"
      >
        {value}
      </Heading>

      <Paragraph
        size="sm"
        className="mt-1 text-on-surface-variant"
      >
        {label}
      </Paragraph>
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

function FeatureCard({
  icon,
  title,
  desc,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container p-5">

      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-fixed text-primary">
        {icon}
      </div>

      <Heading
        as="h4"
        size="md"
        weight="bold"
      >
        {title}
      </Heading>

      <Paragraph
        size="sm"
        className="mt-2 text-on-surface-variant"
      >
        {desc}
      </Paragraph>

    </div>
  );
}