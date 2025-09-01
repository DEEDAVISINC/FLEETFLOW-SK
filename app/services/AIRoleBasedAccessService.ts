/**
 * AI Role-Based Access Control Service
 * Controls which AI features users can access based on their roles and permissions
 * Ensures users only get AI-generated information appropriate to their access level
 */

export interface AIRole {
  id: string;
  name: string;
  description: string;
  permissions: AIPermission[];
  restrictions: AIRestriction[];
  aiFeatureAccess: AIFeatureAccess;
  dataAccessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
  inheritFrom?: string; // Role hierarchy
}

export interface AIPermission {
  resource: string; // e.g., 'ai.chat', 'ai.analytics', 'ai.financials'
  actions: string[]; // e.g., ['read', 'write', 'execute']
  conditions?: string[]; // e.g., ['own_data_only', 'business_hours_only']
  dataFilters?: string[]; // Fields to include/exclude
}

export interface AIRestriction {
  type: 'time' | 'location' | 'data_scope' | 'operation' | 'model';
  rule: string;
  severity: 'warning' | 'block';
  message: string;
}

export interface AIFeatureAccess {
  chat: boolean;
  analytics: boolean;
  financials: boolean;
  customerData: boolean;
  competitiveIntelligence: boolean;
  predictiveModels: boolean;
  automation: boolean;
  reporting: boolean;
  dataExport: boolean;
  modelTraining: boolean;
}

export interface AIAccessRequest {
  userId: string;
  userRole: string;
  requestedResource: string;
  requestedAction: string;
  dataContext: any;
  sessionInfo: {
    sessionId: string;
    ipAddress?: string;
    userAgent?: string;
    timestamp: Date;
  };
}

export interface AIAccessResult {
  allowed: boolean;
  deniedReasons: string[];
  warnings: string[];
  filteredData: any;
  appliedRestrictions: AIRestriction[];
  auditId: string;
  effectivePermissions: AIPermission[];
}

export class AIRoleBasedAccessService {
  private roles: Map<string, AIRole> = new Map();
  private userRoleMappings: Map<string, string[]> = new Map();
  private accessAuditLog: Map<string, any[]> = new Map();
  private roleHierarchy: Map<string, string[]> = new Map();

  constructor() {
    this.initializeDefaultRoles();
    this.initializeRoleHierarchy();
  }

  /**
   * Main access control method - determines if user can access AI feature
   */
  checkAIAccess(request: AIAccessRequest): AIAccessResult {
    const auditId = this.generateAuditId();
    const deniedReasons: string[] = [];
    const warnings: string[] = [];
    const appliedRestrictions: AIRestriction[] = [];
    let allowed = false;
    let filteredData = request.dataContext;
    let effectivePermissions: AIPermission[] = [];

    try {
      // Step 1: Get user roles (including inherited)
      const userRoles = this.getUserRoles(request.userId);
      if (userRoles.length === 0) {
        deniedReasons.push('No roles assigned to user');
        this.logAccessAttempt(auditId, request, false, 'NO_ROLES');
        return this.createAccessResult(
          false,
          deniedReasons,
          warnings,
          filteredData,
          appliedRestrictions,
          auditId,
          effectivePermissions
        );
      }

      // Step 2: Collect all permissions from user's roles
      effectivePermissions = this.collectEffectivePermissions(userRoles);

      // Step 3: Check if resource access is permitted
      const resourcePermission = this.findResourcePermission(
        effectivePermissions,
        request.requestedResource
      );
      if (!resourcePermission) {
        deniedReasons.push(
          `No permission found for resource: ${request.requestedResource}`
        );
        this.logAccessAttempt(auditId, request, false, 'RESOURCE_DENIED');
        return this.createAccessResult(
          false,
          deniedReasons,
          warnings,
          filteredData,
          appliedRestrictions,
          auditId,
          effectivePermissions
        );
      }

      // Step 4: Check if specific action is allowed
      if (
        !resourcePermission.actions.includes(request.requestedAction) &&
        !resourcePermission.actions.includes('*')
      ) {
        deniedReasons.push(
          `Action '${request.requestedAction}' not permitted for resource '${request.requestedResource}'`
        );
        this.logAccessAttempt(auditId, request, false, 'ACTION_DENIED');
        return this.createAccessResult(
          false,
          deniedReasons,
          warnings,
          filteredData,
          appliedRestrictions,
          auditId,
          effectivePermissions
        );
      }

      // Step 5: Apply role-based restrictions
      const restrictions = this.collectRestrictions(userRoles);
      const restrictionViolations = this.checkRestrictions(
        restrictions,
        request
      );

      for (const violation of restrictionViolations) {
        appliedRestrictions.push(violation.restriction);
        if (violation.restriction.severity === 'block') {
          deniedReasons.push(violation.restriction.message);
        } else {
          warnings.push(violation.restriction.message);
        }
      }

      // Block if any blocking restrictions violated
      if (
        restrictionViolations.some((v) => v.restriction.severity === 'block')
      ) {
        this.logAccessAttempt(auditId, request, false, 'RESTRICTION_VIOLATED');
        return this.createAccessResult(
          false,
          deniedReasons,
          warnings,
          filteredData,
          appliedRestrictions,
          auditId,
          effectivePermissions
        );
      }

      // Step 6: Apply data filtering based on role permissions
      filteredData = this.applyDataFiltering(
        request.dataContext,
        resourcePermission,
        userRoles
      );

      // Step 7: Check conditions (if any)
      if (resourcePermission.conditions) {
        const conditionViolations = this.checkConditions(
          resourcePermission.conditions,
          request
        );
        if (conditionViolations.length > 0) {
          deniedReasons.push(...conditionViolations);
          this.logAccessAttempt(auditId, request, false, 'CONDITION_FAILED');
          return this.createAccessResult(
            false,
            deniedReasons,
            warnings,
            filteredData,
            appliedRestrictions,
            auditId,
            effectivePermissions
          );
        }
      }

      // Step 8: All checks passed
      allowed = true;
      this.logAccessAttempt(auditId, request, true, 'ACCESS_GRANTED');
    } catch (error) {
      console.error('AI access control error:', error);
      deniedReasons.push('Access control system error');
      this.logAccessAttempt(auditId, request, false, 'SYSTEM_ERROR');
    }

    return this.createAccessResult(
      allowed,
      deniedReasons,
      warnings,
      filteredData,
      appliedRestrictions,
      auditId,
      effectivePermissions
    );
  }

