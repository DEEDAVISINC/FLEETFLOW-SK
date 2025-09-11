'use client';

interface DocumentVerificationResult {
  verified: boolean;
  confidence: number;
  issues: string[];
  extractedData?: Record<string, any>;
  requiresManualReview: boolean;
}

interface DocumentRequirement {
  id: string;
  name: string;
  category: string;
  required: boolean;
  validationRules: DocumentValidationRule[];
  expirationRequired: boolean;
  minimumCoverage?: number;
}

interface DocumentValidationRule {
  field: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'regex';
  pattern?: string;
  required: boolean;
  minValue?: number;
  maxValue?: number;
  errorMessage: string;
}

interface NotificationTemplate {
  type: 'success' | 'warning' | 'error' | 'info';
  subject: string;
  body: string;
  emailTemplate: string;
  smsTemplate?: string;
}

export class DocumentVerificationService {
  private static documentRequirements: DocumentRequirement[] = [
    {
      id: 'mc_authority',
      name: 'MC Authority Letter',
      category: 'Legal/Regulatory',
      required: true,
      expirationRequired: false,
      validationRules: [
        {
          field: 'mcNumber',
          type: 'regex',
          pattern: '^MC-?\\d{6,7}$',
          required: true,
          errorMessage: 'Valid MC number required (format: MC-123456 or MC123456)'
        },
        {
          field: 'issuedBy',
          type: 'text',
          required: true,
          errorMessage: 'Issuing authority must be specified'
        }
      ]
    },
    {
      id: 'certificate_insurance',
      name: 'Certificate of Insurance',
      category: 'Insurance',
      required: true,
      expirationRequired: true,
      validationRules: [
        {
          field: 'expirationDate',
          type: 'date',
          required: true,
          errorMessage: 'Insurance expiration date required'
        },
        {
          field: 'autoLiabilityCoverage',
          type: 'currency',
          minValue: 1000000,
          required: true,
          errorMessage: 'Auto liability coverage must be at least $1,000,000'
        },
        {
          field: 'cargoCoverage',
          type: 'currency',
          minValue: 100000,
          required: true,
          errorMessage: 'Cargo coverage must be at least $100,000'
        }
      ]
    },
    {
      id: 'w9_form',
      name: 'W-9 Tax Form',
      category: 'Financial',
      required: true,
      expirationRequired: false,
      validationRules: [
        {
          field: 'tinType',
          type: 'text',
          required: true,
          errorMessage: 'Tax identification type required (SSN or EIN)'
        },
        {
          field: 'taxId',
          type: 'regex',
          pattern: '^(\\d{3}-\\d{2}-\\d{4}|\\d{2}-\\d{7})$',
          required: true,
          errorMessage: 'Valid tax ID required (SSN: XXX-XX-XXXX or EIN: XX-XXXXXXX)'
        },
        {
          field: 'signature',
          type: 'text',
          required: true,
          errorMessage: 'W-9 form must be signed'
        }
      ]
    },
    {
      id: 'notice_assignment',
      name: 'Notice of Assignment (Factoring)',
      category: 'Financial',
      required: false,
      expirationRequired: true,
      validationRules: [
        {
          field: 'factoringCompany',
          type: 'text',
          required: true,
          errorMessage: 'Factoring company name required'
        },
        {
          field: 'effectiveDate',
          type: 'date',
          required: true,
          errorMessage: 'Effective date required'
        },
        {
          field: 'expirationDate',
          type: 'date',
          required: true,
          errorMessage: 'Assignment expiration date required'
        }
      ]
    },
    {
      id: 'eld_compliance',
      name: 'ELD Compliance Certificate',
      category: 'Safety/Technology',
      required: true,
      expirationRequired: false,
      validationRules: [
        {
          field: 'eldProvider',
          type: 'text',
          required: true,
          errorMessage: 'ELD provider/manufacturer required'
        },
        {
          field: 'registrationId',
          type: 'text',
          required: true,
          errorMessage: 'ELD registration ID required'
        },
        {
          field: 'complianceCertified',
          type: 'text',
          required: true,
          errorMessage: 'ELD FMCSA compliance certification required'
        }
      ]
    }
  ];

