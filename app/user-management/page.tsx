'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock user data with enhanced structure
const mockUsers = [
  {
    id: 'FM-MGR-2023005',
    name: 'Frank Martinez',
    email: 'frank.martinez@fleetflow.com',
    department: 'Management',
    departmentCode: 'MGR',
    role: 'Fleet Operations Manager',
    status: 'active',
    lastActive: '2024-01-15T10:30:00Z',
    profileImage: '/api/placeholder/64/64',
    permissions: {
      canViewDashboard: true,
      canManageUsers: true,
      canAccessReports: true,
      canManageFleet: true
    },
    userIdentifiers: {
      systemIds: {
        systemId: 'SYS-FM-001',
        employeeCode: 'EMP-2023005',
        accessCode: 'ACC-FM-MGR',
        securityLevel: 'Level 4 - Management'
      },
      additionalIdentifiers: {
        badgeNumber: 'BDG-2023-005',
        phoneExtension: 'Ext. 2105',
        parkingSpot: 'Spot M-05',
        officeLocation: 'Main Office - Floor 2'
      }
    }
  },
  {
    id: 'SJ-DC-2024014',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetflow.com',
    department: 'Dispatch',
    departmentCode: 'DC',
    role: 'Senior Dispatcher',
    status: 'active',
    lastActive: '2024-01-15T09:15:00Z',
    profileImage: '/api/placeholder/64/64',
    permissions: {
      canViewDashboard: true,
      canManageLoads: true,
      canAssignDrivers: true,
      canViewReports: true
    },
    userIdentifiers: {
      systemIds: {
        systemId: 'SYS-SJ-002',
        employeeCode: 'EMP-2024014',
        accessCode: 'ACC-SJ-DC',
        securityLevel: 'Level 3 - Operations'
      },
      additionalIdentifiers: {
        badgeNumber: 'BDG-2024-014',
        phoneExtension: 'Ext. 3201',
        parkingSpot: 'Spot D-14',
        officeLocation: 'Dispatch Center'
      }
    }
  }
];

const UserCard: React.FC<{ user: any; onClick: () => void }> = ({ user, onClick }) => {
  const getDepartmentColor = (deptCode: string) => {
    switch (deptCode) {
      case 'MGR': return '#8b5cf6';
      case 'DC': return '#3b82f6';
      case 'BB': return '#f59e0b';
      case 'DM': return '#eab308';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '🟢';
      case 'inactive': return '🔴';
      case 'pending': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div 
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        height: '100%'
      }}
      onMouseOver={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: `linear-gradient(135deg, ${getDepartmentColor(user.departmentCode)}, ${getDepartmentColor(user.departmentCode)}dd)`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          {user.name.split(' ').map((n: string) => n[0]).join('')}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: 'white', 
            margin: 0, 
            fontSize: '18px', 
            fontWeight: '600' 
          }}>
            {user.name}
          </h3>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            margin: '4px 0 0 0', 
            fontSize: '14px' 
          }}>
            {user.role}
          </p>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          background: user.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          padding: '6px 12px',
          borderRadius: '8px',
          color: user.status === 'active' ? '#10b981' : '#ef4444'
        }}>
          <span>{getStatusIcon(user.status)}</span>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '12px' }}>
            ID: {user.id}
          </p>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0', fontSize: '12px' }}>
            {user.department} • {user.email}
          </p>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '4px 8px',
          borderRadius: '6px',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '10px'
        }}>
          {Object.values(user.permissions).filter(Boolean).length} Permissions
        </div>
      </div>
    </div>
  );
};

