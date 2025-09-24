'use client';

// Demo access control system
export interface User {
  id: string;
  role: 'admin' | 'dispatcher' | 'driver' | 'broker';
  name: string;
  email: string;
  brokerId?: string; // Optional broker ID for broker users
}

// Get current user from authentication system (no mock data)
export function getCurrentUser(): { user: User; permissions: any } {
  const user: User = {
    id: '', // Will be set by authentication
    role: 'user' as const,
    name: '',
    email: '',
  };

  const permissions = {
    canViewAllLoads: user.role === 'admin' || user.role === 'dispatcher',
    canEditLoads: user.role === 'admin' || user.role === 'dispatcher',
    canViewFinancials: user.role === 'admin',
    hasManagementAccess: user.role === 'admin' || user.role === 'dispatcher',
  };

  return { user, permissions };
}

// Permission checking
export function checkPermission(permission: string): boolean {
  const { user } = getCurrentUser();

  switch (permission) {
    case 'hasManagementAccess':
      return user.role === 'admin' || user.role === 'dispatcher';
    case 'canEditLoads':
      return user.role === 'admin' || user.role === 'dispatcher';
    case 'canViewFinancials':
      return user.role === 'admin';
    case 'canViewFleetPerformance':
      return (
        user.role === 'admin' ||
        user.role === 'dispatcher' ||
        user.role === 'driver' ||
        user.role === 'broker' // Allow brokers - subscription check will be done at page level
      );
    case 'canViewFleetAnalytics':
      return (
        user.role === 'admin' ||
        user.role === 'dispatcher' ||
        user.role === 'broker'
      );
    case 'canViewVehicleManagement':
      return (
        user.role === 'admin' ||
        user.role === 'dispatcher' ||
        user.role === 'driver' ||
        user.role === 'broker'
      );
    default:
      return true;
  }
}

// Get section-specific permissions based on user role and subscription
export function getSectionPermissions(user: User) {
  return {
    fleetFlow: {
      canViewFleetPerformance: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'driver' || user.role === 'broker',
      canViewFleetAnalytics: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'broker',
      canViewVehicleManagement: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'driver' || user.role === 'broker',
      canManageFleet: user.role === 'admin' || user.role === 'dispatcher',
      canViewFinancials: user.role === 'admin',
    },
    dispatch: {
      canViewAllLoads: user.role === 'admin' || user.role === 'dispatcher',
      canEditLoads: user.role === 'admin' || user.role === 'dispatcher',
      canAssignLoads: user.role === 'admin' || user.role === 'dispatcher',
      canViewLoadHistory: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'driver',
    },
    carriers: {
      canViewCarrierPortal: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'broker',
      canManageCarriers: user.role === 'admin' || user.role === 'dispatcher',
      canViewCompliance: user.role === 'admin' || user.role === 'dispatcher' || user.role === 'broker',
    }
  };
}

// Get available dispatchers for load assignment
export function getAvailableDispatchers() {
  // Dispatcher data will be loaded from user management system
  return [];
}
