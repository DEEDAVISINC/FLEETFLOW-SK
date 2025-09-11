// FleetFlow Subscription Plans Configuration - Updated to match /plans page
// These plans work with Square payment processing

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  category: 'TMS' | 'Training' | 'Add-on' | 'AI' | 'Phone';
  features: string[];
  permissionLevel: 'basic' | 'professional' | 'enterprise' | 'university';
  accessiblePages?: string[];
  restrictedFeatures?: string[];
  maxUsers?: number;
  maxDataStorage?: number; // in GB
  apiCallLimit?: number; // per month
  popular?: boolean;
  // Square integration fields
  squareItemId?: string; // Square catalog item ID
  squareVariationId?: string; // Square item variation ID
}

// ========================================
// MAIN SUBSCRIPTION TIERS (matching /plans page)
// ========================================

export const FLEETFLOW_PRICING_PLANS: Record<string, SubscriptionPlan> = {
  // FleetFlow University℠ - matches /plans
  FLEETFLOW_UNIVERSITY: {
    id: 'university',
    name: 'FleetFlow University℠',
    price: 49,
    interval: 'month',
    category: 'Training',
    permissionLevel: 'university',
    squareItemId: 'HJ2V7KBJMWPRY65CXZQ3HIXH',
    squareVariationId: 'NQRR4RL4ZNQOJZRWYTC3GWH3',
    features: [
      'Complete training curriculum',
      'BOL/MBL/HBL documentation',
      'Warehouse operations training',
      'Certification programs',
      'Industry best practices',
      'Progress tracking',
      'Instructor access',
      'Training materials library',
      '📞 Phone add-on available (+$39-$199)',
    ],
    accessiblePages: ['/university', '/training', '/compliance', '/dashboard'],
    maxUsers: 50,
    maxDataStorage: 5,
    apiCallLimit: 10000,
  },

  // Professional Dispatcher - matches /plans (was $99, now $79 with phone included)
  PROFESSIONAL_DISPATCHER: {
    id: 'dispatcher',
    name: 'Professional Dispatcher',
    price: 79,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: 'KEUXM5DOLJOQOHT6HUNHOO4R',
    squareVariationId: 'GBXTVWYFEVGSA5ZCHTAHGNW4',
    features: [
      'Complete dispatch management',
      'Driver assignment & tracking',
      'Route optimization',
      'CRM integration',
      'Basic AI automation',
      'Load management',
      'Real-time notifications',
      'Mobile app access',
      '📞 50 phone minutes included',
      '📱 25 SMS messages included',
      '📞 Phone upgrades available (+$39-$199)',
    ],
    accessiblePages: [
      '/dispatch-central',
      '/driver-management',
      '/fleet-flow',
      '/dashboard',
      '/compliance',
    ],
    restrictedFeatures: ['analytics', 'financials'],
    maxUsers: 10,
    maxDataStorage: 25,
    apiCallLimit: 50000,
  },

  // Solo Dispatcher Premium - Advanced dispatch operations
  SOLO_DISPATCHER_PREMIUM: {
    id: 'solo_dispatcher_premium',
    name: 'Solo Dispatcher Premium',
    price: 199,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Advanced dispatch management system',
      'Multi-fleet coordination capabilities',
      'Advanced route optimization engine',
      'Performance analytics & detailed reporting',
      'API access & third-party integrations',
      'Priority customer support',
      'Custom workflow automation',
      'Advanced driver management tools',
      'Real-time fleet monitoring dashboard',
      'Fleet performance optimization',
      '📞 Unlimited phone minutes included',
      '📱 Unlimited SMS messages included',
      '📞 CRM phone integration included',
      '📊 Advanced call monitoring included',
    ],
    accessiblePages: [
      '/dispatch-central',
      '/driver-management',
      '/fleet-flow',
      '/dashboard',
      '/analytics',
    ],
    maxUsers: 5,
    maxDataStorage: 50,
    apiCallLimit: 100000,
  },

  // Solo Broker Premium - Advanced brokerage operations
  SOLO_BROKER_PREMIUM: {
    id: 'solo_broker_premium',
    name: 'Solo Broker Premium',
    price: 599,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Complete platform access',
      'FreightFlow RFx platform',
      'Advanced brokerage operations',
      'Load board management premium',
      'Enhanced carrier relationships',
      'Revenue analytics dashboard',
      'Advanced analytics & reporting',
      'API access & webhooks',
      'Priority support',
      'Custom integrations',
      'Multi-customer management',
      '📞 Unlimited phone minutes',
      '📱 Unlimited SMS messages',
      '📊 Advanced call monitoring',
      '🤖 AI automation tools',
    ],
    accessiblePages: [
      '/broker-box',
      '/rfx-center',
      '/dashboard',
      '/analytics',
      '/accounting',
    ],
    maxUsers: 25,
    maxDataStorage: 500,
    apiCallLimit: 500000,
  },

  // Professional Brokerage - matches /plans (popular plan)
  PROFESSIONAL_BROKERAGE: {
    id: 'brokerage',
    name: 'Professional Brokerage',
    price: 289,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    popular: true,
    squareItemId: '3BLAX6KFLHYWN4B2CWEBPJH6',
    squareVariationId: '7AWS4LG44ST45AQFDNLAM774',
    features: [
      'Advanced brokerage operations',
      'Load board management',
      'Load & customer management',
      'Revenue analytics dashboard',
      'AI-powered optimization',
      'Performance tracking',
      'Priority support',
      'Mobile app access',
      '📞 500 phone minutes included',
      '📱 200 SMS messages included',
      '📊 Advanced call monitoring included',
      '📞 CRM phone integration included',
    ],
    accessiblePages: [
      '/broker-box',
      '/rfx-center',
      '/dashboard',
      '/analytics',
      '/accounting',
    ],
    maxUsers: 25,
    maxDataStorage: 100,
    apiCallLimit: 100000,
  },

  // Enterprise Professional - matches /plans (AI Flow Professional level)
  ENTERPRISE_PROFESSIONAL: {
    id: 'enterprise',
    name: 'Enterprise Professional',
    price: 2698,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'enterprise',
    squareItemId: 'ETKIBFXNQOLG7Q35THL6LCQY',
    squareVariationId: 'VR4WJQARWTFS2DKYS5L2JGNZ',
    features: [
      'Complete platform access',
      'FreightFlow RFx platform',
      'All premium features',
      '🤖 AI Flow Professional included (unlimited usage)',
      '🤖 Unlimited AI workflows & operations',
      '🤖 AI Review System with validations',
      '🤖 Advanced analytics & reporting',
      '🤖 Machine learning insights',
      '🤖 API access & webhooks',
      'Priority support & training',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options',
      '📞 Unlimited phone minutes',
      '📱 Unlimited SMS messages',
      '📊 Enterprise call center features',
      '🏢 Multi-tenant phone management',
    ],
    accessiblePages: [
      '/ai-flow',
      '/ai-hub',
      '/dashboard',
      '/analytics',
      '/broker-box',
      '/dispatch-central',
      '/rfx-center',
      '/settings',
    ],
    maxUsers: 500,
    maxDataStorage: 1000,
    apiCallLimit: 1000000,
  },

  // ========================================
  // NOTE: AI Flow is available as ADD-ON MODULES ONLY
  // See ADDON_MODULES section below for AI Flow pricing
  // ========================================

  // ========================================
  // BASE PLATFORM (for à la carte)
  // ========================================

  // Base Platform - matches à la carte section
  BASE_PLATFORM: {
    id: 'base_platform',
    name: 'Base Platform',
    price: 59, // Updated to match /plans page ($59/month)
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'basic',
    features: [
      'Core platform access',
      'Basic dashboard',
      'User management',
      'Document storage',
      'Basic reporting',
    ],
    accessiblePages: ['/dashboard'],
    restrictedFeatures: [
      'analytics',
      'financials',
      'broker-box',
      'dispatch-central',
      'ai-flow',
    ],
    maxUsers: 5,
    maxDataStorage: 5,
    apiCallLimit: 10000,
  },

  // ========================================
  // TEAM SUBSCRIPTION PLANS
  // ========================================

  // Team Brokerage Starter - Small team brokerage operations
  TEAM_BROKERAGE_STARTER: {
    id: 'team_brokerage_starter',
    name: 'Team Brokerage Starter',
    price: 199,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Core brokerage tools and platform',
      'Load management and posting capabilities',
      'Basic carrier database management',
      'Standard reporting and analytics',
      'Team collaboration features',
      'Document sharing and organization',
      'Basic CRM integration for customer management',
      'Up to 2 team members included',
      'Additional team seats: $49/month each',
      '📞 Phone add-on available (+$39-$199)',
    ],
    accessiblePages: ['/broker-box', '/dashboard', '/basic-analytics'],
    maxUsers: 2,
    maxDataStorage: 25,
    apiCallLimit: 25000,
  },

  // Team Brokerage Pro - Professional team brokerage platform
  TEAM_BROKERAGE_PRO: {
    id: 'team_brokerage_pro',
    name: 'Team Brokerage Pro',
    price: 499,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Advanced brokerage operations management',
      'Unlimited load management and posting',
      'Enhanced carrier relationship tools',
      'Advanced analytics and performance reporting',
      'Team performance tracking and KPIs',
      'API access for custom integrations',
      'Priority customer support',
      'Advanced compliance and documentation',
      'Multi-carrier relationship management',
      'Up to 5 team members included',
      'Additional team seats: $39/month each',
      '📞 500 phone minutes included',
      '📱 200 SMS messages included',
      '📞 Professional phone features included',
    ],
    accessiblePages: [
      '/broker-box',
      '/rfx-center',
      '/dashboard',
      '/analytics',
      '/accounting',
    ],
    maxUsers: 5,
    maxDataStorage: 100,
    apiCallLimit: 100000,
  },

  // Team Dispatch Starter - Essential team dispatch tools
  TEAM_DISPATCH_STARTER: {
    id: 'team_dispatch_starter',
    name: 'Team Dispatch Starter',
    price: 149,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Core dispatch management platform',
      'Driver assignment and tracking',
      'Route optimization basics',
      'Basic performance reporting',
      'CRM integration for customer management',
      'Team communication tools',
      'Document and load sharing',
      'Up to 2 team members included',
      'Additional team seats: $39/month each',
      '📞 Phone add-on available (+$39-$199)',
    ],
    accessiblePages: ['/dispatch-central', '/driver-management', '/dashboard'],
    maxUsers: 2,
    maxDataStorage: 15,
    apiCallLimit: 15000,
  },

  // Team Dispatch Pro - Complete team dispatch platform
  TEAM_DISPATCH_PRO: {
    id: 'team_dispatch_pro',
    name: 'Team Dispatch Pro',
    price: 349,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'professional',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Advanced dispatch management system',
      'Real-time driver tracking and monitoring',
      'Advanced route optimization and planning',
      'Performance analytics and detailed reporting',
      'Mobile app access for field operations',
      'API integrations for third-party tools',
      'Team performance monitoring',
      'Advanced fleet coordination',
      'Up to 5 team members included',
      'Additional team seats: $29/month each',
      '📞 500 phone minutes included',
      '📱 200 SMS messages included',
      '📞 Professional phone integration included',
    ],
    accessiblePages: [
      '/dispatch-central',
      '/driver-management',
      '/fleet-flow',
      '/dashboard',
      '/analytics',
    ],
    maxUsers: 5,
    maxDataStorage: 75,
    apiCallLimit: 75000,
  },

  // Team Enterprise - Complete enterprise platform for large teams
  TEAM_ENTERPRISE: {
    id: 'team_enterprise',
    name: 'Team Enterprise',
    price: 2698,
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'enterprise',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    features: [
      'Everything in Enterprise Professional',
      'Up to 10 team members included',
      'Advanced team management and permissions',
      'Custom team workflows and automation',
      'Enterprise-grade security and compliance',
      'Dedicated account management',
      'Custom integrations and development',
      'White-label branding options',
      '24/7 priority support',
      'On-premise deployment options',
      'Multi-location team management',
      'Advanced compliance automation',
      'Custom training and onboarding',
      'Full AI Flow Enterprise included',
      'AI Company Dashboard included',
      'DEPOINTE AI system included',
    ],
    accessiblePages: [
      '/depointe-dashboard',
      '/ai-company-dashboard',
      '/ai-flow',
      '/ai-hub',
      '/dashboard',
      '/analytics',
      '/broker-box',
      '/dispatch-central',
      '/rfx-center',
      '/settings',
    ],
    maxUsers: 10,
    maxDataStorage: 5000,
    apiCallLimit: 5000000,
  },
};

