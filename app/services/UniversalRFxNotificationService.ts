import { PushNotificationService } from './push-notification';

export interface RFxOpportunity {
  id: string;
  title: string;
  agency?: string;
  company?: string;
  amount?: string;
  responseDeadline: string;
  postedDate: string;
  description: string;
  location?: string;
  url?: string;
  opportunityType:
    | 'Government'
    | 'Enterprise'
    | 'Automotive'
    | 'Construction'
    | 'InstantMarkets'
    | 'Warehousing'
    | '3PL';
  priority: 'High' | 'Medium' | 'Low';
  estimatedValue?: number;
  daysUntilDeadline?: number;
  isPreSolicitation?: boolean;
  noticeType?: string;
  keywords?: string[];
  naicsCode?: string;
  setAsideType?: string;
}

export interface NotificationPreferences {
  userId: string;
  enabledChannels: ('push' | 'email' | 'sms' | 'inApp')[];
  opportunityTypes: string[];
  minimumValue?: number;
  maxDaysToDeadline?: number;
  keywords?: string[];
  excludeKeywords?: string[];
  highPriorityOnly: boolean;
  preSolicitationAlerts: boolean;
}

export interface NotificationMetrics {
  totalSent: number;
  byChannel: Record<string, number>;
  byType: Record<string, number>;
  engagementRate: number;
  clickThroughRate: number;
}

class UniversalRFxNotificationService {
  private pushService: typeof PushNotificationService;
  private notificationQueue: RFxOpportunity[] = [];
  private metrics: NotificationMetrics;

  constructor() {
    this.pushService = PushNotificationService;
    this.metrics = {
      totalSent: 0,
      byChannel: {},
      byType: {},
      engagementRate: 0,
      clickThroughRate: 0,
    };
  }

  /**
   * Process and send notifications for new RFx opportunities
   */
  async processOpportunityAlerts(
    opportunities: RFxOpportunity[],
    userId: string,
    preferences?: NotificationPreferences
  ): Promise<void> {
    try {
      const userPrefs =
        preferences || (await this.getUserNotificationPreferences(userId));

      for (const opportunity of opportunities) {
        if (this.shouldNotifyUser(opportunity, userPrefs)) {
          await this.sendMultiChannelNotification(
            opportunity,
            userId,
            userPrefs
          );
          this.updateMetrics(opportunity);
        }
      }

      // Send batch summary if multiple opportunities
      if (opportunities.length > 5) {
        await this.sendBatchSummary(opportunities, userId, userPrefs);
      }
    } catch (error) {
      console.error('Error processing RFx opportunity alerts:', error);
    }
  }

