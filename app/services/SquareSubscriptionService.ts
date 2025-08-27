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
   * Initialize with mock subscription data for development
   */
  private initializeMockData() {
    // Mock active subscription for admin user
    const adminSubscription: SquareSubscription = {
      id: 'sub_admin_enterprise',
      customerId: 'cus_admin_001',
      planIds: ['enterprise_professional'],
      status: 'active',
      currentPeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalAmount: 299,
      currency: 'USD',
      metadata: {
        userId: 'admin-001',
        companyName: 'FleetFlow Admin',
      },
    };

    // Mock trial subscription for new user
    const trialSubscription: SquareSubscription = {
      id: 'sub_trial_001',
      customerId: 'cus_trial_001',
      planIds: ['dispatcher_pro'],
      status: 'trial',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      totalAmount: 99,
      currency: 'USD',
      metadata: {
        userId: 'disp-001',
        companyName: 'Trial Company',
      },
    };

    this.subscriptions.set(adminSubscription.id, adminSubscription);
    this.subscriptions.set(trialSubscription.id, trialSubscription);

    this.userSubscriptions.set('admin-001', [adminSubscription.id]);
    this.userSubscriptions.set('disp-001', [trialSubscription.id]);
  }

  /**
   * Create a new subscription with Square payment processing
   */
  async createSubscription(params: {
    customerId: string;
    planIds: string[];
    paymentMethodId: string;
    userId: string;
    trialDays?: number;
    metadata?: Record<string, string>;
  }): Promise<{
    success: boolean;
    subscription?: SquareSubscription;
    error?: string;
  }> {
    try {
      const { customerId, planIds, userId, trialDays, metadata } = params;

      // Validate plans exist
      const invalidPlans = planIds.filter((id) => !getPlanById(id));
      if (invalidPlans.length > 0) {
        return {
          success: false,
          error: `Invalid plan IDs: ${invalidPlans.join(', ')}`,
        };
      }

      // Calculate total amount
      const totalAmount = planIds.reduce((sum, planId) => {
        const plan = getPlanById(planId);
        return sum + (plan?.price || 0);
      }, 0);

      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const now = new Date();
      const periodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

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
        },
      };

      // Store subscription
      this.subscriptions.set(subscriptionId, subscription);

      // Link to user
      const userSubs = this.userSubscriptions.get(userId) || [];
      userSubs.push(subscriptionId);
      this.userSubscriptions.set(userId, userSubs);

      // In a real implementation, this would process payment with Square
      console.log('Square subscription created:', subscriptionId);

      return { success: true, subscription };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  /**
   * Get user's subscription information with access permissions
   */
  async getUserSubscriptionInfo(
    userId: string
  ): Promise<UserSubscriptionInfo | null> {
    try {
      const subscriptionIds = this.userSubscriptions.get(userId) || [];
      if (subscriptionIds.length === 0) {
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

      return {
        userId,
        subscriptions: activeSubscriptions,
        activePlans,
        accessiblePages,
        restrictedFeatures,
        usageLimits,
        currentUsage,
      };
    } catch (error) {
      console.error('Error getting user subscription info:', error);
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
          console.log(`Unhandled webhook event: ${type}`);
      }

      return true;
    } catch (error) {
      console.error('Error processing webhook:', error);
      return false;
    }
  }

  private async handleSubscriptionActivated(data: any) {
    console.log('Subscription activated:', data);
    // Update subscription status to active
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'active');
    }
  }

  private async handleSubscriptionDeactivated(data: any) {
    console.log('Subscription deactivated:', data);
    // Update subscription status to canceled
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'canceled');
    }
  }

  private async handlePaymentCompleted(data: any) {
    console.log('Payment completed:', data);
    // Extend subscription period or activate service
  }

  private async handlePaymentFailed(data: any) {
    console.log('Payment failed:', data);
    // Update subscription to past_due status
    if (data.subscriptionId) {
      await this.updateSubscriptionStatus(data.subscriptionId, 'past_due');
    }
  }
}

// Singleton instance
export const squareSubscriptionService = new SquareSubscriptionService();
