"use client";


import { FcGoogle } from "react-icons/fc";

import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";
import { FaGithub } from "react-icons/fa";

interface SocialLoginProps {
  onGoogleLogin?: () => void;
  onGithubLogin?: () => void;
  googleLoading?: boolean;
  githubLoading?: boolean;
}

export const SocialLogin = ({
  onGoogleLogin,
  onGithubLogin,
  googleLoading = false,
  githubLoading = false,
}: SocialLoginProps) => {
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
          loading={googleLoading}
          leftIcon={<FcGoogle size={22} />}
          className="rounded-2xl"
          onClick={onGoogleLogin}
        >
          Google
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          loading={githubLoading}
          leftIcon={<FaGithub size={20} />}
          className="rounded-2xl"
          onClick={onGithubLogin}
        >
          GitHub
        </Button>
      </div>
    </section>
  );
};