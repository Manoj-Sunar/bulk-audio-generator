// app/page.tsx (यो फाइलमा 'use client' नराख्नुहोस्)
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from "next";
import { Docs } from "./components/pages/home/Docs";

export const metadata: Metadata = {
  title: "Bulk Audio Generation | AI Bulk Voice Generator with ElevenLabs",
  description: "Generate AI audio in bulk with ElevenLabs. Convert hundreds of scripts into natural-sounding voices in one click and download all generated audio files as a ZIP archive.",
  // ... बाँकी metadata तपाईंको जस्तै छ
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  // ... बाँकी JSON-LD तपाईंको जस्तै छ
};

export default async function Home() {

  



  // ✅ यदि access_token छैन भने, Docs (होम पेज) देखाउनुहोस्
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />

      <main>
        <Docs />
      </main>
    </>
  );
}