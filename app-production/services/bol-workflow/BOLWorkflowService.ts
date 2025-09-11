/**
 * FleetFlow Bill of Lading Workflow & Notification Service
 * Handles the complete BOL submission workflow from driver to broker to shipper
 * Updated to send invoices to vendors via EMAIL ONLY
 */

import LoadIdentificationService from '../LoadIdentificationService';

export interface BOLSubmission {
  id: string;
  loadId: string;
  loadIdentifierId: string; // Using proper load identifier system
  driverId: string;
  driverName: string;
  brokerId: string;
  brokerName: string;
  shipperId: string;
  shipperName: string;
  shipperEmail: string;
  
  // BOL Data
  bolData: {
    bolNumber: string;
    proNumber: string;
    deliveryDate: string;
    deliveryTime: string;
    receiverName: string;
    receiverSignature: string;
    driverSignature: string;
    deliveryPhotos: string[];
    pickupPhotos: string[];
    sealNumbers: string[];
    weight: string;
    pieces: number;
    damages: string[];
    notes: string;
  };
  
  // Workflow Status
  status: 'submitted' | 'broker_review' | 'broker_approved' | 'invoice_generated' | 'invoice_sent' | 'completed';
  submittedAt: string;
  brokerReviewedAt?: string;
  invoiceGeneratedAt?: string;
  invoiceSentAt?: string;
  completedAt?: string;
  
  // Generated Documents
  invoiceId?: string;
  invoiceAmount?: number;
  invoiceUrl?: string;
}

export interface BOLWorkflowNotification {
  id: string;
  bolSubmissionId: string;
  type: 'driver_submission' | 'broker_review_request' | 'broker_approval' | 'invoice_generated' | 'invoice_sent';
  recipientId: string;
  recipientType: 'broker' | 'shipper' | 'driver';
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  message: string;
  sentAt: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
}

export class BOLWorkflowService {
  private static submissions: Map<string, BOLSubmission> = new Map();
  private static notifications: BOLWorkflowNotification[] = [];

