// Seasonal Load Planning Service
// Handles seasonal demand forecasting and route capacity optimization

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface SeasonalLoadRequest {
  planningPeriod: {
    startDate: string;
    endDate: string;
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday' | 'custom';
  };
  targetRegions: string[];
  equipmentTypes: string[];
  commodityTypes: string[];
  capacityConstraints: {
    maxDrivers: number;
    maxVehicles: number;
    maxDailyMiles: number;
  };
  businessPriorities: {
    profitMaximization: number; // 1-10 priority
    customerSatisfaction: number;
    driverUtilization: number;
    fuelEfficiency: number;
  };
  historicalDataPeriod: number; // years of historical data to analyze
}

export interface SeasonalDemandPattern {
  season: string;
  month: string;
  week: number;
  demandIndex: number; // 0-200 (100 = average)
  averageRates: {
    dryVan: number;
    refrigerated: number;
    flatbed: number;
    specialized: number;
  };
  volumeMultiplier: number;
  popularRoutes: {
    origin: string;
    destination: string;
    frequency: number;
    avgRate: number;
  }[];
  weatherImpact: 'low' | 'medium' | 'high';
  holidayEffect: boolean;
}

export interface CapacityOptimization {
  recommendedCapacity: {
    drivers: number;
    vehicles: number;
    dailyMiles: number;
  };
  utilizationForecast: {
    expectedUtilization: number;
    peakUtilization: number;
    lowUtilization: number;
  };
  capacityAdjustments: {
    action: 'increase' | 'decrease' | 'maintain';
    resourceType: 'drivers' | 'vehicles' | 'both';
    adjustmentPercentage: number;
    reasoning: string;
  }[];
  seasonalStaffing: {
    temporaryDrivers: number;
    contractCarriers: number;
    equipmentLeasing: number;
  };
}

export interface SeasonalLoadPlan extends AnalysisResult<SeasonalLoadRequest> {
  planningPeriod: {
    startDate: string;
    endDate: string;
    season: string;
    totalWeeks: number;
  };
  demandForecast: SeasonalDemandPattern[];
  capacityOptimization: CapacityOptimization;
  routeRecommendations: {
    priorityRoutes: {
      route: string;
      expectedVolume: number;
      avgRate: number;
      profitMargin: number;
      priority: 'high' | 'medium' | 'low';
    }[];
    avoidRoutes: {
      route: string;
      reason: string;
      alternativeRoute?: string;
    }[];
  };
  pricingStrategy: {
    basePricing: {
      season: string;
      adjustmentFactor: number;
      reasoning: string;
    };
    dynamicPricing: {
      highDemandMultiplier: number;
      lowDemandDiscount: number;
      peakSeasonSurcharge: number;
    };
  };
  riskAssessment: {
    weatherRisk: 'low' | 'medium' | 'high';
    demandVolatility: 'low' | 'medium' | 'high';
    competitiveRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  keyMetrics: {
    projectedRevenue: number;
    projectedProfit: number;
    expectedLoadCount: number;
    avgRevenuePerMile: number;
    driverUtilizationRate: number;
    fuelEfficiencyGain: number;
  };
  actionItems: string[];
  contingencyPlans: {
    scenario: string;
    trigger: string;
    actions: string[];
  }[];
}

export interface SeasonalTrend {
  period: string;
  demandIndex: number;
  rateIndex: number;
  volumeIndex: number;
  weatherImpact: number;
  holidayImpact: number;
}

export class SeasonalLoadPlanningService extends BaseService {
  constructor() {
    super('SeasonalLoadPlanning');
  }

  async createSeasonalPlan(
    loadRequest: SeasonalLoadRequest
  ): Promise<ServiceResponse<SeasonalLoadPlan>> {
    try {
      if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
        return this.createErrorResponse(
          new Error('Seasonal Load Planning feature is not enabled'),
          'createSeasonalPlan'
        );
      }

      this.log(
        'info',
        `Creating seasonal load plan for ${loadRequest.planningPeriod.season} season`
      );

      const plan = await this.generateSeasonalPlan(loadRequest);

      this.log(
        'info',
        `Completed seasonal load plan for ${loadRequest.planningPeriod.season}`,
        {
          season: loadRequest.planningPeriod.season,
          projectedRevenue: plan.keyMetrics.projectedRevenue,
          expectedLoads: plan.keyMetrics.expectedLoadCount,
        }
      );

      return this.createSuccessResponse(
        plan,
        `Seasonal load plan created for ${loadRequest.planningPeriod.season} season`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'createSeasonalPlan');
    }
  }

