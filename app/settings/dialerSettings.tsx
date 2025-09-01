'use client';

// Dialer Settings Integration for User Management
// This file contains the updates needed for app/settings/page.tsx

export const DIALER_PERMISSION = {
  id: 'dialer_access',
  name: 'Phone Dialer Access',
  description:
    'Access to integrated phone dialer system for making business calls',
  category: 'Communication',
};

// Add this to the permissions array in app/settings/page.tsx:
export const UPDATED_PERMISSIONS = [
  {
    id: 'dashboard_view',
    name: 'View Dashboard',
    description: 'Access to main dashboard and metrics',
    category: 'Core',
  },
  {
    id: 'vehicles_manage',
    name: 'Manage Vehicles',
    description: 'Add, edit, and delete vehicles',
    category: 'Core',
  },
  {
    id: 'drivers_manage',
    name: 'Manage Drivers',
    description: 'Add, edit, and delete driver profiles',
    category: 'Core',
  },
  {
    id: 'routes_manage',
    name: 'Manage Routes',
    description: 'Create and modify routes',
    category: 'Core',
  },
  {
    id: 'dispatch_access',
    name: 'Dispatch Central',
    description: 'Access dispatch operations and load assignment',
    category: 'Core',
  },
  {
    id: 'broker_access',
    name: 'Broker Box',
    description: 'Access freight brokerage features',
    category: 'Core',
  },
  {
    id: 'quoting_access',
    name: 'Freight Quoting',
    description: 'Generate and manage freight quotes',
    category: 'Core',
  },
  {
    id: 'maintenance_manage',
    name: 'Maintenance Management',
    description: 'Schedule and track vehicle maintenance',
    category: 'Core',
  },
  {
    id: 'invoices_view',
    name: 'View Invoices',
    description: 'Access invoice history and details',
    category: 'Financial',
  },
  {
    id: 'invoices_manage',
    name: 'Manage Invoices',
    description: 'Create, edit, and delete invoices',
    category: 'Financial',
  },
  {
    id: 'financial_reports',
    name: 'Financial Reports',
    description: 'Access financial analytics and reports',
    category: 'Financial',
  },
  {
    id: 'expense_manage',
    name: 'Expense Management',
    description: 'Track and manage business expenses',
    category: 'Financial',
  },
  {
    id: 'reports_view',
    name: 'View Reports',
    description: 'Access standard reports and analytics',
    category: 'Reports',
  },
  {
    id: 'reports_export',
    name: 'Export Reports',
    description: 'Export reports to various formats',
    category: 'Reports',
  },
  {
    id: 'analytics_advanced',
    name: 'Advanced Analytics',
    description: 'Access advanced analytics and insights',
    category: 'Reports',
  },
  {
    id: 'users_manage',
    name: 'User Management',
    description: 'Create, edit, and delete user accounts',
    category: 'Admin',
  },
  {
    id: 'permissions_manage',
    name: 'Permission Management',
    description: 'Assign and modify user permissions',
    category: 'Admin',
  },
  {
    id: 'system_settings',
    name: 'System Settings',
    description: 'Configure system-wide settings',
    category: 'Admin',
  },
  {
    id: 'audit_logs',
    name: 'Audit Logs',
    description: 'View system audit and activity logs',
    category: 'Admin',
  },
  DIALER_PERMISSION, // Add the dialer permission
];

// Sample users with dialer access configured
export const SAMPLE_USERS_WITH_DIALER = [
  {
    id: 'FM-MGR-2023005',
    name: 'Fleet Manager',
    firstName: 'Fleet',
    lastName: 'Manager',
    email: 'manager@fleetflow.com',
    phone: '(555) 123-4567',
    location: 'Main Office',
    department: 'MGR',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Current session',
    permissions: ['all'], // Admin has all permissions including dialer
    createdDate: '2024-01-01',
  },
  {
    id: 'SJ-DC-2024014',
    name: 'Sarah Johnson',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@fleetflow.com',
    phone: '(555) 234-5678',
    location: 'Dispatch Center',
    department: 'DC',
    role: 'Dispatcher',
    status: 'Active',
    lastLogin: '2024-12-18 14:30',
    permissions: [
      'dashboard_view',
      'dispatch_access',
      'routes_manage',
      'drivers_manage',
      'invoices_view',
      'dialer_access',
    ], // Dispatcher with dialer enabled
    createdDate: '2024-01-15',
  },
  {
    id: 'JD-DM-2024020',
    name: 'John Davis',
    firstName: 'John',
    lastName: 'Davis',
    email: 'john.d@fleetflow.com',
    phone: '(555) 345-6789',
    location: 'On Route',
    department: 'DM',
    role: 'Driver',
    status: 'Active',
    lastLogin: '2024-12-18 09:15',
    permissions: ['dashboard_view'], // Driver - no dialer access (restricted)
    createdDate: '2024-02-01',
  },
  {
    id: 'MW-BB-2024025',
    name: 'Mike Wilson',
    firstName: 'Mike',
    lastName: 'Wilson',
    email: 'mike.wilson@fleetflow.com',
    phone: '(555) 456-7890',
    location: 'Broker Office',
    department: 'BB',
    role: 'Broker',
    status: 'Active',
    lastLogin: '2024-12-19 12:15',
    permissions: [
      'dashboard_view',
      'broker_access',
      'quoting_access',
      'reports_view',
      'invoices_view',
    ], // Broker without dialer (optional, disabled)
    createdDate: '2024-01-20',
  },
  {
    id: 'LC-CS-2024030',
    name: 'Lisa Chen',
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.chen@fleetflow.com',
    phone: '(555) 567-8901',
    location: 'Customer Service',
    department: 'CS',
    role: 'Customer Service',
    status: 'Active',
    lastLogin: '2024-12-19 15:30',
    permissions: ['dashboard_view', 'invoices_view', 'reports_view'], // Customer Service - dialer is required (automatic)
    createdDate: '2024-03-01',
  },
  {
    id: 'RT-SALES-2024035',
    name: 'Robert Taylor',
    firstName: 'Robert',
    lastName: 'Taylor',
    email: 'robert.taylor@fleetflow.com',
    phone: '(555) 678-9012',
    location: 'Sales Office',
    department: 'SALES',
    role: 'Sales',
    status: 'Active',
    lastLogin: '2024-12-19 16:45',
    permissions: [
      'dashboard_view',
      'broker_access',
      'quoting_access',
      'reports_view',
    ], // Sales - dialer is required (automatic)
    createdDate: '2024-03-15',
  },
];

// Instructions for integration:
/*
To integrate dialer access into app/settings/page.tsx:

1. Add the import at the top:
   import DialerAccessManagement from '../components/DialerAccessManagement';
   import { getDialerAccess } from '../utils/dialerAccess';

2. Replace the permissions array with UPDATED_PERMISSIONS from this file

3. Update the sample users with SAMPLE_USERS_WITH_DIALER from this file

4. Add the DialerAccessManagement component in the user details section,
   after the compliance section and before the ""Grant Access"" button:

   <DialerAccessManagement
     user={selectedUser}
     onUpdateUser={(updatedUser) => {
       setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
     }}
   />

5. The dialer widget can then be added to any page using:
   <FloatingDialerWidget
     userRole={currentUser.role}
     department={currentUser.department}
     hasDialerAccess={currentUser.permissions.includes('dialer_access')}
   />
*/
