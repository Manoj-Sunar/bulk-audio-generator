// app/components/pages/documentation/ElevenLabsSetup.tsx
"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
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
    title: "Create an ElevenLabs Account",
    description: "Visit ElevenLabs and create a free account if you don't already have one.",
    image: "/e1.png",
  },
  {
    title: "Login to Dashboard",
    description: "After verifying your email, log in to your ElevenLabs dashboard.",
    image: "/e2.png",
  },
  {
    title: "Navigate to API Keys",
    description: "Go to Developers → API Keys to manage your API keys.",
    image: "/e3.png",
  },
  {
    title: "Create a New API Key",
    description: "Click 'Create API Key', give it a name, and configure access permissions.",
    image: "/e4.png",
  },
  {
    title: "Configure Access",
    description: "Set appropriate access levels for Text to Speech and other services.",
    image: "/e5.png",
  },
  {
    title: "Copy Your API Key",
    description: "Copy the generated API key immediately. It won't be shown again!",
    image: "/e6.png",
  },
];

export const ElevenLabsSetup = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-secondary/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 px-5 py-2 backdrop-blur-sm shadow-sm">
            <KeyRound size={18} className="text-primary" />
            <Paragraph size="sm" className="font-medium text-primary">
              API Configuration
            </Paragraph>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold" className="text-center">
            Configure
            <Span size="3xl" weight="extrabold" className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ElevenLabs
            </Span>
            API
          </Heading>

          <Paragraph size="lg" className="mt-6 text-on-surface-variant/80 text-center max-w-2xl mx-auto">
            Bulk Audio Generator uses your own ElevenLabs API key. Your key stays
            inside your browser and is never stored on any server. Click any image to enlarge.
          </Paragraph>
        </motion.div>

        {/* Steps with images */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-10"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={fadeInUp}>
              <Card className="overflow-hidden rounded-2xl border border-primary/5 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/10">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex flex-1 flex-col justify-center p-8 lg:p-10">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <Heading as="h4" size="xl" weight="semibold" className="text-on-surface">
                            {step.title}
                          </Heading>
                        </div>
                      </div>
                      <Paragraph className="mt-3 text-on-surface-variant/80 leading-relaxed">
                        {step.description}
                      </Paragraph>
                    </div>
                    <div className="flex-1 bg-surface-container/30 p-6 lg:p-8">
                      <ImageWithLightbox
                        src={step.image}
                        alt={step.title}
                        width={500}
                        height={300}
                        containerClassName="aspect-[5/3] rounded-xl overflow-hidden shadow-sm"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="rounded-2xl border border-primary/10 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="flex flex-col sm:flex-row gap-5 p-8 items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <ShieldCheck size={24} />
              </div>
              <div className="flex-1">
                <Heading as="h4" size="lg" weight="semibold" className="text-on-surface">
                  Your API Key is Secure
                </Heading>
                <Paragraph className="mt-2 text-on-surface-variant/80 leading-relaxed">
                  The API key is stored only in your browser using localStorage.
                  It is sent directly to your FastAPI backend when generating audio
                  and is never saved permanently on any server.
                </Paragraph>
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
          <Button
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            className="shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all"
          >
            Continue to Script Editor
          </Button>
        </motion.div>
      </div>
    </section>
  );
};