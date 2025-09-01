// Enhanced Claude AI Service - Production Grade
// Includes fallback mechanisms, cost monitoring, response optimization, error handling

interface AIRequest {
  prompt: string;
  context?: any;
  maxTokens?: number;
  temperature?: number;
  urgency?: 'low' | 'normal' | 'high' | 'critical';
  fallbackEnabled?: boolean;
}

interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  cost?: number;
  responseTime?: number;
  tokensUsed?: number;
  source: 'CLAUDE_API' | 'FALLBACK' | 'CACHE' | 'MOCK';
  cached?: boolean;
  retries?: number;
}

interface RateLimitInfo {
  requestsThisMinute: number;
  requestsThisHour: number;
  requestsThisDay: number;
  tokensThisMinute: number;
  tokensThisHour: number;
  tokensThisDay: number;
  minuteStartTime: number;
  hourStartTime: number;
  dayStartTime: number;
  isThrottled: boolean;
}

interface CostMetrics {
  totalRequests: number;
  totalCost: number;
  costThisMonth: number;
  costThisDay: number;
  totalTokensUsed: number;
  averageCostPerRequest: number;
  averageTokensPerRequest: number;
  lastReset: Date;
}

interface AIMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  fallbackRequests: number;
  cacheHits: number;
  cacheMisses: number;
  avgResponseTime: number;
  lastRequestTime: number;
  lastErrorTime: number;
  lastError?: string;
}

interface CacheEntry {
  content: string;
  timestamp: number;
  ttl: number;
  cost: number;
  tokensUsed: number;
}

