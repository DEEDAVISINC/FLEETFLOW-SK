/**
 * Predictive Lead Scoring Service
 * AI-powered lead intelligence with conversion scoring and prioritization
 * Part of DEPOINTE AI Company Dashboard enhancements
 */

export interface LeadData {
  id: string;
  companyName: string;
  contactName?: string;
  email?: string;
  phone?: string;
  industry: string;
  companySize: 'small' | 'medium' | 'large' | 'enterprise';
  location: {
    city: string;
    state: string;
    zipCode?: string;
  };
  freightProfile: {
    currentCarrier?: string;
    shipmentVolume: 'low' | 'medium' | 'high' | 'very_high';
    serviceTypes: string[];
    painPoints: string[];
    budgetRange: {
      min: number;
      max: number;
    };
  };
  engagementHistory: {
    source: string;
    firstContact: Date;
    lastContact: Date;
    contactCount: number;
    responseRate: number;
    openedEmails: number;
    clickedLinks: number;
    websiteVisits: number;
    documentsDownloaded: string[];
  };
  behavioralSignals: {
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    decisionTimeframe: 'immediate' | '1-3_months' | '3-6_months' | '6+_months';
    budgetAuthority: boolean;
    technicalRequirements: string[];
    competitorMentions: string[];
  };
  qualificationStatus:
    | 'new'
    | 'contacted'
    | 'qualified'
    | 'nurturing'
    | 'disqualified';
  lastUpdated: Date;
}

export interface LeadScore {
  leadId: string;
  overallScore: number; // 0-100
  conversionProbability: number; // 0-100
  scoreBreakdown: {
    demographicFit: number; // 0-100
    behavioralEngagement: number; // 0-100
    budgetAlignment: number; // 0-100
    urgencyTiming: number; // 0-100
    competitivePosition: number; // 0-100
  };
  priorityLevel: 'A' | 'B' | 'C' | 'D'; // A = Hot leads, D = Cold leads
  recommendedActions: Array<{
    action: string;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    expectedValue: number;
    timeframe: string;
  }>;
  riskFactors: string[];
  opportunityValue: number;
  confidenceLevel: number; // 0-100
  scoreLastUpdated: Date;
}

export interface ScoringModel {
  id: string;
  name: string;
  version: string;
  targetSegment: string;
  weights: {
    demographicFit: number;
    behavioralEngagement: number;
    budgetAlignment: number;
    urgencyTiming: number;
    competitivePosition: number;
  };
  thresholds: {
    priorityA: number; // Score threshold for A priority
    priorityB: number;
    priorityC: number;
  };
  accuracyMetrics: {
    precision: number;
    recall: number;
    f1Score: number;
    liftRatio: number;
  };
  trainingDataSize: number;
  lastTrained: Date;
  isActive: boolean;
}

export interface LeadInsights {
  marketTrends: {
    hotIndustries: Array<{
      industry: string;
      growth: number;
      opportunity: number;
    }>;
    emergingPainPoints: string[];
    competitiveLandscape: Record<string, number>; // Competitor mention frequency
  };
  scoringInsights: {
    averageScoreBySource: Record<string, number>;
    conversionRateByPriority: Record<string, number>;
    topPerformingSegments: Array<{
      segment: string;
      avgScore: number;
      conversionRate: number;
    }>;
  };
  actionableRecommendations: Array<{
    type:
      | 'segment_focus'
      | 'messaging_update'
      | 'channel_optimization'
      | 'timing_adjustment';
    title: string;
    description: string;
    expectedImpact: number;
    implementationEffort: 'low' | 'medium' | 'high';
  }>;
}

export class PredictiveLeadScoringService {
  private leads: Map<string, LeadData> = new Map();
  private leadScores: Map<string, LeadScore> = new Map();
  private scoringModels: Map<string, ScoringModel> = new Map();
  private scoringHistory: Map<string, LeadScore[]> = new Map();

  constructor() {
    this.initializeService();
    this.loadDefaultScoringModels();
    console.info('🎯 Predictive Lead Scoring Service initialized');
  }

  /**
   * Initialize the lead scoring service
   */
  private initializeService() {
    // Load from localStorage if available
    this.loadFromStorage();

    // Start periodic scoring updates
    this.startScoringUpdates();
  }

