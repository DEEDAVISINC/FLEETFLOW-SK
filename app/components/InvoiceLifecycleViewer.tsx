/**
 * Invoice Lifecycle Viewer Component
 * Shows complete invoice details and payment tracking timeline
 */

import { useState } from 'react';

interface InvoiceDetails {
  invoiceNumber: string;
  loadId: string;
  loadBoardNumber: string;

  // Load Information
  route: string;
  completedDate: string;
  carrierName: string;
  carrierMC: string;

  // Financial Details
  grossRevenue: number;
  dispatcherFeePercentage: number;
  dispatcherFeeAmount: number;
  netCarrierPayment: number;

  // Invoice Status
  status: 'auto_generated' | 'verified' | 'sent' | 'paid' | 'overdue';
  createdAt: string;
  sentAt?: string;
  paidAt?: string;
  dueDate: string;

  // Document References
  rateConfirmationNumber: string;
  bolNumber: string;
  proNumber?: string;

  // Payment Information
  paymentMethod?: string;
  paymentReference?: string;
  paymentAmount?: number;

  // Timeline Events
  timeline: InvoiceTimelineEvent[];
}

interface InvoiceTimelineEvent {
  id: string;
  type:
    | 'created'
    | 'verified'
    | 'sent'
    | 'viewed'
    | 'payment_received'
    | 'overdue'
    | 'reminder_sent';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  metadata?: any;
}

interface InvoiceLifecycleViewerProps {
  invoice: InvoiceDetails;
  onClose: () => void;
  onViewDocument: (documentType: string, documentNumber: string) => void;
  onResendInvoice: () => void;
  onMarkPaid: (paymentInfo: any) => void;
  onSendReminder: () => void;
}

