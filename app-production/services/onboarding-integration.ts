// Onboarding Integration Service
// Handles the flow of onboarding data into carrier and driver portals

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
    type: 'certificate_of_insurance' | 'w9_form' | 'operating_authority' | 'drug_testing_policy' | 'other';
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
    type: 'carrier_packet' | 'standard_terms' | 'insurance_requirements' | 'payment_terms';
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
      OnboardingIntegrationService.instance = new OnboardingIntegrationService();
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
    try {
      // Store onboarding record
      this.onboardingRecords.set(onboardingData.carrierId, onboardingData);

      // Create carrier portal profile
      const carrierProfile = this.createCarrierProfile(onboardingData);
      this.carrierProfiles.set(onboardingData.carrierId, carrierProfile);

      // Create driver portal profiles
      const driverProfiles = this.createDriverProfiles(onboardingData);
      driverProfiles.forEach(driver => {
        this.driverProfiles.set(driver.driverId, driver);
      });

      // Send welcome notifications
      await this.sendWelcomeNotifications(carrierProfile, driverProfiles);

      return {
        success: true,
        carrierId: onboardingData.carrierId,
        carrierProfile,
        driverProfiles,
        message: `Onboarding completed successfully. Carrier and ${driverProfiles.length} driver portal(s) created.`
      };

    } catch (error) {
      console.error('Onboarding integration failed:', error);
      return {
        success: false,
        carrierId: onboardingData.carrierId,
        carrierProfile: {} as CarrierPortalProfile,
        driverProfiles: [],
        message: 'Failed to complete onboarding integration'
      };
    }
  }

  private createCarrierProfile(onboardingData: OnboardingRecord): CarrierPortalProfile {
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
        equipmentTypes: verification?.equipmentTypes || []
      },
      onboardingDate: onboardingData.completionDate,
      status: 'active',
      factoring: factoring?.factoringEnabled ? {
        company: factoring.factoringCompany?.name || factoring.customFactoringCompany?.name || '',
        contactInfo: factoring.factoringCompany?.email || factoring.customFactoringCompany?.email || '',
        isActive: true
      } : undefined,
      documents: documents?.documents.map(doc => ({
        type: doc.type,
        fileName: doc.fileName,
        status: doc.status,
        expirationDate: doc.expirationDate
      })) || [],
      agreements: agreements?.agreements.map(agreement => ({
        type: agreement.type,
        signed: agreement.signed,
        signedDate: agreement.signedDate
      })) || [],
      portalAccess: {
        enabled: portal?.portalEnabled || false,
        users: portal?.users.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          lastLogin: user.firstLogin
        })) || []
      },
      performance: {
        totalLoads: 0,
        onTimeDelivery: 100,
        avgRating: 5.0
      }
    };
  }

  private createDriverProfiles(onboardingData: OnboardingRecord): DriverPortalProfile[] {
    const portal = onboardingData.steps.portal;
    const verification = onboardingData.steps.verification;

    if (!portal?.users) return [];

    return portal.users
      .filter(user => user.role === 'driver')
      .map(user => ({
        driverId: `driver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        carrierId: onboardingData.carrierId,
        personalInfo: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          licenseNumber: 'CDL-PENDING', // To be updated later
          licenseExpiration: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        employmentInfo: {
          carrierName: verification?.legalName || '',
          startDate: onboardingData.completionDate,
          role: 'company_driver'
        },
        credentials: {
          email: user.email,
          temporaryPassword: user.temporaryPassword,
          accountActivated: user.accountCreated,
          lastLogin: user.firstLogin
        },
        permissions: {
          canViewAssignedLoads: true,
          canUpdateLocation: true,
          canUploadPODs: true,
          canCommunicateWithDispatch: true
        }
      }));
  }

  private async sendWelcomeNotifications(
    carrierProfile: CarrierPortalProfile, 
    driverProfiles: DriverPortalProfile[]
  ): Promise<void> {
    // In a real implementation, this would send emails/SMS
    console.log(`Welcome notifications sent to carrier ${carrierProfile.companyInfo.legalName}`);
    console.log(`Welcome notifications sent to ${driverProfiles.length} drivers`);
  }

  // Retrieve data for portals
  getCarrierProfile(carrierId: string): CarrierPortalProfile | null {
    return this.carrierProfiles.get(carrierId) || null;
  }

  getDriverProfile(driverId: string): DriverPortalProfile | null {
    return this.driverProfiles.get(driverId) || null;
  }

  getDriversByCarrier(carrierId: string): DriverPortalProfile[] {
    return Array.from(this.driverProfiles.values())
      .filter(driver => driver.carrierId === carrierId);
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
  updateCarrierPerformance(carrierId: string, metrics: Partial<CarrierPortalProfile['performance']>): boolean {
    const profile = this.carrierProfiles.get(carrierId);
    if (profile) {
      profile.performance = { ...profile.performance, ...metrics };
      this.carrierProfiles.set(carrierId, profile);
      return true;
    }
    return false;
  }

  // Update driver information
  updateDriverInfo(driverId: string, updates: Partial<DriverPortalProfile>): boolean {
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
