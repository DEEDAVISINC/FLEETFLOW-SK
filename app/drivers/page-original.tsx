'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import DriverScheduleIntegration from '../components/DriverScheduleIntegration';
import StickyNote from '../components/StickyNote-Enhanced';

export default function DriverManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      // Test if basic mounting works
      console.info('DriverManagement component mounted');
      setLoading(false);
    } catch (err) {
      console.error('Error in DriverManagement:', err);
      setError(err);
      setLoading(false);
    }
  }, []);

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #EF4444, #DC2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#EF4444', marginBottom: '16px' }}>
            ❌ Component Error
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>
            There was an error loading the driver management page.
          </p>
          <pre
            style={{
              background: '#F3F4F6',
              padding: '16px',
              borderRadius: '8px',
              fontSize: '12px',
              textAlign: 'left',
              overflow: 'auto',
            }}
          >
            {error.toString()}
          </pre>
          <Link
            href='/'
            style={{
              display: 'inline-block',
              marginTop: '20px',
              background: '#3B82F6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
            }}
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Loading Driver Management...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div
        style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          href='/'
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            👥 DRIVER MANAGEMENT
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
            }}
          >
            Driver Fleet Operations & Performance Monitoring - Debugging Mode
          </p>
        </div>

        {/* Simple Test Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#374151', marginBottom: '20px' }}>
            🔧 Driver Management System - Debug Mode
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '20px' }}>
            This is a simplified version to test the page rendering. The full
            version will be restored once we identify the issue.
          </p>
          <div
            style={{
              background: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '8px',
              padding: '16px',
              margin: '20px 0',
            }}
          >
            <p style={{ color: '#1E40AF', margin: 0 }}>
              ✅ Component rendered successfully! The white screen issue has
              been temporarily resolved.
            </p>
          </div>
          <div
            style={{
              background: '#FEF3C7',
              border: '1px solid #FCD34D',
              borderRadius: '8px',
              padding: '16px',
              margin: '20px 0',
            }}
          >
            <p style={{ color: '#92400E', margin: 0 }}>
              ⚠️ Working to identify and fix the original component issue...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'Driving' | 'Inactive';
  totalMiles: number;
  rating: number;
  joinDate: string;
  lastActivity: string;
  currentLocation?: string;
  assignedTruck?: string;
  eldStatus: 'Connected' | 'Disconnected' | 'Error';
}

const MOCK_DRIVERS: Driver[] = [
  {
    id: 'DRV-001',
    name: 'John Smith',
    email: 'john.smith@fleetflowapp.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'CDL-TX-123456',
    status: 'Driving',
    totalMiles: 125000,
    rating: 4.8,
    joinDate: '2023-01-15',
    lastActivity: '2025-01-02T10:30:00Z',
    currentLocation: 'Dallas, TX',
    assignedTruck: 'TRK-001 (Freightliner Cascadia)',
    eldStatus: 'Connected',
  },
  {
    id: 'DRV-002',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@fleetflowapp.com',
    phone: '+1 (555) 234-5678',
    licenseNumber: 'CDL-CA-234567',
    status: 'Available',
    totalMiles: 89000,
    rating: 4.9,
    joinDate: '2023-03-20',
    lastActivity: '2025-01-02T09:15:00Z',
    currentLocation: 'Los Angeles, CA',
    assignedTruck: 'TRK-002 (Volvo VNL)',
    eldStatus: 'Connected',
  },
  {
    id: 'DRV-003',
    name: 'Mike Johnson',
    email: 'mike.johnson@fleetflowapp.com',
    phone: '+1 (555) 345-6789',
    licenseNumber: 'CDL-FL-345678',
    status: 'Off Duty',
    totalMiles: 156000,
    rating: 4.6,
    joinDate: '2022-11-10',
    lastActivity: '2025-01-01T18:45:00Z',
    currentLocation: 'Miami, FL',
    assignedTruck: 'TRK-003 (Peterbilt 579)',
    eldStatus: 'Connected',
  },
  {
    id: 'DRV-004',
    name: 'Emily Davis',
    email: 'emily.davis@fleetflowapp.com',
    phone: '+1 (555) 456-7890',
    licenseNumber: 'CDL-NY-456789',
    status: 'On Duty',
    totalMiles: 78000,
    rating: 4.7,
    joinDate: '2023-05-08',
    lastActivity: '2025-01-02T11:20:00Z',
    currentLocation: 'New York, NY',
    assignedTruck: 'TRK-004 (Kenworth T680)',
    eldStatus: 'Connected',
  },
  {
    id: 'DRV-005',
    name: 'David Brown',
    email: 'david.brown@fleetflowapp.com',
    phone: '+1 (555) 567-8901',
    licenseNumber: 'CDL-IL-567890',
    status: 'Inactive',
    totalMiles: 203000,
    rating: 4.5,
    joinDate: '2022-08-15',
    lastActivity: '2024-12-20T16:30:00Z',
    currentLocation: 'Chicago, IL',
    eldStatus: 'Disconnected',
  },
  {
    id: 'DRV-006',
    name: 'Lisa Garcia',
    email: 'lisa.garcia@fleetflowapp.com',
    phone: '+1 (555) 678-9012',
    licenseNumber: 'CDL-AZ-678901',
    status: 'Driving',
    totalMiles: 142000,
    rating: 4.9,
    joinDate: '2022-12-03',
    lastActivity: '2025-01-02T12:45:00Z',
    currentLocation: 'Phoenix, AZ',
    assignedTruck: 'TRK-005 (Mack Anthem)',
    eldStatus: 'Connected',
  },
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    onDuty: 0,
    driving: 0,
    offDuty: 0,
    inactive: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(
    new Set()
  );

  const { user } = getCurrentUser();

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setDrivers(MOCK_DRIVERS);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    setDrivers(MOCK_DRIVERS);
    const stats = {
      total: MOCK_DRIVERS.length,
      available: MOCK_DRIVERS.filter((d) => d.status === 'Available').length,
      onDuty: MOCK_DRIVERS.filter((d) => d.status === 'On Duty').length,
      driving: MOCK_DRIVERS.filter((d) => d.status === 'Driving').length,
      offDuty: MOCK_DRIVERS.filter((d) => d.status === 'Off Duty').length,
      inactive: MOCK_DRIVERS.filter((d) => d.status === 'Inactive').length,
    };
    setStats(stats);
  }, []);

  const toggleDriverExpansion = (driverId: string) => {
    const newExpanded = new Set(expandedDrivers);
    if (newExpanded.has(driverId)) {
      newExpanded.delete(driverId);
    } else {
      newExpanded.add(driverId);
    }
    setExpandedDrivers(newExpanded);
  };

  const filteredDrivers = drivers.filter((driver) => {
    return (
      !searchTerm ||
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      (driver.currentLocation &&
        driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'Available':
        return { bg: '#dcfce7', text: '#166534' };
      case 'On Duty':
        return { bg: '#dbeafe', text: '#1e40af' };
      case 'Driving':
        return { bg: '#fed7aa', text: '#c2410c' };
      case 'Off Duty':
        return { bg: '#fef3c7', text: '#a16207' };
      case 'Inactive':
        return { bg: '#f3f4f6', text: '#374151' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getEldStatusColor = (status: Driver['eldStatus']) => {
    switch (status) {
      case 'Connected':
        return { bg: '#dcfce7', text: '#166534' };
      case 'Disconnected':
        return { bg: '#fee2e2', text: '#dc2626' };
      case 'Error':
        return { bg: '#fef3c7', text: '#a16207' };
      default:
        return { bg: '#f3f4f6', text: '#374151' };
    }
  };
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e40af)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div
        style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}
      >
        <Link
          href='/'
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '12px',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            👥 DRIVER MANAGEMENT
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.9)',
              margin: 0,
            }}
          >
            Driver Fleet Operations & Performance Monitoring - {user.name}
          </p>
        </div>

        {/* Stats Dashboard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            {
              label: 'Total Drivers',
              value: stats.total,
              color: '#3b82f6',
              icon: '👥',
            },
            {
              label: 'Available',
              value: stats.available,
              color: '#10b981',
              icon: '✅',
            },
            {
              label: 'On Duty',
              value: stats.onDuty,
              color: '#3b82f6',
              icon: '🔵',
            },
            {
              label: 'Driving',
              value: stats.driving,
              color: '#f59e0b',
              icon: '🚛',
            },
            {
              label: 'Off Duty',
              value: stats.offDuty,
              color: '#eab308',
              icon: '⏸️',
            },
            {
              label: 'Inactive',
              value: stats.inactive,
              color: '#6b7280',
              icon: '⚫',
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div
                style={{
                  background: stat.color,
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '12px',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
                >
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div
                style={{
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Driver Notes & Communication Hub */}
        <div style={{ marginBottom: '32px' }}>
          <StickyNote
            section='drivers'
            entityId='driver-management'
            entityName='Driver Management'
            entityType='driver'
            isNotificationHub={true}
          />
        </div>

        {/* Search and Filters */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type='text'
              placeholder='Search drivers by name, email, license, phone, location...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                fontSize: '20px',
              }}
            >
              🔍
            </div>
          </div>
        </div>

        {/* Navigation Bar for Integrated Features */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            padding: '16px 24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👥 Driver Management
            </h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                {filteredDrivers.length} Active Drivers
              </span>
              <span
                style={{
                  background: '#dcfce7',
                  color: '#166534',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                ✅ Scheduling Integrated
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href='/scheduling' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                📅 Full Scheduling System
              </button>
            </Link>

            <button
              onClick={() => {
                // Toggle all drivers expanded/collapsed
                const allDriverIds = filteredDrivers.map((d) => d.id);
                if (expandedDrivers.size === 0) {
                  setExpandedDrivers(new Set(allDriverIds));
                } else {
                  setExpandedDrivers(new Set());
                }
              }}
              style={{
                background: expandedDrivers.size > 0 ? '#f59e0b' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {expandedDrivers.size > 0
                ? '📂 Collapse All Schedules'
                : '📊 Expand All Schedules'}
            </button>
          </div>
        </div>

        {/* Driver Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr
                  style={{
                    background: 'linear-gradient(90deg, #f9fafb, #f3f4f6)',
                  }}
                >
                  {[
                    'Driver ID',
                    'Name & Contact',
                    'License',
                    'Status',
                    'Location',
                    'Truck',
                    'ELD',
                    'Miles & Rating',
                    'Last Activity',
                    'Actions',
                  ].map((header) => (
                    <th
                      key={header}
                      style={{
                        padding: '16px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#374151',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map((driver, index) => (
                  <React.Fragment key={driver.id}>
                    <tr
                      style={{
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: expandedDrivers.has(driver.id)
                          ? '#eff6ff'
                          : 'transparent',
                      }}
                      onMouseOver={(e) => {
                        if (!expandedDrivers.has(driver.id)) {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!expandedDrivers.has(driver.id)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#111827',
                        }}
                      >
                        {driver.id}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div
                          style={{
                            fontWeight: '600',
                            color: '#111827',
                            marginBottom: '2px',
                          }}
                        >
                          {driver.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {driver.email}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {driver.phone}
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                        }}
                      >
                        {driver.licenseNumber}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            backgroundColor: getStatusColor(driver.status).bg,
                            color: getStatusColor(driver.status).text,
                          }}
                        >
                          {driver.status}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                        }}
                      >
                        {driver.currentLocation || 'Unknown'}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#111827',
                        }}
                      >
                        {driver.assignedTruck || 'Unassigned'}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            borderRadius: '20px',
                            backgroundColor: getEldStatusColor(driver.eldStatus)
                              .bg,
                            color: getEldStatusColor(driver.eldStatus).text,
                          }}
                        >
                          {driver.eldStatus}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#111827' }}>
                          {driver.totalMiles.toLocaleString()} mi
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          ⭐ {driver.rating}/5.0
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div style={{ fontWeight: '600', color: '#111827' }}>
                          {new Date(driver.lastActivity).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {new Date(driver.lastActivity).toLocaleTimeString()}
                        </div>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <button
                            onClick={() => toggleDriverExpansion(driver.id)}
                            style={{
                              background: expandedDrivers.has(driver.id)
                                ? '#3b82f6'
                                : '#f3f4f6',
                              color: expandedDrivers.has(driver.id)
                                ? 'white'
                                : '#374151',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              if (!expandedDrivers.has(driver.id)) {
                                e.currentTarget.style.backgroundColor =
                                  '#e5e7eb';
                              }
                            }}
                            onMouseOut={(e) => {
                              if (!expandedDrivers.has(driver.id)) {
                                e.currentTarget.style.backgroundColor =
                                  '#f3f4f6';
                              }
                            }}
                          >
                            {expandedDrivers.has(driver.id)
                              ? '📅 Hide Schedule'
                              : '📅 View Schedule'}
                          </button>
                          <Link
                            href='/scheduling'
                            style={{ textDecoration: 'none' }}
                          >
                            <button
                              style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  '#059669';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  '#10b981';
                              }}
                            >
                              📊 Full Scheduling
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Schedule Row */}
                    {expandedDrivers.has(driver.id) && (
                      <tr>
                        <td
                          colSpan={10}
                          style={{ padding: '0', backgroundColor: '#f8fafc' }}
                        >
                          <div style={{ padding: '20px', margin: '0 20px' }}>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr',
                                gap: '20px',
                                marginBottom: '20px',
                              }}
                            >
                              <div>
                                <DriverScheduleIntegration
                                  driverId={driver.id}
                                  driverName={driver.name}
                                  driverStatus={driver.status}
                                  onScheduleCreate={() => {
                                    // Optionally refresh driver data or show notification
                                    console.info(
                                      `Schedule created for ${driver.name}`
                                    );
                                  }}
                                />
                              </div>
                              <div>
                                <h4
                                  style={{
                                    marginBottom: '12px',
                                    color: '#374151',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                  }}
                                >
                                  📝 Driver Notes & Communications
                                </h4>
                                <StickyNote
                                  section='drivers'
                                  entityId={driver.id}
                                  entityName={driver.name}
                                  entityType='driver'
                                  showUnreadCount={true}
                                />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* No drivers message */}
          {filteredDrivers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
              <div
                style={{
                  color: '#4b5563',
                  fontSize: '20px',
                  marginBottom: '8px',
                  fontWeight: '600',
                }}
              >
                {searchTerm
                  ? 'No drivers found matching your search'
                  : 'No drivers available'}
              </div>
              <div style={{ color: '#6b7280' }}>
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Add drivers to get started'}
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    marginTop: '16px',
                    padding: '8px 24px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#3b82f6';
                  }}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
