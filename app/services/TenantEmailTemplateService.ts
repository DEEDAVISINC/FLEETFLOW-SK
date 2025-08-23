// 🏢 MULTI-TENANT EMAIL TEMPLATE MANAGEMENT
export class TenantEmailTemplateService {
  // 📧 GET TENANT EMAIL TEMPLATE
  async getTenantEmailTemplate(
    tenantId: string,
    templateType: EmailTemplateType
  ): Promise<EmailTemplate> {
    try {
      // First, try to get tenant-specific template
      const customTemplate = await this.getCustomTenantTemplate(
        tenantId,
        templateType
      );

      if (customTemplate) {
        console.log(
          `✅ Using custom template for tenant ${tenantId}: ${templateType}`
        );
        return customTemplate;
      }

      // Fallback to default template
      console.log(
        `📋 Using default template for tenant ${tenantId}: ${templateType}`
      );
      return this.getDefaultTemplate(templateType);
    } catch (error) {
      console.error('Template retrieval error:', error);
      return this.getDefaultTemplate(templateType);
    }
  }

  // 🎨 RENDER EMAIL WITH TENANT TEMPLATE
  async renderTenantEmail(
    tenantId: string,
    templateType: EmailTemplateType,
    variables: EmailTemplateVariables
  ): Promise<RenderedEmail> {
    const template = await this.getTenantEmailTemplate(tenantId, templateType);

    // Get tenant branding information
    const tenantInfo = await this.getTenantInfo(tenantId);

    // Merge tenant info with variables
    const allVariables = {
      ...variables,
      tenant: tenantInfo,
    };

    // Render template with variables
    return {
      subject: this.replaceVariables(template.subject, allVariables),
      htmlContent: this.replaceVariables(template.htmlContent, allVariables),
      textContent: this.replaceVariables(template.textContent, allVariables),
      fromEmail: tenantInfo.fromEmail || 'noreply@fleetflow.com',
      fromName: tenantInfo.companyName || 'FleetFlow',
    };
  }

  // 💾 SAVE TENANT TEMPLATE
  async saveTenantTemplate(
    tenantId: string,
    templateType: EmailTemplateType,
    template: EmailTemplateInput
  ): Promise<boolean> {
    try {
      const tenantTemplate: TenantEmailTemplate = {
        id: `${tenantId}-${templateType}-${Date.now()}`,
        tenantId,
        templateType,
        subject: template.subject,
        htmlContent: template.htmlContent,
        textContent: template.textContent,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: template.createdBy || 'system',
      };

      await this.storeTenantTemplate(tenantTemplate);
      console.log(
        `💾 Saved custom template for tenant ${tenantId}: ${templateType}`
      );
      return true;
    } catch (error) {
      console.error('Template save error:', error);
      return false;
    }
  }

  // 📋 GET TENANT'S CUSTOM TEMPLATES
  async getTenantTemplates(tenantId: string): Promise<TenantEmailTemplate[]> {
    try {
      // Mock implementation - replace with database query
      const allTemplates = await this.getAllTenantTemplates();
      return allTemplates.filter((t) => t.tenantId === tenantId && t.isActive);
    } catch (error) {
      console.error('Template retrieval error:', error);
      return [];
    }
  }

  // 📝 TEMPLATE VARIABLE REPLACEMENT
  private replaceVariables(template: string, variables: any): string {
    let result = template;

    // Replace all {{variable}} patterns
    const variablePattern = /\{\{([^}]+)\}\}/g;

    result = result.replace(variablePattern, (match, variablePath) => {
      const value = this.getNestedValue(variables, variablePath.trim());
      return value !== undefined ? String(value) : match;
    });

