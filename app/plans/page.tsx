'use client';

import {
  ArrowRight,
  Building,
  Check,
  Crown,
  GraduationCap,
  Shield,
  Star,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  icon: any;
  popular?: boolean;
  features: string[];
  cta: string;
  gradient: string;
  borderColor: string;
  ctaColor: string;
}

const ENTERPRISE_PLANS: PricingTier[] = [
  {
    id: 'university',
    name: 'FleetFlow University℠',
    price: 49,
    period: '/month',
    description: 'Professional transportation training and certification',
    icon: GraduationCap,
    features: [
      'Complete training curriculum',
      'BOL/MBL/HBL documentation',
      'Warehouse operations training',
      'Certification programs',
      'Industry best practices',
      'Progress tracking',
      'Instructor access',
      'Training materials library',
      '📞 Phone add-on available (+$39-$199)',
    ],
    cta: 'Start Learning',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    borderColor: '#f59e0b',
    ctaColor: '#f59e0b',
  },
  {
    id: 'dispatcher',
    name: 'Professional Dispatcher',
    price: 79,
    period: '/month',
    description:
      'Complete dispatch management with AI automation + basic phone included',
    icon: TrendingUp,
    features: [
      'Complete dispatch management',
      'Driver assignment & tracking',
      'Route optimization',
      'CRM integration',
      'Basic AI automation',
      'Load management',
      'Real-time notifications',
      'Mobile app access',
      '📞 50 phone minutes included',
      '📱 25 SMS messages included',
      '📞 Phone upgrades available (+$39-$199)',
    ],
    cta: 'Start Dispatching',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderColor: '#3b82f6',
    ctaColor: '#3b82f6',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Professional',
    price: 2698,
    period: '/month',
    description: 'Complete platform access + unlimited phone system',
    icon: Crown,
    features: [
      'Complete platform access',
      'FreightFlow RFx platform',
      'All premium features',
      'Advanced AI automation',
      'Priority support & training',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'White-label options',
      '📞 Unlimited phone minutes',
      '📱 Unlimited SMS messages',
      '📊 Enterprise call center features',
      '🏢 Multi-tenant phone management',
    ],
    cta: 'Go Enterprise',
    gradient: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
    borderColor: '#9333ea',
    ctaColor: '#9333ea',
  },
  {
    id: 'brokerage',
    name: 'Professional Brokerage',
    price: 289,
    period: '/month',
    description:
      'Advanced brokerage operations + comprehensive phone system included',
    icon: Building,
    popular: true,
    features: [
      'Advanced brokerage operations',
      'Load board management',
      'Load & customer management',
      'Revenue analytics dashboard',
      'AI-powered optimization',
      'Performance tracking',
      'Priority support',
      'Mobile app access',
      '📞 500 phone minutes included',
      '📱 200 SMS messages included',
      '📊 Advanced call monitoring included',
      '📞 CRM phone integration included',
    ],
    cta: 'Start Brokering',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    borderColor: '#10b981',
    ctaColor: '#10b981',
  },
];

