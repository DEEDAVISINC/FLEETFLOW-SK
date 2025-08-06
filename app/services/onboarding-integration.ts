// Onboarding Integration Service
// Handles the flow of onboarding data into carrier and driver portals

import ServiceErrorHandler from '../utils/errorHandler';
import { logger } from '../utils/logger';
import { CarrierData } from './enhanced-carrier-service';

export interface OnboardingRecord {
  carrierId: string;
  startDate: string;
  completionDate: string;
  status: 'completed' | 'in_progress' | 'pending' | 'rejected';
  steps: {
    verification?: FMCSAVerificationData;
    documents?: DocumentUploadData;
    factoring?: FactoringSetupData;
    agreements?: AgreementSigningData;
    portal?: PortalSetupData;
  };
  summary: {
    carrierInfo?: CarrierData;
    documentsUploaded: number;
    factoringEnabled: boolean;
    agreementsSigned: number;
    portalEnabled: boolean;
    portalUsers: number;
  };
}

export interface FMCSAVerificationData {
  mcNumber: string;
  dotNumber: string;
  legalName: string;
  dbaName?: string;
  physicalAddress: string;
  phone: string;
  email: string;
  safetyRating: string;
  equipmentTypes: string[];
  verified: boolean;
  verificationDate: string;
}

export interface DocumentUploadData {
  documents: Array<{
    id: string;
    type:
      | 'certificate_of_insurance'
      | 'w9_form'
      | 'operating_authority'
      | 'drug_testing_policy'
      | 'other';
    fileName: string;
    uploadDate: string;
    status: 'uploaded' | 'pending_review' | 'approved' | 'rejected';
    expirationDate?: string;
    notes?: string;
  }>;
  documentsComplete: boolean;
}

export interface FactoringSetupData {
  factoringEnabled: boolean;
  factoringCompany?: {
    id: string;
    name: string;
    contactName: string;
    phone: string;
    email: string;
    advancePercentage: number;
    factorRate: number;
  };
  customFactoringCompany?: {
    name: string;
    contactName: string;
    phone: string;
    email: string;
    terms: string;
  };
  noaSubmitted: boolean;
  noaDate?: string;
}

export interface AgreementSigningData {
  agreements: Array<{
    id: string;
    type:
      | 'carrier_packet'
      | 'standard_terms'
      | 'insurance_requirements'
      | 'payment_terms';
    title: string;
    signed: boolean;
    signedDate?: string;
    signerName?: string;
    documentUrl?: string;
  }>;
  allAgreementsSigned: boolean;
}

export interface PortalSetupData {
  portalEnabled: boolean;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
    role: 'owner' | 'dispatcher' | 'admin';
  };
  users: Array<{
    name: string;
    email: string;
    phone: string;
    role: 'driver' | 'dispatcher' | 'admin';
    temporaryPassword: string;
    accountCreated: boolean;
    firstLogin?: string;
  }>;
  permissions: {
    canViewLoads: boolean;
    canAcceptLoads: boolean;
    canUploadDocuments: boolean;
    canUpdateLocation: boolean;
    canCommunicateWithBroker: boolean;
  };
}

export interface CarrierPortalProfile {
  carrierId: string;
  companyInfo: {
    legalName: string;
    dbaName?: string;
    mcNumber: string;
    dotNumber: string;
    physicalAddress: string;
    phone: string;
    email: string;
    safetyRating: string;
    equipmentTypes: string[];
  };
  onboardingDate: string;
  status: 'active' | 'suspended' | 'under_review';
  factoring?: {
    company: string;
    contactInfo: string;
    isActive: boolean;
  };
  documents: Array<{
    type: string;
    fileName: string;
    status: string;
    expirationDate?: string;
  }>;
  agreements: Array<{
    type: string;
    signed: boolean;
    signedDate?: string;
  }>;
  portalAccess: {
    enabled: boolean;
    users: Array<{
      name: string;
      email: string;
      role: string;
      lastLogin?: string;
    }>;
  };
  performance: {
    totalLoads: number;
    onTimeDelivery: number;
    avgRating: number;
    lastLoadDate?: string;
  };
}

