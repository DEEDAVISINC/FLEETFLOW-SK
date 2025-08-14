'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import GoWithFlowAutomationService from '../services/GoWithFlowAutomationService';

interface GoWithFlowPanelProps {
  onLoadAccepted?: (loadId: string, driverId: string) => void;
}

export default function GoWithFlowPanel({
  onLoadAccepted,
}: GoWithFlowPanelProps) {
  const [automationService] = useState(() =>
    GoWithFlowAutomationService.getInstance()
  );
  const [automatedActivities, setAutomatedActivities] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    autoMatchSuccessRate: 94,
    avgResponseTime: 2.3,
    activeBOLWorkflows: 12,
    systemUptime: 99.8,
    totalAutomatedLoads: 847,
    activeDrivers: 24,
  });

  // Mock nearby drivers data
  const nearbyDrivers = [
    {
      id: 'drv-001',
      name: 'John Rodriguez',
      location: 'Dallas, TX',
      distance: '12 mi',
      status: 'Available',
      equipment: 'Dry Van',
    },
    {
      id: 'drv-002',
      name: 'Maria Santos',
      location: 'Houston, TX',
      distance: '45 mi',
      status: 'Available',
      equipment: 'Refrigerated',
    },
    {
      id: 'drv-003',
      name: 'David Thompson',
      location: 'Austin, TX',
      distance: '78 mi',
      status: 'Available',
      equipment: 'Flatbed',
    },
    {
      id: 'drv-004',
      name: 'Lisa Chen',
      location: 'San Antonio, TX',
      distance: '95 mi',
      status: 'Available',
      equipment: 'Dry Van',
    },
  ];

  // Mock urgent loads
  const urgentLoads = [
    {
      id: 'FL-2401',
      route: 'Dallas → Phoenix',
      rate: '$2,800',
      pickup: '2 hrs',
      priority: 'CRITICAL',
    },
    {
      id: 'FL-2402',
      route: 'Houston → Denver',
      rate: '$3,200',
      pickup: '4 hrs',
      priority: 'HIGH',
    },
    {
      id: 'FL-2403',
      route: 'Austin → Seattle',
      rate: '$4,500',
      pickup: '6 hrs',
      priority: 'HIGH',
    },
  ];

  useEffect(() => {
    // Initialize automation service
    setAutomatedActivities(automationService.getActivities());
    setSystemStatus(automationService.getSystemStatus());

    // Set up real-time activity updates
    const activityInterval = setInterval(() => {
      setAutomatedActivities(automationService.getActivities());
      setSystemStatus(automationService.getSystemStatus());
    }, 2000);

    return () => clearInterval(activityInterval);
  }, [automationService]);

  const handleInstantMatch = async (loadId: string) => {
    console.log('🚀 Triggering instant match for', loadId);
    await automationService.simulateInstantMatch(loadId, nearbyDrivers);
  };

  const handleAutoMatch = async () => {
    console.log('🤖 Triggering auto-match system');
    await automationService.simulateAutoMatch();
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '22px',
            fontWeight: '600',
            margin: 0,
          }}
        >
          ⚡ Go With the Flow - Automated Load Matching
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onClick={handleAutoMatch}
          >
            🚛 Trigger Auto-Match Demo
          </button>
          <Link
            href='/admin/driver-otr-flow'
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🚛 Driver OTR Flow
            </button>
          </Link>
        </div>
      </div>

      {/* Automated System Status */}
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '2px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(34, 197, 94, 0.8)',
          }}
        >
          🤖 Automated System Status
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', color: '#22c55e', fontWeight: 'bold' }}
            >
              {systemStatus.autoMatchSuccessRate}%
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              Auto-Match Success Rate
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', color: '#22c55e', fontWeight: 'bold' }}
            >
              {systemStatus.avgResponseTime}min
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              Avg Driver Response Time
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', color: '#22c55e', fontWeight: 'bold' }}
            >
              {systemStatus.activeBOLWorkflows}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              Active BOL Workflows
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div
              style={{ fontSize: '24px', color: '#22c55e', fontWeight: 'bold' }}
            >
              {systemStatus.activeDrivers}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
              Online Drivers
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Matching Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Online Drivers Panel */}
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.2)',
            border: '2px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
          }}
        >
          <h3
            style={{
              color: '#ffffff',
              margin: '0 0 16px 0',
              fontSize: '1.2rem',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(16, 185, 129, 0.8)',
            }}
          >
            🟢 Online Drivers ({nearbyDrivers.length})
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {nearbyDrivers.map((driver, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div>
                  <div
                    style={{
                      color: '#ffffff',
                      fontWeight: '700',
                      fontSize: '15px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    {driver.name}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}
                  >
                    {driver.location} • {driver.distance} • {driver.equipment}
                  </div>
                </div>
                <div
                  style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {driver.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgent Loads Panel */}
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.2)',
            border: '2px solid rgba(239, 68, 68, 0.6)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
          }}
        >
          <h3
            style={{
              color: '#ffffff',
              margin: '0 0 16px 0',
              fontSize: '1.2rem',
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(239, 68, 68, 0.8)',
            }}
          >
            🚨 Urgent Loads ({urgentLoads.length})
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {urgentLoads.map((load, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '8px',
                  border:
                    load.priority === 'CRITICAL'
                      ? '2px solid #ef4444'
                      : '1px solid rgba(255, 255, 255, 0.2)',
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
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '14px',
                    }}
                  >
                    {load.id}
                  </div>
                  <div
                    style={{
                      background:
                        load.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}
                  >
                    {load.priority}
                  </div>
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    marginBottom: '4px',
                  }}
                >
                  {load.route}
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#10b981',
                      fontWeight: '600',
                      fontSize: '13px',
                    }}
                  >
                    {load.rate}
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '11px',
                    }}
                  >
                    Pickup in {load.pickup}
                  </span>
                </div>
                <button
                  style={{
                    width: '100%',
                    marginTop: '8px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleInstantMatch(load.id)}
                >
                  ⚡ Instant Match (Auto-starts BOL)
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portal Access Section */}
      <div
        style={{
          background: 'rgba(245, 158, 11, 0.2)',
          border: '2px solid rgba(245, 158, 11, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>
          🚛 Driver Portal Quick Access
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
          }}
        >
          <Link
            href='/admin/driver-otr-flow'
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              🚛 Driver OTR Flow Portal
            </button>
          </Link>

          <Link
            href='/drivers/enhanced-portal'
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              👥 Driver Management
            </button>
          </Link>

          <Link href='/tracking' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              📍 Live Load Tracking
            </button>
          </Link>
        </div>
      </div>

      {/* Real-Time Automated Activity Feed */}
      <div
        style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '2px solid rgba(34, 197, 94, 0.5)',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
        }}
      >
        <h3
          style={{
            color: '#ffffff',
            margin: '0 0 16px 0',
            fontSize: '1.2rem',
            fontWeight: '700',
            textShadow: '0 2px 4px rgba(34, 197, 94, 0.8)',
          }}
        >
          📈 Real-Time Automated Activity Feed
        </h3>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {automatedActivities.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.7)',
                padding: '20px',
                fontSize: '14px',
              }}
            >
              🤖 Automated activities will appear here...
            </div>
          ) : (
            automatedActivities.map((activity, index) => (
              <div
                key={activity.id || index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom:
                    index < automatedActivities.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background:
                      activity.type === 'success'
                        ? '#22c55e'
                        : activity.type === 'error'
                          ? '#ef4444'
                          : activity.type === 'warning'
                            ? '#f59e0b'
                            : '#3b82f6',
                    marginRight: '12px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                    }}
                  >
                    {activity.time}
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {activity.action}
                    {activity.automated && (
                      <span
                        style={{
                          background: 'rgba(34, 197, 94, 0.3)',
                          color: '#22c55e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                        }}
                      >
                        AUTO
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

