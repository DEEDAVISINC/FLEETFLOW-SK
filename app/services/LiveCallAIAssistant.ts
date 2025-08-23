/**
 * Live Call AI Assistant Service
 * Real-time conversational AI support during active phone calls
 * Native FleetFlow implementation of SalesAI-like capabilities
 */

export interface LiveCallContext {
  callId: string;
  contactId: string;
  contactName: string;
  contactCompany: string;
  callDirection: 'inbound' | 'outbound';
  duration: number;
  transcript?: string[];
  agentId: string;
  agentName: string;
}

export interface AICallRecommendation {
  type:
    | 'response_suggestion'
    | 'objection_handler'
    | 'next_action'
    | 'competitive_intel'
    | 'pricing_guidance';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  reasoning: string;
  confidence: number; // 0-1
  timing: 'immediate' | 'when_appropriate' | 'before_close';
}

export interface LiveTranscriptionData {
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
}

export interface ConversationAnalysis {
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    trend: 'improving' | 'stable' | 'declining';
    confidence: number;
  };
  intent: {
    detected: string[];
    primary: string;
    confidence: number;
  };
  objections: {
    raised: string[];
    handled: string[];
    pending: string[];
  };
  opportunities: {
    identified: string[];
    potential_value: number;
    urgency: 'high' | 'medium' | 'low';
  };
}

export class LiveCallAIAssistant {
  private static instance: LiveCallAIAssistant;
  private activeCalls: Map<string, LiveCallContext> = new Map();
  private liveRecommendations: Map<string, AICallRecommendation[]> = new Map();

  // Freight Industry Knowledge Base
  private freightKnowledgeBase = {
    // Common freight terms and explanations
    terminology: {
      LTL: 'Less Than Truckload - partial shipments that share truck space',
      FTL: 'Full Truckload - dedicated truck for single shipment',
      Drayage: 'Short-distance transport, typically from port to warehouse',
      Intermodal: 'Using multiple transportation modes (truck, rail, ship)',
      Reefer: 'Refrigerated trailer for temperature-sensitive cargo',
      Flatbed: 'Open trailer for oversized or heavy equipment',
      'Dry Van': 'Standard enclosed trailer for general freight',
      Backhaul: 'Return trip with freight to avoid empty miles',
    },

    // Common objections and responses
    objectionHandlers: {
      rates_too_high: {
        response:
          'I understand rate is important. Let me show you how our fuel efficiency and on-time delivery actually saves you money overall. Our average fuel savings are 18.7% compared to industry standard.',
        followUp:
          'Would you like me to run a cost-benefit analysis comparing our total cost vs just the base rate?',
      },
      existing_broker: {
        response:
          "That's great that you have a relationship. We're not looking to replace your current broker entirely - we specialize in overflow and specialized freight that might not be their focus.",
        followUp:
          'What types of freight does your current broker handle best? We might complement them perfectly.',
      },
      capacity_concerns: {
        response:
          'I appreciate that concern. We have 2,847+ carriers in our network with real-time capacity tracking. Our 94.2% load matching accuracy ensures we always have backup options.',
        followUp:
          'Would you like me to show you our carrier network for your specific lanes?',
      },
      price_shopping: {
        response:
          'Smart approach to get quotes. What matters most to you - the lowest rate, or the most reliable service? We focus on total value: rate + reliability + service.',
        followUp:
          'What has your experience been with the lowest bidder in the past?',
      },
      decision_timeframe: {
        response:
          'I understand you need time. Freight rates can change quickly though. Would it help if I locked in this quote for 48 hours while you decide?',
        followUp: 'What information would help you make this decision faster?',
      },
    },

    // Competitive intelligence
    competitorResponses: {
      landstar: {
        advantages:
          'We offer more personalized service and faster response times',
        approach:
          'Landstar is a great company. Our advantage is AI-powered optimization that reduces costs by 15% on average.',
      },
      ch_robinson: {
        advantages: 'Better technology and more transparent pricing',
        approach:
          'CHR is solid. We differentiate with real-time tracking and 30% faster quote turnaround through AI automation.',
      },
      freight_broker: {
        advantages:
          'More comprehensive service and better carrier relationships',
        approach:
          'Traditional brokers provide good service. We add AI optimization and predictive analytics for better outcomes.',
      },
    },

    // Pricing guidance based on FleetFlow data
    pricingStrategies: {
      high_volume_customer: {
        approach:
          'Volume discount available - can offer 8-12% reduction for guaranteed monthly volume',
        requirements: 'Minimum 20 loads per month commitment',
      },
      seasonal_customer: {
        approach:
          'Seasonal rate structure - peak season premium, off-season discount',
        benefits: 'Guaranteed capacity during peak times',
      },
      spot_market: {
        approach: 'Market rate + service premium for reliability',
        justification:
          '3% premium ensures dedicated attention and priority handling',
      },
    },
  };