export interface DriverPortalProfile {
  driverId: string;
  carrierId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseExpiration: string;
  };
  employmentInfo: {
    carrierName: string;
    startDate: string;
    role: 'owner_operator' | 'company_driver';
    truckNumber?: string;
    trailerNumber?: string;
  };
  credentials: {
    email: string;
    temporaryPassword?: string;
    accountActivated: boolean;
    lastLogin?: string;
  };
  permissions: {
    canViewAssignedLoads: boolean;
    canUpdateLocation: boolean;
    canUploadPODs: boolean;
    canCommunicateWithDispatch: boolean;
  };
}

export class OnboardingIntegrationService {
  private static instance: OnboardingIntegrationService;
  private onboardingRecords: Map<string, OnboardingRecord> = new Map();
  private carrierProfiles: Map<string, CarrierPortalProfile> = new Map();
  private driverProfiles: Map<string, DriverPortalProfile> = new Map();

  static getInstance(): OnboardingIntegrationService {
    if (!OnboardingIntegrationService.instance) {
      OnboardingIntegrationService.instance =
        new OnboardingIntegrationService();
    }
    return OnboardingIntegrationService.instance;
  }

  // Save onboarding record and create portal profiles
  async completeOnboarding(onboardingData: OnboardingRecord): Promise<{
    success: boolean;
    carrierId: string;
    carrierProfile: CarrierPortalProfile;
    driverProfiles: DriverPortalProfile[];
    message: string;
  }> {
    return (
      ServiceErrorHandler.handleAsyncOperation(
        async () => {
          try {
            // Store onboarding record
            this.onboardingRecords.set(
              onboardingData.carrierId,
              onboardingData
            );

            // Create carrier portal profile
            const carrierProfile = this.createCarrierProfile(onboardingData);
            this.carrierProfiles.set(onboardingData.carrierId, carrierProfile);

            // Create driver portal profiles
            const driverProfiles = this.createDriverProfiles(onboardingData);
            driverProfiles.forEach((driver) => {
              this.driverProfiles.set(driver.driverId, driver);
            });

            // Send welcome notifications
            await this.sendWelcomeNotifications(carrierProfile, driverProfiles);

            return {
              success: true,
              carrierId: onboardingData.carrierId,
              carrierProfile,
              driverProfiles,
              message: `Onboarding completed successfully. Carrier and ${driverProfiles.length} driver portal(s) created.`,
            };
          } catch (error) {
            console.error('Onboarding integration failed:', error);
            return {
              success: false,
              carrierId: onboardingData.carrierId,
              carrierProfile: {} as CarrierPortalProfile,
              driverProfiles: [],
              message: 'Failed to complete onboarding integration',
            };
          }
        },
        'OnboardingIntegrationService',
        'completeOnboarding'
      ) || {
        success: false,
        carrierId: onboardingData.carrierId,
        carrierProfile: {} as CarrierPortalProfile,
        driverProfiles: [],
        message: 'Failed to complete onboarding integration',
      }
    );
  }

