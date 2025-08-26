/**
 * Comprehensive AI Audit Logger
 * Provides detailed logging and monitoring of all AI interactions for security and compliance
 */

export interface AIAuditEvent {
  id: string;
  timestamp: Date;
  eventType: AIAuditEventType;
  userId: string;
  tenantId?: string;
  sessionId: string;
  operation: string;
  aiModel?: string;
  inputData: {
    promptLength: number;
    dataSize: number;
    hasPersonalData: boolean;
    hasFinancialData: boolean;
    hasCrossTenantData: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  outputData: {
    responseLength: number;
    containsSensitiveInfo: boolean;
    wasFiltered: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  };
  securityChecks: {
    tenantIsolationPassed: boolean;
    roleBasedAccessPassed: boolean;
    dataFilteringApplied: boolean;
    threatScanPassed: boolean;
  };
  performance: {
    processingTime: number;
    securityOverhead: number;
    cost: number;
  };
  violations: AISecurityViolation[];
  ipAddress?: string;
  userAgent?: string;
  geolocation?: string;
  metadata: Record<string, any>;
}

export type AIAuditEventType =
  | 'ai_request'
  | 'security_violation'
  | 'access_denied'
  | 'data_filtered'
  | 'tenant_isolation_violation'
  | 'prompt_injection_attempt'
  | 'unauthorized_access'
  | 'system_error'
  | 'compliance_event';

export interface AISecurityViolation {
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  action: string;
  resolved: boolean;
  resolution?: string;
}

export interface AIAuditQuery {
  dateFrom?: Date;
  dateTo?: Date;
  userId?: string;
  tenantId?: string;
  eventType?: AIAuditEventType;
  severity?: string;
  operation?: string;
  limit?: number;
  offset?: number;
}

export interface AIAuditAnalytics {
  totalEvents: number;
  violationCount: number;
  averageRiskLevel: number;
  topViolationTypes: Array<{ type: string; count: number }>;
  tenantActivity: Array<{
    tenantId: string;
    eventCount: number;
    violationCount: number;
  }>;
  userActivity: Array<{
    userId: string;
    eventCount: number;
    riskScore: number;
  }>;
  timeSeriesData: Array<{ date: string; events: number; violations: number }>;
  performanceMetrics: {
    averageProcessingTime: number;
    averageSecurityOverhead: number;
    totalCost: number;
  };
}

export class AIAuditLogger {
  private events: Map<string, AIAuditEvent> = new Map();
  private eventsByType: Map<AIAuditEventType, string[]> = new Map();
  private eventsByUser: Map<string, string[]> = new Map();
  private eventsByTenant: Map<string, string[]> = new Map();
  private violationCount = 0;
  private threatCount = 0;
  private eventCount = 0;
  private retentionDays = 365; // Keep audit logs for 1 year
  private alertThresholds = {
    violations: 10, // per hour
    criticalViolations: 3, // per hour
    suspiciousUser: 20, // events per hour
    crossTenantAttempts: 5, // per day
  };

  constructor() {
    this.initializeEventTypes();
    this.startPeriodicCleanup();
    this.startRealTimeMonitoring();
  }

  /**
   * Log AI interaction event
   */
  logAIEvent(event: Partial<AIAuditEvent>): string {
    const eventId = this.generateEventId();

    const fullEvent: AIAuditEvent = {
      id: eventId,
      timestamp: new Date(),
      eventType: event.eventType || 'ai_request',
      userId: event.userId || 'unknown',
      tenantId: event.tenantId,
      sessionId: event.sessionId || 'unknown',
      operation: event.operation || 'unknown',
      aiModel: event.aiModel,
      inputData: event.inputData || {
        promptLength: 0,
        dataSize: 0,
        hasPersonalData: false,
        hasFinancialData: false,
        hasCrossTenantData: false,
        riskLevel: 'low',
      },
      outputData: event.outputData || {
        responseLength: 0,
        containsSensitiveInfo: false,
        wasFiltered: false,
        riskLevel: 'low',
      },
      securityChecks: event.securityChecks || {
        tenantIsolationPassed: true,
        roleBasedAccessPassed: true,
        dataFilteringApplied: false,
        threatScanPassed: true,
      },
      performance: event.performance || {
        processingTime: 0,
        securityOverhead: 0,
        cost: 0,
      },
      violations: event.violations || [],
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      geolocation: event.geolocation,
      metadata: event.metadata || {},
    };

    // Store event
    this.events.set(eventId, fullEvent);

    // Index by type
    this.indexEvent(eventId, fullEvent);

    // Update counters
    this.updateCounters(fullEvent);

    // Check for alerts
    this.checkForAlerts(fullEvent);

    // Log to console for immediate visibility
    this.logToConsole(fullEvent);

    return eventId;
  }

