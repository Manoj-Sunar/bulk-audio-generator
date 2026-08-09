// src/app/components/pages/Login/Login.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Background } from "../../ui/Background";
import { LoginCard } from "./LoginCard";
import { useGithubLogin, useGoogleLogin } from '@/app/lib/auth/hooks';

export const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const githubLogin = useGithubLogin();
  const googleLogin = useGoogleLogin();

  // Handle OAuth callbacks from URL
  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');
    
    if (code && provider === 'github') {
      githubLogin.mutate(code);
    } else if (code && provider === 'google') {
      googleLogin.mutate(code);
    }
  }, [searchParams]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16">
      <Background />

      <div className="relative z-10 w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
};