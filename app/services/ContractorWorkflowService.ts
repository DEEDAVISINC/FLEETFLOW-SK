/**
 * FleetFlow Contractor Workflow Service
 * Handles automated contractor onboarding workflows, signature management, and system access
 */

import UserIdentificationService, { UserIdentifiers } from './UserIdentificationService'
import { SECTION_PERMISSIONS } from '../utils/sectionPermissions'

export interface ContractorWorkflowTrigger {
  userId: string;
  userRole: 'Dispatcher' | 'Broker Agent';
  triggerType: 'user_creation' | 'role_change' | 'manual_trigger';
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    hiredDate: string;
    userIdentifiers: UserIdentifiers;
  };
  triggeredAt: Date;
  triggeredBy: string;
}

export interface SignatureRequest {
  id: string;
  userId: string;
  documentType: 'contractor_agreement' | 'nda' | 'w9' | 'insurance_cert';
  documentContent: string;
  signatureUrl: string;
  status: 'pending' | 'sent' | 'signed' | 'expired' | 'cancelled';
  sentAt?: Date;
  signedAt?: Date;
  expiresAt: Date;
  remindersSent: number;
  ipAddress?: string;
  userAgent?: string;
  signatureData?: {
    signature: string;
    timestamp: Date;
    deviceInfo: string;
    location?: string;
  };
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  order: number;
  dependencies: string[];
  automationEnabled: boolean;
  completedAt?: Date;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  data?: any;
}

export interface ContractorWorkflowSession {
  id: string;
  userId: string;
  trigger: ContractorWorkflowTrigger;
  status: 'active' | 'completed' | 'failed' | 'cancelled';
  currentStep: number;
  steps: WorkflowStep[];
  signatureRequests: SignatureRequest[];
  systemAccess: {
    sectionsAccess: string[];
    granted: boolean;
    grantedAt?: Date;
    restrictions: string[];
  };
  trainingRequirements: {
    required: string[];
    completed: string[];
    inProgress: string[];
    allCompleted: boolean;
  };
  notifications: {
    id: string;
    type: 'email' | 'sms' | 'system';
    message: string;
    sentAt: Date;
    delivered: boolean;
  }[];
  createdAt: Date;
  completedAt?: Date;
  lastActivity: Date;
}

export class ContractorWorkflowService {
  private static readonly WORKFLOW_STEPS = [
    {
      id: 'user_verification',
      name: 'User Verification',
      description: 'Verify user identity and role requirements',
      order: 1,
      dependencies: [],
      automationEnabled: true,
      maxRetries: 3
    },
    {
      id: 'document_generation',
      name: 'Document Generation',
      description: 'Generate contractor agreement and NDA',
      order: 2,
      dependencies: ['user_verification'],
      automationEnabled: true,
      maxRetries: 2
    },
    {
      id: 'signature_request',
      name: 'Signature Request',
      description: 'Send documents for electronic signature',
      order: 3,
      dependencies: ['document_generation'],
      automationEnabled: true,
      maxRetries: 1
    },
    {
      id: 'signature_validation',
      name: 'Signature Validation',
      description: 'Validate received signatures',
      order: 4,
      dependencies: ['signature_request'],
      automationEnabled: true,
      maxRetries: 2
    },
    {
      id: 'section_access_creation',
      name: 'Section Access Creation',
      description: 'Create initial section access permissions',
      order: 5,
      dependencies: ['signature_validation'],
      automationEnabled: true,
      maxRetries: 3
    },
    {
      id: 'training_assignment',
      name: 'Training Assignment',
      description: 'Assign required training modules',
      order: 6,
      dependencies: ['section_access_creation'],
      automationEnabled: true,
      maxRetries: 2
    },
    {
      id: 'access_pending',
      name: 'Access Pending Training',
      description: 'Wait for training completion',
      order: 7,
      dependencies: ['training_assignment'],
      automationEnabled: false,
      maxRetries: 0
    },
    {
      id: 'full_access_grant',
      name: 'Full Access Grant',
      description: 'Grant full system access after training',
      order: 8,
      dependencies: ['access_pending'],
      automationEnabled: true,
      maxRetries: 2
    }
  ];