  /**
   * Get AI features available to a specific role
   */
  getAvailableFeatures(userId: string): {
    features: string[];
    restrictions: string[];
    dataAccessLevel: string;
  } {
    const userRoles = this.getUserRoles(userId);
    const features: string[] = [];
    const restrictions: string[] = [];
    let highestDataLevel = 'public';

    for (const roleId of userRoles) {
      const role = this.roles.get(roleId);
      if (role) {
        // Collect features
        Object.entries(role.aiFeatureAccess).forEach(([feature, allowed]) => {
          if (allowed && !features.includes(feature)) {
            features.push(feature);
          }
        });

        // Collect restrictions
        role.restrictions.forEach((restriction) => {
          if (!restrictions.includes(restriction.message)) {
            restrictions.push(restriction.message);
          }
        });

        // Determine highest data access level
        if (this.isHigherDataLevel(role.dataAccessLevel, highestDataLevel)) {
          highestDataLevel = role.dataAccessLevel;
        }
      }
    }

    return {
      features: features.sort(),
      restrictions,
      dataAccessLevel: highestDataLevel,
    };
  }

  /**
   * Initialize default roles for FleetFlow
   */
  private initializeDefaultRoles(): void {
    // Driver role - minimal AI access
    this.roles.set('driver', {
      id: 'driver',
      name: 'Driver',
      description: 'Drivers with basic AI assistance access',
      permissions: [
        {
          resource: 'ai.chat',
          actions: ['read', 'execute'],
          conditions: ['own_data_only'],
          dataFilters: ['basic_info_only'],
        },
        {
          resource: 'ai.voice_assistance',
          actions: ['execute'],
          conditions: ['driving_context_only'],
        },
      ],
      restrictions: [
        {
          type: 'data_scope',
          rule: 'own_trips_only',
          severity: 'block',
          message: 'Can only access own trip data',
        },
        {
          type: 'operation',
          rule: 'no_financial_data',
          severity: 'block',
          message: 'Financial data access restricted',
        },
      ],
      aiFeatureAccess: {
        chat: true,
        analytics: false,
        financials: false,
        customerData: false,
        competitiveIntelligence: false,
        predictiveModels: false,
        automation: false,
        reporting: false,
        dataExport: false,
        modelTraining: false,
      },
      dataAccessLevel: 'public',
    });

    // Dispatcher role - operational AI access
    this.roles.set('dispatcher', {
      id: 'dispatcher',
      name: 'Dispatcher',
      description: 'Dispatchers with operational AI features',
      permissions: [
        {
          resource: 'ai.chat',
          actions: ['read', 'execute'],
        },
        {
          resource: 'ai.route_optimization',
          actions: ['read', 'execute'],
          conditions: ['business_hours_only'],
        },
        {
          resource: 'ai.load_matching',
          actions: ['read', 'execute'],
        },
        {
          resource: 'ai.driver_communication',
          actions: ['read', 'write', 'execute'],
        },
      ],
      restrictions: [
        {
          type: 'data_scope',
          rule: 'operational_data_only',
          severity: 'block',
          message: 'Limited to operational data access',
        },
        {
          type: 'time',
          rule: 'business_hours_preferred',
          severity: 'warning',
          message: 'AI features work best during business hours',
        },
      ],
      aiFeatureAccess: {
        chat: true,
        analytics: true,
        financials: false,
        customerData: true,
        competitiveIntelligence: false,
        predictiveModels: true,
        automation: true,
        reporting: true,
        dataExport: false,
        modelTraining: false,
      },
      dataAccessLevel: 'internal',
      inheritFrom: 'driver',
    });

    // Manager role - comprehensive AI access
    this.roles.set('manager', {
      id: 'manager',
      name: 'Manager',
      description: 'Managers with comprehensive AI access including analytics',
      permissions: [
        {
          resource: 'ai.*',
          actions: ['*'],
        },
      ],
      restrictions: [
        {
          type: 'data_scope',
          rule: 'company_data_only',
          severity: 'block',
          message: 'Access limited to company data',
        },
      ],
      aiFeatureAccess: {
        chat: true,
        analytics: true,
        financials: true,
        customerData: true,
        competitiveIntelligence: true,
        predictiveModels: true,
        automation: true,
        reporting: true,
        dataExport: true,
        modelTraining: false,
      },
      dataAccessLevel: 'confidential',
      inheritFrom: 'dispatcher',
    });

    // Admin role - full AI access
    this.roles.set('admin', {
      id: 'admin',
      name: 'Administrator',
      description: 'Full AI system access including training and configuration',
      permissions: [
        {
          resource: '*',
          actions: ['*'],
        },
      ],
      restrictions: [],
      aiFeatureAccess: {
        chat: true,
        analytics: true,
        financials: true,
        customerData: true,
        competitiveIntelligence: true,
        predictiveModels: true,
        automation: true,
        reporting: true,
        dataExport: true,
        modelTraining: true,
      },
      dataAccessLevel: 'restricted',
      inheritFrom: 'manager',
    });

    // Broker role - specialized for freight operations
    this.roles.set('broker', {
      id: 'broker',
      name: 'Freight Broker',
      description: 'Brokers with AI access for freight operations',
      permissions: [
        {
          resource: 'ai.chat',
          actions: ['read', 'execute'],
        },
        {
          resource: 'ai.rate_analysis',
          actions: ['read', 'execute'],
        },
        {
          resource: 'ai.market_intelligence',
          actions: ['read', 'execute'],
        },
        {
          resource: 'ai.customer_communication',
          actions: ['read', 'write', 'execute'],
        },
        {
          resource: 'ai.negotiation_support',
          actions: ['read', 'execute'],
        },
      ],
      restrictions: [
        {
          type: 'data_scope',
          rule: 'customer_facing_appropriate',
          severity: 'warning',
          message: 'Ensure AI responses are customer-appropriate',
        },
      ],
      aiFeatureAccess: {
        chat: true,
        analytics: true,
        financials: true,
        customerData: true,
        competitiveIntelligence: true,
        predictiveModels: true,
        automation: true,
        reporting: true,
        dataExport: false,
        modelTraining: false,
      },
      dataAccessLevel: 'confidential',
      inheritFrom: 'dispatcher',
    });
  }