  /**
   * NEW: Handle AI-initiated carrier onboarding
   */
  async initiateAICarrierOnboarding(aiData: any): Promise<{
    success: boolean;
    carrierId: string;
    message: string;
    workflowUrl?: string;
  }> {
    return (
      ServiceErrorHandler.handleAsyncOperation(
        async () => {
          // console.log(`🤖 Initiating AI carrier onboarding for: ${aiData.prePopulatedData.carrierInfo.companyName}`);

          // Create onboarding record with AI pre-populated data
          const onboardingRecord: OnboardingRecord = {
            carrierId: aiData.carrierId,
            startDate: new Date().toISOString(),
            completionDate: '', // Will be set when completed
            status: 'in_progress',
            steps: {
              verification: {
                ...aiData.prePopulatedData.verification,
                // AI pre-populates what it can, user fills in the rest
                mcNumber: '', // User must provide
                dotNumber: '', // User must provide
                verified: false, // Must be verified through FMCSA
              },
            },
            summary: {
              carrierInfo: aiData.prePopulatedData.carrierInfo,
              documentsUploaded: 0,
              factoringEnabled: false,
              agreementsSigned: 0,
              portalEnabled: false,
              portalUsers: 0,
            },
          };

          // Store the record
          this.onboardingRecords.set(aiData.carrierId, onboardingRecord);

          // In a real implementation, this would:
          // 1. Send email/SMS to carrier with personalized onboarding link
          // 2. Create workflow instance in database
          // 3. Set up automated reminders

          const workflowUrl = `/onboarding/carrier-onboarding?carrierId=${aiData.carrierId}&aiGenerated=true`;

          return {
            success: true,
            carrierId: aiData.carrierId,
            message: `AI onboarding initiated for ${aiData.prePopulatedData.carrierInfo.companyName}`,
            workflowUrl,
          };
        },
        'OnboardingIntegrationService',
        'initiateAICarrierOnboarding'
      ) || {
        success: false,
        carrierId: aiData.carrierId,
        message: 'Failed to initiate AI carrier onboarding',
      }
    );
  }

  /**
   * NEW: Enhanced completion handler for AI-initiated onboarding
   */
  async completeAIOnboarding(
    onboardingData: OnboardingRecord,
    aiCarrierData: any
  ): Promise<{
    success: boolean;
    carrierId: string;
    carrierProfile: CarrierPortalProfile;
    driverProfiles: DriverPortalProfile[];
    message: string;
    dispatcherNotificationSent: boolean;
  }> {
    return (
      ServiceErrorHandler.handleAsyncOperation(
        async () => {
          try {
            // Complete standard onboarding
            const standardResult =
              await this.completeOnboarding(onboardingData);

            if (standardResult.success) {
              // Additional AI-specific completion steps
              // console.log(
              //   `🤖 Completing AI-initiated onboarding for: ${standardResult.carrierProfile.companyInfo.legalName}`
              // );

              // Trigger dispatcher assignment notification
              const notificationSent =
                await this.triggerDispatcherAssignmentNotification(
                  standardResult.carrierId,
                  standardResult.carrierProfile,
                  aiCarrierData
                );

              return {
                ...standardResult,
                dispatcherNotificationSent: notificationSent,
              };
            } else {
              return {
                ...standardResult,
                dispatcherNotificationSent: false,
              };
            }
          } catch (error) {
            console.error('❌ Failed to complete AI onboarding:', error);
            throw error;
          }
        },
        'OnboardingIntegrationService',
        'completeAIOnboarding'
      ) || {
        success: false,
        carrierId: onboardingData.carrierId,
        carrierProfile: {} as CarrierPortalProfile,
        driverProfiles: [],
        message: 'Failed to complete AI onboarding',
        dispatcherNotificationSent: false,
      }
    );
  }

  /**
   * Trigger dispatcher assignment notification
   */
  private async triggerDispatcherAssignmentNotification(
    carrierId: string,
    carrierProfile: CarrierPortalProfile,
    aiCarrierData: any
  ): Promise<boolean> {
    return (
      ServiceErrorHandler.handleAsyncOperation(
        async () => {
          try {
            // Import here to avoid circular dependency
            const { aiCarrierOnboardingTrigger } = await import(
              './AICarrierOnboardingTrigger'
            );

            await aiCarrierOnboardingTrigger.handleOnboardingCompletion(
              carrierId,
              {
                carrierProfile,
                aiCarrierData,
              }
            );

            return true;
          } catch (error) {
            console.error(
              '❌ Failed to trigger dispatcher assignment notification:',
              error
            );
            return false;
          }
        },
        'OnboardingIntegrationService',
        'triggerDispatcherAssignmentNotification'
      ) || false
    );
  }

