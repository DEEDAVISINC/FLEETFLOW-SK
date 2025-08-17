/**
 * Notification Integration Service
 * Integrates compliance alerts with the existing notification hub system
 */

import ComplianceAlertService from './ComplianceAlertService';

export interface NotificationHubAlert {
  id: string;
  type: 'notification' | 'alert';
  title: string;
  message: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  read: boolean;
  timestamp: string;
  link?: string;
  user_id: string;
  category: string;
  dueDate?: string;
  alertLevel?: 'critical' | 'warning' | 'monitor';
}

export class NotificationIntegrationService {
  private static instance: NotificationIntegrationService;
  private complianceService: ComplianceAlertService;

  private constructor() {
    this.complianceService = ComplianceAlertService.getInstance();
  }

  public static getInstance(): NotificationIntegrationService {
    if (!NotificationIntegrationService.instance) {
      NotificationIntegrationService.instance =
        new NotificationIntegrationService();
    }
    return NotificationIntegrationService.instance;
  }

  /**
   * Get all notifications including compliance alerts
   * This method should be called by the NotificationBell component
   */
  public getAllNotifications(userId: string): NotificationHubAlert[] {
    const notifications: NotificationHubAlert[] = [];

    // Get compliance alerts for executive users
    if (this.isExecutiveUser(userId)) {
      const complianceAlerts =
        this.complianceService.getAlertsForNotificationHub();
      notifications.push(...complianceAlerts);
    }

    // Add other notification sources here
    // e.g., dispatch notifications, driver alerts, etc.

    // Sort by priority and timestamp
    return notifications.sort((a, b) => {
      // Sort by priority first (urgent > high > medium > low)
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff =
        (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);

      if (priorityDiff !== 0) return priorityDiff;

      // Then sort by timestamp (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  /**
   * Get unread notification count for badge display
   */
  public getUnreadCount(userId: string): number {
    return this.getAllNotifications(userId).filter((n) => !n.read).length;
  }

  /**
   * Get critical alerts count
   */
  public getCriticalAlertsCount(userId: string): number {
    return this.getAllNotifications(userId).filter(
      (n) => n.alertLevel === 'critical' && !n.read
    ).length;
  }

  /**
   * Mark notification as read
   */
  public markAsRead(notificationId: string, userId: string): void {
    // Check if it's a compliance alert
    if (notificationId.startsWith('alert-')) {
      this.complianceService.markAlertAsRead(notificationId);
      return;
    }

    // Handle other notification types here
  }

  /**
   * Mark all notifications as read for a user
   */
  public markAllAsRead(userId: string): void {
    const notifications = this.getAllNotifications(userId);

    notifications.forEach((notification) => {
      if (!notification.read) {
        this.markAsRead(notification.id, userId);
      }
    });
  }

  /**
   * Check if user is an executive (should receive compliance alerts)
   */
  private isExecutiveUser(userId: string): boolean {
    // In a real implementation, this would check user role from database
    // For demo purposes, assume admin users are executives
    const executiveRoles = [
      'Admin',
      'Manager',
      'Owner',
      'President',
      'CEO',
      'COO',
    ];

    // This is a simplified check - in production, you'd query the user's actual role
    return (
      executiveRoles.some((role) =>
        userId.toLowerCase().includes(role.toLowerCase())
      ) ||
      userId === 'admin' ||
      userId === 'U001'
    ); // Demo admin user from settings
  }

  /**
   * Get notifications for specific categories
   */
  public getNotificationsByCategory(
    userId: string,
    category: string
  ): NotificationHubAlert[] {
    return this.getAllNotifications(userId).filter(
      (n) => n.category === category
    );
  }

  /**
   * Get notifications by priority level
   */
  public getNotificationsByPriority(
    userId: string,
    priority: 'urgent' | 'high' | 'medium' | 'low'
  ): NotificationHubAlert[] {
    return this.getAllNotifications(userId).filter(
      (n) => n.priority === priority
    );
  }

  /**
   * Create a test compliance notification (for demo purposes)
   */
  public createTestComplianceAlert(
    title: string,
    message: string,
    priority: 'urgent' | 'high' | 'medium' | 'low' = 'high'
  ): void {
    const alert = {
      id: `test-alert-${Date.now()}`,
      type: 'alert' as const,
      title,
      message,
      priority,
      read: false,
      timestamp: new Date().toISOString(),
      link: '/settings?tab=compliance',
      user_id: 'admin',
      category: 'compliance',
      alertLevel:
        priority === 'urgent' ? ('critical' as const) : ('warning' as const),
    };

    // In a real implementation, this would be saved to database
    console.log('Test compliance alert created:', alert);
  }

  /**
   * Get notification summary for dashboard widgets
   */
  public getNotificationSummary(userId: string) {
    const notifications = this.getAllNotifications(userId);
    const unread = notifications.filter((n) => !n.read);

    return {
      total: notifications.length,
      unread: unread.length,
      critical: notifications.filter(
        (n) => n.alertLevel === 'critical' && !n.read
      ).length,
      warning: notifications.filter(
        (n) => n.alertLevel === 'warning' && !n.read
      ).length,
      byCategory: {
        compliance: notifications.filter((n) => n.category === 'compliance')
          .length,
        dispatch: notifications.filter((n) => n.category === 'dispatch').length,
        maintenance: notifications.filter((n) => n.category === 'maintenance')
          .length,
        financial: notifications.filter((n) => n.category === 'financial')
          .length,
      },
      recentCritical: notifications
        .filter((n) => n.alertLevel === 'critical' && !n.read)
        .slice(0, 3), // Get top 3 most recent critical alerts
    };
  }

  /**
   * Schedule periodic compliance checks
   * This would typically run as a background service
   */
  public scheduleComplianceChecks(): void {
    // Check compliance status every hour
    setInterval(
      () => {
        const summary = this.complianceService.getComplianceSummary();

        // If there are new critical issues, create urgent notifications
        if (summary.critical > 0) {
          console.log(
            `🚨 ${summary.critical} critical compliance issues detected`
          );

          // In production, this would send real notifications to executives
          this.createTestComplianceAlert(
            'Critical Compliance Issues Detected',
            `${summary.critical} regulatory compliance items require immediate attention.`,
            'urgent'
          );
        }

        // If there are expiring items, create warning notifications
        if (summary.expiringSoon > 0) {
          console.log(
            `⚠️ ${summary.expiringSoon} compliance items expiring soon`
          );

          this.createTestComplianceAlert(
            'Compliance Items Expiring Soon',
            `${summary.expiringSoon} regulatory items will expire within 30 days.`,
            'high'
          );
        }
      },
      60 * 60 * 1000
    ); // Every hour
  }
}

export default NotificationIntegrationService;

