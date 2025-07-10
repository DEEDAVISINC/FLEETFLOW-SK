// Access Control Configuration
// In a production app, this would be managed by your authentication/authorization system

export interface UserPermissions {
  hasManagementAccess: boolean;
  hasAnalyticsAccess: boolean;
  hasFinancialsAccess: boolean;
  hasAdminAccess: boolean;
  canViewAllLoads: boolean;
  canAssignDispatcher: boolean;
  canManageOwnLoads: boolean;
  // Carrier Onboarding Permissions
  canAccessCarrierOnboarding: boolean;
  canStartNewOnboarding: boolean;
  canViewFMCSAData: boolean;
  canManageFactoring: boolean;
  canManageAgreements: boolean;
  canSetupPortalAccess: boolean;
  // Driver Management Permissions
  canManageDrivers: boolean;
  canViewDriverPortal: boolean;
  canManageCarrierPortal: boolean;
}

// Mock user roles - in production, this would come from your auth provider
export const USER_ROLES = {
  DRIVER: 'driver',
  DISPATCHER: 'dispatcher',
  BROKER: 'broker',
  MANAGER: 'manager',
  ADMIN: 'admin',
  INSTRUCTOR: 'instructor'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  brokerId?: string;
  dispatcherId?: string;
  assignedBrokers?: string[]; // For dispatchers - which brokers they handle
  companyName?: string; // For brokers - the company they work for
}

// Mock users database
export const MOCK_USERS: User[] = [
  { id: 'admin-001', name: 'System Admin', email: 'admin@fleetflow.com', role: 'admin' },
  { id: 'mgr-001', name: 'Fleet Manager', email: 'manager@fleetflow.com', role: 'manager' },
  { id: 'disp-001', name: 'Sarah Johnson', email: 'sarah@fleetflow.com', role: 'dispatcher', assignedBrokers: ['broker-001', 'broker-002'] },
  { id: 'disp-002', name: 'Mike Chen', email: 'mike@fleetflow.com', role: 'dispatcher', assignedBrokers: ['broker-003'] },
  { id: 'disp-003', name: 'Lisa Rodriguez', email: 'lisa@fleetflow.com', role: 'dispatcher', assignedBrokers: [] },
  { id: 'broker-001', name: 'John Smith', email: 'john.smith@globalfreight.com', role: 'broker', brokerId: 'broker-001', dispatcherId: 'disp-001', companyName: 'Global Freight Solutions' },
  { id: 'broker-002', name: 'Maria Garcia', email: 'maria.garcia@swift.com', role: 'broker', brokerId: 'broker-002', dispatcherId: 'disp-001', companyName: 'Swift Freight' },
  { id: 'broker-003', name: 'David Wilson', email: 'david.wilson@express.com', role: 'broker', brokerId: 'broker-003', dispatcherId: 'disp-002', companyName: 'Express Cargo' },
  { id: 'broker-004', name: 'Lisa Chen', email: 'lisa.chen@reliable.com', role: 'broker', brokerId: 'broker-004', companyName: 'Reliable Transport' }, // No dispatcher assigned
];

// Current user simulation - in production, this would come from your auth context
export const getCurrentUser = (): { user: User; permissions: UserPermissions } => {
  // Change this ID to test different users:
  const currentUserId = 'broker-001'; // Change to test: 'broker-001', 'disp-001', etc.
  
  const user = MOCK_USERS.find(u => u.id === currentUserId) || MOCK_USERS[0];
  
  const permissions: UserPermissions = {
    hasManagementAccess: ['manager', 'admin'].includes(user.role),
    hasAnalyticsAccess: ['manager', 'admin'].includes(user.role),
    hasFinancialsAccess: ['dispatcher', 'broker', 'manager', 'admin'].includes(user.role),
    hasAdminAccess: user.role === 'admin',
    canViewAllLoads: ['dispatcher', 'manager', 'admin'].includes(user.role),
    canAssignDispatcher: ['manager', 'admin'].includes(user.role),
    canManageOwnLoads: ['broker'].includes(user.role),
    // Carrier Onboarding Permissions
    canAccessCarrierOnboarding: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canStartNewOnboarding: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canViewFMCSAData: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canManageFactoring: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canManageAgreements: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canSetupPortalAccess: ['admin', 'manager', 'dispatcher'].includes(user.role),
    // Driver Management Permissions
    canManageDrivers: ['admin', 'manager', 'dispatcher'].includes(user.role),
    canViewDriverPortal: ['admin', 'manager', 'dispatcher', 'broker'].includes(user.role),
    canManageCarrierPortal: ['admin', 'manager', 'dispatcher'].includes(user.role)
  };
  
  return { user, permissions };
};

// Helper function to check specific permissions
export const checkPermission = (requiredPermission: keyof UserPermissions): boolean => {
  const { permissions } = getCurrentUser();
  return permissions[requiredPermission];
};

// Get available dispatchers for assignment
export const getAvailableDispatchers = (): User[] => {
  return MOCK_USERS.filter(user => user.role === 'dispatcher');
};

