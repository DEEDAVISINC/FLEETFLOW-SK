/**
 * International Trade Service
 * Comprehensive cross-border freight solutions for DEPOINTE AI
 */

export interface TradeLane {
  id: string;
  origin: string;
  destination: string;
  transportMode: 'sea' | 'air' | 'ground' | 'multi-modal';
  averageTransitTime: number; // in days
  costPerKg: number;
  customsClearanceTime: number; // in hours
  reliabilityScore: number; // 0-100
  active: boolean;
}

export interface CustomsEntry {
  id: string;
  shipmentId: string;
  entryType: 'formal' | 'informal';
  htsCode: string;
  value: number;
  dutyAmount: number;
  status: 'pending' | 'cleared' | 'held' | 'rejected';
  submittedAt: Date;
  clearedAt?: Date;
}

export interface CurrencyHedge {
  id: string;
  shipmentId: string;
  baseCurrency: string;
  targetCurrency: string;
  amount: number;
  hedgeType: 'forward' | 'option' | 'swap';
  strikeRate: number;
  maturityDate: Date;
  premium?: number;
  status: 'active' | 'settled' | 'expired';
}

export class InternationalTradeService {
  private static tradeLanes: TradeLane[] = [
    {
      id: 'us-cn-sea',
      origin: 'US',
      destination: 'China',
      transportMode: 'sea',
      averageTransitTime: 21,
      costPerKg: 2.50,
      customsClearanceTime: 48,
      reliabilityScore: 85,
      active: true,
    },
    {
      id: 'us-eu-air',
      origin: 'US',
      destination: 'EU',
      transportMode: 'air',
      averageTransitTime: 8,
      costPerKg: 8.75,
      customsClearanceTime: 12,
      reliabilityScore: 92,
      active: true,
    },
    {
      id: 'us-mx-ground',
      origin: 'US',
      destination: 'Mexico',
      transportMode: 'ground',
      averageTransitTime: 2,
      costPerKg: 1.25,
      customsClearanceTime: 4,
      reliabilityScore: 95,
      active: true,
    },
  ];

  /**
   * Get available trade lanes between origin and destination
   */
  static getTradeLanes(origin: string, destination: string): TradeLane[] {
    return this.tradeLanes.filter(
      lane =>
        lane.origin === origin &&
        lane.destination === destination &&
        lane.active
    );
  }

  /**
   * Calculate optimal trade lane based on shipment requirements
   */
  static calculateOptimalTradeLane(
    origin: string,
    destination: string,
    weight: number,
    value: number,
    urgency: 'low' | 'medium' | 'high'
  ): TradeLane | null {
    const availableLanes = this.getTradeLanes(origin, destination);

    if (availableLanes.length === 0) return null;

    // Score lanes based on requirements
    const scoredLanes = availableLanes.map(lane => {
      let score = 0;

      // Cost factor (lower cost = higher score)
      score += (1 / lane.costPerKg) * 30;

      // Time factor (based on urgency)
      const timeWeight = urgency === 'high' ? 40 : urgency === 'medium' ? 25 : 15;
      score += (1 / lane.averageTransitTime) * timeWeight;

      // Reliability factor
      score += (lane.reliabilityScore / 100) * 25;

      return { ...lane, score };
    });

    // Return highest scoring lane
    return scoredLanes.sort((a, b) => b.score - a.score)[0];
  }

  /**
   * Submit customs entry for processing
   */
  static async submitCustomsEntry(entry: Omit<CustomsEntry, 'id' | 'submittedAt' | 'status'>): Promise<CustomsEntry> {
    const customsEntry: CustomsEntry = {
      ...entry,
      id: `CE-${Date.now()}`,
      submittedAt: new Date(),
      status: 'pending',
    };

    // Simulate API call to customs service
    console.log(`🤖 DEPOINTE AI: Submitting customs entry ${customsEntry.id} to CBP ACE`);

    // In a real implementation, this would call the actual customs API
    // For demo purposes, we'll simulate processing
    setTimeout(() => {
      customsEntry.status = 'cleared';
      customsEntry.clearedAt = new Date();
      console.log(`✅ Customs entry ${customsEntry.id} cleared successfully`);
    }, 2000);

    return customsEntry;
  }

  /**
   * Get real-time currency rates
   */
  static async getCurrencyRates(baseCurrency: string, targetCurrencies: string[]): Promise<Record<string, number>> {
    // Simulate currency API call
    const mockRates: Record<string, Record<string, number>> = {
      USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0, CNY: 6.45, MXN: 18.5 },
      EUR: { USD: 1.18, GBP: 0.86, JPY: 129.0, CNY: 7.58, MXN: 21.7 },
      GBP: { USD: 1.37, EUR: 1.16, JPY: 150.0, CNY: 8.80, MXN: 25.2 },
    };

    const rates: Record<string, number> = {};
    targetCurrencies.forEach(currency => {
      rates[currency] = mockRates[baseCurrency]?.[currency] || 1.0;
    });

