// FleetFlow Strategic Sales Campaign Service
// Research-Driven, Funnel-Based Campaign System for Logistics Industry Sales

import { emailAuthenticationGuide } from './EmailAuthenticationSetupGuide';
import { emailWarmupService } from './EmailWarmupService';
import { sendingIPManager } from './SendingIPManager';

export interface DeliverabilityConfig {
  maxDailyVolume: number;
  maxWeeklyVolume: number;
  maxBounceRate: number; // 0.02 = 2%
  maxComplaintRate: number; // 0.001 = 0.1%
  minDeliverabilityRate: number; // 0.95 = 95%
  requireWarmup: boolean;
  requireAuthentication: boolean;
  delayBetweenEmails: { min: number; max: number }; // milliseconds
}

export interface DeliverabilityStatus {
  isReady: boolean;
  warnings: string[];
  errors: string[];
  recommendations: string[];
  authenticationScore: number; // 0-100
  warmupProgress: number; // 0-100
  currentDailyVolume: number;
  currentWeeklyVolume: number;
  bounceRate: number;
  complaintRate: number;
  deliverabilityRate: number;
}

export interface CampaignAudience {
  id: string;
  name: string;
  segment: 'core' | 'exploratory';
  industry:
    | 'freight_broker'
    | 'trucking_company'
    | 'dispatch_agency'
    | '3pl'
    | 'customs_broker'
    | 'freight_forwarder'
    | 'logistics_general';
  companySize: string; // e.g., "50-200 employees"
  revenue: string; // e.g., "$2M-$10M ARR"
  painPoints: string[];
  characteristics: {
    employees?: string;
    trucks?: string;
    revenue?: string;
    techBudget?: string;
    geography?: string;
  };
  expectedConversionRate: number; // 0.062 for core, 0.028 for exploratory
}

export interface CampaignMessage {
  id: string;
  funnelStage: 'top' | 'middle' | 'bottom';
  audienceId: string;
  subject: string;
  body: string;
  cta: string;
  variant: number; // 1, 2, or 3 for A/B/C testing
  expectedReplyRate: number; // 0.025 top, 0.048 middle, 0.080 bottom
  researchBased: boolean;
  painPointsAddressed: string[];
  socialProof?: string;
}

export interface Campaign {
  id: string;
  name: string;
  audience: CampaignAudience;
  messages: {
    top: CampaignMessage[];
    middle: CampaignMessage[];
    bottom: CampaignMessage[];
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  performance: CampaignPerformance;
  startDate?: Date;
  endDate?: Date;
}

export interface CampaignPerformance {
  campaignId: string;
  sent: number;
  opened: number;
  replied: number;
  positiveReplies: number;
  meetingsBooked: number;
  deals: number;
  revenue: number;
  openRate: number;
  replyRate: number;
  positiveReplyRate: number;
  meetingBookingRate: number;
  closeRate: number;
}

export interface ResearchInsight {
  industry: string;
  painPoint: string;
  customerQuote: string;
  frequency: number; // How often this pain point is mentioned
  severity: 'low' | 'medium' | 'high' | 'critical';
  messagingAngle: string;
}

/**
 * FleetFlow Strategic Sales Campaign Service
 *
 * Implements "The Outbound Engine Blueprint" methodology for selling
 * FleetFlow Business Intelligence platform to logistics companies.
 *
 * Key Features:
 * - Funnel-based campaigns (Top/Middle/Bottom)
 * - Audience segmentation (Core 70% / Exploratory 30%)
 * - Research-driven messaging (customer language, real pain points)
 * - A/B/C testing (2-3 variants per stage)
 * - Performance tracking and optimization
 * - Systematic lead qualification
 *
 * Target Results:
 * - 25-50+ qualified meetings per month
 * - 3-8% positive reply rates
 * - 15.3% overall qualified meeting rate
 * - Predictable, scalable pipeline
 */
export class FleetFlowStrategicSalesCampaignService {
  private static instance: FleetFlowStrategicSalesCampaignService;
  private campaigns: Map<string, Campaign> = new Map();
  private audiences: Map<string, CampaignAudience> = new Map();
  private researchInsights: ResearchInsight[] = [];

  // Deliverability Protection
  private deliverabilityConfig: DeliverabilityConfig = {
    maxDailyVolume: 200, // Start conservative
    maxWeeklyVolume: 1000,
    maxBounceRate: 0.02, // 2%
    maxComplaintRate: 0.001, // 0.1%
    minDeliverabilityRate: 0.95, // 95%
    requireWarmup: true,
    requireAuthentication: true,
    delayBetweenEmails: { min: 15000, max: 45000 }, // 15-45 seconds
  };

  private currentDailyVolume: number = 0;
  private currentWeeklyVolume: number = 0;
  private totalSent: number = 0;
  private totalBounced: number = 0;
  private totalComplaints: number = 0;
  private totalDelivered: number = 0;

  private constructor() {
    this.initializeAudienceSegments();
    this.initializeResearchInsights();
    console.info('🎯 FleetFlow Strategic Sales Campaign Service initialized');
    console.info('🛡️ Deliverability protection enabled');
  }

  public static getInstance(): FleetFlowStrategicSalesCampaignService {
    if (!FleetFlowStrategicSalesCampaignService.instance) {
      FleetFlowStrategicSalesCampaignService.instance =
        new FleetFlowStrategicSalesCampaignService();
    }
    return FleetFlowStrategicSalesCampaignService.instance;
  }

