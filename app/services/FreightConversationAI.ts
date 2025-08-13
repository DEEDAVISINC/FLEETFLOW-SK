import { FleetFlowAI } from './ai';
import { EnhancedCarrierService } from './enhanced-carrier-service';
import { FMCSAService } from './fmcsa';

/**
 * FleetFlow Freight Conversation AI
 * Enhanced voice AI system that matches Parade.ai's CoDriver capabilities
 * for automated carrier qualification, load matching, and rate negotiation
 */

export interface FreightCallContext {
  callId: string;
  carrierInfo?: CarrierInfo;
  loadInfo?: LoadInfo;
  callType:
    | 'inbound_inquiry'
    | 'outbound_prospect'
    | 'load_follow_up'
    | 'rate_negotiation';
  conversationStage:
    | 'greeting'
    | 'qualification'
    | 'load_discussion'
    | 'rate_negotiation'
    | 'closing';
  aiConfidence: number;
  transferRequired: boolean;
}

export interface CarrierInfo {
  mcNumber?: string;
  dotNumber?: string;
  companyName?: string;
  contactName?: string;
  phone?: string;
  email?: string;
  equipmentTypes?: string[];
  serviceAreas?: string[];
  safetyRating?: string;
  insuranceStatus?: 'verified' | 'pending' | 'expired';
  authorityStatus?: 'active' | 'inactive' | 'revoked';
}

export interface LoadInfo {
  loadId?: string;
  origin?: string;
  destination?: string;
  pickupDate?: string;
  deliveryDate?: string;
  commodity?: string;
  weight?: number;
  equipmentType?: string;
  specialRequirements?: string[];
  rateRange?: {
    min: number;
    max: number;
    target: number;
  };
}

export interface ConversationResponse {
  response: string;
  action:
    | 'continue'
    | 'transfer'
    | 'schedule_callback'
    | 'end_call'
    | 'collect_info';
  nextStage?: string;
  dataCollected?: any;
  confidence: number;
  requiresHumanReview: boolean;
}

export class FreightConversationAI {
  private ai: FleetFlowAI;
  private carrierService: EnhancedCarrierService;
  private fmcsaService: FMCSAService;

  constructor() {
    this.ai = new FleetFlowAI();
    this.carrierService = new EnhancedCarrierService();
    this.fmcsaService = new FMCSAService();
  }

  /**
   * Process incoming carrier call and generate appropriate AI response
   */
  async processCarrierCall(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    // Update context based on user input
    const updatedContext = await this.analyzeUserInput(userInput, context);

    // Route to appropriate conversation handler
    switch (updatedContext.conversationStage) {
      case 'greeting':
        return this.handleGreeting(userInput, updatedContext);

      case 'qualification':
        return this.handleCarrierQualification(userInput, updatedContext);

      case 'load_discussion':
        return this.handleLoadDiscussion(userInput, updatedContext);

      case 'rate_negotiation':
        return this.handleRateNegotiation(userInput, updatedContext);

      case 'closing':
        return this.handleCallClosing(userInput, updatedContext);

      default:
        return this.handleUnknownStage(userInput, updatedContext);
    }
  }

