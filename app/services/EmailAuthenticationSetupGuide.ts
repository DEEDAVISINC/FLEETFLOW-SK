/**
 * FleetFlow Email Authentication Setup Guide
 * Helps configure proper email authentication for improved deliverability
 * Provides instructions and templates for DKIM, SPF, and DMARC setup
 */

export interface DNSRecord {
  type: 'TXT' | 'MX' | 'CNAME';
  host: string;
  value: string;
  ttl?: number;
  priority?: number;
  purpose: string;
}

export interface AuthenticationStatus {
  domain: string;
  spf: {
    configured: boolean;
    record?: string;
    valid: boolean;
    errors: string[];
    recommendations: string[];
  };
  dkim: {
    configured: boolean;
    selector?: string;
    valid: boolean;
    errors: string[];
    recommendations: string[];
  };
  dmarc: {
    configured: boolean;
    policy?: 'none' | 'quarantine' | 'reject';
    valid: boolean;
    errors: string[];
    recommendations: string[];
  };
  score: number; // 0-100
}

interface DomainProviderConfig {
  name: string;
  dnsConsoleUrl: string;
  instructions: string[];
}

export class EmailAuthenticationSetupGuide {
  private domainProviders: Record<string, DomainProviderConfig> = {};

  constructor() {
    this.initializeDomainProviders();
    console.info('📧 Email Authentication Setup Guide initialized');
  }

  /**
   * Generate SPF record for a domain
   */
  generateSPFRecord(
    domain: string,
    options: {
      includeSendGrid?: boolean;
      includeGoogleWorkspace?: boolean;
      includeOffice365?: boolean;
      includeMailchimp?: boolean;
      includeCustomIPs?: string[];
      policy?: 'soft fail' | 'hard fail';
    } = {}
  ): DNSRecord {
    // Start building SPF record
    let spfValue = 'v=spf1';

    // Include domain's MX servers
    spfValue += ' mx';

    // Include SendGrid
    if (options.includeSendGrid) {
      spfValue += ' include:sendgrid.net';
    }

    // Include Google Workspace
    if (options.includeGoogleWorkspace) {
      spfValue += ' include:_spf.google.com';
    }

    // Include Office 365
    if (options.includeOffice365) {
      spfValue += ' include:spf.protection.outlook.com';
    }

    // Include Mailchimp
    if (options.includeMailchimp) {
      spfValue += ' include:servers.mcsv.net';
    }

    // Include custom IPs if provided
    if (options.includeCustomIPs && options.includeCustomIPs.length > 0) {
      options.includeCustomIPs.forEach((ip) => {
        if (ip.includes(':')) {
          // IPv6
          spfValue += ` ip6:${ip}`;
        } else {
          // IPv4
          spfValue += ` ip4:${ip}`;
        }
      });
    }

    // Add policy (default to soft fail ~all)
    spfValue += options.policy === 'hard fail' ? ' -all' : ' ~all';

    return {
      type: 'TXT',
      host: domain,
      value: spfValue,
      ttl: 3600,
      purpose:
        'SPF Record - Controls which servers can send email from your domain',
    };
  }

  /**
   * Generate DKIM record for SendGrid
   */
  generateSendGridDKIMRecord(
    domain: string,
    selector: string,
    dkimValue: string
  ): DNSRecord {
    return {
      type: 'TXT',
      host: `${selector}._domainkey.${domain}`,
      value: `v=DKIM1; k=rsa; p=${dkimValue}`,
      ttl: 3600,
      purpose: 'DKIM Record - Cryptographically signs emails for verification',
    };
  }

