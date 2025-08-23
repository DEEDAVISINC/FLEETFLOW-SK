/**
 * Subscription Agreement Management Service
 * Handles legal agreements, terms of service, and compliance for subscriptions
 */

export interface SubscriptionAgreement {
  id: string;
  version: string;
  type:
    | 'subscription_terms'
    | 'privacy_policy'
    | 'service_agreement'
    | 'phone_service_terms';
  title: string;
  content: string;
  effectiveDate: Date;
  expirationDate?: Date;
  isActive: boolean;
  requiredForSubscription: boolean;
  lastUpdated: Date;
  templateVariables?: { [key: string]: string };
}

export interface UserAgreementConsent {
  id: string;
  userId: string;
  agreementId: string;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
  method: 'digital_signature' | 'checkbox_consent' | 'click_through';
  signatureData?: {
    signature: string; // Base64 encoded signature image
    signedByName: string;
    signedByTitle?: string;
    timestamp: Date;
  };
  isActive: boolean;
  withdrawnDate?: Date;
  withdrawnReason?: string;
}

export interface AgreementTemplate {
  id: string;
  name: string;
  category: string;
  content: string;
  variables: string[]; // List of template variables like {{companyName}}, {{userName}}
  previewContent: string;
}

class SubscriptionAgreementService {
  private agreements: Map<string, SubscriptionAgreement> = new Map();
  private userConsents: Map<string, UserAgreementConsent[]> = new Map();
  private templates: Map<string, AgreementTemplate> = new Map();

  constructor() {
    this.initializeDefaultAgreements();
    this.initializeTemplates();
  }

