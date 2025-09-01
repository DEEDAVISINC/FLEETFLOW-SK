// Stripe Service for FleetFlow Revenue Infrastructure
import Stripe from 'stripe';
import {
  isBillingEnabled,
  requireValidEnvironment,
} from '../../utils/environmentValidator';

export interface Customer {
  id: string;
  email: string;
  name: string;
  companyName: string;
  metadata?: Record<string, string>;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  category: 'TMS' | 'CONSORTIUM' | 'COMPLIANCE' | 'ADDON';
  priceType?: 'fixed' | 'starts_at' | 'custom';
  maxPrice?: number;
  priceDescription?: string;
}

export interface UsageRecord {
  customerId: string;
  feature: string;
  quantity: number;
  timestamp: Date;
  description?: string;
}

export class StripeService {
  private stripe: Stripe;

  constructor() {
    // Validate environment before initializing
    requireValidEnvironment();

    if (!isBillingEnabled()) {
      throw new Error(
        'Billing is not properly configured. Please check your Stripe environment variables.'
      );
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  // ========================================
  // CUSTOMER MANAGEMENT
  // ========================================

  async createCustomer(customerData: Omit<Customer, 'id'>): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        metadata: {
          companyName: customerData.companyName,
          platform: 'FleetFlow',
          ...customerData.metadata,
        },
      });

      return {
        id: customer.id,
        email: customerData.email,
        name: customerData.name,
        companyName: customerData.companyName,
        metadata: customerData.metadata,
      };
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async getCustomer(customerId: string): Promise<Stripe.Customer | null> {
    try {
      const customer = await this.stripe.customers.retrieve(customerId);
      return customer as Stripe.Customer;
    } catch (error) {
      console.error('Error retrieving customer:', error);
      return null;
    }
  }

