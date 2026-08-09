// src/app/components/pages/Login/SocialLogin.tsx
"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";
import { FaGithub } from "react-icons/fa";

export const SocialLogin = () => {
  // Google Login
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

  // GitHub Login
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
    <section className="space-y-6">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant" />
        </div>

        <div className="relative flex justify-center">
          <Paragraph
            size="sm"
            className="bg-surface-container-lowest px-4 uppercase tracking-[0.2em] text-on-surface-variant"
          >
            Or continue with
          </Paragraph>
        </div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<FcGoogle size={22} />}
          className="rounded-2xl"
          onClick={handleGoogleLogin}
        >
          Google
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          leftIcon={<FaGithub size={20} />}
          className="rounded-2xl"
          onClick={handleGithubLogin}
        >
          GitHub
        </Button>
      </div>
    </section>
  );
};