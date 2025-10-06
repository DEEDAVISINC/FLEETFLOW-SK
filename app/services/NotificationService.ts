/**
 * FLEETFLOW NOTIFICATION SERVICE
 */

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'SHIPMENT_UPDATE'
    | 'DOCUMENT_REQUEST'
    | 'DOCUMENT_APPROVED'
    | 'MESSAGE_RECEIVED'
    | 'CUSTOMS_CLEARED';
  title: string;
  message: string;
  icon: string;
  color: string;
  timestamp: Date;
  read: boolean;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class NotificationService {
  private static instance: NotificationService;
  private notifications: Map<string, Notification[]> = new Map();

  constructor() {}

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

  public async getUserNotifications(
    userId: string,
    options: { limit?: number; includeRead?: boolean } = {}
  ): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    const filtered = options.includeRead
      ? userNotifications
      : userNotifications.filter((n) => !n.read);
    return options.limit ? filtered.slice(0, options.limit) : filtered;
  }

  public async clearSampleNotifications(userId: string): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    const realNotifications = userNotifications.filter(
      (n) =>
        !n.title?.toLowerCase().includes('sample') &&
        !n.title?.toLowerCase().includes('welcome') &&
        !n.title?.toLowerCase().includes('demo') &&
        !n.title?.toLowerCase().includes('test') &&
        !n.message?.toLowerCase().includes('sample') &&
        !n.message?.toLowerCase().includes('welcome') &&
        !n.message?.toLowerCase().includes('demo') &&
        !n.message?.toLowerCase().includes('test') &&
        !n.title?.includes('🎯') &&
        !n.title?.includes('🚛') &&
        !n.title?.includes('📦')
    );

    this.notifications.set(userId, realNotifications);
  }
}

export const notificationService = NotificationService.getInstance();
export default notificationService;
