/**
 * CREDENTIALS & CERTIFICATIONS MANAGEMENT SERVICE
 * Central registry of all business licenses, certifications, and credentials
 * For DEE DAVIS INC / DEPOINTE / FleetFlow
 */

export interface Credential {
  id: string;
  type: 'license' | 'certification' | 'registration' | 'authority';
  category: 'federal' | 'state' | 'professional' | 'industry';
  name: string;
  issuingAuthority: string;
  issueDate: Date;
  expirationDate?: Date;
  status: 'active' | 'pending_renewal' | 'expired';
  credentialNumber?: string;
  documentFileName?: string;
  verificationUrl?: string;
  requiresRenewal: boolean;
  renewalFrequency?: 'annual' | 'biennial' | 'triennial' | 'permanent';
  description: string;
  grantApplicationValue: 'critical' | 'high' | 'medium' | 'low';
  proofOfCompliance: string[];
}

export interface BusinessProfile {
  legalName: string;
  dbaNames: string[];
  address: string;
  ein?: string;
  foundedDate: string;
  founder: string;
  credentials: Credential[];
  industries: string[];
  certifications: string[];
  revenue: {
    year: number;
    amount: number;
    source: string;
  }[];
}

class CredentialsManagementService {
  private static instance: CredentialsManagementService;

  private constructor() {
    console.info('🏆 Credentials Management Service initialized');
  }

  public static getInstance(): CredentialsManagementService {
    if (!CredentialsManagementService.instance) {
      CredentialsManagementService.instance =
        new CredentialsManagementService();
    }
    return CredentialsManagementService.instance;
  }

  /**
   * Get complete business profile with all credentials
   */
  public getBusinessProfile(): BusinessProfile {
    return {
      legalName: 'DEE DAVIS INC',
      dbaNames: ['DEPOINTE', 'FREIGHT 1ST DIRECT'],
      address: '755 W. Big Beaver Rd STE 2020, Troy, MI 48084',
      ein: 'Available upon request',
      foundedDate: '2024',
      founder: 'Dee Davis',
      credentials: this.getAllCredentials(),
      industries: [
        'Transportation & Logistics',
        'Healthcare Services (NEMT)',
        'Staffing & Personnel',
        'Financial Services (Mortgage)',
        'Technology (SaaS)',
      ],
      certifications: [
        'Minority Business Enterprise (MBE)',
        'Women-Owned Small Business (WOSB)',
        "Women's Business Enterprise (WBE)",
        'HIPAA Compliance',
        'Supplier Diversity',
      ],
      revenue: [
        {
          year: 2023,
          amount: 0, // To be filled from DEEDAVISINC2023.pdf
          source: '2023 Tax Return',
        },
        {
          year: 2024,
          amount: 89200,
          source: 'DEPOINTE Month 1 Operations',
        },
      ],
    };
  }

