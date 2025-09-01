'use client';

interface PlatformFeature {
  id: string;
  name: string;
  category: 'core' | 'ai' | 'integration' | 'analytics' | 'mobile' | 'security';
  description: string;
  benefits: string[];
  technicalDetails: string;
  status: 'live' | 'beta' | 'planned' | 'research';
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  dependencies: string[];
}

export const PLATFORM_FEATURES: PlatformFeature[] = [
  // CORE FEATURES
  {
    id: 'go_with_the_flow',
    name: 'GO WITH THE FLOW - Instant Carrier Matching',
    category: 'core',
    description:
      'Revolutionary instant matching system that connects shippers with available carriers in real-time, eliminating traditional brokerage delays.',
    benefits: [
      'Reduce booking time from hours to minutes',
      '99%+ carrier availability visibility',
      'Automated load-to-carrier matching',
      'Real-time capacity updates',
      '24/7 instant booking capability',
    ],
    technicalDetails:
      'Advanced AI algorithms with real-time database queries, machine learning capacity prediction, and automated notification systems.',
    status: 'live',
    priority: 'critical',
    timeline: 'Available at launch',
    dependencies: ['Carrier database', 'Real-time APIs', 'AI matching engine'],
  },
  {
    id: 'marketplace_bidding',
    name: 'MARKETPLACE BIDDING - Competitive Auction System',
    category: 'core',
    description:
      'Transparent competitive bidding platform where multiple qualified carriers bid simultaneously for loads.',
    benefits: [
      '15-25% cost savings through competition',
      'Transparent pricing visibility',
      'Quality carrier selection',
      'Real-time bidding updates',
      'Best rate guarantee',
    ],
    technicalDetails:
      'Real-time auction engine with automated bidding algorithms, carrier qualification system, and smart pricing optimization.',
    status: 'live',
    priority: 'critical',
    timeline: 'Available at launch',
    dependencies: [
      'Carrier network',
      'Real-time bidding engine',
      'Pricing algorithms',
    ],
  },

  // AI FEATURES
  {
    id: 'predictive_capacity',
    name: 'Predictive Capacity Forecasting',
    category: 'ai',
    description:
      'AI-powered system that predicts carrier availability and capacity 48-72 hours in advance.',
    benefits: [
      'Proactive capacity planning',
      'Reduced booking failures',
      'Optimized carrier utilization',
      'Predictive pricing adjustments',
      'Emergency capacity alerts',
    ],
    technicalDetails:
      'Machine learning models analyzing historical data, weather patterns, economic indicators, and carrier behavior patterns.',
    status: 'beta',
    priority: 'high',
    timeline: 'Month 2',
    dependencies: ['Historical data', 'Weather APIs', 'ML infrastructure'],
  },
  {
    id: 'intelligent_route_optimization',
    name: 'Intelligent Route Optimization',
    category: 'ai',
    description:
      'Advanced AI algorithms that optimize routes considering multiple factors including cost, time, and environmental impact.',
    benefits: [
      '20-30% cost reduction through optimal routing',
      'Reduced transit times',
      'Lower carbon footprint',
      'Improved delivery reliability',
      'Dynamic rerouting for disruptions',
    ],
    technicalDetails:
      'Multi-objective optimization algorithms using genetic algorithms, constraint programming, and real-time traffic data.',
    status: 'planned',
    priority: 'high',
    timeline: 'Month 3',
    dependencies: ['Traffic APIs', 'Weather data', 'Carbon calculation engine'],
  },
  {
    id: 'smart_lead_scoring',
    name: 'Smart Lead Scoring & Qualification',
    category: 'ai',
    description:
      'AI-powered lead scoring system that identifies and prioritizes the most promising prospects.',
    benefits: [
      '50% increase in conversion rates',
      'Prioritized sales efforts',
      'Reduced sales cycle time',
      'Better resource allocation',
      'Predictive conversion likelihood',
    ],
    technicalDetails:
      'Machine learning classification models trained on historical conversion data, firmographic data, and behavioral patterns.',
    status: 'beta',
    priority: 'high',
    timeline: 'Month 1',
    dependencies: [
      'CRM integration',
      'Historical data',
      'Lead enrichment APIs',
    ],
  },

  // INTEGRATION FEATURES
  {
    id: 'tms_integration',
    name: 'Major TMS System Integration',
    category: 'integration',
    description:
      'Seamless integration with major Transportation Management Systems including SAP TM, Oracle TMS, and JDA.',
    benefits: [
      'Single platform for all freight needs',
      'Eliminated data entry duplication',
      'Real-time visibility across systems',
      'Automated workflow synchronization',
      'Reduced integration costs',
    ],
    technicalDetails:
      'RESTful APIs, webhook integrations, and enterprise-grade security protocols with OAuth 2.0 and SAML authentication.',
    status: 'planned',
    priority: 'high',
    timeline: 'Month 2',
    dependencies: [
      'API development',
      'Security certifications',
      'Partner agreements',
    ],
  },
  {
    id: 'erp_integration',
    name: 'ERP System Connectivity',
    category: 'integration',
    description:
      'Direct integration with enterprise ERP systems for automated order-to-shipment workflows.',
    benefits: [
      'Eliminated manual order processing',
      'Real-time inventory visibility',
      'Automated shipment creation',
      'Reduced order-to-delivery time',
      'Improved order accuracy',
    ],
    technicalDetails:
      'Pre-built connectors for SAP, Oracle, Microsoft Dynamics, and custom API development for proprietary systems.',
    status: 'planned',
    priority: 'medium',
    timeline: 'Month 3',
    dependencies: ['ERP APIs', 'Data mapping tools', 'Testing environments'],
  },
  {
    id: 'carrier_portal',
    name: 'Advanced Carrier Portal',
    category: 'integration',
    description:
      'Comprehensive portal for carriers with real-time load boards, automated bidding, and performance analytics.',
    benefits: [
      'Increased carrier engagement',
      'Faster load acceptance',
      'Better carrier retention',
      'Real-time communication',
      'Automated documentation',
    ],
    technicalDetails:
      'React-based portal with real-time WebSocket connections, mobile-responsive design, and integrated document management.',
    status: 'beta',
    priority: 'high',
    timeline: 'Month 1',
    dependencies: [
      'Frontend framework',
      'Real-time infrastructure',
      'Mobile optimization',
    ],
  },

  // ANALYTICS FEATURES
  {
    id: 'advanced_analytics',
    name: 'Advanced Analytics Dashboard',
    category: 'analytics',
    description:
      'Comprehensive analytics platform providing insights into freight patterns, carrier performance, and market trends.',
    benefits: [
      'Data-driven decision making',
      'Predictive market insights',
      'Carrier performance optimization',
      'Cost trend analysis',
      'Strategic planning support',
    ],
    technicalDetails:
      'Real-time data processing with Apache Kafka, analytics with Tableau/PowerBI integration, and custom reporting APIs.',
    status: 'planned',
    priority: 'medium',
    timeline: 'Month 2',
    dependencies: [
      'Data warehouse',
      'Analytics tools',
      'Visualization platform',
    ],
  },
  {
    id: 'predictive_pricing',
    name: 'Predictive Pricing Engine',
    category: 'analytics',
    description:
      'AI-powered pricing optimization that predicts optimal rates based on market conditions and carrier capacity.',
    benefits: [
      'Maximized profit margins',
      'Competitive pricing strategy',
      'Dynamic rate adjustments',
      'Market trend analysis',
      'Revenue optimization',
    ],
    technicalDetails:
      'Machine learning regression models with time-series analysis, market data integration, and real-time pricing adjustments.',
    status: 'planned',
    priority: 'high',
    timeline: 'Month 3',
    dependencies: [
      'Market data APIs',
      'ML pricing models',
      'Real-time data streams',
    ],
  },

  // MOBILE FEATURES
  {
    id: 'mobile_app',
    name: 'Comprehensive Mobile App',
    category: 'mobile',
    description:
      'Full-featured mobile application for shippers and carriers with real-time tracking and instant booking.',
    benefits: [
      'Mobile-first user experience',
      'Real-time shipment updates',
      'Instant booking capability',
      'Emergency contact features',
      'Offline functionality',
    ],
    technicalDetails:
      'React Native cross-platform app with offline synchronization, push notifications, and biometric authentication.',
    status: 'beta',
    priority: 'high',
    timeline: 'Month 1',
    dependencies: [
      'Mobile development team',
      'App store approvals',
      'Device testing',
    ],
  },
  {
    id: 'driver_app',
    name: 'Carrier Driver App',
    category: 'mobile',
    description:
      'Dedicated mobile app for carrier drivers with GPS tracking, load updates, and digital documentation.',
    benefits: [
      'Improved driver communication',
      'Real-time load updates',
      'Digital proof of delivery',
      'GPS tracking and ETAs',
      'Automated documentation',
    ],
    technicalDetails:
      'Native iOS/Android apps with GPS integration, camera functionality, and offline document storage.',
    status: 'planned',
    priority: 'medium',
    timeline: 'Month 2',
    dependencies: ['Mobile SDKs', 'GPS APIs', 'Document scanning'],
  },

  // SECURITY FEATURES
  {
    id: 'enterprise_security',
    name: 'Enterprise-Grade Security',
    category: 'security',
    description:
      'Military-grade security with end-to-end encryption, SOC 2 compliance, and advanced threat protection.',
    benefits: [
      'Enterprise customer confidence',
      'Regulatory compliance',
      'Data protection guarantee',
      'Secure carrier communications',
      'Audit trail capabilities',
    ],
    technicalDetails:
      'AES-256 encryption, multi-factor authentication, regular security audits, and compliance with GDPR, HIPAA, and SOC 2.',
    status: 'live',
    priority: 'critical',
    timeline: 'Available at launch',
    dependencies: [
      'Security infrastructure',
      'Compliance certifications',
      'Audit processes',
    ],
  },
  {
    id: 'blockchain_contracts',
    name: 'Blockchain-Based Contracts',
    category: 'security',
    description:
      'Secure, immutable contract management using blockchain technology for all freight agreements.',
    benefits: [
      'Tamper-proof contracts',
      'Automated contract execution',
      'Transparent audit trails',
      'Reduced dispute resolution time',
      'Smart contract automation',
    ],
    technicalDetails:
      'Private blockchain network with smart contracts, digital signatures, and automated execution based on predefined conditions.',
    status: 'research',
    priority: 'low',
    timeline: 'Q3 2025',
    dependencies: [
      'Blockchain infrastructure',
      'Legal framework',
      'Smart contract development',
    ],
  },
];

