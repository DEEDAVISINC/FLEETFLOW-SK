// Spot Rate Optimization Service
// Analyzes market conditions and provides optimal pricing recommendations

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface MarketConditions {
  currentFuelPrice: number;
  capacityUtilization: number;
  seasonalDemand: number;
  competitorRates: number[];
  laneCongestion: number;
  weatherImpact: number;
  economicIndicators: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
  };
}

export interface LoadParameters {
  origin: string;
  destination: string;
  distance: number;
  equipmentType: string;
  weight: number;
  urgency: 'standard' | 'expedited' | 'rush';
  specialRequirements: string[];
  marketSegment: 'spot' | 'contract' | 'dedicated';
}

export interface RateOptimization extends AnalysisResult<LoadParameters> {
  recommendedRate: number;
  rateRange: {
    min: number;
    max: number;
    optimal: number;
  };
  marketPosition: 'aggressive' | 'competitive' | 'premium';
  confidenceLevel: number;
  pricingFactors: {
    fuelCost: number;
    capacityPressure: number;
    seasonalAdjustment: number;
    competitorInfluence: number;
    urgencyMultiplier: number;
  };
  riskAssessment: {
    rateRisk: 'low' | 'medium' | 'high';
    capacityRisk: 'low' | 'medium' | 'high';
    marketRisk: 'low' | 'medium' | 'high';
  };
  recommendations: string[];
}

export interface MarketIntelligence {
  averageSpotRate: number;
  rateTrend: 'increasing' | 'decreasing' | 'stable';
  capacityAvailability: number;
  demandForecast: number;
  hotLanes: string[];
  coldLanes: string[];
  rateVolatility: number;
}

export interface PricingStrategy {
  strategyName: string;
  description: string;
  targetRate: number;
  expectedMargin: number;
  riskLevel: 'low' | 'medium' | 'high';
  marketConditions: string[];
}

export class SpotRateOptimizationService extends BaseService {
  constructor() {
    super('SpotRateOptimization');
  }

