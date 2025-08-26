// Late Payment Complaint Service
// Handles complaint creation, storage, and management for overdue payments

import { brokerSnapshotService } from './BrokerSnapshotService';

export interface LatePaymentComplaint {
  id: string;
  entityType: 'driver' | 'carrier' | 'shipper' | 'vendor';
  entityId: string;
  entityName: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceAmount: number;
  dueDate: string;
  daysOverdue: number;
  description: string;
  priority: 'low' | 'medium' | 'high';
  contactAttempts: string;
  submittedBy: string;
  submittedAt: string;
  status: 'new' | 'in_progress' | 'resolved' | 'cancelled';
  assignedTo?: string;
  resolution?: string;
  resolutionDate?: string;
  followUpActions?: FollowUpAction[];
  lastUpdated?: string;
  // Legal backing fields
  contractReference?: string;
  paymentTerms?: string;
  lateFeePercentage?: number;
  accruedLateFees?: number;
  legalNoticesSent?: LegalNotice[];
  legalDocuments?: LegalDocument[];
  legalNotes?: string;
  mcNumber?: string; // Motor Carrier number for carriers/drivers
  reviewPostedToBrokerSnapshot?: boolean;
  brokerSnapshotReviewId?: string;
  brokerSnapshotReviewDate?: string;
}

export interface FollowUpAction {
  id: string;
  complaintId: string;
  actionType: 'email' | 'call' | 'letter' | 'legal' | 'payment_plan' | 'other';
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'cancelled';
  assignedTo: string;
  completedAt?: string;
  notes?: string;
  // For legal documentation
  hasLegalImplications: boolean;
  communicationEvidence?: string;
  witnessedBy?: string;
}

export interface LegalNotice {
  id: string;
  noticeType: 'reminder' | 'demand_letter' | 'final_notice' | 'legal_action';
  sentDate: string;
  deliveryMethod: 'email' | 'certified_mail' | 'courier' | 'registered_mail';
  trackingNumber?: string;
  deliveryConfirmed: boolean;
  deliveryDate?: string;
  responseReceived: boolean;
  responseDate?: string;
  responseDetails?: string;
  preparedBy: string;
  approvedBy?: string;
}

export interface LegalDocument {
  id: string;
  documentType:
    | 'contract'
    | 'invoice'
    | 'payment_terms'
    | 'correspondence'
    | 'demand_letter'
    | 'proof_of_delivery';
  fileName: string;
  fileUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
  description: string;
  relevance: string;
}

// Standard payment terms reference for consistency
export const STANDARD_PAYMENT_TERMS = {
  'Net 30': {
    description: 'Payment due within 30 days of invoice date',
    lateFeePercentage: 1.5, // 1.5% per month on unpaid balances
    gracePeriod: 5, // 5 days grace period
    legalReference: 'Section 4.2 of Standard Terms & Conditions',
  },
  'Net 45': {
    description: 'Payment due within 45 days of invoice date',
    lateFeePercentage: 1.5,
    gracePeriod: 7,
    legalReference: 'Section 4.2 of Standard Terms & Conditions',
  },
  'Net 60': {
    description: 'Payment due within 60 days of invoice date',
    lateFeePercentage: 1.5,
    gracePeriod: 10,
    legalReference: 'Section 4.2 of Standard Terms & Conditions',
  },
  '2/10 Net 30': {
    description:
      '2% discount if paid within 10 days, otherwise full payment due within 30 days',
    lateFeePercentage: 1.5,
    gracePeriod: 5,
    discountPercentage: 2,
    discountDays: 10,
    legalReference: 'Section 4.3 of Standard Terms & Conditions',
  },
};

