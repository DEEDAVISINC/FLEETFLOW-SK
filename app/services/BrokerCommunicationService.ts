/**
 * Broker Communication Service
 * Enhanced real-time communication center for broker operations
 */

export interface CommunicationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'voice_script';
  category:
    | 'negotiation'
    | 'follow_up'
    | 'confirmation'
    | 'emergency'
    | 'marketing';
  subject?: string;
  template: string;
  variables: string[];
  usage: number;
  effectiveness: number; // percentage
}

export interface CommunicationThread {
  id: string;
  loadId?: string;
  shipperId: string;
  shipperName: string;
  shipperContact: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    preferredMethod: 'email' | 'sms' | 'whatsapp' | 'voice';
  };
  brokerId: string;
  brokerName: string;
  subject: string;
  status: 'active' | 'pending_response' | 'closed' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  messages: CommunicationMessage[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  nextFollowUp?: string;
  autoFollowUpEnabled: boolean;
  negotiationStage?: 'initial' | 'counteroffer' | 'final_terms' | 'closed';
  expectedResponse?: string;
}

export interface CommunicationMessage {
  id: string;
  threadId: string;
  type: 'email' | 'sms' | 'whatsapp' | 'voice_call' | 'system';
  direction: 'inbound' | 'outbound';
  from: {
    id: string;
    name: string;
    contact: string;
    type: 'broker' | 'shipper' | 'system';
  };
  to: {
    id: string;
    name: string;
    contact: string;
    type: 'broker' | 'shipper';
  };
  subject?: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
  metadata?: {
    templateUsed?: string;
    callDuration?: number;
    attachment?: string[];
    deliveryConfirmation?: boolean;
    readReceipt?: boolean;
    responseTime?: number;
  };
  aiSentiment?: 'positive' | 'neutral' | 'negative';
  aiSummary?: string;
  followUpRequired?: boolean;
}

export interface VoiceCallSession {
  id: string;
  threadId: string;
  from: string;
  to: string;
  duration: number;
  status: 'completed' | 'missed' | 'failed';
  recording?: string;
  transcript?: string;
  summary: string;
  outcome:
    | 'successful'
    | 'callback_required'
    | 'negotiation_continues'
    | 'deal_closed';
  followUpActions: string[];
  timestamp: string;
}

export interface AutoFollowUpRule {
  id: string;
  name: string;
  trigger:
    | 'no_response'
    | 'time_based'
    | 'status_change'
    | 'priority_escalation';
  condition: {
    timeDelay?: number; // hours
    statuses?: string[];
    priorities?: string[];
    loadTypes?: string[];
  };
  action: {
    type: 'email' | 'sms' | 'whatsapp' | 'task_creation' | 'escalation';
    templateId?: string;
    message?: string;
    assignTo?: string;
  };
  enabled: boolean;
  effectiveness: number;
}

export interface CommunicationAnalytics {
  totalThreads: number;
  activeThreads: number;
  responseRate: number;
  averageResponseTime: number; // hours
  successfulNegotiations: number;
  topTemplates: Array<{
    templateId: string;
    name: string;
    usage: number;
    effectiveness: number;
  }>;
  channelPerformance: Record<
    string,
    {
      sent: number;
      delivered: number;
      responses: number;
      effectiveness: number;
    }
  >;
  timeToClose: number; // average hours
  customerSatisfaction: number;
}

export class BrokerCommunicationService {
  private static instance: BrokerCommunicationService;
  private communicationThreads: Map<string, CommunicationThread> = new Map();
  private templates: Map<string, CommunicationTemplate> = new Map();
  private followUpRules: Map<string, AutoFollowUpRule> = new Map();
  private voiceCalls: Map<string, VoiceCallSession> = new Map();

  public static getInstance(): BrokerCommunicationService {
    if (!BrokerCommunicationService.instance) {
      BrokerCommunicationService.instance = new BrokerCommunicationService();
    }
    return BrokerCommunicationService.instance;
  }

  constructor() {
    this.initializeMockData();
    this.startAutoFollowUpEngine();
  }

