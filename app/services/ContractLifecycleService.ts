// Automated Contract Lifecycle Management Service
// Handles automated contract workflows, renewals, amendments, and compliance

import { FleetFlowAI } from './ai';
import { DocumentFlowService } from './document-flow-service';
import { smsService } from './sms';
import {
  vendorManagementService,
  type Vendor,
  type VendorContract,
} from './VendorManagementService';

export interface ContractWorkflow {
  id: string;
  contractId: string;
  vendorId: string;
  workflowType: ContractWorkflowType;
  status: WorkflowStatus;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  steps: WorkflowStep[];
  currentStepIndex: number;
  metadata: {
    initiatedBy: string;
    initiatedAt: string;
    dueDate: string;
    estimatedCompletion: string;
    stakeholders: string[];
    requiredApprovals: string[];
    documents: string[];
  };
  communications: WorkflowCommunication[];
  automationRules: AutomationRule[];
  complianceChecks: ComplianceCheck[];
  createdAt: string;
  updatedAt: string;
}

export type ContractWorkflowType =
  | 'renewal_initiation'
  | 'renewal_negotiation'
  | 'amendment_request'
  | 'performance_review'
  | 'compliance_audit'
  | 'termination_process'
  | 'renegotiation'
  | 'emergency_review';

export type WorkflowStatus =
  | 'pending'
  | 'in_progress'
  | 'waiting_approval'
  | 'waiting_signature'
  | 'completed'
  | 'cancelled'
  | 'overdue';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  type: StepType;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';
  assignedTo: string[];
  dueDate: string;
  estimatedDuration: number; // hours
  dependencies: string[]; // other step IDs
  automatable: boolean;
  completionCriteria: string[];
  outputs: StepOutput[];
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type StepType =
  | 'document_generation'
  | 'legal_review'
  | 'stakeholder_approval'
  | 'vendor_negotiation'
  | 'compliance_verification'
  | 'signature_collection'
  | 'system_integration'
  | 'notification'
  | 'performance_analysis';

export interface StepOutput {
  type: 'document' | 'approval' | 'data' | 'decision';
  name: string;
  value: any;
  timestamp: string;
}

export interface WorkflowCommunication {
  id: string;
  type: 'email' | 'sms' | 'notification' | 'meeting';
  recipient: string;
  subject: string;
  content: string;
  status: 'sent' | 'delivered' | 'read' | 'responded' | 'failed';
  sentAt: string;
  response?: string;
  responseAt?: string;
}

export interface AutomationRule {
  id: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

export interface ComplianceCheck {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'passed' | 'failed' | 'warning';
  result?: string;
  checkedAt?: string;
  nextCheck?: string;
}

export interface ContractAnalytics {
  contractId: string;
  performanceScore: number;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  costEfficiency: number;
  renewalRecommendation: 'renew' | 'renegotiate' | 'terminate';
  keyFindings: string[];
  improvementAreas: string[];
  benchmarkComparison: {
    industryAverage: number;
    peerComparison: number;
    historicalTrend: number;
  };
  projectedSavings: number;
  lastAnalysis: string;
}

export interface RenewalRecommendation {
  contractId: string;
  vendorId: string;
  recommendation:
    | 'auto_renew'
    | 'negotiate_terms'
    | 'seek_alternatives'
    | 'terminate';
  confidence: number; // 0-100
  reasoning: string[];
  suggestedTerms?: {
    priceAdjustment: number; // percentage
    termLength: number; // months
    performanceRequirements: string[];
    additionalServices: string[];
    riskMitigations: string[];
  };
  alternativeVendors?: Array<{
    id: string;
    name: string;
    estimatedCost: number;
    riskScore: number;
  }>;
  estimatedImpact: {
    costSavings: number;
    riskReduction: number;
    performanceImprovement: number;
  };
}

export class ContractLifecycleService {
  private static instance: ContractLifecycleService;
  private workflows: Map<string, ContractWorkflow> = new Map();
  private analytics: Map<string, ContractAnalytics> = new Map();
  private aiService: FleetFlowAI;
  private documentService: DocumentFlowService;