  private initializeDefaultAgreements() {
    // FleetFlow Professional Subscription Agreement
    const subscriptionTerms: SubscriptionAgreement = {
      id: 'fleetflow-subscription-2024-v1',
      version: '1.0.0',
      type: 'subscription_terms',
      title: 'FleetFlow Professional Subscription Agreement',
      content: `
# FleetFlow Professional Subscription Agreement

**Effective Date:** January 1, 2024
**Version:** 1.0.0

## 1. SUBSCRIPTION SERVICES

FleetFlow provides cloud-based transportation management software including:
- Dispatch management and load optimization
- Driver management and communication tools
- Compliance monitoring and reporting
- Financial management and invoicing
- API access and integrations

## 2. SUBSCRIPTION TIERS & BILLING

### Available Plans:
- **FleetFlow University℠**: $49/month - Training and certification
- **Professional Dispatcher**: $99/month - Dispatch operations
- **Professional Brokerage**: $289/month - Full brokerage operations with phone system
- **AI Flow Professional**: $199/month - AI-powered automation
- **Enterprise Professional**: $2,698/month - Complete enterprise solution

### Phone System Add-Ons:
- **FleetFlow Phone Basic**: $39/month - 100 minutes, basic features
- **FleetFlow Phone Professional**: $89/month - 500 minutes, CRM integration
- **FleetFlow Phone Enterprise**: $199/month - Unlimited, call center features

### Usage-Based Billing:
- Phone minutes overage: $0.02/minute
- SMS messages overage: $0.05/message
- API calls: $0.10 per 1,000 calls

## 3. PAYMENT TERMS

- Monthly billing in advance
- Annual plans receive 20% discount
- Failed payments result in service suspension after 5 days
- Automatic renewal unless cancelled 30 days in advance
- All fees are non-refundable except as required by law

## 4. DATA & PRIVACY

- Customer data remains property of subscriber
- FleetFlow maintains SOC 2 Type II compliance
- Data is encrypted in transit and at rest
- Business continuity and disaster recovery included

## 5. SERVICE LEVEL AGREEMENT

- 99.9% uptime guarantee
- 24/7 monitoring and support for Enterprise plans
- Maximum 4-hour response time for critical issues
- Planned maintenance windows with 48-hour notice

## 6. TERMINATION

- Either party may terminate with 30 days written notice
- Immediate termination for breach of terms
- Data export available for 30 days post-termination
- Refunds calculated on a pro-rated basis for annual plans

## 7. LIABILITY & WARRANTIES

FleetFlow's liability is limited to the amount paid in the 12 months preceding any claim. Services provided "as is" with standard commercial warranties.

By subscribing, you agree to these terms and our Privacy Policy.
      `,
      effectiveDate: new Date('2024-01-01'),
      isActive: true,
      requiredForSubscription: true,
      lastUpdated: new Date(),
    };

    // Phone Service Terms
    const phoneServiceTerms: SubscriptionAgreement = {
      id: 'fleetflow-phone-2024-v1',
      version: '1.0.0',
      type: 'phone_service_terms',
      title: 'FleetFlow Phone System Terms of Service',
      content: `
# FleetFlow Phone System Terms of Service

**Effective Date:** January 1, 2024

## 1. PHONE SERVICE FEATURES

FleetFlow Phone System provides:
- Multi-tenant business phone numbers
- Outbound calling with custom caller ID
- Inbound call routing and voicemail
- SMS messaging capabilities
- Call monitoring and recording
- CRM integration and call logging

## 2. USAGE POLICIES

### Acceptable Use:
- Business communications only
- Compliance with TCPA and robocalling laws
- No spam, harassment, or illegal activities
- Respect for Do Not Call registries

### Usage Limits:
- Minutes and SMS as per subscription plan
- Overage charges apply beyond limits
- Fair use policy for unlimited plans

## 3. COMPLIANCE & RECORDING

- Call recording requires all-party consent where required by law
- Customer responsible for compliance with local regulations
- FleetFlow maintains records for billing and quality purposes
- CPNI (Customer Proprietary Network Information) protection

## 4. SERVICE AVAILABILITY

- Phone service availability subject to carrier networks
- Emergency services (911) routing available
- Service may be interrupted for maintenance or upgrades

By using FleetFlow Phone System, you acknowledge these terms.
      `,
      effectiveDate: new Date('2024-01-01'),
      isActive: true,
      requiredForSubscription: false,
      lastUpdated: new Date(),
    };

    // Privacy Policy
    const privacyPolicy: SubscriptionAgreement = {
      id: 'fleetflow-privacy-2024-v1',
      version: '1.0.0',
      type: 'privacy_policy',
      title: 'FleetFlow Privacy Policy',
      content: `
# FleetFlow Privacy Policy

**Last Updated:** January 1, 2024

## Information We Collect

- Account information (name, email, company details)
- Usage data and analytics
- Communication records
- Payment information (processed by third parties)
- Location data from fleet vehicles (when enabled)

## How We Use Information

- Provide and improve our services
- Process billing and payments
- Communicate about your account
- Ensure security and prevent fraud
- Comply with legal requirements

## Information Sharing

We do not sell personal information. We may share data with:
- Service providers and vendors
- Legal authorities when required
- Business partners with your consent

## Data Security

- Industry-standard encryption
- Regular security audits
- Employee training on data protection
- Incident response procedures

## Your Rights

- Access your personal information
- Request corrections or deletions
- Opt out of marketing communications
- Data portability for business data

## Contact Information

Privacy Officer: privacy@fleetflow.com
Data Protection Officer: dpo@fleetflow.com
      `,
      effectiveDate: new Date('2024-01-01'),
      isActive: true,
      requiredForSubscription: true,
      lastUpdated: new Date(),
    };

    this.agreements.set(subscriptionTerms.id, subscriptionTerms);
    this.agreements.set(phoneServiceTerms.id, phoneServiceTerms);
    this.agreements.set(privacyPolicy.id, privacyPolicy);
  }

