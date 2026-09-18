// app/generator/page.tsx
import type { Metadata } from "next";
import { Generator } from "@/app/components/pages/generator/Generator";
import { PublicGeneratorInfo } from "@/app/components/pages/generator/PublicGenerationInfo";


const BASE_URL = "https://bulk-audio-generator.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Bulk AI Voice Generator — Generate 100+ Voices with ElevenLabs & Gemini",
  description:
    "Generate bulk AI voice files with ElevenLabs or Google AI Studio. Convert 100+ text scripts into natural-sounding AI voices in 70+ languages, download all as a ZIP. Login required to use.",
  keywords: [
    "bulk AI voice generator",
    "generate bulk audio ElevenLabs",
    "ElevenLabs bulk generation tool",
    "Google AI Studio bulk TTS",
    "AI voice generator 70 languages",
    "batch text to speech online",
    "free bulk voice generator login",
  ],
  alternates: {
    canonical: `${BASE_URL}/generator`,
  },
  robots: {
    index: true,        // ✅ Index the page (metadata मात्र भए पनि)
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${BASE_URL}/generator`,
    siteName: "Bulk Audio Generator",
    title: "Bulk AI Voice Generator — ElevenLabs & Google AI Studio",
    description:
      "Convert 100+ text scripts into AI voices in one batch. ElevenLabs & Gemini support. Login to start generating.",
    images: [
      {
        url: `${BASE_URL}/hero.jpg`,
        width: 1200,
        height: 630,
        alt: "Bulk AI Voice Generator dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk AI Voice Generator",
    description: "Generate 100+ AI voices with ElevenLabs & Gemini. Login required.",
    images: [`${BASE_URL}/hero.jpg`],
  },
};

// ✅ SoftwareApplication schema — page को लागि
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  url: `${BASE_URL}/generator`,
  description:
    "Bulk AI voice generator that uses ElevenLabs API and Google AI Studio to convert 100+ text scripts into natural AI voices in 70+ languages.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free. Uses your own ElevenLabs or Google AI Studio API key.",
  },
  featureList: [
    "Bulk generation — 100+ files per batch",
    "ElevenLabs eleven_multilingual_v2 model",
    "Google AI Studio Gemini TTS",
    "70+ languages supported",
    "Voice cloning available",
    "Real-time streaming",
    "ZIP archive download",
  ],
};

// ✅ HowTo schema — "how to use generator" searches को लागि
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate Bulk AI Voices",
  totalTime: "PT3M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Login to Bulk Audio Generator",
      text: "Create a free account or login to access the bulk voice generator.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Enter your API key",
      text: "Paste your ElevenLabs or Google AI Studio API key. It is encrypted and stored securely.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Paste your scripts",
      text: "Paste multiple scripts, separated by blank lines. Each script becomes a separate audio file.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Generate and download",
      text: "Click Generate. All files stream in real-time and download as a ZIP.",
    },
  ],
};

export default function GeneratorPage() {
  return (
    <>
      {/* ✅ JSON-LD schemas — Google bot ले पढ्छ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      {/*
        ✅ HYBRID APPROACH:
        - Bot ले माथिको <head> metadata + <PublicGeneratorInfo> को static HTML पढ्छ
        - Real user ले <Generator /> component देख्छ
        - Bot ले कहिल्यै actual API keys वा user data देख्दैन (किनभने त्यो client-side render हुन्छ)
      */}

      <main className="bg-background">
        {/* ✅ Public SEO content — bot ले पढ्छ, user ले देख्दैन (sr-only) */}
        <PublicGeneratorInfo />

        {/* ✅ Actual generator — client-side render, login required */}
        <Generator />
      </main>
    </>
  );
}