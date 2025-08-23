// Universal SendGrid Service for FleetFlow
// Centralized email service that integrates with all FleetFlow modules

export interface EmailRecipient {
  email: string;
  name: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailOptions {
  to: EmailRecipient | EmailRecipient[];
  template: EmailTemplate;
  category: string;
  customArgs?: Record<string, string>;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType: string;
  }>;
  replyTo?: {
    email: string;
    name: string;
  };
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  timestamp: string;
}

export class SendGridService {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;
  private baseUrl = 'https://api.sendgrid.com/v3';

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';
    this.fromEmail =
      process.env.SENDGRID_FROM_EMAIL || 'noreply@fleetflowapp.com';
    this.fromName = 'FleetFlow';
  }

  // Send single email
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      const recipients = Array.isArray(options.to) ? options.to : [options.to];

      const emailData = {
        personalizations: recipients.map((recipient) => ({
          to: [{ email: recipient.email, name: recipient.name }],
          subject: options.template.subject,
          custom_args: {
            category: options.category,
            timestamp: new Date().toISOString(),
            ...options.customArgs,
          },
        })),
        from: {
          email: this.fromEmail,
          name: this.fromName,
        },
        content: [
          { type: 'text/plain', value: options.template.text },
          { type: 'text/html', value: options.template.html },
        ],
        categories: ['fleetflow', options.category],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
        reply_to: options.replyTo || {
          email: 'support@fleetflowapp.com',
          name: 'FleetFlow Support',
        },
      };

      // Add attachments if provided
      if (options.attachments && options.attachments.length > 0) {
        emailData.attachments = options.attachments.map((attachment) => ({
          filename: attachment.filename,
          content:
            typeof attachment.content === 'string'
              ? attachment.content
              : attachment.content.toString('base64'),
          type: attachment.contentType,
          disposition: 'attachment',
        }));
      }

      const result = await this.sendViaSendGrid(emailData);

      console.log(`✅ Email sent via SendGrid:`, {
        category: options.category,
        recipients: recipients.length,
        messageId: result.messageId,
        timestamp: result.timestamp,
      });

      return result;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Send bulk emails
  async sendBulkEmails(emailsList: EmailOptions[]): Promise<EmailResult[]> {
    const results: EmailResult[] = [];

    for (const emailOptions of emailsList) {
      const result = await this.sendEmail(emailOptions);
      results.push(result);

      // Add small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return results;
  }

  // Insurance partnership emails
  async sendInsuranceConfirmation(
    customerEmail: string,
    customerName: string,
    submissionData: any
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: customerEmail, name: customerName },
      template: this.generateInsuranceConfirmationTemplate(
        customerName,
        submissionData
      ),
      category: 'insurance_confirmation',
      customArgs: {
        submission_id: submissionData.submissionId,
        company_name: submissionData.companyName,
      },
    });
  }

  // Certificate emails
  async sendCertificateEmail(
    recipientEmail: string,
    recipientName: string,
    certificateData: {
      moduleTitle: string;
      certificateId: string;
      score: number;
      dateEarned: string;
      pdfBuffer: Buffer;
    }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: recipientEmail, name: recipientName },
      template: this.generateCertificateTemplate(
        recipientName,
        certificateData
      ),
      category: 'certificate_delivery',
      customArgs: {
        certificate_id: certificateData.certificateId,
        module_title: certificateData.moduleTitle,
        score: certificateData.score.toString(),
      },
      attachments: [
        {
          filename: `FleetFlow_Certificate_${certificateData.certificateId}.pdf`,
          content: certificateData.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
      replyTo: {
        email: 'university@fleetflowapp.com',
        name: 'FleetFlow University',
      },
    });
  }

  // Accounting emails
  async sendInvoiceReminder(
    recipientEmail: string,
    recipientName: string,
    invoiceData: any
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: recipientEmail, name: recipientName },
      template: this.generateInvoiceReminderTemplate(
        recipientName,
        invoiceData
      ),
      category: 'invoice_reminder',
      customArgs: {
        invoice_id: invoiceData.id,
        amount: invoiceData.amount.toString(),
        due_date: invoiceData.dueDate,
      },
      replyTo: {
        email: 'billing@fleetflowapp.com',
        name: 'FleetFlow Billing',
      },
    });
  }

  // Onboarding emails
  async sendOnboardingEmail(
    recipientEmail: string,
    recipientName: string,
    onboardingData: {
      type: 'welcome' | 'document_approved' | 'document_rejected' | 'complete';
      details: any;
    }
  ): Promise<EmailResult> {
    return this.sendEmail({
      to: { email: recipientEmail, name: recipientName },
      template: this.generateOnboardingTemplate(recipientName, onboardingData),
      category: `onboarding_${onboardingData.type}`,
      customArgs: {
        onboarding_type: onboardingData.type,
        carrier_id: onboardingData.details.carrierId || '',
      },
      replyTo: {
        email: 'onboarding@fleetflowapp.com',
        name: 'FleetFlow Onboarding Team',
      },
    });
  }

  // Core SendGrid API integration
  private async sendViaSendGrid(emailData: any): Promise<EmailResult> {
    if (!this.apiKey) {
      // Development mode fallback
      console.log('📧 Email (Dev Mode):', {
        to: emailData.personalizations[0].to[0].email,
        subject: emailData.personalizations[0].subject,
        category: emailData.categories?.[1],
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        messageId: `dev-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    }

    const response = await fetch(`${this.baseUrl}/mail/send`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (response.ok) {
      const messageId =
        response.headers.get('X-Message-Id') || `sg-${Date.now()}`;

      return {
        success: true,
        messageId,
        timestamp: new Date().toISOString(),
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `SendGrid API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }
  }

  // Email template generators
  private generateInsuranceConfirmationTemplate(
    customerName: string,
    submissionData: any
  ): EmailTemplate {
    const subject = `✅ Insurance Quote Request Confirmed - ${submissionData.submissionId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Insurance Quote Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: white; }
        .content { padding: 30px 20px; }
        .highlight-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Quote Request Confirmed!</h1>
            <p>Your insurance partners are working on your quotes</p>
        </div>
        <div class="content">
            <p>Dear ${customerName},</p>
            <p>We've successfully submitted your insurance quote request to multiple A-rated carriers.</p>
            <div class="highlight-box">
                <h3>📋 Submission Summary</h3>
                <p><strong>Company:</strong> ${submissionData.companyName}</p>
                <p><strong>Submission ID:</strong> ${submissionData.submissionId}</p>
                <p><strong>Partners Contacted:</strong> ${submissionData.partnersContacted}</p>
            </div>
            <p>Licensed agents will contact you within 24-48 hours with competitive quotes.</p>
            <p>Need help? Call <a href="tel:+18333863509">(833) 386-3509</a></p>
        </div>
    </div>
</body>
</html>`;

    const text = `Insurance Quote Confirmation - ${submissionData.submissionId}

Dear ${customerName},

Your insurance quote request has been successfully submitted to ${submissionData.partnersContacted} insurance partners.

Company: ${submissionData.companyName}
Submission ID: ${submissionData.submissionId}

Licensed agents will contact you within 24-48 hours with competitive quotes.

Need help? Call (833) 386-3509

Best regards,
FleetFlow Insurance Team`;

    return { subject, html, text };
  }

  private generateCertificateTemplate(
    recipientName: string,
    certificateData: any
  ): EmailTemplate {
    const subject = `🎓 Certificate of Completion - ${certificateData.moduleTitle}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificate of Completion</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 30px 20px; text-align: center; color: white; }
        .content { padding: 30px 20px; }
        .certificate-box { background: #eff6ff; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎓 Congratulations!</h1>
            <p>You've earned a FleetFlow University certificate</p>
        </div>
        <div class="content">
            <p>Dear ${recipientName},</p>
            <p>Congratulations on successfully completing the training module!</p>
            <div class="certificate-box">
                <h3>📜 Certificate Details</h3>
                <p><strong>Module:</strong> ${certificateData.moduleTitle}</p>
                <p><strong>Score:</strong> ${certificateData.score}%</p>
                <p><strong>Date Earned:</strong> ${certificateData.dateEarned}</p>
                <p><strong>Certificate ID:</strong> ${certificateData.certificateId}</p>
            </div>
            <p>Your certificate is attached to this email as a PDF file.</p>
            <p>Keep up the great work!</p>
        </div>
    </div>
</body>
</html>`;

    const text = `Certificate of Completion - ${certificateData.moduleTitle}

Dear ${recipientName},

Congratulations on successfully completing the training module!

Certificate Details:
- Module: ${certificateData.moduleTitle}
- Score: ${certificateData.score}%
- Date Earned: ${certificateData.dateEarned}
- Certificate ID: ${certificateData.certificateId}

Your certificate is attached to this email as a PDF file.

Best regards,
FleetFlow University Team`;

    return { subject, html, text };
  }

  private generateInvoiceReminderTemplate(
    recipientName: string,
    invoiceData: any
  ): EmailTemplate {
    const subject = `💰 Payment Reminder - Invoice ${invoiceData.id}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Payment Reminder</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px 20px; text-align: center; color: white; }
        .content { padding: 30px 20px; }
        .invoice-box { background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💰 Payment Reminder</h1>
            <p>Invoice payment is due soon</p>
        </div>
        <div class="content">
            <p>Dear ${recipientName},</p>
            <p>This is a friendly reminder about your upcoming payment.</p>
            <div class="invoice-box">
                <h3>📄 Invoice Details</h3>
                <p><strong>Invoice ID:</strong> ${invoiceData.id}</p>
                <p><strong>Amount:</strong> $${invoiceData.amount.toLocaleString()}</p>
                <p><strong>Due Date:</strong> ${invoiceData.dueDate}</p>
            </div>
            <p>Please ensure payment is made by the due date to avoid any late fees.</p>
            <p>Questions? Contact billing@fleetflowapp.com</p>
        </div>
    </div>
</body>
</html>`;

    const text = `Payment Reminder - Invoice ${invoiceData.id}

Dear ${recipientName},

This is a friendly reminder about your upcoming payment.

Invoice Details:
- Invoice ID: ${invoiceData.id}
- Amount: $${invoiceData.amount.toLocaleString()}
- Due Date: ${invoiceData.dueDate}

Please ensure payment is made by the due date to avoid any late fees.

Questions? Contact billing@fleetflowapp.com

Best regards,
FleetFlow Billing Team`;

    return { subject, html, text };
  }

  private generateOnboardingTemplate(
    recipientName: string,
    onboardingData: any
  ): EmailTemplate {
    const templates = {
      welcome: {
        subject: '🚛 Welcome to FleetFlow!',
        html: `<h1>Welcome ${recipientName}!</h1><p>We're excited to have you join the FleetFlow network.</p>`,
        text: `Welcome ${recipientName}! We're excited to have you join the FleetFlow network.`,
      },
      document_approved: {
        subject: '✅ Document Approved',
        html: `<h1>Document Approved!</h1><p>Your ${onboardingData.details.documentType} has been approved.</p>`,
        text: `Document Approved! Your ${onboardingData.details.documentType} has been approved.`,
      },
      document_rejected: {
        subject: '❌ Document Needs Attention',
        html: `<h1>Document Needs Attention</h1><p>Your ${onboardingData.details.documentType} needs to be resubmitted.</p>`,
        text: `Document Needs Attention. Your ${onboardingData.details.documentType} needs to be resubmitted.`,
      },
      complete: {
        subject: '🎉 Onboarding Complete!',
        html: `<h1>Onboarding Complete!</h1><p>Welcome to FleetFlow, ${recipientName}! You're all set to start.</p>`,
        text: `Onboarding Complete! Welcome to FleetFlow, ${recipientName}! You're all set to start.`,
      },
    };

    return templates[onboardingData.type] || templates.welcome;
  }
}

// Export singleton instance
export const sendGridService = new SendGridService();























































