  /**
   * Generate DMARC record
   */
  generateDMARCRecord(
    domain: string,
    options: {
      policy?: 'none' | 'quarantine' | 'reject';
      percentage?: number;
      reportEmailAddress?: string;
      subdomainPolicy?: 'none' | 'quarantine' | 'reject';
    } = {}
  ): DNSRecord {
    // Set defaults
    const policy = options.policy || 'none';
    const percentage = options.percentage || 100;
    const reportEmail = options.reportEmailAddress || `dmarc@${domain}`;
    const subPolicy = options.subdomainPolicy || policy;

    let value = `v=DMARC1; p=${policy}; sp=${subPolicy}; pct=${percentage};`;

    // Add reporting options
    value += ` rua=mailto:${reportEmail};`;

    if (policy !== 'none') {
      value += ` ruf=mailto:${reportEmail};`;
    }

    // Add standard options for better compatibility
    value += ' fo=1; adkim=r; aspf=r;';

    return {
      type: 'TXT',
      host: `_dmarc.${domain}`,
      value,
      ttl: 3600,
      purpose:
        'DMARC Record - Email authentication, reporting, and conformance policy',
    };
  }

  /**
   * Generate all required DNS records for a domain
   */
  generateAllDNSRecords(
    domain: string,
    options: {
      emailProvider: 'sendgrid' | 'google' | 'office365' | 'custom';
      dkimSelector?: string;
      dkimValue?: string;
      dmarcPolicy?: 'none' | 'quarantine' | 'reject';
      reportEmail?: string;
      customIPs?: string[];
    }
  ): DNSRecord[] {
    const records: DNSRecord[] = [];

    // Generate SPF record
    records.push(
      this.generateSPFRecord(domain, {
        includeSendGrid: options.emailProvider === 'sendgrid',
        includeGoogleWorkspace: options.emailProvider === 'google',
        includeOffice365: options.emailProvider === 'office365',
        includeCustomIPs: options.customIPs,
      })
    );

    // Generate DKIM record if selector and value are provided
    if (options.dkimSelector && options.dkimValue) {
      records.push(
        this.generateSendGridDKIMRecord(
          domain,
          options.dkimSelector,
          options.dkimValue
        )
      );
    }

    // Generate DMARC record
    records.push(
      this.generateDMARCRecord(domain, {
        policy: options.dmarcPolicy || 'none',
        reportEmailAddress: options.reportEmail,
      })
    );

    return records;
  }

  /**
   * Check authentication status for a domain
   */
  async checkAuthenticationStatus(
    domain: string
  ): Promise<AuthenticationStatus> {
    // This would make real DNS lookups in a production implementation
    // For now, we'll return mock data
    const mockStatus: AuthenticationStatus = {
      domain,
      spf: {
        configured: Math.random() > 0.3, // 70% chance of being configured
        record: `v=spf1 mx include:sendgrid.net ~all`,
        valid: Math.random() > 0.2, // 80% chance of being valid
        errors: [],
        recommendations: [],
      },
      dkim: {
        configured: Math.random() > 0.4, // 60% chance of being configured
        selector: 'sg',
        valid: Math.random() > 0.3, // 70% chance of being valid
        errors: [],
        recommendations: [],
      },
      dmarc: {
        configured: Math.random() > 0.6, // 40% chance of being configured
        policy:
          Math.random() > 0.5
            ? 'none'
            : Math.random() > 0.5
              ? 'quarantine'
              : 'reject',
        valid: Math.random() > 0.2, // 80% chance of being valid
        errors: [],
        recommendations: [],
      },
      score: 0,
    };

    // Generate realistic errors and recommendations
    if (!mockStatus.spf.configured) {
      mockStatus.spf.errors.push('No SPF record found');
      mockStatus.spf.recommendations.push(
        'Add an SPF record to authorize email senders'
      );
    } else if (!mockStatus.spf.valid) {
      mockStatus.spf.errors.push('Invalid SPF syntax');
      mockStatus.spf.recommendations.push(
        'Fix SPF syntax errors for better deliverability'
      );
    }

    if (!mockStatus.dkim.configured) {
      mockStatus.dkim.errors.push('No DKIM record found');
      mockStatus.dkim.recommendations.push(
        'Configure DKIM for improved email verification'
      );
    } else if (!mockStatus.dkim.valid) {
      mockStatus.dkim.errors.push('DKIM record exists but is misconfigured');
      mockStatus.dkim.recommendations.push(
        'Update DKIM configuration with correct values'
      );
    }

    if (!mockStatus.dmarc.configured) {
      mockStatus.dmarc.errors.push('No DMARC policy found');
      mockStatus.dmarc.recommendations.push(
        'Add a DMARC record to improve deliverability'
      );
    } else if (mockStatus.dmarc.policy === 'none') {
      mockStatus.dmarc.recommendations.push(
        'Consider upgrading DMARC policy from "none" to "quarantine"'
      );
    }

    // Calculate score based on configuration and validity
    mockStatus.score = this.calculateAuthenticationScore(mockStatus);

    return mockStatus;
  }

