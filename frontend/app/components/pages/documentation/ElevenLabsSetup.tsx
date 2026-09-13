// app/components/pages/documentation/ElevenLabsSetup.tsx
"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Bot,
  Globe,
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

const googleSteps = [
  {
    title: "Go to Google AI Studio",
    description: "Visit Google AI Studio and sign in with your Google account.",
    image: "/g1.png",
  },
  {
    title: "Navigate to API Keys",
    description: "Go to the API Keys section in the Google AI Studio dashboard.",
    image: "/g2.png",
  },
  {
    title: "Create a New API Key",
    description: "Click 'Create API Key' and select the Text-to-Speech API.",
    image: "/g3.png",
  },
  {
    title: "Configure API Key",
    description: "Set appropriate permissions and restrictions for your API key.",
    image: "/g4.png",
  },
  {
    title: "Copy Your API Key",
    description: "Copy the generated API key. Store it securely for use in the application.",
    image: "/g5.png",
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
            Configure Your
            <Span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              TTS Provider
            </Span>
          </Heading>

          <Paragraph size="lg" className="mt-6 text-on-surface-variant/80 text-center max-w-2xl mx-auto">
            Bulk Audio Generator supports both ElevenLabs and Google AI Studio Text-to-Speech.
            Choose your preferred provider and follow the steps below to get your API key.
            Your key stays inside your browser and is never stored on any server.
          </Paragraph>
        </motion.div>

        {/* Provider Selection Tabs - ElevenLabs */}
        <div className="mb-16">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* ElevenLabs Section */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Sparkles size={24} />
                </div>
                <Heading as="h3" size="xl" weight="bold">
                  ElevenLabs Setup
                </Heading>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {steps.map((step, index) => (
                  <motion.div key={step.title} variants={fadeInUp}>
                    <Card className="overflow-hidden rounded-2xl border border-primary/5 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:border-primary/10">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          <div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
                            <div className="flex items-center gap-4">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <Heading as="h4" size="lg" weight="semibold" className="text-on-surface">
                                  {step.title}
                                </Heading>
                              </div>
                            </div>
                            <Paragraph className="mt-2 text-on-surface-variant/80 leading-relaxed">
                              {step.description}
                            </Paragraph>
                          </div>
                          <div className="flex-1 bg-surface-container/30 p-4 lg:p-6">
                            <ImageWithLightbox
                              src={step.image}
                              alt={step.title}
                              width={400}
                              height={240}
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
            </div>

            {/* Google AI Studio Section */}
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Bot size={24} />
                </div>
                <Heading as="h3" size="xl" weight="bold">
                  Google AI Studio Setup
                </Heading>
              </div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-6"
              >
                {googleSteps.map((step, index) => (
                  <motion.div key={step.title} variants={fadeInUp}>
                    <Card className="overflow-hidden rounded-2xl border border-secondary/5 bg-white/70 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-md hover:shadow-secondary/5 hover:border-secondary/10">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          <div className="flex flex-1 flex-col justify-center p-6 lg:p-8">
                            <div className="flex items-center gap-4">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-secondary text-sm font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <Heading as="h4" size="lg" weight="semibold" className="text-on-surface">
                                  {step.title}
                                </Heading>
                              </div>
                            </div>
                            <Paragraph className="mt-2 text-on-surface-variant/80 leading-relaxed">
                              {step.description}
                            </Paragraph>
                          </div>
                          <div className="flex-1 bg-surface-container/30 p-4 lg:p-6">
                            <ImageWithLightbox
                              src={step.image}
                              alt={step.title}
                              width={400}
                              height={240}
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
            </div>
          </div>
        </div>

        {/* Provider Comparison */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="rounded-2xl border border-primary/10 bg-white/60 shadow-sm backdrop-blur-sm">
            <CardContent className="p-8">
              <Heading as="h3" size="xl" weight="bold" className="text-center mb-6">
                Which Provider Should You Choose?
              </Heading>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-xl bg-primary-fixed/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles size={20} className="text-primary" />
                    <Heading as="h4" size="lg" weight="semibold">
                      ElevenLabs
                    </Heading>
                  </div>
                  <ul className="space-y-2 text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>High-quality, natural-sounding voices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Wide variety of voice profiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Advanced voice customization options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span>Ideal for professional content creation</span>
                    </li>
                  </ul>
                </div>
                <div className="rounded-xl bg-secondary-fixed/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Bot size={20} className="text-secondary" />
                    <Heading as="h4" size="lg" weight="semibold">
                      Google AI Studio
                    </Heading>
                  </div>
                  <ul className="space-y-2 text-on-surface-variant">
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>High-quality WaveNet and Studio voices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>Supports multiple languages and accents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>SSML support for advanced speech control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-secondary mt-1">✓</span>
                      <span>Competitive pricing with free tier</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  Your API key is transmitted securely to our backend, encrypted using
                  industry‑standard Fernet (symmetric encryption), and stored in the database.
                  The raw key is never persisted in your browser or accessible to anyone.
                  Whether you choose ElevenLabs or Google AI Studio, your credentials
                  remain protected at all times.
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