  private initializeTemplates() {
    const enterpriseAgreementTemplate: AgreementTemplate = {
      id: 'enterprise-custom-agreement',
      name: 'Enterprise Custom Agreement Template',
      category: 'enterprise',
      variables: [
        'companyName',
        'contactName',
        'monthlyFee',
        'userLimit',
        'effectiveDate',
      ],
      content:
        '# FleetFlow Enterprise Agreement\n\n' +
        '**Company:** {{companyName}}\n' +
        '**Contact:** {{contactName}}\n' +
        '**Monthly Fee:** ${{monthlyFee}}\n' +
        '**User Limit:** {{userLimit}}\n' +
        '**Effective Date:** {{effectiveDate}}\n\n' +
        'This agreement governs the enterprise subscription services for {{companyName}}.\n\n' +
        '[Standard enterprise terms continue...]',
      previewContent:
        'Enterprise agreement with custom terms for large organizations.',
    };

    this.templates.set(
      enterpriseAgreementTemplate.id,
      enterpriseAgreementTemplate
    );
  }

  // Get all active agreements required for subscription
  getRequiredAgreements(): SubscriptionAgreement[] {
    return Array.from(this.agreements.values()).filter(
      (agreement) => agreement.isActive && agreement.requiredForSubscription
    );
  }

  // Get agreements by type
  getAgreementsByType(
    type: SubscriptionAgreement['type']
  ): SubscriptionAgreement[] {
    return Array.from(this.agreements.values()).filter(
      (agreement) => agreement.type === type && agreement.isActive
    );
  }

  // Get specific agreement
  getAgreement(agreementId: string): SubscriptionAgreement | null {
    return this.agreements.get(agreementId) || null;
  }

  // Record user consent to agreement
  async recordUserConsent(
    userId: string,
    agreementId: string,
    ipAddress: string,
    userAgent: string,
    method: UserAgreementConsent['method'],
    signatureData?: UserAgreementConsent['signatureData']
  ): Promise<UserAgreementConsent> {
    const consent: UserAgreementConsent = {
      id: `consent-${userId}-${agreementId}-${Date.now()}`,
      userId,
      agreementId,
      consentDate: new Date(),
      ipAddress,
      userAgent,
      method,
      signatureData,
      isActive: true,
    };

    if (!this.userConsents.has(userId)) {
      this.userConsents.set(userId, []);
    }

    this.userConsents.get(userId)?.push(consent);

    // Log for audit trail
    console.log(
      `✅ User consent recorded: ${userId} agreed to ${agreementId} via ${method}`
    );

    return consent;
  }

  // Check if user has agreed to all required agreements
  hasUserAgreedToRequired(userId: string): {
    hasAgreed: boolean;
    missingAgreements: string[];
    expiredAgreements: string[];
  } {
    const requiredAgreements = this.getRequiredAgreements();
    const userConsents = this.userConsents.get(userId) || [];

    const missingAgreements: string[] = [];
    const expiredAgreements: string[] = [];

    for (const agreement of requiredAgreements) {
      const consent = userConsents.find(
        (c) => c.agreementId === agreement.id && c.isActive && !c.withdrawnDate
      );

      if (!consent) {
        missingAgreements.push(agreement.id);
      } else if (
        agreement.expirationDate &&
        new Date() > agreement.expirationDate
      ) {
        expiredAgreements.push(agreement.id);
      }
    }

    return {
      hasAgreed:
        missingAgreements.length === 0 && expiredAgreements.length === 0,
      missingAgreements,
      expiredAgreements,
    };
  }

  // Get user's consent history
  getUserConsentHistory(userId: string): UserAgreementConsent[] {
    return this.userConsents.get(userId) || [];
  }

  // Withdraw consent (for GDPR compliance)
  async withdrawConsent(
    userId: string,
    consentId: string,
    reason: string
  ): Promise<boolean> {
    const userConsents = this.userConsents.get(userId) || [];
    const consent = userConsents.find((c) => c.id === consentId);

    if (consent) {
      consent.isActive = false;
      consent.withdrawnDate = new Date();
      consent.withdrawnReason = reason;

      console.log(
        `🔄 Consent withdrawn: ${userId} withdrew ${consentId} - ${reason}`
      );
      return true;
    }

    return false;
  }

