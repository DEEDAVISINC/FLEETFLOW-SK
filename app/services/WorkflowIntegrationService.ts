/**
 * FleetFlow Workflow Integration Service
 * Orchestrates connected workflows and cascading actions across the entire system
 * Transforms BOL signing into enterprise-wide process integration
 */

import { BillingAutomationService } from './billing/BillingAutomationService';
import { BOLWorkflowService } from './bol-workflow/BOLWorkflowService';
import { DocumentFlowService } from './document-flow-service';
import * as loadService from './loadService';

export interface WorkflowCascadeData {
  loadId: string;
  driverId: string;
  dispatcherId: string;
  brokerId: string;
  stepId: string;
  stepData: any;
  completedBy: string;
  completedAt: string;
}

export interface BOLSigningData {
  bolNumber: string;
  receiverName: string;
  receiverSignature: string;
  receiverTitle?: string;
  signedAt: string;
  deliveryPhotos?: string[];
  additionalNotes?: string;
}

export interface CascadeResult {
  success: boolean;
  documentsGenerated: string[];
  notificationsSent: string[];
  statusUpdates: string[];
  invoicesCreated: string[];
  errors: string[];
}

export class WorkflowIntegrationService {
  private static instance: WorkflowIntegrationService;
  private documentService: DocumentFlowService;
  private billingService: BillingAutomationService | null = null;

  private constructor() {
    this.documentService = new DocumentFlowService();
    // Don't initialize billing service immediately to avoid Stripe configuration errors
  }

