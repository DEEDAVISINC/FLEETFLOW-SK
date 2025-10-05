/**
 * Enhanced Flowter AI with Intelligent Search & Navigation
 * Combines general AI assistance with smart search and navigation capabilities
 */

import { getCurrentUser } from '../config/access';
import {
  FlowterIntelligentSearch,
  FlowterSearchResults,
  FlowterSecurityContext,
} from './FlowterIntelligentSearch';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface FlowterResponse {
  type:
    | 'NAVIGATION'
    | 'SELECTION'
    | 'UPGRADE_REQUIRED'
    | 'SEARCH_HELP'
    | 'GENERAL_AI'
    | 'SUBSCRIPTION_HELP'
    | 'ERROR';
  message: string;
  actions?: FlowterAction[];
  options?: SelectionOption[];
  upgradeInfo?: string;
  restrictedFeatures?: any[];
  suggestions?: string[];
  quickHelp?: string[];
  helpText?: string;
  subscriptionInfo?: {
    currentPlan?: string;
    recommendedPlan?: string;
    pricing?: number;
    features?: string[];
    savings?: number;
  };
  metadata?: {
    searchResults?: boolean;
    navigationReady?: boolean;
    requiresPermission?: string[];
    subscriptionTier?: string;
    subscriptionHelp?: boolean;
  };
}

export interface FlowterAction {
  type: 'navigate' | 'action' | 'help';
  label: string;
  url?: string;
  action?: string;
  description: string;
  icon: string;
  severity?: 'info' | 'warning' | 'error';
  requiredTier?: string;
  requiredRoles?: string[];
}

export interface SelectionOption {
  label: string;
  description: string;
  action: string;
  relevanceScore?: number;
  icon?: string;
}

export interface FlowterMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: string;
  actions?: FlowterAction[];
}

// ============================================================================
// ENHANCED FLOWTER AI
// ============================================================================

export class EnhancedFlowterAI {
  private searchEngine: FlowterIntelligentSearch;
  private conversationHistory: FlowterMessage[] = [];

  // Search indicators to detect navigation/search requests
  private readonly SEARCH_INDICATORS = [
    'find',
    'search',
    'look for',
    'where is',
    'how do i',
    'how to',
    'take me to',
    'go to',
    'navigate to',
    'show me',
    'open',
    'i need to',
    'help with',
    'want to',
    'access',
    'get to',
    // Subscription-related keywords
    'subscription',
    'billing',
    'payment',
    'pricing',
    'plan',
    'upgrade',
    'downgrade',
    'cancel',
    'cost',
    'price',
    'fee',
    'charge',
    'invoice',
    'receipt',
    'trial',
    'account',
    'membership',
  ];

  // Help indicators for tutorial/guidance requests
  private readonly HELP_INDICATORS = [
    'help',
    'tutorial',
    'guide',
    'how to',
    'how do i',
    'explain',
    'what is',
    'teach me',
    'learn',
    'training',
    'instructions',
    // Subscription help keywords
    'tell me about',
    'explain',
    'what does',
    'how much',
    'what costs',
    'compare',
    'difference between',
    'vs',
    'versus',
    'which plan',
    'best for',
    'recommend',
  ];

  constructor() {
    this.searchEngine = new FlowterIntelligentSearch();
    console.info('🤖 Enhanced Flowter AI initialized with search capabilities');
  }

  // ============================================================================
  // MAIN QUERY HANDLER
  // ============================================================================

  async handleUserQuery(
    message: string,
    context?: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    console.info(`🤖 Flowter AI processing: "${message}"`);

    try {
      // Get user context if not provided
      const userContext = context || (await this.getUserContext());

      // Add to conversation history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date().toLocaleTimeString(),
      });

      // Step 1: Determine if this is a search/navigation request
      if (this.isSearchQuery(message)) {
        console.info('🔍 Detected search/navigation request');
        const searchResults = await this.searchEngine.search(
          message,
          userContext
        );
        const response = await this.formatSearchResponse(
          searchResults,
          message
        );
        this.addAssistantMessage(
          response.message,
          response.type,
          response.actions
        );
        return response;
      }

      // Step 2: Check if this is a subscription-related query
      if (this.isSubscriptionQuery(message)) {
        console.info('💳 Detected subscription-related query');
        const subscriptionResponse = await this.handleSubscriptionQuery(
          message,
          userContext
        );
        this.addAssistantMessage(
          subscriptionResponse.message,
          subscriptionResponse.type
        );
        return subscriptionResponse;
      }

      // Step 3: Check if this is a help/tutorial request
      if (this.isHelpQuery(message)) {
        console.info('❓ Detected help/tutorial request');
        const helpResponse = await this.handleHelpQuery(message, userContext);
        this.addAssistantMessage(helpResponse.message, helpResponse.type);
        return helpResponse;
      }

