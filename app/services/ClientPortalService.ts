/**
 * FLEETFLOW CLIENT PORTAL SERVICE
 *
 * Manages client access to freight forwarder operations
 * Provides secure, branded portals for shippers and consignees
 * Enables multi-user client organizations with role-based access
 *
 * Features:
 * - Client user management and authentication
 * - Shipment tracking and visibility
 * - Document upload/download
 * - Communication with freight forwarder
 * - Payment processing
 * - Reporting and analytics
 */

import { Address } from './multimodal-transport';

export interface ClientUser {
  id: string;
  clientId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'USER' | 'VIEWER';
  permissions: ClientPermission[];
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface ClientPermission {
  resource:
    | 'shipments'
    | 'documents'
    | 'payments'
    | 'reports'
    | 'communication';
  action: 'read' | 'write' | 'delete' | 'approve';
  scope: 'all' | 'assigned' | 'own';
}

export interface ClientOrganization {
  id: string;
  freightForwarderId: string;
  companyName: string;
  legalName?: string;
  taxId?: string;
  address: Address;
  contacts: ClientUser[];
  branding?: ClientBranding;
  settings: ClientSettings;
  subscriptionTier: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  isActive: boolean;
  createdAt: Date;
}

export interface ClientBranding {
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain?: string;
  portalName: string;
}

export interface ClientSettings {
  allowedFileTypes: string[];
  maxFileSize: number; // in MB
  autoNotifications: boolean;
  requireApprovalWorkflow: boolean;
  customFields: Record<string, any>;
}

export interface ClientShipment {
  id: string;
  clientId: string;
  freightForwarderId: string;
  shipmentNumber: string;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  etd: Date;
  eta: Date;
  cargoDescription: string;
  value: number;
  currency: string;
  assignedUsers: string[]; // Client user IDs
  documents: ClientDocument[];
  milestones: ShipmentMilestone[];
  createdAt: Date;
}

export interface ClientDocument {
  id: string;
  shipmentId: string;
  name: string;
  type:
    | 'COMMERCIAL_INVOICE'
    | 'PACKING_LIST'
    | 'CERTIFICATE_OF_ORIGIN'
    | 'INSURANCE'
    | 'CUSTOMS_DOCS'
    | 'OTHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedBy: string; // Client user ID
  uploadedAt: Date;
  approvedBy?: string; // Freight forwarder user ID
  approvedAt?: Date;
  rejectionReason?: string;
  url: string;
  size: number;
}

export interface ShipmentMilestone {
  id: string;
  shipmentId: string;
  milestone: string;
  description: string;
  status: 'PENDING' | 'COMPLETED';
  timestamp: Date;
  location?: string;
  notes?: string;
}

export type ShipmentStatus =
  | 'QUOTE_REQUESTED'
  | 'QUOTE_PROVIDED'
  | 'BOOKED'
  | 'IN_TRANSIT'
  | 'ARRIVED'
  | 'CLEARED'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface ClientPortalSession {
  userId: string;
  clientId: string;
  sessionToken: string;
  expiresAt: Date;
  permissions: ClientPermission[];
}

class ClientPortalService {
  private static instance: ClientPortalService;

  private constructor() {}

  public static getInstance(): ClientPortalService {
    if (!ClientPortalService.instance) {
      ClientPortalService.instance = new ClientPortalService();
    }
    return ClientPortalService.instance;
  }

  /**
   * CLIENT ORGANIZATION MANAGEMENT
   */

