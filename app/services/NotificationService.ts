/**
 * FLEETFLOW NOTIFICATION SERVICE
 */

export interface Notification {
  id: string;
  userId: string;
  type: 'SHIPMENT_UPDATE' | 'DOCUMENT_REQUEST' | 'DOCUMENT_APPROVED' | 'MESSAGE_RECEIVED' | 'CUSTOMS_CLEARED';
  title: string;
  message: string;
  icon: string;
  color: string;
  timestamp: Date;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification[]> = new Map();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async getNotifications(userId: string): Promise<Notification[]> {
    return this.notifications.get(userId) || [];
  }

  public async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read).length;
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