// ========================================
// PHONE SYSTEM ADD-ONS (matching /plans page)
// ========================================

export const PHONE_SYSTEM_ADDONS: Record<string, SubscriptionPlan> = {
  PHONE_BASIC: {
    id: 'phone-basic',
    name: 'FleetFlow Phone Basic',
    price: 39,
    interval: 'month',
    category: 'Phone',
    permissionLevel: 'basic',
    squareItemId: 'WLN4OBXGFYYYAIH7C7G5XWRR',
    squareVariationId: 'EV77NDVQKMIGDUY62NPNG6ZS',
    features: [
      'Company phone number',
      'Professional caller ID',
      'Basic call monitoring',
      'Voicemail & transcription',
      'Up to 5 users',
      'Mobile app integration',
    ],
    apiCallLimit: 25000,
  },

  PHONE_PROFESSIONAL: {
    id: 'phone-professional',
    name: 'FleetFlow Phone Professional',
    price: 89,
    interval: 'month',
    squareItemId: '4LW7CXEOY2BLMO34GXD4YLKA',
    squareVariationId: 'Y3EIQU7NKNJ5244YJR7QYHWC',
    category: 'Phone',
    permissionLevel: 'professional',
    popular: true,
    features: [
      'Everything in Basic',
      'CRM call integration',
      'Call recording & storage',
      'Real-time call monitoring',
      'Call handoff management',
      'Performance analytics',
      'Up to 25 users',
      'SMS capabilities',
      'Call routing & IVR',
    ],
    apiCallLimit: 75000,
  },

  PHONE_ENTERPRISE: {
    id: 'phone-enterprise',
    name: 'FleetFlow Phone Enterprise',
    price: 199,
    interval: 'month',
    category: 'Phone',
    permissionLevel: 'enterprise',
    squareItemId: 'WAMJ53VAY4M7KVBWUJU4REKS',
    squareVariationId: 'GIHCWE33EMKCB32R5VQWPJEG',
    features: [
      'Everything in Professional',
      'Unlimited users',
      'Multi-tenant management',
      'Advanced call analytics',
      'Call center features',
      'Auto-dialer & campaigns',
      'Conference calling',
      'WhiteLabel options',
      'API access',
      'Priority support',
    ],
    apiCallLimit: 200000,
  },
};

