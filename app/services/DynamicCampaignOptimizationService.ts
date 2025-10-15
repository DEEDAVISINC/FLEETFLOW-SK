/**
 * Dynamic Campaign Optimization Service
 * Real-time campaign performance adjustment based on results and market conditions
 * Part of DEPOINTE AI Company Dashboard enhancements
 */

export interface CampaignMetrics {
  campaignId: string;
  campaignName: string;
  targetType: string;
  startDate: Date;
  currentMetrics: {
    leadsGenerated: number;
    contactsReached: number;
    conversionRate: number;
    costPerLead: number;
    revenueGenerated: number;
    aiStaffUtilized: number;
    responseTime: number; // minutes
    engagementRate: number;
  };
  performanceTrends: {
    dailyLeadGrowth: number;
    conversionTrend: number;
    costTrend: number;
    efficiencyTrend: number;
  };
  marketConditions: {
    fuelPrice: number;
    fuelTrend: 'increasing' | 'decreasing' | 'stable';
    demandIndex: number; // 0-100 scale
    competitionLevel: 'low' | 'medium' | 'high';
    seasonalFactor: number; // 0.5-1.5 multiplier
  };
  optimizationRecommendations: OptimizationRecommendation[];
  lastOptimized: Date;
}

export interface OptimizationRecommendation {
  id: string;
  type:
    | 'staff_reallocation'
    | 'budget_adjustment'
    | 'targeting_refinement'
    | 'messaging_update'
    | 'timing_adjustment'
    | 'pause_campaign';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  expectedImpact: {
    revenueIncrease: number;
    costReduction: number;
    efficiencyGain: number;
  };
  implementation: {
    steps: string[];
    estimatedTime: number; // minutes
    riskLevel: 'low' | 'medium' | 'high';
  };
  applied: boolean;
  appliedAt?: Date;
  results?: {
    actualRevenueIncrease: number;
    actualCostReduction: number;
    actualEfficiencyGain: number;
  };
}

export interface CampaignPreset {
  id: string;
  name: string;
  targetType: string;
  baseStaffAllocation: number;
  baseBudget: number;
  optimalConditions: {
    demandIndex: { min: number; max: number };
    competitionLevel: 'low' | 'medium' | 'high';
    fuelTrend: 'increasing' | 'decreasing' | 'stable';
  };
  performanceThresholds: {
    minConversionRate: number;
    maxCostPerLead: number;
    targetEfficiency: number;
  };
}

export class DynamicCampaignOptimizationService {
  private activeCampaigns: Map<string, CampaignMetrics> = new Map();
  private campaignPresets: CampaignPreset[] = [];
  private optimizationHistory: Map<string, OptimizationRecommendation[]> =
    new Map();

  constructor() {
    this.initializeService();
    this.loadCampaignPresets();
    console.info('🎯 Dynamic Campaign Optimization Service initialized');
  }

  /**
   * Initialize the optimization service
   */
  private initializeService() {
    // Load from localStorage if available
    this.loadFromStorage();

    // Start optimization monitoring
    this.startOptimizationMonitoring();
  }

