/**
 * Multi-Tenant Square Payment Processing Service
 * Handles tenant-isolated Square API integration for FleetFlow
 */

export interface TenantSquareConfig {
  tenantId: string;
  applicationId: string;
  accessToken: string;
  locationId: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
  connected: boolean;
  lastSync?: string;
}

export interface SquarePaymentRequest {
  tenantId: string; // Required for tenant isolation
  amount: number;
  currency: string;
  sourceId: string;
  customerId?: string;
  orderId?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface SquareInvoiceRequest {
  tenantId: string; // Required for tenant isolation
  customerId: string;
  invoiceTitle: string;
  description: string;
  lineItems: Array<{
    name: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  dueDate?: string;
  customFields?: Array<{
    label: string;
    value: string;
  }>;
}

export interface SquarePaymentResponse {
  success: boolean;
  tenantId: string;
  paymentId?: string;
  transactionId?: string;
  amount?: number;
  status?: string;
  receiptUrl?: string;
  error?: string;
  errorCode?: string;
}

export interface SquareInvoiceResponse {
  success: boolean;
  tenantId: string;
  invoice?: any;
  invoiceId?: string;
  invoiceNumber?: string;
  publicUrl?: string;
  status?:
    | 'DRAFT'
    | 'UNPAID'
    | 'SCHEDULED'
    | 'PARTIALLY_PAID'
    | 'PAID'
    | 'PARTIALLY_REFUNDED'
    | 'REFUNDED'
    | 'CANCELED'
    | 'FAILED'
    | 'PAYMENT_PENDING';
  error?: string;
  errorCode?: string;
}

export class MultiTenantSquareService {
  private tenantConfigs: Map<string, TenantSquareConfig> = new Map();

  constructor() {
    // Initialize with default configurations if available
    this.loadTenantConfigurations();
  }

  /**
   * Load tenant configurations from database or configuration store
   */
  private async loadTenantConfigurations(): Promise<void> {
    try {
      // In production, this would load from database
      // For now, we'll use a mock implementation
      const tenantConfigs = await this.getTenantConfigsFromDatabase();

      tenantConfigs.forEach((config) => {
        this.tenantConfigs.set(config.tenantId, config);
      });
    } catch (error) {
      console.error('Error loading tenant Square configurations:', error);
    }
  }

  /**
   * Mock method to get tenant configs from database
   * In production, replace with actual database query
   */
  private async getTenantConfigsFromDatabase(): Promise<TenantSquareConfig[]> {
    // Mock tenant configurations - replace with actual database query
    return [
      {
        tenantId: 'tenant-1',
        applicationId:
          process.env.SQUARE_APPLICATION_ID_TENANT_1 ||
          'sandbox-sq0idb-example1',
        accessToken:
          process.env.SQUARE_ACCESS_TOKEN_TENANT_1 || 'sandbox-token-1',
        locationId: process.env.SQUARE_LOCATION_ID_TENANT_1 || 'location-1',
        environment: 'sandbox',
        enabled: true,
        connected: true,
      },
      {
        tenantId: 'tenant-2',
        applicationId:
          process.env.SQUARE_APPLICATION_ID_TENANT_2 ||
          'sandbox-sq0idb-example2',
        accessToken:
          process.env.SQUARE_ACCESS_TOKEN_TENANT_2 || 'sandbox-token-2',
        locationId: process.env.SQUARE_LOCATION_ID_TENANT_2 || 'location-2',
        environment: 'sandbox',
        enabled: true,
        connected: true,
      },
    ];
  }

  /**
   * Get tenant-specific Square configuration
   */
  private getTenantConfig(tenantId: string): TenantSquareConfig | null {
    const config = this.tenantConfigs.get(tenantId);
    if (!config) {
      console.error(`Square configuration not found for tenant: ${tenantId}`);
      return null;
    }
    if (!config.enabled || !config.connected) {
      console.error(`Square not enabled or connected for tenant: ${tenantId}`);
      return null;
    }
    return config;
  }

  /**
   * Make tenant-isolated Square API request
   */
  private async makeTenantRequest(
    tenantId: string,
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<any> {
    const config = this.getTenantConfig(tenantId);
    if (!config) {
      throw new Error(`Square not configured for tenant: ${tenantId}`);
    }

    const baseUrl =
      config.environment === 'production'
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method,
        headers: {
          'Square-Version': '2023-10-18',
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Square API Error (${response.status}): ${JSON.stringify(errorData)}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`Square API request failed for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Process tenant-isolated payment
   */
  async processPayment(
    request: SquarePaymentRequest
  ): Promise<SquarePaymentResponse> {
    try {
      const result = await this.makeTenantRequest(
        request.tenantId,
        '/v2/payments',
        'POST',
        {
          source_id: request.sourceId,
          amount_money: {
            amount: Math.round(request.amount * 100),
            currency: request.currency || 'USD',
          },
          idempotency_key: `${request.tenantId}-${Date.now()}-${Math.random()}`,
          note: request.description || 'FleetFlow Payment',
          buyer_email_address: request.metadata?.email,
        }
      );

      return {
        success: true,
        tenantId: request.tenantId,
        paymentId: result.payment?.id,
        transactionId: result.payment?.id,
        amount: result.payment?.amount_money?.amount / 100,
        status: result.payment?.status,
        receiptUrl: result.payment?.receipt_url,
      };
    } catch (error) {
      return {
        success: false,
        tenantId: request.tenantId,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create tenant-isolated Square customer
   */
  async createCustomer(
    tenantId: string,
    customerData: {
      givenName?: string;
      familyName?: string;
      companyName?: string;
      emailAddress?: string;
      phoneNumber?: string;
      address?: any;
    }
  ): Promise<{ success: boolean; customerId?: string; error?: string }> {
    try {
      const result = await this.makeTenantRequest(
        tenantId,
        '/v2/customers',
        'POST',
        customerData
      );

      return {
        success: true,
        customerId: result.customer?.id,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create tenant-isolated Square invoice
   */
  async createInvoice(
    request: SquareInvoiceRequest
  ): Promise<SquareInvoiceResponse> {
    try {
      const config = this.getTenantConfig(request.tenantId);
      if (!config) {
        return {
          success: false,
          tenantId: request.tenantId,
          error: 'Square not configured for tenant',
        };
      }

      // Create invoice data structure
      const invoiceData = {
        location_id: config.locationId,
        title: request.invoiceTitle,
        description: request.description,
        primary_recipient: {
          customer_id: request.customerId,
        },
        invoice_request_method: 'EMAIL',
        delivery_method: 'EMAIL',
        payment_requests: [
          {
            request_method: 'EMAIL',
            request_type: 'BALANCE',
            due_date:
              request.dueDate ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
            automatic_payment_source: 'NONE',
          },
        ],
        order_request: {
          order: {
            location_id: config.locationId,
            line_items: request.lineItems.map((item) => ({
              name: item.name,
              quantity: item.quantity.toString(),
              base_price_money: {
                amount: Math.round(item.rate * 100),
                currency: 'USD',
              },
            })),
          },
        },
        accepted_payment_methods: {
          card: true,
          square_gift_card: false,
          bank_account: true,
          buy_now_pay_later: false,
          cash_app_pay: true,
        },
        custom_fields: [
          { label: 'Tenant ID', value: request.tenantId },
          ...(request.customFields || []),
        ],
        store_payment_method_enabled: true,
      };

      // Create the invoice
      const createResult = await this.makeTenantRequest(
        request.tenantId,
        '/v2/invoices',
        'POST',
        { invoice_request: invoiceData }
      );

      if (!createResult.invoice) {
        return {
          success: false,
          tenantId: request.tenantId,
          error: 'Failed to create invoice',
        };
      }

      // Publish the invoice (send it)
      const publishResult = await this.makeTenantRequest(
        request.tenantId,
        `/v2/invoices/${createResult.invoice.id}/publish`,
        'POST',
        {
          request_method: 'EMAIL',
          invoice_version: createResult.invoice.version,
        }
      );

      return {
        success: true,
        tenantId: request.tenantId,
        invoice: publishResult.invoice,
        invoiceId: publishResult.invoice?.id,
        invoiceNumber: publishResult.invoice?.invoice_number,
        status: publishResult.invoice?.status,
        publicUrl: publishResult.invoice?.public_url,
      };
    } catch (error) {
      return {
        success: false,
        tenantId: request.tenantId,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get tenant-specific invoice
   */
  async getInvoice(
    tenantId: string,
    invoiceId: string
  ): Promise<SquareInvoiceResponse> {
    try {
      const result = await this.makeTenantRequest(
        tenantId,
        `/v2/invoices/${invoiceId}`,
        'GET'
      );

      return {
        success: true,
        tenantId,
        invoice: result.invoice,
        invoiceId: result.invoice?.id,
        invoiceNumber: result.invoice?.invoice_number,
        status: result.invoice?.status,
        publicUrl: result.invoice?.public_url,
      };
    } catch (error) {
      return {
        success: false,
        tenantId,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * List tenant-specific invoices
   */
  async listInvoices(
    tenantId: string,
    filters?: {
      status?: string;
      limit?: number;
      cursor?: string;
    }
  ): Promise<{
    success: boolean;
    tenantId: string;
    invoices?: any[];
    cursor?: string;
    error?: string;
  }> {
    try {
      const config = this.getTenantConfig(tenantId);
      if (!config) {
        return {
          success: false,
          tenantId,
          error: 'Square not configured for tenant',
        };
      }

      const query = new URLSearchParams();
      query.append('location_id', config.locationId);
      if (filters?.status) query.append('status', filters.status);
      if (filters?.limit) query.append('limit', filters.limit.toString());
      if (filters?.cursor) query.append('cursor', filters.cursor);

      const result = await this.makeTenantRequest(
        tenantId,
        `/v2/invoices/search?${query.toString()}`,
        'GET'
      );

      return {
        success: true,
        tenantId,
        invoices: result.invoices || [],
        cursor: result.cursor,
      };
    } catch (error) {
      return {
        success: false,
        tenantId,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Set or update tenant Square configuration
   */
  async setTenantConfig(config: TenantSquareConfig): Promise<void> {
    this.tenantConfigs.set(config.tenantId, config);

    // In production, save to database
    await this.saveTenantConfigToDatabase(config);
  }

  /**
   * Mock method to save tenant config to database
   * In production, replace with actual database save
   */
  private async saveTenantConfigToDatabase(
    config: TenantSquareConfig
  ): Promise<void> {
    // Mock implementation - replace with actual database save
    console.log(
      `Saving Square config for tenant ${config.tenantId} to database`
    );
  }

  /**
   * Get tenant Square configuration status
   */
  getTenantStatus(tenantId: string): {
    configured: boolean;
    enabled: boolean;
    connected: boolean;
    environment?: string;
  } {
    const config = this.tenantConfigs.get(tenantId);
    return {
      configured: !!config,
      enabled: config?.enabled || false,
      connected: config?.connected || false,
      environment: config?.environment,
    };
  }

  /**
   * Enable Square for tenant
   */
  async enableSquareForTenant(
    tenantId: string,
    credentials: {
      applicationId: string;
      accessToken: string;
      locationId: string;
      environment: 'sandbox' | 'production';
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Test the credentials by making a test API call
      const testConfig: TenantSquareConfig = {
        tenantId,
        ...credentials,
        enabled: true,
        connected: false, // Will be set to true if test passes
      };

      // Temporarily set config for testing
      this.tenantConfigs.set(tenantId, testConfig);

      // Test the connection
      await this.makeTenantRequest(tenantId, '/v2/locations', 'GET');

      // If successful, mark as connected and save
      testConfig.connected = true;
      testConfig.lastSync = new Date().toISOString();
      await this.setTenantConfig(testConfig);

      return { success: true };
    } catch (error) {
      // Remove failed config
      this.tenantConfigs.delete(tenantId);

      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to connect to Square',
      };
    }
  }

  /**
   * Disable Square for tenant
   */
  async disableSquareForTenant(tenantId: string): Promise<void> {
    const config = this.tenantConfigs.get(tenantId);
    if (config) {
      config.enabled = false;
      config.connected = false;
      await this.setTenantConfig(config);
    }
  }
}

export default MultiTenantSquareService;





































