'use client';

import { useEffect, useState } from 'react';

interface EscortRequest {
  id: string;
  driverName: string;
  portCode: string;
  terminalId: string;
  appointmentTime: string;
  operationType: string;
  status: 'requested' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  escortName?: string;
  estimatedCost: number;
}

interface EscortAnalytics {
  totalRequests: number;
  completedRequests: number;
  averageRating: number;
  totalRevenue: number;
  activeEscorts: number;
  averageResponseTime: number;
}

export default function TWICEscortDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'requests' | 'escorts' | 'analytics'>('overview');
  const [escortRequests, setEscortRequests] = useState<EscortRequest[]>([]);
  const [analytics, setAnalytics] = useState<EscortAnalytics | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setEscortRequests([
      {
        id: 'escort_req_001',
        driverName: 'John Martinez',
        portCode: 'USLAX',
        terminalId: 'APM_T1',
        appointmentTime: '2024-01-15T14:00:00Z',
        operationType: 'pickup',
        status: 'assigned',
        escortName: 'Michael Rodriguez',
        estimatedCost: 150
      },
      {
        id: 'escort_req_002',
        driverName: 'Lisa Chen',
        portCode: 'USLGB',
        terminalId: 'LBCT_T2',
        appointmentTime: '2024-01-15T16:30:00Z',
        operationType: 'delivery',
        status: 'in_progress',
        escortName: 'Sarah Chen',
        estimatedCost: 180
      },
      {
        id: 'escort_req_003',
        driverName: 'Robert Kim',
        portCode: 'USNYK',
        terminalId: 'APM_NY',
        appointmentTime: '2024-01-16T09:00:00Z',
        operationType: 'pickup',
        status: 'requested',
        estimatedCost: 255
      }
    ]);

    setAnalytics({
      totalRequests: 247,
      completedRequests: 234,
      averageRating: 4.7,
      totalRevenue: 42850,
      activeEscorts: 12,
      averageResponseTime: 18
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'assigned': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🛡️ TWIC Escort Services
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '18px' }}>
          Professional escort services for drivers without TWIC cards at secure port facilities
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '32px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '16px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'requests', label: '📋 Requests', icon: '📋' },
          { id: 'escorts', label: '👥 Escorts', icon: '👥' },
          { id: 'analytics', label: '📈 Analytics', icon: '📈' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id 
                ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label.split(' ')[1]}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ fontSize: '14px', color: '#60a5fa', marginBottom: '8px' }}>
                Active Requests
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {escortRequests.filter(r => ['requested', 'assigned', 'in_progress'].includes(r.status)).length}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Pending completion
              </div>
            </div>

            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ fontSize: '14px', color: '#34d399', marginBottom: '8px' }}>
                Completion Rate
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {analytics ? Math.round((analytics.completedRequests / analytics.totalRequests) * 100) : 0}%
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                {analytics?.completedRequests} of {analytics?.totalRequests} requests
              </div>
            </div>

            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ fontSize: '14px', color: '#fbbf24', marginBottom: '8px' }}>
                Monthly Revenue
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {formatCurrency(analytics?.totalRevenue || 0)}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                From escort services
              </div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ fontSize: '14px', color: '#a78bfa', marginBottom: '8px' }}>
                Average Rating
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {analytics?.averageRating || 0}⭐
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Customer satisfaction
              </div>
            </div>
          </div>

          {/* Service Features */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: 'white'
            }}>
              🛡️ Service Features
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {[
                {
                  title: '24/7 Availability',
                  description: 'Round-the-clock escort services for all port facilities',
                  icon: '🕒',
                  features: ['Emergency escorts', 'Weekend service', 'Holiday coverage']
                },
                {
                  title: 'Multi-Port Coverage',
                  description: 'Certified escorts at all major US ports',
                  icon: '🏗️',
                  features: ['Los Angeles/Long Beach', 'New York/New Jersey', 'Savannah', 'Seattle']
                },
                {
                  title: 'Specialized Services',
                  description: 'Expert handling of special cargo types',
                  icon: '⚠️',
                  features: ['Hazmat certified', 'Oversized loads', 'Refrigerated cargo']
                },
                {
                  title: 'Real-Time Tracking',
                  description: 'Live updates and GPS tracking of escort services',
                  icon: '📍',
                  features: ['Live location', 'ETA updates', 'Status notifications']
                }
              ].map((feature, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>{feature.icon}</span>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                      {feature.title}
                    </h3>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '16px' }}>
                    {feature.description}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {feature.features.map((item, idx) => (
                      <li key={idx} style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        marginBottom: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <span style={{ color: '#34d399' }}>✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0
            }}>
              📋 Escort Requests
            </h2>
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>➕</span>
              New Request
            </button>
          </div>

          <div style={{ display: 'grid', gap: '16px' }}>
            {escortRequests.map((request) => (
              <div key={request.id} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                {/* Status Indicator */}
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: getStatusColor(request.status),
                  flexShrink: 0
                }} />

                {/* Request Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0 }}>
                      {request.driverName}
                    </h3>
                    <span style={{
                      background: `${getStatusColor(request.status)}20`,
                      color: getStatusColor(request.status),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {request.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '12px',
                    fontSize: '14px'
                  }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Port: </span>
                      <span style={{ color: 'white' }}>{request.portCode}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Terminal: </span>
                      <span style={{ color: 'white' }}>{request.terminalId}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Appointment: </span>
                      <span style={{ color: 'white' }}>{formatDateTime(request.appointmentTime)}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Type: </span>
                      <span style={{ color: 'white', textTransform: 'capitalize' }}>{request.operationType}</span>
                    </div>
                    {request.escortName && (
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Escort: </span>
                        <span style={{ color: 'white' }}>{request.escortName}</span>
                      </div>
                    )}
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Cost: </span>
                      <span style={{ color: 'white' }}>{formatCurrency(request.estimatedCost)}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  {request.status === 'requested' && (
                    <button style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Assign Escort
                    </button>
                  )}
                  {request.status === 'in_progress' && (
                    <button style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}>
                      Complete
                    </button>
                  )}
                  <button style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Escorts Tab */}
      {activeTab === 'escorts' && (
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white'
          }}>
            👥 Available Escorts
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {[
              {
                name: 'Michael Rodriguez',
                rating: 4.8,
                completedEscorts: 247,
                ports: ['USLAX', 'USLGB', 'USOAK'],
                status: 'available',
                hourlyRate: 75,
                specializations: ['Hazmat', 'Oversized'],
                languages: ['English', 'Spanish']
              },
              {
                name: 'Sarah Chen',
                rating: 4.9,
                completedEscorts: 189,
                ports: ['USLAX', 'USLGB'],
                status: 'busy',
                hourlyRate: 80,
                specializations: ['Container', 'Breakbulk'],
                languages: ['English', 'Mandarin']
              },
              {
                name: 'David Thompson',
                rating: 4.7,
                completedEscorts: 312,
                ports: ['USNYK', 'USBOS', 'USBAL'],
                status: 'available',
                hourlyRate: 85,
                specializations: ['Hazmat', 'Refrigerated'],
                languages: ['English']
              }
            ].map((escort, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: escort.status === 'available' ? '#10b981' : '#f59e0b'
                  }} />
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                    {escort.name}
                  </h3>
                  <span style={{ color: '#fbbf24' }}>
                    {escort.rating}⭐
                  </span>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                    <strong>{escort.completedEscorts}</strong> completed escorts
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                    <strong>{formatCurrency(escort.hourlyRate)}/hour</strong>
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                    Ports: <strong>{escort.ports.join(', ')}</strong>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                    Specializations:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {escort.specializations.map((spec, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60a5fa',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}>
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '8px' }}>
                    Languages:
                  </div>
                  <div style={{ fontSize: '14px', color: 'white' }}>
                    {escort.languages.join(', ')}
                  </div>
                </div>

                <button style={{
                  background: escort.status === 'available' 
                    ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' 
                    : 'rgba(107, 114, 128, 0.5)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: escort.status === 'available' ? 'pointer' : 'not-allowed',
                  width: '100%'
                }}>
                  {escort.status === 'available' ? 'Assign Escort' : 'Currently Busy'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: 'white'
          }}>
            📈 Service Analytics
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                📊 Request Volume
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
                {analytics.totalRequests}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Total requests this month
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                💰 Revenue Generated
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
                {formatCurrency(analytics.totalRevenue)}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Monthly escort service revenue
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                ⏱️ Response Time
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
                {analytics.averageResponseTime}min
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Average escort assignment time
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>
                👥 Active Escorts
              </h3>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '8px' }}>
                {analytics.activeEscorts}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Currently available escorts
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}