  private static notificationTemplates: Record<string, NotificationTemplate> = {
    documentReceived: {
      type: 'success',
      subject: 'Document Received - {{documentName}}',
      body: 'We have successfully received your {{documentName}}. It is now under review.',
      emailTemplate: `
        <h2>✅ Document Received</h2>
        <p>Dear {{carrierName}},</p>
        <p>We have successfully received your <strong>{{documentName}}</strong> uploaded on {{uploadDate}}.</p>
        <p><strong>Document Status:</strong> Under Review</p>
        <p><strong>Expected Review Time:</strong> 2-4 business hours</p>
        <p>You will receive another notification once the review is complete.</p>
        <p>Thank you for your prompt submission.</p>
        <p>Best regards,<br>FleetFlow Onboarding Team</p>
      `
    },
    documentApproved: {
      type: 'success',
      subject: 'Document Approved - {{documentName}}',
      body: 'Your {{documentName}} has been approved and meets all requirements.',
      emailTemplate: `
        <h2>✅ Document Approved</h2>
        <p>Dear {{carrierName}},</p>
        <p>Great news! Your <strong>{{documentName}}</strong> has been reviewed and approved.</p>
        <p><strong>Approval Date:</strong> {{approvalDate}}</p>
        <p><strong>Valid Until:</strong> {{expirationDate}}</p>
        <p>This document now meets all FleetFlow requirements and is active in our system.</p>
        <p>Best regards,<br>FleetFlow Onboarding Team</p>
      `
    },
    documentRejected: {
      type: 'error',
      subject: 'Document Rejected - {{documentName}} - Action Required',
      body: 'Your {{documentName}} has been rejected. Please review the issues and resubmit.',
      emailTemplate: `
        <h2>❌ Document Rejected - Action Required</h2>
        <p>Dear {{carrierName}},</p>
        <p>Unfortunately, your <strong>{{documentName}}</strong> submitted on {{uploadDate}} has been rejected for the following reasons:</p>
        <ul>
        {{#each issues}}
          <li style="color: #dc3545; margin: 8px 0;">{{this}}</li>
        {{/each}}
        </ul>
        <h3>Next Steps:</h3>
        <ol>
          <li>Review the issues listed above</li>
          <li>Correct the document according to our requirements</li>
          <li>Upload the corrected document through your onboarding portal</li>
        </ol>
        <p><strong>Need Help?</strong> Contact our support team at (555) 123-4567 or support@fleetflowapp.com</p>
        <p>Best regards,<br>FleetFlow Onboarding Team</p>
      `
    },
    documentExpiring: {
      type: 'warning',
      subject: 'Document Expiring Soon - {{documentName}}',
      body: 'Your {{documentName}} will expire in {{daysRemaining}} days. Please renew promptly.',
      emailTemplate: `
        <h2>⚠️ Document Expiring Soon</h2>
        <p>Dear {{carrierName}},</p>
        <p>This is a reminder that your <strong>{{documentName}}</strong> will expire in <strong>{{daysRemaining}} days</strong>.</p>
        <p><strong>Current Expiration Date:</strong> {{expirationDate}}</p>
        <p><strong>Document Type:</strong> {{documentCategory}}</p>
        <p>To avoid any interruption in service, please upload your renewed document before the expiration date.</p>
        <p><strong>Upload Instructions:</strong></p>
        <ol>
          <li>Log into your carrier portal</li>
          <li>Navigate to "Documents"</li>
          <li>Upload the renewed {{documentName}}</li>
        </ol>
        <p>Best regards,<br>FleetFlow Onboarding Team</p>
      `,
      smsTemplate: 'FleetFlow Alert: Your {{documentName}} expires in {{daysRemaining}} days ({{expirationDate}}). Please renew promptly to avoid service interruption.'
    },
    allDocumentsComplete: {
      type: 'success',
      subject: 'All Documents Approved - Onboarding Complete in 24 Hours',
      body: 'Congratulations! All required documents have been approved. Your onboarding will be complete within 24 hours.',
      emailTemplate: `
        <h2>🎉 All Documents Approved!</h2>
        <p>Dear {{carrierName}},</p>
        <p>Excellent news! All your required documents have been reviewed and approved:</p>
        <ul>
        {{#each approvedDocuments}}
          <li style="color: #28a745; margin: 8px 0;">✅ {{this}}</li>
        {{/each}}
        </ul>
        <h3>What Happens Next?</h3>
        <p><strong>Final Processing:</strong> Your complete onboarding package is now in final processing. This takes up to 24 hours.</p>
        <p><strong>Portal Access:</strong> You will receive portal access credentials within 24 hours.</p>
        <p><strong>First Load Assignment:</strong> You will be eligible for load assignments once processing is complete.</p>
        <h3>Important Next Steps:</h3>
        <ol>
          <li>Keep all insurance policies current</li>
          <li>Ensure drivers have current CDLs and medical certificates</li>
          <li>Maintain ELD compliance</li>
          <li>Watch for your portal access email</li>
        </ol>
        <p>Thank you for choosing FleetFlow. We look forward to a successful partnership!</p>
        <p>Best regards,<br>FleetFlow Onboarding Team</p>
      `
    }
  };

