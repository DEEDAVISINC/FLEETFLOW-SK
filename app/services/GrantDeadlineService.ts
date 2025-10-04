/**
 * GRANT DEADLINE REMINDER SERVICE
 * Automated deadline monitoring and reminder system for grant applications
 */

export interface GrantDeadline {
  id: string;
  grantName: string;
  provider: string;
  deadline: Date;
  daysUntilDeadline: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  remindersSent: number;
  lastReminderDate?: Date;
  status: 'Active' | 'Completed' | 'Missed';
  assignedTo: string[];
}

export interface DeadlineReminder {
  id: string;
  grantId: string;
  type: 'Email' | 'SMS' | 'Push' | 'Dashboard';
  message: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
}

class GrantDeadlineService {
  private static instance: GrantDeadlineService;
  private deadlines: Map<string, GrantDeadline> = new Map();
  private reminders: Map<string, DeadlineReminder[]> = new Map();

  private constructor() {
    console.info('⏰ Grant Deadline Service initialized');
    this.startAutomatedMonitoring();
  }

  public static getInstance(): GrantDeadlineService {
    if (!GrantDeadlineService.instance) {
      GrantDeadlineService.instance = new GrantDeadlineService();
    }
    return GrantDeadlineService.instance;
  }

  /**
   * Add a new grant deadline to monitor
   */
  public async addDeadline(
    deadline: Omit<GrantDeadline, 'daysUntilDeadline' | 'remindersSent'>
  ): Promise<GrantDeadline> {
    const daysUntilDeadline = this.calculateDaysUntilDeadline(
      deadline.deadline
    );

    const newDeadline: GrantDeadline = {
      ...deadline,
      daysUntilDeadline,
      remindersSent: 0,
    };

    this.deadlines.set(deadline.id, newDeadline);
    await this.scheduleReminders(newDeadline);

    console.info(
      `⏰ Added deadline for ${deadline.grantName} - ${daysUntilDeadline} days remaining`
    );
    return newDeadline;
  }

  /**
   * Get all active deadlines
   */
  public async getActiveDeadlines(): Promise<GrantDeadline[]> {
    const activeDeadlines = Array.from(this.deadlines.values())
      .filter((d) => d.status === 'Active')
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

    return activeDeadlines;
  }

  /**
   * Get critical deadlines (less than 7 days)
   */
  public async getCriticalDeadlines(): Promise<GrantDeadline[]> {
    const criticalDeadlines = Array.from(this.deadlines.values())
      .filter((d) => d.status === 'Active' && d.daysUntilDeadline <= 7)
      .sort((a, b) => a.daysUntilDeadline - b.daysUntilDeadline);

    return criticalDeadlines;
  }

  /**
   * Update deadline status
   */
  public async updateDeadlineStatus(
    deadlineId: string,
    status: GrantDeadline['status']
  ): Promise<void> {
    const deadline = this.deadlines.get(deadlineId);
    if (deadline) {
      deadline.status = status;
      this.deadlines.set(deadlineId, deadline);
      console.info(
        `⏰ Updated deadline status for ${deadline.grantName}: ${status}`
      );
    }
  }

  /**
   * Schedule automated reminders for a deadline
   */
  private async scheduleReminders(deadline: GrantDeadline): Promise<void> {
    const reminders: DeadlineReminder[] = [];
    const now = new Date();

    // Critical reminder schedules based on days remaining
    const reminderSchedule = [
      { days: 30, message: '30-day reminder: Grant deadline approaching' },
      { days: 14, message: '2-week reminder: Grant deadline approaching' },
      {
        days: 7,
        message: '⚠️ 1-week reminder: URGENT - Grant deadline approaching',
      },
      {
        days: 3,
        message:
          '🚨 3-day reminder: CRITICAL - Grant deadline approaching soon',
      },
      { days: 1, message: '🚨 FINAL DAY: Grant deadline is TOMORROW!' },
    ];

    reminderSchedule.forEach(({ days, message }) => {
      const reminderDate = new Date(deadline.deadline);
      reminderDate.setDate(reminderDate.getDate() - days);

      if (reminderDate > now) {
        const reminder: DeadlineReminder = {
          id: `reminder-${deadline.id}-${days}d`,
          grantId: deadline.id,
          type: days <= 3 ? 'Push' : 'Email',
          message: `${message} for ${deadline.grantName}`,
          scheduledFor: reminderDate,
          sent: false,
        };
        reminders.push(reminder);
      }
    });

    this.reminders.set(deadline.id, reminders);
    console.info(
      `⏰ Scheduled ${reminders.length} reminders for ${deadline.grantName}`
    );
  }

  /**
   * Start automated monitoring loop
   */
  private startAutomatedMonitoring(): void {
    // Check deadlines every hour
    setInterval(
      () => {
        this.checkAndSendReminders();
        this.updateDeadlineStatuses();
      },
      60 * 60 * 1000
    ); // 1 hour

    // Initial check
    this.checkAndSendReminders();
    this.updateDeadlineStatuses();
  }

