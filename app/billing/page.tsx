'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import {
  FLEETFLOW_PRICING_PLANS,
  StripeService,
  type SubscriptionPlan,
} from '../services/stripe/StripeService';

// ========================================
// INTERFACES & TYPES
// ========================================

interface EnterpriseBillingData {
  tenantId: string;
  tenantName: string;
  currentSubscriptions: CurrentSubscription[];
  usage: UsageMetrics;
  invoices: BillingInvoice[];
  paymentMethods: PaymentMethod[];
  billingHistory: BillingEvent[];
  roiMetrics: ROIMetrics;
  predictiveAnalytics: PredictiveMetrics;
}

interface CurrentSubscription {
  id: string;
  planId: string;
  planName: string;
  price: number;
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  nextBilling: string;
  features: string[];
  category: string;
  usage: number;
  limit: number | 'unlimited';
}

interface UsageMetrics {
  drivers: { current: number; limit: number | 'unlimited'; trend: number };
  apiCalls: { current: number; limit: number; trend: number };
  dataExports: { current: number; limit: number; trend: number };
  smsMessages: { current: number; limit: number; trend: number };
  aiOperations: { current: number; limit: number; trend: number };
  rfxSubmissions: { current: number; limit: number; trend: number };
  trainingHours: {
    current: number;
    limit: number | 'unlimited';
    trend: number;
  };
  complianceChecks: { current: number; limit: number; trend: number };
}

interface BillingInvoice {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed' | 'overdue';
  description: string;
  downloadUrl?: string;
  paymentMethod?: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'ach';
  last4: string;
  brand?: string;
  isDefault: boolean;
  expiryDate?: string;
}

interface BillingEvent {
  id: string;
  type:
    | 'subscription_created'
    | 'subscription_updated'
    | 'payment_succeeded'
    | 'payment_failed'
    | 'plan_changed';
  date: string;
  description: string;
  amount?: number;
}

interface ROIMetrics {
  totalSavings: number;
  efficiencyGains: number;
  revenueIncrease: number;
  costReduction: number;
  paybackPeriod: number;
  netPresentValue: number;
}

interface PredictiveMetrics {
  projectedSavings: number;
  recommendedUpgrades: string[];
  usageTrends: { [key: string]: number };
  costOptimization: number;
}

// ========================================
// COMPONENTS
// ========================================

interface AdvancedUsageMeterProps {
  title: string;
  current: number;
  limit: number | 'unlimited';
  trend: number;
  unit: string;
  icon: string;
}

