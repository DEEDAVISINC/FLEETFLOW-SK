'use client';

import { FleetFlowNotification } from './FleetFlowNotificationManager';

export interface WebSocketMessage {
  type:
    | 'notification'
    | 'broadcast_notification'
    | 'register'
    | 'unregister'
    | 'ping'
    | 'pong'
    | 'system_status';
  notification?: FleetFlowNotification;
  service?: string;
  userId?: string;
  portal?: string;
  timestamp: string;
  data?: any;
}

export interface ConnectionStatus {
  connected: boolean;
  websocketUrl: string;
  lastPing: string;
  connectionAttempts: number;
  maxReconnectAttempts: number;
  reconnectDelay: number;
}

export class WebSocketNotificationService {
  private static instance: WebSocketNotificationService;
  private websocket: WebSocket | null = null;
  private messageHandlers: Map<string, Function[]> = new Map();
  private connectionStatus: ConnectionStatus = {
    connected: false,
    websocketUrl: '',
    lastPing: '',
    connectionAttempts: 0,
    maxReconnectAttempts: 10,
    reconnectDelay: 5000,
  };
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isReconnecting: boolean = false;

  private constructor() {
    this.initializeConnection();
    console.info('🔗 WebSocketNotificationService initialized');
  }

  public static getInstance(): WebSocketNotificationService {
    if (!WebSocketNotificationService.instance) {
      WebSocketNotificationService.instance =
        new WebSocketNotificationService();
    }
    return WebSocketNotificationService.instance;
  }

  // 🌐 INITIALIZE WEBSOCKET CONNECTION
  private initializeConnection(): void {
    try {
      // Determine WebSocket URL from environment or fallback
      const wsUrl = this.getWebSocketUrl();
      this.connectionStatus.websocketUrl = wsUrl;

      console.info(`🔌 Attempting WebSocket connection to: ${wsUrl}`);

      this.websocket = new WebSocket(wsUrl);
      this.setupEventListeners();
    } catch (error) {
      console.warn('⚠️ WebSocket initialization failed:', error);
      this.scheduleReconnect();
    }
  }

  // 🌍 GET WEBSOCKET URL
  private getWebSocketUrl(): string {
    // Check environment variables for WebSocket configuration
    if (typeof window !== 'undefined') {
      // Client-side - use environment variable or construct from location
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.hostname;
      const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '3001';

      // Try environment variable first
      if (process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
        return process.env.NEXT_PUBLIC_WEBSOCKET_URL;
      }

      // Construct WebSocket URL
      return `${protocol}//${host}:${port}/notifications`;
    }

    // Server-side fallback
    return process.env.WEBSOCKET_URL || 'ws://localhost:3001/notifications';
  }

