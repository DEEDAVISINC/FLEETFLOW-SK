'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
// Removed StickyNote import

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('executive-overview');
  const [selectedDashboard, setSelectedDashboard] =
    useState('enterprise-command');
  const [dateRange, setDateRange] = useState('real-time');
  const [exportFormat, setExportFormat] = useState('executive-pdf');
  const [realTimeData, setRealTimeData] = useState(true);
  const [aiInsightsMode, setAiInsightsMode] = useState('predictive');
  const [viewMode, setViewMode] = useState('strategic');
  const [alertLevel, setAlertLevel] = useState('executive');

  const mainChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const predictiveChartRef = useRef<HTMLCanvasElement>(null);
  const networkChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Enterprise Multi-Dimensional Performance Chart
    const canvas = mainChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Multi-dimensional data streams
    const revenueData = [
      2.1, 2.8, 3.4, 4.2, 5.1, 6.8, 8.2, 9.7, 11.4, 13.2, 15.8, 18.9,
    ];
    const efficiencyData = [78, 82, 85, 88, 91, 93, 95, 97, 98, 96, 98, 99];
    const marketShareData = [12, 15, 18, 22, 26, 31, 35, 39, 44, 48, 52, 57];
    const aiOptimizationData = [
      65, 72, 78, 84, 89, 93, 96, 98, 99, 99.2, 99.5, 99.8,
    ];

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Advanced grid system
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 8; i++) {
      const y = padding + (i * chartHeight) / 8;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 12; i++) {
      const x = padding + (i * chartWidth) / 12;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();
    }

    // Revenue Performance Line (Primary)
    const gradient1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient1.addColorStop(0, '#10b981');
    gradient1.addColorStop(1, '#059669');

    ctx.strokeStyle = gradient1;
    ctx.lineWidth = 3;
    ctx.beginPath();

    revenueData.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (revenueData.length - 1);
      const y = padding + chartHeight - (value / 20) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Market Share Line
    const gradient2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient2.addColorStop(0, '#3b82f6');
    gradient2.addColorStop(1, '#1d4ed8');

    ctx.strokeStyle = gradient2;
    ctx.lineWidth = 2;
    ctx.beginPath();

    marketShareData.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (marketShareData.length - 1);
      const y = padding + chartHeight - (value / 60) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // AI Optimization Performance
    const gradient3 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient3.addColorStop(0, '#8b5cf6');
    gradient3.addColorStop(1, '#7c3aed');

    ctx.strokeStyle = gradient3;
    ctx.lineWidth = 2;
    ctx.beginPath();

    aiOptimizationData.forEach((value, index) => {
      const x =
        padding + (index * chartWidth) / (aiOptimizationData.length - 1);
      const y = padding + chartHeight - (value / 100) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Data points with glow effect
    const datasets = [
      { data: revenueData, color: '#10b981', scale: 20 },
      { data: marketShareData, color: '#3b82f6', scale: 60 },
      { data: aiOptimizationData, color: '#8b5cf6', scale: 100 },
    ];

    datasets.forEach((dataset) => {
      ctx.shadowColor = dataset.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = dataset.color;

      dataset.data.forEach((value, index) => {
        const x = padding + (index * chartWidth) / (dataset.data.length - 1);
        const y = padding + chartHeight - (value / dataset.scale) * chartHeight;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.shadowBlur = 0;
    });
  }, [selectedReport, realTimeData]);

  const enterpriseDashboards = [
    {
      id: 'enterprise-command',
      label: 'Enterprise Command Center',
      icon: '🎯',
      color: '#10b981',
      description:
        'C-Suite Strategic Overview with Real-Time Global Operations',
    },
    {
      id: 'ai-intelligence',
      label: 'AI Intelligence Hub',
      icon: '🧠',
      color: '#8b5cf6',
      description: 'Machine Learning Insights & Predictive Analytics Engine',
    },
    {
      id: 'financial-markets',
      label: 'Financial Markets Center',
      icon: '📈',
      color: '#3b82f6',
      description:
        'Revenue Analytics, Market Intelligence & Investment Metrics',
    },
    {
      id: 'operational-excellence',
      label: 'Operational Excellence',
      icon: '⚡',
      color: '#f59e0b',
      description:
        'Fleet Performance, Efficiency Optimization & Quality Control',
    },
    {
      id: 'competitive-intelligence',
      label: 'Competitive Intelligence',
      icon: '🎲',
      color: '#ef4444',
      description: 'Market Position Analysis & Strategic Advantage Monitoring',
    },
    {
      id: 'global-expansion',
      label: 'Global Expansion Analytics',
      icon: '🌍',
      color: '#06b6d4',
      description:
        'International Markets, Regulatory Compliance & Growth Opportunities',
    },
  ];

  const executiveKpis = [
    {
      label: 'Enterprise Valuation',
      value: '$127.8B',
      change: '+18.4%',
      trend: 'up',
      category: 'strategic',
      color: '#10b981',
      benchmark: 'Industry Leader',
      confidence: 98.7,
    },
    {
      label: 'Global Market Share',
      value: '47.3%',
      change: '+12.1%',
      trend: 'up',
      category: 'strategic',
      color: '#3b82f6',
      benchmark: '#1 Worldwide',
      confidence: 96.2,
    },
    {
      label: 'AI Optimization Score',
      value: '99.7%',
      change: '+2.8%',
      trend: 'up',
      category: 'operational',
      color: '#8b5cf6',
      benchmark: 'Industry Best',
      confidence: 99.9,
    },
    {
      label: 'Revenue Growth Rate',
      value: '847%',
      change: '+156%',
      trend: 'up',
      category: 'financial',
      color: '#10b981',
      benchmark: 'Exceptional',
      confidence: 95.4,
    },
    {
      label: 'Customer Acquisition Cost',
      value: '$47',
      change: '-73%',
      trend: 'up',
      category: 'financial',
      color: '#06b6d4',
      benchmark: 'Best in Class',
      confidence: 97.8,
    },
    {
      label: 'Enterprise Customers',
      value: '47,892',
      change: '+284%',
      trend: 'up',
      category: 'operational',
      color: '#f59e0b',
      benchmark: 'Market Leader',
      confidence: 98.1,
    },
    {
      label: 'Global Network Efficiency',
      value: '98.9%',
      change: '+4.7%',
      trend: 'up',
      category: 'operational',
      color: '#ef4444',
      benchmark: 'World Class',
      confidence: 99.2,
    },
    {
      label: 'Strategic Partnership Value',
      value: '$89.4B',
      change: '+67%',
      trend: 'up',
      category: 'strategic',
      color: '#8b5cf6',
      benchmark: 'Industry First',
      confidence: 94.6,
    },
    {
      label: 'Innovation Index Score',
      value: '9.8/10',
      change: '+0.7',
      trend: 'up',
      category: 'strategic',
      color: '#10b981',
      benchmark: 'Innovation Leader',
      confidence: 99.5,
    },
  ];

  const aiInsights = [
    {
      category: 'STRATEGIC ALERT',
      priority: 'CRITICAL',
      title: '🎯 Acquisition Opportunity Detected',
      insight:
        'AI analysis identifies optimal acquisition window for European logistics leader. Projected synergy value: $47.8B. Recommended action within 72 hours.',
      confidence: 97.8,
      impact: '$47.8B Value Creation',
      color: '#ef4444',
      actions: [
        'Schedule Board Meeting',
        'Prepare Due Diligence',
        'Engage Investment Banking',
      ],
    },
    {
      category: 'MARKET INTELLIGENCE',
      priority: 'HIGH',
      title: '📊 Market Disruption Prediction',
      insight:
        'Predictive models indicate 340% demand surge in autonomous freight by Q3 2025. FleetFlow™ positioned to capture 67% market share.',
      confidence: 94.2,
      impact: '$127B Revenue Opportunity',
      color: '#3b82f6',
      actions: [
        'Accelerate R&D Investment',
        'Scale Infrastructure',
        'Strategic Partnerships',
      ],
    },
    {
      category: 'OPERATIONAL EXCELLENCE',
      priority: 'MEDIUM',
      title: '⚡ Efficiency Breakthrough Identified',
      insight:
        'Quantum-inspired routing algorithms achieve 34% efficiency gain. Implementation across global network projected to save $8.9B annually.',
      confidence: 99.1,
      impact: '$8.9B Annual Savings',
      color: '#10b981',
      actions: [
        'Deploy Globally',
        'Patent Technology',
        'Competitive Advantage',
      ],
    },
    {
      category: 'COMPETITIVE ADVANTAGE',
      priority: 'STRATEGIC',
      title: '🏆 Industry Dominance Confirmed',
      insight:
        'FleetFlow™ achieves 47.3% global market share, surpassing all competitors combined. Regulatory approval for mega-merger opportunities.',
      confidence: 98.9,
      impact: 'Market Leadership',
      color: '#8b5cf6',
      actions: [
        'Strategic Communications',
        'Regulatory Engagement',
        'Market Expansion',
      ],
    },
  ];

  const filteredKpis = executiveKpis.filter((kpi) =>
    selectedDashboard === 'enterprise-command'
      ? kpi.category === 'strategic'
      : selectedDashboard === 'financial-markets'
        ? kpi.category === 'financial'
        : selectedDashboard === 'operational-excellence'
          ? kpi.category === 'operational'
          : selectedDashboard === 'ai-intelligence'
            ? ['strategic', 'operational'].includes(kpi.category)
            : true
  );

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
                🚀 FLEETFLOW™ ENTERPRISE COMMAND
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 12px 0',
                  fontWeight: '500',
                }}
              >
                $127.8B Global Transportation Intelligence Platform
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
                  {realTimeData ? '🟢 LIVE GLOBAL FEED' : '🔴 HISTORICAL DATA'}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  Global Network Status: OPTIMAL • 99.97% Uptime
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
                  <option value='executive-pdf'>📊 Executive PDF</option>
                  <option value='board-presentation'>
                    🎯 Board Presentation
                  </option>
                  <option value='investor-deck'>💼 Investor Deck</option>
                  <option value='strategic-analysis'>
                    📈 Strategic Analysis
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
                  📅 SCHEDULE BOARD MEETING
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
                  {realTimeData ? '⚡ LIVE MODE' : '🔄 ACTIVATE LIVE'}
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
            🎯 ENTERPRISE COMMAND CENTERS
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

        {/* Executive KPI Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {filteredKpis.map((kpi, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '16px',
                border: `1px solid ${kpi.color}40`,
                boxShadow: `0 4px 16px ${kpi.color}20`,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${kpi.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${kpi.color}20`;
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}80)`,
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: '600',
                      marginBottom: '4px',
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: kpi.color,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {kpi.benchmark}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                    background:
                      kpi.trend === 'up'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    border: `1px solid ${kpi.trend === 'up' ? '#10b981' : '#ef4444'}`,
                  }}
                >
                  {kpi.trend === 'up' ? '🚀' : '📉'} {kpi.change}
                </span>
              </div>

              <div
                style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: 'white',
                  marginBottom: '8px',
                }}
              >
                {kpi.value}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: '70%',
                    height: '4px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${kpi.confidence}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}CC)`,
                      borderRadius: '2px',
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontWeight: '600',
                  }}
                >
                  {kpi.confidence}% Confidence
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise Performance Chart */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: 'white',
              }}
            >
              📈 ENTERPRISE PERFORMANCE MATRIX
            </h3>
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
                  display: 'flex',
                  gap: '16px',
                  fontSize: '10px',
                  fontWeight: '600',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '3px',
                      background: '#10b981',
                      borderRadius: '2px',
                    }}
                  />
                  REVENUE GROWTH
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '3px',
                      background: '#3b82f6',
                      borderRadius: '2px',
                    }}
                  />
                  MARKET SHARE
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      width: '12px',
                      height: '3px',
                      background: '#8b5cf6',
                      borderRadius: '2px',
                    }}
                  />
                  AI OPTIMIZATION
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <canvas
              ref={mainChartRef}
              width={1000}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* AI Strategic Insights */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '20px',
            marginBottom: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h3
            style={{
              fontSize: '18px',
              fontWeight: '700',
              color: 'white',
              marginBottom: '16px',
              textAlign: 'center',
            }}
          >
            🧠 AI STRATEGIC INTELLIGENCE CENTER
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '16px',
            }}
          >
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `2px solid ${insight.color}`,
                  borderLeft: `4px solid ${insight.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: insight.color,
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '8px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {insight.priority}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '9px',
                      color: insight.color,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      marginBottom: '4px',
                    }}
                  >
                    {insight.category}
                  </div>
                  <h4
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'white',
                      margin: '0 0 8px 0',
                    }}
                  >
                    {insight.title}
                  </h4>
                </div>

                <p
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: '1.4',
                    marginBottom: '12px',
                  }}
                >
                  {insight.insight}
                </p>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      color: insight.color,
                    }}
                  >
                    {insight.impact}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: '600',
                    }}
                  >
                    {insight.confidence}% AI Confidence
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {insight.actions.map((action, actionIndex) => (
                    <button
                      key={actionIndex}
                      style={{
                        background: `linear-gradient(135deg, ${insight.color}, ${insight.color}CC)`,
                        border: 'none',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '9px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                      }}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
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
