/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent hydration issues

  // Webpack config for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Inject error suppression at the very beginning of the client bundle
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        // Add error suppression to the beginning of main entry
        if (
          entries['main.js'] &&
          !entries['main.js'].includes('./app/utils/hydrationErrorSuppress.ts')
        ) {
          entries['main.js'].unshift('./app/utils/hydrationErrorSuppress.ts');
        }

        return entries;
      };
    }

    return config;
  },
};

module.exports = nextConfig;
