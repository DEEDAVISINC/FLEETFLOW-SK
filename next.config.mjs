/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force cache invalidation
  generateBuildId: async () => {
    return `build-${Date.now()}`;
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
