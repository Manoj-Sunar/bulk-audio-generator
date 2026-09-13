// app/lib/auth/hooks.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from './context';
import { apiClient, extractErrorMessage } from '../axios/client';

export function useRegister() {
  const { register } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('Registration successful!');
      router.replace('/bulk-audio/generator');
    },
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      toast.success('Welcome back!');
      router.replace('/bulk-audio/generator');
    },
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out');
    },
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useGoogleLogin() {
  const { googleLogin } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => googleLogin(code),
    onSuccess: () => {
      toast.success('Google login successful!');
      router.replace('/bulk-audio/generator');
    },
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useGithubLogin() {
  const { githubLogin } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (code: string) => githubLogin(code),
    onSuccess: () => {
      toast.success('GitHub login successful!');
      router.replace('/bulk-audio/generator');
    },
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useRefreshToken() {
  const { refreshToken } = useAuth();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: () => toast.success('Token refreshed successfully'),
    onError: (error: any) => toast.error(extractErrorMessage(error)),
  });
}

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiClient.post('/user/request-password-reset', data),
    onError: (error: any) =>
      toast.error(extractErrorMessage(error) || 'Failed to send OTP.'),
  });
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (data: { email: string; otp: string }) =>
      apiClient.post('/user/verify-otp', data),
    onError: (error: any) =>
      toast.error(extractErrorMessage(error) || 'Invalid or expired OTP.'),
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
    onSuccess: () =>
      toast.success('Password reset successfully! Redirecting to login...'),
    onError: (error: any) =>
      toast.error(extractErrorMessage(error) || 'Password reset failed.'),
  });
}