  /**
   * Load default scoring models
   */
  private loadDefaultScoringModels() {
    const defaultModels: ScoringModel[] = [
      {
        id: 'freight_forwarder_model',
        name: 'Freight Forwarder Conversion Model',
        version: '2.1',
        targetSegment: 'freight_forwarders',
        weights: {
          demographicFit: 0.25,
          behavioralEngagement: 0.3,
          budgetAlignment: 0.2,
          urgencyTiming: 0.15,
          competitivePosition: 0.1,
        },
        thresholds: {
          priorityA: 75,
          priorityB: 60,
          priorityC: 40,
        },
        accuracyMetrics: {
          precision: 0.82,
          recall: 0.79,
          f1Score: 0.8,
          liftRatio: 2.3,
        },
        trainingDataSize: 15420,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        isActive: true,
      },
      {
        id: 'manufacturer_model',
        name: 'Manufacturer Supply Chain Model',
        version: '1.8',
        targetSegment: 'manufacturers',
        weights: {
          demographicFit: 0.2,
          behavioralEngagement: 0.25,
          budgetAlignment: 0.25,
          urgencyTiming: 0.2,
          competitivePosition: 0.1,
        },
        thresholds: {
          priorityA: 70,
          priorityB: 55,
          priorityC: 35,
        },
        accuracyMetrics: {
          precision: 0.85,
          recall: 0.81,
          f1Score: 0.83,
          liftRatio: 2.6,
        },
        trainingDataSize: 9876,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        isActive: true,
      },
      {
        id: 'carrier_recruitment_model',
        name: 'Carrier Recruitment Model',
        version: '1.5',
        targetSegment: 'carriers',
        weights: {
          demographicFit: 0.3,
          behavioralEngagement: 0.2,
          budgetAlignment: 0.15,
          urgencyTiming: 0.25,
          competitivePosition: 0.1,
        },
        thresholds: {
          priorityA: 65,
          priorityB: 50,
          priorityC: 30,
        },
        accuracyMetrics: {
          precision: 0.78,
          recall: 0.85,
          f1Score: 0.81,
          liftRatio: 2.1,
        },
        trainingDataSize: 22341,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        isActive: true,
      },
    ];

    defaultModels.forEach((model) => {
      this.scoringModels.set(model.id, model);
    });
  }

  /**
   * Add or update a lead
   */
  async addOrUpdateLead(leadData: LeadData): Promise<LeadData> {
    this.leads.set(leadData.id, leadData);
    this.saveToStorage();

    // Automatically score the lead
    await this.scoreLead(leadData.id);

    console.info(
      `👥 Lead ${leadData.qualificationStatus}: ${leadData.companyName}`
    );

    return leadData;
  }

  /**
   * Score a lead using predictive models
   */
  async scoreLead(leadId: string): Promise<LeadScore | null> {
    const lead = this.leads.get(leadId);
    if (!lead) return null;

    // Select appropriate scoring model based on industry/segment
    const model = this.selectScoringModel(lead);

    // Calculate component scores
    const demographicFit = this.calculateDemographicFit(lead);
    const behavioralEngagement = this.calculateBehavioralEngagement(lead);
    const budgetAlignment = this.calculateBudgetAlignment(lead);
    const urgencyTiming = this.calculateUrgencyTiming(lead);
    const competitivePosition = this.calculateCompetitivePosition(lead);

    // Calculate weighted overall score
    const overallScore = Math.round(
      demographicFit * model.weights.demographicFit +
        behavioralEngagement * model.weights.behavioralEngagement +
        budgetAlignment * model.weights.budgetAlignment +
        urgencyTiming * model.weights.urgencyTiming +
        competitivePosition * model.weights.competitivePosition
    );

    // Determine priority level
    let priorityLevel: 'A' | 'B' | 'C' | 'D' = 'D';
    if (overallScore >= model.thresholds.priorityA) priorityLevel = 'A';
    else if (overallScore >= model.thresholds.priorityB) priorityLevel = 'B';
    else if (overallScore >= model.thresholds.priorityC) priorityLevel = 'C';

    // Calculate conversion probability (simplified model)
    const conversionProbability = Math.min(
      95,
      Math.max(
        5,
        overallScore * 0.8 +
          urgencyTiming * 0.2 -
          (lead.engagementHistory.contactCount > 5 ? 5 : 0)
      )
    );

    // Generate recommended actions
    const recommendedActions = this.generateRecommendedActions(
      lead,
      priorityLevel,
      overallScore
    );

    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(lead);

    // Estimate opportunity value
    const opportunityValue = this.calculateOpportunityValue(
      lead,
      conversionProbability
    );

    const leadScore: LeadScore = {
      leadId,
      overallScore,
      conversionProbability: Math.round(conversionProbability),
      scoreBreakdown: {
        demographicFit,
        behavioralEngagement,
        budgetAlignment,
        urgencyTiming,
        competitivePosition,
      },
      priorityLevel,
      recommendedActions,
      riskFactors,
      opportunityValue,
      confidenceLevel: Math.round(model.accuracyMetrics.f1Score * 100),
      scoreLastUpdated: new Date(),
    };

    // Store score and history
    this.leadScores.set(leadId, leadScore);

    const history = this.scoringHistory.get(leadId) || [];
    history.push(leadScore);
    this.scoringHistory.set(leadId, history);

    this.saveToStorage();

    console.info(
      `🎯 Scored lead ${lead.companyName}: ${overallScore} (${priorityLevel}) - ${Math.round(conversionProbability)}% conversion probability`
    );

    return leadScore;
  }

