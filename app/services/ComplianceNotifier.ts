/**
 * ComplianceNotifier - Simplified mobile alert integration for compliance issues
 * Connects compliance alerts to mobile notifications and SMS for urgent matters
 */
import { smsService } from './sms';

export enum AlertPriority {
  CRITICAL = 'critical',
  WARNING = 'warning',
  INFO = 'info',
}

export interface ComplianceNotification {
  carrierId: string;
  dotNumber: string;
  title: string;
  message: string;
  priority: AlertPriority;
  actionRequired: boolean;
  documentType?: string;
  expirationDate?: string;
}

class ComplianceNotifier {
  /**
   * Send compliance alert via mobile and SMS for critical issues
   */
  async sendComplianceAlert(
    notification: ComplianceNotification
  ): Promise<boolean> {
    try {
      console.log(`🚨 Sending compliance alert: ${notification.title}`);

      // Send in-app notification
      await this.sendInAppNotification(notification);

      // For critical alerts, also send SMS
      if (notification.priority === AlertPriority.CRITICAL) {
        await this.sendSMSAlert(notification);
      }

      return true;
    } catch (error) {
      console.error('Failed to send compliance notification:', error);
      return false;
    }
  }

  /**
   * Send document expiration alert with appropriate priority
   */
  async sendDocumentExpirationAlert(
    carrierId: string,
    dotNumber: string,
    documentType: string,
    expirationDate: string,
    daysRemaining: number
  ): Promise<boolean> {
    // Determine priority based on expiration timeline
    const priority =
      daysRemaining <= 7
        ? AlertPriority.CRITICAL
        : daysRemaining <= 30
          ? AlertPriority.WARNING
          : AlertPriority.INFO;

    // Generate message based on timeline
    const message =
      daysRemaining <= 0
        ? `Your ${documentType} has expired. Immediate action required.`
        : `Your ${documentType} expires in ${daysRemaining} days (${new Date(expirationDate).toLocaleDateString()}).`;

    return this.sendComplianceAlert({
      carrierId,
      dotNumber,
      title: `${documentType} Expiring Soon`,
      message,
      priority,
      actionRequired: true,
      documentType,
      expirationDate,
    });
  }

  /**
   * Send violation alert (always critical priority)
   */
  async sendViolationAlert(
    carrierId: string,
    dotNumber: string,
    violationType: string,
    details: string
  ): Promise<boolean> {
    return this.sendComplianceAlert({
      carrierId,
      dotNumber,
      title: `${violationType} Violation Detected`,
      message: details,
      priority: AlertPriority.CRITICAL,
      actionRequired: true,
    });
  }

  /**
   * Send in-app notification
   */
  private async sendInAppNotification(
    notification: ComplianceNotification
  ): Promise<void> {
    // In production, this would use the app's notification system
    // For now just log it
    console.log('📱 In-app notification sent:', {
      userId: notification.carrierId,
      title:
        this.getPriorityEmoji(notification.priority) + ' ' + notification.title,
      body: notification.message,
      category: 'compliance_alert',
      action: notification.actionRequired ? 'view_compliance' : undefined,
    });
  }

  /**
   * Send SMS alert for critical issues
   */
  private async sendSMSAlert(
    notification: ComplianceNotification
  ): Promise<void> {
    // Get recipient numbers
    const recipients = await this.getRecipientNumbers(notification.carrierId);

    if (recipients.length === 0) {
      console.log(
        '⚠️ No SMS recipients found for carrier:',
        notification.carrierId
      );
      return;
    }

    // Format message
    const emoji = this.getPriorityEmoji(notification.priority);
    let message = `${emoji} FleetFlow Compliance Alert: ${notification.title}\n\n`;
    message += notification.message;

    if (notification.actionRequired) {
      message += '\n\nACTION REQUIRED: Please log in to address this issue.';
    }

    // Send SMS to each recipient
    for (const recipient of recipients) {
      try {
        await smsService.sendSMS({
          to: recipient,
          body: message,
          metadata: {
            type: 'compliance_alert',
            priority: notification.priority,
          },
        });
        console.log(`📱 SMS alert sent to ${recipient}`);
      } catch (error) {
        console.error(`Failed to send SMS to ${recipient}:`, error);
      }
    }
  }

  /**
   * Get recipient phone numbers for carrier
   */
  private async getRecipientNumbers(carrierId: string): Promise<string[]> {
    // In production, this would query the database for carrier contacts
    // For demo, return an empty array
    return [];
  }

  /**
   * Get emoji for priority level
   */
  private getPriorityEmoji(priority: AlertPriority): string {
    switch (priority) {
      case AlertPriority.CRITICAL:
        return '🚨';
      case AlertPriority.WARNING:
        return '⚠️';
      case AlertPriority.INFO:
      default:
        return 'ℹ️';
    }
  }
}

// Export singleton instance
export const complianceNotifier = new ComplianceNotifier();
