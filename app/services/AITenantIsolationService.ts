/**
 * AI Tenant Isolation Service
 * Ensures ironclad separation of tenant data in all AI operations
 * Prevents cross-tenant data leakage and maintains strict data boundaries
 */

export interface TenantContext {
  tenantId: string;
  organizationName?: string;
  tier: 'basic' | 'premium' | 'enterprise';
  features: string[];
  dataClassification: 'public' | 'internal' | 'confidential' | 'restricted';
  complianceRequirements: string[];
}

export interface AIOperationContext {
  operationType: string;
  requestedData: string[];
  aiModel: string;
  purpose: string;
  userRole: string;
  sessionId: string;
}

export interface TenantViolation {
  type:
    | 'cross_tenant_access'
    | 'data_leakage'
    | 'unauthorized_operation'
    | 'boundary_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: string[];
  affectedTenants: string[];
  recommendedAction: string;
}

export interface IsolationResult {
  allowed: boolean;
  violations: TenantViolation[];
  sanitizedData: any;
  isolatedContext: any;
  auditTrail: string;
}

export class AITenantIsolationService {
  private tenantContexts: Map<string, TenantContext> = new Map();
  private tenantBoundaries: Map<string, Set<string>> = new Map();
  private crossTenantAttempts: Map<string, number> = new Map();
  private isolationPolicies: Map<string, any> = new Map();

  constructor() {
    this.initializeIsolationPolicies();
    this.setupDefaultTenantContexts();
  }

  /**
   * Main isolation validation - ensures AI operation respects tenant boundaries
   */
  validateTenantIsolation(
    tenantId: string,
    operation: AIOperationContext,
    data: any
  ): IsolationResult {
    const violations: TenantViolation[] = [];
    let sanitizedData = this.deepClone(data);
    let allowed = true;
    const auditTrail = this.generateAuditTrail(tenantId, operation);

    try {
      // Step 1: Validate tenant exists and is active
      const tenantContext = this.getTenantContext(tenantId);
      if (!tenantContext) {
        violations.push({
          type: 'unauthorized_operation',
          severity: 'critical',
          description: `Tenant ${tenantId} not found or inactive`,
          evidence: [`tenantId: ${tenantId}`],
          affectedTenants: [tenantId],
          recommendedAction: 'Block operation and verify tenant authentication',
        });
        allowed = false;
      }

      // Step 2: Check for cross-tenant data access attempts
      const crossTenantViolations = this.detectCrossTenantAccess(
        tenantId,
        data,
        operation
      );
      violations.push(...crossTenantViolations);
      if (
        crossTenantViolations.some(
          (v) => v.severity === 'critical' || v.severity === 'high'
        )
      ) {
        allowed = false;
      }

      // Step 3: Validate operation is permitted for tenant tier
      if (tenantContext) {
        const operationViolations = this.validateOperationPermissions(
          tenantContext,
          operation
        );
        violations.push(...operationViolations);
        if (operationViolations.some((v) => v.severity === 'critical')) {
          allowed = false;
        }
      }

      // Step 4: Apply tenant-specific data filtering
      sanitizedData = this.applyTenantDataFiltering(
        tenantId,
        sanitizedData,
        operation
      );

      // Step 5: Check for data boundary violations
      const boundaryViolations = this.validateDataBoundaries(
        tenantId,
        sanitizedData
      );
      violations.push(...boundaryViolations);
      if (boundaryViolations.some((v) => v.severity === 'critical')) {
        allowed = false;
      }

      // Step 6: Apply isolation context
      const isolatedContext = this.createIsolatedContext(tenantId, operation);

      // Step 7: Record cross-tenant attempts for monitoring
      this.recordTenantActivity(tenantId, operation, violations);

      return {
        allowed,
        violations,
        sanitizedData,
        isolatedContext,
        auditTrail,
      };
    } catch (error) {
      console.error('Tenant isolation validation error:', error);

      // Fail closed - deny access on any error
      violations.push({
        type: 'boundary_breach',
        severity: 'critical',
        description: 'Tenant isolation system error',
        evidence: [error?.toString() || 'Unknown error'],
        affectedTenants: [tenantId],
        recommendedAction: 'Block operation and investigate system error',
      });

      return {
        allowed: false,
        violations,
        sanitizedData: this.emergencyTenantIsolation(data),
        isolatedContext: { tenantId, restricted: true },
        auditTrail,
      };
    }
  }

