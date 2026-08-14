"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Background } from "../../ui/Background";
import { RegisterCard } from "./RegisterCard";

import { Heading } from "../../typography/Heading";
import { Paragraph } from "../../typography/Paragraph";
import { useRegister } from "@/app/lib/auth/hooks";


export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);

    // Using the mutation from hooks.ts
    const { mutate: registerUser, isPending } = useRegister();

    const handleRegister = async () => {
        // --- Client-Side Validation ---
        if (!name.trim()) {
            toast.error("Please enter your full name.");
            return;
        }
        if (!email.trim() || !email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (!isTermsAccepted) {
            toast.error("You must agree to the Terms of Service.");
            return;
        }

        // --- Execute Mutation ---
        registerUser({ name, email, password, confirmPassword });
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <Background />

            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="animate-hero-glow absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[140px]" />
                <div className="animate-hero-glow absolute -right-48 bottom-0 h-[520px] w-[520px] rounded-full bg-secondary/20 blur-[170px]" />
            </div>

            <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-4 py-16 lg:px-8">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-24"
                >
                    {/* LEFT - Hero Content */}
                    <div className="hidden lg:block">
                        <div className="max-w-xl space-y-8">
                            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 backdrop-blur-sm px-5 py-2 shadow-inner">
                                <Sparkles size={18} className="text-primary" />
                                <Paragraph size="sm" className="font-semibold text-primary">
                                    AI Powered Voice Generation
                                </Paragraph>
                            </div>

                            <Heading as="h1" size="4xl" weight="extrabold" className="leading-tight">
                                Create Your{" "}
                                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    Bulk Audio
                                </span>{" "}
                                Account
                            </Heading>

                            <Paragraph size="lg" className="leading-8 text-on-surface-variant/80">
                                Join thousands of creators generating AI voices in bulk using ElevenLabs.
                                Upload scripts, generate hundreds of audio files, and download everything instantly as a ZIP archive.
                            </Paragraph>

                            <div className="space-y-5">
                                {[
                                    "Unlimited bulk voice generation",
                                    "Fast one-click ZIP downloads",
                                    "Secure API key encryption (Fernet)",
                                    "Premium quality ElevenLabs voices",
                                ].map((item, idx) => (
                                    <motion.div
                                        key={item}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * idx }}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                                            <Mic2 size={22} />
                                        </div>
                                        <Paragraph className="font-medium text-on-surface">
                                            {item}
                                        </Paragraph>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - Registration Card */}
                    <div className="mx-auto w-full max-w-lg">
                        <RegisterCard
                            name={name}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            loading={isPending}
                            isTermsAccepted={isTermsAccepted}
                            onNameChange={setName}
                            onEmailChange={setEmail}
                            onPasswordChange={setPassword}
                            onConfirmPasswordChange={setConfirmPassword}
                            onTermsChange={setIsTermsAccepted}
                            onSubmit={handleRegister}
                        />
                    </div>
                </motion.div>
            </section>
        </main>
    );
};