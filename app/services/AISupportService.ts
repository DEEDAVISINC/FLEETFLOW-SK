'use client';

// 🎯 AI CUSTOMER SUPPORT SERVICE
// Superior to SalesAI.com with transportation-specific support intelligence
// 24/7 Automated Customer Service + Intelligent Ticket Management + AI Chatbot

import { EventEmitter } from 'events';

// Support Ticket Interfaces
export interface SupportTicket {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subject: string;
  description: string;
  category:
    | 'billing'
    | 'technical'
    | 'shipping'
    | 'account'
    | 'general'
    | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed';
  assignedAgent: string; // AI agent or human agent
  aiResolution?: string;
  humanEscalated: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolutionTime?: number; // minutes
  customerSatisfactionScore?: number; // 1-5
  conversationHistory: ConversationMessage[];
}

export interface ConversationMessage {
  id: string;
  ticketId: string;
  sender: 'customer' | 'ai_agent' | 'human_agent';
  senderName: string;
  message: string;
  timestamp: Date;
  attachments?: string[];
  isInternal?: boolean;
}

export interface AIResolutionSuggestion {
  ticketId: string;
  confidence: number;
  suggestedResponse: string;
  suggestedActions: string[];
  escalationRecommended: boolean;
  estimatedResolutionTime: number;
  similarTickets: string[];
  knowledgeBaseArticles: string[];
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number; // minutes
  aiResolutionRate: number; // percentage
  customerSatisfactionScore: number; // 1-5 average
  responseTime: number; // average first response in minutes
  ticketsByCategory: Record<string, number>;
  ticketsByPriority: Record<string, number>;
  agentPerformance: AgentPerformance[];
}

export interface AgentPerformance {
  agentId: string;
  agentName: string;
  agentType: 'ai' | 'human';
  ticketsHandled: number;
  avgResolutionTime: number;
  customerSatisfactionScore: number;
  resolutionRate: number;
  specializations: string[];
}

export interface ChatbotInteraction {
  id: string;
  customerId: string;
  customerName: string;
  messages: ChatMessage[];
  intent: string;
  confidence: number;
  resolved: boolean;
  escalatedToTicket: boolean;
  ticketId?: string;
  startedAt: Date;
  endedAt?: Date;
  satisfaction?: number;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai';
  message: string;
  timestamp: Date;
  suggestions?: string[];
  actionTaken?: string;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  popularity: number;
  lastUpdated: Date;
  helpful: number;
  notHelpful: number;
}

class AISupportService extends EventEmitter {
  private static instance: AISupportService;
  private supportTickets: Map<string, SupportTicket> = new Map();
  private chatbotInteractions: Map<string, ChatbotInteraction> = new Map();
  private knowledgeBase: Map<string, KnowledgeBaseArticle> = new Map();
  private metrics: SupportMetrics;

  // AI Support Agents
  private aiAgents: Map<string, AgentPerformance> = new Map();

  private constructor() {
    super();
    this.metrics = this.initializeMetrics();
    this.initializeDemoData();
    this.initializeAIAgents();

    // Real-time processing intervals
    setInterval(() => this.processTickets(), 30000); // 30 seconds
    setInterval(() => this.updateMetrics(), 60000); // 1 minute
    setInterval(() => this.processActiveChatbots(), 10000); // 10 seconds

    console.log(
      '🎯 AI Customer Support Service initialized - Superior to SalesAI.com!'
    );
  }

  public static getInstance(): AISupportService {
    if (!AISupportService.instance) {
      AISupportService.instance = new AISupportService();
    }
    return AISupportService.instance;
  }

  private initializeMetrics(): SupportMetrics {
    return {
      totalTickets: 247,
      openTickets: 23,
      resolvedTickets: 224,
      avgResolutionTime: 18, // minutes
      aiResolutionRate: 84.2, // percentage
      customerSatisfactionScore: 4.7, // 1-5 average
      responseTime: 1.2, // minutes
      ticketsByCategory: {
        billing: 67,
        technical: 89,
        shipping: 134,
        account: 45,
        general: 78,
        emergency: 12,
      },
      ticketsByPriority: {
        low: 89,
        medium: 134,
        high: 67,
        urgent: 23,
      },
      agentPerformance: [],
    };
  }

