/**
 * Automated Automotive RFP Discovery Workflow
 * Runs scheduled discovery, analysis, and notification processes
 */

import AutomotiveRFPDiscoveryService from './AutomotiveRFPDiscoveryService';

export class AutomotiveRFPWorkflow {
  private discoveryService: AutomotiveRFPDiscoveryService;
  private scheduledTasks: NodeJS.Timeout[];
  private isRunning: boolean = false;

  constructor() {
    this.discoveryService = new AutomotiveRFPDiscoveryService();
    this.scheduledTasks = [];
    this.initializeScheduledTasks();
  }

  /**
   * Initialize scheduled discovery tasks
   */
  private initializeScheduledTasks(): void {
    if (this.isRunning) {
      console.info('⚠️ Automotive RFP workflows already running');
      return;
    }

    // Daily comprehensive discovery (6 AM EST = 11 AM UTC)
    const dailyDiscovery = setInterval(async () => {
      const now = new Date();
      if (now.getUTCHours() === 11 && now.getUTCMinutes() === 0) {
        await this.runDailyDiscovery();
      }
    }, 60000); // Check every minute

    // Hourly high-priority OEM monitoring
    const hourlyHighPriority = setInterval(async () => {
      const now = new Date();
      if (now.getUTCMinutes() === 0) {
        // Top of every hour
        await this.runHighPriorityMonitoring();
      }
    }, 60000); // Check every minute

    // Weekly comprehensive analysis and reporting (Monday 8 AM EST = 13 PM UTC)
    const weeklyAnalysis = setInterval(async () => {
      const now = new Date();
      if (
        now.getUTCDay() === 1 &&
        now.getUTCHours() === 13 &&
        now.getUTCMinutes() === 0
      ) {
        await this.runWeeklyAnalysis();
      }
    }, 60000); // Check every minute

    this.scheduledTasks = [dailyDiscovery, hourlyHighPriority, weeklyAnalysis];
    this.isRunning = true;

    console.info('🚛 Automotive RFP automation workflows initialized');
    console.info('📅 Daily Discovery: 6 AM EST');
    console.info('⚡ Hourly High-Priority: Every hour');
    console.info('📊 Weekly Analysis: Monday 8 AM EST');
  }

  /**
   * Start automated workflows manually
   */
  startWorkflows(): void {
    if (!this.isRunning) {
      this.initializeScheduledTasks();
    } else {
      console.info('✅ Automotive RFP workflows already running');
    }
  }

  /**
   * Stop all scheduled workflows
   */
  stopWorkflows(): void {
    this.scheduledTasks.forEach((task) => clearInterval(task));
    this.scheduledTasks = [];
    this.isRunning = false;
    console.info('🛑 Automotive RFP workflows stopped');
  }

  /**
   * Run immediate discovery for testing/manual execution
   */
  async runImmediateDiscovery(userId: string = 'manual-discovery'): Promise<{
    opportunities: any[];
    notificationsSent: number;
    sourcesScanned: number;
    executionTime: number;
  }> {
    console.info('🔥 Running immediate automotive RFP discovery...');

    const startTime = Date.now();
    const result =
      await this.discoveryService.discoverAutomotiveOpportunities(userId);
    const executionTime = Date.now() - startTime;

    console.info(`⚡ Immediate discovery complete in ${executionTime}ms`);

    return {
      ...result,
      executionTime,
    };
  }