// ========================================
// À LA CARTE MODULES (matching /plans page)
// ========================================

export const ADDON_MODULES: Record<string, SubscriptionPlan> = {
  DISPATCH_MANAGEMENT: {
    id: 'dispatch_management',
    name: 'Dispatch Management',
    price: 99,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Load management', 'Driver assignment', 'Routing optimization'],
    accessiblePages: ['/dispatch-central'],
    apiCallLimit: 25000,
  },

  CRM_SUITE: {
    id: 'crm_suite',
    name: 'CRM Suite',
    price: 79,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Customer management', 'Sales pipeline', 'Contact tracking'],
    accessiblePages: ['/broker-box'],
    apiCallLimit: 20000,
  },

  RFX_DISCOVERY: {
    id: 'rfx_discovery',
    name: 'RFx Discovery',
    price: 499, // Enterprise Only as shown on /plans
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'enterprise',
    features: ['Government contracts', 'Enterprise RFPs', 'Bid tracking'],
    accessiblePages: ['/rfx-center'],
    apiCallLimit: 30000,
  },

  // ========================================
  // AI FLOW ADD-ON MODULES (require main subscription)
  // ========================================

  AI_FLOW_STARTER_ADDON: {
    id: 'ai_flow_starter_addon',
    name: 'AI Flow Starter Add-On',
    price: 59,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    squareItemId: 'OJ4TWOO3XYKR4W2C6RNP4VAK',
    squareVariationId: 'N6U27ER5XR3BTT5LXRK44QE7',
    features: [
      'Requires main FleetFlow subscription',
      'Basic AI automation (10 workflows/month)',
      '5,000 AI operations/month',
      'Pre-built workflow templates',
      'Basic AI Review System',
      'Email & SMS automation',
      'Simple lead generation',
      'Community support',
    ],
    accessiblePages: ['/ai-flow', '/ai-hub'],
    apiCallLimit: 50000,
  },

  AI_FLOW_PROFESSIONAL_ADDON: {
    id: 'ai_flow_professional_addon',
    name: 'AI Flow Professional Add-On',
    squareItemId: 'HYNKASGC2OGL32YJBC2OZO7J',
    squareVariationId: 'BJIBZUE6ADPQE3EIT7B75LR6',
    price: 129,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'professional',
    features: [
      'Requires main FleetFlow subscription',
      'Advanced AI automation (100 workflows/month)',
      '50,000 AI operations/month',
      'Custom workflow builder',
      'AI Review System with validations',
      'Role-based lead generation',
      'Machine learning insights',
      'API access & webhooks',
      'Priority support',
    ],
    accessiblePages: ['/ai-flow', '/ai-hub', '/analytics'],
    apiCallLimit: 200000,
  },

  AI_FLOW_ENTERPRISE_ADDON: {
    id: 'ai_flow_enterprise_addon',
    name: 'AI Flow Enterprise Add-On',
    price: 249,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'enterprise',
    squareItemId: '2T5V7PSX6XKUONA6NIGNK6WF',
    squareVariationId: 'EAHMIZQAAORPHGUQ35MLCIUH',
    features: [
      'Requires main FleetFlow subscription',
      'Unlimited AI workflows',
      'Unlimited AI operations',
      'Custom AI model training',
      'Advanced predictive analytics',
      'White-label AI capabilities',
      'Dedicated AI infrastructure',
      'Dedicated AI support',
      'SLA guarantees',
    ],
    accessiblePages: ['/ai-flow', '/ai-hub', '/analytics', '/settings'],
    apiCallLimit: 1000000,
  },

  AI_FLOW_USAGE_ADDON: {
    id: 'ai_flow_usage_addon',
    name: 'AI Flow Usage-Based Add-On',
    price: 0, // Base price, $0.10 per 1,000 AI operations
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'enterprise',
    features: [
      'Requires main FleetFlow subscription',
      'Pay-per-AI-operation pricing ($0.10/1,000 ops)',
      'No monthly minimums or limits',
      'All enterprise AI features',
      'Volume discounts available',
      'Enterprise SLA',
    ],
    accessiblePages: ['/ai-flow', '/ai-hub', '/analytics', '/settings'],
    apiCallLimit: 10000000,
  },

  BROKER_OPERATIONS: {
    id: 'broker_operations',
    name: 'Broker Operations',
    price: 199,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Load posting', 'Carrier management', 'Margin tracking'],
    accessiblePages: ['/broker-box'],
    apiCallLimit: 50000,
  },

  TRAINING_CERTIFICATION: {
    id: 'training_certification',
    name: 'Training & Certification',
    price: 49,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['FleetFlow University access', 'Progress tracking'],
    accessiblePages: ['/university', '/training'],
    apiCallLimit: 5000,
  },

  ADVANCED_ANALYTICS: {
    id: 'advanced_analytics',
    name: 'Analytics',
    price: 89,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Business intelligence', 'Performance metrics', 'Reporting'],
    accessiblePages: ['/analytics'],
    apiCallLimit: 15000,
  },

  REAL_TIME_TRACKING: {
    id: 'real_time_tracking',
    name: 'Real-Time Tracking',
    price: 69,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Live load tracking', 'Notifications', 'Geofencing'],
    accessiblePages: ['/dispatch-central', '/fleet-flow'],
    apiCallLimit: 10000,
  },

  API_ACCESS: {
    id: 'api_access',
    name: 'API Access',
    price: 149,
    interval: 'month',
    category: 'Add-on',
    permissionLevel: 'basic',
    features: ['Developer API', 'Webhooks', 'Third-party integrations'],
    apiCallLimit: 100000,
  },
};

