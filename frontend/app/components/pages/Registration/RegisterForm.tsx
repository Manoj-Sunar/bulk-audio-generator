"use client";

import Link from "next/link";
import { AtSign, Eye, EyeOff, Lock, User, CheckCircle2, XCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "../../Inputs/InputText";
import { Button } from "../../ui/Button";
import { Paragraph } from "../../typography/Paragraph";
import { PasswordInput } from "../../Inputs/PasswordInput";

interface RegisterFormProps {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    loading?: boolean;
    isTermsAccepted: boolean;
    onNameChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onConfirmPasswordChange: (value: string) => void;
    onTermsChange: (value: boolean) => void;
    onSubmit: () => void;
}

export const RegisterForm = ({
    name,
    email,
    password,
    confirmPassword,
    loading = false,
    isTermsAccepted,
    onNameChange,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onTermsChange,
    onSubmit,
}: RegisterFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password Strength Calculation
    const passwordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 8) score++;
        if (password.match(/[a-z]+/)) score++;
        if (password.match(/[A-Z]+/)) score++;
        if (password.match(/[0-9]+/)) score++;
        if (password.match(/[$@#&!]+/)) score++;
        return score;
    }, [password]);

    const isPasswordMatch = password && confirmPassword && password === confirmPassword;

    return (
        <div className="space-y-6">
            <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                leftIcon={<User size={18} />}
                className="transition-all w-full border-none outline-none ml-2"
            />

            <Input
                type="email"
                label="Email Address"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                leftIcon={<AtSign size={18} />}
                className="transition-all w-full border-none outline-none ml-2"
            />

            <PasswordInput
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChange={onPasswordChange}
                disabled={loading}
                required
                autoComplete="new-password"
                className="bg-white/50 outline-none w-full ml-2"
            />
            <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={onConfirmPasswordChange}
                disabled={loading}
                required
                autoComplete="new-password"
                className="bg-white/50 outline-none w-full ml-2"
            />

           

            <AnimatePresence>
                {confirmPassword && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`flex items-center gap-2 text-sm ${isPasswordMatch ? "text-green-600" : "text-red-500"}`}
                    >
                        {isPasswordMatch ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        <span>{isPasswordMatch ? "Passwords match" : "Passwords do not match"}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-start gap-3">
                <input
                    id="terms"
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => onTermsChange(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary/50"
                />
                <Paragraph size="sm" className="leading-6 text-on-surface-variant">
                    I agree to the{" "}
                    <Link href="/terms" className="font-medium text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="font-medium text-primary hover:underline">
                        Privacy Policy
                    </Link>
                    .
                </Paragraph>
            </div>

            <Button
                loading={loading}
                fullWidth
                size="lg"
                onClick={onSubmit}
                disabled={!isTermsAccepted || loading}
                className="rounded-2xl shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
            >
                Create Account
            </Button>

            <Paragraph size="sm" className="text-center text-on-surface-variant">
                Already have an account?{" "}
                <Link href="/bulk-audio/bulk-audio-login" className="font-semibold text-primary hover:underline">
                    Sign In
                </Link>
            </Paragraph>
        </div>
    );
};