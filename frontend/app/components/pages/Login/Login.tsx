// src/app/components/pages/Login/Login.tsx
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Background } from "../../ui/Background";
import { LoginCard } from "./LoginCard";
import { useGithubLogin, useGoogleLogin } from '@/app/lib/auth/hooks';
import { motion } from 'framer-motion';

export const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const githubLogin = useGithubLogin();
  const googleLogin = useGoogleLogin();

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');
    if (code && provider === 'github') {
      githubLogin.mutate(code);
    } else if (code && provider === 'google') {
      googleLogin.mutate(code);
    }
  }, [searchParams, githubLogin, googleLogin]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:py-16">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <LoginCard />
      </motion.div>
    </main>
  );
};