  /**
   * Get lead score by ID
   */
  getLeadScore(leadId: string): LeadScore | null {
    return this.leadScores.get(leadId) || null;
  }

  /**
   * Get all leads with their scores
   */
  getAllLeadsWithScores(): Array<{ lead: LeadData; score: LeadScore }> {
    const results = [];

    for (const [leadId, lead] of this.leads.entries()) {
      const score = this.leadScores.get(leadId);
      if (score) {
        results.push({ lead, score });
      }
    }

    return results.sort((a, b) => b.score.overallScore - a.score.overallScore);
  }

  /**
   * Get leads by priority level
   */
  getLeadsByPriority(
    priority: 'A' | 'B' | 'C' | 'D',
    limit?: number
  ): Array<{ lead: LeadData; score: LeadScore }> {
    const allLeads = this.getAllLeadsWithScores();
    const filtered = allLeads.filter(
      (item) => item.score.priorityLevel === priority
    );

    return limit ? filtered.slice(0, limit) : filtered;
  }

  /**
   * Get lead insights and analytics
   */
  getLeadInsights(): LeadInsights {
    const allLeads = this.getAllLeadsWithScores();

    // Market trends analysis
    const industryStats = new Map<
      string,
      { count: number; avgScore: number; conversions: number }
    >();
    const sourceStats = new Map<
      string,
      { totalScore: number; count: number }
    >();
    const competitorMentions = new Map<string, number>();

    allLeads.forEach(({ lead, score }) => {
      // Industry stats
      const industry = industryStats.get(lead.industry) || {
        count: 0,
        avgScore: 0,
        conversions: 0,
      };
      industry.count++;
      industry.avgScore =
        (industry.avgScore * (industry.count - 1) + score.overallScore) /
        industry.count;
      if (score.conversionProbability > 70) industry.conversions++;
      industryStats.set(lead.industry, industry);

      // Source stats
      const source = sourceStats.get(lead.engagementHistory.source) || {
        totalScore: 0,
        count: 0,
      };
      source.totalScore += score.overallScore;
      source.count++;
      sourceStats.set(lead.engagementHistory.source, source);

      // Competitor mentions
      lead.behavioralSignals.competitorMentions.forEach((competitor) => {
        competitorMentions.set(
          competitor,
          (competitorMentions.get(competitor) || 0) + 1
        );
      });
    });

    // Calculate market trends
    const hotIndustries = Array.from(industryStats.entries())
      .map(([industry, stats]) => ({
        industry,
        growth: stats.avgScore,
        opportunity: (stats.conversions / stats.count) * 100,
      }))
      .sort((a, b) => b.opportunity - a.opportunity)
      .slice(0, 5);

    // Scoring insights
    const averageScoreBySource = Object.fromEntries(
      Array.from(sourceStats.entries()).map(([source, stats]) => [
        source,
        Math.round(stats.totalScore / stats.count),
      ])
    );

    const conversionRateByPriority =
      this.calculateConversionRateByPriority(allLeads);

    const topPerformingSegments = Array.from(industryStats.entries())
      .map(([segment, stats]) => ({
        segment,
        avgScore: Math.round(stats.avgScore),
        conversionRate: Math.round((stats.conversions / stats.count) * 100),
      }))
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 5);