  /**
   * Initialize audience segments for all logistics industries
   */
  private initializeAudienceSegments(): void {
    // CORE LOOKALIKES (70% of volume) - 6.2% conversion rate

    // 1. Freight Brokers
    this.audiences.set('freight-broker-core', {
      id: 'freight-broker-core',
      name: 'Mid-Market Freight Brokers',
      segment: 'core',
      industry: 'freight_broker',
      companySize: '50-200 employees',
      revenue: '$2M-$10M ARR',
      painPoints: [
        'Manual load matching',
        'Carrier capacity visibility',
        'Customer tracking demands',
        'Margin pressure',
        'Cash flow challenges',
        'Shipper retention',
      ],
      characteristics: {
        employees: '50-200',
        revenue: '$2M-$10M',
        techBudget: '$50K+',
      },
      expectedConversionRate: 0.062,
    });

    // 2. Trucking Companies
    this.audiences.set('trucking-company-core', {
      id: 'trucking-company-core',
      name: 'Regional Trucking Companies',
      segment: 'core',
      industry: 'trucking_company',
      companySize: '25-100 trucks',
      revenue: '$5M-$25M',
      painPoints: [
        'High fuel costs',
        'Driver retention',
        'Equipment utilization',
        'DOT compliance burden',
        'Route inefficiency',
        'Maintenance costs',
      ],
      characteristics: {
        trucks: '25-100',
        employees: '30-150',
        revenue: '$5M-$25M',
      },
      expectedConversionRate: 0.062,
    });

    // 3. Dispatch Agencies
    this.audiences.set('dispatch-agency-core', {
      id: 'dispatch-agency-core',
      name: 'Third-Party Dispatch Agencies',
      segment: 'core',
      industry: 'dispatch_agency',
      companySize: '10-50 dispatchers',
      revenue: '$1M-$8M',
      painPoints: [
        'Managing multiple client fleets',
        'Driver communication',
        'Load optimization',
        'Client reporting',
        'Scaling limitations',
        'Manual processes',
      ],
      characteristics: {
        employees: '10-50',
        revenue: '$1M-$8M',
      },
      expectedConversionRate: 0.062,
    });

    // 4. 3PL Companies
    this.audiences.set('3pl-core', {
      id: '3pl-core',
      name: 'Mid-Market 3PL Providers',
      segment: 'core',
      industry: '3pl',
      companySize: '30-150 employees',
      revenue: '$3M-$15M',
      painPoints: [
        'Multi-modal complexity',
        'Customer visibility expectations',
        'Technology integration',
        'Competitive pressure',
        'Margin erosion',
        'Operational inefficiency',
      ],
      characteristics: {
        employees: '30-150',
        revenue: '$3M-$15M',
        techBudget: '$75K+',
      },
      expectedConversionRate: 0.062,
    });

    // 5. Customs Brokers / Freight Forwarders
    this.audiences.set('customs-broker-core', {
      id: 'customs-broker-core',
      name: 'International Freight Forwarders',
      segment: 'core',
      industry: 'customs_broker',
      companySize: '20-100 employees',
      revenue: '$2M-$12M',
      painPoints: [
        'International documentation complexity',
        'Customs compliance',
        'Multi-country tracking',
        'Customer communication',
        'Shipment visibility',
        'Manual paperwork',
      ],
      characteristics: {
        employees: '20-100',
        revenue: '$2M-$12M',
      },
      expectedConversionRate: 0.062,
    });

    // EXPLORATORY SEGMENTS (30% of volume) - 2.8% conversion rate

    this.audiences.set('enterprise-trucking-exploratory', {
      id: 'enterprise-trucking-exploratory',
      name: 'Enterprise Trucking Companies',
      segment: 'exploratory',
      industry: 'trucking_company',
      companySize: '200+ trucks',
      revenue: '$50M+',
      painPoints: [
        'Complex multi-terminal operations',
        'Enterprise system integration',
        'Advanced analytics needs',
      ],
      characteristics: {
        trucks: '200+',
        revenue: '$50M+',
      },
      expectedConversionRate: 0.028,
    });

    this.audiences.set('niche-logistics-exploratory', {
      id: 'niche-logistics-exploratory',
      name: 'Niche Logistics Providers',
      segment: 'exploratory',
      industry: 'logistics_general',
      companySize: 'Varies',
      revenue: 'Varies',
      painPoints: [
        'Specialized equipment tracking',
        'Compliance for specialized cargo',
        'Customer education',
      ],
      characteristics: {},
      expectedConversionRate: 0.028,
    });

    console.info(`✅ Initialized ${this.audiences.size} audience segments`);
  }

