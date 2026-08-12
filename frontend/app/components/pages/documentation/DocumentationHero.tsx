// app/components/pages/documentation/DocumentationHero.tsx
"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Download,
  Sparkles,
  Play,
  Shield,
  Zap,
  Clock,
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

const STATS = [
  { icon: Zap, value: "100+", label: "Files at Once" },
  { icon: Clock, value: "5 min", label: "Quick Setup" },
  { icon: Shield, value: "Secure", label: "API Key Safe" },
] as const;

const QUICK_STEPS = [
  { number: 1, title: "Enter API Key", description: "Paste your ElevenLabs API key" },
  { number: 2, title: "Paste Scripts", description: "Separate with blank lines" },
  { number: 3, title: "Generate & Download", description: "Get your ZIP file instantly" },
] as const;

export const DocumentationHero = () => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-96 w-96 animate-pulse rounded-full bg-primary/20 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-[420px] w-[420px] animate-pulse rounded-full bg-secondary/20 blur-[180px]" style={{ animationDelay: "1s" }} />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[200px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/50 to-background" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 lg:flex-row lg:gap-20">
        {/* Left Content */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex-1"
        >
          {/* Badge with glow */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed/80 px-5 py-2 backdrop-blur-sm shadow-lg shadow-primary/10">
            <Sparkles size={16} className="text-primary" />
            <Paragraph size="sm" className="font-semibold text-primary">
              Bulk Audio Generator v2.0
            </Paragraph>
          </div>

          <Heading as="h1" size="4xl" weight="extrabold" className="leading-tight">
            Generate{" "}
            <Span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Bulk AI Voices
            </Span>{" "}
            with ElevenLabs
          </Heading>

          <Paragraph size="lg" className="mt-6 max-w-2xl leading-8 text-on-surface-variant">
            Transform your scripts into high-quality AI voices in bulk.
            Configure ElevenLabs, generate hundreds of audio files,
            and download them instantly — all in one powerful platform.
          </Paragraph>

          {/* CTA Buttons with hover lift */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              leftIcon={<Play size={18} />}
              className="shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
            >
              Get Started Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              leftIcon={<BookOpen size={18} />}
              className="transition-all hover:scale-105"
            >
              View Documentation
            </Button>
          </div>

          {/* Stats with glassmorphism */}
          <div className="mt-12 grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </motion.div>

        {/* Right - Feature Card with Glassmorphism */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex-1"
        >
          <motion.div {...floatAnimation}>
            <Card className="overflow-hidden rounded-[32px] border-primary/10 bg-white/80 shadow-2xl backdrop-blur-xl transition-all hover:shadow-primary/20">
              <CardContent className="space-y-6 p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-primary to-secondary p-3 text-white shadow-lg shadow-primary/30">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <Heading as="h3" size="lg" weight="bold">
                      Start in Seconds
                    </Heading>
                    <Paragraph size="sm" className="text-on-surface-variant">
                      No complex setup required
                    </Paragraph>
                  </div>
                </div>

                {/* Quick Steps with glass hover */}
                <div className="space-y-3">
                  {QUICK_STEPS.map((step) => (
                    <div
                      key={step.number}
                      className="group flex items-center gap-4 rounded-2xl bg-surface-container/60 p-4 transition-all hover:bg-primary-fixed/20 hover:shadow-md"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-bold text-sm shadow-md transition-all group-hover:scale-110">
                        {step.number}
                      </div>
                      <div>
                        <Paragraph weight="semibold">{step.title}</Paragraph>
                        <Paragraph size="sm" className="text-on-surface-variant">
                          {step.description}
                        </Paragraph>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature Badges with glass */}
                <div className="grid grid-cols-2 gap-3">
                  <FeatureBadge icon={Download} label="ZIP Export" />
                  <FeatureBadge icon={Shield} label="Privacy First" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Stat Card Component - enhanced with glass and hover lift
interface StatCardProps {
  icon: React.ElementType;
  value: string;
  label: string;
}

const StatCard = ({ icon: Icon, value, label }: StatCardProps) => (
  <motion.div
    variants={fadeInUp}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className="group rounded-2xl border border-outline-variant bg-white/40 p-5 text-center backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
  >
    <div className="mb-2 flex justify-center text-primary transition-transform group-hover:scale-110">
      <Icon size={20} />
    </div>
    <Heading as="h3" size="xl" weight="bold" className="text-primary">
      {value}
    </Heading>
    <Paragraph size="sm" className="mt-1 text-on-surface-variant">
      {label}
    </Paragraph>
  </motion.div>
);

// Feature Badge Component
interface FeatureBadgeProps {
  icon: React.ElementType;
  label: string;
}

const FeatureBadge = ({ icon: Icon, label }: FeatureBadgeProps) => (
  <div className="flex items-center gap-2 rounded-xl bg-primary-fixed/30 px-3 py-2 backdrop-blur-sm transition-all hover:bg-primary-fixed/50">
    <Icon size={16} className="text-primary" />
    <Paragraph size="sm" className="font-medium">
      {label}
    </Paragraph>
  </div>
);