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

    if (requireAuth && !user) {
      router.push(redirectTo);
    }

    if (!requireAuth && user) {
      router.push(ROUTES.GENERATOR);
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

// Reset Password Guard - prevents direct access without OTP verification
export function ResetPasswordGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user came from OTP verification flow
    const hasOTP = sessionStorage.getItem('otp_verified') === 'true';
    const hasEmail = sessionStorage.getItem('reset_email');

    if (!hasOTP || !hasEmail) {
      router.push(ROUTES.FORGOT_PASSWORD);
    }

    // Clean up after component unmount
    return () => {
      // Don't clear immediately - allow form submission
    };
  }, [router]);

  return <>{children}</>;
}