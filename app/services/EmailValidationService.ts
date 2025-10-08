/**
 * 📧 EMAIL VALIDATION SERVICE
 *
 * Cost-effective email validation and verification
 * Integrates with multiple providers for reliability
 *
 * Providers:
 * - Hunter.io (primary) - $49/mo for 5,000 verifications
 * - ZeroBounce (backup) - $16/mo for 2,000 verifications
 * - Abstract API (fallback) - Free tier available
 */

interface EmailValidationResult {
  email: string;
  isValid: boolean;
  isDeliverable: boolean;
  isCatchAll: boolean;
  isDisposable: boolean;
  isFreeProvider: boolean;
  score: number; // 0-100
  provider: string;
  details: {
    smtpCheck: boolean;
    domainCheck: boolean;
    mxRecords: boolean;
    syntaxValid: boolean;
  };
  suggestion?: string; // Corrected email if typo detected
}

interface BulkValidationResult {
  total: number;
  valid: number;
  invalid: number;
  risky: number;
  results: EmailValidationResult[];
}

export class EmailValidationService {
  private static instance: EmailValidationService;
  private hunterApiKey: string;
  private zeroBounceApiKey: string;
  private abstractApiKey: string;
  private cache: Map<string, EmailValidationResult> = new Map();
  private cacheExpiry: number = 7 * 24 * 60 * 60 * 1000; // 7 days

  private constructor() {
    // API keys from environment variables
    this.hunterApiKey = process.env.HUNTER_API_KEY || '';
    this.zeroBounceApiKey = process.env.ZEROBOUNCE_API_KEY || '';
    this.abstractApiKey = process.env.ABSTRACT_API_KEY || '';

    console.info('📧 Email Validation Service initialized');
  }

  public static getInstance(): EmailValidationService {
    if (!EmailValidationService.instance) {
      EmailValidationService.instance = new EmailValidationService();
    }
    return EmailValidationService.instance;
  }

  /**
   * Validate a single email address
   */
  public async validateEmail(email: string): Promise<EmailValidationResult> {
    // Check cache first
    const cached = this.cache.get(email.toLowerCase());
    if (cached) {
      console.info(`📧 Using cached validation for ${email}`);
      return cached;
    }

    try {
      // Try Hunter.io first (most reliable)
      if (this.hunterApiKey) {
        const result = await this.validateWithHunter(email);
        this.cache.set(email.toLowerCase(), result);
        return result;
      }

      // Fallback to ZeroBounce
      if (this.zeroBounceApiKey) {
        const result = await this.validateWithZeroBounce(email);
        this.cache.set(email.toLowerCase(), result);
        return result;
      }

      // Final fallback to Abstract API
      if (this.abstractApiKey) {
        const result = await this.validateWithAbstractAPI(email);
        this.cache.set(email.toLowerCase(), result);
        return result;
      }

      // No API keys configured - use basic validation
      console.warn(
        '⚠️ No email validation API keys configured, using basic validation'
      );
      return this.basicValidation(email);
    } catch (error) {
      console.error(`❌ Email validation error for ${email}:`, error);
      return this.basicValidation(email);
    }
  }

  /**
   * Validate multiple emails in bulk (more cost-effective)
   */
  public async validateBulk(emails: string[]): Promise<BulkValidationResult> {
    console.info(`📧 Bulk validating ${emails.length} emails`);

    const results: EmailValidationResult[] = [];
    let valid = 0;
    let invalid = 0;
    let risky = 0;

    // Process in batches to avoid rate limits
    const batchSize = 25;
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map((email) => this.validateEmail(email))
      );

      results.push(...batchResults);

      // Count results
      batchResults.forEach((result) => {
        if (result.isValid && result.isDeliverable) valid++;
        else if (!result.isValid) invalid++;
        else risky++;
      });