  /**
   * Verify uploaded document using OCR and validation rules
   */
  static async verifyDocument(
    file: File, 
    documentType: string, 
    carrierData: any
  ): Promise<DocumentVerificationResult> {
    const requirement = this.documentRequirements.find(req => req.id === documentType);
    if (!requirement) {
      return {
        verified: false,
        confidence: 0,
        issues: ['Unknown document type'],
        requiresManualReview: true
      };
    }

    try {
      // Simulate OCR processing
      const extractedData = await this.simulateOCRExtraction(file, documentType);
      
      // Validate extracted data against rules
      const validationResult = this.validateExtractedData(extractedData, requirement);
      
      // Check for expiration if required
      if (requirement.expirationRequired && extractedData.expirationDate) {
        const expirationCheck = this.checkExpiration(extractedData.expirationDate);
        if (!expirationCheck.valid) {
          validationResult.issues.push(expirationCheck.message);
        }
      }

      return {
        verified: validationResult.issues.length === 0,
        confidence: validationResult.confidence,
        issues: validationResult.issues,
        extractedData,
        requiresManualReview: validationResult.confidence < 0.8 || validationResult.issues.length > 0
      };

    } catch (error) {
      return {
        verified: false,
        confidence: 0,
        issues: ['Document processing failed. Please ensure the document is clear and readable.'],
        requiresManualReview: true
      };
    }
  }

  /**
   * Simulate OCR data extraction based on document type
   */
  private static async simulateOCRExtraction(file: File, documentType: string): Promise<Record<string, any>> {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return simulated extracted data based on document type
    switch (documentType) {
      case 'mc_authority':
        return {
          mcNumber: 'MC-123456',
          issuedBy: 'Federal Motor Carrier Safety Administration',
          carrierName: 'Sample Transport LLC',
          issueDate: '2024-01-15',
          operatingStatus: 'Active'
        };

      case 'certificate_insurance':
        return {
          carrierName: 'Sample Transport LLC',
          policyNumber: 'INS-789456123',
          effectiveDate: '2024-01-01',
          expirationDate: '2025-01-01',
          autoLiabilityCoverage: 1000000,
          cargoCoverage: 100000,
          insuranceCompany: 'Progressive Commercial',
          additionalInsured: 'FleetFlow Logistics LLC'
        };

      case 'w9_form':
        return {
          businessName: 'Sample Transport LLC',
          tinType: 'EIN',
          taxId: '12-3456789',
          address: '123 Main St, City, State 12345',
          signature: 'John Smith',
          signatureDate: '2024-01-10'
        };

      case 'notice_assignment':
        return {
          carrierName: 'Sample Transport LLC',
          factoringCompany: 'Triumph Business Capital',
          effectiveDate: '2024-01-01',
          expirationDate: '2025-01-01',
          assignmentType: 'Accounts Receivable',
          contactPerson: 'Jane Factoring',
          contactPhone: '(555) 123-4567'
        };

      case 'eld_compliance':
        return {
          carrierName: 'Sample Transport LLC',
          eldProvider: 'Samsara',
          registrationId: 'ELD-SM-789456',
          complianceCertified: true,
          certificationDate: '2024-01-01',
          softwareVersion: '2024.1.1'
        };

      default:
        return {
          documentType,
          fileName: file.name,
          fileSize: file.size,
          uploadDate: new Date().toISOString()
        };
    }
  }

  /**
   * Validate extracted data against document requirements
   */
  private static validateExtractedData(
    extractedData: Record<string, any>, 
    requirement: DocumentRequirement
  ): { issues: string[]; confidence: number } {
    const issues: string[] = [];
    let confidence = 1.0;

    for (const rule of requirement.validationRules) {
      const value = extractedData[rule.field];

      if (rule.required && (!value || value === '')) {
        issues.push(rule.errorMessage);
        confidence -= 0.2;
        continue;
      }

      if (!value) continue;

      switch (rule.type) {
        case 'regex':
          if (rule.pattern && !new RegExp(rule.pattern).test(value.toString())) {
            issues.push(rule.errorMessage);
            confidence -= 0.15;
          }
          break;

        case 'number':
        case 'currency':
          const numValue = typeof value === 'number' ? value : parseFloat(value.toString().replace(/[$,]/g, ''));
          if (isNaN(numValue)) {
            issues.push(`${rule.field} must be a valid number`);
            confidence -= 0.1;
          } else {
            if (rule.minValue && numValue < rule.minValue) {
              issues.push(rule.errorMessage);
              confidence -= 0.2;
            }
            if (rule.maxValue && numValue > rule.maxValue) {
              issues.push(rule.errorMessage);
              confidence -= 0.1;
            }
          }
          break;

        case 'date':
          const dateValue = new Date(value);
          if (isNaN(dateValue.getTime())) {
            issues.push(`${rule.field} must be a valid date`);
            confidence -= 0.15;
          }
          break;
      }
    }

    return { issues, confidence: Math.max(confidence, 0) };
  }

