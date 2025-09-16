/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Digital Ocean deployment configuration
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Handle external packages
  serverExternalPackages: ['@supabase/supabase-js'],
  // Add trailing slash handling for proper routing
  trailingSlash: false,
  // Digital Ocean specific settings
  generateBuildId: async () => {
    // Generate a unique build ID for Digital Ocean
    return `digital-ocean-${Date.now()}`;
  },
  // Skip type checking and linting during build (already configured above)
  // Optimize for Digital Ocean App Platform
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
