/**
 * AI Security Service
 *
 * Provides runtime safeguards against prompt injection, data leakage,
 * and unauthorized AI operations throughout the application.
 */

import { checkPermission, getCurrentUser } from '../config/access';

export interface AISecurityPolicy {
  id: string;
  name: string;
  description: string;
  allowedRoles: string[];
  allowedOperations: string[];
  dataAccessRestrictions: DataAccessRestriction[];
  promptValidationRules: PromptValidationRule[];
  maxTokenLimit?: number;
  auditLevel: 'none' | 'minimal' | 'standard' | 'verbose';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  enabled: boolean;
}

export interface DataAccessRestriction {
  dataType: string;
  accessLevel: 'none' | 'masked' | 'summary' | 'full';
  maskedFields?: string[];
}

export interface PromptValidationRule {
  type: 'regex' | 'keyword' | 'semantic';
  pattern?: string;
  keywords?: string[];
  description: string;
  severity: 'warning' | 'block';
}

export interface AIOperationRequest {
  operation: string;
  prompt: string;
  data?: any;
  metadata?: {
    source: string;
    purpose: string;
    userId?: string;
    sessionId?: string;
  };
}

export interface AIOperationResult {
  allowed: boolean;
  sanitizedPrompt?: string;
  sanitizedData?: any;
  warnings?: string[];
  blockReasons?: string[];
  auditId?: string;
}

export interface AISecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  operation: string;
  policyId: string;
  allowed: boolean;
  promptHash: string; // We hash the prompt rather than storing it directly
  dataTypesAccessed: string[];
  warnings: string[];
  blockReasons: string[];
  metadata?: any;
}

// Common sensitive data patterns
const SENSITIVE_DATA_PATTERNS = {
  SSN: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g,
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  API_KEY: /\b[A-Za-z0-9_-]{20,}\b/g,
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /\b\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  MC_NUMBER: /\bMC\s*\d{5,8}\b/gi,
  DOT_NUMBER: /\bDOT\s*\d{5,8}\b/gi,
  VIN: /\b[A-HJ-NPR-Z0-9]{17}\b/g,
};

// Prompt injection detection patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore previous instructions/i,
  /disregard (all|previous|above) instructions/i,
  /forget (all|your|previous) instructions/i,
  /override (all|previous|above) instructions/i,
  /new instructions:/i,
  /you are now/i,
  /from now on you are/i,
  /you will act as/i,
];

class AISecurityService {
  private policies: Map<string, AISecurityPolicy> = new Map();
  private auditLogs: AISecurityAuditLog[] = [];

  constructor() {
    this.initializeDefaultPolicies();
  }

