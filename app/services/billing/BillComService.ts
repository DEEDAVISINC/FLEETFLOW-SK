// Bill.com Integration Service for FleetFlow
// Handles automated invoice generation, recurring billing, and payment processing
import { isBillcomEnabled } from '../../utils/environmentValidator';

export interface BillComCustomer {
  id: string;
  name: string;
  email: string;
  companyName: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentTerms: 'NET_15' | 'NET_30' | 'NET_45' | 'DUE_ON_RECEIPT';
  currency: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  category:
    | 'TMS'
    | 'CONSORTIUM'
    | 'COMPLIANCE'
    | 'USAGE'
    | 'ADDON'
    | 'ACCESSORIAL';
  metadata?: Record<string, string>;
}

export interface Invoice {
  id: string;
  customerId: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  paymentUrl?: string;
  metadata?: Record<string, string>;
}

export interface BillingPeriod {
  startDate: Date;
  endDate: Date;
  customerId: string;
}

export interface UsageCharges {
  apiCalls: { quantity: number; rate: number };
  dataExports: { quantity: number; rate: number };
  smsMessages: { quantity: number; rate: number };
  premiumFeatures: { quantity: number; rate: number };
}

export class BillComService {
  private apiUrl: string;
  private apiKey: string;
  private sessionId: string | null = null;

  constructor() {
    // Only initialize if Bill.com is enabled
    if (!isBillcomEnabled()) {
      console.warn(
        'Bill.com is not configured. Invoice features will be disabled.'
      );
    }

    this.apiUrl = process.env.BILLCOM_API_URL || 'https://api.bill.com/api/v2';
    this.apiKey = process.env.BILLCOM_API_KEY || '';

    if (isBillcomEnabled() && !this.apiKey) {
      throw new Error(
        'BILLCOM_API_KEY environment variable is required when Bill.com is enabled'
      );
    }
  }

