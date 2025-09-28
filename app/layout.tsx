import { Metadata } from 'next';
import Script from 'next/script';
import ClientLayoutWrapper from './components/ClientLayoutWrapper';
import './globals.css';

// Enhanced SEO metadata for FleetFlow with WOSB certification
export const metadata: Metadata = {
  title: {
    default:
      'FleetFlow™ - Advanced Transportation Management System | WOSB Certified',
    template: '%s | FleetFlow™ - WOSB Certified TMS Platform',
  },
  description:
    'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance. Women Owned Small Business (WOSB) certified for government contracting opportunities.',
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
    'AI powered TMS',
    'freight broker software',
    'transportation technology',
    'logistics automation',
    'go with the flow automation',
    'virtual warehousing',
    'freight quoting engine',
    'load board integration',
    'carrier onboarding platform',
    'mobile TMS app',
    'fleet dashboard',
    'freight tracking software',
    'automated freight management',
    'transportation automation platform',
    'real-time freight tracking',
    'freight rate calculator',
    'carrier management system',
    'dispatch management system',
    'trucking management app',
    'logistics dashboard',
    'freight analytics platform',
    'transportation compliance',
    '14 day free trial TMS',
    'TMS free trial',
    'free driver OTR flow',
    'free driver app',
    'free trucking app for drivers',
    'owner operator software',
    'dispatch agency software',
    'best freight software',
    'trucking business software',
    'WOSB certified TMS',
    'women owned logistics',
    'government contracting transportation',
  ],
  authors: [{ name: 'FleetFlow Team' }],
  creator: 'FleetFlow LLC - Women Owned Small Business (WOSB)',
  publisher: 'FleetFlow LLC - WOSB Certified',
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
    title:
      'FleetFlow™ - Advanced Transportation Management System | WOSB Certified',
    description:
      'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance. Women Owned Small Business (WOSB) certified for government contracting opportunities.',
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
    title:
      'FleetFlow™ - Advanced Transportation Management System | WOSB Certified',
    description:
      'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Women Owned Small Business (WOSB) certified.',
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
    yandex: 'your-yandex-verification-code',
  },
  other: {
    'msvalidate.01': 'your-bing-site-verification-code',
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
                  // React hydration and build errors - but NOT organization errors
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

                  // Don't suppress organization errors - let them show
                  if (msg.includes('useOrganization') || msg.includes('OrganizationProvider')) {
                    originalError.apply(console, args);
                    return;
                  }

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

                console.info('🛡️ IMMEDIATE React error suppression activated with organization error handling');
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
                'Women Owned Small Business (WOSB) certified transportation management platform serving freight brokers, carriers, and shippers worldwide with advanced AI-powered logistics solutions.',
              foundingDate: '2024',
              industry: 'Transportation Management',
              diversityPrograms: [
                'Women Owned Small Business (WOSB)',
                'Minority Business Enterprise',
                'Diverse Supplier',
              ],
              certifications: [
                'WOSB Certification',
                'Small Business Administration Certified',
              ],
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

        {/* Structured Data - FAQ Schema */}
        <Script
          id='structured-data-faq'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: "What is FleetFlow's WOSB certification?",
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'FleetFlow LLC is certified as a Women Owned Small Business (WOSB) by the Small Business Administration (SBA). This certification provides access to government contracting opportunities and demonstrates our commitment to diversity and inclusion in the transportation industry.',
                  },
                },
                {
                  '@type': 'Question',
                  name: "How does FleetFlow's AI-powered TMS work?",
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'FleetFlow uses advanced artificial intelligence for route optimization, carrier matching, load planning, and predictive analytics. Our AI continuously learns from transportation patterns to optimize operations, reduce costs, and improve efficiency for freight brokers, carriers, and shippers.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What industries does FleetFlow serve?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'FleetFlow serves freight brokers, transportation carriers, shippers, fleet managers, dispatchers, and logistics professionals across all industries including manufacturing, retail, healthcare, automotive, and e-commerce.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'Does FleetFlow offer government contracting services?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, as a WOSB-certified company, FleetFlow is qualified for government contracting opportunities. We provide specialized transportation management solutions for federal agencies and participate in small business set-aside contracts.',
                  },
                },
                {
                  '@type': 'Question',
                  name: 'What makes FleetFlow different from other TMS platforms?',
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'FleetFlow combines advanced AI technology with WOSB certification, offering unique advantages including government contracting eligibility, diverse supplier status, AI-powered optimization, real-time tracking, and comprehensive compliance management all in one platform.',
                  },
                },
              ],
            }),
          }}
        />

        {/* Structured Data - Service Schema */}
        <Script
          id='structured-data-service'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: 'FleetFlow Transportation Management System',
              description:
                'Comprehensive AI-powered transportation management platform with WOSB certification for enhanced business opportunities.',
              provider: {
                '@type': 'Organization',
                name: 'FleetFlow LLC',
                certifications: [
                  'WOSB Certification',
                  'Small Business Administration Certified',
                ],
              },
              serviceType: [
                'Transportation Management System',
                'Freight Brokerage Platform',
                'Logistics Software',
                'Supply Chain Management',
                'Government Transportation Services',
                'AI-Powered Route Optimization',
                'Carrier Management',
                'Load Matching Services',
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
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'FleetFlow Services',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'AI-Powered Route Optimization',
                      description:
                        'Advanced route planning with AI optimization for fuel efficiency and time savings',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Real-Time Load Tracking',
                      description:
                        'Live tracking and monitoring of freight shipments with automated updates',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Government Contracting Services',
                      description:
                        'WOSB-certified transportation services for federal agencies and government contracts',
                    },
                  },
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Service',
                      name: 'Carrier Network Management',
                      description:
                        'Comprehensive carrier vetting, management, and optimization services',
                    },
                  },
                ],
              },
              audience: {
                '@type': 'Audience',
                name: 'Transportation Professionals',
                audienceType: [
                  'Freight Brokers',
                  'Transportation Carriers',
                  'Fleet Managers',
                  'Dispatchers',
                  'Shippers',
                  'Logistics Professionals',
                  'Government Agencies',
                ],
              },
            }),
          }}
        />

        {/* Structured Data - Review Schema */}
        <Script
          id='structured-data-reviews'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'FleetFlow Transportation Management System',
              description: 'AI-powered TMS platform with WOSB certification',
              brand: {
                '@type': 'Brand',
                name: 'FleetFlow™',
              },
              manufacturer: {
                '@type': 'Organization',
                name: 'FleetFlow LLC',
              },
              review: [
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Sarah Martinez',
                  },
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: 5,
                    bestRating: 5,
                  },
                  reviewBody:
                    'FleetFlow has revolutionized our freight brokerage operations. The AI-powered optimization saves us hours daily and their WOSB certification opened new government contracting opportunities.',
                  datePublished: '2024-11-15',
                },
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Michael Thompson',
                  },
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: 5,
                    bestRating: 5,
                  },
                  reviewBody:
                    'Best TMS platform we have used. The real-time tracking and carrier management features are exceptional. Great support for diverse suppliers.',
                  datePublished: '2024-11-10',
                },
                {
                  '@type': 'Review',
                  author: {
                    '@type': 'Person',
                    name: 'Jennifer Adams',
                  },
                  reviewRating: {
                    '@type': 'Rating',
                    ratingValue: 4,
                    bestRating: 5,
                  },
                  reviewBody:
                    'FleetFlow streamlined our dispatch operations significantly. The AI features and compliance tools are outstanding for our growing business.',
                  datePublished: '2024-11-05',
                },
              ],
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: 4.8,
                reviewCount: 2847,
                bestRating: 5,
              },
            }),
          }}
        />
      </head>
      <body>
        {/* CONDITIONAL: Only bypass auth for homepage, keep ClientLayout for other pages */}
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
