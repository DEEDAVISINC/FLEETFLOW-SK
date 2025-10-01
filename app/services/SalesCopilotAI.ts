/**
 * SalesCopilotAI - Real-Time Sales Guidance System
 *
 * Provides undetectable, real-time sales assistance to human agents during calls,
 * rivaling yurp.ai with DEPOINTE AI staff expertise and transportation intelligence.
 *
 * Features:
 * ✅ Discovery question generation and probing
 * ✅ Objection handling with psychology-based responses
 * ✅ Instant FAQ answers from knowledge base
 * ✅ Deal closing algorithms and scripts
 * ✅ Real-time guidance delivery via WebSocket
 * ✅ DEPOINTE AI staff integration for sales expertise
 * ✅ FreightBrainAI transportation intelligence
 * ✅ Performance tracking and adaptive learning
 */

import { depointeStaff } from '../depointe-dashboard/page';
import { automatedSupervisionService } from './AutomatedSupervisionService';
import { DEPOINTEAdaptiveLearningService } from './DEPOINTEAdaptiveLearningService';
import { freightBrainAI } from './FreightBrainAI';
import { humanizedAIService } from './HumanizedAIService';
import { webSocketNotificationService } from './WebSocketNotificationService';

export interface SalesCallContext {
  callId: string;
  agentId: string;
  prospectInfo: {
    name?: string;
    company?: string;
    industry?: string;
    painPoints?: string[];
    budget?: number;
    timeline?: string;
  };
  conversationStage:
    | 'greeting'
    | 'discovery'
    | 'qualification'
    | 'objection_handling'
    | 'demonstration'
    | 'negotiation'
    | 'closing'
    | 'follow_up';
  assignedAIStaff: string[]; // DEPOINTE staff assigned to this call
  confidenceScore: number;
  objectionHistory: ObjectionRecord[];
  discoveryQuestions: DiscoveryQuestion[];
}

export interface ObjectionRecord {
  objection: string;
  handled: boolean;
  resolution?: string;
  timestamp: Date;
  effectiveness: number;
}

export interface DiscoveryQuestion {
  question: string;
  category: 'pain_points' | 'budget' | 'timeline' | 'competition' | 'authority';
  priority: 'high' | 'medium' | 'low';
  asked: boolean;
  answered: boolean;
  followUps: string[];
}

export interface SalesGuidance {
  type:
    | 'question'
    | 'objection_response'
    | 'faq_answer'
    | 'closing_script'
    | 'negotiation_tactic';
  content: string;
  confidence: number;
  source: 'depointe_staff' | 'freightbrain_ai' | 'humanized_ai' | 'platform_ai';
  deliveryMethod: 'earpiece' | 'screen' | 'both';
  urgency: 'immediate' | 'high' | 'normal' | 'low';
  alternatives?: string[]; // Alternative responses
}

export interface ClosingStrategy {
  strategy: string;
  confidence: number;
  script: string;
  objections: string[];
  successRate: number;
  transportationSpecific: boolean;
}

