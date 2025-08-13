/**
 * Multi-Tenant Payment Provider Service for FleetFlow
 * Supports Square, Bill.com, QuickBooks, and Stripe
 * Each tenant can choose their preferred payment provider(s)
 */

// Unified payment interfaces
export interface PaymentProvider {
  name: 'square' | 'billcom' | 'quickbooks' | 'stripe';
  displayName: string;
  supportedFeatures: PaymentFeature[];
}

export interface PaymentFeature {
  type: 'invoicing' | 'payments' | 'subscriptions' | 'customers' | 'reporting';
  available: boolean;
}

export interface UnifiedInvoiceRequest {
  tenantId: string;
  provider: 'square' | 'billcom' | 'quickbooks' | 'stripe';
  customerName: string;
  companyName?: string;
  email: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  title: string;
  description?: string;
  lineItems: {
    name: string;
    description?: string;
    quantity: number;
    rate: number;
    amount: number;
    taxable?: boolean;
  }[];
  taxRate?: number;
  dueDate?: string;
  customFields?: { label: string; value: string }[];
  metadata?: Record<string, any>;
}

export interface UnifiedInvoiceResponse {
  success: boolean;
  provider: string;
  tenantId: string;
  invoiceId?: string;
  invoiceNumber?: string;
  publicUrl?: string;
  status?: string;
  amount?: number;
  currency?: string;
  error?: string;
  errorCode?: string;
  providerSpecificData?: any;
}

export interface TenantPaymentConfig {
  tenantId: string;
  primaryProvider: 'square' | 'billcom' | 'quickbooks' | 'stripe';
  providers: {
    square?: SquareConfig;
    billcom?: BillcomConfig;
    quickbooks?: QuickBooksConfig;
    stripe?: StripeConfig;
  };
  preferences: {
    defaultProvider: 'square' | 'billcom' | 'quickbooks' | 'stripe';
    fallbackProvider?: 'square' | 'billcom' | 'quickbooks' | 'stripe';
    autoSwitchOnFailure: boolean;
  };
}

interface SquareConfig {
  applicationId: string;
  accessToken: string;
  locationId: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
  connected: boolean;
}

interface BillcomConfig {
  apiKey: string;
  username: string;
  password: string;
  orgId: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
  connected: boolean;
}

interface QuickBooksConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  refreshToken: string;
  companyId: string;
  environment: 'sandbox' | 'production';
  enabled: boolean;
  connected: boolean;
}

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  environment: 'test' | 'live';
  enabled: boolean;
  connected: boolean;
}

export class MultiTenantPaymentService {
  private tenantConfigs: Map<string, TenantPaymentConfig> = new Map();

  constructor() {
    this.initializeConfigurations();
  }

  /**
   * Initialize tenant configurations from database/environment
   */
  private async initializeConfigurations(): Promise<void> {
    // In production, load from database
    const tenantConfigs = await this.getTenantConfigsFromDatabase();

    tenantConfigs.forEach((config) => {
      this.tenantConfigs.set(config.tenantId, config);
    });
  }