  async optimizeRate(
    loadParams: LoadParameters,
    marketConditions: MarketConditions
  ): Promise<ServiceResponse<RateOptimization>> {
    try {
      if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
        return this.createErrorResponse(
          new Error('Spot Rate Optimization feature is not enabled'),
          'optimizeRate'
        );
      }

      this.log(
        'info',
        `Starting rate optimization for load: ${loadParams.origin} to ${loadParams.destination}`
      );

      const optimization = await this.performRateOptimization(
        loadParams,
        marketConditions
      );

      this.log('info', `Completed rate optimization`, {
        recommendedRate: optimization.recommendedRate,
        marketPosition: optimization.marketPosition,
        confidenceLevel: optimization.confidenceLevel,
      });

      return this.createSuccessResponse(
        optimization,
        `Rate optimization completed for ${loadParams.origin} to ${loadParams.destination}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'optimizeRate');
    }
  }

  async getMarketIntelligence(
    origin?: string,
    destination?: string
  ): Promise<ServiceResponse<MarketIntelligence>> {
    try {
      if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
        return this.createErrorResponse(
          new Error('Spot Rate Optimization feature is not enabled'),
          'getMarketIntelligence'
        );
      }

      this.log('info', 'Generating market intelligence');

      const intelligence = await this.gatherMarketIntelligence(
        origin,
        destination
      );

      return this.createSuccessResponse(
        intelligence,
        'Market intelligence generated successfully'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getMarketIntelligence');
    }
  }

  async generatePricingStrategies(
    loadParams: LoadParameters
  ): Promise<ServiceResponse<PricingStrategy[]>> {
    try {
      if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
        return this.createErrorResponse(
          new Error('Spot Rate Optimization feature is not enabled'),
          'generatePricingStrategies'
        );
      }

      this.log('info', 'Generating pricing strategies');

      const strategies = await this.createPricingStrategies(loadParams);

      return this.createSuccessResponse(
        strategies,
        `${strategies.length} pricing strategies generated`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'generatePricingStrategies');
    }
  }

  async analyzeRateHistory(
    origin: string,
    destination: string,
    timeframe: 'week' | 'month' | 'quarter' = 'month'
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('SPOT_RATE_OPTIMIZATION')) {
        return this.createErrorResponse(
          new Error('Spot Rate Optimization feature is not enabled'),
          'analyzeRateHistory'
        );
      }

      this.log(
        'info',
        `Analyzing rate history for ${origin} to ${destination}`
      );

      const history = await this.getRateHistory(origin, destination, timeframe);

      return this.createSuccessResponse(
        history,
        'Rate history analysis completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'analyzeRateHistory');
    }
  }

  // Private helper methods
  private async performRateOptimization(
    loadParams: LoadParameters,
    marketConditions: MarketConditions
  ): Promise<RateOptimization> {
    const analysis = await this.callAI('spot_rate_optimization', {
      loadParams,
      marketConditions,
      analysisType: 'rate_optimization',
    });

    const baseRate = this.calculateBaseRate(loadParams);
    const marketAdjustment = this.calculateMarketAdjustment(marketConditions);
    const urgencyMultiplier = this.getUrgencyMultiplier(loadParams.urgency);

    const recommendedRate = baseRate * marketAdjustment * urgencyMultiplier;
    const rateRange = this.calculateRateRange(
      recommendedRate,
      marketConditions
    );

    return {
      result: loadParams,
      confidence: analysis.confidence || 85,
      reasoning:
        analysis.reasoning || 'Market conditions support competitive pricing',
      recommendations: analysis.recommendations || [
        'Monitor competitor rates closely',
        'Consider capacity availability',
        'Adjust for seasonal factors',
      ],
      riskFactors: analysis.riskFactors || [
        'Market volatility',
        'Capacity constraints',
      ],
      recommendedRate: Math.round(recommendedRate),
      rateRange,
      marketPosition: this.determineMarketPosition(
        recommendedRate,
        marketConditions
      ),
      confidenceLevel: this.calculateConfidenceLevel(marketConditions),
      pricingFactors: {
        fuelCost: this.calculateFuelCost(
          marketConditions.currentFuelPrice,
          loadParams.distance
        ),
        capacityPressure: this.calculateCapacityPressure(
          marketConditions.capacityUtilization
        ),
        seasonalAdjustment: this.calculateSeasonalAdjustment(
          marketConditions.seasonalDemand
        ),
        competitorInfluence: this.calculateCompetitorInfluence(
          marketConditions.competitorRates
        ),
        urgencyMultiplier: urgencyMultiplier,
      },
      riskAssessment: {
        rateRisk: this.assessRateRisk(marketConditions),
        capacityRisk: this.assessCapacityRisk(marketConditions),
        marketRisk: this.assessMarketRisk(marketConditions),
      },
      recommendations: [
        'Monitor market conditions daily',
        'Adjust rates based on capacity availability',
        'Consider fuel price fluctuations',
        'Track competitor pricing strategies',
      ],
    };
  }

  private async gatherMarketIntelligence(
    origin?: string,
    destination?: string
  ): Promise<MarketIntelligence> {
    return {
      averageSpotRate: 2850,
      rateTrend: 'increasing',
      capacityAvailability: 0.75,
      demandForecast: 1.15,
      hotLanes: ['LAX-CHI', 'ATL-NYC', 'DAL-LAX'],
      coldLanes: ['CHI-MIA', 'SEA-DEN', 'PHX-ATL'],
      rateVolatility: 0.12,
    };
  }

  private async createPricingStrategies(
    loadParams: LoadParameters
  ): Promise<PricingStrategy[]> {
    return [
      {
        strategyName: 'Aggressive Market Capture',
        description: 'Undercut competitors to gain market share',
        targetRate: 2650,
        expectedMargin: 0.08,
        riskLevel: 'high',
        marketConditions: ['High capacity', 'Low demand', 'Competitive market'],
      },
      {
        strategyName: 'Premium Service Positioning',
        description: 'Charge premium rates for superior service',
        targetRate: 3200,
        expectedMargin: 0.15,
        riskLevel: 'medium',
        marketConditions: [
          'Low capacity',
          'High demand',
          'Quality-focused customers',
        ],
      },
      {
        strategyName: 'Balanced Competitive',
        description: 'Match market rates with slight premium',
        targetRate: 2850,
        expectedMargin: 0.12,
        riskLevel: 'low',
        marketConditions: [
          'Stable market',
          'Moderate competition',
          'Standard service',
        ],
      },
    ];
  }

  private async getRateHistory(
    origin: string,
    destination: string,
    timeframe: string
  ): Promise<any> {
    return {
      lane: `${origin}-${destination}`,
      timeframe,
      averageRate: 2850,
      rateTrend: 'increasing',
      volatility: 0.12,
      dataPoints: [
        { date: '2024-01-01', rate: 2750 },
        { date: '2024-01-08', rate: 2800 },
        { date: '2024-01-15', rate: 2850 },
        { date: '2024-01-22', rate: 2900 },
      ],
    };
  }

  private calculateBaseRate(loadParams: LoadParameters): number {
    const baseRatePerMile = 2.85;
    return loadParams.distance * baseRatePerMile;
  }

  private calculateMarketAdjustment(
    marketConditions: MarketConditions
  ): number {
    let adjustment = 1.0;

    // Fuel price adjustment
    const fuelAdjustment = marketConditions.currentFuelPrice / 3.5; // Baseline fuel price
    adjustment *= fuelAdjustment;

    // Capacity utilization adjustment
    if (marketConditions.capacityUtilization > 0.8) {
      adjustment *= 1.1; // High capacity = higher rates
    } else if (marketConditions.capacityUtilization < 0.6) {
      adjustment *= 0.9; // Low capacity = lower rates
    }

    // Seasonal demand adjustment
    adjustment *= 1 + (marketConditions.seasonalDemand - 1) * 0.1;

    return adjustment;
  }

  private getUrgencyMultiplier(urgency: string): number {
    switch (urgency) {
      case 'rush':
        return 1.25;
      case 'expedited':
        return 1.15;
      case 'standard':
        return 1.0;
      default:
        return 1.0;
    }
  }

  private calculateRateRange(
    recommendedRate: number,
    marketConditions: MarketConditions
  ): {
    min: number;
    max: number;
    optimal: number;
  } {
    const volatility = marketConditions.rateVolatility || 0.1;
    const range = recommendedRate * volatility;

    return {
      min: Math.round(recommendedRate - range),
      max: Math.round(recommendedRate + range),
      optimal: Math.round(recommendedRate),
    };
  }

  private determineMarketPosition(
    recommendedRate: number,
    marketConditions: MarketConditions
  ): 'aggressive' | 'competitive' | 'premium' {
    const averageCompetitorRate =
      marketConditions.competitorRates.reduce((a, b) => a + b, 0) /
      marketConditions.competitorRates.length;
    const ratio = recommendedRate / averageCompetitorRate;

    if (ratio < 0.95) return 'aggressive';
    if (ratio > 1.05) return 'premium';
    return 'competitive';
  }

  private calculateConfidenceLevel(marketConditions: MarketConditions): number {
    let confidence = 80;

    // More data points = higher confidence
    if (marketConditions.competitorRates.length > 5) confidence += 10;

    // Stable market conditions = higher confidence
    if (
      marketConditions.capacityUtilization > 0.6 &&
      marketConditions.capacityUtilization < 0.9
    )
      confidence += 5;

    return Math.min(confidence, 95);
  }

  private calculateFuelCost(fuelPrice: number, distance: number): number {
    const mpg = 6.5; // Average truck MPG
    return (distance / mpg) * fuelPrice;
  }

  private calculateCapacityPressure(utilization: number): number {
    if (utilization > 0.8) return 1.2;
    if (utilization < 0.6) return 0.8;
    return 1.0;
  }

  private calculateSeasonalAdjustment(demand: number): number {
    return demand;
  }

  private calculateCompetitorInfluence(competitorRates: number[]): number {
    if (competitorRates.length === 0) return 1.0;
    const average =
      competitorRates.reduce((a, b) => a + b, 0) / competitorRates.length;
    return average / 2850; // Baseline rate
  }

  private assessRateRisk(
    marketConditions: MarketConditions
  ): 'low' | 'medium' | 'high' {
    const volatility = marketConditions.rateVolatility || 0.1;
    if (volatility > 0.15) return 'high';
    if (volatility > 0.08) return 'medium';
    return 'low';
  }

  private assessCapacityRisk(
    marketConditions: MarketConditions
  ): 'low' | 'medium' | 'high' {
    if (marketConditions.capacityUtilization > 0.9) return 'high';
    if (marketConditions.capacityUtilization < 0.7) return 'low';
    return 'medium';
  }

  private assessMarketRisk(
    marketConditions: MarketConditions
  ): 'low' | 'medium' | 'high' {
    const economicRisk =
      marketConditions.economicIndicators.inflationRate > 3 ? 1 : 0;
    const fuelRisk = marketConditions.currentFuelPrice > 4 ? 1 : 0;
    const totalRisk = economicRisk + fuelRisk;

    if (totalRisk >= 2) return 'high';
    if (totalRisk >= 1) return 'medium';
    return 'low';
  }
}