  private initializeAIAgents(): void {
    const aiAgents: AgentPerformance[] = [
      {
        agentId: 'ai-support-001',
        agentName: 'FleetFlow Support AI Alpha',
        agentType: 'ai',
        ticketsHandled: 156,
        avgResolutionTime: 12,
        customerSatisfactionScore: 4.8,
        resolutionRate: 89.1,
        specializations: ['billing', 'account', 'general'],
      },
      {
        agentId: 'ai-support-002',
        agentName: 'FleetFlow Technical AI Beta',
        agentType: 'ai',
        ticketsHandled: 134,
        avgResolutionTime: 24,
        customerSatisfactionScore: 4.6,
        resolutionRate: 81.3,
        specializations: ['technical', 'shipping', 'emergency'],
      },
      {
        agentId: 'ai-support-003',
        agentName: 'FleetFlow Crisis AI Gamma',
        agentType: 'ai',
        ticketsHandled: 89,
        avgResolutionTime: 8,
        customerSatisfactionScore: 4.9,
        resolutionRate: 92.7,
        specializations: ['emergency', 'urgent', 'escalation'],
      },
    ];

    aiAgents.forEach((agent) => this.aiAgents.set(agent.agentId, agent));
    this.metrics.agentPerformance = aiAgents;
  }

  private initializeDemoData(): void {
    // Demo Support Tickets
    const demoTickets: SupportTicket[] = [
      {
        id: 'TKT-2025-001',
        customerId: 'CUST-001',
        customerName: 'ABC Logistics Inc',
        customerEmail: 'operations@abclogistics.com',
        customerPhone: '+1-555-0123',
        subject: 'Load Tracking Issue - Shipment FF-12345',
        description:
          'Unable to see real-time location updates for our shipment. Last update was 2 hours ago.',
        category: 'technical',
        priority: 'high',
        status: 'in_progress',
        assignedAgent: 'FleetFlow Technical AI Beta',
        humanEscalated: false,
        tags: ['tracking', 'real-time', 'shipment'],
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
        conversationHistory: [
          {
            id: 'MSG-001',
            ticketId: 'TKT-2025-001',
            sender: 'customer',
            senderName: 'John Smith - ABC Logistics',
            message:
              'Hi, we cannot see updates for shipment FF-12345. Can you help?',
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            id: 'MSG-002',
            ticketId: 'TKT-2025-001',
            sender: 'ai_agent',
            senderName: 'FleetFlow Technical AI Beta',
            message:
              'I understand your concern about shipment FF-12345. Let me check the tracking system immediately. I can see the shipment is currently in transit near Dallas, TX. There was a temporary GPS connectivity issue which has now been resolved. You should see live updates resuming within the next 5 minutes.',
            timestamp: new Date(Date.now() - 1800000),
          },
        ],
      },
      {
        id: 'TKT-2025-002',
        customerId: 'CUST-002',
        customerName: 'Metro Manufacturing',
        customerEmail: 'billing@metromanufacturing.com',
        subject: 'Invoice Discrepancy - January 2025',
        description:
          'The invoice amount does not match our records. We expected $3,450 but were charged $3,680.',
        category: 'billing',
        priority: 'medium',
        status: 'resolved',
        assignedAgent: 'FleetFlow Support AI Alpha',
        aiResolution:
          'Invoice corrected. Fuel surcharge was incorrectly applied twice. Refund of $230 processed.',
        humanEscalated: false,
        tags: ['billing', 'invoice', 'discrepancy'],
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        updatedAt: new Date(Date.now() - 1800000), // 30 minutes ago
        resolvedAt: new Date(Date.now() - 1800000),
        resolutionTime: 90, // 1.5 hours
        customerSatisfactionScore: 5,
        conversationHistory: [
          {
            id: 'MSG-003',
            ticketId: 'TKT-2025-002',
            sender: 'customer',
            senderName: 'Sarah Johnson - Metro Manufacturing',
            message:
              'There seems to be an error on our January invoice. The total is higher than expected.',
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            id: 'MSG-004',
            ticketId: 'TKT-2025-002',
            sender: 'ai_agent',
            senderName: 'FleetFlow Support AI Alpha',
            message:
              'I have reviewed your January invoice and found the discrepancy. The fuel surcharge was incorrectly applied twice - once at pickup and once at delivery. The correct amount should be $3,450. I have processed a refund of $230 which will appear in your account within 2-3 business days. I apologize for this billing error.',
            timestamp: new Date(Date.now() - 1800000),
          },
        ],
      },
      {
        id: 'TKT-2025-003',
        customerId: 'CUST-003',
        customerName: 'Express Freight Co',
        customerEmail: 'dispatch@expressfreight.com',
        subject: 'Emergency - Driver Breakdown I-95',
        description:
          'Our driver has broken down on I-95 northbound near mile marker 127. Load needs urgent transfer.',
        category: 'emergency',
        priority: 'urgent',
        status: 'resolved',
        assignedAgent: 'FleetFlow Crisis AI Gamma',
        aiResolution:
          'Emergency response activated. Replacement driver dispatched within 45 minutes. Load transferred successfully.',
        humanEscalated: false,
        tags: ['emergency', 'breakdown', 'load-transfer'],
        createdAt: new Date(Date.now() - 5400000), // 1.5 hours ago
        updatedAt: new Date(Date.now() - 3600000), // 1 hour ago
        resolvedAt: new Date(Date.now() - 3600000),
        resolutionTime: 30, // 30 minutes
        customerSatisfactionScore: 5,
        conversationHistory: [],
      },
    ];

    demoTickets.forEach((ticket) => this.supportTickets.set(ticket.id, ticket));

    // Demo Knowledge Base Articles
    const demoArticles: KnowledgeBaseArticle[] = [
      {
        id: 'KB-001',
        title: 'How to Track Your Shipment in Real-Time',
        content:
          'Access live tracking through your FleetFlow portal or mobile app. Updates every 30 seconds with GPS accuracy.',
        category: 'tracking',
        tags: ['tracking', 'real-time', 'GPS', 'mobile'],
        popularity: 234,
        lastUpdated: new Date(Date.now() - 86400000), // 1 day ago
        helpful: 189,
        notHelpful: 12,
      },
      {
        id: 'KB-002',
        title: 'Understanding Your FleetFlow Invoice',
        content:
          'Detailed breakdown of charges including base rate, fuel surcharge, accessorial fees, and applicable taxes.',
        category: 'billing',
        tags: ['billing', 'invoice', 'charges', 'fees'],
        popularity: 156,
        lastUpdated: new Date(Date.now() - 172800000), // 2 days ago
        helpful: 134,
        notHelpful: 8,
      },
      {
        id: 'KB-003',
        title: 'Emergency Contact Procedures',
        content:
          'For urgent issues: Call emergency hotline 1-800-FLEET-911 or use the emergency chat feature in your portal.',
        category: 'emergency',
        tags: ['emergency', 'contact', 'urgent', 'hotline'],
        popularity: 89,
        lastUpdated: new Date(Date.now() - 259200000), // 3 days ago
        helpful: 78,
        notHelpful: 3,
      },
    ];

    demoArticles.forEach((article) =>
      this.knowledgeBase.set(article.id, article)
    );
  }

