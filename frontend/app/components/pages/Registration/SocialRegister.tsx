"use client";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";

interface SocialRegisterProps {
    onGoogleRegister?: () => void;
    onGithubRegister?: () => void;
    googleLoading?: boolean;
    githubLoading?: boolean;
}

export const SocialRegister = ({
    onGoogleRegister,
    onGithubRegister,
    googleLoading = false,
    githubLoading = false,
}: SocialRegisterProps) => {
    
    // Connect to your FastAPI backend OAuth endpoints
    const handleGoogleLogin = () => {
        if (onGoogleRegister) return onGoogleRegister(); // fallback for custom props
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/google`;
    };

    const handleGithubLogin = () => {
        if (onGithubRegister) return onGithubRegister();
        window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/github`;
    };

    return (
        <section className="space-y-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-outline-variant" />
                </div>
                <div className="relative flex justify-center">
                    <Paragraph size="sm" className="bg-white/95 px-4 uppercase tracking-[0.2em] text-on-surface-variant/70">
                        Or sign up with
                    </Paragraph>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    loading={googleLoading}
                    leftIcon={<FcGoogle size={22} />}
                    className="rounded-2xl bg-white hover:bg-gray-50/80 transition-all"
                    onClick={handleGoogleLogin}
                >
                    Google
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    loading={githubLoading}
                    leftIcon={<FaGithub size={20} />}
                    className="rounded-2xl bg-white hover:bg-gray-50/80 transition-all"
                    onClick={handleGithubLogin}
                >
                    GitHub
                </Button>
            </div>
        </section>
    );
};