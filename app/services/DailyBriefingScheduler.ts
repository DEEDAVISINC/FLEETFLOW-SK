/**
 * Daily Briefing Scheduler Service
 * Handles automatic scheduling and delivery of morning briefings
 */

import { dailyBriefingService } from './DailyBriefingService';

export interface BriefingSchedule {
  userId: string;
  tenantId: string;
  scheduleTime: string; // "HH:MM" format
  enabled: boolean;
  daysOfWeek: number[]; // 0-6, 0 = Sunday
  timezone: string;
  lastSent?: Date;
  nextScheduled?: Date;
}

export interface SchedulerConfig {
  checkIntervalMinutes: number;
  maxConcurrentJobs: number;
  retryAttempts: number;
  retryDelayMinutes: number;
}

export class DailyBriefingScheduler {
  private schedules: Map<string, BriefingSchedule> = new Map();
  private activeJobs: Set<string> = new Set();
  private checkInterval: NodeJS.Timeout | null = null;
  private config: SchedulerConfig;
  private isRunning: boolean = false;

  constructor(
    config: SchedulerConfig = {
      checkIntervalMinutes: 5,
      maxConcurrentJobs: 10,
      retryAttempts: 3,
      retryDelayMinutes: 5,
    }
  ) {
    this.config = config;
    this.initializeDefaultSchedules();
  }

  /**
   * Start the scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.info('📅 Daily Briefing Scheduler is already running');
      return;
    }

    console.info('🚀 Starting Daily Briefing Scheduler...');

    this.isRunning = true;
    this.checkInterval = setInterval(
      () => {
        this.checkAndExecuteSchedules();
      },
      this.config.checkIntervalMinutes * 60 * 1000
    );

    // Initial check
    setTimeout(() => {
      this.checkAndExecuteSchedules();
    }, 1000);

    console.info(
      `✅ Daily Briefing Scheduler started - checking every ${this.config.checkIntervalMinutes} minutes`
    );
  }

  /**
   * Stop the scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      console.info('📅 Daily Briefing Scheduler is not running');
      return;
    }

    console.info('🛑 Stopping Daily Briefing Scheduler...');

    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    this.isRunning = false;
    console.info('✅ Daily Briefing Scheduler stopped');
  }

  /**
   * Add or update a briefing schedule
   */
  addSchedule(schedule: BriefingSchedule): void {
    const key = `${schedule.userId}_${schedule.tenantId}`;

    // Calculate next scheduled time
    schedule.nextScheduled = this.calculateNextScheduledTime(schedule);

    this.schedules.set(key, schedule);
    console.info(
      `📝 Added/Updated schedule for user: ${schedule.userId}, next: ${schedule.nextScheduled}`
    );
  }

  /**
   * Remove a briefing schedule
   */
  removeSchedule(userId: string, tenantId: string): void {
    const key = `${userId}_${tenantId}`;
    const removed = this.schedules.delete(key);

    if (removed) {
      console.info(`🗑️ Removed schedule for user: ${userId}`);
    }
  }

  /**
   * Get all active schedules
   */
  getSchedules(): BriefingSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get schedule for a specific user
   */
  getSchedule(userId: string, tenantId: string): BriefingSchedule | undefined {
    const key = `${userId}_${tenantId}`;
    return this.schedules.get(key);
  }

  /**
   * Update user's briefing preferences
   */
  updateSchedule(
    userId: string,
    tenantId: string,
    updates: Partial<BriefingSchedule>
  ): void {
    const key = `${userId}_${tenantId}`;
    const existing = this.schedules.get(key);

    if (existing) {
      const updated = { ...existing, ...updates };
      updated.nextScheduled = this.calculateNextScheduledTime(updated);
      this.schedules.set(key, updated);
      console.info(`🔄 Updated schedule for user: ${userId}`);
    }
  }

  /**
   * Manually trigger a briefing for a user
   */
  async triggerBriefing(userId: string, tenantId: string): Promise<boolean> {
    const schedule = this.getSchedule(userId, tenantId);

    if (!schedule || !schedule.enabled) {
      console.warn(
        `⚠️ Cannot trigger briefing - schedule not found or disabled for user: ${userId}`
      );
      return false;
    }

    const jobId = `${userId}_${tenantId}_${Date.now()}`;

    if (this.activeJobs.size >= this.config.maxConcurrentJobs) {
      console.warn(
        '⚠️ Max concurrent jobs reached, skipping briefing generation'
      );
      return false;
    }

    this.activeJobs.add(jobId);

    try {
      console.info(`🎯 Manually triggering briefing for user: ${userId}`);

      await dailyBriefingService.generateDailyBriefing(userId, tenantId);
      await dailyBriefingService.sendDailyBriefing(
        await dailyBriefingService.generateDailyBriefing(userId, tenantId)
      );

      // Update last sent time
      schedule.lastSent = new Date();
      schedule.nextScheduled = this.calculateNextScheduledTime(schedule);
      this.schedules.set(`${userId}_${tenantId}`, schedule);

      console.info(`✅ Manual briefing sent successfully for user: ${userId}`);
      return true;
    } catch (error) {
      console.error(
        `❌ Error sending manual briefing for user ${userId}:`,
        error
      );
      return false;
    } finally {
      this.activeJobs.delete(jobId);
    }
  }

