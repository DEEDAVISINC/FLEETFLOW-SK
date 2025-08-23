// Smart Negotiation Service - Handles AI limitations with intelligent escalation
// SOLUTION: AI handles simple negotiations, escalates complex ones to humans

interface NegotiationContext {
  dealValue: number;
  complexity: 'simple' | 'medium' | 'complex';
  stakeholders: number;
  timeline: 'immediate' | 'days' | 'weeks';
  riskLevel: 'low' | 'medium' | 'high';
  customerTier: 'bronze' | 'silver' | 'gold' | 'platinum';
  negotiationHistory: string[];
}

interface NegotiationStrategy {
  aiCanHandle: boolean;
  approach: string;
  maxConcessions: number;
  escalationTriggers: string[];
  fallbackToHuman: boolean;
  confidenceScore: number;
}

interface NegotiationOutcome {
  success: boolean;
  finalTerms: any;
  escalatedToHuman: boolean;
  aiScore: number;
  humanInterventionPoints: string[];
}

export class SmartNegotiationService {
  // SOLUTION 1: Determine if AI can handle negotiation
  assessNegotiationComplexity(
    context: NegotiationContext
  ): NegotiationStrategy {
    let aiCanHandle = true;
    let confidenceScore = 100;
    let escalationTriggers = [];

    // Rule-based assessment of AI capability

    // Deal value thresholds
    if (context.dealValue > 50000) {
      confidenceScore -= 30;
      escalationTriggers.push('High value deal >$50K requires human oversight');
    }
    if (context.dealValue > 100000) {
      aiCanHandle = false;
      escalationTriggers.push('Deals >$100K must have human negotiation');
    }

    // Complexity assessment
    if (context.complexity === 'complex') {
      confidenceScore -= 40;
      escalationTriggers.push('Complex negotiations require human judgment');
      if (context.stakeholders > 3) {
        aiCanHandle = false;
        escalationTriggers.push(
          'Multiple stakeholder negotiations too complex for AI'
        );
      }
    }

    // Risk assessment
    if (context.riskLevel === 'high') {
      confidenceScore -= 25;
      escalationTriggers.push('High risk deals need human risk assessment');
    }

    // Customer tier protection
    if (
      context.customerTier === 'platinum' ||
      context.customerTier === 'gold'
    ) {
      confidenceScore -= 20;
      escalationTriggers.push('Premium customers deserve human attention');
    }

    // Timeline pressure
    if (context.timeline === 'immediate' && context.dealValue > 25000) {
      aiCanHandle = false;
      escalationTriggers.push(
        'High-value urgent deals need immediate human response'
      );
    }

    return {
      aiCanHandle: aiCanHandle && confidenceScore >= 60,
      approach: this.getOptimalApproach(context),
      maxConcessions: this.getMaxConcessions(context),
      escalationTriggers,
      fallbackToHuman: !aiCanHandle || confidenceScore < 60,
      confidenceScore: Math.max(0, confidenceScore),
    };
  }

  // SOLUTION 2: AI handles simple negotiations with clear parameters
  async handleSimpleNegotiation(
    context: NegotiationContext,
    customerRequest: string
  ): Promise<NegotiationOutcome> {
    const strategy = this.assessNegotiationComplexity(context);

    if (!strategy.aiCanHandle) {
      return this.escalateToHuman(
        context,
        customerRequest,
        'Initial assessment flagged for human handling'
      );
    }

    try {
      // AI negotiation for simple scenarios
      const negotiationPrompt = this.buildNegotiationPrompt(
        context,
        customerRequest,
        strategy
      );

      // Use our cost-optimized batching system
      const taskId = await this.processNegotiationTask(
        negotiationPrompt,
        context
      );
      const result = await this.getNegotiationResult(taskId);

      // Validate AI response makes business sense
      const validation = this.validateAIResponse(result, context);

      if (!validation.isValid) {
        return this.escalateToHuman(
          context,
          customerRequest,
          `AI response failed validation: ${validation.reasons.join(', ')}`
        );
      }

      return {
        success: true,
        finalTerms: result.proposedTerms,
        escalatedToHuman: false,
        aiScore: result.confidenceScore,
        humanInterventionPoints: [],
      };
    } catch (error) {
      console.error('AI negotiation failed:', error);
      return this.escalateToHuman(
        context,
        customerRequest,
        'AI negotiation processing error'
      );
    }
  }

