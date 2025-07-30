/**
 * AI Carrier Onboarding Trigger Service
 * Connects AI lead generation to carrier onboarding workflow
 * Automatically identifies owner operators needing dispatchers and starts onboarding
 */

import ServiceErrorHandler from '../utils/errorHandler';
import { dispatcherAssignmentService } from './DispatcherAssignmentService';
import { LeadProspect, leadGenerationService } from './LeadGenerationService';
import {
  FMCSAVerificationData,
  OnboardingIntegrationService,
} from './onboarding-integration';

export interface AICarrierOnboardingData {
  carrierId: string;
  aiGeneratedLead: LeadProspect;
  prePopulatedData: {
    verification: Partial<FMCSAVerificationData>;
    carrierInfo: {
      companyName: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      address: string;
      estimatedFleetSize: number;
      equipmentType: string;
    };
  };
  needsDispatcher: boolean;
  aiConfidence: number;
  source: string;
  tenantId: string;
  status:
    | 'ai_initiated'
    | 'onboarding_started'
    | 'onboarding_completed'
    | 'dispatcher_assigned';
  createdAt: Date;
}

export class AICarrierOnboardingTrigger {
  private onboardingService: OnboardingIntegrationService;
  private aiInitiatedOnboardings: Map<string, AICarrierOnboardingData> =
    new Map();

  constructor() {
    this.onboardingService = OnboardingIntegrationService.getInstance();
  }

  /**
   * MAIN METHOD: Process AI leads and automatically start onboarding
   */
  async processAILeadsAndStartOnboarding(): Promise<void> {
    await ServiceErrorHandler.handleAsyncOperation(
      async () => {
        // console.log('🤖 AI processing leads and starting carrier onboarding...');

        try {
          // Get AI-generated leads for owner operators
          const aiLeads = await this.safeGenerateAILeads();
          if (!aiLeads) {
            console.warn('⚠️ Failed to generate AI leads, skipping onboarding');
            return;
          }

          // Filter for carriers needing dispatcher services
          const carrierLeads =
            this.identifyCarrierLeadsNeedingDispatchers(aiLeads);

          // console.log(`🎯 Found ${carrierLeads.length} AI leads needing dispatchers`);

          // Start onboarding for each qualified lead
          const onboardingPromises = carrierLeads.map((lead) =>
            this.safeInitiateAICarrierOnboarding(lead)
          );

          // Wait for all onboarding processes to complete or fail gracefully
          const results = await Promise.allSettled(onboardingPromises);

          const successful = results.filter(
            (r) => r.status === 'fulfilled' && r.value !== null
          ).length;
          const failed = results.length - successful;

          if (failed > 0) {
            console.warn(
              `⚠️ ${failed} onboarding processes failed out of ${results.length}`
            );
          }

          // console.log(`✅ Started onboarding for ${successful} AI-generated carriers`);
          return undefined; // Explicit void return
        } catch (error) {
          console.error('❌ AI onboarding trigger failed:', error);
          throw error; // Re-throw to be handled by ServiceErrorHandler
        }
      },
      'AICarrierOnboardingTrigger',
      'processAILeadsAndStartOnboarding'
    );
  }

  /**
   * Safe wrapper for AI lead generation
   */
  private async safeGenerateAILeads(): Promise<LeadProspect[] | null> {
    try {
      return await leadGenerationService.generateAILeads({
        industry: ['transportation', 'owner_operator'],
        revenueRange: { min: 100000, max: 2000000 }, // $100K-$2M (owner operators)
        freightNeed: 'high',
      });
    } catch (error) {
      console.error('❌ Failed to generate AI leads:', error);
      return null;
    }
  }

  /**
   * Safe wrapper for initiating AI carrier onboarding
   */
  private async safeInitiateAICarrierOnboarding(
    lead: LeadProspect
  ): Promise<string | null> {
    try {
      return await this.initiateAICarrierOnboarding(lead);
    } catch (error) {
      console.error(
        `❌ Failed to initiate onboarding for ${lead.companyName}:`,
        error
      );
      return null;
    }
  }

