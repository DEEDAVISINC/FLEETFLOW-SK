'use client';

import { useEffect, useState } from 'react';
import { aiCallAnalysisService } from '../services/AICallAnalysisService';
import { intelligentCallRoutingService } from '../services/IntelligentCallRoutingService';

interface DashboardMetrics {
  realTime: {
    activeCalls: number;
    waitingCalls: number;
    availableAgents: number;
    totalAgents: number;
    averageWaitTime: number;
    serviceLevel: number;
  };
  daily: {
    totalCalls: number;
    answeredCalls: number;
    missedCalls: number;
    averageCallDuration: number;
    customerSatisfaction: number;
    firstCallResolution: number;
  };
  performance: {
    topAgents: Array<{
      name: string;
      callsHandled: number;
      avgCallTime: number;
      satisfaction: number;
    }>;
    callDistribution: {
      sales: number;
      support: number;
      complaints: number;
      bookings: number;
    };
  };
}

export default function CallCenterAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    realTime: {
      activeCalls: 7,
      waitingCalls: 3,
      availableAgents: 4,
      totalAgents: 8,
      averageWaitTime: 45,
      serviceLevel: 87.3,
    },
    daily: {
      totalCalls: 247,
      answeredCalls: 231,
      missedCalls: 16,
      averageCallDuration: 312,
      customerSatisfaction: 8.7,
      firstCallResolution: 84.2,
    },
    performance: {
      topAgents: [
        {
          name: 'Sarah Johnson',
          callsHandled: 23,
          avgCallTime: 285,
          satisfaction: 9.2,
        },
        {
          name: 'Mike Davis',
          callsHandled: 19,
          avgCallTime: 398,
          satisfaction: 8.9,
        },
        {
          name: 'Lisa Chen',
          callsHandled: 17,
          avgCallTime: 267,
          satisfaction: 8.8,
        },
      ],
      callDistribution: {
        sales: 89,
        support: 76,
        complaints: 23,
        bookings: 59,
      },
    },
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState<
    'today' | 'week' | 'month'
  >('today');
  const [selectedView, setSelectedView] = useState<
    'overview' | 'agents' | 'queues' | 'analytics'
  >('overview');
  const [agents, setAgents] = useState(
    intelligentCallRoutingService.getAgents()
  );
  const [callQueues, setCallQueues] = useState(
    intelligentCallRoutingService.getCallQueues()
  );
  const [recentAnalyses, setRecentAnalyses] = useState(
    aiCallAnalysisService.getAnalysisHistory(5)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      // Update real-time metrics
      setMetrics((prev) => ({
        ...prev,
        realTime: {
          ...prev.realTime,
          activeCalls: Math.max(
            0,
            prev.realTime.activeCalls + (Math.random() > 0.5 ? 1 : -1)
          ),
          waitingCalls: Math.max(
            0,
            prev.realTime.waitingCalls + (Math.random() > 0.7 ? 1 : -1)
          ),
          averageWaitTime: Math.max(
            15,
            prev.realTime.averageWaitTime + (Math.random() - 0.5) * 10
          ),
        },
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <span style={{ fontSize: '40px' }}>📊</span>
                Call Center Analytics
              </h1>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}
              >
                Real-time insights and performance metrics
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {(['overview', 'agents', 'queues', 'analytics'] as const).map(
                (view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    style={{
                      background:
                        selectedView === view
                          ? 'rgba(255, 255, 255, 0.3)'
                          : 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedView !== view) {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedView !== view) {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                  >
                    {view}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Real-time Metrics Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#22c55e' }}
            >
              {metrics.realTime.activeCalls}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Active Calls
            </div>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}
            >
              {metrics.realTime.waitingCalls}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Waiting Calls
            </div>
          </div>

          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}
            >
              {metrics.realTime.availableAgents}/{metrics.realTime.totalAgents}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Available Agents
            </div>
          </div>

          <div
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#a855f7' }}
            >
              {formatTime(metrics.realTime.averageWaitTime)}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Avg Wait Time
            </div>
          </div>

          <div
            style={{
              background: 'rgba(236, 72, 153, 0.2)',
              border: '1px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#ec4899' }}
            >
              {metrics.realTime.serviceLevel.toFixed(1)}%
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Service Level
            </div>
          </div>
        </div>

        {/* Main Content */}
        {selectedView === 'overview' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr',
              gap: '24px',
            }}
          >
            {/* Daily Performance */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📈 Daily Performance
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#22c55e',
                    }}
                  >
                    {metrics.daily.totalCalls}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Total Calls Today
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#22c55e',
                      marginTop: '4px',
                    }}
                  >
                    ↗️ +12% vs yesterday
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#3b82f6',
                    }}
                  >
                    {(
                      (metrics.daily.answeredCalls / metrics.daily.totalCalls) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Answer Rate
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#3b82f6',
                      marginTop: '4px',
                    }}
                  >
                    ↗️ +2.3% vs yesterday
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#f59e0b',
                    }}
                  >
                    {formatDuration(metrics.daily.averageCallDuration)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Avg Call Duration
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#f59e0b',
                      marginTop: '4px',
                    }}
                  >
                    ↘️ -8s vs yesterday
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#a855f7',
                    }}
                  >
                    {metrics.daily.customerSatisfaction.toFixed(1)}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    Customer Satisfaction
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#a855f7',
                      marginTop: '4px',
                    }}
                  >
                    ↗️ +0.3 vs yesterday
                  </div>
                </div>
              </div>
            </div>

            {/* Recent AI Analysis */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🤖 Recent AI Analysis
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {recentAnalyses.slice(0, 3).map((analysis, index) => (
                  <div
                    key={analysis.callId}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Call #{analysis.callId.slice(-6)}
                      </div>
                      <div
                        style={{
                          background:
                            analysis.sentiment.overall === 'positive'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : analysis.sentiment.overall === 'negative'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(156, 163, 175, 0.2)',
                          color:
                            analysis.sentiment.overall === 'positive'
                              ? '#22c55e'
                              : analysis.sentiment.overall === 'negative'
                                ? '#ef4444'
                                : '#9ca3af',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {analysis.sentiment.overall}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '6px',
                      }}
                    >
                      Intent: {analysis.intent.primary} • Duration:{' '}
                      {formatDuration(analysis.duration)}
                    </div>

                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      Satisfaction:{' '}
                      {analysis.performance.agentPerformance.customerSatisfaction.toFixed(
                        1
                      )}
                      /10
                      {analysis.performance.businessOutcome.leadGenerated &&
                        ' • Lead Generated ✨'}
                    </div>
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '8px',
                  color: '#60a5fa',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginTop: '12px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                View All Analysis Reports
              </button>
            </div>
          </div>
        )}

        {selectedView === 'agents' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👥 Agent Performance
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '16px',
              }}
            >
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {agent.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {agent.specialties.join(', ')} • {agent.experience}
                      </div>
                    </div>
                    <div
                      style={{
                        background:
                          agent.status === 'available'
                            ? 'rgba(34, 197, 94, 0.2)'
                            : agent.status === 'busy'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(156, 163, 175, 0.2)',
                        color:
                          agent.status === 'available'
                            ? '#22c55e'
                            : agent.status === 'busy'
                              ? '#f59e0b'
                              : '#9ca3af',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {agent.status}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                        }}
                      >
                        {agent.performance.callsHandledToday}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Calls Today
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                        }}
                      >
                        {agent.performance.customerSatisfaction.toFixed(1)}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Satisfaction
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                        }}
                      >
                        {formatDuration(agent.performance.averageCallTime)}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Avg Call Time
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '20px',
                          fontWeight: 'bold',
                          color: '#a855f7',
                        }}
                      >
                        {(agent.performance.resolutionRate * 100).toFixed(0)}%
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Resolution Rate
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '12px',
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    Skills: {agent.skills.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'queues' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📋 Queue Management
            </h3>

            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {callQueues.map((queue) => (
                <div
                  key={queue.id}
                  style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {queue.name}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                        }}
                      >
                        {queue.description}
                      </div>
                    </div>
                    <div
                      style={{
                        background: queue.isActive
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(156, 163, 175, 0.2)',
                        color: queue.isActive ? '#22c55e' : '#9ca3af',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {queue.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                        }}
                      >
                        {queue.calls.length}/{queue.maxSize}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Queue Size
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                        }}
                      >
                        {formatTime(queue.estimatedWaitTime)}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Est. Wait Time
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                        }}
                      >
                        {queue.metrics.totalCalls}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Total Calls
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#a855f7',
                        }}
                      >
                        {(queue.metrics.serviceLevel * 100).toFixed(0)}%
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Service Level
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#ec4899',
                        }}
                      >
                        {(queue.metrics.abandonmentRate * 100).toFixed(1)}%
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Abandonment Rate
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedView === 'analytics' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
            }}
          >
            {/* Call Distribution Chart */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 Call Distribution
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {Object.entries(metrics.performance.callDistribution).map(
                  ([type, count]) => {
                    const total = Object.values(
                      metrics.performance.callDistribution
                    ).reduce((a, b) => a + b, 0);
                    const percentage = (count / total) * 100;

                    return (
                      <div
                        key={type}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '80px',
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {type}
                        </div>
                        <div
                          style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.3)',
                            borderRadius: '4px',
                            height: '20px',
                            position: 'relative',
                          }}
                        >
                          <div
                            style={{
                              background:
                                type === 'sales'
                                  ? '#22c55e'
                                  : type === 'support'
                                    ? '#3b82f6'
                                    : type === 'complaints'
                                      ? '#ef4444'
                                      : '#f59e0b',
                              height: '100%',
                              width: `${percentage}%`,
                              borderRadius: '4px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                        <div
                          style={{
                            width: '60px',
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '600',
                            textAlign: 'right',
                          }}
                        >
                          {count} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* Top Performers */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🏆 Top Performers
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {metrics.performance.topAgents.map((agent, index) => (
                  <div
                    key={agent.name}
                    style={{
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px',
                      padding: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          background:
                            index === 0
                              ? '#ffd700'
                              : index === 1
                                ? '#c0c0c0'
                                : '#cd7f32',
                          color: 'black',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {agent.name}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {agent.callsHandled} calls •{' '}
                          {formatDuration(agent.avgCallTime)} avg
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      ⭐ {agent.satisfaction.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
