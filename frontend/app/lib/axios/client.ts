// src/lib/axios/client.ts
import axios from 'axios';

export const apiClient = axios.create({
  // ✅ Change baseURL to '/api' so requests go through the Next.js proxy
  baseURL: '/api',
  withCredentials: true, // ✅ Keep this to send and receive HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
});

// Optional: Add interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);