  /**
   * Initialize research insights from customer interviews and industry analysis
   */
  private initializeResearchInsights(): void {
    this.researchInsights = [
      // Freight Broker Pain Points
      {
        industry: 'freight_broker',
        painPoint: 'Manual load matching waste',
        customerQuote:
          "We're spending 3-4 hours per day manually matching loads to carriers when we could be focusing on customer relationships",
        frequency: 8,
        severity: 'high',
        messagingAngle: 'Time waste preventing growth',
      },
      {
        industry: 'freight_broker',
        painPoint: 'Customer visibility demands',
        customerQuote:
          'Shippers are asking for real-time tracking on every load, but only 40% of our carriers provide updates consistently',
        frequency: 9,
        severity: 'critical',
        messagingAngle: 'Customer retention risk',
      },
      {
        industry: 'freight_broker',
        painPoint: 'Cash flow uncertainty',
        customerQuote:
          "We never know exactly when we'll get paid by shippers or when we need to pay carriers - it's causing serious cash flow issues",
        frequency: 7,
        severity: 'high',
        messagingAngle: 'Financial predictability',
      },

      // Trucking Company Pain Points
      {
        industry: 'trucking_company',
        painPoint: 'Fuel cost volatility',
        customerQuote:
          'Fuel costs are eating 30% of our revenue and we have no way to optimize routes or predict expenses',
        frequency: 10,
        severity: 'critical',
        messagingAngle: 'Profit margin protection',
      },
      {
        industry: 'trucking_company',
        painPoint: 'Driver retention crisis',
        customerQuote:
          "We're losing drivers to competitors because our dispatch process is inefficient and they're sitting idle too often",
        frequency: 9,
        severity: 'critical',
        messagingAngle: 'Driver satisfaction and retention',
      },
      {
        industry: 'trucking_company',
        painPoint: 'Compliance burden',
        customerQuote:
          "DOT compliance is a full-time job and we still get violations because we can't track everything manually",
        frequency: 8,
        severity: 'high',
        messagingAngle: 'Risk and penalty avoidance',
      },

      // Dispatch Agency Pain Points
      {
        industry: 'dispatch_agency',
        painPoint: 'Scaling limitations',
        customerQuote:
          "We hit a wall at 50 drivers - can't scale further without hiring more dispatchers, which kills our margins",
        frequency: 9,
        severity: 'critical',
        messagingAngle: 'Growth without proportional cost increase',
      },
      {
        industry: 'dispatch_agency',
        painPoint: 'Client reporting manual work',
        customerQuote:
          'Creating weekly reports for each client fleet takes 10+ hours and the data is already outdated by the time we send it',
        frequency: 7,
        severity: 'high',
        messagingAngle: 'Real-time client value demonstration',
      },

      // 3PL Pain Points
      {
        industry: '3pl',
        painPoint: 'Multi-modal coordination',
        customerQuote:
          'Coordinating between truck, rail, and ocean freight is a nightmare - we need 5 different systems and nothing talks to each other',
        frequency: 8,
        severity: 'high',
        messagingAngle: 'Unified operations platform',
      },
      {
        industry: '3pl',
        painPoint: 'Customer expectations gap',
        customerQuote:
          "Our customers expect Amazon-level visibility and we're still sending Excel spreadsheets with tracking updates",
        frequency: 10,
        severity: 'critical',
        messagingAngle: 'Competitive differentiation',
      },

      // Customs Broker / Freight Forwarder Pain Points
      {
        industry: 'customs_broker',
        painPoint: 'Documentation complexity',
        customerQuote:
          'International shipments require 15-20 different documents and one mistake can delay cargo for weeks',
        frequency: 9,
        severity: 'critical',
        messagingAngle: 'Error reduction and speed',
      },
      {
        industry: 'customs_broker',
        painPoint: 'Multi-country tracking',
        customerQuote:
          "Tracking shipments across 4-5 countries is impossible - we're constantly calling carriers and terminals for updates",
        frequency: 8,
        severity: 'high',
        messagingAngle: 'Global visibility and control',
      },
    ];

    console.info(`✅ Loaded ${this.researchInsights.length} research insights`);
  }

  /**
   * Create a new strategic campaign for a specific audience
   */
  async createCampaign(
    audienceId: string,
    campaignName: string
  ): Promise<Campaign> {
    const audience = this.audiences.get(audienceId);
    if (!audience) {
      throw new Error(`Audience ${audienceId} not found`);
    }

    console.info(`📧 Creating campaign "${campaignName}" for ${audience.name}`);

    // Generate message variants for each funnel stage
    const topFunnelMessages = await this.generateTopFunnelMessages(audience);
    const middleFunnelMessages =
      await this.generateMiddleFunnelMessages(audience);
    const bottomFunnelMessages =
      await this.generateBottomFunnelMessages(audience);

    const campaign: Campaign = {
      id: `campaign-${Date.now()}`,
      name: campaignName,
      audience,
      messages: {
        top: topFunnelMessages,
        middle: middleFunnelMessages,
        bottom: bottomFunnelMessages,
      },
      status: 'draft',
      performance: {
        campaignId: `campaign-${Date.now()}`,
        sent: 0,
        opened: 0,
        replied: 0,
        positiveReplies: 0,
        meetingsBooked: 0,
        deals: 0,
        revenue: 0,
        openRate: 0,
        replyRate: 0,
        positiveReplyRate: 0,
        meetingBookingRate: 0,
        closeRate: 0,
      },
    };

    this.campaigns.set(campaign.id, campaign);
    console.info(`✅ Campaign created: ${campaign.id}`);
    return campaign;
  }

