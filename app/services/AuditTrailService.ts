/**
 * FleetFlow Audit Trail Service
 * Comprehensive tracking system for all BB (Broker Agent) activities
 * Provides compliance-ready audit logs with detailed activity tracking
 */

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  brokerageId: string;
  brokerageName: string;
  actionType: AuditActionType;
  actionCategory: AuditCategory;
  description: string;
  details: AuditDetails;
  ipAddress?: string;
  userAgent?: string;
  sessionId: string;
  riskLevel: 'low' | 'medium' | 'high';
  complianceFlags: ComplianceFlag[];
  relatedEntities: RelatedEntity[];
}

export type AuditActionType =
  // Load Management
  | 'load_created'
  | 'load_updated'
  | 'load_deleted'
  | 'load_assigned'
  | 'load_cancelled'
  // Rate Management
  | 'rate_quoted'
  | 'rate_negotiated'
  | 'rate_confirmed'
  | 'rate_rejected'
  // Carrier Management
  | 'carrier_contacted'
  | 'carrier_assigned'
  | 'carrier_removed'
  | 'carrier_rated'
  // Customer Communication
  | 'customer_called'
  | 'customer_emailed'
  | 'customer_meeting'
  | 'customer_complaint'
  // Financial Activities
  | 'invoice_created'
  | 'payment_processed'
  | 'commission_calculated'
  | 'expense_logged'
  // Document Management
  | 'document_uploaded'
  | 'document_signed'
  | 'document_shared'
  | 'document_deleted'
  // System Access
  | 'login'
  | 'logout'
  | 'password_changed'
  | 'profile_updated'
  | 'permission_used'
  // Compliance Actions
  | 'compliance_check'
  | 'violation_reported'
  | 'audit_requested'
  | 'regulatory_filing'
  // Data Access
  | 'data_exported'
  | 'report_generated'
  | 'database_query'
  | 'sensitive_data_accessed';

export type AuditCategory =
  | 'load_operations'
  | 'financial'
  | 'communication'
  | 'compliance'
  | 'system_access'
  | 'data_management'
  | 'carrier_relations'
  | 'customer_service';

export interface AuditDetails {
  loadId?: string;
  customerId?: string;
  carrierId?: string;
  contractValue?: number;
  documentType?: string;
  dataAccessed?: string[];
  changesBefore?: Record<string, any>;
  changesAfter?: Record<string, any>;
  approvalRequired?: boolean;
  approverNotified?: boolean;
  geolocation?: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
  };
  deviceInfo?: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
}

export interface ComplianceFlag {
  type: 'regulatory' | 'financial' | 'security' | 'policy';
  severity: 'info' | 'warning' | 'critical';
  description: string;
  regulationReference?: string;
  requiresAction?: boolean;
  deadline?: string;
}

export interface RelatedEntity {
  type: 'load' | 'customer' | 'carrier' | 'contract' | 'document' | 'payment';
  id: string;
  description: string;
}

export interface AuditSearchFilter {
  agentId?: string;
  brokerageId?: string;
  actionTypes?: AuditActionType[];
  categories?: AuditCategory[];
  dateRange?: {
    start: string;
    end: string;
  };
  riskLevels?: ('low' | 'medium' | 'high')[];
  complianceFlags?: boolean;
  contractValueRange?: {
    min: number;
    max: number;
  };
  textSearch?: string;
}

export interface AuditSummary {
  totalEntries: number;
  entriesByCategory: Record<AuditCategory, number>;
  entriesByRisk: Record<'low' | 'medium' | 'high', number>;
  complianceFlagsCount: number;
  uniqueAgents: number;
  dateRange: {
    earliest: string;
    latest: string;
  };
  topActions: Array<{
    actionType: AuditActionType;
    count: number;
    percentage: number;
  }>;
}

export interface ComplianceReport {
  reportId: string;
  brokerageId: string;
  agentId?: string;
  reportType:
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'quarterly'
    | 'annual'
    | 'custom';
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: string;
  summary: AuditSummary;
  criticalFindings: AuditLogEntry[];
  recommendations: ComplianceRecommendation[];
  regulatoryCompliance: RegulatoryCompliance[];
}