export class SalesCopilotAI {
  private activeCalls: Map<string, SalesCallContext> = new Map();
  private learningService: DEPOINTEAdaptiveLearningService;
  private faqCache: Map<string, string> = new Map();
  private objectionPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.learningService = new DEPOINTEAdaptiveLearningService();
    this.initializeFAQCache();
    this.initializeObjectionPatterns();
  }

  // ============================================
  // CORE SALES GUIDANCE METHODS
  // ============================================

  /**
   * Start real-time guidance for a sales call
   */
  async startCallGuidance(
    callId: string,
    agentId: string,
    initialProspectInfo: Partial<SalesCallContext['prospectInfo']> = {}
  ): Promise<SalesCallContext> {
    const context: SalesCallContext = {
      callId,
      agentId,
      prospectInfo: initialProspectInfo,
      conversationStage: 'greeting',
      assignedAIStaff: this.assignAIStaff(initialProspectInfo),
      confidenceScore: 0.8,
      objectionHistory: [],
      discoveryQuestions: this.generateInitialDiscoveryQuestions(),
    };

    this.activeCalls.set(callId, context);

    // Send initial guidance
    await this.deliverGuidance(callId, {
      type: 'question',
      content:
        'Listen for their main challenge and pain points in the greeting',
      confidence: 0.9,
      source: 'depointe_staff',
      deliveryMethod: 'earpiece',
      urgency: 'normal',
    });

    return context;
  }

  /**
   * Process real-time conversation input and provide guidance
   */
  async processConversationInput(
    callId: string,
    agentMessage: string,
    prospectResponse: string
  ): Promise<SalesGuidance[]> {
    const context = this.activeCalls.get(callId);
    if (!context) throw new Error(`Call ${callId} not found`);

    const guidance: SalesGuidance[] = [];

    // Analyze conversation and update context
    await this.analyzeConversation(callId, agentMessage, prospectResponse);

    // Generate appropriate guidance based on stage
    switch (context.conversationStage) {
      case 'discovery':
        guidance.push(...(await this.generateDiscoveryGuidance(context)));
        break;
      case 'objection_handling':
        guidance.push(...(await this.generateObjectionGuidance(context)));
        break;
      case 'closing':
        guidance.push(...(await this.generateClosingGuidance(context)));
        break;
    }

    // Check for FAQ triggers
    const faqGuidance = await this.checkFAQTriggers(prospectResponse);
    if (faqGuidance) guidance.push(faqGuidance);

    // Deliver guidance
    for (const guide of guidance) {
      await this.deliverGuidance(callId, guide);
    }

    return guidance;
  }

  // ============================================
  // DISCOVERY QUESTION GENERATION
  // ============================================

  private generateInitialDiscoveryQuestions(): DiscoveryQuestion[] {
    return [
      {
        question:
          "What's been your biggest challenge with logistics costs lately?",
        category: 'pain_points',
        priority: 'high',
        asked: false,
        answered: false,
        followUps: [
          'How much are you currently spending on transportation?',
          "What's your biggest pain point with your current carrier relationships?",
        ],
      },
      {
        question: "What's your typical shipment volume and types?",
        category: 'authority',
        priority: 'high',
        asked: false,
        answered: false,
        followUps: [
          'Do you work with any specific types of freight?',
          "What's your busiest shipping lane?",
        ],
      },
      {
        question:
          "What's your timeline for making changes to your transportation setup?",
        category: 'timeline',
        priority: 'medium',
        asked: false,
        answered: false,
        followUps: [
          'What would need to happen for you to switch providers?',
          'Are you under any immediate pressure to reduce costs?',
        ],
      },
      {
        question:
          "What's your current budget range for transportation solutions?",
        category: 'budget',
        priority: 'medium',
        asked: false,
        answered: false,
        followUps: [
          "What's your target cost per shipment?",
          'How does this compare to your current spending?',
        ],
      },
    ];
  }

  private async generateDiscoveryGuidance(
    context: SalesCallContext
  ): Promise<SalesGuidance[]> {
    const guidance: SalesGuidance[] = [];
    const unansweredHighPriority = context.discoveryQuestions.filter(
      (q) => !q.asked && q.priority === 'high'
    );

    if (unansweredHighPriority.length > 0) {
      const nextQuestion = unansweredHighPriority[0];
      guidance.push({
        type: 'question',
        content: `Ask: "${nextQuestion.question}"`,
        confidence: 0.95,
        source: 'depointe_staff',
        deliveryMethod: 'earpiece',
        urgency: 'high',
        alternatives: nextQuestion.followUps,
      });
    }

    // Add transportation-specific intelligence
    const freightInsights = await this.getFreightIntelligence(
      context.prospectInfo
    );
    if (freightInsights) {
      guidance.push({
        type: 'question',
        content: freightInsights,
        confidence: 0.9,
        source: 'freightbrain_ai',
        deliveryMethod: 'screen',
        urgency: 'normal',
      });
    }

    return guidance;
  }

  // ============================================
  // OBJECTION HANDLING
  // ============================================

  private async generateObjectionGuidance(
    context: SalesCallContext
  ): Promise<SalesGuidance[]> {
    const guidance: SalesGuidance[] = [];
    const lastObjection =
      context.objectionHistory[context.objectionHistory.length - 1];

    if (lastObjection && !lastObjection.handled) {
      // Get DEPOINTE AI staff expertise for objection handling
      const staffGuidance = await this.getAIStaffObjectionResponse(
        lastObjection.objection,
        context.assignedAIStaff[0]
      );

      if (staffGuidance) {
        guidance.push({
          type: 'objection_response',
          content: staffGuidance,
          confidence: 0.9,
          source: 'depointe_staff',
          deliveryMethod: 'earpiece',
          urgency: 'immediate',
        });
      }

      // Get humanized response alternatives
      const alternatives = humanizedAIService.handleObjection(
        lastObjection.objection
      );
      if (alternatives) {
        guidance.push({
          type: 'objection_response',
          content: alternatives,
          confidence: 0.85,
          source: 'humanized_ai',
          deliveryMethod: 'screen',
          urgency: 'high',
          alternatives: humanizedAIService.handleObjection(
            lastObjection.objection
          ),
        });
      }
    }

    return guidance;
  }

  private async getAIStaffObjectionResponse(
    objection: string,
    staffId: string
  ): Promise<string> {
    const staff = depointeStaff.find((s) => s.id === staffId);
    if (!staff || !staff.marketingMastery?.aiApplications) return '';

    // Use DEPOINTE staff expertise for objection handling
    const objectionPatterns = [
      'too expensive',
      'not interested',
      'happy with current',
      'need to think',
      'call me back',
      'send information',
      'competition is cheaper',
    ];

    const matchedPattern = objectionPatterns.find((pattern) =>
      objection.toLowerCase().includes(pattern)
    );

    if (
      matchedPattern &&
      staff.learningAbilities.includes('Resistance Removal Sales System Expert')
    ) {
      return this.generatePsychologyBasedResponse(objection, staff);
    }

    return '';
  }

  private generatePsychologyBasedResponse(
    objection: string,
    staff: any
  ): string {
    const responses = {
      'too expensive': [
        "I understand budget concerns are real. But let me ask you this - what's costing you more: our service, or the hidden costs of your current setup? Most companies find they actually save money.",
        "Price is important, but it's not the only factor. What's more valuable to you: saving a few dollars per shipment, or having reliable, on-time delivery that doesn't disrupt your business?",
      ],
      'not interested': [
        "I get that completely - you get these calls all the time. But I'm not trying to sell you anything today. I just want to understand your current challenges and see if there's something specific I can help with.",
        'Fair enough. What would need to change for you to be interested in exploring new transportation options?',
      ],
      'happy with current': [
        "That's great to hear! You must have a good system in place. I'm curious though - what would make a good system even better for you?",
        'I love working with companies that have solid systems. What are you most proud of about your current transportation setup?',
      ],
    };

    const objectionType = Object.keys(responses).find((key) =>
      objection.toLowerCase().includes(key.replace(' ', ''))
    );

    if (objectionType) {
      const responseOptions = responses[objectionType];
      return responseOptions[
        Math.floor(Math.random() * responseOptions.length)
      ];
    }

    return 'I understand your concern. Let me ask you this - what would need to change for this to make sense for you?';
  }

  // ============================================
  // FAQ ANSWERS
  // ============================================

  private async checkFAQTriggers(
    prospectResponse: string
  ): Promise<SalesGuidance | null> {
    const faqTriggers = [
      'pricing',
      'cost',
      'rates',
      'fee',
      'payment',
      'contract',
      'integration',
      'setup',
      'implementation',
      'training',
      'support',
      'help',
      'service',
      'reliability',
      'tracking',
      'insurance',
      'claims',
      'compliance',
      'safety',
      'equipment',
    ];

    const triggeredWord = faqTriggers.find((word) =>
      prospectResponse.toLowerCase().includes(word)
    );

    if (triggeredWord && this.faqCache.has(triggeredWord)) {
      return {
        type: 'faq_answer',
        content: this.faqCache.get(triggeredWord)!,
        confidence: 0.95,
        source: 'freightbrain_ai',
        deliveryMethod: 'screen',
        urgency: 'high',
      };
    }

    return null;
  }

  private initializeFAQCache(): void {
    this.faqCache.set(
      'pricing',
      'Our pricing is volume-based with no hidden fees. Most clients see 15-25% savings within 90 days.'
    );
    this.faqCache.set(
      'contract',
      'Flexible 30-90 day terms with no long-term commitments. Easy to scale up or down.'
    );
    this.faqCache.set(
      'integration',
      'API integration takes 2-4 weeks. We handle most of the technical work.'
    );
    this.faqCache.set(
      'support',
      '24/7 dedicated support team with average 15-minute response time.'
    );
    this.faqCache.set(
      'tracking',
      'Real-time GPS tracking with ETA updates and automated notifications.'
    );
    this.faqCache.set(
      'insurance',
      'Full cargo insurance included with $1M per shipment coverage.'
    );
    this.faqCache.set(
      'compliance',
      'FMCSA compliant with DOT authority and clean safety ratings.'
    );
  }

  // ============================================
  // DEAL CLOSING
  // ============================================

  private async generateClosingGuidance(
    context: SalesCallContext
  ): Promise<SalesGuidance[]> {
    const guidance: SalesGuidance[] = [];

    // Generate closing strategies based on context
    const strategies = await this.generateClosingStrategies(context);

    if (strategies.length > 0) {
      const bestStrategy = strategies[0];
      guidance.push({
        type: 'closing_script',
        content: bestStrategy.script,
        confidence: bestStrategy.confidence,
        source: 'depointe_staff',
        deliveryMethod: 'earpiece',
        urgency: 'immediate',
      });
    }

    return guidance;
  }

  private async generateClosingStrategies(
    context: SalesCallContext
  ): Promise<ClosingStrategy[]> {
    const strategies: ClosingStrategy[] = [];

    // Assumption close
    strategies.push({
      strategy: 'assumption',
      confidence: 0.8,
      script:
        "Based on what you've shared, it sounds like FleetFlow would be a great fit for your transportation needs. When would be the best time to get you set up?",
      objections: ['not ready', 'need approval'],
      successRate: 0.75,
      transportationSpecific: true,
    });

    // Urgency close
    strategies.push({
      strategy: 'urgency',
      confidence: 0.7,
      script:
        'I understand you want to think about it. But with rates trending up, the savings you could lock in now might not be available next month. Should we move forward today?',
      objections: ['need to think', 'not urgent'],
      successRate: 0.65,
      transportationSpecific: true,
    });

    // Value close
    strategies.push({
      strategy: 'value',
      confidence: 0.9,
      script:
        'When you look at the complete picture - the cost savings, the reliability improvements, the 24/7 support - this really makes financial sense for your business. Are you ready to move forward?',
      objections: ['too expensive', 'not convinced'],
      successRate: 0.8,
      transportationSpecific: false,
    });

    // Sort by confidence and transportation specificity
    return strategies.sort((a, b) => {
      if (a.transportationSpecific && !b.transportationSpecific) return -1;
      if (!a.transportationSpecific && b.transportationSpecific) return 1;
      return b.confidence - a.confidence;
    });
  }

  // ============================================
  // FREIGHTBRAIN AI INTEGRATION
  // ============================================

  private async getFreightIntelligence(
    prospectInfo: any
  ): Promise<string | null> {
    if (!prospectInfo.industry) return null;

    // Get transportation market intelligence
    const marketData = freightBrainAI.getMarketIntelligence('general');

    if (marketData) {
      return `Market Intelligence: Current average rates are ${marketData.averageRate}/mile. Demand is ${marketData.demandLevel} in most lanes.`;
    }

    return null;
  }

  // ============================================
  // REAL-TIME GUIDANCE DELIVERY
  // ============================================

  private async deliverGuidance(
    callId: string,
    guidance: SalesGuidance
  ): Promise<void> {
    const context = this.activeCalls.get(callId);
    if (!context) return;

    // Send via WebSocket to agent's interface
    await webSocketNotificationService.sendMessage({
      type: 'notification',
      service: 'sales-copilot',
      userId: context.agentId,
      data: {
        callId,
        guidance,
        context: {
          stage: context.conversationStage,
          confidence: context.confidenceScore,
          prospectName: context.prospectInfo.name,
        },
      },
      timestamp: new Date().toISOString(),
    });

    // Log for learning
    await this.learningService.recordInteraction({
      staffId: context.assignedAIStaff[0],
      interactionType: 'sales',
      userContext: {
        companyType: context.prospectInfo.industry || 'unknown',
        communicationStyle: 'professional',
        industryKnowledge: 'intermediate',
        urgencyLevel: 'normal',
      },
      content: {
        input: guidance.content,
        response: 'guidance_delivered',
        tone: 'supportive',
        approach: guidance.type,
      },
      outcome: {
        success: true,
        userSatisfaction: 8,
        goalAchieved: guidance.type === 'closing_script',
      },
    });
  }

  // ============================================
  // CONVERSATION ANALYSIS
  // ============================================

  private async analyzeConversation(
    callId: string,
    agentMessage: string,
    prospectResponse: string
  ): Promise<void> {
    const context = this.activeCalls.get(callId);
    if (!context) return;

    // Detect objections
    const objections = this.detectObjections(prospectResponse);
    for (const objection of objections) {
      context.objectionHistory.push({
        objection,
        handled: false,
        timestamp: new Date(),
        effectiveness: 0,
      });
      context.conversationStage = 'objection_handling';
    }

    // Update discovery progress
    this.updateDiscoveryProgress(context, prospectResponse);

    // Determine next stage
    this.updateConversationStage(context, prospectResponse);

    this.activeCalls.set(callId, context);
  }

  private detectObjections(response: string): string[] {
    const objectionKeywords = [
      'expensive',
      'cost',
      'price',
      'budget',
      'not interested',
      'not ready',
      'later',
      'happy with current',
      'satisfied',
      'need to think',
      'considering',
      'send information',
      'email me',
      'talk to boss',
      'approval needed',
    ];

    return objectionKeywords.filter((keyword) =>
      response.toLowerCase().includes(keyword)
    );
  }

  private updateDiscoveryProgress(
    context: SalesCallContext,
    response: string
  ): void {
    // Mark questions as answered based on response content
    context.discoveryQuestions.forEach((question) => {
      if (!question.answered) {
        const keywords =
          question.category === 'pain_points'
            ? ['challenge', 'problem', 'issue', 'cost', 'expensive']
            : question.category === 'budget'
              ? ['budget', 'cost', 'spend', 'range', 'afford']
              : question.category === 'timeline'
                ? ['when', 'timeline', 'soon', 'later', 'ready']
                : ['volume', 'shipments', 'loads', 'trucks'];

        if (
          keywords.some((keyword) => response.toLowerCase().includes(keyword))
        ) {
          question.answered = true;
        }
      }
    });
  }

  private updateConversationStage(
    context: SalesCallContext,
    response: string
  ): void {
    // Logic to advance conversation stage based on responses
    if (
      context.objectionHistory.length > 0 &&
      context.conversationStage !== 'objection_handling'
    ) {
      context.conversationStage = 'objection_handling';
    } else if (
      context.discoveryQuestions.filter((q) => q.answered).length >= 3
    ) {
      context.conversationStage = 'qualification';
    } else if (
      response.toLowerCase().includes('yes') ||
      response.toLowerCase().includes('ready')
    ) {
      context.conversationStage = 'closing';
    }
  }

  // ============================================
  // AI STAFF ASSIGNMENT
  // ============================================

  private assignAIStaff(prospectInfo: any): string[] {
    // Assign most relevant DEPOINTE AI staff based on prospect characteristics
    if (
      prospectInfo.industry === 'transportation' ||
      prospectInfo.painPoints?.includes('costs')
    ) {
      return ['desiree-001']; // Desperate Prospects Specialist
    } else if (
      prospectInfo.painPoints?.includes('relationships') ||
      prospectInfo.painPoints?.includes('service')
    ) {
      return ['cliff-002']; // Desperate Prospects Hunter
    } else {
      return ['gary-003']; // Lead Generation Specialist
    }
  }

  private initializeObjectionPatterns(): void {
    this.objectionPatterns.set('price', [
      'too expensive',
      'budget constraints',
      'cost too high',
      'not in budget',
    ]);

    this.objectionPatterns.set('timing', [
      'not ready',
      'need to think',
      'call back later',
      'not the right time',
    ]);

    this.objectionPatterns.set('competition', [
      'happy with current',
      'loyal to current provider',
      'under contract',
      'satisfied with current',
    ]);
  }

  // ============================================
  // PERFORMANCE TRACKING
  // ============================================

  async endCallGuidance(
    callId: string,
    outcome: 'won' | 'lost' | 'follow_up'
  ): Promise<void> {
    const context = this.activeCalls.get(callId);
    if (!context) return;

    // Record final metrics
    const finalMetrics = {
      callId,
      agentId: context.agentId,
      duration: Date.now() - Date.now(), // Would track actual duration
      outcome,
      objectionsHandled: context.objectionHistory.length,
      discoveryQuestionsAnswered: context.discoveryQuestions.filter(
        (q) => q.answered
      ).length,
      confidenceScore: context.confidenceScore,
      aiStaffUsed: context.assignedAIStaff,
    };

    // Send to supervision service for analysis
    await automatedSupervisionService.performAutomatedQualityCheck(
      finalMetrics,
      context
    );

    this.activeCalls.delete(callId);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  getActiveCallContext(callId: string): SalesCallContext | null {
    return this.activeCalls.get(callId) || null;
  }

  getAllActiveCalls(): SalesCallContext[] {
    return Array.from(this.activeCalls.values());
  }

  updateProspectInfo(
    callId: string,
    updates: Partial<SalesCallContext['prospectInfo']>
  ): void {
    const context = this.activeCalls.get(callId);
    if (context) {
      context.prospectInfo = { ...context.prospectInfo, ...updates };
      this.activeCalls.set(callId, context);
    }
  }
}

// Export singleton instance
export const salesCopilotAI = new SalesCopilotAI();


