// src/lib/auth/hooks.ts
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../axios/client';
import { useAuth } from './context';

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};




export function useRegister() {
  const { setUser, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await apiClient.post('/user/register', data);
      return response.data.data; // { id, name, email, ... }
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (userData) => {
      setUser(userData);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
}


export function useLogin() {
  const { setUser, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await apiClient.post('/user/login', data);
      return response.data.data.user;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (user) => {
      setUser(user);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
}


export function useGoogleLogin() {
  const { setUser, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async (token: string) => {
      const response = await apiClient.post('/user/google', { token });
      return response.data.data.user;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (user) => {
      setUser(user);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
}


export function useGithubLogin() {
  const { setUser, setIsLoading } = useAuth();

  return useMutation({
    mutationFn: async (accessToken: string) => {
      const response = await apiClient.post('/user/github', { access_token: accessToken });
      return response.data.data.user;
    },
    onMutate: () => setIsLoading(true),
    onSuccess: (user) => {
      setUser(user);
      setIsLoading(false);
    },
    onError: () => setIsLoading(false),
  });
}


export function useLogout() {
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async () => {
      // Call a logout endpoint if exists; otherwise clear cookies locally
      // Since cookies are HttpOnly, we need a backend endpoint to clear them.
      // For now, we assume you have a /logout endpoint.
      await apiClient.post('/user/logout');
    },
    onSuccess: () => setUser(null),
  });
}