  /**
   * Load predefined campaign presets
   */
  private loadCampaignPresets() {
    this.campaignPresets = [
      {
        id: 'desperate_shippers_blitz',
        name: 'Desperate Shippers Blitz',
        targetType: 'desperate_shippers',
        baseStaffAllocation: 3,
        baseBudget: 150000,
        optimalConditions: {
          demandIndex: { min: 60, max: 100 },
          competitionLevel: 'medium',
          fuelTrend: 'increasing',
        },
        performanceThresholds: {
          minConversionRate: 25,
          maxCostPerLead: 150,
          targetEfficiency: 85,
        },
      },
      {
        id: 'manufacturing_giants',
        name: 'Manufacturing Giants',
        targetType: 'manufacturers',
        baseStaffAllocation: 2,
        baseBudget: 300000,
        optimalConditions: {
          demandIndex: { min: 40, max: 80 },
          competitionLevel: 'low',
          fuelTrend: 'stable',
        },
        performanceThresholds: {
          minConversionRate: 35,
          maxCostPerLead: 300,
          targetEfficiency: 75,
        },
      },
      {
        id: 'owner_operator_army',
        name: 'Owner Operator Army',
        targetType: 'owner_operators',
        baseStaffAllocation: 3,
        baseBudget: 120000,
        optimalConditions: {
          demandIndex: { min: 30, max: 70 },
          competitionLevel: 'high',
          fuelTrend: 'decreasing',
        },
        performanceThresholds: {
          minConversionRate: 20,
          maxCostPerLead: 100,
          targetEfficiency: 90,
        },
      },
      {
        id: 'safety_crisis_rescue',
        name: 'Safety Crisis Rescue',
        targetType: 'safety_violations',
        baseStaffAllocation: 2,
        baseBudget: 180000,
        optimalConditions: {
          demandIndex: { min: 70, max: 100 },
          competitionLevel: 'low',
          fuelTrend: 'increasing',
        },
        performanceThresholds: {
          minConversionRate: 30,
          maxCostPerLead: 200,
          targetEfficiency: 80,
        },
      },
    ];
  }

  /**
   * Start a new campaign with optimization monitoring
   */
  async startCampaign(
    campaignId: string,
    presetId: string,
    initialMetrics?: Partial<CampaignMetrics['currentMetrics']>
  ): Promise<CampaignMetrics> {
    const preset = this.campaignPresets.find((p) => p.id === presetId);
    if (!preset) {
      throw new Error(`Campaign preset ${presetId} not found`);
    }

    const campaign: CampaignMetrics = {
      campaignId,
      campaignName: preset.name,
      targetType: preset.targetType,
      startDate: new Date(),
      currentMetrics: {
        leadsGenerated: initialMetrics?.leadsGenerated || 0,
        contactsReached: initialMetrics?.contactsReached || 0,
        conversionRate: initialMetrics?.conversionRate || 0,
        costPerLead: initialMetrics?.costPerLead || 0,
        revenueGenerated: initialMetrics?.revenueGenerated || 0,
        aiStaffUtilized: preset.baseStaffAllocation,
        responseTime: initialMetrics?.responseTime || 0,
        engagementRate: initialMetrics?.engagementRate || 0,
      },
      performanceTrends: {
        dailyLeadGrowth: 0,
        conversionTrend: 0,
        costTrend: 0,
        efficiencyTrend: 0,
      },
      marketConditions: await this.getCurrentMarketConditions(),
      optimizationRecommendations: [],
      lastOptimized: new Date(),
    };

    this.activeCampaigns.set(campaignId, campaign);
    this.saveToStorage();

    console.info(
      `🚀 Started optimized campaign: ${campaign.campaignName} (${campaignId})`
    );

    return campaign;
  }

  /**
   * Update campaign metrics and trigger optimization analysis
   */
  async updateCampaignMetrics(
    campaignId: string,
    metrics: Partial<CampaignMetrics['currentMetrics']>
  ): Promise<CampaignMetrics | null> {
    const campaign = this.activeCampaigns.get(campaignId);
    if (!campaign) return null;

    // Update metrics
    Object.assign(campaign.currentMetrics, metrics);

    // Update market conditions
    campaign.marketConditions = await this.getCurrentMarketConditions();

    // Calculate performance trends
    campaign.performanceTrends = this.calculatePerformanceTrends(campaign);

    // Generate optimization recommendations
    campaign.optimizationRecommendations =
      await this.generateOptimizationRecommendations(campaign);

    campaign.lastOptimized = new Date();

    this.saveToStorage();

    console.info(
      `📊 Updated campaign metrics: ${campaign.campaignName} (${campaignId})`
    );

    return campaign;
  }

