'use client';

// React hook for workflow management - client-side only
import { useEffect, useState } from 'react';
import {
  LoadWorkflow,
  WorkflowStep,
  WorkflowStepId,
  workflowManager,
} from './workflowManager';

export interface UseLoadWorkflowReturn {
  workflow: LoadWorkflow | null;
  currentStep: WorkflowStep | null;
  availableSteps: WorkflowStep[];
  progress: number;
  completeStep: (
    stepId: WorkflowStepId,
    data: any,
    userId: string
  ) => Promise<{ success: boolean; error?: string }>;
  canCompleteStep: (stepId: WorkflowStepId) => {
    allowed: boolean;
    reason?: string;
  };
}

export const useLoadWorkflow = (loadId: string): UseLoadWorkflowReturn => {
  const [workflow, setWorkflow] = useState<LoadWorkflow | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [availableSteps, setAvailableSteps] = useState<WorkflowStep[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Load workflow data
    const workflowData = workflowManager.getWorkflow(loadId);
    setWorkflow(workflowData);

    if (workflowData) {
      // Set current step
      const current = workflowData.steps[workflowData.currentStep];
      setCurrentStep(current);

      // Set available steps (current and any unlocked steps)
      const available = workflowData.steps.filter((step, index) => {
        return index <= workflowData.currentStep || step.completed;
      });
      setAvailableSteps(available);

      // Calculate progress
      const completedSteps = workflowData.steps.filter(
        (step) => step.completed
      ).length;
      const progressPercent = Math.round(
        (completedSteps / workflowData.steps.length) * 100
      );
      setProgress(progressPercent);
    }
  }, [loadId]);

  const completeStep = async (
    stepId: WorkflowStepId,
    data: any,
    userId: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await workflowManager.completeStep(
        loadId,
        stepId,
        data,
        userId
      );

      // Refresh workflow state
      const updatedWorkflow = workflowManager.getWorkflow(loadId);
      if (updatedWorkflow) {
        setWorkflow(updatedWorkflow);

        const current = updatedWorkflow.steps[updatedWorkflow.currentStep];
        setCurrentStep(current);

        const available = updatedWorkflow.steps.filter((step, index) => {
          return index <= updatedWorkflow.currentStep || step.completed;
        });
        setAvailableSteps(available);

        const completedSteps = updatedWorkflow.steps.filter(
          (step) => step.completed
        ).length;
        const progressPercent = Math.round(
          (completedSteps / updatedWorkflow.steps.length) * 100
        );
        setProgress(progressPercent);
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  };

  const canCompleteStep = (
    stepId: WorkflowStepId
  ): { allowed: boolean; reason?: string } => {
    return workflowManager.canCompleteStep(loadId, stepId);
  };

  return {
    workflow,
    currentStep,
    availableSteps,
    progress,
    completeStep,
    canCompleteStep,
  };
};



