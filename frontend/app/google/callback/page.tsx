// app/google/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLogin } from '@/app/lib/auth/hooks';
import { toast } from 'sonner';

export default function GoogleCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: googleLogin, isPending, error } = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('Google OAuth Error:', errorParam);
      toast.error('Google authentication failed');
      router.push('/bulk-audio/bulk-audio-login');
      return;
    }

    if (code) {
      googleLogin(code, {
        onSuccess: () => {
          toast.success('Google login successful!');
          router.push('/bulk-audio/generator');
        },
        onError: (err) => {
          console.error('Google Login API Error:', err);
          toast.error('Failed to login with Google');
          router.push('/bulk-audio/bulk-audio-login');
        },
      });
    } else {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [searchParams, googleLogin, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary mx-auto"></div>
        <p className="text-on-surface-variant">Verifying Google login...</p>
      </div>
    </div>
  );
}