export interface ComplianceRecommendation {
  id: string;
  type: 'training' | 'policy_update' | 'system_improvement' | 'process_change';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionItems: string[];
  estimatedImpact: string;
  deadline?: string;
}

export interface RegulatoryCompliance {
  regulation: string;
  status: 'compliant' | 'warning' | 'violation';
  description: string;
  evidence: string[];
  requiredActions?: string[];
}

export class AuditTrailService {
  private static auditLogs: AuditLogEntry[] = [
    // Sample audit entries for demonstration
    {
      id: 'audit-001',
      timestamp: '2024-01-15T14:30:00Z',
      agentId: 'ED-BB-2024061',
      agentName: 'Emily Davis',
      brokerageId: 'MW-FBB-2024046',
      brokerageName: 'Wilson Freight Brokerage',
      actionType: 'load_created',
      actionCategory: 'load_operations',
      description: 'Created new load ATL-MIA-001 for Electronics shipment',
      details: {
        loadId: 'ATL-MIA-001',
        customerId: 'CUST-WMT-001',
        contractValue: 2500,
        changesBefore: {},
        changesAfter: {
          origin: 'Atlanta, GA',
          destination: 'Miami, FL',
          commodity: 'Electronics',
          rate: 2500,
        },
        approvalRequired: false,
        geolocation: {
          latitude: 33.749,
          longitude: -84.388,
          city: 'Atlanta',
          state: 'GA',
        },
      },
      sessionId: 'session-ed-001',
      riskLevel: 'low',
      complianceFlags: [],
      relatedEntities: [
        {
          type: 'load',
          id: 'ATL-MIA-001',
          description: 'Electronics shipment',
        },
        { type: 'customer', id: 'CUST-WMT-001', description: 'Major retailer' },
      ],
    },
    {
      id: 'audit-002',
      timestamp: '2024-01-15T15:45:00Z',
      agentId: 'ED-BB-2024061',
      agentName: 'Emily Davis',
      brokerageId: 'MW-FBB-2024046',
      brokerageName: 'Wilson Freight Brokerage',
      actionType: 'rate_negotiated',
      actionCategory: 'financial',
      description: 'Negotiated rate increase from $2,350 to $2,500',
      details: {
        loadId: 'ATL-MIA-001',
        contractValue: 2500,
        changesBefore: { rate: 2350 },
        changesAfter: { rate: 2500 },
        approvalRequired: false,
      },
      sessionId: 'session-ed-001',
      riskLevel: 'medium',
      complianceFlags: [
        {
          type: 'financial',
          severity: 'info',
          description: 'Rate increase within normal parameters',
          requiresAction: false,
        },
      ],
      relatedEntities: [
        {
          type: 'load',
          id: 'ATL-MIA-001',
          description: 'Electronics shipment',
        },
      ],
    },
    {
      id: 'audit-003',
      timestamp: '2024-01-15T16:20:00Z',
      agentId: 'ED-BB-2024061',
      agentName: 'Emily Davis',
      brokerageId: 'MW-FBB-2024046',
      brokerageName: 'Wilson Freight Brokerage',
      actionType: 'sensitive_data_accessed',
      actionCategory: 'data_management',
      description: 'Accessed financial dashboard - commission data',
      details: {
        dataAccessed: ['commission_rates', 'customer_payment_history'],
        approvalRequired: false,
      },
      sessionId: 'session-ed-001',
      riskLevel: 'high',
      complianceFlags: [
        {
          type: 'security',
          severity: 'warning',
          description: 'Access to sensitive financial data logged',
          requiresAction: false,
        },
      ],
      relatedEntities: [],
    },
  ];

