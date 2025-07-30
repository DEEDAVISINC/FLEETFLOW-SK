// 🔄 FleetFlow Workflow Management System
// Handles step-by-step validation and flow control for driver operations
// Now integrated with Supabase backend for persistence and audit trail
// ✨ Enhanced with EDI Integration for automated B2B communications

import { workflowBackendService } from './workflowBackendService';
import { ediService, EDI214Data, EDI204Data } from './ediService';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
  data?: any;
  allowOverride?: boolean;
  overrideReason?: string;
  overrideBy?: string;
}

export interface LoadWorkflow {
  loadId: string;
  driverId: string;
  dispatcherId: string;
  currentStep: number;
  status: 'pending' | 'in_progress' | 'completed' | 'override_required';
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export type WorkflowStepId = 
  | 'load_assignment_confirmation'
  | 'rate_confirmation_review'
  | 'rate_confirmation_verification'
  | 'bol_receipt_confirmation'
  | 'bol_verification'
  | 'pickup_authorization'
  | 'pickup_arrival'
  | 'pickup_completion'
  | 'transit_start'
  | 'transit_tracking'
  | 'delivery_arrival'
  | 'delivery_completion'
  | 'pod_submission';

class WorkflowManager {
  private workflows: Map<string, LoadWorkflow> = new Map();

  /**
   * Initialize a new load workflow
   */
  initializeLoadWorkflow(loadId: string, driverId: string, dispatcherId: string): LoadWorkflow {
    const workflow: LoadWorkflow = {
      loadId,
      driverId,
      dispatcherId,
      currentStep: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        {
          id: 'load_assignment_confirmation',
          name: 'Load Assignment Confirmation',
          description: 'Driver must confirm receipt and acceptance of load assignment',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'rate_confirmation_review',
          name: 'Rate Confirmation Review',
          description: 'Driver reviews rate confirmation document',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'rate_confirmation_verification',
          name: 'Rate Confirmation Verification',
          description: 'Driver verifies and confirms rate confirmation details',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'bol_receipt_confirmation',
          name: 'Bill of Lading Receipt',
          description: 'Driver confirms receipt of Bill of Lading from dispatcher',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'bol_verification',
          name: 'Bill of Lading Verification',
          description: 'Driver verifies BOL details and confirms accuracy',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'pickup_authorization',
          name: 'Pickup Authorization',
          description: 'Driver receives green light to proceed to pickup location',
          required: true,
          completed: false,
          allowOverride: true
        },
        {
          id: 'pickup_arrival',
          name: 'Pickup Arrival',
          description: 'Driver arrives at pickup location and confirms arrival',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'pickup_completion',
          name: 'Pickup Completion',
          description: 'Driver completes loading and provides pickup timestamp and REQUIRED photos',
          required: true,
          completed: false,
          allowOverride: false,
          data: {
            requiresPhotos: true,
            minimumPhotos: 2,
            photoTypes: ['loaded_truck', 'bill_of_lading']
          }
        },
        {
          id: 'transit_start',
          name: 'Transit Start',
          description: 'Driver begins transit to delivery location',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'transit_tracking',
          name: 'Transit Tracking',
          description: 'Real-time location tracking and status updates during transit',
          required: true,
          completed: false,
          allowOverride: false,
          data: {
            requiresLocationUpdates: true,
            updateInterval: 300, // 5 minutes
            requiresStatusUpdates: true,
            trackingEnabled: true
          }
        },
        {
          id: 'delivery_arrival',
          name: 'Delivery Arrival',
          description: 'Driver arrives at delivery location',
          required: true,
          completed: false,
          allowOverride: false
        },
        {
          id: 'delivery_completion',
          name: 'Delivery Completion',
          description: 'Driver completes delivery with REQUIRED photos, signature, and receiver info',
          required: true,
          completed: false,
          allowOverride: true,
          data: {
            requiresPhotos: true,
            minimumPhotos: 2,
            photoTypes: ['unloaded_truck', 'delivery_receipt'],
            requiresReceiverName: true,
            requiresReceiverSignature: true
          }
        },
        {
          id: 'pod_submission',
          name: 'Proof of Delivery Submission',
          description: 'Driver submits complete delivery documentation',
          required: true,
          completed: false,
          allowOverride: false
        }
      ]
    };

