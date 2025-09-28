// SEO Content Strategy for FleetFlow
export interface ContentStrategy {
  page: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  contentPillars: string[];
  targetAudience: string[];
  competitiveAdvantages: string[];
  callToAction: string;
}

export const contentStrategy: Record<string, ContentStrategy> = {
  home: {
    page: 'Homepage',
    primaryKeywords: [
      'transportation management system',
      'TMS platform',
      'freight brokerage software',
      'AI powered logistics',
      'affordable TMS software',
    ],
    secondaryKeywords: [
      'logistics technology',
      'supply chain management',
      'trucking management app',
      'freight tracking software',
      'load board integration',
      'carrier management system',
      'go with the flow automation',
      'virtual warehousing',
      'freight quoting engine',
    ],
    contentPillars: [
      'Comprehensive TMS Platform',
      'AI-Powered Transportation Technology',
      'Real-Time Tracking & Optimization',
      'Complete Freight Management Suite',
      'Go With The Flow Automation',
      'Virtual Warehousing Solutions',
      'Advanced Freight Quoting Engine',
    ],
    targetAudience: [
      'Freight Brokers',
      'Transportation Carriers',
      'Fleet Managers',
      'Dispatchers',
      'Shippers',
      'Trucking Companies',
      'Logistics Professionals',
      'Owner Operators',
      'Fleet Owners',
    ],
    competitiveAdvantages: [
      'All-in-one TMS platform',
      'AI-powered optimization',
      'Real-time tracking',
      '14-day free trial available',
      'Easy integration',
      'Mobile-first design',
      'Comprehensive feature set',
      'User-friendly interface',
    ],
    callToAction: 'Start Free Trial',
  },

  governmentContracts: {
    page: 'Government Contracts',
    primaryKeywords: [
      'WOSB government contracts',
      'women owned small business transportation',
      'federal transportation services',
      'government freight services',
    ],
    secondaryKeywords: [
      'SBA certified transportation',
      'federal agency logistics',
      'sources sought responses',
      'small business set aside contracts',
    ],
    contentPillars: [
      'WOSB Certification Benefits',
      'Federal Transportation Services',
      'Government Contract Types',
      'SAM.gov Integration',
    ],
    targetAudience: [
      'Government Agencies',
      'Federal Contractors',
      'Procurement Officers',
      'Defense Contractors',
    ],
    competitiveAdvantages: [
      'WOSB certification',
      'Reduced competition on set-aside contracts',
      'Direct government relationships',
      'Streamlined procurement processes',
    ],
    callToAction: 'Request Government Consultation',
  },

  dispatch: {
    page: 'Dispatch Central',
    primaryKeywords: [
      'freight dispatch software',
      'load matching AI',
      'carrier dispatch system',
      'dispatch management',
    ],
    secondaryKeywords: [
      'load board software',
      'trucking dispatch',
      'real-time dispatch',
      'carrier optimization',
    ],
    contentPillars: [
      'AI-Powered Load Matching',
      'Real-Time Carrier Management',
      'Dispatch Workflow Optimization',
      'Performance Analytics',
    ],
    targetAudience: [
      'Dispatchers',
      'Fleet Managers',
      'Transportation Coordinators',
      'Logistics Professionals',
    ],
    competitiveAdvantages: [
      'AI-powered load matching',
      'Real-time tracking',
      'Automated workflows',
      'Performance optimization',
    ],
    callToAction: 'Try Dispatch Tools',
  },

  broker: {
    page: 'Freight Brokerage',
    primaryKeywords: [
      'freight broker software',
      'brokerage platform',
      'freight broker tools',
      'transportation brokerage',
    ],
    secondaryKeywords: [
      'broker management system',
      'freight forwarding software',
      'logistics broker platform',
      'carrier management',
    ],
    contentPillars: [
      'Complete Brokerage Operations',
      'AI-Powered Quoting Engine',
      'Carrier Network Management',
      'Compliance & Documentation',
    ],
    targetAudience: [
      'Freight Brokers',
      'Brokerage Companies',
      'Transportation Intermediaries',
      'Logistics Providers',
    ],
    competitiveAdvantages: [
      'Comprehensive brokerage tools',
      'AI-powered pricing',
      'Extensive carrier network',
      'Compliance automation',
    ],
    callToAction: 'Start Brokerage Platform',
  },

  carriers: {
    page: 'Carrier Network',
    primaryKeywords: [
      'carrier network',
      'high paying loads',
      'trucking loads',
      'carrier platform',
      'free driver app',
      'free OTR app',
    ],
    secondaryKeywords: [
      'freight carriers',
      'load board',
      'truck loads',
      'carrier services',
      'owner operator software',
      'free trucking app for drivers',
      'driver OTR flow',
      'dispatch services for carriers',
    ],
    contentPillars: [
      'FREE Driver OTR Flow App',
      'High-Paying Load Access',
      'Equipment-Specific Opportunities',
      'Owner Operator Tools',
      'Dispatch Agency Services',
    ],
    targetAudience: [
      'Owner Operators',
      'Independent Drivers',
      'Transportation Carriers',
      'Fleet Owners',
      'Dispatch Agencies',
      'Trucking Companies',
      'Equipment Owners',
    ],
    competitiveAdvantages: [
      'FREE Driver OTR Flow app',
      'Access to premium loads',
      'All equipment types supported',
      'Dispatch agency integration',
      'Owner operator focused',
    ],
    callToAction: 'Download Free Driver App',
  },

  aiFlow: {
    page: 'AI Flow Platform',
    primaryKeywords: [
      'AI transportation',
      'freight automation',
      'intelligent logistics',
      'AI TMS',
    ],
    secondaryKeywords: [
      'machine learning logistics',
      'predictive analytics',
      'automated workflow',
      'smart routing',
    ],
    contentPillars: [
      'Artificial Intelligence Integration',
      'Automated Workflow Management',
      'Predictive Analytics',
      'Machine Learning Optimization',
    ],
    targetAudience: [
      'Technology-Forward Companies',
      'Large Fleet Operators',
      'Enterprise Clients',
      'Innovation-Focused Businesses',
    ],
    competitiveAdvantages: [
      'Advanced AI technology',
      'Predictive capabilities',
      'Automated operations',
      'Continuous learning',
    ],
    callToAction: 'Explore AI Features',
  },

  university: {
    page: 'FleetFlow University',
    primaryKeywords: [
      'transportation training',
      'freight broker certification',
      'dispatch training',
      'logistics education',
    ],
    secondaryKeywords: [
      'trucking education',
      'carrier training',
      'fleet management courses',
      'transportation certification',
    ],
    contentPillars: [
      'Professional Certification Programs',
      'Industry Training Courses',
      'Skills Development',
      'Career Advancement',
    ],
    targetAudience: [
      'Transportation Professionals',
      'Career Changers',
      'Students',
      'Industry Veterans',
    ],
    competitiveAdvantages: [
      'Industry-specific training',
      'Professional certifications',
      'Expert instructors',
      'Practical application',
    ],
    callToAction: 'Enroll in Courses',
  },

  // NEW: Go With The Flow
  goWithFlow: {
    page: 'Go With The Flow',
    primaryKeywords: [
      'go with the flow automation',
      'automated freight management',
      'transportation automation platform',
      'logistics workflow automation',
    ],
    secondaryKeywords: [
      'freight flow automation',
      'automated dispatch system',
      'smart logistics workflows',
      'transportation process automation',
    ],
    contentPillars: [
      'Complete Workflow Automation',
      'Smart Process Optimization',
      'Seamless Integration',
      'Intelligent Decision Making',
    ],
    targetAudience: [
      'Busy Fleet Managers',
      'Growing Freight Companies',
      'Efficiency-Focused Operators',
      'Technology Adopters',
    ],
    competitiveAdvantages: [
      'End-to-end automation',
      'Reduces manual work by 80%',
      'AI-powered workflows',
      'Seamless integration',
    ],
    callToAction: 'Start Automation Today',
  },

  // NEW: Virtual Warehousing
  virtualWarehousing: {
    page: 'Virtual Warehousing',
    primaryKeywords: [
      'virtual warehousing',
      'virtual warehouse management',
      'cloud warehouse system',
      'digital warehouse solutions',
    ],
    secondaryKeywords: [
      'virtual inventory management',
      'online warehouse platform',
      'cloud-based warehousing',
      'digital inventory system',
    ],
    contentPillars: [
      'Cloud-Based Inventory Management',
      'Multi-Location Visibility',
      'Virtual Fulfillment Centers',
      'Digital Warehouse Operations',
    ],
    targetAudience: [
      'E-commerce Companies',
      'Multi-Location Businesses',
      'Third-Party Logistics',
      'Distributors',
    ],
    competitiveAdvantages: [
      'No physical infrastructure needed',
      'Real-time inventory tracking',
      'Multi-location management',
      'Cost-effective scaling',
    ],
    callToAction: 'Try Virtual Warehousing',
  },

  // NEW: Freight Quoting Engine
  freightQuoting: {
    page: 'Freight Quoting Engine',
    primaryKeywords: [
      'freight quoting engine',
      'freight rate calculator',
      'shipping rate quotes',
      'freight pricing software',
    ],
    secondaryKeywords: [
      'transportation quoting system',
      'freight cost calculator',
      'shipping quote generator',
      'freight rate comparison',
    ],
    contentPillars: [
      'Instant Rate Calculations',
      'AI-Powered Pricing',
      'Multi-Carrier Comparison',
      'Automated Quote Generation',
    ],
    targetAudience: [
      'Freight Brokers',
      'Sales Teams',
      'Logistics Coordinators',
      'Shippers',
    ],
    competitiveAdvantages: [
      'Instant accurate quotes',
      'AI-optimized pricing',
      'Multi-carrier rates',
      'Competitive pricing analysis',
    ],
    callToAction: 'Get Instant Quotes',
  },

  // NEW: Load Board Integration
  loadBoard: {
    page: 'Load Board Integration',
    primaryKeywords: [
      'load board integration',
      'freight load board',
      'load matching software',
      'freight marketplace platform',
    ],
    secondaryKeywords: [
      'load board connectivity',
      'automated load posting',
      'freight marketplace access',
      'load board management',
    ],
    contentPillars: [
      'Multi-Board Integration',
      'Automated Load Posting',
      'Smart Load Matching',
      'Marketplace Connectivity',
    ],
    targetAudience: [
      'Freight Brokers',
      'Carriers',
      'Load Planners',
      'Dispatchers',
    ],
    competitiveAdvantages: [
      'Connect to all major boards',
      'Automated posting',
      'Smart matching algorithms',
      'Real-time availability',
    ],
    callToAction: 'Connect Load Boards',
  },

  // NEW: Mobile TMS & Driver OTR Flow
  mobileTMS: {
    page: 'Mobile TMS & Driver OTR Flow',
    primaryKeywords: [
      'mobile TMS app',
      'trucking mobile app',
      'freight mobile platform',
      'free driver OTR flow',
      'free driver app',
    ],
    secondaryKeywords: [
      'driver mobile app',
      'mobile freight management',
      'trucking app for drivers',
      'mobile dispatch tools',
      'free trucking app for drivers',
      'owner operator app',
    ],
    contentPillars: [
      'FREE Driver OTR Flow',
      'Mobile-First Design',
      'Driver Communication',
      'Real-Time Updates',
      'Offline Capability',
    ],
    targetAudience: [
      'Owner Operators',
      'Independent Drivers',
      'Carriers',
      'Mobile Dispatchers',
      'Field Operations',
    ],
    competitiveAdvantages: [
      'FREE for carriers/owner operators',
      'Works offline',
      'Driver-friendly interface',
      'Real-time communication',
      'GPS integration',
    ],
    callToAction: 'Download Free Driver App',
  },

  // NEW: Dispatch Agencies
  dispatchAgencies: {
    page: 'Dispatch Agencies',
    primaryKeywords: [
      'dispatch agency software',
      'dispatch service providers',
      'trucking dispatch companies',
      'freight dispatch agencies',
    ],
    secondaryKeywords: [
      'dispatch agency management',
      'dispatch service platform',
      'third party dispatch',
      'dispatch company software',
      'independent dispatch services',
    ],
    contentPillars: [
      'Dispatch Agency Management',
      'Client Relationship Management',
      'Multi-Client Operations',
      'Billing & Invoicing Integration',
    ],
    targetAudience: [
      'Dispatch Agencies',
      'Independent Dispatchers',
      'Dispatch Service Providers',
      'Third-Party Dispatch Companies',
    ],
    competitiveAdvantages: [
      'Multi-client management',
      'Agency-specific features',
      'Scalable operations',
      'Integrated billing',
    ],
    callToAction: 'Start Dispatch Agency Trial',
  },

  // NEW: Owner Operators
  ownerOperators: {
    page: 'Owner Operators',
    primaryKeywords: [
      'owner operator software',
      'owner operator management',
      'single truck operator',
      'independent truck driver',
      'free owner operator app',
    ],
    secondaryKeywords: [
      'owner operator dispatch',
      'owner operator load board',
      'owner operator business tools',
      'owner operator accounting',
      'owner operator compliance',
    ],
    contentPillars: [
      'FREE Driver OTR Flow App',
      'Business Management Tools',
      'Load Matching & Dispatch',
      'Compliance Management',
      'Financial Tracking',
    ],
    targetAudience: [
      'Owner Operators',
      'Independent Drivers',
      'Single Truck Owners',
      'Small Fleet Owners',
    ],
    competitiveAdvantages: [
      'FREE core app for drivers',
      'Owner operator focused',
      'Simple business management',
      'Direct load access',
    ],
    callToAction: 'Get Free Owner Operator App',
  },
};