      // Step 4: Handle general AI queries (existing functionality)
      console.info('💬 Processing as general AI query');
      const generalResponse = await this.handleGeneralAIQuery(
        message,
        userContext
      );
      this.addAssistantMessage(generalResponse.message, generalResponse.type);
      return generalResponse;
    } catch (error) {
      console.error('❌ Flowter AI error:', error);
      const errorResponse = this.createErrorResponse(error as Error);
      this.addAssistantMessage(errorResponse.message, errorResponse.type);
      return errorResponse;
    }
  }

  // ============================================================================
  // QUERY TYPE DETECTION
  // ============================================================================

  private isSearchQuery(message: string): boolean {
    const lowerMessage = message.toLowerCase();

    // Check for direct search indicators
    const hasSearchIndicator = this.SEARCH_INDICATORS.some((indicator) =>
      lowerMessage.includes(indicator)
    );

    // Check for specific feature names
    const featureKeywords = [
      'routing',
      'routes',
      'dispatch',
      'broker',
      'invoice',
      'billing',
      'drivers',
      'vehicles',
      'carriers',
      'reports',
      'analytics',
      'compliance',
      'safety',
      'quoting',
      'loads',
      'tracking',
      // Subscription-related keywords
      'subscription',
      'plan',
      'pricing',
      'payment',
      'upgrade',
      'downgrade',
      'cancel',
      'trial',
      'account',
      'billing',
      'cost',
      'fee',
      'price',
      'membership',
    ];
    const hasFeatureKeyword = featureKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );

    return hasSearchIndicator || hasFeatureKeyword;
  }

  private isHelpQuery(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.HELP_INDICATORS.some((indicator) =>
      lowerMessage.includes(indicator)
    );
  }

  private isSubscriptionQuery(message: string): boolean {
    const lowerMessage = message.toLowerCase();

    // Check for subscription-specific keywords
    const subscriptionKeywords = [
      'subscription',
      'billing',
      'payment',
      'pricing',
      'plan',
      'upgrade',
      'downgrade',
      'cancel',
      'cost',
      'price',
      'fee',
      'charge',
      'invoice',
      'receipt',
      'trial',
      'account',
      'membership',
      'compare plans',
      'which plan',
      'best plan',
      'how much',
      'what costs',
    ];

    return subscriptionKeywords.some((keyword) =>
      lowerMessage.includes(keyword)
    );
  }

  // ============================================================================
  // SEARCH RESPONSE FORMATTING
  // ============================================================================

  private async formatSearchResponse(
    searchResults: FlowterSearchResults,
    originalQuery: string
  ): Promise<FlowterResponse> {
    switch (searchResults.type) {
      case 'DIRECT_NAVIGATION':
        return {
          type: 'NAVIGATION',
          message: searchResults.message || '',
          actions: [
            {
              type: 'navigate',
              label: searchResults.primaryAction?.label || 'Go',
              url: searchResults.primaryAction?.url || '#',
              description: `Navigate to ${searchResults.item?.title}`,
              icon: searchResults.primaryAction?.icon || '🔗',
            },
            ...(searchResults.quickActions?.map((qa) => ({
              type: 'action' as const,
              label: qa.label,
              action: qa.action,
              description: qa.description,
              icon: qa.icon,
            })) || []),
          ],
          helpText: searchResults.helpText,
          metadata: {
            searchResults: true,
            navigationReady: true,
          },
        };

      case 'MULTIPLE_RESULTS':
        return {
          type: 'SELECTION',
          message: searchResults.message || '',
          options:
            searchResults.results?.map((result) => ({
              label: `${result.icon} ${result.title}`,
              description: result.description,
              action: `navigate:${result.url}`,
              relevanceScore: result.relevanceScore,
              icon: result.icon,
            })) || [],
          metadata: {
            searchResults: true,
            navigationReady: true,
          },
        };

      case 'ACCESS_RESTRICTED':
        return {
          type: 'UPGRADE_REQUIRED',
          message: searchResults.message || '',
          upgradeInfo: searchResults.upgradeMessage,
          restrictedFeatures: searchResults.restrictedResults,
          metadata: {
            searchResults: true,
            requiresPermission: searchResults.restrictedResults
              ?.map((r) => r.item.requiredPermissions)
              .flat(),
          },
        };

      case 'SECURITY_BLOCKED':
        return {
          type: 'ERROR',
          message:
            searchResults.message || 'Security policy prevented this search.',
          suggestions: searchResults.suggestions,
          metadata: {
            searchResults: true,
          },
        };

      default:
        return {
          type: 'SEARCH_HELP',
          message:
            searchResults.message || 'I can help you find FleetFlow features.',
          suggestions: searchResults.suggestions,
          quickHelp: searchResults.quickHelp,
          metadata: {
            searchResults: true,
          },
        };
    }
  }

  // ============================================================================
  // HELP QUERY HANDLING
  // ============================================================================

  private async handleHelpQuery(
    message: string,
    context: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    const lowerMessage = message.toLowerCase();

    // Extract topic from help query
    let topic = '';
    if (lowerMessage.includes('routing') || lowerMessage.includes('routes')) {
      topic = 'routing';
    } else if (
      lowerMessage.includes('dispatch') ||
      lowerMessage.includes('loads')
    ) {
      topic = 'dispatch';
    } else if (
      lowerMessage.includes('invoice') ||
      lowerMessage.includes('billing')
    ) {
      topic = 'invoicing';
    } else if (lowerMessage.includes('driver')) {
      topic = 'drivers';
    } else if (
      lowerMessage.includes('vehicle') ||
      lowerMessage.includes('fleet')
    ) {
      topic = 'vehicles';
    } else if (
      lowerMessage.includes('subscription') ||
      lowerMessage.includes('billing') ||
      lowerMessage.includes('payment') ||
      lowerMessage.includes('pricing') ||
      lowerMessage.includes('plan')
    ) {
      topic = 'subscription';
    } else if (
      lowerMessage.includes('phone') ||
      lowerMessage.includes('call') ||
      lowerMessage.includes('minutes')
    ) {
      topic = 'phone';
    }

    // If we can identify a topic, try to find the feature and provide help
    if (topic) {
      const searchResults = await this.searchEngine.search(topic, context);
      if (searchResults.type === 'DIRECT_NAVIGATION' && searchResults.item) {
        // Special handling for subscription and phone topics
        if (topic === 'subscription' || topic === 'phone') {
          const subscriptionResponse = await this.handleSubscriptionQuery(
            message,
            context
          );
          return subscriptionResponse;
        }

        return {
          type: 'GENERAL_AI',
          message: `I'd be happy to help you with **${searchResults.item.title}**!

${searchResults.item.helpText}

**Here's what you can do:**
${searchResults.item.features.map((f) => `• ${f}`).join('\n')}

**Quick Actions:**
${searchResults.item.quickActions.map((qa) => `• ${qa.label} - ${qa.description}`).join('\n')}

Would you like me to take you there, or do you have specific questions?`,
          actions: [
            {
              type: 'navigate',
              label: `Go to ${searchResults.item.title}`,
              url: searchResults.item.url,
              description: `Open ${searchResults.item.title}`,
              icon: searchResults.item.icon,
            },
            ...(searchResults.item.tutorials.length > 0
              ? [
                  {
                    type: 'help' as const,
                    label: 'View Tutorial',
                    url: searchResults.item.tutorials[0],
                    description: 'Open step-by-step tutorial',
                    icon: '📚',
                  },
                ]
              : []),
          ],
          metadata: {
            searchResults: true,
            navigationReady: true,
          },
        };
      }
    }

    // General help response
    return {
      type: 'GENERAL_AI',
      message: `I'm here to help! I can assist you with:

🔍 **Finding Features**: "Find routing" or "Where is dispatch?"
🚀 **Navigation**: "Take me to invoicing" or "Open driver management"
📚 **Tutorials**: "How to create routes" or "Help with dispatching"
📊 **Information**: Ask about any FleetFlow feature or process

**Popular Help Topics:**
• Routing and optimization
• Load dispatching and tracking
• Driver and vehicle management
• Invoicing and billing
• Reports and analytics
• Compliance and safety

What would you like help with?`,
      suggestions: [
        'Help with routing',
        'How to dispatch loads',
        'Driver management guide',
        'Invoice creation help',
      ],
    };
  }

  // ============================================================================
  // SUBSCRIPTION QUERY HANDLING
  // ============================================================================

  private async handleSubscriptionQuery(
    message: string,
    context: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    const lowerMessage = message.toLowerCase();

    try {
      // Import subscription data dynamically
      const {
        FLEETFLOW_PRICING_PLANS,
        ADDON_MODULES,
        PHONE_SYSTEM_ADDONS,
        ENTERPRISE_SOLUTIONS,
      } = await import('../config/subscription-plans');
      const { SubscriptionManagementService } = await import(
        './SubscriptionManagementService'
      );

      // Get user's current subscription if available
      const userSubscription =
        SubscriptionManagementService.getUserSubscription(context.userId);
      const trialStatus = SubscriptionManagementService.getTrialStatus(
        context.userId
      );

      // Handle different subscription query types
      if (
        lowerMessage.includes('what') &&
        lowerMessage.includes('plan') &&
        lowerMessage.includes('have')
      ) {
        // "What plan do I have?" or "What subscription do I have?"
        if (userSubscription) {
          const currentTier = SubscriptionManagementService.getSubscriptionTier(
            userSubscription.subscriptionTierId
          );
          return {
            type: 'SUBSCRIPTION_HELP',
            message: `📋 **Your Current Subscription:**\n\n**${currentTier?.name}**\n- **Price:** $${currentTier?.price}/${currentTier?.billingCycle}\n- **Status:** ${userSubscription.status}\n- **Next Billing:** ${userSubscription.currentPeriodEnd.toLocaleDateString()}\n\n**Key Features:**\n${currentTier?.features.map((f) => `• ${f}`).join('\n')}\n\n${trialStatus.isInTrial ? `🎯 **Trial Status:** ${trialStatus.daysRemaining} days remaining` : ''}`,
            subscriptionInfo: {
              currentPlan: currentTier?.name,
              pricing: currentTier?.price,
              features: currentTier?.features,
            },
            metadata: { subscriptionHelp: true },
          };
        } else {
          return {
            type: 'SUBSCRIPTION_HELP',
            message: `🤔 I don't see an active subscription for your account. You might be on a free trial or need to set up billing.\n\nWould you like me to:\n• Show you available subscription plans?\n• Help you start a free trial?\n• Guide you through the signup process?`,
            actions: [
              {
                type: 'navigate',
                label: 'View Subscription Plans',
                url: '/plans',
                description: 'Browse available subscription options',
                icon: '📋',
              },
              {
                type: 'help',
                label: 'Start Free Trial',
                action: 'start_trial_guide',
                description: 'Learn about the free trial process',
                icon: '🎯',
              },
            ],
            metadata: { subscriptionHelp: true },
          };
        }
      }

      if (
        lowerMessage.includes('compare') ||
        lowerMessage.includes('vs') ||
        lowerMessage.includes('versus')
      ) {
        // Compare plans
        const professionalBrokerage =
          FLEETFLOW_PRICING_PLANS.PROFESSIONAL_BROKERAGE;
        const enterpriseProfessional =
          FLEETFLOW_PRICING_PLANS.ENTERPRISE_PROFESSIONAL;
        const dispatcherPro = FLEETFLOW_PRICING_PLANS.PROFESSIONAL_DISPATCHER;

        return {
          type: 'SUBSCRIPTION_HELP',
          message: `📊 **Subscription Plan Comparison:**\n\n**Professional Dispatcher** - $79/month\n• Complete dispatch management\n• Driver assignment & tracking\n• Route optimization\n• Basic CRM integration\n• 50 phone minutes included\n\n**Professional Brokerage** ⭐ - $289/month\n• Advanced brokerage operations\n• Load board management\n• Revenue analytics dashboard\n• AI-powered optimization\n• 500 phone minutes included\n\n**Enterprise Professional** - $2,698/month\n• Complete platform access\n• AI Flow Professional included\n• Unlimited phone minutes\n• Priority support & training\n• Custom integrations\n\n**💡 Recommendation:** Professional Brokerage offers the best value for most freight brokerage operations.`,
          subscriptionInfo: {
            recommendedPlan: 'Professional Brokerage',
            pricing: 289,
          },
          actions: [
            {
              type: 'navigate',
              label: 'View All Plans',
              url: '/plans',
              description: 'See detailed plan comparisons',
              icon: '📋',
            },
            {
              type: 'help',
              label: 'Upgrade to Brokerage',
              action: 'upgrade_brokerage_guide',
              description: 'Guide to upgrade process',
              icon: '⬆️',
            },
          ],
          metadata: { subscriptionHelp: true },
        };
      }

      if (
        lowerMessage.includes('upgrade') ||
        lowerMessage.includes('change plan')
      ) {
        // Upgrade guidance
        const availablePlans = Object.values(FLEETFLOW_PRICING_PLANS).filter(
          (plan) => plan.category === 'TMS' && plan.price > 0
        );

        return {
          type: 'SUBSCRIPTION_HELP',
          message: `⬆️ **Upgrade Your Subscription:**\n\nHere are your upgrade options:\n\n${availablePlans
            .map(
              (plan) =>
                `**${plan.name}** - $${plan.price}/month\n${plan.popular ? '⭐ Popular Choice\n' : ''}${plan.features
                  .slice(0, 3)
                  .map((f) => `• ${f}`)
                  .join('\n')}\n`
            )
            .join(
              '\n'
            )}\n**Need help choosing?** I can recommend based on your usage:\n• If you dispatch loads: Professional Dispatcher ($79/month)\n• If you broker freight: Professional Brokerage ($289/month)\n• If you need full AI automation: Enterprise Professional ($2,698/month)`,
          actions: [
            {
              type: 'navigate',
              label: 'Upgrade Now',
              url: '/plans',
              description: 'Start the upgrade process',
              icon: '⬆️',
            },
            {
              type: 'help',
              label: 'Get Recommendation',
              action: 'usage_recommendation',
              description: 'AI recommendation based on your needs',
              icon: '🤖',
            },
          ],
          metadata: { subscriptionHelp: true },
        };
      }

      if (
        lowerMessage.includes('cancel') ||
        lowerMessage.includes('stop subscription')
      ) {
        // Cancellation guidance
        return {
          type: 'SUBSCRIPTION_HELP',
          message: `❌ **Subscription Cancellation:**\n\nI understand you might be considering canceling. Before you do, let me help you understand your options:\n\n**Keep in mind:**\n• Your data will be retained for 30 days\n• You can reactivate anytime during that period\n• No cancellation fees\n• Pro-rated refund if applicable\n\n**Alternatives to consider:**\n• Downgrade to a lower-tier plan\n• Pause your subscription temporarily\n• Contact support for special circumstances\n\nWould you like me to:\n• Guide you through the cancellation process?\n• Show you downgrade options?\n• Connect you with customer support?`,
          actions: [
            {
              type: 'help',
              label: 'Start Cancellation',
              action: 'cancellation_guide',
              description: 'Step-by-step cancellation process',
              icon: '❌',
            },
            {
              type: 'help',
              label: 'Explore Downgrades',
              action: 'downgrade_options',
              description: 'See lower-cost alternatives',
              icon: '⬇️',
            },
            {
              type: 'action',
              label: 'Contact Support',
              action: 'contact_support',
              description: 'Speak with customer support',
              icon: '📞',
            },
          ],
          metadata: { subscriptionHelp: true },
        };
      }

      if (
        lowerMessage.includes('billing') ||
        lowerMessage.includes('payment') ||
        lowerMessage.includes('invoice')
      ) {
        // Billing and payment information
        return {
          type: 'SUBSCRIPTION_HELP',
          message: `💰 **Billing & Payment Information:**\n\n**Payment Methods:**\n• Credit/Debit Cards (Visa, MasterCard, American Express)\n• Bank Transfers (ACH)\n• Square Payment Processing\n\n**Billing Cycle:**\n• Monthly or Annual billing options\n• Annual plans save 2 months\n• Auto-renewal with payment method on file\n\n**Invoices & Receipts:**\n• Automatic email receipts\n• Downloadable PDF invoices\n• Tax documentation available\n\n**Need help with:**\n• Updating payment method?\n• Viewing past invoices?\n• Setting up auto-pay?\n• Understanding charges?`,
          actions: [
            {
              type: 'navigate',
              label: 'View Billing',
              url: '/billing-invoices',
              description: 'Access your billing dashboard',
              icon: '💳',
            },
            {
              type: 'help',
              label: 'Update Payment Method',
              action: 'payment_method_guide',
              description: 'Change your payment information',
              icon: '💳',
            },
            {
              type: 'help',
              label: 'Download Invoices',
              action: 'invoice_download_guide',
              description: 'Access and download invoices',
              icon: '📄',
            },
          ],
          metadata: { subscriptionHelp: true },
        };
      }

      if (
        lowerMessage.includes('phone') ||
        lowerMessage.includes('call') ||
        lowerMessage.includes('minutes')
      ) {
        // Phone system information
        return {
          type: 'SUBSCRIPTION_HELP',
          message: `📞 **FleetFlow Phone System:**\n\n**Available Add-ons:**\n\n**Basic** - $39/month:\n• Company phone number\n• Professional caller ID\n• Basic call monitoring\n• Voicemail & transcription\n• 5 users\n\n**Professional** ⭐ - $89/month:\n• Everything in Basic\n• CRM call integration\n• Call recording & storage\n• Real-time monitoring\n• 25 users\n• SMS capabilities\n\n**Enterprise** - $199/month:\n• Everything in Professional\n• Unlimited users\n• Advanced analytics\n• Call center features\n• White-label options\n\n**Usage Rates:**\n• Outbound: $0.02/minute\n• Inbound: $0.015/minute\n• SMS: $0.05/message`,
          subscriptionInfo: {
            recommendedPlan: 'Professional Phone',
            pricing: 89,
          },
          actions: [
            {
              type: 'navigate',
              label: 'Add Phone System',
              url: '/phone-system',
              description: 'Set up FleetFlow Phone',
              icon: '📞',
            },
            {
              type: 'help',
              label: 'Phone Setup Guide',
              action: 'phone_setup_guide',
              description: 'Step-by-step phone setup',
              icon: '📋',
            },
          ],
          metadata: { subscriptionHelp: true },
        };
      }

      // Default subscription help response
      return {
        type: 'SUBSCRIPTION_HELP',
        message: `💳 **FleetFlow Subscription Help:**\n\nI can help you with:\n\n**📋 Plan Information:**\n• Current subscription details\n• Available plans and pricing\n• Feature comparisons\n• Usage limits and overages\n\n**💰 Billing & Payments:**\n• Payment methods and billing cycles\n• Invoice access and downloads\n• Payment method updates\n\n**⬆️ Plan Management:**\n• Upgrades and downgrades\n• Cancellation process\n• Trial information\n\n**📞 Phone System:**\n• Phone add-on options\n• Usage tracking and rates\n• Setup and configuration\n\n**Try asking:**\n• "What plan do I have?"\n• "Compare Professional Brokerage vs Enterprise"\n• "How do I upgrade my plan?"\n• "What's included in the phone system?"\n• "How do I update my payment method?"`,
        suggestions: [
          'What plan do I have?',
          'Compare subscription plans',
          'How to upgrade my plan',
          'Phone system information',
          'Billing and payment help',
        ],
        metadata: { subscriptionHelp: true },
      };
    } catch (error) {
      console.error('Subscription query error:', error);
      return {
        type: 'ERROR',
        message:
          'I apologize, but I encountered an issue accessing subscription information. Please try again or contact support for assistance.',
        suggestions: [
          'Try a simpler subscription question',
          'Contact support for billing issues',
          'Visit the plans page for pricing',
        ],
      };
    }
  }

  // ============================================================================
  // GENERAL AI QUERY HANDLING - ENHANCED GENIUS MODE
  // ============================================================================

  private async handleGeneralAIQuery(
    message: string,
    context: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    const lowerMessage = message.toLowerCase();

    // First, try to find a knowledge base answer
    const knowledgeAnswer = await this.searchKnowledgeBase(message, context);
    if (knowledgeAnswer) {
      return knowledgeAnswer;
    }

    // Handle operational queries with detailed responses
    let aiResponse = '';
    let actions: FlowterAction[] = [];

    // LOADS & SHIPMENTS
    if (
      lowerMessage.includes('load') ||
      lowerMessage.includes('shipment') ||
      lowerMessage.includes('order')
    ) {
      if (lowerMessage.includes('create') || lowerMessage.includes('new')) {
        aiResponse =
          '🚛 **Creating New Loads in FleetFlow:**\n\n**Here\'s how to create a load:**\n\n1️⃣ **Navigate to Dispatch Central**\n   - Click "Dispatch" in the main menu\n   - Or click "Create Load" quick action\n\n2️⃣ **Enter Load Details:**\n   - Pick-up and delivery locations\n   - Equipment type (Dry Van, Reefer, Flatbed)\n   - Weight and dimensions\n   - Special requirements\n\n3️⃣ **AI Optimization:**\n   - Our AI automatically suggests optimal rates\n   - Multi-modal options (truck, rail, LTL)\n   - Best carrier recommendations\n   - Dock scheduling integration\n\n4️⃣ **Assignment:**\n   - Assign to available driver\n   - Or post to your carrier network\n   - Or share on freight network\n\n💡 **Pro Tip:** Use AI Load Optimization to save 15-30% on shipping costs!\n\nWould you like me to take you to Dispatch Central?';
        actions = [
          {
            type: 'navigate',
            label: 'Go to Dispatch',
            url: '/dispatch',
            description: 'Start creating loads',
            icon: '🎯',
          },
          {
            type: 'help',
            label: 'Load Creation Tutorial',
            url: '/training/load-creation',
            description: 'Step-by-step guide',
            icon: '📚',
          },
        ];
      } else if (
        lowerMessage.includes('status') ||
        lowerMessage.includes('track')
      ) {
        aiResponse =
          '📍 **Tracking Loads in FleetFlow:**\n\n**Real-Time Tracking Features:**\n\n🗺️ **Live GPS Tracking:**\n   - Real-time location updates every 5 minutes\n   - ETA predictions powered by AI\n   - Traffic integration and route optimization\n   - Geofencing alerts for pickup/delivery zones\n\n📊 **Load Status Dashboard:**\n   - Active loads overview\n   - Status: Dispatched → In Transit → Delivered\n   - Driver communication logs\n   - Customer tracking portal link\n\n🔔 **Automated Notifications:**\n   - Pickup completed alerts\n   - Delivery milestone updates\n   - Delay warnings with AI predictions\n   - Customer SMS/email notifications\n\n📱 **Customer Portal:**\n   - Share tracking links with customers\n   - Branded tracking experience\n   - Document access (POD, BOL)\n\n💡 **Available in:** Basic, Premium, and Enterprise plans\n\nWant to see your active loads now?';
        actions = [
          {
            type: 'navigate',
            label: 'Live Tracking',
            url: '/tracking',
            description: 'View all active loads',
            icon: '📍',
          },
          {
            type: 'navigate',
            label: 'Dispatch Board',
            url: '/dispatch',
            description: 'Manage load status',
            icon: '🎯',
          },
        ];
      } else if (lowerMessage.includes('optimize')) {
        aiResponse =
          '🧠 **AI Load Optimization in FleetFlow:**\n\n**How FleetFlow AI Optimizes Your Loads:**\n\n💡 **Multi-Modal Analysis:**\n   - Compares truckload vs LTL options\n   - Rail integration for long-haul savings\n   - Intermodal optimization\n   - Real-time rate comparisons\n\n🎯 **Smart Load Matching:**\n   - Backhaul opportunities\n   - Load consolidation suggestions\n   - Deadhead reduction\n   - Route optimization\n\n💰 **Cost Savings:**\n   - Average 15-30% reduction in shipping costs\n   - Fuel efficiency routing\n   - Automated rate negotiations\n   - Volume discount optimization\n\n📊 **Performance Tracking:**\n   - ROI dashboard\n   - Savings vs traditional methods\n   - Carrier performance analytics\n   - Market rate benchmarking\n\n⚡ **Available Features by Plan:**\n   - **Premium:** AI optimization, multi-modal analysis\n   - **Enterprise:** Advanced AI, predictive analytics, custom algorithms\n\nReady to start optimizing?';
        actions = [
          {
            type: 'navigate',
            label: 'AI Optimization',
            url: '/ai-flow',
            description: 'Start optimizing loads',
            icon: '🧠',
          },
          {
            type: 'navigate',
            label: 'Analytics',
            url: '/analytics',
            description: 'View savings dashboard',
            icon: '📊',
          },
        ];
      }
    }
    // DRIVERS & ASSIGNMENTS
    else if (
      lowerMessage.includes('driver') ||
      lowerMessage.includes('assign')
    ) {
      aiResponse =
        '👨‍💼 **Driver Management in FleetFlow:**\n\n**Complete Driver Management Features:**\n\n📋 **Driver Profiles:**\n   - Complete driver information\n   - License & certification tracking\n   - Document management (CDL, medical cards)\n   - Performance history and ratings\n\n⏱️ **Hours of Service (HOS):**\n   - OpenELD integration\n   - Real-time HOS tracking\n   - Violation prevention alerts\n   - FMCSA compliance automation\n\n🎯 **Smart Assignment:**\n   - AI-powered driver matching\n   - Location-based assignments\n   - HOS availability checking\n   - Skill/equipment matching\n\n📱 **Communication:**\n   - SMS notifications\n   - Mobile app integration\n   - Document exchange\n   - Real-time messaging\n\n📊 **Performance Analytics:**\n   - Safety scores\n   - On-time delivery rates\n   - Fuel efficiency\n   - Customer ratings\n\n💡 **Available in:** All plans (Basic, Premium, Enterprise)\n\nWant to manage your drivers now?';
      actions = [
        {
          type: 'navigate',
          label: 'Driver Management',
          url: '/drivers',
          description: 'View all drivers',
          icon: '👥',
        },
        {
          type: 'navigate',
          label: 'OpenELD',
          url: '/openeld',
          description: 'HOS compliance',
          icon: '📱',
        },
      ];
    }
    // ROUTES & NAVIGATION
    else if (
      lowerMessage.includes('route') ||
      lowerMessage.includes('navigation')
    ) {
      aiResponse =
        '🗺️ **Route Optimization in FleetFlow:**\n\n**AI-Powered Route Planning:**\n\n⚡ **Smart Route Optimization:**\n   - Multi-stop route planning\n   - Traffic integration (real-time)\n   - Weather consideration\n   - Road restrictions (bridge heights, weights)\n   - HOS-compliant routing\n\n💰 **Cost Optimization:**\n   - Fuel-efficient routes\n   - Toll optimization\n   - Time vs cost balancing\n   - Deadhead minimization\n\n🛰️ **Live Features:**\n   - Real-time traffic updates\n   - Dynamic rerouting\n   - Geofencing alerts\n   - ETA predictions (AI-powered)\n\n📊 **Analytics:**\n   - Fuel savings tracking\n   - Time savings reports\n   - Route efficiency scores\n   - Driver performance by route\n\n🎯 **Advanced Features (Premium/Enterprise):**\n   - Quantum routing algorithms\n   - Multi-vehicle optimization\n   - Predictive traffic analysis\n   - Custom routing rules\n\nReady to optimize your routes?';
      actions = [
        {
          type: 'navigate',
          label: 'Route Planning',
          url: '/routes',
          description: 'Start planning routes',
          icon: '🗺️',
        },
        {
          type: 'navigate',
          label: 'Live Tracking',
          url: '/tracking',
          description: 'Monitor active routes',
          icon: '📍',
        },
      ];
    }
    // INVOICING & PAYMENTS
    else if (
      lowerMessage.includes('invoice') ||
      lowerMessage.includes('payment') ||
      lowerMessage.includes('billing') ||
      lowerMessage.includes('settlement')
    ) {
      aiResponse =
        '💰 **Financial Management in FleetFlow:**\n\n**Complete Billing & Invoice System:**\n\n📄 **Invoice Generation:**\n   - Automated invoice creation\n   - Professional templates\n   - Custom branding\n   - Line-item details\n   - Tax calculations\n\n🤖 **AI-Powered Processing:**\n   - Auto-matching loads to invoices\n   - Rate verification\n   - Discrepancy detection\n   - Approval workflows\n   - 99.2% accuracy rate\n\n💳 **Payment Processing:**\n   - Multiple payment methods\n   - ACH/Wire transfer\n   - Credit card processing\n   - Payment tracking\n   - Automated reminders\n\n📊 **Financial Analytics:**\n   - Accounts receivable tracking\n   - Cash flow projections\n   - Payment aging reports\n   - Profitability by customer/lane\n\n⚡ **Quick Pay Options:**\n   - Carrier quick pay programs\n   - Factoring integration\n   - Same-day settlements\n\n💡 **Available in:** All plans, enhanced features in Premium/Enterprise\n\nNeed help with invoicing?';
      actions = [
        {
          type: 'navigate',
          label: 'Billing & Invoices',
          url: '/billing-invoices',
          description: 'Manage invoices',
          icon: '💵',
        },
        {
          type: 'navigate',
          label: 'Financial Reports',
          url: '/reports?tab=financial',
          description: 'View financial analytics',
          icon: '📊',
        },
      ];
    }
    // REPORTS & ANALYTICS
    else if (
      lowerMessage.includes('report') ||
      lowerMessage.includes('analytic') ||
      lowerMessage.includes('insight') ||
      lowerMessage.includes('dashboard')
    ) {
      aiResponse =
        '📊 **Analytics & Reporting in FleetFlow:**\n\n**Comprehensive Business Intelligence:**\n\n📈 **Executive Dashboards:**\n   - Real-time KPI tracking\n   - Revenue and profitability\n   - Fleet utilization\n   - Performance metrics\n   - AI Company Dashboard (Premium+)\n\n🎯 **Operational Reports:**\n   - Load performance\n   - Driver efficiency\n   - Carrier scorecards\n   - Route optimization results\n   - HOS compliance\n\n💡 **AI-Powered Insights:**\n   - Predictive analytics\n   - Trend analysis\n   - Anomaly detection\n   - Optimization recommendations\n   - Market intelligence\n\n🌐 **Industry Benchmarking:**\n   - Data Consortium access (2,847+ companies)\n   - Anonymous competitive analysis\n   - Market rate comparisons\n   - Performance benchmarks\n\n📊 **Custom Reports:**\n   - Drag-and-drop report builder\n   - Scheduled report delivery\n   - Export to PDF/Excel/CSV\n   - API access for integrations\n\n💡 **Available by Plan:**\n   - **Basic:** Standard reports\n   - **Premium:** Advanced analytics, Data Consortium\n   - **Enterprise:** Custom reports, AI insights, benchmarking\n\nReady to dive into your data?';
      actions = [
        {
          type: 'navigate',
          label: 'Analytics Dashboard',
          url: '/analytics',
          description: 'View analytics',
          icon: '📊',
        },
        {
          type: 'navigate',
          label: 'Data Consortium',
          url: '/data-consortium',
          description: 'Industry benchmarking',
          icon: '🌐',
        },
        {
          type: 'navigate',
          label: 'AI Company Dashboard',
          url: '/ai-company-dashboard',
          description: 'Executive intelligence',
          icon: '🏢',
        },
      ];
    }
    // CRM & SALES
    else if (
      lowerMessage.includes('crm') ||
      lowerMessage.includes('customer') ||
      lowerMessage.includes('sales') ||
      lowerMessage.includes('lead')
    ) {
      aiResponse =
        '📱 **CRM & Sales in FleetFlow:**\n\n**Complete Customer Relationship Management:**\n\n👥 **Contact Management:**\n   - Centralized customer database\n   - Complete interaction history\n   - Document storage\n   - Custom fields and tags\n   - Relationship mapping\n\n🎯 **Sales Pipeline:**\n   - Lead tracking and scoring\n   - Opportunity management\n   - Deal stages and workflows\n   - Win/loss analysis\n   - Revenue forecasting\n\n📞 **Integrated Dialer:**\n   - Click-to-dial functionality\n   - Automatic call logging\n   - Call recording\n   - SMS integration\n   - Call analytics\n\n🤖 **AI Lead Generation:**\n   - Unified Lead Gen (TruckingPlanet, ThomasNet, FMCSA)\n   - AI-powered lead scoring\n   - Automated outreach\n   - Market intelligence\n   - 2.17M+ company database\n\n📊 **Sales Analytics:**\n   - Pipeline metrics\n   - Conversion rates\n   - Sales performance\n   - Customer lifetime value\n   - Territory analysis\n\n💡 **Available by Plan:**\n   - **Basic:** CRM, contacts, dialer\n   - **Premium:** AI lead gen, advanced analytics\n   - **Enterprise:** Full AI Flow platform, custom workflows\n\nReady to supercharge your sales?';
      actions = [
        {
          type: 'navigate',
          label: 'CRM System',
          url: '/crm',
          description: 'Manage customers',
          icon: '📱',
        },
        {
          type: 'navigate',
          label: 'AI Flow',
          url: '/ai-flow',
          description: 'Lead generation',
          icon: '🚀',
        },
        {
          type: 'navigate',
          label: 'Integrated Dialer',
          url: '/dialer',
          description: 'Start calling',
          icon: '📞',
        },
      ];
    }
    // AI & AUTOMATION
    else if (
      lowerMessage.includes('ai ') ||
      lowerMessage.includes('artificial intelligence') ||
      lowerMessage.includes('automation') ||
      lowerMessage.includes('ai staff')
    ) {
      aiResponse =
        '🤖 **AI & Automation in FleetFlow:**\n\n**8 AI Agents. 18 AI Staff. Zero Limits.**\n\n🧠 **AI Intelligence Suite:**\n   - **AI Company Dashboard:** Executive intelligence center\n   - **AI Flow Platform:** Unified lead generation & workflows\n   - **AI Staff Management:** Manage 18 specialized AI agents\n   - **AI Operations:** Automated freight management\n\n⚡ **Automation Capabilities:**\n   - Load optimization and booking\n   - Carrier selection and negotiation\n   - Route planning and optimization\n   - Invoice processing and approval\n   - Email and SMS automation\n   - Document generation\n\n🎯 **AI Staff Members (18 Total):**\n   - Freight Negotiators\n   - Dispatch Coordinators\n   - Customer Service Agents\n   - Sales Representatives\n   - Compliance Monitors\n   - Analytics Specialists\n   - And 12 more specialized agents!\n\n📊 **Performance Results:**\n   - 87% reduction in manual tasks\n   - 99.2% accuracy rate\n   - 15-30% cost savings\n   - 24/7 operation\n   - Human-like interactions\n\n💡 **Available by Plan:**\n   - **Premium:** AI Flow, basic automation\n   - **Enterprise:** Full AI suite, 18 AI staff, custom agents\n\nReady to meet your AI team?';
      actions = [
        {
          type: 'navigate',
          label: 'AI Company Dashboard',
          url: '/ai-company-dashboard',
          description: 'Executive AI center',
          icon: '🏢',
        },
        {
          type: 'navigate',
          label: 'AI Flow Platform',
          url: '/ai-flow',
          description: 'AI automation',
          icon: '🚀',
        },
        {
          type: 'navigate',
          label: 'AI Staff Management',
          url: '/ai-staff-management',
          description: 'Manage AI agents',
          icon: '👥',
        },
      ];
    }
    // DEFAULT COMPREHENSIVE RESPONSE
    else {
      aiResponse = `🤖 **I'm Flowter AI - Your FleetFlow Genius!**\n\nI can answer any question about FleetFlow and help you get the most out of your subscription!\n\n**Popular Topics I Can Help With:**\n\n🚛 **Load & Dispatch Operations:**\n   - "How do I create a load?"\n   - "How does tracking work?"\n   - "Explain load optimization"\n\n👥 **Driver & Fleet Management:**\n   - "How do I manage drivers?"\n   - "What is OpenELD?"\n   - "Explain HOS compliance"\n\n💰 **Financial & Billing:**\n   - "How do invoices work?"\n   - "Explain payment processing"\n   - "How do I track revenue?"\n\n🤖 **AI & Automation:**\n   - "What AI features are available?"\n   - "How does AI lead generation work?"\n   - "Tell me about AI staff"\n\n📊 **Analytics & Reporting:**\n   - "What reports are available?"\n   - "How does Data Consortium work?"\n   - "Explain KPI tracking"\n\n📱 **CRM & Sales:**\n   - "How does the CRM work?"\n   - "What is the integrated dialer?"\n   - "How do I generate leads?"\n\n💳 **Subscription & Billing:**\n   - "What plan do I have?"\n   - "Compare subscription plans"\n   - "How do I upgrade?"\n\n🔍 **Navigation:**\n   - "Find [any feature]"\n   - "Take me to [any page]"\n   - "Show me [any tool]"\n\n**Just ask me anything! I'm here to help! 😊**`;
    }

    return {
      type: 'GENERAL_AI',
      message: aiResponse,
      actions: actions.length > 0 ? actions : undefined,
      metadata: {
        searchResults: false,
      },
    };
  }

  // ============================================================================
  // KNOWLEDGE BASE SEARCH - GENIUS MODE
  // ============================================================================

  private async searchKnowledgeBase(
    query: string,
    context: FlowterSecurityContext
  ): Promise<FlowterResponse | null> {
    const lowerQuery = query.toLowerCase();

    // Knowledge base of common questions and comprehensive answers
    const knowledgeBase: Record<
      string,
      {
        keywords: string[];
        answer: string;
        actions?: FlowterAction[];
        tier?: string;
      }
    > = {
      whatIsFleetFlow: {
        keywords: ['what is fleetflow', 'about fleetflow', 'tell me about'],
        answer: `🚀 **Welcome to FleetFlow!**\n\n**FleetFlow is "The Salesforce of Transportation"** - a comprehensive Transportation Management System (TMS) with revolutionary AI-powered business intelligence.\n\n**Core Platform:**\n   - Complete TMS for freight brokers and carriers\n   - Real-time dispatch and load management\n   - Driver and fleet operations\n   - Financial management and invoicing\n   - Compliance and safety management\n\n**AI Intelligence:**\n   - 8 AI Agents powering automation\n   - 18 AI Staff members handling operations\n   - AI Flow platform for lead generation\n   - Industry Data Consortium (2,847+ companies)\n   - Predictive analytics and optimization\n\n**What Makes Us Different:**\n   ✅ AI-first platform, not bolt-on features\n   ✅ Complete solution, not just dispatch\n   ✅ Industry benchmarking included\n   ✅ Government contract ready\n   ✅ Multi-industry support (freight, healthcare, government)\n\n**Your Subscription:** ${context.subscriptionTier}\n\n**Want to learn more about specific features?**`,
        actions: [
          {
            type: 'navigate',
            label: 'Platform Overview',
            url: '/about',
            description: 'Learn more about FleetFlow',
            icon: 'ℹ️',
          },
          {
            type: 'navigate',
            label: 'Training Center',
            url: '/university',
            description: 'Take a tour',
            icon: '🎓',
          },
        ],
      },
      howMuchDoesCost: {
        keywords: [
          'how much',
          'cost',
          'pricing',
          'price',
          'expensive',
          'affordable',
        ],
        answer: `💰 **FleetFlow Pricing Plans:**\n\n**Core TMS Plans:**\n\n📦 **Professional Dispatcher** - $79/month\n   - Complete dispatch management\n   - Driver & vehicle tracking\n   - Basic CRM\n   - 50 phone minutes\n   - Perfect for: Small carriers\n\n⭐ **Professional Brokerage** - $289/month *MOST POPULAR*\n   - Everything in Dispatcher +\n   - Advanced brokerage operations\n   - Load board integration\n   - Revenue analytics\n   - 500 phone minutes\n   - AI optimization\n   - Perfect for: Freight brokers\n\n🚀 **Enterprise Professional** - $2,698/month\n   - Everything in Brokerage +\n   - Complete AI Flow platform\n   - 18 AI Staff members\n   - Unlimited phone minutes\n   - Data Consortium access\n   - Priority support\n   - Custom integrations\n   - Perfect for: Large operations\n\n**Add-On Services:**\n   - Phone System: $39-$199/month\n   - AI Flow Professional: $1,699/month (standalone)\n   - OpenELD: Included in all plans\n\n**💡 ROI:** Customers typically save 15-30% on operational costs, paying for FleetFlow within the first month!\n\nWant to see which plan is best for you?`,
        actions: [
          {
            type: 'navigate',
            label: 'View All Plans',
            url: '/plans',
            description: 'Compare features',
            icon: '📋',
          },
          {
            type: 'help',
            label: 'Get Recommendation',
            action: 'plan_recommendation',
            description: 'Find your perfect plan',
            icon: '🎯',
          },
        ],
      },
      dataConsortiumExplained: {
        keywords: [
          'data consortium',
          'benchmarking',
          'industry data',
          'compare performance',
          'competitive intelligence',
        ],
        answer: `🌐 **Industry Data Consortium Explained:**\n\n**What Is It?**\nThe Industry Data Consortium is FleetFlow's revolutionary anonymous benchmarking platform that gives you competitive intelligence from **2,847+ transportation companies**.\n\n**How It Works:**\n   1. Your operational data is anonymized\n   2. Pooled with data from 2,847+ other companies\n   3. AI analyzes trends, averages, and benchmarks\n   4. You get insights WITHOUT revealing your identity\n\n**What You Get:**\n   📊 Performance benchmarks by company size\n   💰 Market rate comparisons (lanes, equipment types)\n   🎯 Operational efficiency metrics\n   📈 Industry trend analysis\n   🔍 Competitive positioning\n   ⚡ Real-time market intelligence\n\n**Example Insights:**\n   - "Your cost per mile is 12% below industry average" ✅\n   - "Competitors charging $2.45/mile for this lane"\n   - "Top 25% of companies maintain 94% on-time delivery"\n   - "Peak season rates increasing 15% next month"\n\n**Privacy Guaranteed:**\n   - Your data is 100% anonymous\n   - No company-identifying information shared\n   - You can't see individual competitors\n   - All insights are aggregated\n\n**Available in:** Premium and Enterprise plans\n\nWant to see how you compare?`,
        actions: [
          {
            type: 'navigate',
            label: 'View Consortium',
            url: '/data-consortium',
            description: 'Access benchmarking',
            icon: '🌐',
          },
        ],
        tier: 'premium',
      },
      aiFlowExplained: {
        keywords: [
          'ai flow',
          'lead generation',
          'ai platform',
          'unified lead gen',
          'trucking planet',
          'thomasnet',
        ],
        answer: `🚀 **AI Flow Platform Explained:**\n\n**What Is AI Flow?**\nAI Flow is FleetFlow's complete AI automation platform with the industry's most powerful **Unified Lead Generation System**.\n\n**Unified Lead Generation:**\n   🎯 **3 Data Sources in One:**\n      - TruckingPlanet: 500K+ carriers\n      - ThomasNet: 1.2M+ manufacturers\n      - FMCSA: 470K+ DOT registered companies\n      - **Total Database: 2.17M+ companies**\n\n   🧠 **AI-Powered Scoring:**\n      - Freight volume estimation\n      - Business size analysis\n      - Contact quality verification\n      - Revenue potential (70-95+ points)\n\n   ⚡ **Instant Results:**\n      - Real-time lead discovery\n      - One-click CRM integration\n      - Direct calling via integrated dialer\n      - Email automation ready\n\n**Complete AI Automation:**\n   - Automated lead nurturing\n   - Email sequence automation\n   - AI-powered responses\n   - Pipeline management\n   - Follow-up automation\n\n**Performance Results:**\n   - 300% increase in lead volume\n   - 85% reduction in research time\n   - 60% higher quality leads\n   - $2K-$10K+ monthly revenue per lead\n\n**ROI Example:**\n   - Generate 50 high-quality leads/month\n   - Close rate: 10% = 5 new customers\n   - Average customer value: $5,000/month\n   - Monthly revenue: $25,000\n   - **ROI: 1,372% (for $1,699/month plan)**\n\n**Available in:** Premium ($289/mo includes basic) and Enterprise (full platform)\n\nReady to generate leads?`,
        actions: [
          {
            type: 'navigate',
            label: 'AI Flow Platform',
            url: '/ai-flow',
            description: 'Start generating leads',
            icon: '🚀',
          },
          {
            type: 'help',
            label: 'AI Flow Tutorial',
            url: '/training/ai-flow-basics',
            description: 'Learn the system',
            icon: '📚',
          },
        ],
        tier: 'premium',
      },
      aiStaffExplained: {
        keywords: [
          'ai staff',
          '18 ai',
          'ai agents',
          'ai employees',
          'ai workforce',
          'virtual staff',
        ],
        answer: `👥 **AI Staff - Your 18 Virtual Employees Explained:**\n\n**What Is AI Staff?**\nFleetFlow Enterprise includes **18 specialized AI Staff members** - virtual employees that work 24/7 handling your operations with human-like intelligence.\n\n**Your AI Team:**\n\n🎯 **Sales & Business Development (4 AI Staff):**\n   - Lead Generation Specialists (2)\n   - Sales Representatives (1)\n   - Customer Success Manager (1)\n\n🚛 **Operations Team (6 AI Staff):**\n   - Freight Negotiators (2)\n   - Dispatch Coordinators (2)\n   - Load Optimization Specialists (2)\n\n📞 **Customer Service (3 AI Staff):**\n   - Customer Support Agents (2)\n   - Account Managers (1)\n\n💼 **Back Office (5 AI Staff):**\n   - Invoice Processing Specialists (2)\n   - Compliance Monitors (1)\n   - Analytics Specialists (1)\n   - Document Processors (1)\n\n**What They Do:**\n   ✅ Handle routine communications\n   ✅ Process invoices and documents\n   ✅ Negotiate with carriers\n   ✅ Monitor compliance\n   ✅ Generate reports and insights\n   ✅ Respond to customer inquiries\n   ✅ Qualify and nurture leads\n   ✅ Optimize loads and routes\n\n**Performance Metrics:**\n   - 99.2% accuracy rate\n   - 87% reduction in manual tasks\n   - 24/7/365 availability\n   - Human-like communication\n   - $0 per hour operating cost\n\n**Cost Comparison:**\n   - 18 human employees: ~$900K/year\n   - 18 AI staff: $32,376/year ($2,698/month)\n   - **Savings: $867,624/year (96% reduction)**\n\n**Available in:** Enterprise plan only ($2,698/month)\n\nReady to meet your AI team?`,
        actions: [
          {
            type: 'navigate',
            label: 'AI Staff Management',
            url: '/ai-staff-management',
            description: 'View your AI team',
            icon: '👥',
          },
          {
            type: 'navigate',
            label: 'AI Staff Operations',
            url: '/ai-staff-operations',
            description: 'Monitor AI performance',
            icon: '⚙️',
          },
        ],
        tier: 'enterprise',
      },
      // ========================================================================
      // SERVICE FUNCTIONAL KNOWLEDGE - DETAILED EXPLANATIONS
      // ========================================================================
      freightNegotiatorService: {
        keywords: [
          'freight negotiator',
          'negotiate rates',
          'carrier negotiation',
          'rate negotiation',
          'how does negotiation work',
          'negotiator service',
        ],
        answer: `💼 **AI Freight Negotiator Service - How It Works:**\n\n**Service Function:**\nThe AI Freight Negotiator automatically negotiates rates with carriers using advanced AI algorithms that understand market conditions, carrier preferences, and historical data.\n\n**🔧 How It Works:**\n\n1️⃣ **Market Analysis:**\n   - Scans current market rates from Data Consortium\n   - Analyzes 2,847+ companies' rate data\n   - Identifies competitive positioning\n   - Tracks seasonal trends and demand\n\n2️⃣ **Carrier Profiling:**\n   - Reviews carrier performance history\n   - Analyzes preferred lanes and equipment\n   - Tracks negotiation patterns\n   - Identifies price sensitivity\n\n3️⃣ **Negotiation Strategy:**\n   - Starts with optimal rate (not highest)\n   - Uses human-like negotiation tactics\n   - Responds to counter-offers intelligently\n   - Knows when to walk away\n\n4️⃣ **Real-Time Negotiation:**\n   - Exchanges offers via email/text\n   - Responds within 2 minutes\n   - Adjusts strategy based on responses\n   - Closes deals automatically\n\n5️⃣ **Learning & Optimization:**\n   - Learns from every negotiation\n   - Improves success rate over time\n   - Adapts to individual carriers\n   - Shares insights across platform\n\n**📊 Performance Results:**\n   - Average 8-15% better rates than manual\n   - 92% acceptance rate on first offer\n   - 2.3 minutes average negotiation time\n   - 24/7 negotiation capability\n\n**💡 Example Negotiation:**\n   Load: Atlanta → Miami, Dry Van, 45K lbs\n   - Market rate: $2,100\n   - AI initial offer: $1,850 (strategic)\n   - Carrier counter: $1,975\n   - AI final: $1,900 ✅ Saved $200\n\n**Available in:** Premium and Enterprise plans`,
        actions: [
          {
            type: 'navigate',
            label: 'View Negotiations',
            url: '/broker-operations?tab=negotiations',
            description: 'See active negotiations',
            icon: '💼',
          },
        ],
        tier: 'premium',
      },
      loadOptimizationService: {
        keywords: [
          'load optimization',
          'optimize loads',
          'how does optimization work',
          'optimization service',
          'load consolidation',
          'multimodal optimization',
        ],
        answer: `🧠 **AI Load Optimization Service - Deep Dive:**\n\n**Service Function:**\nAnalyzes all loads in real-time to find cost savings through consolidation, mode shifting, and route optimization using advanced algorithms.\n\n**🔧 Core Functions:**\n\n1️⃣ **Multi-Modal Analysis:**\n   - Compares Truckload vs LTL costs\n   - Evaluates rail options for long-haul (500+ miles)\n   - Considers intermodal combinations\n   - Factors in time vs cost tradeoffs\n   \n   **Algorithm:**\n   - Quantum routing for optimal paths\n   - Monte Carlo simulation for reliability\n   - Linear programming for cost minimization\n   - Machine learning for demand prediction\n\n2️⃣ **Load Consolidation:**\n   - Identifies compatible loads (same region/timeframe)\n   - Calculates consolidation savings\n   - Manages split deliveries\n   - Optimizes truck capacity utilization\n   \n   **Process:**\n   - Scans all pending loads every 5 minutes\n   - Matches by geography + timing + compatibility\n   - Calculates combined rate vs separate\n   - Auto-suggests consolidation if >15% savings\n\n3️⃣ **Backhaul Matching:**\n   - Finds return loads for empty trucks\n   - Reduces deadhead miles by 40-60%\n   - Matches across your network + partners\n   - Real-time opportunity alerts\n\n4️⃣ **Carrier Selection:**\n   - Analyzes 50+ data points per carrier\n   - Performance score (safety, on-time, cost)\n   - Lane expertise and preferences\n   - Current location and availability\n   - Negotiation history and success\n\n5️⃣ **Continuous Optimization:**\n   - Runs every 5 minutes on active loads\n   - Adjusts for real-time conditions\n   - Traffic, weather, carrier availability\n   - Suggests mid-route changes when beneficial\n\n**📊 Optimization Metrics:**\n   - Average 15-30% cost reduction\n   - 47% reduction in empty miles\n   - 23% improvement in on-time delivery\n   - $12,450 average monthly savings\n\n**💡 Real Example:**\n   \n   **Before Optimization:**\n   - Load A: ATL→MIA, $2,100\n   - Load B: ATL→FTL, $1,950\n   - Load C: ATL→MIA, $2,150\n   Total: $6,200\n   \n   **After AI Optimization:**\n   - Consolidated A+C: $3,100 (same truck)\n   - Load B switched to LTL: $1,200\n   - Found backhaul: MIA→ATL, $850 revenue\n   **New Total: $3,450 + $850 = $2,600 net**\n   **Savings: $3,600 (58%!)**\n\n**🎯 Technical Implementation:**\n   - Runs on dedicated optimization servers\n   - Updates every 5 minutes\n   - Processes 10,000+ scenarios/second\n   - Integrates with dispatch system\n   - Auto-implements approved optimizations\n\n**Available in:** Premium (basic) and Enterprise (advanced)`,
        actions: [
          {
            type: 'navigate',
            label: 'Optimization Dashboard',
            url: '/ai-flow?tab=optimization',
            description: 'View optimization opportunities',
            icon: '🧠',
          },
          {
            type: 'navigate',
            label: 'Savings Report',
            url: '/analytics?tab=optimization',
            description: 'See your savings',
            icon: '💰',
          },
        ],
        tier: 'premium',
      },
      dataConsortiumService: {
        keywords: [
          'how does consortium work',
          'consortium service',
          'consortium data',
          'how is data collected',
          'consortium privacy',
          'data sharing',
        ],
        answer: `🌐 **Data Consortium Service - Technical Deep Dive:**\n\n**Service Function:**\nCollects, anonymizes, and analyzes operational data from 2,847+ transportation companies to provide competitive intelligence and benchmarking.\n\n**🔧 How The System Works:**\n\n1️⃣ **Data Collection:**\n   **What Gets Collected:**\n   - Load rates (per mile, lane-specific)\n   - On-time delivery percentages\n   - Fuel costs and efficiency\n   - Carrier performance metrics\n   - Invoice processing times\n   - Customer payment terms\n   - Operational efficiency KPIs\n   \n   **How It's Collected:**\n   - Automated data extraction (opt-in)\n   - End-of-day batch processing\n   - Real-time rate updates\n   - API integration with your TMS\n\n2️⃣ **Anonymization Process:**\n   **Security Measures:**\n   - All company identifiers removed\n   - Location data generalized (region not address)\n   - Customer names stripped\n   - Aggregated in groups of 50+ companies\n   - No individual company data visible\n   - GDPR and CCPA compliant\n   \n   **Technical Process:**\n   - SHA-256 hashing of identifiers\n   - Data normalized and bucketed\n   - Statistical noise added for privacy\n   - Minimum dataset requirements (50+ samples)\n\n3️⃣ **AI Analysis Engine:**\n   **What AI Does:**\n   - Identifies market trends\n   - Calculates percentile rankings\n   - Predicts rate movements\n   - Detects anomalies\n   - Generates insights\n   \n   **Algorithms Used:**\n   - Time series analysis for trends\n   - Clustering for company grouping\n   - Regression for rate prediction\n   - Neural networks for pattern detection\n\n4️⃣ **Benchmarking:**\n   **Comparison Categories:**\n   - By company size (revenue brackets)\n   - By fleet size (# of trucks)\n   - By geographic region\n   - By specialization (reefer, flatbed, etc.)\n   - By business model (carrier vs broker)\n   \n   **Metrics You Get:**\n   - Your cost per mile vs industry average\n   - On-time delivery ranking (percentile)\n   - Fuel efficiency comparison\n   - Revenue per truck vs peers\n   - Market rate accuracy\n\n5️⃣ **Real-Time Intelligence:**\n   **Updates:**\n   - Market rates: Updated hourly\n   - Performance benchmarks: Daily\n   - Trend analysis: Weekly\n   - Competitive positioning: Monthly\n   \n   **Alerts:**\n   - "Market rates increased 8% this week"\n   - "You're pricing 12% below market"\n   - "Competitors improving on-time delivery"\n   - "Peak season demand predicted in 3 weeks"\n\n**📊 Example Insights You'll See:**\n\n**Rate Intelligence:**\n   "ATL→MIA Dry Van market rate: $2.38/mile\n    Your average: $2.15/mile ⚠️\n    Top 25% charging: $2.55/mile\n    Recommendation: Increase rates 10-15%"\n\n**Performance Benchmarking:**\n   "Your on-time delivery: 87%\n    Industry average: 84% ✅\n    Top 10%: 94%\n    Gap to excellence: 7% improvement needed"\n\n**Competitive Intelligence:**\n   "Companies in your size bracket:\n    - Average revenue/truck: $185K\n    - Your revenue/truck: $167K\n    - Opportunity: $18K per truck"\n\n**🔒 Privacy Guarantees:**\n   ✅ Your data NEVER shown individually\n   ✅ You CANNOT identify competitors\n   ✅ Competitors CANNOT see your data\n   ✅ All insights are aggregated (50+ companies)\n   ✅ You can opt-out anytime\n   ✅ Data encrypted in transit and at rest\n\n**💡 Value Proposition:**\n   - Know market rates before quoting\n   - See where you rank vs competitors\n   - Identify improvement opportunities\n   - Predict market shifts early\n   - Data-driven pricing decisions\n\n**Available in:** Premium and Enterprise plans`,
        actions: [
          {
            type: 'navigate',
            label: 'Consortium Dashboard',
            url: '/data-consortium',
            description: 'View benchmarking data',
            icon: '🌐',
          },
          {
            type: 'help',
            label: 'Privacy Details',
            url: '/data-consortium?tab=privacy',
            description: 'Learn about data protection',
            icon: '🔒',
          },
        ],
        tier: 'premium',
      },
      unifiedLeadGenService: {
        keywords: [
          'how does lead generation work',
          'lead gen service',
          'unified lead generation',
          'trucking planet integration',
          'thomasnet',
          'lead scoring',
        ],
        answer: `🎯 **Unified Lead Generation Service - Complete Technical Breakdown:**\n\n**Service Function:**\nAutomatically discovers, scores, and delivers high-quality freight shipper leads from 2.17M+ companies across three major databases.\n\n**🔧 System Architecture:**\n\n1️⃣ **Data Source Integration:**\n   \n   **TruckingPlanet (500K+ carriers):**\n   - API integration with TruckingPlanet\n   - Real-time company data access\n   - Contact information extraction\n   - Company size and fleet data\n   \n   **ThomasNet (1.2M+ manufacturers):**\n   - Manufacturing company database\n   - Industry categorization\n   - Production capacity data\n   - Shipping needs analysis\n   \n   **FMCSA (470K+ DOT companies):**\n   - DOT/MC number verification\n   - Safety ratings and compliance\n   - Insurance verification\n   - Operating authority status\n   \n   **How Data Flows:**\n   - Automated daily sync (4 AM EST)\n   - Real-time updates via webhooks\n   - Incremental updates every 15 minutes\n   - Delta sync to avoid duplicates\n\n2️⃣ **AI Lead Scoring Algorithm:**\n   \n   **Scoring Factors (100 point scale):**\n   \n   **Company Size (25 points):**\n   - Revenue estimation\n   - Employee count\n   - Fleet size (if carrier)\n   - Facility count\n   \n   **Freight Volume (30 points):**\n   - Industry type\n   - Production capacity\n   - Historical shipping patterns\n   - Geographic distribution\n   \n   **Contact Quality (20 points):**\n   - Decision maker identified\n   - Direct phone numbers\n   - Email deliverability score\n   - LinkedIn profile verification\n   \n   **Propensity to Buy (25 points):**\n   - Current transportation provider\n   - Contract status (renewal dates)\n   - Growth indicators\n   - Pain point signals\n   \n   **Lead Quality Tiers:**\n   - 90-100 points: 🔥 Hot Lead (immediate outreach)\n   - 80-89 points: ⭐ High Quality (priority)\n   - 70-79 points: ✅ Good Lead (standard follow-up)\n   - 60-69 points: 👍 Qualified (nurture campaign)\n   - Below 60: ❌ Not qualified\n\n3️⃣ **Search & Filtering Engine:**\n   \n   **Search Parameters:**\n   - Industry (e.g., Automotive, Chemicals, Food)\n   - Geographic region (State, Metro, Radius)\n   - Company size (Revenue, Employees)\n   - Equipment needs (Dry Van, Reefer, Flatbed)\n   - Lead score minimum (70-95+)\n   \n   **Advanced Filters:**\n   - DOT rating (Satisfactory only)\n   - Insurance status (Active required)\n   - Operating authority (specific types)\n   - Distance from your terminals\n   - Exclude competitors\n\n4️⃣ **Lead Enrichment:**\n   \n   **Automatic Data Enhancement:**\n   - Company website scraping\n   - Social media profile linking\n   - News mention tracking\n   - Financial data lookup\n   - Technology stack identification\n   \n   **Contact Discovery:**\n   - Decision maker identification\n   - Email pattern detection\n   - Phone number verification\n   - LinkedIn profile matching\n   - Organizational chart mapping\n\n5️⃣ **Delivery & Integration:**\n   \n   **One-Click Actions:**\n   - Add to CRM (automatic)\n   - Start calling via dialer\n   - Send email sequence\n   - Schedule follow-up\n   - Export to CSV\n   \n   **CRM Integration:**\n   - Creates contact record\n   - Logs source and score\n   - Assigns to sales rep\n   - Triggers workflow\n   - Updates lead status\n\n**📊 Performance Metrics:**\n\n**Search Results:**\n   - Average search: 250-500 leads\n   - High-quality (80+): 50-100 leads\n   - Hot leads (90+): 10-25 leads\n   - Search time: 2-5 seconds\n\n**Lead Quality:**\n   - Contact accuracy: 94%\n   - Email deliverability: 89%\n   - Phone number valid: 92%\n   - Decision maker accuracy: 87%\n\n**Conversion Rates:**\n   - Hot leads (90+): 25-35% close rate\n   - High quality (80+): 15-20% close rate\n   - Good leads (70+): 8-12% close rate\n\n**💡 Real-World Example:**\n\n**Search Query:**\n   "Automotive manufacturers in Michigan"\n   + Minimum score: 80\n   + Equipment: Flatbed preferred\n   + Exclude current clients\n\n**Results:**\n   - 47 companies found\n   - 12 scored 90+ (hot leads)\n   - 23 scored 80-89 (high quality)\n   - 12 scored 70-79 (good)\n\n**Hot Lead Example:**\n   **ABC Automotive Parts**\n   Score: 94/100\n   - Revenue: $25M annually\n   - Employees: 200\n   - Freight volume: 150 shipments/month\n   - Decision maker: John Smith (VP Logistics)\n   - Email: john.smith@abcauto.com ✅\n   - Phone: (555) 123-4567 ✅\n   - Pain point: "Seeking better carrier"\n   - Est. monthly value: $8,500\n\n**6️⃣ ROI Calculation:**\n\n**Monthly Investment:** $289 (Premium) or $2,698 (Enterprise)\n\n**Expected Results (Conservative):**\n   - Generate 50 high-quality leads/month\n   - 10% close rate = 5 new customers\n   - Average customer value: $5,000/month\n   - Monthly revenue: $25,000\n   - **ROI: 865% (Premium) or 92% (Enterprise)**\n\n**Annual Value:**\n   - 5 customers × $5,000 × 12 months = $300,000\n   - Less subscription: $3,468 (Premium)\n   - **Net profit: $296,532**\n\n**Available in:** Premium (basic access) and Enterprise (full platform)`,
        actions: [
          {
            type: 'navigate',
            label: 'Start Generating Leads',
            url: '/ai-flow?tab=lead-gen',
            description: 'Search for leads now',
            icon: '🎯',
          },
          {
            type: 'navigate',
            label: 'View Tutorial',
            url: '/training/lead-generation',
            description: 'Learn the system',
            icon: '📚',
          },
        ],
        tier: 'premium',
      },
    };

    // Search knowledge base
    for (const [key, entry] of Object.entries(knowledgeBase)) {
      if (entry.keywords.some((keyword) => lowerQuery.includes(keyword))) {
        // Check subscription tier if required
        if (entry.tier && entry.tier !== 'all') {
          const hasAccess = this.checkTierAccess(
            context.subscriptionTier,
            entry.tier
          );
          if (!hasAccess) {
            return {
              type: 'UPGRADE_REQUIRED',
              message: `${entry.answer}\n\n⚠️ **This feature requires ${entry.tier.charAt(0).toUpperCase() + entry.tier.slice(1)} plan or higher.**\n\nYour current plan: ${context.subscriptionTier}`,
              upgradeInfo: `Upgrade to ${entry.tier} to access this feature`,
              actions: [
                {
                  type: 'navigate',
                  label: 'View Plans',
                  url: '/plans',
                  description: 'Compare subscription plans',
                  icon: '📋',
                },
                {
                  type: 'help',
                  label: 'Upgrade Now',
                  action: 'upgrade_subscription',
                  description: 'Upgrade your plan',
                  icon: '⬆️',
                },
              ],
            };
          }
        }

        return {
          type: 'GENERAL_AI',
          message: entry.answer,
          actions: entry.actions,
          metadata: {
            knowledgeBase: true,
          },
        };
      }
    }

    return null;
  }

  // ============================================================================
  // TIER ACCESS CHECK
  // ============================================================================

  private checkTierAccess(userTier: string, requiredTier: string): boolean {
    const tierLevels: Record<string, number> = {
      basic: 1,
      premium: 2,
      enterprise: 3,
    };

    const userLevel = tierLevels[userTier.toLowerCase()] || 0;
    const requiredLevel = tierLevels[requiredTier.toLowerCase()] || 0;

    return userLevel >= requiredLevel;
  }

  // ============================================================================
  // CONTEXT & UTILITY METHODS
  // ============================================================================

  private async getUserContext(): Promise<FlowterSecurityContext> {
    const { user } = getCurrentUser();

    return {
      userId: user.id,
      tenantId: 'default-tenant', // In production, get from user data
      role: user.role as any,
      permissions: [], // In production, get actual permissions
      subscriptionTier: 'premium', // In production, get from user subscription
    };
  }

  private addAssistantMessage(
    content: string,
    type?: string,
    actions?: FlowterAction[]
  ): void {
    this.conversationHistory.push({
      role: 'assistant',
      content,
      timestamp: new Date().toLocaleTimeString(),
      type,
      actions,
    });
  }

  private createErrorResponse(error: Error): FlowterResponse {
    return {
      type: 'ERROR',
      message:
        'I apologize, but I encountered an issue processing your request. Please try rephrasing your question or contact support if the problem persists.',
      suggestions: [
        'Try a simpler question',
        'Use keywords like "routing", "dispatch", or "invoicing"',
        'Ask for help with a specific feature',
      ],
    };
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  public getConversationHistory(): FlowterMessage[] {
    return [...this.conversationHistory];
  }

  public clearHistory(): void {
    this.conversationHistory = [];
    console.info('🗑️ Flowter AI conversation history cleared');
  }

  public async getQuickSuggestions(): Promise<string[]> {
    return [
      'Find routing features',
      'Help with dispatch',
      'Show me driver management',
      'Create new invoice',
      'Track my loads',
      'Optimize routes',
      'Generate reports',
    ];
  }
}

// Export singleton instance
export const enhancedFlowterAI = new EnhancedFlowterAI();
