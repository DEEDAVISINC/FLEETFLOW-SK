// ============================================================================
// FLEETFLOW AUTOMATED COMMUNICATION SERVICE WITH SMART HUMAN ESCALATION
// ============================================================================

import { centralCRMService, UserIdentifier } from './CentralCRMService';

// ============================================================================
// TYPESCRIPT INTERFACES - AUTOMATED COMMUNICATION SYSTEM
// ============================================================================

export interface AutomationTrigger {
  id: string;
  loadId: string;
  customerId: string;
  customerPhone: string;
  triggerType:
    | 'status_change'
    | 'delay'
    | 'emergency'
    | 'scheduled'
    | 'response_based';
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiresHuman: boolean;
  escalationReason?: string;
  context: any;
}

export interface CommunicationRule {
  trigger: string;
  conditions: string[];
  automationType: 'sms' | 'voice' | 'email' | 'human_call';
  message: string;
  escalationTriggers: string[];
  humanRequired: boolean;
  followUpDelay?: number; // minutes
}

export interface EscalationCriteria {
  trigger: string;
  conditions: string[];
  urgency: 'normal' | 'urgent' | 'immediate';
  reason: string;
  assignTo: 'dispatcher' | 'broker' | 'manager' | 'customer_service';
  context: string;
}

// ============================================================================
// AUTOMATED COMMUNICATION SERVICE CLASS
// ============================================================================

class AutomatedCommunicationService {
  // ============================================================================
  // HUMAN ESCALATION DETECTION RULES
  // ============================================================================

  private humanEscalationRules: EscalationCriteria[] = [
    // CRITICAL SITUATIONS - IMMEDIATE HUMAN REQUIRED
    {
      trigger: 'load_emergency',
      conditions: ['accident', 'breakdown_major', 'theft', 'hazmat_incident'],
      urgency: 'immediate',
      reason: 'Emergency situation requires immediate human intervention',
      assignTo: 'manager',
      context:
        'Emergency protocols activated - full incident management required',
    },

    // MAJOR DELAYS - HUMAN REQUIRED
    {
      trigger: 'delay_major',
      conditions: [
        'delay > 4 hours',
        'missed_delivery_window',
        'customer_critical_shipment',
      ],
      urgency: 'urgent',
      reason: 'Major delay requires human explanation and solution',
      assignTo: 'broker',
      context:
        'Customer relationship management - potential compensation discussion',
    },

    // CUSTOMER DISSATISFACTION - HUMAN REQUIRED
    {
      trigger: 'customer_negative_response',
      conditions: [
        'sms_reply_angry',
        'rating < 3',
        'complaint_keywords',
        'demand_manager',
      ],
      urgency: 'urgent',
      reason: 'Customer dissatisfaction requires human relationship management',
      assignTo: 'broker',
      context: 'Customer retention at risk - personal attention required',
    },

    // COMPLEX LOGISTICS - HUMAN REQUIRED
    {
      trigger: 'complex_logistics',
      conditions: [
        'multi_stop_changes',
        'special_equipment_needed',
        'customs_issues',
        'permit_problems',
      ],
      urgency: 'urgent',
      reason: 'Complex logistics require human expertise and decision-making',
      assignTo: 'dispatcher',
      context: 'Operational complexity beyond automated systems',
    },

    // HIGH-VALUE CUSTOMERS - HUMAN PREFERRED
    {
      trigger: 'vip_customer',
      conditions: [
        'customer_tier_platinum',
        'annual_volume > $500k',
        'strategic_account',
      ],
      urgency: 'normal',
      reason: 'High-value customer deserves personal attention',
      assignTo: 'broker',
      context: 'Relationship building and premium service delivery',
    },

    // FINANCIAL ISSUES - HUMAN REQUIRED
    {
      trigger: 'financial_dispute',
      conditions: [
        'billing_dispute',
        'payment_overdue > 30_days',
        'rate_negotiation_requested',
      ],
      urgency: 'urgent',
      reason:
        'Financial matters require human negotiation and relationship management',
      assignTo: 'broker',
      context: 'Revenue protection and customer relationship preservation',
    },

    // REGULATORY/COMPLIANCE - HUMAN REQUIRED
    {
      trigger: 'compliance_issue',
      conditions: [
        'dot_violation',
        'customs_hold',
        'permit_expired',
        'hazmat_documentation',
      ],
      urgency: 'urgent',
      reason:
        'Compliance issues require human expertise and regulatory knowledge',
      assignTo: 'dispatcher',
      context:
        'Legal and regulatory compliance - specialized knowledge required',
    },
  ];

