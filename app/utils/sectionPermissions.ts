// Enhanced Section-Based Permission System with Conditional Access
export interface SectionPermission {
  id: string;
  name: string;
  description: string;
  page: string;
  section: string;
  requiredRole?: string[];
  conditions?: AccessCondition[];
  priority: number; // Higher priority overrides lower
}

export interface AccessCondition {
  type: 'training' | 'compliance' | 'certification' | 'performance' | 'custom';
  requirement: string;
  value: any;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_equals';
  blockType: 'section' | 'page' | 'app'; // What to block if condition fails
  message?: string;
}

export interface UserPermissionProfile {
  userId: string;
  permissions: string[]; // Permission IDs
  conditions: UserConditionStatus;
  overrides: PermissionOverride[];
  lastUpdated: string;
}

export interface UserConditionStatus {
  training: {
    completed: string[]; // Module IDs
    inProgress: string[];
    required: string[];
    overallCompletion: number;
  };
  compliance: {
    dotStatus: 'compliant' | 'warning' | 'violation';
    medicalCertExpiry: string;
    licenseStatus: 'valid' | 'expired' | 'suspended';
    hosViolations: number;
    safetyScore: number;
  };
  certification: {
    active: string[];
    expired: string[];
    required: string[];
  };
  performance: {
    rating: number;
    onTimeDelivery: number;
    safetyIncidents: number;
  };
}

export interface PermissionOverride {
  permissionId: string;
  granted: boolean;
  reason: string;
  grantedBy: string;
  expiresAt?: string;
  temporary: boolean;
}

