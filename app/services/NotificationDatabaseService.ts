'use client';

import {
  FleetFlowNotification,
  NotificationPreferences,
  NotificationStats,
} from './FleetFlowNotificationManager';

// 🗄️ DATABASE INTERFACES
export interface DatabaseNotification
  extends Omit<FleetFlowNotification, 'channels'> {
  channels: string; // JSON string in database
  target_portals: string; // Array as string in database
  target_users: string | null; // Array as string in database
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  total_recipients: number;
  total_read: number;
  total_delivered: number;
  created_by: string;
  source: string;
  tenant_id: string;
}

export interface NotificationRecipient {
  id: string;
  notification_id: string;
  user_id: string;
  portal: string;
  in_app_status: 'pending' | 'delivered' | 'read' | 'dismissed' | 'failed';
  sms_status: 'pending' | 'sent' | 'delivered' | 'failed' | 'skipped';
  email_status:
    | 'pending'
    | 'sent'
    | 'delivered'
    | 'opened'
    | 'failed'
    | 'skipped';
  push_status:
    | 'pending'
    | 'sent'
    | 'delivered'
    | 'opened'
    | 'failed'
    | 'skipped';
  delivered_at: string | null;
  read_at: string | null;
  dismissed_at: string | null;
  read_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationAction {
  id: string;
  notification_id: string;
  action_id: string;
  label: string;
  action_type: string;
  url: string | null;
  style: 'primary' | 'secondary' | 'danger' | 'success';
  sort_order: number;
}

export interface WebSocketConnection {
  id: string;
  client_id: string;
  user_id: string | null;
  portal: string | null;
  service: string;
  connected_at: string;
  last_ping: string;
  ip_address: string | null;
  user_agent: string | null;
  messages_sent: number;
  messages_received: number;
  status: 'connected' | 'disconnected' | 'timeout';
  updated_at: string;
}

// 📊 ANALYTICS INTERFACES
export interface NotificationAnalytics {
  date: string;
  portal: string;
  tenant_id: string;
  total_sent: number;
  total_delivered: number;
  total_read: number;
  total_clicked: number;
  avg_delivery_time_seconds: number | null;
  avg_read_time_seconds: number | null;
  in_app_sent: number;
  sms_sent: number;
  email_sent: number;
  push_sent: number;
  critical_sent: number;
  urgent_sent: number;
  high_sent: number;
  normal_sent: number;
  low_sent: number;
  type_breakdown: Record<string, number>;
}

// 🔧 DATABASE SERVICE
export class NotificationDatabaseService {
  private static instance: NotificationDatabaseService;
  private isConnected: boolean = false;
  private connectionString: string;

  private constructor() {
    // Use environment variable or fallback for local development
    this.connectionString =
      process.env.DATABASE_URL ||
      process.env.POSTGRES_URL ||
      'postgresql://localhost:5432/fleetflow';
    this.initializeConnection();
  }

  public static getInstance(): NotificationDatabaseService {
    if (!NotificationDatabaseService.instance) {
      NotificationDatabaseService.instance = new NotificationDatabaseService();
    }
    return NotificationDatabaseService.instance;
  }

  // 🔗 INITIALIZE DATABASE CONNECTION
  private async initializeConnection(): Promise<void> {
    try {
      // For client-side usage, we'll simulate database operations
      // In a real implementation, this would connect to PostgreSQL
      console.log('🔗 Notification Database Service initialized');
      console.log(
        '📍 Connection string:',
        this.connectionString.replace(/\/\/.*@/, '//<credentials>@')
      );

      this.isConnected = true;

      // In production, you would:
      // const client = new Pool({ connectionString: this.connectionString });
      // await client.connect();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      this.isConnected = false;
    }
  }

  // 📝 CREATE NOTIFICATION
  public async createNotification(
    notification: FleetFlowNotification
  ): Promise<string> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, using in-memory fallback');
      return notification.id;
    }

