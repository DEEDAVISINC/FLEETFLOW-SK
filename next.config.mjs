/** @type {import('next').NextConfig} */
const nextConfig = {
  // NUCLEAR CACHE INVALIDATION
  generateBuildId: async () => {
    return `nuclear-rebuild-${Date.now()}-${Math.random()}`;
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