  /**
   * Identify which AI leads are carriers needing dispatchers
   */
  private identifyCarrierLeadsNeedingDispatchers(
    leads: LeadProspect[]
  ): LeadProspect[] {
    try {
      return leads.filter((lead) => {
        // AI criteria for carriers needing dispatchers
        const isSmallFleet =
          lead.businessIntel.employeeCount.includes('1-') ||
          lead.businessIntel.employeeCount.includes('2-') ||
          lead.businessIntel.employeeCount.includes('3-');

        const isTransportation =
          lead.businessIntel.industryCode.includes('TRANSPORT') ||
          lead.businessIntel.industryCode.includes('TRUCKING') ||
          lead.businessIntel.industryCode.includes('CARRIER');

        const highConfidence = lead.aiConfidence > 75;
        const goodScore = lead.leadScore > 70;

        return isSmallFleet && isTransportation && highConfidence && goodScore;
      });
    } catch (error) {
      console.error('❌ Error filtering carrier leads:', error);
      return []; // Return empty array on error
    }
  }

  /**
   * Start the actual onboarding workflow with AI-populated data
   */
  async initiateAICarrierOnboarding(
    lead: LeadProspect
  ): Promise<string | null> {
    return ServiceErrorHandler.handleAsyncOperation(
      async () => {
        const carrierId = `AI-CARRIER-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        // console.log(
        //   `🚛 Starting AI onboarding for: ${lead.companyName} (${carrierId})`
        // );

        // Create AI onboarding record
        const aiOnboardingData: AICarrierOnboardingData = {
          carrierId,
          aiGeneratedLead: lead,
          prePopulatedData: {
            verification: {
              legalName: lead.companyName,
              physicalAddress: lead.contactInfo.address,
              phone: lead.contactInfo.phone || '+1 (555) 000-0000',
              email:
                lead.contactInfo.email ||
                `contact@${lead.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
              equipmentTypes: [this.determineEquipmentType(lead)],
              verified: false,
              verificationDate: '',
              mcNumber: '', // Will be collected during onboarding
              dotNumber: '', // Will be collected during onboarding
              safetyRating: 'PENDING',
            },
            carrierInfo: {
              companyName: lead.companyName,
              contactName: this.extractContactName(lead.companyName),
              contactEmail:
                lead.contactInfo.email ||
                `contact@${lead.companyName.toLowerCase().replace(/\s+/g, '')}.com`,
              contactPhone: lead.contactInfo.phone || '+1 (555) 000-0000',
              address: lead.contactInfo.address,
              estimatedFleetSize: this.estimateFleetSize(
                lead.businessIntel.employeeCount
              ),
              equipmentType: this.determineEquipmentType(lead),
            },
          },
          needsDispatcher: true,
          aiConfidence: lead.aiConfidence,
          source: lead.source,
          tenantId: 'tenant-demo-123',
          status: 'ai_initiated',
          createdAt: new Date(),
        };

        // Store AI onboarding data
        this.aiInitiatedOnboardings.set(carrierId, aiOnboardingData);

        // Create onboarding workflow data structure that matches existing system
        const workflowInitData =
          await this.createWorkflowInitData(aiOnboardingData);

        // Start the onboarding workflow programmatically
        const onboardingResult =
          await this.startOnboardingWorkflow(workflowInitData);

        if (onboardingResult.success) {
          // Update status
          aiOnboardingData.status = 'onboarding_started';
          this.aiInitiatedOnboardings.set(carrierId, aiOnboardingData);

          // console.log(`✅ Onboarding workflow started for ${lead.companyName}`);
          return carrierId;
        } else {
          console.error(
            `❌ Failed to start onboarding for ${lead.companyName}: ${onboardingResult.message}`
          );
          return null;
        }
      },
      'AICarrierOnboardingTrigger',
      'initiateAICarrierOnboarding'
    );
  }

  /**
   * Create workflow initialization data from AI lead
   */
  private async createWorkflowInitData(
    aiData: AICarrierOnboardingData
  ): Promise<any> {
    return {
      carrierId: aiData.carrierId,
      aiGenerated: true,
      aiSource: aiData.source,
      aiConfidence: aiData.aiConfidence,
      needsDispatcher: aiData.needsDispatcher,
      prePopulatedData: aiData.prePopulatedData,
      status: 'pending_start',
      metadata: {
        originalLead: aiData.aiGeneratedLead,
        initiatedBy: 'AI_SYSTEM',
        initiatedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Programmatically start the onboarding workflow
   */
  private async startOnboardingWorkflow(
    workflowInitData: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      // console.log('🔄 Starting onboarding workflow with AI data...');

      // Use the onboarding integration service to start the workflow
      const result =
        await this.onboardingService.initiateAICarrierOnboarding(
          workflowInitData
        );

      return {
        success: result.success,
        message: result.message,
      };
    } catch (error) {
      console.error('Failed to start onboarding workflow:', error);
      return {
        success: false,
        message: 'Failed to start onboarding workflow',
      };
    }
  }

  /**
   * Handle onboarding completion and trigger management notification
   */
  async handleOnboardingCompletion(
    carrierId: string,
    onboardingRecord: any
  ): Promise<void> {
    await ServiceErrorHandler.handleAsyncOperation(
      async () => {
        const aiOnboardingData = this.aiInitiatedOnboardings.get(carrierId);

        if (!aiOnboardingData) {
          console.warn(`No AI onboarding data found for carrier: ${carrierId}`);
          return;
        }

        // console.log(
        //   `🎉 AI-initiated onboarding completed for: ${aiOnboardingData.prePopulatedData.carrierInfo.companyName}`
        // );

        // Update status
        aiOnboardingData.status = 'onboarding_completed';
        this.aiInitiatedOnboardings.set(carrierId, aiOnboardingData);

        // Send management notification for dispatcher assignment
        try {
          await dispatcherAssignmentService.notifyManagementDispatcherNeeded({
            carrierId,
            carrierName:
              aiOnboardingData.prePopulatedData.carrierInfo.companyName,
            aiSource: aiOnboardingData.source,
            leadScore: aiOnboardingData.aiGeneratedLead.leadScore,
            aiConfidence: aiOnboardingData.aiConfidence,
            equipmentType:
              aiOnboardingData.prePopulatedData.carrierInfo.equipmentType,
            fleetSize:
              aiOnboardingData.prePopulatedData.carrierInfo.estimatedFleetSize,
            onboardingStarted: aiOnboardingData.createdAt,
            priority: aiOnboardingData.aiConfidence > 85 ? 'high' : 'medium',
          });

          // console.log(
          //   `✅ Management notified - DISPATCHER NEEDED for ${aiOnboardingData.prePopulatedData.carrierInfo.companyName}`
          // );
        } catch (notificationError) {
          console.error(
            '❌ Failed to send management notification:',
            notificationError
          );
          // Don't throw here, as the onboarding completion itself was successful
        }

        return undefined; // Explicit void return
      },
      'AICarrierOnboardingTrigger',
      'handleOnboardingCompletion'
    );
  }

  // Helper methods
  private extractContactName(companyName: string): string {
    // Simple extraction - in production would be more sophisticated
    const words = companyName.split(' ');
    return words.slice(0, 2).join(' '); // Take first two words as potential name
  }

  private estimateFleetSize(employeeCount: string): number {
    if (employeeCount.includes('1-')) return 1;
    if (employeeCount.includes('2-')) return 2;
    if (employeeCount.includes('3-')) return 3;
    if (employeeCount.includes('5-')) return 5;
    return 1; // Default owner operator
  }

  private determineEquipmentType(lead: LeadProspect): string {
    const industryCode = lead.businessIntel.industryCode.toLowerCase();
    if (industryCode.includes('refrigerated') || industryCode.includes('food'))
      return 'reefer';
    if (industryCode.includes('construction') || industryCode.includes('steel'))
      return 'flatbed';
    if (industryCode.includes('auto') || industryCode.includes('vehicle'))
      return 'car_hauler';
    return 'dry_van'; // Default
  }

  /**
   * Get AI-initiated onboardings for management dashboard
   */
  getAIInitiatedOnboardings(): AICarrierOnboardingData[] {
    return Array.from(this.aiInitiatedOnboardings.values());
  }

  /**
   * Get onboarding by carrier ID
   */
  getAIOnboardingByCarrierId(
    carrierId: string
  ): AICarrierOnboardingData | undefined {
    return this.aiInitiatedOnboardings.get(carrierId);
  }
}

export const aiCarrierOnboardingTrigger = new AICarrierOnboardingTrigger();