  // 📡 SETUP EVENT LISTENERS
  private setupEventListeners(): void {
    if (!this.websocket) return;

    this.websocket.onopen = (event) => {
      console.info('✅ WebSocket connected');

      this.connectionStatus.connected = true;
      this.connectionStatus.connectionAttempts = 0;
      this.isReconnecting = false;

      // Start heartbeat
      this.startHeartbeat();

      // Send initial registration
      this.sendMessage({
        type: 'register',
        service: 'fleetflow-notifications-client',
        timestamp: new Date().toISOString(),
        data: {
          userAgent: navigator?.userAgent || 'Unknown',
          url: window?.location?.href || 'Unknown',
          capabilities: ['notifications', 'real-time-sync'],
        },
      });

      // Notify handlers
      this.notifyHandlers('connected', { status: this.connectionStatus });
    };

    this.websocket.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        this.handleIncomingMessage(message);
      } catch (error) {
        console.warn('⚠️ Invalid WebSocket message format:', event.data, error);
      }
    };

    this.websocket.onclose = (event) => {
      console.info('🔌 WebSocket disconnected:', event.code, event.reason);

      this.connectionStatus.connected = false;
      this.stopHeartbeat();

      // Notify handlers
      this.notifyHandlers('disconnected', {
        code: event.code,
        reason: event.reason,
        status: this.connectionStatus,
      });

      // Schedule reconnection if not a clean close
      if (event.code !== 1000 && !this.isReconnecting) {
        this.scheduleReconnect();
      }
    };

    this.websocket.onerror = (error) => {
      console.error('❌ WebSocket error:', error);

      this.notifyHandlers('error', { error, status: this.connectionStatus });

      // If we can't connect initially, try fallback
      if (!this.connectionStatus.connected) {
        this.scheduleReconnect();
      }
    };
  }

  // 📥 HANDLE INCOMING MESSAGES
  private handleIncomingMessage(message: WebSocketMessage): void {
    console.info('📨 WebSocket message received:', message.type);

    switch (message.type) {
      case 'notification':
        if (message.notification) {
          this.notifyHandlers('notification_received', message.notification);
        }
        break;

      case 'broadcast_notification':
        if (message.notification) {
          this.notifyHandlers('notification_broadcast', message.notification);
        }
        break;

      case 'ping':
        // Respond to ping with pong
        this.sendMessage({
          type: 'pong',
          timestamp: new Date().toISOString(),
        });
        break;

      case 'pong':
        // Update last ping time
        this.connectionStatus.lastPing = message.timestamp;
        break;

      case 'system_status':
        this.notifyHandlers('system_status', message.data);
        break;

      default:
        console.info('📋 Unknown message type:', message.type, message);
        this.notifyHandlers('unknown_message', message);
    }
  }

  // 📤 SEND MESSAGE
  public sendMessage(message: WebSocketMessage): boolean {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not ready, message queued:', message.type);

      // TODO: Implement message queuing for offline support
      return false;
    }

    try {
      this.websocket.send(JSON.stringify(message));
      console.info('📤 WebSocket message sent:', message.type);
      return true;
    } catch (error) {
      console.error('❌ Failed to send WebSocket message:', error);
      return false;
    }
  }

  // 🚀 BROADCAST NOTIFICATION
  public broadcastNotification(notification: FleetFlowNotification): boolean {
    return this.sendMessage({
      type: 'broadcast_notification',
      notification,
      timestamp: new Date().toISOString(),
    });
  }

  // 📢 REGISTER MESSAGE HANDLER
  public onMessage(eventType: string, handler: Function): () => void {
    if (!this.messageHandlers.has(eventType)) {
      this.messageHandlers.set(eventType, []);
    }

    this.messageHandlers.get(eventType)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(eventType);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  }

  // 🔔 NOTIFY HANDLERS
  private notifyHandlers(eventType: string, data: any): void {
    const handlers = this.messageHandlers.get(eventType);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error('❌ Message handler error:', error);
        }
      });
    }
  }

  // 💓 START HEARTBEAT
  private startHeartbeat(): void {
    this.stopHeartbeat(); // Clear any existing heartbeat

    this.heartbeatInterval = setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.sendMessage({
          type: 'ping',
          timestamp: new Date().toISOString(),
        });
      } else {
        this.stopHeartbeat();
      }
    }, 30000); // Ping every 30 seconds
  }

  // 💔 STOP HEARTBEAT
  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  // 🔄 SCHEDULE RECONNECT
  private scheduleReconnect(): void {
    if (
      this.isReconnecting ||
      this.connectionStatus.connectionAttempts >=
        this.connectionStatus.maxReconnectAttempts
    ) {
      console.warn(
        '⚠️ Max reconnection attempts reached or already reconnecting'
      );
      return;
    }

    this.isReconnecting = true;
    this.connectionStatus.connectionAttempts++;

    const delay = Math.min(
      this.connectionStatus.reconnectDelay *
        Math.pow(2, this.connectionStatus.connectionAttempts - 1),
      30000 // Max 30 second delay
    );

    console.info(
      `🔄 Scheduling reconnect attempt ${this.connectionStatus.connectionAttempts} in ${delay}ms`
    );

    this.reconnectTimeout = setTimeout(() => {
      console.info(
        `🔄 Reconnect attempt ${this.connectionStatus.connectionAttempts}`
      );

      // Close existing connection
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }

      // Try to reconnect
      this.initializeConnection();
    }, delay);
  }

  // 🔗 MANUAL RECONNECT
  public reconnect(): void {
    console.info('🔄 Manual reconnect requested');

    // Clear any pending reconnect
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Reset connection attempts
    this.connectionStatus.connectionAttempts = 0;
    this.isReconnecting = false;

    // Close existing connection
    if (this.websocket) {
      this.websocket.close();
    }

    // Reconnect immediately
    setTimeout(() => this.initializeConnection(), 1000);
  }

  // 📊 GET CONNECTION STATUS
  public getConnectionStatus(): ConnectionStatus {
    return { ...this.connectionStatus };
  }

  // 🏥 HEALTH CHECK
  public getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    websocketState: string;
    lastPing: string;
    connectionAttempts: number;
    uptime: number;
  } {
    const websocketState = this.websocket
      ? ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][this.websocket.readyState]
      : 'NOT_INITIALIZED';

    let status: 'healthy' | 'degraded' | 'unhealthy';

    if (this.connectionStatus.connected && websocketState === 'OPEN') {
      status = 'healthy';
    } else if (
      this.connectionStatus.connectionAttempts > 0 &&
      this.connectionStatus.connectionAttempts < 5
    ) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      websocketState,
      lastPing: this.connectionStatus.lastPing || 'Never',
      connectionAttempts: this.connectionStatus.connectionAttempts,
      uptime: this.connectionStatus.connected ? Date.now() : 0,
    };
  }

  // 🧪 SEND TEST MESSAGE
  public sendTestMessage(): boolean {
    return this.sendMessage({
      type: 'notification',
      timestamp: new Date().toISOString(),
      data: {
        test: true,
        message: 'WebSocket test message from FleetFlow client',
        timestamp: new Date().toISOString(),
      },
    });
  }

  // 🔌 DISCONNECT
  public disconnect(): void {
    console.info('🔌 Disconnecting WebSocket');

    // Clear timers
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close connection
    if (this.websocket) {
      this.websocket.close(1000, 'Client disconnect');
      this.websocket = null;
    }

    // Update status
    this.connectionStatus.connected = false;
    this.isReconnecting = false;
  }

  // 🗑️ CLEANUP
  public destroy(): void {
    console.info('🗑️ Destroying WebSocketNotificationService');

    this.disconnect();
    this.messageHandlers.clear();

    // Clear singleton instance
    if (WebSocketNotificationService.instance === this) {
      // @ts-ignore
      WebSocketNotificationService.instance = null;
    }
  }
}

// 🌟 EXPORT SINGLETON INSTANCE
export const webSocketNotificationService =
  WebSocketNotificationService.getInstance();
export default webSocketNotificationService;