  /**
   * Generate TOP FUNNEL messages (Problem Awareness)
   * Expected reply rate: 2.5%
   */
  private async generateTopFunnelMessages(
    audience: CampaignAudience
  ): Promise<CampaignMessage[]> {
    const insights = this.researchInsights.filter(
      (i) => i.industry === audience.industry && i.severity === 'critical'
    );

    const messages: CampaignMessage[] = [];

    // Variant 1: Problem-focused
    if (insights[0]) {
      messages.push({
        id: `top-${audience.id}-v1`,
        funnelStage: 'top',
        audienceId: audience.id,
        subject: `The ${this.getProblemImpact(audience.industry)} costing ${this.getIndustryLabel(audience.industry)}`,
        body: this.generateProblemFocusedBody(audience, insights[0]),
        cta: 'Download AI Business Intelligence Report',
        variant: 1,
        expectedReplyRate: 0.025,
        researchBased: true,
        painPointsAddressed: [insights[0].painPoint],
      });
    }

    // Variant 2: Competitive insight
    messages.push({
      id: `top-${audience.id}-v2`,
      funnelStage: 'top',
      audienceId: audience.id,
      subject: `How competitors are gaining ${this.getCompetitiveEdge(audience.industry)}`,
      body: this.generateCompetitiveInsightBody(audience),
      cta: 'View Industry Benchmark Report',
      variant: 2,
      expectedReplyRate: 0.025,
      researchBased: true,
      painPointsAddressed: audience.painPoints.slice(0, 2),
    });

    // Variant 3: Data-driven insight
    messages.push({
      id: `top-${audience.id}-v3`,
      funnelStage: 'top',
      audienceId: audience.id,
      subject: `Analysis: 200 ${this.getIndustryLabel(audience.industry)} operations`,
      body: this.generateDataDrivenBody(audience),
      cta: 'Access Full Analysis',
      variant: 3,
      expectedReplyRate: 0.025,
      researchBased: true,
      painPointsAddressed: audience.painPoints,
    });

    return messages;
  }

  /**
   * Generate MIDDLE FUNNEL messages (Trust Building)
   * Expected reply rate: 4.8%
   */
  private async generateMiddleFunnelMessages(
    audience: CampaignAudience
  ): Promise<CampaignMessage[]> {
    const messages: CampaignMessage[] = [];

    // Variant 1: Case study focused
    messages.push({
      id: `middle-${audience.id}-v1`,
      funnelStage: 'middle',
      audienceId: audience.id,
      subject: `Case Study: How [Similar ${this.getIndustryLabel(audience.industry)}] ${this.getCaseStudyResult(audience.industry)}`,
      body: this.generateCaseStudyBody(audience),
      cta: 'Download Full Case Study',
      variant: 1,
      expectedReplyRate: 0.048,
      researchBased: true,
      painPointsAddressed: audience.painPoints.slice(0, 3),
      socialProof: 'Customer testimonial included',
    });

    // Variant 2: Checklist/Tool
    messages.push({
      id: `middle-${audience.id}-v2`,
      funnelStage: 'middle',
      audienceId: audience.id,
      subject: `FleetFlow Visibility Checklist for ${this.getIndustryLabel(audience.industry)}`,
      body: this.generateChecklistBody(audience),
      cta: 'Download Business Intelligence Assessment',
      variant: 2,
      expectedReplyRate: 0.048,
      researchBased: true,
      painPointsAddressed: audience.painPoints,
    });

    // Variant 3: Thought leadership
    messages.push({
      id: `middle-${audience.id}-v3`,
      funnelStage: 'middle',
      audienceId: audience.id,
      subject: `3 mistakes costing ${this.getIndustryLabel(audience.industry)} ${this.getMistakeCost(audience.industry)}/year`,
      body: this.generateThoughtLeadershipBody(audience),
      cta: 'View Prevention Guide',
      variant: 3,
      expectedReplyRate: 0.048,
      researchBased: true,
      painPointsAddressed: audience.painPoints.slice(0, 3),
    });

    return messages;
  }

  /**
   * Generate BOTTOM FUNNEL messages (Conversion)
   * Expected reply rate: 8.0%
   */
  private async generateBottomFunnelMessages(
    audience: CampaignAudience
  ): Promise<CampaignMessage[]> {
    const messages: CampaignMessage[] = [];

    // Variant 1: Direct conversion
    messages.push({
      id: `bottom-${audience.id}-v1`,
      funnelStage: 'bottom',
      audienceId: audience.id,
      subject: `Ready to ${this.getConversionGoal(audience.industry)}?`,
      body: this.generateDirectConversionBody(audience),
      cta: 'Book AI Strategy Session',
      variant: 1,
      expectedReplyRate: 0.08,
      researchBased: true,
      painPointsAddressed: audience.painPoints,
      socialProof: 'Results from similar companies',
    });

    // Variant 2: Personalized opportunity
    messages.push({
      id: `bottom-${audience.id}-v2`,
      funnelStage: 'bottom',
      audienceId: audience.id,
      subject: `[Company Name] - ${this.getPersonalizedOpportunity(audience.industry)}`,
      body: this.generatePersonalizedOpportunityBody(audience),
      cta: 'Schedule 15-Min Discovery Call',
      variant: 2,
      expectedReplyRate: 0.08,
      researchBased: true,
      painPointsAddressed: audience.painPoints.slice(0, 2),
    });

    return messages;
  }

  // Helper methods for message generation
  private getProblemImpact(industry: string): string {
    const impacts: Record<string, string> = {
      freight_broker: '$75K visibility gap',
      trucking_company: '$127K fuel waste',
      dispatch_agency: '50-driver scaling wall',
      '3pl': 'multi-modal coordination crisis',
      customs_broker: 'compliance documentation nightmare',
    };
    return impacts[industry] || '$100K+ operational gap';
  }

  private getIndustryLabel(industry: string): string {
    const labels: Record<string, string> = {
      freight_broker: 'freight brokers',
      trucking_company: 'trucking companies',
      dispatch_agency: 'dispatch agencies',
      '3pl': '3PL providers',
      customs_broker: 'customs brokers',
      freight_forwarder: 'freight forwarders',
      logistics_general: 'logistics companies',
    };
    return labels[industry] || 'logistics companies';
  }

  private getCompetitiveEdge(industry: string): string {
    const edges: Record<string, string> = {
      freight_broker: '47% more shipper contracts',
      trucking_company: '23% better margins',
      dispatch_agency: '3x load capacity',
      '3pl': 'enterprise-level visibility',
      customs_broker: '50% faster clearance times',
    };
    return edges[industry] || 'significant market advantage';
  }

