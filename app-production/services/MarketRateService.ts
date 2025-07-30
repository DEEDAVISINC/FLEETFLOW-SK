/**
 * MarketRateService - Real-time Market Intelligence and Competitive Analysis
 * Provides comprehensive market data for freight pricing optimization
 */

export interface MarketRateData {
  laneId: string;
  origin: string;
  destination: string;
  distance: number;
  equipmentType: string;
  currentRate: number;
  averageRate: number;
  rateRange: {
    min: number;
    max: number;
    percentile25: number;
    percentile75: number;
  };
  volatility: number;
  confidence: number;
  sampleSize: number;
  lastUpdated: string;
}

export interface CompetitorIntelligence {
  carrierId: string;
  carrierName: string;
  marketShare: number;
  averageRate: number;
  winRate: number;
  serviceScore: number;
  specializations: string[];
  geographicCoverage: string[];
  pricingStrategy: 'aggressive' | 'competitive' | 'premium';
  recentActivity: {
    quotesSubmitted: number;
    quotesWon: number;
    averageResponseTime: number;
    lastActive: string;
  };
}

export interface MarketTrends {
  timeframe: '7d' | '30d' | '90d' | '1y';
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number;
  confidence: number;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  forecast: Array<{
    date: string;
    predictedRate: number;
    confidence: number;
  }>;
}

export interface CapacityAnalysis {
  equipmentType: string;
  region: string;
  availability: 'surplus' | 'balanced' | 'tight' | 'critical';
  utilizationRate: number;
  averageLoadTime: number;
  seasonalPattern: {
    month: number;
    multiplier: number;
  }[];
  constraints: string[];
}

export interface DemandAnalysis {
  region: string;
  commodityType: string;
  demandLevel: 'low' | 'medium' | 'high' | 'critical';
  growth: number;
  seasonality: number;
  peakPeriods: Array<{
    start: string;
    end: string;
    multiplier: number;
  }>;
  driverFactors: string[];
}

export class MarketRateService {
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private apiEndpoints = {
    rates: '/api/market/rates',
    competitors: '/api/market/competitors',
    trends: '/api/market/trends',
    capacity: '/api/market/capacity',
    demand: '/api/market/demand'
  };

  constructor() {
    console.log('📊 MarketRateService initialized');
  }

