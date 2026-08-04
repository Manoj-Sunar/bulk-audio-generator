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
        // Apply this header to ALL pages to fix the Google popup COOP error
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;