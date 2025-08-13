'use client';

import { useEffect, useState } from 'react';
import MultiTenantPaymentProviders from '../../components/MultiTenantPaymentProviders';
import { useMultiTenantPayments } from '../../hooks/useMultiTenantPayments';
import { UnifiedInvoiceRequest } from '../../services/MultiTenantPaymentService';

// Mock function to get current user's tenant ID
function getCurrentTenantId(): string {
  return 'acme-logistics'; // Example tenant ID
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

interface DemoInvoice {
  id: string;
  loadId: string;
  customerName: string;
  customerEmail: string;
  companyName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  description: string;
  lineItems: {
    name: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
}

export default function UnifiedPaymentDemoPage() {
  const currentUser = getCurrentUser();
  const tenantId = currentUser.tenantId;

  const {
    config,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'create' | 'providers' | 'demo'
  >('dashboard');
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [processingInvoice, setProcessingInvoice] = useState(false);
  const [invoiceResults, setInvoiceResults] = useState<any[]>([]);

  // Mock invoice data
  const [demoInvoices] = useState<DemoInvoice[]>([
    {
      id: 'demo-001',
      loadId: 'LD-2024-001',
      customerName: 'ABC Logistics',
      customerEmail: 'billing@abclogistics.com',
      companyName: 'ABC Logistics Inc',
      amount: 2500,
      status: 'draft',
      description: 'Transportation services from Chicago to Miami',
      lineItems: [
        {
          name: 'Load Transportation',
          description: 'Full truckload transportation service',
          quantity: 1,
          rate: 2500,
          amount: 2500,
        },
      ],
    },
    {
      id: 'demo-002',
      loadId: 'LD-2024-002',
      customerName: 'XYZ Transport',
      customerEmail: 'billing@xyztransport.com',
      companyName: 'XYZ Transport LLC',
      amount: 1800,
      status: 'draft',
      description: 'Transportation services from Dallas to Denver',
      lineItems: [
        {
          name: 'Load Transportation',
          description: 'Partial truckload transportation service',
          quantity: 1,
          rate: 1800,
          amount: 1800,
        },
      ],
    },
    {
      id: 'demo-003',
      loadId: 'LD-2024-003',
      customerName: 'Best Shipping Co',
      customerEmail: 'billing@bestshipping.com',
      companyName: 'Best Shipping Company',
      amount: 3200,
      status: 'draft',
      description: 'Transportation services from Los Angeles to New York',
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

  // Create invoice using selected provider
  const handleCreateInvoice = async (
    invoice: DemoInvoice,
    provider?: string
  ) => {
    const targetProvider = provider || selectedProvider;
    if (!targetProvider) {
      alert('Please select a payment provider');
      return;
    }

    setProcessingInvoice(true);

    const invoiceRequest: UnifiedInvoiceRequest = {
      tenantId,
      provider: targetProvider as any,
      customerName: invoice.customerName,
      companyName: invoice.companyName,
      email: invoice.customerEmail,
      title: `Load ${invoice.loadId} - Transportation Services`,
      description: invoice.description,
      lineItems: invoice.lineItems,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      customFields: [
        { label: 'Load ID', value: invoice.loadId },
        { label: 'Internal Invoice ID', value: invoice.id },
        { label: 'Tenant', value: tenantId },
        { label: 'Created By', value: currentUser.name },
      ],
    };

    try {
      const result = await createInvoice(invoiceRequest);

      setInvoiceResults((prev) => [
        {
          ...result,
          timestamp: new Date().toISOString(),
          originalInvoice: invoice,
        },
        ...prev,
      ]);

      if (result.success) {
        alert(`✅ Invoice created successfully with ${targetProvider}!

Invoice Details:
• Provider: ${result.provider}
• Invoice ID: ${result.invoiceId}
• Invoice Number: ${result.invoiceNumber}
• Amount: $${result.amount?.toLocaleString()}
• Public URL: ${result.publicUrl}

The customer will receive the invoice via email.`);
      } else {
        alert(
          `❌ Failed to create invoice with ${targetProvider}: ${result.error}`
        );
      }
    } catch (error) {
      alert(
        `❌ Error creating invoice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setProcessingInvoice(false);
    }
  };

  // Test all providers with same invoice
  const handleTestAllProviders = async () => {
    const testInvoice = demoInvoices[0];

    for (const provider of activeProviders) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay between requests
      await handleCreateInvoice(testInvoice, provider);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
          <div>Loading unified payment system...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          🚀 Unified Multi-Provider Payment System
        </h1>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: '#6b7280',
            fontSize: '14px',
          }}
        >
          <span>
            Tenant: <strong>{tenantId}</strong>
          </span>
          <span>
            User: <strong>{currentUser.name}</strong>
          </span>
          <span>
            Primary:{' '}
            <strong style={{ color: primaryProvider ? '#10b981' : '#ef4444' }}>
              {primaryProvider || 'Not Set'}
            </strong>
          </span>
          <span>
            Active: <strong>{activeProviders.length} providers</strong>
          </span>
        </div>
      </div>

      {/* Provider Status Bar */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}
          >
            Active Providers:
          </span>
          {activeProviders.map((provider) => (
            <div
              key={provider}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                background:
                  provider === primaryProvider ? '#dcfce7' : '#f3f4f6',
                color: provider === primaryProvider ? '#166534' : '#374151',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background:
                    provider === primaryProvider ? '#10b981' : '#6b7280',
                }}
              ></span>
              {availableProviders.find((p) => p.name === provider)?.displayName}
              {provider === primaryProvider && <span>(Primary)</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          padding: '8px',
          marginBottom: '20px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        {[
          { key: 'dashboard', label: '📊 Invoice Dashboard', icon: '📊' },
          { key: 'create', label: '➕ Create Invoice', icon: '➕' },
          { key: 'demo', label: '🧪 Provider Testing', icon: '🧪' },
          { key: 'providers', label: '⚙️ Manage Providers', icon: '⚙️' },
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
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 24px 0', color: '#1f2937' }}>
            Invoice Dashboard
          </h2>

          {/* Demo Invoices Table */}
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
            >
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Invoice ID
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Load ID
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Customer
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Amount
                  </th>
                  <th
                    style={{
                      padding: '12px',
                      textAlign: 'left',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    Status
                  </th>
                  <th
                    style={{
                      padding: '12px',
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
                {demoInvoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom:
                        index < demoInvoices.length - 1
                          ? '1px solid #e5e7eb'
                          : 'none',
                    }}
                  >
                    <td style={{ padding: '12px', color: '#374151' }}>
                      {invoice.id}
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      {invoice.loadId}
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      {invoice.customerName}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        color: '#374151',
                        fontWeight: '500',
                      }}
                    >
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background: '#f3f4f6',
                          color: '#374151',
                        }}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <select
                          value={selectedProvider}
                          onChange={(e) => setSelectedProvider(e.target.value)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '12px',
                          }}
                        >
                          {activeProviders.map((provider) => (
                            <option key={provider} value={provider}>
                              {
                                availableProviders.find(
                                  (p) => p.name === provider
                                )?.displayName
                              }
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleCreateInvoice(invoice)}
                          disabled={processingInvoice || !selectedProvider}
                          style={{
                            padding: '6px 12px',
                            background:
                              selectedProvider && !processingInvoice
                                ? '#3b82f6'
                                : '#9ca3af',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor:
                              selectedProvider && !processingInvoice
                                ? 'pointer'
                                : 'not-allowed',
                          }}
                        >
                          {processingInvoice
                            ? '⏳ Creating...'
                            : '📧 Send Invoice'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'demo' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 24px 0', color: '#1f2937' }}>
            Provider Testing & Comparison
          </h2>

          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              color: '#0369a1',
            }}
          >
            <strong>🧪 Testing Features:</strong>
            <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
              <li>✅ Test the same invoice across all active providers</li>
              <li>✅ Compare response times and success rates</li>
              <li>✅ Validate provider-specific features</li>
              <li>✅ Review invoice formatting and delivery methods</li>
            </ul>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginBottom: '24px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={handleTestAllProviders}
              disabled={processingInvoice || activeProviders.length === 0}
              style={{
                padding: '12px 20px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor:
                  processingInvoice || activeProviders.length === 0
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  processingInvoice || activeProviders.length === 0 ? 0.6 : 1,
              }}
            >
              {processingInvoice
                ? '⏳ Testing All Providers...'
                : `🚀 Test All Providers (${activeProviders.length})`}
            </button>

            <button
              onClick={() => setInvoiceResults([])}
              style={{
                padding: '12px 20px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              🗑️ Clear Results
            </button>
          </div>

          {/* Test Results */}
          {invoiceResults.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#1f2937' }}>
                Test Results ({invoiceResults.length})
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {invoiceResults.map((result, index) => (
                  <div
                    key={index}
                    style={{
                      background: result.success ? '#f0fdf4' : '#fef2f2',
                      border: `1px solid ${result.success ? '#bbf7d0' : '#fecaca'}`,
                      borderRadius: '8px',
                      padding: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>
                          {result.success ? '✅' : '❌'}
                        </span>
                        <strong
                          style={{
                            color: result.success ? '#166534' : '#dc2626',
                          }}
                        >
                          {availableProviders.find(
                            (p) => p.name === result.provider
                          )?.displayName || result.provider}
                        </strong>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                        }}
                      >
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    {result.success ? (
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#166534',
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div>
                          <strong>Invoice ID:</strong>
                          <br />
                          <code style={{ fontSize: '12px' }}>
                            {result.invoiceId}
                          </code>
                        </div>
                        <div>
                          <strong>Invoice Number:</strong>
                          <br />
                          <code style={{ fontSize: '12px' }}>
                            {result.invoiceNumber}
                          </code>
                        </div>
                        <div>
                          <strong>Amount:</strong>
                          <br />${result.amount?.toLocaleString()}{' '}
                          {result.currency}
                        </div>
                        <div>
                          <strong>Public URL:</strong>
                          <br />
                          <a
                            href={result.publicUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{
                              color: '#3b82f6',
                              textDecoration: 'none',
                              fontSize: '12px',
                            }}
                          >
                            View Invoice →
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#dc2626',
                        }}
                      >
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
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























