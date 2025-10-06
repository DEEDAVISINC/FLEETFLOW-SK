/**
 * FuelPriceScraperService - Web scraping service for fuel price data
 * Legally scrapes public fuel price data from government and free sources
 */

export interface FuelPriceData {
  source: string;
  timestamp: string;
  fuelType: 'diesel' | 'gasoline' | 'heating_oil';
  prices: Array<{
    location: string;
    price: number;
    change: number; // Change from previous period
    date: string;
  }>;
  regionalAverages: {
    national: number;
    regions: { [region: string]: number };
  };
  metadata: {
    totalLocations: number;
    lastUpdated: string;
    scrapeDuration: number;
  };
}

export interface FuelTrendData {
  fuelType: string;
  timeframe: 'weekly' | 'monthly' | 'quarterly';
  direction: 'increasing' | 'decreasing' | 'stable';
  magnitude: number; // Percentage change
  forecast: Array<{
    date: string;
    predictedPrice: number;
    confidence: number;
  }>;
  factors: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export class FuelPriceScraperService {
  private readonly userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private readonly rateLimits = {
    requestsPerMinute: 20, // More conservative for government sites
    delayBetweenRequests: 3000, // 3 seconds
  };

  private lastRequestTime = 0;

  private readonly freeFuelSources = {
    // EIA (Energy Information Administration) - Free API
    eia: {
      weeklyHeatingFuel: 'https://api.eia.gov/v2/petroleum/pri/wfr/data/',
      motorFuel: 'https://api.eia.gov/v2/petroleum/pri/gnd/data/',
      apiKey: process.env.EIA_API_KEY || '', // Free API key available
    },
    // EIA Public Data (no API key needed for some endpoints)
    eiaPublic: {
      dieselPrices: 'https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_w.htm',
      gasolinePrices: 'https://www.eia.gov/dnav/pet/pet_pri_gnd_dcus_nus_w.htm',
    },
    // Bureau of Labor Statistics (free API)
    bls: 'https://api.bls.gov/publicAPI/v2/timeseries/data',
    // GasBuddy (requires scraping)
    gasBuddy: 'https://www.gasbuddy.com',
    // AAA Fuel Prices (free public data)
    aaa: 'https://www.aaa.com/travelinfo/gas-prices',
  };

  constructor() {
    console.info('⛽ FuelPriceScraperService initialized');
  }

  /**
   * Get current diesel fuel prices from EIA
   */
  async getDieselPrices(): Promise<FuelPriceData> {
    const startTime = Date.now();

    try {
      console.info('⛽ Scraping diesel fuel prices from EIA');

      // Try EIA API first (requires free API key)
      const eiaData = await this.scrapeEIAFuelPrices('diesel');
      if (eiaData.prices.length > 0) {
        return {
          ...eiaData,
          metadata: {
            ...eiaData.metadata,
            scrapeDuration: Date.now() - startTime,
          },
        };
      }

      // Fallback to BLS data
      const blsData = await this.scrapeBLSFuelPrices('diesel');
      return {
        ...blsData,
        metadata: {
          ...blsData.metadata,
          scrapeDuration: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error('Fuel price scraping failed:', error);
      return this.createEmptyFuelData('diesel', startTime);
    }
  }

  /**
   * Get gasoline prices from EIA
   */
  async getGasolinePrices(): Promise<FuelPriceData> {
    const startTime = Date.now();

    try {
      console.info('⛽ Scraping gasoline fuel prices from EIA');
      const data = await this.scrapeEIAFuelPrices('gasoline');
      return {
        ...data,
        metadata: {
          ...data.metadata,
          scrapeDuration: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error('Gasoline price scraping failed:', error);
      return this.createEmptyFuelData('gasoline', startTime);
    }
  }

  /**
   * Get fuel price trends and forecasting
   */
  async getFuelTrends(
    fuelType: 'diesel' | 'gasoline',
    timeframe: 'weekly' | 'monthly' | 'quarterly' = 'weekly'
  ): Promise<FuelTrendData> {
    try {
      console.info(`📊 Analyzing ${fuelType} fuel price trends`);

      // Get historical data for trend analysis
      const historicalPrices = await this.getHistoricalFuelPrices(
        fuelType,
        timeframe
      );

      // Calculate trend
      const trend = this.calculateFuelTrend(historicalPrices);

      // Generate forecast
      const forecast = this.generateFuelForecast(trend, historicalPrices);

      // Identify driving factors
      const factors = this.identifyFuelTrendFactors(trend, historicalPrices);

      return {
        fuelType,
        timeframe,
        direction: trend.direction,
        magnitude: trend.magnitude,
        forecast,
        factors,
      };
    } catch (error) {
      console.error('Fuel trend analysis failed:', error);
      return this.createDefaultFuelTrend(fuelType, timeframe);
    }
  }

  /**
   * Scrape EIA fuel prices using their free API
   */
  private async scrapeEIAFuelPrices(
    fuelType: 'diesel' | 'gasoline' | 'heating_oil'
  ): Promise<FuelPriceData> {
    await this.enforceRateLimit();

    // EIA series IDs for different fuel types
    const seriesIds = {
      diesel: 'PET.WPULEUS3.W', // On-Highway Diesel
      gasoline: 'PET.EER_EPMRU_PF4_RGC_DPG.W', // Regular Gasoline
      heating_oil: 'PET.WPSHUS2.W', // Heating Fuel
    };

    const seriesId = seriesIds[fuelType];
    const apiUrl = `${this.freeFuelSources.eia.motorFuel}?api_key=${this.freeFuelSources.eia.apiKey}&series_id=${seriesId}&start=2024-01-01`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': this.userAgent,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`EIA API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse EIA response
    const prices = this.parseEIAFuelData(data, fuelType);

    return {
      source: 'EIA.gov',
      timestamp: new Date().toISOString(),
      fuelType,
      prices,
      regionalAverages: this.calculateRegionalFuelAverages(prices),
      metadata: {
        totalLocations: prices.length,
        lastUpdated: data?.data?.[0]?.period || new Date().toISOString(),
        scrapeDuration: 0, // Will be set by caller
      },
    };
  }

  /**
   * Scrape BLS fuel price data (alternative to EIA)
   */
  private async scrapeBLSFuelPrices(
    fuelType: 'diesel' | 'gasoline'
  ): Promise<FuelPriceData> {
    await this.enforceRateLimit();

    // BLS series IDs for fuel prices
    const seriesIds = {
      diesel: 'APU000074714', // Diesel fuel
      gasoline: 'APU00007471A', // Gasoline
    };

    const seriesId = seriesIds[fuelType];
    const apiUrl = `${this.freeFuelSources.bls}?seriesid=${seriesId}&startyear=2024&endyear=2025&registrationkey=${process.env.BLS_API_KEY || ''}`;

    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': this.userAgent,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`BLS API returned ${response.status}`);
    }

    const data = await response.json();

    // Parse BLS response
    const prices = this.parseBLSFuelData(data, fuelType);

    return {
      source: 'BLS.gov',
      timestamp: new Date().toISOString(),
      fuelType,
      prices,
      regionalAverages: this.calculateRegionalFuelAverages(prices),
      metadata: {
        totalLocations: prices.length,
        lastUpdated: new Date().toISOString(),
        scrapeDuration: 0, // Will be set by caller
      },
    };
  }

  /**
   * Scrape AAA fuel prices (alternative free source)
   */
  private async scrapeAAAfuelPrices(): Promise<FuelPriceData> {
    await this.enforceRateLimit();

    try {
      // Note: AAA publishes fuel prices but may require scraping their site
      // This would need to be implemented based on their current data structure
      console.warn(
        'AAA fuel price scraping requires analysis of their current data format'
      );

      return this.createEmptyFuelData('gasoline', Date.now());
    } catch (error) {
      console.error('AAA fuel price scraping failed:', error);
      return this.createEmptyFuelData('gasoline', Date.now());
    }
  }

  /**
   * Parse EIA fuel price response
   */
  private parseEIAFuelData(data: any, fuelType: string): any[] {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }

    return data.data
      .filter((item: any) => item.value && !isNaN(parseFloat(item.value)))
      .map((item: any) => ({
        location: 'National Average',
        price: parseFloat(item.value),
        change: 0, // EIA doesn't provide change in basic response
        date: item.period || new Date().toISOString(),
      }))
      .slice(0, 10); // Limit to recent data
  }

  /**
   * Parse BLS fuel price response
   */
  private parseBLSFuelData(data: any, fuelType: string): any[] {
    if (!data?.Results?.series?.[0]?.data) {
      return [];
    }

    const seriesData = data.Results.series[0].data;
    let previousPrice = 0;

    return seriesData
      .filter((item: any) => item.value && !isNaN(parseFloat(item.value)))
      .map((item: any) => {
        const currentPrice = parseFloat(item.value);
        const change = previousPrice > 0 ? currentPrice - previousPrice : 0;
        previousPrice = currentPrice;

        return {
          location: 'National Average',
          price: currentPrice,
          change,
          date: item.year + '-' + item.period,
        };
      })
      .slice(0, 10);
  }

  /**
   * Calculate regional fuel price averages
   */
  private calculateRegionalFuelAverages(prices: any[]): any {
    // For now, return national average
    // In production, could categorize by region
    const nationalAverage =
      prices.length > 0
        ? prices.reduce((sum, p) => sum + p.price, 0) / prices.length
        : 3.5; // Default diesel price

    return {
      national: nationalAverage,
      regions: {
        Northeast: nationalAverage * 1.05, // Typically 5% higher
        Southwest: nationalAverage * 0.95, // Typically 5% lower
        Midwest: nationalAverage,
        West: nationalAverage * 1.02,
      },
    };
  }

  /**
   * Get historical fuel prices for trend analysis
   */
  private async getHistoricalFuelPrices(
    fuelType: string,
    timeframe: string
  ): Promise<number[]> {
    try {
      const fuelData = await this.getDieselPrices(); // Simplified - use diesel as default
      return fuelData.prices.map((p) => p.price).slice(0, 10);
    } catch {
      return [3.5, 3.45, 3.52, 3.48, 3.55, 3.42, 3.58, 3.46, 3.51, 3.49]; // Mock data
    }
  }

  /**
   * Calculate fuel price trend
   */
  private calculateFuelTrend(prices: number[]): any {
    if (prices.length < 2) {
      return { direction: 'stable', magnitude: 0 };
    }

    const n = prices.length;
    const xMean = (n - 1) / 2;
    const yMean = prices.reduce((sum, price) => sum + price, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (prices[i] - yMean);
      denominator += Math.pow(i - xMean, 2);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const magnitude = Math.abs(slope / yMean); // Percentage change

    let direction: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (slope > 0.01) direction = 'increasing';
    if (slope < -0.01) direction = 'decreasing';

    return { direction, magnitude };
  }

  /**
   * Generate fuel price forecast
   */
  private generateFuelForecast(trend: any, historicalPrices: number[]): any[] {
    const basePrice = historicalPrices[historicalPrices.length - 1] || 3.5;
    const dailyChange =
      trend.direction === 'increasing'
        ? 0.02
        : trend.direction === 'decreasing'
          ? -0.02
          : 0;

    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      predictedPrice: basePrice + dailyChange * i,
      confidence: Math.max(0.4, 1 - (i / 30) * 0.4), // Confidence decreases over time
    }));
  }

  /**
   * Identify factors driving fuel price trends
   */
  private identifyFuelTrendFactors(
    trend: any,
    historicalPrices: number[]
  ): any[] {
    const factors = [];

    // Crude oil prices (primary driver)
    factors.push({
      factor: 'Crude Oil Prices',
      impact: trend.magnitude * 0.6, // ~60% of fuel price comes from crude
      description: 'Global crude oil market conditions affecting fuel prices',
    });

    // Refining costs
    factors.push({
      factor: 'Refining Capacity',
      impact: trend.magnitude * 0.2,
      description: 'Refinery utilization and maintenance schedules',
    });

    // Seasonal demand
    factors.push({
      factor: 'Seasonal Demand',
      impact: trend.magnitude * 0.15,
      description: 'Travel and heating season demand fluctuations',
    });

    // Taxes and regulations
    factors.push({
      factor: 'Taxes & Regulations',
      impact: trend.magnitude * 0.05,
      description: 'Federal and state fuel taxes and environmental regulations',
    });

    return factors;
  }

  /**
   * Enforce rate limiting to avoid being blocked
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimits.delayBetweenRequests) {
      const delay = this.rateLimits.delayBetweenRequests - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Create empty fuel data structure for failed scrapes
   */
  private createEmptyFuelData(
    fuelType: string,
    startTime: number
  ): FuelPriceData {
    return {
      source: 'fallback',
      timestamp: new Date().toISOString(),
      fuelType: fuelType as any,
      prices: [],
      regionalAverages: {
        national: 3.5, // Default diesel price
        regions: {
          Northeast: 3.68,
          Southwest: 3.33,
          Midwest: 3.5,
          West: 3.57,
        },
      },
      metadata: {
        totalLocations: 0,
        lastUpdated: new Date().toISOString(),
        scrapeDuration: Date.now() - startTime,
      },
    };
  }

  /**
   * Create default fuel trend for failed analysis
   */
  private createDefaultFuelTrend(
    fuelType: string,
    timeframe: string
  ): FuelTrendData {
    return {
      fuelType,
      timeframe: timeframe as any,
      direction: 'stable',
      magnitude: 0.02,
      forecast: [],
      factors: [
        {
          factor: 'Market Stability',
          impact: 0,
          description: 'Fuel prices showing normal market fluctuations',
        },
      ],
    };
  }

  /**
   * Check if scraping is allowed (basic compliance check)
   */
  isScrapingAllowed(url: string): boolean {
    // Government and public data sources are allowed
    const allowedDomains = [
      'eia.gov',
      'bls.gov',
      'aaa.com',
      'gasbuddy.com',
      // Add other allowed domains
    ];

    try {
      const domain = new URL(url).hostname;
      return allowedDomains.some((allowed) => domain.includes(allowed));
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const fuelPriceScraper = new FuelPriceScraperService();

