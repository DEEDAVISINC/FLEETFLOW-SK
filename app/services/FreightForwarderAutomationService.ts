/**
 * FleetFlow Freight Forwarder Automation & Notification Service
 * Handles ALL shipment milestones and stakeholder notifications
 * 
 * Based on 12-Step Export Process:
 * 1. Inspection & Quality Check
 * 2. Package, Label & Mark Goods
 * 3. Get Delivery Order
 * 4. Stuffing & Sealing Containers
 * 5. Arrange Inter-Modal Transfer
 * 6. Transfer to Point of Loading
 * 7. Goods Arrive at Port
 * 8. Customs Clearance & Physical Verification
 * 9. Pay Port Dues
 * 10. Handover Documents to Shipping Line
 * 11. Send Original B/L to Buyer
 * 12. Goods Depart from Origin
 * 
 * Bill of Lading Workflow:
 * - Cargo Onboard → B/L Issued → B/L Signed → Original B/L Sent → B/L Surrender
 * 
 * @version 1.0.0
 * @author FleetFlow TMS LLC
 */

import FreightForwarderCRMService from './FreightForwarderCRMService';
import FreightForwarderContractService from './FreightForwarderContractService';

// ==================== TYPE DEFINITIONS ====================

export type ShipmentMilestone =
  | 'BOOKING_CONFIRMED'
  | 'INSPECTION_QUALITY_CHECK'
  | 'PACKAGING_LABELING'
  | 'DELIVERY_ORDER_RECEIVED'
  | 'CONTAINER_STUFFING'
  | 'INTERMODAL_TRANSFER_ARRANGED'
  | 'TRANSFER_TO_PORT'
  | 'CARGO_ARRIVAL_PORT'
  | 'CUSTOMS_CLEARANCE_ORIGIN'
  | 'PORT_DUES_PAID'
  | 'DOCUMENTS_TO_CARRIER'
  | 'BL_ISSUED'
  | 'BL_SIGNED'
  | 'ORIGINAL_BL_SENT'
  | 'VESSEL_DEPARTED'
  | 'IN_TRANSIT'
  | 'ARRIVAL_DESTINATION_PORT'
  | 'CUSTOMS_CLEARANCE_DESTINATION'
  | 'BL_SURRENDER'
  | 'CARGO_DELIVERED'
  | 'POD_RECEIVED';

export type NotificationMethod = 'EMAIL' | 'SMS' | 'PUSH' | 'IN_APP';

export type NotificationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ShipmentNotification {
  id: string;
  shipmentId: string;
  milestone: ShipmentMilestone;
  recipientContactIds: string[];
  recipientEmails: string[];
  recipientPhones?: string[];
  methods: NotificationMethod[];
  priority: NotificationPriority;
  subject: string;
  message: string;
  sentAt?: string;
  deliveredAt?: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED';
  metadata?: any;
}

export interface MilestoneConfig {
  milestone: ShipmentMilestone;
  displayName: string;
  description: string;
  notifyParties: ('SHIPPER' | 'CONSIGNEE' | 'NOTIFY_PARTY' | 'FREIGHT_FORWARDER' | 'CUSTOMS_BROKER' | 'TRUCKER' | 'CARRIER' | 'WAREHOUSE' | 'PORT_AGENT')[];
  priority: NotificationPriority;
  requiresDocuments: string[];
  nextMilestones: ShipmentMilestone[];
}

export interface FreightShipment {
  id: string;
  shipmentNumber: string;
  mode: 'OCEAN' | 'AIR';
  
  shipperId: string;
  consigneeId: string;
  notifyPartyIds: string[];
  carrierId?: string;
  customsBrokerId?: string;
  truckerId?: string;
  
  currentMilestone: ShipmentMilestone;
  milestoneHistory: {
    milestone: ShipmentMilestone;
    timestamp: string;
    notes?: string;
  }[];
  
  originPort: string;
  destinationPort: string;
  etd: string;
  eta: string;
  
  billOfLadingNumber?: string;
  containerNumbers?: string[];
  airWaybillNumber?: string;
  
  cargoValue: number;
  currency: string;
  
