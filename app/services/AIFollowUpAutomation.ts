/**
 * AI Follow-Up Automation Service
 * Intelligent call sequence automation based on call outcomes
 * Native FleetFlow implementation of SalesAI-like capabilities
 */

import { centralCRMService } from './CentralCRMService';

export interface FollowUpRule {
  id: string;
  name: string;
  trigger: {
    callOutcome: string[];
    customerType?: string[];
    industry?: string[];
    timeConditions?: {
      dayOfWeek?: string[];
      timeRange?: { start: string; end: string };
    };
  };
  actions: FollowUpAction[];
  isActive: boolean;
  priority: number;
}

export interface FollowUpAction {
  type: 'email' | 'sms' | 'call' | 'task' | 'crm_update';
  delay: number; // minutes
  content: {
    template: string;
    subject?: string;
    personalization?: Record<string, string>;
  };
  conditions?: {
    onlyBusinessHours?: boolean;
    skipWeekends?: boolean;
    maxAttempts?: number;
  };
}

export interface ScheduledFollowUp {
  id: string;
  ruleId: string;
  contactId: string;
  contactName: string;
  contactCompany: string;
  originalCallId: string;
  scheduledFor: string;
  action: FollowUpAction;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  attempts: number;
  createdAt: string;
  lastAttempt?: string;
  response?: {
    opened?: boolean;
    clicked?: boolean;
    replied?: boolean;
    sentimentScore?: number;
  };
}

export interface FollowUpAnalytics {
  totalScheduled: number;
  sentToday: number;
  responseRate: number;
  conversionRate: number;
  byOutcome: Record<
    string,
    {
      scheduled: number;
      sent: number;
      responses: number;
      conversions: number;
    }
  >;
  topPerformingRules: Array<{
    ruleId: string;
    name: string;
    responseRate: number;
    conversionRate: number;
  }>;
}