// ========================================
// ENTERPRISE SOLUTIONS (custom pricing)
// ========================================

export const ENTERPRISE_SOLUTIONS: Record<string, SubscriptionPlan> = {
  // AI Company Dashboard - Premium AI management system powered by DEPOINTE AI
  AI_COMPANY_DASHBOARD: {
    id: 'ai_company_dashboard',
    name: 'AI Company Dashboard',
    price: 4999,
    interval: 'month',
    category: 'AI',
    permissionLevel: 'enterprise',
    features: [
      '🤖 DEPOINTE AI powered system',
      '🤖 18 Dedicated AI Staff Representatives',
      '🤖 Complete AI company management',
      '🤖 FINANCIAL: Resse A. Bell (Accounting)',
      '🤖 TECHNOLOGY: Dell (IT support)',
      '🤖 FREIGHT OPS: Logan, Miles Rhodes, Dee, Will, Hunter',
      '🤖 RELATIONSHIPS: Brook R., Carrie R.',
      '🤖 COMPLIANCE: Kameelah, Regina',
      '🤖 SUPPORT: Shanell, Clarence',
      '🤖 BUSINESS DEV: Gary, Desiree, Cliff, Drew',
      '🤖 OPERATIONS: C. Allen Durr, Ana Lyles',
      '🤖 Real-time activity tracking',
      '🤖 Task assignment & management',
      '🤖 AI-powered decision making',
      'Priority implementation support',
      'Custom AI staff training',
    ],
    accessiblePages: [
      '/depointe-dashboard',
      '/ai-company-dashboard',
      '/ai-flow',
      '/ai-hub',
      '/dashboard',
      '/analytics',
    ],
    maxUsers: 1000,
    maxDataStorage: 5000,
    apiCallLimit: 5000000,
  },

  // Enterprise Custom - Now includes DEPOINTE AI
  ENTERPRISE_CUSTOM: {
    id: 'enterprise_custom',
    name: 'Enterprise Custom Solutions',
    price: 7999, // Updated to reflect DEPOINTE AI inclusion
    interval: 'month',
    category: 'TMS',
    permissionLevel: 'enterprise',
    features: [
      'Everything in Enterprise Professional',
      'Dedicated account management',
      'Custom integrations & workflows',
      'White-label branding options',
      '24/7 priority support',
      'On-premise deployment',
      'Multi-location fleet management',
      'Advanced compliance automation',
      'Custom training programs',
      '🤖 Full AI Flow Enterprise included',
      '🤖 AI Company Dashboard included',
      '🤖 DEPOINTE AI system with 18 staff included',
      '🤖 Custom AI model development',
      '🤖 White-label AI capabilities',
      '🤖 Dedicated AI infrastructure',
    ],
    accessiblePages: [
      '/depointe-dashboard',
      '/ai-company-dashboard',
      '/ai-flow',
      '/ai-hub',
      '/dashboard',
      '/analytics',
      '/broker-box',
      '/dispatch-central',
      '/rfx-center',
      '/settings',
    ], // All pages including DEPOINTE AI accessible
    maxUsers: 10000,
    maxDataStorage: 10000,
    apiCallLimit: 10000000,
  },
};

