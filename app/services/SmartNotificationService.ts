// Smart Notification Service - Enhanced notification management with AI-powered features
// Integrates with existing notification hub to provide intelligent routing, custom rules, and analytics

export interface SmartNotificationRule {
  id: string;
  name: string;
  description: string;
  conditions: {
    type?: string[];
    priority?: string[];
    source?: string[];
    keywords?: string[];
    timeRange?: { start: string; end: string };
    recipient?: string[];
  };
  actions: {
    route?: string[]; // ['sms', 'email', 'push', 'dashboard']
    escalate?: boolean;
    delay?: number; // minutes
    suppress?: boolean;
    forward?: string[]; // user IDs
  };
  enabled: boolean;
  createdAt: string;
  lastModified: string;
}

export interface NotificationSnooze {
  notificationId: string;
  userId: string;
  snoozeUntil: string;
  reason?: string;
  createdAt: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'sms' | 'email' | 'push' | 'dashboard' | 'webhook' | 'slack';
  config: {
    endpoint?: string;
    apiKey?: string;
    enabled: boolean;
    rateLimiting?: {
      maxPerMinute: number;
      maxPerHour: number;
    };
    priority?: string[]; // which priorities use this channel
  };
  lastUsed?: string;
  successRate: number;
}

export interface NotificationSummary {
  period: 'day' | 'week' | 'month';
  startDate: string;
  endDate: string;
  metrics: {
    totalSent: number;
    totalRead: number;
    totalSnoozed: number;
    avgResponseTime: number; // minutes
    byChannel: Record<string, number>;
    byType: Record<string, number>;
    byPriority: Record<string, number>;
    escalations: number;
    failures: number;
  };
  trends: {
    volumeChange: number; // percentage
    readRateChange: number;
    responseTimeChange: number;
  };
  recommendations: string[];
}

export interface SmartAlert {
  id: string;
  type: 'pattern' | 'anomaly' | 'performance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  data: any;
  createdAt: string;
  resolvedAt?: string;
  actions: {
    label: string;
    action: string;
    params?: any;
  }[];
}

export class SmartNotificationService {
  private static instance: SmartNotificationService;
  private rules: Map<string, SmartNotificationRule> = new Map();
  private snoozedNotifications: Map<string, NotificationSnooze> = new Map();
  private channels: Map<string, NotificationChannel> = new Map();
  private summaryCache: Map<string, NotificationSummary> = new Map();
  private smartAlerts: SmartAlert[] = [];

  static getInstance(): SmartNotificationService {
    if (!SmartNotificationService.instance) {
      SmartNotificationService.instance = new SmartNotificationService();
    }
    return SmartNotificationService.instance;
  }

  constructor() {
    this.initializeDefaultChannels();
    this.initializeDefaultRules();
    this.startPeriodicAnalysis();
  }

  // ==================== SMART ROUTING & RULES ====================

  async processNotification(notification: any): Promise<{
    channels: string[];
    delayed: boolean;
    suppressed: boolean;
    escalated: boolean;
  }> {
    // Check if notification is snoozed
    const snooze = this.snoozedNotifications.get(notification.id);
    if (snooze && new Date(snooze.snoozeUntil) > new Date()) {
      return {
        channels: [],
        delayed: false,
        suppressed: true,
        escalated: false,
      };
    }

    // Apply smart rules
    const applicableRules = Array.from(this.rules.values()).filter(
      (rule) =>
        rule.enabled && this.matchesConditions(notification, rule.conditions)
    );

    let channels: string[] = ['dashboard']; // default
    let delayed = false;
    let suppressed = false;
    let escalated = false;

    for (const rule of applicableRules) {
      if (rule.actions.suppress) {
        suppressed = true;
        break;
      }

      if (rule.actions.route) {
        channels = [...new Set([...channels, ...rule.actions.route])];
      }

      if (rule.actions.delay && rule.actions.delay > 0) {
        delayed = true;
        // Schedule delayed processing
        setTimeout(
          () => {
            this.processDelayedNotification(notification, rule);
          },
          rule.actions.delay * 60 * 1000
        );
      }

      if (rule.actions.escalate) {
        escalated = true;
        await this.escalateNotification(notification, rule);
      }

      if (rule.actions.forward) {
        await this.forwardNotification(notification, rule.actions.forward);
      }
    }

    // AI-powered smart routing based on context
    const smartChannels = await this.getAIRecommendedChannels(notification);
    channels = [...new Set([...channels, ...smartChannels])];

    return { channels, delayed, suppressed, escalated };
  }

