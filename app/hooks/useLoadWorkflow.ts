'use client';

import { useEffect, useState } from 'react';
import type {
  LoadWorkflow,
  WorkflowStep,
  WorkflowStepId,
} from '../../lib/workflowManager';
import { workflowManager } from '../../lib/workflowManager';

export function useLoadWorkflow(loadId: string) {
  const [workflow, setWorkflow] = useState<LoadWorkflow | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [availableSteps, setAvailableSteps] = useState<WorkflowStep[]>([]);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const loadWorkflow = workflowManager.getWorkflow(loadId);
    setWorkflow(loadWorkflow);

    if (loadWorkflow) {
      setCurrentStep(workflowManager.getCurrentStep(loadId));
      setAvailableSteps(workflowManager.getAvailableSteps(loadId));
      setProgress(workflowManager.getWorkflowProgress(loadId));
    }
  }, [loadId]);

  const completeStep = async (
    stepId: WorkflowStepId,
    data?: any,
    completedBy?: string
  ) => {
    const result = await workflowManager.completeStep(
      loadId,
      stepId,
      data,
      completedBy
    );

    if (result.success && result.workflow) {
      setWorkflow(result.workflow);
      setCurrentStep(workflowManager.getCurrentStep(loadId));
      setAvailableSteps(workflowManager.getAvailableSteps(loadId));
      setProgress(workflowManager.getWorkflowProgress(loadId));
    }

    return result;
  };

  const canCompleteStep = (stepId: WorkflowStepId) => {
    return workflowManager.canCompleteStep(loadId, stepId);
  };

  const resetWorkflowTo = (stepId: WorkflowStepId) => {
    const result = workflowManager.resetWorkflowTo(loadId, stepId);
    if (result.success && result.workflow) {
      setWorkflow(result.workflow);
      setCurrentStep(workflowManager.getCurrentStep(loadId));
      setAvailableSteps(workflowManager.getAvailableSteps(loadId));
      setProgress(workflowManager.getWorkflowProgress(loadId));
    }
    return result;
  };

  return {
    workflow,
    currentStep,
    availableSteps,
    progress,
    completeStep,
    canCompleteStep,
    resetWorkflowTo,
  };
}
