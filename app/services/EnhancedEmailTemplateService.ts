/**
 * Enhanced Email Template Service
 * Professional, branded email templates with modern styling
 */

import {
  EmailTemplateType,
  EmailTemplateVariables,
  RenderedEmail,
  tenantEmailTemplateService,
} from './TenantEmailTemplateService';

export interface ProfessionalEmailTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
}

export interface CompanyBranding {
  logoUrl?: string;
  companyName: string;
  tagline?: string;
  colors: ProfessionalEmailTheme;
  fontFamily: string;
  headerStyle: 'modern' | 'classic' | 'minimal';
}

export class EnhancedEmailTemplateService {
  // 🎨 PROFESSIONAL EMAIL THEMES
  private themes: Record<string, ProfessionalEmailTheme> = {
    fleetflow: {
      primaryColor: '#2563eb',
      secondaryColor: '#1e40af',
      accentColor: '#3b82f6',
      backgroundColor: '#f8fafc',
      cardColor: '#ffffff',
      textColor: '#374151',
      headingColor: '#1f2937',
      borderColor: '#e5e7eb',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
    },
    logistics: {
      primaryColor: '#0f766e',
      secondaryColor: '#0d9488',
      accentColor: '#14b8a6',
      backgroundColor: '#f0fdfa',
      cardColor: '#ffffff',
      textColor: '#374151',
      headingColor: '#0f172a',
      borderColor: '#e5e7eb',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
    },
    freight: {
      primaryColor: '#ea580c',
      secondaryColor: '#dc2626',
      accentColor: '#f97316',
      backgroundColor: '#fff7ed',
      cardColor: '#ffffff',
      textColor: '#374151',
      headingColor: '#1f2937',
      borderColor: '#e5e7eb',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
    },
  };

  // 🏢 GET PROFESSIONAL TEMPLATE
  async getProfessionalEmailTemplate(
    tenantId: string,
    templateType: EmailTemplateType,
    variables: EmailTemplateVariables,
    theme: string = 'fleetflow'
  ): Promise<RenderedEmail> {
    // Get base template from existing service
    const baseTemplate = await tenantEmailTemplateService.renderTenantEmail(
      tenantId,
      templateType,
      variables
    );

    // Get company branding
    const branding = await this.getCompanyBranding(tenantId, theme);

    // Enhance with professional styling
    const enhancedTemplate = this.applyProfessionalStyling(
      baseTemplate,
      branding,
      templateType,
      variables
    );

    return enhancedTemplate;
  }