  async getSeasonalTrends(
    regions: string[],
    years: number = 3
  ): Promise<ServiceResponse<SeasonalTrend[]>> {
    try {
      if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
        return this.createErrorResponse(
          new Error('Seasonal Load Planning feature is not enabled'),
          'getSeasonalTrends'
        );
      }

      this.log(
        'info',
        `Retrieving seasonal trends for regions: ${regions.join(', ')}`
      );

      const trends = await this.fetchSeasonalTrends(regions, years);

      return this.createSuccessResponse(
        trends,
        `Seasonal trends retrieved for ${regions.length} regions`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getSeasonalTrends');
    }
  }

  async optimizeCapacity(
    currentCapacity: any,
    demandForecast: SeasonalDemandPattern[]
  ): Promise<ServiceResponse<CapacityOptimization>> {
    try {
      if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
        return this.createErrorResponse(
          new Error('Seasonal Load Planning feature is not enabled'),
          'optimizeCapacity'
        );
      }

      this.log('info', 'Optimizing capacity based on seasonal demand forecast');

      const optimization = await this.calculateCapacityOptimization(
        currentCapacity,
        demandForecast
      );

      return this.createSuccessResponse(
        optimization,
        'Capacity optimization completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'optimizeCapacity');
    }
  }

  async getPlanningTemplates(): Promise<ServiceResponse<any[]>> {
    try {
      if (!isFeatureEnabled('SEASONAL_LOAD_PLANNING')) {
        return this.createErrorResponse(
          new Error('Seasonal Load Planning feature is not enabled'),
          'getPlanningTemplates'
        );
      }

      this.log('info', 'Retrieving seasonal planning templates');

      const templates = await this.getSeasonalTemplates();

      return this.createSuccessResponse(
        templates,
        `${templates.length} planning templates retrieved`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getPlanningTemplates');
    }
  }

  // Private helper methods
  private async generateSeasonalPlan(
    loadRequest: SeasonalLoadRequest
  ): Promise<SeasonalLoadPlan> {
    const analysis = await this.callAI('seasonal_load_planning', {
      loadRequest,
      analysisType: 'seasonal_capacity_optimization',
    });

    const demandForecast = await this.generateDemandForecast(loadRequest);
    const capacityOptimization = await this.calculateCapacityOptimization(
      loadRequest.capacityConstraints,
      demandForecast
    );

    const totalWeeks = this.calculateWeeksBetween(
      loadRequest.planningPeriod.startDate,
      loadRequest.planningPeriod.endDate
    );

    return {
      result: loadRequest,
      confidence: analysis.confidence || 88,
      reasoning:
        analysis.reasoning ||
        'Seasonal plan optimized based on historical trends and capacity constraints',
      recommendations: analysis.recommendations || [
        'Increase capacity during peak season',
        'Implement dynamic pricing strategy',
        'Focus on high-margin routes',
      ],
      riskFactors: analysis.riskFactors || [
        'Weather-related disruptions',
        'Seasonal demand volatility',
      ],
      planningPeriod: {
        startDate: loadRequest.planningPeriod.startDate,
        endDate: loadRequest.planningPeriod.endDate,
        season: loadRequest.planningPeriod.season,
        totalWeeks,
      },
      demandForecast,
      capacityOptimization,
      routeRecommendations: this.generateRouteRecommendations(
        loadRequest,
        demandForecast
      ),
      pricingStrategy: this.generatePricingStrategy(
        loadRequest,
        demandForecast
      ),
      riskAssessment: this.assessSeasonalRisks(loadRequest, demandForecast),
      keyMetrics: this.calculateKeyMetrics(loadRequest, demandForecast),
      actionItems: this.generateActionItems(loadRequest, demandForecast),
      contingencyPlans: this.generateContingencyPlans(loadRequest),
    };
  }

  private async generateDemandForecast(
    loadRequest: SeasonalLoadRequest
  ): Promise<SeasonalDemandPattern[]> {
    const patterns: SeasonalDemandPattern[] = [];
    const seasons = ['spring', 'summer', 'fall', 'winter'];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Generate seasonal patterns based on typical freight patterns
    seasons.forEach((season, seasonIndex) => {
      const seasonalMonths = months.slice(
        seasonIndex * 3,
        (seasonIndex + 1) * 3
      );

      seasonalMonths.forEach((month, monthIndex) => {
        for (let week = 1; week <= 4; week++) {
          const demandIndex = this.calculateSeasonalDemandIndex(
            season,
            month,
            week
          );

          patterns.push({
            season,
            month,
            week,
            demandIndex,
            averageRates: {
              dryVan: 2.1 + (demandIndex - 100) * 0.01,
              refrigerated: 2.8 + (demandIndex - 100) * 0.015,
              flatbed: 2.4 + (demandIndex - 100) * 0.012,
              specialized: 3.2 + (demandIndex - 100) * 0.02,
            },
            volumeMultiplier: demandIndex / 100,
            popularRoutes: this.generatePopularRoutes(
              season,
              loadRequest.targetRegions
            ),
            weatherImpact: this.assessWeatherImpact(season, month),
            holidayEffect: this.checkHolidayEffect(month, week),
          });
        }
      });
    });

    return patterns;
  }

  private async calculateCapacityOptimization(
    currentCapacity: any,
    demandForecast: SeasonalDemandPattern[]
  ): Promise<CapacityOptimization> {
    const avgDemand =
      demandForecast.reduce((sum, p) => sum + p.demandIndex, 0) /
      demandForecast.length;
    const peakDemand = Math.max(...demandForecast.map((p) => p.demandIndex));
    const lowDemand = Math.min(...demandForecast.map((p) => p.demandIndex));

    const capacityMultiplier = peakDemand / 100;

    return {
      recommendedCapacity: {
        drivers: Math.ceil(currentCapacity.maxDrivers * capacityMultiplier),
        vehicles: Math.ceil(currentCapacity.maxVehicles * capacityMultiplier),
        dailyMiles: Math.ceil(
          currentCapacity.maxDailyMiles * capacityMultiplier
        ),
      },
      utilizationForecast: {
        expectedUtilization: Math.round(avgDemand),
        peakUtilization: Math.round(peakDemand),
        lowUtilization: Math.round(lowDemand),
      },
      capacityAdjustments: [
        {
          action: peakDemand > 120 ? 'increase' : 'maintain',
          resourceType: 'drivers',
          adjustmentPercentage: Math.max(0, (peakDemand - 100) * 0.5),
          reasoning: `Peak demand is ${peakDemand}% of average, requiring capacity adjustment`,
        },
      ],
      seasonalStaffing: {
        temporaryDrivers: Math.max(0, Math.ceil((peakDemand - 100) * 0.1)),
        contractCarriers: Math.max(0, Math.ceil((peakDemand - 120) * 0.05)),
        equipmentLeasing: Math.max(0, Math.ceil((peakDemand - 110) * 0.08)),
      },
    };
  }

  private async fetchSeasonalTrends(
    regions: string[],
    years: number
  ): Promise<SeasonalTrend[]> {
    // Mock seasonal trends - in production, this would fetch from historical data
    const trends: SeasonalTrend[] = [];
    const periods = ['Q1', 'Q2', 'Q3', 'Q4'];

    periods.forEach((period, index) => {
      trends.push({
        period,
        demandIndex: 85 + Math.random() * 30, // 85-115 range
        rateIndex: 95 + Math.random() * 20, // 95-115 range
        volumeIndex: 90 + Math.random() * 25, // 90-115 range
        weatherImpact: Math.random() * 30, // 0-30% impact
        holidayImpact: index === 3 ? Math.random() * 40 : Math.random() * 10, // Q4 has higher holiday impact
      });
    });

    return trends;
  }

  private async getSeasonalTemplates(): Promise<any[]> {
    return [
      {
        id: 'retail-peak',
        name: 'Retail Peak Season',
        season: 'fall',
        description: 'Optimized for retail peak season (Sep-Dec)',
        capacityIncrease: 25,
        focusRoutes: ['West Coast to East Coast', 'Major retail hubs'],
        pricingAdjustment: 15,
      },
      {
        id: 'agricultural',
        name: 'Agricultural Harvest',
        season: 'summer',
        description: 'Optimized for agricultural harvest season',
        capacityIncrease: 20,
        focusRoutes: ['Farm belt to distribution centers'],
        pricingAdjustment: 10,
      },
      {
        id: 'construction',
        name: 'Construction Season',
        season: 'spring',
        description: 'Optimized for construction material transport',
        capacityIncrease: 15,
        focusRoutes: ['Material suppliers to construction sites'],
        pricingAdjustment: 12,
      },
      {
        id: 'holiday-rush',
        name: 'Holiday Rush',
        season: 'winter',
        description: 'Optimized for holiday shipping surge',
        capacityIncrease: 35,
        focusRoutes: ['Distribution centers to retail'],
        pricingAdjustment: 25,
      },
    ];
  }

  private calculateWeeksBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  }