  /**
   * Log a new audit entry
   */
  static logActivity(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): string {
    const auditEntry: AuditLogEntry = {
      ...entry,
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(auditEntry);

    // In production, this would also:
    // 1. Send to external audit log service
    // 2. Trigger compliance checks
    // 3. Alert on high-risk activities
    // 4. Store in secure database

    console.info(
      `[AUDIT] ${auditEntry.agentName} - ${auditEntry.actionType}: ${auditEntry.description}`
    );

    return auditEntry.id;
  }

  /**
   * Search audit logs with filters
   */
  static searchAuditLogs(
    filter: AuditSearchFilter,
    page: number = 1,
    limit: number = 50
  ): {
    entries: AuditLogEntry[];
    totalCount: number;
    page: number;
    totalPages: number;
  } {
    let filteredLogs = [...this.auditLogs];

    // Apply filters
    if (filter.agentId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.agentId === filter.agentId
      );
    }

    if (filter.brokerageId) {
      filteredLogs = filteredLogs.filter(
        (log) => log.brokerageId === filter.brokerageId
      );
    }

    if (filter.actionTypes && filter.actionTypes.length > 0) {
      filteredLogs = filteredLogs.filter((log) =>
        filter.actionTypes!.includes(log.actionType)
      );
    }

    if (filter.categories && filter.categories.length > 0) {
      filteredLogs = filteredLogs.filter((log) =>
        filter.categories!.includes(log.actionCategory)
      );
    }

    if (filter.dateRange) {
      const start = new Date(filter.dateRange.start);
      const end = new Date(filter.dateRange.end);
      filteredLogs = filteredLogs.filter((log) => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      });
    }

    if (filter.riskLevels && filter.riskLevels.length > 0) {
      filteredLogs = filteredLogs.filter((log) =>
        filter.riskLevels!.includes(log.riskLevel)
      );
    }

    if (filter.complianceFlags) {
      filteredLogs = filteredLogs.filter(
        (log) => log.complianceFlags.length > 0
      );
    }

    if (filter.contractValueRange) {
      filteredLogs = filteredLogs.filter((log) => {
        const value = log.details.contractValue;
        return (
          value !== undefined &&
          value >= filter.contractValueRange!.min &&
          value <= filter.contractValueRange!.max
        );
      });
    }

    if (filter.textSearch) {
      const searchTerm = filter.textSearch.toLowerCase();
      filteredLogs = filteredLogs.filter(
        (log) =>
          log.description.toLowerCase().includes(searchTerm) ||
          log.agentName.toLowerCase().includes(searchTerm) ||
          log.brokerageName.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Pagination
    const totalCount = filteredLogs.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEntries = filteredLogs.slice(startIndex, endIndex);

    return {
      entries: paginatedEntries,
      totalCount,
      page,
      totalPages,
    };
  }

  /**
   * Get audit summary for a specific period
   */
  static getAuditSummary(filter: AuditSearchFilter): AuditSummary {
    const { entries } = this.searchAuditLogs(filter, 1, 10000); // Get all entries

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        entriesByCategory: {} as Record<AuditCategory, number>,
        entriesByRisk: { low: 0, medium: 0, high: 0 },
        complianceFlagsCount: 0,
        uniqueAgents: 0,
        dateRange: { earliest: '', latest: '' },
        topActions: [],
      };
    }

    // Calculate summary statistics
    const entriesByCategory = entries.reduce(
      (acc, entry) => {
        acc[entry.actionCategory] = (acc[entry.actionCategory] || 0) + 1;
        return acc;
      },
      {} as Record<AuditCategory, number>
    );

