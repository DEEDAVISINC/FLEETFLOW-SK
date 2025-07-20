// CommunicationService for driver-dispatcher messaging
interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  type: 'text' | 'location' | 'photo' | 'document';
  attachments?: string[];
}

interface Conversation {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

class CommunicationServiceClass {
  private messages: { [driverId: string]: Message[] } = {
    'DRV-001': [
      {
        id: 'msg-001',
        from: 'Dispatch',
        to: 'DRV-001',
        content: 'Load LOAD-2024-001 assigned. Please confirm pickup time.',
        timestamp: '2024-12-23T08:00:00Z',
        read: true,
        priority: 'normal',
        type: 'text'
      },
      {
        id: 'msg-002',
        from: 'Dispatch',
        to: 'DRV-001',
        content: 'Weather alert: Heavy rain expected on your route. Drive safely.',
        timestamp: '2024-12-23T09:15:00Z',
        read: false,
        priority: 'high',
        type: 'text'
      }
    ],
    'DRV-002': [
      {
        id: 'msg-003',
        from: 'Dispatch',
        to: 'DRV-002',
        content: 'Great job on the Phoenix delivery! Load LOAD-2024-003 is ready for pickup.',
        timestamp: '2024-12-23T10:30:00Z',
        read: true,
        priority: 'normal',
        type: 'text'
      }
    ]
  };

  async getMessages(driverId: string): Promise<Message[]> {
    try {
      return this.messages[driverId] || [];
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  async sendMessage(from: string, to: string, content: string, priority: Message['priority'] = 'normal', type: Message['type'] = 'text'): Promise<boolean> {
    try {
      const message: Message = {
        id: `msg-${Date.now()}`,
        from,
        to,
        content,
        timestamp: new Date().toISOString(),
        read: false,
        priority,
        type
      };

      if (!this.messages[to]) {
        this.messages[to] = [];
      }

      this.messages[to].push(message);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  async markAsRead(driverId: string, messageId: string): Promise<boolean> {
    try {
      const messages = this.messages[driverId];
      if (!messages) {
        return false;
      }

      const message = messages.find(m => m.id === messageId);
      if (!message) {
        return false;
      }

      message.read = true;
      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  async getUnreadCount(driverId: string): Promise<number> {
    try {
      const messages = this.messages[driverId] || [];
      return messages.filter(m => !m.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  async sendLocationUpdate(driverId: string, latitude: number, longitude: number, message?: string): Promise<boolean> {
    try {
      const locationMessage = message || `Location update: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      return await this.sendMessage(driverId, 'Dispatch', locationMessage, 'normal', 'location');
    } catch (error) {
      console.error('Error sending location update:', error);
      return false;
    }
  }

  async sendEmergencyAlert(driverId: string, message: string): Promise<boolean> {
    try {
      return await this.sendMessage(driverId, 'Dispatch', `🚨 EMERGENCY: ${message}`, 'urgent', 'text');
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      return false;
    }
  }

  async getConversations(driverId: string): Promise<Conversation[]> {
    try {
      const messages = this.messages[driverId] || [];
      const conversations: { [participant: string]: Conversation } = {};

      messages.forEach(message => {
        const participant = message.from === driverId ? message.to : message.from;
        
        if (!conversations[participant]) {
          conversations[participant] = {
            id: `conv-${participant}`,
            participants: [driverId, participant],
            messages: [],
            lastMessage: message,
            unreadCount: 0
          };
        }

        conversations[participant].messages.push(message);
        if (message.timestamp > conversations[participant].lastMessage.timestamp) {
          conversations[participant].lastMessage = message;
        }
        if (!message.read && message.to === driverId) {
          conversations[participant].unreadCount++;
        }
      });

      return Object.values(conversations);
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }
}

export const CommunicationService = new CommunicationServiceClass(); 