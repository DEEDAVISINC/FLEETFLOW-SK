import { generatePageMetadata } from './metadata';

// Comprehensive Feature-Specific Landing Page SEO
export const featureLandingPages = {
  // Go With The Flow - Automation Platform
  goWithTheFlow: generatePageMetadata({
    title: 'Go With The Flow - Automated Transportation Management | FleetFlow',
    description:
      'Streamline your transportation operations with Go With The Flow automation. Automated dispatch, load matching, carrier onboarding, and freight management workflows.',
    keywords: [
      'go with the flow automation',
      'automated freight management',
      'transportation automation platform',
      'logistics workflow automation',
      'freight flow automation',
      'automated dispatch system',
      'smart logistics workflows',
    ],
    path: '/go-with-the-flow',
  }),

  // Virtual Warehousing
  virtualWarehousing: generatePageMetadata({
    title: 'Virtual Warehousing Solutions - Cloud-Based Inventory Management',
    description:
      'Manage inventory across multiple locations with virtual warehousing. Cloud-based warehouse management, digital inventory tracking, and virtual fulfillment solutions.',
    keywords: [
      'virtual warehousing',
      'virtual warehouse management',
      'cloud warehouse system',
      'digital warehouse solutions',
      'virtual inventory management',
      'online warehouse platform',
      'cloud-based warehousing',
    ],
    path: '/virtual-warehousing',
  }),

  // Freight Quoting Engine
  freightQuoting: generatePageMetadata({
    title: 'Freight Quoting Engine - Instant Rate Calculator & Pricing Tool',
    description:
      'Get instant freight quotes with our AI-powered pricing engine. Compare rates, calculate shipping costs, and generate competitive freight quotes automatically.',
    keywords: [
      'freight quoting engine',
      'freight rate calculator',
      'shipping rate quotes',
      'freight pricing software',
      'transportation quoting system',
      'freight cost calculator',
      'shipping quote generator',
    ],
    path: '/freight-quoting',
  }),

  // Load Board Integration
  loadBoard: generatePageMetadata({
    title: 'Load Board Integration - Connect to All Major Freight Boards',
    description:
      'Integrate with major load boards including DAT, Truckstop.com, and more. Automated load posting, carrier matching, and freight marketplace access.',
    keywords: [
      'load board integration',
      'freight load board',
      'load matching software',
      'freight marketplace platform',
      'load board connectivity',
      'automated load posting',
    ],
    path: '/load-board',
  }),

  // Carrier Onboarding
  carrierOnboarding: generatePageMetadata({
    title: 'Automated Carrier Onboarding - Streamline Carrier Qualification',
    description:
      'Automate carrier onboarding with digital applications, document verification, insurance tracking, and compliance management. Speed up carrier approval process.',
    keywords: [
      'carrier onboarding platform',
      'automated carrier onboarding',
      'carrier qualification system',
      'carrier verification system',
      'digital carrier onboarding',
      'carrier management automation',
    ],
    path: '/carrier-onboarding',
  }),

  // Fleet Dashboard
  fleetDashboard: generatePageMetadata({
    title: 'Fleet Management Dashboard - Real-Time Fleet Tracking & Analytics',
    description:
      'Monitor your entire fleet with real-time tracking, performance analytics, maintenance scheduling, and driver management. Complete fleet visibility in one dashboard.',
    keywords: [
      'fleet management dashboard',
      'fleet tracking software',
      'fleet analytics platform',
      'real-time fleet monitoring',
      'fleet performance tracking',
      'fleet operations dashboard',
    ],
    path: '/fleet-dashboard',
  }),

  // Dispatch Central
  dispatchCentral: generatePageMetadata({
    title: 'Dispatch Central - AI-Powered Freight Dispatch Management',
    description:
      'Optimize dispatch operations with AI-powered load matching, carrier selection, route planning, and real-time tracking. Increase efficiency and reduce costs.',
    keywords: [
      'freight dispatch software',
      'dispatch management system',
      'AI dispatch optimization',
      'load dispatch platform',
      'carrier dispatch tools',
      'dispatch workflow automation',
    ],
    path: '/dispatch',
  }),

  // Mobile TMS
  mobileTMS: generatePageMetadata({
    title: 'Mobile TMS App - Transportation Management on the Go',
    description:
      'Manage transportation operations from anywhere with our mobile TMS app. Driver communication, load tracking, document capture, and dispatch tools.',
    keywords: [
      'mobile TMS app',
      'trucking mobile app',
      'freight mobile platform',
      'logistics mobile solution',
      'driver mobile app',
      'mobile freight management',
    ],
    path: '/mobile-app',
  }),

  // API Integration
  apiIntegration: generatePageMetadata({
    title: 'TMS API Integration - Connect Your Transportation Systems',
    description:
      'Integrate FleetFlow with your existing systems using our comprehensive API. Connect ERP, accounting, CRM, and other business applications.',
    keywords: [
      'TMS API integration',
      'transportation API',
      'logistics API platform',
      'freight software integration',
      'TMS system integration',
      'transportation data exchange',
    ],
    path: '/api',
  }),

  // Analytics Platform
  analytics: generatePageMetadata({
    title:
      'Transportation Analytics - Freight Performance & Business Intelligence',
    description:
      'Advanced analytics and reporting for transportation operations. Track KPIs, monitor performance, and make data-driven decisions with comprehensive dashboards.',
    keywords: [
      'transportation analytics',
      'freight analytics platform',
      'logistics business intelligence',
      'transportation metrics',
      'freight reporting software',
      'logistics performance analytics',
    ],
    path: '/analytics',
  }),

  // Compliance Management
  compliance: generatePageMetadata({
    title: 'DOT Compliance Management - FMCSA Compliance Automation',
    description:
      'Automate DOT compliance with driver qualification tracking, vehicle inspections, safety monitoring, and regulatory reporting. Stay compliant effortlessly.',
    keywords: [
      'DOT compliance software',
      'FMCSA compliance management',
      'trucking compliance system',
      'transportation safety management',
      'compliance automation platform',
    ],
    path: '/compliance',
  }),

  // Invoice Management
  invoicing: generatePageMetadata({
    title: 'Freight Invoice Management - Automated Billing & Collections',
    description:
      'Streamline freight invoicing with automated billing, invoice processing, payment tracking, and collections management. Improve cash flow and reduce errors.',
    keywords: [
      'freight invoice management',
      'automated freight billing',
      'transportation invoicing software',
      'freight accounts receivable',
      'invoice processing automation',
    ],
    path: '/invoicing',
  }),

  // Shipper Portal
  shipperPortal: generatePageMetadata({
    title: 'Shipper Portal - Customer Self-Service Transportation Platform',
    description:
      'Provide shippers with self-service access to request quotes, track shipments, manage orders, and view invoices through a branded customer portal.',
    keywords: [
      'shipper portal software',
      'customer transportation portal',
      'freight shipper platform',
      'shipper self-service portal',
      'freight customer portal',
    ],
    path: '/shipper-portal',
  }),

  // Route Optimization
  routeOptimization: generatePageMetadata({
    title: 'AI Route Optimization - Smart Transportation Planning',
    description:
      'Optimize routes with AI-powered planning that considers traffic, fuel costs, driver hours, and delivery windows. Reduce miles and improve efficiency.',
    keywords: [
      'AI route optimization',
      'transportation route planning',
      'freight route optimizer',
      'smart route planning',
      'logistics route optimization',
      'fuel efficient routing',
    ],
    path: '/routes',
  }),

  // Document Management
  documentManagement: generatePageMetadata({
    title: 'Transportation Document Management - Digital BOL & Paperwork',
    description:
      'Digitize transportation documents including BOLs, PODs, invoices, and compliance papers. Electronic signature capture and cloud storage.',
    keywords: [
      'transportation document management',
      'digital BOL system',
      'electronic freight documents',
      'freight paperwork automation',
      'transportation document storage',
    ],
    path: '/documents',
  }),

  // Training & Certification
  training: generatePageMetadata({
    title: 'FleetFlow University - Transportation Training & Certification',
    description:
      'Professional training and certification for transportation professionals. Dispatcher training, broker certification, carrier education, and compliance courses.',
    keywords: [
      'transportation training',
      'freight broker certification',
      'dispatch training courses',
      'logistics education platform',
      'trucking industry training',
    ],
    path: '/university',
  }),
};

// Generate comprehensive sitemap entries for all feature pages
export const generateFeatureSitemap = () => {
  const baseUrl = 'https://fleetflowapp.com';
  return Object.keys(featureLandingPages).map((feature) => {
    const metadata =
      featureLandingPages[feature as keyof typeof featureLandingPages];
    return {
      url: `${baseUrl}${metadata.path}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    };
  });
};
