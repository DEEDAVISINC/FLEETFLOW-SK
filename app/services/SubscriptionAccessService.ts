/**
 * Subscription Access Service
 * Provides easy-to-use functions for checking subscription-based access throughout the application
 * Integrates with Square subscription service and role-based access control
 */

import { getCurrentUser, PageSectionPermissions } from '../config/access';
import { getPlanById, SubscriptionPlan } from '../config/subscription-plans';
import {
  squareSubscriptionService,
  UserSubscriptionInfo,
} from './SquareSubscriptionService';

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: string;
  upgradeRequired?: boolean;
  suggestedPlans?: SubscriptionPlan[];
}

export interface UsageCheckResult {
  withinLimit: boolean;
  currentUsage: number;
  limit: number;
  percentUsed: number;
  warningThreshold?: boolean; // true if > 80% used
}

export class SubscriptionAccessService {
  /**
   * Check if current user has access to a specific page
   */
  async checkPageAccess(pagePath: string): Promise<AccessCheckResult> {
    const { user } = getCurrentUser();

    if (!user) {
      return {
        hasAccess: false,
        reason: 'User not authenticated',
      };
    }

    // Admins always have access
    if (user.role === 'admin') {
      return { hasAccess: true };
    }

    // Check subscription status
    const subscriptionInfo =
      await squareSubscriptionService.getUserSubscriptionInfo(user.id);

    if (!subscriptionInfo) {
      return {
        hasAccess: false,
        reason: 'No active subscription found',
        upgradeRequired: true,
        suggestedPlans: this.getSuggestedPlans(pagePath),
      };
    }

    // Check if user has access to the specific page
    const hasAccess = await squareSubscriptionService.hasPageAccess(
      user.id,
      pagePath
    );

    if (!hasAccess) {
      return {
        hasAccess: false,
        reason: `Page '${pagePath}' not included in current subscription`,
        upgradeRequired: true,
        suggestedPlans: this.getSuggestedPlans(pagePath),
      };
    }

    return { hasAccess: true };
  }

  /**
   * Check if current user has access to a specific feature
   */
  async checkFeatureAccess(featureName: string): Promise<AccessCheckResult> {
    const { user } = getCurrentUser();

    if (!user) {
      return {
        hasAccess: false,
        reason: 'User not authenticated',
      };
    }

    // Admins always have access
    if (user.role === 'admin') {
      return { hasAccess: true };
    }

    // Check subscription status
    const subscriptionInfo =
      await squareSubscriptionService.getUserSubscriptionInfo(user.id);

    if (!subscriptionInfo) {
      return {
        hasAccess: false,
        reason: 'No active subscription found',
        upgradeRequired: true,
      };
    }

    // Check if feature is restricted
    const hasAccess = await squareSubscriptionService.hasFeatureAccess(
      user.id,
      featureName
    );

    if (!hasAccess) {
      return {
        hasAccess: false,
        reason: `Feature '${featureName}' not included in current subscription`,
        upgradeRequired: true,
        suggestedPlans: this.getSuggestedPlansForFeature(featureName),
      };
    }

    return { hasAccess: true };
  }

  /**
   * Check specific section permissions
   */
  async checkSectionAccess(
    section: keyof PageSectionPermissions,
    permission: string
  ): Promise<AccessCheckResult> {
    const { user, permissions } = getCurrentUser();

    if (!user) {
      return {
        hasAccess: false,
        reason: 'User not authenticated',
      };
    }

    const sectionPermissions = permissions[section];
    const hasAccess = (sectionPermissions as any)[permission] === true;

    if (!hasAccess) {
      const subscriptionInfo =
        await squareSubscriptionService.getUserSubscriptionInfo(user.id);
      return {
        hasAccess: false,
        reason: `Permission '${permission}' in section '${section}' not available`,
        upgradeRequired:
          !subscriptionInfo || subscriptionInfo.subscriptions.length === 0,
        suggestedPlans: this.getSuggestedPlansForPermission(
          section,
          permission
        ),
      };
    }

    return { hasAccess: true };
  }

