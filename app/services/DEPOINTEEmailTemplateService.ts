/**
 * DEPOINTE Email Template Service
 * Manages professional freight industry email templates
 */

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  category: string;
  content: string;
  variables: string[];
  lastModified: string;
  isActive: boolean;
  performance?: {
    avgOpenRate: number;
    avgClickRate: number;
    avgReplyRate: number;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Professional DEPOINTE signatures
export const DEPOINTESignatures = {
  freight_broker: `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <div style="font-family: Arial, sans-serif; color: #374151;">
    <p style="margin: 5px 0; font-weight: 600; color: #2563eb;">[your_name]</p>
    <p style="margin: 2px 0; color: #6b7280;">[sender_title]</p>
    <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
    <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: [email]</p>
    <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
    <div style="margin: 10px 0;">
      <img src="[company_logo_url]" alt="DEPOINTE Freight Solutions" style="max-width: 200px; height: auto;" />
    </div>
    <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
      <strong>FMCSA Licensed Carrier</strong> | <strong>Bonded & Insured</strong><br>
      Serving 48 States | Specialized in LTL, FTL & Specialized Freight
    </p>
  </div>
</div>`,

  compliance_specialist: `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <div style="font-family: Arial, sans-serif; color: #374151;">
    <p style="margin: 5px 0; font-weight: 600; color: #dc2626;">[your_name]</p>
    <p style="margin: 2px 0; color: #6b7280;">[sender_title]</p>
    <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
    <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: [email]</p>
    <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
    <div style="margin: 10px 0;">
      <img src="[company_logo_url]" alt="DEPOINTE Freight Solutions" style="max-width: 200px; height: auto;" />
    </div>
    <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
      <strong>DOT Compliance Expert</strong> | <strong>FMCSA Registered</strong><br>
      Specialized in Compliance Recovery & Regulatory Guidance
    </p>
  </div>
</div>`,

  sales_specialist: `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
  <div style="font-family: Arial, sans-serif; color: #374151;">
    <p style="margin: 5px 0; font-weight: 600; color: #059669;">[your_name]</p>
    <p style="margin: 2px 0; color: #6b7280;">[sender_title]</p>
    <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
    <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: [email]</p>
    <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
    <div style="margin: 10px 0;">
      <img src="[company_logo_url]" alt="DEPOINTE Freight Solutions" style="max-width: 200px; height: auto;" />
    </div>
    <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
      <strong>Transportation Solutions Expert</strong> | <strong>Industry Veteran</strong><br>
      15+ Years Experience | Specialized in Complex Logistics Solutions
    </p>
  </div>
</div>`,
};

export const freightCategories: TemplateCategory[] = [
  {
    id: 'all',
    name: 'All Templates',
    description: 'All email templates',
    icon: 'Mail',
  },
  {
    id: 'compliance',
    name: 'Compliance',
    description: 'DOT violation recovery and compliance outreach',
    icon: 'FileText',
  },
  {
    id: 'capacity',
    name: 'Capacity',
    description: 'Peak season capacity and reliability outreach',
    icon: 'Truck',
  },
  {
    id: 'reliability',
    name: 'Reliability',
    description: 'Carrier reliability and service quality outreach',
    icon: 'Building2',
  },
  {
    id: 'general',
    name: 'General',
    description: 'General freight industry communications',
    icon: 'Mail',
  },
];

export class DEPOINTEEmailTemplateService {
  private static instance: DEPOINTEEmailTemplateService;
  private templates: EmailTemplate[] = [];
  private storageKey = 'depointe_email_templates';

  private constructor() {
    this.loadTemplates();
  }

  static getInstance(): DEPOINTEEmailTemplateService {
    if (!DEPOINTEEmailTemplateService.instance) {
      DEPOINTEEmailTemplateService.instance =
        new DEPOINTEEmailTemplateService();
    }
    return DEPOINTEEmailTemplateService.instance;
  }

  private loadTemplates(): void {
    try {
      // Only access localStorage on client side
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.templates = JSON.parse(stored);
        } else {
          // Load default templates
          this.templates = this.getDefaultTemplates();
          this.saveTemplates();
        }
      } else {
        // Server-side rendering - use defaults
        this.templates = this.getDefaultTemplates();
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      this.templates = this.getDefaultTemplates();
    }
  }

  private saveTemplates(): void {
    try {
      // Only save to localStorage on client side
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(this.templates));
      }
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  }

  private getDefaultTemplates(): EmailTemplate[] {
    return [
      {
        id: 1,
        name: 'DOT Violation Recovery',
        subject:
          '[company_name] - Strategic Freight Solutions for Compliance Recovery',
        category: 'compliance',
        content: this.getComplianceTemplate(),
        variables: [
          'company_name',
          'contact_name',
          'prospect_company',
          'company_logo_url',
          'meeting_booking_link',
          'prospect_city',
          'your_name',
          'direct_phone',
          'compliance_email',
        ],
        lastModified: new Date().toISOString().split('T')[0],
        isActive: true,
        performance: {
          avgOpenRate: 42.3,
          avgClickRate: 8.7,
          avgReplyRate: 3.2,
        },
      },
      {
        id: 2,
        name: 'Capacity Crisis Outreach',
        subject:
          'Peak Season Freight Capacity Solutions for [prospect_company]',
        category: 'capacity',
        content: this.getCapacityTemplate(),
        variables: [
          'company_name',
          'contact_name',
          'prospect_company',
          'company_logo_url',
          'industry',
          'capacity_analysis_link',
          'your_name',
          'direct_phone',
          'logistics_email',
        ],
        lastModified: new Date().toISOString().split('T')[0],
        isActive: true,
        performance: {
          avgOpenRate: 38.9,
          avgClickRate: 12.4,
          avgReplyRate: 4.1,
        },
      },
      {
        id: 3,
        name: 'Carrier Reliability Outreach',
        subject:
          '[prospect_company] - Solving Your Carrier Reliability Challenges',
        category: 'reliability',
        content: this.getReliabilityTemplate(),
        variables: [
          'company_name',
          'contact_name',
          'prospect_company',
          'company_logo_url',
          'industry',
          'reliability_assessment_link',
          'your_name',
          'direct_phone',
          'operations_email',
        ],
        lastModified: new Date().toISOString().split('T')[0],
        isActive: true,
        performance: {
          avgOpenRate: 41.2,
          avgClickRate: 9.8,
          avgReplyRate: 3.7,
        },
      },
      {
        id: 4,
        name: 'FleetFlow Introduction',
        subject: '[prospect_company] - Transportation Solutions from FleetFlow',
        category: 'general',
        content: this.getDEPOINTEIntroductionTemplate(),
        variables: [
          'contact_name',
          'prospect_company',
          'industry',
          'company_logo_url',
          'meeting_booking_link',
          'your_name',
          'direct_phone',
          'info_email',
        ],
        lastModified: new Date().toISOString().split('T')[0],
        isActive: true,
        performance: {
          avgOpenRate: 45.0,
          avgClickRate: 11.2,
          avgReplyRate: 4.5,
        },
      },
    ];
  }

  private getComplianceTemplate(): string {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>

                  <h1 style="color: #2563eb; margin-bottom: 20px; font-size: 24px;">Strategic Freight Solutions for Compliance Recovery</h1>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">From DEPOINTE/Freight 1st Direct - Your Compliance Recovery Partner</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear [contact_name],</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">I'm reaching out specifically regarding [prospect_company]'s recent DOT violation - a situation I've helped 47 manufacturers navigate successfully over the past 24 months.</p>

        <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); border-radius: 8px; border-left: 4px solid #dc2626;">
          <h3 style="margin: 0 0 15px 0; color: #dc2626; font-size: 18px;">The Critical Compliance Challenge</h3>
          <p style="margin: 0; color: #374151; line-height: 1.6;">Most companies attempt to "fix" their freight program with the same carriers that contributed to the original compliance issues.</p>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="[meeting_booking_link]" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Schedule Your Compliance Strategy Call</a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Best regards,</p>

        ${this.getComplianceSignature()}
      </div>
    </div>`;
  }

  private getCapacityTemplate(): string {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>

                  <h1 style="color: #7c3aed; margin-bottom: 20px; font-size: 24px;">Peak Season Freight Capacity Solutions</h1>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">From DEPOINTE/Freight 1st Direct - Your Capacity Management Experts</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear [contact_name],</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">With peak season approaching, I wanted to connect about [prospect_company]'s freight capacity strategy.</p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="[capacity_analysis_link]" style="display: inline-block; background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Get Your Capacity Strategy Analysis</a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Best regards,</p>

        ${this.getLogisticsSignature()}
      </div>
    </div>`;
  }

  private getReliabilityTemplate(): string {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>

                  <h1 style="color: #059669; margin-bottom: 20px; font-size: 24px;">Solving Your Carrier Reliability Challenges</h1>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 20px;">From DEPOINTE/Freight 1st Direct - Your Reliability Assurance Partner</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear [contact_name],</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">I work with [industry] companies who are frustrated with unreliable carriers.</p>

        <div style="text-align: center; margin: 40px 0;">
          <a href="[reliability_assessment_link]" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">Get Your Reliability Assessment</a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Best regards,</p>

        ${this.getOperationsSignature()}
      </div>
    </div>`;
  }

  private getComplianceSignature(): string {
    return `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="font-family: Arial, sans-serif; color: #374151;">
        <p style="margin: 5px 0; font-weight: 600; color: #dc2626;">Kameelah Johnson</p>
        <p style="margin: 2px 0; color: #6b7280;">Compliance & Safety Director</p>
        <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
        <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: compliance@fleetflowapp.com</p>
        <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
        <div style="margin: 10px 0;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>
        <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
          <strong>DOT Compliance Expert</strong> | <strong>FMCSA Registered</strong><br>
          Specialized in Compliance Recovery & Regulatory Guidance
        </p>
      </div>
    </div>`;
  }

  private getLogisticsSignature(): string {
    return `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="font-family: Arial, sans-serif; color: #374151;">
        <p style="margin: 5px 0; font-weight: 600; color: #7c3aed;">Miles Rodriguez</p>
        <p style="margin: 2px 0; color: #6b7280;">Logistics Manager</p>
        <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
        <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: logistics@fleetflowapp.com</p>
        <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
        <div style="margin: 10px 0;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>
        <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
          <strong>Capacity Management Specialist</strong> | <strong>Peak Season Expert</strong><br>
          48-State Network | Specialized Logistics Solutions
        </p>
      </div>
    </div>`;
  }

  private getOperationsSignature(): string {
    return `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="font-family: Arial, sans-serif; color: #374151;">
        <p style="margin: 5px 0; font-weight: 600; color: #059669;">Logan Stevens</p>
        <p style="margin: 2px 0; color: #6b7280;">Operations Director</p>
        <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
        <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: operations@fleetflowapp.com</p>
        <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
        <div style="margin: 10px 0;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>
        <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
          <strong>Reliability Assurance Specialist</strong> | <strong>Operations Expert</strong><br>
          Performance Monitoring & Carrier Relations
        </p>
      </div>
    </div>`;
  }

  private getInfoSignature(): string {
    return `<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
      <div style="font-family: Arial, sans-serif; color: #374151;">
        <p style="margin: 5px 0; font-weight: 600; color: #6b7280;">Dee Davis</p>
        <p style="margin: 2px 0; color: #6b7280;">Owner & Founder</p>
        <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
        <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Email: info@fleetflowapp.com</p>
        <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
        <div style="margin: 10px 0;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
        </div>
        <p style="margin: 10px 0; font-size: 12px; color: #9ca3af; line-height: 1.4;">
          <strong>Customer Service Team</strong> | <strong>Your Freight Partner</strong><br>
          LTL • FTL • Specialized Freight Solutions
        </p>
      </div>
    </div>`;
  }

  private getDEPOINTEIntroductionTemplate(): string {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="[company_logo_url]" alt="FleetFlow" style="max-width: 200px; height: auto;" />
          <h2 style="color: #2563eb; margin: 10px 0; font-size: 20px;">DEPOINTE/Freight 1st Direct</h2>
          <p style="color: #6b7280; font-size: 14px;">Your Complete Freight Solutions Partner</p>
        </div>

        <h1 style="color: #1e40af; margin-bottom: 20px; font-size: 24px; text-align: center;">Professional Freight Solutions for [prospect_company]</h1>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Dear [contact_name],</p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">I wanted to personally introduce you to DEPOINTE/Freight 1st Direct - Michigan's premier freight brokerage and logistics company serving the [industry] industry for over 15 years.</p>

        <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border-left: 4px solid #2563eb;">
          <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">Why Choose DEPOINTE/Freight 1st Direct?</h3>
          <ul style="margin: 0; padding-left: 20px; color: #374151;">
            <li style="margin-bottom: 10px;"><strong>FMCSA Licensed & Bonded:</strong> Fully compliant with all federal regulations</li>
            <li style="margin-bottom: 10px;"><strong>48-State Coverage:</strong> Complete nationwide transportation network</li>
            <li style="margin-bottom: 10px;"><strong>Industry Expertise:</strong> Specialized knowledge in [industry] logistics</li>
            <li style="margin-bottom: 10px;"><strong>Personal Service:</strong> Direct access to decision-makers</li>
            <li><strong>Competitive Rates:</strong> Cost-effective solutions without compromising quality</li>
          </ul>
        </div>

        <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 8px;">
          <h3 style="margin: 0 0 15px 0; color: #166534; font-size: 18px;">Our Services Include:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
            <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #166534;">LTL</div>
              <div style="font-size: 12px; color: #6b7280;">Less Than Truckload</div>
            </div>
            <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #166534;">FTL</div>
              <div style="font-size: 12px; color: #6b7280;">Full Truckload</div>
            </div>
            <div style="text-align: center; padding: 15px; background: white; border-radius: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: #166534;">Specialized</div>
              <div style="font-size: 12px; color: #6b7280;">Oversized & Heavy Haul</div>
            </div>
          </div>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="[meeting_booking_link]" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">Schedule a Consultation</a>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 30px 0;">
          I'd love to discuss how DEPOINTE/Freight 1st Direct can support [prospect_company]'s transportation needs. Whether you need reliable carriers, competitive rates, or specialized logistics solutions, we're here to help.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151; margin: 20px 0;">
          Feel free to reach out anytime - I'm available at (248) 621-1950 or (248) 247-5020.
        </p>

        <p style="font-size: 16px; line-height: 1.6; color: #374151;">Best regards,</p>

        <div style="border-top: 2px solid #e5e7eb; margin-top: 30px; padding-top: 20px;">
          <div style="font-family: Arial, sans-serif; color: #374151;">
            <p style="margin: 5px 0; font-weight: 600; color: #2563eb; font-size: 18px;">[your_name]</p>
            <p style="margin: 2px 0; color: #6b7280;">[sender_title]</p>
            <p style="margin: 2px 0; color: #6b7280;">DEPOINTE/Freight 1st Direct</p>
            <p style="margin: 2px 0; color: #6b7280;">Direct: [direct_phone] | Office: (248) 247-5020</p>
            <p style="margin: 2px 0; color: #6b7280;">Email: info@fleetflowapp.com</p>
            <p style="margin: 2px 0; color: #6b7280;">Website: www.fleetflowapp.com</p>
            <div style="margin: 15px 0; padding: 10px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 6px; border: 1px solid #cbd5e1;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-align: center; font-weight: 600;">
                🚛 FMCSA Licensed Carrier • 48-State Network • 15+ Years Experience 🚛
              </p>
            </div>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; border: 1px solid #f59e0b;">
          <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.5; text-align: center;">
            <strong>Ready to optimize your freight costs?</strong><br>
            Contact us today for a free transportation analysis.
          </p>
        </div>
      </div>
    </div>`;
  }

  // Public methods
  getAllTemplates(): EmailTemplate[] {
    return [...this.templates];
  }

  getTemplatesByCategory(category: string): EmailTemplate[] {
    if (category === 'all') return this.getAllTemplates();
    return this.templates.filter((template) => template.category === category);
  }

  getTemplateById(id: number): EmailTemplate | undefined {
    return this.templates.find((template) => template.id === id);
  }

  createTemplate(
    template: Omit<EmailTemplate, 'id' | 'lastModified'>
  ): EmailTemplate {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now(),
      lastModified: new Date().toISOString().split('T')[0],
    };

    this.templates.push(newTemplate);
    this.saveTemplates();
    return newTemplate;
  }

  updateTemplate(
    id: number,
    updates: Partial<EmailTemplate>
  ): EmailTemplate | null {
    const index = this.templates.findIndex((template) => template.id === id);
    if (index === -1) return null;

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0],
    };

    this.saveTemplates();
    return this.templates[index];
  }

  deleteTemplate(id: number): boolean {
    const index = this.templates.findIndex((template) => template.id === id);
    if (index === -1) return false;

    this.templates.splice(index, 1);
    this.saveTemplates();
    return true;
  }

  duplicateTemplate(id: number): EmailTemplate | null {
    const template = this.getTemplateById(id);
    if (!template) return null;

    const duplicatedTemplate = {
      ...template,
      id: Date.now(),
      name: `${template.name} (Copy)`,
      lastModified: new Date().toISOString().split('T')[0],
    };

    this.templates.push(duplicatedTemplate);
    this.saveTemplates();
    return duplicatedTemplate;
  }

  exportTemplate(id: number): string | null {
    const template = this.getTemplateById(id);
    if (!template) return null;

    return JSON.stringify(template, null, 2);
  }

  importTemplate(templateData: string): EmailTemplate | null {
    try {
      const template = JSON.parse(templateData);
      template.id = Date.now();
      template.lastModified = new Date().toISOString().split('T')[0];

      this.templates.push(template);
      this.saveTemplates();
      return template;
    } catch (error) {
      console.error('Error importing template:', error);
      return null;
    }
  }

  extractVariables(content: string, subject: string): string[] {
    const combined = `${content} ${subject}`;
    const matches = combined.match(/\[([^\]]+)\]/g) || [];
    return [...new Set(matches.map((match) => match.replace(/[\[\]]/g, '')))];
  }

  renderTemplate(
    template: EmailTemplate,
    variables: Record<string, string>
  ): string {
    let rendered = template.content;

    Object.keys(variables).forEach((key) => {
      const value = String(variables[key] || '');
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      rendered = rendered.replace(regex, value);
    });

    // Replace any remaining brackets with placeholder text
    rendered = rendered.replace(/\[([^\]]+)\]/g, '[$1]');

    return rendered;
  }

  renderSubject(subject: string, variables: Record<string, string>): string {
    let rendered = subject;

    Object.keys(variables).forEach((key) => {
      const value = String(variables[key] || '');
      const regex = new RegExp(`\\[${key}\\]`, 'g');
      rendered = rendered.replace(regex, value);
    });

    return rendered;
  }

  getPerformanceMetrics(): {
    totalTemplates: number;
    activeTemplates: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgReplyRate: number;
  } {
    const activeTemplates = this.templates.filter((t) => t.isActive);
    const templatesWithPerformance = activeTemplates.filter(
      (t) => t.performance
    );

    const avgOpenRate =
      templatesWithPerformance.length > 0
        ? templatesWithPerformance.reduce(
            (sum, t) => sum + (t.performance?.avgOpenRate || 0),
            0
          ) / templatesWithPerformance.length
        : 0;

    const avgClickRate =
      templatesWithPerformance.length > 0
        ? templatesWithPerformance.reduce(
            (sum, t) => sum + (t.performance?.avgClickRate || 0),
            0
          ) / templatesWithPerformance.length
        : 0;

    const avgReplyRate =
      templatesWithPerformance.length > 0
        ? templatesWithPerformance.reduce(
            (sum, t) => sum + (t.performance?.avgReplyRate || 0),
            0
          ) / templatesWithPerformance.length
        : 0;

    return {
      totalTemplates: this.templates.length,
      activeTemplates: activeTemplates.length,
      avgOpenRate: Math.round(avgOpenRate * 10) / 10,
      avgClickRate: Math.round(avgClickRate * 10) / 10,
      avgReplyRate: Math.round(avgReplyRate * 10) / 10,
    };
  }
}

// Export singleton instance
export const emailTemplateService = DEPOINTEEmailTemplateService.getInstance();