  /**
   * Get current market conditions (mock implementation)
   */
  private async getCurrentMarketConditions(): Promise<
    CampaignMetrics['marketConditions']
  > {
    // In production, this would fetch real market data
    return {
      fuelPrice: 4.25, // Current average diesel price
      fuelTrend:
        Math.random() > 0.6
          ? 'increasing'
          : Math.random() > 0.3
            ? 'stable'
            : 'decreasing',
      demandIndex: Math.floor(Math.random() * 40) + 40, // 40-80 range
      competitionLevel:
        Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
      seasonalFactor: 0.8 + Math.random() * 0.4, // 0.8-1.2 range
    };
  }

  /**
   * Calculate performance trends
   */
  private calculatePerformanceTrends(
    campaign: CampaignMetrics
  ): CampaignMetrics['performanceTrends'] {
    // Simplified trend calculation (would use historical data in production)
    const daysRunning = Math.max(
      1,
      (Date.now() - campaign.startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      dailyLeadGrowth: campaign.currentMetrics.leadsGenerated / daysRunning,
      conversionTrend: campaign.currentMetrics.conversionRate - 20, // Compare to baseline
      costTrend: campaign.currentMetrics.costPerLead - 150, // Compare to baseline
      efficiencyTrend:
        campaign.currentMetrics.aiStaffUtilized > 0
          ? campaign.currentMetrics.leadsGenerated /
            campaign.currentMetrics.aiStaffUtilized
          : 0,
    };
  }

  /**
   * Generate optimization recommendations
   */
  private async generateOptimizationRecommendations(
    campaign: CampaignMetrics
  ): Promise<OptimizationRecommendation[]> {
    const recommendations: OptimizationRecommendation[] = [];
    const preset = this.campaignPresets.find(
      (p) => p.targetType === campaign.targetType
    );

    if (!preset) return recommendations;

    // Performance-based recommendations
    if (
      campaign.currentMetrics.conversionRate <
      preset.performanceThresholds.minConversionRate
    ) {
      recommendations.push({
        id: `conv-${campaign.campaignId}-${Date.now()}`,
        type: 'messaging_update',
        priority: 'high',
        title: 'Optimize Messaging for Better Conversion',
        description: `Current conversion rate (${campaign.currentMetrics.conversionRate}%) is below target (${preset.performanceThresholds.minConversionRate}%). Consider updating outreach scripts and value propositions.`,
        expectedImpact: {
          revenueIncrease: campaign.currentMetrics.revenueGenerated * 0.25,
          costReduction: 0,
          efficiencyGain: 15,
        },
        implementation: {
          steps: [
            'Review current messaging scripts',
            'A/B test new value propositions',
            'Update call scripts based on successful patterns',
            'Train AI staff on new messaging approach',
          ],
          estimatedTime: 45,
          riskLevel: 'low',
        },
        applied: false,
      });
    }

    if (
      campaign.currentMetrics.costPerLead >
      preset.performanceThresholds.maxCostPerLead
    ) {
      recommendations.push({
        id: `cost-${campaign.campaignId}-${Date.now()}`,
        type: 'targeting_refinement',
        priority: 'high',
        title: 'Refine Target Criteria to Reduce Costs',
        description: `Current cost per lead ($${campaign.currentMetrics.costPerLead}) exceeds target ($${preset.performanceThresholds.maxCostPerLead}). Consider narrowing target criteria or improving qualification.`,
        expectedImpact: {
          revenueIncrease: 0,
          costReduction:
            campaign.currentMetrics.costPerLead *
            campaign.currentMetrics.leadsGenerated *
            0.2,
          efficiencyGain: 10,
        },
        implementation: {
          steps: [
            'Analyze lead sources and quality',
            'Update qualification criteria',
            'Focus on higher-converting segments',
            'Pause underperforming channels',
          ],
          estimatedTime: 30,
          riskLevel: 'low',
        },
        applied: false,
      });
    }

    // Market condition-based recommendations
    if (
      campaign.marketConditions.fuelTrend === 'increasing' &&
      campaign.targetType === 'desperate_shippers'
    ) {
      recommendations.push({
        id: `fuel-${campaign.campaignId}-${Date.now()}`,
        type: 'messaging_update',
        priority: 'medium',
        title: 'Emphasize Fuel Cost Savings',
        description:
          'Rising fuel prices create urgency for capacity solutions. Update messaging to highlight fuel cost savings and capacity reliability.',
        expectedImpact: {
          revenueIncrease: campaign.currentMetrics.revenueGenerated * 0.15,
          costReduction: 0,
          efficiencyGain: 8,
        },
        implementation: {
          steps: [
            'Update email templates with fuel cost messaging',
            'Train AI staff on fuel price talking points',
            'Create fuel savings calculator for prospects',
            'Add fuel surcharge transparency to proposals',
          ],
          estimatedTime: 60,
          riskLevel: 'low',
        },
        applied: false,
      });
    }

    // Competition-based recommendations
    if (
      campaign.marketConditions.competitionLevel === 'high' &&
      campaign.currentMetrics.efficiency <
        preset.performanceThresholds.targetEfficiency
    ) {
      recommendations.push({
        id: `comp-${campaign.campaignId}-${Date.now()}`,
        type: 'staff_reallocation',
        priority: 'medium',
        title: 'Increase AI Staff Allocation',
        description: `High competition level detected. Consider adding ${Math.ceil(preset.baseStaffAllocation * 0.5)} more AI staff to maintain efficiency.`,
        expectedImpact: {
          revenueIncrease: campaign.currentMetrics.revenueGenerated * 0.3,
          costReduction: 0,
          efficiencyGain: 25,
        },
        implementation: {
          steps: [
            'Assess available AI staff capacity',
            'Allocate additional staff to high-performing segments',
            'Monitor efficiency improvements',
            'Scale back if needed after 7 days',
          ],
          estimatedTime: 15,
          riskLevel: 'medium',
        },
        applied: false,
      });
    }

    // Demand-based recommendations
    if (
      campaign.marketConditions.demandIndex > 80 &&
      campaign.currentMetrics.responseTime > 60
    ) {
      recommendations.push({
        id: `demand-${campaign.campaignId}-${Date.now()}`,
        type: 'timing_adjustment',
        priority: 'critical',
        title: 'Accelerate Response Times - High Demand',
        description: `Demand index is high (${campaign.marketConditions.demandIndex}). Current response time (${campaign.currentMetrics.responseTime}min) is too slow for competitive advantage.`,
        expectedImpact: {
          revenueIncrease: campaign.currentMetrics.revenueGenerated * 0.4,
          costReduction: 0,
          efficiencyGain: 20,
        },
        implementation: {
          steps: [
            'Implement immediate response protocol',
            'Prioritize high-demand leads',
            'Add overnight shift coverage',
            'Set up automated initial responses',
          ],
          estimatedTime: 30,
          riskLevel: 'medium',
        },
        applied: false,
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Apply an optimization recommendation
   */
  async applyOptimizationRecommendation(
    campaignId: string,
    recommendationId: string
  ): Promise<boolean> {
    const campaign = this.activeCampaigns.get(campaignId);
    if (!campaign) return false;

    const recommendation = campaign.optimizationRecommendations.find(
      (r) => r.id === recommendationId
    );
    if (!recommendation) return false;

    recommendation.applied = true;
    recommendation.appliedAt = new Date();

    // Store in history
    const history = this.optimizationHistory.get(campaignId) || [];
    history.push(recommendation);
    this.optimizationHistory.set(campaignId, history);

    this.saveToStorage();

    console.info(
      `✅ Applied optimization: ${recommendation.title} for campaign ${campaignId}`
    );

    return true;
  }

  /**
   * Get campaign analytics and insights
   */
  getCampaignAnalytics(campaignId: string): CampaignMetrics | null {
    return this.activeCampaigns.get(campaignId) || null;
  }

  /**
   * Get all active campaigns
   */
  getActiveCampaigns(): CampaignMetrics[] {
    return Array.from(this.activeCampaigns.values());
  }

  /**
   * Get campaign performance summary
   */
  getCampaignPerformanceSummary(): {
    totalActiveCampaigns: number;
    totalRevenue: number;
    averageConversionRate: number;
    totalOptimizationsApplied: number;
    topPerformingCampaign: CampaignMetrics | null;
  } {
    const campaigns = this.getActiveCampaigns();

    if (campaigns.length === 0) {
      return {
        totalActiveCampaigns: 0,
        totalRevenue: 0,
        averageConversionRate: 0,
        totalOptimizationsApplied: 0,
        topPerformingCampaign: null,
      };
    }

    const totalRevenue = campaigns.reduce(
      (sum, c) => sum + c.currentMetrics.revenueGenerated,
      0
    );
    const averageConversionRate =
      campaigns.reduce((sum, c) => sum + c.currentMetrics.conversionRate, 0) /
      campaigns.length;
    const totalOptimizationsApplied = campaigns.reduce(
      (sum, c) =>
        sum + c.optimizationRecommendations.filter((r) => r.applied).length,
      0
    );

    const topPerformingCampaign = campaigns.reduce((top, current) =>
      current.currentMetrics.revenueGenerated >
      top.currentMetrics.revenueGenerated
        ? current
        : top
    );

    return {
      totalActiveCampaigns: campaigns.length,
      totalRevenue,
      averageConversionRate,
      totalOptimizationsApplied,
      topPerformingCampaign,
    };
  }

  /**
   * Get market intelligence insights
   */
  getMarketIntelligence(): {
    fuelPriceTrend: string;
    demandIndex: number;
    competitionLevel: string;
    recommendedCampaigns: string[];
    marketOpportunities: string[];
  } {
    // Mock market intelligence (would use real data in production)
    return {
      fuelPriceTrend: 'Increasing (+2.3% this week)',
      demandIndex: 67,
      competitionLevel: 'Medium',
      recommendedCampaigns: [
        'desperate_shippers_blitz',
        'safety_crisis_rescue',
      ],
      marketOpportunities: [
        'Rising fuel costs creating capacity urgency',
        'Seasonal manufacturing ramp-up increasing demand',
        'Regulatory changes affecting carrier compliance',
      ],
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  private startOptimizationMonitoring() {
    // Run optimization analysis every 15 minutes
    setInterval(
      () => {
        this.runOptimizationAnalysis();
      },
      15 * 60 * 1000
    );
  }

  private async runOptimizationAnalysis() {
    for (const [campaignId, campaign] of this.activeCampaigns.entries()) {
      // Update market conditions
      campaign.marketConditions = await this.getCurrentMarketConditions();

      // Regenerate recommendations if conditions changed significantly
      const newRecommendations =
        await this.generateOptimizationRecommendations(campaign);
      campaign.optimizationRecommendations = newRecommendations;

      campaign.lastOptimized = new Date();
    }

    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = {
        campaigns: Array.from(this.activeCampaigns.entries()),
        history: Array.from(this.optimizationHistory.entries()),
      };

      localStorage.setItem(
        'dynamic-campaign-optimization',
        JSON.stringify(data)
      );
    } catch (error) {
      console.error('Failed to save campaign optimization data:', error);
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem('dynamic-campaign-optimization');
      if (!data) return;

      const parsed = JSON.parse(data);

      // Restore campaigns
      this.activeCampaigns = new Map(
        parsed.campaigns.map(([id, campaign]: [string, any]) => [
          id,
          {
            ...campaign,
            startDate: new Date(campaign.startDate),
            lastOptimized: new Date(campaign.lastOptimized),
          },
        ])
      );

      // Restore history
      this.optimizationHistory = new Map(parsed.history);

      console.info(
        `📈 Loaded ${this.activeCampaigns.size} active campaigns from storage`
      );
    } catch (error) {
      console.error('Failed to load campaign optimization data:', error);
    }
  }
}

// Export singleton instance
export const dynamicCampaignOptimizationService =
  new DynamicCampaignOptimizationService();

