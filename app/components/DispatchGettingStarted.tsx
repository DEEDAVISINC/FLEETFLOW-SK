'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  tab?: string; // Optional tab to navigate to
}

export default function DispatchGettingStarted({
  onStepClick,
}: {
  onStepClick?: (stepId: string, tab?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed the getting started before
  useEffect(() => {
    const dismissed = localStorage.getItem(
      'dispatch-getting-started-dismissed'
    );
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Keyboard shortcut to show getting started (Ctrl+Shift+G)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
        localStorage.removeItem('dispatch-getting-started-dismissed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dispatch-getting-started-dismissed', 'true');
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('dispatch-getting-started-dismissed');
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Expose show again function globally for external access
  if (typeof window !== 'undefined') {
    (window as any).showDispatchGettingStarted = handleShowAgain;
  }

  // Show small "Show Getting Started" button when dismissed
  if (isDismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <button
          onClick={handleShowAgain}
          style={{
            background: 'linear-gradient(135deg, #d946ef, #8b5cf6)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(217, 70, 239, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(217, 70, 239, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(217, 70, 239, 0.3)';
          }}
          title='Show Getting Started Guide'
        >
          <span style={{ fontSize: '14px' }}>🚀</span>
          <span>Getting Started</span>
        </button>
      </div>
    );
  }

  const dispatchSteps: GettingStartedStep[] = [
    {
      id: 'dashboard',
      label: '📊 Dashboard Overview',
      icon: '📊',
      description: 'Monitor active loads, driver status, and key metrics',
      tab: 'dashboard',
    },
    {
      id: 'load-assignment',
      label: '🎯 Load Assignment',
      icon: '🎯',
      description: 'Assign loads to available drivers and track assignments',
      tab: 'dashboard',
    },
    {
      id: 'live-tracking',
      label: '🗺️ Live Fleet Tracking',
      icon: '🗺️',
      description: 'Monitor driver locations and load progress in real-time',
      tab: 'tracking',
    },
    {
      id: 'compliance-monitoring',
      label: '📱 Compliance Monitoring',
      icon: '📱',
      description: 'Check driver HOS, ELD, and regulatory compliance',
      tab: 'compliance',
    },
    {
      id: 'invoice-management',
      label: '💰 Invoice Management',
      icon: '💰',
      description: 'Create, send, and track load invoices and payments',
      tab: 'loads',
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
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        padding: '16px',
        marginBottom: '20px',
        maxWidth: '1000px',
        margin: '0 auto 20px auto',
        position: 'relative',
      }}
    >
      {/* Header with controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isExpanded ? '16px' : '0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>🚀</span>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#d946ef',
                margin: '0',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Getting Started
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '2px 0 0 0',
              }}
            >
              Master dispatch operations
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
              padding: '12px',
              background: 'rgba(217, 70, 239, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(217, 70, 239, 0.2)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              <strong style={{ color: '#f59e0b' }}>
                💡 Start with Dashboard Overview
              </strong>{' '}
              and explore our AI-powered workflow steps for a guided experience.
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
            {dispatchSteps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(step)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'white',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(217, 70, 239, 0.3)';
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
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '2px',
                        color: '#d946ef',
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.3',
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
                      background: 'rgba(217, 70, 239, 0.2)',
                      color: '#d946ef',
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
              background: 'rgba(30, 41, 59, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(217, 70, 239, 0.2)',
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
                💡 Pro Tips
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
                    background: 'rgba(217, 70, 239, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(217, 70, 239, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#d946ef',
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
                    Keyboard shortcuts for faster workflow
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
                    🎯
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '2px',
                    }}
                  >
                    Smart Matching
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    AI suggests best driver-load matches
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    📱
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '2px',
                    }}
                  >
                    Mobile Ready
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Full functionality on any device
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