  async updateCustomer(
    customerId: string,
    updates: Partial<Customer>
  ): Promise<Customer> {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        email: updates.email,
        name: updates.name,
        metadata: updates.metadata,
      });

      return {
        id: customer.id,
        email: updates.email || '',
        name: updates.name || '',
        companyName: updates.companyName || '',
        metadata: updates.metadata,
      };
    } catch (error) {
      console.error('Error updating customer:', error);
      throw new Error('Failed to update customer');
    }
  }

  // ========================================
  // SUBSCRIPTION MANAGEMENT
  // ========================================

  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          platform: 'FleetFlow',
          ...metadata,
        },
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  async updateSubscription(
    subscriptionId: string,
    items: Array<{ id?: string; price: string; quantity?: number }>
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          items: items.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity || 1,
          })),
          proration_behavior: 'create_prorations',
        }
      );

      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw new Error('Failed to update subscription');
    }
  }

  async cancelSubscription(
    subscriptionId: string,
    immediately = false
  ): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.update(
        subscriptionId,
        {
          cancel_at_period_end: !immediately,
        }
      );

      if (immediately) {
        return await this.stripe.subscriptions.cancel(subscriptionId);
      }

      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  async getSubscription(
    subscriptionId: string
  ): Promise<Stripe.Subscription | null> {
    try {
      const subscription =
        await this.stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      return null;
    }
  }

  async listCustomerSubscriptions(
    customerId: string
  ): Promise<Stripe.Subscription[]> {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        expand: ['data.latest_invoice'],
      });

      return subscriptions.data;
    } catch (error) {
      console.error('Error listing customer subscriptions:', error);
      return [];
    }
  }

  // ========================================
  // USAGE-BASED BILLING
  // ========================================

  async recordUsage(
    subscriptionItemId: string,
    quantity: number,
    timestamp?: Date
  ): Promise<Stripe.UsageRecord> {
    try {
      const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(
        subscriptionItemId,
        {
          quantity,
          timestamp: timestamp
            ? Math.floor(timestamp.getTime() / 1000)
            : undefined,
          action: 'increment',
        }
      );

      return usageRecord;
    } catch (error) {
      console.error('Error recording usage:', error);
      throw new Error('Failed to record usage');
    }
  }

  async createUsageRecord(usageData: UsageRecord): Promise<boolean> {
    try {
      // Find the customer's subscription items that match the feature
      const subscriptions = await this.listCustomerSubscriptions(
        usageData.customerId
      );

      for (const subscription of subscriptions) {
        for (const item of subscription.items.data) {
          const price = item.price;
          if (price.metadata?.feature === usageData.feature) {
            await this.recordUsage(
              item.id,
              usageData.quantity,
              usageData.timestamp
            );
            return true;
          }
        }
      }

      // If no matching subscription item found, log the usage for later billing
      console.warn(
        `No subscription item found for feature: ${usageData.feature}`
      );
      return false;
    } catch (error) {
      console.error('Error creating usage record:', error);
      return false;
    }
  }

  // ========================================
  // ONE-TIME PAYMENTS
  // ========================================

  async createPaymentIntent(
    amount: number,
    customerId: string,
    description?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        customer: customerId,
        description: description || 'FleetFlow Service Payment',
        metadata: {
          platform: 'FleetFlow',
          ...metadata,
        },
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethodId,
        }
      );

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment intent:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // ========================================
  // BILLING & INVOICES
  // ========================================

  async createInvoice(
    customerId: string,
    lineItems: Array<{
      description: string;
      amount: number;
      quantity?: number;
    }>,
    metadata?: Record<string, string>
  ): Promise<Stripe.Invoice> {
    try {
      // Create invoice items
      for (const item of lineItems) {
        await this.stripe.invoiceItems.create({
          customer: customerId,
          amount: Math.round(item.amount * 100),
          description: item.description,
          quantity: item.quantity || 1,
        });
      }

      // Create and finalize invoice
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        auto_advance: true,
        metadata: {
          platform: 'FleetFlow',
          ...metadata,
        },
      });

      await this.stripe.invoices.finalizeInvoice(invoice.id);
      return invoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw new Error('Failed to create invoice');
    }
  }

  async listInvoices(customerId: string): Promise<Stripe.Invoice[]> {
    try {
      const invoices = await this.stripe.invoices.list({
        customer: customerId,
        limit: 50,
      });

      return invoices.data;
    } catch (error) {
      console.error('Error listing invoices:', error);
      return [];
    }
  }

  // ========================================
  // WEBHOOK HANDLING
  // ========================================

  async constructEvent(
    payload: string | Buffer,
    signature: string
  ): Promise<Stripe.Event> {
    try {
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!endpointSecret) {
        throw new Error('STRIPE_WEBHOOK_SECRET is required');
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        endpointSecret
      );

      return event;
    } catch (error) {
      console.error('Error constructing webhook event:', error);
      throw new Error('Invalid webhook signature');
    }
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(
            event.data.object as Stripe.Subscription
          );
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(
            event.data.object as Stripe.Invoice
          );
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        default:
          console.info(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook event:', error);
      throw error;
    }
  }

  private async handleSubscriptionCreated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    console.info('Subscription created:', subscription.id);
    // TODO: Update user's plan in database
    // TODO: Send welcome email
    // TODO: Enable features based on plan
  }

  private async handleSubscriptionUpdated(
    subscription: Stripe.Subscription
  ): Promise<void> {
    console.info('Subscription updated:', subscription.id);
    // TODO: Update user's plan in database
    // TODO: Handle plan upgrades/downgrades
    // TODO: Adjust feature access
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription
  ): Promise<void> {
    console.info('Subscription deleted:', subscription.id);
    // TODO: Disable user's paid features
    // TODO: Send cancellation confirmation
    // TODO: Archive user data
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.info('Payment succeeded:', invoice.id);
    // TODO: Send payment confirmation
    // TODO: Extend service period
    // TODO: Clear any overdue notices
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.info('Payment failed:', invoice.id);
    // TODO: Send payment failure notification
    // TODO: Implement dunning management
    // TODO: Potentially suspend services
  }
}

// ========================================
// PREDEFINED PRICING PLANS - COMPREHENSIVE FLEETFLOW ENTERPRISE STRUCTURE
// ========================================

