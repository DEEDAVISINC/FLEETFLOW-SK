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
    default:
      return true;
  }
}

// Get available dispatchers for load assignment
export function getAvailableDispatchers() {
  // Dispatcher data will be loaded from user management system
  return [];
}
