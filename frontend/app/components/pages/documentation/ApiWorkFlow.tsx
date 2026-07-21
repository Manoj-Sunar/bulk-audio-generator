"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Download,
  ServerCog,
  Sparkles,
  Upload,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

const workflow = [
  {
    icon: Upload,
    title: "User Input",
    color: "bg-primary-fixed text-primary",
    description:
      "Paste your ElevenLabs API key and multiple scripts separated by blank lines.",
  },
  {
    icon: Sparkles,
    title: "Next.js Frontend",
    color: "bg-secondary-fixed text-secondary",
    description:
      "Validates the input, prepares the request and sends it securely to your FastAPI backend.",
  },
  {
    icon: ServerCog,
    title: "FastAPI Backend",
    color: "bg-primary-fixed text-primary",
    description:
      "Processes every script, manages requests, queues generation and communicates with ElevenLabs.",
  },
  {
    icon: Brain,
    title: "ElevenLabs API",
    color: "bg-secondary-fixed text-secondary",
    description:
      "Generates realistic AI voices for every script simultaneously.",
  },
  {
    icon: Download,
    title: "ZIP Download",
    color: "bg-primary-fixed text-primary",
    description:
      "All generated MP3 files are compressed into a ZIP archive and downloaded instantly.",
  },
];

export const ApiWorkflowSection = () => {
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

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <ServerCog size={16} />

            <span className="text-sm font-semibold">
              System Workflow
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            How Audio Generation
            <span className="text-primary">
              {" "}
              Works
            </span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant">
            Every request follows a secure workflow from your browser
            to the backend, then to ElevenLabs, before returning a ZIP
            containing all generated audio files.
          </Paragraph>

        </motion.div>

        {/* Flow */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 lg:grid-cols-5"
        >

          {workflow.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                variants={fadeInUp}
                className="relative"
              >

                <Card className="group h-full rounded-3xl border-outline-variant transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                  <CardContent className="flex h-full flex-col items-center p-8 text-center">

                    <div
                      className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${step.color} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon size={36} />
                    </div>

                    <Heading
                      as="h4"
                      size="lg"
                      weight="bold"
                    >
                      {step.title}
                    </Heading>

                    <Paragraph className="mt-4 text-on-surface-variant">
                      {step.description}
                    </Paragraph>

                  </CardContent>

                </Card>

                {/* Arrow */}

                {index !== workflow.length - 1 && (
                  <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 lg:flex">

                    <div className="rounded-full bg-primary p-3 text-white shadow-lg">

                      <ArrowRight size={20} />

                    </div>

                  </div>
                )}

              </motion.div>
            );
          })}

        </motion.div>

        {/* Bottom Summary */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >

          <Card className="rounded-3xl border-primary/20 bg-primary-fixed shadow-sm">

            <CardContent className="p-10">

              <Heading
                as="h3"
                size="2xl"
                weight="bold"
              >
                Complete Request Lifecycle
              </Heading>

              <Paragraph className="mt-6 leading-8 text-on-surface-variant">
                Your browser never generates audio directly. The frontend
                validates your scripts and securely sends them to your
                FastAPI backend. The backend communicates with the
                ElevenLabs API, generates every audio file, bundles them
                into a ZIP archive, and returns the download to your
                browser. This architecture keeps the application secure,
                scalable and easy to maintain.
              </Paragraph>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </section>
  );
};