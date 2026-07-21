"use client";

import { motion } from "framer-motion";
import {
  FileCode2,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
} from "lucide-react";

import {
  fadeInLeft,
  fadeInRight,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

const envVariables = [
  {
    key: "NEXT_PUBLIC_API_URL",
    value: "http://localhost:8000",
    description: "FastAPI Backend URL",
    icon: FileCode2,
  },
];

const securityTips = [
  "Never commit your .env.local file.",
  "Do not expose secret API keys to GitHub.",
  "Keep production and development environments separate.",
  "Always restart Next.js after editing environment variables.",
];

export const EnvironmentSection = () => {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-16 text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <KeyRound size={16} />

            <span className="text-sm font-semibold">
              Environment Variables
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Configure
            <span className="text-primary">
              {" "}
              Environment Variables
            </span>
          </Heading>

          <Paragraph className="mx-auto mt-5 max-w-3xl text-on-surface-variant">
            Before running the application, create a
            <strong> .env.local </strong>
            file in the project root and configure the following
            variables.
          </Paragraph>

        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Left */}

          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="rounded-3xl border-outline-variant shadow-sm">

              <CardContent className="space-y-6 p-8">

                <div className="flex items-center gap-3">

                  <div className="rounded-2xl bg-primary-fixed p-3 text-primary">

                    <FileCode2 size={24} />

                  </div>

                  <Heading
                    as="h4"
                    size="xl"
                    weight="bold"
                  >
                    .env.local
                  </Heading>

                </div>

                <div className="overflow-hidden rounded-2xl bg-[#0f172a]">

                  <div className="border-b border-white/10 px-5 py-3 text-sm text-white/70">
                    .env.local
                  </div>

                  <pre className="overflow-x-auto p-6 text-sm leading-8 text-green-400">

{`NEXT_PUBLIC_API_URL=http://localhost:8000`}
                  </pre>

                </div>

                <Paragraph className="text-on-surface-variant">
                  Save this file in the root directory of your Next.js
                  project before starting the application.
                </Paragraph>

              </CardContent>

            </Card>

          </motion.div>

          {/* Right */}

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <Card className="rounded-3xl border-outline-variant shadow-sm">

              <CardContent className="space-y-8 p-8">

                <div>

                  <Heading
                    as="h4"
                    size="xl"
                    weight="bold"
                  >
                    Environment Variables
                  </Heading>

                  <Paragraph className="mt-2 text-on-surface-variant">
                    Variables used by the frontend.
                  </Paragraph>

                </div>

                {envVariables.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.key}
                      className="rounded-2xl border border-outline-variant bg-surface-container p-5"
                    >

                      <div className="mb-3 flex items-center gap-3">

                        <div className="rounded-xl bg-primary-fixed p-2 text-primary">

                          <Icon size={18} />

                        </div>

                        <Heading
                          as="h6"
                          size="md"
                          weight="bold"
                        >
                          {item.key}
                        </Heading>

                      </div>

                      <Paragraph size="sm">
                        {item.description}
                      </Paragraph>

                      <code className="mt-3 block rounded-xl bg-white px-4 py-3 font-mono text-primary">
                        {item.value}
                      </code>

                    </div>
                  );
                })}

                <div className="rounded-2xl border border-yellow-300 bg-yellow-50 p-5">

                  <div className="mb-4 flex items-center gap-2">

                    <AlertTriangle
                      size={18}
                      className="text-yellow-600"
                    />

                    <Heading
                      as="h6"
                      size="md"
                      weight="bold"
                    >
                      Security Tips
                    </Heading>

                  </div>

                  <ul className="space-y-3">

                    {securityTips.map((tip) => (

                      <li
                        key={tip}
                        className="flex items-start gap-3"
                      >

                        <ShieldCheck
                          size={18}
                          className="mt-0.5 text-primary"
                        />

                        <Paragraph size="sm">
                          {tip}
                        </Paragraph>

                      </li>

                    ))}

                  </ul>

                </div>

              </CardContent>

            </Card>

          </motion.div>

        </div>

      </div>

    </section>
  );
};