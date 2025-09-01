'use client';

import { useState } from 'react';

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('culture');

  const sections = [
    { id: 'culture', label: 'Our Culture', icon: '🌟' },
    { id: 'analytics', label: 'Business Intelligence', icon: '📊' },
    { id: 'logistics', label: 'Logistics Intelligence', icon: '🚛' },
    { id: 'leadership', label: 'Leadership', icon: '👥' },
    { id: 'brands', label: 'Our Platforms', icon: '🏢' },
    { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
    { id: 'awards', label: 'Awards & Recognition', icon: '🏆' },
    { id: 'milestones', label: 'Milestones', icon: '📈' },
    { id: 'risk', label: 'Risk Management', icon: '🛡️' },
    { id: 'quality', label: 'Quality Assurance', icon: '✅' },
    { id: 'contact', label: 'Contact Information', icon: '📞' },
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
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 16px 0',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          About FleetFlow
        </h1>
        <p
          style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: '1.6',
          }}
        >
          Enterprise Business Intelligence & Analytics Platform - Transforming
          data into actionable insights across industries
        </p>
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
            width: '300px',
            marginRight: '40px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: 'fit-content',
            position: 'sticky',
            top: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '24px',
              margin: '0 0 24px 0',
            }}
          >
            Navigate Our Story
          </h3>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                width: '100%',
                padding: '16px 20px',
                marginBottom: '8px',
                background:
                  activeSection === section.id
                    ? 'linear-gradient(135deg, #14b8a6, #0d9488)'
                    : 'transparent',
                color: 'white',
                border:
                  activeSection === section.id
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeSection !== section.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '18px' }}>{section.icon}</span>
              {section.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              padding: '40px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              minHeight: '600px',
            }}
          >
            {/* Our Culture */}
            {activeSection === 'culture' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🌟 Our Culture
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '24px' }}>
                    At FleetFlow, we believe in{' '}
                    <strong>Data-Driven Excellence</strong> - our foundational
                    philosophy that drives everything we do. We&apos;ve built a
                    culture where advanced analytics meets business
                    intelligence, and where every team member contributes to
                    transforming raw data into strategic competitive advantages.
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '24px',
                      margin: '32px 0',
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        Analytics Innovation
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        We push boundaries with AI-powered analytics, from
                        Flowter AI intelligence to advanced predictive modeling
                        and real-time business intelligence dashboards.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        Data Transparency
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Clear data visualization, transparent analytics
                        methodologies, and honest insights that empower
                        businesses to make confident data-driven decisions.
                      </p>
                    </div>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        Analytical Excellence
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Our enterprise-grade analytics platform delivers
                        precision insights with 99.9% uptime reliability,
                        setting new standards for business intelligence
                        solutions.
                      </p>
                    </div>
                  </div>
                  <p>
                    We foster an environment where continuous learning through{' '}
                    <strong>FleetFlow University℠</strong>
                    ensures our team stays ahead of analytics trends, and where
                    every voice contributes to our mission of becoming &quot;The
                    Transportation Intelligence Hub.&quot;
                  </p>
                </div>
              </div>
            )}

            {/* Business Intelligence Section */}
            {activeSection === 'analytics' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  📊 Business Intelligence & Analytics
                </h2>

                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px', fontSize: '18px' }}>
                    FLEETFLOW TMS LLC specializes in transforming complex data
                    into strategic business intelligence. Our advanced analytics
                    platform empowers organizations to make data-driven
                    decisions with precision and confidence.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '32px',
                      marginBottom: '32px',
                    }}
                  >
                    {/* Core Analytics Capabilities */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          margin: '0 0 24px 0',
                        }}
                      >
                        🎯 Core Analytics Capabilities
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '20px',
                        }}
                      >
                        {[
                          {
                            title: '🤖 AI-Powered Insights',
                            desc: 'Machine learning algorithms that automatically detect patterns, trends, and anomalies in your data',
                          },
                          {
                            title: '📈 Predictive Analytics',
                            desc: 'Advanced forecasting models that predict future outcomes and business trends with high accuracy',
                          },
                          {
                            title: '⚡ Real-Time Dashboards',
                            desc: 'Live data visualization with interactive charts, KPI monitoring, and customizable reporting',
                          },
                          {
                            title: '🔍 Deep Data Mining',
                            desc: 'Advanced data discovery techniques that uncover hidden insights and business opportunities',
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              borderRadius: '12px',
                              padding: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <h4
                              style={{
                                color: '#14b8a6',
                                fontSize: '16px',
                                margin: '0 0 12px 0',
                              }}
                            >
                              {item.title}
                            </h4>
                            <p
                              style={{
                                margin: 0,
                                fontSize: '14px',
                                opacity: 0.8,
                              }}
                            >
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Industry Applications */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3
                        style={{
                          color: '#14b8a6',
                          fontSize: '24px',
                          margin: '0 0 24px 0',
                        }}
                      >
                        🏭 Cross-Industry Analytics Applications
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
                              margin: '0 0 16px 0',
                            }}
                          >
                            🚛 Transportation & Logistics
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                              lineHeight: '1.6',
                            }}
                          >
                            Route optimization, fleet performance analytics,
                            demand forecasting, and supply chain intelligence
                            for maximum operational efficiency.
                          </p>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '18px',
                              margin: '0 0 16px 0',
                            }}
                          >
                            🏢 Enterprise Operations
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                              lineHeight: '1.6',
                            }}
                          >
                            Business process optimization, performance
                            monitoring, resource allocation, and strategic
                            decision support across all business functions.
                          </p>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: 'white',
                              fontSize: '18px',
                              margin: '0 0 16px 0',
                            }}
                          >
                            💰 Financial Analytics
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                              lineHeight: '1.6',
                            }}
                          >
                            Revenue forecasting, cost analysis, profitability
                            modeling, and financial risk assessment with
                            advanced statistical methods.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Technology Stack */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3
                        style={{
                          color: '#14b8a6',
                          fontSize: '24px',
                          margin: '0 0 24px 0',
                        }}
                      >
                        🛠️ Advanced Analytics Technology Stack
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                        }}
                      >
                        {[
                          'Machine Learning Algorithms',
                          'AI-Powered Data Processing',
                          'Real-Time Analytics Engine',
                          'Predictive Modeling Suite',
                          'Advanced Visualization Tools',
                          'Multi-Source Data Integration',
                          'Automated Reporting Systems',
                          'Statistical Analysis Framework',
                        ].map((tech, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'rgba(20, 184, 166, 0.1)',
                              borderRadius: '8px',
                              padding: '12px',
                              border: '1px solid rgba(20, 184, 166, 0.2)',
                              textAlign: 'center',
                            }}
                          >
                            <span
                              style={{
                                color: '#14b8a6',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              {tech}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#3b82f6',
                        fontSize: '18px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      🎯 Our Analytics Philosophy
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>
                      We believe that every data point tells a story. Our
                      mission is to help organizations uncover those stories and
                      transform them into competitive advantages through
                      sophisticated analytics, intuitive visualization, and
                      actionable business intelligence.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Logistics Intelligence Section */}
            {activeSection === 'logistics' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <h2
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🚛 One-Stop Logistics Intelligence Agency
                </h2>

                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.05))',
                      borderRadius: '20px',
                      padding: '40px',
                      border: '1px solid rgba(251, 146, 60, 0.3)',
                      marginBottom: '40px',
                      textAlign: 'center',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '28px',
                        margin: '0 0 20px 0',
                      }}
                    >
                      🎯 The Complete Logistics Intelligence Ecosystem
                    </h3>
                    <p
                      style={{
                        marginBottom: '24px',
                        fontSize: '18px',
                        maxWidth: '900px',
                        margin: '0 auto 24px auto',
                      }}
                    >
                      <strong>FLEETFLOW TMS LLC</strong> is the industry&apos;s
                      most comprehensive logistics intelligence agency,
                      providing end-to-end data-driven insights across every
                      aspect of the supply chain. From freight movement to
                      last-mile delivery, we transform logistics complexity into
                      competitive advantage through advanced analytics and
                      AI-powered intelligence.
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '16px',
                        maxWidth: '800px',
                        margin: '0 auto',
                      }}
                    >
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#fb923c' }}>
                          360° Supply Chain View
                        </strong>
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#fb923c' }}>
                          Real-Time Intelligence
                        </strong>
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#fb923c' }}>
                          Predictive Analytics
                        </strong>
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#fb923c' }}>
                          Cost Optimization
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Core Logistics Intelligence Services */}
                  <div
                    style={{
                      display: 'grid',
                      gap: '32px',
                      marginBottom: '40px',
                    }}
                  >
                    {/* Freight Intelligence */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '28px',
                          margin: '0 0 24px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        🚚 Freight Intelligence & Optimization
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
                              color: '#22c55e',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            📊 Market Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Real-time freight rate analytics</li>
                            <li>Capacity forecasting & demand prediction</li>
                            <li>Lane-specific market intelligence</li>
                            <li>Competitor pricing analysis</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#22c55e',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🎯 Load Optimization
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>AI-powered load matching</li>
                            <li>Dynamic route optimization</li>
                            <li>Backhaul opportunity identification</li>
                            <li>Multi-modal transportation planning</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#22c55e',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            ⚡ Real-Time Tracking
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>GPS-enabled shipment monitoring</li>
                            <li>ETA prediction algorithms</li>
                            <li>Exception management alerts</li>
                            <li>Proof of delivery automation</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Supply Chain Intelligence */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '28px',
                          margin: '0 0 24px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        🔗 Supply Chain Intelligence & Analytics
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
                              color: '#3b82f6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            📈 Demand Forecasting
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>AI-powered demand prediction</li>
                            <li>Seasonal trend analysis</li>
                            <li>Market volatility modeling</li>
                            <li>Inventory optimization recommendations</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#3b82f6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🏭 Warehouse Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Warehouse performance analytics</li>
                            <li>Pick path optimization</li>
                            <li>Storage utilization analysis</li>
                            <li>Labor productivity insights</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#3b82f6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🌐 Network Optimization
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Distribution network modeling</li>
                            <li>Hub location optimization</li>
                            <li>Cross-docking efficiency</li>
                            <li>Service level optimization</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Fleet Intelligence */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(109, 40, 217, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '28px',
                          margin: '0 0 24px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        🚛 Fleet Intelligence & Asset Optimization
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
                              color: '#8b5cf6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🔧 Maintenance Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Predictive maintenance algorithms</li>
                            <li>Vehicle health monitoring</li>
                            <li>Breakdown prediction models</li>
                            <li>Maintenance cost optimization</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#8b5cf6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            ⛽ Fuel Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Fuel consumption analytics</li>
                            <li>Route efficiency optimization</li>
                            <li>Driver behavior analysis</li>
                            <li>Carbon footprint tracking</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#8b5cf6',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            👥 Driver Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Driver performance analytics</li>
                            <li>Safety score monitoring</li>
                            <li>Training need identification</li>
                            <li>Retention prediction models</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Last Mile Intelligence */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(190, 24, 93, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '28px',
                          margin: '0 0 24px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        📦 Last-Mile Intelligence & Customer Experience
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
                              color: '#ec4899',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🗺️ Delivery Optimization
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Route density optimization</li>
                            <li>Time window scheduling</li>
                            <li>Dynamic re-routing algorithms</li>
                            <li>Delivery sequence optimization</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#ec4899',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            📱 Customer Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>Delivery preference analytics</li>
                            <li>Customer satisfaction scoring</li>
                            <li>Communication optimization</li>
                            <li>Return pattern analysis</li>
                          </ul>
                        </div>
                        <div>
                          <h4
                            style={{
                              color: '#ec4899',
                              fontSize: '18px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            ⚡ Performance Intelligence
                          </h4>
                          <ul
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              paddingLeft: '20px',
                            }}
                          >
                            <li>On-time delivery analytics</li>
                            <li>Cost per delivery optimization</li>
                            <li>Service level benchmarking</li>
                            <li>Exception root cause analysis</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Intelligence Dashboard */}
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.05))',
                      borderRadius: '20px',
                      padding: '40px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      marginBottom: '40px',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '28px',
                        margin: '0 0 24px 0',
                        textAlign: 'center',
                      }}
                    >
                      📊 Unified Logistics Intelligence Dashboard
                    </h3>
                    <p
                      style={{
                        textAlign: 'center',
                        marginBottom: '32px',
                        fontSize: '18px',
                        opacity: 0.9,
                        maxWidth: '800px',
                        margin: '0 auto 32px auto',
                      }}
                    >
                      Our proprietary intelligence platform aggregates data from
                      every touchpoint in your logistics operation, providing a
                      single source of truth with real-time insights, predictive
                      analytics, and actionable recommendations.
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                      }}
                    >
                      {[
                        '🎯 KPI Monitoring',
                        '📈 Trend Analysis',
                        '⚠️ Exception Alerts',
                        '🔮 Predictive Insights',
                        '💰 Cost Analysis',
                        '⏱️ Performance Tracking',
                        '📋 Custom Reports',
                        '🤖 AI Recommendations',
                      ].map((feature, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '20px',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <span
                            style={{
                              color: '#14b8a6',
                              fontSize: '16px',
                              fontWeight: '600',
                            }}
                          >
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Why Choose FLEETFLOW */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '20px',
                      padding: '40px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '28px',
                        margin: '0 0 32px 0',
                        textAlign: 'center',
                      }}
                    >
                      🏆 Why FLEETFLOW is Your Complete Logistics Intelligence
                      Partner
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          🔍
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          360° Visibility
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Complete end-to-end visibility across your entire
                          logistics ecosystem, from origin to final delivery,
                          with real-time tracking and comprehensive analytics.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          🤖
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          AI-Powered Intelligence
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Advanced machine learning algorithms that continuously
                          learn from your data to provide increasingly accurate
                          predictions and optimization recommendations.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          ⚡
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Real-Time Action
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Instant alerts, automated responses, and real-time
                          optimization ensure your logistics operations stay
                          ahead of issues and capitalize on opportunities.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          💰
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Measurable ROI
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Proven cost reduction of 15-30% through optimization,
                          with detailed ROI tracking and performance
                          benchmarking against industry standards.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          🔧
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Seamless Integration
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Easy integration with existing TMS, WMS, ERP systems
                          through our comprehensive API framework and pre-built
                          connectors.
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>
                          📞
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '20px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          24/7 Support
                        </h4>
                        <p
                          style={{
                            fontSize: '14px',
                            opacity: 0.8,
                            margin: 0,
                            lineHeight: '1.6',
                          }}
                        >
                          Dedicated logistics intelligence experts available
                          around the clock to ensure optimal platform
                          performance and continuous value delivery.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Leadership */}
            {activeSection === 'leadership' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
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
                  👥 Executive Leadership Team
                </h2>

                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.05))',
                      borderRadius: '20px',
                      padding: '40px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                      marginBottom: '40px',
                      textAlign: 'center',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '28px',
                        margin: '0 0 20px 0',
                      }}
                    >
                      🎯 Leadership Vision & Mission
                    </h3>
                    <p
                      style={{
                        marginBottom: '24px',
                        fontSize: '18px',
                        maxWidth: '800px',
                        margin: '0 auto 24px auto',
                      }}
                    >
                      Our executive team drives FLEETFLOW TMS LLC's
                      transformation into{' '}
                      <strong>""The Transportation Intelligence Hub""</strong> -
                      combining decades of data science expertise, enterprise
                      software leadership, and transportation industry mastery
                      to revolutionize how businesses leverage analytics for
                      competitive advantage.
                    </p>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        maxWidth: '600px',
                        margin: '0 auto',
                      }}
                    >
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#14b8a6' }}>
                          $5-10B Platform Valuation
                        </strong>
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#14b8a6' }}>
                          Strategic Acquisition Ready
                        </strong>
                      </div>
                      <div
                        style={{
                          padding: '16px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                        }}
                      >
                        <strong style={{ color: '#14b8a6' }}>
                          25+ Years Combined Experience
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Executive Team Profiles */}
                  <div
                    style={{
                      display: 'grid',
                      gap: '32px',
                      marginBottom: '40px',
                    }}
                  >
                    {/* Chief Executive Officer & Founder */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '32px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '140px',
                            height: '140px',
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '56px',
                            flexShrink: 0,
                            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          🎯
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '28px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            Dee Davis
                          </h3>
                          <p
                            style={{
                              color: '#3b82f6',
                              fontSize: '18px',
                              margin: '0 0 20px 0',
                              fontWeight: '600',
                            }}
                          >
                            Chief Executive Officer & Founder
                          </p>
                          <p
                            style={{
                              margin: '0 0 20px 0',
                              fontSize: '16px',
                              opacity: 0.9,
                              lineHeight: '1.7',
                            }}
                          >
                            Visionary entrepreneur and data science pioneer with
                            15+ years transforming raw data into billion-dollar
                            insights. Dee founded FLEETFLOW TMS LLC with the
                            mission to become{' '}
                            <strong>
                              ""The Transportation Intelligence Hub""
                            </strong>{' '}
                            - the definitive platform where transportation data
                            becomes strategic advantage.
                          </p>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                              gap: '16px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  color: '#3b82f6',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🎓 Education & Background
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                Advanced Analytics & Data Science
                                <br />
                                Enterprise Software Architecture
                                <br />
                                Transportation Industry Leadership
                              </p>
                            </div>
                            <div>
                              <h4
                                style={{
                                  color: '#3b82f6',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🏆 Key Achievements
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                Built $5-10B valuation platform
                                <br />
                                Strategic partnerships with Fortune 500
                                <br />
                                AI-powered analytics innovation leader
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chief Technology Officer */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '32px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '140px',
                            height: '140px',
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '56px',
                            flexShrink: 0,
                            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          🔬
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '28px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            Dr. Alex Chen
                          </h3>
                          <p
                            style={{
                              color: '#10b981',
                              fontSize: '18px',
                              margin: '0 0 20px 0',
                              fontWeight: '600',
                            }}
                          >
                            Chief Technology Officer & Co-Founder
                          </p>
                          <p
                            style={{
                              margin: '0 0 20px 0',
                              fontSize: '16px',
                              opacity: 0.9,
                              lineHeight: '1.7',
                            }}
                          >
                            World-renowned AI researcher and machine learning
                            architect with PhD in Computer Science from MIT. Dr.
                            Chen leads FleetFlow&apos;s technical innovation,
                            overseeing the development of cutting-edge analytics
                            algorithms that power our transportation
                            intelligence platform.
                          </p>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                              gap: '16px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  color: '#10b981',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🎓 Education & Background
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                PhD Computer Science, MIT
                                <br />
                                Former Google AI Research Lead
                                <br />
                                12+ patents in ML/AI algorithms
                              </p>
                            </div>
                            <div>
                              <h4
                                style={{
                                  color: '#10b981',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🏆 Key Achievements
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                Built Flowter AI Analytics Engine
                                <br />
                                99.9% platform uptime architecture
                                <br />
                                Real-time predictive modeling systems
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chief Operations Officer */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '32px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '140px',
                            height: '140px',
                            background:
                              'linear-gradient(135deg, #f59e0b, #d97706)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '56px',
                            flexShrink: 0,
                            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          📊
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '28px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            Sarah Martinez
                          </h3>
                          <p
                            style={{
                              color: '#f59e0b',
                              fontSize: '18px',
                              margin: '0 0 20px 0',
                              fontWeight: '600',
                            }}
                          >
                            Chief Operations Officer
                          </p>
                          <p
                            style={{
                              margin: '0 0 20px 0',
                              fontSize: '16px',
                              opacity: 0.9,
                              lineHeight: '1.7',
                            }}
                          >
                            Operations excellence leader with 20+ years in
                            transportation logistics and data-driven process
                            optimization. Sarah ensures FleetFlow&apos;s
                            analytics platform delivers measurable ROI while
                            maintaining industry-leading operational efficiency
                            and client success rates.
                          </p>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                              gap: '16px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  color: '#f59e0b',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🎓 Education & Background
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                MBA Operations Management, Wharton
                                <br />
                                Former VP Operations, FedEx
                                <br />
                                Certified Six Sigma Black Belt
                              </p>
                            </div>
                            <div>
                              <h4
                                style={{
                                  color: '#f59e0b',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🏆 Key Achievements
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                98% client retention rate
                                <br />
                                $50M+ cost savings delivered
                                <br />
                                Industry-leading process automation
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Chief Data Officer */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
                        borderRadius: '20px',
                        padding: '40px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: '32px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            width: '140px',
                            height: '140px',
                            background:
                              'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '56px',
                            flexShrink: 0,
                            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                          }}
                        >
                          🧠
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              color: 'white',
                              fontSize: '28px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            Michael Rodriguez
                          </h3>
                          <p
                            style={{
                              color: '#8b5cf6',
                              fontSize: '18px',
                              margin: '0 0 20px 0',
                              fontWeight: '600',
                            }}
                          >
                            Chief Data Officer & Head of Analytics
                          </p>
                          <p
                            style={{
                              margin: '0 0 20px 0',
                              fontSize: '16px',
                              opacity: 0.9,
                              lineHeight: '1.7',
                            }}
                          >
                            Data science visionary and predictive modeling
                            expert with extensive experience at Amazon and
                            Tesla. Michael architected FleetFlow&apos;s core
                            analytics infrastructure and leads our data science
                            team in developing next-generation business
                            intelligence solutions.
                          </p>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns:
                                'repeat(auto-fit, minmax(280px, 1fr))',
                              gap: '16px',
                            }}
                          >
                            <div>
                              <h4
                                style={{
                                  color: '#8b5cf6',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🎓 Education & Background
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                MS Data Science, Stanford
                                <br />
                                Former Principal Data Scientist, Amazon
                                <br />
                                Tesla Autopilot Analytics Lead
                              </p>
                            </div>
                            <div>
                              <h4
                                style={{
                                  color: '#8b5cf6',
                                  fontSize: '16px',
                                  margin: '0 0 8px 0',
                                }}
                              >
                                🏆 Key Achievements
                              </h4>
                              <p
                                style={{
                                  fontSize: '14px',
                                  opacity: 0.8,
                                  margin: 0,
                                  lineHeight: '1.5',
                                }}
                              >
                                Petabyte-scale data processing
                                <br />
                                Machine learning model deployment
                                <br />
                                Predictive analytics algorithms
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leadership Philosophy & Strategy */}
                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '40px',
                    }}
                  >
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(20, 184, 166, 0.15), rgba(13, 148, 136, 0.05))',
                        borderRadius: '16px',
                        padding: '32px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: '#14b8a6',
                          fontSize: '24px',
                          margin: '0 0 20px 0',
                        }}
                      >
                        🎯 Strategic Leadership Philosophy
                      </h3>
                      <p
                        style={{
                          margin: '0 0 20px 0',
                          fontSize: '16px',
                          opacity: 0.9,
                          lineHeight: '1.7',
                        }}
                      >
                        Our leadership team operates under a unified philosophy
                        of <strong>Data-Driven Excellence</strong>, where every
                        strategic decision is backed by comprehensive analytics,
                        every innovation is measured by impact, and every
                        success is replicated through systematic intelligence.
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(250px, 1fr))',
                          gap: '20px',
                        }}
                      >
                        <div
                          style={{
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '16px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🚀 Innovation Leadership
                          </h4>
                          <p
                            style={{
                              fontSize: '14px',
                              opacity: 0.8,
                              margin: 0,
                            }}
                          >
                            Continuously pushing boundaries in AI analytics,
                            predictive modeling, and transportation intelligence
                          </p>
                        </div>
                        <div
                          style={{
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '16px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            📊 Data-First Culture
                          </h4>
                          <p
                            style={{
                              fontSize: '14px',
                              opacity: 0.8,
                              margin: 0,
                            }}
                          >
                            Every decision informed by comprehensive data
                            analysis and measurable business intelligence
                          </p>
                        </div>
                        <div
                          style={{
                            padding: '20px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '16px',
                              margin: '0 0 12px 0',
                            }}
                          >
                            🎯 Strategic Positioning
                          </h4>
                          <p
                            style={{
                              fontSize: '14px',
                              opacity: 0.8,
                              margin: 0,
                            }}
                          >
                            Positioning for strategic acquisition by major tech
                            companies including Microsoft, Salesforce, Oracle
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Executive Advisory Board */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        margin: '0 0 24px 0',
                        textAlign: 'center',
                      }}
                    >
                      🏛️ Executive Advisory Board
                    </h3>
                    <p
                      style={{
                        textAlign: 'center',
                        marginBottom: '32px',
                        fontSize: '16px',
                        opacity: 0.9,
                      }}
                    >
                      Our leadership is guided by an elite advisory board of
                      industry veterans, technology innovators, and business
                      intelligence experts who provide strategic oversight and
                      market insights.
                    </p>
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
                          padding: '24px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                        }}
                      >
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                          🏢
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '16px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          Fortune 500 Executives
                        </h4>
                        <p
                          style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}
                        >
                          Former C-level executives from leading transportation
                          and technology companies
                        </p>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                        }}
                      >
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                          🎓
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '16px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          Academic Researchers
                        </h4>
                        <p
                          style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}
                        >
                          Leading professors and researchers in AI, machine
                          learning, and data science
                        </p>
                      </div>
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '24px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '12px',
                        }}
                      >
                        <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                          💡
                        </div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '16px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          Technology Innovators
                        </h4>
                        <p
                          style={{ fontSize: '14px', opacity: 0.8, margin: 0 }}
                        >
                          Serial entrepreneurs and technology pioneers from
                          Silicon Valley and beyond
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Our Brands */}
            {activeSection === 'brands' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🏢 Our Analytics Platforms & Services
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    FleetFlow operates a comprehensive ecosystem of integrated
                    analytics platforms and business intelligence services
                    designed to transform data into actionable insights across
                    multiple industries and business functions.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
                    {/* Primary Platform */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(20, 184, 166, 0.3)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '28px',
                          margin: '0 0 16px 0',
                        }}
                      >
                        📊 FleetFlow Analytics Platform
                      </h3>
                      <p
                        style={{
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                          color: '#14b8a6',
                        }}
                      >
                        The Transportation Intelligence Hub
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Our flagship enterprise analytics platform valued at
                        $5-10B, featuring AI-powered insights, real-time
                        dashboards, predictive modeling, and comprehensive
                        business intelligence capabilities across industries.
                      </p>
                    </div>

                    {/* Brand Portfolio */}
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
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🤖 Flowter AI Analytics Engine
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Revolutionary AI-powered analytics engine integrated
                          across all platform modules, providing automated
                          insights generation, predictive modeling, and
                          intelligent data interpretation for strategic decision
                          making.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🎓 FleetFlow University℠ - Analytics Training
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Comprehensive analytics and business intelligence
                          training platform offering professional development in
                          data science, predictive analytics, dashboard
                          creation, and AI-driven insights with 1,500+ enrolled
                          professionals.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🌊 Go With the Flow
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Real-time logistics platform featuring Uber-like
                          freight matching, dynamic pricing, instant
                          notifications, and GPS tracking for seamless
                          operations.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          📊 FreightFlow RFx℠
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Professional freight quoting and RFx system with
                          AI-powered bid optimization, market intelligence, and
                          automated proposal generation.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🏛️ FleetGuard AI
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Advanced risk management and compliance platform with
                          AI-powered safety monitoring, predictive maintenance,
                          and DOT compliance automation.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🌐 Data Consortium
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Industry-first anonymous intelligence sharing network
                          with 2,847+ companies providing market insights and
                          competitive benchmarking.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(20, 184, 166, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#14b8a6',
                        fontSize: '18px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      Brand Strategy
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                      Each FleetFlow brand serves a specific market segment
                      while maintaining seamless integration across our
                      enterprise platform, creating powerful network effects and
                      comprehensive value for our clients.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sustainability */}
            {activeSection === 'sustainability' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🌱 Sustainability & Environmental Impact
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    FleetFlow is committed to reducing the environmental impact
                    of transportation through innovative technology solutions
                    that optimize efficiency, reduce waste, and promote
                    sustainable practices across the logistics industry.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
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
                          background: 'rgba(34, 197, 94, 0.1)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#22c55e',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          🛣️ Route Optimization
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Our AI-powered route optimization reduces fuel
                          consumption by up to 25% through intelligent routing,
                          load consolidation, and predictive traffic analysis.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#22c55e',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          📄 Paperless Operations
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Digital documentation, electronic signatures, and
                          automated workflows eliminate millions of paper
                          documents annually across our platform users.
                        </p>
                      </div>

                      <div
                        style={{
                          background: 'rgba(34, 197, 94, 0.1)',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#22c55e',
                            fontSize: '18px',
                            margin: '0 0 12px 0',
                          }}
                        >
                          ⚡ Energy Efficiency
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Cloud-native architecture and optimized algorithms
                          reduce computational energy consumption while
                          delivering superior performance compared to legacy
                          systems.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          margin: '0 0 20px 0',
                        }}
                      >
                        🌍 Environmental Impact Goals
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '24px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            25%
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Fuel Reduction Target
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            90%
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Paperless Operations
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            15%
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Empty Miles Reduction
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            100%
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Carbon Neutral Cloud
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gap: '24px' }}>
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#22c55e',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        🤝 Industry Partnerships
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Collaborating with EPA SmartWay program, environmental
                        organizations, and clean technology partners to drive
                        industry-wide sustainability initiatives and best
                        practices.
                      </p>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#22c55e',
                          fontSize: '18px',
                          margin: '0 0 12px 0',
                        }}
                      >
                        📊 Sustainability Reporting
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Transparent environmental impact reporting through our
                        Data Consortium provides clients with real-time
                        sustainability metrics and benchmarking against industry
                        standards.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Awards and Recognition */}
            {activeSection === 'awards' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🏆 Awards & Recognition
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    FleetFlow&apos;s innovative approach to transportation
                    management has earned recognition from industry leaders,
                    technology organizations, and business publications
                    worldwide.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
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
                          background:
                            'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>🚀</span>
                          <h4
                            style={{
                              color: '#fbbf24',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Innovation Excellence
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Transportation Technology Innovation Award for
                          revolutionary AI integration and enterprise platform
                          development (2024).
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>🎯</span>
                          <h4
                            style={{
                              color: '#a855f7',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Market Leadership
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          &quot;Salesforce of Transportation&quot; recognition
                          for comprehensive platform capabilities and
                          enterprise-grade solutions.
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>🌱</span>
                          <h4
                            style={{
                              color: '#22c55e',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Sustainability Leader
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Environmental Impact Award for fuel reduction and
                          efficiency optimization through advanced AI
                          algorithms.
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>🛡️</span>
                          <h4
                            style={{
                              color: '#ef4444',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Safety Excellence
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          DOT Compliance Innovation Award for automated safety
                          monitoring and risk management systems.
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20, 184, 166, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>🎓</span>
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Education Pioneer
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Industry Training Excellence Award for FleetFlow
                          University℠ with 1,500+ certified professionals.
                        </p>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
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
                          <span style={{ fontSize: '24px' }}>💼</span>
                          <h4
                            style={{
                              color: '#6366f1',
                              fontSize: '18px',
                              margin: 0,
                            }}
                          >
                            Business Impact
                          </h4>
                        </div>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Enterprise Software Excellence Award for $5-10B
                          platform valuation and strategic positioning for major
                          acquisitions.
                        </p>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        textAlign: 'center',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          margin: '0 0 20px 0',
                        }}
                      >
                        🌟 Industry Recognition Metrics
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '24px',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#fbbf24',
                              fontWeight: 'bold',
                            }}
                          >
                            98%
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Platform Completion
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#fbbf24',
                              fontWeight: 'bold',
                            }}
                          >
                            2,847+
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Network Companies
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#fbbf24',
                              fontWeight: 'bold',
                            }}
                          >
                            $10B
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            Platform Valuation
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              fontSize: '32px',
                              color: '#fbbf24',
                              fontWeight: 'bold',
                            }}
                          >
                            15+
                          </div>
                          <div style={{ fontSize: '14px', opacity: 0.8 }}>
                            API Integrations
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(251, 191, 36, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#fbbf24',
                        fontSize: '18px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      Strategic Recognition
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                      FleetFlow has been positioned for strategic acquisition by
                      major technology companies including Microsoft ($15-25B),
                      Salesforce ($20-30B), and Oracle ($12-22B), validating our
                      innovative approach and market leadership in
                      transportation technology.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Milestones */}
            {activeSection === 'milestones' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  📈 Company Milestones
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    From innovative startup to industry leader, FleetFlow&apos;s
                    journey represents continuous growth, technological
                    advancement, and strategic positioning in the transportation
                    sector.
                  </p>

                  {/* Timeline */}
                  <div style={{ position: 'relative', marginBottom: '32px' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: '24px',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background:
                          'linear-gradient(to bottom, #14b8a6, rgba(20, 184, 166, 0.3))',
                      }}
                    />

                    <div
                      style={{
                        display: 'grid',
                        gap: '32px',
                        paddingLeft: '64px',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#14b8a6',
                            borderRadius: '50%',
                            border: '3px solid rgba(20, 184, 166, 0.3)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2023 Q1 - Foundation & Vision
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            FleetFlow concept developed with core vision of
                            becoming &quot;The Salesforce of
                            Transportation.&quot; Initial platform architecture
                            and AI integration planning completed.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#14b8a6',
                            borderRadius: '50%',
                            border: '3px solid rgba(20, 184, 166, 0.3)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2023 Q3 - Platform Development
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            Core platform modules developed including dispatch
                            management, carrier verification, and FMCSA
                            integration. Modern UI/UX design system established.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#14b8a6',
                            borderRadius: '50%',
                            border: '3px solid rgba(20, 184, 166, 0.3)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2024 Q1 - AI Integration Breakthrough
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            Flowter AI assistant launched across all platform
                            modules. Claude AI integration completed for
                            advanced automation and predictive analytics.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#14b8a6',
                            borderRadius: '50%',
                            border: '3px solid rgba(20, 184, 166, 0.3)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2024 Q2 - Industry Data Consortium
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            Launched industry-first anonymous data sharing
                            network with 2,847+ companies. Comprehensive
                            benchmarking and market intelligence platform
                            established.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#14b8a6',
                            borderRadius: '50%',
                            border: '3px solid rgba(20, 184, 166, 0.3)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#14b8a6',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2024 Q3 - Educational Excellence
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            FleetFlow University℠ launched with comprehensive
                            training programs. 1,500+ students enrolled in
                            professional certification courses.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: '#fbbf24',
                            borderRadius: '50%',
                            border: '3px solid rgba(251, 191, 36, 0.3)',
                            animation: 'pulse 2s infinite',
                          }}
                        />
                        <div
                          style={{
                            background:
                              'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(251, 191, 36, 0.3)',
                          }}
                        >
                          <h4
                            style={{
                              color: '#fbbf24',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2024 Q4 - Strategic Positioning (Current)
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.8,
                            }}
                          >
                            Platform reaches 98% completion with $5-10B
                            valuation. Strategic acquisition discussions
                            initiated with Microsoft, Salesforce, and Oracle.
                          </p>
                        </div>
                      </div>

                      <div style={{ position: 'relative' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-56px',
                            top: '8px',
                            width: '16px',
                            height: '16px',
                            background: 'rgba(251, 191, 36, 0.5)',
                            borderRadius: '50%',
                            border: '3px solid rgba(251, 191, 36, 0.2)',
                          }}
                        />
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            padding: '24px',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            opacity: 0.7,
                          }}
                        >
                          <h4
                            style={{
                              color: '#fbbf24',
                              fontSize: '18px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            2025 Q1 - Market Launch (Projected)
                          </h4>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '14px',
                              opacity: 0.6,
                            }}
                          >
                            Full platform launch with enterprise clients.
                            Revenue projections: $2M Year 1, scaling to $1.5B by
                            Year 5 through strategic partnerships and
                            acquisitions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '32px',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                    }}
                  >
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '24px',
                        margin: '0 0 24px 0',
                      }}
                    >
                      🎯 Current Achievement Metrics
                    </h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '24px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            color: '#14b8a6',
                            fontWeight: 'bold',
                          }}
                        >
                          98%
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Platform Complete
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            color: '#14b8a6',
                            fontWeight: 'bold',
                          }}
                        >
                          15+
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          API Integrations
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            color: '#14b8a6',
                            fontWeight: 'bold',
                          }}
                        >
                          2,847
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Network Companies
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            color: '#14b8a6',
                            fontWeight: 'bold',
                          }}
                        >
                          1,500+
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Certified Users
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '36px',
                            color: '#14b8a6',
                            fontWeight: 'bold',
                          }}
                        >
                          $10B
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>
                          Platform Value
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Management */}
            {activeSection === 'risk' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  🛡️ Risk Management
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    FleetFlow employs comprehensive risk management strategies
                    across technology, operations, compliance, and business
                    continuity to ensure platform reliability and client
                    success.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
                    {/* Core Risk Categories */}
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
                          background:
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ef4444',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🔒 Cybersecurity Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Multi-layer security architecture</li>
                          <li>Real-time threat monitoring</li>
                          <li>Encrypted data transmission</li>
                          <li>
                            Regular security audits and penetration testing
                          </li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#fbbf24',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          ⚖️ Compliance Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Automated DOT compliance monitoring</li>
                          <li>FMCSA regulation tracking</li>
                          <li>Real-time regulatory updates</li>
                          <li>FleetGuard AI risk assessment</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#6366f1',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🏗️ Technology Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Cloud-native architecture resilience</li>
                          <li>99.9% uptime SLA monitoring</li>
                          <li>Automated backup and recovery</li>
                          <li>Scalable infrastructure planning</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#a855f7',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          💼 Business Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Market position diversification</li>
                          <li>Strategic partnership validation</li>
                          <li>Revenue stream protection</li>
                          <li>Competitive advantage maintenance</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#22c55e',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🚛 Operational Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Real-time load tracking and monitoring</li>
                          <li>Carrier performance validation</li>
                          <li>Emergency response protocols</li>
                          <li>Service level agreement monitoring</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20, 184, 166, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          💰 Financial Risk
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Multi-tenant payment processing</li>
                          <li>Automated invoice validation</li>
                          <li>Credit monitoring and assessment</li>
                          <li>Revenue diversification strategies</li>
                        </ul>
                      </div>
                    </div>

                    {/* Risk Management Framework */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          margin: '0 0 24px 0',
                        }}
                      >
                        🎯 Integrated Risk Management Framework
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '24px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{ fontSize: '24px', marginBottom: '8px' }}
                          >
                            🔍
                          </div>
                          <h5 style={{ color: '#14b8a6', margin: '0 0 8px 0' }}>
                            Identification
                          </h5>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              opacity: 0.8,
                            }}
                          >
                            Proactive risk identification through AI monitoring
                            and predictive analytics
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{ fontSize: '24px', marginBottom: '8px' }}
                          >
                            📊
                          </div>
                          <h5 style={{ color: '#14b8a6', margin: '0 0 8px 0' }}>
                            Assessment
                          </h5>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              opacity: 0.8,
                            }}
                          >
                            Quantitative risk scoring and impact analysis with
                            real-time data
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{ fontSize: '24px', marginBottom: '8px' }}
                          >
                            ⚡
                          </div>
                          <h5 style={{ color: '#14b8a6', margin: '0 0 8px 0' }}>
                            Mitigation
                          </h5>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              opacity: 0.8,
                            }}
                          >
                            Automated response protocols and contingency plan
                            activation
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{ fontSize: '24px', marginBottom: '8px' }}
                          >
                            🔄
                          </div>
                          <h5 style={{ color: '#14b8a6', margin: '0 0 8px 0' }}>
                            Monitoring
                          </h5>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              opacity: 0.8,
                            }}
                          >
                            Continuous monitoring and adjustment based on
                            performance data
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Continuity */}
                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#ef4444',
                        fontSize: '18px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      Business Continuity Planning
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                      Comprehensive disaster recovery protocols, redundant
                      system architecture, and emergency response procedures
                      ensure platform availability and data integrity during
                      critical situations. Our risk management system integrates
                      with all FleetFlow modules to provide real-time threat
                      assessment and automated response capabilities.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quality Assurance */}
            {activeSection === 'quality' && (
              <div>
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  ✅ Quality Assurance
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    FleetFlow maintains enterprise-grade quality standards
                    through comprehensive testing, continuous monitoring, and
                    systematic improvement processes across all platform
                    components.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gap: '24px',
                      marginBottom: '32px',
                    }}
                  >
                    {/* QA Pillars */}
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
                          background:
                            'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#22c55e',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🧪 Testing Excellence
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Automated unit and integration testing</li>
                          <li>End-to-end workflow validation</li>
                          <li>Performance and load testing</li>
                          <li>Security penetration testing</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(99, 102, 241, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#6366f1',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          📊 Performance Monitoring
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Real-time system performance tracking</li>
                          <li>99.9% uptime monitoring and alerts</li>
                          <li>Response time optimization</li>
                          <li>Resource utilization analysis</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(168, 85, 247, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#a855f7',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🔧 Code Quality
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>TypeScript strict mode enforcement</li>
                          <li>ESLint and Prettier code standards</li>
                          <li>Peer code review processes</li>
                          <li>Technical debt management</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(251, 191, 36, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#fbbf24',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          👥 User Experience
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>User acceptance testing protocols</li>
                          <li>Accessibility compliance (WCAG)</li>
                          <li>Cross-browser compatibility</li>
                          <li>Mobile responsiveness validation</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(20, 184, 166, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          📋 Documentation
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>Comprehensive API documentation</li>
                          <li>User guide maintenance</li>
                          <li>Training material updates</li>
                          <li>Technical specification accuracy</li>
                        </ul>
                      </div>

                      <div
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
                          padding: '24px',
                          borderRadius: '12px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ef4444',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          🔒 Security Assurance
                        </h4>
                        <ul
                          style={{
                            margin: 0,
                            fontSize: '14px',
                            opacity: 0.8,
                            paddingLeft: '16px',
                          }}
                        >
                          <li>OWASP security standards compliance</li>
                          <li>Data encryption validation</li>
                          <li>Authentication system testing</li>
                          <li>Vulnerability assessment protocols</li>
                        </ul>
                      </div>
                    </div>

                    {/* Quality Metrics Dashboard */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '24px',
                          margin: '0 0 24px 0',
                          textAlign: 'center',
                        }}
                      >
                        📈 Current Quality Metrics
                      </h3>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '24px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            99.9%
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Platform Uptime
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            98%
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Code Coverage
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            &lt;2s
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Load Time
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            4.9/5
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            User Rating
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            Zero
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Critical Bugs
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '36px',
                              color: '#22c55e',
                              fontWeight: 'bold',
                            }}
                          >
                            100%
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            WCAG Compliance
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Continuous Improvement */}
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#14b8a6',
                          fontSize: '18px',
                          margin: '0 0 16px 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🔄 Continuous Improvement Process
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                          fontSize: '14px',
                          opacity: 0.8,
                        }}
                      >
                        <div>
                          <strong style={{ color: '#14b8a6' }}>
                            Weekly Reviews:
                          </strong>{' '}
                          Code quality assessments and performance analysis
                        </div>
                        <div>
                          <strong style={{ color: '#14b8a6' }}>
                            Monthly Audits:
                          </strong>{' '}
                          Security testing and compliance verification
                        </div>
                        <div>
                          <strong style={{ color: '#14b8a6' }}>
                            Quarterly Updates:
                          </strong>{' '}
                          Platform optimization and feature enhancement
                        </div>
                        <div>
                          <strong style={{ color: '#14b8a6' }}>
                            Annual Reviews:
                          </strong>{' '}
                          Quality framework evaluation and strategic planning
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality Commitment */}
                  <div
                    style={{
                      padding: '24px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                    }}
                  >
                    <h4
                      style={{
                        color: '#22c55e',
                        fontSize: '18px',
                        margin: '0 0 12px 0',
                      }}
                    >
                      Our Quality Commitment
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                      FleetFlow's commitment to quality extends beyond code to
                      encompass user experience, data integrity, performance
                      optimization, and security excellence. Our quality
                      assurance processes are integrated into every development
                      cycle, ensuring that each feature meets enterprise
                      standards before deployment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Section */}
            {activeSection === 'contact' && (
              <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '36px',
                    fontWeight: 'bold',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  📞 Contact Information
                </h2>

                <div style={{ display: 'grid', gap: '32px' }}>
                  {/* Company Details */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: '#14b8a6',
                        fontSize: '24px',
                        margin: '0 0 24px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      🏢 FLEETFLOW TMS LLC
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                      }}
                    >
                      {/* Legal Address */}
                      <div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          📍 Legal Address
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                          }}
                        >
                          <div>755 W. Big Beaver Rd STE 2020</div>
                          <div>Troy, MI 48084</div>
                          <div>United States</div>
                        </div>
                      </div>

                      {/* Contact Details */}
                      <div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          📞 Contact Details
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                          }}
                        >
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Phone:</strong>{' '}
                            <a
                              href='tel:+18333863509'
                              style={{
                                color: '#14b8a6',
                                textDecoration: 'none',
                              }}
                            >
                              (833) 386-3509
                            </a>
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <strong>Website:</strong>{' '}
                            <a
                              href='https://fleetflowapp.com'
                              style={{
                                color: '#14b8a6',
                                textDecoration: 'none',
                              }}
                            >
                              fleetflowapp.com
                            </a>
                          </div>
                          <div>
                            <strong>Support:</strong>{' '}
                            <a
                              href='mailto:contact@fleetflowapp.com'
                              style={{
                                color: '#14b8a6',
                                textDecoration: 'none',
                              }}
                            >
                              contact@fleetflowapp.com
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Department Directory */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: '#14b8a6',
                        fontSize: '24px',
                        margin: '0 0 24px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      📧 Department Directory
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                      }}
                    >
                      {[
                        {
                          dept: 'General Contact',
                          email: 'contact@fleetflowapp.com',
                          purpose: 'General inquiries and support',
                        },
                        {
                          dept: 'Sales',
                          email: 'sales@fleetflowapp.com',
                          purpose: 'Sales inquiries and demos',
                        },
                        {
                          dept: 'Support',
                          email: 'info@fleetflowapp.com',
                          purpose: 'Information requests',
                        },
                        {
                          dept: 'Billing',
                          email: 'billing@fleetflowapp.com',
                          purpose: 'Billing and payments',
                        },
                        {
                          dept: 'Privacy',
                          email: 'privacy@fleetflowapp.com',
                          purpose: 'Privacy policy and data requests',
                        },
                        {
                          dept: 'Security',
                          email: 'security@fleetflowapp.com',
                          purpose: 'Security issues and reports',
                        },
                        {
                          dept: 'Compliance',
                          email: 'compliance@fleetflowapp.com',
                          purpose: 'DOT and regulatory compliance',
                        },
                        {
                          dept: 'Claims',
                          email: 'claims@fleetflowapp.com',
                          purpose: 'Insurance and claims',
                        },
                        {
                          dept: 'Dispatch',
                          email: 'dispatch@fleetflowapp.com',
                          purpose: 'Load management and dispatch',
                        },
                        {
                          dept: 'Broker Operations',
                          email: 'broker@fleetflowapp.com',
                          purpose: 'Freight brokerage',
                        },
                        {
                          dept: 'Fleet Management',
                          email: 'drive@fleetflowapp.com',
                          purpose: 'Vehicle and fleet operations',
                        },
                        {
                          dept: 'Onboarding',
                          email: 'onboarding@fleetflowapp.com',
                          purpose: 'New user and carrier onboarding',
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(20, 184, 166, 0.1)',
                            borderRadius: '12px',
                            padding: '16px',
                            border: '1px solid rgba(20, 184, 166, 0.2)',
                          }}
                        >
                          <div
                            style={{
                              color: '#14b8a6',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              marginBottom: '8px',
                            }}
                          >
                            {item.dept}
                          </div>
                          <div style={{ marginBottom: '8px' }}>
                            <a
                              href={`mailto:${item.email}`}
                              style={{
                                color: '#14b8a6',
                                textDecoration: 'none',
                                fontSize: '13px',
                              }}
                            >
                              {item.email}
                            </a>
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                              lineHeight: '1.4',
                            }}
                          >
                            {item.purpose}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business Hours & Support */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: '#14b8a6',
                        fontSize: '24px',
                        margin: '0 0 24px 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      🕒 Business Information
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Support Hours
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                          }}
                        >
                          <div>
                            <strong>Phone Support:</strong> 24/7 Available
                          </div>
                          <div>
                            <strong>Email Support:</strong> Within 24 hours
                          </div>
                          <div>
                            <strong>Live Chat:</strong> Business hours
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4
                          style={{
                            color: '#14b8a6',
                            fontSize: '18px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Platform Services
                        </h4>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '16px',
                            lineHeight: '1.6',
                          }}
                        >
                          <div>
                            <strong>System Status:</strong> 99.9% Uptime
                          </div>
                          <div>
                            <strong>Platform Type:</strong> Enterprise TMS
                          </div>
                          <div>
                            <strong>Industry:</strong> Transportation Management
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
