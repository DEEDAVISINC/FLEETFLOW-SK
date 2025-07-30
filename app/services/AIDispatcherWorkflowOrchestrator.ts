/**
 * AI Dispatcher Workflow Orchestrator
 * Orchestrates the complete AI lead → onboarding → dispatcher assignment → contract workflow
 */

import { aiCarrierOnboardingTrigger } from './AICarrierOnboardingTrigger';
import { dispatcherAssignmentService } from './DispatcherAssignmentService';

export class AIDispatcherWorkflowOrchestrator {
  /**
   * Complete AI → Onboarding → Assignment → Contract workflow
   */
  async executeCompleteWorkflow(): Promise<void> {
    console.log('🔄 Starting AI Dispatcher Assignment Workflow...');

    try {
      // Step 1: Process AI-generated carrier leads and start onboarding
      await aiCarrierOnboardingTrigger.processAILeadsAndStartOnboarding();

      console.log('✅ AI Dispatcher Workflow completed successfully');
    } catch (error) {
      console.error('❌ AI Dispatcher Workflow failed:', error);
    }
  }

  /**
   * Handle management dispatcher assignment
   */
  async handleDispatcherAssignment(
    carrierId: string,
    carrierName: string,
    dispatcherId: string,
    dispatcherName: string,
    dispatcherCompany: string,
    assignedBy: string,
    aiSource: string
  ): Promise<string> {
    return await dispatcherAssignmentService.assignCarrierToDispatcher(
      carrierId,
      carrierName,
      dispatcherId,
      dispatcherName,
      dispatcherCompany,
      assignedBy,
      aiSource
    );
  }

  /**
   * Handle dispatcher acceptance
   */
  async handleDispatcherAcceptance(assignmentId: string): Promise<void> {
    await dispatcherAssignmentService.dispatcherAcceptsAssignment(assignmentId);
  }

  /**
   * Get workflow status and statistics
   */
  async getWorkflowStatus(): Promise<{
    aiOnboardings: any[];
    pendingAssignments: any[];
    activeAssignments: any[];
    stats: {
      totalOnboardings: number;
      pendingAssignments: number;
      activeContracts: number;
    };
  }> {
    const aiOnboardings =
      aiCarrierOnboardingTrigger.getAIInitiatedOnboardings();
    const pendingAssignments =
      dispatcherAssignmentService.getPendingAssignments();
    const activeAssignments =
      dispatcherAssignmentService.getActiveAssignments();

    return {
      aiOnboardings,
      pendingAssignments,
      activeAssignments,
      stats: {
        totalOnboardings: aiOnboardings.length,
        pendingAssignments: pendingAssignments.length,
        activeContracts: activeAssignments.length,
      },
    };
  }

  /**
   * Demo method to showcase the complete workflow
   */
  async runCompleteDemo(): Promise<void> {
    console.log('🎬 Starting AI Dispatcher Workflow Demo...');

    try {
      // 1. Trigger AI lead generation and onboarding
      console.log('🤖 Step 1: AI processing leads...');
      await this.executeCompleteWorkflow();

      // 2. Simulate management assignment (in real system, management would do this via UI)
      console.log('👨‍💼 Step 2: Simulating management assignment...');
      const assignmentId = await this.handleDispatcherAssignment(
        'AI-CARRIER-DEMO-001',
        'Demo Trucking LLC',
        'DISP-001',
        'John Dispatcher',
        'Dispatch Pro Services',
        'Manager Demo',
        'AI-Enhanced FMCSA Analysis'
      );

      // 3. Simulate dispatcher acceptance
      console.log('✅ Step 3: Simulating dispatcher acceptance...');
      await this.handleDispatcherAcceptance(assignmentId);

      // 4. Show final status
      const status = await this.getWorkflowStatus();
      console.log('📊 Workflow Status:', status);

      console.log(
        '🎉 Complete AI Dispatcher Workflow Demo finished successfully!'
      );
    } catch (error) {
      console.error('❌ Demo failed:', error);
    }
  }
}

export const aiDispatcherWorkflowOrchestrator =
  new AIDispatcherWorkflowOrchestrator();
