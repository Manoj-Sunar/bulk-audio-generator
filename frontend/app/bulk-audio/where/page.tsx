// app/(routes)/page.tsx

import { LandingPage } from "@/app/components/pages/where/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Audio Generator - Perfect Audio for AI Videos | ElevenLabs & Gemini",
  description:
    "Generate 100+ perfectly timed audio clips for AI videos in seconds. Sync with any video scene. Save 47 hours of editing time. Trusted by 500+ creators.",
  keywords:
    "bulk audio generation, AI voice, video audio sync, ElevenLabs, Gemini, content creation, video editing, AI video, audio clips, bulk audio, text to speech, AI voice generator",
  openGraph: {
    title: "Bulk Audio Generator - Perfect Audio for AI Videos",
    description:
      "Generate 100+ perfectly timed audio clips for AI videos in seconds. Save hours of editing time.",
    url: "https://bulkaudio.com",
    siteName: "Bulk Audio Generator",
    images: [
      {
        url: "https://bulkaudio.com/og-image.jpg",
        width: 1200,
        height: 630,
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
    images: ["https://bulkaudio.com/twitter-image.jpg"],
  },
  alternates: {
    canonical: "https://bulkaudio.com",
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
  verification: {
    google: "your-google-verification-code",
  },
};

export default function HomePage() {
  return <LandingPage />;
}