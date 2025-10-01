/**
 * FleetFlow Freight Forwarder CRM Service
 * Complete contact and relationship management for freight forwarding
 * 
 * Manages 12 Contact Types:
 * - Shippers (Exporters)
 * - Consignees (Importers/Clients)
 * - Carriers (Ocean/Air)
 * - Customs Brokers
 * - Trucking Companies
 * - Warehouse Providers
 * - Port Agents
 * - Freight Forwarder Partners
 * - Banks
 * - Insurance Providers
 * - Notify Parties
 * - General Vendors
 * 
 * @version 1.0.0
 * @author FleetFlow TMS LLC
 */

// ==================== TYPE DEFINITIONS ====================

export type ContactType =
  | 'SHIPPER'           // Exporter/Seller
  | 'CONSIGNEE'         // Importer/Buyer/Client
  | 'NOTIFY_PARTY'      // Party to be notified
  | 'CARRIER'           // Shipping line or airline
  | 'CUSTOMS_BROKER'    // Customs clearance agent
  | 'TRUCKER'           // Trucking company
  | 'WAREHOUSE'         // Warehouse/storage provider
  | 'PORT_AGENT'        // Port handling agent
  | 'FREIGHT_FORWARDER' // Other forwarders (partners)
  | 'BANK'              // Financial institution
  | 'INSURANCE'         // Insurance provider
  | 'VENDOR';           // General vendor

export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'BLOCKED';

export type PaymentTerm =
  | 'PREPAID'
  | 'COLLECT'
  | 'NET_7'
  | 'NET_15'
  | 'NET_30'
  | 'NET_45'
  | 'NET_60'
  | 'NET_90'
  | 'COD'
  | 'LC';  // Letter of Credit

export type CreditRating = 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' | 'NONE';

export interface ContactAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  countryCode: string;
  isDefault?: boolean;
  type: 'BILLING' | 'SHIPPING' | 'WAREHOUSE' | 'OFFICE';
}

export interface ContactPerson {
  id: string;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  phone: string;
  mobile?: string;
  fax?: string;
  department?: string;
  isPrimary: boolean;
  notes?: string;
}

export interface ShipperInfo {
  exportLicenseNumber?: string;
  exportLicenseExpiry?: string;
  manufacturerIdNumber?: string;
  vatNumber?: string;
  exportCategories: string[];
  averageShipmentValue: number;
  preferredIncoterms: string[];
}

export interface ConsigneeInfo {
  importLicenseNumber?: string;
  importLicenseExpiry?: string;
  vatNumber?: string;
  taxId?: string;
  importCategories: string[];
  creditLimit: number;
  creditUsed: number;
  paymentTerms: PaymentTerm;
  creditRating: CreditRating;
}

export interface CarrierInfo {
  carrierType: 'OCEAN' | 'AIR' | 'GROUND' | 'RAIL';
  scacCode?: string;
  iataCode?: string;
  carrierCode: string;
  vesselNames?: string[];
  serviceRoutes: string[];
  transitTimes: Record<string, number>;
  freeTimeDays: number;
}

export interface CustomsBrokerInfo {
  brokerLicenseNumber: string;
  brokerLicenseExpiry?: string;
  bondNumber?: string;
  specializations: string[];
  portsServed: string[];
  customsClearanceSuccess: number;
}

export interface FreightForwarderContact {
  id: string;
  contactCode: string;
  type: ContactType;
  status: ContactStatus;
  
  companyName: string;
  legalName?: string;
  tradeName?: string;
  website?: string;
  
  email: string;
  phone: string;
  fax?: string;
  alternatePhone?: string;
  
  addresses: ContactAddress[];
  contactPersons: ContactPerson[];
  
  shipperInfo?: ShipperInfo;
  consigneeInfo?: ConsigneeInfo;
  carrierInfo?: CarrierInfo;
  customsBrokerInfo?: CustomsBrokerInfo;
  
  industry?: string;
  companySize?: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  yearEstablished?: number;
  numberOfEmployees?: number;
  
  currency: string;
  paymentTerms?: PaymentTerm;
  creditLimit?: number;
  creditUsed?: number;
  
  taxId?: string;
  ein?: string;
  duns?: string;
  certifications: string[];
  
  parentCompany?: string;
  subsidiaries: string[];
  tags: string[];
  
  totalShipments: number;
  totalRevenue: number;
  averageShipmentValue: number;
  onTimeDeliveryRate?: number;
  lastShipmentDate?: string;
  
  documents: {
    name: string;
    type: string;
    url?: string;
    uploadedDate: string;
    expiryDate?: string;
  }[];
  
  notes: string;
  internalNotes?: string;
  
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastContactedDate?: string;
}

export interface ContactActivity {
  id: string;
  contactId: string;
  type: 'SHIPMENT' | 'QUOTE' | 'PAYMENT' | 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';
  description: string;
  amount?: number;
  currency?: string;
  date: string;
  createdBy: string;
  metadata?: any;
}

// ==================== CRM SERVICE ====================

export class FreightForwarderCRMService {
  private static readonly STORAGE_KEY = 'ff_crm_contacts';
  private static readonly ACTIVITY_KEY = 'ff_crm_activities';
  