  private createCarrierProfile(
    onboardingData: OnboardingRecord
  ): CarrierPortalProfile {
    const verification = onboardingData.steps.verification;
    const documents = onboardingData.steps.documents;
    const factoring = onboardingData.steps.factoring;
    const agreements = onboardingData.steps.agreements;
    const portal = onboardingData.steps.portal;

    return {
      carrierId: onboardingData.carrierId,
      companyInfo: {
        legalName: verification?.legalName || '',
        dbaName: verification?.dbaName,
        mcNumber: verification?.mcNumber || '',
        dotNumber: verification?.dotNumber || '',
        physicalAddress: verification?.physicalAddress || '',
        phone: verification?.phone || '',
        email: verification?.email || '',
        safetyRating: verification?.safetyRating || 'NOT_RATED',
        equipmentTypes: verification?.equipmentTypes || [],
      },
      onboardingDate: onboardingData.completionDate,
      status: 'active',
      factoring: factoring?.factoringEnabled
        ? {
            company:
              factoring.factoringCompany?.name ||
              factoring.customFactoringCompany?.name ||
              '',
            contactInfo:
              factoring.factoringCompany?.email ||
              factoring.customFactoringCompany?.email ||
              '',
            isActive: true,
          }
        : undefined,
      documents:
        documents?.documents.map((doc) => ({
          type: doc.type,
          fileName: doc.fileName,
          status: doc.status,
          expirationDate: doc.expirationDate,
        })) || [],
      agreements:
        agreements?.agreements.map((agreement) => ({
          type: agreement.type,
          signed: agreement.signed,
          signedDate: agreement.signedDate,
        })) || [],
      portalAccess: {
        enabled: portal?.portalEnabled || false,
        users:
          portal?.users.map((user) => ({
            name: user.name,
            email: user.email,
            role: user.role,
            lastLogin: user.firstLogin,
          })) || [],
      },
      performance: {
        totalLoads: 0,
        onTimeDelivery: 100,
        avgRating: 5.0,
      },
    };
  }

