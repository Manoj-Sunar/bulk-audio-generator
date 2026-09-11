// app/lib/axios/client.ts
import axios, { AxiosError } from 'axios';
import { API_ROUTES } from '../constants';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === 'production'
    ? 'https://bulk-audio-generator.onrender.com'
    : 'http://localhost:8000');

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error_code?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// ── Helper: read CSRF token ─────────────────────────────────────
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;

  // 1) Same-site cookie
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find((row) => row.startsWith('csrf_token='));
  if (csrfCookie) return csrfCookie.split('=')[1];

  // 2) Cross-site fallback
  if (typeof window !== 'undefined') {
    return window.localStorage.getItem('csrf_token');
  }
  return null;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 120000,
});

// ── Request Interceptor: attach CSRF token ──────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: refresh-once, no redirect loops ──────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(null);
    }
  });
  failedQueue = [];
};

// URLs that should NEVER trigger a refresh attempt
const NO_REFRESH_URLS = [
  '/user/me',
  '/user/refresh',
  '/user/login',
  '/user/register',
  '/user/google',
  '/user/github',
  '/user/logout',
  // ✅ ADD — these are auth-flow endpoints; the user isn't logged in yet
  '/user/reset-password',
  '/user/verify-otp',
  '/user/request-password-reset',
];

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    const url = originalRequest?.url || '';

    // 1. Skip Next.js RSC prefetch requests
    if (originalRequest?.headers?.['RSC'] === '1') {
      return Promise.reject(error);
    }

    // 2. Skip requests that initiate navigation prefetch
    if (url.startsWith('/_next/')) {
      return Promise.reject(error);
    }

    // 3. Only 401s should trigger refresh
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // 4. Never refresh on auth endpoints themselves
    const isAuthEndpoint = NO_REFRESH_URLS.some((p) => url.includes(p));
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    // 5. Only retry once
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // 6. Queue if a refresh is already in flight
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    // 7. Perform the refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post(API_ROUTES.USER_REFRESH);
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Error message extractor ─────────────────────────────────────
export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse;

    if (data?.message) return data.message;
    if (data?.detail) return data.detail;

    // Network-level errors (no response at all)
    if (!error.response && error.message) {
      if (error.message.includes('Network Error') || error.code === 'ERR_NETWORK') {
        return 'Network error — please check your connection and try again.';
      }
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}