/**
 * FleetFlow Freight Forwarder Contract Management Service
 * Manages all contracts and agreements in freight forwarding operations
 * 
 * Contract Types:
 * - Client Service Agreements (Master Agreements)
 * - Carrier Rate Agreements (Ocean/Air)
 * - Customs Broker Agreements
 * - Trucking Contracts
 * - Warehouse Agreements
 * - Insurance Contracts
 * - Volume Commitment Agreements
 * 
 * @version 1.0.0
 * @author FleetFlow TMS LLC
 */

// ==================== INTERFACES ====================

export type ContractType =
  | 'CLIENT_SERVICE_AGREEMENT'    // Master service agreement with client
  | 'CARRIER_RATE_AGREEMENT'      // Rate contract with shipping line/airline
  | 'CUSTOMS_BROKER_AGREEMENT'    // Customs clearance services
  | 'TRUCKING_CONTRACT'           // Trucking services
  | 'WAREHOUSE_AGREEMENT'         // Storage and warehousing
  | 'INSURANCE_CONTRACT'          // Cargo insurance
  | 'VOLUME_COMMITMENT'           // Minimum volume agreements
  | 'SLA_AGREEMENT'               // Service level agreement
  | 'AGENCY_AGREEMENT'            // Port/destination agent
  | 'NVOCC_AGREEMENT';            // Non-Vessel Operating Common Carrier

export type ContractStatus =
  | 'DRAFT'                       // Being prepared
  | 'PENDING_APPROVAL'            // Awaiting signatures
  | 'ACTIVE'                      // In effect
  | 'EXPIRING_SOON'               // Within 30 days of expiry
  | 'EXPIRED'                     // Past expiry date
  | 'TERMINATED'                  // Ended early
  | 'SUSPENDED'                   // Temporarily inactive
  | 'RENEWED';                    // Renewed to new contract

export type PaymentTerm =
  | 'PREPAID'
  | 'COLLECT'
  | 'NET_7'
  | 'NET_15'
  | 'NET_30'
  | 'NET_45'
  | 'NET_60'
  | 'NET_90'
  | 'LC';  // Letter of Credit

export type FreightMode = 'OCEAN' | 'AIR' | 'GROUND' | 'MULTIMODAL';

export type ServiceLevel = 'STANDARD' | 'EXPRESS' | 'ECONOMY' | 'PREMIUM';

export interface RateStructure {
  mode: FreightMode;
  serviceLevel: ServiceLevel;
  origin: string;
  destination: string;
  
  // Ocean Freight Rates
  container20ft?: number;
  container40ft?: number;
  container40HC?: number;
  container45ft?: number;
  lclRatePerCBM?: number;      // Less than Container Load
  
  // Air Freight Rates
  ratePerKg?: number;
  minimumCharge?: number;
  
  // Additional Charges
  fuelSurchargePercent: number;
  securityFee?: number;
  documentationFee?: number;
  customsClearanceFee?: number;
  deliveryFee?: number;
  
  // Validity
  validFrom: string;
  validUntil: string;
  
  currency: string;
}

export interface ServiceLevelAgreement {
  transitTimeCommitment: number;  // Days
  onTimeDeliveryTarget: number;   // Percentage (e.g., 95%)
  documentTurnaroundTime: number; // Hours
  quoteResponseTime: number;      // Hours
  customerServiceHours: string;   // e.g., "24/7" or "9-5 EST"
  dedicatedAccountManager: boolean;
  trackingUpdateFrequency: string; // e.g., "Real-time", "Daily"
  penalties: {
    lateDeliveryPenalty: number;  // Dollar amount or percentage
    documentDelayPenalty: number;
  };
}

export interface VolumeCommitment {
  minimumShipments: number;       // Per period
  minimumRevenue: number;         // Dollar amount
  period: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  volumeDiscountTiers: {
    shipmentsFrom: number;
    shipmentsTo: number;
    discountPercent: number;
  }[];
  incentiveBonus?: number;        // Bonus for exceeding commitment
  shortfallPenalty?: number;      // Penalty for not meeting commitment
}

