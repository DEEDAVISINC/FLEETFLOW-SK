// Volume Discount Structure Service
// Manages tiered pricing and volume-based discount calculations

import { isFeatureEnabled } from '../config/feature-flags';
import { AnalysisResult, BaseService, ServiceResponse } from './base-service';

export interface CustomerVolumeData {
  customerId: string;
  customerName: string;
  monthlyVolume: number;
  quarterlyVolume: number;
  annualVolume: number;
  averageLoadValue: number;
  paymentTerms: string;
  creditRating: 'A' | 'B' | 'C' | 'D';
  loyaltyYears: number;
  seasonalityFactor: number;
}

export interface DiscountTier {
  tierName: string;
  minVolume: number;
  maxVolume: number;
  discountPercentage: number;
  additionalBenefits: string[];
  qualificationCriteria: string[];
}

export interface VolumeDiscountAnalysis
  extends AnalysisResult<CustomerVolumeData> {
  currentTier: DiscountTier;
  recommendedTier: DiscountTier;
  potentialSavings: number;
  nextTierRequirement: {
    volumeNeeded: number;
    timeframe: string;
    projectedSavings: number;
  };
  customDiscountRecommendation: {
    suggestedDiscount: number;
    reasoning: string;
    conditions: string[];
  };
}

export interface DiscountStructure {
  structureName: string;
  description: string;
  tiers: DiscountTier[];
  effectiveDate: string;
  expirationDate?: string;
  specialConditions: string[];
}

export interface VolumeProjection {
  timeframe: 'monthly' | 'quarterly' | 'annual';
  projectedVolume: number;
  confidenceLevel: number;
  seasonalAdjustments: number[];
  growthFactors: string[];
}

export class VolumeDiscountStructureService extends BaseService {
  constructor() {
    super('VolumeDiscountStructure');
  }

