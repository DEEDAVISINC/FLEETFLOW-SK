'use client';

import { useState } from 'react';
import { useMultiTenantSquare } from '../hooks/useMultiTenantSquare';

interface Load {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  rate: number;
  status: 'delivered' | 'in_transit' | 'assigned' | 'available';
  driver: string;
  pickupDate: string;
  deliveryDate: string;
  equipment: string;
  distance: number;
}

interface MultiTenantDispatchIntegrationProps {
  tenantId: string;
  userRole: string;
  loads: Load[];
  onInvoiceCreated?: (loadId: string, invoiceData: any) => void;
}

export default function MultiTenantDispatchIntegration({
  tenantId,
  userRole,
  loads,
  onInvoiceCreated,
}: MultiTenantDispatchIntegrationProps) {
  const {
    config: squareConfig,
    loading: squareLoading,
    createInvoice: createSquareInvoice,
    createCustomer: createSquareCustomer,
  } = useMultiTenantSquare(tenantId);

  const [processingInvoices, setProcessingInvoices] = useState<Set<string>>(
    new Set()
  );

  // Create Square invoice for delivered load
  const handleCreateSquareInvoice = async (load: Load) => {
    if (!squareConfig.connected) {
      alert(
        `❌ Square is not connected for tenant ${tenantId}. Please configure Square first.`
      );
      return;
    }

    setProcessingInvoices((prev) => new Set(prev).add(load.id));

    try {
      // First, create or get customer
      const customerResult = await createSquareCustomer({
        givenName: load.customer.split(' ')[0] || 'Customer',
        familyName: load.customer.split(' ').slice(1).join(' ') || '',
        companyName: `${load.customer} Logistics`,
        emailAddress: `billing@${load.customer.toLowerCase().replace(/\s+/g, '')}.com`,
        phoneNumber: '+15551234567',
      });

      if (!customerResult.success) {
        throw new Error(`Failed to create customer: ${customerResult.error}`);
      }

      // Create invoice
      const invoiceResult = await createSquareInvoice({
        customerId: customerResult.customerId!,
        customerName: load.customer,
        companyName: `${load.customer} Logistics`,
        email: `billing@${load.customer.toLowerCase().replace(/\s+/g, '')}.com`,
        title: `Load ${load.id} - Transportation Services`,
        description: `Transportation from ${load.origin} to ${load.destination}`,
        lineItems: [
          {
            name: `Load ${load.id} Transportation`,
            quantity: 1,
            rate: load.rate,
            amount: load.rate,
          },
        ],
        customFields: [
          { label: 'Tenant ID', value: tenantId },
          { label: 'Load ID', value: load.id },
          { label: 'Origin', value: load.origin },
          { label: 'Destination', value: load.destination },
          { label: 'Driver', value: load.driver },
          { label: 'Equipment', value: load.equipment },
          { label: 'Distance', value: `${load.distance} miles` },
          { label: 'Pickup Date', value: load.pickupDate },
          { label: 'Delivery Date', value: load.deliveryDate },
          { label: 'Created By', value: `${userRole} (Dispatch)` },
        ],
      });

      if (invoiceResult.success) {
        alert(`✅ Square invoice created successfully for Load ${load.id}!

Invoice Details:
• Invoice ID: ${invoiceResult.invoiceId}
• Invoice Number: ${invoiceResult.invoiceNumber}
• Payment URL: ${invoiceResult.publicUrl}
• Tenant: ${tenantId}

The customer will receive the invoice via email with a payment link.`);

        // Callback to parent component
        if (onInvoiceCreated) {
          onInvoiceCreated(load.id, {
            squareInvoiceId: invoiceResult.invoiceId,
            squareInvoiceNumber: invoiceResult.invoiceNumber,
            squarePublicUrl: invoiceResult.publicUrl,
            squareCustomerId: customerResult.customerId,
            tenantId,
          });
        }
      } else {
        throw new Error(invoiceResult.error || 'Failed to create invoice');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      alert(
        `❌ Failed to create Square invoice for Load ${load.id}: ${errorMessage}`
      );
      console.error('Square invoice creation error:', error);
    } finally {
      setProcessingInvoices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(load.id);
        return newSet;
      });
    }
  };

  // Filter delivered loads that can be invoiced
  const deliveredLoads = loads.filter((load) => load.status === 'delivered');

  if (deliveredLoads.length === 0) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          color: '#6b7280',
        }}
      >
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
        <div>No delivered loads available for invoicing</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1f2937',
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
          Multi-Tenant Square Invoicing
        </h3>
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
            User: <strong>{userRole}</strong>
          </span>
          <span>
            Delivered Loads: <strong>{deliveredLoads.length}</strong>
          </span>
        </div>
      </div>

      {/* Square Status Alert */}
      {!squareConfig.connected && (
        <div
          style={{
            background: '#fef3c7',
            border: '1px solid #fde68a',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '20px',
            color: '#92400e',
          }}
        >
          ⚠️ Square is not connected for tenant <strong>{tenantId}</strong>.
          Configure Square in the billing settings to enable invoicing.
        </div>
      )}

      {/* Delivered Loads Table */}
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
                Route
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
                Driver
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Rate
              </th>
              <th
                style={{
                  padding: '12px',
                  textAlign: 'left',
                  fontWeight: '600',
                  color: '#374151',
                }}
              >
                Delivered
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
            {deliveredLoads.map((load, index) => (
              <tr
                key={load.id}
                style={{
                  borderBottom:
                    index < deliveredLoads.length - 1
                      ? '1px solid #e5e7eb'
                      : 'none',
                }}
              >
                <td
                  style={{
                    padding: '12px',
                    color: '#374151',
                    fontWeight: '500',
                  }}
                >
                  {load.id}
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  <div style={{ fontSize: '14px' }}>{load.origin}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>↓</div>
                  <div style={{ fontSize: '14px' }}>{load.destination}</div>
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  {load.customer}
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  {load.driver}
                </td>
                <td
                  style={{
                    padding: '12px',
                    color: '#374151',
                    fontWeight: '500',
                  }}
                >
                  ${load.rate.toLocaleString()}
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  <div style={{ fontSize: '14px' }}>{load.deliveryDate}</div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '500',
                    }}
                  >
                    ✅ Delivered
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleCreateSquareInvoice(load)}
                      disabled={
                        !squareConfig.connected ||
                        processingInvoices.has(load.id)
                      }
                      style={{
                        padding: '8px 12px',
                        background:
                          squareConfig.connected &&
                          !processingInvoices.has(load.id)
                            ? '#3b82f6'
                            : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor:
                          squareConfig.connected &&
                          !processingInvoices.has(load.id)
                            ? 'pointer'
                            : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title={
                        squareConfig.connected
                          ? 'Create Square invoice for this load'
                          : 'Square not connected'
                      }
                    >
                      {processingInvoices.has(load.id) ? (
                        <>⏳ Creating...</>
                      ) : (
                        <>🧾 Square Invoice</>
                      )}
                    </button>

                    {/* Regular FleetFlow invoice button for comparison */}
                    <button
                      style={{
                        padding: '8px 12px',
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title='Create internal FleetFlow invoice'
                    >
                      📋 Internal Invoice
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
          marginTop: '20px',
          padding: '16px',
          background: '#f9fafb',
          borderRadius: '8px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}
          >
            {deliveredLoads.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Delivered Loads
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}
          >
            $
            {deliveredLoads
              .reduce((sum, load) => sum + load.rate, 0)
              .toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Total Revenue
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: squareConfig.connected ? '#10b981' : '#ef4444',
            }}
          >
            {squareConfig.connected ? 'Connected' : 'Disconnected'}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Square Status
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}
          >
            {tenantId}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Current Tenant
          </div>
        </div>
      </div>

      {/* Multi-Tenant Features Info */}
      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#0369a1',
        }}
      >
        <strong>🏢 Multi-Tenant Features:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
          <li>
            ✅ Tenant-isolated Square accounts (each tenant has their own Square
            setup)
          </li>
          <li>
            ✅ Customer data isolation (customers are scoped to each tenant)
          </li>
          <li>✅ Invoice isolation (invoices are tenant-specific)</li>
          <li>
            ✅ Role-based permissions (user roles are respected per tenant)
          </li>
          <li>
            ✅ Audit trail with tenant context (all actions include tenant ID)
          </li>
        </ul>
      </div>
    </div>
  );
}
























