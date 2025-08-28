'use client';

import { useState } from 'react';

interface CallCenterMetrics {
  totalCalls: number;
  connectedCalls: number;
  averageCallTime: number;
  conversionRate: number;
  leadQuality: number;
  revenue: number;
}

interface LeadSource {
  id: string;
  name: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  count: number;
  conversionRate: number;
}

interface Agent {
  id: string;
  name: string;
  status: 'available' | 'on_call' | 'break' | 'offline';
  queue: string;
  callsToday: number;
  conversions: number;
}

export function FreeSWITCHCallCenterDashboard() {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    server: 'Not configured',
    uptime: 'N/A',
    version: 'N/A',
    lastHeartbeat: null,
  });

  const [metrics, setMetrics] = useState({
    totalCalls: 0,
    connectedCalls: 0,
    averageCallTime: 0,
    conversionRate: 0,
    leadQuality: 0,
    revenue: 0,
    queueWaitTime: 0,
    abandonRate: 0,
    answerRate: 0,
    activeAgents: 0,
    totalAgents: 0,
  });

  const [leadSources, setLeadSources] = useState([]);

  const [agents, setAgents] = useState([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#10b981';
      case 'on_call':
        return '#3b82f6';
      case 'busy':
        return '#f59e0b';
      case 'away':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return '🟢';
      case 'on_call':
        return '📞';
      case 'busy':
        return '🔴';
      case 'away':
        return '⏸️';
      default:
        return '❓';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Connection Status */}
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: connectionStatus.isConnected
                  ? '#10b981'
                  : '#ef4444',
              }}
            />
            <span
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              📡{' '}
              {connectionStatus.isConnected
                ? 'FreeSWITCH Connected'
                : 'FreeSWITCH Not Connected'}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              Server: {connectionStatus.server}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              Status:{' '}
              {connectionStatus.isConnected
                ? `Uptime: ${connectionStatus.uptime}`
                : 'Configuration Required'}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #3b82f6',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                Total Calls
              </p>
              <p
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {metrics.totalCalls.toLocaleString()}
              </p>
            </div>
            <span style={{ fontSize: '32px' }}>📊</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #10b981',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                Answer Rate
              </p>
              <p
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {metrics.answerRate}%
              </p>
            </div>
            <span style={{ fontSize: '32px' }}>✅</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #f59e0b',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                Avg Call Time
              </p>
              <p
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {metrics.averageCallTime}m
              </p>
            </div>
            <span style={{ fontSize: '32px' }}>⏱️</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            borderLeft: '4px solid #ec4899',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                Conversion Rate
              </p>
              <p
                style={{
                  color: 'white',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  margin: 0,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                }}
              >
                {metrics.conversionRate}%
              </p>
            </div>
            <span style={{ fontSize: '32px' }}>💰</span>
          </div>
        </div>
      </div>

      {/* Lead Sources */}
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
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🎯 Lead Sources Performance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {leadSources.length === 0 ? (
            <div
              style={{
                padding: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
              <h4
                style={{
                  color: 'white',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                }}
              >
                No Lead Sources Configured
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Configure lead sources to start tracking performance and
                conversions
              </p>
            </div>
          ) : (
            leadSources.map((source) => (
              <div
                key={source.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(5px)',
                  borderLeft: '4px solid #ec4899',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ fontSize: '24px' }}>
                    {source.id === 'gov_contracts'
                      ? '🏛️'
                      : source.id === 'freight_marketplace'
                        ? '🚛'
                        : source.id === 'rfx_intelligence'
                          ? '🧠'
                          : source.id === 'web_inquiries'
                            ? '🌐'
                            : '🤝'}
                  </span>
                  <div>
                    <p
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        margin: 0,
                        fontSize: '14px',
                      }}
                    >
                      {source.name}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        margin: 0,
                      }}
                    >
                      {source.leads} leads this month
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      color: '#ec4899',
                      fontWeight: '600',
                      margin: 0,
                      fontSize: '16px',
                    }}
                  >
                    {formatCurrency(source.revenue)}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                      margin: 0,
                    }}
                  >
                    {source.conversion}% conversion
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Agent Status */}
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
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          👥 Agent Status
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {agents.length === 0 ? (
            <div
              style={{
                padding: '32px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                textAlign: 'center',
                gridColumn: '1 / -1',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <h4
                style={{
                  color: 'white',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  fontSize: '16px',
                }}
              >
                No Agents Connected
              </h4>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Connect FreeSWITCH agents to start handling calls and tracking
                performance
              </p>
            </div>
          ) : (
            agents.map((agent) => (
              <div
                key={agent.id}
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(5px)',
                  borderLeft: '4px solid #10b981',
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
                  <p
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {agent.name}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>
                      {getStatusIcon(agent.status)}
                    </span>
                    <span
                      style={{
                        color: getStatusColor(agent.status),
                        fontSize: '12px',
                      }}
                    >
                      {agent.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                    marginBottom: '8px',
                  }}
                >
                  Queue: {agent.queue} | Skills: {agent.skills.join(', ')}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '12px',
                  }}
                >
                  📞 {agent.performance.calls} calls | 💼{' '}
                  {agent.performance.conversions} conversions | ⏱️{' '}
                  {agent.performance.avgTime}m avg
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Revenue Impact */}
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
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          💎 Revenue Impact
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: '#ec4899',
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {formatCurrency(metrics.revenue)}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              💰 Monthly Revenue
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: '#10b981',
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {formatCurrency(metrics.revenue * 12)}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              📈 Annual Projection
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: '#3b82f6',
                fontSize: '36px',
                fontWeight: 'bold',
                marginBottom: '8px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {metrics.revenue > 0
                ? `${((metrics.revenue / 100000) * 100).toFixed(1)}%`
                : '0%'}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
            >
              🎯 ROI
            </div>
          </div>
        </div>
      </div>

      {/* AI Strategies */}
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
            color: 'white',
            fontSize: '18px',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🤖 AI Lead Generation Strategies
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🎯</span>
              <span
                style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}
              >
                Smart Lead Scoring
              </span>
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                marginBottom: '12px',
              }}
            >
              AI analyzes company size, industry, urgency, and location to
              prioritize leads
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  color: metrics.leadQuality > 0 ? '#10b981' : '#6b7280',
                  fontSize: '12px',
                }}
              >
                {metrics.leadQuality > 0 ? '✅ Active' : '⚙️ Not Configured'}
              </span>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}
              >
                Quality Score: {metrics.leadQuality}/100
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '20px' }}>📞</span>
              <span
                style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}
              >
                Intelligent Call Routing
              </span>
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                marginBottom: '12px',
              }}
            >
              Routes calls to best-suited agents based on skills and performance
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  color: agents.length > 0 ? '#10b981' : '#6b7280',
                  fontSize: '12px',
                }}
              >
                {agents.length > 0 ? '✅ Active' : '⚙️ Not Configured'}
              </span>
              <span
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px' }}
              >
                Efficiency: {agents.length > 0 ? '85%' : '0%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
