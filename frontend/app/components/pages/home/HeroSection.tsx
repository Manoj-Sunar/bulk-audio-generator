"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Zap, ShieldCheck, ArrowRight } from "lucide-react";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";
import { Button } from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import { Background } from "../../ui/Background";
import { fadeInUp, staggerContainer, floatAnimation } from "@/app/lib/animations";
import Link from "next/link";

export const DocsHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center">
      <Background />

      <div className="container mx-auto max-w-7xl px-6 py-16 lg:py-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20"
        >
          {/* LEFT - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div variants={fadeInUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2 shadow-sm">
                <Sparkles size={16} className="text-primary" />
                <Paragraph size="sm" className="font-semibold text-primary">
                  Powered by ElevenLabs API
                </Paragraph>
              </div>
            </motion.div>

            {/* Heading */}
            <motion.div variants={fadeInUp}>
              <Heading as="h1" size="4xl" weight="extrabold" className="leading-[1.05] tracking-tight text-on-background">
                Generate{" "}
                <Span size="6xl" weight="extrabold" className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%] bg-clip-text text-transparent animate-shimmer font-extrabold">
                  100+
                </Span>{" "}
                Bulk AI Voices{" "}
                <Span  className="text-on-background" size="6xl" weight="extrabold" >
                  in One Click
                </Span>
              </Heading>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeInUp}>
              <Paragraph size="lg" className="max-w-xl leading-8 text-on-surface-variant/80">
                Upload hundreds of scripts, generate AI voices in parallel,
                and download everything instantly using your own
                <Span className="font-semibold text-primary"> ElevenLabs API key</Span>.
                Save hours of manual work with blazing-fast AI voice generation.
              </Paragraph>
            </motion.div>

            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-full px-8 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 group"
              >
                <Link href={"/bulk-audio/bulk-audio-login"}>Get Started</Link>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-outline-variant bg-white/50 backdrop-blur-sm px-8 hover:border-primary hover:bg-primary/5"
              >
                <Link href={"/bulk-audio/documentation"}>Documentation</Link>
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <Zap size={16} className="text-primary" />
                </div>
                <Paragraph size="sm" className="font-medium">Lightning Fast</Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <ShieldCheck size={16} className="text-primary" />
                </div>
                <Paragraph size="sm" className="font-medium">Secure API Keys</Paragraph>
              </div>
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-1.5">
                  <span className="text-sm">📦</span>
                </div>
                <Paragraph size="sm" className="font-medium">Instant ZIP Export</Paragraph>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - Hero Image */}
          <motion.div
            variants={fadeInUp}
            className="relative flex justify-center"
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-[120px]" />

            {/* Floating Card */}
            <motion.div
              {...floatAnimation}
              className="relative overflow-visible"
            >
              <Card className="rounded-[36px] border border-white/40 bg-white/70 p-4 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-primary/20">
                <CardContent className="p-0">
                  <Image
                    src="/hero.jpg"
                    alt="Bulk Voice Generator Dashboard"
                    width={700}
                    height={700}
                    priority
                    className="rounded-[28px] object-cover shadow-lg"
                  />
                </CardContent>

                {/* Floating Stat 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="absolute -left-6 top-10 hidden rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur lg:block"
                >
                  <Paragraph className="font-bold text-xl">⚡ 10,000+</Paragraph>
                  <Paragraph size="sm" color="muted">Voices Generated</Paragraph>
                </motion.div>

                {/* Floating Stat 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -right-6 bottom-10 hidden rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur lg:block"
                >
                  <Paragraph className="font-bold text-xl">🚀 5× Faster</Paragraph>
                  <Paragraph size="sm" color="muted">Than Manual Workflow</Paragraph>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};