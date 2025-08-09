/**
 * Independent Contractor Agreement (ICA) Onboarding Service
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
}

export interface ICAOnboardingRecord {
  userId: string;
  startDate: string;
  completionDate?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  steps: ICAOnboardingStep[];
  documents: ICADocument[];
  summary: {
    personalInfoComplete: boolean;
    experienceVerified: boolean;
    backgroundCheckComplete: boolean;
    documentsGenerated: number;
    documentsSigned: number;
    insuranceVerified: boolean;
    trainingComplete: boolean;
    systemAccessGranted: boolean;
    finalApproval: boolean;
  };
}

export interface ICADocument {
  id: string;
  type: 'independent_contractor_agreement' | 'nda' | 'w9' | 'insurance_cert' | 'background_check';
  name: string;
  status: 'pending' | 'generated' | 'sent' | 'signed' | 'completed';
  generatedAt?: string;
  signedAt?: string;
  url?: string;
}

export class ICAOnboardingService {
  private static instance: ICAOnboardingService;
  private onboardingRecords: Map<string, ICAOnboardingRecord> = new Map();

  static getInstance(): ICAOnboardingService {
    if (!ICAOnboardingService.instance) {
      ICAOnboardingService.instance = new ICAOnboardingService();
    }
    return ICAOnboardingService.instance;
  }

  /**
   * Initialize ICA onboarding for internal staff (BB, DC, MGR, CS)
   */
  createICAOnboarding(userId: string, departmentCode: string): ICAOnboardingRecord {
    const steps: ICAOnboardingStep[] = [
      {
        id: 'personal_info',
        title: 'Personal Information',
        description: 'Complete personal and contact information',
        completed: false,
        current: true,
        icon: '👤',
        order: 1
      },
      {
        id: 'experience_verification',
        title: 'Experience Verification',
        description: 'Verify transportation industry experience',
        completed: false,
        current: false,
        icon: '📋',
        order: 2
      },
      {
        id: 'background_check',
        title: 'Background Check',
        description: 'Complete background verification process',
        completed: false,
        current: false,
        icon: '🔍',
        order: 3
      },
      {
        id: 'document_generation',
        title: 'Document Generation',
        description: 'Generate contractor agreement and NDA',
        completed: false,
        current: false,
        icon: '📄',
        order: 4
      },
      {
        id: 'contract_signing',
        title: 'Contract Signing',
        description: 'Review and sign Independent Contractor Agreement',
        completed: false,
        current: false,
        icon: '✍️',
        order: 5
      },
      {
        id: 'nda_signing',
        title: 'NDA Signing',
        description: 'Review and sign Non-Disclosure Agreement',
        completed: false,
        current: false,
        icon: '🔒',
        order: 6
      },
      {
        id: 'insurance_verification',
        title: 'Insurance Verification',
        description: 'Verify required insurance coverage ($1M Professional, $500K General, $250K Cyber)',
        completed: false,
        current: false,
        icon: '🛡️',
        order: 7
      },
      {
        id: 'training_completion',
        title: 'Training Completion',
        description: 'Complete required training modules based on role',
        completed: false,
        current: false,
        icon: '🎓',
        order: 8
      },
      {
        id: 'system_setup',
        title: 'System Setup',
        description: 'Configure system access and permissions',
        completed: false,
        current: false,
        icon: '⚙️',
        order: 9
      },
      {
        id: 'final_approval',
        title: 'Final Approval',
        description: 'Final review and approval process',
        completed: false,
        current: false,
        icon: '✅',
        order: 10
      }
    ];

    const documents: ICADocument[] = [
      {
        id: 'ica_agreement',
        type: 'independent_contractor_agreement',
        name: 'Independent Contractor Agreement',
        status: 'pending'
      },
      {
        id: 'nda',
        type: 'nda',
        name: 'Non-Disclosure Agreement',
        status: 'pending'
      },
      {
        id: 'w9_form',
        type: 'w9',
        name: 'W-9 Tax Form',
        status: 'pending'
      },
      {
        id: 'insurance_cert',
        type: 'insurance_cert',
        name: 'Insurance Certificate',
        status: 'pending'
      },
      {
        id: 'background_check',
        type: 'background_check',
        name: 'Background Check Authorization',
        status: 'pending'
      }
    ];

    const record: ICAOnboardingRecord = {
      userId,
      startDate: new Date().toISOString(),
      status: 'in_progress',
      currentStep: 1,
      totalSteps: steps.length,
      progressPercentage: 0,
      steps,
      documents,
      summary: {
        personalInfoComplete: false,
        experienceVerified: false,
        backgroundCheckComplete: false,
        documentsGenerated: 0,
        documentsSigned: 0,
        insuranceVerified: false,
        trainingComplete: false,
        systemAccessGranted: false,
        finalApproval: false
      }
    };

    this.onboardingRecords.set(userId, record);
    return record;
  }

  /**
   * Get ICA onboarding record for user
   */
  getICAOnboarding(userId: string): ICAOnboardingRecord | null {
    return this.onboardingRecords.get(userId) || null;
  }

  /**
   * Update step completion status
   */
  updateStepStatus(userId: string, stepId: string, completed: boolean): ICAOnboardingRecord | null {
    const record = this.onboardingRecords.get(userId);
    if (!record) return null;

    const stepIndex = record.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) return null;

    record.steps[stepIndex].completed = completed;
    record.steps[stepIndex].current = false;
    
    if (completed) {
      record.steps[stepIndex].completedAt = new Date().toISOString();
      
      // Mark next step as current
      const nextStepIndex = stepIndex + 1;
      if (nextStepIndex < record.steps.length) {
        record.steps[nextStepIndex].current = true;
        record.currentStep = nextStepIndex + 1;
      }
    }

    // Update progress
    const completedSteps = record.steps.filter(s => s.completed).length;
    record.progressPercentage = Math.round((completedSteps / record.totalSteps) * 100);

    // Check if all steps completed
    if (completedSteps === record.totalSteps) {
      record.status = 'completed';
      record.completionDate = new Date().toISOString();
      record.summary.finalApproval = true;
    }

    // Update summary based on completed steps
    this.updateSummary(record);

    this.onboardingRecords.set(userId, record);
    return record;
  }

  /**
   * Update document status
   */
  updateDocumentStatus(userId: string, documentId: string, status: ICADocument['status']): boolean {
    const record = this.onboardingRecords.get(userId);
    if (!record) return false;

    const docIndex = record.documents.findIndex(d => d.id === documentId);
    if (docIndex === -1) return false;

    record.documents[docIndex].status = status;
    
    if (status === 'signed') {
      record.documents[docIndex].signedAt = new Date().toISOString();
    }

    this.updateSummary(record);
    this.onboardingRecords.set(userId, record);
    return true;
  }

  /**
   * Update summary statistics
   */
  private updateSummary(record: ICAOnboardingRecord): void {
    record.summary = {
      personalInfoComplete: record.steps.find(s => s.id === 'personal_info')?.completed || false,
      experienceVerified: record.steps.find(s => s.id === 'experience_verification')?.completed || false,
      backgroundCheckComplete: record.steps.find(s => s.id === 'background_check')?.completed || false,
      documentsGenerated: record.documents.filter(d => ['generated', 'sent', 'signed', 'completed'].includes(d.status)).length,
      documentsSigned: record.documents.filter(d => d.status === 'signed').length,
      insuranceVerified: record.steps.find(s => s.id === 'insurance_verification')?.completed || false,
      trainingComplete: record.steps.find(s => s.id === 'training_completion')?.completed || false,
      systemAccessGranted: record.steps.find(s => s.id === 'system_setup')?.completed || false,
      finalApproval: record.steps.find(s => s.id === 'final_approval')?.completed || false
    };
  }

  /**
   * Get all ICA onboarding records
   */
  getAllICAOnboardingRecords(): ICAOnboardingRecord[] {
    return Array.from(this.onboardingRecords.values());
  }

  /**
   * Get onboarding statistics for management
   */
  getOnboardingStats(): {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    onHold: number;
  } {
    const records = this.getAllICAOnboardingRecords();
    return {
      total: records.length,
      pending: records.filter(r => r.status === 'pending').length,
      inProgress: records.filter(r => r.status === 'in_progress').length,
      completed: records.filter(r => r.status === 'completed').length,
      onHold: records.filter(r => r.status === 'on_hold').length,
    };
  }
}

// Initialize with demo data for development
const icaService = ICAOnboardingService.getInstance();

// Demo ICA onboarding records for internal staff
const demoUsers = [
  { id: 'FM-MGR-20230115-1', dept: 'MGR', progress: 100 },
  { id: 'ED-BB-20240601-2', dept: 'BB', progress: 70 },
  { id: 'MW-DC-20240615-3', dept: 'DC', progress: 40 },
  { id: 'SJ-CS-20240620-4', dept: 'CS', progress: 20 }
];

demoUsers.forEach(user => {
  const record = icaService.createICAOnboarding(user.id, user.dept);
  
  // Simulate progress based on demo data
  const stepsToComplete = Math.floor((user.progress / 100) * record.totalSteps);
  for (let i = 0; i < stepsToComplete; i++) {
    icaService.updateStepStatus(user.id, record.steps[i].id, true);
  }
});

export const icaOnboardingService = icaService;



