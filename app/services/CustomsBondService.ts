/**
 * FLEETFLOW CUSTOMS BOND MANAGEMENT SERVICE
 *
 * Comprehensive bond management system for freight forwarders and customs brokers.
 * Manages customs bonds, surety companies, renewals, and utilization tracking.
 *
 * Features:
 * - Bond registration and management
 * - Surety company integration
 * - Bond utilization tracking
 * - Renewal alerts and automation
 * - Bond type management (single, continuous, annual)
 * - Port coverage management
 * - Financial reporting
 */

export type BondType = 'SINGLE' | 'CONTINUOUS' | 'ANNUAL';
export type BondStatus =
  | 'ACTIVE'
  | 'EXPIRED'
  | 'CANCELLED'
  | 'SUSPENDED'
  | 'PENDING';
export type BondActivityType = 'ENTRY' | 'RELEASE' | 'CANCELLATION' | 'RENEWAL';

export interface CustomsBond {
  id: string;
  bondNumber: string;
  bondType: BondType;
  suretyCompany: string;
  principalName: string; // Usually the freight forwarder or broker
  importerOfRecord?: string;
  bondAmount: number;
  currency: string;
  effectiveDate: Date;
  expiryDate: Date;
  portsCovered: string[]; // Port codes where bond is valid
  status: BondStatus;
  utilizationPercentage: number;
  maxUtilizationAmount: number;
  currentUtilizationAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BondActivity {
  id: string;
  bondId: string;
  activityType: BondActivityType;
  entryNumber?: string; // For customs entries
  amount: number;
  description: string;
  activityDate: Date;
  portOfEntry?: string;
}

export interface BondRenewal {
  id: string;
  bondId: string;
  renewalDate: Date;
  previousExpiry: Date;
  newExpiry: Date;
  renewalAmount?: number; // If bond amount changed
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  renewalFee: number;
  suretyConfirmation?: Date;
}

export interface SuretyCompany {
  id: string;
  name: string;
  licenseNumber: string;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  bondLimits: {
    singleEntry: number;
    continuous: number;
    annual: number;
  };
  isActive: boolean;
  rating: 'A' | 'B' | 'C' | 'D'; // Surety company rating
}

export class CustomsBondService {
  private bonds: Map<string, CustomsBond> = new Map();
  private activities: Map<string, BondActivity[]> = new Map();
  private renewals: Map<string, BondRenewal[]> = new Map();
  private suretyCompanies: Map<string, SuretyCompany> = new Map();

  constructor() {
    this.initializeDefaultSuretyCompanies();
  }

  /**
   * BOND REGISTRATION & MANAGEMENT
   */

