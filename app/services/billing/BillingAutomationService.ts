// Comprehensive Billing Automation Service
// Orchestrates Square and Bill.com for complete revenue management

import BillComService, {
  type Invoice,
  type InvoiceLineItem,
  type UsageCharges,
} from './BillComService';

export interface BillingCustomer {
  id: string;
  squareCustomerId: string;
  billComCustomerId: string;
  email: string;
  companyName: string;
  subscriptions: BillingSubscription[];
  usageTracking: UsageTracking;
  billingPreferences: BillingPreferences;
}

export interface BillingSubscription {
  id: string;
  squareSubscriptionId: string;
  planId: string;
  planName: string;
  price: number;
  interval: 'month' | 'year';
  status: 'active' | 'canceled' | 'past_due';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  nextBillingDate: Date;
}

export interface UsageTracking {
  customerId: string;
  currentPeriod: {
    startDate: Date;
    endDate: Date;
  };
  usage: {
    apiCalls: number;
    dataExports: number;
    smsMessages: number;
    premiumFeatures: number;
    drivers: number;
  };
  limits: {
    apiCalls: number | 'unlimited';
    dataExports: number | 'unlimited';
    smsMessages: number | 'unlimited';
    premiumFeatures: number | 'unlimited';
    drivers: number | 'unlimited';
  };
}

export interface BillingPreferences {
  paymentMethod: 'auto' | 'manual';
  invoiceDelivery: 'email' | 'postal' | 'both';
  currency: 'USD' | 'CAD' | 'EUR';
  taxId?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface BillingMetrics {
  monthlyRecurringRevenue: number;
  annualRunRate: number;
  customerLifetimeValue: number;
  churnRate: number;
  revenueByCategory: {
    tms: number;
    consortium: number;
    compliance: number;
    usage: number;
  };
  outstandingInvoices: number;
  overdueAmount: number;
}

export class BillingAutomationService {
  private squareService: SquareService;
  private billComService: BillComService;

  constructor() {
    // Temporarily disable services to prevent fallback mock data
    this.squareService = null as any;
    this.billComService = null as any;
  }

  // ========================================
  // CUSTOMER LIFECYCLE MANAGEMENT
  // ========================================

  async createBillingCustomer(customerData: {
    email: string;
    name: string;
    companyName: string;
    address: BillingPreferences['billingAddress'];
  }): Promise<BillingCustomer> {
    try {
      // Create customer in both Stripe and Bill.com
      const stripeCustomer = await this.stripeService.createCustomer({
        email: customerData.email,
        name: customerData.name,
        companyName: customerData.companyName,
        metadata: {
          platform: 'FleetFlow',
          createdAt: new Date().toISOString(),
        },
      });

      const billComCustomer = await this.billComService.createCustomer({
        name: customerData.name,
        email: customerData.email,
        companyName: customerData.companyName,
        address: customerData.address,
        paymentTerms: 'NET_30',
        currency: 'USD',
      });

      const billingCustomer: BillingCustomer = {
        id: this.generateCustomerId(),
        stripeCustomerId: stripeCustomer.id,
        billComCustomerId: billComCustomer.id,
        email: customerData.email,
        companyName: customerData.companyName,
        subscriptions: [],
        usageTracking: this.initializeUsageTracking(stripeCustomer.id),
        billingPreferences: {
          paymentMethod: 'auto',
          invoiceDelivery: 'email',
          currency: 'USD',
          billingAddress: customerData.address,
        },
      };

      await this.storeBillingCustomer(billingCustomer);
      return billingCustomer;
    } catch (error) {
      console.error('Error creating billing customer:', error);
      throw new Error('Failed to create billing customer');
    }
  }