  /**
   * Daily comprehensive automotive RFP discovery
   */
  async runDailyDiscovery(): Promise<void> {
    try {
      console.info('🌅 Starting daily automotive RFP discovery...');

      const startTime = Date.now();

      // Run discovery for all configured users/teams
      const discoveryUsers = [
        'automotive-team',
        'logistics-managers',
        'dispatch-central',
        'broker-operations',
        'rfx-specialists',
      ];

      const results = await Promise.allSettled(
        discoveryUsers.map((userId) =>
          this.discoveryService.discoverAutomotiveOpportunities(userId)
        )
      );

      // Aggregate results
      let totalOpportunities = 0;
      let totalNotifications = 0;
      let successfulScans = 0;
      let failedScans = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          totalOpportunities += result.value.opportunities.length;
          totalNotifications += result.value.notificationsSent;
          successfulScans++;
          console.info(
            `✅ User ${discoveryUsers[index]}: ${result.value.opportunities.length} opportunities found`
          );
        } else {
          failedScans++;
          console.error(
            `❌ Discovery failed for ${discoveryUsers[index]}:`,
            result.reason
          );
        }
      });

      const duration = Date.now() - startTime;

      // Log comprehensive daily summary
      console.info('📈 DAILY AUTOMOTIVE RFP DISCOVERY SUMMARY');
      console.info(`🎯 Total Opportunities Found: ${totalOpportunities}`);
      console.info(`📨 Notifications Sent: ${totalNotifications}`);
      console.info(
        `✅ Successful Scans: ${successfulScans}/${discoveryUsers.length}`
      );
      console.info(`❌ Failed Scans: ${failedScans}/${discoveryUsers.length}`);
      console.info(`⏱️ Total Execution Time: ${duration}ms`);
      console.info(`📅 Completed: ${new Date().toISOString()}`);

      // Store daily metrics for reporting
      await this.storeDailyMetrics({
        date: new Date().toISOString().split('T')[0],
        totalOpportunities,
        totalNotifications,
        successfulScans,
        failedScans,
        executionTime: duration,
        discoveryUsers: discoveryUsers.length,
      });
    } catch (error) {
      console.error('❌ Daily automotive discovery failed:', error);

      // Send alert for failed daily discovery
      await this.sendFailureAlert('Daily Discovery', error);
    }
  }

  /**
   * Hourly high-priority OEM monitoring
   */
  async runHighPriorityMonitoring(): Promise<void> {
    try {
      console.info('⚡ High-priority OEM monitoring...');

      const startTime = Date.now();

      // Focus on Tesla, Ford, and other high-frequency OEMs
      const result =
        await this.discoveryService.discoverAutomotiveOpportunities(
          'high-priority-monitor'
        );

      // Filter for urgent opportunities (response deadline < 48 hours)
      const urgentOpportunities = result.opportunities.filter((opp) => {
        const hoursUntilDeadline =
          (opp.responseDeadline.getTime() - Date.now()) / (1000 * 60 * 60);
        return hoursUntilDeadline < 48;
      });

      // Filter for high-value opportunities (>$2M)
      const highValueOpportunities = result.opportunities.filter(
        (opp) => opp.estimatedValue >= 2000000
      );

      const duration = Date.now() - startTime;

      if (urgentOpportunities.length > 0 || highValueOpportunities.length > 0) {
        console.info('🚨 HIGH-PRIORITY AUTOMOTIVE OPPORTUNITIES DETECTED');
        console.info(
          `⏰ Urgent (< 48hrs): ${urgentOpportunities.length} opportunities`
        );
        console.info(
          `💰 High-Value (>$2M): ${highValueOpportunities.length} opportunities`
        );

        // Send immediate escalation notifications
        await this.sendHighPriorityAlerts(
          urgentOpportunities,
          highValueOpportunities
        );
      }

      console.info(`⚡ High-priority monitoring complete (${duration}ms)`);
    } catch (error) {
      console.error('❌ High-priority monitoring failed:', error);
    }
  }

  /**
   * Weekly comprehensive analysis and reporting
   */
  async runWeeklyAnalysis(): Promise<void> {
    try {
      console.info('📊 Running weekly automotive RFP analysis...');

      const startTime = Date.now();

      // Comprehensive discovery for analysis
      const analysisResult =
        await this.discoveryService.discoverAutomotiveOpportunities(
          'weekly-analysis'
        );

      // Generate comprehensive weekly report
      const weeklyReport = await this.generateWeeklyReport(analysisResult);

      const duration = Date.now() - startTime;

      console.info('📈 WEEKLY AUTOMOTIVE RFP ANALYSIS COMPLETE');
      console.info(`📊 Analysis Duration: ${duration}ms`);
      console.info(
        `🎯 Opportunities Analyzed: ${analysisResult.opportunities.length}`
      );
      console.info(`📅 Report Generated: ${new Date().toISOString()}`);

      // Store weekly report
      await this.storeWeeklyReport(weeklyReport);
    } catch (error) {
      console.error('❌ Weekly analysis failed:', error);
      await this.sendFailureAlert('Weekly Analysis', error);
    }
  }

  /**
   * Generate comprehensive weekly report
   */
  private async generateWeeklyReport(discoveryResult: any): Promise<{
    summary: any;
    topOpportunities: any[];
    oemBreakdown: Record<string, number>;
    industryTrends: any;
    recommendations: string[];
  }> {
    const opportunities = discoveryResult.opportunities;

    // Calculate summary metrics
    const summary = {
      totalOpportunities: opportunities.length,
      totalValue: opportunities.reduce(
        (sum: number, opp: any) => sum + opp.estimatedValue,
        0
      ),
      averageValue:
        opportunities.length > 0
          ? opportunities.reduce(
              (sum: number, opp: any) => sum + opp.estimatedValue,
              0
            ) / opportunities.length
          : 0,
      highPriorityCount: opportunities.filter(
        (opp: any) => opp.competitiveFactors.winProbability >= 0.6
      ).length,
      mediumPriorityCount: opportunities.filter(
        (opp: any) =>
          opp.competitiveFactors.winProbability >= 0.4 &&
          opp.competitiveFactors.winProbability < 0.6
      ).length,
      lowPriorityCount: opportunities.filter(
        (opp: any) => opp.competitiveFactors.winProbability < 0.4
      ).length,
    };

    // Top 10 opportunities by value and win probability
    const topOpportunities = opportunities
      .sort(
        (a: any, b: any) =>
          b.estimatedValue * b.competitiveFactors.winProbability -
          a.estimatedValue * a.competitiveFactors.winProbability
      )
      .slice(0, 10);

    // OEM breakdown
    const oemBreakdown: Record<string, number> = {};
    opportunities.forEach((opp: any) => {
      oemBreakdown[opp.oem] = (oemBreakdown[opp.oem] || 0) + 1;
    });

    // Industry trends analysis
    const industryTrends = {
      evOpportunities: opportunities.filter(
        (opp: any) =>
          opp.title.toLowerCase().includes('ev') ||
          opp.title.toLowerCase().includes('electric') ||
          opp.title.toLowerCase().includes('battery')
      ).length,
      jitRequirements: opportunities.filter(
        (opp: any) => opp.specifications.isJIT
      ).length,
      longTermContracts: opportunities.filter(
        (opp: any) => opp.specifications.isLongTerm
      ).length,
      expediteServices: opportunities.filter(
        (opp: any) => opp.contractType === 'Expedite'
      ).length,
    };

    // Generate AI-powered recommendations
    const recommendations = this.generateRecommendations(
      opportunities,
      summary,
      industryTrends
    );

    return {
      summary,
      topOpportunities,
      oemBreakdown,
      industryTrends,
      recommendations,
    };
  }

  /**
   * Generate AI-powered recommendations
   */
  private generateRecommendations(
    opportunities: any[],
    summary: any,
    trends: any
  ): string[] {
    const recommendations: string[] = [];

    // Value-based recommendations
    if (summary.averageValue > 2000000) {
      recommendations.push(
        '🎯 Focus on high-value opportunities: Average contract value is $' +
          summary.averageValue.toLocaleString() +
          ' - prioritize proposal quality over quantity'
      );
    }

    // EV trend recommendations
    if (trends.evOpportunities > opportunities.length * 0.3) {
      recommendations.push(
        '⚡ EV market surge detected: ' +
          trends.evOpportunities +
          ' electric vehicle opportunities found. Consider specialized EV logistics capabilities'
      );
    }

    // JIT recommendations
    if (trends.jitRequirements > opportunities.length * 0.7) {
      recommendations.push(
        '⏰ Just-in-Time dominance: ' +
          trends.jitRequirements +
          ' opportunities require JIT delivery. Emphasize on-time performance metrics'
      );
    }

    // Competition analysis
    const lowCompetitionOpps = opportunities.filter(
      (opp) => opp.competitiveFactors.expectedBidders < 5
    );
    if (lowCompetitionOpps.length > 0) {
      recommendations.push(
        '🥇 Low competition opportunities: ' +
          lowCompetitionOpps.length +
          ' RFPs with <5 expected bidders. Prioritize these for higher win rates'
      );
    }

    // Expedite services trend
    if (trends.expediteServices > opportunities.length * 0.2) {
      recommendations.push(
        '🚀 Expedite services in demand: ' +
          trends.expediteServices +
          ' expedite opportunities. Consider expanding hot-shot capabilities'
      );
    }

    return recommendations;
  }

  /**
   * Store daily metrics for historical analysis
   */
  private async storeDailyMetrics(metrics: any): Promise<void> {
    try {
      // In production, this would store to database
      console.info(
        '💾 Storing daily metrics:',
        JSON.stringify(metrics, null, 2)
      );
    } catch (error) {
      console.error('❌ Failed to store daily metrics:', error);
    }
  }

  /**
   * Store weekly report
   */
  private async storeWeeklyReport(report: any): Promise<void> {
    try {
      // In production, this would store to database and generate PDF
      console.info('📊 Storing weekly report summary:', {
        totalOpportunities: report.summary.totalOpportunities,
        totalValue: report.summary.totalValue,
        topRecommendations: report.recommendations.slice(0, 3),
      });
    } catch (error) {
      console.error('❌ Failed to store weekly report:', error);
    }
  }

  /**
   * Send high-priority alerts for urgent/high-value opportunities
   */
  private async sendHighPriorityAlerts(
    urgentOpps: any[],
    highValueOpps: any[]
  ): Promise<void> {
    try {
      // This would integrate with notification systems (email, Slack, SMS)
      console.info('🚨 HIGH-PRIORITY AUTOMOTIVE ALERTS SENT');

      if (urgentOpps.length > 0) {
        console.info('⏰ URGENT OPPORTUNITIES (Response Required < 48hrs):');
        urgentOpps.forEach((opp) => {
          console.info(
            `  • ${opp.title} - ${opp.company} - $${opp.estimatedValue.toLocaleString()}`
          );
        });
      }

      if (highValueOpps.length > 0) {
        console.info('💰 HIGH-VALUE OPPORTUNITIES (>$2M):');
        highValueOpps.forEach((opp) => {
          console.info(
            `  • ${opp.title} - ${opp.company} - $${opp.estimatedValue.toLocaleString()}`
          );
        });
      }
    } catch (error) {
      console.error('❌ Failed to send high-priority alerts:', error);
    }
  }

  /**
   * Send failure alerts for system issues
   */
  private async sendFailureAlert(
    processName: string,
    error: any
  ): Promise<void> {
    try {
      console.info(`🚨 AUTOMOTIVE RFP SYSTEM FAILURE ALERT`);
      console.info(`Process: ${processName}`);
      console.info(`Time: ${new Date().toISOString()}`);
      console.info(`Error: ${error.message || error}`);

      // In production, this would send alerts to system administrators
    } catch (alertError) {
      console.error('❌ Failed to send failure alert:', alertError);
    }
  }

  /**
   * Get workflow status and metrics
   */
  getWorkflowStatus(): {
    isRunning: boolean;
    activeTasks: number;
    startTime: string;
    nextScheduledRuns: {
      dailyDiscovery: string;
      weeklyAnalysis: string;
    };
  } {
    // Calculate next scheduled runs
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setUTCHours(11, 0, 0, 0); // 6 AM EST = 11 AM UTC

    const nextMonday = new Date(now);
    const daysUntilMonday = (1 + 7 - now.getUTCDay()) % 7;
    nextMonday.setDate(now.getDate() + daysUntilMonday);
    nextMonday.setUTCHours(13, 0, 0, 0); // 8 AM EST = 13 PM UTC

    return {
      isRunning: this.isRunning,
      activeTasks: this.scheduledTasks.length,
      startTime: this.isRunning ? 'Running since system start' : 'Not running',
      nextScheduledRuns: {
        dailyDiscovery: tomorrow.toISOString(),
        weeklyAnalysis: nextMonday.toISOString(),
      },
    };
  }
}

// Export singleton instance
export const automotiveRFPWorkflow = new AutomotiveRFPWorkflow();
export default AutomotiveRFPWorkflow;