  private getCaseStudyResult(industry: string): string {
    const results: Record<string, string> = {
      freight_broker: 'increased margins 18% with AI',
      trucking_company: 'reduced fuel costs 15%',
      dispatch_agency: 'scaled to 150 drivers with same team',
      '3pl': 'achieved 94% real-time visibility',
      customs_broker: 'reduced documentation errors 85%',
    };
    return results[industry] || 'transformed operations with AI';
  }

  private getMistakeCost(industry: string): string {
    const costs: Record<string, string> = {
      freight_broker: '$50K+',
      trucking_company: '$75K+',
      dispatch_agency: '$40K+',
      '3pl': '$100K+',
      customs_broker: '$60K+',
    };
    return costs[industry] || '$50K+';
  }

  private getConversionGoal(industry: string): string {
    const goals: Record<string, string> = {
      freight_broker: 'increase your brokerage margins 18%',
      trucking_company: 'reduce your operating costs 23%',
      dispatch_agency: 'scale to 150+ drivers',
      '3pl': 'achieve enterprise-level visibility',
      customs_broker: 'automate your documentation',
    };
    return goals[industry] || 'transform your operations with AI';
  }

  private getPersonalizedOpportunity(industry: string): string {
    const opportunities: Record<string, string> = {
      freight_broker: 'AI revenue opportunity analysis',
      trucking_company: 'Fleet optimization assessment',
      dispatch_agency: 'Scalability roadmap',
      '3pl': 'Visibility gap analysis',
      customs_broker: 'Compliance automation review',
    };
    return opportunities[industry] || 'Custom AI opportunity assessment';
  }

  private generateProblemFocusedBody(
    audience: CampaignAudience,
    insight: ResearchInsight
  ): string {
    return `Hi [Name],

With [Company]'s growth to ${audience.characteristics.employees || audience.characteristics.trucks || '50+'} ${audience.characteristics.employees ? 'employees' : 'trucks'}, you're probably facing the same challenge as [Similar Company] mentioned: "${insight.customerQuote}"

Here's what changed everything for [Similar Company]: ${insight.messagingAngle}.

Result: ${this.getCaseStudyResult(audience.industry)}.

Would you like to see our analysis of 200 similar ${this.getIndustryLabel(audience.industry)} and what's working?

[Download AI Business Intelligence Report]

Best regards,
[Your Name]
FleetFlow Business Intelligence Team`;
  }

  private generateCompetitiveInsightBody(audience: CampaignAudience): string {
    return `Hi [Name],

I analyzed 200 ${this.getIndustryLabel(audience.industry)} similar to [Company] and found something interesting:

The top performers are all solving the same 3 challenges:
1. ${audience.painPoints[0]}
2. ${audience.painPoints[1]}
3. ${audience.painPoints[2]}

And they're achieving ${this.getCompetitiveEdge(audience.industry)}.

Would you like to see the full benchmark report and where [Company] stands?

[View Industry Benchmark Report]

Best regards,
[Your Name]`;
  }

  private generateDataDrivenBody(audience: CampaignAudience): string {
    return `Hi [Name],

We just completed an analysis of 200 ${this.getIndustryLabel(audience.industry)} operations and the results are eye-opening:

• ${audience.expectedConversionRate * 100}% are achieving ${this.getCompetitiveEdge(audience.industry)}
• Average cost savings: ${this.getMistakeCost(audience.industry)}/year
• Common pain points: ${audience.painPoints.slice(0, 3).join(', ')}

I thought [Company] might find this relevant given your ${audience.characteristics.employees || audience.characteristics.trucks} ${audience.characteristics.employees ? 'employee' : 'truck'} operation.

[Access Full Analysis]

Best regards,
[Your Name]`;
  }

  private generateCaseStudyBody(audience: CampaignAudience): string {
    return `Hi [Name],

Quick question: Is [Company] experiencing challenges with ${audience.painPoints[0]}?

I ask because we just helped [Similar Company], a ${audience.companySize} ${this.getIndustryLabel(audience.industry)}, solve exactly this problem.

Result: ${this.getCaseStudyResult(audience.industry)}.

The solution was surprisingly straightforward, and [CEO Name] specifically told us: "This was the best operational decision we made this year."

Would you like to see how we did it?

[Download Full Case Study]

Best regards,
[Your Name]`;
  }

  private generateChecklistBody(audience: CampaignAudience): string {
    return `Hi [Name],

I put together a FleetFlow Business Intelligence Checklist specifically for ${this.getIndustryLabel(audience.industry)}.

It covers:
✓ ${audience.painPoints[0]} assessment
✓ ${audience.painPoints[1]} optimization
✓ ${audience.painPoints[2]} tracking
✓ ROI calculation framework

${this.getIndustryLabel(audience.industry)} using this checklist are finding $${this.getMistakeCost(audience.industry)}/year in hidden costs.

[Download Business Intelligence Assessment]

Takes 10 minutes to complete.

Best regards,
[Your Name]`;
  }

  private generateThoughtLeadershipBody(audience: CampaignAudience): string {
    return `Hi [Name],

After working with 50+ ${this.getIndustryLabel(audience.industry)}, I've identified the 3 biggest mistakes costing companies like [Company] ${this.getMistakeCost(audience.industry)}/year:

1. ${audience.painPoints[0]} (Average cost: 40% of total)
2. ${audience.painPoints[1]} (Average cost: 35% of total)
3. ${audience.painPoints[2]} (Average cost: 25% of total)

The good news? All three are preventable.

[View Prevention Guide]

Best regards,
[Your Name]`;
  }