  private constructor() {
    console.log(
      '🤖 Live Call AI Assistant initialized with freight industry knowledge'
    );
  }

  public static getInstance(): LiveCallAIAssistant {
    if (!LiveCallAIAssistant.instance) {
      LiveCallAIAssistant.instance = new LiveCallAIAssistant();
    }
    return LiveCallAIAssistant.instance;
  }

  /**
   * Start AI assistance for a live call
   */
  public startCallAssistance(callContext: LiveCallContext): void {
    this.activeCalls.set(callContext.callId, callContext);
    this.liveRecommendations.set(callContext.callId, []);

    console.log(
      `🎯 AI assistance started for call ${callContext.callId} with ${callContext.contactName}`
    );

    // Generate initial recommendations based on contact history
    this.generateInitialRecommendations(callContext);
  }

  /**
   * Process live transcription and provide real-time recommendations
   */
  public processLiveTranscription(
    callId: string,
    transcription: LiveTranscriptionData
  ): AICallRecommendation[] {
    const callContext = this.activeCalls.get(callId);
    if (!callContext) return [];

    // Add transcription to context
    if (!callContext.transcript) callContext.transcript = [];
    callContext.transcript.push(
      `${transcription.speaker}: ${transcription.text}`
    );

    // Analyze the latest customer statement for AI recommendations
    if (transcription.speaker === 'customer') {
      const recommendations = this.analyzeCustomerStatement(
        transcription.text,
        callContext
      );

      // Update live recommendations
      const existingRecs = this.liveRecommendations.get(callId) || [];
      this.liveRecommendations.set(callId, [
        ...existingRecs,
        ...recommendations,
      ]);

      return recommendations;
    }

    return [];
  }

