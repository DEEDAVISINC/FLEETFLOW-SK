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
    | 'ERROR';
  message: string;
  actions?: FlowterAction[];
  options?: SelectionOption[];
  upgradeInfo?: string;
  restrictedFeatures?: any[];
  suggestions?: string[];
  quickHelp?: string[];
  helpText?: string;
  metadata?: {
    searchResults?: boolean;
    navigationReady?: boolean;
    requiresPermission?: string[];
    subscriptionTier?: string;
  };
}

export interface FlowterAction {
  type: 'navigate' | 'action' | 'help';
  label: string;
  url?: string;
  action?: string;
  description: string;
  icon: string;
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
  ];

  constructor() {
    this.searchEngine = new FlowterIntelligentSearch();
    console.log('🤖 Enhanced Flowter AI initialized with search capabilities');
  }

  // ============================================================================
  // MAIN QUERY HANDLER
  // ============================================================================

  async handleUserQuery(
    message: string,
    context?: FlowterSecurityContext
  ): Promise<FlowterResponse> {
    console.log(`🤖 Flowter AI processing: "${message}"`);

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
        console.log('🔍 Detected search/navigation request');
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

      // Step 2: Check if this is a help/tutorial request
      if (this.isHelpQuery(message)) {
        console.log('❓ Detected help/tutorial request');
        const helpResponse = await this.handleHelpQuery(message, userContext);
        this.addAssistantMessage(helpResponse.message, helpResponse.type);
        return helpResponse;
      }

      // Step 3: Handle general AI queries (existing functionality)
      console.log('💬 Processing as general AI query');
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
    }

    // If we can identify a topic, try to find the feature and provide help
    if (topic) {
      const searchResults = await this.searchEngine.search(topic, context);
      if (searchResults.type === 'DIRECT_NAVIGATION' && searchResults.item) {
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
    console.log('🗑️ Flowter AI conversation history cleared');
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