  /**
   * Send notification through multiple channels
   */
  private async sendMultiChannelNotification(
    opportunity: RFxOpportunity,
    userId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      const notificationData = this.formatNotificationData(opportunity);

      // In-App Notification (always sent)
      if (preferences.enabledChannels.includes('inApp')) {
        await this.sendInAppNotification(notificationData, userId);
      }

      // Push Notification
      if (preferences.enabledChannels.includes('push')) {
        await this.sendPushNotification(notificationData, userId);
      }

      // Email Notification (for high-priority opportunities)
      if (
        preferences.enabledChannels.includes('email') &&
        opportunity.priority === 'High'
      ) {
        await this.sendEmailNotification(opportunity, userId);
      }

      // SMS Notification (for urgent opportunities)
      if (
        preferences.enabledChannels.includes('sms') &&
        this.isUrgentOpportunity(opportunity)
      ) {
        await this.sendSMSNotification(opportunity, userId);
      }
    } catch (error) {
      console.error('Error in multi-channel notification:', error);
    }
  }

  /**
   * Format notification data for different channels
   */
  private formatNotificationData(opportunity: RFxOpportunity): any {
    const urgencyIcon = this.getUrgencyIcon(opportunity);
    const typeColor = this.getOpportunityTypeColor(opportunity.opportunityType);

    return {
      title: `${urgencyIcon} New ${opportunity.opportunityType} RFx Opportunity`,
      message: `${opportunity.title.substring(0, 100)}${opportunity.title.length > 100 ? '...' : ''}`,
      data: {
        opportunityId: opportunity.id,
        type: opportunity.opportunityType,
        priority: opportunity.priority,
        amount: opportunity.amount,
        deadline: opportunity.responseDeadline,
        url: opportunity.url,
        daysUntilDeadline: opportunity.daysUntilDeadline,
        isPreSolicitation: opportunity.isPreSolicitation,
      },
      style: {
        backgroundColor: typeColor,
        icon: urgencyIcon,
      },
    };
  }

  /**
   * Send in-app notification to user's notification hub
   */
  private async sendInAppNotification(
    notificationData: any,
    userId: string
  ): Promise<void> {
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type: 'rfx_opportunity',
          title: notificationData.title,
          message: notificationData.message,
          data: notificationData.data,
          priority: notificationData.data.priority.toLowerCase(),
          category: 'RFx_DISCOVERY',
          metadata: {
            opportunityType: notificationData.data.type,
            isPreSolicitation: notificationData.data.isPreSolicitation,
            daysUntilDeadline: notificationData.data.daysUntilDeadline,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to send in-app notification: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error('Error sending in-app notification:', error);
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(
    notificationData: any,
    userId: string
  ): Promise<void> {
    try {
      await this.pushService.sendToUser(userId, {
        title: notificationData.title,
        body: notificationData.message,
        data: notificationData.data,
        icon: '/icons/rfx-opportunity.png',
        badge: '/icons/fleetflow-badge.png',
        tag: `rfx-${notificationData.data.opportunityId}`,
        requireInteraction: notificationData.data.priority === 'High',
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  }

  /**
   * Send email notification for high-priority opportunities
   */
  private async sendEmailNotification(
    opportunity: RFxOpportunity,
    userId: string
  ): Promise<void> {
    try {
      const emailData = {
        to: await this.getUserEmail(userId),
        subject: `🎯 High-Priority ${opportunity.opportunityType} RFx: ${opportunity.title}`,
        html: this.generateEmailTemplate(opportunity),
        category: 'rfx_high_priority',
      };

      // Send via your email service (Twilio SendGrid, etc.)
      await this.sendEmail(emailData);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  /**
   * Send SMS notification for urgent opportunities
   */
  private async sendSMSNotification(
    opportunity: RFxOpportunity,
    userId: string
  ): Promise<void> {
    try {
      const userPhone = await this.getUserPhone(userId);
      if (!userPhone) return;

      const smsMessage = `🚨 URGENT RFx: ${opportunity.title.substring(0, 80)} - ${opportunity.daysUntilDeadline} days left. ${opportunity.amount || 'Value TBD'}. View: ${opportunity.url}`;

      // Send via Twilio SMS
      await this.sendSMS(userPhone, smsMessage);
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
  }

  /**
   * Send batch summary for multiple opportunities
   */
  private async sendBatchSummary(
    opportunities: RFxOpportunity[],
    userId: string,
    preferences: NotificationPreferences
  ): Promise<void> {
    try {
      const summary = this.generateBatchSummary(opportunities);

      await this.sendInAppNotification(
        {
          title: `📊 RFx Opportunity Batch Summary`,
          message: `${opportunities.length} new opportunities discovered across ${summary.typeCount} categories`,
          data: {
            opportunityCount: opportunities.length,
            totalValue: summary.totalValue,
            urgentCount: summary.urgentCount,
            types: summary.types,
            batchId: `batch-${Date.now()}`,
          },
        },
        userId
      );
    } catch (error) {
      console.error('Error sending batch summary notification:', error);
    }
  }

  /**
   * Check if user should be notified about this opportunity
   */
  private shouldNotifyUser(
    opportunity: RFxOpportunity,
    preferences: NotificationPreferences
  ): boolean {
    // Check opportunity type filter
    if (
      preferences.opportunityTypes.length > 0 &&
      !preferences.opportunityTypes.includes(opportunity.opportunityType)
    ) {
      return false;
    }

    // Check minimum value filter
    if (
      preferences.minimumValue &&
      opportunity.estimatedValue &&
      opportunity.estimatedValue < preferences.minimumValue
    ) {
      return false;
    }

    // Check deadline filter
    if (
      preferences.maxDaysToDeadline &&
      opportunity.daysUntilDeadline &&
      opportunity.daysUntilDeadline > preferences.maxDaysToDeadline
    ) {
      return false;
    }

    // Check priority filter
    if (preferences.highPriorityOnly && opportunity.priority !== 'High') {
      return false;
    }

    // Check pre-solicitation preference
    if (!preferences.preSolicitationAlerts && opportunity.isPreSolicitation) {
      return false;
    }

    // Check keyword filters
    if (preferences.keywords && preferences.keywords.length > 0) {
      const hasKeyword = preferences.keywords.some(
        (keyword) =>
          opportunity.title.toLowerCase().includes(keyword.toLowerCase()) ||
          opportunity.description.toLowerCase().includes(keyword.toLowerCase())
      );
      if (!hasKeyword) return false;
    }

    // Check exclude keywords
    if (preferences.excludeKeywords && preferences.excludeKeywords.length > 0) {
      const hasExcludedKeyword = preferences.excludeKeywords.some(
        (keyword) =>
          opportunity.title.toLowerCase().includes(keyword.toLowerCase()) ||
          opportunity.description.toLowerCase().includes(keyword.toLowerCase())
      );
      if (hasExcludedKeyword) return false;
    }

    return true;
  }

  /**
   * Determine if opportunity is urgent (requires immediate attention)
   */
  private isUrgentOpportunity(opportunity: RFxOpportunity): boolean {
    return (
      opportunity.priority === 'High' ||
      (opportunity.daysUntilDeadline !== undefined &&
        opportunity.daysUntilDeadline <= 3) ||
      (opportunity.estimatedValue && opportunity.estimatedValue >= 1000000) // $1M+
    );
  }

  /**
   * Get urgency icon based on opportunity characteristics
   */
  private getUrgencyIcon(opportunity: RFxOpportunity): string {
    if (opportunity.isPreSolicitation) return '🔍';
    if (opportunity.priority === 'High') return '🚨';
    if (opportunity.daysUntilDeadline && opportunity.daysUntilDeadline <= 7)
      return '⏰';
    return '📋';
  }

  /**
   * Get color scheme based on opportunity type
   */
  private getOpportunityTypeColor(type: string): string {
    const colors = {
      Government: '#10b981', // Green
      Enterprise: '#3b82f6', // Blue
      Automotive: '#f59e0b', // Amber
      Construction: '#ef4444', // Red
      InstantMarkets: '#dc2626', // Dark Red
      Warehousing: '#06b6d4', // Cyan
      '3PL': '#84cc16', // Lime
    };
    return colors[type] || '#6b7280';
  }

  /**
   * Generate batch summary statistics
   */
  private generateBatchSummary(opportunities: RFxOpportunity[]): any {
    const types = [...new Set(opportunities.map((o) => o.opportunityType))];
    const totalValue = opportunities.reduce(
      (sum, o) => sum + (o.estimatedValue || 0),
      0
    );
    const urgentCount = opportunities.filter((o) =>
      this.isUrgentOpportunity(o)
    ).length;

    return {
      typeCount: types.length,
      types,
      totalValue,
      urgentCount,
    };
  }

  /**
   * Generate HTML email template
   */
  private generateEmailTemplate(opportunity: RFxOpportunity): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎯 New ${opportunity.opportunityType} RFx Opportunity</h1>
        </div>

        <div style="padding: 20px; background: #f8fafc;">
          <h2 style="color: #1e293b; margin-top: 0;">${opportunity.title}</h2>

          <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Agency/Company:</strong> ${opportunity.agency || opportunity.company || 'N/A'}</p>
            <p><strong>Estimated Value:</strong> ${opportunity.amount || 'Value TBD'}</p>
            <p><strong>Response Deadline:</strong> ${opportunity.responseDeadline}</p>
            <p><strong>Location:</strong> ${opportunity.location || 'Multiple Locations'}</p>
            <p><strong>Days Until Deadline:</strong> ${opportunity.daysUntilDeadline || 'TBD'}</p>
          </div>

          <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="margin-top: 0; color: #0277bd;">Description</h3>
            <p>${opportunity.description}</p>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <a href="${opportunity.url}" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Full Opportunity →
            </a>
          </div>
        </div>

        <div style="background: #1e293b; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p>FleetFlow RFx Discovery System • Automated Opportunity Intelligence</p>
        </div>
      </div>
    `;
  }

  /**
   * Helper methods for external integrations
   */
  private async getUserNotificationPreferences(
    userId: string
  ): Promise<NotificationPreferences> {
    try {
      // Default preferences - in production, fetch from database
      return {
        userId,
        enabledChannels: ['inApp', 'push'],
        opportunityTypes: ['Government', 'Enterprise', 'Warehousing'],
        minimumValue: 50000,
        maxDaysToDeadline: 30,
        keywords: ['transportation', 'logistics', 'freight'],
        excludeKeywords: [],
        highPriorityOnly: false,
        preSolicitationAlerts: true,
      };
    } catch (error) {
      console.error('Error getting user notification preferences:', error);
      // Return default preferences if there's an error
      return {
        userId,
        enabledChannels: ['inApp'],
        opportunityTypes: ['Government'],
        minimumValue: 50000,
        maxDaysToDeadline: 30,
        keywords: ['transportation'],
        excludeKeywords: [],
        highPriorityOnly: false,
        preSolicitationAlerts: true,
      };
    }
  }

  private async getUserEmail(userId: string): Promise<string> {
    try {
      // Fetch user email from database
      return 'user@company.com'; // Placeholder
    } catch (error) {
      console.error('Error getting user email:', error);
      return 'default@company.com';
    }
  }

  private async getUserPhone(userId: string): Promise<string | null> {
    try {
      // Fetch user phone from database
      return '+1234567890'; // Placeholder
    } catch (error) {
      console.error('Error getting user phone:', error);
      return null;
    }
  }

  private async sendEmail(emailData: any): Promise<void> {
    try {
      // Integrate with email service (Twilio SendGrid, etc.)
      console.log('Sending email:', emailData.subject);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  private async sendSMS(phone: string, message: string): Promise<void> {
    try {
      // Integrate with Twilio SMS
      console.log('Sending SMS to', phone, ':', message);
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  }

  /**
   * Update notification metrics
   */
  private updateMetrics(opportunity: RFxOpportunity): void {
    this.metrics.totalSent++;
    this.metrics.byType[opportunity.opportunityType] =
      (this.metrics.byType[opportunity.opportunityType] || 0) + 1;
  }

  /**
   * Get notification statistics
   */
  public getMetrics(): NotificationMetrics {
    return { ...this.metrics };
  }

  /**
   * Clear notification queue
   */
  public clearQueue(): void {
    this.notificationQueue = [];
  }
}

export default UniversalRFxNotificationService;
