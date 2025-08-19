// FleetFlow Individual Professional Subscription Management Service
// Transforms FleetFlow from B2B to B2B2C platform with individual subscriptions

interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  billingCycle: 'monthly' | 'annual';
  features: string[];
  maxUsers?: number;
  description: string;
  popular?: boolean;
  targetRole:
    | 'dispatcher'
    | 'broker'
    | 'university'
    | 'ai-flow'
    | 'enterprise'
    | 'hybrid'
    | 'rfx';
}

interface UserSubscription {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  tenantId?: string; // Optional for individual subscriptions
  subscriptionTierId: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trial' | 'paused';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionUsage {
  userId: string;
  subscriptionId: string;
  apiCalls: number;
  loadsProcessed: number;
  documentsGenerated: number;
  aiInteractions: number;
  lastUsed: Date;
  monthlyLimits: {
    apiCalls: number;
    loadsProcessed: number;
    documentsGenerated: number;
    aiInteractions: number;
  };
}

export class SubscriptionManagementService {
  private static subscriptions = new Map<string, UserSubscription>();
  private static subscriptionTiers = new Map<string, SubscriptionTier>();
  private static usage = new Map<string, SubscriptionUsage>();

  // Define professional subscription tiers
  private static readonly SUBSCRIPTION_TIERS: SubscriptionTier[] = [
    {
      id: 'dispatcher-pro',
      name: 'Professional Dispatcher',
      price: 79,
      billingCycle: 'monthly',
      targetRole: 'dispatcher',
      description: 'Complete dispatch management with CRM and AI automation',
      popular: false,
      features: [
        'Complete dispatch management',
        'Driver assignment & tracking',
        'Route optimization',
        'CRM integration',
        'Basic AI automation',
        'Load management',
        'Real-time notifications',
        'Mobile app access',
      ],
    },
    {
      id: 'rfx-professional',
      name: 'RFx Professional',
      price: 119,
      billingCycle: 'monthly',
      targetRole: 'rfx',
      description: 'Government contracts and enterprise RFP discovery platform',
      popular: false,
      features: [
        'Government contract access',
        'Enterprise RFP discovery',
        'Instant Markets integration',
        'AI bid analysis',
        'Deadline tracking',
        'Competitive intelligence',
        'SAM.gov access',
        'Contract alerts',
        'Performance analytics',
      ],
    },
    {
      id: 'broker-elite',
      name: 'Professional Brokerage',
      price: 249,
      billingCycle: 'monthly',
      targetRole: 'broker',
      description: 'Advanced brokerage operations with business intelligence',
      popular: true,
      features: [
        'Advanced brokerage operations',
        'Load board management',
        'Load & customer management',
        'Revenue analytics dashboard',
        'AI-powered optimization',
        'Performance tracking',
        'Priority support',
        'Mobile app access',
      ],
    },
    {
      id: 'university-access',
      name: 'FleetFlow University℠',
      price: 49,
      billingCycle: 'monthly',
      targetRole: 'university',
      description: 'Professional transportation training and certification',
      features: [
        'Complete training curriculum',
        'BOL/MBL/HBL documentation',
        'Warehouse operations training',
        'Certification programs',
        'Industry best practices',
        'Progress tracking',
        'Instructor access',
        'Training materials library',
      ],
    },
    {
      id: 'ai-flow-pro',
      name: 'AI Flow Professional',
      price: 199,
      billingCycle: 'monthly',
      targetRole: 'ai-flow',
      description: 'Full AI platform with automation and intelligence',
      features: [
        'ai-flow.full_platform',
        'ai-flow.automation',
        'ai-flow.analytics',
        'ai-flow.api_access',
        'ai-flow.custom_workflows',
        'analytics.predictive',
        'rfx.ai_bidding',
      ],
    },
    {
      id: 'enterprise-module',
      name: 'Enterprise Professional',
      price: 2499,
      billingCycle: 'monthly',
      targetRole: 'enterprise',
      description: 'Complete FleetFlow platform access with enterprise support',
      features: [
        'Complete platform access',
        'FreightFlow RFx platform',
        'All premium features',
        'Advanced AI automation',
        'Priority support & training',
        'Custom integrations',
        'Dedicated account manager',
        'API access',
        'White-label options',
      ],
    },
    // À LA CARTE OPTIONS
    {
      id: 'alacarte-base',
      name: 'À La Carte Professional',
      price: 59, // Base platform access
      billingCycle: 'monthly',
      targetRole: 'hybrid',
      description:
        'Build your own subscription - professional base platform + add modules',
      features: [
        'Professional platform access',
        'Dashboard & analytics',
        'Basic notifications',
        'Mobile app access',
      ],
    },
    // Annual versions with discounts
    {
      id: 'dispatcher-pro-annual',
      name: 'Professional Dispatcher (Annual)',
      price: 790, // 2 months free ($79 x 10)
      billingCycle: 'annual',
      targetRole: 'dispatcher',
      description:
        'Professional Dispatcher with annual savings (2 months free)',
      features: [
        'Complete dispatch management',
        'Driver assignment & tracking',
        'Route optimization',
        'CRM integration',
        'Basic AI automation',
        'Load management',
        'Real-time notifications',
        'Mobile app access',
      ],
    },
    {
      id: 'rfx-professional-annual',
      name: 'RFx Professional (Annual)',
      price: 1190, // 2 months free
      billingCycle: 'annual',
      targetRole: 'rfx',
      description: 'RFx Professional with annual savings (2 months free)',
      features: [
        'rfx.government_contracts',
        'rfx.enterprise_rfps',
        'rfx.instant_markets',
        'rfx.ai_analysis',
        'rfx.deadline_tracking',
        'rfx.competitive_intelligence',
        'sam_gov.full_access',
        'notifications.contract_alerts',
        'analytics.rfx_performance',
      ],
    },
    {
      id: 'broker-elite-annual',
      name: 'Professional Brokerage (Annual)',
      price: 2490, // 2 months free ($249 x 10)
      billingCycle: 'annual',
      targetRole: 'broker',
      description: 'Professional Brokerage with annual savings (2 months free)',
      features: [
        'Advanced brokerage operations',
        'Load board management',
        'Load & customer management',
        'Revenue analytics dashboard',
        'AI-powered optimization',
        'Performance tracking',
        'Priority support',
        'Mobile app access',
      ],
    },
  ];