export default function InvoiceLifecycleViewer({
  invoice,
  onClose,
  onViewDocument,
  onResendInvoice,
  onMarkPaid,
  onSendReminder,
}: InvoiceLifecycleViewerProps) {
  const [activeTab, setActiveTab] = useState<
    'details' | 'timeline' | 'documents'
  >('details');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'ach',
    reference: '',
    amount: invoice.dispatcherFeeAmount,
    date: new Date().toISOString().split('T')[0],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto_generated':
        return '#8b5cf6';
      case 'verified':
        return '#10b981';
      case 'sent':
        return '#3b82f6';
      case 'paid':
        return '#22c55e';
      case 'overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTimelineIcon = (type: string) => {
    switch (type) {
      case 'created':
        return '🤖';
      case 'verified':
        return '✅';
      case 'sent':
        return '📧';
      case 'viewed':
        return '👁️';
      case 'payment_received':
        return '💰';
      case 'overdue':
        return '⚠️';
      case 'reminder_sent':
        return '🔔';
      default:
        return '📄';
    }
  };

  const calculateDaysOverdue = () => {
    if (invoice.status !== 'overdue') return 0;
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    return Math.floor(
      (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  const handleMarkPaid = () => {
    onMarkPaid(paymentInfo);
    setShowPaymentForm(false);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          overflow: 'hidden',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              🧾 Invoice #{invoice.invoiceNumber}
            </h2>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span
                style={{
                  background: getStatusColor(invoice.status),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                }}
              >
                {invoice.status.replace('_', ' ')}
              </span>
              {invoice.status === 'overdue' && (
                <span
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  {calculateDaysOverdue()} days overdue
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {/* Quick Actions */}
            {['sent', 'overdue'].includes(invoice.status) && (
              <>
                <button
                  onClick={onSendReminder}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  🔔 Send Reminder
                </button>
                <button
                  onClick={() => setShowPaymentForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  💰 Mark Paid
                </button>
              </>
            )}

            <button
              onClick={onClose}
              style={{
                background: 'rgba(107, 114, 128, 0.2)',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '2px solid rgba(0, 0, 0, 0.1)',
          }}
        >
          {[
            { id: 'details', label: '📋 Invoice Details', icon: '📋' },
            { id: 'timeline', label: '📅 Timeline', icon: '📅' },
            { id: 'documents', label: '📄 Documents', icon: '📄' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '16px 24px',
                border: 'none',
                background:
                  activeTab === tab.id
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                borderBottom:
                  activeTab === tab.id
                    ? '3px solid #3b82f6'
                    : '3px solid transparent',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                transition: 'all 0.3s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
          }}
        >
          {/* Invoice Details Tab */}
          {activeTab === 'details' && (
            <div style={{ display: 'grid', gap: '24px' }}>
              {/* Load Information */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '16px',
                  }}
                >
                  🚛 Load Information
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div>
                    <strong>Load ID:</strong>
                    <br />
                    <span style={{ fontFamily: 'monospace' }}>
                      {invoice.loadId}
                    </span>
                  </div>
                  <div>
                    <strong>Board #:</strong>
                    <br />#{invoice.loadBoardNumber}
                  </div>
                  <div>
                    <strong>Route:</strong>
                    <br />
                    {invoice.route}
                  </div>
                  <div>
                    <strong>Completed:</strong>
                    <br />
                    {new Date(invoice.completedDate).toLocaleDateString()}
                  </div>
                  <div>
                    <strong>Carrier:</strong>
                    <br />
                    {invoice.carrierName}
                  </div>
                  <div>
                    <strong>MC Number:</strong>
                    <br />
                    {invoice.carrierMC}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '16px',
                  }}
                >
                  💰 Financial Breakdown
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '2px solid rgba(34, 197, 94, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#059669',
                      }}
                    >
                      ${invoice.grossRevenue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Gross Revenue
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '2px solid rgba(220, 38, 38, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#dc2626',
                      }}
                    >
                      ${invoice.dispatcherFeeAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Dispatcher Fee ({invoice.dispatcherFeePercentage}%)
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      textAlign: 'center',
                      border: '2px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }}
                    >
                      ${invoice.netCarrierPayment.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Net to Carrier
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              {invoice.paidAt && (
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '16px',
                    }}
                  >
                    💳 Payment Information
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div>
                      <strong>Payment Method:</strong>
                      <br />
                      {invoice.paymentMethod?.toUpperCase() || 'N/A'}
                    </div>
                    <div>
                      <strong>Payment Reference:</strong>
                      <br />
                      {invoice.paymentReference || 'N/A'}
                    </div>
                    <div>
                      <strong>Amount Paid:</strong>
                      <br />$
                      {invoice.paymentAmount?.toLocaleString() ||
                        invoice.dispatcherFeeAmount.toLocaleString()}
                    </div>
                    <div>
                      <strong>Payment Date:</strong>
                      <br />
                      {new Date(invoice.paidAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '20px',
                }}
              >
                📅 Invoice Timeline
              </h3>
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '20px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'linear-gradient(to bottom, #3b82f6, #10b981)',
                    opacity: 0.3,
                  }}
                />

                {/* Timeline Events */}
                {invoice.timeline.map((event, index) => (
                  <div
                    key={event.id}
                    style={{
                      position: 'relative',
                      paddingLeft: '60px',
                      paddingBottom: '24px',
                    }}
                  >
                    {/* Timeline Dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'white',
                        border: '3px solid #3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '8px',
                      }}
                    >
                      {getTimelineIcon(event.type)}
                    </div>

                    {/* Event Content */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '8px',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#1f2937',
                            margin: 0,
                          }}
                        >
                          {event.title}
                        </h4>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#6b7280',
                          }}
                        >
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: '13px',
                          color: '#374151',
                          margin: 0,
                          marginBottom: '8px',
                        }}
                      >
                        {event.description}
                      </p>
                      {event.userName && (
                        <div
                          style={{
                            fontSize: '11px',
                            color: '#6b7280',
                          }}
                        >
                          By: {event.userName}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '20px',
                }}
              >
                📄 Related Documents
              </h3>
              <div
                style={{
                  display: 'grid',
                  gap: '16px',
                }}
              >
                {/* Rate Confirmation */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.05)',
                    border: '2px solid rgba(245, 158, 11, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#92400e',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      📄 Rate Confirmation
                    </h4>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      Document #: {invoice.rateConfirmationNumber}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      onViewDocument(
                        'rateConfirmation',
                        invoice.rateConfirmationNumber
                      )
                    }
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    👁️ View Document
                  </button>
                </div>

                {/* Bill of Lading */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.05)',
                    border: '2px solid rgba(59, 130, 246, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#1e40af',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      📋 Bill of Lading
                    </h4>
                    <div style={{ fontSize: '14px', color: '#374151' }}>
                      Document #: {invoice.bolNumber}
                    </div>
                  </div>
                  <button
                    onClick={() => onViewDocument('bol', invoice.bolNumber)}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    👁️ View Document
                  </button>
                </div>

                {/* PRO Number (if available) */}
                {invoice.proNumber && (
                  <div
                    style={{
                      background: 'rgba(107, 114, 128, 0.05)',
                      border: '2px solid rgba(107, 114, 128, 0.2)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#374151',
                          margin: 0,
                          marginBottom: '8px',
                        }}
                      >
                        📦 PRO Number
                      </h4>
                      <div style={{ fontSize: '14px', color: '#374151' }}>
                        PRO #: {invoice.proNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => onViewDocument('pro', invoice.proNumber!)}
                      style={{
                        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      👁️ View Document
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Payment Form Modal */}
        {showPaymentForm && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '400px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '20px',
                }}
              >
                💰 Record Payment
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Payment Method:
                </label>
                <select
                  value={paymentInfo.method}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, method: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <option value='ach'>ACH Transfer</option>
                  <option value='wire'>Wire Transfer</option>
                  <option value='check'>Check</option>
                  <option value='factoring'>Factoring Company</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Reference Number:
                </label>
                <input
                  type='text'
                  value={paymentInfo.reference}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      reference: e.target.value,
                    })
                  }
                  placeholder='Transaction ID, Check #, etc.'
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  Payment Date:
                </label>
                <input
                  type='date'
                  value={paymentInfo.date}
                  onChange={(e) =>
                    setPaymentInfo({ ...paymentInfo, date: e.target.value })
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid rgba(0, 0, 0, 0.1)',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end',
                }}
              >
                <button
                  onClick={() => setShowPaymentForm(false)}
                  style={{
                    background: 'rgba(107, 114, 128, 0.2)',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkPaid}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  💰 Record Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
