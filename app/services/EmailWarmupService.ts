/**
 * FleetFlow Email Warm-up Service
 * Systematically builds email reputation for cold outreach campaigns
 * Gradually increases sending volume while monitoring deliverability metrics
 */

import { EmailOptions, EmailResult, sendGridService } from './sendgrid-service';

export interface WarmupAccount {
  email: string;
  name: string;
  type: 'internal' | 'friendly' | 'test'; // internal = our company, friendly = partners who agreed to help, test = test accounts
  autoRespond: boolean; // Whether this account will automatically reply
  openRate: number; // 0-1 probability of opening emails
  clickRate: number; // 0-1 probability of clicking links
}

export interface WarmupSchedule {
  day: number; // Day in warm-up process
  dailyVolume: number; // Number of emails to send that day
  targetDomains: 'internal' | 'friendly' | 'mixed' | 'all'; // Who to contact on this day
}

export interface WarmupMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  complained: number;
  dayComplete: boolean;
}

interface WarmupConfig {
  sendingDomain: string;
  fromEmail: string;
  fromName: string;
  maxDailyVolume: number;
  warmupDuration: number; // days
  scheduleTemplate?: WarmupSchedule[];
  friendly_accounts?: WarmupAccount[];
}

export class EmailWarmupService {
  private schedule: WarmupSchedule[] = [];
  private friendlyAccounts: WarmupAccount[] = [];
  private currentDay: number = 0;
  private metrics: Record<number, WarmupMetrics> = {};
  private isActive: boolean = false;
  private sendingDomain: string;
  private fromEmail: string;
  private fromName: string;

  constructor(config: WarmupConfig) {
    this.sendingDomain = config.sendingDomain;
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName;

    if (config.scheduleTemplate) {
      this.schedule = config.scheduleTemplate;
    } else {
      this.generateDefaultSchedule(
        config.warmupDuration,
        config.maxDailyVolume
      );
    }

    if (config.friendly_accounts) {
      this.friendlyAccounts = config.friendly_accounts;
    } else {
      this.loadDefaultFriendlyAccounts();
    }

    console.log('📧 Email Warm-up Service initialized');
  }

  /**
   * Start the email warm-up process
   */
  async startWarmup(): Promise<boolean> {
    if (this.isActive) {
      console.log('⚠️ Warm-up already in progress');
      return false;
    }

    console.log('🚀 Starting email warm-up process');
    this.isActive = true;
    this.currentDay = 0;

    // Initialize metrics for day 0
    this.metrics[0] = this.createEmptyMetrics();

    // Schedule daily warm-up job
    this.scheduleNextWarmupDay();

    return true;
  }

  /**
   * Stop the warm-up process
   */
  stopWarmup(): boolean {
    if (!this.isActive) {
      console.log('⚠️ No warm-up currently active');
      return false;
    }

    console.log('🛑 Stopping email warm-up process');
    this.isActive = false;
    return true;
  }

  /**
   * Get current warm-up status and metrics
   */
  getWarmupStatus(): {
    isActive: boolean;
    currentDay: number;
    schedule: WarmupSchedule;
    metrics: WarmupMetrics;
    overallStats: {
      deliverability: number;
      engagement: number;
      progress: number;
    };
  } {
    const currentSchedule = this.schedule[this.currentDay] || this.schedule[0];
    const currentMetrics =
      this.metrics[this.currentDay] || this.createEmptyMetrics();

    // Calculate overall statistics
    const allMetrics = Object.values(this.metrics);
    const totalSent = allMetrics.reduce((sum, day) => sum + day.sent, 0);
    const totalDelivered = allMetrics.reduce(
      (sum, day) => sum + day.delivered,
      0
    );
    const totalOpened = allMetrics.reduce((sum, day) => sum + day.opened, 0);
    const totalClicked = allMetrics.reduce((sum, day) => sum + day.clicked, 0);

    const deliverability = totalSent > 0 ? totalDelivered / totalSent : 0;
    const engagement =
      totalDelivered > 0
        ? (totalOpened + totalClicked) / (totalDelivered * 2)
        : 0;
    const progress =
      this.schedule.length > 0 ? this.currentDay / this.schedule.length : 0;

    return {
      isActive: this.isActive,
      currentDay: this.currentDay,
      schedule: currentSchedule,
      metrics: currentMetrics,
      overallStats: {
        deliverability: Math.round(deliverability * 100),
        engagement: Math.round(engagement * 100),
        progress: Math.round(progress * 100),
      },
    };
  }

