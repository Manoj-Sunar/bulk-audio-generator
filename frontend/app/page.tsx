// app/page.tsx
import type { Metadata } from "next";
import { Docs } from "./components/pages/home/Docs";

export const metadata: Metadata = {
  metadataBase: new URL("https://bulk-audio-generator.vercel.app"),
  title: "Bulk Audio Generator | Generate 100+ AI Voices in One Click",
  description:
    "Generate 100+ AI voices in one click with ElevenLabs & Google AI Studio. Bulk text-to-speech, instant ZIP download. Start free — no credit card required.",
  keywords: [
    "Bulk Audio Generator",
    "Bulk Audio Generation",
    "AI Bulk Voice Generator",
    "Bulk Voice Generator",
    "ElevenLabs Bulk Generator",
    "Google AI Studio Bulk",
    "Bulk Text to Speech",
    "Bulk TTS",
    "AI Voice Generator",
    "Batch Text to Speech",
    "Multiple AI Voices",
    "Generate AI Audio in Bulk",
  ],
  authors: [{ name: "Manoj Kami", url: "https://bulk-audio-generator.vercel.app" }],
  creator: "Manoj Kami",
  publisher: "Bulk Audio Generator",
  category: "Technology",
  alternates: {
    canonical: "/",
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
    url: "https://bulk-audio-generator.vercel.app",
    siteName: "Bulk Audio Generator",
    title: "Bulk Audio Generator | Generate 100+ AI Voices in One Click",
    description:
      "Generate 100+ AI voices in one click with ElevenLabs & Google AI Studio. Bulk TTS with instant ZIP download. Start free.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generator dashboard showing batch text-to-speech generation with ElevenLabs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generator | Generate 100+ AI Voices in One Click",
    description:
      "Generate 100+ AI voices in one click with ElevenLabs & Google AI Studio. Bulk TTS with instant ZIP download.",
    images: ["/hero.jpg"],
  },
};

// ═══════════════════════════════════════════════════════════
// ✅ Structured Data — 4 schemas
// ═══════════════════════════════════════════════════════════

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  alternateName: "Bulk AI Voice Generator",
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "Text-to-Speech",
  operatingSystem: "Web",
  url: "https://bulk-audio-generator.vercel.app",
  description:
    "Bulk Audio Generator uses ElevenLabs and Google AI Studio APIs to convert hundreds of text scripts into natural-sounding AI voices in one click.",
  featureList: [
    "Bulk AI voice generation (100+ files at once)",
    "ElevenLabs API integration",
    "Google AI Studio integration",
    "Multi-script batch processing",
    "Real-time streaming generation",
    "Instant ZIP archive download",
    "Secure API key encryption (Fernet)",
    "Premium voice profiles",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
 
  author: {
    "@type": "Person",
    name: "Manoj Kami",
    url: "https://bulk-audio-generator.vercel.app",
  },
  publisher: {
    "@type": "Organization",
    name: "Bulk Audio Generator",
    url: "https://bulk-audio-generator.vercel.app",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bulk Audio Generator",
  url: "https://bulk-audio-generator.vercel.app",
  logo: "https://bulk-audio-generator.vercel.app/wave.svg",
  description:
    "Bulk Audio Generator — a free web tool to generate hundreds of AI voices at once using ElevenLabs and Google AI Studio.",
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
  url: "https://bulk-audio-generator.vercel.app",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Bulk Audio Generator?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bulk Audio Generator is a free web tool that converts hundreds of text scripts into AI voices simultaneously using ElevenLabs or Google AI Studio APIs. You paste multiple scripts, generate all audio files at once, and download them as a ZIP archive.",
      },
    },
    {
      "@type": "Question",
      name: "How many AI voices can I generate at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate up to 100 AI voice files in a single batch. Each script produces a separate audio file, and all files are bundled into a single ZIP archive for download.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an ElevenLabs API key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Bulk Audio Generator uses your own ElevenLabs or Google AI Studio API key. Your key is encrypted with Fernet symmetric encryption and stored securely in our database — it is never exposed in the browser.",
      },
    },
    {
      "@type": "Question",
      name: "Is Bulk Audio Generator free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bulk Audio Generator is completely free to use. You only pay for what you use through your own ElevenLabs or Google AI Studio account.",
      },
    },
    {
      "@type": "Question",
      name: "How long does bulk audio generation take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Generation happens in real-time as each script is processed. Most batches of 10-50 audio files complete in under 2 minutes, depending on the length of your scripts and your provider's API speed.",
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="min-h-screen">
        <Docs />
      </main>
    </>
  );
}