  /**
   * Get real-time market rates for a specific lane
   */
  async getMarketRates(
    origin: string,
    destination: string,
    equipmentType: string = 'Dry Van',
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<MarketRateData> {
    const cacheKey = `rates-${origin}-${destination}-${equipmentType}-${timeframe}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`📈 Fetching market rates for ${origin} → ${destination}`);
      
      // In production, this would call external market data APIs
      const marketData = await this.fetchMarketData(origin, destination, equipmentType, timeframe);
      
      this.cache.set(cacheKey, marketData);
      return marketData;
      
    } catch (error) {
      console.error('Failed to fetch market rates:', error);
      return this.generateMockMarketData(origin, destination, equipmentType);
    }
  }

  /**
   * Get competitive intelligence for a lane
   */
  async getCompetitorIntelligence(
    origin: string,
    destination: string,
    equipmentType: string = 'Dry Van'
  ): Promise<CompetitorIntelligence[]> {
    const cacheKey = `competitors-${origin}-${destination}-${equipmentType}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`🎯 Analyzing competitors for ${origin} → ${destination}`);
      
      const competitors = await this.fetchCompetitorData(origin, destination, equipmentType);
      
      this.cache.set(cacheKey, competitors);
      return competitors;
      
    } catch (error) {
      console.error('Failed to fetch competitor intelligence:', error);
      return this.generateMockCompetitorData(origin, destination, equipmentType);
    }
  }

  /**
   * Get market trends and forecasting
   */
  async getMarketTrends(
    origin: string,
    destination: string,
    equipmentType: string = 'Dry Van',
    timeframe: '7d' | '30d' | '90d' | '1y' = '30d'
  ): Promise<MarketTrends> {
    const cacheKey = `trends-${origin}-${destination}-${equipmentType}-${timeframe}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`📊 Analyzing market trends for ${origin} → ${destination}`);
      
      const trends = await this.fetchTrendsData(origin, destination, equipmentType, timeframe);
      
      this.cache.set(cacheKey, trends);
      return trends;
      
    } catch (error) {
      console.error('Failed to fetch market trends:', error);
      return this.generateMockTrendsData(origin, destination, equipmentType, timeframe);
    }
  }

  /**
   * Get capacity analysis for equipment type and region
   */
  async getCapacityAnalysis(
    region: string,
    equipmentType: string = 'Dry Van'
  ): Promise<CapacityAnalysis> {
    const cacheKey = `capacity-${region}-${equipmentType}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`🚛 Analyzing capacity for ${equipmentType} in ${region}`);
      
      const capacity = await this.fetchCapacityData(region, equipmentType);
      
      this.cache.set(cacheKey, capacity);
      return capacity;
      
    } catch (error) {
      console.error('Failed to fetch capacity analysis:', error);
      return this.generateMockCapacityData(region, equipmentType);
    }
  }

  /**
   * Get demand analysis for region and commodity
   */
  async getDemandAnalysis(
    region: string,
    commodityType: string = 'General Freight'
  ): Promise<DemandAnalysis> {
    const cacheKey = `demand-${region}-${commodityType}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      console.log(`📦 Analyzing demand for ${commodityType} in ${region}`);
      
      const demand = await this.fetchDemandData(region, commodityType);
      
      this.cache.set(cacheKey, demand);
      return demand;
      
    } catch (error) {
      console.error('Failed to fetch demand analysis:', error);
      return this.generateMockDemandData(region, commodityType);
    }
  }

  /**
   * Get comprehensive market intelligence report
   */
  async getMarketIntelligenceReport(
    origin: string,
    destination: string,
    equipmentType: string = 'Dry Van'
  ) {
    console.log(`📋 Generating market intelligence report for ${origin} → ${destination}`);
    
    const [rates, competitors, trends, capacity, demand] = await Promise.all([
      this.getMarketRates(origin, destination, equipmentType),
      this.getCompetitorIntelligence(origin, destination, equipmentType),
      this.getMarketTrends(origin, destination, equipmentType),
      this.getCapacityAnalysis(this.getRegionFromCity(origin), equipmentType),
      this.getDemandAnalysis(this.getRegionFromCity(destination), 'General Freight')
    ]);

    return {
      summary: {
        laneId: `${origin}-${destination}`,
        equipmentType,
        currentRate: rates.currentRate,
        marketPosition: this.calculateMarketPosition(rates.currentRate, rates.averageRate),
        competitorCount: competitors.length,
        demandLevel: demand.demandLevel,
        capacityStatus: capacity.availability,
        trendDirection: trends.direction,
        lastUpdated: new Date().toISOString()
      },
      rates,
      competitors,
      trends,
      capacity,
      demand,
      recommendations: this.generateRecommendations(rates, competitors, trends, capacity, demand)
    };
  }

  /**
   * Real-time rate monitoring with alerts
   */
  async monitorRates(
    lanes: Array<{ origin: string; destination: string; equipmentType: string }>,
    thresholds: { minRate: number; maxRate: number; volatilityThreshold: number }
  ) {
    console.log(`🔔 Monitoring ${lanes.length} lanes for rate changes`);
    
    const alerts = [];
    
    for (const lane of lanes) {
      const rates = await this.getMarketRates(lane.origin, lane.destination, lane.equipmentType);
      
      if (rates.currentRate < thresholds.minRate) {
        alerts.push({
          type: 'LOW_RATE',
          lane: `${lane.origin} → ${lane.destination}`,
          currentRate: rates.currentRate,
          threshold: thresholds.minRate,
          severity: 'high'
        });
      }
      
      if (rates.currentRate > thresholds.maxRate) {
        alerts.push({
          type: 'HIGH_RATE',
          lane: `${lane.origin} → ${lane.destination}`,
          currentRate: rates.currentRate,
          threshold: thresholds.maxRate,
          severity: 'medium'
        });
      }
      
      if (rates.volatility > thresholds.volatilityThreshold) {
        alerts.push({
          type: 'HIGH_VOLATILITY',
          lane: `${lane.origin} → ${lane.destination}`,
          volatility: rates.volatility,
          threshold: thresholds.volatilityThreshold,
          severity: 'medium'
        });
      }
    }
    
    return alerts;
  }

  /**
   * Private helper methods
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  private async fetchMarketData(origin: string, destination: string, equipmentType: string, timeframe: string): Promise<MarketRateData> {
    // In production, integrate with real market data APIs
    // For now, return enhanced mock data
    return this.generateMockMarketData(origin, destination, equipmentType);
  }

  private async fetchCompetitorData(origin: string, destination: string, equipmentType: string): Promise<CompetitorIntelligence[]> {
    // In production, integrate with competitive intelligence APIs
    return this.generateMockCompetitorData(origin, destination, equipmentType);
  }

  private async fetchTrendsData(origin: string, destination: string, equipmentType: string, timeframe: string): Promise<MarketTrends> {
    return this.generateMockTrendsData(origin, destination, equipmentType, timeframe);
  }

  private async fetchCapacityData(region: string, equipmentType: string): Promise<CapacityAnalysis> {
    return this.generateMockCapacityData(region, equipmentType);
  }

  private async fetchDemandData(region: string, commodityType: string): Promise<DemandAnalysis> {
    return this.generateMockDemandData(region, commodityType);
  }

  private generateMockMarketData(origin: string, destination: string, equipmentType: string): MarketRateData {
    const baseRate = Math.floor(Math.random() * 1500) + 1500; // $1500-$3000
    const variance = baseRate * 0.15;
    
    return {
      laneId: `${origin}-${destination}`,
      origin,
      destination,
      distance: Math.floor(Math.random() * 1000) + 200,
      equipmentType,
      currentRate: baseRate,
      averageRate: baseRate * (0.95 + Math.random() * 0.1),
      rateRange: {
        min: baseRate - variance,
        max: baseRate + variance,
        percentile25: baseRate - variance * 0.5,
        percentile75: baseRate + variance * 0.5
      },
      volatility: Math.random() * 0.3 + 0.05, // 5-35% volatility
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      sampleSize: Math.floor(Math.random() * 100) + 50,
      lastUpdated: new Date().toISOString()
    };
  }

  private generateMockCompetitorData(origin: string, destination: string, equipmentType: string): CompetitorIntelligence[] {
    const competitors = [
      'Swift Transportation', 'J.B. Hunt', 'Schneider National', 'Werner Enterprises',
      'C.H. Robinson', 'XPO Logistics', 'Knight-Swift', 'Landstar System'
    ];

    return competitors.slice(0, Math.floor(Math.random() * 5) + 3).map((name, index) => ({
      carrierId: `COMP-${index + 1}`,
      carrierName: name,
      marketShare: Math.random() * 0.15 + 0.05, // 5-20% market share
      averageRate: Math.floor(Math.random() * 500) + 2000,
      winRate: Math.random() * 0.4 + 0.4, // 40-80% win rate
      serviceScore: Math.random() * 0.3 + 0.7, // 70-100% service score
      specializations: ['General Freight', 'Expedited', 'Temperature Controlled'].slice(0, Math.floor(Math.random() * 3) + 1),
      geographicCoverage: ['Southeast', 'Midwest', 'Southwest', 'Northeast'].slice(0, Math.floor(Math.random() * 3) + 1),
      pricingStrategy: ['aggressive', 'competitive', 'premium'][Math.floor(Math.random() * 3)] as any,
      recentActivity: {
        quotesSubmitted: Math.floor(Math.random() * 50) + 10,
        quotesWon: Math.floor(Math.random() * 20) + 5,
        averageResponseTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    }));
  }

  private generateMockTrendsData(origin: string, destination: string, equipmentType: string, timeframe: string): MarketTrends {
    const baseRate = 2500;
    const direction = ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as any;
    const magnitude = Math.random() * 0.2 + 0.05; // 5-25% change
    
    return {
      timeframe,
      direction,
      magnitude,
      confidence: Math.random() * 0.3 + 0.7,
      factors: [
        { factor: 'Fuel price changes', impact: Math.random() * 0.1 + 0.05, description: 'Recent fuel price volatility affecting rates' },
        { factor: 'Seasonal demand', impact: Math.random() * 0.15 + 0.05, description: 'Seasonal shipping patterns impact' },
        { factor: 'Capacity constraints', impact: Math.random() * 0.12 + 0.03, description: 'Limited equipment availability' }
      ],
      forecast: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedRate: baseRate + (Math.random() - 0.5) * 200,
        confidence: Math.random() * 0.2 + 0.7
      }))
    };
  }

  private generateMockCapacityData(region: string, equipmentType: string): CapacityAnalysis {
    const availability = ['surplus', 'balanced', 'tight', 'critical'][Math.floor(Math.random() * 4)] as any;
    
    return {
      equipmentType,
      region,
      availability,
      utilizationRate: Math.random() * 0.3 + 0.6, // 60-90% utilization
      averageLoadTime: Math.random() * 48 + 24, // 24-72 hours
      seasonalPattern: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        multiplier: Math.random() * 0.4 + 0.8 // 0.8-1.2 multiplier
      })),
      constraints: [
        'Driver shortage in region',
        'Maintenance capacity limits',
        'Seasonal demand fluctuations'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private generateMockDemandData(region: string, commodityType: string): DemandAnalysis {
    const demandLevel = ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any;
    
    return {
      region,
      commodityType,
      demandLevel,
      growth: (Math.random() - 0.5) * 0.3, // -15% to +15% growth
      seasonality: Math.random() * 0.4 + 0.8, // 0.8-1.2 seasonal factor
      peakPeriods: [
        { start: '2025-11-01', end: '2025-12-31', multiplier: 1.4 },
        { start: '2025-03-01', end: '2025-04-30', multiplier: 1.2 }
      ],
      driverFactors: [
        'E-commerce growth',
        'Manufacturing expansion',
        'Seasonal retail patterns'
      ].slice(0, Math.floor(Math.random() * 3) + 1)
    };
  }

  private calculateMarketPosition(currentRate: number, averageRate: number): string {
    const ratio = currentRate / averageRate;
    if (ratio < 0.95) return 'below market';
    if (ratio > 1.05) return 'above market';
    return 'at market';
  }

  private getRegionFromCity(city: string): string {
    const regions: { [key: string]: string } = {
      'Atlanta': 'Southeast',
      'Miami': 'Southeast',
      'Chicago': 'Midwest',
      'Dallas': 'Southwest',
      'Los Angeles': 'West',
      'Seattle': 'Northwest',
      'New York': 'Northeast',
      'Boston': 'Northeast'
    };
    
    const cityName = city.split(',')[0];
    return regions[cityName] || 'Unknown';
  }

  private generateRecommendations(
    rates: MarketRateData,
    competitors: CompetitorIntelligence[],
    trends: MarketTrends,
    capacity: CapacityAnalysis,
    demand: DemandAnalysis
  ): string[] {
    const recommendations = [];
    
    if (trends.direction === 'increasing') {
      recommendations.push('Market rates trending upward - consider premium pricing strategy');
    }
    
    if (capacity.availability === 'tight') {
      recommendations.push('Limited capacity - secure equipment early and adjust rates accordingly');
    }
    
    if (demand.demandLevel === 'high') {
      recommendations.push('High demand environment - opportunity for rate optimization');
    }
    
    const avgCompetitorRate = competitors.reduce((sum, c) => sum + c.averageRate, 0) / competitors.length;
    if (rates.currentRate < avgCompetitorRate * 0.9) {
      recommendations.push('Rates significantly below competition - consider increasing');
    }
    
    if (rates.volatility > 0.2) {
      recommendations.push('High rate volatility - monitor closely and adjust pricing frequently');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const marketRateService = new MarketRateService(); 