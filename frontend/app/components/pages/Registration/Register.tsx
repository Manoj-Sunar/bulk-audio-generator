"use client";

import { useState } from "react";
import { Mic2, Sparkles } from "lucide-react";

import { Background } from "../../ui/Background";
import { RegisterCard } from "./RegisterCard";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { Span } from "../../typography/Span";

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        try {
            setLoading(true);

            // TODO:
            // Call your FastAPI register endpoint here

            console.log({
                name,
                email,
                password,
                confirmPassword,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <Background />

            {/* Blur */}

            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="animate-hero-glow absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-primary/15 blur-[140px]" />

                <div className="animate-hero-glow absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full bg-secondary/15 blur-[170px]" />
            </div>

            <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-16 lg:px-8">
                <div className="grid w-full items-center gap-16 lg:grid-cols-2">
                    {/* LEFT */}

                    <div className="hidden lg:block">
                        <div className="max-w-xl space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-5 py-2">
                                <Sparkles
                                    size={18}
                                    className="text-primary"
                                />

                                <Paragraph
                                    size="sm"
                                    className="font-semibold text-primary"
                                >
                                    AI Powered Voice Generation
                                </Paragraph>
                            </div>

                            <Heading
                                as="h1"
                                size="4xl"
                                weight="extrabold"
                                className="leading-tight"
                            >
                                Create Your{" "}

                                <span className="text-primary">Bulk Audio</span>

                                Account
                            </Heading>

                            <Paragraph
                                size="lg"
                                className="leading-8 text-on-surface-variant"
                            >
                                Join thousands of creators generating AI
                                voices in bulk using ElevenLabs. Upload
                                scripts, generate hundreds of audio files,
                                and download everything instantly as ZIP.
                            </Paragraph>

                            {/* Features */}

                            <div className="space-y-5">
                                {[
                                    "Unlimited bulk voice generation",
                                    "Fast ZIP downloads",
                                    "Secure API key storage",
                                    "Premium quality AI voices",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-fixed text-primary">
                                            <Mic2 size={22} />
                                        </div>

                                        <Paragraph className="font-medium">
                                            {item}
                                        </Paragraph>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div className="mx-auto w-full max-w-xl">
                        <RegisterCard
                            name={name}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            loading={loading}
                            onNameChange={setName}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onConfirmPasswordChange={
                                setConfirmPassword
                            }
                            onSubmit={handleRegister}
                            onGoogleRegister={() =>
                                console.log("Google Register")
                            }
                            onGithubRegister={() =>
                                console.log("GitHub Register")
                            }
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};