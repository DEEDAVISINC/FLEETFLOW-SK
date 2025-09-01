/**
 * AI Response Filter
 * Filters and sanitizes AI-generated responses to prevent sensitive data exposure
 * Ensures all AI outputs are safe for the intended audience
 */

export interface ResponseFilterConfig {
  userRole: string;
  tenantId?: string;
  dataAccessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  context: 'customer_facing' | 'internal' | 'admin' | 'debug';
  complianceRequirements: string[]; // e.g., ['GDPR', 'HIPAA', 'PCI']
  filterLevel: 'basic' | 'standard' | 'strict' | 'maximum';
}

export interface FilteringResult {
  filteredResponse: string;
  originalLength: number;
  filteredLength: number;
  censorsApplied: string[];
  sensitiveDataRemoved: string[];
  complianceViolations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  safe: boolean;
  warnings: string[];
}

export interface SensitivePattern {
  name: string;
  pattern: RegExp;
  replacement: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'pii' | 'financial' | 'proprietary' | 'security' | 'medical';
  complianceRelevant: string[]; // Which compliance frameworks care about this
}

export class AIResponseFilter {
  private sensitivePatterns: SensitivePattern[] = [];
  private roleBasedFilters: Map<string, RegExp[]> = new Map();
  private contextFilters: Map<string, RegExp[]> = new Map();
  private complianceFilters: Map<string, RegExp[]> = new Map();
  private emergencyPatterns: RegExp[] = [];

  constructor() {
    this.initializeSensitivePatterns();
    this.initializeRoleBasedFilters();
    this.initializeContextFilters();
    this.initializeComplianceFilters();
    this.initializeEmergencyPatterns();
  }

