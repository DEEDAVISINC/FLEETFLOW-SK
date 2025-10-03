/**
 * FLEETFLOW WEBSOCKET SERVICE
 * Reliable WebSocket connection with auto-reconnection
 */

export type WebSocketMessage = {
  type: 'NOTIFICATION' | 'SHIPMENT_UPDATE' | 'DOCUMENT_UPDATE' | 'MESSAGE';
  data: any;
  timestamp: Date;
};

export type WebSocketListener = (message: WebSocketMessage) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private socket: WebSocket | null = null;
  private listeners: Set<WebSocketListener> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isConnecting = false;
  private shouldReconnect = true;
  private userId: string | null = null;

  private constructor() {}

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(userId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    if (this.isConnecting) {
      console.log('WebSocket connection in progress');
      return;
    }

    this.userId = userId;
    this.shouldReconnect = true;
    this.isConnecting = true;

    try {
      // In production: Use your WebSocket server URL
      // For development: Use local mock or test server
      const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080';

      console.log(`Connecting to WebSocket: ${wsUrl}`);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;

        // Send authentication message
        this.send({
          type: 'AUTH',
          userId: this.userId,
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          message.timestamp = new Date(message.timestamp);

          // Notify all listeners
          this.listeners.forEach((listener) => {
            try {
              listener(message);
            } catch (error) {
              console.error('Error in WebSocket listener:', error);
            }
          });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };

      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.socket = null;

        // Attempt to reconnect
        if (
          this.shouldReconnect &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.reconnectAttempts++;
          console.log(
            `Reconnecting... (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
          );
          setTimeout(() => {
            if (this.userId) {
              this.connect(this.userId);
            }
          }, this.reconnectDelay * this.reconnectAttempts);
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      this.isConnecting = false;
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.shouldReconnect = false;
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }

  /**
   * Send message to WebSocket server
   */
  public send(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message not sent:', message);
    }
  }

  /**
   * Subscribe to WebSocket messages
   */
  public subscribe(listener: WebSocketListener): () => void {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check if WebSocket is connected
   */
  public isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection status
   */
  public getStatus(): 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED' {
    if (this.socket?.readyState === WebSocket.OPEN) return 'CONNECTED';
    if (this.isConnecting) return 'CONNECTING';
    return 'DISCONNECTED';
  }
}

export const webSocketService = WebSocketService.getInstance();
export default webSocketService;