export default function EnhancedUserManagement() {
  // State management
  const [activeView, setActiveView] = useState('users');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string>('');
  const [expandedSubCategory, setExpandedSubCategory] = useState<string>('');
  const [expandedPermissionCategory, setExpandedPermissionCategory] = useState<string>('');
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const filteredUsers = mockUsers.filter(user => 
    !searchTerm || 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
      `,
      backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
      backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
      backgroundAttachment: 'fixed',
      paddingTop: '80px',
      position: 'relative'
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
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>👥</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  User Management
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  Comprehensive user management with permissions & analytics
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#4ade80',
                      borderRadius: '50%',
                      animation: 'pulse 2s infinite'
                    }}></div>
                    <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                      Live User System Active
                    </span>
                  </div>
                  <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleRefresh}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '16px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}>
                🔄 Refresh
              </button>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                + Add User
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'users', label: '👥 Users', icon: '👥' },
              { id: 'permissions', label: '🔐 Permissions', icon: '🔐' },
              { id: 'analytics', label: '📊 Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  background: activeView === tab.id 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: activeView === tab.id ? '#4c1d95' : 'white',
                  transform: activeView === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                  boxShadow: activeView === tab.id ? '0 8px 25px rgba(0, 0, 0, 0.15)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeView !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users View - BOOK FLIPPING SINGLE USER */}
        {activeView === 'users' && (
          <div>
            {/* Search and Filters */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                  User Directory
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '14px',
                      width: '300px'
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '24px'
              }}>
                {[
                  { label: 'Total Users', value: mockUsers.length, color: '#3b82f6', icon: '👥' },
                  { label: 'Active Users', value: mockUsers.filter(u => u.status === 'active').length, color: '#10b981', icon: '✅' },
                  { label: 'Departments', value: Array.from(new Set(mockUsers.map(u => u.department))).length, color: '#f59e0b', icon: '🏢' },
                  { label: 'Avg Permissions', value: Math.round(mockUsers.reduce((acc, u) => acc + Object.values(u.permissions).filter(Boolean).length, 0) / mockUsers.length), color: '#8b5cf6', icon: '🔐' }
                ].map((stat, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
                      {stat.value}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SINGLE USER BOOK VIEW */}
            {filteredUsers.length > 0 && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}>
                {/* Navigation Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  marginBottom: '32px',
                  padding: '0 20px'
                }}>
                  <button
                    onClick={() => setSelectedUserIndex(prev => prev > 0 ? prev - 1 : filteredUsers.length - 1)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    ◀ Previous
                  </button>

                  <div style={{ 
                    color: 'white', 
                    fontSize: '18px', 
                    fontWeight: '600',
                    textAlign: 'center'
                  }}>
                    User {selectedUserIndex + 1} of {filteredUsers.length}
                  </div>

                  <button
                    onClick={() => setSelectedUserIndex(prev => prev < filteredUsers.length - 1 ? prev + 1 : 0)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    Next ▶
                  </button>
                </div>

                {/* Single User Display */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '40px',
                  transition: 'all 0.5s ease',
                  minHeight: '400px'
                }}>
                  {(() => {
                    const currentUser = filteredUsers[selectedUserIndex];
                    const getDepartmentColor = (deptCode: string) => {
                      switch (deptCode) {
                        case 'MGR': return '#8b5cf6';
                        case 'DC': return '#3b82f6';
                        case 'BB': return '#f59e0b';
                        case 'DM': return '#eab308';
                        default: return '#6b7280';
                      }
                    };

                    const getStatusIcon = (status: string) => {
                      switch (status) {
                        case 'active': return '🟢';
                        case 'inactive': return '🔴';
                        case 'pending': return '🟡';
                        default: return '⚪';
                      }
                    };

                    return (
                      <div>
                        {/* User Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            background: `linear-gradient(135deg, ${getDepartmentColor(currentUser.departmentCode)}, ${getDepartmentColor(currentUser.departmentCode)}dd)`,
                            borderRadius: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '28px',
                            fontWeight: 'bold'
                          }}>
                            {currentUser.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h2 style={{ 
                              color: 'white', 
                              margin: '0 0 8px 0', 
                              fontSize: '32px', 
                              fontWeight: '700' 
                            }}>
                              {currentUser.name}
                            </h2>
                            <p style={{ 
                              color: 'rgba(255, 255, 255, 0.8)', 
                              margin: '0 0 8px 0', 
                              fontSize: '18px',
                              fontWeight: '500'
                            }}>
                              {currentUser.role}
                            </p>
                            <p style={{ 
                              color: 'rgba(255, 255, 255, 0.7)', 
                              margin: '0', 
                              fontSize: '14px' 
                            }}>
                              {currentUser.email}
                            </p>
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '12px',
                            background: currentUser.status === 'active' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            padding: '12px 20px',
                            borderRadius: '12px',
                            color: currentUser.status === 'active' ? '#10b981' : '#ef4444'
                          }}>
                            <span style={{ fontSize: '20px' }}>{getStatusIcon(currentUser.status)}</span>
                            <span style={{ fontSize: '16px', fontWeight: '600' }}>
                              {currentUser.status.charAt(0).toUpperCase() + currentUser.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* User Details Grid */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '24px',
                          marginBottom: '32px'
                        }}>
                          <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px'
                          }}>
                            <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
                              Account Details
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px' }}>User ID</div>
                                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{currentUser.id}</div>
                              </div>
                              <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px' }}>Department</div>
                                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>{currentUser.department}</div>
                              </div>
                              <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px', marginBottom: '4px' }}>Last Active</div>
                                <div style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                                  {new Date(currentUser.lastActive).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '20px'
                          }}>
                            <h3 style={{ color: 'white', margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600' }}>
                              Permissions
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {Object.entries(currentUser.permissions)
                                .filter(([_, value]) => value)
                                .map(([key, _]) => (
                                  <span key={key} style={{
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: '#10b981',
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    fontWeight: '500'
                                  }}>
                                    {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                ))
                              }
                            </div>
                            <div style={{ 
                              marginTop: '16px',
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '14px'
                            }}>
                              Total: {Object.values(currentUser.permissions).filter(Boolean).length} permissions
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          gap: '16px',
                          marginTop: '32px'
                        }}>
                          <button
                            onClick={() => handleUserClick(currentUser)}
                            style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              padding: '12px 24px',
                              borderRadius: '12px',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '16px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            ✏️ Edit User
                          </button>
                          <button
                            style={{
                              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                              color: 'white',
                              padding: '12px 24px',
                              borderRadius: '12px',
                              border: 'none',
                              fontWeight: '600',
                              cursor: 'pointer',
                              fontSize: '16px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            🔐 Manage Permissions
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Page Indicators */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  marginTop: '24px' 
                }}>
                  {filteredUsers.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedUserIndex(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === selectedUserIndex ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Permissions View - COMPREHENSIVE NAVIGATION SYSTEM */}
        {activeView === 'permissions' && (
          <div>
            {/* Quick Access Color-Coded System Links */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 20px 0' }}>
                System Access Quick Links
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {[
                  { title: 'Management Access', code: 'MGR', color: '#8b5cf6', icon: '👑', access: 'Full System Control' },
                  { title: 'Dispatch Central', code: 'DC', color: '#3b82f6', icon: '🚛', access: 'Load & Driver Management' },
                  { title: 'Broker Operations', code: 'BB', color: '#f59e0b', icon: '🏢', access: 'Customer & Rate Management' },
                  { title: 'Driver Management', code: 'DM', color: '#eab308', icon: '👨‍💼', access: 'Fleet & Driver Operations' }
                ].map((dept, index) => (
                  <div key={index} style={{
                    background: `linear-gradient(135deg, ${dept.color}, ${dept.color}dd)`,
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{dept.icon}</div>
                    <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      {dept.title}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '8px' }}>
                      Code: {dept.code}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>
                      {dept.access}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comprehensive Permission Management */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 24px 0' }}>
                FleetFlow Navigation-Style Permission System
              </h2>
              
              {/* COMPACT NAVIGATION-STYLE PERMISSION DROPDOWNS */}
              <div style={{ maxHeight: '500px', overflowY: 'auto', fontSize: '12px' }}>
                {/* 🚛 Operations */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Operations' ? '' : 'Operations')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'Operations' ? '▼' : '▶'} 🚛 Operations
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>3 Sub-categories</span>
                  </div>
                  
                  {expandedPermissionCategory === 'Operations' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* Dispatch Central */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'DispatchCentral' ? '' : 'DispatchCentral')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(59, 130, 246, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#3b82f6', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'DispatchCentral' ? '▼' : '▶'} Dispatch Central
                          </span>
                        </div>
                        {expandedSubCategory === 'DispatchCentral' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View All Loads', 'Create New Load', 'Assign Drivers', 'Edit Load Status',
                              'View Driver Status', 'Dispatch Loads', 'View Workflow Status', 'Override Workflow',
                              'AI Route Optimization'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`dispatch_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`dispatch_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Broker Box */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'BrokerBox' ? '' : 'BrokerBox')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'BrokerBox' ? '▼' : '▶'} Broker Box
                          </span>
                        </div>
                        {expandedSubCategory === 'BrokerBox' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View All Customers', 'Create New Customer', 'Manage Customers', 'Generate Quotes',
                              'View RFx Responses', 'Process Payments', 'Commission Tracking', 'Market Intelligence'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`broker_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`broker_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Freight Quoting */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'FreightQuoting' ? '' : 'FreightQuoting')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#10b981', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'FreightQuoting' ? '▼' : '▶'} Freight Quoting
                          </span>
                        </div>
                        {expandedSubCategory === 'FreightQuoting' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Create Quotes', 'Edit Quotes', 'Quote Analytics', 'Pricing Management',
                              'Customer Quotes', 'Rate Calculation', 'Market Pricing', 'Quote Approval'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`quoting_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`quoting_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 👨‍💼 Driver Management */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'DriverManagement' ? '' : 'DriverManagement')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'DriverManagement' ? '▼' : '▶'} 👨‍💼 Driver Management
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>1 Sub-category</span>
                  </div>
                  
                  {expandedPermissionCategory === 'DriverManagement' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* Driver Portal */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'DriverPortal' ? '' : 'DriverPortal')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(234, 179, 8, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#eab308', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'DriverPortal' ? '▼' : '▶'} Driver Portal
                          </span>
                        </div>
                        {expandedSubCategory === 'DriverPortal' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View Driver Profiles', 'Add New Driver', 'Edit Driver Info', 'Track Performance',
                              'Manage Schedules', 'Driver Communication', 'License Tracking', 'Training Records',
                              'Payroll Integration', 'Safety Compliance'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`driver_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`driver_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 🚛 FleetFlow */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'FleetFlow' ? '' : 'FleetFlow')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'FleetFlow' ? '▼' : '▶'} 🚛 FleetFlow
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>3 Sub-categories</span>
                  </div>
                  
                  {expandedPermissionCategory === 'FleetFlow' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* Fleet Management */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'FleetManagement' ? '' : 'FleetManagement')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'FleetManagement' ? '▼' : '▶'} Fleet Management
                          </span>
                        </div>
                        {expandedSubCategory === 'FleetManagement' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View Vehicles', 'Add Vehicle', 'Edit Vehicle Info', 'Track Location',
                              'Fuel Management', 'Insurance Tracking', 'Registration', 'Vehicle Analytics'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`fleet_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`fleet_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Route Optimization */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'RouteOptimization' ? '' : 'RouteOptimization')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'RouteOptimization' ? '▼' : '▶'} Route Optimization
                          </span>
                        </div>
                        {expandedSubCategory === 'RouteOptimization' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Plan Routes', 'Optimize Routes', 'View Route Analytics', 'Edit Routes',
                              'Real-time Tracking', 'Fuel Optimization', 'Time Management', 'Traffic Analysis'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`route_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`route_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Maintenance */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'Maintenance' ? '' : 'Maintenance')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(139, 92, 246, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#8b5cf6', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'Maintenance' ? '▼' : '▶'} Maintenance
                          </span>
                        </div>
                        {expandedSubCategory === 'Maintenance' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Schedule Service', 'Track Repairs', 'Vendor Management', 'Cost Tracking',
                              'Predictive Alerts', 'Inspection Records', 'Parts Inventory', 'Service History'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`maintenance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`maintenance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 📊 Analytics */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Analytics' ? '' : 'Analytics')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'Analytics' ? '▼' : '▶'} 📊 Analytics
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>2 Sub-categories</span>
                  </div>
                  
                  {expandedPermissionCategory === 'Analytics' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* Performance Analytics */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'PerformanceAnalytics' ? '' : 'PerformanceAnalytics')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(6, 182, 212, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#06b6d4', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'PerformanceAnalytics' ? '▼' : '▶'} Performance Analytics
                          </span>
                        </div>
                        {expandedSubCategory === 'PerformanceAnalytics' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Driver Performance', 'Vehicle Efficiency', 'Route Performance', 'Load Analytics',
                              'Time Tracking', 'Fuel Analytics', 'Safety Metrics', 'Revenue Analytics'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`performance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`performance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Financial Analytics */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'FinancialAnalytics' ? '' : 'FinancialAnalytics')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(6, 182, 212, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#06b6d4', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'FinancialAnalytics' ? '▼' : '▶'} Financial Analytics
                          </span>
                        </div>
                        {expandedSubCategory === 'FinancialAnalytics' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Revenue Reports', 'Cost Analysis', 'Profit Margins', 'Budget Tracking',
                              'Financial Forecasting', 'Invoice Analytics', 'Expense Management', 'ROI Analysis'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`financial_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`financial_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* ✅ Compliance */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Compliance' ? '' : 'Compliance')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'Compliance' ? '▼' : '▶'} ✅ Compliance
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>1 Sub-category</span>
                  </div>
                  
                  {expandedPermissionCategory === 'Compliance' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* DOT Compliance */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'DOTCompliance' ? '' : 'DOTCompliance')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#10b981', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'DOTCompliance' ? '▼' : '▶'} DOT Compliance
                          </span>
                        </div>
                        {expandedSubCategory === 'DOTCompliance' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'Hours of Service', 'Driver Logs', 'Vehicle Inspections', 'Safety Records',
                              'Drug Testing', 'Medical Certificates', 'License Verification', 'Audit Reports',
                              'Violation Tracking', 'Compliance Alerts'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`compliance_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`compliance_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* 📚 Resources */}
                <div style={{ marginBottom: '8px' }}>
                  <div 
                    onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === 'Resources' ? '' : 'Resources')}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 12px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginBottom: '4px'
                    }}
                  >
                    <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                      {expandedPermissionCategory === 'Resources' ? '▼' : '▶'} 📚 Resources
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>2 Sub-categories</span>
                  </div>
                  
                  {expandedPermissionCategory === 'Resources' && (
                    <div style={{ marginLeft: '12px', marginBottom: '6px' }}>
                      {/* FleetFlow University */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'FleetFlowUniversity' ? '' : 'FleetFlowUniversity')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'FleetFlowUniversity' ? '▼' : '▶'} FleetFlow University
                          </span>
                        </div>
                        {expandedSubCategory === 'FleetFlowUniversity' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View Courses', 'Create Courses', 'Assign Training', 'Track Progress',
                              'Certifications', 'Training Records', 'Course Materials', 'Assessment Tools'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`university_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`university_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Documentation */}
                      <div style={{ marginBottom: '6px' }}>
                        <div 
                          onClick={() => setExpandedSubCategory(expandedSubCategory === 'Documentation' ? '' : 'Documentation')}
                          style={{
                            padding: '6px 8px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginBottom: '3px'
                          }}
                        >
                          <span style={{ color: '#f59e0b', fontWeight: '500', fontSize: '12px' }}>
                            {expandedSubCategory === 'Documentation' ? '▼' : '▶'} Documentation
                          </span>
                        </div>
                        {expandedSubCategory === 'Documentation' && (
                          <div style={{ marginLeft: '8px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px' }}>
                            {[
                              'View Docs', 'Create Docs', 'Edit Docs', 'Document Management',
                              'Version Control', 'Access Control', 'Search Docs', 'Document Analytics'
                            ].map(permission => (
                              <label key={permission} style={{ display: 'flex', alignItems: 'center', padding: '3px', cursor: 'pointer' }}>
                                <input
                                  type="checkbox"
                                  checked={userPermissions[`docs_${permission.toLowerCase().replace(/ /g, '_')}`] || false}
                                  onChange={(e) => setUserPermissions(prev => ({
                                    ...prev,
                                    [`docs_${permission.toLowerCase().replace(/ /g, '_')}`]: e.target.checked
                                  }))}
                                  style={{ marginRight: '4px', transform: 'scale(0.8)' }}
                                />
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '10px' }}>{permission}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Permission Controls */}
              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  Selected: {Object.values(userPermissions).filter(Boolean).length} permissions (113+ available)
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={() => setUserPermissions({})}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeView === 'analytics' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 24px 0' }}>
              User Analytics Dashboard
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {[
                { title: 'Login Activity', value: '94%', subtitle: 'Users active this week', color: '#10b981' },
                { title: 'Permission Usage', value: '76%', subtitle: 'Average permission utilization', color: '#3b82f6' },
                { title: 'System Access', value: '12.3hrs', subtitle: 'Average daily usage', color: '#f59e0b' },
                { title: 'Security Score', value: '98%', subtitle: 'Compliance rating', color: '#8b5cf6' }
              ].map((metric, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: metric.color, marginBottom: '8px' }}>
                    {metric.value}
                  </div>
                  <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                    {metric.title}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                    {metric.subtitle}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                User Details
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ color: 'white' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>{selectedUser.name}</h3>
              <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)' }}>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)' }}>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)' }}>
                <strong>Department:</strong> {selectedUser.department}
              </p>
              <p style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)' }}>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p style={{ margin: '0 0 16px 0', color: 'rgba(255,255,255,0.8)' }}>
                <strong>User ID:</strong> {selectedUser.id}
              </p>

              <h4 style={{ margin: '20px 0 12px 0', fontSize: '16px' }}>Permissions</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.entries(selectedUser.permissions)
                  .filter(([_, value]) => value)
                  .map(([key, _]) => (
                    <span key={key} style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}>
                      {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 