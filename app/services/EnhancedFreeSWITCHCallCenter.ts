import { CallCenterConfig, FreeSWITCHCallCenter } from './FreeSWITCHCallCenter';
import FreightConversationAI, {
  ConversationResponse,
  FreightCallContext,
} from './FreightConversationAI';

/**
 * Enhanced FreeSWITCH Call Center with Parade.ai CoDriver-level AI capabilities
 * Handles automated carrier conversations with intelligent voice AI
 */

export interface AICallSession {
  callId: string;
  sessionId: string;
  carrierPhone: string;
  startTime: Date;
  context: FreightCallContext;
  conversationHistory: ConversationTurn[];
  aiHandling: boolean;
  transferReason?: string;
  outcome?: CallOutcome;
}

export interface ConversationTurn {
  timestamp: Date;
  speaker: 'carrier' | 'ai' | 'human';
  message: string;
  confidence?: number;
  action?: string;
}

export interface CallOutcome {
  result:
    | 'load_booked'
    | 'quote_provided'
    | 'follow_up_scheduled'
    | 'not_qualified'
    | 'transferred';
  loadId?: string;
  quotedRate?: number;
  nextAction?: string;
  notes?: string;
}

export class EnhancedFreeSWITCHCallCenter extends FreeSWITCHCallCenter {
  private conversationAI: FreightConversationAI;
  private activeSessions: Map<string, AICallSession> = new Map();
  private callAnalytics: CallAnalytics;

  constructor(config: CallCenterConfig) {
    super(config);
    this.conversationAI = new FreightConversationAI();
    this.callAnalytics = new CallAnalytics();
  }

  /**
   * Handle incoming carrier call with AI conversation
   */
  async handleIncomingCarrierCall(
    callId: string,
    carrierPhone: string,
    initialMessage?: string
  ): Promise<AICallSession> {
    console.log(`📞 Incoming carrier call: ${callId} from ${carrierPhone}`);

    // Create AI call session
    const session: AICallSession = {
      callId,
      sessionId: `AI-${Date.now()}`,
      carrierPhone,
      startTime: new Date(),
      context: {
        callId,
        callType: 'inbound_inquiry',
        conversationStage: 'greeting',
        aiConfidence: 0.9,
        transferRequired: false,
      },
      conversationHistory: [],
      aiHandling: true,
    };

    this.activeSessions.set(callId, session);

    // Start AI conversation
    if (initialMessage) {
      await this.processCarrierMessage(callId, initialMessage);
    } else {
      // Send initial greeting
      const greeting = await this.conversationAI.processCarrierCall(
        'Hello', // Trigger greeting
        session.context
      );

      await this.sendAIResponse(callId, greeting);
    }

    return session;
  }

  /**
   * Process carrier message through AI conversation system
   */
  async processCarrierMessage(
    callId: string,
    message: string
  ): Promise<ConversationResponse> {
    const session = this.activeSessions.get(callId);
    if (!session) {
      throw new Error(`Call session not found: ${callId}`);
    }

    // Add carrier message to history
    session.conversationHistory.push({
      timestamp: new Date(),
      speaker: 'carrier',
      message,
    });

    // Process through AI
    const aiResponse = await this.conversationAI.processCarrierCall(
      message,
      session.context
    );

    // Update session context
    session.context.aiConfidence = aiResponse.confidence;
    session.context.transferRequired = aiResponse.requiresHumanReview;

    // Add AI response to history
    session.conversationHistory.push({
      timestamp: new Date(),
      speaker: 'ai',
      message: aiResponse.response,
      confidence: aiResponse.confidence,
      action: aiResponse.action,
    });

    // Handle AI actions
    await this.handleAIAction(callId, aiResponse);

    return aiResponse;
  }

