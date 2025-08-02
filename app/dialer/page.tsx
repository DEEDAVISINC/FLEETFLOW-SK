'use client';

import { useEffect, useState } from 'react';
import SimplePhoneDialer from '../components/SimplePhoneDialer';

interface CallStats {
  todaysCalls: number;
  connectedCalls: number;
  averageDuration: string;
  totalMinutes: number;
}

interface RecentCall {
  id: string;
  number: string;
  name?: string;
  duration: string;
  timestamp: string;
  status: 'completed' | 'missed' | 'busy';
}

export default function DialerPage() {
  const [callStats, setCallStats] = useState<CallStats>({
    todaysCalls: 23,
    connectedCalls: 18,
    averageDuration: '3:45',
    totalMinutes: 127,
  });

  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([
    {
      id: '1',
      number: '+15551234567',
      name: 'John Smith - ABC Trucking',
      duration: '4:32',
      timestamp: '2 mins ago',
      status: 'completed',
    },
    {
      id: '2',
      number: '+15559876543',
      name: 'Sarah Johnson - XYZ Logistics',
      duration: '2:15',
      timestamp: '15 mins ago',
      status: 'completed',
    },
    {
      id: '3',
      number: '+15555555555',
      name: 'Mike Davis - Fleet Driver',
      duration: '0:00',
      timestamp: '1 hour ago',
      status: 'missed',
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Enhanced Header - Driver OTR Flow Style */}
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                <span style={{ fontSize: '32px' }}>📞</span>
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
                  FleetFlow Phone Dialer
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <span>🟢 Twilio Connected</span>
                  <span>•</span>
                  <span>📊 {callStats.todaysCalls} calls today</span>
                  <span>•</span>
                  <span>⏰ {currentTime.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#22c55e',
                }}
              >
                ✅ Ready to Call
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Call Statistics */}
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
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Today's Stats
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Calls
                </span>
                <span
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {callStats.todaysCalls}
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Connected
                </span>
                <span
                  style={{
                    color: '#22c55e',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {callStats.connectedCalls}
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Duration
                </span>
                <span
                  style={{
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {callStats.averageDuration}
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Total Minutes
                </span>
                <span
                  style={{
                    color: '#3b82f6',
                    fontWeight: '600',
                    fontSize: '16px',
                  }}
                >
                  {callStats.totalMinutes}
                </span>
              </div>
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
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              ⚡ Quick Actions
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <button
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#22c55e',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
                }}
              >
                📞 Emergency Dispatch
              </button>
              <button
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#3b82f6',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                👥 Contact Manager
              </button>
              <button
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#f59e0b',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(245, 158, 11, 0.2)';
                }}
              >
                📋 Call History
              </button>
            </div>
          </div>

          {/* System Status */}
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
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🔧 System Status
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Twilio Status
                </span>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  🟢 Connected
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Call Quality
                </span>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  HD Audio
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Recording
                </span>
                <span
                  style={{
                    background: 'rgba(34, 197, 94, 0.2)',
                    color: '#22c55e',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  ✅ Active
                </span>
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
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Cost Today
                </span>
                <span
                  style={{
                    color: '#3b82f6',
                    fontWeight: '600',
                    fontSize: '14px',
                  }}
                >
                  $2.47
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dialer Section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '24px',
          }}
        >
          {/* Phone Dialer */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <SimplePhoneDialer />
          </div>

          {/* Recent Calls */}
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
                fontSize: '18px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📞 Recent Calls
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {recentCalls.map((call) => (
                <div
                  key={call.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '4px',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '2px',
                        }}
                      >
                        {call.name || call.number}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {call.number}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color:
                          call.status === 'completed'
                            ? '#22c55e'
                            : call.status === 'missed'
                              ? '#ef4444'
                              : '#f59e0b',
                        fontWeight: '600',
                      }}
                    >
                      {call.status === 'completed' && '✅'}
                      {call.status === 'missed' && '❌'}
                      {call.status === 'busy' && '⏰'}
                      {call.duration}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {call.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