  /**
   * Detect cross-tenant data access attempts
   */
  private detectCrossTenantAccess(
    tenantId: string,
    data: any,
    operation: AIOperationContext
  ): TenantViolation[] {
    const violations: TenantViolation[] = [];
    const dataString = JSON.stringify(data);

    // Check for explicit tenant ID references to other tenants
    const tenantIdPattern = /tenant[_\-]?id["']?\s*[:=]\s*["']?([^"',\s]+)/gi;
    let match;
    while ((match = tenantIdPattern.exec(dataString)) !== null) {
      const referencedTenantId = match[1];
      if (referencedTenantId !== tenantId) {
        violations.push({
          type: 'cross_tenant_access',
          severity: 'critical',
          description: `Attempted access to data from tenant ${referencedTenantId}`,
          evidence: [`Found tenant reference: ${match[0]}`],
          affectedTenants: [tenantId, referencedTenantId],
          recommendedAction: 'Block operation and audit tenant access patterns',
        });
      }
    }

    // Check for suspicious queries about "other" tenants/companies
    const crossTenantPhrases = [
      /other\s+(tenant|company|customer|client)s?/i,
      /all\s+(tenant|company|customer|client)s?/i,
      /every\s+(tenant|company|customer|client)s?/i,
      /list\s+(all|every)\s+/i,
      /show\s+me\s+all\s+/i,
      /competitor\s+data/i,
      /other\s+companies?['']?\s+data/i,
    ];

    for (const phrase of crossTenantPhrases) {
      if (phrase.test(dataString) || phrase.test(operation.purpose || '')) {
        violations.push({
          type: 'cross_tenant_access',
          severity: 'high',
          description: 'Potential cross-tenant data enumeration attempt',
          evidence: [
            `Suspicious phrase detected in ${phrase.test(dataString) ? 'data' : 'operation purpose'}`,
          ],
          affectedTenants: [tenantId],
          recommendedAction: 'Block operation and review user intent',
        });
      }
    }

    // Check for data that contains references to multiple tenant contexts
    const uniqueDataSources = this.identifyDataSources(data);
    if (
      uniqueDataSources.size > 1 &&
      !this.isCrossTenantOperationAllowed(tenantId, operation)
    ) {
      violations.push({
        type: 'data_leakage',
        severity: 'high',
        description: 'Data contains references to multiple tenant contexts',
        evidence: [`Data sources: ${Array.from(uniqueDataSources).join(', ')}`],
        affectedTenants: [tenantId, ...Array.from(uniqueDataSources)],
        recommendedAction: 'Sanitize data to single tenant context',
      });
    }

