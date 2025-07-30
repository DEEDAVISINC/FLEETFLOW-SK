'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StripeService, FLEETFLOW_PRICING_PLANS, type SubscriptionPlan } from '../services/stripe/StripeService';

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    nextBilling: string;
    status: 'active' | 'past_due' | 'canceled';
  };
  usage: {
    drivers: { current: number; limit: number | 'unlimited' };
    apiCalls: { current: number; limit: number };
    dataExports: { current: number; limit: number };
    smsMessages: { current: number; limit: number };
  };
  invoices: Array<{
    id: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'failed';
    downloadUrl?: string;
  }>;
}

interface UsageMeterProps {
  title: string;
  current: number;
  limit: number | 'unlimited';
  unit: string;
}

const UsageMeter: React.FC<UsageMeterProps> = ({ title, current, limit, unit }) => {
  const percentage = limit === 'unlimited' ? 0 : (current / (limit as number)) * 100;
  const isOverLimit = percentage > 100;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '16px'
      }}>
        {title}
      </h3>
      <div style={{ marginBottom: '12px' }}>
        <span style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: isOverLimit ? '#ef4444' : '#1f2937'
        }}>
          {current.toLocaleString()} {unit}
        </span>
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          display: 'block',
          marginTop: '4px'
        }}>
          {limit === 'unlimited' ? 'Unlimited' : `${(limit as number).toLocaleString()} limit`}
        </span>
      </div>
      {limit !== 'unlimited' && (
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: isOverLimit ? '#ef4444' : percentage > 80 ? '#f59e0b' : '#10b981',
            borderRadius: '4px',
            transition: 'all 0.3s ease'
          }} />
        </div>
      )}
      {isOverLimit && (
        <p style={{
          color: '#ef4444',
          fontSize: '12px',
          marginTop: '8px',
          margin: 0
        }}>
          Over limit - additional charges may apply
        </p>
      )}
    </div>
  );
};

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  isSelected: boolean;
  highlight?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, isSelected, highlight = false }) => {
  return (
    <div 
      style={{
        background: highlight ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: highlight ? '2px solid #3b82f6' : isSelected ? '2px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '12px',
        padding: '24px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onClick={onSelect}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
    >
      {highlight && (
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <span style={{
            background: '#3b82f6',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textTransform: 'uppercase'
          }}>
            MOST POPULAR
          </span>
        </div>
      )}
      
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '8px'
        }}>
          {plan.name}
        </h3>
        <div style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          ${plan.price}
          <span style={{
            fontSize: '16px',
            fontWeight: '500',
            color: '#6b7280'
          }}>
            /{plan.interval}
          </span>
        </div>
      </div>

      <ul style={{ marginBottom: '24px', padding: 0, listStyle: 'none' }}>
        {plan.features.map((feature, index) => (
          <li key={index} style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '12px'
          }}>
            <span style={{
              color: '#10b981',
              marginRight: '12px',
              marginTop: '2px',
              fontSize: '16px'
            }}>
              ✓
            </span>
            <span style={{
              fontSize: '14px',
              color: '#6b7280'
            }}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <button style={{
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: highlight ? '#3b82f6' : '#1f2937',
        color: 'white'
      }}>
        {isSelected ? 'Current Plan' : 'Select Plan'}
      </button>
    </div>
  );
};

const BillingDashboard: React.FC = () => {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeService, setStripeService] = useState<StripeService | null>(null);

  useEffect(() => {
    loadBillingData();
  }, []);

  const loadBillingData = async () => {
    try {
      setLoading(true);
      
      // Initialize StripeService only when needed and handle errors gracefully
      if (!stripeService) {
        try {
          const service = new StripeService();
          setStripeService(service);
        } catch (error) {
          console.warn('StripeService not available:', error);
          // Continue with mock data if Stripe is not configured
        }
      }
      
      // TODO: Replace with actual API call to get user's billing data
      const mockData: BillingData = {
        currentPlan: {
          name: 'TMS Professional + Data Consortium Pro',
          price: 798,
          nextBilling: 'August 9, 2025',
          status: 'active',
        },
        usage: {
          drivers: { current: 47, limit: 50 },
          apiCalls: { current: 2847, limit: 10000 },
          dataExports: { current: 12, limit: 50 },
          smsMessages: { current: 156, limit: 500 },
        },
        invoices: [
          {
            id: 'INV-2025-007',
            amount: 798,
            date: '2025-07-09',
            status: 'pending',
          },
          {
            id: 'INV-2025-006',
            amount: 798,
            date: '2025-06-09',
            status: 'paid',
            downloadUrl: '/api/invoices/INV-2025-006/download',
          },
          {
            id: 'INV-2025-005',
            amount: 798,
            date: '2025-05-09',
            status: 'paid',
            downloadUrl: '/api/invoices/INV-2025-005/download',
          },
        ],
      };
      setBillingData(mockData);
    } catch (error) {
      console.error('Error loading billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setLoading(true);
      // TODO: Implement plan change logic
      console.log('Changing to plan:', planId);
      // await stripeService.updateSubscription(subscriptionId, newPlanItems);
      await loadBillingData();
    } catch (error) {
      console.error('Error changing plan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !billingData) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 20px 20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{ color: 'white', fontSize: '16px', margin: 0 }}>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            💳 Billing & Subscriptions
          </h1>
          <p style={{
            fontSize: '18px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Manage your FleetFlow subscription, billing, and usage
          </p>
        </div>

        {/* Current Plan Overview */}
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '8px'
              }}>
                {billingData.currentPlan.name}
              </h2>
              <p style={{
                fontSize: '20px',
                opacity: 0.9,
                margin: '0 0 8px 0'
              }}>
                ${billingData.currentPlan.price}/month
              </p>
              <p style={{
                opacity: 0.75,
                margin: 0
              }}>
                Next billing: {billingData.currentPlan.nextBilling}
              </p>
            </div>
            <div>
              <span style={{
                background: billingData.currentPlan.status === 'active' ? '#10b981' :
                          billingData.currentPlan.status === 'past_due' ? '#f59e0b' : '#ef4444',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                textTransform: 'uppercase'
              }}>
                {billingData.currentPlan.status.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Meters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <UsageMeter
            title="Drivers"
            current={billingData.usage.drivers.current}
            limit={billingData.usage.drivers.limit}
            unit="drivers"
          />
          <UsageMeter
            title="API Calls"
            current={billingData.usage.apiCalls.current}
            limit={billingData.usage.apiCalls.limit}
            unit="calls"
          />
          <UsageMeter
            title="Data Exports"
            current={billingData.usage.dataExports.current}
            limit={billingData.usage.dataExports.limit}
            unit="exports"
          />
          <UsageMeter
            title="SMS Messages"
            current={billingData.usage.smsMessages.current}
            limit={billingData.usage.smsMessages.limit}
            unit="messages"
          />
        </div>

        {/* Available Plans */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '32px'
          }}>
            📋 Available Plans
          </h2>
          
          {/* TMS Plans */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px'
            }}>
              TMS Platform
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter(plan => plan.category === 'TMS')
                .map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePlanChange(plan.id)}
                    isSelected={selectedPlan === plan.id}
                  />
                ))}
            </div>
          </div>

          {/* Data Consortium Plans */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '8px'
            }}>
              🌐 Data Consortium 
              <span style={{
                fontSize: '12px',
                background: '#fbbf24',
                color: '#1f2937',
                padding: '4px 12px',
                borderRadius: '12px',
                marginLeft: '12px',
                fontWeight: '600'
              }}>
                REVOLUTIONARY
              </span>
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter(plan => plan.category === 'CONSORTIUM')
                .map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePlanChange(plan.id)}
                    isSelected={selectedPlan === plan.id}
                    highlight={plan.id === 'consortium_professional'}
                  />
                ))}
            </div>
          </div>

          {/* Compliance Plans */}
          <div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '20px'
            }}>
              DOT Compliance Services
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter(plan => plan.category === 'COMPLIANCE')
                .map(plan => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => handlePlanChange(plan.id)}
                    isSelected={selectedPlan === plan.id}
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '24px'
          }}>
            📄 Billing History
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '24px'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Invoice</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Amount</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#1f2937' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billingData.invoices.map((invoice, index) => (
                    <tr key={index} style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f9fafb'
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'transparent'
                    }}
                    >
                      <td style={{ padding: '16px', fontWeight: '600', color: '#3b82f6' }}>{invoice.id}</td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>{invoice.date}</td>
                      <td style={{ padding: '16px', color: '#1f2937', fontWeight: '600' }}>${invoice.amount}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{
                          background: invoice.status === 'paid' ? '#10b981' :
                                    invoice.status === 'pending' ? '#f59e0b' : '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {invoice.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        {invoice.downloadUrl && (
                          <button style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}>
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BillingDashboard;
