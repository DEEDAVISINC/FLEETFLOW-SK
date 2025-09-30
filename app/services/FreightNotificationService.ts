// 📧 Freight Notification Service
// Sends email/SMS alerts for tracking milestones

import FreightTrackingDatabase from './FreightTrackingDatabase';
import { WebSocketNotificationService } from './WebSocketNotificationService';

export interface NotificationConfig {
  shipmentId: string;
  customerEmail?: string;
  customerPhone?: string;
  notifyOnMilestones: boolean;
  notifyOnDelays: boolean;
  notifyOnArrival: boolean;
}

export interface MilestoneNotification {
  type:
    | 'pickup'
    | 'port_arrival'
    | 'vessel_loaded'
    | 'in_transit'
    | 'destination_port'
    | 'customs'
    | 'drayage'
    | 'delivered';
  shipmentId: string;
  containerNumber: string;
  location: string;
  timestamp: Date;
  message: string;
}

class FreightNotificationService {
  private static instance: FreightNotificationService;
  private notificationConfigs: Map<string, NotificationConfig> = new Map();

  private constructor() {
    console.info('📧 Freight Notification Service initialized');
  }

  public static getInstance(): FreightNotificationService {
    if (!FreightNotificationService.instance) {
      FreightNotificationService.instance = new FreightNotificationService();
    }
    return FreightNotificationService.instance;
  }

  // Configure notifications for a shipment
  enableNotifications(config: NotificationConfig): void {
    this.notificationConfigs.set(config.shipmentId, config);
    console.info('✅ Notifications enabled for:', config.shipmentId);
  }

  // Disable notifications
  disableNotifications(shipmentId: string): void {
    this.notificationConfigs.delete(shipmentId);
    console.info('🔕 Notifications disabled for:', shipmentId);
  }

  // Send milestone notification
  async sendMilestoneNotification(
    notification: MilestoneNotification
  ): Promise<void> {
    const config = this.notificationConfigs.get(notification.shipmentId);
    if (!config || !config.notifyOnMilestones) {
      return;
    }

    try {
      // Send in-app notification via WebSocket
      this.sendInAppNotification(notification);

      // Send email notification
      if (config.customerEmail) {
        await this.sendEmailNotification(config.customerEmail, notification);
      }

      // Send SMS notification
      if (config.customerPhone) {
        await this.sendSMSNotification(config.customerPhone, notification);
      }

      // Save to database that customer was notified
      await FreightTrackingDatabase.saveMilestone({
        shipment_id: notification.shipmentId,
        milestone_type: notification.type,
        status: 'completed',
        location: notification.location,
        timestamp: notification.timestamp,
        notified_customer: true,
      });

      console.info('✅ Milestone notification sent:', {
        type: notification.type,
        shipment: notification.shipmentId,
      });
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  // Send in-app notification via WebSocket
  private sendInAppNotification(notification: MilestoneNotification): void {
    const wsService = WebSocketNotificationService.getInstance();

    wsService.sendMessage({
      type: 'freight_milestone',
      timestamp: new Date().toISOString(),
      data: {
        shipmentId: notification.shipmentId,
        containerNumber: notification.containerNumber,
        milestone: notification.type,
        location: notification.location,
        message: notification.message,
        icon: this.getMilestoneIcon(notification.type),
      },
    });
  }

  // Send email notification
  private async sendEmailNotification(
    email: string,
    notification: MilestoneNotification
  ): Promise<void> {
    const subject = this.getEmailSubject(notification.type);
    const body = this.getEmailBody(notification);

    try {
      // In production, would use Twilio SendGrid, AWS SES, or similar
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject,
          html: body,
          type: 'freight_tracking',
        }),
      });

