// PushNotificationService for driver notifications
interface Notification {
  id: string;
  driverId: string;
  type:
    | 'load_assigned'
    | 'message'
    | 'alert'
    | 'reminder'
    | 'system'
    | 'emergency';
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  read: boolean;
  timestamp: string;
  actionRequired: boolean;
  actions?: { label: string; action: string }[];
}

class PushNotificationServiceClass {
  private notifications: { [driverId: string]: Notification[] } = {
    'DRV-001': [
      {
        id: 'notif-001',
        driverId: 'DRV-001',
        type: 'load_assigned',
        title: 'New Load Assigned',
        message:
          'Load LOAD-2024-001 has been assigned to you. Dallas, TX to Atlanta, GA.',
        priority: 'high',
        read: false,
        timestamp: '2024-12-23T08:00:00Z',
        actionRequired: true,
        actions: [
          { label: 'Accept', action: 'accept_load' },
          { label: 'Decline', action: 'decline_load' },
        ],
      },
      {
        id: 'notif-002',
        driverId: 'DRV-001',
        type: 'alert',
        title: 'Weather Alert',
        message: 'Heavy rain expected on your route. Drive safely.',
        priority: 'high',
        read: true,
        timestamp: '2024-12-23T09:15:00Z',
        actionRequired: false,
      },
    ],
    'DRV-002': [
      {
        id: 'notif-003',
        driverId: 'DRV-002',
        type: 'message',
        title: 'New Message from Dispatch',
        message:
          'Great job on the Phoenix delivery! Load LOAD-2024-003 is ready for pickup.',
        priority: 'normal',
        read: true,
        timestamp: '2024-12-23T10:30:00Z',
        actionRequired: false,
      },
    ],
  };

  async getNotifications(driverId: string): Promise<Notification[]> {
    try {
      return this.notifications[driverId] || [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }

  async sendNotification(
    driverId: string,
    notification: Omit<Notification, 'id' | 'driverId' | 'timestamp' | 'read'>
  ): Promise<boolean> {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        driverId,
        timestamp: new Date().toISOString(),
        read: false,
      };

      if (!this.notifications[driverId]) {
        this.notifications[driverId] = [];
      }

      this.notifications[driverId].unshift(newNotification);

      // In a real implementation, this would send push notification to device
      console.info(`Push notification sent to ${driverId}:`, newNotification);

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  async markAsRead(driverId: string, notificationId: string): Promise<boolean> {
    try {
      const notifications = this.notifications[driverId];
      if (!notifications) {
        return false;
      }

      const notification = notifications.find((n) => n.id === notificationId);
      if (!notification) {
        return false;
      }

      notification.read = true;
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  async getUnreadCount(driverId: string): Promise<number> {
    try {
      const notifications = this.notifications[driverId] || [];
      return notifications.filter((n) => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async deleteNotification(
    driverId: string,
    notificationId: string
  ): Promise<boolean> {
    try {
      const notifications = this.notifications[driverId];
      if (!notifications) {
        return false;
      }

      const index = notifications.findIndex((n) => n.id === notificationId);
      if (index === -1) {
        return false;
      }

      notifications.splice(index, 1);
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }

  async sendLoadAssignedNotification(
    driverId: string,
    loadId: string,
    details: string
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'load_assigned',
      title: 'New Load Assigned',
      message: `Load ${loadId} has been assigned to you. ${details}`,
      priority: 'high',
      actionRequired: true,
      actions: [
        { label: 'Accept', action: 'accept_load' },
        { label: 'Decline', action: 'decline_load' },
      ],
    });
  }

  async sendEmergencyAlert(
    driverId: string,
    message: string
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'emergency',
      title: '🚨 Emergency Alert',
      message: message,
      priority: 'urgent',
      actionRequired: true,
      actions: [{ label: 'Acknowledge', action: 'acknowledge_emergency' }],
    });
  }

  async sendHOSReminder(
    driverId: string,
    remainingHours: number
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'reminder',
      title: 'Hours of Service Reminder',
      message: `You have ${remainingHours} hours remaining in your driving window.`,
      priority: remainingHours < 2 ? 'high' : 'normal',
      actionRequired: false,
    });
  }

  async sendBreakReminder(driverId: string): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'reminder',
      title: 'Break Required',
      message: 'You need to take a 30-minute break after 8 hours of driving.',
      priority: 'high',
      actionRequired: true,
      actions: [{ label: 'Take Break', action: 'take_break' }],
    });
  }

  async sendWeatherAlert(
    driverId: string,
    weatherCondition: string,
    severity: 'low' | 'normal' | 'high'
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'alert',
      title: 'Weather Alert',
      message: `${weatherCondition} expected on your route. Drive safely.`,
      priority: severity,
      actionRequired: false,
    });
  }

  async sendMaintenanceReminder(
    driverId: string,
    vehicleId: string,
    maintenanceType: string
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'reminder',
      title: 'Maintenance Reminder',
      message: `Vehicle ${vehicleId} is due for ${maintenanceType}.`,
      priority: 'normal',
      actionRequired: true,
      actions: [{ label: 'Schedule', action: 'schedule_maintenance' }],
    });
  }

  async sendSystemUpdate(
    driverId: string,
    updateMessage: string
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'system',
      title: 'System Update',
      message: updateMessage,
      priority: 'normal',
      actionRequired: false,
    });
  }

  async sendCustomNotification(
    driverId: string,
    title: string,
    message: string,
    priority: Notification['priority'] = 'normal'
  ): Promise<boolean> {
    return this.sendNotification(driverId, {
      type: 'system',
      title,
      message,
      priority,
      actionRequired: false,
    });
  }

  async clearAllNotifications(driverId: string): Promise<boolean> {
    try {
      this.notifications[driverId] = [];
      return true;
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return false;
    }
  }

  async getNotificationsByType(
    driverId: string,
    type: Notification['type']
  ): Promise<Notification[]> {
    try {
      const notifications = this.notifications[driverId] || [];
      return notifications.filter((n) => n.type === type);
    } catch (error) {
      console.error('Error getting notifications by type:', error);
      return [];
    }
  }

  async getNotificationsByPriority(
    driverId: string,
    priority: Notification['priority']
  ): Promise<Notification[]> {
    try {
      const notifications = this.notifications[driverId] || [];
      return notifications.filter((n) => n.priority === priority);
    } catch (error) {
      console.error('Error getting notifications by priority:', error);
      return [];
    }
  }
}

export const PushNotificationService = new PushNotificationServiceClass();