export class AIFollowUpAutomation {
  private static instance: AIFollowUpAutomation;
  private followUpRules: Map<string, FollowUpRule> = new Map();
  private scheduledFollowUps: Map<string, ScheduledFollowUp> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeDefaultRules();
    this.startProcessing();
    console.info('🤖 AI Follow-Up Automation Service initialized');
  }

  public static getInstance(): AIFollowUpAutomation {
    if (!AIFollowUpAutomation.instance) {
      AIFollowUpAutomation.instance = new AIFollowUpAutomation();
    }
    return AIFollowUpAutomation.instance;
  }

  /**
   * Initialize default follow-up rules for freight industry
   */
  private initializeDefaultRules(): void {
    const defaultRules: FollowUpRule[] = [
      {
        id: 'interested_but_comparing',
        name: 'Interested but Price Shopping',
        trigger: {
          callOutcome: [
            'interested_comparing',
            'price_shopping',
            'getting_quotes',
          ],
        },
        actions: [
          {
            type: 'email',
            delay: 60, // 1 hour
            content: {
              template: 'competitive_analysis',
              subject:
                "FleetFlow vs Competition - Why We're Worth the Investment",
              personalization: {
                cost_savings: '15-25% through AI optimization',
                reliability_score: '94.2% on-time delivery',
                technology_advantage:
                  'Real-time tracking and predictive analytics',
              },
            },
            conditions: {
              onlyBusinessHours: true,
              maxAttempts: 1,
            },
          },
          {
            type: 'call',
            delay: 1440, // 24 hours
            content: {
              template: 'follow_up_call',
              personalization: {
                callback_reason:
                  'discuss competitive analysis and answer questions',
              },
            },
            conditions: {
              onlyBusinessHours: true,
              skipWeekends: true,
              maxAttempts: 2,
            },
          },
        ],
        isActive: true,
        priority: 1,
      },
      {
        id: 'budget_concerns',
        name: 'Budget or Rate Concerns',
        trigger: {
          callOutcome: ['budget_concerns', 'rates_too_high', 'cost_objection'],
        },
        actions: [
          {
            type: 'email',
            delay: 180, // 3 hours
            content: {
              template: 'roi_calculator',
              subject: 'ROI Calculator: See Your Savings with FleetFlow',
              personalization: {
                fuel_savings: '18.7% average fuel cost reduction',
                efficiency_gains: '25% faster quote turnaround',
                hidden_costs: 'No surprise fees or hidden charges',
              },
            },
          },
          {
            type: 'sms',
            delay: 4320, // 3 days
            content: {
              template: 'budget_friendly_options',
              personalization: {
                message:
                  'Hi {contact_name}, I found some budget-friendly shipping options for {company}. Quick call to review? - {agent_name}',
              },
            },
          },
        ],
        isActive: true,
        priority: 2,
      },
      {
        id: 'no_immediate_need',
        name: 'No Immediate Shipping Need',
        trigger: {
          callOutcome: [
            'no_immediate_need',
            'future_consideration',
            'not_shipping_now',
          ],
        },
        actions: [
          {
            type: 'crm_update',
            delay: 5,
            content: {
              template: 'future_prospect',
              personalization: {
                follow_up_date: '30_days',
                opportunity_type: 'future_freight_needs',
              },
            },
          },
          {
            type: 'email',
            delay: 20160, // 2 weeks
            content: {
              template: 'market_insights',
              subject: 'Freight Market Update - Trends Affecting {company}',
              personalization: {
                market_trends: 'current freight market conditions',
                industry_insights: 'relevant to their business',
              },
            },
          },
          {
            type: 'call',
            delay: 43200, // 30 days
            content: {
              template: 'quarterly_check_in',
              personalization: {
                callback_reason: 'quarterly check-in on shipping needs',
              },
            },
          },
        ],
        isActive: true,
        priority: 3,
      },
      {
        id: 'decision_maker_unavailable',
        name: 'Need to Speak with Decision Maker',
        trigger: {
          callOutcome: [
            'decision_maker_unavailable',
            'need_approval',
            'not_authorized',
          ],
        },
        actions: [
          {
            type: 'email',
            delay: 30,
            content: {
              template: 'decision_maker_materials',
              subject:
                'Materials for Your Decision Maker - FleetFlow Freight Services',
              personalization: {
                executive_summary: 'one-page business case',
                roi_projection: 'estimated cost savings',
                references: 'similar company success stories',
              },
            },
          },
          {
            type: 'call',
            delay: 2160, // 1.5 days
            content: {
              template: 'decision_maker_follow_up',
              personalization: {
                callback_reason:
                  'follow up on materials sent and schedule decision maker call',
              },
            },
          },
        ],
        isActive: true,
        priority: 1,
      },
      {
        id: 'voicemail_left',
        name: 'Voicemail Follow-Up Sequence',
        trigger: {
          callOutcome: ['voicemail', 'no_answer'],
        },
        actions: [
          {
            type: 'sms',
            delay: 15,
            content: {
              template: 'voicemail_sms',
              personalization: {
                message:
                  'Hi {contact_name}, {agent_name} from FleetFlow. Left voicemail about freight opportunities. Text back best time to call!',
              },
            },
          },
          {
            type: 'email',
            delay: 120,
            content: {
              template: 'voicemail_email',
              subject: 'Missed Connection - FleetFlow Freight Opportunities',
              personalization: {
                call_summary:
                  'freight shipping opportunities for your business',
              },
            },
          },
          {
            type: 'call',
            delay: 1440, // Next day
            content: {
              template: 'second_attempt_call',
            },
            conditions: {
              onlyBusinessHours: true,
              maxAttempts: 1,
            },
          },
        ],
        isActive: true,
        priority: 2,
      },
      {
        id: 'hot_prospect',
        name: 'Hot Prospect - Ready to Move',
        trigger: {
          callOutcome: ['very_interested', 'ready_to_proceed', 'hot_prospect'],
        },
        actions: [
          {
            type: 'task',
            delay: 5,
            content: {
              template: 'urgent_quote_needed',
              personalization: {
                priority: 'HIGH',
                task: 'Prepare formal quote immediately',
              },
            },
          },
          {
            type: 'email',
            delay: 30,
            content: {
              template: 'formal_quote',
              subject: 'Your FleetFlow Freight Quote - Ready to Get Started!',
              personalization: {
                urgency: 'high_priority',
                next_steps: 'contract and setup process',
              },
            },
          },
          {
            type: 'call',
            delay: 240, // 4 hours
            content: {
              template: 'quote_follow_up',
              personalization: {
                callback_reason: 'discuss quote and next steps',
              },
            },
          },
        ],
        isActive: true,
        priority: 1,
      },
    ];

    defaultRules.forEach((rule) => {
      this.followUpRules.set(rule.id, rule);
    });
  }

  /**
   * Process call outcome and schedule appropriate follow-ups
   */
  public async processCallOutcome(callData: {
    callId: string;
    contactId: string;
    contactName: string;
    contactCompany: string;
    outcome: string;
    agentId: string;
    customerType?: string;
    industry?: string;
  }): Promise<void> {
    console.info(
      `🔄 Processing call outcome: ${callData.outcome} for ${callData.contactName}`
    );

    // Find matching rules
    const matchingRules = Array.from(this.followUpRules.values())
      .filter(
        (rule) =>
          rule.isActive && rule.trigger.callOutcome.includes(callData.outcome)
      )
      .sort((a, b) => a.priority - b.priority);

    if (matchingRules.length === 0) {
      console.info(`No follow-up rules match outcome: ${callData.outcome}`);
      return;
    }

    // Use the highest priority rule
    const rule = matchingRules[0];
    console.info(`📋 Applying follow-up rule: ${rule.name}`);

    // Schedule all actions for this rule
    for (const action of rule.actions) {
      await this.scheduleFollowUpAction(callData, rule, action);
    }
  }

  /**
   * Schedule a specific follow-up action
   */
  private async scheduleFollowUpAction(
    callData: any,
    rule: FollowUpRule,
    action: FollowUpAction
  ): Promise<void> {
    const scheduledTime = new Date(Date.now() + action.delay * 60000);

    // Apply business hours constraints
    if (action.conditions?.onlyBusinessHours) {
      scheduledTime = this.adjustForBusinessHours(scheduledTime);
    }
    if (action.conditions?.skipWeekends) {
      scheduledTime = this.adjustForWeekends(scheduledTime);
    }

    const followUp: ScheduledFollowUp = {
      id: `followup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      contactId: callData.contactId,
      contactName: callData.contactName,
      contactCompany: callData.contactCompany,
      originalCallId: callData.callId,
      scheduledFor: scheduledTime.toISOString(),
      action,
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
    };

    this.scheduledFollowUps.set(followUp.id, followUp);
    console.info(
      `⏰ Scheduled ${action.type} follow-up for ${callData.contactName} at ${scheduledTime.toLocaleString()}`
    );
  }

  /**
   * Start processing scheduled follow-ups
   */
  private startProcessing(): void {
    // Process every minute
    this.processingInterval = setInterval(() => {
      this.processScheduledFollowUps();
    }, 60000);

    console.info('⚡ Follow-up processing started - checking every minute');
  }

  /**
   * Process due follow-ups
   */
  private async processScheduledFollowUps(): Promise<void> {
    const now = new Date();
    const dueFollowUps = Array.from(this.scheduledFollowUps.values()).filter(
      (followUp) => {
        return (
          followUp.status === 'pending' &&
          new Date(followUp.scheduledFor) <= now &&
          followUp.attempts < (followUp.action.conditions?.maxAttempts || 3)
        );
      }
    );

    for (const followUp of dueFollowUps) {
      await this.executeFollowUp(followUp);
    }
  }

  /**
   * Execute a specific follow-up action
   */
  private async executeFollowUp(followUp: ScheduledFollowUp): Promise<void> {
    console.info(
      `📬 Executing ${followUp.action.type} follow-up for ${followUp.contactName}`
    );

    try {
      followUp.attempts++;
      followUp.lastAttempt = new Date().toISOString();

      switch (followUp.action.type) {
        case 'email':
          await this.sendFollowUpEmail(followUp);
          break;
        case 'sms':
          await this.sendFollowUpSMS(followUp);
          break;
        case 'call':
          await this.scheduleFollowUpCall(followUp);
          break;
        case 'task':
          await this.createFollowUpTask(followUp);
          break;
        case 'crm_update':
          await this.updateCRM(followUp);
          break;
      }

      followUp.status = 'sent';
      console.info(
        `✅ Follow-up ${followUp.action.type} sent to ${followUp.contactName}`
      );
    } catch (error) {
      console.error(
        `❌ Failed to execute follow-up for ${followUp.contactName}:`,
        error
      );
      followUp.status = 'failed';

      // Retry logic
      if (followUp.attempts < (followUp.action.conditions?.maxAttempts || 3)) {
        // Reschedule for 30 minutes later
        const retryTime = new Date(Date.now() + 30 * 60000);
        followUp.scheduledFor = retryTime.toISOString();
        followUp.status = 'pending';
      }
    }
  }

  /**
   * Send follow-up email
   */
  private async sendFollowUpEmail(followUp: ScheduledFollowUp): Promise<void> {
    const emailContent = this.personalizeContent(
      followUp.action.content.template,
      followUp.action.content.personalization || {},
      followUp
    );

    // In production, this would integrate with actual email service
    console.info(`📧 Email sent to ${followUp.contactName}:`, {
      subject: followUp.action.content.subject,
      content: emailContent,
    });

    // Simulate email tracking
    setTimeout(() => {
      if (Math.random() > 0.7) {
        // 30% open rate simulation
        followUp.response = { opened: true };
      }
    }, 60000); // Check after 1 minute
  }

  /**
   * Send follow-up SMS
   */
  private async sendFollowUpSMS(followUp: ScheduledFollowUp): Promise<void> {
    const smsContent = this.personalizeContent(
      followUp.action.content.personalization?.message ||
        'Follow-up from FleetFlow',
      {},
      followUp
    );

    // In production, this would integrate with Twilio
    console.info(`📱 SMS sent to ${followUp.contactName}: ${smsContent}`);
  }

  /**
   * Schedule follow-up call
   */
  private async scheduleFollowUpCall(
    followUp: ScheduledFollowUp
  ): Promise<void> {
    // Add to CRM as scheduled activity
    await centralCRMService.createActivity({
      type: 'call',
      contactId: followUp.contactId,
      subject: `Follow-up call - ${followUp.ruleId}`,
      scheduledFor: followUp.scheduledFor,
      notes:
        followUp.action.content.personalization?.callback_reason ||
        'Scheduled follow-up call',
    });

    console.info(`📞 Follow-up call scheduled for ${followUp.contactName}`);
  }

  /**
   * Create follow-up task
   */
  private async createFollowUpTask(followUp: ScheduledFollowUp): Promise<void> {
    // Create task in system
    const taskContent = this.personalizeContent(
      followUp.action.content.template,
      followUp.action.content.personalization || {},
      followUp
    );

    console.info(`✅ Task created for ${followUp.contactName}: ${taskContent}`);
  }

  /**
   * Update CRM with follow-up information
   */
  private async updateCRM(followUp: ScheduledFollowUp): Promise<void> {
    // Update contact record
    await centralCRMService.updateContact(followUp.contactId, {
      lastFollowUp: new Date().toISOString(),
      followUpReason: followUp.ruleId,
      nextFollowUpDate: followUp.action.content.personalization?.follow_up_date,
    });

    console.info(`📊 CRM updated for ${followUp.contactName}`);
  }

  /**
   * Personalize content with dynamic values
   */
  private personalizeContent(
    template: string,
    personalization: Record<string, string>,
    followUp: ScheduledFollowUp
  ): string {
    let content = template;

    // Replace standard placeholders
    content = content.replace(/\{contact_name\}/g, followUp.contactName);
    content = content.replace(/\{company\}/g, followUp.contactCompany);
    content = content.replace(/\{agent_name\}/g, 'FleetFlow Agent');

    // Replace custom personalization
    Object.entries(personalization).forEach(([key, value]) => {
      content = content.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    });

    return content;
  }

  /**
   * Adjust time for business hours (9 AM - 5 PM)
   */
  private adjustForBusinessHours(date: Date): Date {
    const adjusted = new Date(date);
    const hour = adjusted.getHours();

    if (hour < 9) {
      adjusted.setHours(9, 0, 0, 0);
    } else if (hour > 17) {
      adjusted.setDate(adjusted.getDate() + 1);
      adjusted.setHours(9, 0, 0, 0);
    }

    return adjusted;
  }

  /**
   * Adjust time to skip weekends
   */
  private adjustForWeekends(date: Date): Date {
    const adjusted = new Date(date);
    const day = adjusted.getDay();

    if (day === 0) {
      // Sunday
      adjusted.setDate(adjusted.getDate() + 1);
    } else if (day === 6) {
      // Saturday
      adjusted.setDate(adjusted.getDate() + 2);
    }

    return adjusted;
  }

  /**
   * Get follow-up analytics
   */
  public getAnalytics(): FollowUpAnalytics {
    const allFollowUps = Array.from(this.scheduledFollowUps.values());
    const today = new Date().toDateString();

    const sentToday = allFollowUps.filter(
      (f) =>
        f.status === 'sent' &&
        new Date(f.lastAttempt || f.createdAt).toDateString() === today
    ).length;

    const totalWithResponses = allFollowUps.filter(
      (f) => f.response?.opened || f.response?.replied
    ).length;
    const totalSent = allFollowUps.filter((f) => f.status === 'sent').length;

    return {
      totalScheduled: allFollowUps.length,
      sentToday,
      responseRate: totalSent > 0 ? (totalWithResponses / totalSent) * 100 : 0,
      conversionRate: 23.5, // Mock data - would calculate from actual conversions
      byOutcome: this.calculateOutcomeAnalytics(allFollowUps),
      topPerformingRules: this.getTopPerformingRules(allFollowUps),
    };
  }

  private calculateOutcomeAnalytics(
    followUps: ScheduledFollowUp[]
  ): Record<string, any> {
    const analytics: Record<string, any> = {};

    followUps.forEach((followUp) => {
      const ruleId = followUp.ruleId;
      if (!analytics[ruleId]) {
        analytics[ruleId] = {
          scheduled: 0,
          sent: 0,
          responses: 0,
          conversions: 0,
        };
      }

      analytics[ruleId].scheduled++;
      if (followUp.status === 'sent') analytics[ruleId].sent++;
      if (followUp.response?.replied) analytics[ruleId].responses++;
      // Conversions would be tracked through CRM integration
    });

    return analytics;
  }

  private getTopPerformingRules(followUps: ScheduledFollowUp[]): Array<any> {
    const rulePerformance: Record<string, { sent: number; responses: number }> =
      {};

    followUps.forEach((followUp) => {
      const ruleId = followUp.ruleId;
      if (!rulePerformance[ruleId]) {
        rulePerformance[ruleId] = { sent: 0, responses: 0 };
      }

      if (followUp.status === 'sent') rulePerformance[ruleId].sent++;
      if (followUp.response?.replied) rulePerformance[ruleId].responses++;
    });

    return Object.entries(rulePerformance)
      .map(([ruleId, stats]) => ({
        ruleId,
        name: this.followUpRules.get(ruleId)?.name || ruleId,
        responseRate: stats.sent > 0 ? (stats.responses / stats.sent) * 100 : 0,
        conversionRate: 15.5, // Mock data
      }))
      .sort((a, b) => b.responseRate - a.responseRate)
      .slice(0, 5);
  }

  /**
   * Get all scheduled follow-ups for monitoring
   */
  public getScheduledFollowUps(): ScheduledFollowUp[] {
    return Array.from(this.scheduledFollowUps.values()).sort(
      (a, b) =>
        new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
    );
  }

  /**
   * Cancel a scheduled follow-up
   */
  public cancelFollowUp(followUpId: string): boolean {
    const followUp = this.scheduledFollowUps.get(followUpId);
    if (followUp && followUp.status === 'pending') {
      followUp.status = 'cancelled';
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const aiFollowUpAutomation = AIFollowUpAutomation.getInstance();
