/** @type {import('next').NextConfig} */
const nextConfig = {
  // Minimal configuration for Digital Ocean deployment
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Digital Ocean standalone build
  output: 'standalone',
  trailingSlash: false,
  poweredByHeader: false,
  // Disable optimizations that cause build issues
  swcMinify: false,
  compiler: {
    removeConsole: false,
  },
  // Minimal external packages
  serverExternalPackages: [],
  // Basic experimental config
  experimental: {
    forceSwcTransforms: false,
  },
  // Disable image optimization
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
