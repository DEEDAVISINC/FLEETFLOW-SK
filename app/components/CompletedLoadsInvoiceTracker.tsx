/**
 * Completed Loads & Invoice Tracking Component
 * Enhanced section for dispatchers to view and track invoice lifecycle
 */

import { useState } from 'react';

interface CompletedLoad {
  id: string;
  loadBoardNumber: string;
  route: string;
  completedDate: string;
  grossRevenue: number;
  dispatcherFee: number;
  netCarrierPayment: number;
  carrierName: string;

  // Invoice Information
  invoiceNumber?: string;
  invoiceStatus:
    | 'auto_generated'
    | 'verified'
    | 'sent'
    | 'paid'
    | 'overdue'
    | 'pending_creation';
  invoiceCreatedAt?: string;
  invoiceSentAt?: string;
  invoicePaidAt?: string;
  paymentDueDate?: string;

  // Document References
  rateConfirmationNumber?: string;
  bolNumber?: string;
  documentsVerified: boolean;

  // Payment Tracking
  paymentMethod?: 'check' | 'ach' | 'wire' | 'factoring';
  paymentReference?: string;
  daysOverdue?: number;
}

interface CompletedLoadsInvoiceTrackerProps {
  loads: CompletedLoad[];
  onViewInvoice: (invoiceNumber: string) => void;
  onCreateInvoice: (loadId: string) => void;
  onResendInvoice: (invoiceNumber: string) => void;
  onMarkPaid: (invoiceNumber: string, paymentInfo: any) => void;
  onViewDocuments: (loadId: string, documentType: string) => void;
}

