/**
 * FleetFlow Email A/B Testing Service
 * Advanced split testing for cold email campaigns
 * Provides statistical significance and progressive optimization
 */

import {
  EmailOptions,
  EmailTemplate,
  sendGridService,
} from './sendgrid-service';

export interface EmailVariant {
  id: string;
  name: string;
  template: EmailTemplate;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  replied: number;
  converted: number;
  openRate: number;
  clickRate: number;
  replyRate: number;
  conversionRate: number;
}

export interface EmailTestGroup {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'running' | 'completed' | 'paused';
  testType: 'subject' | 'content' | 'sender' | 'time' | 'comprehensive';
  variants: EmailVariant[];
  audienceSize: number;
  progressiveOptimization: boolean;
  confidenceThreshold: number;
  winner?: string;
  winningReason?: string;
  statisticalSignificance: number;
  completedAt?: Date;
}

export interface EmailAudienceSegment {
  id: string;
  name: string;
  criteria: Record<string, any>;
  size: number;
  description: string;
}

export interface EmailTestResult {
  testGroup: EmailTestGroup;
  winner?: EmailVariant;
  isSignificant: boolean;
  significanceLevel: number;
  recommendations: string[];
  insights: string[];
}

export class EmailABTestingService {
  private testGroups: EmailTestGroup[] = [];
  private audienceSegments: EmailAudienceSegment[] = [];

  constructor() {
    console.info('🧪 Email A/B Testing Service initialized');
  }