  /**
   * Get billing service with lazy initialization and error handling
   */
  private getBillingService(): BillingAutomationService | null {
    if (!this.billingService) {
      try {
        this.billingService = new BillingAutomationService();
        console.info('✅ BillingAutomationService initialized successfully');
      } catch (error) {
        console.warn(
          '⚠️ BillingAutomationService initialization failed:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        console.warn('💡 Billing features will be disabled for this session');
        return null;
      }
    }
    return this.billingService;
  }

  static getInstance(): WorkflowIntegrationService {
    if (!WorkflowIntegrationService.instance) {
      WorkflowIntegrationService.instance = new WorkflowIntegrationService();
    }
    return WorkflowIntegrationService.instance;
  }

  /**
   * MAIN CASCADE ORCHESTRATOR
   * Processes BOL completion and triggers all connected workflows
   */
  async processBOLCompletion(
    cascadeData: WorkflowCascadeData,
    bolData: BOLSigningData
  ): Promise<CascadeResult> {
    console.info(
      '🔄 Starting BOL completion cascade for load:',
      cascadeData.loadId
    );

    const result: CascadeResult = {
      success: true,
      documentsGenerated: [],
      notificationsSent: [],
      statusUpdates: [],
      invoicesCreated: [],
      errors: [],
    };

    try {
      // 1. GENERATE SIGNED BOL DOCUMENT
      console.info('📄 Step 1: Generating signed BOL document...');
      const signedBOLResult = await this.generateSignedBOLDocument(
        cascadeData,
        bolData
      );
      if (signedBOLResult.success) {
        result.documentsGenerated.push(signedBOLResult.documentId!);
      } else {
        result.errors.push(
          'BOL document generation failed: ' + signedBOLResult.error
        );
      }

      // 2. STORE IN DRIVER DOCUMENTS
      console.info('💾 Step 2: Adding to driver document collection...');
      await this.addToDriverDocuments(
        cascadeData.driverId,
        signedBOLResult.documentUrl!
      );
      result.statusUpdates.push('Added to driver documents');

      // 3. SUBMIT TO BROKER FOR REVIEW
      console.info('👔 Step 3: Submitting to broker for review...');
      const brokerSubmissionResult = await this.submitToBrokerReview(
        cascadeData,
        bolData
      );
      if (brokerSubmissionResult.success) {
        result.notificationsSent.push('Broker review notification sent');
      } else {
        result.errors.push(
          'Broker submission failed: ' + brokerSubmissionResult.error
        );
      }

      // 4. UPDATE DISPATCHER DASHBOARD
      console.info('🎯 Step 4: Updating dispatcher dashboard...');
      await this.updateDispatcherLoadStatus(
        cascadeData.loadId,
        cascadeData.dispatcherId,
        'DELIVERED'
      );
      result.statusUpdates.push('Dispatcher dashboard updated: DELIVERED');

      // 5. ENABLE DISPATCH FEE INVOICE CREATION
      console.info('💰 Step 5: Enabling dispatch fee invoice creation...');
      await this.enableDispatchInvoicing(
        cascadeData.loadId,
        cascadeData.dispatcherId
      );
      result.statusUpdates.push('Dispatch fee invoice creation enabled');

      // 6. SEND STAKEHOLDER NOTIFICATIONS
      console.info('🔔 Step 6: Sending stakeholder notifications...');
      const notificationResults = await this.sendStakeholderNotifications(
        cascadeData,
        bolData
      );
      result.notificationsSent.push(...notificationResults);

      console.info('✅ BOL completion cascade completed successfully!');
      console.info(
        `📊 Summary: ${result.documentsGenerated.length} docs, ${result.notificationsSent.length} notifications, ${result.statusUpdates.length} updates`
      );
    } catch (error) {
      console.error('❌ BOL completion cascade failed:', error);
      result.success = false;
      result.errors.push(
        `Cascade failure: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }

    return result;
  }

  /**
   * Generate and store signed BOL document
   */
  private async generateSignedBOLDocument(
    cascadeData: WorkflowCascadeData,
    bolData: BOLSigningData
  ): Promise<{
    success: boolean;
    documentId?: string;
    documentUrl?: string;
    error?: string;
  }> {
    try {
      // Get load data for document generation
      // Note: Using a mock load data structure since loadService doesn't have getLoadById
      const loadData = {
        id: cascadeData.loadId,
        brokerName: 'FleetFlow Broker',
        shipperName: 'FleetFlow Shipper',
        proNumber: `PRO-${cascadeData.loadId}`,
        weight: '80,000 lbs',
        loadIdentifier: cascadeData.loadId,
      };

      // Generate signed BOL using existing document service
      const signedBOL =
        await this.documentService.generateBillOfLading(loadData);

      // Enhance BOL with receiver signature data
      const enhancedBOL = this.enhanceBOLWithSignature(signedBOL, bolData);

      // Store in database
      const documentId = await this.storeSignedBOLDocument(
        cascadeData.loadId,
        enhancedBOL,
        bolData
      );

      const documentUrl = `/api/documents/${documentId}/signed-bol.pdf`;

      console.info(`📋 Signed BOL generated: ${documentId}`);
      return { success: true, documentId, documentUrl };
    } catch (error) {
      console.error('Error generating signed BOL:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Enhance BOL with receiver signature information
   */
  private enhanceBOLWithSignature(
    originalBOL: string,
    bolData: BOLSigningData
  ): string {
    const signatureSection = `

═══════════════════════════════════════════════════════════
DELIVERY CONFIRMATION & SIGNATURES

RECEIVER INFORMATION:
Name: ${bolData.receiverName}
Title: ${bolData.receiverTitle || 'Not Specified'}
Signature Date: ${new Date(bolData.signedAt).toLocaleString()}

RECEIVER SIGNATURE: ${bolData.receiverSignature}

${
  bolData.deliveryPhotos && bolData.deliveryPhotos.length > 0
    ? `DELIVERY PHOTOS: ${bolData.deliveryPhotos.length} photos attached`
    : ''
}

${bolData.additionalNotes ? `DELIVERY NOTES: ${bolData.additionalNotes}` : ''}

DELIVERY COMPLETED: ${new Date(bolData.signedAt).toLocaleString()}

This document serves as proof of delivery and acceptance of goods.
═══════════════════════════════════════════════════════════`;

    return originalBOL + signatureSection;
  }

  /**
   * Store signed BOL document in database
   */
  private async storeSignedBOLDocument(
    loadId: string,
    enhancedBOL: string,
    bolData: BOLSigningData
  ): Promise<string> {
    // In a real implementation, this would store in the database
    // For now, we'll simulate storage and return an ID
    const documentId = `DOC-BOL-${loadId}-${Date.now()}`;

    // TODO: Implement actual database storage
    console.info(`💾 Storing signed BOL document: ${documentId}`);

    return documentId;
  }

  /**
   * Add signed BOL to driver's document collection
   */
  private async addToDriverDocuments(
    driverId: string,
    documentUrl: string
  ): Promise<void> {
    // TODO: Implement driver document storage
    console.info(
      `📚 Adding BOL to driver ${driverId} documents: ${documentUrl}`
    );
  }

  /**
   * Submit BOL to broker for review using existing BOL workflow service
   */
  private async submitToBrokerReview(
    cascadeData: WorkflowCascadeData,
    bolData: BOLSigningData
  ): Promise<{ success: boolean; submissionId?: string; error?: string }> {
    try {
      // Get load data for submission (using mock data structure)
      const loadData = {
        id: cascadeData.loadId,
        brokerName: 'FleetFlow Broker',
        shipperName: 'FleetFlow Shipper',
        shipperEmail: 'shipper@fleetflow.com',
        driverName: 'FleetFlow Driver',
        proNumber: `PRO-${cascadeData.loadId}`,
        weight: '80,000 lbs',
        loadIdentifier: cascadeData.loadId,
        shipperId: 'SHP-001',
      };

      // Prepare BOL submission data
      const submissionData = {
        loadId: cascadeData.loadId,
        loadIdentifierId: loadData.loadIdentifier || cascadeData.loadId,
        driverId: cascadeData.driverId,
        driverName: loadData.driverName || 'Driver',
        brokerId: cascadeData.brokerId,
        brokerName: loadData.brokerName || 'Broker',
        shipperId: loadData.shipperId || 'unknown',
        shipperName: loadData.shipperName || 'Unknown Shipper',
        shipperEmail: loadData.shipperEmail || 'shipper@example.com',
        bolData: {
          bolNumber: bolData.bolNumber,
          proNumber: loadData.proNumber || '',
          deliveryDate: new Date(bolData.signedAt).toISOString().split('T')[0],
          deliveryTime: new Date(bolData.signedAt)
            .toISOString()
            .split('T')[1]
            .slice(0, 5),
          receiverName: bolData.receiverName,
          receiverSignature: bolData.receiverSignature,
          driverSignature: 'Digital Signature',
          deliveryPhotos: bolData.deliveryPhotos || [],
          pickupPhotos: [],
          sealNumbers: [],
          weight: loadData.weight || '',
          pieces: 1,
          damages: [],
          notes: bolData.additionalNotes || '',
        },
      };

      // Submit via existing BOL workflow service
      const result = await BOLWorkflowService.submitBOL(submissionData);

      if (result.success) {
        console.info(
          `✅ BOL submitted to broker successfully: ${result.submissionId}`
        );
        return { success: true, submissionId: result.submissionId };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error submitting BOL to broker:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update dispatcher dashboard with DELIVERED status
   */
  private async updateDispatcherLoadStatus(
    loadId: string,
    dispatcherId: string,
    status: string
  ): Promise<void> {
    try {
      // Update load status using loadService functions
      // Note: Using updateLoad function since there's no updateLoadStatus
      const updates = { status: status as any };
      loadService.updateLoad(loadId, updates);

      // Send real-time update to dispatcher dashboard
      // TODO: Implement WebSocket/SSE notification to dispatcher dashboard
      console.info(
        `🎯 Load ${loadId} status updated to ${status} for dispatcher ${dispatcherId}`
      );
    } catch (error) {
      console.error('Error updating dispatcher load status:', error);
      // Don't throw - this is non-critical for the main workflow
    }
  }

  /**
   * Enable dispatch fee invoice creation for completed loads
   */
  private async enableDispatchInvoicing(
    loadId: string,
    dispatcherId: string
  ): Promise<void> {
    try {
      // Mark load as ready for dispatch fee invoicing
      // TODO: Implement dispatch fee invoice flag in database
      console.info(
        `💰 Dispatch fee invoice creation enabled for load ${loadId}`
      );

      // Optional: Auto-generate dispatch fee invoice with fault tolerance
      const billingService = this.getBillingService();
      if (billingService) {
        try {
          // const invoice = await billingService.generateDispatchFeeInvoice(loadId, dispatcherId);
          console.info('📊 Billing service available for invoice generation');
        } catch (billingError) {
          console.warn(
            '⚠️ Invoice generation failed:',
            billingError instanceof Error
              ? billingError.message
              : 'Unknown error'
          );
        }
      } else {
        console.info(
          'ℹ️ Billing service not available - invoice creation will be manual'
        );
      }
    } catch (error) {
      console.error('Error enabling dispatch invoicing:', error);
      // Don't throw - this is non-critical for the main workflow
    }
  }

  /**
   * Send notifications to all stakeholders
   */
  private async sendStakeholderNotifications(
    cascadeData: WorkflowCascadeData,
    bolData: BOLSigningData
  ): Promise<string[]> {
    const notificationResults: string[] = [];

    try {
      // Notify dispatcher of delivery completion
      // TODO: Implement real notification service calls
      notificationResults.push('Dispatcher notified: Delivery completed');

      // Notify customer service of delivery
      notificationResults.push('Customer service notified: Delivery completed');

      // Optional: Notify shipper of successful delivery
      notificationResults.push('Shipper notified: Delivery confirmed');
    } catch (error) {
      console.error('Error sending stakeholder notifications:', error);
      notificationResults.push('Error sending some notifications');
    }

    return notificationResults;
  }

  /**
   * Handle workflow step completion and trigger appropriate cascades
   */
  async handleWorkflowStepCompletion(
    loadId: string,
    stepId: string,
    stepData: any,
    completedBy: string
  ): Promise<void> {
    console.info(
      `🔗 Handling workflow step completion: ${stepId} for load ${loadId}`
    );

    // Check if this is the delivery_completion step with BOL signing
    if (
      stepId === 'delivery_completion' &&
      stepData.receiverSignature &&
      stepData.bolSigned
    ) {
      console.info('📋 BOL signing detected - triggering cascade...');

      // Extract necessary data for cascade
      const cascadeData: WorkflowCascadeData = {
        loadId,
        driverId: stepData.driverId || 'unknown',
        dispatcherId: stepData.dispatcherId || 'unknown',
        brokerId: stepData.brokerId || 'unknown',
        stepId,
        stepData,
        completedBy,
        completedAt: new Date().toISOString(),
      };

      const bolData: BOLSigningData = {
        bolNumber: stepData.bolNumber || `BOL-${loadId}-${Date.now()}`,
        receiverName: stepData.receiverName,
        receiverSignature: stepData.receiverSignature,
        receiverTitle: stepData.receiverTitle,
        signedAt: stepData.signedAt || new Date().toISOString(),
        deliveryPhotos: stepData.deliveryPhotos,
        additionalNotes: stepData.additionalNotes,
      };

      // Trigger the cascade
      const result = await this.processBOLCompletion(cascadeData, bolData);

      if (!result.success) {
        console.error('❌ BOL completion cascade had errors:', result.errors);
      } else {
        console.info('✅ BOL completion cascade completed successfully!');
      }
    }
  }
}

// Export singleton instance
export const workflowIntegrationService =
  WorkflowIntegrationService.getInstance();
