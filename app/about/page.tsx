'use client';

import { useState } from 'react';

export default function AboutUsPage() {
  const [activeSection, setActiveSection] = useState('culture');

  const sections = [
    { id: 'culture', label: 'Our Culture', icon: '🌟' },
    { id: 'leadership', label: 'Leadership', icon: '👥' },
    { id: 'brands', label: 'Our Brands', icon: '🏢' },
    { id: 'sustainability', label: 'Sustainability', icon: '🌱' },
    { id: 'awards', label: 'Awards & Recognition', icon: '🏆' },
    { id: 'milestones', label: 'Milestones', icon: '📈' },
    { id: 'risk', label: 'Risk Management', icon: '🛡️' },
    { id: 'quality', label: 'Quality Assurance', icon: '✅' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
          The Salesforce of Transportation - Revolutionizing logistics through
          enterprise software excellence
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
                    <strong>Go With the Flow</strong> - our foundational
                    philosophy that drives everything we do. We've built a
                    culture where innovation meets reliability, and where every
                    team member contributes to revolutionizing the
                    transportation industry.
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
                        Innovation First
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        We push boundaries with AI-powered solutions, from
                        Flowter AI assistant to revolutionary load optimization
                        algorithms that rival $200K+ enterprise software.
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
                        Transparency
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Open communication, clear processes, and honest
                        relationships with our clients, partners, and team
                        members define our approach to business.
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
                        Excellence
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Our 98-99% complete platform demonstrates our commitment
                        to delivering enterprise-grade solutions that exceed
                        industry standards.
                      </p>
                    </div>
                  </div>
                  <p>
                    We foster an environment where continuous learning through{' '}
                    <strong>FleetFlow University℠</strong>
                    ensures our team stays ahead of industry trends, and where
                    every voice contributes to our mission of becoming "The
                    Salesforce of Transportation."
                  </p>
                </div>
              </div>
            )}

            {/* Leadership */}
            {activeSection === 'leadership' && (
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
                  👥 Leadership Team
                </h2>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.8',
                    fontSize: '16px',
                  }}
                >
                  <p style={{ marginBottom: '32px' }}>
                    Our leadership team combines decades of transportation
                    industry experience with cutting-edge technology expertise
                    to drive FleetFlow's vision of transforming logistics
                    operations.
                  </p>

                  <div style={{ display: 'grid', gap: '32px' }}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '32px',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          width: '120px',
                          height: '120px',
                          background:
                            'linear-gradient(135deg, #14b8a6, #0d9488)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                          flexShrink: 0,
                        }}
                      >
                        👨‍💼
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3
                          style={{
                            color: 'white',
                            fontSize: '24px',
                            margin: '0 0 8px 0',
                          }}
                        >
                          Executive Leadership
                        </h3>
                        <p
                          style={{
                            color: '#14b8a6',
                            fontSize: '16px',
                            margin: '0 0 16px 0',
                          }}
                        >
                          Chief Executive Officer & Founder
                        </p>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Visionary leadership driving FleetFlow's evolution
                          into a $5-10B enterprise platform. With deep expertise
                          in transportation logistics and enterprise software
                          development, our leadership has positioned FleetFlow
                          for strategic acquisition by major tech companies
                          including Microsoft, Salesforce, and Oracle.
                        </p>
                      </div>
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
                          🔬 Technology & Innovation
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Leading AI integration with Claude AI, advanced
                          analytics, and revolutionary Flowter AI assistant
                          across all platform modules.
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
                          🚛 Operations Excellence
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Expert oversight of DOT compliance automation, driver
                          management systems, and industry-wide data consortium
                          initiatives.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '32px',
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
                      Leadership Philosophy
                    </h4>
                    <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                      Our leadership believes in empowering teams through
                      transparent communication, continuous innovation, and
                      strategic positioning for long-term success in the
                      transportation technology sector.
                    </p>
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
                  🏢 Our Brands & Services
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
                    brands and services designed to serve every aspect of
                    transportation and logistics operations.
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
                        🚛 FleetFlow Enterprise Platform
                      </h3>
                      <p
                        style={{
                          margin: '0 0 16px 0',
                          fontSize: '18px',
                          color: '#14b8a6',
                        }}
                      >
                        The Salesforce of Transportation
                      </p>
                      <p style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}>
                        Our flagship enterprise software platform valued at
                        $5-10B, featuring AI-powered dispatch, real-time
                        tracking, DOT compliance automation, and comprehensive
                        fleet management capabilities.
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
                          🤖 Flowter AI
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Revolutionary AI assistant integrated across all
                          platform modules, providing intelligent automation,
                          predictive analytics, and personalized user
                          experiences.
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
                          🎓 FleetFlow University℠
                        </h4>
                        <p
                          style={{ margin: 0, fontSize: '14px', opacity: 0.8 }}
                        >
                          Comprehensive training and certification platform
                          offering professional development for dispatchers,
                          brokers, carriers, and drivers with 1,500+ enrolled
                          students.
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
                    FleetFlow's innovative approach to transportation management
                    has earned recognition from industry leaders, technology
                    organizations, and business publications worldwide.
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
                          "Salesforce of Transportation" recognition for
                          comprehensive platform capabilities and
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
                    From innovative startup to industry leader, FleetFlow's
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
                            becoming "The Salesforce of Transportation." Initial
                            platform architecture and AI integration planning
                            completed.
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
