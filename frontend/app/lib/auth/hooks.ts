// src/lib/auth/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from './context';
import { extractErrorMessage } from '../axios/client';

export function useRegister() {
  const { register, setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      setUser(user);
      toast.success('Registration successful!');
      router.push('/bulk-audio/generator');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useLogin() {
  const { login, setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (user) => {
      setUser(user);
      toast.success('Welcome back!');
      router.push('/bulk-audio/generator');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useLogout() {
  const { logout, setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      toast.success('Logged out');
      router.push('/bulk-audio/bulk-audio-login');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useGoogleLogin() {
  const { googleLogin, setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => googleLogin(code),
    onSuccess: (user) => {
      setUser(user);
      toast.success('Google login successful!');
      router.push('/bulk-audio/generator');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useGithubLogin() {
  const { githubLogin, setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => githubLogin(code),
    onSuccess: (user) => {
      setUser(user);
      toast.success('GitHub login successful!');
      router.push('/bulk-audio/generator');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}

export function useRefreshToken() {
  const { refreshToken } = useAuth();

  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => {
      toast.success('Token refreshed successfully');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message);
    },
  });
}