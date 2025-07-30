// Enhanced Access Control Service - Hybrid B2B2C Platform Support
// Supports both enterprise tenants and individual professional subscriptions

import {
  SubscriptionManagementService,
  UserSubscription,
} from './SubscriptionManagementService';

export interface UserContext {
  userId: string;
  userEmail: string;
  userName: string;
  userType: 'enterprise' | 'individual' | 'trial';
  tenantId?: string; // For enterprise users
  subscriptionId?: string; // For individual subscribers
  role: string;
  permissions: string[];
  isActive: boolean;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  recommendedTier?: string;
  trialStatus?: {
    isInTrial: boolean;
    daysRemaining: number;
  };
}

export class EnhancedAccessControlService {
  private static userContextCache = new Map<string, UserContext>();

  /**
   * Get comprehensive user context for access control
   */
  static async getUserContext(userId: string): Promise<UserContext | null> {
    // Check cache first
    if (this.userContextCache.has(userId)) {
      return this.userContextCache.get(userId)!;
    }

    // Check for individual subscription first
    const subscription =
      SubscriptionManagementService.getUserSubscription(userId);
    if (subscription) {
      const context = await this.createSubscriptionContext(subscription);
      this.userContextCache.set(userId, context);
      return context;
    }

    // Check for enterprise tenant access
    const enterpriseContext = await this.checkEnterpriseAccess(userId);
    if (enterpriseContext) {
      this.userContextCache.set(userId, enterpriseContext);
      return enterpriseContext;
    }

    // No access found
    return null;
  }

  /**
   * Check if user has access to specific feature
   */
  static async hasFeatureAccess(
    userId: string,
    feature: string
  ): Promise<AccessCheckResult> {
    const userContext = await this.getUserContext(userId);

    if (!userContext) {
      return {
        hasAccess: false,
        reason: 'No active subscription or enterprise access found',
        upgradeRequired: true,
        recommendedTier: this.getRecommendedTier(feature),
      };
    }

    // Check if user is active
    if (!userContext.isActive) {
      return {
        hasAccess: false,
        reason: 'Account is inactive or suspended',
        upgradeRequired: true,
      };
    }

    // Individual subscription access
    if (
      userContext.userType === 'individual' ||
      userContext.userType === 'trial'
    ) {
      return this.checkSubscriptionAccess(userContext, feature);
    }

    // Enterprise tenant access
    if (userContext.userType === 'enterprise') {
      return this.checkEnterpriseFeatureAccess(userContext, feature);
    }

    return {
      hasAccess: false,
      reason: 'Unknown user type',
    };
  }

  /**
   * Get user's available features and permissions
   */
  static async getUserPermissions(userId: string): Promise<{
    permissions: string[];
    userType: 'enterprise' | 'individual' | 'trial';
    subscriptionTier?: string;
    trialStatus?: { isInTrial: boolean; daysRemaining: number };
  }> {
    const userContext = await this.getUserContext(userId);

    if (!userContext) {
      return {
        permissions: [],
        userType: 'trial',
        trialStatus: { isInTrial: false, daysRemaining: 0 },
      };
    }

    const result = {
      permissions: userContext.permissions,
      userType: userContext.userType as 'enterprise' | 'individual' | 'trial',
      subscriptionTier: undefined as string | undefined,
      trialStatus: undefined as
        | { isInTrial: boolean; daysRemaining: number }
        | undefined,
    };

    // Add subscription-specific info
    if (userContext.subscriptionId) {
      const subscription =
        SubscriptionManagementService.getUserSubscription(userId);
      if (subscription) {
        const tier = SubscriptionManagementService.getSubscriptionTier(
          subscription.subscriptionTierId
        );
        result.subscriptionTier = tier?.name;
        result.trialStatus =
          SubscriptionManagementService.getTrialStatus(userId);
      }
    }

    return result;
  }

  /**
   * Create access control middleware for API routes
   */
  static createAccessMiddleware(requiredFeature: string) {
    return async (
      userId: string
    ): Promise<{
      allowed: boolean;
      context?: UserContext;
      message?: string;
    }> => {
      const accessResult = await this.hasFeatureAccess(userId, requiredFeature);
      const userContext = await this.getUserContext(userId);

      if (!accessResult.hasAccess) {
        return {
          allowed: false,
          message: accessResult.reason || 'Access denied',
          context: userContext || undefined,
        };
      }

      return {
        allowed: true,
        context: userContext || undefined,
      };
    };
  }

