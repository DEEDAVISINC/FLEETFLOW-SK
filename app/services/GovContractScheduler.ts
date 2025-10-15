/**
 * Government Contract Scanner - Automated Scheduling System
 * Runs 24/7 scans on defined schedule
 */

import cron from 'node-cron';

class GovContractScheduler {
  private jobs: Map<string, cron.ScheduledTask>;
  private apiBaseUrl: string;

  constructor(apiBaseUrl: string = 'http://localhost:3001') {
    this.jobs = new Map();
    this.apiBaseUrl = apiBaseUrl;
  }

  /**
   * Initialize all scheduled scanning jobs
   */
  initializeScheduledScans(): void {
    console.log('🚀 Initializing Government Contract Scanner automation...');

    // CRITICAL: SAM.gov Sources Sought - Every 2 hours
    this.scheduleJob(
      'sources-sought-scan',
      '0 */2 * * *', // Every 2 hours at :00 minutes
      async () => {
        console.log('🔍 Running Sources Sought priority scan...');
        await this.triggerScan({
          priority: 'sources-sought',
          setAsides: ['WOSB', 'SBA'],
        });
      }
    );

    // HIGH PRIORITY: SAM.gov Full Scan - Every 4 hours
    this.scheduleJob(
      'samgov-full-scan',
      '0 */4 * * *', // Every 4 hours at :00 minutes
      async () => {
        console.log('📡 Running SAM.gov full scan...');
        await this.triggerScan({
          source: 'samgov',
        });
      }
    );

    // DAILY: Michigan SIGMA VSS - 8 AM EST
    this.scheduleJob(
      'michigan-scan',
      '0 8 * * *', // Daily at 8 AM
      async () => {
        console.log('🏛️ Running Michigan state procurement scan...');
        await this.triggerScan({
          source: 'michigan',
          states: ['MI'],
        });
      }
    );

    // DAILY: High-Value Opportunities Check - 9 AM EST
    this.scheduleJob(
      'high-value-scan',
      '0 9 * * *', // Daily at 9 AM
      async () => {
        console.log('💰 Running high-value opportunities scan...');
        await this.triggerScan({
          minValue: 500000,
          maxValue: 10000000,
        });
      }
    );

    // WEEKLY: Comprehensive Multi-Source Scan - Monday 6 AM EST
    this.scheduleJob(
      'weekly-comprehensive',
      '0 6 * * 1', // Monday at 6 AM
      async () => {
        console.log('🌐 Running comprehensive multi-source scan...');
        await this.triggerScan({
          comprehensive: true,
        });
      }
    );

    // HOURLY: Urgent/Deadline Check - Every hour
    this.scheduleJob(
      'urgent-deadline-check',
      '0 * * * *', // Every hour at :00 minutes
      async () => {
        console.log('⚡ Checking for urgent deadlines...');
        await this.triggerScan({
          urgentOnly: true,
          deadlineWithin: 24, // 24 hours
        });
      }
    );

    // DAILY: WOSB Set-Aside Priority Scan - 7 AM EST
    this.scheduleJob(
      'wosb-priority-scan',
      '0 7 * * *', // Daily at 7 AM
      async () => {
        console.log('👩‍💼 Running WOSB set-aside priority scan...');
        await this.triggerScan({
          setAsides: ['WOSB'],
          priority: 'critical',
        });
      }
    );

    console.log('✅ All automated scans scheduled successfully');
    this.listScheduledJobs();
  }

  /**
   * Schedule a new cron job
   */
  private scheduleJob(
    name: string,
    cronExpression: string,
    task: () => Promise<void>
  ): void {
    try {
      const job = cron.schedule(
        cronExpression,
        async () => {
          console.log(`⏰ Executing scheduled job: ${name}`);
          try {
            await task();
            console.log(`✅ Completed job: ${name}`);
          } catch (error) {
            console.error(`❌ Error in job ${name}:`, error);
          }
        },
        {
          scheduled: true,
          timezone: 'America/New_York', // EST/EDT
        }
      );

      this.jobs.set(name, job);
      console.log(`📅 Scheduled: ${name} (${cronExpression})`);
    } catch (error) {
      console.error(`❌ Failed to schedule job ${name}:`, error);
    }
  }

