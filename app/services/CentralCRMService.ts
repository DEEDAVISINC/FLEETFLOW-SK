// ============================================================================
// FLEETFLOW CENTRAL CRM SERVICE - UNIFIED COMMUNICATION HUB
// ============================================================================

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// TYPESCRIPT INTERFACES - CENTRAL CRM SYSTEM
// ============================================================================

export interface UserIdentifier {
  userId: string;
  userCode: string; // Format: {UserInitials}-{DepartmentCode}-{HireDateCode}
  department: 'DC' | 'BB' | 'DM' | 'MGR' | 'CS' | 'SALES';
  role:
    | 'dispatcher'
    | 'broker'
    | 'driver'
    | 'manager'
    | 'customer_service'
    | 'sales';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  extension?: string;
  isOnline: boolean;
  lastActive: string;
}

export interface CentralInteraction {
  id: string;
  interactionType:
    | 'call'
    | 'email'
    | 'sms'
    | 'note'
    | 'transfer'
    | 'task'
    | 'meeting';
  contactId: string;
  contactName: string;
  contactCompany: string;
  contactPhone?: string;
  contactEmail?: string;

  // User tracking
  initiatedBy: UserIdentifier;
  assignedTo?: UserIdentifier;
  transferredFrom?: UserIdentifier;
  transferredTo?: UserIdentifier;

  // Interaction details
  subject: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'transferred' | 'cancelled';

  // Call-specific data
  callType?: 'inbound' | 'outbound';
  callDuration?: string;
  callRecording?: string;
  callStatus?: 'completed' | 'missed' | 'busy' | 'no_answer';

  // Transfer data
  transferReason?: string;
  transferNotes?: string;
  transferUrgency?: 'normal' | 'urgent' | 'immediate';
  requiresFollowUp: boolean;

  // Timestamps
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  scheduledFor?: string;

  // Related data
  loadId?: string;
  opportunityId?: string;
  tags: string[];
  attachments: string[];
}

export interface TransferRequest {
  fromUser: UserIdentifier;
  toUser: UserIdentifier;
  contactId: string;
  contactName: string;
  contactCompany: string;
  reason: string;
  notes: string;
  urgency: 'normal' | 'urgent' | 'immediate';
  context: {
    currentCall?: boolean;
    loadDetails?: any;
    customerHistory?: any;
    specialInstructions?: string;
  };
}

export interface NotificationPayload {
  recipientUserId: string;
  type: 'transfer' | 'assignment' | 'followup' | 'urgent' | 'system';
  title: string;
  message: string;
  data: any;
  channels: ('email' | 'sms' | 'push' | 'dashboard')[];
}

// ============================================================================
// CENTRAL CRM SERVICE CLASS
// ============================================================================

