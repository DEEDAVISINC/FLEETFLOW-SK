/**
 * AI Data Sanitizer - Advanced data cleaning and anonymization for AI systems
 * Ensures no sensitive company or tenant data is exposed to AI models
 */

export interface SanitizationConfig {
  level: 'basic' | 'standard' | 'strict' | 'maximum';
  preserveStructure: boolean;
  allowAnalytics: boolean;
  tenantId?: string;
  industryContext?: string;
}

export interface SanitizationResult {
  sanitizedData: any;
  sanitizedText: string;
  redactedFields: string[];
  anonymizedFields: string[];
  riskScore: number;
  safe: boolean;
  metadata: {
    originalSize: number;
    sanitizedSize: number;
    redactionCount: number;
    anonymizationCount: number;
  };
}

export class AIDataSanitizer {
  private sensitivePatterns: Map<string, RegExp[]> = new Map();
  private companySpecificPatterns: Map<string, RegExp[]> = new Map();
  private tenantDataMasks: Map<string, any> = new Map();

  constructor() {
    this.initializeSensitivePatterns();
    this.initializeCompanyPatterns();
  }

  /**
   * Main sanitization method - processes any data before AI consumption
   */
  sanitizeForAI(
    data: any,
    text: string,
    config: SanitizationConfig
  ): SanitizationResult {
    const startTime = Date.now();
    const originalSize = JSON.stringify(data).length + text.length;

    let sanitizedData = this.deepClone(data);
    let sanitizedText = text;
    const redactedFields: string[] = [];
    const anonymizedFields: string[] = [];
    let riskScore = 0;

    try {
      // Step 1: Remove PII and sensitive personal data
      const personalDataResult = this.sanitizePersonalData(
        sanitizedData,
        sanitizedText
      );
      sanitizedData = personalDataResult.data;
      sanitizedText = personalDataResult.text;
      redactedFields.push(...personalDataResult.redactedFields);
      riskScore += personalDataResult.riskScore;

      // Step 2: Remove financial information
      const financialResult = this.sanitizeFinancialData(
        sanitizedData,
        sanitizedText
      );
      sanitizedData = financialResult.data;
      sanitizedText = financialResult.text;
      redactedFields.push(...financialResult.redactedFields);
      riskScore += financialResult.riskScore;

      // Step 3: Remove company proprietary information
      const proprietaryResult = this.sanitizeProprietaryData(
        sanitizedData,
        sanitizedText,
        config
      );
      sanitizedData = proprietaryResult.data;
      sanitizedText = proprietaryResult.text;
      redactedFields.push(...proprietaryResult.redactedFields);
      riskScore += proprietaryResult.riskScore;

      // Step 4: Apply tenant-specific sanitization
      if (config.tenantId) {
        const tenantResult = this.sanitizeTenantData(
          sanitizedData,
          sanitizedText,
          config.tenantId
        );
        sanitizedData = tenantResult.data;
        sanitizedText = tenantResult.text;
        redactedFields.push(...tenantResult.redactedFields);
        riskScore += tenantResult.riskScore;
      }

      // Step 5: Anonymize remaining identifiable data
      if (config.level !== 'basic') {
        const anonymizationResult = this.anonymizeIdentifiableData(
          sanitizedData,
          sanitizedText,
          config
        );
        sanitizedData = anonymizationResult.data;
        sanitizedText = anonymizationResult.text;
        anonymizedFields.push(...anonymizationResult.anonymizedFields);
      }

      // Step 6: Apply level-specific additional sanitization
      switch (config.level) {
        case 'strict':
          sanitizedData = this.applyStrictSanitization(sanitizedData);
          break;
        case 'maximum':
          sanitizedData = this.applyMaximumSanitization(sanitizedData);
          sanitizedText = this.applyMaximumTextSanitization(sanitizedText);
          break;
      }

      const sanitizedSize =
        JSON.stringify(sanitizedData).length + sanitizedText.length;
      const safe = riskScore < this.getRiskThreshold(config.level);

      return {
        sanitizedData,
        sanitizedText,
        redactedFields: [...new Set(redactedFields)],
        anonymizedFields: [...new Set(anonymizedFields)],
        riskScore,
        safe,
        metadata: {
          originalSize,
          sanitizedSize,
          redactionCount: redactedFields.length,
          anonymizationCount: anonymizedFields.length,
        },
      };
    } catch (error) {
      console.error('Data sanitization error:', error);

      // Return heavily sanitized version as fallback
      return {
        sanitizedData: this.emergencySanitization(data),
        sanitizedText: '[SANITIZATION_ERROR_CONTENT_REDACTED]',
        redactedFields: ['*ALL*'],
        anonymizedFields: [],
        riskScore: 100,
        safe: false,
        metadata: {
          originalSize,
          sanitizedSize: 0,
          redactionCount: 1,
          anonymizationCount: 0,
        },
      };
    }
  }