  /**
   * Trigger a scan via API call
   */
  private async triggerScan(params: any = {}): Promise<void> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/api/gov-contract-scan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }

      const data = await response.json();
      console.log(
        `📊 Scan results: ${data.summary?.total || 0} opportunities found`
      );

      if (data.summary?.highPriority > 0) {
        console.log(
          `🎯 High priority: ${data.summary.highPriority} opportunities`
        );
      }
    } catch (error) {
      console.error('❌ Failed to trigger scan:', error);
    }
  }

  /**
   * List all scheduled jobs
   */
  listScheduledJobs(): void {
    console.log('\n📋 Active Scheduled Jobs:');
    console.log('═══════════════════════════════════════════════════════');

    const jobDescriptions = {
      'sources-sought-scan': 'Every 2 hours - Sources Sought Priority',
      'samgov-full-scan': 'Every 4 hours - SAM.gov Full Scan',
      'michigan-scan': 'Daily 8 AM EST - Michigan State Procurement',
      'high-value-scan': 'Daily 9 AM EST - High-Value Opportunities',
      'weekly-comprehensive':
        'Weekly Monday 6 AM EST - Comprehensive Multi-Source',
      'urgent-deadline-check': 'Every hour - Urgent Deadline Check',
      'wosb-priority-scan': 'Daily 7 AM EST - WOSB Set-Aside Priority',
    };

    this.jobs.forEach((job, name) => {
      const status = job ? '✅ Active' : '❌ Inactive';
      const description = jobDescriptions[name] || 'No description';
      console.log(`${status} | ${name}: ${description}`);
    });

    console.log('═══════════════════════════════════════════════════════\n');
  }

  /**
   * Stop a specific job
   */
  stopJob(name: string): boolean {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      console.log(`🛑 Stopped job: ${name}`);
      return true;
    }
    console.warn(`⚠️ Job not found: ${name}`);
    return false;
  }

  /**
   * Stop all jobs
   */
  stopAllJobs(): void {
    console.log('🛑 Stopping all scheduled jobs...');
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`🛑 Stopped: ${name}`);
    });
    this.jobs.clear();
    console.log('✅ All jobs stopped');
  }

  /**
   * Manually trigger a specific scan type
   */
  async manualScan(scanType: string): Promise<void> {
    console.log(`🔍 Manual scan triggered: ${scanType}`);

    const scanConfigs: Record<string, any> = {
      'sources-sought': {
        priority: 'sources-sought',
        setAsides: ['WOSB', 'SBA'],
      },
      'wosb-priority': {
        setAsides: ['WOSB'],
        priority: 'critical',
      },
      michigan: {
        source: 'michigan',
        states: ['MI'],
      },
      'high-value': {
        minValue: 500000,
        maxValue: 10000000,
      },
      comprehensive: {
        comprehensive: true,
      },
    };

    const config = scanConfigs[scanType] || {};
    await this.triggerScan(config);
  }

  /**
   * Get status of all scheduled jobs
   */
  getStatus(): {
    totalJobs: number;
    activeJobs: number;
    jobs: Array<{ name: string; active: boolean }>;
  } {
    const jobsList: Array<{ name: string; active: boolean }> = [];

    this.jobs.forEach((job, name) => {
      jobsList.push({
        name,
        active: true, // If in map, it's active
      });
    });

    return {
      totalJobs: this.jobs.size,
      activeJobs: this.jobs.size,
      jobs: jobsList,
    };
  }
}

// Singleton instance
let schedulerInstance: GovContractScheduler | null = null;

export function getScheduler(apiBaseUrl?: string): GovContractScheduler {
  if (!schedulerInstance) {
    schedulerInstance = new GovContractScheduler(apiBaseUrl);
  }
  return schedulerInstance;
}

export default GovContractScheduler;


