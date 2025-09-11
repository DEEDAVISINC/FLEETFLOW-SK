'use client'

// Demo access control system
export interface User {
  id: string
  role: 'admin' | 'dispatcher' | 'driver' | 'broker'
  name: string
  email: string
  brokerId?: string // Optional broker ID for broker users
}

// Mock current user for demo
export function getCurrentUser(): { user: User; permissions: any } {
  const user: User = {
    id: '1',
    role: 'admin' as const,
    name: 'Demo User',
    email: 'demo@fleetflowapp.com'
  }
  
  const permissions = {
    canViewAllLoads: user.role === 'admin' || user.role === 'dispatcher',
    canEditLoads: user.role === 'admin' || user.role === 'dispatcher',
    canViewFinancials: user.role === 'admin',
    hasManagementAccess: user.role === 'admin' || user.role === 'dispatcher'
  }
  
  return { user, permissions }
}

// Permission checking
export function checkPermission(permission: string): boolean {
  const { user } = getCurrentUser()
  
  switch (permission) {
    case 'hasManagementAccess':
      return user.role === 'admin' || user.role === 'dispatcher'
    case 'canEditLoads':
      return user.role === 'admin' || user.role === 'dispatcher'
    case 'canViewFinancials':
      return user.role === 'admin'
    default:
      return true
  }
}

// Get available dispatchers for load assignment
export function getAvailableDispatchers() {
  // Mock dispatcher list for demo
  return [
    { id: '1', name: 'John Smith', email: 'john@fleetflowapp.com' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah@fleetflowapp.com' },
    { id: '3', name: 'Mike Davis', email: 'mike@fleetflowapp.com' },
    { id: '4', name: 'Lisa Wilson', email: 'lisa@fleetflowapp.com' }
  ]
}
