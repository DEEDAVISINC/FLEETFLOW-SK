// Enhanced Twilio SMS Service - Production Grade
// Includes rate limiting, delivery confirmation, retry logic, cost monitoring

interface SMSMessage {
  to: string;
  message: string;
  urgency?: 'low' | 'normal' | 'high' | 'urgent';
  template?: string;
  metadata?: Record<string, any>;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
  cost?: number;
  status?: string;
  retries?: number;
}

interface RateLimitInfo {
  sentThisMinute: number;
  sentThisHour: number;
  sentThisDay: number;
  minuteStartTime: number;
  hourStartTime: number;
  dayStartTime: number;
  isThrottled: boolean;
}

interface DeliveryStatus {
  messageId: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  errorCode?: string;
  errorMessage?: string;
  deliveredAt?: Date;
  cost?: number;
  priceUnit?: string;
}

interface CostMetrics {
  totalMessagesSent: number;
  totalCost: number;
  costThisMonth: number;
  costThisDay: number;
  averageCostPerMessage: number;
  lastReset: Date;
}

interface TwilioMetrics {
  totalRequests: number;
  successfulMessages: number;
  failedMessages: number;
  retriedMessages: number;
  avgResponseTime: number;
  lastMessageTime: number;
  lastErrorTime: number;
  lastError?: string;
}

export class EnhancedTwilioService {
  private client: any;
  private isConfigured: boolean = false;
  private fromNumber: string = '';

  // Rate limiting (Twilio has different limits based on account type)
  private rateLimit: RateLimitInfo = {
    sentThisMinute: 0,
    sentThisHour: 0,
    sentThisDay: 0,
    minuteStartTime: Date.now(),
    hourStartTime: Date.now(),
    dayStartTime: Date.now(),
    isThrottled: false,
  };

  // Message delivery tracking
  private deliveryTracking: Map<string, DeliveryStatus> = new Map();

  // Cost monitoring
  private costMetrics: CostMetrics = {
    totalMessagesSent: 0,
    totalCost: 0,
    costThisMonth: 0,
    costThisDay: 0,
    averageCostPerMessage: 0,
    lastReset: new Date(),
  };

  // Performance metrics
  private metrics: TwilioMetrics = {
    totalRequests: 0,
    successfulMessages: 0,
    failedMessages: 0,
    retriedMessages: 0,
    avgResponseTime: 0,
    lastMessageTime: 0,
    lastErrorTime: 0,
  };

  // Rate limits (conservative defaults - adjust based on Twilio account)
  private readonly LIMITS = {
    PER_MINUTE: 100, // 100 messages per minute
    PER_HOUR: 3000, // 3000 messages per hour
    PER_DAY: 50000, // 50000 messages per day
  };

  constructor() {
    this.initializeTwilio();
    this.resetRateLimitsIfNeeded();
  }