  /**
   * Log security violation
   */
  logSecurityViolation(
    userId: string,
    tenantId: string | undefined,
    violation: AISecurityViolation,
    context: any
  ): string {
    return this.logAIEvent({
      eventType: 'security_violation',
      userId,
      tenantId,
      operation: context.operation || 'unknown',
      violations: [violation],
      inputData: {
        promptLength: context.promptLength || 0,
        dataSize: context.dataSize || 0,
        hasPersonalData: context.hasPersonalData || false,
        hasFinancialData: context.hasFinancialData || false,
        hasCrossTenantData: context.hasCrossTenantData || false,
        riskLevel: violation.severity,
      },
      outputData: {
        responseLength: 0,
        containsSensitiveInfo: false,
        wasFiltered: true,
        riskLevel: violation.severity,
      },
      metadata: context,
    });
  }

  /**
   * Log prompt injection attempt
   */
  logPromptInjectionAttempt(
    userId: string,
    tenantId: string | undefined,
    prompt: string,
    detectedPatterns: string[],
    sessionId: string
  ): string {
    return this.logAIEvent({
      eventType: 'prompt_injection_attempt',
      userId,
      tenantId,
      sessionId,
      operation: 'prompt_injection',
      violations: [
        {
          type: 'prompt_injection',
          severity: 'high',
          description: 'Potential prompt injection attempt detected',
          evidence: detectedPatterns,
          action: 'blocked',
          resolved: true,
          resolution: 'Request blocked by security filters',
        },
      ],
      inputData: {
        promptLength: prompt.length,
        dataSize: prompt.length,
        hasPersonalData: false,
        hasFinancialData: false,
        hasCrossTenantData: false,
        riskLevel: 'high',
      },
      metadata: {
        detectedPatterns,
        originalPromptHash: this.hashString(prompt),
      },
    });
  }

  /**
   * Query audit events
   */
  queryEvents(query: AIAuditQuery): AIAuditEvent[] {
    let events = Array.from(this.events.values());

    // Apply filters
    if (query.dateFrom) {
      events = events.filter((e) => e.timestamp >= query.dateFrom!);
    }
    if (query.dateTo) {
      events = events.filter((e) => e.timestamp <= query.dateTo!);
    }
    if (query.userId) {
      events = events.filter((e) => e.userId === query.userId);
    }
    if (query.tenantId) {
      events = events.filter((e) => e.tenantId === query.tenantId);
    }
    if (query.eventType) {
      events = events.filter((e) => e.eventType === query.eventType);
    }
    if (query.severity) {
      events = events.filter(
        (e) =>
          e.violations.some((v) => v.severity === query.severity) ||
          e.inputData.riskLevel === query.severity ||
          e.outputData.riskLevel === query.severity
      );
    }
    if (query.operation) {
      events = events.filter((e) => e.operation.includes(query.operation!));
    }

    // Sort by timestamp descending
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    return events.slice(offset, offset + limit);
  }

