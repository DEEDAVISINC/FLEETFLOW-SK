'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Type definitions
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Dispatcher' | 'Driver' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  permissions: string[];
  createdDate: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'users' | 'permissions' | 'general'>('users');
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Current user context
  const [currentUser] = useState<User>({
    id: 'U001',
    name: 'Fleet Manager',
    email: 'manager@fleetflow.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: 'Current session',
    permissions: ['all'],
    createdDate: '2024-01-01'
  });

  // Available permissions
  const [permissions] = useState<Permission[]>([
    { id: 'dashboard_view', name: 'View Dashboard', description: 'Access to main dashboard and metrics', category: 'Core' },
    { id: 'vehicles_manage', name: 'Manage Vehicles', description: 'Add, edit, and delete vehicles', category: 'Core' },
    { id: 'drivers_manage', name: 'Manage Drivers', description: 'Add, edit, and delete driver profiles', category: 'Core' },
    { id: 'routes_manage', name: 'Manage Routes', description: 'Create and modify routes', category: 'Core' },
    { id: 'dispatch_access', name: 'Dispatch Central', description: 'Access dispatch operations and load assignment', category: 'Core' },
    { id: 'broker_access', name: 'Broker Box', description: 'Access freight brokerage features', category: 'Core' },
    { id: 'quoting_access', name: 'Freight Quoting', description: 'Generate and manage freight quotes', category: 'Core' },
    { id: 'maintenance_manage', name: 'Maintenance Management', description: 'Schedule and track vehicle maintenance', category: 'Core' },
    { id: 'invoices_view', name: 'View Invoices', description: 'Access invoice history and details', category: 'Financial' },
    { id: 'invoices_manage', name: 'Manage Invoices', description: 'Create, edit, and delete invoices', category: 'Financial' },
    { id: 'financial_reports', name: 'Financial Reports', description: 'Access financial analytics and reports', category: 'Financial' },
    { id: 'expense_manage', name: 'Expense Management', description: 'Track and manage business expenses', category: 'Financial' },
    { id: 'reports_view', name: 'View Reports', description: 'Access standard reports and analytics', category: 'Reports' },
    { id: 'reports_export', name: 'Export Reports', description: 'Export reports to various formats', category: 'Reports' },
    { id: 'analytics_advanced', name: 'Advanced Analytics', description: 'Access advanced analytics and insights', category: 'Reports' },
    { id: 'users_manage', name: 'User Management', description: 'Create, edit, and delete user accounts', category: 'Admin' },
    { id: 'permissions_manage', name: 'Permission Management', description: 'Assign and modify user permissions', category: 'Admin' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure system-wide settings', category: 'Admin' },
    { id: 'audit_logs', name: 'Audit Logs', description: 'View system audit and activity logs', category: 'Admin' }
  ]);

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: 'U001',
      name: 'Fleet Manager',
      email: 'manager@fleetflow.com',
      role: 'Admin',
      status: 'Active',
      lastLogin: 'Current session',
      permissions: ['all'],
      createdDate: '2024-01-01'
    },
    {
      id: 'U002',
      name: 'Sarah Johnson',
      email: 'sarah.j@fleetflow.com',
      role: 'Dispatcher',
      status: 'Active',
      lastLogin: '2024-12-18 14:30',
      permissions: ['dashboard_view', 'dispatch_access', 'routes_manage', 'drivers_manage', 'invoices_view'],
      createdDate: '2024-01-15'
    },
    {
      id: 'U003',
      name: 'John Smith',
      email: 'j.smith@fleetflow.com',
      role: 'Driver',
      status: 'Active',
      lastLogin: '2024-12-18 09:15',
      permissions: ['dashboard_view', 'routes_manage'],
      createdDate: '2024-02-01'
    },
    {
      id: 'U004',
      name: 'Mike Wilson',
      email: 'mike.wilson@fleetflow.com',
      role: 'Manager',
      status: 'Active',
      lastLogin: '2024-12-19 12:15',
      permissions: ['dashboard_view', 'vehicles_manage', 'drivers_manage', 'reports_view', 'invoices_view'],
      createdDate: '2024-01-20'
    }
  ]);

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Viewer' as User['role'],
    permissions: [] as string[]
  });

  const rolePermissions: Record<User['role'], string[]> = {
    'Admin': ['all'],
    'Manager': ['dashboard_view', 'vehicles_manage', 'drivers_manage', 'routes_manage', 'maintenance_manage', 'reports_view', 'invoices_view', 'financial_reports'],
    'Dispatcher': ['dashboard_view', 'dispatch_access', 'routes_manage', 'drivers_manage', 'invoices_view'],
    'Driver': ['dashboard_view', 'routes_manage'],
    'Viewer': ['dashboard_view', 'reports_view']
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
      permissions: newUser.role === 'Admin' ? ['all'] : rolePermissions[newUser.role],
      createdDate: new Date().toISOString().split('T')[0]
    };

    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: 'Viewer', permissions: [] });
    setShowCreateUser(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' as 'Active' | 'Inactive' }
        : user
    ));
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const getPermissionsByCategory = (category: string) => {
    return permissions.filter(p => p.category === category);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
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
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            ⚙️ System Settings
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Manage users, permissions, and system configuration
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px 16px 0 0',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '0 24px'
        }}>
          <nav style={{ display: 'flex', gap: '32px', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
            {[
              { id: 'users', label: 'User Management', count: users.length },
              { id: 'permissions', label: 'Permissions', count: permissions.length },
              { id: 'general', label: 'General Settings', count: 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '16px 0',
                  borderBottom: activeTab === tab.id ? '2px solid white' : '2px solid transparent',
                  fontWeight: '600',
                  fontSize: '14px',
                  color: activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
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
                  <span style={{
                    marginLeft: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content Container */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '0 0 16px 16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          minHeight: '400px'
        }}>
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>User Accounts</h2>
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
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  + Add New User
                </button>
              </div>

              {/* User Table Container */}
              <div style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>User</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Role</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Last Login</th>
                      <th style={{ padding: '16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user.id} style={{ 
                        borderBottom: index < users.length - 1 ? '1px solid #e5e7eb' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                        <td style={{ padding: '16px' }}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#1f2937' }}>{user.name}</div>
                            <div style={{ fontSize: '14px', color: '#6b7280' }}>{user.email}</div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            background: user.role === 'Admin' ? '#dcfce7' : user.role === 'Manager' ? '#dbeafe' : '#f3f4f6',
                            color: user.role === 'Admin' ? '#166534' : user.role === 'Manager' ? '#1e40af' : '#374151',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            background: user.status === 'Active' ? '#dcfce7' : '#fee2e2',
                            color: user.status === 'Active' ? '#166534' : '#dc2626',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {user.status}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{user.lastLogin}</td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedUser(user)}
                              style={{
                                color: '#3b82f6',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.color = '#1d4ed8';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.color = '#3b82f6';
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              style={{
                                color: user.status === 'Active' ? '#dc2626' : '#16a34a',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.opacity = '0.8';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.opacity = '1';
                              }}
                            >
                              {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                            {user.id !== currentUser.id && (
                              <button
                                onClick={() => deleteUser(user.id)}
                                style={{
                                  color: '#dc2626',
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '14px',
                                  textDecoration: 'underline'
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.color = '#991b1b';
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.color = '#dc2626';
                                }}
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>System Permissions</h2>
              
              {['Core', 'Financial', 'Reports', 'Admin'].map((category) => (
                <div key={category} style={{
                  background: 'white',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  padding: '24px'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>{category} Permissions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {getPermissionsByCategory(category).map((permission) => (
                      <div key={permission.id} style={{
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        background: '#f9fafb'
                      }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{permission.name}</div>
                        <div style={{ fontSize: '14px', color: '#6b7280' }}>{permission.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>General Settings</h2>
              <div style={{
                background: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
                  General system settings will be available in a future update.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateUser && (
        <div style={{
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
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{ padding: '24px 24px 0', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>Create New User</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Full Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Enter full name"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Email Address</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Enter email address"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
                    style={{
                      width: '100%',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      padding: '12px 16px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="Driver">Driver</option>
                    <option value="Dispatcher">Dispatcher</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                  <p style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    marginTop: '4px',
                    margin: '4px 0 0 0'
                  }}>
                    Permissions will be assigned based on role
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
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
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#2563eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#3b82f6';
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
        <div style={{
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
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '500px',
            width: '100%'
          }}>
            <div style={{ padding: '24px 24px 0', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>Edit User: {selectedUser.name}</h3>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Permissions</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                    {selectedUser.permissions.includes('all') ? (
                      <div style={{
                        fontSize: '14px',
                        color: '#16a34a',
                        fontWeight: '600'
                      }}>
                        👑 Admin - All Permissions Granted
                      </div>
                    ) : (
                      permissions.map((permission) => (
                        <label key={permission.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="checkbox"
                            checked={selectedUser.permissions.includes(permission.id)}
                            style={{ borderRadius: '4px', borderColor: '#d1d5db', color: '#3b82f6' }}
                            readOnly
                          />
                          <span style={{ fontSize: '14px', color: '#374151' }}>{permission.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
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
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e5e7eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
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