      // Rate limiting delay
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    return {
      total: emails.length,
      valid,
      invalid,
      risky,
      results,
    };
  }

  /**
   * Hunter.io validation (primary provider)
   */
  private async validateWithHunter(
    email: string
  ): Promise<EmailValidationResult> {
    const response = await fetch(
      `https://api.hunter.io/v2/email-verifier?email=${encodeURIComponent(email)}&api_key=${this.hunterApiKey}`
    );

    if (!response.ok) {
      throw new Error(`Hunter.io API error: ${response.status}`);
    }

    const data = await response.json();
    const verification = data.data;

    return {
      email,
      isValid: verification.status === 'valid',
      isDeliverable:
        verification.status === 'valid' &&
        verification.result !== 'undeliverable',
      isCatchAll: verification.accept_all || false,
      isDisposable: verification.disposable || false,
      isFreeProvider: verification.webmail || false,
      score: verification.score || 0,
      provider: 'hunter.io',
      details: {
        smtpCheck: verification.smtp_check || false,
        domainCheck: verification.mx_records || false,
        mxRecords: verification.mx_records || false,
        syntaxValid: verification.regexp || false,
      },
      suggestion: verification.did_you_mean || undefined,
    };
  }

  /**
   * ZeroBounce validation (backup provider)
   */
  private async validateWithZeroBounce(
    email: string
  ): Promise<EmailValidationResult> {
    const response = await fetch(
      `https://api.zerobounce.net/v2/validate?api_key=${this.zeroBounceApiKey}&email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(`ZeroBounce API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      email,
      isValid: data.status === 'valid',
      isDeliverable:
        data.status === 'valid' && data.sub_status !== 'no_dns_entries',
      isCatchAll: data.status === 'catch-all',
      isDisposable: data.status === 'disposable',
      isFreeProvider: data.free_email || false,
      score: data.status === 'valid' ? 100 : 0,
      provider: 'zerobounce',
      details: {
        smtpCheck: true,
        domainCheck: data.mx_found || false,
        mxRecords: data.mx_found || false,
        syntaxValid: true,
      },
      suggestion: data.did_you_mean || undefined,
    };
  }

  /**
   * Abstract API validation (fallback provider)
   */
  private async validateWithAbstractAPI(
    email: string
  ): Promise<EmailValidationResult> {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${this.abstractApiKey}&email=${encodeURIComponent(email)}`
    );

    if (!response.ok) {
      throw new Error(`Abstract API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      email,
      isValid:
        data.is_valid_format.value && data.deliverability === 'DELIVERABLE',
      isDeliverable: data.deliverability === 'DELIVERABLE',
      isCatchAll: data.is_catchall_email.value || false,
      isDisposable: data.is_disposable_email.value || false,
      isFreeProvider: data.is_free_email.value || false,
      score: data.quality_score * 100 || 0,
      provider: 'abstractapi',
      details: {
        smtpCheck: data.is_smtp_valid.value || false,
        domainCheck: data.is_mx_found.value || false,
        mxRecords: data.is_mx_found.value || false,
        syntaxValid: data.is_valid_format.value || false,
      },
      suggestion: data.autocorrect || undefined,
    };
  }

  /**
   * Basic validation (no API required)
   */
  private basicValidation(email: string): EmailValidationResult {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);

    // Check for common disposable domains
    const disposableDomains = [
      'tempmail.com',
      'guerrillamail.com',
      '10minutemail.com',
      'throwaway.email',
      'mailinator.com',
      'trashmail.com',
    ];
    const domain = email.split('@')[1]?.toLowerCase() || '';
    const isDisposable = disposableDomains.some((d) => domain.includes(d));

    // Check for free providers
    const freeProviders = [
      'gmail.com',
      'yahoo.com',
      'hotmail.com',
      'outlook.com',
      'aol.com',
      'icloud.com',
      'protonmail.com',
    ];
    const isFreeProvider = freeProviders.includes(domain);

    return {
      email,
      isValid,
      isDeliverable: isValid && !isDisposable,
      isCatchAll: false,
      isDisposable,
      isFreeProvider,
      score: isValid ? 50 : 0,
      provider: 'basic',
      details: {
        smtpCheck: false,
        domainCheck: false,
        mxRecords: false,
        syntaxValid: isValid,
      },
    };
  }

  /**
   * Clear validation cache
   */
  public clearCache(): void {
    this.cache.clear();
    console.info('📧 Email validation cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const emailValidationService = EmailValidationService.getInstance();

