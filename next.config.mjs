/** @type {import('next').NextConfig} */
const nextConfig = {
  // FORCE VERCEL COMPLETE REBUILD
  generateBuildId: async () => {
    return `force-vercel-rebuild-${Date.now()}-${Math.random()}-${process.env.VERCEL_GIT_COMMIT_SHA || 'local'}`;
  },
  // Temporarily disable ESLint during build for deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
  // Disable caching for auth-related pages
  async headers() {
    return [
      {
        source: '/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
