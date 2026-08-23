// app/components/pages/ResetPassword/ResetPasswordForm.tsx
'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { Button } from '@/app/components/ui/Button';
import { useResetPassword } from '@/app/lib/auth/hooks';
import { fadeInUp } from '@/app/lib/animations';
import { PasswordRequirements } from '@/app/components/typography/PasswordRequirements';
import { PasswordInput } from '@/app/components/Inputs/PasswordInput';
import { ROUTES } from '@/app/lib/constants';

interface ResetPasswordFormProps {
  email: string;
  otp: string;
}

export const ResetPasswordForm = ({ email, otp }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const mutation = useResetPassword();

  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isPasswordValid = newPassword.length >= 8;
  const canSubmit = isPasswordValid && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) {
      if (!isPasswordValid) {
        toast.error('Password must be at least 8 characters.');
      } else if (!passwordsMatch) {
        toast.error('Passwords do not match.');
      }
      return;
    }

    try {
      await mutation.mutateAsync({
        email,
        otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      
      // Clear session storage after successful reset
      sessionStorage.removeItem('otp_verified');
      sessionStorage.removeItem('reset_email');
      sessionStorage.removeItem('reset_otp');
      
      toast.success('Password reset successfully!');
      router.push(ROUTES.LOGIN);
    } catch (error) {
      // Error handled by hook
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
        className="bg-white/50 outline-none w-full"
      />

      <PasswordInput
        label="Confirm New Password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={setConfirmPassword}
        disabled={mutation.isPending}
        required
        autoComplete="new-password"
        className="bg-white/50 outline-none w-full"
      />

      <PasswordRequirements password={newPassword} />

      <Button
        type="submit"
        fullWidth
        disabled={mutation.isPending || !canSubmit}
        className="rounded-xl bg-gradient-to-r from-primary to-secondary py-3.5 text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
      >
        {mutation.isPending ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Resetting...
          </span>
        ) : (
          'Reset Password'
        )}
      </Button>
    </motion.form>
  );
};