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
  } : {}),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
