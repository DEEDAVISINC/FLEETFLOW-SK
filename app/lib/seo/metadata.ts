import { Metadata } from 'next';

// Base metadata configuration for consistent SEO
const baseUrl = 'https://fleetflowapp.com';
const siteName = 'FleetFlow™';

// WOSB Certification Keywords for enhanced visibility
const wosbKeywords = [
  'women owned small business freight',
  'WOSB transportation management',
  'women owned logistics company',
  'minority owned freight brokerage',
  'diverse supplier transportation',
  'woman owned TMS platform',
  'WOSB certified logistics',
  'women in trucking',
  'female owned freight company',
  'government contracting transportation',
];

// Core business keywords
const coreKeywords = [
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
];

// Industry-specific keywords
const industryKeywords = [
  'transportation management',
  'freight optimization',
  'load matching',
  'carrier network',
  'shipper platform',
  'logistics operations',
  'freight marketplace',
  'transportation intelligence',
  'supply chain visibility',
  'freight tracking',
  'dispatch management',
  'route optimization',
  'fleet operations',
  'logistics software',
  'freight technology',
];

const allKeywords = [...coreKeywords, ...wosbKeywords, ...industryKeywords];

export function generatePageMetadata({
  title,
  description,
  keywords = [],
  path = '/',
  image = '/og-image.jpg',
  type = 'website',
  publishedTime,
  modifiedTime,
  schema,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  schema?: any;
}): Metadata {
  const fullTitle = path === '/' ? `${title}` : `${title} | ${siteName}`;
  const url = `${baseUrl}${path}`;
  const combinedKeywords = [...allKeywords, ...keywords];

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: combinedKeywords,
    authors: [{ name: 'FleetFlow Team' }],
    creator: 'FleetFlow LLC - Women Owned Small Business (WOSB)',
    publisher: 'FleetFlow LLC',
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: 'en_US',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
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
  };

  // Add article-specific metadata
  if (type === 'article' && (publishedTime || modifiedTime)) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
    };
  }

  return metadata;
}

