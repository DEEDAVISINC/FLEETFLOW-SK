'use client';

import { useEffect, useState } from 'react';

interface GettingStartedStep {
  id: string;
  label: string;
  icon: string;
  description: string;
  tab?: string;
}

export default function FreightForwarderDashboardGuide({
  onStepClick,
}: {
  onStepClick?: (stepId: string, tab?: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(
      'freight-forwarder-dashboard-guide-dismissed'
    );
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setIsDismissed(false);
        setIsExpanded(true);
        localStorage.removeItem('freight-forwarder-dashboard-guide-dismissed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('freight-forwarder-dashboard-guide-dismissed', 'true');
  };

  const handleShowAgain = () => {
    setIsDismissed(false);
    setIsExpanded(true);
    localStorage.removeItem('freight-forwarder-dashboard-guide-dismissed');
  };

  if (typeof window !== 'undefined') {
    (window as any).showFreightForwarderDashboardGuide = handleShowAgain;
  }

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
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(6, 182, 212, 0.4)',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          title='Show Freight Forwarding Dashboard Guide (Ctrl+Shift+F)'
        >
          <span style={{ fontSize: '14px' }}>🚢</span>
          <span>Dashboard Guide</span>
        </button>
      </div>
    );
  }

  const steps: GettingStartedStep[] = [
    {
      id: 'dashboard',
      label: '🏠 Dashboard',
      icon: '🏠',
      description:
        'View real-time metrics, KPIs, and business intelligence overview',
      tab: 'dashboard',
    },
    {
      id: 'shipments-quoting',
      label: '📦 Shipments & Quoting',
      icon: '📦',
      description:
        'Multi-carrier comparison (4 carriers), detailed cost breakdowns, ocean/air quoting, shipment tracking',
      tab: 'shipments',
    },
    {
      id: 'compliance',
      label: '🛃 Compliance & Documents',
      icon: '🛃',
      description:
        'Customs bond management, SuretyCloud manual integration (forms, emails, checklists), denied party screening, HS codes, duty calculator, Section 301 alerts',
      tab: 'compliance',
    },
    {
      id: 'clients',
      label: '👥 Clients & CRM',
      icon: '👥',
      description: 'Manage contacts, client portals, and FleetFlow leads',
      tab: 'clients',
    },
    {
      id: 'intelligence',
      label: '📊 Intelligence',
      icon: '📊',
      description: 'AI recommendations, market data, analytics, and insights',
      tab: 'intelligence',
    },
    {
      id: 'operations',
      label: '✅ Operations',
      icon: '✅',
      description: 'Task management, follow-ups, documentation, and workflows',
      tab: 'operations',
    },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: '140px',
        right: '20px',
        zIndex: 100,
        width: isExpanded ? '420px' : 'auto',
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(8, 145, 178, 0.15))',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>🚢</span>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                }}
              >
                Freight Forwarding Guide
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Business Intelligence Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: 'white',
              cursor: 'pointer',
              padding: '6px 10px',
              fontSize: '12px',
              fontWeight: '600',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {isExpanded && (
          <div style={{ padding: '20px' }}>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '13px',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              Complete business intelligence platform for freight forwarding
              operations. Click any step below to explore features.
            </p>

            <div style={{ display: 'grid', gap: '10px' }}>
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => {
                    if (onStepClick) {
                      onStepClick(step.id, step.tab);
                    }
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '10px',
                    padding: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(6, 182, 212, 0.15)';
                    e.currentTarget.style.borderColor =
                      'rgba(6, 182, 212, 0.4)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor =
                      'rgba(6, 182, 212, 0.2)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '20px',
                        background: 'rgba(6, 182, 212, 0.2)',
                        padding: '6px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.icon}
                    </span>
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {step.label}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      marginLeft: '44px',
                    }}
                  >
                    {step.description}
                  </div>
                </button>
              ))}
            </div>

            {/* NEW Feature Highlight */}
            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                background:
                  'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.15))',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '11px',
                  lineHeight: '1.5',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>✨</span>
                  <strong style={{ color: '#10b981' }}>
                    NEW: Multi-Carrier Comparison
                  </strong>
                </div>
                Compare 4 carriers side-by-side with detailed cost breakdowns
                (base rate, fuel, customs, docs, insurance, handling). Find the
                best rates instantly!
              </div>
            </div>

            {/* SuretyCloud Manual Integration Highlight */}
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background:
                  'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(217, 119, 6, 0.15))',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '11px',
                  lineHeight: '1.5',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>🔗</span>
                  <strong style={{ color: '#f59e0b' }}>
                    NEW: SuretyCloud Manual Integration
                  </strong>
                </div>
                Generate complete bond application packages for SuretyCloud
                submission. Download HTML forms, email templates, document
                checklists, and step-by-step instructions. Track status manually
                when SuretyCloud responds.
              </div>
            </div>

            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                background: 'rgba(6, 182, 212, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
              }}
            >
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '11px',
                  lineHeight: '1.5',
                }}
              >
                <strong>💡 Pro Tip:</strong> Use{' '}
                <kbd
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                  }}
                >
                  Ctrl+Shift+F
                </kbd>{' '}
                to show this guide anytime
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
