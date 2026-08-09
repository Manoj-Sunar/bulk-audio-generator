// src/app/providers/GoogleOAuthProvider.tsx
'use client';

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export function GoogleOAuthProvider({ children }: { children: React.ReactNode }) {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not found. Google Login will be disabled.');
    return <>{children}</>;
  }

  return (
    <GoogleProvider 
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error('Google OAuth script failed to load')}
    >
      {children}
    </GoogleProvider>
  );
}