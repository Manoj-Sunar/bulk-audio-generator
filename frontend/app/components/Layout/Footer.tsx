"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useAnimation, useInView } from "framer-motion";
import {
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Zap,
  Heart,
  Rocket,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import { Heading } from "../typography/Heading";
import { Paragraph } from "../typography/Paragraph";
import { Span } from "../typography/Span";
import { fadeInUp } from "@/app/lib/animations";
import { Background } from "../ui/Background";

const productLinks = [
  { title: "Documentation", href: "/bulk-audio/documentation", icon: BookOpen },
  { title: "Generator", href: "/bulk-audio/generator", icon: AudioLines },
];

const featureLinks = [
  "Bulk Voice Generation",
  "ElevenLabs Integration",
  "ZIP Download",
  "Secure Local API Key",
];

const resources = [
  "Fast Generation",
  "Multiple Scripts",
  "High Quality Audio",
  "Responsive Dashboard",
];

export const Footer = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-white/20 bg-gradient-to-b from-surface/80 to-surface/95 backdrop-blur-xl"
    >
      <Background/>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid gap-12 lg:grid-cols-4"
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Image
                  src="/wave.svg"
                  alt="Bulk Audio Generator"
                  width={52}
                  height={52}
                  className="relative drop-shadow-lg"
                />
              </div>
              <div>
                <Heading as="h3" size="lg" weight="bold" className="leading-tight">
                  Bulk Audio
                  <br />
                  <Span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Generator
                  </Span>
                </Heading>
              </div>
            </Link>

            <Paragraph className="leading-7 text-on-surface-variant/80 max-w-xs">
              Generate hundreds of AI voices simultaneously using your own ElevenLabs API key and download everything as a ZIP archive.
            </Paragraph>

            <div className="flex items-center gap-3">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/30 backdrop-blur-sm text-on-surface-variant transition-all duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:shadow-lg hover:shadow-primary/20"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/30 backdrop-blur-sm text-on-surface-variant transition-all duration-300 hover:border-secondary/40 hover:bg-secondary/10 hover:text-secondary hover:shadow-lg hover:shadow-secondary/20"
              >
                <Rocket size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Product Column */}
          <motion.div variants={fadeInUp}>
            <Heading as="h4" size="md" weight="bold" className="mb-6 text-on-surface">
              Product
            </Heading>
            <div className="space-y-1">
              {productLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-sm hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className="text-primary/70 group-hover:text-primary transition-colors" />
                      <Span className="text-on-surface-variant/80 group-hover:text-on-surface transition-colors">
                        {item.title}
                      </Span>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-primary/30 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                );
              })}
            </div>
          </motion.div>

          {/* Features Column */}
          <motion.div variants={fadeInUp}>
            <Heading as="h4" size="md" weight="bold" className="mb-6 text-on-surface">
              Features
            </Heading>
            <div className="space-y-1">
              {featureLinks.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-sm"
                >
                  <Sparkles size={16} className="text-primary/70" />
                  <Span className="text-on-surface-variant/80">{item}</Span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Why Choose Us Column */}
          <motion.div variants={fadeInUp}>
            <Heading as="h4" size="md" weight="bold" className="mb-6 text-on-surface">
              Why Choose Us
            </Heading>
            <div className="space-y-1">
              {resources.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-white/40 hover:backdrop-blur-sm"
                >
                  {item.includes("Fast") ? (
                    <Zap size={16} className="text-secondary/70" />
                  ) : (
                    <ShieldCheck size={16} className="text-primary/70" />
                  )}
                  <Span className="text-on-surface-variant/80">{item}</Span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar with gradient line */}
        <motion.div
          variants={fadeInUp}
          className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-8 md:flex-row"
        >
          <Paragraph size="sm" className="text-on-surface-variant/70">
            © {new Date().getFullYear()}{" "}
            <Span weight="semibold" className="text-on-surface">
              Bulk Audio Generator
            </Span>
            . All rights reserved.
          </Paragraph>

          <div className="flex items-center gap-2">
            <Paragraph size="sm" className="text-on-surface-variant/70">
              Built with
            </Paragraph>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart size={16} className="fill-red-500 text-red-500" />
            </motion.div>
            <Paragraph size="sm" className="text-on-surface-variant/70">
              using{" "}
              <Span weight="semibold" className="text-primary/80">
                FastAPI
              </Span>
              ,{" "}
              <Span weight="semibold" className="text-primary/80">
                Next.js
              </Span>
              ,{" "}
              <Span weight="semibold" className="text-primary/80">
                ElevenLabs
              </Span>
            </Paragraph>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};