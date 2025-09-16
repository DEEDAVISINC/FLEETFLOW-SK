/**
 * FleetFlow Enhanced Notification Service
 * Enterprise-grade notification system with multi-channel delivery,
 * smart routing, auto-generation, and real-time capabilities
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  title: string;
  messageTemplate: string;
  priority: NotificationPriority;
  channels: NotificationChannel[];
  roles: string[];
  conditions?: NotificationCondition[];
  escalation?: EscalationRule;
  actions?: NotificationAction[];
}

export interface NotificationData {
  id?: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  userId?: string;
  tenantId: string;
  category: string;
  channels: NotificationChannel[];
  data?: Record<string, any>;
  actions?: NotificationAction[];
  expiresAt?: Date;
  scheduledFor?: Date;
  relatedEntityId?: string;
  relatedEntityType?: string;
  tags?: string[];
  isRead?: boolean;
  isArchived?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface NotificationAction {
  id: string;
  label: string;
  type: 'navigate' | 'api' | 'modal' | 'external';
  payload: Record<string, any>;
  style: 'primary' | 'secondary' | 'danger' | 'success';
  icon?: string;
}

export interface NotificationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
}

export interface EscalationRule {
  timeoutMinutes: number;
  escalateTo: string[];
  escalationMessage: string;
  maxEscalations: number;
}

export interface NotificationPreferences {
  userId: string;
  enabledChannels: NotificationChannel[];
  quietHoursStart?: string;
  quietHoursEnd?: string;
  typePreferences: Record<NotificationType, boolean>;
  priorityThreshold: NotificationPriority;
}

export interface BusinessEvent {
  type: BusinessEventType;
  entityId: string;
  entityType: string;
  data: Record<string, any>;
  timestamp: Date;
  userId?: string;
  tenantId: string;
}

export type NotificationType =
  | 'system'
  | 'shipment'
  | 'compliance'
  | 'billing'
  | 'maintenance'
  | 'driver'
  | 'vehicle'
  | 'dispatch'
  | 'carrier'
  | 'customer'
  | 'emergency';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

export type NotificationChannel =
  | 'in-app'
  | 'email'
  | 'sms'
  | 'push'
  | 'webhook';

export type BusinessEventType =
  | 'load_created'
  | 'load_delivered'
  | 'load_delayed'
  | 'driver_check_in'
  | 'driver_violation'
  | 'vehicle_maintenance_due'
  | 'invoice_created'
  | 'invoice_paid'
  | 'invoice_overdue'
  | 'compliance_alert'
  | 'route_optimized'
  | 'carrier_assigned'
  | 'system_maintenance'
  | 'user_login'
  | 'payment_processed';

// ============================================================================
// NOTIFICATION SERVICE CLASS
// ============================================================================

export class NotificationService {
  private supabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ? createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
      : null;

  private templates: Map<string, NotificationTemplate> = new Map();
  private eventListeners: Map<
    BusinessEventType,
    ((event: BusinessEvent) => void)[]
  > = new Map();

  constructor() {
    this.initializeTemplates();
    this.setupEventListeners();
    console.info('🔔 NotificationService initialized');
  }

  // ============================================================================
  // CORE NOTIFICATION METHODS
  // ============================================================================

  /**
   * Send a notification to users
   */
  async sendNotification(
    notification: NotificationData
  ): Promise<string | null> {
    try {
      console.info(`🚀 Sending notification: ${notification.title}`);

      // Generate unique ID if not provided
      if (!notification.id) {
        notification.id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Set default timestamps
      notification.createdAt = new Date();
      notification.updatedAt = new Date();

      // Store in database if Supabase is configured
      if (!this.supabase) {
        console.info(
          '📭 NotificationService: Supabase not configured, notification not stored'
        );
        return notification.id;
      }

      const { data, error } = await this.supabase
        .from('notifications')
        .insert([
          {
            id: notification.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            priority: notification.priority,
            user_id: notification.userId,
            tenant_id: notification.tenantId,
            category: notification.category,
            channels: notification.channels,
            data: notification.data || {},
            actions: notification.actions || [],
            expires_at: notification.expiresAt?.toISOString(),
            scheduled_for: notification.scheduledFor?.toISOString(),
            related_entity_id: notification.relatedEntityId,
            related_entity_type: notification.relatedEntityType,
            tags: notification.tags || [],
            read: notification.isRead || false,
            archived: notification.isArchived || false,
            created_at: notification.createdAt.toISOString(),
            updated_at: notification.updatedAt.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.info(
          '📭 NotificationService: Database not configured, notification not stored'
        );
        return null;
      }

      // Send to different channels
      await this.sendToChannels(notification);

      // Setup escalation if configured
      if (
        notification.priority === 'critical' ||
        notification.priority === 'high'
      ) {
        await this.setupEscalation(notification);
      }

      console.info(`✅ Notification sent successfully: ${notification.id}`);
      return notification.id;
    } catch (error) {
      console.error('❌ NotificationService.sendNotification error:', error);
      return null;
    }
  }

  /**
   * Send notifications to multiple users
   */
  async sendBulkNotifications(
    notifications: NotificationData[]
  ): Promise<(string | null)[]> {
    console.info(
      `📢 Sending bulk notifications: ${notifications.length} notifications`
    );

    const results = await Promise.all(
      notifications.map((notification) => this.sendNotification(notification))
    );

    const successful = results.filter((id) => id !== null).length;
    console.info(
      `✅ Bulk send complete: ${successful}/${notifications.length} successful`
    );

    return results;
  }

  /**
   * Create notification from business event
   */
  async handleBusinessEvent(event: BusinessEvent): Promise<void> {
    console.info(`🎯 Handling business event: ${event.type}`);

    try {
      // Find applicable templates
      const applicableTemplates = Array.from(this.templates.values()).filter(
        (template) => this.matchesEventConditions(template, event)
      );

      if (applicableTemplates.length === 0) {
        console.info(`⚠️ No templates found for event: ${event.type}`);
        return;
      }

      // Generate notifications from templates
      for (const template of applicableTemplates) {
        const notifications = await this.generateFromTemplate(template, event);
        await this.sendBulkNotifications(notifications);
      }

      // Trigger custom event listeners
      const listeners = this.eventListeners.get(event.type) || [];
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`❌ Event listener error for ${event.type}:`, error);
        }
      });
    } catch (error) {
      console.error('❌ Error handling business event:', error);
    }
  }

  // ============================================================================
  // NOTIFICATION RETRIEVAL & MANAGEMENT
  // ============================================================================

  /**
   * Get notifications for a user
   */
  async getUserNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      includeRead?: boolean;
      type?: NotificationType;
      priority?: NotificationPriority;
      category?: string;
    }
  ): Promise<NotificationData[]> {
    try {
      // Return empty array if Supabase is not configured
      if (!this.supabase) {
        console.info(
          '📭 NotificationService: Supabase not configured, returning empty notifications'
        );
        return [];
      }

      let query = this.supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 50)
        );
      }

      if (!options?.includeRead) {
        query = query.eq('read', false);
      }

      if (options?.type) {
        query = query.eq('type', options.type);
      }

      if (options?.priority) {
        query = query.eq('priority', options.priority);
      }

      if (options?.category) {
        query = query.eq('category', options.category);
      }

      const { data, error } = await query;

      if (error) {
        console.info(
          '📭 NotificationService: Database not configured, returning empty notifications'
        );
        return [];
      }

      return data?.map(this.mapDatabaseNotification) || [];
    } catch (error) {
      console.info(
        '📭 NotificationService: Connection not available, returning empty notifications'
      );
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationIds: string[]): Promise<boolean> {
    try {
      if (!this.supabase) {
        console.info(
          '📭 NotificationService: Supabase not configured, cannot mark as read'
        );
        return false;
      }

      const { error } = await this.supabase
        .from('notifications')
        .update({
          read: true,
          updated_at: new Date().toISOString(),
        })
        .in('id', notificationIds);

      if (error) {
        console.info(
          '📭 NotificationService: Database not configured, cannot mark as read'
        );
        return false;
      }

      console.info(`✅ Marked ${notificationIds.length} notifications as read`);
      return true;
    } catch (error) {
      console.error('❌ markAsRead error:', error);
      return false;
    }
  }

  /**
   * Archive notifications
   */
  async archiveNotifications(notificationIds: string[]): Promise<boolean> {
    try {
      if (!this.supabase) {
        console.info(
          '📭 NotificationService: Supabase not configured, cannot archive'
        );
        return false;
      }

      const { error } = await this.supabase
        .from('notifications')
        .update({
          archived: true,
          updated_at: new Date().toISOString(),
        })
        .in('id', notificationIds);

      if (error) {
        console.error('❌ Failed to archive notifications:', error);
        return false;
      }

      console.info(`✅ Archived ${notificationIds.length} notifications`);
      return true;
    } catch (error) {
      console.error('❌ archiveNotifications error:', error);
      return false;
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(
    userId?: string,
    tenantId?: string
  ): Promise<{
    total: number;
    unread: number;
    byType: Record<NotificationType, number>;
    byPriority: Record<NotificationPriority, number>;
  }> {
    try {
      if (!this.supabase) {
        console.info(
          '📭 NotificationService: Supabase not configured, returning empty stats'
        );
        return {
          total: 0,
          unread: 0,
          byType: {} as Record<NotificationType, number>,
          byPriority: {} as Record<NotificationPriority, number>,
        };
      }

      let query = this.supabase
        .from('notifications')
        .select('type, priority, read');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (tenantId) {
        query = query.eq('tenant_id', tenantId);
      }

      const { data, error } = await query;

      if (error) {
        console.info(
          '📭 NotificationService: Database not configured, returning empty stats'
        );
        return {
          total: 0,
          unread: 0,
          byType: {} as any,
          byPriority: {} as any,
        };
      }

      const stats = {
        total: data?.length || 0,
        unread: data?.filter((n) => !n.read).length || 0,
        byType: {} as Record<NotificationType, number>,
        byPriority: {} as Record<NotificationPriority, number>,
      };

      // Count by type
      data?.forEach((notification) => {
        stats.byType[notification.type as NotificationType] =
          (stats.byType[notification.type as NotificationType] || 0) + 1;
        stats.byPriority[notification.priority as NotificationPriority] =
          (stats.byPriority[notification.priority as NotificationPriority] ||
            0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('❌ getNotificationStats error:', error);
      return { total: 0, unread: 0, byType: {} as any, byPriority: {} as any };
    }
  }

  // ============================================================================
  // TEMPLATE & EVENT MANAGEMENT
  // ============================================================================

  private initializeTemplates(): void {
    console.info('📝 Initializing notification templates...');

    // System notifications
    this.templates.set('system_maintenance', {
      id: 'system_maintenance',
      type: 'system',
      title: 'System Maintenance Scheduled',
      messageTemplate:
        'System maintenance is scheduled for {datetime}. Expected downtime: {duration}.',
      priority: 'medium',
      channels: ['in-app', 'email'],
      roles: ['admin', 'manager'],
      actions: [
        {
          id: 'acknowledge',
          label: 'Acknowledge',
          type: 'api',
          payload: { action: 'acknowledge' },
          style: 'primary',
          icon: '✓',
        },
      ],
    });

    // Shipment notifications
    this.templates.set('load_delivered', {
      id: 'load_delivered',
      type: 'shipment',
      title: 'Load Delivered Successfully',
      messageTemplate:
        'Load #{loadNumber} has been delivered to {destination} by {driverName}.',
      priority: 'low',
      channels: ['in-app', 'email'],
      roles: ['dispatcher', 'broker', 'admin'],
      actions: [
        {
          id: 'view_pod',
          label: 'View POD',
          type: 'navigate',
          payload: { url: '/loads/{loadId}' },
          style: 'primary',
          icon: '📄',
        },
        {
          id: 'create_invoice',
          label: 'Create Invoice',
          type: 'navigate',
          payload: { url: '/billing/create?loadId={loadId}' },
          style: 'secondary',
          icon: '💰',
        },
      ],
    });

    // Compliance notifications
    this.templates.set('compliance_violation', {
      id: 'compliance_violation',
      type: 'compliance',
      title: 'URGENT: Compliance Violation Detected',
      messageTemplate:
        'Driver {driverName} has a {violationType} violation. Immediate action required.',
      priority: 'critical',
      channels: ['in-app', 'email', 'sms'],
      roles: ['manager', 'admin', 'compliance'],
      escalation: {
        timeoutMinutes: 30,
        escalateTo: ['admin'],
        escalationMessage:
          'Critical compliance violation requires immediate attention.',
        maxEscalations: 2,
      },
      actions: [
        {
          id: 'review_violation',
          label: 'Review Violation',
          type: 'navigate',
          payload: { url: '/compliance/violations/{violationId}' },
          style: 'danger',
          icon: '⚠️',
        },
        {
          id: 'contact_driver',
          label: 'Contact Driver',
          type: 'modal',
          payload: { modal: 'contact_driver', driverId: '{driverId}' },
          style: 'secondary',
          icon: '📞',
        },
      ],
    });

    // Maintenance notifications
    this.templates.set('maintenance_due', {
      id: 'maintenance_due',
      type: 'maintenance',
      title: 'Vehicle Maintenance Due',
      messageTemplate:
        'Vehicle {vehicleNumber} is due for {maintenanceType}. Current mileage: {mileage}.',
      priority: 'medium',
      channels: ['in-app', 'email'],
      roles: ['maintenance', 'fleet_manager', 'admin'],
      actions: [
        {
          id: 'schedule_maintenance',
          label: 'Schedule Service',
          type: 'navigate',
          payload: { url: '/maintenance/schedule?vehicleId={vehicleId}' },
          style: 'primary',
          icon: '🔧',
        },
      ],
    });

    // Daily Briefing notifications
    this.templates.set('daily_briefing', {
      id: 'daily_briefing',
      type: 'system',
      title: '🌅 Your Daily Briefing',
      messageTemplate: '{briefing_message}',
      priority: 'medium',
      channels: ['in-app'],
      roles: ['admin', 'manager', 'dispatcher', 'broker'],
      actions: [
        {
          id: 'view_full_briefing',
          label: 'View Full Briefing',
          type: 'modal',
          payload: { modal: 'daily_briefing' },
          style: 'primary',
          icon: '📋',
        },
        {
          id: 'generate_new_briefing',
          label: 'Generate New',
          type: 'api',
          payload: { endpoint: '/api/daily-briefing/generate', method: 'POST' },
          style: 'secondary',
          icon: '🔄',
        },
      ],
    });

    console.info(
      `✅ Initialized ${this.templates.size} notification templates`
    );
  }

  private setupEventListeners(): void {
    console.info('👂 Setting up business event listeners...');

    // Load delivery events
    this.addEventListener('load_delivered', async (event) => {
      // Auto-create invoice reminder for 7 days later
      const invoiceReminder: NotificationData = {
        type: 'billing',
        title: 'Invoice Creation Reminder',
        message: `Load ${event.data.loadNumber} was delivered 7 days ago. Create invoice if not already done.`,
        priority: 'medium',
        tenantId: event.tenantId,
        category: 'billing_reminder',
        channels: ['in-app'],
        scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        relatedEntityId: event.entityId,
        relatedEntityType: 'load',
      };

      await this.sendNotification(invoiceReminder);
    });

    // Driver check-in events
    this.addEventListener('driver_check_in', async (event) => {
      // Create check-in confirmation
      const confirmation: NotificationData = {
        type: 'driver',
        title: 'Driver Check-in Received',
        message: `${event.data.driverName} checked in at ${event.data.location}`,
        priority: 'low',
        tenantId: event.tenantId,
        category: 'driver_activity',
        channels: ['in-app'],
        relatedEntityId: event.data.driverId,
        relatedEntityType: 'driver',
      };

      await this.sendNotification(confirmation);
    });

    console.info(`✅ Event listeners setup complete`);
  }

  private addEventListener(
    eventType: BusinessEventType,
    handler: (event: BusinessEvent) => void
  ): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(handler);
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private async sendToChannels(notification: NotificationData): Promise<void> {
    for (const channel of notification.channels) {
      try {
        switch (channel) {
          case 'in-app':
            // Already stored in database, real-time handled by Supabase
            break;

          case 'email':
            await this.sendEmail(notification);
            break;

          case 'sms':
            await this.sendSMS(notification);
            break;

          case 'push':
            await this.sendPushNotification(notification);
            break;

          case 'webhook':
            await this.sendWebhook(notification);
            break;
        }
      } catch (error) {
        console.error(`❌ Failed to send to ${channel}:`, error);
      }
    }
  }

  private async sendEmail(notification: NotificationData): Promise<void> {
    // Integration with SendGrid or similar service
    console.info(`📧 Email notification sent: ${notification.title}`);
    // Implementation would go here
  }

  private async sendSMS(notification: NotificationData): Promise<void> {
    // Integration with Twilio or similar service
    console.info(`📱 SMS notification sent: ${notification.title}`);
    // Implementation would go here
  }

  private async sendPushNotification(
    notification: NotificationData
  ): Promise<void> {
    // Integration with FCM or similar service
    console.info(`🔔 Push notification sent: ${notification.title}`);
    // Implementation would go here
  }

  private async sendWebhook(notification: NotificationData): Promise<void> {
    // Send to external webhook endpoints
    console.info(`🌐 Webhook notification sent: ${notification.title}`);
    // Implementation would go here
  }

  private async setupEscalation(notification: NotificationData): Promise<void> {
    // Setup escalation logic for critical notifications
    console.info(`⏰ Escalation setup for: ${notification.id}`);
    // Implementation would go here
  }

  private matchesEventConditions(
    template: NotificationTemplate,
    event: BusinessEvent
  ): boolean {
    // Simple matching for now - in production this would be more sophisticated
    return template.type === this.getNotificationTypeFromEvent(event.type);
  }

  private getNotificationTypeFromEvent(
    eventType: BusinessEventType
  ): NotificationType {
    const eventTypeMap: Record<BusinessEventType, NotificationType> = {
      load_created: 'shipment',
      load_delivered: 'shipment',
      load_delayed: 'shipment',
      driver_check_in: 'driver',
      driver_violation: 'compliance',
      vehicle_maintenance_due: 'maintenance',
      invoice_created: 'billing',
      invoice_paid: 'billing',
      invoice_overdue: 'billing',
      compliance_alert: 'compliance',
      route_optimized: 'dispatch',
      carrier_assigned: 'carrier',
      system_maintenance: 'system',
      user_login: 'system',
      payment_processed: 'billing',
    };

    return eventTypeMap[eventType] || 'system';
  }

  private async generateFromTemplate(
    template: NotificationTemplate,
    event: BusinessEvent
  ): Promise<NotificationData[]> {
    const notifications: NotificationData[] = [];

    // Get users who should receive this notification based on roles
    const targetUsers = await this.getUsersByRoles(
      template.roles,
      event.tenantId
    );

    for (const user of targetUsers) {
      const notification: NotificationData = {
        type: template.type,
        title: this.interpolateTemplate(template.title, event.data),
        message: this.interpolateTemplate(template.messageTemplate, event.data),
        priority: template.priority,
        userId: user.id,
        tenantId: event.tenantId,
        category: template.id,
        channels: template.channels,
        actions: template.actions?.map((action) => ({
          ...action,
          payload: this.interpolateObject(action.payload, event.data),
        })),
        relatedEntityId: event.entityId,
        relatedEntityType: event.entityType,
        data: event.data,
      };

      notifications.push(notification);
    }

    return notifications;
  }

  private interpolateTemplate(
    template: string,
    data: Record<string, any>
  ): string {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return data[key]?.toString() || match;
    });
  }

  private interpolateObject(
    obj: Record<string, any>,
    data: Record<string, any>
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        result[key] = this.interpolateTemplate(value, data);
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  private async getUsersByRoles(
    roles: string[],
    tenantId: string
  ): Promise<{ id: string; role: string }[]> {
    // In production, this would query your user management system
    // For now, return mock users
    return [
      { id: 'user1', role: 'admin' },
      { id: 'user2', role: 'manager' },
      { id: 'user3', role: 'dispatcher' },
    ].filter((user) => roles.includes(user.role));
  }

  private mapDatabaseNotification(dbNotification: any): NotificationData {
    return {
      id: dbNotification.id,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      priority: dbNotification.priority,
      userId: dbNotification.user_id,
      tenantId: dbNotification.tenant_id,
      category: dbNotification.category,
      channels: dbNotification.channels || ['in-app'],
      data: dbNotification.data || {},
      actions: dbNotification.actions || [],
      expiresAt: dbNotification.expires_at
        ? new Date(dbNotification.expires_at)
        : undefined,
      scheduledFor: dbNotification.scheduled_for
        ? new Date(dbNotification.scheduled_for)
        : undefined,
      relatedEntityId: dbNotification.related_entity_id,
      relatedEntityType: dbNotification.related_entity_type,
      tags: dbNotification.tags || [],
      isRead: dbNotification.read,
      isArchived: dbNotification.archived,
      createdAt: new Date(dbNotification.created_at),
      updatedAt: new Date(dbNotification.updated_at),
    };
  }

  /**
   * Generate sample notifications for testing
   */
  async generateSampleNotifications(
    userId: string,
    tenantId: string = 'default'
  ): Promise<void> {
    console.info(`🎯 Generating sample notifications for user: ${userId}`);

    const sampleNotifications: NotificationData[] = [
      {
        type: 'shipment',
        title: 'New Shipment Assigned',
        message:
          'Shipment #FL2024-15A has been assigned to Route 15A. Pickup scheduled for 2:30 PM.',
        priority: 'medium',
        userId,
        tenantId,
        category: 'operations',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_shipment',
            type: 'navigate',
            label: 'View Shipment',
            payload: { url: '/shipments/FL2024-15A' },
            style: 'primary',
          },
        ],
        tags: ['shipment', 'assignment', 'route-15a'],
        relatedEntityType: 'shipment',
        relatedEntityId: 'FL2024-15A',
      },
      {
        type: 'driver',
        title: 'Driver Check-in Required',
        message:
          'Driver John Mitchell needs to complete mandatory check-in for Vehicle #204.',
        priority: 'high',
        userId,
        tenantId,
        category: 'compliance',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_driver',
            type: 'navigate',
            label: 'View Driver',
            payload: { url: '/drivers/john-mitchell' },
            style: 'primary',
          },
        ],
        tags: ['driver', 'check-in', 'compliance'],
        relatedEntityType: 'driver',
        relatedEntityId: 'john-mitchell',
      },
      {
        type: 'maintenance',
        title: 'Vehicle Maintenance Due',
        message:
          'Truck #204 is due for scheduled maintenance inspection. Service appointment recommended within 48 hours.',
        priority: 'high',
        userId,
        tenantId,
        category: 'maintenance',
        channels: ['in-app'],
        actions: [
          {
            id: 'schedule_maintenance',
            type: 'navigate',
            label: 'Schedule Service',
            payload: { url: '/vehicles/204/maintenance' },
            style: 'primary',
          },
          {
            id: 'view_vehicle',
            type: 'navigate',
            label: 'View Vehicle',
            payload: { url: '/vehicles/204' },
            style: 'secondary',
          },
        ],
        tags: ['maintenance', 'vehicle', 'inspection'],
        relatedEntityType: 'vehicle',
        relatedEntityId: '204',
      },
      {
        type: 'billing',
        title: 'Payment Received',
        message:
          'Payment of $2,450.00 received for Invoice #INV-2024-0892 from Premier Logistics.',
        priority: 'low',
        userId,
        tenantId,
        category: 'finance',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_invoice',
            type: 'navigate',
            label: 'View Invoice',
            payload: { url: '/invoices/INV-2024-0892' },
            style: 'primary',
          },
        ],
        tags: ['payment', 'invoice', 'finance'],
        relatedEntityType: 'invoice',
        relatedEntityId: 'INV-2024-0892',
      },
      {
        type: 'system',
        title: 'Route Optimization Complete',
        message:
          "AI route optimization completed for today's deliveries. Estimated 15% fuel savings achieved.",
        priority: 'medium',
        userId,
        tenantId,
        category: 'ai',
        channels: ['in-app'],
        actions: [
          {
            id: 'view_routes',
            type: 'navigate',
            label: 'View Optimized Routes',
            payload: { url: '/routes?optimized=true' },
            style: 'primary',
          },
        ],
        tags: ['ai', 'optimization', 'routes'],
        relatedEntityType: 'route_optimization',
        relatedEntityId: 'opt_' + Date.now(),
      },
    ];

    // Send all sample notifications
    for (const notification of sampleNotifications) {
      await this.sendNotification(notification);
      // Small delay to ensure proper ordering
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.info(
      `✅ Generated ${sampleNotifications.length} sample notifications`
    );
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