  /**
   * Mock database configurations - replace with actual database calls
   */
  private async getTenantConfigsFromDatabase(): Promise<TenantPaymentConfig[]> {
    return [
      {
        tenantId: 'acme-logistics',
        primaryProvider: 'square',
        providers: {
          square: {
            applicationId:
              process.env.SQUARE_APPLICATION_ID_ACME || 'sq0idb-acme123',
            accessToken:
              process.env.SQUARE_ACCESS_TOKEN_ACME || 'sandbox-token-acme',
            locationId: process.env.SQUARE_LOCATION_ID_ACME || 'location-acme',
            environment: 'sandbox',
            enabled: true,
            connected: true,
          },
          billcom: {
            apiKey: process.env.BILLCOM_API_KEY_ACME || '01ICBWLWIERUAFTN2157',
            username: process.env.BILLCOM_USERNAME_ACME || 'acme@example.com',
            password: process.env.BILLCOM_PASSWORD_ACME || 'password123',
            orgId: process.env.BILLCOM_ORG_ID_ACME || '0297208089826008',
            environment: 'sandbox',
            enabled: true,
            connected: false,
          },
        },
        preferences: {
          defaultProvider: 'square',
          fallbackProvider: 'billcom',
          autoSwitchOnFailure: false,
        },
      },
      {
        tenantId: 'beta-transport',
        primaryProvider: 'quickbooks',
        providers: {
          quickbooks: {
            clientId: process.env.QB_CLIENT_ID_BETA || 'qb_client_beta',
            clientSecret: process.env.QB_CLIENT_SECRET_BETA || 'qb_secret_beta',
            accessToken: process.env.QB_ACCESS_TOKEN_BETA || 'qb_access_beta',
            refreshToken:
              process.env.QB_REFRESH_TOKEN_BETA || 'qb_refresh_beta',
            companyId: process.env.QB_COMPANY_ID_BETA || 'qb_company_beta',
            environment: 'sandbox',
            enabled: true,
            connected: true,
          },
          stripe: {
            publishableKey:
              process.env.STRIPE_PUBLISHABLE_KEY_BETA || 'pk_test_beta',
            secretKey: process.env.STRIPE_SECRET_KEY_BETA || 'sk_test_beta',
            webhookSecret:
              process.env.STRIPE_WEBHOOK_SECRET_BETA || 'whsec_beta',
            environment: 'test',
            enabled: true,
            connected: true,
          },
        },
        preferences: {
          defaultProvider: 'quickbooks',
          fallbackProvider: 'stripe',
          autoSwitchOnFailure: true,
        },
      },
      {
        tenantId: 'gamma-freight',
        primaryProvider: 'stripe',
        providers: {
          stripe: {
            publishableKey:
              process.env.STRIPE_PUBLISHABLE_KEY_GAMMA || 'pk_test_gamma',
            secretKey: process.env.STRIPE_SECRET_KEY_GAMMA || 'sk_test_gamma',
            webhookSecret:
              process.env.STRIPE_WEBHOOK_SECRET_GAMMA || 'whsec_gamma',
            environment: 'test',
            enabled: true,
            connected: true,
          },
        },
        preferences: {
          defaultProvider: 'stripe',
          autoSwitchOnFailure: false,
        },
      },
    ];
  }

  /**
   * Get available payment providers
   */
  getAvailableProviders(): PaymentProvider[] {
    return [
      {
        name: 'square',
        displayName: 'Square',
        supportedFeatures: [
          { type: 'invoicing', available: true },
          { type: 'payments', available: true },
          { type: 'customers', available: true },
          { type: 'reporting', available: true },
          { type: 'subscriptions', available: false },
        ],
      },
      {
        name: 'billcom',
        displayName: 'Bill.com',
        supportedFeatures: [
          { type: 'invoicing', available: true },
          { type: 'payments', available: true },
          { type: 'customers', available: true },
          { type: 'reporting', available: true },
          { type: 'subscriptions', available: false },
        ],
      },
      {
        name: 'quickbooks',
        displayName: 'QuickBooks',
        supportedFeatures: [
          { type: 'invoicing', available: true },
          { type: 'payments', available: true },
          { type: 'customers', available: true },
          { type: 'reporting', available: true },
          { type: 'subscriptions', available: false },
        ],
      },
      {
        name: 'stripe',
        displayName: 'Stripe',
        supportedFeatures: [
          { type: 'invoicing', available: true },
          { type: 'payments', available: true },
          { type: 'customers', available: true },
          { type: 'reporting', available: true },
          { type: 'subscriptions', available: true },
        ],
      },
    ];
  }

  /**
   * Get tenant configuration
   */
  getTenantConfig(tenantId: string): TenantPaymentConfig | null {
    return this.tenantConfigs.get(tenantId) || null;
  }

  /**
   * Get tenant's active providers
   */
  getTenantActiveProviders(tenantId: string): string[] {
    const config = this.getTenantConfig(tenantId);
    if (!config) return [];

    return Object.entries(config.providers)
      .filter(
        ([_, providerConfig]) =>
          providerConfig?.enabled && providerConfig?.connected
      )
      .map(([providerName]) => providerName);
  }