  /**
   * Sanitize personal data (PII)
   */
  private sanitizePersonalData(
    data: any,
    text: string
  ): {
    data: any;
    text: string;
    redactedFields: string[];
    riskScore: number;
  } {
    const redactedFields: string[] = [];
    let riskScore = 0;

    // Personal data patterns
    const patterns = this.sensitivePatterns.get('personal') || [];

    // Sanitize text
    let sanitizedText = text;
    for (const pattern of patterns) {
      const matches = sanitizedText.match(pattern);
      if (matches) {
        sanitizedText = sanitizedText.replace(pattern, '[PII_REDACTED]');
        redactedFields.push('text_pii');
        riskScore += 10;
      }
    }

    // Sanitize data object
    const sanitizedData = this.sanitizeDataObject(
      data,
      patterns,
      'pii',
      redactedFields
    );

    return {
      data: sanitizedData,
      text: sanitizedText,
      redactedFields,
      riskScore,
    };
  }

  /**
   * Sanitize financial data
   */
  private sanitizeFinancialData(
    data: any,
    text: string
  ): {
    data: any;
    text: string;
    redactedFields: string[];
    riskScore: number;
  } {
    const redactedFields: string[] = [];
    let riskScore = 0;

    const patterns = this.sensitivePatterns.get('financial') || [];

    let sanitizedText = text;
    for (const pattern of patterns) {
      const matches = sanitizedText.match(pattern);
      if (matches) {
        sanitizedText = sanitizedText.replace(
          pattern,
          '[FINANCIAL_DATA_REDACTED]'
        );
        redactedFields.push('text_financial');
        riskScore += 20; // Financial data is higher risk
      }
    }

    const sanitizedData = this.sanitizeDataObject(
      data,
      patterns,
      'financial',
      redactedFields
    );

    // Additional financial field sanitization
    const financialFields = [
      'accountNumber',
      'account_number',
      'routingNumber',
      'routing_number',
      'cardNumber',
      'card_number',
      'bankAccount',
      'bank_account',
      'creditCard',
      'credit_card',
      'paymentMethod',
      'payment_method',
    ];

    for (const field of financialFields) {
      if (this.hasFieldRecursively(data, field)) {
        this.redactFieldRecursively(
          sanitizedData,
          field,
          '[FINANCIAL_REDACTED]'
        );
        redactedFields.push(`data.${field}`);
        riskScore += 15;
      }
    }

    return {
      data: sanitizedData,
      text: sanitizedText,
      redactedFields,
      riskScore,
    };
  }

  /**
   * Sanitize company proprietary data
   */
  private sanitizeProprietaryData(
    data: any,
    text: string,
    config: SanitizationConfig
  ): {
    data: any;
    text: string;
    redactedFields: string[];
    riskScore: number;
  } {
    const redactedFields: string[] = [];
    let riskScore = 0;

    // Company-specific patterns
    const companyPatterns = this.companySpecificPatterns.get('fleetflow') || [];

    let sanitizedText = text;
    for (const pattern of companyPatterns) {
      const matches = sanitizedText.match(pattern);
      if (matches) {
        sanitizedText = sanitizedText.replace(
          pattern,
          '[COMPANY_DATA_REDACTED]'
        );
        redactedFields.push('text_proprietary');
        riskScore += 15;
      }
    }

    // Proprietary data fields
    const proprietaryFields = [
      'apiKey',
      'api_key',
      'secretKey',
      'secret_key',
      'privateKey',
      'private_key',
      'accessToken',
      'access_token',
      'password',
      'passwd',
      'credentials',
      'auth',
      'internalRate',
      'internal_rate',
      'costStructure',
      'cost_structure',
      'profitMargin',
      'profit_margin',
      'competitorInfo',
      'competitor_info',
    ];

    const sanitizedData = { ...data };
    for (const field of proprietaryFields) {
      if (this.hasFieldRecursively(sanitizedData, field)) {
        this.redactFieldRecursively(
          sanitizedData,
          field,
          '[PROPRIETARY_REDACTED]'
        );
        redactedFields.push(`data.${field}`);
        riskScore += 25; // High risk for proprietary data
      }
    }

    return {
      data: sanitizedData,
      text: sanitizedText,
      redactedFields,
      riskScore,
    };
  }