  /**
   * STEP 1: Driver submits BOL via driver portal
   */
  static async submitBOL(submission: Omit<BOLSubmission, 'id' | 'status' | 'submittedAt'>): Promise<{
    success: boolean;
    submissionId?: string;
    error?: string;
  }> {
    try {
      const submissionId = `BOL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const bolSubmission: BOLSubmission = {
        ...submission,
        id: submissionId,
        status: 'submitted',
        submittedAt: new Date().toISOString()
      };

      // Store submission
      this.submissions.set(submissionId, bolSubmission);

      // Notify broker for review
      await this.notifyBrokerForReview(bolSubmission);

      console.log(`📋 BOL submitted successfully: ${submissionId}`);
      console.log(`🚛 Driver: ${submission.driverName}`);
      console.log(`📦 Load: ${submission.loadIdentifierId}`);
      console.log(`👔 Broker notified: ${submission.brokerName}`);

      return {
        success: true,
        submissionId
      };

    } catch (error) {
      console.error('BOL submission failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * STEP 2: Notify broker for BOL review (SMS + Email)
   */
  private static async notifyBrokerForReview(submission: BOLSubmission): Promise<void> {
    const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const brokerNotification: BOLWorkflowNotification = {
      id: notificationId,
      bolSubmissionId: submission.id,
      type: 'broker_review_request',
      recipientId: submission.brokerId,
      recipientType: 'broker',
      recipientName: submission.brokerName,
      recipientEmail: `${submission.brokerId}@fleetflowapp.com`,
      recipientPhone: this.getBrokerPhone(submission.brokerId),
      message: this.generateBrokerReviewMessage(submission),
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    this.notifications.push(brokerNotification);

    // Send notification via existing notification system (SMS + Email for broker)
    await this.sendNotification(brokerNotification);

    // Update submission status
    submission.status = 'broker_review';
    this.submissions.set(submission.id, submission);
  }

  /**
   * STEP 3: Broker approves BOL and triggers invoice generation
   */
  static async approveBOL(submissionId: string, brokerId: string, approvalData: {
    approved: boolean;
    reviewNotes?: string;
    adjustments?: {
      rate?: number;
      additionalCharges?: Array<{ description: string; amount: number }>;
      deductions?: Array<{ description: string; amount: number }>;
    };
  }): Promise<{
    success: boolean;
    invoiceId?: string;
    error?: string;
  }> {
    try {
      const submission = this.submissions.get(submissionId);
      if (!submission) {
        throw new Error('BOL submission not found');
      }

      if (submission.brokerId !== brokerId) {
        throw new Error('Unauthorized: Broker mismatch');
      }

      // Update submission
      submission.status = 'broker_approved';
      submission.brokerReviewedAt = new Date().toISOString();
      this.submissions.set(submissionId, submission);

      if (approvalData.approved) {
        // Generate and send invoice via EMAIL to vendor
        const invoiceResult = await this.generateAndSendInvoice(submission, approvalData.adjustments);
        
        if (invoiceResult.success) {
          submission.invoiceId = invoiceResult.invoiceId;
          submission.invoiceAmount = invoiceResult.amount;
          submission.invoiceUrl = invoiceResult.invoiceUrl;
          submission.status = 'invoice_sent';
          submission.invoiceGeneratedAt = new Date().toISOString();
          submission.invoiceSentAt = new Date().toISOString();
          submission.completedAt = new Date().toISOString();
          this.submissions.set(submissionId, submission);

          console.log(`✅ BOL approved and invoice sent via EMAIL: ${invoiceResult.invoiceId}`);
          console.log(`💰 Invoice amount: $${invoiceResult.amount}`);
          console.log(`📧 Email sent to vendor: ${submission.shipperName} (${submission.shipperEmail})`);

          return {
            success: true,
            invoiceId: invoiceResult.invoiceId
          };
        } else {
          throw new Error(`Invoice generation failed: ${invoiceResult.error}`);
        }
      } else {
        // BOL rejected - notify driver
        await this.notifyDriverOfRejection(submission, approvalData.reviewNotes || 'BOL rejected by broker');
        return {
          success: false,
          error: 'BOL rejected by broker'
        };
      }

    } catch (error) {
      console.error('BOL approval failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * STEP 4: Generate and send invoice to vendor via EMAIL
   */
  private static async generateAndSendInvoice(
    submission: BOLSubmission, 
    adjustments?: {
      rate?: number;
      additionalCharges?: Array<{ description: string; amount: number }>;
      deductions?: Array<{ description: string; amount: number }>;
    }
  ): Promise<{
    success: boolean;
    invoiceId?: string;
    amount?: number;
    invoiceUrl?: string;
    error?: string;
  }> {
    try {
      // Generate invoice ID using load identifier system
      const invoiceId = `INV-${submission.loadIdentifierId}-${Date.now().toString().slice(-6)}`;
      
      // Calculate invoice amount
      let baseAmount = this.getLoadRate(submission.loadId);
      
      if (adjustments?.rate) {
        baseAmount = adjustments.rate;
      }
      
      let totalAmount = baseAmount;
      
      // Add additional charges
      if (adjustments?.additionalCharges) {
        totalAmount += adjustments.additionalCharges.reduce((sum, charge) => sum + charge.amount, 0);
      }
      
      // Subtract deductions
      if (adjustments?.deductions) {
        totalAmount -= adjustments.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
      }

      // Generate invoice document
      const invoice = {
        invoiceId,
        loadIdentifierId: submission.loadIdentifierId,
        bolNumber: submission.bolData.bolNumber,
        proNumber: submission.bolData.proNumber,
        shipperName: submission.shipperName,
        brokerName: submission.brokerName,
        driverName: submission.driverName,
        deliveryDate: submission.bolData.deliveryDate,
        amount: totalAmount,
        baseRate: baseAmount,
        adjustments: adjustments || {},
        generatedAt: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        status: 'sent'
      };

      // Store invoice (in production, this would go to a database)
      console.log(`📄 Generated Invoice: ${invoiceId}`);
      console.log(`💰 Amount: $${totalAmount.toLocaleString()}`);

      // Send invoice to vendor via EMAIL ONLY
      await this.sendInvoiceToVendor(submission, invoice);

      // Mock invoice URL (in production, this would be a real PDF/link)
      const invoiceUrl = `/invoices/${invoiceId}.pdf`;

      return {
        success: true,
        invoiceId,
        amount: totalAmount,
        invoiceUrl
      };

    } catch (error) {
      console.error('Invoice generation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send professional invoice email to vendor/shipper
   */
  private static async sendInvoiceToVendor(submission: BOLSubmission, invoice: any): Promise<void> {
    const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const vendorNotification: BOLWorkflowNotification = {
      id: notificationId,
      bolSubmissionId: submission.id,
      type: 'invoice_sent',
      recipientId: submission.shipperId,
      recipientType: 'shipper',
      recipientName: submission.shipperName,
      recipientEmail: submission.shipperEmail,
      message: this.generateProfessionalInvoiceEmail(submission, invoice),
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    this.notifications.push(vendorNotification);

    // Send EMAIL-ONLY notification to vendor
    await this.sendVendorEmailNotification(vendorNotification, submission, invoice);
  }

  /**
   * Send email-only notification to vendor with professional invoice
   */
  private static async sendVendorEmailNotification(
    notification: BOLWorkflowNotification,
    submission: BOLSubmission,
    invoice: any
  ): Promise<void> {
    try {
      // Use existing notification API with EMAIL-ONLY delivery
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: submission.loadIdentifierId,
            origin: 'Invoice Delivery',
            destination: 'Vendor Email',
            rate: `$${invoice.amount}`,
            pickupDate: submission.bolData.deliveryDate,
            equipment: 'Professional Invoice'
          },
          recipients: [{
            id: notification.recipientId,
            email: notification.recipientEmail,
            name: notification.recipientName,
            type: 'shipper'
          }],
          notificationType: 'email', // EMAIL-ONLY for vendor invoices
          messageTemplate: 'custom',
          customMessage: notification.message,
          urgency: 'normal'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        notification.status = 'sent';
        console.log(`📧 Professional invoice EMAIL sent to vendor: ${notification.recipientName}`);
        console.log(`📧 Email address: ${notification.recipientEmail}`);
        console.log(`�� Invoice amount: $${invoice.amount.toLocaleString()}`);
        console.log(`📄 Invoice ID: ${invoice.invoiceId}`);
      } else {
        notification.status = 'failed';
        console.error(`❌ Invoice email failed: ${result.error}`);
      }

    } catch (error) {
      notification.status = 'failed';
      console.error('Invoice email sending error:', error);
    }
  }

  /**
   * Send notification using existing notification system
   * Uses SMS+Email for brokers, Email-only for vendors
   */
  private static async sendNotification(notification: BOLWorkflowNotification): Promise<void> {
    try {
      // Use existing notification API
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loadData: {
            id: notification.bolSubmissionId,
            origin: 'BOL Workflow',
            destination: 'System',
            rate: '$0',
            pickupDate: new Date().toLocaleDateString(),
            equipment: 'BOL Processing'
          },
          recipients: [{
            id: notification.recipientId,
            phone: notification.recipientPhone,
            email: notification.recipientEmail,
            name: notification.recipientName,
            type: notification.recipientType
          }],
          // Email-only for shippers/vendors, both SMS+Email for brokers
          notificationType: notification.recipientType === 'shipper' ? 'email' : 'both',
          messageTemplate: 'custom',
          customMessage: notification.message,
          urgency: notification.type === 'broker_review_request' ? 'high' : 'normal'
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        notification.status = 'sent';
        console.log(`📧 Notification sent: ${notification.type} to ${notification.recipientName}`);
      } else {
        notification.status = 'failed';
        console.error(`❌ Notification failed: ${result.error}`);
      }

    } catch (error) {
      notification.status = 'failed';
      console.error('Notification sending error:', error);
    }
  }

  /**
   * Generate broker review message (SMS + Email)
   */
  private static generateBrokerReviewMessage(submission: BOLSubmission): string {
    return `🚛 BOL REVIEW REQUIRED

📋 Load: ${submission.loadIdentifierId}
🚛 Driver: ${submission.driverName}
📅 Delivered: ${submission.bolData.deliveryDate} at ${submission.bolData.deliveryTime}
📦 Receiver: ${submission.bolData.receiverName}
📷 Photos: ${submission.bolData.deliveryPhotos.length} delivery, ${submission.bolData.pickupPhotos.length} pickup
🔒 Seal: ${submission.bolData.sealNumbers.join(', ')}

⚡ URGENT: Please review and approve BOL to generate vendor invoice.

Login to FleetFlow Broker Portal to review: https://fleetflowapp.com/broker/dashboard

BOL ID: ${submission.id}`;
  }

  /**
   * Generate professional invoice email for vendor
   */
  private static generateProfessionalInvoiceEmail(submission: BOLSubmission, invoice: any): string {
    return `Dear ${submission.shipperName} Accounts Payable,

Your shipment has been successfully delivered and is ready for payment processing.

INVOICE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Invoice Number: ${invoice.invoiceId}
Load Reference: ${submission.loadIdentifierId}
BOL Number: ${submission.bolData.bolNumber}
PRO Number: ${submission.bolData.proNumber}

DELIVERY INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery Date: ${submission.bolData.deliveryDate}
Delivery Time: ${submission.bolData.deliveryTime}
Receiver Name: ${submission.bolData.receiverName}
Driver: ${submission.driverName}
Carrier: ${submission.brokerName}

BILLING INFORMATION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Amount Due: $${invoice.amount.toLocaleString()}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Payment Terms: Net 30 Days

${invoice.baseRate !== invoice.amount ? `
RATE BREAKDOWN:
Base Rate: $${invoice.baseRate.toLocaleString()}
${invoice.adjustments?.additionalCharges?.map((charge: any) => 
  `${charge.description}: +$${charge.amount.toLocaleString()}`).join('\n') || ''}
${invoice.adjustments?.deductions?.map((deduction: any) => 
  `${deduction.description}: -$${deduction.amount.toLocaleString()}`).join('\n') || ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Amount: $${invoice.amount.toLocaleString()}
` : ''}

REMIT PAYMENT TO:
FleetFlow Transportation Services
Accounts Receivable Department
Email: billing@fleetflowapp.com
Reference: ${submission.loadIdentifierId}

For questions regarding this invoice, please contact our billing department or reference the load number ${submission.loadIdentifierId}.

Thank you for your business!

FleetFlow Transportation Services
Professional Freight & Logistics Solutions`;
  }

  /**
   * Notify driver of BOL rejection
   */
  private static async notifyDriverOfRejection(submission: BOLSubmission, reason: string): Promise<void> {
    const notificationId = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const driverNotification: BOLWorkflowNotification = {
      id: notificationId,
      bolSubmissionId: submission.id,
      type: 'broker_review_request',
      recipientId: submission.driverId,
      recipientType: 'driver',
      recipientName: submission.driverName,
      recipientPhone: this.getDriverPhone(submission.driverId),
      message: `❌ BOL REJECTED - Load ${submission.loadIdentifierId}\n\nReason: ${reason}\n\nPlease contact dispatch for next steps.`,
      sentAt: new Date().toISOString(),
      status: 'pending'
    };

    this.notifications.push(driverNotification);
    await this.sendNotification(driverNotification);
  }

  /**
   * Get submission by ID
   */
  static getSubmission(submissionId: string): BOLSubmission | undefined {
    return this.submissions.get(submissionId);
  }

  /**
   * Get all submissions for a broker
   */
  static getBrokerSubmissions(brokerId: string): BOLSubmission[] {
    return Array.from(this.submissions.values()).filter(sub => sub.brokerId === brokerId);
  }

  /**
   * Get all notifications
   */
  static getNotifications(): BOLWorkflowNotification[] {
    return this.notifications;
  }

  /**
   * Helper functions (these would connect to actual data sources in production)
   */
  private static getLoadRate(loadId: string): number {
    // Mock function - would query load database
    return 2500; // Default rate
  }

  private static getBrokerPhone(brokerId: string): string {
    // Mock function - would query user database
    return '+1-555-BROKER';
  }

  private static getDriverPhone(driverId: string): string {
    // Mock function - would query driver database
    return '+1-555-DRIVER';
  }
}

export default BOLWorkflowService;
