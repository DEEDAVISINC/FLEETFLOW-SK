/**
 * FleetFlow Contractor Onboarding Service
 * Handles dispatch and broker agent independent contractor onboarding
 */

export interface ContractorData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: 'dispatcher' | 'broker_agent' | 'both';
  experience: string;
  references: ContractorReference[];
  certifications: string[];
  availableHours: string;
  preferredRegions: string[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bankingInfo: {
    accountType: string;
    routingNumber: string;
    accountNumber: string;
    bankName: string;
  };
  taxInfo: {
    ssn: string;
    taxId?: string;
    businessType: 'individual' | 'llc' | 'corporation';
    businessName?: string;
  };
}

export interface ContractorReference {
  name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface OnboardingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
  order: number;
  completedAt?: Date;
  data?: any;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  type: 'contractor_agreement' | 'nda' | 'w9' | 'insurance_cert' | 'background_check';
  status: 'pending' | 'generated' | 'sent' | 'signed' | 'completed';
  required: boolean;
  documentUrl?: string;
  signedAt?: Date;
  docusignEnvelopeId?: string;
}

export interface OnboardingSession {
  id: string;
  contractorId: string;
  status: 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  steps: OnboardingStep[];
  documents: DocumentRequirement[];
  startedAt: Date;
  completedAt?: Date;
  assignedTo?: string;
  notes: string[];
}

export class ContractorOnboardingService {
  private static readonly ONBOARDING_STEPS = [
    {
      id: 'personal_info',
      name: 'Personal Information',
      description: 'Complete personal and contact information',
      required: true,
      order: 1
    },
    {
      id: 'experience_verification',
      name: 'Experience Verification',
      description: 'Verify transportation industry experience',
      required: true,
      order: 2
    },
    {
      id: 'background_check',
      name: 'Background Check',
      description: 'Complete background verification process',
      required: true,
      order: 3
    },
    {
      id: 'document_generation',
      name: 'Document Generation',
      description: 'Generate contractor agreement and NDA',
      required: true,
      order: 4
    },
    {
      id: 'contract_signing',
      name: 'Contract Signing',
      description: 'Review and sign contractor agreement',
      required: true,
      order: 5
    },
    {
      id: 'nda_signing',
      name: 'NDA Signing',
      description: 'Review and sign non-disclosure agreement',
      required: true,
      order: 6
    },
    {
      id: 'insurance_verification',
      name: 'Insurance Verification',
      description: 'Verify required insurance coverage',
      required: true,
      order: 7
    },
    {
      id: 'training_completion',
      name: 'Training Completion',
      description: 'Complete required training modules',
      required: true,
      order: 8
    },
    {
      id: 'system_setup',
      name: 'System Setup',
      description: 'Configure system access and permissions',
      required: true,
      order: 9
    },
    {
      id: 'final_approval',
      name: 'Final Approval',
      description: 'Final review and approval process',
      required: true,
      order: 10
    }
  ];

  private static readonly DOCUMENT_REQUIREMENTS = [
    {
      id: 'contractor_agreement',
      name: 'Independent Contractor Agreement',
      type: 'contractor_agreement' as const,
      required: true
    },
    {
      id: 'nda',
      name: 'Non-Disclosure Agreement',
      type: 'nda' as const,
      required: true
    },
    {
      id: 'w9',
      name: 'W-9 Tax Form',
      type: 'w9' as const,
      required: true
    },
    {
      id: 'insurance_cert',
      name: 'Insurance Certificate',
      type: 'insurance_cert' as const,
      required: true
    },
    {
      id: 'background_check',
      name: 'Background Check Authorization',
      type: 'background_check' as const,
      required: true
    }
  ];

  /**
   * Create new contractor onboarding session
   */
  static async createOnboardingSession(contractorData: ContractorData): Promise<OnboardingSession> {
    const session: OnboardingSession = {
      id: this.generateSessionId(),
      contractorId: contractorData.id,
      status: 'in_progress',
      currentStep: 1,
      totalSteps: this.ONBOARDING_STEPS.length,
      progressPercentage: 0,
      steps: this.ONBOARDING_STEPS.map(step => ({
        ...step,
        status: 'pending' as const
      })),
      documents: this.DOCUMENT_REQUIREMENTS.map(doc => ({
        ...doc,
        status: 'pending' as const
      })),
      startedAt: new Date(),
      notes: []
    };

    // Mark first step as in progress
    session.steps[0].status = 'in_progress';

    return session;
  }

  /**
   * Update onboarding step status
   */
  static async updateStepStatus(
    sessionId: string,
    stepId: string,
    status: OnboardingStep['status'],
    data?: any
  ): Promise<OnboardingSession> {
    const session = await this.getOnboardingSession(sessionId);
    
    const stepIndex = session.steps.findIndex(s => s.id === stepId);
    if (stepIndex === -1) {
      throw new Error(`Step ${stepId} not found`);
    }

    session.steps[stepIndex].status = status;
    session.steps[stepIndex].data = data;
    
    if (status === 'completed') {
      session.steps[stepIndex].completedAt = new Date();
      
      // Mark next step as in progress
      const nextStepIndex = stepIndex + 1;
      if (nextStepIndex < session.steps.length) {
        session.steps[nextStepIndex].status = 'in_progress';
      }
    }

    // Update progress
    session.progressPercentage = this.calculateProgress(session);
    session.currentStep = Math.max(session.currentStep, stepIndex + 1);

    // Check if all steps are completed
    if (session.steps.every(s => s.status === 'completed')) {
      session.status = 'completed';
      session.completedAt = new Date();
    }

    return session;
  }