  // À la carte feature modules
  private static readonly ALACARTE_MODULES = [
    {
      id: 'dispatch-module',
      name: 'Dispatch Management',
      price: 99,
      description: 'Complete dispatch operations and driver management',
      features: [
        'Complete dispatch management',
        'Driver assignment & tracking',
        'Route optimization',
        'Load management',
      ],
    },
    {
      id: 'crm-module',
      name: 'CRM Suite',
      price: 79,
      description: 'Customer relationship management and sales pipeline',
      features: [
        'Customer management',
        'Sales pipeline',
        'Contact tracking',
        'Lead management',
      ],
    },
    {
      id: 'rfx-module',
      name: 'RFx Discovery (Enterprise Only)',
      price: 499,
      description:
        'Government contracts and enterprise RFP access - requires Enterprise tier',
      features: [
        'Government contract access',
        'Enterprise RFP discovery',
        'Instant Markets integration',
        'SAM.gov access',
      ],
    },
    {
      id: 'ai-basic-module',
      name: 'AI Flow Basic',
      price: 99,
      description: 'Essential AI automation and insights',
      features: ['Basic AI automation', 'Smart notifications', 'Analytics'],
    },
    {
      id: 'ai-advanced-module',
      name: 'AI Flow Advanced',
      price: 199,
      description: 'Advanced AI automation and predictive analytics',
      features: [
        'Advanced AI automation',
        'Custom workflows',
        'Predictive analytics',
        'AI bidding',
      ],
    },
    {
      id: 'broker-module',
      name: 'Broker Operations',
      price: 199,
      description: 'Complete freight brokerage operations',
      features: [
        'Brokerage operations',
        'Load management',
        'Customer management',
        'Revenue analytics',
      ],
    },
    {
      id: 'university-module',
      name: 'Training & Certification',
      price: 49,
      description: 'FleetFlow University access and certification',
      features: [
        'All training modules',
        'Certification programs',
        'Progress tracking',
      ],
    },
    {
      id: 'analytics-module',
      name: 'Advanced Analytics',
      price: 89,
      description: 'Business intelligence and performance metrics',
      features: [
        'Advanced analytics',
        'Performance metrics',
        'Custom reports',
        'Business intelligence',
      ],
    },
    {
      id: 'tracking-module',
      name: 'Real-Time Tracking',
      price: 69,
      description: 'Live load tracking and notifications',
      features: [
        'Real-time tracking',
        'Live notifications',
        'Geofencing',
        'GPS monitoring',
      ],
    },
    {
      id: 'api-module',
      name: 'API Access',
      price: 149,
      description: 'Developer API access and integrations',
      features: ['Full API access', 'Webhooks', 'Third-party integrations'],
    },
  ];

  static {
    // Initialize subscription tiers
    this.SUBSCRIPTION_TIERS.forEach((tier) => {
      this.subscriptionTiers.set(tier.id, tier);
    });
  }