  private initializeDefaultPolicies() {
    // Global policy for all AI operations across the application
    const globalPolicy: AISecurityPolicy = {
      id: 'policy_global_default',
      name: 'Global AI Security Policy',
      description:
        'Default security controls for all AI operations across FleetFlow',
      allowedRoles: ['admin', 'user', 'manager', 'developer', 'support'],
      allowedOperations: [
        'ai.*',
        'llm.*',
        'embedding.*',
        'vector.*',
        'analysis.*',
        'classification.*',
        'summarization.*',
        'generation.*',
        'translation.*',
        'chat.*',
      ],
      dataAccessRestrictions: [
        {
          dataType: 'user_details',
          accessLevel: 'masked',
          maskedFields: ['password', 'email', 'phone', 'address', 'ssn', 'dob'],
        },
        {
          dataType: 'payment_details',
          accessLevel: 'masked',
          maskedFields: [
            'cardNumber',
            'cvv',
            'bankAccountNumber',
            'routingNumber',
          ],
        },
        {
          dataType: 'company_details',
          accessLevel: 'full',
        },
        {
          dataType: 'system_details',
          accessLevel: 'summary',
        },
      ],
      promptValidationRules: [
        {
          type: 'regex',
          pattern: '(personal|private|confidential|internal|secret)',
          description:
            'Prevents inclusion of explicitly marked confidential information',
          severity: 'block',
        },
        {
          type: 'keyword',
          keywords: [
            'password',
            'secret',
            'token',
            'api key',
            'credentials',
            'auth',
            'key',
          ],
          description: 'Blocks sensitive authentication information',
          severity: 'block',
        },
        {
          type: 'regex',
          pattern: '\\b(?:[0-9]{16,19})\\b',
          description: 'Prevents potential credit card numbers',
          severity: 'block',
        },
      ],
      maxTokenLimit: 4000,
      auditLevel: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      enabled: true,
    };

    // Policy for BROKERSNAPSHOT integration
    const brokerSnapshotPolicy: AISecurityPolicy = {
      id: 'policy_brokersnapshot_default',
      name: 'BROKERSNAPSHOT Integration Security Policy',
      description:
        'Security controls for AI operations related to BROKERSNAPSHOT reviews',
      allowedRoles: ['admin', 'finance_manager', 'accounts_receivable'],
      allowedOperations: [
        'brokersnapshot.review.generate',
        'brokersnapshot.review.validate',
        'brokersnapshot.review.post',
      ],
      dataAccessRestrictions: [
        {
          dataType: 'payment_details',
          accessLevel: 'masked',
          maskedFields: ['bankAccountNumber', 'routingNumber', 'cardNumber'],
        },
        {
          dataType: 'carrier_details',
          accessLevel: 'full',
        },
        {
          dataType: 'user_details',
          accessLevel: 'masked',
          maskedFields: ['email', 'phone', 'address'],
        },
      ],
      promptValidationRules: [
        {
          type: 'regex',
          pattern: '(personal|private|confidential|internal)',
          description:
            'Prevents inclusion of explicitly marked confidential information',
          severity: 'block',
        },
        {
          type: 'keyword',
          keywords: ['password', 'secret', 'token', 'api key', 'credentials'],
          description: 'Blocks sensitive authentication information',
          severity: 'block',
        },
      ],
      maxTokenLimit: 2000,
      auditLevel: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      enabled: true,
    };

    // Policy for AI customer service operations
    const customerServicePolicy: AISecurityPolicy = {
      id: 'policy_customer_service',
      name: 'Customer Service AI Policy',
      description:
        'Security controls for AI operations in customer service contexts',
      allowedRoles: ['admin', 'support', 'customer_service', 'manager'],
      allowedOperations: [
        'ai.chat',
        'ai.email',
        'ai.response.generate',
        'ai.ticket.summarize',
        'ai.sentiment.analyze',
      ],
      dataAccessRestrictions: [
        {
          dataType: 'customer_details',
          accessLevel: 'masked',
          maskedFields: ['ssn', 'dob', 'creditScore', 'bankDetails'],
        },
        {
          dataType: 'support_history',
          accessLevel: 'full',
        },
        {
          dataType: 'payment_history',
          accessLevel: 'summary',
        },
      ],
      promptValidationRules: [
        {
          type: 'keyword',
          keywords: ['angry', 'upset', 'frustrated', 'stupid', 'idiot', 'hate'],
          description: 'Detects potentially negative sentiment in responses',
          severity: 'warning',
        },
        {
          type: 'regex',
          pattern: '(refund|cancel|discount|free)',
          description: 'Flags potential unauthorized offers',
          severity: 'warning',
        },
      ],
      maxTokenLimit: 2500,
      auditLevel: 'verbose',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      enabled: true,
    };

    // Policy for dispatch and logistics AI operations
    const logisticsPolicy: AISecurityPolicy = {
      id: 'policy_logistics',
      name: 'Logistics & Dispatch AI Policy',
      description:
        'Security controls for AI operations in logistics and dispatch',
      allowedRoles: [
        'admin',
        'dispatcher',
        'logistics_manager',
        'driver_manager',
      ],
      allowedOperations: [
        'ai.route.optimize',
        'ai.load.match',
        'ai.driver.recommend',
        'ai.eta.predict',
        'ai.delay.analyze',
      ],
      dataAccessRestrictions: [
        {
          dataType: 'driver_details',
          accessLevel: 'masked',
          maskedFields: ['licenseNumber', 'ssn', 'homeAddress', 'medicalInfo'],
        },
        {
          dataType: 'customer_shipping_details',
          accessLevel: 'full',
        },
        {
          dataType: 'vehicle_details',
          accessLevel: 'full',
        },
      ],
      promptValidationRules: [
        {
          type: 'regex',
          pattern: '(hazardous|restricted|illegal|controlled)',
          description: 'Flags potentially sensitive cargo information',
          severity: 'warning',
        },
      ],
      maxTokenLimit: 3000,
      auditLevel: 'standard',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      enabled: true,
    };

    // Policy for financial AI operations
    const financePolicy: AISecurityPolicy = {
      id: 'policy_finance',
      name: 'Finance AI Policy',
      description: 'Security controls for AI operations in financial contexts',
      allowedRoles: [
        'admin',
        'finance_manager',
        'accountant',
        'billing_specialist',
      ],
      allowedOperations: [
        'ai.invoice.analyze',
        'ai.payment.predict',
        'ai.expense.categorize',
        'ai.revenue.forecast',
        'ai.anomaly.detect',
      ],
      dataAccessRestrictions: [
        {
          dataType: 'financial_records',
          accessLevel: 'full',
        },
        {
          dataType: 'payment_methods',
          accessLevel: 'masked',
          maskedFields: ['cardNumber', 'cvv', 'accountNumber', 'routingNumber'],
        },
        {
          dataType: 'tax_information',
          accessLevel: 'masked',
          maskedFields: ['taxId', 'ein', 'ssn'],
        },
      ],
      promptValidationRules: [
        {
          type: 'keyword',
          keywords: [
            'fraud',
            'hide',
            'conceal',
            'offshore',
            'evade',
            'launder',
          ],
          description: 'Detects potentially problematic financial operations',
          severity: 'block',
        },
      ],
      maxTokenLimit: 3000,
      auditLevel: 'verbose',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
      enabled: true,
    };

    // Register all policies
    this.policies.set(globalPolicy.id, globalPolicy);
    this.policies.set(brokerSnapshotPolicy.id, brokerSnapshotPolicy);
    this.policies.set(customerServicePolicy.id, customerServicePolicy);
    this.policies.set(logisticsPolicy.id, logisticsPolicy);
    this.policies.set(financePolicy.id, financePolicy);
  }

