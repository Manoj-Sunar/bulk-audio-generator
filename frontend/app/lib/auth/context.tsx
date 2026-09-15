// app/lib/auth/context.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useRef,
} from 'react';
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

const USER_CACHE_KEY = 'auth_user_cache';

function readCachedUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(USER_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCachedUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      window.localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(USER_CACHE_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const initializedRef = useRef(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  // ✅ FIX #12: Use ref instead of state for refresh lock (no stale closure)
  const isRefreshingRef = useRef(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    writeCachedUser(u);
  }, []);

  const persistCsrf = (payload: any) => {
    if (typeof window === 'undefined') return;
    if (payload?.csrf_token) {
      window.localStorage.setItem('csrf_token', payload.csrf_token);
    }
  };

  // ── Initial auth check ────────────────────────────────────────
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // 1) Instant hydrate from cache
    const cached = readCachedUser();
    if (cached) {
      setUserState(cached);
      setIsLoading(false);
    }

    // 2) Verify with backend in background
    const initAuth = async () => {
      try {
        const response = await apiClient.get('/user/me');
        // ✅ FIX #3: Don't overwrite if login happened in between
        setUserState((current) => current ?? response.data);
      } catch {
        try {
          await apiClient.post('/user/refresh');
          const retry = await apiClient.get('/user/me');
          setUserState((current) => current ?? retry.data);
        } catch {
          // ✅ Only clear if no cached user
          setUserState((current) => current ?? null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // ── Refresh token ─────────────────────────────────────────────
  const refreshToken = useCallback(async (): Promise<void> => {
    // ✅ FIX #12: Use ref, not state — no stale closure
    if (isRefreshingRef.current) return;
    isRefreshingRef.current = true;
    try {
      await apiClient.post('/user/refresh');
      const response = await apiClient.get('/user/me');
      setUser(response.data);
    } catch (error) {
      console.error('Token refresh failed:', extractErrorMessage(error));
      setUser(null);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [setUser]);

  // ── Auto refresh every 8 minutes ──────────────────────────────
  useEffect(() => {
    if (!user) return;
    if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);

    refreshTimerRef.current = setInterval(() => {
      refreshToken();
    }, 8 * 60 * 1000);

    return () => {
      if (refreshTimerRef.current) clearInterval(refreshTimerRef.current);
    };
  }, [user, refreshToken]);

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const response = await apiClient.post('/user/login', { email, password });
      const payload = response.data?.data || response.data;
      persistCsrf(payload);
      const userData = payload?.user || payload;
      setUser(userData);
      return userData;
    },
    [setUser]
  );

  // ── Register ──────────────────────────────────────────────────
  const register = useCallback(
    async (data: RegisterData): Promise<User> => {
      const response = await apiClient.post('/user/register', {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      const payload = response.data?.data || response.data;
      persistCsrf(payload);
      setUser(payload);
      return payload;
    },
    [setUser]
  );

  // ── Google login ──────────────────────────────────────────────
  const googleLogin = useCallback(
    async (code: string): Promise<User> => {
      const response = await apiClient.post('/user/google', { token: code });
      const payload = response.data?.data || response.data;
      persistCsrf(payload);
      const userData = payload?.user || payload;
      setUser(userData);
      return userData;
    },
    [setUser]
  );

  // ── GitHub login ──────────────────────────────────────────────
  const githubLogin = useCallback(
    async (code: string): Promise<User> => {
      const response = await apiClient.post('/user/github', { code });
      const payload = response.data?.data || response.data;
      persistCsrf(payload);
      const userData = payload?.user || payload;
      setUser(userData);
      return userData;
    },
    [setUser]
  );

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiClient.post('/user/logout');
    } catch {
      /* ignore */
    }

    // ✅ FIX #4: Clear state FIRST, then navigate
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('csrf_token');
      window.localStorage.removeItem(USER_CACHE_KEY);
      sessionStorage.removeItem('active_generation_id'); // ✅ FIX #9
    }

    setUserState(null);
    writeCachedUser(null);

    // ✅ FIX #4: Use replace to avoid back-button re-entry
    if (typeof window !== 'undefined') {
      window.location.replace('/bulk-audio/bulk-audio-login');
    }
  }, []);

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