  /**
   * Check usage limits (users, storage, API calls)
   */
  async checkUsageLimit(
    limitType: 'users' | 'storage' | 'apiCalls',
    currentValue: number
  ): Promise<UsageCheckResult> {
    const { user } = getCurrentUser();

    if (!user) {
      return {
        withinLimit: false,
        currentUsage: currentValue,
        limit: 0,
        percentUsed: 100,
      };
    }

    // Admins have unlimited access
    if (user.role === 'admin') {
      return {
        withinLimit: true,
        currentUsage: currentValue,
        limit: Number.MAX_SAFE_INTEGER,
        percentUsed: 0,
      };
    }

    const limitCheck = await squareSubscriptionService.checkUsageLimit(
      user.id,
      limitType,
      currentValue
    );
    const percentUsed =
      limitCheck.limit > 0 ? (currentValue / limitCheck.limit) * 100 : 100;

    return {
      withinLimit: limitCheck.withinLimit,
      currentUsage: currentValue,
      limit: limitCheck.limit,
      percentUsed: Math.round(percentUsed * 100) / 100,
      warningThreshold: percentUsed > 80,
    };
  }

  /**
   * Get current user's subscription information
   */
  async getCurrentSubscriptionInfo(): Promise<UserSubscriptionInfo | null> {
    const { user } = getCurrentUser();

    if (!user) {
      return null;
    }

    return await squareSubscriptionService.getUserSubscriptionInfo(user.id);
  }