export const FEATURE_CATEGORIES = {
  core: 'Core Platform Features',
  ai: 'Artificial Intelligence',
  integration: 'System Integration',
  analytics: 'Analytics & Insights',
  mobile: 'Mobile Solutions',
  security: 'Security & Compliance',
};

export const FEATURE_PRIORITIES = {
  critical: {
    label: 'Critical',
    color: 'red',
    description: 'Must-have for launch',
  },
  high: {
    label: 'High',
    color: 'orange',
    description: 'Launch within 3 months',
  },
  medium: {
    label: 'Medium',
    color: 'blue',
    description: 'Launch within 6 months',
  },
  low: { label: 'Low', color: 'gray', description: 'Future enhancement' },
};

export const FEATURE_STATUS = {
  live: { label: 'Live', color: 'green', description: 'Available now' },
  beta: { label: 'Beta', color: 'yellow', description: 'Testing phase' },
  planned: { label: 'Planned', color: 'blue', description: 'In development' },
  research: {
    label: 'Research',
    color: 'gray',
    description: 'Exploring feasibility',
  },
};

export const DEPENDENCY_MATRIX = {
  'Carrier database': [
    'go_with_the_flow',
    'marketplace_bidding',
    'predictive_capacity',
  ],
  'Real-time APIs': ['go_with_the_flow', 'mobile_app', 'advanced_analytics'],
  'AI matching engine': ['go_with_the_flow', 'intelligent_route_optimization'],
  'ML infrastructure': [
    'predictive_capacity',
    'smart_lead_scoring',
    'predictive_pricing',
  ],
  'CRM integration': ['smart_lead_scoring', 'advanced_analytics'],
  'Security infrastructure': ['enterprise_security', 'blockchain_contracts'],
};
