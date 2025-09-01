/**
 * Enhanced Independent Contractor Agreement (ICA) Onboarding Service
 * Includes Platform Services Agreement for 50% Revenue Sharing
 * Handles onboarding for internal staff (BB, DC, MGR, CS departments)
 */

export interface ICAOnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
  icon: string;
  order: number;
  completedAt?: string;
  requiresPlatformServices?: boolean; // New field
}

export interface PlatformServicesAgreement {
  agreementId: string;
  tenantId: string;
  userId: string;
  revenueShareRate: number; // 0.5 for 50%
  enabledServices: {
    rfxEnabled: boolean;
    aiFlowEnabled: boolean;
    govContractsEnabled: boolean;
    insuranceEnabled: boolean;
  };
  signedDate?: string;
  effectiveDate?: string;
  expirationDate?: string;
  status: 'pending' | 'signed' | 'active' | 'expired';
  documentUrl?: string;
}

export interface ICAOnboardingRecord {
  userId: string;
  tenantId: string; // Added for multi-tenant support
  startDate: string;
  completionDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  steps: ICAOnboardingStep[];
  documents: ICADocument[];
  platformServicesAgreement?: PlatformServicesAgreement; // New field
  summary: {
    personalInfoComplete: boolean;
    experienceVerified: boolean;
    backgroundCheckComplete: boolean;
    documentsGenerated: number;
    documentsSigned: number;
    platformServicesAgreementSigned: boolean; // New field
    insuranceVerified: boolean;
    trainingComplete: boolean;
    systemAccessGranted: boolean;
    finalApproval: boolean;
  };
}

export interface ICADocument {
  id: string;
  type:
    | 'independent_contractor_agreement'
    | 'platform_services_agreement'
    | 'nda'
    | 'w9'
    | 'insurance_cert'
    | 'background_check';
  name: string;
  status: 'pending' | 'generated' | 'sent' | 'signed' | 'completed';
  generatedAt?: string;
  signedAt?: string;
  url?: string;
}

export class EnhancedICAOnboardingService {
  private static instance: EnhancedICAOnboardingService;
  private onboardingRecords: Map<string, ICAOnboardingRecord> = new Map();

  static getInstance(): EnhancedICAOnboardingService {
    if (!EnhancedICAOnboardingService.instance) {
      EnhancedICAOnboardingService.instance =
        new EnhancedICAOnboardingService();
    }
    return EnhancedICAOnboardingService.instance;
  }