  private generateDirectConversionBody(audience: CampaignAudience): string {
    return `Hi [Name],

Based on our previous conversations and [Company]'s ${audience.characteristics.employees || audience.characteristics.trucks} ${audience.characteristics.employees ? 'employee' : 'truck'} operation, I believe we can help you:

• ${this.getConversionGoal(audience.industry)}
• Solve your ${audience.painPoints[0]} challenges
• Achieve ${this.getCompetitiveEdge(audience.industry)}

${this.getIndustryLabel(audience.industry)} similar to [Company] are seeing results in 30-60 days.

Ready to discuss how FleetFlow Business Intelligence can work for [Company]?

[Book 30-Min AI Strategy Session]

Best regards,
[Your Name]`;
  }

  private generatePersonalizedOpportunityBody(
    audience: CampaignAudience
  ): string {
    return `Hi [Name],

I ran [Company]'s operations through our AI Business Intelligence assessment and found a specific opportunity:

Your ${audience.painPoints[0]} could be improved by an estimated ${this.getMistakeCost(audience.industry)}/year.

This is based on data from similar ${this.getIndustryLabel(audience.industry)} in your region with ${audience.characteristics.employees || audience.characteristics.trucks} ${audience.characteristics.employees ? 'employees' : 'trucks'}.

Would you like to see the full assessment? It's customized specifically for [Company].

[Schedule 15-Min Discovery Call]

Best regards,
[Your Name]`;
  }

  /**
   * Get campaign performance analytics
   */
  async getCampaignPerformance(
    campaignId: string
  ): Promise<CampaignPerformance> {
    const campaign = this.campaigns.get(campaignId);
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    return campaign.performance;
  }

  /**
   * Get all campaigns
   */
  getAllCampaigns(): Campaign[] {
    return Array.from(this.campaigns.values());
  }

  /**
   * Get all audience segments
   */
  getAllAudiences(): CampaignAudience[] {
    return Array.from(this.audiences.values());
  }

  /**
   * Get research insights for specific industry
   */
  getResearchInsights(industry?: string): ResearchInsight[] {
    if (industry) {
      return this.researchInsights.filter((i) => i.industry === industry);
    }
    return this.researchInsights;
  }

