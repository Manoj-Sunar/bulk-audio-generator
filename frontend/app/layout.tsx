import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

import { Navbar } from "./components/Layout/Navbar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://your-domain.com"), // Replace with your actual domain

  title: {
    default: "Bulk Audio Generator | Bulk AI Voice Generator with ElevenLabs",
    template: "%s | Bulk Audio Generator",
  },

  description:
    "Bulk Audio Generator is a powerful AI voice generation tool that converts hundreds of scripts into high-quality speech using the ElevenLabs API. Generate multiple audio files in one click and download them as a ZIP archive.",

  applicationName: "Bulk Audio Generator",

  authors: [
    {
      name: "Bulk Audio Generator",
    },
  ],

  creator: "Bulk Audio Generator",

  publisher: "Bulk Audio Generator",

  category: "Technology",

  keywords: [
    "bulk audio generation",
    "bulk audio generator",
    "bulk ai voice generator",
    "bulk voice generator",
    "bulk text to speech",
    "bulk tts",
    "ai audio generator",
    "elevenlabs api",
    "elevenlabs bulk generator",
    "generate ai voices",
    "text to speech",
    "multiple audio generator",
    "speech synthesis",
    "voice cloning",
    "ai speech generator",
  ],

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/wave.svg",
    shortcut: "/wave.svg",
    apple: "/wave.svg",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com",
    siteName: "Bulk Audio Generator",

    title: "Bulk Audio Generator",

    description:
      "Generate hundreds of AI voices simultaneously using ElevenLabs. Convert multiple scripts into speech in seconds.",

    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Bulk Audio Generator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Bulk Audio Generator",

    description:
      "Generate hundreds of AI voices in one click using ElevenLabs.",

    images: ["/hero.jpg"],
  },

  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION",
  },

  other: {
    "theme-color": "#3748dd",
    "color-scheme": "light",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${poppins.className} h-full scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-on-background antialiased">
        <Navbar />

        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}