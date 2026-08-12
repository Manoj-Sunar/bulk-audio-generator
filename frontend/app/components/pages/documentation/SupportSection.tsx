// app/components/pages/documentation/SupportSection.tsx
"use client";

import { motion } from "framer-motion";
import {
  HeartHandshake,
  Mail,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Button } from "../../ui/Button";

const SUPPORT_EMAIL = "kumar980062begin@gmail.com";

export const SupportSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Gradient Decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 bottom-0 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-secondary/10 blur-[150px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[200px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed/80 px-5 py-2 backdrop-blur-sm shadow-sm shadow-primary/10">
            <HeartHandshake size={16} className="text-primary" />
            <span className="text-sm font-semibold text-primary">Premium Support</span>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold" className="text-center">
            We're Here to
            <span className="text-primary"> Help</span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant text-center">
            Get the support you need to make the most of Bulk Audio Generator.
            Our team is ready to assist you with any questions or issues.
          </Paragraph>
        </motion.div>

        {/* Support Cards - Single Centered Premium Card */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <motion.div
            variants={fadeInUp}
            className="w-full max-w-2xl"
          >
            <Card className="group relative overflow-hidden rounded-[40px] border-primary/10 bg-gradient-to-br from-white/95 to-primary-fixed/20 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:-translate-y-2">
              {/* Glow Effect */}
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl group-hover:bg-primary/30 transition-colors duration-700" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-secondary/20 blur-3xl group-hover:bg-secondary/30 transition-colors duration-700" />

              <CardContent className="relative p-10 md:p-14 text-center">
                {/* Icon with gradient ring */}
                <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary p-1 shadow-lg shadow-primary/25">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-white/90 text-primary">
                    <Mail size={40} />
                  </div>
                </div>

                <Heading as="h3" size="2xl" weight="bold" className="text-center">
                  Email Support
                </Heading>

                <Paragraph className="mt-4 max-w-lg mx-auto leading-relaxed text-on-surface-variant text-center">
                  For any questions, feature requests, or troubleshooting,
                  reach out to our support team. We typically respond within 24 hours.
                </Paragraph>

                {/* Email Display with Copy Button */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 p-4 rounded-2xl bg-primary-fixed/30 backdrop-blur-sm border border-primary/10">
                  <Mail size={20} className="text-primary shrink-0" />
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-lg font-mono font-semibold text-on-surface hover:text-primary transition-colors"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary hover:bg-primary/10"
                    onClick={() => {
                      navigator.clipboard.writeText(SUPPORT_EMAIL);
                      // Optional: show a toast notification
                    }}
                  >
                    Copy
                  </Button>
                </div>

                <div className="mt-8">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight size={18} />}
                    className="shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
                  >
                    <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2">
                      Send Email
                      <ArrowRight size={18} />
                    </a>
                  </Button>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-on-surface-variant">
                  <Sparkles size={16} className="text-primary" />
                  <span>We respond within 24 hours</span>
                  <Sparkles size={16} className="text-primary" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Bottom CTA - Ready to Generate */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >
          <Card className="overflow-hidden rounded-[32px] border-white/20  text-on-surface shadow-2xl shadow-primary/10">
            <CardContent className="p-12 text-center relative">
              {/* Decorative light orbs */}
              <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-primary/5 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-secondary/5 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-primary/3 blur-2xl" />

              <div className="relative">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur border border-white/50 shadow-lg shadow-primary/5">
                  <HeartHandshake size={40} className="text-primary" />
                </div>

                <Heading as="h2" size="3xl" weight="extrabold" className="text-on-surface text-center">
                  Ready to Generate
                  <br />
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
                    Bulk AI Voices?
                  </span>
                </Heading>

                <Paragraph className="mx-auto mt-6 max-w-3xl text-on-surface-variant leading-8 text-center">
                  Start generating high-quality AI voices in bulk with ElevenLabs.
                  Get started now and experience the power of AI voice generation.
                </Paragraph>

                <div className="mt-10 flex flex-wrap justify-center gap-5">
                  <Button className="bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/30">
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5 transition-all hover:scale-105"
                  >
                    Contact Sales
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};