  /**
   * Execute one day's worth of warm-up emails
   */
  async executeWarmupDay(): Promise<WarmupMetrics> {
    if (!this.isActive) {
      console.log('⚠️ Warm-up is not active');
      throw new Error('Warm-up process is not active');
    }

    const schedule = this.schedule[this.currentDay];
    if (!schedule) {
      console.log('✅ Warm-up process complete!');
      this.isActive = false;
      return this.metrics[this.currentDay] || this.createEmptyMetrics();
    }

    console.log(
      `📧 Executing warm-up day ${this.currentDay + 1}: ${schedule.dailyVolume} emails`
    );

    // Get appropriate accounts for this day's schedule
    const targetAccounts = this.getTargetAccountsForDay(schedule);

    // Initialize metrics for today
    this.metrics[this.currentDay] = this.createEmptyMetrics();

    // Send warm-up emails
    const results: EmailResult[] = [];

    for (
      let i = 0;
      i < Math.min(schedule.dailyVolume, targetAccounts.length);
      i++
    ) {
      const account = targetAccounts[i];

      const emailOptions = this.createWarmupEmail(account, this.currentDay);
      const result = await this.sendWarmupEmail(emailOptions);
      results.push(result);

      // Update metrics based on result
      this.updateMetricsWithResult(this.currentDay, result);

      // Add a small delay between emails to avoid sending bursts
      await this.delay(Math.floor(Math.random() * 30000) + 15000); // 15-45 seconds
    }

    // Mark day as complete
    this.metrics[this.currentDay].dayComplete = true;

    // Schedule next day's warm-up
    this.currentDay++;
    if (this.currentDay < this.schedule.length) {
      this.scheduleNextWarmupDay();
    } else {
      console.log('🎉 Email warm-up process complete!');
      this.isActive = false;
    }

    return this.metrics[this.currentDay - 1];
  }

  /**
   * Add a friendly account to help with warm-up
   */
  addFriendlyAccount(account: WarmupAccount): boolean {
    if (this.friendlyAccounts.find((a) => a.email === account.email)) {
      return false; // Account already exists
    }

    this.friendlyAccounts.push(account);
    return true;
  }

  /**
   * Generate a default warm-up schedule
   */
  private generateDefaultSchedule(days: number, maxVolume: number): void {
    this.schedule = [];

    // Start with very low volume and gradually increase
    // Follow S-curve for natural progression
    for (let day = 0; day < days; day++) {
      // Day progress from 0 to 1
      const x = day / (days - 1);

      // S-curve formula: volume increases slowly at first, then rapidly in the middle, then slows down
      const volumePercentage = 1 / (1 + Math.exp(-10 * (x - 0.5)));
      const dailyVolume = Math.max(5, Math.floor(volumePercentage * maxVolume));

      // Determine who to target based on the day
      let targetDomains: 'internal' | 'friendly' | 'mixed' | 'all';

      if (day < days * 0.2) {
        targetDomains = 'internal'; // First 20% - just internal accounts
      } else if (day < days * 0.5) {
        targetDomains = 'friendly'; // Next 30% - friendly accounts
      } else if (day < days * 0.8) {
        targetDomains = 'mixed'; // Next 30% - mix of friendly and new domains
      } else {
        targetDomains = 'all'; // Final 20% - all domains
      }

      this.schedule.push({
        day: day + 1,
        dailyVolume,
        targetDomains,
      });
    }
  }

  /**
   * Load default friendly accounts for testing
   */
  private loadDefaultFriendlyAccounts(): void {
    // Add some test accounts for development
    this.friendlyAccounts = [
      {
        email: 'test1@fleetflow.com',
        name: 'Test Account 1',
        type: 'internal',
        autoRespond: true,
        openRate: 1.0,
        clickRate: 0.8,
      },
      {
        email: 'test2@fleetflow.com',
        name: 'Test Account 2',
        type: 'internal',
        autoRespond: true,
        openRate: 1.0,
        clickRate: 0.9,
      },
      {
        email: 'friendly1@partner.com',
        name: 'Friendly Partner 1',
        type: 'friendly',
        autoRespond: true,
        openRate: 0.9,
        clickRate: 0.7,
      },
    ];

    // In a real implementation, these would come from a database
    console.log(
      `Loaded ${this.friendlyAccounts.length} friendly accounts for warm-up`
    );
  }