  documents: {
    type: string;
    name: string;
    url?: string;
    uploadedAt: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
  }[];
  
  notifications: ShipmentNotification[];
  
  createdAt: string;
  updatedAt: string;
}

// ==================== AUTOMATION SERVICE ====================

export class FreightForwarderAutomationService {
  private static readonly STORAGE_KEY = 'ff_shipments';
  private static readonly NOTIFICATIONS_KEY = 'ff_notifications';
  
  /**
   * Milestone configurations with auto-notification rules
   */
  private static readonly MILESTONE_CONFIGS: Record<ShipmentMilestone, MilestoneConfig> = {
    BOOKING_CONFIRMED: {
      milestone: 'BOOKING_CONFIRMED',
      displayName: 'Booking Confirmed',
      description: 'Shipment booking confirmed with carrier',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER'],
      priority: 'MEDIUM',
      requiresDocuments: ['Booking Confirmation'],
      nextMilestones: ['INSPECTION_QUALITY_CHECK'],
    },
    
    INSPECTION_QUALITY_CHECK: {
      milestone: 'INSPECTION_QUALITY_CHECK',
      displayName: 'Inspection & Quality Check',
      description: 'Cargo inspection and quality verification completed',
      notifyParties: ['SHIPPER', 'FREIGHT_FORWARDER'],
      priority: 'MEDIUM',
      requiresDocuments: ['Quality Certificate', 'Inspection Report'],
      nextMilestones: ['PACKAGING_LABELING'],
    },
    
    PACKAGING_LABELING: {
      milestone: 'PACKAGING_LABELING',
      displayName: 'Package, Label & Mark Goods',
      description: 'Goods packaged, labeled, and marked for shipping',
      notifyParties: ['SHIPPER', 'WAREHOUSE', 'FREIGHT_FORWARDER'],
      priority: 'MEDIUM',
      requiresDocuments: ['Packing List'],
      nextMilestones: ['DELIVERY_ORDER_RECEIVED'],
    },
    
    DELIVERY_ORDER_RECEIVED: {
      milestone: 'DELIVERY_ORDER_RECEIVED',
      displayName: 'Delivery Order Received',
      description: 'Delivery order obtained from carrier',
      notifyParties: ['SHIPPER', 'FREIGHT_FORWARDER', 'WAREHOUSE'],
      priority: 'MEDIUM',
      requiresDocuments: ['Delivery Order'],
      nextMilestones: ['CONTAINER_STUFFING'],
    },
    
    CONTAINER_STUFFING: {
      milestone: 'CONTAINER_STUFFING',
      displayName: 'Container Stuffing & Sealing',
      description: 'Container loaded and sealed',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER', 'CARRIER'],
      priority: 'HIGH',
      requiresDocuments: ['Container Loading Report', 'Seal Numbers', 'VGM Certificate'],
      nextMilestones: ['INTERMODAL_TRANSFER_ARRANGED'],
    },
    
    INTERMODAL_TRANSFER_ARRANGED: {
      milestone: 'INTERMODAL_TRANSFER_ARRANGED',
      displayName: 'Inter-Modal Transfer Arranged',
      description: 'Trucking arranged for port delivery',
      notifyParties: ['FREIGHT_FORWARDER', 'TRUCKER', 'PORT_AGENT'],
      priority: 'MEDIUM',
      requiresDocuments: ['Trucking Order', 'Drayage Receipt'],
      nextMilestones: ['TRANSFER_TO_PORT'],
    },
    
    TRANSFER_TO_PORT: {
      milestone: 'TRANSFER_TO_PORT',
      displayName: 'Transfer to Point of Loading',
      description: 'Container in transit to port/airport',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER', 'PORT_AGENT', 'CARRIER'],
      priority: 'HIGH',
      requiresDocuments: ['Gate Pass', 'Trucking Receipt'],
      nextMilestones: ['CARGO_ARRIVAL_PORT'],
    },
    
    CARGO_ARRIVAL_PORT: {
      milestone: 'CARGO_ARRIVAL_PORT',
      displayName: 'Goods Arrive at Port',
      description: 'Cargo arrived at port/airport terminal',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER', 'CARRIER', 'CUSTOMS_BROKER', 'PORT_AGENT'],
      priority: 'HIGH',
      requiresDocuments: ['Gate In Receipt', 'Dock Receipt'],
      nextMilestones: ['CUSTOMS_CLEARANCE_ORIGIN'],
    },
    
    CUSTOMS_CLEARANCE_ORIGIN: {
      milestone: 'CUSTOMS_CLEARANCE_ORIGIN',
      displayName: 'Customs Clearance & Physical Verification',
      description: 'Export customs clearance completed',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER', 'CUSTOMS_BROKER'],
      priority: 'URGENT',
      requiresDocuments: ['Export Declaration', 'Customs Release', 'Export License'],
      nextMilestones: ['PORT_DUES_PAID'],
    },
    
    PORT_DUES_PAID: {
      milestone: 'PORT_DUES_PAID',
      displayName: 'Port Dues Paid',
      description: 'All port charges and fees paid',
      notifyParties: ['FREIGHT_FORWARDER', 'PORT_AGENT'],
      priority: 'MEDIUM',
      requiresDocuments: ['Payment Receipt', 'Port Charges Invoice'],
      nextMilestones: ['DOCUMENTS_TO_CARRIER'],
    },
    
    DOCUMENTS_TO_CARRIER: {
      milestone: 'DOCUMENTS_TO_CARRIER',
      displayName: 'Documents Handover to Shipping Line',
      description: 'All shipping documents submitted to carrier',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER', 'CARRIER'],
      priority: 'HIGH',
      requiresDocuments: ['Commercial Invoice', 'Packing List', 'Certificate of Origin'],
      nextMilestones: ['BL_ISSUED'],
    },
    
    BL_ISSUED: {
      milestone: 'BL_ISSUED',
      displayName: 'Bill of Lading Issued',
      description: 'B/L or AWB issued by carrier',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'NOTIFY_PARTY', 'FREIGHT_FORWARDER'],
      priority: 'URGENT',
      requiresDocuments: ['Bill of Lading', 'Air Waybill'],
      nextMilestones: ['BL_SIGNED'],
    },
    
