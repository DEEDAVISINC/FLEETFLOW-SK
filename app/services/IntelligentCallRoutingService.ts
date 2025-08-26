/**
 * Intelligent Call Routing Service
 * AI-powered call routing and queue management system
 */

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'away' | 'offline';
  skills: string[];
  languages: string[];
  experience: 'junior' | 'senior' | 'expert';
  specialties: ('sales' | 'support' | 'collections' | 'retention')[];
  performance: {
    averageCallTime: number;
    resolutionRate: number;
    customerSatisfaction: number;
    conversionRate: number;
    callsHandledToday: number;
    totalCallsHandled: number;
  };
  schedule: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
    breaks: {
      start: string;
      end: string;
      duration: number;
    }[];
  };
  currentCall?: {
    callId: string;
    startTime: string;
    customerInfo: any;
  };
  lastActivity: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  conditions: {
    callerType?: 'new' | 'existing' | 'vip';
    customerTier?: 'bronze' | 'silver' | 'gold' | 'platinum';
    callType?: 'sales' | 'support' | 'complaint' | 'booking' | 'emergency';
    timeOfDay?: {
      start: string;
      end: string;
    };
    dayOfWeek?: string[];
    customerValue?: {
      min: number;
      max: number;
    };
    previousAgent?: string;
    language?: string;
  };
  actions: {
    routeTo: 'agent' | 'queue' | 'voicemail' | 'callback';
    targetAgentId?: string;
    targetQueueId?: string;
    priority: 1 | 2 | 3 | 4 | 5;
    maxWaitTime: number;
    fallbackAction: 'voicemail' | 'callback' | 'transfer';
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CallQueue {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'support' | 'general' | 'vip' | 'emergency';
  maxSize: number;
  estimatedWaitTime: number;
  holdMusic?: string;
  announcements: {
    welcome: string;
    position: string;
    estimatedWait: string;
    callback: string;
  };
  agents: string[];
  calls: QueuedCall[];
  metrics: {
    totalCalls: number;
    averageWaitTime: number;
    abandonmentRate: number;
    serviceLevel: number; // % answered within target time
  };
  isActive: boolean;
}

export interface QueuedCall {
  id: string;
  callerId: string;
  callerInfo: {
    name?: string;
    company?: string;
    phone: string;
    customerTier?: string;
    previousInteractions: number;
  };
  queueId: string;
  priority: 1 | 2 | 3 | 4 | 5;
  queuedAt: string;
  estimatedWaitTime: number;
  callbackRequested: boolean;
  metadata: {
    callType: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    source: 'phone' | 'web' | 'mobile' | 'api';
    previousAgent?: string;
    customerNotes?: string;
  };
}

export interface RoutingDecision {
  action: 'route_to_agent' | 'queue' | 'voicemail' | 'callback' | 'transfer';
  targetAgentId?: string;
  targetQueueId?: string;
  priority: number;
  estimatedWaitTime: number;
  reason: string;
  confidence: number;
  alternativeOptions: {
    action: string;
    target?: string;
    reason: string;
    confidence: number;
  }[];
}

export interface CallMetrics {
  totalCalls: number;
  answeredCalls: number;
  missedCalls: number;
  averageWaitTime: number;
  averageCallDuration: number;
  customerSatisfaction: number;
  firstCallResolution: number;
  agentUtilization: number;
  peakHours: {
    hour: number;
    callVolume: number;
  }[];
  callDistribution: {
    sales: number;
    support: number;
    complaints: number;
    bookings: number;
    emergency: number;
  };
}

class IntelligentCallRoutingService {
  private readonly AGENTS_KEY = 'fleetflow-agents';
  private readonly ROUTING_RULES_KEY = 'fleetflow-routing-rules';
  private readonly CALL_QUEUES_KEY = 'fleetflow-call-queues';
  private readonly CALL_METRICS_KEY = 'fleetflow-call-metrics';

  // Get all agents
  getAgents(): Agent[] {
    try {
      if (typeof window === 'undefined') return this.getDefaultAgents();
      const stored = localStorage.getItem(this.AGENTS_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultAgents();
    } catch (error) {
      console.error('Error retrieving agents:', error);
      return this.getDefaultAgents();
    }
  }

  // Get available agents
  getAvailableAgents(skillsRequired?: string[]): Agent[] {
    const agents = this.getAgents().filter(
      (agent) => agent.status === 'available'
    );

    if (skillsRequired && skillsRequired.length > 0) {
      return agents.filter((agent) =>
        skillsRequired.some((skill) => agent.skills.includes(skill))
      );
    }

    return agents;
  }

  // Update agent status
  updateAgentStatus(agentId: string, status: Agent['status']): boolean {
    try {
      const agents = this.getAgents();
      const agentIndex = agents.findIndex((a) => a.id === agentId);

      if (agentIndex >= 0) {
        agents[agentIndex].status = status;
        agents[agentIndex].lastActivity = new Date().toISOString();
        localStorage.setItem(this.AGENTS_KEY, JSON.stringify(agents));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error updating agent status:', error);
      return false;
    }
  }

  // Intelligent call routing decision
  routeCall(callInfo: {
    callerId: string;
    callerInfo: any;
    callType: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    preferredAgent?: string;
  }): RoutingDecision {
    try {
      const rules = this.getRoutingRules();
      const agents = this.getAvailableAgents();
      const queues = this.getCallQueues();

      // Apply routing rules in priority order
      const applicableRules = rules
        .filter((rule) => rule.isActive)
        .filter((rule) => this.evaluateRuleConditions(rule, callInfo))
        .sort((a, b) => a.priority - b.priority);

      if (applicableRules.length > 0) {
        const rule = applicableRules[0];
        return this.executeRoutingRule(rule, callInfo, agents, queues);
      }

      // Fallback to intelligent routing
      return this.performIntelligentRouting(callInfo, agents, queues);
    } catch (error) {
      console.error('Error routing call:', error);
      return this.getDefaultRouting();
    }
  }

  // Evaluate rule conditions
  private evaluateRuleConditions(rule: RoutingRule, callInfo: any): boolean {
    const conditions = rule.conditions;

    if (conditions.callType && conditions.callType !== callInfo.callType) {
      return false;
    }

    if (
      conditions.callerType &&
      conditions.callerType !== callInfo.callerInfo.type
    ) {
      return false;
    }

    if (
      conditions.customerTier &&
      conditions.customerTier !== callInfo.callerInfo.tier
    ) {
      return false;
    }

    if (conditions.timeOfDay) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(conditions.timeOfDay.start.split(':')[0]);
      const endHour = parseInt(conditions.timeOfDay.end.split(':')[0]);

      if (currentHour < startHour || currentHour > endHour) {
        return false;
      }
    }

    if (conditions.dayOfWeek) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      if (!conditions.dayOfWeek.includes(today)) {
        return false;
      }
    }

    return true;
  }

  // Execute routing rule
  private executeRoutingRule(
    rule: RoutingRule,
    callInfo: any,
    agents: Agent[],
    queues: CallQueue[]
  ): RoutingDecision {
    const action = rule.actions;

    if (action.routeTo === 'agent' && action.targetAgentId) {
      const agent = agents.find((a) => a.id === action.targetAgentId);
      if (agent && agent.status === 'available') {
        return {
          action: 'route_to_agent',
          targetAgentId: action.targetAgentId,
          priority: action.priority,
          estimatedWaitTime: 0,
          reason: `Routed by rule: ${rule.name}`,
          confidence: 0.95,
          alternativeOptions: [],
        };
      }
    }

    if (action.routeTo === 'queue' && action.targetQueueId) {
      const queue = queues.find((q) => q.id === action.targetQueueId);
      if (queue && queue.isActive) {
        return {
          action: 'queue',
          targetQueueId: action.targetQueueId,
          priority: action.priority,
          estimatedWaitTime: queue.estimatedWaitTime,
          reason: `Queued by rule: ${rule.name}`,
          confidence: 0.9,
          alternativeOptions: [],
        };
      }
    }

    return this.performIntelligentRouting(callInfo, agents, queues);
  }

  // Intelligent routing algorithm
  private performIntelligentRouting(
    callInfo: any,
    agents: Agent[],
    queues: CallQueue[]
  ): RoutingDecision {
    // Score agents based on multiple factors
    const scoredAgents = agents
      .map((agent) => {
        let score = 0;

        // Base availability score
        score += agent.status === 'available' ? 100 : 0;

        // Experience bonus
        if (agent.experience === 'expert') score += 30;
        else if (agent.experience === 'senior') score += 20;
        else score += 10;

        // Skill match bonus
        const requiredSkills = this.getRequiredSkills(callInfo.callType);
        const skillMatch = requiredSkills.filter((skill) =>
          agent.skills.includes(skill)
        ).length;
        score += skillMatch * 15;

        // Performance bonus
        score += agent.performance.customerSatisfaction * 5;
        score += agent.performance.resolutionRate * 3;

        // Workload penalty
        score -= agent.performance.callsHandledToday * 2;

        // Previous agent bonus
        if (callInfo.preferredAgent === agent.id) {
          score += 50;
        }

        // Urgency handling
        if (
          callInfo.urgency === 'critical' &&
          agent.specialties.includes('support')
        ) {
          score += 40;
        }

        return { agent, score };
      })
      .sort((a, b) => b.score - a.score);

    // Route to best available agent
    if (scoredAgents.length > 0 && scoredAgents[0].score > 50) {
      const bestAgent = scoredAgents[0].agent;
      return {
        action: 'route_to_agent',
        targetAgentId: bestAgent.id,
        priority: this.getCallPriority(callInfo),
        estimatedWaitTime: 0,
        reason: `Routed to best available agent (${bestAgent.name}) - Score: ${scoredAgents[0].score}`,
        confidence: Math.min(0.95, scoredAgents[0].score / 100),
        alternativeOptions: scoredAgents.slice(1, 3).map((sa) => ({
          action: 'route_to_agent',
          target: sa.agent.id,
          reason: `Alternative agent (${sa.agent.name}) - Score: ${sa.score}`,
          confidence: Math.min(0.9, sa.score / 100),
        })),
      };
    }

    // Route to appropriate queue
    const bestQueue = this.selectBestQueue(callInfo, queues);
    if (bestQueue) {
      return {
        action: 'queue',
        targetQueueId: bestQueue.id,
        priority: this.getCallPriority(callInfo),
        estimatedWaitTime: bestQueue.estimatedWaitTime,
        reason: `Routed to ${bestQueue.name} queue - no agents available`,
        confidence: 0.75,
        alternativeOptions: [
          {
            action: 'callback',
            reason: 'Offer callback instead of waiting',
            confidence: 0.8,
          },
        ],
      };
    }

    return this.getDefaultRouting();
  }

  // Get required skills for call type
  private getRequiredSkills(callType: string): string[] {
    const skillMap: Record<string, string[]> = {
      sales: ['sales', 'negotiation', 'product_knowledge'],
      support: ['technical_support', 'problem_solving', 'patience'],
      complaint: ['conflict_resolution', 'empathy', 'escalation_handling'],
      booking: ['logistics', 'scheduling', 'attention_to_detail'],
      emergency: ['crisis_management', 'quick_thinking', 'authority'],
    };

    return skillMap[callType] || ['customer_service'];
  }

  // Get call priority
  private getCallPriority(callInfo: any): number {
    if (callInfo.urgency === 'critical') return 1;
    if (callInfo.urgency === 'high') return 2;
    if (callInfo.callerInfo.tier === 'platinum') return 2;
    if (callInfo.callerInfo.tier === 'gold') return 3;
    if (callInfo.urgency === 'medium') return 3;
    return 4;
  }

  // Select best queue
  private selectBestQueue(
    callInfo: any,
    queues: CallQueue[]
  ): CallQueue | null {
    const activeQueues = queues.filter((q) => q.isActive);

    // Match by call type
    let matchingQueue = activeQueues.find((q) => q.type === callInfo.callType);

    // VIP customers go to VIP queue
    if (callInfo.callerInfo.tier === 'platinum') {
      const vipQueue = activeQueues.find((q) => q.type === 'vip');
      if (vipQueue) matchingQueue = vipQueue;
    }

    // Emergency calls go to emergency queue
    if (callInfo.urgency === 'critical') {
      const emergencyQueue = activeQueues.find((q) => q.type === 'emergency');
      if (emergencyQueue) matchingQueue = emergencyQueue;
    }

    // Fallback to general queue
    if (!matchingQueue) {
      matchingQueue = activeQueues.find((q) => q.type === 'general');
    }

    return matchingQueue || null;
  }

  // Default routing fallback
  private getDefaultRouting(): RoutingDecision {
    return {
      action: 'voicemail',
      priority: 5,
      estimatedWaitTime: 0,
      reason: 'No agents or queues available - routing to voicemail',
      confidence: 0.5,
      alternativeOptions: [
        {
          action: 'callback',
          reason: 'Offer callback when agent becomes available',
          confidence: 0.6,
        },
      ],
    };
  }

  // Get routing rules
  getRoutingRules(): RoutingRule[] {
    try {
      const stored = localStorage.getItem(this.ROUTING_RULES_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultRoutingRules();
    } catch (error) {
      console.error('Error retrieving routing rules:', error);
      return this.getDefaultRoutingRules();
    }
  }

  // Get call queues
  getCallQueues(): CallQueue[] {
    try {
      const stored = localStorage.getItem(this.CALL_QUEUES_KEY);
      return stored ? JSON.parse(stored) : this.getDefaultCallQueues();
    } catch (error) {
      console.error('Error retrieving call queues:', error);
      return this.getDefaultCallQueues();
    }
  }

  // Get call metrics
  getCallMetrics(): CallMetrics {
    try {
      const stored = localStorage.getItem(this.CALL_METRICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }

      // Generate sample metrics
      return {
        totalCalls: 247,
        answeredCalls: 231,
        missedCalls: 16,
        averageWaitTime: 45, // seconds
        averageCallDuration: 312, // seconds
        customerSatisfaction: 8.7,
        firstCallResolution: 0.84,
        agentUtilization: 0.73,
        peakHours: [
          { hour: 9, callVolume: 23 },
          { hour: 10, callVolume: 31 },
          { hour: 11, callVolume: 28 },
          { hour: 14, callVolume: 26 },
          { hour: 15, callVolume: 24 },
        ],
        callDistribution: {
          sales: 89,
          support: 76,
          complaints: 23,
          bookings: 45,
          emergency: 14,
        },
      };
    } catch (error) {
      console.error('Error retrieving call metrics:', error);
      return {} as CallMetrics;
    }
  }

  // Default agents
  private getDefaultAgents(): Agent[] {
    return [
      {
        id: 'agent-001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@fleetflow.com',
        phone: '+15551234567',
        status: 'available',
        skills: [
          'sales',
          'customer_service',
          'negotiation',
          'freight_logistics',
        ],
        languages: ['English', 'Spanish'],
        experience: 'expert',
        specialties: ['sales', 'retention'],
        performance: {
          averageCallTime: 285,
          resolutionRate: 0.92,
          customerSatisfaction: 9.2,
          conversionRate: 0.31,
          callsHandledToday: 12,
          totalCallsHandled: 2847,
        },
        schedule: {
          timezone: 'America/Chicago',
          workingHours: { start: '08:00', end: '17:00' },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          breaks: [
            { start: '12:00', end: '13:00', duration: 60 },
            { start: '15:00', end: '15:15', duration: 15 },
          ],
        },
        lastActivity: new Date().toISOString(),
      },
      {
        id: 'agent-002',
        name: 'Mike Davis',
        email: 'mike.davis@fleetflow.com',
        phone: '+15559876543',
        status: 'available',
        skills: [
          'support',
          'technical_support',
          'problem_solving',
          'freight_operations',
        ],
        languages: ['English'],
        experience: 'senior',
        specialties: ['support', 'collections'],
        performance: {
          averageCallTime: 398,
          resolutionRate: 0.89,
          customerSatisfaction: 8.9,
          conversionRate: 0.18,
          callsHandledToday: 8,
          totalCallsHandled: 1923,
        },
        schedule: {
          timezone: 'America/Chicago',
          workingHours: { start: '07:00', end: '16:00' },
          workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          breaks: [
            { start: '11:30', end: '12:30', duration: 60 },
            { start: '14:30', end: '14:45', duration: 15 },
          ],
        },
        lastActivity: new Date().toISOString(),
      },
    ];
  }

  // Default routing rules
  private getDefaultRoutingRules(): RoutingRule[] {
    return [
      {
        id: 'rule-001',
        name: 'VIP Customer Priority',
        priority: 1,
        conditions: {
          customerTier: 'platinum',
        },
        actions: {
          routeTo: 'queue',
          targetQueueId: 'queue-vip',
          priority: 1,
          maxWaitTime: 30,
          fallbackAction: 'callback',
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'rule-002',
        name: 'Emergency Calls',
        priority: 1,
        conditions: {
          callType: 'emergency',
        },
        actions: {
          routeTo: 'queue',
          targetQueueId: 'queue-emergency',
          priority: 1,
          maxWaitTime: 15,
          fallbackAction: 'transfer',
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Default call queues
  private getDefaultCallQueues(): CallQueue[] {
    return [
      {
        id: 'queue-sales',
        name: 'Sales Queue',
        description: 'New customer inquiries and sales calls',
        type: 'sales',
        maxSize: 20,
        estimatedWaitTime: 120,
        announcements: {
          welcome:
            'Thank you for calling FleetFlow. You are in our sales queue.',
          position: 'You are number {position} in line.',
          estimatedWait: 'Your estimated wait time is {time} minutes.',
          callback: 'Press 1 to request a callback instead of waiting.',
        },
        agents: ['agent-001'],
        calls: [],
        metrics: {
          totalCalls: 89,
          averageWaitTime: 95,
          abandonmentRate: 0.12,
          serviceLevel: 0.87,
        },
        isActive: true,
      },
      {
        id: 'queue-support',
        name: 'Customer Support',
        description: 'Technical support and customer service',
        type: 'support',
        maxSize: 15,
        estimatedWaitTime: 180,
        announcements: {
          welcome:
            'Thank you for calling FleetFlow support. We value your business.',
          position: 'You are number {position} in line.',
          estimatedWait: 'Your estimated wait time is {time} minutes.',
          callback: 'Press 1 to request a callback instead of waiting.',
        },
        agents: ['agent-002'],
        calls: [],
        metrics: {
          totalCalls: 76,
          averageWaitTime: 142,
          abandonmentRate: 0.08,
          serviceLevel: 0.91,
        },
        isActive: true,
      },
      {
        id: 'queue-vip',
        name: 'VIP Queue',
        description: 'Platinum and gold tier customers',
        type: 'vip',
        maxSize: 10,
        estimatedWaitTime: 30,
        announcements: {
          welcome:
            'Thank you for calling FleetFlow. As a VIP customer, you will be connected shortly.',
          position: 'You are number {position} in our priority queue.',
          estimatedWait: 'Your estimated wait time is {time} minutes.',
          callback: 'Press 1 to request a priority callback.',
        },
        agents: ['agent-001', 'agent-002'],
        calls: [],
        metrics: {
          totalCalls: 34,
          averageWaitTime: 25,
          abandonmentRate: 0.03,
          serviceLevel: 0.97,
        },
        isActive: true,
      },
    ];
  }
}

export const intelligentCallRoutingService =
  new IntelligentCallRoutingService();
