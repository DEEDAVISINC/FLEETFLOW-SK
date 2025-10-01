/**
 * FLEETFLOW SURETYCLOUD MANUAL INTEGRATION SERVICE
 *
 * Integration with SuretyCloud for customs bond management without APIs.
 * Since SuretyCloud doesn't offer APIs, this service provides:
 * - Automated bond application form generation for manual SuretyCloud submission
 * - Email automation for SuretyCloud communications
 * - Status tracking and renewal management
 * - Document preparation and compliance checklists
 * - Bond renewal reminders and tracking
 * - Multi-surety company workflow management
 */

import {
  BondRenewal,
  BondStatus,
  CustomsBond,
  customsBondService,
} from './CustomsBondService';

export interface SuretyCloudSettings {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
  suretyCloudLoginEmail?: string; // Optional SuretyCloud account email
  notificationEmail: string; // Where to send SuretyCloud updates
  preferredSuretyCompanies: string[]; // Preferred surety companies to contact
}

export interface BondApplicationData {
  bondType: 'SINGLE' | 'CONTINUOUS' | 'ANNUAL';
  bondAmount: number;
  principalName: string;
  principalAddress: string;
  principalPhone: string;
  principalEmail: string;
  importerOfRecord?: string;
  portsOfEntry: string[];
  commodities: string[];
  estimatedAnnualValue: number;
  complianceDocuments: string[]; // URLs or file references
}

export interface GeneratedApplication {
  fleetFlowBond: CustomsBond;
  suretyCloudApplicationForm: string; // HTML form for SuretyCloud
  emailTemplate: string; // Email to SuretyCloud support
  documentChecklist: string[]; // Required documents
  submissionInstructions: string; // Step-by-step instructions
}

export interface StatusUpdateRequest {
  bondId: string;
  newStatus: BondStatus;
  suretyCompany?: string;
  notes?: string;
  effectiveDate?: Date;
  expiryDate?: Date;
}

export class SuretyCloudManualIntegrationService {
  private settings: SuretyCloudSettings | null = null;

  /**
   * CONFIGURATION & SETUP
   */

  /**
   * Configure SuretyCloud integration settings
   */
  async configureSettings(settings: SuretyCloudSettings): Promise<void> {
    this.settings = settings;
    console.log(
      '✅ SuretyCloud manual integration configured for:',
      settings.organizationName
    );
  }

  /**
   * Validate settings configuration
   */
  async validateSettings(): Promise<boolean> {
    if (!this.settings) {
      throw new Error('SuretyCloud settings not configured');
    }

    const hasRequiredFields = !!(
      this.settings.organizationName &&
      this.settings.contactEmail &&
      this.settings.contactPhone &&
      this.settings.notificationEmail
    );

    return hasRequiredFields;
  }

  /**
   * BOND APPLICATION GENERATION
   */

