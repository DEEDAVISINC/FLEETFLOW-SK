'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface SEOOptimizationsProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  noindex?: boolean;
}

export default function SEOOptimizations({
  title,
  description,
  keywords = [],
  canonicalUrl,
  noindex = false,
}: SEOOptimizationsProps) {
  const pathname = usePathname();
  const currentUrl = `https://fleetflowapp.com${pathname}`;

  // Performance optimizations
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://www.googletagmanager.com',
    'https://js.squareup.com',
  ];

  // DNS prefetch domains for faster loading
  const dnsPrefetchDomains = [
    '//maps.googleapis.com',
    '//api.fleetflowapp.com',
    '//cdn.fleetflowapp.com',
  ];

  return (
    <Head>
      {/* Performance Optimizations */}
      {preconnectDomains.map((domain) => (
        <link key={domain} rel='preconnect' href={domain} />
      ))}

      {dnsPrefetchDomains.map((domain) => (
        <link key={domain} rel='dns-prefetch' href={domain} />
      ))}

      {/* SEO Meta Tags */}
      {title && <title>{title}</title>}
      {description && <meta name='description' content={description} />}
      {keywords.length > 0 && (
        <meta name='keywords' content={keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      <link rel='canonical' href={canonicalUrl || currentUrl} />

      {/* Robots */}
      {noindex && <meta name='robots' content='noindex, nofollow' />}

      {/* Mobile Optimization */}
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no'
      />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />

      {/* Language and Geography */}
      <meta httpEquiv='content-language' content='en-US' />
      <meta name='geo.region' content='US' />
      <meta name='geo.placename' content='United States' />

      {/* Security Headers */}
      <meta httpEquiv='X-Content-Type-Options' content='nosniff' />
      <meta httpEquiv='X-Frame-Options' content='DENY' />
      <meta httpEquiv='X-XSS-Protection' content='1; mode=block' />

      {/* Resource Hints for Critical Resources */}
      <link
        rel='preload'
        href='/fonts/inter-var.woff2'
        as='font'
        type='font/woff2'
        crossOrigin=''
      />

      {/* Favicon and Icons */}
      <link rel='icon' href='/favicon.ico' />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='apple-touch-icon' href='/apple-touch-icon.png' />
      <link rel='manifest' href='/manifest.json' />

      {/* Theme Color */}
      <meta name='theme-color' content='#3b82f6' />
      <meta name='msapplication-TileColor' content='#3b82f6' />
    </Head>
  );
}

// Utility function to generate breadcrumb structured data
export function generateBreadcrumbSchema(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

// Utility function to generate article structured data
export function generateArticleSchema({
  title,
  description,
  author,
  datePublished,
  dateModified,
  image,
  url,
}: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FleetFlow LLC',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fleetflowapp.com/logo.png',
      },
    },
    datePublished,
    dateModified: dateModified || datePublished,
    image: {
      '@type': 'ImageObject',
      url: image,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

// Page Speed Optimization Component
export function PageSpeedOptimizations() {
  return (
    <>
      {/* Critical CSS inlined in head */}
      <style jsx global>{`
        /* Critical above-the-fold styles */
        body {
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            'Roboto',
            sans-serif;
          margin: 0;
          padding: 0;
          line-height: 1.6;
          color: #333;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* Prevent layout shift */
        img,
        video {
          max-width: 100%;
          height: auto;
        }

        /* Loading states */
        .loading {
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>

      {/* Preload critical resources */}
      <link rel='preload' as='style' href='/globals.css' />
      <link rel='preload' as='script' href='/analytics.js' />
    </>
  );
}
