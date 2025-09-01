// lib/supabase-realtime.ts
// Real-time subscription utilities for FleetFlow

import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from '@supabase/supabase-js';
import { createRealtimeClient } from './supabase-config';

// ================================================================
// TYPE DEFINITIONS
// ================================================================

export type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export interface SubscriptionOptions {
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  enableLogs?: boolean;
}

export interface LoadUpdate {
  id: string;
  load_number: string;
  status: string;
  company_id: string;
  driver_id?: string;
  broker_id?: string;
  updated_at: string;
}

export interface NotificationUpdate {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

export interface DriverLocationUpdate {
  id: string;
  name: string;
  current_location: {
    type: string;
    coordinates: [number, number];
  };
  company_id: string;
  current_load_id?: string;
  updated_at: string;
}

// ================================================================
// SUBSCRIPTION MANAGER CLASS
// ================================================================

class RealtimeSubscriptionManager {
  private client = createRealtimeClient({ enableLogs: false });
  private subscriptions = new Map<string, RealtimeChannel>();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private options: SubscriptionOptions = {}) {
    this.setupConnectionHandlers();
  }

  private setupConnectionHandlers() {
    this.client.realtime.onOpen(() => {
      console.info('🔗 FleetFlow realtime connected');
      this.reconnectAttempts = 0;
      this.options.onConnect?.();
    });

    this.client.realtime.onClose(() => {
      console.info('🔌 FleetFlow realtime disconnected');
      this.options.onDisconnect?.();
      this.handleReconnect();
    });

    this.client.realtime.onError((error) => {
      console.error('❌ FleetFlow realtime error:', error);
      this.options.onError?.(new Error(`Realtime error: ${error}`));
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 10000);

      console.info(
        `🔄 Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`
      );

      setTimeout(() => {
        this.client.realtime.connect();
      }, delay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.options.onError?.(
        new Error('Failed to reconnect after maximum attempts')
      );
    }
  }

  // ================================================================
  // LOAD SUBSCRIPTIONS
  // ================================================================

  subscribeToLoadUpdates(
    companyId: string,
    callback: (payload: RealtimePostgresChangesPayload<LoadUpdate>) => void
  ): string {
    const channelId = `loads-${companyId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          if (this.options.enableLogs) {
            console.info('📦 Load update:', payload);
          }
          callback(payload as RealtimePostgresChangesPayload<LoadUpdate>);
        }
      )
      .subscribe((status) => {
        console.info(`🔔 Load subscription status: ${status}`);
      });

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  subscribeToSpecificLoad(
    loadId: string,
    callback: (payload: RealtimePostgresChangesPayload<LoadUpdate>) => void
  ): string {
    const channelId = `load-${loadId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'loads',
          filter: `id=eq.${loadId}`,
        },
        (payload) => {
          if (this.options.enableLogs) {
            console.info('📦 Specific load update:', payload);
          }
          callback(payload as RealtimePostgresChangesPayload<LoadUpdate>);
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  // ================================================================
  // NOTIFICATION SUBSCRIPTIONS
  // ================================================================

  subscribeToNotifications(
    userId: string,
    callback: (
      payload: RealtimePostgresChangesPayload<NotificationUpdate>
    ) => void
  ): string {
    const channelId = `notifications-${userId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (this.options.enableLogs) {
            console.info('🔔 New notification:', payload);
          }
          callback(
            payload as RealtimePostgresChangesPayload<NotificationUpdate>
          );
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  // ================================================================
  // DRIVER LOCATION SUBSCRIPTIONS
  // ================================================================

  subscribeToDriverLocations(
    companyId: string,
    callback: (
      payload: RealtimePostgresChangesPayload<DriverLocationUpdate>
    ) => void
  ): string {
    const channelId = `driver-locations-${companyId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          // Only trigger if location actually changed
          const oldRecord = payload.old as DriverLocationUpdate;
          const newRecord = payload.new as DriverLocationUpdate;

          if (oldRecord.current_location !== newRecord.current_location) {
            if (this.options.enableLogs) {
              console.info('📍 Driver location update:', payload);
            }
            callback(
              payload as RealtimePostgresChangesPayload<DriverLocationUpdate>
            );
          }
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  subscribeToSpecificDriver(
    driverId: string,
    callback: (
      payload: RealtimePostgresChangesPayload<DriverLocationUpdate>
    ) => void
  ): string {
    const channelId = `driver-${driverId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          filter: `id=eq.${driverId}`,
        },
        (payload) => {
          if (this.options.enableLogs) {
            console.info('📍 Specific driver update:', payload);
          }
          callback(
            payload as RealtimePostgresChangesPayload<DriverLocationUpdate>
          );
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  // ================================================================
  // DOCUMENT SUBSCRIPTIONS
  // ================================================================

  subscribeToDocuments(
    companyId: string,
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  ): string {
    const channelId = `documents-${companyId}`;

    const channel = this.client
      .channel(channelId)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents',
          filter: `company_id=eq.${companyId}`,
        },
        (payload) => {
          if (this.options.enableLogs) {
            console.info('📄 Document update:', payload);
          }
          callback(payload);
        }
      )
      .subscribe();

    this.subscriptions.set(channelId, channel);
    return channelId;
  }

  // ================================================================
  // SUBSCRIPTION MANAGEMENT
  // ================================================================

  unsubscribe(channelId: string): void {
    const channel = this.subscriptions.get(channelId);
    if (channel) {
      channel.unsubscribe();
      this.subscriptions.delete(channelId);
      console.info(`🔕 Unsubscribed from ${channelId}`);
    }
  }

  unsubscribeAll(): void {
    console.info('🔕 Unsubscribing from all channels...');
    this.subscriptions.forEach((channel, channelId) => {
      channel.unsubscribe();
    });
    this.subscriptions.clear();
  }

  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  getConnectionStatus(): string {
    return this.client.realtime.connection?.readyState === 1
      ? 'connected'
      : 'disconnected';
  }

  // ================================================================
  // CLEANUP
  // ================================================================

  destroy(): void {
    this.unsubscribeAll();
    this.client.realtime.disconnect();
    console.info('🔌 Realtime manager destroyed');
  }
}

// ================================================================
// SINGLETON INSTANCE
// ================================================================

let realtimeManager: RealtimeSubscriptionManager | null = null;

export const getRealtimeManager = (
  options?: SubscriptionOptions
): RealtimeSubscriptionManager => {
  if (!realtimeManager) {
    realtimeManager = new RealtimeSubscriptionManager(options);
  }
  return realtimeManager;
};

export const destroyRealtimeManager = (): void => {
  if (realtimeManager) {
    realtimeManager.destroy();
    realtimeManager = null;
  }
};

// ================================================================
// CONVENIENCE HOOKS
// ================================================================

// React hook for load updates
export const useLoadUpdates = (
  companyId: string,
  onUpdate: (payload: RealtimePostgresChangesPayload<LoadUpdate>) => void,
  enabled = true
) => {
  const manager = getRealtimeManager();

  React.useEffect(() => {
    if (!enabled || !companyId) return;

    const subscriptionId = manager.subscribeToLoadUpdates(companyId, onUpdate);

    return () => {
      manager.unsubscribe(subscriptionId);
    };
  }, [companyId, enabled, onUpdate]);
};

// React hook for notifications
export const useNotifications = (
  userId: string,
  onNotification: (
    payload: RealtimePostgresChangesPayload<NotificationUpdate>
  ) => void,
  enabled = true
) => {
  const manager = getRealtimeManager();

  React.useEffect(() => {
    if (!enabled || !userId) return;

    const subscriptionId = manager.subscribeToNotifications(
      userId,
      onNotification
    );

    return () => {
      manager.unsubscribe(subscriptionId);
    };
  }, [userId, enabled, onNotification]);
};

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

export const formatRealtimePayload = (
  payload: RealtimePostgresChangesPayload<any>
) => {
  return {
    eventType: payload.eventType,
    table: payload.table,
    schema: payload.schema,
    new: payload.new,
    old: payload.old,
    commit_timestamp: payload.commit_timestamp,
  };
};

export const isLoadStatusChange = (
  payload: RealtimePostgresChangesPayload<LoadUpdate>
): boolean => {
  return (
    payload.eventType === 'UPDATE' &&
    payload.old &&
    payload.new &&
    payload.old.status !== payload.new.status
  );
};

export const isNewNotification = (
  payload: RealtimePostgresChangesPayload<NotificationUpdate>
): boolean => {
  return payload.eventType === 'INSERT';
};

export const isLocationUpdate = (
  payload: RealtimePostgresChangesPayload<DriverLocationUpdate>
): boolean => {
  return (
    payload.eventType === 'UPDATE' &&
    payload.old &&
    payload.new &&
    payload.old.current_location !== payload.new.current_location
  );
};

// Make React available for hooks
import React from 'react';

export default RealtimeSubscriptionManager;
