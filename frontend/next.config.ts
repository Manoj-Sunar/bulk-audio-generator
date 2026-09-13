// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      'https://bulk-audio-generator.onrender.com';
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== 'production';
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const backendUrl = apiUrl.startsWith('http') ? apiUrl : 'https://bulk-audio-generator.onrender.com';

    // connect-src मा development र production दुबै URL राख्नुहोस्
    const connectSrc = [
      "'self'",
      "https://api.elevenlabs.io",
      "https://*.googleapis.com",
      "https://bulk-audio-generator.onrender.com",
      "http://localhost:8000",       // ← development
      "http://127.0.0.1:8000",       // ← development fallback
      backendUrl,
    ]
      .filter(Boolean)
      .join(' ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://*.googleusercontent.com https://avatars.githubusercontent.com",
              "font-src 'self' data:",
              "media-src 'self' data: blob:",
              `connect-src ${connectSrc}`,
              "frame-src https://accounts.google.com",
              "worker-src 'self' blob:",
              "child-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // ⚠️ development मा upgrade-insecure-requests हटाउनुहोस्
              ...(isDev ? [] : ["upgrade-insecure-requests"]),
            ].join('; '),
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  async redirects() {
    return [{ source: '/home', destination: '/', permanent: true }];
  },
};

module.exports = nextConfig;