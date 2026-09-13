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

  // Middleware already redirects — यो safety net मात्र
  useEffect(() => {
    if (isLoading) return;

    if (!requireAuth && user) {
      router.replace(ROUTES.GENERATOR);
    } else if (requireAuth && !user) {
      router.replace(redirectTo);
    }
  }, [user, isLoading, router, requireAuth, redirectTo]);

  // Show spinner ONLY on very first load (no cache)
  if (isLoading && !user) {
    return fallback ?? <FullPageSpinner />;
  }

  if (requireAuth && !user) return null;
  if (!requireAuth && user) return null;

  return <>{children}</>;
}

function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-4 border-t-primary animate-spin" />
        </div>
        <p className="mt-4 text-slate-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Reset Password Guard — session-storage based OTP flow
export function ResetPasswordGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const hasOTP = sessionStorage.getItem('otp_verified') === 'true';
    const hasEmail = sessionStorage.getItem('reset_email');
    if (!hasOTP || !hasEmail) {
      router.replace(ROUTES.FORGOT_PASSWORD);
    }
  }, [router]);

  return <>{children}</>;
}