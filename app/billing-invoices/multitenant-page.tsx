'use client';

import { useEffect, useState } from 'react';
import MultiTenantSquareIntegration from '../components/MultiTenantSquareIntegration';
import { useMultiTenantSquare } from '../hooks/useMultiTenantSquare';

// Mock function to get current user's tenant ID
// In production, this would come from authentication/session
function getCurrentTenantId(): string {
  // This would typically come from JWT token or user session
  return 'acme-logistics'; // Example tenant ID
}

// Mock function to get current user info
function getCurrentUser() {
  return {
    id: 'user123',
    name: 'John Dispatcher',
    role: 'Dispatcher',
    department: 'DC',
    tenantId: getCurrentTenantId(),
  };
}

interface Invoice {
  id: string;
  loadId: string;
  customerName: string;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  dueDate: string;
  squareInvoiceId?: string;
  squarePublicUrl?: string;
}

export default function MultiTenantBillingPage() {
  const currentUser = getCurrentUser();
  const tenantId = currentUser.tenantId;

  const {
    config: squareConfig,
    loading: squareLoading,
    createInvoice: createSquareInvoice,
    listInvoices: listSquareInvoices,
  } = useMultiTenantSquare(tenantId);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'create' | 'square-setup'
  >('dashboard');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [squareInvoices, setSquareInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock local invoices data
  useEffect(() => {
    setInvoices([
      {
        id: 'inv-001',
        loadId: 'LD-2024-001',
        customerName: 'ABC Logistics',
        amount: 2500,
        status: 'draft',
        dueDate: '2024-02-15',
      },
      {
        id: 'inv-002',
        loadId: 'LD-2024-002',
        customerName: 'XYZ Transport',
        amount: 1800,
        status: 'sent',
        dueDate: '2024-02-20',
        squareInvoiceId: 'sq-inv-123',
        squarePublicUrl: 'https://squareup.com/pay/abc123',
      },
    ]);
  }, []);

  // Load Square invoices
  useEffect(() => {
    async function loadSquareInvoices() {
      if (squareConfig.connected) {
        setLoading(true);
        const result = await listSquareInvoices();
        if (result.success) {
          setSquareInvoices(result.invoices || []);
        }
        setLoading(false);
      }
    }
    loadSquareInvoices();
  }, [squareConfig.connected, listSquareInvoices]);

  // Create Square invoice for existing draft invoice
  const handleCreateSquareInvoice = async (invoice: Invoice) => {
    if (!squareConfig.connected) {
      alert('Square is not connected. Please configure Square first.');
      return;
    }

    setLoading(true);

    const result = await createSquareInvoice({
      customerName: invoice.customerName,
      companyName: `${invoice.customerName} Inc`,
      email: `billing@${invoice.customerName.toLowerCase().replace(/\s+/g, '')}.com`,
      title: `Load ${invoice.loadId} - Transportation Services`,
      description: `Transportation services for load ${invoice.loadId}`,
      lineItems: [
        {
          name: `Load ${invoice.loadId} Transportation`,
          quantity: 1,
          rate: invoice.amount,
          amount: invoice.amount,
        },
      ],
      customFields: [
        { label: 'Load ID', value: invoice.loadId },
        { label: 'Internal Invoice ID', value: invoice.id },
        { label: 'Tenant', value: tenantId },
      ],
    });

    setLoading(false);

    if (result.success) {
      // Update local invoice with Square data
      setInvoices((prevInvoices) =>
        prevInvoices.map((inv) =>
          inv.id === invoice.id
            ? {
                ...inv,
                status: 'sent',
                squareInvoiceId: result.invoiceId,
                squarePublicUrl: result.publicUrl,
              }
            : inv
        )
      );

      alert(
        `✅ Square invoice created!\nInvoice ID: ${result.invoiceId}\nPayment URL: ${result.publicUrl}`
      );
    } else {
      alert(`❌ Failed to create Square invoice: ${result.error}`);
    }
  };

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
          Multi-Tenant Billing & Invoicing
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
            Role: <strong>{currentUser.role}</strong>
          </span>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                background: squareConfig.connected ? '#10b981' : '#ef4444',
                borderRadius: '50%',
                width: '8px',
                height: '8px',
              }}
            ></span>
            <span>
              Square: {squareConfig.connected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
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
          { key: 'square-setup', label: '⚙️ Square Setup', icon: '⚙️' },
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

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#166534',
                }}
              >
                {invoices.filter((inv) => inv.status === 'paid').length}
              </div>
              <div style={{ color: '#166534', fontSize: '14px' }}>
                Paid Invoices
              </div>
            </div>
            <div
              style={{
                background: '#fefce8',
                border: '1px solid #fef3c7',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#92400e',
                }}
              >
                {invoices.filter((inv) => inv.status === 'sent').length}
              </div>
              <div style={{ color: '#92400e', fontSize: '14px' }}>
                Pending Invoices
              </div>
            </div>
            <div
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#374151',
                }}
              >
                {invoices.filter((inv) => inv.status === 'draft').length}
              </div>
              <div style={{ color: '#374151', fontSize: '14px' }}>
                Draft Invoices
              </div>
            </div>
            <div
              style={{
                background: squareConfig.connected ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${squareConfig.connected ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: squareConfig.connected ? '#166534' : '#dc2626',
                }}
              >
                {squareInvoices.length}
              </div>
              <div
                style={{
                  color: squareConfig.connected ? '#166534' : '#dc2626',
                  fontSize: '14px',
                }}
              >
                Square Invoices
              </div>
            </div>
          </div>

          {/* Invoices Table */}
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
                    Due Date
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
                {invoices.map((invoice, index) => (
                  <tr
                    key={invoice.id}
                    style={{
                      borderBottom:
                        index < invoices.length - 1
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
                    <td style={{ padding: '12px', color: '#374151' }}>
                      ${invoice.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '500',
                          background:
                            invoice.status === 'paid'
                              ? '#dcfce7'
                              : invoice.status === 'sent'
                                ? '#fefce8'
                                : invoice.status === 'overdue'
                                  ? '#fee2e2'
                                  : '#f3f4f6',
                          color:
                            invoice.status === 'paid'
                              ? '#166534'
                              : invoice.status === 'sent'
                                ? '#92400e'
                                : invoice.status === 'overdue'
                                  ? '#dc2626'
                                  : '#374151',
                        }}
                      >
                        {invoice.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#374151' }}>
                      {invoice.dueDate}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleCreateSquareInvoice(invoice)}
                            disabled={!squareConfig.connected || loading}
                            style={{
                              padding: '6px 12px',
                              background: squareConfig.connected
                                ? '#3b82f6'
                                : '#9ca3af',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                              cursor:
                                squareConfig.connected && !loading
                                  ? 'pointer'
                                  : 'not-allowed',
                              opacity:
                                squareConfig.connected && !loading ? 1 : 0.6,
                            }}
                          >
                            🧾 Send via Square
                          </button>
                        )}
                        {invoice.squarePublicUrl && (
                          <a
                            href={invoice.squarePublicUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            style={{
                              padding: '6px 12px',
                              background: '#10b981',
                              color: 'white',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
                            }}
                          >
                            💳 Payment Link
                          </a>
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

      {activeTab === 'create' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2 style={{ margin: '0 0 24px 0', color: '#1f2937' }}>
            Create New Invoice
          </h2>
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              padding: '16px',
              color: '#0369a1',
            }}
          >
            <p style={{ margin: 0 }}>
              💡 <strong>Multi-Tenant Note:</strong> This invoice will be
              created for tenant <strong>{tenantId}</strong>. Each tenant has
              isolated Square accounts and customer data.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'square-setup' && (
        <MultiTenantSquareIntegration
          tenantId={tenantId}
          userRole={currentUser.role}
        />
      )}
    </div>
  );
}
