// SEO Content Guidelines
export const seoGuidelines = {
  titleLength: { min: 30, max: 60 },
  descriptionLength: { min: 120, max: 160 },
  keywordDensity: { min: 0.5, max: 2.5 }, // percentage
  headingStructure: {
    h1: 1, // exactly one H1 per page
    h2: '2-6', // 2-6 H2s per page
    h3: 'unlimited',
  },
  contentLength: {
    homepage: { min: 800, recommended: 1200 },
    service: { min: 600, recommended: 1000 },
    product: { min: 500, recommended: 800 },
    blog: { min: 1000, recommended: 2000 },
  },
  imageOptimization: {
    altText: 'required',
    fileSize: '< 500KB',
    formats: ['webp', 'avif', 'jpg'],
    responsive: true,
  },
};

// Content calendar for SEO blog posts
export const contentCalendar = [
  {
    month: 'January',
    topics: [
      'Transportation Industry Trends 2025',
      'WOSB Certification Benefits for Transportation Companies',
      'AI in Logistics: Future Predictions',
    ],
  },
  {
    month: 'February',
    topics: [
      'Government Contracting for Transportation Companies',
      'Optimizing Freight Brokerage Operations',
      'Carrier Network Management Best Practices',
    ],
  },
  {
    month: 'March',
    topics: [
      'Women in Transportation: Breaking Barriers',
      'TMS Implementation Guide',
      'Route Optimization Strategies',
    ],
  },
  {
    month: 'April',
    topics: [
      'Fleet Management Technology Advances',
      'Supply Chain Visibility Solutions',
      'Freight Rate Optimization Techniques',
    ],
  },
];

// Local SEO strategy for WOSB certification
export const localSEOStrategy = {
  businessName: 'FleetFlow LLC',
  businessType: 'Women Owned Small Business (WOSB)',
  serviceAreas: ['United States', 'Canada', 'Mexico'],
  localKeywords: [
    'women owned transportation company near me',
    'WOSB logistics services',
    'diverse supplier transportation',
    'minority owned freight brokerage',
  ],
  citations: [
    'Google My Business',
    'Bing Places',
    'Apple Maps',
    'SAM.gov',
    'WOSB Central',
    'SBA Directory',
  ],
  reviews: {
    platforms: ['Google', 'Trustpilot', 'Better Business Bureau'],
    targetRating: 4.8,
    responseStrategy: 'within 24 hours',
  },
};
