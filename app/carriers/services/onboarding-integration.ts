// Onboarding Integration Service
export interface CarrierPortalProfile {
  id: string;
  companyName: string;
  mcNumber: string;
  dotNumber: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'active' | 'inactive' | 'pending';
  onboardingStatus: 'complete' | 'in-progress' | 'not-started';
  documentsUploaded: boolean;
  insuranceVerified: boolean;
  factoringApproved: boolean;
  agreementSigned: boolean;
  portalAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OnboardingData {
  carrierInfo: {
    companyName: string;
    mcNumber: string;
    dotNumber: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
  };
  fmcsaVerification: {
    verified: boolean;
    verificationDate: Date;
    status: string;
  };
  documents: {
    insuranceCertificate: string;
    w9Form: string;
    carrierPacket: string;
    additionalDocs: string[];
  };
  factoring: {
    required: boolean;
    approved: boolean;
    provider: string;
    approvalDate?: Date;
  };
  agreements: {
    masterAgreement: boolean;
    rateConfirmation: boolean;
    signedDate?: Date;
  };
  portalAccess: {
    enabled: boolean;
    credentials: {
      username: string;
      tempPassword: string;
    };
  };
}

class OnboardingIntegration {
  private onboardingData: Map<string, OnboardingData> = new Map();
  private carrierProfiles: Map<string, CarrierPortalProfile> = new Map();

  // Initialize with mock data
  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock onboarding data
    const mockOnboarding: OnboardingData = {
      carrierInfo: {
        companyName: 'Swift Transport Solutions',
        mcNumber: 'MC-123456',
        dotNumber: '123456',
        contactName: 'John Smith',
        contactEmail: 'john.smith@swifttransport.com',
        contactPhone: '(555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'Dallas',
          state: 'TX',
          zipCode: '75201'
        }
      },
      fmcsaVerification: {
        verified: true,
        verificationDate: new Date('2024-01-15'),
        status: 'Active'
      },
      documents: {
        insuranceCertificate: 'insurance_cert_123456.pdf',
        w9Form: 'w9_form_123456.pdf',
        carrierPacket: 'carrier_packet_123456.pdf',
        additionalDocs: ['dot_inspection_123456.pdf', 'safety_rating_123456.pdf']
      },
      factoring: {
        required: true,
        approved: true,
        provider: 'FactorFund Solutions',
        approvalDate: new Date('2024-01-20')
      },
      agreements: {
        masterAgreement: true,
        rateConfirmation: true,
        signedDate: new Date('2024-01-25')
      },
      portalAccess: {
        enabled: true,
        credentials: {
          username: 'swifttransport',
          tempPassword: 'temp123456'
        }
      }
    };

    this.onboardingData.set('carrier_001', mockOnboarding);

    // Mock carrier profile
    const mockProfile: CarrierPortalProfile = {
      id: 'carrier_001',
      companyName: 'Swift Transport Solutions',
      mcNumber: 'MC-123456',
      dotNumber: '123456',
      contactName: 'John Smith',
      contactEmail: 'john.smith@swifttransport.com',
      contactPhone: '(555) 123-4567',
      address: {
        street: '123 Main St',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201'
      },
      status: 'active',
      onboardingStatus: 'complete',
      documentsUploaded: true,
      insuranceVerified: true,
      factoringApproved: true,
      agreementSigned: true,
      portalAccess: true,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25')
    };

    this.carrierProfiles.set('carrier_001', mockProfile);
  }

  // Get carrier profile by ID
  getCarrierProfile(carrierId: string): CarrierPortalProfile | null {
    return this.carrierProfiles.get(carrierId) || null;
  }

  // Get all carrier profiles
  getAllCarrierProfiles(): CarrierPortalProfile[] {
    return Array.from(this.carrierProfiles.values());
  }

  // Get onboarding data by carrier ID
  getOnboardingData(carrierId: string): OnboardingData | null {
    return this.onboardingData.get(carrierId) || null;
  }

  // Update carrier profile
  updateCarrierProfile(carrierId: string, updates: Partial<CarrierPortalProfile>): boolean {
    const profile = this.carrierProfiles.get(carrierId);
    if (!profile) return false;

    const updatedProfile = { ...profile, ...updates, updatedAt: new Date() };
    this.carrierProfiles.set(carrierId, updatedProfile);
    return true;
  }

  // Create new carrier from onboarding data
  createCarrierFromOnboarding(onboardingData: OnboardingData): string {
    const carrierId = `carrier_${Date.now()}`;
    
    const profile: CarrierPortalProfile = {
      id: carrierId,
      companyName: onboardingData.carrierInfo.companyName,
      mcNumber: onboardingData.carrierInfo.mcNumber,
      dotNumber: onboardingData.carrierInfo.dotNumber,
      contactName: onboardingData.carrierInfo.contactName,
      contactEmail: onboardingData.carrierInfo.contactEmail,
      contactPhone: onboardingData.carrierInfo.contactPhone,
      address: onboardingData.carrierInfo.address,
      status: 'active',
      onboardingStatus: 'complete',
      documentsUploaded: !!onboardingData.documents.insuranceCertificate,
      insuranceVerified: onboardingData.fmcsaVerification.verified,
      factoringApproved: onboardingData.factoring.approved,
      agreementSigned: onboardingData.agreements.masterAgreement,
      portalAccess: onboardingData.portalAccess.enabled,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.carrierProfiles.set(carrierId, profile);
    this.onboardingData.set(carrierId, onboardingData);
    
    return carrierId;
  }

  // Get onboarding progress
  getOnboardingProgress(carrierId: string): { completed: number; total: number; percentage: number } {
    const data = this.onboardingData.get(carrierId);
    if (!data) return { completed: 0, total: 6, percentage: 0 };

    let completed = 0;
    const total = 6;

    if (data.fmcsaVerification.verified) completed++;
    if (data.documents.insuranceCertificate) completed++;
    if (data.documents.w9Form) completed++;
    if (data.factoring.approved) completed++;
    if (data.agreements.masterAgreement) completed++;
    if (data.portalAccess.enabled) completed++;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }
}

export const onboardingIntegration = new OnboardingIntegration();