  /**
   * Validates an AI operation against security policies
   */
  validateOperation(
    request: AIOperationRequest,
    policyId: string
  ): AIOperationResult {
    const { user } = getCurrentUser();
    const policy = this.policies.get(policyId);

    if (!policy || !policy.enabled) {
      return {
        allowed: false,
        blockReasons: ['Invalid or disabled security policy'],
      };
    }

    // Check user permission
    const hasPermission = policy.allowedRoles.some((role) =>
      checkPermission(`ai_security.${role}`)
    );

    if (!hasPermission) {
      return {
        allowed: false,
        blockReasons: [
          'User does not have required permissions for this AI operation',
        ],
      };
    }

    // Check if operation is allowed
    if (!policy.allowedOperations.includes(request.operation)) {
      return {
        allowed: false,
        blockReasons: [
          `Operation "${request.operation}" not allowed by policy`,
        ],
      };
    }

    // Validate and sanitize prompt
    const promptValidation = this.validatePrompt(
      request.prompt,
      policy.promptValidationRules
    );
    if (!promptValidation.valid && promptValidation.blockingIssues.length > 0) {
      return {
        allowed: false,
        warnings: promptValidation.warnings,
        blockReasons: promptValidation.blockingIssues,
      };
    }

    // Sanitize data based on policy
    const sanitizedData = request.data
      ? this.sanitizeData(request.data, policy.dataAccessRestrictions)
      : undefined;

    // Create audit log
    const auditId = this.createAuditLog({
      userId: user.id,
      operation: request.operation,
      policyId: policy.id,
      allowed: true,
      promptHash: this.hashString(request.prompt),
      dataTypesAccessed: request.data ? Object.keys(request.data) : [],
      warnings: promptValidation.warnings,
      blockReasons: [],
      metadata: request.metadata,
    });

    return {
      allowed: true,
      sanitizedPrompt: promptValidation.sanitizedPrompt,
      sanitizedData,
      warnings: promptValidation.warnings,
      auditId,
    };
  }

