'use client';

import Link from 'next/link';
import { useState } from 'react';
import ExecutiveComplianceCenter from '../components/ExecutiveComplianceCenter';

// Enhanced Type Definitions for Subscription-First Access Control
type UserRole =
  | 'admin'
  | 'manager'
  | 'dispatcher'
  | 'broker'
  | 'driver'
  | 'viewer';
type SubscriptionTier =
  | 'university'
  | 'dispatcher'
  | 'brokerage'
  | 'enterprise'
  | 'driver_free';
type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'canceled';

interface TemporaryPermission {
  permission: string;
  expiresAt: Date;
  type: 'grant' | 'revoke';
}

interface PermissionHistory {
  timestamp: Date;
  action: 'grant' | 'revoke' | 'subscription_change';
  permission: string;
  reason: string;
  authorizedBy: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdDate: string;

  // Subscription-based access control
  subscriptionStatus: SubscriptionStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionPlanIds: string[];
  subscriptionExpiresAt: Date;
  trialEndsAt?: Date;

  // Custom permission overrides
  customPermissions: {
    granted: string[];
    revoked: string[];
    temporary: TemporaryPermission[];
  };

  // Audit trail
  permissionHistory: PermissionHistory[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface SubscriptionFeatures {
  features: string[];
  maxUsers: number | 'unlimited';
  phoneMinutes: number | 'unlimited';
  smsMessages: number | 'unlimited';
  price: number;
}

// Subscription Feature Definitions
const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  driver_free: {
    features: ['driver_otr_flow', 'dispatch_connection', 'basic_notifications'],
    maxUsers: 1,
    phoneMinutes: 0,
    smsMessages: 0,
    price: 0,
  },
  university: {
    features: [
      'training',
      'basic_dashboard',
      'compliance_view',
      'progress_tracking',
    ],
    maxUsers: 5,
    phoneMinutes: 0,
    smsMessages: 0,
    price: 49,
  },
  dispatcher: {
    features: [
      'training',
      'full_dashboard',
      'dispatch_operations',
      'driver_management',
      'basic_phone',
      'route_optimization',
    ],
    maxUsers: 10,
    phoneMinutes: 50,
    smsMessages: 25,
    price: 79,
  },
  brokerage: {
    features: [
      'training',
      'full_dashboard',
      'broker_operations',
      'analytics',
      'crm',
      'advanced_phone',
      'load_matching',
      'market_rates',
    ],
    maxUsers: 25,
    phoneMinutes: 500,
    smsMessages: 200,
    price: 199,
  },
  enterprise: {
    features: [
      'all_features',
      'unlimited_ai',
      'unlimited_phone',
      'api_access',
      'custom_integrations',
      'dedicated_support',
    ],
    maxUsers: 'unlimited',
    phoneMinutes: 'unlimited',
    smsMessages: 'unlimited',
    price: 3999,
  },
};

// Role Filters - What roles can access within subscription boundaries
const ROLE_FILTERS: Record<UserRole, (features: string[]) => string[]> = {
  admin: (features) => features,
  manager: (features) => features.filter((f) => !f.includes('admin')),
  dispatcher: (features) =>
    features.filter(
      (f) =>
        f.includes('dispatch') ||
        f.includes('basic') ||
        f.includes('training') ||
        f.includes('driver')
    ),
  broker: (features) =>
    features.filter(
      (f) =>
        f.includes('broker') ||
        f.includes('basic') ||
        f.includes('training') ||
        f.includes('crm') ||
        f.includes('analytics')
    ),
  driver: (features) =>
    features.filter(
      (f) =>
        f.includes('basic') ||
        f.includes('training') ||
        f.includes('driver_otr_flow') ||
        f.includes('dispatch_connection') ||
        f.includes('basic_notifications')
    ),
  viewer: (features) =>
    features.filter((f) => f.includes('basic') || f.includes('training')),
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    'users' | 'permissions' | 'general' | 'compliance'
  >('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissionManager, setShowPermissionManager] = useState(false);

  // Current user context
  const [currentUser] = useState<User>({
    id: 'U001',
    name: 'Fleet Manager',
    email: 'manager@fleetflowapp.com',
    role: 'admin',
    status: 'Active',
    lastLogin: 'Current session',
    createdDate: '2024-01-01',
    subscriptionStatus: 'active',
    subscriptionTier: 'enterprise',
    subscriptionPlanIds: ['enterprise'],
    subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    customPermissions: { granted: [], revoked: [], temporary: [] },
    permissionHistory: [],
  });

  // Available permissions
  const [permissions] = useState<Permission[]>([
    // Core Features
    {
      id: 'training',
      name: 'FleetFlow University',
      description: 'Access training modules and certifications',
      category: 'Core',
    },
    {
      id: 'basic_dashboard',
      name: 'Basic Dashboard',
      description: 'View basic metrics and alerts',
      category: 'Core',
    },
    {
      id: 'full_dashboard',
      name: 'Full Dashboard',
      description: 'Complete dashboard with all metrics',
      category: 'Core',
    },
    {
      id: 'dispatch_operations',
      name: 'Dispatch Operations',
      description: 'Load assignment and dispatch management',
      category: 'Core',
    },
    {
      id: 'driver_management',
      name: 'Driver Management',
      description: 'Manage driver profiles and scheduling',
      category: 'Core',
    },
    {
      id: 'broker_operations',
      name: 'Broker Operations',
      description: 'Freight brokerage and load posting',
      category: 'Core',
    },
    {
      id: 'route_optimization',
      name: 'Route Optimization',
      description: 'Plan and optimize delivery routes',
      category: 'Core',
    },

    // Advanced Features
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      description: 'Business intelligence and reporting',
      category: 'Analytics',
    },
    {
      id: 'crm',
      name: 'CRM System',
      description: 'Customer relationship management',
      category: 'Analytics',
    },
    {
      id: 'load_matching',
      name: 'Load Matching',
      description: 'AI-powered load matching system',
      category: 'Analytics',
    },
    {
      id: 'market_rates',
      name: 'Market Rates',
      description: 'Real-time freight rate data',
      category: 'Analytics',
    },

    // Communication
    {
      id: 'basic_phone',
      name: 'Basic Phone System',
      description: 'Basic calling and SMS capabilities',
      category: 'Communication',
    },
    {
      id: 'advanced_phone',
      name: 'Advanced Phone System',
      description: 'Full phone system with monitoring',
      category: 'Communication',
    },
    {
      id: 'unlimited_phone',
      name: 'Unlimited Phone',
      description: 'Unlimited calling and SMS',
      category: 'Communication',
    },

    // Compliance
    {
      id: 'compliance_view',
      name: 'Compliance Viewing',
      description: 'View DOT compliance and safety records',
      category: 'Compliance',
    },
    {
      id: 'compliance_manage',
      name: 'Compliance Management',
      description: 'Manage compliance documents and audits',
      category: 'Compliance',
    },

    // Enterprise
    {
      id: 'api_access',
      name: 'API Access',
      description: 'Access to FleetFlow APIs',
      category: 'Enterprise',
    },
    {
      id: 'custom_integrations',
      name: 'Custom Integrations',
      description: 'Custom system integrations',
      category: 'Enterprise',
    },
    {
      id: 'unlimited_ai',
      name: 'Unlimited AI',
      description: 'Unlimited AI operations and workflows',
      category: 'Enterprise',
    },

    // Driver OTR Flow
    {
      id: 'driver_otr_flow',
      name: 'Driver OTR Flow',
      description: 'Access to Driver Over-The-Road workflow system',
      category: 'Driver',
    },
    {
      id: 'dispatch_connection',
      name: 'Dispatch Connection',
      description: 'Connect and communicate with dispatch central',
      category: 'Driver',
    },
    {
      id: 'basic_notifications',
      name: 'Basic Notifications',
      description: 'Receive load assignments and status updates',
      category: 'Driver',
    },

    // Admin
    {
      id: 'user_management',
      name: 'User Management',
      description: 'Create and manage user accounts',
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

  // Enhanced users with subscription data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'U001',
      name: 'Fleet Manager',
      email: 'manager@fleetflowapp.com',
      role: 'admin',
      status: 'Active',
      lastLogin: 'Current session',
      createdDate: '2024-01-01',
      subscriptionStatus: 'active',
      subscriptionTier: 'enterprise',
      subscriptionPlanIds: ['enterprise'],
      subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      customPermissions: { granted: [], revoked: [], temporary: [] },
      permissionHistory: [],
    },
    {
      id: 'U002',
      name: 'Sarah Johnson',
      email: 'sarah.j@fleetflowapp.com',
      role: 'dispatcher',
      status: 'Active',
      lastLogin: '2024-12-18 14:30',
      createdDate: '2024-01-15',
      subscriptionStatus: 'trial',
      subscriptionTier: 'dispatcher',
      subscriptionPlanIds: ['dispatcher'],
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      customPermissions: { granted: ['analytics'], revoked: [], temporary: [] },
      permissionHistory: [
        {
          timestamp: new Date('2024-12-15'),
          action: 'grant',
          permission: 'analytics',
          reason: 'Temporary access for Q4 reporting project',
          authorizedBy: 'U001',
        },
      ],
    },
    {
      id: 'U003',
      name: 'John Smith',
      email: 'j.smith@fleetflowapp.com',
      role: 'broker',
      status: 'Active',
      lastLogin: '2024-12-18 09:15',
      createdDate: '2024-02-01',
      subscriptionStatus: 'active',
      subscriptionTier: 'university',
      subscriptionPlanIds: ['university'],
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      customPermissions: { granted: [], revoked: ['training'], temporary: [] },
      permissionHistory: [
        {
          timestamp: new Date('2024-12-10'),
          action: 'revoke',
          permission: 'training',
          reason: 'Completed all required training modules',
          authorizedBy: 'U001',
        },
      ],
    },
    {
      id: 'U004',
      name: 'Mike Wilson',
      email: 'mike.wilson@fleetflowapp.com',
      role: 'manager',
      status: 'Active',
      lastLogin: '2024-12-19 12:15',
      createdDate: '2024-01-20',
      subscriptionStatus: 'active',
      subscriptionTier: 'brokerage',
      subscriptionPlanIds: ['brokerage'],
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      customPermissions: {
        granted: [],
        revoked: [],
        temporary: [
          {
            permission: 'api_access',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            type: 'grant',
          },
        ],
      },
      permissionHistory: [
        {
          timestamp: new Date('2024-12-19'),
          action: 'grant',
          permission: 'api_access',
          reason: 'Temporary API access for integration testing',
          authorizedBy: 'U001',
        },
      ],
    },
  ]);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer' as UserRole,
    subscriptionTier: 'university' as SubscriptionTier,
  });

  // Access Control Functions
  const isSubscriptionActive = (user: User): boolean => {
    return (
      user.subscriptionStatus === 'active' ||
      user.subscriptionStatus === 'trial'
    );
  };

  const getUserEffectivePermissions = (user: User) => {
    // Step 1: Check subscription validity
    if (!isSubscriptionActive(user)) {
      return {
        permissions: user.customPermissions.granted || [],
        source: 'custom_only',
        breakdown: {
          subscription: [],
          customGranted: user.customPermissions.granted || [],
          customRevoked: user.customPermissions.revoked || [],
          temporary: user.customPermissions.temporary || [],
        },
      };
    }

    // Step 2: Get base subscription permissions
    const subscriptionFeatures =
      SUBSCRIPTION_FEATURES[user.subscriptionTier].features;

    // Step 3: Apply role filter
    const roleFilteredPermissions =
      ROLE_FILTERS[user.role](subscriptionFeatures);

    // Step 4: Apply custom overrides
    let finalPermissions = [...roleFilteredPermissions];

    // Add custom granted permissions
    if (user.customPermissions.granted) {
      finalPermissions = [
        ...finalPermissions,
        ...user.customPermissions.granted,
      ];
    }

    // Remove custom revoked permissions
    if (user.customPermissions.revoked) {
      finalPermissions = finalPermissions.filter(
        (perm) => !user.customPermissions.revoked.includes(perm)
      );
    }

    // Apply temporary overrides (check expiration)
    if (user.customPermissions.temporary) {
      user.customPermissions.temporary.forEach((temp) => {
        if (temp.expiresAt > new Date()) {
          if (
            temp.type === 'grant' &&
            !finalPermissions.includes(temp.permission)
          ) {
            finalPermissions.push(temp.permission);
          } else if (temp.type === 'revoke') {
            finalPermissions = finalPermissions.filter(
              (p) => p !== temp.permission
            );
          }
        }
      });
    }

    // Remove duplicates
    finalPermissions = [...new Set(finalPermissions)];

    return {
      permissions: finalPermissions,
      source: 'subscription_with_overrides',
      breakdown: {
        subscription: roleFilteredPermissions,
        customGranted: user.customPermissions.granted || [],
        customRevoked: user.customPermissions.revoked || [],
        temporary: user.customPermissions.temporary || [],
      },
    };
  };

  const getSubscriptionBadgeColor = (
    status: SubscriptionStatus,
    tier: SubscriptionTier
  ) => {
    if (status === 'expired' || status === 'canceled') {
      return { bg: '#fee2e2', color: '#dc2626' };
    }
    if (status === 'trial') {
      return { bg: '#fef3c7', color: '#d97706' };
    }

    switch (tier) {
      case 'university':
        return { bg: '#dbeafe', color: '#1e40af' };
      case 'dispatcher':
        return { bg: '#dcfce7', color: '#166534' };
      case 'brokerage':
        return { bg: '#f3e8ff', color: '#7c3aed' };
      case 'enterprise':
        return { bg: '#fef3c7', color: '#d97706' };
      default:
        return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const createUser = () => {
    if (!newUser.name || !newUser.email) {
      alert('Please fill in all required fields');
      return;
    }

    const user: User = {
      id: `U${(users.length + 1).toString().padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      lastLogin: 'Never',
      createdDate: new Date().toISOString().split('T')[0],
      subscriptionStatus: 'trial',
      subscriptionTier: newUser.subscriptionTier,
      subscriptionPlanIds: [newUser.subscriptionTier],
      subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      customPermissions: { granted: [], revoked: [], temporary: [] },
      permissionHistory: [
        {
          timestamp: new Date(),
          action: 'subscription_change',
          permission: 'subscription_created',
          reason: `User created with ${newUser.subscriptionTier} subscription`,
          authorizedBy: currentUser.id,
        },
      ],
    };

    setUsers([...users, user]);
    setNewUser({
      name: '',
      email: '',
      role: 'viewer',
      subscriptionTier: 'university',
    });
    setShowCreateUser(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === 'Active' ? 'Inactive' : 'Active',
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

  const grantCustomPermission = (
    userId: string,
    permission: string,
    reason: string,
    temporary?: Date
  ) => {
    setUsers(
      users.map((user) => {
        if (user.id !== userId) return user;

        const updatedUser = { ...user };

        if (temporary) {
          updatedUser.customPermissions.temporary.push({
            permission,
            expiresAt: temporary,
            type: 'grant',
          });
        } else {
          if (!updatedUser.customPermissions.granted.includes(permission)) {
            updatedUser.customPermissions.granted.push(permission);
          }
        }

        updatedUser.permissionHistory.push({
          timestamp: new Date(),
          action: 'grant',
          permission,
          reason,
          authorizedBy: currentUser.id,
        });

        return updatedUser;
      })
    );
  };

  const revokeCustomPermission = (
    userId: string,
    permission: string,
    reason: string,
    temporary?: Date
  ) => {
    setUsers(
      users.map((user) => {
        if (user.id !== userId) return user;

        const updatedUser = { ...user };

        if (temporary) {
          updatedUser.customPermissions.temporary.push({
            permission,
            expiresAt: temporary,
            type: 'revoke',
          });
        } else {
          if (!updatedUser.customPermissions.revoked.includes(permission)) {
            updatedUser.customPermissions.revoked.push(permission);
          }
        }

        updatedUser.permissionHistory.push({
          timestamp: new Date(),
          action: 'revoke',
          permission,
          reason,
          authorizedBy: currentUser.id,
        });

        return updatedUser;
      })
    );
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter((p) => p.category === category);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (date: Date) => {
    const days = Math.ceil(
      (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return days;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px',
      }}
    >
      {/* Back Button */}
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
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
            🔐 Subscription-Based Access Control
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
            }}
          >
            Manage users, subscriptions, and granular permission overrides
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px 16px 0 0',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '0 24px',
          }}
        >
          <nav
            style={{
              display: 'flex',
              gap: '32px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {[
              { id: 'users', label: 'User Management', count: users.length },
              {
                id: 'permissions',
                label: 'System Permissions',
                count: permissions.length,
              },
              { id: 'general', label: 'General Settings', count: 0 },
              { id: 'compliance', label: 'Regulatory Compliance', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '16px 0',
                  borderBottom:
                    activeTab === tab.id
                      ? '2px solid white'
                      : '2px solid transparent',
                  fontWeight: '600',
                  fontSize: '14px',
                  color:
                    activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    style={{
                      marginLeft: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '0 0 16px 16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
            minHeight: '600px',
          }}
        >
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: 0,
                  }}
                >
                  User Accounts & Subscriptions
                </h2>
                <button
                  onClick={() => setShowCreateUser(true)}
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
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  + Add New User
                </button>
              </div>

              {/* Enhanced User Table */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr
                      style={{
                        background: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        User
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Subscription
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Role & Status
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Access Summary
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          textAlign: 'left',
                          fontWeight: '600',
                          color: '#374151',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => {
                      const effectivePermissions =
                        getUserEffectivePermissions(user);
                      const subscriptionFeatures =
                        SUBSCRIPTION_FEATURES[user.subscriptionTier];
                      const badgeColors = getSubscriptionBadgeColor(
                        user.subscriptionStatus,
                        user.subscriptionTier
                      );
                      const daysUntilExpiry = getDaysUntilExpiry(
                        user.subscriptionExpiresAt
                      );

                      return (
                        <tr
                          key={user.id}
                          style={{
                            borderBottom:
                              index < users.length - 1
                                ? '1px solid #e5e7eb'
                                : 'none',
                            transition: 'background-color 0.2s ease',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              'transparent';
                          }}
                        >
                          <td style={{ padding: '16px' }}>
                            <div>
                              <div
                                style={{ fontWeight: '600', color: '#1f2937' }}
                              >
                                {user.name}
                              </div>
                              <div
                                style={{ fontSize: '14px', color: '#6b7280' }}
                              >
                                {user.email}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: '#9ca3af',
                                  marginTop: '4px',
                                }}
                              >
                                Last login: {user.lastLogin}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                              }}
                            >
                              <span
                                style={{
                                  background: badgeColors.bg,
                                  color: badgeColors.color,
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textTransform: 'capitalize',
                                  display: 'inline-block',
                                  width: 'fit-content',
                                }}
                              >
                                {user.subscriptionTier} -{' '}
                                {user.subscriptionStatus}
                              </span>
                              <div
                                style={{ fontSize: '11px', color: '#6b7280' }}
                              >
                                ${subscriptionFeatures.price}/month
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color:
                                    daysUntilExpiry <= 7
                                      ? '#dc2626'
                                      : '#6b7280',
                                }}
                              >
                                {user.subscriptionStatus === 'trial' &&
                                user.trialEndsAt
                                  ? `Trial ends: ${formatDate(user.trialEndsAt)}`
                                  : `Expires: ${formatDate(user.subscriptionExpiresAt)}`}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                              }}
                            >
                              <span
                                style={{
                                  background:
                                    user.role === 'admin'
                                      ? '#dcfce7'
                                      : user.role === 'manager'
                                        ? '#dbeafe'
                                        : '#f3f4f6',
                                  color:
                                    user.role === 'admin'
                                      ? '#166534'
                                      : user.role === 'manager'
                                        ? '#1e40af'
                                        : '#374151',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  textTransform: 'capitalize',
                                  display: 'inline-block',
                                  width: 'fit-content',
                                }}
                              >
                                {user.role}
                              </span>
                              <span
                                style={{
                                  background:
                                    user.status === 'Active'
                                      ? '#dcfce7'
                                      : '#fee2e2',
                                  color:
                                    user.status === 'Active'
                                      ? '#166534'
                                      : '#dc2626',
                                  padding: '4px 8px',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  display: 'inline-block',
                                  width: 'fit-content',
                                }}
                              >
                                {user.status}
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div style={{ fontSize: '12px', color: '#374151' }}>
                              <div style={{ marginBottom: '4px' }}>
                                <strong>
                                  {effectivePermissions.permissions.length}
                                </strong>{' '}
                                permissions active
                              </div>
                              {effectivePermissions.breakdown.customGranted
                                .length > 0 && (
                                <div
                                  style={{
                                    color: '#059669',
                                    marginBottom: '2px',
                                  }}
                                >
                                  +
                                  {
                                    effectivePermissions.breakdown.customGranted
                                      .length
                                  }{' '}
                                  custom granted
                                </div>
                              )}
                              {effectivePermissions.breakdown.customRevoked
                                .length > 0 && (
                                <div
                                  style={{
                                    color: '#dc2626',
                                    marginBottom: '2px',
                                  }}
                                >
                                  -
                                  {
                                    effectivePermissions.breakdown.customRevoked
                                      .length
                                  }{' '}
                                  custom revoked
                                </div>
                              )}
                              {effectivePermissions.breakdown.temporary.length >
                                0 && (
                                <div
                                  style={{
                                    color: '#d97706',
                                    marginBottom: '2px',
                                  }}
                                >
                                  {
                                    effectivePermissions.breakdown.temporary
                                      .length
                                  }{' '}
                                  temporary
                                </div>
                              )}
                              <div
                                style={{ color: '#6b7280', fontSize: '11px' }}
                              >
                                Phone:{' '}
                                {subscriptionFeatures.phoneMinutes ===
                                'unlimited'
                                  ? 'Unlimited'
                                  : `${subscriptionFeatures.phoneMinutes} min`}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                              }}
                            >
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setShowPermissionManager(true);
                                  }}
                                  style={{
                                    color: '#3b82f6',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  Manage Access
                                </button>
                                <button
                                  onClick={() => toggleUserStatus(user.id)}
                                  style={{
                                    color:
                                      user.status === 'Active'
                                        ? '#dc2626'
                                        : '#16a34a',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {user.status === 'Active'
                                    ? 'Deactivate'
                                    : 'Activate'}
                                </button>
                              </div>
                              {user.id !== currentUser.id && (
                                <button
                                  onClick={() => deleteUser(user.id)}
                                  style={{
                                    color: '#dc2626',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    textDecoration: 'underline',
                                    textAlign: 'left',
                                  }}
                                >
                                  Delete User
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* System Permissions Tab */}
          {activeTab === 'permissions' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                System Permissions & Subscription Features
              </h2>

              {/* Subscription Tiers Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '16px',
                  marginBottom: '32px',
                }}
              >
                {Object.entries(SUBSCRIPTION_FEATURES).map(
                  ([tier, features]) => (
                    <div
                      key={tier}
                      style={{
                        background: 'white',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px',
                          textTransform: 'capitalize',
                        }}
                      >
                        {tier.replace('_', ' ')} - ${features.price}/month
                      </h3>
                      <div
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '12px',
                        }}
                      >
                        Max Users: {features.maxUsers} | Phone:{' '}
                        {features.phoneMinutes === 'unlimited'
                          ? 'Unlimited'
                          : `${features.phoneMinutes} min`}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                        }}
                      >
                        {features.features.map((feature) => (
                          <span
                            key={feature}
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              fontSize: '11px',
                              fontWeight: '500',
                            }}
                          >
                            {feature.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Permission Categories */}
              {[
                'Core',
                'Analytics',
                'Communication',
                'Compliance',
                'Driver',
                'Enterprise',
                'Admin',
              ].map((category) => (
                <div
                  key={category}
                  style={{
                    background: 'white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '16px',
                    }}
                  >
                    {category} Permissions
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {getPermissionsByCategory(category).map((permission) => (
                      <div
                        key={permission.id}
                        style={{
                          padding: '16px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          background: '#f9fafb',
                        }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '4px',
                          }}
                        >
                          {permission.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>
                          {permission.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                General Settings
              </h2>
              <div
                style={{
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  General system settings will be available in a future update.
                </p>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <ExecutiveComplianceCenter
                userId={currentUser.id}
                userRole={currentUser.role}
              />
            </div>
          )}
        </div>
      </div>

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
                    Full Name
                  </label>
                  <input
                    type='text'
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
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
                    placeholder='Enter full name'
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
                    Role
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        role: e.target.value as UserRole,
                      })
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
                  >
                    <option value='viewer'>Viewer</option>
                    <option value='driver'>Driver</option>
                    <option value='dispatcher'>Dispatcher</option>
                    <option value='broker'>Broker</option>
                    <option value='manager'>Manager</option>
                    <option value='admin'>Admin</option>
                  </select>
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
                    Subscription Plan
                  </label>
                  <select
                    value={newUser.subscriptionTier}
                    onChange={(e) =>
                      setNewUser({
                        ...newUser,
                        subscriptionTier: e.target.value as SubscriptionTier,
                      })
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
                  >
                    <option value='driver_free'>Driver/Carrier - FREE</option>
                    <option value='university'>
                      FleetFlow University℠ - $49/month
                    </option>
                    <option value='dispatcher'>
                      Professional Dispatcher - $79/month
                    </option>
                    <option value='brokerage'>
                      Professional Brokerage - $289/month
                    </option>
                    <option value='enterprise'>
                      Enterprise Professional - $2,698/month
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
                    User will start with 14-day free trial
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

      {/* Permission Management Modal */}
      {showPermissionManager && selectedUser && (
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
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                padding: '24px 24px 0',
                borderBottom: '1px solid #e5e7eb',
                position: 'sticky',
                top: 0,
                background: 'white',
                zIndex: 1,
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
                🔐 Access Management: {selectedUser.name}
              </h3>
            </div>
            <div style={{ padding: '24px' }}>
              {(() => {
                const effectivePermissions =
                  getUserEffectivePermissions(selectedUser);
                const subscriptionFeatures =
                  SUBSCRIPTION_FEATURES[selectedUser.subscriptionTier];

                return (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '24px',
                    }}
                  >
                    {/* Subscription Overview */}
                    <div
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px',
                        }}
                      >
                        📋 Subscription Details
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Plan
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                              textTransform: 'capitalize',
                            }}
                          >
                            {selectedUser.subscriptionTier} - $
                            {subscriptionFeatures.price}/month
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Status
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color:
                                selectedUser.subscriptionStatus === 'active'
                                  ? '#059669'
                                  : '#d97706',
                              textTransform: 'capitalize',
                            }}
                          >
                            {selectedUser.subscriptionStatus}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Expires
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                            }}
                          >
                            {formatDate(selectedUser.subscriptionExpiresAt)}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Phone/SMS
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#1f2937',
                            }}
                          >
                            {subscriptionFeatures.phoneMinutes === 'unlimited'
                              ? 'Unlimited'
                              : `${subscriptionFeatures.phoneMinutes} min`}{' '}
                            /
                            {subscriptionFeatures.smsMessages === 'unlimited'
                              ? 'Unlimited'
                              : `${subscriptionFeatures.smsMessages} SMS`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Effective Permissions Summary */}
                    <div
                      style={{
                        background: '#f0f9ff',
                        border: '1px solid #0ea5e9',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '8px',
                        }}
                      >
                        ✅ Current Access Summary
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '8px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#0ea5e9',
                            }}
                          >
                            {effectivePermissions.permissions.length}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Total Permissions
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#059669',
                            }}
                          >
                            +
                            {
                              effectivePermissions.breakdown.customGranted
                                .length
                            }
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Custom Granted
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#dc2626',
                            }}
                          >
                            -
                            {
                              effectivePermissions.breakdown.customRevoked
                                .length
                            }
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Custom Revoked
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '20px',
                              fontWeight: '700',
                              color: '#d97706',
                            }}
                          >
                            {effectivePermissions.breakdown.temporary.length}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            Temporary
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Permission Breakdown */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '16px',
                      }}
                    >
                      {/* Subscription Permissions */}
                      <div
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <h5
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '12px',
                          }}
                        >
                          📦 Subscription Permissions
                        </h5>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {effectivePermissions.breakdown.subscription.map(
                            (perm) => (
                              <div
                                key={perm}
                                style={{
                                  fontSize: '12px',
                                  color: '#374151',
                                  padding: '4px 8px',
                                  background: '#e5e7eb',
                                  borderRadius: '4px',
                                }}
                              >
                                {permissions.find((p) => p.id === perm)?.name ||
                                  perm}
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Custom Granted */}
                      <div
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #22c55e',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <h5
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '12px',
                          }}
                        >
                          ✅ Additional Access
                        </h5>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {effectivePermissions.breakdown.customGranted.map(
                            (perm) => (
                              <div
                                key={perm}
                                style={{
                                  fontSize: '12px',
                                  color: '#166534',
                                  padding: '4px 8px',
                                  background: '#dcfce7',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span>
                                  {permissions.find((p) => p.id === perm)
                                    ?.name || perm}
                                </span>
                                <button
                                  onClick={() => {
                                    const reason = prompt(
                                      'Reason for removing this permission:'
                                    );
                                    if (reason) {
                                      const updatedUser = { ...selectedUser };
                                      updatedUser.customPermissions.granted =
                                        updatedUser.customPermissions.granted.filter(
                                          (p) => p !== perm
                                        );
                                      updatedUser.permissionHistory.push({
                                        timestamp: new Date(),
                                        action: 'revoke',
                                        permission: perm,
                                        reason,
                                        authorizedBy: currentUser.id,
                                      });
                                      setUsers(
                                        users.map((u) =>
                                          u.id === selectedUser.id
                                            ? updatedUser
                                            : u
                                        )
                                      );
                                      setSelectedUser(updatedUser);
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#dc2626',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )
                          )}
                          <button
                            onClick={() => {
                              const availablePermissions = permissions.filter(
                                (p) =>
                                  !effectivePermissions.permissions.includes(
                                    p.id
                                  )
                              );
                              if (availablePermissions.length === 0) {
                                alert(
                                  'No additional permissions available to grant.'
                                );
                                return;
                              }
                              const permissionId = prompt(
                                `Available permissions:\n${availablePermissions.map((p) => `${p.id}: ${p.name}`).join('\n')}\n\nEnter permission ID to grant:`
                              );
                              if (
                                permissionId &&
                                availablePermissions.find(
                                  (p) => p.id === permissionId
                                )
                              ) {
                                const reason = prompt(
                                  'Reason for granting this permission:'
                                );
                                if (reason) {
                                  grantCustomPermission(
                                    selectedUser.id,
                                    permissionId,
                                    reason
                                  );
                                  setSelectedUser({
                                    ...selectedUser,
                                    customPermissions: {
                                      ...selectedUser.customPermissions,
                                      granted: [
                                        ...selectedUser.customPermissions
                                          .granted,
                                        permissionId,
                                      ],
                                    },
                                  });
                                }
                              }
                            }}
                            style={{
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            + Grant Permission
                          </button>
                        </div>
                      </div>

                      {/* Custom Revoked */}
                      <div
                        style={{
                          background: '#fef2f2',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <h5
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '12px',
                          }}
                        >
                          ❌ Revoked Access
                        </h5>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {effectivePermissions.breakdown.customRevoked.map(
                            (perm) => (
                              <div
                                key={perm}
                                style={{
                                  fontSize: '12px',
                                  color: '#dc2626',
                                  padding: '4px 8px',
                                  background: '#fee2e2',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <span>
                                  {permissions.find((p) => p.id === perm)
                                    ?.name || perm}
                                </span>
                                <button
                                  onClick={() => {
                                    const reason = prompt(
                                      'Reason for restoring this permission:'
                                    );
                                    if (reason) {
                                      const updatedUser = { ...selectedUser };
                                      updatedUser.customPermissions.revoked =
                                        updatedUser.customPermissions.revoked.filter(
                                          (p) => p !== perm
                                        );
                                      updatedUser.permissionHistory.push({
                                        timestamp: new Date(),
                                        action: 'grant',
                                        permission: perm,
                                        reason,
                                        authorizedBy: currentUser.id,
                                      });
                                      setUsers(
                                        users.map((u) =>
                                          u.id === selectedUser.id
                                            ? updatedUser
                                            : u
                                        )
                                      );
                                      setSelectedUser(updatedUser);
                                    }
                                  }}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#22c55e',
                                    cursor: 'pointer',
                                    fontSize: '10px',
                                  }}
                                >
                                  ↻
                                </button>
                              </div>
                            )
                          )}
                          <button
                            onClick={() => {
                              const availableToRevoke =
                                effectivePermissions.breakdown.subscription;
                              if (availableToRevoke.length === 0) {
                                alert(
                                  'No subscription permissions available to revoke.'
                                );
                                return;
                              }
                              const permissionId = prompt(
                                `Subscription permissions:\n${availableToRevoke.map((p) => `${p}: ${permissions.find((perm) => perm.id === p)?.name || p}`).join('\n')}\n\nEnter permission ID to revoke:`
                              );
                              if (
                                permissionId &&
                                availableToRevoke.includes(permissionId)
                              ) {
                                const reason = prompt(
                                  'Reason for revoking this permission:'
                                );
                                if (reason) {
                                  revokeCustomPermission(
                                    selectedUser.id,
                                    permissionId,
                                    reason
                                  );
                                  setSelectedUser({
                                    ...selectedUser,
                                    customPermissions: {
                                      ...selectedUser.customPermissions,
                                      revoked: [
                                        ...selectedUser.customPermissions
                                          .revoked,
                                        permissionId,
                                      ],
                                    },
                                  });
                                }
                              }
                            }}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            - Revoke Permission
                          </button>
                        </div>
                      </div>

                      {/* Temporary Permissions */}
                      <div
                        style={{
                          background: '#fffbeb',
                          border: '1px solid #f59e0b',
                          borderRadius: '8px',
                          padding: '16px',
                        }}
                      >
                        <h5
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '12px',
                          }}
                        >
                          ⏰ Temporary Access
                        </h5>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                          }}
                        >
                          {effectivePermissions.breakdown.temporary.map(
                            (temp, index) => (
                              <div
                                key={index}
                                style={{
                                  fontSize: '12px',
                                  color: '#d97706',
                                  padding: '4px 8px',
                                  background: '#fef3c7',
                                  borderRadius: '4px',
                                }}
                              >
                                <div style={{ fontWeight: '600' }}>
                                  {temp.type === 'grant' ? '✅' : '❌'}{' '}
                                  {permissions.find(
                                    (p) => p.id === temp.permission
                                  )?.name || temp.permission}
                                </div>
                                <div
                                  style={{ fontSize: '10px', color: '#92400e' }}
                                >
                                  Expires: {formatDate(temp.expiresAt)}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Permission History */}
                    <div
                      style={{
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <h5
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1f2937',
                          marginBottom: '12px',
                        }}
                      >
                        📋 Permission History (Last 10 Changes)
                      </h5>
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {selectedUser.permissionHistory
                          .slice(-10)
                          .reverse()
                          .map((entry, index) => (
                            <div
                              key={index}
                              style={{
                                fontSize: '12px',
                                color: '#374151',
                                padding: '8px',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'grid',
                                gridTemplateColumns: '80px 1fr 100px',
                                gap: '8px',
                              }}
                            >
                              <div
                                style={{
                                  fontWeight: '600',
                                  color:
                                    entry.action === 'grant'
                                      ? '#059669'
                                      : entry.action === 'revoke'
                                        ? '#dc2626'
                                        : '#6b7280',
                                }}
                              >
                                {entry.action.toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: '500' }}>
                                  {entry.permission}
                                </div>
                                <div
                                  style={{ fontSize: '11px', color: '#6b7280' }}
                                >
                                  {entry.reason}
                                </div>
                              </div>
                              <div
                                style={{ fontSize: '11px', color: '#6b7280' }}
                              >
                                {formatDate(entry.timestamp)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

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
                  onClick={() => {
                    setShowPermissionManager(false);
                    setSelectedUser(null);
                  }}
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
    </div>
  );
}