  // SOLUTION 3: Smart escalation to humans with context
  async escalateToHuman(
    context: NegotiationContext,
    customerRequest: string,
    reason: string
  ): Promise<NegotiationOutcome> {
    console.log(`🔄 Escalating negotiation to human: ${reason}`);

    // Create comprehensive handoff package for human negotiator
    const handoffPackage = {
      customerRequest,
      dealContext: context,
      escalationReason: reason,
      aiAnalysis: await this.getAIPreAnalysis(context, customerRequest),
      suggestedStrategy: this.getOptimalApproach(context),
      riskAssessment: this.assessRisks(context),
      urgencyLevel: this.calculateUrgency(context),
      backgroundResearch: await this.getCustomerBackground(context),
      negotiationPlaybook: this.getNegotiationPlaybook(context),
    };

    // Notify human negotiator immediately
    await this.notifyHumanNegotiator(handoffPackage);

    return {
      success: false, // Pending human handling
      finalTerms: null,
      escalatedToHuman: true,
      aiScore: 0,
      humanInterventionPoints: [
        `Escalated at ${new Date().toISOString()}: ${reason}`,
        `Deal value: $${context.dealValue.toLocaleString()}`,
        `Customer tier: ${context.customerTier}`,
        `Risk level: ${context.riskLevel}`,
      ],
    };
  }

  // SOLUTION 4: Build context-aware negotiation prompts
  private buildNegotiationPrompt(
    context: NegotiationContext,
    customerRequest: string,
    strategy: NegotiationStrategy
  ): string {
    return `
You are a professional freight negotiator for FleetFlow. Handle this negotiation professionally and within bounds.

CUSTOMER REQUEST: ${customerRequest}

CONTEXT:
- Deal Value: $${context.dealValue.toLocaleString()}
- Customer Tier: ${context.customerTier}
- Timeline: ${context.timeline}
- Risk Level: ${context.riskLevel}

NEGOTIATION PARAMETERS:
- Maximum discount: ${strategy.maxConcessions}%
- Approach: ${strategy.approach}
- Must escalate if customer requests exceed these limits

INSTRUCTIONS:
1. Be professional and understanding
2. Explore win-win solutions first
3. Use industry standards to justify pricing
4. If customer asks for >15% discount, escalate to manager
5. If deal involves unusual terms, escalate immediately
6. Provide specific, actionable response

RESPOND WITH:
{
  "response": "Your negotiation response to customer",
  "proposedTerms": {
    "finalPrice": number,
    "paymentTerms": "string",
    "deliveryTerms": "string"
  },
  "confidenceScore": 1-100,
  "escalationNeeded": true/false,
  "escalationReason": "string if needed"
}
    `.trim();
  }

  // SOLUTION 5: Validate AI responses make business sense
  private validateAIResponse(
    aiResponse: any,
    context: NegotiationContext
  ): { isValid: boolean; reasons: string[] } {
    const reasons = [];

    // Check for unrealistic discounts
    if (aiResponse.proposedTerms?.finalPrice) {
      const discountPercent =
        ((context.dealValue - aiResponse.proposedTerms.finalPrice) /
          context.dealValue) *
        100;
      if (discountPercent > 20) {
        reasons.push(`Discount too high: ${discountPercent.toFixed(1)}%`);
      }
      if (discountPercent < 0) {
        reasons.push(
          `Price increase not allowed in customer-initiated negotiation`
        );
      }
    }

    // Check for risky payment terms
    if (aiResponse.proposedTerms?.paymentTerms) {
      const terms = aiResponse.proposedTerms.paymentTerms.toLowerCase();
      if (terms.includes('net 60') || terms.includes('net 90')) {
        reasons.push('Extended payment terms require approval');
      }
    }

    // Check AI confidence
    if (aiResponse.confidenceScore < 70) {
      reasons.push(`AI confidence too low: ${aiResponse.confidenceScore}%`);
    }

    // Check for escalation flag
    if (aiResponse.escalationNeeded) {
      reasons.push(`AI flagged for escalation: ${aiResponse.escalationReason}`);
    }

    return {
      isValid: reasons.length === 0,
      reasons,
    };
  }

  // SOLUTION 6: Get optimal negotiation approach
  private getOptimalApproach(context: NegotiationContext): string {
    if (context.customerTier === 'platinum') {
      return 'premium_service_focus';
    }
    if (context.timeline === 'immediate') {
      return 'expedited_solution';
    }
    if (context.dealValue < 10000) {
      return 'value_optimization';
    }
    if (context.riskLevel === 'high') {
      return 'risk_mitigation';
    }
    return 'collaborative_problem_solving';
  }