const AdvancedUsageMeter: React.FC<AdvancedUsageMeterProps> = ({
  title,
  current,
  limit,
  trend,
  unit,
  icon,
}) => {
  const percentage =
    limit === 'unlimited' ? 0 : (current / (limit as number)) * 100;
  const isOverLimit = percentage > 100;
  const trendColor = trend > 0 ? '#10b981' : trend < 0 ? '#ef4444' : '#6b7280';

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
      >
        <span style={{ fontSize: '24px', marginRight: '12px' }}>{icon}</span>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'white',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          marginBottom: '12px',
        }}
      >
        <div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: isOverLimit ? '#ef4444' : 'white',
            }}
          >
            {current.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginLeft: '4px',
            }}
          >
            {unit}
          </span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontSize: '12px',
              color: trendColor,
              fontWeight: '600',
            }}
          >
            {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend)}%
          </div>
        </div>
      </div>

      <div
        style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '12px',
        }}
      >
        {limit === 'unlimited'
          ? 'Unlimited'
          : `${(limit as number).toLocaleString()} limit`}
      </div>

      {limit !== 'unlimited' && (
        <div
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(percentage, 100)}%`,
              background: isOverLimit
                ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                : percentage > 80
                  ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                  : 'linear-gradient(90deg, #10b981, #059669)',
              borderRadius: '3px',
              transition: 'all 0.3s ease',
            }}
          />
        </div>
      )}

      {isOverLimit && (
        <p
          style={{
            color: '#ef4444',
            fontSize: '11px',
            marginTop: '8px',
            margin: '8px 0 0 0',
            fontWeight: '500',
          }}
        >
          ⚠️ Over limit - additional charges may apply
        </p>
      )}
    </div>
  );
};

interface EnterprisePlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  isSelected: boolean;
  isCurrentPlan?: boolean;
  highlight?: boolean;
  savings?: number;
}

const EnterprisePlanCard: React.FC<EnterprisePlanCardProps> = ({
  plan,
  onSelect,
  isSelected,
  isCurrentPlan = false,
  highlight = false,
  savings,
}) => {
  return (
    <div
      style={{
        background: highlight
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))'
          : 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: highlight
          ? '2px solid #3b82f6'
          : isSelected || isCurrentPlan
            ? '2px solid #10b981'
            : '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onSelect}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
      }}
    >
      {highlight && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            height: '4px',
          }}
        />
      )}

      {(highlight || isCurrentPlan) && (
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span
            style={{
              background: highlight
                ? '#3b82f6'
                : isCurrentPlan
                  ? '#10b981'
                  : '#6b7280',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {highlight
              ? 'MOST POPULAR'
              : isCurrentPlan
                ? 'CURRENT PLAN'
                : 'RECOMMENDED'}
          </span>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h3
          style={{
            fontSize: '22px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '12px',
          }}
        >
          {plan.name}
        </h3>
        <div
          style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
          }}
        >
          ${plan.price.toLocaleString()}
          <span
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            /{plan.interval}
          </span>
        </div>
        {savings && (
          <div
            style={{
              fontSize: '14px',
              color: '#10b981',
              fontWeight: '600',
            }}
          >
            Save ${savings.toLocaleString()}/year
          </div>
        )}
      </div>

      <ul style={{ marginBottom: '28px', padding: 0, listStyle: 'none' }}>
        {plan.features.slice(0, 8).map((feature, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                color: '#10b981',
                marginRight: '12px',
                marginTop: '2px',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              ✓
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4',
              }}
            >
              {feature}
            </span>
          </li>
        ))}
        {plan.features.length > 8 && (
          <li
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              fontStyle: 'italic',
              marginTop: '8px',
            }}
          >
            +{plan.features.length - 8} more features...
          </li>
        )}
      </ul>

      <button
        style={{
          width: '100%',
          padding: '16px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '700',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: isCurrentPlan
            ? 'rgba(16, 185, 129, 0.2)'
            : highlight
              ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
              : 'linear-gradient(135deg, #10b981, #059669)',
          color: 'white',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {isCurrentPlan
          ? 'Current Plan'
          : isSelected
            ? 'Selected'
            : 'Select Plan'}
      </button>
    </div>
  );
};

const ROICalculator: React.FC<{ roiMetrics: ROIMetrics }> = ({
  roiMetrics,
}) => {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '32px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        📊 Return on Investment Analysis
      </h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981' }}
          >
            ${roiMetrics.totalSavings.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Total Annual Savings
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '28px', fontWeight: 'bold', color: '#3b82f6' }}
          >
            {roiMetrics.efficiencyGains}%
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Efficiency Improvement
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6' }}
          >
            ${roiMetrics.revenueIncrease.toLocaleString()}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Revenue Increase
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{ fontSize: '28px', fontWeight: 'bold', color: '#f59e0b' }}
          >
            {roiMetrics.paybackPeriod}
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Months to Payback
          </div>
        </div>
      </div>
    </div>
  );
};

// ========================================
// MAIN COMPONENT
// ========================================

const EnterpriseBillingDashboard: React.FC = () => {
  const [billingData, setBillingData] = useState<EnterpriseBillingData | null>(
    null
  );
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'plans' | 'usage' | 'invoices' | 'analytics'
  >('overview');
  const [loading, setLoading] = useState(true);
  const [stripeService, setStripeService] = useState<StripeService | null>(
    null
  );

  useEffect(() => {
    loadEnterpriseBillingData();
  }, []);

  const loadEnterpriseBillingData = async () => {
    try {
      setLoading(true);

      // Initialize StripeService with error handling
      if (!stripeService) {
        try {
          const service = new StripeService();
          setStripeService(service);
        } catch (error) {
          console.warn('StripeService not available:', error);
        }
      }

      // Generate comprehensive enterprise billing data
      const mockData: EnterpriseBillingData = {
        tenantId: 'tenant-fleetflow-enterprise-001',
        tenantName: 'FleetFlow Enterprise',
        currentSubscriptions: [
          {
            id: 'sub_001',
            planId: 'ai_flow_professional',
            planName: 'AI Flow Professional',
            price: 199,
            status: 'active',
            nextBilling: 'February 15, 2025',
            features: FLEETFLOW_PRICING_PLANS.AI_FLOW_PROFESSIONAL.features,
            category: 'TMS',
            usage: 78,
            limit: 100,
          },
          {
            id: 'sub_002',
            planId: 'consortium_professional',
            planName: 'Data Consortium Professional',
            price: 299,
            status: 'active',
            nextBilling: 'February 15, 2025',
            features: FLEETFLOW_PRICING_PLANS.CONSORTIUM_PROFESSIONAL.features,
            category: 'CONSORTIUM',
            usage: 45,
            limit: 'unlimited',
          },
        ],
        usage: {
          drivers: { current: 47, limit: 50, trend: 12 },
          apiCalls: { current: 8547, limit: 15000, trend: 23 },
          dataExports: { current: 34, limit: 100, trend: -5 },
          smsMessages: { current: 1247, limit: 2500, trend: 8 },
          aiOperations: { current: 2847, limit: 5000, trend: 45 },
          rfxSubmissions: { current: 156, limit: 500, trend: 67 },
          trainingHours: {
            current: 847,
            limit: 'unlimited' as const,
            trend: 34,
          },
          complianceChecks: { current: 234, limit: 1000, trend: 15 },
        },
        invoices: [
          {
            id: 'INV-FF-2025-001',
            amount: 498,
            date: '2025-01-15',
            status: 'paid',
            description: 'AI Flow Professional + Data Consortium Professional',
            downloadUrl: '/api/invoices/INV-FF-2025-001/download',
            paymentMethod: 'card_****4242',
          },
          {
            id: 'INV-FF-2024-012',
            amount: 498,
            date: '2024-12-15',
            status: 'paid',
            description: 'AI Flow Professional + Data Consortium Professional',
            downloadUrl: '/api/invoices/INV-FF-2024-012/download',
            paymentMethod: 'card_****4242',
          },
          {
            id: 'INV-FF-2024-011',
            amount: 498,
            date: '2024-11-15',
            status: 'paid',
            description: 'AI Flow Professional + Data Consortium Professional',
            downloadUrl: '/api/invoices/INV-FF-2024-011/download',
            paymentMethod: 'card_****4242',
          },
        ],
        paymentMethods: [
          {
            id: 'pm_001',
            type: 'card',
            last4: '4242',
            brand: 'Visa',
            isDefault: true,
            expiryDate: '12/27',
          },
        ],
        billingHistory: [
          {
            id: 'evt_001',
            type: 'payment_succeeded',
            date: '2025-01-15',
            description:
              'Payment succeeded for AI Flow Professional + Data Consortium Professional',
            amount: 498,
          },
          {
            id: 'evt_002',
            type: 'subscription_updated',
            date: '2025-01-01',
            description: 'Upgraded to AI Flow Professional from Broker Elite',
          },
        ],
        roiMetrics: {
          totalSavings: 247500,
          efficiencyGains: 34,
          revenueIncrease: 185000,
          costReduction: 62500,
          paybackPeriod: 3,
          netPresentValue: 1247000,
        },
        predictiveAnalytics: {
          projectedSavings: 325000,
          recommendedUpgrades: ['Strategic Growth', 'Enterprise Professional'],
          usageTrends: {
            drivers: 15,
            apiCalls: 25,
            aiOperations: 45,
          },
          costOptimization: 45000,
        },
      };

      setBillingData(mockData);
    } catch (error) {
      console.error('Error loading enterprise billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = async (planId: string) => {
    try {
      setLoading(true);
      console.log('Changing to plan:', planId);
      // TODO: Implement actual plan change logic
      await loadEnterpriseBillingData();
    } catch (error) {
      console.error('Error changing plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePlanSelection = (planId: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId]
    );
  };

  if (loading || !billingData) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `
          linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)
        `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px 20px 20px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid white',
              borderRadius: '50%',
              margin: '0 auto 24px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <p
            style={{
              color: 'white',
              fontSize: '18px',
              margin: 0,
              fontWeight: '500',
            }}
          >
            Loading Enterprise Billing Intelligence...
          </p>
        </div>
      </div>
    );
  }

  const currentSubscriptionTotal = billingData.currentSubscriptions.reduce(
    (sum, sub) => sum + sub.price,
    0
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #1e3a8a 0%, #3730a3 25%, #7c3aed 50%, #be185d 75%, #dc2626 100%)
      `,
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Navigation Header */}
      <div style={{ padding: '0 0 32px 0' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Link href='/' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '16px',
              }}
            >
              <span style={{ marginRight: '8px' }}>←</span>
              Back to Dashboard
            </button>
          </Link>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'overview', label: '📊 Overview', icon: '📊' },
              { id: 'plans', label: '💎 Plans', icon: '💎' },
              { id: 'usage', label: '📈 Usage', icon: '📈' },
              { id: 'invoices', label: '📄 Invoices', icon: '📄' },
              { id: 'analytics', label: '🎯 Analytics', icon: '🎯' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    activeTab === tab.id
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Enterprise Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '48px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 16px 64px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 12px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  background:
                    'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                💳 Enterprise Billing Intelligence
              </h1>
              <p
                style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 16px 0',
                }}
              >
                Advanced subscription management for the transportation
                industry's most comprehensive platform
              </p>
              <div
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Tenant: {billingData.tenantName} • Current Monthly: $
                {currentSubscriptionTotal.toLocaleString()}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  padding: '16px 24px',
                  borderRadius: '16px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Enterprise Status
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  ACTIVE
                </div>
              </div>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Next billing: {billingData.currentSubscriptions[0]?.nextBilling}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Current Subscriptions Overview */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                }}
              >
                🎯 Active Subscriptions
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '24px',
                }}
              >
                {billingData.currentSubscriptions.map((subscription) => (
                  <div
                    key={subscription.id}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 8px 0',
                          }}
                        >
                          {subscription.planName}
                        </h3>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#10b981',
                          }}
                        >
                          ${subscription.price}/month
                        </div>
                      </div>
                      <span
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {subscription.status}
                      </span>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          marginBottom: '4px',
                        }}
                      >
                        Usage: {subscription.usage}%
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${subscription.usage}%`,
                            background:
                              'linear-gradient(90deg, #10b981, #059669)',
                            borderRadius: '2px',
                          }}
                        />
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Next billing: {subscription.nextBilling}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Analysis */}
            <ROICalculator roiMetrics={billingData.roiMetrics} />
          </div>
        )}

        {activeTab === 'plans' && (
          <div>
            {/* Professional Subscription Tiers */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                🏆 Professional Subscription Tiers
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                Choose the perfect combination for your transportation
                enterprise
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {[
                  FLEETFLOW_PRICING_PLANS.FLEETFLOW_UNIVERSITY,
                  FLEETFLOW_PRICING_PLANS.DISPATCHER_PRO,
                  FLEETFLOW_PRICING_PLANS.RFX_PROFESSIONAL,
                  FLEETFLOW_PRICING_PLANS.BROKER_ELITE,
                  FLEETFLOW_PRICING_PLANS.AI_FLOW_PROFESSIONAL,
                  FLEETFLOW_PRICING_PLANS.ENTERPRISE_PROFESSIONAL,
                ].map((plan) => (
                  <EnterprisePlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => togglePlanSelection(plan.id)}
                    isSelected={selectedPlans.includes(plan.id)}
                    isCurrentPlan={billingData.currentSubscriptions.some(
                      (sub) => sub.planId === plan.id
                    )}
                    highlight={plan.id === 'ai_flow_professional'}
                  />
                ))}
              </div>
            </div>

            {/* À La Carte System */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                🛠️ À La Carte System
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginBottom: '24px',
                }}
              >
                Base Platform + Modular Add-ons for Custom Solutions
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                }}
              >
                {[
                  FLEETFLOW_PRICING_PLANS.BASE_PLATFORM,
                  FLEETFLOW_PRICING_PLANS.ADDON_ADVANCED_ANALYTICS,
                  FLEETFLOW_PRICING_PLANS.ADDON_AI_AUTOMATION,
                  FLEETFLOW_PRICING_PLANS.ADDON_COMPLIANCE_PRO,
                  FLEETFLOW_PRICING_PLANS.ADDON_FINANCIAL_SUITE,
                  FLEETFLOW_PRICING_PLANS.ADDON_WAREHOUSE_3PL,
                ].map((plan) => (
                  <EnterprisePlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => togglePlanSelection(plan.id)}
                    isSelected={selectedPlans.includes(plan.id)}
                  />
                ))}
              </div>
            </div>

            {/* Strategic Enterprise Tiers */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                🚀 Strategic Enterprise Tiers
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  marginBottom: '24px',
                }}
              >
                For companies preparing for strategic acquisition or IPO
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                  gap: '24px',
                }}
              >
                {[
                  FLEETFLOW_PRICING_PLANS.STRATEGIC_GROWTH,
                  FLEETFLOW_PRICING_PLANS.STRATEGIC_ENTERPRISE,
                ].map((plan) => (
                  <EnterprisePlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => togglePlanSelection(plan.id)}
                    isSelected={selectedPlans.includes(plan.id)}
                    highlight={true}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              📊 Enterprise Usage Analytics
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px',
              }}
            >
              <AdvancedUsageMeter
                title='Active Drivers'
                current={billingData.usage.drivers.current}
                limit={billingData.usage.drivers.limit}
                trend={billingData.usage.drivers.trend}
                unit='drivers'
                icon='👥'
              />
              <AdvancedUsageMeter
                title='API Operations'
                current={billingData.usage.apiCalls.current}
                limit={billingData.usage.apiCalls.limit}
                trend={billingData.usage.apiCalls.trend}
                unit='calls'
                icon='🔌'
              />
              <AdvancedUsageMeter
                title='AI Operations'
                current={billingData.usage.aiOperations.current}
                limit={billingData.usage.aiOperations.limit}
                trend={billingData.usage.aiOperations.trend}
                unit='operations'
                icon='🤖'
              />
              <AdvancedUsageMeter
                title='RFx Submissions'
                current={billingData.usage.rfxSubmissions.current}
                limit={billingData.usage.rfxSubmissions.limit}
                trend={billingData.usage.rfxSubmissions.trend}
                unit='submissions'
                icon='📋'
              />
              <AdvancedUsageMeter
                title='Training Hours'
                current={billingData.usage.trainingHours.current}
                limit={billingData.usage.trainingHours.limit}
                trend={billingData.usage.trainingHours.trend}
                unit='hours'
                icon='🎓'
              />
              <AdvancedUsageMeter
                title='Compliance Checks'
                current={billingData.usage.complianceChecks.current}
                limit={billingData.usage.complianceChecks.limit}
                trend={billingData.usage.complianceChecks.trend}
                unit='checks'
                icon='✅'
              />
              <AdvancedUsageMeter
                title='Data Exports'
                current={billingData.usage.dataExports.current}
                limit={billingData.usage.dataExports.limit}
                trend={billingData.usage.dataExports.trend}
                unit='exports'
                icon='📤'
              />
              <AdvancedUsageMeter
                title='SMS Messages'
                current={billingData.usage.smsMessages.current}
                limit={billingData.usage.smsMessages.limit}
                trend={billingData.usage.smsMessages.trend}
                unit='messages'
                icon='💬'
              />
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '32px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '24px',
              }}
            >
              📄 Enterprise Billing History
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Invoice
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'right',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Amount
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        textAlign: 'center',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {billingData.invoices.map((invoice, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: '600',
                          color: '#3b82f6',
                        }}
                      >
                        {invoice.id}
                      </td>
                      <td style={{ padding: '16px', color: 'white' }}>
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {invoice.description}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          textAlign: 'right',
                          color: 'white',
                          fontWeight: '600',
                        }}
                      >
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span
                          style={{
                            background:
                              invoice.status === 'paid'
                                ? '#10b981'
                                : invoice.status === 'pending'
                                  ? '#f59e0b'
                                  : invoice.status === 'overdue'
                                    ? '#ef4444'
                                    : '#6b7280',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {invoice.downloadUrl && (
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            📥 Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '32px',
                textAlign: 'center',
              }}
            >
              🎯 Predictive Analytics & Optimization
            </h2>

            {/* ROI Analysis */}
            <div style={{ marginBottom: '32px' }}>
              <ROICalculator roiMetrics={billingData.roiMetrics} />
            </div>

            {/* Predictive Analytics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '24px',
                }}
              >
                🔮 Predictive Intelligence
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    $
                    {billingData.predictiveAnalytics.projectedSavings.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Projected 12-Month Savings
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    $
                    {billingData.predictiveAnalytics.costOptimization.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Cost Optimization Potential
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '12px',
                    }}
                  >
                    Recommended Upgrades
                  </h4>
                  {billingData.predictiveAnalytics.recommendedUpgrades.map(
                    (upgrade, index) => (
                      <div
                        key={index}
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                        }}
                      >
                        • {upgrade}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default EnterpriseBillingDashboard;
