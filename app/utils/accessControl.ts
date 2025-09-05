import {
  OrganizationUser,
  PERMISSIONS,
  PermissionType,
  ROLE_PERMISSIONS,
} from '../models/OrganizationUser';

export interface AccessControlCheck {
  hasAccess: boolean;
  reason?: string;
  requiredPermissions?: PermissionType[];
  userPermissions?: PermissionType[];
}

export class AccessControlService {
  /**
   * Check if a user has a specific permission in their current organization
   */
  static hasPermission(
    userPermissions: PermissionType[],
    requiredPermission: PermissionType
  ): AccessControlCheck {
    const hasAccess =
      userPermissions.includes(requiredPermission) ||
      userPermissions.includes('*');

    return {
      hasAccess,
      requiredPermissions: [requiredPermission],
      userPermissions,
      reason: hasAccess
        ? undefined
        : `Missing permission: ${requiredPermission}`,
    };
  }

  /**
   * Check if a user has any of the required permissions
   */
  static hasAnyPermission(
    userPermissions: PermissionType[],
    requiredPermissions: PermissionType[]
  ): AccessControlCheck {
    const hasAccess = requiredPermissions.some(
      (permission) =>
        userPermissions.includes(permission) || userPermissions.includes('*')
    );

    return {
      hasAccess,
      requiredPermissions,
      userPermissions,
      reason: hasAccess
        ? undefined
        : `Missing any of required permissions: ${requiredPermissions.join(', ')}`,
    };
  }

  /**
   * Check if a user has all of the required permissions
   */
  static hasAllPermissions(
    userPermissions: PermissionType[],
    requiredPermissions: PermissionType[]
  ): AccessControlCheck {
    const hasAccess = requiredPermissions.every(
      (permission) =>
        userPermissions.includes(permission) || userPermissions.includes('*')
    );

    return {
      hasAccess,
      requiredPermissions,
      userPermissions,
      reason: hasAccess
        ? undefined
        : `Missing permissions: ${requiredPermissions.filter((p) => !userPermissions.includes(p)).join(', ')}`,
    };
  }

  /**
   * Check if a user has a specific role
   */
  static hasRole(
    userRole: OrganizationUser['role'],
    requiredRole: OrganizationUser['role']
  ): boolean {
    return userRole === requiredRole;
  }

  /**
   * Check if a user has any of the required roles
   */
  static hasAnyRole(
    userRole: OrganizationUser['role'],
    requiredRoles: OrganizationUser['role'][]
  ): boolean {
    return requiredRoles.includes(userRole);
  }

  /**
   * Get all permissions for a specific role
   */
  static getRolePermissions(role: OrganizationUser['role']): PermissionType[] {
    return ROLE_PERMISSIONS[role] || [];
  }

  /**
   * Check if a user can perform an action based on their role and permissions
   */
  static canPerformAction(
    userRole: OrganizationUser['role'],
    userPermissions: PermissionType[],
    action: string
  ): AccessControlCheck {
    // Map actions to permissions
    const actionPermissionMap: Record<string, PermissionType[]> = {
      // Organization management
      manage_organization: [PERMISSIONS.MANAGE_ORGANIZATION],
      manage_subscription: [PERMISSIONS.MANAGE_SUBSCRIPTION],
      manage_users: [PERMISSIONS.MANAGE_USERS],
      invite_users: [PERMISSIONS.MANAGE_USERS],

      // Load operations
      view_loads: [PERMISSIONS.VIEW_LOADS],
      create_loads: [PERMISSIONS.CREATE_LOADS],
      edit_loads: [PERMISSIONS.EDIT_LOADS],
      delete_loads: [PERMISSIONS.DELETE_LOADS],
      assign_loads: [PERMISSIONS.EDIT_LOADS],

      // Carrier operations
      view_carriers: [PERMISSIONS.VIEW_CARRIERS],
      create_carriers: [PERMISSIONS.CREATE_CARRIERS],
      edit_carriers: [PERMISSIONS.EDIT_CARRIERS],
      delete_carriers: [PERMISSIONS.DELETE_CARRIERS],

      // Driver operations
      view_drivers: [PERMISSIONS.VIEW_DRIVERS],
      create_drivers: [PERMISSIONS.CREATE_DRIVERS],
      edit_drivers: [PERMISSIONS.EDIT_DRIVERS],
      delete_drivers: [PERMISSIONS.DELETE_DRIVERS],
      assign_drivers: [PERMISSIONS.EDIT_DRIVERS],

      // Financial operations
      view_financials: [PERMISSIONS.VIEW_FINANCIALS],
      create_invoices: [PERMISSIONS.CREATE_INVOICES],
      edit_invoices: [PERMISSIONS.EDIT_INVOICES],
      process_payments: [PERMISSIONS.VIEW_FINANCIALS],

      // Reporting
      view_reports: [PERMISSIONS.VIEW_REPORTS],
      export_data: [PERMISSIONS.EXPORT_DATA],
      advanced_analytics: [PERMISSIONS.VIEW_REPORTS],

      // Administrative actions
      system_settings: [PERMISSIONS.MANAGE_ORGANIZATION],
      billing_management: [PERMISSIONS.MANAGE_SUBSCRIPTION],
      user_management: [PERMISSIONS.MANAGE_USERS],
    };

    const requiredPermissions = actionPermissionMap[action];

    if (!requiredPermissions) {
      return {
        hasAccess: false,
        reason: `Unknown action: ${action}`,
        requiredPermissions: [],
        userPermissions,
      };
    }

    return this.hasAnyPermission(userPermissions, requiredPermissions);
  }

