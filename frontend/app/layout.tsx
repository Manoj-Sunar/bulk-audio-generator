// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { QueryProvider } from '@/app/lib/react-query/provider';
import { AuthProvider } from '@/app/lib/auth/context';
import { GoogleOAuthProvider } from './provider/GoogleAuthProvider';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bulk Audio Generator',
  description: 'Generate bulk AI voices using ElevenLabs API',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GoogleOAuthProvider>
          <QueryProvider>
            <AuthProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
              />
            </AuthProvider>
          </QueryProvider>
        </GoogleOAuthProvider>

        <Footer/>
      </body>
    </html>
  );
}