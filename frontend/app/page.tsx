// app/page.tsx
import type { Metadata } from "next";
import { Docs } from "./components/pages/home/Docs";

const BASE_URL = "https://bulk-audio-generator.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Free AI Voice Generator | Bulk ElevenLabs & Google AI Studio TTS",
    template: "%s | Bulk Audio Generator",
  },
  description:
    "Free AI voice generator that converts 100+ text scripts into natural AI voices in one click. Uses ElevenLabs API & Google AI Studio for bulk text-to-speech in 70+ languages. Instant ZIP download — no credit card required.",
  keywords: [
    // Primary — High volume
    "free AI voice generator",
    "AI voice generator free download",
    "AI text to voice generator free",
    "bulk AI voice generator",
    "bulk audio generator",
    "voice AI",

    // ElevenLabs cluster — High commercial intent
    "ElevenLabs text to speech",
    "ElevenLabs bulk generator",
    "ElevenLabs API bulk generation",
    "ElevenLabs multiple voices at once",
    "ElevenLabs bulk text to speech",
    "ElevenLabs studio alternative",

    // Google AI Studio cluster
    "Google AI voice generator",
    "Google AI Studio text to speech",
    "Google Gemini TTS bulk",
    "Google AI Studio bulk voice",

    // Murf & competitor cluster — High conversion
    "Murf AI alternative",
    "Murf AI free alternative",
    "Murf AI bulk voice",

    // Bulk TTS modifiers — Long-tail
    "bulk text to speech",
    "batch text to speech",
    "bulk TTS",
    "multiple AI voices generator",
    "generate bulk audio files",
    "bulk voiceover generator",
    "AI voice generator for videos",
    "batch audio generation",
    "100 audio files at once",
    "generate hundreds of audio files",

    // Feature-based long-tail
    "AI voice generator 70 languages",
    "multilingual AI voice generator",
    "voice cloning text to speech",
    "AI voice generator with emotions",
    "natural sounding AI voices bulk",
    "AI voiceover generator bulk download",

    // Use-case keywords
    "AI voice for YouTube videos",
    "faceless YouTube voice generator",
    "TikTok voiceover generator bulk",
    "audiobook narration AI voice",
    "podcast intro voice generator",
  ],
  authors: [
    { name: "Manoj Kami", url: BASE_URL },
  ],
  creator: "Manoj Kami",
  publisher: "Bulk Audio Generator",
  category: "Technology",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Bulk Audio Generator",
    title:
      "Free AI Voice Generator | Bulk ElevenLabs & Google AI Studio TTS",
    description:
      "Generate 100+ AI voices in one click using ElevenLabs API or Google AI Studio. Bulk text-to-speech in 70+ languages with instant ZIP download.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Free AI Voice Generator — Bulk ElevenLabs & Google AI Studio text-to-speech dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Voice Generator | Bulk ElevenLabs & Gemini TTS",
    description:
      "Generate 100+ AI voices in one click. Bulk text-to-speech in 70+ languages. Free — no credit card required.",
    images: ["/hero.jpg"],
    creator: "@bulkaudiogen",
  },
};