    BL_SIGNED: {
      milestone: 'BL_SIGNED',
      displayName: 'B/L Signed by Master',
      description: 'Bill of Lading signed by vessel master/airline',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'FREIGHT_FORWARDER'],
      priority: 'HIGH',
      requiresDocuments: ['Signed Bill of Lading'],
      nextMilestones: ['ORIGINAL_BL_SENT'],
    },
    
    ORIGINAL_BL_SENT: {
      milestone: 'ORIGINAL_BL_SENT',
      displayName: 'Original B/L Sent to Buyer',
      description: 'Original B/L dispatched to consignee',
      notifyParties: ['CONSIGNEE', 'FREIGHT_FORWARDER', 'NOTIFY_PARTY'],
      priority: 'URGENT',
      requiresDocuments: ['Courier Tracking', 'Original B/L'],
      nextMilestones: ['VESSEL_DEPARTED'],
    },
    
    VESSEL_DEPARTED: {
      milestone: 'VESSEL_DEPARTED',
      displayName: 'Goods Depart from Origin',
      description: 'Vessel departed / Flight departed',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'NOTIFY_PARTY', 'FREIGHT_FORWARDER', 'CARRIER'],
      priority: 'URGENT',
      requiresDocuments: ['Departure Notice', 'ETD Confirmation'],
      nextMilestones: ['IN_TRANSIT'],
    },
    
    IN_TRANSIT: {
      milestone: 'IN_TRANSIT',
      displayName: 'In Transit',
      description: 'Cargo in transit to destination',
      notifyParties: ['CONSIGNEE', 'FREIGHT_FORWARDER'],
      priority: 'LOW',
      requiresDocuments: [],
      nextMilestones: ['ARRIVAL_DESTINATION_PORT'],
    },
    
    ARRIVAL_DESTINATION_PORT: {
      milestone: 'ARRIVAL_DESTINATION_PORT',
      displayName: 'Arrival at Destination Port',
      description: 'Cargo arrived at destination port/airport',
      notifyParties: ['CONSIGNEE', 'NOTIFY_PARTY', 'FREIGHT_FORWARDER', 'CUSTOMS_BROKER', 'TRUCKER'],
      priority: 'URGENT',
      requiresDocuments: ['Arrival Notice', 'ETA Update'],
      nextMilestones: ['CUSTOMS_CLEARANCE_DESTINATION'],
    },
    
    CUSTOMS_CLEARANCE_DESTINATION: {
      milestone: 'CUSTOMS_CLEARANCE_DESTINATION',
      displayName: 'Customs Clearance at Destination',
      description: 'Import customs clearance completed',
      notifyParties: ['CONSIGNEE', 'NOTIFY_PARTY', 'FREIGHT_FORWARDER', 'CUSTOMS_BROKER'],
      priority: 'URGENT',
      requiresDocuments: ['Customs Entry', 'Import Release', 'Duty Payment Receipt'],
      nextMilestones: ['BL_SURRENDER'],
    },
    
    BL_SURRENDER: {
      milestone: 'BL_SURRENDER',
      displayName: 'B/L Surrender',
      description: 'Bill of Lading surrendered for cargo release',
      notifyParties: ['CONSIGNEE', 'FREIGHT_FORWARDER', 'CARRIER', 'PORT_AGENT'],
      priority: 'HIGH',
      requiresDocuments: ['Surrender Receipt', 'Delivery Order'],
      nextMilestones: ['CARGO_DELIVERED'],
    },
    
    CARGO_DELIVERED: {
      milestone: 'CARGO_DELIVERED',
      displayName: 'Cargo Delivered',
      description: 'Cargo delivered to final destination',
      notifyParties: ['SHIPPER', 'CONSIGNEE', 'NOTIFY_PARTY', 'FREIGHT_FORWARDER'],
      priority: 'URGENT',
      requiresDocuments: ['Delivery Receipt', 'Cargo Photos'],
      nextMilestones: ['POD_RECEIVED'],
    },
    
    POD_RECEIVED: {
      milestone: 'POD_RECEIVED',
      displayName: 'Proof of Delivery Received',
      description: 'Signed POD received from consignee',
      notifyParties: ['SHIPPER', 'FREIGHT_FORWARDER'],
      priority: 'MEDIUM',
      requiresDocuments: ['Signed POD', 'Delivery Photos'],
      nextMilestones: [],
    },
  };
  
  /**
   * Update shipment milestone and trigger notifications
   */
  static async updateMilestone(
    shipmentId: string,
    newMilestone: ShipmentMilestone,
    notes?: string
  ): Promise<void> {
    const shipment = this.getShipmentById(shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${shipmentId} not found`);
    }
    
    // Update milestone
    shipment.currentMilestone = newMilestone;
    shipment.milestoneHistory.push({
      milestone: newMilestone,
      timestamp: new Date().toISOString(),
      notes,
    });
    shipment.updatedAt = new Date().toISOString();
    
    this.saveShipment(shipment);
    
    // Trigger automatic notifications
    await this.sendMilestoneNotifications(shipment, newMilestone);
    
    // Update CRM metrics
    this.updateCRMMetrics(shipment);
    
    // Check contract SLA compliance
    this.checkSLACompliance(shipment);
  }
  
  /**
   * Send notifications for milestone to all relevant parties
   */
  private static async sendMilestoneNotifications(
    shipment: FreightShipment,
    milestone: ShipmentMilestone
  ): Promise<void> {
    const config = this.MILESTONE_CONFIGS[milestone];
    if (!config) return;
    
    // Get all contacts to notify
    const recipientContactIds: string[] = [];
    const recipientEmails: string[] = [];
    const recipientPhones: string[] = [];
    
    for (const partyType of config.notifyParties) {
      const contacts = this.getShipmentContacts(shipment, partyType);
      contacts.forEach((contact) => {
        recipientContactIds.push(contact.id);
        recipientEmails.push(contact.email);
        if (contact.phone) recipientPhones.push(contact.phone);
      });
    }
    
    // Create notification message
    const message = this.generateMilestoneMessage(shipment, milestone, config);
    
    // Create notification record
    const notification: ShipmentNotification = {
      id: this.generateId(),
      shipmentId: shipment.id,
      milestone,
      recipientContactIds,
      recipientEmails,
      recipientPhones,
      methods: ['EMAIL', 'IN_APP'],
      priority: config.priority,
      subject: `Shipment ${shipment.shipmentNumber} - ${config.displayName}`,
      message,
      status: 'PENDING',
    };
    
    // Save notification
    shipment.notifications.push(notification);
    this.saveShipment(shipment);
    
    // Actually send notifications (integrate with email/SMS service)
    await this.sendNotification(notification);
  }
  
  /**
   * Generate notification message
   */
  private static generateMilestoneMessage(
    shipment: FreightShipment,
    milestone: ShipmentMilestone,
    config: MilestoneConfig
  ): string {
    const shipper = FreightForwarderCRMService.getContactById(shipment.shipperId);
    const consignee = FreightForwarderCRMService.getContactById(shipment.consigneeId);
    
    return `
📦 SHIPMENT UPDATE - ${shipment.shipmentNumber}

🎯 MILESTONE: ${config.displayName}
${config.description}

📋 SHIPMENT DETAILS:
• Mode: ${shipment.mode} Freight
• Origin: ${shipment.originPort}
• Destination: ${shipment.destinationPort}
• Shipper: ${shipper?.companyName || 'N/A'}
• Consignee: ${consignee?.companyName || 'N/A'}

📅 SCHEDULE:
• ETD: ${new Date(shipment.etd).toLocaleDateString()}
• ETA: ${new Date(shipment.eta).toLocaleDateString()}

${shipment.billOfLadingNumber ? `📄 B/L Number: ${shipment.billOfLadingNumber}` : ''}
${shipment.containerNumbers?.length ? `📦 Container(s): ${shipment.containerNumbers.join(', ')}` : ''}
${shipment.airWaybillNumber ? `✈️ AWB Number: ${shipment.airWaybillNumber}` : ''}

${config.requiresDocuments.length > 0 ? `\n📎 REQUIRED DOCUMENTS:\n${config.requiresDocuments.map(d => `• ${d}`).join('\n')}` : ''}

---
Track your shipment in real-time: https://fleetflowapp.com/tracking/${shipment.shipmentNumber}

FleetFlow TMS LLC
755 W. Big Beaver Rd STE 2020, Troy, MI 48084
Phone: (833) 386-3509
Email: support@fleetflowapp.com
`;
  }
  
  /**
   * Send notification via configured methods
   */
  private static async sendNotification(notification: ShipmentNotification): Promise<void> {
    try {
      // EMAIL notification
      if (notification.methods.includes('EMAIL')) {
        // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
        console.log(`Sending email to: ${notification.recipientEmails.join(', ')}`);
        console.log(`Subject: ${notification.subject}`);
        console.log(`Message: ${notification.message}`);
      }
      
      // SMS notification
      if (notification.methods.includes('SMS') && notification.recipientPhones) {
        // TODO: Integrate with SMS service (Twilio, etc.)
        console.log(`Sending SMS to: ${notification.recipientPhones.join(', ')}`);
      }
      
      // Mark as sent
      notification.status = 'SENT';
      notification.sentAt = new Date().toISOString();
      
      // Update notification
      this.updateNotification(notification);
    } catch (error) {
      console.error('Error sending notification:', error);
      notification.status = 'FAILED';
      this.updateNotification(notification);
    }
  }
  
  /**
   * Get contacts for shipment by party type
   */
  private static getShipmentContacts(
    shipment: FreightShipment,
    partyType: string
  ): any[] {
    const contacts: any[] = [];
    
    if (partyType === 'SHIPPER' && shipment.shipperId) {
      const contact = FreightForwarderCRMService.getContactById(shipment.shipperId);
      if (contact) contacts.push(contact);
    }
    
    if (partyType === 'CONSIGNEE' && shipment.consigneeId) {
      const contact = FreightForwarderCRMService.getContactById(shipment.consigneeId);
      if (contact) contacts.push(contact);
    }
    
    if (partyType === 'NOTIFY_PARTY') {
      shipment.notifyPartyIds.forEach((id) => {
        const contact = FreightForwarderCRMService.getContactById(id);
        if (contact) contacts.push(contact);
      });
    }
    
    if (partyType === 'CARRIER' && shipment.carrierId) {
      const contact = FreightForwarderCRMService.getContactById(shipment.carrierId);
      if (contact) contacts.push(contact);
    }
    
    if (partyType === 'CUSTOMS_BROKER' && shipment.customsBrokerId) {
      const contact = FreightForwarderCRMService.getContactById(shipment.customsBrokerId);
      if (contact) contacts.push(contact);
    }
    
    if (partyType === 'TRUCKER' && shipment.truckerId) {
      const contact = FreightForwarderCRMService.getContactById(shipment.truckerId);
      if (contact) contacts.push(contact);
    }
    
    // Add FleetFlow as freight forwarder
    if (partyType === 'FREIGHT_FORWARDER') {
      contacts.push({
        id: 'fleetflow',
        email: 'operations@fleetflowapp.com',
        companyName: 'FleetFlow TMS LLC',
      });
    }
    
    return contacts;
  }
  
  /**
   * Update CRM metrics after milestone
   */
  private static updateCRMMetrics(shipment: FreightShipment): void {
    // Update shipper metrics
    FreightForwarderCRMService.updateShipmentMetrics(
      shipment.shipperId,
      shipment.cargoValue
    );
    
    // Log activity
    FreightForwarderCRMService.logActivity({
      contactId: shipment.shipperId,
      type: 'SHIPMENT',
      description: `Shipment ${shipment.shipmentNumber} - ${shipment.currentMilestone}`,
      amount: shipment.cargoValue,
      currency: shipment.currency,
      date: new Date().toISOString(),
      createdBy: 'system',
    });
  }
  
  /**
   * Check SLA compliance
   */
  private static checkSLACompliance(shipment: FreightShipment): void {
    // TODO: Check contract SLA and send alerts if behind schedule
    const contracts = FreightForwarderContractService.getContractsByClient(shipment.consigneeId);
    
    contracts.forEach((contract) => {
      if (contract.sla) {
        // Check transit time vs commitment
        const transitTime = this.calculateTransitTime(shipment);
        if (transitTime > contract.sla.transitTimeCommitment) {
          console.warn(`Shipment ${shipment.shipmentNumber} exceeds SLA transit time`);
        }
      }
    });
  }
  
  /**
   * Calculate current transit time
   */
  private static calculateTransitTime(shipment: FreightShipment): number {
    const departureDate = new Date(shipment.etd);
    const now = new Date();
    return Math.ceil((now.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  /**
   * Get shipment by ID
   */
  static getShipmentById(shipmentId: string): FreightShipment | null {
    const shipments = this.getAllShipments();
    return shipments.find((s) => s.id === shipmentId) || null;
  }
  
  /**
   * Get all shipments
   */
  static getAllShipments(): FreightShipment[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Save shipment
   */
  private static saveShipment(shipment: FreightShipment): void {
    const shipments = this.getAllShipments();
    const index = shipments.findIndex((s) => s.id === shipment.id);
    
    if (index >= 0) {
      shipments[index] = shipment;
    } else {
      shipments.push(shipment);
    }
    
    this.saveAllShipments(shipments);
  }
  
  /**
   * Save all shipments
   */
  private static saveAllShipments(shipments: FreightShipment[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(shipments));
  }
  
  /**
   * Update notification
   */
  private static updateNotification(notification: ShipmentNotification): void {
    const shipment = this.getShipmentById(notification.shipmentId);
    if (!shipment) return;
    
    const index = shipment.notifications.findIndex((n) => n.id === notification.id);
    if (index >= 0) {
      shipment.notifications[index] = notification;
      this.saveShipment(shipment);
    }
  }
  
  /**
   * Generate unique ID
   */
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default FreightForwarderAutomationService;