  // Generate agreement with template variables
  generateAgreementFromTemplate(
    templateId: string,
    variables: { [key: string]: string }
  ): string {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    let content = template.content;

    // Replace all template variables
    for (const [key, value] of Object.entries(variables)) {
      content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }

    return content;
  }

  // Create custom enterprise agreement
  async createEnterpriseAgreement(
    companyName: string,
    contactName: string,
    customTerms: {
      monthlyFee: number;
      userLimit: number | 'unlimited';
      customClauses?: string[];
      effectiveDate: Date;
    }
  ): Promise<SubscriptionAgreement> {
    const agreementContent = this.generateAgreementFromTemplate(
      'enterprise-custom-agreement',
      {
        companyName,
        contactName,
        monthlyFee: customTerms.monthlyFee.toString(),
        userLimit: customTerms.userLimit.toString(),
        effectiveDate: customTerms.effectiveDate.toLocaleDateString(),
      }
    );

    const agreement: SubscriptionAgreement = {
      id: `enterprise-${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      version: '1.0.0',
      type: 'service_agreement',
      title: `${companyName} Enterprise Agreement`,
      content: agreementContent,
      effectiveDate: customTerms.effectiveDate,
      isActive: true,
      requiredForSubscription: true,
      lastUpdated: new Date(),
    };

    this.agreements.set(agreement.id, agreement);
    return agreement;
  }

  // Get compliance report for auditing
  getComplianceReport(
    startDate: Date,
    endDate: Date
  ): {
    totalConsents: number;
    consentsByMethod: { [method: string]: number };
    consentsByAgreement: { [agreementId: string]: number };
    withdrawnConsents: number;
    activeConsents: number;
  } {
    const allConsents: UserAgreementConsent[] = [];

    for (const userConsents of this.userConsents.values()) {
      allConsents.push(
        ...userConsents.filter(
          (c) => c.consentDate >= startDate && c.consentDate <= endDate
        )
      );
    }

    const consentsByMethod: { [method: string]: number } = {};
    const consentsByAgreement: { [agreementId: string]: number } = {};
    let withdrawnConsents = 0;
    let activeConsents = 0;

    for (const consent of allConsents) {
      // Count by method
      consentsByMethod[consent.method] =
        (consentsByMethod[consent.method] || 0) + 1;

      // Count by agreement
      consentsByAgreement[consent.agreementId] =
        (consentsByAgreement[consent.agreementId] || 0) + 1;

      // Count status
      if (consent.withdrawnDate) {
        withdrawnConsents++;
      } else if (consent.isActive) {
        activeConsents++;
      }
    }

    return {
      totalConsents: allConsents.length,
      consentsByMethod,
      consentsByAgreement,
      withdrawnConsents,
      activeConsents,
    };
  }

  // Update agreement (creates new version)
  async updateAgreement(
    agreementId: string,
    updates: Partial<SubscriptionAgreement>
  ): Promise<SubscriptionAgreement> {
    const existingAgreement = this.agreements.get(agreementId);
    if (!existingAgreement) {
      throw new Error(`Agreement not found: ${agreementId}`);
    }

    // Deactivate old version
    existingAgreement.isActive = false;

    // Create new version
    const newVersion = this.incrementVersion(existingAgreement.version);
    const newAgreement: SubscriptionAgreement = {
      ...existingAgreement,
      ...updates,
      id: `${existingAgreement.id}-v${newVersion}`,
      version: newVersion,
      isActive: true,
      lastUpdated: new Date(),
    };

    this.agreements.set(newAgreement.id, newAgreement);

    console.log(`📝 Agreement updated: ${agreementId} -> ${newAgreement.id}`);
    return newAgreement;
  }

  private incrementVersion(version: string): string {
    const parts = version.split('.');
    const patch = parseInt(parts[2] || '0') + 1;
    return `${parts[0]}.${parts[1]}.${patch}`;
  }
}

export const subscriptionAgreementService = new SubscriptionAgreementService();
