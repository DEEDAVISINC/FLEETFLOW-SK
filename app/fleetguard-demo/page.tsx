'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function FleetGuardDemoPage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'overview' | 'protection' | 'monitoring'
  >('overview');

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3730a3 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {/* Dashboard Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <Link
            href='/dashboard'
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
            }}
          >
            🏠 Back to Dashboard
          </Link>
        </div>

        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '40px',
            color: 'white',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '800',
              margin: '0 0 12px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            🛡️ FleetGuard AI - Fraud Detection
          </h1>
          <p
            style={{
              fontSize: '18px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '0 0 8px 0',
            }}
          >
            Enterprise-grade fraud protection built into FleetFlow
          </p>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(139, 92, 246, 0.9)',
              margin: '0',
              fontWeight: '600',
            }}
          >
            🛡️ Part of FACIS™ (FleetGuard Advanced Carrier Intelligence System)
          </p>

          {/* Navigation Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(['overview', 'protection', 'monitoring'] as const).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background:
                        selectedCategory === category
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      fontSize: '14px',
                    }}
                  >
                    {category === 'overview' && '🔍 System Overview'}
                    {category === 'protection' && '🛡️ Fraud Protection'}
                    {category === 'monitoring' && '📊 Risk Monitoring'}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px',
            color: 'white',
            boxShadow: '0 8px 32px rgba(5, 150, 105, 0.3)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  margin: '0 0 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                ✅ FleetGuard AI Status: ACTIVE
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                  fontSize: '14px',
                }}
              >
                <strong>Detection Rate:</strong> 99.7% |{' '}
                <strong>Response Time:</strong> &lt;250ms |{' '}
                <strong>Protected Value:</strong> $2.3B+
              </p>
            </div>
            <div>
              <Link
                href='/carriers/enhanced-portal#document-compliance-dashboard'
                style={{ textDecoration: 'none' }}
              >
                <button
                  style={{
                    background: 'white',
                    color: '#047857',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                  }}
                >
                  View Carriers
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        {selectedCategory === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* How It Works */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                🔍 How FleetGuard AI Works
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 20px 0',
                  lineHeight: '1.6',
                }}
              >
                FleetGuard AI automatically screens every carrier during
                onboarding using advanced fraud detection algorithms. The system
                analyzes FMCSA data, validates business addresses, checks
                document authenticity, and monitors behavioral patterns to
                provide instant risk assessments and approval recommendations.
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#60a5fa',
                    }}
                  >
                    1. Address Verification
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                    }}
                  >
                    Detects virtual offices, PO boxes, and residential addresses
                    using Google Maps API
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#34d399',
                    }}
                  >
                    2. FMCSA Cross-Check
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                    }}
                  >
                    Validates DOT numbers and safety ratings against federal
                    databases
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#fbbf24',
                    }}
                  >
                    3. Document Analysis
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                    }}
                  >
                    AI scans for document tampering, forgery, or inconsistencies
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#f472b6',
                    }}
                  >
                    4. Behavior Patterns
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                    }}
                  >
                    Identifies suspicious application behaviors and coordinated
                    fraud attempts
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#a78bfa',
                    }}
                  >
                    5. Risk Assessment
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: '0',
                    }}
                  >
                    Generates instant risk scores with approve/reject
                    recommendations
                  </p>
                </div>
              </div>
            </div>

            {/* Business Impact */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                💰 Business Protection Value
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#34d399',
                    }}
                  >
                    Financial Protection
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div style={{ marginBottom: '6px' }}>
                      💰 Prevent cargo theft ($50K-$200K+ per incident)
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      🏦 Avoid payment fraud and factoring disputes
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      ⚖️ Reduce legal costs from carrier disputes
                    </div>
                    <div>📋 Prevent compliance violations and fines</div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#60a5fa',
                    }}
                  >
                    Operational Benefits
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div style={{ marginBottom: '6px' }}>
                      ⚡ Faster carrier onboarding decisions
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      🎯 Higher quality carrier network
                    </div>
                    <div style={{ marginBottom: '6px' }}>
                      📊 Better risk management insights
                    </div>
                    <div>🛡️ Enhanced reputation and customer trust</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'protection' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Core Protection Features */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                🛡️ Core Protection Features
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#fca5a5',
                    }}
                  >
                    🏢 Virtual Office Detection
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Advanced geospatial analysis identifies fake business
                    addresses and virtual offices
                  </p>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#ef4444',
                      fontWeight: '600',
                    }}
                  >
                    97.3% Detection Accuracy
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#93c5fd',
                    }}
                  >
                    📄 Document Authenticity
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    AI analyzes insurance certificates and licenses for
                    tampering or forgery
                  </p>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#3b82f6',
                      fontWeight: '600',
                    }}
                  >
                    99.1% Forgery Detection
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#fcd34d',
                    }}
                  >
                    📊 Behavioral Analysis
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Pattern recognition identifies suspicious behaviors and
                    coordinated fraud
                  </p>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#f59e0b',
                      fontWeight: '600',
                    }}
                  >
                    Real-time Monitoring
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#6ee7b7',
                    }}
                  >
                    📋 Regulatory Compliance
                  </h4>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    Automated verification against FMCSA databases and DOT
                    registrations
                  </p>
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    Live Database Sync
                  </div>
                </div>
              </div>
            </div>

            {/* What You Receive */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                📋 Analysis Results You Receive
              </h2>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 16px 0',
                }}
              >
                After automatic analysis (2-3 seconds), you receive detailed
                risk assessment data:
              </p>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#fca5a5',
                    }}
                  >
                    🚨 Fraud Risk Assessment
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div>• Clear risk rating (Low/Medium/High/Critical)</div>
                    <div>• Specific fraud indicators found</div>
                    <div>• Business legitimacy verification</div>
                    <div>• Address validation results</div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#93c5fd',
                    }}
                  >
                    📋 Safety & Compliance
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div>• FMCSA safety rating verification</div>
                    <div>• DOT compliance status</div>
                    <div>• Insurance verification</div>
                    <div>• Operating authority validation</div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#fcd34d',
                    }}
                  >
                    🔍 Detailed Analysis
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div>• Virtual office detection results</div>
                    <div>• Suspicious business patterns</div>
                    <div>• Document authenticity scores</div>
                    <div>• Cross-reference verification</div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 8px 0',
                      color: '#6ee7b7',
                    }}
                  >
                    💡 Action Recommendations
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div>• Clear next steps for each carrier</div>
                    <div>• Risk mitigation strategies</div>
                    <div>• Additional verification needed</div>
                    <div>• Confidence level in assessment</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedCategory === 'monitoring' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {/* Performance Metrics */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                📊 Real-time Performance Metrics
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#6ee7b7',
                      margin: '0 0 4px 0',
                    }}
                  >
                    1,247
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Carriers Analyzed
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#fca5a5',
                      margin: '0 0 4px 0',
                    }}
                  >
                    23
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Fraud Attempts Blocked
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#fcd34d',
                      margin: '0 0 4px 0',
                    }}
                  >
                    187ms
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Average Response Time
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#93c5fd',
                      margin: '0 0 4px 0',
                    }}
                  >
                    99.7%
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Detection Accuracy
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Distribution */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                📈 Risk Level Distribution
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6ee7b7',
                      }}
                    >
                      🟢 Low Risk
                    </span>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#10b981',
                      }}
                    >
                      89%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '4px',
                    }}
                  >
                    1,109 carriers approved automatically
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#fcd34d',
                      }}
                    >
                      🟡 Medium Risk
                    </span>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#f59e0b',
                      }}
                    >
                      9%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '4px',
                    }}
                  >
                    115 carriers flagged for review
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#fca5a5',
                      }}
                    >
                      🔴 High Risk
                    </span>
                    <span
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#ef4444',
                      }}
                    >
                      2%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginTop: '4px',
                    }}
                  >
                    23 carriers blocked automatically
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                color: 'white',
              }}
            >
              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  margin: '0 0 16px 0',
                  color: 'white',
                }}
              >
                🔧 System Integration Status
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '16px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#34d399',
                    }}
                  >
                    ✅ Active Integrations
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      🤖 Claude AI - Fraud Analysis
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      🗺️ Google Maps API - Address Validation
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      🚛 FMCSA SAFER API - DOT Verification
                    </div>
                    <div>📍 USPS API - Address Standardization</div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      margin: '0 0 12px 0',
                      color: '#60a5fa',
                    }}
                  >
                    📊 Performance Metrics
                  </h4>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    <div style={{ marginBottom: '4px' }}>
                      ⚡ Sub-second analysis (&lt;250ms)
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      🎯 99.9% system uptime
                    </div>
                    <div style={{ marginBottom: '4px' }}>
                      🔄 Real-time database sync
                    </div>
                    <div>📈 Zero false positives this month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: 'white',
            }}
          >
            🛡️ FleetGuard AI is Already Protecting Your Business
          </h3>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              lineHeight: '1.5',
            }}
          >
            FleetGuard AI is seamlessly integrated into FleetFlow's core
            platform, providing continuous fraud protection throughout your
            carrier onboarding process. The system operates autonomously with
            zero configuration, requiring no staff training or workflow changes
            while delivering enterprise-grade security and risk assessment
            capabilities.
          </p>
        </div>
      </div>
    </div>
  );
}
