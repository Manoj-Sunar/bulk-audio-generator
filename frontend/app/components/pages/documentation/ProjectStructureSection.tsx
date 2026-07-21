"use client";

import { motion } from "framer-motion";
import {
  FolderOpen,
  FileCode2,
  FolderGit2,
  Settings2,
  ShieldCheck,
  Database,
} from "lucide-react";

import {
  fadeInLeft,
  fadeInRight,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

const folders = [
  {
    icon: FolderGit2,
    name: "app/",
    description:
      "Next.js App Router pages, layouts, metadata and routing.",
  },
  {
    icon: FolderOpen,
    name: "components/",
    description:
      "Reusable UI components, typography, forms and application pages.",
  },
  {
    icon: Database,
    name: "lib/",
    description:
      "Utilities, constants, animations, helper functions and shared logic.",
  },
  {
    icon: Settings2,
    name: "public/",
    description:
      "Images, icons, logos and static assets.",
  },
  {
    icon: ShieldCheck,
    name: ".env.local",
    description:
      "Environment variables used by the frontend.",
  },
];

const tree = `.
├── app
│   ├── generator
│   ├── documentation
│   ├── components
│   │   ├── ui
│   │   ├── typography
│   │   ├── Inputs
│   │   ├── Layout
│   │   └── pages
│   ├── lib
│   ├── globals.css
│   └── layout.tsx
│
├── public
│   ├── hero.jpg
│   ├── wave.svg
│   └── icons
│
├── .env.local
├── package.json
├── tsconfig.json
└── next.config.ts`;

export const ProjectStructureSection = () => {
  return (
    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto mb-16 max-w-3xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <FolderOpen size={16} />

            <span className="text-sm font-semibold">
              Project Architecture
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Project
            <span className="text-primary">
              {" "}
              Folder Structure
            </span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant">
            The project follows a clean, scalable and production-ready
            architecture based on the Next.js App Router.
          </Paragraph>

        </div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Tree */}

          <motion.div
            variants={fadeInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="overflow-hidden rounded-3xl border-outline-variant shadow-sm">

              <CardContent className="p-0">

                <div className="border-b border-outline-variant bg-surface-container px-6 py-4">

                  <Heading
                    as="h4"
                    size="lg"
                    weight="bold"
                  >
                    Directory Tree
                  </Heading>

                </div>

                <pre className="overflow-x-auto bg-[#0f172a] p-8 font-mono text-sm leading-7 text-green-400">
{tree}
                </pre>

              </CardContent>

            </Card>

          </motion.div>

          {/* Explanation */}

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-5"
          >

            {folders.map((folder) => {
              const Icon = folder.icon;

              return (
                <Card
                  key={folder.name}
                  className="rounded-3xl border-outline-variant transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardContent className="flex gap-5 p-6">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed text-primary">

                      <Icon size={24} />

                    </div>

                    <div>

                      <Heading
                        as="h5"
                        size="lg"
                        weight="bold"
                      >
                        {folder.name}
                      </Heading>

                      <Paragraph className="mt-2 text-on-surface-variant">
                        {folder.description}
                      </Paragraph>

                    </div>

                  </CardContent>

                </Card>
              );
            })}

          </motion.div>

        </div>

        {/* Bottom Note */}

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-14"
        >

          <Card className="rounded-3xl border-primary/20 bg-primary-fixed shadow-sm">

            <CardContent className="p-8">

              <div className="flex gap-5">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">

                  <FileCode2 size={26} />

                </div>

                <div>

                  <Heading
                    as="h4"
                    size="xl"
                    weight="bold"
                  >
                    Production Architecture
                  </Heading>

                  <Paragraph className="mt-3 leading-8 text-on-surface-variant">
                    All UI components are reusable and follow the DRY
                    principle. Business logic, API communication,
                    animations, constants, utilities and reusable
                    components are separated into dedicated folders,
                    making the project easy to maintain and scale as
                    the application grows.
                  </Paragraph>

                </div>

              </div>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </section>
  );
};