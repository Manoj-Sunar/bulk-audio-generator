"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";

export const LoginHeader = () => {
  return (
    <header className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 p-2 shadow-inner"
      >
        <Image src="/wave.svg" alt="Bulk Audio Generator" width={60} height={60} className="drop-shadow-md" />
      </motion.div>

      <Heading as="h1" size="3xl" weight="extrabold" className="text-on-background">
        Welcome Back
      </Heading>

      <Paragraph size="sm" className="mt-3 max-w-sm text-center leading-relaxed text-on-surface-variant/80">
        Sign in to your account to continue generating high-quality{' '}
        <Span size="md" weight="semibold" color="primary" className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          100+ Bulk AI
        </Span>{' '}
        voices using your ElevenLabs API key.
      </Paragraph>

      <Paragraph size="sm" className="mt-5 text-on-surface-variant/80">
        Don't have an account?{' '}
        <Link
          href="/bulk-audio/bulk-audio-register"
          className="font-semibold text-primary transition-colors hover:text-primary/80 hover:underline"
        >
          Create one
        </Link>
      </Paragraph>
    </header>
  );
};