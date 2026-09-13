"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Paragraph } from "../../typography/Paragraph";

export const LoginFooter = () => {
  const links = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Help Center", href: "/help" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="space-y-5 border-t border-gray-100/80 pt-5"
    >
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs font-medium text-on-surface-variant/70 transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <Paragraph size="xs" className="text-center text-on-surface-variant/50">
        © {new Date().getFullYear()}{' '}
        <span className="font-semibold text-primary">Bulk Audio Generator</span>
        . All rights reserved.
      </Paragraph>
    </motion.footer>
  );
};