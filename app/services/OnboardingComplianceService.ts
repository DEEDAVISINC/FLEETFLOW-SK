/**
 * OnboardingComplianceService
 * Connects carrier onboarding with compliance verification
 * Ensures all carriers meet compliance requirements before activation
 */

export interface CarrierDocument {
  id: string;
  carrierId: string;
  dotNumber: string;
  type: string;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  expirationDate?: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface OnboardingComplianceVerification {
  carrierId: string;
  dotNumber: string;
  overallStatus: 'pending' | 'in_progress' | 'approved' | 'rejected';
  dotAuthorityVerified: boolean;
  insuranceVerified: boolean;
  w9Verified: boolean;
  safetyRating: string;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  requiredDocuments: CarrierDocument[];
  optionalDocuments: CarrierDocument[];
  missingDocuments: string[];
  verificationDate?: string;
  verificationNotes?: string;
}

export interface OnboardingComplianceRequest {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  documents: CarrierDocument[];
}

class OnboardingComplianceService {
  /**
   * Process a new carrier onboarding for compliance verification
   */
  async processOnboarding(
    request: OnboardingComplianceRequest
  ): Promise<OnboardingComplianceVerification> {
    console.log(
      `🔍 Processing compliance verification for carrier ${request.carrierId} (DOT# ${request.dotNumber})`
    );

    // Start with initial verification object
    const verification: OnboardingComplianceVerification = {
      carrierId: request.carrierId,
      dotNumber: request.dotNumber,
      overallStatus: 'pending',
      dotAuthorityVerified: false,
      insuranceVerified: false,
      w9Verified: false,
      safetyRating: 'UNRATED',
      complianceScore: 0,
      riskLevel: 'medium', // Default to medium until verified
      requiredDocuments: [],
      optionalDocuments: [],
      missingDocuments: this.getRequiredDocumentTypes(), // Start with all required docs as missing
    };

    // Process submitted documents
    await this.processDocuments(verification, request.documents);

    // Verify DOT authority
    await this.verifyDOTAuthority(verification);

    // Calculate compliance score and risk level
    this.calculateComplianceScore(verification);

    // Determine overall status
    this.determineOverallStatus(verification);

    return verification;
  }

  /**
   * Process a batch of uploaded documents for compliance verification
   */
  async processDocuments(
    verification: OnboardingComplianceVerification,
    documents: CarrierDocument[]
  ): Promise<void> {
    const requiredDocTypes = this.getRequiredDocumentTypes();
    const optionalDocTypes = this.getOptionalDocumentTypes();

    // Group documents by type
    verification.requiredDocuments = documents.filter((doc) =>
      requiredDocTypes.includes(doc.type)
    );

    verification.optionalDocuments = documents.filter((doc) =>
      optionalDocTypes.includes(doc.type)
    );

    // Update missing documents list
    const submittedTypes = documents.map((doc) => doc.type);
    verification.missingDocuments = requiredDocTypes.filter(
      (type) => !submittedTypes.includes(type)
    );

    // Check insurance document
    const insuranceDocs = documents.filter((doc) => doc.type === 'insurance');
    verification.insuranceVerified =
      insuranceDocs.length > 0 &&
      insuranceDocs.some((doc) => doc.status === 'verified');

    // Check W9 document
    const w9Docs = documents.filter((doc) => doc.type === 'w9');
    verification.w9Verified =
      w9Docs.length > 0 && w9Docs.some((doc) => doc.status === 'verified');
  }

  /**
   * Verify DOT authority using external API call
   */
  private async verifyDOTAuthority(
    verification: OnboardingComplianceVerification
  ): Promise<void> {
    try {
      // In real implementation, this would make an API call to FMCSA
      // For this implementation, we'll simulate a verification result
      const dotNumber = verification.dotNumber;

      // Simple verification based on DOT number format
      // In a real implementation, this would call a proper API
      const isValidDot = /^\d{6,8}$/.test(dotNumber);

      verification.dotAuthorityVerified = isValidDot;

      // Set safety rating (this would come from the API)
      verification.safetyRating = this.getSimulatedSafetyRating(dotNumber);

      console.log(
        `DOT Authority verification for ${dotNumber}: ${isValidDot ? 'VALID' : 'INVALID'}`
      );
    } catch (error) {
      console.error('Error verifying DOT authority:', error);
      verification.dotAuthorityVerified = false;
    }
  }