  // PUBLIC API METHODS

  public async createSupportTicket(
    ticketData: Partial<SupportTicket>
  ): Promise<SupportTicket> {
    const ticketId = `TKT-${Date.now()}`;
    const ticket: SupportTicket = {
      id: ticketId,
      customerId: ticketData.customerId || 'CUST-UNKNOWN',
      customerName: ticketData.customerName || 'Unknown Customer',
      customerEmail: ticketData.customerEmail || '',
      customerPhone: ticketData.customerPhone,
      subject: ticketData.subject || 'Support Request',
      description: ticketData.description || '',
      category: ticketData.category || 'general',
      priority: this.determinePriority(
        ticketData.description || '',
        ticketData.category || 'general'
      ),
      status: 'open',
      assignedAgent: this.assignAIAgent(ticketData.category || 'general'),
      humanEscalated: false,
      tags: this.extractTags(ticketData.description || ''),
      createdAt: new Date(),
      updatedAt: new Date(),
      conversationHistory: [],
    };

    this.supportTickets.set(ticketId, ticket);

    // Immediately process with AI
    setTimeout(() => this.processTicketWithAI(ticketId), 1000);

    this.emit('ticketCreated', ticket);
    console.log(`🎯 New support ticket created: ${ticketId}`);

    return ticket;
  }

