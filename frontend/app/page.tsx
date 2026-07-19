import type { Metadata } from "next";

import { Docs } from "./components/pages/documentation/Docs";

export const metadata: Metadata = {
  title: "Bulk Audio Generation | AI Bulk Voice Generator with ElevenLabs",

  description:
    "Generate AI audio in bulk with ElevenLabs. Convert hundreds of scripts into natural-sounding voices in one click and download all generated audio files as a ZIP archive.",

  keywords: [
    "bulk audio generation",
    "bulk ai voice generator",
    "bulk voice generator",
    "bulk text to speech",
    "bulk audio generator",
    "bulk voice generation",
    "elevenlabs bulk generator",
    "generate multiple audio files",
    "ai speech generator",
    "ai voice generation",
  ],

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Bulk Audio Generation | AI Bulk Voice Generator",
    description:
      "Generate hundreds of AI voice files simultaneously using ElevenLabs API.",
    url: "/",
    type: "website",
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
      "Generate hundreds of AI voices using ElevenLabs in one click.",
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
    "Generate AI voices in bulk using the ElevenLabs API. Convert multiple scripts into high-quality audio and download everything as a ZIP archive.",
  featureList: [
    "Bulk AI Voice Generation",
    "Multiple Script Processing",
    "ZIP Download",
    "ElevenLabs API Integration",
    "Fast Audio Generation",
  ],
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

      <main>
        <Docs />
      </main>
    </>
  );
}