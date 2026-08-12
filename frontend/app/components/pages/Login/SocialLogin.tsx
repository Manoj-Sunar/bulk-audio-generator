// src/app/components/pages/Login/SocialLogin.tsx
"use client";

import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";
import { fadeInUp } from "@/app/lib/animations";

export const SocialLogin = () => {
  const handleGoogleLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/google/callback`;
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    url.searchParams.append('client_id', clientId || '');
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('scope', 'openid email profile');
    url.searchParams.append('access_type', 'offline');
    url.searchParams.append('prompt', 'consent');
    window.location.href = url.toString();
  };

  const handleGithubLogin = () => {
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${window.location.origin}/github/callback`;
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append('client_id', clientId || '');
    url.searchParams.append('redirect_uri', redirectUri);
    url.searchParams.append('scope', 'user:email');
    window.location.href = url.toString();
  };

  return (
    <motion.div variants={fadeInUp} className="space-y-5">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200/70" />
        </div>
        <div className="relative flex justify-center">
          <Paragraph size="xs" className="bg-white/80 px-4 uppercase tracking-[0.2em] text-on-surface-variant/60">
            Or continue with
          </Paragraph>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<FcGoogle size={22} />}
          className="rounded-xl border-gray-200 bg-white/50 py-3 text-sm font-medium text-on-surface transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
          onClick={handleGoogleLogin}
        >
          Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<FaGithub size={20} className="text-gray-700" />}
          className="rounded-xl border-gray-200 bg-white/50 py-3 text-sm font-medium text-on-surface transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
          onClick={handleGithubLogin}
        >
          GitHub
        </Button>
      </div>
    </motion.div>
  );
};