  /**
   * Calculate authentication score based on configuration status
   */
  private calculateAuthenticationScore(status: AuthenticationStatus): number {
    let score = 0;

    // SPF: 30 points max
    if (status.spf.configured) {
      score += 15;
      if (status.spf.valid) score += 15;
    }

    // DKIM: 40 points max
    if (status.dkim.configured) {
      score += 20;
      if (status.dkim.valid) score += 20;
    }

    // DMARC: 30 points max
    if (status.dmarc.configured) {
      score += 10;
      if (status.dmarc.valid) {
        score += 10;

        // Additional points for stricter policies
        if (status.dmarc.policy === 'quarantine') {
          score += 5;
        } else if (status.dmarc.policy === 'reject') {
          score += 10;
        }
      }
    }

    return score;
  }

  /**
   * Get setup instructions for a specific domain provider
   */
  getProviderInstructions(providerName: string): DomainProviderConfig | null {
    return this.domainProviders[providerName.toLowerCase()] || null;
  }

  /**
   * Get support for common domain providers
   */
  getSupportedDomainProviders(): string[] {
    return Object.keys(this.domainProviders);
  }

  /**
   * Initialize domain provider configurations
   */
  private initializeDomainProviders(): void {
    this.domainProviders = {
      godaddy: {
        name: 'GoDaddy',
        dnsConsoleUrl: 'https://dcc.godaddy.com/manage-dns',
        instructions: [
          '1. Log in to your GoDaddy account',
          '2. Go to Domain Manager',
          '3. Select your domain',
          '4. Click "DNS" tab',
          '5. Add Records → Select "TXT" type',
          '6. Enter the host and value for each record',
          '7. Save changes',
        ],
      },
      namecheap: {
        name: 'Namecheap',
        dnsConsoleUrl:
          'https://ap.www.namecheap.com/domains/domaincontrolpanel',
        instructions: [
          '1. Log in to your Namecheap account',
          '2. Go to Domain List',
          '3. Click "Manage" next to your domain',
          '4. Select "Advanced DNS" tab',
          '5. Add New Record → Select "TXT" type',
          '6. Enter the host and value for each record',
          '7. Save changes',
        ],
      },
      cloudflare: {
        name: 'Cloudflare',
        dnsConsoleUrl: 'https://dash.cloudflare.com/',
        instructions: [
          '1. Log in to your Cloudflare account',
          '2. Select your domain',
          '3. Go to "DNS" tab',
          '4. Click "Add Record"',
          '5. Select "TXT" as type',
          '6. Enter name and content for each record',
          '7. Save changes',
          'Note: Ensure Cloudflare proxy is disabled (grey cloud) for email records',
        ],
      },
      'google domains': {
        name: 'Google Domains',
        dnsConsoleUrl: 'https://domains.google.com/registrar/',
        instructions: [
          '1. Log in to Google Domains',
          '2. Select your domain',
          '3. Go to "DNS" tab',
          '4. Scroll to "Custom Resource Records"',
          '5. Add each TXT record with the provided name and data',
          '6. Save changes',
        ],
      },
      'amazon route53': {
        name: 'Amazon Route 53',
        dnsConsoleUrl: 'https://console.aws.amazon.com/route53/',
        instructions: [
          '1. Log in to AWS Console',
          '2. Go to Route 53 service',
          '3. Click on "Hosted Zones"',
          '4. Select your domain',
          '5. Click "Create Record"',
          '6. Select "TXT" as record type',
          '7. Enter record name and value',
          '8. Save record set',
        ],
      },
      digitalocean: {
        name: 'DigitalOcean',
        dnsConsoleUrl: 'https://cloud.digitalocean.com/networking/domains/',
        instructions: [
          '1. Log in to DigitalOcean',
          '2. Go to "Networking" section',
          '3. Select your domain',
          '4. Click "Create Record"',
          '5. Select "TXT" as record type',
          '6. Enter hostname and value',
          '7. Click "Create Record"',
        ],
      },
    };
  }

