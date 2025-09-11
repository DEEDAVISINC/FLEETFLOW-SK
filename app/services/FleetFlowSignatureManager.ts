/**
 * FleetFlow Professional Email Signature Manager
 * WiseStamp-style email signature creation and management system
 * Integrated with all FleetFlow email systems for consistent branding
 */

export interface EmailSignature {
  id: string;
  name: string;
  type: SignatureType;
  department: string;
  userId?: string;
  aiStaffId?: string;

  // Personal Information
  fullName: string;
  title: string;
  department_name: string;

  // Contact Information
  phone?: string;
  email: string;
  directLine?: string;
  mobile?: string;

  // Company Information
  companyName: string;
  companyLogo?: string;
  website?: string;
  address?: string;

  // Social Media & Links
  socialLinks: SocialLink[];
  customLinks: CustomLink[];

  // Visual Design
  template: SignatureTemplate;
  branding: SignatureBranding;

  // Call-to-Action
  ctaButton?: CTAButton;

  // Compliance & Legal
  disclaimers: string[];
  complianceInfo?: ComplianceInfo;

  // Metadata
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SignatureType =
  | 'executive'
  | 'operations'
  | 'sales'
  | 'support'
  | 'ai_staff'
  | 'legal'
  | 'custom';

export interface SocialLink {
  platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'youtube';
  url: string;
  displayIcon: boolean;
}

export interface CustomLink {
  label: string;
  url: string;
  icon?: string;
}

export interface SignatureTemplate {
  id: string;
  name: string;
  layout: 'horizontal' | 'vertical' | 'card' | 'minimal';
  photoPosition?: 'left' | 'right' | 'top' | 'none';
  socialPosition: 'bottom' | 'right' | 'inline';
}

export interface SignatureBranding {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: number;
  logoSize: 'small' | 'medium' | 'large';
  showCompanyLogo: boolean;
  showPersonalPhoto: boolean;
}

export interface CTAButton {
  text: string;
  url: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
}

export interface ComplianceInfo {
  dotNumber?: string;
  mcNumber?: string;
  fmcsaInfo?: string;
  insuranceInfo?: string;
}

export class FleetFlowSignatureManager {
  private signatures: Map<string, EmailSignature> = new Map();
  private templates: Map<string, SignatureTemplate> = new Map();

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default professional templates
   */
  private initializeDefaultTemplates(): void {
    // Executive Template
    this.templates.set('executive-modern', {
      id: 'executive-modern',
      name: 'Executive Modern',
      layout: 'horizontal',
      photoPosition: 'left',
      socialPosition: 'bottom',
    });

    // Operations Template
    this.templates.set('operations-professional', {
      id: 'operations-professional',
      name: 'Operations Professional',
      layout: 'vertical',
      photoPosition: 'top',
      socialPosition: 'inline',
    });

    // AI Staff Template
    this.templates.set('ai-staff-branded', {
      id: 'ai-staff-branded',
      name: 'AI Staff Branded',
      layout: 'card',
      photoPosition: 'left',
      socialPosition: 'right',
    });

    // Sales Template
    this.templates.set('sales-dynamic', {
      id: 'sales-dynamic',
      name: 'Sales Dynamic',
      layout: 'horizontal',
      photoPosition: 'left',
      socialPosition: 'bottom',
    });

    // Support Template
    this.templates.set('support-friendly', {
      id: 'support-friendly',
      name: 'Support Friendly',
      layout: 'minimal',
      photoPosition: 'none',
      socialPosition: 'inline',
    });
  }

  /**
   * Generate signature for DEPOINTE AI staff member
   */
  async generateAIStaffSignature(aiStaffId: string): Promise<EmailSignature> {
    const aiStaffData = this.getAIStaffData(aiStaffId);

    const signature: EmailSignature = {
      id: `ai-staff-${aiStaffId}`,
      name: `${aiStaffData.name} AI Signature`,
      type: 'ai_staff',
      department: aiStaffData.department,
      aiStaffId,

      fullName: aiStaffData.name,
      title: aiStaffData.title,
      department_name: aiStaffData.departmentName,

      phone: aiStaffData.phone || '(555) 123-4567',
      email: aiStaffData.email,

      companyName: 'DEPOINTE AI',
      companyLogo: '/assets/depointe-logo.png',
      website: 'https://fleetflowapp.com',

      socialLinks: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/company/fleetflow',
          displayIcon: true,
        },
      ],
      customLinks: [
        {
          label: 'Schedule Meeting',
          url: `https://fleetflowapp.com/schedule/${aiStaffId}`,
          icon: 'calendar',
        },
      ],

