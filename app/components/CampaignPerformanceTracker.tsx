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
    channelOptimizations: string[];
    aiStaffReallocations: string[];
  };
}

// Real campaign data will be populated from API/database when campaigns are actually launched
export const CAMPAIGN_PERFORMANCE_DATA: CampaignMetrics[] = [];

// Performance dashboard will be calculated from real campaign data
export const PERFORMANCE_DASHBOARD = {
  overallMetrics: {
    totalRevenue: 0,
    totalConversions: 0,
    averageConversionRate: 0,
    totalLeads: 0,
    averageCostPerLead: 0,
    averageROI: 0,
    averageSatisfaction: 0,
  },
  channelPerformance: {
    phone: { leads: 0, conversions: 0, efficiency: 0, revenue: 0 },
    linkedin: { leads: 0, conversions: 0, efficiency: 0, revenue: 0 },
    email: { leads: 0, conversions: 0, efficiency: 0, revenue: 0 },
  },
  aiStaffLeaderboard: [],
  optimizationRecommendations: [
    'Launch your first campaign to see performance data and recommendations here',
  ],
};

// Predictive analytics will be generated from real campaign performance
export const PREDICTIVE_ANALYTICS = {
  revenueForecast: {
    nextMonth: 0,
    nextQuarter: 0,
    confidence: 0,
  },
  growthOpportunities: [
    'Start your first campaign to unlock AI-powered growth insights',
  ],
  riskFactors: [
    'No active campaigns - consider launching a freight brokerage campaign',
  ],
};
