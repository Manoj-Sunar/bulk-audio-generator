"use client";

import Link from "next/link";

import { Paragraph } from "../../typography/Paragraph";

export const RegisterFooter = () => {
  return (
    <footer className="space-y-6 border-t border-outline-variant pt-6">
      {/* Terms */}

      <Paragraph
        size="sm"
        className="text-center leading-7 text-on-surface-variant"
      >
        By creating an account, you agree to our{" "}
        <Link
          href="/terms"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Privacy Policy
        </Link>
        .
      </Paragraph>

      {/* Already have account */}

      <Paragraph
        size="sm"
        className="text-center text-on-surface-variant"
      >
        Already have an account?{" "}
        <Link
          href="/bulk-audio/bulk-audio-login"
          className="font-semibold text-primary transition-colors hover:underline"
        >
          Sign In
        </Link>
      </Paragraph>

      {/* Copyright */}

      <Paragraph
        size="sm"
        className="text-center text-on-surface-variant"
      >
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-primary">
          Bulk Audio Generator
        </span>
        . All rights reserved.
      </Paragraph>
    </footer>
  );
}