  /**
   * Sanitize tenant-specific data
   */
  private sanitizeTenantData(
    data: any,
    text: string,
    tenantId: string
  ): {
    data: any;
    text: string;
    redactedFields: string[];
    riskScore: number;
  } {
    const redactedFields: string[] = [];
    let riskScore = 0;
    const sanitizedData = { ...data };

    // Check for cross-tenant data leakage
    if (this.detectCrossTenantData(data, text, tenantId)) {
      // Remove any data that doesn't belong to the current tenant
      const cleanedResult = this.removeCrossTenantData(
        sanitizedData,
        text,
        tenantId
      );
      redactedFields.push(...cleanedResult.redactedFields);
      riskScore += 50; // Very high risk for cross-tenant data

      return {
        data: cleanedResult.data,
        text: cleanedResult.text,
        redactedFields,
        riskScore,
      };
    }

    return {
      data: sanitizedData,
      text,
      redactedFields,
      riskScore,
    };
  }

  /**
   * Anonymize identifiable data while preserving analytical value
   */
  private anonymizeIdentifiableData(
    data: any,
    text: string,
    config: SanitizationConfig
  ): {
    data: any;
    text: string;
    anonymizedFields: string[];
  } {
    const anonymizedFields: string[] = [];
    const sanitizedData = this.deepClone(data);
    let sanitizedText = text;

    // Anonymize names while preserving structure
    if (config.preserveStructure) {
      // Replace names with consistent anonymized versions
      const namePatterns = [
        /\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, // Full names
        /\b[A-Z][a-z]+(?= Company| Corp| LLC| Inc)\b/g, // Company names
      ];

      for (const pattern of namePatterns) {
        sanitizedText = sanitizedText.replace(pattern, (match) => {
          return this.generateConsistentAnonymization(match, 'name');
        });
        anonymizedFields.push('text_names');
      }

      // Anonymize data object names
      this.anonymizeNamesInData(sanitizedData, anonymizedFields);
    }

    // Anonymize locations to regions
    sanitizedText = this.anonymizeLocations(sanitizedText);
    this.anonymizeLocationsInData(sanitizedData, anonymizedFields);

    // Anonymize dates to relative periods
    sanitizedText = this.anonymizeDates(sanitizedText);
    this.anonymizeDatesInData(sanitizedData, anonymizedFields);

    return {
      data: sanitizedData,
      text: sanitizedText,
      anonymizedFields,
    };
  }

  /**
   * Initialize sensitive data patterns
   */
  private initializeSensitivePatterns(): void {
    this.sensitivePatterns.set('personal', [
      /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
      /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g, // Phone numbers
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, // Email addresses
      /\b\d{1,5}\s+\w+\s+(St|Ave|Rd|Dr|Ln|Blvd|Way)\.?\s*,?\s*\w+\s*,?\s*[A-Z]{2}\s+\d{5}(-\d{4})?\b/gi, // Addresses
      /\b(?:Date of Birth|DOB|Birthday):\s*\d{1,2}\/\d{1,2}\/\d{4}\b/gi, // Date of birth
    ]);

    this.sensitivePatterns.set('financial', [
      /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, // Credit card numbers
      /\b\d{9}\b/g, // Routing numbers
      /\bAccount\s*#?\s*:?\s*\d{4,}\b/gi, // Account numbers
      /\$[\d,]+\.?\d*/g, // Dollar amounts (when context suggests sensitive)
      /\b(?:EIN|Tax ID):\s*\d{2}-\d{7}\b/gi, // Tax ID numbers
    ]);

    this.sensitivePatterns.set('technical', [
      /\b[A-Za-z0-9]{32,}\b/g, // API keys and tokens
      /password\s*[:=]\s*['"]?[^'"\s]+['"]?/gi, // Passwords
      /\b(?:secret|key|token)\s*[:=]\s*['"]?[^'"\s]+['"]?/gi, // Secrets
      /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
    ]);
  }

