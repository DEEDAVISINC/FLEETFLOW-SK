'use client';

import { getMainDashboardLoads } from './loadService';
import { FleetFlowSystemOrchestrator } from './system-orchestrator';

// 🔔 UNIFIED NOTIFICATION TYPES
export interface FleetFlowNotification {
  id: string;
  type:
    | 'load_assignment'
    | 'delivery_update'
    | 'payment_alert'
    | 'warehouse_alert'
    | 'emergency_alert'
    | 'load_opportunity'
    | 'system_alert'
    | 'compliance_alert'
    | 'dispatch_update'
    | 'carrier_update'
    | 'driver_update'
    | 'vendor_update'
    | 'intraoffice'
    | 'workflow_update'
    | 'eta_update'
    | 'document_required'
    | 'approval_needed'
    | 'onboarding_update';
  priority: 'low' | 'normal' | 'high' | 'urgent' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  channels: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  targetPortals: ('vendor' | 'driver' | 'dispatch' | 'admin' | 'carrier')[];
  targetUsers?: string[];
  metadata: {
    loadId?: string;
    orderId?: string;
    userId?: string;
    departmentId?: string;
    workflowId?: string;
    actionRequired?: boolean;
    expiresAt?: string;
    relatedEntityId?: string;
    entityType?: string;
    [key: string]: any;
  };
  actions?: {
    id: string;
    label: string;
    action: string;
    url?: string;
    style?: 'primary' | 'secondary' | 'danger' | 'success';
  }[];
}

// 🎯 UNIFIED NOTIFICATION PREFERENCES
export interface NotificationPreferences {
  userId: string;
  channels: {
    inApp: boolean;
    sms: boolean;
    email: boolean;
    push: boolean;
  };
  priorities: {
    low: boolean;
    normal: boolean;
    high: boolean;
    urgent: boolean;
    critical: boolean;
  };
  types: {
    [key in FleetFlowNotification['type']]: boolean;
  };
  schedule: {
    enabled: boolean;
    startTime: string; // "09:00"
    endTime: string; // "17:00"
    timezone: string;
    daysOfWeek: number[]; // [1,2,3,4,5] for weekdays
    urgentOnly: boolean; // Allow urgent notifications outside hours
  };
  thresholds: {
    loadValueMin: number;
    distanceMax: number;
    rateMin: number;
  };
}

// 📊 NOTIFICATION ANALYTICS
export interface NotificationStats {
  totalSent: number;
  totalRead: number;
  totalUnread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
  readRate: number;
  avgResponseTime: number;
}

// 🔥 REAL-TIME NOTIFICATION MANAGER
export class FleetFlowNotificationManager {
  private static instance: FleetFlowNotificationManager;
  private notifications: Map<string, FleetFlowNotification> = new Map();
  private preferences: Map<string, NotificationPreferences> = new Map();
  private subscribers: Map<string, Function[]> = new Map();
  private systemOrchestrator: FleetFlowSystemOrchestrator;
  private websocket: WebSocket | null = null;
  private isConnected: boolean = false;

  private constructor() {
    // ReceiverNotificationService uses static methods, no instance needed
    this.systemOrchestrator = new FleetFlowSystemOrchestrator();
    this.initializeWebSocket();
    this.initializeDefaultPreferences();

    // TEMPORARILY DISABLE auto-sync to prevent console spam and page rendering issues
    // setInterval(() => this.syncWithFleetFlowServices(), 30000);

    console.log('✅ FleetFlowNotificationManager initialized');
  }

  public static getInstance(): FleetFlowNotificationManager {
    if (!FleetFlowNotificationManager.instance) {
      FleetFlowNotificationManager.instance =
        new FleetFlowNotificationManager();
    }
    return FleetFlowNotificationManager.instance;
  }

  // 📡 WEBSOCKET REAL-TIME CONNECTION
  private initializeWebSocket(): void {
    try {
      // Use environment variable or fallback to localhost
      const wsUrl =
        process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001';
      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        this.isConnected = true;
        console.log('🔗 FleetFlow Notification WebSocket connected');

        // Send initial handshake
        this.websocket?.send(
          JSON.stringify({
            type: 'register',
            service: 'fleetflow-notifications',
            timestamp: new Date().toISOString(),
          })
        );
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleIncomingNotification(data);
        } catch (error) {
          console.warn('⚠️ Invalid WebSocket message:', error);
        }
      };