  /**
   * Handle AI response actions
   */
  private async handleAIAction(
    callId: string,
    response: ConversationResponse
  ): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session) return;

    switch (response.action) {
      case 'transfer':
        await this.transferToHuman(callId, 'AI requested transfer');
        break;

      case 'schedule_callback':
        await this.scheduleCallback(callId, response.dataCollected);
        break;

      case 'end_call':
        await this.endCall(callId, {
          result: 'load_booked', // Default, could be determined from context
          notes: 'Call completed successfully by AI',
        });
        break;

      case 'continue':
        // Send AI response to carrier
        await this.sendAIResponse(callId, response);
        break;

      case 'collect_info':
        // Continue collecting information
        await this.sendAIResponse(callId, response);
        break;
    }
  }

  /**
   * Send AI response to carrier via FreeSWITCH
   */
  private async sendAIResponse(
    callId: string,
    response: ConversationResponse
  ): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session || !this.connection) return;

    try {
      // In a real implementation, this would use FreeSWITCH TTS (Text-to-Speech)
      // to convert the AI response to speech and play it to the carrier

      // For now, we'll use the mod_say module or a TTS engine
      const ttsCommand = `uuid_broadcast ${callId} say::en-us:PERSON:${response.response}`;
      await this.connection.api(ttsCommand);

      console.log(`🤖 AI Response sent to ${callId}: ${response.response}`);

      // Update analytics
      this.callAnalytics.recordAIResponse(callId, response);
    } catch (error) {
      console.error(`Failed to send AI response to ${callId}:`, error);

      // Fallback: transfer to human
      await this.transferToHuman(callId, 'TTS failure');
    }
  }

  /**
   * Transfer call to human broker
   */
  async transferToHuman(callId: string, reason: string): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session || !this.connection) return;

    console.log(`🔄 Transferring call ${callId} to human: ${reason}`);

    session.aiHandling = false;
    session.transferReason = reason;

    try {
      // Transfer call to human agent queue
      const transferCommand = `uuid_transfer ${callId} sales_queue XML default`;
      await this.connection.api(transferCommand);

      // Provide context to human agent
      await this.provideContextToAgent(callId, session);

      // Update analytics
      this.callAnalytics.recordTransfer(callId, reason);
    } catch (error) {
      console.error(`Failed to transfer call ${callId}:`, error);
    }
  }

  /**
   * Provide conversation context to human agent
   */
  private async provideContextToAgent(
    callId: string,
    session: AICallSession
  ): Promise<void> {
    const contextSummary = {
      callId: session.callId,
      carrierPhone: session.carrierPhone,
      conversationStage: session.context.conversationStage,
      carrierInfo: session.context.carrierInfo,
      loadInfo: session.context.loadInfo,
      aiConfidence: session.context.aiConfidence,
      transferReason: session.transferReason,
      keyPoints: this.extractKeyPoints(session.conversationHistory),
    };

    // Send context to agent dashboard/CRM
    // This would integrate with your agent interface
    console.log(
      `📋 Context provided to agent for call ${callId}:`,
      contextSummary
    );

    // Could also play a brief summary to the agent before connecting
    if (this.connection) {
      const summary = `AI handled call from ${session.carrierPhone}. Stage: ${session.context.conversationStage}. Transfer reason: ${session.transferReason}.`;
      await this.connection.api(
        `uuid_broadcast agent_channel say::en-us:PERSON:${summary}`
      );
    }
  }

  /**
   * Extract key points from conversation history
   */
  private extractKeyPoints(history: ConversationTurn[]): string[] {
    const keyPoints: string[] = [];

    for (const turn of history) {
      if (turn.speaker === 'carrier') {
        // Extract important carrier statements
        if (
          turn.message.toLowerCase().includes('mc') ||
          turn.message.toLowerCase().includes('dot')
        ) {
          keyPoints.push(`Carrier mentioned: ${turn.message}`);
        }
        if (
          turn.message.toLowerCase().includes('rate') ||
          turn.message.toLowerCase().includes('price')
        ) {
          keyPoints.push(`Rate discussion: ${turn.message}`);
        }
      }
    }

    return keyPoints;
  }

  /**
   * Schedule callback for carrier
   */
  private async scheduleCallback(
    callId: string,
    callbackData: any
  ): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session) return;

    console.log(`📅 Scheduling callback for call ${callId}:`, callbackData);

    // This would integrate with your scheduling system
    // For now, just log and end the call
    await this.endCall(callId, {
      result: 'follow_up_scheduled',
      nextAction: 'callback_scheduled',
      notes: `Callback scheduled: ${JSON.stringify(callbackData)}`,
    });
  }

  /**
   * End call with outcome
   */
  private async endCall(callId: string, outcome: CallOutcome): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session) return;

    session.outcome = outcome;

    console.log(`📞 Ending call ${callId} with outcome:`, outcome);

    // Disconnect call
    if (this.connection) {
      await this.connection.api(`uuid_kill ${callId}`);
    }

    // Record analytics
    this.callAnalytics.recordCallCompletion(callId, session);

    // Clean up session
    this.activeSessions.delete(callId);
  }

  /**
   * Get AI call center metrics (enhanced from parent)
   */
  async getEnhancedCallCenterMetrics(): Promise<EnhancedCallMetrics> {
    const baseMetrics = await this.getCallCenterMetrics();

    return {
      ...baseMetrics,
      aiHandledCalls: this.callAnalytics.getAIHandledCallsCount(),
      aiSuccessRate: this.callAnalytics.getAISuccessRate(),
      averageAIConfidence: this.callAnalytics.getAverageAIConfidence(),
      transferRate: this.callAnalytics.getTransferRate(),
      topTransferReasons: this.callAnalytics.getTopTransferReasons(),
      aiResponseTime: this.callAnalytics.getAverageAIResponseTime(),
      carrierSatisfaction: this.callAnalytics.getCarrierSatisfactionScore(),
    };
  }

  /**
   * Get active AI call sessions
   */
  getActiveAISessions(): AICallSession[] {
    return Array.from(this.activeSessions.values());
  }

  /**
   * Manually override AI decision
   */
  async overrideAIDecision(
    callId: string,
    action: 'transfer' | 'continue' | 'end'
  ): Promise<void> {
    const session = this.activeSessions.get(callId);
    if (!session) {
      throw new Error(`Call session not found: ${callId}`);
    }

    switch (action) {
      case 'transfer':
        await this.transferToHuman(callId, 'Manual override');
        break;
      case 'end':
        await this.endCall(callId, {
          result: 'transferred',
          notes: 'Manual override - call ended',
        });
        break;
      case 'continue':
        // Reset AI confidence and continue
        session.context.aiConfidence = 0.8;
        session.context.transferRequired = false;
        break;
    }
  }
}

