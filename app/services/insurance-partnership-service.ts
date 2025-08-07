/**
 * FleetFlow Insurance Partnership Service
 *
 * Implements virtual commercial insurance partnerships as REFERRAL PARTNER/LEAD GENERATOR
 * Partners: Covered Embedded Insurance, Coverdash, Tivly Affiliate Program, Insurify Partnership
 *
 * FleetFlow acts as technology platform facilitating connections to licensed providers
 * earning $300-$2,000+ commissions per policy without selling insurance directly
 */

export interface InsuranceQuoteRequest {
  id: string;
  tenantId: string;
  companyInfo: {
    businessName: string;
    mcNumber?: string;
    dotNumber?: string;
    businessType: 'trucking' | 'logistics' | 'warehouse' | 'other';
    yearsInBusiness: number;
    annualRevenue: number;
    employeeCount: number;
    businessAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    title: string;
  };
  insuranceTypes: InsuranceType[];
  fleetInfo?: {
    vehicleCount: number;
    vehicleTypes: string[];
    driversCount: number;
    operatingRadius: 'local' | 'regional' | 'long_haul';
    cargoTypes: string[];
    annualMileage: number;
  };
  currentInsurance?: {
    hasExistingCoverage: boolean;
    currentCarrier?: string;
    expirationDate?: string;
    claimsHistory: ClaimRecord[];
  };
  requestedCoverage: CoverageRequirements;
  created: Date;
  status: 'pending' | 'quoted' | 'converted' | 'declined';
}

export interface InsuranceType {
  type:
    | 'commercial_auto'
    | 'general_liability'
    | 'workers_comp'
    | 'cargo'
    | 'garage_liability'
    | 'cyber_liability';
  required: boolean;
  currentLimits?: string;
  desiredLimits?: string;
}

export interface CoverageRequirements {
  commercialAuto?: {
    liability: string; // e.g., "$1,000,000"
    physicalDamage: boolean;
    uninsuredMotorist: boolean;
    medicalPayments: string;
  };
  generalLiability?: {
    perOccurrence: string;
    aggregate: string;
    products: boolean;
    professional: boolean;
  };
  workersComp?: {
    required: boolean;
    stateRequirements: string[];
    payrollEstimate: number;
  };
  cargo?: {
    limit: string;
    deductible: string;
    cargoTypes: string[];
  };
}

export interface ClaimRecord {
  date: string;
  type: string;
  amount: number;
  status: 'open' | 'closed' | 'pending';
  description: string;
}

export interface InsuranceQuote {
  id: string;
  partnerId: string;
  partnerName: string;
  quoteNumber: string;
  requestId: string;
  coverageType: string;
  premium: {
    annual: number;
    monthly: number;
    paymentOptions: string[];
  };
  coverage: {
    limits: Record<string, string>;
    deductibles: Record<string, number>;
    features: string[];
  };
  carrier: {
    name: string;
    rating: string;
    amBestRating: string;
  };
  validUntil: string;
  terms: {
    policyTerm: string;
    effectiveDate: string;
    cancellationPolicy: string;
  };
  commissionInfo: {
    baseCommission: number;
    renewalCommission: number;
    estimatedAnnualValue: number;
  };
  contactInfo: {
    agentName: string;
    agentPhone: string;
    agentEmail: string;
  };
  nextSteps: string[];
  created: Date;
}

export interface PartnershipRevenue {
  partnerId: string;
  partnerName: string;
  totalCommissions: number;
  activePolices: number;
  renewalRevenue: number;
  conversionRate: number;
  averageCommission: number;
  monthlyRevenue: number;
  yearToDateRevenue: number;
  upcomingRenewals: number;
  lastUpdated: Date;
}