  /**
   * Get accessible menu items based on user permissions
   */
  static getAccessibleMenuItems(
    userRole: OrganizationUser['role'],
    userPermissions: PermissionType[]
  ): {
    operations: boolean;
    dispatch: boolean;
    drivers: boolean;
    carriers: boolean;
    financials: boolean;
    reports: boolean;
    admin: boolean;
    settings: boolean;
  } {
    return {
      operations: this.canPerformAction(userRole, userPermissions, 'view_loads')
        .hasAccess,
      dispatch: this.canPerformAction(userRole, userPermissions, 'assign_loads')
        .hasAccess,
      drivers: this.canPerformAction(userRole, userPermissions, 'view_drivers')
        .hasAccess,
      carriers: this.canPerformAction(
        userRole,
        userPermissions,
        'view_carriers'
      ).hasAccess,
      financials: this.canPerformAction(
        userRole,
        userPermissions,
        'view_financials'
      ).hasAccess,
      reports: this.canPerformAction(userRole, userPermissions, 'view_reports')
        .hasAccess,
      admin: userRole === 'owner' || userRole === 'admin',
      settings: this.canPerformAction(
        userRole,
        userPermissions,
        'manage_organization'
      ).hasAccess,
    };
  }

  /**
   * Get role hierarchy level (higher number = more permissions)
   */
  static getRoleLevel(role: OrganizationUser['role']): number {
    const roleLevels = {
      staff: 1,
      dispatcher: 2,
      agent: 3,
      admin: 4,
      owner: 5,
    };
    return roleLevels[role] || 0;
  }

  /**
   * Check if user can manage another user (based on role hierarchy)
   */
  static canManageUser(
    managerRole: OrganizationUser['role'],
    targetRole: OrganizationUser['role']
  ): boolean {
    const managerLevel = this.getRoleLevel(managerRole);
    const targetLevel = this.getRoleLevel(targetRole);

    // Owners can manage everyone
    if (managerRole === 'owner') return true;

    // Admins can manage everyone except owners
    if (managerRole === 'admin' && targetRole !== 'owner') return true;

    // Users can only manage users with lower or equal role levels
    return managerLevel > targetLevel;
  }

  /**
   * Validate permission combination for security
   */
  static validatePermissionCombination(
    role: OrganizationUser['role'],
    permissions: PermissionType[]
  ): { valid: boolean; violations: string[] } {
    const rolePermissions = ROLE_PERMISSIONS[role] || [];
    const violations: string[] = [];

    // Check for permissions that don't belong to the role
    const extraPermissions = permissions.filter(
      (p) => !rolePermissions.includes(p) && p !== '*'
    );

    if (extraPermissions.length > 0) {
      violations.push(
        `Role ${role} should not have permissions: ${extraPermissions.join(', ')}`
      );
    }

    // Check for missing required permissions
    const missingPermissions = rolePermissions.filter(
      (p) => !permissions.includes(p) && !permissions.includes('*')
    );

    if (missingPermissions.length > 0) {
      violations.push(
        `Role ${role} is missing required permissions: ${missingPermissions.join(', ')}`
      );
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}

// Export utility functions for easy access
export const checkPermission = (
  userPermissions: PermissionType[],
  permission: PermissionType
): AccessControlCheck => {
  return AccessControlService.hasPermission(userPermissions, permission);
};

export const checkAnyPermission = (
  userPermissions: PermissionType[],
  permissions: PermissionType[]
): AccessControlCheck => {
  return AccessControlService.hasAnyPermission(userPermissions, permissions);
};

export const checkAllPermissions = (
  userPermissions: PermissionType[],
  permissions: PermissionType[]
): AccessControlCheck => {
  return AccessControlService.hasAllPermissions(userPermissions, permissions);
};

export const checkAction = (
  userRole: OrganizationUser['role'],
  userPermissions: PermissionType[],
  action: string
): AccessControlCheck => {
  return AccessControlService.canPerformAction(
    userRole,
    userPermissions,
    action
  );
};

export const getAccessibleFeatures = (
  userRole: OrganizationUser['role'],
  userPermissions: PermissionType[]
) => {
  return AccessControlService.getAccessibleMenuItems(userRole, userPermissions);
};