  private async checkAndExecuteSchedules(): Promise<void> {
    if (!this.isRunning) return;

    const now = new Date();
    console.info(
      `🔍 Checking schedules at ${now.toISOString()} (${this.schedules.size} active schedules)`
    );

    for (const [key, schedule] of this.schedules.entries()) {
      if (!schedule.enabled) continue;
      if (this.activeJobs.size >= this.config.maxConcurrentJobs) break;

      if (this.shouldExecuteSchedule(schedule, now)) {
        await this.executeSchedule(schedule, key);
      }
    }
  }

  private shouldExecuteSchedule(
    schedule: BriefingSchedule,
    now: Date
  ): boolean {
    if (!schedule.nextScheduled) return false;

    // Check if it's time to send
    if (now < schedule.nextScheduled) return false;

    // Check if it's the right day of the week
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    if (!schedule.daysOfWeek.includes(dayOfWeek)) return false;

    // Check if we haven't sent one too recently (prevent duplicates)
    if (schedule.lastSent) {
      const timeSinceLastSent = now.getTime() - schedule.lastSent.getTime();
      const minimumInterval = 60 * 60 * 1000; // 1 hour minimum between briefings
      if (timeSinceLastSent < minimumInterval) return false;
    }

    return true;
  }

  private async executeSchedule(
    schedule: BriefingSchedule,
    key: string
  ): Promise<void> {
    if (this.activeJobs.has(key)) {
      console.info(
        `⏳ Briefing already in progress for user: ${schedule.userId}`
      );
      return;
    }

    this.activeJobs.add(key);

    try {
      console.info(
        `🚀 Executing scheduled briefing for user: ${schedule.userId} at ${schedule.scheduleTime}`
      );

      const briefingData = await dailyBriefingService.generateDailyBriefing(
        schedule.userId,
        schedule.tenantId
      );

      await dailyBriefingService.sendDailyBriefing(briefingData);

      // Update schedule metadata
      schedule.lastSent = new Date();
      schedule.nextScheduled = this.calculateNextScheduledTime(schedule);
      this.schedules.set(key, schedule);

      console.info(
        `✅ Scheduled briefing sent successfully for user: ${schedule.userId}, next: ${schedule.nextScheduled}`
      );
    } catch (error) {
      console.error(
        `❌ Error executing scheduled briefing for user ${schedule.userId}:`,
        error
      );

      // Implement retry logic
      await this.handleScheduleError(schedule, key, error);
    } finally {
      this.activeJobs.delete(key);
    }
  }

  private async handleScheduleError(
    schedule: BriefingSchedule,
    key: string,
    error: any
  ): Promise<void> {
    // Simple retry logic - in production, you might want more sophisticated error handling
    console.warn(`⚠️ Handling error for schedule ${key}, error:`, error);

    // For now, just reschedule for next time
    schedule.nextScheduled = this.calculateNextScheduledTime(schedule);
    this.schedules.set(key, schedule);
  }

  private calculateNextScheduledTime(schedule: BriefingSchedule): Date {
    const now = new Date();
    const [hours, minutes] = schedule.scheduleTime.split(':').map(Number);
    const targetTime = new Date(now);

    targetTime.setHours(hours, minutes, 0, 0);

    // If target time has passed today, schedule for tomorrow
    if (targetTime <= now) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    // Find next valid day of week
    let daysToAdd = 0;
    const targetDayOfWeek = targetTime.getDay();

    while (
      !schedule.daysOfWeek.includes(targetDayOfWeek + daysToAdd) &&
      daysToAdd < 7
    ) {
      daysToAdd++;
    }

    if (daysToAdd > 0) {
      targetTime.setDate(targetTime.getDate() + daysToAdd);
    }

    return targetTime;
  }

  private initializeDefaultSchedules(): void {
    // Initialize with some default demo schedules
    // In production, these would be loaded from database
    const defaultSchedules: BriefingSchedule[] = [
      {
        userId: 'demo_user',
        tenantId: 'demo_tenant',
        scheduleTime: '08:00',
        enabled: true,
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        timezone: 'America/New_York',
      },
      {
        userId: 'dispatcher_1',
        tenantId: 'fleetflow_main',
        scheduleTime: '07:30',
        enabled: true,
        daysOfWeek: [1, 2, 3, 4, 5, 6], // Monday to Saturday
        timezone: 'America/New_York',
      },
    ];

    for (const schedule of defaultSchedules) {
      const key = `${schedule.userId}_${schedule.tenantId}`;
      schedule.nextScheduled = this.calculateNextScheduledTime(schedule);
      this.schedules.set(key, schedule);
    }

    console.info(
      `📝 Initialized ${defaultSchedules.length} default briefing schedules`
    );
  }

  /**
   * Get scheduler statistics
   */
  getStats(): {
    isRunning: boolean;
    activeSchedules: number;
    activeJobs: number;
    nextScheduledBriefings: { userId: string; scheduledTime: Date }[];
  } {
    const nextBriefings = Array.from(this.schedules.values())
      .filter((s) => s.enabled && s.nextScheduled)
      .sort((a, b) => a.nextScheduled!.getTime() - b.nextScheduled!.getTime())
      .slice(0, 5)
      .map((s) => ({
        userId: s.userId,
        scheduledTime: s.nextScheduled!,
      }));

    return {
      isRunning: this.isRunning,
      activeSchedules: this.schedules.size,
      activeJobs: this.activeJobs.size,
      nextScheduledBriefings: nextBriefings,
    };
  }
}

// Export singleton instance
export const dailyBriefingScheduler = new DailyBriefingScheduler();

