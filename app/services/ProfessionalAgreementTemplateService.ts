/**
 * Professional Agreement Template Service
 * Generates visually appealing, legally compliant agreement documents with modern HTML/CSS styling,
 * professional typography, and enhanced readability for FleetFlow legal documents.
 */

import {
  SubscriptionAgreement,
  subscriptionAgreementService,
} from './SubscriptionAgreementService';
import { DocumentFlowService } from './document-flow-service'; // Import existing rate confirmation system
import { AgreementDocument, documentService } from './document-service'; // Import existing comprehensive agreement system
import { CarrierData } from './enhanced-carrier-service';
import { Load } from './loadService';

export interface LegalDocumentTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardBackgroundColor: string;
  textColor: string;
  headingColor: string;
  borderColor: string;
  highlightColor: string;
  warningColor: string;
  fontFamily: string;
  headerFontFamily: string;
  legalFontFamily: string;
}

export interface LegalDocumentBranding {
  companyName: string;
  companyLegalName: string;
  logoUrl?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  legalEntity: 'LLC' | 'Corporation' | 'Partnership' | 'Sole Proprietorship';
  stateOfIncorporation?: string;
  registrationNumber?: string;
}

export interface AgreementGenerationOptions {
  theme?: string;
  format?: 'html' | 'pdf-ready' | 'web';
  includeSignaturePage?: boolean;
  includeTableOfContents?: boolean;
  branding?: Partial<LegalDocumentBranding>;
  customVariables?: { [key: string]: string };
}

class ProfessionalAgreementTemplateService {
  private themes: Record<string, LegalDocumentTheme> = {
    professional: {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      accentColor: '#3b82f6',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f9fafb',
      textColor: '#374151',
      headingColor: '#1f2937',
      borderColor: '#d1d5db',
      highlightColor: '#fef3c7',
      warningColor: '#fecaca',
      fontFamily: "'Times New Roman', 'Georgia', serif",
      headerFontFamily: "'Arial', 'Helvetica', sans-serif",
      legalFontFamily: "'Times New Roman', 'Georgia', serif",
    },
    modern: {
      primaryColor: '#0f172a',
      secondaryColor: '#334155',
      accentColor: '#0ea5e9',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f8fafc',
      textColor: '#475569',
      headingColor: '#0f172a',
      borderColor: '#e2e8f0',
      highlightColor: '#fef9c3',
      warningColor: '#fecdd3',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      headerFontFamily: "'Inter', 'Segoe UI', sans-serif",
      legalFontFamily: "'Georgia', 'Times New Roman', serif",
    },
    corporate: {
      primaryColor: '#1e3a8a',
      secondaryColor: '#3730a3',
      accentColor: '#6366f1',
      backgroundColor: '#ffffff',
      cardBackgroundColor: '#f1f5f9',
      textColor: '#334155',
      headingColor: '#1e3a8a',
      borderColor: '#cbd5e1',
      highlightColor: '#e0e7ff',
      warningColor: '#fed7d7',
      fontFamily: "'Palatino', 'Georgia', serif",
      headerFontFamily: "'Arial', 'Helvetica', sans-serif",
      legalFontFamily: "'Palatino', 'Georgia', serif",
    },
  };

  private defaultBranding: LegalDocumentBranding = {
    companyName: 'FleetFlow',
    companyLegalName: 'FleetFlow Logistics LLC',
    address: '1234 Business Drive',
    city: 'Business City',
    state: 'CA',
    zipCode: '90210',
    phone: '(555) 123-4567',
    email: 'legal@fleetflow.com',
    website: 'www.fleetflow.com',
    legalEntity: 'LLC',
    stateOfIncorporation: 'Delaware',
    registrationNumber: 'DE-123456789',
  };

  /**
   * Generate a professional HTML agreement document
   */
  async generateProfessionalAgreement(
    agreementId: string,
    options: AgreementGenerationOptions = {}
  ): Promise<{ html: string; filename: string }> {
    const agreement = subscriptionAgreementService.getAgreement(agreementId);
    if (!agreement) {
      throw new Error(`Agreement not found: ${agreementId}`);
    }

    const theme = this.themes[options.theme || 'professional'];
    const branding = { ...this.defaultBranding, ...options.branding };

    const html = this.generateAgreementHTML(
      agreement,
      theme,
      branding,
      options
    );
    const filename = `${agreement.title.replace(/\s+/g, '-')}-v${agreement.version}.html`;

    return { html, filename };
  }

