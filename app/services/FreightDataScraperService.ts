/**
 * FreightDataScraperService - Web scraping service for freight rate data
 * Legally scrapes public freight data from load boards and transportation sites
 */

export interface ScrapedFreightData {
  source: string;
  timestamp: string;
  loads: Array<{
    origin: string;
    destination: string;
    equipmentType: string;
    rate: number;
    distance: number;
    postedAt: string;
    carrier?: string;
    requirements?: string[];
  }>;
  metadata: {
    totalLoads: number;
    searchCriteria: any;
    scrapeDuration: number;
  };
}

export class FreightDataScraperService {
  private readonly userAgent =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  private readonly rateLimits = {
    requestsPerMinute: 30,
    delayBetweenRequests: 2000, // 2 seconds
  };

  private lastRequestTime = 0;

  constructor() {
    console.info('🔍 FreightDataScraperService initialized');
  }

  /**
   * Scrape DirectFreight.com for freight rate data
   */
  async scrapeDirectFreight(
    origin: string,
    destination: string,
    equipmentType: string = 'DRY_VAN',
    radius: number = 50
  ): Promise<ScrapedFreightData> {
    const startTime = Date.now();

    try {
      await this.enforceRateLimit();

      // Get coordinates for location-based search
      const originCoords = await this.geocodeLocation(origin);
      const destCoords = await this.geocodeLocation(destination);

      if (!originCoords || !destCoords) {
        throw new Error('Could not geocode locations');
      }

      // Prepare search payload
      const searchPayload = {
        originLat: originCoords.lat,
        originLng: originCoords.lng,
        destLat: destCoords.lat,
        destLng: destCoords.lng,
        equipmentType: this.mapEquipmentType(equipmentType),
        radius,
        limit: 100,
        sortBy: 'posted',
        sortOrder: 'desc',
      };

      const response = await fetch(
        'https://www.directfreight.com/api/loads/search',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': this.userAgent,
            Accept: 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            Referer: 'https://www.directfreight.com/loadboard',
          },
          body: JSON.stringify(searchPayload),
        }
      );

      if (!response.ok) {
        throw new Error(`DirectFreight API returned ${response.status}`);
      }

      const data = await response.json();
      const loads = this.parseDirectFreightLoads(data, origin, destination);

