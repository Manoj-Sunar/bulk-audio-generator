// app/github/callback/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGithubLogin } from '@/app/lib/auth/hooks';
import { toast } from 'sonner';
import { FaGithub } from 'react-icons/fa';

export default function GithubCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: githubLogin } = useGithubLogin();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      console.error('GitHub OAuth Error:', errorParam);
      toast.error('GitHub authentication failed');
      setStatus('error');
      setTimeout(() => router.push('/bulk-audio/bulk-audio-login'), 1500);
      return;
    }

    if (code) {
      githubLogin(code, {
        onSuccess: () => {
          toast.success('GitHub login successful!');
          setStatus('success');
          setTimeout(() => router.push('/bulk-audio/generator'), 800);
        },
        onError: (err) => {
          console.error('GitHub Login API Error:', err);
          toast.error('Failed to login with GitHub');
          setStatus('error');
          setTimeout(() => router.push('/bulk-audio/bulk-audio-login'), 1500);
        },
      });
    } else {
      router.push('/bulk-audio/bulk-audio-login');
    }
  }, [searchParams, githubLogin, router]);

  const statusMessages = {
    verifying: 'Verifying your GitHub account...',
    success: 'Login successful! Redirecting...',
    error: 'Authentication failed. Redirecting...',
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="rounded-xl bg-white border border-gray-200 shadow-lg p-8 text-center transition-shadow hover:shadow-xl">
          {/* GitHub Icon */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 border border-gray-200">
            <FaGithub className="h-10 w-10 text-gray-800" />
          </div>

          <h1 className="mb-2 text-2xl font-semibold text-gray-800">GitHub Authentication</h1>
          <p className="mb-6 text-sm text-gray-500">{statusMessages[status]}</p>

          {/* Status Indicator */}
          <div className="flex justify-center">
            {status === 'verifying' && (
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-blue-600 animate-ping" />
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

          {/* Loading dots (for verifying) */}
          {status === 'verifying' && (
            <div className="mt-4 flex justify-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          Securely connecting your GitHub account
        </p>
      </div>
    </div>
  );
}