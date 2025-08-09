'use client';

// AI Insurance Lead Generation Service
// Integrates with FleetFlow's AI Flow platform to generate insurance leads and expand partner network

export interface InsuranceLeadProfile {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  mcNumber?: string;
  dotNumber?: string;
  fleetSize: number;
  businessType: 'trucking' | 'logistics' | '3pl' | 'broker' | 'owner_operator';
  operatingRadius: 'local' | 'regional' | 'national' | 'international';
  annualRevenue?: string;
  currentInsurer?: string;
  renewalDate?: string;
  painPoints: string[];
  leadScore: number; // 1-100
  leadSource:
    | 'fmcsa_discovery'
    | 'competitor_analysis'
    | 'market_research'
    | 'referral'
    | 'website_visitor';
  aiConfidence: number; // 1-100
  priority: 'low' | 'medium' | 'high' | 'urgent';
  generatedAt: Date;
  lastContact?: Date;
  status: 'new' | 'contacted' | 'qualified' | 'quoted' | 'converted' | 'lost';
}

export interface LeadGenerationStrategy {
  name: string;
  description: string;
  targetCriteria: {
    fleetSizeMin: number;
    fleetSizeMax: number;
    businessTypes: string[];
    operatingRadius: string[];
    revenueRange: string[];
  };
  aiPrompts: string[];
  expectedLeadsPerDay: number;
  conversionRate: number;
  avgCommissionValue: number;
}

export interface PartnerExpansionOpportunity {
  partnerType:
    | 'insurance_carrier'
    | 'agency'
    | 'broker'
    | 'technology_platform';
  companyName: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  partnershipModel:
    | 'referral'
    | 'revenue_share'
    | 'white_label'
    | 'api_integration';
  potentialValue: {
    commissionRange: string;
    volumeCapacity: number;
    marketSegments: string[];
  };
  requirements: string[];
  timeline: string;
  aiAnalysis: {
    fitScore: number;
    competitiveAdvantage: string;
    riskFactors: string[];
    recommendations: string[];
  };
}

class AIInsuranceLeadService {
  private baseUrl = '/api/ai-insurance-leads';
  private leadGenerationStrategies: LeadGenerationStrategy[] = [
    {
      name: 'FMCSA New Entrant Discovery',
      description:
        'Target newly registered carriers within their first 2 years',
      targetCriteria: {
        fleetSizeMin: 1,
        fleetSizeMax: 25,
        businessTypes: ['trucking', 'owner_operator'],
        operatingRadius: ['regional', 'national'],
        revenueRange: ['$100K-$500K', '$500K-$1M'],
      },
      aiPrompts: [
        'Find carriers registered in the last 24 months with growing fleets',
        'Identify carriers with safety violations who need better insurance',
        'Target carriers in high-insurance-cost states (CA, NY, FL, TX)',
      ],
      expectedLeadsPerDay: 15,
      conversionRate: 0.12,
      avgCommissionValue: 850,
    },
    {
      name: 'Renewal Date Intelligence',
      description: 'Target carriers approaching insurance renewal dates',
      targetCriteria: {
        fleetSizeMin: 5,
        fleetSizeMax: 100,
        businessTypes: ['trucking', '3pl', 'logistics'],
        operatingRadius: ['regional', 'national', 'international'],
        revenueRange: ['$500K-$2M', '$2M-$10M'],
      },
      aiPrompts: [
        'Identify carriers with renewal dates in the next 60-90 days',
        'Find companies mentioning insurance costs in recent filings',
        'Target carriers who recently had claims or safety incidents',
      ],
      expectedLeadsPerDay: 8,
      conversionRate: 0.25,
      avgCommissionValue: 1650,
    },
    {
      name: 'Competitive Intelligence Mining',
      description: 'Analyze competitor customer bases and market gaps',
      targetCriteria: {
        fleetSizeMin: 10,
        fleetSizeMax: 500,
        businessTypes: ['trucking', '3pl', 'logistics', 'broker'],
        operatingRadius: ['national', 'international'],
        revenueRange: ['$1M-$5M', '$5M-$25M', '$25M+'],
      },
      aiPrompts: [
        "Research competitors' client lists and identify switching opportunities",
        'Find carriers dissatisfied with current insurance providers',
        'Target high-growth companies outgrowing their current coverage',
      ],
      expectedLeadsPerDay: 5,
      conversionRate: 0.18,
      avgCommissionValue: 2400,
    },
    {
      name: 'Market Expansion Opportunities',
      description:
        'Identify underserved market segments and geographic regions',
      targetCriteria: {
        fleetSizeMin: 3,
        fleetSizeMax: 50,
        businessTypes: ['trucking', 'logistics', 'owner_operator'],
        operatingRadius: ['local', 'regional'],
        revenueRange: ['$250K-$1M', '$1M-$3M'],
      },
      aiPrompts: [
        'Find carriers in underserved rural markets',
        'Identify specialized hauling companies (hazmat, oversized, etc.)',
        'Target minority and women-owned transportation businesses',
      ],
      expectedLeadsPerDay: 12,
      conversionRate: 0.15,
      avgCommissionValue: 1200,
    },
  ];

