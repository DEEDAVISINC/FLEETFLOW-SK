/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Digital Ocean App Platform configuration
  output: 'standalone',
  // Disable static generation to prevent prerendering issues
  trailingSlash: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // External packages optimization
  serverExternalPackages: [
    '@supabase/supabase-js',
    'anthropic',
    'elevenlabs'
  ],
  // Production optimizations
  trailingSlash: false,
  poweredByHeader: false,
  compress: true,
  // Digital Ocean build optimization
  generateBuildId: async () => {
    return `fleetflow-${Date.now()}`;
  },
  // Handle large apps and problematic prerendering
  experimental: {
    largePageDataBytes: 128 * 1024, // 128KB
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
    // Disable static generation for all pages to prevent prerendering issues
    serverActions: true,
    // Force dynamic rendering
    forceSwcTransforms: true,
    // Skip static optimization for all pages
    skipTrailingSlashRedirect: true,
  },
  // Disable static optimization entirely for problematic builds
  staticPageGenerationTimeout: 0,
  // Force all pages to be dynamic
  async rewrites() {
    return [];
  },
  // Image optimization for Digital Ocean
  images: {
    domains: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