  /**
   * Generate contact code based on type
   */
  static generateContactCode(type: ContactType): string {
    const prefix = this.getTypePrefix(type);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${prefix}${timestamp}${random}`;
  }
  
  private static getTypePrefix(type: ContactType): string {
    const prefixes: Record<ContactType, string> = {
      SHIPPER: 'SHP',
      CONSIGNEE: 'CNE',
      NOTIFY_PARTY: 'NTY',
      CARRIER: 'CAR',
      CUSTOMS_BROKER: 'CUS',
      TRUCKER: 'TRK',
      WAREHOUSE: 'WHS',
      PORT_AGENT: 'PRT',
      FREIGHT_FORWARDER: 'FFW',
      BANK: 'BNK',
      INSURANCE: 'INS',
      VENDOR: 'VND',
    };
    return prefixes[type];
  }
  
  /**
   * Create new contact
   */
  static createContact(
    contactData: Omit<FreightForwarderContact, 'id' | 'contactCode' | 'createdAt' | 'updatedAt' | 'totalShipments' | 'totalRevenue' | 'averageShipmentValue'>
  ): FreightForwarderContact {
    const contact: FreightForwarderContact = {
      ...contactData,
      id: this.generateId(),
      contactCode: this.generateContactCode(contactData.type),
      totalShipments: 0,
      totalRevenue: 0,
      averageShipmentValue: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveContact(contact);
    return contact;
  }
  
  /**
   * Update contact
   */
  static updateContact(
    contactId: string,
    updates: Partial<FreightForwarderContact>
  ): FreightForwarderContact | null {
    const contacts = this.getAllContacts();
    const index = contacts.findIndex((c) => c.id === contactId);
    
    if (index === -1) return null;
    
    contacts[index] = {
      ...contacts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveAllContacts(contacts);
    return contacts[index];
  }
  
  /**
   * Get contact by ID
   */
  static getContactById(contactId: string): FreightForwarderContact | null {
    const contacts = this.getAllContacts();
    return contacts.find((c) => c.id === contactId) || null;
  }
  
  /**
   * Get all contacts
   */
  static getAllContacts(): FreightForwarderContact[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Get contacts by type
   */
  static getContactsByType(type: ContactType): FreightForwarderContact[] {
    return this.getAllContacts().filter((c) => c.type === type);
  }
  
  /**
   * Get shippers
   */
  static getShippers(): FreightForwarderContact[] {
    return this.getContactsByType('SHIPPER');
  }
  
  /**
   * Get consignees (clients)
   */
  static getConsignees(): FreightForwarderContact[] {
    return this.getContactsByType('CONSIGNEE');
  }
  
  /**
   * Get carriers
   */
  static getCarriers(): FreightForwarderContact[] {
    return this.getContactsByType('CARRIER');
  }
  
  /**
   * Search contacts
   */
  static searchContacts(searchTerm: string): FreightForwarderContact[] {
    const term = searchTerm.toLowerCase();
    return this.getAllContacts().filter(
      (c) =>
        c.companyName.toLowerCase().includes(term) ||
        c.contactCode.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  }
  
  /**
   * Delete contact
   */
  static deleteContact(contactId: string): boolean {
    const contacts = this.getAllContacts();
    const filtered = contacts.filter((c) => c.id !== contactId);
    
    if (filtered.length === contacts.length) return false;
    
    this.saveAllContacts(filtered);
    return true;
  }
  
  /**
   * Log activity
   */
  static logActivity(activity: Omit<ContactActivity, 'id'>): ContactActivity {
    const newActivity: ContactActivity = {
      ...activity,
      id: this.generateId(),
    };
    
    const activities = this.getAllActivities();
    activities.push(newActivity);
    this.saveAllActivities(activities);
    
    this.updateContact(activity.contactId, {
      lastContactedDate: activity.date,
    });
    
    return newActivity;
  }
  
  /**
   * Get contact activities
   */
  static getContactActivities(contactId: string): ContactActivity[] {
    const activities = this.getAllActivities();
    return activities
      .filter((a) => a.contactId === contactId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  /**
   * Update shipment metrics
   */
  static updateShipmentMetrics(
    contactId: string,
    shipmentValue: number
  ): void {
    const contact = this.getContactById(contactId);
    if (!contact) return;
    
    const totalShipments = contact.totalShipments + 1;
    const totalRevenue = contact.totalRevenue + shipmentValue;
    const averageShipmentValue = totalRevenue / totalShipments;
    
    this.updateContact(contactId, {
      totalShipments,
      totalRevenue,
      averageShipmentValue,
      lastShipmentDate: new Date().toISOString(),
    });
  }
  
  /**
   * Get statistics
   */
  static getStatistics(): {
    totalContacts: number;
    byType: Record<ContactType, number>;
    byStatus: Record<ContactStatus, number>;
    totalRevenue: number;
    totalShipments: number;
  } {
    const contacts = this.getAllContacts();
    
    const byType = contacts.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<ContactType, number>);
    
    const byStatus = contacts.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<ContactStatus, number>);
    
    const totalRevenue = contacts.reduce((sum, c) => sum + c.totalRevenue, 0);
    const totalShipments = contacts.reduce((sum, c) => sum + c.totalShipments, 0);
    
    return {
      totalContacts: contacts.length,
      byType,
      byStatus,
      totalRevenue,
      totalShipments,
    };
  }
  
  // ==================== PRIVATE METHODS ====================
  
  private static saveContact(contact: FreightForwarderContact): void {
    const contacts = this.getAllContacts();
    contacts.push(contact);
    this.saveAllContacts(contacts);
  }
  
  private static saveAllContacts(contacts: FreightForwarderContact[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contacts));
  }
  
  private static getAllActivities(): ContactActivity[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.ACTIVITY_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  private static saveAllActivities(activities: ContactActivity[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ACTIVITY_KEY, JSON.stringify(activities));
  }
  
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default FreightForwarderCRMService;
