/**
 * Dispatcher Assignment Service
 * Handles management notifications when dispatchers are needed
 * Manages dispatcher assignments and contract generation
 */

import ServiceErrorHandler from '../utils/errorHandler';
import {
  contractGenerationService,
  DispatcherLeadContractData,
} from './ContractGenerationService';

export interface DispatcherNeededNotification {
  carrierId: string;
  carrierName: string;
  aiSource: string;
  leadScore: number;
  aiConfidence: number;
  equipmentType: string;
  fleetSize: number;
  onboardingStarted: Date;
  priority: 'high' | 'medium' | 'low';
}

export interface DispatcherAssignment {
  id: string;
  carrierId: string;
  carrierName: string;
  dispatcherId: string;
  dispatcherName: string;
  dispatcherCompany: string;
  assignedBy: string;
  assignedAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'active';
  aiSource: string;
  contractGenerated: boolean;
  contractId?: string;
}

export class DispatcherAssignmentService {
  private pendingAssignments: Map<string, DispatcherAssignment> = new Map();
  private activeAssignments: Map<string, DispatcherAssignment> = new Map();

  /**
   * Send management notification for dispatcher needed
   */
  async notifyManagementDispatcherNeeded(
    notification: DispatcherNeededNotification
  ): Promise<void> {
    await ServiceErrorHandler.handleAsyncOperation(
      async () => {
        // console.log(`📢 Sending management notification: DISPATCHER NEEDED for ${notification.carrierName}`);

        try {
          // Create management notification
          const managementNotification = {
            id: `DISPATCH-NEEDED-${Date.now()}`,
            type: 'dispatcher_assignment_needed',
            title: '🚨 DISPATCHER NEEDED',
            message: `AI-generated carrier "${notification.carrierName}" needs dispatcher assignment`,
            priority: notification.priority,
            data: {
              carrierId: notification.carrierId,
              carrierName: notification.carrierName,
              aiSource: notification.aiSource,
              leadScore: notification.leadScore,
              aiConfidence: notification.aiConfidence,
              equipmentType: notification.equipmentType,
              fleetSize: notification.fleetSize,
              onboardingStarted: notification.onboardingStarted,
            },
            timestamp: new Date(),
            status: 'unread',
            department: 'management',
            actionRequired: true,
            actions: [
              {
                id: 'view_carrier',
                label: 'View Carrier Details',
                type: 'primary',
              },
              {
                id: 'assign_dispatcher',
                label: 'Assign Dispatcher',
                type: 'success',
              },
            ],
          };

          // Send to management notification hub
          await this.safelyNotifyManagement(managementNotification);

          // console.log(`✅ Management notification sent for ${notification.carrierName}`);
        } catch (error) {
          console.error('❌ Failed to send management notification:', error);
          // Don't throw here - we don't want to break the entire workflow for a notification failure
        }

        return undefined; // Explicit void return
      },
      'DispatcherAssignmentService',
      'notifyManagementDispatcherNeeded'
    );
  }

  /**
   * Management assigns carrier to dispatcher
   */
  async assignCarrierToDispatcher(
    carrierId: string,
    carrierName: string,
    dispatcherId: string,
    dispatcherName: string,
    dispatcherCompany: string,
    assignedBy: string,
    aiSource: string
  ): Promise<string> {
    const result = await ServiceErrorHandler.handleAsyncOperation(
      async () => {
        const assignmentId = `ASSIGN-${Date.now()}`;

        try {
          const assignment: DispatcherAssignment = {
            id: assignmentId,
            carrierId,
            carrierName,
            dispatcherId,
            dispatcherName,
            dispatcherCompany,
            assignedBy,
            assignedAt: new Date(),
            status: 'pending',
            aiSource,
            contractGenerated: false,
          };

          this.pendingAssignments.set(assignmentId, assignment);

          // Notify dispatcher of assignment (safely)
          await this.safelyNotifyDispatcher(assignment);

          // console.log(`✅ Carrier ${carrierName} assigned to dispatcher ${dispatcherName}`);
          return assignmentId;
        } catch (error) {
          console.error('❌ Failed to assign carrier to dispatcher:', error);
          throw error;
        }
      },
      'DispatcherAssignmentService',
      'assignCarrierToDispatcher'
    );

    // Handle the case where ServiceErrorHandler returns null
    return result || `ERROR-${Date.now()}`;
  }