  /**
   * Check if subscription is expiring soon (within 7 days)
   */
  async checkSubscriptionExpiry(): Promise<{
    isExpiringSoon: boolean;
    daysUntilExpiry?: number;
    isInTrial?: boolean;
  }> {
    const { user } = getCurrentUser();

    if (!user || user.role === 'admin') {
      return { isExpiringSoon: false };
    }

    const subscriptionInfo =
      await squareSubscriptionService.getUserSubscriptionInfo(user.id);

    if (!subscriptionInfo || subscriptionInfo.subscriptions.length === 0) {
      return { isExpiringSoon: false };
    }

    const activeSubscription = subscriptionInfo.subscriptions[0];
    const now = new Date();
    const expiry = new Date(activeSubscription.currentPeriodEnd);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      isExpiringSoon: daysUntilExpiry <= 7,
      daysUntilExpiry: Math.max(0, daysUntilExpiry),
      isInTrial: activeSubscription.status === 'trial',
    };
  }

  /**
   * Get suggested plans for a specific page
   */
  private getSuggestedPlans(pagePath: string): SubscriptionPlan[] {
    const suggestions: SubscriptionPlan[] = [];

    // Map pages to suggested plans (updated to match /plans page)
    const pageToPlans: Record<string, string[]> = {
      '/dispatch-central': [
        'professional_dispatcher',
        'professional_brokerage',
      ],
      '/broker-box': ['professional_brokerage', 'enterprise'],
      '/university': ['university'], // FleetFlow University℠
      '/ai-flow': [
        'ai_flow_starter_addon',
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise', // Enterprise includes AI Flow
      ], // AI Flow available as add-ons + included in enterprise
      '/ai-hub': [
        'ai_flow_starter_addon',
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise',
      ],
      '/analytics': ['professional_brokerage', 'enterprise'],
      '/dialer': ['professional_brokerage', 'enterprise'], // Phone features included
      '/phone': ['phone-professional', 'phone-enterprise'], // Phone add-ons
    };

    const planIds = pageToPlans[pagePath] || ['enterprise'];

    planIds.forEach((planId) => {
      const plan = getPlanById(planId);
      if (plan) {
        suggestions.push(plan);
      }
    });

    return suggestions;
  }

  /**
   * Get suggested plans for a specific feature
   */
  private getSuggestedPlansForFeature(featureName: string): SubscriptionPlan[] {
    const suggestions: SubscriptionPlan[] = [];

    // Map features to suggested plans (enterprise now includes AI Flow)
    const featureToPlans: Record<string, string[]> = {
      analytics: ['professional_brokerage', 'enterprise'],
      financials: ['professional_brokerage', 'enterprise'],
      api_access: ['ai_flow_professional_addon', 'enterprise'],
      advanced_reporting: [
        'professional_brokerage',
        'ai_flow_professional_addon',
        'enterprise',
      ],
      ai_automation: [
        'ai_flow_starter_addon',
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise', // Enterprise includes AI Flow
      ],
      ai_workflows: [
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise',
      ],
      ai_review_system: [
        'ai_flow_starter_addon',
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise',
      ],
      machine_learning: [
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise',
      ],
      predictive_analytics: [
        'ai_flow_professional_addon',
        'ai_flow_enterprise_addon',
        'enterprise',
      ],
      custom_ai_models: [
        'ai_flow_enterprise_addon',
        'ai_flow_usage_addon',
        'enterprise_custom',
      ],
      white_label_ai: ['ai_flow_enterprise_addon', 'enterprise_custom'],
    };

    const planIds = featureToPlans[featureName] || ['enterprise'];

    planIds.forEach((planId) => {
      const plan = getPlanById(planId);
      if (plan) {
        suggestions.push(plan);
      }
    });

    return suggestions;
  }

  /**
   * Get suggested plans for a specific permission
   */
  private getSuggestedPlansForPermission(
    section: keyof PageSectionPermissions,
    permission: string
  ): SubscriptionPlan[] {
    const suggestions: SubscriptionPlan[] = [];

    // Map permission combinations to suggested plans (updated for corrected plan IDs)
    if (section === 'analytics') {
      suggestions.push(
        ...(['professional_brokerage', 'ai_flow_professional', 'enterprise']
          .map((id) => getPlanById(id))
          .filter(Boolean) as SubscriptionPlan[])
      );
    } else if (section === 'financials') {
      suggestions.push(
        ...(['professional_brokerage', 'enterprise']
          .map((id) => getPlanById(id))
          .filter(Boolean) as SubscriptionPlan[])
      );
    } else if (section === 'dispatchCentral') {
      suggestions.push(
        ...(['professional_dispatcher', 'enterprise']
          .map((id) => getPlanById(id))
          .filter(Boolean) as SubscriptionPlan[])
      );
    } else if (section === 'brokerBox') {
      suggestions.push(
        ...(['professional_brokerage', 'enterprise']
          .map((id) => getPlanById(id))
          .filter(Boolean) as SubscriptionPlan[])
      );
    } else {
      // Default to enterprise (includes AI Flow)
      const plan = getPlanById('enterprise');
      if (plan) {
        suggestions.push(plan);
      }
    }

    return suggestions;
  }

  /**
   * Create upgrade notification message
   */
  createUpgradeMessage(accessResult: AccessCheckResult): string {
    if (!accessResult.upgradeRequired || !accessResult.suggestedPlans?.length) {
      return 'Access denied.';
    }

    const planNames = accessResult.suggestedPlans.map((p) => p.name).join(', ');
    return `${accessResult.reason} Consider upgrading to: ${planNames}`;
  }

  /**
   * Get usage warning message
   */
  createUsageWarningMessage(
    usageResult: UsageCheckResult,
    limitType: string
  ): string | null {
    if (!usageResult.warningThreshold) {
      return null;
    }

    const limitName =
      {
        users: 'user limit',
        storage: 'storage limit',
        apiCalls: 'API call limit',
      }[limitType] || 'usage limit';

    return `Warning: You've used ${usageResult.percentUsed}% of your ${limitName}. Consider upgrading your plan to avoid service interruption.`;
  }
}

// Singleton instance
export const subscriptionAccessService = new SubscriptionAccessService();

// Convenience functions for easy access throughout the app
export const checkPageAccess = (pagePath: string) =>
  subscriptionAccessService.checkPageAccess(pagePath);

export const checkFeatureAccess = (featureName: string) =>
  subscriptionAccessService.checkFeatureAccess(featureName);

export const checkSectionAccess = (
  section: keyof PageSectionPermissions,
  permission: string
) => subscriptionAccessService.checkSectionAccess(section, permission);

export const checkUsageLimit = (
  limitType: 'users' | 'storage' | 'apiCalls',
  currentValue: number
) => subscriptionAccessService.checkUsageLimit(limitType, currentValue);

export const getCurrentSubscriptionInfo = () =>
  subscriptionAccessService.getCurrentSubscriptionInfo();

export const checkSubscriptionExpiry = () =>
  subscriptionAccessService.checkSubscriptionExpiry();