  async subscribeToPlan(
    customerId: string,
    planId: string,
    metadata?: Record<string, string>
  ): Promise<BillingSubscription> {
    try {
      const customer = await this.getBillingCustomer(customerId);
      if (!customer) {
        throw new Error('Customer not found');
      }

      // Create subscription in Stripe
      const stripeSubscription = await this.stripeService.createSubscription(
        customer.stripeCustomerId,
        planId,
        metadata
      );

      const billingSubscription: BillingSubscription = {
        id: this.generateSubscriptionId(),
        stripeSubscriptionId: stripeSubscription.id,
        planId,
        planName: this.getPlanName(planId),
        price: this.getPlanPrice(planId),
        interval: this.getPlanInterval(planId),
        status: 'active',
        currentPeriodStart: new Date(
          stripeSubscription.current_period_start * 1000
        ),
        currentPeriodEnd: new Date(
          stripeSubscription.current_period_end * 1000
        ),
        nextBillingDate: new Date(stripeSubscription.current_period_end * 1000),
      };

      // Update customer subscriptions
      customer.subscriptions.push(billingSubscription);
      await this.updateBillingCustomer(customer);

      // Update usage limits based on new plan
      await this.updateUsageLimits(customerId, planId);

      return billingSubscription;
    } catch (error) {
      console.error('Error subscribing to plan:', error);
      throw new Error('Failed to subscribe to plan');
    }
  }

  // ========================================
  // USAGE TRACKING & BILLING
  // ========================================