  /**
   * Register a new customs bond
   */
  async registerBond(
    bondData: Omit<
      CustomsBond,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'utilizationPercentage'
      | 'currentUtilizationAmount'
    >
  ): Promise<CustomsBond> {
    const bond: CustomsBond = {
      ...bondData,
      id: `BOND-${Date.now()}`,
      utilizationPercentage: 0,
      currentUtilizationAmount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.bonds.set(bond.id, bond);
    this.activities.set(bond.id, []);

    console.log(`✅ Registered customs bond: ${bond.bondNumber}`);
    return bond;
  }

  /**
   * Update bond information
   */
  async updateBond(
    bondId: string,
    updates: Partial<CustomsBond>
  ): Promise<CustomsBond> {
    const bond = this.bonds.get(bondId);
    if (!bond) throw new Error('Bond not found');

    const updatedBond = {
      ...bond,
      ...updates,
      updatedAt: new Date(),
    };

    this.bonds.set(bondId, updatedBond);
    return updatedBond;
  }

  /**
   * Get bond by ID
   */
  async getBond(bondId: string): Promise<CustomsBond | null> {
    return this.bonds.get(bondId) || null;
  }

  /**
   * Get bonds by principal (freight forwarder/broker)
   */
  async getBondsByPrincipal(principalName: string): Promise<CustomsBond[]> {
    return Array.from(this.bonds.values()).filter(
      (bond) => bond.principalName === principalName
    );
  }

  /**
   * Get bonds by surety company
   */
  async getBondsBySurety(suretyCompany: string): Promise<CustomsBond[]> {
    return Array.from(this.bonds.values()).filter(
      (bond) => bond.suretyCompany === suretyCompany
    );
  }

  /**
   * Get bonds expiring soon (within 30 days)
   */
  async getExpiringBonds(daysAhead: number = 30): Promise<CustomsBond[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return Array.from(this.bonds.values()).filter(
      (bond) => bond.status === 'ACTIVE' && bond.expiryDate <= cutoffDate
    );
  }

  /**
   * BOND ACTIVITY TRACKING
   */

  /**
   * Record bond activity (entry, release, etc.)
   */
  async recordActivity(params: {
    bondId: string;
    activityType: BondActivityType;
    entryNumber?: string;
    amount: number;
    description: string;
    portOfEntry?: string;
  }): Promise<BondActivity> {
    const bond = this.bonds.get(params.bondId);
    if (!bond) throw new Error('Bond not found');

    const activity: BondActivity = {
      id: `ACT-${Date.now()}`,
      bondId: params.bondId,
      activityType: params.activityType,
      entryNumber: params.entryNumber,
      amount: params.amount,
      description: params.description,
      activityDate: new Date(),
      portOfEntry: params.portOfEntry,
    };

    const bondActivities = this.activities.get(params.bondId) || [];
    bondActivities.push(activity);
    this.activities.set(params.bondId, bondActivities);

    // Update bond utilization
    await this.updateBondUtilization(params.bondId);

    console.log(
      `📝 Recorded bond activity: ${params.activityType} - ${params.amount}`
    );
    return activity;
  }

  /**
   * Get bond activities
   */
  async getBondActivities(bondId: string): Promise<BondActivity[]> {
    return this.activities.get(bondId) || [];
  }

  /**
   * Update bond utilization percentage
   */
  private async updateBondUtilization(bondId: string): Promise<void> {
    const bond = this.bonds.get(bondId);
    if (!bond) return;

    const activities = this.activities.get(bondId) || [];
    const activeEntries = activities.filter(
      (activity) =>
        activity.activityType === 'ENTRY' &&
        !this.isEntryReleased(bondId, activity.entryNumber)
    );

    const totalActiveAmount = activeEntries.reduce(
      (sum, activity) => sum + activity.amount,
      0
    );
    const utilizationPercentage = (totalActiveAmount / bond.bondAmount) * 100;

    await this.updateBond(bondId, {
      currentUtilizationAmount: totalActiveAmount,
      utilizationPercentage: Math.min(utilizationPercentage, 100),
    });
  }

  /**
   * Check if an entry has been released
   */
  private isEntryReleased(bondId: string, entryNumber?: string): boolean {
    if (!entryNumber) return false;

    const activities = this.activities.get(bondId) || [];
    return activities.some(
      (activity) =>
        activity.entryNumber === entryNumber &&
        activity.activityType === 'RELEASE'
    );
  }

  /**
   * BOND RENEWAL MANAGEMENT
   */

  /**
   * Schedule bond renewal
   */
  async scheduleRenewal(params: {
    bondId: string;
    renewalDate: Date;
    newExpiry: Date;
    renewalAmount?: number;
    renewalFee: number;
  }): Promise<BondRenewal> {
    const bond = this.bonds.get(params.bondId);
    if (!bond) throw new Error('Bond not found');

    const renewal: BondRenewal = {
      id: `RNW-${Date.now()}`,
      bondId: params.bondId,
      renewalDate: params.renewalDate,
      previousExpiry: bond.expiryDate,
      newExpiry: params.newExpiry,
      renewalAmount: params.renewalAmount,
      status: 'PENDING',
      renewalFee: params.renewalFee,
    };

    const bondRenewals = this.renewals.get(params.bondId) || [];
    bondRenewals.push(renewal);
    this.renewals.set(params.bondId, bondRenewals);

    console.log(`📅 Scheduled bond renewal for ${bond.bondNumber}`);
    return renewal;
  }

  /**
   * Complete bond renewal
   */
  async completeRenewal(
    renewalId: string,
    suretyConfirmation?: Date
  ): Promise<BondRenewal> {
    // Find the renewal across all bonds
    for (const [bondId, renewals] of Array.from(this.renewals.entries())) {
      const renewalIndex = renewals.findIndex((r) => r.id === renewalId);
      if (renewalIndex !== -1) {
        const renewal = renewals[renewalIndex];
        renewal.status = 'COMPLETED';
        renewal.suretyConfirmation = suretyConfirmation || new Date();

        // Update the bond expiry date
        await this.updateBond(bondId, {
          expiryDate: renewal.newExpiry,
          status: 'ACTIVE',
        });

        this.renewals.set(bondId, renewals);
        console.log(`✅ Completed bond renewal for ${bondId}`);
        return renewal;
      }
    }

    throw new Error('Renewal not found');
  }

  /**
   * Get pending renewals
   */
  async getPendingRenewals(): Promise<BondRenewal[]> {
    const allRenewals: BondRenewal[] = [];
    for (const renewals of Array.from(this.renewals.values())) {
      allRenewals.push(...renewals.filter((r) => r.status === 'PENDING'));
    }
    return allRenewals;
  }

  /**
   * SURETY COMPANY MANAGEMENT
   */

  /**
   * Add surety company
   */
  async addSuretyCompany(
    company: Omit<SuretyCompany, 'id'>
  ): Promise<SuretyCompany> {
    const suretyCompany: SuretyCompany = {
      ...company,
      id: `SC-${Date.now()}`,
    };

    this.suretyCompanies.set(suretyCompany.id, suretyCompany);
    console.log(`🏢 Added surety company: ${suretyCompany.name}`);
    return suretyCompany;
  }

  /**
   * Get surety company by name
   */
  async getSuretyCompanyByName(name: string): Promise<SuretyCompany | null> {
    for (const company of Array.from(this.suretyCompanies.values())) {
      if (company.name === name) return company;
    }
    return null;
  }

  /**
   * Get all surety companies
   */
  async getAllSuretyCompanies(): Promise<SuretyCompany[]> {
    return Array.from(this.suretyCompanies.values());
  }

  /**
   * REPORTING & ANALYTICS
   */

  /**
   * Get bond utilization report
   */
  async getBondUtilizationReport(bondId?: string): Promise<{
    totalBonds: number;
    activeBonds: number;
    expiringSoon: number;
    highUtilization: number; // >80% utilization
    totalBondAmount: number;
    totalUtilizedAmount: number;
    averageUtilization: number;
  }> {
    const allBonds = bondId
      ? [this.bonds.get(bondId)].filter(Boolean)
      : Array.from(this.bonds.values());

    const activeBonds = allBonds.filter((b) => b.status === 'ACTIVE');
    const expiringSoon = allBonds.filter((b) => {
      const daysUntilExpiry = Math.ceil(
        (b.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      return b.status === 'ACTIVE' && daysUntilExpiry <= 30;
    });

    const highUtilization = activeBonds.filter(
      (b) => b.utilizationPercentage > 80
    );
    const totalBondAmount = allBonds.reduce((sum, b) => sum + b.bondAmount, 0);
    const totalUtilizedAmount = allBonds.reduce(
      (sum, b) => sum + b.currentUtilizationAmount,
      0
    );
    const averageUtilization =
      activeBonds.length > 0
        ? activeBonds.reduce((sum, b) => sum + b.utilizationPercentage, 0) /
          activeBonds.length
        : 0;

    return {
      totalBonds: allBonds.length,
      activeBonds: activeBonds.length,
      expiringSoon: expiringSoon.length,
      highUtilization: highUtilization.length,
      totalBondAmount,
      totalUtilizedAmount,
      averageUtilization,
    };
  }

  /**
   * Get bond activity summary
   */
  async getBondActivitySummary(
    bondId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<{
    totalEntries: number;
    totalReleases: number;
    currentActiveAmount: number;
    peakUtilization: number;
    averageEntryAmount: number;
  }> {
    const activities = this.activities.get(bondId) || [];
    const bond = this.bonds.get(bondId);

    if (!bond) throw new Error('Bond not found');

    // Filter by date range if provided
    const filteredActivities = dateRange
      ? activities.filter(
          (a) =>
            a.activityDate >= dateRange.start && a.activityDate <= dateRange.end
        )
      : activities;

    const entries = filteredActivities.filter(
      (a) => a.activityType === 'ENTRY'
    );
    const releases = filteredActivities.filter(
      (a) => a.activityType === 'RELEASE'
    );

    const totalEntries = entries.length;
    const totalReleases = releases.length;
    const currentActiveAmount = bond.currentUtilizationAmount;
    const peakUtilization = Math.max(
      ...filteredActivities.map((a) => {
        // Calculate utilization at each activity point
        const activeAtPoint = filteredActivities
          .filter(
            (act) =>
              act.activityDate <= a.activityDate && act.activityType === 'ENTRY'
          )
          .filter((act) => !this.isEntryReleased(bondId, act.entryNumber))
          .reduce((sum, act) => sum + act.amount, 0);
        return (activeAtPoint / bond.bondAmount) * 100;
      }),
      0
    );

    const averageEntryAmount =
      entries.length > 0
        ? entries.reduce((sum, e) => sum + e.amount, 0) / entries.length
        : 0;

    return {
      totalEntries,
      totalReleases,
      currentActiveAmount,
      peakUtilization,
      averageEntryAmount,
    };
  }

  /**
   * GET ALL BONDS
   */
  async getAllBonds(): Promise<CustomsBond[]> {
    return Array.from(this.bonds.values());
  }

  /**
   * UTILITY METHODS
   */

  private initializeDefaultSuretyCompanies(): void {
    const defaultCompanies: Omit<SuretyCompany, 'id'>[] = [
      {
        name: 'Liberty Mutual Surety',
        licenseNumber: 'LM-2024-001',
        contactInfo: {
          phone: '(800) 123-4567',
          email: 'surety@libertymutual.com',
          address: '123 Surety Blvd, Boston, MA 02101',
        },
        bondLimits: {
          singleEntry: 100000,
          continuous: 5000000,
          annual: 2500000,
        },
        isActive: true,
        rating: 'A',
      },
      {
        name: 'AIG Surety',
        licenseNumber: 'AIG-2024-002',
        contactInfo: {
          phone: '(800) 987-6543',
          email: 'surety@aig.com',
          address: '456 Insurance Way, New York, NY 10001',
        },
        bondLimits: {
          singleEntry: 50000,
          continuous: 2000000,
          annual: 1000000,
        },
        isActive: true,
        rating: 'A',
      },
      {
        name: 'Chubb Surety Group',
        licenseNumber: 'CHUBB-2024-003',
        contactInfo: {
          phone: '(800) 555-0123',
          email: 'surety@chubb.com',
          address: '789 Bond Street, Warren, NJ 07059',
        },
        bondLimits: {
          singleEntry: 75000,
          continuous: 3000000,
          annual: 1500000,
        },
        isActive: true,
        rating: 'A',
      },
    ];

    defaultCompanies.forEach((company) => {
      this.addSuretyCompany(company);
    });
  }
}

export const customsBondService = new CustomsBondService();
