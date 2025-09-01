// Enhanced Bill.com Integration Service - Production Grade
// Includes rate limiting, circuit breaker, comprehensive error handling

import { isBillcomEnabled } from '../../utils/environmentValidator';
import { BillComCustomer, Invoice } from './BillComService';

interface BillComResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  response_status: number;
  response_data?: any;
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

export class EnhancedBillComService {
  private readonly baseUrl: string;
  private apiKey: string;
  private username: string;
  private password: string;
  private orgId: string;
  private environment: 'sandbox' | 'production';
  private sessionId?: string;
  private sessionExpiry?: Date;

  // Rate limiting (Bill.com allows ~1000 requests/hour)
  private rateLimit: RateLimitInfo = {
    requestsThisHour: 0,
    hourStartTime: Date.now(),
    maxRequestsPerHour: 900, // 90% of limit for safety
    isThrottled: false,
  };

  // Circuit breaker
  private circuitBreaker: CircuitBreakerState = {
    isOpen: false,
    consecutiveFailures: 0,
    lastFailureTime: 0,
    maxFailures: 5,
    resetTimeoutMs: 300000, // 5 minutes
  };

  // Metrics tracking
  private metrics: APIMetrics = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    lastSuccessTime: 0,
    lastErrorTime: 0,
  };

  constructor() {
    this.environment =
      (process.env.BILLCOM_ENVIRONMENT as 'sandbox' | 'production') ||
      'sandbox';
    this.baseUrl =
      this.environment === 'production'
        ? 'https://api.bill.com/api/v2'
        : 'https://api-stage.bill.com/api/v2';

    this.apiKey = process.env.BILLCOM_API_KEY || '';
    this.username = process.env.BILLCOM_USERNAME || '';
    this.password = process.env.BILLCOM_PASSWORD || '';
    this.orgId = process.env.BILLCOM_ORG_ID || '';

    if (!isBillcomEnabled()) {
      console.warn(
        '⚠️ Bill.com service created but not enabled - check environment configuration'
      );
    }

    this.resetRateLimitIfNeeded();
  }

  /**
   * Enhanced authentication with session management
   */
  async authenticateWithRetry(
    maxRetries = 3
  ): Promise<{ success: boolean; sessionId?: string; error?: string }> {
    // Check if current session is still valid
    if (
      this.sessionId &&
      this.sessionExpiry &&
      this.sessionExpiry > new Date()
    ) {
      return { success: true, sessionId: this.sessionId };
    }

    // Check circuit breaker
    if (this.isCircuitBreakerOpen()) {
      return {
        success: false,
        error: 'Service temporarily unavailable (circuit breaker open)',
      };
    }

    // Check rate limit
    if (this.isRateLimited()) {
      return {
        success: false,
        error: 'Rate limit exceeded - request throttled',
      };
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const startTime = Date.now();

        // Increment rate limit counter
        this.incrementRateLimit();

        const response = await fetch(`${this.baseUrl}/Login.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams({
            userName: this.username,
            password: this.password,
            devKey: this.apiKey,
            orgId: this.orgId,
          }),
          timeout: 30000,
        });

        // Update metrics
        this.updateMetrics(response.ok, Date.now() - startTime);

        if (!response.ok) {
          if (response.status === 429) {
            this.handleRateLimitResponse(response);
            throw new Error('Rate limit exceeded');
          }
          throw new Error(
            `Authentication failed: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.response_status === 0) {
          // Success
          this.sessionId = data.response_data.sessionId;
          this.sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
          this.resetCircuitBreaker();

          return { success: true, sessionId: this.sessionId };
        } else {
          throw new Error(
            `Bill.com API error: ${data.response_data.error_message || 'Authentication failed'}`
          );
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        this.updateMetrics(false, 0, lastError);

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000); // Exponential backoff
          console.info(
            `⚠️ Bill.com auth attempt ${attempt} failed, retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.incrementCircuitBreakerFailures();
    return {
      success: false,
      error: lastError?.message || 'Authentication failed after retries',
    };
  }

  /**
   * Enhanced customer creation with validation
   */
  async createCustomerWithRetry(
    customer: BillComCustomer
  ): Promise<BillComResponse<{ customerId: string }>> {
    try {
      // Ensure authenticated
      const authResult = await this.authenticateWithRetry();
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error,
          response_status: 401,
        };
      }

      const customerData = {
        sessionId: this.sessionId,
        devKey: this.apiKey,
        data: JSON.stringify({
          name: customer.name,
          email: customer.email,
          companyName: customer.companyName,
          paymentTerms: customer.paymentTerms,
          isActive: true,
          address: [
            {
              addressLine1: customer.address.street,
              city: customer.address.city,
              state: customer.address.state,
              zip: customer.address.zip,
              country: customer.address.country,
            },
          ],
        }),
      };

      const response = await this.makeAPIRequest(
        '/Crud/Create/Customer.json',
        customerData
      );

      if (response.success && response.data?.response_status === 0) {
        return {
          success: true,
          data: { customerId: response.data.response_data.id },
          response_status: 200,
        };
      } else {
        return {
          success: false,
          error:
            response.data?.response_data?.error_message ||
            'Customer creation failed',
          response_status: response.data?.response_status || 500,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_status: 500,
      };
    }
  }

  /**
   * Enhanced invoice creation with comprehensive validation
   */
  async createInvoiceWithRetry(
    invoice: Partial<Invoice>
  ): Promise<BillComResponse<{ invoiceId: string; invoiceNumber: string }>> {
    try {
      // Ensure authenticated
      const authResult = await this.authenticateWithRetry();
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error,
          response_status: 401,
        };
      }

      // Validate invoice data
      if (!invoice.customerId) {
        return {
          success: false,
          error: 'Customer ID is required',
          response_status: 400,
        };
      }

      if (!invoice.lineItems || invoice.lineItems.length === 0) {
        return {
          success: false,
          error: 'Invoice must have at least one line item',
          response_status: 400,
        };
      }

      const invoiceData = {
        sessionId: this.sessionId,
        devKey: this.apiKey,
        data: JSON.stringify({
          customerId: invoice.customerId,
          invoiceDate: invoice.date || new Date().toISOString().split('T')[0],
          dueDate:
            invoice.dueDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
          invoiceLineItems: invoice.lineItems?.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            price: item.rate,
            serviceDate: invoice.date || new Date().toISOString().split('T')[0],
          })),
        }),
      };

      const response = await this.makeAPIRequest(
        '/Crud/Create/Invoice.json',
        invoiceData
      );

      if (response.success && response.data?.response_status === 0) {
        return {
          success: true,
          data: {
            invoiceId: response.data.response_data.id,
            invoiceNumber:
              response.data.response_data.invoiceNumber || `INV-${Date.now()}`,
          },
          response_status: 200,
        };
      } else {
        return {
          success: false,
          error:
            response.data?.response_data?.error_message ||
            'Invoice creation failed',
          response_status: response.data?.response_status || 500,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_status: 500,
      };
    }
  }

  /**
   * Enhanced payment processing with status tracking
   */
  async processPayment(
    invoiceId: string,
    paymentData: any
  ): Promise<BillComResponse<{ paymentId: string; status: string }>> {
    try {
      const authResult = await this.authenticateWithRetry();
      if (!authResult.success) {
        return {
          success: false,
          error: authResult.error,
          response_status: 401,
        };
      }

      const paymentRequest = {
        sessionId: this.sessionId,
        devKey: this.apiKey,
        data: JSON.stringify({
          invoiceId,
          ...paymentData,
        }),
      };

      const response = await this.makeAPIRequest(
        '/Crud/Create/ReceivedPay.json',
        paymentRequest
      );

      if (response.success && response.data?.response_status === 0) {
        return {
          success: true,
          data: {
            paymentId: response.data.response_data.id,
            status: 'PROCESSED',
          },
          response_status: 200,
        };
      } else {
        return {
          success: false,
          error:
            response.data?.response_data?.error_message ||
            'Payment processing failed',
          response_status: response.data?.response_status || 500,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        response_status: 500,
      };
    }
  }

  /**
   * Generic API request method with retry logic
   */
  private async makeAPIRequest(
    endpoint: string,
    data: any,
    maxRetries = 3
  ): Promise<{ success: boolean; data?: any }> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Check circuit breaker
        if (this.isCircuitBreakerOpen()) {
          throw new Error('Service temporarily unavailable');
        }

        // Check rate limit
        if (this.isRateLimited()) {
          throw new Error('Rate limit exceeded');
        }

        this.incrementRateLimit();

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          body: new URLSearchParams(data),
          timeout: 30000,
        });

        if (response.status === 429) {
          this.handleRateLimitResponse(response);
          throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
          throw new Error(
            `API request failed: ${response.status} ${response.statusText}`
          );
        }

        const result = await response.json();
        return { success: true, data: result };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Rate limiting methods
   */
  private resetRateLimitIfNeeded(): void {
    const currentTime = Date.now();
    const hoursSinceReset =
      (currentTime - this.rateLimit.hourStartTime) / (1000 * 60 * 60);

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

    const timeSinceLastFailure =
      Date.now() - this.circuitBreaker.lastFailureTime;
    if (timeSinceLastFailure > this.circuitBreaker.resetTimeoutMs) {
      console.info('🔄 Bill.com circuit breaker reset timeout reached');
      return false;
    }

    return true;
  }

  private incrementCircuitBreakerFailures(): void {
    this.circuitBreaker.consecutiveFailures++;
    this.circuitBreaker.lastFailureTime = Date.now();

    if (
      this.circuitBreaker.consecutiveFailures >= this.circuitBreaker.maxFailures
    ) {
      this.circuitBreaker.isOpen = true;
      console.error(
        '🚨 Bill.com circuit breaker OPENED due to consecutive failures'
      );
    }
  }

  private resetCircuitBreaker(): void {
    if (this.circuitBreaker.consecutiveFailures > 0) {
      console.info('✅ Bill.com circuit breaker reset - service healthy');
    }
    this.circuitBreaker.consecutiveFailures = 0;
    this.circuitBreaker.isOpen = false;
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
      this.metrics.lastSuccessTime = Date.now();
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
   * Helper methods
   */
  private handleRateLimitResponse(response: Response): void {
    const retryAfter = response.headers.get('Retry-After');
    if (retryAfter) {
      const retryAfterMs = parseInt(retryAfter) * 1000;
      console.warn(
        `⚠️ Bill.com rate limited, retry after ${retryAfter} seconds`
      );

      setTimeout(() => {
        this.rateLimit.isThrottled = false;
      }, retryAfterMs);
    }
  }

  /**
   * Get comprehensive system status
   */
  getSystemStatus() {
    return {
      status: this.circuitBreaker.isOpen
        ? 'CIRCUIT_OPEN'
        : this.rateLimit.isThrottled
          ? 'RATE_LIMITED'
          : 'HEALTHY',
      environment: this.environment,
      authenticated:
        !!this.sessionId &&
        (!this.sessionExpiry || this.sessionExpiry > new Date()),
      sessionExpiry: this.sessionExpiry?.toISOString(),
      metrics: this.metrics,
      rateLimitStatus: {
        ...this.rateLimit,
        remainingRequests:
          this.rateLimit.maxRequestsPerHour - this.rateLimit.requestsThisHour,
        resetTime: new Date(
          this.rateLimit.hourStartTime + 60 * 60 * 1000
        ).toISOString(),
      },
      circuitBreakerStatus: {
        ...this.circuitBreaker,
        willResetAt: this.circuitBreaker.isOpen
          ? new Date(
              this.circuitBreaker.lastFailureTime +
                this.circuitBreaker.resetTimeoutMs
            ).toISOString()
          : null,
      },
    };
  }

  /**
   * Health check method
   */
  async healthCheck(): Promise<{ healthy: boolean; details: any }> {
    try {
      const status = this.getSystemStatus();
      const authResult = await this.authenticateWithRetry();

      return {
        healthy: authResult.success && status.status === 'HEALTHY',
        details: {
          ...status,
          authenticationWorking: authResult.success,
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
}

// Export singleton instance
export const enhancedBillComService = new EnhancedBillComService();
