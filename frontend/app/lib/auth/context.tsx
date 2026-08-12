// src/lib/auth/context.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import { apiClient, extractErrorMessage } from '../axios/client';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  googleLogin: (code: string) => Promise<User>;
  githubLogin: (code: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const initializedRef = useRef(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const safetyTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth loading timeout reached - forcing UI to render');
        setIsLoading(false);
      }
    }, 5000);

    const initAuth = async () => {
      try {
        const response = await apiClient.get('/user/me');
        setUser(response.data);
      } catch (error) {
        // Try refresh once
        try {
          await apiClient.post('/user/refresh');
          const retry = await apiClient.get('/user/me');
          setUser(retry.data);
        } catch (refreshError) {
          setUser(null); // ✅ Explicitly set to null so Navbar updates
        }
      } finally {
        clearTimeout(safetyTimeout);
        setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Auto refresh token every 10 minutes
  useEffect(() => {
    if (!user) return;

    const setupRefreshTimer = () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      refreshTimerRef.current = setInterval(() => {
        console.log('Auto-refreshing token...');
        refreshToken();
      }, 10 * 60 * 1000); // 10 minutes
    };

    setupRefreshTimer();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [user]);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/user/login', { email, password });
    const userData = response.data?.data?.user || response.data?.data || response.data;
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post('/user/register', {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
    const userData = response.data?.data || response.data;
    setUser(userData);
    return userData;
  }, []);

  const googleLogin = useCallback(async (code: string): Promise<User> => {
    const response = await apiClient.post('/user/google', { token: code });
    const userData = response.data?.data?.user || response.data?.data || response.data;
    setUser(userData);
    return userData;
  }, []);

  const githubLogin = useCallback(async (code: string): Promise<User> => {
    const response = await apiClient.post('/user/github', { code });
    const userData = response.data?.data?.user || response.data?.data || response.data;
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiClient.post('/user/logout');
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      setUser(null);
    } catch (error) {
      setUser(null);
      throw error;
    }
  }, []);




  useEffect(() => {
    if (!user) return;

    const setupRefreshTimer = () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }

      refreshTimerRef.current = setInterval(() => {
        console.log('Auto-refreshing token...');
        refreshToken();
      }, 8 * 60 * 1000); // 8 minutes
    };

    setupRefreshTimer();

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, [user]);



  // ... बाँकी फङ्क्सनहरू (login, register, googleLogin, githubLogin, logout) पहिले जस्तै छन्

  const refreshToken = useCallback(async (): Promise<void> => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      // ✅ यहाँ response interceptor ले automatically cookie update गर्छ
      await apiClient.post('/user/refresh');

      // ✅ Re-fetch user data
      const response = await apiClient.get('/user/me');
      setUser(response.data);
    } catch (error) {
      console.error('Token refresh failed:', extractErrorMessage(error));
      setUser(null);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    googleLogin,
    githubLogin,
    logout,
    refreshToken,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}