  public async processChatbotInteraction(
    customerId: string,
    customerName: string,
    message: string
  ): Promise<ChatbotInteraction> {
    const interactionId = `CHAT-${Date.now()}`;
    const intent = this.detectIntent(message);
    const confidence = this.calculateConfidence(message, intent);

    const interaction: ChatbotInteraction = {
      id: interactionId,
      customerId,
      customerName,
      messages: [
        {
          id: `MSG-${Date.now()}`,
          sender: 'customer',
          message,
          timestamp: new Date(),
        },
      ],
      intent,
      confidence,
      resolved: false,
      escalatedToTicket: false,
      startedAt: new Date(),
    };

    // Generate AI response
    const aiResponse = await this.generateChatbotResponse(message, intent);
    interaction.messages.push({
      id: `MSG-${Date.now() + 1}`,
      sender: 'ai',
      message: aiResponse.message,
      timestamp: new Date(),
      suggestions: aiResponse.suggestions,
      actionTaken: aiResponse.actionTaken,
    });

    // Check if issue is resolved or needs escalation
    if (confidence < 0.7 || intent === 'complex_issue') {
      interaction.escalatedToTicket = true;
      interaction.resolved = false;

      // Create support ticket
      const ticket = await this.createSupportTicket({
        customerId,
        customerName,
        subject: `Escalated from chat: ${intent}`,
        description: message,
        category: this.mapIntentToCategory(intent),
      });
      interaction.ticketId = ticket.id;
    } else {
      interaction.resolved = true;
      interaction.endedAt = new Date();
    }

    this.chatbotInteractions.set(interactionId, interaction);
    this.emit('chatbotInteraction', interaction);

    return interaction;
  }

  public getSupportMetrics(): SupportMetrics {
    return { ...this.metrics };
  }

