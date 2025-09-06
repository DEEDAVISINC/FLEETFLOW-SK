'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  icon: string;
  title: string;
  description: string;
  tab?: string;
}

interface BrokerAgentPortalGettingStartedProps {
  onStepClick: (stepId: string, tab?: string) => void;
}

export default function BrokerAgentPortalGettingStarted({
  onStepClick,
}: BrokerAgentPortalGettingStartedProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Check localStorage on mount
  useEffect(() => {
    const dismissed = localStorage.getItem(
      'broker-agent-portal-getting-started-dismissed'
    );
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Keyboard shortcut for showing guide (Ctrl+Shift+A for Agent Portal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const steps: GettingStartedStep[] = [
    {
      id: 'quotes-workflow',
      icon: '💰',
      title: 'Quote Generation',
      description:
        'Create LTL, FTL, and specialized freight quotes using our AI-powered quoting engine',
      tab: 'quotes-workflow',
    },
    {
      id: 'loads-bids',
      icon: '📦',
      title: 'Load Management',
      description: 'Track loads, bids, and carrier assignments in real-time',
      tab: 'loads-bids',
    },
    {
      id: 'enhanced-crm',
      icon: '👥',
      title: 'CRM & Leads',
      description:
        'Manage shipper relationships and capture new leads automatically',
      tab: 'enhanced-crm',
    },
    {
      id: 'ai-intelligence',
      icon: '🤖',
      title: 'AI Intelligence',
      description:
        'Leverage AI insights for market analysis and pricing optimization',
      tab: 'ai-intelligence',
    },
    {
      id: 'market-intelligence',
      icon: '📊',
      title: 'Market Intelligence',
      description: 'Analyze market trends and competitive pricing data',
      tab: 'market-intelligence',
    },
    {
      id: 'carrier-network',
      icon: '🚛',
      title: 'Carrier Network',
      description: 'Access and manage your carrier relationships and capacity',
      tab: 'carrier-network',
    },
    {
      id: 'performance',
      icon: '📈',
      title: 'Performance Analytics',
      description: 'Track your brokerage performance and revenue metrics',
      tab: 'performance',
    },
  ];

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(
      'broker-agent-portal-getting-started-dismissed',
      'true'
    );
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('broker-agent-portal-getting-started-dismissed');
  };

  const handleStepClick = (step: GettingStartedStep) => {
    setCurrentStep(steps.findIndex((s) => s.id === step.id));
    onStepClick(step.id, step.tab);
  };

  if (isDismissed) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          zIndex: 1000,
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '12px',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)',
          fontSize: '0.9rem',
          fontWeight: '600',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.2s ease',
        }}
        onClick={handleShowAgain}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 6px 25px rgba(124, 58, 237, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 4px 20px rgba(124, 58, 237, 0.4)';
        }}
      >
        🎯 Agent Portal Guide
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '100px',
        right: isExpanded ? '20px' : '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        width: isExpanded ? '380px' : '60px',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
          color: 'white',
          padding: '16px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎯</span>
          {isExpanded && (
            <div>
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>
                Agent Portal Guide
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                7 Steps to Success
              </div>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDismiss();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
              }}
            >
              ✕
            </button>
          )}
          <span
            style={{
              fontSize: '0.8rem',
              transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          >
            ▼
          </span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div style={{ padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '0.9rem',
                color: '#666',
                marginBottom: '12px',
              }}
            >
              Follow these steps to master the Agent Portal:
            </div>

            {/* Steps */}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step)}
                  style={{
                    background:
                      currentStep === index
                        ? 'linear-gradient(135deg, #7c3aed22, #a855f722)'
                        : 'rgba(0, 0, 0, 0.02)',
                    border:
                      currentStep === index
                        ? '2px solid #7c3aed'
                        : '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                  onMouseEnter={(e) => {
                    if (currentStep !== index) {
                      e.currentTarget.style.background =
                        'rgba(124, 58, 237, 0.1)';
                      e.currentTarget.style.borderColor =
                        'rgba(124, 58, 237, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentStep !== index) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.02)';
                      e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div style={{ fontSize: '1.2rem' }}>{step.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: '#333',
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        lineHeight: '1.3',
                      }}
                    >
                      {step.description}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#7c3aed',
                      fontWeight: '600',
                    }}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#0c4a6e',
                marginBottom: '8px',
              }}
            >
              💡 Agent Pro Tips
            </div>
            <ul
              style={{
                fontSize: '0.8rem',
                color: '#374151',
                margin: 0,
                paddingLeft: '16px',
              }}
            >
              <li>Use AI Intelligence for competitive pricing</li>
              <li>Monitor Market Intelligence daily</li>
              <li>Set up automated quote notifications</li>
              <li>Review performance metrics weekly</li>
            </ul>
          </div>

          {/* Keyboard shortcut */}
          <div
            style={{
              fontSize: '0.7rem',
              color: '#666',
              textAlign: 'center',
              marginTop: '12px',
              paddingTop: '8px',
              borderTop: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            Press{' '}
            <kbd
              style={{
                background: '#f3f4f6',
                padding: '2px 4px',
                borderRadius: '3px',
                fontSize: '0.7rem',
              }}
            >
              Ctrl+Shift+A
            </kbd>{' '}
            to show this guide anytime
          </div>
        </div>
      )}
    </div>
  );
}
