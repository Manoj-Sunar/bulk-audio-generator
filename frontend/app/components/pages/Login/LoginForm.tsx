// src/app/components/pages/Login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock } from 'lucide-react';
import { useLogin } from '@/app/lib/auth/hooks';
import { Input } from '@/app/components/Inputs/InputText';
import { Button } from '@/app/components/ui/Button';
import { SocialLogin } from './SocialLogin';
import { fadeInUp, staggerContainer } from '@/app/lib/animations';

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      setIsLoading(true);
      await loginMutation.mutateAsync({ email, password });
      router.push('/bulk-audio/generator');
    } catch (error) {
      // Error handled by hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div variants={fadeInUp}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            leftIcon={<Mail size={18} className="text-on-surface-variant/60" />}
            className="  bg-white/50   outline-none focus:outline-none w-full ml-2"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            leftIcon={<Lock size={18} className="text-on-surface-variant/60" />}
            className="border-none outline-none ml-2 w-full"
          />
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Button
            type="submit"
            fullWidth
            disabled={isLoading}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Signing in...
              </motion.span>
            ) : (
              'Sign In'
            )}
          </Button>
        </motion.div>
      </form>

      <SocialLogin />
    </motion.div>
  );
};