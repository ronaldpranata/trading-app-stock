import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Only use static export when explicitly requested
  ...(isStaticExport ? {
    output: 'export',
    basePath: '/stock-analyzer/trading-app',
    assetPrefix: '/stock-analyzer/trading-app/',
    trailingSlash: true,
  } : {
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
            },
          ],
        },
      ];
    },
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