  /**
   * Dispatcher accepts assignment
   */
  async dispatcherAcceptsAssignment(assignmentId: string): Promise<void> {
    await ServiceErrorHandler.handleAsyncOperation(
      async () => {
        const assignment = this.pendingAssignments.get(assignmentId);
        if (!assignment) {
          throw new Error('Assignment not found');
        }

        try {
          assignment.status = 'accepted';

          // Generate dispatcher contract automatically with 5% commission
          const contractData: DispatcherLeadContractData = {
            leadId: `AI-LEAD-${assignment.carrierId}`,
            dispatcherId: assignment.dispatcherId,
            dispatcherName: assignment.dispatcherName,
            dispatcherCompany: assignment.dispatcherCompany,
            carrierId: assignment.carrierId,
            carrierName: assignment.carrierName,
            carrierCompany: assignment.carrierName, // Using name as company for now
            source: assignment.aiSource,
            potentialValue: 50000, // Estimated annual dispatch fees
            conversionType: 'ai_assignment_accepted',
            tenantId: 'tenant-demo-123',
            contractTerms: {
              commissionRate: 5.0, // 5% commission for dispatchers
              paymentTerms: 'Net 10 days',
              contractDuration: '1 year with auto-renewal',
              exclusivity: false,
              territory: 'United States',
            },
          };

          // Generate contract safely
          const contract = await this.safelyGenerateContract(contractData);

          if (contract) {
            assignment.contractGenerated = true;
            assignment.contractId = contract.contractId;
            assignment.status = 'active';

            // Move to active assignments
            this.activeAssignments.set(assignmentId, assignment);
            this.pendingAssignments.delete(assignmentId);

            // Notify management of successful assignment
            await this.safelyNotifyManagementComplete(
              assignment,
              contract.contractNumber
            );

            // console.log(`✅ Dispatcher accepted assignment and contract generated: ${contract.contractNumber}`);
          } else {
            console.error('❌ Failed to generate contract for assignment');
            assignment.status = 'pending'; // Revert status
          }
        } catch (error) {
          console.error('❌ Failed to process dispatcher acceptance:', error);
          throw error;
        }

        return undefined; // Explicit void return
      },
      'DispatcherAssignmentService',
      'dispatcherAcceptsAssignment'
    );
  }

  /**
   * Safely send notification to management hub
   */
  private async safelyNotifyManagement(notification: any): Promise<void> {
    try {
      // In production, this would integrate with the notification system API
      const response = await fetch('/api/notifications/management', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Management notification failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send to management hub:', error);
      // For now, log to console as fallback
      console.log('🚨 MANAGEMENT NOTIFICATION:', notification);
    }
  }

  /**
   * Safely notify dispatcher of assignment
   */
  private async safelyNotifyDispatcher(
    assignment: DispatcherAssignment
  ): Promise<void> {
    try {
      const dispatcherNotification = {
        id: `DISPATCHER-ASSIGN-${Date.now()}`,
        type: 'carrier_assignment',
        title: '🎯 New Carrier Assignment',
        message: `You have been assigned carrier "${assignment.carrierName}" (AI-generated lead)`,
        data: assignment,
        timestamp: new Date(),
        recipientId: assignment.dispatcherId,
        status: 'unread',
        priority: 'high',
        actions: [
          {
            id: 'accept_assignment',
            label: 'Accept Assignment',
            type: 'success',
          },
          {
            id: 'decline_assignment',
            label: 'Decline',
            type: 'danger',
          },
        ],
      };

      // Send to dispatcher
      await this.sendToDispatcherNotifications(dispatcherNotification);
    } catch (error) {
      console.error('❌ Failed to notify dispatcher:', error);
      // Don't throw - assignment should still proceed
    }
  }

  /**
   * Safely generate contract
   */
  private async safelyGenerateContract(
    contractData: DispatcherLeadContractData
  ): Promise<any | null> {
    try {
      return await contractGenerationService.generateDispatcherLeadContract(
        contractData
      );
    } catch (error) {
      console.error('❌ Failed to generate dispatcher contract:', error);
      return null;
    }
  }

  /**
   * Safely notify management of assignment completion
   */
  private async safelyNotifyManagementComplete(
    assignment: DispatcherAssignment,
    contractNumber: string
  ): Promise<void> {
    try {
      const successNotification = {
        id: `ASSIGN-SUCCESS-${Date.now()}`,
        type: 'assignment_successful',
        title: '✅ Dispatcher Assignment Complete',
        message: `${assignment.dispatcherName} accepted carrier ${assignment.carrierName}. Contract ${contractNumber} generated.`,
        data: { assignment, contractNumber },
        timestamp: new Date(),
        status: 'unread',
        department: 'management',
        priority: 'medium',
      };

      await this.safelyNotifyManagement(successNotification);
    } catch (error) {
      console.error('❌ Failed to notify management of completion:', error);
      // Don't throw - the assignment was successful even if notification failed
    }
  }

  /**
   * Get pending assignments for management dashboard
   */
  getPendingAssignments(): DispatcherAssignment[] {
    return Array.from(this.pendingAssignments.values());
  }

  /**
   * Get active assignments
   */
  getActiveAssignments(): DispatcherAssignment[] {
    return Array.from(this.activeAssignments.values());
  }

  private async sendToDispatcherNotifications(
    notification: any
  ): Promise<void> {
    try {
      // In production, this would integrate with the dispatcher notification system API
      const response = await fetch('/api/notifications/dispatcher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error(`Dispatcher notification failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to send dispatcher notification:', error);
      // For now, log to console as fallback
      console.log('📤 DISPATCHER NOTIFICATION:', notification);
    }
  }
}

export const dispatcherAssignmentService = new DispatcherAssignmentService();
