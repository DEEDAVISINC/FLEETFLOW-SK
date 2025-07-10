// 🔄 FleetFlow Workflow Backend Service
// Integrates the workflow management system with Supabase backend
// Currently using mock implementation for development

import { WorkflowStep, LoadWorkflow, WorkflowStepId } from './workflowManager';

// Mock implementation for development
// In production, replace with actual Supabase client

interface DatabaseWorkflow {
  id: string;
  load_id: string;
  driver_id: string;
  dispatcher_id: string;
  current_step: number;
  status: string;
  created_at: string;
  updated_at: string;
}

interface DatabaseWorkflowStep {
  id: string;
  workflow_id: string;
  step_id: string;
  step_name: string;
  step_description: string;
  step_order: number;
  required: boolean;
  completed: boolean;
  completed_at: string | null;
  completed_by: string | null;
  allow_override: boolean;
  override_reason: string | null;
  override_by: string | null;
  override_at: string | null;
  step_data: any;
  created_at: string;
}

interface DatabaseWorkflowAction {
  id: string;
  workflow_id: string;
  step_id: string | null;
  action_type: string;
  action_description: string;
  performed_by: string;
  performed_at: string;
  action_data: any;
  metadata: any;
}

class WorkflowBackendService {
  // Mock storage for development
  private workflows: Map<string, any> = new Map();
  private workflowSteps: Map<string, any[]> = new Map();
  private workflowActions: Map<string, any[]> = new Map();

  /**
   * Create a new workflow in the database
   */
  async createWorkflow(loadId: string, driverId: string, dispatcherId: string): Promise<string> {
    try {
      const workflowId = `WF-${Date.now()}`;
      
      // Mock workflow record
      const workflow = {
        id: workflowId,
        load_id: loadId,
        driver_id: driverId,
        dispatcher_id: dispatcherId,
        current_step: 0,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      this.workflows.set(loadId, workflow);

      // Create mock workflow steps
      const workflowSteps = [
        {
          step_id: 'load_assignment_confirmation',
          step_name: 'Load Assignment Confirmation',
          step_description: 'Driver must confirm acceptance of assigned load',
          step_order: 0,
          required: true,
          completed: false,
          allow_override: false
        },
        {
          step_id: 'rate_confirmation_review',
          step_name: 'Rate Confirmation Review',
          step_description: 'Driver reviews and acknowledges rate confirmation',
          step_order: 1,
          required: true,
          completed: false,
          allow_override: false
        },
        // ... other steps would be here
      ];

      this.workflowSteps.set(workflowId, workflowSteps);
      this.workflowActions.set(workflowId, []);

      return workflowId;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }

  /**
   * Get workflow for a load
   */
  async getWorkflow(loadId: string): Promise<LoadWorkflow | null> {
    try {
      const workflow = this.workflows.get(loadId);
      if (!workflow) return null;

      const steps = this.workflowSteps.get(workflow.id) || [];

      // Convert database format to workflow format
      const workflowSteps: WorkflowStep[] = steps.map((step: any) => ({
        id: step.step_id,
        name: step.step_name,
        description: step.step_description,
        required: step.required,
        completed: step.completed,
        completedAt: step.completed_at,
        completedBy: step.completed_by,
        data: step.step_data,
        allowOverride: step.allow_override,
        overrideReason: step.override_reason,
        overrideBy: step.override_by
      }));

      return {
        loadId: workflow.load_id,
        driverId: workflow.driver_id,
        dispatcherId: workflow.dispatcher_id,
        currentStep: workflow.current_step,
        status: workflow.status as any,
        steps: workflowSteps,
        createdAt: workflow.created_at,
        updatedAt: workflow.updated_at
      };
    } catch (error) {
      console.error('Error getting workflow:', error);
      return null;
    }
  }

  /**
   * Complete a workflow step
   */
  async completeStep(
    loadId: string, 
    stepId: WorkflowStepId, 
    completedBy: string, 
    data?: any
  ): Promise<boolean> {
    try {
      const workflow = this.workflows.get(loadId);
      if (!workflow) return false;

      const steps = this.workflowSteps.get(workflow.id) || [];
      const stepIndex = steps.findIndex(step => step.step_id === stepId);
      
      if (stepIndex >= 0) {
        steps[stepIndex].completed = true;
        steps[stepIndex].completed_at = new Date().toISOString();
        steps[stepIndex].completed_by = completedBy;
        steps[stepIndex].step_data = data;
        
        this.workflowSteps.set(workflow.id, steps);
        
        // Update workflow current step
        workflow.current_step = stepIndex + 1;
        workflow.updated_at = new Date().toISOString();
        this.workflows.set(loadId, workflow);
      }

      return true;
    } catch (error) {
      console.error('Error completing step:', error);
      return false;
    }
  }

  /**
   * Request override for a step
   */
  async requestOverride(
    loadId: string, 
    stepId: WorkflowStepId, 
    reason: string, 
    requestedBy: string
  ): Promise<boolean> {
    try {
      const workflow = this.workflows.get(loadId);
      if (!workflow) return false;

      workflow.status = 'override_required';
      this.workflows.set(loadId, workflow);

      return true;
    } catch (error) {
      console.error('Error requesting override:', error);
      return false;
    }
  }

  /**
   * Upload photo/signature and associate with workflow step
   */
  async uploadStepDocument(
    loadId: string,
    stepId: WorkflowStepId,
    fileUrl: string,
    fileType: 'photo' | 'signature',
    uploadedBy: string,
    metadata?: any
  ): Promise<boolean> {
    try {
      // Mock implementation - in production this would save to database
      console.log('Document uploaded:', { loadId, stepId, fileType, fileUrl });
      return true;
    } catch (error) {
      console.error('Error uploading step document:', error);
      return false;
    }
  }

  /**
   * Get workflow actions (audit trail)
   */
  async getWorkflowActions(loadId: string): Promise<any[]> {
    try {
      const workflow = this.workflows.get(loadId);
      if (!workflow) return [];

      return this.workflowActions.get(workflow.id) || [];
    } catch (error) {
      console.error('Error getting workflow actions:', error);
      return [];
    }
  }

  /**
   * Get all workflows for a driver
   */
  async getDriverWorkflows(driverId: string): Promise<LoadWorkflow[]> {
    try {
      const workflows: LoadWorkflow[] = [];
      
      // Use Array.from to convert Map keys to array for ES5 compatibility
      const loadIds = Array.from(this.workflows.keys());
      for (const loadId of loadIds) {
        const workflow = this.workflows.get(loadId);
        if (workflow && workflow.driver_id === driverId) {
          const steps = this.workflowSteps.get(workflow.id) || [];
          const workflowSteps: WorkflowStep[] = steps.map((step: any) => ({
            id: step.step_id,
            name: step.step_name,
            description: step.step_description,
            required: step.required,
            completed: step.completed,
            completedAt: step.completed_at,
            completedBy: step.completed_by,
            data: step.step_data,
            allowOverride: step.allow_override,
            overrideReason: step.override_reason,
            overrideBy: step.override_by
          }));

          workflows.push({
            loadId: workflow.load_id,
            driverId: workflow.driver_id,
            dispatcherId: workflow.dispatcher_id,
            currentStep: workflow.current_step,
            status: workflow.status,
            steps: workflowSteps,
            createdAt: workflow.created_at,
            updatedAt: workflow.updated_at
          });
        }
      }

      return workflows;
    } catch (error) {
      console.error('Error getting driver workflows:', error);
      return [];
    }
  }
}

export const workflowBackendService = new WorkflowBackendService();
export default workflowBackendService;