export default function FleetFlowPlansPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>(
    'monthly'
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: 'white',
        padding: '0',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* Hero Header */}
      <div
        style={{
          textAlign: 'center',
          padding: '80px 20px 60px',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            fontWeight: '900',
            background:
              'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
          }}
        >
          FleetFlow Business Intelligence
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '800px',
            margin: '0 auto 32px',
            lineHeight: '1.6',
          }}
        >
          The complete transportation management ecosystem for professional
          dispatchers, brokers, and enterprise fleets. Transform your operations
          with AI-powered automation and enterprise-grade tools.
          <br />
          <span style={{ color: '#3b82f6', fontWeight: '600' }}>
            Start your 14-day free trial - no credit card required.
          </span>
        </p>

        {/* Billing Toggle */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              color:
                billingPeriod === 'monthly'
                  ? '#3b82f6'
                  : 'rgba(255,255,255,0.6)',
              fontWeight: '600',
            }}
          >
            Monthly
          </span>
          <button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === 'monthly' ? 'annual' : 'monthly'
              )
            }
            style={{
              width: '56px',
              height: '28px',
              borderRadius: '14px',
              border: 'none',
              background:
                billingPeriod === 'annual'
                  ? '#3b82f6'
                  : 'rgba(255,255,255,0.2)',
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '12px',
                background: 'white',
                position: 'absolute',
                top: '2px',
                left: billingPeriod === 'annual' ? '30px' : '2px',
                transition: 'all 0.3s ease',
              }}
            />
          </button>
          <span
            style={{
              color:
                billingPeriod === 'annual'
                  ? '#3b82f6'
                  : 'rgba(255,255,255,0.6)',
              fontWeight: '600',
            }}
          >
            Annual
          </span>
          {billingPeriod === 'annual' && (
            <span
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                padding: '6px 16px',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700',
                marginLeft: '8px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              }}
            >
              💰 Save 17% (2 months FREE!)
            </span>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
        }}
      >
        {ENTERPRISE_PLANS.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: `2px solid ${plan.popular ? plan.borderColor : 'rgba(255,255,255,0.1)'}`,
              padding: '40px',
              position: 'relative',
              transition: 'all 0.4s ease',
              boxShadow: plan.popular
                ? `0 20px 60px rgba(249, 115, 34, 0.2)`
                : '0 10px 40px rgba(0,0,0,0.2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.border = `2px solid ${plan.borderColor}`;
              e.currentTarget.style.boxShadow = `0 25px 80px rgba(${
                plan.id === 'dispatcher'
                  ? '59, 130, 246'
                  : plan.id === 'brokerage'
                    ? '16, 185, 129'
                    : plan.id === 'enterprise'
                      ? '147, 51, 234'
                      : '245, 158, 11'
              }, 0.3)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.border = `2px solid ${plan.popular ? plan.borderColor : 'rgba(255,255,255,0.1)'}`;
              e.currentTarget.style.boxShadow = plan.popular
                ? `0 20px 60px rgba(16, 185, 129, 0.2)`
                : '0 10px 40px rgba(0,0,0,0.2)';
            }}
          >
            {/* Popular Badge */}
            {plan.popular && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: plan.gradient,
                  color: 'white',
                  padding: '8px 24px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
                }}
              >
                <Star size={16} fill='currentColor' />
                Most Popular
              </div>
            )}

            {/* Plan Header */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: plan.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: `0 10px 30px rgba(${
                    plan.id === 'dispatcher'
                      ? '59, 130, 246'
                      : plan.id === 'brokerage'
                        ? '16, 185, 129'
                        : plan.id === 'enterprise'
                          ? '147, 51, 234'
                          : '245, 158, 11'
                  }, 0.3)`,
                }}
              >
                <plan.icon size={36} color='white' />
              </div>

              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                {plan.name}
              </h3>

              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  marginBottom: '24px',
                }}
              >
                {plan.description}
              </p>

              {/* Pricing */}
              <div style={{ marginBottom: '24px' }}>
                <div
                  style={{
                    fontSize: '2.6rem',
                    fontWeight: '900',
                    color: 'white',
                    lineHeight: '1',
                    marginBottom: '4px',
                  }}
                >
                  {billingPeriod === 'annual'
                    ? `$${Math.round(plan.price * 10).toLocaleString()}` // 10 months pricing (2 months free)
                    : `Starting at $${plan.price}`}
                  <span
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '500',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {billingPeriod === 'annual' ? '/year' : '/month'}
                  </span>
                </div>
                {billingPeriod === 'annual' && (
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '8px',
                    }}
                  >
                    ${plan.price}/month billed annually
                    <br />
                    <span style={{ color: '#10b981', fontWeight: '600' }}>
                      💰 Save ${plan.price * 2}/year (2 months free!)
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <Link href='/user-profile'>
                <button
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    background: plan.gradient,
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '32px',
                    boxShadow: `0 8px 25px rgba(${
                      plan.id === 'dispatcher'
                        ? '59, 130, 246'
                        : plan.id === 'brokerage'
                          ? '16, 185, 129'
                          : plan.id === 'enterprise'
                            ? '147, 51, 234'
                            : '245, 158, 11'
                    }, 0.3)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 12px 35px rgba(${
                      plan.id === 'dispatcher'
                        ? '59, 130, 246'
                        : plan.id === 'brokerage'
                          ? '16, 185, 129'
                          : plan.id === 'enterprise'
                            ? '147, 51, 234'
                            : '245, 158, 11'
                    }, 0.4)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0px)';
                    e.currentTarget.style.boxShadow = `0 8px 25px rgba(${
                      plan.id === 'dispatcher'
                        ? '59, 130, 246'
                        : plan.id === 'brokerage'
                          ? '16, 185, 129'
                          : plan.id === 'enterprise'
                            ? '147, 51, 234'
                            : '245, 158, 11'
                    }, 0.3)`;
                  }}
                >
                  {plan.cta}
                  <ArrowRight size={20} />
                </button>
              </Link>
            </div>

            {/* Features List */}
            <div>
              <h4
                style={{
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Everything Included:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {plan.features.map((feature, index) => {
                  const isPhoneFeature =
                    feature.includes('📞') ||
                    feature.includes('📱') ||
                    feature.includes('📊') ||
                    feature.includes('🏢');
                  return (
                    <li
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '12px',
                        color: isPhoneFeature
                          ? '#34d399'
                          : 'rgba(255,255,255,0.8)',
                        fontSize: '0.95rem',
                        fontWeight: isPhoneFeature ? '600' : '400',
                        background: isPhoneFeature
                          ? 'rgba(52, 211, 153, 0.1)'
                          : 'transparent',
                        padding: isPhoneFeature ? '8px 12px' : '0',
                        borderRadius: isPhoneFeature ? '8px' : '0',
                        border: isPhoneFeature
                          ? '1px solid rgba(52, 211, 153, 0.2)'
                          : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '10px',
                          background: isPhoneFeature
                            ? 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'
                            : plan.gradient,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={12} color='white' />
                      </div>
                      {feature}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Phone System Add-Ons Section */}
      <div
        style={{
          background: 'rgba(52, 211, 153, 0.02)',
          borderTop: '1px solid rgba(52, 211, 153, 0.1)',
          padding: '80px 20px',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                color: 'white',
                marginBottom: '20px',
              }}
            >
              📞 FleetFlow Phone System Add-Ons
            </h2>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '40px',
              }}
            >
              Add professional phone capabilities to any subscription plan.
              <br />
              <span style={{ color: '#34d399', fontWeight: '600' }}>
                Multi-tenant support • CRM integration • Real-time monitoring
              </span>
            </p>
          </div>

          {/* Phone System Features Highlight */}
          <div
            style={{
              background: 'rgba(52, 211, 153, 0.08)',
              border: '1px solid rgba(52, 211, 153, 0.2)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '40px',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: '#34d399',
                  marginBottom: '12px',
                }}
              >
                🚀 NEW: Enhanced Phone System Features
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '16px',
                }}
              >
                Enhanced phone & SMS inclusions! Get up to{' '}
                <strong style={{ color: '#34d399' }}>
                  500 minutes + 200 SMS
                </strong>{' '}
                included with higher tier plans, or unlimited with Enterprise.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              {[
                '📞 Up to 500 minutes + 200 SMS included',
                '📊 Real-time call monitoring',
                '🤖 CRM integration & automation',
                '📱 Multi-tenant phone management',
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{
                    color: '#34d399',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              marginBottom: '40px',
            }}
          >
            {[
              {
                id: 'phone-basic',
                name: 'FleetFlow Phone Basic',
                price: '$39/month',
                description:
                  'Professional business phone system with call monitoring',
                features: [
                  'Company phone number',
                  'Professional caller ID',
                  'Basic call monitoring',
                  'Voicemail & transcription',
                  'Up to 5 users',
                  'Mobile app integration',
                ],
                gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                popular: false,
              },
              {
                id: 'phone-professional',
                name: 'FleetFlow Phone Professional',
                price: '$89/month',
                description:
                  'Advanced phone system with CRM integration and analytics',
                features: [
                  'Everything in Basic',
                  'CRM call integration',
                  'Call recording & storage',
                  'Real-time call monitoring',
                  'Call handoff management',
                  'Performance analytics',
                  'Up to 25 users',
                  'SMS capabilities',
                  'Call routing & IVR',
                ],
                gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                popular: true,
              },
              {
                id: 'phone-enterprise',
                name: 'FleetFlow Phone Enterprise',
                price: '$199/month',
                description:
                  'Complete enterprise phone solution with advanced features',
                features: [
                  'Everything in Professional',
                  'Unlimited users',
                  'Multi-tenant management',
                  'Advanced call analytics',
                  'Call center features',
                  'Auto-dialer & campaigns',
                  'Conference calling',
                  'WhiteLabel options',
                  'API access',
                  'Priority support',
                ],
                gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                popular: false,
              },
            ].map((addon) => (
              <div
                key={addon.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  border: `2px solid ${addon.popular ? '#34d399' : 'rgba(52, 211, 153, 0.2)'}`,
                  padding: '32px',
                  position: 'relative',
                  transition: 'all 0.4s ease',
                  boxShadow: addon.popular
                    ? '0 20px 60px rgba(52, 211, 153, 0.2)'
                    : '0 10px 40px rgba(0,0,0,0.2)',
                }}
              >
                {addon.popular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: addon.gradient,
                      color: 'white',
                      padding: '8px 24px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 8px 25px rgba(52, 211, 153, 0.4)',
                    }}
                  >
                    ⭐ Recommended
                  </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '20px',
                      background: addon.gradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '24px',
                    }}
                  >
                    📞
                  </div>

                  <h3
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '8px',
                    }}
                  >
                    {addon.name}
                  </h3>

                  <p
                    style={{
                      color: 'rgba(255,255,255,0.7)',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      marginBottom: '16px',
                    }}
                  >
                    {addon.description}
                  </p>

                  <div
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: '900',
                      color: '#34d399',
                      lineHeight: '1',
                      marginBottom: '24px',
                    }}
                  >
                    {addon.price}
                  </div>

                  <button
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: addon.gradient,
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '24px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Add to Plan
                  </button>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: '16px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Features:
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {addon.features.map((feature, index) => (
                      <li
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '8px',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.85rem',
                        }}
                      >
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '8px',
                            background: addon.gradient,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={10} color='white' />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <h4
              style={{
                fontSize: '1.2rem',
                fontWeight: '600',
                color: '#fbbf24',
                marginBottom: '12px',
              }}
            >
              💰 Usage-Based Pricing Available
            </h4>
            <p
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '1rem',
                marginBottom: '16px',
              }}
            >
              Prefer pay-per-use? <strong>$0.02/minute</strong> for outbound
              calls, <strong>$0.015/minute</strong> for inbound calls,{' '}
              <strong>$0.05/message</strong> for SMS.
              <br />
              Perfect for low-volume users with real-time usage tracking.
            </p>
          </div>
        </div>
      </div>

      {/* À La Carte Section */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '80px 20px',
        }}
      >
        <div
          style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}
        >
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            🎯 À La Carte Professional
          </h2>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
            }}
          >
            <strong style={{ color: '#3b82f6' }}>Starting at $59/month</strong>{' '}
            for Base Platform + Add only the modules you need
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {[
              { name: 'Dispatch Management +$99', color: '#3b82f6' },
              { name: 'CRM Suite +$79', color: '#06b6d4' },
              {
                name: 'RFx Discovery +$499 (Enterprise Only)',
                color: '#f59e0b',
              },
              { name: 'AI Flow Basic +$99', color: '#ec4899' },
              { name: 'Broker Operations +$199', color: '#10b981' },
              { name: 'Training +$49', color: '#f59e0b' },
              { name: 'Analytics +$89', color: '#667eea' },
              { name: 'Real-Time Tracking +$69', color: '#22c55e' },
              { name: 'API Access +$149', color: '#9333ea' },
              { name: '📞 Phone Basic +$39', color: '#34d399' },
              { name: '📞 Phone Professional +$89', color: '#34d399' },
              { name: '📞 Phone Enterprise +$199', color: '#34d399' },
              { name: '📞 Phone Usage $0.02/min', color: '#34d399' },
            ].map((module, index) => (
              <div
                key={index}
                style={{
                  background: `rgba(${
                    module.color === '#3b82f6'
                      ? '59, 130, 246'
                      : module.color === '#06b6d4'
                        ? '6, 182, 212'
                        : module.color === '#f59e0b'
                          ? '245, 158, 11'
                          : module.color === '#ec4899'
                            ? '236, 72, 153'
                            : module.color === '#9333ea'
                              ? '147, 51, 234'
                              : module.color === '#10b981'
                                ? '16, 185, 129'
                                : module.color === '#667eea'
                                  ? '102, 126, 234'
                                  : module.color === '#22c55e'
                                    ? '34, 197, 94'
                                    : module.color === '#34d399'
                                      ? '52, 211, 153'
                                      : '59, 130, 246'
                  }, 0.1)`,
                  border: `1px solid rgba(${
                    module.color === '#3b82f6'
                      ? '59, 130, 246'
                      : module.color === '#06b6d4'
                        ? '6, 182, 212'
                        : module.color === '#f59e0b'
                          ? '245, 158, 11'
                          : module.color === '#ec4899'
                            ? '236, 72, 153'
                            : module.color === '#9333ea'
                              ? '147, 51, 234'
                              : module.color === '#10b981'
                                ? '16, 185, 129'
                                : module.color === '#667eea'
                                  ? '102, 126, 234'
                                  : module.color === '#22c55e'
                                    ? '34, 197, 94'
                                    : module.color === '#34d399'
                                      ? '52, 211, 153'
                                      : '59, 130, 246'
                  }, 0.3)`,
                  borderRadius: '12px',
                  padding: '16px',
                  color: module.color,
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${
                    module.color === '#3b82f6'
                      ? '59, 130, 246'
                      : module.color === '#06b6d4'
                        ? '6, 182, 212'
                        : module.color === '#f59e0b'
                          ? '245, 158, 11'
                          : module.color === '#ec4899'
                            ? '236, 72, 153'
                            : module.color === '#9333ea'
                              ? '147, 51, 234'
                              : module.color === '#10b981'
                                ? '16, 185, 129'
                                : module.color === '#667eea'
                                  ? '102, 126, 234'
                                  : module.color === '#22c55e'
                                    ? '34, 197, 94'
                                    : module.color === '#34d399'
                                      ? '52, 211, 153'
                                      : '59, 130, 246'
                  }, 0.2)`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${
                    module.color === '#3b82f6'
                      ? '59, 130, 246'
                      : module.color === '#06b6d4'
                        ? '6, 182, 212'
                        : module.color === '#f59e0b'
                          ? '245, 158, 11'
                          : module.color === '#ec4899'
                            ? '236, 72, 153'
                            : module.color === '#9333ea'
                              ? '147, 51, 234'
                              : module.color === '#10b981'
                                ? '16, 185, 129'
                                : module.color === '#667eea'
                                  ? '102, 126, 234'
                                  : module.color === '#22c55e'
                                    ? '34, 197, 94'
                                    : module.color === '#34d399'
                                      ? '52, 211, 153'
                                      : '59, 130, 246'
                  }, 0.1)`;
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                {module.name}
              </div>
            ))}
          </div>

          <Link href='/user-profile'>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              }}
            >
              Build Custom Plan
            </button>
          </Link>
        </div>
      </div>

      {/* Enterprise Solutions */}
      <div
        style={{
          background: 'rgba(147, 51, 234, 0.05)',
          borderTop: '1px solid rgba(147, 51, 234, 0.2)',
          padding: '80px 20px',
        }}
      >
        <div
          style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}
        >
          <Shield size={80} color='#9333ea' style={{ marginBottom: '24px' }} />
          <h2
            style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              color: 'white',
              marginBottom: '20px',
            }}
          >
            🏢 Enterprise Solutions
          </h2>
          <p
            style={{
              fontSize: '1.3rem',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '32px',
              lineHeight: '1.6',
            }}
          >
            <strong style={{ color: '#9333ea' }}>$4,999 - $9,999+/month</strong>
            <br />
            Custom enterprise deployments with dedicated account management,
            white-label branding, and 24/7 priority support.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '40px',
            }}
          >
            {[
              'Dedicated account management',
              'Custom integrations & workflows',
              'White-label branding options',
              '24/7 priority support',
              'On-premise deployment',
              'Multi-location fleet management',
              'Advanced compliance automation',
              'Custom training programs',
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.95rem',
                }}
              >
                <Check size={16} color='#9333ea' />
                {feature}
              </div>
            ))}
          </div>

          <button
            style={{
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(147, 51, 234, 0.3)',
            }}
          >
            Contact Enterprise Sales
          </button>
        </div>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '60px 20px',
          textAlign: 'center',
        }}
      >
        <h3
          style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
          }}
        >
          Ready to Transform Your Transportation Business?
        </h3>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '32px',
          }}
        >
          Join thousands of professionals who trust FleetFlow for their
          transportation needs.
        </p>
        <Link href='/user-profile'>
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              padding: '20px 40px',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            🚀 Start 14-Day Free Trial
            <ArrowRight size={24} />
          </button>
        </Link>
      </div>
    </div>
  );
}
