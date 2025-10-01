/**
 * FleetFlow Multi-Tenant Freight Forwarder Service
 * 
 * CRITICAL ARCHITECTURE:
 * - FleetFlow TMS LLC = SaaS Platform Provider
 * - Tenant = Freight Forwarder/Broker using FleetFlow
 * - Client = Tenant's customer (shipper/consignee)
 * 
 * Each tenant has:
 * - Own CRM database (contacts isolated by tenant)
 * - Own contracts (with their clients)
 * - Own shipments
 * - Own branding/white-label
 * - Own subscription to FleetFlow platform
 * 
 * FleetFlow provides:
 * - Platform infrastructure
 * - Software licenses
 * - Support and maintenance
 * - Updates and features
 * - Data storage and security
 * 
 * @version 2.0.0 - Multi-Tenant Architecture
 * @author FleetFlow TMS LLC
 */

// ==================== MULTI-TENANT TYPES ====================

export interface FleetFlowTenant {
  id: string;
  tenantCode: string;
  
  // Company Information
  companyName: string;
  legalName: string;
  dbaName?: string;
  businessType: 'FREIGHT_FORWARDER' | 'FREIGHT_BROKER' | 'CARRIER' | 'CUSTOMS_BROKER' | '3PL';
  
  // Contact Information
  primaryContact: {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    phone: string;
  };
  
  // Business Address
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Legal & Compliance
  taxId: string;
  ein: string;
  duns?: string;
  mcNumber?: string;           // For brokers
  dotNumber?: string;           // For carriers
  fmcNumber?: string;           // For NVOCCs
  customsBrokerLicense?: string;
  
  // Certifications
  certifications: string[];     // WOSB, C-TPAT, ISO, etc.
  
  // FleetFlow Subscription
  subscription: {
    plan: 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'CUSTOM';
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'TRIAL';
    startDate: string;
    renewalDate: string;
    monthlyFee: number;
    users: number;
    maxShipments: number;
    features: string[];
  };
  
