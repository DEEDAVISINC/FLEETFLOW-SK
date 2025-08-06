/**
 * Square Payment Processing Service
 * Handles Square API integration for payment processing in FleetFlow
 */

export interface SquarePaymentRequest {
  amount: number; // Amount in cents
  currency: string;
  sourceId: string; // Payment source (card nonce)
  customerId?: string;
  orderId?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface SquarePaymentResponse {
  success: boolean;
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  status?: string;
  receiptUrl?: string;
  error?: string;
  errorCode?: string;
}

export interface SquareCustomer {
  id?: string;
  givenName?: string;
  familyName?: string;
  companyName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  address?: {
    addressLine1?: string;
    addressLine2?: string;
    locality?: string;
    administrativeDistrictLevel1?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface SquareOrder {
  id?: string;
  locationId: string;
  lineItems: Array<{
    name: string;
    quantity: string;
    basePriceMoney: {
      amount: number;
      currency: string;
    };
    variationType?: string;
  }>;
  taxes?: Array<{
    name: string;
    percentage?: string;
    type: 'ADDITIVE' | 'INCLUSIVE';
  }>;
  discounts?: Array<{
    name: string;
    percentage?: string;
    amountMoney?: {
      amount: number;
      currency: string;
    };
  }>;
}

export class SquareService {
  private applicationId: string;
  private accessToken: string;
  private environment: 'sandbox' | 'production';
  private baseUrl: string;

  constructor() {
    this.applicationId =
      process.env.SQUARE_APPLICATION_ID ||
      'sandbox-sq0idb-MrMaJsNyJ4Z5jyKuGctrTw';
    this.accessToken =
      process.env.SQUARE_ACCESS_TOKEN ||
      'EAAAlyNjMofvOI8AK8Xk_OgtAe4cu8vN6T3GbIjPuE-7-hsKcu0xllKDMDwQ2eoA';
    this.environment =
      process.env.SQUARE_ENVIRONMENT === 'production'
        ? 'production'
        : 'sandbox';
    this.baseUrl =
      this.environment === 'production'
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Square-Version': '2023-10-18',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          `Square API Error: ${result.errors?.[0]?.detail || 'Unknown error'}`
        );
      }

      return result;
    } catch (error) {
      console.error('Square API request failed:', error);
      throw error;
    }
  }

  /**
   * Process a payment using Square
   */
  async processPayment(
    paymentRequest: SquarePaymentRequest
  ): Promise<SquarePaymentResponse> {
    try {
      const paymentData = {
        source_id: paymentRequest.sourceId,
        amount_money: {
          amount: paymentRequest.amount,
          currency: paymentRequest.currency || 'USD',
        },
        idempotency_key: `fleetflow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...(paymentRequest.customerId && {
          customer_id: paymentRequest.customerId,
        }),
        ...(paymentRequest.orderId && { order_id: paymentRequest.orderId }),
        ...(paymentRequest.description && { note: paymentRequest.description }),
        ...(paymentRequest.metadata && {
          app_fee_money: {
            amount: 0,
            currency: paymentRequest.currency || 'USD',
          },
        }),
      };

      const result = await this.makeRequest(
        '/v2/payments',
        'POST',
        paymentData
      );

      if (result.payment) {
        return {
          success: true,
          paymentId: result.payment.id,
          transactionId: result.payment.id,
          amount: result.payment.amount_money.amount,
          status: result.payment.status,
          receiptUrl: result.payment.receipt_url,
        };
      } else {
        return {
          success: false,
          error: 'Payment processing failed',
          errorCode: 'PAYMENT_FAILED',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        errorCode: 'API_ERROR',
      };
    }
  }

  /**
   * Create a customer in Square
   */
  async createCustomer(
    customer: SquareCustomer
  ): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      const customerData = {
        given_name: customer.givenName,
        family_name: customer.familyName,
        company_name: customer.companyName,
        email_address: customer.emailAddress,
        phone_number: customer.phoneNumber,
        address: customer.address,
      };

      const result = await this.makeRequest(
        '/v2/customers',
        'POST',
        customerData
      );

      if (result.customer) {
        return {
          success: true,
          customerId: result.customer.id,
        };
      } else {
        return {
          success: false,
          error: 'Failed to create customer',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create an order in Square
   */
  async createOrder(
    order: SquareOrder
  ): Promise<{ success: boolean; orderId?: string; error?: string }> {
    try {
      const orderData = {
        order: {
          location_id: order.locationId,
          line_items: order.lineItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            base_price_money: item.basePriceMoney,
          })),
          taxes: order.taxes?.map((tax) => ({
            name: tax.name,
            percentage: tax.percentage,
            type: tax.type,
          })),
          discounts: order.discounts?.map((discount) => ({
            name: discount.name,
            percentage: discount.percentage,
            amount_money: discount.amountMoney,
          })),
        },
      };

      const result = await this.makeRequest('/v2/orders', 'POST', orderData);

      if (result.order) {
        return {
          success: true,
          orderId: result.order.id,
        };
      } else {
        return {
          success: false,
          error: 'Failed to create order',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get payment details
   */
  async getPayment(
    paymentId: string
  ): Promise<{ success: boolean; payment?: any; error?: string }> {
    try {
      const result = await this.makeRequest(`/v2/payments/${paymentId}`, 'GET');

      if (result.payment) {
        return {
          success: true,
          payment: result.payment,
        };
      } else {
        return {
          success: false,
          error: 'Payment not found',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string,
    amount?: number,
    reason?: string
  ): Promise<SquarePaymentResponse> {
    try {
      const refundData = {
        idempotency_key: `refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        payment_id: paymentId,
        ...(amount && {
          amount_money: {
            amount: amount,
            currency: 'USD',
          },
        }),
        ...(reason && { reason }),
      };

      const result = await this.makeRequest('/v2/refunds', 'POST', refundData);

      if (result.refund) {
        return {
          success: true,
          paymentId: result.refund.id,
          amount: result.refund.amount_money.amount,
          status: result.refund.status,
        };
      } else {
        return {
          success: false,
          error: 'Refund processing failed',
          errorCode: 'REFUND_FAILED',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        errorCode: 'API_ERROR',
      };
    }
  }

  /**
   * Get locations (required for orders)
   */
  async getLocations(): Promise<{
    success: boolean;
    locations?: any[];
    error?: string;
  }> {
    try {
      const result = await this.makeRequest('/v2/locations', 'GET');

      if (result.locations) {
        return {
          success: true,
          locations: result.locations,
        };
      } else {
        return {
          success: false,
          error: 'No locations found',
        };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Generate payment form configuration for frontend
   */
  getPaymentFormConfig() {
    return {
      applicationId: this.applicationId,
      environment: this.environment,
      locationId: process.env.SQUARE_LOCATION_ID || 'MAIN_LOCATION',
    };
  }

  /**
   * Validate webhook signature
   */
  validateWebhookSignature(
    signature: string,
    body: string,
    webhookSignatureKey: string
  ): boolean {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', webhookSignatureKey);
    hmac.update(body);
    const expectedSignature = hmac.digest('base64');

    return signature === expectedSignature;
  }
}

export default SquareService;
