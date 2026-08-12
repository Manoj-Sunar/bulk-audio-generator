// app/components/pages/documentation/Documentation.tsx
"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { Background } from "@/app/components/ui/Background";
import { motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";

// Lazy load components
const DocumentationHero = lazy(() =>
  import("./DocumentationHero").then((mod) => ({ default: mod.DocumentationHero }))
);
const QuickStartGuide = lazy(() =>
  import("./QuickStartGuide").then((mod) => ({ default: mod.QuickStartGuide }))
);
const ApiWorkflowSection = lazy(() =>
  import("./ApiWorkFlow").then((mod) => ({ default: mod.ApiWorkflowSection }))
);
const ElevenLabsSetup = lazy(() =>
  import("./ElevenLabsSetup").then((mod) => ({ default: mod.ElevenLabsSetup }))
);
const GenerateGuide = lazy(() =>
  import("./GenerationGuide").then((mod) => ({ default: mod.GenerateGuide }))
);
const FAQSection = lazy(() =>
  import("./FAQ").then((mod) => ({ default: mod.FAQSection }))
);
const SupportSection = lazy(() =>
  import("./SupportSection").then((mod) => ({ default: mod.SupportSection }))
);

const SectionLoader = () => (
  <div className="flex min-h-[200px] items-center justify-center">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const SECTIONS = [
  { id: "hero", label: "Overview" },
  { id: "quick-start", label: "Quick Start" },
  { id: "workflow", label: "Workflow" },
  { id: "api-setup", label: "API Setup" },
  { id: "generate", label: "Generate" },
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Support" },
];

export const Documentation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <main className="relative overflow-hidden bg-background">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-primary to-secondary"
        style={{ scaleX }}
      />

      <Background />

      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-primary p-3 text-white shadow-xl lg:hidden"
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
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
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.nav>
      )}

      <div className="relative z-10">
        <Suspense fallback={<SectionLoader />}>
          <section id="hero">
            <DocumentationHero />
          </section>
          <section id="quick-start">
            <QuickStartGuide />
          </section>
          <section id="workflow">
            <ApiWorkflowSection />
          </section>
          <section id="api-setup">
            <ElevenLabsSetup />
          </section>
          <section id="generate">
            <GenerateGuide />
          </section>
          <section id="faq">
            <FAQSection />
          </section>
          <section id="support">
            <SupportSection />
          </section>
        </Suspense>
      </div>

      {/* Back to Top */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollYProgress.get() > 0.1 ? 1 : 0 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-6 rounded-full bg-primary/80 p-3 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-primary lg:bottom-8"
        aria-label="Back to top"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </main>
  );
};