  /**
   * Initialize Enhanced ICA onboarding for internal staff with Platform Services Agreement
   */
  createICAOnboarding(
    userId: string,
    tenantId: string,
    departmentCode: string
  ): ICAOnboardingRecord {
    const steps: ICAOnboardingStep[] = [
      {
        id: 'personal_info',
        title: 'Personal Information',
        description: 'Complete personal and contact information',
        completed: false,
        current: true,
        icon: '👤',
        order: 1,
      },
      {
        id: 'experience_verification',
        title: 'Experience Verification',
        description: 'Verify transportation industry experience',
        completed: false,
        current: false,
        icon: '📋',
        order: 2,
      },
      {
        id: 'background_check',
        title: 'Background Check',
        description: 'Complete background verification process',
        completed: false,
        current: false,
        icon: '🔍',
        order: 3,
      },
      {
        id: 'document_generation',
        title: 'Document Generation',
        description: 'Generate contractor agreement and NDA',
        completed: false,
        current: false,
        icon: '📄',
        order: 4,
      },
      {
        id: 'platform_services_agreement', // NEW STEP
        title: 'Platform Services Agreement',
        description:
          'Review and sign 50% revenue sharing agreement for FreightFlow RFx℠, AI Flow, and Government Contracts',
        completed: false,
        current: false,
        icon: '💰',
        order: 5,
        requiresPlatformServices: true,
      },
      {
        id: 'contract_review',
        title: 'Contract Review',
        description: 'Review all generated contracts and agreements',
        completed: false,
        current: false,
        icon: '⚖️',
        order: 6,
      },
      {
        id: 'document_signing',
        title: 'Document Signing',
        description: 'Electronically sign all required documents',
        completed: false,
        current: false,
        icon: '✍️',
        order: 7,
      },
      {
        id: 'insurance_verification',
        title: 'Insurance Verification',
        description: 'Verify professional liability insurance',
        completed: false,
        current: false,
        icon: '🛡️',
        order: 8,
      },
      {
        id: 'training_completion',
        title: 'Training Completion',
        description: 'Complete required FleetFlow University training',
        completed: false,
        current: false,
        icon: '🎓',
        order: 9,
      },
      {
        id: 'system_access',
        title: 'System Access Setup',
        description: 'Configure system permissions and platform access',
        completed: false,
        current: false,
        icon: '🔑',
        order: 10,
      },
      {
        id: 'final_approval',
        title: 'Final Approval',
        description: 'Management approval and onboarding completion',
        completed: false,
        current: false,
        icon: '✅',
        order: 11,
      },
    ];

    // Create initial Platform Services Agreement
    const platformServicesAgreement: PlatformServicesAgreement = {
      agreementId: `PSA-${tenantId}-${userId}-${Date.now()}`,
      tenantId,
      userId,
      revenueShareRate: 0.5, // 50%
      enabledServices: {
        rfxEnabled: true,
        aiFlowEnabled: true,
        govContractsEnabled: true,
        insuranceEnabled: true,
      },
      status: 'pending',
      effectiveDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 1 year
    };

    const record: ICAOnboardingRecord = {
      userId,
      tenantId,
      startDate: new Date().toISOString(),
      status: 'in_progress',
      currentStep: 0,
      totalSteps: steps.length,
      progressPercentage: 0,
      steps,
      documents: this.initializeDocuments(),
      platformServicesAgreement,
      summary: {
        personalInfoComplete: false,
        experienceVerified: false,
        backgroundCheckComplete: false,
        documentsGenerated: 0,
        documentsSigned: 0,
        platformServicesAgreementSigned: false,
        insuranceVerified: false,
        trainingComplete: false,
        systemAccessGranted: false,
        finalApproval: false,
      },
    };

    this.onboardingRecords.set(userId, record);
    return record;
  }

  /**
   * Initialize documents including Platform Services Agreement
   */
  private initializeDocuments(): ICADocument[] {
    return [
      {
        id: 'ica-001',
        type: 'independent_contractor_agreement',
        name: 'Independent Contractor Agreement',
        status: 'pending',
      },
      {
        id: 'psa-001', // NEW DOCUMENT
        type: 'platform_services_agreement',
        name: 'FleetFlow Platform Services Agreement (50% Revenue Share)',
        status: 'pending',
      },
      {
        id: 'nda-001',
        type: 'nda',
        name: 'Non-Disclosure Agreement',
        status: 'pending',
      },
      {
        id: 'w9-001',
        type: 'w9',
        name: 'W-9 Tax Form',
        status: 'pending',
      },
      {
        id: 'insurance-001',
        type: 'insurance_cert',
        name: 'Professional Liability Insurance Certificate',
        status: 'pending',
      },
      {
        id: 'background-001',
        type: 'background_check',
        name: 'Background Check Results',
        status: 'pending',
      },
    ];
  }

