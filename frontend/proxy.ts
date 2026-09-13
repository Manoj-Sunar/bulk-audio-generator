// frontend/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Route configuration ────────────────────────────────────────
const PROTECTED_PATHS = [
  '/bulk-audio/generator',
  '/bulk-audio/profile',
];

// Logged-in user लाई यी routes बाट redirect गर्ने
// reset-password exception हो (OTP flow — session based)
const AUTH_PATHS = [
  '/bulk-audio/bulk-audio-login',
  '/bulk-audio/bulk-audio-register',
  '/bulk-audio/forgot-password',
];

const LOGIN_PATH = '/bulk-audio/bulk-audio-login';
const GENERATOR_PATH = '/bulk-audio/generator';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read auth tokens from cookies
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const isAuthenticated = !!accessToken || !!refreshToken;

  // 1. Protected route + not authenticated → login
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // 2. Auth route + authenticated → generator
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(GENERATOR_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths EXCEPT:
     * - /api/*          → reverse proxy (next.config.ts rewrites)
     * - /_next/*        → Next.js internals
     * - static files    → .svg, .png, .jpg, .ico, etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};