  /**
   * Initialize company-specific patterns
   */
  private initializeCompanyPatterns(): void {
    this.companySpecificPatterns.set('fleetflow', [
      /FleetFlow\s+internal\s+rate/gi,
      /proprietary\s+pricing/gi,
      /internal\s+cost\s+structure/gi,
      /competitor\s+analysis/gi,
      /confidential\s+client\s+list/gi,
    ]);
  }

  /**
   * Sanitize data object recursively
   */
  private sanitizeDataObject(
    obj: any,
    patterns: RegExp[],
    redactionType: string,
    redactedFields: string[],
    path: string = 'data'
  ): any {
    if (!obj || typeof obj !== 'object') return obj;

    const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

    for (const key in sanitized) {
      const currentPath = `${path}.${key}`;

      if (typeof sanitized[key] === 'string') {
        let modified = false;
        for (const pattern of patterns) {
          if (pattern.test(sanitized[key])) {
            sanitized[key] = sanitized[key].replace(
              pattern,
              `[${redactionType.toUpperCase()}_REDACTED]`
            );
            modified = true;
          }
        }
        if (modified) {
          redactedFields.push(currentPath);
        }
      } else if (
        typeof sanitized[key] === 'object' &&
        sanitized[key] !== null
      ) {
        sanitized[key] = this.sanitizeDataObject(
          sanitized[key],
          patterns,
          redactionType,
          redactedFields,
          currentPath
        );
      }
    }

    return sanitized;
  }

  /**
   * Check if field exists recursively
   */
  private hasFieldRecursively(obj: any, fieldName: string): boolean {
    if (!obj || typeof obj !== 'object') return false;

    if (obj.hasOwnProperty(fieldName)) return true;

    for (const key in obj) {
      if (
        typeof obj[key] === 'object' &&
        this.hasFieldRecursively(obj[key], fieldName)
      ) {
        return true;
      }
    }

    return false;
  }

