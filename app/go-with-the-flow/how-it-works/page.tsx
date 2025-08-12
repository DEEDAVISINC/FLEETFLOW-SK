'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function GoWithTheFlowHowItWorks() {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444)',
            }}
          />

          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚛⚡</div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Go with the Flow™
          </h1>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '24px',
            }}
          >
            Intelligent Freight Matching - How It Works
          </h2>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '800px',
              margin: '0 auto',
              lineHeight: '1.6',
            }}
          >
            Instant freight matching powered by AI, real-time driver networks,
            and dynamic pricing. Connect shippers with available drivers in
            minutes, not hours.
          </p>

          <Link href='/go-with-the-flow'>
            <button
              style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              ← Back to Go with the Flow
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {[
              { key: 'overview', label: '🎯 System Overview', icon: '🎯' },
              { key: 'shippers', label: '📦 For Shippers', icon: '📦' },
              { key: 'drivers', label: '🚛 For Drivers', icon: '🚛' },
              { key: 'technology', label: '🤖 AI Technology', icon: '🤖' },
              { key: 'pricing', label: '💰 Dynamic Pricing', icon: '💰' },
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                style={{
                  background:
                    activeSection === section.key
                      ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                      : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  color: 'white',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '14px',
                }}
              >
                {section.icon} {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            minHeight: '600px',
          }}
        >
          {/* System Overview */}
          {activeSection === 'overview' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                🎯 How Go with the Flow Works
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {[
                  {
                    step: '1',
                    title: 'Shipper Requests Service',
                    description:
                      'Customer submits freight request with pickup/delivery details, equipment needs, and urgency level',
                    icon: '📦',
                    color: '#3b82f6',
                  },
                  {
                    step: '2',
                    title: 'AI Generates Quotes',
                    description:
                      'Our AI analyzes market conditions, fuel costs, and carrier availability to generate intelligent pricing',
                    icon: '🤖',
                    color: '#8b5cf6',
                  },
                  {
                    step: '3',
                    title: 'Driver Matching',
                    description:
                      'System finds available drivers within range who meet equipment and rate requirements',
                    icon: '🎯',
                    color: '#10b981',
                  },
                  {
                    step: '4',
                    title: 'Instant Offers',
                    description:
                      'Qualified drivers receive push notifications with load details and 5-minute acceptance window',
                    icon: '⚡',
                    color: '#f59e0b',
                  },
                  {
                    step: '5',
                    title: 'Live Tracking',
                    description:
                      'Once accepted, real-time GPS tracking begins with automatic customer notifications',
                    icon: '📍',
                    color: '#ef4444',
                  },
                  {
                    step: '6',
                    title: 'Automated Settlement',
                    description:
                      'Delivery confirmation triggers automatic invoicing and payment processing',
                    icon: '💳',
                    color: '#ec4899',
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: step.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '800',
                        color: 'white',
                      }}
                    >
                      {step.step}
                    </div>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                      {step.icon}
                    </div>
                    <h4
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '12px',
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        lineHeight: '1.5',
                        fontSize: '14px',
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Key Benefits */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <h4
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#10b981',
                    marginBottom: '16px',
                  }}
                >
                  ⚡ Why Go with the Flow?
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {[
                    '🕐 Average match time: 2-5 minutes',
                    '💰 Dynamic pricing saves 15-25%',
                    '📱 Real-time tracking & notifications',
                    '🎯 98.5% successful match rate',
                    '🚛 All equipment types available',
                    '⭐ Mutual rating system',
                  ].map((benefit, index) => (
                    <div
                      key={index}
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* For Shippers Section */}
          {activeSection === 'shippers' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                📦 For Shippers - Request Trucks Instantly
              </h3>

              <div style={{ display: 'grid', gap: '24px' }}>
                {[
                  {
                    title: '🚀 Instant Request Process',
                    content: [
                      '1. Enter pickup and delivery locations',
                      '2. Select equipment type (Dry Van, Reefer, Flatbed, etc.)',
                      '3. Specify weight, dimensions, and urgency',
                      '4. Get AI-generated quotes in under 30 seconds',
                      '5. Choose your preferred service level and rate',
                      '6. Receive driver assignment and tracking info',
                    ],
                  },
                  {
                    title: '💰 Transparent Pricing',
                    content: [
                      'Base rate calculated by distance and weight',
                      'Dynamic adjustments based on supply/demand',
                      'Urgency multipliers for time-sensitive loads',
                      'No hidden fees - see total cost upfront',
                      'Competitive rates with market analysis',
                      'Multiple service levels to fit your budget',
                    ],
                  },
                  {
                    title: '📍 Real-Time Tracking',
                    content: [
                      'Live GPS tracking from pickup to delivery',
                      'Automatic status updates via SMS/email',
                      'ETA calculations with traffic adjustments',
                      'Proof of delivery with photos and signatures',
                      'Customer portal access for 24/7 visibility',
                      'Exception alerts for delays or issues',
                    ],
                  },
                  {
                    title: '🛡️ Service Guarantees',
                    content: [
                      'Verified drivers with background checks',
                      'Insurance coverage on all shipments',
                      'On-time delivery guarantee',
                      '24/7 customer support',
                      'Damage protection and claims handling',
                      'Satisfaction guarantee or refund',
                    ],
                  },
                ].map((section, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '16px',
                      }}
                    >
                      {section.title}
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {section.content.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            padding: '8px 0',
                            borderBottom:
                              itemIndex < section.content.length - 1
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : 'none',
                          }}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* For Drivers Section */}
          {activeSection === 'drivers' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                🚛 For Drivers - Earn More, Drive Smart
              </h3>

              <div style={{ display: 'grid', gap: '24px' }}>
                {[
                  {
                    title: '📱 Mobile App Features',
                    content: [
                      'Go Online/Offline with one tap',
                      'Receive instant load offers with push notifications',
                      '5-minute acceptance window for each offer',
                      'See full load details before accepting',
                      'Real-time earnings tracking',
                      'Trip history and performance analytics',
                    ],
                  },
                  {
                    title: '💵 Maximized Earnings',
                    content: [
                      'Dynamic pricing means higher rates during peak demand',
                      'No deadhead miles - loads matched to your location',
                      'Preference settings for minimum rates and max distance',
                      'Auto-accept feature for trusted load types',
                      'Weekly direct deposit payments',
                      'Fuel card integration and discounts',
                    ],
                  },
                  {
                    title: '🎯 Smart Matching',
                    content: [
                      'AI matches loads based on your location and preferences',
                      'Equipment type matching (your trailer = right loads)',
                      'Hours of service compliance built-in',
                      'Route optimization to maximize efficiency',
                      'Load clustering for multiple pickup/delivery',
                      'Weather and traffic consideration',
                    ],
                  },
                  {
                    title: '🛡️ Driver Protection',
                    content: [
                      'Verified shippers and legitimate loads only',
                      'Insurance coverage during transport',
                      'Roadside assistance program',
                      'Legal support for disputes',
                      'Safety rating system protects good drivers',
                      '24/7 dispatcher support',
                    ],
                  },
                ].map((section, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      padding: '24px',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '16px',
                      }}
                    >
                      {section.title}
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {section.content.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            padding: '8px 0',
                            borderBottom:
                              itemIndex < section.content.length - 1
                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                : 'none',
                          }}
                        >
                          • {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Technology Section */}
          {activeSection === 'technology' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                🤖 AI-Powered Freight Intelligence
              </h3>

              <div style={{ display: 'grid', gap: '24px' }}>
                {[
                  {
                    title: '🧠 Intelligent Matching Algorithm',
                    description:
                      'Our AI considers dozens of factors to find the perfect driver-load match',
                    features: [
                      'Driver location and route preferences',
                      'Equipment type and availability',
                      'Historical performance and ratings',
                      'Hours of service compliance',
                      'Fuel efficiency and route optimization',
                      'Weather and traffic conditions',
                    ],
                    confidence: '95%',
                  },
                  {
                    title: '📊 Market Analysis Engine',
                    description:
                      'Real-time market intelligence drives competitive pricing',
                    features: [
                      'Supply and demand calculations',
                      'Competitor rate analysis',
                      'Seasonal pricing adjustments',
                      'Fuel cost integration',
                      'Regional market conditions',
                      'Customer demand patterns',
                    ],
                    confidence: '92%',
                  },
                  {
                    title: '🔮 Predictive Analytics',
                    description:
                      'AI learns from every transaction to improve future matches',
                    features: [
                      'Driver acceptance probability',
                      'Delivery time predictions',
                      'Route optimization suggestions',
                      'Maintenance scheduling alerts',
                      'Customer satisfaction forecasting',
                      'Revenue optimization recommendations',
                    ],
                    confidence: '88%',
                  },
                ].map((tech, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '16px',
                      padding: '24px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.4)',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#8b5cf6',
                      }}
                    >
                      {tech.confidence} Accuracy
                    </div>
                    <h4
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        marginBottom: '12px',
                      }}
                    >
                      {tech.title}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '16px',
                        lineHeight: '1.5',
                      }}
                    >
                      {tech.description}
                    </p>
                    <div style={{ display: 'grid', gap: '6px' }}>
                      {tech.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <div
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#8b5cf6',
                            }}
                          />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Pricing Section */}
          {activeSection === 'pricing' && (
            <div>
              <h3
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  textAlign: 'center',
                }}
              >
                💰 Dynamic Pricing System
              </h3>

              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Pricing Factors */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#f59e0b',
                      marginBottom: '16px',
                    }}
                  >
                    📈 Pricing Factors
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {[
                      {
                        factor: 'Supply & Demand',
                        description:
                          'More drivers online = lower prices. High demand = surge pricing.',
                        impact: 'Up to 200% adjustment',
                      },
                      {
                        factor: 'Urgency Level',
                        description:
                          'Standard, expedited, or emergency delivery requirements.',
                        impact: '10-25% premium',
                      },
                      {
                        factor: 'Distance & Route',
                        description:
                          'Mileage, traffic conditions, and route complexity.',
                        impact: '$1.50-$3.50/mile',
                      },
                      {
                        factor: 'Equipment Type',
                        description:
                          'Specialized equipment commands premium rates.',
                        impact: '15-40% premium',
                      },
                      {
                        factor: 'Market Conditions',
                        description:
                          'Fuel costs, seasonal demand, regional factors.',
                        impact: '5-15% adjustment',
                      },
                      {
                        factor: 'Driver Quality',
                        description:
                          'Top-rated drivers with excellent safety records.',
                        impact: '10-20% premium',
                      },
                    ].map((pricing, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: 'white',
                            marginBottom: '8px',
                          }}
                        >
                          {pricing.factor}
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '8px',
                            lineHeight: '1.4',
                          }}
                        >
                          {pricing.description}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            color: '#f59e0b',
                            fontWeight: '600',
                          }}
                        >
                          Impact: {pricing.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Levels */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Service Level Options
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {[
                      {
                        level: 'Economy',
                        multiplier: '0.8x',
                        features: [
                          'Basic tracking',
                          'Standard insurance',
                          'Email support',
                        ],
                        timeline: '+1 day delivery',
                        color: '#6b7280',
                      },
                      {
                        level: 'Standard',
                        multiplier: '1.0x',
                        features: [
                          'Standard tracking',
                          'Basic insurance',
                          'Business hours support',
                        ],
                        timeline: 'Standard delivery',
                        color: '#3b82f6',
                      },
                      {
                        level: 'Premium',
                        multiplier: '1.4x',
                        features: [
                          'Real-time tracking',
                          'Full insurance',
                          '24/7 support',
                        ],
                        timeline: '-1 day delivery',
                        color: '#10b981',
                      },
                    ].map((service, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `2px solid ${service.color}`,
                          borderRadius: '12px',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '700',
                            color: service.color,
                            marginBottom: '8px',
                          }}
                        >
                          {service.level}
                        </div>
                        <div
                          style={{
                            fontSize: '24px',
                            fontWeight: '800',
                            color: 'white',
                            marginBottom: '12px',
                          }}
                        >
                          {service.multiplier} Base Rate
                        </div>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '12px',
                          }}
                        >
                          {service.timeline}
                        </div>
                        <div style={{ display: 'grid', gap: '6px' }}>
                          {service.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              • {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            marginTop: '32px',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '16px',
            }}
          >
            🚀 Ready to Experience the Future of Freight?
          </h3>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '24px',
              maxWidth: '600px',
              margin: '0 auto 24px auto',
            }}
          >
            Join the Go with the Flow network and see why thousands of shippers
            and drivers choose our AI-powered platform for faster, smarter
            freight solutions.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href='/go-with-the-flow'>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🚀 Start Shipping Now
              </button>
            </Link>
            <Link href='/drivers'>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                🚛 Join as Driver
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