  // Generate insurance leads using AI Flow platform
  async generateLeads(
    strategy: string,
    count: number = 10
  ): Promise<InsuranceLeadProfile[]> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          strategy,
          count,
          useAI: true,
          integrateFMCSA: true,
          includeContactEnrichment: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return result.leads || [];
      } else {
        throw new Error(result.error || 'Failed to generate leads');
      }
    } catch (error) {
      console.error('Lead generation error:', error);
      return [];
    }
  }

  // AI-powered lead scoring and qualification
  async scoreAndQualifyLead(
    leadData: Partial<InsuranceLeadProfile>
  ): Promise<InsuranceLeadProfile> {
    try {
      const response = await fetch(`${this.baseUrl}/score-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      });

      const result = await response.json();

      if (response.ok) {
        return result.qualifiedLead;
      } else {
        throw new Error(result.error || 'Failed to score lead');
      }
    } catch (error) {
      console.error('Lead scoring error:', error);
      throw error;
    }
  }

  // Automated lead nurturing and follow-up
  async nurtureLead(
    leadId: string,
    stage: string
  ): Promise<{ success: boolean; nextAction: string; scheduledFor: Date }> {
    try {
      const response = await fetch(`${this.baseUrl}/nurture-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leadId,
          stage,
          personalizedContent: true,
          scheduleFollowUp: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          nextAction: result.nextAction,
          scheduledFor: new Date(result.scheduledFor),
        };
      } else {
        throw new Error(result.error || 'Failed to nurture lead');
      }
    } catch (error) {
      console.error('Lead nurturing error:', error);
      return {
        success: false,
        nextAction: 'manual_review',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };
    }
  }

  // Partner expansion opportunity discovery
  async discoverPartnerOpportunities(): Promise<PartnerExpansionOpportunity[]> {
    try {
      const response = await fetch(`${this.baseUrl}/discover-partners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisType: 'comprehensive',
          includeCompetitorAnalysis: true,
          includeMarketGaps: true,
          includeEmergingTech: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return result.opportunities || [];
      } else {
        throw new Error(result.error || 'Failed to discover partners');
      }
    } catch (error) {
      console.error('Partner discovery error:', error);
      return [];
    }
  }

  // AI-powered market analysis and insights
  async getMarketInsights(): Promise<{
    marketSize: string;
    growthRate: string;
    competitorAnalysis: any[];
    opportunities: string[];
    threats: string[];
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/market-insights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        return result.insights;
      } else {
        throw new Error(result.error || 'Failed to get market insights');
      }
    } catch (error) {
      console.error('Market insights error:', error);
      return {
        marketSize: 'Analysis unavailable',
        growthRate: 'Analysis unavailable',
        competitorAnalysis: [],
        opportunities: [],
        threats: [],
        recommendations: [],
      };
    }
  }

  // Automated outreach campaign management
  async launchOutreachCampaign(campaignConfig: {
    name: string;
    targetLeads: string[];
    messageTemplate: string;
    channels: ('email' | 'phone' | 'linkedin' | 'direct_mail')[];
    schedule: {
      startDate: Date;
      frequency: 'daily' | 'weekly' | 'monthly';
      duration: number; // days
    };
  }): Promise<{
    success: boolean;
    campaignId: string;
    estimatedReach: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/launch-campaign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(campaignConfig),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          campaignId: result.campaignId,
          estimatedReach: result.estimatedReach,
        };
      } else {
        throw new Error(result.error || 'Failed to launch campaign');
      }
    } catch (error) {
      console.error('Campaign launch error:', error);
      return {
        success: false,
        campaignId: '',
        estimatedReach: 0,
      };
    }
  }

  // Real-time lead conversion tracking
  async trackConversions(): Promise<{
    totalLeads: number;
    qualifiedLeads: number;
    quotesRequested: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    avgDealSize: number;
    topSources: Array<{ source: string; conversions: number; revenue: number }>;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/conversion-metrics`, {
        method: 'GET',
      });

      const result = await response.json();

      if (response.ok) {
        return result.metrics;
      } else {
        throw new Error(result.error || 'Failed to get conversion metrics');
      }
    } catch (error) {
      console.error('Conversion tracking error:', error);
      return {
        totalLeads: 0,
        qualifiedLeads: 0,
        quotesRequested: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
        avgDealSize: 0,
        topSources: [],
      };
    }
  }

  // AI-powered competitor analysis
  async analyzeCompetitors(): Promise<{
    competitors: Array<{
      name: string;
      marketShare: number;
      strengths: string[];
      weaknesses: string[];
      pricingStrategy: string;
      targetMarkets: string[];
      opportunities: string[];
    }>;
    marketPosition: string;
    recommendations: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/competitor-analysis`, {
        method: 'GET',
      });

      const result = await response.json();

      if (response.ok) {
        return result.analysis;
      } else {
        throw new Error(result.error || 'Failed to analyze competitors');
      }
    } catch (error) {
      console.error('Competitor analysis error:', error);
      return {
        competitors: [],
        marketPosition: 'Analysis unavailable',
        recommendations: [],
      };
    }
  }

  // Get lead generation strategies
  getLeadGenerationStrategies(): LeadGenerationStrategy[] {
    return this.leadGenerationStrategies;
  }

  // Calculate ROI projections
  calculateROIProjections(
    strategy: LeadGenerationStrategy,
    timeframe: number = 30
  ): {
    projectedLeads: number;
    projectedConversions: number;
    projectedRevenue: number;
    costEstimate: number;
    roi: number;
  } {
    const projectedLeads = strategy.expectedLeadsPerDay * timeframe;
    const projectedConversions = Math.round(
      projectedLeads * strategy.conversionRate
    );
    const projectedRevenue = projectedConversions * strategy.avgCommissionValue;
    const costEstimate = projectedLeads * 15; // $15 per lead cost estimate
    const roi =
      costEstimate > 0
        ? ((projectedRevenue - costEstimate) / costEstimate) * 100
        : 0;

    return {
      projectedLeads,
      projectedConversions,
      projectedRevenue,
      costEstimate,
      roi,
    };
  }

  // Integration with existing FleetFlow AI systems
  async integrateWithAIFlow(): Promise<{
    aiAgentsConnected: string[];
    dataSourcesActive: string[];
    automationEnabled: boolean;
    systemStatus: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/ai-flow-integration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enableProspectorAI: true,
          enableMarketIntelAI: true,
          enableCustomerServiceAI: true,
          connectFMCSAData: true,
          connectMarketData: true,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return result.integration;
      } else {
        throw new Error(result.error || 'Failed to integrate with AI Flow');
      }
    } catch (error) {
      console.error('AI Flow integration error:', error);
      return {
        aiAgentsConnected: [],
        dataSourcesActive: [],
        automationEnabled: false,
        systemStatus: 'Integration failed',
      };
    }
  }
}

export const aiInsuranceLeadService = new AIInsuranceLeadService();