    this.workflows.set(loadId, workflow);
    return workflow;
  }

  /**
   * Get workflow for a load
   */
  getWorkflow(loadId: string): LoadWorkflow | null {
    return this.workflows.get(loadId) || null;
  }

  /**
   * Check if a step can be completed
   */
  canCompleteStep(loadId: string, stepId: WorkflowStepId): { allowed: boolean; reason?: string } {
    const workflow = this.getWorkflow(loadId);
    if (!workflow) {
      return { allowed: false, reason: 'Workflow not found' };
    }

    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    if (stepIndex === -1) {
      return { allowed: false, reason: 'Step not found' };
    }

    const step = workflow.steps[stepIndex];
    if (step.completed) {
      return { allowed: false, reason: 'Step already completed' };
    }

    // Check if all previous required steps are completed
    for (let i = 0; i < stepIndex; i++) {
      const prevStep = workflow.steps[i];
      if (prevStep.required && !prevStep.completed) {
        return { 
          allowed: false, 
          reason: `Previous step "${prevStep.name}" must be completed first` 
        };
      }
    }

    return { allowed: true };
  }

  /**
   * Complete a workflow step
   */
  async completeStep(
    loadId: string, 
    stepId: WorkflowStepId, 
    data?: any, 
    completedBy?: string
  ): Promise<{ success: boolean; error?: string; workflow?: LoadWorkflow }> {
    const canComplete = this.canCompleteStep(loadId, stepId);
    if (!canComplete.allowed) {
      return { success: false, error: canComplete.reason };
    }

    const workflow = this.getWorkflow(loadId)!;
    const stepIndex = workflow.steps.findIndex(step => step.id === stepId);
    const step = workflow.steps[stepIndex];

    // Mark step as completed
    step.completed = true;
    step.completedAt = new Date().toISOString();
    step.completedBy = completedBy;
    step.data = data;

    // Update workflow current step
    workflow.currentStep = stepIndex + 1;
    workflow.updatedAt = new Date().toISOString();

    // Check if workflow is complete
    const allStepsCompleted = workflow.steps.every(s => s.completed);
    if (allStepsCompleted) {
      workflow.status = 'completed';
    } else {
      workflow.status = 'in_progress';
    }

    // Update workflow in memory
    this.workflows.set(loadId, workflow);

    // Persist to backend
    try {
      await workflowBackendService.completeStep(loadId, stepId, completedBy || 'system', data);
    } catch (error) {
      console.error('Error persisting workflow step to backend:', error);
      // Continue with local state for now, but log the error
    }

    // Trigger notifications (including EDI)
    try {
      await this.triggerStepNotifications(loadId, stepId, workflow);
    } catch (error) {
      console.error('Error triggering notifications:', error);
      // Don't fail the step completion if notifications fail
    }

    return { success: true, workflow };
  }

  /**
   * Initialize workflow from backend or create new one
   */
  async initializeWorkflowFromBackend(loadId: string, driverId: string, dispatcherId: string): Promise<LoadWorkflow> {
    try {
      // Try to get existing workflow from backend
      let workflow = await workflowBackendService.getWorkflow(loadId);
      
      if (!workflow) {
        // Create new workflow in backend
        const workflowId = await workflowBackendService.createWorkflow(loadId, driverId, dispatcherId);
        workflow = await workflowBackendService.getWorkflow(loadId);
      }

      if (workflow) {
        // Store in memory
        this.workflows.set(loadId, workflow);
        return workflow;
      } else {
        // Fallback to local workflow
        return this.initializeLoadWorkflow(loadId, driverId, dispatcherId);
      }
    } catch (error) {
      console.error('Error initializing workflow from backend:', error);
      // Fallback to local workflow
      return this.initializeLoadWorkflow(loadId, driverId, dispatcherId);
    }
  }