  /**
   * Sign Platform Services Agreement
   */
  async signPlatformServicesAgreement(
    userId: string,
    agreementId: string,
    ipAddress: string,
    userAgent: string
  ): Promise<{ success: boolean; message: string }> {
    const record = this.onboardingRecords.get(userId);
    if (!record) {
      return { success: false, message: 'Onboarding record not found' };
    }

    if (!record.platformServicesAgreement) {
      return {
        success: false,
        message: 'Platform Services Agreement not found',
      };
    }

    try {
      // Update agreement status
      record.platformServicesAgreement.status = 'signed';
      record.platformServicesAgreement.signedDate = new Date().toISOString();
      record.platformServicesAgreement.documentUrl = `/contracts/psa/${agreementId}.pdf`;

      // Update document status
      const psaDoc = record.documents.find(
        (doc) => doc.type === 'platform_services_agreement'
      );
      if (psaDoc) {
        psaDoc.status = 'signed';
        psaDoc.signedAt = new Date().toISOString();
        psaDoc.url = record.platformServicesAgreement.documentUrl;
      }

      // Update step status
      const psaStep = record.steps.find(
        (step) => step.id === 'platform_services_agreement'
      );
      if (psaStep) {
        psaStep.completed = true;
        psaStep.completedAt = new Date().toISOString();
      }

      // Update summary
      record.summary.platformServicesAgreementSigned = true;
      record.summary.documentsSigned += 1;

      this.updateSummary(record);

      // Log audit trail
      console.info(
        `✅ Platform Services Agreement signed by user ${userId} for tenant ${record.tenantId}`,
        {
          agreementId,
          signedAt: record.platformServicesAgreement.signedDate,
          ipAddress,
          userAgent,
          revenueShareRate: record.platformServicesAgreement.revenueShareRate,
          enabledServices: record.platformServicesAgreement.enabledServices,
        }
      );

      return {
        success: true,
        message: `Platform Services Agreement signed successfully. Revenue sharing (50%) now active for FreightFlow RFx℠, AI Flow, and Government Contracts.`,
      };
    } catch (error) {
      console.error('Error signing Platform Services Agreement:', error);
      return {
        success: false,
        message: 'Failed to sign Platform Services Agreement',
      };
    }
  }

  /**
   * Check if user has signed Platform Services Agreement
   */
  hasPlatformServicesAccess(userId: string): boolean {
    const record = this.onboardingRecords.get(userId);
    return record?.platformServicesAgreement?.status === 'signed' || false;
  }

  /**
   * Get Platform Services Agreement for user
   */
  getPlatformServicesAgreement(
    userId: string
  ): PlatformServicesAgreement | null {
    const record = this.onboardingRecords.get(userId);
    return record?.platformServicesAgreement || null;
  }

  /**
   * Update revenue share configuration
   */
  updateRevenueShareConfiguration(
    userId: string,
    enabledServices: Partial<PlatformServicesAgreement['enabledServices']>
  ): boolean {
    const record = this.onboardingRecords.get(userId);
    if (
      !record?.platformServicesAgreement ||
      record.platformServicesAgreement.status !== 'signed'
    ) {
      return false;
    }

    record.platformServicesAgreement.enabledServices = {
      ...record.platformServicesAgreement.enabledServices,
      ...enabledServices,
    };

    return true;
  }

  /**
   * Get ICA onboarding record for user
   */
  getICAOnboarding(userId: string): ICAOnboardingRecord | null {
    return this.onboardingRecords.get(userId) || null;
  }

  /**
   * Update step status
   */
  updateStepStatus(
    userId: string,
    stepId: string,
    completed: boolean
  ): ICAOnboardingRecord | null {
    const record = this.onboardingRecords.get(userId);
    if (!record) return null;

    const stepIndex = record.steps.findIndex((step) => step.id === stepId);
    if (stepIndex === -1) return null;

    // Update step
    record.steps[stepIndex].completed = completed;
    record.steps[stepIndex].completedAt = completed
      ? new Date().toISOString()
      : undefined;

    // Update current step
    if (completed) {
      // Mark current step as not current
      record.steps[stepIndex].current = false;

      // Move to next incomplete step
      const nextIncompleteIndex = record.steps.findIndex(
        (step) => !step.completed
      );
      if (nextIncompleteIndex !== -1) {
        record.steps[nextIncompleteIndex].current = true;
        record.currentStep = nextIncompleteIndex;
      } else {
        // All steps completed
        record.status = 'completed';
        record.completionDate = new Date().toISOString();
        record.currentStep = record.steps.length - 1;
      }
    }

    // Update progress
    const completedSteps = record.steps.filter((step) => step.completed).length;
    record.progressPercentage = Math.round(
      (completedSteps / record.totalSteps) * 100
    );

    this.updateSummary(record);
    return record;
  }

