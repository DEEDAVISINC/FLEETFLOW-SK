'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  tab?: string; // Optional tab to navigate to
}

export default function BrokerDashboardGettingStarted({
  onStepClick,
}: {
  onStepClick?: (stepId: string, tab?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed the getting started before
  useEffect(() => {
    const dismissed = localStorage.getItem(
      'broker-dashboard-getting-started-dismissed'
    );
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Keyboard shortcut to show getting started (Ctrl+Shift+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
        localStorage.removeItem('broker-dashboard-getting-started-dismissed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('broker-dashboard-getting-started-dismissed', 'true');
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('broker-dashboard-getting-started-dismissed');
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Expose show again function globally for external access
  if (typeof window !== 'undefined') {
    (window as any).showBrokerDashboardGettingStarted = handleShowAgain;
  }

  // Show small "Show Getting Started" button when dismissed
  if (isDismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '140px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <button
          onClick={handleShowAgain}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow:
              '0 6px 16px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.1)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(139, 92, 246, 0.3)';
          }}
          title='Show Broker Dashboard Getting Started Guide'
        >
          <span style={{ fontSize: '14px' }}>💼</span>
          <span>Dashboard Guide</span>
        </button>
      </div>
    );
  }

  const brokerDashboardSteps: GettingStartedStep[] = [
    {
      id: 'quotes-workflow',
      label: '💰 Quotes Workflow',
      icon: '💰',
      description: 'Generate competitive quotes and manage pricing strategies',
      tab: 'quotes-workflow',
    },
    {
      id: 'loads-bids',
      label: '🚛 Loads & Bids',
      icon: '🚛',
      description: 'Track load assignments and manage bidding activities',
      tab: 'loads-bids',
    },
    {
      id: 'ai-intelligence',
      label: '🤖 AI Intelligence',
      icon: '🤖',
      description: 'Leverage AI for market insights and optimization',
      tab: 'ai-intelligence',
    },
    {
      id: 'market-intelligence',
      label: '📊 Market Intelligence',
      icon: '📊',
      description: 'Analyze market trends and competitive pricing',
      tab: 'market-intelligence',
    },
    {
      id: 'analytics',
      label: '📈 Performance Analytics',
      icon: '📈',
      description: 'Monitor KPIs, margins, and business performance',
      tab: 'analytics',
    },
    {
      id: 'tasks',
      label: '✅ Task Management',
      icon: '✅',
      description: 'Track tasks, follow-ups, and customer interactions',
      tab: 'tasks',
    },
  ];

  const handleStepClick = (step: GettingStartedStep) => {
    if (onStepClick) {
      onStepClick(step.id, step.tab);
    }
  };

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        padding: '20px',
        marginBottom: '25px',
        maxWidth: '1000px',
        margin: '0 auto 25px auto',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '16px' : '0',
          padding: '8px 12px',
          background: 'rgba(139, 92, 246, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(139, 92, 246, 0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>💼</span>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: '0',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Broker Dashboard Guide
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '2px 0 0 0',
                fontWeight: '500',
              }}
            >
              Master your brokerage dashboard
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleExpandToggle}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
          <button
            onClick={handleDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.6)',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
            }}
            title='Dismiss getting started guide'
          >
            ×
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '16px',
              padding: '16px',
              background: 'rgba(139, 92, 246, 0.15)',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
            }}
          >
            <p
              style={{
                fontSize: '15px',
                color: '#ffffff',
                margin: 0,
                lineHeight: '1.5',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              <strong style={{ color: '#f59e0b' }}>
                💡 Start with Quotes Workflow
              </strong>{' '}
              and explore your comprehensive brokerage tools for successful
              operations.
            </p>
          </div>

          {/* Workflow Steps Navigation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {brokerDashboardSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '8px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{step.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '4px',
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.85)',
                        lineHeight: '1.4',
                        fontWeight: '400',
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}
                  >
                    Step {index + 1}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Quick Tips Section */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <h5
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#fff',
                  margin: '0 0 8px 0',
                  textAlign: 'center',
                }}
              >
                💡 Broker Dashboard Pro Tips
              </h5>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    🎯
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#8b5cf6',
                      marginBottom: '2px',
                    }}
                  >
                    Competitive Pricing
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Use AI insights to stay competitive
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    📈
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '2px',
                    }}
                  >
                    Track Margins
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Monitor profitability on every load
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#f59e0b',
                      marginBottom: '2px',
                    }}
                  >
                    Quick Actions
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Use keyboard shortcuts for efficiency
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
