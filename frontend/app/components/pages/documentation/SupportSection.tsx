"use client";

import { motion } from "framer-motion";
import {

  HeartHandshake,
  LifeBuoy,
  Bug,
  GitPullRequest,
  Star,
  ArrowRight,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Button } from "../../ui/Button";
import { FaGithub } from "react-icons/fa";

const cards = [
  {
    icon: FaGithub,
    title: "GitHub Repository",
    description:
      "Browse the source code, explore commits, report issues and follow future development.",
    button: "View Repository",
  },
  {
    icon: Bug,
    title: "Report Bugs",
    description:
      "Found an issue? Open a detailed bug report so it can be fixed quickly.",
    button: "Report Issue",
  },
  {
    icon: GitPullRequest,
    title: "Contribute",
    description:
      "Improve the project by submitting pull requests, fixing bugs or adding new features.",
    button: "Contribute",
  },
  {
    icon: LifeBuoy,
    title: "Need Help?",
    description:
      "If something doesn't work as expected, read the documentation or contact the project maintainer.",
    button: "Documentation",
  },
];

export const SupportSection = () => {
  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <HeartHandshake size={16} />

            <span className="text-sm font-semibold">
              Community & Support
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Support &
            <span className="text-primary">
              {" "}
              Contribute
            </span>
          </Heading>

          <Paragraph className="mt-5 text-on-surface-variant">
            Help improve Bulk Audio Generator by reporting bugs,
            contributing new features or supporting the project.
          </Paragraph>

        </motion.div>

        {/* Cards */}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >

          {cards.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                variants={fadeInUp}
              >
                <Card className="group h-full rounded-3xl border-outline-variant transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

                  <CardContent className="flex h-full flex-col p-8">

                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-primary transition-transform duration-300 group-hover:scale-110">

                      <Icon size={30} />

                    </div>

                    <Heading
                      as="h4"
                      size="lg"
                      weight="bold"
                    >
                      {item.title}
                    </Heading>

                    <Paragraph className="mt-4 flex-1 leading-7 text-on-surface-variant">
                      {item.description}
                    </Paragraph>

                    <Button
                      className="mt-8 w-full"
                      rightIcon={<ArrowRight size={18} />}
                    >
                      {item.button}
                    </Button>

                  </CardContent>

                </Card>
              </motion.div>
            );
          })}

        </motion.div>

        {/* CTA */}

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-20"
        >

          <Card className="overflow-hidden rounded-[32px] border-primary/20 bg-gradient-to-r from-primary to-secondary text-white shadow-2xl">

            <CardContent className="p-12 text-center">

              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 backdrop-blur">

                <Star size={40} />

              </div>

              <Heading
                as="h2"
                size="3xl"
                weight="extrabold"
                className="text-white"
              >
                Thank You for Using
                <br />
                Bulk Audio Generator
              </Heading>

              <Paragraph className="mx-auto mt-6 max-w-3xl text-white/90 leading-8">
                We hope this project helps you generate AI voices faster
                and more efficiently. If you find it useful, consider
                giving the repository a ⭐, sharing it with others, or
                contributing to future improvements.
              </Paragraph>

              <div className="mt-10 flex flex-wrap justify-center gap-5">

                <Button
                  className="bg-white text-primary hover:bg-white/90"
                  leftIcon={<FaGithub size={18} />}
                >
                  Star on GitHub
                </Button>

                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Read Documentation
                </Button>

              </div>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </section>
  );
};