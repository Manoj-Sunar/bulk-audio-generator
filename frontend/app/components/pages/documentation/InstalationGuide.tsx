"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Copy,
  FolderGit2,
  Terminal,
  Download,
  PlayCircle,
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
    icon: <FolderGit2 size={22} />,
    title: "Clone Repository",
    description:
      "Clone the project from GitHub to your local machine.",
    code: "git clone https://github.com/your-username/bulk-audio-generator.git",
  },
  {
    icon: <Download size={22} />,
    title: "Install Dependencies",
    description:
      "Install all required packages using npm.",
    code: "npm install",
  },
  {
    icon: <Terminal size={22} />,
    title: "Start Development Server",
    description:
      "Launch the Next.js application.",
    code: "npm run dev",
  },
  {
    icon: <PlayCircle size={22} />,
    title: "Open Browser",
    description:
      "Visit the local development server.",
    code: "http://localhost:3000",
  },
];

export const InstallationGuide = () => {
  return (
    <section className="relative py-24">

      {/* Background */}

      <div className="absolute inset-0 -z-10">

        <div className="absolute left-20 top-10 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />

        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-secondary/5 blur-[160px]" />

      </div>

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

            <Terminal
              size={18}
              className="text-primary"
            />

            <Paragraph
              size="sm"
              className="font-semibold text-primary"
            >
              Installation
            </Paragraph>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Install in
            <Span className="mx-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Less Than
            </Span>
            2 Minutes
          </Heading>

          <Paragraph
            size="lg"
            className="mt-6 text-on-surface-variant"
          >
            Follow these simple steps to install and run
            Bulk Audio Generator locally.
          </Paragraph>

        </motion.div>

        {/* Timeline */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative space-y-10"
        >

          <div className="absolute left-6 top-0 hidden h-full w-[2px] bg-outline-variant lg:block" />

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              variants={fadeInUp}
            >
              <Card className="rounded-3xl border-outline-variant transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                <CardContent className="p-8">

                  <div className="flex flex-col gap-8 lg:flex-row">

                    {/* Number */}

                    <div className="flex items-start gap-5">

                      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-lg">

                        {step.icon}

                      </div>

                      <div>

                        <Paragraph
                          size="sm"
                          className="font-semibold uppercase tracking-widest text-primary"
                        >
                          Step {index + 1}
                        </Paragraph>

                        <Heading
                          as="h3"
                          size="xl"
                          weight="bold"
                          className="mt-2"
                        >
                          {step.title}
                        </Heading>

                        <Paragraph
                          className="mt-3 max-w-xl text-on-surface-variant"
                        >
                          {step.description}
                        </Paragraph>

                      </div>

                    </div>

                    {/* Command */}

                    <div className="flex-1">

                      <div className="overflow-hidden rounded-2xl bg-[#0F172A] shadow-lg">

                        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">

                          <Paragraph
                            size="sm"
                            className="font-medium text-gray-300"
                          >
                            Command
                          </Paragraph>

                          <Button
                            size="sm"
                            variant="ghost"
                            leftIcon={<Copy size={16} />}
                            onClick={() =>
                              navigator.clipboard.writeText(
                                step.code
                              )
                            }
                            className="text-white hover:bg-white/10"
                          >
                            Copy
                          </Button>

                        </div>

                        <pre className="overflow-x-auto p-6 text-sm text-green-400">
                          <code>{step.code}</code>
                        </pre>

                      </div>

                    </div>

                  </div>

                </CardContent>

              </Card>
            </motion.div>
          ))}

        </motion.div>

        {/* Success Card */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >

          <Card className="rounded-3xl border-primary/20 bg-primary-fixed">

            <CardContent className="flex flex-col items-center gap-5 p-10 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white">

                <CheckCircle2 size={30} />

              </div>

              <Heading
                as="h3"
                size="2xl"
                weight="bold"
              >
                Installation Completed
              </Heading>

              <Paragraph className="max-w-2xl text-on-surface-variant">
                Your application is now running locally.
                Continue to the next section to configure
                your ElevenLabs API key and start generating
                AI voices in bulk.
              </Paragraph>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </section>
  );
};