  /**
   * Generate analytics report
   */
  generateAnalytics(
    timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'
  ): AIAuditAnalytics {
    const now = new Date();
    const fromDate = new Date();

    switch (timeframe) {
      case 'hour':
        fromDate.setHours(now.getHours() - 1);
        break;
      case 'day':
        fromDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        fromDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        fromDate.setMonth(now.getMonth() - 1);
        break;
    }

    const events = this.queryEvents({ dateFrom: fromDate });

    // Calculate metrics
    const violations = events.filter((e) => e.violations.length > 0);
    const violationTypes = new Map<string, number>();
    const tenantActivity = new Map<
      string,
      { events: number; violations: number }
    >();
    const userActivity = new Map<
      string,
      { events: number; riskScore: number }
    >();

    let totalProcessingTime = 0;
    let totalSecurityOverhead = 0;
    let totalCost = 0;
    let totalRiskScore = 0;

    for (const event of events) {
      // Violation types
      for (const violation of event.violations) {
        violationTypes.set(
          violation.type,
          (violationTypes.get(violation.type) || 0) + 1
        );
      }

      // Tenant activity
      if (event.tenantId) {
        const tenant = tenantActivity.get(event.tenantId) || {
          events: 0,
          violations: 0,
        };
        tenant.events++;
        if (event.violations.length > 0) tenant.violations++;
        tenantActivity.set(event.tenantId, tenant);
      }

      // User activity
      const user = userActivity.get(event.userId) || {
        events: 0,
        riskScore: 0,
      };
      user.events++;
      user.riskScore += this.calculateEventRiskScore(event);
      userActivity.set(event.userId, user);

      // Performance metrics
      totalProcessingTime += event.performance.processingTime;
      totalSecurityOverhead += event.performance.securityOverhead;
      totalCost += event.performance.cost;
      totalRiskScore += this.calculateEventRiskScore(event);
    }

    // Generate time series data
    const timeSeriesData = this.generateTimeSeriesData(events, timeframe);

    return {
      totalEvents: events.length,
      violationCount: violations.length,
      averageRiskLevel: events.length > 0 ? totalRiskScore / events.length : 0,
      topViolationTypes: Array.from(violationTypes.entries())
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      tenantActivity: Array.from(tenantActivity.entries())
        .map(([tenantId, stats]) => ({
          tenantId,
          eventCount: stats.events,
          violationCount: stats.violations,
        }))
        .sort((a, b) => b.eventCount - a.eventCount),
      userActivity: Array.from(userActivity.entries())
        .map(([userId, stats]) => ({
          userId,
          eventCount: stats.events,
          riskScore: stats.riskScore / stats.events,
        }))
        .sort((a, b) => b.riskScore - a.riskScore),
      timeSeriesData,
      performanceMetrics: {
        averageProcessingTime:
          events.length > 0 ? totalProcessingTime / events.length : 0,
        averageSecurityOverhead:
          events.length > 0 ? totalSecurityOverhead / events.length : 0,
        totalCost,
      },
    };
  }

  /**
   * Get security status
   */
  getSecurityStatus(): {
    overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
    activeThreats: number;
    violationsLastHour: number;
    highRiskUsers: string[];
    suspiciousTenants: string[];
    recommendations: string[];
  } {
    const hourlyAnalytics = this.generateAnalytics('hour');
    const dailyAnalytics = this.generateAnalytics('day');

    let overallHealth: 'excellent' | 'good' | 'warning' | 'critical' =
      'excellent';
    const recommendations: string[] = [];

    // Determine overall health
    if (
      hourlyAnalytics.violationCount >= this.alertThresholds.criticalViolations
    ) {
      overallHealth = 'critical';
      recommendations.push(
        'Critical security violations detected - immediate attention required'
      );
    } else if (
      hourlyAnalytics.violationCount >= this.alertThresholds.violations
    ) {
      overallHealth = 'warning';
      recommendations.push(
        'Increased violation activity detected - monitor closely'
      );
    } else if (dailyAnalytics.averageRiskLevel > 2) {
      overallHealth = 'good';
      recommendations.push('Above average risk level - review user training');
    }

    // Identify high-risk users (top 10% by risk score)
    const highRiskUsers = hourlyAnalytics.userActivity
      .filter((u) => u.riskScore > 3)
      .slice(0, 5)
      .map((u) => u.userId);

    // Identify suspicious tenants
    const suspiciousTenants = hourlyAnalytics.tenantActivity
      .filter((t) => t.violationCount > 2)
      .map((t) => t.tenantId);

    if (highRiskUsers.length > 0) {
      recommendations.push(
        `Review activity for high-risk users: ${highRiskUsers.join(', ')}`
      );
    }

    if (suspiciousTenants.length > 0) {
      recommendations.push(
        `Investigate suspicious tenant activity: ${suspiciousTenants.join(', ')}`
      );
    }

    return {
      overallHealth,
      activeThreats: this.threatCount,
      violationsLastHour: hourlyAnalytics.violationCount,
      highRiskUsers,
      suspiciousTenants,
      recommendations,
    };
  }

