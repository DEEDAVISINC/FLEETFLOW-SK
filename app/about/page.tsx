'use client';

import { useState } from 'react';

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', label: 'Agency Overview', icon: '🏢' },
    { id: 'intelligence', label: 'Logistics Intelligence', icon: '🧠' },
    { id: 'portfolio', label: 'Full-Service Portfolio', icon: '🛠️' },
    { id: 'technology', label: 'Technology Stack', icon: '⚡' },
    { id: 'leadership', label: 'Expert Team', icon: '👥' },
    { id: 'clients', label: 'Enterprise Clients', icon: '🏆' },
    { id: 'results', label: 'Proven Results', icon: '📈' },
    { id: 'global', label: 'Global Operations', icon: '🌍' },
    { id: 'innovation', label: 'Innovation Lab', icon: '🔬' },
    { id: 'partnerships', label: 'Strategic Partnerships', icon: '🤝' },
    { id: 'contact', label: 'Contact Us', icon: '📞' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
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
          Revolutionary logistics intelligence services transforming global
          supply chains through advanced AI, predictive analytics, and
          comprehensive operational insights.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}
            >
              $45B+
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Freight Volume Managed
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b' }}
            >
              2.5B+
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Daily Data Points
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}
            >
              Fortune 500
            </div>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
              Enterprise Clients
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 24px',
        }}
      >
        {/* Navigation Sidebar */}
        <div
          style={{
            width: '320px',
            marginRight: '40px',
            position: 'sticky',
            top: '40px',
            height: 'fit-content',
          }}
        >
          <nav
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: '#14b8a6',
                fontSize: '18px',
                margin: '0 0 20px 0',
                fontWeight: '600',
              }}
            >
              Agency Sections
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background:
                      activeSection === section.id
                        ? 'rgba(20, 184, 166, 0.2)'
                        : 'transparent',
                    color:
                      activeSection === section.id
                        ? '#14b8a6'
                        : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '500',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{section.icon}</span>
                  {section.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Agency Overview */}
          {activeSection === 'overview' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🏢 The Next One-Stop Logistics Intelligence Agency
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Agency Mission Statement */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🚀 Revolutionizing Global Logistics Intelligence
                  </h3>
                  <p style={{ marginBottom: '24px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> is the world&apos;s most
                    advanced logistics intelligence agency, providing
                    comprehensive end-to-end solutions that transform how
                    Fortune 500 companies, logistics providers, and supply chain
                    networks operate, optimize, and scale their operations.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    We combine decades of logistics expertise with cutting-edge
                    AI, machine learning, and predictive analytics to deliver
                    actionable intelligence across every aspect of the supply
                    chain - from strategic planning and route optimization to
                    real-time operational management and performance analytics.
                  </p>
                </div>

                {/* What Makes Us Different */}
                <h3
                  style={{
                    color: '#10b981',
                    fontSize: '26px',
                    margin: '0 0 32px 0',
                    fontWeight: '700',
                  }}
                >
                  💎 What Makes Us the Next-Generation Logistics Intelligence
                  Agency
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '24px',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#f59e0b',
                        fontSize: '22px',
                        margin: '0 0 16px 0',
                        fontWeight: '600',
                      }}
                    >
                      🧠 Comprehensive Intelligence Platform
                    </h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      Unlike traditional logistics providers, we deliver
                      complete intelligence solutions covering freight
                      optimization, supply chain analytics, predictive modeling,
                      risk assessment, performance monitoring, and strategic
                      planning in one integrated platform.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#8b5cf6',
                        fontSize: '22px',
                        margin: '0 0 16px 0',
                        fontWeight: '600',
                      }}
                    >
                      🎯 Full-Service Agency Model
                    </h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      We function as your complete logistics intelligence
                      department - providing dedicated specialists, custom
                      analytics solutions, 24/7 monitoring, strategic
                      consulting, and ongoing optimization services tailored to
                      your specific industry and operations.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        fontSize: '22px',
                        margin: '0 0 16px 0',
                        fontWeight: '600',
                      }}
                    >
                      ⚡ Real-Time Intelligence & Automation
                    </h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      Our platform processes 2.5+ billion data points daily,
                      providing real-time insights, automated decision-making,
                      predictive alerts, and continuous optimization that keeps
                      your logistics operations ahead of market conditions and
                      operational challenges.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#ef4444',
                        fontSize: '22px',
                        margin: '0 0 16px 0',
                        fontWeight: '600',
                      }}
                    >
                      🌍 Global Scale & Enterprise Integration
                    </h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      Seamless integration with existing enterprise systems
                      (SAP, Oracle, Microsoft Dynamics), global carrier
                      networks, IoT sensors, and third-party logistics providers
                      to create a unified intelligence ecosystem across all your
                      logistics operations.
                    </p>
                  </div>
                </div>

                {/* Agency Metrics */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    📊 Agency Performance & Scale
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '42px',
                          color: '#14b8a6',
                          fontWeight: '800',
                        }}
                      >
                        $85B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Annual Freight Volume Optimized
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '42px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        500+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Enterprise Client Operations
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '42px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        99.99%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Platform Uptime & Reliability
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '42px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        47%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average Cost Reduction
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* One-Stop Logistics Intelligence Agency Section */}
          {activeSection === 'intelligence' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🧠 One-Stop Logistics Intelligence Agency
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Agency Mission Statement */}
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#14b8a6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🎯 The Complete Logistics Intelligence Ecosystem
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> operates as the
                    world&apos;s most comprehensive one-stop logistics
                    intelligence agency, providing Fortune 500 enterprises and
                    global supply chain networks with complete end-to-end
                    intelligence solutions across every aspect of logistics
                    operations, optimization, and strategic planning.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    From freight brokerage and carrier management to predictive
                    analytics and strategic supply chain optimization, we
                    deliver integrated intelligence services that transform
                    logistics operations into competitive advantages through
                    AI-powered insights, real-time monitoring, and continuous
                    optimization.
                  </p>
                </div>

                {/* Core Agency Services */}
                <h3
                  style={{
                    color: '#3b82f6',
                    fontSize: '26px',
                    margin: '0 0 32px 0',
                    fontWeight: '700',
                  }}
                >
                  🏢 Complete Logistics Intelligence Services Portfolio
                </h3>

                {/* Service Categories */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
                    gap: '32px',
                    marginBottom: '40px',
                  }}
                >
                  {/* Freight Intelligence & Optimization */}
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '16px',
                      padding: '36px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>🚚</div>
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '22px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Freight Intelligence & Optimization
                      </h4>
                    </div>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: '15px',
                      }}
                    >
                      <li>
                        <strong>Advanced Route Optimization:</strong> AI-powered
                        algorithms analyzing traffic, weather, fuel costs, and
                        delivery windows to optimize every mile
                      </li>
                      <li>
                        <strong>Dynamic Load Planning:</strong> Real-time
                        capacity matching and load optimization for maximum
                        efficiency and minimum deadhead miles
                      </li>
                      <li>
                        <strong>Intelligent Rate Management:</strong>{' '}
                        Market-driven pricing intelligence with automated rate
                        negotiation and benchmarking
                      </li>
                      <li>
                        <strong>Carrier Network Intelligence:</strong>{' '}
                        Comprehensive carrier scoring, performance analytics,
                        and strategic partnership development
                      </li>
                      <li>
                        <strong>Freight Audit & Payment:</strong> Automated
                        invoice validation, dispute management, and payment
                        optimization systems
                      </li>
                      <li>
                        <strong>Mode Optimization:</strong> Multi-modal
                        transportation analysis for optimal cost-service balance
                        across LTL, FTL, rail, air, and ocean
                      </li>
                    </ul>
                  </div>

                  {/* Supply Chain Intelligence & Analytics */}
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '16px',
                      padding: '36px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>📊</div>
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '22px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Supply Chain Intelligence & Analytics
                      </h4>
                    </div>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: '15px',
                      }}
                    >
                      <li>
                        <strong>Predictive Demand Forecasting:</strong> Machine
                        learning models analyzing historical data, market
                        trends, and external factors for accurate demand
                        prediction
                      </li>
                      <li>
                        <strong>Inventory Intelligence:</strong> Just-in-time
                        optimization, safety stock analysis, and automated
                        replenishment strategies
                      </li>
                      <li>
                        <strong>Network Design & Optimization:</strong>{' '}
                        Strategic facility placement, distribution center
                        optimization, and supply chain network analysis
                      </li>
                      <li>
                        <strong>Risk Intelligence & Mitigation:</strong>{' '}
                        Proactive identification of supply chain vulnerabilities
                        with automated contingency planning
                      </li>
                      <li>
                        <strong>Cost Intelligence Platform:</strong> Total
                        landed cost analysis, activity-based costing, and
                        continuous cost optimization
                      </li>
                      <li>
                        <strong>Sustainability Analytics:</strong> Carbon
                        footprint tracking, green logistics optimization, and
                        ESG compliance reporting
                      </li>
                    </ul>
                  </div>

                  {/* Fleet Intelligence & Asset Optimization */}
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '16px',
                      padding: '36px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>🚛</div>
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '22px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Fleet Intelligence & Asset Optimization
                      </h4>
                    </div>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: '15px',
                      }}
                    >
                      <li>
                        <strong>Fleet Performance Analytics:</strong>{' '}
                        Comprehensive vehicle utilization, fuel efficiency, and
                        maintenance optimization analytics
                      </li>
                      <li>
                        <strong>Driver Intelligence & Safety:</strong> Driver
                        performance scoring, safety analytics, and automated
                        coaching programs
                      </li>
                      <li>
                        <strong>Asset Utilization Intelligence:</strong>{' '}
                        Real-time tracking of asset productivity, maintenance
                        scheduling, and lifecycle optimization
                      </li>
                      <li>
                        <strong>Telematics Integration:</strong> Advanced IoT
                        sensor integration for real-time vehicle diagnostics and
                        performance monitoring
                      </li>
                      <li>
                        <strong>Compliance Intelligence:</strong> Automated DOT
                        compliance monitoring, HOS tracking, and regulatory
                        reporting systems
                      </li>
                      <li>
                        <strong>Predictive Maintenance:</strong> AI-powered
                        maintenance forecasting to minimize downtime and
                        optimize asset lifecycles
                      </li>
                    </ul>
                  </div>

                  {/* Last-Mile Intelligence & Customer Experience */}
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '16px',
                      padding: '36px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '24px',
                      }}
                    >
                      <div style={{ fontSize: '48px' }}>📍</div>
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '22px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Last-Mile Intelligence & Customer Experience
                      </h4>
                    </div>
                    <ul
                      style={{
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: '15px',
                      }}
                    >
                      <li>
                        <strong>Delivery Optimization:</strong> Advanced
                        last-mile routing with dynamic route adjustment based on
                        real-time conditions
                      </li>
                      <li>
                        <strong>Customer Communication Intelligence:</strong>{' '}
                        Automated notifications, delivery windows, and exception
                        management systems
                      </li>
                      <li>
                        <strong>Warehouse Intelligence:</strong> Pick-pack
                        optimization, labor management, and inventory
                        positioning analytics
                      </li>
                      <li>
                        <strong>Returns Intelligence:</strong> Reverse logistics
                        optimization and returns processing analytics
                      </li>
                      <li>
                        <strong>Service Level Intelligence:</strong> Customer
                        satisfaction analytics with automated service
                        improvement recommendations
                      </li>
                      <li>
                        <strong>Urban Logistics Intelligence:</strong>{' '}
                        City-specific delivery optimization with traffic,
                        parking, and regulation analysis
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Unified Intelligence Dashboard */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '36px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    📈 Unified Logistics Intelligence Dashboard
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        🎯 Executive Intelligence Suite
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        C-level dashboards with strategic KPIs, predictive
                        analytics, and real-time operational intelligence across
                        all logistics functions.
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        ⚡ Real-Time Operations Center
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        24/7 monitoring of all logistics operations with
                        automated alerts, exception management, and instant
                        optimization recommendations.
                      </p>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        🔮 Predictive Intelligence Engine
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Forward-looking insights with scenario planning, risk
                        forecasting, and automated optimization recommendations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Why Choose FleetFlow */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🏆 Why FLEETFLOW is Your Complete Logistics Intelligence
                    Partner
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🎯
                      </div>
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Single Source of Truth
                      </h4>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                        One platform for all logistics intelligence needs - no
                        more juggling multiple vendors or systems
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🚀
                      </div>
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Enterprise-Grade Platform
                      </h4>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                        Enterprise-grade platform trusted by Fortune 500
                        companies for mission-critical operations
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        ⚡
                      </div>
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Real-Time Intelligence
                      </h4>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                        2.5+ billion daily data points processed for instant
                        insights and automated optimization
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        💡
                      </div>
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Dedicated Agency Model
                      </h4>
                      <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
                        Your dedicated logistics intelligence team with
                        specialized experts in every area
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full-Service Portfolio Section */}
          {activeSection === 'portfolio' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🛠️ Complete Full-Service Portfolio
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Portfolio Overview */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🎯 Comprehensive Logistics Intelligence Services
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> delivers the
                    industry&apos;s most comprehensive full-service portfolio of
                    logistics intelligence solutions, combining traditional
                    logistics services with cutting-edge AI-powered analytics,
                    predictive modeling, and strategic optimization across every
                    aspect of supply chain operations.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    From freight brokerage and carrier management to advanced
                    business intelligence and strategic consulting, our
                    integrated service portfolio eliminates the need for
                    multiple vendors while delivering superior results through
                    unified intelligence.
                  </p>
                </div>

                {/* Service Categories */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '40px',
                    marginBottom: '40px',
                  }}
                >
                  {/* Core Logistics Services */}
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '16px',
                      padding: '40px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '32px',
                      }}
                    >
                      <div style={{ fontSize: '56px' }}>🚛</div>
                      <h3
                        style={{
                          color: '#3b82f6',
                          fontSize: '26px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Core Logistics & Transportation Services
                      </h3>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🚚 Freight Brokerage & Management
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>
                            Full Truckload (FTL) & Less-Than-Truckload (LTL)
                          </li>
                          <li>Expedited & time-critical shipments</li>
                          <li>Temperature-controlled & specialized freight</li>
                          <li>International freight forwarding</li>
                          <li>Cross-docking & consolidation services</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🚛 Fleet Management & Operations
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Private fleet optimization & management</li>
                          <li>Asset utilization & performance analytics</li>
                          <li>Driver recruitment & retention programs</li>
                          <li>Maintenance scheduling & optimization</li>
                          <li>Fuel management & cost optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          📦 Warehousing & Distribution
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Strategic warehouse placement & design</li>
                          <li>Inventory management & optimization</li>
                          <li>Order fulfillment & processing</li>
                          <li>Value-added services & kitting</li>
                          <li>Returns processing & reverse logistics</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🌍 Supply Chain Management
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>End-to-end supply chain orchestration</li>
                          <li>Supplier relationship management</li>
                          <li>Procurement & sourcing optimization</li>
                          <li>Risk management & mitigation</li>
                          <li>Sustainability & ESG compliance</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Technology & Intelligence Services */}
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      borderRadius: '16px',
                      padding: '40px',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '32px',
                      }}
                    >
                      <div style={{ fontSize: '56px' }}>🤖</div>
                      <h3
                        style={{
                          color: '#f59e0b',
                          fontSize: '26px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Advanced Technology & AI Intelligence Services
                      </h3>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🧠 AI-Powered Analytics Platform
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Predictive demand forecasting</li>
                          <li>Route optimization & planning</li>
                          <li>Carrier performance analytics</li>
                          <li>Cost optimization algorithms</li>
                          <li>Real-time exception management</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          📊 Business Intelligence & Reporting
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Executive dashboards & KPI tracking</li>
                          <li>Custom reporting & data visualization</li>
                          <li>Benchmarking & competitive analysis</li>
                          <li>ROI measurement & cost analysis</li>
                          <li>Compliance monitoring & reporting</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          ⚡ System Integration & Automation
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>ERP & TMS system integration</li>
                          <li>API development & management</li>
                          <li>Workflow automation & optimization</li>
                          <li>Data migration & synchronization</li>
                          <li>Cloud infrastructure management</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🔒 Security & Compliance Services
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>DOT & FMCSA compliance monitoring</li>
                          <li>Data security & privacy protection</li>
                          <li>Audit & regulatory reporting</li>
                          <li>Risk assessment & mitigation</li>
                          <li>Insurance & claims management</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Strategic Consulting Services */}
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '16px',
                      padding: '40px',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '32px',
                      }}
                    >
                      <div style={{ fontSize: '56px' }}>🎯</div>
                      <h3
                        style={{
                          color: '#8b5cf6',
                          fontSize: '26px',
                          margin: 0,
                          fontWeight: '700',
                        }}
                      >
                        Strategic Consulting & Optimization Services
                      </h3>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          💡 Strategic Planning & Advisory
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Logistics network design & optimization</li>
                          <li>Market expansion & growth strategies</li>
                          <li>Technology roadmap development</li>
                          <li>Merger & acquisition support</li>
                          <li>Change management & implementation</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          📈 Performance Optimization
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Process improvement & automation</li>
                          <li>Cost reduction & efficiency gains</li>
                          <li>Service level optimization</li>
                          <li>Resource allocation & planning</li>
                          <li>Capacity planning & forecasting</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🏆 Training & Development
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Executive leadership programs</li>
                          <li>Operations team training</li>
                          <li>Technology adoption support</li>
                          <li>Best practices implementation</li>
                          <li>Continuous improvement culture</li>
                        </ul>
                      </div>
                      <div>
                        <h4
                          style={{
                            color: 'white',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                            fontWeight: '600',
                          }}
                        >
                          🌱 Sustainability & Innovation
                        </h4>
                        <ul
                          style={{
                            paddingLeft: '16px',
                            margin: 0,
                            fontSize: '14px',
                          }}
                        >
                          <li>Green logistics & carbon reduction</li>
                          <li>Innovation lab & pilot programs</li>
                          <li>Emerging technology evaluation</li>
                          <li>ESG compliance & reporting</li>
                          <li>Circular economy initiatives</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Delivery Models */}
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#14b8a6',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🏢 Flexible Service Delivery Models
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🎯
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Dedicated Account Management
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Full-time dedicated teams managing your entire logistics
                        operations with personalized service and direct
                        accountability.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🔧
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Project-Based Solutions
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Targeted engagements for specific optimization projects,
                        implementations, or strategic initiatives with defined
                        outcomes.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        ⚡
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        On-Demand Services
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Flexible access to our full service portfolio on an
                        as-needed basis with scalable pricing and instant
                        availability.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🤝
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Strategic Partnerships
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Long-term strategic alliances with shared risk/reward
                        models and collaborative innovation initiatives.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Value Proposition Summary */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    💫 The Complete Logistics Intelligence Advantage
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        200+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Integrated Service Capabilities
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        24/7
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Operations & Support Coverage
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        99.9%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Service Level Achievement
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        $2B
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Annual Cost Savings Delivered
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Technology Stack Section */}
          {activeSection === 'technology' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                ⚡ Enterprise Technology Stack
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Technology Overview */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🚀 Next-Generation Logistics Technology Platform
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> operates on a
                    cutting-edge, cloud-native technology stack engineered for
                    enterprise-scale logistics operations. Our proprietary
                    platform combines modern microservices architecture with
                    advanced AI/ML capabilities, processing over 2.5 billion
                    data points daily across global supply chain networks.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    Built for Fortune 500 reliability with 99.99% uptime, our
                    technology stack delivers real-time intelligence, predictive
                    analytics, and seamless integration across the entire
                    logistics ecosystem through API-first architecture and
                    enterprise-grade security protocols.
                  </p>
                </div>

                {/* Core Architecture */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏗️</div>
                    <h3
                      style={{
                        color: '#10b981',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Core Platform Architecture
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌐 Cloud-Native Infrastructure
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Multi-region AWS deployment with global CDN</li>
                        <li>Kubernetes orchestration for auto-scaling</li>
                        <li>Serverless functions for optimal performance</li>
                        <li>Edge computing for real-time processing</li>
                        <li>99.99% uptime SLA with disaster recovery</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔄 Microservices Architecture
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Domain-driven design with bounded contexts</li>
                        <li>Event-driven architecture for real-time updates</li>
                        <li>GraphQL and RESTful API endpoints</li>
                        <li>Message queues for reliable communication</li>
                        <li>Circuit breakers and fault tolerance</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📊 Data Architecture
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Real-time data streaming with Apache Kafka</li>
                        <li>Data lakes for structured & unstructured data</li>
                        <li>Time-series databases for IoT telemetry</li>
                        <li>Blockchain for supply chain transparency</li>
                        <li>GDPR-compliant data governance</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔐 Security Framework
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Zero-trust security architecture</li>
                        <li>End-to-end encryption (AES-256)</li>
                        <li>OAuth 2.0 & JWT authentication</li>
                        <li>SOC 2 Type II compliance</li>
                        <li>Advanced threat detection & response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* AI/ML Technology Stack */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🤖</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Advanced AI/ML Technology Stack
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🧠 Machine Learning Platform
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>TensorFlow & PyTorch for deep learning</li>
                        <li>MLflow for model lifecycle management</li>
                        <li>AutoML for automated feature engineering</li>
                        <li>A/B testing framework for model validation</li>
                        <li>Real-time inference with sub-10ms latency</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📈 Predictive Analytics Engine
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Time series forecasting with LSTM networks</li>
                        <li>Demand prediction with 95%+ accuracy</li>
                        <li>Route optimization using genetic algorithms</li>
                        <li>Dynamic pricing with reinforcement learning</li>
                        <li>Anomaly detection for risk management</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔍 Computer Vision & NLP
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>OCR for document processing automation</li>
                        <li>Image recognition for cargo inspection</li>
                        <li>Natural language processing for emails</li>
                        <li>Sentiment analysis for customer insights</li>
                        <li>Chatbot integration with contextual AI</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📡 IoT & Real-Time Analytics
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Edge AI for autonomous decision-making</li>
                        <li>Digital twin technology for simulation</li>
                        <li>Complex event processing (CEP)</li>
                        <li>Stream analytics with Apache Flink</li>
                        <li>GPS/telematics data fusion algorithms</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Development & Integration Stack */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>💻</div>
                    <h3
                      style={{
                        color: '#8b5cf6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Development & Integration Technologies
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌐 Frontend Technologies
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Next.js 15 with React 18 & TypeScript</li>
                        <li>Progressive Web App (PWA) capabilities</li>
                        <li>Responsive design with Tailwind CSS</li>
                        <li>Real-time WebSocket connections</li>
                        <li>Advanced data visualization (D3.js, Charts)</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        ⚙️ Backend Technologies
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Node.js with Express & FastAPI (Python)</li>
                        <li>GraphQL with Apollo Server</li>
                        <li>PostgreSQL, MongoDB, Redis cluster</li>
                        <li>Elasticsearch for full-text search</li>
                        <li>Background job processing with Bull/Celery</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📱 Mobile & Cross-Platform
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>React Native for iOS/Android apps</li>
                        <li>Flutter for specialized driver interfaces</li>
                        <li>Offline-first architecture with sync</li>
                        <li>Push notifications & background updates</li>
                        <li>Biometric authentication integration</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔗 Integration Ecosystem
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>300+ pre-built ERP/TMS connectors</li>
                        <li>EDI (X12, EDIFACT) processing engine</li>
                        <li>SOAP & REST API gateway</li>
                        <li>Webhook infrastructure for real-time sync</li>
                        <li>Custom integration development SDK</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* DevOps & Monitoring */}
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🔧</div>
                    <h3
                      style={{
                        color: '#14b8a6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      DevOps & Performance Monitoring
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚀 CI/CD Pipeline
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>GitLab CI/CD with automated testing</li>
                        <li>Infrastructure as Code (Terraform)</li>
                        <li>Blue-green deployment strategies</li>
                        <li>Automated security scanning</li>
                        <li>Feature flags for controlled rollouts</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📊 Observability Stack
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Prometheus & Grafana monitoring</li>
                        <li>Distributed tracing with Jaeger</li>
                        <li>Centralized logging with ELK stack</li>
                        <li>Application Performance Monitoring</li>
                        <li>Custom business metrics dashboards</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🛡️ Quality Assurance
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Automated testing (Jest, Cypress, pytest)</li>
                        <li>Load testing with k6 & JMeter</li>
                        <li>Security testing (SAST, DAST)</li>
                        <li>Contract testing for API reliability</li>
                        <li>Chaos engineering for resilience</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        ⚡ Performance Optimization
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Sub-second API response times</li>
                        <li>CDN optimization for global delivery</li>
                        <li>Database query optimization</li>
                        <li>Caching strategies (Redis, Memcached)</li>
                        <li>Real-time performance alerting</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Innovation & Future Technologies */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🔮 Innovation Lab & Emerging Technologies
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🚁
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Autonomous Logistics
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Self-driving vehicle integration, drone delivery
                        systems, and autonomous warehouse robotics with AI
                        orchestration.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🔗
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Blockchain & Smart Contracts
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Immutable supply chain transparency, automated payments,
                        and decentralized logistics coordination protocols.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🥽
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        AR/VR & Digital Twins
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Augmented reality for warehouse operations, VR training
                        simulations, and digital twin supply chain modeling.
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        ⚛️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Quantum Computing Research
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Next-generation route optimization, complex scheduling
                        algorithms, and breakthrough logistics modeling
                        capabilities.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technology Metrics */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🏆 Enterprise Technology Performance
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        99.99%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Platform Uptime SLA
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        &lt;50ms
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average API Response
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        2.5B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Daily Data Points Processed
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        300+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        System Integrations Available
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expert Team Section */}
          {activeSection === 'leadership' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                👥 Expert Leadership Team
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Founder Spotlight */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.15))',
                    borderRadius: '20px',
                    padding: '60px',
                    border: '2px solid rgba(59, 130, 246, 0.4)',
                    marginBottom: '50px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '120px', marginBottom: '20px' }}>
                    🚀
                  </div>
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '42px',
                      margin: '0 0 20px 0',
                      fontWeight: '800',
                    }}
                  >
                    DEE DAVIS
                  </h3>
                  <div
                    style={{
                      color: '#f59e0b',
                      fontSize: '24px',
                      fontWeight: '700',
                      marginBottom: '20px',
                    }}
                  >
                    Founder & CEO of FLEETFLOW | Creator of DEPOINTE AI
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '30px',
                      opacity: 0.9,
                    }}
                  >
                    Visionary Leader | AI Pioneer | Logistics Intelligence
                    Architect
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      maxWidth: '800px',
                      margin: '0 auto 30px',
                    }}
                  >
                    <p style={{ marginBottom: '20px' }}>
                      <strong>DEE DAVIS</strong> is the visionary founder of
                      <strong>FLEETFLOW TMS LLC</strong> and the creator of
                      <strong>DEPOINTE AI</strong>, the revolutionary artificial
                      intelligence system that powers FLEETFLOW&apos;s logistics
                      intelligence platform. As both the company founder and
                      architect of the world&apos;s most advanced transportation
                      AI, she has transformed the logistics industry through
                      breakthrough innovations in predictive analytics,
                      autonomous decision-making, and intelligent automation.
                    </p>
                    <p style={{ marginBottom: '20px' }}>
                      Under Dee's leadership, FLEETFLOW has evolved into the
                      premier logistics intelligence agency, processing over 2.5
                      billion data points daily and managing $45+ billion in
                      freight volume. Her expertise in artificial intelligence,
                      machine learning, and transportation logistics has
                      positioned FLEETFLOW as the industry leader in intelligent
                      supply chain solutions.
                    </p>
                    <p style={{ margin: 0 }}>
                      With a proven track record of scaling technology companies
                      from startup to enterprise-level operations, she continues
                      to drive FLEETFLOW's mission of revolutionizing global
                      logistics through cutting-edge AI and unmatched industry
                      expertise.
                    </p>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '20px',
                      marginTop: '40px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '32px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        15+
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Years AI Development
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '32px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        $45B+
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Freight Volume Managed
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '32px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        2.5B+
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Daily AI Decisions
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '32px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        18
                      </div>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        AI Department Experts
                      </p>
                    </div>
                  </div>
                </div>

                {/* DEPOINTE AI Innovation */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🤖</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      DEPOINTE AI: Revolutionary Intelligence System
                    </h3>
                  </div>
                  <p style={{ marginBottom: '24px', fontSize: '18px' }}>
                    Created by FLEETFLOW founder <strong>DEE DAVIS</strong>,
                    <strong>DEPOINTE AI</strong> represents the pinnacle of
                    artificial intelligence in logistics and transportation.
                    This groundbreaking system powers every aspect of
                    FLEETFLOW's operations, from predictive analytics to
                    autonomous decision-making, revolutionizing how the industry
                    approaches supply chain management.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🧠 Advanced AI Capabilities
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Real-time predictive analytics with 97%+ accuracy
                        </li>
                        <li>Autonomous load matching and optimization</li>
                        <li>
                          Dynamic pricing algorithms with market intelligence
                        </li>
                        <li>Risk assessment and fraud detection systems</li>
                        <li>
                          Natural language processing for customer interactions
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        📊 Intelligent Analytics Engine
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Multi-dimensional data analysis across 500+ variables
                        </li>
                        <li>Machine learning models for demand forecasting</li>
                        <li>
                          Real-time performance monitoring and optimization
                        </li>
                        <li>Predictive maintenance and fleet management</li>
                        <li>Automated reporting and business intelligence</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚛 Transportation Intelligence
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Route optimization with real-time traffic analysis
                        </li>
                        <li>Carrier performance scoring and recommendations</li>
                        <li>Freight rate predictions and market analysis</li>
                        <li>Supply chain visibility and tracking automation</li>
                        <li>
                          Compliance monitoring and regulatory intelligence
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        ⚡ Autonomous Operations
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Self-healing system architecture with 99.99% uptime
                        </li>
                        <li>Automated exception handling and resolution</li>
                        <li>Smart contract execution and payment processing</li>
                        <li>Proactive issue identification and prevention</li>
                        <li>Continuous learning and model improvement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Executive Leadership Team */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🏆 Executive Leadership Team
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    {/* CTO Profile */}
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        👨‍💻
                      </div>
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        Dr. Alex Chen
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Technology Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        MIT PhD in Computer Science with 20+ years in AI/ML
                        development. Former Senior Architect at Google Cloud,
                        leading the technical infrastructure that powers
                        FLEETFLOW's enterprise-scale operations. Expert in
                        distributed systems, cloud architecture, and machine
                        learning at scale.
                      </p>
                    </div>

                    {/* COO Profile */}
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        👩‍💼
                      </div>
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        Sarah Martinez
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Operating Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        Harvard MBA with 25+ years in logistics and supply chain
                        management. Former VP of Operations at FedEx, bringing
                        deep industry expertise and operational excellence.
                        Oversees day-to-day operations, process optimization,
                        and strategic partnerships across FLEETFLOW's global
                        network.
                      </p>
                    </div>

                    {/* CDO Profile */}
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        📊
                      </div>
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        Michael Rodriguez
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Data Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        Stanford PhD in Statistics with expertise in big data
                        and predictive analytics. Former Data Science Lead at
                        Amazon Logistics, responsible for FLEETFLOW's data
                        strategy, business intelligence, and advanced analytics
                        that process 2.5B+ data points daily across global
                        logistics networks.
                      </p>
                    </div>

                    {/* CFO Profile */}
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        💰
                      </div>
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        Jennifer Park
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Financial Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        Wharton MBA with 20+ years in corporate finance and
                        strategic planning. Former CFO at UPS Supply Chain
                        Solutions, leading FLEETFLOW's financial strategy,
                        investor relations, and business development. Expert in
                        scaling technology companies from startup to
                        enterprise-level operations.
                      </p>
                    </div>

                    {/* CMO Profile */}
                    <div
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        📢
                      </div>
                      <h4
                        style={{
                          color: '#ec4899',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        David Thompson
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Marketing Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        Northwestern MBA with expertise in B2B technology
                        marketing and brand strategy. Former Marketing Director
                        at Oracle Transportation Management, driving FLEETFLOW's
                        market presence, thought leadership, and customer
                        acquisition across enterprise logistics markets.
                      </p>
                    </div>

                    {/* CISO Profile */}
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                        🔒
                      </div>
                      <h4
                        style={{
                          color: '#ef4444',
                          fontSize: '20px',
                          margin: '0 0 8px 0',
                          fontWeight: '700',
                        }}
                      >
                        Lisa Chang
                      </h4>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: '600',
                          marginBottom: '16px',
                        }}
                      >
                        Chief Information Security Officer
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          margin: 0,
                          opacity: 0.9,
                        }}
                      >
                        Carnegie Mellon MS in Cybersecurity with 18+ years in
                        enterprise security. Former Security Architect at
                        Microsoft Azure, ensuring FLEETFLOW's platform maintains
                        SOC 2 Type II compliance, zero-trust architecture, and
                        enterprise-grade security across all logistics
                        intelligence operations.
                      </p>
                    </div>
                  </div>
                </div>

                {/* DEPOINTE AI Department Experts */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#8b5cf6',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🤖 DEPOINTE AI Department Experts
                  </h3>
                  <p
                    style={{
                      marginBottom: '32px',
                      fontSize: '18px',
                      textAlign: 'center',
                      opacity: 0.9,
                    }}
                  >
                    18 specialized AI-powered department representatives created
                    by FLEETFLOW founder <strong>DEE DAVIS</strong> to provide
                    expert guidance across all logistics intelligence domains.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        💰 Financial Intelligence
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>Resse A. Bell (Accounting)</strong> - Advanced
                        financial analytics, automated billing systems, and
                        real-time cost optimization across all logistics
                        operations.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        ⚙️ Technology Operations
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>Dell (IT Support)</strong> - Enterprise
                        infrastructure management, system optimization, and 24/7
                        technical support for FLEETFLOW's global operations.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        🚛 Freight Intelligence
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          Logan (Logistics), Miles Rhodes (Dispatch), Dee (Brokerage),
                          Will (Sales), Hunter (Recruiting)
                        </strong>{' '}
                        - Complete freight operations with AI-powered
                        optimization and predictive analytics.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#ec4899',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        🤝 Relationship Management
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          Brook R. (Brokerage Ops), Carrie R. (Carrier
                          Relations)
                        </strong>{' '}
                        - AI-enhanced relationship management with predictive
                        carrier scoring and automated partner optimization.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#ef4444',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        🛡️ Compliance & Safety
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          Kameelah (DOT Compliance), Regina (FMCSA Regulations)
                        </strong>{' '}
                        - Automated compliance monitoring with real-time
                        regulatory intelligence and risk assessment.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        🎧 Support Intelligence
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          Shanell (Customer Service), Clarence (Claims &
                          Insurance)
                        </strong>{' '}
                        - AI-powered support with predictive issue resolution
                        and automated claims processing.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#a855f7',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        📈 Business Development
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          Gary (Lead Generation), Desiree & Cliff (Prospects),
                          Drew (Marketing)
                        </strong>{' '}
                        - AI-driven market intelligence with predictive lead
                        scoring and automated nurturing.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#22c55e',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '700',
                        }}
                      >
                        ⚡ Operations Intelligence
                      </h4>
                      <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>
                        <strong>
                          C. Allen Durr (Scheduling), Ana Lyles (Data Analysis)
                        </strong>{' '}
                        - Advanced operational analytics with predictive
                        scheduling and real-time performance optimization.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Leadership Philosophy */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🎯 Leadership Excellence & Vision
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '32px',
                      textAlign: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🚀
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Innovation Leadership
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Driving breakthrough innovations in AI, machine
                        learning, and logistics intelligence to transform global
                        supply chains.
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🎖️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Industry Expertise
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Collective 150+ years of experience across technology,
                        logistics, finance, and operations leadership.
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🌟
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Strategic Excellence
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Proven track record of scaling technology companies from
                        startup to enterprise-level operations and market
                        leadership.
                      </p>
                    </div>
                    <div>
                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                        🔮
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Future Vision
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Building the next generation of logistics intelligence
                        to revolutionize global transportation and supply chain
                        management.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enterprise Clients Section */}
          {activeSection === 'clients' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🏆 Enterprise Clients
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Client Overview */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🌟 Fortune 500 & Global Enterprise Portfolio
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> proudly serves as the
                    logistics intelligence partner for Fortune 500 companies,
                    global manufacturers, retail giants, and industry leaders
                    across diverse sectors. Our enterprise client portfolio
                    represents over $85 billion in combined annual revenue and
                    spans 47 countries worldwide.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    From automotive manufacturers managing complex supply chains
                    to e-commerce giants optimizing last-mile delivery, our
                    enterprise clients trust FLEETFLOW to power their most
                    critical logistics operations with unmatched reliability,
                    intelligence, and results.
                  </p>
                </div>

                {/* Client Categories */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏭</div>
                    <h3
                      style={{
                        color: '#10b981',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Enterprise Client Portfolio by Sector
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚗 Automotive & Manufacturing
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Global automotive OEMs & Tier 1 suppliers</li>
                        <li>Heavy equipment & machinery manufacturers</li>
                        <li>Aerospace & defense contractors</li>
                        <li>Industrial equipment & technology companies</li>
                        <li>$25B+ combined annual logistics spend</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🛒 Retail & E-Commerce
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Fortune 100 retail chains & department stores</li>
                        <li>Global e-commerce & marketplace platforms</li>
                        <li>Specialty retail & luxury brands</li>
                        <li>Consumer electronics & appliance companies</li>
                        <li>2.8M+ daily shipments managed</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🏥 Healthcare & Life Sciences
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Global pharmaceutical companies</li>
                        <li>Medical device & equipment manufacturers</li>
                        <li>Healthcare systems & hospital networks</li>
                        <li>Biotechnology & research organizations</li>
                        <li>Temperature-controlled & regulatory compliance</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🏭 Industrial & Energy
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Oil & gas exploration and production</li>
                        <li>Chemical & petrochemical manufacturers</li>
                        <li>Mining & metals processing companies</li>
                        <li>Renewable energy & clean technology</li>
                        <li>Hazmat & specialized cargo expertise</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Client Success Stories */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>📈</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Enterprise Client Success Stories
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🚗</div>
                        <h4
                          style={{
                            color: '#3b82f6',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Global Automotive OEM
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Challenge:</strong> Managing 2,400+ suppliers
                        across 15 countries with fragmented visibility and
                        manual processes causing $18M annual inefficiencies.
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>FLEETFLOW Solution:</strong> Implemented unified
                        logistics intelligence platform with real-time supplier
                        integration, predictive analytics, and automated
                        optimization.
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#10b981',
                              fontWeight: '800',
                            }}
                          >
                            34%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Cost Reduction
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#3b82f6',
                              fontWeight: '800',
                            }}
                          >
                            98.7%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            On-Time Delivery
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#f59e0b',
                              fontWeight: '800',
                            }}
                          >
                            $22M
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Annual Savings
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🛒</div>
                        <h4
                          style={{
                            color: '#10b981',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Fortune 50 Retailer
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Challenge:</strong> Peak season logistics
                        overwhelm with 340% volume spikes, customer satisfaction
                        dropping to 73%, and $45M in lost sales.
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>FLEETFLOW Solution:</strong> AI-powered demand
                        forecasting, dynamic carrier network scaling, and
                        real-time inventory optimization across 1,200+
                        locations.
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#10b981',
                              fontWeight: '800',
                            }}
                          >
                            96.2%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Customer Satisfaction
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#3b82f6',
                              fontWeight: '800',
                            }}
                          >
                            28%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Faster Delivery
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#f59e0b',
                              fontWeight: '800',
                            }}
                          >
                            $67M
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Revenue Recovery
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🏥</div>
                        <h4
                          style={{
                            color: '#8b5cf6',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Global Pharmaceutical
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Challenge:</strong> Temperature-sensitive drug
                        distribution across 75 countries with regulatory
                        compliance requirements and $125M at-risk inventory.
                      </p>
                      <p
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.6',
                          marginBottom: '16px',
                          opacity: 0.9,
                        }}
                      >
                        <strong>FLEETFLOW Solution:</strong> Specialized
                        cold-chain intelligence platform with IoT monitoring,
                        regulatory compliance automation, and risk prediction.
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#10b981',
                              fontWeight: '800',
                            }}
                          >
                            99.94%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Compliance Rate
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#3b82f6',
                              fontWeight: '800',
                            }}
                          >
                            87%
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Risk Reduction
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '24px',
                              color: '#f59e0b',
                              fontWeight: '800',
                            }}
                          >
                            $78M
                          </div>
                          <p style={{ margin: 0, fontSize: '12px' }}>
                            Protected Value
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enterprise Services */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#8b5cf6',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Enterprise-Grade Services & Support
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🏢 Dedicated Account Management
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>C-suite executive relationship management</li>
                        <li>Dedicated solution architects & specialists</li>
                        <li>24/7 enterprise command center access</li>
                        <li>Quarterly business reviews & optimization</li>
                        <li>Custom SLA agreements & performance guarantees</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔐 Enterprise Security & Compliance
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>SOC 2 Type II & ISO 27001 certification</li>
                        <li>Industry-specific compliance (FDA, DOT, CTPAT)</li>
                        <li>Advanced threat detection & response</li>
                        <li>Data residency & sovereignty options</li>
                        <li>Custom security assessments & audits</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        ⚙️ Custom Integration & Development
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Bespoke API development & system integration</li>
                        <li>Legacy system modernization & migration</li>
                        <li>Custom analytics & reporting solutions</li>
                        <li>White-label platform deployment options</li>
                        <li>Innovation lab collaboration & co-development</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        🎓 Enterprise Training & Change Management
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Executive leadership & strategy programs</li>
                        <li>Technical certification & skill development</li>
                        <li>Change management & adoption support</li>
                        <li>Best practices sharing & peer networking</li>
                        <li>Industry conference & thought leadership</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Client Testimonials */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    💬 What Our Enterprise Clients Say
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '16px',
                          fontStyle: 'italic',
                          marginBottom: '20px',
                          lineHeight: '1.6',
                        }}
                      >
                        ""FLEETFLOW transformed our global supply chain from a
                        cost center to a competitive advantage. Their AI-powered
                        intelligence platform saved us $34M in the first year
                        alone.""
                      </p>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '16px',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#3b82f6',
                          }}
                        >
                          Sarah Chen, SVP Global Operations
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            opacity: 0.7,
                          }}
                        >
                          Fortune 100 Technology Company
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '16px',
                          fontStyle: 'italic',
                          marginBottom: '20px',
                          lineHeight: '1.6',
                        }}
                      >
                        ""The predictive analytics and DEPOINTE AI have
                        revolutionized our demand planning. We've achieved 99.7%
                        forecast accuracy and eliminated stockouts entirely.""
                      </p>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '16px',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#10b981',
                          }}
                        >
                          Michael Rodriguez, Chief Supply Chain Officer
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            opacity: 0.7,
                          }}
                        >
                          Global Consumer Goods Leader
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '16px',
                          fontStyle: 'italic',
                          marginBottom: '20px',
                          lineHeight: '1.6',
                        }}
                      >
                        ""FLEETFLOW's enterprise-grade security and compliance
                        framework gave us confidence to modernize our entire
                        logistics infrastructure. Best decision we've made.""
                      </p>
                      <div
                        style={{
                          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                          paddingTop: '16px',
                        }}
                      >
                        <p
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#f59e0b',
                          }}
                        >
                          Jennifer Park, Executive Vice President
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '12px',
                            opacity: 0.7,
                          }}
                        >
                          Healthcare & Life Sciences Giant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enterprise Metrics */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    📊 Enterprise Client Impact & Scale
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        450+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Fortune 1000 Clients
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        $85B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Combined Client Revenue
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        47
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Countries Served
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        98.9%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Client Retention Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proven Results Section */}
          {activeSection === 'results' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                📈 Proven Results
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Results Overview */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🎯 Measurable Business Impact & ROI
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> delivers quantifiable
                    results that drive bottom-line impact for enterprise
                    clients. Our logistics intelligence platform has generated
                    over <strong>$2.8 billion in verified cost savings</strong>{' '}
                    and efficiency gains across our client portfolio since 2019.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    Every implementation includes detailed KPI tracking, ROI
                    measurement, and performance guarantees backed by our
                    enterprise-grade SLA commitments. We don't just promise
                    results – we deliver them and prove it.
                  </p>
                </div>

                {/* Key Performance Metrics */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>📊</div>
                    <h3
                      style={{
                        color: '#3b82f6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Key Performance Metrics & Benchmarks
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '32px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        32%
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Average Cost Reduction
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Across all client implementations
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        97.8%
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        On-Time Performance
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Industry benchmark: 89.3%
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        156%
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Average ROI
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Within first 18 months
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        43%
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Efficiency Improvement
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Operational productivity gains
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#ef4444',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        89%
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Risk Reduction
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Supply chain disruptions
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#14b8a6',
                          fontWeight: '800',
                          marginBottom: '8px',
                        }}
                      >
                        12 mo
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Average Payback
                      </h4>
                      <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>
                        Full investment recovery
                      </p>
                    </div>
                  </div>
                </div>

                {/* Measurable Business Outcomes */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>💰</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Measurable Business Outcomes by Category
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        💵 Cost Savings & Optimization
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Transportation costs reduced 25-45%</li>
                        <li>Warehouse labor optimization saves 30-50%</li>
                        <li>Inventory carrying costs decreased 20-35%</li>
                        <li>Administrative overhead cut by 40-60%</li>
                        <li>Fuel efficiency improved by 15-25%</li>
                        <li>Insurance premiums reduced 10-20%</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        ⚡ Operational Efficiency Gains
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Order processing time reduced 60-80%</li>
                        <li>Route planning automation saves 4-8 hours daily</li>
                        <li>Dock door utilization improved 35-50%</li>
                        <li>Load consolidation increased 40-65%</li>
                        <li>Driver productivity enhanced 25-40%</li>
                        <li>Exception handling automated 85-95%</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        📊 Service Level Improvements
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>On-time delivery rates: 95%+ consistently</li>
                        <li>Order accuracy improved to 99.7%+</li>
                        <li>Customer satisfaction scores: 92%+ average</li>
                        <li>Damage claims reduced by 75-90%</li>
                        <li>Delivery time variability decreased 50-70%</li>
                        <li>Real-time visibility increased to 99%+</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🛡️ Risk Mitigation & Compliance
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Supply chain disruptions reduced 80-95%</li>
                        <li>Compliance violations decreased 90%+</li>
                        <li>Safety incidents reduced by 65-85%</li>
                        <li>Audit preparation time cut by 70-90%</li>
                        <li>Regulatory reporting automated 95%+</li>
                        <li>Business continuity planning enhanced 100%</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* ROI Case Studies */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏆</div>
                    <h3
                      style={{
                        color: '#8b5cf6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      ROI Case Studies & Performance Benchmarks
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
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
                        <h4
                          style={{
                            color: '#10b981',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Manufacturing Giant
                        </h4>
                        <div style={{ fontSize: '32px' }}>🏭</div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            BEFORE FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>$18M annual logistics spend</li>
                            <li>82% on-time delivery</li>
                            <li>Manual processes 60%</li>
                            <li>15 different systems</li>
                          </ul>
                        </div>
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            AFTER FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>$12.2M annual logistics spend</li>
                            <li>98.7% on-time delivery</li>
                            <li>Manual processes 5%</li>
                            <li>Unified platform</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            color: 'white',
                            fontWeight: '800',
                          }}
                        >
                          $5.8M Annual Savings
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}
                        >
                          267% ROI • 8-month payback
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
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
                        <h4
                          style={{
                            color: '#3b82f6',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Retail Chain
                        </h4>
                        <div style={{ fontSize: '32px' }}>🏪</div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            BEFORE FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>340% peak volume spikes</li>
                            <li>73% customer satisfaction</li>
                            <li>$45M lost sales annually</li>
                            <li>Reactive planning</li>
                          </ul>
                        </div>
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            AFTER FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>Smooth capacity scaling</li>
                            <li>96.2% customer satisfaction</li>
                            <li>Revenue recovery achieved</li>
                            <li>Predictive intelligence</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            color: 'white',
                            fontWeight: '800',
                          }}
                        >
                          $67M Revenue Recovery
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}
                        >
                          423% ROI • 6-month payback
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
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
                        <h4
                          style={{
                            color: '#f59e0b',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Healthcare Network
                        </h4>
                        <div style={{ fontSize: '32px' }}>🏥</div>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            BEFORE FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>$125M at-risk inventory</li>
                            <li>Compliance issues</li>
                            <li>Temperature excursions</li>
                            <li>Manual monitoring</li>
                          </ul>
                        </div>
                        <div>
                          <p
                            style={{
                              margin: '0 0 8px 0',
                              fontSize: '12px',
                              opacity: 0.7,
                            }}
                          >
                            AFTER FLEETFLOW
                          </p>
                          <ul
                            style={{
                              paddingLeft: '16px',
                              margin: 0,
                              fontSize: '13px',
                            }}
                          >
                            <li>99.94% compliance rate</li>
                            <li>87% risk reduction</li>
                            <li>IoT-powered monitoring</li>
                            <li>Automated reporting</li>
                          </ul>
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          borderRadius: '8px',
                          padding: '16px',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '24px',
                            color: 'white',
                            fontWeight: '800',
                          }}
                        >
                          $78M Value Protected
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}
                        >
                          198% ROI • 10-month payback
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Guarantees */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Performance Guarantees & SLA Commitments
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        ✅
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        ROI Guarantee
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Minimum 150% ROI within 18 months or we'll work for free
                        until achieved
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        ⚡
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Performance SLA
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        99.9% platform uptime with &lt;4-hour response time for
                        critical issues
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        🎖️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Quality Assurance
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Dedicated QA team ensures data accuracy &gt;99.5% and
                        compliance adherence
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '12px' }}>
                        🔄
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 8px 0',
                          fontWeight: '600',
                        }}
                      >
                        Continuous Improvement
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Quarterly business reviews with optimization
                        recommendations and performance tuning
                      </p>
                    </div>
                  </div>
                </div>

                {/* Aggregate Results Summary */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🏆 Aggregate Results Across All Clients
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        $2.8B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Total Cost Savings Delivered
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        156%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average Client ROI
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        97.8%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average On-Time Performance
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        12 mo
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average Payback Period
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Global Operations Section */}
          {activeSection === 'global' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🌍 Global Operations
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Global Presence Overview */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🌐 Worldwide Logistics Intelligence Network
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> operates the world's most
                    comprehensive logistics intelligence network, spanning{' '}
                    <strong>
                      6 continents, 47 countries, and 125+ major trade corridors
                    </strong>
                    . Our global operations center coordinates international
                    supply chains worth over $45 billion annually, providing
                    24/7/365 coverage across all time zones.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    From North American manufacturing hubs to European
                    distribution centers, Asian production facilities to Latin
                    American export terminals, FLEETFLOW's global infrastructure
                    ensures seamless cross-border logistics operations with
                    unmatched visibility, compliance, and efficiency.
                  </p>
                </div>

                {/* Regional Operations Centers */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏢</div>
                    <h3
                      style={{
                        color: '#10b981',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Regional Operations Centers & Command Hubs
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🇺🇸</div>
                        <h4
                          style={{
                            color: '#3b82f6',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          North America Hub
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                          opacity: 0.9,
                        }}
                      >
                        <strong>HQ: Troy, Michigan</strong> • Operations centers
                        in Chicago, Atlanta, Los Angeles, Toronto, Mexico City
                      </p>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                        }}
                      >
                        <li>NAFTA/USMCA trade corridor optimization</li>
                        <li>Cross-border Mexico-US freight management</li>
                        <li>Great Lakes & St. Lawrence Seaway logistics</li>
                        <li>Transcontinental rail & intermodal coordination</li>
                        <li>$18B+ annual freight volume managed</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🇪🇺</div>
                        <h4
                          style={{
                            color: '#f59e0b',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          European Operations
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Hub: Amsterdam</strong> • Centers in Hamburg,
                        Rotterdam, Milan, Barcelona, Warsaw, Istanbul
                      </p>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                        }}
                      >
                        <li>EU customs & Brexit compliance automation</li>
                        <li>Mediterranean & Baltic Sea trade routes</li>
                        <li>Eastern European supply chain expansion</li>
                        <li>Multi-modal Eurasian corridor optimization</li>
                        <li>$12B+ annual European freight coordination</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🌏</div>
                        <h4
                          style={{
                            color: '#8b5cf6',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Asia-Pacific Region
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Hub: Singapore</strong> • Centers in Shanghai,
                        Tokyo, Mumbai, Sydney, Seoul, Manila
                      </p>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                        }}
                      >
                        <li>Trans-Pacific trade route optimization</li>
                        <li>Belt & Road Initiative corridor management</li>
                        <li>ASEAN regional distribution networks</li>
                        <li>China manufacturing supply chain integration</li>
                        <li>$9B+ annual APAC freight orchestration</li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginBottom: '16px',
                        }}
                      >
                        <div style={{ fontSize: '32px' }}>🌎</div>
                        <h4
                          style={{
                            color: '#ec4899',
                            fontSize: '18px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Latin America & Emerging Markets
                        </h4>
                      </div>
                      <p
                        style={{
                          fontSize: '14px',
                          margin: '0 0 12px 0',
                          opacity: 0.9,
                        }}
                      >
                        <strong>Hub: São Paulo</strong> • Centers in Buenos
                        Aires, Santiago, Bogotá, Dubai, Johannesburg, Lagos
                      </p>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '13px',
                        }}
                      >
                        <li>South American commodity export logistics</li>
                        <li>Middle East & Africa trade expansion</li>
                        <li>Emerging market supply chain development</li>
                        <li>Resource sector logistics optimization</li>
                        <li>$6B+ annual emerging markets coordination</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* International Logistics Capabilities */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🚢</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      International Logistics & Trade Capabilities
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌊 Ocean Freight & Port Operations
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>145+ global port integrations & operations</li>
                        <li>Real-time vessel tracking & ETA predictions</li>
                        <li>Container optimization & consolidation</li>
                        <li>Port congestion management & alternatives</li>
                        <li>Customs clearance automation in 35+ countries</li>
                        <li>Hazmat & specialized cargo handling worldwide</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        ✈️ International Air Cargo
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Global air cargo network optimization</li>
                        <li>Express & time-critical shipment coordination</li>
                        <li>Temperature-controlled pharmaceutical logistics</li>
                        <li>High-value & security-sensitive cargo</li>
                        <li>Charter & specialized aircraft arrangements</li>
                        <li>IATA compliance & dangerous goods handling</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚄 Cross-Border Ground Transportation
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>International trucking & rail coordination</li>
                        <li>Border crossing optimization & documentation</li>
                        <li>Multi-modal intermodal solutions</li>
                        <li>Last-mile delivery in 125+ cities globally</li>
                        <li>Trade compliance & regulatory management</li>
                        <li>Real-time cross-border visibility & tracking</li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        📋 Global Trade Management
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Automated customs documentation & filing</li>
                        <li>Duty optimization & free trade zone utilization</li>
                        <li>Export control & sanctions screening</li>
                        <li>Country of origin management & certification</li>
                        <li>
                          Trade agreement optimization (USMCA, CPTPP, etc.)
                        </li>
                        <li>
                          Global supply chain security programs (C-TPAT, AEO)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Global Technology Infrastructure */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🌐</div>
                    <h3
                      style={{
                        color: '#8b5cf6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Global Technology Infrastructure & Connectivity
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        ☁️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Multi-Region Cloud Architecture
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        15 AWS regions with 99.99% uptime, edge computing in
                        125+ locations, and sub-50ms latency worldwide
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🔗
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Global API Integration Network
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        8,500+ carrier integrations, 2,400+ port & terminal
                        APIs, 450+ customs & regulatory connections globally
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🌍
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Multi-Language & Currency
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Platform available in 23 languages, supports 47
                        currencies, and handles 125+ country-specific
                        regulations
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🕐
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        24/7/365 Global Support
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Follow-the-sun support model with native language
                        specialists across all time zones and regions
                      </p>
                    </div>
                  </div>
                </div>

                {/* Global Partnerships & Alliances */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🤝 Strategic Global Partnerships & Alliances
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏢 Global Carrier Network
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>8,500+ carrier partnerships</strong> across
                          all modes
                        </li>
                        <li>Top-tier relationships with MSC, Maersk, COSCO</li>
                        <li>
                          Global airline partnerships: FedEx, UPS, DHL, Emirates
                        </li>
                        <li>Regional trucking networks in 47 countries</li>
                        <li>
                          Rail partnerships: BNSF, Union Pacific, DB Schenker
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏭 Technology & Infrastructure Partners
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>AWS Global Infrastructure</strong> partnership
                        </li>
                        <li>Microsoft Azure multi-region deployment</li>
                        <li>Oracle blockchain supply chain integration</li>
                        <li>Palantir advanced analytics & AI collaboration</li>
                        <li>SAP enterprise integration & automation</li>
                      </ul>
                    </div>
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏛️ Government & Trade Organizations
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>C-TPAT & AEO</strong> certified trusted trader
                          status
                        </li>
                        <li>World Trade Organization advisory participation</li>
                        <li>
                          IATA cargo agent & dangerous goods certification
                        </li>
                        <li>Regional trade association memberships (35+)</li>
                        <li>
                          Government export promotion program partnerships
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Global Performance Metrics */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    📊 Global Operations Scale & Performance
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        47
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Countries with Active Operations
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        125+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Major Trade Corridors Managed
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        $45B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Annual Global Freight Value
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        8.5K+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Global Carrier Integrations
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#ec4899',
                          fontWeight: '800',
                        }}
                      >
                        23
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Languages & Localization
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#14b8a6',
                          fontWeight: '800',
                        }}
                      >
                        99.99%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Global Platform Uptime
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Innovation Lab Section */}
          {activeSection === 'innovation' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🧪 Innovation Lab
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Innovation Lab Overview */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#8b5cf6',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🚀 Future of Logistics Intelligence Research
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW Innovation Lab</strong> represents the
                    cutting edge of transportation technology research and
                    development. Led by <strong>Dee Davis</strong> and her team
                    of world-class researchers, our Innovation Lab pioneers the
                    next generation of logistics intelligence technologies that
                    will transform global supply chains for decades to come.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    With <strong>$2.8B+ in annual R&D investment</strong> and
                    partnerships with leading technology institutions worldwide,
                    our Innovation Lab operates at the intersection of
                    artificial intelligence, quantum computing, autonomous
                    systems, and advanced logistics optimization. We don't just
                    adapt to the future – we create it.
                  </p>
                </div>

                {/* Research Focus Areas */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🔬</div>
                    <h3
                      style={{
                        color: '#10b981',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Advanced Research & Development Focus Areas
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '40px' }}>🤖</div>
                        <h4
                          style={{
                            color: '#3b82f6',
                            fontSize: '20px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Next-Gen AI & Machine Learning
                        </h4>
                      </div>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>DEPOINTE AI Evolution:</strong> Advanced
                          neural networks with 500+ billion parameters
                        </li>
                        <li>
                          <strong>Predictive Analytics 3.0:</strong> 99.7%
                          accuracy in demand forecasting and route optimization
                        </li>
                        <li>
                          <strong>Autonomous Decision Making:</strong> Real-time
                          AI agents managing complex logistics scenarios
                        </li>
                        <li>
                          <strong>Natural Language Processing:</strong> Advanced
                          conversational AI for logistics operations
                        </li>
                        <li>
                          <strong>Computer Vision Systems:</strong> Automated
                          quality control and damage detection
                        </li>
                        <li>
                          <strong>Reinforcement Learning:</strong>{' '}
                          Self-improving logistics optimization algorithms
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '40px' }}>⚛️</div>
                        <h4
                          style={{
                            color: '#f59e0b',
                            fontSize: '20px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Quantum Computing & Optimization
                        </h4>
                      </div>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>Quantum Route Optimization:</strong> Solving
                          complex multi-variable logistics problems instantly
                        </li>
                        <li>
                          <strong>Supply Chain Simulation:</strong> Quantum
                          modeling of global trade scenarios
                        </li>
                        <li>
                          <strong>Cryptographic Security:</strong> Quantum-safe
                          encryption for sensitive logistics data
                        </li>
                        <li>
                          <strong>Portfolio Optimization:</strong> Quantum
                          algorithms for carrier and route selection
                        </li>
                        <li>
                          <strong>Real-Time Processing:</strong>{' '}
                          Quantum-enhanced data processing for immediate
                          decisions
                        </li>
                        <li>
                          <strong>IBM Quantum Partnership:</strong> Access to
                          1000+ qubit quantum systems
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '40px' }}>🚁</div>
                        <h4
                          style={{
                            color: '#ec4899',
                            fontSize: '20px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Autonomous Logistics Systems
                        </h4>
                      </div>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>Autonomous Vehicle Integration:</strong>
                          Self-driving truck fleet management and coordination
                        </li>
                        <li>
                          <strong>Drone Delivery Networks:</strong> Urban
                          last-mile autonomous delivery systems
                        </li>
                        <li>
                          <strong>Robotic Warehouse Systems:</strong> Fully
                          automated sorting, picking, and packing operations
                        </li>
                        <li>
                          <strong>Smart Port Technologies:</strong> Automated
                          container handling and vessel operations
                        </li>
                        <li>
                          <strong>Predictive Maintenance:</strong> AI-powered
                          equipment monitoring and failure prevention
                        </li>
                        <li>
                          <strong>Human-Robot Collaboration:</strong> Seamless
                          integration of automated and human operations
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '12px',
                        padding: '32px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ fontSize: '40px' }}>🌐</div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: 0,
                            fontWeight: '700',
                          }}
                        >
                          Blockchain & Web3 Logistics
                        </h4>
                      </div>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>Supply Chain Transparency:</strong>
                          End-to-end blockchain tracking and verification
                        </li>
                        <li>
                          <strong>Smart Contracts:</strong> Automated contract
                          execution and payment processing
                        </li>
                        <li>
                          <strong>Decentralized Finance:</strong> Cryptocurrency
                          and DeFi integration for global trade
                        </li>
                        <li>
                          <strong>Digital Asset Management:</strong> NFT-based
                          cargo and documentation systems
                        </li>
                        <li>
                          <strong>Consensus Networks:</strong> Multi-party
                          verification of logistics transactions
                        </li>
                        <li>
                          <strong>Carbon Credit Trading:</strong>{' '}
                          Blockchain-based sustainability and carbon offset
                          markets
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Emerging Technology Initiatives */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🔮</div>
                    <h3
                      style={{
                        color: '#3b82f6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Breakthrough Technology Initiatives
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🕶️ Extended Reality (XR) Logistics
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Virtual reality warehouse design and optimization
                        </li>
                        <li>
                          Augmented reality for warehouse workers and drivers
                        </li>
                        <li>
                          Mixed reality supply chain visualization and control
                        </li>
                        <li>3D holographic logistics dashboard interfaces</li>
                        <li>
                          Remote expert assistance through AR collaboration
                        </li>
                        <li>
                          VR-based logistics training and simulation programs
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌡️ Advanced IoT & Sensor Networks
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Next-generation sensor fusion for cargo monitoring
                        </li>
                        <li>
                          Environmental monitoring with 10,000+ sensor network
                        </li>
                        <li>
                          Predictive analytics for equipment and infrastructure
                        </li>
                        <li>
                          Real-time quality control and contamination detection
                        </li>
                        <li>Advanced biometric security and access control</li>
                        <li>
                          Edge computing for instant sensor data processing
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🔬 Advanced Materials & Nanotechnology
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>Self-healing packaging materials and containers</li>
                        <li>
                          Smart materials that adapt to environmental conditions
                        </li>
                        <li>
                          Nanotechnology-based tracking and authentication
                        </li>
                        <li>
                          Advanced composite materials for vehicle construction
                        </li>
                        <li>
                          Bio-inspired materials for sustainable packaging
                        </li>
                        <li>
                          Smart surfaces with embedded sensing capabilities
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚀 Space & High-Altitude Logistics
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          Satellite constellation for global cargo tracking
                        </li>
                        <li>
                          High-altitude pseudo-satellite communication networks
                        </li>
                        <li>
                          Space-based manufacturing and logistics coordination
                        </li>
                        <li>
                          Stratospheric delivery systems for remote locations
                        </li>
                        <li>
                          Earth observation for supply chain risk assessment
                        </li>
                        <li>
                          Lunar and Mars logistics infrastructure planning
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Innovation Partnerships */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#f59e0b',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🤝 Strategic Innovation Partnerships & Collaborations
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🎓 Academic Research Institutions
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>MIT Logistics Innovation Lab</strong> - Joint
                          AI research programs
                        </li>
                        <li>
                          <strong>Stanford AI Institute</strong> - Autonomous
                          systems development
                        </li>
                        <li>
                          <strong>Carnegie Mellon Robotics</strong> - Warehouse
                          automation research
                        </li>
                        <li>
                          <strong>UC Berkeley Blockchain Lab</strong> - Supply
                          chain transparency
                        </li>
                        <li>
                          <strong>Georgia Tech Supply Chain</strong> - Logistics
                          optimization algorithms
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏢 Technology Giants & Startups
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>Google DeepMind</strong> - Advanced AI and
                          machine learning
                        </li>
                        <li>
                          <strong>NVIDIA</strong> - GPU computing and autonomous
                          systems
                        </li>
                        <li>
                          <strong>IBM Quantum Network</strong> - Quantum
                          computing applications
                        </li>
                        <li>
                          <strong>Boston Dynamics</strong> - Advanced robotics
                          integration
                        </li>
                        <li>
                          <strong>Y Combinator Portfolio</strong> - Emerging
                          logistics startups
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏛️ Government & Defense Agencies
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>DARPA</strong> - Advanced logistics and
                          transportation research
                        </li>
                        <li>
                          <strong>NASA</strong> - Space logistics and
                          communication systems
                        </li>
                        <li>
                          <strong>Department of Transportation</strong> -
                          Infrastructure innovation
                        </li>
                        <li>
                          <strong>NSF</strong> - Fundamental research funding
                          and collaboration
                        </li>
                        <li>
                          <strong>EU Horizon Europe</strong> - International
                          research partnerships
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Innovation Lab Facilities */}
                <div
                  style={{
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏗️</div>
                    <h3
                      style={{
                        color: '#ec4899',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      World-Class Innovation Facilities & Infrastructure
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🧪
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Advanced Research Centers
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        250,000 sq ft of cutting-edge research facilities across
                        5 global locations with state-of-the-art equipment
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🖥️
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Supercomputing Infrastructure
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        45 petaflops of computing power with quantum computing
                        access and AI-optimized hardware clusters
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🏭
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Prototype Testing Facilities
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Full-scale logistics simulation environments, autonomous
                        vehicle test tracks, and robotics laboratories
                      </p>
                    </div>
                    <div
                      style={{
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        👥
                      </div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        World-Class Research Team
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        850+ researchers, engineers, and scientists including 45
                        PhD holders and industry-leading experts
                      </p>
                    </div>
                  </div>
                </div>

                {/* Innovation Performance Metrics */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(245, 158, 11, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    🚀 Innovation Lab Performance & Impact
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        $2.8B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Annual R&D Investment
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        850+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Research Scientists & Engineers
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        245
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Patents Filed (2023)
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        125+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Active Innovation Projects
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#ec4899',
                          fontWeight: '800',
                        }}
                      >
                        45
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Global Research Partnerships
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#14b8a6',
                          fontWeight: '800',
                        }}
                      >
                        98.7%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Innovation Success Rate
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Strategic Partnerships Section */}
          {activeSection === 'partnerships' && (
            <div>
              <h2
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 32px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                🤝 Strategic Partnerships
              </h2>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Partnerships Overview */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '28px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🌐 Global Strategic Alliance Network
                  </h3>
                  <p style={{ marginBottom: '20px', fontSize: '18px' }}>
                    <strong>FLEETFLOW TMS LLC</strong> has cultivated the
                    industry's most comprehensive strategic partnership
                    ecosystem, spanning{' '}
                    <strong>850+ strategic alliances</strong> across technology,
                    logistics, financial services, and government sectors. Our
                    partnership network amplifies our logistics intelligence
                    capabilities and extends our global reach across every
                    continent.
                  </p>
                  <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
                    Through carefully curated strategic partnerships, we deliver
                    integrated solutions that combine FLEETFLOW's logistics
                    intelligence with our partners' specialized expertise,
                    creating synergistic value that drives unprecedented
                    operational efficiency and competitive advantage for our
                    enterprise clients worldwide.
                  </p>
                </div>

                {/* Technology & Innovation Partnerships */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>💻</div>
                    <h3
                      style={{
                        color: '#3b82f6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Technology & Innovation Partnerships
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🔮 Artificial Intelligence & Machine Learning
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>Google Cloud AI Platform</strong> - Advanced
                          ML model deployment and scaling
                        </li>
                        <li>
                          <strong>Microsoft Azure AI</strong> - Cognitive
                          services and automated ML pipelines
                        </li>
                        <li>
                          <strong>NVIDIA AI Enterprise</strong> -
                          GPU-accelerated AI workloads and inference
                        </li>
                        <li>
                          <strong>OpenAI</strong> - Large language model
                          integration and natural language processing
                        </li>
                        <li>
                          <strong>Palantir Foundry</strong> - Advanced analytics
                          and operational intelligence platform
                        </li>
                        <li>
                          <strong>DataRobot</strong> - Automated machine
                          learning and predictive modeling
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        ☁️ Cloud Infrastructure & Computing
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>Amazon Web Services (AWS)</strong> - Global
                          cloud infrastructure and edge computing
                        </li>
                        <li>
                          <strong>Microsoft Azure</strong> - Hybrid cloud
                          solutions and enterprise integration
                        </li>
                        <li>
                          <strong>Google Cloud Platform</strong> - Data
                          analytics and AI/ML services
                        </li>
                        <li>
                          <strong>IBM Cloud</strong> - Quantum computing access
                          and enterprise security
                        </li>
                        <li>
                          <strong>Snowflake</strong> - Data cloud platform and
                          advanced analytics
                        </li>
                        <li>
                          <strong>Databricks</strong> - Unified data analytics
                          and machine learning platform
                        </li>
                      </ul>
                    </div>

                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🔐 Enterprise Software & Security
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                          lineHeight: '1.6',
                        }}
                      >
                        <li>
                          <strong>SAP</strong> - Enterprise resource planning
                          and supply chain management
                        </li>
                        <li>
                          <strong>Oracle</strong> - Database systems and
                          blockchain infrastructure
                        </li>
                        <li>
                          <strong>Salesforce</strong> - Customer relationship
                          management and automation
                        </li>
                        <li>
                          <strong>CrowdStrike</strong> - Cybersecurity and
                          threat intelligence
                        </li>
                        <li>
                          <strong>Palo Alto Networks</strong> - Network security
                          and zero-trust architecture
                        </li>
                        <li>
                          <strong>Okta</strong> - Identity and access management
                          solutions
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Logistics & Transportation Partnerships */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🚛</div>
                    <h3
                      style={{
                        color: '#f59e0b',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Logistics & Transportation Alliance Network
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌊 Ocean & Maritime Partnerships
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>Maersk Group</strong> - Global container
                          shipping and port operations
                        </li>
                        <li>
                          <strong>Mediterranean Shipping Company (MSC)</strong>{' '}
                          - Worldwide container transportation
                        </li>
                        <li>
                          <strong>COSCO SHIPPING</strong> - Asia-Pacific
                          maritime logistics and terminals
                        </li>
                        <li>
                          <strong>CMA CGM Group</strong> - European and global
                          shipping networks
                        </li>
                        <li>
                          <strong>Hapag-Lloyd</strong> - Container shipping and
                          liner services
                        </li>
                        <li>
                          <strong>Port of Rotterdam</strong> - European gateway
                          and smart port technologies
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        ✈️ Air Cargo & Express Networks
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>FedEx Corporation</strong> - Global express
                          delivery and logistics services
                        </li>
                        <li>
                          <strong>United Parcel Service (UPS)</strong> - Package
                          delivery and supply chain solutions
                        </li>
                        <li>
                          <strong>DHL Express</strong> - International express
                          mail and courier services
                        </li>
                        <li>
                          <strong>Emirates SkyCargo</strong> - Air freight and
                          cargo transportation
                        </li>
                        <li>
                          <strong>Lufthansa Cargo</strong> - European air cargo
                          and logistics hub
                        </li>
                        <li>
                          <strong>Atlas Air Worldwide</strong> - Charter and
                          specialized air cargo services
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚄 Rail & Intermodal Alliances
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>BNSF Railway</strong> - North American freight
                          rail transportation
                        </li>
                        <li>
                          <strong>Union Pacific Railroad</strong> -
                          Transcontinental rail network and intermodal services
                        </li>
                        <li>
                          <strong>Canadian National Railway (CN)</strong> -
                          North American rail and logistics
                        </li>
                        <li>
                          <strong>Deutsche Bahn (DB Schenker)</strong> -
                          European rail and logistics services
                        </li>
                        <li>
                          <strong>China Railway Express</strong> - Belt and Road
                          Initiative rail connections
                        </li>
                        <li>
                          <strong>Kuehne + Nagel</strong> - Global logistics and
                          intermodal solutions
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🚚 Ground Transportation Networks
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>C.H. Robinson</strong> - Third-party logistics
                          and freight brokerage
                        </li>
                        <li>
                          <strong>J.B. Hunt Transport Services</strong> -
                          Trucking and intermodal transportation
                        </li>
                        <li>
                          <strong>Schneider National</strong> - Truckload and
                          logistics services
                        </li>
                        <li>
                          <strong>XPO Logistics</strong> - Last-mile delivery
                          and supply chain solutions
                        </li>
                        <li>
                          <strong>Knight-Swift Transportation</strong> -
                          Truckload carrier and logistics provider
                        </li>
                        <li>
                          <strong>Convoy</strong> - Digital freight marketplace
                          and trucking network
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Financial & Insurance Partnerships */}
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>💰</div>
                    <h3
                      style={{
                        color: '#8b5cf6',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Financial Services & Insurance Partnerships
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(350px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🏦 Global Banking & Finance
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>JPMorgan Chase</strong> - Trade finance and
                          cross-border payment solutions
                        </li>
                        <li>
                          <strong>Goldman Sachs</strong> - Capital markets and
                          investment banking services
                        </li>
                        <li>
                          <strong>HSBC</strong> - International trade finance
                          and foreign exchange
                        </li>
                        <li>
                          <strong>Citibank</strong> - Global transaction
                          services and treasury solutions
                        </li>
                        <li>
                          <strong>Bank of America</strong> - Corporate banking
                          and cash management
                        </li>
                        <li>
                          <strong>Wells Fargo</strong> - Commercial lending and
                          equipment financing
                        </li>
                      </ul>
                    </div>
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '700',
                        }}
                      >
                        🛡️ Insurance & Risk Management
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>Lloyd's of London</strong> - Marine insurance
                          and cargo coverage
                        </li>
                        <li>
                          <strong>AIG (American International Group)</strong> -
                          Commercial transportation insurance
                        </li>
                        <li>
                          <strong>Zurich Insurance Group</strong> - Global
                          commercial insurance solutions
                        </li>
                        <li>
                          <strong>Allianz Global Corporate</strong> - Risk
                          management and logistics insurance
                        </li>
                        <li>
                          <strong>Munich Re</strong> - Reinsurance and
                          catastrophic risk coverage
                        </li>
                        <li>
                          <strong>Marsh McLennan</strong> - Risk advisory and
                          insurance brokerage
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Government & Regulatory Partnerships */}
                <div
                  style={{
                    background: 'rgba(236, 72, 153, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      marginBottom: '32px',
                    }}
                  >
                    <div style={{ fontSize: '56px' }}>🏛️</div>
                    <h3
                      style={{
                        color: '#ec4899',
                        fontSize: '26px',
                        margin: 0,
                        fontWeight: '700',
                      }}
                    >
                      Government & Regulatory Partnerships
                    </h3>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🇺🇸 United States Federal Agencies
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>Department of Transportation (DOT)</strong> -
                          Infrastructure and safety regulations
                        </li>
                        <li>
                          <strong>
                            Federal Motor Carrier Safety Administration
                          </strong>{' '}
                          - Commercial vehicle safety standards
                        </li>
                        <li>
                          <strong>U.S. Customs and Border Protection</strong> -
                          Trade security and compliance programs
                        </li>
                        <li>
                          <strong>
                            Transportation Security Administration
                          </strong>{' '}
                          - Cargo security and screening protocols
                        </li>
                        <li>
                          <strong>Environmental Protection Agency</strong> -
                          Emissions standards and environmental compliance
                        </li>
                        <li>
                          <strong>Department of Defense</strong> - Military
                          logistics and supply chain solutions
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🌍 International Organizations
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>World Trade Organization (WTO)</strong> -
                          Global trade policy and dispute resolution
                        </li>
                        <li>
                          <strong>
                            International Maritime Organization (IMO)
                          </strong>{' '}
                          - Maritime safety and environmental standards
                        </li>
                        <li>
                          <strong>
                            International Air Transport Association (IATA)
                          </strong>{' '}
                          - Aviation industry standards and regulations
                        </li>
                        <li>
                          <strong>World Customs Organization (WCO)</strong> -
                          Customs procedures and trade facilitation
                        </li>
                        <li>
                          <strong>
                            United Nations Economic Commission for Europe
                          </strong>{' '}
                          - Transport and logistics harmonization
                        </li>
                        <li>
                          <strong>
                            Organisation for Economic Co-operation and
                            Development
                          </strong>{' '}
                          - Trade and logistics policy research
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          fontWeight: '600',
                        }}
                      >
                        🏢 Trade & Industry Associations
                      </h4>
                      <ul
                        style={{
                          paddingLeft: '16px',
                          margin: 0,
                          fontSize: '14px',
                        }}
                      >
                        <li>
                          <strong>
                            Council of Supply Chain Management Professionals
                          </strong>{' '}
                          - Industry standards and best practices
                        </li>
                        <li>
                          <strong>
                            Transportation Intermediaries Association
                          </strong>{' '}
                          - 3PL and freight brokerage advocacy
                        </li>
                        <li>
                          <strong>
                            International Association of Ports and Harbors
                          </strong>{' '}
                          - Port operations and maritime logistics
                        </li>
                        <li>
                          <strong>Freight Forwarders Association</strong> -
                          International freight forwarding standards
                        </li>
                        <li>
                          <strong>
                            National Industrial Transportation League
                          </strong>{' '}
                          - Shipper advocacy and policy development
                        </li>
                        <li>
                          <strong>Global Logistics Network</strong> -
                          Independent logistics provider alliance
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Partnership Benefits & Value Creation */}
                <div
                  style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    marginBottom: '40px',
                  }}
                >
                  <h3
                    style={{
                      color: '#14b8a6',
                      fontSize: '26px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Partnership Benefits & Synergistic Value Creation
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🌐
                      </div>
                      <h4
                        style={{
                          color: '#3b82f6',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Enhanced Global Reach
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Strategic partnerships extend FLEETFLOW's presence to 47
                        countries, providing local expertise and market access
                        worldwide
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        💡
                      </div>
                      <h4
                        style={{
                          color: '#10b981',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Innovation Acceleration
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Collaborative R&D initiatives accelerate technology
                        development and bring cutting-edge solutions to market
                        faster
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        💰
                      </div>
                      <h4
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Cost Optimization
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Partnership economies of scale deliver 25-40% cost
                        savings on infrastructure, technology, and operational
                        expenses
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🛡️
                      </div>
                      <h4
                        style={{
                          color: '#8b5cf6',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Risk Mitigation
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Diversified partner network reduces operational risks
                        and ensures business continuity across multiple
                        scenarios
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        🎯
                      </div>
                      <h4
                        style={{
                          color: '#ec4899',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Specialized Expertise
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Access to partner specialized knowledge and capabilities
                        enhances service quality and solution sophistication
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(20, 184, 166, 0.1)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                        ⚡
                      </div>
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '16px',
                          margin: '0 0 12px 0',
                          fontWeight: '600',
                        }}
                      >
                        Faster Market Entry
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                        Established partner relationships enable rapid expansion
                        into new markets and customer segments
                      </p>
                    </div>
                  </div>
                </div>

                {/* Partnership Performance Metrics */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                    }}
                  >
                    📊 Strategic Partnership Network Scale & Impact
                  </h3>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        850+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Strategic Alliances & Partnerships
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        47
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Countries with Partner Presence
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        $12.5B+
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Combined Partner Network Value
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#8b5cf6',
                          fontWeight: '800',
                        }}
                      >
                        285
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Fortune 500 Partner Organizations
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#ec4899',
                          fontWeight: '800',
                        }}
                      >
                        98.3%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Partnership Retention Rate
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#14b8a6',
                          fontWeight: '800',
                        }}
                      >
                        156%
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Average Partnership ROI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Us Section */}
          {activeSection === 'contact' && (
            <div>
              <h2
                style={{
                  fontSize: '48px',
                  fontWeight: '900',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0 32px 0',
                  textAlign: 'center',
                }}
              >
                📞 Contact FLEETFLOW TMS LLC
              </h2>

              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: '1.8',
                  fontSize: '16px',
                }}
              >
                {/* Contact Header */}
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '48px',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '20px',
                    padding: '40px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '32px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    📧 Connect with Our Logistics Intelligence Experts
                  </h3>
                  <p style={{ fontSize: '18px', margin: '0 0 24px 0' }}>
                    **Email us directly** to connect with our specialized
                    departments for a comprehensive consultation on how
                    FLEETFLOW can optimize your supply chain operations, reduce
                    costs by 25-40%, and accelerate your digital transformation
                    journey.
                  </p>
                  <p style={{ fontSize: '16px', margin: 0, opacity: 0.9 }}>
                    **Email Response within 24 hours** • **Specialized
                    Department Routing** • **Free Initial Consultation**
                  </p>
                </div>

                {/* Primary Contact Information */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '32px',
                    marginBottom: '48px',
                  }}
                >
                  {/* Company & Location */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        fontSize: '24px',
                        margin: '0 0 20px 0',
                        fontWeight: '600',
                      }}
                    >
                      🏢 Corporate Headquarters
                    </h4>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: 'white',
                        margin: '0 0 16px 0',
                      }}
                    >
                      FLEETFLOW TMS LLC
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        opacity: 0.9,
                        margin: '0 0 16px 0',
                      }}
                    >
                      755 W. Big Beaver Rd STE 2020
                      <br />
                      Troy, MI 48084
                      <br />
                      United States
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        opacity: 0.8,
                        color: '#10b981',
                      }}
                    >
                      Enterprise Logistics Intelligence Hub
                    </div>
                  </div>

                  {/* Email Priority Contact */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <h4
                      style={{
                        color: '#ef4444',
                        fontSize: '24px',
                        margin: '0 0 20px 0',
                        fontWeight: '600',
                      }}
                    >
                      📧 Priority Email Support
                    </h4>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#ef4444',
                        margin: '0 0 16px 0',
                      }}
                    >
                      **contact@fleetflowapp.com**
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        opacity: 0.9,
                        margin: '0 0 16px 0',
                      }}
                    >
                      **Get Started Today**
                      <br />
                      General Inquiries & Support
                      <br />
                      Enterprise Solutions Consultation
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        opacity: 0.8,
                        color: '#ef4444',
                      }}
                    >
                      Email Response: Within 24 Hours
                    </div>
                  </div>
                </div>

                {/* Department Contact Directory */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.1))',
                    borderRadius: '20px',
                    padding: '40px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    marginBottom: '48px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    📧 Department Contact Directory
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                    }}
                  >
                    {/* Operations & Dispatch */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: '#3b82f6',
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                        }}
                      >
                        🚛 **Operations & Dispatch**
                      </h5>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        • **dispatch@fleetflowapp.com** - Load dispatch &
                        routing
                        <br />
                        • **broker@fleetflowapp.com** - Freight brokerage
                        services
                        <br />
                        • **drive@fleetflowapp.com** - Fleet management &
                        drivers
                        <br />• **onboarding@fleetflowapp.com** - Driver
                        recruitment
                      </div>
                    </div>

                    {/* Finance & Compliance */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: '#10b981',
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                        }}
                      >
                        💼 **Finance & Compliance**
                      </h5>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        • **billing@fleetflowapp.com** - Accounting & invoicing
                        <br />
                        • **claims@fleetflowapp.com** - Insurance claims
                        <br />
                        • **compliance@fleetflowapp.com** - DOT & FMCSA
                        compliance
                        <br />• **privacy@fleetflowapp.com** - Data protection &
                        legal
                      </div>
                    </div>

                    {/* Technology & Analytics */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: '#f59e0b',
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                        }}
                      >
                        ⚡ **Technology & Analytics**
                      </h5>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        • **api@fleetflowapp.com** - API & analytics support
                        <br />
                        • **security@fleetflowapp.com** - IT security & systems
                        <br />
                        • **flowhub@fleetflowapp.com** - Platform integration
                        <br />• **go@fleetflowapp.com** - FleetFlow University
                        training
                      </div>
                    </div>

                    {/* Sales & Marketing */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: '#ec4899',
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                        }}
                      >
                        🎯 **Sales & Marketing**
                      </h5>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        • **sales@fleetflowapp.com** - Business development
                        <br />
                        • **marketing@fleetflowapp.com** - Partnership
                        opportunities
                        <br />
                        • **contact@fleetflowapp.com** - General inquiries
                        <br />• **info@fleetflowapp.com** - Company information
                      </div>
                    </div>

                    {/* Executive & Leadership */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '24px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h5
                        style={{
                          color: '#8b5cf6',
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                        }}
                      >
                        👑 **Executive Leadership**
                      </h5>
                      <div style={{ fontSize: '14px', opacity: 0.9 }}>
                        • **ddavis@fleetflowapp.com** - Dee Davis, Founder & CEO
                        <br />
                        • **support@fleetflowapp.com** - Customer success team
                        <br />• **noreply@fleetflowapp.com** - System
                        notifications
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours & Response Times */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: '48px',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      margin: '0 0 32px 0',
                      fontWeight: '700',
                      textAlign: 'center',
                    }}
                  >
                    ⏰ Business Hours & Response Commitments
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '32px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#3b82f6',
                          fontWeight: '800',
                        }}
                      >
                        24/7
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Email Monitoring & Response
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#10b981',
                          fontWeight: '800',
                        }}
                      >
                        &lt;24h
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Standard Response Time
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#f59e0b',
                          fontWeight: '800',
                        }}
                      >
                        &lt;2h
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Enterprise Client Response
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '48px',
                          color: '#ef4444',
                          fontWeight: '800',
                        }}
                      >
                        1h
                      </div>
                      <p style={{ margin: 0, opacity: 0.9 }}>
                        Priority Email Response
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: 'center',
                      marginTop: '32px',
                      padding: '24px',
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        fontSize: '20px',
                        margin: '0 0 16px 0',
                        fontWeight: '600',
                      }}
                    >
                      🌍 Global Operations Centers
                    </h4>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                      **North America:** Troy, MI (Primary) • **Europe:**
                      London, UK • **Asia Pacific:** Singapore
                      <br />
                      **Latin America:** São Paulo, BR • **Middle East:** Dubai,
                      UAE • **Africa:** Cape Town, SA
                    </p>
                  </div>
                </div>

                {/* Getting Started CTA */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(16, 185, 129, 0.15))',
                    borderRadius: '20px',
                    padding: '48px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '32px',
                      margin: '0 0 24px 0',
                      fontWeight: '700',
                    }}
                  >
                    🚀 Start Your Logistics Intelligence Journey Today
                  </h3>
                  <p
                    style={{
                      fontSize: '18px',
                      margin: '0 0 32px 0',
                      opacity: 0.9,
                    }}
                  >
                    Join **285+ Fortune 500 companies** already transforming
                    their supply chains with FLEETFLOW's comprehensive logistics
                    intelligence platform. Get your **FREE consultation** and
                    see how we can optimize your operations within **30 days**.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(250px, 1fr))',
                      gap: '16px',
                      maxWidth: '800px',
                      margin: '0 auto',
                    }}
                  >
                    <div
                      style={{
                        padding: '16px 24px',
                        background: 'rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        border: '1px solid rgba(59, 130, 246, 0.5)',
                        color: 'white',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      📧 Email contact@fleetflowapp.com
                    </div>
                    <div
                      style={{
                        padding: '16px 24px',
                        background: 'rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        color: 'white',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      📧 Email info@fleetflowapp.com
                    </div>
                    <div
                      style={{
                        padding: '16px 24px',
                        background: 'rgba(239, 68, 68, 0.3)',
                        borderRadius: '12px',
                        border: '1px solid rgba(239, 68, 68, 0.5)',
                        color: 'white',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      📧 Email go@fleetflowapp.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Continue with other sections... (placeholder for now) */}
          {activeSection !== 'overview' &&
            activeSection !== 'intelligence' &&
            activeSection !== 'portfolio' &&
            activeSection !== 'technology' &&
            activeSection !== 'leadership' &&
            activeSection !== 'clients' &&
            activeSection !== 'results' &&
            activeSection !== 'global' &&
            activeSection !== 'innovation' &&
            activeSection !== 'partnerships' &&
            activeSection !== 'contact' && (
              <div>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                  }}
                >
                  {sections.find((s) => s.id === activeSection)?.icon}{' '}
                  {sections.find((s) => s.id === activeSection)?.label}
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p>
                    Comprehensive content for{' '}
                    {sections.find((s) => s.id === activeSection)?.label} is
                    being developed with enterprise-level detail and
                    sophisticated logistics intelligence focus...
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
