'use client';

// Unified Load Board Aggregation Service - Hybrid Approach
// Phase 1: Free APIs & Public Data
// Phase 2: Customer Success Metrics
// Phase 3: Partnership Negotiations

export interface UnifiedLoad {
  id: string;
  source:
    | 'DAT_FREE'
    | 'TRUCKSTOP_PUBLIC'
    | '123LOADBOARD'
    | 'GOVERNMENT'
    | 'TQL_PARTNER'
    | 'LANDSTAR_PARTNER'
    | 'SPOT_FREIGHT';
  sourceStatus: 'free' | 'public' | 'partnership' | 'customer_auth';

  // Load Details
  origin: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  destination: {
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };

  // Timing
  pickupDate: string;
  deliveryDate: string;
  postedDate: string;
  expirationDate?: string;

  // Financial
  rate: number;
  rateType: 'flat' | 'per_mile' | 'negotiable';
  fuelSurcharge?: number;
  accessorials?: string[];

  // Load Specifications
  weight: number;
  length?: number;
  equipment:
    | 'van'
    | 'reefer'
    | 'flatbed'
    | 'stepdeck'
    | 'lowboy'
    | 'tanker'
    | 'other';
  commodity: string;
  hazmat: boolean;

  // Distance & Route
  miles: number;
  deadheadMiles?: number;
  routeOptimized?: boolean;

  // Broker/Shipper Info
  brokerInfo: {
    name: string;
    phone?: string;
    email?: string;
    rating?: number;
    paymentTerms?: string;
    creditScore?: string;
  };

  // FleetGuard AI Integration
  riskLevel?: 'low' | 'medium' | 'high';
  fraudFlags?: string[];
  recommendationScore?: number;

  // Tracking
  lastUpdated: string;
  viewCount?: number;
  bidCount?: number;
}

export interface LoadBoardMetrics {
  totalLoads: number;
  averageRate: number;
  topSources: { source: string; count: number; avgRate: number }[];
  geographicDistribution: { state: string; count: number }[];
  equipmentDemand: { equipment: string; count: number; avgRate: number }[];
  timeToBook: { source: string; avgMinutes: number }[];
  partnershipROI: {
    source: string;
    freeVsPaid: { free: number; paid: number };
  }[];
}

class UnifiedLoadBoardService {
  private baseUrl = '/api/loadboards';

  // Phase 1: Free & Public APIs
  async getFreeAPILoads(): Promise<UnifiedLoad[]> {
    try {
      // Simulate API calls to free/public endpoints
      const freeLoads = await Promise.all([
        this.getDATFreeLoads(),
        this.getTruckstopPublicLoads(),
        this.get123LoadBoardPublic(),
        this.getGovernmentLoads(),
        this.getPublicFreightExchanges(),
      ]);

      return this.normalizeAndMerge(freeLoads.flat());
    } catch (error) {
      console.error('Free API loads fetch failed:', error);
      return this.getMockFreeLoads();
    }
  }