  private calculateSeasonalDemandIndex(
    season: string,
    month: string,
    week: number
  ): number {
    const baseIndex = 100;
    let seasonalAdjustment = 0;

    // Seasonal adjustments based on typical freight patterns
    switch (season) {
      case 'spring':
        seasonalAdjustment = 5; // Moderate increase
        break;
      case 'summer':
        seasonalAdjustment = 10; // Higher demand
        break;
      case 'fall':
        seasonalAdjustment = 20; // Peak season
        break;
      case 'winter':
        seasonalAdjustment = -5; // Lower demand except holidays
        break;
    }

    // Holiday adjustments
    if (month === 'December' && week >= 2) {
      seasonalAdjustment += 30; // Holiday rush
    }
    if (month === 'November' && week >= 3) {
      seasonalAdjustment += 25; // Thanksgiving/Black Friday
    }

    return baseIndex + seasonalAdjustment + Math.random() * 10 - 5; // Add some variability
  }

  private generatePopularRoutes(season: string, regions: string[]): any[] {
    const routes = [
      {
        origin: 'Los Angeles, CA',
        destination: 'Chicago, IL',
        frequency: 85,
        avgRate: 2.2,
      },
      {
        origin: 'Atlanta, GA',
        destination: 'New York, NY',
        frequency: 78,
        avgRate: 2.1,
      },
      {
        origin: 'Dallas, TX',
        destination: 'Miami, FL',
        frequency: 72,
        avgRate: 2.0,
      },
    ];

    // Adjust rates based on season
    const seasonalMultiplier =
      season === 'fall' ? 1.2 : season === 'summer' ? 1.1 : 1.0;

    return routes.map((route) => ({
      ...route,
      avgRate: route.avgRate * seasonalMultiplier,
      frequency: Math.round(route.frequency * seasonalMultiplier),
    }));
  }

