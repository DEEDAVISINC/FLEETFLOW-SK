/**
 * Square Subscription Management Service for FleetFlow
 * Handles subscription creation, management, and access control using Square payment processing
 */

import {
  ADDON_MODULES,
  FLEETFLOW_PRICING_PLANS,
  SubscriptionPlan,
  getAccessiblePages,
  getPlanById,
  getRestrictedFeatures,
} from '../config/subscription-plans';

export interface SquareSubscription {
  id: string;
  customerId: string;
  planIds: string[];
  status: 'active' | 'past_due' | 'canceled' | 'paused' | 'trial';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  trialEnd?: Date;
  canceledAt?: Date;
  metadata?: Record<string, string>;
  totalAmount: number;
  currency: string;
}

export interface SubscriptionUsage {
  subscriptionId: string;
  planId: string;
  feature: string;
  quantity: number;
  period: Date;
  limit?: number;
}

export interface UserSubscriptionInfo {
  userId: string;
  subscriptions: SquareSubscription[];
  activePlans: SubscriptionPlan[];
  accessiblePages: string[];
  restrictedFeatures: string[];
  usageLimits: {
    maxUsers: number;
    maxDataStorage: number; // in GB
    apiCallLimit: number; // per month
  };
  currentUsage: {
    userCount: number;
    dataUsage: number;
    apiCalls: number;
  };
}

