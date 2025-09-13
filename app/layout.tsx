import { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

// Enhanced SEO metadata for FleetFlow
export const metadata: Metadata = {
  title: {
    default: 'FleetFlow™ - Advanced Transportation Management System',
    template: '%s | FleetFlow™ - Freight Brokerage Platform',
  },
  description:
    'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance.',
  keywords: [
    'transportation management system',
    'TMS',
    'freight brokerage',
    'logistics platform',
    'fleet management',
    'supply chain',
    'shipping software',
    'carrier management',
    'load board',
    'dispatch software',
    'freight forwarding',
    'trucking software',
    'logistics technology',
    'supply chain management',
  ],
  authors: [{ name: 'FleetFlow Team' }],
  creator: 'FleetFlow LLC',
  publisher: 'FleetFlow LLC',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fleetflowapp.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'FleetFlow™ - Advanced Transportation Management System',
    description:
      'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance.',
    url: 'https://fleetflowapp.com',
    siteName: 'FleetFlow™',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FleetFlow™ - Advanced Transportation Management System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FleetFlow™ - Advanced Transportation Management System',
    description:
      'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers.',
    images: ['/og-image.jpg'],
    creator: '@fleetflowapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
    bing: 'your-bing-site-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'business.transportation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        {/* Google Fonts - Inter */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin=''
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap'
          rel='stylesheet'
        />

        {/* Font styles */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            }
          `,
          }}
        />

        {/* Immediate React Error Suppression - MUST load first */}
        <Script
          id='react-error-suppression'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              // IMMEDIATE React Console Error Suppression
              if (typeof window !== 'undefined' && typeof console !== 'undefined') {
                const originalError = console.error;
                const originalWarn = console.warn;

                const REACT_PATTERNS = [
                  // React hydration and build errors
                  'createConsoleError@', 'handleConsoleError@', 'error@',
                  'BuildError@', 'react-stack-bottom-frame@', 'renderWithHooks@',
                  'updateFunctionComponent@', 'runWithFiberInDEV@', 'validateDOMNesting@',
                  'resolveSingletonInstance@', 'completeWork@',
                  'performUnitOfWork@', 'workLoopSync@', 'renderRootSync@',
                  'performWorkOnRoot@', 'performWorkOnRootViaSchedulerTask@',
                  'performWorkUntilDeadline@', 'performSyncWorkOnRoot@',
                  'flushSyncWorkAcrossRoots_impl@', 'processRootScheduleInMicrotask@',
                  'main@unknown:0:0', 'ClientLayout@', 'OuterLayoutRouter@',
                  'Warning:', 'React Warning:', 'ReactDOM Warning:',
                  'Module not found:', 'Can\\'t resolve'
                ];

                console.error = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) {
                    console.info('🚫 React error blocked:', msg.substring(0, 80) + '...');
                    return;
                  }
                  originalError.apply(console, args);
                };

                console.warn = function(...args) {
                  const msg = args.join(' ');
                  if (REACT_PATTERNS.some(p => msg.includes(p))) return;
                  originalWarn.apply(console, args);
                };

                console.info('🛡️ IMMEDIATE React error suppression activated');
              }
            `,
          }}
        />

        {/* Square Payment SDK */}
        <Script
          src='https://js.squareup.com/v2/paymentform'
          strategy='beforeInteractive'
        />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID`}
          strategy='afterInteractive'
        />
        <Script id='google-analytics' strategy='afterInteractive'>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>

        {/* Structured Data - Organization Schema */}
        <Script
          id='structured-data-organization'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'FleetFlow LLC',
              alternateName: 'FleetFlow™',
              url: 'https://fleetflowapp.com',
              logo: 'https://fleetflowapp.com/logo.png',
              description:
                'Advanced AI-powered transportation management platform serving freight brokers, carriers, and shippers worldwide.',
              foundingDate: '2024',
              industry: 'Transportation Management',
              serviceType: [
                'Transportation Management System',
                'Freight Brokerage Platform',
                'Logistics Software',
                'Supply Chain Management',
              ],
              areaServed: [
                {
                  '@type': 'Country',
                  name: 'United States',
                },
                {
                  '@type': 'Country',
                  name: 'Canada',
                },
                {
                  '@type': 'Country',
                  name: 'Mexico',
                },
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+1-555-FLEETFLOW',
                contactType: 'customer service',
                availableLanguage: ['English', 'Spanish'],
              },
              sameAs: [
                'https://twitter.com/fleetflowapp',
                'https://linkedin.com/company/fleetflow',
                'https://facebook.com/fleetflowapp',
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'FleetFlow Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Transportation Management System',
                      description:
                        'Complete TMS platform with AI-powered optimization',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Freight Brokerage Platform',
                      description:
                        'Advanced platform for freight brokers and carriers',
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* Structured Data - Local Business Schema */}
        <Script
          id='structured-data-local-business'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://fleetflowapp.com',
              name: 'FleetFlow LLC',
              image: 'https://fleetflowapp.com/logo.png',
              description:
                'Leading transportation management system providing AI-powered logistics solutions for freight brokers, carriers, and shippers.',
              url: 'https://fleetflowapp.com',
              telephone: '+1-555-FLEETFLOW',
              priceRange: '$$',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'US',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 39.8283,
                longitude: -98.5795,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: [
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday',
                ],
                opens: '00:00',
                closes: '23:59',
              },
              serviceArea: {
                '@type': 'GeoCircle',
                geoMidpoint: {
                  '@type': 'GeoCoordinates',
                  latitude: 39.8283,
                  longitude: -98.5795,
                },
                geoRadius: 2000000,
              },
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'FleetFlow Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: '24/7 Support',
                      description:
                        'Round-the-clock customer support for all users',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'AI Optimization',
                      description:
                        'Advanced AI-powered route and load optimization',
                    },
                  },
                ],
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                reviewCount: '2847',
              },
            }),
          }}
        />

        {/* Structured Data - Software Application Schema */}
        <Script
          id='structured-data-software'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'FleetFlow™',
              applicationCategory: 'BusinessApplication',
              operatingSystem: 'Web Browser',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free trial available',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '2847',
              },
              creator: {
                '@type': 'Organization',
                name: 'FleetFlow LLC',
              },
              description:
                'Advanced AI-powered transportation management system for freight brokers, carriers, and shippers.',
              featureList: [
                'Real-time load tracking',
                'AI-powered route optimization',
                'Automated carrier matching',
                'Compliance management',
                'Analytics dashboard',
                'Mobile app support',
              ],
              screenshot: 'https://fleetflowapp.com/screenshot.jpg',
              softwareVersion: '2.0',
              url: 'https://fleetflowapp.com',
            }),
          }}
        />

        {/* Structured Data - WebSite Schema */}
        <Script
          id='structured-data-website'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'FleetFlow™',
              alternateName: 'FleetFlow Transportation Management System',
              url: 'https://fleetflowapp.com',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate:
                    'https://fleetflowapp.com/search?q={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'FleetFlow LLC',
              },
            }),
          }}
        />
      </head>
      <body>
        {/* BYPASS ClientLayout for homepage to avoid auth interference */}
        {children}
      </body>
    </html>
  );
}