  /**
   * Redact field recursively
   */
  private redactFieldRecursively(
    obj: any,
    fieldName: string,
    replacement: string
  ): void {
    if (!obj || typeof obj !== 'object') return;

    if (obj.hasOwnProperty(fieldName)) {
      obj[fieldName] = replacement;
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.redactFieldRecursively(obj[key], fieldName, replacement);
      }
    }
  }

  /**
   * Deep clone object
   */
  private deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map((item) => this.deepClone(item));

    const cloned: any = {};
    for (const key in obj) {
      cloned[key] = this.deepClone(obj[key]);
    }
    return cloned;
  }

  /**
   * Detect cross-tenant data
   */
  private detectCrossTenantData(
    data: any,
    text: string,
    currentTenantId: string
  ): boolean {
    const crossTenantIndicators = [
      /other\s+(tenant|company|customer)/i,
      /tenant\s*id\s*[:=]\s*['"]?(?!${currentTenantId})[^'"\s]+/i,
      /company\s*id\s*[:=]\s*['"]?(?!${currentTenantId})[^'"\s]+/i,
    ];

    const fullContent = `${text} ${JSON.stringify(data)}`;
    return crossTenantIndicators.some((pattern) => pattern.test(fullContent));
  }

  /**
   * Remove cross-tenant data
   */
  private removeCrossTenantData(
    data: any,
    text: string,
    tenantId: string
  ): {
    data: any;
    text: string;
    redactedFields: string[];
  } {
    const redactedFields: string[] = [];

    // Heavily sanitize any data that might contain cross-tenant information
    const sanitizedData = this.emergencySanitization(data);
    const sanitizedText = '[CROSS_TENANT_DATA_DETECTED_CONTENT_REDACTED]';

    redactedFields.push('*CROSS_TENANT_VIOLATION*');

    return { data: sanitizedData, text: sanitizedText, redactedFields };
  }

  /**
   * Emergency sanitization - removes almost everything
   */
  private emergencySanitization(data: any): any {
    if (!data || typeof data !== 'object') return '[REDACTED]';

    const safe: any = {};
    const allowedFields = ['id', 'type', 'status', 'created_at', 'updated_at'];

    for (const field of allowedFields) {
      if (data[field]) {
        safe[field] = data[field];
      }
    }

    return safe;
  }

  /**
   * Generate consistent anonymization
   */
  private generateConsistentAnonymization(
    original: string,
    type: string
  ): string {
    // Use a hash of the original to generate consistent anonymized versions
    let hash = 0;
    for (let i = 0; i < original.length; i++) {
      const char = original.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    const anonymizedVersions = {
      name: ['John Doe', 'Jane Smith', 'Robert Johnson', 'Mary Williams'],
      company: ['Alpha Corp', 'Beta Inc', 'Gamma LLC', 'Delta Systems'],
    };

    const options = anonymizedVersions[
      type as keyof typeof anonymizedVersions
    ] || ['Anonymous'];
    return options[Math.abs(hash) % options.length];
  }

  /**
   * Various helper methods for anonymization
   */
  private anonymizeNamesInData(data: any, anonymizedFields: string[]): void {
    const nameFields = [
      'name',
      'firstName',
      'lastName',
      'customerName',
      'driverName',
    ];

    for (const field of nameFields) {
      if (this.hasFieldRecursively(data, field)) {
        this.anonymizeFieldRecursively(data, field, 'name');
        anonymizedFields.push(`data.${field}`);
      }
    }
  }

  private anonymizeLocations(text: string): string {
    // Convert specific locations to regions
    const locationMappings: { [key: string]: string } = {
      'New York, NY': 'Northeast Region',
      'Los Angeles, CA': 'West Coast Region',
      'Chicago, IL': 'Midwest Region',
      'Houston, TX': 'South Central Region',
      'Miami, FL': 'Southeast Region',
    };

    let result = text;
    for (const [location, region] of Object.entries(locationMappings)) {
      result = result.replace(new RegExp(location, 'gi'), region);
    }

    return result;
  }

  private anonymizeLocationsInData(
    data: any,
    anonymizedFields: string[]
  ): void {
    const locationFields = [
      'city',
      'state',
      'address',
      'location',
      'origin',
      'destination',
    ];

    for (const field of locationFields) {
      if (this.hasFieldRecursively(data, field)) {
        this.anonymizeFieldRecursively(data, field, 'location');
        anonymizedFields.push(`data.${field}`);
      }
    }
  }

  private anonymizeDates(text: string): string {
    // Convert specific dates to relative periods
    const datePattern = /\b\d{1,2}\/\d{1,2}\/\d{4}\b/g;
    return text.replace(datePattern, '[RECENT_DATE]');
  }

  private anonymizeDatesInData(data: any, anonymizedFields: string[]): void {
    // Anonymize date fields in data
    const dateFields = ['createdAt', 'updatedAt', 'birthDate', 'hireDate'];

    for (const field of dateFields) {
      if (this.hasFieldRecursively(data, field)) {
        this.anonymizeFieldRecursively(data, field, 'date');
        anonymizedFields.push(`data.${field}`);
      }
    }
  }

  private anonymizeFieldRecursively(
    obj: any,
    fieldName: string,
    type: string
  ): void {
    if (!obj || typeof obj !== 'object') return;

    if (obj.hasOwnProperty(fieldName)) {
      obj[fieldName] = this.generateConsistentAnonymization(
        String(obj[fieldName]),
        type
      );
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.anonymizeFieldRecursively(obj[key], fieldName, type);
      }
    }
  }

  private applyStrictSanitization(data: any): any {
    // Remove additional potentially sensitive fields
    const strictFields = [
      'internal',
      'private',
      'confidential',
      'secret',
      'revenue',
      'cost',
      'profit',
      'margin',
      'pricing',
    ];

    const sanitized = this.deepClone(data);

    for (const field of strictFields) {
      this.redactFieldRecursively(sanitized, field, '[STRICT_MODE_REDACTED]');
    }

    return sanitized;
  }

  private applyMaximumSanitization(data: any): any {
    // Keep only essential operational fields
    const allowedFields = ['id', 'type', 'status', 'timestamp'];

    if (!data || typeof data !== 'object') return '[MAX_SANITIZATION]';

    const minimal: any = {};
    for (const field of allowedFields) {
      if (data[field]) {
        minimal[field] = data[field];
      }
    }

    return minimal;
  }

  private applyMaximumTextSanitization(text: string): string {
    // Remove most content, keep only essential operational information
    if (text.length > 100) {
      return '[MAXIMUM_SANITIZATION_APPLIED_CONTENT_HEAVILY_REDACTED]';
    }
    return '[SANITIZED]';
  }

  private getRiskThreshold(level: string): number {
    const thresholds = {
      basic: 80,
      standard: 60,
      strict: 40,
      maximum: 20,
    };
    return thresholds[level as keyof typeof thresholds] || 60;
  }
}

// Export singleton instance
export const aiDataSanitizer = new AIDataSanitizer();
