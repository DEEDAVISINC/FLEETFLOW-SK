'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  tab?: string; // Optional tab to navigate to
}

export default function DispatcherPortalGettingStarted({
  onStepClick,
}: {
  onStepClick?: (stepId: string, tab?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed the getting started before
  useEffect(() => {
    const dismissed = localStorage.getItem(
      'dispatcher-portal-getting-started-dismissed'
    );
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  // Keyboard shortcut to show getting started (Ctrl+Shift+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
        localStorage.removeItem('dispatcher-portal-getting-started-dismissed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('dispatcher-portal-getting-started-dismissed', 'true');
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('dispatcher-portal-getting-started-dismissed');
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // Expose show again function globally for external access
  if (typeof window !== 'undefined') {
    (window as any).showDispatcherPortalGettingStarted = handleShowAgain;
  }

  // Show small "Show Getting Started" button when dismissed
  if (isDismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '120px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <button
          onClick={handleShowAgain}
          style={{
            background: 'linear-gradient(135deg, #059669, #0d9488)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 6px 16px rgba(5, 150, 105, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(5, 150, 105, 0.3)';
          }}
          title='Show Dispatcher Portal Getting Started Guide'
        >
          <span style={{ fontSize: '14px' }}>🚛</span>
          <span>Portal Guide</span>
        </button>
      </div>
    );
  }

  const dispatcherPortalSteps: GettingStartedStep[] = [
    {
      id: 'dashboard',
      label: '📊 Portal Dashboard',
      icon: '📊',
      description:
        'View your personal metrics, active loads, and quick actions',
      tab: 'dashboard',
    },
    {
      id: 'ai-optimization',
      label: '🤖 AI Optimization',
      icon: '🤖',
      description: 'Leverage AI for load optimization and route planning',
      tab: 'ai-optimization',
    },
    {
      id: 'go-with-flow',
      label: '🌊 Go With The Flow',
      icon: '🌊',
      description: 'Automated load matching and carrier communication',
      tab: 'go-with-flow',
    },
    {
      id: 'task-priority',
      label: '🎯 Task Priority',
      icon: '🎯',
      description: 'AI-powered task prioritization and workflow management',
      tab: 'task-priority',
    },
    {
      id: 'load-tracking',
      label: '📍 Live Tracking',
      icon: '📍',
      description: 'Real-time fleet tracking and load progress monitoring',
      tab: 'tracking',
    },
    {
      id: 'invoice-management',
      label: '💰 Invoice Hub',
      icon: '💰',
      description: 'Create, track, and manage load invoices and payments',
      tab: 'invoices',
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
          <span style={{ fontSize: '20px' }}>🚛</span>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#059669',
                margin: '0',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              Dispatcher Portal Guide
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '2px 0 0 0',
              }}
            >
              Master your dispatcher workflow
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
              background: 'rgba(5, 150, 105, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(5, 150, 105, 0.2)',
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
                💡 Start with Portal Dashboard
              </strong>{' '}
              and explore your AI-powered dispatcher tools for efficient
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
            {dispatcherPortalSteps.map((step, index) => (
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
                    '0 8px 25px rgba(5, 150, 105, 0.3)';
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
                        color: '#059669',
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
                      background: 'rgba(5, 150, 105, 0.2)',
                      color: '#059669',
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
              border: '1px solid rgba(5, 150, 105, 0.2)',
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
                💡 Dispatcher Pro Tips
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
                    background: 'rgba(5, 150, 105, 0.1)',
                    borderRadius: '6px',
                    padding: '8px',
                    border: '1px solid rgba(5, 150, 105, 0.2)',
                  }}
                >
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#059669',
                      marginBottom: '2px',
                    }}
                  >
                    AI First
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Let AI optimize before manual adjustments
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
                    🎯
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      marginBottom: '2px',
                    }}
                  >
                    Task Priority
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Focus on high-priority tasks first
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
                    💰
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#f59e0b',
                      marginBottom: '2px',
                    }}
                  >
                    Invoice Early
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Create invoices as soon as loads complete
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