  /**
   * Generate the complete HTML structure for the agreement document
   */
  private generateAgreementHTML(
    agreement: SubscriptionAgreement,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding,
    options: AgreementGenerationOptions
  ): string {
    const isPrintReady = options.format === 'pdf-ready';

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${agreement.title} - ${branding.companyName}</title>
    <style>
        ${this.generateLegalCSS(theme, branding, isPrintReady)}
    </style>
</head>
<body>
    <div class="legal-document">
        ${this.generateDocumentHeader(agreement, theme, branding)}
        ${options.includeTableOfContents ? this.generateTableOfContents(agreement.content) : ''}
        ${this.generateDocumentBody(agreement, theme, branding, options.customVariables)}
        ${this.generateDocumentFooter(agreement, theme, branding)}
        ${options.includeSignaturePage ? this.generateSignaturePage(agreement, theme, branding) : ''}
    </div>
</body>
</html>`;
  }

  /**
   * Generate comprehensive CSS styles for legal documents
   */
  private generateLegalCSS(
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding,
    isPrintReady: boolean
  ): string {
    return `
/* Legal Document Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* Document Base Styles */
body {
    font-family: ${theme.legalFontFamily};
    background-color: ${theme.backgroundColor};
    color: ${theme.textColor};
    line-height: 1.8;
    font-size: 12px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Legal Document Container */
.legal-document {
    max-width: ${isPrintReady ? '100%' : '8.5in'};
    margin: 0 auto;
    background: ${theme.backgroundColor};
    padding: ${isPrintReady ? '0.75in' : '48px'};
    ${isPrintReady ? '' : 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid ' + theme.borderColor + ';'}
    min-height: ${isPrintReady ? '11in' : 'auto'};
}

/* Document Header */
.document-header {
    text-align: center;
    margin-bottom: 48px;
    padding-bottom: 24px;
    border-bottom: 2px solid ${theme.primaryColor};
    position: relative;
}

.document-header::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: ${theme.accentColor};
}

.company-logo-header {
    width: 120px;
    height: auto;
    margin-bottom: 16px;
    opacity: 0.9;
}

.company-name-header {
    font-family: ${theme.headerFontFamily};
    font-size: 24px;
    font-weight: 700;
    color: ${theme.primaryColor};
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
}

.company-legal-name {
    font-size: 14px;
    color: ${theme.secondaryColor};
    margin-bottom: 16px;
    font-style: italic;
}

.document-title {
    font-family: ${theme.headerFontFamily};
    font-size: 20px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin-bottom: 12px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.document-meta {
    display: flex;
    justify-content: center;
    gap: 32px;
    flex-wrap: wrap;
    margin-top: 16px;
    font-size: 11px;
    color: ${theme.secondaryColor};
}

.meta-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.meta-label {
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 2px;
}

.meta-value {
    color: ${theme.textColor};
}

/* Table of Contents */
.table-of-contents {
    background: ${theme.cardBackgroundColor};
    border: 1px solid ${theme.borderColor};
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 32px;
    page-break-after: avoid;
}

.toc-title {
    font-family: ${theme.headerFontFamily};
    font-size: 16px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin-bottom: 16px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.toc-list {
    list-style: none;
    counter-reset: toc-counter;
}

.toc-item {
    counter-increment: toc-counter;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px dotted ${theme.borderColor};
    font-size: 11px;
}

.toc-item:last-child {
    border-bottom: none;
}

.toc-item::before {
    content: counter(toc-counter, decimal) ".";
    font-weight: 600;
    color: ${theme.primaryColor};
    margin-right: 8px;
}

.toc-link {
    flex: 1;
    text-decoration: none;
    color: ${theme.textColor};
    transition: color 0.2s ease;
}

.toc-link:hover {
    color: ${theme.accentColor};
}

.toc-page {
    color: ${theme.secondaryColor};
    font-weight: 500;
}

/* Document Body */
.document-body {
    line-height: 1.8;
    text-align: justify;
}

/* Headings Hierarchy */
.document-body h1 {
    font-family: ${theme.headerFontFamily};
    font-size: 18px;
    font-weight: 700;
    color: ${theme.primaryColor};
    margin: 32px 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid ${theme.primaryColor};
    padding-bottom: 8px;
    page-break-after: avoid;
}

.document-body h2 {
    font-family: ${theme.headerFontFamily};
    font-size: 16px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin: 24px 0 12px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    page-break-after: avoid;
}

.document-body h3 {
    font-family: ${theme.headerFontFamily};
    font-size: 14px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin: 20px 0 10px 0;
    page-break-after: avoid;
}

.document-body h4 {
    font-size: 13px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin: 16px 0 8px 0;
    page-break-after: avoid;
}

/* Paragraphs */
.document-body p {
    margin-bottom: 12px;
    text-indent: 0;
    text-align: justify;
    orphans: 2;
    widows: 2;
}

.document-body p:first-of-type {
    margin-top: 0;
}

/* Lists */
.document-body ul,
.document-body ol {
    margin: 12px 0 12px 24px;
    padding-left: 0;
}

.document-body li {
    margin-bottom: 6px;
    line-height: 1.6;
}

.document-body ul li {
    list-style-type: disc;
}

.document-body ol li {
    list-style-type: decimal;
}

/* Nested Lists */
.document-body ul ul,
.document-body ol ol,
.document-body ul ol,
.document-body ol ul {
    margin: 6px 0 6px 20px;
}

/* Legal Subsections */
.legal-subsection {
    margin: 16px 0;
    padding-left: 20px;
    border-left: 3px solid ${theme.accentColor};
    background: ${theme.cardBackgroundColor};
    padding: 16px 20px;
    border-radius: 4px;
}

.subsection-number {
    font-weight: 700;
    color: ${theme.primaryColor};
    margin-right: 8px;
}

/* Important Clauses */
.important-clause {
    background: ${theme.highlightColor};
    border: 1px solid ${theme.accentColor};
    border-radius: 6px;
    padding: 16px;
    margin: 16px 0;
    page-break-inside: avoid;
}

.important-clause::before {
    content: "⚠️ IMPORTANT: ";
    font-weight: 700;
    color: ${theme.primaryColor};
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
}

/* Warning Clauses */
.warning-clause {
    background: ${theme.warningColor};
    border: 1px solid #ef4444;
    border-radius: 6px;
    padding: 16px;
    margin: 16px 0;
    page-break-inside: avoid;
}

.warning-clause::before {
    content: "🚨 NOTICE: ";
    font-weight: 700;
    color: #dc2626;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.5px;
}

/* Legal Definitions */
.legal-definitions {
    background: ${theme.cardBackgroundColor};
    border: 1px solid ${theme.borderColor};
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
}

.definition-term {
    font-weight: 700;
    color: ${theme.primaryColor};
    text-decoration: underline;
}

.definition-text {
    margin-left: 16px;
    font-style: italic;
    color: ${theme.secondaryColor};
}

/* Signature Section */
.signature-section {
    margin-top: 48px;
    padding-top: 32px;
    border-top: 2px solid ${theme.primaryColor};
    page-break-before: always;
}

.signature-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    margin-top: 32px;
}

.signature-block {
    text-align: center;
}

.signature-title {
    font-family: ${theme.headerFontFamily};
    font-size: 14px;
    font-weight: 600;
    color: ${theme.headingColor};
    margin-bottom: 32px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.signature-line {
    border-bottom: 1px solid ${theme.textColor};
    height: 40px;
    margin-bottom: 8px;
    position: relative;
}

.signature-label {
    font-size: 11px;
    color: ${theme.secondaryColor};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 24px;
}

.signature-info {
    font-size: 11px;
    color: ${theme.textColor};
    line-height: 1.4;
}

/* Document Footer */
.document-footer {
    margin-top: 32px;
    padding-top: 16px;
    border-top: 1px solid ${theme.borderColor};
    text-align: center;
    font-size: 10px;
    color: ${theme.secondaryColor};
}

.footer-company {
    font-weight: 600;
    margin-bottom: 8px;
}

.footer-address {
    margin-bottom: 8px;
    line-height: 1.4;
}

.footer-contact {
    margin-bottom: 8px;
}

.footer-legal {
    font-style: italic;
    margin-top: 16px;
}

/* Page Breaks */
.page-break {
    page-break-before: always;
}

.no-break {
    page-break-inside: avoid;
}

/* Responsive Design for Web View */
@media screen and (max-width: 768px) {
    .legal-document {
        padding: 24px;
        margin: 16px;
    }

    .document-meta {
        flex-direction: column;
        gap: 16px;
    }

    .signature-grid {
        grid-template-columns: 1fr;
        gap: 32px;
    }

    .document-body h1 {
        font-size: 16px;
    }

    .document-body h2 {
        font-size: 14px;
    }
}

/* Print Styles */
@media print {
    * {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
    }

    body {
        font-size: 11px;
        background: white !important;
    }

    .legal-document {
        box-shadow: none;
        border: none;
        max-width: none;
        margin: 0;
        padding: 0.5in;
    }

    .document-header {
        margin-bottom: 36px;
    }

    .signature-section {
        page-break-before: always;
    }

    .important-clause,
    .warning-clause,
    .legal-definitions {
        page-break-inside: avoid;
    }

    @page {
        margin: 0.75in;
        size: letter;
    }

    @page :first {
        margin-top: 1in;
    }
}`;
  }

  /**
   * Generate the document header
   */
  private generateDocumentHeader(
    agreement: SubscriptionAgreement,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="document-header">
    ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName} Logo" class="company-logo-header">` : ''}

    <div class="company-name-header">${branding.companyName}</div>
    <div class="company-legal-name">${branding.companyLegalName}</div>

    <h1 class="document-title">${agreement.title}</h1>

    <div class="document-meta">
        <div class="meta-item">
            <div class="meta-label">Version</div>
            <div class="meta-value">${agreement.version}</div>
        </div>

        <div class="meta-item">
            <div class="meta-label">Effective Date</div>
            <div class="meta-value">${agreement.effectiveDate.toLocaleDateString()}</div>
        </div>

        <div class="meta-item">
            <div class="meta-label">Document ID</div>
            <div class="meta-value">${agreement.id}</div>
        </div>

        ${
          agreement.expirationDate
            ? `
        <div class="meta-item">
            <div class="meta-label">Expiration</div>
            <div class="meta-value">${agreement.expirationDate.toLocaleDateString()}</div>
        </div>
        `
            : ''
        }
    </div>
</div>`;
  }

  /**
   * Generate table of contents
   */
  private generateTableOfContents(content: string): string {
    const headings = this.extractHeadings(content);
    if (headings.length === 0) return '';

    const tocItems = headings
      .map(
        (heading, index) => `
        <div class="toc-item">
            <a href="#section-${index + 1}" class="toc-link">${heading.text}</a>
            <span class="toc-page">${index + 2}</span>
        </div>
    `
      )
      .join('');

    return `
<div class="table-of-contents">
    <h2 class="toc-title">Table of Contents</h2>
    <div class="toc-list">
        ${tocItems}
    </div>
</div>`;
  }

  /**
   * Generate the document body with enhanced formatting
   */
  private generateDocumentBody(
    agreement: SubscriptionAgreement,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding,
    customVariables?: { [key: string]: string }
  ): string {
    let content = agreement.content;

    // Replace template variables if provided
    if (customVariables) {
      for (const [key, value] of Object.entries(customVariables)) {
        content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
    }

    // Replace company branding variables
    content = content.replace(/\{\{companyName\}\}/g, branding.companyName);
    content = content.replace(
      /\{\{companyLegalName\}\}/g,
      branding.companyLegalName
    );
    content = content.replace(
      /\{\{companyAddress\}\}/g,
      `${branding.address}, ${branding.city}, ${branding.state} ${branding.zipCode}`
    );
    content = content.replace(/\{\{companyPhone\}\}/g, branding.phone);
    content = content.replace(/\{\{companyEmail\}\}/g, branding.email);

    // Convert markdown-style content to HTML with legal formatting
    content = this.convertToLegalHTML(content);

    return `
<div class="document-body">
    ${content}
</div>`;
  }

  /**
   * Convert content to legal HTML format
   */
  private convertToLegalHTML(content: string): string {
    let html = content;

    // Convert headings with proper hierarchy
    html = html.replace(/^# (.+)$/gm, '<h1 id="section-$1">$1</h1>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^#### (.+)$/gm, '<h4>$1</h4>');

    // Convert paragraphs
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    html = html.replace(/<p>\s*<h([1-4])>/g, '<h$1>');
    html = html.replace(/<\/h([1-4])>\s*<\/p>/g, '</h$1>');

    // Convert lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Convert numbered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Format important clauses
    html = html.replace(
      /\*\*IMPORTANT:\*\* (.+)/g,
      '<div class="important-clause">$1</div>'
    );

    // Format warning clauses
    html = html.replace(
      /\*\*NOTICE:\*\* (.+)/g,
      '<div class="warning-clause">$1</div>'
    );

    // Format legal definitions
    html = html.replace(
      /\*\*([A-Z][^*]+)\*\*: (.+)/g,
      '<div class="legal-definitions"><span class="definition-term">$1</span>: <span class="definition-text">$2</span></div>'
    );

    // Bold formatting
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic formatting
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Format subsections with numbering
    html = html.replace(
      /^(\d+\.\d+)\s+(.+)$/gm,
      '<div class="legal-subsection"><span class="subsection-number">$1</span>$2</div>'
    );

    return html;
  }

  /**
   * Generate the document footer
   */
  private generateDocumentFooter(
    agreement: SubscriptionAgreement,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="document-footer">
    <div class="footer-company">${branding.companyLegalName}</div>

    <div class="footer-address">
        ${branding.address}<br>
        ${branding.city}, ${branding.state} ${branding.zipCode}
    </div>

    <div class="footer-contact">
        Phone: ${branding.phone} | Email: ${branding.email}
        ${branding.website ? ` | Website: ${branding.website}` : ''}
    </div>

    <div class="footer-legal">
        This document was generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}<br>
        ${branding.companyLegalName}, a ${branding.stateOfIncorporation || 'Delaware'} ${branding.legalEntity}
        ${branding.registrationNumber ? ` (Registration: ${branding.registrationNumber})` : ''}
    </div>
</div>`;
  }

  /**
   * Generate signature page
   */
  private generateSignaturePage(
    agreement: SubscriptionAgreement,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="signature-section page-break">
    <h2 style="text-align: center; font-family: ${theme.headerFontFamily}; color: ${theme.primaryColor}; margin-bottom: 32px;">
        SIGNATURE PAGE
    </h2>

    <p style="text-align: center; margin-bottom: 32px; font-style: italic;">
        By signing below, the parties acknowledge that they have read, understood, and agree to be bound by the terms and conditions of this ${agreement.title}.
    </p>

    <div class="signature-grid">
        <div class="signature-block">
            <div class="signature-title">${branding.companyName}</div>

            <div class="signature-line"></div>
            <div class="signature-label">Authorized Signature</div>

            <div class="signature-line"></div>
            <div class="signature-label">Print Name and Title</div>

            <div class="signature-line"></div>
            <div class="signature-label">Date</div>

            <div class="signature-info">
                ${branding.companyLegalName}<br>
                ${branding.address}<br>
                ${branding.city}, ${branding.state} ${branding.zipCode}
            </div>
        </div>

        <div class="signature-block">
            <div class="signature-title">Customer / Subscriber</div>

            <div class="signature-line"></div>
            <div class="signature-label">Authorized Signature</div>

            <div class="signature-line"></div>
            <div class="signature-label">Print Name and Title</div>

            <div class="signature-line"></div>
            <div class="signature-label">Date</div>

            <div class="signature-info">
                Company: _________________________<br>
                Address: _________________________<br>
                ________________________________
            </div>
        </div>
    </div>

    <div style="margin-top: 48px; padding: 20px; background: ${theme.cardBackgroundColor}; border: 1px solid ${theme.borderColor}; border-radius: 8px;">
        <h4 style="margin-bottom: 12px; color: ${theme.headingColor};">Digital Signature Information</h4>
        <p style="font-size: 11px; color: ${theme.secondaryColor}; line-height: 1.5;">
            This document may be executed by digital signature in accordance with applicable electronic signature laws.
            Digital signatures shall have the same legal effect as handwritten signatures when properly executed.
        </p>
    </div>
</div>`;
  }

  /**
   * Extract headings from content for table of contents
   */
  private extractHeadings(content: string): { level: number; text: string }[] {
    const headingRegex = /^(#{1,4})\s+(.+)$/gm;
    const headings: { level: number; text: string }[] = [];

    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }

    return headings;
  }

  /**
   * Get theme by name
   */
  getTheme(themeName: string): LegalDocumentTheme {
    return this.themes[themeName] || this.themes.professional;
  }

  /**
   * Get available themes
   */
  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }

  /**
   * Get company branding for tenant
   */
  getCompanyBranding(tenantId: string): LegalDocumentBranding {
    // Mock tenant-specific branding - replace with actual tenant service
    const mockBrandings: Record<string, Partial<LegalDocumentBranding>> = {
      'global-freight': {
        companyName: 'Global Freight Solutions',
        companyLegalName: 'Global Freight Solutions LLC',
        address: '5678 Transportation Blvd',
        city: 'Logistics City',
        state: 'TX',
        zipCode: '75201',
        phone: '(555) 888-1234',
        email: 'legal@globalfreight.com',
        website: 'www.globalfreight.com',
        stateOfIncorporation: 'Texas',
        registrationNumber: 'TX-987654321',
      },
      'swift-freight': {
        companyName: 'Swift Freight Services',
        companyLegalName: 'Swift Freight Services Inc.',
        address: '9876 Express Lane',
        city: 'Swift City',
        state: 'FL',
        zipCode: '33101',
        phone: '(555) 777-5678',
        email: 'legal@swiftfreight.com',
        website: 'www.swiftfreight.com',
        legalEntity: 'Corporation',
        stateOfIncorporation: 'Florida',
        registrationNumber: 'FL-456789123',
      },
    };

    return {
      ...this.defaultBranding,
      ...mockBrandings[tenantId],
    };
  }

  /**
   * Generate all standard agreements for a tenant
   */
  async generateAllTenantAgreements(
    tenantId: string,
    options: AgreementGenerationOptions = {}
  ): Promise<{ [agreementId: string]: { html: string; filename: string } }> {
    const requiredAgreements =
      subscriptionAgreementService.getRequiredAgreements();
    const results: {
      [agreementId: string]: { html: string; filename: string };
    } = {};

    const branding = this.getCompanyBranding(tenantId);

    for (const agreement of requiredAgreements) {
      try {
        const result = await this.generateProfessionalAgreement(agreement.id, {
          ...options,
          branding,
        });
        results[agreement.id] = result;
      } catch (error) {
        console.error(`Failed to generate agreement ${agreement.id}:`, error);
      }
    }

    return results;
  }

  // =============================================================================
  // EXISTING AGREEMENT SYSTEM INTEGRATION
  // Using the comprehensive agreement system from document-service.ts
  // =============================================================================

  /**
   * Generate professionally styled EXISTING Broker-Carrier Agreement
   * Uses YOUR comprehensive 14-article agreement from document-service.ts
   */
  async generateExistingBrokerCarrierAgreement(
    carrierData: any,
    signerData: any,
    tenantId: string,
    options: AgreementGenerationOptions = {}
  ): Promise<{
    html: string;
    filename: string;
    originalAgreement: AgreementDocument;
  }> {
    // USE YOUR EXISTING comprehensive agreement system
    const originalAgreement = documentService.generateBrokerCarrierAgreement(
      carrierData,
      signerData
    );

    const theme = this.themes[options.theme || 'legal'];
    const branding = this.getCompanyBranding(tenantId);

    // Apply professional styling to YOUR existing content
    const html = this.wrapExistingAgreementWithProfessionalStyling(
      originalAgreement,
      theme,
      branding,
      options
    );

    const filename = `${originalAgreement.title.replace(/\s+/g, '-')}-Professional.html`;

    return {
      html,
      filename,
      originalAgreement,
    };
  }

  /**
   * Generate professionally styled EXISTING Dispatcher-Carrier Agreement
   * Uses YOUR dispatch agreement with 10% fee structure from document-service.ts
   */
  async generateExistingDispatcherCarrierAgreement(
    carrierData: any,
    signerData: any,
    tenantId: string,
    options: AgreementGenerationOptions = {}
  ): Promise<{
    html: string;
    filename: string;
    originalAgreement: AgreementDocument;
  }> {
    // USE YOUR EXISTING dispatcher agreement system
    const originalAgreement =
      documentService.generateDispatcherCarrierAgreement(
        carrierData,
        signerData
      );

    const theme = this.themes[options.theme || 'corporate'];
    const branding = this.getCompanyBranding(tenantId);

    // Apply professional styling to YOUR existing content
    const html = this.wrapExistingAgreementWithProfessionalStyling(
      originalAgreement,
      theme,
      branding,
      options
    );

    const filename = `${originalAgreement.title.replace(/\s+/g, '-')}-Professional.html`;

    return {
      html,
      filename,
      originalAgreement,
    };
  }

  /**
   * Generate professionally styled EXISTING AI Flow Agreements
   * Uses YOUR AI Flow agreements from document-service.ts
   */
  async generateExistingAIFlowAgreement(
    carrierData: any,
    signerData: any,
    tenantId: string,
    agreementType: 'broker' | 'dispatcher',
    options: AgreementGenerationOptions = {}
  ): Promise<{
    html: string;
    filename: string;
    originalAgreement: AgreementDocument;
  }> {
    // USE YOUR EXISTING AI Flow agreement system
    const originalAgreement =
      agreementType === 'broker'
        ? documentService.generateBrokerAIFlowAgreement(carrierData, signerData)
        : documentService.generateDispatcherAIFlowAgreement(
            carrierData,
            signerData
          );

    const theme = this.themes[options.theme || 'modern'];
    const branding = this.getCompanyBranding(tenantId);

    // Apply professional styling to YOUR existing content
    const html = this.wrapExistingAgreementWithProfessionalStyling(
      originalAgreement,
      theme,
      branding,
      options
    );

    const filename = `${originalAgreement.title.replace(/\s+/g, '-')}-Professional.html`;

    return {
      html,
      filename,
      originalAgreement,
    };
  }

  /**
   * Apply professional HTML/CSS styling to YOUR existing agreement content
   * This preserves all YOUR comprehensive content and just makes it look professional
   */
  private wrapExistingAgreementWithProfessionalStyling(
    existingAgreement: AgreementDocument,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding,
    options: AgreementGenerationOptions
  ): string {
    const isPrintReady = options.format === 'pdf-ready';

    // Convert your existing agreement content to professional HTML
    const styledContent = this.convertExistingContentToHTML(
      existingAgreement.content
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${existingAgreement.title} - ${branding.companyName}</title>
    <style>
        ${this.generateLegalCSS(theme, branding, isPrintReady)}
    </style>
</head>
<body>
    <div class="legal-document">
        ${this.generateExistingAgreementHeader(existingAgreement, theme, branding)}
        ${this.generateExistingDocumentBody(styledContent, theme)}
        ${this.generateExistingAgreementFooter(existingAgreement, theme, branding)}
        ${options.includeSignaturePage ? this.generateExistingSignaturePage(existingAgreement, theme, branding) : ''}
    </div>
</body>
</html>`;
  }

  /**
   * Convert YOUR existing agreement content to professional HTML format
   * Preserves all your comprehensive content structure
   */
  private convertExistingContentToHTML(content: string): string {
    let html = content;

    // Convert your agreement sections to proper HTML headings
    html = html.replace(
      /^COMPREHENSIVE BROKER\/DISPATCH\/CARRIER AGREEMENT$/gm,
      '<h1>COMPREHENSIVE BROKER/DISPATCH/CARRIER AGREEMENT</h1>'
    );
    html = html.replace(
      /^DISPATCHER-CARRIER SERVICE AGREEMENT$/gm,
      '<h1>DISPATCHER-CARRIER SERVICE AGREEMENT</h1>'
    );
    html = html.replace(
      /^COMPREHENSIVE (BROKER|DISPATCHER) AI FLOW (.+) AGREEMENT$/gm,
      '<h1>COMPREHENSIVE $1 AI FLOW $2 AGREEMENT</h1>'
    );

    // Convert your ARTICLE sections to proper headings
    html = html.replace(/^ARTICLE (\d+): (.+)$/gm, '<h2>ARTICLE $1: $2</h2>');

    // Convert your subsection numbering
    html = html.replace(
      /^(\d+\.\d+)\s+(.+)$/gm,
      '<h3><span class="subsection-number">$1</span> $2</h3>'
    );
    html = html.replace(
      /^(\d+\.\d+\.\d+)\s+(.+)$/gm,
      '<h4><span class="subsection-number">$1</span> $2</h4>'
    );

    // Convert your information sections
    html = html.replace(
      /^AGREEMENT PREPARATION INFORMATION$/gm,
      '<h2>AGREEMENT PREPARATION INFORMATION</h2>'
    );
    html = html.replace(/^PARTY INFORMATION$/gm, '<h2>PARTY INFORMATION</h2>');
    html = html.replace(
      /^ELECTRONIC SIGNATURE ACKNOWLEDGMENT$/gm,
      '<h2>ELECTRONIC SIGNATURE ACKNOWLEDGMENT</h2>'
    );
    html = html.replace(
      /^DIGITAL SIGNATURE BLOCK$/gm,
      '<h2>DIGITAL SIGNATURE BLOCK</h2>'
    );

    // Convert your company/carrier information sections
    html = html.replace(
      /^BROKER\/DISPATCH COMPANY:$/gm,
      '<h3>BROKER/DISPATCH COMPANY:</h3>'
    );
    html = html.replace(/^CARRIER:$/gm, '<h3>CARRIER:</h3>');
    html = html.replace(/^SERVICE TERMS:$/gm, '<h2>SERVICE TERMS:</h2>');

    // Convert your bullet points to proper lists
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)\s*/gms, '<ul>$1</ul>');

    // Convert paragraphs - split by double newlines
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs
      .map((para) => {
        if (
          para.trim() &&
          !para.includes('<h') &&
          !para.includes('<ul') &&
          !para.includes('<li')
        ) {
          return `<p>${para.trim()}</p>`;
        }
        return para;
      })
      .join('\n\n');

    // Clean up multiple consecutive list tags
    html = html.replace(/<\/ul>\s*<ul>/g, '');

    // Bold text formatting for field labels
    html = html.replace(
      /^([A-Z][^:]+):\s*(.+)$/gm,
      '<p><strong>$1:</strong> $2</p>'
    );

    // Clean up any extra whitespace
    html = html.replace(/\n\s*\n/g, '\n');

    return html;
  }

