// app/components/pages/documentation/Documentation.tsx
// ✅ "use client" हटाइयो — यो अब Server Component हो

import { Background } from "@/app/components/ui/Background";
import { DocumentationHero } from "./DocumentationHero";
import { QuickStartGuide } from "./QuickStartGuide";
import { ApiWorkflowSection } from "./ApiWorkFlow";
import { ElevenLabsSetup } from "./ElevenLabsSetup";
import { GenerateGuide } from "./GenerationGuide";
import { FAQSection } from "./FAQ";
import { SupportSection } from "./SupportSection";

// ✅ Client islands — केवल interactivity चाहिएको भाग

import { ScrollProgress } from "./ScrollProgress";
import { MobileNav } from "./MobileNav";
import { BackToTop } from "./BackToTop";

export const Documentation = () => {
  return (
    <main className="relative overflow-hidden bg-background">
      {/* ✅ Client islands — minimal JS */}
      <ScrollProgress />
      <MobileNav />
      <Background />

      <div className="relative z-10">
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
      </div>

      <BackToTop/>
    </main>
  );
};