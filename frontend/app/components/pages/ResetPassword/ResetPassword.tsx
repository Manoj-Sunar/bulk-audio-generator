"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { Background } from "@/app/components/ui/Background";
import { Card, CardContent } from "@/app/components/ui/Card";
import { Heading } from "@/app/components/typography/Heading";
import { Paragraph } from "@/app/components/typography/Paragraph";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { Span } from "../../typography/Span";

const StepIndicator = () => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {[1, 2, 3].map((step) => (
      <div key={step} className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full transition-all duration-500 ${step === 3
              ? "bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30 scale-125"
              : step < 3
                ? "bg-primary/60"
                : "bg-gray-300/60"
            }`}
        />
        {step < 3 && <div className="w-12 h-0.5 bg-primary/30" />}
      </div>
    ))}
  </div>
);

export const ResetPassword = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const otp = searchParams.get("otp") || "";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:py-16">
      <Background />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="overflow-hidden rounded-[40px] border border-white/20 bg-white/80 shadow-2xl shadow-primary/10 backdrop-blur-xl ring-1 ring-white/30">
          <div className="h-2 bg-gradient-to-r from-primary via-secondary to-primary/50 bg-[length:200%] animate-gradient" />
          <CardContent className="space-y-8 p-6 sm:p-8 md:p-10">
            <StepIndicator />

            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 shadow-inner"
              >
                <LockKeyhole size={32} className="text-primary drop-shadow-md" />
              </motion.div>
              <Heading
                as="h1"
                size="2xl"
                weight="extrabold"
                className="text-on-background bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center"
              >
                Create new password
              </Heading>
              <Paragraph size="sm" className="mt-2 text-on-surface-variant/80 max-w-xs mx-auto text-center">
                Your new password must be different from previously used passwords.
              </Paragraph>
            </div>

            <ResetPasswordForm email={email} otp={otp} />

            <div className="text-center">
              <Link
                href="/bulk-audio/bulk-audio-login"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary/70 transition-colors hover:text-primary hover:underline group"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
};