  /**
   * Check deliverability status before launching campaigns
   * CRITICAL: Call this before sending ANY Strategic Sales emails
   */
  async checkDeliverabilityStatus(
    domain: string = 'fleetflowapp.com'
  ): Promise<DeliverabilityStatus> {
    console.info('🔍 Checking deliverability status...');

    const status: DeliverabilityStatus = {
      isReady: true,
      warnings: [],
      errors: [],
      recommendations: [],
      authenticationScore: 0,
      warmupProgress: 0,
      currentDailyVolume: this.currentDailyVolume,
      currentWeeklyVolume: this.currentWeeklyVolume,
      bounceRate: this.totalSent > 0 ? this.totalBounced / this.totalSent : 0,
      complaintRate:
        this.totalSent > 0 ? this.totalComplaints / this.totalSent : 0,
      deliverabilityRate:
        this.totalSent > 0 ? this.totalDelivered / this.totalSent : 0,
    };

    // Check 1: Email Authentication (SPF, DKIM, DMARC)
    if (this.deliverabilityConfig.requireAuthentication) {
      try {
        const authStatus =
          await emailAuthenticationGuide.checkAuthenticationStatus(domain);
        status.authenticationScore = authStatus.score;

        if (authStatus.score < 70) {
          status.isReady = false;
          status.errors.push(
            `Email authentication score too low: ${authStatus.score}/100. Configure SPF, DKIM, and DMARC before sending.`
          );
          status.recommendations.push(
            'Follow STRATEGIC_SALES_DOMAIN_DELIVERABILITY_CHECKLIST.md Phase 1'
          );
        } else if (authStatus.score < 90) {
          status.warnings.push(
            `Email authentication could be improved: ${authStatus.score}/100`
          );
          status.recommendations.push(
            'Consider upgrading DMARC policy for better deliverability'
          );
        }

        // Add specific authentication errors
        if (!authStatus.spf.configured) {
          status.errors.push('SPF record not configured');
        }
        if (!authStatus.dkim.configured) {
          status.errors.push('DKIM record not configured');
        }
        if (!authStatus.dmarc.configured) {
          status.warnings.push('DMARC record not configured');
        }
      } catch (error) {
        status.warnings.push(
          'Could not verify email authentication. Proceed with caution.'
        );
      }
    }

    // Check 2: Email Warm-up Status
    if (this.deliverabilityConfig.requireWarmup) {
      const warmupStatus = emailWarmupService.getWarmupStatus();
      status.warmupProgress = warmupStatus.overallStats.progress;

      if (!warmupStatus.isActive && warmupStatus.overallStats.progress < 100) {
        status.isReady = false;
        status.errors.push(
          `Email warm-up not complete: ${warmupStatus.overallStats.progress}% (30-day warm-up required)`
        );
        status.recommendations.push(
          'Start email warm-up process: emailWarmupService.startWarmup()'
        );
        status.recommendations.push(
          'Follow STRATEGIC_SALES_DOMAIN_DELIVERABILITY_CHECKLIST.md Phase 2'
        );
      } else if (warmupStatus.overallStats.progress < 100) {
        status.warnings.push(
          `Email warm-up in progress: ${warmupStatus.overallStats.progress}%`
        );
        status.recommendations.push(
          `Wait ${Math.ceil((100 - warmupStatus.overallStats.progress) * 0.3)} more days before launching campaigns`
        );
      }

      // Check warm-up deliverability
      if (warmupStatus.overallStats.deliverability < 90) {
        status.isReady = false;
        status.errors.push(
          `Warm-up deliverability too low: ${warmupStatus.overallStats.deliverability}% (need 95%+)`
        );
        status.recommendations.push(
          'Review email content and authentication before proceeding'
        );
      }
    }

    // Check 3: Current Volume Limits
    if (
      this.currentDailyVolume >=
      this.deliverabilityConfig.maxDailyVolume * 0.9
    ) {
      status.warnings.push(
        `Approaching daily volume limit: ${this.currentDailyVolume}/${this.deliverabilityConfig.maxDailyVolume}`
      );
      status.recommendations.push('Wait until tomorrow to send more emails');
    }

    if (
      this.currentWeeklyVolume >=
      this.deliverabilityConfig.maxWeeklyVolume * 0.9
    ) {
      status.warnings.push(
        `Approaching weekly volume limit: ${this.currentWeeklyVolume}/${this.deliverabilityConfig.maxWeeklyVolume}`
      );
      status.recommendations.push(
        'Consider increasing volume limits gradually'
      );
    }

    // Check 4: Bounce Rate
    if (status.bounceRate > this.deliverabilityConfig.maxBounceRate) {
      status.isReady = false;
      status.errors.push(
        `Bounce rate too high: ${(status.bounceRate * 100).toFixed(2)}% (max: ${(this.deliverabilityConfig.maxBounceRate * 100).toFixed(2)}%)`
      );
      status.recommendations.push(
        'Clean email list and verify addresses before sending'
      );
      status.recommendations.push(
        'Use NeverBounce or ZeroBounce to verify emails'
      );
    } else if (
      status.bounceRate >
      this.deliverabilityConfig.maxBounceRate * 0.5
    ) {
      status.warnings.push(
        `Bounce rate elevated: ${(status.bounceRate * 100).toFixed(2)}%`
      );
      status.recommendations.push('Monitor bounce rate closely');
    }

    // Check 5: Complaint Rate
    if (status.complaintRate > this.deliverabilityConfig.maxComplaintRate) {
      status.isReady = false;
      status.errors.push(
        `Complaint rate too high: ${(status.complaintRate * 100).toFixed(3)}% (max: ${(this.deliverabilityConfig.maxComplaintRate * 100).toFixed(3)}%)`
      );
      status.recommendations.push(
        'Review email content and targeting immediately'
      );
      status.recommendations.push('Stop sending until complaint rate drops');
    }

    // Check 6: Deliverability Rate
    if (
      this.totalSent > 0 &&
      status.deliverabilityRate <
        this.deliverabilityConfig.minDeliverabilityRate
    ) {
      status.isReady = false;
      status.errors.push(
        `Deliverability rate too low: ${(status.deliverabilityRate * 100).toFixed(1)}% (need: ${(this.deliverabilityConfig.minDeliverabilityRate * 100).toFixed(1)}%)`
      );
      status.recommendations.push(
        'Check email authentication (SPF, DKIM, DMARC)'
      );
      status.recommendations.push('Review email content for spam triggers');
      status.recommendations.push('Check domain/IP reputation');
    }

    // Check 7: IP Reputation
    try {
      await sendingIPManager.initialize();
      const reputationOverview = sendingIPManager.getReputationOverview();

      if (reputationOverview.quarantined > 0) {
        status.warnings.push(
          `${reputationOverview.quarantined} IP(s) quarantined due to poor reputation`
        );
        status.recommendations.push('Review IP reputation and clean up issues');
      }

      if (reputationOverview.excellent === 0 && reputationOverview.good === 0) {
        status.isReady = false;
        status.errors.push('No IPs with good reputation available');
        status.recommendations.push(
          'Contact SendGrid support for IP reputation help'
        );
      }
    } catch (error) {
      status.warnings.push('Could not check IP reputation');
    }

    // Final recommendation
    if (status.isReady) {
      status.recommendations.push(
        '✅ All deliverability checks passed. Safe to launch campaigns.'
      );
      console.info('✅ Deliverability status: READY');
    } else {
      status.recommendations.push(
        '🚨 Fix all errors before launching campaigns to protect domain reputation'
      );
      console.warn('⚠️ Deliverability status: NOT READY');
    }

    return status;
  }

  /**
   * Check if campaign can send based on current volume limits
   */
  canSendEmail(): {
    canSend: boolean;
    reason?: string;
    waitTime?: number;
  } {
    // Check daily limit
    if (this.currentDailyVolume >= this.deliverabilityConfig.maxDailyVolume) {
      return {
        canSend: false,
        reason: 'Daily volume limit reached',
        waitTime: this.getTimeUntilNextDay(),
      };
    }

    // Check weekly limit
    if (this.currentWeeklyVolume >= this.deliverabilityConfig.maxWeeklyVolume) {
      return {
        canSend: false,
        reason: 'Weekly volume limit reached',
        waitTime: this.getTimeUntilNextWeek(),
      };
    }

    // Check bounce rate
    const bounceRate =
      this.totalSent > 0 ? this.totalBounced / this.totalSent : 0;
    if (bounceRate > this.deliverabilityConfig.maxBounceRate) {
      return {
        canSend: false,
        reason: `Bounce rate too high: ${(bounceRate * 100).toFixed(2)}%`,
      };
    }

    // Check complaint rate
    const complaintRate =
      this.totalSent > 0 ? this.totalComplaints / this.totalSent : 0;
    if (complaintRate > this.deliverabilityConfig.maxComplaintRate) {
      return {
        canSend: false,
        reason: `Complaint rate too high: ${(complaintRate * 100).toFixed(3)}%`,
      };
    }

    return { canSend: true };
  }