  /**
   * Get all credentials
   */
  public getAllCredentials(): Credential[] {
    return [
      // Federal Certifications
      {
        id: 'cert-mbe',
        type: 'certification',
        category: 'federal',
        name: 'Minority Business Enterprise (MBE)',
        issuingAuthority: 'National Minority Supplier Development Council',
        issueDate: new Date('2024-01-01'), // Update with actual date
        status: 'active',
        documentFileName: 'MBE.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description:
          'Federal certification as a minority-owned business enterprise',
        grantApplicationValue: 'critical',
        proofOfCompliance: [
          'Black-owned business status verified',
          '51% minority ownership',
          'Independently operated and managed',
        ],
      },
      {
        id: 'cert-wosb',
        type: 'certification',
        category: 'federal',
        name: 'Women-Owned Small Business (WOSB)',
        issuingAuthority: 'U.S. Small Business Administration (SBA)',
        issueDate: new Date('2024-01-01'),
        status: 'active',
        documentFileName: 'WOSB ACCEPTANCE LETTER.pdf',
        requiresRenewal: true,
        renewalFrequency: 'triennial',
        description: 'SBA certification as women-owned small business',
        grantApplicationValue: 'critical',
        proofOfCompliance: [
          'Woman-owned business status verified',
          '51% women ownership',
          'Economically disadvantaged certification',
        ],
      },
      {
        id: 'cert-wbe',
        type: 'certification',
        category: 'federal',
        name: "Women's Business Enterprise (WBE)",
        issuingAuthority: "Women's Business Enterprise National Council",
        issueDate: new Date('2024-01-01'),
        status: 'active',
        documentFileName: 'WBE RENEW.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description: 'National certification as women business enterprise',
        grantApplicationValue: 'high',
        proofOfCompliance: [
          'Women-owned and operated',
          'Independent business entity',
          'Women in management positions',
        ],
      },
      {
        id: 'cert-supplier-diversity',
        type: 'certification',
        category: 'federal',
        name: 'Supplier Diversity Certificate',
        issuingAuthority: 'Supplier Gateway',
        issueDate: new Date('2025-01-01'),
        credentialNumber: 'SG07252258991752',
        status: 'active',
        documentFileName: 'SG_Diversity_Certificate_SG07252258991752.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description:
          'Supplier diversity certification for corporate supply chains',
        grantApplicationValue: 'medium',
        proofOfCompliance: [
          'Diverse supplier status',
          'Corporate supply chain eligible',
        ],
      },

      // Healthcare Credentials
      {
        id: 'license-npi',
        type: 'registration',
        category: 'federal',
        name: 'National Provider Identifier (NPI)',
        issuingAuthority: 'Centers for Medicare & Medicaid Services (CMS)',
        issueDate: new Date('2024-01-01'),
        status: 'active',
        documentFileName: 'NPI DEE DAVIS INC.pdf',
        requiresRenewal: false,
        renewalFrequency: 'permanent',
        description:
          'Federal registration as healthcare provider for Medicare/Medicaid billing',
        grantApplicationValue: 'critical',
        proofOfCompliance: [
          'CMS registered healthcare provider',
          'Medicare/Medicaid billing capability',
          'NEMT services provider',
          '71M Medicaid beneficiaries access',
        ],
      },
      {
        id: 'cert-hipaa',
        type: 'certification',
        category: 'federal',
        name: 'HIPAA Compliance Certification',
        issuingAuthority: 'Healthcare Compliance Organization',
        issueDate: new Date('2025-01-01'),
        expirationDate: new Date('2025-12-31'),
        status: 'active',
        documentFileName: 'HIPAA 2025.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description: 'Healthcare privacy and security compliance certification',
        grantApplicationValue: 'critical',
        proofOfCompliance: [
          'Protected Health Information (PHI) security',
          'HIPAA Privacy Rule compliance',
          'HIPAA Security Rule compliance',
          'Healthcare data protection systems',
        ],
      },

      // Transportation Licenses
      {
        id: 'license-mc',
        type: 'authority',
        category: 'federal',
        name: 'Motor Carrier (MC) Authority',
        issuingAuthority: 'Federal Motor Carrier Safety Administration (FMCSA)',
        issueDate: new Date('2024-01-01'),
        status: 'active',
        credentialNumber: 'MC 1647572',
        verificationUrl: 'https://safer.fmcsa.dot.gov/',
        requiresRenewal: false,
        renewalFrequency: 'permanent',
        description: 'Federal authority to operate as freight broker',
        grantApplicationValue: 'high',
        proofOfCompliance: [
          'Interstate freight brokerage authority',
          'DOT registered and active',
          'FMCSA safety compliance',
          '$89,200 Month 1 revenue (DEPOINTE)',
        ],
      },
      {
        id: 'license-dot',
        type: 'registration',
        category: 'federal',
        name: 'US DOT Number',
        issuingAuthority: 'U.S. Department of Transportation',
        issueDate: new Date('2024-01-01'),
        status: 'active',
        credentialNumber: 'DOT 4250594',
        verificationUrl: 'https://safer.fmcsa.dot.gov/',
        requiresRenewal: false,
        renewalFrequency: 'permanent',
        description: 'Federal DOT registration for transportation operations',
        grantApplicationValue: 'high',
        proofOfCompliance: [
          'Federal transportation registration',
          'Interstate commerce authority',
          'Safety compliance monitoring',
        ],
      },

      // Financial Services Licenses
      {
        id: 'license-mlo-ga',
        type: 'license',
        category: 'state',
        name: 'Georgia Mortgage Loan Originator (MLO) License',
        issuingAuthority: 'Georgia Department of Banking and Finance / NMLS',
        issueDate: new Date('2024-01-01'),
        expirationDate: new Date('2025-12-31'),
        status: 'active',
        documentFileName: 'GEORGIA LICENSE MLO.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description:
          'State license to originate mortgage loans in Georgia (NMLS registered)',
        grantApplicationValue: 'critical',
        proofOfCompliance: [
          'FBI background check cleared',
          'NMLS national exam passed',
          'Georgia state exam passed',
          '20+ hours pre-licensing education',
          'Credit check cleared',
          '8 hours annual continuing education',
          'One of most regulated licenses in U.S.',
        ],
      },

      // Staffing & Personnel License
      {
        id: 'license-personnel-agent',
        type: 'license',
        category: 'state',
        name: 'Personnel Agent License',
        issuingAuthority: 'State Labor Department',
        issueDate: new Date('2024-01-01'),
        expirationDate: new Date('2025-12-31'),
        status: 'active',
        documentFileName: 'Personnel Agent license.pdf',
        requiresRenewal: true,
        renewalFrequency: 'annual',
        description: 'State license to operate staffing and personnel services',
        grantApplicationValue: 'high',
        proofOfCompliance: [
          'Employment placement services',
          'Job matching and staffing',
          'Workforce development capability',
          'Community job placement',
        ],
      },
    ];
  }

