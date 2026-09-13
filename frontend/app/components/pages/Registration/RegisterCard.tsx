"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "../../ui/Card";
import { RegisterHeader } from "./RegisterHeader";
import { RegisterForm } from "./RegisterForm";
import { SocialRegister } from "./SocialRegister";
import { RegisterFooter } from "./RegisterFooter";

interface RegisterCardProps {
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

export const RegisterCard = ({
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
}: RegisterCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card
                className="
                    relative
                    overflow-hidden
                    rounded-[32px]
                    border-none
                    bg-white/95
                    shadow-2xl
                    shadow-primary/10
                    backdrop-blur-xl
                    ring-1
                    ring-white/20
                    before:absolute
                    before:inset-0
                    before:-z-10
                    before:bg-gradient-to-br
                    before:from-primary/20
                    before:to-secondary/20
                    before:blur-2xl
                "
            >
                <CardContent className="space-y-8 p-6 md:p-8 lg:p-10">
                    <RegisterHeader />
                    <RegisterForm
                        name={name}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        loading={loading}
                        isTermsAccepted={isTermsAccepted}
                        onNameChange={onNameChange}
                        onEmailChange={onEmailChange}
                        onPasswordChange={onPasswordChange}
                        onConfirmPasswordChange={onConfirmPasswordChange}
                        onTermsChange={onTermsChange}
                        onSubmit={onSubmit}
                    />
                    <SocialRegister />
                    <RegisterFooter />
                </CardContent>
            </Card>
        </motion.div>
    );
};