  // ============================================================================
  // AUTOMATED COMMUNICATION RULES
  // ============================================================================

  private communicationRules: CommunicationRule[] = [
    // ROUTINE STATUS UPDATES - AUTOMATED SMS
    {
      trigger: 'load_picked_up',
      conditions: ['normal_pickup', 'on_time', 'no_issues'],
      automationType: 'sms',
      message:
        '✅ Load FL-{loadId} picked up by {driverName}. ETA: {eta}. Track: fleetflowapp.com/track/{loadId}',
      escalationTriggers: ['customer_reply_concern', 'delivery_critical'],
      humanRequired: false,
    },

    {
      trigger: 'load_in_transit',
      conditions: ['normal_transit', 'on_schedule', 'no_delays'],
      automationType: 'sms',
      message:
        '🚛 Load FL-{loadId} in transit. Location: {currentLocation}. ETA: {eta}. Questions? Reply CALL',
      escalationTriggers: ['customer_reply_call', 'eta_concern'],
      humanRequired: false,
    },

    {
      trigger: 'load_delivered',
      conditions: ['successful_delivery', 'on_time', 'no_damage'],
      automationType: 'sms',
      message:
        '✅ Load FL-{loadId} delivered successfully! Thank you for choosing FleetFlow. Rate: fleetflowapp.com/rate/{loadId}',
      escalationTriggers: ['negative_rating', 'damage_report'],
      humanRequired: false,
    },

    // MINOR DELAYS - AUTOMATED WITH ESCALATION WATCH
    {
      trigger: 'delay_minor',
      conditions: ['delay < 2 hours', 'weather_related', 'traffic_delay'],
      automationType: 'sms',
      message:
        '⚠️ Load FL-{loadId} delayed {delayTime} due to {reason}. New ETA: {newEta}. Monitoring closely.',
      escalationTriggers: [
        'delay_extends',
        'customer_unhappy',
        'critical_delivery',
      ],
      humanRequired: false,
      followUpDelay: 60, // Check again in 1 hour
    },

    // APPOINTMENT CONFIRMATIONS - AUTOMATED VOICE
    {
      trigger: 'pickup_reminder',
      conditions: ['24_hours_before', 'confirmed_appointment', 'normal_pickup'],
      automationType: 'voice',
      message:
        'FleetFlow pickup confirmation for load FL-{loadId} tomorrow at {time}. Press 1 to confirm, 2 to reschedule, 0 for dispatcher.',
      escalationTriggers: ['press_0', 'press_2', 'no_response'],
      humanRequired: false,
    },

    // MAJOR ISSUES - IMMEDIATE HUMAN ESCALATION
    {
      trigger: 'load_emergency',
      conditions: ['any_emergency'],
      automationType: 'human_call',
      message:
        'Emergency situation detected - immediate human intervention required',
      escalationTriggers: ['immediate'],
      humanRequired: true,
    },

    {
      trigger: 'delay_major',
      conditions: ['delay > 4 hours'],
      automationType: 'human_call',
      message: 'Major delay requires personal explanation and solution',
      escalationTriggers: ['immediate'],
      humanRequired: true,
    },
  ];

  // ============================================================================
  // SMART ESCALATION DETECTION
  // ============================================================================

  async detectHumanRequired(trigger: AutomationTrigger): Promise<{
    requiresHuman: boolean;
    urgency: 'normal' | 'urgent' | 'immediate';
    reason: string;
    assignTo: string;
    suggestedAction: string;
  }> {
    // Check critical escalation rules
    for (const rule of this.humanEscalationRules) {
      if (this.matchesTrigger(trigger, rule)) {
        return {
          requiresHuman: true,
          urgency: rule.urgency,
          reason: rule.reason,
          assignTo: rule.assignTo,
          suggestedAction: this.getSuggestedAction(rule, trigger),
        };
      }
    }

    // Check customer-specific escalation factors
    const customerEscalation =
      await this.checkCustomerEscalationFactors(trigger);
    if (customerEscalation.requiresHuman) {
      return customerEscalation;
    }

    // Check load-specific escalation factors
    const loadEscalation = await this.checkLoadEscalationFactors(trigger);
    if (loadEscalation.requiresHuman) {
      return loadEscalation;
    }

    // Check historical communication patterns
    const historicalEscalation = await this.checkHistoricalPatterns(trigger);
    if (historicalEscalation.requiresHuman) {
      return historicalEscalation;
    }

    // Default to automated if no escalation triggers
    return {
      requiresHuman: false,
      urgency: 'normal',
      reason: 'Situation suitable for automated communication',
      assignTo: 'automated',
      suggestedAction: 'Proceed with automated communication',
    };
  }

