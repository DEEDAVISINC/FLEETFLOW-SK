'use client';

/**
 * Settings Page Integration Example - Multi-Tenant Payment Providers
 * Shows how to integrate payment provider management into user settings
 */

import { useState } from 'react';
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import MultiTenantPaymentProviders from '../components/MultiTenantPaymentProviders';

// Mock function to get current user/tenant
function getCurrentUser() {
  return {
    id: 'user123',
    name: 'John Manager',
    email: 'john@acme-logistics.com',
    role: 'Manager',
    department: 'MGR',
    tenantId: 'acme-logistics',
    permissions: ['payments.manage', 'providers.configure'],
  };
}

interface SettingsTabProps {
  tenantId: string;
  user: any;
}

function PaymentProvidersSettingsTab({ tenantId, user }: SettingsTabProps) {
  const {
    config,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading,
    error,
  } = useMultiTenantPayments(tenantId);

  if (loading) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
        <div>Loading payment provider settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '20px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626',
      }}>
        <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
          ⚠️ Error Loading Payment Settings
        </div>
        <div style={{ fontSize: '14px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '0' }}>
      {/* Payment Provider Overview */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{ fontSize: '20px' }}>💳</span>
          Payment Provider Overview
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}>
          {/* Total Providers */}
          <div style={{
            background: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#3b82f6',
              marginBottom: '4px',
            }}>
              {availableProviders.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Available Providers
            </div>
          </div>

          {/* Active Providers */}
          <div style={{
            background: '#f0fdf4',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#10b981',
              marginBottom: '4px',
            }}>
              {activeProviders.length}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Active Providers
            </div>
          </div>

          {/* Primary Provider */}
          <div style={{
            background: primaryProvider ? '#f0f9ff' : '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: primaryProvider ? '#0369a1' : '#dc2626',
              marginBottom: '4px',
            }}>
              {primaryProvider ? 
                availableProviders.find(p => p.name === primaryProvider)?.displayName :
                'Not Set'
              }
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Primary Provider
            </div>
          </div>

          {/* Configuration Status */}
          <div style={{
            background: activeProviders.length > 0 ? '#f0fdf4' : '#fef3c7',
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: activeProviders.length > 0 ? '#166534' : '#d97706',
              marginBottom: '4px',
            }}>
              {activeProviders.length > 0 ? 'Configured' : 'Setup Required'}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Configuration Status
            </div>
          </div>
        </div>

        {/* Quick Status */}
        <div style={{
          padding: '12px',
          background: activeProviders.length > 0 ? '#f0f9ff' : '#fef3c7',
          border: `1px solid ${activeProviders.length > 0 ? '#bae6fd' : '#fde68a'}`,
          borderRadius: '8px',
          fontSize: '14px',
          color: activeProviders.length > 0 ? '#0369a1' : '#d97706',
        }}>
          {activeProviders.length > 0 ? (
            <div>
              <strong>✅ Payment Processing Active</strong>
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                You can create and send invoices using {activeProviders.length} provider{activeProviders.length !== 1 && 's'}: {' '}
                {activeProviders.map((provider, index) => (
                  <span key={provider}>
                    {availableProviders.find(p => p.name === provider)?.displayName}
                    {index < activeProviders.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <strong>⚠️ Payment Providers Required</strong>
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                Configure at least one payment provider below to enable invoice creation and payment processing.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Provider Management Interface */}
      <MultiTenantPaymentProviders
        tenantId={tenantId}
        userRole={user.role}
      />

      {/* Settings Information */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
          💡 Payment Provider Information
        </h4>
        
        <div style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
          <div style={{
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '6px',
          }}>
            <strong>🟨 Square</strong>
            <div style={{ color: '#6b7280', marginTop: '2px' }}>
              Best for: Retail, POS integration, small-medium businesses
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            background: '#f0fdf4',
            borderRadius: '6px',
          }}>
            <strong>💸 Bill.com</strong>
            <div style={{ color: '#6b7280', marginTop: '2px' }}>
              Best for: B2B invoicing, accounts payable, enterprise accounting
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            background: '#fef3c7',
            borderRadius: '6px',
          }}>
            <strong>📊 QuickBooks</strong>
            <div style={{ color: '#6b7280', marginTop: '2px' }}>
              Best for: Accounting integration, financial reporting, existing QB users
            </div>
          </div>
          
          <div style={{
            padding: '12px',
            background: '#f3f4f6',
            borderRadius: '6px',
          }}>
            <strong>💳 Stripe</strong>
            <div style={{ color: '#6b7280', marginTop: '2px' }}>
              Best for: Online payments, subscriptions, international transactions
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#0369a1',
        }}>
          <strong>🔒 Security & Compliance:</strong> All payment providers are configured with encrypted credentials and follow industry security standards. Your payment data is never stored locally and all transactions are processed securely through each provider's certified systems.
        </div>
      </div>
    </div>
  );
}

export default function SettingsWithPaymentIntegration() {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'payments' | 'notifications' | 'security'>('profile');
  const currentUser = getCurrentUser();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}>
        <h1 style={{
          margin: '0 0 8px 0',
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#1f2937',
        }}>
          ⚙️ Settings
        </h1>
        <div style={{
          color: '#6b7280',
          fontSize: '14px',
        }}>
          Manage your account, payment providers, and system preferences
        </div>
      </div>

      {/* Settings Container */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}>
        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          background: '#f9fafb',
          borderBottom: '1px solid #e5e7eb',
        }}>
          {[
            { key: 'profile', label: '👤 Profile', icon: '👤' },
            { key: 'account', label: '🏢 Account', icon: '🏢' },
            { key: 'payments', label: '💳 Payment Providers', icon: '💳' },
            { key: 'notifications', label: '🔔 Notifications', icon: '🔔' },
            { key: 'security', label: '🔒 Security', icon: '🔒' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                flex: 1,
                padding: '16px 12px',
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
                border: 'none',
                borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ minHeight: '500px' }}>
          {activeTab === 'profile' && (
            <div style={{ padding: '32px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>👤 User Profile</h2>
              <div style={{ display: 'grid', gap: '16px', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Name</label>
                  <input
                    type="text""
                    value={currentUser.name}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: '#f9fafb',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Email</label>
                  <input
                    type="email""
                    value={currentUser.email}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: '#f9fafb',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>Role</label>
                  <input
                    type="text""
                    value={currentUser.role}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: '#f9fafb',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div style={{ padding: '32px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>🏢 Account Settings</h2>
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Organization:</strong> {currentUser.tenantId}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Department:</strong> {currentUser.department}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <strong>Permissions:</strong> {currentUser.permissions.join(', ')}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div style={{ padding: '32px' }}>
              <PaymentProvidersSettingsTab
                tenantId={currentUser.tenantId}
                user={currentUser}
              />
            </div>
          )}

          {activeTab === 'notifications' && (
            <div style={{ padding: '32px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>🔔 Notification Settings</h2>
              <div>Notification preferences would go here...</div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ padding: '32px' }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#1f2937' }}>🔒 Security Settings</h2>
              <div>Security settings would go here...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



































