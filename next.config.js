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
  // Handle large apps
  experimental: {
    largePageDataBytes: 128 * 1024, // 128KB
  },
  // Image optimization for Digital Ocean
  images: {
    domains: [],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;