// ========================================
// ANNUAL PLAN GENERATION HELPER
// ========================================

/**
 * Generate annual version of a monthly plan with 2+ months savings
 * Uses the EXACT same item names you already created in Square, just adds "(Annual)"
 */
const createAnnualPlan = (monthlyPlan: SubscriptionPlan): SubscriptionPlan => {
  const annualPrice = Math.round(monthlyPlan.price * 10); // 2 months free (10x instead of 12x)
  const savings = Math.round(monthlyPlan.price * 2); // 2 months savings

  return {
    ...monthlyPlan,
    id: `${monthlyPlan.id}-annual`,
    name: `${monthlyPlan.name} (Annual)`, // Matches existing Square item names
    price: annualPrice,
    interval: 'year',
    squareItemId: '', // Will use same Square item, different variation
    squareVariationId: '', // Annual variation of existing Square item
    features: [
      ...monthlyPlan.features,
      `💰 Save $${savings}/year (2 months free)`,
    ],
  };
};

/**
 * Generate all annual plans from monthly plans
 */
const generateAllAnnualPlans = (
  monthlyPlans: Record<string, SubscriptionPlan>
): Record<string, SubscriptionPlan> => {
  const annualPlans: Record<string, SubscriptionPlan> = {};

  Object.entries(monthlyPlans).forEach(([key, plan]) => {
    if (plan.interval === 'month') {
      const annualKey = `${key}_ANNUAL`;
      annualPlans[annualKey] = createAnnualPlan(plan);
    }
  });

  return annualPlans;
};