  // Phase 2: Customer Success Tracking
  async trackLoadBoardUsage(metrics: {
    loadViewed: string;
    source: string;
    action: 'viewed' | 'contacted' | 'booked';
    userId: string;
  }): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/metrics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics),
      });
    } catch (error) {
      console.error('Metrics tracking failed:', error);
    }
  }

  // Phase 3: Partnership Integration
  async getPartnershipLoads(): Promise<UnifiedLoad[]> {
    try {
      // Premium partnership APIs (when available)
      const partnerLoads = await Promise.all([
        this.getTQLPartnerLoads(),
        this.getLandstarPartnerLoads(),
        this.getSpotFreightPartnerLoads(),
      ]);

      return this.normalizeAndMerge(partnerLoads.flat());
    } catch (error) {
      console.error('Partnership loads fetch failed:', error);
      return [];
    }
  }

  // Unified Load Aggregation
  async getAllLoads(
    includePartnership: boolean = false
  ): Promise<UnifiedLoad[]> {
    try {
      const loadSources = [this.getFreeAPILoads()];

      if (includePartnership) {
        loadSources.push(this.getPartnershipLoads());
      }

      const allLoads = await Promise.all(loadSources);
      const mergedLoads = this.normalizeAndMerge(allLoads.flat());

      // Apply FleetGuard AI analysis
      return this.applyFleetGuardAnalysis(mergedLoads);
    } catch (error) {
      console.error('Load aggregation failed:', error);
      return this.getMockAllLoads();
    }
  }

  // Search and Filter
  async searchLoads(filters: {
    origin?: string;
    destination?: string;
    equipment?: string;
    minRate?: number;
    maxDeadhead?: number;
    pickupDateRange?: { start: string; end: string };
  }): Promise<UnifiedLoad[]> {
    const allLoads = await this.getAllLoads(true);

    return allLoads.filter((load) => {
      if (filters.origin && !this.matchesLocation(load.origin, filters.origin))
        return false;
      if (
        filters.destination &&
        !this.matchesLocation(load.destination, filters.destination)
      )
        return false;
      if (filters.equipment && load.equipment !== filters.equipment)
        return false;
      if (filters.minRate && load.rate < filters.minRate) return false;
      if (
        filters.maxDeadhead &&
        (load.deadheadMiles || 0) > filters.maxDeadhead
      )
        return false;
      if (filters.pickupDateRange) {
        const pickupDate = new Date(load.pickupDate);
        const start = new Date(filters.pickupDateRange.start);
        const end = new Date(filters.pickupDateRange.end);
        if (pickupDate < start || pickupDate > end) return false;
      }
      return true;
    });
  }

  // Analytics for Partnership Negotiations
  async getLoadBoardMetrics(): Promise<LoadBoardMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/metrics`);
      const result = await response.json();

      // Handle API response format: { success: true, data: {...} }
      if (result.success && result.data) {
        return result.data;
      }

      // Fallback to direct data if not wrapped
      return result;
    } catch (error) {
      console.error('Metrics fetch failed:', error);
      return this.getMockMetrics();
    }
  }

  // Private Methods
  private async getDATFreeLoads(): Promise<UnifiedLoad[]> {
    // DAT Free API integration
    return this.generateMockLoads('DAT_FREE', 15);
  }

  private async getTruckstopPublicLoads(): Promise<UnifiedLoad[]> {
    // Truckstop.com public API
    return this.generateMockLoads('TRUCKSTOP_PUBLIC', 12);
  }

  private async get123LoadBoardPublic(): Promise<UnifiedLoad[]> {
    // 123LoadBoard public API
    return this.generateMockLoads('123LOADBOARD', 18);
  }

  private async getGovernmentLoads(): Promise<UnifiedLoad[]> {
    // Government contracts (USPS, military, etc.)
    return this.generateMockLoads('GOVERNMENT', 8);
  }

  private async getPublicFreightExchanges(): Promise<UnifiedLoad[]> {
    // Public freight exchanges
    return this.generateMockLoads('DAT_FREE', 10);
  }

  private async getTQLPartnerLoads(): Promise<UnifiedLoad[]> {
    // TQL Partnership API (Phase 3)
    return this.generateMockLoads('TQL_PARTNER', 25);
  }

  private async getLandstarPartnerLoads(): Promise<UnifiedLoad[]> {
    // Landstar Partnership API (Phase 3)
    return this.generateMockLoads('LANDSTAR_PARTNER', 20);
  }

  private async getSpotFreightPartnerLoads(): Promise<UnifiedLoad[]> {
    // Spot Freight Partnership API (Phase 3)
    return this.generateMockLoads('SPOT_FREIGHT', 22);
  }

  private normalizeAndMerge(loads: UnifiedLoad[]): UnifiedLoad[] {
    // Remove duplicates and normalize data format
    const uniqueLoads = loads.filter(
      (load, index, self) => index === self.findIndex((l) => l.id === load.id)
    );

    // Sort by rate per mile (descending)
    return uniqueLoads.sort((a, b) => b.rate / b.miles - a.rate / a.miles);
  }

  private applyFleetGuardAnalysis(loads: UnifiedLoad[]): UnifiedLoad[] {
    return loads.map((load) => ({
      ...load,
      riskLevel: this.calculateRiskLevel(load),
      fraudFlags: this.detectFraudFlags(load),
      recommendationScore: this.calculateRecommendationScore(load),
    }));
  }

  private calculateRiskLevel(load: UnifiedLoad): 'low' | 'medium' | 'high' {
    let riskScore = 0;

    // High rate compared to market average
    if (load.rate / load.miles > 3.0) riskScore += 2;

    // New or unknown broker
    if (!load.brokerInfo.rating || load.brokerInfo.rating < 3) riskScore += 1;

    // Unusual pickup/delivery times
    const pickupDate = new Date(load.pickupDate);
    if (pickupDate.getTime() - Date.now() < 24 * 60 * 60 * 1000) riskScore += 1;

    return riskScore >= 3 ? 'high' : riskScore >= 1 ? 'medium' : 'low';
  }

  private detectFraudFlags(load: UnifiedLoad): string[] {
    const flags: string[] = [];

    if (load.rate / load.miles > 4.0) flags.push('Unusually high rate');
    if (!load.brokerInfo.phone) flags.push('No broker phone number');
    if (load.weight > 80000) flags.push('Overweight load');
    if (load.pickupDate === load.deliveryDate)
      flags.push('Same day pickup/delivery');

    return flags;
  }

  private calculateRecommendationScore(load: UnifiedLoad): number {
    let score = 50; // Base score

    // Rate per mile bonus
    const ratePerMile = load.rate / load.miles;
    if (ratePerMile > 2.5) score += 20;
    else if (ratePerMile > 2.0) score += 10;

    // Broker rating bonus
    if (load.brokerInfo.rating && load.brokerInfo.rating >= 4) score += 15;

    // Low deadhead bonus
    if ((load.deadheadMiles || 0) < 50) score += 10;

    // Risk level penalty
    if (load.riskLevel === 'high') score -= 30;
    else if (load.riskLevel === 'medium') score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  private matchesLocation(location: any, search: string): boolean {
    const searchLower = search.toLowerCase();
    return (
      location.city.toLowerCase().includes(searchLower) ||
      location.state.toLowerCase().includes(searchLower) ||
      location.zipCode.includes(search)
    );
  }

  private generateMockLoads(source: string, count: number): UnifiedLoad[] {
    const cities = [
      { city: 'Atlanta', state: 'GA', zipCode: '30309' },
      { city: 'Dallas', state: 'TX', zipCode: '75201' },
      { city: 'Chicago', state: 'IL', zipCode: '60601' },
      { city: 'Los Angeles', state: 'CA', zipCode: '90210' },
      { city: 'Miami', state: 'FL', zipCode: '33101' },
      { city: 'Phoenix', state: 'AZ', zipCode: '85001' },
      { city: 'Denver', state: 'CO', zipCode: '80202' },
      { city: 'Seattle', state: 'WA', zipCode: '98101' },
    ];

    const equipment = ['van', 'reefer', 'flatbed', 'stepdeck'];
    const commodities = [
      'General Freight',
      'Food Products',
      'Electronics',
      'Auto Parts',
      'Machinery',
    ];

    return Array.from({ length: count }, (_, i) => {
      const origin = cities[Math.floor(Math.random() * cities.length)];
      const destination = cities[Math.floor(Math.random() * cities.length)];
      const miles = Math.floor(Math.random() * 2000) + 100;
      const rate = Math.floor(miles * (1.8 + Math.random() * 1.5));

      return {
        id: `${source}-${Date.now()}-${i}`,
        source: source as any,
        sourceStatus: source.includes('PARTNER')
          ? 'partnership'
          : ('free' as any),
        origin,
        destination,
        pickupDate: new Date(
          Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        deliveryDate: new Date(
          Date.now() + Math.random() * 10 * 24 * 60 * 60 * 1000
        ).toISOString(),
        postedDate: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000
        ).toISOString(),
        rate,
        rateType: 'flat' as const,
        weight: Math.floor(Math.random() * 45000) + 5000,
        equipment: equipment[
          Math.floor(Math.random() * equipment.length)
        ] as any,
        commodity: commodities[Math.floor(Math.random() * commodities.length)],
        hazmat: Math.random() > 0.9,
        miles,
        deadheadMiles: Math.floor(Math.random() * 200),
        brokerInfo: {
          name: `${source.replace('_', ' ')} Logistics`,
          phone: `(555) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
          email:
            Math.random() > 0.3
              ? `dispatch@${source.toLowerCase().replace('_', '')}.com`
              : undefined,
          rating: Math.floor(Math.random() * 2) + 3,
          paymentTerms: 'Net 30',
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }

  private getMockFreeLoads(): UnifiedLoad[] {
    return this.generateMockLoads('DAT_FREE', 20);
  }

  private getMockAllLoads(): UnifiedLoad[] {
    return [
      ...this.generateMockLoads('DAT_FREE', 15),
      ...this.generateMockLoads('TRUCKSTOP_PUBLIC', 12),
      ...this.generateMockLoads('123LOADBOARD', 18),
      ...this.generateMockLoads('GOVERNMENT', 8),
      ...this.generateMockLoads('TQL_PARTNER', 25),
      ...this.generateMockLoads('LANDSTAR_PARTNER', 20),
    ];
  }

  private getMockMetrics(): LoadBoardMetrics {
    return {
      totalLoads: 1247,
      averageRate: 2850,
      topSources: [
        { source: 'TQL_PARTNER', count: 342, avgRate: 3200 },
        { source: 'DAT_FREE', count: 298, avgRate: 2650 },
        { source: 'LANDSTAR_PARTNER', count: 267, avgRate: 3100 },
        { source: '123LOADBOARD', count: 189, avgRate: 2400 },
        { source: 'TRUCKSTOP_PUBLIC', count: 151, avgRate: 2300 },
      ],
      geographicDistribution: [
        { state: 'TX', count: 187 },
        { state: 'CA', count: 156 },
        { state: 'FL', count: 134 },
        { state: 'IL', count: 98 },
        { state: 'GA', count: 87 },
      ],
      equipmentDemand: [
        { equipment: 'van', count: 456, avgRate: 2650 },
        { equipment: 'reefer', count: 342, avgRate: 3200 },
        { equipment: 'flatbed', count: 289, avgRate: 2950 },
        { equipment: 'stepdeck', count: 160, avgRate: 3400 },
      ],
      timeToBook: [
        { source: 'TQL_PARTNER', avgMinutes: 45 },
        { source: 'LANDSTAR_PARTNER', avgMinutes: 62 },
        { source: 'DAT_FREE', avgMinutes: 180 },
        { source: '123LOADBOARD', avgMinutes: 240 },
      ],
      partnershipROI: [
        { source: 'TQL', freeVsPaid: { free: 2650, paid: 3200 } },
        { source: 'LANDSTAR', freeVsPaid: { free: 2400, paid: 3100 } },
        { source: 'DAT', freeVsPaid: { free: 2200, paid: 2800 } },
      ],
    };
  }
}

export const unifiedLoadBoardService = new UnifiedLoadBoardService();
