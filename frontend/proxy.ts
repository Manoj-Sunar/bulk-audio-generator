// frontend/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths
const PROTECTED_PATHS = ['/bulk-audio/generator'];
const AUTH_PATHS = ['/bulk-audio/bulk-audio-login', '/bulk-audio/bulk-audio-register'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get cookies from the request
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // 1. If accessing a protected page but NOT logged in -> Redirect to Login
  if (PROTECTED_PATHS.some(path => pathname.startsWith(path)) && !isAuthenticated) {
    const url = new URL('/bulk-audio/bulk-audio-login', request.url);
    return NextResponse.redirect(url);
  }

  // 2. If accessing Login/Register page but ALREADY logged in -> Redirect to Generator
  if (AUTH_PATHS.some(path => pathname.startsWith(path)) && isAuthenticated) {
    const url = new URL('/bulk-audio/generator', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Config ensures it only runs on specified routes
export const config = {
  matcher: [
    '/bulk-audio/generator',
    '/bulk-audio/bulk-audio-login',
    '/bulk-audio/bulk-audio-register',
  ],
};