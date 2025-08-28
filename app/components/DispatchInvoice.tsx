'use client';

import { jsPDF } from 'jspdf';
import { forwardRef } from 'react';

interface InvoiceData {
  id: string;
  loadId: string;
  carrierName: string;
  carrierAddress?: string;
  carrierEmail?: string;
  carrierPhone?: string;
  loadAmount: number;
  dispatchFee: number;
  feePercentage: number;
  invoiceDate: string;
  dueDate: string;
  status: 'Pending' | 'Sent' | 'Paid' | 'Overdue';
  loadDetails?: {
    origin: string;
    destination: string;
    pickupDate: string;
    deliveryDate: string;
    equipment: string;
    weight?: string;
    miles?: number;
  };
  paymentTerms?: string;
  notes?: string;
  loadIdentifier?: string;
  shipperId?: string;
  dispatcherName?: string;
  dispatcherUserIdentifier?: string;
  dispatcherCompanyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
  };
}

interface DispatchInvoiceProps {
  invoice: InvoiceData;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

const DispatchInvoice = forwardRef<HTMLDivElement, DispatchInvoiceProps>(
  ({ invoice, companyInfo }, ref) => {
    const defaultCompanyInfo = {
      name: 'FLEETFLOW TMS LLC',
      address: '755 W. Big Beaver Rd STE 2020\nTroy, MI 48084',
      phone: '(833) 386-3509',
      email: 'billing@fleetflowapp.com',
      website: 'fleetflowapp.com',
      logo: '🚛',
    };

    // Use dispatcher company info if available, otherwise use companyInfo prop, then default
    const company = invoice.dispatcherCompanyInfo
      ? { ...invoice.dispatcherCompanyInfo, logo: '🚛' }
      : companyInfo || defaultCompanyInfo;

    return (
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          padding: '48px',
          minHeight: '100%',
          position: 'relative',
          fontFamily:
            "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          background:
            'linear-gradient(135deg, #dbeafe 0%, #f0f9ff 25%, #f0fdf4 75%, #dcfce7 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
          borderRadius: '24px',
          border: '1px solid rgba(59, 130, 246, 0.1)',
        }}
        ref={ref}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '48px',
            paddingBottom: '32px',
            borderBottom: '3px solid',
            borderImage: 'linear-gradient(90deg, #2563eb, #10b981) 1',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginRight: '16px',
                  background: 'linear-gradient(135deg, #2563eb, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                🚛
              </div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: '#111827',
                  margin: '0',
                  letterSpacing: '-0.025em',
                }}
              >
                {company.name}
              </h1>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid #d1d5db',
              }}
            >
              <div
                style={{
                  fontSize: '16px',
                  color: '#374151',
                  fontWeight: '600',
                  marginBottom: '12px',
                  whiteSpace: 'pre-line',
                }}
              >
                {company.address}
              </div>
              <div
                style={{
                  fontSize: '15px',
                  color: '#6b7280',
                  marginBottom: '4px',
                }}
              >
                📞 {company.phone} | 📧 {company.email}
              </div>
              {company.website && (
                <div style={{ fontSize: '15px', color: '#6b7280' }}>
                  🌐 {company.website}
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '350px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                borderRadius: '16px',
                padding: '24px',
                color: 'white',
                boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  margin: '0 0 8px 0',
                  letterSpacing: '-0.025em',
                }}
              >
                💼 DISPATCHER FEE INVOICE
              </h2>
              <div style={{ fontSize: '14px', opacity: '0.9' }}>
                Professional Dispatch Services
              </div>
            </div>

            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                borderRadius: '12px',
                padding: '24px',
                border: '2px solid #e2e8f0',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#64748b',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}
                >
                  INVOICE NUMBER
                </div>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#0f172a',
                  }}
                >
                  {invoice.id}
                </div>
              </div>

              {invoice.dispatcherName && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    DISPATCHER
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#0f172a',
                    }}
                  >
                    {invoice.dispatcherName}
                  </div>
                </div>
              )}

              {invoice.dispatcherUserIdentifier && (
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    DISPATCHER ID
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#475569',
                    }}
                  >
                    {invoice.dispatcherUserIdentifier}
                  </div>
                </div>
              )}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    INVOICE DATE
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#0f172a',
                    }}
                  >
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#64748b',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    DUE DATE
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#dc2626',
                    }}
                  >
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <span
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor:
                      invoice.status === 'Paid'
                        ? '#dcfce7'
                        : invoice.status === 'Sent'
                          ? '#dbeafe'
                          : invoice.status === 'Overdue'
                            ? '#fee2e2'
                            : '#fef3c7',
                    color:
                      invoice.status === 'Paid'
                        ? '#166534'
                        : invoice.status === 'Sent'
                          ? '#1e40af'
                          : invoice.status === 'Overdue'
                            ? '#991b1b'
                            : '#92400e',
                    border: `2px solid ${
                      invoice.status === 'Paid'
                        ? '#16a34a'
                        : invoice.status === 'Sent'
                          ? '#2563eb'
                          : invoice.status === 'Overdue'
                            ? '#dc2626'
                            : '#f59e0b'
                    }`,
                  }}
                >
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div
          style={{
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
              borderRadius: '16px',
              padding: '32px',
              border: '2px solid #cbd5e1',
            }}
          >
            <h3
              style={{
                margin: '0 0 20px 0',
                fontSize: '20px',
                fontWeight: '700',
                color: '#0f172a',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #10b981)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  marginRight: '12px',
                }}
              >
                BILL TO
              </span>
              Carrier Information
            </h3>
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              <h4
                style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  color: '#0f172a',
                  margin: '0 0 16px 0',
                }}
              >
                {invoice.carrierName}
              </h4>
              {invoice.carrierAddress && (
                <div
                  style={{
                    fontSize: '16px',
                    color: '#475569',
                    marginBottom: '12px',
                    whiteSpace: 'pre-line',
                    lineHeight: '1.6',
                  }}
                >
                  📍 {invoice.carrierAddress}
                </div>
              )}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {invoice.carrierEmail && (
                  <div
                    style={{
                      fontSize: '15px',
                      color: '#64748b',
                      fontWeight: '600',
                    }}
                  >
                    📧 {invoice.carrierEmail}
                  </div>
                )}
                {invoice.carrierPhone && (
                  <div
                    style={{
                      fontSize: '15px',
                      color: '#64748b',
                      fontWeight: '600',
                    }}
                  >
                    📞 {invoice.carrierPhone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Route & Service Details */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.025em',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '16px',
                fontWeight: '800',
                marginRight: '16px',
              }}
            >
              🗺️ ROUTE
            </span>
            Service Details
          </h3>
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Enhanced Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0',
                background: 'linear-gradient(135deg, #0f766e, #10b981)',
                padding: '20px 24px',
                fontSize: '14px',
                fontWeight: '800',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '0.025em',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>🗺️</span>
                <span>Route Information</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>🚛</span>
                <span>Equipment & Specs</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>👨‍💼</span>
                <span>Dispatcher</span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span>📋</span>
                <span>Service Timeline</span>
              </div>
            </div>

            {/* Enhanced Data Row 1 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0',
                borderBottom: '2px solid #f1f5f9',
                backgroundColor: 'white',
                padding: '24px',
                fontSize: '15px',
                color: '#1f2937',
              }}
            >
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#2563eb',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  🏁 Origin
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                    lineHeight: '1.4',
                  }}
                >
                  {invoice.loadDetails?.origin || 'N/A'}
                </div>
              </div>
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#7c3aed',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  🚛 Equipment
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.loadDetails?.equipment || 'N/A'}
                </div>
              </div>
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#10b981',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  👨‍💼 Dispatcher
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.dispatcherName || 'N/A'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  📅 Pickup Date
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.loadDetails?.pickupDate || 'N/A'}
                </div>
              </div>
            </div>

            {/* Enhanced Data Row 2 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0',
                backgroundColor: '#f8fafc',
                padding: '24px',
                fontSize: '15px',
                color: '#1f2937',
              }}
            >
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#2563eb',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  🎯 Destination
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                    lineHeight: '1.4',
                  }}
                >
                  {invoice.loadDetails?.destination || 'N/A'}
                </div>
              </div>
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#eab308',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  📏 Distance
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.loadDetails?.miles
                    ? `${invoice.loadDetails.miles} mi`
                    : 'N/A'}
                </div>
              </div>
              <div style={{ paddingRight: '16px' }}>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#10b981',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  ⚖️ Weight
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.loadDetails?.weight || 'N/A'}
                </div>
              </div>
              <div>
                <div
                  style={{
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#f59e0b',
                    fontSize: '13px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  📦 Delivery Date
                </div>
                <div
                  style={{
                    fontWeight: '600',
                    color: '#0f172a',
                    fontSize: '16px',
                  }}
                >
                  {invoice.loadDetails?.deliveryDate || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div style={{ marginBottom: '40px' }}>
          <h3
            style={{
              margin: '0 0 24px 0',
              fontSize: '24px',
              fontWeight: '700',
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.025em',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: 'white',
                borderRadius: '10px',
                padding: '10px 16px',
                fontSize: '16px',
                fontWeight: '800',
                marginRight: '16px',
              }}
            >
              💼 SERVICE
            </span>
            Details & Fees
          </h3>
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff, #f8fafc)',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid #e2e8f0',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                border: 'none',
              }}
            >
              <thead>
                <tr
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  }}
                >
                  <th
                    style={{
                      border: 'none',
                      padding: '20px 24px',
                      textAlign: 'left',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    📋 Service Description
                  </th>
                  <th
                    style={{
                      border: 'none',
                      padding: '20px 24px',
                      textAlign: 'center',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    💰 Load Amount
                  </th>
                  <th
                    style={{
                      border: 'none',
                      padding: '20px 24px',
                      textAlign: 'center',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    📊 Fee Rate
                  </th>
                  <th
                    style={{
                      border: 'none',
                      padding: '20px 24px',
                      textAlign: 'right',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '15px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em',
                    }}
                  >
                    🎯 Dispatch Fee
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: 'none',
                      padding: '28px 24px',
                      backgroundColor: 'white',
                      color: '#0f172a',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #e2e8f0',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '800',
                          color: '#0f172a',
                          fontSize: '18px',
                          marginBottom: '12px',
                        }}
                      >
                        🚛 Professional Dispatch Services
                      </div>
                      <div
                        style={{
                          fontSize: '15px',
                          color: '#64748b',
                          lineHeight: '1.6',
                          fontWeight: '500',
                        }}
                      >
                        Comprehensive load coordination, real-time carrier
                        communication, route optimization, documentation
                        management, and professional dispatch oversight ensuring
                        successful delivery completion.
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: 'none',
                      padding: '28px 24px',
                      textAlign: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '2px solid #3b82f6',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#1e40af',
                          fontWeight: '700',
                          marginBottom: '4px',
                        }}
                      >
                        TOTAL REVENUE
                      </div>
                      <div
                        style={{
                          fontWeight: '800',
                          color: '#0f172a',
                          fontSize: '20px',
                        }}
                      >
                        ${invoice.loadAmount.toLocaleString()}
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: 'none',
                      padding: '28px 24px',
                      textAlign: 'center',
                      backgroundColor: 'white',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '2px solid #f59e0b',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#92400e',
                          fontWeight: '700',
                          marginBottom: '4px',
                        }}
                      >
                        SERVICE RATE
                      </div>
                      <div
                        style={{
                          color: '#0f172a',
                          fontWeight: '800',
                          fontSize: '20px',
                        }}
                      >
                        {invoice.feePercentage}%
                      </div>
                    </div>
                  </td>
                  <td
                    style={{
                      border: 'none',
                      padding: '28px 24px',
                      textAlign: 'right',
                      backgroundColor: 'white',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '3px solid #10b981',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          color: '#065f46',
                          fontWeight: '700',
                          marginBottom: '4px',
                        }}
                      >
                        EARNED FEE
                      </div>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: '800',
                          color: '#065f46',
                        }}
                      >
                        ${invoice.dispatchFee.toFixed(2)}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ width: '400px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                borderRadius: '20px',
                padding: '32px',
                border: '3px solid #334155',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div
                style={{
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '0',
                    letterSpacing: '-0.025em',
                  }}
                >
                  📊 INVOICE SUMMARY
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #475569',
                }}
              >
                <span
                  style={{
                    color: '#cbd5e1',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  Service Subtotal:
                </span>
                <span
                  style={{
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '18px',
                  }}
                >
                  ${invoice.dispatchFee.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '20px',
                  paddingBottom: '20px',
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '2px solid #34d399',
                }}
              >
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.025em',
                  }}
                >
                  💰 Total Due:
                </span>
                <span
                  style={{
                    fontSize: '28px',
                    fontWeight: '900',
                    color: '#ffffff',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  ${invoice.dispatchFee.toFixed(2)}
                </span>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid #34d399',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    color: '#10b981',
                    fontWeight: '700',
                    marginBottom: '4px',
                  }}
                >
                  PAYMENT STATUS
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    color: '#ffffff',
                    fontWeight: '600',
                  }}
                >
                  Due by Thursday
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms & Methods */}
        <div
          style={{
            marginBottom: '40px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
              borderRadius: '16px',
              padding: '28px',
              border: '2px solid #f59e0b',
              boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.1)',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: '800',
                color: '#92400e',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.025em',
              }}
            >
              <span
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '14px',
                  fontWeight: '800',
                  marginRight: '12px',
                }}
              >
                📅
              </span>
              Payment Terms
            </h3>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '16px',
                color: '#92400e',
                fontWeight: '600',
                lineHeight: '1.5',
              }}
            >
              <div style={{ marginBottom: '12px' }}>
                📅 <strong>Weekly Payment Schedule:</strong> Invoices are issued
                on Monday and payment is due by Thursday of the same week.
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  borderRadius: '8px',
                  border: '2px solid #dc2626',
                  color: '#7f1d1d',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                ⚠️ <strong>IMPORTANT:</strong> If payment is not received by
                Friday, no loads will be available to carrier until payment is
                made.
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '16px',
              padding: '28px',
              border: '2px solid #3b82f6',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '20px',
                fontWeight: '800',
                color: '#1e40af',
                display: 'flex',
                alignItems: 'center',
                letterSpacing: '-0.025em',
              }}
            >
              <span
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '14px',
                  fontWeight: '800',
                  marginRight: '12px',
                }}
              >
                💳
              </span>
              Payment Methods
            </h3>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.7)',
                borderRadius: '10px',
                padding: '16px',
                fontSize: '15px',
                color: '#1e40af',
                fontWeight: '600',
                lineHeight: '1.6',
              }}
            >
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '8px' }}>🏦</span>
                <span>ACH Transfer (Preferred)</span>
              </div>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '8px' }}>⚡</span>
                <span>Wire Transfer</span>
              </div>
              <div
                style={{
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '8px' }}>💳</span>
                <span>eCheck (Electronic Check)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '8px' }}>🔄</span>
                <span>Automatic Debit (Recurring)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div style={{ marginBottom: '40px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: '16px',
                padding: '32px',
                border: '2px solid #22c55e',
                boxShadow: '0 10px 15px -3px rgba(34, 197, 94, 0.1)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  letterSpacing: '-0.025em',
                }}
              >
                <span
                  style={{
                    background: '#22c55e',
                    color: 'white',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '14px',
                    fontWeight: '800',
                    marginRight: '12px',
                  }}
                >
                  📝
                </span>
                Additional Notes
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  padding: '24px',
                  fontSize: '16px',
                  color: '#15803d',
                  fontWeight: '500',
                  lineHeight: '1.6',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                }}
              >
                {invoice.notes}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            borderTop: '3px solid',
            borderImage: 'linear-gradient(90deg, #10b981, #2563eb) 1',
            paddingTop: '32px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            borderRadius: '16px',
            padding: '40px',
            marginTop: '40px',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #0f172a, #1e293b)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#10b981',
                marginBottom: '8px',
              }}
            >
              🙏 Thank you for your business!
            </div>
            <div
              style={{ fontSize: '16px', color: '#cbd5e1', fontWeight: '500' }}
            >
              We appreciate your partnership and professional service
            </div>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #10b981',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                color: '#0f172a',
                fontWeight: '600',
                marginBottom: '8px',
              }}
            >
              📞 Questions about this invoice?
            </div>
            <div
              style={{
                fontSize: '15px',
                color: '#374151',
                fontWeight: '500',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <span>📞 {company.phone}</span>
              <span>📧 {company.email}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DispatchInvoice.displayName = 'DispatchInvoice';

// PDF Generation Helper
export const generateInvoicePDF = async (invoice: InvoiceData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Use dispatcher company info if available, otherwise use default
  const defaultCompanyInfo = {
    name: 'Dispatch Services',
    address: '1234 Logistics Way, Suite 100\nAtlanta, GA 30309',
    phone: '(555) 123-4567',
    email: 'billing@dispatchservices.com',
  };

  const company = invoice.dispatcherCompanyInfo || defaultCompanyInfo;
  const addressLines = company.address.split('\n');

  // Header
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(company.name, 20, 25);

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  addressLines.forEach((line, index) => {
    pdf.text(line, 20, 35 + index * 7);
  });
  pdf.text(
    `Phone: ${company.phone} | Email: ${company.email}`,
    20,
    35 + addressLines.length * 7 + 7
  );

  // Invoice Info
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DISPATCHER FEE INVOICE', pageWidth - 60, 25);

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Invoice #: ${invoice.id}`, pageWidth - 60, 35);
  pdf.text(
    `Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}`,
    pageWidth - 60,
    42
  );
  pdf.text(
    `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`,
    pageWidth - 60,
    49
  );

  // Bill To
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Bill To:', 20, 70);

  pdf.setFont('helvetica', 'normal');
  pdf.text(invoice.carrierName, 20, 80);
  if (invoice.carrierAddress) {
    const addressLines = invoice.carrierAddress.split('\n');
    addressLines.forEach((line, index) => {
      pdf.text(line, 20, 87 + index * 7);
    });
  }

  // Dispatcher Info
  pdf.setFont('helvetica', 'bold');
  pdf.text('Dispatcher Information:', 120, 70);

  pdf.setFont('helvetica', 'normal');
  if (invoice.dispatcherName) {
    pdf.text(`Dispatcher: ${invoice.dispatcherName}`, 120, 80);
  }
  if (invoice.dispatcherUserIdentifier) {
    pdf.text(`Dispatcher ID: ${invoice.dispatcherUserIdentifier}`, 120, 90);
  }
  if (invoice.loadDetails) {
    pdf.text(
      `Route: ${invoice.loadDetails.origin} → ${invoice.loadDetails.destination}`,
      120,
      87
    );
    pdf.text(`Equipment: ${invoice.loadDetails.equipment}`, 120, 94);
  }

  // Service Table
  const tableStartY = 120;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Description', 20, tableStartY);
  pdf.text('Load Amount', 100, tableStartY);
  pdf.text('Fee %', 140, tableStartY);
  pdf.text('Dispatch Fee', 170, tableStartY);

  // Table line
  pdf.line(20, tableStartY + 3, pageWidth - 20, tableStartY + 3);

  pdf.setFont('helvetica', 'normal');
  pdf.text('Dispatch Services', 20, tableStartY + 15);
  pdf.text(`$${invoice.loadAmount.toLocaleString()}`, 100, tableStartY + 15);
  pdf.text(`${invoice.feePercentage}%`, 140, tableStartY + 15);
  pdf.text(`$${invoice.dispatchFee.toFixed(2)}`, 170, tableStartY + 15);

  // Total
  pdf.line(140, tableStartY + 25, pageWidth - 20, tableStartY + 25);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Total Due:', 140, tableStartY + 35);
  pdf.text(`$${invoice.dispatchFee.toFixed(2)}`, 170, tableStartY + 35);

  // Footer
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Payment Terms: Net 30 days from invoice date', 20, pageHeight - 30);
  pdf.text('Thank you for your business!', 20, pageHeight - 20);

  return pdf;
};

export default DispatchInvoice;
export type { InvoiceData };