// Pre-defined metadata for major pages
export const pageMetadata = {
  home: generatePageMetadata({
    title:
      'FleetFlow™ - Advanced Transportation Management System | WOSB Certified',
    description:
      'Complete AI-powered transportation management platform serving freight brokers, carriers, and shippers. Advanced TMS with real-time tracking, AI optimization, and enterprise-grade compliance. Women Owned Small Business (WOSB) certified.',
    keywords: [
      'WOSB certified TMS',
      'women owned logistics',
      'government contracting transportation',
    ],
    path: '/',
  }),

  dashboard: generatePageMetadata({
    title: 'FleetFlow Dashboard - Transportation Management Control Center',
    description:
      'Comprehensive transportation management dashboard with real-time analytics, fleet tracking, load management, and AI-powered optimization tools for freight brokers and carriers.',
    keywords: [
      'fleet dashboard',
      'transportation analytics',
      'freight management dashboard',
    ],
    path: '/dashboard',
  }),

  dispatch: generatePageMetadata({
    title: 'Dispatch Central - AI-Powered Load Management & Carrier Matching',
    description:
      'Advanced dispatch management system with AI-powered load matching, carrier optimization, and real-time tracking. Streamline operations and maximize efficiency.',
    keywords: [
      'freight dispatch software',
      'load matching AI',
      'carrier dispatch system',
    ],
    path: '/dispatch',
  }),

  brokers: generatePageMetadata({
    title: 'Freight Broker Platform - Comprehensive Brokerage Operations',
    description:
      'Complete freight brokerage platform with AI-powered quoting, carrier management, shipper tools, and compliance tracking. Build your freight brokerage business.',
    keywords: [
      'freight broker software',
      'brokerage platform',
      'freight broker tools',
    ],
    path: '/broker',
  }),

  carriers: generatePageMetadata({
    title: 'Carrier Network - Connect with High-Paying Freight Loads',
    description:
      'Join our extensive carrier network to access high-paying loads, dedicated lanes, and streamlined operations. Advanced carrier management tools and real-time tracking.',
    keywords: [
      'carrier network',
      'high paying loads',
      'trucking loads',
      'carrier platform',
    ],
    path: '/carriers',
  }),

  shippers: generatePageMetadata({
    title: 'Shipper Platform - Fair Rates & Reliable Transportation',
    description:
      'Connect with verified carriers and get competitive shipping rates. Advanced shipper tools for quote management, tracking, and supply chain optimization.',
    keywords: [
      'shipper platform',
      'shipping rates',
      'freight shipping',
      'supply chain management',
    ],
    path: '/shippers',
  }),

  aiFlow: generatePageMetadata({
    title: 'AI Flow - Intelligent Transportation Automation Platform',
    description:
      'Advanced AI-powered automation for transportation operations. Intelligent load matching, predictive analytics, and automated workflow management.',
    keywords: [
      'AI transportation',
      'freight automation',
      'intelligent logistics',
      'AI TMS',
    ],
    path: '/ai-flow',
  }),

  university: generatePageMetadata({
    title:
      'FleetFlow University - Transportation Industry Training & Certification',
    description:
      'Comprehensive training and certification programs for transportation professionals. Master dispatching, brokerage, carrier operations, and compliance management.',
    keywords: [
      'transportation training',
      'freight broker certification',
      'dispatch training',
      'logistics education',
    ],
    path: '/university',
  }),

  compliance: generatePageMetadata({
    title: 'DOT Compliance Management - FMCSA Compliance Automation',
    description:
      'Automated DOT compliance management with FMCSA integration, safety monitoring, driver qualification tracking, and comprehensive compliance reporting.',
    keywords: [
      'DOT compliance',
      'FMCSA compliance',
      'transportation safety',
      'trucking compliance',
    ],
    path: '/compliance',
  }),

  routes: generatePageMetadata({
    title: 'Route Optimization - AI-Powered Intelligent Route Planning',
    description:
      'Advanced route optimization with AI-powered planning, fuel efficiency analysis, traffic integration, and multi-stop optimization for maximum efficiency.',
    keywords: [
      'route optimization',
      'AI route planning',
      'fuel optimization',
      'logistics routing',
    ],
    path: '/routes',
  }),

  analytics: generatePageMetadata({
    title: 'Transportation Analytics - Business Intelligence Dashboard',
    description:
      'Comprehensive transportation analytics with real-time performance metrics, predictive insights, cost analysis, and business intelligence reporting.',
    keywords: [
      'transportation analytics',
      'logistics BI',
      'freight analytics',
      'supply chain metrics',
    ],
    path: '/analytics',
  }),

  plans: generatePageMetadata({
    title:
      'FleetFlow Pricing Plans - Choose Your Transportation Management Solution',
    description:
      'Flexible pricing plans for transportation management. From individual operators to enterprise fleets. Start free and scale with advanced features.',
    keywords: [
      'TMS pricing',
      'freight software cost',
      'transportation software plans',
    ],
    path: '/plans',
  }),

  about: generatePageMetadata({
    title: 'About FleetFlow - Women Owned Transportation Technology Company',
    description:
      'FleetFlow is a Women Owned Small Business (WOSB) certified transportation technology company providing advanced TMS solutions for freight brokers, carriers, and shippers.',
    keywords: [
      'WOSB transportation company',
      'women owned logistics',
      'transportation technology',
    ],
    path: '/about',
  }),

  contact: generatePageMetadata({
    title: 'Contact FleetFlow - Get Transportation Management Support',
    description:
      'Contact FleetFlow for transportation management solutions. 24/7 support for freight brokers, carriers, and shippers. Schedule a demo or get expert consultation.',
    keywords: [
      'transportation support',
      'TMS support',
      'freight software help',
    ],
    path: '/contact',
  }),

  governmentContracts: generatePageMetadata({
    title: 'Government Contracting - WOSB Transportation Services',
    description:
      'FleetFlow provides government contracting services as a certified Women Owned Small Business (WOSB). Specialized transportation solutions for federal agencies.',
    keywords: [
      'WOSB government contracts',
      'federal transportation services',
      'government freight services',
    ],
    path: '/government-contracts',
  }),
};

// Generate FAQ structured data
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// Generate Service schema
export function generateServiceSchema(service: {
  name: string;
  description: string;
  provider: string;
  areaServed?: string[];
  serviceType?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: service.provider,
    },
    areaServed: service.areaServed?.map((area) => ({
      '@type': 'Country',
      name: area,
    })),
    serviceType: service.serviceType,
  };
}

// Generate Review schema
export function generateReviewSchema(
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'FleetFlow Transportation Management System',
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue:
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length,
      reviewCount: reviews.length,
    },
  };
}
