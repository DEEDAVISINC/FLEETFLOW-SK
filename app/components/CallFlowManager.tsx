'use client';

import { useEffect, useState } from 'react';
import {
  Agent,
  CallMetrics,
  CallQueue,
  RoutingDecision,
  RoutingRule,
  intelligentCallRoutingService,
} from '../services/IntelligentCallRoutingService';

interface CallFlowManagerProps {
  user?: any;
}

/**
 * FleetFlow Call Flow Manager
 * Comprehensive call routing and flow management interface
 *
 * Features:
 * - Real-time call flow visualization
 * - Agent status management
 * - Queue monitoring
 * - Routing rule configuration
 * - Call flow testing and simulation
 * - Performance analytics
 */
export default function CallFlowManager({ user }: CallFlowManagerProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [callQueues, setCallQueues] = useState<CallQueue[]>([]);
  const [callMetrics, setCallMetrics] = useState<CallMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<
    'flow' | 'agents' | 'rules' | 'queues' | 'test' | 'metrics'
  >('flow');
  const [testCall, setTestCall] = useState({
    callerId: '+15551234567',
    callerType: 'existing',
    callType: 'sales',
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    customerTier: 'gold',
  });
  const [testResult, setTestResult] = useState<RoutingDecision | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      setAgents(intelligentCallRoutingService.getAgents());
      setRoutingRules(intelligentCallRoutingService.getRoutingRules());
      setCallQueues(intelligentCallRoutingService.getCallQueues());
      setCallMetrics(intelligentCallRoutingService.getCallMetrics());
    } catch (error) {
      console.error('Error loading call flow data:', error);
    }
  };

  const updateAgentStatus = (agentId: string, status: Agent['status']) => {
    intelligentCallRoutingService.updateAgentStatus(agentId, status);
    loadData();
  };

  const testCallRouting = () => {
    const testCallInfo = {
      callerId: testCall.callerId,
      callerInfo: {
        type: testCall.callerType,
        tier: testCall.customerTier,
        phone: testCall.callerId,
        previousInteractions: 5,
      },
      callType: testCall.callType,
      urgency: testCall.urgency,
    };

    const result = intelligentCallRoutingService.routeCall(testCallInfo);
    setTestResult(result);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return '#22c55e';
      case 'busy':
        return '#ef4444';
      case 'away':
        return '#f59e0b';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return '#ef4444'; // Critical
      case 2:
        return '#f97316'; // High
      case 3:
        return '#eab308'; // Medium
      case 4:
        return '#3b82f6'; // Low
      case 5:
        return '#6b7280'; // Lowest
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(5px)',
        borderRadius: '12px',
        padding: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'white',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            margin: '0 0 6px 0',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          📞 Call Flow Manager
        </h2>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.92)',
            fontSize: '12px',
            margin: 0,
          }}
        >
          Intelligent Call Routing & Flow Management System
        </p>
      </div>

      {/* System Status */}
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '6px',
          padding: '8px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 6px #22c55e',
          }}
        />
        <span style={{ color: '#22c55e', fontSize: '12px' }}>
          ✅ System Online •{' '}
          {agents.filter((a) => a.status === 'available').length} Agents
          Available • {callQueues.filter((q) => q.isActive).length} Active
          Queues • {routingRules.filter((r) => r.isActive).length} Active Rules
        </span>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '8px',
        }}
      >
        {[
          { key: 'flow', label: '📊 Flow', icon: '📊' },
          { key: 'agents', label: '👥 Agents', icon: '👥' },
          { key: 'test', label: '🧪 Test', icon: '🧪' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background:
                activeTab === tab.key
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
              border:
                activeTab === tab.key
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '6px 12px',
              color:
                activeTab === tab.key ? '#60a5fa' : 'rgba(255, 255, 255, 0.95)',
              fontSize: '11px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ height: 'calc(100% - 140px)', overflow: 'auto' }}>
        {activeTab === 'flow' && (
          <div>
            <h3
              style={{ color: 'white', fontSize: '16px', marginBottom: '12px' }}
            >
              Call Flow Overview
            </h3>

            {/* Flow Visualization */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
                marginBottom: '16px',
              }}
            >
              {/* Incoming Calls */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>📞</div>
                <div
                  style={{
                    color: '#60a5fa',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Incoming
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {callMetrics?.totalCalls || 0}
                </div>
              </div>

              {/* AI Router */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>🧠</div>
                <div
                  style={{
                    color: '#fbbf24',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  AI Router
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '10px',
                  }}
                >
                  {routingRules.length} Rules
                </div>
              </div>

              {/* Agents */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>👥</div>
                <div
                  style={{
                    color: '#22c55e',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Agents
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {agents.filter((a) => a.status === 'available').length}/
                  {agents.length}
                </div>
              </div>

              {/* Queues */}
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '6px',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '18px', marginBottom: '6px' }}>📋</div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  Queues
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  {callQueues.filter((q) => q.isActive).length}
                </div>
              </div>
            </div>

            {/* Flow Diagram */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                padding: '12px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  color: 'white',
                  fontSize: '12px',
                  marginBottom: '12px',
                  fontWeight: '600',
                }}
              >
                <strong>FleetFlow Call Routing Flow</strong>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    background: 'rgba(59, 130, 246, 0.3)',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: '500',
                  }}
                >
                  📞 Call
                </span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  →
                </span>
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.25)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: '500',
                  }}
                >
                  🧠 AI
                </span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  →
                </span>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    fontWeight: '500',
                  }}
                >
                  👥 Agent
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <h3
              style={{ color: 'white', fontSize: '16px', marginBottom: '12px' }}
            >
              Agent Management
            </h3>

            <div style={{ display: 'grid', gap: '8px' }}>
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getStatusColor(agent.status),
                        boxShadow: `0 0 6px ${getStatusColor(agent.status)}`,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '13px',
                        }}
                      >
                        {agent.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '10px',
                        }}
                      >
                        {agent.email} • {agent.specialties.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    {(['available', 'busy', 'away', 'offline'] as const).map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() => updateAgentStatus(agent.id, status)}
                          style={{
                            background:
                              agent.status === status
                                ? getStatusColor(status) + '30'
                                : 'rgba(255, 255, 255, 0.1)',
                            border: `1px solid ${agent.status === status ? getStatusColor(status) : 'rgba(255, 255, 255, 0.2)'}`,
                            borderRadius: '4px',
                            padding: '3px 6px',
                            color:
                              agent.status === status
                                ? 'white'
                                : 'rgba(255, 255, 255, 0.8)',
                            fontSize: '9px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                          }}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'test' && (
          <div>
            <h3
              style={{ color: 'white', fontSize: '16px', marginBottom: '12px' }}
            >
              Call Flow Testing
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
              }}
            >
              {/* Test Configuration */}
              <div>
                <h4
                  style={{
                    color: 'rgba(255, 255, 255, 0.98)',
                    fontSize: '14px',
                    marginBottom: '10px',
                  }}
                >
                  Test Configuration
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '10px',
                        display: 'block',
                        marginBottom: '3px',
                      }}
                    >
                      Caller ID
                    </label>
                    <input
                      type='text'
                      value={testCall.callerId}
                      onChange={(e) =>
                        setTestCall({ ...testCall, callerId: e.target.value })
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        color: 'white',
                        fontSize: '12px',
                        width: '100%',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '10px',
                        display: 'block',
                        marginBottom: '3px',
                      }}
                    >
                      Call Type
                    </label>
                    <select
                      value={testCall.callType}
                      onChange={(e) =>
                        setTestCall({ ...testCall, callType: e.target.value })
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        color: 'white',
                        fontSize: '12px',
                        width: '100%',
                      }}
                    >
                      <option value='sales'>Sales</option>
                      <option value='support'>Support</option>
                      <option value='complaint'>Complaint</option>
                      <option value='booking'>Booking</option>
                      <option value='emergency'>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '10px',
                        display: 'block',
                        marginBottom: '3px',
                      }}
                    >
                      Urgency
                    </label>
                    <select
                      value={testCall.urgency}
                      onChange={(e) =>
                        setTestCall({
                          ...testCall,
                          urgency: e.target.value as any,
                        })
                      }
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        padding: '6px 8px',
                        color: 'white',
                        fontSize: '12px',
                        width: '100%',
                      }}
                    >
                      <option value='low'>Low</option>
                      <option value='medium'>Medium</option>
                      <option value='high'>High</option>
                      <option value='critical'>Critical</option>
                    </select>
                  </div>

                  <button
                    onClick={testCallRouting}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '6px',
                    }}
                  >
                    🧪 Test Routing
                  </button>
                </div>
              </div>

              {/* Test Results */}
              <div>
                <h4
                  style={{
                    color: 'rgba(255, 255, 255, 0.98)',
                    fontSize: '14px',
                    marginBottom: '10px',
                  }}
                >
                  Results
                </h4>
                {testResult ? (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '10px',
                    }}
                  >
                    <div
                      style={{
                        background: `${getPriorityColor(testResult.priority)}20`,
                        border: `1px solid ${getPriorityColor(testResult.priority)}50`,
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: getPriorityColor(testResult.priority),
                        fontSize: '11px',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginBottom: '8px',
                      }}
                    >
                      {testResult.action.replace('_', ' ').toUpperCase()}
                    </div>

                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '11px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Target:</strong>{' '}
                      {testResult.targetAgentId ||
                        testResult.targetQueueId ||
                        'None'}
                    </div>

                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '11px',
                        marginBottom: '4px',
                      }}
                    >
                      <strong>Wait:</strong> {testResult.estimatedWaitTime}s
                    </div>

                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '10px',
                      }}
                    >
                      <strong>Reason:</strong> {testResult.reason}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      padding: '16px',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                    }}
                  >
                    Run a test to see results
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