  private static readonly SIGNATURE_SYSTEM_CONFIG = {
    baseUrl: process.env.SIGNATURE_API_URL || 'https://signature.fleetflowapp.com',
    apiKey: process.env.SIGNATURE_API_KEY || 'ff_signature_key',
    webhookSecret: process.env.SIGNATURE_WEBHOOK_SECRET || 'ff_webhook_secret',
    expirationDays: 7,
    reminderDays: [3, 1], // Send reminders 3 days and 1 day before expiration
    maxReminders: 3
  };

  /**
   * Trigger contractor onboarding workflow when dispatch/broker user is created
   */
  static async triggerOnboarding(trigger: ContractorWorkflowTrigger): Promise<ContractorWorkflowSession> {
    console.info(`🚀 Triggering contractor onboarding for user: ${trigger.userId}`)
    
    const session: ContractorWorkflowSession = {
      id: this.generateSessionId(),
      userId: trigger.userId,
      trigger,
      status: 'active',
      currentStep: 0,
      steps: this.WORKFLOW_STEPS.map(step => ({
        ...step,
        status: 'pending' as const,
        retryCount: 0
      })),
      signatureRequests: [],
      systemAccess: {
        sectionsAccess: [],
        granted: false,
        restrictions: ['pending_contractor_agreement', 'pending_training']
      },
      trainingRequirements: {
        required: this.getRequiredTraining(trigger.userRole),
        completed: [],
        inProgress: [],
        allCompleted: false
      },
      notifications: [],
      createdAt: new Date(),
      lastActivity: new Date()
    }

    // Auto-start first step
    await this.processNextStep(session)
    
    // Send notification to user
    await this.sendNotification(session, {
      type: 'email',
      message: `Welcome to FleetFlow! Your contractor onboarding process has been initiated. Please check your email for next steps.`
    })

    // Send notification to administrators
    await this.sendNotification(session, {
      type: 'system',
      message: `New contractor onboarding initiated for ${trigger.userData.firstName} ${trigger.userData.lastName} (${trigger.userData.email})`
    })

    return session
  }

  /**
   * Process next step in workflow
   */
  static async processNextStep(session: ContractorWorkflowSession): Promise<void> {
    const currentStep = session.steps[session.currentStep]
    
    if (!currentStep) {
      await this.completeWorkflow(session)
      return
    }

    // Check dependencies
    const dependenciesComplete = currentStep.dependencies.every(depId => 
      session.steps.find(s => s.id === depId)?.status === 'completed'
    )

    if (!dependenciesComplete) {
      console.info(`⏳ Dependencies not met for step: ${currentStep.id}`)
      return
    }

    // Mark step as in progress
    currentStep.status = 'in_progress'
    session.lastActivity = new Date()

    try {
      await this.executeStep(session, currentStep)
      
      // Mark as completed and move to next step
      currentStep.status = 'completed'
      currentStep.completedAt = new Date()
      
      // Auto-process next step if automation is enabled
      if (currentStep.automationEnabled) {
        session.currentStep++
        await this.processNextStep(session)
      }
    } catch (error: any) {
      console.error(`❌ Step failed: ${currentStep.id}`, error)
      
      currentStep.retryCount++
      currentStep.failureReason = error.message
      
      if (currentStep.retryCount < currentStep.maxRetries) {
        // Retry the step
        currentStep.status = 'pending'
        setTimeout(() => this.processNextStep(session), 5000) // Retry after 5 seconds
      } else {
        // Mark as failed
        currentStep.status = 'failed'
        session.status = 'failed'
        
        await this.sendNotification(session, {
          type: 'system',
          message: `Contractor onboarding failed at step: ${currentStep.name}. Manual intervention required.`
        })
      }
    }
  }

  /**
   * Execute specific workflow step
   */
  private static async executeStep(session: ContractorWorkflowSession, step: WorkflowStep): Promise<void> {
    switch (step.id) {
      case 'user_verification':
        await this.verifyUser(session)
        break
      case 'document_generation':
        await this.generateDocuments(session)
        break
      case 'signature_request':
        await this.requestSignatures(session)
        break
      case 'signature_validation':
        await this.validateSignatures(session)
        break
      case 'section_access_creation':
        await this.createSectionAccess(session)
        break
      case 'training_assignment':
        await this.assignTraining(session)
        break
      case 'full_access_grant':
        await this.grantFullAccess(session)
        break
      default:
        throw new Error(`Unknown step: ${step.id}`)
    }
  }