  async trackUsage(
    customerId: string,
    feature: 'apiCalls' | 'dataExports' | 'smsMessages' | 'premiumFeatures',
    quantity: number = 1
  ): Promise<boolean> {
    try {
      const customer = await this.getBillingCustomer(customerId);
      if (!customer) {
        return false;
      }

      // Update usage tracking
      customer.usageTracking.usage[feature] += quantity;
      await this.updateBillingCustomer(customer);

      // Record usage in Stripe for metered billing
      const subscriptions = await this.stripeService.listCustomerSubscriptions(
        customer.stripeCustomerId
      );
      for (const subscription of subscriptions) {
        for (const item of subscription.items.data) {
          if (item.price.metadata?.feature === feature) {
            await this.stripeService.recordUsage(item.id, quantity);
            break;
          }
        }
      }

      // Check for usage overages
      await this.checkUsageOverages(customerId);

      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }

  async checkUsageOverages(customerId: string): Promise<void> {
    try {
      const customer = await this.getBillingCustomer(customerId);
      if (!customer) return;

      const { usage, limits } = customer.usageTracking;
      const overages: Array<{
        feature: string;
        usage: number;
        limit: number;
        overage: number;
      }> = [];

      // Check each usage type for overages
      Object.keys(usage).forEach((feature) => {
        const featureUsage = usage[feature as keyof typeof usage];
        const featureLimit = limits[feature as keyof typeof limits];

        if (featureLimit !== 'unlimited' && featureUsage > featureLimit) {
          overages.push({
            feature,
            usage: featureUsage,
            limit: featureLimit as number,
            overage: featureUsage - (featureLimit as number),
          });
        }
      });

      if (overages.length > 0) {
        await this.handleUsageOverages(customerId, overages);
      }
    } catch (error) {
      console.error('Error checking usage overages:', error);
    }
  }

  private async handleUsageOverages(
    customerId: string,
    overages: Array<{
      feature: string;
      usage: number;
      limit: number;
      overage: number;
    }>
  ): Promise<void> {
    // Send overage notification
    await this.sendOverageNotification(customerId, overages);

    // Create overage charges for next invoice
    const overageCharges: InvoiceLineItem[] = overages.map((overage) => ({
      description: `${overage.feature} overage (${overage.overage} over limit)`,
      quantity: overage.overage,
      rate: this.getOverageRate(overage.feature),
      amount: overage.overage * this.getOverageRate(overage.feature),
      category: 'USAGE',
      metadata: {
        type: 'overage',
        feature: overage.feature,
        period: new Date().toISOString(),
      },
    }));

    await this.scheduleOverageCharges(customerId, overageCharges);
  }

  // ========================================
  // AUTOMATED BILLING PROCESSES
  // ========================================

  async processMonthlyBilling(): Promise<{
    processed: number;
    failed: number;
    totalRevenue: number;
  }> {
    console.info('🔄 Starting monthly billing process...');

    let processed = 0;
    let failed = 0;
    let totalRevenue = 0;

    try {
      const customers = await this.getAllBillingCustomers();

      for (const customer of customers) {
        try {
          // Generate usage invoice for the previous month
          const usageInvoice = await this.generateUsageInvoice(customer.id);
          if (usageInvoice) {
            totalRevenue += usageInvoice.total;
            processed++;
          }

          // Reset usage tracking for new period
          await this.resetUsageTracking(customer.id);

          console.info(`✅ Processed billing for ${customer.companyName}`);
        } catch (error) {
          console.error(
            `❌ Failed to process billing for ${customer.companyName}:`,
            error
          );
          failed++;
        }
      }

      // Process recurring billing through Bill.com
      const recurringProcessed =
        await this.billComService.processRecurringBilling();
      processed += recurringProcessed;

      console.info(
        `🎉 Monthly billing complete: ${processed} processed, ${failed} failed, $${totalRevenue.toFixed(2)} revenue`
      );

      return { processed, failed, totalRevenue };
    } catch (error) {
      console.error('Error in monthly billing process:', error);
      return { processed, failed, totalRevenue };
    }
  }

  async generateUsageInvoice(customerId: string): Promise<Invoice | null> {
    try {
      const customer = await this.getBillingCustomer(customerId);
      if (!customer) return null;

      const { usage } = customer.usageTracking;
      const usageCharges: UsageCharges = {
        apiCalls: { quantity: usage.apiCalls, rate: 0.1 / 1000 }, // $0.10 per 1000 calls
        dataExports: { quantity: usage.dataExports, rate: 0.5 }, // $0.50 per export
        smsMessages: { quantity: usage.smsMessages, rate: 0.05 }, // $0.05 per message
        premiumFeatures: { quantity: usage.premiumFeatures, rate: 1.99 }, // $1.99 per feature use
      };

      const period = {
        startDate: customer.usageTracking.currentPeriod.startDate,
        endDate: customer.usageTracking.currentPeriod.endDate,
        customerId: customer.billComCustomerId,
      };

      const invoice = await this.billComService.generateUsageInvoice(
        customer.billComCustomerId,
        period,
        usageCharges
      );

      // Send invoice automatically
      await this.billComService.sendInvoice(invoice.id);

      return invoice;
    } catch (error) {
      console.error('Error generating usage invoice:', error);
      return null;
    }
  }

  async processFailedPayments(): Promise<{
    retried: number;
    suspended: number;
  }> {
    console.info('🔄 Processing failed payments...');

    let retried = 0;
    let suspended = 0;

    try {
      const overdueInvoices = await this.getOverdueInvoices();

      for (const invoice of overdueInvoices) {
        try {
          const customer = await this.getBillingCustomerByInvoice(invoice.id);
          if (!customer) continue;

          // Retry payment
          const paymentAttempt = await this.retryPayment(
            customer.stripeCustomerId,
            invoice.total
          );

          if (paymentAttempt.success) {
            await this.markInvoiceAsPaid(invoice.id);
            await this.sendPaymentSuccessNotification(customer.id);
            retried++;
          } else {
            // Handle failed payment based on number of attempts
            const failureCount = await this.getPaymentFailureCount(invoice.id);

            if (failureCount >= 3) {
              // Suspend services after 3 failed attempts
              await this.suspendCustomerServices(customer.id);
              await this.sendServiceSuspensionNotification(customer.id);
              suspended++;
            } else {
              // Send dunning notification
              await this.sendDunningNotification(customer.id, failureCount + 1);
            }
          }
        } catch (error) {
          console.error(
            `Error processing failed payment for invoice ${invoice.id}:`,
            error
          );
        }
      }

      console.info(
        `💳 Failed payments processed: ${retried} retried, ${suspended} suspended`
      );
      return { retried, suspended };
    } catch (error) {
      console.error('Error processing failed payments:', error);
      return { retried: 0, suspended: 0 };
    }
  }

  // ========================================
  // ANALYTICS & REPORTING
  // ========================================

  async generateBillingMetrics(): Promise<BillingMetrics> {
    try {
      const customers = await this.getAllBillingCustomers();
      const invoices = await this.getAllInvoices();

      // Calculate MRR
      const mrr = customers.reduce((total, customer) => {
        return (
          total +
          customer.subscriptions
            .filter((sub) => sub.status === 'active')
            .reduce((subTotal, sub) => {
              return (
                subTotal +
                (sub.interval === 'month' ? sub.price : sub.price / 12)
              );
            }, 0)
        );
      }, 0);

      // Calculate ARR
      const arr = mrr * 12;

      // Calculate revenue by category
      const revenueByCategory = await this.calculateRevenueByCategory();

      // Calculate outstanding and overdue amounts
      const { outstanding, overdue } =
        this.calculateOutstandingAmounts(invoices);

      // Calculate churn rate (simplified)
      const churnRate = await this.calculateChurnRate();

      // Calculate CLV (simplified)
      const clv = arr / customers.length; // Very simplified CLV calculation

      return {
        monthlyRecurringRevenue: mrr,
        annualRunRate: arr,
        customerLifetimeValue: clv,
        churnRate,
        revenueByCategory,
        outstandingInvoices: outstanding,
        overdueAmount: overdue,
      };
    } catch (error) {
      console.error('Error generating billing metrics:', error);
      throw error;
    }
  }

  // ========================================
  // HELPER METHODS
  // ========================================

  private generateCustomerId(): string {
    return `ff_customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSubscriptionId(): string {
    return `ff_sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeUsageTracking(customerId: string): UsageTracking {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      customerId,
      currentPeriod: {
        startDate: startOfMonth,
        endDate: endOfMonth,
      },
      usage: {
        apiCalls: 0,
        dataExports: 0,
        smsMessages: 0,
        premiumFeatures: 0,
        drivers: 0,
      },
      limits: {
        apiCalls: 10000,
        dataExports: 50,
        smsMessages: 500,
        premiumFeatures: 'unlimited',
        drivers: 50,
      },
    };
  }

  private getPlanName(planId: string): string {
    const planNames: Record<string, string> = {
      tms_starter: 'TMS Starter',
      tms_professional: 'TMS Professional',
      tms_enterprise: 'TMS Enterprise',
      consortium_basic: 'Data Consortium Basic',
      consortium_professional: 'Data Consortium Professional',
      consortium_enterprise: 'Data Consortium Enterprise',
      compliance_basic: 'DOT Compliance Basic',
      compliance_full: 'DOT Compliance Full',
      compliance_managed: 'DOT Compliance Managed',
    };
    return planNames[planId] || 'Unknown Plan';
  }

  private getPlanPrice(planId: string): number {
    const planPrices: Record<string, number> = {
      tms_starter: 199,
      tms_professional: 499,
      tms_enterprise: 1299,
      consortium_basic: 99,
      consortium_professional: 299,
      consortium_enterprise: 899,
      compliance_basic: 149,
      compliance_full: 349,
      compliance_managed: 799,
    };
    return planPrices[planId] || 0;
  }

  private getPlanInterval(planId: string): 'month' | 'year' {
    // For now, all plans are monthly
    return 'month';
  }

  private getOverageRate(feature: string): number {
    const overageRates: Record<string, number> = {
      apiCalls: 0.15 / 1000, // $0.15 per 1000 calls (premium rate)
      dataExports: 0.75, // $0.75 per export (premium rate)
      smsMessages: 0.08, // $0.08 per message (premium rate)
      premiumFeatures: 2.99, // $2.99 per feature use (premium rate)
    };
    return overageRates[feature] || 0;
  }

  // ========================================
  // DATABASE OPERATIONS (TO BE IMPLEMENTED)
  // ========================================

  private async storeBillingCustomer(customer: BillingCustomer): Promise<void> {
    // TODO: Implement database storage
    console.info('Storing billing customer:', customer.id);
  }

  private async getBillingCustomer(
    customerId: string
  ): Promise<BillingCustomer | null> {
    // TODO: Implement database retrieval
    return null;
  }

  private async updateBillingCustomer(
    customer: BillingCustomer
  ): Promise<void> {
    // TODO: Implement database update
    console.info('Updating billing customer:', customer.id);
  }

  private async getAllBillingCustomers(): Promise<BillingCustomer[]> {
    // TODO: Implement database query
    return [];
  }

  private async updateUsageLimits(
    customerId: string,
    planId: string
  ): Promise<void> {
    // TODO: Update usage limits based on plan
    console.info('Updating usage limits for:', customerId, planId);
  }

  private async resetUsageTracking(customerId: string): Promise<void> {
    // TODO: Reset usage tracking for new billing period
    console.info('Resetting usage tracking for:', customerId);
  }

  private async scheduleOverageCharges(
    customerId: string,
    charges: InvoiceLineItem[]
  ): Promise<void> {
    // TODO: Schedule overage charges for next invoice
    console.info('Scheduling overage charges for:', customerId);
  }

  private async sendOverageNotification(
    customerId: string,
    overages: any[]
  ): Promise<void> {
    // TODO: Send overage notification email
    console.info('Sending overage notification to:', customerId);
  }

  private async getOverdueInvoices(): Promise<Invoice[]> {
    // TODO: Get overdue invoices from database
    return [];
  }

  private async getBillingCustomerByInvoice(
    invoiceId: string
  ): Promise<BillingCustomer | null> {
    // TODO: Get customer by invoice ID
    return null;
  }

  private async retryPayment(
    stripeCustomerId: string,
    amount: number
  ): Promise<{ success: boolean; error?: string }> {
    // TODO: Implement payment retry logic
    return { success: false, error: 'Not implemented' };
  }

  private async markInvoiceAsPaid(invoiceId: string): Promise<void> {
    // TODO: Mark invoice as paid
    console.info('Marking invoice as paid:', invoiceId);
  }

  private async getPaymentFailureCount(invoiceId: string): Promise<number> {
    // TODO: Get payment failure count from database
    return 0;
  }

  private async suspendCustomerServices(customerId: string): Promise<void> {
    // TODO: Suspend customer services
    console.info('Suspending services for:', customerId);
  }

  private async sendPaymentSuccessNotification(
    customerId: string
  ): Promise<void> {
    // TODO: Send payment success notification
    console.info('Sending payment success notification to:', customerId);
  }

  private async sendServiceSuspensionNotification(
    customerId: string
  ): Promise<void> {
    // TODO: Send service suspension notification
    console.info('Sending service suspension notification to:', customerId);
  }

  private async sendDunningNotification(
    customerId: string,
    attemptNumber: number
  ): Promise<void> {
    // TODO: Send dunning notification
    console.info(
      'Sending dunning notification to:',
      customerId,
      'attempt:',
      attemptNumber
    );
  }

  private async getAllInvoices(): Promise<Invoice[]> {
    // TODO: Get all invoices from database
    return [];
  }

  private async calculateRevenueByCategory(): Promise<
    BillingMetrics['revenueByCategory']
  > {
    // TODO: Calculate revenue by category
    return { tms: 0, consortium: 0, compliance: 0, usage: 0 };
  }

  private calculateOutstandingAmounts(invoices: Invoice[]): {
    outstanding: number;
    overdue: number;
  } {
    const outstanding = invoices
      .filter((inv) => inv.status === 'SENT')
      .reduce((total, inv) => total + inv.total, 0);

    const overdue = invoices
      .filter((inv) => inv.status === 'OVERDUE')
      .reduce((total, inv) => total + inv.total, 0);

    return { outstanding, overdue };
  }

  private async calculateChurnRate(): Promise<number> {
    // TODO: Calculate churn rate
    return 0.023; // 2.3% example
  }
}

export default BillingAutomationService;
