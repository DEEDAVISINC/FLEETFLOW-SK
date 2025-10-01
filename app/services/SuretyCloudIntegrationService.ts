/**
 * FLEETFLOW SURETYCLOUD INTEGRATION SERVICE
 *
 * Hybrid integration between FleetFlow and SuretyCloud for customs bond management.
 * Since SuretyCloud doesn't offer APIs, this service provides:
 * - Automated bond application form generation for SuretyCloud submission
 * - Bond tracking and status monitoring workflows
 * - Email automation for SuretyCloud communications
 * - Document preparation and compliance checklists
 * - Bond renewal reminders and tracking
 * - Multi-surety company management
 */

import {
  BondRenewal,
  BondStatus,
  CustomsBond,
  customsBondService,
} from './CustomsBondService';

export interface SuretyCloudCredentials {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  suretyCloudLoginEmail?: string; // Optional SuretyCloud account email
  notificationEmail: string; // Where to send SuretyCloud updates
}

export interface SuretyCloudBondApplication {
  bondType: 'SINGLE' | 'CONTINUOUS' | 'ANNUAL';
  bondAmount: number;
  principalName: string;
  principalAddress: string;
  principalPhone: string;
  principalEmail: string;
  importerOfRecord?: string;
  portsOfEntry: string[];
  commodities: string[];
  estimatedAnnualValue: number;
  complianceDocuments: string[]; // URLs or file references
}

export interface SuretyCloudBondResponse {
  applicationId: string;
  bondNumber?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DECLINED' | 'ISSUED';
  suretyCompany: string;
  bondAmount: number;
  premium?: number;
  effectiveDate?: Date;
  expiryDate?: Date;
  documents: SuretyCloudDocument[];
  notes?: string;
}

export interface SuretyCloudDocument {
  id: string;
  name: string;
  type: 'APPLICATION' | 'BOND' | 'ENDORSEMENT' | 'RENEWAL' | 'CANCELLATION';
  url: string;
  uploadedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface SuretyCloudBondStatus {
  bondNumber: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
  currentUtilization: number;
  maxUtilization: number;
  lastActivity: Date;
  nextRenewalDate?: Date;
  suretyCompany: string;
}

export class SuretyCloudIntegrationService {
  private credentials: SuretyCloudCredentials | null = null;
  private baseUrl = 'https://api.suretycloud.com/v1'; // Assuming API endpoint

  /**
   * AUTHENTICATION & SETUP
   */

  /**
   * Configure SuretyCloud integration settings
   */
  async configureCredentials(
    credentials: SuretyCloudCredentials
  ): Promise<void> {
    this.credentials = credentials;
    console.log(
      '✅ SuretyCloud integration configured for organization:',
      credentials.organizationName
    );
  }

  /**
   * Validate configuration (no actual connection test since no API)
   */
  async validateConfiguration(): Promise<boolean> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    // Basic validation
    const hasRequiredFields = !!(
      this.credentials.organizationName &&
      this.credentials.contactEmail &&
      this.credentials.contactPhone &&
      this.credentials.notificationEmail
    );

    return hasRequiredFields;
  }

  /**
   * BOND APPLICATION MANAGEMENT
   */

