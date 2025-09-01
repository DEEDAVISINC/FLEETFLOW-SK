'use client';

interface LaunchPhase {
  phase: string;
  name: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  campaigns: string[];
  objectives: string[];
  successMetrics: string[];
  resourceRequirements: string[];
  timeline: string[];
}

export const CAMPAIGN_LAUNCH_SEQUENCE: LaunchPhase[] = [
  {
    phase: 'PHASE_1',
    name: 'Foundation Launch - Core Revenue Engines',
    duration: 'Weeks 1-4',
    priority: 'high',
    campaigns: [
      'Healthcare & Pharma Distribution Blitz - PREMIER CAMPAIGN',
      'Desperate Shippers Blitz (Balanced Multi-Channel)',
      'New Businesses Freight Blitz (PHASE 1 PRIORITY)',
    ],
    objectives: [
      'Establish immediate revenue foundation',
      'Validate healthcare specialization',
      'Build carrier network through dispatch',
      'Create initial customer success stories',
      'Generate first-month cash flow',
    ],
    successMetrics: [
      '85+ healthcare leads contacted (26 conversions)',
      '150+ desperate shipper leads (45 conversions)',
      '95+ new business leads (29 conversions)',
      '$104,333 monthly revenue achieved',
      '80+ carriers onboarded to dispatch network',
      '90%+ customer satisfaction scores',
    ],
    resourceRequirements: [
      '4 AI Staff fully deployed (Desiree, Gary, Logan, Kameelah)',
      'Healthcare specialization training completed',
      'CRM and lead tracking systems operational',
      'Marketing collateral for healthcare focus',
      'Carrier onboarding process streamlined',
    ],
    timeline: [
      'Week 1: Healthcare/Pharma Blitz full launch + initial carrier acquisition',
      'Week 2: Desperate Shippers Blitz launch + New Businesses Blitz prep',
      'Week 3: New Businesses Blitz full launch + cross-campaign optimization',
      'Week 4: Performance analysis + Phase 1 optimization + Phase 2 planning',
    ],
  },
  {
    phase: 'PHASE_2',
    name: 'Expansion Launch - Market Penetration',
    duration: 'Weeks 5-12',
    priority: 'high',
    campaigns: [
      'E-commerce Seasonal Rush Blitz',
      'Enterprise Account Conversion Blitz',
      'Referral Network Acceleration Blitz',
      'Regional Market Penetration Blitz',
    ],
    objectives: [
      'Scale revenue through high-volume segments',
      'Penetrate enterprise and e-commerce markets',
      'Build referral network for organic growth',
      'Expand geographic coverage',
      'Achieve $200K+ monthly revenue target',
    ],
    successMetrics: [
      '120+ e-commerce leads (36 conversions)',
      '65+ enterprise leads (13 conversions)',
      '110+ referral leads (44 conversions)',
      '95+ regional leads (29 conversions)',
      '$200K+ monthly revenue milestone',
      '3+ geographic markets fully penetrated',
      '50%+ of business from referrals',
    ],
    resourceRequirements: [
      '6 AI Staff deployed (add Cliff, Will, Shanell)',
      'E-commerce and enterprise specialization training',
      'Regional market research and mapping',
      'Referral program infrastructure',
      'Enterprise sales process and materials',
    ],
    timeline: [
      'Weeks 5-6: E-commerce Seasonal Rush Blitz launch + enterprise targeting prep',
      'Weeks 7-8: Enterprise Account Conversion Blitz launch + referral system activation',
      'Weeks 9-10: Referral Network Acceleration Blitz + regional expansion',
      'Weeks 11-12: Performance optimization + Phase 3 preparation',
    ],
  },
  {
    phase: 'PHASE_3',
    name: 'Optimization Launch - Advanced Strategies',
    duration: 'Weeks 13-24',
    priority: 'medium',
    campaigns: [
      'Food & Beverage Supply Chain Blitz',
      'Recovery Relationship Blitz',
      'High-Value Prospect Acceleration',
      'Carrier/Owner Operator Acquisition Campaign',
    ],
    objectives: [
      'Optimize conversion rates through advanced targeting',
      'Win back lost customers with recovery strategies',
      'Accelerate high-value prospect conversion',
      'Scale carrier network for capacity expansion',
      'Achieve $300K+ monthly revenue target',
    ],
    successMetrics: [
      '90+ food/beverage leads (27 conversions)',
      '75+ recovery leads (30 conversions)',
      'High-value prospect acceleration metrics',
      '200+ carrier leads (80 conversions)',
      '$300K+ monthly revenue achieved',
      '95%+ carrier retention rate',
      '85%+ recovery conversion rate',
    ],
    resourceRequirements: [
      '8 AI Staff deployed (add Brook R., Carrie R.)',
      'Advanced analytics and conversion optimization',
      'Recovery customer database development',
      'High-value prospect qualification system',
      'Enhanced carrier management platform',
    ],
    timeline: [
      'Weeks 13-16: Food/Beverage Blitz + Recovery Relationship Blitz launch',
      'Weeks 17-20: High-Value Prospect Acceleration + carrier network expansion',
      'Weeks 21-24: Full optimization + market dominance achievement',
    ],
  },
];

