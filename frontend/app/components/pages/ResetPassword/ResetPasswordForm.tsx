"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { Input } from "@/app/components/Inputs/InputText";
import { Button } from "@/app/components/ui/Button";
import { useResetPassword } from "@/app/lib/auth/hooks";
import { fadeInUp } from "@/app/lib/animations";
import { PasswordRequirements } from "./PasswordRequirements";
import { Span } from "../../typography/Span";
import { PasswordInput } from "../../Inputs/PasswordInput";

interface ResetPasswordFormProps {
  email: string;
  otp: string;
}

export const ResetPasswordForm = ({ email, otp }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const mutation = useResetPassword();

  const passwordStrength = useMemo(() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 8) score++;
    if (/[a-z]/.test(newPassword)) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/[0-9]/.test(newPassword)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) score++;
    return score;
  }, [newPassword]);

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await mutation.mutateAsync({
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      const serverMessage = response?.data?.message || "Password reset successfully!";
      toast.success(serverMessage);
      router.push("/bulk-audio/bulk-audio-login");
    } catch (error) {
      // handled by hook
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
      <PasswordInput
        label="New Password"
        placeholder="••••••••"
        value={newPassword}
        onChange={setNewPassword}
        disabled={mutation.isPending}
        required
        autoComplete="new-password"
        className="bg-white/50 outline-none w-full ml-2"
      />
      <PasswordInput
        label="Confirm New Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={setConfirmPassword}
        disabled={mutation.isPending}
        required
        autoComplete="new-password"
        className="bg-white/50 outline-none w-full ml-2"
      />

      <PasswordRequirements password={newPassword} />

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
            Resetting...
          </Span>
        ) : (
          "Reset Password"
        )}
      </Button>
    </motion.form>
  );
};