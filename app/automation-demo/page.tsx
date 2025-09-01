'use client';

import { useState } from 'react';
import AutomatedCommunicationControls from '../components/AutomatedCommunicationControls';
import AutomatedCommunicationDemo from '../components/AutomatedCommunicationDemo';
import {
  handleCustomerInquiry,
  handleDriverEvent,
  updateLoad,
} from '../services/loadService';

export default function AutomationDemoPage() {
  const [activeDemo, setActiveDemo] = useState<
    'scenarios' | 'live_testing' | 'integration_guide'
  >('scenarios');
  const [liveTestResults, setLiveTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setLiveTestResults((prev) => [
      `${new Date().toLocaleTimeString()}: ${result}`,
      ...prev.slice(0, 9), // Keep only last 10 results
    ]);
  };

  const testLoadStatusChange = async () => {
    try {
      addTestResult('🚛 Testing load status change: Available → In Transit');

      const result = updateLoad('FL-2025-001', { status: 'In Transit' });

      if (result) {
        addTestResult(
          '✅ Load status updated - automated communication triggered'
        );
      } else {
        addTestResult('❌ Failed to update load status');
      }
    } catch (error) {
      addTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const testEmergencyScenario = async () => {
    try {
      addTestResult('🚨 Testing emergency scenario: Driver accident');

      await handleDriverEvent('FL-2025-001', 'accident', {
        driverName: 'John Rodriguez',
        driverPhone: '+1555987654',
        currentLocation: 'I-75 Mile 234, GA',
        description: 'Minor traffic accident - driver safe, vehicle damaged',
      });

      addTestResult(
        '✅ Emergency scenario processed - should escalate to human immediately'
      );
    } catch (error) {
      addTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const testVIPCustomer = async () => {
    try {
      addTestResult('👑 Testing VIP customer complaint');

      await handleCustomerInquiry('VIP-CUSTOMER-001', 'complaint', {
        customerName: 'Platinum Corp',
        customerCompany: 'Platinum Corp Inc.',
        customerPhone: '+1555999888',
        loadId: 'FL-2025-001',
        hasIssues: true,
        description: 'Unhappy with delivery timing',
      });

      addTestResult(
        '✅ VIP customer complaint processed - should escalate to human'
      );
    } catch (error) {
      addTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #1d4ed8)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              color: 'white',
              fontSize: '32px',
              fontWeight: '800',
              marginBottom: '16px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            🤖 FleetFlow Automated Communication System
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '18px',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            Intelligent communication automation with smart human escalation
            detection
          </p>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '40px',
            gap: '16px',
          }}
        >
          {[
            { id: 'scenarios', label: '🧪 Test Scenarios', icon: '🧪' },
            { id: 'live_testing', label: '⚡ Live Testing', icon: '⚡' },
            {
              id: 'integration_guide',
              label: '📚 Integration Guide',
              icon: '📚',
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDemo(tab.id as any)}
              style={{
                background:
                  activeDemo === tab.id
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                border:
                  activeDemo === tab.id
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 24px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                if (activeDemo !== tab.id) {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeDemo !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeDemo === 'scenarios' && <AutomatedCommunicationDemo />}

        {activeDemo === 'live_testing' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Live Testing Controls */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}
              >
                ⚡ Live System Testing
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <button
                  onClick={testLoadStatusChange}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(34, 197, 94, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🚛 Test Load Status Change
                </button>

                <button
                  onClick={testEmergencyScenario}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🚨 Test Emergency Scenario
                </button>

                <button
                  onClick={testVIPCustomer}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(139, 92, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  👑 Test VIP Customer
                </button>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                }}
              >
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  💡 <strong>Note:</strong> These tests trigger real
                  communication decisions. Check the browser console and test
                  results panel to see if the system chooses automated SMS or
                  human escalation.
                </p>
              </div>
            </div>

            {/* Live Test Results */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '24px',
                  marginBottom: '20px',
                }}
              >
                📊 Live Test Results
              </h2>

              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  height: '400px',
                  overflowY: 'auto',
                  fontFamily: 'monospace',
                }}
              >
                {liveTestResults.length === 0 ? (
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textAlign: 'center',
                      paddingTop: '50px',
                    }}
                  >
                    Click a test button to see live results...
                  </div>
                ) : (
                  liveTestResults.map((result, index) => (
                    <div
                      key={index}
                      style={{
                        color: result.includes('✅')
                          ? '#22c55e'
                          : result.includes('❌')
                            ? '#ef4444'
                            : result.includes('🚛') ||
                                result.includes('🚨') ||
                                result.includes('👑')
                              ? '#f59e0b'
                              : 'rgba(255, 255, 255, 0.8)',
                        fontSize: '13px',
                        marginBottom: '8px',
                        padding: '4px 0',
                        borderBottom:
                          index < liveTestResults.length - 1
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      {result}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'integration_guide' && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '32px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '28px',
                  marginBottom: '24px',
                }}
              >
                📚 Integration Guide
              </h2>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                }}
              >
                {/* Already Integrated */}
                <div
                  style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      color: '#22c55e',
                      fontSize: '20px',
                      marginBottom: '16px',
                    }}
                  >
                    ✅ Already Integrated
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      paddingLeft: '20px',
                    }}
                  >
                    <li>
                      <strong>Load Service:</strong> Automatic communication on
                      status changes
                    </li>
                    <li>
                      <strong>Driver Events:</strong> Breakdown, accident, delay
                      handling
                    </li>
                    <li>
                      <strong>Customer Inquiries:</strong> Smart escalation
                      routing
                    </li>
                    <li>
                      <strong>API Endpoints:</strong>{' '}
                      /api/dispatch/auto-communicate
                    </li>
                    <li>
                      <strong>Demo Systems:</strong> Testing and validation
                      tools
                    </li>
                  </ul>
                </div>

                {/* Usage Examples */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '20px',
                      marginBottom: '16px',
                    }}
                  >
                    💻 Usage Examples
                  </h3>
                  <div
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: '8px',
                      padding: '16px',
                      fontFamily: 'monospace',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      overflowX: 'auto',
                    }}
                  >
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ color: '#22c55e' }}>
                        // Load status change (automatic)
                      </div>
                      <div>
                        updateLoad('FL-001', {{ status: 'In Transit' }})
                      </div>
                    </div>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ color: '#22c55e' }}>
                        // Driver emergency
                      </div>
                      <div>handleDriverEvent('FL-001', 'accident', data)</div>
                    </div>
                    <div>
                      <div style={{ color: '#22c55e' }}>
                        // Customer inquiry
                      </div>
                      <div>
                        handleCustomerInquiry('CUST-001', 'complaint', data)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <h3
                    style={{
                      color: '#f59e0b',
                      fontSize: '20px',
                      marginBottom: '16px',
                    }}
                  >
                    🚀 Production Deployment
                  </h3>
                  <ul
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      paddingLeft: '20px',
                    }}
                  >
                    <li>Configure Twilio production credentials</li>
                    <li>Set up customer phone number database</li>
                    <li>Configure VIP customer tier detection</li>
                    <li>Test emergency escalation chains</li>
                    <li>Validate SMS/voice automation workflows</li>
                    <li>Monitor communication success rates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Test Controls (only show on live testing) */}
        {activeDemo === 'live_testing' && (
          <AutomatedCommunicationControls
            loadId='FL-2025-001'
            customerId='ABC-204-070'
          />
        )}
      </div>
    </div>
  );
}