// Legal compliance references
export const LEGAL_REFERENCES = {
  // Federal regulations
  federalRegulations: {
    'Prompt Payment Act':
      'Applies to federal government contracts and requires payment within 30 days',
    'Fair Debt Collection Practices Act':
      'Governs debt collection practices to protect debtors from abusive practices',
    'Truth in Lending Act': 'Requires disclosure of terms and costs of credit',
  },
  // State-specific regulations (examples)
  stateRegulations: {
    California: {
      'CA Civil Code § 3287':
        'Interest accrues on unpaid accounts from the day it becomes due',
      'CA Business & Professions Code § 17538.5':
        'Regulates prompt refund requirements',
    },
    Texas: {
      'Texas Finance Code § 302.002': 'Sets legal interest rate on judgments',
      'Texas Property Code § 28.004': 'Regarding prompt payment to contractors',
    },
    New_York: {
      'NY General Obligations Law § 5-501':
        'Regarding interest rates on loans and debts',
      'NY Prompt Payment Act':
        'Requires prompt payment for public works contracts',
    },
  },
  // Industry-specific regulations
  industryRegulations: {
    logistics: {
      'Federal Motor Carrier Safety Administration Regulations':
        'Regarding payment for transportation services',
      '49 CFR Part 377': 'Payment of transportation charges',
    },
    construction: {
      'Prompt Payment Act for Construction':
        'Requirements for timely payment to contractors',
    },
  },
};

class LatePaymentComplaintService {
  private complaints: Map<string, LatePaymentComplaint> = new Map();
  private followUpActions: Map<string, FollowUpAction[]> = new Map();
  private legalNotices: Map<string, LegalNotice[]> = new Map();
  private legalDocuments: Map<string, LegalDocument[]> = new Map();

  // Create a new complaint
  createComplaint(
    complaintData: Omit<LatePaymentComplaint, 'id'>
  ): LatePaymentComplaint {
    const id = `complaint_${Date.now()}`;

    // Calculate late fees if payment terms are specified
    let accruedLateFees = 0;
    if (
      complaintData.paymentTerms &&
      complaintData.lateFeePercentage &&
      complaintData.daysOverdue > 0
    ) {
      // Calculate months overdue (for monthly late fees)
      const monthsOverdue = Math.ceil(complaintData.daysOverdue / 30);
      accruedLateFees =
        complaintData.invoiceAmount *
        (complaintData.lateFeePercentage / 100) *
        monthsOverdue;
    }

    const newComplaint = {
      id,
      ...complaintData,
      lastUpdated: new Date().toISOString(),
      accruedLateFees: accruedLateFees || 0,
      legalNoticesSent: complaintData.legalNoticesSent || [],
      legalDocuments: complaintData.legalDocuments || [],
    };

    this.complaints.set(id, newComplaint);
    return newComplaint;
  }

  // Get all complaints
  async getAllComplaints(): Promise<LatePaymentComplaint[]> {
    // Update all days overdue before returning
    const updatedPromises = Array.from(this.complaints.values()).map(
      (complaint) => this.updateDaysOverdue(complaint)
    );

    const updatedComplaints = await Promise.all(updatedPromises);

    // Sort by days overdue (most overdue first)
    return updatedComplaints.sort((a, b) => b.daysOverdue - a.daysOverdue);
  }

  // Get all complaints (synchronous version - doesn't update BROKERSNAPSHOT)
  getAllComplaintsSync(): LatePaymentComplaint[] {
    return Array.from(this.complaints.values()).sort(
      (a, b) => b.daysOverdue - a.daysOverdue
    );
  }

  // Get a specific complaint by ID
  async getComplaintById(
    id: string
  ): Promise<LatePaymentComplaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;

