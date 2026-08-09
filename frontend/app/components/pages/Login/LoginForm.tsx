// src/app/components/pages/Login/LoginForm.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useLogin } from '@/app/lib/auth/hooks';
import { Card, CardContent } from '@/app/components/ui/Card';
import { Input } from '@/app/components/Inputs/InputText';
import { Button } from '@/app/components/ui/Button';
import { Paragraph } from '@/app/components/typography/Paragraph';
import { SocialLogin } from './SocialLogin';
import { fadeInUp, staggerContainer } from '@/app/lib/animations';

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const loginMutation = useLogin();

  // Email/Password Login
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
      // Error is handled by the hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden py-20">
      
      <div className="relative z-10 mx-auto max-w-md px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeInUp}>
            <Card className="rounded-2xl border-gray-100 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={isLoading}
                    className="relative overflow-hidden"
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

                  <SocialLogin />
                </form>

                <div className="mt-6 text-center">
                  <Paragraph size="sm" className="text-on-surface-variant">
                    Don't have an account?{' '}
                    <button
                      onClick={() => router.push('/bulk-audio/bulk-audio-register')}
                      className="font-medium text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </Paragraph>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};