  /**
   * Verify user identity and role requirements
   */
  private static async verifyUser(session: ContractorWorkflowSession): Promise<void> {
    const { userData } = session.trigger
    
    // Verify user has required role
    if (!['Dispatcher', 'Broker Agent'].includes(session.trigger.userRole)) {
      throw new Error(`Invalid role for contractor onboarding: ${session.trigger.userRole}`)
    }

    // Verify user identification system
    const identifiers = UserIdentificationService.generateUserIdentifiers({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: session.trigger.userRole as any,
      department: userData.department,
      hiredDate: userData.hiredDate,
      location: 'Main Office'
    })

    session.trigger.userData.userIdentifiers = identifiers
    
    console.info(`✅ User verified: ${userData.firstName} ${userData.lastName} (${identifiers.userId})`)
  }

  /**
   * Generate contractor documents
   */
  private static async generateDocuments(session: ContractorWorkflowSession): Promise<void> {
    const { userData } = session.trigger
    
    // Generate contractor agreement
    const contractorAgreement = await this.generateContractorAgreement(userData)
    
    // Generate NDA
    const nda = await this.generateNDA(userData)
    
    // Store documents for signature
    step.data = {
      contractorAgreement,
      nda,
      generatedAt: new Date()
    }
    
    console.info(`📄 Documents generated for user: ${userData.email}`)
  }

  /**
   * Request electronic signatures using FleetFlow signature system
   */
  private static async requestSignatures(session: ContractorWorkflowSession): Promise<void> {
    const { userData } = session.trigger
    const previousStep = session.steps.find(s => s.id === 'document_generation')
    
    if (!previousStep?.data) {
      throw new Error('Documents not found for signature request')
    }

    // Create signature request for contractor agreement
    const contractorSignatureRequest = await this.createSignatureRequest({
      userId: session.userId,
      documentType: 'contractor_agreement',
      documentContent: previousStep.data.contractorAgreement,
      userData
    })

    // Create signature request for NDA
    const ndaSignatureRequest = await this.createSignatureRequest({
      userId: session.userId,
      documentType: 'nda',
      documentContent: previousStep.data.nda,
      userData
    })

    session.signatureRequests.push(contractorSignatureRequest, ndaSignatureRequest)
    
    // Send email notification with signature links
    await this.sendNotification(session, {
      type: 'email',
      message: `Please sign your contractor documents. Contractor Agreement: ${contractorSignatureRequest.signatureUrl}, NDA: ${ndaSignatureRequest.signatureUrl}`
    })
    
    console.info(`📧 Signature requests sent to: ${userData.email}`)
  }

  /**
   * Create signature request using FleetFlow signature system
   */
  private static async createSignatureRequest(params: {
    userId: string;
    documentType: SignatureRequest['documentType'];
    documentContent: string;
    userData: ContractorWorkflowTrigger['userData'];
  }): Promise<SignatureRequest> {
    const signatureRequest: SignatureRequest = {
      id: this.generateSignatureId(),
      userId: params.userId,
      documentType: params.documentType,
      documentContent: params.documentContent,
      signatureUrl: this.generateSignatureUrl(params.userId, params.documentType),
      status: 'pending',
      expiresAt: new Date(Date.now() + (this.SIGNATURE_SYSTEM_CONFIG.expirationDays * 24 * 60 * 60 * 1000)),
      remindersSent: 0
    }

    // In a real implementation, this would call the signature API
    // For now, we'll simulate the signature system
    console.info(`🔐 Signature request created: ${signatureRequest.id}`)
    
    return signatureRequest
  }

  /**
   * Generate signature URL for FleetFlow signature system
   */
  private static generateSignatureUrl(userId: string, documentType: string): string {
    const baseUrl = this.SIGNATURE_SYSTEM_CONFIG.baseUrl
    const token = this.generateSignatureToken(userId, documentType)
    return `${baseUrl}/sign/${token}`
  }

  /**
   * Generate signature token
   */
  private static generateSignatureToken(userId: string, documentType: string): string {
    const timestamp = Date.now()
    const data = `${userId}:${documentType}:${timestamp}`
    // In a real implementation, this would be properly encrypted
    return Buffer.from(data).toString('base64').replace(/[^a-zA-Z0-9]/g, '')
  }