// ========================================
// HELPER FUNCTIONS
// ========================================

// ========================================
// COMPLETE PLAN COLLECTIONS (Monthly + Annual)
// ========================================

// Generate annual versions of all monthly plans
const FLEETFLOW_ANNUAL_PLANS = generateAllAnnualPlans(FLEETFLOW_PRICING_PLANS);
const ADDON_ANNUAL_PLANS = generateAllAnnualPlans(ADDON_MODULES);
const PHONE_ANNUAL_PLANS = generateAllAnnualPlans(PHONE_SYSTEM_ADDONS);
const ENTERPRISE_ANNUAL_PLANS = generateAllAnnualPlans(ENTERPRISE_SOLUTIONS);

// Combined collections with both monthly and annual plans
export const ALL_FLEETFLOW_PLANS = {
  ...FLEETFLOW_PRICING_PLANS,
  ...FLEETFLOW_ANNUAL_PLANS,
};

export const ALL_ADDON_MODULES = {
  ...ADDON_MODULES,
  ...ADDON_ANNUAL_PLANS,
};

export const ALL_PHONE_ADDONS = {
  ...PHONE_SYSTEM_ADDONS,
  ...PHONE_ANNUAL_PLANS,
};

export const ALL_ENTERPRISE_SOLUTIONS = {
  ...ENTERPRISE_SOLUTIONS,
  ...ENTERPRISE_ANNUAL_PLANS,
};