  /**
   * Update summary information
   */
  private updateSummary(record: ICAOnboardingRecord): void {
    const completedSteps = record.steps
      .filter((step) => step.completed)
      .map((step) => step.id);

    record.summary.personalInfoComplete =
      completedSteps.includes('personal_info');
    record.summary.experienceVerified = completedSteps.includes(
      'experience_verification'
    );
    record.summary.backgroundCheckComplete =
      completedSteps.includes('background_check');
    record.summary.documentsGenerated = record.documents.filter(
      (doc) => doc.status === 'generated'
    ).length;
    record.summary.documentsSigned = record.documents.filter(
      (doc) => doc.status === 'signed'
    ).length;
    record.summary.platformServicesAgreementSigned =
      record.platformServicesAgreement?.status === 'signed' || false;
    record.summary.insuranceVerified = completedSteps.includes(
      'insurance_verification'
    );
    record.summary.trainingComplete = completedSteps.includes(
      'training_completion'
    );
    record.summary.systemAccessGranted =
      completedSteps.includes('system_access');
    record.summary.finalApproval = completedSteps.includes('final_approval');
  }

  /**
   * Get all ICA onboarding records for tenant
   */
  getAllICAOnboardingRecords(tenantId?: string): ICAOnboardingRecord[] {
    const records = Array.from(this.onboardingRecords.values());
    return tenantId
      ? records.filter((record) => record.tenantId === tenantId)
      : records;
  }

  /**
   * Get platform services revenue summary for tenant
   */
  getPlatformServicesRevenueSummary(tenantId: string): {
    totalUsers: number;
    usersWithPlatformAccess: number;
    enabledServices: {
      rfx: number;
      aiFlow: number;
      govContracts: number;
      insurance: number;
    };
  } {
    const records = this.getAllICAOnboardingRecords(tenantId);
    const usersWithAccess = records.filter(
      (r) => r.platformServicesAgreement?.status === 'signed'
    );

    return {
      totalUsers: records.length,
      usersWithPlatformAccess: usersWithAccess.length,
      enabledServices: {
        rfx: usersWithAccess.filter(
          (r) => r.platformServicesAgreement?.enabledServices.rfxEnabled
        ).length,
        aiFlow: usersWithAccess.filter(
          (r) => r.platformServicesAgreement?.enabledServices.aiFlowEnabled
        ).length,
        govContracts: usersWithAccess.filter(
          (r) =>
            r.platformServicesAgreement?.enabledServices.govContractsEnabled
        ).length,
        insurance: usersWithAccess.filter(
          (r) => r.platformServicesAgreement?.enabledServices.insuranceEnabled
        ).length,
      },
    };
  }
}

// Create singleton instance
const enhancedICAService = EnhancedICAOnboardingService.getInstance();

// Demo enhanced ICA onboarding records with platform services
const demoUsers = [
  {
    id: 'user-001',
    name: 'Sarah Johnson',
    dept: 'DC',
    tenantId: 'acme-logistics',
  },
  {
    id: 'user-002',
    name: 'Mike Rodriguez',
    dept: 'BB',
    tenantId: 'acme-logistics',
  },
  {
    id: 'user-003',
    name: 'Lisa Chen',
    dept: 'MGR',
    tenantId: 'beta-transport',
  },
];

demoUsers.forEach((user) => {
  const record = enhancedICAService.createICAOnboarding(
    user.id,
    user.tenantId,
    user.dept
  );
  // Complete first few steps for demo
  enhancedICAService.updateStepStatus(user.id, 'personal_info', true);
  enhancedICAService.updateStepStatus(user.id, 'experience_verification', true);
  if (user.id === 'user-003') {
    // Complete Platform Services Agreement for manager
    enhancedICAService.signPlatformServicesAgreement(
      user.id,
      record.platformServicesAgreement!.agreementId,
      '192.168.1.100',
      'Mozilla/5.0 (Chrome)'
    );
  }
});

export const enhancedICAOnboardingService = enhancedICAService;
