  /**
   * Initialize Twilio client with credentials
   */
  private initializeTwilio(): void {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';

      if (!accountSid || !authToken || !this.fromNumber) {
        console.warn(
          '⚠️ Twilio credentials not configured - SMS service disabled'
        );
        return;
      }

      if (
        accountSid === 'your_twilio_account_sid_here' ||
        authToken === 'your_twilio_auth_token_here'
      ) {
        console.warn(
          '⚠️ Twilio credentials not updated from template - SMS service disabled'
        );
        return;
      }

      // Import Twilio dynamically
      const twilio = require('twilio');
      this.client = twilio(accountSid, authToken);
      this.isConfigured = true;

      console.info('✅ Twilio SMS service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Twilio:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Send SMS with enhanced features
   */
  async sendSMSWithRetry(
    smsMessage: SMSMessage,
    maxRetries = 3
  ): Promise<SMSResult> {
    const startTime = Date.now();

    try {
      // Check if service is configured
      if (!this.isConfigured) {
        return {
          success: false,
          error: 'Twilio service not configured',
        };
      }

      // Check rate limits
      if (this.isRateLimited()) {
        return {
          success: false,
          error: 'Rate limit exceeded - message throttled',
        };
      }

      // Validate phone number
      if (!this.isValidPhoneNumber(smsMessage.to)) {
        return {
          success: false,
          error: 'Invalid phone number format',
        };
      }

      // Attempt to send with retry logic
      let lastError: Error | null = null;

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          // Update rate limit counters
          this.incrementRateLimit();

          const result = await this.sendSingleMessage(smsMessage);

          // Update metrics for successful message
          this.updateMetrics(true, Date.now() - startTime);
          this.updateCostMetrics(result.cost || 0);

          // Track delivery status
          if (result.messageId) {
            this.trackDeliveryStatus(result.messageId, 'sent');
          }

          return {
            ...result,
            retries: attempt - 1,
          };
        } catch (error) {
          lastError =
            error instanceof Error ? error : new Error('Unknown error');

          if (attempt < maxRetries) {
            // Exponential backoff
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.info(
              `⚠️ Twilio SMS attempt ${attempt} failed, retrying in ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));

            this.metrics.retriedMessages++;
          }
        }
      }

      // All retries failed
      this.updateMetrics(false, Date.now() - startTime, lastError);

      return {
        success: false,
        error: lastError?.message || 'All retry attempts failed',
        retries: maxRetries,
      };
    } catch (error) {
      this.updateMetrics(false, Date.now() - startTime, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Send a single SMS message
   */
  private async sendSingleMessage(smsMessage: SMSMessage): Promise<SMSResult> {
    const messageOptions: any = {
      body: smsMessage.message,
      from: this.fromNumber,
      to: smsMessage.to,
    };

    // Add delivery status callback for tracking
    if (process.env.NEXT_PUBLIC_APP_URL) {
      messageOptions.statusCallback = `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/status`;
      messageOptions.statusCallbackMethod = 'POST';
    }

    // Set message priority based on urgency
    if (smsMessage.urgency === 'urgent') {
      messageOptions.priority = 'high';
    }

    const result = await this.client.messages.create(messageOptions);

    return {
      success: true,
      messageId: result.sid,
      status: result.status,
      cost: parseFloat(result.price || '0.01'),
    };
  }

  /**
   * Batch send messages with concurrency control
   */
  async sendBatchSMS(
    messages: SMSMessage[],
    concurrency = 5
  ): Promise<{ results: SMSResult[]; summary: any }> {
    const results: SMSResult[] = [];
    const batches: SMSMessage[][] = [];

    // Split into batches
    for (let i = 0; i < messages.length; i += concurrency) {
      batches.push(messages.slice(i, i + concurrency));
    }

    let successCount = 0;
    let failureCount = 0;
    let totalCost = 0;

    // Process batches sequentially to respect rate limits
    for (const batch of batches) {
      const batchResults = await Promise.all(
        batch.map((message) => this.sendSMSWithRetry(message))
      );

      results.push(...batchResults);

      // Update counters
      batchResults.forEach((result) => {
        if (result.success) {
          successCount++;
          totalCost += result.cost || 0;
        } else {
          failureCount++;
        }
      });

      // Small delay between batches to respect rate limits
      if (batches.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return {
      results,
      summary: {
        total: messages.length,
        successful: successCount,
        failed: failureCount,
        totalCost,
        averageCost: totalCost / Math.max(successCount, 1),
      },
    };
  }

  /**
   * Handle delivery status webhooks from Twilio
   */
  handleDeliveryStatus(webhookData: any): void {
    const messageId = webhookData.MessageSid;
    const status = webhookData.MessageStatus;
    const errorCode = webhookData.ErrorCode;
    const errorMessage = webhookData.ErrorMessage;

    if (messageId) {
      this.trackDeliveryStatus(messageId, status, {
        errorCode,
        errorMessage,
        deliveredAt: status === 'delivered' ? new Date() : undefined,
      });
    }
  }

  /**
   * Rate limiting methods
   */
  private resetRateLimitsIfNeeded(): void {
    const now = Date.now();

    // Reset minute counter
    if (now - this.rateLimit.minuteStartTime >= 60000) {
      this.rateLimit.sentThisMinute = 0;
      this.rateLimit.minuteStartTime = now;
    }

    // Reset hour counter
    if (now - this.rateLimit.hourStartTime >= 3600000) {
      this.rateLimit.sentThisHour = 0;
      this.rateLimit.hourStartTime = now;
    }

    // Reset day counter
    if (now - this.rateLimit.dayStartTime >= 86400000) {
      this.rateLimit.sentThisDay = 0;
      this.rateLimit.dayStartTime = now;
      this.resetDailyCostMetrics();
    }

    // Update throttled status
    this.rateLimit.isThrottled =
      this.rateLimit.sentThisMinute >= this.LIMITS.PER_MINUTE ||
      this.rateLimit.sentThisHour >= this.LIMITS.PER_HOUR ||
      this.rateLimit.sentThisDay >= this.LIMITS.PER_DAY;
  }

  private incrementRateLimit(): void {
    this.resetRateLimitsIfNeeded();
    this.rateLimit.sentThisMinute++;
    this.rateLimit.sentThisHour++;
    this.rateLimit.sentThisDay++;
  }

  private isRateLimited(): boolean {
    this.resetRateLimitsIfNeeded();
    return this.rateLimit.isThrottled;
  }

  /**
   * Delivery tracking methods
   */
  private trackDeliveryStatus(
    messageId: string,
    status: string,
    additional?: Partial<DeliveryStatus>
  ): void {
    const existing = this.deliveryTracking.get(messageId) || {
      messageId,
      status: 'queued',
    };

    this.deliveryTracking.set(messageId, {
      ...existing,
      status: status as DeliveryStatus['status'],
      ...additional,
    });

    // Clean up old tracking data (keep last 1000 messages)
    if (this.deliveryTracking.size > 1000) {
      const entries = Array.from(this.deliveryTracking.entries());
      const toDelete = entries.slice(0, entries.length - 1000);
      toDelete.forEach(([messageId]) => {
        this.deliveryTracking.delete(messageId);
      });
    }
  }

  /**
   * Cost tracking methods
   */
  private updateCostMetrics(messageCost: number): void {
    this.costMetrics.totalMessagesSent++;
    this.costMetrics.totalCost += messageCost;
    this.costMetrics.costThisDay += messageCost;

    // Update monthly cost (simple approximation)
    const now = new Date();
    if (now.getMonth() !== this.costMetrics.lastReset.getMonth()) {
      this.costMetrics.costThisMonth = messageCost;
      this.costMetrics.lastReset = now;
    } else {
      this.costMetrics.costThisMonth += messageCost;
    }

    this.costMetrics.averageCostPerMessage =
      this.costMetrics.totalCost / this.costMetrics.totalMessagesSent;
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
      this.metrics.successfulMessages++;
      this.metrics.lastMessageTime = Date.now();
    } else {
      this.metrics.failedMessages++;
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
   * Utility methods
   */
  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/[-\s()]/g, ''));
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
      fromNumber: this.fromNumber
        ? `${this.fromNumber.substring(0, 6)}***`
        : null,
      metrics: this.metrics,
      rateLimitStatus: {
        ...this.rateLimit,
        limits: this.LIMITS,
        remainingThisMinute: Math.max(
          0,
          this.LIMITS.PER_MINUTE - this.rateLimit.sentThisMinute
        ),
        remainingThisHour: Math.max(
          0,
          this.LIMITS.PER_HOUR - this.rateLimit.sentThisHour
        ),
        remainingThisDay: Math.max(
          0,
          this.LIMITS.PER_DAY - this.rateLimit.sentThisDay
        ),
      },
      costMetrics: this.costMetrics,
      deliveryStats: {
        totalTracked: this.deliveryTracking.size,
        delivered: Array.from(this.deliveryTracking.values()).filter(
          (d) => d.status === 'delivered'
        ).length,
        failed: Array.from(this.deliveryTracking.values()).filter(
          (d) => d.status === 'failed'
        ).length,
      },
      // Enhanced messaging capabilities comparison
      enhancedFeatures: {
        supportsRichMedia: false, // Current Twilio SMS limitation
        supportsBlueBubble: false, // True iMessage blue bubbles require Apple integration
        supportsGroupChat: false,
        a2pRegistrationRequired: true,
        transparentPricing: false,
        // Clarification for user
        blueBubbleNote:
          'True blue bubbles only available via iMessage services like SendBlue',
        freeAlternatives: {
          appleMessages: 'Free but not programmatic - manual only',
          twilioFreeTier: 'Free tier available for testing',
          rcsFree:
            "RCS is free but limited iOS support - Google's rich messaging standard",
          openSource: 'Self-hosted options available but complex setup',
        },
        blueBubblePricing: {
          sendBlue: '$49-299/month (based on phone lines)',
          textMagic: '$25-200/month (based on volume)',
          ezTexting: '$29-500/month (based on features)',
          slickText: '$39-299/month (based on subscribers)',
          averageMonthly: '$50-300/month for small-medium business',
        },
      },
    };
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const status = this.getSystemStatus();

      // Test connection if configured
      let connectionTest = false;
      if (this.isConfigured) {
        try {
          // Simple API test - get account info
          await this.client.api.v2010.accounts(this.client.accountSid).fetch();
          connectionTest = true;
        } catch (error) {
          console.warn('⚠️ Twilio connection test failed:', error);
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
   * Get delivery status for a message
   */
  getDeliveryStatus(messageId: string): DeliveryStatus | null {
    return this.deliveryTracking.get(messageId) || null;
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

    if (this.costMetrics.averageCostPerMessage > 0.02) {
      recommendations.push(
        'Consider switching to a higher volume plan for better rates'
      );
    }

    if (this.rateLimit.sentThisDay > this.LIMITS.PER_DAY * 0.8) {
      recommendations.push(
        'Approaching daily rate limit - consider upgrading Twilio plan'
      );
    }

    if (this.metrics.failedMessages > this.metrics.successfulMessages * 0.1) {
      recommendations.push(
        'High failure rate - review phone number validation'
      );
    }

    return recommendations;
  }
}

// Export singleton instance
export const enhancedTwilioService = new EnhancedTwilioService();
