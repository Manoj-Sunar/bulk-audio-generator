// src/lib/auth/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from './context';
import { apiClient, extractErrorMessage } from '../axios/client';

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


export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      // Replace with your API client call
      apiClient.post('/user/request-password-reset', data),
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message || 'Failed to send OTP.');
    },
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      apiClient.post('/user/verify-otp', data),
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message || 'Invalid or expired OTP.');
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      new_password: string;
      confirm_password: string;
    }) => apiClient.post('/user/reset-password', data),
    onSuccess: () => {
      toast.success('Password reset successfully! Redirecting to login...');
    },
    onError: (error: any) => {
      const message = extractErrorMessage(error);
      toast.error(message || 'Password reset failed.');
    },
  });
}