  /**
   * Upload and associate document with workflow step
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
      await workflowBackendService.uploadStepDocument(loadId, stepId, fileUrl, fileType, uploadedBy, metadata);
      return true;
    } catch (error) {
      console.error('Error uploading step document:', error);
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
      const workflow = this.getWorkflow(loadId);
      if (!workflow) return false;

      // Update local workflow status
      workflow.status = 'override_required';
      this.workflows.set(loadId, workflow);

      // Persist to backend
      await workflowBackendService.requestOverride(loadId, stepId, reason, requestedBy);
      return true;
    } catch (error) {
      console.error('Error requesting override:', error);
      return false;
    }
  }

  /**
   * Get current step for a workflow
   */
  getCurrentStep(loadId: string): WorkflowStep | null {
    const workflow = this.getWorkflow(loadId);
    if (!workflow) return null;

    return workflow.steps[workflow.currentStep] || null;
  }

  /**
   * Get next available step
   */
  getNextStep(loadId: string): WorkflowStep | null {
    const workflow = this.getWorkflow(loadId);
    if (!workflow) return null;

    // Find first incomplete step
    return workflow.steps.find(step => !step.completed) || null;
  }

  /**
   * Get steps available for driver action
   */
  getAvailableSteps(loadId: string): WorkflowStep[] {
    const workflow = this.getWorkflow(loadId);
    if (!workflow) return [];

    const availableSteps: WorkflowStep[] = [];
    
    for (const step of workflow.steps) {
      if (step.completed) continue;
      
      const canComplete = this.canCompleteStep(loadId, step.id as WorkflowStepId);
      if (canComplete.allowed) {
        availableSteps.push(step);
        break; // Only allow one step at a time
      }
    }

    return availableSteps;
  }

