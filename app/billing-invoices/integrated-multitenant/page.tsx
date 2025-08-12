'use client';

import { useState, useEffect } from 'react';
import { useMultiTenantPayments } from '../../hooks/useMultiTenantPayments';
import { UnifiedInvoiceRequest } from '../../services/MultiTenantPaymentService';
import MultiTenantPaymentProviders from '../../components/MultiTenantPaymentProviders';

// Mock function to get current user's tenant ID
function getCurrentTenantId(): string {
  return 'acme-logistics'; // In production, get from auth/context
}

function getCurrentUser() {
  return {
    id: 'user123',
    name: 'John Manager',
    role: 'Manager',
    department: 'MGR',
    tenantId: getCurrentTenantId(),
  };
}

interface Invoice {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description: string;
  dueDate: string;
  lineItems: {
    name: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export default function IntegratedMultiTenantBillingPage() {
  const currentUser = getCurrentUser();
  const tenantId = currentUser.tenantId;

  // Multi-tenant payment system hook
  const {
    config: paymentConfig,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading: paymentsLoading,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'payments' | 'providers'>('dashboard');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [processingInvoice, setProcessingInvoice] = useState(false);
  const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);

  // Sample invoice data
  const [invoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      customerName: 'ABC Logistics Inc',
      customerEmail: 'billing@abclogistics.com',
      companyName: 'ABC Logistics Inc',
      amount: 2500,
      status: 'draft',
      description: 'Transportation services from Chicago to Miami',
      dueDate: '2024-02-15',
      lineItems: [
        {
          name: 'Load Transportation',
          description: 'Full truckload Chicago to Miami',
          quantity: 1,
          rate: 2500,
          amount: 2500,
        },
      ],
    },
    {
      id: 'INV-002',
      customerName: 'XYZ Transport LLC',
      customerEmail: 'billing@xyztransport.com',
      companyName: 'XYZ Transport LLC',
      amount: 1800,
      status: 'sent',
      description: 'Transportation services from Dallas to Denver',
      dueDate: '2024-02-20',
      lineItems: [
        {
          name: 'Load Transportation',
          description: 'Partial truckload Dallas to Denver',
          quantity: 1,
          rate: 1800,
          amount: 1800,
        },
      ],
    },
    {
      id: 'INV-003',
      customerName: 'Best Shipping Co',
      customerEmail: 'billing@bestshipping.com',
      companyName: 'Best Shipping Company',
      amount: 3200,
      status: 'paid',
      description: 'Transportation services from Los Angeles to New York',
      dueDate: '2024-01-30',
      lineItems: [
        {
          name: 'Load Transportation',
          description: 'Cross-country transportation service',
          quantity: 1,
          rate: 3200,
          amount: 3200,
        },
      ],
    },
  ]);

  useEffect(() => {
    if (primaryProvider && !selectedProvider) {
      setSelectedProvider(primaryProvider);
    }
  }, [primaryProvider, selectedProvider]);