export const FLEETFLOW_PRICING_PLANS: Record<string, SubscriptionPlan> = {
  // ========================================
  // PROFESSIONAL SUBSCRIPTION TIERS
  // ========================================

  // FleetFlow University℠
  FLEETFLOW_UNIVERSITY: {
    id: 'fleetflow_university',
    name: 'FleetFlow University℠',
    price: 49,
    interval: 'month',
    category: 'TMS',
    features: [
      'Complete training curriculum',
      'BOL/MBL/HBL Documentation Mastery',
      'Warehouse Operations Excellence',
      'Enhanced Freight Brokerage training',
      'Interactive components & certification',
      'Role-specific content (dispatchers, brokers, managers)',
      'Unlimited course access',
      'Industry best practices library',
      'Compliance training modules',
      'Performance tracking & analytics',
    ],
  },

  // Dispatcher Pro
  DISPATCHER_PRO: {
    id: 'dispatcher_pro',
    name: 'Dispatcher Pro',
    price: 99,
    interval: 'month',
    category: 'TMS',
    features: [
      'Advanced dispatch management',
      'Real-time load tracking',
      'Driver communication tools',
      'Route optimization',
      'Performance analytics',
      'Mobile app access',
      'Compliance monitoring',
      'Emergency response protocols',
      'Load board integration',
      'Automated notifications',
    ],
  },

  // RFx Professional (RFB/RFQ/RFP/RFI)
  RFX_PROFESSIONAL: {
    id: 'rfx_professional',
    name: 'RFx Professional',
    price: 119,
    interval: 'month',
    category: 'TMS',
    features: [
      'Professional Freight Quoting System',
      'RFB/RFQ/RFP/RFI management',
      'Government contracts (SAM.gov integration)',
      'Enterprise RFPs (major corporations)',
      'InstantMarkets integration (205,587+ opportunities)',
      'Warehousing & 3PL opportunities ($25-50M)',
      'AI-powered proposal generation',
      'Competitive intelligence',
      'Win/loss analytics',
      'Automated bidding workflows',
    ],
  },

  // Broker Elite
  BROKER_ELITE: {
    id: 'broker_elite',
    name: 'Broker Elite',
    price: 149,
    interval: 'month',
    category: 'TMS',
    features: [
      'Complete freight brokerage platform',
      'Advanced carrier network',
      'Smart load matching',
      'Margin optimization tools',
      'Credit management system',
      'Factoring integration',
      'Multi-modal shipping',
      'Customer portal access',
      'Advanced reporting & analytics',
      'API access for integrations',
    ],
  },

  // AI Flow Professional
  AI_FLOW_PROFESSIONAL: {
    id: 'ai_flow_professional',
    name: 'AI Flow Professional',
    price: 199,
    interval: 'month',
    category: 'TMS',
    features: [
      'AI-Powered Call Center Platform (FreeSWITCH)',
      'Claude AI negotiation capabilities (85-90% success rates)',
      'Smart Auto-Bidding Rules engine',
      'AI freight broker with dynamic pricing',
      'AI dispatcher with load coordination',
      'AI recruiting with lead management',
      'Predictive analytics & forecasting',
      'Real-time decision automation',
      'Advanced machine learning models',
      'Custom AI workflow builder',
    ],
  },

  // Enterprise Professional
  ENTERPRISE_PROFESSIONAL: {
    id: 'enterprise_professional',
    name: 'Enterprise Professional',
    price: 299,
    interval: 'month',
    category: 'TMS',
    priceType: 'starts_at',
    maxPrice: 999,
    priceDescription: 'Pricing scales based on team size and feature usage',
    features: [
      'Complete enterprise platform access',
      'Unlimited users & drivers',
      'White-label capabilities',
      'Multi-tenant architecture',
      'Advanced API access (all endpoints)',
      'Custom integrations & workflows',
      'Dedicated account manager',
      'Priority support (24/7)',
      'Custom training & onboarding',
      'Enterprise SLA guarantees',
    ],
  },

  // ========================================
  // À LA CARTE SYSTEM
  // ========================================

  // Base Platform
  BASE_PLATFORM: {
    id: 'base_platform',
    name: 'Base Platform',
    price: 29,
    interval: 'month',
    category: 'TMS',
    features: [
      'Core TMS functionality',
      'Basic driver management',
      'Load tracking',
      'DOT compliance basics',
      'Mobile app access',
      'Email support',
      'Standard reporting',
      'Up to 5 users',
      'Basic API access',
      'Community support',
    ],
  },

  // À La Carte Add-ons
  ADDON_ADVANCED_ANALYTICS: {
    id: 'addon_advanced_analytics',
    name: 'Advanced Analytics Module',
    price: 39,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Comprehensive performance dashboards',
      'Predictive analytics',
      'Custom report builder',
      'ROI calculations',
      'Benchmarking tools',
    ],
  },

  ADDON_AI_AUTOMATION: {
    id: 'addon_ai_automation',
    name: 'AI Automation Module',
    price: 59,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Smart load matching',
      'Automated dispatch',
      'AI-powered routing',
      'Predictive maintenance',
      'Intelligent notifications',
    ],
  },

  ADDON_COMPLIANCE_PRO: {
    id: 'addon_compliance_pro',
    name: 'Compliance Pro Module',
    price: 49,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Advanced DOT compliance',
      'FMCSA integration',
      'Automated form generation',
      'Audit preparation',
      'Violation management',
    ],
  },

  ADDON_FINANCIAL_SUITE: {
    id: 'addon_financial_suite',
    name: 'Financial Suite Module',
    price: 69,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Advanced accounting',
      'Bill.com integration',
      'Invoice automation',
      'Financial reporting',
      'Cash flow management',
    ],
  },

  ADDON_WAREHOUSE_3PL: {
    id: 'addon_warehouse_3pl',
    name: 'Warehouse & 3PL Module',
    price: 89,
    interval: 'month',
    category: 'ADDON',
    features: [
      'Warehouse management system',
      '3PL operations',
      'Inventory tracking',
      'Cross-docking',
      'Distribution management',
    ],
  },

  // ========================================
  // DATA CONSORTIUM PLANS
  // ========================================

  CONSORTIUM_BASIC: {
    id: 'consortium_basic',
    name: 'Data Consortium Basic',
    price: 99,
    interval: 'month',
    category: 'CONSORTIUM',
    features: [
      'Industry benchmarking (2,847+ companies)',
      'Anonymous intelligence sharing',
      'Basic performance metrics',
      'Monthly market reports',
      'Fuel price trends',
      'Email insights',
    ],
  },

  CONSORTIUM_PROFESSIONAL: {
    id: 'consortium_professional',
    name: 'Data Consortium Professional',
    price: 299,
    interval: 'month',
    category: 'CONSORTIUM',
    features: [
      'Real-time market intelligence',
      'Financial Markets Intelligence Platform',
      'Real-time diesel pricing & fuel futures',
      'AI hedging recommendations',
      'Predictive analytics',
      'Custom dashboards',
      'API access',
      'Weekly insights',
      'Competitive positioning data',
    ],
  },

  CONSORTIUM_ENTERPRISE: {
    id: 'consortium_enterprise',
    name: 'Data Consortium Enterprise',
    price: 899,
    interval: 'month',
    category: 'CONSORTIUM',
    priceType: 'starts_at',
    maxPrice: 2999,
    priceDescription:
      'Pricing scales with data volume and API usage requirements',
    features: [
      'Full API access (all data streams)',
      'Custom analytics & modeling',
      'Priority data access',
      'Dedicated insights team',
      'Real-time alerts & notifications',
      'Custom integrations',
      'Strategic consulting services',
      'Exclusive market research',
      'Direct analyst access',
    ],
  },

  // ========================================
  // STRATEGIC ENTERPRISE TIERS
  // ========================================

  STRATEGIC_GROWTH: {
    id: 'strategic_growth',
    name: 'Strategic Growth',
    price: 2499,
    interval: 'month',
    category: 'TMS',
    priceType: 'starts_at',
    maxPrice: 9999,
    priceDescription:
      'Enterprise pricing varies by implementation scope and strategic requirements',
    features: [
      'Complete platform suite',
      'Fortune 500 partnership access',
      'Government contract opportunities ($500K-$5M)',
      'Quantum-inspired route optimization',
      'Enterprise partnership platform',
      'Strategic acquisition preparation',
      'Dedicated success team',
      'Custom development resources',
      'White-glove onboarding',
      'Strategic consulting included',
    ],
  },

  STRATEGIC_ENTERPRISE: {
    id: 'strategic_enterprise',
    name: 'Strategic Enterprise',
    price: 4999,
    interval: 'month',
    category: 'TMS',
    priceType: 'custom',
    priceDescription:
      'Custom enterprise pricing - Contact for personalized quote',
    features: [
      'Full enterprise ecosystem access',
      'Multi-billion dollar contract access',
      'Strategic acquisition positioning',
      'Custom platform development',
      'Dedicated development team',
      'C-suite strategic consulting',
      'Merger & acquisition support',
      'IPO preparation services',
      'Board-ready analytics',
      'Strategic exit planning',
    ],
  },

  // ========================================
  // COMPLIANCE PLANS
  // ========================================

  COMPLIANCE_BASIC: {
    id: 'compliance_basic',
    name: 'DOT Compliance Basic',
    price: 149,
    interval: 'month',
    category: 'COMPLIANCE',
    features: [
      'FMCSA form management',
      'Deadline tracking',
      'Basic reporting',
      'Email reminders',
      'Driver qualification files',
      'Vehicle inspection records',
    ],
  },

  COMPLIANCE_FULL: {
    id: 'compliance_full',
    name: 'DOT Compliance Full',
    price: 349,
    interval: 'month',
    category: 'COMPLIANCE',
    features: [
      'Complete DOT compliance platform',
      'FMCSA integration',
      'Full automation',
      'Audit preparation',
      'Violation management',
      'Advanced reporting',
      'Phone support',
      'Compliance consulting',
    ],
  },

  COMPLIANCE_MANAGED: {
    id: 'compliance_managed',
    name: 'DOT Compliance Managed',
    price: 799,
    interval: 'month',
    category: 'COMPLIANCE',
    priceType: 'starts_at',
    maxPrice: 1999,
    priceDescription:
      'Pricing varies based on fleet size and compliance complexity',
    features: [
      'Dedicated compliance officer',
      'Full service management',
      'Guaranteed compliance',
      'Audit representation',
      'Priority support',
      'Legal consultation',
      'Risk assessment',
      'Compliance strategy development',
    ],
  },
};

export default StripeService;