  /**
   * Create unified invoice across different providers
   */
  async createInvoice(
    request: UnifiedInvoiceRequest
  ): Promise<UnifiedInvoiceResponse> {
    const config = this.getTenantConfig(request.tenantId);
    if (!config) {
      return {
        success: false,
        provider: request.provider,
        tenantId: request.tenantId,
        error: 'Tenant configuration not found',
      };
    }

    // Use specified provider or default
    const provider = request.provider || config.preferences.defaultProvider;

    try {
      switch (provider) {
        case 'square':
          return await this.createSquareInvoice(
            request,
            config.providers.square!
          );
        case 'billcom':
          return await this.createBillcomInvoice(
            request,
            config.providers.billcom!
          );
        case 'quickbooks':
          return await this.createQuickBooksInvoice(
            request,
            config.providers.quickbooks!
          );
        case 'stripe':
          return await this.createStripeInvoice(
            request,
            config.providers.stripe!
          );
        default:
          throw new Error(`Unsupported payment provider: ${provider}`);
      }
    } catch (error) {
      // Try fallback provider if enabled
      if (
        config.preferences.autoSwitchOnFailure &&
        config.preferences.fallbackProvider
      ) {
        console.warn(
          `Primary provider ${provider} failed, trying fallback ${config.preferences.fallbackProvider}`
        );

        const fallbackRequest = {
          ...request,
          provider: config.preferences.fallbackProvider,
        };
        return await this.createInvoice(fallbackRequest);
      }

      return {
        success: false,
        provider,
        tenantId: request.tenantId,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Create Square invoice
   */
  private async createSquareInvoice(
    request: UnifiedInvoiceRequest,
    config: SquareConfig
  ): Promise<UnifiedInvoiceResponse> {
    const baseUrl =
      config.environment === 'production'
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    const invoiceData = {
      invoice_request: {
        request_method: 'EMAIL',
        request_type: 'BALANCE',
        due_date:
          request.dueDate ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
      },
      primary_recipient: {
        given_name: request.customerName.split(' ')[0] || 'Customer',
        family_name: request.customerName.split(' ').slice(1).join(' ') || '',
        organization_name: request.companyName,
        email_address: request.email,
        phone_number: request.phone,
        address: request.address
          ? {
              address_line_1: request.address.line1,
              address_line_2: request.address.line2,
              locality: request.address.city,
              administrative_district_level_1: request.address.state,
              postal_code: request.address.postalCode,
              country: request.address.country || 'US',
            }
          : undefined,
      },
      payment_requests: [
        {
          request_method: 'EMAIL',
          request_type: 'BALANCE',
          due_date:
            request.dueDate ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split('T')[0],
        },
      ],
      description: request.description || request.title,
      invoice_number: `${request.tenantId.toUpperCase()}-${Date.now()}`,
      title: request.title,
      order_request: {
        location_id: config.locationId,
        order: {
          location_id: config.locationId,
          line_items: request.lineItems.map((item, index) => ({
            uid: `item-${index}`,
            name: item.name,
            quantity: item.quantity.toString(),
            base_price_money: {
              amount: Math.round(item.rate * 100),
              currency: 'USD',
            },
            variation_name: item.description || item.name,
          })),
        },
      },
    };

    const response = await fetch(`${baseUrl}/v2/invoices`, {
      method: 'POST',
      headers: {
        'Square-Version': '2023-10-18',
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invoiceData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Square API Error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    // Publish the invoice
    const publishResponse = await fetch(
      `${baseUrl}/v2/invoices/${result.invoice.id}/publish`,
      {
        method: 'POST',
        headers: {
          'Square-Version': '2023-10-18',
          Authorization: `Bearer ${config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_method: 'EMAIL',
        }),
      }
    );

    const publishResult = await publishResponse.json();

    return {
      success: true,
      provider: 'square',
      tenantId: request.tenantId,
      invoiceId: result.invoice.id,
      invoiceNumber: result.invoice.invoice_number,
      publicUrl: result.invoice.public_url,
      status: result.invoice.status,
      amount: result.invoice.order?.total_money?.amount / 100,
      currency: 'USD',
      providerSpecificData: { square: result },
    };
  }

  /**
   * Create Bill.com invoice
   */
  private async createBillcomInvoice(
    request: UnifiedInvoiceRequest,
    config: BillcomConfig
  ): Promise<UnifiedInvoiceResponse> {
    // Bill.com API implementation
    const baseUrl =
      config.environment === 'production'
        ? 'https://api.bill.com/api/v2'
        : 'https://staging-api.bill.com/api/v2';

    // First, create or get customer
    const customerData = {
      obj: 'Customer',
      entity: 'Customer',
      name: request.companyName || request.customerName,
      email: request.email,
      phone: request.phone,
    };

    // Create invoice
    const invoiceData = {
      obj: 'Invoice',
      entity: 'Invoice',
      customerId: 'customer-id', // Would get from customer creation
      description: request.description || request.title,
      dueDate: request.dueDate,
      invoiceLineItems: request.lineItems.map((item) => ({
        obj: 'InvoiceLineItem',
        entity: 'InvoiceLineItem',
        description: item.description || item.name,
        quantity: item.quantity,
        price: item.rate,
        amount: item.amount,
      })),
    };

    // Mock Bill.com response for now
    return {
      success: true,
      provider: 'billcom',
      tenantId: request.tenantId,
      invoiceId: `bill-${Date.now()}`,
      invoiceNumber: `BC-${request.tenantId.toUpperCase()}-${Date.now()}`,
      publicUrl: `https://app.bill.com/invoice/view/bill-${Date.now()}`,
      status: 'sent',
      amount: request.lineItems.reduce((sum, item) => sum + item.amount, 0),
      currency: 'USD',
      providerSpecificData: {
        billcom: { message: 'Mock Bill.com invoice created' },
      },
    };
  }

  /**
   * Create QuickBooks invoice
   */
  private async createQuickBooksInvoice(
    request: UnifiedInvoiceRequest,
    config: QuickBooksConfig
  ): Promise<UnifiedInvoiceResponse> {
    // QuickBooks API implementation
    const baseUrl =
      config.environment === 'production'
        ? 'https://quickbooks-api.intuit.com'
        : 'https://sandbox-quickbooks-api.intuit.com';

    // Mock QuickBooks response for now
    return {
      success: true,
      provider: 'quickbooks',
      tenantId: request.tenantId,
      invoiceId: `qb-${Date.now()}`,
      invoiceNumber: `QB-${request.tenantId.toUpperCase()}-${Date.now()}`,
      publicUrl: `https://qbo.intuit.com/invoice/view/qb-${Date.now()}`,
      status: 'sent',
      amount: request.lineItems.reduce((sum, item) => sum + item.amount, 0),
      currency: 'USD',
      providerSpecificData: {
        quickbooks: { message: 'Mock QuickBooks invoice created' },
      },
    };
  }

  /**
   * Create Stripe invoice
   */
  private async createStripeInvoice(
    request: UnifiedInvoiceRequest,
    config: StripeConfig
  ): Promise<UnifiedInvoiceResponse> {
    // Stripe API implementation would go here
    // For now, return mock response
    return {
      success: true,
      provider: 'stripe',
      tenantId: request.tenantId,
      invoiceId: `in_${Date.now()}`,
      invoiceNumber: `ST-${request.tenantId.toUpperCase()}-${Date.now()}`,
      publicUrl: `https://invoice.stripe.com/i/acct_test123/in_${Date.now()}`,
      status: 'open',
      amount: request.lineItems.reduce((sum, item) => sum + item.amount, 0),
      currency: 'USD',
      providerSpecificData: {
        stripe: { message: 'Mock Stripe invoice created' },
      },
    };
  }

  /**
   * Test provider connection
   */
  async testProviderConnection(
    tenantId: string,
    provider: 'square' | 'billcom' | 'quickbooks' | 'stripe'
  ): Promise<{ success: boolean; error?: string }> {
    const config = this.getTenantConfig(tenantId);
    if (!config || !config.providers[provider]) {
      return { success: false, error: 'Provider not configured' };
    }

    try {
      switch (provider) {
        case 'square':
          return await this.testSquareConnection(config.providers.square!);
        case 'billcom':
          return await this.testBillcomConnection(config.providers.billcom!);
        case 'quickbooks':
          return await this.testQuickBooksConnection(
            config.providers.quickbooks!
          );
        case 'stripe':
          return await this.testStripeConnection(config.providers.stripe!);
        default:
          return { success: false, error: 'Unsupported provider' };
      }
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Connection test failed',
      };
    }
  }

  private async testSquareConnection(
    config: SquareConfig
  ): Promise<{ success: boolean; error?: string }> {
    const baseUrl =
      config.environment === 'production'
        ? 'https://connect.squareup.com'
        : 'https://connect.squareupsandbox.com';

    const response = await fetch(`${baseUrl}/v2/locations`, {
      headers: {
        'Square-Version': '2023-10-18',
        Authorization: `Bearer ${config.accessToken}`,
      },
    });

    return { success: response.ok };
  }

  private async testBillcomConnection(
    config: BillcomConfig
  ): Promise<{ success: boolean; error?: string }> {
    // Mock Bill.com connection test
    return { success: true };
  }

  private async testQuickBooksConnection(
    config: QuickBooksConfig
  ): Promise<{ success: boolean; error?: string }> {
    // Mock QuickBooks connection test
    return { success: true };
  }

  private async testStripeConnection(
    config: StripeConfig
  ): Promise<{ success: boolean; error?: string }> {
    // Mock Stripe connection test
    return { success: true };
  }

  /**
   * Update tenant payment configuration
   */
  async updateTenantConfig(config: TenantPaymentConfig): Promise<boolean> {
    try {
      this.tenantConfigs.set(config.tenantId, config);
      await this.saveTenantConfigToDatabase(config);
      return true;
    } catch (error) {
      console.error('Error updating tenant config:', error);
      return false;
    }
  }

  private async saveTenantConfigToDatabase(
    config: TenantPaymentConfig
  ): Promise<void> {
    // Mock implementation - replace with actual database save
    console.log(
      `Saving payment config for tenant ${config.tenantId} to database`
    );
  }
}

export default MultiTenantPaymentService;
























