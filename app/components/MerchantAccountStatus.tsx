'use client';

import { useState } from 'react';

interface PaymentProcessorStatus {
  name: string;
  status: 'approved' | 'pending' | 'reviewing' | 'declined';
  estimatedApproval?: string;
  alternativeAvailable: boolean;
  icon: string;
  color: string;
}

export default function MerchantAccountStatus() {
  const [processors, setProcessors] = useState<PaymentProcessorStatus[]>([
    {
      name: 'Square',
      status: 'pending',
      estimatedApproval: '3-5 business days',
      alternativeAvailable: true,
      icon: '🟨',
      color: '#3b82f6',
    },
    {
      name: 'Stripe',
      status: 'reviewing',
      estimatedApproval: '2-7 business days',
      alternativeAvailable: true,
      icon: '💳',
      color: '#8b5cf6',
    },
    {
      name: 'Bill.com ACH',
      status: 'approved',
      alternativeAvailable: false,
      icon: '🏦',
      color: '#10b981',
    },
    {
      name: 'PayPal Business',
      status: 'approved',
      alternativeAvailable: false,
      icon: '💰',
      color: '#f59e0b',
    },
  ]);

  const getStatusColor = (status: PaymentProcessorStatus['status']) => {
    switch (status) {
      case 'approved':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'reviewing':
        return '#3b82f6';
      case 'declined':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status: PaymentProcessorStatus['status']) => {
    switch (status) {
      case 'approved':
        return 'Active';
      case 'pending':
        return 'Pending Approval';
      case 'reviewing':
        return 'Under Review';
      case 'declined':
        return 'Declined';
      default:
        return 'Unknown';
    }
  };

  const approvedCount = processors.filter(
    (p) => p.status === 'approved'
  ).length;
  const pendingCount = processors.filter(
    (p) => p.status === 'pending' || p.status === 'reviewing'
  ).length;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3
          style={{
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🏦 Payment Processor Status
          <span
            style={{
              background: approvedCount >= 2 ? '#dcfce7' : '#fef3c7',
              color: approvedCount >= 2 ? '#166534' : '#92400e',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 'normal',
            }}
          >
            {approvedCount} Active, {pendingCount} Pending
          </span>
        </h3>
      </div>

      {/* Status Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {processors.map((processor) => (
          <div
            key={processor.name}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: `2px solid ${getStatusColor(processor.status)}`,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${getStatusColor(processor.status)}20`,
                borderRadius: '50%',
              }}
            >
              {processor.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 'bold',
                  fontSize: '14px',
                  color: '#1f2937',
                  marginBottom: '4px',
                }}
              >
                {processor.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: getStatusColor(processor.status),
                  fontWeight: '600',
                  marginBottom: '2px',
                }}
              >
                {getStatusText(processor.status)}
              </div>
              {processor.estimatedApproval && (
                <div
                  style={{
                    fontSize: '11px',
                    color: '#6b7280',
                  }}
                >
                  Est: {processor.estimatedApproval}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Action Items */}
      {pendingCount > 0 && (
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '16px',
          }}
        >
          <h4
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e40af',
            }}
          >
            📋 Action Items for Merchant Approval:
          </h4>
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '13px',
              color: '#374151',
            }}
          >
            <li>Submit business license and tax documents</li>
            <li>Provide DOT/MC authority certificates</li>
            <li>Upload 3 months of bank statements</li>
            <li>Call merchant services for expedited review</li>
            <li>Set up backup payment methods (PayPal, ACH)</li>
          </ul>
        </div>
      )}

      {/* Current Payment Options */}
      <div
        style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '12px',
        }}
      >
        <h4
          style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#059669',
          }}
        >
          ✅ Available Payment Methods:
        </h4>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
          }}
        >
          <span
            style={{
              background: '#10b981',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            🏦 ACH Bank Transfer
          </span>
          <span
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            💰 PayPal Business
          </span>
          <span
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            📧 Invoice Payments
          </span>
          <span
            style={{
              background: '#8b5cf6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '6px',
            }}
          >
            💳 Manual Processing
          </span>
        </div>
      </div>
    </div>
  );
}