  private initializeMockData() {
    // Initialize communication templates
    this.templates.set('initial_rate_quote', {
      id: 'initial_rate_quote',
      name: 'Initial Rate Quote',
      type: 'email',
      category: 'negotiation',
      subject: 'Rate Quote for Load #{LOAD_ID} - {ROUTE}',
      template: `Hello {SHIPPER_NAME},

Thank you for considering us for your freight needs.

**Load Details:**
- Route: {ORIGIN} to {DESTINATION}
- Equipment: {EQUIPMENT_TYPE}
- Weight: {WEIGHT} lbs
- Pickup: {PICKUP_DATE}
- Delivery: {DELIVERY_DATE}

**Our Competitive Rate:** ${RATE}

This rate includes:
✓ Full liability coverage
✓ Real-time GPS tracking
✓ 24/7 customer support
✓ Experienced carrier network

We can confirm capacity within 2 hours. Would you like to proceed?

Best regards,
{BROKER_NAME}
{BROKER_CONTACT}`,
      variables: [
        'SHIPPER_NAME',
        'LOAD_ID',
        'ROUTE',
        'ORIGIN',
        'DESTINATION',
        'EQUIPMENT_TYPE',
        'WEIGHT',
        'PICKUP_DATE',
        'DELIVERY_DATE',
        'RATE',
        'BROKER_NAME',
        'BROKER_CONTACT',
      ],
      usage: 245,
      effectiveness: 73.2,
    });

    this.templates.set('follow_up_no_response', {
      id: 'follow_up_no_response',
      name: 'Follow-up - No Response',
      type: 'sms',
      category: 'follow_up',
      template: `Hi {SHIPPER_NAME}, following up on our rate quote for {ROUTE} load. Still need coverage? Our rate of ${RATE} is valid until {EXPIRY_TIME}. Quick yes/no? Thanks! - {BROKER_NAME}`,
      variables: [
        'SHIPPER_NAME',
        'ROUTE',
        'RATE',
        'EXPIRY_TIME',
        'BROKER_NAME',
      ],
      usage: 189,
      effectiveness: 61.8,
    });

    this.templates.set('rate_confirmation', {
      id: 'rate_confirmation',
      name: 'Rate Confirmation',
      type: 'email',
      category: 'confirmation',
      subject: 'CONFIRMED: Load #{LOAD_ID} at ${RATE}',
      template: `Great news {SHIPPER_NAME}!

Your load is CONFIRMED:

**Load #{LOAD_ID}**
📍 Route: {ORIGIN} → {DESTINATION}
💰 Rate: ${RATE}
🚛 Equipment: {EQUIPMENT_TYPE}
📅 Pickup: {PICKUP_DATE}
📅 Delivery: {DELIVERY_DATE}

**Next Steps:**
1. BOL will be generated within 30 minutes
2. Carrier assignment notification in 1 hour
3. Real-time tracking link will be provided

Contact me directly with any questions: {BROKER_PHONE}

{BROKER_NAME}
{COMPANY_NAME}`,
      variables: [
        'SHIPPER_NAME',
        'LOAD_ID',
        'ORIGIN',
        'DESTINATION',
        'RATE',
        'EQUIPMENT_TYPE',
        'PICKUP_DATE',
        'DELIVERY_DATE',
        'BROKER_PHONE',
        'BROKER_NAME',
        'COMPANY_NAME',
      ],
      usage: 156,
      effectiveness: 94.1,
    });

    // Initialize communication threads with real negotiation examples
    const thread1: CommunicationThread = {
      id: 'thread_walmart_001',
      loadId: 'WMT_ATL_001',
      shipperId: 'walmart_logistics',
      shipperName: 'Walmart Distribution Center',
      shipperContact: {
        email: 'logistics@walmart.com',
        phone: '+1-555-0123',
        whatsapp: '+1-555-0123',
        preferredMethod: 'email',
      },
      brokerId: 'broker_001',
      brokerName: 'John Smith',
      subject: 'Load WMT_ATL_001: Atlanta to Charlotte',
      status: 'active',
      priority: 'high',
      messages: [
        {
          id: 'msg_001',
          threadId: 'thread_walmart_001',
          type: 'email',
          direction: 'outbound',
          from: {
            id: 'broker_001',
            name: 'John Smith',
            contact: 'john@fleetflow.com',
            type: 'broker',
          },
          to: {
            id: 'walmart_logistics',
            name: 'Walmart Logistics',
            contact: 'logistics@walmart.com',
            type: 'shipper',
          },
          subject: 'Rate Quote for Load WMT_ATL_001 - Atlanta to Charlotte',
          content:
            'Hello Walmart Team,\n\nOur competitive rate for your Atlanta to Charlotte load is $1,850. This includes full coverage and 24/7 tracking.\n\nBest regards,\nJohn Smith',
          timestamp: '2024-01-15T09:00:00Z',
          status: 'read',
          metadata: {
            templateUsed: 'initial_rate_quote',
            readReceipt: true,
            responseTime: 2.5,
          },
          aiSentiment: 'positive',
          aiSummary:
            'Initial rate quote sent with competitive pricing and value propositions',
        },
        {
          id: 'msg_002',
          threadId: 'thread_walmart_001',
          type: 'email',
          direction: 'inbound',
          from: {
            id: 'walmart_logistics',
            name: 'Walmart Logistics',
            contact: 'logistics@walmart.com',
            type: 'shipper',
          },
          to: {
            id: 'broker_001',
            name: 'John Smith',
            contact: 'john@fleetflow.com',
            type: 'broker',
          },
          subject: 'RE: Rate Quote for Load WMT_ATL_001',
          content:
            'John,\n\nThanks for the quick quote. We typically see rates around $1,650 for this lane. Can you do better?\n\nThanks,\nSarah - Walmart Logistics',
          timestamp: '2024-01-15T11:30:00Z',
          status: 'responded',
          metadata: {
            responseTime: 2.5,
          },
          aiSentiment: 'neutral',
          aiSummary:
            'Counteroffer received, requesting $200 reduction. Professional tone.',
          followUpRequired: true,
        },
      ],
      tags: ['negotiation', 'walmart', 'atlanta_charlotte'],
      createdAt: '2024-01-15T09:00:00Z',
      updatedAt: '2024-01-15T11:30:00Z',
      nextFollowUp: '2024-01-15T15:00:00Z',
      autoFollowUpEnabled: true,
      negotiationStage: 'counteroffer',
      expectedResponse: '2024-01-15T17:00:00Z',
    };

    this.communicationThreads.set(thread1.id, thread1);

    // Initialize auto follow-up rules
    this.followUpRules.set('no_response_24h', {
      id: 'no_response_24h',
      name: 'No Response - 24 Hour Follow-up',
      trigger: 'no_response',
      condition: {
        timeDelay: 24,
        priorities: ['high', 'urgent'],
      },
      action: {
        type: 'sms',
        templateId: 'follow_up_no_response',
        message: 'Quick follow-up on our rate quote. Still interested?',
      },
      enabled: true,
      effectiveness: 67.3,
    });

    this.followUpRules.set('negotiation_stalled', {
      id: 'negotiation_stalled',
      name: 'Negotiation Stalled - Manager Escalation',
      trigger: 'time_based',
      condition: {
        timeDelay: 48,
        statuses: ['pending_response'],
      },
      action: {
        type: 'escalation',
        assignTo: 'manager_001',
        message: 'Negotiation requires management attention',
      },
      enabled: true,
      effectiveness: 82.1,
    });
  }