    return rates;
  }

  /**
   * Create currency hedge for international transaction
   */
  static async createCurrencyHedge(hedge: Omit<CurrencyHedge, 'id' | 'status'>): Promise<CurrencyHedge> {
    const currencyHedge: CurrencyHedge = {
      ...hedge,
      id: `CH-${Date.now()}`,
      status: 'active',
    };

    // Calculate premium based on hedge type and amount
    const premiumRate = hedge.hedgeType === 'option' ? 0.02 : hedge.hedgeType === 'forward' ? 0.005 : 0.015;
    currencyHedge.premium = hedge.amount * premiumRate;

    console.log(`🤖 DEPOINTE AI: Created ${hedge.hedgeType} hedge for ${hedge.amount} ${hedge.baseCurrency}`);

    return currencyHedge;
  }

  /**
   * Get international shipping documentation requirements
   */
  static getDocumentationRequirements(origin: string, destination: string, transportMode: string): string[] {
    const baseDocuments = [
      'Commercial Invoice',
      'Packing List',
      'Certificate of Origin',
    ];

    const destinationSpecific: Record<string, string[]> = {
      'EU': ['EUR1 Movement Certificate', 'Intrastat Declaration'],
      'China': ['China Customs Declaration', 'Import License'],
      'Mexico': ['NAFTA Certificate', 'PEDIMENTO'],
      'Japan': ['Import Declaration', 'Quarantine Certificate'],
    };

    const modeSpecific: Record<string, string[]> = {
      'air': ['Air Waybill', 'Dangerous Goods Declaration (if applicable)'],
      'sea': ['Bill of Lading', 'Container Manifest'],
      'ground': ['CMR Document', 'TIR Carnet (if applicable)'],
    };

    return [
      ...baseDocuments,
      ...(destinationSpecific[destination] || []),
      ...(modeSpecific[transportMode] || []),
    ];
  }

  /**
   * Calculate total landed cost including duties and taxes
   */
  static calculateLandedCost(
    productValue: number,
    weight: number,
    origin: string,
    destination: string,
    htsCode: string
  ): {
    freightCost: number;
    dutyAmount: number;
    taxAmount: number;
    totalLandedCost: number;
  } {
    // Mock duty rates by HTS code category
    const dutyRates: Record<string, number> = {
      'electronics': 0.05, // 5%
      'machinery': 0.025, // 2.5%
      'textiles': 0.15, // 15%
      'chemicals': 0.08, // 8%
      'food': 0.12, // 12%
    };

    // Determine category from HTS code (simplified)
    const category = htsCode.startsWith('85') ? 'electronics' :
                    htsCode.startsWith('84') ? 'machinery' :
                    htsCode.startsWith('61') || htsCode.startsWith('62') ? 'textiles' :
                    htsCode.startsWith('28') || htsCode.startsWith('29') ? 'chemicals' :
                    htsCode.startsWith('21') || htsCode.startsWith('22') ? 'food' : 'electronics';

    const dutyRate = dutyRates[category] || 0.05;
    const taxRate = destination === 'EU' ? 0.20 : destination === 'China' ? 0.13 : 0.08;

    const freightCost = weight * 2.50; // Simplified freight calculation
    const dutyAmount = productValue * dutyRate;
    const taxableAmount = productValue + freightCost + dutyAmount;
    const taxAmount = taxableAmount * taxRate;

    return {
      freightCost,
      dutyAmount,
      taxAmount,
      totalLandedCost: productValue + freightCost + dutyAmount + taxAmount,
    };
  }

  /**
   * Get export readiness assessment for a company
   */
  static async assessExportReadiness(companyData: {
    companyName: string;
    industry: string;
    annualRevenue: number;
    exportExperience: 'none' | 'limited' | 'experienced';
    products: string[];
    targetMarkets: string[];
  }): Promise<{
    readinessScore: number;
    strengths: string[];
    gaps: string[];
    recommendations: string[];
    estimatedTimeline: string;
  }> {
    let score = 50; // Base score

    // Experience factor
    if (companyData.exportExperience === 'experienced') score += 30;
    else if (companyData.exportExperience === 'limited') score += 15;

    // Revenue factor
    if (companyData.annualRevenue > 10000000) score += 20;
    else if (companyData.annualRevenue > 1000000) score += 10;

    // Product complexity factor
    const highValueProducts = ['electronics', 'machinery', 'pharmaceuticals'];
    const hasHighValueProducts = companyData.products.some(product =>
      highValueProducts.some(hvp => product.toLowerCase().includes(hvp))
    );
    if (hasHighValueProducts) score += 15;

    // Market diversity factor
    if (companyData.targetMarkets.length > 3) score += 10;
    else if (companyData.targetMarkets.length > 1) score += 5;

    const strengths: string[] = [];
    const gaps: string[] = [];
    const recommendations: string[] = [];

    if (companyData.exportExperience !== 'none') {
      strengths.push('Existing export experience provides foundation');
    } else {
      gaps.push('No export experience requires comprehensive training');
      recommendations.push('Complete export readiness training program');
    }

    if (companyData.annualRevenue > 5000000) {
      strengths.push('Strong financial position supports export investment');
    } else {
      gaps.push('Limited financial resources may constrain export activities');
      recommendations.push('Secure export financing or credit insurance');
    }

    if (hasHighValueProducts) {
      strengths.push('High-value products command premium pricing');
      recommendations.push('Focus on markets with strong demand for specialized products');
    }

    if (companyData.targetMarkets.includes('EU') || companyData.targetMarkets.includes('China')) {
      strengths.push('Targeting high-growth international markets');
    } else {
      recommendations.push('Consider expanding to high-growth markets like EU or Asia');
    }

    const timeline = score > 80 ? '3-6 months' : score > 60 ? '6-12 months' : '12-18 months';

    return {
      readinessScore: Math.min(score, 100),
      strengths,
      gaps,
      recommendations,
      estimatedTimeline: timeline,
    };
  }
}

export default InternationalTradeService;