  /**
   * Generate contractor agreement document
   */
  static async generateContractorAgreement(contractorData: ContractorData): Promise<string> {
    const template = await this.loadTemplate('contractor_agreement');
    
    const replacements = {
      '{{firstName}}': contractorData.firstName,
      '{{lastName}}': contractorData.lastName,
      '{{email}}': contractorData.email,
      '{{phone}}': contractorData.phone,
      '{{address}}': contractorData.address,
      '{{date}}': new Date().toLocaleDateString(),
      '{{companyName}}': 'FleetFlow Transportation Solutions',
      '{{role}}': this.formatRole(contractorData.role)
    };

    return this.processTemplate(template, replacements);
  }

  /**
   * Generate NDA document
   */
  static async generateNDA(contractorData: ContractorData): Promise<string> {
    const template = await this.loadTemplate('nda');
    
    const replacements = {
      '{{firstName}}': contractorData.firstName,
      '{{lastName}}': contractorData.lastName,
      '{{email}}': contractorData.email,
      '{{date}}': new Date().toLocaleDateString(),
      '{{companyName}}': 'FleetFlow Transportation Solutions'
    };

    return this.processTemplate(template, replacements);
  }

  /**
   * Process document signing via DocuSign
   */
  static async initiateDocumentSigning(
    sessionId: string,
    documentType: DocumentRequirement['type'],
    contractorData: ContractorData
  ): Promise<{ signingUrl: string; envelopeId: string }> {
    // This would integrate with DocuSign API
    // For now, returning mock data
    return {
      signingUrl: `https://demo.docusign.net/signing/${sessionId}/${documentType}`,
      envelopeId: this.generateEnvelopeId()
    };
  }

  /**
   * Process background check
   */
  static async initiateBackgroundCheck(
    contractorData: ContractorData
  ): Promise<{ checkId: string; status: string }> {
    // This would integrate with background check service
    return {
      checkId: this.generateCheckId(),
      status: 'in_progress'
    };
  }

  /**
   * Verify insurance requirements
   */
  static async verifyInsurance(
    contractorData: ContractorData,
    insuranceData: any
  ): Promise<{ verified: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Check required coverage amounts
    const requiredCoverage = {
      professional_liability: 1000000,
      general_liability: 500000,
      cyber_liability: 250000
    };

    Object.entries(requiredCoverage).forEach(([type, amount]) => {
      if (!insuranceData[type] || insuranceData[type] < amount) {
        issues.push(`Insufficient ${type.replace('_', ' ')} coverage. Required: $${amount.toLocaleString()}`);
      }
    });

    return {
      verified: issues.length === 0,
      issues
    };
  }

  /**
   * Setup system access for contractor
   */
  static async setupSystemAccess(
    contractorData: ContractorData
  ): Promise<{ userId: string; permissions: string[] }> {
    const permissions = this.getPermissionsForRole(contractorData.role);
    
    return {
      userId: this.generateUserId(),
      permissions
    };
  }

  /**
   * Get onboarding session
   */
  static async getOnboardingSession(sessionId: string): Promise<OnboardingSession> {
    // This would fetch from database
    // For now, returning mock data
    throw new Error('Session not found');
  }

  /**
   * Get all contractor onboarding sessions
   */
  static async getAllOnboardingSessions(): Promise<OnboardingSession[]> {
    // This would fetch from database
    return [];
  }

  /**
   * Calculate progress percentage
   */
  private static calculateProgress(session: OnboardingSession): number {
    const completedSteps = session.steps.filter(s => s.status === 'completed').length;
    return Math.round((completedSteps / session.totalSteps) * 100);
  }

  /**
   * Load document template
   */
  private static async loadTemplate(templateName: string): Promise<string> {
    // This would load from file system or database
    // For now, returning basic template
    return `<html><body>Template for ${templateName}</body></html>`;
  }

  /**
   * Process template with replacements
   */
  private static processTemplate(template: string, replacements: Record<string, string>): string {
    let processed = template;
    Object.entries(replacements).forEach(([placeholder, value]) => {
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    });
    return processed;
  }

  /**
   * Format role for display
   */
  private static formatRole(role: ContractorData['role']): string {
    const roleMap = {
      'dispatcher': 'Dispatcher',
      'broker_agent': 'Broker Agent',
      'both': 'Dispatcher & Broker Agent'
    };
    return roleMap[role] || role;
  }

  /**
   * Get permissions for role
   */
  private static getPermissionsForRole(role: ContractorData['role']): string[] {
    const basePermissions = ['dashboard_view', 'profile_edit'];
    
    switch (role) {
      case 'dispatcher':
        return [...basePermissions, 'dispatch_access', 'load_management', 'driver_communication'];
      case 'broker_agent':
        return [...basePermissions, 'broker_access', 'customer_management', 'rate_negotiation'];
      case 'both':
        return [...basePermissions, 'dispatch_access', 'broker_access', 'load_management', 'customer_management'];
      default:
        return basePermissions;
    }
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return `ONB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Generate unique envelope ID
   */
  private static generateEnvelopeId(): string {
    return `ENV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Generate unique check ID
   */
  private static generateCheckId(): string {
    return `BGC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  /**
   * Generate unique user ID
   */
  private static generateUserId(): string {
    return `USR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
}

export default ContractorOnboardingService; 