  /**
   * Get all communication threads for a broker
   */
  public getCommunicationThreads(
    brokerId: string,
    filters?: {
      status?: string;
      priority?: string;
      search?: string;
      loadId?: string;
    }
  ): CommunicationThread[] {
    let threads = Array.from(this.communicationThreads.values()).filter(
      (thread) => thread.brokerId === brokerId
    );

    if (filters?.status && filters.status !== 'all') {
      threads = threads.filter((thread) => thread.status === filters.status);
    }

    if (filters?.priority && filters.priority !== 'all') {
      threads = threads.filter(
        (thread) => thread.priority === filters.priority
      );
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      threads = threads.filter(
        (thread) =>
          thread.shipperName.toLowerCase().includes(search) ||
          thread.subject.toLowerCase().includes(search) ||
          thread.tags.some((tag) => tag.toLowerCase().includes(search))
      );
    }

    if (filters?.loadId) {
      threads = threads.filter((thread) => thread.loadId === filters.loadId);
    }

    return threads.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  /**
   * Send a new message in a communication thread
   */
  public async sendMessage(
    threadId: string,
    type: 'email' | 'sms' | 'whatsapp',
    content: string,
    templateId?: string
  ): Promise<CommunicationMessage> {
    const thread = this.communicationThreads.get(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    const message: CommunicationMessage = {
      id: `msg_${Date.now()}`,
      threadId,
      type,
      direction: 'outbound',
      from: {
        id: thread.brokerId,
        name: thread.brokerName,
        contact: 'broker@fleetflow.com',
        type: 'broker',
      },
      to: {
        id: thread.shipperId,
        name: thread.shipperName,
        contact:
          thread.shipperContact.email || thread.shipperContact.phone || '',
        type: 'shipper',
      },
      content,
      timestamp: new Date().toISOString(),
      status: 'sent',
      metadata: {
        templateUsed: templateId,
        deliveryConfirmation: true,
      },
      aiSentiment: this.analyzeSentiment(content),
      aiSummary: this.generateMessageSummary(content),
    };

    // Add message to thread
    thread.messages.push(message);
    thread.updatedAt = new Date().toISOString();
    thread.status = 'pending_response';

    // Simulate message delivery based on type
    setTimeout(
      () => {
        message.status = 'delivered';
        if (type === 'email') {
          // Simulate read receipt after 5-15 minutes
          setTimeout(
            () => {
              message.status = 'read';
            },
            Math.random() * 600000 + 300000
          );
        }
      },
      Math.random() * 30000 + 5000
    );

    // Update template usage if used
    if (templateId && this.templates.has(templateId)) {
      const template = this.templates.get(templateId)!;
      template.usage += 1;
      this.templates.set(templateId, template);
    }

    return message;
  }

  /**
   * Make a voice call
   */
  public async makeCall(
    threadId: string,
    toNumber: string,
    script?: string
  ): Promise<VoiceCallSession> {
    const thread = this.communicationThreads.get(threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }

    const callSession: VoiceCallSession = {
      id: `call_${Date.now()}`,
      threadId,
      from: '+1-555-BROKER',
      to: toNumber,
      duration: 0,
      status: 'completed',
      summary: 'Initiating call...',
      outcome: 'successful',
      followUpActions: [],
      timestamp: new Date().toISOString(),
    };

    // Simulate call completion
    setTimeout(() => {
      callSession.duration = Math.floor(Math.random() * 600) + 120; // 2-12 minutes
      callSession.transcript = this.generateCallTranscript(thread, script);
      callSession.summary = this.generateCallSummary(callSession.transcript);
      callSession.followUpActions = this.generateFollowUpActions(
        callSession.transcript
      );

      // Add call as system message to thread
      const callMessage: CommunicationMessage = {
        id: `msg_call_${Date.now()}`,
        threadId,
        type: 'voice_call',
        direction: 'outbound',
        from: {
          id: thread.brokerId,
          name: thread.brokerName,
          contact: '+1-555-BROKER',
          type: 'broker',
        },
        to: {
          id: thread.shipperId,
          name: thread.shipperName,
          contact: toNumber,
          type: 'shipper',
        },
        content: `Voice call completed (${Math.floor(callSession.duration / 60)}:${(callSession.duration % 60).toString().padStart(2, '0')})\n\nSummary: ${callSession.summary}`,
        timestamp: callSession.timestamp,
        status: 'delivered',
        metadata: {
          callDuration: callSession.duration,
        },
        aiSentiment: 'positive',
        aiSummary: callSession.summary,
      };

      thread.messages.push(callMessage);
      thread.updatedAt = new Date().toISOString();
    }, 3000);

    this.voiceCalls.set(callSession.id, callSession);
    return callSession;
  }

  /**
   * Get communication templates
   */
  public getTemplates(category?: string): CommunicationTemplate[] {
    let templates = Array.from(this.templates.values());

    if (category && category !== 'all') {
      templates = templates.filter(
        (template) => template.category === category
      );
    }

    return templates.sort((a, b) => b.usage - a.usage);
  }

  /**
   * Process template with variables
   */
  public processTemplate(
    templateId: string,
    variables: Record<string, string>
  ): { subject?: string; content: string } {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    let subject = template.subject || '';
    let content = template.template;

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      content = content.replace(new RegExp(placeholder, 'g'), value);
    });

    return {
      subject: template.subject ? subject : undefined,
      content,
    };
  }