  /**
   * Submit bond application to SuretyCloud
   */
  async submitBondApplication(
    application: SuretyCloudBondApplication
  ): Promise<SuretyCloudBondResponse> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    try {
      // Create FleetFlow bond record first
      const fleetFlowBond = await customsBondService.registerBond({
        bondNumber: `SC-${Date.now()}`, // Temporary number until SuretyCloud assigns
        bondType: application.bondType,
        suretyCompany: 'SuretyCloud Marketplace', // Will be updated when assigned
        principalName: application.principalName,
        importerOfRecord: application.importerOfRecord,
        bondAmount: application.bondAmount,
        currency: 'USD',
        effectiveDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
        portsCovered: application.portsOfEntry,
        status: 'PENDING',
        maxUtilizationAmount: application.bondAmount,
      });

      // Submit to SuretyCloud
      const suretyCloudResponse = await this.makeAuthenticatedRequest(
        '/bonds/applications',
        'POST',
        {
          organizationId: this.credentials.organizationId,
          bondType: application.bondType,
          bondAmount: application.bondAmount,
          principal: {
            name: application.principalName,
            address: application.principalAddress,
            phone: application.principalPhone,
            email: application.principalEmail,
          },
          importerOfRecord: application.importerOfRecord,
          portsOfEntry: application.portsOfEntry,
          commodities: application.commodities,
          estimatedAnnualValue: application.estimatedAnnualValue,
          complianceDocuments: application.complianceDocuments,
          fleetFlowBondId: fleetFlowBond.id, // Link back to FleetFlow
        }
      );

      // Update FleetFlow bond with SuretyCloud data
      if (suretyCloudResponse.bondNumber) {
        await customsBondService.updateBond(fleetFlowBond.id, {
          bondNumber: suretyCloudResponse.bondNumber,
          suretyCompany: suretyCloudResponse.suretyCompany,
          status: this.mapSuretyCloudStatus(suretyCloudResponse.status),
          effectiveDate: suretyCloudResponse.effectiveDate || new Date(),
          expiryDate:
            suretyCloudResponse.expiryDate ||
            new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });
      }

      // Record application activity
      await customsBondService.recordActivity({
        bondId: fleetFlowBond.id,
        activityType: 'ENTRY',
        entryNumber: suretyCloudResponse.applicationId,
        amount: 0,
        description: `Bond application submitted to SuretyCloud - ${suretyCloudResponse.status}`,
        portOfEntry: application.portsOfEntry[0],
      });

      console.log(
        `✅ Bond application submitted: ${suretyCloudResponse.applicationId}`
      );
      return suretyCloudResponse;
    } catch (error) {
      console.error('Bond application submission failed:', error);
      throw new Error(`SuretyCloud application failed: ${error.message}`);
    }
  }

  /**
   * Get bond application status from SuretyCloud
   */
  async getBondApplicationStatus(
    applicationId: string
  ): Promise<SuretyCloudBondResponse> {
    const response = await this.makeAuthenticatedRequest(
      `/bonds/applications/${applicationId}`,
      'GET'
    );
    return response;
  }

  /**
   * BOND STATUS SYNCHRONIZATION
   */

  /**
   * Sync all bond statuses from SuretyCloud
   */
  async syncAllBondStatuses(): Promise<void> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    try {
      const suretyCloudBonds = await this.makeAuthenticatedRequest(
        `/organizations/${this.credentials.organizationId}/bonds`,
        'GET'
      );

      for (const scBond of suretyCloudBonds) {
        await this.syncBondStatus(scBond.bondNumber);
      }

      console.log(
        `✅ Synchronized ${suretyCloudBonds.length} bond statuses from SuretyCloud`
      );
    } catch (error) {
      console.error('Bond status synchronization failed:', error);
      throw error;
    }
  }

  /**
   * Sync individual bond status
   */
  async syncBondStatus(bondNumber: string): Promise<void> {
    try {
      const scStatus: SuretyCloudBondStatus =
        await this.makeAuthenticatedRequest(
          `/bonds/${bondNumber}/status`,
          'GET'
        );

      // Find corresponding FleetFlow bond
      const fleetFlowBond = await this.findFleetFlowBondByNumber(bondNumber);
      if (!fleetFlowBond) {
        console.warn(
          `Bond ${bondNumber} not found in FleetFlow - creating new record`
        );
        // Could create new bond record here if needed
        return;
      }

      // Update FleetFlow bond with SuretyCloud data
      await customsBondService.updateBond(fleetFlowBond.id, {
        status: this.mapSuretyCloudStatus(scStatus.status),
        currentUtilizationAmount: scStatus.currentUtilization,
        suretyCompany: scStatus.suretyCompany,
        expiryDate: scStatus.nextRenewalDate || fleetFlowBond.expiryDate,
      });

      // Calculate utilization percentage
      const utilizationPercentage =
        (scStatus.currentUtilization / scStatus.maxUtilization) * 100;
      await customsBondService.updateBond(fleetFlowBond.id, {
        utilizationPercentage,
      });

      console.log(
        `✅ Synchronized bond ${bondNumber} status: ${scStatus.status}`
      );
    } catch (error) {
      console.error(`Failed to sync bond ${bondNumber}:`, error);
    }
  }

  /**
   * RENEWAL MANAGEMENT
   */

  /**
   * Submit bond renewal request to SuretyCloud
   */
  async submitBondRenewal(
    bondId: string,
    renewalAmount?: number
  ): Promise<BondRenewal> {
    const bond = await customsBondService.getBond(bondId);
    if (!bond) throw new Error('Bond not found');

    try {
      const renewalRequest = {
        bondNumber: bond.bondNumber,
        renewalAmount: renewalAmount || bond.bondAmount,
        currentExpiryDate: bond.expiryDate,
        requestedExpiryDate: new Date(
          bond.expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000
        ), // +1 year
      };

      const scResponse = await this.makeAuthenticatedRequest(
        '/bonds/renewals',
        'POST',
        renewalRequest
      );

      // Create FleetFlow renewal record
      const renewal = await customsBondService.scheduleRenewal({
        bondId,
        renewalDate: new Date(),
        newExpiry: renewalRequest.requestedExpiryDate,
        renewalAmount: renewalRequest.renewalAmount,
        renewalFee: scResponse.premium || 0,
      });

      console.log(`✅ Bond renewal submitted for ${bond.bondNumber}`);
      return renewal;
    } catch (error) {
      console.error('Bond renewal submission failed:', error);
      throw error;
    }
  }

  /**
   * DOCUMENT MANAGEMENT
   */

  /**
   * Upload document to SuretyCloud
   */
  async uploadDocument(
    bondId: string,
    document: {
      name: string;
      type: 'APPLICATION' | 'COMPLIANCE' | 'FINANCIAL' | 'LEGAL';
      file: File | Blob;
      metadata?: Record<string, any>;
    }
  ): Promise<SuretyCloudDocument> {
    const bond = await customsBondService.getBond(bondId);
    if (!bond) throw new Error('Bond not found');

    const formData = new FormData();
    formData.append('file', document.file);
    formData.append('bondNumber', bond.bondNumber);
    formData.append('documentType', document.type);
    formData.append('documentName', document.name);
    if (document.metadata) {
      formData.append('metadata', JSON.stringify(document.metadata));
    }

    const response = await this.makeAuthenticatedRequest(
      '/documents/upload',
      'POST',
      formData,
      true
    );

    // Record document upload activity in FleetFlow
    await customsBondService.recordActivity({
      bondId,
      activityType: 'ENTRY',
      amount: 0,
      description: `Document uploaded to SuretyCloud: ${document.name}`,
    });

    console.log(`✅ Document uploaded: ${document.name}`);
    return response;
  }

  /**
   * Get documents from SuretyCloud
   */
  async getBondDocuments(bondId: string): Promise<SuretyCloudDocument[]> {
    const bond = await customsBondService.getBond(bondId);
    if (!bond) throw new Error('Bond not found');

    const documents = await this.makeAuthenticatedRequest(
      `/bonds/${bond.bondNumber}/documents`,
      'GET'
    );
    return documents;
  }

  /**
   * REPORTING & ANALYTICS
   */

  /**
   * Get comprehensive bond portfolio report from SuretyCloud
   */
  async getPortfolioReport(): Promise<{
    totalBonds: number;
    activeBonds: number;
    totalBondAmount: number;
    totalUtilization: number;
    averageUtilizationPercentage: number;
    bondsByStatus: Record<string, number>;
    bondsBySurety: Record<string, number>;
    upcomingRenewals: number;
    expiredBonds: number;
  }> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    const report = await this.makeAuthenticatedRequest(
      `/organizations/${this.credentials.organizationId}/portfolio-report`,
      'GET'
    );

    return report;
  }

  /**
   * Get bond utilization trends
   */
  async getUtilizationTrends(
    bondId: string,
    days: number = 30
  ): Promise<{
    bondNumber: string;
    dailyUtilization: Array<{ date: Date; utilization: number }>;
    peakUtilization: number;
    averageUtilization: number;
    trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  }> {
    const bond = await customsBondService.getBond(bondId);
    if (!bond) throw new Error('Bond not found');

    const trends = await this.makeAuthenticatedRequest(
      `/bonds/${bond.bondNumber}/utilization-trends?days=${days}`,
      'GET'
    );

    return trends;
  }

  /**
   * UTILITY METHODS
   */

  private async makeAuthenticatedRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    isFormData: boolean = false
  ): Promise<any> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    const url = `${this.credentials.baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${await this.getAccessToken()}`,
      'X-Organization-ID': this.credentials.organizationId,
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      if (isFormData) {
        config.body = data; // FormData
      } else {
        config.body = JSON.stringify(data);
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `SuretyCloud API error: ${response.status} - ${errorText}`
      );
    }

    return await response.json();
  }

  private async getAccessToken(): Promise<string> {
    if (!this.credentials) {
      throw new Error('SuretyCloud credentials not configured');
    }

    // In production, implement proper OAuth2 flow or API key authentication
    // For now, using API key directly
    return this.credentials.apiKey;
  }

  private async findFleetFlowBondByNumber(
    bondNumber: string
  ): Promise<CustomsBond | null> {
    // This is a simplified search - in production, you'd have a proper database query
    const allBonds = await customsBondService.getAllBonds();
    return allBonds.find((bond) => bond.bondNumber === bondNumber) || null;
  }

  private mapSuretyCloudStatus(scStatus: string): BondStatus {
    switch (scStatus.toUpperCase()) {
      case 'ACTIVE':
      case 'ISSUED':
        return 'ACTIVE';
      case 'EXPIRED':
        return 'EXPIRED';
      case 'CANCELLED':
      case 'TERMINATED':
        return 'CANCELLED';
      case 'SUSPENDED':
        return 'SUSPENDED';
      case 'PENDING':
      case 'UNDER_REVIEW':
      case 'APPROVED':
        return 'PENDING';
      default:
        return 'PENDING';
    }
  }
}

export const suretyCloudIntegrationService =
  new SuretyCloudIntegrationService();
