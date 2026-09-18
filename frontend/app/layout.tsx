// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/app/lib/react-query/provider';
import { AuthProvider } from '@/app/lib/auth/context';
import { GoogleOAuthProvider } from './provider/GoogleAuthProvider';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://bulk-audio-generator.vercel.app'
  ),
  title: {
    default: 'Bulk Audio Generator | AI Voice Generation',
    template: '%s | Bulk Audio Generator',
  },
  description:
    'Generate bulk AI voices using ElevenLabs and Google Gemini APIs. Convert hundreds of scripts to audio in one click.',
  keywords: [
    'bulk audio generator',
    'ai voice generator',
    'elevenlabs',
    'google gemini',
    'text to speech',
    'bulk tts',
    'ai audio generation',
  ],
  authors: [{ name: 'Bulk Audio Generator' }],
  creator: 'Bulk Audio Generator',
  publisher: 'Bulk Audio Generator',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // ✅ Favicon — तपाईंको actual files अनुसार
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/web-app-manifest-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/wave.png', color: '#3748dd' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://bulk-audio-generator.vercel.app',
    siteName: 'Bulk Audio Generator',
    title: 'Bulk Audio Generator | AI Voice Generation',
    description:
      'Generate bulk AI voices using ElevenLabs and Google Gemini APIs.',
    images: [
      {
        url: '/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Bulk Audio Generator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Audio Generator | AI Voice Generation',
    description: 'Generate bulk AI voices using ElevenLabs and Google Gemini APIs.',
    images: ['/hero.jpg'],
    creator: '@bulkaudiogen',
  },
  verification: {
    google: "VNPS6oYdtSZbcO4htpOir9H6_3tm-Xtzn-9-V4VhMBI",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      {/* 
        ✅ <head> section COMPLETELY REMOVED
        Next.js ले metadata.icons बाट automatically generate गर्छ
        Manual links राख्दा duplicate हुन्छ र favicon देखिँदैन
      */}
      <body className={inter.className}>
        <GoogleOAuthProvider>
          <QueryProvider>
            <AuthProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
                toastOptions={{
                  style: {
                    background: '#ffffff',
                    color: '#1e293b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
                  },
                  className: 'font-inter',
                }}
              />
            </AuthProvider>
          </QueryProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}