  async analyzeCustomerVolume(
    customerId: string
  ): Promise<ServiceResponse<VolumeDiscountAnalysis>> {
    try {
      if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
        return this.createErrorResponse(
          new Error('Volume Discount Structure feature is not enabled'),
          'analyzeCustomerVolume'
        );
      }

      this.log(
        'info',
        `Starting volume discount analysis for customer: ${customerId}`
      );

      const customerData = await this.gatherCustomerVolumeData(customerId);
      const analysis = await this.performVolumeDiscountAnalysis(customerData);

      this.log(
        'info',
        `Completed volume discount analysis for customer: ${customerId}`,
        {
          currentTier: analysis.currentTier.tierName,
          potentialSavings: analysis.potentialSavings,
        }
      );

      return this.createSuccessResponse(
        analysis,
        `Volume discount analysis completed for ${customerData.customerName}`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'analyzeCustomerVolume');
    }
  }

  async getDiscountStructures(): Promise<ServiceResponse<DiscountStructure[]>> {
    try {
      if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
        return this.createErrorResponse(
          new Error('Volume Discount Structure feature is not enabled'),
          'getDiscountStructures'
        );
      }

      this.log('info', 'Retrieving available discount structures');

      const structures = await this.getAvailableDiscountStructures();

      return this.createSuccessResponse(
        structures,
        `${structures.length} discount structures retrieved`
      );
    } catch (error) {
      return this.createErrorResponse(error, 'getDiscountStructures');
    }
  }

  async projectVolumeGrowth(
    customerId: string,
    timeframe: 'monthly' | 'quarterly' | 'annual' = 'quarterly'
  ): Promise<ServiceResponse<VolumeProjection>> {
    try {
      if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
        return this.createErrorResponse(
          new Error('Volume Discount Structure feature is not enabled'),
          'projectVolumeGrowth'
        );
      }

      this.log('info', `Projecting volume growth for customer: ${customerId}`);

      const projection = await this.calculateVolumeProjection(
        customerId,
        timeframe
      );

      return this.createSuccessResponse(
        projection,
        'Volume growth projection completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'projectVolumeGrowth');
    }
  }

  async calculateOptimalDiscount(
    customerData: CustomerVolumeData,
    competitorOffers?: number[]
  ): Promise<ServiceResponse<any>> {
    try {
      if (!isFeatureEnabled('VOLUME_DISCOUNT_STRUCTURE')) {
        return this.createErrorResponse(
          new Error('Volume Discount Structure feature is not enabled'),
          'calculateOptimalDiscount'
        );
      }

      this.log('info', 'Calculating optimal discount structure');

      const optimalDiscount = await this.determineOptimalDiscount(
        customerData,
        competitorOffers
      );

      return this.createSuccessResponse(
        optimalDiscount,
        'Optimal discount calculation completed'
      );
    } catch (error) {
      return this.createErrorResponse(error, 'calculateOptimalDiscount');
    }
  }

  // Private helper methods
  private async gatherCustomerVolumeData(
    customerId: string
  ): Promise<CustomerVolumeData> {
    // Mock data - in production, this would query the database
    return {
      customerId,
      customerName: 'Global Manufacturing Corp',
      monthlyVolume: 85000,
      quarterlyVolume: 255000,
      annualVolume: 1020000,
      averageLoadValue: 3200,
      paymentTerms: 'Net 30',
      creditRating: 'A',
      loyaltyYears: 3.5,
      seasonalityFactor: 1.15,
    };
  }

  private async performVolumeDiscountAnalysis(
    customerData: CustomerVolumeData
  ): Promise<VolumeDiscountAnalysis> {
    const analysis = await this.callAI('volume_discount_analysis', {
      customerData,
      analysisType: 'discount_optimization',
    });

    const discountTiers = await this.getDiscountTiers();
    const currentTier = this.determineCurrentTier(
      customerData.annualVolume,
      discountTiers
    );
    const recommendedTier = this.determineRecommendedTier(
      customerData,
      discountTiers
    );

    return {
      result: customerData,
      confidence: analysis.confidence || 88,
      reasoning:
        analysis.reasoning ||
        'Customer volume qualifies for enhanced discount tier',
      recommendations: analysis.recommendations || [
        'Implement tiered discount structure',
        'Offer volume commitment incentives',
        'Provide quarterly volume bonuses',
      ],
      riskFactors: analysis.riskFactors || [
        'Seasonal volume fluctuations',
        'Market competition',
      ],
      currentTier,
      recommendedTier,
      potentialSavings: this.calculatePotentialSavings(
        customerData,
        currentTier,
        recommendedTier
      ),
      nextTierRequirement: this.calculateNextTierRequirement(
        customerData,
        discountTiers
      ),
      customDiscountRecommendation: {
        suggestedDiscount: this.calculateCustomDiscount(customerData),
        reasoning: 'High-volume loyal customer with excellent credit rating',
        conditions: [
          'Minimum annual commitment of $1M',
          'Payment terms: Net 15',
          'Quarterly volume review',
        ],
      },
    };
  }

  private async getAvailableDiscountStructures(): Promise<DiscountStructure[]> {
    return [
      {
        structureName: 'Standard Volume Tiers',
        description: 'Traditional volume-based discount structure',
        tiers: await this.getDiscountTiers(),
        effectiveDate: '2024-01-01',
        specialConditions: ['Annual volume commitment required'],
      },
      {
        structureName: 'Loyalty Plus Program',
        description: 'Enhanced discounts for long-term customers',
        tiers: [
          {
            tierName: 'Loyalty Bronze',
            minVolume: 100000,
            maxVolume: 500000,
            discountPercentage: 8,
            additionalBenefits: ['Priority scheduling', 'Dedicated support'],
            qualificationCriteria: [
              '2+ years relationship',
              'Good payment history',
            ],
          },
          {
            tierName: 'Loyalty Silver',
            minVolume: 500000,
            maxVolume: 1000000,
            discountPercentage: 12,
            additionalBenefits: [
              'Priority scheduling',
              'Dedicated account manager',
              'Quarterly business reviews',
            ],
            qualificationCriteria: [
              '3+ years relationship',
              'Excellent credit',
            ],
          },
          {
            tierName: 'Loyalty Gold',
            minVolume: 1000000,
            maxVolume: Infinity,
            discountPercentage: 18,
            additionalBenefits: [
              'Priority scheduling',
              'Dedicated account manager',
              'Custom pricing solutions',
              'Executive relationship management',
            ],
            qualificationCriteria: [
              '5+ years relationship',
              'Strategic partnership',
            ],
          },
        ],
        effectiveDate: '2024-01-01',
        specialConditions: [
          'Loyalty program membership required',
          'Annual contract commitment',
        ],
      },
    ];
  }

  private async getDiscountTiers(): Promise<DiscountTier[]> {
    return [
      {
        tierName: 'Standard',
        minVolume: 0,
        maxVolume: 100000,
        discountPercentage: 0,
        additionalBenefits: ['Standard service'],
        qualificationCriteria: ['Active account'],
      },
      {
        tierName: 'Bronze',
        minVolume: 100000,
        maxVolume: 300000,
        discountPercentage: 3,
        additionalBenefits: ['Priority support', 'Volume reporting'],
        qualificationCriteria: ['$100K+ annual volume'],
      },
      {
        tierName: 'Silver',
        minVolume: 300000,
        maxVolume: 750000,
        discountPercentage: 6,
        additionalBenefits: [
          'Priority support',
          'Dedicated account manager',
          'Flexible payment terms',
        ],
        qualificationCriteria: ['$300K+ annual volume', 'Good payment history'],
      },
      {
        tierName: 'Gold',
        minVolume: 750000,
        maxVolume: 1500000,
        discountPercentage: 10,
        additionalBenefits: [
          'Priority support',
          'Dedicated account manager',
          'Custom pricing solutions',
          'Quarterly business reviews',
        ],
        qualificationCriteria: [
          '$750K+ annual volume',
          'Excellent credit rating',
        ],
      },
      {
        tierName: 'Platinum',
        minVolume: 1500000,
        maxVolume: Infinity,
        discountPercentage: 15,
        additionalBenefits: [
          'White-glove service',
          'Executive relationship management',
          'Custom solutions development',
          'Strategic partnership benefits',
        ],
        qualificationCriteria: [
          '$1.5M+ annual volume',
          'Multi-year contract',
          'Strategic partnership agreement',
        ],
      },
    ];
  }

  private async calculateVolumeProjection(
    customerId: string,
    timeframe: 'monthly' | 'quarterly' | 'annual'
  ): Promise<VolumeProjection> {
    return {
      timeframe,
      projectedVolume: 1200000, // 18% growth projected
      confidenceLevel: 82,
      seasonalAdjustments: [0.9, 1.1, 1.15, 0.95], // Q1, Q2, Q3, Q4
      growthFactors: [
        'Market expansion',
        'New product lines',
        'Improved service quality',
        'Competitive pricing',
      ],
    };
  }

  private async determineOptimalDiscount(
    customerData: CustomerVolumeData,
    competitorOffers?: number[]
  ): Promise<any> {
    const baseDiscount = this.calculateBaseDiscount(customerData);
    const competitiveAdjustment = competitorOffers
      ? Math.max(...competitorOffers) * 1.1
      : 0;
    const loyaltyBonus = customerData.loyaltyYears > 3 ? 2 : 0;

    return {
      optimalDiscount: Math.min(
        baseDiscount + loyaltyBonus + competitiveAdjustment,
        20
      ),
      components: {
        baseDiscount,
        competitiveAdjustment,
        loyaltyBonus,
      },
      reasoning: 'Optimized for customer retention and profitability',
      validityPeriod: '12 months',
    };
  }

  private determineCurrentTier(
    annualVolume: number,
    tiers: DiscountTier[]
  ): DiscountTier {
    return (
      tiers.find(
        (tier) =>
          annualVolume >= tier.minVolume && annualVolume < tier.maxVolume
      ) || tiers[0]
    );
  }

  private determineRecommendedTier(
    customerData: CustomerVolumeData,
    tiers: DiscountTier[]
  ): DiscountTier {
    // Consider projected growth and customer potential
    const projectedVolume = customerData.annualVolume * 1.18; // 18% growth
    return (
      tiers.find(
        (tier) =>
          projectedVolume >= tier.minVolume && projectedVolume < tier.maxVolume
      ) || tiers[tiers.length - 1]
    );
  }

  private calculatePotentialSavings(
    customerData: CustomerVolumeData,
    currentTier: DiscountTier,
    recommendedTier: DiscountTier
  ): number {
    const currentSavings =
      customerData.annualVolume * (currentTier.discountPercentage / 100);
    const recommendedSavings =
      customerData.annualVolume * (recommendedTier.discountPercentage / 100);
    return recommendedSavings - currentSavings;
  }

  private calculateNextTierRequirement(
    customerData: CustomerVolumeData,
    tiers: DiscountTier[]
  ): any {
    const currentTierIndex = tiers.findIndex(
      (tier) =>
        customerData.annualVolume >= tier.minVolume &&
        customerData.annualVolume < tier.maxVolume
    );

    if (currentTierIndex === -1 || currentTierIndex === tiers.length - 1) {
      return {
        volumeNeeded: 0,
        timeframe: 'N/A',
        projectedSavings: 0,
      };
    }

    const nextTier = tiers[currentTierIndex + 1];
    const volumeNeeded = nextTier.minVolume - customerData.annualVolume;
    const projectedSavings =
      nextTier.minVolume * (nextTier.discountPercentage / 100) -
      customerData.annualVolume *
        (tiers[currentTierIndex].discountPercentage / 100);

    return {
      volumeNeeded,
      timeframe: 'Annual',
      projectedSavings,
    };
  }

  private calculateCustomDiscount(customerData: CustomerVolumeData): number {
    let discount = 0;

    // Volume-based discount
    if (customerData.annualVolume >= 1500000) discount += 15;
    else if (customerData.annualVolume >= 750000) discount += 10;
    else if (customerData.annualVolume >= 300000) discount += 6;
    else if (customerData.annualVolume >= 100000) discount += 3;

    // Credit rating bonus
    if (customerData.creditRating === 'A') discount += 2;
    else if (customerData.creditRating === 'B') discount += 1;

    // Loyalty bonus
    if (customerData.loyaltyYears >= 5) discount += 3;
    else if (customerData.loyaltyYears >= 3) discount += 2;
    else if (customerData.loyaltyYears >= 1) discount += 1;

    return Math.min(discount, 20); // Cap at 20%
  }

  private calculateBaseDiscount(customerData: CustomerVolumeData): number {
    // Base discount calculation logic
    return Math.min((customerData.annualVolume / 100000) * 1.5, 15);
  }
}