  /**
   * Generate header for existing agreement
   */
  private generateExistingAgreementHeader(
    agreement: AgreementDocument,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="document-header">
    ${branding.logoUrl ? `<img src="${branding.logoUrl}" alt="${branding.companyName} Logo" class="company-logo-header">` : ''}

    <div class="company-name-header">${branding.companyName}</div>
    <div class="company-legal-name">${branding.companyLegalName}</div>

    <h1 class="document-title">${agreement.title}</h1>

    <div class="document-meta">
        <div class="meta-item">
            <div class="meta-label">Document ID</div>
            <div class="meta-value">${agreement.id}</div>
        </div>

        <div class="meta-item">
            <div class="meta-label">Signed Date</div>
            <div class="meta-value">${new Date(agreement.signedDate).toLocaleDateString()}</div>
        </div>

        <div class="meta-item">
            <div class="meta-label">Signed By</div>
            <div class="meta-value">${agreement.signedBy}</div>
        </div>

        <div class="meta-item">
            <div class="meta-label">Agreement Type</div>
            <div class="meta-value">${agreement.type.replace('_', ' ').toUpperCase()}</div>
        </div>
    </div>
</div>`;
  }

  /**
   * Generate body for existing agreement content
   */
  private generateExistingDocumentBody(
    styledContent: string,
    theme: LegalDocumentTheme
  ): string {
    return `
<div class="document-body">
    ${styledContent}
</div>`;
  }

  /**
   * Generate footer for existing agreement
   */
  private generateExistingAgreementFooter(
    agreement: AgreementDocument,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="document-footer">
    <div class="footer-company">${branding.companyLegalName}</div>

    <div class="footer-address">
        ${branding.address}<br>
        ${branding.city}, ${branding.state} ${branding.zipCode}
    </div>

    <div class="footer-contact">
        Phone: ${branding.phone} | Email: ${branding.email}
        ${branding.website ? ` | Website: ${branding.website}` : ''}
    </div>

    <div class="footer-legal">
        Professional styling applied to existing agreement content<br>
        Original Agreement ID: ${agreement.id}<br>
        ${branding.companyLegalName}, a ${branding.stateOfIncorporation || 'Delaware'} ${branding.legalEntity}
    </div>
</div>`;
  }

