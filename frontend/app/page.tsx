

import type { Metadata } from "next";
import { Docs } from "./components/pages/home/Docs";

export const metadata: Metadata = {
  title: "Bulk Audio Generation | AI Bulk Voice Generator with ElevenLabs & Google AI Studio",
  description: "Generate AI audio in bulk with ElevenLabs and Google AI Studio. Convert hundreds of scripts into natural-sounding voices in one click and download all generated audio files as a ZIP archive.",
  keywords: [
    "Bulk Audio Generator",
    "AI Voice Generator",
    "ElevenLabs",
    "Google AI Studio",
    "Text to Speech",
    "Bulk TTS",
    "AI Audio Generation",
    "ElevenLabs API",
    "Google TTS API",
    "Bulk Voice Generation",
  ],
  // ... बाँकी metadata तपाईंको जस्तै छ
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  applicationCategory: "Multimedia",
  operatingSystem: "Web",
  description: "Generate bulk AI audio using ElevenLabs or Google AI Studio Text-to-Speech APIs. Process hundreds of scripts simultaneously.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
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