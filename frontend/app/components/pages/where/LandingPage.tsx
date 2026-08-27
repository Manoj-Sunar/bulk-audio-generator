// app/components/pages/landing/LandingPage.tsx
"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { lazy, Suspense, useRef, useEffect, useState } from "react";
import {

  Play,
  Clock,
  Video,
  Mic2,
  Edit3,
  Download,
  Zap,
 
  Shield,
  CheckCircle2,
  AlertCircle,

  Sparkles,
  Timer,
  FileAudio,
  Layers,
  Wand2,
  ChevronRight,
  Star,
 
  Rocket,
 
  Infinity,
  Check,
  X,
 
  X as XClose,

} from "lucide-react";
import Link from "next/link";


import { Background } from "@/app/components/ui/Background";
import { Button } from "@/app/components/ui/Button";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Heading } from "@/app/components/typography/Heading";
import { Paragraph } from "@/app/components/typography/Paragraph";
import { Span } from "@/app/components/typography/Span";
import { cn } from "@/app/lib/helpers";

// Lazy load heavy components
const LazyVideoSection = lazy(() =>
  import("./VideoSection").then((mod) => ({ default: mod.VideoSection }))
);

const LazyStatsSection = lazy(() =>
  import("./StatsSection").then((mod) => ({ default: mod.StatsSection }))
);

;

// Types
interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  benefits: string[];
}

interface ProblemPoint {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  stats: string;
  impact: string;
}

interface Step {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  details: string[];
}

interface ComparisonPoint {
  feature: string;
  traditional: string;
  ourSolution: string;
  isPositive: boolean;
}

// Constants - DRY and centralized
const PROBLEMS: ProblemPoint[] = [
  {
    icon: AlertCircle,
    title: "Audio-Video Desync",
    description: "AI-generated audio frequently doesn't align with video timing. Voiceovers arrive late or early, breaking immersion and ruining viewer experience.",
    color: "from-red-500 to-orange-500",
    stats: "85% of creators face sync issues",
    impact: "Loses 60% of viewer retention",
  },
  {
    icon: Timer,
    title: "Manual Clip-by-Clip Editing",
    description: "Each 8-second clip requires individual audio matching. A 10-minute video needs 75+ clips, each demanding precise manual synchronization.",
    color: "from-amber-500 to-yellow-500",
    stats: "75+ clips per 10-min video",
    impact: "8+ hours of manual work",
  },
  {
    icon: Clock,
    title: "Exhausting Production Cycles",
    description: "Generating audio one-by-one, syncing, re-editing, and exporting creates burnout. Your creative energy shouldn't be wasted on mechanical tasks.",
    color: "from-blue-500 to-indigo-500",
    stats: "80% time spent on sync",
    impact: "47 hours saved on average",
  },
];

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Bulk Generation at Scale",
    description: "Generate up to 100 audio clips simultaneously. Paste all scripts at once, get all audio files in seconds, not hours.",
    gradient: "from-indigo-500 to-purple-500",
    benefits: ["100 clips per batch", "2-second per clip", "Real-time progress"],
  },
  {
    icon: Mic2,
    title: "Premium AI Voices",
    description: "Choose from ElevenLabs professional voices or Google Gemini's multilingual library. Natural, expressive voices for every character.",
    gradient: "from-emerald-500 to-teal-500",
    benefits: ["40+ voices available", "Multi-language support", "Customizable tone"],
  },
  {
    icon: Layers,
    title: "Smart Script Parsing",
    description: "Intelligent script detection. Separate with blank lines. Each script becomes a perfectly timed, production-ready audio clip.",
    gradient: "from-rose-500 to-pink-500",
    benefits: ["Auto-detection", "Error correction", "Preview before generation"],
  },
  {
    icon: Download,
    title: "One-Click ZIP Export",
    description: "Download all generated audio files as a single ZIP archive. Ready to import into CapCut, Premiere Pro, Final Cut, or any editor.",
    gradient: "from-cyan-500 to-blue-500",
    benefits: ["Preserves filenames", "Organized structure", "Instant download"],
  },
];