  private assessWeatherImpact(
    season: string,
    month: string
  ): 'low' | 'medium' | 'high' {
    const winterMonths = ['December', 'January', 'February'];
    const summerMonths = ['June', 'July', 'August'];

    if (winterMonths.includes(month)) return 'high';
    if (summerMonths.includes(month)) return 'medium';
    return 'low';
  }

  private checkHolidayEffect(month: string, week: number): boolean {
    const holidayPeriods = [
      { month: 'November', weeks: [4] }, // Thanksgiving
      { month: 'December', weeks: [3, 4] }, // Christmas/New Year
      { month: 'July', weeks: [1] }, // July 4th
    ];

    return holidayPeriods.some(
      (period) => period.month === month && period.weeks.includes(week)
    );
  }

  private generateRouteRecommendations(
    loadRequest: SeasonalLoadRequest,
    demandForecast: SeasonalDemandPattern[]
  ): any {
    const avgDemand =
      demandForecast.reduce((sum, p) => sum + p.demandIndex, 0) /
      demandForecast.length;

    return {
      priorityRoutes: [
        {
          route: 'West Coast to East Coast',
          expectedVolume: Math.round(avgDemand * 1.2),
          avgRate: 2.3,
          profitMargin: 18,
          priority: 'high' as const,
        },
        {
          route: 'Texas Triangle',
          expectedVolume: Math.round(avgDemand * 1.0),
          avgRate: 2.0,
          profitMargin: 15,
          priority: 'medium' as const,
        },
      ],
      avoidRoutes: [
        {
          route: 'Northern routes during winter',
          reason: 'High weather risk and delays',
          alternativeRoute: 'Southern corridor routes',
        },
      ],
    };
  }