  /**
   * Get all available subscription tiers
   */
  static getSubscriptionTiers(): SubscriptionTier[] {
    return Array.from(this.subscriptionTiers.values());
  }

  /**
   * Get subscription tier by ID
   */
  static getSubscriptionTier(tierId: string): SubscriptionTier | null {
    return this.subscriptionTiers.get(tierId) || null;
  }

  /**
   * Create new individual subscription
   */
  static async createSubscription(
    userId: string,
    userEmail: string,
    userName: string,
    tierId: string,
    paymentMethodId?: string
  ): Promise<UserSubscription> {
    const tier = this.getSubscriptionTier(tierId);
    if (!tier) {
      throw new Error(`Invalid subscription tier: ${tierId}`);
    }

    // Create 14-day trial period
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 14);

    const subscription: UserSubscription = {
      id: `sub_${Date.now()}_${userId.substring(0, 8)}`,
      userId,
      userEmail,
      userName,
      subscriptionTierId: tierId,
      status: 'trial',
      currentPeriodStart: new Date(),
      currentPeriodEnd: trialEnd,
      trialEnd,
      cancelAtPeriodEnd: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Initialize Stripe subscription if payment method provided
    if (paymentMethodId) {
      try {
        const stripeResult = await this.createStripeSubscription(
          userEmail,
          userName,
          tier,
          paymentMethodId
        );
        subscription.stripeCustomerId = stripeResult.customerId;
        subscription.stripeSubscriptionId = stripeResult.subscriptionId;
        subscription.status = 'active';
      } catch (error) {
        console.error('Stripe subscription creation failed:', error);
        // Continue with trial even if Stripe fails
      }
    }

    // Initialize usage tracking
    this.initializeUsageTracking(subscription);

    this.subscriptions.set(subscription.id, subscription);

    console.log(
      `✅ Created subscription ${subscription.id} for user ${userName} (${userEmail})`
    );
    console.log(`🎯 Tier: ${tier.name} - $${tier.price}/${tier.billingCycle}`);

    return subscription;
  }

  /**
   * Get user's active subscription
   */
  static getUserSubscription(userId: string): UserSubscription | null {
    for (const subscription of this.subscriptions.values()) {
      if (subscription.userId === userId && subscription.status === 'active') {
        return subscription;
      }
    }
    return null;
  }

  /**
   * Check if user has access to specific feature
   */
  static hasFeatureAccess(userId: string, feature: string): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return false;

    const tier = this.getSubscriptionTier(subscription.subscriptionTierId);
    if (!tier) return false;

    // Check for enterprise access (all features)
    if (tier.features.includes('all.features')) return true;

