// Email Service for FleetFlow Accounting System
// This service handles automated email notifications for invoices, payroll, and factoring

export interface EmailTemplate {
  type:
    | 'invoice_reminder'
    | 'invoice_overdue'
    | 'payroll_notification'
    | 'factoring_update';
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface EmailRecipient {
  email: string;
  name: string;
  type: 'shipper' | 'carrier' | 'employee' | 'factor';
}

export class AccountingEmailService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = process.env.SENDGRID_API_KEY || 'demo-key') {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.sendgrid.com/v3';
  }

  // Send invoice reminder emails
  async sendInvoiceReminder(invoice: any, recipient: EmailRecipient) {
    const template = this.generateInvoiceReminderTemplate(invoice, recipient);
    return this.sendEmail(recipient, template);
  }

  // Send overdue payment notifications
  async sendOverdueNotification(invoice: any, recipient: EmailRecipient) {
    const template = this.generateOverdueTemplate(invoice, recipient);
    return this.sendEmail(recipient, template);
  }

  // Send payroll notifications to employees
  async sendPayrollNotification(payrollRecord: any, recipient: EmailRecipient) {
    const template = this.generatePayrollTemplate(payrollRecord, recipient);
    return this.sendEmail(recipient, template);
  }

  // Send factoring status updates
  async sendFactoringUpdate(factoringRecord: any, recipient: EmailRecipient) {
    const template = this.generateFactoringTemplate(factoringRecord, recipient);
    return this.sendEmail(recipient, template);
  }

  // Bulk email operations
  async sendBulkInvoiceReminders(
    invoices: any[],
    recipients: EmailRecipient[]
  ) {
    const results = [];
    for (let i = 0; i < invoices.length; i++) {
      const result = await this.sendInvoiceReminder(invoices[i], recipients[i]);
      results.push(result);
    }
    return results;
  }

  // Automated reminder scheduling
  async scheduleAutomatedReminders() {
    // This would typically integrate with a job scheduler
    const overdueInvoices = await this.getOverdueInvoices();
    const upcomingDueInvoices = await this.getUpcomingDueInvoices();

    // Send overdue notifications
    for (const invoice of overdueInvoices) {
      const recipient = await this.getRecipientForInvoice(invoice);
      await this.sendOverdueNotification(invoice, recipient);
    }

    // Send reminder notifications (3 days before due)
    for (const invoice of upcomingDueInvoices) {
      const recipient = await this.getRecipientForInvoice(invoice);
      await this.sendInvoiceReminder(invoice, recipient);
    }
  }

  // Core email sending method
  private async sendEmail(recipient: EmailRecipient, template: EmailTemplate) {
    try {
      console.log(`📧 Sending ${template.type} email to ${recipient.email}`);

      const emailData = {
        personalizations: [
          {
            to: [{ email: recipient.email, name: recipient.name }],
            subject: template.subject,
            custom_args: {
              email_type: template.type,
              recipient_type: recipient.type,
              timestamp: new Date().toISOString(),
            },
          },
        ],
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'billing@fleetflowapp.com',
          name: 'FleetFlow Billing',
        },
        content: [
          { type: 'text/plain', value: template.textContent },
          { type: 'text/html', value: template.htmlContent },
        ],
        categories: ['accounting', template.type, 'fleetflow'],
        tracking_settings: {
          click_tracking: { enable: true },
          open_tracking: { enable: true },
        },
        reply_to: {
          email: 'billing@fleetflowapp.com',
          name: 'FleetFlow Billing Support',
        },
      };

      // Use actual SendGrid API
      const response = await this.sendViaSendGrid(emailData);

      return {
        success: true,
        messageId: response.messageId,
        recipient: recipient.email,
        template: template.type,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message,
        recipient: recipient.email,
        template: template.type,
      };
    }
  }

  // Template generators
  private generateInvoiceReminderTemplate(
    invoice: any,
    recipient: EmailRecipient
  ): EmailTemplate {
    const daysUntilDue = Math.ceil(
      (new Date(invoice.dueDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      type: 'invoice_reminder',
      subject: `Payment Reminder: Invoice ${invoice.id} - Due in ${daysUntilDue} days`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🧾 Payment Reminder</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">FleetFlow Transportation Services</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Hello ${recipient.name},</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              This is a friendly reminder that your invoice payment is due in <strong>${daysUntilDue} days</strong>.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #059669;">
              <h3 style="color: #059669; margin-top: 0;">Invoice Details</h3>
              <p><strong>Invoice #:</strong> ${invoice.id}</p>
              <p><strong>Amount Due:</strong> $${invoice.amount?.toLocaleString() || invoice.dispatchFee?.toLocaleString()}</p>
              <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Load:</strong> ${invoice.loadDetails?.origin} → ${invoice.loadDetails?.destination}</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Invoice
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              If you have any questions about this invoice, please contact our billing department at
              <a href="mailto:billing@fleetflow.com" style="color: #059669;">billing@fleetflow.com</a>
              or call (555) 123-4567.
            </p>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px;">
            FleetFlow Transportation Services<br>
            1234 Logistics Way, Atlanta, GA 30309<br>
            <a href="#" style="color: #9ca3af;">Unsubscribe</a> | <a href="#" style="color: #9ca3af;">Update Preferences</a>
          </div>
        </div>
      `,
      textContent: `
Payment Reminder - Invoice ${invoice.id}

Hello ${recipient.name},

This is a friendly reminder that your invoice payment is due in ${daysUntilDue} days.

Invoice Details:
- Invoice #: ${invoice.id}
- Amount Due: $${invoice.amount?.toLocaleString() || invoice.dispatchFee?.toLocaleString()}
- Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
- Load: ${invoice.loadDetails?.origin} → ${invoice.loadDetails?.destination}

If you have any questions, please contact billing@fleetflow.com or call (555) 123-4567.

FleetFlow Transportation Services
1234 Logistics Way, Atlanta, GA 30309
      `,
    };
  }

  private generateOverdueTemplate(
    invoice: any,
    recipient: EmailRecipient
  ): EmailTemplate {
    const daysOverdue = Math.ceil(
      (new Date().getTime() - new Date(invoice.dueDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return {
      type: 'invoice_overdue',
      subject: `URGENT: Overdue Payment - Invoice ${invoice.id} (${daysOverdue} days overdue)`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">⚠️ URGENT: Overdue Payment</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">FleetFlow Transportation Services</p>
          </div>

          <div style="background: #fef2f2; padding: 30px; border-radius: 10px; margin: 20px 0; border: 2px solid #fecaca;">
            <h2 style="color: #dc2626; margin-top: 0;">IMMEDIATE ATTENTION REQUIRED</h2>
            <p style="color: #374151; line-height: 1.6; font-weight: bold;">
              Your payment is now <span style="color: #dc2626;">${daysOverdue} days overdue</span>.
              Please submit payment immediately to avoid service interruption.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
              <h3 style="color: #dc2626; margin-top: 0;">Overdue Invoice</h3>
              <p><strong>Invoice #:</strong> ${invoice.id}</p>
              <p><strong>Amount Due:</strong> $${invoice.amount?.toLocaleString() || invoice.dispatchFee?.toLocaleString()}</p>
              <p><strong>Original Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              <p><strong>Days Overdue:</strong> <span style="color: #dc2626; font-weight: bold;">${daysOverdue} days</span></p>
              <p><strong>Load:</strong> ${invoice.loadDetails?.origin} → ${invoice.loadDetails?.destination}</p>
            </div>

            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">
                ⚠️ Late fees may apply. Please contact us immediately to discuss payment arrangements.
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-right: 10px;">
                Pay Now
              </a>
              <a href="#" style="background: #6b7280; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Contact Billing
              </a>
            </div>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px;">
            FleetFlow Transportation Services<br>
            1234 Logistics Way, Atlanta, GA 30309<br>
            Emergency Billing: (555) 123-4567
          </div>
        </div>
      `,
      textContent: `
URGENT: OVERDUE PAYMENT - Invoice ${invoice.id}

IMMEDIATE ATTENTION REQUIRED

Your payment is now ${daysOverdue} days overdue. Please submit payment immediately to avoid service interruption.

Overdue Invoice Details:
- Invoice #: ${invoice.id}
- Amount Due: $${invoice.amount?.toLocaleString() || invoice.dispatchFee?.toLocaleString()}
- Original Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
- Days Overdue: ${daysOverdue} days
- Load: ${invoice.loadDetails?.origin} → ${invoice.loadDetails?.destination}

WARNING: Late fees may apply. Please contact us immediately.

Emergency Contact: (555) 123-4567
Email: billing@fleetflow.com

FleetFlow Transportation Services
      `,
    };
  }

  private generatePayrollTemplate(
    payrollRecord: any,
    recipient: EmailRecipient
  ): EmailTemplate {
    return {
      type: 'payroll_notification',
      subject: `Your Payroll Statement is Ready - ${payrollRecord.payPeriod}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">💵 Payroll Statement Ready</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">FleetFlow Transportation Services</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Hello ${recipient.name},</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Your payroll statement for the period <strong>${payrollRecord.payPeriod}</strong> is now available.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="color: #3b82f6; margin-top: 0;">Pay Statement Summary</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <p><strong>Gross Pay:</strong> $${payrollRecord.grossPay.toLocaleString()}</p>
                <p><strong>Commissions:</strong> $${payrollRecord.commissions?.toLocaleString() || '0'}</p>
                <p><strong>Deductions:</strong> $${payrollRecord.deductions.toLocaleString()}</p>
                <p style="color: #059669; font-size: 18px; font-weight: bold;"><strong>Net Pay:</strong> $${payrollRecord.netPay.toLocaleString()}</p>
              </div>
              <p><strong>Status:</strong> <span style="color: ${payrollRecord.status === 'Paid' ? '#059669' : '#f59e0b'};">${payrollRecord.status}</span></p>
              ${payrollRecord.payDate ? `<p><strong>Pay Date:</strong> ${new Date(payrollRecord.payDate).toLocaleDateString()}</p>` : ''}
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Full Statement
              </a>
            </div>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px;">
            FleetFlow Transportation Services - HR Department<br>
            Questions? Contact hr@fleetflow.com
          </div>
        </div>
      `,
      textContent: `
Payroll Statement Ready - ${payrollRecord.payPeriod}

Hello ${recipient.name},

Your payroll statement for ${payrollRecord.payPeriod} is now available.

Pay Statement Summary:
- Gross Pay: $${payrollRecord.grossPay.toLocaleString()}
- Commissions: $${payrollRecord.commissions?.toLocaleString() || '0'}
- Deductions: $${payrollRecord.deductions.toLocaleString()}
- Net Pay: $${payrollRecord.netPay.toLocaleString()}
- Status: ${payrollRecord.status}
${payrollRecord.payDate ? `- Pay Date: ${new Date(payrollRecord.payDate).toLocaleDateString()}` : ''}

Questions? Contact hr@fleetflow.com

FleetFlow Transportation Services
      `,
    };
  }

  private generateFactoringTemplate(
    factoringRecord: any,
    recipient: EmailRecipient
  ): EmailTemplate {
    const statusColors = {
      Submitted: '#f59e0b',
      Approved: '#3b82f6',
      Funded: '#059669',
      Collected: '#6b7280',
    };

    return {
      type: 'factoring_update',
      subject: `Factoring Update: ${factoringRecord.loadId} - Status: ${factoringRecord.status}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🏦 Factoring Status Update</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">FleetFlow Factoring Services</p>
          </div>

          <div style="background: #f8fafc; padding: 30px; border-radius: 10px; margin: 20px 0;">
            <h2 style="color: #374151; margin-top: 0;">Factoring Update</h2>
            <p style="color: #6b7280; line-height: 1.6;">
              Your factoring request for load <strong>${factoringRecord.loadId}</strong> has been updated.
            </p>

            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid ${statusColors[factoringRecord.status]};">
              <h3 style="color: ${statusColors[factoringRecord.status]}; margin-top: 0;">Status: ${factoringRecord.status}</h3>
              <p><strong>Load ID:</strong> ${factoringRecord.loadId}</p>
              <p><strong>Carrier:</strong> ${factoringRecord.carrierName}</p>
              <p><strong>Driver:</strong> ${factoringRecord.driverName}</p>
              <p><strong>Invoice Amount:</strong> $${factoringRecord.invoiceAmount.toLocaleString()}</p>
              <p><strong>Factor Rate:</strong> ${factoringRecord.factorRate}%</p>
              <p><strong>Advance Amount:</strong> $${factoringRecord.advanceAmount.toLocaleString()}</p>
              <p><strong>Reserve Amount:</strong> $${factoringRecord.reserveAmount.toLocaleString()}</p>
              <p><strong>Submitted:</strong> ${new Date(factoringRecord.submissionDate).toLocaleDateString()}</p>
              ${factoringRecord.fundingDate ? `<p><strong>Funded:</strong> ${new Date(factoringRecord.fundingDate).toLocaleDateString()}</p>` : ''}
            </div>

            ${
              factoringRecord.status === 'Funded'
                ? `
              <div style="background: #d1fae5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <p style="margin: 0; color: #065f46; font-weight: bold;">
                  ✅ Funds have been transferred to your account!
                </p>
              </div>
            `
                : ''
            }

            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #8b5cf6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                View Details
              </a>
            </div>
          </div>

          <div style="text-align: center; color: #9ca3af; font-size: 12px; padding: 20px;">
            FleetFlow Factoring Services<br>
            Questions? Contact factoring@fleetflow.com
          </div>
        </div>
      `,
      textContent: `
Factoring Status Update - ${factoringRecord.loadId}

Your factoring request has been updated to: ${factoringRecord.status}

Details:
- Load ID: ${factoringRecord.loadId}
- Carrier: ${factoringRecord.carrierName}
- Driver: ${factoringRecord.driverName}
- Invoice Amount: $${factoringRecord.invoiceAmount.toLocaleString()}
- Factor Rate: ${factoringRecord.factorRate}%
- Advance Amount: $${factoringRecord.advanceAmount.toLocaleString()}
- Reserve Amount: $${factoringRecord.reserveAmount.toLocaleString()}
- Submitted: ${new Date(factoringRecord.submissionDate).toLocaleDateString()}
${factoringRecord.fundingDate ? `- Funded: ${new Date(factoringRecord.fundingDate).toLocaleDateString()}` : ''}

${factoringRecord.status === 'Funded' ? 'Funds have been transferred to your account!' : ''}

Questions? Contact factoring@fleetflow.com

FleetFlow Factoring Services
      `,
    };
  }

  // Actual SendGrid API integration
  private async sendViaSendGrid(emailData: any) {
    if (!this.apiKey || this.apiKey === 'demo-key') {
      // Fallback to console logging for development
      console.log('📧 Email (Dev Mode):', {
        to: emailData.personalizations[0].to[0].email,
        subject: emailData.personalizations[0].subject,
        type: emailData.personalizations[0].custom_args?.email_type,
        timestamp: new Date().toISOString(),
      });

      return {
        messageId: `dev-${Date.now()}`,
        status: 'sent',
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

      console.log('✅ Accounting email sent via SendGrid:', {
        to: emailData.personalizations[0].to[0].email,
        messageId,
        type: emailData.personalizations[0].custom_args?.email_type,
        timestamp: new Date().toISOString(),
      });

      return {
        messageId,
        status: 'sent',
        timestamp: new Date().toISOString(),
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `SendGrid API error: ${response.status} - ${errorData.message || response.statusText}`
      );
    }
  }

  private async getOverdueInvoices() {
    // Mock implementation - would query database
    return [];
  }

  private async getUpcomingDueInvoices() {
    // Mock implementation - would query database
    return [];
  }

  private async getRecipientForInvoice(invoice: any): Promise<EmailRecipient> {
    // Mock implementation - would query database
    return {
      email: 'customer@example.com',
      name: 'Customer Name',
      type: 'shipper',
    };
  }
}

export default AccountingEmailService;