  /**
   * Generate signature page for existing agreement
   */
  private generateExistingSignaturePage(
    agreement: AgreementDocument,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="signature-section page-break">
    <h2 style="text-align: center; font-family: ${theme.headerFontFamily}; color: ${theme.primaryColor}; margin-bottom: 32px;">
        SIGNATURE CONFIRMATION
    </h2>

    <p style="text-align: center; margin-bottom: 32px; font-style: italic;">
        This ${agreement.title} has been digitally signed and is legally binding.
    </p>

    <div class="signature-grid">
        <div class="signature-block">
            <div class="signature-title">${branding.companyName}</div>
            <div class="signature-info" style="margin-top: 20px;">
                <strong>Digital Signature Confirmed</strong><br>
                ${branding.companyLegalName}<br>
                ${branding.address}<br>
                ${branding.city}, ${branding.state} ${branding.zipCode}
            </div>
        </div>

        <div class="signature-block">
            <div class="signature-title">Carrier Signature Confirmed</div>
            <div class="signature-info" style="margin-top: 20px;">
                <strong>Signed By:</strong> ${agreement.signedBy}<br>
                <strong>Title:</strong> ${agreement.signerTitle || 'Authorized Representative'}<br>
                <strong>Date:</strong> ${new Date(agreement.signedDate).toLocaleDateString()}<br>
                <strong>IP Address:</strong> ${agreement.metadata.ipAddress}
            </div>
        </div>
    </div>

    <div style="margin-top: 48px; padding: 20px; background: ${theme.highlightColor}; border: 1px solid ${theme.accentColor}; border-radius: 8px;">
        <h4 style="margin-bottom: 12px; color: ${theme.headingColor};">✅ Digital Signature Verification</h4>
        <p style="font-size: 11px; color: ${theme.secondaryColor}; line-height: 1.5;">
            This agreement has been digitally signed and verified. The electronic signature has the same legal effect as a handwritten signature.
            Document ID: ${agreement.id} | Original Signature Date: ${new Date(agreement.signedDate).toLocaleString()}
        </p>
    </div>
</div>`;
  }

  /**
   * Generate professionally styled EXISTING Rate Confirmation
   * Uses YOUR existing rate confirmation system from DocumentFlowService
   */
  async generateExistingRateConfirmation(
    load: Load,
    carrier: CarrierData,
    tenantId: string,
    options: AgreementGenerationOptions = {}
  ): Promise<{ html: string; filename: string; originalContent: string }> {
    // USE YOUR EXISTING rate confirmation system
    const documentFlowService = new DocumentFlowService();
    const originalRateConfirmation =
      documentFlowService.generateRateConfirmation(load, carrier);

    const theme = this.themes[options.theme || 'corporate'];
    const branding = this.getCompanyBranding(tenantId);

    // Apply professional styling to YOUR existing rate confirmation content
    const html = this.wrapExistingRateConfirmationWithStyling(
      originalRateConfirmation,
      load,
      carrier,
      theme,
      branding,
      options
    );

    const filename = `Rate-Confirmation-${load.id || 'Load'}-Professional.html`;

    return {
      html,
      filename,
      originalContent: originalRateConfirmation,
    };
  }

  /**
   * Apply professional HTML/CSS styling to YOUR existing rate confirmation content
   * This preserves all YOUR comprehensive rate confirmation data and makes it look professional
   */
  private wrapExistingRateConfirmationWithStyling(
    existingRateConfirmation: string,
    load: Load,
    carrier: CarrierData,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding,
    options: AgreementGenerationOptions
  ): string {
    const isPrintReady = options.format === 'pdf-ready';

    // Convert your existing rate confirmation content to professional HTML
    const styledContent = this.convertRateConfirmationToHTML(
      existingRateConfirmation
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rate Confirmation - ${load.id || 'Load'} - ${branding.companyName}</title>
    <style>
        ${this.generateLegalCSS(theme, branding, isPrintReady)}

        /* Additional Rate Confirmation Specific Styles */
        .rate-confirmation-header {
            background: linear-gradient(135deg, ${theme.primaryColor}, ${theme.accentColor});
            color: white;
            padding: 24px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 24px;
        }

        .rate-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin: 24px 0;
        }

        .info-section {
            background: ${theme.cardBackgroundColor};
            border: 1px solid ${theme.borderColor};
            border-radius: 8px;
            padding: 20px;
        }

        .info-section h3 {
            color: ${theme.primaryColor};
            border-bottom: 2px solid ${theme.accentColor};
            padding-bottom: 8px;
            margin-bottom: 16px;
        }

        .rate-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .rate-table th {
            background: ${theme.primaryColor};
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }

        .rate-table td {
            padding: 12px;
            border-bottom: 1px solid ${theme.borderColor};
        }

        .rate-table tr:last-child td {
            border-bottom: none;
        }

        .total-rate {
            background: ${theme.highlightColor};
            font-weight: 700;
            font-size: 18px;
            color: ${theme.primaryColor};
        }

        .confirmation-stamp {
            position: absolute;
            top: 20px;
            right: 20px;
            background: ${theme.accentColor};
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
            transform: rotate(15deg);
        }

        @media screen and (max-width: 768px) {
            .rate-info-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
        }
    </style>
</head>
<body>
    <div class="legal-document" style="position: relative;">
        <div class="confirmation-stamp">CONFIRMED</div>

        ${this.generateRateConfirmationHeader(load, carrier, theme, branding)}
        ${this.generateRateConfirmationBody(styledContent, load, carrier, theme)}
        ${this.generateRateConfirmationFooter(load, theme, branding)}
    </div>
</body>
</html>`;
  }