// Define all section permissions for FleetFlow
export const SECTION_PERMISSIONS: SectionPermission[] = [
  // Dashboard Sections
  {
    id: 'dashboard.metrics.revenue',
    name: 'Revenue Metrics',
    description: 'View revenue and financial metrics on dashboard',
    page: 'dashboard',
    section: 'revenue-metrics',
    requiredRole: ['admin', 'manager'],
    priority: 1
  },
  {
    id: 'dashboard.metrics.loads',
    name: 'Load Statistics',
    description: 'View load counts and statistics',
    page: 'dashboard',
    section: 'load-stats',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    priority: 1
  },
  {
    id: 'dashboard.quick-actions',
    name: 'Quick Actions',
    description: 'Access quick action buttons',
    page: 'dashboard',
    section: 'quick-actions',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    conditions: [
      {
        type: 'training',
        requirement: 'basic_system_training',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Complete basic system training to access quick actions'
      }
    ],
    priority: 2
  },

  // Dispatch Central Sections
  {
    id: 'dispatch.load-board',
    name: 'Load Board',
    description: 'View and manage load board',
    page: 'dispatch',
    section: 'load-board',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    conditions: [
      {
        type: 'training',
        requirement: 'dispatch_certification',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Dispatch certification required'
      },
      {
        type: 'compliance',
        requirement: 'dotStatus',
        value: 'compliant',
        operator: 'equals',
        blockType: 'section',
        message: 'DOT compliance required for dispatch operations'
      }
    ],
    priority: 3
  },
  {
    id: 'dispatch.create-load',
    name: 'Create Load',
    description: 'Create new loads in dispatch system',
    page: 'dispatch',
    section: 'create-load',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    conditions: [
      {
        type: 'training',
        requirement: 'load_creation_training',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Complete load creation training first'
      }
    ],
    priority: 4
  },
  {
    id: 'dispatch.assign-drivers',
    name: 'Assign Drivers',
    description: 'Assign drivers to loads',
    page: 'dispatch',
    section: 'assign-drivers',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    conditions: [
      {
        type: 'performance',
        requirement: 'rating',
        value: 3.5,
        operator: 'greater_than',
        blockType: 'section',
        message: 'Minimum performance rating of 3.5 required'
      }
    ],
    priority: 3
  },
  {
    id: 'dispatch.rate-management',
    name: 'Rate Management',
    description: 'View and edit freight rates',
    page: 'dispatch',
    section: 'rate-management',
    requiredRole: ['admin', 'manager'],
    priority: 5
  },

  // Driver Management Sections
  {
    id: 'drivers.view-all',
    name: 'View All Drivers',
    description: 'Access to all driver information',
    page: 'drivers',
    section: 'driver-list',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    priority: 1
  },
  {
    id: 'drivers.compliance-tracking',
    name: 'Compliance Tracking',
    description: 'Monitor driver compliance status',
    page: 'drivers',
    section: 'compliance-tracking',
    requiredRole: ['admin', 'manager'],
    conditions: [
      {
        type: 'certification',
        requirement: 'compliance_officer',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Compliance officer certification required'
      }
    ],
    priority: 4
  },
  {
    id: 'drivers.performance-metrics',
    name: 'Performance Metrics',
    description: 'View driver performance analytics',
    page: 'drivers',
    section: 'performance-metrics',
    requiredRole: ['admin', 'manager'],
    priority: 3
  },
  {
    id: 'drivers.schedule-management',
    name: 'Schedule Management',
    description: 'Manage driver schedules and assignments',
    page: 'drivers',
    section: 'schedule-management',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    conditions: [
      {
        type: 'training',
        requirement: 'schedule_management_training',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Schedule management training required'
      }
    ],
    priority: 2
  },

  // Analytics Sections
  {
    id: 'analytics.financial-reports',
    name: 'Financial Reports',
    description: 'Access financial analytics and reports',
    page: 'analytics',
    section: 'financial-reports',
    requiredRole: ['admin', 'manager'],
    priority: 5
  },
  {
    id: 'analytics.operational-metrics',
    name: 'Operational Metrics',
    description: 'View operational performance metrics',
    page: 'analytics',
    section: 'operational-metrics',
    requiredRole: ['admin', 'manager', 'dispatcher'],
    priority: 3
  },
  {
    id: 'analytics.export-data',
    name: 'Export Data',
    description: 'Export analytics data to external formats',
    page: 'analytics',
    section: 'export-data',
    requiredRole: ['admin', 'manager'],
    conditions: [
      {
        type: 'training',
        requirement: 'data_handling_certification',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'Data handling certification required for exports'
      }
    ],
    priority: 4
  },

  // Settings Sections
  {
    id: 'settings.user-management',
    name: 'User Management',
    description: 'Create and manage user accounts',
    page: 'settings',
    section: 'user-management',
    requiredRole: ['admin'],
    priority: 10
  },
  {
    id: 'settings.system-config',
    name: 'System Configuration',
    description: 'Configure system-wide settings',
    page: 'settings',
    section: 'system-config',
    requiredRole: ['admin'],
    conditions: [
      {
        type: 'certification',
        requirement: 'system_administrator',
        value: true,
        operator: 'equals',
        blockType: 'section',
        message: 'System administrator certification required'
      }
    ],
    priority: 10
  },

  // Conditional Page/App Access Examples
  {
    id: 'app.access',
    name: 'Application Access',
    description: 'Basic access to the application',
    page: '*',
    section: 'app-access',
    requiredRole: ['admin', 'manager', 'dispatcher', 'driver'],
    conditions: [
      {
        type: 'training',
        requirement: 'safety_training',
        value: true,
        operator: 'equals',
        blockType: 'app',
        message: 'Safety training must be completed before using FleetFlow'
      },
      {
        type: 'compliance',
        requirement: 'dotStatus',
        value: 'violation',
        operator: 'not_equals',
        blockType: 'app',
        message: 'DOT compliance violation detected. Access suspended until resolved.'
      }
    ],
    priority: 100
  },
  {
    id: 'training.required-modules',
    name: 'Training Gate',
    description: 'Blocks access until required training completed',
    page: '*',
    section: 'training-gate',
    requiredRole: ['driver'],
    conditions: [
      {
        type: 'training',
        requirement: 'driver_onboarding',
        value: true,
        operator: 'equals',
        blockType: 'app',
        message: 'Complete driver onboarding training before accessing FleetFlow'
      },
      {
        type: 'training',
        requirement: 'hos_regulations',
        value: true,
        operator: 'equals',
        blockType: 'app',
        message: 'Hours of Service training required for all drivers'
      }
    ],
    priority: 99
  }
];

