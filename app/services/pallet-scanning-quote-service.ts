/**
 * Pallet Scanning Quote Service
 * Manages pricing and configuration for pallet scanning services
 * Integrates with FleetFlow's universal quote system
 */

export interface PalletScanningService {
  id: string;
  name: string;
  tier: 'basic' | 'premium' | 'enterprise';
  description: string;
  features: string[];
  basePrice: number;
  pricePerPallet?: number;
  maxPallets?: number;
  volumeDiscounts: VolumeDiscount[];
  industrySpecific?: string[];
  complianceFeatures?: string[];
}

export interface VolumeDiscount {
  minPallets: number;
  maxPallets?: number;
  discountPercentage: number;
  description: string;
}

export interface PalletScanningQuoteRequest {
  palletCount: number;
  serviceType: 'LTL' | 'FTL' | 'Specialized';
  industry?: string;
  complianceRequired?: boolean;
  customIntegration?: boolean;
  realTimeTracking?: boolean;
  photoDocumentation?: boolean;
  apiAccess?: boolean;
  dedicatedSupport?: boolean;
}

export interface PalletScanningQuoteResult {
  service: PalletScanningService;
  originalPrice: number;
  discountApplied: number;
  finalPrice: number;
  savings: number;
  features: string[];
  valuePropositions: string[];
  complianceBenefits?: string[];
}

export class PalletScanningQuoteService {
  private static instance: PalletScanningQuoteService;
  private services: PalletScanningService[];

  constructor() {
    this.services = this.initializeServices();
  }

  public static getInstance(): PalletScanningQuoteService {
    if (!PalletScanningQuoteService.instance) {
      PalletScanningQuoteService.instance = new PalletScanningQuoteService();
    }
    return PalletScanningQuoteService.instance;
  }

  private initializeServices(): PalletScanningService[] {
    return [
      {
        id: 'basic-scanning',
        name: 'Basic Pallet Scanning',
        tier: 'basic',
        description: 'Essential pallet tracking with QR code scanning',
        features: [
          'QR code scanning at pickup/delivery',
          'Basic status updates',
          'Delivery confirmation',
          'Standard support',
          'Mobile app access',
        ],
        basePrice: 35,
        volumeDiscounts: [
          {
            minPallets: 5,
            maxPallets: 10,
            discountPercentage: 10,
            description: '10% off for 5-10 pallets',
          },
          {
            minPallets: 11,
            maxPallets: 25,
            discountPercentage: 15,
            description: '15% off for 11-25 pallets',
          },
          {
            minPallets: 26,
            discountPercentage: 20,
            description: '20% off for 26+ pallets',
          },
        ],
      },
      {
        id: 'premium-scanning',
        name: 'Premium Real-Time Scanning',
        tier: 'premium',
        description:
          'Advanced tracking with GPS validation and real-time updates',
        features: [
          'GPS-validated scanning at all touchpoints',
          'Real-time notifications to shipper',
          'Detailed pallet-level tracking',
          'Photo documentation capability',
          'Priority support',
          'Customer portal access',
          'Basic API access',
        ],
        basePrice: 95,
        volumeDiscounts: [
          {
            minPallets: 5,
            maxPallets: 10,
            discountPercentage: 12,
            description: '12% off for 5-10 pallets',
          },
          {
            minPallets: 11,
            maxPallets: 25,
            discountPercentage: 18,
            description: '18% off for 11-25 pallets',
          },
          {
            minPallets: 26,
            discountPercentage: 25,
            description: '25% off for 26+ pallets',
          },
        ],
        industrySpecific: ['Retail', 'Pharmaceutical', 'Food & Beverage'],
        complianceFeatures: [
          'Chain of custody tracking',
          'Temperature monitoring alerts',
        ],
      },
      {
        id: 'enterprise-scanning',
        name: 'Enterprise Integration Scanning',
        tier: 'enterprise',
        description:
          'Complete supply chain visibility with custom integrations',
        features: [
          'All Premium features',
          'Custom integration with shipper TMS',
          'Advanced analytics and reporting',
          'Compliance documentation',
          'Dedicated account manager',
          'Full API access',
          'Custom workflows',
          'White-label options',
          'SLA guarantees',
        ],
        basePrice: 195,
        volumeDiscounts: [
          {
            minPallets: 5,
            maxPallets: 15,
            discountPercentage: 15,
            description: '15% off for 5-15 pallets',
          },
          {
            minPallets: 16,
            maxPallets: 50,
            discountPercentage: 22,
            description: '22% off for 16-50 pallets',
          },
          {
            minPallets: 51,
            discountPercentage: 30,
            description: '30% off for 51+ pallets',
          },
        ],
        industrySpecific: [
          'Pharmaceutical',
          'Automotive',
          'Aerospace',
          'Food & Beverage',
        ],
        complianceFeatures: [
          'FDA compliance tracking',
          'FSMA traceability',
          'DOT documentation',
          'Chain of custody certificates',
          'Temperature and humidity logging',
          'Audit trail reports',
        ],
      },
    ];
  }

