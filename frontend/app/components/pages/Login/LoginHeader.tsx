"use client";

import Link from "next/link";
import { AudioWaveform } from "lucide-react";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import Image from "next/image";
import { Span } from "../../typography/Span";

export const LoginHeader = () => {
  return (
    <header className="flex flex-col items-center text-center">
      {/* Logo */}

      <div className="mb-6 flex h-20 w-20 items-center justify-center ">
        <Image src="/wave.svg" alt="logo" width={100} height={100}/>
      </div>

      {/* Heading */}

      <Heading
        as="h1"
        size="2xl"
        weight="bold"
        className="text-on-background"
      >
        Welcome Back
      </Heading>

      {/* Subtitle */}

      <Paragraph
        size="sm"
        className="mt-3 max-w-sm text-center leading-7 text-on-surface-variant"
      >
        Sign in to your account to continue generating high-quality <Span size="lg" weight="bold" color="primary">100+ Bulk AI</Span> voices
        using your ElevenLabs API key.
      </Paragraph>

      {/* Create account */}

      <Paragraph
        size="sm"
        className="mt-5 text-on-surface-variant"
      >
        Don't have an account?{" "}
        <Link
          href="/bulk-audio/bulk-audio-register"
          className="font-semibold text-primary transition-colors hover:text-primary-container"
        >
          Create one
        </Link>
      </Paragraph>
    </header>
  );
};