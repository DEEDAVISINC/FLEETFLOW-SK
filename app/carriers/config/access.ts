// Access Control Configuration for Carriers
export interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

// Mock user data
const mockUsers: User[] = [
  {
    id: 'user_001',
    name: 'Admin User',
    email: 'admin@fleetflowapp.com',
    role: 'admin',
    permissions: ['*'],
  },
  {
    id: 'user_002',
    name: 'Broker User',
    email: 'broker@fleetflowapp.com',
    role: 'broker',
    permissions: [
      'view_carriers',
      'manage_carriers',
      'view_onboarding',
      'manage_onboarding',
      'canManageCarrierPortal',
    ],
  },
  {
    id: 'user_003',
    name: 'Dispatcher User',
    email: 'dispatcher@fleetflowapp.com',
    role: 'dispatcher',
    permissions: ['view_carriers', 'view_onboarding'],
  },
];

// Get current user (mock implementation)
export const getCurrentUser = (): User => {
  // In a real app, this would come from authentication
  return mockUsers[0]; // Return admin user for now
};

// Check if user has permission
export const checkPermission = (permission: string): boolean => {
  const user = getCurrentUser();

  // Admin has all permissions
  if (user.permissions.includes('*')) {
    return true;
  }

  // Check specific permission
  return user.permissions.includes(permission);
};

// Access control messages
export const ACCESS_MESSAGES = {
  CARRIERS_VIEW: 'You need permission to view carrier information.',
  CARRIERS_MANAGE: 'You need permission to manage carriers.',
  ONBOARDING_VIEW: 'You need permission to view onboarding data.',
  ONBOARDING_MANAGE: 'You need permission to manage onboarding processes.',
  GENERAL_ACCESS: 'You do not have permission to access this resource.',
};

// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  BROKER: 'broker',
  DISPATCHER: 'dispatcher',
  CARRIER: 'carrier',
  DRIVER: 'driver',
};

// Permission definitions
export const PERMISSIONS = {
  ALL: '*',
  VIEW_CARRIERS: 'view_carriers',
  MANAGE_CARRIERS: 'manage_carriers',
  VIEW_ONBOARDING: 'view_onboarding',
  MANAGE_ONBOARDING: 'manage_onboarding',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_ANALYTICS: 'manage_analytics',
  VIEW_ACCOUNTING: 'view_accounting',
  MANAGE_ACCOUNTING: 'manage_accounting',
};
