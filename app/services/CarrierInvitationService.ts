// Carrier Invitation Service
// Handles invitation management for Enhanced Carrier Portal
// Works alongside existing onboarding services without disrupting them

import { logger } from '../utils/logger';

export interface CarrierInvitation {
  id: string;
  invitedBy: string; // User who sent invitation
  invitedByRole: string; // Broker, Dispatcher, Admin
  inviterCompany: string;
  targetCarrier: {
    mcNumber?: string;
    dotNumber?: string;
    companyName?: string;
    contactName?: string;
    email: string;
    phone?: string;
  };
  invitationType: 'email' | 'sms' | 'link' | 'bulk';
  status: 'sent' | 'opened' | 'started' | 'completed' | 'expired' | 'declined';
  sentDate: string;
  openedDate?: string;
  startedDate?: string;
  completedDate?: string;
  expiresDate: string;
  invitationLink: string;
  customMessage?: string;
  templateUsed: string;
  source: 'broker_portal' | 'enhanced_portal' | 'dispatch_central' | 'direct';
  metadata: {
    referralCode: string;
    prefilledData: any;
    incentives?: string[];
    priority: 'standard' | 'high' | 'urgent';
  };
}

export interface InvitationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  htmlContent: string;
  textContent: string;
  variables: string[]; // Available template variables
  isDefault: boolean;
  createdBy: string;
  createdDate: string;
}

export interface InvitationAnalytics {
  totalSent: number;
  totalOpened: number;
  totalStarted: number;
  totalCompleted: number;
  conversionRate: number;
  averageTimeToComplete: number; // in hours
  topPerformingSources: Array<{ source: string; completionRate: number }>;
  recentActivity: CarrierInvitation[];
}

class CarrierInvitationService {
  private static instance: CarrierInvitationService;
  private invitations: Map<string, CarrierInvitation> = new Map();
  private templates: Map<string, InvitationTemplate> = new Map();

  private constructor() {
    this.initializeDefaultTemplates();
    this.loadMockInvitations();
  }

  public static getInstance(): CarrierInvitationService {
    if (!CarrierInvitationService.instance) {
      CarrierInvitationService.instance = new CarrierInvitationService();
    }
    return CarrierInvitationService.instance;
  }

