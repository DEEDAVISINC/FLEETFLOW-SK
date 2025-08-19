/**
 * Automated Invoice Display Component
 * Shows auto-generated invoices with clickable document verification
 */

import { useState } from 'react';

interface AutoInvoiceDisplayProps {
  invoices: any[];
  onDocumentClick: (invoiceNumber: string, documentType: string) => void;
  onApproveInvoice: (invoiceNumber: string) => void;
  onRejectInvoice: (invoiceNumber: string, reason: string) => void;
}

export default function AutomatedInvoiceDisplay({
  invoices,
  onDocumentClick,
  onApproveInvoice,
  onRejectInvoice,
}: AutoInvoiceDisplayProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [documentModal, setDocumentModal] = useState<{
    show: boolean;
    content: any;
    type: string;
  }>({ show: false, content: null, type: '' });

  const handleDocumentClick = async (
    invoiceNumber: string,
    documentType: string
  ) => {
    try {
      // This would call the verification service
      const result = await onDocumentClick(invoiceNumber, documentType);

      setDocumentModal({
        show: true,
        content: result.documentContent,
        type: documentType,
      });
    } catch (error) {
      console.error('Error loading document:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto_generated':
        return '#f59e0b';
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
          🤖 Auto-Generated Dispatcher Fee Invoices
        </h2>
        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
          }}
        >
          {invoices.length} Invoices Ready
        </div>
      </div>

      {/* Invoice List */}
      <div
        style={{
          display: 'grid',
          gap: '16px',
        }}
      >
        {invoices.map((invoice) => (
          <div
            key={invoice.invoiceNumber}
            style={{
              background: 'white',
              border: '2px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                '0 8px 25px rgba(0, 0, 0, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Invoice Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                  }}
                >
                  Invoice #{invoice.invoiceNumber}
                </div>
                <div
                  style={{
                    background: getStatusColor(invoice.invoiceStatus),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  {getStatusIcon(invoice.invoiceStatus)}
                  {invoice.invoiceStatus.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#059669',
                }}
              >
                ${invoice.feeCalculation.feeAmount.toLocaleString()}
              </div>
            </div>

            {/* Load Reference */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  fontSize: '14px',
                }}
              >
                <div>
                  <strong>Load ID:</strong> {invoice.loadReference.loadId}
                </div>
                <div>
                  <strong>Board #:</strong>{' '}
                  {invoice.loadReference.loadBoardNumber}
                </div>
                <div>
                  <strong>Route:</strong> {invoice.loadReference.route}
                </div>
                <div>
                  <strong>Completed:</strong>{' '}
                  {new Date(
                    invoice.loadReference.completedDate
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Clickable Document References */}
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#92400e',
                  marginBottom: '12px',
                }}
              >
                📋 Document Verification (Click to View & Verify)
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  flexWrap: 'wrap',
                }}
              >
                {/* Rate Confirmation */}
                <button
                  onClick={() =>
                    handleDocumentClick(
                      invoice.invoiceNumber,
                      'rateConfirmation'
                    )
                  }
                  style={{
                    background:
                      invoice.documentReferences.rateConfirmation.status ===
                      'verified'
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {invoice.documentReferences.rateConfirmation.status ===
                  'verified'
                    ? '✅'
                    : '📄'}
                  Rate Conf:{' '}
                  {invoice.documentReferences.rateConfirmation.number}
                </button>

                {/* BOL */}
                <button
                  onClick={() =>
                    handleDocumentClick(invoice.invoiceNumber, 'bol')
                  }
                  style={{
                    background:
                      invoice.documentReferences.bol.status === 'verified'
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #3b82f6, #1e40af)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {invoice.documentReferences.bol.status === 'verified'
                    ? '✅'
                    : '📋'}
                  BOL: {invoice.documentReferences.bol.number}
                </button>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '12px',
                  fontSize: '14px',
                }}
              >
                <div>
                  <strong>Gross Revenue:</strong>
                  <br />
                  <span
                    style={{
                      color: '#059669',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${invoice.feeCalculation.grossRevenue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <strong>
                    Fee ({invoice.feeCalculation.feePercentage}%):
                  </strong>
                  <br />
                  <span
                    style={{
                      color: '#dc2626',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${invoice.feeCalculation.feeAmount.toLocaleString()}
                  </span>
                </div>
                <div>
                  <strong>Net to Carrier:</strong>
                  <br />
                  <span
                    style={{
                      color: '#3b82f6',
                      fontSize: '16px',
                      fontWeight: 'bold',
                    }}
                  >
                    ${invoice.feeCalculation.netCarrierPayment.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              {invoice.requiresApproval && (
                <>
                  <button
                    onClick={() =>
                      onRejectInvoice(
                        invoice.invoiceNumber,
                        'Manual review required'
                      )
                    }
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ❌ Flag for Review
                  </button>
                  <button
                    onClick={() => onApproveInvoice(invoice.invoiceNumber)}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ✅ Approve & Send
                  </button>
                </>
              )}
              {!invoice.requiresApproval && (
                <button
                  onClick={() => onApproveInvoice(invoice.invoiceNumber)}
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
                  🚀 Auto-Send Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Document Verification Modal */}
      {documentModal.show && (
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
              maxWidth: '800px',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0,
                }}
              >
                {documentModal.type === 'rateConfirmation'
                  ? '📄 Rate Confirmation'
                  : '📋 Bill of Lading'}
              </h3>
              <button
                onClick={() =>
                  setDocumentModal({ show: false, content: null, type: '' })
                }
                style={{
                  background: 'rgba(107, 114, 128, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                ✕ Close
              </button>
            </div>

            {/* Document Content Display */}
            <div
              style={{
                background: 'rgba(249, 250, 251, 1)',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '20px',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: '1.6',
              }}
            >
              <pre>{JSON.stringify(documentModal.content, null, 2)}</pre>
            </div>

            {/* Verification Actions */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={() => {
                  // Mark as verified
                  setDocumentModal({ show: false, content: null, type: '' });
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                ✅ Verify Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