export interface LiabilityTerms {
  liabilityLimitPerShipment: number;
  liabilityLimitPerContainer: number;
  liabilityLimitPerKg: number;
  insuranceRequired: boolean;
  insuranceCoverage?: number;     // Percentage
  forceMAJEURE: boolean;
  excludedCommodities: string[];  // High-risk items
}

export interface ContractParty {
  contactId: string;              // Reference to CRM contact
  companyName: string;
  legalName: string;
  address: string;
  country: string;
  registrationNumber?: string;
  taxId?: string;
  signatory: {
    name: string;
    title: string;
    email: string;
    signedDate?: string;
    signature?: string;           // Digital signature or image URL
  };
}

export interface FreightForwarderContract {
  // Basic Information
  id: string;
  contractNumber: string;
  type: ContractType;
  status: ContractStatus;
  
  // Parties
  forwarder: ContractParty;       // FleetFlow TMS LLC
  client: ContractParty;          // Client/Shipper/Carrier/etc.
  
  // Contract Details
  title: string;
  description?: string;
  effectiveDate: string;
  expiryDate: string;
  autoRenewal: boolean;
  renewalNoticeDays: number;      // Days before expiry to notify
  
  // Financial Terms
  currency: string;
  paymentTerms: PaymentTerm;
  creditLimit?: number;
  depositRequired?: number;
  depositAmount?: number;
  
  // Rate Structures (if applicable)
  rateStructures: RateStructure[];
  
  // Service Level Agreement (if applicable)
  sla?: ServiceLevelAgreement;
  
  // Volume Commitment (if applicable)
  volumeCommitment?: VolumeCommitment;
  
  // Liability Terms
  liabilityTerms: LiabilityTerms;
  
  // Services Covered
  servicesCovered: {
    oceanFreight: boolean;
    airFreight: boolean;
    customsClearance: boolean;
    doorToDoorDelivery: boolean;
    warehousing: boolean;
    insurance: boolean;
    packingServices: boolean;
    cargoInspection: boolean;
    documentPreparation: boolean;
  };
  
  // Geographic Scope
  originCountries: string[];
  destinationCountries: string[];
  specificLanes?: string[];       // e.g., "China-USA", "Europe-Asia"
  
  // Compliance & Certifications
  complianceRequirements: string[];
  certificationsRequired: string[];
  
  // Documents
  documents: {
    id: string;
    name: string;
    type: string;
    url?: string;
    uploadedDate: string;
    version: number;
  }[];
  
  // Terms & Conditions
  termsAndConditions: string;
  specialClauses: string[];
  
  // Renewal History
  previousContractId?: string;
  renewalHistory: {
    contractId: string;
    renewedDate: string;
    renewedBy: string;
  }[];
  
  // Performance Tracking
  performance: {
    shipmentsCompleted: number;
    totalRevenue: number;
    averageTransitTime: number;
    onTimeDeliveryRate: number;
    claimsCount: number;
    claimsValue: number;
  };
  
  // Amendments
  amendments: {
    id: string;
    date: string;
    description: string;
    amendedBy: string;
    effectiveDate: string;
  }[];
  
  // Notifications
  notifications: {
    expiryReminder: boolean;
    volumeAlerts: boolean;
    performanceReports: boolean;
    renewalReminder: boolean;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastReviewedDate?: string;
  notes?: string;
}

export interface ContractSearchFilters {
  type?: ContractType[];
  status?: ContractStatus[];
  clientId?: string;
  expiringWithinDays?: number;
  createdAfter?: string;
  createdBefore?: string;
  searchTerm?: string;
}

export interface ContractAlert {
  id: string;
  contractId: string;
  type: 'EXPIRING' | 'EXPIRED' | 'VOLUME_SHORTFALL' | 'PERFORMANCE_ISSUE' | 'RENEWAL_DUE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  date: string;
  acknowledged: boolean;
}

// ==================== SERVICE CLASS ====================

export class FreightForwarderContractService {
  private static readonly STORAGE_KEY = 'ff_contracts';
  private static readonly ALERTS_KEY = 'ff_contract_alerts';
  
