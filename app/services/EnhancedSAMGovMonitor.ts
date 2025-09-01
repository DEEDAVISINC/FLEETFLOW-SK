// Enhanced SAM.gov API Monitor with Production-Grade Features
// Includes rate limiting, circuit breaker, comprehensive error handling

import UniversalRFxNotificationService, {
  RFxOpportunity,
} from './UniversalRFxNotificationService';

interface OpportunityAlert {
  id: string;
  title: string;
  solicitationNumber: string;
  agency: string;
  amount?: string;
  responseDeadline: string;
  postedDate: string;
  description: string;
  naicsCode: string;
  setAsideType?: string;
  location?: string;
  url: string;
  noticeType:
    | 'Solicitation'
    | 'Sources Sought'
    | 'Special Notice'
    | 'Intent to Bundle'
    | 'Other';
  stage:
    | 'Pre-Solicitation'
    | 'Active Solicitation'
    | 'Amendment'
    | 'Award'
    | 'Cancelled';
  daysUntilDeadline?: number;
  isPreSolicitation: boolean;
}

interface RateLimitInfo {
  requestsThisHour: number;
  hourStartTime: number;
  maxRequestsPerHour: number;
  isThrottled: boolean;
}

interface CircuitBreakerState {
  isOpen: boolean;
  consecutiveFailures: number;
  lastFailureTime: number;
  maxFailures: number;
  resetTimeoutMs: number;
}

interface APIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  lastSuccessTime: number;
  lastErrorTime: number;
  lastError?: string;
}

export class EnhancedSAMGovMonitor {
  private readonly baseUrl = 'https://api.sam.gov/opportunities/v2/search';
  private notificationService: UniversalRFxNotificationService;
  
  // Rate limiting
  private rateLimit: RateLimitInfo = {
    requestsThisHour: 0,
    hourStartTime: Date.now(),
    maxRequestsPerHour: 900, // 90% of SAM.gov's 1000/hour limit
    isThrottled: false
  };

  // Circuit breaker
  private circuitBreaker: CircuitBreakerState = {
    isOpen: false,
    consecutiveFailures: 0,
    lastFailureTime: 0,
    maxFailures: 5,
    resetTimeoutMs: 300000 // 5 minutes
  };

