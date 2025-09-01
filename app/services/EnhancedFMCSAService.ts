// Enhanced FMCSA API Service - Production Grade
// Includes rate limiting, caching, comprehensive error handling, safety ratings

interface FMCSACarrierData {
  dotNumber: string;
  mcNumber?: string;
  legalName: string;
  dbaName?: string;
  physicalAddress: string;
  mailingAddress?: string;
  phone: string;
  email?: string;
  operatingAuthority: string;
  operatingStatus: 'ACTIVE' | 'OUT_OF_SERVICE' | 'NOT_AUTHORIZED';
  safetyRating: 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED';
  entityType: string;
  powerUnits: number;
  drivers: number;
  mcs150Date?: string;
  mcs150Mileage?: number;
  equipmentTypes: string[];
  cargoCarried: string[];
  operationClassification: string[];
  insuranceRequired: string[];
  bondSurety: string[];
  safetyReviewDate?: string;
  lastUpdateDate: string;

  // Safety metrics
  crashTotal?: number;
  crashFatal?: number;
  crashInjury?: number;
  crashTow?: number;
  crashHazmat?: number;

  // Inspection data
  inspectionTotal?: number;
  inspectionOOS?: number;
  driverOOS?: number;
  vehicleOOS?: number;
  hazmatInspections?: number;

  // Violation data
  driverViolations?: number;
  vehicleViolations?: number;
  hazmatViolations?: number;

  // Risk assessment
  riskScore?: number;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations?: string[];
}

interface FMCSASearchResult {
  success: boolean;
  data?: FMCSACarrierData;
  error?: string;
  cached?: boolean;
  searchTime?: number;
  dataSource: 'FMCSA_API' | 'CACHE' | 'MOCK';
}

interface RateLimitInfo {
  requestsThisMinute: number;
  requestsThisHour: number;
  requestsThisDay: number;
  minuteStartTime: number;
  hourStartTime: number;
  dayStartTime: number;
  isThrottled: boolean;
}

interface CacheEntry {
  data: FMCSACarrierData;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface FMCSAMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime: number;
  lastRequestTime: number;
  lastErrorTime: number;
  lastError?: string;
}

