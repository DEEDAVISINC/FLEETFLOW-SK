/**
 * Email Monitoring Service for Alexis Best (AI Executive Assistant)
 * Monitors inbox for specific emails and triggers automated follow-up actions
 */

export interface MonitoredEmail {
  id: string;
  fromAddress: string;
  subjectContains: string[];
  category:
    | 'government_contract'
    | 'customer'
    | 'vendor'
    | 'urgent'
    | 'general';
  priority: 'critical' | 'high' | 'medium' | 'low';
  actionOnReceive?: 'cancel_reminder' | 'create_task' | 'notify' | 'escalate';
  relatedEntityId?: string;
  relatedEntityType?: 'bpa' | 'rfp' | 'contract' | 'customer';
  createdBy: string;
  createdAt: string;
  active: boolean;
}

export interface EmailMonitorAlert {
  id: string;
  monitorId: string;
  triggeredAt: string;
  emailFrom: string;
  emailSubject: string;
  emailDate: string;
  actionTaken: string[];
  status: 'pending' | 'processed' | 'failed';
}

class EmailMonitoringService {
  private monitors: Map<string, MonitoredEmail> = new Map();
  private alerts: Map<string, EmailMonitorAlert> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the email monitoring service
   */
  private initializeService() {
    console.log('📧 Email Monitoring Service initialized by Alexis Best');

    if (typeof window !== 'undefined') {
      this.loadMonitorsFromStorage();
    }

    // Start monitoring check (every 5 minutes)
    this.startMonitoring();
  }

  /**
   * Create a new email monitor
   */
  createMonitor(
    monitor: Omit<MonitoredEmail, 'id' | 'createdAt' | 'active'>
  ): MonitoredEmail {
    const newMonitor: MonitoredEmail = {
      ...monitor,
      id: this.generateMonitorId(),
      createdAt: new Date().toISOString(),
      active: true,
    };

    this.monitors.set(newMonitor.id, newMonitor);
    this.saveMonitorsToStorage();

    console.log(`📧 Email monitor created for: ${newMonitor.fromAddress}`);
    return newMonitor;
  }

  /**
   * Create BPA response monitor (NAWCAD specific)
   */
  createBPAResponseMonitor(
    solicitationNumber: string,
    contactEmail: string,
    relatedEventId?: string
  ): MonitoredEmail {
    return this.createMonitor({
      fromAddress: contactEmail,
      subjectContains: [solicitationNumber, 'BPA', 'N6833525Q0321'],
      category: 'government_contract',
      priority: 'high',
      actionOnReceive: 'cancel_reminder',
      relatedEntityId: relatedEventId || solicitationNumber,
      relatedEntityType: 'bpa',
      createdBy: 'alexis-executive-023',
    });
  }

  /**
   * Get monitor by ID
   */
  getMonitor(monitorId: string): MonitoredEmail | undefined {
    return this.monitors.get(monitorId);
  }

  /**
   * Get all active monitors
   */
  getActiveMonitors(): MonitoredEmail[] {
    return Array.from(this.monitors.values()).filter((m) => m.active);
  }

  /**
   * Get monitors by category
   */
  getMonitorsByCategory(
    category: MonitoredEmail['category']
  ): MonitoredEmail[] {
    return Array.from(this.monitors.values()).filter(
      (m) => m.category === category && m.active
    );
  }

  /**
   * Deactivate monitor
   */
  deactivateMonitor(monitorId: string): boolean {
    const monitor = this.monitors.get(monitorId);
    if (!monitor) return false;

    monitor.active = false;
    this.saveMonitorsToStorage();
    console.log(`📧 Email monitor deactivated: ${monitor.fromAddress}`);
    return true;
  }

  /**
   * Reactivate monitor
   */
  reactivateMonitor(monitorId: string): boolean {
    const monitor = this.monitors.get(monitorId);
    if (!monitor) return false;

    monitor.active = true;
    this.saveMonitorsToStorage();
    console.log(`📧 Email monitor reactivated: ${monitor.fromAddress}`);
    return true;
  }

  /**
   * Check emails for matches (simulated - would integrate with actual email API)
   */
  private async checkEmails() {
    // This is a placeholder for actual email checking logic
    // In production, this would integrate with:
    // - Gmail API
    // - Microsoft Graph API
    // - Neo.space email service
    // - IMAP/POP3 connection

    console.log('📧 Checking emails for monitored addresses...');

    // Get active monitors
    const activeMonitors = this.getActiveMonitors();

    // In production, would fetch actual emails here
    // For now, this is a framework for the integration

    return activeMonitors;
  }

