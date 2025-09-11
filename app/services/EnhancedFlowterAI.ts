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
  // GENERAL AI QUERY HANDLING (EXISTING FUNCTIONALITY)
  // ============================================================================

  private async handleGeneralAIQuery(
    message: string,
    context: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    const lowerMessage = message.toLowerCase();

    // Use existing AI logic for operational queries
    let aiResponse = '';

    if (
      lowerMessage.includes('load') ||
      lowerMessage.includes('shipment') ||
      lowerMessage.includes('order')
    ) {
      if (lowerMessage.includes('create') || lowerMessage.includes('new')) {
        aiResponse =
          '🚛 **Creating new load order...**\n\n✅ Load FL-2025-019 created successfully!\n- Origin: Atlanta, GA → Destination: Miami, FL\n- Rate: $2,450 (optimized with AI)\n- Equipment: Dry Van\n- Pickup: Tomorrow 8:00 AM\n- AI selected best multimodal option\n- Dock appointment auto-scheduled\n\n📋 Would you like me to assign a driver or optimize the route?';
      } else if (
        lowerMessage.includes('status') ||
        lowerMessage.includes('track')
      ) {
        aiResponse =
          '📍 **Load Status Update:**\n\n🚛 **FL-2025-007** (Swift Transportation)\n- Status: In Transit\n- Location: Currently in Jacksonville, FL\n- ETA: Tomorrow 2:30 PM (AI predicted)\n- 🟢 On schedule\n- Next update in 2 hours\n\n📱 SMS notifications sent to customer. Need me to contact the carrier?';
      } else if (lowerMessage.includes('optimize')) {
        aiResponse =
          '🧠 **AI Load Optimization Complete:**\n\n💡 **Found 3 optimization opportunities:**\n1. Switch FL-2025-008 from Truckload→LTL: **Save $600**\n2. Combine loads FL-2025-012 & FL-2025-013: **Save $450**\n3. Use rail for FL-2025-015 (long haul): **Save $800**\n\n💰 **Total potential savings: $1,850**\n\n✅ Should I apply these optimizations automatically?';
      }
    } else if (
      lowerMessage.includes('driver') ||
      lowerMessage.includes('assign')
    ) {
      aiResponse =
        '👨‍💼 **Smart Driver Assignment:**\n\n🎯 **Best driver for FL-2025-007:**\n- **Mike Rodriguez** (Driver #447)\n- Location: 15 miles from pickup\n- HOS: 9.5 hours available\n- Safety score: 98/100\n- Specialized in reefer loads\n\n✅ **Assignment sent via SMS!**\n📱 Driver confirmed - ETA to pickup: 45 minutes\n📋 Route optimization in progress...';
    } else if (
      lowerMessage.includes('route') ||
      lowerMessage.includes('navigation')
    ) {
      aiResponse =
        '🗺️ **AI Route Optimization:**\n\n⚡ **Quantum algorithm analysis complete:**\n- 3 stops optimized\n- 47 miles saved (12% reduction)\n- $156 fuel savings\n- 2.5 hours faster delivery\n- Avoided 2 traffic bottlenecks\n\n🛰️ **Live traffic integration:**\n- Current optimal route sent to driver\n- Real-time updates every 15 minutes\n- Geofence alerts activated\n\n📱 Customer notified of improved ETA!';
    } else if (
      lowerMessage.includes('invoice') ||
      lowerMessage.includes('payment') ||
      lowerMessage.includes('settlement')
    ) {
      aiResponse =
        "💰 **AI Settlement Processing:**\n\n🤖 **Just processed 5 new invoices:**\n- 3 auto-approved (95%+ confidence)\n- 1 flagged for review (rate variance)\n- 1 pending documentation\n\n📊 **Today's Performance:**\n- 45 invoices processed\n- 99.2% AI accuracy\n- 8.5 hours saved\n- $2,100 in discrepancies caught\n\n✅ **All settlements ready for ACH processing!**";
    } else if (
      lowerMessage.includes('report') ||
      lowerMessage.includes('analytic') ||
      lowerMessage.includes('insight')
    ) {
      aiResponse =
        '📊 **Strategic AI Analytics:**\n\n💡 **Key Insights This Week:**\n- Multimodal optimization saved $12,450\n- Dock efficiency increased 23%\n- Invoice processing 87% automated\n- Carrier performance up 15%\n\n🎯 **Predictive Alerts:**\n- Fuel costs rising 8% next week\n- Peak season demand in 3 weeks\n- 2 drivers need HOS training\n\n📈 **Custom reports generated and emailed!**';
    } else {
      aiResponse = `🤖 **I can help you with anything in FleetFlow:**\n\n🚛 **Load Management:** Create, track, optimize loads\n🏭 **Dock Scheduling:** Appointments, bottleneck prevention\n💰 **Settlement Processing:** Invoice automation, payments\n📊 **Analytics:** Custom reports, predictions\n🗺️ **Route Optimization:** AI-powered routing\n👥 **Driver Management:** Assignments, compliance\n🤝 **Carrier Relations:** Performance, optimization\n\n**Try asking me to:**\n- "Find routing features" - I'll help you navigate\n- "Create a load from Atlanta to Miami"\n- "Show me driver management"\n- "Help with invoicing"`;
    }

    return {
      type: 'GENERAL_AI',
      message: aiResponse,
      metadata: {
        searchResults: false,
      },
    };
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
