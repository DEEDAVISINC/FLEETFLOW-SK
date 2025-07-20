'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Mock user data - with specific system access for each user
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
    systemAccess: {
      level: 'Full Control',
      accessCode: 'ACC-FM-MGR',
      securityLevel: 'Level 4 - Management',
      allowedSystems: ['All FleetFlow Systems', 'Admin Portal', 'Analytics Dashboard', 'User Management']
    },
    permissions: {
      canViewDashboard: true,
      canManageUsers: true,
      canAccessReports: true,
      canManageFleet: true
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
    systemAccess: {
      level: 'Load & Driver Management',
      accessCode: 'ACC-SJ-DC',
      securityLevel: 'Level 3 - Operations',
      allowedSystems: ['Dispatch Central', 'Driver Management', 'Load Tracking', 'Route Planning']
    },
    permissions: {
      canViewDashboard: true,
      canManageLoads: true,
      canAssignDrivers: true,
      canViewReports: false
    }
  },
  {
    id: 'MJ-BB-2024020',
    name: 'Mike Johnson',
    email: 'mike.johnson@fleetflow.com',
    department: 'Brokerage',
    departmentCode: 'BB',
    role: 'Freight Broker',
    status: 'active',
    lastActive: '2024-01-14T16:45:00Z',
    systemAccess: {
      level: 'Customer & Rate Management',
      accessCode: 'ACC-MJ-BB',
      securityLevel: 'Level 3 - Sales',
      allowedSystems: ['FreightFlow RFx', 'Customer Portal', 'Rate Management', 'Load Board']
    },
    permissions: {
      canViewDashboard: true,
      canManageCustomers: true,
      canAccessReports: true,
      canManageRates: true
    }
  },
  {
    id: 'TD-DM-2024025',
    name: 'Tony Davis',
    email: 'tony.davis@fleetflow.com',
    department: 'Driver',
    departmentCode: 'DM',
    role: 'Senior Driver',
    status: 'active',
    lastActive: '2024-01-15T08:30:00Z',
    systemAccess: {
      level: 'Fleet Operations Only',
      accessCode: 'ACC-TD-DM',
      securityLevel: 'Level 2 - Driver',
      allowedSystems: ['Driver Portal', 'Load Status Updates', 'Document Upload', 'Route Navigation']
    },
    permissions: {
      canViewDashboard: true,
      canUpdateStatus: true,
      canAccessDocuments: true,
      canManageUsers: false
    }
  }
];