const STEPS: Step[] = [
  {
    icon: Edit3,
    title: "Write Your Scripts",
    description: "Paste your narrative scripts separated by blank lines. Each line becomes one audio clip.",
    gradient: "from-violet-500 to-purple-500",
    details: ["Supports 100+ scripts", "Auto-formatting", "Character counting"],
  },
  {
    icon: Mic2,
    title: "Choose Your AI Voice",
    description: "Pick from premium voices. Match each character or scene with the perfect voice profile.",
    gradient: "from-blue-500 to-indigo-500",
    details: ["40+ voice options", "Preview before select", "Voice customization"],
  },
  {
    icon: Zap,
    title: "Generate All Audio",
    description: "Click generate. Watch as all clips are created simultaneously with real-time progress.",
    gradient: "from-emerald-500 to-green-500",
    details: ["Parallel processing", "Live status updates", "Error handling"],
  },
  {
    icon: Video,
    title: "Edit & Sync Video",
    description: "Import audio to CapCut, Premiere Pro, or Final Cut. Each clip is perfectly timed for your video scenes.",
    gradient: "from-rose-500 to-pink-500",
    details: ["Ready for import", "Perfect sync", "Time saved"],
  },
];

const COMPARISONS: ComparisonPoint[] = [
  {
    feature: "Generation Speed",
    traditional: "2-3 minutes per clip",
    ourSolution: "2-3 seconds per clip",
    isPositive: true,
  },
  {
    feature: "Manual Effort",
    traditional: "8+ hours per video",
    ourSolution: "5-10 minutes per video",
    isPositive: true,
  },
  {
    feature: "Sync Accuracy",
    traditional: "Prone to errors",
    ourSolution: "99.9% accurate sync",
    isPositive: true,
  },
  {
    feature: "Batch Size",
    traditional: "1 clip at a time",
    ourSolution: "100 clips at once",
    isPositive: true,
  },
  {
    feature: "Error Rate",
    traditional: "High due to manual work",
    ourSolution: "Minimal, automated",
    isPositive: true,
  },
  {
    feature: "Scalability",
    traditional: "Limited by time",
    ourSolution: "Unlimited scaling",
    isPositive: true,
  },
];

// Components
const SectionLoader = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

