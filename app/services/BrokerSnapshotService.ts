// Service for integrating with BROKERSNAPSHOT platform
// Provides functionality to post and manage carrier/driver reviews

import { checkPermission, getCurrentUser } from '../config/access';
import { aiSecurityService } from './AISecurityService';

export interface BrokerSnapshotReview {
  id: string;
  mcNumber: string;
  carrierName: string;
  reviewType: 'payment' | 'service' | 'compliance' | 'communication';
  rating: number; // 1-5 stars
  comment: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'posted' | 'rejected' | 'removed';
  complaintId?: string; // Optional reference to a late payment complaint
  evidenceUrls?: string[]; // URLs to supporting documentation
  responseReceived?: string; // Carrier's response to the review
  verificationCode?: string; // Code used to verify the review
  lastUpdated?: string;
}

class BrokerSnapshotService {
  private reviews: Map<string, BrokerSnapshotReview> = new Map();

  // Post a new review to BROKERSNAPSHOT
  async postReview(
    reviewData: Omit<BrokerSnapshotReview, 'id' | 'status' | 'submittedAt'>
  ): Promise<BrokerSnapshotReview> {
    // Check if user has permission to post reviews
    const { user } = getCurrentUser();
    const hasPermission = checkPermission('broker_snapshot.post_review');

    if (!hasPermission) {
      throw new Error('User does not have permission to post reviews');
    }

    // Validate required fields
    if (
      !reviewData.mcNumber ||
      !reviewData.carrierName ||
      !reviewData.rating ||
      !reviewData.comment
    ) {
      throw new Error('Missing required fields for review');
    }

    // Apply AI security validation for the review content
    const securityValidation = aiSecurityService.validateOperation(
      {
        operation: 'brokersnapshot.review.post',
        prompt: reviewData.comment,
        data: {
          carrier_details: {
            mcNumber: reviewData.mcNumber,
            carrierName: reviewData.carrierName,
          },
          user_details: {
            userId: user.id,
            email: user.email,
          },
        },
        metadata: {
          source: 'BrokerSnapshotService',
          purpose: 'carrier_review',
          userId: user.id,
          sessionId: user.sessionId || undefined,
        },
      },
      'policy_brokersnapshot_default'
    );

    // If security validation fails, throw an error
    if (!securityValidation.allowed) {
      throw new Error(
        `Security validation failed: ${securityValidation.blockReasons?.join(', ')}`
      );
    }

    // Use the sanitized comment from security validation
    const sanitizedComment =
      securityValidation.sanitizedPrompt || reviewData.comment;

    // In production, this would make an API call to BROKERSNAPSHOT
    // For now, we'll simulate the behavior with a local map

    const id = `review_${Date.now()}`;
    const newReview: BrokerSnapshotReview = {
      id,
      ...reviewData,
      comment: sanitizedComment, // Use sanitized comment
      submittedBy: reviewData.submittedBy || user.id,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      lastUpdated: new Date().toISOString(),
    };

    this.reviews.set(id, newReview);

    // In a real implementation, this would wait for the API response
    // Simulate an API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the status to posted (in a real scenario, this might happen after moderation)
    const updatedReview = {
      ...newReview,
      status: 'posted',
      verificationCode: `BS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      lastUpdated: new Date().toISOString(),
    };

    this.reviews.set(id, updatedReview);

    // Log any security warnings
    if (securityValidation.warnings && securityValidation.warnings.length > 0) {
      console.warn(
        `[BROKERSNAPSHOT] Security warnings for review ${id}: ${securityValidation.warnings.join(', ')}`
      );
    }

    console.info(
      `[BROKERSNAPSHOT] Review posted for carrier ${reviewData.carrierName} (MC: ${reviewData.mcNumber})`
    );
    return updatedReview;
  }

  // Post a negative review for late payment
  async postLatePaymentReview(
    mcNumber: string,
    carrierName: string,
    daysOverdue: number,
    invoiceAmount: number,
    invoiceNumber: string,
    complaintId: string
  ): Promise<BrokerSnapshotReview> {
    // Generate an appropriate comment based on days overdue
    let reviewSeverity = '';
    let rating = 3;

    if (daysOverdue >= 120) {
      reviewSeverity = 'SEVERE PAYMENT ISSUES';
      rating = 1;
    } else if (daysOverdue >= 90) {
      reviewSeverity = 'SIGNIFICANT PAYMENT ISSUES';
      rating = 1;
    } else if (daysOverdue >= 60) {
      reviewSeverity = 'PAYMENT ISSUES';
      rating = 2;
    }

    // Generate the review comment
    const comment = `${reviewSeverity}: This carrier is currently ${daysOverdue} days past due on invoice #${invoiceNumber} for $${invoiceAmount.toFixed(2)}. Multiple collection attempts have been unsuccessful. This review has been automatically submitted as part of our accounts receivable process for severely delinquent accounts. Reference ID: ${complaintId}`;

    // First validate the auto-generated comment through AI security
    const securityValidation = aiSecurityService.validateOperation(
      {
        operation: 'brokersnapshot.review.generate',
        prompt: comment,
        data: {
          carrier_details: {
            mcNumber,
            carrierName,
          },
          payment_details: {
            invoiceNumber,
            invoiceAmount,
            daysOverdue,
            complaintId,
          },
        },
        metadata: {
          source: 'LatePaymentComplaintService',
          purpose: 'automated_review',
          userId: 'system',
          sessionId: `complaint_${complaintId}`,
        },
      },
      'policy_brokersnapshot_default'
    );

    // If security validation fails, log the issue but continue with a sanitized version
    // This is an automated system process, so we don't want to block it completely
    if (!securityValidation.allowed) {
      console.error(
        `Security validation warning for automated review: ${securityValidation.blockReasons?.join(', ')}`
      );
    }

    // Use the sanitized comment from security validation or the original if validation passed
    const sanitizedComment = securityValidation.sanitizedPrompt || comment;

    return this.postReview({
      mcNumber,
      carrierName,
      reviewType: 'payment',
      rating,
      comment: sanitizedComment,
      submittedBy: 'system',
      complaintId,
      evidenceUrls: [
        `https://fleetflow.com/invoice-verification/${invoiceNumber}`,
      ],
    });
  }

  // Check if a review already exists for a complaint
  hasReviewForComplaint(complaintId: string): boolean {
    for (const review of this.reviews.values()) {
      if (review.complaintId === complaintId) {
        return true;
      }
    }
    return false;
  }

  // Get all reviews posted for a carrier by MC number
  getReviewsByMC(mcNumber: string): BrokerSnapshotReview[] {
    return Array.from(this.reviews.values()).filter(
      (review) => review.mcNumber === mcNumber
    );
  }

  // Get a specific review by ID
  getReviewById(id: string): BrokerSnapshotReview | undefined {
    return this.reviews.get(id);
  }

  // Get reviews associated with a complaint
  getReviewsByComplaintId(complaintId: string): BrokerSnapshotReview[] {
    return Array.from(this.reviews.values()).filter(
      (review) => review.complaintId === complaintId
    );
  }

  // Update a review (e.g., respond to carrier's response)
  updateReview(
    id: string,
    updates: Partial<BrokerSnapshotReview>
  ): BrokerSnapshotReview | null {
    const review = this.reviews.get(id);
    if (!review) return null;

    const updatedReview = {
      ...review,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  // Remove a review from BROKERSNAPSHOT (e.g., if issue is resolved)
  async removeReview(id: string, reason: string): Promise<boolean> {
    const review = this.reviews.get(id);
    if (!review) return false;

    const { user } = getCurrentUser();

    // Validate the removal reason through AI security
    const securityValidation = aiSecurityService.validateOperation(
      {
        operation: 'brokersnapshot.review.remove',
        prompt: reason,
        data: {
          carrier_details: {
            mcNumber: review.mcNumber,
            carrierName: review.carrierName,
          },
          review_details: {
            reviewId: review.id,
            originalComment: review.comment,
            status: review.status,
            complaintId: review.complaintId,
          },
        },
        metadata: {
          source: 'BrokerSnapshotService',
          purpose: 'review_removal',
          userId: user.id,
          sessionId: user.sessionId || undefined,
        },
      },
      'policy_brokersnapshot_default'
    );

    // If security validation fails, throw an error
    if (!securityValidation.allowed) {
      throw new Error(
        `Security validation failed for review removal: ${securityValidation.blockReasons?.join(', ')}`
      );
    }

    // Use the sanitized reason from security validation
    const sanitizedReason = securityValidation.sanitizedPrompt || reason;

    // In production, this would make an API call to BROKERSNAPSHOT
    // Simulate an API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update status to removed
    const updatedReview = {
      ...review,
      status: 'removed',
      comment: `[REMOVED: ${sanitizedReason}] ${review.comment}`,
      lastUpdated: new Date().toISOString(),
    };

    this.reviews.set(id, updatedReview);

    // Create audit log entry for the removal
    aiSecurityService.validateOperation(
      {
        operation: 'brokersnapshot.review.audit',
        prompt: `Review ${id} removed with reason: ${sanitizedReason}`,
        data: {
          audit_action: 'review_removal',
          review_id: id,
          carrier_mc: review.mcNumber,
          removed_by: user.id,
          removal_reason: sanitizedReason,
        },
        metadata: {
          source: 'BrokerSnapshotService',
          purpose: 'audit_log',
          userId: user.id,
        },
      },
      'policy_brokersnapshot_default'
    );

    console.info(
      `[BROKERSNAPSHOT] Review removed for carrier ${review.carrierName} (MC: ${review.mcNumber})`
    );
    return true;
  }
}

export const brokerSnapshotService = new BrokerSnapshotService();