  /**
   * Get subscription recommendations based on feature usage
   */
  static getSubscriptionRecommendations(
    userId: string,
    attemptedFeatures: string[]
  ): {
    recommendedTier: string;
    reasoning: string;
    monthlyValue: number;
    features: string[];
  } {
    // Analyze which features user is trying to access
    const featureCategories = this.categorizeFeatures(attemptedFeatures);

    // Dispatcher workflow
    if (featureCategories.dispatch >= 3 && featureCategories.crm >= 2) {
      return {
        recommendedTier: 'Dispatcher Pro',
        reasoning:
          'Based on your dispatch and CRM usage, Dispatcher Pro would unlock all the tools you need.',
        monthlyValue: 99,
        features: [
          'Complete dispatch management',
          'CRM access',
          'AI Flow basic features',
          'Real-time tracking',
          'Training modules',
        ],
      };
    }

    // Broker workflow
    if (featureCategories.broker >= 2 || featureCategories.rfx >= 1) {
      return {
        recommendedTier: 'Broker Elite',
        reasoning:
          'Your broker operations and RFx activity suggest Broker Elite would maximize your revenue potential.',
        monthlyValue: 149,
        features: [
          'Advanced broker operations',
          'FreightFlow RFx access',
          'Revenue analytics',
          'AI-powered insights',
          'Customer management',
        ],
      };
    }

    // AI-heavy usage
    if (featureCategories.ai >= 3) {
      return {
        recommendedTier: 'AI Flow Professional',
        reasoning:
          'Your AI feature usage indicates AI Flow Pro would give you the automation you need.',
        monthlyValue: 199,
        features: [
          'Full AI platform access',
          'Custom automation workflows',
          'Predictive analytics',
          'API access',
          'Advanced AI interactions',
        ],
      };
    }

    // Default recommendation
    return {
      recommendedTier: 'Dispatcher Pro',
      reasoning:
        'Start with our most popular tier for transportation professionals.',
      monthlyValue: 99,
      features: [
        'Essential dispatch tools',
        'CRM access',
        'Basic AI features',
        'Training modules',
      ],
    };
  }

  /**
   * Create user context from subscription
   */
  private static async createSubscriptionContext(
    subscription: UserSubscription
  ): Promise<UserContext> {
    const permissions = SubscriptionManagementService.getUserPermissions(
      subscription.userId
    );

    return {
      userId: subscription.userId,
      userEmail: subscription.userEmail,
      userName: subscription.userName,
      userType: subscription.status === 'trial' ? 'trial' : 'individual',
      subscriptionId: subscription.id,
      role: this.getRoleFromSubscription(subscription.subscriptionTierId),
      permissions,
      isActive: ['active', 'trial'].includes(subscription.status),
    };
  }

  /**
   * Check enterprise access (existing system)
   */
  private static async checkEnterpriseAccess(
    userId: string
  ): Promise<UserContext | null> {
    // This would integrate with your existing enterprise user system
    // For now, return null to focus on subscription system
    // In production, this would check your tenant-based user system

    // Example of what this might look like:
    /*
    const enterpriseUser = await EnterpriseUserService.getUser(userId);
    if (enterpriseUser && enterpriseUser.tenant) {
      return {
        userId,
        userEmail: enterpriseUser.email,
        userName: enterpriseUser.name,
        userType: 'enterprise',
        tenantId: enterpriseUser.tenantId,
        role: enterpriseUser.role,
        permissions: await this.getEnterprisePermissions(enterpriseUser),
        isActive: enterpriseUser.status === 'active'
      };
    }
    */

    return null;
  }

  /**
   * Check subscription-based access
   */
  private static checkSubscriptionAccess(
    userContext: UserContext,
    feature: string
  ): AccessCheckResult {
    const hasPermission = userContext.permissions.includes(feature);

    if (hasPermission) {
      return { hasAccess: true };
    }

    // Get trial status for trial users
    const trialStatus =
      userContext.userType === 'trial'
        ? SubscriptionManagementService.getTrialStatus(userContext.userId)
        : { isInTrial: false, daysRemaining: 0 };

    return {
      hasAccess: false,
      reason: `Feature "${feature}" not included in your subscription`,
      upgradeRequired: true,
      recommendedTier: this.getRecommendedTier(feature),
      trialStatus,
    };
  }

