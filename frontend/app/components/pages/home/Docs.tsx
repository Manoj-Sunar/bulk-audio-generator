// app/components/pages/home/Docs.tsx
// ✅ Server Component — "use client" छैन

import { DocsHeroSection } from "./HeroSection";
import { HowToUse } from "./Step";


import { HomeSEOContent } from "./HomeSeoContent";
import { HomeFAQ } from "./HomeFAQ";
import { HomeCTA } from "./HomeCTA";

export const Docs = () => {
  return (
    <div className="flex flex-col">
      <DocsHeroSection />
      <HowToUse />
      <HomeSEOContent />
      <HomeFAQ />
      <HomeCTA/>
    </div>
  );
};