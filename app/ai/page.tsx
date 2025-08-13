'use client';

import { Building2, Target, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import AIAutomationDashboard from '../components/AIAutomationDashboard';
import AIFlowPlatform from '../components/AIFlowPlatform';
import AIHubCRMDashboard from '../components/AIHubCRMDashboard';
import DetailedProspectViewer from '../components/DetailedProspectViewer';
import { Badge } from '../components/ui/badge';

export default function AIHubPage() {
  const [currentPage, setCurrentPage] = useState<'ai-flow' | 'ai-hub'>(
    'ai-hub'
  );

  // Strategic Acquisition Pipeline state
  const [acquisitionData, setAcquisitionData] = useState(null);
  const [acquisitionLoading, setAcquisitionLoading] = useState(true);

  // Shipper Discovery state
  const [shipperData, setShipperData] = useState(null);
  const [shipperLoading, setShipperLoading] = useState(true);

  // CRM Lead Manager state
  const [showCRM, setShowCRM] = useState(false);

  // Detailed prospect views state
  const [activeProspectView, setActiveProspectView] = useState<string | null>(
    null
  );

  // Toggle between Strategic Operations and AI Automation Dashboard
  const [activeView, setActiveView] = useState<'strategic' | 'automation'>(
    'strategic'
  );

  // Load Strategic Acquisition data
  useEffect(() => {
    fetch('/api/ai-flow/strategic-acquisition')
      .then((response) => response.json())
      .then((data) => {
        setAcquisitionData(data);
        setAcquisitionLoading(false);
      })
      .catch((error) => {
        console.error('Error loading acquisition data:', error);
        setAcquisitionLoading(false);
      });
  }, []);

  // Load Shipper Discovery data
  useEffect(() => {
    fetch(
      '/api/ai-flow/shipper-discovery?tenantId=tenant-demo-123&metrics=true'
    )
      .then((response) => response.json())
      .then((data) => {
        setShipperData(data);
        setShipperLoading(false);
      })
      .catch((error) => {
        console.error('Error loading shipper data:', error);
        setShipperLoading(false);
      });
  }, []);

  const flipPage = () => {
    setCurrentPage(currentPage === 'ai-flow' ? 'ai-hub' : 'ai-flow');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, rgba(255, 20, 147, 0.15) 0%, rgba(236, 72, 153, 0.12) 25%, rgba(219, 39, 119, 0.10) 50%, rgba(190, 24, 93, 0.08) 100%),
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%),
        radial-gradient(circle at 20% 20%, rgba(30, 41, 59, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(51, 65, 85, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(71, 85, 105, 0.04) 0%, transparent 50%)
      `,
        backgroundSize:
          '100% 100%, 100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Flip Book Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background:
                      currentPage === 'ai-flow'
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color:
                      currentPage === 'ai-flow'
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  AI Flow
                </span>
              </div>
              <button
                onClick={flipPage}
                style={{
                  background: 'linear-gradient(135deg, #334155, #475569)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(30, 41, 59, 0.3)',
                }}
              >
                {currentPage === 'ai-flow' ? 'Next Page →' : '← Previous Page'}
              </button>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <div
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background:
                      currentPage === 'ai-hub'
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.4)',
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color:
                      currentPage === 'ai-hub'
                        ? '#ffffff'
                        : 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  AI Hub
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* View Toggle - Only show on AI Hub page */}
        {currentPage === 'ai-hub' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px',
                display: 'flex',
                gap: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <button
                onClick={() => setActiveView('strategic')}
                style={{
                  background:
                    activeView === 'strategic'
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    activeView === 'strategic'
                      ? '0 4px 12px rgba(255, 255, 255, 0.1)'
                      : 'none',
                }}
              >
                🎯 Strategic Operations
              </button>
              <button
                onClick={() => setActiveView('automation')}
                style={{
                  background:
                    activeView === 'automation'
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'transparent',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow:
                    activeView === 'automation'
                      ? '0 4px 12px rgba(255, 255, 255, 0.1)'
                      : 'none',
                }}
              >
                🤖 AI Automation Dashboard
              </button>
            </div>
          </div>
        )}

        {/* AI Flow Page - Working Platform */}
        {currentPage === 'ai-flow' && <AIFlowPlatform />}

        {/* AI Hub Page */}
        {currentPage === 'ai-hub' && (
          <div>
            {/* AI Hub Header */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
              }}
            >
              <h1
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 16px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                AI Hub - Intelligent Automation Center
              </h1>
              <p
                style={{
                  fontSize: '20px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                Complete AI-powered freight operations with comprehensive
                automation and intelligence
              </p>
            </div>

            {/* Quick Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#60a5fa',
                    margin: '0 0 8px 0',
                  }}
                >
                  15
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                  }}
                >
                  AI Workflows
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#34d399',
                    margin: '0 0 8px 0',
                  }}
                >
                  94%
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                  }}
                >
                  Automation Rate
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#a78bfa',
                    margin: '0 0 8px 0',
                  }}
                >
                  $2.4M
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                  }}
                >
                  Cost Savings
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: '#fbbf24',
                    margin: '0 0 8px 0',
                  }}
                >
                  24/7
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                  }}
                >
                  AI Monitoring
                </div>
              </div>
            </div>

            {/* AI Academy */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 24px 0',
                  textAlign: 'center',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                🎓 AI Academy
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 16px 0',
                    }}
                  >
                    AI Fundamentals
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      paddingLeft: '20px',
                      lineHeight: '1.6',
                    }}
                  >
                    <li>• Machine Learning Basics</li>
                    <li>• Neural Networks in Logistics</li>
                    <li>• Data Analytics for Freight</li>
                    <li>• Predictive Modeling</li>
                  </ul>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Advanced AI Applications
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      paddingLeft: '20px',
                      lineHeight: '1.6',
                    }}
                  >
                    <li>• Route Optimization Algorithms</li>
                    <li>• Dynamic Pricing Models</li>
                    <li>• Carrier Matching Systems</li>
                    <li>• Demand Forecasting</li>
                  </ul>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Implementation Guide
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      paddingLeft: '20px',
                      lineHeight: '1.6',
                    }}
                  >
                    <li>• API Integration</li>
                    <li>• Workflow Automation</li>
                    <li>• Performance Monitoring</li>
                    <li>• ROI Analysis</li>
                  </ul>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      margin: '0 0 16px 0',
                    }}
                  >
                    Best Practices
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      paddingLeft: '20px',
                      lineHeight: '1.6',
                    }}
                  >
                    <li>• Data Quality Management</li>
                    <li>• Model Training & Validation</li>
                    <li>• Continuous Improvement</li>
                    <li>• Compliance & Security</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic Operations View */}
            {activeView === 'strategic' && (
              <div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '32px',
                    marginBottom: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: 'white',
                      margin: '0 0 24px 0',
                      textAlign: 'center',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}
                  >
                    🎯 Strategic Operations Center
                  </h2>
                  <p
                    style={{
                      fontSize: '18px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      lineHeight: '1.6',
                    }}
                  >
                    Advanced AI-powered strategic acquisition, prospect
                    discovery, and CRM management platform.
                  </p>
                </div>
                {/* Strategic Acquisition Pipeline */}
                {/* Strategic Acquisition Pipeline - AI Flow Style */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h2
                    style={{
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Target style={{ color: '#ff1493' }} />
                    🎯 Strategic Acquisition Pipeline
                  </h2>

                  {/* KPI Dashboard */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    {[
                      {
                        label: 'Strategic Buyers',
                        value:
                          acquisitionData?.data?.strategicBuyers?.length || 5,
                        color: '#10b981',
                        icon: '🏢',
                        status: 'ACTIVE',
                      },
                      {
                        label: 'Active Campaigns',
                        value:
                          acquisitionData?.data?.outreachCampaigns?.length || 8,
                        color: '#3b82f6',
                        icon: '📧',
                        status: 'RUNNING',
                      },
                      {
                        label: 'Demo Environments',
                        value:
                          acquisitionData?.data?.demoEnvironments?.length || 3,
                        color: '#8b5cf6',
                        icon: '🖥️',
                        status: 'READY',
                      },
                      {
                        label: 'Pipeline Value',
                        value: '$15-25B',
                        color: '#f59e0b',
                        icon: '💰',
                        status: 'TARGET',
                      },
                      {
                        label: 'Response Rate',
                        value: '87%',
                        color: '#06b6d4',
                        icon: '📈',
                        status: 'HIGH',
                      },
                      {
                        label: 'Meetings Booked',
                        value: '12',
                        color: '#ef4444',
                        icon: '🤝',
                        status: 'SCHEDULED',
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '12px',
                          padding: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '16px',
                              padding: '4px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                            }}
                          >
                            {stat.icon}
                          </div>
                          <div
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '8px',
                              fontWeight: '700',
                              background: `${stat.color}40`,
                              color: stat.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {stat.status}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            '::placeholder': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            marginBottom: '4px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Search and Navigation */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                      <input
                        type='text'
                        placeholder='Search strategic buyers, campaigns, demos...'
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 40px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          backdropFilter: 'blur(5px)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#d946ef',
                          fontSize: '20px',
                        }}
                      >
                        🔍
                      </div>
                    </div>

                    <div
                      style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                    >
                      {[
                        {
                          label: 'Strategic Buyers',
                          icon: '🏢',
                          color: '#10b981',
                        },
                        {
                          label: 'Outreach Campaigns',
                          icon: '📧',
                          color: '#3b82f6',
                        },
                        {
                          label: 'Demo Environments',
                          icon: '🖥️',
                          color: '#8b5cf6',
                        },
                        {
                          label: 'Meeting Scheduler',
                          icon: '📅',
                          color: '#f59e0b',
                        },
                        {
                          label: 'Pipeline Analytics',
                          icon: '📊',
                          color: '#06b6d4',
                        },
                        {
                          label: 'AI Personalization',
                          icon: '🤖',
                          color: '#ef4444',
                        },
                      ].map((tab, index) => (
                        <button
                          key={index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: `2px solid ${tab.color}`,
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(5px)',
                            boxShadow: `0 0 10px ${tab.color}20`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = `${tab.color}20`;
                            e.target.style.boxShadow = `0 0 15px ${tab.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background =
                              'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = `0 0 10px ${tab.color}20`;
                          }}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-Time Operations Dashboard */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      📊 Real-Time Acquisition Dashboard
                      <Badge
                        style={{ background: '#22c55e', marginLeft: '8px' }}
                      >
                        LIVE
                      </Badge>
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                          }}
                        >
                          Recent Outreach
                        </h4>
                        <div style={{ space: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(16, 185, 129, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: '3px solid #10b981',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Microsoft - Satya Nadella
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Azure Integration Discussion
                            </div>
                            <div
                              style={{
                                color: '#10b981',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              02:34 - Response Expected
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              borderLeft: '3px solid #3b82f6',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Salesforce - Marc Benioff
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Transportation Cloud Strategy
                            </div>
                            <div
                              style={{
                                color: '#3b82f6',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              01:45 - Meeting Scheduled
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                          }}
                        >
                          Active Demos
                        </h4>
                        <div style={{ space: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(139, 92, 246, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: '3px solid #8b5cf6',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Oracle - Strategic Buyer Sandbox
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Enterprise Integration Demo
                            </div>
                            <div
                              style={{
                                color: '#8b5cf6',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              $2.6B - Executive Review
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              borderLeft: '3px solid #f59e0b',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              SAP - Technical Evaluation
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Supply Chain AI Integration
                            </div>
                            <div
                              style={{
                                color: '#f59e0b',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              $1.95B - Technical Deep Dive
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipper & Manufacturer Discovery - AI Flow Style */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h2
                    style={{
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Truck style={{ color: '#ff1493' }} />
                    🏭 Shipper & Manufacturer Discovery
                  </h2>

                  {/* KPI Dashboard */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '12px',
                      marginBottom: '24px',
                    }}
                  >
                    {[
                      {
                        label: 'Active Prospects',
                        value: shipperData?.data?.shipperLeads?.length || 24,
                        color: '#10b981',
                        icon: '🏭',
                        status: 'PROSPECTING',
                      },
                      {
                        label: 'Platinum Leads',
                        value:
                          shipperData?.data?.shipperLeads?.filter(
                            (lead) => lead.priority === 'Platinum'
                          )?.length || 8,
                        color: '#f59e0b',
                        icon: '⭐',
                        status: 'HIGH VALUE',
                      },
                      {
                        label: 'Gold Leads',
                        value:
                          shipperData?.data?.shipperLeads?.filter(
                            (lead) => lead.priority === 'Gold'
                          )?.length || 16,
                        color: '#3b82f6',
                        icon: '🥇',
                        status: 'QUALIFIED',
                      },
                      {
                        label: 'Total Revenue Potential',
                        value: '$2.8B',
                        color: '#8b5cf6',
                        icon: '💎',
                        status: 'ESTIMATED',
                      },
                      {
                        label: 'Discovery Rate',
                        value: '94%',
                        color: '#06b6d4',
                        icon: '🔍',
                        status: 'AI POWERED',
                      },
                      {
                        label: 'Contact Success',
                        value: '76%',
                        color: '#ef4444',
                        icon: '📞',
                        status: 'CONNECTED',
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '12px',
                          padding: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '16px',
                              padding: '4px',
                              background: 'rgba(255, 255, 255, 0.2)',
                              borderRadius: '6px',
                            }}
                          >
                            {stat.icon}
                          </div>
                          <div
                            style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '8px',
                              fontWeight: '700',
                              background: `${stat.color}40`,
                              color: stat.color,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                            }}
                          >
                            {stat.status}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            '::placeholder': {
                              color: 'rgba(255, 255, 255, 0.7)',
                            },
                            marginBottom: '4px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            color: '#ffffff',
                            fontSize: '11px',
                            fontWeight: '600',
                            letterSpacing: '0.3px',
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Search and Navigation */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '32px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div style={{ position: 'relative', marginBottom: '20px' }}>
                      <input
                        type='text'
                        placeholder='Search shippers, manufacturers, prospects...'
                        style={{
                          width: '100%',
                          padding: '12px 16px 12px 40px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '8px',
                          fontSize: '16px',
                          outline: 'none',
                          transition: 'all 0.3s ease',
                          background: 'rgba(255, 255, 255, 0.1)',
                          color: 'white',
                          '::placeholder': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          backdropFilter: 'blur(5px)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          left: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#d946ef',
                          fontSize: '20px',
                        }}
                      >
                        🔍
                      </div>
                    </div>

                    <div
                      style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}
                    >
                      {[
                        {
                          label: 'Platinum Prospects',
                          icon: '⭐',
                          color: '#f59e0b',
                        },
                        {
                          label: 'Gold Prospects',
                          icon: '🥇',
                          color: '#3b82f6',
                        },
                        {
                          label: 'Discovery Engine',
                          icon: '🔍',
                          color: '#10b981',
                        },
                        {
                          label: 'Contact Manager',
                          icon: '📞',
                          color: '#8b5cf6',
                        },
                        {
                          label: 'Revenue Tracker',
                          icon: '💰',
                          color: '#06b6d4',
                        },
                        { label: 'AI Insights', icon: '🤖', color: '#ef4444' },
                      ].map((tab, index) => (
                        <button
                          key={index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: `2px solid ${tab.color}`,
                            borderRadius: '6px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(5px)',
                            boxShadow: `0 0 10px ${tab.color}20`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = `${tab.color}20`;
                            e.target.style.boxShadow = `0 0 15px ${tab.color}40`;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background =
                              'rgba(255, 255, 255, 0.1)';
                            e.target.style.boxShadow = `0 0 10px ${tab.color}20`;
                          }}
                          onClick={() => {
                            // Reset CRM view when switching to detailed views
                            setShowCRM(false);

                            switch (tab.label) {
                              case 'Platinum Prospects':
                                setActiveProspectView('platinum');
                                console.log(
                                  'Platinum Prospects clicked - showing detailed view'
                                );
                                break;
                              case 'Gold Prospects':
                                setActiveProspectView('gold');
                                console.log(
                                  'Gold Prospects clicked - showing detailed view'
                                );
                                break;
                              case 'Discovery Engine':
                                setActiveProspectView(null);
                                setShowCRM(true);
                                console.log(
                                  'Discovery Engine activated - showing CRM Lead Manager'
                                );
                                break;
                              case 'Contact Manager':
                                setActiveProspectView('contacts');
                                console.log(
                                  'Contact Manager clicked - showing detailed view'
                                );
                                break;
                              case 'Revenue Tracker':
                                setActiveProspectView('revenue');
                                console.log(
                                  'Revenue Tracker clicked - showing detailed view'
                                );
                                break;
                              case 'AI Insights':
                                setActiveProspectView('ai-insights');
                                console.log(
                                  'AI Insights clicked - showing detailed view'
                                );
                                break;
                              default:
                                console.log(`${tab.label} clicked`);
                            }
                          }}
                        >
                          {tab.icon} {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Real-Time Operations Dashboard */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: '16px',
                      padding: '24px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <h3
                      style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      📊 Real-Time Discovery Dashboard
                      <Badge
                        style={{ background: '#22c55e', marginLeft: '8px' }}
                      >
                        LIVE
                      </Badge>
                    </h3>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                          }}
                        >
                          Platinum Prospects
                        </h4>
                        <div style={{ space: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: '3px solid #f59e0b',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Tesla Inc. - Automotive
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Electric Vehicle Manufacturing
                            </div>
                            <div
                              style={{
                                color: '#f59e0b',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Score: 95/100 - High Priority
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(245, 158, 11, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              borderLeft: '3px solid #f59e0b',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              P&G - Consumer Goods
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Global Consumer Products
                            </div>
                            <div
                              style={{
                                color: '#f59e0b',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Score: 92/100 - Active Outreach
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.12)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <h4
                          style={{
                            color: '#ffffff',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                          }}
                        >
                          Gold Prospects
                        </h4>
                        <div style={{ space: '12px' }}>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              marginBottom: '8px',
                              borderLeft: '3px solid #3b82f6',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Beyond Meat - Food Tech
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Plant-Based Food Manufacturing
                            </div>
                            <div
                              style={{
                                color: '#3b82f6',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Score: 88/100 - Qualified Lead
                            </div>
                          </div>
                          <div
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              padding: '12px',
                              borderRadius: '8px',
                              borderLeft: '3px solid #3b82f6',
                            }}
                          >
                            <div
                              style={{
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                              }}
                            >
                              Wayfair - E-commerce
                            </div>
                            <div
                              style={{
                                color: '#e2e8f0',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Home Goods & Furniture
                            </div>
                            <div
                              style={{
                                color: '#3b82f6',
                                fontSize: '12px',
                                marginTop: '4px',
                              }}
                            >
                              Score: 85/100 - Initial Contact
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CRM Lead Manager - AI Flow Style */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <h2
                    style={{
                      color: '#fff',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <Building2 style={{ color: '#ff1493' }} />
                    🏢 CRM Lead Manager
                  </h2>

                  {showCRM ? (
                    <AIHubCRMDashboard />
                  ) : activeProspectView ? (
                    <DetailedProspectViewer
                      viewType={activeProspectView}
                      onClose={() => setActiveProspectView(null)}
                    />
                  ) : (
                    <>
                      {/* KPI Dashboard */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '12px',
                          marginBottom: '24px',
                        }}
                      >
                        {[
                          {
                            label: 'Total Leads',
                            value: '147',
                            color: '#10b981',
                            icon: '👥',
                            status: 'ACTIVE',
                          },
                          {
                            label: 'Hot Prospects',
                            value: '23',
                            color: '#f59e0b',
                            icon: '🔥',
                            status: 'PRIORITY',
                          },
                          {
                            label: 'Qualified Leads',
                            value: '89',
                            color: '#3b82f6',
                            icon: '✅',
                            status: 'VERIFIED',
                          },
                          {
                            label: 'Pipeline Value',
                            value: '$4.2M',
                            color: '#8b5cf6',
                            icon: '💰',
                            status: 'POTENTIAL',
                          },
                          {
                            label: 'Conversion Rate',
                            value: '68%',
                            color: '#06b6d4',
                            icon: '📈',
                            status: 'GROWING',
                          },
                          {
                            label: 'Active Deals',
                            value: '34',
                            color: '#ef4444',
                            icon: '🤝',
                            status: 'CLOSING',
                          },
                        ].map((stat, index) => (
                          <div
                            key={index}
                            style={{
                              background: 'rgba(255, 255, 255, 0.15)',
                              backdropFilter: 'blur(10px)',
                              borderRadius: '12px',
                              padding: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.12)',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '16px',
                                  padding: '4px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  borderRadius: '6px',
                                }}
                              >
                                {stat.icon}
                              </div>
                              <div
                                style={{
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '8px',
                                  fontWeight: '700',
                                  background: `${stat.color}40`,
                                  color: stat.color,
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                }}
                              >
                                {stat.status}
                              </div>
                            </div>
                            <div
                              style={{
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: 'white',
                                '::placeholder': {
                                  color: 'rgba(255, 255, 255, 0.7)',
                                },
                                marginBottom: '4px',
                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                              }}
                            >
                              {stat.value}
                            </div>
                            <div
                              style={{
                                color: '#ffffff',
                                fontSize: '11px',
                                fontWeight: '600',
                                letterSpacing: '0.3px',
                              }}
                            >
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Search and Navigation */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          padding: '24px',
                          marginBottom: '32px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div
                          style={{ position: 'relative', marginBottom: '20px' }}
                        >
                          <input
                            type='text'
                            placeholder='Search leads, deals, contacts, pipeline...'
                            style={{
                              width: '100%',
                              padding: '12px 16px 12px 40px',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              fontSize: '16px',
                              outline: 'none',
                              transition: 'all 0.3s ease',
                              background: 'rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              '::placeholder': {
                                color: 'rgba(255, 255, 255, 0.7)',
                              },
                              backdropFilter: 'blur(5px)',
                            }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              left: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              color: '#d946ef',
                              fontSize: '20px',
                            }}
                          >
                            🔍
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          {[
                            {
                              label: 'Lead Manager',
                              icon: '👥',
                              color: '#10b981',
                            },
                            {
                              label: 'Pipeline Tracker',
                              icon: '📊',
                              color: '#3b82f6',
                            },
                            {
                              label: 'Deal Closer',
                              icon: '🤝',
                              color: '#f59e0b',
                            },
                            {
                              label: 'Contact Manager',
                              icon: '📞',
                              color: '#8b5cf6',
                            },
                            {
                              label: 'Revenue Analytics',
                              icon: '💰',
                              color: '#06b6d4',
                            },
                            {
                              label: 'CRM Platform',
                              icon: '🏢',
                              color: '#ef4444',
                            },
                          ].map((tab, index) => (
                            <button
                              key={index}
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: '#ffffff',
                                border: `2px solid ${tab.color}`,
                                borderRadius: '6px',
                                padding: '6px 12px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(5px)',
                                boxShadow: `0 0 10px ${tab.color}20`,
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.background = `${tab.color}20`;
                                e.target.style.boxShadow = `0 0 15px ${tab.color}40`;
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.background =
                                  'rgba(255, 255, 255, 0.1)';
                                e.target.style.boxShadow = `0 0 10px ${tab.color}20`;
                              }}
                              onClick={
                                index === 0 ? () => setShowCRM(true) : undefined
                              }
                            >
                              {tab.icon} {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Real-Time Operations Dashboard */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: '16px',
                          padding: '24px',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <h3
                          style={{
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          📊 Real-Time CRM Dashboard
                          <Badge
                            style={{ background: '#22c55e', marginLeft: '8px' }}
                          >
                            LIVE
                          </Badge>
                        </h3>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '20px',
                          }}
                        >
                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.12)',
                              borderRadius: '12px',
                              padding: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <h4
                              style={{
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                              }}
                            >
                              Hot Prospects
                            </h4>
                            <div style={{ space: '12px' }}>
                              <div
                                style={{
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  marginBottom: '8px',
                                  borderLeft: '3px solid #f59e0b',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                  }}
                                >
                                  ABC Logistics - $250K Deal
                                </div>
                                <div
                                  style={{
                                    color: '#e2e8f0',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  Full Service Logistics Package
                                </div>
                                <div
                                  style={{
                                    color: '#f59e0b',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  85% Win Probability - Closing Soon
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(245, 158, 11, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  borderLeft: '3px solid #f59e0b',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                  }}
                                >
                                  XYZ Manufacturing - $180K Deal
                                </div>
                                <div
                                  style={{
                                    color: '#e2e8f0',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  Warehousing & Distribution
                                </div>
                                <div
                                  style={{
                                    color: '#f59e0b',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  78% Win Probability - Demo Scheduled
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              background: 'rgba(255, 255, 255, 0.12)',
                              borderRadius: '12px',
                              padding: '20px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <h4
                              style={{
                                color: '#ffffff',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                              }}
                            >
                              Active Deals
                            </h4>
                            <div style={{ space: '12px' }}>
                              <div
                                style={{
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  marginBottom: '8px',
                                  borderLeft: '3px solid #3b82f6',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                  }}
                                >
                                  Global Freight Co. - $320K Deal
                                </div>
                                <div
                                  style={{
                                    color: '#e2e8f0',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  Freight Brokerage Services
                                </div>
                                <div
                                  style={{
                                    color: '#3b82f6',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  62% Win Probability - Proposal Sent
                                </div>
                              </div>
                              <div
                                style={{
                                  background: 'rgba(59, 130, 246, 0.1)',
                                  padding: '12px',
                                  borderRadius: '8px',
                                  borderLeft: '3px solid #3b82f6',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#fff',
                                    fontWeight: '600',
                                    fontSize: '14px',
                                  }}
                                >
                                  Regional Dispatch Inc. - $95K Deal
                                </div>
                                <div
                                  style={{
                                    color: '#e2e8f0',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  Dispatching & Route Optimization
                                </div>
                                <div
                                  style={{
                                    color: '#3b82f6',
                                    fontSize: '12px',
                                    marginTop: '4px',
                                  }}
                                >
                                  45% Win Probability - Initial Contact
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* AI Automation Dashboard View */}
            {activeView === 'automation' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h2
                  style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 24px 0',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  }}
                >
                  🤖 AI Automation Dashboard
                </h2>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <AIAutomationDashboard />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