    return violations;
  }

  /**
   * Validate operation permissions for tenant tier
   */
  private validateOperationPermissions(
    tenantContext: TenantContext,
    operation: AIOperationContext
  ): TenantViolation[] {
    const violations: TenantViolation[] = [];
    const policy = this.isolationPolicies.get(tenantContext.tier);

    if (!policy) {
      violations.push({
        type: 'unauthorized_operation',
        severity: 'critical',
        description: `No isolation policy found for tenant tier: ${tenantContext.tier}`,
        evidence: [`tier: ${tenantContext.tier}`],
        affectedTenants: [tenantContext.tenantId],
        recommendedAction: 'Update tenant tier configuration',
      });
      return violations;
    }

    // Check if operation type is allowed
    if (!policy.allowedOperations.includes(operation.operationType)) {
      violations.push({
        type: 'unauthorized_operation',
        severity: 'high',
        description: `Operation ${operation.operationType} not permitted for ${tenantContext.tier} tier`,
        evidence: [
          `operation: ${operation.operationType}`,
          `tier: ${tenantContext.tier}`,
        ],
        affectedTenants: [tenantContext.tenantId],
        recommendedAction: 'Upgrade tenant tier or use allowed operations',
      });
    }

    // Check if AI model is permitted
    if (
      policy.restrictedModels &&
      policy.restrictedModels.includes(operation.aiModel)
    ) {
      violations.push({
        type: 'unauthorized_operation',
        severity: 'medium',
        description: `AI model ${operation.aiModel} restricted for ${tenantContext.tier} tier`,
        evidence: [
          `model: ${operation.aiModel}`,
          `tier: ${tenantContext.tier}`,
        ],
        affectedTenants: [tenantContext.tenantId],
        recommendedAction: 'Use permitted AI model or upgrade tier',
      });
    }

    // Check data classification compatibility
    if (
      tenantContext.dataClassification === 'restricted' &&
      !policy.supportsRestrictedData
    ) {
      violations.push({
        type: 'unauthorized_operation',
        severity: 'critical',
        description: 'Restricted data operations require higher tier',
        evidence: [`classification: ${tenantContext.dataClassification}`],
        affectedTenants: [tenantContext.tenantId],
        recommendedAction: 'Upgrade to enterprise tier for restricted data',
      });
    }

    return violations;
  }

  /**
   * Apply tenant-specific data filtering
   */
  private applyTenantDataFiltering(
    tenantId: string,
    data: any,
    operation: AIOperationContext
  ): any {
    if (!data || typeof data !== 'object') return data;

    const filtered = this.deepClone(data);
    const tenantContext = this.getTenantContext(tenantId);

    // Apply tier-specific filtering
    if (tenantContext?.tier === 'basic') {
      // Basic tier - remove sensitive fields
      this.removeFieldsRecursively(filtered, [
        'revenue',
        'profit',
        'cost',
        'internal',
      ]);
    }

    // Apply compliance-specific filtering
    if (tenantContext?.complianceRequirements.includes('GDPR')) {
      this.applyGDPRFiltering(filtered);
    }

    if (tenantContext?.complianceRequirements.includes('HIPAA')) {
      this.applyHIPAAFiltering(filtered);
    }

    // Ensure all data has tenant context
    this.addTenantContext(filtered, tenantId);

    return filtered;
  }

  /**
   * Validate data boundaries
   */
  private validateDataBoundaries(
    tenantId: string,
    data: any
  ): TenantViolation[] {
    const violations: TenantViolation[] = [];
    const boundaries = this.tenantBoundaries.get(tenantId);

    if (!boundaries) {
      violations.push({
        type: 'boundary_breach',
        severity: 'medium',
        description: `No data boundaries defined for tenant ${tenantId}`,
        evidence: [`tenantId: ${tenantId}`],
        affectedTenants: [tenantId],
        recommendedAction: 'Define tenant data boundaries',
      });
      return violations;
    }

    // Check if data contains references outside tenant boundaries
    const dataReferences = this.extractDataReferences(data);
    for (const reference of dataReferences) {
      if (!boundaries.has(reference) && reference !== tenantId) {
        violations.push({
          type: 'boundary_breach',
          severity: 'high',
          description: `Data contains reference outside tenant boundary: ${reference}`,
          evidence: [`reference: ${reference}`],
          affectedTenants: [tenantId],
          recommendedAction: 'Remove unauthorized data references',
        });
      }
    }

    return violations;
  }

  /**
   * Create isolated context for AI operation
   */
  private createIsolatedContext(
    tenantId: string,
    operation: AIOperationContext
  ): any {
    const tenantContext = this.getTenantContext(tenantId);

    return {
      tenant: {
        id: tenantId,
        tier: tenantContext?.tier || 'basic',
        features: tenantContext?.features || [],
        dataClassification: tenantContext?.dataClassification || 'internal',
      },
      operation: {
        type: operation.operationType,
        sessionId: operation.sessionId,
        userRole: operation.userRole,
      },
      restrictions: {
        crossTenantAccess: false,
        dataExport: this.isDataExportAllowed(tenantId),
        externalApiAccess: this.isExternalApiAllowed(tenantId),
      },
      monitoring: {
        auditRequired: true,
        logLevel: 'detailed',
        alertOnSuspicious: true,
      },
    };
  }

  /**
   * Initialize isolation policies for different tenant tiers
   */
  private initializeIsolationPolicies(): void {
    this.isolationPolicies.set('basic', {
      allowedOperations: [
        'ai.chat',
        'ai.response.generate',
        'ai.ticket.summarize',
      ],
      restrictedModels: ['gpt-4', 'claude-3-opus'],
      supportsRestrictedData: false,
      crossTenantAccess: false,
      maxDataSize: 10000, // 10KB
      auditLevel: 'basic',
    });

    this.isolationPolicies.set('premium', {
      allowedOperations: [
        'ai.chat',
        'ai.response.generate',
        'ai.sentiment.analyze',
        'ai.ticket.summarize',
        'ai.route.optimize',
        'ai.load.match',
      ],
      restrictedModels: [],
      supportsRestrictedData: false,
      crossTenantAccess: false,
      maxDataSize: 50000, // 50KB
      auditLevel: 'detailed',
    });

    this.isolationPolicies.set('enterprise', {
      allowedOperations: ['*'], // All operations
      restrictedModels: [],
      supportsRestrictedData: true,
      crossTenantAccess: false, // Still false for security
      maxDataSize: 500000, // 500KB
      auditLevel: 'comprehensive',
    });
  }

  /**
   * Setup default tenant contexts
   */
  private setupDefaultTenantContexts(): void {
    // These would normally be loaded from database
    const defaultContext: TenantContext = {
      tenantId: 'default',
      tier: 'basic',
      features: ['basic_ai', 'customer_support'],
      dataClassification: 'internal',
      complianceRequirements: ['GDPR'],
    };

    this.tenantContexts.set('default', defaultContext);
    this.tenantBoundaries.set('default', new Set(['default', 'public_data']));
  }

  /**
   * Helper methods
   */
  private getTenantContext(tenantId: string): TenantContext | undefined {
    return this.tenantContexts.get(tenantId);
  }

  private identifyDataSources(data: any): Set<string> {
    const sources = new Set<string>();

    if (!data || typeof data !== 'object') return sources;

    // Look for tenant identifiers
    const identifierFields = [
      'tenantId',
      'tenant_id',
      'companyId',
      'company_id',
      'organizationId',
    ];

    const traverse = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key in obj) {
        if (identifierFields.includes(key) && obj[key]) {
          sources.add(String(obj[key]));
        } else if (typeof obj[key] === 'object') {
          traverse(obj[key]);
        }
      }
    };

    traverse(data);
    return sources;
  }

  private isCrossTenantOperationAllowed(
    tenantId: string,
    operation: AIOperationContext
  ): boolean {
    // Generally, cross-tenant operations should never be allowed
    // This is a security-first approach
    return false;
  }

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

  private removeFieldsRecursively(obj: any, fields: string[]): void {
    if (!obj || typeof obj !== 'object') return;

    for (const field of fields) {
      delete obj[field];
    }

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.removeFieldsRecursively(obj[key], fields);
      }
    }
  }

  private applyGDPRFiltering(data: any): void {
    // Remove personal data fields as per GDPR
    const gdprFields = [
      'personalInfo',
      'dateOfBirth',
      'ssn',
      'personalAddress',
      'personalPhone',
      'personalEmail',
    ];
    this.removeFieldsRecursively(data, gdprFields);
  }

  private applyHIPAAFiltering(data: any): void {
    // Remove health information fields as per HIPAA
    const hipaaFields = [
      'healthInfo',
      'medicalHistory',
      'medicalRecords',
      'healthInsurance',
      'medicalId',
    ];
    this.removeFieldsRecursively(data, hipaaFields);
  }

  private addTenantContext(data: any, tenantId: string): void {
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      data._tenantContext = {
        tenantId,
        isolationApplied: true,
        timestamp: new Date().toISOString(),
      };
    }
  }

  private extractDataReferences(data: any): string[] {
    const references: string[] = [];

    if (!data || typeof data !== 'object') return references;

    const traverse = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;

      for (const key in obj) {
        if (
          key.includes('Id') ||
          key.includes('_id') ||
          key.includes('Reference')
        ) {
          if (typeof obj[key] === 'string') {
            references.push(obj[key]);
          }
        } else if (typeof obj[key] === 'object') {
          traverse(obj[key]);
        }
      }
    };

    traverse(data);
    return references;
  }

  private isDataExportAllowed(tenantId: string): boolean {
    const context = this.getTenantContext(tenantId);
    return (
      context?.tier === 'enterprise' &&
      context?.features.includes('data_export')
    );
  }

  private isExternalApiAllowed(tenantId: string): boolean {
    const context = this.getTenantContext(tenantId);
    return (
      context?.tier !== 'basic' &&
      context?.features.includes('external_integrations')
    );
  }

  private recordTenantActivity(
    tenantId: string,
    operation: AIOperationContext,
    violations: TenantViolation[]
  ): void {
    // Record for monitoring and analytics
    const suspiciousViolations = violations.filter(
      (v) => v.type === 'cross_tenant_access' || v.type === 'boundary_breach'
    );

    if (suspiciousViolations.length > 0) {
      const currentAttempts = this.crossTenantAttempts.get(tenantId) || 0;
      this.crossTenantAttempts.set(tenantId, currentAttempts + 1);

      // Alert if too many attempts
      if (currentAttempts + 1 > 5) {
        console.warn(
          `🚨 HIGH ALERT: Tenant ${tenantId} has made ${currentAttempts + 1} suspicious cross-tenant attempts`
        );
      }
    }
  }

  private emergencyTenantIsolation(data: any): any {
    // Emergency fallback - return minimal safe data
    return {
      status: 'isolation_applied',
      message: 'Data isolated for security',
      timestamp: new Date().toISOString(),
    };
  }

  private generateAuditTrail(
    tenantId: string,
    operation: AIOperationContext
  ): string {
    return `tenant_isolation_${tenantId}_${operation.sessionId}_${Date.now()}`;
  }

  /**
   * Public methods for tenant management
   */
  registerTenant(tenantContext: TenantContext): void {
    this.tenantContexts.set(tenantContext.tenantId, tenantContext);
    this.tenantBoundaries.set(
      tenantContext.tenantId,
      new Set([tenantContext.tenantId, 'public_data'])
    );
    console.log(
      `✅ Registered tenant: ${tenantContext.tenantId} (${tenantContext.tier} tier)`
    );
  }

  updateTenantBoundaries(tenantId: string, allowedReferences: string[]): void {
    this.tenantBoundaries.set(
      tenantId,
      new Set([tenantId, ...allowedReferences])
    );
    console.log(`🔒 Updated boundaries for tenant: ${tenantId}`);
  }

  getTenantSecurityStats(tenantId: string): {
    violations: number;
    crossTenantAttempts: number;
    tier: string;
    lastActivity: Date;
  } {
    const context = this.getTenantContext(tenantId);
    return {
      violations: 0, // Would be tracked in production
      crossTenantAttempts: this.crossTenantAttempts.get(tenantId) || 0,
      tier: context?.tier || 'unknown',
      lastActivity: new Date(),
    };
  }
}

// Export singleton instance
export const aiTenantIsolationService = new AITenantIsolationService();