  /**
   * Handle initial greeting and call routing
   */
  private async handleGreeting(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    const prompt = `
    You are FleetFlow's AI freight broker assistant. A carrier has called and said: "${userInput}"

    GREETING PROTOCOL:
    1. Professional, friendly greeting
    2. Identify yourself as FleetFlow AI Assistant
    3. Ask how you can help them today
    4. Listen for keywords: "load", "capacity", "rate", "availability", "quote"

    RESPONSE GUIDELINES:
    - Be conversational and natural
    - Use freight industry terminology appropriately
    - Be helpful and solution-oriented
    - Keep responses concise (2-3 sentences max)

    Generate a professional greeting response and determine next conversation stage.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      response: response,
      action: 'continue',
      nextStage: 'qualification',
      confidence: 0.9,
      requiresHumanReview: false,
    };
  }

  /**
   * Handle carrier qualification process
   */
  private async handleCarrierQualification(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    // Extract carrier information from conversation
    const extractedInfo = await this.extractCarrierInfo(userInput);

    // Verify with FMCSA if we have MC/DOT numbers
    let verificationResult = null;
    if (extractedInfo.mcNumber || extractedInfo.dotNumber) {
      verificationResult = await this.verifyCarrierWithFMCSA(extractedInfo);
    }

    const prompt = `
    You are qualifying a carrier who said: "${userInput}"

    EXTRACTED INFO: ${JSON.stringify(extractedInfo)}
    FMCSA VERIFICATION: ${JSON.stringify(verificationResult)}

    QUALIFICATION CHECKLIST:
    ✓ MC Number (Motor Carrier Authority)
    ✓ DOT Number
    ✓ Insurance Status
    ✓ Safety Rating
    ✓ Equipment Types
    ✓ Service Areas
    ✓ Contact Information

    CONVERSATION FLOW:
    1. If missing critical info, ask specific questions
    2. If verification fails, explain requirements professionally
    3. If qualified, move to load discussion
    4. Use freight industry terminology naturally

    RESPONSE STYLE:
    - Professional but conversational
    - Ask one question at a time
    - Explain why information is needed
    - Be encouraging and helpful

    Generate appropriate response for carrier qualification.
    `;

    const response = await this.ai.generateResponse(prompt);

    // Determine if we have enough info to proceed
    const qualificationComplete = this.isCarrierQualified(
      extractedInfo,
      verificationResult
    );

    return {
      response: response,
      action: qualificationComplete ? 'continue' : 'collect_info',
      nextStage: qualificationComplete ? 'load_discussion' : 'qualification',
      dataCollected: extractedInfo,
      confidence: verificationResult ? 0.95 : 0.7,
      requiresHumanReview: !qualificationComplete && !verificationResult,
    };
  }

  /**
   * Handle load discussion and matching
   */
  private async handleLoadDiscussion(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    // Extract load requirements from conversation
    const loadRequirements = await this.extractLoadRequirements(userInput);

    // Find matching loads
    const matchingLoads = await this.findMatchingLoads(
      context.carrierInfo!,
      loadRequirements
    );

    const prompt = `
    You are discussing loads with a qualified carrier who said: "${userInput}"

    CARRIER INFO: ${JSON.stringify(context.carrierInfo)}
    LOAD REQUIREMENTS: ${JSON.stringify(loadRequirements)}
    MATCHING LOADS: ${JSON.stringify(matchingLoads.slice(0, 3))} // Top 3 matches

    LOAD DISCUSSION PROTOCOL:
    1. Present best matching loads clearly
    2. Highlight why each load is a good fit
    3. Ask about availability and preferences
    4. Discuss pickup/delivery requirements
    5. Move toward rate discussion when appropriate

    FREIGHT TERMINOLOGY:
    - Use proper equipment names (dry van, flatbed, reefer, etc.)
    - Reference load details professionally
    - Discuss timing and requirements clearly
    - Use miles, weight, and commodity terms correctly

    RESPONSE GUIDELINES:
    - Present 1-2 best load options
    - Explain match reasoning
    - Ask about carrier availability/preference
    - Keep conversation moving forward

    Generate engaging load discussion response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      response: response,
      action: matchingLoads.length > 0 ? 'continue' : 'schedule_callback',
      nextStage: matchingLoads.length > 0 ? 'rate_negotiation' : 'closing',
      dataCollected: { loadRequirements, matchingLoads },
      confidence: matchingLoads.length > 0 ? 0.9 : 0.6,
      requiresHumanReview: matchingLoads.length === 0,
    };
  }

  /**
   * Handle rate negotiation
   */
  private async handleRateNegotiation(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    // Extract rate information and negotiation points
    const rateInfo = await this.extractRateInfo(userInput);

    // Get market rate data for comparison
    const marketRates = await this.getMarketRateData(context.loadInfo!);

    // Calculate negotiation parameters
    const negotiationParams = this.calculateNegotiationParams(
      rateInfo,
      marketRates
    );

    const prompt = `
    You are negotiating rates with a carrier who said: "${userInput}"

    LOAD INFO: ${JSON.stringify(context.loadInfo)}
    RATE INFO: ${JSON.stringify(rateInfo)}
    MARKET RATES: ${JSON.stringify(marketRates)}
    NEGOTIATION PARAMS: ${JSON.stringify(negotiationParams)}

    RATE NEGOTIATION STRATEGY:
    1. Acknowledge carrier's position professionally
    2. Present market data to support rates
    3. Find win-win solutions
    4. Consider total package (fuel, deadhead, etc.)
    5. Know when to hold firm vs. negotiate

    NEGOTIATION GUIDELINES:
    - Stay within approved rate ranges
    - Use market data to justify rates
    - Be flexible on non-rate terms when possible
    - Build relationship for future loads
    - Know when to transfer to human broker

    RESPONSE TONE:
    - Professional and respectful
    - Data-driven but collaborative
    - Solution-oriented
    - Confident but not aggressive

    Generate appropriate rate negotiation response.
    `;

    const response = await this.ai.generateResponse(prompt);

    // Determine if we need human intervention
    const needsHumanReview = this.assessNegotiationComplexity(
      rateInfo,
      negotiationParams
    );

    return {
      response: response,
      action: needsHumanReview ? 'transfer' : 'continue',
      nextStage: 'closing',
      dataCollected: { rateInfo, negotiationParams },
      confidence: needsHumanReview ? 0.6 : 0.85,
      requiresHumanReview: needsHumanReview,
    };
  }

  /**
   * Handle call closing and next steps
   */
  private async handleCallClosing(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    const prompt = `
    You are closing a call with a carrier who said: "${userInput}"

    CALL CONTEXT: ${JSON.stringify(context)}

    CLOSING PROTOCOL:
    1. Summarize what was discussed/agreed
    2. Confirm next steps clearly
    3. Provide contact information
    4. Thank them for their time
    5. Leave door open for future opportunities

    NEXT STEPS OPTIONS:
    - Load booking confirmation
    - Rate sheet follow-up
    - Callback scheduling
    - Email confirmation
    - Future load notifications

    PROFESSIONAL CLOSING:
    - Recap key points
    - Confirm commitments
    - Provide clear next actions
    - Maintain relationship focus

    Generate professional call closing response.
    `;

    const response = await this.ai.generateResponse(prompt);

    return {
      response: response,
      action: 'end_call',
      confidence: 0.9,
      requiresHumanReview: false,
    };
  }

  /**
   * Extract carrier information from conversation
   */
  private async extractCarrierInfo(userInput: string): Promise<CarrierInfo> {
    const prompt = `
    Extract carrier information from this text: "${userInput}"

    Look for:
    - MC Number (MC123456 or MC-123456)
    - DOT Number (DOT123456 or 123456)
    - Company name
    - Contact name
    - Phone/email
    - Equipment types (dry van, flatbed, reefer, etc.)
    - Service areas/states

    Return JSON format with extracted information.
    `;

    const extracted = await this.ai.generateResponse(prompt);

    try {
      return JSON.parse(extracted);
    } catch {
      return {}; // Return empty object if parsing fails
    }
  }

  /**
   * Verify carrier with FMCSA
   */
  private async verifyCarrierWithFMCSA(carrierInfo: CarrierInfo): Promise<any> {
    try {
      if (carrierInfo.mcNumber) {
        return await this.fmcsaService.getCarrierByMC(carrierInfo.mcNumber);
      } else if (carrierInfo.dotNumber) {
        return await this.fmcsaService.getCarrierByDOT(carrierInfo.dotNumber);
      }
      return null;
    } catch (error) {
      console.error('FMCSA verification failed:', error);
      return null;
    }
  }

  /**
   * Check if carrier is qualified based on extracted info and verification
   */
  private isCarrierQualified(
    carrierInfo: CarrierInfo,
    verificationResult: any
  ): boolean {
    // Must have MC or DOT number
    if (!carrierInfo.mcNumber && !carrierInfo.dotNumber) return false;

    // If we have verification, check authority status
    if (verificationResult) {
      return verificationResult.authorityStatus === 'AUTHORIZED';
    }

    // Basic qualification if no verification available
    return !!(
      carrierInfo.companyName &&
      (carrierInfo.phone || carrierInfo.email)
    );
  }

  /**
   * Extract load requirements from conversation
   */
  private async extractLoadRequirements(userInput: string): Promise<any> {
    const prompt = `
    Extract load requirements from: "${userInput}"

    Look for:
    - Equipment type preferences
    - Geographic preferences
    - Commodity types
    - Weight capacity
    - Timing availability
    - Special requirements

    Return JSON with requirements.
    `;

    const extracted = await this.ai.generateResponse(prompt);

    try {
      return JSON.parse(extracted);
    } catch {
      return {};
    }
  }

  /**
   * Find matching loads based on carrier info and requirements
   */
  private async findMatchingLoads(
    carrierInfo: CarrierInfo,
    requirements: any
  ): Promise<any[]> {
    // This would integrate with your load management system
    // For now, return mock data
    return [
      {
        loadId: 'FL-001',
        origin: 'Los Angeles, CA',
        destination: 'Phoenix, AZ',
        pickupDate: '2024-01-15',
        commodity: 'Electronics',
        weight: 25000,
        equipmentType: 'Dry Van',
        miles: 370,
        rateRange: { min: 1200, max: 1500, target: 1350 },
      },
    ];
  }

  /**
   * Extract rate information from conversation
   */
  private async extractRateInfo(userInput: string): Promise<any> {
    const prompt = `
    Extract rate information from: "${userInput}"

    Look for:
    - Quoted rates
    - Rate expectations
    - Fuel surcharge mentions
    - Deadhead concerns
    - Payment terms
    - Rate objections/justifications

    Return JSON with rate details.
    `;

    const extracted = await this.ai.generateResponse(prompt);

    try {
      return JSON.parse(extracted);
    } catch {
      return {};
    }
  }

  /**
   * Get market rate data for comparison
   */
  private async getMarketRateData(loadInfo: LoadInfo): Promise<any> {
    // This would integrate with rate APIs (DAT, Truckstop, etc.)
    // For now, return mock market data
    return {
      averageRate: 1.85,
      highRate: 2.1,
      lowRate: 1.65,
      fuelSurcharge: 0.15,
      marketTrend: 'stable',
    };
  }

  /**
   * Calculate negotiation parameters
   */
  private calculateNegotiationParams(rateInfo: any, marketRates: any): any {
    return {
      flexibility: 0.1, // 10% negotiation room
      minAcceptable: marketRates.lowRate,
      maxOffer: marketRates.highRate,
      targetRate: marketRates.averageRate,
      negotiationRoom: marketRates.highRate - marketRates.lowRate,
    };
  }

  /**
   * Assess if negotiation needs human intervention
   */
  private assessNegotiationComplexity(
    rateInfo: any,
    negotiationParams: any
  ): boolean {
    // Complex negotiations that need human review
    return (
      rateInfo.quotedRate > negotiationParams.maxOffer * 1.1 || // 10% over max
      rateInfo.quotedRate < negotiationParams.minAcceptable * 0.9 || // 10% under min
      rateInfo.hasSpecialRequirements ||
      rateInfo.hasPaymentTermsIssues
    );
  }

  /**
   * Analyze user input to update conversation context
   */
  private async analyzeUserInput(
    userInput: string,
    context: FreightCallContext
  ): Promise<FreightCallContext> {
    const prompt = `
    Analyze this user input in the context of a freight broker call: "${userInput}"

    Current stage: ${context.conversationStage}

    Determine:
    1. What stage should we be in next?
    2. What's the user's intent?
    3. Are they asking questions, providing info, or negotiating?
    4. Should we continue or transfer to human?

    Return JSON with analysis.
    `;

    const analysis = await this.ai.generateResponse(prompt);

    try {
      const parsed = JSON.parse(analysis);
      return {
        ...context,
        conversationStage: parsed.nextStage || context.conversationStage,
        aiConfidence: parsed.confidence || context.aiConfidence,
        transferRequired: parsed.transferRequired || false,
      };
    } catch {
      return context; // Return original context if analysis fails
    }
  }

  /**
   * Handle unknown conversation stages
   */
  private async handleUnknownStage(
    userInput: string,
    context: FreightCallContext
  ): Promise<ConversationResponse> {
    return {
      response:
        'I apologize, but I need to transfer you to one of our human brokers who can better assist you with your request. Please hold for just a moment.',
      action: 'transfer',
      confidence: 0.3,
      requiresHumanReview: true,
    };
  }
}

export default FreightConversationAI;
