/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force cache busting for auth pages
  generateBuildId: async () => {
    return `build-${Date.now()}-no-auth-cache`;
  },

  // Disable static optimization for auth pages
  experimental: {
    isrMemoryCacheSize: 0,
  },

  // Force no caching
  async headers() {
    return [
      {
        source: '/auth/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },

};

export default nextConfig;