    return result;
  }

  // 🔍 GET NESTED OBJECT VALUE
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // 🏢 GET TENANT INFORMATION
  private async getTenantInfo(tenantId: string): Promise<TenantInfo> {
    // Mock implementation - replace with actual tenant service
    const mockTenants = {
      'tenant-001': {
        companyName: 'ABC Logistics',
        fromEmail: 'dispatch@abclogistics.com',
        phone: '(555) 123-4567',
        website: 'www.abclogistics.com',
        address: '123 Truck Way, Dallas, TX 75001',
        logo: 'https://abclogistics.com/logo.png',
      },
      'tenant-002': {
        companyName: 'XYZ Freight',
        fromEmail: 'loads@xyzfreight.com',
        phone: '(555) 987-6543',
        website: 'www.xyzfreight.com',
        address: '456 Cargo St, Atlanta, GA 30301',
        logo: 'https://xyzfreight.com/logo.png',
      },
    };

    return (
      mockTenants[tenantId] || {
        companyName: 'FleetFlow',
        fromEmail: 'noreply@fleetflow.com',
        phone: '(555) 000-0000',
        website: 'www.fleetflow.com',
        address: '',
        logo: '',
      }
    );
  }

  // 📁 GET CUSTOM TENANT TEMPLATE
  private async getCustomTenantTemplate(
    tenantId: string,
    templateType: EmailTemplateType
  ): Promise<EmailTemplate | null> {
    // Mock implementation - replace with database query
    const tenantTemplates = await this.getAllTenantTemplates();

    const customTemplate = tenantTemplates.find(
      (t) =>
        t.tenantId === tenantId && t.templateType === templateType && t.isActive
    );

    if (customTemplate) {
      return {
        subject: customTemplate.subject,
        htmlContent: customTemplate.htmlContent,
        textContent: customTemplate.textContent,
      };
    }

    return null;
  }

  // 📋 DEFAULT TEMPLATES
  private getDefaultTemplate(templateType: EmailTemplateType): EmailTemplate {
    const templates: Record<EmailTemplateType, EmailTemplate> = {
      load_information_existing_carrier: {
        subject:
          'Load {{load.id}} Information - {{load.origin.city}} to {{load.destination.city}}',
        htmlContent:
          '<html>' +
          '<body>' +
          '<div style="font-family: Arial, sans-serif; max-width: 600px;">' +
          '<h2 style="color: #2563eb;">{{tenant.companyName}}</h2>' +
          '<p>Hi {{carrier.contactName}} from {{carrier.company}},</p>' +
          '<p>Thanks for your inquiry about <strong>Load {{load.id}}</strong>!</p>' +
          '<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">' +
          '<h3 style="color: #1f2937; margin-top: 0;">Load Details</h3>' +
          '<p><strong>Load ID:</strong> {{load.id}}</p>' +
          '<p><strong>Route:</strong> {{load.origin.city}}, {{load.origin.state}} → {{load.destination.city}}, {{load.destination.state}}</p>' +
          '<p><strong>Rate:</strong> $' +
          '{{load.rate}}</p>' +
          '<p><strong>Distance:</strong> {{load.distance}} miles</p>' +
          '<p><strong>Pickup:</strong> {{load.pickupDate}}</p>' +
          '<p><strong>Delivery:</strong> {{load.deliveryDate}}</p>' +
          '<p><strong>Equipment:</strong> {{load.equipment}}</p>' +
          '<p><strong>Weight:</strong> {{load.weight}}</p>' +
          '<p><strong>Status:</strong> {{load.status}}</p>' +
          '</div>' +
          '<p>To book this load, reply to this email or call {{tenant.phone}}.</p>' +
          '<p>Best regards,<br>' +
          '{{tenant.companyName}} Dispatch<br>' +
          '{{tenant.phone}}<br>' +
          '{{tenant.website}}</p>' +
          '</div>' +
          '</body>' +
          '</html>',
        textContent:
          'Hi {{carrier.contactName}} from {{carrier.company}},\n\n' +
          'Thanks for your inquiry about Load {{load.id}}!\n\n' +
          'LOAD DETAILS:\n' +
          'Load ID: {{load.id}}\n' +
          'Route: {{load.origin.city}}, {{load.origin.state}} → {{load.destination.city}}, {{load.destination.state}}\n' +
          'Rate: $' +
          '{{load.rate}}\n' +
          'Distance: {{load.distance}} miles\n' +
          'Pickup: {{load.pickupDate}}\n' +
          'Delivery: {{load.deliveryDate}}\n' +
          'Equipment: {{load.equipment}}\n' +
          'Weight: {{load.weight}}\n' +
          'Status: {{load.status}}\n\n' +
          'To book this load, reply to this email or call {{tenant.phone}}.\n\n' +
          'Best regards,\n' +
          '{{tenant.companyName}} Dispatch\n' +
          '{{tenant.phone}}\n' +
          '{{tenant.website}}',
      },

      carrier_invitation_new: {
        subject:
          'Join {{tenant.companyName}} Carrier Network - Load {{load.id}} Inquiry',
        htmlContent:
          '<html>' +
          '<body>' +
          '<div style="font-family: Arial, sans-serif; max-width: 600px;">' +
          '<h2 style="color: #2563eb;">{{tenant.companyName}}</h2>' +
          '<p>Hi {{inquiry.contactName}} from {{inquiry.company}},</p>' +
          '<p>Thanks for your inquiry about Load {{load.id}} ({{load.origin.city}} → {{load.destination.city}}, $' +
          '{{load.rate}}).</p>' +
          "<p>To access this load and our full load board, you'll need to join our carrier network first.</p>" +
          '<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">' +
          '<h3 style="color: #1f2937; margin-top: 0;">Join Our Network</h3>' +
          '<p><a href="https://fleetflow.app/carrier-landing" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Complete Carrier Application</a></p>' +
          '</div>' +
          '<p><strong>Please note:</strong> All loads are available on a first-come, first-served basis. No reservations are held.</p>' +
          '<p>Questions? Reply to this email or call {{tenant.phone}}.</p>' +
          '<p>Best regards,<br>' +
          '{{tenant.companyName}} Dispatch<br>' +
          '{{tenant.phone}}<br>' +
          '{{tenant.website}}</p>' +
          '</div>' +
          '</body>' +
          '</html>',
        textContent:
          'Hi {{inquiry.contactName}} from {{inquiry.company}},\n\n' +
          'Thanks for your inquiry about Load {{load.id}} ({{load.origin.city}} → {{load.destination.city}}, $' +
          '{{load.rate}}).\n\n' +
          "To access this load and our full load board, you'll need to join our carrier network first.\n\n" +
          'JOIN OUR NETWORK:\n' +
          'Complete your carrier application: https://fleetflow.app/carrier-landing\n\n' +
          'Please note: All loads are available on a first-come, first-served basis. No reservations are held.\n\n' +
          'Questions? Reply to this email or call {{tenant.phone}}.\n\n' +
          'Best regards,\n' +
          '{{tenant.companyName}} Dispatch\n' +
          '{{tenant.phone}}\n' +
          '{{tenant.website}}',
      },

      factoring_bol_submission: {
        subject:
          'BOL Submission - Load {{load.id}} Completed - {{carrier.name}}',
        htmlContent:
          '<html>' +
          '<body>' +
          '<div style="font-family: Arial, sans-serif; max-width: 600px;">' +
          '<div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">' +
          '<h2 style="color: #2563eb; margin: 0;">{{tenant.companyName}}</h2>' +
          '<p style="color: #6b7280; margin: 5px 0 0 0;">Bill of Lading Submission - Load Completed</p>' +
          '</div>' +
          '<p>Dear {{factoring.accountExecutive.name}}{{#if factoring.accountExecutive.title}}, {{factoring.accountExecutive.title}}{{/if}},</p>' +
          '<p>Please find attached the completed Bill of Lading for load {{load.id}} that was delivered today.</p>' +
          '<div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">' +
          '<h3 style="color: #1f2937; margin-top: 0;">Load Details</h3>' +
          '<p><strong>Load ID:</strong> {{load.id}}</p>' +
          '<p><strong>Route:</strong> {{load.origin}} → {{load.destination}}</p>' +
          '<p><strong>Amount:</strong> $' +
          '{{load.amount}}</p>' +
          '<p><strong>Delivered:</strong> {{load.deliveryDate}}</p>' +
          '<p><strong>Driver:</strong> {{driver.name}}</p>' +
          '<p><strong>Receiver:</strong> {{receiver.name}}</p>' +
          '</div>' +
          '<div style="background: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">' +
          '<h3 style="color: #1e40af; margin-top: 0;">Carrier Information</h3>' +
          '<p><strong>Company:</strong> {{carrier.name}}</p>' +
          '<p><strong>MC Number:</strong> {{carrier.mcNumber}}</p>' +
          '<p><strong>Contact:</strong> {{carrier.contact}}</p>' +
          '<p><strong>Phone:</strong> {{carrier.phone}}</p>' +
          '</div>' +
          '<div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0;">' +
          '<h3 style="color: #16a34a; margin-top: 0;">Factoring Details</h3>' +
          '<p><strong>Factor Rate:</strong> {{factoring.rate}}%</p>' +
          '<p><strong>Advance Rate:</strong> {{factoring.advanceRate}}%</p>' +
          '<p><strong>Expected Advance:</strong> $' +
          '{{load.expectedAdvance}}</p>' +
          '</div>' +
          '<p>This load has been successfully delivered with all required documentation attached. Please process according to our factoring agreement.</p>' +
          '<p>If you need any additional information, please contact us at {{tenant.phone}}.</p>' +
          '<p>Best regards,<br>' +
          '{{carrier.name}}<br>' +
          '{{tenant.phone}}<br>' +
          '{{tenant.website}}</p>' +
          '<div style="border-top: 1px solid #e5e7eb; margin-top: 30px; padding-top: 15px; color: #6b7280; font-size: 12px;">' +
          '<p>This is an automated submission from FleetFlow Driver OTR system.</p>' +
          '</div>' +
          '</div>' +
          '</body>' +
          '</html>',
        textContent:
          'BOL Submission - Load {{load.id}} Completed\n\n' +
          'Dear {{factoring.accountExecutive.name}}, {{factoring.accountExecutive.title}},\n\n' +
          'Please find attached the completed Bill of Lading for load {{load.id}} that was delivered today.\n\n' +
          'LOAD DETAILS:\n' +
          'Load ID: {{load.id}}\n' +
          'Route: {{load.origin}} → {{load.destination}}\n' +
          'Amount: $' +
          '{{load.amount}}\n' +
          'Delivered: {{load.deliveryDate}}\n' +
          'Driver: {{driver.name}}\n' +
          'Receiver: {{receiver.name}}\n\n' +
          'CARRIER INFORMATION:\n' +
          'Company: {{carrier.name}}\n' +
          'MC Number: {{carrier.mcNumber}}\n' +
          'Contact: {{carrier.contact}}\n' +
          'Phone: {{carrier.phone}}\n\n' +
          'FACTORING DETAILS:\n' +
          'Factor Rate: {{factoring.rate}}%\n' +
          'Advance Rate: {{factoring.advanceRate}}%\n' +
          'Expected Advance: $' +
          '{{load.expectedAdvance}}\n\n' +
          'This load has been successfully delivered with all required documentation attached. Please process according to our factoring agreement.\n\n' +
          'If you need any additional information, please contact us at {{tenant.phone}}.\n\n' +
          'Best regards,\n' +
          '{{carrier.name}}\n' +
          '{{tenant.phone}}\n' +
          '{{tenant.website}}\n\n' +
          'This is an automated submission from FleetFlow Driver OTR system.',
      },
    };

    return (
      templates[templateType] || templates['load_information_existing_carrier']
    );
  }

  // 💾 STORAGE METHODS (Mock - replace with database)
  private async storeTenantTemplate(
    template: TenantEmailTemplate
  ): Promise<void> {
    console.log('💾 Storing tenant template:', template.id);
    // Replace with actual database storage
  }

  private async getAllTenantTemplates(): Promise<TenantEmailTemplate[]> {
    // Mock data - replace with database query
    return [
      {
        id: 'tenant-001-load_information-1',
        tenantId: 'tenant-001',
        templateType: 'load_information_existing_carrier',
        subject:
          'ABC Logistics Load {{load.id}} - {{load.origin.city}} to {{load.destination.city}}',
        htmlContent: '<p>Custom ABC Logistics template...</p>',
        textContent: 'Custom ABC Logistics template...',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'admin',
      },
    ];
  }
}

// Type Definitions
export type EmailTemplateType =
  | 'load_information_existing_carrier'
  | 'carrier_invitation_new'
  | 'load_status_update'
  | 'driver_assignment'
  | 'factoring_bol_submission';

export interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

export interface EmailTemplateInput {
  subject: string;
  htmlContent: string;
  textContent: string;
  createdBy?: string;
}

export interface TenantEmailTemplate {
  id: string;
  tenantId: string;
  templateType: EmailTemplateType;
  subject: string;
  htmlContent: string;
  textContent: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface EmailTemplateVariables {
  load?: any;
  carrier?: any;
  inquiry?: any;
  driver?: any;
  [key: string]: any;
}

export interface TenantInfo {
  companyName: string;
  fromEmail: string;
  phone: string;
  website: string;
  address?: string;
  logo?: string;
}

export interface RenderedEmail {
  subject: string;
  htmlContent: string;
  textContent: string;
  fromEmail: string;
  fromName: string;
}

export const tenantEmailTemplateService = new TenantEmailTemplateService();
