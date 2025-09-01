'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FLEETFLOW_PRICING_PLANS } from '../services/stripe/StripeService';

// FleetFlow interfaces
interface FleetMetrics {
  totalRevenue: string;
  costSavings: string;
  roiPercentage: number;
  paybackMonths: number;
}

export default function FleetFlowPricingDashboard() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'tms'
    | 'brokers'
    | 'dispatchers'
    | 'consortium'
    | 'compliance'
    | 'addons'
    | 'billing'
  >('overview');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [fleetSize, setFleetSize] = useState(50);
  const [currentCosts, setCurrentCosts] = useState(25000);
  const [metrics, setMetrics] = useState<FleetMetrics>({
    totalRevenue: '$0',
    costSavings: '$0',
    roiPercentage: 0,
    paybackMonths: 0,
  });

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const monthlySavings = currentCosts * 0.23 + fleetSize * 340;
    const annualSavings = monthlySavings * 12;
    const platformCost = Math.min(50000, Math.max(15000, fleetSize * 299));
    const roi = ((annualSavings - platformCost) / platformCost) * 100;
    const payback = platformCost / monthlySavings;

    setMetrics({
      totalRevenue: `$${(annualSavings * 3).toLocaleString()}`,
      costSavings: `$${annualSavings.toLocaleString()}`,
      roiPercentage: Math.round(roi),
      paybackMonths: Math.round(payback),
    });
  }, [fleetSize, currentCosts]);

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Professional Header - EXACT FleetFlow Style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              FleetFlow Subscription Center℠
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Trusted by Fortune 500 companies to manage $250B+ in logistics
              operations • {currentTime?.toLocaleString() || '--'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href='/' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                🏠 Dashboard
              </button>
            </Link>
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold for call-to-action
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              📞 Schedule Demo
            </button>
          </div>
        </div>
      </div>

      {/* Executive KPIs - EXACT FleetFlow Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Logistics Value */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '5px',
            }}
          >
            $250B+
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Logistics Value Managed
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +12% from last year
          </div>
        </div>

        {/* Customers */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🏢</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '5px',
            }}
          >
            2,847
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Customers
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +347 this quarter
          </div>
        </div>

        {/* Platform Uptime */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⚡</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '5px',
            }}
          >
            99.99%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Platform Uptime
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            Industry leading
          </div>
        </div>
      </div>

      {/* Quick Links - EXACT FleetFlow Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {[
          {
            id: 'overview',
            label: '🏠 Overview',
            bg: 'linear-gradient(135deg, #1e40af, #1e3a8a)', // Darker blue
            color: 'white',
          },
          {
            id: 'tms',
            label: '🚛 TMS Platform',
            bg: 'linear-gradient(135deg, #f7c52d, #f4a832)', // DRIVER MANAGEMENT yellow
            color: '#2d3748',
          },
          {
            id: 'brokers',
            label: '🏢 Brokers',
            bg: 'linear-gradient(135deg, #f97316, #ea580c)', // RESOURCES orange
            color: 'white',
          },
          {
            id: 'dispatchers',
            label: '📡 Dispatchers',
            bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', // Professional blue
            color: 'white',
          },
          {
            id: 'consortium',
            label: '📊 Data Consortium',
            bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', // ANALYTICS purple
            color: 'white',
          },
          {
            id: 'compliance',
            label: '⚖️ Compliance',
            bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', // COMPLIANCE red
            color: 'white',
          },
          {
            id: 'addons',
            label: '🛠️ À La Carte',
            bg: 'linear-gradient(135deg, #14b8a6, #0d9488)', // Teal for add-ons
            color: 'white',
          },
          {
            id: 'billing',
            label: '💳 Billing',
            bg: 'linear-gradient(135deg, #059669, #047857)', // Green for billing
            color: 'white',
          },
        ].map((link, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(link.id as any)}
            style={{
              background: link.bg,
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow:
                activeTab === link.id
                  ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              border:
                activeTab === link.id
                  ? '2px solid rgba(255, 255, 255, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
              transform: activeTab === link.id ? 'translateY(-5px)' : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== link.id) {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow =
                  '0 6px 15px rgba(0, 0, 0, 0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== link.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
              {link.label.split(' ')[0]}
            </div>
            <div
              style={{
                fontSize: '1rem',
                fontWeight: '700',
                color: link.color,
              }}
            >
              {link.label.substring(link.label.indexOf(' ') + 1)}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area - EXACT FleetFlow Style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '25px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                🎯 Popular Plans & ROI Calculator
              </h2>
            </div>

            {/* ROI Calculator */}
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '25px',
                marginBottom: '25px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                📊 ROI Calculator
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr',
                  gap: '25px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Fleet Size: {fleetSize} vehicles
                    </label>
                    <input
                      type='range'
                      min='10'
                      max='1000'
                      value={fleetSize}
                      onChange={(e) => setFleetSize(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        height: '6px',
                        borderRadius: '3px',
                        background: 'rgba(255,255,255,0.3)',
                        outline: 'none',
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      Current Monthly Costs
                    </label>
                    <input
                      type='number'
                      value={currentCosts}
                      onChange={(e) =>
                        setCurrentCosts(parseInt(e.target.value) || 0)
                      }
                      style={{
                        width: '100%',
                        padding: '10px',
                        fontSize: '14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                      }}
                      placeholder='$25,000'
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '15px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '5px',
                      }}
                    >
                      {metrics.roiPercentage}%
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Annual ROI
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '5px',
                      }}
                    >
                      {metrics.paybackMonths}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Months Payback
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#f59e0b',
                        marginBottom: '5px',
                      }}
                    >
                      {metrics.costSavings}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Annual Savings
                    </div>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '5px',
                      }}
                    >
                      {metrics.totalRevenue}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      3-Year Value
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Plans Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                Object.values(FLEETFLOW_PRICING_PLANS).find(
                  (p) => p.id === 'dispatcher_pro'
                ),
                Object.values(FLEETFLOW_PRICING_PLANS).find(
                  (p) => p.id === 'broker_elite'
                ),
                Object.values(FLEETFLOW_PRICING_PLANS).find(
                  (p) => p.id === 'enterprise_professional'
                ),
              ]
                .filter(Boolean)
                .map((plan, index) => (
                  <div
                    key={plan!.id}
                    onClick={() => handlePlanChange(plan!.id)}
                    style={{
                      background:
                        index === 2
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border:
                        index === 2
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {index === 2 && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold/orange for highlights
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        ⭐ MOST POPULAR
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {plan!.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: index === 2 ? '#60a5fa' : '#3b82f6',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          display: 'block',
                          marginBottom: '4px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {plan!.priceType === 'custom'
                          ? 'custom pricing'
                          : plan!.priceType === 'starts_at'
                            ? 'starts at'
                            : 'from'}
                      </span>
                      {plan!.priceType === 'custom' ? (
                        'Contact Sales'
                      ) : (
                        <>
                          ${plan!.price.toLocaleString()}
                          <span
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            /{plan!.interval}
                          </span>
                        </>
                      )}
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 15px 0',
                        textAlign: 'left',
                      }}
                    >
                      {plan!.features.slice(0, 4).map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '6px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                      {plan!.features.length > 4 && (
                        <li
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}
                        >
                          +{plan!.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                    <button
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          index === 2
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for selected
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)', // FleetFlow blue for unselected
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedPlan === plan!.id
                        ? '✓ Selected'
                        : plan!.priceType === 'custom'
                          ? 'Contact Sales'
                          : 'Select Plan'}
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* TMS Platform Tab */}
        {activeTab === 'tms' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🚛 Transportation Management Platform
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter((plan) => plan.category === 'TMS')
                .map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id)}
                    style={{
                      background:
                        plan.id === 'enterprise_professional'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border:
                        plan.id === 'enterprise_professional'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {plan.id === 'enterprise_professional' && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold/orange for highlights
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color:
                          plan.id === 'enterprise_professional'
                            ? '#60a5fa'
                            : '#3b82f6',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          display: 'block',
                          marginBottom: '4px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {plan.priceType === 'custom'
                          ? 'custom pricing'
                          : plan.priceType === 'starts_at'
                            ? 'starts at'
                            : 'from'}
                      </span>
                      {plan.priceType === 'custom' ? (
                        'Contact Sales'
                      ) : (
                        <>
                          ${plan.price.toLocaleString()}
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            /{plan.interval}
                          </span>
                        </>
                      )}
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 15px 0',
                        textAlign: 'left',
                      }}
                    >
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}
                        >
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          plan.id === 'enterprise_professional'
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for recommended
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)', // FleetFlow blue for others
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedPlan === plan.id
                        ? '✓ Selected'
                        : plan.priceType === 'custom'
                          ? 'Contact Sales'
                          : 'Select Plan'}
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🏢 Freight Brokerage Solutions
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {['rfx_professional', 'broker_elite', 'ai_flow_professional'].map(
                (planId) => {
                  const plan = Object.values(FLEETFLOW_PRICING_PLANS).find(
                    (p) => p.id === planId
                  );
                  if (!plan) return null;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.id)}
                      style={{
                        background:
                          plan.id === 'broker_elite'
                            ? 'rgba(59, 130, 246, 0.2)'
                            : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border:
                          plan.id === 'broker_elite'
                            ? '1px solid rgba(59, 130, 246, 0.3)'
                            : '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      {plan.id === 'broker_elite' && (
                        <div
                          style={{
                            background:
                              'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            marginBottom: '15px',
                            display: 'inline-block',
                          }}
                        >
                          ⭐ RECOMMENDED
                        </div>
                      )}
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '10px',
                        }}
                      >
                        {plan.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color:
                            plan.id === 'broker_elite' ? '#60a5fa' : '#3b82f6',
                          marginBottom: '10px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '10px',
                            display: 'block',
                            marginBottom: '4px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            textTransform: 'uppercase',
                          }}
                        >
                          {plan.priceType === 'custom'
                            ? 'custom pricing'
                            : plan.priceType === 'starts_at'
                              ? 'starts at'
                              : 'from'}
                        </span>
                        ${plan.price.toLocaleString()}
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          /{plan.interval}
                        </span>
                      </div>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: '0 0 15px 0',
                          textAlign: 'left',
                        }}
                      >
                        {plan.features.slice(0, 3).map((feature, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '4px',
                              paddingLeft: '15px',
                              position: 'relative',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: 0,
                                color: '#10b981',
                                fontWeight: '600',
                              }}
                            >
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 3 && (
                          <li
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontStyle: 'italic',
                              textAlign: 'center',
                            }}
                          >
                            +{plan.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          background:
                            plan.id === 'broker_elite'
                              ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for recommended
                              : 'linear-gradient(135deg, #f97316, #ea580c)', // FleetFlow orange for brokers
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {selectedPlan === plan.id
                          ? '✓ Selected'
                          : 'Select Plan'}
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {/* Dispatchers Tab */}
        {activeTab === 'dispatchers' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              📡 Dispatch Management Solutions
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                'dispatcher_pro',
                'ai_flow_professional',
                'fleetflow_university',
              ].map((planId) => {
                const plan = Object.values(FLEETFLOW_PRICING_PLANS).find(
                  (p) => p.id === planId
                );
                if (!plan) return null;
                return (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id)}
                    style={{
                      background:
                        plan.id === 'dispatcher_pro'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border:
                        plan.id === 'dispatcher_pro'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {plan.id === 'dispatcher_pro' && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold/orange for highlights
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color:
                          plan.id === 'dispatcher_pro' ? '#60a5fa' : '#3b82f6',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          display: 'block',
                          marginBottom: '4px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                        }}
                      >
                        from
                      </span>
                      ${plan.price.toLocaleString()}
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        /{plan.interval}
                      </span>
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 15px 0',
                        textAlign: 'left',
                      }}
                    >
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}
                        >
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          plan.id === 'dispatcher_pro'
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for recommended
                            : 'linear-gradient(135deg, #3b82f6, #2563eb)', // Professional blue for dispatchers
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedPlan === plan.id ? '✓ Selected' : 'Select Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Data Consortium Tab */}
        {activeTab === 'consortium' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              📊 Data Consortium & Intelligence
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter((plan) => plan.category === 'CONSORTIUM')
                .map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id)}
                    style={{
                      background:
                        plan.id === 'consortium_professional'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border:
                        plan.id === 'consortium_professional'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {plan.id === 'consortium_professional' && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold/orange for highlights
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color:
                          plan.id === 'consortium_professional'
                            ? '#60a5fa'
                            : '#3b82f6',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          display: 'block',
                          marginBottom: '4px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {plan.priceType === 'custom'
                          ? 'custom pricing'
                          : plan.priceType === 'starts_at'
                            ? 'starts at'
                            : 'from'}
                      </span>
                      {plan.priceType === 'custom' ? (
                        'Contact Sales'
                      ) : (
                        <>
                          ${plan.price.toLocaleString()}
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            /{plan.interval}
                          </span>
                        </>
                      )}
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 15px 0',
                        textAlign: 'left',
                      }}
                    >
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}
                        >
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          plan.id === 'consortium_professional'
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for recommended
                            : 'linear-gradient(135deg, #6366f1, #4f46e5)', // FleetFlow purple for analytics/consortium
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedPlan === plan.id
                        ? '✓ Selected'
                        : plan.priceType === 'custom'
                          ? 'Contact Sales'
                          : 'Select Plan'}
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Compliance Tab */}
        {activeTab === 'compliance' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '25px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              ⚖️ DOT Compliance Solutions
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
              }}
            >
              {Object.values(FLEETFLOW_PRICING_PLANS)
                .filter((plan) => plan.category === 'COMPLIANCE')
                .map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handlePlanChange(plan.id)}
                    style={{
                      background:
                        plan.id === 'compliance_full'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      border:
                        plan.id === 'compliance_full'
                          ? '1px solid rgba(59, 130, 246, 0.3)'
                          : '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {plan.id === 'compliance_full' && (
                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold/orange for highlights
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          marginBottom: '15px',
                          display: 'inline-block',
                        }}
                      >
                        ⭐ RECOMMENDED
                      </div>
                    )}
                    <h3
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: 'white',
                        marginBottom: '10px',
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color:
                          plan.id === 'compliance_full' ? '#60a5fa' : '#3b82f6',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '10px',
                          display: 'block',
                          marginBottom: '4px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          textTransform: 'uppercase',
                        }}
                      >
                        {plan.priceType === 'custom'
                          ? 'custom pricing'
                          : plan.priceType === 'starts_at'
                            ? 'starts at'
                            : 'from'}
                      </span>
                      {plan.priceType === 'custom' ? (
                        'Contact Sales'
                      ) : (
                        <>
                          ${plan.price.toLocaleString()}
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            /{plan.interval}
                          </span>
                        </>
                      )}
                    </div>
                    <ul
                      style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 15px 0',
                        textAlign: 'left',
                      }}
                    >
                      {plan.features.slice(0, 3).map((feature, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '4px',
                            paddingLeft: '15px',
                            position: 'relative',
                          }}
                        >
                          <span
                            style={{
                              position: 'absolute',
                              left: 0,
                              color: '#10b981',
                              fontWeight: '600',
                            }}
                          >
                            ✓
                          </span>
                          {feature}
                        </li>
                      ))}
                      {plan.features.length > 3 && (
                        <li
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontStyle: 'italic',
                            textAlign: 'center',
                          }}
                        >
                          +{plan.features.length - 3} more features
                        </li>
                      )}
                    </ul>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          plan.id === 'compliance_full'
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)' // FleetFlow gold for recommended
                            : 'linear-gradient(135deg, #dc2626, #b91c1c)', // FleetFlow red for compliance
                        color: 'white',
                        textTransform: 'uppercase',
                      }}
                    >
                      {selectedPlan === plan.id
                        ? '✓ Selected'
                        : plan.priceType === 'custom'
                          ? 'Contact Sales'
                          : 'Select Plan'}
                    </button>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* À La Carte Tab */}
        {activeTab === 'addons' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🛠️ À La Carte Modules
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '25px',
              }}
            >
              Build your custom solution by starting with the Base Platform and
              adding modules as needed.
            </p>

            {/* Base Platform */}
            <div style={{ marginBottom: '25px' }}>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '15px',
                }}
              >
                🏗️ Base Platform (Required)
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  maxWidth: '300px',
                }}
              >
                {(() => {
                  const basePlan = Object.values(FLEETFLOW_PRICING_PLANS).find(
                    (p) => p.id === 'base_platform'
                  );
                  if (!basePlan) return null;
                  return (
                    <div
                      key={basePlan.id}
                      onClick={() => handlePlanChange(basePlan.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '10px',
                        }}
                      >
                        {basePlan.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#3b82f6',
                          marginBottom: '10px',
                        }}
                      >
                        ${basePlan.price}
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          /{basePlan.interval}
                        </span>
                      </div>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: '0 0 15px 0',
                          textAlign: 'left',
                        }}
                      >
                        {basePlan.features.slice(0, 3).map((feature, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '4px',
                              paddingLeft: '15px',
                              position: 'relative',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: 0,
                                color: '#10b981',
                                fontWeight: '600',
                              }}
                            >
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button
                        style={{
                          width: '100%',
                          padding: '8px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          background:
                            'linear-gradient(135deg, #6b7280, #4b5563)',
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {selectedPlan === basePlan.id
                          ? '✓ Selected'
                          : 'Select Plan'}
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Add-on Modules */}
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '15px',
                }}
              >
                ➕ Add-on Modules
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '15px',
                }}
              >
                {Object.values(FLEETFLOW_PRICING_PLANS)
                  .filter((plan) => plan.category === 'ADDON')
                  .map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => handlePlanChange(plan.id)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '15px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '8px',
                        }}
                      >
                        {plan.name}
                      </h3>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#3b82f6',
                          marginBottom: '8px',
                        }}
                      >
                        +${plan.price}
                        <span
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          /{plan.interval}
                        </span>
                      </div>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: '0 0 10px 0',
                          textAlign: 'left',
                        }}
                      >
                        {plan.features.slice(0, 2).map((feature, idx) => (
                          <li
                            key={idx}
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.8)',
                              marginBottom: '3px',
                              paddingLeft: '12px',
                              position: 'relative',
                            }}
                          >
                            <span
                              style={{
                                position: 'absolute',
                                left: 0,
                                color: '#10b981',
                                fontWeight: '600',
                              }}
                            >
                              ✓
                            </span>
                            {feature}
                          </li>
                        ))}
                        {plan.features.length > 2 && (
                          <li
                            style={{
                              fontSize: '9px',
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontStyle: 'italic',
                              textAlign: 'center',
                            }}
                          >
                            +{plan.features.length - 2} more
                          </li>
                        )}
                      </ul>
                      <button
                        style={{
                          width: '100%',
                          padding: '6px',
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          background:
                            'linear-gradient(135deg, #14b8a6, #0d9488)', // FleetFlow teal for add-ons
                          color: 'white',
                          textTransform: 'uppercase',
                        }}
                      >
                        {selectedPlan === plan.id ? '✓ Selected' : 'Add Module'}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              💳 Current Subscription & Billing
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '20px',
              }}
            >
              Your billing dashboard and subscription management tools will be
              available here. Contact your account manager for detailed billing
              information.
            </p>
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', // FleetFlow gold for call-to-action
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                transition: 'all 0.3s ease',
              }}
            >
              📞 Contact Account Manager
            </button>
          </>
        )}
      </div>
    </div>
  );
}
