'use client';

import { useEffect, useState } from 'react';
// import { EDIStatusMonitor } from '../../components/EDIStatusMonitor';

interface AIInsight {
  type:
    | 'route_optimization'
    | 'maintenance_prediction'
    | 'cost_optimization'
    | 'driver_analysis'
    | 'dispatch_optimization'
    | 'carrier_matching'
    | 'rate_optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: string;
}

interface AutomationStatus {
  isRunning: boolean;
  lastUpdate: string | null;
  tasksRunning: string[];
}

export default function AIAutomationDashboard() {
  const [selectedTab, setSelectedTab] = useState<
    | 'overview'
    | 'dispatch'
    | 'freight'
    | 'intelligence'
    | 'optimization'
    | 'insights'
  >('overview');
  const [automationStatus, setAutomationStatus] = useState<AutomationStatus>({
    isRunning: false,
    lastUpdate: null,
    tasksRunning: [],
  });
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatchRecommendation, setDispatchRecommendation] =
    useState<any>(null);
  const [testingDispatch, setTestingDispatch] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  useEffect(() => {
    loadAIInsights();
    loadAutomationStatus();
  }, []);

  const loadAutomationStatus = async () => {
    try {
      const response = await fetch('/api/ai/automation');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to load automation status:', error);
      // Set default status on error to prevent crashes
      setAutomationStatus({
        isRunning: false,
        lastUpdate: null,
        tasksRunning: [],
      });
    }
  };

  const loadAIInsights = async () => {
    setLoading(true);
    try {
      // Production-ready insights (cleared for production)
      const sampleInsights: AIInsight[] = [];

      setInsights(sampleInsights);
    } catch (error) {
      console.error('Failed to load AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async () => {
    try {
      const action = automationStatus.isRunning ? 'stop' : 'start';
      const response = await fetch('/api/ai/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (data.success) {
        setAutomationStatus(data.status);
      }
    } catch (error) {
      console.error('Failed to toggle automation:', error);
    }
  };

  const testAIDispatch = async () => {
    setTestingDispatch(true);
    try {
      // Production-ready test data (cleared for production)
      const testLoad = {};
      const testCarriers = [];

      const response = await fetch('/api/ai/dispatch-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ load: testLoad, carriers: testCarriers }),
      });

      const result = await response.json();
      setDispatchRecommendation(result.recommendation);
    } catch (error) {
      console.error('AI dispatch test failed:', error);
    } finally {
      setTestingDispatch(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          backgroundColor: '#dc2626',
          color: 'white',
          borderColor: '#dc2626',
        };
      case 'high':
        return {
          backgroundColor: '#ea580c',
          color: 'white',
          borderColor: '#ea580c',
        };
      case 'medium':
        return {
          backgroundColor: '#d97706',
          color: 'white',
          borderColor: '#d97706',
        };
      case 'low':
        return {
          backgroundColor: '#2563eb',
          color: 'white',
          borderColor: '#2563eb',
        };
      default:
        return {
          backgroundColor: '#4b5563',
          color: 'white',
          borderColor: '#4b5563',
        };
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'maintenance_prediction':
        return '🔧';
      case 'route_optimization':
        return '🗺️';
      case 'cost_optimization':
        return '💰';
      case 'driver_analysis':
        return '👨‍💼';
      case 'dispatch_optimization':
        return '🚛';
      case 'carrier_matching':
        return '🤝';
      case 'rate_optimization':
        return '📈';
      default:
        return '🤖';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px',
      }}
    >
      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '32px' }}>🤖</span>
            </div>
            <div>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }}
              >
                AI Flow
              </h1>
              <p
                style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0',
                }}
              >
                Complete AI-powered freight intelligence and automation system
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'dispatch', label: 'AI Dispatch', icon: '🚛' },
            { id: 'freight', label: 'Freight AI', icon: '🤖' },
            { id: 'intelligence', label: 'Market Intel', icon: '�' },
            { id: 'optimization', label: 'Route Optimizer', icon: '🗺️' },
            { id: 'insights', label: 'Insights', icon: '💡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background:
                  selectedTab === tab.id
                    ? 'rgba(255, 255, 255, 0.25)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div>
            {/* Automation Controls */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
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
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '12px' }}>⚙️</span>
                  Automation Engine
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
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
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: automationStatus.isRunning
                            ? '#10b981'
                            : '#6b7280',
                        }}
                      />
                      <span
                        style={{
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {automationStatus.isRunning ? 'Running' : 'Stopped'}
                      </span>
                    </div>
                    <button
                      onClick={toggleAutomation}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: automationStatus.isRunning
                          ? '#dc2626'
                          : '#10b981',
                        color: 'white',
                      }}
                    >
                      {automationStatus.isRunning ? 'Stop' : 'Start'}
                    </button>
                  </div>

                  {automationStatus.lastUpdate && (
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Last update:{' '}
                      {new Date(automationStatus.lastUpdate).toLocaleString()}
                    </div>
                  )}

                  {automationStatus.tasksRunning.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <h4
                        style={{
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Active Tasks:
                      </h4>
                      {automationStatus.tasksRunning.map((task, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.8)',
                          }}
                        >
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#3b82f6',
                              borderRadius: '50%',
                              animation: 'pulse 2s infinite',
                            }}
                          />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>⚡</span>
                  Quick Actions
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* EDI Integration Status */}
                  <div
                    style={{
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid rgba(34, 197, 94, 0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '12px',
                      }}
                    >
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>
                        📡
                      </span>
                      <h4
                        style={{
                          color: 'white',
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        EDI Integration Status
                      </h4>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#d1d5db',
                        lineHeight: '1.4',
                      }}
                    >
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e' }}>
                          ✅ Service Layer Complete
                        </span>{' '}
                        - EDI 214, 204, 210, 997, 990, 820
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#22c55e' }}>
                          ✅ Workflow Integration
                        </span>{' '}
                        - Auto-triggered EDI messages
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#3b82f6' }}>
                          📊 Monitor Below
                        </span>{' '}
                        - Full EDI status in main dashboard
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af' }}>
                        See EDI Status Monitor in Overview tab for real-time
                        updates
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => loadAIInsights()}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: '600',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <span>🔄</span>
                    <span>
                      {loading ? 'Refreshing...' : 'Refresh Insights'}
                    </span>
                  </button>

                  <button
                    onClick={testAIDispatch}
                    disabled={testingDispatch}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: 'white',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      cursor: testingDispatch ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontWeight: '600',
                      opacity: testingDispatch ? 0.5 : 1,
                    }}
                  >
                    <span>🚛</span>
                    <span>
                      {testingDispatch ? 'Testing...' : 'Test AI Dispatch'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Documentation & Guides */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: '8px' }}>📚</span>
                Documentation & Guides
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '12px',
                }}
              >
                <button
                  onClick={() => setShowSetupGuide(true)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(139, 69, 19, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(139, 69, 19, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  <span>🤖</span>
                  <div>
                    <div>AI System Setup Guide</div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        opacity: 0.8,
                      }}
                    >
                      Complete guide to AI features and configuration
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.open('/docs/edi-integration', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  <span>📡</span>
                  <div>
                    <div>EDI Integration Guide</div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        opacity: 0.8,
                      }}
                    >
                      Electronic Data Interchange setup and configuration
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.open('/docs/user-guide', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  <span>📖</span>
                  <div>
                    <div>User Guide</div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        opacity: 0.8,
                      }}
                    >
                      Complete FleetFlow system user documentation
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.open('/docs/quick-start', '_blank')}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: 'rgba(168, 85, 247, 0.2)',
                    color: 'white',
                    borderRadius: '12px',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    fontWeight: '600',
                    textAlign: 'left',
                  }}
                >
                  <span>⚡</span>
                  <div>
                    <div>Quick Start Guide</div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: '400',
                        opacity: 0.8,
                      }}
                    >
                      Get started with FleetFlow in minutes
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'dispatch' && (
          <div className='space-y-6'>
            {/* AI Dispatch Test Results */}
            {dispatchRecommendation && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ marginRight: '8px' }}>🚛</span>
                  AI Dispatch Recommendation
                </h3>

                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div
                      style={{
                        padding: '20px',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <h4
                        style={{
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: 'rgb(134, 239, 172)',
                        }}
                      >
                        Primary Recommendation
                      </h4>
                      <p style={{ color: 'rgb(74, 222, 128)' }}>
                        Carrier:{' '}
                        {
                          dispatchRecommendation.primaryRecommendation
                            ?.carrierId
                        }
                      </p>
                      <p style={{ color: 'rgb(74, 222, 128)' }}>
                        Match Score:{' '}
                        {
                          dispatchRecommendation.primaryRecommendation
                            ?.matchScore
                        }
                        %
                      </p>
                      <p
                        style={{
                          marginTop: '8px',
                          fontSize: '14px',
                          color: 'rgb(134, 239, 172)',
                        }}
                      >
                        {
                          dispatchRecommendation.primaryRecommendation
                            ?.reasoning
                        }
                      </p>
                    </div>

                    {dispatchRecommendation.rateRecommendation && (
                      <div
                        style={{
                          padding: '20px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <h4
                          style={{
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgb(147, 197, 253)',
                          }}
                        >
                          Rate Recommendation
                        </h4>
                        <p style={{ color: 'rgb(96, 165, 250)' }}>
                          Suggested Rate: $
                          {dispatchRecommendation.rateRecommendation.suggestedRate.toLocaleString()}
                        </p>
                        <p style={{ color: 'rgb(96, 165, 250)' }}>
                          Competitiveness:{' '}
                          {
                            dispatchRecommendation.rateRecommendation
                              .competitivenessScore
                          }
                          %
                        </p>
                        <p
                          style={{
                            marginTop: '8px',
                            fontSize: '14px',
                            color: 'rgb(147, 197, 253)',
                          }}
                        >
                          {
                            dispatchRecommendation.rateRecommendation
                              .rateJustification
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className='space-y-4'>
                    {dispatchRecommendation.expectedOutcome && (
                      <div
                        style={{
                          padding: '20px',
                          background: 'rgba(147, 51, 234, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(147, 51, 234, 0.2)',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        <h4
                          style={{
                            marginBottom: '8px',
                            fontWeight: '600',
                            color: 'rgb(196, 181, 253)',
                          }}
                        >
                          Expected Outcome
                        </h4>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            fontSize: '14px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span style={{ color: 'rgb(196, 181, 253)' }}>
                              On-Time Delivery:
                            </span>
                            <span
                              style={{
                                fontWeight: '500',
                                color: 'rgb(168, 85, 247)',
                              }}
                            >
                              {
                                dispatchRecommendation.expectedOutcome
                                  .onTimeDeliveryProbability
                              }
                              %
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span style={{ color: 'rgb(196, 181, 253)' }}>
                              Cost Efficiency:
                            </span>
                            <span
                              style={{
                                fontWeight: '500',
                                color: 'rgb(168, 85, 247)',
                              }}
                            >
                              {
                                dispatchRecommendation.expectedOutcome
                                  .costEfficiency
                              }
                              %
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span style={{ color: 'rgb(196, 181, 253)' }}>
                              Customer Satisfaction:
                            </span>
                            <span
                              style={{
                                fontWeight: '500',
                                color: 'rgb(168, 85, 247)',
                              }}
                            >
                              {
                                dispatchRecommendation.expectedOutcome
                                  .customerSatisfactionPrediction
                              }
                              /5.0
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {dispatchRecommendation.riskFactors &&
                      dispatchRecommendation.riskFactors.length > 0 && (
                        <div
                          style={{
                            padding: '20px',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(245, 158, 11, 0.2)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          <h4
                            style={{
                              marginBottom: '8px',
                              fontWeight: '600',
                              color: 'rgb(253, 224, 71)',
                            }}
                          >
                            Risk Factors
                          </h4>
                          <ul
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px',
                            }}
                          >
                            {dispatchRecommendation.riskFactors.map(
                              (risk: string, index: number) => (
                                <li
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    fontSize: '14px',
                                    color: 'rgb(251, 191, 36)',
                                  }}
                                >
                                  <span style={{ marginRight: '8px' }}>⚠️</span>
                                  <span>{risk}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '24px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                    paddingTop: '16px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    <strong style={{ color: 'white' }}>
                      Confidence Score:
                    </strong>{' '}
                    {dispatchRecommendation.confidenceScore}%
                    {dispatchRecommendation.warning && (
                      <span
                        style={{
                          marginLeft: '16px',
                          color: 'rgb(251, 146, 60)',
                        }}
                      >
                        ⚠️ {dispatchRecommendation.warning}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Dispatch Analytics */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-sm'>
                <div className='mb-3 text-3xl'>🎯</div>
                <h4 className='mb-2 font-semibold text-white'>
                  Match Accuracy
                </h4>
                <p className='text-2xl font-bold text-blue-400'>94.2%</p>
                <p className='text-sm text-white/70'>
                  AI recommendation accuracy
                </p>
              </div>

              <div className='rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-sm'>
                <div className='mb-3 text-3xl'>💰</div>
                <h4 className='mb-2 font-semibold text-white'>Cost Savings</h4>
                <p className='text-2xl font-bold text-green-400'>$18,420</p>
                <p className='text-sm text-white/70'>This month</p>
              </div>

              <div className='rounded-2xl border border-white/20 bg-white/10 p-6 text-center shadow-lg backdrop-blur-sm'>
                <div className='mb-3 text-3xl'>⚡</div>
                <h4 className='mb-2 font-semibold text-white'>Response Time</h4>
                <p className='text-2xl font-bold text-purple-400'>1.2s</p>
                <p className='text-sm text-white/70'>
                  Average AI decision time
                </p>
              </div>
            </div>

            {/* EDI Integration Status Monitor */}
            <div className='mt-8'>
              {/* <EDIStatusMonitor className='border-white/20 bg-white/10 backdrop-blur-sm' /> */}
            </div>
          </div>
        )}

        {/* AI Insights */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginTop: '32px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: '600',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '8px' }}>💡</span>
            Recent AI Insights
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {loading && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                Loading AI insights...
              </div>
            )}
            {!loading && insights.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                No AI insights available. Generating insights...
              </div>
            )}
            {insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  padding: '20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', flex: 1 }}>
                    <div style={{ fontSize: '24px' }}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '8px',
                          fontSize: '16px',
                        }}
                      >
                        {insight.title}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.9)',
                          marginBottom: '12px',
                          lineHeight: '1.5',
                        }}
                      >
                        {insight.description}
                      </p>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontWeight: '500',
                        }}
                      >
                        {new Date(insight.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      border: '1px solid',
                      ...getPriorityColor(insight.priority),
                    }}
                  >
                    {insight.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTab === 'dispatch' && (
          <div style={{ marginTop: '32px' }}>
            {/* AI Dispatch Command Center */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(147, 51, 234, 0.9))',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px',
                }}
              >
                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '28px',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    🚛 AI Dispatch Command Center
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                    }}
                  >
                    Real-time intelligent dispatch operations with AI-powered
                    automation
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    padding: '16px',
                    fontSize: '32px',
                  }}
                >
                  🎯
                </div>
              </div>
            </div>

            {/* Key Metrics Dashboard */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(22, 163, 74, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      Active Drivers
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      89
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      +12% from yesterday
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>👨‍💼</div>
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(37, 99, 235, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      Route Efficiency
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      94.2%
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      AI Optimized Routes
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>🗺️</div>
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(168, 85, 247, 0.9), rgba(147, 51, 234, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      On-Time Delivery
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      98.1%
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      Industry Leading
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>🎯</div>
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      Match Accuracy
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      94.2%
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      AI Load Matching
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>🧠</div>
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(20, 184, 166, 0.9), rgba(13, 148, 136, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(20, 184, 166, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      Cost Savings
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      23%
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      Monthly Average
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>💰</div>
                </div>
              </div>

              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(236, 72, 153, 0.9), rgba(219, 39, 119, 0.9))',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)',
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
                        fontSize: '14px',
                        opacity: 0.9,
                        marginBottom: '4px',
                      }}
                    >
                      Response Time
                    </p>
                    <p
                      style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      1.2s
                    </p>
                    <p style={{ fontSize: '12px', opacity: 0.8 }}>
                      Average API Response
                    </p>
                  </div>
                  <div style={{ fontSize: '24px' }}>⚡</div>
                </div>
              </div>
            </div>

            {/* EDI Status Monitor */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 EDI Transaction Monitor
              </h4>

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
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.8))',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
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
                      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        204
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.9 }}>
                        Load Tender
                      </p>
                    </div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                      }}
                    >
                      Active
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(37, 99, 235, 0.8))',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
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
                      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        214
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.9 }}>
                        Status Update
                      </p>
                    </div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                      }}
                    >
                      Tracking
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.8))',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
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
                      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        210
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.9 }}>Invoice</p>
                    </div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                      }}
                    >
                      Processing
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(245, 158, 11, 0.8), rgba(217, 119, 6, 0.8))',
                    borderRadius: '12px',
                    padding: '16px',
                    color: 'white',
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
                      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        990
                      </p>
                      <p style={{ fontSize: '12px', opacity: 0.9 }}>Response</p>
                    </div>
                    <span
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '10px',
                      }}
                    >
                      Confirmed
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '16px',
                }}
              >
                <h5
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '12px',
                  }}
                >
                  🤖 AI-Powered EDI Management
                </h5>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: '#10b981' }}>✅</span>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Format Validation
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      AI validates message structure and compliance
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: '#3b82f6' }}>📊</span>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Live Monitoring
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Real-time transaction oversight and alerts
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ color: '#8b5cf6' }}>🛡️</span>
                      <span
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Auto Compliance
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Ensures industry standard compliance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>{' '}
      {/* End Main Container */}
      {/* AI System Setup Guide Modal */}
      {showSetupGuide && (
        <div className='bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'>
          <div className='max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl'>
            <div className='bg-gradient-to-r from-red-500 to-red-600 p-6 text-white'>
              <div className='flex items-center justify-between'>
                <h2 className='flex items-center text-2xl font-bold'>
                  <span className='mr-3 text-3xl'>🤖</span>
                  Freight AI System Setup Guide
                </h2>
                <button
                  onClick={() => setShowSetupGuide(false)}
                  className='hover:bg-opacity-20 rounded-full p-2 text-white transition-colors hover:bg-white'
                >
                  <span className='text-2xl'>×</span>
                </button>
              </div>
            </div>

            <div className='max-h-[75vh] overflow-y-auto p-6'>
              <div className='space-y-8'>
                {/* System Overview */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>🌟</span>
                    AI System Overview
                  </h3>
                  <div className='mb-4 rounded-xl bg-blue-50 p-4'>
                    <p className='leading-relaxed text-gray-800'>
                      FleetFlow's AI system integrates multiple services to
                      provide intelligent freight management, automated dispatch
                      optimization, and real-time insights. Your system is
                      already configured with FMCSA and Google Maps APIs for
                      comprehensive functionality.
                    </p>
                  </div>
                </section>

                {/* API Integration Status */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>🔗</span>
                    API Integration Status
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-xl border border-green-200 bg-green-50 p-4'>
                      <div className='mb-2 flex items-center'>
                        <span className='mr-2 text-2xl'>✅</span>
                        <h4 className='font-semibold text-green-800'>
                          FMCSA API
                        </h4>
                      </div>
                      <p className='text-sm text-green-700'>
                        Carrier verification and safety ratings - Fully
                        operational
                      </p>
                    </div>

                    <div className='rounded-xl border border-green-200 bg-green-50 p-4'>
                      <div className='mb-2 flex items-center'>
                        <span className='mr-2 text-2xl'>✅</span>
                        <h4 className='font-semibold text-green-800'>
                          Google Maps API
                        </h4>
                      </div>
                      <p className='text-sm text-green-700'>
                        Route optimization and real-time tracking - Fully
                        operational
                      </p>
                    </div>
                  </div>
                </section>

                {/* AI Features */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>🚀</span>
                    AI-Powered Features
                  </h3>
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <div className='rounded-xl border border-gray-200 bg-white p-4'>
                      <h4 className='mb-2 flex items-center font-semibold text-gray-900'>
                        <span className='mr-2'>🚛</span>
                        Smart Dispatch
                      </h4>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• AI-powered load-carrier matching</li>
                        <li>• 95% accuracy in recommendations</li>
                        <li>• Real-time optimization</li>
                        <li>• Cost and efficiency analysis</li>
                      </ul>
                    </div>

                    <div className='rounded-xl border border-gray-200 bg-white p-4'>
                      <h4 className='mb-2 flex items-center font-semibold text-gray-900'>
                        <span className='mr-2'>🗺️</span>
                        Route Intelligence
                      </h4>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• Dynamic route optimization</li>
                        <li>• Traffic and weather integration</li>
                        <li>• Fuel efficiency calculations</li>
                        <li>• ETA predictions</li>
                      </ul>
                    </div>

                    <div className='rounded-xl border border-gray-200 bg-white p-4'>
                      <h4 className='mb-2 flex items-center font-semibold text-gray-900'>
                        <span className='mr-2'>📊</span>
                        Predictive Analytics
                      </h4>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• Market rate predictions</li>
                        <li>• Demand forecasting</li>
                        <li>• Carrier performance analysis</li>
                        <li>• Risk assessment</li>
                      </ul>
                    </div>

                    <div className='rounded-xl border border-gray-200 bg-white p-4'>
                      <h4 className='mb-2 flex items-center font-semibold text-gray-900'>
                        <span className='mr-2'>🔧</span>
                        Automation
                      </h4>
                      <ul className='space-y-1 text-sm text-gray-600'>
                        <li>• Automated load posting</li>
                        <li>• Smart carrier selection</li>
                        <li>• Real-time monitoring</li>
                        <li>• Alert systems</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Quick Start Guide */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>⚡</span>
                    Quick Start Guide
                  </h3>
                  <div className='space-y-4'>
                    <div className='rounded-r-xl border-l-4 border-blue-500 bg-blue-50 p-4'>
                      <h4 className='mb-2 font-semibold text-blue-900'>
                        Step 1: Dashboard Overview
                      </h4>
                      <p className='text-sm text-blue-800'>
                        Familiarize yourself with the AI Flow dashboard. Monitor
                        automation status, view real-time insights, and access
                        quick actions.
                      </p>
                    </div>

                    <div className='rounded-r-xl border-l-4 border-green-500 bg-green-50 p-4'>
                      <h4 className='mb-2 font-semibold text-green-900'>
                        Step 2: Enable Automation
                      </h4>
                      <p className='text-sm text-green-800'>
                        Toggle the automation switch to start AI-powered
                        dispatch and optimization. Monitor active tasks in
                        real-time.
                      </p>
                    </div>

                    <div className='rounded-r-xl border-l-4 border-purple-500 bg-purple-50 p-4'>
                      <h4 className='mb-2 font-semibold text-purple-900'>
                        Step 3: Test AI Dispatch
                      </h4>
                      <p className='text-sm text-purple-800'>
                        Use the "Test AI Dispatch" quick action to see AI
                        recommendations for load-carrier matching with
                        confidence scores.
                      </p>
                    </div>

                    <div className='rounded-r-xl border-l-4 border-orange-500 bg-orange-50 p-4'>
                      <h4 className='mb-2 font-semibold text-orange-900'>
                        Step 4: Monitor Insights
                      </h4>
                      <p className='text-sm text-orange-800'>
                        Review AI-generated insights for optimization
                        opportunities, carrier performance alerts, and
                        predictive maintenance recommendations.
                      </p>
                    </div>
                  </div>
                </section>

                {/* System Requirements */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>⚙️</span>
                    System Requirements & Configuration
                  </h3>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                      <div>
                        <h4 className='mb-2 font-semibold text-gray-900'>
                          Required APIs (Active)
                        </h4>
                        <ul className='space-y-1 text-sm text-gray-600'>
                          <li>✅ FMCSA API - Carrier verification</li>
                          <li>✅ Google Maps API - Route optimization</li>
                          <li>🔄 Weather API - Traffic conditions</li>
                          <li>🔄 Market Data API - Rate optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className='mb-2 font-semibold text-gray-900'>
                          System Features
                        </h4>
                        <ul className='space-y-1 text-sm text-gray-600'>
                          <li>✅ Real-time data processing</li>
                          <li>✅ Machine learning models</li>
                          <li>✅ Automated workflows</li>
                          <li>✅ Performance monitoring</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Best Practices */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>💡</span>
                    Best Practices
                  </h3>
                  <div className='space-y-3'>
                    <div className='rounded-xl border border-yellow-200 bg-yellow-50 p-4'>
                      <h4 className='mb-2 font-semibold text-yellow-800'>
                        Data Quality
                      </h4>
                      <p className='text-sm text-yellow-700'>
                        Ensure accurate load and carrier data entry for optimal
                        AI recommendations. The system learns from historical
                        data patterns.
                      </p>
                    </div>

                    <div className='rounded-xl border border-blue-200 bg-blue-50 p-4'>
                      <h4 className='mb-2 font-semibold text-blue-800'>
                        Regular Monitoring
                      </h4>
                      <p className='text-sm text-blue-700'>
                        Check the automation status daily and review AI insights
                        for actionable recommendations and system performance.
                      </p>
                    </div>

                    <div className='rounded-xl border border-green-200 bg-green-50 p-4'>
                      <h4 className='mb-2 font-semibold text-green-800'>
                        Continuous Learning
                      </h4>
                      <p className='text-sm text-green-700'>
                        The AI system improves over time. Provide feedback on
                        recommendations and monitor performance metrics for
                        optimal results.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Support & Resources */}
                <section>
                  <h3 className='mb-4 flex items-center text-xl font-semibold text-gray-900'>
                    <span className='mr-2'>🔧</span>
                    Support & Resources
                  </h3>
                  <div className='rounded-xl bg-gray-50 p-4'>
                    <p className='mb-3 text-gray-700'>
                      Need help with AI system configuration or experiencing
                      issues?
                    </p>
                    <div className='flex flex-wrap gap-3'>
                      <button className='rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700'>
                        📚 Documentation
                      </button>
                      <button className='rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700'>
                        💬 Support Chat
                      </button>
                      <button className='rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700'>
                        📧 Contact Support
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className='flex justify-end bg-gray-50 px-6 py-4'>
              <button
                onClick={() => setShowSetupGuide(false)}
                className='rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-colors hover:bg-red-700'
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Market Intel Tab */}
      {selectedTab === 'intelligence' && (
        <div style={{ marginTop: '32px' }}>
          {/* Market Intelligence Header */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(5, 150, 105, 0.9))',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
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
                <h3
                  style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  📊 Market Intelligence Center
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                  }}
                >
                  Real-time market analysis and competitive intelligence
                </p>
              </div>
            </div>
          </div>

          {/* Market Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'Market Rates',
                value: '$2.85/mile',
                change: '+5.2%',
                color: '#10b981',
                icon: '💰',
              },
              {
                title: 'Fuel Prices',
                value: '$3.42/gal',
                change: '-2.1%',
                color: '#f59e0b',
                icon: '⛽',
              },
              {
                title: 'Load Volume',
                value: '12,847',
                change: '+8.7%',
                color: '#3b82f6',
                icon: '📦',
              },
              {
                title: 'Competition',
                value: '847 Carriers',
                change: '+3.2%',
                color: '#8b5cf6',
                icon: '🏆',
              },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderLeft: `4px solid ${metric.color}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{metric.icon}</span>
                  <span
                    style={{
                      background: `${metric.color}20`,
                      color: metric.color,
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {metric.change}
                  </span>
                </div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                  }}
                >
                  {metric.title}
                </h4>
                <p
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Market Analysis Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                🎯 Lane Analysis
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <p>• Hot lanes: TX→CA (+12% rates)</p>
                <p>• Emerging: FL→NY (+8% volume)</p>
                <p>• Declining: IL→OH (-5% rates)</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                📈 Trend Predictions
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <p>• Q1 rates expected +7%</p>
                <p>• Capacity tightening in West</p>
                <p>• Fuel stabilizing at $3.40</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Route Optimizer Tab */}
      {selectedTab === 'optimization' && (
        <div style={{ marginTop: '32px' }}>
          {/* Route Optimizer Header */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.9))',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
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
                <h3
                  style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  🗺️ AI Route Optimizer
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                  }}
                >
                  Intelligent route planning with real-time optimization
                </p>
              </div>
            </div>
          </div>

          {/* Route Optimization Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            {[
              {
                title: 'Miles Saved',
                value: '2,847',
                subtitle: 'This Month',
                color: '#10b981',
                icon: '🛣️',
              },
              {
                title: 'Fuel Saved',
                value: '$12,450',
                subtitle: 'Cost Reduction',
                color: '#f59e0b',
                icon: '⛽',
              },
              {
                title: 'Time Saved',
                value: '147 hrs',
                subtitle: 'Driver Hours',
                color: '#3b82f6',
                icon: '⏱️',
              },
              {
                title: 'Efficiency',
                value: '94.2%',
                subtitle: 'Route Accuracy',
                color: '#8b5cf6',
                icon: '🎯',
              },
            ].map((metric, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderLeft: `4px solid ${metric.color}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{metric.icon}</span>
                </div>
                <h4
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom: '8px',
                  }}
                >
                  {metric.title}
                </h4>
                <p
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '700',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  {metric.value}
                </p>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    margin: 0,
                  }}
                >
                  {metric.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Route Features */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                🤖 AI Optimization Features
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <p>• Real-time traffic analysis</p>
                <p>• Weather impact assessment</p>
                <p>• Fuel station optimization</p>
                <p>• HOS compliance routing</p>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h4
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                📊 Performance Analytics
              </h4>
              <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                <p>• Route efficiency scoring</p>
                <p>• Driver performance tracking</p>
                <p>• Cost analysis reporting</p>
                <p>• Predictive maintenance alerts</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Insights Tab */}
      {selectedTab === 'insights' && (
        <div style={{ marginTop: '32px' }}>
          {/* Insights Header */}
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(124, 58, 237, 0.9))',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px',
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
                <h3
                  style={{
                    color: 'white',
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '8px',
                  }}
                >
                  💡 AI Insights Dashboard
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                  }}
                >
                  Intelligent analytics and predictive insights
                </p>
              </div>
            </div>
          </div>

          {/* Insights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {insights.map((insight, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderLeft: `4px solid ${
                    insight.priority === 'high'
                      ? '#ef4444'
                      : insight.priority === 'medium'
                        ? '#f59e0b'
                        : '#10b981'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: 0,
                    }}
                  >
                    {insight.title}
                  </h4>
                  <span
                    style={{
                      background: `${
                        insight.priority === 'high'
                          ? '#ef4444'
                          : insight.priority === 'medium'
                            ? '#f59e0b'
                            : '#10b981'
                      }20`,
                      color:
                        insight.priority === 'high'
                          ? '#ef4444'
                          : insight.priority === 'medium'
                            ? '#f59e0b'
                            : '#10b981',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    {insight.priority}
                  </span>
                </div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0,
                  }}
                >
                  {insight.description}
                </p>
              </div>
            ))}
          </div>

          {/* AI Analysis Summary */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h4
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              🧠 AI Analysis Summary
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  label: 'Insights Generated',
                  value: insights.length.toString(),
                  color: '#8b5cf6',
                },
                {
                  label: 'High Priority',
                  value: insights
                    .filter((i) => i.priority === 'high')
                    .length.toString(),
                  color: '#ef4444',
                },
                {
                  label: 'Recommendations',
                  value: '12',
                  color: '#10b981',
                },
                {
                  label: 'Accuracy Rate',
                  value: '94.2%',
                  color: '#3b82f6',
                },
              ].map((stat, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <p
                    style={{
                      color: stat.color,
                      fontSize: '28px',
                      fontWeight: '700',
                      margin: 0,
                      marginBottom: '8px',
                    }}
                  >
                    {stat.value}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