  /**
   * Initialize event type indexes
   */
  private initializeEventTypes(): void {
    const eventTypes: AIAuditEventType[] = [
      'ai_request',
      'security_violation',
      'access_denied',
      'data_filtered',
      'tenant_isolation_violation',
      'prompt_injection_attempt',
      'unauthorized_access',
      'system_error',
      'compliance_event',
    ];

    for (const type of eventTypes) {
      this.eventsByType.set(type, []);
    }
  }

  /**
   * Index event for fast retrieval
   */
  private indexEvent(eventId: string, event: AIAuditEvent): void {
    // Index by type
    const typeEvents = this.eventsByType.get(event.eventType) || [];
    typeEvents.push(eventId);
    this.eventsByType.set(event.eventType, typeEvents);

    // Index by user
    const userEvents = this.eventsByUser.get(event.userId) || [];
    userEvents.push(eventId);
    this.eventsByUser.set(event.userId, userEvents);

    // Index by tenant
    if (event.tenantId) {
      const tenantEvents = this.eventsByTenant.get(event.tenantId) || [];
      tenantEvents.push(eventId);
      this.eventsByTenant.set(event.tenantId, tenantEvents);
    }
  }

  /**
   * Update counters
   */
  private updateCounters(event: AIAuditEvent): void {
    this.eventCount++;

    if (event.violations.length > 0) {
      this.violationCount++;
    }

    if (
      event.eventType === 'prompt_injection_attempt' ||
      event.eventType === 'security_violation'
    ) {
      this.threatCount++;
    }
  }

  /**
   * Check for security alerts
   */
  private checkForAlerts(event: AIAuditEvent): void {
    // Critical violation alert
    const criticalViolations = event.violations.filter(
      (v) => v.severity === 'critical'
    );
    if (criticalViolations.length > 0) {
      console.warn(
        `🚨 CRITICAL AI SECURITY ALERT: ${event.userId} - ${criticalViolations[0].description}`
      );
    }

    // Check for unusual patterns
    const recentUserEvents = this.eventsByUser.get(event.userId) || [];
    if (recentUserEvents.length > this.alertThresholds.suspiciousUser) {
      const recentHour = recentUserEvents.filter((eventId) => {
        const e = this.events.get(eventId);
        return e && e.timestamp.getTime() > Date.now() - 3600000; // Last hour
      });

      if (recentHour.length > this.alertThresholds.suspiciousUser) {
        console.warn(
          `⚠️ SUSPICIOUS AI ACTIVITY: User ${event.userId} has ${recentHour.length} events in the last hour`
        );
      }
    }
  }

  /**
   * Log to console with appropriate level
   */
  private logToConsole(event: AIAuditEvent): void {
    const logData = {
      id: event.id,
      user: event.userId,
      tenant: event.tenantId,
      operation: event.operation,
      violations: event.violations.length,
      riskLevel: Math.max(
        this.riskLevelToNumber(event.inputData.riskLevel),
        this.riskLevelToNumber(event.outputData.riskLevel)
      ),
    };

    if (event.violations.length > 0) {
      console.warn(`[AI Security] VIOLATION: ${event.eventType}`, logData);
    } else if (event.eventType === 'access_denied') {
      console.info(`[AI Security] ACCESS DENIED: ${event.operation}`, logData);
    } else {
      console.log(`[AI Security] ${event.eventType}`, logData);
    }
  }