  private matchesConditions(
    notification: any,
    conditions: SmartNotificationRule['conditions']
  ): boolean {
    if (conditions.type && !conditions.type.includes(notification.type))
      return false;
    if (
      conditions.priority &&
      !conditions.priority.includes(notification.priority)
    )
      return false;
    if (conditions.source && !conditions.source.includes(notification.source))
      return false;

    if (conditions.keywords) {
      const text =
        `${notification.title} ${notification.message}`.toLowerCase();
      const hasKeyword = conditions.keywords.some((keyword) =>
        text.includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    if (conditions.timeRange) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMin] = conditions.timeRange.start
        .split(':')
        .map(Number);
      const [endHour, endMin] = conditions.timeRange.end.split(':').map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;

      if (currentTime < startTime || currentTime > endTime) return false;
    }

    return true;
  }

  private async getAIRecommendedChannels(notification: any): Promise<string[]> {
    // AI logic for smart channel selection
    const channels: string[] = [];

    // Priority-based routing
    if (
      notification.priority === 'critical' ||
      notification.priority === 'urgent'
    ) {
      channels.push('sms', 'push');
    }

    // Type-based routing
    if (notification.type === 'emergency') {
      channels.push('sms', 'push', 'webhook');
    } else if (
      notification.type === 'load' ||
      notification.type === 'dispatch'
    ) {
      channels.push('push');
    } else if (notification.type === 'compliance') {
      channels.push('email');
    }

    // Time-based routing
    const hour = new Date().getHours();
    if (hour < 6 || hour > 22) {
      // Off-hours - reduce noise except for critical
      if (
        notification.priority !== 'critical' &&
        notification.priority !== 'urgent'
      ) {
        return channels.filter((c) => c === 'dashboard' || c === 'email');
      }
    }

    return channels;
  }

  // ==================== SNOOZE FUNCTIONALITY ====================

  async snoozeNotification(
    notificationId: string,
    userId: string,
    duration: number, // minutes
    reason?: string
  ): Promise<void> {
    const snoozeUntil = new Date(
      Date.now() + duration * 60 * 1000
    ).toISOString();

    this.snoozedNotifications.set(notificationId, {
      notificationId,
      userId,
      snoozeUntil,
      reason,
      createdAt: new Date().toISOString(),
    });

    // Schedule wake-up
    setTimeout(
      () => {
        this.wakeUpNotification(notificationId);
      },
      duration * 60 * 1000
    );
  }

  private async wakeUpNotification(notificationId: string): Promise<void> {
    const snooze = this.snoozedNotifications.get(notificationId);
    if (snooze) {
      this.snoozedNotifications.delete(notificationId);

      // Create wake-up notification
      const wakeUpNotification = {
        id: `WAKEUP-${notificationId}`,
        type: 'system',
        priority: 'normal',
        title: 'Snoozed Notification',
        message: `Your snoozed notification is now active again.`,
        timestamp: new Date().toISOString(),
        metadata: { originalNotificationId: notificationId },
      };

      await this.processNotification(wakeUpNotification);
    }
  }

  getSnoozedNotifications(userId?: string): NotificationSnooze[] {
    const snoozed = Array.from(this.snoozedNotifications.values());
    return userId ? snoozed.filter((s) => s.userId === userId) : snoozed;
  }

  // ==================== CUSTOM RULES MANAGEMENT ====================

