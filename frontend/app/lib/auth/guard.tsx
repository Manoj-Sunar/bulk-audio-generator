// app/lib/auth/guards.ts
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context';
import { ROUTES } from '../constants';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = ROUTES.LOGIN,
  fallback,
}: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!requireAuth && user) {
      router.push(ROUTES.GENERATOR);
      return;
    }

    if (requireAuth && !user) {
      const t = setTimeout(() => router.push(redirectTo), 300);
      return () => clearTimeout(t);
    }
  }, [user, isLoading, router, requireAuth, redirectTo]);

  if (isLoading) {
    return (
      fallback ?? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto h-16 w-16">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
              <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading...</p>
          </div>
        </div>
      )
    );
  }

  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}

// Reset Password Guard
export function ResetPasswordGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const hasOTP = sessionStorage.getItem('otp_verified') === 'true';
    const hasEmail = sessionStorage.getItem('reset_email');
    if (!hasOTP || !hasEmail) {
      router.push(ROUTES.FORGOT_PASSWORD);
    }
  }, [router]);

  return <>{children}</>;
}