  /**
   * Validate received signatures
   */
  private static async validateSignatures(session: ContractorWorkflowSession): Promise<void> {
    const requiredSignatures = session.signatureRequests.filter(req => 
      ['contractor_agreement', 'nda'].includes(req.documentType)
    )

    const completedSignatures = requiredSignatures.filter(req => req.status === 'signed')
    
    if (completedSignatures.length !== requiredSignatures.length) {
      throw new Error('Not all required signatures have been completed')
    }

    // Validate signature integrity
    for (const signature of completedSignatures) {
      if (!signature.signatureData) {
        throw new Error(`Invalid signature data for ${signature.documentType}`)
      }
      
      // Additional validation logic would go here
      console.info(`✅ Signature validated: ${signature.documentType}`)
    }
    
    console.info(`✅ All signatures validated for user: ${session.userId}`)
  }

  /**
   * Create initial section access permissions
   */
  private static async createSectionAccess(session: ContractorWorkflowSession): Promise<void> {
    const { userRole } = session.trigger
    
    // Get base permissions for role
    const basePermissions = this.getBasePermissions(userRole)
    
    // Create initial section access (limited until training is complete)
    session.systemAccess.sectionsAccess = basePermissions.initial
    session.systemAccess.granted = true
    session.systemAccess.grantedAt = new Date()
    session.systemAccess.restrictions = ['training_required']
    
    console.info(`🔐 Initial section access created for ${userRole}: ${basePermissions.initial.join(', ')}`)
    
    await this.sendNotification(session, {
      type: 'email',
      message: `Your initial system access has been granted. Complete your training to unlock full access.`
    })
  }

  /**
   * Assign required training modules
   */
  private static async assignTraining(session: ContractorWorkflowSession): Promise<void> {
    const { userRole } = session.trigger
    
    // Get required training modules
    const requiredTraining = this.getRequiredTraining(userRole)
    
    session.trainingRequirements.required = requiredTraining
    session.trainingRequirements.inProgress = requiredTraining // Mark all as in progress
    
    console.info(`📚 Training assigned for ${userRole}: ${requiredTraining.join(', ')}`)
    
    await this.sendNotification(session, {
      type: 'email',
      message: `Your training modules have been assigned. Please complete them to gain full system access.`
    })
  }

  /**
   * Grant full system access after training completion
   */
  private static async grantFullAccess(session: ContractorWorkflowSession): Promise<void> {
    const { userRole } = session.trigger
    
    // Get full permissions for role
    const fullPermissions = this.getBasePermissions(userRole)
    
    // Grant full access
    session.systemAccess.sectionsAccess = fullPermissions.full
    session.systemAccess.restrictions = []
    
    console.info(`🔓 Full access granted for ${userRole}: ${fullPermissions.full.join(', ')}`)
    
    await this.sendNotification(session, {
      type: 'email',
      message: `Congratulations! You have completed all requirements and now have full system access.`
    })
  }

  /**
   * Complete workflow
   */
  private static async completeWorkflow(session: ContractorWorkflowSession): Promise<void> {
    session.status = 'completed'
    session.completedAt = new Date()
    
    console.info(`🎉 Contractor onboarding completed for user: ${session.userId}`)
    
    await this.sendNotification(session, {
      type: 'system',
      message: `Contractor onboarding completed successfully for ${session.trigger.userData.firstName} ${session.trigger.userData.lastName}`
    })
  }

  /**
   * Handle signature webhook from signature system
   */
  static async handleSignatureWebhook(payload: {
    signatureId: string;
    userId: string;
    documentType: string;
    status: 'signed' | 'declined' | 'expired';
    signatureData?: {
      signature: string;
      timestamp: string;
      deviceInfo: string;
      ipAddress: string;
      location?: string;
    };
  }): Promise<void> {
    // Find the signature request
    const sessions = await this.getAllActiveSessions()
    const session = sessions.find(s => 
      s.signatureRequests.some(req => req.id === payload.signatureId)
    )

    if (!session) {
      console.info(`⚠️ Session not found for signature: ${payload.signatureId}`)
      return
    }

    const signatureRequest = session.signatureRequests.find(req => req.id === payload.signatureId)
    if (!signatureRequest) {
      console.info(`⚠️ Signature request not found: ${payload.signatureId}`)
      return
    }

    // Update signature status
    signatureRequest.status = payload.status
    if (payload.status === 'signed' && payload.signatureData) {
      signatureRequest.signedAt = new Date()
      signatureRequest.signatureData = {
        signature: payload.signatureData.signature,
        timestamp: new Date(payload.signatureData.timestamp),
        deviceInfo: payload.signatureData.deviceInfo,
        location: payload.signatureData.location
      }
    }

    // Check if all signatures are complete
    const allSignaturesComplete = session.signatureRequests
      .filter(req => ['contractor_agreement', 'nda'].includes(req.documentType))
      .every(req => req.status === 'signed')

    if (allSignaturesComplete) {
      // Continue to next step
      await this.processNextStep(session)
    }
  }

