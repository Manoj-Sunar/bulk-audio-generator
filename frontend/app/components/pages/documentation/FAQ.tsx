// app/components/pages/documentation/FAQ.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
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
      "Login to your ElevenLabs dashboard, go to your profile settings, navigate to API Keys, and create a new key. Make sure to grant it Text to Speech (for generating audio) and Voice Read (to fetch available voice profiles) permissions. Then copy the key and paste it into this application.",
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
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-secondary/5 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-white/60 px-5 py-2 backdrop-blur-sm shadow-sm">
            <HelpCircle size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">
              Frequently Asked Questions
            </span>
          </div>

          <Heading as="h2" size="3xl" weight="extrabold" className="text-center">
            Everything You Need
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {" "}To Know
            </span>
          </Heading>

          <Paragraph className="mx-auto mt-5 max-w-2xl text-on-surface-variant text-center">
            Answers to the most common questions from users.
          </Paragraph>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <motion.div key={faq.question} variants={fadeInUp}>
                <Card
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    open
                      ? "border-primary/20 bg-white/80 shadow-xl shadow-primary/5 backdrop-blur-sm"
                      : "border-transparent bg-white/50 hover:border-primary/10 hover:bg-white/70 hover:shadow-lg hover:shadow-primary/5"
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left group"
                  >
                    <Heading
                      as="h5"
                      size="lg"
                      weight="bold"
                      className={`pr-6 transition-colors ${
                        open ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {faq.question}
                    </Heading>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all ${
                        open
                          ? "bg-primary/10 text-primary"
                          : "bg-surface-container text-on-surface-variant group-hover:bg-primary/5 group-hover:text-primary"
                      }`}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <CardContent className="border-t border-primary/5 px-6 pb-6 pt-4">
                          <Paragraph className="leading-7 text-on-surface-variant/80">
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

        {/* Bottom CTA */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="relative overflow-hidden rounded-3xl border-white/20 bg-gradient-to-br from-white via-primary/5 to-secondary/5 shadow-xl shadow-primary/5 backdrop-blur-sm">
            {/* Decorative glow */}
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/10 blur-3xl" />

            <CardContent className="relative p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10">
                <Sparkles size={24} className="text-primary" />
              </div>
              <Heading as="h3" size="2xl" weight="bold" className="text-on-surface text-center">
                Still have questions?
              </Heading>
              <Paragraph className="mx-auto mt-3 max-w-2xl text-on-surface-variant text-center">
                If you encounter issues while using Bulk Audio Generator,
                check the documentation or contact our support team for assistance.
              </Paragraph>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  📖 Read Documentation
                </button>
                <span className="text-on-surface-variant/30">•</span>
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                  ✉️ Contact Support
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};