  /**
   * Convert YOUR existing rate confirmation content to professional HTML format
   * Preserves all your rate confirmation data structure
   */
  private convertRateConfirmationToHTML(content: string): string {
    let html = content;

    // Convert rate confirmation sections to proper HTML
    html = html.replace(/RATE CONFIRMATION/g, '<h1>RATE CONFIRMATION</h1>');
    html = html.replace(/Load Information:/g, '<h2>Load Information</h2>');
    html = html.replace(
      /Carrier Information:/g,
      '<h2>Carrier Information</h2>'
    );
    html = html.replace(/Pickup Information:/g, '<h2>Pickup Information</h2>');
    html = html.replace(
      /Delivery Information:/g,
      '<h2>Delivery Information</h2>'
    );
    html = html.replace(/Rate Breakdown:/g, '<h2>Rate Breakdown</h2>');
    html = html.replace(
      /Terms and Conditions:/g,
      '<h2>Terms and Conditions</h2>'
    );

    // Convert field labels to structured format
    html = html.replace(
      /^([A-Z][^:]+):\s*(.+)$/gm,
      '<div class="field-row"><strong>$1:</strong> $2</div>'
    );

    // Convert paragraphs
    const paragraphs = html.split(/\n\s*\n/);
    html = paragraphs
      .map((para) => {
        if (
          para.trim() &&
          !para.includes('<h') &&
          !para.includes('<div class="field-row">')
        ) {
          return `<p>${para.trim()}</p>`;
        }
        return para;
      })
      .join('\n\n');

    return html;
  }

