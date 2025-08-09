'use client';

// Email Notification Service for Insurance Quote Confirmations
// Integrates with Twilio SendGrid (already configured in FleetFlow)

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface QuoteConfirmationData {
  customerName: string;
  customerEmail: string;
  companyName: string;
  submissionId: string;
  partnersContacted: number;
  partnerNames: string[];
  estimatedResponse: string;
  coverageTypes: string[];
  vehicleCount: number;
  potentialSavings?: string;
}

class EmailNotificationService {
  private baseUrl = '/api/email';

  // Send quote confirmation email to customer
  async sendQuoteConfirmation(
    data: QuoteConfirmationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = this.generateQuoteConfirmationTemplate(data);

      const response = await fetch(`${this.baseUrl}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.customerEmail,
          subject: template.subject,
          html: template.html,
          text: template.text,
          customerName: data.customerName,
          submissionId: data.submissionId,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.messageId,
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email confirmation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Send internal notification to FleetFlow team
  async sendInternalNotification(
    data: QuoteConfirmationData
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = this.generateInternalNotificationTemplate(data);

      const response = await fetch(`${this.baseUrl}/send-internal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'insurance@fleetflow.com', // Internal team email
          subject: template.subject,
          html: template.html,
          text: template.text,
          submissionData: data,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.messageId,
        };
      } else {
        throw new Error(result.error || 'Failed to send internal notification');
      }
    } catch (error) {
      console.error('Internal notification error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Generate customer-facing quote confirmation email template
  private generateQuoteConfirmationTemplate(
    data: QuoteConfirmationData
  ): EmailTemplate {
    const subject = `✅ Your Insurance Quote Request Confirmed - ${data.submissionId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insurance Quote Confirmation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
        .header p { margin: 10px 0 0 0; opacity: 0.9; }
        .content { padding: 30px 20px; }
        .highlight-box { background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .partner-list { background: #f8fafc; border-radius: 8px; padding: 15px; margin: 15px 0; }
        .partner-item { display: flex; align-items: center; margin: 8px 0; }
        .partner-icon { width: 20px; height: 20px; margin-right: 10px; }
        .coverage-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin: 15px 0; }
        .coverage-item { background: #eff6ff; padding: 10px; border-radius: 6px; text-align: center; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 10px 5px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
        .stat-item { text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px; }
        .stat-number { font-size: 24px; font-weight: 700; color: #10b981; }
        .stat-label { font-size: 14px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Quote Request Confirmed!</h1>
            <p>Your insurance partners are working on your quotes</p>
        </div>

        <div class="content">
            <p>Dear ${data.customerName},</p>

            <p>Great news! We've successfully submitted your insurance quote request to multiple A-rated carriers. Here are the details:</p>

            <div class="highlight-box">
                <h3 style="margin-top: 0; color: #10b981;">📋 Submission Summary</h3>
                <p><strong>Company:</strong> ${data.companyName}</p>
                <p><strong>Submission ID:</strong> ${data.submissionId}</p>
                <p><strong>Partners Contacted:</strong> ${data.partnersContacted}</p>
                <p><strong>Expected Response:</strong> ${data.estimatedResponse}</p>
            </div>

            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">${data.vehicleCount}</div>
                    <div class="stat-label">Vehicles</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.partnersContacted}</div>
                    <div class="stat-label">Partners</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${data.coverageTypes.length}</div>
                    <div class="stat-label">Coverage Types</div>
                </div>
            </div>

            <h3>🏢 Insurance Partners Contacted</h3>
            <div class="partner-list">
                ${data.partnerNames
                  .map(
                    (partner) => `
                    <div class="partner-item">
                        <span class="partner-icon">✅</span>
                        <strong>${partner}</strong>
                    </div>
                `
                  )
                  .join('')}
            </div>

            <h3>🛡️ Coverage Types Requested</h3>
            <div class="coverage-grid">
                ${data.coverageTypes
                  .map(
                    (coverage) => `
                    <div class="coverage-item">
                        ${this.formatCoverageType(coverage)}
                    </div>
                `
                  )
                  .join('')}
            </div>

            ${
              data.potentialSavings
                ? `
                <div class="highlight-box">
                    <h3 style="margin-top: 0; color: #10b981;">💰 Potential Savings</h3>
                    <p>Based on your fleet size, you could save <strong>${data.potentialSavings}</strong> annually by comparing quotes!</p>
                </div>
            `
                : ''
            }

            <h3>📞 What Happens Next?</h3>
            <ol>
                <li><strong>Review Period:</strong> Insurance partners will review your submission within 2-4 hours</li>
                <li><strong>Contact:</strong> Licensed agents will call you within ${data.estimatedResponse}</li>
                <li><strong>Quotes:</strong> You'll receive competitive quotes from multiple carriers</li>
                <li><strong>Compare:</strong> Review coverage options and pricing to find the best fit</li>
                <li><strong>Save:</strong> Choose your preferred policy and start saving money!</li>
            </ol>

            <div style="text-align: center; margin: 30px 0;">
                <a href="https://fleetflow.com/insurance-partnerships" class="button">View Quote Status</a>
                <a href="https://fleetflow.com/contact" class="button" style="background: #6b7280;">Contact Support</a>
            </div>

            <p><strong>Need immediate assistance?</strong><br>
            Call us at <a href="tel:+18333863509">(833) 386-3509</a> or email <a href="mailto:insurance@fleetflow.com">insurance@fleetflow.com</a></p>
        </div>

        <div class="footer">
            <p><strong>FleetFlow™ Insurance Marketplace</strong><br>
            Connecting trucking companies with A-rated insurance carriers since 2024</p>
            <p>© 2025 FleetFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
Insurance Quote Confirmation - ${data.submissionId}

Dear ${data.customerName},

Your insurance quote request has been successfully submitted to ${data.partnersContacted} insurance partners.

Company: ${data.companyName}
Submission ID: ${data.submissionId}
Partners Contacted: ${data.partnerNames.join(', ')}
Expected Response: ${data.estimatedResponse}
Coverage Types: ${data.coverageTypes.map((c) => this.formatCoverageType(c)).join(', ')}

What happens next:
1. Insurance partners will review your submission within 2-4 hours
2. Licensed agents will contact you within ${data.estimatedResponse}
3. You'll receive competitive quotes from multiple carriers
4. Compare coverage and pricing to find the best fit
5. Choose your preferred policy and start saving!

Need help? Call (833) 386-3509 or email insurance@fleetflow.com

Best regards,
FleetFlow Insurance Team
    `;

    return { subject, html, text };
  }

  // Generate internal team notification template
  private generateInternalNotificationTemplate(
    data: QuoteConfirmationData
  ): EmailTemplate {
    const subject = `🔔 New Insurance Quote Submission - ${data.companyName}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Insurance Quote Submission</title>
    <style>
        body { font-family: monospace; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; border-radius: 8px; }
        .data-table { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .highlight { background: #fef3c7; padding: 10px; border-radius: 4px; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 New Insurance Quote Submission</h2>
            <p>Submission ID: ${data.submissionId}</p>
        </div>

        <div class="data-table">
            <h3>📊 Submission Details</h3>
            <p><strong>Company:</strong> ${data.companyName}</p>
            <p><strong>Contact:</strong> ${data.customerName} (${data.customerEmail})</p>
            <p><strong>Fleet Size:</strong> ${data.vehicleCount} vehicles</p>
            <p><strong>Partners Contacted:</strong> ${data.partnersContacted}</p>
            <p><strong>Coverage Types:</strong> ${data.coverageTypes.join(', ')}</p>
            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>

        <div class="highlight">
            <h3>🎯 Next Actions</h3>
            <ul>
                <li>Monitor partner response rates</li>
                <li>Follow up if no contact within 48 hours</li>
                <li>Track conversion metrics</li>
                <li>Update commission tracking</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
New Insurance Quote Submission - ${data.companyName}

Submission ID: ${data.submissionId}
Company: ${data.companyName}
Contact: ${data.customerName} (${data.customerEmail})
Fleet Size: ${data.vehicleCount} vehicles
Partners Contacted: ${data.partnersContacted}
Coverage Types: ${data.coverageTypes.join(', ')}
Timestamp: ${new Date().toISOString()}

Next Actions:
- Monitor partner response rates
- Follow up if no contact within 48 hours
- Track conversion metrics
- Update commission tracking
    `;

    return { subject, html, text };
  }

  // Format coverage type for display
  private formatCoverageType(coverageType: string): string {
    const typeMap: { [key: string]: string } = {
      commercial_auto: '🚛 Commercial Auto',
      general_liability: '🛡️ General Liability',
      workers_comp: '👥 Workers Comp',
      cargo: '📦 Cargo Insurance',
      garage_liability: '🏢 Garage Liability',
      cyber_liability: '💻 Cyber Liability',
    };

    return typeMap[coverageType] || coverageType;
  }

  // Send follow-up email after partner response
  async sendFollowUpEmail(data: {
    customerEmail: string;
    customerName: string;
    partnerResponses: Array<{
      partnerName: string;
      contacted: boolean;
      quoteProvided: boolean;
      estimatedPremium?: number;
    }>;
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const template = this.generateFollowUpTemplate(data);

      const response = await fetch(`${this.baseUrl}/send-followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: data.customerEmail,
          subject: template.subject,
          html: template.html,
          text: template.text,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        return {
          success: true,
          messageId: result.messageId,
        };
      } else {
        throw new Error(result.error || 'Failed to send follow-up email');
      }
    } catch (error) {
      console.error('Follow-up email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private generateFollowUpTemplate(data: {
    customerName: string;
    partnerResponses: Array<{
      partnerName: string;
      contacted: boolean;
      quoteProvided: boolean;
      estimatedPremium?: number;
    }>;
  }): EmailTemplate {
    const contactedPartners = data.partnerResponses.filter((p) => p.contacted);
    const quotesReceived = data.partnerResponses.filter((p) => p.quoteProvided);

    const subject = `📋 Insurance Quote Update - ${contactedPartners.length} Partners Responded`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Insurance Quote Update</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>📋 Insurance Quote Update</h2>

        <p>Dear ${data.customerName},</p>

        <p>Here's an update on your insurance quote request:</p>

        <div style="background: #f0fdf4; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3>📊 Response Summary</h3>
            <p><strong>Partners Contacted You:</strong> ${contactedPartners.length}</p>
            <p><strong>Quotes Received:</strong> ${quotesReceived.length}</p>
        </div>

        ${
          contactedPartners.length > 0
            ? `
            <h3>✅ Partners Who Contacted You</h3>
            <ul>
                ${contactedPartners
                  .map(
                    (p) => `
                    <li><strong>${p.partnerName}</strong>
                        ${p.quoteProvided ? ' - Quote provided' : ' - Initial contact made'}
                        ${p.estimatedPremium ? ` (Est. Premium: $${p.estimatedPremium.toLocaleString()})` : ''}
                    </li>
                `
                  )
                  .join('')}
            </ul>
        `
            : ''
        }

        <p>If you haven't been contacted yet, don't worry - insurance partners typically reach out within 48 hours of submission.</p>

        <p><strong>Need assistance?</strong> Call us at <a href="tel:+18333863509">(833) 386-3509</a></p>

        <p>Best regards,<br>FleetFlow Insurance Team</p>
    </div>
</body>
</html>
    `;

    const text = `
Insurance Quote Update

Dear ${data.customerName},

Response Summary:
- Partners Contacted You: ${contactedPartners.length}
- Quotes Received: ${quotesReceived.length}

${
  contactedPartners.length > 0
    ? `
Partners Who Contacted You:
${contactedPartners.map((p) => `- ${p.partnerName}${p.quoteProvided ? ' (Quote provided)' : ' (Initial contact)'}`).join('\n')}
`
    : ''
}

If you haven't been contacted yet, insurance partners typically reach out within 48 hours.

Need assistance? Call (833) 386-3509

Best regards,
FleetFlow Insurance Team
    `;

    return { subject, html, text };
  }
}

export const emailNotificationService = new EmailNotificationService();