  // ========================================
  // AUTHENTICATION & SESSION MANAGEMENT
  // ========================================

  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/Login.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          userName: process.env.BILLCOM_USERNAME || '',
          password: process.env.BILLCOM_PASSWORD || '',
          apiKey: this.apiKey,
        }),
      });

      const data = await response.json();

      if (data.response_status !== 0) {
        throw new Error(
          `Bill.com authentication failed: ${data.response_message}`
        );
      }

      this.sessionId = data.response_data.sessionId;
      return this.sessionId;
    } catch (error) {
      console.error('Bill.com authentication error:', error);
      throw error;
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    if (!this.sessionId) {
      await this.authenticate();
    }
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    await this.ensureAuthenticated();

    const response = await fetch(`${this.apiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        sessionId: this.sessionId!,
        data: JSON.stringify(data),
      }),
    });

    const result = await response.json();

    if (result.response_status !== 0) {
      throw new Error(`Bill.com API error: ${result.response_message}`);
    }

    return result.response_data;
  }

  // ========================================
  // CUSTOMER MANAGEMENT
  // ========================================

  async createCustomer(
    customerData: Omit<BillComCustomer, 'id'>
  ): Promise<BillComCustomer> {
    try {
      const billComCustomer = {
        entity: 'Customer',
        name: customerData.companyName,
        email: customerData.email,
        contactFirstName: customerData.name.split(' ')[0],
        contactLastName: customerData.name.split(' ').slice(1).join(' '),
        address1: customerData.address.street,
        city: customerData.address.city,
        state: customerData.address.state,
        zip: customerData.address.zip,
        country: customerData.address.country,
        paymentTerm: customerData.paymentTerms,
        currency: customerData.currency,
        isActive: '1',
      };

      const response = await this.makeRequest(
        'Crud/Create/Customer.json',
        billComCustomer
      );

      return {
        id: response.id,
        ...customerData,
      };
    } catch (error) {
      console.error('Error creating Bill.com customer:', error);
      throw error;
    }
  }

  async getCustomer(customerId: string): Promise<BillComCustomer | null> {
    try {
      const response = await this.makeRequest('Crud/Read/Customer.json', {
        id: customerId,
      });

      return {
        id: response.id,
        name: `${response.contactFirstName} ${response.contactLastName}`,
        email: response.email,
        companyName: response.name,
        address: {
          street: response.address1 || '',
          city: response.city || '',
          state: response.state || '',
          zip: response.zip || '',
          country: response.country || 'US',
        },
        paymentTerms: response.paymentTerm || 'NET_30',
        currency: response.currency || 'USD',
      };
    } catch (error) {
      console.error('Error retrieving Bill.com customer:', error);
      return null;
    }
  }

  // ========================================
  // INVOICE CREATION & MANAGEMENT
  // ========================================

  async createAccessorialInvoice(
    customerId: string,
    loadId: string,
    accessorials: {
      detention: Array<{
        hours: number;
        ratePerHour: number;
        total: number;
        location: string;
        approved: boolean;
      }>;
      lumper: Array<{ amount: number; location: string; approved: boolean }>;
      other: Array<{
        type: string;
        description: string;
        amount: number;
        approved: boolean;
      }>;
      totalAmount: number;
    }
  ): Promise<Invoice | null> {
    try {
      const lineItems: InvoiceLineItem[] = [];

      // Add detention fees
      accessorials.detention
        .filter((d) => d.approved)
        .forEach((detention) => {
          lineItems.push({
            description: `Detention - ${detention.location} (${detention.hours} hours @ $${detention.ratePerHour}/hr)`,
            quantity: detention.hours,
            rate: detention.ratePerHour,
            amount: detention.total,
            category: 'ACCESSORIAL',
            metadata: {
              loadId,
              type: 'detention',
              location: detention.location,
            },
          });
        });

      // Add lumper fees
      accessorials.lumper
        .filter((l) => l.approved)
        .forEach((lumper) => {
          lineItems.push({
            description: `Lumper Fee - ${lumper.location}`,
            quantity: 1,
            rate: lumper.amount,
            amount: lumper.amount,
            category: 'ACCESSORIAL',
            metadata: {
              loadId,
              type: 'lumper',
              location: lumper.location,
            },
          });
        });

      // Add other accessorials
      accessorials.other
        .filter((o) => o.approved)
        .forEach((other) => {
          lineItems.push({
            description: `${other.type} - ${other.description}`,
            quantity: 1,
            rate: other.amount,
            amount: other.amount,
            category: 'ACCESSORIAL',
            metadata: {
              loadId,
              type: 'other',
              accessorialType: other.type,
            },
          });
        });

      if (lineItems.length === 0) {
        console.info('No approved accessorials to invoice');
        return null;
      }

      const invoice = await this.createInvoice(customerId, lineItems, {
        loadId,
        invoiceType: 'accessorial',
        totalAccessorials: accessorials.totalAmount.toString(),
      });

      return invoice;
    } catch (error) {
      console.error('Error creating accessorial invoice:', error);
      return null;
    }
  }

  async createInvoice(
    customerId: string,
    lineItems: InvoiceLineItem[],
    metadata?: Record<string, string>
  ): Promise<Invoice> {
    try {
      const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
      const tax = subtotal * 0.08; // 8% tax rate - should be configurable
      const total = subtotal + tax;

      const invoiceData = {
        entity: 'Invoice',
        customerId: customerId,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: this.calculateDueDate(new Date(), 'NET_30'),
        invoiceLineItems: lineItems.map((item, index) => ({
          entity: 'InvoiceLineItem',
          itemId: '', // Use predefined items or create dynamic items
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.rate,
          amount: item.amount,
          lineType: '1', // Item line type
        })),
        description: `FleetFlow Services - ${new Date().toLocaleDateString()}`,
        isActive: '1',
      };

      const response = await this.makeRequest(
        'Crud/Create/Invoice.json',
        invoiceData
      );

      return {
        id: response.id,
        customerId,
        invoiceNumber: response.invoiceNumber,
        date: new Date(response.invoiceDate),
        dueDate: new Date(response.dueDate),
        lineItems,
        subtotal,
        tax,
        total,
        status: 'DRAFT',
        metadata,
      };
    } catch (error) {
      console.error('Error creating Bill.com invoice:', error);
      throw error;
    }
  }

  async generateUsageInvoice(
    customerId: string,
    period: BillingPeriod,
    usage: UsageCharges
  ): Promise<Invoice> {
    try {
      const lineItems: InvoiceLineItem[] = [];

      // API Usage
      if (usage.apiCalls.quantity > 0) {
        lineItems.push({
          description: `API Calls (${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()})`,
          quantity: usage.apiCalls.quantity,
          rate: usage.apiCalls.rate,
          amount: usage.apiCalls.quantity * usage.apiCalls.rate,
          category: 'USAGE',
          metadata: {
            type: 'api_calls',
            period: `${period.startDate.toISOString()}_${period.endDate.toISOString()}`,
          },
        });
      }

      // Data Exports
      if (usage.dataExports.quantity > 0) {
        lineItems.push({
          description: `Data Exports (${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()})`,
          quantity: usage.dataExports.quantity,
          rate: usage.dataExports.rate,
          amount: usage.dataExports.quantity * usage.dataExports.rate,
          category: 'USAGE',
          metadata: {
            type: 'data_exports',
            period: `${period.startDate.toISOString()}_${period.endDate.toISOString()}`,
          },
        });
      }

      // SMS Messages
      if (usage.smsMessages.quantity > 0) {
        lineItems.push({
          description: `SMS Notifications (${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()})`,
          quantity: usage.smsMessages.quantity,
          rate: usage.smsMessages.rate,
          amount: usage.smsMessages.quantity * usage.smsMessages.rate,
          category: 'USAGE',
          metadata: {
            type: 'sms_messages',
            period: `${period.startDate.toISOString()}_${period.endDate.toISOString()}`,
          },
        });
      }

      // Premium Features
      if (usage.premiumFeatures.quantity > 0) {
        lineItems.push({
          description: `Premium Feature Usage (${period.startDate.toLocaleDateString()} - ${period.endDate.toLocaleDateString()})`,
          quantity: usage.premiumFeatures.quantity,
          rate: usage.premiumFeatures.rate,
          amount: usage.premiumFeatures.quantity * usage.premiumFeatures.rate,
          category: 'USAGE',
          metadata: {
            type: 'premium_features',
            period: `${period.startDate.toISOString()}_${period.endDate.toISOString()}`,
          },
        });
      }

      if (lineItems.length === 0) {
        throw new Error('No usage charges to invoice');
      }

      return await this.createInvoice(customerId, lineItems, {
        type: 'usage_invoice',
        period: `${period.startDate.toISOString()}_${period.endDate.toISOString()}`,
      });
    } catch (error) {
      console.error('Error generating usage invoice:', error);
      throw error;
    }
  }

  async sendInvoice(invoiceId: string): Promise<boolean> {
    try {
      await this.makeRequest('SendInvoice.json', {
        invoiceId,
      });

      return true;
    } catch (error) {
      console.error('Error sending invoice:', error);
      return false;
    }
  }

  async getInvoice(invoiceId: string): Promise<Invoice | null> {
    try {
      const response = await this.makeRequest('Crud/Read/Invoice.json', {
        id: invoiceId,
      });

      return {
        id: response.id,
        customerId: response.customerId,
        invoiceNumber: response.invoiceNumber,
        date: new Date(response.invoiceDate),
        dueDate: new Date(response.dueDate),
        lineItems: [], // Would need to fetch line items separately
        subtotal: parseFloat(response.amount || '0'),
        tax: parseFloat(response.taxAmount || '0'),
        total: parseFloat(response.amountDue || '0'),
        status: this.mapInvoiceStatus(response.invoiceStatus),
      };
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      return null;
    }
  }

  async listCustomerInvoices(customerId: string): Promise<Invoice[]> {
    try {
      const response = await this.makeRequest('List/Invoice.json', {
        filters: [
          {
            field: 'customerId',
            op: '=',
            value: customerId,
          },
        ],
      });

      return response.map((invoice: any) => ({
        id: invoice.id,
        customerId: invoice.customerId,
        invoiceNumber: invoice.invoiceNumber,
        date: new Date(invoice.invoiceDate),
        dueDate: new Date(invoice.dueDate),
        lineItems: [],
        subtotal: parseFloat(invoice.amount || '0'),
        tax: parseFloat(invoice.taxAmount || '0'),
        total: parseFloat(invoice.amountDue || '0'),
        status: this.mapInvoiceStatus(invoice.invoiceStatus),
      }));
    } catch (error) {
      console.error('Error listing customer invoices:', error);
      return [];
    }
  }

  // ========================================
  // RECURRING BILLING AUTOMATION
  // ========================================

  async scheduleRecurringBilling(
    customerId: string,
    subscriptionItems: InvoiceLineItem[],
    interval: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY'
  ): Promise<boolean> {
    try {
      // Bill.com doesn't have built-in recurring billing, so we'll implement this
      // as a scheduled job that creates invoices based on the interval

      const recurringBilling = {
        customerId,
        items: subscriptionItems,
        interval,
        nextBillingDate: this.calculateNextBillingDate(new Date(), interval),
        isActive: true,
        createdAt: new Date(),
      };

      // Store in database for processing by scheduled job
      await this.storeRecurringBilling(recurringBilling);

      return true;
    } catch (error) {
      console.error('Error scheduling recurring billing:', error);
      return false;
    }
  }

  async processRecurringBilling(): Promise<number> {
    try {
      const dueRecurringBills = await this.getDueRecurringBills();
      let processedCount = 0;

      for (const bill of dueRecurringBills) {
        try {
          await this.createInvoice(bill.customerId, bill.items);
          await this.updateNextBillingDate(bill.id, bill.interval);
          processedCount++;
        } catch (error) {
          console.error(`Error processing recurring bill ${bill.id}:`, error);
        }
      }

      return processedCount;
    } catch (error) {
      console.error('Error processing recurring billing:', error);
      return 0;
    }
  }

  // ========================================
  // PAYMENT PROCESSING
  // ========================================

  async processPayments(): Promise<number> {
    try {
      // Get overdue invoices
      const overdueInvoices = await this.getOverdueInvoices();
      let processedCount = 0;

      for (const invoice of overdueInvoices) {
        try {
          // Attempt to charge saved payment method
          const paymentResult = await this.chargeCustomer(
            invoice.customerId,
            invoice.total
          );

          if (paymentResult.success) {
            await this.markInvoiceAsPaid(invoice.id, paymentResult.paymentId);
            processedCount++;
          } else {
            await this.handleFailedPayment(invoice.id, paymentResult.error);
          }
        } catch (error) {
          console.error(
            `Error processing payment for invoice ${invoice.id}:`,
            error
          );
        }
      }

      return processedCount;
    } catch (error) {
      console.error('Error processing payments:', error);
      return 0;
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private calculateDueDate(invoiceDate: Date, paymentTerms: string): string {
    const dueDate = new Date(invoiceDate);

    switch (paymentTerms) {
      case 'NET_15':
        dueDate.setDate(dueDate.getDate() + 15);
        break;
      case 'NET_30':
        dueDate.setDate(dueDate.getDate() + 30);
        break;
      case 'NET_45':
        dueDate.setDate(dueDate.getDate() + 45);
        break;
      case 'DUE_ON_RECEIPT':
      default:
        // Due immediately
        break;
    }

    return dueDate.toISOString().split('T')[0];
  }

  private calculateNextBillingDate(currentDate: Date, interval: string): Date {
    const nextDate = new Date(currentDate);

    switch (interval) {
      case 'MONTHLY':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'QUARTERLY':
        nextDate.setMonth(nextDate.getMonth() + 3);
        break;
      case 'ANNUALLY':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
    }

    return nextDate;
  }

  private mapInvoiceStatus(billComStatus: string): Invoice['status'] {
    const statusMap: Record<string, Invoice['status']> = {
      '0': 'DRAFT',
      '1': 'SENT',
      '4': 'PAID',
      '5': 'OVERDUE',
      '6': 'CANCELLED',
    };

    return statusMap[billComStatus] || 'DRAFT';
  }

  // ========================================
  // DATABASE OPERATIONS (TO BE IMPLEMENTED)
  // ========================================

  private async storeRecurringBilling(recurringBilling: any): Promise<void> {
    // TODO: Implement database storage for recurring billing schedules
    console.info('Storing recurring billing:', recurringBilling);
  }

  private async getDueRecurringBills(): Promise<any[]> {
    // TODO: Implement database query for due recurring bills
    return [];
  }

  private async updateNextBillingDate(
    billId: string,
    interval: string
  ): Promise<void> {
    // TODO: Implement database update for next billing date
    console.info('Updating next billing date for:', billId);
  }

  private async getOverdueInvoices(): Promise<Invoice[]> {
    // TODO: Implement database query for overdue invoices
    return [];
  }

  private async chargeCustomer(
    customerId: string,
    amount: number
  ): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    // TODO: Integrate with payment processor (Stripe) to charge customer
    return { success: false, error: 'Payment processing not implemented' };
  }

  private async markInvoiceAsPaid(
    invoiceId: string,
    paymentId: string
  ): Promise<void> {
    // TODO: Update invoice status in Bill.com and local database
    console.info('Marking invoice as paid:', invoiceId, paymentId);
  }

  private async handleFailedPayment(
    invoiceId: string,
    error: string
  ): Promise<void> {
    // TODO: Implement failed payment handling (notifications, retries, etc.)
    console.info('Handling failed payment for invoice:', invoiceId, error);
  }
}

export default BillComService;