  /**
   * Check and send due reminders
   */
  private async checkAndSendReminders(): Promise<void> {
    const now = new Date();

    for (const [grantId, reminders] of this.reminders.entries()) {
      for (const reminder of reminders) {
        if (!reminder.sent && reminder.scheduledFor <= now) {
          await this.sendReminder(reminder);
          reminder.sent = true;
          reminder.sentAt = now;

          // Update deadline reminder count
          const deadline = this.deadlines.get(grantId);
          if (deadline) {
            deadline.remindersSent++;
            deadline.lastReminderDate = now;
            this.deadlines.set(grantId, deadline);
          }
        }
      }
    }
  }

  /**
   * Send a reminder notification
   */
  private async sendReminder(reminder: DeadlineReminder): Promise<void> {
    console.info(`📧 Sending ${reminder.type} reminder: ${reminder.message}`);

    // In production, this would integrate with:
    // - Email service (SendGrid, AWS SES)
    // - SMS service (Twilio)
    // - Push notification service (Firebase)
    // - Internal dashboard notifications

    // For now, log to console
    console.info({
      type: reminder.type,
      message: reminder.message,
      scheduledFor: reminder.scheduledFor,
      sentAt: new Date(),
    });
  }

  /**
   * Update deadline statuses based on current date
   */
  private async updateDeadlineStatuses(): Promise<void> {
    const now = new Date();

    for (const [id, deadline] of this.deadlines.entries()) {
      const daysRemaining = this.calculateDaysUntilDeadline(deadline.deadline);

      // Update days until deadline
      deadline.daysUntilDeadline = daysRemaining;

      // Update priority based on days remaining
      if (daysRemaining <= 3) {
        deadline.priority = 'Critical';
      } else if (daysRemaining <= 7) {
        deadline.priority = 'High';
      } else if (daysRemaining <= 14) {
        deadline.priority = 'Medium';
      } else {
        deadline.priority = 'Low';
      }

      // Mark as missed if deadline passed and still active
      if (deadline.status === 'Active' && deadline.deadline < now) {
        deadline.status = 'Missed';
        console.warn(`⚠️ Deadline MISSED for ${deadline.grantName}`);
      }

      this.deadlines.set(id, deadline);
    }
  }

  /**
   * Calculate days until deadline
   */
  private calculateDaysUntilDeadline(deadline: Date): number {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get upcoming reminders for a grant
   */
  public async getUpcomingReminders(
    grantId: string
  ): Promise<DeadlineReminder[]> {
    const reminders = this.reminders.get(grantId) || [];
    return reminders.filter((r) => !r.sent);
  }

  /**
   * Get reminders due today
   */
  public async getRemindersToday(): Promise<DeadlineReminder[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const allReminders: DeadlineReminder[] = [];
    for (const reminders of this.reminders.values()) {
      allReminders.push(
        ...reminders.filter(
          (r) => !r.sent && r.scheduledFor >= today && r.scheduledFor < tomorrow
        )
      );
    }

    return allReminders;
  }

  /**
   * Manual trigger to send a reminder
   */
  public async sendManualReminder(
    grantId: string,
    message: string,
    type: DeadlineReminder['type'] = 'Push'
  ): Promise<void> {
    const deadline = this.deadlines.get(grantId);
    if (!deadline) {
      throw new Error(`Deadline not found: ${grantId}`);
    }

    const reminder: DeadlineReminder = {
      id: `manual-${Date.now()}`,
      grantId,
      type,
      message,
      scheduledFor: new Date(),
      sent: true,
      sentAt: new Date(),
    };

    await this.sendReminder(reminder);

    // Add to reminders list
    const existingReminders = this.reminders.get(grantId) || [];
    existingReminders.push(reminder);
    this.reminders.set(grantId, existingReminders);

    // Update deadline
    deadline.remindersSent++;
    deadline.lastReminderDate = new Date();
    this.deadlines.set(grantId, deadline);
  }

  /**
   * Get statistics
   */
  public async getStatistics(): Promise<{
    totalDeadlines: number;
    activeDeadlines: number;
    criticalDeadlines: number;
    completedDeadlines: number;
    missedDeadlines: number;
    totalRemindersSent: number;
    upcomingReminders: number;
  }> {
    const deadlineArray = Array.from(this.deadlines.values());
    const allReminders = Array.from(this.reminders.values()).flat();

    return {
      totalDeadlines: deadlineArray.length,
      activeDeadlines: deadlineArray.filter((d) => d.status === 'Active')
        .length,
      criticalDeadlines: deadlineArray.filter(
        (d) => d.priority === 'Critical' && d.status === 'Active'
      ).length,
      completedDeadlines: deadlineArray.filter((d) => d.status === 'Completed')
        .length,
      missedDeadlines: deadlineArray.filter((d) => d.status === 'Missed')
        .length,
      totalRemindersSent: allReminders.filter((r) => r.sent).length,
      upcomingReminders: allReminders.filter((r) => !r.sent).length,
    };
  }
}

export const grantDeadlineService = GrantDeadlineService.getInstance();
export default grantDeadlineService;