  /**
   * Get recommended DMARC policy based on business needs
   */
  getRecommendedDMARCPolicy(options: {
    businessType: 'small' | 'medium' | 'enterprise';
    emailVolume: 'low' | 'medium' | 'high';
    industryType:
      | 'general'
      | 'financial'
      | 'healthcare'
      | 'ecommerce'
      | 'technology';
    riskTolerance: 'low' | 'medium' | 'high';
  }): {
    policy: 'none' | 'quarantine' | 'reject';
    implementation: 'immediate' | 'phased';
    recommendations: string[];
  } {
    const { businessType, emailVolume, industryType, riskTolerance } = options;

    // Default recommendation
    let result = {
      policy: 'none' as const,
      implementation: 'phased' as const,
      recommendations: [],
    };

    // Determine base policy based on industry and risk tolerance
    if (
      ['financial', 'healthcare'].includes(industryType) ||
      riskTolerance === 'low'
    ) {
      // Sensitive industries or low risk tolerance
      result.policy = 'reject';
      result.recommendations.push(
        'Your industry requires strong email security.'
      );
    } else if (businessType === 'enterprise' || emailVolume === 'high') {
      // Enterprise businesses or high volume senders
      result.policy = 'quarantine';
      result.recommendations.push(
        'Start with quarantine policy for better monitoring before full rejection.'
      );
    } else {
      // Small businesses or low volume senders
      result.policy = 'none';
      result.recommendations.push(
        'Begin with monitoring mode to understand email authentication behavior.'
      );
    }

    // Adjust implementation approach based on business size and email volume
    if (businessType === 'enterprise' || emailVolume === 'high') {
      result.implementation = 'phased';
      result.recommendations.push(
        'Use percentage deployment starting at 10% and increasing gradually.'
      );
    } else {
      result.implementation = 'immediate';
      result.recommendations.push(
        'Full implementation can be done immediately for your email volume.'
      );
    }

    // Add standard recommendations
    result.recommendations.push(
      'Monitor email reports for at least 2 weeks before increasing policy strictness.'
    );
    result.recommendations.push(
      'Ensure all legitimate sending sources are authorized in SPF and signed with DKIM.'
    );

    return result;
  }

  /**
   * Get implementation steps for email authentication
   */
  getImplementationSteps(): string[] {
    return [
      '1. Generate DNS records for SPF, DKIM, and DMARC',
      '2. Add records to your DNS configuration through your domain provider',
      '3. Verify proper configuration using authentication checking tools',
      '4. Monitor email delivery and authentication reports',
      '5. Gradually increase DMARC policy strictness (none → quarantine → reject)',
      '6. Regularly review and update your authentication as email sending needs change',
    ];
  }

  /**
   * Get verification tools for email authentication
   */
  getVerificationTools(): { name: string; url: string; description: string }[] {
    return [
      {
        name: 'MXToolbox',
        url: 'https://mxtoolbox.com/SuperTool.aspx',
        description: 'Comprehensive email configuration checking tool',
      },
      {
        name: 'DMARC Analyzer',
        url: 'https://www.dmarcanalyzer.com/',
        description: 'DMARC record validation and reporting',
      },
      {
        name: 'Mail Tester',
        url: 'https://www.mail-tester.com/',
        description: 'Test overall email deliverability and authentication',
      },
      {
        name: 'DKIM Core',
        url: 'https://dkimcore.org/tools/',
        description: 'DKIM record validation tools',
      },
      {
        name: 'Google Postmaster Tools',
        url: 'https://postmaster.google.com/',
        description: 'Email delivery insights for Gmail',
      },
    ];
  }
}

// Export singleton instance
export const emailAuthenticationGuide = new EmailAuthenticationSetupGuide();