  // 🎨 APPLY PROFESSIONAL STYLING
  private applyProfessionalStyling(
    template: RenderedEmail,
    branding: CompanyBranding,
    templateType: EmailTemplateType,
    variables: EmailTemplateVariables
  ): RenderedEmail {
    const theme = branding.colors;

    // Generate professional HTML
    const professionalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${template.subject}</title>
        <style>
            /* Reset and Base Styles */
            * { margin: 0; padding: 0; box-sizing: border-box; }

            body {
                font-family: ${branding.fontFamily};
                line-height: 1.6;
                color: ${theme.textColor};
                background-color: ${theme.backgroundColor};
                margin: 0;
                padding: 0;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            }

            /* Container */
            .email-container {
                max-width: 680px;
                margin: 0 auto;
                background-color: ${theme.cardColor};
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-radius: 12px;
                overflow: hidden;
                margin-top: 20px;
                margin-bottom: 20px;
            }

            /* Header Styles */
            .email-header {
                background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }

            .email-header::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 3s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 0.5; }
                50% { opacity: 0.8; }
            }

            .company-logo {
                max-height: 60px;
                margin-bottom: 15px;
                position: relative;
                z-index: 2;
            }

            .company-name {
                font-size: 32px;
                font-weight: 700;
                margin-bottom: 8px;
                position: relative;
                z-index: 2;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .company-tagline {
                font-size: 16px;
                opacity: 0.9;
                position: relative;
                z-index: 2;
                font-weight: 300;
            }

            /* Content Area */
            .email-content {
                padding: 40px 30px;
            }

            .greeting {
                font-size: 18px;
                color: ${theme.headingColor};
                margin-bottom: 20px;
                font-weight: 500;
            }

            .main-message {
                font-size: 16px;
                line-height: 1.7;
                margin-bottom: 25px;
                color: ${theme.textColor};
            }

            /* Info Cards */
            .info-card {
                background: linear-gradient(135deg, ${theme.backgroundColor} 0%, #ffffff 100%);
                border: 2px solid ${theme.borderColor};
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                position: relative;
                overflow: hidden;
            }

            .info-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: linear-gradient(180deg, ${theme.primaryColor}, ${theme.accentColor});
            }

            .info-card-title {
                font-size: 20px;
                font-weight: 600;
                color: ${theme.headingColor};
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid ${theme.borderColor};
                last-child: { border-bottom: none; }
            }

            .info-label {
                font-weight: 600;
                color: ${theme.headingColor};
                flex: 1;
            }

            .info-value {
                font-weight: 500;
                color: ${theme.textColor};
                text-align: right;
                flex: 2;
            }

            /* Buttons */
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                margin: 10px 0;
            }

            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
            }

            /* Status Badges */
            .status-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .status-available { background-color: ${theme.successColor}; color: white; }
            .status-pending { background-color: ${theme.warningColor}; color: white; }
            .status-completed { background-color: ${theme.primaryColor}; color: white; }

            /* Footer */
            .email-footer {
                background-color: ${theme.backgroundColor};
                padding: 30px;
                text-align: center;
                border-top: 1px solid ${theme.borderColor};
            }

            .footer-contact {
                margin-bottom: 20px;
            }

            .contact-item {
                display: inline-block;
                margin: 0 15px;
                color: ${theme.textColor};
                text-decoration: none;
                font-weight: 500;
            }

            .footer-disclaimer {
                font-size: 12px;
                color: ${theme.textColor};
                opacity: 0.7;
                margin-top: 15px;
                line-height: 1.5;
            }

            /* Mobile Responsive */
            @media (max-width: 640px) {
                .email-container { margin: 10px; border-radius: 8px; }
                .email-header { padding: 30px 20px; }
                .company-name { font-size: 24px; }
                .email-content { padding: 30px 20px; }
                .info-card { padding: 20px; margin: 20px 0; }
                .info-row { flex-direction: column; align-items: flex-start; gap: 5px; }
                .info-value { text-align: left; }
                .cta-button { width: 100%; box-sizing: border-box; }
                .contact-item { display: block; margin: 5px 0; }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="email-header">
                ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName}" class="company-logo">` : ''}
                <h1 class="company-name">${branding.companyName}</h1>
                ${branding.tagline ? `<p class="company-tagline">${branding.tagline}</p>` : ''}
            </div>

            <!-- Content -->
            <div class="email-content">
                ${this.generateTemplateContent(templateType, variables, theme)}
            </div>

            <!-- Footer -->
            <div class="email-footer">
                <div class="footer-contact">
                    ${variables.tenant?.phone ? `<a href="tel:${variables.tenant.phone}" class="contact-item">📞 ${variables.tenant.phone}</a>` : ''}
                    ${variables.tenant?.website ? `<a href="${variables.tenant.website}" class="contact-item">🌐 ${variables.tenant.website}</a>` : ''}
                    <a href="mailto:${template.fromEmail}" class="contact-item">✉️ ${template.fromEmail}</a>
                </div>
                <p class="footer-disclaimer">
                    This is an automated message from ${branding.companyName}.
                    Please do not reply directly to this email.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    return {
      ...template,
      htmlContent: professionalHtml,
    };
  }

  // 📝 GENERATE TEMPLATE CONTENT
  private generateTemplateContent(
    templateType: EmailTemplateType,
    variables: EmailTemplateVariables,
    theme: ProfessionalEmailTheme
  ): string {
    switch (templateType) {
      case 'load_information_existing_carrier':
        return this.generateLoadInformationContent(variables, theme);

      case 'carrier_invitation_new':
        return this.generateCarrierInvitationContent(variables, theme);

      case 'factoring_bol_submission':
        return this.generateFactoringBOLContent(variables, theme);

      default:
        return this.generateGenericContent(variables, theme);
    }
  }

  // 🚛 LOAD INFORMATION TEMPLATE
  private generateLoadInformationContent(
    variables: EmailTemplateVariables,
    theme: ProfessionalEmailTheme
  ): string {
    const load = variables.load || {};
    const carrier = variables.carrier || {};

    return `
        <div class="greeting">
            Hi ${carrier.contactName || 'there'} from ${carrier.company || 'your company'},
        </div>

        <div class="main-message">
            Thanks for your inquiry about <strong>Load ${load.id}</strong>! We're excited to work with you on this shipment.
        </div>

        <div class="info-card">
            <div class="info-card-title">
                🚛 Load Details
            </div>
            <div class="info-row">
                <span class="info-label">Load ID:</span>
                <span class="info-value"><strong>${load.id || 'N/A'}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Route:</span>
                <span class="info-value">${load.origin?.city || 'Origin'}, ${load.origin?.state || ''} → ${load.destination?.city || 'Destination'}, ${load.destination?.state || ''}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Rate:</span>
                <span class="info-value" style="color: ${theme.successColor}; font-weight: 700; font-size: 18px;">$${Number(load.rate || 0).toLocaleString()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Distance:</span>
                <span class="info-value">${load.distance || 'N/A'} miles</span>
            </div>
            <div class="info-row">
                <span class="info-label">Pickup Date:</span>
                <span class="info-value">${load.pickupDate || 'TBD'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Delivery Date:</span>
                <span class="info-value">${load.deliveryDate || 'TBD'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Equipment:</span>
                <span class="info-value">${load.equipment || 'Standard'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Weight:</span>
                <span class="info-value">${load.weight || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Status:</span>
                <span class="info-value">
                    <span class="status-badge status-available">${load.status || 'Available'}</span>
                </span>
            </div>
        </div>

        <div class="main-message">
            <strong>Ready to book this load?</strong> Reply to this email or call us directly. First come, first served!
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="tel:${variables.tenant?.phone || ''}" class="cta-button">
                📞 Call to Book Now
            </a>
        </div>`;
  }

  // 🤝 CARRIER INVITATION TEMPLATE
  private generateCarrierInvitationContent(
    variables: EmailTemplateVariables,
    theme: ProfessionalEmailTheme
  ): string {
    const load = variables.load || {};
    const inquiry = variables.inquiry || {};

    return `
        <div class="greeting">
            Hi ${inquiry.contactName || 'there'} from ${inquiry.company || 'your company'},
        </div>

        <div class="main-message">
            Thanks for your inquiry about <strong>Load ${load.id}</strong> (${load.origin?.city || 'Origin'} → ${load.destination?.city || 'Destination'}, $${Number(load.rate || 0).toLocaleString()}).
        </div>

        <div class="main-message">
            To access this load and our full load board, you'll need to join our carrier network first. It's fast, easy, and gives you access to hundreds of quality loads!
        </div>

        <div class="info-card">
            <div class="info-card-title">
                🚛 Load You Inquired About
            </div>
            <div class="info-row">
                <span class="info-label">Route:</span>
                <span class="info-value">${load.origin?.city || 'Origin'} → ${load.destination?.city || 'Destination'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Rate:</span>
                <span class="info-value" style="color: ${theme.successColor}; font-weight: 700;">$${Number(load.rate || 0).toLocaleString()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Equipment:</span>
                <span class="info-value">${load.equipment || 'Standard'}</span>
            </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://fleetflow.app/carrier-landing" class="cta-button">
                🚀 Join Our Network Now
            </a>
        </div>

        <div class="info-card" style="background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 10%, #fef3c7 100%);">
            <div class="info-card-title" style="color: #92400e;">
                ⚠️ Important Note
            </div>
            <p style="color: #92400e; margin: 0; font-weight: 500;">
                All loads are available on a <strong>first-come, first-served basis</strong>. No reservations are held.
                Join our network quickly to secure this and other premium loads!
            </p>
        </div>`;
  }

  // 💰 FACTORING BOL TEMPLATE
  private generateFactoringBOLContent(
    variables: EmailTemplateVariables,
    theme: ProfessionalEmailTheme
  ): string {
    const load = variables.load || {};
    const carrier = variables.carrier || {};
    const factoring = variables.factoring || {};
    const driver = variables.driver || {};

    return `
        <div class="greeting">
            Dear ${factoring.accountExecutive?.name || 'Factoring Representative'},
            ${factoring.accountExecutive?.title ? ` ${factoring.accountExecutive.title}` : ''}
        </div>

        <div class="main-message">
            Please find attached the completed Bill of Lading for <strong>Load ${load.id}</strong> that was successfully delivered today.
            All documentation is ready for processing according to our factoring agreement.
        </div>

        <div class="info-card">
            <div class="info-card-title">
                📋 Load Details
            </div>
            <div class="info-row">
                <span class="info-label">Load ID:</span>
                <span class="info-value"><strong>${load.id || 'N/A'}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Route:</span>
                <span class="info-value">${load.origin || 'Origin'} → ${load.destination || 'Destination'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Amount:</span>
                <span class="info-value" style="color: ${theme.successColor}; font-weight: 700; font-size: 18px;">$${Number(load.amount || 0).toLocaleString()}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Delivered:</span>
                <span class="info-value">${load.deliveryDate || 'Today'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Driver:</span>
                <span class="info-value">${driver.name || 'N/A'}</span>
            </div>
        </div>

        <div class="info-card">
            <div class="info-card-title">
                🏢 Carrier Information
            </div>
            <div class="info-row">
                <span class="info-label">Company:</span>
                <span class="info-value"><strong>${carrier.name || 'N/A'}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">MC Number:</span>
                <span class="info-value">${carrier.mcNumber || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Contact:</span>
                <span class="info-value">${carrier.contact || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Phone:</span>
                <span class="info-value">${carrier.phone || 'N/A'}</span>
            </div>
        </div>

        <div class="info-card" style="background: linear-gradient(135deg, #dcfce7 0%, #10b981 10%, #dcfce7 100%);">
            <div class="info-card-title" style="color: #065f46;">
                💰 Factoring Details
            </div>
            <div class="info-row">
                <span class="info-label" style="color: #065f46;">Factor Rate:</span>
                <span class="info-value" style="color: #065f46; font-weight: 600;">${factoring.rate || 'N/A'}%</span>
            </div>
            <div class="info-row">
                <span class="info-label" style="color: #065f46;">Advance Rate:</span>
                <span class="info-value" style="color: #065f46; font-weight: 600;">${factoring.advanceRate || 'N/A'}%</span>
            </div>
            <div class="info-row">
                <span class="info-label" style="color: #065f46;">Expected Advance:</span>
                <span class="info-value" style="color: #065f46; font-weight: 700; font-size: 16px;">$${Number(load.expectedAdvance || 0).toLocaleString()}</span>
            </div>
        </div>

        <div class="main-message">
            This load has been <strong>successfully delivered</strong> with all required documentation attached.
            Please process according to our factoring agreement terms.
        </div>`;
  }

  // 📄 GENERIC CONTENT
  private generateGenericContent(
    variables: EmailTemplateVariables,
    theme: ProfessionalEmailTheme
  ): string {
    return `
        <div class="main-message">
            Thank you for your business with us. We appreciate your partnership and look forward to continuing our professional relationship.
        </div>`;
  }

  // 🏢 GET COMPANY BRANDING
  private async getCompanyBranding(
    tenantId: string,
    theme: string = 'fleetflow'
  ): Promise<CompanyBranding> {
    // Mock implementation - replace with actual tenant branding service
    const mockBranding: Record<string, CompanyBranding> = {
      'tenant-001': {
        companyName: 'ABC Logistics Pro',
        tagline: 'Your Premium Transportation Partner',
        logoUrl:
          'https://via.placeholder.com/200x60/2563eb/ffffff?text=ABC+Logistics',
        colors: this.themes[theme] || this.themes['fleetflow'],
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headerStyle: 'modern',
      },
      'tenant-002': {
        companyName: 'XYZ Freight Solutions',
        tagline: 'Reliable. Fast. Professional.',
        logoUrl:
          'https://via.placeholder.com/200x60/0f766e/ffffff?text=XYZ+Freight',
        colors: this.themes['logistics'] || this.themes['fleetflow'],
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headerStyle: 'modern',
      },
    };

    return (
      mockBranding[tenantId] || {
        companyName: 'FleetFlow',
        tagline: 'Go With The Flow',
        colors: this.themes[theme] || this.themes['fleetflow'],
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        headerStyle: 'modern',
      }
    );
  }

  // 🎨 GET AVAILABLE THEMES
  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }

  // 🎨 GET THEME
  getTheme(themeName: string): ProfessionalEmailTheme {
    return this.themes[themeName] || this.themes['fleetflow'];
  }
}

export const enhancedEmailTemplateService = new EnhancedEmailTemplateService();


