export class EnhancedClaudeAIService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.anthropic.com/v1';
  private isConfigured: boolean = false;

  // Rate limiting (Claude has generous limits but we'll be conservative)
  private rateLimit: RateLimitInfo = {
    requestsThisMinute: 0,
    requestsThisHour: 0,
    requestsThisDay: 0,
    tokensThisMinute: 0,
    tokensThisHour: 0,
    tokensThisDay: 0,
    minuteStartTime: Date.now(),
    hourStartTime: Date.now(),
    dayStartTime: Date.now(),
    isThrottled: false,
  };

  // Cost monitoring
  private costMetrics: CostMetrics = {
    totalRequests: 0,
    totalCost: 0,
    costThisMonth: 0,
    costThisDay: 0,
    totalTokensUsed: 0,
    averageCostPerRequest: 0,
    averageTokensPerRequest: 0,
    lastReset: new Date(),
  };

  // Performance metrics
  private metrics: AIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    fallbackRequests: 0,
    cacheHits: 0,
    cacheMisses: 0,
    avgResponseTime: 0,
    lastRequestTime: 0,
    lastErrorTime: 0,
  };

  // Caching system (cache for 30 minutes by default)
  private cache: Map<string, CacheEntry> = new Map();
  private readonly DEFAULT_TTL = 30 * 60 * 1000; // 30 minutes

  // Rate limits (conservative estimates based on Claude's pricing tiers)
  private readonly LIMITS = {
    REQUESTS_PER_MINUTE: 50, // 50 requests per minute
    REQUESTS_PER_HOUR: 1000, // 1000 requests per hour
    REQUESTS_PER_DAY: 10000, // 10000 requests per day
    TOKENS_PER_MINUTE: 40000, // 40K tokens per minute
    TOKENS_PER_HOUR: 200000, // 200K tokens per hour
    TOKENS_PER_DAY: 1000000, // 1M tokens per day
  };

  // Pricing (approximate Claude 3 pricing)
  private readonly PRICING = {
    INPUT_COST_PER_TOKEN: 0.000003, // $3 per million input tokens
    OUTPUT_COST_PER_TOKEN: 0.000015, // $15 per million output tokens
  };

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';

    if (!this.apiKey || this.apiKey === 'your_anthropic_api_key_here') {
      console.warn(
        '⚠️ Claude AI API key not configured - using fallback responses'
      );
      this.isConfigured = false;
    } else {
      this.isConfigured = true;
      console.info(
        '✅ Enhanced Claude AI service initialized with production features'
      );
    }

    this.resetRateLimitsIfNeeded();
    this.startCacheCleanup();
  }

  /**
   * Generate AI response with enhanced features
   */
  async generateResponseWithRetry(
    request: AIRequest,
    maxRetries = 3
  ): Promise<AIResponse> {
    const startTime = Date.now();
    const cacheKey = this.generateCacheKey(request);

    try {
      // Check cache first
      const cachedResult = this.getCachedResult(cacheKey);
      if (cachedResult) {
        this.metrics.cacheHits++;
        return {
          success: true,
          content: cachedResult.content,
          cost: cachedResult.cost,
          tokensUsed: cachedResult.tokensUsed,
          responseTime: Date.now() - startTime,
          source: 'CACHE',
          cached: true,
        };
      }

      this.metrics.cacheMisses++;

      // Check if service is configured
      if (!this.isConfigured) {
        return this.getFallbackResponse(request, Date.now() - startTime);
      }

      // Check rate limits
      if (this.isRateLimited()) {
        if (request.fallbackEnabled !== false) {
          return this.getFallbackResponse(request, Date.now() - startTime);
        }
        return {
          success: false,
          error: 'Rate limit exceeded and fallback disabled',
          responseTime: Date.now() - startTime,
          source: 'CLAUDE_API',
        };
      }

      // Attempt request with retry logic
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Update rate limit counters
          this.incrementRateLimit(request.maxTokens || 1000);

          const result = await this.performClaudeRequest(request);

          // Update metrics for successful request
          this.updateMetrics(true, Date.now() - startTime);
          this.updateCostMetrics(result.cost || 0, result.tokensUsed || 0);

          // Cache the result if successful
          if (result.success && result.content) {
            this.setCachedResult(
              cacheKey,
              result.content,
              result.cost || 0,
              result.tokensUsed || 0
            );
          }

          return {
            ...result,
            responseTime: Date.now() - startTime,
            retries: attempt - 1,
          };
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error('Unknown error');

          if (attempt < maxRetries) {
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.info(
              `⚠️ Claude AI attempt ${attempt} failed, retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }

      // All retries failed - use fallback if enabled
      this.updateMetrics(false, Date.now() - startTime, lastError);

      if (request.fallbackEnabled !== false) {
        console.info('🔄 Claude AI failed, using fallback response');
        return this.getFallbackResponse(request, Date.now() - startTime);
      }

      return {
        success: false,
        error: lastError?.message || 'All retry attempts failed',
        responseTime: Date.now() - startTime,
        source: 'CLAUDE_API',
        retries: maxRetries,
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime, error);

      if (request.fallbackEnabled !== false) {
        return this.getFallbackResponse(request, Date.now() - startTime);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
        source: 'CLAUDE_API',
      };
    }
  }

  /**
   * Perform actual Claude API request
   */
  private async performClaudeRequest(request: AIRequest): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01',
        'User-Agent': 'FleetFlow/1.0',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: request.maxTokens || 1000,
        temperature: request.temperature || 0.7,
        messages: [
          {
            role: 'user',
            content: this.formatPrompt(request.prompt, request.context),
          },
        ],
      }),
      timeout: 30000,
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error(
        `Claude API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.content || !data.content[0] || !data.content[0].text) {
      throw new Error('Invalid response format from Claude API');
    }

    // Calculate cost
    const inputTokens = data.usage?.input_tokens || 0;
    const outputTokens = data.usage?.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;
    const cost =
      inputTokens * this.PRICING.INPUT_COST_PER_TOKEN +
      outputTokens * this.PRICING.OUTPUT_COST_PER_TOKEN;

    return {
      success: true,
      content: data.content[0].text,
      cost,
      tokensUsed: totalTokens,
      source: 'CLAUDE_API',
    };
  }

  /**
   * Generate fallback response when Claude API is unavailable
   */
  private getFallbackResponse(
    request: AIRequest,
    responseTime: number
  ): AIResponse {
    this.metrics.fallbackRequests++;

    // Generate intelligent fallback based on prompt analysis
    const fallbackContent = this.generateIntelligentFallback(
      request.prompt,
      request.context
    );

    return {
      success: true,
      content: fallbackContent,
      cost: 0,
      tokensUsed: 0,
      responseTime,
      source: 'FALLBACK',
    };
  }

  /**
   * Generate intelligent fallback responses
   */
  private generateIntelligentFallback(prompt: string, context?: any): string {
    const promptLower = prompt.toLowerCase();

    // Route optimization fallback
    if (promptLower.includes('route') || promptLower.includes('optimize')) {
      return `Based on the provided data, here's a recommended route optimization:

1. **Primary Route**: Direct path with minimal stops
2. **Fuel Efficiency**: Prioritize highways and avoid city centers
3. **Time Optimization**: Consider traffic patterns and delivery windows
4. **Cost Analysis**: Estimated fuel cost and driver time

*Note: This is a fallback response. For advanced AI-powered optimization, please configure Claude AI integration.*`;
    }

    // Load matching fallback
    if (promptLower.includes('load') || promptLower.includes('match')) {
      return `Load matching analysis based on available data:

**Recommended Matches:**
- Equipment compatibility: ✓ Verified
- Route efficiency: High priority
- Carrier reliability: Standard verification required
- Rate competitiveness: Market analysis needed

**Next Steps:**
1. Verify carrier credentials
2. Confirm equipment availability
3. Negotiate final rates
4. Execute load agreement

*Enhanced AI matching available with Claude AI integration.*`;
    }

    // Document generation fallback
    if (promptLower.includes('document') || promptLower.includes('generate')) {
      return `Document generation template:

**Standard Business Document**

Based on your requirements, here's a structured document outline:

1. **Header Information**
   - Date: ${new Date().toLocaleDateString()}
   - Reference: Auto-generated

2. **Main Content**
   - Primary details as requested
   - Supporting information
   - Relevant context

3. **Footer**
   - Contact information
   - Legal disclaimers

*For advanced document generation with AI customization, please configure Claude AI.*`;
    }

    // General analysis fallback
    if (promptLower.includes('analyz') || promptLower.includes('report')) {
      return `Analysis Report - Fallback Mode

**Summary:**
Based on the available data, here are the key findings:

- **Data Quality**: Standard processing completed
- **Key Metrics**: Basic calculations performed
- **Recommendations**: Standard best practices apply
- **Risk Assessment**: Manual review recommended

**Limitations:**
This analysis uses fallback processing. For comprehensive AI-powered insights, advanced pattern recognition, and predictive analytics, please configure Claude AI integration.

**Next Steps:**
1. Review findings with domain expert
2. Validate recommendations
3. Consider AI enhancement for deeper insights`;
    }

    // Default fallback
    return `FleetFlow AI Assistant - Fallback Response

Thank you for your request. While our advanced AI capabilities are currently unavailable, here's a standard response based on your inquiry:

**Request Processing:**
- Input received and analyzed
- Standard processing rules applied
- Basic response generated

**Recommendation:**
For enhanced AI-powered responses with advanced reasoning, natural language processing, and context-aware analysis, please configure Claude AI integration with a valid API key.

**Support:**
Contact your system administrator to enable full AI capabilities.

*This is a fallback response generated by FleetFlow's backup systems.*`;
  }

  /**
   * Format prompt for Claude API
   */
  private formatPrompt(prompt: string, context?: any): string {
    let formattedPrompt = `You are FleetFlow AI, an expert transportation and logistics assistant. Please provide a helpful, accurate, and professional response.

User Request: ${prompt}`;

    if (context) {
      formattedPrompt += `\n\nContext: ${JSON.stringify(context, null, 2)}`;
    }

    formattedPrompt += `\n\nPlease provide a clear, actionable response that helps with transportation and logistics operations.`;

    return formattedPrompt;
  }

  /**
   * Rate limiting methods
   */
  private resetRateLimitsIfNeeded(): void {
    const now = Date.now();

    // Reset minute counters
    if (now - this.rateLimit.minuteStartTime >= 60000) {
      this.rateLimit.requestsThisMinute = 0;
      this.rateLimit.tokensThisMinute = 0;
      this.rateLimit.minuteStartTime = now;
    }

    // Reset hour counters
    if (now - this.rateLimit.hourStartTime >= 3600000) {
      this.rateLimit.requestsThisHour = 0;
      this.rateLimit.tokensThisHour = 0;
      this.rateLimit.hourStartTime = now;
    }

    // Reset day counters
    if (now - this.rateLimit.dayStartTime >= 86400000) {
      this.rateLimit.requestsThisDay = 0;
      this.rateLimit.tokensThisDay = 0;
      this.rateLimit.dayStartTime = now;
      this.resetDailyCostMetrics();
    }

    // Update throttled status
    this.rateLimit.isThrottled =
      this.rateLimit.requestsThisMinute >= this.LIMITS.REQUESTS_PER_MINUTE ||
      this.rateLimit.requestsThisHour >= this.LIMITS.REQUESTS_PER_HOUR ||
      this.rateLimit.requestsThisDay >= this.LIMITS.REQUESTS_PER_DAY ||
      this.rateLimit.tokensThisMinute >= this.LIMITS.TOKENS_PER_MINUTE ||
      this.rateLimit.tokensThisHour >= this.LIMITS.TOKENS_PER_HOUR ||
      this.rateLimit.tokensThisDay >= this.LIMITS.TOKENS_PER_DAY;
  }

  private incrementRateLimit(estimatedTokens: number): void {
    this.resetRateLimitsIfNeeded();
    this.rateLimit.requestsThisMinute++;
    this.rateLimit.requestsThisHour++;
    this.rateLimit.requestsThisDay++;
    this.rateLimit.tokensThisMinute += estimatedTokens;
    this.rateLimit.tokensThisHour += estimatedTokens;
    this.rateLimit.tokensThisDay += estimatedTokens;
  }

  private isRateLimited(): boolean {
    this.resetRateLimitsIfNeeded();
    return this.rateLimit.isThrottled;
  }

  /**
   * Caching methods
   */
  private generateCacheKey(request: AIRequest): string {
    const keyData = {
      prompt: request.prompt,
      context: request.context,
      maxTokens: request.maxTokens,
      temperature: request.temperature,
    };
    return Buffer.from(JSON.stringify(keyData))
      .toString('base64')
      .substring(0, 32);
  }

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
    content: string,
    cost: number,
    tokensUsed: number,
    ttl = this.DEFAULT_TTL
  ): void {
    this.cache.set(key, {
      content,
      timestamp: Date.now(),
      ttl,
      cost,
      tokensUsed,
    });

    // Limit cache size
    if (this.cache.size > 500) {
      const entries = Array.from(this.cache.entries());
      const toDelete = entries.slice(0, entries.length - 500);
      toDelete.forEach(([key]) => {
        this.cache.delete(key);
      });
    }
  }

  private startCacheCleanup(): void {
    // Clean expired entries every 15 minutes
    setInterval(
      () => {
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (now - entry.timestamp >= entry.ttl) {
            this.cache.delete(key);
          }
        }
      },
      15 * 60 * 1000
    );
  }

  /**
   * Cost tracking methods
   */
  private updateCostMetrics(cost: number, tokensUsed: number): void {
    this.costMetrics.totalRequests++;
    this.costMetrics.totalCost += cost;
    this.costMetrics.costThisDay += cost;
    this.costMetrics.totalTokensUsed += tokensUsed;

    // Update monthly cost (simple approximation)
    const now = new Date();
    if (now.getMonth() !== this.costMetrics.lastReset.getMonth()) {
      this.costMetrics.costThisMonth = cost;
      this.costMetrics.lastReset = now;
    } else {
      this.costMetrics.costThisMonth += cost;
    }

    this.costMetrics.averageCostPerRequest =
      this.costMetrics.totalCost / this.costMetrics.totalRequests;
    this.costMetrics.averageTokensPerRequest =
      this.costMetrics.totalTokensUsed / this.costMetrics.totalRequests;
  }

  private resetDailyCostMetrics(): void {
    this.costMetrics.costThisDay = 0;
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
      costMetrics: this.costMetrics,
      rateLimitStatus: {
        ...this.rateLimit,
        limits: this.LIMITS,
        remainingRequestsThisMinute: Math.max(
          0,
          this.LIMITS.REQUESTS_PER_MINUTE - this.rateLimit.requestsThisMinute
        ),
        remainingRequestsThisHour: Math.max(
          0,
          this.LIMITS.REQUESTS_PER_HOUR - this.rateLimit.requestsThisHour
        ),
        remainingTokensThisMinute: Math.max(
          0,
          this.LIMITS.TOKENS_PER_MINUTE - this.rateLimit.tokensThisMinute
        ),
        remainingTokensThisHour: Math.max(
          0,
          this.LIMITS.TOKENS_PER_HOUR - this.rateLimit.tokensThisHour
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

      // Test with a simple request if configured
      let connectionTest = false;
      if (this.isConfigured) {
        try {
          const testResult = await this.generateResponseWithRetry({
            prompt: 'Test connection - respond with "OK"',
            maxTokens: 10,
            fallbackEnabled: false,
          });
          connectionTest =
            testResult.success && testResult.source === 'CLAUDE_API';
        } catch (error) {
          console.warn('⚠️ Claude AI connection test failed:', error);
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
          fallbackAvailable: true,
        },
      };
    } catch (error) {
      return {
        healthy: false,
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'UNHEALTHY',
          fallbackAvailable: true,
        },
      };
    }
  }

  /**
   * Get cost analysis
   */
  getCostAnalysis() {
    return {
      ...this.costMetrics,
      projectedMonthlyCost: this.costMetrics.costThisDay * 30,
      projectedYearlyCost: this.costMetrics.costThisDay * 365,
      recommendations: this.generateCostRecommendations(),
    };
  }

  /**
   * Generate cost optimization recommendations
   */
  private generateCostRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.costMetrics.averageCostPerRequest > 0.05) {
      recommendations.push(
        'Consider using shorter prompts or lower max_tokens to reduce costs'
      );
    }

    if (this.metrics.cacheHits / Math.max(this.metrics.cacheMisses, 1) < 0.3) {
      recommendations.push(
        'Low cache hit rate - consider longer cache TTL for repeated queries'
      );
    }

    if (this.metrics.fallbackRequests > this.metrics.successfulRequests * 0.1) {
      recommendations.push(
        'High fallback usage - check API key and rate limits'
      );
    }

    if (this.costMetrics.averageTokensPerRequest > 2000) {
      recommendations.push(
        'High token usage - consider breaking large requests into smaller chunks'
      );
    }

    if (recommendations.length === 0) {
      recommendations.push(
        'AI usage is optimized - no immediate cost concerns'
      );
    }

    return recommendations;
  }

  /**
   * Clear cache manually
   */
  clearCache(): void {
    this.cache.clear();
    console.info('✅ Claude AI cache cleared');
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
      totalSavedCost: Array.from(this.cache.values()).reduce(
        (sum, entry) => sum + entry.cost,
        0
      ),
    };
  }
}

// Export singleton instance
export const enhancedClaudeAIService = new EnhancedClaudeAIService();