    // Update days overdue before returning
    return this.updateDaysOverdue(complaint);
  }

  // Get a specific complaint by ID (synchronous version - doesn't update BROKERSNAPSHOT)
  getComplaintByIdSync(id: string): LatePaymentComplaint | undefined {
    return this.complaints.get(id);
  }

  // Get complaints by status
  async getComplaintsByStatus(
    status: LatePaymentComplaint['status']
  ): Promise<LatePaymentComplaint[]> {
    const complaints = await this.getAllComplaints();
    return complaints.filter((complaint) => complaint.status === status);
  }

  // Get complaints by status (synchronous version)
  getComplaintsByStatusSync(
    status: LatePaymentComplaint['status']
  ): LatePaymentComplaint[] {
    return this.getAllComplaintsSync().filter(
      (complaint) => complaint.status === status
    );
  }

  // Get complaints by entity
  async getComplaintsByEntity(
    entityType: LatePaymentComplaint['entityType'],
    entityId: string
  ): Promise<LatePaymentComplaint[]> {
    const complaints = await this.getAllComplaints();
    return complaints.filter(
      (complaint) =>
        complaint.entityType === entityType && complaint.entityId === entityId
    );
  }

  // Get complaints by entity (synchronous version)
  getComplaintsByEntitySync(
    entityType: LatePaymentComplaint['entityType'],
    entityId: string
  ): LatePaymentComplaint[] {
    return this.getAllComplaintsSync().filter(
      (complaint) =>
        complaint.entityType === entityType && complaint.entityId === entityId
    );
  }

  // Update days overdue based on current date
  async updateDaysOverdue(
    complaint: LatePaymentComplaint
  ): Promise<LatePaymentComplaint> {
    // Skip updating if the complaint is already resolved or cancelled
    if (complaint.status === 'resolved' || complaint.status === 'cancelled') {
      return complaint;
    }

    const today = new Date();
    const dueDate = new Date(complaint.dueDate);
    const diffTime = today.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const daysOverdue = diffDays > 0 ? diffDays : 0;

    // Only update if the days overdue has changed
    if (daysOverdue !== complaint.daysOverdue) {
      const updatedComplaint = {
        ...complaint,
        daysOverdue,
        lastUpdated: new Date().toISOString(),
      };

      // Update in the map
      this.complaints.set(complaint.id, updatedComplaint);

      // Update priority based on days overdue
      if (daysOverdue > 60 && updatedComplaint.priority !== 'high') {
        updatedComplaint.priority = 'high';
      } else if (
        daysOverdue > 30 &&
        daysOverdue <= 60 &&
        updatedComplaint.priority !== 'medium'
      ) {
        updatedComplaint.priority = 'medium';
      }

      // Update late fees if applicable
      if (updatedComplaint.lateFeePercentage && updatedComplaint.paymentTerms) {
        const monthsOverdue = Math.ceil(daysOverdue / 30);
        updatedComplaint.accruedLateFees =
          updatedComplaint.invoiceAmount *
          (updatedComplaint.lateFeePercentage / 100) *
          monthsOverdue;
      }

      // Check if this is a carrier/driver that's 60+ days overdue and has an MC number
      if (
        (updatedComplaint.entityType === 'carrier' ||
          updatedComplaint.entityType === 'driver') &&
        updatedComplaint.daysOverdue >= 60 &&
        updatedComplaint.mcNumber &&
        !updatedComplaint.reviewPostedToBrokerSnapshot &&
        updatedComplaint.status !== 'resolved' &&
        updatedComplaint.status !== 'cancelled'
      ) {
        try {
          // Check if there's already a review for this complaint
          const existingReview = brokerSnapshotService.hasReviewForComplaint(
            updatedComplaint.id
          );

          if (!existingReview) {
            // Post review to BROKERSNAPSHOT
            const review = await brokerSnapshotService.postLatePaymentReview(
              updatedComplaint.mcNumber,
              updatedComplaint.entityName,
              updatedComplaint.daysOverdue,
              updatedComplaint.invoiceAmount,
              updatedComplaint.invoiceNumber,
              updatedComplaint.id
            );

            // Update complaint with review information
            updatedComplaint.reviewPostedToBrokerSnapshot = true;
            updatedComplaint.brokerSnapshotReviewId = review.id;
            updatedComplaint.brokerSnapshotReviewDate = review.submittedAt;
            updatedComplaint.lastUpdated = new Date().toISOString();

            // Add a note about the review in the legal notes
            updatedComplaint.legalNotes = `${updatedComplaint.legalNotes || ''}\n[${new Date().toLocaleDateString()}] NOTICE: Due to payment being ${updatedComplaint.daysOverdue} days overdue, a negative review has been automatically posted to BROKERSNAPSHOT under MC# ${updatedComplaint.mcNumber}.`;

            // Update in the map
            this.complaints.set(complaint.id, updatedComplaint);

            console.log(
              `[BROKERSNAPSHOT] Review posted for ${updatedComplaint.entityType} ${updatedComplaint.entityName} (MC: ${updatedComplaint.mcNumber}) due to ${updatedComplaint.daysOverdue} days overdue payment.`
            );
          }
        } catch (error) {
          console.error('Error posting BROKERSNAPSHOT review:', error);
        }
      }

      return updatedComplaint;
    }

    return complaint;
  }

  // Update complaint status
  updateComplaintStatus(
    complaintId: string,
    status: LatePaymentComplaint['status'],
    resolution?: string
  ): LatePaymentComplaint | null {
    const complaint = this.complaints.get(complaintId);

    if (!complaint) return null;

    const updatedComplaint = {
      ...complaint,
      status,
      resolution:
        status === 'resolved'
          ? resolution || complaint.resolution
          : complaint.resolution,
      resolutionDate:
        status === 'resolved'
          ? new Date().toISOString()
          : complaint.resolutionDate,
      lastUpdated: new Date().toISOString(),
    };

    this.complaints.set(complaintId, updatedComplaint);
    return updatedComplaint;
  }

  // Assign complaint to user
  assignComplaint(
    complaintId: string,
    userId: string
  ): LatePaymentComplaint | null {
    const complaint = this.complaints.get(complaintId);

    if (!complaint) return null;

    const updatedComplaint = {
      ...complaint,
      assignedTo: userId,
      status: complaint.status === 'new' ? 'in_progress' : complaint.status,
      lastUpdated: new Date().toISOString(),
    };

    this.complaints.set(complaintId, updatedComplaint);
    return updatedComplaint;
  }

  // Add follow-up action
  addFollowUpAction(action: Omit<FollowUpAction, 'id'>): FollowUpAction {
    const id = `action_${Date.now()}`;
    const newAction = {
      id,
      ...action,
      hasLegalImplications: action.hasLegalImplications || false,
    };

    const existingActions = this.followUpActions.get(action.complaintId) || [];
    this.followUpActions.set(action.complaintId, [
      ...existingActions,
      newAction,
    ]);

    // Update complaint status to in_progress if it's new
    const complaint = this.complaints.get(action.complaintId);
    if (complaint && complaint.status === 'new') {
      this.updateComplaintStatus(action.complaintId, 'in_progress');
    }

    // Update complaint lastUpdated timestamp
    if (complaint) {
      this.complaints.set(action.complaintId, {
        ...complaint,
        lastUpdated: new Date().toISOString(),
      });
    }

    return newAction;
  }

  // Get follow-up actions for a complaint
  getFollowUpActions(complaintId: string): FollowUpAction[] {
    return this.followUpActions.get(complaintId) || [];
  }

  // Mark follow-up action as completed
  completeFollowUpAction(
    actionId: string,
    notes?: string
  ): FollowUpAction | null {
    // Find the action across all complaints
    for (const [complaintId, actions] of this.followUpActions.entries()) {
      const actionIndex = actions.findIndex((action) => action.id === actionId);

      if (actionIndex >= 0) {
        const updatedActions = [...actions];
        updatedActions[actionIndex] = {
          ...updatedActions[actionIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          notes: notes || updatedActions[actionIndex].notes,
        };

        this.followUpActions.set(complaintId, updatedActions);

        // Update complaint lastUpdated timestamp
        const complaint = this.complaints.get(complaintId);
        if (complaint) {
          this.complaints.set(complaintId, {
            ...complaint,
            lastUpdated: new Date().toISOString(),
          });
        }

        return updatedActions[actionIndex];
      }
    }

    return null;
  }

  // Add legal document to complaint
  addLegalDocument(
    complaintId: string,
    document: Omit<LegalDocument, 'id'>
  ): LegalDocument | null {
    const complaint = this.complaints.get(complaintId);
    if (!complaint) return null;

    const id = `doc_${Date.now()}`;
    const newDocument = {
      id,
      ...document,
      uploadedAt: document.uploadedAt || new Date().toISOString(),
    };

    const existingDocuments = complaint.legalDocuments || [];
    const updatedComplaint = {
      ...complaint,
      legalDocuments: [...existingDocuments, newDocument],
      lastUpdated: new Date().toISOString(),
    };

    this.complaints.set(complaintId, updatedComplaint);
    return newDocument;
  }

  // Add legal notice to complaint
  addLegalNotice(
    complaintId: string,
    notice: Omit<LegalNotice, 'id'>
  ): LegalNotice | null {
    const complaint = this.complaints.get(complaintId);
    if (!complaint) return null;

    const id = `notice_${Date.now()}`;
    const newNotice = {
      id,
      ...notice,
      sentDate: notice.sentDate || new Date().toISOString(),
    };

    const existingNotices = complaint.legalNoticesSent || [];
    const updatedComplaint = {
      ...complaint,
      legalNoticesSent: [...existingNotices, newNotice],
      lastUpdated: new Date().toISOString(),
    };

    this.complaints.set(complaintId, updatedComplaint);
    return newNotice;
  }

  // Update payment terms and late fee calculation
  updatePaymentTerms(
    complaintId: string,
    paymentTerms: string,
    lateFeePercentage: number
  ): LatePaymentComplaint | null {
    const complaint = this.complaints.get(complaintId);
    if (!complaint) return null;

    // Validate the payment terms
    const standardTerms = Object.keys(STANDARD_PAYMENT_TERMS);
    const isStandardTerm = standardTerms.includes(paymentTerms);

    let updatedComplaint: LatePaymentComplaint;

    if (isStandardTerm) {
      // Use standard terms
      const termDetails =
        STANDARD_PAYMENT_TERMS[
          paymentTerms as keyof typeof STANDARD_PAYMENT_TERMS
        ];

      // Calculate late fees based on standard terms
      const monthsOverdue = Math.ceil(complaint.daysOverdue / 30);
      const accruedLateFees =
        complaint.invoiceAmount *
        (termDetails.lateFeePercentage / 100) *
        monthsOverdue;

      updatedComplaint = {
        ...complaint,
        paymentTerms,
        lateFeePercentage: termDetails.lateFeePercentage,
        accruedLateFees,
        legalNotes: `${complaint.legalNotes || ''}\nUpdated to standard payment terms: ${paymentTerms} (${termDetails.description}). Reference: ${termDetails.legalReference}. Updated on ${new Date().toLocaleString()}.`,
        lastUpdated: new Date().toISOString(),
      };
    } else {
      // Custom terms
      const monthsOverdue = Math.ceil(complaint.daysOverdue / 30);
      const accruedLateFees =
        complaint.invoiceAmount * (lateFeePercentage / 100) * monthsOverdue;

      updatedComplaint = {
        ...complaint,
        paymentTerms,
        lateFeePercentage,
        accruedLateFees,
        legalNotes: `${complaint.legalNotes || ''}\nUpdated to custom payment terms: ${paymentTerms} with ${lateFeePercentage}% late fee. Updated on ${new Date().toLocaleString()}.`,
        lastUpdated: new Date().toISOString(),
      };
    }

    this.complaints.set(complaintId, updatedComplaint);
    return updatedComplaint;
  }

  // Generate a demand letter template
  generateDemandLetterTemplate(complaintId: string): string | null {
    const complaint = this.getComplaintById(complaintId);
    if (!complaint) return null;

    const today = new Date().toLocaleDateString();
    const totalDue = complaint.invoiceAmount + (complaint.accruedLateFees || 0);

    return `
      [COMPANY LETTERHEAD]

      ${today}

      ${complaint.entityName}
      [ADDRESS LINE 1]
      [ADDRESS LINE 2]
      [CITY, STATE ZIP]

      RE: PAST DUE ACCOUNT - INVOICE ${complaint.invoiceNumber}

      Dear ${complaint.entityType === 'carrier' ? 'Carrier' : complaint.entityType === 'shipper' ? 'Shipper' : complaint.entityType === 'vendor' ? 'Vendor' : 'Driver'} Representative:

      This letter serves as formal notice that your account with our company is seriously past due. Despite previous communications, we have not received payment for the following invoice:

      Invoice Number: ${complaint.invoiceNumber}
      Invoice Date: ${new Date(complaint.invoiceDate).toLocaleDateString()}
      Due Date: ${new Date(complaint.dueDate).toLocaleDateString()}
      Days Past Due: ${complaint.daysOverdue}
      Original Amount Due: $${complaint.invoiceAmount.toFixed(2)}
      Accrued Late Fees: $${(complaint.accruedLateFees || 0).toFixed(2)}
      Total Amount Due: $${totalDue.toFixed(2)}

      Payment Terms: ${complaint.paymentTerms || 'Per our agreement'}

      Your failure to remit payment constitutes a breach of our agreement. Per the terms of our contract, payments not received within the specified timeframe are subject to late fees of ${complaint.lateFeePercentage || '1.5'}% per month.

      We request immediate payment of the total amount due ($${totalDue.toFixed(2)}) within the next five (5) business days. Payment can be made via check, wire transfer, or credit card using the information provided below:

      [PAYMENT INSTRUCTIONS]

      If payment is not received by [DATE 5 BUSINESS DAYS FROM TODAY], we will be forced to take the following actions:

      1. Suspension of all services
      2. Referral to collections
      3. Reporting to credit bureaus
      4. Possible legal action to recover the debt, plus additional costs including court fees, attorney fees, and interest

      If you believe this invoice has been paid or if you wish to discuss a payment arrangement, please contact our accounts receivable department immediately at [PHONE] or [EMAIL].

      Sincerely,

      [NAME]
      [TITLE]
      [COMPANY NAME]
      [CONTACT INFORMATION]

      This is an attempt to collect a debt. Any information obtained will be used for that purpose.
    `;
  }

  // Get all overdue complaints
  getOverdueComplaints(daysThreshold: number = 30): LatePaymentComplaint[] {
    // Update all complaints first
    const allComplaints = this.getAllComplaints();

    return allComplaints.filter((complaint) => {
      if (complaint.status === 'resolved' || complaint.status === 'cancelled')
        return false;

      return complaint.daysOverdue >= daysThreshold;
    });
  }

  // Post review to BROKERSNAPSHOT manually
  async postBrokerSnapshotReview(
    complaintId: string,
    mcNumber: string
  ): Promise<boolean> {
    const complaint = this.complaints.get(complaintId);
    if (!complaint) return false;

    // Only post for carriers or drivers
    if (
      complaint.entityType !== 'carrier' &&
      complaint.entityType !== 'driver'
    ) {
      throw new Error(
        'BROKERSNAPSHOT reviews can only be posted for carriers or drivers'
      );
    }

    try {
      // Check if there's already a review for this complaint
      if (complaint.reviewPostedToBrokerSnapshot) {
        console.log(
          `[BROKERSNAPSHOT] Review already posted for complaint ${complaintId}`
        );
        return false;
      }

      // Post review to BROKERSNAPSHOT
      const review = await brokerSnapshotService.postLatePaymentReview(
        mcNumber,
        complaint.entityName,
        complaint.daysOverdue,
        complaint.invoiceAmount,
        complaint.invoiceNumber,
        complaint.id
      );

      // Update complaint with review information and MC number
      const updatedComplaint = {
        ...complaint,
        mcNumber,
        reviewPostedToBrokerSnapshot: true,
        brokerSnapshotReviewId: review.id,
        brokerSnapshotReviewDate: review.submittedAt,
        lastUpdated: new Date().toISOString(),
        legalNotes: `${complaint.legalNotes || ''}\n[${new Date().toLocaleDateString()}] NOTICE: Review manually posted to BROKERSNAPSHOT under MC# ${mcNumber}.`,
      };

      // Update in the map
      this.complaints.set(complaintId, updatedComplaint);

      console.log(
        `[BROKERSNAPSHOT] Review manually posted for ${complaint.entityType} ${complaint.entityName} (MC: ${mcNumber})`
      );
      return true;
    } catch (error) {
      console.error('Error posting BROKERSNAPSHOT review:', error);
      return false;
    }
  }

  // Remove review from BROKERSNAPSHOT
  async removeBrokerSnapshotReview(
    complaintId: string,
    reason: string
  ): Promise<boolean> {
    const complaint = this.complaints.get(complaintId);
    if (
      !complaint ||
      !complaint.reviewPostedToBrokerSnapshot ||
      !complaint.brokerSnapshotReviewId
    ) {
      return false;
    }

    try {
      // Remove review from BROKERSNAPSHOT
      const success = await brokerSnapshotService.removeReview(
        complaint.brokerSnapshotReviewId,
        reason
      );

      if (success) {
        // Update complaint to reflect removed review
        const updatedComplaint = {
          ...complaint,
          reviewPostedToBrokerSnapshot: false,
          lastUpdated: new Date().toISOString(),
          legalNotes: `${complaint.legalNotes || ''}\n[${new Date().toLocaleDateString()}] NOTICE: BROKERSNAPSHOT review removed. Reason: ${reason}`,
        };

        // Update in the map
        this.complaints.set(complaintId, updatedComplaint);

        console.log(
          `[BROKERSNAPSHOT] Review removed for ${complaint.entityType} ${complaint.entityName} (MC: ${complaint.mcNumber})`
        );
      }

      return success;
    } catch (error) {
      console.error('Error removing BROKERSNAPSHOT review:', error);
      return false;
    }
  }

  // Generate analytics report
  async generateAnalyticsReport() {
    // Make sure all complaints are up to date first
    const allComplaints = await this.getAllComplaints();

    return {
      totalComplaints: allComplaints.length,
      byStatus: {
        new: allComplaints.filter((c) => c.status === 'new').length,
        inProgress: allComplaints.filter((c) => c.status === 'in_progress')
          .length,
        resolved: allComplaints.filter((c) => c.status === 'resolved').length,
        cancelled: allComplaints.filter((c) => c.status === 'cancelled').length,
      },
      byEntityType: {
        driver: allComplaints.filter((c) => c.entityType === 'driver').length,
        carrier: allComplaints.filter((c) => c.entityType === 'carrier').length,
        shipper: allComplaints.filter((c) => c.entityType === 'shipper').length,
        vendor: allComplaints.filter((c) => c.entityType === 'vendor').length,
      },
      totalOutstandingAmount: allComplaints
        .filter((c) => c.status !== 'resolved' && c.status !== 'cancelled')
        .reduce((sum, complaint) => sum + complaint.invoiceAmount, 0),
      totalLateFees: allComplaints
        .filter((c) => c.status !== 'resolved' && c.status !== 'cancelled')
        .reduce((sum, complaint) => sum + (complaint.accruedLateFees || 0), 0),
      averageDaysOverdue:
        allComplaints
          .filter((c) => c.status !== 'resolved' && c.status !== 'cancelled')
          .reduce((sum, complaint) => sum + c.daysOverdue, 0) /
        (allComplaints.filter(
          (c) => c.status !== 'resolved' && c.status !== 'cancelled'
        ).length || 1),
      legalNoticesSent: allComplaints.reduce(
        (sum, complaint) => sum + (complaint.legalNoticesSent?.length || 0),
        0
      ),
      brokerSnapshotReviewsPosted: allComplaints.filter(
        (c) => c.reviewPostedToBrokerSnapshot
      ).length,
    };
  }
}

export const latePaymentComplaintService = new LatePaymentComplaintService();
