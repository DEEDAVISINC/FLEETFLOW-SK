'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  vehicleName: string;
  type: 'scheduled' | 'emergency' | 'inspection' | 'repair';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost: number;
  mileage: number;
  technician: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedDuration: string;
  actualDuration?: string;
}

export default function MaintenancePage() {
  const [maintenanceRecords] = useState<MaintenanceRecord[]>([
    {
      id: 'M001',
      vehicleId: 'V001',
      vehicleName: 'Truck-045',
      type: 'scheduled',
      status: 'pending',
      description: 'Oil change and filter replacement',
      scheduledDate: '2024-06-25',
      cost: 150,
      mileage: 125000,
      technician: 'Mike Thompson',
      priority: 'medium',
      estimatedDuration: '2h',
    },
    {
      id: 'M002',
      vehicleId: 'V002',
      vehicleName: 'Van-012',
      type: 'repair',
      status: 'in_progress',
      description: 'Brake system repair',
      scheduledDate: '2024-06-24',
      cost: 450,
      mileage: 89000,
      technician: 'Sarah Wilson',
      priority: 'high',
      estimatedDuration: '4h',
      actualDuration: '3h',
    },
    {
      id: 'M003',
      vehicleId: 'V003',
      vehicleName: 'Truck-089',
      type: 'inspection',
      status: 'completed',
      description: 'DOT safety inspection',
      scheduledDate: '2024-06-20',
      completedDate: '2024-06-20',
      cost: 200,
      mileage: 156000,
      technician: 'Bob Rodriguez',
      priority: 'high',
      estimatedDuration: '3h',
      actualDuration: '2.5h',
    },
    {
      id: 'M004',
      vehicleId: 'V004',
      vehicleName: 'Van-023',
      type: 'emergency',
      status: 'overdue',
      description: 'Engine overheating - coolant system failure',
      scheduledDate: '2024-06-18',
      cost: 850,
      mileage: 78000,
      technician: 'Mike Thompson',
      priority: 'critical',
      estimatedDuration: '6h',
    },
    {
      id: 'M005',
      vehicleId: 'V005',
      vehicleName: 'Truck-156',
      type: 'scheduled',
      status: 'pending',
      description: 'Tire rotation and alignment',
      scheduledDate: '2024-06-28',
      cost: 120,
      mileage: 142000,
      technician: 'Sarah Wilson',
      priority: 'low',
      estimatedDuration: '1.5h',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [activeView, setActiveView] = useState<
    'overview' | 'schedule' | 'analytics'
  >('overview');

  const filteredRecords = maintenanceRecords.filter((record) => {
    const matchesSearch =
      record.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || record.status === statusFilter;
    const matchesType = typeFilter === 'all' || record.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#dc2626';
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'overdue':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'scheduled':
        return '📅';
      case 'emergency':
        return '🚨';
      case 'inspection':
        return '🔍';
      case 'repair':
        return '🔧';
      default:
        return '⚙️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'scheduled':
        return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'emergency':
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'inspection':
        return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'repair':
        return 'linear-gradient(135deg, #10b981, #059669)';
      default:
        return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  const totalCost = maintenanceRecords.reduce(
    (sum, record) => sum + record.cost,
    0
  );
  const avgCost = totalCost / maintenanceRecords.length;

  // Calculate stats
  const stats = {
    total: maintenanceRecords.length,
    pending: maintenanceRecords.filter((r) => r.status === 'pending').length,
    inProgress: maintenanceRecords.filter((r) => r.status === 'in_progress')
      .length,
    overdue: maintenanceRecords.filter((r) => r.status === 'overdue').length,
    totalCost: totalCost,
    avgCost: avgCost,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%),
        radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(6, 182, 212, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

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
                <span style={{ fontSize: '32px' }}>🔧</span>
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
                  Maintenance Management Center
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 8px 0',
                  }}
                >
                  Advanced fleet maintenance scheduling & tracking system
                </p>
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
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
                        width: '12px',
                        height: '12px',
                        background: '#4ade80',
                        borderRadius: '50%',
                        animation: 'pulse 2s infinite',
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Live Maintenance Monitoring
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    Last updated: {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            <button
              style={{
                background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              + Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'schedule', label: 'Scheduler', icon: '📅' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  background:
                    activeView === tab.id
                      ? 'linear-gradient(135deg, #06b6d4, #0891b2)'
                      : 'rgba(255, 255, 255, 0.1)',
                  color:
                    activeView === tab.id
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeView === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {stats.total}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Total Records
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#f59e0b',
                  }}
                >
                  {stats.pending}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Pending
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                  }}
                >
                  {stats.inProgress}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  In Progress
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#ef4444',
                  }}
                >
                  {stats.overdue}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Overdue
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#10b981',
                  }}
                >
                  ${stats.totalCost.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  Total Cost
                </div>
              </div>
            </div>

            {/* Filters */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '32px',
                marginBottom: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                🔍 Filters & Search
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px',
                }}
              >
                <input
                  type='text'
                  placeholder='Search vehicles, descriptions, technicians...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none',
                  }}
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none',
                  }}
                >
                  <option value='all'>All Status</option>
                  <option value='pending'>Pending</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                  <option value='overdue'>Overdue</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none',
                  }}
                >
                  <option value='all'>All Types</option>
                  <option value='scheduled'>Scheduled</option>
                  <option value='emergency'>Emergency</option>
                  <option value='inspection'>Inspection</option>
                  <option value='repair'>Repair</option>
                </select>
              </div>
            </div>

            {/* Maintenance Records */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  Recent Maintenance Records
                </h2>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View All ({filteredRecords.length})
                </button>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: getTypeColor(record.type),
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '18px',
                        }}
                      >
                        {getTypeIcon(record.type)}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontWeight: '600',
                            color: 'white',
                            margin: '0 0 4px 0',
                            fontSize: '16px',
                          }}
                        >
                          {record.vehicleName}
                        </h3>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: '0 0 4px 0',
                            fontSize: '14px',
                          }}
                        >
                          {record.description}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          {record.technician} • {record.scheduledDate}
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#4ade80',
                            margin: '0 0 4px 0',
                          }}
                        >
                          ${record.cost}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Cost
                        </p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'white',
                            margin: '0 0 4px 0',
                          }}
                        >
                          {record.mileage.toLocaleString()}
                        </p>
                        <p
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            margin: 0,
                            fontSize: '12px',
                          }}
                        >
                          Miles
                        </p>
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            record.status === 'completed'
                              ? 'rgba(74, 222, 128, 0.2)'
                              : record.status === 'in_progress'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : record.status === 'overdue'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : 'rgba(251, 191, 36, 0.2)',
                          color:
                            record.status === 'completed'
                              ? '#4ade80'
                              : record.status === 'in_progress'
                                ? '#3b82f6'
                                : record.status === 'overdue'
                                  ? '#ef4444'
                                  : '#fbbf24',
                          border: `1px solid ${
                            record.status === 'completed'
                              ? '#4ade80'
                              : record.status === 'in_progress'
                                ? '#3b82f6'
                                : record.status === 'overdue'
                                  ? '#ef4444'
                                  : '#fbbf24'
                          }`,
                        }}
                      >
                        {record.status.replace('_', ' ').toUpperCase()}
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getPriorityColor(record.priority),
                          color: 'white',
                          border: `1px solid ${getPriorityColor(record.priority)}`,
                        }}
                      >
                        {record.priority.toUpperCase()}
                      </div>
                      <button
                        style={{
                          background:
                            'linear-gradient(135deg, #10b981, #059669)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow =
                            '0 8px 25px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <span>📋</span>
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeView === 'schedule' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Schedule New Maintenance */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '24px 32px',
                }}
              >
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    margin: '0 0 8px 0',
                  }}
                >
                  📅 Schedule New Maintenance
                </h2>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                  Plan and schedule maintenance for your fleet vehicles
                </p>
              </div>

              <div style={{ padding: '32px' }}>
                {/* Progress Section */}
                <div style={{ marginBottom: '24px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '16px',
                        fontWeight: '500',
                      }}
                    >
                      Scheduling Progress
                    </span>
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '14px',
                      }}
                    >
                      3/5 Steps
                    </span>
                  </div>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      height: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: 'linear-gradient(90deg, #10b981, #059669)',
                        height: '100%',
                        width: '60%',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '24px',
                  }}
                >
                  <select
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      color: '#1f2937',
                      outline: 'none',
                    }}
                  >
                    <option value=''>Select Vehicle</option>
                    <option value='truck-045'>Truck-045</option>
                    <option value='van-012'>Van-012</option>
                    <option value='truck-089'>Truck-089</option>
                    <option value='van-023'>Van-023</option>
                    <option value='truck-156'>Truck-156</option>
                  </select>

                  <select
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      color: '#1f2937',
                      outline: 'none',
                    }}
                  >
                    <option value=''>Maintenance Type</option>
                    <option value='scheduled'>Scheduled Maintenance</option>
                    <option value='inspection'>Safety Inspection</option>
                    <option value='repair'>Repair Work</option>
                    <option value='emergency'>Emergency Service</option>
                  </select>

                  <input
                    type='date'
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      color: '#1f2937',
                      outline: 'none',
                    }}
                  />

                  <select
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      color: '#1f2937',
                      outline: 'none',
                    }}
                  >
                    <option value=''>Select Technician</option>
                    <option value='mike'>Mike Thompson</option>
                    <option value='sarah'>Sarah Wilson</option>
                    <option value='bob'>Bob Rodriguez</option>
                  </select>
                </div>

                <textarea
                  placeholder='Description of maintenance work needed...'
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    color: '#1f2937',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '80px',
                    marginBottom: '24px',
                  }}
                />

                <button
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Schedule Maintenance
                </button>
              </div>
            </div>

            {/* Upcoming Maintenance Calendar */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '32px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: 0,
                  }}
                >
                  Upcoming Maintenance Schedule
                </h2>
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View All (
                  {
                    maintenanceRecords.filter(
                      (record) =>
                        record.status === 'pending' ||
                        record.status === 'in_progress'
                    ).length
                  }
                  )
                </button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {maintenanceRecords
                  .filter(
                    (record) =>
                      record.status === 'pending' ||
                      record.status === 'in_progress'
                  )
                  .sort(
                    (a, b) =>
                      new Date(a.scheduledDate).getTime() -
                      new Date(b.scheduledDate).getTime()
                  )
                  .map((record) => (
                    <div
                      key={record.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '48px',
                            height: '48px',
                            background: getTypeColor(record.type),
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '18px',
                          }}
                        >
                          {getTypeIcon(record.type)}
                        </div>
                        <div>
                          <h3
                            style={{
                              fontWeight: '600',
                              color: 'white',
                              margin: '0 0 4px 0',
                              fontSize: '16px',
                            }}
                          >
                            {record.vehicleName}
                          </h3>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: '0 0 4px 0',
                              fontSize: '14px',
                            }}
                          >
                            {record.description}
                          </p>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: 0,
                              fontSize: '12px',
                            }}
                          >
                            {record.technician} •{' '}
                            {new Date(
                              record.scheduledDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '24px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <p
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#4ade80',
                              margin: '0 0 4px 0',
                            }}
                          >
                            ${record.cost}
                          </p>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: 0,
                              fontSize: '12px',
                            }}
                          >
                            Cost
                          </p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: 'white',
                              margin: '0 0 4px 0',
                            }}
                          >
                            {record.estimatedDuration}
                          </p>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: 0,
                              fontSize: '12px',
                            }}
                          >
                            Duration
                          </p>
                        </div>
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background:
                              record.status === 'pending'
                                ? 'rgba(251, 191, 36, 0.2)'
                                : 'rgba(59, 130, 246, 0.2)',
                            color:
                              record.status === 'pending'
                                ? '#fbbf24'
                                : '#3b82f6',
                            border: `1px solid ${record.status === 'pending' ? '#fbbf24' : '#3b82f6'}`,
                          }}
                        >
                          {record.status.replace('_', ' ').toUpperCase()}
                        </div>
                        <div
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getPriorityColor(record.priority),
                            color: 'white',
                            border: `1px solid ${getPriorityColor(record.priority)}`,
                          }}
                        >
                          {record.priority.toUpperCase()}
                        </div>
                        <button
                          style={{
                            background:
                              'linear-gradient(135deg, #10b981, #059669)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 8px 25px rgba(0, 0, 0, 0.2)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <span>⏰</span>
                          Reschedule
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeView === 'analytics' && (
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                color: 'white',
                padding: '24px 32px',
              }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                📊 Analytics Dashboard
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Maintenance insights and fleet performance analytics
              </p>
            </div>

            <div style={{ padding: '32px' }}>
              {/* KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    💰
                  </div>
                  <h3
                    style={{
                      color: '#fbbf24',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    ${stats.avgCost.toFixed(0)}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Average Cost
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    ⚡
                  </div>
                  <h3
                    style={{
                      color: '#10b981',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {Math.round(
                      ((stats.total - stats.overdue) / stats.total) * 100
                    )}
                    %
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    On-Time Rate
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    🔧
                  </div>
                  <h3
                    style={{
                      color: '#ef4444',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {
                      maintenanceRecords.filter((r) => r.type === 'repair')
                        .length
                    }
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Repairs Count
                  </p>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                    📅
                  </div>
                  <h3
                    style={{
                      color: '#3b82f6',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {
                      maintenanceRecords.filter((r) => r.type === 'scheduled')
                        .length
                    }
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    Scheduled Count
                  </p>
                </div>
              </div>

              {/* Maintenance by Type */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                  }}
                >
                  Maintenance by Type
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                  }}
                >
                  {['scheduled', 'emergency', 'inspection', 'repair'].map(
                    (type) => {
                      const count = maintenanceRecords.filter(
                        (r) => r.type === type
                      ).length;
                      const percentage = (
                        (count / maintenanceRecords.length) *
                        100
                      ).toFixed(1);
                      const totalCost = maintenanceRecords
                        .filter((r) => r.type === type)
                        .reduce((sum, r) => sum + r.cost, 0);

                      const colors: Record<string, string> = {
                        scheduled: '#3b82f6',
                        emergency: '#ef4444',
                        inspection: '#f59e0b',
                        repair: '#10b981',
                      };

                      return (
                        <div
                          key={type}
                          style={{
                            background: `${colors[type]}20`,
                            border: `1px solid ${colors[type]}40`,
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                          }}
                        >
                          <div
                            style={{
                              color: colors[type],
                              fontSize: '24px',
                              fontWeight: 'bold',
                              marginBottom: '4px',
                            }}
                          >
                            {count}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '12px',
                              textTransform: 'capitalize',
                              marginBottom: '2px',
                            }}
                          >
                            {type}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '10px',
                            }}
                          >
                            {percentage}% • ${totalCost.toLocaleString()}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Cost Analysis */}
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: '0 0 16px 0',
                  }}
                >
                  Cost Analysis
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {maintenanceRecords
                    .sort((a, b) => b.cost - a.cost)
                    .slice(0, 6)
                    .map((record) => (
                      <div
                        key={record.id}
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>
                            {getTypeIcon(record.type)}
                          </span>
                          <div>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: '0 0 4px 0',
                              }}
                            >
                              {record.vehicleName}
                            </h4>
                            <p
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '12px',
                                margin: 0,
                              }}
                            >
                              {record.description
                                ? record.description.substring(0, 30) + '...'
                                : 'No description available'}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                          }}
                        >
                          <div style={{ textAlign: 'center' }}>
                            <div
                              style={{
                                color:
                                  record.cost > 500
                                    ? '#ef4444'
                                    : record.cost > 200
                                      ? '#f59e0b'
                                      : '#10b981',
                                fontSize: '18px',
                                fontWeight: 'bold',
                              }}
                            >
                              ${record.cost}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '12px',
                              }}
                            >
                              {record.type}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
