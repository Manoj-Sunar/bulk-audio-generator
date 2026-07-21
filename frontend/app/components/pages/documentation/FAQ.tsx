"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
} from "lucide-react";

import {
  fadeInUp,
  staggerContainer,
} from "@/app/lib/animations";

import { Card, CardContent } from "../../ui/Card";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Do I need an ElevenLabs account?",
    answer:
      "Yes. This application uses the official ElevenLabs API. You must create an account and generate your own API key before generating audio.",
  },
  {
    question: "Where can I get my API Key?",
    answer:
      "Login to your ElevenLabs dashboard, open your profile settings, navigate to API Keys, create a new key, and paste it into this application.",
  },
  {
    question: "Is my API key stored securely?",
    answer:
      "Yes. Your API key is stored only inside your browser using localStorage. It is never saved on our servers.",
  },
  {
    question: "How do I separate multiple scripts?",
    answer:
      "Simply leave one blank line between scripts. Every blank line represents a new audio generation request.",
  },
  {
    question: "Can I generate hundreds of files?",
    answer:
      "Yes. The application is designed for bulk generation and can process large batches depending on your ElevenLabs plan and backend configuration.",
  },
  {
    question: "Why did generation fail?",
    answer:
      "Common reasons include an invalid API key, exceeded ElevenLabs quota, backend connection issues, or unsupported voice settings.",
  },
  {
    question: "Can I download everything together?",
    answer:
      "Yes. After generation completes, all audio files can be downloaded individually or together as a ZIP archive.",
  },
  {
    question: "Does this application support self-hosting?",
    answer:
      "Yes. Clone the repository, configure your FastAPI backend, add your environment variables, and deploy it on your own infrastructure.",
  },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24">

      <div className="mx-auto max-w-5xl px-6">

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center"
        >

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2 text-primary">

            <HelpCircle size={16} />

            <span className="text-sm font-semibold">
              Frequently Asked Questions
            </span>

          </div>

          <Heading
            as="h2"
            size="3xl"
            weight="extrabold"
          >
            Everything You Need
            <span className="text-primary">
              {" "}
              To Know
            </span>
          </Heading>

          <Paragraph className="mx-auto mt-5 max-w-2xl text-on-surface-variant">
            Answers to the most common questions from developers and users.
          </Paragraph>

        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-5"
        >

          {faqs.map((faq, index) => {
            const open = openIndex === index;

            return (
              <motion.div
                key={faq.question}
                variants={fadeInUp}
              >
                <Card
                  className={`overflow-hidden rounded-3xl border-outline-variant transition-all duration-300 ${
                    open
                      ? "border-primary shadow-xl"
                      : "hover:-translate-y-1 hover:shadow-md"
                  }`}
                >
                  <button
                    onClick={() =>
                      setOpenIndex(open ? null : index)
                    }
                    className="flex w-full items-center justify-between p-7 text-left"
                  >
                    <Heading
                      as="h5"
                      size="lg"
                      weight="bold"
                      className="pr-6"
                    >
                      {faq.question}
                    </Heading>

                    <motion.div
                      animate={{
                        rotate: open ? 180 : 0,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="rounded-xl bg-primary-fixed p-2 text-primary"
                    >
                      <ChevronDown size={20} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                      >
                        <CardContent className="border-t border-outline-variant px-7 pb-7 pt-6">

                          <Paragraph className="leading-8 text-on-surface-variant">
                            {faq.answer}
                          </Paragraph>

                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}

        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >

          <Card className="rounded-3xl border-primary/20 bg-primary-fixed shadow-sm">

            <CardContent className="p-8 text-center">

              <Heading
                as="h3"
                size="2xl"
                weight="bold"
              >
                Still have questions?
              </Heading>

              <Paragraph className="mx-auto mt-4 max-w-2xl text-on-surface-variant">
                If you encounter issues while installing or using Bulk Audio
                Generator, check the documentation or open an issue in the
                project's GitHub repository.
              </Paragraph>

            </CardContent>

          </Card>

        </motion.div>

      </div>

    </section>
  );
};