/**
 * Payment Management Dashboard Component
 * Comprehensive payment method management and billing oversight
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import {
  PaymentAttempt,
  PaymentMethod,
  SubscriptionBilling,
  paymentCollectionService,
} from '../services/PaymentCollectionService';

interface PaymentManagementProps {
  userId?: string;
  isCompact?: boolean;
}

export default function PaymentManagementDashboard({
  userId,
  isCompact = false,
}: PaymentManagementProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentAttempt[]>([]);
  const [billing, setBilling] = useState<SubscriptionBilling | null>(null);
  const [billingSummary, setBillingSummary] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'methods' | 'history' | 'settings'
  >('overview');
  const [loading, setLoading] = useState(true);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'card' as 'card' | 'bank_account',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvc: '',
    accountNumber: '',
    routingNumber: '',
    accountType: 'checking' as 'checking' | 'savings',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = getCurrentUser();
  const targetUserId = userId || user.id;

  useEffect(() => {
    loadPaymentData();
  }, [targetUserId]);

  const loadPaymentData = () => {
    try {
      setLoading(true);

      // Load payment methods
      const methods =
        paymentCollectionService.getUserPaymentMethods(targetUserId);
      setPaymentMethods(methods);

      // Load payment history
      const history =
        paymentCollectionService.getUserPaymentHistory(targetUserId);
      setPaymentHistory(history);

      // Load billing information
      const billingInfo = paymentCollectionService.getUserBilling(targetUserId);
      setBilling(billingInfo);

      // Load billing summary
      const summary = paymentCollectionService.getBillingSummary(targetUserId);
      setBillingSummary(summary);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPaymentMethod = async () => {
    try {
      setIsProcessing(true);

      const method = await paymentCollectionService.addPaymentMethod(
        targetUserId,
        newPaymentMethod
      );

      setPaymentMethods((prev) => [...prev, method]);
      setShowAddPayment(false);

      // Reset form
      setNewPaymentMethod({
        type: 'card',
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvc: '',
        accountNumber: '',
        routingNumber: '',
        accountType: 'checking',
      });

      alert('✅ Payment method added successfully!');
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert(`❌ Failed to add payment method: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSetDefaultPayment = async (paymentMethodId: string) => {
    try {
      await paymentCollectionService.setDefaultPaymentMethod(
        targetUserId,
        paymentMethodId
      );
      loadPaymentData();
      alert('✅ Default payment method updated!');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      alert(`❌ Failed to update default payment method: ${error}`);
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to remove this payment method?'))
      return;

    try {
      await paymentCollectionService.removePaymentMethod(
        targetUserId,
        paymentMethodId
      );
      loadPaymentData();
      alert('✅ Payment method removed successfully!');
    } catch (error) {
      console.error('Error removing payment method:', error);
      alert(`❌ Failed to remove payment method: ${error}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return '#34d399';
      case 'failed':
        return '#ef4444';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return '✅';
      case 'failed':
        return '❌';
      case 'pending':
        return '⏳';
      case 'cancelled':
        return '🚫';
      default:
        return '❓';
    }
  };

  const getDunningStatusColor = (status?: string) => {
    switch (status) {
      case 'final_notice':
        return '#ef4444';
      case 'hard_decline':
        return '#f59e0b';
      case 'soft_decline':
        return '#8b5cf6';
      default:
        return '#34d399';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: isCompact ? '16px' : '32px',
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderRadius: '16px',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>💳</div>
        <div>Loading payment information...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '16px',
        padding: isCompact ? '20px' : '32px',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: isCompact ? '20px' : '32px' }}>
        <h3
          style={{
            fontSize: isCompact ? '18px' : '24px',
            fontWeight: 'bold',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💳 Payment Management
        </h3>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: isCompact ? '14px' : '16px',
          }}
        >
          Manage payment methods, billing, and subscription payments
        </p>
      </div>

      {!isCompact && (
        /* Tab Navigation */
        <div
          style={{
            display: 'flex',
            marginBottom: '24px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '4px',
          }}
        >
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'methods', label: '💳 Payment Methods' },
            { id: 'history', label: '📜 History' },
            { id: 'settings', label: '⚙️ Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Overview Tab */}
      {(activeTab === 'overview' || isCompact) && (
        <div>
          {/* Billing Status */}
          {billing && (
            <div
              style={{
                background:
                  billing.status === 'active'
                    ? 'rgba(34, 197, 94, 0.1)'
                    : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${
                  billing.status === 'active'
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(239, 68, 68, 0.3)'
                }`,
                borderRadius: '12px',
                padding: isCompact ? '16px' : '20px',
                marginBottom: isCompact ? '16px' : '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: billing.status === 'active' ? '#34d399' : '#ef4444',
                  }}
                >
                  Subscription Status
                </h4>
                <span
                  style={{
                    background:
                      billing.status === 'active'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    color: billing.status === 'active' ? '#34d399' : '#ef4444',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                  }}
                >
                  {billing.status}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isCompact
                    ? '1fr'
                    : 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Current Plan
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    {billingSummary?.currentPlan}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Next Billing
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    ${billing.amount} on{' '}
                    {billing.nextBillingDate.toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    Total Paid
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#34d399',
                    }}
                  >
                    ${billingSummary?.totalPaid || 0}
                  </div>
                </div>
                {billing.failedPaymentCount > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Failed Payments
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#ef4444',
                      }}
                    >
                      {billing.failedPaymentCount}
                    </div>
                  </div>
                )}
              </div>

              {billing.dunningStatus && billing.dunningStatus !== 'none' && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '12px',
                    background:
                      getDunningStatusColor(billing.dunningStatus) + '20',
                    border: `1px solid ${getDunningStatusColor(billing.dunningStatus)}40`,
                    borderRadius: '8px',
                  }}
                >
                  <div
                    style={{
                      color: getDunningStatusColor(billing.dunningStatus),
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    ⚠️ Payment Issue:{' '}
                    {billing.dunningStatus.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      marginTop: '4px',
                    }}
                  >
                    Please update your payment method to avoid service
                    interruption.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Active Payment Method */}
          {paymentMethods.length > 0 && (
            <div
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                padding: isCompact ? '16px' : '20px',
                marginBottom: isCompact ? '16px' : '20px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#8b5cf6',
                  marginBottom: '12px',
                }}
              >
                💳 Active Payment Methods
              </h4>

              {paymentMethods
                .filter((pm) => pm.isActive)
                .slice(0, isCompact ? 1 : 3)
                .map((method) => (
                  <div
                    key={method.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: method.isDefault
                        ? 'rgba(139, 92, 246, 0.1)'
                        : 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: method.isDefault
                        ? '1px solid #8b5cf6'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        {method.type === 'card'
                          ? `💳 ${method.brand} **** ${method.last4}`
                          : `🏦 Bank **** ${method.last4}`}
                        {method.isDefault && (
                          <span
                            style={{
                              color: '#8b5cf6',
                              fontSize: '12px',
                              marginLeft: '8px',
                            }}
                          >
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {method.type === 'card' &&
                        method.expiryMonth &&
                        method.expiryYear
                          ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                          : method.accountType
                            ? `${method.accountType} account`
                            : 'Bank account'}
                      </div>
                    </div>
                    {method.isDefault && (
                      <div style={{ color: '#34d399', fontSize: '16px' }}>
                        ✅
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}

          {/* Recent Payments */}
          {paymentHistory.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: isCompact ? '16px' : '20px',
              }}
            >
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '12px',
                }}
              >
                📜 Recent Payments
              </h4>

              {paymentHistory.slice(0, isCompact ? 2 : 5).map((payment) => (
                <div
                  key={payment.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '8px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>
                      {getStatusIcon(payment.status)}
                    </span>
                    <div>
                      <div style={{ fontWeight: '600' }}>
                        ${payment.amount.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        {payment.attemptDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: getStatusColor(payment.status),
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {payment.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'methods' && !isCompact && (
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h4 style={{ fontSize: '18px', fontWeight: '600' }}>
              Payment Methods
            </h4>
            <button
              onClick={() => setShowAddPayment(true)}
              style={{
                background: 'linear-gradient(135deg, #34d399, #10b981)',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              ➕ Add Payment Method
            </button>
          </div>

          {paymentMethods
            .filter((pm) => pm.isActive)
            .map((method) => (
              <div
                key={method.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: method.isDefault
                    ? '2px solid #8b5cf6'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {method.type === 'card' ? '💳' : '🏦'}
                      {method.type === 'card'
                        ? `${method.brand} **** ${method.last4}`
                        : `Bank Account **** ${method.last4}`}
                      {method.isDefault && (
                        <span
                          style={{
                            background: '#8b5cf6',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                      }}
                    >
                      {method.type === 'card' &&
                      method.expiryMonth &&
                      method.expiryYear
                        ? `Expires ${method.expiryMonth}/${method.expiryYear}`
                        : method.accountType
                          ? `${method.accountType} account at ${method.bankName || 'Bank'}`
                          : 'Bank account'}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Added on {method.createdDate.toLocaleDateString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPayment(method.id)}
                        style={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          border: '1px solid #8b5cf6',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          color: '#8b5cf6',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid #ef4444',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {paymentMethods.filter((pm) => pm.isActive).length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💳</div>
              <div>No payment methods on file</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Add a payment method to manage your subscription billing
              </div>
            </div>
          )}

          {/* Add Payment Method Modal */}
          {showAddPayment && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '500px',
                  width: '90%',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                  }}
                >
                  Add Payment Method
                </h3>

                <div
                  style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}
                >
                  {[
                    { id: 'card', label: '💳 Credit/Debit Card' },
                    { id: 'bank_account', label: '🏦 Bank Account (ACH)' },
                  ].map((type) => (
                    <label
                      key={type.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type='radio'
                        name='paymentType'
                        value={type.id}
                        checked={newPaymentMethod.type === type.id}
                        onChange={(e) =>
                          setNewPaymentMethod((prev) => ({
                            ...prev,
                            type: e.target.value as 'card' | 'bank_account',
                          }))
                        }
                        style={{ accentColor: '#8b5cf6' }}
                      />
                      {type.label}
                    </label>
                  ))}
                </div>

                {newPaymentMethod.type === 'card' ? (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <input
                      type='text'
                      placeholder='Card Number'
                      value={newPaymentMethod.cardNumber}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          cardNumber: e.target.value,
                        }))
                      }
                      style={{
                        gridColumn: '1 / -1',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='MM'
                      value={newPaymentMethod.expiryMonth}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          expiryMonth: e.target.value,
                        }))
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='YYYY'
                      value={newPaymentMethod.expiryYear}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          expiryYear: e.target.value,
                        }))
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='CVC'
                      value={newPaymentMethod.cvc}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          cvc: e.target.value,
                        }))
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    <input
                      type='text'
                      placeholder='Account Number'
                      value={newPaymentMethod.accountNumber}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          accountNumber: e.target.value,
                        }))
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <input
                      type='text'
                      placeholder='Routing Number'
                      value={newPaymentMethod.routingNumber}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          routingNumber: e.target.value,
                        }))
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    />
                    <select
                      value={newPaymentMethod.accountType}
                      onChange={(e) =>
                        setNewPaymentMethod((prev) => ({
                          ...prev,
                          accountType: e.target.value as 'checking' | 'savings',
                        }))
                      }
                      style={{
                        gridColumn: '1 / -1',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'white',
                        fontSize: '14px',
                      }}
                    >
                      <option value='checking'>Checking Account</option>
                      <option value='savings'>Savings Account</option>
                    </select>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    onClick={() => setShowAddPayment(false)}
                    style={{
                      background: 'rgba(107, 114, 128, 0.3)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      color: 'white',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPaymentMethod}
                    disabled={isProcessing}
                    style={{
                      background: 'linear-gradient(135deg, #34d399, #10b981)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isProcessing ? 'Adding...' : 'Add Payment Method'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === 'history' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            Payment History
          </h4>

          {paymentHistory.length > 0 ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                  padding: '16px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  fontSize: '12px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                <div>Date</div>
                <div>Amount</div>
                <div>Method</div>
                <div>Status</div>
                <div>Details</div>
              </div>

              {paymentHistory.map((payment, index) => (
                <div
                  key={payment.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
                    padding: '16px 20px',
                    borderBottom:
                      index < paymentHistory.length - 1
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : 'none',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: '14px' }}>
                    {payment.attemptDate.toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600' }}>
                    ${payment.amount.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    {paymentMethods.find(
                      (pm) => pm.id === payment.paymentMethodId
                    )?.type === 'card'
                      ? 'Card'
                      : 'Bank'}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>{getStatusIcon(payment.status)}</span>
                    <span
                      style={{
                        color: getStatusColor(payment.status),
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {payment.status === 'failed'
                      ? payment.failureReason
                      : 'Processed successfully'}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📜</div>
              <div>No payment history available</div>
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '20px',
            }}
          >
            Payment Settings
          </h4>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              <div>
                <h5 style={{ fontSize: '16px', marginBottom: '12px' }}>
                  Billing Notifications
                </h5>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <input
                    type='checkbox'
                    defaultChecked
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  Email me before each billing cycle
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <input
                    type='checkbox'
                    defaultChecked
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  Notify me of failed payments
                </label>
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input type='checkbox' style={{ accentColor: '#8b5cf6' }} />
                  Send payment receipts
                </label>
              </div>

              <div>
                <h5 style={{ fontSize: '16px', marginBottom: '12px' }}>
                  Auto-Retry Settings
                </h5>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <input
                    type='checkbox'
                    defaultChecked
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  Automatically retry failed payments
                </label>
                <div
                  style={{
                    marginLeft: '24px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <div>Retry attempts: 3</div>
                  <div>Retry interval: 3 days</div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
              }}
            >
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#8b5cf6',
                }}
              >
                🔒 Security & Compliance
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                All payment data is encrypted and processed through PCI DSS
                compliant providers. We never store your complete card or bank
                account numbers.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact View Actions */}
      {isCompact && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '16px',
          }}
        >
          <button
            onClick={() => setShowAddPayment(true)}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Add Payment Method
          </button>
          <button
            onClick={() => alert('🚀 Full payment management in user profile!')}
            style={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '10px 16px',
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            View All Details
          </button>
        </div>
      )}
    </div>
  );
}

