  // Initialize default email and SMS templates
  private initializeDefaultTemplates(): void {
    const defaultEmailTemplate: InvitationTemplate = {
      id: 'default-email',
      name: 'Standard Carrier Invitation',
      type: 'email',
      subject: 'Invitation to Join {{COMPANY_NAME}} Carrier Network',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🚛 FleetFlow Carrier Network</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">You're Invited to Join Our Network</p>
          </div>

          <div style="padding: 40px; background: white;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Hello {{CONTACT_NAME}},</h2>

                          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
                {{INVITER_NAME}} from {{COMPANY_NAME}} has invited {{CARRIER_NAME}} to join our carrier network and gain access to the <strong>Driver OTR Flow Portal</strong> - where all carriers manage their operations and conduct business.
              </p>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #14b8a6; margin-top: 0;">Why Join Our Network?</h3>
              <ul style="color: #4b5563; line-height: 1.6;">
                <li>🚛 Access to Driver OTR Flow Portal - your business operations hub</li>
                <li>📱 Complete mobile driver workflow management</li>
                <li>📄 Digital document management and BOL processing</li>
                <li>🤝 Professional broker relationships and load assignments</li>
                <li>💰 Competitive rates and automated settlement</li>
                <li>📊 Real-time performance tracking and analytics</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="{{INVITATION_LINK}}" style="background: linear-gradient(135deg, #14b8a6, #0d9488); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🚛 Access Driver OTR Flow Portal
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              This invitation expires on {{EXPIRES_DATE}}. If you have any questions, please contact {{INVITER_EMAIL}}.
            </p>
          </div>

          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© 2024 FleetFlow. All rights reserved.</p>
          </div>
        </div>
      `,
      textContent: `
Hello {{CONTACT_NAME}},

{{INVITER_NAME}} from {{COMPANY_NAME}} has invited {{CARRIER_NAME}} to join our carrier network through FleetFlow's Enhanced Carrier Portal.

Why Join Our Network?
- Streamlined onboarding process
- Digital document management
- Professional broker relationships
- Competitive rates and terms
- Performance tracking tools

Start your onboarding process: {{INVITATION_LINK}}

This invitation expires on {{EXPIRES_DATE}}.
Questions? Contact {{INVITER_EMAIL}}

© 2024 FleetFlow
      `,
      variables: [
        'CONTACT_NAME',
        'CARRIER_NAME',
        'INVITER_NAME',
        'COMPANY_NAME',
        'INVITATION_LINK',
        'EXPIRES_DATE',
        'INVITER_EMAIL',
      ],
      isDefault: true,
      createdBy: 'system',
      createdDate: new Date().toISOString(),
    };

    const defaultSMSTemplate: InvitationTemplate = {
      id: 'default-sms',
      name: 'Standard SMS Invitation',
      type: 'sms',
      htmlContent: '',
      textContent: `Hi {{CONTACT_NAME}}, {{INVITER_NAME}} from {{COMPANY_NAME}} invited {{CARRIER_NAME}} to join our FleetFlow carrier network and access the Driver OTR Flow Portal for business operations. Quick onboarding: {{INVITATION_LINK}} (Expires {{EXPIRES_DATE}})`,
      variables: [
        'CONTACT_NAME',
        'CARRIER_NAME',
        'INVITER_NAME',
        'COMPANY_NAME',
        'INVITATION_LINK',
        'EXPIRES_DATE',
      ],
      isDefault: true,
      createdBy: 'system',
      createdDate: new Date().toISOString(),
    };

    this.templates.set(defaultEmailTemplate.id, defaultEmailTemplate);
    this.templates.set(defaultSMSTemplate.id, defaultSMSTemplate);
  }

  // Load mock invitation data for testing
  private loadMockInvitations(): void {
    const mockInvitations: CarrierInvitation[] = [
      {
        id: 'INV001',
        invitedBy: 'John Broker',
        invitedByRole: 'Broker',
        inviterCompany: 'FleetFlow Logistics',
        targetCarrier: {
          mcNumber: 'MC-555666',
          companyName: 'Highway Express LLC',
          contactName: 'Sarah Johnson',
          email: 'sarah@highwayexpress.com',
          phone: '(555) 789-0123',
        },
        invitationType: 'email',
        status: 'completed',
        sentDate: '2024-12-15T10:00:00Z',
        openedDate: '2024-12-15T10:30:00Z',
        startedDate: '2024-12-15T11:00:00Z',
        completedDate: '2024-12-16T14:30:00Z',
        expiresDate: '2025-01-15T10:00:00Z',
        invitationLink:
          'https://fleetflowapp.com/onboard?ref=INV001&carrier=Highway%20Express',
        templateUsed: 'default-email',
        source: 'broker_portal',
        metadata: {
          referralCode: 'BROKER-JB-001',
          prefilledData: { mcNumber: 'MC-555666' },
          priority: 'high',
        },
      },
      {
        id: 'INV002',
        invitedBy: 'Maria Dispatcher',
        invitedByRole: 'Dispatcher',
        inviterCompany: 'FleetFlow Dispatch',
        targetCarrier: {
          companyName: 'Rocky Mountain Freight',
          contactName: 'Mike Thompson',
          email: 'mike@rockymtnfreight.com',
          phone: '(555) 456-7890',
        },
        invitationType: 'email',
        status: 'started',
        sentDate: '2024-12-18T09:15:00Z',
        openedDate: '2024-12-18T09:45:00Z',
        startedDate: '2024-12-18T10:15:00Z',
        expiresDate: '2025-01-18T09:15:00Z',
        invitationLink:
          'https://fleetflowapp.com/onboard?ref=INV002&carrier=Rocky%20Mountain%20Freight',
        customMessage:
          'We have consistent loads on I-80 corridor that would be perfect for your operation.',
        templateUsed: 'default-email',
        source: 'dispatch_central',
        metadata: {
          referralCode: 'DISPATCH-MD-002',
          prefilledData: {},
          incentives: ['fast_track_approval', 'priority_loads'],
          priority: 'standard',
        },
      },
      {
        id: 'INV003',
        invitedBy: 'David Davis',
        invitedByRole: 'Owner',
        inviterCompany: 'FleetFlow',
        targetCarrier: {
          dotNumber: 'DOT-998877',
          companyName: 'Elite Transport Solutions',
          contactName: 'Jennifer Wong',
          email: 'jennifer@elitetransport.com',
        },
        invitationType: 'email',
        status: 'sent',
        sentDate: '2024-12-19T16:30:00Z',
        expiresDate: '2025-01-19T16:30:00Z',
        invitationLink:
          'https://fleetflowapp.com/onboard?ref=INV003&carrier=Elite%20Transport%20Solutions',
        templateUsed: 'default-email',
        source: 'enhanced_portal',
        metadata: {
          referralCode: 'OWNER-DD-003',
          prefilledData: { dotNumber: 'DOT-998877' },
          priority: 'urgent',
        },
      },
    ];

    mockInvitations.forEach((invitation) => {
      this.invitations.set(invitation.id, invitation);
    });

    logger.info('CarrierInvitationService: Loaded mock invitation data');
  }

  // Create new invitation
  public createInvitation(
    invitationData: Partial<CarrierInvitation>
  ): CarrierInvitation {
    const invitation: CarrierInvitation = {
      id: this.generateInvitationId(),
      invitedBy: invitationData.invitedBy || 'Unknown User',
      invitedByRole: invitationData.invitedByRole || 'User',
      inviterCompany: invitationData.inviterCompany || 'FleetFlow',
      targetCarrier: invitationData.targetCarrier!,
      invitationType: invitationData.invitationType || 'email',
      status: 'sent',
      sentDate: new Date().toISOString(),
      expiresDate:
        invitationData.expiresDate || this.getDefaultExpirationDate(),
      invitationLink: this.generateInvitationLink(invitationData),
      customMessage: invitationData.customMessage,
      templateUsed: invitationData.templateUsed || 'default-email',
      source: invitationData.source || 'enhanced_portal',
      metadata: {
        referralCode: this.generateReferralCode(
          invitationData.invitedBy!,
          invitationData.invitedByRole!
        ),
        prefilledData: invitationData.metadata?.prefilledData || {},
        incentives: invitationData.metadata?.incentives || [],
        priority: invitationData.metadata?.priority || 'standard',
      },
    };

    this.invitations.set(invitation.id, invitation);
    logger.info(
      `CarrierInvitationService: Created invitation ${invitation.id}`
    );

    return invitation;
  }

  // Generate unique invitation ID
  private generateInvitationId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `INV${timestamp}${random}`.toUpperCase();
  }

  // Generate invitation link with pre-filled data
  private generateInvitationLink(
    invitationData: Partial<CarrierInvitation>
  ): string {
    const baseUrl = 'https://fleetflowapp.com/carrier-landing';
    const params = new URLSearchParams();

    if (invitationData.id) params.set('ref', invitationData.id);
    if (invitationData.targetCarrier?.companyName) {
      params.set('carrier', invitationData.targetCarrier.companyName);
    }
    if (invitationData.targetCarrier?.mcNumber) {
      params.set('mc', invitationData.targetCarrier.mcNumber);
    }
    if (invitationData.targetCarrier?.dotNumber) {
      params.set('dot', invitationData.targetCarrier.dotNumber);
    }
    if (invitationData.targetCarrier?.email) {
      params.set('email', invitationData.targetCarrier.email);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  // Generate referral code
  private generateReferralCode(inviterName: string, role: string): string {
    const initials = inviterName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
    const roleCode = role.substring(0, 3).toUpperCase();
    const sequence = (this.invitations.size + 1).toString().padStart(3, '0');
    return `${roleCode}-${initials}-${sequence}`;
  }

  // Get default expiration date (30 days from now)
  private getDefaultExpirationDate(): string {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30);
    return expirationDate.toISOString();
  }

  // Update invitation status
  public updateInvitationStatus(
    invitationId: string,
    status: CarrierInvitation['status']
  ): boolean {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) return false;

    invitation.status = status;

    // Update timestamps based on status
    const now = new Date().toISOString();
    switch (status) {
      case 'opened':
        if (!invitation.openedDate) invitation.openedDate = now;
        break;
      case 'started':
        if (!invitation.startedDate) invitation.startedDate = now;
        break;
      case 'completed':
        if (!invitation.completedDate) invitation.completedDate = now;
        break;
    }

    this.invitations.set(invitationId, invitation);
    logger.info(
      `CarrierInvitationService: Updated invitation ${invitationId} status to ${status}`
    );

    return true;
  }

  // Get all invitations
  public getAllInvitations(): CarrierInvitation[] {
    return Array.from(this.invitations.values());
  }

  // Get invitations by status
  public getInvitationsByStatus(
    status: CarrierInvitation['status']
  ): CarrierInvitation[] {
    return this.getAllInvitations().filter((inv) => inv.status === status);
  }

  // Get invitations by inviter
  public getInvitationsByInviter(inviterName: string): CarrierInvitation[] {
    return this.getAllInvitations().filter(
      (inv) => inv.invitedBy === inviterName
    );
  }

  // Get invitation analytics
  public getInvitationAnalytics(): InvitationAnalytics {
    const allInvitations = this.getAllInvitations();
    const totalSent = allInvitations.length;
    const totalOpened = allInvitations.filter((inv) => inv.openedDate).length;
    const totalStarted = allInvitations.filter((inv) => inv.startedDate).length;
    const totalCompleted = allInvitations.filter(
      (inv) => inv.status === 'completed'
    ).length;

    // Calculate conversion rate
    const conversionRate =
      totalSent > 0 ? (totalCompleted / totalSent) * 100 : 0;

    // Calculate average time to complete (in hours)
    const completedInvitations = allInvitations.filter(
      (inv) => inv.completedDate && inv.sentDate
    );
    const averageTimeToComplete =
      completedInvitations.length > 0
        ? completedInvitations.reduce((acc, inv) => {
            const sent = new Date(inv.sentDate).getTime();
            const completed = new Date(inv.completedDate!).getTime();
            return acc + (completed - sent);
          }, 0) /
          completedInvitations.length /
          (1000 * 60 * 60) // Convert to hours
        : 0;

    // Get top performing sources
    const sourceStats = new Map<string, { total: number; completed: number }>();
    allInvitations.forEach((inv) => {
      const current = sourceStats.get(inv.source) || { total: 0, completed: 0 };
      current.total += 1;
      if (inv.status === 'completed') current.completed += 1;
      sourceStats.set(inv.source, current);
    });

    const topPerformingSources = Array.from(sourceStats.entries())
      .map(([source, stats]) => ({
        source,
        completionRate:
          stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.completionRate - a.completionRate);

    // Get recent activity (last 10 invitations)
    const recentActivity = allInvitations
      .sort(
        (a, b) =>
          new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
      )
      .slice(0, 10);

    return {
      totalSent,
      totalOpened,
      totalStarted,
      totalCompleted,
      conversionRate,
      averageTimeToComplete,
      topPerformingSources,
      recentActivity,
    };
  }

  // Get email templates
  public getEmailTemplates(): InvitationTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.type === 'email'
    );
  }

  // Get SMS templates
  public getSMSTemplates(): InvitationTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.type === 'sms');
  }

  // Process template variables
  public processTemplate(
    template: InvitationTemplate,
    variables: Record<string, string>
  ): { subject?: string; content: string } {
    let processedContent =
      template.type === 'email' ? template.htmlContent : template.textContent;
    let processedSubject = template.subject;

    // Replace all variables in content
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      processedContent = processedContent.replace(
        new RegExp(placeholder, 'g'),
        value
      );
      if (processedSubject) {
        processedSubject = processedSubject.replace(
          new RegExp(placeholder, 'g'),
          value
        );
      }
    });

    return {
      subject: processedSubject,
      content: processedContent,
    };
  }

  // Send invitation (mock implementation)
  public async sendInvitation(
    invitation: CarrierInvitation
  ): Promise<{ success: boolean; message: string }> {
    try {
      // In real implementation, this would integrate with email/SMS services
      logger.info(
        `CarrierInvitationService: Sending ${invitation.invitationType} invitation to ${invitation.targetCarrier.email}`
      );

      // Mock delay for sending
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update status to sent
      this.updateInvitationStatus(invitation.id, 'sent');

      return {
        success: true,
        message: `Invitation sent successfully to ${invitation.targetCarrier.email}`,
      };
    } catch (error) {
      logger.error(
        'CarrierInvitationService: Failed to send invitation',
        error
      );
      return {
        success: false,
        message: 'Failed to send invitation. Please try again.',
      };
    }
  }

  // Bulk invitation creation
  public createBulkInvitations(
    invitationRequests: Partial<CarrierInvitation>[]
  ): CarrierInvitation[] {
    return invitationRequests.map((request) => this.createInvitation(request));
  }

  // Get invitation by referral code
  public getInvitationByReferralCode(
    referralCode: string
  ): CarrierInvitation | null {
    return (
      this.getAllInvitations().find(
        (inv) => inv.metadata.referralCode === referralCode
      ) || null
    );
  }

  // Check if invitation is valid and not expired
  public isInvitationValid(invitationId: string): boolean {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) return false;

    const now = new Date();
    const expirationDate = new Date(invitation.expiresDate);

    return (
      now <= expirationDate &&
      invitation.status !== 'expired' &&
      invitation.status !== 'declined'
    );
  }
}

export default CarrierInvitationService;
