"use client";

import { motion } from "framer-motion";
import {
  KeyRound,
  ExternalLink,
  Copy,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
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

const steps = [
  {
    title: "Create an ElevenLabs Account",
    description:
      "Visit ElevenLabs and create a free account if you don't already have one.",
  },
  {
    title: "Login to Dashboard",
    description:
      "After verifying your email, log in to your ElevenLabs dashboard.",
  },
  {
    title: "Generate an API Key",
    description:
      "Navigate to Profile → API Keys and create a new secret API key.",
  },
  {
    title: "Copy the API Key",
    description:
      "Copy the generated API key to your clipboard.",
  },
  {
    title: "Paste into Bulk Audio Generator",
    description:
      "Paste your API key into the API Key field inside this application.",
  },
  {
    title: "Start Generating Voices",
    description:
      "Your API key is now ready. Paste scripts and click Generate Audio.",
  },
];

export const ElevenLabsSetup = () => {
  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-fixed px-5 py-2">

            <KeyRound
              size={18}
              className="text-primary"
            />

            <Paragraph
              size="sm"
              className="font-semibold text-primary"
            >
              API Configuration
            </Paragraph>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Configure
            <Span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ElevenLabs
            </Span>
            API
          </Heading>

          <Paragraph
            size="lg"
            className="mt-6 text-on-surface-variant"
          >
            Bulk Audio Generator uses your own ElevenLabs API key.
            Your key stays inside your browser and is never stored on our server.
          </Paragraph>

        </motion.div>

        {/* Main Card */}

        <Card className="rounded-3xl border-outline-variant shadow-xl">

          <CardContent className="p-10">

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >

              {steps.map((step, index) => (

                <motion.div
                  key={step.title}
                  variants={fadeInUp}
                  className="flex gap-6"
                >

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white font-bold">

                    {index + 1}

                  </div>

                  <div className="flex-1">

                    <Heading
                      as="h4"
                      size="lg"
                      weight="bold"
                    >
                      {step.title}
                    </Heading>

                    <Paragraph className="mt-2 text-on-surface-variant">
                      {step.description}
                    </Paragraph>

                  </div>

                </motion.div>

              ))}

            </motion.div>

          </CardContent>

        </Card>

        {/* Example API Key */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-10"
        >

          <Card className="rounded-3xl bg-[#0F172A]">

            <CardContent className="p-8">

              <div className="mb-5 flex items-center justify-between">

                <Heading
                  as="h4"
                  size="lg"
                  className="text-white"
                >
                  Example API Key
                </Heading>

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  leftIcon={<Copy size={16} />}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    )
                  }
                >
                  Copy
                </Button>

              </div>

              <pre className="overflow-x-auto rounded-xl bg-black/30 p-5 text-green-400">
{`sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>

            </CardContent>

          </Card>

        </motion.div>

        {/* Security Notice */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once:true }}
          className="mt-10"
        >

          <Card className="rounded-3xl border-primary/20 bg-primary-fixed">

            <CardContent className="flex gap-5 p-8">

              <ShieldCheck
                size={42}
                className="text-primary"
              />

              <div>

                <Heading
                  as="h4"
                  size="lg"
                  weight="bold"
                >
                  Your API Key is Secure
                </Heading>

                <Paragraph className="mt-2 text-on-surface-variant">
                  The API key is stored only in your browser using
                  localStorage. It is sent directly to your FastAPI backend
                  when generating audio and is never saved permanently.
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
          viewport={{ once:true }}
          className="mt-16 flex justify-center"
        >

          <Button
            size="lg"
            rightIcon={<ArrowRight size={18} />}
          >
            Continue to Script Editor
          </Button>

        </motion.div>

      </div>

    </section>
  );
};