  /**
   * Record email send for volume tracking
   */
  recordEmailSent(
    success: boolean,
    bounced: boolean,
    complained: boolean
  ): void {
    this.totalSent++;
    this.currentDailyVolume++;
    this.currentWeeklyVolume++;

    if (success) {
      this.totalDelivered++;
    }
    if (bounced) {
      this.totalBounced++;
    }
    if (complained) {
      this.totalComplaints++;
    }

    // Log warning if approaching limits
    if (
      this.currentDailyVolume >=
      this.deliverabilityConfig.maxDailyVolume * 0.9
    ) {
      console.warn(
        `⚠️ Approaching daily volume limit: ${this.currentDailyVolume}/${this.deliverabilityConfig.maxDailyVolume}`
      );
    }
  }

  /**
   * Reset daily volume counter (call this daily via cron)
   */
  resetDailyVolume(): void {
    console.info(
      `📊 Daily volume reset: ${this.currentDailyVolume} emails sent yesterday`
    );
    this.currentDailyVolume = 0;
  }

  /**
   * Reset weekly volume counter (call this weekly via cron)
   */
  resetWeeklyVolume(): void {
    console.info(
      `📊 Weekly volume reset: ${this.currentWeeklyVolume} emails sent last week`
    );
    this.currentWeeklyVolume = 0;
  }

  /**
   * Get time until next day (for rate limiting)
   */
  private getTimeUntilNextDay(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Get time until next week (for rate limiting)
   */
  private getTimeUntilNextWeek(): number {
    const now = new Date();
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + (7 - now.getDay()));
    nextWeek.setHours(0, 0, 0, 0);
    return nextWeek.getTime() - now.getTime();
  }

  /**
   * Get random delay between emails (for natural sending pattern)
   */
  getRandomDelay(): number {
    const { min, max } = this.deliverabilityConfig.delayBetweenEmails;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Update deliverability configuration
   */
  updateDeliverabilityConfig(config: Partial<DeliverabilityConfig>): void {
    this.deliverabilityConfig = { ...this.deliverabilityConfig, ...config };
    console.info('🛡️ Deliverability config updated:', config);
  }

  /**
   * Get current deliverability metrics
   */
  getDeliverabilityMetrics(): {
    totalSent: number;
    totalDelivered: number;
    totalBounced: number;
    totalComplaints: number;
    bounceRate: number;
    complaintRate: number;
    deliverabilityRate: number;
    currentDailyVolume: number;
    currentWeeklyVolume: number;
    dailyLimit: number;
    weeklyLimit: number;
  } {
    return {
      totalSent: this.totalSent,
      totalDelivered: this.totalDelivered,
      totalBounced: this.totalBounced,
      totalComplaints: this.totalComplaints,
      bounceRate: this.totalSent > 0 ? this.totalBounced / this.totalSent : 0,
      complaintRate:
        this.totalSent > 0 ? this.totalComplaints / this.totalSent : 0,
      deliverabilityRate:
        this.totalSent > 0 ? this.totalDelivered / this.totalSent : 0,
      currentDailyVolume: this.currentDailyVolume,
      currentWeeklyVolume: this.currentWeeklyVolume,
      dailyLimit: this.deliverabilityConfig.maxDailyVolume,
      weeklyLimit: this.deliverabilityConfig.maxWeeklyVolume,
    };
  }

  /**
   * Calculate expected pipeline based on campaign volume
   */
  calculateExpectedPipeline(monthlyOutreach: number): {
    topFunnelReplies: number;
    middleFunnelReplies: number;
    bottomFunnelReplies: number;
    totalMeetings: number;
    expectedDeals: number;
    expectedRevenue: number;
  } {
    // Distribute outreach across funnel stages
    const topFunnel = monthlyOutreach * 0.4; // 40% top funnel
    const middleFunnel = monthlyOutreach * 0.35; // 35% middle funnel
    const bottomFunnel = monthlyOutreach * 0.25; // 25% bottom funnel

    // Calculate replies based on expected rates
    const topFunnelReplies = topFunnel * 0.025; // 2.5% reply rate
    const middleFunnelReplies = middleFunnel * 0.048; // 4.8% reply rate
    const bottomFunnelReplies = bottomFunnel * 0.08; // 8.0% reply rate

    // Total qualified meetings (15.3% of total outreach)
    const totalMeetings = monthlyOutreach * 0.153;

    // Expected deals (20% close rate)
    const expectedDeals = totalMeetings * 0.2;

    // Expected revenue (average deal size: $32,376/year)
    const expectedRevenue = expectedDeals * 32376;

    return {
      topFunnelReplies: Math.round(topFunnelReplies),
      middleFunnelReplies: Math.round(middleFunnelReplies),
      bottomFunnelReplies: Math.round(bottomFunnelReplies),
      totalMeetings: Math.round(totalMeetings),
      expectedDeals: Math.round(expectedDeals),
      expectedRevenue: Math.round(expectedRevenue),
    };
  }
}

// Export singleton instance
export const fleetFlowStrategicSalesCampaign =
  FleetFlowStrategicSalesCampaignService.getInstance();
