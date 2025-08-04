'use client';

import { useState, useEffect } from 'react';

interface PortAppointment {
  id: string;
  portCode: string;
  portName: string;
  terminalId: string;
  appointmentTime: string;
  operationType: 'pickup' | 'delivery' | 'empty_return';
  status: 'requested' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  containerNumber?: string;
  estimatedDuration: number;
  gateNumber?: string;
  requiresTWIC?: boolean;
  escortAssigned?: boolean;
}

interface TWICEscortRequest {
  id: string;
  portCode: string;
  portName: string;
  driverName: string;
  driverLicense: string;
  requestedTime: string;
  duration: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  escortId?: string;
  escortName?: string;
  cost: number;
}

interface PortAccessStats {
  totalAppointments: number;
  activeAppointments: number;
  completedToday: number;
  averageWaitTime: number;
  twicEscortRequests: number;
  activeEscorts: number;
}

export default function PortAuthorityAccessWidget() {
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'book' | 'twic'>('overview');
  const [appointments, setAppointments] = useState<PortAppointment[]>([]);
  const [twicRequests, setTwicRequests] = useState<TWICEscortRequest[]>([]);
  const [stats, setStats] = useState<PortAccessStats>({
    totalAppointments: 0,
    activeAppointments: 0,
    completedToday: 0,
    averageWaitTime: 0,
    twicEscortRequests: 0,
    activeEscorts: 0
  });
  const [loading, setLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    setAppointments([
      {
        id: 'APT-001',
        portCode: 'USLAX',
        portName: 'Port of Los Angeles',
        terminalId: 'APM_T1',
        appointmentTime: '2024-01-15T14:00:00Z',
        operationType: 'pickup',
        status: 'confirmed',
        containerNumber: 'MSKU1234567',
        estimatedDuration: 120,
        gateNumber: 'Gate 3',
        requiresTWIC: true,
        escortAssigned: true
      },
      {
        id: 'APT-002',
        portCode: 'USLGB',
        portName: 'Port of Long Beach',
        terminalId: 'LBCT_T2',
        appointmentTime: '2024-01-15T16:30:00Z',
        operationType: 'delivery',
        status: 'in_progress',
        containerNumber: 'TCLU9876543',
        estimatedDuration: 90,
        requiresTWIC: false
      },
      {
        id: 'APT-003',
        portCode: 'USNYK',
        portName: 'Port of NY/NJ',
        terminalId: 'APM_NY',
        appointmentTime: '2024-01-16T09:00:00Z',
        operationType: 'pickup',
        status: 'requested',
        estimatedDuration: 150,
        requiresTWIC: true,
        escortAssigned: false
      }
    ]);

    setTwicRequests([
      {
        id: 'ESC-001',
        portCode: 'USLAX',
        portName: 'Port of Los Angeles',
        driverName: 'John Rodriguez',
        driverLicense: 'CDL-CA-123456',
        requestedTime: '2024-01-15T13:30:00Z',
        duration: 180,
        status: 'assigned',
        escortId: 'TWIC-001',
        escortName: 'Mike Thompson',
        cost: 125
      },
      {
        id: 'ESC-002',
        portCode: 'USNYK',
        portName: 'Port of NY/NJ',
        driverName: 'Maria Santos',
        driverLicense: 'CDL-NY-789012',
        requestedTime: '2024-01-16T08:30:00Z',
        duration: 120,
        status: 'pending',
        cost: 100
      }
    ]);

    setStats({
      totalAppointments: 3,
      activeAppointments: 2,
      completedToday: 5,
      averageWaitTime: 25,
      twicEscortRequests: 2,
      activeEscorts: 1
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'confirmed': case 'assigned': return '#3b82f6';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const bookAppointment = async (appointmentData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/port-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'book_appointment',
          portCode: appointmentData.portCode,
          appointmentData: {
            terminalId: appointmentData.terminalId,
            driverLicense: appointmentData.driverLicense,
            twicCard: appointmentData.twicCard,
            appointmentTime: appointmentData.appointmentTime,
            operationType: appointmentData.operationType,
            containerNumber: appointmentData.containerNumber,
            chassisNumber: appointmentData.chassisNumber,
            hazmat: appointmentData.hazmat || false
          }
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const newAppointment: PortAppointment = {
          id: result.data.appointmentId,
          portCode: appointmentData.portCode,
          portName: getPortName(appointmentData.portCode),
          terminalId: appointmentData.terminalId,
          appointmentTime: appointmentData.appointmentTime,
          operationType: appointmentData.operationType,
          status: 'confirmed',
          containerNumber: appointmentData.containerNumber,
          estimatedDuration: 120,
          gateNumber: result.data.gateInfo?.gateNumber,
          requiresTWIC: result.data.requiresTWIC || false
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        setActiveTab('appointments');
        alert('Appointment booked successfully!');
      } else {
        alert(`Failed to book appointment: ${result.error}`);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestTWICEscort = async (escortData: any) => {
    setLoading(true);
    try {
      const response = await fetch('/api/twic-escort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'request_escort',
          ...escortData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const newRequest: TWICEscortRequest = {
          id: result.data.requestId,
          portCode: escortData.portCode,
          portName: getPortName(escortData.portCode),
          driverName: escortData.driverName,
          driverLicense: escortData.driverLicense,
          requestedTime: escortData.requestedTime,
          duration: escortData.duration,
          status: 'pending',
          cost: result.data.estimatedCost
        };
        
        setTwicRequests(prev => [...prev, newRequest]);
        alert('TWIC escort requested successfully!');
      } else {
        alert(`Failed to request escort: ${result.error}`);
      }
    } catch (error) {
      console.error('Error requesting escort:', error);
      alert('Failed to request escort. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPortName = (portCode: string) => {
    const portNames: { [key: string]: string } = {
      'USLAX': 'Port of Los Angeles',
      'USLGB': 'Port of Long Beach',
      'USNYK': 'Port of NY/NJ',
      'USSAV': 'Port of Savannah',
      'USSEA': 'Port of Seattle',
      'USMIA': 'Port of Miami',
      'USHOU': 'Port of Houston',
      'USOAK': 'Port of Oakland'
    };
    return portNames[portCode] || portCode;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🏗️ Port Authority Access & TWIC Escort
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>
          Manage port appointments, TWIC escort services, and secure facility access
        </p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '12px'
      }}>
        {[
          { id: 'overview', label: '📊 Overview', icon: '📊' },
          { id: 'appointments', label: '📅 Appointments', icon: '📅' },
          { id: 'book', label: '➕ Book New', icon: '➕' },
          { id: 'twic', label: '🛡️ TWIC Escort', icon: '🛡️' }
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
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ marginRight: '4px' }}>{tab.icon}</span>
            {tab.label.split(' ')[1] || tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#60a5fa' }}>
                {stats.totalAppointments}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Port Appointments
              </div>
            </div>
            <div style={{
              background: 'rgba(245, 158, 11, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fbbf24' }}>
                {stats.activeAppointments}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Active
              </div>
            </div>
            <div style={{
              background: 'rgba(139, 92, 246, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#a78bfa' }}>
                {stats.twicEscortRequests}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                TWIC Escorts
              </div>
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.2)',
              padding: '16px',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399' }}>
                {stats.averageWaitTime}min
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}>
                Avg Wait Time
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setActiveTab('book')}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📅 Book Appointment
              </button>
              <button
                onClick={() => setActiveTab('twic')}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🛡️ Request TWIC Escort
              </button>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                📋 Check Status
              </button>
              <button
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                🚛 Track Container
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '12px', color: 'white' }}>
              Recent Activity
            </h3>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '12px'
              }}>
                <span style={{ color: '#34d399' }}>✅</span>
                <span style={{ color: 'white', marginLeft: '8px' }}>
                  Appointment APT-001 completed at Port of Los Angeles
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', float: 'right' }}>2 hours ago</span>
              </div>
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                fontSize: '12px'
              }}>
                <span style={{ color: '#60a5fa' }}>🛡️</span>
                <span style={{ color: 'white', marginLeft: '8px' }}>
                  TWIC escort assigned for Port of NY/NJ visit
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', float: 'right' }}>4 hours ago</span>
              </div>
              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '12px'
              }}>
                <span style={{ color: '#fbbf24' }}>📅</span>
                <span style={{ color: 'white', marginLeft: '8px' }}>
                  New appointment booked for Port of Long Beach
                </span>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', float: 'right' }}>6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              Port Appointments
            </h3>
            <button
              onClick={() => setActiveTab('book')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              ➕ Book New
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {appointments.map((appointment) => (
              <div key={appointment.id} style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getStatusColor(appointment.status)
                  }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: 'white' }}>
                    {appointment.portName}
                  </h4>
                  <span style={{
                    background: `${getStatusColor(appointment.status)}20`,
                    color: getStatusColor(appointment.status),
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {appointment.status.replace('_', ' ')}
                  </span>
                  {appointment.requiresTWIC && (
                    <span style={{
                      background: appointment.escortAssigned ? 'rgba(139, 92, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: appointment.escortAssigned ? '#a78bfa' : '#fbbf24',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      🛡️ {appointment.escortAssigned ? 'Escort Assigned' : 'TWIC Required'}
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Time: </span>
                    <span style={{ color: 'white' }}>{formatDateTime(appointment.appointmentTime)}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Terminal: </span>
                    <span style={{ color: 'white' }}>{appointment.terminalId}</span>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Type: </span>
                    <span style={{ color: 'white', textTransform: 'capitalize' }}>{appointment.operationType}</span>
                  </div>
                  {appointment.containerNumber && (
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Container: </span>
                      <span style={{ color: 'white' }}>{appointment.containerNumber}</span>
                    </div>
                  )}
                  {appointment.gateNumber && (
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Gate: </span>
                      <span style={{ color: 'white' }}>{appointment.gateNumber}</span>
                    </div>
                  )}
                </div>

                {appointment.requiresTWIC && !appointment.escortAssigned && (
                  <div style={{ marginTop: '8px' }}>
                    <button
                      onClick={() => setActiveTab('twic')}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      🛡️ Request TWIC Escort
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book New Tab */}
      {activeTab === 'book' && (
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', color: 'white' }}>
            Book Port Appointment
          </h3>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const appointmentData = {
              portCode: formData.get('portCode'),
              terminalId: formData.get('terminalId'),
              driverLicense: formData.get('driverLicense'),
              twicCard: formData.get('twicCard'),
              appointmentTime: formData.get('appointmentTime'),
              operationType: formData.get('operationType'),
              containerNumber: formData.get('containerNumber'),
              chassisNumber: formData.get('chassisNumber')
            };
            bookAppointment(appointmentData);
          }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                  Port *
                </label>
                <select name="portCode" required style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '12px'
                }}>
                  <option value="">Select Port</option>
                  <option value="USLAX">Port of Los Angeles</option>
                  <option value="USLGB">Port of Long Beach</option>
                  <option value="USNYK">Port of NY/NJ</option>
                  <option value="USSAV">Port of Savannah</option>
                  <option value="USSEA">Port of Seattle</option>
                  <option value="USMIA">Port of Miami</option>
                  <option value="USHOU">Port of Houston</option>
                  <option value="USOAK">Port of Oakland</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Terminal ID *
                  </label>
                  <input name="terminalId" required placeholder="e.g., APM_T1" style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Operation Type *
                  </label>
                  <select name="operationType" required style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }}>
                    <option value="">Select Type</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="empty_return">Empty Return</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                  Appointment Time *
                </label>
                <input name="appointmentTime" type="datetime-local" required style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '12px'
                }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Driver License *
                  </label>
                  <input name="driverLicense" required placeholder="CDL Number" style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    TWIC Card
                  </label>
                  <input name="twicCard" placeholder="TWIC Number (if available)" style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Container Number
                  </label>
                  <input name="containerNumber" placeholder="Optional" style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Chassis Number
                  </label>
                  <input name="chassisNumber" placeholder="Optional" style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  background: loading ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  width: '100%',
                  marginTop: '8px'
                }}
              >
                {loading ? 'Booking...' : '📅 Book Appointment'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TWIC Escort Tab */}
      {activeTab === 'twic' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: 'white', margin: 0 }}>
              🛡️ TWIC Escort Services
            </h3>
          </div>

          {/* TWIC Info Box */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#a78bfa', margin: '0 0 8px 0' }}>
              About TWIC Escort Services
            </h4>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', margin: 0, lineHeight: '1.4' }}>
              For drivers without TWIC cards, we provide certified escorts to access secure port facilities. 
              Our escorts are TWIC-certified and familiar with port security procedures.
            </p>
          </div>

          {/* Current TWIC Requests */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Current Escort Requests
            </h4>
            <div style={{ display: 'grid', gap: '12px' }}>
              {twicRequests.map((request) => (
                <div key={request.id} style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: getStatusColor(request.status)
                    }} />
                    <h5 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: 'white' }}>
                      {request.portName}
                    </h5>
                    <span style={{
                      background: `${getStatusColor(request.status)}20`,
                      color: getStatusColor(request.status),
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500',
                      textTransform: 'capitalize'
                    }}>
                      {request.status}
                    </span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34d399',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '500'
                    }}>
                      ${request.cost}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Driver: </span>
                      <span style={{ color: 'white' }}>{request.driverName}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Time: </span>
                      <span style={{ color: 'white' }}>{formatDateTime(request.requestedTime)}</span>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Duration: </span>
                      <span style={{ color: 'white' }}>{request.duration} min</span>
                    </div>
                    {request.escortName && (
                      <div>
                        <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Escort: </span>
                        <span style={{ color: 'white' }}>{request.escortName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request New Escort Form */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', marginBottom: '12px' }}>
              Request New TWIC Escort
            </h4>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const escortData = {
                portCode: formData.get('portCode'),
                driverName: formData.get('driverName'),
                driverLicense: formData.get('driverLicense'),
                requestedTime: formData.get('requestedTime'),
                duration: parseInt(formData.get('duration') as string),
                specialInstructions: formData.get('specialInstructions')
              };
              requestTWICEscort(escortData);
            }}>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                      Port *
                    </label>
                    <select name="portCode" required style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      <option value="">Select Port</option>
                      <option value="USLAX">Port of Los Angeles</option>
                      <option value="USLGB">Port of Long Beach</option>
                      <option value="USNYK">Port of NY/NJ</option>
                      <option value="USSAV">Port of Savannah</option>
                      <option value="USSEA">Port of Seattle</option>
                      <option value="USMIA">Port of Miami</option>
                      <option value="USHOU">Port of Houston</option>
                      <option value="USOAK">Port of Oakland</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                      Duration (minutes) *
                    </label>
                    <select name="duration" required style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      <option value="">Select Duration</option>
                      <option value="60">1 hour ($75)</option>
                      <option value="120">2 hours ($125)</option>
                      <option value="180">3 hours ($175)</option>
                      <option value="240">4 hours ($225)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                      Driver Name *
                    </label>
                    <input name="driverName" required placeholder="Full Name" style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                      Driver License *
                    </label>
                    <input name="driverLicense" required placeholder="CDL Number" style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '12px'
                    }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Requested Time *
                  </label>
                  <input name="requestedTime" type="datetime-local" required style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px'
                  }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '4px' }}>
                    Special Instructions
                  </label>
                  <textarea name="specialInstructions" placeholder="Any special requirements or instructions..." style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '12px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }} />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    marginTop: '8px'
                  }}
                >
                  {loading ? 'Requesting...' : '🛡️ Request TWIC Escort'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