  // White Label / Branding
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    customDomain?: string;
    emailDomain?: string;
  };
  
  // Platform Terms
  platformAgreement: {
    accepted: boolean;
    acceptedDate?: string;
    acceptedBy?: string;
    version: string;
  };
  
  // Settings
  settings: {
    timezone: string;
    currency: string;
    language: string;
    notificationPreferences: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
  
  // Status
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface PlatformContract {
  // This is between FleetFlow and Tenant
  id: string;
  contractNumber: string;
  
  // Parties
  platform: {
    name: 'FleetFlow TMS LLC';
    legalName: 'FleetFlow TMS LLC';
    address: '755 W. Big Beaver Rd STE 2020, Troy, MI 48084';
    taxId: string;
    signatory: {
      name: 'Dieasha Davis';
      title: 'President & CEO';
      email: 'dee@fleetflowapp.com';
    };
  };
  
  tenant: FleetFlowTenant;
  
  // Terms
  subscriptionPlan: string;
  monthlyFee: number;
  setupFee?: number;
  transactionFees?: {
    perShipment?: number;
    percentage?: number;
  };
  
  effectiveDate: string;
  renewalDate: string;
  autoRenewal: boolean;
  
  // Service Level Agreement
  platformSLA: {
    uptime: number;              // e.g., 99.9%
    supportResponseTime: number; // hours
    dataBackupFrequency: string; // daily, hourly
    disasterRecovery: string;
  };
  
  // Data & Security
  dataRetention: {
    period: number;              // years
    backupStorage: string;
  };
  
  dataPrivacy: {
    gdprCompliant: boolean;
    hipaaCompliant: boolean;
    soc2Certified: boolean;
  };
  
  // Liability
  platformLiability: {
    dataLoss: number;            // max liability
    serviceOutage: number;
    securityBreach: number;
  };
  
  // Termination
  terminationNotice: number;     // days
  
  status: 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

// ==================== MULTI-TENANT SERVICE ====================

export class MultiTenantFreightForwarderService {
  private static readonly TENANT_KEY = 'ff_tenants';
  private static readonly PLATFORM_CONTRACTS_KEY = 'ff_platform_contracts';
  
  /**
   * Create new tenant (freight forwarder signs up for FleetFlow)
   */
  static createTenant(tenantData: Omit<FleetFlowTenant, 'id' | 'tenantCode' | 'createdAt' | 'updatedAt'>): FleetFlowTenant {
    const tenant: FleetFlowTenant = {
      ...tenantData,
      id: this.generateId(),
      tenantCode: this.generateTenantCode(tenantData.companyName),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveTenant(tenant);
    return tenant;
  }
  
  /**
   * Generate tenant code
   */
  private static generateTenantCode(companyName: string): string {
    const prefix = companyName
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .substring(0, 3);
    
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  }
  
  /**
   * Create platform contract (between FleetFlow and Tenant)
   */
  static createPlatformContract(tenant: FleetFlowTenant, plan: string): PlatformContract {
    const planPricing = this.getPlanPricing(plan);
    
    const contract: PlatformContract = {
      id: this.generateId(),
      contractNumber: `PLATFORM-${Date.now()}`,
      platform: {
        name: 'FleetFlow TMS LLC',
        legalName: 'FleetFlow TMS LLC',
        address: '755 W. Big Beaver Rd STE 2020, Troy, MI 48084',
        taxId: '47-5678901',
        signatory: {
          name: 'Dieasha Davis',
          title: 'President & CEO',
          email: 'dee@fleetflowapp.com',
        },
      },
      tenant,
      subscriptionPlan: plan,
      monthlyFee: planPricing.monthlyFee,
      setupFee: planPricing.setupFee,
      transactionFees: planPricing.transactionFees,
      effectiveDate: new Date().toISOString(),
      renewalDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      autoRenewal: true,
      platformSLA: {
        uptime: 99.9,
        supportResponseTime: 24,
        dataBackupFrequency: 'daily',
        disasterRecovery: '24-hour RTO',
      },
      dataRetention: {
        period: 7,
        backupStorage: 'AWS S3',
      },
      dataPrivacy: {
        gdprCompliant: true,
        hipaaCompliant: false,
        soc2Certified: true,
      },
      platformLiability: {
        dataLoss: 100000,
        serviceOutage: 50000,
        securityBreach: 250000,
      },
      terminationNotice: 30,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.savePlatformContract(contract);
    return contract;
  }
  
  /**
   * Get plan pricing
   */
  private static getPlanPricing(plan: string) {
    const pricing: Record<string, any> = {
      STARTER: {
        monthlyFee: 299,
        setupFee: 0,
        transactionFees: { perShipment: 5 },
      },
      PROFESSIONAL: {
        monthlyFee: 799,
        setupFee: 500,
        transactionFees: { perShipment: 3 },
      },
      ENTERPRISE: {
        monthlyFee: 1999,
        setupFee: 1500,
        transactionFees: { perShipment: 1 },
      },
      CUSTOM: {
        monthlyFee: 0,
        setupFee: 0,
        transactionFees: {},
      },
    };
    
    return pricing[plan] || pricing.STARTER;
  }
  
  /**
   * Get tenant by ID
   */
  static getTenantById(tenantId: string): FleetFlowTenant | null {
    const tenants = this.getAllTenants();
    return tenants.find((t) => t.id === tenantId) || null;
  }
  
  /**
   * Get all tenants
   */
  static getAllTenants(): FleetFlowTenant[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.TENANT_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Get tenant contacts (isolated by tenant)
   */
  static getTenantContacts(tenantId: string): any[] {
    // This would filter contacts by tenantId in the database
    // For now, using localStorage with tenant prefix
    if (typeof window === 'undefined') return [];
    
    const key = `${tenantId}_contacts`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Get tenant contracts (isolated by tenant)
   */
  static getTenantContracts(tenantId: string): any[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${tenantId}_contracts`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Get tenant shipments (isolated by tenant)
   */
  static getTenantShipments(tenantId: string): any[] {
    if (typeof window === 'undefined') return [];
    
    const key = `${tenantId}_shipments`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }
  
  // ==================== PRIVATE METHODS ====================
  
  private static saveTenant(tenant: FleetFlowTenant): void {
    const tenants = this.getAllTenants();
    tenants.push(tenant);
    this.saveAllTenants(tenants);
  }
  
  private static saveAllTenants(tenants: FleetFlowTenant[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenants));
  }
  
  private static savePlatformContract(contract: PlatformContract): void {
    const contracts = this.getAllPlatformContracts();
    contracts.push(contract);
    this.saveAllPlatformContracts(contracts);
  }
  
  private static getAllPlatformContracts(): PlatformContract[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.PLATFORM_CONTRACTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  private static saveAllPlatformContracts(contracts: PlatformContract[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.PLATFORM_CONTRACTS_KEY, JSON.stringify(contracts));
  }
  
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default MultiTenantFreightForwarderService;