  /**
   * Process matched email
   */
  async processMatchedEmail(
    monitor: MonitoredEmail,
    emailData: {
      from: string;
      subject: string;
      date: string;
      body?: string;
    }
  ): Promise<EmailMonitorAlert> {
    const alert: EmailMonitorAlert = {
      id: this.generateAlertId(),
      monitorId: monitor.id,
      triggeredAt: new Date().toISOString(),
      emailFrom: emailData.from,
      emailSubject: emailData.subject,
      emailDate: emailData.date,
      actionTaken: [],
      status: 'pending',
    };

    try {
      // Execute the configured action
      switch (monitor.actionOnReceive) {
        case 'cancel_reminder':
          alert.actionTaken.push('Cancelled related calendar reminder');
          this.cancelRelatedReminder(monitor);
          break;

        case 'create_task':
          alert.actionTaken.push('Created follow-up task');
          this.createFollowUpTask(monitor, emailData);
          break;

        case 'notify':
          alert.actionTaken.push('Sent notification to Dee Davis');
          this.sendNotification(monitor, emailData);
          break;

        case 'escalate':
          alert.actionTaken.push('Escalated to high priority');
          this.escalateEmail(monitor, emailData);
          break;
      }

      alert.status = 'processed';
      console.log(`✅ Email monitor triggered: ${monitor.fromAddress}`);
      console.log(`   Subject: ${emailData.subject}`);
      console.log(`   Actions: ${alert.actionTaken.join(', ')}`);
    } catch (error) {
      alert.status = 'failed';
      console.error('Failed to process matched email:', error);
    }

    this.alerts.set(alert.id, alert);
    return alert;
  }

  /**
   * Cancel related calendar reminder
   */
  private cancelRelatedReminder(monitor: MonitoredEmail) {
    // Import and use CalendarReminderService
    if (monitor.relatedEntityId) {
      console.log(
        `🔔 Cancelling calendar reminder for: ${monitor.relatedEntityId}`
      );

      // This would integrate with CalendarReminderService
      // calendarReminderService.cancelEvent(monitor.relatedEntityId);
    }
  }

  /**
   * Create follow-up task
   */
  private createFollowUpTask(
    monitor: MonitoredEmail,
    emailData: { from: string; subject: string; date: string }
  ) {
    console.log(`📋 Creating follow-up task for email from: ${emailData.from}`);
    // This would integrate with task management system
  }

  /**
   * Send notification
   */
  private sendNotification(
    monitor: MonitoredEmail,
    emailData: { from: string; subject: string; date: string }
  ) {
    console.log(
      `🔔 Sending notification: Email received from ${emailData.from}`
    );

    // This would integrate with notification system
    // - Dashboard notification
    // - Mobile push notification
    // - SMS alert
    // - BCC to info@deedavis.biz
  }

  /**
   * Escalate email
   */
  private escalateEmail(
    monitor: MonitoredEmail,
    emailData: { from: string; subject: string; date: string }
  ) {
    console.log(`🚨 ESCALATION: Important email from ${emailData.from}`);

    // This would:
    // - Mark as urgent in CRM
    // - Send immediate notification to Dee Davis
    // - Create high-priority task
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): EmailMonitorAlert[] {
    return Array.from(this.alerts.values()).sort(
      (a, b) =>
        new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
    );
  }

  /**
   * Get alerts for specific monitor
   */
  getAlertsForMonitor(monitorId: string): EmailMonitorAlert[] {
    return Array.from(this.alerts.values())
      .filter((alert) => alert.monitorId === monitorId)
      .sort(
        (a, b) =>
          new Date(b.triggeredAt).getTime() - new Date(a.triggeredAt).getTime()
      );
  }

  /**
   * Start monitoring
   */
  private startMonitoring() {
    // Check every 5 minutes
    this.checkInterval = setInterval(
      () => {
        this.checkEmails();
      },
      5 * 60 * 1000
    );

    // Initial check
    this.checkEmails();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Generate unique monitor ID
   */
  private generateMonitorId(): string {
    return `monitor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique alert ID
   */
  private generateAlertId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save monitors to localStorage
   */
  private saveMonitorsToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const monitorsArray = Array.from(this.monitors.entries());
      const alertsArray = Array.from(this.alerts.entries());

      localStorage.setItem(
        'alexis-email-monitors',
        JSON.stringify(monitorsArray)
      );
      localStorage.setItem('alexis-email-alerts', JSON.stringify(alertsArray));
    } catch (error) {
      console.error('Failed to save email monitors to storage:', error);
    }
  }

  /**
   * Load monitors from localStorage
   */
  private loadMonitorsFromStorage() {
    if (typeof window === 'undefined') return;

    try {
      const monitorsData = localStorage.getItem('alexis-email-monitors');
      const alertsData = localStorage.getItem('alexis-email-alerts');

      if (monitorsData) {
        const monitorsArray = JSON.parse(monitorsData);
        this.monitors = new Map(monitorsArray);
        console.log(
          `📧 Loaded ${this.monitors.size} email monitors from storage`
        );
      }

      if (alertsData) {
        const alertsArray = JSON.parse(alertsData);
        this.alerts = new Map(alertsArray);
        console.log(`🔔 Loaded ${this.alerts.size} email alerts from storage`);
      }
    } catch (error) {
      console.error('Failed to load email monitors from storage:', error);
    }
  }
}

// Export singleton instance
export const emailMonitoringService = new EmailMonitoringService();
