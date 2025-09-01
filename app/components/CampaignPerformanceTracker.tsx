'use client';

interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  status: 'planned' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate?: string;
  kpis: {
    leadsGenerated: number;
    leadsContacted: number;
    conversions: number;
    revenueGenerated: number;
    costPerLead: number;
    conversionRate: number;
    roi: number;
    customerSatisfaction: number;
  };
  performance: {
    weeklyMetrics: Array<{
      week: string;
      leads: number;
      conversions: number;
      revenue: number;
    }>;
    topPerformingChannels: Array<{
      channel: string;
      leads: number;
      conversions: number;
      efficiency: number;
    }>;
    aiStaffPerformance: Array<{
      staff: string;
      tasksCompleted: number;
      conversionRate: number;
      responseTime: number;
    }>;
  };
  optimization: {
    recommendedActions: string[];
    budgetAdjustments: string[];
    channelOptimizations: string[];
    aiStaffReallocations: string[];
  };
}

export const CAMPAIGN_PERFORMANCE_DATA: CampaignMetrics[] = [
  {
    campaignId: 'healthcare_pharma_blitz',
    campaignName: 'Healthcare & Pharma Distribution Blitz - PREMIER CAMPAIGN',
    status: 'active',
    startDate: '2025-01-06',
    kpis: {
      leadsGenerated: 85,
      leadsContacted: 72,
      conversions: 22,
      revenueGenerated: 165000,
      costPerLead: 45.5,
      conversionRate: 30.6,
      roi: 380,
      customerSatisfaction: 4.8,
    },
    performance: {
      weeklyMetrics: [
        { week: 'Week 1', leads: 28, conversions: 8, revenue: 60000 },
        { week: 'Week 2', leads: 32, conversions: 9, revenue: 67500 },
        { week: 'Week 3', leads: 25, conversions: 5, revenue: 37500 },
      ],
      topPerformingChannels: [
        { channel: 'LinkedIn', leads: 35, conversions: 12, efficiency: 34.3 },
        { channel: 'Email', leads: 28, conversions: 7, efficiency: 25.0 },
        { channel: 'Phone', leads: 22, conversions: 3, efficiency: 13.6 },
      ],
      aiStaffPerformance: [
        {
          staff: 'Desiree',
          tasksCompleted: 180,
          conversionRate: 32.1,
          responseTime: 2.3,
        },
        {
          staff: 'Gary',
          tasksCompleted: 156,
          conversionRate: 28.8,
          responseTime: 1.8,
        },
        {
          staff: 'Logan',
          tasksCompleted: 142,
          conversionRate: 31.7,
          responseTime: 2.1,
        },
        {
          staff: 'Kameelah',
          tasksCompleted: 98,
          conversionRate: 29.6,
          responseTime: 2.7,
        },
      ],
    },
    optimization: {
      recommendedActions: [
        'Increase LinkedIn outreach by 25% - highest conversion channel',
        'Add healthcare industry webinars for lead generation',
        'Implement automated follow-up sequences for non-converters',
      ],
      budgetAdjustments: [
        'Increase LinkedIn advertising budget by $500/week',
        'Allocate $200/week for healthcare industry event sponsorship',
        'Reduce generic email marketing by 15%',
      ],
      channelOptimizations: [
        'Optimize LinkedIn messaging for healthcare decision-makers',
        'Personalize email campaigns with healthcare-specific content',
        'Train phone team on healthcare industry terminology',
      ],
      aiStaffReallocations: [
        'Increase Desiree allocation by 20% for research tasks',
        'Add Shanell for additional customer service support',
        'Optimize Logan schedule for peak healthcare hours',
      ],
    },
  },
  {
    campaignId: 'desperate_shippers_blitz',
    campaignName: 'Desperate Shippers Blitz (Balanced Multi-Channel)',
    status: 'active',
    startDate: '2025-01-13',
    kpis: {
      leadsGenerated: 120,
      leadsContacted: 98,
      conversions: 35,
      revenueGenerated: 175000,
      costPerLead: 38.75,
      conversionRate: 35.7,
      roi: 420,
      customerSatisfaction: 4.6,
    },
    performance: {
      weeklyMetrics: [
        { week: 'Week 1', leads: 45, conversions: 15, revenue: 75000 },
        { week: 'Week 2', leads: 53, conversions: 18, revenue: 90000 },
        { week: 'Week 3', leads: 22, conversions: 2, revenue: 10000 },
      ],
      topPerformingChannels: [
        { channel: 'Phone', leads: 48, conversions: 22, efficiency: 45.8 },
        { channel: 'Email', leads: 35, conversions: 10, efficiency: 28.6 },
        { channel: 'LinkedIn', leads: 37, conversions: 3, efficiency: 8.1 },
      ],
      aiStaffPerformance: [
        {
          staff: 'Desiree',
          tasksCompleted: 145,
          conversionRate: 37.2,
          responseTime: 1.9,
        },
        {
          staff: 'Gary',
          tasksCompleted: 132,
          conversionRate: 34.1,
          responseTime: 2.2,
        },
        {
          staff: 'Logan',
          tasksCompleted: 118,
          conversionRate: 36.4,
          responseTime: 2.0,
        },
      ],
    },
    optimization: {
      recommendedActions: [
        'Focus on phone outreach - 45.8% efficiency rate',
        'Implement urgency messaging for desperate shippers',
        'Create emergency response protocols for crisis situations',
      ],
      budgetAdjustments: [
        'Increase phone outreach budget by $300/week',
        'Add premium data sources for desperate shipper identification',
        'Implement A/B testing for urgency messaging',
      ],
      channelOptimizations: [
        'Develop phone scripts specifically for crisis situations',
        'Create urgency-based email campaigns',
        'Add emergency hotline for desperate shippers',
      ],
      aiStaffReallocations: [
        'Train team on crisis communication techniques',
        'Add dedicated urgent response coordinator',
        'Optimize scheduling for peak desperation hours',
      ],
    },
  },
  {
    campaignId: 'new_businesses_blitz',
    campaignName: 'New Businesses Freight Blitz (PHASE 1 PRIORITY)',
    status: 'active',
    startDate: '2025-01-20',
    kpis: {
      leadsGenerated: 95,
      leadsContacted: 78,
      conversions: 28,
      revenueGenerated: 168000,
      costPerLead: 42.15,
      conversionRate: 35.9,
      roi: 365,
      customerSatisfaction: 4.7,
    },
    performance: {
      weeklyMetrics: [
        { week: 'Week 1', leads: 35, conversions: 12, revenue: 72000 },
        { week: 'Week 2', leads: 40, conversions: 14, revenue: 84000 },
        { week: 'Week 3', leads: 20, conversions: 2, revenue: 12000 },
      ],
      topPerformingChannels: [
        { channel: 'Phone', leads: 38, conversions: 18, efficiency: 47.4 },
        { channel: 'LinkedIn', leads: 32, conversions: 8, efficiency: 25.0 },
        { channel: 'Email', leads: 25, conversions: 2, efficiency: 8.0 },
      ],
      aiStaffPerformance: [
        {
          staff: 'Desiree',
          tasksCompleted: 125,
          conversionRate: 38.4,
          responseTime: 1.7,
        },
        {
          staff: 'Gary',
          tasksCompleted: 108,
          conversionRate: 33.3,
          responseTime: 2.1,
        },
        {
          staff: 'Logan',
          tasksCompleted: 95,
          conversionRate: 36.8,
          responseTime: 1.9,
        },
      ],
    },
    optimization: {
      recommendedActions: [
        'Phone channel showing 47.4% efficiency - scale this approach',
        'Target businesses 6-18 months old for highest conversion',
        'Create new business welcome packages and onboarding',
      ],
      budgetAdjustments: [
        'Increase phone outreach budget by $400/week',
        'Add business registration data sources',
        'Implement new business nurturing campaigns',
      ],
      channelOptimizations: [
        'Develop phone scripts for startup business owners',
        'Create industry-specific value propositions',
        'Add business growth milestone tracking',
      ],
      aiStaffReallocations: [
        'Add Will for additional sales support',
        'Train team on startup business psychology',
        'Optimize for peak startup business hours',
      ],
    },
  },
];