  /**
   * Analyze customer statement and generate AI recommendations
   */
  private analyzeCustomerStatement(
    customerText: string,
    callContext: LiveCallContext
  ): AICallRecommendation[] {
    const recommendations: AICallRecommendation[] = [];
    const lowerText = customerText.toLowerCase();

    // Detect objections and provide handlers
    Object.entries(this.freightKnowledgeBase.objectionHandlers).forEach(
      ([objection, handler]) => {
        if (this.detectsObjection(lowerText, objection)) {
          recommendations.push({
            type: 'objection_handler',
            priority: 'high',
            suggestion: handler.response,
            reasoning: `Customer raised ${objection.replace('_', ' ')} objection`,
            confidence: 0.85,
            timing: 'immediate',
          });

          // Add follow-up suggestion
          recommendations.push({
            type: 'next_action',
            priority: 'medium',
            suggestion: handler.followUp,
            reasoning: 'Follow-up question to address objection completely',
            confidence: 0.75,
            timing: 'when_appropriate',
          });
        }
      }
    );

    // Detect competitor mentions
    Object.entries(this.freightKnowledgeBase.competitorResponses).forEach(
      ([competitor, response]) => {
        if (lowerText.includes(competitor.replace('_', ' '))) {
          recommendations.push({
            type: 'competitive_intel',
            priority: 'high',
            suggestion: response.approach,
            reasoning: `Customer mentioned ${competitor}`,
            confidence: 0.9,
            timing: 'immediate',
          });
        }
      }
    );

    // Detect pricing discussions
    if (
      lowerText.includes('price') ||
      lowerText.includes('rate') ||
      lowerText.includes('cost')
    ) {
      const strategy = this.determinePricingStrategy(callContext);
      recommendations.push({
        type: 'pricing_guidance',
        priority: 'high',
        suggestion: strategy.approach,
        reasoning: `Customer discussing pricing - ${strategy.reasoning}`,
        confidence: 0.8,
        timing: 'immediate',
      });
    }

    // Detect buying signals
    if (this.detectsBuyingSignal(lowerText)) {
      recommendations.push({
        type: 'next_action',
        priority: 'high',
        suggestion:
          "This sounds like a buying signal. Ask: 'Would you like me to prepare a formal quote for this shipment?'",
        reasoning: 'Customer showing purchase intent',
        confidence: 0.85,
        timing: 'immediate',
      });
    }

    // Suggest freight terminology explanations
    Object.entries(this.freightKnowledgeBase.terminology).forEach(
      ([term, explanation]) => {
        if (
          lowerText.includes(term.toLowerCase()) &&
          !lowerText.includes(explanation.toLowerCase())
        ) {
          recommendations.push({
            type: 'response_suggestion',
            priority: 'low',
            suggestion: `Consider explaining: "${term} means ${explanation}"`,
            reasoning: `Customer mentioned ${term} - might need clarification`,
            confidence: 0.65,
            timing: 'when_appropriate',
          });
        }
      }
    );

    return recommendations;
  }

  /**
   * Generate initial recommendations based on contact history
   */
  private generateInitialRecommendations(callContext: LiveCallContext): void {
    const recommendations: AICallRecommendation[] = [];

    // Add opening recommendation based on call direction
    if (callContext.callDirection === 'outbound') {
      recommendations.push({
        type: 'response_suggestion',
        priority: 'high',
        suggestion: `Hi ${callContext.contactName}, this is ${callContext.agentName} from FleetFlow. I'm calling about freight opportunities for ${callContext.contactCompany}. Do you have a quick minute?`,
        reasoning: 'Professional outbound call opening',
        confidence: 0.95,
        timing: 'immediate',
      });
    }

    // Add company-specific recommendations if available
    recommendations.push({
      type: 'response_suggestion',
      priority: 'medium',
      suggestion: `I see ${callContext.contactCompany} in our system. What types of freight are you typically shipping?`,
      reasoning: 'Gather information about freight needs',
      confidence: 0.85,
      timing: 'when_appropriate',
    });

    this.liveRecommendations.set(callContext.callId, recommendations);
  }

  /**
   * Get current AI recommendations for a call
   */
  public getCallRecommendations(callId: string): AICallRecommendation[] {
    return this.liveRecommendations.get(callId) || [];
  }

  /**
   * End call assistance and generate summary
   */
  public endCallAssistance(callId: string): ConversationAnalysis {
    const callContext = this.activeCalls.get(callId);
    if (!callContext) {
      return this.getEmptyAnalysis();
    }

    const analysis = this.generateConversationAnalysis(callContext);

    // Clean up
    this.activeCalls.delete(callId);
    this.liveRecommendations.delete(callId);

    console.log(
      `✅ AI assistance completed for call ${callId} - Analysis generated`
    );
    return analysis;
  }