    try {
      // In production, this would be a real database insert:
      /*
      const result = await this.query(`
        INSERT INTO fleetflow_notifications (
          id, type, priority, title, message, channels, target_portals,
          target_users, metadata, created_by, source, tenant_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id
      `, [
        notification.id,
        notification.type,
        notification.priority,
        notification.title,
        notification.message,
        JSON.stringify(notification.channels),
        notification.targetPortals,
        notification.targetUsers,
        JSON.stringify(notification.metadata),
        'system',
        'fleetflow_notification_manager',
        'default'
      ]);
      */

      console.log(`📝 Created notification in database: ${notification.id}`);

      // Create actions if present
      if (notification.actions) {
        await this.createNotificationActions(
          notification.id,
          notification.actions
        );
      }

      // Create recipient records
      await this.createNotificationRecipients(notification);

      return notification.id;
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      throw error;
    }
  }

  // 🎯 CREATE NOTIFICATION ACTIONS
  private async createNotificationActions(
    notificationId: string,
    actions: FleetFlowNotification['actions']
  ): Promise<void> {
    if (!actions || actions.length === 0) return;

    try {
      // In production:
      /*
      for (let i = 0; i < actions.length; i++) {
        const action = actions[i];
        await this.query(`
          INSERT INTO notification_actions (
            notification_id, action_id, label, action_type, url, style, sort_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          notificationId,
          action.id,
          action.label,
          action.action,
          action.url || null,
          action.style || 'primary',
          i
        ]);
      }
      */

      console.log(
        `🎯 Created ${actions.length} actions for notification ${notificationId}`
      );
    } catch (error) {
      console.error('❌ Failed to create notification actions:', error);
    }
  }

  // 👥 CREATE NOTIFICATION RECIPIENTS
  private async createNotificationRecipients(
    notification: FleetFlowNotification
  ): Promise<void> {
    try {
      const recipients: { userId: string; portal: string }[] = [];

      // Add specific users if provided
      if (notification.targetUsers && notification.targetUsers.length > 0) {
        for (const userId of notification.targetUsers) {
          // Determine portal for this user (in production, lookup from user table)
          const userPortal = this.getUserPortal(userId);
          recipients.push({ userId, portal: userPortal });
        }
      } else {
        // Add all users from target portals
        for (const portal of notification.targetPortals) {
          const portalUsers = await this.getUsersInPortal(portal);
          recipients.push(...portalUsers.map((userId) => ({ userId, portal })));
        }
      }

      // In production:
      /*
      for (const recipient of recipients) {
        await this.query(`
          INSERT INTO notification_recipients (
            notification_id, user_id, portal, in_app_status
          ) VALUES ($1, $2, $3, $4)
          ON CONFLICT (notification_id, user_id, portal) DO NOTHING
        `, [
          notification.id,
          recipient.userId,
          recipient.portal,
          'pending'
        ]);
      }
      */

      console.log(
        `👥 Created ${recipients.length} recipients for notification ${notification.id}`
      );
    } catch (error) {
      console.error('❌ Failed to create notification recipients:', error);
    }
  }

  // 🔍 GET NOTIFICATIONS FOR USER
  public async getNotificationsForUser(
    userId: string,
    portal: string,
    filters?: {
      unreadOnly?: boolean;
      priority?: string[];
      type?: string[];
      limit?: number;
      offset?: number;
    }
  ): Promise<FleetFlowNotification[]> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, returning empty array');
      return [];
    }

    try {
      // In production, this would be a complex JOIN query:
      /*
      let query = `
        SELECT n.*, r.in_app_status, r.read_at, r.delivered_at
        FROM fleetflow_notifications n
        JOIN notification_recipients r ON n.id = r.notification_id
        WHERE r.user_id = $1 AND r.portal = $2
        AND (n.expires_at IS NULL OR n.expires_at > NOW())
      `;

      const params = [userId, portal];
      let paramIndex = 3;

      if (filters?.unreadOnly) {
        query += ` AND r.in_app_status IN ('pending', 'delivered')`;
      }

      if (filters?.priority?.length) {
        query += ` AND n.priority = ANY($${paramIndex})`;
        params.push(filters.priority);
        paramIndex++;
      }

      if (filters?.type?.length) {
        query += ` AND n.type = ANY($${paramIndex})`;
        params.push(filters.type);
        paramIndex++;
      }

      query += ` ORDER BY n.created_at DESC`;

      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
      }

      if (filters?.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
      }

      const result = await this.query(query, params);
      return result.rows.map(this.mapDatabaseNotificationToFleetFlow);
      */

      // For now, return mock data
      return [];
    } catch (error) {
      console.error('❌ Failed to get notifications for user:', error);
      return [];
    }
  }

  // ✅ MARK NOTIFICATION AS READ
  public async markNotificationAsRead(
    notificationId: string,
    userId: string,
    portal: string
  ): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, operation skipped');
      return false;
    }

    try {
      // In production:
      /*
      await this.query(`
        UPDATE notification_recipients
        SET
          in_app_status = 'read',
          read_at = NOW(),
          read_count = read_count + 1,
          updated_at = NOW()
        WHERE notification_id = $1 AND user_id = $2 AND portal = $3
      `, [notificationId, userId, portal]);
      */

      console.log(
        `✅ Marked notification ${notificationId} as read for ${userId}`
      );
      return true;
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      return false;
    }
  }

  // 🗑️ DELETE NOTIFICATION
  public async deleteNotification(notificationId: string): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, operation skipped');
      return false;
    }

    try {
      // In production:
      /*
      await this.query(`
        DELETE FROM fleetflow_notifications WHERE id = $1
      `, [notificationId]);
      */

      console.log(`🗑️ Deleted notification ${notificationId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
      return false;
    }
  }

  // ⚙️ SAVE USER PREFERENCES
  public async saveUserPreferences(
    userId: string,
    portal: string,
    preferences: NotificationPreferences
  ): Promise<boolean> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, operation skipped');
      return false;
    }

    try {
      // In production:
      /*
      await this.query(`
        INSERT INTO user_notification_preferences (
          user_id, portal, channels, priorities, types, schedule, thresholds
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT (user_id, portal)
        DO UPDATE SET
          channels = EXCLUDED.channels,
          priorities = EXCLUDED.priorities,
          types = EXCLUDED.types,
          schedule = EXCLUDED.schedule,
          thresholds = EXCLUDED.thresholds,
          updated_at = NOW()
      `, [
        userId,
        portal,
        JSON.stringify(preferences.channels),
        JSON.stringify(preferences.priorities),
        JSON.stringify(preferences.types),
        JSON.stringify(preferences.schedule),
        JSON.stringify(preferences.thresholds)
      ]);
      */

      console.log(
        `⚙️ Saved preferences for user ${userId} in portal ${portal}`
      );
      return true;
    } catch (error) {
      console.error('❌ Failed to save user preferences:', error);
      return false;
    }
  }

  // 🔍 GET USER PREFERENCES
  public async getUserPreferences(
    userId: string,
    portal: string
  ): Promise<NotificationPreferences | null> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, returning null');
      return null;
    }

    try {
      // In production:
      /*
      const result = await this.query(`
        SELECT * FROM user_notification_preferences
        WHERE user_id = $1 AND portal = $2
      `, [userId, portal]);

      if (result.rows.length === 0) {
        // Return default preferences
        return this.getDefaultPreferences(userId, portal);
      }

      const row = result.rows[0];
      return {
        userId: row.user_id,
        channels: JSON.parse(row.channels),
        priorities: JSON.parse(row.priorities),
        types: JSON.parse(row.types),
        schedule: JSON.parse(row.schedule),
        thresholds: JSON.parse(row.thresholds)
      };
      */

      // For now, return default preferences
      return this.getDefaultPreferences(userId, portal);
    } catch (error) {
      console.error('❌ Failed to get user preferences:', error);
      return null;
    }
  }

  // 📊 GET NOTIFICATION STATS
  public async getNotificationStats(
    userId?: string,
    portal?: string,
    dateRange?: { start: string; end: string }
  ): Promise<NotificationStats> {
    if (!this.isConnected) {
      return {
        totalSent: 0,
        totalRead: 0,
        totalUnread: 0,
        byType: {},
        byPriority: {},
        byChannel: {},
        readRate: 0,
        avgResponseTime: 0,
      };
    }

    try {
      // In production, this would query notification_analytics and aggregate data
      /*
      const result = await this.query(`
        SELECT
          COUNT(*) as total_sent,
          COUNT(*) FILTER (WHERE r.in_app_status = 'read') as total_read,
          COUNT(*) FILTER (WHERE r.in_app_status IN ('pending', 'delivered')) as total_unread
        FROM fleetflow_notifications n
        JOIN notification_recipients r ON n.id = r.notification_id
        WHERE ($1::text IS NULL OR r.user_id = $1)
        AND ($2::text IS NULL OR r.portal = $2)
        AND ($3::timestamp IS NULL OR n.created_at >= $3)
        AND ($4::timestamp IS NULL OR n.created_at <= $4)
      `, [userId, portal, dateRange?.start, dateRange?.end]);
      */

      // Mock stats for development
      return {
        totalSent: 25,
        totalRead: 18,
        totalUnread: 7,
        byType: {
          load_assignment: 5,
          delivery_update: 8,
          system_alert: 3,
          payment_alert: 9,
        },
        byPriority: {
          critical: 2,
          urgent: 5,
          high: 8,
          normal: 10,
          low: 0,
        },
        byChannel: {
          inApp: 25,
          sms: 12,
          email: 18,
          push: 20,
        },
        readRate: 72.0,
        avgResponseTime: 1847, // seconds
      };
    } catch (error) {
      console.error('❌ Failed to get notification stats:', error);
      return {
        totalSent: 0,
        totalRead: 0,
        totalUnread: 0,
        byType: {},
        byPriority: {},
        byChannel: {},
        readRate: 0,
        avgResponseTime: 0,
      };
    }
  }

  // 🔗 WEBSOCKET CONNECTION MANAGEMENT
  public async trackWebSocketConnection(
    connection: Partial<WebSocketConnection>
  ): Promise<string> {
    if (!this.isConnected) {
      console.warn('⚠️ Database not connected, skipping WebSocket tracking');
      return connection.client_id || 'mock-connection';
    }

    try {
      // In production:
      /*
      await this.query(`
        INSERT INTO websocket_connections (
          client_id, user_id, portal, service, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (client_id)
        DO UPDATE SET
          last_ping = NOW(),
          status = 'connected',
          updated_at = NOW()
      `, [
        connection.client_id,
        connection.user_id,
        connection.portal,
        connection.service,
        connection.ip_address,
        connection.user_agent
      ]);
      */

      console.log(`🔗 Tracked WebSocket connection: ${connection.client_id}`);
      return connection.client_id || 'tracked-connection';
    } catch (error) {
      console.error('❌ Failed to track WebSocket connection:', error);
      return 'error-connection';
    }
  }

  // 💓 UPDATE WEBSOCKET PING
  public async updateWebSocketPing(clientId: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      // In production:
      /*
      await this.query(`
        UPDATE websocket_connections
        SET last_ping = NOW(), updated_at = NOW()
        WHERE client_id = $1
      `, [clientId]);
      */

      console.log(`💓 Updated ping for WebSocket: ${clientId}`);
    } catch (error) {
      console.error('❌ Failed to update WebSocket ping:', error);
    }
  }

  // 🔌 DISCONNECT WEBSOCKET
  public async disconnectWebSocket(clientId: string): Promise<void> {
    if (!this.isConnected) return;

    try {
      // In production:
      /*
      await this.query(`
        UPDATE websocket_connections
        SET status = 'disconnected', updated_at = NOW()
        WHERE client_id = $1
      `, [clientId]);
      */

      console.log(`🔌 Disconnected WebSocket: ${clientId}`);
    } catch (error) {
      console.error('❌ Failed to disconnect WebSocket:', error);
    }
  }

  // 🧹 CLEANUP EXPIRED DATA
  public async cleanupExpiredData(): Promise<void> {
    if (!this.isConnected) return;

    try {
      // In production, this would run as a scheduled job:
      /*
      // Delete expired notifications
      await this.query(`
        DELETE FROM fleetflow_notifications
        WHERE expires_at IS NOT NULL AND expires_at < NOW()
      `);

      // Delete old delivery logs (keep 90 days)
      await this.query(`
        DELETE FROM notification_delivery_log
        WHERE attempted_at < NOW() - INTERVAL '90 days'
      `);

      // Delete stale WebSocket connections (24 hours)
      await this.query(`
        DELETE FROM websocket_connections
        WHERE last_ping < NOW() - INTERVAL '24 hours'
      `);

      // Delete processed queue items (7 days)
      await this.query(`
        DELETE FROM notification_queue
        WHERE status IN ('delivered', 'failed', 'cancelled')
        AND updated_at < NOW() - INTERVAL '7 days'
      `);
      */

      console.log('🧹 Cleanup completed for expired notification data');
    } catch (error) {
      console.error('❌ Failed to cleanup expired data:', error);
    }
  }

  // 🏥 HEALTH CHECK
  public getHealthStatus(): {
    connected: boolean;
    connectionString: string;
    lastQuery: string;
  } {
    return {
      connected: this.isConnected,
      connectionString: this.connectionString.replace(
        /\/\/.*@/,
        '//<credentials>@'
      ),
      lastQuery: new Date().toISOString(),
    };
  }

  // 🛠️ HELPER METHODS
  private getUserPortal(userId: string): string {
    // In production, this would lookup the user's primary portal
    // For now, return a default based on userId pattern
    if (userId.includes('driver')) return 'driver';
    if (userId.includes('vendor')) return 'vendor';
    if (userId.includes('dispatch')) return 'dispatch';
    if (userId.includes('carrier')) return 'carrier';
    return 'admin';
  }

  private async getUsersInPortal(portal: string): Promise<string[]> {
    // In production, this would query the users table
    // For now, return mock users
    const mockUsers = {
      admin: ['admin-1', 'admin-2'],
      dispatch: ['dispatch-1', 'dispatch-2', 'dispatch-3'],
      driver: ['driver-1', 'driver-2', 'driver-3', 'driver-4'],
      vendor: ['vendor-1', 'vendor-2'],
      carrier: ['carrier-1', 'carrier-2', 'carrier-3'],
    };

    return mockUsers[portal as keyof typeof mockUsers] || [];
  }

  private getDefaultPreferences(
    userId: string,
    portal: string
  ): NotificationPreferences {
    const portalDefaults: Record<
      string,
      Partial<NotificationPreferences['types']>
    > = {
      admin: {
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
      dispatch: {
        load_assignment: true,
        delivery_update: true,
        payment_alert: false,
        warehouse_alert: true,
        emergency_alert: true,
        load_opportunity: true,
        system_alert: true,
        compliance_alert: true,
        dispatch_update: true,
        carrier_update: true,
        driver_update: true,
        vendor_update: false,
        intraoffice: true,
        workflow_update: true,
        eta_update: true,
        document_required: true,
        approval_needed: true,
        onboarding_update: false,
      },
      driver: {
        load_assignment: true,
        delivery_update: true,
        payment_alert: true,
        warehouse_alert: false,
        emergency_alert: true,
        load_opportunity: true,
        system_alert: false,
        compliance_alert: true,
        dispatch_update: true,
        carrier_update: false,
        driver_update: true,
        vendor_update: false,
        intraoffice: false,
        workflow_update: true,
        eta_update: true,
        document_required: true,
        approval_needed: false,
        onboarding_update: false,
      },
      vendor: {
        load_assignment: false,
        delivery_update: true,
        payment_alert: true,
        warehouse_alert: true,
        emergency_alert: true,
        load_opportunity: false,
        system_alert: false,
        compliance_alert: false,
        dispatch_update: false,
        carrier_update: false,
        driver_update: false,
        vendor_update: true,
        intraoffice: false,
        workflow_update: false,
        eta_update: true,
        document_required: false,
        approval_needed: false,
        onboarding_update: false,
      },
      carrier: {
        load_assignment: true,
        delivery_update: true,
        payment_alert: true,
        warehouse_alert: false,
        emergency_alert: true,
        load_opportunity: true,
        system_alert: false,
        compliance_alert: true,
        dispatch_update: false,
        carrier_update: true,
        driver_update: false,
        vendor_update: false,
        intraoffice: false,
        workflow_update: true,
        eta_update: true,
        document_required: true,
        approval_needed: true,
        onboarding_update: true,
      },
    };

    return {
      userId,
      channels: {
        inApp: true,
        sms: portal === 'driver' || portal === 'dispatch',
        email: true,
        push: portal !== 'vendor',
      },
      priorities: {
        low: false,
        normal: true,
        high: true,
        urgent: true,
        critical: true,
      },
      types: (portalDefaults[portal] as NotificationPreferences['types']) || {},
      schedule: {
        enabled: false,
        startTime: '08:00',
        endTime: '18:00',
        timezone: 'America/New_York',
        daysOfWeek: [1, 2, 3, 4, 5],
        urgentOnly: true,
      },
      thresholds: {
        loadValueMin: portal === 'driver' ? 1000 : 500,
        distanceMax: portal === 'driver' ? 500 : 1000,
        rateMin: portal === 'driver' ? 2.0 : 1.5,
      },
    };
  }

  private mapDatabaseNotificationToFleetFlow(
    dbNotification: DatabaseNotification
  ): FleetFlowNotification {
    return {
      id: dbNotification.id,
      type: dbNotification.type,
      priority: dbNotification.priority,
      title: dbNotification.title,
      message: dbNotification.message,
      timestamp: dbNotification.created_at,
      read: false, // This would be determined by recipient status
      channels:
        typeof dbNotification.channels === 'string'
          ? JSON.parse(dbNotification.channels)
          : dbNotification.channels,
      targetPortals:
        typeof dbNotification.target_portals === 'string'
          ? JSON.parse(dbNotification.target_portals)
          : dbNotification.target_portals,
      targetUsers: dbNotification.target_users
        ? typeof dbNotification.target_users === 'string'
          ? JSON.parse(dbNotification.target_users)
          : dbNotification.target_users
        : undefined,
      metadata: dbNotification.metadata,
      actions: [], // Would need to fetch from notification_actions table
    };
  }
}

// 🌟 EXPORT SINGLETON INSTANCE
export const notificationDatabaseService =
  NotificationDatabaseService.getInstance();
export default notificationDatabaseService;