  async createRule(
    rule: Omit<SmartNotificationRule, 'id' | 'createdAt' | 'lastModified'>
  ): Promise<string> {
    const id = `RULE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newRule: SmartNotificationRule = {
      ...rule,
      id,
      createdAt: now,
      lastModified: now,
    };

    this.rules.set(id, newRule);
    return id;
  }

  async updateRule(
    id: string,
    updates: Partial<SmartNotificationRule>
  ): Promise<void> {
    const rule = this.rules.get(id);
    if (rule) {
      const updatedRule = {
        ...rule,
        ...updates,
        lastModified: new Date().toISOString(),
      };
      this.rules.set(id, updatedRule);
    }
  }

  async deleteRule(id: string): Promise<void> {
    this.rules.delete(id);
  }

  getRules(): SmartNotificationRule[] {
    return Array.from(this.rules.values());
  }

  // ==================== MULTI-CHANNEL MANAGEMENT ====================

  private initializeDefaultChannels(): void {
    const defaultChannels: NotificationChannel[] = [
      {
        id: 'dashboard',
        name: 'Dashboard',
        type: 'dashboard',
        config: { enabled: true },
        successRate: 99.9,
      },
      {
        id: 'sms',
        name: 'SMS',
        type: 'sms',
        config: {
          enabled: true,
          rateLimiting: { maxPerMinute: 10, maxPerHour: 100 },
          priority: ['urgent', 'critical'],
        },
        successRate: 95.2,
      },
      {
        id: 'email',
        name: 'Email',
        type: 'email',
        config: {
          enabled: true,
          rateLimiting: { maxPerMinute: 50, maxPerHour: 500 },
        },
        successRate: 98.7,
      },
      {
        id: 'push',
        name: 'Push Notifications',
        type: 'push',
        config: {
          enabled: true,
          rateLimiting: { maxPerMinute: 30, maxPerHour: 300 },
        },
        successRate: 92.1,
      },
    ];

    defaultChannels.forEach((channel) => {
      this.channels.set(channel.id, channel);
    });
  }

  getChannels(): NotificationChannel[] {
    return Array.from(this.channels.values());
  }

  async updateChannel(
    id: string,
    updates: Partial<NotificationChannel>
  ): Promise<void> {
    const channel = this.channels.get(id);
    if (channel) {
      this.channels.set(id, { ...channel, ...updates });
    }
  }

  // ==================== SUMMARY REPORTS & ANALYTICS ====================

  async generateSummaryReport(
    period: 'day' | 'week' | 'month',
    startDate?: string
  ): Promise<NotificationSummary> {
    const cacheKey = `${period}-${startDate || 'current'}`;
    const cached = this.summaryCache.get(cacheKey);

    if (cached && this.isCacheValid(cached, period)) {
      return cached;
    }

    // In a real implementation, this would query the database
    const summary: NotificationSummary = {
      period,
      startDate: startDate || this.getPeriodStart(period),
      endDate: new Date().toISOString(),
      metrics: {
        totalSent: Math.floor(Math.random() * 1000) + 500,
        totalRead: Math.floor(Math.random() * 800) + 400,
        totalSnoozed: Math.floor(Math.random() * 50) + 10,
        avgResponseTime: Math.floor(Math.random() * 30) + 5,
        byChannel: {
          dashboard: Math.floor(Math.random() * 400) + 200,
          sms: Math.floor(Math.random() * 200) + 100,
          email: Math.floor(Math.random() * 300) + 150,
          push: Math.floor(Math.random() * 250) + 125,
        },
        byType: {
          load: Math.floor(Math.random() * 200) + 100,
          dispatch: Math.floor(Math.random() * 150) + 75,
          emergency: Math.floor(Math.random() * 20) + 5,
          compliance: Math.floor(Math.random() * 100) + 50,
          system: Math.floor(Math.random() * 80) + 40,
        },
        byPriority: {
          low: Math.floor(Math.random() * 100) + 50,
          normal: Math.floor(Math.random() * 300) + 200,
          high: Math.floor(Math.random() * 150) + 100,
          urgent: Math.floor(Math.random() * 50) + 25,
          critical: Math.floor(Math.random() * 20) + 10,
        },
        escalations: Math.floor(Math.random() * 15) + 5,
        failures: Math.floor(Math.random() * 10) + 2,
      },
      trends: {
        volumeChange: (Math.random() - 0.5) * 40, // -20% to +20%
        readRateChange: (Math.random() - 0.5) * 20, // -10% to +10%
        responseTimeChange: (Math.random() - 0.5) * 30, // -15% to +15%
      },
      recommendations: this.generateRecommendations(),
    };

    this.summaryCache.set(cacheKey, summary);
    return summary;
  }

  private generateRecommendations(): string[] {
    const recommendations = [
      'Consider enabling SMS alerts for urgent notifications during off-hours',
      'Set up escalation rules for unread critical notifications after 15 minutes',
      'Create custom rules to reduce email notifications for low-priority system alerts',
      'Enable push notifications for load updates to improve response times',
      'Review snooze patterns to identify notifications that may need rule adjustments',
    ];

    // Return 2-3 random recommendations
    return recommendations.sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  // ==================== SMART ALERTS & PATTERN DETECTION ====================

  private startPeriodicAnalysis(): void {
    // Run analysis every 15 minutes
    setInterval(
      () => {
        this.analyzeNotificationPatterns();
      },
      15 * 60 * 1000
    );
  }

  private async analyzeNotificationPatterns(): Promise<void> {
    // Detect anomalies and patterns
    const alerts: SmartAlert[] = [];

    // Volume spike detection
    const recentVolume = await this.getRecentNotificationVolume();
    const historicalAverage = await this.getHistoricalAverage();

    if (recentVolume > historicalAverage * 2) {
      alerts.push({
        id: `ALERT-${Date.now()}-VOLUME`,
        type: 'anomaly',
        severity: 'high',
        title: 'Notification Volume Spike',
        message: `Notification volume is ${Math.round((recentVolume / historicalAverage - 1) * 100)}% above normal`,
        data: { recentVolume, historicalAverage },
        createdAt: new Date().toISOString(),
        actions: [
          { label: 'View Details', action: 'view_volume_analysis' },
          { label: 'Create Rule', action: 'create_suppression_rule' },
        ],
      });
    }

    // Failed delivery detection
    const failureRate = await this.getRecentFailureRate();
    if (failureRate > 0.1) {
      // 10%
      alerts.push({
        id: `ALERT-${Date.now()}-FAILURES`,
        type: 'performance',
        severity: 'medium',
        title: 'High Failure Rate Detected',
        message: `${Math.round(failureRate * 100)}% of notifications failed to deliver`,
        data: { failureRate },
        createdAt: new Date().toISOString(),
        actions: [
          { label: 'Check Channels', action: 'check_channel_status' },
          { label: 'Review Logs', action: 'view_failure_logs' },
        ],
      });
    }

    this.smartAlerts.push(...alerts);
  }

  getSmartAlerts(): SmartAlert[] {
    return this.smartAlerts.filter((alert) => !alert.resolvedAt);
  }

  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.smartAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.resolvedAt = new Date().toISOString();
    }
  }

  // ==================== HELPER METHODS ====================

  private initializeDefaultRules(): void {
    const defaultRules: SmartNotificationRule[] = [
      {
        id: 'RULE-EMERGENCY-ESCALATE',
        name: 'Emergency Escalation',
        description:
          'Auto-escalate emergency notifications if not acknowledged within 5 minutes',
        conditions: { type: ['emergency'], priority: ['critical', 'urgent'] },
        actions: { escalate: true, route: ['sms', 'push'] },
        enabled: true,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'RULE-OFF-HOURS-FILTER',
        name: 'Off-Hours Filter',
        description: 'Reduce non-critical notifications between 10PM and 6AM',
        conditions: {
          priority: ['low', 'normal'],
          timeRange: { start: '22:00', end: '06:00' },
        },
        actions: { route: ['dashboard'], delay: 480 }, // 8 hours
        enabled: true,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
      {
        id: 'RULE-LOAD-UPDATES',
        name: 'Load Update Routing',
        description:
          'Send load updates via push notifications for immediate attention',
        conditions: {
          type: ['load'],
          keywords: ['confirmed', 'delayed', 'delivered'],
        },
        actions: { route: ['push', 'dashboard'] },
        enabled: true,
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      },
    ];

    defaultRules.forEach((rule) => {
      this.rules.set(rule.id, rule);
    });
  }

  private async escalateNotification(
    notification: any,
    rule: SmartNotificationRule
  ): Promise<void> {
    // Create escalated notification
    const escalatedNotification = {
      ...notification,
      id: `ESC-${notification.id}`,
      priority: 'critical',
      title: `[ESCALATED] ${notification.title}`,
      message: `This notification was escalated due to rule: ${rule.name}\n\nOriginal: ${notification.message}`,
      type: 'emergency',
    };

    await this.processNotification(escalatedNotification);
  }

  private async forwardNotification(
    notification: any,
    userIds: string[]
  ): Promise<void> {
    for (const userId of userIds) {
      const forwardedNotification = {
        ...notification,
        id: `FWD-${notification.id}-${userId}`,
        title: `[FORWARDED] ${notification.title}`,
        recipient: { ...notification.recipient, id: userId },
      };

      await this.processNotification(forwardedNotification);
    }
  }

  private isCacheValid(summary: NotificationSummary, period: string): boolean {
    const now = new Date();
    const summaryDate = new Date(summary.endDate);
    const diffHours =
      (now.getTime() - summaryDate.getTime()) / (1000 * 60 * 60);

    switch (period) {
      case 'day':
        return diffHours < 1;
      case 'week':
        return diffHours < 6;
      case 'month':
        return diffHours < 24;
      default:
        return false;
    }
  }

  private getPeriodStart(period: string): string {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        return weekStart.toISOString();
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      default:
        return now.toISOString();
    }
  }

  private async getRecentNotificationVolume(): Promise<number> {
    // Mock implementation - would query actual data
    return Math.floor(Math.random() * 100) + 50;
  }

  private async getHistoricalAverage(): Promise<number> {
    // Mock implementation - would calculate from historical data
    return 45;
  }

  private async getRecentFailureRate(): Promise<number> {
    // Mock implementation - would calculate from delivery logs
    return Math.random() * 0.15; // 0-15%
  }
}

export const smartNotificationService = SmartNotificationService.getInstance();
