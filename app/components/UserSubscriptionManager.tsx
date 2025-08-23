/**
 * User Subscription Manager Component
 * Embedded subscription management for user profiles
 */

'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '../config/access';
import { subscriptionAgreementService } from '../services/SubscriptionAgreementService';
import { SubscriptionManagementService } from '../services/SubscriptionManagementService';
import PaymentManagementDashboard from './PaymentManagementDashboard';

interface UserSubscriptionData {
  subscription: any;
  usage: any;
  availableAddons: any[];
  recommendations: any;
}

interface UserSubscriptionManagerProps {
  userId?: string;
  isCompact?: boolean;
}

export default function UserSubscriptionManager({
  userId,
  isCompact = false,
}: UserSubscriptionManagerProps) {
  const [subscriptionData, setSubscriptionData] =
    useState<UserSubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'usage' | 'addons' | 'upgrade' | 'payment' | 'agreements'
  >('overview');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const { user } = getCurrentUser();
  const targetUserId = userId || user.id;

  useEffect(() => {
    loadSubscriptionData();
  }, [targetUserId]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);

      // Get current subscription
      const subscription =
        SubscriptionManagementService.getUserSubscription(targetUserId);

      // Get phone usage
      const usage = SubscriptionManagementService.getPhoneUsage(targetUserId);

      // Get available add-ons
      const addons = SubscriptionManagementService.getAlacarteModules().filter(
        (m) => m.id.startsWith('phone-')
      );

      // Get recommendations
      const tierOptions =
        SubscriptionManagementService.getSubscriptionTiers().filter(
          (t) => t.targetRole !== 'hybrid'
        );

      setSubscriptionData({
        subscription,
        usage,
        availableAddons: addons,
        recommendations: tierOptions,
      });
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tierId: string) => {
    try {
      await SubscriptionManagementService.changeSubscription(
        targetUserId,
        tierId
      );
      loadSubscriptionData();
      alert('✅ Subscription upgraded successfully!');
    } catch (error) {
      console.error('Upgrade failed:', error);
      alert('❌ Upgrade failed. Please try again.');
    }
  };

  const handleAddPhoneAddon = async (addonId: string) => {
    try {
      // In production, this would integrate with billing
      console.log(`Adding phone addon: ${addonId}`);
      alert('✅ Phone system add-on activated!');
      loadSubscriptionData();
    } catch (error) {
      console.error('Failed to add phone addon:', error);
      alert('❌ Failed to add phone system. Please try again.');
    }
  };

  if (loading) {
    return (
      <div
        style={{
          padding: isCompact ? '16px' : '24px',
          background: 'rgba(59, 130, 246, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          textAlign: 'center',
          color: 'white',
        }}
      >
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>💼</div>
        <div>Loading subscription data...</div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div
        style={{
          padding: isCompact ? '16px' : '24px',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          textAlign: 'center',
          color: '#ef4444',
        }}
      >
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️</div>
        <div>Failed to load subscription data</div>
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
            background: 'linear-gradient(135deg, #60a5fa, #34d399)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💼 Subscription Management
        </h3>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: isCompact ? '14px' : '16px',
          }}
        >
          Manage your FleetFlow professional subscription and add-ons
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
            { id: 'usage', label: '📞 Phone Usage' },
            { id: 'payment', label: '💳 Payment' },
            { id: 'agreements', label: '📋 Agreements' },
            { id: 'addons', label: '➕ Add-Ons' },
            { id: 'upgrade', label: '⬆️ Upgrade' },
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

      {/* Content */}
      {(activeTab === 'overview' || isCompact) && (
        <div>
          {/* Current Subscription */}
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: isCompact ? '16px' : '20px',
              marginBottom: isCompact ? '16px' : '20px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#34d399',
                marginBottom: '12px',
              }}
            >
              Current Subscription
            </h4>

            {subscriptionData.subscription ? (
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>
                    {SubscriptionManagementService.getSubscriptionTier(
                      subscriptionData.subscription.subscriptionTierId
                    )?.name || 'Unknown Plan'}
                  </span>
                  <span
                    style={{
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#34d399',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    ✅ ACTIVE
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '8px',
                  }}
                >
                  $
                  {SubscriptionManagementService.getSubscriptionTier(
                    subscriptionData.subscription.subscriptionTierId
                  )?.price || 0}
                  /month
                </div>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '8px',
                  }}
                >
                  No active subscription
                </div>
                <button
                  onClick={() => setActiveTab('upgrade')}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Choose Plan
                </button>
              </div>
            )}
          </div>

          {/* Phone Usage */}
          {subscriptionData.usage && (
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
                📞 Phone System Usage
              </h4>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
                    Phone Minutes
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#8b5cf6',
                    }}
                  >
                    {subscriptionData.usage.minutesLimit === -1
                      ? `${subscriptionData.usage.minutesUsed} (Unlimited)`
                      : `${subscriptionData.usage.minutesUsed}/${subscriptionData.usage.minutesLimit}`}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    SMS Messages
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#8b5cf6',
                    }}
                  >
                    {subscriptionData.usage.smsLimit === -1
                      ? `${subscriptionData.usage.smsUsed} (Unlimited)`
                      : `${subscriptionData.usage.smsUsed}/${subscriptionData.usage.smsLimit}`}
                  </div>
                </div>
                {subscriptionData.usage.overageCharges > 0 && (
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Overage Charges
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#ef4444',
                      }}
                    >
                      ${subscriptionData.usage.overageCharges.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Payment & Agreement Status (Compact Overview) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: isCompact ? '16px' : '20px',
              marginBottom: isCompact ? '16px' : '20px',
            }}
          >
            <h4
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'rgba(255, 255, 255, 0.9)',
                marginBottom: '12px',
              }}
            >
              💳 Payment & Legal Status
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
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
                  Payment Methods
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#60a5fa',
                  }}
                >
                  2 Active
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  Agreements
                </div>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#34d399',
                  }}
                >
                  ✅ Compliant
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
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#f59e0b',
                  }}
                >
                  {new Date(
                    Date.now() + 30 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'usage' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            📈 Detailed Usage Statistics
          </h4>
          {subscriptionData.usage ? (
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
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >
                <div>
                  <h5
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                    }}
                  >
                    Phone Minutes
                  </h5>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#60a5fa',
                      marginBottom: '4px',
                    }}
                  >
                    {subscriptionData.usage.minutesUsed}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    of{' '}
                    {subscriptionData.usage.minutesLimit === -1
                      ? 'unlimited'
                      : subscriptionData.usage.minutesLimit}{' '}
                    minutes
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {subscriptionData.usage.minutesLimit !== -1 && (
                      <div
                        style={{
                          width: `${Math.min(100, (subscriptionData.usage.minutesUsed / subscriptionData.usage.minutesLimit) * 100)}%`,
                          height: '100%',
                          background:
                            subscriptionData.usage.minutesUsed >
                            subscriptionData.usage.minutesLimit
                              ? '#ef4444'
                              : '#60a5fa',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <h5
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                    }}
                  >
                    SMS Messages
                  </h5>
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#34d399',
                      marginBottom: '4px',
                    }}
                  >
                    {subscriptionData.usage.smsUsed}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    of{' '}
                    {subscriptionData.usage.smsLimit === -1
                      ? 'unlimited'
                      : subscriptionData.usage.smsLimit}{' '}
                    messages
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      marginTop: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {subscriptionData.usage.smsLimit !== -1 && (
                      <div
                        style={{
                          width: `${Math.min(100, (subscriptionData.usage.smsUsed / subscriptionData.usage.smsLimit) * 100)}%`,
                          height: '100%',
                          background:
                            subscriptionData.usage.smsUsed >
                            subscriptionData.usage.smsLimit
                              ? '#ef4444'
                              : '#34d399',
                          borderRadius: '2px',
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              No usage data available
            </div>
          )}
        </div>
      )}

      {activeTab === 'payment' && !isCompact && (
        <div>
          <PaymentManagementDashboard userId={targetUserId} isCompact={false} />
        </div>
      )}

      {activeTab === 'agreements' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            📋 Legal Agreements & Consent
          </h4>

          {(() => {
            const agreementCheck =
              subscriptionAgreementService.hasUserAgreedToRequired(
                targetUserId
              );
            const userConsents =
              subscriptionAgreementService.getUserConsentHistory(targetUserId);

            return (
              <div>
                {/* Agreement Status */}
                <div
                  style={{
                    background: agreementCheck.hasAgreed
                      ? 'rgba(34, 197, 94, 0.1)'
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${
                      agreementCheck.hasAgreed
                        ? 'rgba(34, 197, 94, 0.3)'
                        : 'rgba(239, 68, 68, 0.3)'
                    }`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>
                      {agreementCheck.hasAgreed ? '✅' : '⚠️'}
                    </span>
                    <h5
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: agreementCheck.hasAgreed ? '#34d399' : '#ef4444',
                      }}
                    >
                      Agreement Status
                    </h5>
                  </div>

                  {agreementCheck.hasAgreed ? (
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      All required agreements have been accepted. Your
                      subscription is compliant.
                    </p>
                  ) : (
                    <div>
                      <p
                        style={{
                          color: '#ef4444',
                          fontSize: '14px',
                          marginBottom: '8px',
                        }}
                      >
                        Missing required agreements for subscription compliance.
                      </p>
                      {agreementCheck.missingAgreements.length > 0 && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          Missing: {agreementCheck.missingAgreements.join(', ')}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Consent History */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h5
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '16px',
                    }}
                  >
                    Consent History
                  </h5>

                  {userConsents.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      {userConsents.map((consent) => {
                        const agreement =
                          subscriptionAgreementService.getAgreement(
                            consent.agreementId
                          );
                        return (
                          <div
                            key={consent.id}
                            style={{
                              padding: '16px',
                              background:
                                consent.isActive && !consent.withdrawnDate
                                  ? 'rgba(34, 197, 94, 0.1)'
                                  : 'rgba(107, 114, 128, 0.1)',
                              border: `1px solid ${
                                consent.isActive && !consent.withdrawnDate
                                  ? 'rgba(34, 197, 94, 0.3)'
                                  : 'rgba(107, 114, 128, 0.3)'
                              }`,
                              borderRadius: '8px',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                              }}
                            >
                              <span style={{ fontWeight: '600' }}>
                                {agreement?.title || consent.agreementId}
                              </span>
                              <span
                                style={{
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  color:
                                    consent.isActive && !consent.withdrawnDate
                                      ? '#34d399'
                                      : '#6b7280',
                                }}
                              >
                                {consent.isActive && !consent.withdrawnDate
                                  ? 'ACTIVE'
                                  : 'INACTIVE'}
                              </span>
                            </div>

                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              <div>
                                Agreed:{' '}
                                {consent.consentDate.toLocaleDateString()} via{' '}
                                {consent.method.replace('_', ' ')}
                              </div>
                              {consent.signatureData && (
                                <div>
                                  Signed by:{' '}
                                  {consent.signatureData.signedByName}
                                </div>
                              )}
                              {consent.withdrawnDate && (
                                <div style={{ color: '#ef4444' }}>
                                  Withdrawn:{' '}
                                  {consent.withdrawnDate.toLocaleDateString()}
                                  {consent.withdrawnReason &&
                                    ` (${consent.withdrawnReason})`}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      <div style={{ fontSize: '32px', marginBottom: '16px' }}>
                        📋
                      </div>
                      <div>No agreement consents recorded</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeTab === 'addons' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            📞 Phone System Add-Ons
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {subscriptionData.availableAddons.map((addon) => (
              <div
                key={addon.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <h5
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  {addon.name}
                </h5>
                <div
                  style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#34d399',
                    marginBottom: '8px',
                  }}
                >
                  {addon.id === 'phone-usage'
                    ? '$0.02/min'
                    : `$${addon.price}/month`}
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '16px',
                  }}
                >
                  {addon.description}
                </p>
                <button
                  onClick={() => handleAddPhoneAddon(addon.id)}
                  style={{
                    width: '100%',
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
                  Add to Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upgrade' && !isCompact && (
        <div>
          <h4
            style={{
              fontSize: '18px',
              fontWeight: '600',
              marginBottom: '16px',
            }}
          >
            ⬆️ Upgrade Subscription
          </h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {subscriptionData.recommendations.slice(0, 4).map((tier) => (
              <div
                key={tier.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${tier.popular ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                }}
              >
                {tier.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '16px',
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    🔥 POPULAR
                  </div>
                )}

                <h5
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '8px',
                  }}
                >
                  {tier.name}
                </h5>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    marginBottom: '8px',
                  }}
                >
                  ${tier.price}
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '400',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    /month
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '16px',
                  }}
                >
                  {tier.description}
                </p>

                {subscriptionData.subscription?.subscriptionTierId ===
                tier.id ? (
                  <div
                    style={{
                      width: '100%',
                      background: 'rgba(107, 114, 128, 0.3)',
                      color: 'rgba(255, 255, 255, 0.6)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    Current Plan
                  </div>
                ) : (
                  <button
                    onClick={() => handleUpgrade(tier.id)}
                    style={{
                      width: '100%',
                      background: tier.popular
                        ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                        : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {subscriptionData.subscription ? 'Upgrade to' : 'Select'}{' '}
                    {tier.name}
                  </button>
                )}
              </div>
            ))}
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
            onClick={() => window.open('/plans', '_blank')}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 16px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            View All Plans
          </button>
          <button
            onClick={() =>
              alert(
                '🚀 Full subscription management coming soon in user profile!'
              )
            }
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
            Manage Details
          </button>
        </div>
      )}
    </div>
  );
}