  /**
   * Mark training as completed for user
   */
  static async markTrainingCompleted(userId: string, trainingModule: string): Promise<void> {
    const sessions = await this.getAllActiveSessions()
    const session = sessions.find(s => s.userId === userId)

    if (!session) {
      console.info(`⚠️ Active session not found for user: ${userId}`)
      return
    }

    // Mark training as completed
    if (session.trainingRequirements.inProgress.includes(trainingModule)) {
      session.trainingRequirements.inProgress = session.trainingRequirements.inProgress.filter(t => t !== trainingModule)
      session.trainingRequirements.completed.push(trainingModule)
    }

    // Check if all training is complete
    const allTrainingComplete = session.trainingRequirements.required.every(req => 
      session.trainingRequirements.completed.includes(req)
    )

    if (allTrainingComplete) {
      session.trainingRequirements.allCompleted = true
      
      // Move to next step (grant full access)
      const accessPendingStep = session.steps.find(s => s.id === 'access_pending')
      if (accessPendingStep) {
        accessPendingStep.status = 'completed'
        accessPendingStep.completedAt = new Date()
        session.currentStep = session.steps.findIndex(s => s.id === 'full_access_grant')
        await this.processNextStep(session)
      }
    }
  }

  /**
   * Get base permissions for user role
   */
  private static getBasePermissions(role: string): { initial: string[]; full: string[] } {
    const permissions = {
      'Dispatcher': {
        initial: [
          'dashboard.view',
          'dispatch.view',
          'loads.view',
          'drivers.view'
        ],
        full: [
          'dashboard.view',
          'dispatch.access',
          'dispatch.create-load',
          'dispatch.assign-drivers',
          'loads.manage',
          'drivers.manage',
          'communication.access'
        ]
      },
      'Broker Agent': {
        initial: [
          'dashboard.view',
          'broker.view',
          'customers.view',
          'rates.view'
        ],
        full: [
          'dashboard.view',
          'broker.access',
          'broker.create-load',
          'broker.rate-negotiation',
          'customers.manage',
          'rates.manage',
          'communication.access'
        ]
      }
    }

    return permissions[role] || { initial: [], full: [] }
  }

  /**
   * Get required training for user role
   */
  private static getRequiredTraining(role: string): string[] {
    const trainingMap = {
      'Dispatcher': [
        'dispatch_fundamentals',
        'load_management',
        'driver_communication',
        'safety_protocols',
        'system_navigation'
      ],
      'Broker Agent': [
        'broker_fundamentals',
        'rate_negotiation',
        'customer_relations',
        'contract_management',
        'system_navigation'
      ]
    }

    return trainingMap[role] || []
  }

  /**
   * Generate unique session ID
   */
  private static generateSessionId(): string {
    return `CWS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  /**
   * Generate unique signature ID
   */
  private static generateSignatureId(): string {
    return `SIG-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  /**
   * Send notification
   */
  private static async sendNotification(session: ContractorWorkflowSession, notification: {
    type: 'email' | 'sms' | 'system';
    message: string;
  }): Promise<void> {
    const notificationRecord = {
      id: `NOT-${Date.now()}`,
      ...notification,
      sentAt: new Date(),
      delivered: true // Simulate successful delivery
    }

    session.notifications.push(notificationRecord)
    
    // In a real implementation, this would send actual notifications
    console.info(`📧 Notification sent (${notification.type}): ${notification.message}`)
  }

  /**
   * Get all active sessions (mock implementation)
   */
  private static async getAllActiveSessions(): Promise<ContractorWorkflowSession[]> {
    // In a real implementation, this would fetch from database
    return []
  }

  /**
   * Generate contractor agreement document
   */
  private static async generateContractorAgreement(userData: ContractorWorkflowTrigger['userData']): Promise<string> {
    // This would use the existing template system
    return `<html>Contractor Agreement for ${userData.firstName} ${userData.lastName}</html>`
  }

  /**
   * Generate NDA document
   */
  private static async generateNDA(userData: ContractorWorkflowTrigger['userData']): Promise<string> {
    // This would use the existing template system
    return `<html>NDA for ${userData.firstName} ${userData.lastName}</html>`
  }
}

export default ContractorWorkflowService 