  /**
   * Main filtering method - sanitizes AI responses based on context and user permissions
   */
  filterResponse(
    response: string,
    config: ResponseFilterConfig
  ): FilteringResult {
    const originalLength = response.length;
    let filteredResponse = response;
    const censorsApplied: string[] = [];
    const sensitiveDataRemoved: string[] = [];
    const complianceViolations: string[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let safe = true;

    try {
      // Step 1: Emergency filtering - always applied first
      const emergencyResult = this.applyEmergencyFiltering(filteredResponse);
      filteredResponse = emergencyResult.response;
      if (emergencyResult.violations.length > 0) {
        safe = false;
        riskLevel = 'critical';
        censorsApplied.push(...emergencyResult.violations);
      }

      // Step 2: Apply sensitive data pattern filtering
      const patternResult = this.applySensitivePatternFiltering(
        filteredResponse,
        config
      );
      filteredResponse = patternResult.response;
      sensitiveDataRemoved.push(...patternResult.removedItems);
      censorsApplied.push(...patternResult.censorsApplied);
      if (
        patternResult.riskLevel === 'critical' ||
        patternResult.riskLevel === 'high'
      ) {
        riskLevel = patternResult.riskLevel;
        if (patternResult.riskLevel === 'critical') safe = false;
      }

      // Step 3: Apply role-based filtering
      const roleResult = this.applyRoleBasedFiltering(
        filteredResponse,
        config.userRole
      );
      filteredResponse = roleResult.response;
      censorsApplied.push(...roleResult.censorsApplied);

      // Step 4: Apply context-based filtering
      const contextResult = this.applyContextFiltering(
        filteredResponse,
        config.context
      );
      filteredResponse = contextResult.response;
      censorsApplied.push(...contextResult.censorsApplied);

      // Step 5: Apply compliance filtering
      const complianceResult = this.applyComplianceFiltering(
        filteredResponse,
        config.complianceRequirements
      );
      filteredResponse = complianceResult.response;
      complianceViolations.push(...complianceResult.violations);
      censorsApplied.push(...complianceResult.censorsApplied);

      // Step 6: Apply data access level filtering
      const accessLevelResult = this.applyDataAccessLevelFiltering(
        filteredResponse,
        config.dataAccessLevel
      );
      filteredResponse = accessLevelResult.response;
      censorsApplied.push(...accessLevelResult.censorsApplied);

      // Step 7: Apply filter level intensity
      const filterLevelResult = this.applyFilterLevelProcessing(
        filteredResponse,
        config.filterLevel
      );
      filteredResponse = filterLevelResult.response;
      censorsApplied.push(...filterLevelResult.censorsApplied);

      // Step 8: Final safety checks
      const finalSafetyCheck = this.performFinalSafetyCheck(filteredResponse);
      if (!finalSafetyCheck.safe) {
        safe = false;
        riskLevel = 'critical';
        warnings.push(...finalSafetyCheck.warnings);
        filteredResponse = this.createSafeErrorResponse(config.context);
      }

      // Step 9: Add warnings if significant content was removed
      const reductionPercentage =
        ((originalLength - filteredResponse.length) / originalLength) * 100;
      if (reductionPercentage > 50) {
        warnings.push(
          'Significant content filtering applied - response may be incomplete'
        );
      }

      return {
        filteredResponse,
        originalLength,
        filteredLength: filteredResponse.length,
        censorsApplied: [...new Set(censorsApplied)],
        sensitiveDataRemoved: [...new Set(sensitiveDataRemoved)],
        complianceViolations,
        riskLevel,
        safe,
        warnings,
      };
    } catch (error) {
      console.error('AI Response filtering error:', error);

      // Emergency fallback - return safe generic response
      return {
        filteredResponse: this.createSafeErrorResponse(config.context),
        originalLength,
        filteredLength: 0,
        censorsApplied: ['EMERGENCY_FILTER'],
        sensitiveDataRemoved: ['ALL_CONTENT'],
        complianceViolations: ['FILTERING_ERROR'],
        riskLevel: 'critical',
        safe: false,
        warnings: [
          'Response filtering encountered an error - safe fallback applied',
        ],
      };
    }
  }

  /**
   * Initialize sensitive data patterns
   */
  private initializeSensitivePatterns(): void {
    this.sensitivePatterns = [
      // Personal Identifiable Information
      {
        name: 'SSN',
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        replacement: '[SSN_REDACTED]',
        severity: 'critical',
        category: 'pii',
        complianceRelevant: ['GDPR', 'CCPA', 'PIPEDA'],
      },
      {
        name: 'Credit Card',
        pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
        replacement: '[CREDIT_CARD_REDACTED]',
        severity: 'critical',
        category: 'financial',
        complianceRelevant: ['PCI_DSS', 'GDPR'],
      },
      {
        name: 'Phone Number',
        pattern: /\b\d{3}[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
        replacement: '[PHONE_REDACTED]',
        severity: 'medium',
        category: 'pii',
        complianceRelevant: ['GDPR', 'CCPA', 'TCPA'],
      },
      {
        name: 'Email Address',
        pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        replacement: '[EMAIL_REDACTED]',
        severity: 'medium',
        category: 'pii',
        complianceRelevant: ['GDPR', 'CAN_SPAM'],
      },
      {
        name: 'Street Address',
        pattern:
          /\b\d{1,5}\s+\w+\s+(St|Ave|Rd|Dr|Ln|Blvd|Way)\.?\s*,?\s*\w+\s*,?\s*[A-Z]{2}\s+\d{5}(-\d{4})?\b/gi,
        replacement: '[ADDRESS_REDACTED]',
        severity: 'high',
        category: 'pii',
        complianceRelevant: ['GDPR', 'CCPA'],
      },

      // Financial Information
      {
        name: 'Bank Account',
        pattern: /\b(?:Account|Acct)\s*#?\s*:?\s*\d{4,17}\b/gi,
        replacement: '[ACCOUNT_NUMBER_REDACTED]',
        severity: 'critical',
        category: 'financial',
        complianceRelevant: ['PCI_DSS', 'GLBA', 'GDPR'],
      },
      {
        name: 'Routing Number',
        pattern: /\b\d{9}\b/g,
        replacement: '[ROUTING_NUMBER_REDACTED]',
        severity: 'critical',
        category: 'financial',
        complianceRelevant: ['GLBA', 'PCI_DSS'],
      },
      {
        name: 'Tax ID',
        pattern: /\b(?:EIN|Tax ID):\s*\d{2}-\d{7}\b/gi,
        replacement: '[TAX_ID_REDACTED]',
        severity: 'high',
        category: 'financial',
        complianceRelevant: ['IRS', 'GDPR'],
      },

      // Medical Information
      {
        name: 'Medical Record Number',
        pattern: /\b(?:MRN|Medical Record):\s*\d+\b/gi,
        replacement: '[MEDICAL_RECORD_REDACTED]',
        severity: 'critical',
        category: 'medical',
        complianceRelevant: ['HIPAA', 'GDPR'],
      },

      // Security Information
      {
        name: 'API Key',
        pattern: /\b[A-Za-z0-9]{32,}\b/g,
        replacement: '[API_KEY_REDACTED]',
        severity: 'critical',
        category: 'security',
        complianceRelevant: ['SECURITY'],
      },
      {
        name: 'Password',
        pattern: /(?:password|pwd|pass)\s*[:=]\s*['"]?([^'"\s]+)['"]?/gi,
        replacement: 'password: [PASSWORD_REDACTED]',
        severity: 'critical',
        category: 'security',
        complianceRelevant: ['SECURITY'],
      },
      {
        name: 'JWT Token',
        pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
        replacement: '[JWT_TOKEN_REDACTED]',
        severity: 'critical',
        category: 'security',
        complianceRelevant: ['SECURITY'],
      },

      // Proprietary Information
      {
        name: 'Internal Rate',
        pattern:
          /(?:internal|proprietary|confidential)\s+rate\s*[:=]?\s*\$?[\d,]+\.?\d*/gi,
        replacement: '[PROPRIETARY_RATE_REDACTED]',
        severity: 'high',
        category: 'proprietary',
        complianceRelevant: ['TRADE_SECRET'],
      },
      {
        name: 'Competitor Information',
        pattern: /competitor\s+(?:analysis|data|information|rates?|pricing)/gi,
        replacement: '[COMPETITIVE_INFO_REDACTED]',
        severity: 'high',
        category: 'proprietary',
        complianceRelevant: ['TRADE_SECRET'],
      },

      // IP Addresses
      {
        name: 'IP Address',
        pattern: /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g,
        replacement: '[IP_ADDRESS_REDACTED]',
        severity: 'medium',
        category: 'security',
        complianceRelevant: ['GDPR', 'SECURITY'],
      },
    ];
  }

  /**
   * Initialize role-based filters
   */
  private initializeRoleBasedFilters(): void {
    // Driver role - remove management information
    this.roleBasedFilters.set('driver', [
      /(?:management|executive|profit|revenue|cost)\s+(?:meeting|decision|strategy|analysis)/gi,
      /internal\s+(?:memo|communication|discussion)/gi,
      /(?:salary|wage|compensation)\s+(?:information|data|details)/gi,
    ]);

    // Dispatcher role - remove financial specifics
    this.roleBasedFilters.set('dispatcher', [
      /(?:profit\s+margin|cost\s+structure|pricing\s+strategy)/gi,
      /(?:executive|board|management)\s+(?:decision|meeting|strategy)/gi,
    ]);

    // Broker role - remove internal operational details
    this.roleBasedFilters.set('broker', [
      /internal\s+(?:cost|rate|margin)/gi,
      /(?:carrier|driver)\s+(?:personal|private)\s+information/gi,
    ]);

    // Manager role - minimal filtering
    this.roleBasedFilters.set('manager', [
      /(?:system\s+password|api\s+key|secret\s+token)/gi,
    ]);

    // Admin role - no additional filtering
    this.roleBasedFilters.set('admin', []);
  }

  /**
   * Initialize context-based filters
   */
  private initializeContextFilters(): void {
    // Customer-facing responses
    this.contextFilters.set('customer_facing', [
      /internal\s+(?:discussion|meeting|memo|communication)/gi,
      /(?:confidential|proprietary|trade\s+secret)/gi,
      /employee\s+(?:personal|private)\s+information/gi,
      /(?:cost|expense|margin|profit)\s+(?:structure|breakdown|analysis)/gi,
      /competitor\s+(?:analysis|intelligence|data)/gi,
    ]);

    // Internal responses
    this.contextFilters.set('internal', [
      /(?:customer|client)\s+(?:personal|private|confidential)\s+information/gi,
      /(?:password|api\s+key|secret|token)/gi,
    ]);

    // Admin responses
    this.contextFilters.set('admin', [
      // Minimal filtering for admin context
    ]);

    // Debug responses
    this.contextFilters.set('debug', [
      /(?:production\s+password|live\s+api\s+key)/gi,
    ]);
  }

  /**
   * Initialize compliance-specific filters
   */
  private initializeComplianceFilters(): void {
    // GDPR filters
    this.complianceFilters.set('GDPR', [
      /(?:personal\s+data|personally\s+identifiable)/gi,
      /(?:data\s+subject|individual\s+rights)/gi,
    ]);

    // HIPAA filters
    this.complianceFilters.set('HIPAA', [
      /(?:protected\s+health\s+information|phi)/gi,
      /(?:medical\s+record|health\s+data)/gi,
    ]);

    // PCI DSS filters
    this.complianceFilters.set('PCI_DSS', [
      /(?:cardholder\s+data|payment\s+card)/gi,
      /(?:cvv|security\s+code)/gi,
    ]);

    // SOX filters
    this.complianceFilters.set('SOX', [
      /(?:financial\s+control|internal\s+control)/gi,
      /(?:audit\s+trail|compliance\s+documentation)/gi,
    ]);
  }

  /**
   * Initialize emergency patterns (always blocked)
   */
  private initializeEmergencyPatterns(): void {
    this.emergencyPatterns = [
      // Explicit attempts to bypass security
      /ignore\s+(?:all|previous|security)\s+(?:instructions|rules|filters)/gi,
      /bypass\s+(?:security|filter|protection)/gi,
      /reveal\s+(?:sensitive|confidential|secret)\s+(?:data|information)/gi,

      // Attempts to access system information
      /show\s+(?:system|database|server)\s+(?:password|credentials|access)/gi,
      /display\s+(?:all|every)\s+(?:user|customer|tenant)\s+data/gi,

      // Data exfiltration attempts
      /export\s+(?:all|complete)\s+(?:database|customer\s+list|user\s+data)/gi,
      /download\s+(?:sensitive|confidential|private)\s+(?:data|files|information)/gi,

      // Competitive intelligence attempts
      /list\s+(?:all|every)\s+competitor/gi,
      /show\s+(?:competitor|rival)\s+(?:rates|pricing|strategies)/gi,
    ];
  }

  /**
   * Apply emergency filtering (highest priority)
   */
  private applyEmergencyFiltering(response: string): {
    response: string;
    violations: string[];
  } {
    const violations: string[] = [];
    let filteredResponse = response;

    for (const pattern of this.emergencyPatterns) {
      if (pattern.test(response)) {
        violations.push('EMERGENCY_PATTERN_DETECTED');
        filteredResponse = filteredResponse.replace(
          pattern,
          '[SECURITY_VIOLATION_CONTENT_BLOCKED]'
        );
      }
    }

    return { response: filteredResponse, violations };
  }

  /**
   * Apply sensitive pattern filtering
   */
  private applySensitivePatternFiltering(
    response: string,
    config: ResponseFilterConfig
  ): {
    response: string;
    removedItems: string[];
    censorsApplied: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  } {
    let filteredResponse = response;
    const removedItems: string[] = [];
    const censorsApplied: string[] = [];
    let highestRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    for (const pattern of this.sensitivePatterns) {
      // Check if pattern is relevant for this compliance context
      const isRelevant =
        config.complianceRequirements.some((req) =>
          pattern.complianceRelevant.includes(req)
        ) || pattern.complianceRelevant.includes('SECURITY');

      if (isRelevant && pattern.pattern.test(filteredResponse)) {
        const matches = filteredResponse.match(pattern.pattern) || [];
        filteredResponse = filteredResponse.replace(
          pattern.pattern,
          pattern.replacement
        );

        removedItems.push(...matches);
        censorsApplied.push(pattern.name);

        // Update risk level
        if (this.isHigherRiskLevel(pattern.severity, highestRiskLevel)) {
          highestRiskLevel = pattern.severity;
        }
      }
    }

    return {
      response: filteredResponse,
      removedItems,
      censorsApplied,
      riskLevel: highestRiskLevel,
    };
  }

  /**
   * Apply role-based filtering
   */
  private applyRoleBasedFiltering(
    response: string,
    userRole: string
  ): {
    response: string;
    censorsApplied: string[];
  } {
    const roleFilters = this.roleBasedFilters.get(userRole) || [];
    let filteredResponse = response;
    const censorsApplied: string[] = [];

    for (const filter of roleFilters) {
      if (filter.test(filteredResponse)) {
        filteredResponse = filteredResponse.replace(
          filter,
          '[ROLE_RESTRICTED_CONTENT]'
        );
        censorsApplied.push(`ROLE_FILTER_${userRole.toUpperCase()}`);
      }
    }

    return { response: filteredResponse, censorsApplied };
  }

  /**
   * Apply context-based filtering
   */
  private applyContextFiltering(
    response: string,
    context: string
  ): {
    response: string;
    censorsApplied: string[];
  } {
    const contextFilters = this.contextFilters.get(context) || [];
    let filteredResponse = response;
    const censorsApplied: string[] = [];

    for (const filter of contextFilters) {
      if (filter.test(filteredResponse)) {
        filteredResponse = filteredResponse.replace(
          filter,
          '[CONTEXT_RESTRICTED_CONTENT]'
        );
        censorsApplied.push(`CONTEXT_FILTER_${context.toUpperCase()}`);
      }
    }

    return { response: filteredResponse, censorsApplied };
  }

  /**
   * Apply compliance filtering
   */
  private applyComplianceFiltering(
    response: string,
    requirements: string[]
  ): {
    response: string;
    violations: string[];
    censorsApplied: string[];
  } {
    let filteredResponse = response;
    const violations: string[] = [];
    const censorsApplied: string[] = [];

    for (const requirement of requirements) {
      const filters = this.complianceFilters.get(requirement) || [];

      for (const filter of filters) {
        if (filter.test(filteredResponse)) {
          violations.push(`${requirement}_VIOLATION`);
          filteredResponse = filteredResponse.replace(
            filter,
            `[${requirement}_RESTRICTED_CONTENT]`
          );
          censorsApplied.push(`COMPLIANCE_FILTER_${requirement}`);
        }
      }
    }

    return { response: filteredResponse, violations, censorsApplied };
  }

  /**
   * Apply data access level filtering
   */
  private applyDataAccessLevelFiltering(
    response: string,
    dataAccessLevel: string
  ): {
    response: string;
    censorsApplied: string[];
  } {
    let filteredResponse = response;
    const censorsApplied: string[] = [];

    switch (dataAccessLevel) {
      case 'public':
        // Remove anything marked as internal, confidential, or restricted
        if (/(?:internal|confidential|restricted)/gi.test(filteredResponse)) {
          filteredResponse = filteredResponse.replace(
            /(?:internal|confidential|restricted)[^.!?]*[.!?]/gi,
            '[DATA_ACCESS_RESTRICTED]'
          );
          censorsApplied.push('PUBLIC_ACCESS_FILTER');
        }
        break;

      case 'internal':
        // Remove confidential and restricted content
        if (/(?:confidential|restricted)/gi.test(filteredResponse)) {
          filteredResponse = filteredResponse.replace(
            /(?:confidential|restricted)[^.!?]*[.!?]/gi,
            '[DATA_ACCESS_RESTRICTED]'
          );
          censorsApplied.push('INTERNAL_ACCESS_FILTER');
        }
        break;

      case 'confidential':
        // Remove only restricted content
        if (/restricted/gi.test(filteredResponse)) {
          filteredResponse = filteredResponse.replace(
            /restricted[^.!?]*[.!?]/gi,
            '[DATA_ACCESS_RESTRICTED]'
          );
          censorsApplied.push('CONFIDENTIAL_ACCESS_FILTER');
        }
        break;

      case 'restricted':
        // No additional filtering for restricted access
        break;
    }

    return { response: filteredResponse, censorsApplied };
  }

  /**
   * Apply filter level intensity
   */
  private applyFilterLevelProcessing(
    response: string,
    filterLevel: string
  ): {
    response: string;
    censorsApplied: string[];
  } {
    let filteredResponse = response;
    const censorsApplied: string[] = [];

    switch (filterLevel) {
      case 'maximum':
        // Aggressive filtering - remove any potentially sensitive content
        const aggressivePatterns = [
          /\$[\d,]+\.?\d*/g, // Any dollar amounts
          /\b\d{4,}\b/g, // Any 4+ digit numbers (could be IDs, account numbers)
          /\b[A-Z]{2,}\s+[A-Z]{2,}\b/g, // All caps words (could be codes, acronyms)
        ];

        for (const pattern of aggressivePatterns) {
          if (pattern.test(filteredResponse)) {
            filteredResponse = filteredResponse.replace(pattern, '[FILTERED]');
            censorsApplied.push('MAXIMUM_FILTER_APPLIED');
          }
        }
        break;

      case 'strict':
        // Remove any numbers that could be sensitive
        if (/\b\d{6,}\b/g.test(filteredResponse)) {
          filteredResponse = filteredResponse.replace(
            /\b\d{6,}\b/g,
            '[NUMBER_FILTERED]'
          );
          censorsApplied.push('STRICT_NUMBER_FILTER');
        }
        break;

      case 'standard':
      case 'basic':
        // Standard filtering already applied above
        break;
    }

    return { response: filteredResponse, censorsApplied };
  }

  /**
   * Perform final safety check
   */
  private performFinalSafetyCheck(response: string): {
    safe: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let safe = true;

    // Check for any remaining sensitive patterns that might have been missed
    const finalCheckPatterns = [
      {
        pattern: /\b\d{3}-\d{2}-\d{4}\b/,
        warning: 'Possible SSN detected in final check',
      },
      {
        pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
        warning: 'Possible credit card detected in final check',
      },
      {
        pattern: /password\s*[:=]/i,
        warning: 'Password reference detected in final check',
      },
    ];

    for (const check of finalCheckPatterns) {
      if (check.pattern.test(response)) {
        warnings.push(check.warning);
        safe = false;
      }
    }

    // Check for excessively long responses that might contain dumps of sensitive data
    if (response.length > 10000) {
      warnings.push('Response is unusually long - potential data dump');
      safe = false;
    }

    return { safe, warnings };
  }

  /**
   * Create safe error response
   */
  private createSafeErrorResponse(context: string): string {
    const responses = {
      customer_facing:
        'I apologize, but I cannot provide that information at this time. Please contact our support team for assistance with your request.',
      internal:
        'The requested information contains sensitive data that cannot be displayed. Please contact your system administrator for access.',
      admin:
        'Security filters have blocked this response due to detected sensitive content. Review the audit logs for details.',
      debug:
        'Response blocked by security filters. Check filtering configuration and sensitive data patterns.',
    };

    return (
      responses[context as keyof typeof responses] || responses.customer_facing
    );
  }

  /**
   * Utility method to compare risk levels
   */
  private isHigherRiskLevel(level1: string, level2: string): boolean {
    const levels = ['low', 'medium', 'high', 'critical'];
    return levels.indexOf(level1) > levels.indexOf(level2);
  }

  /**
   * Public methods for configuration and testing
   */
  addCustomPattern(pattern: SensitivePattern): void {
    this.sensitivePatterns.push(pattern);
    console.info(`Added custom sensitive pattern: ${pattern.name}`);
  }

  testResponse(
    response: string,
    config: ResponseFilterConfig
  ): FilteringResult {
    return this.filterResponse(response, config);
  }

  getFilteringStatistics(): {
    totalPatterns: number;
    patternsByCategory: Record<string, number>;
    patternsBySeverity: Record<string, number>;
  } {
    const patternsByCategory: Record<string, number> = {};
    const patternsBySeverity: Record<string, number> = {};

    for (const pattern of this.sensitivePatterns) {
      patternsByCategory[pattern.category] =
        (patternsByCategory[pattern.category] || 0) + 1;
      patternsBySeverity[pattern.severity] =
        (patternsBySeverity[pattern.severity] || 0) + 1;
    }

    return {
      totalPatterns: this.sensitivePatterns.length,
      patternsByCategory,
      patternsBySeverity,
    };
  }
}

// Export singleton instance
export const aiResponseFilter = new AIResponseFilter();
