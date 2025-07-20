// Access Control Utilities for Application-Wide Permission Enforcement
import { User } from '../config/access';
import { getUserPagePermissions, hasGranularPermission, UserWithGranularPermissions } from '../config/granularAccess';

/**
 * Access Control Hook for Components
 * Use this in any component to check if the current user has permission for specific actions
 */
export class AccessControl {
  private user: User | UserWithGranularPermissions;
  private assignedPermissions: string[] | undefined;

  constructor(user: User | UserWithGranularPermissions, assignedPermissions?: string[]) {
    this.user = user;
    this.assignedPermissions = assignedPermissions || (user as UserWithGranularPermissions).assignedPermissions;
  }

  /**
   * Check if user has permission for a specific path (e.g., 'dashboard.view', 'dispatch.create')
   */
  can(permission: string): boolean {
    return hasGranularPermission(this.user, permission, this.assignedPermissions);
  }

  /**
   * Check if user can access a specific page
   */
  canAccessPage(page: string): boolean {
    return this.can(`${page}.view`);
  }

  /**
   * Get all permissions for current user
   */
  getAllPermissions() {
    return getUserPagePermissions(this.user, this.assignedPermissions);
  }

  /**
   * Check multiple permissions at once
   */
  canAny(permissions: string[]): boolean {
    return permissions.some(permission => this.can(permission));
  }

  /**
   * Check if user has all specified permissions
   */
  canAll(permissions: string[]): boolean {
    return permissions.every(permission => this.can(permission));
  }

  /**
   * Get user role
   */
  getRole(): string {
    return this.user.role;
  }

  /**
   * Check if user is admin (has 'all' permission)
   */
  isAdmin(): boolean {
    return this.assignedPermissions?.includes('all') || this.user.role === 'admin';
  }
}

/**
 * Component-level access control decorator
 */
export interface AccessControlledComponentProps {
  user: User | UserWithGranularPermissions;
  requiredPermission?: string;
  requiredPermissions?: string[];
  fallbackComponent?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Access-controlled wrapper component
 */
export function AccessControlled({ 
  user, 
  requiredPermission, 
  requiredPermissions = [], 
  fallbackComponent = null, 
  children 
}: AccessControlledComponentProps) {
  const accessControl = new AccessControl(user);
  
  // Check single permission
  if (requiredPermission && !accessControl.can(requiredPermission)) {
    return <>{fallbackComponent}</>;
  }
  
  // Check multiple permissions (user needs ANY of them)
  if (requiredPermissions.length > 0 && !accessControl.canAny(requiredPermissions)) {
    return <>{fallbackComponent}</>;
  }
  
  return <>{children}</>;
}

/**
 * Page-level access control utilities
 */
export const PageAccess = {
  /**
   * Dashboard page sections
   */
  Dashboard: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dashboard.view'),
    canViewRevenue: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dashboard.revenue'),
    canViewPerformance: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dashboard.performance'),
    canCreateLoad: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dashboard.create_load'),
    canExportData: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dashboard.export'),
  },

  /**
   * Dispatch page sections
   */
  Dispatch: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.view'),
    canViewAll: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.view_all'),
    canCreate: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.create'),
    canEdit: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.edit'),
    canDelete: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.delete'),
    canAssignDrivers: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.assign_drivers'),
    canViewRates: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.view_rates'),
    canEditRates: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('dispatch.edit_rates'),
  },

  /**
   * Analytics page sections
   */
  Analytics: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('analytics.view'),
    canViewRevenue: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('analytics.revenue'),
    canViewPerformance: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('analytics.performance'),
    canExport: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('analytics.export'),
    canCreateCustomReports: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('analytics.custom_reports'),
  },

  /**
   * Financial page sections
   */
  Financial: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.view'),
    canViewInvoices: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.view_invoices'),
    canCreateInvoices: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.create_invoices'),
    canEditInvoices: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.edit_invoices'),
    canViewPayments: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.view_payments'),
    canProcessPayments: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.process_payments'),
    canViewAuditTrail: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('financial.audit_trail'),
  },

  /**
   * Settings page sections
   */
  Settings: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.view'),
    canManageUsers: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.user_management'),
    canCreateUsers: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.create_users'),
    canEditUsers: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.edit_users'),
    canManagePermissions: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.manage_permissions'),
    canViewSystemSettings: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('settings.system_settings'),
  },

  /**
   * Training page sections
   */
  Training: {
    canView: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.view'),
    canTakeQuizzes: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.take_quizzes'),
    canViewAllProgress: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.all_progress'),
    canManageContent: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.manage_content'),
    canAssignModules: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.assign_modules'),
    canManageInstructors: (user: User | UserWithGranularPermissions) => new AccessControl(user).can('training.manage_instructors'),
  }
};

/**
 * Feature-level access control utilities
 */
export const FeatureAccess = {
  /**
   * Button and action controls
   */
  Buttons: {
    canShowCreateButton: (user: User | UserWithGranularPermissions, context: string) => {
      return new AccessControl(user).can(`${context}.create`);
    },
    canShowEditButton: (user: User | UserWithGranularPermissions, context: string) => {
      return new AccessControl(user).can(`${context}.edit`);
    },
    canShowDeleteButton: (user: User | UserWithGranularPermissions, context: string) => {
      return new AccessControl(user).can(`${context}.delete`);
    },
    canShowExportButton: (user: User | UserWithGranularPermissions, context: string) => {
      return new AccessControl(user).can(`${context}.export`);
    },
  },

  /**
   * Data visibility controls
   */
  Data: {
    canViewSensitiveFinancialData: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).canAny(['financial.view_payments', 'financial.profit_loss', 'financial.cash_flow']);
    },
    canViewAllUserData: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).can('settings.user_management');
    },
    canViewSystemHealthData: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).can('settings.system_health');
    },
  },

  /**
   * Navigation and menu controls
   */
  Navigation: {
    shouldShowAnalyticsMenu: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).can('analytics.view');
    },
    shouldShowFinancialMenu: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).can('financial.view');
    },
    shouldShowSettingsMenu: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).can('settings.view');
    },
    shouldShowAdminMenu: (user: User | UserWithGranularPermissions) => {
      return new AccessControl(user).isAdmin();
    },
  }
};

/**
 * Access control error messages
 */
export const AccessMessages = {
  INSUFFICIENT_PERMISSIONS: 'You do not have sufficient permissions to perform this action.',
  PAGE_ACCESS_DENIED: 'Access to this page is restricted. Contact your administrator for access.',
  FEATURE_ACCESS_DENIED: 'This feature is not available with your current permissions.',
  ADMIN_ONLY: 'This action requires administrative privileges.',
  MANAGER_ONLY: 'This action requires manager-level access or higher.',
};

/**
 * React hook for access control
 */
export function useAccessControl(user: User | UserWithGranularPermissions) {
  return new AccessControl(user);
}

export default AccessControl;