// Permission evaluation engine
export class PermissionEvaluator {
  static evaluateUserAccess(
    userId: string,
    page: string,
    section: string,
    userProfile: UserPermissionProfile,
    userRole: string
  ): AccessResult {
    // Find relevant permissions for this page/section
    const relevantPermissions = SECTION_PERMISSIONS.filter(
      p => (p.page === page || p.page === '*') && (p.section === section || p.section === '*')
    ).sort((a, b) => b.priority - a.priority); // Sort by priority (higher first)

    for (const permission of relevantPermissions) {
      // Check if user has this permission
      if (!userProfile.permissions.includes(permission.id)) {
        continue; // Skip if permission not granted
      }

      // Check role requirements
      if (permission.requiredRole && !permission.requiredRole.includes(userRole)) {
        continue; // Skip if role not sufficient
      }

      // Check overrides
      const override = userProfile.overrides.find(o => o.permissionId === permission.id);
      if (override) {
        if (override.temporary && override.expiresAt && new Date(override.expiresAt) < new Date()) {
          continue; // Override expired
        }
        return {
          granted: override.granted,
          reason: override.reason,
          blockType: permission.conditions?.[0]?.blockType || 'section'
        };
      }

      // Evaluate conditions
      if (permission.conditions) {
        const conditionResult = this.evaluateConditions(permission.conditions, userProfile.conditions);
        if (!conditionResult.passed) {
          return {
            granted: false,
            reason: conditionResult.message || 'Access conditions not met',
            blockType: conditionResult.blockType || 'section'
          };
        }
      }

      // All checks passed
      return {
        granted: true,
        reason: 'Access granted',
        blockType: 'none'
      };
    }

    // No matching permission found
    return {
      granted: false,
      reason: 'No permission found for this section',
      blockType: 'section'
    };
  }

  static evaluateConditions(
    conditions: AccessCondition[],
    userStatus: UserConditionStatus
  ): ConditionResult {
    for (const condition of conditions) {
      const result = this.evaluateCondition(condition, userStatus);
      if (!result.passed) {
        return {
          passed: false,
          message: condition.message || 'Condition not met',
          blockType: condition.blockType
        };
      }
    }
    return { passed: true, message: 'All conditions met', blockType: 'none' };
  }

  static evaluateCondition(
    condition: AccessCondition,
    userStatus: UserConditionStatus
  ): ConditionResult {
    let actualValue: any;

    // Get the actual value based on condition type
    switch (condition.type) {
      case 'training':
        actualValue = userStatus.training.completed.includes(condition.requirement);
        break;
      case 'compliance':
        actualValue = (userStatus.compliance as any)[condition.requirement];
        break;
      case 'certification':
        actualValue = userStatus.certification.active.includes(condition.requirement);
        break;
      case 'performance':
        actualValue = (userStatus.performance as any)[condition.requirement];
        break;
      default:
        actualValue = null;
    }

    // Evaluate based on operator
    let passed = false;
    switch (condition.operator) {
      case 'equals':
        passed = actualValue === condition.value;
        break;
      case 'not_equals':
        passed = actualValue !== condition.value;
        break;
      case 'greater_than':
        passed = actualValue > condition.value;
        break;
      case 'less_than':
        passed = actualValue < condition.value;
        break;
      case 'contains':
        passed = Array.isArray(actualValue) ? actualValue.includes(condition.value) : false;
        break;
      default:
        passed = false;
    }

    return {
      passed,
      message: condition.message || 'Condition evaluation failed',
      blockType: condition.blockType
    };
  }
}

export interface AccessResult {
  granted: boolean;
  reason: string;
  blockType: 'section' | 'page' | 'app' | 'none';
}

export interface ConditionResult {
  passed: boolean;
  message: string;
  blockType: 'section' | 'page' | 'app' | 'none';
}

// Helper functions for React components
export const usePermissionCheck = (page: string, section: string, userId: string, userRole: string) => {
  // This would be implemented as a React hook in a real app
  // For now, returning a mock implementation
  return {
    hasAccess: true,
    reason: 'Mock access granted',
    blockType: 'none' as const
  };
};

export const createPermissionComponent = (
  page: string,
  section: string,
  children: React.ReactNode,
  fallbackComponent?: React.ReactNode
) => {
  // This would create a wrapper component that checks permissions
  // For now, returning children directly
  return children;
};