  // ============================================================================
  // CUSTOMER-SPECIFIC ESCALATION FACTORS
  // ============================================================================

  private async checkCustomerEscalationFactors(
    trigger: AutomationTrigger
  ): Promise<any> {
    const customerProfile = await this.getCustomerProfile(trigger.customerId);

    // VIP/High-Value Customers
    if (
      customerProfile.tier === 'platinum' ||
      customerProfile.annualVolume > 500000
    ) {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'High-value customer deserves personal attention',
        assignTo: 'broker',
        suggestedAction: 'Provide premium white-glove service',
      };
    }

    // Customers with Recent Issues
    if (customerProfile.recentIssues > 2) {
      return {
        requiresHuman: true,
        urgency: 'urgent',
        reason:
          'Customer has had multiple recent issues - relationship at risk',
        assignTo: 'broker',
        suggestedAction: 'Personal attention to rebuild trust',
      };
    }

    // New Customers (First 5 Loads)
    if (customerProfile.totalLoads < 5) {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'New customer requires personal onboarding experience',
        assignTo: 'broker',
        suggestedAction: 'Build relationship and ensure satisfaction',
      };
    }

    // Customers Who Prefer Human Contact
    if (customerProfile.communicationPreference === 'human_only') {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'Customer preference for human communication',
        assignTo: 'broker',
        suggestedAction: 'Respect customer communication preferences',
      };
    }

    return { requiresHuman: false };
  }

  // ============================================================================
  // LOAD-SPECIFIC ESCALATION FACTORS
  // ============================================================================

  private async checkLoadEscalationFactors(
    trigger: AutomationTrigger
  ): Promise<any> {
    const loadDetails = await this.getLoadDetails(trigger.loadId);

    // High-Value Loads
    if (loadDetails.value > 100000) {
      return {
        requiresHuman: true,
        urgency: 'urgent',
        reason: 'High-value load requires personal attention',
        assignTo: 'dispatcher',
        suggestedAction: 'Ensure premium handling and communication',
      };
    }

    // Time-Critical Loads
    if (loadDetails.deliveryWindow === 'critical' || loadDetails.isRush) {
      return {
        requiresHuman: true,
        urgency: 'urgent',
        reason: 'Time-critical load requires personal monitoring',
        assignTo: 'dispatcher',
        suggestedAction: 'Proactive communication and issue resolution',
      };
    }

    // Hazmat/Special Handling
    if (loadDetails.isHazmat || loadDetails.requiresSpecialHandling) {
      return {
        requiresHuman: true,
        urgency: 'urgent',
        reason: 'Special handling requirements need human oversight',
        assignTo: 'dispatcher',
        suggestedAction: 'Ensure compliance and safety protocols',
      };
    }

    // Multi-Stop/Complex Loads
    if (loadDetails.stops > 3 || loadDetails.complexity === 'high') {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'Complex load logistics require human coordination',
        assignTo: 'dispatcher',
        suggestedAction: 'Personal coordination of complex logistics',
      };
    }

    return { requiresHuman: false };
  }

  // ============================================================================
  // HISTORICAL PATTERN ANALYSIS
  // ============================================================================

  private async checkHistoricalPatterns(
    trigger: AutomationTrigger
  ): Promise<any> {
    const history = await this.getCustomerCommunicationHistory(
      trigger.customerId
    );

    // Customer Frequently Escalates Automated Messages
    if (history.automatedEscalationRate > 0.7) {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'Customer frequently escalates automated messages to human',
        assignTo: 'broker',
        suggestedAction: 'Skip automation - direct human communication',
      };
    }

    // Recent Negative Interactions
    if (history.recentSentiment === 'negative') {
      return {
        requiresHuman: true,
        urgency: 'urgent',
        reason:
          'Recent negative interactions require human relationship repair',
        assignTo: 'broker',
        suggestedAction: 'Personal attention to rebuild relationship',
      };
    }

    // Customer Prefers Phone Over Text
    if (history.preferredChannel === 'phone') {
      return {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'Customer communication pattern shows phone preference',
        assignTo: 'broker',
        suggestedAction: 'Use voice communication instead of text',
      };
    }

    return { requiresHuman: false };
  }

  // ============================================================================
  // AUTOMATED COMMUNICATION EXECUTION
  // ============================================================================

  async executeAutomatedCommunication(trigger: AutomationTrigger): Promise<{
    success: boolean;
    communicationType: string;
    escalationScheduled: boolean;
    humanAssigned?: string;
  }> {
    // First, determine if human is required
    const escalationAnalysis = await this.detectHumanRequired(trigger);

    if (escalationAnalysis.requiresHuman) {
      // Skip automation - go straight to human
      return await this.escalateToHuman(trigger, escalationAnalysis);
    }

    // Find appropriate automated communication rule
    const rule = this.findCommunicationRule(trigger);
    if (!rule) {
      // No rule found - escalate to human as fallback
      return await this.escalateToHuman(trigger, {
        requiresHuman: true,
        urgency: 'normal',
        reason: 'No automated rule found for situation',
        assignTo: 'dispatcher',
        suggestedAction: 'Manual assessment required',
      });
    }

    // Execute automated communication
    let success = false;
    switch (rule.automationType) {
      case 'sms':
        success = await this.sendAutomatedSMS(trigger, rule);
        break;
      case 'voice':
        success = await this.makeAutomatedCall(trigger, rule);
        break;
      case 'email':
        success = await this.sendAutomatedEmail(trigger, rule);
        break;
      default:
        success = false;
    }

    // Log interaction in CRM
    await this.logAutomatedInteraction(trigger, rule, success);

    // Schedule follow-up monitoring if needed
    if (rule.followUpDelay) {
      await this.scheduleFollowUpMonitoring(trigger, rule.followUpDelay);
    }

    return {
      success,
      communicationType: rule.automationType,
      escalationScheduled: false,
    };
  }

  // ============================================================================
  // HUMAN ESCALATION EXECUTION
  // ============================================================================

  private async escalateToHuman(
    trigger: AutomationTrigger,
    escalation: any
  ): Promise<any> {
    // Find appropriate human agent
    const assignedAgent = await this.findAvailableAgent(
      escalation.assignTo,
      escalation.urgency
    );

    if (!assignedAgent) {
      // No agent available - use emergency protocol
      return await this.executeEmergencyProtocol(trigger, escalation);
    }

    // Create CRM transfer with full context
    const transferResult = await centralCRMService.initiateTransfer({
      fromUser: {
        userId: 'system',
        userCode: 'SYS-AUTO-0000',
        department: 'CS',
      } as UserIdentifier,
      toUser: assignedAgent,
      contactId: trigger.customerId,
      contactName: trigger.context.customerName || 'Customer',
      contactCompany: trigger.context.customerCompany || 'Unknown',
      reason: escalation.reason,
      notes: this.buildEscalationNotes(trigger, escalation),
      urgency:
        escalation.urgency === 'immediate'
          ? 'immediate'
          : escalation.urgency === 'urgent'
            ? 'urgent'
            : 'normal',
      context: {
        loadDetails: trigger.context,
        automationTrigger: trigger.triggerType,
        escalationReason: escalation.reason,
        suggestedAction: escalation.suggestedAction,
      },
    });

    // Send immediate notification to agent
    await this.notifyAgent(assignedAgent, trigger, escalation);

    return {
      success: true,
      communicationType: 'human_escalation',
      escalationScheduled: true,
      humanAssigned: assignedAgent.userCode,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private buildEscalationNotes(
    trigger: AutomationTrigger,
    escalation: any
  ): string {
    return `🤖 AUTOMATED ESCALATION ALERT

📋 SITUATION: ${trigger.triggerType}
🚛 LOAD: ${trigger.loadId}
⚠️ PRIORITY: ${trigger.priority}
📞 CUSTOMER: ${trigger.customerPhone}

🎯 ESCALATION REASON: ${escalation.reason}
💡 SUGGESTED ACTION: ${escalation.suggestedAction}

📊 CONTEXT:
${JSON.stringify(trigger.context, null, 2)}

⏰ ESCALATED: ${new Date().toISOString()}
🤖 SYSTEM: Automated Communication Service`;
  }

  private async findAvailableAgent(
    department: string,
    urgency: string
  ): Promise<UserIdentifier | null> {
    const users = await centralCRMService.getAllUsers();
    const departmentMap = {
      dispatcher: 'DC',
      broker: 'BB',
      manager: 'MGR',
      customer_service: 'CS',
    };

    const targetDept = departmentMap[department as keyof typeof departmentMap];
    const availableAgents = users.filter(
      (u) => u.department === targetDept && u.isOnline
    );

    return availableAgents.length > 0 ? availableAgents[0] : null;
  }

  private async sendAutomatedSMS(
    trigger: AutomationTrigger,
    rule: CommunicationRule
  ): Promise<boolean> {
    try {
      const message = this.formatMessage(rule.message, trigger.context);

      const response = await fetch('/api/crm/transfer-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: trigger.customerPhone,
          message: message,
          transferId: `AUTO_${trigger.id}`,
          urgency: 'normal',
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Automated SMS failed:', error);
      return false;
    }
  }

  private formatMessage(template: string, context: any): string {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return context[key] || match;
    });
  }

  private matchesTrigger(
    trigger: AutomationTrigger,
    rule: EscalationCriteria
  ): boolean {
    if (trigger.triggerType !== rule.trigger) return false;

    return rule.conditions.some((condition) => {
      // Simple condition matching - can be expanded
      return (
        trigger.context[condition] === true ||
        trigger.context.conditions?.includes(condition)
      );
    });
  }

  private findCommunicationRule(
    trigger: AutomationTrigger
  ): CommunicationRule | null {
    return (
      this.communicationRules.find(
        (rule) =>
          rule.trigger === trigger.triggerType &&
          this.matchesConditions(trigger, rule.conditions)
      ) || null
    );
  }

  private matchesConditions(
    trigger: AutomationTrigger,
    conditions: string[]
  ): boolean {
    // Simple condition matching logic
    return conditions.every((condition) => {
      return (
        trigger.context[condition] === true ||
        trigger.context.conditions?.includes(condition)
      );
    });
  }

  // Mock methods for data retrieval (replace with actual implementations)
  private async getCustomerProfile(customerId: string): Promise<any> {
    return {
      tier: 'standard',
      annualVolume: 250000,
      recentIssues: 1,
      totalLoads: 15,
      communicationPreference: 'mixed',
    };
  }

  private async getLoadDetails(loadId: string): Promise<any> {
    return {
      value: 50000,
      deliveryWindow: 'normal',
      isRush: false,
      isHazmat: false,
      requiresSpecialHandling: false,
      stops: 2,
      complexity: 'medium',
    };
  }

  private async getCustomerCommunicationHistory(
    customerId: string
  ): Promise<any> {
    return {
      automatedEscalationRate: 0.3,
      recentSentiment: 'neutral',
      preferredChannel: 'mixed',
    };
  }

  private async logAutomatedInteraction(
    trigger: AutomationTrigger,
    rule: CommunicationRule,
    success: boolean
  ): Promise<void> {
    await centralCRMService.createInteraction({
      interactionType: rule.automationType === 'sms' ? 'sms' : 'call',
      contactId: trigger.customerId,
      contactName: trigger.context.customerName || 'Customer',
      contactCompany: trigger.context.customerCompany || 'Unknown',
      subject: `Automated ${rule.automationType}: ${rule.trigger}`,
      content: rule.message,
      priority:
        trigger.priority === 'critical'
          ? 'urgent'
          : trigger.priority === 'high'
            ? 'high'
            : 'medium',
      status: success ? 'completed' : 'failed',
      tags: ['automated', rule.trigger, trigger.loadId],
    });
  }

  private async scheduleFollowUpMonitoring(
    trigger: AutomationTrigger,
    delayMinutes: number
  ): Promise<void> {
    // Schedule follow-up check
    console.info(
      `📅 Scheduling follow-up monitoring for ${trigger.loadId} in ${delayMinutes} minutes`
    );
  }

  private async makeAutomatedCall(
    trigger: AutomationTrigger,
    rule: CommunicationRule
  ): Promise<boolean> {
    // Implement automated voice call logic
    console.info(`📞 Making automated call for ${trigger.loadId}`);
    return true;
  }

  private async sendAutomatedEmail(
    trigger: AutomationTrigger,
    rule: CommunicationRule
  ): Promise<boolean> {
    // Implement automated email logic
    console.info(`📧 Sending automated email for ${trigger.loadId}`);
    return true;
  }

  private async notifyAgent(
    agent: UserIdentifier,
    trigger: AutomationTrigger,
    escalation: any
  ): Promise<void> {
    // Send immediate notification to assigned agent
    console.info(
      `🚨 Notifying ${agent.firstName} ${agent.lastName} of escalation for ${trigger.loadId}`
    );
  }

  private async executeEmergencyProtocol(
    trigger: AutomationTrigger,
    escalation: any
  ): Promise<any> {
    // Emergency protocol when no agents available
    console.info(
      `🚨 EMERGENCY PROTOCOL: No agents available for ${trigger.loadId}`
    );
    return {
      success: false,
      communicationType: 'emergency_protocol',
      escalationScheduled: true,
      humanAssigned: 'emergency_queue',
    };
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const automatedCommunicationService =
  new AutomatedCommunicationService();
export default automatedCommunicationService;