  /**
   * Check document expiration
   */
  private static checkExpiration(expirationDate: string): { valid: boolean; message: string; daysRemaining: number } {
    const expDate = new Date(expirationDate);
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysRemaining = Math.ceil((expDate.getTime() - today.getTime()) / msPerDay);

    if (daysRemaining < 0) {
      return {
        valid: false,
        message: 'Document has expired and must be renewed',
        daysRemaining
      };
    }

    if (daysRemaining < 30) {
      return {
        valid: true,
        message: `Document expires in ${daysRemaining} days - renewal recommended`,
        daysRemaining
      };
    }

    return {
      valid: true,
      message: 'Document expiration is acceptable',
      daysRemaining
    };
  }

  /**
   * Send notification to carrier
   */
  static async sendNotification(
    notificationType: string,
    carrierData: any,
    documentData: any,
    additionalData?: any
  ): Promise<{ emailSent: boolean; smsSent: boolean; message: string }> {
    const template = this.notificationTemplates[notificationType];
    if (!template) {
      return { emailSent: false, smsSent: false, message: 'Unknown notification template' };
    }

    try {
      // Simulate email sending
      const emailContent = this.populateTemplate(template.emailTemplate, {
        ...carrierData,
        ...documentData,
        ...additionalData
      });

      console.log(`📧 Email Notification Sent:`);
      console.log(`To: ${carrierData.email}`);
      console.log(`Subject: ${this.populateTemplate(template.subject, documentData)}`);
      console.log(`Content: ${emailContent}`);

      // Simulate SMS if template exists
      let smsSent = false;
      if (template.smsTemplate && carrierData.phone) {
        const smsContent = this.populateTemplate(template.smsTemplate, {
          ...carrierData,
          ...documentData,
          ...additionalData
        });

        console.log(`📱 SMS Notification Sent:`);
        console.log(`To: ${carrierData.phone}`);
        console.log(`Content: ${smsContent}`);
        smsSent = true;
      }

      return {
        emailSent: true,
        smsSent,
        message: 'Notification sent successfully'
      };

    } catch (error) {
      console.error('Notification failed:', error);
      return {
        emailSent: false,
        smsSent: false,
        message: 'Failed to send notification'
      };
    }
  }

  /**
   * Populate template with data
   */
  private static populateTemplate(template: string, data: Record<string, any>): string {
    let result = template;
    
    // Replace simple placeholders
    Object.keys(data).forEach(key => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), data[key] || '');
    });

    // Handle array iterations (simple implementation)
    if (data.issues && Array.isArray(data.issues)) {
      const issuesList = data.issues.map(issue => `<li style="color: #dc3545; margin: 8px 0;">${issue}</li>`).join('');
      result = result.replace(/{{#each issues}}.*?{{\/each}}/s, issuesList);
    }

    if (data.approvedDocuments && Array.isArray(data.approvedDocuments)) {
      const docsList = data.approvedDocuments.map(doc => `<li style="color: #28a745; margin: 8px 0;">✅ ${doc}</li>`).join('');
      result = result.replace(/{{#each approvedDocuments}}.*?{{\/each}}/s, docsList);
    }

    return result;
  }

  /**
   * Get document requirements
   */
  static getDocumentRequirements(): DocumentRequirement[] {
    return this.documentRequirements;
  }

  /**
   * Check if all required documents are complete
   */
  static checkOnboardingCompletion(uploadedDocuments: any[]): {
    complete: boolean;
    requiredRemaining: string[];
    approvedDocuments: string[];
  } {
    const requiredDocs = this.documentRequirements.filter(req => req.required);
    const approvedDocs = uploadedDocuments.filter(doc => doc.status === 'approved');
    
    const approvedDocIds = approvedDocs.map(doc => doc.id);
    const requiredRemaining = requiredDocs
      .filter(req => !approvedDocIds.includes(req.id))
      .map(req => req.name);

    return {
      complete: requiredRemaining.length === 0,
      requiredRemaining,
      approvedDocuments: approvedDocs.map(doc => doc.type || doc.name)
    };
  }
}