  private createDriverProfiles(
    onboardingData: OnboardingRecord
  ): DriverPortalProfile[] {
    const portal = onboardingData.steps.portal;
    const verification = onboardingData.steps.verification;

    if (!portal?.users) return [];

    return portal.users
      .filter((user) => user.role === 'driver')
      .map((user) => ({
        driverId: `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        carrierId: onboardingData.carrierId,
        personalInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          licenseNumber: 'CDL-PENDING', // To be updated later
          licenseExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        employmentInfo: {
          carrierName: verification?.legalName || '',
          startDate: onboardingData.completionDate,
          role: 'company_driver',
        },
        credentials: {
          email: user.email,
          temporaryPassword: user.temporaryPassword,
          accountActivated: user.accountCreated,
          lastLogin: user.firstLogin,
        },
        permissions: {
          canViewAssignedLoads: true,
          canUpdateLocation: true,
          canUploadPODs: true,
          canCommunicateWithDispatch: true,
        },
      }));
  }

  private async sendWelcomeNotifications(
    carrierProfile: CarrierPortalProfile,
    driverProfiles: DriverPortalProfile[]
  ): Promise<void> {
    // In a real implementation, this would send emails/SMS
    // console.log(
    //   `Welcome notifications sent to carrier ${carrierProfile.companyInfo.legalName}`
    // );
    // console.log(
    //   `Welcome notifications sent to ${driverProfiles.length} drivers`
    // );
  }

  // Retrieve data for portals
  getCarrierProfile(carrierId: string): CarrierPortalProfile | null {
    return this.carrierProfiles.get(carrierId) || null;
  }

  getDriverProfile(driverId: string): DriverPortalProfile | null {
    return this.driverProfiles.get(driverId) || null;
  }

  getDriversByCarrier(carrierId: string): DriverPortalProfile[] {
    return Array.from(this.driverProfiles.values()).filter(
      (driver) => driver.carrierId === carrierId
    );
  }

  getAllCarriers(): CarrierPortalProfile[] {
    return Array.from(this.carrierProfiles.values());
  }

  getAllDrivers(): DriverPortalProfile[] {
    return Array.from(this.driverProfiles.values());
  }

  getOnboardingRecord(carrierId: string): OnboardingRecord | null {
    return this.onboardingRecords.get(carrierId) || null;
  }

  getAllOnboardingRecords(): OnboardingRecord[] {
    return Array.from(this.onboardingRecords.values());
  }

  // Update carrier performance metrics
  updateCarrierPerformance(
    carrierId: string,
    metrics: Partial<CarrierPortalProfile['performance']>
  ): boolean {
    const profile = this.carrierProfiles.get(carrierId);
    if (profile) {
      profile.performance = { ...profile.performance, ...metrics };
      this.carrierProfiles.set(carrierId, profile);
      return true;
    }
    return false;
  }

  // Update driver information
  updateDriverInfo(
    driverId: string,
    updates: Partial<DriverPortalProfile>
  ): boolean {
    const profile = this.driverProfiles.get(driverId);
    if (profile) {
      const updatedProfile = { ...profile, ...updates };
      this.driverProfiles.set(driverId, updatedProfile);
      return true;
    }
    return false;
  }
}

// Export singleton instance
export const onboardingIntegration = OnboardingIntegrationService.getInstance();

// Initialize demo data for development
(() => {
  // Create demo driver profiles for immediate testing
  const demoDrivers: DriverPortalProfile[] = [
    {
      driverId: 'driver_001',
      carrierId: 'demo_carrier_001',
      personalInfo: {
        name: 'John Rodriguez',
        email: 'john.rodriguez@fleetflow.com',
        phone: '(555) 123-4567',
        licenseNumber: 'CDL-A-12345',
        licenseExpiration: '2025-12-31',
      },
      employmentInfo: {
        carrierName: 'FleetFlow Demo Carrier',
        startDate: '2024-01-15',
        role: 'company_driver',
      },
      credentials: {
        email: 'john.rodriguez@fleetflow.com',
        temporaryPassword: 'demo123',
        accountActivated: true,
        lastLogin: new Date().toISOString(),
      },
      permissions: {
        canViewAssignedLoads: true,
        canUpdateLocation: true,
        canUploadPODs: true,
        canCommunicateWithDispatch: true,
      },
    },
    {
      driverId: 'driver_002',
      carrierId: 'demo_carrier_001',
      personalInfo: {
        name: 'Maria Santos',
        email: 'maria.santos@fleetflow.com',
        phone: '(555) 234-5678',
        licenseNumber: 'CDL-A-23456',
        licenseExpiration: '2025-11-30',
      },
      employmentInfo: {
        carrierName: 'FleetFlow Demo Carrier',
        startDate: '2024-02-01',
        role: 'company_driver',
      },
      credentials: {
        email: 'maria.santos@fleetflow.com',
        temporaryPassword: 'demo456',
        accountActivated: true,
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      permissions: {
        canViewAssignedLoads: true,
        canUpdateLocation: true,
        canUploadPODs: true,
        canCommunicateWithDispatch: true,
      },
    },
    {
      driverId: 'driver_003',
      carrierId: 'demo_carrier_002',
      personalInfo: {
        name: 'David Thompson',
        email: 'david.thompson@fleetflow.com',
        phone: '(555) 345-6789',
        licenseNumber: 'CDL-A-34567',
        licenseExpiration: '2025-10-15',
      },
      employmentInfo: {
        carrierName: 'FleetFlow Express LLC',
        startDate: '2024-03-10',
        role: 'owner_operator',
      },
      credentials: {
        email: 'david.thompson@fleetflow.com',
        temporaryPassword: 'demo789',
        accountActivated: true,
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      permissions: {
        canViewAssignedLoads: true,
        canUpdateLocation: true,
        canUploadPODs: true,
        canCommunicateWithDispatch: true,
      },
    },
  ];

  // Add demo drivers to the service
  const service = OnboardingIntegrationService.getInstance();
  demoDrivers.forEach((driver) => {
    (service as any).driverProfiles.set(driver.driverId, driver);
  });

  logger.info(
    'Demo driver data initialized',
    {
      driverCount: demoDrivers.length,
    },
    'OnboardingIntegrationService'
  );
})();