  /**
   * Generate time series data for analytics
   */
  private generateTimeSeriesData(
    events: AIAuditEvent[],
    timeframe: string
  ): Array<{ date: string; events: number; violations: number }> {
    const data = new Map<string, { events: number; violations: number }>();

    for (const event of events) {
      let dateKey: string;

      switch (timeframe) {
        case 'hour':
          dateKey = event.timestamp.toISOString().substring(0, 13); // YYYY-MM-DDTHH
          break;
        case 'day':
          dateKey = event.timestamp.toISOString().substring(0, 10); // YYYY-MM-DD
          break;
        case 'week':
        case 'month':
          dateKey = event.timestamp.toISOString().substring(0, 10); // YYYY-MM-DD
          break;
        default:
          dateKey = event.timestamp.toISOString().substring(0, 10);
      }

      const entry = data.get(dateKey) || { events: 0, violations: 0 };
      entry.events++;
      if (event.violations.length > 0) entry.violations++;
      data.set(dateKey, entry);
    }

    return Array.from(data.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Calculate risk score for an event
   */
  private calculateEventRiskScore(event: AIAuditEvent): number {
    let score = 0;

    // Base score from risk levels
    score += this.riskLevelToNumber(event.inputData.riskLevel);
    score += this.riskLevelToNumber(event.outputData.riskLevel);

    // Violation severity
    for (const violation of event.violations) {
      score += this.riskLevelToNumber(violation.severity) * 2;
    }

    // Security check failures
    if (!event.securityChecks.tenantIsolationPassed) score += 3;
    if (!event.securityChecks.roleBasedAccessPassed) score += 2;
    if (!event.securityChecks.threatScanPassed) score += 4;

    // Data sensitivity
    if (event.inputData.hasPersonalData) score += 1;
    if (event.inputData.hasFinancialData) score += 2;
    if (event.inputData.hasCrossTenantData) score += 4;

    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Convert risk level to number
   */
  private riskLevelToNumber(level: string): number {
    switch (level) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      case 'critical':
        return 4;
      default:
        return 0;
    }
  }

  /**
   * Utility methods
   */
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  /**
   * Periodic cleanup of old events
   */
  private startPeriodicCleanup(): void {
    setInterval(
      () => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

        let removedCount = 0;
        for (const [eventId, event] of this.events) {
          if (event.timestamp < cutoffDate) {
            this.events.delete(eventId);
            removedCount++;
          }
        }

        if (removedCount > 0) {
          console.log(`🗑️ Cleaned up ${removedCount} old audit events`);
        }
      },
      24 * 60 * 60 * 1000
    ); // Daily cleanup
  }

  /**
   * Real-time monitoring for immediate alerts
   */
  private startRealTimeMonitoring(): void {
    setInterval(
      () => {
        const status = this.getSecurityStatus();

        if (status.overallHealth === 'critical') {
          console.error(
            `🚨 CRITICAL AI SECURITY STATUS: ${status.recommendations.join(', ')}`
          );
        } else if (status.overallHealth === 'warning') {
          console.warn(
            `⚠️ AI SECURITY WARNING: ${status.recommendations.join(', ')}`
          );
        }
      },
      5 * 60 * 1000
    ); // Every 5 minutes
  }

  /**
   * Public getter methods
   */
  getThreatCount(): number {
    return this.threatCount;
  }

  getEventCount(): number {
    return this.eventCount;
  }

  getViolationCount(): number {
    return this.violationCount;
  }

  getEventsByType(eventType: AIAuditEventType): AIAuditEvent[] {
    const eventIds = this.eventsByType.get(eventType) || [];
    return eventIds.map((id) => this.events.get(id)!).filter(Boolean);
  }

  getUserEvents(userId: string): AIAuditEvent[] {
    const eventIds = this.eventsByUser.get(userId) || [];
    return eventIds.map((id) => this.events.get(id)!).filter(Boolean);
  }

  getTenantEvents(tenantId: string): AIAuditEvent[] {
    const eventIds = this.eventsByTenant.get(tenantId) || [];
    return eventIds.map((id) => this.events.get(id)!).filter(Boolean);
  }
}

// Export singleton instance
export const aiAuditLogger = new AIAuditLogger();
