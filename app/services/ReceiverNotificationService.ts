/**
 * Receiver Notification Service
 * Handles SMS and email notifications to receivers for delivery coordination
 */

interface ReceiverNotificationRequest {
  receiverPhone: string;
  receiverEmail: string;
  receiverName: string;
  shipmentId: string;
  loadId: string;
  vendorName: string;
  driverName: string;
  driverPhone: string;
  currentLocation?: string;
  estimatedArrival: string;
  deliveryInstructions?: string;
  notificationType:
    | 'eta_update'
    | 'departure'
    | 'arrival'
    | 'delay'
    | 'delivery_complete';
}

interface NotificationResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  method: 'sms' | 'email' | 'both';
}

export class ReceiverNotificationService {
  private static readonly TWILIO_PHONE = '+18333863509'; // FleetFlow's Twilio number

  /**
   * Send SMS notification to receiver
   */
  static async sendSMSNotification(
    request: ReceiverNotificationRequest
  ): Promise<NotificationResponse> {
    try {
      const message = this.generateSMSMessage(request);

      // In production, this would use the actual Twilio API
      // For now, we'll simulate the notification
      console.info(`📱 SMS Notification Sent:`);
      console.info(`To: ${request.receiverPhone}`);
      console.info(`From: ${this.TWILIO_PHONE}`);
      console.info(`Message: ${message}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        success: true,
        messageId: `SMS-${Date.now()}`,
        method: 'sms',
      };
    } catch (error) {
      console.error('SMS notification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'sms',
      };
    }
  }

  /**
   * Send email notification to receiver
   */
  static async sendEmailNotification(
    request: ReceiverNotificationRequest
  ): Promise<NotificationResponse> {
    try {
      const { subject, body } = this.generateEmailContent(request);

      // In production, this would use an email service (SendGrid, AWS SES, etc.)
      console.info(`📧 Email Notification Sent:`);
      console.info(`To: ${request.receiverEmail}`);
      console.info(`Subject: ${subject}`);
      console.info(`Body: ${body}`);

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      return {
        success: true,
        messageId: `EMAIL-${Date.now()}`,
        method: 'email',
      };
    } catch (error) {
      console.error('Email notification failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        method: 'email',
      };
    }
  }

  /**
   * Send notification via both SMS and email
   */
  static async sendBothNotifications(
    request: ReceiverNotificationRequest
  ): Promise<NotificationResponse[]> {
    const results = await Promise.allSettled([
      this.sendSMSNotification(request),
      this.sendEmailNotification(request),
    ]);

    return results.map((result) =>
      result.status === 'fulfilled'
        ? result.value
        : {
            success: false,
            error: 'Promise rejected',
            method: 'unknown' as const,
          }
    );
  }

  /**
   * Generate receiver tracking link
   */
  static generateReceiverTrackingLink(shipmentId: string): string {
    const baseUrl =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'http://localhost:3000';
    return `${baseUrl}/receiver-portal?token=${shipmentId}&type=tracking`;
  }

  /**
   * Generate SMS message based on notification type
   */
  private static generateSMSMessage(
    request: ReceiverNotificationRequest
  ): string {
    const {
      notificationType,
      vendorName,
      receiverName,
      loadId,
      estimatedArrival,
      driverName,
      driverPhone,
      currentLocation,
    } = request;

    const trackingLink = this.generateReceiverTrackingLink(request.shipmentId);
    const etaTime = new Date(estimatedArrival).toLocaleString();

    switch (notificationType) {
      case 'departure':
        return `Hi ${receiverName}, your delivery from ${vendorName} (${loadId}) has departed and is on the way! ETA: ${etaTime}. Driver: ${driverName} ${driverPhone}. Track: ${trackingLink}`;

      case 'eta_update':
        return `Delivery update for ${receiverName}: Your shipment ${loadId} from ${vendorName} has an updated ETA of ${etaTime}. Current location: ${currentLocation || 'In transit'}. Track: ${trackingLink}`;

      case 'arrival':
        return `${receiverName}, your driver ${driverName} has arrived at your facility for delivery of ${loadId} from ${vendorName}. Contact: ${driverPhone}`;

      case 'delay':
        return `Delivery delay notice for ${receiverName}: Shipment ${loadId} from ${vendorName} is experiencing delays. New ETA: ${etaTime}. Driver: ${driverName} ${driverPhone}. Track: ${trackingLink}`;

      case 'delivery_complete':
        return `Delivery complete! ${receiverName}, your shipment ${loadId} from ${vendorName} has been successfully delivered. Thank you for choosing FleetFlow!`;

      default:
        return `Update from ${vendorName}: Your delivery ${loadId} is being processed. ETA: ${etaTime}. Track: ${trackingLink}`;
    }
  }

  /**
   * Generate email content based on notification type
   */
  private static generateEmailContent(request: ReceiverNotificationRequest): {
    subject: string;
    body: string;
  } {
    const {
      notificationType,
      vendorName,
      receiverName,
      loadId,
      estimatedArrival,
      driverName,
      driverPhone,
      deliveryInstructions,
    } = request;

    const trackingLink = this.generateReceiverTrackingLink(request.shipmentId);
    const etaTime = new Date(estimatedArrival).toLocaleString();

    const subject = `FleetFlow Delivery Update - ${loadId}`;

    let body = `
Dear ${receiverName},

This is an automated update regarding your delivery from ${vendorName}.

Shipment Details:
- Load ID: ${loadId}
- Estimated Arrival: ${etaTime}
- Driver: ${driverName}
- Driver Contact: ${driverPhone}

`;

    switch (notificationType) {
      case 'departure':
        body += `Your shipment has departed and is now in transit to your facility.`;
        break;
      case 'eta_update':
        body += `The estimated arrival time for your delivery has been updated.`;
        break;
      case 'arrival':
        body += `Your driver has arrived at your facility and is ready to complete the delivery.`;
        break;
      case 'delay':
        body += `We're writing to inform you of a delay in your scheduled delivery.`;
        break;
      case 'delivery_complete':
        body += `Your delivery has been successfully completed. Thank you for your business!`;
        break;
    }

    if (deliveryInstructions) {
      body += `\n\nDelivery Instructions: ${deliveryInstructions}`;
    }

    body += `\n\nYou can track your shipment in real-time at: ${trackingLink}

For any questions or concerns, please contact your vendor ${vendorName} or our support team.

Best regards,
FleetFlow Logistics Platform
`;

    return { subject, body };
  }

  /**
   * Validate phone number format
   */
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex =
      /^\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return phoneRegex.test(phone);
  }

  /**
   * Validate email format
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get notification preferences for a receiver
   */
  static getNotificationPreferences(receiverId: string): {
    sms: boolean;
    email: boolean;
  } {
    // In production, this would fetch from database
    // For now, return default preferences
    return { sms: true, email: true };
  }
}

export default ReceiverNotificationService;