  // Create a new client organization for a freight forwarder
  public async createClientOrganization(params: {
    freightForwarderId: string;
    companyName: string;
    legalName?: string;
    taxId?: string;
    address: Address;
    branding?: Partial<ClientBranding>;
    settings?: Partial<ClientSettings>;
  }): Promise<ClientOrganization> {
    try {
      const organization: ClientOrganization = {
        id: `CLIENT-${Date.now()}`,
        freightForwarderId: params.freightForwarderId,
        companyName: params.companyName,
        legalName: params.legalName,
        taxId: params.taxId,
        address: params.address,
        contacts: [],
        branding: {
          primaryColor: '#667eea',
          secondaryColor: '#764ba2',
          portalName: `${params.companyName} Portal`,
          ...params.branding,
        },
        settings: {
          allowedFileTypes: ['pdf', 'jpg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
          maxFileSize: 10,
          autoNotifications: true,
          requireApprovalWorkflow: false,
          customFields: {},
          ...params.settings,
        },
        subscriptionTier: 'PROFESSIONAL',
        isActive: true,
        createdAt: new Date(),
      };

      // In production: Save to database
      console.log('Created client organization:', organization);

      return organization;
    } catch (error) {
      console.error('Error creating client organization:', error);
      throw new Error('Failed to create client organization');
    }
  }

  /**
   * CLIENT USER MANAGEMENT
   */

  // Add a user to a client organization
  public async addClientUser(params: {
    clientId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: ClientUser['role'];
    permissions?: ClientPermission[];
  }): Promise<ClientUser> {
    try {
      const user: ClientUser = {
        id: `USER-${Date.now()}`,
        clientId: params.clientId,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        role: params.role,
        permissions:
          params.permissions || this.getDefaultPermissions(params.role),
        isActive: true,
        createdAt: new Date(),
      };

      // In production: Save to database and send invitation email
      console.log('Added client user:', user);

      return user;
    } catch (error) {
      console.error('Error adding client user:', error);
      throw new Error('Failed to add client user');
    }
  }

  // Get default permissions for a role
  private getDefaultPermissions(role: ClientUser['role']): ClientPermission[] {
    const rolePermissions: Record<ClientUser['role'], ClientPermission[]> = {
      ADMIN: [
        { resource: 'shipments', action: 'read', scope: 'all' },
        { resource: 'shipments', action: 'write', scope: 'all' },
        { resource: 'documents', action: 'read', scope: 'all' },
        { resource: 'documents', action: 'write', scope: 'all' },
        { resource: 'documents', action: 'approve', scope: 'all' },
        { resource: 'payments', action: 'read', scope: 'all' },
        { resource: 'payments', action: 'write', scope: 'all' },
        { resource: 'reports', action: 'read', scope: 'all' },
        { resource: 'communication', action: 'read', scope: 'all' },
        { resource: 'communication', action: 'write', scope: 'all' },
      ],
      MANAGER: [
        { resource: 'shipments', action: 'read', scope: 'all' },
        { resource: 'shipments', action: 'write', scope: 'assigned' },
        { resource: 'documents', action: 'read', scope: 'all' },
        { resource: 'documents', action: 'write', scope: 'assigned' },
        { resource: 'documents', action: 'approve', scope: 'assigned' },
        { resource: 'payments', action: 'read', scope: 'all' },
        { resource: 'payments', action: 'write', scope: 'assigned' },
        { resource: 'reports', action: 'read', scope: 'all' },
        { resource: 'communication', action: 'read', scope: 'all' },
        { resource: 'communication', action: 'write', scope: 'all' },
      ],
      USER: [
        { resource: 'shipments', action: 'read', scope: 'assigned' },
        { resource: 'shipments', action: 'write', scope: 'assigned' },
        { resource: 'documents', action: 'read', scope: 'assigned' },
        { resource: 'documents', action: 'write', scope: 'assigned' },
        { resource: 'payments', action: 'read', scope: 'assigned' },
        { resource: 'communication', action: 'read', scope: 'assigned' },
        { resource: 'communication', action: 'write', scope: 'assigned' },
      ],
      VIEWER: [
        { resource: 'shipments', action: 'read', scope: 'assigned' },
        { resource: 'documents', action: 'read', scope: 'assigned' },
        { resource: 'reports', action: 'read', scope: 'assigned' },
      ],
    };

    return rolePermissions[role] || [];
  }

  /**
   * SHIPMENT MANAGEMENT FOR CLIENTS
   */

  // Get shipments visible to a client user
  public async getClientShipments(
    clientId: string,
    userId: string,
    filters?: {
      status?: ShipmentStatus[];
      dateRange?: { start: Date; end: Date };
      search?: string;
    }
  ): Promise<ClientShipment[]> {
    try {
      // In production: Query database with proper permissions
      // For now, return mock data
      return [
        {
          id: 'SHIP-001',
          clientId,
          freightForwarderId: 'FF-001',
          shipmentNumber: 'FF-OCN-2025-0001',
          status: 'IN_TRANSIT',
          origin: 'Shanghai, China',
          destination: 'Los Angeles, USA',
          etd: new Date('2025-01-15'),
          eta: new Date('2025-01-31'),
          cargoDescription: 'Electronics and Machinery Parts',
          value: 150000,
          currency: 'USD',
          assignedUsers: [userId],
          documents: [],
          milestones: [
            {
              id: 'M1',
              shipmentId: 'SHIP-001',
              milestone: 'BOOKING_CONFIRMED',
              description: 'Shipment booked with MSC',
              status: 'COMPLETED',
              timestamp: new Date('2025-01-10'),
            },
            {
              id: 'M2',
              shipmentId: 'SHIP-001',
              milestone: 'VESSEL_DEPARTED',
              description: 'Vessel MSC Harmony departed Shanghai',
              status: 'COMPLETED',
              timestamp: new Date('2025-01-16'),
              location: 'Shanghai Port',
            },
          ],
          createdAt: new Date('2025-01-10'),
        },
      ];
    } catch (error) {
      console.error('Error getting client shipments:', error);
      throw new Error('Failed to get client shipments');
    }
  }

  /**
   * DOCUMENT MANAGEMENT
   */

  // Upload document for a shipment
  public async uploadDocument(params: {
    shipmentId: string;
    clientId: string;
    userId: string;
    fileName: string;
    fileType: ClientDocument['type'];
    fileSize: number;
    fileUrl: string;
  }): Promise<ClientDocument> {
    try {
      const document: ClientDocument = {
        id: `DOC-${Date.now()}`,
        shipmentId: params.shipmentId,
        name: params.fileName,
        type: params.fileType,
        status: 'PENDING',
        uploadedBy: params.userId,
        uploadedAt: new Date(),
        url: params.fileUrl,
        size: params.fileSize,
      };

      // In production: Save to database and notify freight forwarder
      console.log('Document uploaded:', document);

      // Send notification to freight forwarder
      await this.notifyFreightForwarder(params.clientId, {
        type: 'DOCUMENT_UPLOADED',
        shipmentId: params.shipmentId,
        documentId: document.id,
        message: `New document uploaded: ${params.fileName}`,
      });

      return document;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }
  }

  // Get documents for a shipment
  public async getShipmentDocuments(
    shipmentId: string,
    clientId: string,
    userId: string
  ): Promise<ClientDocument[]> {
    try {
      // In production: Query database with permissions check
      return [
        {
          id: 'DOC-001',
          shipmentId,
          name: 'Commercial Invoice.pdf',
          type: 'COMMERCIAL_INVOICE',
          status: 'APPROVED',
          uploadedBy: userId,
          uploadedAt: new Date('2025-01-12'),
          approvedBy: 'FF-USER-001',
          approvedAt: new Date('2025-01-13'),
          url: '/api/documents/commercial-invoice.pdf',
          size: 2457600, // 2.4MB
        },
      ];
    } catch (error) {
      console.error('Error getting shipment documents:', error);
      throw new Error('Failed to get shipment documents');
    }
  }

  /**
   * COMMUNICATION SYSTEM
   */

  // Send message to freight forwarder
  public async sendMessage(params: {
    clientId: string;
    userId: string;
    shipmentId?: string;
    subject: string;
    message: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  }): Promise<void> {
    try {
      const messageData = {
        id: `MSG-${Date.now()}`,
        fromClientId: params.clientId,
        fromUserId: params.userId,
        toFreightForwarderId: await this.getFreightForwarderId(params.clientId),
        shipmentId: params.shipmentId,
        subject: params.subject,
        message: params.message,
        priority: params.priority,
        timestamp: new Date(),
        status: 'SENT',
      };

      // In production: Save to database and send notification
      console.log('Message sent:', messageData);

      // Send email notification to freight forwarder
      await this.sendEmailNotification({
        to: 'operations@fleetflow.com', // Freight forwarder email
        subject: `[${params.priority}] ${params.subject}`,
        body: `
Client: ${await this.getClientName(params.clientId)}
User: ${await this.getUserName(params.userId)}
${params.shipmentId ? `Shipment: ${params.shipmentId}` : ''}

Message:
${params.message}
        `,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  /**
   * NOTIFICATION SYSTEM
   */

  // Send notification to client
  public async sendClientNotification(params: {
    clientId: string;
    userIds?: string[]; // Specific users, or all if not specified
    type:
      | 'SHIPMENT_UPDATE'
      | 'DOCUMENT_REQUEST'
      | 'PAYMENT_DUE'
      | 'CUSTOMS_ISSUE';
    title: string;
    message: string;
    shipmentId?: string;
    actionUrl?: string;
  }): Promise<void> {
    try {
      const notification = {
        id: `NOTIF-${Date.now()}`,
        clientId: params.clientId,
        userIds:
          params.userIds || (await this.getAllClientUserIds(params.clientId)),
        type: params.type,
        title: params.title,
        message: params.message,
        shipmentId: params.shipmentId,
        actionUrl: params.actionUrl,
        timestamp: new Date(),
        read: false,
      };

      // In production: Save to database and send push/email notifications
      console.log('Notification sent:', notification);
    } catch (error) {
      console.error('Error sending client notification:', error);
      throw new Error('Failed to send notification');
    }
  }

  /**
   * REPORTING AND ANALYTICS
   */

  // Get client dashboard statistics
  public async getClientDashboardStats(clientId: string): Promise<{
    totalShipments: number;
    activeShipments: number;
    completedShipments: number;
    pendingDocuments: number;
    upcomingMilestones: number;
    totalValue: number;
    onTimeDelivery: number;
  }> {
    try {
      // In production: Calculate from database
      return {
        totalShipments: 45,
        activeShipments: 12,
        completedShipments: 33,
        pendingDocuments: 8,
        upcomingMilestones: 15,
        totalValue: 2500000,
        onTimeDelivery: 94.2,
      };
    } catch (error) {
      console.error('Error getting client dashboard stats:', error);
      throw new Error('Failed to get dashboard statistics');
    }
  }

  /**
   * PRIVATE HELPER METHODS
   */

  private async notifyFreightForwarder(
    clientId: string,
    notification: any
  ): Promise<void> {
    // In production: Send notification to freight forwarder system
    console.log('Notifying freight forwarder:', notification);
  }

  private async sendEmailNotification(params: {
    to: string;
    subject: string;
    body: string;
  }): Promise<void> {
    // In production: Send email via service like SendGrid
    console.log('Sending email:', params);
  }

  private async getFreightForwarderId(clientId: string): Promise<string> {
    // In production: Query database
    return 'FF-001';
  }

  private async getClientName(clientId: string): Promise<string> {
    // In production: Query database
    return 'ABC Shipping Corp';
  }

  private async getUserName(userId: string): Promise<string> {
    // In production: Query database
    return 'John Smith';
  }

  private async getAllClientUserIds(clientId: string): Promise<string[]> {
    // In production: Query database
    return ['USER-001', 'USER-002'];
  }
}

// Export singleton instance
export const clientPortalService = ClientPortalService.getInstance();
export default clientPortalService;