// Get brokers that need dispatcher assignment
export const getBrokersWithoutDispatcher = (): User[] => {
  return MOCK_USERS.filter(user => user.role === 'broker' && !user.dispatcherId);
};

// Get brokers assigned to a specific dispatcher
export const getBrokersByDispatcher = (dispatcherId: string): User[] => {
  return MOCK_USERS.filter(user => user.role === 'broker' && user.dispatcherId === dispatcherId);
};

// Assign dispatcher to broker
export const assignDispatcherToBroker = (brokerId: string, dispatcherId: string): boolean => {
  const brokerIndex = MOCK_USERS.findIndex(user => user.id === brokerId);
  const dispatcherIndex = MOCK_USERS.findIndex(user => user.id === dispatcherId);
  
  if (brokerIndex !== -1 && dispatcherIndex !== -1) {
    MOCK_USERS[brokerIndex].dispatcherId = dispatcherId;
    
    // Add broker to dispatcher's assigned list
    if (!MOCK_USERS[dispatcherIndex].assignedBrokers) {
      MOCK_USERS[dispatcherIndex].assignedBrokers = [];
    }
    if (!MOCK_USERS[dispatcherIndex].assignedBrokers!.includes(brokerId)) {
      MOCK_USERS[dispatcherIndex].assignedBrokers!.push(brokerId);
    }
    
    return true;
  }
  return false;
};

// Get loads visible to current user
export const getVisibleLoads = (allLoads: any[]): any[] => {
  const { user, permissions } = getCurrentUser();
  
  if (permissions.canViewAllLoads) {
    // Dispatchers, managers, and admins can see all loads
    return allLoads;
  } else if (user.role === 'broker') {
    // Brokers can only see their own loads
    return allLoads.filter(load => load.brokerId === user.brokerId);
  }
  
  return [];
};

// Role-based access control messages
export const ACCESS_MESSAGES = {
  analytics: {
    title: 'Fleet Analytics Access Restricted',
    message: 'This section contains sensitive performance metrics and business intelligence data.',
    requirement: 'Manager or Admin access required'
  },
  financials: {
    title: 'Financial Management Access Restricted', 
    message: 'This section contains sensitive financial information including invoices, expenses, and revenue data.',
    requirement: 'Manager or Admin access required'
  },
  admin: {
    title: 'Administrative Access Restricted',
    message: 'This section contains system-wide settings and user management capabilities.',
    requirement: 'Admin access required'
  }
} as const;

// FleetFlow University Training Access Control
export interface TrainingAccess {
  canAccessTraining: boolean;
  allowedModules: string[];
  canViewCertificates: boolean;
  canManageTraining?: boolean; // Admin only
  canViewAllProgress?: boolean; // Admin/Manager only
}

// Training module definitions with access requirements
export const TRAINING_MODULES = {
  DISPATCH: 'dispatch',
  BROKER: 'broker', 
  COMPLIANCE: 'compliance',
  SAFETY: 'safety',
  TECHNOLOGY: 'technology',
  CUSTOMER: 'customer',
  WORKFLOW: 'workflow'
} as const;

// Role-based training access configuration
export const getTrainingAccess = (userRole: UserRole): TrainingAccess => {
  switch (userRole) {
    case USER_ROLES.ADMIN:
      return {
        canAccessTraining: true,
        allowedModules: Object.values(TRAINING_MODULES),
        canViewCertificates: true,
        canManageTraining: true,
        canViewAllProgress: true
      };

    case USER_ROLES.MANAGER:
      return {
        canAccessTraining: true,
        allowedModules: Object.values(TRAINING_MODULES),
        canViewCertificates: true,
        canViewAllProgress: true
      };

    case USER_ROLES.DISPATCHER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.DISPATCH,
          TRAINING_MODULES.WORKFLOW,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.SAFETY,
          TRAINING_MODULES.TECHNOLOGY,
          TRAINING_MODULES.CUSTOMER
        ],
        canViewCertificates: true
      };

    case USER_ROLES.BROKER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.BROKER,
          TRAINING_MODULES.WORKFLOW,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.CUSTOMER
        ],
        canViewCertificates: true
      };

    case USER_ROLES.DRIVER:
      return {
        canAccessTraining: true,
        allowedModules: [
          TRAINING_MODULES.SAFETY,
          TRAINING_MODULES.COMPLIANCE,
          TRAINING_MODULES.TECHNOLOGY
        ],
        canViewCertificates: true
      };

    default:
      return {
        canAccessTraining: false,
        allowedModules: [],
        canViewCertificates: false
      };
  }
};

// Check if user has access to specific training module
export const hasModuleAccess = (userRole: UserRole, moduleId: string): boolean => {
  const access = getTrainingAccess(userRole);
  return access.canAccessTraining && access.allowedModules.includes(moduleId);
};

// Get user's training progress storage key (individualized)
export const getTrainingStorageKey = (userId: string): string => {
  return `fleetflow_university_progress_${userId}`;
};
