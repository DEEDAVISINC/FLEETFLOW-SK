// Training access management utilities
import { User, UserRole } from '../config/access'

export interface TrainingAccess {
  canAccessTraining: boolean;
  allowedModules: string[];
  canViewCertificates: boolean;
  canManageTraining?: boolean;
  canViewAllProgress?: boolean;
}

// Extended user interface for training assignments
export interface UserWithTraining extends User {
  status?: 'Active' | 'Inactive';
  permissions?: string[];
  assignedTrainingModules?: string[];
}

// Available training modules
export const TRAINING_MODULES = {
  DISPATCH: 'dispatch',
  BROKER: 'broker',
  COMPLIANCE: 'compliance',
  SAFETY: 'safety',
  TECHNOLOGY: 'technology',
  CUSTOMER: 'customer',
  WORKFLOW: 'workflow',
  SMS_WORKFLOW: 'sms-workflow'
} as const;

// Role-based default training access (fallback when no specific assignments)
const DEFAULT_ROLE_TRAINING_ACCESS: Record<string, string[]> = {
  'admin': Object.values(TRAINING_MODULES),
  'manager': ['dispatch', 'broker', 'compliance', 'safety', 'technology', 'customer', 'workflow'],
  'dispatcher': ['dispatch', 'compliance', 'safety', 'technology', 'workflow', 'customer'],
  'broker': ['broker', 'compliance', 'customer', 'workflow'],
  'driver': ['safety', 'compliance', 'technology'],
  'instructor': Object.values(TRAINING_MODULES),
  'viewer': []
};

/**
 * Get training access for a user based on their role and individual assignments
 */
export function getUserTrainingAccess(user: User | UserWithTraining): TrainingAccess {
  // Admin always has full access
  if (user.role === 'admin') {
    return {
      canAccessTraining: true,
      allowedModules: Object.values(TRAINING_MODULES),
      canViewCertificates: true,
      canManageTraining: true,
      canViewAllProgress: true
    };
  }

  // Use individual assignments if they exist, otherwise fall back to role defaults
  const userWithTraining = user as UserWithTraining;
  const allowedModules = userWithTraining.assignedTrainingModules && userWithTraining.assignedTrainingModules.length > 0
    ? userWithTraining.assignedTrainingModules
    : DEFAULT_ROLE_TRAINING_ACCESS[user.role] || [];

  return {
    canAccessTraining: allowedModules.length > 0,
    allowedModules,
    canViewCertificates: allowedModules.length > 0 || user.role === 'manager' || user.role === 'broker',
    canManageTraining: user.role === 'manager' || user.role === 'broker',
    canViewAllProgress: user.role === 'manager' || user.role === 'broker'
  };
}

/**
 * Check if user has access to a specific training module
 */
export function hasModuleAccess(user: User | UserWithTraining, moduleId: string): boolean {
  const access = getUserTrainingAccess(user);
  return access.allowedModules.includes(moduleId);
}

/**
 * Get training modules assigned to a user
 */
export function getUserAssignedModules(user: User | UserWithTraining): string[] {
  const access = getUserTrainingAccess(user);
  return access.allowedModules;
}

/**
 * Check if user has any training access
 */
export function hasAnyTrainingAccess(user: User | UserWithTraining): boolean {
  const access = getUserTrainingAccess(user);
  return access.canAccessTraining;
}

/**
 * Get training summary for a user
 */
export function getUserTrainingSummary(user: User | UserWithTraining): {
  totalModules: number;
  assignedModules: string[];
  hasCustomAssignments: boolean;
  accessType: 'admin' | 'custom' | 'role-based' | 'none';
} {
  if (user.role === 'admin') {
    return {
      totalModules: Object.values(TRAINING_MODULES).length,
      assignedModules: Object.values(TRAINING_MODULES),
      hasCustomAssignments: false,
      accessType: 'admin'
    };
  }

  const userWithTraining = user as UserWithTraining;
  const hasCustomAssignments = userWithTraining.assignedTrainingModules && userWithTraining.assignedTrainingModules.length > 0;
  const assignedModules = hasCustomAssignments 
    ? userWithTraining.assignedTrainingModules 
    : DEFAULT_ROLE_TRAINING_ACCESS[user.role] || [];

  return {
    totalModules: assignedModules?.length || 0,
    assignedModules: assignedModules || [],
    hasCustomAssignments: hasCustomAssignments || false,
    accessType: (assignedModules?.length || 0) > 0 
      ? (hasCustomAssignments ? 'custom' : 'role-based')
      : 'none'
  };
}

/**
 * Format training access description for UI
 */
export function formatTrainingAccessDescription(user: User | UserWithTraining): string {
  const summary = getUserTrainingSummary(user);
  
  switch (summary.accessType) {
    case 'admin':
      return 'Full access to all training modules (Admin)';
    case 'custom':
      return `Custom assignment: ${summary.totalModules} module${summary.totalModules !== 1 ? 's' : ''}`;
    case 'role-based':
      return `Role-based access: ${summary.totalModules} module${summary.totalModules !== 1 ? 's' : ''} (${user.role})`;
    case 'none':
      return 'No training access assigned';
    default:
      return 'Unknown access level';
  }
}