  // Metrics tracking
  private metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    lastSuccessTime: 0,
    lastErrorTime: 0
  };

  constructor() {
    this.notificationService = new UniversalRFxNotificationService();
    this.resetRateLimitIfNeeded();
  }

  /**
   * Main method to check for new opportunities with enhanced error handling
   */
  async checkForNewOpportunities(): Promise<{
    success: boolean;
    newOpportunities: OpportunityAlert[];
    totalOpportunities: number;
    metrics: APIMetrics;
    rateLimitStatus: RateLimitInfo;
    circuitBreakerStatus: CircuitBreakerState;
  }> {
    const startTime = Date.now();

    try {
      // Check circuit breaker
      if (this.isCircuitBreakerOpen()) {
        console.warn('⚠️ SAM.gov API circuit breaker is OPEN - requests blocked');
        return this.createErrorResponse('Circuit breaker open');
      }

      // Check rate limit
      if (this.isRateLimited()) {
        console.warn('⚠️ SAM.gov API rate limit reached - request throttled');
        return this.createErrorResponse('Rate limit exceeded');
      }

      // Fetch opportunities
      const opportunities = await this.fetchOpportunitiesWithRetry();
      
      // Update metrics for successful request
      this.updateMetrics(true, Date.now() - startTime);
      this.resetCircuitBreaker();
      
      // Process and return results
      return {
        success: true,
        newOpportunities: opportunities,
        totalOpportunities: opportunities.length,
        metrics: this.metrics,
        rateLimitStatus: this.rateLimit,
        circuitBreakerStatus: this.circuitBreaker
      };

    } catch (error) {
      // Update metrics for failed request
      this.updateMetrics(false, Date.now() - startTime, error);
      this.incrementCircuitBreakerFailures();
      
      console.error('❌ Enhanced SAM.gov Monitor error:', error);
      
      return this.createErrorResponse(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Fetch opportunities with retry logic and exponential backoff
   */
  private async fetchOpportunitiesWithRetry(maxRetries = 3): Promise<OpportunityAlert[]> {
    const apiKey = process.env.SAMGOV_API_KEY;
    
    if (!apiKey || apiKey === 'your_samgov_api_key_here') {
      console.warn('⚠️ SAM.gov API key not configured, using mock data');
      return this.getMockOpportunities();
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Increment rate limit counter
        this.incrementRateLimit();
        
        const startTime = Date.now();
        
        // Build query parameters
        const queryParams = this.buildQueryParameters();
        
        // Make API request
        const response = await fetch(`${this.baseUrl}?${queryParams}`, {
          headers: {
            'X-Api-Key': apiKey,
            'Accept': 'application/json',
            'User-Agent': 'FleetFlow/1.0'
          },
          timeout: 30000 // 30 second timeout
        });

        // Check for rate limit response
        if (response.status === 429) {
          this.handleRateLimitResponse(response);
          throw new Error('API rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(`SAM.gov API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.opportunitiesData || !Array.isArray(data.opportunitiesData)) {
          console.warn('⚠️ No opportunities data received from SAM.gov');
          return [];
        }

        // Process and return opportunities
        return this.processOpportunitiesData(data.opportunitiesData);

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff, max 10s
          console.info(`⚠️ SAM.gov API attempt ${attempt} failed, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Build query parameters for SAM.gov API
   */
  private buildQueryParameters(): URLSearchParams {
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}/${d.getFullYear()}`;
    };

    // Search for opportunities posted in the last 7 days
    const fromDate = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const toDate = formatDate(new Date());

    const queryParams = new URLSearchParams({
      format: 'json',
      limit: '100',
      offset: '0',
      postedFrom: fromDate,
      postedTo: toDate,
      ncode: '484110,484121,484122,484210,484220,484230', // Transportation NAICS codes
      ptype: 'o,r,s,k', // All opportunity types
      active: 'Yes'
    });

    // Add transportation-specific keywords
    const keywords = [
      'transportation', 'freight', 'logistics', 'shipping', 'distribution',
      'trucking', 'delivery', 'cargo', 'warehousing', 'supply chain'
    ];
    queryParams.append('title', keywords.join(' OR '));

    return queryParams;
  }

  /**
   * Process opportunities data from SAM.gov API
   */
  private processOpportunitiesData(opportunitiesData: any[]): OpportunityAlert[] {
    return opportunitiesData.map(opp => ({
      id: opp.noticeId || `sam-${Date.now()}-${Math.random()}`,
      title: opp.title || 'Untitled Opportunity',
      solicitationNumber: opp.solicitationNumber || opp.noticeId || '',
      agency: opp.organizationName || opp.departmentName || 'Unknown Agency',
      amount: this.extractAmount(opp),
      responseDeadline: opp.responseDeadLine || opp.deadline || '',
      postedDate: opp.postedDate || opp.publishedDate || '',
      description: opp.description || opp.synopsis || '',
      naicsCode: opp.naicsCode || '',
      setAsideType: opp.typeOfSetAsideDescription || '',
      location: this.extractLocation(opp),
      url: opp.uiLink || `https://sam.gov/opp/${opp.noticeId}`,
      noticeType: this.determineNoticeType(opp),
      stage: this.determineStage(opp),
      daysUntilDeadline: this.calculateDaysUntilDeadline(opp.responseDeadLine),
      isPreSolicitation: opp.type?.toLowerCase().includes('presolicitation') || false
    }));
  }

  /**
   * Rate limiting methods
   */
  private resetRateLimitIfNeeded(): void {
    const currentTime = Date.now();
    const hoursSinceReset = (currentTime - this.rateLimit.hourStartTime) / (1000 * 60 * 60);
    
    if (hoursSinceReset >= 1) {
      this.rateLimit.requestsThisHour = 0;
      this.rateLimit.hourStartTime = currentTime;
      this.rateLimit.isThrottled = false;
    }
  }

  private incrementRateLimit(): void {
    this.resetRateLimitIfNeeded();
    this.rateLimit.requestsThisHour++;
    
    if (this.rateLimit.requestsThisHour >= this.rateLimit.maxRequestsPerHour) {
      this.rateLimit.isThrottled = true;
    }
  }

  private isRateLimited(): boolean {
    this.resetRateLimitIfNeeded();
    return this.rateLimit.isThrottled;
  }

  /**
   * Circuit breaker methods
   */
  private isCircuitBreakerOpen(): boolean {
    if (!this.circuitBreaker.isOpen) return false;
    
    const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailureTime;
    if (timeSinceLastFailure > this.circuitBreaker.resetTimeoutMs) {
      console.info('🔄 Circuit breaker reset timeout reached, attempting to close...');
      return false;
    }
    
    return true;
  }

  private incrementCircuitBreakerFailures(): void {
    this.circuitBreaker.consecutiveFailures++;
    this.circuitBreaker.lastFailureTime = Date.now();
    
    if (this.circuitBreaker.consecutiveFailures >= this.circuitBreaker.maxFailures) {
      this.circuitBreaker.isOpen = true;
      console.error('🚨 SAM.gov API circuit breaker OPENED due to consecutive failures');
    }
  }

  private resetCircuitBreaker(): void {
    if (this.circuitBreaker.consecutiveFailures > 0) {
      console.info('✅ SAM.gov API circuit breaker reset - service healthy');
    }
    this.circuitBreaker.consecutiveFailures = 0;
    this.circuitBreaker.isOpen = false;
  }

  /**
   * Metrics tracking methods
   */
  private updateMetrics(success: boolean, responseTime: number, error?: any): void {
    this.metrics.totalRequests++;
    
    if (success) {
      this.metrics.successfulRequests++;
      this.metrics.lastSuccessTime = Date.now();
    } else {
      this.metrics.failedRequests++;
      this.metrics.lastErrorTime = Date.now();
      this.metrics.lastError = error?.message || 'Unknown error';
    }
    
    // Update average response time
    const totalTime = this.metrics.avgResponseTime * (this.metrics.totalRequests - 1) + responseTime;
    this.metrics.avgResponseTime = totalTime / this.metrics.totalRequests;
  }

  /**
   * Helper methods
   */
  private handleRateLimitResponse(response: Response): void {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      const retryAfterMs = parseInt(retryAfter) * 1000;
      console.warn(`⚠️ SAM.gov API rate limited, retry after ${retryAfter} seconds`);
      // Mark as throttled
      this.rateLimit.isThrottled = true;
      // Reset throttle after the specified time
      setTimeout(() => {
        this.rateLimit.isThrottled = false;
      }, retryAfterMs);
    }
  }

  private createErrorResponse(error: string) {
    return {
      success: false,
      newOpportunities: [],
      totalOpportunities: 0,
      metrics: this.metrics,
      rateLimitStatus: this.rateLimit,
      circuitBreakerStatus: this.circuitBreaker
    };
  }

  private extractAmount(opp: any): string {
    return opp.totalValue || opp.award?.amount || opp.estimatedValue || '';
  }

  private extractLocation(opp: any): string {
    return opp.placeOfPerformance?.state || opp.officeAddress?.state || '';
  }

  private determineNoticeType(opp: any): OpportunityAlert['noticeType'] {
    const type = (opp.type || opp.noticeType || '').toLowerCase();
    
    if (type.includes('sources sought') || type.includes('market research')) {
      return 'Sources Sought';
    } else if (type.includes('special notice')) {
      return 'Special Notice';
    } else if (type.includes('intent to bundle')) {
      return 'Intent to Bundle';
    } else if (type.includes('solicitation') || type.includes('rfp') || type.includes('rfq')) {
      return 'Solicitation';
    }
    
    return 'Other';
  }

  private determineStage(opp: any): OpportunityAlert['stage'] {
    const status = (opp.status || '').toLowerCase();
    const type = (opp.type || '').toLowerCase();
    
    if (type.includes('presolicitation') || status.includes('presolicitation')) {
      return 'Pre-Solicitation';
    } else if (status.includes('active') || status.includes('open')) {
      return 'Active Solicitation';
    } else if (status.includes('amendment')) {
      return 'Amendment';
    } else if (status.includes('award')) {
      return 'Award';
    } else if (status.includes('cancelled')) {
      return 'Cancelled';
    }
    
    return 'Active Solicitation'; // Default
  }

  private calculateDaysUntilDeadline(deadline: string): number {
    if (!deadline) return 0;
    
    try {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      const diffTime = deadlineDate.getTime() - today.getTime();
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  }

  /**
   * Get system status and health metrics
   */
  getSystemStatus() {
    return {
      status: this.circuitBreaker.isOpen ? 'CIRCUIT_OPEN' : 
              this.rateLimit.isThrottled ? 'RATE_LIMITED' : 'HEALTHY',
      uptime: process.uptime(),
      metrics: this.metrics,
      rateLimitStatus: {
        ...this.rateLimit,
        remainingRequests: this.rateLimit.maxRequestsPerHour - this.rateLimit.requestsThisHour,
        resetTime: new Date(this.rateLimit.hourStartTime + 60 * 60 * 1000).toISOString()
      },
      circuitBreakerStatus: {
        ...this.circuitBreaker,
        willResetAt: this.circuitBreaker.isOpen ? 
          new Date(this.circuitBreaker.lastFailureTime + this.circuitBreaker.resetTimeoutMs).toISOString() : null
      }
    };
  }

  /**
   * Mock opportunities for testing when API key is not available
   */
  private getMockOpportunities(): OpportunityAlert[] {
    return [
      {
        id: 'mock-001',
        title: 'Transportation Services - Multi-State Freight Movement',
        solicitationNumber: 'TEST-2024-001',
        agency: 'Department of Defense',
        amount: '$2,500,000',
        responseDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        postedDate: new Date().toISOString(),
        description: 'Mock opportunity for testing SAM.gov integration',
        naicsCode: '484110',
        setAsideType: 'Small Business',
        location: 'TX',
        url: 'https://sam.gov/mock',
        noticeType: 'Solicitation',
        stage: 'Active Solicitation',
        daysUntilDeadline: 14,
        isPreSolicitation: false
      }
    ];
  }
}

// Export singleton instance
export const enhancedSAMGovMonitor = new EnhancedSAMGovMonitor();