// Master collection of ALL plans (monthly + annual)
export const ALL_SUBSCRIPTION_PLANS = {
  ...ALL_FLEETFLOW_PLANS,
  ...ALL_ADDON_MODULES,
  ...ALL_PHONE_ADDONS,
  ...ALL_ENTERPRISE_SOLUTIONS,
};

export const getPlanById = (planId: string): SubscriptionPlan | undefined => {
  return ALL_SUBSCRIPTION_PLANS[planId];
};

export const getPlansByCategory = (
  category: 'TMS' | 'Training' | 'Add-on' | 'AI' | 'Phone'
): SubscriptionPlan[] => {
  return Object.values(ALL_SUBSCRIPTION_PLANS).filter(
    (plan) => plan.category === category
  );
};

export const getPlansByPermissionLevel = (
  level: 'basic' | 'professional' | 'enterprise' | 'university'
): SubscriptionPlan[] => {
  return Object.values(ALL_SUBSCRIPTION_PLANS).filter(
    (plan) => plan.permissionLevel === level
  );
};

export const calculateTotalPrice = (planIds: string[]): number => {
  return planIds.reduce((total, planId) => {
    const plan = getPlanById(planId);
    return total + (plan?.price || 0);
  }, 0);
};

export const getAccessiblePages = (planIds: string[]): string[] => {
  const pages = new Set<string>();

  planIds.forEach((planId) => {
    const plan = getPlanById(planId);
    if (plan?.accessiblePages) {
      plan.accessiblePages.forEach((page) => pages.add(page));
    }
  });

  return Array.from(pages);
};

export const getRestrictedFeatures = (planIds: string[]): string[] => {
  const restrictions = new Set<string>();

  planIds.forEach((planId) => {
    const plan = getPlanById(planId);
    if (plan?.restrictedFeatures) {
      plan.restrictedFeatures.forEach((feature) => restrictions.add(feature));
    }
  });

  return Array.from(restrictions);
};

/**
 * Get annual version of a monthly plan
 */
export const getAnnualVersion = (
  monthlyPlanId: string
): SubscriptionPlan | undefined => {
  const annualPlanId = `${monthlyPlanId}-annual`;
  return getPlanById(annualPlanId);
};

/**
 * Get monthly version of an annual plan
 */
export const getMonthlyVersion = (
  annualPlanId: string
): SubscriptionPlan | undefined => {
  const monthlyPlanId = annualPlanId.replace('-annual', '');
  return getPlanById(monthlyPlanId);
};

/**
 * Check if a plan has both monthly and annual versions
 */
export const hasBothVersions = (
  planId: string
): { hasMonthly: boolean; hasAnnual: boolean } => {
  const isAnnual = planId.endsWith('-annual');
  const monthlyId = isAnnual ? planId.replace('-annual', '') : planId;
  const annualId = isAnnual ? planId : `${planId}-annual`;

  return {
    hasMonthly: !!getPlanById(monthlyId),
    hasAnnual: !!getPlanById(annualId),
  };
};

/**
 * Get all plans with their billing options
 */
export const getPlansWithBillingOptions = (): Array<{
  monthlyPlan: SubscriptionPlan;
  annualPlan?: SubscriptionPlan;
  savings?: number;
}> => {
  const monthlyPlans = Object.values(ALL_SUBSCRIPTION_PLANS).filter(
    (plan) => plan.interval === 'month'
  );

  return monthlyPlans.map((monthlyPlan) => {
    const annualPlan = getAnnualVersion(monthlyPlan.id);
    const savings = annualPlan ? monthlyPlan.price * 12 - annualPlan.price : 0;

    return {
      monthlyPlan,
      annualPlan,
      savings: savings > 0 ? savings : undefined,
    };
  });
};