export default function CompactUserManagement() {
  // State management
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPermissionCategory, setExpandedPermissionCategory] = useState<string>('');

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentUser = filteredUsers[selectedUserIndex] || filteredUsers[0];

  const getDepartmentColor = (deptCode: string) => {
    switch (deptCode) {
      case 'MGR': return '#8b5cf6';
      case 'DC': return '#3b82f6';
      case 'BB': return '#f59e0b';
      case 'DM': return '#eab308';
      default: return '#6b7280';
    }
  };

  const refreshData = () => {
    console.log('🔄 Refreshing user data...');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 40% 60%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)
      `,
      backgroundSize: '100% 100%, 800px 800px',
      backgroundPosition: '0 0, 0 0',
      backgroundAttachment: 'fixed',
      paddingTop: '80px',
      position: 'relative'
    }}>
      {/* Compact Back Button */}
      <div style={{ padding: '16px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px'
          }}>
            <span style={{ marginRight: '6px' }}>←</span>Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px 24px' }}>
        {/* Compact Header with Search */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '10px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}>
                <span style={{ fontSize: '18px' }}>👥</span>
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: '0 0 4px 0' }}>
                  User Management
                </h1>
                <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: '0' }}>
                  Compact user & permission management • {filteredUsers.length} users found
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Search Users */}
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none',
                  width: '200px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <button 
                onClick={refreshData}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                🔄 Refresh
              </button>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '12px'
              }}>
                + Add User
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Grid - Left: Book-Flipping Users, Right: Compact Panels */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* LEFT SIDE: Book-Flipping User Display (Main Focus) */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          }}>
            {/* User Navigation Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setSelectedUserIndex(prev => prev > 0 ? prev - 1 : filteredUsers.length - 1)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                ◀ Previous
              </button>
              
              <div style={{ color: 'white', fontSize: '16px', fontWeight: '600', textAlign: 'center' }}>
                <div>User {selectedUserIndex + 1} of {filteredUsers.length}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>
                  {currentUser?.department} Department
                </div>
              </div>
              
              <button
                onClick={() => setSelectedUserIndex(prev => prev < filteredUsers.length - 1 ? prev + 1 : 0)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Next ▶
              </button>
            </div>

            {/* Current User Display */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              minHeight: '420px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `linear-gradient(135deg, ${getDepartmentColor(currentUser?.departmentCode)}, ${getDepartmentColor(currentUser?.departmentCode)}dd)`,
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}>
                  {currentUser?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: 'white', margin: '0 0 6px 0', fontSize: '24px', fontWeight: '700' }}>
                    {currentUser?.name}
                  </h2>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 4px 0', fontSize: '16px' }}>
                    {currentUser?.role}
                  </p>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '0', fontSize: '14px' }}>
                    {currentUser?.email}
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  color: '#10b981'
                }}>
                  <span style={{ fontSize: '14px' }}>🟢</span>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Active</span>
                </div>
              </div>

              {/* Compact User Details - 3 Column Layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
                  <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Contact Info</h3>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>ID:</strong> {currentUser?.id}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>Department:</strong> {currentUser?.department}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Status:</strong> {currentUser?.status}
                  </div>
                </div>
                
                <div style={{ 
                  background: `${getDepartmentColor(currentUser?.departmentCode)}20`,
                  borderRadius: '10px', 
                  padding: '16px',
                  border: `1px solid ${getDepartmentColor(currentUser?.departmentCode)}66`
                }}>
                  <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                    🔐 System Access
                  </h3>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>Level:</strong> {currentUser?.systemAccess?.level}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '6px' }}>
                    <strong>Security:</strong> {currentUser?.systemAccess?.securityLevel}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                    <strong>Code:</strong> {currentUser?.systemAccess?.accessCode}
                  </div>
                </div>

                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px' }}>
                  <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Active Permissions</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Object.entries(currentUser?.permissions || {}).filter(([_, value]) => value).map(([key, _]) => (
                      <span key={key} style={{
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#10b981',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500'
                      }}>
                        {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
                    {Object.values(currentUser?.permissions || {}).filter(Boolean).length} active permissions
                  </div>
                </div>
              </div>

              {/* User's Allowed Systems */}
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <h3 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
                  🏢 Allowed Systems & Applications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {currentUser?.systemAccess?.allowedSystems?.map((system, index) => (
                    <div key={index} style={{
                      background: `${getDepartmentColor(currentUser?.departmentCode)}30`,
                      color: getDepartmentColor(currentUser?.departmentCode),
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '500',
                      textAlign: 'center',
                      border: `1px solid ${getDepartmentColor(currentUser?.departmentCode)}40`
                    }}>
                      {system}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: 1
                }}>
                  ✏️ Edit User
                </button>
                <button style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '14px',
                  flex: 1
                }}>
                  🔐 Manage Permissions
                </button>
              </div>
            </div>

            {/* Page Indicator Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              {filteredUsers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedUserIndex(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    background: selectedUserIndex === index ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Compact Feature Panels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Compact Permission Categories */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: '0 0 12px 0' }}>
                Permission Categories
              </h2>
              
              <div style={{ maxHeight: '220px', overflowY: 'auto', fontSize: '11px' }}>
                {[
                  { name: 'Operations', icon: '🚛', color: '#3b82f6', count: 25 },
                  { name: 'Driver Mgmt', icon: '👨‍💼', color: '#eab308', count: 18 },
                  { name: 'Fleet', icon: '🚚', color: '#8b5cf6', count: 22 },
                  { name: 'Analytics', icon: '📊', color: '#06b6d4', count: 16 },
                  { name: 'Compliance', icon: '✅', color: '#10b981', count: 14 },
                  { name: 'Resources', icon: '📚', color: '#f59e0b', count: 12 }
                ].map((category, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 10px',
                    marginBottom: '4px',
                    background: expandedPermissionCategory === category.name ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setExpandedPermissionCategory(expandedPermissionCategory === category.name ? '' : category.name)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px' }}>{category.icon}</span>
                      <span style={{ color: 'white', fontWeight: '500', fontSize: '13px' }}>{category.name}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>{category.count}</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>
                        {expandedPermissionCategory === category.name ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ marginTop: '10px', fontSize: '10px', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                Total: 107 permissions available
              </div>
            </div>

            {/* User Stats - Compact */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: '0 0 12px 0' }}>
                Quick Stats
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>👥</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>{filteredUsers.length}</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '10px' }}>Total Users</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>✅</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>{filteredUsers.filter(u => u.status === 'active').length}</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '10px' }}>Active</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🏢</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>4</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '10px' }}>Departments</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🔐</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>107</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '10px' }}>Permissions</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
