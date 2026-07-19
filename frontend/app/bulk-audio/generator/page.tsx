import { ApiKeyCard } from "@/app/components/pages/generator/ApiKeyCard";
import { Generator } from "@/app/components/pages/generator/Generator";
import { GeneratorHeader } from "@/app/components/pages/generator/GeneratorHeader";
import type { Metadata } from "next";


export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),

  title:
    "Bulk Audio Generation | Bulk AI Voice Generator with ElevenLabs",

  description:
    "Generate AI audio in bulk using ElevenLabs. Convert hundreds of scripts into natural AI voices in one click and download every generated audio file as a ZIP archive.",

  keywords: [
    "bulk audio generation",
    "bulk ai voice generator",
    "bulk voice generation",
    "bulk text to speech",
    "bulk audio generator",
    "ai audio generator",
    "elevenlabs bulk generator",
    "multiple audio generator",
    "generate ai voices",
    "bulk speech synthesis",
    "bulk text to audio",
    "bulk tts",
  ],

  authors: [
    {
      name: "Bulk Audio Generator",
    },
  ],

  creator: "Bulk Audio Generator",

  publisher: "Bulk Audio Generator",

  category: "Technology",

  alternates: {
    canonical: "/generator",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com/generator",
    siteName: "Bulk Audio Generator",
    title: "Bulk Audio Generation | Bulk AI Voice Generator",
    description:
      "Generate hundreds of AI voice files simultaneously using ElevenLabs API.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generation Dashboard",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generation",
    description:
      "Generate hundreds of AI voices in seconds using ElevenLabs.",
    images: ["/hero.jpg"],
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bulk Audio Generator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",

  description:
    "Bulk Audio Generator lets you generate hundreds of AI voice files simultaneously using your ElevenLabs API key.",

  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function GeneratorPage() {
  return (
    <>
      {/* JSON-LD */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd),
        }}
      />

      <main className="bg-background">

       <Generator/>
       
      </main>
    </>
  );
}