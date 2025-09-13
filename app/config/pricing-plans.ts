// FleetFlow Pricing Plans Configuration
// Moved from StripeService to separate config file

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  category: 'TMS' | 'CONSORTIUM' | 'COMPLIANCE' | 'ADDON';
  priceType?: 'fixed' | 'starts_at' | 'custom';
  maxPrice?: number;
  priceDescription?: string;
}

export const FLEETFLOW_PRICING_PLANS: Record<string, SubscriptionPlan> = {
  // ========================================
  // PROFESSIONAL SUBSCRIPTION TIERS
  // ========================================

  // FleetFlow University℠
  FLEETFLOW_UNIVERSITY: {
    id: 'fleetflow_university',
    name: 'FleetFlow University℠',
    price: 49,
    interval: 'month',
    category: 'TMS',
    features: [
      'Complete training curriculum',
      'BOL/MBL/HBL Documentation Mastery',
      'Warehouse Operations Excellence',
      'Enhanced Freight Brokerage training',
      'Interactive components & certification',
      'Role-specific content (dispatchers, brokers, managers)',
      'Unlimited course access',
      'Industry best practices library',
      'Compliance training modules',
      'Performance tracking & analytics',
    ],
  },

  // Professional Dispatcher (Updated pricing per corrections)
  PROFESSIONAL_DISPATCHER: {
    id: 'professional_dispatcher',
    name: 'Professional Dispatcher',
    price: 79,
    interval: 'month',
    category: 'TMS',
    features: [
      'Advanced dispatch management',
      'Real-time load tracking',
      'Driver communication tools',
      'Route optimization',
      'Performance analytics',
      'Mobile app access',
      'Compliance monitoring',
      'Emergency response protocols',
      'Load board integration',
      'Automated notifications',
      'Phone integration (50 minutes + 25 SMS)',
    ],
  },

  // RFx Professional (RFB/RFQ/RFP/RFI)
  RFX_PROFESSIONAL: {
    id: 'rfx_professional',
    name: 'RFx Professional',
    price: 119,
    interval: 'month',
    category: 'TMS',
    features: [
      'Professional Freight Quoting System',
      'RFB/RFQ/RFP/RFI management',
      'Government contracts (SAM.gov integration)',
      'Enterprise RFPs (major corporations)',
      'InstantMarkets integration (205,587+ opportunities)',
      'Warehousing & 3PL opportunities ($25-50M)',
      'AI-powered proposal generation',
      'Competitive intelligence',
      'Win/loss analytics',
      'Automated bidding workflows',
    ],
  },

  // Broker Elite
  BROKER_ELITE: {
    id: 'broker_elite',
    name: 'Broker Elite',
    price: 149,
    interval: 'month',
    category: 'TMS',
    features: [
      'Complete freight brokerage platform',
      'Advanced carrier network',
      'Smart load matching',
      'Margin optimization tools',
      'Credit management system',
      'Factoring integration',
      'Multi-modal shipping',
      'Customer portal access',
      'Advanced reporting & analytics',
      'API access for integrations',
    ],
  },

  // AI Flow Professional
  AI_FLOW_PROFESSIONAL: {
    id: 'ai_flow_professional',
    name: 'AI Flow Professional',
    price: 199,
    interval: 'month',
    category: 'TMS',
    features: [
      'AI-Powered Call Center Platform (FreeSWITCH)',
      'Claude AI negotiation capabilities (85-90% success rates)',
      'Smart Auto-Bidding Rules engine',
      'AI freight broker with dynamic pricing',
      'AI dispatcher with load coordination',
      'AI recruiting with lead management',
      'Predictive analytics & forecasting',
      'Real-time decision automation',
      'Advanced machine learning models',
      'Custom AI workflow builder',
    ],
  },

  // Enterprise Professional
  ENTERPRISE_PROFESSIONAL: {
    id: 'enterprise_professional',
    name: 'Enterprise Professional',
    price: 299,
    interval: 'month',
    category: 'TMS',
    priceType: 'starts_at',
    maxPrice: 999,
    priceDescription: 'Pricing scales based on team size and feature usage',
    features: [
      'Complete enterprise platform access',
      'Unlimited users & drivers',
      'White-label capabilities',
      'Multi-tenant architecture',
      'Advanced API access (all endpoints)',
      'Custom integrations & workflows',
      'Dedicated account manager',
      'Priority support (24/7)',
      'Custom training & onboarding',
      'Enterprise SLA guarantees',
    ],
  },

  // ========================================
  // À LA CARTE SYSTEM
  // ========================================

  // Base Platform
  BASE_PLATFORM: {
    id: 'base_platform',
    name: 'Base Platform',
    price: 29,
    interval: 'month',
    category: 'TMS',
    features: [
      'Core TMS functionality',
      'Basic driver management',
      'Load tracking',
      'DOT compliance basics',
      'Mobile app access',
      'Email support',
      'Standard reporting',
      'Up to 5 users',
      'Basic API access',
      'Community support',
    ],
  },

  // À La Carte Add-ons
  ADDON_ADVANCED_ANALYTICS: {
    id: 'addon_advanced_analytics',
    name: 'Advanced Analytics Module',
    price: 39,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Comprehensive performance dashboards',
      'Predictive analytics',
      'Custom report builder',
      'ROI calculations',
      'Benchmarking tools',
    ],
  },

  ADDON_AI_AUTOMATION: {
    id: 'addon_ai_automation',
    name: 'AI Automation Module',
    price: 59,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Smart load matching',
      'Automated dispatch',
      'AI-powered routing',
      'Predictive maintenance',
      'Intelligent notifications',
    ],
  },

  ADDON_COMPLIANCE_PRO: {
    id: 'addon_compliance_pro',
    name: 'Compliance Pro Module',
    price: 49,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Advanced DOT compliance',
      'FMCSA integration',
      'Automated form generation',
      'Audit preparation',
      'Violation management',
    ],
  },

  ADDON_FINANCIAL_SUITE: {
    id: 'addon_financial_suite',
    name: 'Financial Suite Module',
    price: 69,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Advanced accounting',
      'Bill.com integration',
      'Invoice automation',
      'Financial reporting',
      'Cash flow management',
    ],
  },

  ADDON_WAREHOUSE_3PL: {
    id: 'addon_warehouse_3pl',
    name: 'Warehouse & 3PL Module',
    price: 89,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Warehouse management system',
      '3PL operations',
      'Inventory tracking',
      'Cross-docking',
      'Distribution management',
    ],
  },

  // ========================================
  // DATA CONSORTIUM PLANS
  // ========================================

  CONSORTIUM_BASIC: {
    id: 'consortium_basic',
    name: 'Data Consortium Basic',
    price: 99,
    interval: 'month',
    category: 'CONSORTIUM',
    features: [
      'Industry benchmarking (2,847+ companies)',
      'Anonymous intelligence sharing',
      'Basic performance metrics',
      'Monthly market reports',
      'Fuel price trends',
      'Email insights',
    ],
  },

  CONSORTIUM_PROFESSIONAL: {
    id: 'consortium_professional',
    name: 'Data Consortium Professional',
    price: 299,
    interval: 'month',
    category: 'CONSORTIUM',
    features: [
      'Real-time market intelligence',
      'Financial Markets Intelligence Platform',
      'Real-time diesel pricing & fuel futures',
      'AI hedging recommendations',
      'Predictive analytics',
      'Custom dashboards',
      'API access',
      'Weekly insights',
      'Competitive positioning data',
    ],
  },

  CONSORTIUM_ENTERPRISE: {
    id: 'consortium_enterprise',
    name: 'Data Consortium Enterprise',
    price: 899,
    interval: 'month',
    category: 'CONSORTIUM',
    priceType: 'starts_at',
    maxPrice: 2999,
    priceDescription:
      'Pricing scales with data volume and API usage requirements',
    features: [
      'Full API access (all data streams)',
      'Custom analytics & modeling',
      'Priority data access',
      'Dedicated insights team',
      'Real-time alerts & notifications',
      'Custom integrations',
      'Strategic consulting services',
      'Exclusive market research',
      'Direct analyst access',
    ],
  },

  // ========================================
  // STRATEGIC ENTERPRISE TIERS
  // ========================================

  STRATEGIC_GROWTH: {
    id: 'strategic_growth',
    name: 'Strategic Growth',
    price: 2499,
    interval: 'month',
    category: 'TMS',
    priceType: 'starts_at',
    maxPrice: 9999,
    priceDescription:
      'Enterprise pricing varies by implementation scope and strategic requirements',
    features: [
      'Complete platform suite',
      'Fortune 500 partnership access',
      'Government contract opportunities ($500K-$5M)',
      'Quantum-inspired route optimization',
      'Enterprise partnership platform',
      'Strategic acquisition preparation',
      'Dedicated success team',
      'Custom development resources',
      'White-glove onboarding',
      'Strategic consulting included',
    ],
  },

  STRATEGIC_ENTERPRISE: {
    id: 'strategic_enterprise',
    name: 'Strategic Enterprise',
    price: 4999,
    interval: 'month',
    category: 'TMS',
    priceType: 'custom',
    priceDescription:
      'Custom enterprise pricing - Contact for personalized quote',
    features: [
      'Full enterprise ecosystem access',
      'Multi-billion dollar contract access',
      'Strategic acquisition positioning',
      'Custom platform development',
      'Dedicated development team',
      'C-suite strategic consulting',
      'Merger & acquisition support',
      'IPO preparation services',
      'Board-ready analytics',
      'Strategic exit planning',
    ],
  },

  // ========================================
  // COMPLIANCE PLANS
  // ========================================

  COMPLIANCE_BASIC: {
    id: 'compliance_basic',
    name: 'DOT Compliance Basic',
    price: 149,
    interval: 'month',
    category: 'COMPLIANCE',
    features: [
      'FMCSA form management',
      'Deadline tracking',
      'Basic reporting',
      'Email reminders',
      'Driver qualification files',
      'Vehicle inspection records',
    ],
  },

  COMPLIANCE_FULL: {
    id: 'compliance_full',
    name: 'DOT Compliance Full',
    price: 349,
    interval: 'month',
    category: 'COMPLIANCE',
    features: [
      'Complete DOT compliance platform',
      'FMCSA integration',
      'Full automation',
      'Audit preparation',
      'Violation management',
      'Advanced reporting',
      'Phone support',
      'Compliance consulting',
    ],
  },

  COMPLIANCE_MANAGED: {
    id: 'compliance_managed',
    name: 'DOT Compliance Managed',
    price: 799,
    interval: 'month',
    category: 'COMPLIANCE',
    priceType: 'starts_at',
    maxPrice: 1999,
    priceDescription:
      'Pricing varies based on fleet size and compliance complexity',
    features: [
      'Dedicated compliance officer',
      'Full service management',
      'Guaranteed compliance',
      'Audit representation',
      'Priority support',
      'Legal consultation',
      'Risk assessment',
      'Compliance strategy development',
    ],
  },
};

export default FLEETFLOW_PRICING_PLANS;