// Premium Problem Card
const ProblemCard = ({ problem, index }: { problem: ProblemPoint; index: number }) => {
  const Icon = problem.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative"
    >
      <Card className="h-full overflow-hidden border-0 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-300/60">
        <div className={`h-1.5 w-full bg-gradient-to-r ${problem.color} group-hover:h-2 transition-all duration-300`} />
        <CardContent className="p-7">
          <div className="flex items-start justify-between">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${problem.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={28} />
            </div>
            <div className="text-right">
              <Span size="xs" className="font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                #{index + 1}
              </Span>
            </div>
          </div>
          <Heading as="h4" size="lg" weight="semibold" className="text-slate-800">
            {problem.title}
          </Heading>
          <Paragraph className="mt-3 text-slate-500 leading-relaxed">
            {problem.description}
          </Paragraph>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-full bg-slate-100/80 px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200/50">
              ⚠️ {problem.stats}
            </div>
            <div className="rounded-full bg-red-50/80 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200/50">
              📉 {problem.impact}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Premium Feature Card
const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative"
    >
      <Card className="h-full overflow-hidden border-0 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-200/30">
        <div className={`h-1.5 w-full bg-gradient-to-r ${feature.gradient} group-hover:h-2 transition-all duration-300`} />
        <CardContent className="p-7">
          <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon size={28} />
          </div>
          <Heading as="h4" size="lg" weight="semibold" className="text-slate-800">
            {feature.title}
          </Heading>
          <Paragraph className="mt-2 text-slate-500 leading-relaxed">
            {feature.description}
          </Paragraph>
          <div className="mt-4 flex flex-wrap gap-2">
            {feature.benefits.map((benefit) => (
              <Span key={benefit} size="xs" className="bg-slate-100/80 px-3 py-1.5 rounded-full text-slate-600 border border-slate-200/50 font-medium">
                ✓ {benefit}
              </Span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Premium Step Card
const StepCard = ({ step, index }: { step: Step; index: number }) => {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
      viewport={{ once: true }}
      className="relative group"
    >
      {index < STEPS.length - 1 && (
        <div className="absolute left-1/2 top-1/2 hidden -translate-y-1/2 lg:block">
          <div className="h-[2px] w-16 bg-gradient-to-r from-primary/30 to-transparent" />
        </div>
      )}
      <Card className="border-0 bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 group-hover:-translate-y-2">
        <CardContent className="p-7 text-center">
          <div className="relative mx-auto mb-5">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-xl group-hover:scale-110 transition-all duration-300`}>
              <Icon size={32} />
            </div>
            <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary text-sm font-bold shadow-lg border-2 border-primary/20">
              {index + 1}
            </div>
          </div>
          <Heading as="h4" size="md" weight="semibold" className="text-slate-800">
            {step.title}
          </Heading>
          <Paragraph className="mt-2 text-sm text-slate-500 leading-relaxed">
            {step.description}
          </Paragraph>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {step.details.map((detail) => (
              <Span key={detail} size="xs" className="bg-slate-100/80 px-2.5 py-1 rounded-full text-slate-500 border border-slate-200/50">
                {detail}
              </Span>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Comparison Table
const ComparisonTable = () => {
  return (
    <Card className="overflow-hidden border-0 bg-white/90 backdrop-blur-xl shadow-2xl shadow-slate-200/50">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-slate-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Feature</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-red-600">Traditional Way</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-600">Bulk Audio Gen</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Result</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((item, index) => (
              <motion.tr
                key={item.feature}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className={cn(
                  "border-b border-slate-100 transition-colors hover:bg-slate-50/50",
                  index % 2 === 0 ? "bg-white/50" : "bg-transparent"
                )}
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{item.feature}</td>
                <td className="px-6 py-4 text-sm text-red-500">
                  <div className="flex items-center gap-2">
                    <X size={16} className="text-red-400" />
                    {item.traditional}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-emerald-600">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-500" />
                    {item.ourSolution}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {item.isPositive ? (
                    <Span size="xs" className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium border border-emerald-200">
                      ✓ Better
                    </Span>
                  ) : (
                    <Span size="xs" className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium border border-red-200">
                      ✗ Worse
                    </Span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Main Component
export const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50/50">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1.5 origin-left bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
        style={{ scaleX }}
      />

      <Background />

      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 overflow-hidden px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-50/90 to-purple-50/90 px-5 py-2.5 border border-indigo-200/50 backdrop-blur-xl shadow-lg shadow-indigo-200/20">
                <Sparkles className="h-4 w-4 text-indigo-600 animate-pulse" />
                <Span size="sm" className="font-semibold text-indigo-700">
                  AI-Powered Bulk Audio Generation
                </Span>
              </div>

              <Heading as="h1" size="5xl" weight="extrabold" className="leading-[1.1]">
                Generate Perfect
                <Span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Audio for AI Videos
                </Span>
              </Heading>

              <Paragraph size="xl" className="mt-6 max-w-lg leading-relaxed text-slate-600">
                Stop manually syncing audio clips. Generate 100+ perfectly timed audio files 
                in seconds. Match any video scene with precision. Save hours of editing time.
              </Paragraph>

              {/* Social Proof */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-9 w-9 rounded-full border-2 border-white bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-xs font-bold text-indigo-600 shadow-md"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div>
                    <Span weight="bold" className="text-slate-800">500+</Span>
                    <Span className="text-slate-500"> creators trust us</Span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                  <Span size="sm" className="ml-1 text-slate-600 font-medium">
                    5.0 (68 reviews)
                  </Span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/bulk-audio/generator">
                  <Button
                    size="lg"
                    leftIcon={<Zap className="h-4 w-4" />}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-300 px-8"
                  >
                    Start Generating Free
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Play className="h-4 w-4" />}
                    className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-5 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span>Encrypted & Secure</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Rocket className="h-4 w-4 text-emerald-500" />
                  <span>47 Hours Saved on Avg</span>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/15 border border-slate-200/50 bg-white/90 backdrop-blur-xl">
                <div className="aspect-video bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-5">
                  <div className="relative h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                    {/* Video Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl"
                        >
                          <Play className="h-10 w-10 fill-white text-white ml-1" />
                        </motion.div>
                        <Paragraph className="text-white/80 font-medium">
                          See Bulk Audio Gen in Action
                        </Paragraph>
                        <Paragraph size="sm" className="text-white/40 mt-1">
                          Click to play demo
                        </Paragraph>
                      </div>
                    </div>
                    {/* Animated Waveform */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-1">
                      {[...Array(24)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 bg-white/40 rounded-full"
                          animate={{
                            height: [8, 16 + Math.random() * 35, 8],
                          }}
                          transition={{
                            duration: 0.8,
                            delay: i * 0.04,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 rounded-full bg-emerald-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      ⚡ Live Demo
                    </div>
                  </div>
                </div>
                {/* Floating Stats Cards */}
                <div className="absolute -bottom-5 -right-5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg">
                      <FileAudio className="h-6 w-6" />
                    </div>
                    <div>
                      <Paragraph size="xs" className="text-slate-400 font-medium">Generated Audio</Paragraph>
                      <Paragraph size="lg" weight="bold" className="text-slate-800">
                        1,247 clips
                      </Paragraph>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/50 px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                      <Timer className="h-6 w-6" />
                    </div>
                    <div>
                      <Paragraph size="xs" className="text-slate-400 font-medium">Time Saved</Paragraph>
                      <Paragraph size="lg" weight="bold" className="text-slate-800">
                        47 hours
                      </Paragraph>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM SECTION ===== */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-white to-slate-50/80">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-50/90 to-orange-50/90 px-5 py-2.5 border border-red-200/50 backdrop-blur-xl shadow-lg shadow-red-200/20">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <Span size="sm" className="font-semibold text-red-700">
                The Problem
              </Span>
            </div>
            <Heading as="h2" size="4xl" weight="extrabold">
              Why AI Video Creation
              <Span className="block bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Takes So Much Time
              </Span>
            </Heading>
            <Paragraph size="lg" className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
              Creating AI videos with perfect audio sync is a nightmare. Here's why creators
              spend hours on what should take minutes.
            </Paragraph>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {PROBLEMS.map((problem, index) => (
              <ProblemCard key={problem.title} problem={problem} index={index} />
            ))}
          </div>

          {/* Problem Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <Card className="border-0 bg-gradient-to-r from-red-50/80 via-orange-50/80 to-amber-50/80 backdrop-blur-xl shadow-xl shadow-red-200/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                  <div className="text-center">
                    <Heading as="h4" size="2xl" weight="bold" className="text-red-600">85%</Heading>
                    <Paragraph size="sm" className="text-slate-600">Creators face sync issues</Paragraph>
                  </div>
                  <div className="text-center">
                    <Heading as="h4" size="2xl" weight="bold" className="text-amber-600">75+</Heading>
                    <Paragraph size="sm" className="text-slate-600">Clips per 10-min video</Paragraph>
                  </div>
                  <div className="text-center">
                    <Heading as="h4" size="2xl" weight="bold" className="text-orange-600">8h+</Heading>
                    <Paragraph size="sm" className="text-slate-600">Manual editing time</Paragraph>
                  </div>
                  <div className="text-center">
                    <Heading as="h4" size="2xl" weight="bold" className="text-red-600">60%</Heading>
                    <Paragraph size="sm" className="text-slate-600">Viewer retention loss</Paragraph>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ===== SOLUTION / FEATURES SECTION ===== */}
      <section className="relative z-10 px-6 py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50/90 to-teal-50/90 px-5 py-2.5 border border-emerald-200/50 backdrop-blur-xl shadow-lg shadow-emerald-200/20">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <Span size="sm" className="font-semibold text-emerald-700">
                The Solution
              </Span>
            </div>
            <Heading as="h2" size="4xl" weight="extrabold">
              Generate Perfect Audio
              <Span className="block bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
                In Seconds, Not Hours
              </Span>
            </Heading>
            <Paragraph size="lg" className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
              Bulk Audio Generator solves the sync problem. Generate all audio clips at once,
              perfectly timed for your video scenes.
            </Paragraph>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>

          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <Heading as="h3" size="2xl" weight="bold" className="text-slate-800">
                Traditional vs. <Span className="text-primary">Bulk Audio Gen</Span>
              </Heading>
              <Paragraph className="mt-2 text-slate-500">
                See the difference in every aspect of audio generation
              </Paragraph>
            </div>
            <ComparisonTable />
          </motion.div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="relative z-10 px-6 py-24 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50/90 to-indigo-50/90 px-5 py-2.5 border border-blue-200/50 backdrop-blur-xl shadow-lg shadow-blue-200/20">
              <Wand2 className="h-4 w-4 text-blue-600" />
              <Span size="sm" className="font-semibold text-blue-700">
                How It Works
              </Span>
            </div>
            <Heading as="h2" size="4xl" weight="extrabold">
              From Script to
              <Span className="block bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Production-Ready Audio
              </Span>
            </Heading>
            <Paragraph size="lg" className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
              Four simple steps. Generate all audio clips. Import to your video editor.
              Perfect sync every time.
            </Paragraph>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
            {STEPS.map((step, index) => (
              <StepCard key={step.title} step={step} index={index} />
            ))}
          </div>

          {/* Workflow Visualization */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 hidden lg:block"
          >
            <div className="relative flex items-center justify-between px-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  {i > 0 && (
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary/20 to-primary/40" />
                  )}
                  <div className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold",
                    i === 0 ? "bg-indigo-600 text-white" :
                    i === 1 ? "bg-emerald-600 text-white" :
                    i === 2 ? "bg-purple-600 text-white" :
                    i === 3 ? "bg-rose-600 text-white" :
                    "bg-slate-200 text-slate-400"
                  )}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <Suspense fallback={<SectionLoader />}>
        <LazyStatsSection />
      </Suspense>

      {/* ===== EXAMPLE VIDEOS ===== */}
      <section className="relative z-10 px-6 py-24 bg-gradient-to-b from-white to-slate-50/80">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-50/90 to-pink-50/90 px-5 py-2.5 border border-purple-200/50 backdrop-blur-xl shadow-lg shadow-purple-200/20">
              <Video className="h-4 w-4 text-purple-600" />
              <Span size="sm" className="font-semibold text-purple-700">
                Example Videos
              </Span>
            </div>
            <Heading as="h2" size="4xl" weight="extrabold">
              See Perfect
              <Span className="block bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
                Audio-Video Sync in Action
              </Span>
            </Heading>
            <Paragraph size="lg" className="mx-auto mt-5 max-w-2xl text-slate-600 leading-relaxed">
              Watch how generated audio clips sync perfectly with video scenes.
              No more desync issues.
            </Paragraph>
          </motion.div>

          <Suspense fallback={<SectionLoader />}>
            <LazyVideoSection />
          </Suspense>
        </div>
      </section>

     

      {/* ===== CTA SECTION ===== */}
      <section className="relative z-10 px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl shadow-indigo-500/30">
            <CardContent className="p-12 text-center text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-xl">
                  <Rocket className="h-10 w-10 text-white" />
                </div>
                <Heading as="h2" size="4xl" weight="extrabold" className="text-white">
                  Ready to Save Hours of Editing?
                </Heading>
                <Paragraph size="lg" className="mx-auto mt-4 max-w-2xl text-white/80 leading-relaxed">
                  Join 500+ creators already generating perfect audio for their AI videos.
                  Start free, no credit card required.
                </Paragraph>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <Link href="/bulk-audio/generator">
                    <Button
                      size="lg"
                      leftIcon={<Zap className="h-4 w-4" />}
                      className="bg-white text-indigo-600 hover:bg-slate-50 shadow-2xl shadow-white/25 hover:shadow-3xl hover:shadow-white/35 hover:scale-105 transition-all duration-300 px-8"
                    >
                      Start Generating Free
                    </Button>
                  </Link>
                  <Link href="/bulk-audio/documentation">
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/60">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80" />
                    Free to start
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80" />
                    No credit card
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-white/80" />
                    47 hours saved on average
                  </span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
};