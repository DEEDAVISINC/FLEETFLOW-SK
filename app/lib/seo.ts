import { Metadata } from 'next';

export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  twitterImage?: string;
  noindex?: boolean;
  structuredData?: object;
}

// Default SEO configuration
export const defaultSEO: SEOMetadata = {
  title: 'FleetFlow™ - Advanced Transportation Management System',
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
  canonical: '/',
  ogImage: '/og-image.jpg',
  twitterImage: '/og-image.jpg',
};

// Generate metadata for Next.js pages
export function generateMetadata(seo: Partial<SEOMetadata>): Metadata {
  const mergedSEO = { ...defaultSEO, ...seo };

  return {
    title: mergedSEO.title,
    description: mergedSEO.description,
    keywords: mergedSEO.keywords,
    alternates: {
      canonical: mergedSEO.canonical,
    },
    openGraph: {
      title: mergedSEO.title,
      description: mergedSEO.description,
      url: `https://fleetflowapp.com${mergedSEO.canonical}`,
      siteName: 'FleetFlow™',
      images: [
        {
          url: mergedSEO.ogImage || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: mergedSEO.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: mergedSEO.title,
      description: mergedSEO.description,
      images: [mergedSEO.twitterImage || '/og-image.jpg'],
      creator: '@fleetflowapp',
    },
    robots: mergedSEO.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

// Page-specific SEO configurations
export const pageSEO = {
  home: defaultSEO,

  goWithTheFlow: {
    ...defaultSEO,
    title: 'Go With the Flow - AI-Powered Freight Marketplace',
    description:
      'Experience the future of freight transportation with our AI-powered instant marketplace. Connect shippers and carriers instantly with real-time matching, dynamic pricing, and live GPS tracking.',
    keywords: [
      'freight marketplace',
      'instant marketplace',
      'AI freight matching',
      'real-time logistics',
      'dynamic pricing',
      'GPS tracking',
      'freight booking',
      'carrier matching',
      'load board',
      'transportation marketplace',
      'logistics platform',
      'freight technology',
    ],
    canonical: '/go-with-the-flow',
    ogImage: '/og-go-with-the-flow.jpg',
    twitterImage: '/og-go-with-the-flow.jpg',
  },

  launchpad: {
    ...defaultSEO,
    title: 'LaunchPad℠ - Professional Transportation Business Launch Services',
    description:
      'Complete business launch services for freight brokers and owner operators. Get licensed, insured, and operational with our comprehensive LaunchPad program. MC Authority, bonding, compliance, and ongoing support.',
    keywords: [
      'freight broker launch',
      'transportation business startup',
      'MC authority application',
      'freight broker license',
      'BMC-84 bond',
      'DOT compliance',
      'business formation',
      'freight brokerage training',
      'logistics business launch',
      'carrier startup',
      'transportation licensing',
      'freight business formation',
    ],
    canonical: '/launchpad',
    ogImage: '/og-launchpad.jpg',
    twitterImage: '/og-launchpad.jpg',
  },

  plans: {
    ...defaultSEO,
    title:
      'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
    description:
      'Compare FleetFlow pricing plans from solo operators to enterprise teams. Start free with our basic plan or scale with professional and enterprise features. 14-day free trial available.',
    keywords: [
      'TMS pricing',
      'transportation software pricing',
      'freight brokerage software cost',
      'logistics platform pricing',
      'fleet management pricing',
      'dispatch software pricing',
      'CRM pricing',
      'logistics CRM cost',
      'transportation management cost',
      'freight software pricing',
    ],
    canonical: '/plans',
    ogImage: '/og-pricing.jpg',
    twitterImage: '/og-pricing.jpg',
  },

  about: {
    ...defaultSEO,
    title: 'About FleetFlow - Leading Transportation Management System',
    description:
      'Learn about FleetFlow, the leading AI-powered transportation management system serving freight brokers, carriers, and shippers worldwide. Discover our mission, technology, and proven results.',
    keywords: [
      'about FleetFlow',
      'transportation management company',
      'freight brokerage software',
      'logistics technology company',
      'TMS provider',
      'freight software company',
      'logistics platform company',
      'supply chain technology',
      'transportation software company',
      'fleet management company',
    ],
    canonical: '/about',
    ogImage: '/og-about.jpg',
    twitterImage: '/og-about.jpg',
  },

  dashboard: {
    ...defaultSEO,
    title: 'Dashboard - FleetFlow Transportation Management',
    description:
      'Access your FleetFlow dashboard for comprehensive transportation management. Monitor loads, track shipments, manage carriers, and optimize your freight operations.',
    keywords: [
      'TMS dashboard',
      'freight dashboard',
      'transportation dashboard',
      'logistics dashboard',
      'load management',
      'carrier management',
      'dispatch dashboard',
      'shipping dashboard',
    ],
    canonical: '/dashboard',
    noindex: true, // Dashboard pages should not be indexed
  },

  auth: {
    ...defaultSEO,
    title: 'Sign In - FleetFlow Transportation Management System',
    description:
      'Sign in to your FleetFlow account to access advanced transportation management tools, real-time tracking, and AI-powered optimization.',
    canonical: '/auth/signin',
    noindex: true, // Auth pages should not be indexed
  },
};

// Generate structured data for different page types
export function generateStructuredData(type: string, data?: any) {
  const baseUrl = 'https://fleetflowapp.com';

  switch (type) {
    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FleetFlow LLC',
        alternateName: 'FleetFlow™',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
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
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Mexico' },
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
      };

    case 'software':
      return {
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
        url: baseUrl,
      };

    case 'service':
      return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: data?.name || 'Transportation Management Services',
        description:
          data?.description ||
          'Complete transportation management and logistics services',
        provider: {
          '@type': 'Organization',
          name: 'FleetFlow LLC',
        },
        areaServed: [
          { '@type': 'Country', name: 'United States' },
          { '@type': 'Country', name: 'Canada' },
          { '@type': 'Country', name: 'Mexico' },
        ],
        serviceType: data?.serviceType || 'Transportation Management',
      };

    default:
      return null;
  }
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url?: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url ? `https://fleetflowapp.com${crumb.url}` : undefined,
    })),
  };
}