  /**
   * Create an empty metrics object for a day
   */
  private createEmptyMetrics(): WarmupMetrics {
    return {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      replied: 0,
      bounced: 0,
      complained: 0,
      dayComplete: false,
    };
  }

  /**
   * Update metrics based on email result
   */
  private updateMetricsWithResult(day: number, result: EmailResult): void {
    const metrics = this.metrics[day];

    if (!metrics) return;

    metrics.sent += 1;

    if (result.success) {
      metrics.delivered += 1;

      // Simulate opens and clicks based on probabilities
      // In a real implementation, these would come from webhook tracking
      if (Math.random() < 0.7) {
        // 70% open rate for warm-up emails
        metrics.opened += 1;

        if (Math.random() < 0.4) {
          // 40% click rate for opened emails
          metrics.clicked += 1;
        }
      }
    } else {
      metrics.bounced += 1;
    }
  }

  /**
   * Get target accounts for a specific day's schedule
   */
  private getTargetAccountsForDay(schedule: WarmupSchedule): WarmupAccount[] {
    // Select appropriate accounts based on the day's target
    let accounts: WarmupAccount[] = [];

    switch (schedule.targetDomains) {
      case 'internal':
        accounts = this.friendlyAccounts.filter((a) => a.type === 'internal');
        break;
      case 'friendly':
        accounts = this.friendlyAccounts.filter(
          (a) => a.type === 'internal' || a.type === 'friendly'
        );
        break;
      case 'mixed':
        accounts = this.friendlyAccounts;
        break;
      case 'all':
        accounts = this.friendlyAccounts;
        // Would also include actual prospect accounts here in production
        break;
    }

    // Shuffle the accounts to randomize sending
    return this.shuffleArray([...accounts]);
  }

  /**
   * Create a warm-up email for a specific account
   */
  private createWarmupEmail(account: WarmupAccount, day: number): EmailOptions {
    // Generate warm-up content based on the day
    const subject = `Warm-up Test Email ${day + 1} - ${new Date().toLocaleDateString()}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Warm-up Test</h2>
        <p>Hello ${account.name},</p>
        <p>This is a test email for our warm-up process (Day ${day + 1}).</p>
        <p>Please ignore this email or mark it as important to help with deliverability.</p>
        <p><a href="https://app.fleetflowapp.com/email-tracking?id=${Date.now()}&recipient=${encodeURIComponent(account.email)}">Click here to register engagement</a></p>
        <p>Best regards,<br>${this.fromName}<br>FleetFlow Team</p>
      </div>
    `;

    const text = `
      Email Warm-up Test

      Hello ${account.name},

      This is a test email for our warm-up process (Day ${day + 1}).
      Please ignore this email or mark it as important to help with deliverability.

      Best regards,
      ${this.fromName}
      FleetFlow Team
    `;

    return {
      to: { email: account.email, name: account.name },
      template: { subject, html, text },
      category: 'email_warmup',
      customArgs: {
        warmup_day: day.toString(),
        account_type: account.type,
      },
    };
  }

  /**
   * Send a warm-up email via SendGrid
   */
  private async sendWarmupEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const result = await sendGridService.sendEmail(options);
      return result;
    } catch (error) {
      console.error('Failed to send warm-up email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Schedule the next day's warm-up emails
   */
  private scheduleNextWarmupDay(): void {
    // In a production environment, you would use a proper scheduler
    // For this implementation, we'll just log that it should be scheduled
    console.log(
      `📅 Scheduled next warm-up day ${this.currentDay + 1} for tomorrow`
    );

    // In practice, you might use:
    // 1. setTimeout for development/testing
    // 2. A cron job in production
    // 3. A task queue like Bull or a cloud scheduler
  }

  /**
   * Utility: Shuffle array for randomizing accounts
   */
  private shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Utility: Promise-based delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance with default configuration
export const emailWarmupService = new EmailWarmupService({
  sendingDomain: 'fleetflowapp.com',
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'marketing@fleetflowapp.com',
  fromName: 'FleetFlow Marketing',
  maxDailyVolume: 100,
  warmupDuration: 30, // 30-day warm-up process
});