  /**
   * Get auto follow-up rules
   */
  public getAutoFollowUpRules(): AutoFollowUpRule[] {
    return Array.from(this.followUpRules.values());
  }

  /**
   * Get communication analytics
   */
  public getAnalytics(brokerId: string): CommunicationAnalytics {
    const threads = Array.from(this.communicationThreads.values()).filter(
      (thread) => thread.brokerId === brokerId
    );

    const totalMessages = threads.reduce(
      (sum, thread) => sum + thread.messages.length,
      0
    );
    const responseMessages = threads.reduce(
      (sum, thread) =>
        sum +
        thread.messages.filter((msg) => msg.direction === 'inbound').length,
      0
    );

    const channelStats = {
      email: { sent: 0, delivered: 0, responses: 0, effectiveness: 0 },
      sms: { sent: 0, delivered: 0, responses: 0, effectiveness: 0 },
      whatsapp: { sent: 0, delivered: 0, responses: 0, effectiveness: 0 },
      voice_call: { sent: 0, delivered: 0, responses: 0, effectiveness: 0 },
    };

    threads.forEach((thread) => {
      thread.messages.forEach((message) => {
        if (message.direction === 'outbound') {
          channelStats[message.type].sent++;
          if (message.status === 'delivered' || message.status === 'read') {
            channelStats[message.type].delivered++;
          }
        } else {
          channelStats[message.type].responses++;
        }
      });
    });

    // Calculate effectiveness
    Object.keys(channelStats).forEach((channel) => {
      const stats = channelStats[channel as keyof typeof channelStats];
      stats.effectiveness =
        stats.sent > 0 ? (stats.responses / stats.sent) * 100 : 0;
    });

    return {
      totalThreads: threads.length,
      activeThreads: threads.filter((t) => t.status === 'active').length,
      responseRate:
        totalMessages > 0 ? (responseMessages / totalMessages) * 100 : 0,
      averageResponseTime: 4.2, // Mock data - hours
      successfulNegotiations: threads.filter((t) => t.status === 'closed')
        .length,
      topTemplates: Array.from(this.templates.values())
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5)
        .map((t) => ({
          templateId: t.id,
          name: t.name,
          usage: t.usage,
          effectiveness: t.effectiveness,
        })),
      channelPerformance: channelStats,
      timeToClose: 18.5, // Mock data - average hours
      customerSatisfaction: 8.7, // Mock data - out of 10
    };
  }

  /**
   * Start auto follow-up engine
   */
  private startAutoFollowUpEngine() {
    setInterval(() => {
      this.processAutoFollowUps();
    }, 60000); // Check every minute
  }

  /**
   * Process auto follow-ups
   */
  private processAutoFollowUps() {
    const now = new Date();

    this.communicationThreads.forEach((thread) => {
      if (!thread.autoFollowUpEnabled) return;

      // Check if follow-up is due
      if (thread.nextFollowUp && new Date(thread.nextFollowUp) <= now) {
        this.executeAutoFollowUp(thread);
      }
    });
  }

  /**
   * Execute auto follow-up for a thread
   */
  private executeAutoFollowUp(thread: CommunicationThread) {
    // Find applicable follow-up rules
    const applicableRules = Array.from(this.followUpRules.values()).filter(
      (rule) => rule.enabled && this.ruleApplies(rule, thread)
    );

    if (applicableRules.length === 0) return;

    // Use the first applicable rule
    const rule = applicableRules[0];

    if (rule.action.type === 'sms' || rule.action.type === 'email') {
      let content = rule.action.message || '';

      if (rule.action.templateId) {
        const template = this.templates.get(rule.action.templateId);
        if (template) {
          content = template.template;
        }
      }

      // Send follow-up message
      this.sendMessage(
        thread.id,
        rule.action.type,
        content,
        rule.action.templateId
      );
    }

    // Update next follow-up time
    const nextFollowUp = new Date();
    nextFollowUp.setHours(
      nextFollowUp.getHours() + (rule.condition.timeDelay || 24)
    );
    thread.nextFollowUp = nextFollowUp.toISOString();
  }

  /**
   * Check if a follow-up rule applies to a thread
   */
  private ruleApplies(
    rule: AutoFollowUpRule,
    thread: CommunicationThread
  ): boolean {
    if (
      rule.condition.statuses &&
      !rule.condition.statuses.includes(thread.status)
    ) {
      return false;
    }

    if (
      rule.condition.priorities &&
      !rule.condition.priorities.includes(thread.priority)
    ) {
      return false;
    }

    return true;
  }

  // Helper methods for AI simulation
  private analyzeSentiment(
    content: string
  ): 'positive' | 'neutral' | 'negative' {
    const positiveWords = [
      'great',
      'excellent',
      'perfect',
      'agree',
      'yes',
      'good',
      'thanks',
    ];
    const negativeWords = [
      'no',
      'reject',
      'decline',
      'expensive',
      'high',
      'costly',
    ];

    const words = content.toLowerCase().split(/\s+/);
    const positiveScore = words.filter((word) =>
      positiveWords.includes(word)
    ).length;
    const negativeScore = words.filter((word) =>
      negativeWords.includes(word)
    ).length;

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  private generateMessageSummary(content: string): string {
    if (
      content.toLowerCase().includes('quote') ||
      content.toLowerCase().includes('rate')
    ) {
      return 'Rate quote discussion';
    }
    if (
      content.toLowerCase().includes('follow') ||
      content.toLowerCase().includes('response')
    ) {
      return 'Follow-up communication';
    }
    if (
      content.toLowerCase().includes('confirm') ||
      content.toLowerCase().includes('accept')
    ) {
      return 'Agreement confirmation';
    }
    return 'General communication';
  }

  private generateCallTranscript(
    thread: CommunicationThread,
    script?: string
  ): string {
    return `[Call started - ${new Date().toLocaleTimeString()}]

Broker: Hello, this is ${thread.brokerName} from FleetFlow regarding load ${thread.loadId}.

Shipper: Hi, thanks for calling.

Broker: I wanted to follow up on our rate quote. We're very competitive at our current pricing.

Shipper: We're reviewing several options. What's your best rate?

Broker: Given your volume and our relationship, I can offer a slight adjustment to ensure we win your business.

Shipper: That sounds reasonable. Let me discuss with my team and get back to you.

Broker: Perfect, I'll send a formal confirmation. When can I expect to hear back?

Shipper: By end of day tomorrow.

Broker: Great, I'll follow up then. Thanks for your time!

[Call ended - ${new Date().toLocaleTimeString()}]`;
  }

  private generateCallSummary(transcript: string): string {
    return 'Positive negotiation call. Shipper interested but needs team approval. Follow-up scheduled for tomorrow.';
  }

  private generateFollowUpActions(transcript: string): string[] {
    return [
      'Send formal rate confirmation email',
      'Schedule follow-up call for tomorrow',
      'Prepare slight rate adjustment proposal',
    ];
  }
}

export const brokerCommunicationService =
  BrokerCommunicationService.getInstance();


