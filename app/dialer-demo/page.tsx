'use client';

import { useState } from 'react';
import DialerAccessManagement from '../components/DialerAccessManagement';
import FloatingDialerWidget from '../components/FloatingDialerWidget';
import {
  getDialerAccess,
  getDialerAccessDescription,
  shouldShowDialer,
} from '../utils/dialerAccess';

// Demo page showing dialer integration with different user roles
export default function DialerDemoPage() {
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Sample users with different dialer access levels
  const demoUsers = [
    {
      id: 'CS-001',
      name: 'Alice Customer Service',
      firstName: 'Alice',
      lastName: 'Customer Service',
      email: 'alice@fleetflow.com',
      phone: '(555) 123-4567',
      location: 'Customer Service',
      department: 'CS',
      role: 'Customer Service',
      status: 'Active',
      lastLogin: '2024-12-19 10:30',
      permissions: ['dashboard_view', 'invoices_view'],
      createdDate: '2024-01-01',
    },
    {
      id: 'SALES-001',
      name: 'Bob Sales Rep',
      firstName: 'Bob',
      lastName: 'Sales Rep',
      email: 'bob@fleetflow.com',
      phone: '(555) 234-5678',
      location: 'Sales Office',
      department: 'SALES',
      role: 'Sales',
      status: 'Active',
      lastLogin: '2024-12-19 11:15',
      permissions: ['dashboard_view', 'broker_access'],
      createdDate: '2024-01-01',
    },
    {
      id: 'DC-001',
      name: 'Carol Dispatcher (Enabled)',
      firstName: 'Carol',
      lastName: 'Dispatcher',
      email: 'carol@fleetflow.com',
      phone: '(555) 345-6789',
      location: 'Dispatch Center',
      department: 'DC',
      role: 'Dispatcher',
      status: 'Active',
      lastLogin: '2024-12-19 12:00',
      permissions: ['dashboard_view', 'dispatch_access', 'dialer_access'], // Has dialer enabled
      createdDate: '2024-01-01',
    },
    {
      id: 'DC-002',
      name: 'Dave Dispatcher (Disabled)',
      firstName: 'Dave',
      lastName: 'Dispatcher',
      email: 'dave@fleetflow.com',
      phone: '(555) 456-7890',
      location: 'Dispatch Center',
      department: 'DC',
      role: 'Dispatcher',
      status: 'Active',
      lastLogin: '2024-12-19 13:30',
      permissions: ['dashboard_view', 'dispatch_access'], // No dialer access
      createdDate: '2024-01-01',
    },
    {
      id: 'BB-001',
      name: 'Eve Broker (Enabled)',
      firstName: 'Eve',
      lastName: 'Broker',
      email: 'eve@fleetflow.com',
      phone: '(555) 567-8901',
      location: 'Broker Office',
      department: 'BB',
      role: 'Broker',
      status: 'Active',
      lastLogin: '2024-12-19 14:15',
      permissions: ['dashboard_view', 'broker_access', 'dialer_access'], // Has dialer enabled
      createdDate: '2024-01-01',
    },
    {
      id: 'DM-001',
      name: 'Frank Driver',
      firstName: 'Frank',
      lastName: 'Driver',
      email: 'frank@fleetflow.com',
      phone: '(555) 678-9012',
      location: 'On Route',
      department: 'DM',
      role: 'Driver',
      status: 'Active',
      lastLogin: '2024-12-19 08:00',
      permissions: ['dashboard_view'],
      createdDate: '2024-01-01',
    },
  ];

  const handleUserUpdate = (updatedUser: any) => {
    // In a real app, this would update the user in your backend
    console.log('User updated:', updatedUser);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 16px 0',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            📞 Dialer System Demo
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0,
            }}
          >
            Role-based phone dialer integration with user management controls
          </p>
        </div>

        {/* User Selection Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {demoUsers.map((user) => {
            const accessLevel = getDialerAccess(user);
            const description = getDialerAccessDescription(user);
            const showDialer = shouldShowDialer(user);

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border:
                    selectedUser?.id === user.id
                      ? '2px solid rgba(34, 197, 94, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
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
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                    }}
                  >
                    {user.department === 'CS'
                      ? '🎧'
                      : user.department === 'SALES'
                        ? '💼'
                        : user.department === 'DC'
                          ? '📋'
                          : user.department === 'BB'
                            ? '🤝'
                            : user.department === 'DM'
                              ? '🚛'
                              : '👤'}
                  </div>
                  <div>
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        margin: '0 0 4px 0',
                      }}
                    >
                      {user.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: 0,
                      }}
                    >
                      {user.role} ({user.department})
                    </p>
                  </div>
                </div>

                {/* Access Status */}
                <div
                  style={{
                    background:
                      accessLevel === 'required'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : accessLevel === 'enabled'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : accessLevel === 'disabled'
                            ? 'rgba(156, 163, 175, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                    color:
                      accessLevel === 'required'
                        ? '#22c55e'
                        : accessLevel === 'enabled'
                          ? '#3b82f6'
                          : accessLevel === 'disabled'
                            ? '#9ca3af'
                            : '#ef4444',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  {accessLevel === 'required'
                    ? '✅ REQUIRED'
                    : accessLevel === 'enabled'
                      ? '🟢 ENABLED'
                      : accessLevel === 'disabled'
                        ? '⚪ DISABLED'
                        : '❌ RESTRICTED'}
                </div>

                {/* Dialer Widget Preview */}
                <div
                  style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center',
                  }}
                >
                  Dialer Widget: {showDialer ? 'Visible 📞' : 'Hidden'}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Details Panel */}
        {selectedUser && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: '0 0 24px 0',
              }}
            >
              User Management: {selectedUser.name}
            </h2>

            <DialerAccessManagement
              user={selectedUser}
              onUpdateUser={handleUserUpdate}
            />
          </div>
        )}

        {/* Demo Dialer Widget */}
        {selectedUser && shouldShowDialer(selectedUser) && (
          <FloatingDialerWidget
            userRole={selectedUser.role}
            department={selectedUser.department}
            hasDialerAccess={selectedUser.permissions.includes('dialer_access')}
          />
        )}
      </div>
    </div>
  );
}
