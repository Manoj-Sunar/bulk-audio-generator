// app/documentation/page.tsx
import { Documentation } from "@/app/components/pages/documentation/Documentation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"),
  title: "Documentation | Bulk Audio Generator using ElevenLabs",
  description:
    "Complete documentation for Bulk Audio Generator. Learn how to configure ElevenLabs API, generate hundreds of AI voices, and use the FastAPI backend.",
  keywords: [
    "Bulk Audio Generator Documentation",
    "Bulk Audio Generation",
    "Bulk AI Voice Generator",
    "ElevenLabs Documentation",
    "ElevenLabs API Guide",
    "Bulk Voice Generator",
    "FastAPI ElevenLabs",
    "Bulk Text To Speech",
    "AI Voice Generator",
    "Generate Multiple Audio Files",
  ],
  alternates: {
    canonical: "/documentation",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Bulk Audio Generator Documentation",
    description:
      "Complete guide for using Bulk Audio Generator with ElevenLabs API.",
    url: "https://your-domain.com/documentation",
    type: "article",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generator Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bulk Audio Generator Documentation",
    description: "Everything you need to use Bulk Audio Generator.",
    images: ["/hero.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Bulk Audio Generator Documentation",
  description:
    "Learn how to use Bulk Audio Generator with ElevenLabs.",
  author: {
    "@type": "Organization",
    name: "Bulk Audio Generator",
  },
};

export default function DocumentationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <Documentation />
    </>
  );
}