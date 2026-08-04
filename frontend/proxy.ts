// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  
  // Allow Google popup to communicate with the parent window
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  
  return response;
}

export const config = {
  matcher: '/:path*', // Apply to all routes
};