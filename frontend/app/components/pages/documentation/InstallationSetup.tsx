"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Download,
  FolderGit2,
  Package,
  Play,
  Terminal,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

const commands = [
  {
    title: "Clone Repository",
    icon: FolderGit2,
    code: "git clone https://github.com/your-username/bulk-audio-generator.git",
  },
  {
    title: "Navigate Project",
    icon: Terminal,
    code: "cd bulk-audio-generator",
  },
  {
    title: "Install Dependencies",
    icon: Package,
    code: "npm install",
  },
  {
    title: "Create Environment File",
    icon: Copy,
    code: "cp .env.example .env.local",
  },
  {
    title: "Run Development Server",
    icon: Play,
    code: "npm run dev",
  },
];

export const InstallationSection = () => {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <Download size={16} />

            <span className="text-sm font-semibold">
              Developer Installation
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Install the Project
            <span className="text-primary">
              {" "}
              in Under 2 Minutes
            </span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant">
            Follow these commands to clone the repository,
            install dependencies, configure environment variables,
            and start the development server.
          </Paragraph>

        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >

          {commands.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
              >
                <Card className="overflow-hidden rounded-3xl border-outline-variant shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

                  <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center">

                    {/* Step */}

                    <div className="flex items-center gap-4">

                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">

                        <Icon size={24} />

                      </div>

                      <div>

                        <Paragraph
                          size="sm"
                          className="font-semibold uppercase tracking-widest text-primary"
                        >
                          Step {index + 1}
                        </Paragraph>

                        <Heading
                          as="h4"
                          size="lg"
                          weight="bold"
                        >
                          {item.title}
                        </Heading>

                      </div>

                    </div>

                    {/* Command */}

                    <div className="flex-1 rounded-2xl bg-surface-container p-4">

                      <code className="break-all font-mono text-sm text-on-surface">
                        {item.code}
                      </code>

                    </div>

                  </CardContent>

                </Card>
              </motion.div>
            );
          })}

        </motion.div>

      </div>

    </section>
  );
};