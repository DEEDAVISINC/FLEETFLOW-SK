'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ICAOnboardingRecord } from '../services/ICAOnboardingService';

// Type definitions
interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  department: 'DC' | 'BB' | 'DM' | 'MGR' | 'CS' | 'SALES';
  role:
    | 'Admin'
    | 'Manager'
    | 'Dispatcher'
    | 'Broker'
    | 'Driver'
    | 'Viewer'
    | 'Customer Service'
    | 'Sales';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
  aiFlowOptIn?: boolean;
  phoneDialerOptIn?: boolean;
  compliance: {
    dotPhysical: {
      required: boolean;
      status: 'Valid' | 'Expired' | 'Required';
      expiration?: string;
    };
    drugTest: {
      required: boolean;
      status: 'Passed' | 'Failed' | 'Required';
      date?: string;
    };
    backgroundCheck: {
      required: boolean;
      status: 'Cleared' | 'Pending' | 'Required';
      date?: string;
    };
    fingerprints: {
      required: boolean;
      status: 'Processed' | 'Pending' | 'Required';
      date?: string;
    };
  };
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'users' | 'permissions' | 'general' | 'onboarding'
  >('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [icaOnboarding, setIcaOnboarding] =
    useState<ICAOnboardingRecord | null>(null);

  // Mock current user data for onboarding tab - in real app, get from auth context
  const currentUserData = {
    id: 'DD-MGR-20240115-1',
    departmentCode: 'MGR', // Change this to test different roles: 'DM', 'BB', 'DC', 'MGR'
    firstName: 'Dee',
    lastName: 'Davis',
  };
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [complianceExpanded, setComplianceExpanded] = useState(false);

  // Function to determine auto opt-ins based on department
  const getAutoOptIns = (department: User['department']) => {
    // Auto opt-in for management, sales, and customer service
    const autoOptInDepartments = ['MGR', 'CS', 'SALES'];
    const isAutoOptIn = autoOptInDepartments.includes(department);

    return {
      aiFlowOptIn: isAutoOptIn,
      phoneDialerOptIn:
        isAutoOptIn || department === 'BB' || department === 'DC', // Include brokers and dispatchers for phone dialer
    };
  };

  // Current user context
  const [currentUser] = useState<User>({
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
    permissions: ['all'],
    createdDate: '2024-01-01',
    aiFlowOptIn: true, // Auto-enabled for management
    phoneDialerOptIn: true, // Auto-enabled for management
    compliance: {
      dotPhysical: { required: false, status: 'Valid' },
      drugTest: { required: false, status: 'Passed' },
      backgroundCheck: {
        required: true,
        status: 'Cleared',
        date: '2024-01-01',
      },
      fingerprints: { required: true, status: 'Processed', date: '2024-01-01' },
    },
  });

  // Available permissions
  const [permissions] = useState<Permission[]>([
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
  ]);

  // Comprehensive users data for System Settings Hub
  const [users, setUsers] = useState<User[]>([
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
      permissions: ['all'],
      createdDate: '2024-01-01',
      aiFlowOptIn: true, // Auto-enabled for management
      phoneDialerOptIn: true, // Auto-enabled for management
      compliance: {
        dotPhysical: { required: false, status: 'Valid' },
        drugTest: { required: false, status: 'Passed' },
        backgroundCheck: {
          required: true,
          status: 'Cleared',
          date: '2024-01-01',
        },
        fingerprints: {
          required: true,
          status: 'Processed',
          date: '2024-01-01',
        },
      },
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
      ],
      createdDate: '2024-01-15',
      aiFlowOptIn: false, // Opt-in available for dispatchers
      phoneDialerOptIn: true, // Auto-enabled for dispatchers
      compliance: {
        dotPhysical: { required: false, status: 'Valid' },
        drugTest: { required: true, status: 'Passed', date: '2024-01-15' },
        backgroundCheck: {
          required: true,
          status: 'Cleared',
          date: '2024-01-10',
        },
        fingerprints: {
          required: true,
          status: 'Processed',
          date: '2024-01-12',
        },
      },
    },
    {
      id: 'JS-DM-2024032',
      name: 'John Smith',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@fleetflow.com',
      phone: '(555) 345-6789',
      location: 'Field',
      department: 'DM',
      role: 'Driver',
      status: 'Active',
      lastLogin: '2024-12-18 09:15',
      permissions: ['dashboard_view', 'routes_manage'],
      createdDate: '2024-02-01',
      aiFlowOptIn: false, // Not applicable for drivers
      phoneDialerOptIn: false, // Not applicable for drivers
      compliance: {
        dotPhysical: {
          required: true,
          status: 'Valid',
          expiration: '2025-12-01',
        },
        drugTest: { required: true, status: 'Passed', date: '2024-02-01' },
        backgroundCheck: {
          required: true,
          status: 'Cleared',
          date: '2024-01-28',
        },
        fingerprints: {
          required: true,
          status: 'Processed',
          date: '2024-01-30',
        },
      },
    },
    {
      id: 'MW-BB-2024061',
      name: 'Mike Wilson',
      firstName: 'Mike',
      lastName: 'Wilson',
      email: 'mike.wilson@fleetflow.com',
      phone: '(555) 456-7890',
      location: 'Sales Office',
      department: 'BB',
      role: 'Broker',
      status: 'Active',
      lastLogin: '2024-12-19 12:15',
      permissions: [
        'dashboard_view',
        'broker_access',
        'customer_management',
        'reports_view',
        'invoices_view',
      ],
      createdDate: '2024-01-20',
      aiFlowOptIn: false, // Opt-in available for brokers
      phoneDialerOptIn: true, // Auto-enabled for brokers
      compliance: {
        dotPhysical: { required: false, status: 'Valid' },
        drugTest: { required: true, status: 'Passed', date: '2024-01-20' },
        backgroundCheck: {
          required: true,
          status: 'Cleared',
          date: '2024-01-18',
        },
        fingerprints: {
          required: true,
          status: 'Processed',
          date: '2024-01-19',
        },
      },
    },
  ]);

  // Enhanced user form state for comprehensive creation
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    department: 'DC' as User['department'],
    role: 'Viewer' as User['role'],
    permissions: [] as string[],
    aiFlowOptIn: false,
    phoneDialerOptIn: false,
    compliance: {
      dotPhysical: { required: false, status: 'Required' as const },
      drugTest: { required: false, status: 'Required' as const },
      backgroundCheck: { required: false, status: 'Required' as const },
      fingerprints: { required: false, status: 'Required' as const },
    },
  });

  // Filtered users for search
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.role.toLowerCase().includes(term) ||
      user.id.toLowerCase().includes(term) ||
      user.department.toLowerCase().includes(term)
    );
  });

  // Department colors and labels
  const getDepartmentConfig = (dept: string) => {
    const config = {
      DC: {
        color: '#3b82f6',
        bg: '#dbeafe',
        label: 'Dispatcher',
        name: 'Dispatch',
      },
      BB: {
        color: '#f59e0b',
        bg: '#fef3c7',
        label: 'Broker Agent',
        name: 'Brokerage',
      },
      DM: {
        color: '#eab308',
        bg: '#fef3c7',
        label: 'Driver',
        name: 'Driver Management',
      },
      MGR: {
        color: '#8b5cf6',
        bg: '#e0e7ff',
        label: 'Management',
        name: 'Management',
      },
      CS: {
        color: '#10b981',
        bg: '#d1fae5',
        label: 'Customer Service',
        name: 'Customer Support',
      },
      SALES: {
        color: '#dc2626',
        bg: '#fee2e2',
        label: 'Sales Team',
        name: 'Revenue Generation',
      },
    };
    return config[dept as keyof typeof config] || config.DC;
  };

  // Navigation helpers
  const goToNextUser = () => {
    setCurrentUserIndex((prev) => (prev + 1) % filteredUsers.length);
  };

  const goToPrevUser = () => {
    setCurrentUserIndex(
      (prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length
    );
  };

  const goToUser = (index: number) => {
    setCurrentUserIndex(index);
  };

  const rolePermissions: Record<User['role'], string[]> = {
    Admin: ['all'],
    Manager: [
      'dashboard_view',
      'vehicles_manage',
      'drivers_manage',
      'routes_manage',
      'maintenance_manage',
      'reports_view',
      'invoices_view',
      'financial_reports',
    ],
    Dispatcher: [
      'dashboard_view',
      'dispatch_access',
      'routes_manage',
      'drivers_manage',
      'invoices_view',
    ],
    Broker: [
      'dashboard_view',
      'broker_access',
      'customer_management',
      'reports_view',
      'invoices_view',
    ],
    'Customer Service': [
      'dashboard_view',
      'customer_management',
      'reports_view',
      'invoices_view',
    ],
    Sales: [
      'dashboard_view',
      'broker_access',
      'customer_management',
      'reports_view',
      'invoices_view',
      'financial_reports',
    ],
    Driver: ['dashboard_view', 'routes_manage'],
    Viewer: ['dashboard_view', 'reports_view'],
  };

  const createUser = () => {
    if (!newUser.firstName || !newUser.lastName || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    const deptCode = newUser.department;
    const initials = `${newUser.firstName[0]}${newUser.lastName[0]}`;
    const year = new Date().getFullYear();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(year, 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );

    // Apply auto opt-in logic based on department
    const autoOptIns = getAutoOptIns(newUser.department);

    const user: User = {
      id: `${initials}-${deptCode}-${year}${dayOfYear.toString().padStart(3, '0')}`,
      name: `${newUser.firstName} ${newUser.lastName}`,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      location: newUser.location,
      department: newUser.department,
      role: newUser.role,
      status: 'Active',
      lastLogin: 'Never',
      permissions:
        newUser.role === 'Admin' ? ['all'] : rolePermissions[newUser.role],
      createdDate: new Date().toISOString().split('T')[0],
      aiFlowOptIn: autoOptIns.aiFlowOptIn,
      phoneDialerOptIn: autoOptIns.phoneDialerOptIn,
      compliance: newUser.compliance,
    };

    setUsers([...users, user]);
    setNewUser({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      department: 'DC',
      role: 'Viewer',
      permissions: [],
      aiFlowOptIn: false,
      phoneDialerOptIn: false,
      compliance: {
        dotPhysical: { required: false, status: 'Required' },
        drugTest: { required: false, status: 'Required' },
        backgroundCheck: { required: false, status: 'Required' },
        fingerprints: { required: false, status: 'Required' },
      },
    });
    setShowCreateUser(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === 'Active'
                  ? 'Inactive'
                  : ('Active' as 'Active' | 'Inactive'),
            }
          : user
      )
    );
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter((p) => p.category === category);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px',
      }}
    >
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: '32px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 12px 0',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🏢 System Settings Hub
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
            }}
          >
            Comprehensive user management and administration center
          </p>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '8px',
            marginBottom: '24px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('users')}
            style={{
              background:
                activeTab === 'users'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('onboarding')}
            style={{
              background:
                activeTab === 'onboarding'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            📋 Onboarding
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            style={{
              background:
                activeTab === 'permissions'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            🔐 Permissions
          </button>
          <button
            onClick={() => setActiveTab('general')}
            style={{
              background:
                activeTab === 'general'
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'transparent',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            ⚙️ General
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div>
            {/* Hub Control Panel */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <span
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    User {currentUserIndex + 1} of {filteredUsers.length}
                  </span>
                  <button
                    onClick={() => setSearchEnabled(!searchEnabled)}
                    style={{
                      background: searchEnabled
                        ? '#3b82f6'
                        : 'rgba(59, 130, 246, 0.2)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🔍 {searchEnabled ? 'Hide Search' : 'Search Users'}
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={goToPrevUser}
                    disabled={filteredUsers.length === 0}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={goToNextUser}
                    disabled={filteredUsers.length === 0}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Next →
                  </button>
                  <button
                    onClick={() => setShowCreateUser(true)}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ➕ Create New User
                  </button>
                </div>
              </div>

              {searchEnabled && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginTop: '16px',
                  }}
                >
                  <input
                    type='text'
                    placeholder='Search by name, email, role, ID, or department...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '16px',
                      outline: 'none',
                    }}
                  />
                  {searchTerm && (
                    <div
                      style={{
                        marginTop: '12px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {filteredUsers.slice(0, 10).map((user, index) => {
                        const config = getDepartmentConfig(user.department);
                        return (
                          <button
                            key={user.id}
                            onClick={() => {
                              goToUser(index);
                              setSearchTerm('');
                              setSearchEnabled(false);
                            }}
                            style={{
                              background: config.bg,
                              color: config.color,
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: '600',
                            }}
                          >
                            {user.name} ({user.department})
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* User Navigation Tabs */}
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  flexWrap: 'wrap',
                  marginTop: '16px',
                }}
              >
                {filteredUsers.map((user, index) => {
                  const config = getDepartmentConfig(user.department);
                  return (
                    <button
                      key={user.id}
                      onClick={() => goToUser(index)}
                      style={{
                        background:
                          index === currentUserIndex
                            ? config.color
                            : 'rgba(255, 255, 255, 0.1)',
                        color:
                          index === currentUserIndex
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.7)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        border:
                          index === currentUserIndex
                            ? `2px solid ${config.color}`
                            : '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {user.firstName[0]}
                      {user.lastName[0]}-{user.department}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Book-Style User Profile Display */}

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '32px',
                minHeight: '600px',
              }}
            >
              {filteredUsers.length > 0 ? (
                (() => {
                  const currentUser = filteredUsers[currentUserIndex];
                  const config = getDepartmentConfig(currentUser.department);

                  return (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '32px',
                      }}
                    >
                      {/* User Profile Header */}
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '32px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                          border: `3px solid ${config.color}`,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <div>
                            <h2
                              style={{
                                fontSize: '32px',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                margin: '0 0 8px 0',
                              }}
                            >
                              {currentUser.name}
                            </h2>
                            <div
                              style={{
                                background: config.bg,
                                color: config.color,
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'inline-block',
                                marginBottom: '16px',
                              }}
                            >
                              {config.label} ({currentUser.department})
                            </div>
                            <div
                              style={{
                                fontSize: '18px',
                                color: '#6b7280',
                                marginBottom: '8px',
                              }}
                            >
                              📧 {currentUser.email}
                            </div>
                            {currentUser.phone && (
                              <div
                                style={{
                                  fontSize: '18px',
                                  color: '#6b7280',
                                  marginBottom: '8px',
                                }}
                              >
                                📱 {currentUser.phone}
                              </div>
                            )}
                            {currentUser.location && (
                              <div
                                style={{
                                  fontSize: '18px',
                                  color: '#6b7280',
                                  marginBottom: '8px',
                                }}
                              >
                                📍 {currentUser.location}
                              </div>
                            )}
                            <div style={{ fontSize: '16px', color: '#6b7280' }}>
                              🆔 User ID:{' '}
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: '600',
                                }}
                              >
                                {currentUser.id}
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                              onClick={() => setSelectedUser(currentUser)}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              ✏️ Edit Profile
                            </button>
                            <button
                              style={{
                                background: '#16a34a',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              💬 Send Message
                            </button>
                            <button
                              style={{
                                background: '#f59e0b',
                                color: 'white',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                border: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              📊 View Reports
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Compliance Management Section */}
                      <div
                        style={{
                          background: 'white',
                          borderRadius: '16px',
                          padding: '24px',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '12px',
                            borderBottom: '2px solid #f3f4f6',
                          }}
                        >
                          <h3
                            style={{
                              fontSize: '24px',
                              fontWeight: '600',
                              color: '#1f2937',
                              margin: 0,
                            }}
                          >
                            🔧 Compliance Management
                          </h3>
                          <button
                            onClick={() =>
                              setComplianceExpanded(!complianceExpanded)
                            }
                            style={{
                              background: complianceExpanded
                                ? '#ef4444'
                                : '#16a34a',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '14px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {complianceExpanded ? '▲ Collapse' : '▼ Expand'}
                          </button>
                        </div>

                        {complianceExpanded && (
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(300px, 1fr))',
                              gap: '20px',
                            }}
                          >
                            {/* DOT Physical */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>🏥</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  DOT Physical
                                </h4>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    color: '#374151',
                                  }}
                                >
                                  <input
                                    type='checkbox'
                                    checked={
                                      currentUser.compliance.dotPhysical
                                        .required
                                    }
                                    style={{ transform: 'scale(1.2)' }}
                                    readOnly
                                  />
                                  Required
                                </label>
                              </div>
                              <div
                                style={{
                                  background:
                                    currentUser.compliance.dotPhysical
                                      .status === 'Valid'
                                      ? '#dcfce7'
                                      : currentUser.compliance.dotPhysical
                                            .status === 'Expired'
                                        ? '#fee2e2'
                                        : '#fef3c7',
                                  color:
                                    currentUser.compliance.dotPhysical
                                      .status === 'Valid'
                                      ? '#166534'
                                      : currentUser.compliance.dotPhysical
                                            .status === 'Expired'
                                        ? '#dc2626'
                                        : '#92400e',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                }}
                              >
                                Status:{' '}
                                {currentUser.compliance.dotPhysical.status}
                              </div>
                              {currentUser.compliance.dotPhysical
                                .expiration && (
                                <div
                                  style={{ fontSize: '14px', color: '#6b7280' }}
                                >
                                  Expires:{' '}
                                  {
                                    currentUser.compliance.dotPhysical
                                      .expiration
                                  }
                                </div>
                              )}
                              <button
                                style={{
                                  background: '#16a34a',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginTop: '8px',
                                }}
                              >
                                🔧 Setup
                              </button>
                            </div>

                            {/* Drug Test */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>🧪</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  Drug Test
                                </h4>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    color: '#374151',
                                  }}
                                >
                                  <input
                                    type='checkbox'
                                    checked={
                                      currentUser.compliance.drugTest.required
                                    }
                                    style={{ transform: 'scale(1.2)' }}
                                    readOnly
                                  />
                                  Required
                                </label>
                              </div>
                              <div
                                style={{
                                  background:
                                    currentUser.compliance.drugTest.status ===
                                    'Passed'
                                      ? '#dcfce7'
                                      : currentUser.compliance.drugTest
                                            .status === 'Failed'
                                        ? '#fee2e2'
                                        : '#fef3c7',
                                  color:
                                    currentUser.compliance.drugTest.status ===
                                    'Passed'
                                      ? '#166534'
                                      : currentUser.compliance.drugTest
                                            .status === 'Failed'
                                        ? '#dc2626'
                                        : '#92400e',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                }}
                              >
                                Status: {currentUser.compliance.drugTest.status}
                              </div>
                              {currentUser.compliance.drugTest.date && (
                                <div
                                  style={{ fontSize: '14px', color: '#6b7280' }}
                                >
                                  Date: {currentUser.compliance.drugTest.date}
                                </div>
                              )}
                              <button
                                style={{
                                  background: '#16a34a',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginTop: '8px',
                                }}
                              >
                                🔧 Setup
                              </button>
                            </div>

                            {/* Background Check */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>🔍</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  Background Check
                                </h4>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    color: '#374151',
                                  }}
                                >
                                  <input
                                    type='checkbox'
                                    checked={
                                      currentUser.compliance.backgroundCheck
                                        .required
                                    }
                                    style={{ transform: 'scale(1.2)' }}
                                    readOnly
                                  />
                                  Required
                                </label>
                              </div>
                              <div
                                style={{
                                  background:
                                    currentUser.compliance.backgroundCheck
                                      .status === 'Cleared'
                                      ? '#dcfce7'
                                      : currentUser.compliance.backgroundCheck
                                            .status === 'Pending'
                                        ? '#fef3c7'
                                        : '#fee2e2',
                                  color:
                                    currentUser.compliance.backgroundCheck
                                      .status === 'Cleared'
                                      ? '#166534'
                                      : currentUser.compliance.backgroundCheck
                                            .status === 'Pending'
                                        ? '#92400e'
                                        : '#dc2626',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                }}
                              >
                                Status:{' '}
                                {currentUser.compliance.backgroundCheck.status}
                              </div>
                              {currentUser.compliance.backgroundCheck.date && (
                                <div
                                  style={{ fontSize: '14px', color: '#6b7280' }}
                                >
                                  Date:{' '}
                                  {currentUser.compliance.backgroundCheck.date}
                                </div>
                              )}
                              <button
                                style={{
                                  background: '#16a34a',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginTop: '8px',
                                }}
                              >
                                🔧 Setup
                              </button>
                            </div>

                            {/* Fingerprints */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>👆</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  Fingerprints
                                </h4>
                              </div>
                              <div style={{ marginBottom: '12px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '16px',
                                    color: '#374151',
                                  }}
                                >
                                  <input
                                    type='checkbox'
                                    checked={
                                      currentUser.compliance.fingerprints
                                        .required
                                    }
                                    style={{ transform: 'scale(1.2)' }}
                                    readOnly
                                  />
                                  Required
                                </label>
                              </div>
                              <div
                                style={{
                                  background:
                                    currentUser.compliance.fingerprints
                                      .status === 'Processed'
                                      ? '#dcfce7'
                                      : currentUser.compliance.fingerprints
                                            .status === 'Pending'
                                        ? '#fef3c7'
                                        : '#fee2e2',
                                  color:
                                    currentUser.compliance.fingerprints
                                      .status === 'Processed'
                                      ? '#166534'
                                      : currentUser.compliance.fingerprints
                                            .status === 'Pending'
                                        ? '#92400e'
                                        : '#dc2626',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                }}
                              >
                                Status:{' '}
                                {currentUser.compliance.fingerprints.status}
                              </div>
                              {currentUser.compliance.fingerprints.date && (
                                <div
                                  style={{ fontSize: '14px', color: '#6b7280' }}
                                >
                                  Date:{' '}
                                  {currentUser.compliance.fingerprints.date}
                                </div>
                              )}
                              <button
                                style={{
                                  background: '#16a34a',
                                  color: 'white',
                                  padding: '6px 12px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  border: 'none',
                                  cursor: 'pointer',
                                  marginTop: '8px',
                                }}
                              >
                                🔧 Setup
                              </button>
                            </div>
                          </div>
                        )}

                        {/* AI Flow & Phone Dialer Opt-ins */}
                        <div
                          style={{
                            background: 'white',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                            marginTop: '24px',
                          }}
                        >
                          <h3
                            style={{
                              fontSize: '24px',
                              fontWeight: '600',
                              color: '#1f2937',
                              margin: '0 0 16px 0',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            🤖 AI Platform Features
                          </h3>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '20px',
                            }}
                          >
                            {/* AI Flow Lead Generation */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>🎯</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  AI Flow Lead Generation
                                </h4>
                              </div>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  marginBottom: '16px',
                                }}
                              >
                                Automated lead discovery and prospecting using
                                AI-powered market analysis
                              </p>
                              <div
                                style={{
                                  background: currentUser.aiFlowOptIn
                                    ? '#dcfce7'
                                    : currentUser.department === 'MGR' ||
                                        currentUser.department === 'CS' ||
                                        currentUser.department === 'SALES'
                                      ? '#dbeafe'
                                      : '#fef3c7',
                                  color: currentUser.aiFlowOptIn
                                    ? '#166534'
                                    : currentUser.department === 'MGR' ||
                                        currentUser.department === 'CS' ||
                                        currentUser.department === 'SALES'
                                      ? '#1e40af'
                                      : '#92400e',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                  textAlign: 'center',
                                }}
                              >
                                {currentUser.aiFlowOptIn
                                  ? '✅ ENROLLED'
                                  : currentUser.department === 'MGR' ||
                                      currentUser.department === 'CS' ||
                                      currentUser.department === 'SALES'
                                    ? '🔄 AUTO-ENABLED'
                                    : currentUser.department === 'DM'
                                      ? '❌ NOT APPLICABLE'
                                      : '⏳ OPT-IN AVAILABLE'}
                              </div>
                              {(currentUser.department === 'BB' ||
                                currentUser.department === 'DC') &&
                                !currentUser.aiFlowOptIn && (
                                  <button
                                    style={{
                                      background: '#3b82f6',
                                      color: 'white',
                                      padding: '8px 16px',
                                      borderRadius: '6px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      border: 'none',
                                      cursor: 'pointer',
                                      width: '100%',
                                    }}
                                  >
                                    🚀 Enable AI Flow
                                  </button>
                                )}
                            </div>

                            {/* Phone Dialer System */}
                            <div
                              style={{
                                background: '#f8fafc',
                                borderRadius: '12px',
                                padding: '20px',
                                border: '2px solid #e2e8f0',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginBottom: '16px',
                                }}
                              >
                                <span style={{ fontSize: '24px' }}>📞</span>
                                <h4
                                  style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#1f2937',
                                    margin: 0,
                                  }}
                                >
                                  Phone Dialer System
                                </h4>
                              </div>
                              <p
                                style={{
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  marginBottom: '16px',
                                }}
                              >
                                AI-powered calling system with FreeSWITCH
                                integration for customer outreach
                              </p>
                              <div
                                style={{
                                  background: currentUser.phoneDialerOptIn
                                    ? '#dcfce7'
                                    : currentUser.department === 'DM'
                                      ? '#fee2e2'
                                      : '#fef3c7',
                                  color: currentUser.phoneDialerOptIn
                                    ? '#166534'
                                    : currentUser.department === 'DM'
                                      ? '#dc2626'
                                      : '#92400e',
                                  padding: '8px 12px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  marginBottom: '12px',
                                  textAlign: 'center',
                                }}
                              >
                                {currentUser.phoneDialerOptIn
                                  ? '✅ ENROLLED'
                                  : currentUser.department === 'DM'
                                    ? '❌ NOT APPLICABLE'
                                    : '🔄 AUTO-ENABLED'}
                              </div>
                              {currentUser.phoneDialerOptIn && (
                                <div
                                  style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    textAlign: 'center',
                                  }}
                                >
                                  Extension:{' '}
                                  {currentUser.phone
                                    ? `x${currentUser.phone.slice(-4)}`
                                    : 'TBD'}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Department-specific messaging */}
                          <div
                            style={{
                              marginTop: '20px',
                              padding: '16px',
                              background:
                                currentUser.department === 'MGR' ||
                                currentUser.department === 'CS' ||
                                currentUser.department === 'SALES'
                                  ? '#eff6ff'
                                  : currentUser.department === 'DM'
                                    ? '#fef2f2'
                                    : '#fefce8',
                              borderRadius: '8px',
                              border:
                                '1px solid ' +
                                (currentUser.department === 'MGR' ||
                                currentUser.department === 'CS' ||
                                currentUser.department === 'SALES'
                                  ? '#bfdbfe'
                                  : currentUser.department === 'DM'
                                    ? '#fecaca'
                                    : '#fde68a'),
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color:
                                  currentUser.department === 'MGR' ||
                                  currentUser.department === 'CS' ||
                                  currentUser.department === 'SALES'
                                    ? '#1e40af'
                                    : currentUser.department === 'DM'
                                      ? '#dc2626'
                                      : '#92400e',
                                marginBottom: '4px',
                              }}
                            >
                              {currentUser.department === 'MGR'
                                ? '👑 MANAGEMENT PRIVILEGES'
                                : currentUser.department === 'CS'
                                  ? '🎧 CUSTOMER SERVICE ACCESS'
                                  : currentUser.department === 'SALES'
                                    ? '💼 SALES TEAM ACCESS'
                                    : currentUser.department === 'DM'
                                      ? '🚛 DRIVER PROFILE'
                                      : '⚙️ CONFIGURABLE ACCESS'}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>
                              {currentUser.department === 'MGR' ||
                              currentUser.department === 'CS' ||
                              currentUser.department === 'SALES'
                                ? 'AI Flow and Phone Dialer automatically enabled for revenue generation roles'
                                : currentUser.department === 'DM'
                                  ? 'AI platforms not applicable for driver operations'
                                  : 'Phone Dialer auto-enabled. AI Flow available as opt-in for enhanced lead generation'}
                            </div>
                          </div>
                        </div>

                        {/* Grant Access Button */}
                        <div
                          style={{
                            textAlign: 'center',
                            marginTop: '24px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e5e7eb',
                          }}
                        >
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #16a34a, #15803d)',
                              color: 'white',
                              padding: '16px 32px',
                              borderRadius: '12px',
                              fontSize: '18px',
                              fontWeight: '600',
                              border: 'none',
                              cursor: 'pointer',
                              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.3)',
                            }}
                          >
                            ✅ Grant Full System Access
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                  <h3
                    style={{
                      fontSize: '24px',
                      color: '#6b7280',
                      margin: '0 0 16px 0',
                    }}
                  >
                    No Users Found
                  </h3>
                  <p
                    style={{
                      fontSize: '16px',
                      color: '#9ca3af',
                      marginBottom: '24px',
                    }}
                  >
                    {searchTerm
                      ? 'No users match your search criteria.'
                      : 'No users have been created yet.'}
                  </p>
                  <button
                    onClick={() => setShowCreateUser(true)}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a, #15803d)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ➕ Create First User
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Create User Modal */}
        {showCreateUser && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 50,
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <div
                style={{
                  padding: '24px 24px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 16px 0',
                  }}
                >
                  Create New User
                </h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      First Name
                    </label>
                    <input
                      type='text'
                      value={newUser.firstName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, firstName: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      placeholder='Enter first name'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      value={newUser.lastName}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lastName: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      placeholder='Enter last name'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type='email'
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      placeholder='Enter email address'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      value={newUser.phone}
                      onChange={(e) =>
                        setNewUser({ ...newUser, phone: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      placeholder='(555) 123-4567'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Location
                    </label>
                    <input
                      type='text'
                      value={newUser.location}
                      onChange={(e) =>
                        setNewUser({ ...newUser, location: e.target.value })
                      }
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                      placeholder='Work location or office'
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Department
                    </label>
                    <select
                      value={newUser.department}
                      onChange={(e) => {
                        const dept = e.target.value as User['department'];
                        const roleMap = {
                          DC: 'Dispatcher' as User['role'],
                          BB: 'Broker' as User['role'],
                          DM: 'Driver' as User['role'],
                          MGR: 'Manager' as User['role'],
                          CS: 'Customer Service' as User['role'],
                          SALES: 'Sales' as User['role'],
                        };
                        setNewUser({
                          ...newUser,
                          department: dept,
                          role: roleMap[dept],
                        });
                      }}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                      }}
                    >
                      <option value='DC'>
                        🚛 Dispatcher (DC) - Dispatch Operations
                      </option>
                      <option value='BB'>
                        🤝 Broker Agent (BB) - Freight Brokerage
                      </option>
                      <option value='DM'>👨‍💼 Driver (DM) - Fleet Drivers</option>
                      <option value='MGR'>
                        👔 Management (MGR) - Administrative Roles
                      </option>
                      <option value='CS'>
                        🎧 Customer Service (CS) - Customer Support
                      </option>
                      <option value='SALES'>
                        💼 Sales Team (SALES) - Revenue Generation
                      </option>
                    </select>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '4px',
                        margin: '4px 0 0 0',
                      }}
                    >
                      Role will be auto-selected based on department
                    </p>
                  </div>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Role
                    </label>
                    <input
                      type='text'
                      value={newUser.role}
                      readOnly
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        fontSize: '16px',
                        outline: 'none',
                        backgroundColor: '#f9fafb',
                        color: '#6b7280',
                      }}
                    />
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginTop: '4px',
                        margin: '4px 0 0 0',
                      }}
                    >
                      Permissions will be assigned based on role
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px',
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <button
                    onClick={() => setShowCreateUser(false)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createUser}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'white',
                      background: '#3b82f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    Create User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {selectedUser && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              zIndex: 50,
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px',
                width: '100%',
              }}
            >
              <div
                style={{
                  padding: '24px 24px 0',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 16px 0',
                  }}
                >
                  Edit User: {selectedUser.name}
                </h3>
              </div>
              <div style={{ padding: '24px' }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Permissions
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        maxHeight: '240px',
                        overflowY: 'auto',
                      }}
                    >
                      {selectedUser.permissions.includes('all') ? (
                        <div
                          style={{
                            fontSize: '14px',
                            color: '#16a34a',
                            fontWeight: '600',
                          }}
                        >
                          👑 Admin - All Permissions Granted
                        </div>
                      ) : (
                        permissions.map((permission) => (
                          <label
                            key={permission.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <input
                              type='checkbox'
                              checked={selectedUser.permissions.includes(
                                permission.id
                              )}
                              style={{
                                borderRadius: '4px',
                                borderColor: '#d1d5db',
                                color: '#3b82f6',
                              }}
                              readOnly
                            />
                            <span
                              style={{ fontSize: '14px', color: '#374151' }}
                            >
                              {permission.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '24px',
                    paddingTop: '16px',
                    borderTop: '1px solid #e5e7eb',
                  }}
                >
                  <button
                    onClick={() => setSelectedUser(null)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      background: '#f3f4f6',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                Onboarding Workflow
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0,
                }}
              >
                {currentUserData.departmentCode === 'DM'
                  ? 'Carrier onboarding workflow for drivers'
                  : 'Independent Contractor Agreement (ICA) workflow for internal staff'}
              </p>
            </div>

            {/* Role-based Onboarding Display */}
            {currentUserData.departmentCode === 'DM' ? (
              // Driver/Carrier Onboarding Workflow
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    CARRIER ONBOARD WORKFLOW
                  </span>
                  <span
                    style={{
                      color: '#f4a832',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    66% COMPLETE
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>FMCSA Verification</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>
                      Travel Limits & Commodities
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Document Upload</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Factoring Setup</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#f4a832' }}>🔄</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      Agreement Signing
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#6b7280' }}>⏳</span>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Portal Setup
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background: 'rgba(244, 168, 50, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid rgba(244, 168, 50, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color: '#f4a832',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    CURRENT STEP
                  </div>
                  <div style={{ color: 'white', fontSize: '13px' }}>
                    Electronic signature required for carrier agreement
                  </div>
                </div>
              </div>
            ) : (
              // ICA Onboarding Workflow for Internal Staff
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    INDEPENDENT CONTRACTOR AGREEMENT
                  </span>
                  <span
                    style={{
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: 'bold',
                    }}
                  >
                    {currentUserData.departmentCode === 'MGR'
                      ? '90% COMPLETE'
                      : '75% COMPLETE'}
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Personal Information</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>
                      Experience Verification
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Background Check</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Document Generation</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>Contract Signing</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>NDA Signing</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ color: '#10b981' }}>✅</span>
                    <span style={{ color: 'white' }}>
                      Insurance Verification
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? '#10b981'
                            : '#f4a832',
                      }}
                    >
                      {currentUserData.departmentCode === 'MGR' ? '✅' : '🔄'}
                    </span>
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Training Completion
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? '#10b981'
                            : '#6b7280',
                      }}
                    >
                      {currentUserData.departmentCode === 'MGR' ? '✅' : '⏳'}
                    </span>
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      System Access Setup
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? '#10b981'
                            : '#6b7280',
                      }}
                    >
                      {currentUserData.departmentCode === 'MGR' ? '✅' : '⏳'}
                    </span>
                    <span
                      style={{
                        color:
                          currentUserData.departmentCode === 'MGR'
                            ? 'white'
                            : 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Workflow Integration
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px',
                    background:
                      currentUserData.departmentCode === 'MGR'
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px',
                    border:
                      currentUserData.departmentCode === 'MGR'
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <div
                    style={{
                      color:
                        currentUserData.departmentCode === 'MGR'
                          ? '#10b981'
                          : '#3b82f6',
                      fontSize: '11px',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    {currentUserData.departmentCode === 'MGR'
                      ? 'COMPLETED'
                      : 'CURRENT STEP'}
                  </div>
                  <div style={{ color: 'white', fontSize: '13px' }}>
                    {currentUserData.departmentCode === 'MGR'
                      ? 'All onboarding requirements completed successfully'
                      : currentUserData.departmentCode === 'BB'
                        ? 'Complete freight brokerage training modules'
                        : currentUserData.departmentCode === 'DC'
                          ? 'Complete dispatch operations training'
                          : 'Complete role-specific training requirements'}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                📋 View Full Workflow
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                📄 Download Documents
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🔄 Continue Onboarding
              </button>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 16px 0',
              }}
            >
              System Permissions
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 24px 0',
              }}
            >
              Configure user access levels and permissions
            </p>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}
              >
                Permissions management coming soon...
              </p>
            </div>
          </div>
        )}

        {/* General Tab */}
        {activeTab === 'general' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 16px 0',
              }}
            >
              General Settings
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 24px 0',
              }}
            >
              System-wide configuration options
            </p>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <p
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}
              >
                General settings coming soon...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