  /**
   * Validates a prompt against injection and data leakage
   */
  validatePrompt(
    prompt: string,
    rules: PromptValidationRule[]
  ): {
    valid: boolean;
    sanitizedPrompt: string;
    warnings: string[];
    blockingIssues: string[];
  } {
    let sanitizedPrompt = prompt;
    const warnings: string[] = [];
    const blockingIssues: string[] = [];

    // Check for prompt injection attempts
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(prompt)) {
        blockingIssues.push(
          `Potential prompt injection detected: ${pattern.toString()}`
        );
      }
    }

    // Check for sensitive data patterns
    for (const [type, pattern] of Object.entries(SENSITIVE_DATA_PATTERNS)) {
      if (pattern.test(prompt)) {
        warnings.push(`Potential ${type} detected in prompt`);
        // Redact sensitive data
        sanitizedPrompt = sanitizedPrompt.replace(
          pattern,
          `[REDACTED ${type}]`
        );
      }
    }

    // Apply custom validation rules
    for (const rule of rules) {
      let matched = false;

      if (rule.type === 'regex' && rule.pattern) {
        const regex = new RegExp(rule.pattern, 'i');
        matched = regex.test(prompt);
      } else if (rule.type === 'keyword' && rule.keywords) {
        matched = rule.keywords.some((keyword) =>
          prompt.toLowerCase().includes(keyword.toLowerCase())
        );
      }

      if (matched) {
        if (rule.severity === 'block') {
          blockingIssues.push(`Policy violation: ${rule.description}`);
        } else {
          warnings.push(`Warning: ${rule.description}`);
        }
      }
    }

    return {
      valid: blockingIssues.length === 0,
      sanitizedPrompt,
      warnings,
      blockingIssues,
    };
  }

  /**
   * Sanitizes data based on access restrictions
   */
  sanitizeData(data: any, restrictions: DataAccessRestriction[]): any {
    if (!data) return data;

    const result = { ...data };

    for (const restriction of restrictions) {
      if (!result[restriction.dataType]) continue;

      switch (restriction.accessLevel) {
        case 'none':
          delete result[restriction.dataType];
          break;
        case 'masked':
          if (
            restriction.maskedFields &&
            Array.isArray(restriction.maskedFields)
          ) {
            for (const field of restriction.maskedFields) {
              if (result[restriction.dataType][field]) {
                result[restriction.dataType][field] = '[REDACTED]';
              }
            }
          }
          break;
        case 'summary':
          // Replace detailed data with summary
          const originalData = result[restriction.dataType];
          if (typeof originalData === 'object' && originalData !== null) {
            result[restriction.dataType] = {
              summary: `${Object.keys(originalData).length} fields of ${restriction.dataType} data`,
              accessLevel: 'summary',
            };
          }
          break;
        case 'full':
          // No changes needed
          break;
      }
    }

    return result;
  }

  /**
   * Creates an audit log entry
   */
  private createAuditLog(
    logData: Omit<AISecurityAuditLog, 'id' | 'timestamp'>
  ): string {
    const id = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const log: AISecurityAuditLog = {
      ...logData,
      id,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.push(log);

    // In a real implementation, this would be persisted to a database
    // and potentially sent to a security monitoring system

    return id;
  }

  /**
   * Simple hash function for prompt auditing
   * In production, use a proper cryptographic hash
   */
  private hashString(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(16);
  }

  /**
   * Gets audit logs with optional filtering
   */
  getAuditLogs(filters?: {
    userId?: string;
    operation?: string;
    startDate?: string;
    endDate?: string;
    allowed?: boolean;
  }): AISecurityAuditLog[] {
    let filteredLogs = [...this.auditLogs];

    if (filters) {
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(
          (log) => log.userId === filters.userId
        );
      }

      if (filters.operation) {
        filteredLogs = filteredLogs.filter(
          (log) => log.operation === filters.operation
        );
      }

      if (filters.startDate) {
        const startDate = new Date(filters.startDate).getTime();
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp).getTime() >= startDate
        );
      }

      if (filters.endDate) {
        const endDate = new Date(filters.endDate).getTime();
        filteredLogs = filteredLogs.filter(
          (log) => new Date(log.timestamp).getTime() <= endDate
        );
      }

      if (filters.allowed !== undefined) {
        filteredLogs = filteredLogs.filter(
          (log) => log.allowed === filters.allowed
        );
      }
    }

    return filteredLogs;
  }

  /**
   * Gets a security policy by ID
   */
  getPolicy(policyId: string): AISecurityPolicy | undefined {
    return this.policies.get(policyId);
  }

  /**
   * Updates an existing security policy
   */
  updatePolicy(policyId: string, updates: Partial<AISecurityPolicy>): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;

    const updatedPolicy = {
      ...policy,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.policies.set(policyId, updatedPolicy);
    return true;
  }
}

export const aiSecurityService = new AISecurityService();
