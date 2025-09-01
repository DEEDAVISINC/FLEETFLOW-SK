'use client';

import React, { useState } from 'react';
import { useMultiTenantSquare } from '../hooks/useMultiTenantSquare';

interface MultiTenantSquareIntegrationProps {
  tenantId: string;
  userRole: string;
}

export default function MultiTenantSquareIntegration({
  tenantId,
  userRole,
}: MultiTenantSquareIntegrationProps) {
  const {
    config,
    loading,
    error,
    enableSquare,
    disableSquare,
    createInvoice,
    processPayment,
    createCustomer,
    listInvoices,
    refreshConfig,
    clearError,
  } = useMultiTenantSquare(tenantId);

  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState({
    applicationId: '',
    accessToken: '',
    locationId: '',
    environment: 'sandbox' as 'sandbox' | 'production',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    customerName: '',
    companyName: '',
    email: '',
    title: 'Transportation Services',
    description: 'Load delivery services',
    amount: 1000,
  });

  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const handleEnableSquare = async () => {
    setProcessingAction('enabling');
    const result = await enableSquare(credentials);
    setProcessingAction(null);
    
    if (result.success) {
      setShowCredentials(false);
      alert('✅ Square enabled successfully!');
    } else {
      alert(`❌ Failed to enable Square: ${result.error}`);
    }
  };

  const handleDisableSquare = async () => {
    if (!confirm('Are you sure you want to disable Square? This will affect all users in your organization.')) {
      return;
    }

    setProcessingAction('disabling');
    const result = await disableSquare();
    setProcessingAction(null);
    
    if (result.success) {
      alert('Square has been disabled');
    } else {
      alert(`Failed to disable Square: ${result.error}`);
    }
  };

  const handleCreateInvoice = async () => {
    setProcessingAction('creating-invoice');
    
    const result = await createInvoice({
      customerName: invoiceForm.customerName,
      companyName: invoiceForm.companyName,
      email: invoiceForm.email,
      title: invoiceForm.title,
      description: invoiceForm.description,
      lineItems: [
        {
          name: invoiceForm.title,
          quantity: 1,
          rate: invoiceForm.amount,
          amount: invoiceForm.amount,
        },
      ],
      customFields: [
        { label: 'Tenant ID', value: tenantId },
        { label: 'Created By', value: userRole },
      ],
    });
    
    setProcessingAction(null);
    
    if (result.success) {
      alert(`✅ Invoice created successfully!\nInvoice ID: ${result.invoiceId}\nPayment URL: ${result.publicUrl}`);
    } else {
      alert(`❌ Failed to create invoice: ${result.error}`);
    }
  };

  if (loading && !config.configured) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: '#6b7280',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', marginBottom: '8px' }}>⏳</div>
          <div>Loading Square configuration...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{
            background: config.connected ? '#10b981' : '#6b7280',
            borderRadius: '50%',
            width: '12px',
            height: '12px',
          }}></span>
          Multi-Tenant Square Integration
        </h2>
        <p style={{ margin: '8px 0 0 0', color: '#6b7280' }}>
          Tenant: {tenantId} | Role: {userRole}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#dc2626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{error}</span>
          <button
            onClick={clearError}
            style={{
              background: 'none',
              border: 'none',
              color: '#dc2626',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Configuration Status */}
      <div style={{
        background: config.connected ? '#f0fdf4' : '#fef3c7',
        border: `1px solid ${config.connected ? '#bbf7d0' : '#fde68a'}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
      }}>
        <h3 style={{
          margin: '0 0 8px 0',
          color: config.connected ? '#166534' : '#92400e',
        }}>
          Square Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          <div>
            <span style={{ fontWeight: '500' }}>Configured: </span>
            <span style={{ color: config.configured ? '#10b981' : '#ef4444' }}>
              {config.configured ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: '500' }}>Connected: </span>
            <span style={{ color: config.connected ? '#10b981' : '#ef4444' }}>
              {config.connected ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: '500' }}>Enabled: </span>
            <span style={{ color: config.enabled ? '#10b981' : '#ef4444' }}>
              {config.enabled ? '✅ Yes' : '❌ No'}
            </span>
          </div>
          <div>
            <span style={{ fontWeight: '500' }}>Environment: </span>
            <span style={{
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              background: config.environment === 'production' ? '#fef3c7' : '#dbeafe',
              color: config.environment === 'production' ? '#92400e' : '#1e40af',
            }}>
              {config.environment || 'Not Set'}
            </span>
          </div>
        </div>
      </div>

      {/* Setup Section */}
      {!config.connected && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, color: '#1f2937' }}>Square Setup</h3>
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {showCredentials ? 'Cancel' : 'Configure Square'}
            </button>
          </div>

          {showCredentials && (
            <div style={{
              background: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
            }}>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Application ID
                  </label>
                  <input
                    type="text""
                    value={credentials.applicationId}
                    onChange={(e) => setCredentials({ ...credentials, applicationId: e.target.value })}
                    placeholder="sandbox-sq0idb-...""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Access Token
                  </label>
                  <input
                    type="password""
                    value={credentials.accessToken}
                    onChange={(e) => setCredentials({ ...credentials, accessToken: e.target.value })}
                    placeholder="EAAAl...""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Location ID
                  </label>
                  <input
                    type="text""
                    value={credentials.locationId}
                    onChange={(e) => setCredentials({ ...credentials, locationId: e.target.value })}
                    placeholder="Location ID""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Environment
                  </label>
                  <select
                    value={credentials.environment}
                    onChange={(e) => setCredentials({ ...credentials, environment: e.target.value as 'sandbox' | 'production' })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="sandbox"">Sandbox</option>
                    <option value="production"">Production</option>
                  </select>
                </div>
                <button
                  onClick={handleEnableSquare}
                  disabled={processingAction === 'enabling' || !credentials.applicationId || !credentials.accessToken || !credentials.locationId}
                  style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: processingAction === 'enabling' ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: processingAction === 'enabling' || !credentials.applicationId || !credentials.accessToken || !credentials.locationId ? 0.6 : 1,
                  }}
                >
                  {processingAction === 'enabling' ? 'Connecting...' : 'Connect Square'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Invoice Creation Section */}
      {config.connected && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Create Invoice</h3>
          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
          }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Customer Name
                  </label>
                  <input
                    type="text""
                    value={invoiceForm.customerName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customerName: e.target.value })}
                    placeholder="John Doe""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Company Name
                  </label>
                  <input
                    type="text""
                    value={invoiceForm.companyName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, companyName: e.target.value })}
                    placeholder="ABC Logistics""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Email Address
                </label>
                <input
                  type="email""
                  value={invoiceForm.email}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, email: e.target.value })}
                  placeholder="customer@example.com""
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Invoice Title
                  </label>
                  <input
                    type="text""
                    value={invoiceForm.title}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    Amount ($)
                  </label>
                  <input
                    type="number""
                    value={invoiceForm.amount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: parseFloat(e.target.value) || 0 })}
                    min=""0""
                    step=""0.01""
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  value={invoiceForm.description}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    resize: 'vertical',
                  }}
                />
              </div>
              <button
                onClick={handleCreateInvoice}
                disabled={processingAction === 'creating-invoice' || !invoiceForm.email}
                style={{
                  padding: '12px 24px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: processingAction === 'creating-invoice' || !invoiceForm.email ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  opacity: processingAction === 'creating-invoice' || !invoiceForm.email ? 0.6 : 1,
                }}
              >
                {processingAction === 'creating-invoice' ? 'Creating & Sending Invoice...' : 'Create & Send Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Management Section */}
      {config.connected && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={refreshConfig}
            disabled={loading}
            style={{
              padding: '10px 20px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Status'}
          </button>
          <button
            onClick={handleDisableSquare}
            disabled={processingAction === 'disabling'}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: processingAction === 'disabling' ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              opacity: processingAction === 'disabling' ? 0.6 : 1,
            }}
          >
            {processingAction === 'disabling' ? 'Disabling...' : 'Disable Square'}
          </button>
        </div>
      )}

      {/* Tenant Info */}
      <div style={{
        marginTop: '24px',
        padding: '12px',
        background: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#6b7280',
      }}>
        <strong>Multi-Tenant Features:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
          <li>✅ Tenant-isolated Square accounts</li>
          <li>✅ Per-tenant credentials management</li>
          <li>✅ Isolated customer and invoice data</li>
          <li>✅ Tenant-aware API calls</li>
          <li>✅ Role-based access control</li>
        </ul>
      </div>
    </div>
  );
}







































