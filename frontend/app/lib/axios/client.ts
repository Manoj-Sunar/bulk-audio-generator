// app/lib/axios/client.ts
import axios, { AxiosError } from 'axios';
import { API_ROUTES } from '../constants';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log(API_BASE_URL);

export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error_code?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Helper to get CSRF token from cookie
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie.split('; ');
  const csrfCookie = cookies.find(row => row.startsWith('csrf_token='));
  return csrfCookie ? csrfCookie.split('=')[1] : null;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 120000,
});

// Request Interceptor
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

// Response Interceptor
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

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post(API_ROUTES.USER_REFRESH);
        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        if (typeof window !== 'undefined') {
          window.location.href = '/bulk-audio/bulk-audio-login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

export function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse;
    
    if (data?.message) {
      return data.message;
    }
    if (data?.detail) {
      return data.detail;
    }
    if (error.message) {
      return error.message;
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
}