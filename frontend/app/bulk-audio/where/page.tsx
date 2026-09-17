// app/(routes)/page.tsx

import { LandingPage } from "@/app/components/pages/where/LandingPage";
import { Metadata } from "next";

const BASE_URL = "https://bulk-audio-generator.vercel.app";
const CANONICAL = `${BASE_URL}/bulk-audio/where`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Bulk Audio Generator - Perfect Audio for AI Videos | ElevenLabs & Gemini",
    template: "%s | Bulk Audio Generator",
  },
  description:
    "Generate 100+ perfectly timed audio clips for AI videos in seconds. Sync with any video scene. Save 47 hours of editing time. Trusted by 500+ creators.",
  keywords: [
    "bulk audio generation",
    "AI voice generator",
    "video audio sync",
    "ElevenLabs bulk",
    "Gemini TTS",
    "AI video audio",
    "bulk text to speech",
    "AI voiceover",
    "audio clips generator",
    "bulk voiceover",
    "AI audio for videos",
    "CapCut audio sync",
  ],
  authors: [{ name: "Bulk Audio Generator", url: BASE_URL }],
  creator: "Bulk Audio Generator",
  publisher: "Bulk Audio Generator",
  category: "Technology",
  applicationName: "Bulk Audio Generator",
  alternates: {
    canonical: CANONICAL,
    languages: {
      "en-US": CANONICAL,
      "x-default": CANONICAL,
    },
  },
  openGraph: {
    title: "Bulk Audio Generator - Perfect Audio for AI Videos",
    description:
      "Generate 100+ perfectly timed audio clips for AI videos in seconds. Save hours of editing time.",
    url: CANONICAL,
    siteName: "Bulk Audio Generator",
    images: [
      {
        url: `${BASE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generator - AI Video Audio",
        type: "image/jpeg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generator - Perfect Audio for AI Videos",
    description:
      "Generate 100+ perfectly timed audio clips for AI videos in seconds. Trusted by 500+ creators.",
    images: [`${BASE_URL}/twitter-image.jpg`],
    creator: "@bulkaudio",
    site: "@bulkaudio",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace
  },
  other: {
    "msapplication-TileColor": "#6366f1",
    "theme-color": "#6366f1",
  },
};

/* ------------------ JSON-LD Schemas ------------------ */

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Bulk Audio Generator",
  alternateName: "Bulk Audio Gen",
  url: BASE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/generator?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bulk Audio Generator",
  url: BASE_URL,
  logo: `${BASE_URL}/logo.png`,
  description:
    "AI-powered bulk audio generation for creators. Generate 100+ audio clips in seconds using ElevenLabs and Google Gemini.",
  sameAs: [
    // "https://twitter.com/bulkaudio",
    // "https://github.com/bulkaudio",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: CANONICAL,
    },
  ],
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
        text: "Bulk Audio Generator is an AI-powered tool that converts hundreds of text scripts into natural-sounding AI voiceovers in a single click, producing perfectly timed audio clips for AI video creation.",
      },
    },
    {
      "@type": "Question",
      name: "How many audio clips can I generate at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can generate up to 100 audio clips simultaneously per batch. Each clip is generated in about 2-3 seconds, so a full batch of 100 clips completes in under 5 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Which AI voices are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bulk Audio Generator supports premium voices from ElevenLabs and Google Gemini, offering 40+ voice options with multilingual support and customizable tone.",
      },
    },
    {
      "@type": "Question",
      name: "Is Bulk Audio Generator free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Bulk Audio Generator is free to start and requires no credit card. You only need your own ElevenLabs or Gemini API key to generate audio.",
      },
    },
    {
      "@type": "Question",
      name: "Can I export all generated audio at once?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All generated audio files can be downloaded as a single ZIP archive, ready to import into CapCut, Premiere Pro, Final Cut, or any video editor.",
      },
    },
  ],
};

const softwareAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  applicationCategory: "MultimediaApplication",
  applicationSubCategory: "AI Voice Generator",
  operatingSystem: "Web",
  url: CANONICAL,
  description:
    "Generate 100+ perfectly timed AI voice clips for AI videos in seconds using ElevenLabs and Google Gemini.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5.0",
    reviewCount: "68",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Bulk audio generation (100+ clips)",
    "ElevenLabs and Google Gemini voices",
    "One-click ZIP export",
    "Smart script parsing",
    "Audio-video sync for AI videos",
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareAppJsonLd),
        }}
      />
      <LandingPage />
    </>
  );
}