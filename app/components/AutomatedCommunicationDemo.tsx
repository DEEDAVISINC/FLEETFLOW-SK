'use client';

import { useState } from 'react';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  triggerType: string;
  context: any;
  expectedOutcome: 'automated' | 'human_required';
  reason: string;
}

export default function AutomatedCommunicationDemo() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(
    null
  );
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const demoScenarios: DemoScenario[] = [
    {
      id: 'routine_pickup',
      title: '✅ Routine Load Pickup',
      description: 'Normal load pickup, on time, no issues',
      triggerType: 'load_picked_up',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'ABC Logistics',
        driverName: 'John Rodriguez',
        eta: '2024-01-15 14:30',
        conditions: ['normal_pickup', 'on_time', 'no_issues'],
      },
      expectedOutcome: 'automated',
      reason: 'Routine status update - perfect for automated SMS',
    },
    {
      id: 'major_delay',
      title: '🚨 Major Load Delay (6 hours)',
      description: 'Load delayed 6 hours due to breakdown',
      triggerType: 'delay_major',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'ABC Logistics',
        delayHours: 6,
        delayReason: 'Vehicle breakdown',
        conditions: ['delay > 4 hours'],
      },
      expectedOutcome: 'human_required',
      reason:
        'Major delay requires human explanation and relationship management',
    },
    {
      id: 'vip_customer',
      title: '👑 VIP Customer Communication',
      description: 'High-value customer with minor delay',
      triggerType: 'delay_minor',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'Platinum Corp',
        customerTier: 'platinum',
        annualVolume: 750000,
        delayHours: 1,
        conditions: ['delay < 2 hours', 'vip_customer'],
      },
      expectedOutcome: 'human_required',
      reason: 'VIP customer deserves personal attention even for minor issues',
    },
    {
      id: 'emergency_situation',
      title: '🚨 Emergency: Driver Accident',
      description: 'Driver involved in traffic accident',
      triggerType: 'load_emergency',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'ABC Logistics',
        emergencyType: 'accident',
        conditions: ['accident'],
      },
      expectedOutcome: 'human_required',
      reason: 'Emergency situations require immediate human intervention',
    },
    {
      id: 'delivery_confirmation',
      title: '✅ Successful Delivery',
      description: 'Load delivered on time, no damage',
      triggerType: 'load_delivered',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'ABC Logistics',
        deliveryTime: '2024-01-15 14:30',
        conditions: ['successful_delivery', 'on_time', 'no_damage'],
      },
      expectedOutcome: 'automated',
      reason:
        'Successful delivery confirmation - ideal for automated SMS with rating link',
    },
    {
      id: 'customer_complaint',
      title: '😠 Customer Complaint',
      description: 'Customer replied to SMS with complaint',
      triggerType: 'customer_negative_response',
      context: {
        loadId: 'FL-25001-ATLMIA-ABC-DVFL-001',
        customerName: 'ABC Logistics',
        complaintType: 'service_quality',
        conditions: ['complaint_keywords', 'sms_reply_angry'],
      },
      expectedOutcome: 'human_required',
      reason: 'Customer dissatisfaction requires human relationship management',
    },
  ];

  const testScenario = async (scenario: DemoScenario) => {
    setLoading(true);
    setTestResult(null);

    try {
      // Test the escalation detection
      const response = await fetch(
        `/api/dispatch/auto-communicate?loadId=${scenario.context.loadId}&triggerType=${scenario.triggerType}`
      );
      const result = await response.json();

      setTestResult({
        scenario: scenario.title,
        expected: scenario.expectedOutcome,
        actual: result.analysis.requiresHuman ? 'human_required' : 'automated',
        correct:
          (result.analysis.requiresHuman &&
            scenario.expectedOutcome === 'human_required') ||
          (!result.analysis.requiresHuman &&
            scenario.expectedOutcome === 'automated'),
        analysis: result.analysis,
        recommendation: result.recommendation,
      });
    } catch (error) {
      console.error('Test failed:', error);
      setTestResult({
        error: 'Test failed to execute',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '24px', marginBottom: '16px' }}>
          🤖 Automated Communication System Demo
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
          Test different scenarios to see when the system automatically
          escalates to human representatives
        </p>
      </div>

      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}
      >
        {/* Scenario Selection */}
        <div>
          <h2
            style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}
          >
            📋 Test Scenarios
          </h2>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {demoScenarios.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
                style={{
                  background:
                    selectedScenario?.id === scenario.id
                      ? 'rgba(59, 130, 246, 0.2)'
                      : 'rgba(255, 255, 255, 0.1)',
                  border:
                    selectedScenario?.id === scenario.id
                      ? '2px solid #3b82f6'
                      : '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (selectedScenario?.id !== scenario.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedScenario?.id !== scenario.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '8px',
                  }}
                >
                  {scenario.title}
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                    marginBottom: '8px',
                  }}
                >
                  {scenario.description}
                </div>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background:
                      scenario.expectedOutcome === 'automated'
                        ? 'rgba(34, 197, 94, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    color:
                      scenario.expectedOutcome === 'automated'
                        ? '#22c55e'
                        : '#ef4444',
                  }}
                >
                  Expected:{' '}
                  {scenario.expectedOutcome === 'automated'
                    ? '🤖 Automated'
                    : '👤 Human Required'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        <div>
          <h2
            style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}
          >
            🧪 Test Results
          </h2>

          {selectedScenario && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  marginBottom: '12px',
                }}
              >
                Selected: {selectedScenario.title}
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '16px',
                }}
              >
                {selectedScenario.reason}
              </p>

              <button
                onClick={() => testScenario(selectedScenario)}
                disabled={loading}
                style={{
                  background: loading
                    ? 'rgba(107, 114, 128, 0.5)'
                    : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? '⏳ Testing...' : '🧪 Test Scenario'}
              </button>
            </div>
          )}

          {testResult && (
            <div
              style={{
                background: testResult.correct
                  ? 'rgba(34, 197, 94, 0.1)'
                  : testResult.error
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(245, 158, 11, 0.1)',
                border: testResult.correct
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : testResult.error
                    ? '1px solid rgba(239, 68, 68, 0.3)'
                    : '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              {testResult.error ? (
                <div>
                  <h3
                    style={{
                      color: '#ef4444',
                      fontSize: '18px',
                      marginBottom: '12px',
                    }}
                  >
                    ❌ Test Error
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                    {testResult.error}
                  </p>
                </div>
              ) : (
                <div>
                  <h3
                    style={{
                      color: testResult.correct ? '#22c55e' : '#f59e0b',
                      fontSize: '18px',
                      marginBottom: '12px',
                    }}
                  >
                    {testResult.correct
                      ? '✅ Test Passed'
                      : '⚠️ Unexpected Result'}
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>Expected:</strong>{' '}
                      {testResult.expected === 'automated'
                        ? '🤖 Automated'
                        : '👤 Human Required'}
                    </div>
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        marginBottom: '8px',
                      }}
                    >
                      <strong>Actual:</strong>{' '}
                      {testResult.actual === 'automated'
                        ? '🤖 Automated'
                        : '👤 Human Required'}
                    </div>
                  </div>

                  {testResult.analysis && (
                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '16px',
                        marginTop: '16px',
                      }}
                    >
                      <h4
                        style={{
                          color: 'white',
                          fontSize: '16px',
                          marginBottom: '12px',
                        }}
                      >
                        🔍 Analysis Details
                      </h4>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontSize: '14px',
                        }}
                      >
                        <div>
                          <strong>Reason:</strong> {testResult.analysis.reason}
                        </div>
                        <div>
                          <strong>Urgency:</strong>{' '}
                          {testResult.analysis.urgency}
                        </div>
                        <div>
                          <strong>Assign To:</strong>{' '}
                          {testResult.analysis.assignTo}
                        </div>
                        <div>
                          <strong>Suggested Action:</strong>{' '}
                          {testResult.analysis.suggestedAction}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!selectedScenario && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center' as const,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '16px' }}
              >
                Select a scenario to test the automated communication system
              </p>
            </div>
          )}
        </div>
      </div>

      {/* System Rules Summary */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ color: 'white', fontSize: '20px', marginBottom: '20px' }}>
          📋 Human Escalation Rules Summary
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {[
            {
              title: '🚨 Critical Situations',
              items: [
                'Accidents & Emergencies',
                'Major Breakdowns',
                'Hazmat Incidents',
                'Theft/Security Issues',
              ],
              color: '#ef4444',
            },
            {
              title: '⏰ Major Delays',
              items: [
                'Delays > 4 hours',
                'Missed delivery windows',
                'Critical shipments',
                'Customer complaints',
              ],
              color: '#f97316',
            },
            {
              title: '👑 VIP Customers',
              items: [
                'Platinum tier customers',
                'Annual volume > $500K',
                'Strategic accounts',
                'New customers',
              ],
              color: '#8b5cf6',
            },
            {
              title: '💰 Financial Issues',
              items: [
                'Billing disputes',
                'Rate negotiations',
                'Payment overdue > 30 days',
                'Contract changes',
              ],
              color: '#06b6d4',
            },
          ].map((category, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${category.color}40`,
              }}
            >
              <h3
                style={{
                  color: category.color,
                  fontSize: '16px',
                  marginBottom: '12px',
                }}
              >
                {category.title}
              </h3>
              <ul
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  paddingLeft: '20px',
                }}
              >
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: '4px' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