export default function CompletedLoadsInvoiceTracker({
  loads,
  onViewInvoice,
  onCreateInvoice,
  onResendInvoice,
  onMarkPaid,
  onViewDocuments,
}: CompletedLoadsInvoiceTrackerProps) {
  const [selectedLoad, setSelectedLoad] = useState<CompletedLoad | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'ach',
    reference: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  });

  // Filter loads based on status
  const filteredLoads = loads.filter((load) => {
    if (filterStatus === 'all') return true;
    return load.invoiceStatus === filterStatus;
  });

  // Calculate summary statistics
  const stats = {
    totalCompleted: loads.length,
    pendingInvoices: loads.filter((l) => l.invoiceStatus === 'pending_creation')
      .length,
    sentInvoices: loads.filter((l) => l.invoiceStatus === 'sent').length,
    paidInvoices: loads.filter((l) => l.invoiceStatus === 'paid').length,
    overdueInvoices: loads.filter((l) => l.invoiceStatus === 'overdue').length,
    totalRevenue: loads.reduce((sum, l) => sum + l.grossRevenue, 0),
    totalFees: loads.reduce((sum, l) => sum + l.dispatcherFee, 0),
    outstandingAmount: loads
      .filter((l) => ['sent', 'overdue'].includes(l.invoiceStatus))
      .reduce((sum, l) => sum + l.dispatcherFee, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_creation':
        return '#f59e0b';
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_creation':
        return '⏳';
      case 'auto_generated':
        return '🤖';
      case 'verified':
        return '✅';
      case 'sent':
        return '📧';
      case 'paid':
        return '💰';
      case 'overdue':
        return '⚠️';
      default:
        return '📄';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_creation':
        return 'Pending Invoice';
      case 'auto_generated':
        return 'Auto-Generated';
      case 'verified':
        return 'Verified';
      case 'sent':
        return 'Invoice Sent';
      case 'paid':
        return 'Paid';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };

  const handleMarkPaid = (load: CompletedLoad) => {
    setSelectedLoad(load);
    setPaymentInfo({
      ...paymentInfo,
      amount: load.dispatcherFee,
    });
    setShowPaymentModal(true);
  };

  const submitPayment = () => {
    if (selectedLoad && selectedLoad.invoiceNumber) {
      onMarkPaid(selectedLoad.invoiceNumber, paymentInfo);
      setShowPaymentModal(false);
      setSelectedLoad(null);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0,
          }}
        >
          📋 Completed Loads & Invoice Tracking
        </h2>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid rgba(0, 0, 0, 0.1)',
            background: 'white',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value='all'>All Loads ({loads.length})</option>
          <option value='pending_creation'>
            Pending Invoice ({stats.pendingInvoices})
          </option>
          <option value='sent'>Sent ({stats.sentInvoices})</option>
          <option value='paid'>Paid ({stats.paidInvoices})</option>
          <option value='overdue'>Overdue ({stats.overdueInvoices})</option>
        </select>
      </div>

      {/* Summary Statistics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ${stats.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Total Revenue</div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ${stats.totalFees.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Total Dispatcher Fees
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            ${stats.outstandingAmount.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            Outstanding Amount
          </div>
        </div>

        <div
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '16px',
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
            {stats.totalCompleted}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>Completed Loads</div>
        </div>
      </div>

      {/* Loads Table */}
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Table Header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '100px 120px 200px 120px 120px 150px 120px 200px',
            gap: '12px',
            padding: '16px',
            background: 'rgba(0, 0, 0, 0.05)',
            fontWeight: 'bold',
            fontSize: '12px',
            color: '#374151',
          }}
        >
          <div>Board #</div>
          <div>Load ID</div>
          <div>Route</div>
          <div>Revenue</div>
          <div>Disp Fee</div>
          <div>Invoice Status</div>
          <div>Days</div>
          <div>Actions</div>
        </div>

        {/* Table Rows */}
        {filteredLoads.map((load) => (
          <div
            key={load.id}
            style={{
              display: 'grid',
              gridTemplateColumns:
                '100px 120px 200px 120px 120px 150px 120px 200px',
              gap: '12px',
              padding: '16px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              alignItems: 'center',
              fontSize: '13px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {/* Board Number */}
            <div style={{ fontWeight: 'bold', color: '#1f2937' }}>
              #{load.loadBoardNumber}
            </div>

            {/* Load ID */}
            <div style={{ fontFamily: 'monospace', fontSize: '11px' }}>
              {load.id}
            </div>

            {/* Route */}
            <div style={{ color: '#374151' }}>{load.route}</div>

            {/* Revenue */}
            <div style={{ fontWeight: 'bold', color: '#059669' }}>
              ${load.grossRevenue.toLocaleString()}
            </div>

            {/* Dispatcher Fee */}
            <div style={{ fontWeight: 'bold', color: '#dc2626' }}>
              ${load.dispatcherFee.toLocaleString()}
            </div>

            {/* Invoice Status */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  background: getStatusColor(load.invoiceStatus),
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {getStatusIcon(load.invoiceStatus)}
                {getStatusText(load.invoiceStatus)}
              </span>
            </div>

            {/* Days Since Completion */}
            <div style={{ color: '#6b7280' }}>
              {Math.floor(
                (new Date().getTime() -
                  new Date(load.completedDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              days
              {load.daysOverdue && load.daysOverdue > 0 && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                >
                  {load.daysOverdue} overdue
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              {/* View Documents */}
              <button
                onClick={() => onViewDocuments(load.id, 'all')}
                style={{
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
                title='View Rate Conf & BOL'
              >
                📋 Docs
              </button>

              {/* Create Invoice (if pending) */}
              {load.invoiceStatus === 'pending_creation' && (
                <button
                  onClick={() => onCreateInvoice(load.id)}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  🧾 Create
                </button>
              )}

              {/* View Invoice (if created) */}
              {load.invoiceNumber && (
                <button
                  onClick={() => onViewInvoice(load.invoiceNumber!)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  👁️ View
                </button>
              )}

              {/* Resend Invoice */}
              {['sent', 'overdue'].includes(load.invoiceStatus) && (
                <button
                  onClick={() =>
                    load.invoiceNumber && onResendInvoice(load.invoiceNumber)
                  }
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  📧 Resend
                </button>
              )}

              {/* Mark as Paid */}
              {['sent', 'overdue'].includes(load.invoiceStatus) && (
                <button
                  onClick={() => handleMarkPaid(load)}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  💰 Paid
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedLoad && (
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
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              width: '400px',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '20px',
              }}
            >
              💰 Mark Invoice as Paid
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <strong>Invoice:</strong> {selectedLoad.invoiceNumber}
              <br />
              <strong>Load:</strong> {selectedLoad.id}
              <br />
              <strong>Amount:</strong> $
              {selectedLoad.dispatcherFee.toLocaleString()}
            </div>

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
                Payment Reference:
              </label>
              <input
                type='text'
                value={paymentInfo.reference}
                onChange={(e) =>
                  setPaymentInfo({ ...paymentInfo, reference: e.target.value })
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
                onClick={() => setShowPaymentModal(false)}
                style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitPayment}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                💰 Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredLoads.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <div
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            No completed loads found
          </div>
          <div style={{ fontSize: '14px' }}>
            {filterStatus === 'all'
              ? 'Complete some loads to see them here'
              : `No loads with status "${getStatusText(filterStatus)}"`}
          </div>
        </div>
      )}
    </div>
  );
}