// ========================================
// GO WITH THE FLOW MARKETPLACE SUBSCRIPTION PLANS
// ========================================

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free-Flow',
    price: 0,
    icon: '🎁',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    limits: {
      loadsPerMonth: 5,
      loadValueCap: 1000,
      dispatchServices: false,
      supportLevel: 'email',
      apiAccess: false,
    },
    accessiblePages: [
      '/', // Landing page
      '/go-with-the-flow', // Main marketplace page
      '/carriers', // Carrier network
      '/carrier-network', // Alternative carrier page
      '/auth/*', // Login/registration
      '/user-profile', // User profile
      '/user-management', // Basic user management
    ],
    features: [
      '5 loads/month included',
      'Basic load posting',
      'Standard carrier access',
      'Email support',
      'Load value cap: $1000/load',
    ],
  },

  professional: {
    id: 'professional',
    name: 'Pro-Flow',
    price: 249, // Updated from $299 to $249
    icon: '🚀',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    limits: {
      loadsPerMonth: 25,
      loadValueCap: null, // No cap
      dispatchServices: true,
      dispatchRate: 50,
      supportLevel: 'phone',
      apiAccess: false,
    },
    accessiblePages: [
      '/', // Landing page
      '/go-with-the-flow', // Main marketplace page
      '/carriers', // Carrier network
      '/carrier-network', // Alternative carrier page
      '/auth/*', // Login/registration
      '/user-profile', // User profile
      '/user-management', // User management
      '/dashboard', // Basic dashboard
    ],
    features: [
      '25 loads/month included',
      'Priority load promotion',
      'Premium carrier access',
      'Phone support',
      'Basic dispatch ($50/load included)',
      'Advanced analytics',
      'No load value limits',
    ],
  },

  enterprise: {
    id: 'enterprise',
    name: 'Flow on the Go',
    price: 699, // Updated from $799 to $699
    icon: '🏢',
    squareItemId: '', // To be added when created in Square
    squareVariationId: '', // To be added when created in Square
    limits: {
      loadsPerMonth: 100,
      loadValueCap: null, // No cap
      dispatchServices: true,
      dispatchRate: 100,
      supportLevel: 'dedicated',
      apiAccess: true,
    },
    accessiblePages: [
      '/', // Landing page
      '/go-with-the-flow', // Main marketplace page
      '/carriers', // Carrier network
      '/carrier-network', // Alternative carrier page
      '/auth/*', // Login/registration
      '/user-profile', // User profile
      '/user-management', // User management
      '/dashboard', // Dashboard
      '/analytics', // Analytics (limited)
    ],
    features: [
      '100 loads/month included',
      'VIP load promotion',
      'Elite carrier network',
      'Dedicated account manager',
      'Advanced dispatch ($100/load included)',
      'API integration',
      'White-glove service',
      'Unlimited load values',
    ],
  },
};

/**
 * Debug function to log all generated annual plans
 */
export const logAllAnnualPlans = (): void => {
  console.log('🎯 ANNUAL PLAN GENERATION SUMMARY:');

  const monthlyPlans = Object.values(ALL_SUBSCRIPTION_PLANS).filter(
    (p) => p.interval === 'month'
  );
  const annualPlans = Object.values(ALL_SUBSCRIPTION_PLANS).filter(
    (p) => p.interval === 'year'
  );

  console.log(`📊 Monthly Plans: ${monthlyPlans.length}`);
  console.log(`📊 Annual Plans: ${annualPlans.length}`);
  console.log(`📊 Total Plans: ${Object.keys(ALL_SUBSCRIPTION_PLANS).length}`);

  console.log('\n💰 Annual Plan Examples:');
  annualPlans.slice(0, 5).forEach((plan) => {
    const monthlyVersion = getMonthlyVersion(plan.id);
    const savings = monthlyVersion ? monthlyVersion.price * 12 - plan.price : 0;
    console.log(`  • ${plan.name}: $${plan.price}/year (saves $${savings})`);
  });

  console.log(
    `\n✅ All ${monthlyPlans.length} monthly plans now have annual versions!`
  );
};