  /**
   * Initialize role hierarchy
   */
  private initializeRoleHierarchy(): void {
    this.roleHierarchy.set('admin', [
      'manager',
      'broker',
      'dispatcher',
      'driver',
    ]);
    this.roleHierarchy.set('manager', ['dispatcher', 'driver']);
    this.roleHierarchy.set('broker', ['dispatcher', 'driver']);
    this.roleHierarchy.set('dispatcher', ['driver']);
    this.roleHierarchy.set('driver', []);
  }

  /**
   * Get all roles for a user, including inherited ones
   */
  private getUserRoles(userId: string): string[] {
    const directRoles = this.userRoleMappings.get(userId) || ['driver']; // Default to driver
    const allRoles = new Set<string>();

    for (const role of directRoles) {
      allRoles.add(role);
      // Add inherited roles
      const inherited = this.getInheritedRoles(role);
      inherited.forEach((r) => allRoles.add(r));
    }

    return Array.from(allRoles);
  }

  /**
   * Get inherited roles for a given role
   */
  private getInheritedRoles(roleId: string): string[] {
    const role = this.roles.get(roleId);
    const inherited: string[] = [];

    if (role?.inheritFrom) {
      inherited.push(role.inheritFrom);
      inherited.push(...this.getInheritedRoles(role.inheritFrom));
    }

    return inherited;
  }