  /**
   * Calculate compliance score based on document status and verifications
   */
  private calculateComplianceScore(
    verification: OnboardingComplianceVerification
  ): void {
    let score = 0;

    // Required verifications (70% of total score)
    if (verification.dotAuthorityVerified) score += 30;
    if (verification.insuranceVerified) score += 30;
    if (verification.w9Verified) score += 10;

    // Missing documents (penalize score)
    const missingPenalty = verification.missingDocuments.length * 10;
    score = Math.max(0, score - missingPenalty);

    // Safety rating bonus (up to 30% of total score)
    switch (verification.safetyRating) {
      case 'SATISFACTORY':
        score += 30;
        break;
      case 'CONDITIONAL':
        score += 15;
        break;
      case 'UNSATISFACTORY':
        score = Math.max(0, score - 20); // Penalty
        break;
      default:
        // No adjustment for UNRATED
        break;
    }

    // Cap score at 100
    verification.complianceScore = Math.min(100, Math.max(0, score));

    // Determine risk level based on score
    if (verification.complianceScore >= 80) {
      verification.riskLevel = 'low';
    } else if (verification.complianceScore >= 60) {
      verification.riskLevel = 'medium';
    } else {
      verification.riskLevel = 'high';
    }
  }

  /**
   * Determine overall onboarding status based on compliance verifications
   */
  private determineOverallStatus(
    verification: OnboardingComplianceVerification
  ): void {
    // Automatic rejection criteria
    if (verification.safetyRating === 'UNSATISFACTORY') {
      verification.overallStatus = 'rejected';
      return;
    }

    // Required verifications for approval
    const requiredVerifications = [
      verification.dotAuthorityVerified,
      verification.insuranceVerified,
      verification.w9Verified,
    ];

    // If any required document is missing, status is pending
    if (verification.missingDocuments.length > 0) {
      verification.overallStatus = 'pending';
      return;
    }

    // If not all required verifications are complete, status is in progress
    if (!requiredVerifications.every((v) => v)) {
      verification.overallStatus = 'in_progress';
      return;
    }

    // All requirements met, approve
    verification.overallStatus = 'approved';
    verification.verificationDate = new Date().toISOString();
  }

  /**
   * Process compliance status updates for an existing carrier
   */
  async updateComplianceStatus(
    carrierId: string,
    dotNumber: string,
    updates: Partial<OnboardingComplianceVerification>
  ): Promise<OnboardingComplianceVerification> {
    // In a real implementation, this would fetch the existing record
    // For this implementation, we'll create a basic record
    const verification: OnboardingComplianceVerification = {
      carrierId,
      dotNumber,
      overallStatus: 'in_progress',
      dotAuthorityVerified: false,
      insuranceVerified: false,
      w9Verified: false,
      safetyRating: 'UNRATED',
      complianceScore: 0,
      riskLevel: 'medium',
      requiredDocuments: [],
      optionalDocuments: [],
      missingDocuments: [],
    };

    // Apply updates
    Object.assign(verification, updates);

    // Recalculate compliance score
    this.calculateComplianceScore(verification);

    // Determine overall status
    this.determineOverallStatus(verification);

    return verification;
  }

  /**
   * Get list of required document types for onboarding
   */
  getRequiredDocumentTypes(): string[] {
    return ['operating_authority', 'insurance', 'w9', 'driver_qualification'];
  }

  /**
   * Get list of optional document types for onboarding
   */
  getOptionalDocumentTypes(): string[] {
    return [
      'hazmat_certification',
      'broker_agreement',
      'carrier_packet',
      'driver_handbook_acknowledgement',
    ];
  }

  /**
   * Generate a simulated safety rating for testing
   */
  private getSimulatedSafetyRating(dotNumber: string): string {
    // In a real implementation, this would come from the FMCSA API
    // For this implementation, we'll generate a consistent rating based on DOT number
    const lastDigit = parseInt(dotNumber.charAt(dotNumber.length - 1));

    if (lastDigit >= 7) {
      return 'SATISFACTORY';
    } else if (lastDigit >= 3) {
      return 'CONDITIONAL';
    } else if (lastDigit === 0) {
      return 'UNSATISFACTORY';
    } else {
      return 'UNRATED';
    }
  }
}

// Export singleton instance
export const onboardingComplianceService = new OnboardingComplianceService();