export class InsurancePartnershipService {
  private partnerships: Map<string, PartnershipRevenue> = new Map();
  private quotes: Map<string, InsuranceQuote[]> = new Map();
  private requests: Map<string, InsuranceQuoteRequest> = new Map();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Initialize demo partnership data
    const demoPartnerships: PartnershipRevenue[] = [
      {
        partnerId: 'covered-embedded',
        partnerName: 'Covered Embedded Insurance',
        totalCommissions: 45750,
        activePolices: 23,
        renewalRevenue: 12400,
        conversionRate: 0.34,
        averageCommission: 1987,
        monthlyRevenue: 8200,
        yearToDateRevenue: 45750,
        upcomingRenewals: 8,
        lastUpdated: new Date(),
      },
      {
        partnerId: 'coverdash',
        partnerName: 'Coverdash',
        totalCommissions: 28900,
        activePolices: 19,
        renewalRevenue: 7200,
        conversionRate: 0.28,
        averageCommission: 1521,
        monthlyRevenue: 4800,
        yearToDateRevenue: 28900,
        upcomingRenewals: 5,
        lastUpdated: new Date(),
      },
      {
        partnerId: 'tivly-affiliate',
        partnerName: 'Tivly Affiliate Program',
        totalCommissions: 67200,
        activePolices: 31,
        renewalRevenue: 18900,
        conversionRate: 0.42,
        averageCommission: 2168,
        monthlyRevenue: 11200,
        yearToDateRevenue: 67200,
        upcomingRenewals: 12,
        lastUpdated: new Date(),
      },
      {
        partnerId: 'insurify',
        partnerName: 'Insurify Partnership',
        totalCommissions: 52300,
        activePolices: 26,
        renewalRevenue: 14800,
        conversionRate: 0.38,
        averageCommission: 2012,
        monthlyRevenue: 8900,
        yearToDateRevenue: 52300,
        upcomingRenewals: 9,
        lastUpdated: new Date(),
      },
    ];

