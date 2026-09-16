// app/documentation/page.tsx
import { Documentation } from "@/app/components/pages/documentation/Documentation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://bulk-audio-generator.vercel.app"),   // ✅ सही URL
  title: "Documentation | Bulk Audio Generator — ElevenLabs & Google AI Studio",
  description:
    "Complete step-by-step documentation for Bulk Audio Generator. Learn how to configure ElevenLabs API or Google AI Studio Text-to-Speech, generate 100+ AI voices in bulk, and download everything as a ZIP archive.",
  keywords: [
    "Bulk Audio Generator Documentation",
    "Bulk Audio Generation Guide",
    "Bulk AI Voice Generator Tutorial",
    "ElevenLabs Documentation",
    "ElevenLabs API Guide",
    "Google AI Studio Documentation",
    "Google TTS API Guide",
    "Bulk Voice Generator Tutorial",
    "FastAPI ElevenLabs Guide",
    "Bulk Text To Speech Tutorial",
    "AI Voice Generator Setup",
    "Generate Multiple Audio Files Guide",
  ],
  authors: [
    { name: "Manoj Kami", url: "https://bulk-audio-generator.vercel.app" },
  ],
  creator: "Manoj Kami",
  publisher: "Bulk Audio Generator",
  alternates: {
    canonical: "https://bulk-audio-generator.vercel.app/bulk-audio/documentation",   // ✅ absolute
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
    type: "article",
    locale: "en_US",
    url: "https://bulk-audio-generator.vercel.app/bulk-audio/documentation",
    siteName: "Bulk Audio Generator",
    title: "Bulk Audio Generator Documentation — Complete Guide",
    description:
      "Step-by-step guide to configure ElevenLabs and Google AI Studio for bulk AI voice generation. Generate 100+ voices, download ZIP instantly.",
    images: [
      {
        url: "https://bulk-audio-generator.vercel.app/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generator Documentation - Complete Setup Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generator Documentation",
    description:
      "Everything you need to generate bulk AI voices with ElevenLabs & Google AI Studio.",
    images: ["https://bulk-audio-generator.vercel.app/hero.jpg"],
  },
};

// ═══════════════════════════════════════════════════════════
// ✅ Structured Data — 3 schemas
// ═══════════════════════════════════════════════════════════

const techArticleJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Bulk Audio Generator Documentation — Complete Guide",
  description:
    "Complete documentation for Bulk Audio Generator. Learn how to configure ElevenLabs API and Google AI Studio Text-to-Speech, generate hundreds of AI voices, and use the FastAPI backend.",
  url: "https://bulk-audio-generator.vercel.app/bulk-audio/documentation",
  image: {
    "@type": "ImageObject",
    url: "https://bulk-audio-generator.vercel.app/hero.jpg",
    width: 1200,
    height: 630,
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
    logo: {
      "@type": "ImageObject",
      url: "https://bulk-audio-generator.vercel.app/wave.png",
      width: 512,
      height: 512,
    },
  },
  datePublished: "2025-09-01",
  dateModified: new Date().toISOString().split("T")[0],
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://bulk-audio-generator.vercel.app/bulk-audio/documentation",
  },
  articleSection: "Documentation",
  keywords:
    "bulk audio generator, elevenlabs, google ai studio, bulk text to speech, ai voice generation",
  inLanguage: "en-US",
  wordCount: 1850,
  proficiencyLevel: "Beginner",
  dependencies: "Modern web browser, ElevenLabs or Google AI Studio API key",
  about: [
    {
      "@type": "Thing",
      name: "Bulk Audio Generation",
    },
    {
      "@type": "Thing",
      name: "Text-to-Speech",
    },
    {
      "@type": "Thing",
      name: "ElevenLabs API",
    },
    {
      "@type": "Thing",
      name: "Google AI Studio",
    },
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
      item: "https://bulk-audio-generator.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Documentation",
      item: "https://bulk-audio-generator.vercel.app/bulk-audio/documentation",
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need an ElevenLabs account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This application uses the official ElevenLabs API. You must create an account and generate your own API key before generating audio.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I get my API Key?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Login to your ElevenLabs dashboard, go to your profile settings, navigate to API Keys, and create a new key. Make sure to grant it Text to Speech (for generating audio) and Voice Read (to fetch available voice profiles) permissions.",
      },
    },
    {
      "@type": "Question",
      name: "Is my API key stored securely?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your API key is encrypted using Fernet symmetric encryption and stored securely in our database. The raw key is never exposed in the browser or to any third party.",
      },
    },
    {
      "@type": "Question",
      name: "How do I separate multiple scripts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply leave one blank line between scripts. Every blank line represents a new audio generation request.",
      },
    },
    {
      "@type": "Question",
      name: "Can I generate hundreds of files?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The application is designed for bulk generation and can process large batches depending on your ElevenLabs plan and backend configuration.",
      },
    },
    {
      "@type": "Question",
      name: "Why did generation fail?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common reasons include an invalid API key, exceeded ElevenLabs quota, backend connection issues, or unsupported voice settings.",
      },
    },
    {
      "@type": "Question",
      name: "Can I download everything together?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. After generation completes, all audio files can be downloaded individually or together as a ZIP archive.",
      },
    },
  ],
};

export default function DocumentationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Documentation />
    </>
  );
}