export const PERFORMANCE_DASHBOARD = {
  overallMetrics: {
    totalRevenue: 508000,
    totalConversions: 85,
    averageConversionRate: 34.1,
    totalLeads: 300,
    averageCostPerLead: 41.33,
    averageROI: 388,
    averageSatisfaction: 4.7,
  },
  channelPerformance: {
    phone: { leads: 126, conversions: 58, efficiency: 46.0, revenue: 251000 },
    linkedin: {
      leads: 104,
      conversions: 23,
      efficiency: 22.1,
      revenue: 103500,
    },
    email: { leads: 70, conversions: 19, efficiency: 27.1, revenue: 153500 },
  },
  aiStaffLeaderboard: [
    {
      staff: 'Desiree',
      totalTasks: 450,
      conversionRate: 35.9,
      responseTime: 2.0,
    },
    { staff: 'Gary', totalTasks: 396, conversionRate: 32.1, responseTime: 2.0 },
    {
      staff: 'Logan',
      totalTasks: 355,
      conversionRate: 35.0,
      responseTime: 2.0,
    },
    {
      staff: 'Kameelah',
      totalTasks: 98,
      conversionRate: 29.6,
      responseTime: 2.7,
    },
  ],
  optimizationRecommendations: [
    'Scale phone outreach across all campaigns - 46% efficiency',
    'Implement AI staff performance-based incentives',
    'Add automated lead nurturing for non-converters',
    'Create channel-specific messaging optimization',
    'Develop crisis response protocols for desperate shippers',
    'Build referral network activation system',
  ],
};

export const PREDICTIVE_ANALYTICS = {
  revenueForecast: {
    week4: 175000,
    week5: 200000,
    week6: 225000,
    week7: 250000,
    month2: 850000,
    month3: 1200000,
  },
  conversionOptimization: {
    currentRate: 34.1,
    targetRate: 45.0,
    optimizationStrategies: [
      'Implement AI lead scoring for prioritization',
      'Add behavioral email triggers',
      'Create industry-specific landing pages',
      'Develop account-based marketing campaigns',
    ],
  },
  budgetOptimization: {
    currentSpend: 12375,
    optimalSpend: 15000,
    recommendations: [
      'Increase phone channel budget by 25%',
      'Add LinkedIn advertising for healthcare',
      'Implement retargeting campaigns for non-converters',
    ],
  },
};
