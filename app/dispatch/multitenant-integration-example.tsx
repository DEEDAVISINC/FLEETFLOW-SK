'use client';

/**
 * Enhanced Dispatch Integration with Multi-Tenant Payment System
 * Shows how to integrate multi-tenant payments into existing dispatch workflow
 */

import { useState, useEffect } from 'react';
import { useMultiTenantPayments } from '../hooks/useMultiTenantPayments';
import { UnifiedInvoiceRequest } from '../services/MultiTenantPaymentService';

// Mock function to get current user/tenant
function getCurrentTenantId(): string {
  return 'acme-logistics';
}

interface Load {
  id: string;
  origin: string;
  destination: string;
  customer: string;
  driver?: string;
  rate: number;
  status: 'available' | 'assigned' | 'in_transit' | 'delivered';
  driverName?: string;
  deliveryDate?: string;
  weight?: number;
  commodity?: string;
}

interface DispatchPaymentIntegrationProps {
  loads: Load[];
  onInvoiceCreated?: (load: Load, result: any) => void;
}

export default function DispatchPaymentIntegration({ 
  loads = [], 
  onInvoiceCreated 
}: DispatchPaymentIntegrationProps) {
  const tenantId = getCurrentTenantId();
  const userRole = 'Dispatcher';
  
  const {
    config,
    availableProviders,
    activeProviders,
    primaryProvider,
    loading,
    createInvoice,
  } = useMultiTenantPayments(tenantId);

  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [processingInvoices, setProcessingInvoices] = useState<Set<string>>(new Set());
  const [invoiceHistory, setInvoiceHistory] = useState<any[]>([]);

  useEffect(() => {
    if (primaryProvider && !selectedProvider) {
      setSelectedProvider(primaryProvider);
    }
  }, [primaryProvider, selectedProvider]);

  // Create invoice for delivered load
  const handleCreateInvoiceForLoad = async (load: Load, provider?: string) => {
    const targetProvider = provider || selectedProvider;
    
    if (!targetProvider) {
      alert('❌ No payment provider selected. Please configure a payment provider first.');
      return;
    }

    if (!config) {
      alert('❌ Payment system not configured. Please set up payment providers.');
      return;
    }

    setProcessingInvoices(prev => new Set(prev).add(load.id));

    try {
      const invoiceRequest: UnifiedInvoiceRequest = {
        tenantId,
        provider: targetProvider as any,
        customerName: load.customer,
        companyName: `${load.customer} Inc`,
        email: `billing@${load.customer.toLowerCase().replace(/\s+/g, '')}.com`,
        title: `Load ${load.id} - Transportation Services`,
        description: `Transportation services from ${load.origin} to ${load.destination}`,
        lineItems: [
          {
            name: 'Load Transportation',
            description: `${load.commodity || 'General freight'} transportation service`,
            quantity: 1,
            rate: load.rate,
            amount: load.rate,
            taxable: true,
          },
          ...(load.weight ? [{
            name: 'Weight Handling',
            description: `Handling for ${load.weight} lbs`,
            quantity: 1,
            rate: Math.round(load.weight * 0.05), // $0.05 per lb
            amount: Math.round(load.weight * 0.05),
            taxable: false,
          }] : []),
        ],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        customFields: [
          { label: 'Load ID', value: load.id },
          { label: 'Origin', value: load.origin },
          { label: 'Destination', value: load.destination },
          { label: 'Driver', value: load.driverName || load.driver || 'TBD' },
          { label: 'Delivery Date', value: load.deliveryDate || 'TBD' },
          { label: 'Tenant', value: tenantId },
          { label: 'Created By', value: `Dispatch (${userRole})` },
        ],
        metadata: {
          loadId: load.id,
          tenantId,
          department: 'Dispatch',
          userRole,
          originalLoad: load,
        },
      };

      const result = await createInvoice(invoiceRequest);
      
      // Add to history
      setInvoiceHistory(prev => [{
        ...result,
        timestamp: new Date().toISOString(),
        originalLoad: load,
      }, ...prev]);

      if (result.success) {
        alert(`✅ Invoice created successfully for Load ${load.id}!

Provider: ${getProviderDisplayName(result.provider)}
Invoice ID: ${result.invoiceId}
Invoice Number: ${result.invoiceNumber}
Amount: $${result.amount?.toLocaleString()}
Status: ${result.status}

Customer: ${load.customer}
Route: ${load.origin} → ${load.destination}
Public URL: ${result.publicUrl}

The customer will receive the invoice via email.`);

        // Call callback if provided
        if (onInvoiceCreated) {
          onInvoiceCreated(load, result);
        }
      } else {
        alert(`❌ Failed to create invoice for Load ${load.id}: ${result.error}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`❌ Invoice creation error: ${errorMessage}`);
      console.error('Invoice creation error:', error);
    } finally {
      setProcessingInvoices(prev => {
        const newSet = new Set(prev);
        newSet.delete(load.id);
        return newSet;
      });
    }
  };

  // Get provider display name
  const getProviderDisplayName = (providerName: string) => {
    return availableProviders.find(p => p.name === providerName)?.displayName || providerName;
  };

  // Filter delivered loads that can be invoiced
  const deliveredLoads = loads.filter(load => load.status === 'delivered');

  if (loading) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏳</div>
        <div>Loading payment providers...</div>
      </div>
    );
  }

  if (activeProviders.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '24px',
        border: '2px solid #fbbf24',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
        <h3 style={{ color: '#d97706', marginBottom: '8px' }}>Payment Providers Not Configured</h3>
        <p style={{ color: '#6b7280', marginBottom: '16px' }}>
          Configure payment providers in the billing settings to enable invoice creation.
        </p>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          Supported: Square, Bill.com, QuickBooks, Stripe
        </div>
      </div>
    );
  }

  if (deliveredLoads.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
        color: '#6b7280',
      }}>
        <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
        <div>No delivered loads available for invoicing</div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <span style={{
            background: primaryProvider ? '#10b981' : '#ef4444',
            borderRadius: '50%',
            width: '8px',
            height: '8px',
          }}></span>
          Multi-Provider Invoice Creation
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          color: '#6b7280',
          fontSize: '14px',
        }}>
          <span>Tenant: <strong>{tenantId}</strong></span>
          <span>Role: <strong>{userRole}</strong></span>
          <span>Delivered Loads: <strong>{deliveredLoads.length}</strong></span>
          <span>Active Providers: <strong>{activeProviders.length}</strong></span>
        </div>
      </div>

      {/* Provider Selection */}
      <div style={{
        background: '#f9fafb',
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <label style={{ fontSize: '14px', fontWeight: '500' }}>Default Provider:</label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          style={{
            padding: '6px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            background: 'white',
          }}
        >
          {activeProviders.map(provider => (
            <option key={provider} value={provider}>
              {getProviderDisplayName(provider)} {provider === primaryProvider && '(Primary)'}
            </option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '4px' }}>
          {activeProviders.map(provider => (
            <span key={provider} style={{
              background: provider === primaryProvider ? '#dcfce7' : '#f3f4f6',
              color: provider === primaryProvider ? '#166534' : '#374151',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: '500',
            }}>
              {provider === 'square' && '🟨'}
              {provider === 'billcom' && '💸'}
              {provider === 'quickbooks' && '📊'}
              {provider === 'stripe' && '💳'}
              {getProviderDisplayName(provider)}
            </span>
          ))}
        </div>
      </div>

      {/* Delivered Loads Table */}
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
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Load ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Route</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Customer</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Driver</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Rate</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deliveredLoads.map((load, index) => (
              <tr key={load.id} style={{
                borderBottom: index < deliveredLoads.length - 1 ? '1px solid #e5e7eb' : 'none',
              }}>
                <td style={{ padding: '12px', color: '#374151', fontWeight: '500' }}>{load.id}</td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  <div style={{ fontSize: '14px' }}>{load.origin}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>↓</div>
                  <div style={{ fontSize: '14px' }}>{load.destination}</div>
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>{load.customer}</td>
                <td style={{ padding: '12px', color: '#374151' }}>{load.driverName || load.driver || 'TBD'}</td>
                <td style={{ padding: '12px', color: '#374151', fontWeight: '500' }}>
                  ${load.rate.toLocaleString()}
                </td>
                <td style={{ padding: '12px', color: '#374151' }}>
                  <span style={{
                    background: '#dcfce7',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}>
                    ✅ {load.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {/* Default provider button */}
                    <button
                      onClick={() => handleCreateInvoiceForLoad(load)}
                      disabled={!selectedProvider || processingInvoices.has(load.id)}
                      style={{
                        padding: '6px 10px',
                        background: selectedProvider && !processingInvoices.has(load.id) ? '#3b82f6' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500',
                        cursor: selectedProvider && !processingInvoices.has(load.id) ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title={selectedProvider ? `Create invoice with ${getProviderDisplayName(selectedProvider)}` : 'No provider selected'}
                    >
                      {processingInvoices.has(load.id) ? (
                        <>⏳ Processing</>
                      ) : (
                        <>📧 {selectedProvider ? getProviderDisplayName(selectedProvider) : 'Invoice'}</>
                      )}
                    </button>

                    {/* Alternative provider buttons */}
                    {activeProviders.filter(p => p !== selectedProvider).map(provider => (
                      <button
                        key={provider}
                        onClick={() => handleCreateInvoiceForLoad(load, provider)}
                        disabled={processingInvoices.has(load.id)}
                        style={{
                          padding: '4px 8px',
                          background: !processingInvoices.has(load.id) ? 
                            (provider === 'square' ? '#3b82f6' : 
                             provider === 'billcom' ? '#10b981' : 
                             provider === 'quickbooks' ? '#f59e0b' : '#8b5cf6') : '#9ca3af',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '10px',
                          cursor: !processingInvoices.has(load.id) ? 'pointer' : 'not-allowed',
                        }}
                        title={`Create invoice with ${getProviderDisplayName(provider)}`}
                      >
                        {provider === 'square' && '🟨'}
                        {provider === 'billcom' && '💸'}
                        {provider === 'quickbooks' && '📊'}
                        {provider === 'stripe' && '💳'}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        marginTop: '20px',
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
            {deliveredLoads.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Delivered Loads</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
            ${deliveredLoads.reduce((sum, load) => sum + load.rate, 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Revenue</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#6366f1' }}>
            {activeProviders.length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Active Providers</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
            {invoiceHistory.filter(h => h.success).length}
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>Invoices Created</div>
        </div>
      </div>

      {/* Recent Invoice History */}
      {invoiceHistory.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ color: '#1f2937', marginBottom: '12px' }}>Recent Invoice Activity</h4>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {invoiceHistory.slice(0, 5).map((history, index) => (
              <div key={index} style={{
                background: history.success ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${history.success ? '#bbf7d0' : '#fecaca'}`,
                borderRadius: '6px',
                padding: '8px 12px',
                marginBottom: '8px',
                fontSize: '14px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: history.success ? '#166534' : '#dc2626', fontWeight: '500' }}>
                    {history.success ? '✅' : '❌'} Load {history.originalLoad.id} • {getProviderDisplayName(history.provider)}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>
                    {new Date(history.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {history.success && (
                  <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                    Invoice #{history.invoiceNumber} • ${history.amount?.toLocaleString()}
                  </div>
                )}
                {!history.success && (
                  <div style={{ fontSize: '12px', color: '#dc2626', marginTop: '2px' }}>
                    {history.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Provider Benefits */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#0369a1',
      }}>
        <strong>🚀 Multi-Provider Advantages:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '16px' }}>
          <li>✅ Provider redundancy - never miss an invoice</li>
          <li>✅ Customer preference matching</li>
          <li>✅ Compare processing fees and features</li>
          <li>✅ Automatic failover if primary provider fails</li>
        </ul>
      </div>
    </div>
  );
}






