  /**
   * Collect effective permissions from all roles
   */
  private collectEffectivePermissions(userRoles: string[]): AIPermission[] {
    const permissions: AIPermission[] = [];

    for (const roleId of userRoles) {
      const role = this.roles.get(roleId);
      if (role) {
        permissions.push(...role.permissions);
      }
    }

    return permissions;
  }

  /**
   * Find permission for specific resource
   */
  private findResourcePermission(
    permissions: AIPermission[],
    resource: string
  ): AIPermission | undefined {
    // Look for exact match first
    let permission = permissions.find((p) => p.resource === resource);

    // Look for wildcard matches
    if (!permission) {
      permission = permissions.find((p) => {
        if (p.resource === '*') return true;
        if (p.resource.endsWith('.*')) {
          const prefix = p.resource.slice(0, -2);
          return resource.startsWith(prefix);
        }
        return false;
      });
    }

    return permission;
  }

  /**
   * Collect restrictions from all roles
   */
  private collectRestrictions(userRoles: string[]): AIRestriction[] {
    const restrictions: AIRestriction[] = [];

    for (const roleId of userRoles) {
      const role = this.roles.get(roleId);
      if (role) {
        restrictions.push(...role.restrictions);
      }
    }

    return restrictions;
  }

  /**
   * Check restrictions against request
   */
  private checkRestrictions(
    restrictions: AIRestriction[],
    request: AIAccessRequest
  ): {
    restriction: AIRestriction;
    violated: boolean;
  }[] {
    const violations: { restriction: AIRestriction; violated: boolean }[] = [];

    for (const restriction of restrictions) {
      let violated = false;

      switch (restriction.type) {
        case 'time':
          violated = this.checkTimeRestriction(
            restriction.rule,
            request.sessionInfo.timestamp
          );
          break;
        case 'data_scope':
          violated = this.checkDataScopeRestriction(restriction.rule, request);
          break;
        case 'operation':
          violated = this.checkOperationRestriction(restriction.rule, request);
          break;
        case 'location':
          violated = this.checkLocationRestriction(
            restriction.rule,
            request.sessionInfo.ipAddress
          );
          break;
        case 'model':
          violated = this.checkModelRestriction(restriction.rule, request);
          break;
      }

      if (violated) {
        violations.push({ restriction, violated: true });
      }
    }

    return violations;
  }

  /**
   * Apply data filtering based on permissions
   */
  private applyDataFiltering(
    data: any,
    permission: AIPermission,
    userRoles: string[]
  ): any {
    if (!data || typeof data !== 'object') return data;

    let filteredData = { ...data };

    // Apply data filters from permission
    if (permission.dataFilters) {
      for (const filter of permission.dataFilters) {
        filteredData = this.applyDataFilter(filteredData, filter, userRoles);
      }
    }

    // Apply role-based data level filtering
    const maxDataLevel = this.getMaxDataAccessLevel(userRoles);
    filteredData = this.filterByDataLevel(filteredData, maxDataLevel);

    return filteredData;
  }

  /**
   * Check various restriction types
   */
  private checkTimeRestriction(rule: string, timestamp: Date): boolean {
    if (rule === 'business_hours_only') {
      const hour = timestamp.getHours();
      return hour < 8 || hour > 18; // Violated if outside 8 AM - 6 PM
    }
    return false;
  }

  private checkDataScopeRestriction(
    rule: string,
    request: AIAccessRequest
  ): boolean {
    switch (rule) {
      case 'own_data_only':
        return this.containsOtherUserData(request.dataContext, request.userId);
      case 'operational_data_only':
        return this.containsFinancialData(request.dataContext);
      case 'company_data_only':
        return this.containsCrossTenantData(request.dataContext);
      default:
        return false;
    }
  }