  /**
   * Create a new A/B test group
   */
  createTestGroup(
    name: string,
    testType: 'subject' | 'content' | 'sender' | 'time' | 'comprehensive',
    variants: Omit<
      EmailVariant,
      | 'sent'
      | 'delivered'
      | 'opened'
      | 'clicked'
      | 'replied'
      | 'converted'
      | 'openRate'
      | 'clickRate'
      | 'replyRate'
      | 'conversionRate'
    >[],
    options: {
      audienceSize?: number;
      progressiveOptimization?: boolean;
      confidenceThreshold?: number;
    } = {}
  ): EmailTestGroup {
    if (variants.length < 2) {
      throw new Error('At least 2 variants are required for A/B testing');
    }

    const testId = `test-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const testGroup: EmailTestGroup = {
      id: testId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'draft',
      testType,
      variants: variants.map((variant) => ({
        ...variant,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        converted: 0,
        openRate: 0,
        clickRate: 0,
        replyRate: 0,
        conversionRate: 0,
      })),
      audienceSize: options.audienceSize || 1000,
      progressiveOptimization:
        options.progressiveOptimization !== undefined
          ? options.progressiveOptimization
          : true,
      confidenceThreshold: options.confidenceThreshold || 0.95,
      statisticalSignificance: 0,
    };

    this.testGroups.push(testGroup);
    console.info(
      `📊 Created A/B test group "${name}" with ${variants.length} variants`
    );

    return testGroup;
  }

  /**
   * Start running an A/B test
   */
  startTest(testId: string): boolean {
    const test = this.getTestGroup(testId);

    if (!test) {
      console.info(`⚠️ Test group ${testId} not found`);
      return false;
    }

    if (test.status === 'running') {
      console.info(`⚠️ Test group "${test.name}" is already running`);
      return false;
    }

    test.status = 'running';
    test.updatedAt = new Date();
    console.info(`🚀 Started A/B test "${test.name}"`);

    return true;
  }

  /**
   * Pause a running A/B test
   */
  pauseTest(testId: string): boolean {
    const test = this.getTestGroup(testId);

    if (!test) {
      console.info(`⚠️ Test group ${testId} not found`);
      return false;
    }

    if (test.status !== 'running') {
      console.info(`⚠️ Test group "${test.name}" is not running`);
      return false;
    }

    test.status = 'paused';
    test.updatedAt = new Date();
    console.info(`⏸️ Paused A/B test "${test.name}"`);

    return true;
  }

  /**
   * Complete an A/B test and determine the winner
   */
  completeTest(testId: string): EmailTestResult | null {
    const test = this.getTestGroup(testId);

    if (!test) {
      console.info(`⚠️ Test group ${testId} not found`);
      return null;
    }

    if (test.status === 'completed') {
      console.info(`⚠️ Test group "${test.name}" is already completed`);
      return null;
    }

    const result = this.analyzeTestResults(test);

    test.status = 'completed';
    test.updatedAt = new Date();
    test.completedAt = new Date();

    if (result.winner) {
      test.winner = result.winner.id;
      test.winningReason = this.getWinningReason(test, result.winner);
    }

    console.info(`✅ Completed A/B test "${test.name}"`);
    if (result.winner) {
      console.info(
        `🏆 Winner: "${result.winner.name}" (${result.significanceLevel * 100}% confidence)`
      );
    } else {
      console.info(
        `🤔 No clear winner determined (${result.significanceLevel * 100}% confidence)`
      );
    }

    return result;
  }

  /**
   * Select the best variant for a recipient
   * Uses progressive optimization if enabled
   */
  selectVariant(testId: string, recipientInfo?: any): EmailVariant | null {
    const test = this.getTestGroup(testId);

    if (!test || test.status !== 'running' || test.variants.length === 0) {
      return null;
    }

    // If we have a clear leader and progressive optimization is enabled,
    // favor the leading variant with higher probability
    if (
      test.progressiveOptimization &&
      test.variants.some((v) => v.sent > 50)
    ) {
      const totalSent = test.variants.reduce((sum, v) => sum + v.sent, 0);

      if (totalSent >= 100) {
        const performanceMetric = this.getPerformanceMetric(test);
        const bestVariant = this.findBestVariant(test, performanceMetric);
        const otherVariants = test.variants.filter(
          (v) => v.id !== bestVariant.id
        );

        // Calculate statistical significance
        const significance = this.calculateSignificance(
          test,
          bestVariant,
          performanceMetric
        );
        test.statisticalSignificance = significance;

        // Progressive optimization - the higher the significance, the more we favor the winner
        if (significance > 0.7) {
          // 70-80% significance = 70% traffic to leader
          // 80-90% significance = 80% traffic to leader
          // 90-95% significance = 90% traffic to leader
          // >95% significance = 95% traffic to leader
          let leaderProbability = 0.6;
          if (significance > 0.95) leaderProbability = 0.95;
          else if (significance > 0.9) leaderProbability = 0.9;
          else if (significance > 0.8) leaderProbability = 0.8;
          else if (significance > 0.7) leaderProbability = 0.7;

          // Use the leader probability to select a variant
          if (Math.random() < leaderProbability) {
            return bestVariant;
          } else {
            // Randomly select from other variants
            return otherVariants[
              Math.floor(Math.random() * otherVariants.length)
            ];
          }
        }
      }
    }

    // Default: equal distribution among variants
    return test.variants[Math.floor(Math.random() * test.variants.length)];
  }

  /**
   * Track email interaction for a variant
   */
  async trackEmailInteraction(
    testId: string,
    variantId: string,
    interaction:
      | 'sent'
      | 'delivered'
      | 'opened'
      | 'clicked'
      | 'replied'
      | 'converted',
    recipientId?: string
  ): Promise<void> {
    const test = this.getTestGroup(testId);

    if (!test) {
      console.info(`⚠️ Test group ${testId} not found`);
      return;
    }

    const variant = test.variants.find((v) => v.id === variantId);

    if (!variant) {
      console.info(`⚠️ Variant ${variantId} not found in test "${test.name}"`);
      return;
    }

    // Update the interaction counter
    variant[interaction]++;

    // Recalculate rates
    if (variant.sent > 0) {
      variant.openRate = variant.opened / variant.sent;
      variant.clickRate = variant.clicked / variant.sent;
      variant.replyRate = variant.replied / variant.sent;
      variant.conversionRate = variant.converted / variant.sent;
    }

    test.updatedAt = new Date();

    // Check if we should automatically determine a winner
    if (test.status === 'running') {
      const totalSent = test.variants.reduce((sum, v) => sum + v.sent, 0);

      if (totalSent >= test.audienceSize) {
        // We've reached the audience size limit, analyze results
        const performanceMetric = this.getPerformanceMetric(test);
        const bestVariant = this.findBestVariant(test, performanceMetric);
        const significance = this.calculateSignificance(
          test,
          bestVariant,
          performanceMetric
        );
        test.statisticalSignificance = significance;

        // If we've reached the confidence threshold, complete the test
        if (significance >= test.confidenceThreshold) {
          await this.completeTest(testId);
        }
      }
    }
  }

  /**
   * Create audience segments for targeted testing
   */
  createAudienceSegment(
    name: string,
    criteria: Record<string, any>,
    description: string,
    size: number
  ): EmailAudienceSegment {
    const segmentId = `segment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const segment: EmailAudienceSegment = {
      id: segmentId,
      name,
      criteria,
      description,
      size,
    };

    this.audienceSegments.push(segment);
    console.info(
      `👥 Created audience segment "${name}" with estimated size of ${size}`
    );

    return segment;
  }