  public getAllSupportTickets(): SupportTicket[] {
    return Array.from(this.supportTickets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  public getTicketsByStatus(status: SupportTicket['status']): SupportTicket[] {
    return Array.from(this.supportTickets.values())
      .filter((ticket) => ticket.status === status)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getRecentChatbotInteractions(): ChatbotInteraction[] {
    return Array.from(this.chatbotInteractions.values())
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, 20);
  }

  public async updateTicketStatus(
    ticketId: string,
    status: SupportTicket['status']
  ): Promise<void> {
    const ticket = this.supportTickets.get(ticketId);
    if (ticket) {
      ticket.status = status;
      ticket.updatedAt = new Date();

      if (status === 'resolved' || status === 'closed') {
        ticket.resolvedAt = new Date();
        ticket.resolutionTime = Math.floor(
          (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / 60000
        );
      }

      this.supportTickets.set(ticketId, ticket);
      this.emit('ticketStatusUpdated', ticket);
    }
  }

  // PRIVATE METHODS

  private async processTicketWithAI(ticketId: string): Promise<void> {
    const ticket = this.supportTickets.get(ticketId);
    if (!ticket) return;

    const suggestion = await this.generateAIResolution(ticket);

    if (suggestion.confidence > 0.8 && !suggestion.escalationRecommended) {
      // AI can handle this ticket
      const aiResponse: ConversationMessage = {
        id: `MSG-${Date.now()}`,
        ticketId,
        sender: 'ai_agent',
        senderName: ticket.assignedAgent,
        message: suggestion.suggestedResponse,
        timestamp: new Date(),
      };

      ticket.conversationHistory.push(aiResponse);
      ticket.status = 'in_progress';
      ticket.updatedAt = new Date();

      // If simple issue, resolve immediately
      if (suggestion.confidence > 0.9) {
        ticket.status = 'resolved';
        ticket.aiResolution = suggestion.suggestedResponse;
        ticket.resolvedAt = new Date();
        ticket.resolutionTime = Math.floor(
          (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / 60000
        );
      }

      this.supportTickets.set(ticketId, ticket);
      this.emit('ticketProcessed', ticket);
    } else {
      // Escalate to human
      ticket.humanEscalated = true;
      ticket.assignedAgent = 'Human Support Team';
      this.supportTickets.set(ticketId, ticket);
      this.emit('ticketEscalated', ticket);
    }
  }

  private async generateAIResolution(
    ticket: SupportTicket
  ): Promise<AIResolutionSuggestion> {
    // Simulate AI analysis
    const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0
    const escalationRecommended =
      confidence < 0.75 || ticket.priority === 'urgent';

    const responses: Record<string, string> = {
      billing: `I've reviewed your billing inquiry regarding "${ticket.subject}". I can help resolve this immediately by checking your account details and processing any necessary adjustments.`,
      technical: `I understand you're experiencing a technical issue with "${ticket.subject}". Let me diagnose this problem and provide you with a solution right away.`,
      shipping: `I see you have a shipping-related concern: "${ticket.subject}". I'll check the current status and provide you with detailed information and next steps.`,
      account: `Thank you for contacting us about your account. I'll review "${ticket.subject}" and help you with any account-related changes or questions.`,
      general: `I appreciate you reaching out about "${ticket.subject}". I'm here to help and will provide you with the information and assistance you need.`,
      emergency: `I understand this is an urgent situation: "${ticket.subject}". I'm prioritizing your request and will coordinate immediate assistance.`,
    };

    return {
      ticketId: ticket.id,
      confidence,
      suggestedResponse: responses[ticket.category] || responses.general,
      suggestedActions: ['review_account', 'check_status', 'provide_solution'],
      escalationRecommended,
      estimatedResolutionTime: escalationRecommended ? 60 : 15,
      similarTickets: [],
      knowledgeBaseArticles: Array.from(this.knowledgeBase.keys()).slice(0, 3),
    };
  }

  private async generateChatbotResponse(
    message: string,
    intent: string
  ): Promise<{
    message: string;
    suggestions?: string[];
    actionTaken?: string;
  }> {
    const responses: Record<
      string,
      { message: string; suggestions: string[] }
    > = {
      track_shipment: {
        message:
          "I can help you track your shipment! To provide real-time updates, I'll need your shipment number or load ID. You can find this in your booking confirmation email.",
        suggestions: [
          'Check shipment FF-12345',
          'View all my shipments',
          'Get delivery estimate',
        ],
      },
      billing_inquiry: {
        message:
          "I'm here to help with your billing questions! I can explain charges, process refunds, or update payment methods. What specific billing issue can I assist you with?",
        suggestions: [
          'Explain my latest invoice',
          'Request a refund',
          'Update payment method',
        ],
      },
      technical_support: {
        message:
          "I understand you're experiencing a technical issue. I can help troubleshoot problems with our platform, mobile app, or tracking systems. Can you describe what's not working?",
        suggestions: [
          'Login issues',
          'App not loading',
          'Tracking not updating',
        ],
      },
      emergency: {
        message:
          'I understand this is urgent! For immediate emergency assistance, please call our 24/7 hotline at 1-800-FLEET-911. I can also alert our emergency response team right now.',
        suggestions: [
          'Call emergency hotline',
          'Alert response team',
          'Get roadside assistance',
        ],
      },
      general: {
        message:
          "Hello! I'm FleetFlow's AI support assistant. I'm here 24/7 to help with tracking, billing, technical issues, and more. How can I assist you today?",
        suggestions: [
          'Track a shipment',
          'Billing question',
          'Technical support',
          'Account help',
        ],
      },
    };

    const response = responses[intent] || responses.general;

    return {
      message: response.message,
      suggestions: response.suggestions,
      actionTaken: intent !== 'general' ? `processed_${intent}` : undefined,
    };
  }

  private determinePriority(
    description: string,
    category: string
  ): SupportTicket['priority'] {
    const urgentKeywords = [
      'urgent',
      'emergency',
      'critical',
      'broken',
      'down',
      'stopped',
    ];
    const highKeywords = [
      'asap',
      'important',
      'needed',
      'problem',
      'issue',
      'error',
    ];

    const text = description.toLowerCase();

    if (
      category === 'emergency' ||
      urgentKeywords.some((keyword) => text.includes(keyword))
    ) {
      return 'urgent';
    }
    if (highKeywords.some((keyword) => text.includes(keyword))) {
      return 'high';
    }
    if (category === 'billing' || category === 'account') {
      return 'medium';
    }
    return 'low';
  }

  private assignAIAgent(category: string): string {
    const assignments: Record<string, string> = {
      billing: 'FleetFlow Support AI Alpha',
      account: 'FleetFlow Support AI Alpha',
      general: 'FleetFlow Support AI Alpha',
      technical: 'FleetFlow Technical AI Beta',
      shipping: 'FleetFlow Technical AI Beta',
      emergency: 'FleetFlow Crisis AI Gamma',
    };

    return assignments[category] || 'FleetFlow Support AI Alpha';
  }

  private extractTags(description: string): string[] {
    const commonTags = [
      'tracking',
      'billing',
      'technical',
      'shipping',
      'account',
      'invoice',
      'payment',
      'refund',
      'emergency',
      'breakdown',
      'delay',
      'update',
    ];

    return commonTags
      .filter((tag) => description.toLowerCase().includes(tag))
      .slice(0, 5);
  }

  private detectIntent(message: string): string {
    const text = message.toLowerCase();

    if (
      text.includes('track') ||
      text.includes('where') ||
      text.includes('status')
    ) {
      return 'track_shipment';
    }
    if (
      text.includes('bill') ||
      text.includes('invoice') ||
      text.includes('charge') ||
      text.includes('refund')
    ) {
      return 'billing_inquiry';
    }
    if (
      text.includes('broken') ||
      text.includes('error') ||
      text.includes('not working') ||
      text.includes('technical')
    ) {
      return 'technical_support';
    }
    if (
      text.includes('urgent') ||
      text.includes('emergency') ||
      text.includes('critical')
    ) {
      return 'emergency';
    }
    if (text.length > 100 || text.split(' ').length > 20) {
      return 'complex_issue';
    }

    return 'general';
  }

  private calculateConfidence(message: string, intent: string): number {
    // Simple confidence calculation
    const keywords: Record<string, string[]> = {
      track_shipment: ['track', 'shipment', 'where', 'status', 'delivery'],
      billing_inquiry: ['bill', 'invoice', 'charge', 'payment', 'refund'],
      technical_support: ['broken', 'error', 'not working', 'technical', 'app'],
      emergency: ['urgent', 'emergency', 'critical', 'asap'],
    };

    const intentKeywords = keywords[intent] || [];
    const matches = intentKeywords.filter((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    return Math.min(0.95, 0.5 + matches.length * 0.15);
  }

  private mapIntentToCategory(intent: string): SupportTicket['category'] {
    const mapping: Record<string, SupportTicket['category']> = {
      track_shipment: 'shipping',
      billing_inquiry: 'billing',
      technical_support: 'technical',
      emergency: 'emergency',
      complex_issue: 'general',
    };

    return mapping[intent] || 'general';
  }

  private processTickets(): void {
    // Process open tickets
    const openTickets = this.getTicketsByStatus('open');
    openTickets.forEach((ticket) => {
      if (Date.now() - ticket.createdAt.getTime() > 60000) {
        // 1 minute old
        this.processTicketWithAI(ticket.id);
      }
    });
  }

  private processActiveChatbots(): void {
    // Update active chatbot interactions
    this.emit('chatbotActivity', {
      activeChats: Array.from(this.chatbotInteractions.values()).filter(
        (chat) => !chat.endedAt
      ).length,
      resolvedToday: Array.from(this.chatbotInteractions.values()).filter(
        (chat) =>
          chat.resolved && chat.startedAt > new Date(Date.now() - 86400000)
      ).length,
    });
  }

  private updateMetrics(): void {
    const allTickets = Array.from(this.supportTickets.values());
    const resolvedTickets = allTickets.filter(
      (t) => t.status === 'resolved' || t.status === 'closed'
    );
    const aiResolvedTickets = resolvedTickets.filter((t) => !t.humanEscalated);

    this.metrics = {
      ...this.metrics,
      totalTickets: allTickets.length,
      openTickets: allTickets.filter((t) => t.status === 'open').length,
      resolvedTickets: resolvedTickets.length,
      avgResolutionTime:
        resolvedTickets.length > 0
          ? resolvedTickets.reduce(
              (sum, t) => sum + (t.resolutionTime || 0),
              0
            ) / resolvedTickets.length
          : 0,
      aiResolutionRate:
        resolvedTickets.length > 0
          ? (aiResolvedTickets.length / resolvedTickets.length) * 100
          : 0,
    };

    this.emit('metricsUpdated', this.metrics);
  }
}

export const aiSupportService = AISupportService.getInstance();
