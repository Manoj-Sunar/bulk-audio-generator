/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        // All frontend requests to /api/* will go to http://localhost:8000/*
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none', 
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;