  // SOLUTION 7: Calculate maximum AI concessions
  private getMaxConcessions(context: NegotiationContext): number {
    let maxDiscount = 5; // Default 5%

    if (context.dealValue > 50000) maxDiscount = 3; // Higher value = less discount
    if (context.customerTier === 'platinum') maxDiscount += 2;
    if (context.customerTier === 'gold') maxDiscount += 1;
    if (context.riskLevel === 'low') maxDiscount += 2;

    return Math.min(maxDiscount, 15); // Never exceed 15%
  }

  // SOLUTION 8: Integration with batching system
  private async processNegotiationTask(
    prompt: string,
    context: NegotiationContext
  ): Promise<string> {
    // Import our cost-efficient batching service
    const { aiBatchService } = await import('./AIBatchService');

    const taskId = await aiBatchService.queueTask({
      type: 'contract_review', // Closest match to negotiation
      content: prompt,
      priority: context.urgency === 'immediate' ? 'high' : 'medium',
    });

    return taskId;
  }

  private async getNegotiationResult(taskId: string): Promise<any> {
    const { aiCompanyIntegration } = await import('./AICompanyIntegration');
    return await aiCompanyIntegration.getTaskResult(taskId);
  }

  // SOLUTION 9: Human notification system
  private async notifyHumanNegotiator(handoffPackage: any): Promise<void> {
    // Send immediate notification to human team
    const urgencyEmoji =
      handoffPackage.urgencyLevel === 'high'
        ? '🚨'
        : handoffPackage.urgencyLevel === 'medium'
          ? '⚠️'
          : 'ℹ️';

    const notification = {
      type: 'negotiation_escalation',
      priority: handoffPackage.urgencyLevel,
      title: `${urgencyEmoji} Negotiation Escalation: $${handoffPackage.dealContext.dealValue.toLocaleString()}`,
      message: `AI escalated negotiation for ${handoffPackage.dealContext.customerTier} customer. Reason: ${handoffPackage.escalationReason}`,
      handoffPackage,
      timestamp: new Date().toISOString(),
    };

    // Integration with existing notification system
    console.log('📧 Notifying human negotiator:', notification.title);

    // Here you would integrate with your actual notification system
    // await notificationService.sendUrgentNotification(notification);
  }

  // SOLUTION 10: Pre-analysis for humans
  private async getAIPreAnalysis(
    context: NegotiationContext,
    customerRequest: string
  ): Promise<string> {
    return `
AI ANALYSIS SUMMARY:
- Customer Request: ${customerRequest}
- Complexity Assessment: ${context.complexity}
- Recommended Approach: ${this.getOptimalApproach(context)}
- Risk Factors: ${context.riskLevel} risk level
- Suggested Max Concession: ${this.getMaxConcessions(context)}%
- Key Negotiation Points: Price, terms, timeline
- Customer Background: ${context.customerTier} tier customer
- Previous Interactions: ${context.negotiationHistory.length} recorded
    `.trim();
  }

  private assessRisks(context: NegotiationContext): string[] {
    const risks = [];

    if (context.dealValue > 100000) risks.push('High financial exposure');
    if (context.timeline === 'immediate') risks.push('Timeline pressure');
    if (context.stakeholders > 2) risks.push('Multiple decision makers');
    if (context.riskLevel === 'high')
      risks.push('Customer flagged as high risk');

    return risks;
  }

  private calculateUrgency(
    context: NegotiationContext
  ): 'low' | 'medium' | 'high' {
    if (context.timeline === 'immediate' && context.dealValue > 25000)
      return 'high';
    if (context.customerTier === 'platinum') return 'high';
    if (context.dealValue > 75000) return 'medium';
    return 'low';
  }

  private async getCustomerBackground(
    context: NegotiationContext
  ): Promise<string> {
    // In real implementation, this would query your CRM
    return `Customer tier: ${context.customerTier}, Previous negotiations: ${context.negotiationHistory.length}`;
  }

  private getNegotiationPlaybook(context: NegotiationContext): string {
    const playbooks = {
      premium_service_focus:
        'Emphasize premium service, reliability, and white-glove treatment',
      expedited_solution:
        'Focus on speed, urgency, and immediate problem-solving',
      value_optimization: 'Emphasize cost savings, efficiency, and ROI',
      risk_mitigation: 'Address concerns, provide guarantees, show stability',
      collaborative_problem_solving: 'Work together to find win-win solutions',
    };

    const approach = this.getOptimalApproach(context);
    return playbooks[approach] || playbooks.collaborative_problem_solving;
  }
}

export const smartNegotiationService = new SmartNegotiationService();

