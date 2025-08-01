'use client';

import { useState } from 'react';
import AIAutomationDashboard from '../components/AIAutomationDashboard';
import AIFlowPlatform from '../components/AIFlowPlatform';

export default function AIHubPage() {
  const [currentPage, setCurrentPage] = useState<'ai-flow' | 'ai-hub'>(
    'ai-hub'
  );

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
                ></div>
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
                ></div>
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

            {/* AI Automation Dashboard */}
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
          </div>
        )}
      </div>
    </div>
  );
}