  /**
   * Generate professional header for rate confirmation
   */
  private generateRateConfirmationHeader(
    load: Load,
    carrier: CarrierData,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="rate-confirmation-header">
    <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h1 style="margin: 0; color: white; font-size: 24px;">RATE CONFIRMATION</h1>
            <p style="margin: 8px 0 0 0; opacity: 0.9;">Load ID: ${load.id || 'N/A'}</p>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: 700;">$${load.rate?.toLocaleString() || 'N/A'}</div>
            <div style="opacity: 0.9; font-size: 12px;">Total Rate</div>
        </div>
    </div>
</div>`;
  }

  /**
   * Generate professional body for rate confirmation
   */
  private generateRateConfirmationBody(
    styledContent: string,
    load: Load,
    carrier: CarrierData,
    theme: LegalDocumentTheme
  ): string {
    return `
<div class="document-body">
    <div class="rate-info-grid">
        <div class="info-section">
            <h3>Shipment Details</h3>
            <div class="field-row"><strong>Origin:</strong> ${load.origin || 'N/A'}</div>
            <div class="field-row"><strong>Destination:</strong> ${load.destination || 'N/A'}</div>
            <div class="field-row"><strong>Pickup Date:</strong> ${load.pickupDate || 'N/A'}</div>
            <div class="field-row"><strong>Delivery Date:</strong> ${load.deliveryDate || 'N/A'}</div>
            <div class="field-row"><strong>Equipment:</strong> ${load.equipment || 'N/A'}</div>
            <div class="field-row"><strong>Distance:</strong> ${load.distance || 'N/A'} miles</div>
        </div>

        <div class="info-section">
            <h3>Carrier Information</h3>
            <div class="field-row"><strong>Company:</strong> ${carrier.legalName || 'N/A'}</div>
            <div class="field-row"><strong>MC Number:</strong> ${carrier.mcNumber || 'N/A'}</div>
            <div class="field-row"><strong>DOT Number:</strong> ${carrier.dotNumber || 'N/A'}</div>
            <div class="field-row"><strong>Contact:</strong> ${carrier.phone || 'N/A'}</div>
            <div class="field-row"><strong>Email:</strong> ${carrier.email || 'N/A'}</div>
        </div>
    </div>

    <table class="rate-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Amount</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Line Haul Rate</td>
                <td>$${load.rate?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
                <td>Fuel Surcharge</td>
                <td>$${load.fuelSurcharge?.toLocaleString() || '0'}</td>
            </tr>
            <tr>
                <td>Additional Charges</td>
                <td>$${load.accessorialCharges?.toLocaleString() || '0'}</td>
            </tr>
            <tr class="total-rate">
                <td><strong>TOTAL RATE</strong></td>
                <td><strong>$${(load.rate || 0 + (load.fuelSurcharge || 0) + (load.accessorialCharges || 0)).toLocaleString()}</strong></td>
            </tr>
        </tbody>
    </table>

    ${styledContent}
</div>`;
  }

  /**
   * Generate professional footer for rate confirmation
   */
  private generateRateConfirmationFooter(
    load: Load,
    theme: LegalDocumentTheme,
    branding: LegalDocumentBranding
  ): string {
    return `
<div class="document-footer">
    <div class="footer-company">${branding.companyLegalName}</div>

    <div class="footer-address">
        ${branding.address}<br>
        ${branding.city}, ${branding.state} ${branding.zipCode}
    </div>

    <div class="footer-contact">
        Phone: ${branding.phone} | Email: ${branding.email}
        ${branding.website ? ` | Website: ${branding.website}` : ''}
    </div>

    <div class="footer-legal">
        Professional Rate Confirmation generated on ${new Date().toLocaleDateString()}<br>
        Load ID: ${load.id || 'N/A'} | This document constitutes a binding agreement
    </div>
</div>`;
  }
}

export const professionalAgreementTemplateService =
  new ProfessionalAgreementTemplateService();
