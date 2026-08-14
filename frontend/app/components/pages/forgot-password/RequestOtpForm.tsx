"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Mail } from "lucide-react";

import { Input } from "@/app/components/Inputs/InputText";
import { Button } from "@/app/components/ui/Button";
import { useRequestPasswordReset } from "@/app/lib/auth/hooks";
import { fadeInUp } from "@/app/lib/animations";
import { Span } from "../../typography/Span";

interface RequestOTPFormProps {
  onSuccess: (email: string) => void;
}

export const RequestOTPForm = ({ onSuccess }: RequestOTPFormProps) => {
  const [email, setEmail] = useState("");
  const mutation = useRequestPasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    try {
      const response = await mutation.mutateAsync({ email });
      const serverMessage = response?.data?.message || "If your email is registered, you'll receive an OTP.";
      toast.success(serverMessage);
      onSuccess(email);
    } catch (error) {
      // error is already handled by the hook (toast)
    }
  };

  return (
    <motion.form
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="group relative">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={mutation.isPending}
          leftIcon={<Mail size={18} className="text-on-surface-variant/60 group-focus-within:text-primary transition-colors" />}
          className="bg-white/50 outline-none w-full ml-2 transition-all duration-300 focus:ring-2 focus:ring-primary/30"
        />
        <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-focus-within:w-full" />
      </div>

      <Button
        type="submit"
        fullWidth
        disabled={mutation.isPending}
        className="rounded-xl bg-gradient-to-r from-primary to-secondary py-3.5 text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
      >
        {mutation.isPending ? (
          <Span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </Span>
        ) : (
          "Send OTP"
        )}
      </Button>
    </motion.form>
  );
};