  private checkOperationRestriction(
    rule: string,
    request: AIAccessRequest
  ): boolean {
    switch (rule) {
      case 'no_financial_data':
        return (
          request.requestedResource.includes('financial') ||
          request.requestedResource.includes('revenue') ||
          this.containsFinancialData(request.dataContext)
        );
      case 'customer_facing_appropriate':
        return this.containsInternalData(request.dataContext);
      default:
        return false;
    }
  }

  private checkLocationRestriction(rule: string, ipAddress?: string): boolean {
    // Implement IP-based location checking
    return false; // Placeholder
  }

  private checkModelRestriction(
    rule: string,
    request: AIAccessRequest
  ): boolean {
    // Check if specific AI models are restricted
    return false; // Placeholder
  }

  /**
   * Helper methods for data checks
   */
  private containsOtherUserData(data: any, currentUserId: string): boolean {
    if (!data) return false;
    const dataStr = JSON.stringify(data);
    const userIdPattern = /user[_-]?id["']?\s*[:=]\s*["']?([^"',\s]+)/gi;
    let match;
    while ((match = userIdPattern.exec(dataStr)) !== null) {
      if (match[1] !== currentUserId) return true;
    }
    return false;
  }

  private containsFinancialData(data: any): boolean {
    if (!data) return false;
    const financialFields = [
      'revenue',
      'cost',
      'profit',
      'rate',
      'price',
      'payment',
      'invoice',
    ];
    const dataStr = JSON.stringify(data).toLowerCase();
    return financialFields.some((field) => dataStr.includes(field));
  }

  private containsCrossTenantData(data: any): boolean {
    // Check for multiple tenant references
    if (!data) return false;
    const dataStr = JSON.stringify(data);
    const tenantIds = new Set<string>();
    const tenantPattern = /tenant[_-]?id["']?\s*[:=]\s*["']?([^"',\s]+)/gi;
    let match;
    while ((match = tenantPattern.exec(dataStr)) !== null) {
      tenantIds.add(match[1]);
    }
    return tenantIds.size > 1;
  }

  private containsInternalData(data: any): boolean {
    if (!data) return false;
    const internalFields = [
      'internal',
      'confidential',
      'proprietary',
      'secret',
    ];
    const dataStr = JSON.stringify(data).toLowerCase();
    return internalFields.some((field) => dataStr.includes(field));
  }

  /**
   * Data filtering methods
   */
  private applyDataFilter(data: any, filter: string, userRoles: string[]): any {
    switch (filter) {
      case 'basic_info_only':
        return this.filterToBasicInfo(data);
      case 'no_financial_data':
        return this.removeFinancialData(data);
      case 'own_data_only':
        return this.filterToOwnData(data, userRoles);
      default:
        return data;
    }
  }

  private filterByDataLevel(data: any, maxLevel: string): any {
    // Remove data above user's access level
    const filtered = { ...data };

    if (maxLevel === 'public') {
      // Remove all but public data
      this.removeFieldsByPattern(filtered, /internal|confidential|restricted/i);
    } else if (maxLevel === 'internal') {
      // Remove confidential and restricted
      this.removeFieldsByPattern(filtered, /confidential|restricted/i);
    } else if (maxLevel === 'confidential') {
      // Remove only restricted
      this.removeFieldsByPattern(filtered, /restricted/i);
    }

    return filtered;
  }

  private filterToBasicInfo(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const basicFields = [
      'id',
      'name',
      'status',
      'type',
      'created_at',
      'updated_at',
    ];
    const filtered: any = {};

    for (const field of basicFields) {
      if (data[field] !== undefined) {
        filtered[field] = data[field];
      }
    }

    return filtered;
  }

  private removeFinancialData(data: any): any {
    if (!data || typeof data !== 'object') return data;

    const filtered = { ...data };
    const financialFields = [
      'revenue',
      'cost',
      'profit',
      'rate',
      'price',
      'payment',
      'invoice',
      'billing',
    ];

    this.removeFieldsRecursively(filtered, financialFields);
    return filtered;
  }

  private filterToOwnData(data: any, userRoles: string[]): any {
    // Implementation would filter data to only what the user owns
    return data; // Placeholder
  }

  private removeFieldsByPattern(obj: any, pattern: RegExp): void {
    if (!obj || typeof obj !== 'object') return;

    for (const key in obj) {
      if (pattern.test(key)) {
        delete obj[key];
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.removeFieldsByPattern(obj[key], pattern);
      }
    }
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

  /**
   * Utility methods
   */
  private getMaxDataAccessLevel(userRoles: string[]): string {
    const levels = ['public', 'internal', 'confidential', 'restricted'];
    let maxLevel = 'public';

    for (const roleId of userRoles) {
      const role = this.roles.get(roleId);
      if (role) {
        const roleLevel = role.dataAccessLevel;
        if (levels.indexOf(roleLevel) > levels.indexOf(maxLevel)) {
          maxLevel = roleLevel;
        }
      }
    }

    return maxLevel;
  }

  private isHigherDataLevel(level1: string, level2: string): boolean {
    const levels = ['public', 'internal', 'confidential', 'restricted'];
    return levels.indexOf(level1) > levels.indexOf(level2);
  }

  private checkConditions(
    conditions: string[],
    request: AIAccessRequest
  ): string[] {
    const violations: string[] = [];

    for (const condition of conditions) {
      switch (condition) {
        case 'own_data_only':
          if (this.containsOtherUserData(request.dataContext, request.userId)) {
            violations.push('Condition violation: can only access own data');
          }
          break;
        case 'business_hours_only':
          if (
            this.checkTimeRestriction(
              'business_hours_only',
              request.sessionInfo.timestamp
            )
          ) {
            violations.push(
              'Condition violation: access restricted to business hours'
            );
          }
          break;
      }
    }

    return violations;
  }

  private createAccessResult(
    allowed: boolean,
    deniedReasons: string[],
    warnings: string[],
    filteredData: any,
    appliedRestrictions: AIRestriction[],
    auditId: string,
    effectivePermissions: AIPermission[]
  ): AIAccessResult {
    return {
      allowed,
      deniedReasons,
      warnings,
      filteredData,
      appliedRestrictions,
      auditId,
      effectivePermissions,
    };
  }

  private generateAuditId(): string {
    return `ai_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private logAccessAttempt(
    auditId: string,
    request: AIAccessRequest,
    granted: boolean,
    reason: string
  ): void {
    const logEntry = {
      auditId,
      userId: request.userId,
      userRole: request.userRole,
      resource: request.requestedResource,
      action: request.requestedAction,
      granted,
      reason,
      timestamp: new Date(),
      sessionId: request.sessionInfo.sessionId,
      ipAddress: request.sessionInfo.ipAddress,
    };

    if (!this.accessAuditLog.has(request.userId)) {
      this.accessAuditLog.set(request.userId, []);
    }

    this.accessAuditLog.get(request.userId)!.push(logEntry);

    console.info(
      `[AI Access Control] ${granted ? 'GRANTED' : 'DENIED'}: ${auditId}`,
      {
        user: request.userId,
        resource: request.requestedResource,
        reason,
      }
    );
  }

  /**
   * Public methods for role management
   */
  assignUserToRole(userId: string, roleId: string): void {
    const currentRoles = this.userRoleMappings.get(userId) || [];
    if (!currentRoles.includes(roleId)) {
      currentRoles.push(roleId);
      this.userRoleMappings.set(userId, currentRoles);
      console.info(`✅ Assigned user ${userId} to role ${roleId}`);
    }
  }

  removeUserFromRole(userId: string, roleId: string): void {
    const currentRoles = this.userRoleMappings.get(userId) || [];
    const updatedRoles = currentRoles.filter((r) => r !== roleId);
    this.userRoleMappings.set(userId, updatedRoles);
    console.info(`🚫 Removed user ${userId} from role ${roleId}`);
  }

  createCustomRole(role: AIRole): void {
    this.roles.set(role.id, role);
    console.info(`➕ Created custom AI role: ${role.name}`);
  }

  getUserAccessSummary(userId: string): {
    roles: string[];
    features: string[];
    dataAccessLevel: string;
    recentAccess: any[];
  } {
    const userRoles = this.getUserRoles(userId);
    const availableFeatures = this.getAvailableFeatures(userId);
    const recentAccess = this.accessAuditLog.get(userId)?.slice(-10) || [];

    return {
      roles: userRoles,
      features: availableFeatures.features,
      dataAccessLevel: availableFeatures.dataAccessLevel,
      recentAccess,
    };
  }
}

// Export singleton instance
export const aiRoleBasedAccessService = new AIRoleBasedAccessService();