  // Create invoice using multi-tenant system
  const handleCreateInvoice = async (invoice: Invoice, provider?: string) => {
    const targetProvider = provider || selectedProvider;
    if (!targetProvider) {
      alert('Please select a payment provider or configure a primary provider');
      return;
    }

    setProcessingInvoice(true);

    const invoiceRequest: UnifiedInvoiceRequest = {
      tenantId,
      provider: targetProvider as any,
      customerName: invoice.customerName,
      companyName: invoice.companyName,
      email: invoice.customerEmail,
      title: `FleetFlow Invoice ${invoice.id}`,
      description: invoice.description,
      lineItems: invoice.lineItems,
      dueDate: invoice.dueDate,
      customFields: [
        { label: 'Invoice ID', value: invoice.id },
        { label: 'Tenant', value: tenantId },
        { label: 'Created By', value: currentUser.name },
        { label: 'Department', value: currentUser.department },
      ],
    };

    try {
      const result = await createInvoice(invoiceRequest);
      
      // Add to history
      setInvoiceHistory(prev => [{
        ...result,
        timestamp: new Date().toISOString(),
        originalInvoice: invoice,
      }, ...prev]);

      if (result.success) {
        alert(`✅ Invoice ${invoice.id} created successfully with ${targetProvider}!

Provider: ${result.provider}
Invoice ID: ${result.invoiceId}
Invoice Number: ${result.invoiceNumber}
Amount: $${result.amount?.toLocaleString()}
Status: ${result.status}
Public URL: ${result.publicUrl}

The customer will receive the invoice via email.`);
      } else {
        alert(`❌ Failed to create invoice with ${targetProvider}: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessingInvoice(false);
    }
  };

  // Get provider display name
  const getProviderDisplayName = (providerName: string) => {
    return availableProviders.find(p => p.name === providerName)?.displayName || providerName;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return '#22c55e';
      case 'sent': return '#3b82f6';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (paymentsLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
          <div>Loading payment providers...</div>
        </div>
      </div>
    );
  }

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
          💼 Multi-Tenant Billing & Invoicing
        </h1>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#6b7280',
          fontSize: '14px',
        }}>
          <span>Tenant: <strong>{tenantId}</strong></span>
          <span>User: <strong>{currentUser.name}</strong></span>
          <span>Active Providers: <strong>{activeProviders.length}</strong></span>
          <span>Primary: <strong style={{ color: primaryProvider ? '#10b981' : '#ef4444' }}>
            {primaryProvider ? getProviderDisplayName(primaryProvider) : 'Not Set'}
          </strong></span>
        </div>
      </div>

      {/* Provider Status */}
      {activeProviders.length === 0 && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #ef4444',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#dc2626', marginBottom: '8px' }}>No Payment Providers Configured</h2>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              You need to configure at least one payment provider to create and send invoices.
            </p>
            <button
              onClick={() => setActiveTab('providers')}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Configure Payment Providers
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '8px',
        marginBottom: '20px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        gap: '8px',
      }}>
        {[
          { key: 'dashboard', label: '📊 Dashboard', icon: '📊' },
          { key: 'invoices', label: '📄 Invoices', icon: '📄' },
          { key: 'payments', label: '💳 Payments', icon: '💳' },
          { key: 'providers', label: '⚙️ Providers', icon: '⚙️' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: activeTab === tab.key ? '#3b82f6' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
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

      {/* Content */}
      {activeTab === 'dashboard' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}>
          {/* Statistics Cards */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>📊 Invoice Summary</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Invoices:</span>
                <strong>{invoices.length}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Amount:</span>
                <strong>${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Paid:</span>
                <strong style={{ color: '#22c55e' }}>
                  {invoices.filter(inv => inv.status === 'paid').length}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Pending:</span>
                <strong style={{ color: '#f59e0b' }}>
                  {invoices.filter(inv => inv.status === 'sent').length}
                </strong>
              </div>
            </div>
          </div>

          {/* Provider Status */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>💳 Payment Providers</h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              {availableProviders.map((provider) => {
                const isActive = activeProviders.includes(provider.name);
                const isPrimary = primaryProvider === provider.name;
                
                return (
                  <div key={provider.name} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: isPrimary ? '#f0fdf4' : isActive ? '#f9fafb' : '#fef2f2',
                    borderRadius: '8px',
                    border: `1px solid ${isPrimary ? '#bbf7d0' : isActive ? '#e5e7eb' : '#fecaca'}`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>
                        {provider.name === 'square' && '🟨'}
                        {provider.name === 'billcom' && '💸'}
                        {provider.name === 'quickbooks' && '📊'}
                        {provider.name === 'stripe' && '💳'}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>
                        {provider.displayName}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: '600',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: isPrimary ? '#dcfce7' : isActive ? '#f3f4f6' : '#fee2e2',
                      color: isPrimary ? '#166534' : isActive ? '#374151' : '#dc2626',
                    }}>
                      {isPrimary ? 'PRIMARY' : isActive ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            gridColumn: 'span 2',
          }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>🕐 Recent Invoice Activity</h3>
            {invoiceHistory.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                color: '#6b7280', 
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '8px',
              }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
                <p>No recent invoice activity. Create your first invoice to get started!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                {invoiceHistory.map((history, index) => (
                  <div key={index} style={{
                    background: history.success ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${history.success ? '#bbf7d0' : '#fecaca'}`,
                    borderRadius: '8px',
                    padding: '12px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: '500' }}>
                          {history.success ? '✅' : '❌'} Invoice {history.originalInvoice.id}
                        </span>
                        <span style={{ color: '#6b7280', fontSize: '14px', marginLeft: '8px' }}>
                          via {getProviderDisplayName(history.provider)}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(history.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {history.success && (
                      <div style={{ fontSize: '12px', color: '#166534', marginTop: '4px' }}>
                        Invoice #{history.invoiceNumber} • ${history.amount?.toLocaleString()}
                      </div>
                    )}
                    {!history.success && (
                      <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px' }}>
                        Error: {history.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: '#1f2937' }}>📄 Invoice Management</h2>
            {activeProviders.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ fontSize: '14px', fontWeight: '500' }}>Default Provider:</label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                >
                  {activeProviders.map(provider => (
                    <option key={provider} value={provider}>
                      {getProviderDisplayName(provider)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Invoices Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Invoice ID</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Due Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice, index) => (
                  <tr key={invoice.id} style={{
                    borderBottom: index < invoices.length - 1 ? '1px solid #e5e7eb' : 'none',
                  }}>
                    <td style={{ padding: '12px', color: '#374151', fontWeight: '500' }}>{invoice.id}</td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      <div>{invoice.customerName}</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>{invoice.customerEmail}</div>
                    </td>
                    <td style={{ padding: '12px', color: '#374151', fontWeight: '500' }}>
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: `${getStatusColor(invoice.status)}20`,
                        color: getStatusColor(invoice.status),
                      }}>
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>{invoice.dueDate}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {activeProviders.map((provider) => (
                          <button
                            key={provider}
                            onClick={() => handleCreateInvoice(invoice, provider)}
                            disabled={processingInvoice}
                            style={{
                              padding: '6px 12px',
                              background: processingInvoice ? '#9ca3af' : '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor: processingInvoice ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {processingInvoice ? '⏳' : '📧'} {getProviderDisplayName(provider)}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'providers' && (
        <MultiTenantPaymentProviders
          tenantId={tenantId}
          userRole={currentUser.role}
        />
      )}
    </div>
  );
}






















