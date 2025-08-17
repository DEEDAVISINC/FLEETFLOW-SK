/**
 * Regulatory Compliance Alert Service
 * Manages compliance monitoring and alerts for executive dashboard
 * Integrates with existing notification hub system
 */

export interface ComplianceItem {
  id: string;
  type:
    | 'mc_authority'
    | 'dot_registration'
    | 'insurance'
    | 'boc3'
    | 'state_registration'
    | 'safety_rating'
    | 'ifta'
    | 'icc'
    | 'ucr';
  title: string;
  description: string;
  status: 'current' | 'expiring_soon' | 'expired' | 'needs_action';
  expirationDate?: Date;
  renewalDate?: Date;
  daysUntilExpiration?: number;
  alertLevel: 'critical' | 'warning' | 'monitor' | 'ok';
  actionRequired?: string;
  contactInfo?: {
    agency: string;
    phone: string;
    website: string;
  };
  documents?: {
    name: string;
    status: 'uploaded' | 'pending' | 'expired';
    uploadDate?: Date;
  }[];
}

export interface ComplianceAlert {
  id: string;
  complianceItemId: string;
  title: string;
  message: string;
  alertLevel: 'critical' | 'warning' | 'monitor';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'notification' | 'alert';
  createdAt: Date;
  dueDate?: Date;
  isRead: boolean;
  actionUrl?: string;
}

export class ComplianceAlertService {
  private static instance: ComplianceAlertService;
  private complianceItems: ComplianceItem[] = [];
  private alerts: ComplianceAlert[] = [];

  private constructor() {
    this.initializeDemoData();
  }

  public static getInstance(): ComplianceAlertService {
    if (!ComplianceAlertService.instance) {
      ComplianceAlertService.instance = new ComplianceAlertService();
    }
    return ComplianceAlertService.instance;
  }