    // Check specific feature access
    return tier.features.includes(feature);
  }

  /**
   * Get user's feature permissions
   */
  static getUserPermissions(userId: string): string[] {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) return [];

    const tier = this.getSubscriptionTier(subscription.subscriptionTierId);
    if (!tier) return [];

    return tier.features;
  }

  /**
   * Upgrade/downgrade subscription
   */
  static async changeSubscription(
    userId: string,
    newTierId: string
  ): Promise<UserSubscription> {
    const currentSubscription = this.getUserSubscription(userId);
    if (!currentSubscription) {
      throw new Error('No active subscription found');
    }

    const newTier = this.getSubscriptionTier(newTierId);
    if (!newTier) {
      throw new Error(`Invalid subscription tier: ${newTierId}`);
    }

    // Update subscription
    currentSubscription.subscriptionTierId = newTierId;
    currentSubscription.updatedAt = new Date();

    // Update Stripe subscription if exists
    if (currentSubscription.stripeSubscriptionId) {
      await this.updateStripeSubscription(
        currentSubscription.stripeSubscriptionId,
        newTier
      );
    }

    console.log(
      `🔄 Updated subscription for user ${currentSubscription.userName} to ${newTier.name}`
    );

    return currentSubscription;
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(
    userId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<void> {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
    subscription.status = cancelAtPeriodEnd ? 'active' : 'cancelled';
    subscription.updatedAt = new Date();

    // Cancel Stripe subscription
    if (subscription.stripeSubscriptionId) {
      await this.cancelStripeSubscription(
        subscription.stripeSubscriptionId,
        cancelAtPeriodEnd
      );
    }

    console.log(
      `❌ ${cancelAtPeriodEnd ? 'Scheduled cancellation' : 'Cancelled'} subscription for ${subscription.userName}`
    );
  }

  /**
   * Get subscription analytics
   */
  static getSubscriptionAnalytics(): {
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRecurringRevenue: number;
    annualRecurringRevenue: number;
    tierBreakdown: Record<string, number>;
    churnRate: number;
  } {
    const subscriptions = Array.from(this.subscriptions.values());
    const activeSubscriptions = subscriptions.filter(
      (s) => s.status === 'active'
    );

    let mrr = 0;
    let arr = 0;
    const tierBreakdown: Record<string, number> = {};

    activeSubscriptions.forEach((subscription) => {
      const tier = this.getSubscriptionTier(subscription.subscriptionTierId);
      if (tier) {
        tierBreakdown[tier.name] = (tierBreakdown[tier.name] || 0) + 1;

        if (tier.billingCycle === 'monthly') {
          mrr += tier.price;
          arr += tier.price * 12;
        } else {
          const monthlyEquivalent = tier.price / 12;
          mrr += monthlyEquivalent;
          arr += tier.price;
        }
      }
    });

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlyRecurringRevenue: mrr,
      annualRecurringRevenue: arr,
      tierBreakdown,
      churnRate: this.calculateChurnRate(),
    };
  }

  /**
   * Initialize usage tracking for subscription
   */
  private static initializeUsageTracking(subscription: UserSubscription): void {
    const tier = this.getSubscriptionTier(subscription.subscriptionTierId);
    if (!tier) return;

    const usage: SubscriptionUsage = {
      userId: subscription.userId,
      subscriptionId: subscription.id,
      apiCalls: 0,
      loadsProcessed: 0,
      documentsGenerated: 0,
      aiInteractions: 0,
      lastUsed: new Date(),
      monthlyLimits: this.getUsageLimits(tier.id),
    };

    this.usage.set(subscription.userId, usage);
  }

  /**
   * Get usage limits based on tier
   */
  private static getUsageLimits(
    tierId: string
  ): SubscriptionUsage['monthlyLimits'] {
    const limits: Record<string, SubscriptionUsage['monthlyLimits']> = {
      'dispatcher-pro': {
        apiCalls: 10000,
        loadsProcessed: 500,
        documentsGenerated: 200,
        aiInteractions: 100,
      },
      'rfx-professional': {
        apiCalls: 10000,
        loadsProcessed: 500,
        documentsGenerated: 200,
        aiInteractions: 100,
      },
      'broker-elite': {
        apiCalls: 25000,
        loadsProcessed: 1000,
        documentsGenerated: 500,
        aiInteractions: 300,
      },
      'university-access': {
        apiCalls: 1000,
        loadsProcessed: 0,
        documentsGenerated: 50,
        aiInteractions: 50,
      },
      'ai-flow-pro': {
        apiCalls: 50000,
        loadsProcessed: 2000,
        documentsGenerated: 1000,
        aiInteractions: 1000,
      },
      'enterprise-module': {
        apiCalls: -1, // Unlimited
        loadsProcessed: -1,
        documentsGenerated: -1,
        aiInteractions: -1,
      },
      'alacarte-base': {
        apiCalls: 1000,
        loadsProcessed: 50,
        documentsGenerated: 20,
        aiInteractions: 50,
      },
    };

    return limits[tierId] || limits['dispatcher-pro'];
  }

  /**
   * Create Stripe subscription (placeholder)
   */
  private static async createStripeSubscription(
    email: string,
    name: string,
    tier: SubscriptionTier,
    paymentMethodId: string
  ): Promise<{ customerId: string; subscriptionId: string }> {
    // This would integrate with actual Stripe API
    console.log(
      `Creating Stripe subscription for ${name} (${email}) - ${tier.name}`
    );

    return {
      customerId: `cus_${Date.now()}`,
      subscriptionId: `sub_${Date.now()}`,
    };
  }

  /**
   * Update Stripe subscription (placeholder)
   */
  private static async updateStripeSubscription(
    subscriptionId: string,
    newTier: SubscriptionTier
  ): Promise<void> {
    console.log(
      `Updating Stripe subscription ${subscriptionId} to ${newTier.name}`
    );
  }

  /**
   * Cancel Stripe subscription (placeholder)
   */
  private static async cancelStripeSubscription(
    subscriptionId: string,
    atPeriodEnd: boolean
  ): Promise<void> {
    console.log(
      `Cancelling Stripe subscription ${subscriptionId} ${atPeriodEnd ? 'at period end' : 'immediately'}`
    );
  }

  /**
   * Calculate churn rate
   */
  private static calculateChurnRate(): number {
    // Simplified churn calculation - would be more sophisticated in production
    const subscriptions = Array.from(this.subscriptions.values());
    const cancelled = subscriptions.filter(
      (s) => s.status === 'cancelled'
    ).length;

    return subscriptions.length > 0
      ? (cancelled / subscriptions.length) * 100
      : 0;
  }

  /**
   * Get trial status for user
   */
  static getTrialStatus(userId: string): {
    isInTrial: boolean;
    daysRemaining: number;
    trialEnd?: Date;
  } {
    const subscription = this.getUserSubscription(userId);

    if (!subscription || !subscription.trialEnd) {
      return { isInTrial: false, daysRemaining: 0 };
    }

    const now = new Date();
    const trialEnd = subscription.trialEnd;
    const daysRemaining = Math.max(
      0,
      Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    );

    return {
      isInTrial: subscription.status === 'trial' && now < trialEnd,
      daysRemaining,
      trialEnd,
    };
  }

  /**
   * Get à la carte modules
   */
  static getAlacarteModules() {
    return this.ALACARTE_MODULES;
  }

  /**
   * Calculate à la carte subscription price
   */
  static calculateAlacartePrice(selectedModules: string[]): number {
    const basePrice = 59; // À la carte professional base
    const modulePrice = selectedModules.reduce((total, moduleId) => {
      const module = this.ALACARTE_MODULES.find((m) => m.id === moduleId);
      return total + (module ? module.price : 0);
    }, 0);
    return basePrice + modulePrice;
  }

  /**
   * Create à la carte subscription
   */
  static async createAlacarteSubscription(
    userId: string,
    userEmail: string,
    userName: string,
    selectedModules: string[],
    paymentMethodId?: string
  ): Promise<UserSubscription> {
    const price = this.calculateAlacartePrice(selectedModules);
    const features = [
      'platform.basic_access',
      'dashboard.view',
      'notifications.basic',
    ];

    // Add features from selected modules
    selectedModules.forEach((moduleId) => {
      const module = this.ALACARTE_MODULES.find((m) => m.id === moduleId);
      if (module) {
        features.push(...module.features);
      }
    });

    // Create custom tier for this à la carte subscription
    const customTier: SubscriptionTier = {
      id: `alacarte-${Date.now()}`,
      name: 'À La Carte Custom',
      price,
      billingCycle: 'monthly',
      targetRole: 'hybrid',
      description: `Custom subscription with ${selectedModules.length} modules`,
      features,
    };

    // Store custom tier temporarily
    this.subscriptionTiers.set(customTier.id, customTier);

    return this.createSubscription(
      userId,
      userEmail,
      userName,
      customTier.id,
      paymentMethodId
    );
  }

  /**
   * Get subscription recommendations including à la carte options
   */
  static getSubscriptionRecommendations(attemptedFeatures: string[]): {
    prebuiltRecommendation: string;
    alacarteOption: {
      modules: string[];
      totalPrice: number;
      savings: number;
    };
    reasoning: string;
  } {
    // Analyze features to recommend modules
    const recommendedModules: string[] = [];
    let prebuiltTier = 'Dispatcher Pro';

    if (attemptedFeatures.some((f) => f.startsWith('dispatch.'))) {
      recommendedModules.push('dispatch-module');
    }
    if (attemptedFeatures.some((f) => f.startsWith('crm.'))) {
      recommendedModules.push('crm-module');
    }
    if (attemptedFeatures.some((f) => f.startsWith('rfx.'))) {
      recommendedModules.push('rfx-module');
      prebuiltTier = 'RFx Professional';
    }
    if (attemptedFeatures.some((f) => f.startsWith('broker.'))) {
      recommendedModules.push('broker-module');
      prebuiltTier = 'Broker Elite';
    }
    if (attemptedFeatures.some((f) => f.startsWith('ai-flow.'))) {
      recommendedModules.push('ai-basic-module');
    }
    if (attemptedFeatures.some((f) => f.includes('analytics'))) {
      recommendedModules.push('analytics-module');
    }

    const alacartePrice = this.calculateAlacartePrice(recommendedModules);
    const prebuiltPrice =
      this.getSubscriptionTier(prebuiltTier.toLowerCase().replace(' ', '-'))
        ?.price || 99;
    const savings = Math.max(0, prebuiltPrice - alacartePrice);

    return {
      prebuiltRecommendation: prebuiltTier,
      alacarteOption: {
        modules: recommendedModules,
        totalPrice: alacartePrice,
        savings,
      },
      reasoning:
        savings > 0
          ? `Save $${savings}/month with à la carte vs ${prebuiltTier}`
          : `${prebuiltTier} offers better value with additional features`,
    };
  }
}

export type { SubscriptionTier, SubscriptionUsage, UserSubscription };