  /**
   * Trigger notifications based on step completion
   * ✨ Enhanced with EDI automation for B2B communications
   */
  private async triggerStepNotifications(loadId: string, stepId: WorkflowStepId, workflow: LoadWorkflow) {
    const notifications = {
      'load_assignment_confirmation': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver confirmed load assignment', loadId);
        // EDI: Generate EDI 990 (Response to Load Tender) if trading partner requires it
        await this.triggerEDINotification(loadId, stepId, 'load_confirmed');
      },
      'rate_confirmation_review': () => this.notifyDispatcher(workflow.dispatcherId, 'Driver reviewed rate confirmation', loadId),
      'rate_confirmation_verification': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver verified rate confirmation', loadId);
        // EDI: Generate EDI 204 (Load Tender Response) confirming acceptance
        await this.triggerEDINotification(loadId, stepId, 'rate_confirmed');
      },
      'bol_receipt_confirmation': () => this.notifyDispatcher(workflow.dispatcherId, 'Driver confirmed BOL receipt', loadId),
      'bol_verification': () => this.notifyDispatcher(workflow.dispatcherId, 'Driver verified BOL - pickup authorized', loadId),
      'pickup_authorization': () => this.notifyDispatcher(workflow.dispatcherId, 'Driver authorized for pickup', loadId),
      'pickup_arrival': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver arrived at pickup location', loadId);
        // EDI: Generate EDI 214 (Shipment Status) - Arrived at pickup
        await this.triggerEDINotification(loadId, stepId, 'pickup_arrival');
      },
      'pickup_completion': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver completed pickup with required photos', loadId);
        this.notifyBroker(loadId, 'Load picked up and in transit');
        // EDI: Generate EDI 214 (Shipment Status) - Departed from pickup
        await this.triggerEDINotification(loadId, stepId, 'pickup_completed');
      },
      'transit_start': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver started transit to delivery', loadId);
        // EDI: Generate EDI 214 (Shipment Status) - In transit
        await this.triggerEDINotification(loadId, stepId, 'in_transit');
      },
      'transit_tracking': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Real-time tracking enabled for transit', loadId);
        // EDI: Generate EDI 214 (Shipment Status) - Tracking active
        await this.triggerEDINotification(loadId, stepId, 'tracking_active');
      },
      'delivery_arrival': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver arrived at delivery location', loadId);
        // EDI: Generate EDI 214 (Shipment Status) - Arrived at delivery
        await this.triggerEDINotification(loadId, stepId, 'delivery_arrival');
      },
      'delivery_completion': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Driver completed delivery with required photos and receiver signature', loadId);
        this.notifyBroker(loadId, 'Load delivered successfully');
        // EDI: Generate EDI 214 (Shipment Status) - Delivered
        await this.triggerEDINotification(loadId, stepId, 'delivered');
      },
      'pod_submission': async () => {
        this.notifyDispatcher(workflow.dispatcherId, 'Proof of delivery submitted', loadId);
        this.notifyBroker(loadId, 'Complete delivery documentation available');
        // EDI: Generate EDI 210 (Invoice) if auto-invoicing is enabled
        await this.triggerEDINotification(loadId, stepId, 'pod_complete');
      }
    };

    const notificationFn = notifications[stepId];
    if (notificationFn) {
      await notificationFn();
    }
  }

  /**
   * 📡 Trigger EDI notifications for workflow steps
   * Automatically generates and sends EDI messages to trading partners
   */
  private async triggerEDINotification(loadId: string, stepId: WorkflowStepId, eventType: string): Promise<void> {
    try {
      // Get load data for EDI message generation
      const loadData = await this.getLoadDataForEDI(loadId);
      if (!loadData) {
        console.warn(`No load data found for EDI notification: ${loadId}`);
        return;
      }

      // Determine trading partners that should receive this notification
      const tradingPartners = await this.getTradingPartnersForLoad(loadId);
      
      for (const partnerId of tradingPartners) {
        const partner = ediService.getTradingPartner(partnerId);
        if (!partner || !partner.isActive) continue;

        // Generate appropriate EDI message based on event type
        switch (eventType) {
          case 'load_confirmed':
            if (partner.supportedTransactions.includes('990')) {
              // EDI 990 - Response to Load Tender
              console.log(`📡 Generating EDI 990 for load confirmation: ${loadId} → ${partner.name}`);
            }
            break;

          case 'rate_confirmed':
            if (partner.supportedTransactions.includes('204')) {
              // EDI 204 - Load Tender Response
              const edi204Data: EDI204Data = {
                loadId: loadData.loadId,
                pickupDate: new Date(loadData.pickupDate),
                deliveryDate: new Date(loadData.deliveryDate),
                origin: loadData.origin,
                destination: loadData.destination,
                commodity: loadData.commodity,
                weight: loadData.weight,
                pieces: loadData.pieces,
                rate: loadData.rate,
                equipment: loadData.equipment
              };
              
              const message = await ediService.generateEDI204(edi204Data, partnerId);
              await ediService.sendEDI(message.id);
              console.log(`📡 EDI 204 sent for rate confirmation: ${loadId} → ${partner.name}`);
            }
            break;

          case 'pickup_arrival':
          case 'pickup_completed':
          case 'in_transit':
          case 'delivery_arrival':
          case 'delivered':
            if (partner.supportedTransactions.includes('214')) {
              // EDI 214 - Shipment Status Message
              const statusMapping = {
                'pickup_arrival': { code: 'A1', description: 'Arrived at pickup location' },
                'pickup_completed': { code: 'AF', description: 'Departed from pickup location' },
                'in_transit': { code: 'X1', description: 'In transit to delivery' },
                'delivery_arrival': { code: 'A2', description: 'Arrived at delivery location' },
                'delivered': { code: 'X6', description: 'Delivered' }
              };

              const status = statusMapping[eventType as keyof typeof statusMapping];
              const edi214Data: EDI214Data = {
                shipmentId: loadData.loadId,
                statusCode: status.code,
                statusDescription: status.description,
                location: eventType.includes('delivery') ? loadData.destination : loadData.origin,
                timestamp: new Date(),
                equipmentId: loadData.equipmentId,
                driverName: loadData.driverName
              };

              const message = await ediService.generateEDI214(edi214Data, partnerId);
              await ediService.sendEDI(message.id);
              console.log(`📡 EDI 214 sent for ${eventType}: ${loadId} → ${partner.name}`);
            }
            break;

          case 'pod_complete':
            if (partner.supportedTransactions.includes('210')) {
              // EDI 210 - Invoice (if auto-invoicing is enabled)
              console.log(`📡 Auto-invoicing available for: ${loadId} → ${partner.name}`);
              // Invoice generation would require additional billing logic
            }
            break;
        }
      }
    } catch (error) {
      console.error(`EDI notification failed for ${loadId}:`, error);
      // Don't fail the workflow step if EDI fails - log and continue
    }
  }

  /**
   * Get load data formatted for EDI message generation
   */
  private async getLoadDataForEDI(loadId: string): Promise<any | null> {
    // This would integrate with your load data service
    // For now, return mock data structure
    return {
      loadId,
      pickupDate: new Date().toISOString(),
      deliveryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      origin: {
        name: 'Origin Company',
        address: '123 Pickup St',
        city: 'Dallas',
        state: 'TX',
        zipCode: '75201'
      },
      destination: {
        name: 'Destination Company',
        address: '456 Delivery Ave',
        city: 'Houston',
        state: 'TX',
        zipCode: '77001'
      },
      commodity: 'General Freight',
      weight: 20000,
      pieces: 10,
      rate: 1200.00,
      equipment: 'Dry Van',
      equipmentId: 'TRL-001',
      driverName: 'John Doe'
    };
  }

  /**
   * Get trading partner IDs that should receive EDI notifications for this load
   */
  private async getTradingPartnersForLoad(loadId: string): Promise<string[]> {
    // This would integrate with your load/customer data
    // For now, return demo trading partners
    return ['demo-shipper-1', 'demo-broker-1'];
  }

  /**
   * Send notification to dispatcher
   */
  private notifyDispatcher(dispatcherId: string, message: string, loadId: string) {
    // Implementation for dispatcher notification
    console.log(`Dispatcher ${dispatcherId}: ${message} (Load: ${loadId})`);
  }

  /**
   * Send notification to broker
   */
  private notifyBroker(loadId: string, message: string) {
    // Implementation for broker notification
    console.log(`Broker notification: ${message} (Load: ${loadId})`);
  }

  /**
   * Get workflow progress percentage
   */
  getWorkflowProgress(loadId: string): number {
    const workflow = this.getWorkflow(loadId);
    if (!workflow) return 0;

    const completedSteps = workflow.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / workflow.steps.length) * 100);
  }

  /**
   * Validate step data before completion
   */
  validateStepData(stepId: WorkflowStepId, data: any): { valid: boolean; errors?: string[] } {
    const validations = {
      'load_assignment_confirmation': (data: any) => {
        const errors = [];
        if (!data.driverSignature) errors.push('Driver signature required');
        if (!data.confirmationTimestamp) errors.push('Confirmation timestamp required');
        return { valid: errors.length === 0, errors };
      },
      'rate_confirmation_review': (data: any) => {
        const errors = [];
        if (!data.documentReviewed) errors.push('Rate confirmation document must be reviewed');
        return { valid: errors.length === 0, errors };
      },
      'rate_confirmation_verification': (data: any) => {
        const errors = [];
        if (!data.rateAccepted) errors.push('Rate acceptance confirmation required');
        if (!data.verificationTimestamp) errors.push('Verification timestamp required');
        return { valid: errors.length === 0, errors };
      },
      'bol_receipt_confirmation': (data: any) => {
        const errors = [];
        if (!data.bolReceived) errors.push('BOL receipt must be confirmed');
        return { valid: errors.length === 0, errors };
      },
      'bol_verification': (data: any) => {
        const errors = [];
        if (!data.detailsVerified) errors.push('BOL details must be verified');
        return { valid: errors.length === 0, errors };
      },
      'pickup_authorization': (data: any) => {
        const errors = [];
        if (!data.readyToDepart) errors.push('Ready to depart confirmation required');
        return { valid: errors.length === 0, errors };
      },
      'pickup_arrival': (data: any) => {
        const errors = [];
        if (!data.arrivalTime) errors.push('Arrival time required');
        return { valid: errors.length === 0, errors };
      },
      'pickup_completion': (data: any) => {
        const errors = [];
        if (!data.pickupTimestamp) errors.push('Pickup timestamp required');
        if (!data.loadingComplete) errors.push('Loading completion confirmation required');
        
        // REQUIRED: Photos at pickup
        if (!data.pickupPhotos || data.pickupPhotos.length < 2) {
          errors.push('Minimum 2 photos required at pickup (loaded truck & BOL)');
        }
        
        if (!data.sealNumber) errors.push('Seal number required');
        if (!data.driverSignature) errors.push('Driver signature required');
        return { valid: errors.length === 0, errors };
      },
      'transit_start': (data: any) => {
        const errors = [];
        if (!data.departureTime) errors.push('Departure time required');
        return { valid: errors.length === 0, errors };
      },
      'transit_tracking': (data: any) => {
        const errors = [];
        if (!data.trackingEnabled) errors.push('Tracking must be enabled');
        if (!data.locationUpdateInterval) errors.push('Location update interval required');
        if (!data.statusUpdateEnabled) errors.push('Status update must be enabled');
        return { valid: errors.length === 0, errors };
      },
      'delivery_arrival': (data: any) => {
        const errors = [];
        if (!data.arrivalTime) errors.push('Delivery arrival time required');
        return { valid: errors.length === 0, errors };
      },
      'delivery_completion': (data: any) => {
        const errors = [];
        if (!data.deliveryTimestamp) errors.push('Delivery timestamp required');
        if (!data.unloadingComplete) errors.push('Unloading completion confirmation required');
        
        // REQUIRED: Photos at delivery
        if (!data.deliveryPhotos || data.deliveryPhotos.length < 2) {
          errors.push('Minimum 2 photos required at delivery (unloaded truck & delivery receipt)');
        }
        
        // REQUIRED: Receiver signature (unless override allowed)
        if (!data.receiverSignature && !data.overrideApproved) {
          errors.push('Receiver signature required (or override approval needed)');
        }
        
        // REQUIRED: Receiver name (unless override allowed)
        if (!data.receiverName && !data.overrideApproved) {
          errors.push('Receiver name required (or override approval needed)');
        }
        
        if (data.overrideApproved && !data.overrideReason) {
          errors.push('Override reason required when signature/name override is used');
        }
        
        return { valid: errors.length === 0, errors };
      },
      'pod_submission': (data: any) => {
        const errors = [];
        if (!data.allPhotosUploaded) errors.push('All required photos must be uploaded');
        if (!data.documentationComplete) errors.push('Documentation completion confirmation required');
        return { valid: errors.length === 0, errors };
      }
    };

    const validator = validations[stepId];
    if (!validator) {
      return { valid: true };
    }

    return validator(data);
  }
}

// Export singleton instance
export const workflowManager = new WorkflowManager();

// React hook for workflow management
import { useState, useEffect } from 'react';

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

  const completeStep = async (stepId: WorkflowStepId, data?: any, completedBy?: string) => {
    const result = await workflowManager.completeStep(loadId, stepId, data, completedBy);
    
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

  const validateStepData = (stepId: WorkflowStepId, data: any) => {
    return workflowManager.validateStepData(stepId, data);
  };

  return {
    workflow,
    currentStep,
    availableSteps,
    progress,
    completeStep,
    canCompleteStep,
    validateStepData,
    uploadStepDocument: (fileUrl: string, fileType: 'photo' | 'signature', uploadedBy: string, stepId: WorkflowStepId, metadata?: any) => 
      workflowManager.uploadStepDocument(loadId, stepId, fileUrl, fileType, uploadedBy, metadata),
    requestOverride: (stepId: WorkflowStepId, reason: string, requestedBy: string) =>
      workflowManager.requestOverride(loadId, stepId, reason, requestedBy)
  };
}