  /**
   * Get credentials by category
   */
  public getCredentialsByCategory(
    category: Credential['category']
  ): Credential[] {
    return this.getAllCredentials().filter((c) => c.category === category);
  }

  /**
   * Get credentials by grant application value
   */
  public getCriticalCredentialsForGrants(): Credential[] {
    return this.getAllCredentials().filter(
      (c) => c.grantApplicationValue === 'critical'
    );
  }

  /**
   * Get credentials requiring renewal soon (within 90 days)
   */
  public getCredentialsRequiringRenewal(): Credential[] {
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);

    return this.getAllCredentials().filter((c) => {
      if (!c.expirationDate || !c.requiresRenewal) return false;
      return c.expirationDate <= ninetyDaysFromNow && c.expirationDate > today;
    });
  }

  /**
   * Generate credentials summary for grant applications
   */
  public generateGrantApplicationSummary(): {
    federalCertifications: Credential[];
    professionalLicenses: Credential[];
    industryAuthorities: Credential[];
    complianceCertifications: Credential[];
    totalCredentials: number;
    industriesServed: string[];
    regulatoryExpertise: string[];
  } {
    const all = this.getAllCredentials();

    return {
      federalCertifications: all.filter(
        (c) => c.category === 'federal' && c.type === 'certification'
      ),
      professionalLicenses: all.filter((c) => c.type === 'license'),
      industryAuthorities: all.filter((c) => c.type === 'authority'),
      complianceCertifications: all.filter(
        (c) =>
          c.name.includes('HIPAA') ||
          c.name.includes('Compliance') ||
          c.name.includes('Diversity')
      ),
      totalCredentials: all.length,
      industriesServed: [
        'Transportation & Logistics (MC/DOT)',
        'Healthcare Services (NPI/HIPAA)',
        'Financial Services (MLO)',
        'Staffing & Personnel',
        'Technology (SaaS)',
      ],
      regulatoryExpertise: [
        'Federal Motor Carrier Safety Administration (FMCSA)',
        'Centers for Medicare & Medicaid Services (CMS)',
        'Nationwide Mortgage Licensing System (NMLS)',
        'U.S. Small Business Administration (SBA)',
        'Health Insurance Portability and Accountability Act (HIPAA)',
      ],
    };
  }

  /**
   * Generate credentials narrative for grant applications
   */
  public generateCredentialsNarrative(): string {
    const summary = this.generateGrantApplicationSummary();

    return `
DEE DAVIS INC is a multi-industry enterprise with ${summary.totalCredentials} active licenses, certifications, and federal registrations spanning five highly-regulated industries:

**Federal Certifications (${summary.federalCertifications.length}):**
${summary.federalCertifications.map((c) => `• ${c.name} - ${c.issuingAuthority}`).join('\n')}

**Professional Licenses (${summary.professionalLicenses.length}):**
${summary.professionalLicenses.map((c) => `• ${c.name} - ${c.issuingAuthority}`).join('\n')}

**Industry Authorities (${summary.industryAuthorities.length}):**
${summary.industryAuthorities.map((c) => `• ${c.name} (${c.credentialNumber || 'Federal Registration'})`).join('\n')}

**Regulatory Expertise:**
${summary.regulatoryExpertise.map((r) => `• ${r}`).join('\n')}

**Multi-Industry Operations:**
As a certified Minority Business Enterprise (MBE) and Women-Owned Small Business (WOSB), DEE DAVIS INC demonstrates exceptional regulatory compliance across:
- Healthcare (NPI + HIPAA)
- Transportation (MC + DOT)
- Financial Services (MLO with FBI clearance)
- Staffing & Personnel Services
- Technology Platform Development

This unique combination of credentials positions DEE DAVIS INC as a rare multi-vertical entrepreneur with proven expertise in navigating complex regulatory environments while building scalable, technology-enabled businesses that serve underserved communities.
    `.trim();
  }

  /**
   * Get supporting documents list for grant submission
   */
  public getGrantSupportingDocuments(): {
    fileName: string;
    category: string;
    description: string;
    grantRelevance: string;
  }[] {
    return [
      {
        fileName: 'MBE.pdf',
        category: 'Federal Certification',
        description: 'Minority Business Enterprise Certificate',
        grantRelevance: 'CRITICAL - Proves Black-owned business status',
      },
      {
        fileName: 'WOSB ACCEPTANCE LETTER.pdf',
        category: 'Federal Certification',
        description: 'SBA Women-Owned Small Business Certification',
        grantRelevance: 'CRITICAL - Federal women-owned status',
      },
      {
        fileName: 'WBE RENEW.pdf',
        category: 'Federal Certification',
        description: "Women's Business Enterprise Certification",
        grantRelevance: 'HIGH - National women business enterprise status',
      },
      {
        fileName: 'NPI DEE DAVIS INC.pdf',
        category: 'Healthcare Registration',
        description: 'National Provider Identifier (CMS)',
        grantRelevance: 'CRITICAL - Healthcare provider status for NEMT',
      },
      {
        fileName: 'HIPAA 2025.pdf',
        category: 'Healthcare Compliance',
        description: 'HIPAA Compliance Certification',
        grantRelevance: 'CRITICAL - Healthcare data security compliance',
      },
      {
        fileName: 'GEORGIA LICENSE MLO.pdf',
        category: 'Financial Services License',
        description: 'Mortgage Loan Originator License (NMLS)',
        grantRelevance:
          'CRITICAL - One of most regulated licenses (FBI check, exams)',
      },
      {
        fileName: 'Personnel Agent license.pdf',
        category: 'Staffing License',
        description: 'Personnel Agent License',
        grantRelevance: 'HIGH - Staffing and job placement services',
      },
      {
        fileName: 'DEEDAVISINC2023.pdf',
        category: 'Financial Document',
        description: '2023 Tax Return',
        grantRelevance: 'REQUIRED - Financial proof and revenue verification',
      },
      {
        fileName: 'CASH FLOW 2023 DDINC complete.pdf',
        category: 'Financial Document',
        description: '2023 Cash Flow Statement',
        grantRelevance: 'REQUIRED - Cash flow and financial health proof',
      },
      {
        fileName: 'DEE DAVIS INC. Capability Statement 2025.pdf',
        category: 'Business Profile',
        description: 'Complete Business Capability Statement',
        grantRelevance: 'HIGH - Comprehensive business overview',
      },
    ];
  }
}

export const credentialsService = CredentialsManagementService.getInstance();
export default credentialsService;