  /**
   * Check enterprise feature access
   */
  private static checkEnterpriseFeatureAccess(
    userContext: UserContext,
    feature: string
  ): AccessCheckResult {
    // This would use your existing enterprise access control logic
    const hasPermission = userContext.permissions.includes(feature);

    return {
      hasAccess: hasPermission,
      reason: hasPermission
        ? undefined
        : 'Feature not available in your enterprise plan',
    };
  }

  /**
   * Get recommended tier for specific feature
   */
  private static getRecommendedTier(feature: string): string {
    const featureTierMap: Record<string, string> = {
      // Dispatch features
      'dispatch.view': 'Dispatcher Pro',
      'dispatch.create': 'Dispatcher Pro',
      'dispatch.assign_drivers': 'Dispatcher Pro',
      'dispatch.edit_rates': 'Dispatcher Pro',

      // Broker features
      'broker.view': 'Broker Elite',
      'broker.create_loads': 'Broker Elite',
      'broker.rfx_center': 'Broker Elite',
      'analytics.revenue': 'Broker Elite',

      // AI features
      'ai-flow.full_platform': 'AI Flow Professional',
      'ai-flow.automation': 'AI Flow Professional',
      'ai-flow.custom_workflows': 'AI Flow Professional',

      // University features
      'university.all_modules': 'FleetFlow University℠',
      'university.certification': 'FleetFlow University℠',

      // Enterprise features
      'all.features': 'Enterprise Professional',
      'financials.full_access': 'Enterprise Professional',
    };

    return featureTierMap[feature] || 'Dispatcher Pro';
  }

  /**
   * Get role from subscription tier
   */
  private static getRoleFromSubscription(subscriptionTierId: string): string {
    const roleMap: Record<string, string> = {
      'dispatcher-pro': 'Dispatcher',
      'dispatcher-pro-annual': 'Dispatcher',
      'broker-elite': 'Broker',
      'broker-elite-annual': 'Broker',
      'university-access': 'Student',
      'ai-flow-pro': 'AI User',
      'enterprise-module': 'Professional',
    };

    return roleMap[subscriptionTierId] || 'User';
  }

  /**
   * Categorize features for recommendation engine
   */
  private static categorizeFeatures(
    features: string[]
  ): Record<string, number> {
    const categories = {
      dispatch: 0,
      broker: 0,
      crm: 0,
      ai: 0,
      analytics: 0,
      university: 0,
      rfx: 0,
    };

    features.forEach((feature) => {
      if (feature.startsWith('dispatch.')) categories.dispatch++;
      if (feature.startsWith('broker.')) categories.broker++;
      if (feature.startsWith('crm.')) categories.crm++;
      if (feature.startsWith('ai-flow.')) categories.ai++;
      if (feature.startsWith('analytics.')) categories.analytics++;
      if (feature.startsWith('university.')) categories.university++;
      if (feature.includes('rfx')) categories.rfx++;
    });

    return categories;
  }

  /**
   * Clear user context cache (useful for subscription changes)
   */
  static clearUserCache(userId: string): void {
    this.userContextCache.delete(userId);
  }

  /**
   * Clear all cache (useful for system updates)
   */
  static clearAllCache(): void {
    this.userContextCache.clear();
  }

  /**
   * Get access control statistics
   */
  static getAccessControlStats(): {
    totalUsers: number;
    enterpriseUsers: number;
    individualSubscribers: number;
    trialUsers: number;
    cacheSize: number;
  } {
    const contexts = Array.from(this.userContextCache.values());

    return {
      totalUsers: contexts.length,
      enterpriseUsers: contexts.filter((c) => c.userType === 'enterprise')
        .length,
      individualSubscribers: contexts.filter((c) => c.userType === 'individual')
        .length,
      trialUsers: contexts.filter((c) => c.userType === 'trial').length,
      cacheSize: this.userContextCache.size,
    };
  }
}

export type { AccessCheckResult, UserContext };