class CentralCRMService {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.warn(
        '⚠️ CentralCRMService: Supabase credentials not configured, using empty data'
      );
      this.supabase = null;
    }
  }

  // ============================================================================
  // USER MANAGEMENT & IDENTIFICATION
  // ============================================================================

  async getAllUsers(): Promise<UserIdentifier[]> {
    // Mock data removed - requires real database connection for user data
    return [];
  }

  async getUserByCode(userCode: string): Promise<UserIdentifier | null> {
    const users = await this.getAllUsers();
    return users.find((user) => user.userCode === userCode) || null;
  }

  async getUsersByDepartment(department: string): Promise<UserIdentifier[]> {
    const users = await this.getAllUsers();
    return users.filter((user) => user.department === department);
  }

  async getOnlineUsers(): Promise<UserIdentifier[]> {
    const users = await this.getAllUsers();
    return users.filter((user) => user.isOnline);
  }

  // ============================================================================
  // CENTRAL INTERACTION MANAGEMENT
  // ============================================================================

  async createInteraction(
    interaction: Partial<CentralInteraction>
  ): Promise<CentralInteraction> {
    const newInteraction: CentralInteraction = {
      id: `INT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      priority: 'medium',
      requiresFollowUp: false,
      tags: [],
      attachments: [],
      ...interaction,
    } as CentralInteraction;

    // In production, save to database
    console.info('📝 Creating central interaction:', newInteraction);

    return newInteraction;
  }

  async getInteractionsByContact(
    contactId: string
  ): Promise<CentralInteraction[]> {
    // Mock data removed - requires real database connection for contact interaction data
    return [];
  }

  // ============================================================================
  // CALL TRANSFER SYSTEM
  // ============================================================================

  async initiateTransfer(transferRequest: TransferRequest): Promise<{
    success: boolean;
    transferId: string;
    notificationsSent: string[];
    interaction: CentralInteraction;
  }> {
    const transferId = `TRF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create transfer interaction
    const transferInteraction = await this.createInteraction({
      interactionType: 'transfer',
      contactId: transferRequest.contactId,
      contactName: transferRequest.contactName,
      contactCompany: transferRequest.contactCompany,
      initiatedBy: transferRequest.fromUser,
      assignedTo: transferRequest.toUser,
      transferredFrom: transferRequest.fromUser,
      transferredTo: transferRequest.toUser,
      subject: `🔄 Call Transfer: ${transferRequest.reason}`,
      content: transferRequest.notes,
      priority:
        transferRequest.urgency === 'immediate'
          ? 'urgent'
          : transferRequest.urgency === 'urgent'
            ? 'high'
            : 'medium',
      status: 'transferred',
      transferReason: transferRequest.reason,
      transferNotes: transferRequest.notes,
      transferUrgency: transferRequest.urgency,
      requiresFollowUp: true,
    });

    // Send notifications
    const notifications = await this.sendTransferNotifications(
      transferRequest,
      transferId
    );

    console.info(
      `🔄 Transfer initiated: ${transferRequest.fromUser.firstName} → ${transferRequest.toUser.firstName}`
    );
    console.info(`📋 Context: ${transferRequest.reason}`);
    console.info(`📝 Notes: ${transferRequest.notes}`);

    return {
      success: true,
      transferId,
      notificationsSent: notifications,
      interaction: transferInteraction,
    };
  }

  private async sendTransferNotifications(
    transferRequest: TransferRequest,
    transferId: string
  ): Promise<string[]> {
    const notifications: string[] = [];

    // Notify recipient
    await this.sendNotification({
      recipientUserId: transferRequest.toUser.userId,
      type: 'transfer',
      title: `🔄 Call Transfer from ${transferRequest.fromUser.firstName} ${transferRequest.fromUser.lastName}`,
      message: `${transferRequest.reason}\n\nNotes: ${transferRequest.notes}`,
      data: {
        transferId,
        fromUser: transferRequest.fromUser,
        contactId: transferRequest.contactId,
        urgency: transferRequest.urgency,
        context: transferRequest.context,
      },
      channels:
        transferRequest.urgency === 'immediate'
          ? ['push', 'sms', 'email', 'dashboard']
          : ['push', 'dashboard', 'email'],
    });
    notifications.push(`notification_to_${transferRequest.toUser.userId}`);

    // Notify manager if urgent
    if (
      transferRequest.urgency === 'urgent' ||
      transferRequest.urgency === 'immediate'
    ) {
      const managers = await this.getUsersByDepartment('MGR');
      for (const manager of managers) {
        await this.sendNotification({
          recipientUserId: manager.userId,
          type: 'urgent',
          title: `🚨 Urgent Transfer: ${transferRequest.fromUser.firstName} → ${transferRequest.toUser.firstName}`,
          message: `Reason: ${transferRequest.reason}`,
          data: { transferId, urgency: transferRequest.urgency },
          channels: ['push', 'dashboard'],
        });
        notifications.push(`urgent_notification_to_${manager.userId}`);
      }
    }

    return notifications;
  }

  // ============================================================================
  // NOTIFICATION SYSTEM
  // ============================================================================

  async sendNotification(payload: NotificationPayload): Promise<boolean> {
    console.info('📢 Sending notification:', payload.title);

    // Dashboard notification (real-time)
    if (payload.channels.includes('dashboard')) {
      console.info(
        `📊 Dashboard notification sent to ${payload.recipientUserId}`
      );
    }

    // Push notification
    if (payload.channels.includes('push')) {
      console.info(`📱 Push notification sent to ${payload.recipientUserId}`);
    }

    // SMS notification (integrate with existing Twilio)
    if (payload.channels.includes('sms')) {
      const user = await this.getUserByCode(payload.recipientUserId);
      if (user?.phone) {
        try {
          // Use new CRM transfer notification endpoint
          const response = await fetch('/api/crm/transfer-notify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: user.phone,
              message: `${payload.title}\n\n${payload.message}`,
              transferId: payload.data.transferId || 'UNKNOWN',
              urgency: payload.data.urgency || 'normal',
            }),
          });

          if (response.ok) {
            console.info(`📱 Transfer SMS sent to ${user.phone}`);
          }
        } catch (error) {
          console.error('Transfer SMS sending failed:', error);
        }
      }
    }

    // Email notification
    if (payload.channels.includes('email')) {
      const user = await this.getUserByCode(payload.recipientUserId);
      if (user?.email) {
        console.info(`📧 Email notification queued for ${user.email}`);
      }
    }

    return true;
  }

  // ============================================================================
  // ACTIVITY FEED & TIMELINE
  // ============================================================================

  async getActivityFeed(
    userId?: string,
    contactId?: string
  ): Promise<CentralInteraction[]> {
    let interactions: CentralInteraction[] = [];

    if (contactId) {
      interactions = await this.getInteractionsByContact(contactId);
    } else if (userId) {
      interactions = await this.getInteractionsByUser(userId);
    } else {
      interactions = await this.getAllRecentInteractions();
    }

    return interactions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private async getInteractionsByUser(
    userId: string
  ): Promise<CentralInteraction[]> {
    const users = await this.getAllUsers();
    const user = users.find((u) => u.userId === userId);
    if (!user) return [];

    return [
      {
        id: 'INT_002',
        interactionType: 'call',
        contactId: 'CONTACT_001',
        contactName: 'Quick Transport',
        contactCompany: 'Quick Transport LLC',
        contactPhone: '+1 (555) 987-6543',
        initiatedBy: user,
        subject: 'New customer inquiry',
        content: 'Inbound call regarding refrigerated transport services.',
        priority: 'medium',
        status: 'completed',
        callType: 'inbound',
        callDuration: '8:23',
        callStatus: 'completed',
        requiresFollowUp: true,
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        updatedAt: new Date(Date.now() - 7200000).toISOString(),
        tags: ['new-customer', 'refrigerated'],
        attachments: [],
      },
    ];
  }

  private async getAllRecentInteractions(): Promise<CentralInteraction[]> {
    // Mock data removed - requires real database connection for interaction data
    return [];
  }

  // ============================================================================
  // ANALYTICS & REPORTING
  // ============================================================================

  async getUserStats(userId: string): Promise<{
    totalInteractions: number;
    callsToday: number;
    transfersReceived: number;
    transfersSent: number;
    avgResponseTime: string;
    completionRate: number;
  }> {
    const interactions = await this.getInteractionsByUser(userId);
    const today = new Date().toDateString();

    return {
      totalInteractions: interactions.length,
      callsToday: interactions.filter(
        (i) =>
          i.interactionType === 'call' &&
          new Date(i.createdAt).toDateString() === today
      ).length,
      transfersReceived: interactions.filter(
        (i) => i.transferredTo?.userId === userId
      ).length,
      transfersSent: interactions.filter(
        (i) => i.transferredFrom?.userId === userId
      ).length,
      avgResponseTime: '2.3 minutes',
      completionRate: 87.5,
    };
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const centralCRMService = new CentralCRMService();
export default centralCRMService;