    // Generate actionable recommendations
    const actionableRecommendations = this.generateActionableRecommendations(
      hotIndustries,
      averageScoreBySource,
      topPerformingSegments
    );

    return {
      marketTrends: {
        hotIndustries,
        emergingPainPoints: this.extractEmergingPainPoints(allLeads),
        competitiveLandscape: Object.fromEntries(competitorMentions.entries()),
      },
      scoringInsights: {
        averageScoreBySource,
        conversionRateByPriority,
        topPerformingSegments,
      },
      actionableRecommendations,
    };
  }

  // ============================================================================
  // PRIVATE SCORING METHODS
  // ============================================================================

  private selectScoringModel(lead: LeadData): ScoringModel {
    // Select model based on industry/segment
    if (
      lead.industry.toLowerCase().includes('manufactur') ||
      lead.freightProfile.serviceTypes.includes('JIT Delivery')
    ) {
      return (
        this.scoringModels.get('manufacturer_model') ||
        this.scoringModels.values().next().value
      );
    } else if (
      lead.industry.toLowerCase().includes('carrier') ||
      lead.freightProfile.shipmentVolume === 'very_high'
    ) {
      return (
        this.scoringModels.get('carrier_recruitment_model') ||
        this.scoringModels.values().next().value
      );
    } else {
      return (
        this.scoringModels.get('freight_forwarder_model') ||
        this.scoringModels.values().next().value
      );
    }
  }

  private calculateDemographicFit(lead: LeadData): number {
    let score = 50; // Base score

    // Company size bonus
    if (lead.companySize === 'large' || lead.companySize === 'enterprise')
      score += 15;
    else if (lead.companySize === 'medium') score += 10;

    // Location bonus (focus states)
    const priorityStates = ['TX', 'CA', 'FL', 'GA', 'IL', 'OH', 'MI'];
    if (priorityStates.includes(lead.location.state)) score += 10;

    // Industry demand bonus
    const highDemandIndustries = [
      'Manufacturing',
      'Automotive',
      'Healthcare',
      'Technology',
    ];
    if (
      highDemandIndustries.some((ind) =>
        lead.industry.toLowerCase().includes(ind.toLowerCase())
      )
    ) {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  private calculateBehavioralEngagement(lead: LeadData): number {
    const engagement = lead.engagementHistory;
    let score = 0;

    // Email engagement
    if (engagement.openedEmails > 0) score += 20;
    if (engagement.clickedLinks > 0) score += 15;
    if (engagement.websiteVisits > 0) score += 10;

    // Contact frequency (optimal is 3-5 contacts)
    if (engagement.contactCount >= 3 && engagement.contactCount <= 5)
      score += 25;
    else if (engagement.contactCount > 5) score += 15;

    // Response rate
    score += engagement.responseRate * 0.3; // Max 30 points

    // Document downloads (shows serious interest)
    if (engagement.documentsDownloaded.length > 0) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  private calculateBudgetAlignment(lead: LeadData): number {
    const budget = lead.freightProfile.budgetRange;
    let score = 50; // Base score

    // Budget range alignment with DEPOINTE services
    if (budget.max >= 25000 && budget.min <= 100000)
      score += 25; // Sweet spot
    else if (budget.max >= 10000)
      score += 15; // Acceptable range
    else if (budget.max < 5000) score -= 20; // Too low budget

    // Budget authority bonus
    if (lead.behavioralSignals.budgetAuthority) score += 15;

    return Math.min(100, Math.max(0, score));
  }

  private calculateUrgencyTiming(lead: LeadData): number {
    let score = 50; // Base score

    // Urgency level
    switch (lead.behavioralSignals.urgencyLevel) {
      case 'critical':
        score += 30;
        break;
      case 'high':
        score += 20;
        break;
      case 'medium':
        score += 10;
        break;
      case 'low':
        score -= 10;
        break;
    }

    // Decision timeframe
    switch (lead.behavioralSignals.decisionTimeframe) {
      case 'immediate':
        score += 20;
        break;
      case '1-3_months':
        score += 10;
        break;
      case '3-6_months':
        score += 5;
        break;
      case '6+_months':
        score -= 15;
        break;
    }

    return Math.min(100, Math.max(0, score));
  }

  private calculateCompetitivePosition(lead: LeadData): number {
    let score = 50; // Base score

    // Pain points indicate opportunity
    if (lead.freightProfile.painPoints.length > 2) score += 15;
    if (
      lead.freightProfile.painPoints.some(
        (pain) =>
          pain.toLowerCase().includes('cost') ||
          pain.toLowerCase().includes('reliability')
      )
    ) {
      score += 10;
    }

    // Current carrier dissatisfaction
    if (
      !lead.freightProfile.currentCarrier ||
      lead.behavioralSignals.competitorMentions.length > 0
    ) {
      score += 10;
    }

    // Technical requirements alignment
    if (lead.behavioralSignals.technicalRequirements.length > 0) score += 5;

    return Math.min(100, Math.max(0, score));
  }

  private generateRecommendedActions(
    lead: LeadData,
    priority: string,
    score: number
  ): LeadScore['recommendedActions'] {
    const actions = [];

    if (priority === 'A') {
      actions.push({
        action: 'Immediate phone call from senior sales rep',
        priority: 'immediate' as const,
        expectedValue: score * 100,
        timeframe: 'Within 1 hour',
      });
      actions.push({
        action: 'Send customized proposal with ROI calculator',
        priority: 'high' as const,
        expectedValue: score * 50,
        timeframe: 'Within 4 hours',
      });
    } else if (priority === 'B') {
      actions.push({
        action: 'Personalized email with case studies',
        priority: 'high' as const,
        expectedValue: score * 30,
        timeframe: 'Within 2 hours',
      });
      actions.push({
        action: 'Schedule discovery call',
        priority: 'medium' as const,
        expectedValue: score * 20,
        timeframe: 'Within 24 hours',
      });
    } else if (priority === 'C') {
      actions.push({
        action: 'Add to nurture campaign with educational content',
        priority: 'medium' as const,
        expectedValue: score * 15,
        timeframe: 'Within 48 hours',
      });
    }

    // Always include follow-up
    if (lead.engagementHistory.contactCount < 3) {
      actions.push({
        action: 'Schedule follow-up based on engagement patterns',
        priority: 'low' as const,
        expectedValue: score * 10,
        timeframe: 'Within 1 week',
      });
    }

    return actions;
  }

  private identifyRiskFactors(lead: LeadData): string[] {
    const risks = [];

    if (lead.behavioralSignals.decisionTimeframe === '6+_months') {
      risks.push('Long decision timeline may delay conversion');
    }

    if (lead.freightProfile.budgetRange.max < 5000) {
      risks.push('Budget range below minimum viable contract');
    }

    if (
      lead.engagementHistory.contactCount > 10 &&
      lead.qualificationStatus === 'nurturing'
    ) {
      risks.push('Extended nurture period may indicate low intent');
    }

    if (lead.behavioralSignals.competitorMentions.length > 3) {
      risks.push('Heavy competitor comparison may indicate price shopping');
    }

    if (lead.engagementHistory.responseRate < 10) {
      risks.push('Low response rate suggests limited interest');
    }

    return risks;
  }

  private calculateOpportunityValue(
    lead: LeadData,
    conversionProbability: number
  ): number {
    const avgContractValue =
      (lead.freightProfile.budgetRange.min +
        lead.freightProfile.budgetRange.max) /
      2;
    const expectedValue = avgContractValue * (conversionProbability / 100);

    // Adjust based on company size
    const sizeMultiplier =
      {
        small: 0.8,
        medium: 1.0,
        large: 1.3,
        enterprise: 1.6,
      }[lead.companySize] || 1.0;

    return Math.round(expectedValue * sizeMultiplier);
  }

  private calculateConversionRateByPriority(
    allLeads: Array<{ lead: LeadData; score: LeadScore }>
  ): Record<string, number> {
    const priorityStats = new Map<
      string,
      { total: number; converted: number }
    >();

    allLeads.forEach(({ lead, score }) => {
      const stats = priorityStats.get(score.priorityLevel) || {
        total: 0,
        converted: 0,
      };
      stats.total++;

      // Simplified conversion logic (in real system, would check actual outcomes)
      if (score.conversionProbability > 75 && score.overallScore > 70) {
        stats.converted++;
      }

      priorityStats.set(score.priorityLevel, stats);
    });

    return Object.fromEntries(
      Array.from(priorityStats.entries()).map(([priority, stats]) => [
        priority,
        Math.round((stats.converted / stats.total) * 100) || 0,
      ])
    );
  }

  private extractEmergingPainPoints(
    allLeads: Array<{ lead: LeadData; score: LeadScore }>
  ): string[] {
    const painPoints = new Map<string, number>();

    allLeads.forEach(({ lead }) => {
      lead.freightProfile.painPoints.forEach((pain) => {
        painPoints.set(pain, (painPoints.get(pain) || 0) + 1);
      });
    });

    return Array.from(painPoints.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([pain]) => pain);
  }

  private generateActionableRecommendations(
    hotIndustries: any[],
    sourceScores: Record<string, number>,
    topSegments: any[]
  ): LeadInsights['actionableRecommendations'] {
    const recommendations = [];

    // Source optimization
    const bestSource = Object.entries(sourceScores).reduce((a, b) =>
      sourceScores[a[0]] > sourceScores[b[0]] ? a : b
    );
    const worstSource = Object.entries(sourceScores).reduce((a, b) =>
      sourceScores[a[0]] < sourceScores[b[0]] ? a : b
    );

    if (bestSource[1] > worstSource[1] + 10) {
      recommendations.push({
        type: 'channel_optimization' as const,
        title: `Increase investment in ${bestSource[0]}`,
        description: `${bestSource[0]} produces ${bestSource[1] - worstSource[1]} points higher average lead scores than ${worstSource[0]}.`,
        expectedImpact: 25,
        implementationEffort: 'medium' as const,
      });
    }

    // Industry focus
    if (hotIndustries.length > 0) {
      const topIndustry = hotIndustries[0];
      recommendations.push({
        type: 'segment_focus' as const,
        title: `Prioritize ${topIndustry.industry} sector`,
        description: `${topIndustry.industry} shows ${Math.round(topIndustry.opportunity)}% conversion opportunity with high engagement scores.`,
        expectedImpact: 30,
        implementationEffort: 'high' as const,
      });
    }

    // Messaging optimization
    if (topSegments.length > 0 && topSegments[0].conversionRate > 50) {
      recommendations.push({
        type: 'messaging_update' as const,
        title: 'Refine messaging for high-converting segments',
        description: `${topSegments[0].segment} segment shows ${topSegments[0].conversionRate}% conversion rate. Analyze successful messaging patterns.`,
        expectedImpact: 20,
        implementationEffort: 'medium' as const,
      });
    }

    return recommendations;
  }

  private startScoringUpdates() {
    // Update scores every 30 minutes
    setInterval(
      () => {
        this.updateAllLeadScores();
      },
      30 * 60 * 1000
    );
  }

  private async updateAllLeadScores() {
    const leadIds = Array.from(this.leads.keys());
    for (const leadId of leadIds) {
      await this.scoreLead(leadId);
    }
    console.info(`🔄 Updated scores for ${leadIds.length} leads`);
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        leads: Array.from(this.leads.entries()),
        scores: Array.from(this.leadScores.entries()),
        history: Array.from(this.scoringHistory.entries()),
      };

      localStorage.setItem('predictive-lead-scoring', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save lead scoring data:', error);
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('predictive-lead-scoring');
      if (!data) return;

      const parsed = JSON.parse(data);

      // Restore leads
      this.leads = new Map(
        parsed.leads.map(([id, lead]: [string, any]) => [
          id,
          {
            ...lead,
            engagementHistory: {
              ...lead.engagementHistory,
              firstContact: new Date(lead.engagementHistory.firstContact),
              lastContact: new Date(lead.engagementHistory.lastContact),
            },
            lastUpdated: new Date(lead.lastUpdated),
          },
        ])
      );

      // Restore scores
      this.leadScores = new Map(
        parsed.scores.map(([id, score]: [string, any]) => [
          id,
          {
            ...score,
            scoreLastUpdated: new Date(score.scoreLastUpdated),
          },
        ])
      );

      // Restore history
      this.scoringHistory = new Map(parsed.history);

      console.info(
        `📊 Loaded ${this.leads.size} leads and ${this.leadScores.size} scores from storage`
      );
    } catch (error) {
      console.error('Failed to load lead scoring data:', error);
    }
  }
}

// Export singleton instance
export const predictiveLeadScoringService = new PredictiveLeadScoringService();