      template: this.templates.get('ai-staff-branded')!,
      branding: {
        primaryColor: '#2563eb',
        secondaryColor: '#1e40af',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        logoSize: 'medium',
        showCompanyLogo: true,
        showPersonalPhoto: false,
      },

      ctaButton: {
        text: 'Get Quote',
        url: 'https://fleetflowapp.com/quote',
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 6,
      },

      disclaimers: [
        'This email was sent by DEPOINTE AI on behalf of FleetFlow TMS.',
        'All communications are monitored for quality assurance.',
      ],

      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.signatures.set(signature.id, signature);
    return signature;
  }

  /**
   * Generate signature for department staff
   */
  async generateDepartmentSignature(
    department: string,
    staffMember: string,
    userData: any
  ): Promise<EmailSignature> {
    const templateId = this.getDepartmentTemplate(department);
    const template = this.templates.get(templateId)!;

    const signature: EmailSignature = {
      id: `dept-${department}-${staffMember}`,
      name: `${staffMember} ${department} Signature`,
      type: this.getDepartmentSignatureType(department),
      department,
      userId: userData.id,

      fullName: userData.fullName || staffMember,
      title: userData.title || this.getDepartmentTitle(department),
      department_name: this.getDepartmentDisplayName(department),

      phone: userData.phone || '(555) 123-4567',
      email: userData.email,
      directLine: userData.directLine,
      mobile: userData.mobile,

      companyName: 'FleetFlow TMS',
      companyLogo: '/assets/fleetflow-logo.png',
      website: 'https://fleetflowapp.com',
      address: userData.address || 'FleetFlow Operations Center',

      socialLinks: [
        {
          platform: 'linkedin',
          url: 'https://linkedin.com/company/fleetflow',
          displayIcon: true,
        },
      ],
      customLinks: this.getDepartmentCustomLinks(department),

      template,
      branding: this.getDepartmentBranding(department),

      ctaButton: this.getDepartmentCTA(department),

      disclaimers: [
        'This communication is confidential and may be legally privileged.',
        'FleetFlow TMS - Professional Transportation Management Solutions',
      ],

      complianceInfo:
        department === 'compliance'
          ? {
              dotNumber: 'DOT-123456',
              mcNumber: 'MC-789012',
              fmcsaInfo: 'FMCSA Registered Broker',
            }
          : undefined,

      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.signatures.set(signature.id, signature);
    return signature;
  }

  /**
   * Generate HTML signature for email injection
   */
  generateSignatureHTML(signatureId: string): string {
    const signature = this.signatures.get(signatureId);
    if (!signature) {
      throw new Error(`Signature not found: ${signatureId}`);
    }

    return this.renderSignatureTemplate(signature);
  }

  /**
   * Inject signature into email content
   */
  injectSignatureIntoEmail(
    emailContent: string,
    signatureId: string,
    format: 'html' | 'text' = 'html'
  ): string {
    const signature = this.signatures.get(signatureId);
    if (!signature) {
      return emailContent;
    }

    if (format === 'html') {
      const signatureHTML = this.renderSignatureTemplate(signature);

      // Insert before closing body tag or append if no body tag
      if (emailContent.includes('</body>')) {
        return emailContent.replace('</body>', `${signatureHTML}</body>`);
      } else {
        return `${emailContent}\n\n${signatureHTML}`;
      }
    } else {
      const signatureText = this.renderSignatureText(signature);
      return `${emailContent}\n\n${signatureText}`;
    }
  }

  /**
   * Render signature as HTML
   */
  private renderSignatureTemplate(signature: EmailSignature): string {
    const { template, branding } = signature;

    return `
    <div style="
      font-family: ${branding.fontFamily};
      font-size: ${branding.fontSize}px;
      color: #333;
      border-top: 2px solid ${branding.primaryColor};
      padding-top: 15px;
      margin-top: 20px;
      max-width: 600px;
    ">
      ${this.renderSignatureContent(signature)}
    </div>`;
  }

  /**
   * Render signature content based on template layout
   */
  private renderSignatureContent(signature: EmailSignature): string {
    const { template, branding } = signature;

    switch (template.layout) {
      case 'horizontal':
        return this.renderHorizontalLayout(signature);
      case 'vertical':
        return this.renderVerticalLayout(signature);
      case 'card':
        return this.renderCardLayout(signature);
      case 'minimal':
        return this.renderMinimalLayout(signature);
      default:
        return this.renderHorizontalLayout(signature);
    }
  }

  /**
   * Render horizontal layout signature
   */
  private renderHorizontalLayout(signature: EmailSignature): string {
    const { branding } = signature;

    return `
    <table cellpadding="0" cellspacing="0" style="border: none;">
      <tr>
        ${
          signature.branding.showCompanyLogo
            ? `
        <td style="padding-right: 20px; vertical-align: top;">
          <img src="${signature.companyLogo}" alt="${signature.companyName}"
               style="max-height: 60px; max-width: 120px;">
        </td>`
            : ''
        }
        <td style="vertical-align: top;">
          <div style="margin-bottom: 5px;">
            <strong style="color: ${branding.primaryColor}; font-size: ${branding.fontSize + 2}px;">
              ${signature.fullName}
            </strong>
          </div>
          <div style="color: #666; margin-bottom: 3px;">${signature.title}</div>
          <div style="color: #666; margin-bottom: 8px;">${signature.department_name}</div>

          <div style="margin-bottom: 3px;">
            📧 <a href="mailto:${signature.email}" style="color: ${branding.primaryColor}; text-decoration: none;">
              ${signature.email}
            </a>
          </div>
          ${
            signature.phone
              ? `
          <div style="margin-bottom: 3px;">
            📞 <span style="color: #666;">${signature.phone}</span>
          </div>`
              : ''
          }
          ${
            signature.website
              ? `
          <div style="margin-bottom: 8px;">
            🌐 <a href="${signature.website}" style="color: ${branding.primaryColor}; text-decoration: none;">
              ${signature.website}
            </a>
          </div>`
              : ''
          }

          ${this.renderSocialLinks(signature)}
          ${this.renderCTAButton(signature)}
        </td>
      </tr>
    </table>
    ${this.renderDisclaimers(signature)}`;
  }

  /**
   * Render vertical layout signature
   */
  private renderVerticalLayout(signature: EmailSignature): string {
    const { branding } = signature;

    return `
    <div style="text-align: center;">
      ${
        signature.branding.showCompanyLogo
          ? `
      <div style="margin-bottom: 15px;">
        <img src="${signature.companyLogo}" alt="${signature.companyName}"
             style="max-height: 50px; max-width: 150px;">
      </div>`
          : ''
      }

      <div style="margin-bottom: 5px;">
        <strong style="color: ${branding.primaryColor}; font-size: ${branding.fontSize + 2}px;">
          ${signature.fullName}
        </strong>
      </div>
      <div style="color: #666; margin-bottom: 3px;">${signature.title}</div>
      <div style="color: #666; margin-bottom: 10px;">${signature.department_name}</div>

      <div style="margin-bottom: 5px;">
        📧 <a href="mailto:${signature.email}" style="color: ${branding.primaryColor}; text-decoration: none;">
          ${signature.email}
        </a>
      </div>
      ${
        signature.phone
          ? `
      <div style="margin-bottom: 5px;">
        📞 <span style="color: #666;">${signature.phone}</span>
      </div>`
          : ''
      }

      ${this.renderSocialLinks(signature)}
      ${this.renderCTAButton(signature)}
    </div>
    ${this.renderDisclaimers(signature)}`;
  }

  /**
   * Render card layout signature
   */
  private renderCardLayout(signature: EmailSignature): string {
    const { branding } = signature;

    return `
    <div style="
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    ">
      <table cellpadding="0" cellspacing="0" style="width: 100%; border: none;">
        <tr>
          ${
            signature.branding.showCompanyLogo
              ? `
          <td style="padding-right: 15px; vertical-align: top; width: 80px;">
            <img src="${signature.companyLogo}" alt="${signature.companyName}"
                 style="max-height: 50px; max-width: 80px; border-radius: 4px;">
          </td>`
              : ''
          }
          <td style="vertical-align: top;">
            <div style="margin-bottom: 5px;">
              <strong style="color: ${branding.primaryColor}; font-size: ${branding.fontSize + 2}px;">
                ${signature.fullName}
              </strong>
            </div>
            <div style="color: #666; margin-bottom: 2px;">${signature.title}</div>
            <div style="color: #666; margin-bottom: 10px; font-size: ${branding.fontSize - 1}px;">
              ${signature.department_name}
            </div>

            <div style="margin-bottom: 3px; font-size: ${branding.fontSize - 1}px;">
              📧 <a href="mailto:${signature.email}" style="color: ${branding.primaryColor}; text-decoration: none;">
                ${signature.email}
              </a>
            </div>
            ${
              signature.phone
                ? `
            <div style="margin-bottom: 8px; font-size: ${branding.fontSize - 1}px;">
              📞 <span style="color: #666;">${signature.phone}</span>
            </div>`
                : ''
            }

            ${this.renderSocialLinks(signature, 'compact')}
          </td>
        </tr>
      </table>
      ${this.renderCTAButton(signature, 'compact')}
    </div>
    ${this.renderDisclaimers(signature)}`;
  }

  /**
   * Render minimal layout signature
   */
  private renderMinimalLayout(signature: EmailSignature): string {
    const { branding } = signature;

    return `
    <div style="border-top: 1px solid #e5e7eb; padding-top: 10px;">
      <div style="margin-bottom: 3px;">
        <strong style="color: ${branding.primaryColor};">${signature.fullName}</strong>
        <span style="color: #666;"> | ${signature.title}</span>
      </div>
      <div style="color: #666; font-size: ${branding.fontSize - 1}px;">
        ${signature.companyName} |
        <a href="mailto:${signature.email}" style="color: ${branding.primaryColor}; text-decoration: none;">
          ${signature.email}
        </a>
        ${signature.phone ? ` | ${signature.phone}` : ''}
      </div>
    </div>`;
  }

  /**
   * Render social media links
   */
  private renderSocialLinks(
    signature: EmailSignature,
    style: 'normal' | 'compact' = 'normal'
  ): string {
    if (!signature.socialLinks.length) return '';

    const iconSize = style === 'compact' ? '16' : '20';
    const spacing = style === 'compact' ? '5px' : '8px';

    const socialHTML = signature.socialLinks
      .map((link) => {
        const iconUrl = this.getSocialIconUrl(link.platform);
        return `
      <a href="${link.url}" style="margin-right: ${spacing}; text-decoration: none;">
        <img src="${iconUrl}" alt="${link.platform}"
             style="width: ${iconSize}px; height: ${iconSize}px; vertical-align: middle;">
      </a>`;
      })
      .join('');

    return `<div style="margin-bottom: 8px;">${socialHTML}</div>`;
  }

  /**
   * Render CTA button
   */
  private renderCTAButton(
    signature: EmailSignature,
    style: 'normal' | 'compact' = 'normal'
  ): string {
    if (!signature.ctaButton) return '';

    const padding = style === 'compact' ? '6px 12px' : '8px 16px';
    const fontSize = style === 'compact' ? '12px' : '14px';

    return `
    <div style="margin-top: 10px;">
      <a href="${signature.ctaButton.url}" style="
        background-color: ${signature.ctaButton.backgroundColor};
        color: ${signature.ctaButton.textColor};
        padding: ${padding};
        border-radius: ${signature.ctaButton.borderRadius}px;
        text-decoration: none;
        font-size: ${fontSize};
        font-weight: 500;
        display: inline-block;
      ">${signature.ctaButton.text}</a>
    </div>`;
  }

  /**
   * Render disclaimers
   */
  private renderDisclaimers(signature: EmailSignature): string {
    if (!signature.disclaimers.length) return '';

    const disclaimerHTML = signature.disclaimers
      .map(
        (disclaimer) =>
          `<div style="font-size: 11px; color: #999; margin-bottom: 2px;">${disclaimer}</div>`
      )
      .join('');

    return `<div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #f0f0f0;">${disclaimerHTML}</div>`;
  }

  /**
   * Render signature as plain text
   */
  private renderSignatureText(signature: EmailSignature): string {
    let text = `\n\n---\n`;
    text += `${signature.fullName}\n`;
    text += `${signature.title}\n`;
    text += `${signature.department_name}\n`;
    text += `${signature.companyName}\n\n`;
    text += `Email: ${signature.email}\n`;
    if (signature.phone) text += `Phone: ${signature.phone}\n`;
    if (signature.website) text += `Website: ${signature.website}\n`;

    if (signature.disclaimers.length) {
      text += `\n${signature.disclaimers.join('\n')}`;
    }

    return text;
  }

  // Helper methods for department-specific configurations
  private getAIStaffData(aiStaffId: string): any {
    // DEPOINTE AI Staff Data [[memory:7347274]]
    const aiStaff = {
      'resse-bell': {
        name: 'Resse A. Bell',
        title: 'AI Financial Specialist',
        department: 'financial',
        departmentName: 'Financial Services',
        email: 'accounting@fleetflowapp.com',
        phone: '(555) 123-4567',
      },
      dell: {
        name: 'Dell',
        title: 'AI Technology Specialist',
        department: 'technology',
        departmentName: 'Information Technology',
        email: 'support@fleetflowapp.com',
        phone: '(555) 123-4568',
      },
      logan: {
        name: 'Logan',
        title: 'AI Logistics Coordinator',
        department: 'freight_operations',
        departmentName: 'Freight Operations',
        email: 'logistics@fleetflowapp.com',
        phone: '(555) 123-4569',
      },
      // Add all 18 AI staff members...
    };

    return (
      aiStaff[aiStaffId] || {
        name: 'AI Assistant',
        title: 'AI Specialist',
        department: 'general',
        departmentName: 'DEPOINTE AI',
        email: 'ai@fleetflowapp.com',
      }
    );
  }

  private getDepartmentTemplate(department: string): string {
    const templateMap = {
      executive: 'executive-modern',
      operations: 'operations-professional',
      sales: 'sales-dynamic',
      support: 'support-friendly',
      compliance: 'operations-professional',
      dispatch: 'operations-professional',
    };

    return templateMap[department] || 'operations-professional';
  }

  private getDepartmentSignatureType(department: string): SignatureType {
    const typeMap = {
      executive: 'executive' as SignatureType,
      operations: 'operations' as SignatureType,
      sales: 'sales' as SignatureType,
      support: 'support' as SignatureType,
      compliance: 'legal' as SignatureType,
      dispatch: 'operations' as SignatureType,
    };

    return typeMap[department] || 'operations';
  }

  private getDepartmentTitle(department: string): string {
    const titleMap = {
      executive: 'Executive',
      operations: 'Operations Specialist',
      sales: 'Sales Representative',
      support: 'Customer Support Specialist',
      compliance: 'Compliance Officer',
      dispatch: 'Dispatch Coordinator',
    };

    return titleMap[department] || 'Team Member';
  }

  private getDepartmentDisplayName(department: string): string {
    const nameMap = {
      executive: 'Executive Team',
      operations: 'Operations Department',
      sales: 'Sales Department',
      support: 'Customer Support',
      compliance: 'Compliance & Safety',
      dispatch: 'Dispatch Operations',
    };

    return nameMap[department] || 'FleetFlow Team';
  }

  private getDepartmentCustomLinks(department: string): CustomLink[] {
    const linkMap = {
      sales: [
        {
          label: 'Get Quote',
          url: 'https://fleetflowapp.com/quote',
          icon: 'quote',
        },
        {
          label: 'Schedule Demo',
          url: 'https://fleetflowapp.com/demo',
          icon: 'calendar',
        },
      ],
      support: [
        {
          label: 'Support Portal',
          url: 'https://fleetflowapp.com/support',
          icon: 'help',
        },
        {
          label: 'Knowledge Base',
          url: 'https://fleetflowapp.com/docs',
          icon: 'book',
        },
      ],
      operations: [
        {
          label: 'Track Shipment',
          url: 'https://fleetflowapp.com/track',
          icon: 'truck',
        },
      ],
    };

    return linkMap[department] || [];
  }

  private getDepartmentBranding(department: string): SignatureBranding {
    const brandingMap = {
      executive: {
        primaryColor: '#1e40af',
        secondaryColor: '#3b82f6',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        logoSize: 'large' as const,
        showCompanyLogo: true,
        showPersonalPhoto: false,
      },
      sales: {
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        logoSize: 'medium' as const,
        showCompanyLogo: true,
        showPersonalPhoto: false,
      },
      support: {
        primaryColor: '#7c3aed',
        secondaryColor: '#8b5cf6',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        logoSize: 'medium' as const,
        showCompanyLogo: true,
        showPersonalPhoto: false,
      },
    };

    return (
      brandingMap[department] || {
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        fontFamily: 'Inter, sans-serif',
        fontSize: 14,
        logoSize: 'medium' as const,
        showCompanyLogo: true,
        showPersonalPhoto: false,
      }
    );
  }

  private getDepartmentCTA(department: string): CTAButton | undefined {
    const ctaMap = {
      sales: {
        text: 'Get Quote',
        url: 'https://fleetflowapp.com/quote',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderRadius: 6,
      },
      support: {
        text: 'Get Help',
        url: 'https://fleetflowapp.com/support',
        backgroundColor: '#7c3aed',
        textColor: '#ffffff',
        borderRadius: 6,
      },
    };

    return ctaMap[department];
  }

  private getSocialIconUrl(platform: string): string {
    const iconMap = {
      linkedin: '/assets/icons/linkedin.png',
      twitter: '/assets/icons/twitter.png',
      facebook: '/assets/icons/facebook.png',
      instagram: '/assets/icons/instagram.png',
      youtube: '/assets/icons/youtube.png',
    };

    return iconMap[platform] || '/assets/icons/link.png';
  }
}

// Export singleton instance
export const fleetFlowSignatureManager = new FleetFlowSignatureManager();