export class EnhancedFMCSAService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://mobile.fmcsa.dot.gov/qc';
  private isConfigured: boolean = false;

  // Rate limiting (FMCSA has generous limits but we'll be conservative)
  private rateLimit: RateLimitInfo = {
    requestsThisMinute: 0,
    requestsThisHour: 0,
    requestsThisDay: 0,
    minuteStartTime: Date.now(),
    hourStartTime: Date.now(),
    dayStartTime: Date.now(),
    isThrottled: false,
  };

  // Caching system (cache for 1 hour by default)
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 60 * 60 * 1000; // 1 hour

  // Performance metrics
  private metrics: FMCSAMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgResponseTime: 0,
    lastRequestTime: 0,
    lastErrorTime: 0,
  };

  // Rate limits (conservative defaults)
  private readonly LIMITS = {
    PER_MINUTE: 60, // 60 requests per minute
    PER_HOUR: 1000, // 1000 requests per hour
    PER_DAY: 10000, // 10000 requests per day
  };

  constructor() {
    this.apiKey = process.env.FMCSA_API_KEY || '';

    if (!this.apiKey || this.apiKey === 'your_fmcsa_api_key_here') {
      console.warn('⚠️ FMCSA API key not configured - using mock data');
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
      console.info('✅ FMCSA service initialized with production API key');
    }

    this.resetRateLimitsIfNeeded();
    this.startCacheCleanup();
  }

  /**
   * Search carrier by DOT number with enhanced features
   */
  async searchByDOTWithRetry(
    dotNumber: string,
    maxRetries = 3
  ): Promise<FMCSASearchResult> {
    const startTime = Date.now();
    const cacheKey = `dot_${dotNumber}`;

    try {
      // Check cache first
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return {
          success: true,
          data: cachedResult.data,
          cached: true,
          searchTime: Date.now() - startTime,
          dataSource: 'CACHE',
        };
      }

      this.metrics.cacheMisses++;

      // Check if service is configured
      if (!this.isConfigured) {
        return this.getMockCarrierData(dotNumber, 'DOT');
      }

      // Check rate limits
      if (this.isRateLimited()) {
        return {
          success: false,
          error: 'Rate limit exceeded - request throttled',
          searchTime: Date.now() - startTime,
          dataSource: 'FMCSA_API',
        };
      }

      // Validate DOT number
      if (!this.isValidDOTNumber(dotNumber)) {
        return {
          success: false,
          error: 'Invalid DOT number format',
          searchTime: Date.now() - startTime,
          dataSource: 'FMCSA_API',
        };
      }

      // Attempt search with retry logic
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Update rate limit counters
          this.incrementRateLimit();

          const result = await this.performDOTSearch(dotNumber);

          // Update metrics for successful request
          this.updateMetrics(true, Date.now() - startTime);

          // Cache the result if successful
          if (result.success && result.data) {
            this.setCachedResult(cacheKey, result.data);
          }

          return {
            ...result,
            searchTime: Date.now() - startTime,
            dataSource: 'FMCSA_API',
          };
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error('Unknown error');

          if (attempt < maxRetries) {
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.info(
              `⚠️ FMCSA DOT search attempt ${attempt} failed, retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // All retries failed
      this.updateMetrics(false, Date.now() - startTime, lastError);

      return {
        success: false,
        error: lastError?.message || 'All retry attempts failed',
        searchTime: Date.now() - startTime,
        dataSource: 'FMCSA_API',
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        searchTime: Date.now() - startTime,
        dataSource: 'FMCSA_API',
      };
    }
  }

  /**
   * Search carrier by MC number with enhanced features
   */
  async searchByMCWithRetry(
    mcNumber: string,
    maxRetries = 3
  ): Promise<FMCSASearchResult> {
    const startTime = Date.now();
    const cacheKey = `mc_${mcNumber}`;

    try {
      // Check cache first
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return {
          success: true,
          data: cachedResult.data,
          cached: true,
          searchTime: Date.now() - startTime,
          dataSource: 'CACHE',
        };
      }

      this.metrics.cacheMisses++;

      // Check if service is configured
      if (!this.isConfigured) {
        return this.getMockCarrierData(mcNumber, 'MC');
      }

      // Check rate limits
      if (this.isRateLimited()) {
        return {
          success: false,
          error: 'Rate limit exceeded - request throttled',
          searchTime: Date.now() - startTime,
          dataSource: 'FMCSA_API',
        };
      }

      // Validate MC number
      if (!this.isValidMCNumber(mcNumber)) {
        return {
          success: false,
          error: 'Invalid MC number format',
          searchTime: Date.now() - startTime,
          dataSource: 'FMCSA_API',
        };
      }

      // Attempt search with retry logic
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          this.incrementRateLimit();

          const result = await this.performMCSearch(mcNumber);

          this.updateMetrics(true, Date.now() - startTime);

          if (result.success && result.data) {
            this.setCachedResult(cacheKey, result.data);
          }

          return {
            ...result,
            searchTime: Date.now() - startTime,
            dataSource: 'FMCSA_API',
          };
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error('Unknown error');

          if (attempt < maxRetries) {
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.info(
              `⚠️ FMCSA MC search attempt ${attempt} failed, retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      this.updateMetrics(false, Date.now() - startTime, lastError);

      return {
        success: false,
        error: lastError?.message || 'All retry attempts failed',
        searchTime: Date.now() - startTime,
        dataSource: 'FMCSA_API',
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        searchTime: Date.now() - startTime,
        dataSource: 'FMCSA_API',
      };
    }
  }

  /**
   * Perform actual DOT number search
   */
  private async performDOTSearch(
    dotNumber: string
  ): Promise<FMCSASearchResult> {
    const cleanDotNumber = dotNumber.replace(/\D/g, '');
    const url = `${this.baseUrl}/services/carriers/${cleanDotNumber}?webKey=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'FleetFlow/1.0',
      },
      timeout: 30000,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Carrier not found with the provided DOT number',
          dataSource: 'FMCSA_API',
        };
      }
      throw new Error(
        `FMCSA API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0) {
      return {
        success: false,
        error: 'No carrier data found',
        dataSource: 'FMCSA_API',
      };
    }

    const carrierData = this.parseCarrierData(data.content[0]);

    return {
      success: true,
      data: carrierData,
      dataSource: 'FMCSA_API',
    };
  }

  /**
   * Perform actual MC number search
   */
  private async performMCSearch(mcNumber: string): Promise<FMCSASearchResult> {
    const cleanMcNumber = mcNumber.replace(/[^\d]/g, '');
    const url = `${this.baseUrl}/services/carriers/docket-number/${cleanMcNumber}?webKey=${this.apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'FleetFlow/1.0',
      },
      timeout: 30000,
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Carrier not found with the provided MC number',
          dataSource: 'FMCSA_API',
        };
      }
      throw new Error(
        `FMCSA API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.content || data.content.length === 0) {
      return {
        success: false,
        error: 'No carrier data found',
        dataSource: 'FMCSA_API',
      };
    }

    const carrierData = this.parseCarrierData(data.content[0]);

    return {
      success: true,
      data: carrierData,
      dataSource: 'FMCSA_API',
    };
  }

  /**
   * Parse FMCSA API response data
   */
  private parseCarrierData(rawData: any): FMCSACarrierData {
    // Calculate risk score based on safety metrics
    const riskAssessment = this.calculateRiskScore(rawData);

    return {
      dotNumber: rawData.dotNumber || rawData.usdotNumber || '',
      mcNumber: rawData.docketNumber || rawData.mcNumber || '',
      legalName: rawData.legalName || '',
      dbaName: rawData.dbaName || '',
      physicalAddress: this.formatAddress(rawData, 'phy'),
      mailingAddress: this.formatAddress(rawData, 'mail'),
      phone: rawData.telephone || rawData.phone || '',
      email: rawData.email || '',
      operatingAuthority: rawData.operatingStatus || 'UNKNOWN',
      operatingStatus: this.mapOperatingStatus(rawData.operatingStatus),
      safetyRating: this.mapSafetyRating(rawData.safetyRating),
      entityType: rawData.entityType || 'UNKNOWN',
      powerUnits: parseInt(rawData.totalPowerUnits) || 0,
      drivers: parseInt(rawData.totalDrivers) || 0,
      mcs150Date: rawData.mcs150Date || '',
      mcs150Mileage: parseInt(rawData.mcs150Mileage) || 0,
      equipmentTypes: this.parseArrayField(rawData.equipmentTypes),
      cargoCarried: this.parseArrayField(rawData.cargoCarried),
      operationClassification: this.parseArrayField(
        rawData.operationClassification
      ),
      insuranceRequired: this.parseArrayField(rawData.insuranceRequired),
      bondSurety: this.parseArrayField(rawData.bondSurety),
      safetyReviewDate: rawData.safetyReviewDate || '',
      lastUpdateDate: new Date().toISOString(),

      // Safety metrics
      crashTotal: parseInt(rawData.crashTotal) || 0,
      crashFatal: parseInt(rawData.crashFatal) || 0,
      crashInjury: parseInt(rawData.crashInjury) || 0,
      crashTow: parseInt(rawData.crashTow) || 0,
      crashHazmat: parseInt(rawData.crashHazmat) || 0,

      // Inspection data
      inspectionTotal: parseInt(rawData.inspectionTotal) || 0,
      inspectionOOS: parseInt(rawData.inspectionOOS) || 0,
      driverOOS: parseInt(rawData.driverOOS) || 0,
      vehicleOOS: parseInt(rawData.vehicleOOS) || 0,
      hazmatInspections: parseInt(rawData.hazmatInspections) || 0,

      // Violation data
      driverViolations: parseInt(rawData.driverViolations) || 0,
      vehicleViolations: parseInt(rawData.vehicleViolations) || 0,
      hazmatViolations: parseInt(rawData.hazmatViolations) || 0,

      // Risk assessment
      riskScore: riskAssessment.score,
      riskLevel: riskAssessment.level,
      recommendations: riskAssessment.recommendations,
    };
  }

  /**
   * Calculate risk score based on safety metrics
   */
  private calculateRiskScore(data: any): {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendations: string[];
  } {
    let score = 0;
    const recommendations: string[] = [];

    // Safety rating impact
    const safetyRating = data.safetyRating || '';
    if (safetyRating === 'UNSATISFACTORY') {
      score += 40;
      recommendations.push(
        'Unsatisfactory safety rating - requires immediate attention'
      );
    } else if (safetyRating === 'CONDITIONAL') {
      score += 20;
      recommendations.push('Conditional safety rating - monitor closely');
    }

    // Operating status impact
    if (data.operatingStatus === 'OUT_OF_SERVICE') {
      score += 50;
      recommendations.push('Carrier is out of service - do not use');
    }

    // Crash history impact
    const crashTotal = parseInt(data.crashTotal) || 0;
    const crashFatal = parseInt(data.crashFatal) || 0;
    const powerUnits = parseInt(data.totalPowerUnits) || 1;

    if (crashFatal > 0) {
      score += 30;
      recommendations.push('Fatal crashes in history - high risk');
    }

    const crashRate = crashTotal / Math.max(powerUnits, 1);
    if (crashRate > 0.1) {
      score += 15;
      recommendations.push('High crash rate relative to fleet size');
    }

    // Inspection out-of-service rate
    const inspectionTotal = parseInt(data.inspectionTotal) || 0;
    const inspectionOOS = parseInt(data.inspectionOOS) || 0;

    if (inspectionTotal > 0) {
      const oosRate = inspectionOOS / inspectionTotal;
      if (oosRate > 0.2) {
        score += 25;
        recommendations.push('High out-of-service rate during inspections');
      }
    }

    // Determine risk level
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    if (score >= 70) {
      level = 'CRITICAL';
    } else if (score >= 40) {
      level = 'HIGH';
    } else if (score >= 20) {
      level = 'MEDIUM';
    } else {
      level = 'LOW';
    }

    if (recommendations.length === 0) {
      recommendations.push('No significant safety concerns identified');
    }

    return { score, level, recommendations };
  }

  /**
   * Rate limiting methods
   */
  private resetRateLimitsIfNeeded(): void {
    const now = Date.now();

    // Reset minute counter
    if (now - this.rateLimit.minuteStartTime >= 60000) {
      this.rateLimit.requestsThisMinute = 0;
      this.rateLimit.minuteStartTime = now;
    }

    // Reset hour counter
    if (now - this.rateLimit.hourStartTime >= 3600000) {
      this.rateLimit.requestsThisHour = 0;
      this.rateLimit.hourStartTime = now;
    }

    // Reset day counter
    if (now - this.rateLimit.dayStartTime >= 86400000) {
      this.rateLimit.requestsThisDay = 0;
      this.rateLimit.dayStartTime = now;
    }

    // Update throttled status
    this.rateLimit.isThrottled =
      this.rateLimit.requestsThisMinute >= this.LIMITS.PER_MINUTE ||
      this.rateLimit.requestsThisHour >= this.LIMITS.PER_HOUR ||
      this.rateLimit.requestsThisDay >= this.LIMITS.PER_DAY;
  }

  private incrementRateLimit(): void {
    this.resetRateLimitsIfNeeded();
    this.rateLimit.requestsThisMinute++;
    this.rateLimit.requestsThisHour++;
    this.rateLimit.requestsThisDay++;
  }

  private isRateLimited(): boolean {
    this.resetRateLimitsIfNeeded();
    return this.rateLimit.isThrottled;
  }

  /**
   * Caching methods
   */
  private getCachedResult(key: string): CacheEntry | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < entry.ttl) {
      return entry;
    }

    if (entry) {
      this.cache.delete(key); // Remove expired entry
    }

    return null;
  }

  private setCachedResult(
    key: string,
    data: FMCSACarrierData,
    ttl = this.DEFAULT_TTL
  ): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Limit cache size
    if (this.cache.size > 1000) {
      const entries = Array.from(this.cache.entries());
      const toDelete = entries.slice(0, entries.length - 1000);
      toDelete.forEach(([key]) => {
        this.cache.delete(key);
      });
    }
  }

  private startCacheCleanup(): void {
    // Clean expired entries every 10 minutes
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (now - entry.timestamp >= entry.ttl) {
            this.cache.delete(key);
          }
        }
      },
      10 * 60 * 1000
    );
  }

  /**
   * Utility methods
   */
  private isValidDOTNumber(dotNumber: string): boolean {
    const cleaned = dotNumber.replace(/\D/g, '');
    return cleaned.length >= 1 && cleaned.length <= 8;
  }

  private isValidMCNumber(mcNumber: string): boolean {
    const cleaned = mcNumber.replace(/[^\d]/g, '');
    return cleaned.length >= 1 && cleaned.length <= 8;
  }

  private formatAddress(data: any, type: 'phy' | 'mail'): string {
    const prefix = type === 'phy' ? 'phy' : 'mail';
    const street = data[`${prefix}Street`] || '';
    const city = data[`${prefix}City`] || '';
    const state = data[`${prefix}State`] || '';
    const zip = data[`${prefix}Zipcode`] || '';

    return `${street}, ${city}, ${state} ${zip}`.replace(/^,\s*|,\s*$/, '');
  }

  private mapOperatingStatus(
    status: string
  ): 'ACTIVE' | 'OUT_OF_SERVICE' | 'NOT_AUTHORIZED' {
    if (!status) return 'NOT_AUTHORIZED';

    const statusUpper = status.toUpperCase();
    if (statusUpper.includes('ACTIVE')) return 'ACTIVE';
    if (statusUpper.includes('OUT') || statusUpper.includes('SERVICE'))
      return 'OUT_OF_SERVICE';
    return 'NOT_AUTHORIZED';
  }

  private mapSafetyRating(
    rating: string
  ): 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED' {
    if (!rating) return 'NOT_RATED';

    const ratingUpper = rating.toUpperCase();
    if (ratingUpper.includes('SATISFACTORY')) return 'SATISFACTORY';
    if (ratingUpper.includes('CONDITIONAL')) return 'CONDITIONAL';
    if (ratingUpper.includes('UNSATISFACTORY')) return 'UNSATISFACTORY';
    return 'NOT_RATED';
  }

  private parseArrayField(field: any): string[] {
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') return field.split(',').map((s) => s.trim());
    return [];
  }

  /**
   * Metrics tracking methods
   */
  private updateMetrics(
    success: boolean,
    responseTime: number,
    error?: any
  ): void {
    this.metrics.totalRequests++;

    if (success) {
      this.metrics.successfulRequests++;
      this.metrics.lastRequestTime = Date.now();
    } else {
      this.metrics.failedRequests++;
      this.metrics.lastErrorTime = Date.now();
      this.metrics.lastError = error?.message || 'Unknown error';
    }

    // Update average response time
    const totalTime =
      this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) +
      responseTime;
    this.metrics.avgResponseTime = totalTime / this.metrics.totalRequests;
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    this.resetRateLimitsIfNeeded();

    return {
      status: this.isConfigured
        ? this.rateLimit.isThrottled
          ? 'RATE_LIMITED'
          : 'HEALTHY'
        : 'NOT_CONFIGURED',
      configured: this.isConfigured,
      apiKey: this.apiKey ? `${this.apiKey.substring(0, 8)}...` : null,
      metrics: this.metrics,
      rateLimitStatus: {
        ...this.rateLimit,
        limits: this.LIMITS,
        remainingThisMinute: Math.max(
          0,
          this.LIMITS.PER_MINUTE - this.rateLimit.requestsThisMinute
        ),
        remainingThisHour: Math.max(
          0,
          this.LIMITS.PER_HOUR - this.rateLimit.requestsThisHour
        ),
        remainingThisDay: Math.max(
          0,
          this.LIMITS.PER_DAY - this.rateLimit.requestsThisDay
        ),
      },
      cacheStatus: {
        size: this.cache.size,
        hitRate:
          this.metrics.totalRequests > 0
            ? (
                (this.metrics.cacheHits /
                  (this.metrics.cacheHits + this.metrics.cacheMisses)) *
                100
              ).toFixed(2) + '%'
            : 'N/A',
      },
    };
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const status = this.getSystemStatus();

      // Test with a known DOT number if configured
      let connectionTest = false;
      if (this.isConfigured) {
        try {
          // Test with a well-known carrier (e.g., FedEx DOT: 86803)
          const testResult = await this.searchByDOTWithRetry('86803');
          connectionTest = testResult.success || testResult.cached;
        } catch (error) {
          console.warn('⚠️ FMCSA connection test failed:', error);
        }
      }

      return {
        healthy:
          this.isConfigured &&
          connectionTest &&
          status.status !== 'RATE_LIMITED',
        details: {
          ...status,
          connectionTest,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'UNHEALTHY',
        },
      };
    }
  }

  /**
   * Mock data for testing when API key is not available
   */
  private getMockCarrierData(
    identifier: string,
    type: 'DOT' | 'MC'
  ): FMCSASearchResult {
    const mockData: FMCSACarrierData = {
      dotNumber: type === 'DOT' ? identifier : '12345',
      mcNumber: type === 'MC' ? identifier : 'MC-67890',
      legalName: 'Mock Transportation Company LLC',
      dbaName: 'Mock Trucking',
      physicalAddress: '123 Mock Street, Mock City, TX 12345',
      mailingAddress: '123 Mock Street, Mock City, TX 12345',
      phone: '(555) 123-4567',
      email: 'contact@mocktransport.com',
      operatingAuthority: 'ACTIVE',
      operatingStatus: 'ACTIVE',
      safetyRating: 'SATISFACTORY',
      entityType: 'CARRIER',
      powerUnits: 25,
      drivers: 30,
      mcs150Date: '2024-01-15',
      mcs150Mileage: 500000,
      equipmentTypes: ['Van', 'Flatbed'],
      cargoCarried: ['General Freight'],
      operationClassification: ['Interstate'],
      insuranceRequired: ['Cargo', 'Liability'],
      bondSurety: ['BMC-84'],
      safetyReviewDate: '2023-06-15',
      lastUpdateDate: new Date().toISOString(),
      crashTotal: 2,
      crashFatal: 0,
      crashInjury: 1,
      crashTow: 1,
      crashHazmat: 0,
      inspectionTotal: 15,
      inspectionOOS: 1,
      driverOOS: 0,
      vehicleOOS: 1,
      hazmatInspections: 0,
      driverViolations: 3,
      vehicleViolations: 2,
      hazmatViolations: 0,
      riskScore: 15,
      riskLevel: 'LOW',
      recommendations: ['No significant safety concerns identified'],
    };

    return {
      success: true,
      data: mockData,
      searchTime: 50,
      dataSource: 'MOCK',
    };
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache.clear();
    console.info('✅ FMCSA cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      hitRate:
        this.metrics.totalRequests > 0
          ? (this.metrics.cacheHits /
              (this.metrics.cacheHits + this.metrics.cacheMisses)) *
            100
          : 0,
      totalHits: this.metrics.cacheHits,
      totalMisses: this.metrics.cacheMisses,
    };
  }
}

// Export singleton instance
export const enhancedFMCSAService = new EnhancedFMCSAService();