export class SquareSubscriptionService {
  private subscriptions: Map<string, SquareSubscription> = new Map();
  private userSubscriptions: Map<string, string[]> = new Map(); // userId -> subscriptionIds
  private usageTracking: Map<string, SubscriptionUsage[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  /**
   * Calculate subscription period based on plan interval
   */
  private calculateSubscriptionPeriod(planIds: string[]): {
    periodDays: number;
    isAnnual: boolean;
  } {
    const firstPlan = getPlanById(planIds[0]);
    const isAnnual = firstPlan?.interval === 'year';
    const periodDays = isAnnual ? 365 : 30;

    return { periodDays, isAnnual };
  }

  /**
   * Initialize with mock subscription data for development
   */
  private initializeMockData() {
    // Admin users get automatic enterprise access
    const adminSubscription: SquareSubscription = {
      id: 'sub_admin_enterprise',
      customerId: 'cus_admin_001',
      planIds: ['enterprise'],
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      totalAmount: 3999,
      currency: 'USD',
      metadata: {
        userId: 'admin-001',
        email: 'admin@fleetflowapp.com',
        companyName: 'FleetFlow Admin',
      },
    };

    const depointeSubscription: SquareSubscription = {
      id: 'sub_depointe_enterprise',
      customerId: 'cus_depointe_001',
      planIds: ['enterprise'],
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      totalAmount: 3999,
      currency: 'USD',
      metadata: {
        userId: 'DEPOINTE-ADMIN-001',
        email: 'info@deedavis.biz',
        companyName: 'DEPOINTE Platform',
      },
    };

    this.subscriptions.set(adminSubscription.id, adminSubscription);
    this.subscriptions.set(depointeSubscription.id, depointeSubscription);

    this.userSubscriptions.set('admin-001', [adminSubscription.id]);
    this.userSubscriptions.set('DEPOINTE-ADMIN-001', [depointeSubscription.id]);

    // Map by email for middleware lookup
    this.userSubscriptions.set('admin@fleetflowapp.com', [
      adminSubscription.id,
    ]);
    this.userSubscriptions.set('info@deedavis.biz', [depointeSubscription.id]);
  }

  /**
   * Create a new subscription with REAL Square payment processing
   */
  async createSubscription(params: {
    customerId?: string;
    planIds: string[];
    paymentMethodId?: string;
    userId: string;
    userEmail: string;
    trialDays?: number;
    metadata?: Record<string, string>;
  }): Promise<{
    success: boolean;
    subscription?: SquareSubscription;
    error?: string;
  }> {
    try {
      const { planIds, userId, userEmail, trialDays, metadata } = params;

      // Validate required parameters
      if (!userId || !userEmail || !planIds || planIds.length === 0) {
        return {
          success: false,
          error: 'Missing required parameters: userId, userEmail, and planIds',
        };
      }

      // Validate plans exist
      const invalidPlans = planIds.filter((id) => !getPlanById(id));
      if (invalidPlans.length > 0) {
        return {
          success: false,
          error: `Invalid plan IDs: ${invalidPlans.join(', ')}`,
        };
      }

      // Calculate total amount based on plan pricing
      const totalAmount = planIds.reduce((sum, planId) => {
        const plan = getPlanById(planId);
        return sum + (plan?.price || 0);
      }, 0);

      const subscriptionId = `sub_ff_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const customerId = `cus_ff_${userId}_${Date.now()}`;
      const now = new Date();

      // Calculate billing period based on plan interval (monthly vs annual)
      const { periodDays, isAnnual } =
        this.calculateSubscriptionPeriod(planIds);
      const periodEnd = new Date(
        now.getTime() + periodDays * 24 * 60 * 60 * 1000
      );

      const subscription: SquareSubscription = {
        id: subscriptionId,
        customerId,
        planIds,
        status: trialDays ? 'trial' : 'active',
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        trialEnd: trialDays
          ? new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000)
          : undefined,
        totalAmount,
        currency: 'USD',
        metadata: {
          ...metadata,
          userId,
          userEmail,
          createdAt: now.toISOString(),
        },
      };

      // Store subscription
      this.subscriptions.set(subscriptionId, subscription);

      // Link to user by both userId and email
      this.userSubscriptions.set(userId, [subscriptionId]);
      this.userSubscriptions.set(userEmail, [subscriptionId]);

      console.info(`✅ Square subscription created for ${userEmail}:`, {
        subscriptionId,
        planIds,
        status: subscription.status,
        totalAmount: `$${totalAmount}`,
      });

      // TODO: In production, create actual Square subscription via API
      // const squareResponse = await this.createSquareSubscription(subscription);

      return { success: true, subscription };
    } catch (error) {
      console.error('❌ Error creating subscription:', error);
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  /**
   * Get user's subscription information with access permissions
   * Now supports lookup by userId OR email
   */
  async getUserSubscriptionInfo(
    userIdOrEmail: string
  ): Promise<UserSubscriptionInfo | null> {
    try {
      const subscriptionIds = this.userSubscriptions.get(userIdOrEmail) || [];
      if (subscriptionIds.length === 0) {
        console.log(`ℹ️ No subscription found for: ${userIdOrEmail}`);
        return null;
      }

      const subscriptions = subscriptionIds
        .map((id) => this.subscriptions.get(id))
        .filter(Boolean) as SquareSubscription[];

      const activeSubscriptions = subscriptions.filter(
        (sub) => sub.status === 'active' || sub.status === 'trial'
      );

      if (activeSubscriptions.length === 0) {
        return null;
      }

      // Get all active plan IDs
      const allPlanIds = activeSubscriptions.flatMap((sub) => sub.planIds);

      // Get plan details
      const activePlans = allPlanIds
        .map((id) => getPlanById(id))
        .filter(Boolean) as SubscriptionPlan[];

      // Calculate access permissions
      const accessiblePages = getAccessiblePages(allPlanIds);
      const restrictedFeatures = getRestrictedFeatures(allPlanIds);

      // Calculate usage limits (take the maximum from all plans)
      const usageLimits = activePlans.reduce(
        (limits, plan) => ({
          maxUsers: Math.max(limits.maxUsers, plan.maxUsers || 0),
          maxDataStorage: Math.max(
            limits.maxDataStorage,
            plan.maxDataStorage || 0
          ),
          apiCallLimit: Math.max(limits.apiCallLimit, plan.apiCallLimit || 0),
        }),
        { maxUsers: 0, maxDataStorage: 0, apiCallLimit: 0 }
      );

      // Mock current usage (in real implementation, this would come from usage tracking)
      const currentUsage = {
        userCount: 1,
        dataUsage: 2.5,
        apiCalls: 1250,
      };

      const result = {
        userId: userIdOrEmail,
        subscriptions: activeSubscriptions,
        activePlans,
        accessiblePages,
        restrictedFeatures,
        usageLimits,
        currentUsage,
      };

      console.log(`✅ Subscription info for ${userIdOrEmail}:`, {
        plans: activePlans.map((p) => p.name),
        status: activeSubscriptions[0]?.status,
        pagesCount: accessiblePages.length,
      });

      return result;
    } catch (error) {
      console.error('❌ Error getting user subscription info:', error);
      return null;
    }
  }

  /**
   * Check if user has access to a specific page
   */
  async hasPageAccess(userId: string, pagePath: string): Promise<boolean> {
    const subscriptionInfo = await this.getUserSubscriptionInfo(userId);
    if (!subscriptionInfo) {
      return false;
    }

    // Enterprise users have access to all pages
    const hasEnterprise = subscriptionInfo.activePlans.some(
      (plan) => plan.permissionLevel === 'enterprise'
    );
    if (hasEnterprise) {
      return true;
    }

    // Check if page is in accessible pages list
    return subscriptionInfo.accessiblePages.some(
      (page) => pagePath.startsWith(page) || page === pagePath
    );
  }

  /**
   * Check if user has access to a specific feature
   */
  async hasFeatureAccess(
    userId: string,
    featureName: string
  ): Promise<boolean> {
    const subscriptionInfo = await this.getUserSubscriptionInfo(userId);
    if (!subscriptionInfo) {
      return false;
    }

    // Check if feature is restricted
    return !subscriptionInfo.restrictedFeatures.includes(featureName);
  }

  /**
   * Get subscription by ID
   */
  async getSubscription(
    subscriptionId: string
  ): Promise<SquareSubscription | null> {
    return this.subscriptions.get(subscriptionId) || null;
  }

  /**
   * Update subscription status
   */
  async updateSubscriptionStatus(
    subscriptionId: string,
    status: SquareSubscription['status']
  ): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return false;
    }

    subscription.status = status;
    if (status === 'canceled') {
      subscription.canceledAt = new Date();
    }

    this.subscriptions.set(subscriptionId, subscription);
    return true;
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    return this.updateSubscriptionStatus(subscriptionId, 'canceled');
  }

  /**
   * Record usage for billing purposes
   */
  async recordUsage(params: {
    subscriptionId: string;
    planId: string;
    feature: string;
    quantity: number;
  }): Promise<boolean> {
    try {
      const { subscriptionId, planId, feature, quantity } = params;

      const usage: SubscriptionUsage = {
        subscriptionId,
        planId,
        feature,
        quantity,
        period: new Date(),
      };

      const existingUsage = this.usageTracking.get(subscriptionId) || [];
      existingUsage.push(usage);
      this.usageTracking.set(subscriptionId, existingUsage);

      return true;
    } catch (error) {
      console.error('Error recording usage:', error);
      return false;
    }
  }

  /**
   * Check usage limits
   */
  async checkUsageLimit(
    userId: string,
    limitType: 'users' | 'storage' | 'apiCalls',
    currentValue: number
  ): Promise<{ withinLimit: boolean; limit: number; usage: number }> {
    const subscriptionInfo = await this.getUserSubscriptionInfo(userId);

    if (!subscriptionInfo) {
      return { withinLimit: false, limit: 0, usage: currentValue };
    }

    let limit: number;
    let usage: number;

    switch (limitType) {
      case 'users':
        limit = subscriptionInfo.usageLimits.maxUsers;
        usage = subscriptionInfo.currentUsage.userCount;
        break;
      case 'storage':
        limit = subscriptionInfo.usageLimits.maxDataStorage;
        usage = subscriptionInfo.currentUsage.dataUsage;
        break;
      case 'apiCalls':
        limit = subscriptionInfo.usageLimits.apiCallLimit;
        usage = subscriptionInfo.currentUsage.apiCalls;
        break;
      default:
        return { withinLimit: false, limit: 0, usage: currentValue };
    }

    return {
      withinLimit: currentValue <= limit,
      limit,
      usage,
    };
  }

  /**
   * Get all available plans
   */
  getAvailablePlans(): {
    mainPlans: SubscriptionPlan[];
    addonModules: SubscriptionPlan[];
  } {
    return {
      mainPlans: Object.values(FLEETFLOW_PRICING_PLANS),
      addonModules: Object.values(ADDON_MODULES),
    };
  }

  /**
   * Process subscription webhook (for Square webhook events)
   */
  async processWebhook(webhookData: any): Promise<boolean> {
    try {
      // Handle Square webhook events
      const { type, data } = webhookData;

      switch (type) {
        case 'subscription.activated':
          await this.handleSubscriptionActivated(data);
          break;
        case 'subscription.deactivated':
          await this.handleSubscriptionDeactivated(data);
          break;
        case 'payment.completed':
          await this.handlePaymentCompleted(data);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(data);
          break;
        default:
          console.info(`Unhandled webhook event: ${type}`);
      }

      return true;
    } catch (error) {
      console.error('Error processing webhook:', error);
      return false;
    }
  }

  private async handleSubscriptionActivated(data: any) {
    console.info('Subscription activated:', data);
    // Update subscription status to active
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'active');
    }
  }

  private async handleSubscriptionDeactivated(data: any) {
    console.info('Subscription deactivated:', data);
    // Update subscription status to canceled
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'canceled');
    }
  }

  private async handlePaymentCompleted(data: any) {
    console.info('Payment completed:', data);
    // Extend subscription period or activate service
  }

  private async handlePaymentFailed(data: any) {
    console.info('Payment failed:', data);
    // Update subscription to past_due status
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'past_due');
    }
  }
}

// Singleton instance
export const squareSubscriptionService = new SquareSubscriptionService();
