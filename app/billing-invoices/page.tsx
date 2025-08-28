'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BillingInvoicesPage() {
  const [selectedReport, setSelectedReport] = useState('financial-overview');
  const [selectedDashboard, setSelectedDashboard] = useState('billing-command');
  const [dateRange, setDateRange] = useState('real-time');
  const [exportFormat, setExportFormat] = useState('financial-pdf');
  const [realTimeData, setRealTimeData] = useState(true);
  const [aiInsightsMode, setAiInsightsMode] = useState('predictive');
  const [viewMode, setViewMode] = useState('strategic');
  const [alertLevel, setAlertLevel] = useState('executive');

  const enterpriseDashboards = [
    {
      id: 'billing-command',
      label: 'Billing Command Center',
      icon: '💰',
      color: '#10b981',
      description:
        'Executive Financial Overview with Real-Time Revenue Tracking',
    },
    {
      id: 'accounts-receivable',
      label: 'Accounts Receivable Hub',
      icon: '📥',
      color: '#8b5cf6',
      description:
        'Invoice Management, Payment Tracking & Collections Analytics',
    },
    {
      id: 'accounts-payable',
      label: 'Accounts Payable Center',
      icon: '📤',
      color: '#3b82f6',
      description: 'Vendor Management, Bill Processing & Payment Scheduling',
    },
    {
      id: 'cash-flow',
      label: 'Cash Flow Intelligence',
      icon: '⚡',
      color: '#f59e0b',
      description:
        'Liquidity Analysis, Forecasting & Working Capital Optimization',
    },
    {
      id: 'financial-analytics',
      label: 'Financial Analytics',
      icon: '📈',
      color: '#ef4444',
      description:
        'Revenue Analysis, Profitability Metrics & Growth Intelligence',
    },
    {
      id: 'payroll-operations',
      label: 'Payroll Operations',
      icon: '👥',
      color: '#06b6d4',
      description:
        'Employee Compensation, Tax Management & Compliance Monitoring',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)',
        padding: '60px 16px 16px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
          radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.08) 0%, transparent 50%)
        `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />

      {/* Executive Header */}
      <div style={{ padding: '0 0 20px 0', position: 'relative', zIndex: 10 }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Executive Dashboard
          </button>
        </Link>
      </div>

      <div
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Enterprise Command Header */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background:
                'linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6, #ef4444, #f59e0b)',
            }}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  background: 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                💰 FLEETFLOW™ BILLING COMMAND
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 12px 0',
                  fontWeight: '500',
                }}
              >
                Enterprise Financial Management Platform
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    background: realTimeData
                      ? 'rgba(16, 185, 129, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                    color: realTimeData ? '#10b981' : '#ef4444',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: `1px solid ${realTimeData ? '#10b981' : '#ef4444'}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {realTimeData
                    ? '🟢 READY FOR LIVE DATA'
                    : '🔴 AWAITING CONNECTION'}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  Financial Network Status: READY • Awaiting Data Connection
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'flex-end',
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <select
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value='financial-pdf'>💰 Financial PDF</option>
                  <option value='board-presentation'>
                    🎯 Board Presentation
                  </option>
                  <option value='investor-deck'>💼 Investor Deck</option>
                  <option value='financial-analysis'>
                    📈 Financial Analysis
                  </option>
                  <option value='compliance-report'>
                    📋 Compliance Report
                  </option>
                </select>

                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  🚀 EXPORT
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  📅 SCHEDULE CFO MEETING
                </button>

                <button
                  onClick={() => setRealTimeData(!realTimeData)}
                  style={{
                    background: realTimeData
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                  }}
                >
                  {realTimeData ? '⚡ READY MODE' : '🔄 ACTIVATE READY'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Dashboard Selection */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            💰 FINANCIAL COMMAND CENTERS
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {enterpriseDashboards.map((dashboard) => (
              <button
                key={dashboard.id}
                style={{
                  background:
                    selectedDashboard === dashboard.id
                      ? `linear-gradient(135deg, ${dashboard.color}, ${dashboard.color}CC)`
                      : 'rgba(30, 41, 59, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border:
                    selectedDashboard === dashboard.id
                      ? `2px solid ${dashboard.color}`
                      : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  color:
                    selectedDashboard === dashboard.id
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.9)',
                  boxShadow:
                    selectedDashboard === dashboard.id
                      ? `0 8px 24px ${dashboard.color}40`
                      : '0 4px 16px rgba(0, 0, 0, 0.3)',
                  transform:
                    selectedDashboard === dashboard.id
                      ? 'translateY(-2px)'
                      : 'translateY(0)',
                }}
                onClick={() => setSelectedDashboard(dashboard.id)}
                onMouseOver={(e) => {
                  if (selectedDashboard !== dashboard.id) {
                    e.currentTarget.style.background = 'rgba(51, 65, 85, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedDashboard !== dashboard.id) {
                    e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{dashboard.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: '700',
                        fontSize: '14px',
                        marginBottom: '4px',
                      }}
                    >
                      {dashboard.label}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color:
                          selectedDashboard === dashboard.id
                            ? 'rgba(255, 255, 255, 0.9)'
                            : 'rgba(255, 255, 255, 0.6)',
                        lineHeight: '1.3',
                      }}
                    >
                      {dashboard.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Standard Empty State */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
            backdropFilter: 'blur(15px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '60px 40px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '24px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
            }}
          >
            💰
          </div>
          <h3
            style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#ffffff',
              marginBottom: '16px',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Financial Command Ready
          </h3>
          <p
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '32px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 32px',
            }}
          >
            Your comprehensive financial management dashboard will display
            billing, invoices, cash flow analytics, and strategic financial
            insights once data sources are connected to your system.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#60a5fa',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              💰 Revenue Analytics
            </div>
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#34d399',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              📈 Cash Flow Intelligence
            </div>
            <div
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: '#fbbf24',
                fontWeight: '600',
                fontSize: '0.95rem',
              }}
            >
              📊 Financial Operations
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 0.4;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
}
