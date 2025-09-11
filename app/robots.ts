import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/auth/',
        '/admin/',
        '/_next/',
        '/private/',
        '/internal/',
        '/debug/',
        '/test/',
        '/backup/',
        '/temp/',
        '/cache/',
        '/logs/',
        '/node_modules/',
        '/.env',
        '/.git/',
        '/build/',
        '/dist/',
        '/coverage/',
        '/docs/internal/',
      ],
    },
    sitemap: 'https://fleetflowapp.com/sitemap.xml',
    host: 'https://fleetflowapp.com',
  };
}