  private constructor() {
    this.aiService = new FleetFlowAI();
    this.documentService = new DocumentFlowService();
    this.initializeAutomatedWorkflows();
  }

  public static getInstance(): ContractLifecycleService {
    if (!ContractLifecycleService.instance) {
      ContractLifecycleService.instance = new ContractLifecycleService();
    }
    return ContractLifecycleService.instance;
  }

  private initializeAutomatedWorkflows(): void {
    // Set up automated contract monitoring
    this.scheduleContractMonitoring();
    this.initializeRenewalWorkflows();
    // DISABLED: Performance reviews causing console spam
    // this.setupPerformanceReviews();
  }

  // ========================================
  // AUTOMATED RENEWAL MANAGEMENT
  // ========================================

  private initializeRenewalWorkflows(): void {
    const vendors = vendorManagementService.getAllVendors();

    vendors.forEach((vendor) => {
      const contract = vendor.contract;
      const daysUntilExpiry = Math.ceil(
        (new Date(contract.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      // Trigger renewal workflow at different intervals
      if (daysUntilExpiry <= 120 && daysUntilExpiry > 90) {
        this.initiateRenewalWorkflow(vendor, 'early_planning');
      } else if (daysUntilExpiry <= 90 && daysUntilExpiry > 60) {
        this.initiateRenewalWorkflow(vendor, 'negotiation_phase');
      } else if (daysUntilExpiry <= 60 && daysUntilExpiry > 30) {
        this.initiateRenewalWorkflow(vendor, 'urgent_decision');
      } else if (daysUntilExpiry <= 30) {
        this.initiateRenewalWorkflow(vendor, 'emergency_renewal');
      }
    });
  }

  public async initiateRenewalWorkflow(
    vendor: Vendor,
    urgencyLevel:
      | 'early_planning'
      | 'negotiation_phase'
      | 'urgent_decision'
      | 'emergency_renewal'
  ): Promise<ContractWorkflow> {
    const workflowId = `renewal-${vendor.id}-${Date.now()}`;
    const contract = vendor.contract;

    // Generate AI-powered renewal recommendation
    const recommendation = await this.generateRenewalRecommendation(vendor);

    const workflow: ContractWorkflow = {
      id: workflowId,
      contractId: contract.id,
      vendorId: vendor.id,
      workflowType: 'renewal_initiation',
      status: 'pending',
      priority: this.getPriorityFromUrgency(urgencyLevel),
      steps: this.generateRenewalSteps(vendor, recommendation, urgencyLevel),
      currentStepIndex: 0,
      metadata: {
        initiatedBy: 'system',
        initiatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedCompletion: this.calculateEstimatedCompletion(
          this.generateRenewalSteps(vendor, recommendation, urgencyLevel)
        ),
        stakeholders: [
          'procurement@fleetflow.com',
          'legal@fleetflow.com',
          vendor.contactInfo.email,
        ],
        requiredApprovals: ['procurement_manager', 'legal_counsel'],
        documents: [],
      },
      communications: [],
      automationRules: this.generateAutomationRules(recommendation),
      complianceChecks: this.generateComplianceChecks(contract),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.workflows.set(workflowId, workflow);
    await this.startWorkflowExecution(workflow);

    return workflow;
  }

  private async generateRenewalRecommendation(
    vendor: Vendor
  ): Promise<RenewalRecommendation> {
    try {
      const prompt = `
        Analyze this vendor contract for renewal recommendation:

        Vendor: ${JSON.stringify(vendor, null, 2)}

        Evaluate:
        - Performance metrics and trends
        - Cost efficiency vs alternatives
        - Risk factors and mitigation
        - Market conditions and pricing
        - Strategic value and alignment
        - Compliance and service quality

        Provide recommendation with:
        - Clear renewal decision (auto_renew/negotiate_terms/seek_alternatives/terminate)
        - Confidence score (0-100)
        - Detailed reasoning
        - Suggested contract terms if recommending negotiation
        - Alternative vendors if suggesting replacement
        - Estimated financial and operational impact

        Format as JSON with comprehensive analysis.
      `;

      const result = await this.aiService.generateDocument(
        prompt,
        'contract_analysis'
      );
      const analysis = JSON.parse(result);

      const recommendation: RenewalRecommendation = {
        contractId: vendor.contract.id,
        vendorId: vendor.id,
        recommendation: analysis.recommendation || 'negotiate_terms',
        confidence: analysis.confidence || 85,
        reasoning: analysis.reasoning || ['Performance analysis pending'],
        suggestedTerms: analysis.suggestedTerms,
        alternativeVendors: analysis.alternativeVendors,
        estimatedImpact: analysis.estimatedImpact || {
          costSavings: 0,
          riskReduction: 0,
          performanceImprovement: 0,
        },
      };

      return recommendation;
    } catch (error) {
      console.error('AI renewal recommendation failed:', error);

      // Fallback to basic analysis
      return this.generateBasicRenewalRecommendation(vendor);
    }
  }

  private generateBasicRenewalRecommendation(
    vendor: Vendor
  ): RenewalRecommendation {
    const performance = vendor.performance.overall.score;
    let recommendation: RenewalRecommendation['recommendation'] =
      'negotiate_terms';
    let confidence = 70;

    if (performance >= 95) {
      recommendation = 'auto_renew';
      confidence = 90;
    } else if (performance < 80) {
      recommendation = 'seek_alternatives';
      confidence = 85;
    } else if (performance < 70) {
      recommendation = 'terminate';
      confidence = 95;
    }

    return {
      contractId: vendor.contract.id,
      vendorId: vendor.id,
      recommendation,
      confidence,
      reasoning: [
        `Current performance score: ${performance}%`,
        `Cost efficiency: ${vendor.financials.savings.savingsPercent}%`,
        'Market analysis and benchmarking needed',
      ],
      estimatedImpact: {
        costSavings: vendor.financials.savings.totalSaved,
        riskReduction: performance >= 90 ? 10 : -5,
        performanceImprovement: performance >= 90 ? 5 : -10,
      },
    };
  }

  private generateRenewalSteps(
    vendor: Vendor,
    recommendation: RenewalRecommendation,
    urgencyLevel: string
  ): WorkflowStep[] {
    const baseSteps: Omit<WorkflowStep, 'id'>[] = [
      {
        name: 'Performance Analysis',
        description:
          'Analyze current vendor performance and contract compliance',
        type: 'performance_analysis',
        status: 'pending',
        assignedTo: ['system', 'procurement@fleetflow.com'],
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 8,
        dependencies: [],
        automatable: true,
        completionCriteria: [
          'Performance report generated',
          'Compliance verified',
        ],
        outputs: [],
      },
      {
        name: 'Renewal Recommendation Review',
        description: 'Review AI-generated renewal recommendation and validate',
        type: 'stakeholder_approval',
        status: 'pending',
        assignedTo: ['procurement@fleetflow.com'],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 4,
        dependencies: ['performance_analysis'],
        automatable: false,
        completionCriteria: ['Recommendation approved', 'Strategy confirmed'],
        outputs: [],
      },
    ];

    if (recommendation.recommendation === 'auto_renew') {
      baseSteps.push({
        name: 'Auto-Renewal Execution',
        description: 'Execute automatic contract renewal with current terms',
        type: 'system_integration',
        status: 'pending',
        assignedTo: ['system'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 1,
        dependencies: ['renewal_recommendation_review'],
        automatable: true,
        completionCriteria: ['Contract renewed', 'Systems updated'],
        outputs: [],
      });
    } else if (recommendation.recommendation === 'negotiate_terms') {
      baseSteps.push(
        {
          name: 'Negotiation Preparation',
          description: 'Prepare negotiation strategy and terms',
          type: 'document_generation',
          status: 'pending',
          assignedTo: ['legal@fleetflow.com', 'procurement@fleetflow.com'],
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDuration: 6,
          dependencies: ['renewal_recommendation_review'],
          automatable: false,
          completionCriteria: [
            'Negotiation strategy prepared',
            'Terms drafted',
          ],
          outputs: [],
        },
        {
          name: 'Vendor Negotiation',
          description: 'Conduct negotiations with vendor',
          type: 'vendor_negotiation',
          status: 'pending',
          assignedTo: ['procurement@fleetflow.com'],
          dueDate: new Date(
            Date.now() + 14 * 24 * 60 * 60 * 1000
          ).toISOString(),
          estimatedDuration: 16,
          dependencies: ['negotiation_preparation'],
          automatable: false,
          completionCriteria: ['Terms agreed', 'Contract drafted'],
          outputs: [],
        }
      );
    }

    // Add final steps
    baseSteps.push(
      {
        name: 'Legal Review',
        description: 'Legal review of contract terms',
        type: 'legal_review',
        status: 'pending',
        assignedTo: ['legal@fleetflow.com'],
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 8,
        dependencies: [],
        automatable: false,
        completionCriteria: ['Legal approval received'],
        outputs: [],
      },
      {
        name: 'Contract Execution',
        description: 'Execute final contract with digital signatures',
        type: 'signature_collection',
        status: 'pending',
        assignedTo: ['system', 'procurement@fleetflow.com'],
        dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDuration: 2,
        dependencies: ['legal_review'],
        automatable: true,
        completionCriteria: ['All parties signed', 'Contract active'],
        outputs: [],
      }
    );

    return baseSteps.map((step, index) => ({
      ...step,
      id: `step-${index + 1}`,
    }));
  }

  // ========================================
  // WORKFLOW EXECUTION ENGINE
  // ========================================

  public async startWorkflowExecution(
    workflow: ContractWorkflow
  ): Promise<void> {
    workflow.status = 'in_progress';
    workflow.updatedAt = new Date().toISOString();

    console.log(
      `🔄 Starting contract workflow: ${workflow.workflowType} for ${workflow.vendorId}`
    );

    // Start first step
    await this.executeNextStep(workflow);

    // Send initial notifications
    await this.sendWorkflowNotifications(workflow, 'initiated');
  }

  private async executeNextStep(workflow: ContractWorkflow): Promise<void> {
    if (workflow.currentStepIndex >= workflow.steps.length) {
      await this.completeWorkflow(workflow);
      return;
    }

    const currentStep = workflow.steps[workflow.currentStepIndex];

    // Check dependencies
    if (!this.areDependenciesMet(workflow, currentStep)) {
      console.log(`⏳ Dependencies not met for step: ${currentStep.name}`);
      return;
    }

    currentStep.status = 'in_progress';
    currentStep.startedAt = new Date().toISOString();

    console.log(`▶️ Executing step: ${currentStep.name}`);

    if (currentStep.automatable) {
      await this.executeAutomatableStep(workflow, currentStep);
    } else {
      await this.assignStepToUsers(workflow, currentStep);
    }

    workflow.updatedAt = new Date().toISOString();
    this.workflows.set(workflow.id, workflow);
  }

  private async executeAutomatableStep(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    try {
      switch (step.type) {
        case 'performance_analysis':
          await this.performAnalysis(workflow, step);
          break;
        case 'system_integration':
          await this.performSystemIntegration(workflow, step);
          break;
        case 'signature_collection':
          await this.initiateDigitalSignature(workflow, step);
          break;
        case 'notification':
          await this.sendStepNotifications(workflow, step);
          break;
        default:
          console.log(`⚠️ Unknown automatable step type: ${step.type}`);
      }

      await this.completeStep(workflow, step);
    } catch (error) {
      console.error(`❌ Step execution failed: ${step.name}`, error);
      step.status = 'failed';
      step.notes = error.message;
    }
  }

  private async performAnalysis(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    const vendor = vendorManagementService.getVendor(workflow.vendorId);
    if (!vendor) throw new Error('Vendor not found');

    // Generate comprehensive contract analytics
    const analytics = await this.generateContractAnalytics(
      vendor.contract,
      vendor
    );

    this.analytics.set(workflow.contractId, analytics);

    step.outputs.push({
      type: 'data',
      name: 'Performance Analysis Report',
      value: analytics,
      timestamp: new Date().toISOString(),
    });

    console.log(`📊 Performance analysis completed for ${vendor.name}`);
  }

  private async generateContractAnalytics(
    contract: VendorContract,
    vendor: Vendor
  ): Promise<ContractAnalytics> {
    const performance = vendor.performance.overall.score;
    const compliance =
      vendor.compliance.overall === 'compliant'
        ? 95
        : vendor.compliance.overall === 'minor_issues'
          ? 85
          : vendor.compliance.overall === 'major_issues'
            ? 70
            : 50;

    return {
      contractId: contract.id,
      performanceScore: performance,
      complianceScore: compliance,
      riskLevel: this.calculateRiskLevel(vendor),
      costEfficiency: vendor.financials.savings.savingsPercent,
      renewalRecommendation:
        performance >= 90
          ? 'renew'
          : performance >= 75
            ? 'renegotiate'
            : 'terminate',
      keyFindings: [
        `Performance: ${performance}% (${vendor.performance.overall.rating})`,
        `Compliance: ${compliance}%`,
        `Cost Savings: ${vendor.financials.savings.savingsPercent}%`,
        `Risk Level: ${this.calculateRiskLevel(vendor)}`,
      ],
      improvementAreas: this.identifyImprovementAreas(vendor),
      benchmarkComparison: {
        industryAverage: vendor.performance.benchmarking.industryAverage,
        peerComparison: vendor.performance.benchmarking.peerComparison,
        historicalTrend: this.calculateHistoricalTrend(vendor),
      },
      projectedSavings: vendor.financials.savings.totalSaved * 1.15,
      lastAnalysis: new Date().toISOString(),
    };
  }

  private calculateRiskLevel(vendor: Vendor): 'low' | 'medium' | 'high' {
    const riskFactors = [
      vendor.performance.overall.score < 80 ? 1 : 0,
      vendor.riskAssessment.overall === 'high'
        ? 2
        : vendor.riskAssessment.overall === 'medium'
          ? 1
          : 0,
      vendor.compliance.overall !== 'compliant' ? 1 : 0,
      vendor.financials.billing.overdueAmount > 0 ? 1 : 0,
    ];

    const totalRisk = riskFactors.reduce((sum, factor) => sum + factor, 0);

    if (totalRisk >= 3) return 'high';
    if (totalRisk >= 1) return 'medium';
    return 'low';
  }

  private identifyImprovementAreas(vendor: Vendor): string[] {
    const areas: string[] = [];

    if (vendor.performance.metrics.onTimeDelivery < 95) {
      areas.push('On-time delivery performance');
    }
    if (vendor.performance.metrics.qualityScore < 90) {
      areas.push('Service quality consistency');
    }
    if (vendor.performance.metrics.responseTime > 4) {
      areas.push('Response time optimization');
    }
    if (vendor.compliance.overall !== 'compliant') {
      areas.push('Regulatory compliance');
    }
    if (vendor.financials.savings.savingsPercent < 15) {
      areas.push('Cost optimization opportunities');
    }

    return areas;
  }

  private calculateHistoricalTrend(vendor: Vendor): number {
    const monthlyTrends = vendor.performance.trends.monthly;
    if (monthlyTrends.length < 2) return 0;

    const recent = monthlyTrends[monthlyTrends.length - 1].score;
    const previous = monthlyTrends[0].score;

    return ((recent - previous) / previous) * 100;
  }

  // ========================================
  // COMMUNICATION & NOTIFICATIONS
  // ========================================

  private async sendWorkflowNotifications(
    workflow: ContractWorkflow,
    event: 'initiated' | 'step_completed' | 'overdue' | 'completed'
  ): Promise<void> {
    const vendor = vendorManagementService.getVendor(workflow.vendorId);
    if (!vendor) return;

    const notifications = this.generateNotificationContent(
      workflow,
      vendor,
      event
    );

    for (const notification of notifications) {
      try {
        if (notification.type === 'email') {
          // In production, integrate with actual email service
          console.log(
            `📧 Email sent to ${notification.recipient}: ${notification.subject}`
          );
        } else if (notification.type === 'sms') {
          await smsService.sendSMS(
            notification.recipient,
            notification.content
          );
        }

        workflow.communications.push({
          ...notification,
          status: 'sent',
          sentAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to send notification:', error);
        workflow.communications.push({
          ...notification,
          status: 'failed',
          sentAt: new Date().toISOString(),
        });
      }
    }
  }

  private generateNotificationContent(
    workflow: ContractWorkflow,
    vendor: Vendor,
    event: string
  ): Omit<WorkflowCommunication, 'id' | 'status' | 'sentAt'>[] {
    const notifications: Omit<
      WorkflowCommunication,
      'id' | 'status' | 'sentAt'
    >[] = [];

    switch (event) {
      case 'initiated':
        notifications.push({
          type: 'email',
          recipient: 'procurement@fleetflow.com',
          subject: `Contract Renewal Workflow Initiated - ${vendor.name}`,
          content: `
            A new contract renewal workflow has been initiated for ${vendor.name}.

            Contract Details:
            - Contract ID: ${workflow.contractId}
            - Expiry Date: ${new Date(vendor.contract.endDate).toLocaleDateString()}
            - Current Performance: ${vendor.performance.overall.score}%
            - Priority: ${workflow.priority}

            Next Steps:
            - Review automated recommendations
            - Begin performance analysis
            - Prepare negotiation strategy if needed

            Dashboard: http://localhost:3003/vendor-management
          `,
        });
        break;

      case 'completed':
        notifications.push({
          type: 'email',
          recipient: 'procurement@fleetflow.com',
          subject: `Contract Workflow Completed - ${vendor.name}`,
          content: `
            Contract workflow has been completed for ${vendor.name}.

            Final Status: ${workflow.status}
            Completion Date: ${new Date().toLocaleDateString()}

            Please review the updated contract details in the vendor management system.
          `,
        });
        break;
    }

    return notifications.map((notification, index) => ({
      ...notification,
      id: `comm-${workflow.id}-${index}`,
    }));
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  private getPriorityFromUrgency(
    urgencyLevel:
      | 'early_planning'
      | 'negotiation_phase'
      | 'urgent_decision'
      | 'emergency_renewal'
  ): 'low' | 'medium' | 'high' | 'urgent' {
    switch (urgencyLevel) {
      case 'early_planning':
        return 'low';
      case 'negotiation_phase':
        return 'medium';
      case 'urgent_decision':
        return 'high';
      case 'emergency_renewal':
        return 'urgent';
      default:
        return 'medium';
    }
  }

  private calculateEstimatedCompletion(steps: WorkflowStep[]): string {
    const totalHours = steps.reduce(
      (sum, step) => sum + step.estimatedDuration,
      0
    );
    const businessDays = Math.ceil(totalHours / 8);
    const completionDate = new Date(
      Date.now() + businessDays * 24 * 60 * 60 * 1000
    );
    return completionDate.toISOString();
  }

  private generateAutomationRules(
    recommendation: RenewalRecommendation
  ): AutomationRule[] {
    return [
      {
        id: 'auto-approval',
        trigger: 'performance_analysis_complete',
        condition: `recommendation.confidence > 90 && recommendation.recommendation === 'auto_renew'`,
        action: 'auto_approve_renewal',
        enabled: true,
        parameters: { requiresManagerApproval: false },
      },
      {
        id: 'escalation',
        trigger: 'step_overdue',
        condition: 'step.dueDate < now() && step.priority === "urgent"',
        action: 'escalate_to_manager',
        enabled: true,
        parameters: { escalationLevel: 'manager' },
      },
    ];
  }

  private generateComplianceChecks(
    contract: VendorContract
  ): ComplianceCheck[] {
    return [
      {
        id: 'insurance-check',
        type: 'insurance_verification',
        description: 'Verify vendor insurance is current and adequate',
        status: 'pending',
      },
      {
        id: 'performance-sla',
        type: 'sla_compliance',
        description: 'Check SLA compliance over contract period',
        status: 'pending',
      },
      {
        id: 'financial-standing',
        type: 'financial_verification',
        description: 'Verify vendor financial stability',
        status: 'pending',
      },
    ];
  }

  private areDependenciesMet(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): boolean {
    return step.dependencies.every((depId) => {
      const depStep = workflow.steps.find((s) => s.id === depId);
      return depStep?.status === 'completed';
    });
  }

  private async assignStepToUsers(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    // Send assignment notifications to users
    for (const assignee of step.assignedTo) {
      console.log(`👤 Step "${step.name}" assigned to ${assignee}`);

      // In production, send actual assignment notifications
      workflow.communications.push({
        id: `assign-${step.id}-${assignee}`,
        type: 'email',
        recipient: assignee,
        subject: `Contract Workflow Task Assignment - ${step.name}`,
        content: `You have been assigned a contract workflow task: ${step.name}\n\nDescription: ${step.description}\n\nDue: ${new Date(step.dueDate).toLocaleDateString()}`,
        status: 'sent',
        sentAt: new Date().toISOString(),
      });
    }
  }

  private async completeStep(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    step.status = 'completed';
    step.completedAt = new Date().toISOString();
    workflow.currentStepIndex++;

    console.log(`✅ Step completed: ${step.name}`);

    // Continue to next step
    setTimeout(() => this.executeNextStep(workflow), 1000);
  }

  private async completeWorkflow(workflow: ContractWorkflow): Promise<void> {
    workflow.status = 'completed';
    workflow.updatedAt = new Date().toISOString();

    console.log(
      `🎉 Workflow completed: ${workflow.workflowType} for ${workflow.vendorId}`
    );

    await this.sendWorkflowNotifications(workflow, 'completed');
    this.workflows.set(workflow.id, workflow);
  }

  private async performSystemIntegration(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    // Simulate system integration tasks
    console.log(`🔗 Performing system integration for ${step.name}`);

    step.outputs.push({
      type: 'data',
      name: 'Integration Status',
      value: {
        status: 'completed',
        systems_updated: ['vendor_db', 'contract_management'],
      },
      timestamp: new Date().toISOString(),
    });
  }

  private async initiateDigitalSignature(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    // In production, integrate with DocuSign API
    console.log(
      `✍️ Initiating digital signature collection for contract ${workflow.contractId}`
    );

    step.outputs.push({
      type: 'document',
      name: 'Signature Request',
      value: {
        docusign_envelope_id: `env-${workflow.contractId}`,
        status: 'sent',
      },
      timestamp: new Date().toISOString(),
    });
  }

  private async sendStepNotifications(
    workflow: ContractWorkflow,
    step: WorkflowStep
  ): Promise<void> {
    console.log(`📢 Sending notifications for step: ${step.name}`);

    step.outputs.push({
      type: 'data',
      name: 'Notifications Sent',
      value: {
        recipients: step.assignedTo,
        notification_count: step.assignedTo.length,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private scheduleContractMonitoring(): void {
    // Set up periodic monitoring (every hour in production)
    setInterval(
      () => {
        this.monitorActiveContracts();
      },
      60 * 60 * 1000
    ); // 1 hour

    // Initial run
    setTimeout(() => this.monitorActiveContracts(), 5000);
  }

  private async monitorActiveContracts(): Promise<void> {
    console.log('🔍 Monitoring contract lifecycle events...');

    const vendors = vendorManagementService.getAllVendors();

    for (const vendor of vendors) {
      const daysUntilExpiry = Math.ceil(
        (new Date(vendor.contract.endDate).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      );

      // Check if we need to initiate workflows
      if (daysUntilExpiry <= 90 && daysUntilExpiry > 0) {
        const existingWorkflow = Array.from(this.workflows.values()).find(
          (w) =>
            w.vendorId === vendor.id && w.workflowType === 'renewal_initiation'
        );

        if (!existingWorkflow) {
          console.log(
            `⚠️ Contract expiring in ${daysUntilExpiry} days: ${vendor.name}`
          );
          await this.initiateRenewalWorkflow(
            vendor,
            this.getUrgencyFromDays(daysUntilExpiry)
          );
        }
      }
    }
  }

  private getUrgencyFromDays(
    days: number
  ):
    | 'early_planning'
    | 'negotiation_phase'
    | 'urgent_decision'
    | 'emergency_renewal' {
    if (days > 60) return 'early_planning';
    if (days > 30) return 'negotiation_phase';
    if (days > 15) return 'urgent_decision';
    return 'emergency_renewal';
  }

  private setupPerformanceReviews(): void {
    // TEMPORARILY DISABLED - Performance reviews were causing console spam
    console.log(
      '📊 Performance reviews scheduled for quarterly execution (currently disabled)'
    );
    // TODO: Re-enable with proper singleton pattern
    /*
    setInterval(
      () => {
        this.initiatePerformanceReviews();
      },
      90 * 24 * 60 * 60 * 1000
    ); // 90 days
    */
  }

  private async initiatePerformanceReviews(): Promise<void> {
    console.log('📊 Initiating quarterly performance reviews...');

    const vendors = vendorManagementService
      .getAllVendors()
      .filter((v) => v.status === 'active');

    for (const vendor of vendors) {
      // Generate performance review workflow
      const analytics = await this.generateContractAnalytics(
        vendor.contract,
        vendor
      );
      this.analytics.set(vendor.contract.id, analytics);

      console.log(
        `📈 Performance review completed for ${vendor.name}: ${analytics.performanceScore}%`
      );
    }
  }

  // ========================================
  // PUBLIC API METHODS
  // ========================================

  public getAllWorkflows(): ContractWorkflow[] {
    return Array.from(this.workflows.values());
  }

  public getWorkflowsByVendor(vendorId: string): ContractWorkflow[] {
    return Array.from(this.workflows.values()).filter(
      (w) => w.vendorId === vendorId
    );
  }

  public getActiveWorkflows(): ContractWorkflow[] {
    return Array.from(this.workflows.values()).filter(
      (w) => w.status === 'in_progress' || w.status === 'pending'
    );
  }

  public getContractAnalytics(contractId: string): ContractAnalytics | null {
    return this.analytics.get(contractId) || null;
  }

  public getAllContractAnalytics(): ContractAnalytics[] {
    return Array.from(this.analytics.values());
  }

  public getWorkflowSummary(): {
    total: number;
    active: number;
    completed: number;
    overdue: number;
    byType: Record<string, number>;
  } {
    const workflows = this.getAllWorkflows();

    const summary = {
      total: workflows.length,
      active: workflows.filter((w) => w.status === 'in_progress').length,
      completed: workflows.filter((w) => w.status === 'completed').length,
      overdue: workflows.filter((w) => w.status === 'overdue').length,
      byType: {} as Record<string, number>,
    };

    workflows.forEach((workflow) => {
      summary.byType[workflow.workflowType] =
        (summary.byType[workflow.workflowType] || 0) + 1;
    });

    return summary;
  }
}

// Export singleton instance
export const contractLifecycleService = ContractLifecycleService.getInstance();