    demoPartnerships.forEach((partnership) => {
      this.partnerships.set(partnership.partnerId, partnership);
    });
  }

  /**
   * Submit insurance quote request to multiple partners
   */
  async submitQuoteRequest(request: InsuranceQuoteRequest): Promise<{
    requestId: string;
    estimatedQuotes: number;
    expectedResponse: string;
    trackingInfo: {
      coveredEmbedded: boolean;
      coverdash: boolean;
      tivly: boolean;
      insurify: boolean;
    };
  }> {
    // Store the request
    this.requests.set(request.id, request);

    // Simulate API calls to insurance partners (referral only)
    const trackingInfo = {
      coveredEmbedded: await this.submitToCoveredEmbedded(request),
      coverdash: await this.submitToCoverdash(request),
      tivly: await this.submitToTivly(request),
      insurify: await this.submitToInsurify(request),
    };

    const successfulSubmissions =
      Object.values(trackingInfo).filter(Boolean).length;

    return {
      requestId: request.id,
      estimatedQuotes: successfulSubmissions * 2, // Each partner typically provides 2-3 quotes
      expectedResponse: '24-48 hours',
      trackingInfo,
    };
  }

  /**
   * Get quotes for a specific request
   */
  async getQuotesForRequest(requestId: string): Promise<InsuranceQuote[]> {
    const quotes = this.quotes.get(requestId) || [];

    // If no quotes exist, generate demo quotes
    if (quotes.length === 0) {
      const demoQuotes = await this.generateDemoQuotes(requestId);
      this.quotes.set(requestId, demoQuotes);
      return demoQuotes;
    }

    return quotes;
  }

  /**
   * Get partnership revenue analytics
   */
  getPartnershipAnalytics(): {
    totalRevenue: number;
    totalPolicies: number;
    averageCommission: number;
    monthlyRecurring: number;
    partnerships: PartnershipRevenue[];
    projectedAnnual: number;
  } {
    const partnerships = Array.from(this.partnerships.values());

    const totalRevenue = partnerships.reduce(
      (sum, p) => sum + p.totalCommissions,
      0
    );
    const totalPolicies = partnerships.reduce(
      (sum, p) => sum + p.activePolices,
      0
    );
    const monthlyRecurring = partnerships.reduce(
      (sum, p) => sum + p.monthlyRevenue,
      0
    );
    const averageCommission =
      totalPolicies > 0 ? totalRevenue / totalPolicies : 0;

    return {
      totalRevenue,
      totalPolicies,
      averageCommission,
      monthlyRecurring,
      partnerships,
      projectedAnnual: monthlyRecurring * 12,
    };
  }

  /**
   * Track commission from successful policy conversion
   */
  async recordCommission(
    quoteId: string,
    policyDetails: {
      partnerId: string;
      commissionAmount: number;
      policyValue: number;
      renewalCommission: number;
      policyTerm: string;
    }
  ): Promise<void> {
    const partnership = this.partnerships.get(policyDetails.partnerId);
    if (partnership) {
      partnership.totalCommissions += policyDetails.commissionAmount;
      partnership.activePolices += 1;
      partnership.renewalRevenue += policyDetails.renewalCommission;
      partnership.monthlyRevenue += policyDetails.renewalCommission / 12;
      partnership.yearToDateRevenue += policyDetails.commissionAmount;
      partnership.averageCommission =
        partnership.totalCommissions / partnership.activePolices;
      partnership.lastUpdated = new Date();

      this.partnerships.set(policyDetails.partnerId, partnership);
    }
  }

  /**
   * Get upcoming renewal opportunities
   */
  getUpcomingRenewals(): Array<{
    partnerId: string;
    partnerName: string;
    policyCount: number;
    estimatedRevenue: number;
    renewalDate: string;
  }> {
    return Array.from(this.partnerships.values()).map((partnership) => ({
      partnerId: partnership.partnerId,
      partnerName: partnership.partnerName,
      policyCount: partnership.upcomingRenewals,
      estimatedRevenue:
        partnership.upcomingRenewals * partnership.averageCommission * 0.15, // 15% renewal commission
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 30 days from now
    }));
  }

  // Private methods for partner integrations (referral only - no direct insurance sales)

  private async submitToCoveredEmbedded(
    request: InsuranceQuoteRequest
  ): Promise<boolean> {
    try {
      // Simulate API call to Covered Embedded Insurance
      // In production, this would use their white-label API with SOC 2 certification
      console.log('Submitting referral to Covered Embedded Insurance:', {
        mcNumber: request.companyInfo.mcNumber,
        businessType: request.companyInfo.businessType,
        referralSource: 'FleetFlow',
      });

      // Simulate successful referral submission
      return true;
    } catch (error) {
      console.error('Covered Embedded Insurance referral failed:', error);
      return false;
    }
  }

  private async submitToCoverdash(
    request: InsuranceQuoteRequest
  ): Promise<boolean> {
    try {
      // Simulate API call to Coverdash (single-line NPM integration)
      console.log('Submitting referral to Coverdash:', {
        businessName: request.companyInfo.businessName,
        insuranceTypes: request.insuranceTypes,
        referralSource: 'FleetFlow',
      });

      return true;
    } catch (error) {
      console.error('Coverdash referral failed:', error);
      return false;
    }
  }

  private async submitToTivly(
    request: InsuranceQuoteRequest
  ): Promise<boolean> {
    try {
      // Simulate API call to Tivly Affiliate Program
      console.log('Submitting referral to Tivly:', {
        companyInfo: request.companyInfo,
        fleetSize: request.fleetInfo?.vehicleCount,
        referralSource: 'FleetFlow',
      });

      return true;
    } catch (error) {
      console.error('Tivly referral failed:', error);
      return false;
    }
  }

  private async submitToInsurify(
    request: InsuranceQuoteRequest
  ): Promise<boolean> {
    try {
      // Simulate API call to Insurify Partnership (120+ carriers)
      console.log('Submitting referral to Insurify:', {
        businessDetails: request.companyInfo,
        coverageNeeds: request.requestedCoverage,
        referralSource: 'FleetFlow',
      });

      return true;
    } catch (error) {
      console.error('Insurify referral failed:', error);
      return false;
    }
  }

  private async generateDemoQuotes(
    requestId: string
  ): Promise<InsuranceQuote[]> {
    const request = this.requests.get(requestId);
    if (!request) return [];

    const baseDate = new Date();
    const validUntil = new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000);

    return [
      {
        id: `quote-covered-${Date.now()}`,
        partnerId: 'covered-embedded',
        partnerName: 'Covered Embedded Insurance',
        quoteNumber:
          'COV-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        requestId,
        coverageType: 'Commercial Auto + General Liability',
        premium: {
          annual: 8450,
          monthly: 704,
          paymentOptions: ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'],
        },
        coverage: {
          limits: {
            'Auto Liability': '$1,000,000',
            'General Liability':
              '$1,000,000 per occurrence / $2,000,000 aggregate',
            'Physical Damage': 'Comprehensive & Collision',
          },
          deductibles: {
            Comprehensive: 1000,
            Collision: 1000,
          },
          features: [
            '24/7 Claims Support',
            'Fleet Management Tools',
            'Safety Programs',
            'Online Certificates',
          ],
        },
        carrier: {
          name: 'Progressive Commercial',
          rating: 'A+ (Superior)',
          amBestRating: 'A+',
        },
        validUntil: validUntil.toISOString(),
        terms: {
          policyTerm: '12 months',
          effectiveDate: baseDate.toISOString().split('T')[0],
          cancellationPolicy: '30-day notice required',
        },
        commissionInfo: {
          baseCommission: 1690,
          renewalCommission: 253,
          estimatedAnnualValue: 1943,
        },
        contactInfo: {
          agentName: 'Sarah Mitchell',
          agentPhone: '(555) 123-4567',
          agentEmail: 'sarah.mitchell@covered.com',
        },
        nextSteps: [
          'Review coverage details',
          'Complete application',
          'Provide additional documentation',
          'Schedule policy binding',
        ],
        created: new Date(),
      },
      {
        id: `quote-tivly-${Date.now()}`,
        partnerId: 'tivly-affiliate',
        partnerName: 'Tivly Affiliate Program',
        quoteNumber:
          'TIV-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        requestId,
        coverageType: 'Commercial Package Policy',
        premium: {
          annual: 7250,
          monthly: 604,
          paymentOptions: ['Annual', 'Quarterly', 'Monthly'],
        },
        coverage: {
          limits: {
            'Auto Liability': '$1,000,000',
            'General Liability':
              '$1,000,000 per occurrence / $2,000,000 aggregate',
            'Cargo Coverage': '$100,000',
            'Workers Compensation': 'As required by state',
          },
          deductibles: {
            Comprehensive: 500,
            Collision: 1000,
            Cargo: 1000,
          },
          features: [
            'Multi-Policy Discount',
            'Fleet Safety Program',
            'Claims Advocacy',
            'Risk Management',
          ],
        },
        carrier: {
          name: 'Travelers Commercial',
          rating: 'A++ (Superior)',
          amBestRating: 'A++',
        },
        validUntil: validUntil.toISOString(),
        terms: {
          policyTerm: '12 months',
          effectiveDate: baseDate.toISOString().split('T')[0],
          cancellationPolicy: '30-day notice required',
        },
        commissionInfo: {
          baseCommission: 2175,
          renewalCommission: 326,
          estimatedAnnualValue: 2501,
        },
        contactInfo: {
          agentName: 'Michael Rodriguez',
          agentPhone: '(555) 987-6543',
          agentEmail: 'michael.rodriguez@tivly.com',
        },
        nextSteps: [
          'Schedule consultation call',
          'Complete risk assessment',
          'Review policy terms',
          'Finalize coverage',
        ],
        created: new Date(),
      },
      {
        id: `quote-insurify-${Date.now()}`,
        partnerId: 'insurify',
        partnerName: 'Insurify Partnership',
        quoteNumber:
          'INS-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        requestId,
        coverageType: 'Commercial Transportation Package',
        premium: {
          annual: 9150,
          monthly: 763,
          paymentOptions: ['Annual', 'Semi-Annual', 'Quarterly', 'Monthly'],
        },
        coverage: {
          limits: {
            'Auto Liability': '$1,000,000',
            'General Liability':
              '$2,000,000 per occurrence / $4,000,000 aggregate',
            'Cargo Coverage': '$100,000',
            'Physical Damage': 'Full Coverage',
            'Garage Liability': '$1,000,000',
          },
          deductibles: {
            Comprehensive: 500,
            Collision: 500,
            Cargo: 500,
          },
          features: [
            'Premium Fleet Program',
            'Telematics Discount',
            'Safety Rewards',
            'Digital Claims',
          ],
        },
        carrier: {
          name: 'Liberty Mutual Commercial',
          rating: 'A (Excellent)',
          amBestRating: 'A',
        },
        validUntil: validUntil.toISOString(),
        terms: {
          policyTerm: '12 months',
          effectiveDate: baseDate.toISOString().split('T')[0],
          cancellationPolicy: '30-day notice required',
        },
        commissionInfo: {
          baseCommission: 1830,
          renewalCommission: 274,
          estimatedAnnualValue: 2104,
        },
        contactInfo: {
          agentName: 'Jennifer Chen',
          agentPhone: '(555) 456-7890',
          agentEmail: 'jennifer.chen@insurify.com',
        },
        nextSteps: [
          'Complete online application',
          'Upload required documents',
          'Schedule inspection',
          'Review final terms',
        ],
        created: new Date(),
      },
    ];
  }
}

// Singleton instance
export const insurancePartnershipService = new InsurancePartnershipService();