      if (response.ok) {
        console.info('📧 Email sent to:', email);
      } else {
        console.warn('⚠️ Email failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ Email error:', error);
      // Fallback: Log to console in development
      console.info('📧 [DEV] Email notification:', {
        to: email,
        subject,
        preview: notification.message,
      });
    }
  }

  // Send SMS notification
  private async sendSMSNotification(
    phone: string,
    notification: MilestoneNotification
  ): Promise<void> {
    const message = this.getSMSMessage(notification);

    try {
      // In production, would use Twilio SMS API
      const response = await fetch('/api/notifications/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: phone,
          body: message,
          type: 'freight_tracking',
        }),
      });

      if (response.ok) {
        console.info('📱 SMS sent to:', phone);
      } else {
        console.warn('⚠️ SMS failed:', await response.text());
      }
    } catch (error) {
      console.error('❌ SMS error:', error);
      // Fallback: Log to console in development
      console.info('📱 [DEV] SMS notification:', {
        to: phone,
        message,
      });
    }
  }

  // Get email subject line
  private getEmailSubject(type: MilestoneNotification['type']): string {
    const subjects = {
      pickup: '📦 Container Picked Up - Shipment Update',
      port_arrival: '⚓ Port Arrival - Shipment Update',
      vessel_loaded: '🚢 Loaded on Vessel - Shipment Update',
      in_transit: '🌊 In Transit - Shipment Update',
      destination_port: '⚓ Destination Port Arrival - Shipment Update',
      customs: '🏛️ Customs Clearance - Shipment Update',
      drayage: '🚛 Out for Delivery - Shipment Update',
      delivered: '✅ Delivered - Shipment Complete',
    };
    return subjects[type] || 'Shipment Update';
  }

  // Get email body (HTML)
  private getEmailBody(notification: MilestoneNotification): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f3f4f6; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #3b82f6; }
    .icon { font-size: 48px; margin-bottom: 10px; }
    h1 { color: #1f2937; font-size: 24px; margin: 10px 0; }
    .milestone { background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .details { color: #6b7280; font-size: 14px; line-height: 1.6; }
    .tracking-link { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 20px; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="icon">${this.getMilestoneIcon(notification.type)}</div>
      <h1>Shipment Update</h1>
      <p style="color: #6b7280; margin: 0;">Container: ${notification.containerNumber}</p>
    </div>

    <div class="milestone">
      <h2 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">${this.getMilestoneTitle(notification.type)}</h2>
      <p style="margin: 0; color: #374151;">${notification.message}</p>
    </div>

    <div class="details">
      <p><strong>Location:</strong> ${notification.location}</p>
      <p><strong>Time:</strong> ${notification.timestamp.toLocaleString()}</p>
      <p><strong>Shipment ID:</strong> ${notification.shipmentId}</p>
    </div>

    <div style="text-align: center;">
      <a href="https://fleetflowapp.com/tracking/${notification.shipmentId}" class="tracking-link">
        📍 Track Your Shipment
      </a>
    </div>

    <div class="footer">
      <p>This is an automated notification from FleetFlow Freight Forwarding</p>
      <p>© 2025 FleetFlow TMS LLC | fleetflowapp.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  // Get SMS message (160 character limit)
  private getSMSMessage(notification: MilestoneNotification): string {
    const icon = this.getMilestoneIcon(notification.type);
    return `${icon} FleetFlow: Container ${notification.containerNumber} - ${notification.message} at ${notification.location}. Track: fleetflowapp.com/t/${notification.shipmentId}`;
  }

  // Get milestone icon
  private getMilestoneIcon(type: MilestoneNotification['type']): string {
    const icons = {
      pickup: '📦',
      port_arrival: '⚓',
      vessel_loaded: '🚢',
      in_transit: '🌊',
      destination_port: '⚓',
      customs: '🏛️',
      drayage: '🚛',
      delivered: '✅',
    };
    return icons[type] || '📍';
  }

  // Get milestone title
  private getMilestoneTitle(type: MilestoneNotification['type']): string {
    const titles = {
      pickup: 'Container Picked Up',
      port_arrival: 'Arrived at Origin Port',
      vessel_loaded: 'Loaded on Vessel',
      in_transit: 'In Transit',
      destination_port: 'Arrived at Destination Port',
      customs: 'Customs Clearance',
      drayage: 'Out for Delivery',
      delivered: 'Delivered Successfully',
    };
    return titles[type] || 'Shipment Update';
  }

  // Send delay notification
  async sendDelayNotification(
    shipmentId: string,
    containerNumber: string,
    reason: string,
    newETA: Date
  ): Promise<void> {
    const config = this.notificationConfigs.get(shipmentId);
    if (!config || !config.notifyOnDelays) {
      return;
    }

    const notification: MilestoneNotification = {
      type: 'in_transit',
      shipmentId,
      containerNumber,
      location: 'At Sea',
      timestamp: new Date(),
      message: `⚠️ Delay: ${reason}. New ETA: ${newETA.toLocaleDateString()}`,
    };

    await this.sendMilestoneNotification(notification);
  }

  // Send arrival notification with special formatting
  async sendArrivalNotification(
    shipmentId: string,
    containerNumber: string,
    location: string
  ): Promise<void> {
    const config = this.notificationConfigs.get(shipmentId);
    if (!config || !config.notifyOnArrival) {
      return;
    }

    const notification: MilestoneNotification = {
      type: 'delivered',
      shipmentId,
      containerNumber,
      location,
      timestamp: new Date(),
      message: `Your container has been successfully delivered to ${location}`,
    };

    await this.sendMilestoneNotification(notification);
  }
}

export default FreightNotificationService.getInstance();
