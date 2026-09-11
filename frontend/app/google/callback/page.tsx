'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient, extractErrorMessage } from '@/app/lib/axios/client';
import { useAuth } from '@/app/lib/auth/context';

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error || !code) {
      toast.error('Google authentication failed');
      setStatus('error');
      setTimeout(() => router.push('/bulk-audio/bulk-audio-login'), 1500);
      return;
    }

    const login = async () => {
      try {
        const res = await apiClient.post('/user/google', { token: code });
        const userData = res.data?.data?.user || res.data?.data || res.data;
        setUser(userData);

        toast.success('Google login successful!');
        setStatus('success');
        setTimeout(() => router.push('/bulk-audio/generator'), 800);
      } catch (err: any) {
        const message = extractErrorMessage(err) || 'Google authentication failed';
        toast.error(message);
        setStatus('error');
        setTimeout(() => router.push('/bulk-audio/bulk-audio-login'), 1500);
      }
    };

    login();
  }, [searchParams, router, setUser]);

  const statusMessages = {
    verifying: 'Verifying your Google account...',
    success: 'Login successful! Redirecting...',
    error: 'Authentication failed. Redirecting...',
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="absolute top-0 -left-20 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute bottom-0 -right-20 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-indigo-100/20 blur-2xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl p-8 text-center transition-all duration-500 hover:shadow-blue-500/10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg border border-gray-100">
            <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </div>

          <h1 className="mb-2 text-2xl font-bold text-gray-800">Google Sign-In</h1>
          <p className="mb-6 text-sm font-medium text-gray-500">
            {statusMessages[status]}
          </p>

          <div className="flex justify-center">
            {status === 'verifying' && (
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-500 animate-ping" />
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 border border-green-300">
                <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 border border-red-300">
                <svg className="h-7 w-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {status === 'verifying' && (
            <div className="mt-4 flex justify-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Securely connecting your Google account
        </p>
      </div>
    </div>
  );
}

function GoogleCallbackFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <p className="text-sm text-gray-500">Connecting to Google…</p>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<GoogleCallbackFallback />}>
      <GoogleCallbackInner />
    </Suspense>
  );
}