  private generatePricingStrategy(
    loadRequest: SeasonalLoadRequest,
    demandForecast: SeasonalDemandPattern[]
  ): any {
    const peakDemand = Math.max(...demandForecast.map((p) => p.demandIndex));

    return {
      basePricing: {
        season: loadRequest.planningPeriod.season,
        adjustmentFactor: (peakDemand - 100) / 100,
        reasoning: `Adjust base rates by ${Math.round(((peakDemand - 100) / 100) * 100)}% during peak periods`,
      },
      dynamicPricing: {
        highDemandMultiplier: 1.25,
        lowDemandDiscount: 0.9,
        peakSeasonSurcharge: peakDemand > 120 ? 0.2 : 0.1,
      },
    };
  }

  private assessSeasonalRisks(
    loadRequest: SeasonalLoadRequest,
    demandForecast: SeasonalDemandPattern[]
  ): any {
    const weatherRisk =
      loadRequest.planningPeriod.season === 'winter' ? 'high' : 'medium';
    const demandVolatility =
      Math.max(...demandForecast.map((p) => p.demandIndex)) -
        Math.min(...demandForecast.map((p) => p.demandIndex)) >
      40
        ? 'high'
        : 'medium';

    return {
      weatherRisk,
      demandVolatility,
      competitiveRisk: 'medium' as const,
      overallRisk:
        weatherRisk === 'high' || demandVolatility === 'high'
          ? 'high'
          : 'medium',
    };
  }

  private calculateKeyMetrics(
    loadRequest: SeasonalLoadRequest,
    demandForecast: SeasonalDemandPattern[]
  ): any {
    const avgDemand =
      demandForecast.reduce((sum, p) => sum + p.demandIndex, 0) /
      demandForecast.length;
    const avgRate =
      demandForecast.reduce((sum, p) => sum + p.averageRates.dryVan, 0) /
      demandForecast.length;

    const projectedLoads = Math.round(avgDemand * 10); // Estimate based on demand index
    const projectedRevenue = projectedLoads * avgRate * 500; // Assume 500 miles average

    return {
      projectedRevenue: Math.round(projectedRevenue),
      projectedProfit: Math.round(projectedRevenue * 0.15), // 15% profit margin
      expectedLoadCount: projectedLoads,
      avgRevenuePerMile: avgRate,
      driverUtilizationRate: Math.min(95, avgDemand),
      fuelEfficiencyGain: 8, // 8% improvement through optimization
    };
  }

  private generateActionItems(
    loadRequest: SeasonalLoadRequest,
    demandForecast: SeasonalDemandPattern[]
  ): string[] {
    const peakDemand = Math.max(...demandForecast.map((p) => p.demandIndex));

    const items = [
      'Review and update driver capacity planning',
      'Implement dynamic pricing based on demand forecasts',
      'Establish partnerships with contract carriers',
    ];

    if (peakDemand > 120) {
      items.push('Plan for temporary driver recruitment');
      items.push('Consider equipment leasing for peak periods');
    }

    return items;
  }

  private generateContingencyPlans(loadRequest: SeasonalLoadRequest): any[] {
    return [
      {
        scenario: 'Demand exceeds capacity by 25%+',
        trigger: 'Weekly load volume > 125% of planned capacity',
        actions: [
          'Activate contract carrier network',
          'Implement surge pricing',
          'Prioritize high-margin customers',
        ],
      },
      {
        scenario: 'Weather disruptions',
        trigger: 'Major weather events affecting operations',
        actions: [
          'Activate alternative route plans',
          'Communicate proactively with customers',
          'Adjust delivery schedules',
        ],
      },
      {
        scenario: 'Demand falls below 75% of forecast',
        trigger: 'Weekly load volume < 75% of planned capacity',
        actions: [
          'Reduce temporary capacity',
          'Implement promotional pricing',
          'Focus on customer acquisition',
        ],
      },
    ];
  }
}