export const PLATFORM_FEATURE_ROADMAP = {
  immediate: {
    name: 'Launch-Ready Features',
    features: [
      'GO WITH THE FLOW instant matching',
      'MARKETPLACE BIDDING competitive pricing',
      'Real-time shipment tracking',
      'Basic carrier performance dashboard',
      'Mobile-responsive customer portal',
      'Automated lead qualification',
      'Basic reporting and analytics',
    ],
    timeline: 'Available at launch',
  },
  shortTerm: {
    name: 'Month 1-3 Enhancements',
    features: [
      'Advanced AI route optimization',
      'Predictive pricing algorithms',
      'Automated carrier bidding system',
      'Enhanced mobile app with real-time updates',
      'Integration with major TMS systems',
      'Advanced analytics dashboard',
      'Automated customer onboarding',
      'Real-time capacity alerts',
    ],
    timeline: 'Rolling deployment',
  },
  mediumTerm: {
    name: 'Month 4-6 Advanced Features',
    features: [
      'Machine learning demand forecasting',
      'Dynamic pricing optimization',
      'Blockchain-based contract management',
      'IoT integration for shipment monitoring',
      'Advanced risk assessment algorithms',
      'Multi-modal transportation optimization',
      'AI-powered customer service chatbots',
      'Predictive maintenance for carrier fleet',
    ],
    timeline: 'Q2 2025',
  },
  longTerm: {
    name: 'Year 2+ Vision Features',
    features: [
      'Autonomous freight marketplace',
      'Quantum computing route optimization',
      'Global supply chain orchestration',
      'AI-driven strategic procurement',
      'Real-time carbon footprint tracking',
      'Predictive market disruption alerts',
      'Fully autonomous carrier selection',
      'Global regulatory compliance automation',
    ],
    timeline: '2026+',
  },
};

export const RESOURCE_ALLOCATION_MATRIX = {
  phase1: {
    aiStaff: ['Desiree', 'Gary', 'Logan', 'Kameelah'],
    budget: '$50K',
    tools: ['CRM', 'Lead tracking', 'Basic analytics'],
    training: 'Healthcare specialization, platform basics',
  },
  phase2: {
    aiStaff: ['Desiree', 'Gary', 'Logan', 'Kameelah', 'Cliff', 'Will'],
    budget: '$100K',
    tools: ['Advanced analytics', 'Marketing automation', 'Sales enablement'],
    training: 'Enterprise sales, e-commerce specialization, referral systems',
  },
  phase3: {
    aiStaff: [
      'Desiree',
      'Gary',
      'Logan',
      'Kameelah',
      'Cliff',
      'Will',
      'Shanell',
      'Brook R.',
    ],
    budget: '$150K',
    tools: ['AI optimization', 'Predictive analytics', 'Advanced integrations'],
    training:
      'Advanced conversion optimization, recovery strategies, carrier management',
  },
};

export const SUCCESS_MILESTONES = [
  {
    milestone: 'Phase 1 Completion',
    criteria:
      '$104K monthly revenue, 80+ carriers onboarded, 90%+ customer satisfaction',
    timeline: 'Week 4',
    rewards: 'Phase 2 budget allocation, expanded AI staff deployment',
  },
  {
    milestone: 'Revenue Target Achievement',
    criteria:
      '$200K monthly revenue, 300+ active customers, 5+ geographic markets',
    timeline: 'Week 12',
    rewards: 'Phase 3 advancement, advanced platform features unlock',
  },
  {
    milestone: 'Market Leadership',
    criteria:
      '$300K monthly revenue, 1000+ customers, 10+ geographic markets, 85% market share target',
    timeline: 'Week 24',
    rewards: 'IPO preparation, international expansion planning',
  },
];
