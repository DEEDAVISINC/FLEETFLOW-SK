// Emergency Load Pricing Service
// Handles urgent shipments with dynamic pricing multipliers

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface EmergencyLoadRequest {
  loadId: string;
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  equipmentType: string;
  urgencyLevel: 'standard' | 'urgent' | 'critical' | 'emergency';
  timeConstraint: {
    requestedPickup: string;
    requiredDelivery: string;
    currentTime: string;
  };
  specialRequirements: string[];
  customerTier: 'standard' | 'premium' | 'enterprise';
  hazmatClass?: string;
  temperatureControlled?: boolean;
}

export interface EmergencyPricingFactors {
  baseRate: number;
  urgencyMultiplier: number;
  timeConstraintMultiplier: number;
  availabilityMultiplier: number;
  specialRequirementsMultiplier: number;
  customerTierDiscount: number;
  marketDemandMultiplier: number;
  driverIncentiveMultiplier: number;
}

export interface EmergencyPricingAnalysis
  extends AnalysisResult<EmergencyLoadRequest> {
  emergencyRate: number;
  standardRate: number;
  emergencyPremium: number;
  pricingFactors: EmergencyPricingFactors;
  timeToDeadline: {
    hours: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  availabilityAssessment: {
    driversAvailable: number;
    equipmentAvailable: number;
    competingLoads: number;
    availabilityScore: 'abundant' | 'limited' | 'scarce' | 'critical';
  };
  riskAssessment: {
    deliveryRisk: 'low' | 'medium' | 'high';
    weatherRisk: 'low' | 'medium' | 'high';
    routeRisk: 'low' | 'medium' | 'high';
    overallRisk: 'low' | 'medium' | 'high';
  };
  recommendedActions: string[];
}

export interface EmergencyLoadMetrics {
  totalEmergencyLoads: number;
  averageEmergencyPremium: number;
  successRate: number;
  averageResponseTime: number;
  revenueImpact: number;
  customerSatisfactionScore: number;
  driverUtilizationImpact: number;
}

export interface PricingStrategy {
  strategyName: string;
  description: string;
  urgencyThreshold: number;
  baseMultiplier: number;
  maxMultiplier: number;
  applicableScenarios: string[];
  expectedOutcomes: string[];
}

export class EmergencyLoadPricingService extends BaseService {
  constructor() {
    super('EmergencyLoadPricing');
  }

  async calculateEmergencyPricing(
    loadRequest: EmergencyLoadRequest
  ): Promise<ServiceResponse<EmergencyPricingAnalysis>> {
    try {
      if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
        return this.createErrorResponse(
          new Error('Emergency Load Pricing feature is not enabled'),
          'calculateEmergencyPricing'
        );
      }

      this.log(
        'info',
        `Calculating emergency pricing for load: ${loadRequest.loadId}`
      );

      const analysis = await this.performEmergencyPricingAnalysis(loadRequest);

      this.log(
        'info',
        `Completed emergency pricing analysis for load: ${loadRequest.loadId}`,
        {
          emergencyRate: analysis.emergencyRate,
          urgencyLevel: loadRequest.urgencyLevel,
          emergencyPremium: analysis.emergencyPremium,
        }
      );

      return this.createSuccessResponse(
        analysis,
        `Emergency pricing calculated for load ${loadRequest.loadId}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'calculateEmergencyPricing');
    }
  }

  async getEmergencyLoadMetrics(): Promise<
    ServiceResponse<EmergencyLoadMetrics>
  > {
    try {
      if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
        return this.createErrorResponse(
          new Error('Emergency Load Pricing feature is not enabled'),
          'getEmergencyLoadMetrics'
        );
      }

      this.log('info', 'Retrieving emergency load metrics');

      const metrics = await this.calculateEmergencyMetrics();

      return this.createSuccessResponse(
        metrics,
        'Emergency load metrics retrieved successfully'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getEmergencyLoadMetrics');
    }
  }

  async getPricingStrategies(): Promise<ServiceResponse<PricingStrategy[]>> {
    try {
      if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
        return this.createErrorResponse(
          new Error('Emergency Load Pricing feature is not enabled'),
          'getPricingStrategies'
        );
      }

      this.log('info', 'Retrieving emergency pricing strategies');

      const strategies = await this.getEmergencyPricingStrategies();

      return this.createSuccessResponse(
        strategies,
        `${strategies.length} pricing strategies retrieved`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getPricingStrategies');
    }
  }

  async optimizeEmergencyCapacity(
    timeWindow: number,
    region: string
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('EMERGENCY_LOAD_PRICING')) {
        return this.createErrorResponse(
          new Error('Emergency Load Pricing feature is not enabled'),
          'optimizeEmergencyCapacity'
        );
      }

      this.log('info', `Optimizing emergency capacity for region: ${region}`);

      const optimization = await this.performCapacityOptimization(
        timeWindow,
        region
      );

      return this.createSuccessResponse(
        optimization,
        'Emergency capacity optimization completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'optimizeEmergencyCapacity');
    }
  }

  // Private helper methods
  private async performEmergencyPricingAnalysis(
    loadRequest: EmergencyLoadRequest
  ): Promise<EmergencyPricingAnalysis> {
    const analysis = await this.callAI('emergency_load_pricing', {
      loadRequest,
      analysisType: 'emergency_pricing_optimization',
    });

    const baseRate = this.calculateBaseRate(loadRequest);
    const pricingFactors = this.calculatePricingFactors(loadRequest);
    const emergencyRate = this.calculateEmergencyRate(baseRate, pricingFactors);

    return {
      result: loadRequest,
      confidence: analysis.confidence || 90,
      reasoning:
        analysis.reasoning ||
        'Emergency pricing calculated based on urgency and market conditions',
      recommendations: analysis.recommendations || [
        'Assign dedicated dispatcher for monitoring',
        'Provide real-time tracking updates',
        'Prepare backup carrier options',
      ],
      riskFactors: analysis.riskFactors || [
        'Tight delivery timeline',
        'Limited carrier availability',
      ],
      emergencyRate,
      standardRate: baseRate,
      emergencyPremium: emergencyRate - baseRate,
      pricingFactors,
      timeToDeadline: this.calculateTimeToDeadline(loadRequest),
      availabilityAssessment: this.assessAvailability(loadRequest),
      riskAssessment: this.assessRisks(loadRequest),
      recommendedActions: [
        'Immediate carrier assignment required',
        'Monitor progress every 2 hours',
        'Prepare contingency plans',
        'Notify customer of premium pricing',
      ],
    };
  }

  private async calculateEmergencyMetrics(): Promise<EmergencyLoadMetrics> {
    return {
      totalEmergencyLoads: 147,
      averageEmergencyPremium: 68.5,
      successRate: 94.2,
      averageResponseTime: 12.5, // minutes
      revenueImpact: 285000,
      customerSatisfactionScore: 4.7,
      driverUtilizationImpact: 15.3,
    };
  }

  private async getEmergencyPricingStrategies(): Promise<PricingStrategy[]> {
    return [
      {
        strategyName: 'Time-Critical Premium',
        description: 'Premium pricing based on delivery time constraints',
        urgencyThreshold: 24, // hours
        baseMultiplier: 1.5,
        maxMultiplier: 3.0,
        applicableScenarios: [
          'Same-day delivery requests',
          'Production line down situations',
          'Medical/pharmaceutical emergencies',
        ],
        expectedOutcomes: [
          'Higher profit margins',
          'Attracts premium customers',
          'Compensates for operational stress',
        ],
      },
      {
        strategyName: 'Capacity Scarcity Pricing',
        description: 'Dynamic pricing based on available capacity',
        urgencyThreshold: 48,
        baseMultiplier: 1.25,
        maxMultiplier: 2.5,
        applicableScenarios: [
          'Peak season demand',
          'Weather-related capacity constraints',
          'High-demand corridors',
        ],
        expectedOutcomes: [
          'Optimizes capacity utilization',
          'Balances supply and demand',
          'Maximizes revenue per mile',
        ],
      },
      {
        strategyName: 'Customer Tier Optimization',
        description: 'Tiered pricing based on customer relationship',
        urgencyThreshold: 12,
        baseMultiplier: 1.75,
        maxMultiplier: 2.25,
        applicableScenarios: [
          'Enterprise customer emergencies',
          'Strategic account priorities',
          'Long-term contract obligations',
        ],
        expectedOutcomes: [
          'Maintains customer relationships',
          'Ensures service level compliance',
          'Balances profitability with loyalty',
        ],
      },
    ];
  }

  private async performCapacityOptimization(
    timeWindow: number,
    region: string
  ): Promise<any> {
    return {
      region,
      timeWindow,
      currentCapacity: {
        availableDrivers: 23,
        availableEquipment: 18,
        utilizationRate: 0.78,
      },
      emergencyDemand: {
        pendingRequests: 7,
        projectedRequests: 12,
        averageUrgency: 'high',
      },
      optimizationRecommendations: [
        'Deploy 3 additional drivers to region',
        'Pre-position equipment at key locations',
        'Activate on-call driver pool',
        'Coordinate with partner carriers',
      ],
      expectedImpact: {
        capacityIncrease: 35,
        responseTimeImprovement: 22,
        customerSatisfactionBoost: 15,
      },
    };
  }

  private calculateBaseRate(loadRequest: EmergencyLoadRequest): number {
    const baseRatePerMile = 2.85;
    let baseRate = loadRequest.distance * baseRatePerMile;

    // Equipment type adjustment
    const equipmentMultipliers = {
      'dry-van': 1.0,
      flatbed: 1.15,
      reefer: 1.25,
      'step-deck': 1.2,
      'low-boy': 1.35,
    };

    baseRate *= equipmentMultipliers[loadRequest.equipmentType] || 1.0;

    // Weight adjustment
    if (loadRequest.weight > 45000) {
      baseRate *= 1.1;
    }

    return Math.round(baseRate);
  }

  private calculatePricingFactors(
    loadRequest: EmergencyLoadRequest
  ): EmergencyPricingFactors {
    const urgencyMultipliers = {
      standard: 1.0,
      urgent: 1.5,
      critical: 2.0,
      emergency: 2.5,
    };

    const customerTierDiscounts = {
      standard: 0,
      premium: 0.05,
      enterprise: 0.1,
    };

    const timeConstraint = this.calculateTimeConstraintMultiplier(loadRequest);
    const availability = this.calculateAvailabilityMultiplier(loadRequest);
    const specialRequirements =
      this.calculateSpecialRequirementsMultiplier(loadRequest);

    return {
      baseRate: this.calculateBaseRate(loadRequest),
      urgencyMultiplier: urgencyMultipliers[loadRequest.urgencyLevel],
      timeConstraintMultiplier: timeConstraint,
      availabilityMultiplier: availability,
      specialRequirementsMultiplier: specialRequirements,
      customerTierDiscount: customerTierDiscounts[loadRequest.customerTier],
      marketDemandMultiplier: 1.15, // Current market conditions
      driverIncentiveMultiplier: 1.25, // Additional driver compensation
    };
  }

  private calculateEmergencyRate(
    baseRate: number,
    factors: EmergencyPricingFactors
  ): number {
    let emergencyRate = baseRate;

    // Apply all multipliers
    emergencyRate *= factors.urgencyMultiplier;
    emergencyRate *= factors.timeConstraintMultiplier;
    emergencyRate *= factors.availabilityMultiplier;
    emergencyRate *= factors.specialRequirementsMultiplier;
    emergencyRate *= factors.marketDemandMultiplier;
    emergencyRate *= factors.driverIncentiveMultiplier;

    // Apply customer tier discount
    emergencyRate *= 1 - factors.customerTierDiscount;

    return Math.round(emergencyRate);
  }

  private calculateTimeToDeadline(loadRequest: EmergencyLoadRequest): any {
    const currentTime = new Date(loadRequest.timeConstraint.currentTime);
    const deliveryTime = new Date(loadRequest.timeConstraint.requiredDelivery);
    const hoursToDeadline =
      (deliveryTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60);

    let urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    if (hoursToDeadline > 48) urgencyLevel = 'low';
    else if (hoursToDeadline > 24) urgencyLevel = 'medium';
    else if (hoursToDeadline > 12) urgencyLevel = 'high';
    else urgencyLevel = 'critical';

    return {
      hours: Math.round(hoursToDeadline * 10) / 10,
      urgencyLevel,
    };
  }

  private calculateTimeConstraintMultiplier(
    loadRequest: EmergencyLoadRequest
  ): number {
    const timeToDeadline = this.calculateTimeToDeadline(loadRequest);

    if (timeToDeadline.hours <= 6) return 2.5;
    if (timeToDeadline.hours <= 12) return 2.0;
    if (timeToDeadline.hours <= 24) return 1.5;
    if (timeToDeadline.hours <= 48) return 1.25;
    return 1.0;
  }

  private calculateAvailabilityMultiplier(
    loadRequest: EmergencyLoadRequest
  ): number {
    // Mock availability assessment - in production, this would check real capacity
    const availabilityScore = Math.random();

    if (availabilityScore < 0.2) return 2.0; // Critical shortage
    if (availabilityScore < 0.4) return 1.5; // Limited availability
    if (availabilityScore < 0.7) return 1.25; // Moderate availability
    return 1.0; // Abundant availability
  }

  private calculateSpecialRequirementsMultiplier(
    loadRequest: EmergencyLoadRequest
  ): number {
    let multiplier = 1.0;

    if (loadRequest.hazmatClass) multiplier += 0.3;
    if (loadRequest.temperatureControlled) multiplier += 0.2;
    if (loadRequest.specialRequirements.length > 0) {
      multiplier += loadRequest.specialRequirements.length * 0.1;
    }

    return multiplier;
  }

  private assessAvailability(loadRequest: EmergencyLoadRequest): any {
    // Mock assessment - in production, this would query real data
    return {
      driversAvailable: Math.floor(Math.random() * 20) + 5,
      equipmentAvailable: Math.floor(Math.random() * 15) + 3,
      competingLoads: Math.floor(Math.random() * 10) + 2,
      availabilityScore: ['abundant', 'limited', 'scarce', 'critical'][
        Math.floor(Math.random() * 4)
      ] as 'abundant' | 'limited' | 'scarce' | 'critical',
    };
  }

  private assessRisks(loadRequest: EmergencyLoadRequest): any {
    const risks = ['low', 'medium', 'high'];
    return {
      deliveryRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      weatherRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      routeRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
      overallRisk: risks[Math.floor(Math.random() * 3)] as
        | 'low'
        | 'medium'
        | 'high',
    };
  }
}