  /**
   * Generate unique contract number
   */
  static generateContractNumber(type: ContractType, year?: number): string {
    const prefix = this.getTypePrefix(type);
    const contractYear = year || new Date().getFullYear();
    const sequence = this.getNextSequence(type);
    
    return `${prefix}-${contractYear}-${sequence.toString().padStart(4, '0')}`;
  }
  
  /**
   * Get prefix for contract type
   */
  private static getTypePrefix(type: ContractType): string {
    const prefixes: Record<ContractType, string> = {
      CLIENT_SERVICE_AGREEMENT: 'CSA',
      CARRIER_RATE_AGREEMENT: 'CRA',
      CUSTOMS_BROKER_AGREEMENT: 'CBA',
      TRUCKING_CONTRACT: 'TRC',
      WAREHOUSE_AGREEMENT: 'WHA',
      INSURANCE_CONTRACT: 'INS',
      VOLUME_COMMITMENT: 'VOL',
      SLA_AGREEMENT: 'SLA',
      AGENCY_AGREEMENT: 'AGY',
      NVOCC_AGREEMENT: 'NVO',
    };
    return prefixes[type];
  }
  
  /**
   * Create new contract
   */
  static createContract(
    contractData: Omit<FreightForwarderContract, 'id' | 'contractNumber' | 'createdAt' | 'updatedAt' | 'performance' | 'renewalHistory' | 'amendments'>
  ): FreightForwarderContract {
    const contract: FreightForwarderContract = {
      ...contractData,
      id: this.generateId(),
      contractNumber: this.generateContractNumber(contractData.type),
      performance: {
        shipmentsCompleted: 0,
        totalRevenue: 0,
        averageTransitTime: 0,
        onTimeDeliveryRate: 100,
        claimsCount: 0,
        claimsValue: 0,
      },
      renewalHistory: [],
      amendments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.saveContract(contract);
    this.checkAndCreateAlerts(contract);
    
    return contract;
  }
  
  /**
   * Update contract
   */
  static updateContract(
    contractId: string,
    updates: Partial<FreightForwarderContract>
  ): FreightForwarderContract | null {
    const contracts = this.getAllContracts();
    const index = contracts.findIndex((c) => c.id === contractId);
    
    if (index === -1) return null;
    
    contracts[index] = {
      ...contracts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    this.saveAllContracts(contracts);
    this.checkAndCreateAlerts(contracts[index]);
    
    return contracts[index];
  }
  
  /**
   * Add amendment to contract
   */
  static addAmendment(
    contractId: string,
    description: string,
    effectiveDate: string,
    amendedBy: string
  ): boolean {
    const contract = this.getContractById(contractId);
    if (!contract) return false;
    
    const amendment = {
      id: this.generateId(),
      date: new Date().toISOString(),
      description,
      amendedBy,
      effectiveDate,
    };
    
    contract.amendments.push(amendment);
    this.updateContract(contractId, { amendments: contract.amendments });
    
    return true;
  }
  
  /**
   * Renew contract
   */
  static renewContract(
    contractId: string,
    newExpiryDate: string,
    renewedBy: string
  ): FreightForwarderContract | null {
    const oldContract = this.getContractById(contractId);
    if (!oldContract) return null;
    
    // Create new contract based on old one
    const newContract: FreightForwarderContract = {
      ...oldContract,
      id: this.generateId(),
      contractNumber: this.generateContractNumber(oldContract.type),
      status: 'ACTIVE',
      effectiveDate: new Date().toISOString(),
      expiryDate: newExpiryDate,
      previousContractId: contractId,
      renewalHistory: [
        ...oldContract.renewalHistory,
        {
          contractId: contractId,
          renewedDate: new Date().toISOString(),
          renewedBy,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Mark old contract as renewed
    this.updateContract(contractId, { status: 'RENEWED' });
    
    // Save new contract
    this.saveContract(newContract);
    
    return newContract;
  }
  
  /**
   * Get contract by ID
   */
  static getContractById(contractId: string): FreightForwarderContract | null {
    const contracts = this.getAllContracts();
    return contracts.find((c) => c.id === contractId) || null;
  }
  
  /**
   * Get contract by number
   */
  static getContractByNumber(contractNumber: string): FreightForwarderContract | null {
    const contracts = this.getAllContracts();
    return contracts.find((c) => c.contractNumber === contractNumber) || null;
  }
  
  /**
   * Get all contracts
   */
  static getAllContracts(): FreightForwarderContract[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Search contracts
   */
  static searchContracts(filters: ContractSearchFilters): FreightForwarderContract[] {
    let contracts = this.getAllContracts();
    
    if (filters.type && filters.type.length > 0) {
      contracts = contracts.filter((c) => filters.type!.includes(c.type));
    }
    
    if (filters.status && filters.status.length > 0) {
      contracts = contracts.filter((c) => filters.status!.includes(c.status));
    }
    
    if (filters.clientId) {
      contracts = contracts.filter((c) => c.client.contactId === filters.clientId);
    }
    
    if (filters.expiringWithinDays) {
      const daysFromNow = new Date();
      daysFromNow.setDate(daysFromNow.getDate() + filters.expiringWithinDays);
      
      contracts = contracts.filter((c) => {
        const expiryDate = new Date(c.expiryDate);
        return expiryDate <= daysFromNow && expiryDate >= new Date();
      });
    }
    
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      contracts = contracts.filter(
        (c) =>
          c.contractNumber.toLowerCase().includes(term) ||
          c.title.toLowerCase().includes(term) ||
          c.client.companyName.toLowerCase().includes(term)
      );
    }
    
    return contracts;
  }
  
  /**
   * Get contracts by client
   */
  static getContractsByClient(contactId: string): FreightForwarderContract[] {
    return this.getAllContracts().filter((c) => c.client.contactId === contactId);
  }
  
  /**
   * Get active contracts
   */
  static getActiveContracts(): FreightForwarderContract[] {
    return this.getAllContracts().filter((c) => c.status === 'ACTIVE');
  }
  
  /**
   * Get expiring contracts
   */
  static getExpiringContracts(withinDays: number = 30): FreightForwarderContract[] {
    const daysFromNow = new Date();
    daysFromNow.setDate(daysFromNow.getDate() + withinDays);
    
    return this.getAllContracts().filter((c) => {
      if (c.status !== 'ACTIVE') return false;
      
      const expiryDate = new Date(c.expiryDate);
      return expiryDate <= daysFromNow && expiryDate >= new Date();
    });
  }
  
  /**
   * Get expired contracts
   */
  static getExpiredContracts(): FreightForwarderContract[] {
    const now = new Date();
    
    return this.getAllContracts().filter((c) => {
      const expiryDate = new Date(c.expiryDate);
      return expiryDate < now && c.status === 'ACTIVE';
    });
  }
  
  /**
   * Update contract performance
   */
  static updatePerformance(
    contractId: string,
    shipmentValue: number,
    transitTime: number,
    onTime: boolean,
    claim?: { value: number }
  ): void {
    const contract = this.getContractById(contractId);
    if (!contract) return;
    
    const performance = contract.performance;
    const shipmentsCompleted = performance.shipmentsCompleted + 1;
    const totalRevenue = performance.totalRevenue + shipmentValue;
    
    // Calculate new average transit time
    const averageTransitTime =
      (performance.averageTransitTime * performance.shipmentsCompleted + transitTime) /
      shipmentsCompleted;
    
    // Calculate on-time delivery rate
    const onTimeDeliveries =
      Math.round(performance.onTimeDeliveryRate * performance.shipmentsCompleted / 100) +
      (onTime ? 1 : 0);
    const onTimeDeliveryRate = Math.round((onTimeDeliveries / shipmentsCompleted) * 100);
    
    // Update claims
    const claimsCount = claim ? performance.claimsCount + 1 : performance.claimsCount;
    const claimsValue = claim ? performance.claimsValue + claim.value : performance.claimsValue;
    
    this.updateContract(contractId, {
      performance: {
        shipmentsCompleted,
        totalRevenue,
        averageTransitTime: Math.round(averageTransitTime),
        onTimeDeliveryRate,
        claimsCount,
        claimsValue,
      },
    });
    
    // Check volume commitment
    if (contract.volumeCommitment) {
      this.checkVolumeCommitment(contract);
    }
  }
  
  /**
   * Check volume commitment
   */
  private static checkVolumeCommitment(contract: FreightForwarderContract): void {
    if (!contract.volumeCommitment) return;
    
    const { minimumShipments, minimumRevenue } = contract.volumeCommitment;
    const { shipmentsCompleted, totalRevenue } = contract.performance;
    
    // Check if approaching shortfall
    const contractDuration = this.getContractDuration(contract);
    const elapsed = this.getElapsedDays(contract.effectiveDate);
    const expectedShipments = (minimumShipments * elapsed) / contractDuration;
    const expectedRevenue = (minimumRevenue * elapsed) / contractDuration;
    
    if (shipmentsCompleted < expectedShipments * 0.8) {
      this.createAlert({
        contractId: contract.id,
        type: 'VOLUME_SHORTFALL',
        severity: 'HIGH',
        message: `Contract ${contract.contractNumber} is behind on volume commitment. Expected: ${Math.round(expectedShipments)}, Actual: ${shipmentsCompleted}`,
        date: new Date().toISOString(),
        acknowledged: false,
      });
    }
    
    if (totalRevenue < expectedRevenue * 0.8) {
      this.createAlert({
        contractId: contract.id,
        type: 'VOLUME_SHORTFALL',
        severity: 'HIGH',
        message: `Contract ${contract.contractNumber} is behind on revenue commitment. Expected: $${Math.round(expectedRevenue)}, Actual: $${Math.round(totalRevenue)}`,
        date: new Date().toISOString(),
        acknowledged: false,
      });
    }
  }
  
  /**
   * Check and create alerts
   */
  private static checkAndCreateAlerts(contract: FreightForwarderContract): void {
    const now = new Date();
    const expiryDate = new Date(contract.expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Expiring soon alert
    if (daysUntilExpiry <= 30 && daysUntilExpiry > 0 && contract.status === 'ACTIVE') {
      this.createAlert({
        contractId: contract.id,
        type: 'EXPIRING',
        severity: daysUntilExpiry <= 7 ? 'CRITICAL' : 'HIGH',
        message: `Contract ${contract.contractNumber} expires in ${daysUntilExpiry} days`,
        date: new Date().toISOString(),
        acknowledged: false,
      });
    }
    
    // Expired alert
    if (expiryDate < now && contract.status === 'ACTIVE') {
      this.createAlert({
        contractId: contract.id,
        type: 'EXPIRED',
        severity: 'CRITICAL',
        message: `Contract ${contract.contractNumber} has expired`,
        date: new Date().toISOString(),
        acknowledged: false,
      });
      
      // Auto-update status
      this.updateContract(contract.id, { status: 'EXPIRED' });
    }
    
    // Performance issues
    if (contract.sla && contract.performance.shipmentsCompleted > 10) {
      if (contract.performance.onTimeDeliveryRate < contract.sla.onTimeDeliveryTarget) {
        this.createAlert({
          contractId: contract.id,
          type: 'PERFORMANCE_ISSUE',
          severity: 'MEDIUM',
          message: `Contract ${contract.contractNumber} is below SLA target. On-time: ${contract.performance.onTimeDeliveryRate}%, Target: ${contract.sla.onTimeDeliveryTarget}%`,
          date: new Date().toISOString(),
          acknowledged: false,
        });
      }
    }
  }
  
  /**
   * Create alert
   */
  private static createAlert(alert: Omit<ContractAlert, 'id'>): ContractAlert {
    const newAlert: ContractAlert = {
      ...alert,
      id: this.generateId(),
    };
    
    const alerts = this.getAllAlerts();
    // Avoid duplicate alerts
    const exists = alerts.some(
      (a) => a.contractId === alert.contractId && a.type === alert.type && !a.acknowledged
    );
    
    if (!exists) {
      alerts.push(newAlert);
      this.saveAllAlerts(alerts);
    }
    
    return newAlert;
  }
  
  /**
   * Get all alerts
   */
  static getAllAlerts(): ContractAlert[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }
  
  /**
   * Get alerts for contract
   */
  static getAlertsForContract(contractId: string): ContractAlert[] {
    return this.getAllAlerts().filter((a) => a.contractId === contractId);
  }
  
  /**
   * Acknowledge alert
   */
  static acknowledgeAlert(alertId: string): boolean {
    const alerts = this.getAllAlerts();
    const alert = alerts.find((a) => a.id === alertId);
    
    if (!alert) return false;
    
    alert.acknowledged = true;
    this.saveAllAlerts(alerts);
    
    return true;
  }
  
  /**
   * Get statistics
   */
  static getStatistics(): {
    totalContracts: number;
    activeContracts: number;
    expiringContracts: number;
    expiredContracts: number;
    totalRevenue: number;
    averageContractValue: number;
    byType: Record<string, number>;
  } {
    const contracts = this.getAllContracts();
    const active = contracts.filter((c) => c.status === 'ACTIVE');
    const expiring = this.getExpiringContracts(30);
    const expired = this.getExpiredContracts();
    
    const totalRevenue = contracts.reduce((sum, c) => sum + c.performance.totalRevenue, 0);
    const averageContractValue = contracts.length > 0 ? totalRevenue / contracts.length : 0;
    
    const byType = contracts.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalContracts: contracts.length,
      activeContracts: active.length,
      expiringContracts: expiring.length,
      expiredContracts: expired.length,
      totalRevenue,
      averageContractValue,
      byType,
    };
  }
  
  /**
   * Export contract to PDF-ready format
   */
  static exportContractData(contractId: string): any {
    const contract = this.getContractById(contractId);
    if (!contract) return null;
    
    return {
      contractNumber: contract.contractNumber,
      type: contract.type,
      parties: {
        forwarder: contract.forwarder,
        client: contract.client,
      },
      dates: {
        effectiveDate: new Date(contract.effectiveDate).toLocaleDateString(),
        expiryDate: new Date(contract.expiryDate).toLocaleDateString(),
      },
      financialTerms: {
        currency: contract.currency,
        paymentTerms: contract.paymentTerms,
        creditLimit: contract.creditLimit,
      },
      rateStructures: contract.rateStructures,
      sla: contract.sla,
      volumeCommitment: contract.volumeCommitment,
      liabilityTerms: contract.liabilityTerms,
      termsAndConditions: contract.termsAndConditions,
    };
  }
  
  // ==================== PRIVATE HELPER METHODS ====================
  
  private static saveContract(contract: FreightForwarderContract): void {
    const contracts = this.getAllContracts();
    contracts.push(contract);
    this.saveAllContracts(contracts);
  }
  
  private static saveAllContracts(contracts: FreightForwarderContract[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(contracts));
  }
  
  private static saveAllAlerts(alerts: ContractAlert[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts));
  }
  
  private static getNextSequence(type: ContractType): number {
    const contracts = this.getAllContracts();
    const typeContracts = contracts.filter((c) => c.type === type);
    return typeContracts.length + 1;
  }
  
  private static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static getContractDuration(contract: FreightForwarderContract): number {
    const start = new Date(contract.effectiveDate);
    const end = new Date(contract.expiryDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  private static getElapsedDays(startDate: string): number {
    const start = new Date(startDate);
    const now = new Date();
    return Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export default FreightForwarderContractService;
