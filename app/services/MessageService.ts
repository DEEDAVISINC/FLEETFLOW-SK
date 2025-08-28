/**
 * FleetFlow Intraoffice Message Service
 * Handles internal communications, memos, and announcements
 */

import { createClient } from '@supabase/supabase-js';
import { notificationService } from './NotificationService';

// ============================================================================
// INTERFACES & TYPES
// ============================================================================

export interface IntraofficeMessage {
  id?: string;
  subject: string;
  content: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: string;
  toUserIds: string[];
  toDepartments?: string[];
  toRoles?: string[];
  messageType: MessageType;
  priority: MessagePriority;
  status: MessageStatus;
  isRead: boolean;
  hasAttachments: boolean;
  attachments?: MessageAttachment[];
  conversationId?: string;
  parentMessageId?: string;
  tags?: string[];
  scheduledFor?: Date;
  expiresAt?: Date;
  requiresAcknowledgment: boolean;
  acknowledgments?: MessageAcknowledgment[];
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface MessageAcknowledgment {
  userId: string;
  userName: string;
  acknowledgedAt: Date;
  response?: string;
}

export interface MessageThread {
  conversationId: string;
  subject: string;
  participants: MessageParticipant[];
  messages: IntraofficeMessage[];
  lastActivity: Date;
  isActive: boolean;
  messageCount: number;
}

export interface MessageParticipant {
  userId: string;
  userName: string;
  userRole: string;
  joinedAt: Date;
  lastReadAt?: Date;
}

export interface MessageDraft {
  id?: string;
  subject: string;
  content: string;
  toUserIds: string[];
  toDepartments?: string[];
  toRoles?: string[];
  messageType: MessageType;
  priority: MessagePriority;
  requiresAcknowledgment: boolean;
  attachments?: File[];
  scheduledFor?: Date;
  userId: string;
  updatedAt: Date;
}

export type MessageType =
  | 'direct_message'
  | 'announcement'
  | 'memo'
  | 'department_update'
  | 'company_wide'
  | 'urgent_notice'
  | 'policy_update'
  | 'meeting_invite'
  | 'reply';

export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export type MessageStatus =
  | 'draft'
  | 'scheduled'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'acknowledged'
  | 'archived'
  | 'deleted';

export interface MessageFilters {
  messageType?: MessageType;
  priority?: MessagePriority;
  status?: MessageStatus;
  fromUserId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  hasAttachments?: boolean;
  requiresAcknowledgment?: boolean;
  unreadOnly?: boolean;
  conversationId?: string;
  searchQuery?: string;
}

// ============================================================================
// MESSAGE SERVICE CLASS
// ============================================================================

export class MessageService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    console.log('📬 MessageService initialized for intraoffice communications');
  }

  // ============================================================================
  // CORE MESSAGE OPERATIONS
  // ============================================================================

  /**
   * Send a new intraoffice message
   */
  async sendMessage(
    message: Omit<
      IntraofficeMessage,
      'id' | 'createdAt' | 'updatedAt' | 'status' | 'isRead'
    >
  ): Promise<string | null> {
    try {
      console.log(`📤 Sending ${message.messageType}: ${message.subject}`);

      // Generate unique ID
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const now = new Date();
      const fullMessage: IntraofficeMessage = {
        ...message,
        id: messageId,
        status:
          message.scheduledFor && message.scheduledFor > now
            ? 'scheduled'
            : 'sent',
        isRead: false,
        createdAt: now,
        updatedAt: now,
      };

      // Store in Supabase
      const { data, error } = await this.supabase
        .from('intraoffice_messages')
        .insert([
          {
            id: fullMessage.id,
            subject: fullMessage.subject,
            content: fullMessage.content,
            from_user_id: fullMessage.fromUserId,
            from_user_name: fullMessage.fromUserName,
            from_user_role: fullMessage.fromUserRole,
            to_user_ids: fullMessage.toUserIds,
            to_departments: fullMessage.toDepartments || [],
            to_roles: fullMessage.toRoles || [],
            message_type: fullMessage.messageType,
            priority: fullMessage.priority,
            status: fullMessage.status,
            is_read: fullMessage.isRead,
            has_attachments: fullMessage.hasAttachments,
            attachments: fullMessage.attachments || [],
            conversation_id: fullMessage.conversationId,
            parent_message_id: fullMessage.parentMessageId,
            tags: fullMessage.tags || [],
            scheduled_for: fullMessage.scheduledFor?.toISOString(),
            expires_at: fullMessage.expiresAt?.toISOString(),
            requires_acknowledgment: fullMessage.requiresAcknowledgment,
            acknowledgments: fullMessage.acknowledgments || [],
            created_at: fullMessage.createdAt.toISOString(),
            updated_at: fullMessage.updatedAt.toISOString(),
            tenant_id: fullMessage.tenantId,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to send message:', error);
        return null;
      }

      // Send notifications to recipients
      await this.createMessageNotifications(fullMessage);

      console.log(`✅ Message sent: ${messageId}`);
      return messageId;
    } catch (error) {
      console.error('❌ MessageService.sendMessage error:', error);
      return null;
    }
  }

  /**
   * Get user's messages with filters
   */
  async getUserMessages(
    userId: string,
    filters: MessageFilters = {},
    limit: number = 20,
    offset: number = 0
  ): Promise<{ messages: IntraofficeMessage[]; total: number }> {
    try {
      let query = this.supabase
        .from('intraoffice_messages')
        .select('*', { count: 'exact' })
        .or(`to_user_ids.cs.{${userId}},from_user_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (filters.messageType) {
        query = query.eq('message_type', filters.messageType);
      }
      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.fromUserId) {
        query = query.eq('from_user_id', filters.fromUserId);
      }
      if (filters.unreadOnly) {
        query = query.eq('is_read', false);
      }
      if (filters.conversationId) {
        query = query.eq('conversation_id', filters.conversationId);
      }
      if (filters.hasAttachments !== undefined) {
        query = query.eq('has_attachments', filters.hasAttachments);
      }
      if (filters.requiresAcknowledgment !== undefined) {
        query = query.eq(
          'requires_acknowledgment',
          filters.requiresAcknowledgment
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error('❌ Failed to fetch user messages:', error);
        return { messages: [], total: 0 };
      }

      const messages = data?.map(this.transformDbMessage) || [];

      return {
        messages,
        total: count || 0,
      };
    } catch (error) {
      console.error('❌ MessageService.getUserMessages error:', error);
      return { messages: [], total: 0 };
    }
  }

  /**
   * Get message conversation/thread
   */
  async getMessageThread(
    conversationId: string
  ): Promise<MessageThread | null> {
    try {
      const { data, error } = await this.supabase
        .from('intraoffice_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error || !data || data.length === 0) {
        console.error('❌ Failed to fetch message thread:', error);
        return null;
      }

      const messages = data.map(this.transformDbMessage);
      const firstMessage = messages[0];

      // Extract unique participants
      const participantMap = new Map<string, MessageParticipant>();

      messages.forEach((msg) => {
        // Add sender
        if (!participantMap.has(msg.fromUserId)) {
          participantMap.set(msg.fromUserId, {
            userId: msg.fromUserId,
            userName: msg.fromUserName,
            userRole: msg.fromUserRole,
            joinedAt: msg.createdAt,
          });
        }

        // Add recipients
        msg.toUserIds.forEach((toUserId) => {
          if (!participantMap.has(toUserId)) {
            participantMap.set(toUserId, {
              userId: toUserId,
              userName: 'User', // Would need to fetch from user service
              userRole: 'employee',
              joinedAt: msg.createdAt,
            });
          }
        });
      });

      return {
        conversationId,
        subject: firstMessage.subject,
        participants: Array.from(participantMap.values()),
        messages,
        lastActivity: messages[messages.length - 1].createdAt,
        isActive: true,
        messageCount: messages.length,
      };
    } catch (error) {
      console.error('❌ MessageService.getMessageThread error:', error);
      return null;
    }
  }

  /**
   * Reply to a message
   */
  async replyToMessage(
    parentMessageId: string,
    replyContent: string,
    fromUserId: string,
    fromUserName: string,
    fromUserRole: string,
    tenantId: string
  ): Promise<string | null> {
    try {
      // Get parent message to extract conversation details
      const { data: parentData, error: parentError } = await this.supabase
        .from('intraoffice_messages')
        .select('*')
        .eq('id', parentMessageId)
        .single();

      if (parentError || !parentData) {
        console.error('❌ Parent message not found:', parentError);
        return null;
      }

      const parentMessage = this.transformDbMessage(parentData);

      const reply: Omit<
        IntraofficeMessage,
        'id' | 'createdAt' | 'updatedAt' | 'status' | 'isRead'
      > = {
        subject: `Re: ${parentMessage.subject}`,
        content: replyContent,
        fromUserId,
        fromUserName,
        fromUserRole,
        toUserIds: [
          parentMessage.fromUserId,
          ...parentMessage.toUserIds.filter((id) => id !== fromUserId),
        ],
        messageType: 'reply',
        priority: parentMessage.priority,
        hasAttachments: false,
        conversationId: parentMessage.conversationId || parentMessage.id,
        parentMessageId,
        requiresAcknowledgment: false,
        tenantId,
      };

      return await this.sendMessage(reply);
    } catch (error) {
      console.error('❌ MessageService.replyToMessage error:', error);
      return null;
    }
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('intraoffice_messages')
        .update({
          is_read: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .contains('to_user_ids', [userId]);

      if (error) {
        console.error('❌ Failed to mark message as read:', error);
        return false;
      }

      console.log(`✅ Message marked as read: ${messageId}`);
      return true;
    } catch (error) {
      console.error('❌ MessageService.markMessageAsRead error:', error);
      return false;
    }
  }

  /**
   * Acknowledge message (for messages that require acknowledgment)
   */
  async acknowledgeMessage(
    messageId: string,
    userId: string,
    userName: string,
    response?: string
  ): Promise<boolean> {
    try {
      // Get current message
      const { data, error: fetchError } = await this.supabase
        .from('intraoffice_messages')
        .select('acknowledgments')
        .eq('id', messageId)
        .single();

      if (fetchError) {
        console.error(
          '❌ Failed to fetch message for acknowledgment:',
          fetchError
        );
        return false;
      }

      const currentAcknowledgments = data.acknowledgments || [];
      const newAcknowledgment: MessageAcknowledgment = {
        userId,
        userName,
        acknowledgedAt: new Date(),
        response,
      };

      const updatedAcknowledgments = [
        ...currentAcknowledgments.filter(
          (ack: MessageAcknowledgment) => ack.userId !== userId
        ),
        newAcknowledgment,
      ];

      const { error: updateError } = await this.supabase
        .from('intraoffice_messages')
        .update({
          acknowledgments: updatedAcknowledgments,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (updateError) {
        console.error('❌ Failed to acknowledge message:', updateError);
        return false;
      }

      console.log(`✅ Message acknowledged: ${messageId} by ${userName}`);
      return true;
    } catch (error) {
      console.error('❌ MessageService.acknowledgeMessage error:', error);
      return false;
    }
  }

  // ============================================================================
  // DRAFT OPERATIONS
  // ============================================================================

  /**
   * Save message as draft
   */
  async saveDraft(draft: MessageDraft): Promise<string | null> {
    try {
      const draftId =
        draft.id ||
        `draft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const { data, error } = await this.supabase
        .from('message_drafts')
        .upsert([
          {
            id: draftId,
            subject: draft.subject,
            content: draft.content,
            to_user_ids: draft.toUserIds,
            to_departments: draft.toDepartments || [],
            to_roles: draft.toRoles || [],
            message_type: draft.messageType,
            priority: draft.priority,
            requires_acknowledgment: draft.requiresAcknowledgment,
            scheduled_for: draft.scheduledFor?.toISOString(),
            user_id: draft.userId,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to save draft:', error);
        return null;
      }

      console.log(`💾 Draft saved: ${draftId}`);
      return draftId;
    } catch (error) {
      console.error('❌ MessageService.saveDraft error:', error);
      return null;
    }
  }

  /**
   * Get user's drafts
   */
  async getUserDrafts(userId: string): Promise<MessageDraft[]> {
    try {
      const { data, error } = await this.supabase
        .from('message_drafts')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('❌ Failed to fetch drafts:', error);
        return [];
      }

      return data?.map(this.transformDbDraft) || [];
    } catch (error) {
      console.error('❌ MessageService.getUserDrafts error:', error);
      return [];
    }
  }

  // ============================================================================
  // NOTIFICATION INTEGRATION
  // ============================================================================

  /**
   * Create notifications for message recipients
   */
  private async createMessageNotifications(
    message: IntraofficeMessage
  ): Promise<void> {
    try {
      // Create notifications for each recipient
      for (const toUserId of message.toUserIds) {
        const notification = {
          type: this.getNotificationType(message.messageType),
          title: this.getNotificationTitle(message),
          message: this.getNotificationMessage(message),
          priority: message.priority,
          userId: toUserId,
          tenantId: message.tenantId,
          category: 'messaging',
          channels: ['in-app'] as const,
          actions: [
            {
              id: 'view_message',
              type: 'navigate' as const,
              label: 'View Message',
              payload: { url: `/messages/${message.id}` },
              style: 'primary' as const,
            },
            ...(message.requiresAcknowledgment
              ? [
                  {
                    id: 'acknowledge',
                    type: 'action' as const,
                    label: 'Acknowledge',
                    payload: { messageId: message.id, action: 'acknowledge' },
                    style: 'success' as const,
                  },
                ]
              : []),
          ],
          tags: ['message', message.messageType, ...(message.tags || [])],
          relatedEntityType: 'message',
          relatedEntityId: message.id,
        };

        await notificationService.sendNotification(notification);
      }
    } catch (error) {
      console.error('❌ Failed to create message notifications:', error);
    }
  }

  private getNotificationType(messageType: MessageType): string {
    switch (messageType) {
      case 'direct_message':
        return 'message';
      case 'announcement':
        return 'system';
      case 'memo':
        return 'system';
      case 'urgent_notice':
        return 'system';
      default:
        return 'message';
    }
  }

  private getNotificationTitle(message: IntraofficeMessage): string {
    switch (message.messageType) {
      case 'direct_message':
        return `New message from ${message.fromUserName}`;
      case 'announcement':
        return `📢 Company Announcement`;
      case 'memo':
        return `📝 New Memo from ${message.fromUserName}`;
      case 'urgent_notice':
        return `🚨 Urgent Notice`;
      case 'department_update':
        return `📊 Department Update`;
      case 'reply':
        return `💬 Reply from ${message.fromUserName}`;
      default:
        return `New message from ${message.fromUserName}`;
    }
  }

  private getNotificationMessage(message: IntraofficeMessage): string {
    const preview =
      message.content.length > 100
        ? `${message.content.substring(0, 100)}...`
        : message.content;

    return `Subject: ${message.subject}\n\n${preview}`;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  private transformDbMessage(dbMessage: any): IntraofficeMessage {
    return {
      id: dbMessage.id,
      subject: dbMessage.subject,
      content: dbMessage.content,
      fromUserId: dbMessage.from_user_id,
      fromUserName: dbMessage.from_user_name,
      fromUserRole: dbMessage.from_user_role,
      toUserIds: dbMessage.to_user_ids || [],
      toDepartments: dbMessage.to_departments || [],
      toRoles: dbMessage.to_roles || [],
      messageType: dbMessage.message_type,
      priority: dbMessage.priority,
      status: dbMessage.status,
      isRead: dbMessage.is_read,
      hasAttachments: dbMessage.has_attachments,
      attachments: dbMessage.attachments || [],
      conversationId: dbMessage.conversation_id,
      parentMessageId: dbMessage.parent_message_id,
      tags: dbMessage.tags || [],
      scheduledFor: dbMessage.scheduled_for
        ? new Date(dbMessage.scheduled_for)
        : undefined,
      expiresAt: dbMessage.expires_at
        ? new Date(dbMessage.expires_at)
        : undefined,
      requiresAcknowledgment: dbMessage.requires_acknowledgment,
      acknowledgments: dbMessage.acknowledgments || [],
      createdAt: new Date(dbMessage.created_at),
      updatedAt: new Date(dbMessage.updated_at),
      tenantId: dbMessage.tenant_id,
    };
  }

  private transformDbDraft(dbDraft: any): MessageDraft {
    return {
      id: dbDraft.id,
      subject: dbDraft.subject,
      content: dbDraft.content,
      toUserIds: dbDraft.to_user_ids || [],
      toDepartments: dbDraft.to_departments || [],
      toRoles: dbDraft.to_roles || [],
      messageType: dbDraft.message_type,
      priority: dbDraft.priority,
      requiresAcknowledgment: dbDraft.requires_acknowledgment,
      scheduledFor: dbDraft.scheduled_for
        ? new Date(dbDraft.scheduled_for)
        : undefined,
      userId: dbDraft.user_id,
      updatedAt: new Date(dbDraft.updated_at),
    };
  }

  /**
   * Generate sample messages for testing
   */
  async generateSampleMessages(
    userId: string,
    userName: string,
    userRole: string,
    tenantId: string = 'default'
  ): Promise<void> {
    console.log(
      `📬 Generating sample intraoffice messages for user: ${userId}`
    );

    const sampleMessages = [
      {
        subject: 'Weekly Team Meeting - New Safety Protocols',
        content:
          "Hi team,\n\nWe have our weekly team meeting scheduled for Friday at 2 PM. We'll be discussing the new safety protocols that went into effect this week.\n\nPlease review the attached safety manual before the meeting.\n\nThanks,\nSarah (Operations Manager)",
        fromUserId: 'manager-sarah',
        fromUserName: 'Sarah Chen',
        fromUserRole: 'manager',
        toUserIds: [userId],
        messageType: 'direct_message' as MessageType,
        priority: 'normal' as MessagePriority,
        hasAttachments: true,
        requiresAcknowledgment: false,
        tenantId,
      },
      {
        subject: '🚨 URGENT: System Maintenance Tonight',
        content:
          'ATTENTION ALL STAFF:\n\nWe will be performing critical system maintenance tonight from 11 PM to 3 AM EST. During this time:\n\n• FleetFlow platform will be unavailable\n• Phone systems will remain operational\n• Emergency contacts remain the same\n\nPlease plan accordingly and complete any critical tasks before 11 PM.\n\nIT Support Team',
        fromUserId: 'it-admin',
        fromUserName: 'IT Admin',
        fromUserRole: 'admin',
        toUserIds: [userId],
        messageType: 'urgent_notice' as MessageType,
        priority: 'urgent' as MessagePriority,
        hasAttachments: false,
        requiresAcknowledgment: true,
        tenantId,
      },
      {
        subject: 'Holiday Schedule & PTO Reminders',
        content:
          'Dear FleetFlow Team,\n\nAs we approach the holiday season, please note the following:\n\n📅 Company Holidays:\n• Thanksgiving: Nov 23-24 (Closed)\n• Christmas: Dec 25 (Closed)\n• New Year: Jan 1 (Closed)\n\n📝 PTO Requests:\nPlease submit all holiday PTO requests by November 15th for approval.\n\nQuestions? Contact HR.\n\nBest regards,\nHR Team',
        fromUserId: 'hr-team',
        fromUserName: 'HR Team',
        fromUserRole: 'admin',
        toUserIds: [userId],
        messageType: 'company_wide' as MessageType,
        priority: 'normal' as MessagePriority,
        hasAttachments: false,
        requiresAcknowledgment: false,
        tenantId,
      },
    ];

    // Send all sample messages
    for (const messageData of sampleMessages) {
      await this.sendMessage(messageData);
      // Small delay to ensure proper ordering
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(
      `✅ Generated ${sampleMessages.length} sample intraoffice messages`
    );
  }
}

// Export singleton instance
export const messageService = new MessageService();
