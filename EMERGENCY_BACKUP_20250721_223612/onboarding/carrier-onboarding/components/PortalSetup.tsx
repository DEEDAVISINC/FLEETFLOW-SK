'use client';

import React, { useState } from 'react';

interface PortalUser {
  id: string;
  email: string;
  role: 'owner' | 'manager' | 'driver';
  firstName: string;
  lastName: string;
  phone: string;
  permissions: string[];
  accountCreated: boolean;
  initialPasswordSent: boolean;
  lastLogin?: string;
  status: 'pending' | 'active' | 'suspended';
}

interface PortalSetupData {
  portalEnabled: boolean;
  users: PortalUser[];
  portalFeatures: string[];
  trainingCompleted: boolean;
  portalUrl?: string;
}

interface PortalSetupProps {
  onPortalSetup: (data: PortalSetupData) => void;
  onComplete: (data: PortalSetupData) => void;
  onBack: () => void;
}

export const PortalSetup: React.FC<PortalSetupProps> = ({ onPortalSetup, onComplete, onBack }) => {
  const [portalEnabled, setPortalEnabled] = useState(true);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'document_upload',
    'load_tracking',
    'invoice_status'
  ]);
  const [currentUserForm, setCurrentUserForm] = useState<Partial<PortalUser>>({
    role: 'owner',
    permissions: ['full_access']
  });
  const [showUserForm, setShowUserForm] = useState(false);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [setupInProgress, setSetupInProgress] = useState(false);

  const availableFeatures = [
    { id: 'document_upload', name: 'Document Upload', description: 'Upload and manage required documents' },
    { id: 'load_tracking', name: 'Load Tracking', description: 'Real-time tracking of assigned loads' },
    { id: 'invoice_status', name: 'Invoice Status', description: 'View payment and invoice status' },
    { id: 'settlement_history', name: 'Settlement History', description: 'Access historical settlement reports' },
    { id: 'driver_management', name: 'Driver Management', description: 'Manage driver profiles and documents' },
    { id: 'equipment_tracking', name: 'Equipment Tracking', description: 'Track and manage equipment' },
    { id: 'communication', name: 'Communication Hub', description: 'Direct messaging with dispatch' },
    { id: 'compliance_alerts', name: 'Compliance Alerts', description: 'Notifications for expiring documents' }
  ];

  const rolePermissions = {
    owner: ['full_access', 'user_management', 'financial_reports', 'settings'],
    manager: ['load_management', 'driver_oversight', 'reporting', 'document_review'],
    driver: ['load_status', 'document_upload', 'basic_tracking', 'communication']
  };

  const addUser = () => {
    if (!currentUserForm.firstName || !currentUserForm.lastName || !currentUserForm.email) {
      return;
    }

    const newUser: PortalUser = {
      id: `user_${Date.now()}`,
      email: currentUserForm.email!,
      role: currentUserForm.role as 'owner' | 'manager' | 'driver',
      firstName: currentUserForm.firstName!,
      lastName: currentUserForm.lastName!,
      phone: currentUserForm.phone || '',
      permissions: rolePermissions[currentUserForm.role as keyof typeof rolePermissions],
      accountCreated: false,
      initialPasswordSent: false,
      status: 'pending'
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUserForm({ role: 'driver', permissions: ['basic_access'] });
    setShowUserForm(false);
  };

  const removeUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const createAccounts = async () => {
    setSetupInProgress(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedUsers = users.map(user => ({
        ...user,
        accountCreated: true,
        initialPasswordSent: true,
        status: 'active' as const
      }));
      
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Account creation failed:', error);
    } finally {
      setSetupInProgress(false);
    }
  };

  const handleComplete = () => {
    const portalData: PortalSetupData = {
      portalEnabled,
      users,
      portalFeatures: selectedFeatures,
      trainingCompleted,
      portalUrl: portalEnabled ? `https://portal.fleetflow.com/carrier/${Date.now()}` : undefined
    };

    onPortalSetup(portalData);
    onComplete(portalData);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return '👑';
      case 'manager': return '👨‍💼';
      case 'driver': return '🚛';
      default: return '👤';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const allUsersActive = users.length > 0 && users.every(user => user.accountCreated);
  const canComplete = portalEnabled ? (allUsersActive && trainingCompleted) : true;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: 'white', 
          marginBottom: '12px' 
        }}>
          👤 Portal Access Setup
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.1rem' }}>
          Configure driver and carrier portal access and permissions
        </p>
      </div>

      {/* Portal Toggle */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
            Enable Portal Access
          </h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={portalEnabled}
              onChange={(e) => setPortalEnabled(e.target.checked)}
              style={{ transform: 'scale(1.5)' }}
            />
            <span style={{ color: 'white', fontWeight: 'bold' }}>
              {portalEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Portal access allows drivers and carrier staff to upload documents, track loads, 
          view settlements, and communicate directly with dispatch.
        </p>
      </div>

      {portalEnabled && (
        <>
          {/* Feature Selection */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
              🔧 Portal Features
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
              {availableFeatures.map((feature) => (
                <label
                  key={feature.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    background: selectedFeatures.includes(feature.id) 
                      ? 'rgba(59, 130, 246, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${selectedFeatures.includes(feature.id) 
                      ? 'rgba(59, 130, 246, 0.5)' 
                      : 'rgba(255, 255, 255, 0.1)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedFeatures.includes(feature.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFeatures(prev => [...prev, feature.id]);
                      } else {
                        setSelectedFeatures(prev => prev.filter(f => f !== feature.id));
                      }
                    }}
                    style={{ marginTop: '2px' }}
                  />
                  <div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {feature.name}
                    </div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                      {feature.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* User Management */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', margin: 0 }}>
                👥 Portal Users
              </h3>
              <button
                onClick={() => setShowUserForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                + Add User
              </button>
            </div>

            {/* User List */}
            {users.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ fontSize: '1.5rem' }}>{getRoleIcon(user.role)}</div>
                        <div>
                          <div style={{ color: 'white', fontWeight: 'bold' }}>
                            {user.firstName} {user.lastName}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
                            {user.email} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          background: getStatusColor(user.status),
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {user.accountCreated ? '✅ Active' : '⏳ Pending'}
                        </span>
                        <button
                          onClick={() => removeUser(user.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: '1px solid rgba(239, 68, 68, 0.5)',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {users.some(user => !user.accountCreated) && (
                  <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <button
                      onClick={createAccounts}
                      disabled={setupInProgress}
                      style={{
                        background: setupInProgress 
                          ? '#6b7280' 
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 'bold',
                        cursor: setupInProgress ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {setupInProgress ? '⏳ Creating Accounts...' : '🚀 Create Portal Accounts'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Add User Form */}
            {showUserForm && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '16px' }}>
                  Add New Portal User
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={currentUserForm.firstName || ''}
                    onChange={(e) => setCurrentUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={currentUserForm.lastName || ''}
                    onChange={(e) => setCurrentUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={currentUserForm.email || ''}
                    onChange={(e) => setCurrentUserForm(prev => ({ ...prev, email: e.target.value }))}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  />
                  <select
                    value={currentUserForm.role}
                    onChange={(e) => setCurrentUserForm(prev => ({ ...prev, role: e.target.value as any }))}
                    style={{
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white'
                    }}
                  >
                    <option value="owner">👑 Owner</option>
                    <option value="manager">👨‍💼 Manager</option>
                    <option value="driver">🚛 Driver</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={addUser}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowUserForm(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      padding: '10px 20px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Training Completion */}
          {allUsersActive && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px'
            }}>
              <h3 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '16px' }}>
                📚 Portal Training
              </h3>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '12px' }}>
                  📋 <strong>Portal training materials have been sent to all users:</strong>
                </p>
                <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '20px' }}>
                  <li>Portal navigation and basic features</li>
                  <li>Document upload procedures</li>
                  <li>Load tracking and communication</li>
                  <li>Security best practices</li>
                </ul>
              </div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                <input
                  type="checkbox"
                  checked={trainingCompleted}
                  onChange={(e) => setTrainingCompleted(e.target.checked)}
                  style={{ transform: 'scale(1.3)' }}
                />
                Training materials reviewed and users have been onboarded
              </label>
            </div>
          )}
        </>
      )}

      {/* Summary */}
      {(portalEnabled && allUsersActive && trainingCompleted) && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🎉</div>
          <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '12px' }}>
            Portal Setup Complete!
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '16px' }}>
            All users have been created and training is complete. Portal is ready for use.
          </p>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            display: 'inline-block'
          }}>
            <strong>Portal URL:</strong> https://portal.fleetflow.com/carrier/{Date.now()}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          ← Back to Agreements
        </button>

        <div style={{ textAlign: 'center' }}>
          {!canComplete && portalEnabled && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '8px',
              padding: '8px 16px',
              color: 'white',
              fontSize: '0.9rem'
            }}>
              {!allUsersActive && 'Create portal accounts and '}
              {!trainingCompleted && 'complete training'}
            </div>
          )}
        </div>

        <button
          onClick={handleComplete}
          disabled={!canComplete}
          style={{
            background: canComplete 
              ? 'linear-gradient(135deg, #10b981, #059669)' 
              : '#6b7280',
            color: 'white',
            padding: '16px 32px',
            borderRadius: '12px',
            border: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: canComplete ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
            boxShadow: canComplete ? '0 4px 16px rgba(16, 185, 129, 0.3)' : 'none'
          }}
        >
          🎉 Complete Onboarding
        </button>
      </div>
    </div>
  );
};
