'use client';

import Link from 'next/link';
import { useState } from 'react';
import StickyNote from '../components/StickyNote-Enhanced';

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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0' }}>
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
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

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
              🔧 Maintenance Management
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
              }}
            >
              Schedule, track, and manage vehicle maintenance
            </p>
          </div>
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
              fontSize: '14px',
              boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)',
            }}
          >
            ➕ Schedule Maintenance
          </button>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📊</div>
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}
            >
              {stats.total}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              Total Records
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}
            >
              {stats.pending}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Pending</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}
            >
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              In Progress
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}
            >
              {stats.overdue}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Overdue</div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>💰</div>
            <div
              style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}
            >
              ${stats.totalCost.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Cost</div>
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
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#1f2937',
              }}
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#1f2937',
                cursor: 'pointer',
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
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                color: '#1f2937',
                cursor: 'pointer',
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

        {/* Maintenance Records Table */}
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
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            🚛 Maintenance Records
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Type
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Vehicle
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Technician
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Scheduled
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Priority
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td style={{ padding: '16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontSize: '20px' }}>
                            {getTypeIcon(record.type)}
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '500',
                              color: '#1f2937',
                              textTransform: 'capitalize',
                            }}
                          >
                            {record.type}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: '600',
                          color: '#3b82f6',
                        }}
                      >
                        {record.vehicleName}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {record.description}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {record.technician}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {record.scheduledDate}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: getPriorityColor(record.priority),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                          }}
                        >
                          {record.priority}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: getStatusColor(record.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                          }}
                        >
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: '600',
                          color: '#10b981',
                        }}
                      >
                        ${record.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Maintenance Notes Section */}
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
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            📝 Maintenance Notes & Documentation
          </h3>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <StickyNote
              section='maintenance'
              entityId='maintenance-general'
              entityName='Fleet Maintenance'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