      return {
        source: 'DirectFreight.com',
        timestamp: new Date().toISOString(),
        loads,
        metadata: {
          totalLoads: loads.length,
          searchCriteria: searchPayload,
          scrapeDuration: Date.now() - startTime,
        },
      };
    } catch (error) {
      console.error('DirectFreight scraping failed:', error);
      return this.createEmptyScrapedData('DirectFreight.com', startTime);
    }
  }

  /**
   * Scrape 123Loadboard.com for additional rate data
   */
  async scrape123Loadboard(
    origin: string,
    destination: string,
    equipmentType: string = 'DRY_VAN'
  ): Promise<ScrapedFreightData> {
    const startTime = Date.now();

    try {
      await this.enforceRateLimit();

      // Note: This would require reverse-engineering their API
      // For now, return structured placeholder
      console.warn('123Loadboard scraping requires API reverse-engineering');

      return this.createEmptyScrapedData('123Loadboard.com', startTime);
    } catch (error) {
      console.error('123Loadboard scraping failed:', error);
      return this.createEmptyScrapedData('123Loadboard.com', startTime);
    }
  }

  /**
   * Scrape DAT's public load board (if accessible)
   */
  async scrapeDATPublic(
    origin: string,
    destination: string,
    equipmentType: string = 'DRY_VAN'
  ): Promise<ScrapedFreightData> {
    const startTime = Date.now();

    try {
      await this.enforceRateLimit();

      // DAT typically requires authentication for API access
      // This would be a public endpoint if available
      console.warn('DAT public scraping may be restricted');

      return this.createEmptyScrapedData('DAT.com', startTime);
    } catch (error) {
      console.error('DAT scraping failed:', error);
      return this.createEmptyScrapedData('DAT.com', startTime);
    }
  }

  /**
   * Aggregate data from multiple sources
   */
  async scrapeMultipleSources(
    origin: string,
    destination: string,
    equipmentType: string = 'DRY_VAN'
  ): Promise<ScrapedFreightData[]> {
    console.info(
      `🔍 Scraping multiple freight data sources for ${origin} → ${destination}`
    );

    const results = await Promise.allSettled([
      this.scrapeDirectFreight(origin, destination, equipmentType),
      this.scrape123Loadboard(origin, destination, equipmentType),
      this.scrapeDATPublic(origin, destination, equipmentType),
    ]);

    return results
      .filter(
        (result): result is PromiseFulfilledResult<ScrapedFreightData> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value);
  }

  /**
   * Parse DirectFreight API response into standardized format
   */
  private parseDirectFreightLoads(
    data: any,
    origin: string,
    destination: string
  ): any[] {
    if (!data.loads || !Array.isArray(data.loads)) {
      return [];
    }

    return data.loads
      .filter((load: any) => load.rate && load.rate > 0)
      .map((load: any) => ({
        origin: load.originCity || origin,
        destination: load.destCity || destination,
        equipmentType: this.normalizeEquipmentType(load.equipmentType),
        rate: load.rate,
        distance: load.distance || 0,
        postedAt: load.postedAt || new Date().toISOString(),
        carrier: load.carrierName || undefined,
        requirements: load.requirements || [],
      }))
      .slice(0, 50); // Limit to 50 most recent loads
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
   * Simple geocoding for cities (in production, use proper geocoding service)
   */
  private async geocodeLocation(
    location: string
  ): Promise<{ lat: number; lng: number } | null> {
    // Simple coordinate lookup - in production, integrate with Mapbox or Google Maps API
    const locationCoords: { [key: string]: { lat: number; lng: number } } = {
      'Atlanta, GA': { lat: 33.749, lng: -84.388 },
      'Miami, FL': { lat: 25.7617, lng: -80.1918 },
      'Chicago, IL': { lat: 41.8781, lng: -87.6298 },
      'Dallas, TX': { lat: 32.7767, lng: -96.797 },
      'Los Angeles, CA': { lat: 34.0522, lng: -118.2437 },
      'Seattle, WA': { lat: 47.6062, lng: -122.3321 },
      'New York, NY': { lat: 40.7128, lng: -74.006 },
      'Boston, MA': { lat: 42.3601, lng: -71.0589 },
      'Houston, TX': { lat: 29.7604, lng: -95.3698 },
      'Phoenix, AZ': { lat: 33.4484, lng: -112.074 },
      'Philadelphia, PA': { lat: 39.9526, lng: -75.1652 },
      'San Antonio, TX': { lat: 29.4241, lng: -98.4936 },
      'San Diego, CA': { lat: 32.7157, lng: -117.1611 },
      'Denver, CO': { lat: 39.7392, lng: -104.9903 },
      'Nashville, TN': { lat: 36.1627, lng: -86.7816 },
    };

    const cityName = location.split(',')[0]?.trim();
    const state = location.split(',')[1]?.trim();

    return locationCoords[`${cityName}, ${state}`] || null;
  }

  /**
   * Map equipment types to standardized format
   */
  private mapEquipmentType(equipmentType: string): string {
    const equipmentMap: { [key: string]: string } = {
      'Dry Van': 'DRY_VAN',
      Reefer: 'REEFER',
      Flatbed: 'FLATBED',
      'Step Deck': 'STEP_DECK',
      'Double Drop': 'DOUBLE_DROP',
      RGN: 'RGN',
      'Box Truck': 'BOX_TRUCK',
      'Sprinter/Cube': 'SPRINTER',
    };

    return equipmentMap[equipmentType] || 'DRY_VAN';
  }

  /**
   * Normalize equipment types from various sources
   */
  private normalizeEquipmentType(equipmentType: string): string {
    if (!equipmentType) return 'Dry Van';

    const normalizedMap: { [key: string]: string } = {
      DRY_VAN: 'Dry Van',
      VAN: 'Dry Van',
      REEFER: 'Reefer',
      REFRIGERATED: 'Reefer',
      FLATBED: 'Flatbed',
      FLAT: 'Flatbed',
      STEP_DECK: 'Step Deck',
      DOUBLE_DROP: 'Double Drop',
      RGN: 'RGN',
      BOX_TRUCK: 'Box Truck',
      SPRINTER: 'Sprinter/Cube',
    };

    return normalizedMap[equipmentType.toUpperCase()] || equipmentType;
  }

  /**
   * Create empty scraped data structure for failed scrapes
   */
  private createEmptyScrapedData(
    source: string,
    startTime: number
  ): ScrapedFreightData {
    return {
      source,
      timestamp: new Date().toISOString(),
      loads: [],
      metadata: {
        totalLoads: 0,
        searchCriteria: {},
        scrapeDuration: Date.now() - startTime,
      },
    };
  }

  /**
   * Check if scraping is allowed (basic compliance check)
   */
  isScrapingAllowed(url: string): boolean {
    // Basic check for robots.txt compliance
    // In production, implement full robots.txt parsing
    const allowedDomains = [
      'directfreight.com',
      '123loadboard.com',
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
export const freightDataScraper = new FreightDataScraperService();