    const entriesByRisk = entries.reduce(
      (acc, entry) => {
        acc[entry.riskLevel]++;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    const complianceFlagsCount = entries.reduce(
      (count, entry) => count + entry.complianceFlags.length,
      0
    );

    const uniqueAgents = new Set(entries.map((entry) => entry.agentId)).size;

    const timestamps = entries.map((entry) => entry.timestamp).sort();
    const dateRange = {
      earliest: timestamps[0] || '',
      latest: timestamps[timestamps.length - 1] || '',
    };

    const actionCounts = entries.reduce(
      (acc, entry) => {
        acc[entry.actionType] = (acc[entry.actionType] || 0) + 1;
        return acc;
      },
      {} as Record<AuditActionType, number>
    );

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({
        actionType: action as AuditActionType,
        count,
        percentage: Math.round((count / entries.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEntries: entries.length,
      entriesByCategory,
      entriesByRisk,
      complianceFlagsCount,
      uniqueAgents,
      dateRange,
      topActions,
    };
  }

  /**
   * Generate compliance report
   */
  static generateComplianceReport(
    brokerageId: string,
    reportType: ComplianceReport['reportType'],
    customDateRange?: { start: string; end: string },
    agentId?: string
  ): ComplianceReport {
    // Calculate date range based on report type
    let dateRange;
    const now = new Date();

    switch (reportType) {
      case 'daily':
        dateRange = {
          start: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
          end: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
        };
        break;
      case 'weekly':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        dateRange = {
          start: weekStart.toISOString(),
          end: new Date().toISOString(),
        };
        break;
      case 'monthly':
        dateRange = {
          start: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          end: new Date().toISOString(),
        };
        break;
      default:
        dateRange = customDateRange || {
          start: new Date(now.setDate(now.getDate() - 30)).toISOString(),
          end: new Date().toISOString(),
        };
    }

    const filter: AuditSearchFilter = {
      brokerageId,
      agentId,
      dateRange,
    };

    const summary = this.getAuditSummary(filter);
    const allEntries = this.searchAuditLogs(filter, 1, 10000).entries;

    // Identify critical findings
    const criticalFindings = allEntries.filter(
      (entry) =>
        entry.riskLevel === 'high' ||
        entry.complianceFlags.some((flag) => flag.severity === 'critical')
    );

    // Generate recommendations
    const recommendations: ComplianceRecommendation[] = [];

    if (criticalFindings.length > 0) {
      recommendations.push({
        id: 'rec-001',
        type: 'training',
        priority: 'high',
        description:
          'Additional compliance training recommended due to high-risk activities',
        actionItems: [
          'Schedule monthly compliance training sessions',
          'Review high-risk activity policies',
          'Implement additional oversight for sensitive operations',
        ],
        estimatedImpact: 'Reduce compliance violations by 40%',
      });
    }

    // Check regulatory compliance
    const regulatoryCompliance: RegulatoryCompliance[] = [
      {
        regulation: 'FMCSA Broker Financial Responsibility',
        status: 'compliant',
        description: 'All financial activities properly logged and monitored',
        evidence: [
          `${summary.entriesByCategory.financial || 0} financial activities tracked`,
        ],
      },
      {
        regulation: 'DOT Record Keeping Requirements',
        status: 'compliant',
        description: 'Comprehensive audit trail maintained for all operations',
        evidence: [
          `${summary.totalEntries} audit entries`,
          'All activities timestamped and tracked',
        ],
      },
    ];

    return {
      reportId: `report-${Date.now()}`,
      brokerageId,
      agentId,
      reportType,
      periodStart: dateRange.start,
      periodEnd: dateRange.end,
      generatedAt: new Date().toISOString(),
      generatedBy: 'system', // In production, this would be the requesting user
      summary,
      criticalFindings,
      recommendations,
      regulatoryCompliance,
    };
  }

  /**
   * Get agent activity timeline
   */
  static getAgentTimeline(agentId: string, days: number = 30): AuditLogEntry[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.auditLogs
      .filter(
        (log) =>
          log.agentId === agentId && new Date(log.timestamp) >= cutoffDate
      )
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
  }

  /**
   * Track real-time agent activity (for live monitoring)
   */
  static trackAgentActivity(
    agentId: string,
    actionType: AuditActionType,
    details: Partial<AuditDetails> = {}
  ) {
    // This would be called automatically by other services
    // when agents perform actions in the system

    const agentInfo = this.getAgentInfo(agentId);
    if (!agentInfo) return null;

    return this.logActivity({
      agentId,
      agentName: agentInfo.name,
      brokerageId: agentInfo.brokerageId,
      brokerageName: agentInfo.brokerageName,
      actionType,
      actionCategory: this.getActionCategory(actionType),
      description: this.generateActionDescription(actionType, details),
      details: details as AuditDetails,
      sessionId: agentInfo.sessionId || 'unknown',
      riskLevel: this.assessRiskLevel(actionType, details),
      complianceFlags: this.checkComplianceFlags(actionType, details),
      relatedEntities: this.extractRelatedEntities(details),
    });
  }

  /**
   * Helper methods (simplified for demo)
   */
  private static getAgentInfo(agentId: string) {
    // In production, this would look up agent information
    return {
      name: 'Emily Davis',
      brokerageId: 'MW-FBB-2024046',
      brokerageName: 'Wilson Freight Brokerage',
      sessionId: 'session-ed-001',
    };
  }

  private static getActionCategory(actionType: AuditActionType): AuditCategory {
    const categoryMap: Record<AuditActionType, AuditCategory> = {
      load_created: 'load_operations',
      load_updated: 'load_operations',
      load_deleted: 'load_operations',
      load_assigned: 'load_operations',
      load_cancelled: 'load_operations',
      rate_quoted: 'financial',
      rate_negotiated: 'financial',
      rate_confirmed: 'financial',
      rate_rejected: 'financial',
      carrier_contacted: 'carrier_relations',
      carrier_assigned: 'carrier_relations',
      carrier_removed: 'carrier_relations',
      carrier_rated: 'carrier_relations',
      customer_called: 'communication',
      customer_emailed: 'communication',
      customer_meeting: 'communication',
      customer_complaint: 'customer_service',
      invoice_created: 'financial',
      payment_processed: 'financial',
      commission_calculated: 'financial',
      expense_logged: 'financial',
      document_uploaded: 'data_management',
      document_signed: 'data_management',
      document_shared: 'data_management',
      document_deleted: 'data_management',
      login: 'system_access',
      logout: 'system_access',
      password_changed: 'system_access',
      profile_updated: 'system_access',
      permission_used: 'system_access',
      compliance_check: 'compliance',
      violation_reported: 'compliance',
      audit_requested: 'compliance',
      regulatory_filing: 'compliance',
      data_exported: 'data_management',
      report_generated: 'data_management',
      database_query: 'data_management',
      sensitive_data_accessed: 'data_management',
    };

    return categoryMap[actionType] || 'system_access';
  }

  private static generateActionDescription(
    actionType: AuditActionType,
    details: Partial<AuditDetails>
  ): string {
    // Simplified description generator
    const descriptions: Record<AuditActionType, string> = {
      load_created: `Created new load ${details.loadId || 'unknown'}`,
      rate_negotiated: `Negotiated rate for contract value $${details.contractValue || 0}`,
      sensitive_data_accessed: `Accessed sensitive data: ${details.dataAccessed?.join(', ') || 'unknown'}`,
      // ... other action types would have templates
    } as Record<AuditActionType, string>;

    return (
      descriptions[actionType] || `Performed ${actionType.replace('_', ' ')}`
    );
  }

  private static assessRiskLevel(
    actionType: AuditActionType,
    details: Partial<AuditDetails>
  ): 'low' | 'medium' | 'high' {
    const highRiskActions = [
      'sensitive_data_accessed',
      'document_deleted',
      'violation_reported',
    ];
    const mediumRiskActions = [
      'rate_negotiated',
      'load_cancelled',
      'carrier_removed',
    ];

    if (highRiskActions.includes(actionType)) return 'high';
    if (mediumRiskActions.includes(actionType)) return 'medium';
    if (details.contractValue && details.contractValue > 25000) return 'medium';

    return 'low';
  }

  private static checkComplianceFlags(
    actionType: AuditActionType,
    details: Partial<AuditDetails>
  ): ComplianceFlag[] {
    const flags: ComplianceFlag[] = [];

    if (actionType === 'sensitive_data_accessed') {
      flags.push({
        type: 'security',
        severity: 'warning',
        description: 'Access to sensitive data logged',
        requiresAction: false,
      });
    }

    if (details.contractValue && details.contractValue > 50000) {
      flags.push({
        type: 'financial',
        severity: 'warning',
        description: 'High-value contract requires additional oversight',
        requiresAction: true,
      });
    }

    return flags;
  }

  private static extractRelatedEntities(
    details: Partial<AuditDetails>
  ): RelatedEntity[] {
    const entities: RelatedEntity[] = [];

    if (details.loadId) {
      entities.push({
        type: 'load',
        id: details.loadId,
        description: 'Associated load',
      });
    }
    if (details.customerId) {
      entities.push({
        type: 'customer',
        id: details.customerId,
        description: 'Associated customer',
      });
    }
    if (details.carrierId) {
      entities.push({
        type: 'carrier',
        id: details.carrierId,
        description: 'Associated carrier',
      });
    }

    return entities;
  }
}

export default AuditTrailService;
