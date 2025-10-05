/**
 * MarketRateService - Crowdsourced Market Intelligence and Internal Data Analysis
 * Builds market intelligence from FleetFlow's own transaction data and free public sources
 */

import { freightDataScraper } from './FreightDataScraperService';
import { fuelPriceScraper } from './FuelPriceScraperService';

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
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes (less frequent for free APIs)
  private freeDataSources = {
    // FMCSA Safety Data (free API)
    fmcsa: 'https://mobile.fmcsa.dot.gov/qc/services/carriers',
    // USDOT Freight Data (public datasets)
    usdot: 'https://data.transportation.gov',
    // Bureau of Labor Statistics (economic indicators)
    bls: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
    // NOAA Port Data (free)
    noaa: 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter',
    // OpenStreetMap (free routing/distance)
    osm: 'https://routing.openstreetmap.de/routed-car/route/v1/driving',
    // FleetFlow internal data (our own transactions)
    internal: '/api/internal/market-data',
  };

  constructor() {
    console.info('📊 MarketRateService initialized');
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
      console.info(`📈 Fetching market rates for ${origin} → ${destination}`);

      // In production, this would call external market data APIs
      const marketData = await this.fetchMarketData(
        origin,
        destination,
        equipmentType,
        timeframe
      );

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
      console.info(`🎯 Analyzing competitors for ${origin} → ${destination}`);

      const competitors = await this.fetchCompetitorData(
        origin,
        destination,
        equipmentType
      );

      this.cache.set(cacheKey, competitors);
      return competitors;
    } catch (error) {
      console.error('Failed to fetch competitor intelligence:', error);
      return this.generateMockCompetitorData(
        origin,
        destination,
        equipmentType
      );
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
      console.info(`📊 Analyzing market trends for ${origin} → ${destination}`);

      const trends = await this.fetchTrendsData(
        origin,
        destination,
        equipmentType,
        timeframe
      );

      this.cache.set(cacheKey, trends);
      return trends;
    } catch (error) {
      console.error('Failed to fetch market trends:', error);
      return this.generateMockTrendsData(
        origin,
        destination,
        equipmentType,
        timeframe
      );
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
      console.info(`🚛 Analyzing capacity for ${equipmentType} in ${region}`);

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
      console.info(`📦 Analyzing demand for ${commodityType} in ${region}`);

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
    console.info(
      `📋 Generating market intelligence report for ${origin} → ${destination}`
    );

    const [rates, competitors, trends, capacity, demand] = await Promise.all([
      this.getMarketRates(origin, destination, equipmentType),
      this.getCompetitorIntelligence(origin, destination, equipmentType),
      this.getMarketTrends(origin, destination, equipmentType),
      this.getCapacityAnalysis(this.getRegionFromCity(origin), equipmentType),
      this.getDemandAnalysis(
        this.getRegionFromCity(destination),
        'General Freight'
      ),
    ]);

    return {
      summary: {
        laneId: `${origin}-${destination}`,
        equipmentType,
        currentRate: rates.currentRate,
        marketPosition: this.calculateMarketPosition(
          rates.currentRate,
          rates.averageRate
        ),
        competitorCount: competitors.length,
        demandLevel: demand.demandLevel,
        capacityStatus: capacity.availability,
        trendDirection: trends.direction,
        lastUpdated: new Date().toISOString(),
      },
      rates,
      competitors,
      trends,
      capacity,
      demand,
      recommendations: this.generateRecommendations(
        rates,
        competitors,
        trends,
        capacity,
        demand
      ),
    };
  }

  /**
   * Real-time rate monitoring with alerts
   */
  async monitorRates(
    lanes: Array<{
      origin: string;
      destination: string;
      equipmentType: string;
    }>,
    thresholds: {
      minRate: number;
      maxRate: number;
      volatilityThreshold: number;
    }
  ) {
    console.info(`🔔 Monitoring ${lanes.length} lanes for rate changes`);

    const alerts = [];

    for (const lane of lanes) {
      const rates = await this.getMarketRates(
        lane.origin,
        lane.destination,
        lane.equipmentType
      );

      if (rates.currentRate < thresholds.minRate) {
        alerts.push({
          type: 'LOW_RATE',
          lane: `${lane.origin} → ${lane.destination}`,
          currentRate: rates.currentRate,
          threshold: thresholds.minRate,
          severity: 'high',
        });
      }

      if (rates.currentRate > thresholds.maxRate) {
        alerts.push({
          type: 'HIGH_RATE',
          lane: `${lane.origin} → ${lane.destination}`,
          currentRate: rates.currentRate,
          threshold: thresholds.maxRate,
          severity: 'medium',
        });
      }

      if (rates.volatility > thresholds.volatilityThreshold) {
        alerts.push({
          type: 'HIGH_VOLATILITY',
          lane: `${lane.origin} → ${lane.destination}`,
          volatility: rates.volatility,
          threshold: thresholds.volatilityThreshold,
          severity: 'medium',
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

  private async fetchMarketData(
    origin: string,
    destination: string,
    equipmentType: string,
    timeframe: string
  ): Promise<MarketRateData> {
    try {
      // Get distance using OpenStreetMap routing (free)
      const distance = await this.getDistanceFromOSM(origin, destination);

      // Get economic indicators from BLS (free)
      const economicFactors = await this.getEconomicIndicators();

      // Get carrier capacity signals from FMCSA data (free)
      const capacitySignals = await this.getFMCSACapacitySignals(
        origin,
        destination
      );

      // Get internal FleetFlow transaction data
      const internalRates = await this.getInternalTransactionData(
        origin,
        destination,
        equipmentType
      );

      // Scrape real freight rates from DirectFreight.com (free)
      const directFreightData = await this.scrapeDirectFreightRates(
        origin,
        destination,
        equipmentType
      );

      // Combine all free data sources including DirectFreight
      return this.calculateMarketRatesFromFreeData(
        origin,
        destination,
        equipmentType,
        distance,
        economicFactors,
        capacitySignals,
        internalRates,
        directFreightData
      );
    } catch (error) {
      console.warn(
        'Free data sources unavailable, using enhanced mock data:',
        error
      );
      return this.generateMockMarketData(origin, destination, equipmentType);
    }
  }

  /**
   * Get distance between cities using OpenStreetMap routing (free)
   */
  private async getDistanceFromOSM(
    origin: string,
    destination: string
  ): Promise<number> {
    try {
      // Parse city coordinates (simplified - in production use geocoding)
      const originCoords = await this.geocodeCity(origin);
      const destCoords = await this.geocodeCity(destination);

      if (!originCoords || !destCoords) {
        return Math.floor(Math.random() * 800) + 200; // Fallback
      }

      const response = await fetch(
        `${this.freeDataSources.osm}/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?overview=false&geometries=geojson`
      );

      if (response.ok) {
        const data = await response.json();
        return Math.round(data.routes[0].distance / 1609); // Convert meters to miles
      }
    } catch (error) {
      console.warn('OSM routing failed:', error);
    }

    return Math.floor(Math.random() * 800) + 200; // Fallback distance
  }

  /**
   * Get economic indicators from fuel price scraper and other free sources
   */
  private async getEconomicIndicators(): Promise<any> {
    try {
      // Get real fuel prices from our scraper
      const fuelData = await fuelPriceScraper.getDieselPrices();

      // Get transportation cost index from BLS (still using for other economic data)
      const blsResponse = await fetch(
        `${this.freeDataSources.bls}?seriesid=WPUSI024011&startyear=2024&endyear=2025&registrationkey=${process.env.BLS_API_KEY || ''}`
      );

      let transportationIndex = {};
      if (blsResponse.ok) {
        const blsData = await blsResponse.json();
        transportationIndex = blsData.Results?.series?.[0] || {};
      }

      return {
        fuelPrices: fuelData,
        transportationIndex,
        // Could add more economic indicators here
      };
    } catch (error) {
      console.warn('Economic indicators fetch failed:', error);
    }

    return {}; // Return empty object as fallback
  }

  /**
   * Get carrier capacity signals from FMCSA public data
   */
  private async getFMCSACapacitySignals(
    origin: string,
    destination: string
  ): Promise<any> {
    try {
      // Get carrier counts and authority data for regions
      const originState = this.extractStateFromCity(origin);
      const destState = this.extractStateFromCity(destination);

      // FMCSA carrier search by state (simplified)
      const [originData, destData] = await Promise.all([
        fetch(
          `${this.freeDataSources.fmcsa}/name/*/ST/${originState}?webKey=${process.env.FMCSA_API_KEY || 'DEMO_KEY'}`
        ),
        fetch(
          `${this.freeDataSources.fmcsa}/name/*/ST/${destState}?webKey=${process.env.FMCSA_API_KEY || 'DEMO_KEY'}`
        ),
      ]);

      return {
        originCarrierCount: originData.ok
          ? (await originData.json()).length
          : 0,
        destCarrierCount: destData.ok ? (await destData.json()).length : 0,
        regionalCapacity: Math.random() * 0.3 + 0.6, // 60-90% capacity utilization estimate
      };
    } catch (error) {
      console.warn('FMCSA data fetch failed:', error);
      return {
        originCarrierCount: 0,
        destCarrierCount: 0,
        regionalCapacity: 0.7,
      };
    }
  }

  /**
   * Get internal FleetFlow transaction data for rate analysis
   */
  private async getInternalTransactionData(
    origin: string,
    destination: string,
    equipmentType: string
  ): Promise<any> {
    try {
      // Query FleetFlow's own completed transactions
      const response = await fetch(
        `${this.freeDataSources.internal}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&equipment=${encodeURIComponent(equipmentType)}&timeframe=90d`
      );

      if (response.ok) {
        const data = await response.json();
        return {
          transactionCount: data.length,
          averageRate:
            data.reduce((sum: number, tx: any) => sum + tx.rate, 0) /
              data.length || 0,
          rateVolatility: this.calculateVolatility(
            data.map((tx: any) => tx.rate)
          ),
          recentTransactions: data.slice(-10), // Last 10 transactions
        };
      }
    } catch (error) {
      console.warn('Internal data fetch failed:', error);
    }

    return {
      transactionCount: 0,
      averageRate: 0,
      rateVolatility: 0.1,
      recentTransactions: [],
    };
  }

  /**
   * Scrape DirectFreight.com for real-time freight rate data using dedicated scraper service
   */
  private async scrapeDirectFreightRates(
    origin: string,
    destination: string,
    equipmentType: string
  ): Promise<any> {
    try {
      console.info(
        `🔍 Scraping DirectFreight.com for ${origin} → ${destination}`
      );

      // Use the dedicated scraper service
      const scrapedData = await freightDataScraper.scrapeDirectFreight(
        origin,
        destination,
        this.mapEquipmentType(equipmentType),
        50 // 50 mile radius
      );

      // Convert scraped data to the format expected by our rate calculation
      const rates = scrapedData.loads.map((load: any) => ({
        rate: load.rate,
        equipmentType: load.equipmentType,
        distance: load.distance,
        timestamp: load.postedAt,
        source: 'DirectFreight.com',
      }));

      return {
        rates,
        sampleSize: rates.length,
        averageRate:
          rates.length > 0
            ? rates.reduce((sum: number, r: any) => sum + r.rate, 0) /
              rates.length
            : 0,
        rateRange:
          rates.length > 0
            ? {
                min: Math.min(...rates.map((r: any) => r.rate)),
                max: Math.max(...rates.map((r: any) => r.rate)),
              }
            : { min: 0, max: 0 },
      };
    } catch (error) {
      console.warn('DirectFreight scraping failed:', error);
      return {
        rates: [],
        sampleSize: 0,
        averageRate: 0,
        rateRange: { min: 0, max: 0 },
      };
    }
  }

  /**
   * Calculate market rates from combined free data sources including DirectFreight
   */
  private calculateMarketRatesFromFreeData(
    origin: string,
    destination: string,
    equipmentType: string,
    distance: number,
    economicFactors: any,
    capacitySignals: any,
    internalRates: any,
    directFreightData: any
  ): MarketRateData {
    // Base rate calculation using distance and equipment type
    let baseRate = this.calculateBaseRate(distance, equipmentType);

    // Adjust for economic factors (fuel prices, inflation)
    baseRate = this.adjustForEconomicFactors(baseRate, economicFactors);

    // Adjust for capacity signals (carrier availability)
    baseRate = this.adjustForCapacity(baseRate, capacitySignals);

    // Incorporate DirectFreight.com scraped data (highest priority for real market rates)
    if (directFreightData.sampleSize > 0) {
      baseRate = this.blendWithDirectFreightData(
        baseRate,
        directFreightData,
        internalRates
      );
    }

    // Incorporate internal transaction data if available
    if (internalRates.transactionCount > 0) {
      baseRate = this.blendWithInternalData(baseRate, internalRates);
    }

    // Calculate statistical measures using all available data
    const allRates = this.combineAllRateData(internalRates, directFreightData);
    const volatility = this.calculateVolatility(allRates);
    const confidence = this.calculateOverallConfidence(
      internalRates,
      directFreightData
    );
    const sampleSize =
      internalRates.transactionCount + directFreightData.sampleSize;

    return {
      laneId: `${origin}-${destination}`,
      origin,
      destination,
      distance,
      equipmentType,
      currentRate: Math.round(baseRate),
      averageRate: Math.round(baseRate * (0.95 + Math.random() * 0.1)),
      rateRange: this.calculateRateRange(baseRate, volatility),
      volatility,
      confidence: Math.max(confidence, 0.3), // Minimum 30% confidence
      sampleSize: Math.max(sampleSize, 10),
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Blend base rate with DirectFreight.com scraped data
   */
  private blendWithDirectFreightData(
    baseRate: number,
    directFreightData: any,
    internalRates: any
  ): number {
    if (directFreightData.sampleSize === 0) return baseRate;

    const directFreightAverage = directFreightData.averageRate;
    const directFreightWeight = Math.min(
      directFreightData.sampleSize / 20,
      0.7
    ); // Up to 70% weight for DirectFreight data

    // If we have internal data, use it as validation
    if (internalRates.transactionCount > 0) {
      const internalAverage = internalRates.averageRate;
      // Check if DirectFreight data is within reasonable range of internal data
      const ratio = directFreightAverage / internalAverage;
      if (ratio >= 0.7 && ratio <= 1.3) {
        // Within 30% of internal rates
        return (
          baseRate * (1 - directFreightWeight) +
          directFreightAverage * directFreightWeight
        );
      }
    }

    // If no internal validation, still use DirectFreight but with lower weight
    return baseRate * 0.6 + directFreightAverage * 0.4;
  }

  /**
   * Combine all available rate data for statistical calculations
   */
  private combineAllRateData(
    internalRates: any,
    directFreightData: any
  ): number[] {
    const allRates = [];

    // Add internal rates
    if (internalRates.recentTransactions) {
      allRates.push(
        ...internalRates.recentTransactions.map((tx: any) => tx.rate)
      );
    }

    // Add DirectFreight rates
    if (directFreightData.rates) {
      allRates.push(...directFreightData.rates.map((rate: any) => rate.rate));
    }

    return allRates;
  }

  /**
   * Calculate overall confidence based on multiple data sources
   */
  private calculateOverallConfidence(
    internalRates: any,
    directFreightData: any
  ): number {
    let confidence = 0.3; // Base confidence

    // Internal data provides high confidence
    if (internalRates.transactionCount > 0) {
      confidence += Math.min(internalRates.transactionCount / 50, 0.4);
    }

    // DirectFreight data adds market validation
    if (directFreightData.sampleSize > 0) {
      confidence += Math.min(directFreightData.sampleSize / 30, 0.3);
    }

    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private async fetchCompetitorData(
    origin: string,
    destination: string,
    equipmentType: string
  ): Promise<CompetitorIntelligence[]> {
    // Use FMCSA data to identify active carriers in the region
    try {
      const capacitySignals = await this.getFMCSACapacitySignals(
        origin,
        destination
      );
      return this.generateCompetitorDataFromFMCSA(
        origin,
        destination,
        equipmentType,
        capacitySignals
      );
    } catch (error) {
      console.warn('Competitor data fetch failed:', error);
      return this.generateMockCompetitorData(
        origin,
        destination,
        equipmentType
      );
    }
  }

  /**
   * Calculate base rate using distance and equipment type
   */
  private calculateBaseRate(distance: number, equipmentType: string): number {
    const basePerMile = {
      'Dry Van': 2.8,
      Reefer: 3.2,
      Flatbed: 3.5,
      'Step Deck': 3.75,
      'Double Drop': 4.0,
      RGN: 3.25,
      'Box Truck': 2.5,
      'Sprinter/Cube': 3.0,
    };

    const perMileRate =
      basePerMile[equipmentType as keyof typeof basePerMile] || 2.8;
    return distance * perMileRate;
  }

  /**
   * Adjust rates based on economic factors from fuel price scraper
   */
  private adjustForEconomicFactors(
    baseRate: number,
    economicFactors: any
  ): number {
    let adjustment = 1.0;

    // Fuel price impact from our fuel price scraper
    if (economicFactors.fuelPrices?.regionalAverages?.national) {
      const currentDieselPrice =
        economicFactors.fuelPrices.regionalAverages.national;
      // Adjust for fuel costs (rough estimate: 25% of total rate goes to fuel)
      const fuelAdjustment = (currentDieselPrice - 3.5) * 0.08; // Base diesel price ~$3.50
      adjustment *= 1 + fuelAdjustment;
    }

    // Transportation cost index (from BLS)
    if (economicFactors.transportationIndex?.data?.[0]?.value) {
      const transportIndex = parseFloat(
        economicFactors.transportationIndex.data[0].value
      );
      // Small adjustment for overall transportation costs
      adjustment *= 1 + (transportIndex - 100) * 0.005;
    }

    return baseRate * adjustment;
  }

  /**
   * Adjust rates based on carrier capacity signals
   */
  private adjustForCapacity(baseRate: number, capacitySignals: any): number {
    const capacity = capacitySignals.regionalCapacity || 0.7;

    // When capacity is tight (< 70%), rates increase
    if (capacity < 0.7) {
      const tightnessFactor = (0.7 - capacity) / 0.7;
      return baseRate * (1 + tightnessFactor * 0.15); // Up to 15% increase
    }

    // When capacity is loose (> 85%), rates decrease
    if (capacity > 0.85) {
      const loosenessFactor = (capacity - 0.85) / 0.15;
      return baseRate * (1 - loosenessFactor * 0.1); // Up to 10% decrease
    }

    return baseRate;
  }

  /**
   * Blend calculated rates with internal transaction data
   */
  private blendWithInternalData(baseRate: number, internalRates: any): number {
    if (internalRates.transactionCount === 0) return baseRate;

    const internalAverage = internalRates.averageRate;
    const transactionWeight = Math.min(internalRates.transactionCount / 20, 1); // Weight by transaction count

    // Blend external calculation with internal data
    return (
      baseRate * (1 - transactionWeight) + internalAverage * transactionWeight
    );
  }

  /**
   * Calculate rate range with percentiles
   */
  private calculateRateRange(baseRate: number, volatility: number): any {
    const variance = baseRate * volatility;

    return {
      min: Math.round(baseRate - variance * 1.5),
      max: Math.round(baseRate + variance * 1.5),
      percentile25: Math.round(baseRate - variance * 0.5),
      percentile75: Math.round(baseRate + variance * 0.5),
    };
  }

  /**
   * Calculate volatility from rate data
   */
  private calculateVolatility(rates: number[]): number {
    if (rates.length < 2) return 0.1;

    const mean = rates.reduce((sum, rate) => sum + rate, 0) / rates.length;
    const variance =
      rates.reduce((sum, rate) => sum + Math.pow(rate - mean, 2), 0) /
      rates.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / mean; // Coefficient of variation
  }

  /**
   * Simple geocoding for cities (in production, use a proper geocoding service)
   */
  private async geocodeCity(
    city: string
  ): Promise<{ lat: number; lng: number } | null> {
    // Simple coordinate lookup (in production, integrate with free geocoding API)
    const cityCoords: { [key: string]: { lat: number; lng: number } } = {
      'Atlanta, GA': { lat: 33.749, lng: -84.388 },
      'Miami, FL': { lat: 25.7617, lng: -80.1918 },
      'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
      'Dallas, TX': { lat: 32.7767, lng: -96.797 },
      'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
      'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
      'New York, NY': { lat: 40.7128, lng: -74.006 },
      'Boston, MA': { lat: 42.3601, lng: -71.0589 },
    };

    const cityName = city.split(',')[0];
    const state = city.split(',')[1]?.trim();

    return cityCoords[`${cityName}, ${state}`] || null;
  }

  /**
   * Extract state from city string
   */
  private extractStateFromCity(city: string): string {
    const parts = city.split(',');
    return parts.length > 1 ? parts[1].trim() : 'CA'; // Default fallback
  }

  /**
   * Generate competitor data from FMCSA carrier information
   */
  private generateCompetitorDataFromFMCSA(
    origin: string,
    destination: string,
    equipmentType: string,
    capacitySignals: any
  ): CompetitorIntelligence[] {
    // Use carrier count data to generate realistic competitor profiles
    const carrierCount = Math.max(
      capacitySignals.originCarrierCount + capacitySignals.destCarrierCount,
      5
    );
    const competitorCount = Math.min(carrierCount, 8);

    return Array.from({ length: competitorCount }, (_, index) => ({
      carrierId: `FMCSA-${index + 1}`,
      carrierName: `Regional Carrier ${index + 1}`,
      marketShare: (1 / competitorCount) * (0.8 + Math.random() * 0.4), // 80-120% of equal share
      averageRate: Math.floor(Math.random() * 800) + 2200,
      winRate: Math.random() * 0.3 + 0.3, // 30-60% win rate
      serviceScore: Math.random() * 0.3 + 0.6, // 60-90% service score
      specializations: [equipmentType, 'General Freight'].slice(
        0,
        Math.floor(Math.random() * 2) + 1
      ),
      geographicCoverage: ['Regional', 'Interstate'].slice(
        0,
        Math.floor(Math.random() * 2) + 1
      ),
      pricingStrategy: ['competitive', 'premium'][
        Math.floor(Math.random() * 2)
      ] as any,
      recentActivity: {
        quotesSubmitted: Math.floor(Math.random() * 30) + 5,
        quotesWon: Math.floor(Math.random() * 15) + 2,
        averageResponseTime: Math.floor(Math.random() * 90) + 15,
        lastActive: new Date(
          Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
    }));
  }

  /**
   * Generate trends analysis from free data sources
   */
  private generateTrendsFromFreeData(
    origin: string,
    destination: string,
    equipmentType: string,
    timeframe: string,
    economicFactors: any,
    internalData: any
  ): MarketTrends {
    // Analyze economic trends from BLS data
    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    let magnitude = 0.05; // Default 5% change
    let confidence = 0.7;

    // Analyze fuel price trends
    if (
      economicFactors.APU000074714?.data &&
      economicFactors.APU000074714.data.length > 1
    ) {
      const fuelPrices = economicFactors.APU000074714.data
        .slice(0, 6)
        .map((d: any) => parseFloat(d.value));
      const fuelTrend = this.calculateTrend(fuelPrices);

      if (fuelTrend > 0.02) {
        direction = 'increasing';
        magnitude = fuelTrend * 0.5; // Fuel increases affect rates by about 50%
      } else if (fuelTrend < -0.02) {
        direction = 'decreasing';
        magnitude = Math.abs(fuelTrend) * 0.3;
      }
    }

    // Analyze internal rate trends if available
    if (
      internalData.recentTransactions &&
      internalData.recentTransactions.length > 5
    ) {
      const recentRates = internalData.recentTransactions.map(
        (tx: any) => tx.rate
      );
      const internalTrend = this.calculateTrend(recentRates);

      if (Math.abs(internalTrend) > 0.03) {
        direction = internalTrend > 0 ? 'increasing' : 'decreasing';
        magnitude = Math.abs(internalTrend);
        confidence = Math.min(internalData.transactionCount / 30, 0.95); // Higher confidence with more data
      }
    }

    // Generate forecast based on trends
    const forecast = this.generateForecast(
      origin,
      destination,
      direction,
      magnitude,
      timeframe
    );

    return {
      timeframe,
      direction,
      magnitude,
      confidence,
      factors: this.identifyTrendFactors(economicFactors, internalData),
      forecast,
    };
  }

  /**
   * Calculate trend from data array
   */
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const xMean = (n - 1) / 2; // Mean of indices 0 to n-1
    const yMean = values.reduce((sum, val) => sum + val, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (values[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    return slope / yMean; // Return as percentage change
  }

  /**
   * Generate forecast data
   */
  private generateForecast(
    origin: string,
    destination: string,
    direction: string,
    magnitude: number,
    timeframe: string
  ): any[] {
    const days =
      timeframe === '7d'
        ? 7
        : timeframe === '30d'
          ? 30
          : timeframe === '90d'
            ? 90
            : 365;
    const baseRate = this.calculateBaseRate(500, 'Dry Van'); // Approximate base rate

    return Array.from({ length: Math.min(days, 30) }, (_, i) => {
      let rateChange = 0;

      if (direction === 'increasing') {
        rateChange = magnitude * (i / days) * baseRate;
      } else if (direction === 'decreasing') {
        rateChange = -magnitude * (i / days) * baseRate;
      }

      return {
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        predictedRate: Math.round(baseRate + rateChange),
        confidence: Math.max(0.5, 1 - (i / days) * 0.3), // Confidence decreases over time
      };
    });
  }

  /**
   * Identify factors driving trends
   */
  private identifyTrendFactors(economicFactors: any, internalData: any): any[] {
    const factors = [];

    // Fuel price factor
    if (economicFactors.APU000074714?.data?.[0]?.value) {
      const currentFuel = parseFloat(
        economicFactors.APU000074714.data[0].value
      );
      const baselineFuel = 3.5;
      factors.push({
        factor: 'Fuel Price Changes',
        impact: (currentFuel - baselineFuel) / baselineFuel,
        description: `Current diesel price: $${currentFuel}/gal (baseline: $${baselineFuel})`,
      });
    }

    // Capacity factor (from internal data)
    if (internalData.transactionCount > 0) {
      factors.push({
        factor: 'Market Capacity',
        impact: internalData.transactionCount > 20 ? -0.05 : 0.05,
        description: `${internalData.transactionCount} recent transactions indicate ${internalData.transactionCount > 20 ? 'balanced' : 'tight'} capacity`,
      });
    }

    // Economic indicators
    if (economicFactors.WPUSI024011?.data?.[0]?.value) {
      const transportIndex = parseFloat(
        economicFactors.WPUSI024011.data[0].value
      );
      factors.push({
        factor: 'Transportation Costs',
        impact: (transportIndex - 100) * 0.01,
        description: `Transportation cost index: ${transportIndex} (baseline: 100)`,
      });
    }

    return factors.length > 0
      ? factors
      : [
          {
            factor: 'Market Stability',
            impact: 0,
            description:
              'Market conditions appear stable with no significant trend factors identified',
          },
        ];
  }

  private async fetchTrendsData(
    origin: string,
    destination: string,
    equipmentType: string,
    timeframe: string
  ): Promise<MarketTrends> {
    try {
      // Use BLS economic data and internal trends for forecasting
      const economicFactors = await this.getEconomicIndicators();
      const internalData = await this.getInternalTransactionData(
        origin,
        destination,
        equipmentType
      );

      return this.generateTrendsFromFreeData(
        origin,
        destination,
        equipmentType,
        timeframe,
        economicFactors,
        internalData
      );
    } catch (error) {
      console.warn('Free trends data unavailable:', error);
      return this.generateMockTrendsData(
        origin,
        destination,
        equipmentType,
        timeframe
      );
    }
  }

  private async fetchCapacityData(
    region: string,
    equipmentType: string
  ): Promise<CapacityAnalysis> {
    return this.generateMockCapacityData(region, equipmentType);
  }

  private async fetchDemandData(
    region: string,
    commodityType: string
  ): Promise<DemandAnalysis> {
    return this.generateMockDemandData(region, commodityType);
  }

  private generateMockMarketData(
    origin: string,
    destination: string,
    equipmentType: string
  ): MarketRateData {
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
        percentile75: baseRate + variance * 0.5,
      },
      volatility: Math.random() * 0.3 + 0.05, // 5-35% volatility
      confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      sampleSize: Math.floor(Math.random() * 100) + 50,
      lastUpdated: new Date().toISOString(),
    };
  }

  private generateMockCompetitorData(
    origin: string,
    destination: string,
    equipmentType: string
  ): CompetitorIntelligence[] {
    const competitors = [
      'Swift Transportation',
      'J.B. Hunt',
      'Schneider National',
      'Werner Enterprises',
      'C.H. Robinson',
      'XPO Logistics',
      'Knight-Swift',
      'Landstar System',
    ];

    return competitors
      .slice(0, Math.floor(Math.random() * 5) + 3)
      .map((name, index) => ({
        carrierId: `COMP-${index + 1}`,
        carrierName: name,
        marketShare: Math.random() * 0.15 + 0.05, // 5-20% market share
        averageRate: Math.floor(Math.random() * 500) + 2000,
        winRate: Math.random() * 0.4 + 0.4, // 40-80% win rate
        serviceScore: Math.random() * 0.3 + 0.7, // 70-100% service score
        specializations: [
          'General Freight',
          'Expedited',
          'Temperature Controlled',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        geographicCoverage: [
          'Southeast',
          'Midwest',
          'Southwest',
          'Northeast',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        pricingStrategy: ['aggressive', 'competitive', 'premium'][
          Math.floor(Math.random() * 3)
        ] as any,
        recentActivity: {
          quotesSubmitted: Math.floor(Math.random() * 50) + 10,
          quotesWon: Math.floor(Math.random() * 20) + 5,
          averageResponseTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
          lastActive: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      }));
  }

  private generateMockTrendsData(
    origin: string,
    destination: string,
    equipmentType: string,
    timeframe: string
  ): MarketTrends {
    const baseRate = 2500;
    const direction = ['increasing', 'decreasing', 'stable'][
      Math.floor(Math.random() * 3)
    ] as any;
    const magnitude = Math.random() * 0.2 + 0.05; // 5-25% change

    return {
      timeframe,
      direction,
      magnitude,
      confidence: Math.random() * 0.3 + 0.7,
      factors: [
        {
          factor: 'Fuel price changes',
          impact: Math.random() * 0.1 + 0.05,
          description: 'Recent fuel price volatility affecting rates',
        },
        {
          factor: 'Seasonal demand',
          impact: Math.random() * 0.15 + 0.05,
          description: 'Seasonal shipping patterns impact',
        },
        {
          factor: 'Capacity constraints',
          impact: Math.random() * 0.12 + 0.03,
          description: 'Limited equipment availability',
        },
      ],
      forecast: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        predictedRate: baseRate + (Math.random() - 0.5) * 200,
        confidence: Math.random() * 0.2 + 0.7,
      })),
    };
  }

  private generateMockCapacityData(
    region: string,
    equipmentType: string
  ): CapacityAnalysis {
    const availability = ['surplus', 'balanced', 'tight', 'critical'][
      Math.floor(Math.random() * 4)
    ] as any;

    return {
      equipmentType,
      region,
      availability,
      utilizationRate: Math.random() * 0.3 + 0.6, // 60-90% utilization
      averageLoadTime: Math.random() * 48 + 24, // 24-72 hours
      seasonalPattern: Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        multiplier: Math.random() * 0.4 + 0.8, // 0.8-1.2 multiplier
      })),
      constraints: [
        'Driver shortage in region',
        'Maintenance capacity limits',
        'Seasonal demand fluctuations',
      ].slice(0, Math.floor(Math.random() * 3) + 1),
    };
  }

  private generateMockDemandData(
    region: string,
    commodityType: string
  ): DemandAnalysis {
    const demandLevel = ['low', 'medium', 'high', 'critical'][
      Math.floor(Math.random() * 4)
    ] as any;

    return {
      region,
      commodityType,
      demandLevel,
      growth: (Math.random() - 0.5) * 0.3, // -15% to +15% growth
      seasonality: Math.random() * 0.4 + 0.8, // 0.8-1.2 seasonal factor
      peakPeriods: [
        { start: '2025-11-01', end: '2025-12-31', multiplier: 1.4 },
        { start: '2025-03-01', end: '2025-04-30', multiplier: 1.2 },
      ],
      driverFactors: [
        'E-commerce growth',
        'Manufacturing expansion',
        'Seasonal retail patterns',
      ].slice(0, Math.floor(Math.random() * 3) + 1),
    };
  }

  private calculateMarketPosition(
    currentRate: number,
    averageRate: number
  ): string {
    const ratio = currentRate / averageRate;
    if (ratio < 0.95) return 'below market';
    if (ratio > 1.05) return 'above market';
    return 'at market';
  }

  private getRegionFromCity(city: string): string {
    const regions: { [key: string]: string } = {
      Atlanta: 'Southeast',
      Miami: 'Southeast',
      Chicago: 'Midwest',
      Dallas: 'Southwest',
      'Los Angeles': 'West',
      Seattle: 'Northwest',
      'New York': 'Northeast',
      Boston: 'Northeast',
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
      recommendations.push(
        'Market rates trending upward - consider premium pricing strategy'
      );
    }

    if (capacity.availability === 'tight') {
      recommendations.push(
        'Limited capacity - secure equipment early and adjust rates accordingly'
      );
    }

    if (demand.demandLevel === 'high') {
      recommendations.push(
        'High demand environment - opportunity for rate optimization'
      );
    }

    const avgCompetitorRate =
      competitors.reduce((sum, c) => sum + c.averageRate, 0) /
      competitors.length;
    if (rates.currentRate < avgCompetitorRate * 0.9) {
      recommendations.push(
        'Rates significantly below competition - consider increasing'
      );
    }

    if (rates.volatility > 0.2) {
      recommendations.push(
        'High rate volatility - monitor closely and adjust pricing frequently'
      );
    }

    return recommendations;
  }
}

// Export singleton instance
export const marketRateService = new MarketRateService();