  /**
   * Calculate quote for pallet scanning services
   */
  public calculateQuote(
    request: PalletScanningQuoteRequest
  ): PalletScanningQuoteResult[] {
    const results: PalletScanningQuoteResult[] = [];

    for (const service of this.services) {
      // Skip basic for enterprise requirements
      if (request.customIntegration && service.tier === 'basic') continue;

      // Skip non-premium for compliance requirements
      if (request.complianceRequired && service.tier === 'basic') continue;

      const originalPrice = this.calculateOriginalPrice(
        service,
        request.palletCount
      );
      const discount = this.calculateVolumeDiscount(
        service,
        request.palletCount
      );
      const finalPrice =
        originalPrice * (1 - discount.discountPercentage / 100);
      const savings = originalPrice - finalPrice;

      const result: PalletScanningQuoteResult = {
        service,
        originalPrice,
        discountApplied: discount.discountPercentage,
        finalPrice,
        savings,
        features: this.getApplicableFeatures(service, request),
        valuePropositions: this.getValuePropositions(service, request),
      };

      if (service.complianceFeatures && request.complianceRequired) {
        result.complianceBenefits = service.complianceFeatures;
      }

      results.push(result);
    }

    return results.sort((a, b) => a.finalPrice - b.finalPrice);
  }

  /**
   * Get recommended service based on requirements
   */
  public getRecommendedService(
    request: PalletScanningQuoteRequest
  ): PalletScanningService {
    if (request.customIntegration || request.dedicatedSupport) {
      return this.services.find((s) => s.tier === 'enterprise')!;
    }

    if (
      request.complianceRequired ||
      request.realTimeTracking ||
      request.apiAccess
    ) {
      return this.services.find((s) => s.tier === 'premium')!;
    }

    return this.services.find((s) => s.tier === 'basic')!;
  }

  /**
   * Get industry-specific recommendations
   */
  public getIndustryRecommendations(industry: string): PalletScanningService[] {
    return this.services.filter(
      (service) =>
        service.industrySpecific?.includes(industry) || service.tier === 'basic'
    );
  }

  /**
   * Calculate ROI and cost savings
   */
  public calculateROI(
    service: PalletScanningService,
    annualLoads: number,
    avgPalletCount: number
  ): {
    annualCost: number;
    estimatedSavings: number;
    roi: number;
    paybackMonths: number;
  } {
    const annualCost = service.basePrice * annualLoads;

    // Estimated savings from reduced claims, improved efficiency, etc.
    const claimReduction = annualLoads * avgPalletCount * 0.02 * 150; // 2% claim rate, $150 avg claim
    const efficiencyGains = annualLoads * 25; // $25 per load efficiency improvement
    const customerSatisfaction = annualLoads * 15; // $15 per load customer retention value

    const estimatedSavings =
      claimReduction + efficiencyGains + customerSatisfaction;
    const roi = ((estimatedSavings - annualCost) / annualCost) * 100;
    const paybackMonths = (annualCost / estimatedSavings) * 12;

    return {
      annualCost,
      estimatedSavings,
      roi,
      paybackMonths: Math.max(0, paybackMonths),
    };
  }

  private calculateOriginalPrice(
    service: PalletScanningService,
    palletCount: number
  ): number {
    return service.basePrice;
  }

  private calculateVolumeDiscount(
    service: PalletScanningService,
    palletCount: number
  ): VolumeDiscount {
    const applicableDiscounts = service.volumeDiscounts.filter(
      (discount) =>
        palletCount >= discount.minPallets &&
        (!discount.maxPallets || palletCount <= discount.maxPallets)
    );

    return applicableDiscounts.length > 0
      ? applicableDiscounts[applicableDiscounts.length - 1] // Get highest discount
      : { minPallets: 0, discountPercentage: 0, description: 'No discount' };
  }

  private getApplicableFeatures(
    service: PalletScanningService,
    request: PalletScanningQuoteRequest
  ): string[] {
    let features = [...service.features];

    if (request.complianceRequired && service.complianceFeatures) {
      features = features.concat(service.complianceFeatures);
    }

    return features;
  }

  private getValuePropositions(
    service: PalletScanningService,
    request: PalletScanningQuoteRequest
  ): string[] {
    const baseProps = [
      'Reduce freight claims by up to 85%',
      'Real-time visibility for customers',
      'Enhanced proof of delivery',
      'Improved operational efficiency',
    ];

    if (service.tier === 'premium' || service.tier === 'enterprise') {
      baseProps.push(
        'GPS-validated chain of custody',
        'Automated customer notifications',
        'Detailed analytics and reporting'
      );
    }

    if (service.tier === 'enterprise') {
      baseProps.push(
        'Custom TMS integration',
        'Dedicated account management',
        'SLA guarantees',
        'White-label options'
      );
    }

    if (request.complianceRequired) {
      baseProps.push(
        'Meet regulatory requirements',
        'Automated compliance documentation',
        'Audit-ready reporting'
      );
    }

    return baseProps;
  }

  /**
   * Get service by ID
   */
  public getServiceById(id: string): PalletScanningService | undefined {
    return this.services.find((service) => service.id === id);
  }

  /**
   * Get all available services
   */
  public getAllServices(): PalletScanningService[] {
    return [...this.services];
  }
}

// Export singleton instance
export const palletScanningQuoteService =
  PalletScanningQuoteService.getInstance();