      this.websocket.onclose = () => {
        this.isConnected = false;
        console.log('🔌 WebSocket disconnected, attempting reconnection...');

        // Auto-reconnect after 30 seconds (reduced frequency)
        setTimeout(() => this.initializeWebSocket(), 30000);
      };

      this.websocket.onerror = (error) => {
        // Silently handle WebSocket errors to prevent console spam
        this.websocket = null;
      };
    } catch (error) {
      console.warn('⚠️ WebSocket not available, using polling fallback');
    }
  }

  // 📥 HANDLE INCOMING REAL-TIME NOTIFICATIONS
  private handleIncomingNotification(data: any): void {
    if (data.type === 'notification' && data.notification) {
      const notification = data.notification as FleetFlowNotification;
      this.addNotification(notification, false); // Don't broadcast back

      // Notify all subscribers
      this.notifySubscribers('notification_received', notification);
    }
  }

  // 🚀 CREATE AND DISTRIBUTE NOTIFICATION
  public async createNotification(
    notification: Omit<FleetFlowNotification, 'id' | 'timestamp' | 'read'>
  ): Promise<string> {
    const fullNotification: FleetFlowNotification = {
      ...notification,
      id: this.generateNotificationId(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    await this.addNotification(fullNotification, true);
    return fullNotification.id;
  }

  // 📝 ADD NOTIFICATION TO SYSTEM
  private async addNotification(
    notification: FleetFlowNotification,
    broadcast = true
  ): Promise<void> {
    // Store notification
    this.notifications.set(notification.id, notification);

    // Check user preferences and filter
    const filteredTargets = await this.filterByPreferences(notification);

    if (filteredTargets.length === 0) {
      console.log(
        `📋 Notification ${notification.id} filtered out by preferences`
      );
      return;
    }

    // Send via multiple channels
    await this.distributeNotification(notification, filteredTargets);

    // Broadcast to WebSocket if enabled
    if (broadcast && this.isConnected && this.websocket) {
      this.websocket.send(
        JSON.stringify({
          type: 'broadcast_notification',
          notification,
          timestamp: new Date().toISOString(),
        })
      );
    }

    // Notify local subscribers
    this.notifySubscribers('notification_added', notification);

    // Reduced logging to prevent console spam
    // console.log(`✅ Notification created: ${notification.title}`);
  }

  // 🎯 FILTER NOTIFICATIONS BY USER PREFERENCES
  private async filterByPreferences(
    notification: FleetFlowNotification
  ): Promise<string[]> {
    const validTargets: string[] = [];

    // If specific users targeted, check their preferences
    if (notification.targetUsers && notification.targetUsers.length > 0) {
      for (const userId of notification.targetUsers) {
        const prefs = this.preferences.get(userId);
        if (prefs && this.shouldSendToUser(notification, prefs)) {
          validTargets.push(userId);
        }
      }
    } else {
      // General portal targeting - use default preferences
      validTargets.push(...notification.targetPortals);
    }

    return validTargets;
  }

  // ✅ CHECK IF NOTIFICATION SHOULD BE SENT TO USER
  private shouldSendToUser(
    notification: FleetFlowNotification,
    prefs: NotificationPreferences
  ): boolean {
    // Check priority
    if (!prefs.priorities[notification.priority]) {
      return false;
    }

    // Check type
    if (!prefs.types[notification.type]) {
      return false;
    }

    // Check schedule (unless critical/urgent)
    if (
      prefs.schedule.enabled &&
      !['critical', 'urgent'].includes(notification.priority)
    ) {
      const now = new Date();
      const currentHour = now.getHours();
      const startHour = parseInt(prefs.schedule.startTime.split(':')[0]);
      const endHour = parseInt(prefs.schedule.endTime.split(':')[0]);
      const currentDay = now.getDay();

      if (
        currentHour < startHour ||
        currentHour >= endHour ||
        !prefs.schedule.daysOfWeek.includes(currentDay)
      ) {
        return false;
      }
    }

    // Check thresholds for load-related notifications
    if (
      notification.metadata.loadValue &&
      notification.metadata.loadValue < prefs.thresholds.loadValueMin
    ) {
      return false;
    }

    return true;
  }

  // 📬 DISTRIBUTE NOTIFICATION VIA CHANNELS
  private async distributeNotification(
    notification: FleetFlowNotification,
    targets: string[]
  ): Promise<void> {
    for (const target of targets) {
      const prefs = this.preferences.get(target);
      const channels = prefs?.channels || notification.channels;

      try {
        // SMS Channel (using console for now - will be connected to SMS service)
        if (channels.sms && notification.channels.sms) {
          console.log(
            `📱 SMS to ${target}: 🚨 FleetFlow: ${notification.title}\n${notification.message.substring(0, 140)}...`
          );
        }

        // Email Channel (using console for now - will be connected to email service)
        if (channels.email && notification.channels.email) {
          console.log(
            `📧 Email to ${target}: FleetFlow Alert: ${notification.title}`
          );
          console.log(
            `Email Content: ${this.generateEmailTemplate(notification)}`
          );
        }

        // Reduced logging for production
        // console.log(`📤 Notification sent to ${target} via enabled channels`);
      } catch (error) {
        console.error(`❌ Failed to send notification to ${target}:`, error);
      }
    }
  }

  // 📧 GENERATE EMAIL TEMPLATE
  private generateEmailTemplate(notification: FleetFlowNotification): string {
    const priorityColors = {
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#f59e0b',
      urgent: '#ef4444',
      critical: '#dc2626',
    };

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚨 FleetFlow Notification</h1>
        </div>
        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <span style="background: ${priorityColors[notification.priority]}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase;">
              ${notification.priority}
            </span>
            <span style="color: #6b7280; margin-left: 15px; font-size: 14px;">
              ${new Date(notification.timestamp).toLocaleString()}
            </span>
          </div>
          <h2 style="color: #1f2937; margin-bottom: 15px;">${notification.title}</h2>
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">${notification.message}</p>

          ${
            notification.actions
              ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
              ${notification.actions
                .map(
                  (action) => `
                <a href="${action.url || '#'}" style="display: inline-block; margin-right: 10px; padding: 10px 20px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
                  ${action.label}
                </a>
              `
                )
                .join('')}
            </div>
          `
              : ''
          }

          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>FleetFlow Transportation Management System</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `;
  }

  // 🔄 SYNC WITH FLEETFLOW SERVICES
  private async syncWithFleetFlowServices(): Promise<void> {
    try {
      // Get real FleetFlow data
      const [loads, systemStatus] = await Promise.all([
        getMainDashboardLoads(),
        this.systemOrchestrator.getSystemHealth(),
      ]);

      // Generate intelligent notifications based on real data
      await this.generateIntelligentNotifications(loads, systemStatus);
    } catch (error) {
      console.warn('⚠️ FleetFlow service sync failed:', error);
    }
  }

  // 🤖 GENERATE INTELLIGENT NOTIFICATIONS
  private async generateIntelligentNotifications(
    loads: any[],
    systemStatus: any
  ): Promise<void> {
    // ETA Updates for active loads
    const activeLoads = loads.filter((load) => load.status === 'In Transit');
    for (const load of activeLoads) {
      if (this.shouldSendETAUpdate(load)) {
        await this.createNotification({
          type: 'eta_update',
          priority: 'normal',
          title: `🚛 ETA Update: Load ${load.id}`,
          message: `Estimated delivery: ${load.estimatedDelivery || 'Calculating...'}\nRoute: ${load.origin} → ${load.destination}`,
          channels: { inApp: true, sms: false, email: false, push: true },
          targetPortals: ['vendor', 'dispatch', 'driver'],
          metadata: {
            loadId: load.id,
            estimatedDelivery: load.estimatedDelivery,
            currentLocation: load.currentLocation,
            actionRequired: false,
          },
        });
      }
    }

    // System alerts for critical issues
    if (systemStatus?.criticalAlerts?.length > 0) {
      for (const alert of systemStatus.criticalAlerts) {
        await this.createNotification({
          type: 'system_alert',
          priority: 'critical',
          title: `🚨 System Alert: ${alert.title}`,
          message: alert.description,
          channels: { inApp: true, sms: true, email: true, push: true },
          targetPortals: ['admin', 'dispatch'],
          metadata: {
            systemComponent: alert.component,
            actionRequired: true,
            alertId: alert.id,
          },
          actions: [
            {
              id: 'resolve',
              label: 'Acknowledge Alert',
              action: 'resolve_alert',
              style: 'primary',
            },
          ],
        });
      }
    }

    // Load opportunities for high-value loads
    const highValueLoads = loads.filter(
      (load) =>
        load.status === 'Available' &&
        parseFloat(String(load.rate || '0').replace(/[^0-9.]/g, '') || '0') >
          2000
    );

    for (const load of highValueLoads) {
      await this.createNotification({
        type: 'load_opportunity',
        priority: 'high',
        title: `💰 High-Value Load Opportunity: ${load.rate}`,
        message: `${load.origin} → ${load.destination}\nDistance: ${load.miles} miles\nEquipment: ${load.equipment}`,
        channels: { inApp: true, sms: true, email: false, push: true },
        targetPortals: ['driver', 'dispatch'],
        metadata: {
          loadId: load.id,
          loadValue: parseFloat(
            String(load.rate || '0').replace(/[^0-9.]/g, '') || '0'
          ),
          actionRequired: true,
        },
        actions: [
          {
            id: 'bid',
            label: 'Submit Interest',
            action: 'submit_load_interest',
            url: `/loads/${load.id}`,
            style: 'success',
          },
        ],
      });
    }
  }

  // ⏰ CHECK IF ETA UPDATE SHOULD BE SENT
  private shouldSendETAUpdate(load: any): boolean {
    // Send ETA updates every 2 hours for active loads
    const lastUpdate = load.lastETAUpdate || load.createdAt;
    const hoursSinceUpdate =
      (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate >= 2;
  }

  // 🏷️ GENERATE UNIQUE NOTIFICATION ID
  private generateNotificationId(): string {
    return `FF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // 📋 GET NOTIFICATIONS FOR USER/PORTAL
  public getNotifications(
    userId?: string,
    portal?: string,
    filters?: {
      unreadOnly?: boolean;
      priority?: string[];
      type?: string[];
      limit?: number;
    }
  ): FleetFlowNotification[] {
    let notifications = Array.from(this.notifications.values());

    // Filter by user/portal
    if (userId) {
      notifications = notifications.filter(
        (n) =>
          n.targetUsers?.includes(userId) ||
          (portal && n.targetPortals.includes(portal as any))
      );
    } else if (portal) {
      notifications = notifications.filter((n) =>
        n.targetPortals.includes(portal as any)
      );
    }

    // Apply filters
    if (filters) {
      if (filters.unreadOnly) {
        notifications = notifications.filter((n) => !n.read);
      }
      if (filters.priority) {
        notifications = notifications.filter((n) =>
          filters.priority!.includes(n.priority)
        );
      }
      if (filters.type) {
        notifications = notifications.filter((n) =>
          filters.type!.includes(n.type)
        );
      }
    }

    // Sort by timestamp (newest first)
    notifications.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Apply limit
    if (filters?.limit) {
      notifications = notifications.slice(0, filters.limit);
    }

    return notifications;
  }

  // ✅ MARK NOTIFICATION AS READ
  public markAsRead(notificationId: string): void {
    const notification = this.notifications.get(notificationId);
    if (notification) {
      notification.read = true;
      this.notifications.set(notificationId, notification);
      this.notifySubscribers('notification_read', notification);
    }
  }

  // 🔔 MARK ALL AS READ FOR USER
  public markAllAsRead(userId?: string, portal?: string): void {
    const notifications = this.getNotifications(userId, portal, {
      unreadOnly: true,
    });
    for (const notification of notifications) {
      this.markAsRead(notification.id);
    }
  }

  // 🗑️ DELETE NOTIFICATION
  public deleteNotification(notificationId: string): void {
    this.notifications.delete(notificationId);
    this.notifySubscribers('notification_deleted', notificationId);
  }

  // ⚙️ UPDATE USER PREFERENCES
  public updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): void {
    const existing =
      this.preferences.get(userId) || this.getDefaultPreferences(userId);
    const updated = { ...existing, ...preferences };
    this.preferences.set(userId, updated);

    console.log(`✅ Notification preferences updated for user ${userId}`);
  }

  // 📊 GET NOTIFICATION STATS
  public getStats(userId?: string, portal?: string): NotificationStats {
    const notifications = this.getNotifications(userId, portal);
    const totalSent = notifications.length;
    const totalRead = notifications.filter((n) => n.read).length;
    const totalUnread = totalSent - totalRead;

    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};
    const byChannel: Record<string, number> = {};

    for (const notification of notifications) {
      byType[notification.type] = (byType[notification.type] || 0) + 1;
      byPriority[notification.priority] =
        (byPriority[notification.priority] || 0) + 1;

      Object.entries(notification.channels).forEach(([channel, enabled]) => {
        if (enabled) {
          byChannel[channel] = (byChannel[channel] || 0) + 1;
        }
      });
    }

    return {
      totalSent,
      totalRead,
      totalUnread,
      byType,
      byPriority,
      byChannel,
      readRate: totalSent > 0 ? (totalRead / totalSent) * 100 : 0,
      avgResponseTime: 0, // TODO: Calculate based on read timestamps
    };
  }

  // 📡 SUBSCRIBE TO NOTIFICATIONS
  public subscribe(event: string, callback: Function): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.subscribers.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // 📢 NOTIFY SUBSCRIBERS
  private notifySubscribers(event: string, data: any): void {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error('❌ Subscriber callback error:', error);
        }
      });
    }
  }

  // ⚙️ INITIALIZE DEFAULT PREFERENCES
  private initializeDefaultPreferences(): void {
    // Create default preferences for different user types
    const defaultUserTypes = [
      'admin',
      'dispatcher',
      'driver',
      'broker',
      'vendor',
    ];

    for (const userType of defaultUserTypes) {
      this.preferences.set(userType, this.getDefaultPreferences(userType));
    }
  }

  // 📋 GET DEFAULT PREFERENCES
  private getDefaultPreferences(userId: string): NotificationPreferences {
    return {
      userId,
      channels: {
        inApp: true,
        sms: false,
        email: true,
        push: true,
      },
      priorities: {
        low: false,
        normal: true,
        high: true,
        urgent: true,
        critical: true,
      },
      types: {
        load_assignment: true,
        delivery_update: true,
        payment_alert: true,
        warehouse_alert: true,
        emergency_alert: true,
        load_opportunity: true,
        system_alert: true,
        compliance_alert: true,
        dispatch_update: true,
        carrier_update: true,
        driver_update: true,
        vendor_update: true,
        intraoffice: true,
        workflow_update: true,
        eta_update: true,
        document_required: true,
        approval_needed: true,
        onboarding_update: true,
      },
      schedule: {
        enabled: false,
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/New_York',
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        urgentOnly: true,
      },
      thresholds: {
        loadValueMin: 500,
        distanceMax: 1000,
        rateMin: 1.5,
      },
    };
  }

  // 🔗 GET CONNECTION STATUS
  public getConnectionStatus(): {
    connected: boolean;
    websocket: boolean;
    lastSync: string;
  } {
    return {
      connected: this.isConnected,
      websocket: this.websocket?.readyState === WebSocket.OPEN,
      lastSync: new Date().toISOString(),
    };
  }

  // 🧪 SEND TEST NOTIFICATION
  public async sendTestNotification(
    userId: string,
    portal: string
  ): Promise<void> {
    await this.createNotification({
      type: 'system_alert',
      priority: 'normal',
      title: '🧪 Test Notification',
      message:
        'This is a test notification from the FleetFlow Unified Notification System. All systems are working correctly!',
      channels: { inApp: true, sms: false, email: false, push: false },
      targetPortals: [portal as any],
      targetUsers: [userId],
      metadata: {
        isTest: true,
        portal,
        userId,
      },
    });
  }

  // 🏥 HEALTH CHECK
  public getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    components: Record<string, boolean>;
    metrics: {
      totalNotifications: number;
      activeSubscribers: number;
      websocketStatus: string;
    };
  } {
    const components = {
      websocket: this.websocket?.readyState === WebSocket.OPEN,
      receiverService: true, // Static service always available
      systemOrchestrator: !!this.systemOrchestrator,
      notificationStore: this.notifications.size >= 0,
      preferences: this.preferences.size > 0,
    };

    const healthyComponents = Object.values(components).filter(Boolean).length;
    const totalComponents = Object.keys(components).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyComponents === totalComponents) {
      status = 'healthy';
    } else if (healthyComponents >= totalComponents * 0.7) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      components,
      metrics: {
        totalNotifications: this.notifications.size,
        activeSubscribers: Array.from(this.subscribers.values()).reduce(
          (sum, arr) => sum + arr.length,
          0
        ),
        websocketStatus:
          this.websocket?.readyState === WebSocket.OPEN
            ? 'connected'
            : 'disconnected',
      },
    };
  }
}

// 🌟 EXPORT SINGLETON INSTANCE
export const fleetFlowNotificationManager =
  FleetFlowNotificationManager.getInstance();
export default fleetFlowNotificationManager;