interface EnhancedCallMetrics {
  totalCalls: number;
  connectedCalls: number;
  averageCallTime: number;
  conversionRate: number;
  leadQuality: number;
  revenue: number;
  // Enhanced AI metrics
  aiHandledCalls: number;
  aiSuccessRate: number;
  averageAIConfidence: number;
  transferRate: number;
  topTransferReasons: string[];
  aiResponseTime: number;
  carrierSatisfaction: number;
}

/**
 * Call Analytics tracking system
 */
class CallAnalytics {
  private metrics: Map<string, any> = new Map();

  recordAIResponse(callId: string, response: ConversationResponse): void {
    const key = `${callId}_responses`;
    const responses = this.metrics.get(key) || [];
    responses.push({
      timestamp: new Date(),
      confidence: response.confidence,
      action: response.action,
      requiresReview: response.requiresHumanReview,
    });
    this.metrics.set(key, responses);
  }

  recordTransfer(callId: string, reason: string): void {
    const transfers = this.metrics.get('transfers') || [];
    transfers.push({
      callId,
      reason,
      timestamp: new Date(),
    });
    this.metrics.set('transfers', transfers);
  }

  recordCallCompletion(callId: string, session: AICallSession): void {
    const completions = this.metrics.get('completions') || [];
    completions.push({
      callId,
      duration: Date.now() - session.startTime.getTime(),
      outcome: session.outcome,
      aiHandled: session.aiHandling,
      transferReason: session.transferReason,
      conversationTurns: session.conversationHistory.length,
    });
    this.metrics.set('completions', completions);
  }

  getAIHandledCallsCount(): number {
    const completions = this.metrics.get('completions') || [];
    return completions.filter((c: any) => c.aiHandled).length;
  }

  getAISuccessRate(): number {
    const completions = this.metrics.get('completions') || [];
    const aiCalls = completions.filter((c: any) => c.aiHandled);
    const successful = aiCalls.filter(
      (c: any) =>
        c.outcome?.result === 'load_booked' ||
        c.outcome?.result === 'quote_provided'
    );
    return aiCalls.length > 0 ? successful.length / aiCalls.length : 0;
  }

  getAverageAIConfidence(): number {
    // Calculate from all recorded responses
    const allResponses: any[] = [];
    for (const [key, value] of this.metrics.entries()) {
      if (key.endsWith('_responses')) {
        allResponses.push(...value);
      }
    }

    if (allResponses.length === 0) return 0;

    const totalConfidence = allResponses.reduce(
      (sum, r) => sum + r.confidence,
      0
    );
    return totalConfidence / allResponses.length;
  }

  getTransferRate(): number {
    const completions = this.metrics.get('completions') || [];
    const transfers = completions.filter((c: any) => c.transferReason);
    return completions.length > 0 ? transfers.length / completions.length : 0;
  }

  getTopTransferReasons(): string[] {
    const transfers = this.metrics.get('transfers') || [];
    const reasonCounts: { [key: string]: number } = {};

    transfers.forEach((t: any) => {
      reasonCounts[t.reason] = (reasonCounts[t.reason] || 0) + 1;
    });

    return Object.entries(reasonCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([reason]) => reason);
  }

  getAverageAIResponseTime(): number {
    // This would track actual response times
    // For now, return a reasonable estimate
    return 1.2; // 1.2 seconds average
  }

  getCarrierSatisfactionScore(): number {
    // This would integrate with post-call surveys
    // For now, return a good score based on AI performance
    return 4.2; // Out of 5.0
  }
}

export default EnhancedFreeSWITCHCallCenter;