  /**
   * Send A/B test email to a recipient
   */
  async sendTestEmail(
    testId: string,
    recipientEmail: string,
    recipientName: string,
    recipientInfo?: any
  ): Promise<{
    success: boolean;
    variantId?: string;
    messageId?: string;
    error?: string;
  }> {
    const test = this.getTestGroup(testId);

    if (!test || test.status !== 'running') {
      return {
        success: false,
        error: `Test ${testId} not found or not running`,
      };
    }

    // Select the best variant for this recipient
    const variant = this.selectVariant(testId, recipientInfo);

    if (!variant) {
      return {
        success: false,
        error: 'No variant available',
      };
    }

    // Create email options with tracking parameters
    const emailOptions: EmailOptions = {
      to: { email: recipientEmail, name: recipientName },
      template: variant.template,
      category: 'ab_test',
      customArgs: {
        test_id: testId,
        variant_id: variant.id,
        tracking_enabled: 'true',
      },
    };

    try {
      // Send the email
      const result = await sendGridService.sendEmail(emailOptions);

      if (result.success) {
        // Track the sent email
        await this.trackEmailInteraction(testId, variant.id, 'sent');

        if (result.success) {
          await this.trackEmailInteraction(testId, variant.id, 'delivered');
        }

        return {
          success: true,
          variantId: variant.id,
          messageId: result.messageId,
        };
      } else {
        return {
          success: false,
          variantId: variant.id,
          error: result.error,
        };
      }
    } catch (error) {
      console.error('Failed to send test email:', error);

      return {
        success: false,
        variantId: variant.id,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get all test groups
   */
  getAllTestGroups(): EmailTestGroup[] {
    return this.testGroups;
  }

  /**
   * Get a specific test group by ID
   */
  getTestGroup(testId: string): EmailTestGroup | undefined {
    return this.testGroups.find((test) => test.id === testId);
  }

  /**
   * Get all audience segments
   */
  getAllAudienceSegments(): EmailAudienceSegment[] {
    return this.audienceSegments;
  }

  /**
   * Analyze test results and provide insights
   */
  analyzeTestResults(test: EmailTestGroup): EmailTestResult {
    const performanceMetric = this.getPerformanceMetric(test);
    const bestVariant = this.findBestVariant(test, performanceMetric);

    // Calculate statistical significance between best variant and others
    const significance = this.calculateSignificance(
      test,
      bestVariant,
      performanceMetric
    );

    // Only consider a variant the winner if we have statistical significance
    const winner =
      significance >= test.confidenceThreshold ? bestVariant : undefined;

    // Generate insights and recommendations
    const insights: string[] = [];
    const recommendations: string[] = [];

    if (winner) {
      insights.push(
        `The winning variant "${winner.name}" outperformed others with statistical significance.`
      );
      insights.push(
        `${this.capitalizeFirstLetter(performanceMetric)} was the key deciding metric (${(winner[performanceMetric] * 100).toFixed(2)}%).`
      );

      if (test.testType === 'subject') {
        recommendations.push(
          `Use subject lines similar to the winner in future campaigns.`
        );
        this.analyzeSubjectLine(
          winner.template.subject,
          insights,
          recommendations
        );
      } else if (test.testType === 'content') {
        recommendations.push(
          `Adopt the winning email structure and tone for future campaigns.`
        );
        this.analyzeEmailContent(
          winner.template.html,
          insights,
          recommendations
        );
      } else if (test.testType === 'sender') {
        recommendations.push(
          `Use the winning sender name/address format in future campaigns.`
        );
      } else if (test.testType === 'time') {
        recommendations.push(
          `Schedule future emails at similar times to the winning variant.`
        );
      }
    } else {
      insights.push(
        `No variant showed statistically significant improvement (${(significance * 100).toFixed(2)}% confidence).`
      );

      if (bestVariant) {
        insights.push(
          `Variant "${bestVariant.name}" performed best but didn't reach significance threshold.`
        );
        recommendations.push(
          `Consider running a follow-up test with more recipients.`
        );
      }

      recommendations.push(`Try more distinct variants in your next test.`);
    }

    return {
      testGroup: test,
      winner,
      isSignificant: significance >= test.confidenceThreshold,
      significanceLevel: significance,
      insights,
      recommendations,
    };
  }

  /**
   * Get the most appropriate performance metric for the test type
   */
  private getPerformanceMetric(
    test: EmailTestGroup
  ): 'openRate' | 'clickRate' | 'replyRate' | 'conversionRate' {
    // Different test types have different primary metrics
    switch (test.testType) {
      case 'subject':
        return 'openRate';
      case 'content':
        return 'clickRate';
      case 'comprehensive':
        return 'conversionRate';
      default:
        // Default to openRate as a baseline metric
        return 'openRate';
    }
  }

  /**
   * Find the best performing variant by a specific metric
   */
  private findBestVariant(
    test: EmailTestGroup,
    metric: 'openRate' | 'clickRate' | 'replyRate' | 'conversionRate'
  ): EmailVariant {
    // Sort variants by the metric in descending order
    return [...test.variants].sort((a, b) => b[metric] - a[metric])[0];
  }

  /**
   * Calculate statistical significance between the best variant and others
   * Uses chi-squared test for significance
   */
  private calculateSignificance(
    test: EmailTestGroup,
    bestVariant: EmailVariant,
    metric: 'openRate' | 'clickRate' | 'replyRate' | 'conversionRate'
  ): number {
    if (test.variants.length < 2) return 1; // Only one variant, 100% significant

    // For simplicity, we'll compare the best variant against the average of all others
    const otherVariants = test.variants.filter((v) => v.id !== bestVariant.id);

    // Calculate total positive outcomes and total sent for best variant
    const bestPositive =
      bestVariant[
        metric.replace('Rate', '') as
          | 'opened'
          | 'clicked'
          | 'replied'
          | 'converted'
      ];
    const bestTotal = bestVariant.sent;

    // Calculate total positive outcomes and total sent for other variants
    const otherPositive = otherVariants.reduce(
      (sum, v) =>
        sum +
        v[
          metric.replace('Rate', '') as
            | 'opened'
            | 'clicked'
            | 'replied'
            | 'converted'
        ],
      0
    );
    const otherTotal = otherVariants.reduce((sum, v) => sum + v.sent, 0);

    // Simple significance calculation (in a real implementation, use a proper statistical test)
    // This is a simplified approximation based on sample size and effect size
    // Real implementation would use chi-squared test, z-test, or t-test depending on sample characteristics

    // Effect size
    const bestRate = bestPositive / bestTotal;
    const otherRate = otherPositive / otherTotal;
    const effectSize = Math.abs(bestRate - otherRate);

    // Sample size factor (larger samples provide higher confidence)
    const sampleSizeFactor = Math.min(
      1,
      Math.sqrt((bestTotal + otherTotal) / 200)
    );

    // Combine effect size and sample size for a significance approximation
    // This is just a simplified model - real statistical tests should be used in production
    let significance =
      sampleSizeFactor * (effectSize / (effectSize + 0.05)) * 1.25;

    // Cap at 0.999
    significance = Math.min(0.999, significance);

    return significance;
  }

  /**
   * Get the reason why a variant won
   */
  private getWinningReason(test: EmailTestGroup, winner: EmailVariant): string {
    const metric = this.getPerformanceMetric(test);

    switch (metric) {
      case 'openRate':
        return `Higher open rate (${(winner.openRate * 100).toFixed(2)}%)`;
      case 'clickRate':
        return `Higher click rate (${(winner.clickRate * 100).toFixed(2)}%)`;
      case 'replyRate':
        return `Higher reply rate (${(winner.replyRate * 100).toFixed(2)}%)`;
      case 'conversionRate':
        return `Higher conversion rate (${(winner.conversionRate * 100).toFixed(2)}%)`;
      default:
        return 'Better overall performance';
    }
  }

  /**
   * Analyze a subject line and provide insights
   */
  private analyzeSubjectLine(
    subject: string,
    insights: string[],
    recommendations: string[]
  ): void {
    const length = subject.length;

    if (length < 30) {
      insights.push('Short subject line performed well.');
    } else if (length > 60) {
      insights.push(
        'Long subject line performed well despite conventional wisdom.'
      );
    }

    if (subject.includes('?')) {
      insights.push('Question-based subject line generated interest.');
    }

    if (subject.includes(':')) {
      insights.push('Subject line with colon format performed well.');
    }

    if (/\d+/.test(subject)) {
      insights.push('Subject line containing numbers performed well.');
    }

    if (/!/.test(subject)) {
      insights.push('Subject line with exclamation mark performed well.');
    }
  }

  /**
   * Analyze email content and provide insights
   */
  private analyzeEmailContent(
    content: string,
    insights: string[],
    recommendations: string[]
  ): void {
    // Simple heuristic analysis of HTML content
    const contentLength = content.replace(/<[^>]*>/g, '').length; // Strip HTML

    if (contentLength < 300) {
      insights.push('Brief email content performed well.');
      recommendations.push('Keep emails concise in future campaigns.');
    } else if (contentLength > 1000) {
      insights.push('Longer-form content performed well with this audience.');
    }

    if (content.includes('<img')) {
      insights.push('Email with images performed well.');
    }

    if ((content.match(/<a /g) || []).length > 3) {
      insights.push('Email with multiple links performed well.');
    } else if (content.includes('<a ')) {
      insights.push('Email with limited links performed well.');
    }

    if (content.includes('<table')) {
      insights.push('Structured content with tables performed well.');
    }
  }

  /**
   * Utility: Capitalize first letter of a string
   */
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Export singleton instance
export const emailABTestingService = new EmailABTestingService();
