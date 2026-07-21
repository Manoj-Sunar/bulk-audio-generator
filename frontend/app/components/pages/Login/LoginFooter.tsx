"use client";

import Link from "next/link";

import { Paragraph } from "../../typography/Paragraph";

export const LoginFooter = () => {
  const links = [
    {
      label: "Terms of Service",
      href: "/terms",
    },
    {
      label: "Privacy Policy",
      href: "/privacy",
    },
    {
      label: "Help Center",
      href: "/help",
    },
  ];

  return (
    <footer className="space-y-6 border-t border-outline-variant pt-6">
      {/* Links */}

      <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="
              text-sm
              font-medium
              text-on-surface-variant
              transition-colors
              duration-200
              hover:text-primary
            "
          >
            {link.label}
          </Link>
        ))}
      </nav>

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
};