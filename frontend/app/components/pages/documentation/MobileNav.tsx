// app/components/pages/documentation/islands/MobileNav.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "quick-start", label: "Quick Start" },
  { id: "workflow", label: "Workflow" },
  { id: "api-setup", label: "API Setup" },
  { id: "generate", label: "Generate" },
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Support" },
];

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-white shadow-xl lg:hidden"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 z-50 w-48 rounded-2xl bg-white/90 p-4 shadow-2xl backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-2">
              {SECTIONS.map(({ id, label }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-on-surface hover:bg-primary-fixed/30 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};