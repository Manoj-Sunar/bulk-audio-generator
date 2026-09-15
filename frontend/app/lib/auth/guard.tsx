// app/lib/auth/guards.ts
'use client';

import { useEffect, useState } from 'react';
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
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Redirect logic — but ONLY after initial check
    if (!requireAuth && user) {
      router.replace(ROUTES.GENERATOR);
    } else if (requireAuth && !user) {
      router.replace(redirectTo);
    }
    setHasChecked(true);
  }, [user, isLoading, router, requireAuth, redirectTo]);

  // First load — show spinner ONLY if truly no cached user
  if (isLoading && !user) {
    return fallback ?? <FullPageSpinner />;
  }

  // Auth required but no user — show spinner while redirecting (NOT null!)
  if (requireAuth && !user) {
    return fallback ?? <FullPageSpinner />;
  }

  if (!requireAuth && user) {
    return fallback ?? <FullPageSpinner />;
  }

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