  /**
   * Helper methods for text analysis
   */
  private detectsObjection(text: string, objectionType: string): boolean {
    const objectionKeywords: Record<string, string[]> = {
      rates_too_high: [
        'expensive',
        'high',
        'cost',
        'price',
        'cheaper',
        'too much',
      ],
      existing_broker: [
        'already have',
        'current broker',
        'working with',
        'established',
      ],
      capacity_concerns: [
        'capacity',
        'available',
        'guarantee',
        'backup',
        'coverage',
      ],
      price_shopping: [
        'quotes',
        'comparing',
        'other companies',
        'checking',
        'shopping',
      ],
      decision_timeframe: [
        'think about',
        'get back',
        'discuss',
        'time',
        'later',
      ],
    };

    const keywords = objectionKeywords[objectionType] || [];
    return keywords.some((keyword) => text.includes(keyword));
  }

  private detectsBuyingSignal(text: string): boolean {
    const buyingSignals = [
      'when can',
      'how soon',
      'next step',
      'move forward',
      'lets do',
      'sounds good',
      'quote',
      'proposal',
      'contract',
      'agreement',
      'pricing',
      'rate sheet',
    ];
    return buyingSignals.some((signal) => text.includes(signal));
  }

  private determinePricingStrategy(callContext: LiveCallContext): {
    approach: string;
    reasoning: string;
  } {
    // Simple logic - in production this would use more sophisticated analysis
    if (
      callContext.contactCompany.toLowerCase().includes('walmart') ||
      callContext.contactCompany.toLowerCase().includes('amazon')
    ) {
      return {
        approach:
          this.freightKnowledgeBase.pricingStrategies.high_volume_customer
            .approach,
        reasoning: 'Large enterprise customer - volume discount applicable',
      };
    }

    return {
      approach:
        this.freightKnowledgeBase.pricingStrategies.spot_market.approach,
      reasoning: 'Standard customer - market rate + service premium',
    };
  }

  private generateConversationAnalysis(
    callContext: LiveCallContext
  ): ConversationAnalysis {
    const transcript = callContext.transcript?.join(' ') || '';

    // Simple analysis - in production this would use more sophisticated NLP
    return {
      sentiment: {
        overall: this.analyzeSentiment(transcript),
        trend: 'stable',
        confidence: 0.75,
      },
      intent: {
        detected: ['freight_inquiry', 'price_discussion'],
        primary: 'freight_inquiry',
        confidence: 0.85,
      },
      objections: {
        raised: this.extractObjections(transcript),
        handled: [],
        pending: [],
      },
      opportunities: {
        identified: ['potential_regular_shipments'],
        potential_value: 50000,
        urgency: 'medium',
      },
    };
  }

  private analyzeSentiment(
    transcript: string
  ): 'positive' | 'neutral' | 'negative' {
    const positive = [
      'great',
      'good',
      'excellent',
      'perfect',
      'yes',
      'sounds good',
    ];
    const negative = ['no', 'not', 'bad', 'problem', 'issue', 'concern'];

    const lowerTranscript = transcript.toLowerCase();
    const positiveCount = positive.filter((word) =>
      lowerTranscript.includes(word)
    ).length;
    const negativeCount = negative.filter((word) =>
      lowerTranscript.includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private extractObjections(transcript: string): string[] {
    const objections: string[] = [];
    const lowerTranscript = transcript.toLowerCase();

    if (
      lowerTranscript.includes('expensive') ||
      lowerTranscript.includes('high')
    ) {
      objections.push('pricing_concern');
    }
    if (
      lowerTranscript.includes('already have') ||
      lowerTranscript.includes('current')
    ) {
      objections.push('existing_relationship');
    }

    return objections;
  }

  private getEmptyAnalysis(): ConversationAnalysis {
    return {
      sentiment: { overall: 'neutral', trend: 'stable', confidence: 0 },
      intent: { detected: [], primary: '', confidence: 0 },
      objections: { raised: [], handled: [], pending: [] },
      opportunities: { identified: [], potential_value: 0, urgency: 'low' },
    };
  }
}

// Export singleton instance
export const liveCallAIAssistant = LiveCallAIAssistant.getInstance();