  /**
   * Initialize demo compliance data
   */
  private initializeDemoData(): void {
    const now = new Date();

    this.complianceItems = [
      {
        id: 'mc-authority-001',
        type: 'mc_authority',
        title: 'MC Authority #MC-123456',
        description: 'Motor Carrier Operating Authority',
        status: 'expiring_soon',
        expirationDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days
        renewalDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // 20 days
        daysUntilExpiration: 25,
        alertLevel: 'warning',
        actionRequired: 'Submit renewal application',
        contactInfo: {
          agency: 'FMCSA',
          phone: '1-800-832-5660',
          website: 'https://www.fmcsa.dot.gov',
        },
        documents: [
          {
            name: 'MC Authority Certificate',
            status: 'uploaded',
            uploadDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        id: 'dot-reg-001',
        type: 'dot_registration',
        title: 'DOT Registration #12345678',
        description: 'Department of Transportation Registration',
        status: 'current',
        expirationDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 6 months
        daysUntilExpiration: 180,
        alertLevel: 'ok',
        contactInfo: {
          agency: 'FMCSA',
          phone: '1-800-832-5660',
          website: 'https://www.fmcsa.dot.gov',
        },
      },
      {
        id: 'insurance-001',
        type: 'insurance',
        title: 'Commercial Auto Insurance',
        description: 'Primary liability insurance policy',
        status: 'expiring_soon',
        expirationDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days
        daysUntilExpiration: 15,
        alertLevel: 'critical',
        actionRequired: 'Contact insurance agent for renewal',
        contactInfo: {
          agency: 'ABC Insurance Company',
          phone: '1-800-555-0123',
          website: 'https://www.abcinsurance.com',
        },
      },
      {
        id: 'boc3-001',
        type: 'boc3',
        title: 'BOC-3 Process Agent Filing',
        description: 'Designation of Process Agent',
        status: 'expired',
        expirationDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        daysUntilExpiration: -5,
        alertLevel: 'critical',
        actionRequired: 'File immediately to avoid penalties',
        contactInfo: {
          agency: 'FMCSA',
          phone: '1-800-832-5660',
          website: 'https://www.fmcsa.dot.gov',
        },
      },
      {
        id: 'state-reg-001',
        type: 'state_registration',
        title: 'California IRP Registration',
        description: 'International Registration Plan',
        status: 'current',
        expirationDate: new Date(now.getTime() + 120 * 24 * 60 * 60 * 1000), // 4 months
        daysUntilExpiration: 120,
        alertLevel: 'monitor',
        contactInfo: {
          agency: 'California DMV',
          phone: '1-800-777-0133',
          website: 'https://www.dmv.ca.gov',
        },
      },
    ];

    this.generateAlerts();
  }

  /**
   * Generate alerts based on compliance status
   */
  private generateAlerts(): void {
    this.alerts = [];

    this.complianceItems.forEach((item) => {
      if (item.alertLevel === 'critical') {
        this.alerts.push({
          id: `alert-${item.id}-${Date.now()}`,
          complianceItemId: item.id,
          title: `CRITICAL: ${item.title}`,
          message:
            item.status === 'expired'
              ? `${item.title} has expired! ${item.actionRequired || 'Immediate action required.'}`
              : `${item.title} expires in ${item.daysUntilExpiration} days. ${item.actionRequired || 'Action needed soon.'}`,
          alertLevel: 'critical',
          priority: 'urgent',
          category: 'alert',
          createdAt: new Date(),
          dueDate: item.expirationDate,
          isRead: false,
          actionUrl: '/settings?tab=compliance',
        });
      } else if (item.alertLevel === 'warning') {
        this.alerts.push({
          id: `alert-${item.id}-${Date.now()}`,
          complianceItemId: item.id,
          title: `Warning: ${item.title}`,
          message: `${item.title} expires in ${item.daysUntilExpiration} days. ${item.actionRequired || 'Please plan for renewal.'}`,
          alertLevel: 'warning',
          priority: 'high',
          category: 'notification',
          createdAt: new Date(),
          dueDate: item.renewalDate || item.expirationDate,
          isRead: false,
          actionUrl: '/settings?tab=compliance',
        });
      } else if (
        item.alertLevel === 'monitor' &&
        item.daysUntilExpiration &&
        item.daysUntilExpiration <= 90
      ) {
        this.alerts.push({
          id: `alert-${item.id}-${Date.now()}`,
          complianceItemId: item.id,
          title: `Reminder: ${item.title}`,
          message: `${item.title} expires in ${item.daysUntilExpiration} days. Consider scheduling renewal.`,
          alertLevel: 'monitor',
          priority: 'medium',
          category: 'notification',
          createdAt: new Date(),
          dueDate: item.expirationDate,
          isRead: false,
          actionUrl: '/settings?tab=compliance',
        });
      }
    });
  }

  /**
   * Get all compliance items
   */
  public getComplianceItems(): ComplianceItem[] {
    return [...this.complianceItems];
  }

  /**
   * Get compliance items by status
   */
  public getComplianceItemsByStatus(
    status: ComplianceItem['status']
  ): ComplianceItem[] {
    return this.complianceItems.filter((item) => item.status === status);
  }

  /**
   * Get compliance items by alert level
   */
  public getComplianceItemsByAlertLevel(
    alertLevel: ComplianceItem['alertLevel']
  ): ComplianceItem[] {
    return this.complianceItems.filter(
      (item) => item.alertLevel === alertLevel
    );
  }

  /**
   * Get all compliance alerts
   */
  public getComplianceAlerts(): ComplianceAlert[] {
    return [...this.alerts];
  }

  /**
   * Get unread compliance alerts
   */
  public getUnreadAlerts(): ComplianceAlert[] {
    return this.alerts.filter((alert) => !alert.isRead);
  }

  /**
   * Get critical alerts
   */
  public getCriticalAlerts(): ComplianceAlert[] {
    return this.alerts.filter((alert) => alert.alertLevel === 'critical');
  }

  /**
   * Mark alert as read
   */
  public markAlertAsRead(alertId: string): void {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isRead = true;
    }
  }

  /**
   * Get compliance summary for dashboard
   */
  public getComplianceSummary() {
    const total = this.complianceItems.length;
    const current = this.complianceItems.filter(
      (item) => item.status === 'current'
    ).length;
    const expiringSoon = this.complianceItems.filter(
      (item) => item.status === 'expiring_soon'
    ).length;
    const expired = this.complianceItems.filter(
      (item) => item.status === 'expired'
    ).length;
    const needsAction = this.complianceItems.filter(
      (item) => item.status === 'needs_action'
    ).length;

    const critical = this.complianceItems.filter(
      (item) => item.alertLevel === 'critical'
    ).length;
    const warnings = this.complianceItems.filter(
      (item) => item.alertLevel === 'warning'
    ).length;

    return {
      total,
      current,
      expiringSoon,
      expired,
      needsAction,
      critical,
      warnings,
      complianceScore: Math.round((current / total) * 100),
      unreadAlerts: this.getUnreadAlerts().length,
    };
  }

  /**
   * Update compliance item status
   */
  public updateComplianceItem(
    itemId: string,
    updates: Partial<ComplianceItem>
  ): void {
    const index = this.complianceItems.findIndex((item) => item.id === itemId);
    if (index !== -1) {
      this.complianceItems[index] = {
        ...this.complianceItems[index],
        ...updates,
      };
      this.generateAlerts(); // Regenerate alerts after update
    }
  }

  /**
   * Add new compliance item
   */
  public addComplianceItem(item: Omit<ComplianceItem, 'id'>): string {
    const id = `compliance-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newItem: ComplianceItem = { ...item, id };
    this.complianceItems.push(newItem);
    this.generateAlerts();
    return id;
  }

  /**
   * Remove compliance item
   */
  public removeComplianceItem(itemId: string): void {
    this.complianceItems = this.complianceItems.filter(
      (item) => item.id !== itemId
    );
    this.alerts = this.alerts.filter(
      (alert) => alert.complianceItemId !== itemId
    );
  }

  /**
   * Get alerts for notification hub integration
   * Converts compliance alerts to format expected by notification system
   */
  public getAlertsForNotificationHub() {
    return this.alerts.map((alert) => ({
      id: alert.id,
      type: alert.category,
      title: alert.title,
      message: alert.message,
      priority: alert.priority,
      read: alert.isRead,
      timestamp: alert.createdAt.toISOString(),
      link: alert.actionUrl,
      user_id: 'admin', // For executive/admin users
      category: 'compliance',
      dueDate: alert.dueDate?.toISOString(),
      alertLevel: alert.alertLevel,
    }));
  }
}

export default ComplianceAlertService;