  /**
   * Generate complete bond application package for SuretyCloud submission
   */
  async generateBondApplication(
    applicationData: BondApplicationData
  ): Promise<GeneratedApplication> {
    if (!this.settings) {
      throw new Error('SuretyCloud settings not configured');
    }

    try {
      // Create FleetFlow bond record for tracking
      const fleetFlowBond = await customsBondService.registerBond({
        bondNumber: `FF-${Date.now()}`, // FleetFlow tracking number
        bondType: applicationData.bondType,
        suretyCompany: 'SuretyCloud Application Pending',
        principalName: applicationData.principalName,
        importerOfRecord: applicationData.importerOfRecord,
        bondAmount: applicationData.bondAmount,
        currency: 'USD',
        effectiveDate: new Date(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year default
        portsCovered: applicationData.portsOfEntry,
        status: 'PENDING',
        maxUtilizationAmount: applicationData.bondAmount,
      });

      // Generate SuretyCloud application form
      const applicationForm = this.generateApplicationForm(
        applicationData,
        fleetFlowBond
      );

      // Generate email template
      const emailTemplate = this.generateEmailTemplate(
        applicationData,
        fleetFlowBond
      );

      // Generate document checklist
      const documentChecklist = this.generateDocumentChecklist(applicationData);

      // Generate submission instructions
      const submissionInstructions = this.generateSubmissionInstructions();

      // Record application activity
      await customsBondService.recordActivity({
        bondId: fleetFlowBond.id,
        activityType: 'ENTRY',
        entryNumber: `FF-${fleetFlowBond.id}`,
        amount: 0,
        description:
          'Bond application package generated for SuretyCloud submission',
        portOfEntry: applicationData.portsOfEntry[0],
      });

      console.log(
        `✅ Bond application package generated: ${fleetFlowBond.bondNumber}`
      );

      return {
        fleetFlowBond,
        suretyCloudApplicationForm: applicationForm,
        emailTemplate,
        documentChecklist,
        submissionInstructions,
      };
    } catch (error) {
      console.error('Bond application generation failed:', error);
      throw new Error(`Application generation failed: ${error.message}`);
    }
  }

  /**
   * Generate SuretyCloud application form (HTML)
   */
  private generateApplicationForm(
    data: BondApplicationData,
    bond: CustomsBond
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Customs Bond Application - ${bond.bondNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; }
        .value { background: #f8f9fa; padding: 8px; border-radius: 4px; }
        .instructions { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Customs Bond Application</h1>
        <p><strong>FleetFlow Reference:</strong> ${bond.bondNumber}</p>
        <p><strong>Application Date:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="instructions">
        <h3>Instructions for SuretyCloud Submission:</h3>
        <ol>
            <li>Log into your SuretyCloud account at https://www.suretycloud.com</li>
            <li>Navigate to "New Bond Application"</li>
            <li>Fill out the form using the information below</li>
            <li>Upload all required documents from the checklist</li>
            <li>Submit the application</li>
            <li>Email confirmation to: ${this.settings?.notificationEmail}</li>
        </ol>
    </div>

    <div class="section">
        <h2>Bond Information</h2>
        <div class="field">
            <div class="label">Bond Type:</div>
            <div class="value">${data.bondType} ENTRY BOND</div>
        </div>
        <div class="field">
            <div class="label">Bond Amount:</div>
            <div class="value">$${data.bondAmount.toLocaleString()} USD</div>
        </div>
        <div class="field">
            <div class="label">Estimated Annual Value:</div>
            <div class="value">$${data.estimatedAnnualValue.toLocaleString()} USD</div>
        </div>
    </div>

    <div class="section">
        <h2>Principal Information</h2>
        <div class="field">
            <div class="label">Company Name:</div>
            <div class="value">${data.principalName}</div>
        </div>
        <div class="field">
            <div class="label">Address:</div>
            <div class="value">${data.principalAddress}</div>
        </div>
        <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${data.principalPhone}</div>
        </div>
        <div class="field">
            <div class="label">Email:</div>
            <div class="value">${data.principalEmail}</div>
        </div>
        ${
          data.importerOfRecord
            ? `
        <div class="field">
            <div class="label">Importer of Record:</div>
            <div class="value">${data.importerOfRecord}</div>
        </div>
        `
            : ''
        }
    </div>

    <div class="section">
        <h2>Trade Information</h2>
        <div class="field">
            <div class="label">Ports of Entry:</div>
            <div class="value">${data.portsOfEntry.join(', ')}</div>
        </div>
        <div class="field">
            <div class="label">Commodities:</div>
            <div class="value">${data.commodities.join(', ')}</div>
        </div>
    </div>

    <div class="section">
        <h2>Contact Information</h2>
        <div class="field">
            <div class="label">Organization:</div>
            <div class="value">${this.settings?.organizationName}</div>
        </div>
        <div class="field">
            <div class="label">Contact Email:</div>
            <div class="value">${this.settings?.contactEmail}</div>
        </div>
        <div class="field">
            <div class="label">Contact Phone:</div>
            <div class="value">${this.settings?.contactPhone}</div>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Generate email template for SuretyCloud
   */
  private generateEmailTemplate(
    data: BondApplicationData,
    bond: CustomsBond
  ): string {
    const subject = `Customs Bond Application - ${bond.bondNumber} - ${data.principalName}`;

    const body = `Subject: ${subject}

Dear SuretyCloud Support Team,

Please find attached a customs bond application for:

Principal: ${data.principalName}
Bond Type: ${data.bondType} Entry Bond
Bond Amount: $${data.bondAmount.toLocaleString()} USD
FleetFlow Reference: ${bond.bondNumber}

Application Details:
- Ports of Entry: ${data.portsOfEntry.join(', ')}
- Commodities: ${data.commodities.join(', ')}
- Estimated Annual Value: $${data.estimatedAnnualValue.toLocaleString()} USD

Contact Information:
- Organization: ${this.settings?.organizationName}
- Email: ${this.settings?.contactEmail}
- Phone: ${this.settings?.contactPhone}

Please process this application and provide status updates to:
${this.settings?.notificationEmail}

Attached:
- Bond Application Form (HTML)
- Required Documentation Checklist
- Supporting Documents (as applicable)

Thank you for your assistance.

Best regards,
${this.settings?.organizationName}
FleetFlow TMS Integration
Reference: ${bond.bondNumber}`;

    return body;
  }

  /**
   * Generate document checklist
   */
  private generateDocumentChecklist(data: BondApplicationData): string[] {
    const checklist = [
      '✓ Business License or Articles of Incorporation',
      '✓ Tax ID (EIN) Documentation',
      '✓ Financial Statements (last 2 years)',
      '✓ Bank References (2 required)',
      '✓ Personal Financial Statement (if applicable)',
      '✓ Resume/Bio of Company Principals',
      '✓ Trade References (3 required)',
      '✓ Proof of Insurance (General Liability)',
    ];

    // Add bond-specific requirements
    if (data.bondType === 'CONTINUOUS') {
      checklist.push('✓ Annual Financial Review');
      checklist.push('✓ Continuous Bond Rider (if applicable)');
    }

    // Add commodity-specific requirements
    if (data.commodities.some((c) => c.toLowerCase().includes('alcohol'))) {
      checklist.push('✓ TTB Permit (Alcohol and Tobacco Tax and Trade Bureau)');
    }

    if (data.commodities.some((c) => c.toLowerCase().includes('tobacco'))) {
      checklist.push('✓ Tobacco License');
    }

    return checklist;
  }

  /**
   * Generate submission instructions
   */
  private generateSubmissionInstructions(): string {
    return `
SURETYCLOUD BOND APPLICATION SUBMISSION INSTRUCTIONS

1. ACCESS SURETYCLOUD:
   - Visit: https://www.suretycloud.com/SuretyCloud/login.jsf
   - Log in with your SuretyCloud account credentials

2. START NEW APPLICATION:
   - Navigate to "New Bond Application" or "Apply for Bond"
   - Select "Customs Bond" as the bond type

3. COMPLETE APPLICATION FORM:
   - Use the attached HTML form as your guide
   - Fill in all required fields accurately
   - Upload all documents from the checklist

4. SUBMIT APPLICATION:
   - Review all information for accuracy
   - Submit the application
   - Note the application reference number

5. NOTIFICATION SETUP:
   - Email confirmation to: ${this.settings?.notificationEmail}
   - Include FleetFlow reference: ${this.generateReferenceNumber()}

6. STATUS TRACKING:
   - Log back into SuretyCloud to check status
   - Update FleetFlow when status changes occur

IMPORTANT NOTES:
- Keep all original documents for your records
- Response time is typically 5-10 business days
- Additional information may be requested
- Bond premium quotes will be provided upon approval

For questions, contact SuretyCloud support or your FleetFlow representative.`;
  }

  /**
   * STATUS MANAGEMENT & TRACKING
   */

  /**
   * Manually update bond status (when you receive updates from SuretyCloud)
   */
  async updateBondStatus(update: StatusUpdateRequest): Promise<void> {
    const bond = await customsBondService.getBond(update.bondId);
    if (!bond) throw new Error('Bond not found');

    // Update bond status
    await customsBondService.updateBond(update.bondId, {
      status: update.newStatus,
      suretyCompany: update.suretyCompany || bond.suretyCompany,
    });

    // If active, set dates
    if (update.newStatus === 'ACTIVE') {
      await customsBondService.updateBond(update.bondId, {
        effectiveDate: update.effectiveDate || new Date(),
        expiryDate:
          update.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
    }

    // Record status update activity
    await customsBondService.recordActivity({
      bondId: update.bondId,
      activityType: update.newStatus === 'ACTIVE' ? 'ENTRY' : 'RELEASE',
      entryNumber: bond.bondNumber,
      amount: 0,
      description: `Bond status updated: ${update.newStatus}${update.notes ? ` - ${update.notes}` : ''}`,
    });

    console.log(
      `✅ Bond status updated: ${bond.bondNumber} -> ${update.newStatus}`
    );
  }

  /**
   * RENEWAL MANAGEMENT
   */

  /**
   * Generate renewal application package
   */
  async generateRenewalApplication(bondId: string): Promise<{
    renewalPackage: BondRenewal;
    renewalForm: string;
    emailTemplate: string;
  }> {
    const bond = await customsBondService.getBond(bondId);
    if (!bond) throw new Error('Bond not found');

    // Create renewal record
    const renewal = await customsBondService.scheduleRenewal({
      bondId,
      renewalDate: new Date(),
      newExpiry: new Date(
        bond.expiryDate.getTime() + 365 * 24 * 60 * 60 * 1000
      ),
      renewalAmount: bond.bondAmount,
      renewalFee: 0, // To be determined by surety
    });

    // Generate renewal form
    const renewalForm = this.generateRenewalForm(bond, renewal);

    // Generate renewal email
    const emailTemplate = this.generateRenewalEmail(bond, renewal);

    console.log(`✅ Renewal package generated for bond: ${bond.bondNumber}`);

    return {
      renewalPackage: renewal,
      renewalForm: renewalForm,
      emailTemplate: emailTemplate,
    };
  }

  /**
   * Generate renewal form
   */
  private generateRenewalForm(bond: CustomsBond, renewal: BondRenewal): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>Bond Renewal Application - ${bond.bondNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #333; }
        .value { background: #f8f9fa; padding: 8px; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Bond Renewal Application</h1>
        <p><strong>Original Bond:</strong> ${bond.bondNumber}</p>
        <p><strong>Renewal Date:</strong> ${renewal.renewalDate.toLocaleDateString()}</p>
    </div>

    <div class="section">
        <h2>Current Bond Information</h2>
        <div class="field">
            <div class="label">Surety Company:</div>
            <div class="value">${bond.suretyCompany}</div>
        </div>
        <div class="field">
            <div class="label">Bond Type:</div>
            <div class="value">${bond.bondType}</div>
        </div>
        <div class="field">
            <div class="label">Current Amount:</div>
            <div class="value">$${bond.bondAmount.toLocaleString()}</div>
        </div>
        <div class="field">
            <div class="label">Current Expiry:</div>
            <div class="value">${bond.expiryDate.toLocaleDateString()}</div>
        </div>
    </div>

    <div class="section">
        <h2>Renewal Information</h2>
        <div class="field">
            <div class="label">Requested Expiry:</div>
            <div class="value">${renewal.newExpiry.toLocaleDateString()}</div>
        </div>
        <div class="field">
            <div class="label">Renewal Amount:</div>
            <div class="value">$${renewal.renewalAmount?.toLocaleString() || bond.bondAmount.toLocaleString()}</div>
        </div>
    </div>

    <div class="section">
        <h3>Renewal Instructions:</h3>
        <ol>
            <li>Contact your SuretyCloud representative</li>
            <li>Request bond renewal using this form</li>
            <li>Provide updated financial information if required</li>
            <li>Confirm renewal fee and processing timeline</li>
        </ol>
    </div>
</body>
</html>`;
  }

  /**
   * Generate renewal email template
   */
  private generateRenewalEmail(
    bond: CustomsBond,
    renewal: BondRenewal
  ): string {
    const subject = `Bond Renewal Request - ${bond.bondNumber}`;

    return `Subject: ${subject}

Dear SuretyCloud Support Team,

Please process the renewal for the following bond:

Bond Number: ${bond.bondNumber}
Surety Company: ${bond.suretyCompany}
Current Expiry: ${bond.expiryDate.toLocaleDateString()}
Requested Expiry: ${renewal.newExpiry.toLocaleDateString()}
Renewal Amount: $${renewal.renewalAmount?.toLocaleString() || bond.bondAmount.toLocaleString()}

Principal: ${bond.principalName}
FleetFlow Reference: ${bond.id}

Please provide:
1. Renewal premium quote
2. Processing timeline
3. Any additional documentation required

Send renewal confirmation and updated bond documents to:
${this.settings?.notificationEmail}

Thank you for your assistance.

Best regards,
${this.settings?.organizationName}
FleetFlow TMS Integration`;
  }

  /**
   * UTILITY METHODS
   */

  private generateReferenceNumber(): string {
    return `FF-${Date.now().toString().slice(-8)}`;
  }
}

export const suretyCloudManualIntegrationService =
  new SuretyCloudManualIntegrationService();