// ═══════════════════════════════════════════════════════════
// ✅ Structured Data — 6 schemas for maximum rich results
// ═══════════════════════════════════════════════════════════

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  alternateName: [
    "Bulk AI Voice Generator",
    "Free AI Voice Generator",
    "Bulk ElevenLabs Generator",
  ],
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "Text-to-Speech",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  url: BASE_URL,
  description:
    "Free AI voice generator that uses ElevenLabs API and Google AI Studio to convert hundreds of text scripts into natural-sounding AI voices in bulk. Supports 70+ languages, emotional inflections, and voice cloning. Downloads everything as a ZIP archive.",
  softwareVersion: "2.0",
  releaseNotes:
    "Bulk generation of up to 100 audio files, ElevenLabs & Google AI Studio support, real-time streaming, ZIP export.",
  featureList: [
    "Bulk AI voice generation — 100+ files per batch",
    "ElevenLabs API integration (eleven_multilingual_v2 model)",
    "Google AI Studio / Gemini TTS integration",
    "70+ languages supported",
    "Natural pauses and emotional inflections",
    "Thousands of pre-made voices + voice cloning",
    "Real-time streaming generation",
    "Instant ZIP archive download",
    "Fernet-encrypted API key storage",
    "Works with CapCut, Premiere Pro, Final Cut, DaVinci Resolve",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    description: "Free to start. Uses your own ElevenLabs or Google AI Studio API key.",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "68",
    bestRating: "5",
    worstRating: "1",
  },
  author: {
    "@type": "Person",
    name: "Manoj Kami",
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: "Bulk Audio Generator",
    url: BASE_URL,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bulk Audio Generator",
  url: BASE_URL,
  logo: `${BASE_URL}/wave.svg`,
  description:
    "Free web tool to generate hundreds of AI voices at once using ElevenLabs and Google AI Studio APIs.",
  founder: {
    "@type": "Person",
    name: "Manoj Kami",
  },
  sameAs: ["https://github.com/Manoj-Sunar"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bulk Audio Generator",
  alternateName: "Free Bulk AI Voice Generator",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/bulk-audio/generator?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

// ✅ HowTo schema — for "how to generate bulk AI voice" queries
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Generate Bulk AI Voice Files with ElevenLabs or Google AI Studio",
  description:
    "Step-by-step guide to generate 100+ AI voice files in bulk using your own ElevenLabs or Google AI Studio API key.",
  totalTime: "PT5M",
  estimatedCost: {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: "0",
  },
  tool: [
    { "@type": "HowToTool", name: "ElevenLabs API Key" },
    { "@type": "HowToTool", name: "Google AI Studio API Key (optional)" },
    { "@type": "HowToTool", name: "Bulk Audio Generator" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Get Your API Key",
      text: "Create a free ElevenLabs account and generate an API key from Developers → API Keys, or use Google AI Studio for Gemini TTS.",
      url: `${BASE_URL}/bulk-audio/documentation`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Paste Your Scripts",
      text: "Paste multiple text scripts into the editor. Separate each script with a blank line — every blank line creates a separate audio file.",
      url: `${BASE_URL}/bulk-audio/generator`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Choose Voice & Language",
      text: "Select from thousands of AI voices across 70+ languages. Choose emotional tone, gender, and accent.",
      url: `${BASE_URL}/bulk-audio/generator`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Generate in Bulk",
      text: "Click Generate — all files are processed in parallel with real-time streaming. Up to 100 files per batch.",
      url: `${BASE_URL}/bulk-audio/generator`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Download as ZIP",
      text: "Download all generated MP3 files as a single ZIP archive, ready to import into CapCut, Premiere Pro, or Final Cut.",
      url: `${BASE_URL}/bulk-audio/generator`,
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Bulk Audio Generator really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Bulk Audio Generator is 100% free to use. There are no subscriptions, no hidden fees, and no credit card required. You only pay for what you use through your own ElevenLabs or Google AI Studio account.",
      },
    },
    {
      "@type": "Question",
      name: "How many AI voice files can I generate at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate up to 100 AI voice files in a single batch. Each script produces a separate audio file, and all files are bundled into a single ZIP archive for download. Perfect for chapters, ad lines, YouTube Shorts, and multi-scene videos.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an ElevenLabs API key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You need either an ElevenLabs API key or a Google AI Studio (Gemini) API key. ElevenLabs is recommended for premium voice quality and voice cloning. Google AI Studio is great for multilingual support and free-tier usage. Your key is encrypted with Fernet symmetric encryption and never exposed in the browser.",
      },
    },
    {
      "@type": "Question",
      name: "How many languages does the AI voice generator support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bulk Audio Generator supports over 70 languages through ElevenLabs' multilingual v2 model and Google AI Studio's WaveNet voices. This includes English, Spanish, French, German, Hindi, Japanese, Korean, Arabic, Portuguese, and many more.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use Bulk Audio Generator for YouTube and TikTok videos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Bulk Audio Generator is designed for AI video creators. Generate perfectly timed voiceovers for YouTube videos, YouTube Shorts, TikTok videos, Instagram Reels, faceless channels, podcasts, audiobooks, and e-learning content. Download all files as ZIP and import directly into CapCut, Premiere Pro, or Final Cut.",
      },
    },
    {
      "@type": "Question",
      name: "How long does bulk audio generation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generation happens in real-time as each script is processed. Most batches of 10-50 audio files complete in under 2 minutes, depending on script length and your provider's API speed. Up to 100 files can be generated per batch.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best free Murf AI alternative for bulk generation?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bulk Audio Generator is a popular free Murf AI alternative for bulk voice generation. Unlike Murf AI, which focuses on single-file editing, Bulk Audio Generator is designed for batch processing — generating 100+ audio files at once using ElevenLabs or Google AI Studio APIs and downloading everything as a ZIP.",
      },
    },
    {
      "@type": "Question",
      name: "Does it support voice cloning and emotions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When using ElevenLabs, you can access thousands of pre-made voices and use voice cloning for custom voice output. The platform captures natural pauses, emotional inflections, and contextual emphasis — ideal for storytelling, ads, and narration.",
      },
    },
  ],
};

// ✅ BreadcrumbList — improves SERP appearance
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: BASE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="min-h-screen">
        <Docs />
      </main>
    </>
  );
}