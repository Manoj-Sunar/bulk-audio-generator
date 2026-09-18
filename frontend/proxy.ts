// frontend/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Route configuration ────────────────────────────────────────
const PROTECTED_PATHS = [
  '/generator',
  '/bulk-audio/profile',
];

const AUTH_PATHS = [
  '/bulk-audio/bulk-audio-login',
  '/bulk-audio/bulk-audio-register',
  '/bulk-audio/forgot-password',
];

const LOGIN_PATH = '/bulk-audio/bulk-audio-login';
const GENERATOR_PATH = '/generator';

// ✅ Search engine + AI crawler user agents
// यिनलाई page को HTML (metadata + SEO content) देखाउनुहोस्
// तर actual login redirect गर्नु हुँदैन — अन्यथा Google ले "blocked" भन्छ
const BOT_USER_AGENTS = [
  // Google
  'googlebot',
  'google-extended',
  'google-inspectiontool',
  'storebot-google',
  'googleother',
  // Bing
  'bingbot',
  'bingpreview',
  'msnbot',
  'adidxbot',
  // AI crawlers
  'gptbot',
  'chatgpt-user',
  'oai-searchbot',
  'perplexitybot',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'applebot',
  'applebot-extended',
  'bytespider',
  'ccbot',
  'cohere-ai',
  // Social preview (link share गर्दा preview देखाउन)
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'discordbot',
  'slackbot',
  // Others
  'yandexbot',
  'duckduckbot',
  'baiduspider',
];

function isBotRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  return BOT_USER_AGENTS.some((bot) => userAgent.includes(bot));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = !!accessToken;

  // ✅ STEP 1: Bot detection — सबैभन्दा पहिले
  // Bot लाई metadata + SEO content देखाउनुहोस्
  // तर bot लाई login redirect गर्नु हुँदैन
  if (isBotRequest(request)) {
    // Bot लाई page को HTML response दिनुहोस् (200 OK)
    // Page भित्रको sensitive data frontend ले hide गर्नुपर्छ
    return NextResponse.next();
  }

  // ✅ STEP 2: Protected routes — real users only
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const url = new URL(LOGIN_PATH, request.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  // ✅ STEP 3: Auth routes — logged-in user लाई generator मा
  const isAuthRoute = AUTH_PATHS.some((p) => pathname.startsWith(p));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(GENERATOR_PATH, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};