// app/page.tsx
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
  openGraph: {
    title: "Bulk Audio Generator",
    description: "Generate AI audio in bulk with ElevenLabs and Google AI Studio.",
    type: "website",
    url: "/",
    images: [{ url: "/hero.jpg", width: 1200, height: 630, alt: "Bulk Audio Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generator",
    description: "Generate AI audio in bulk with ElevenLabs and Google AI Studio.",
    images: ["/hero.jpg"],
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  applicationCategory: "Multimedia",
  operatingSystem: "Web",
  description: "Generate bulk AI audio using ElevenLabs or Google AI Studio Text-to-Speech APIs.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />
      <main className="min-h-screen">
        <Docs />
      </main>
    </>
  );
}