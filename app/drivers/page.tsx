'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import DriverScheduleIntegration from '../components/DriverScheduleIntegration';
import StickyNote from '../components/StickyNote-Enhanced';
import { Tooltip } from '../components/ui/tooltip';
import { getCurrentUser } from '../config/access';
import { getTooltipContent } from '../utils/tooltipContent';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  carrierMC: string;
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
    email: 'john.smith@fleetflow.com',
    phone: '+1 (555) 123-4567',
    licenseNumber: 'CDL-TX-123456',
    carrierMC: 'MC-123456',
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
    email: 'sarah.wilson@fleetflow.com',
    phone: '+1 (555) 234-5678',
    licenseNumber: 'CDL-CA-234567',
    carrierMC: 'MC-234567',
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
    email: 'mike.johnson@fleetflow.com',
    phone: '+1 (555) 345-6789',
    licenseNumber: 'CDL-FL-345678',
    carrierMC: 'MC-345678',
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
    email: 'emily.davis@fleetflow.com',
    phone: '+1 (555) 456-7890',
    licenseNumber: 'CDL-NY-456789',
    carrierMC: 'MC-456789',
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
    email: 'david.brown@fleetflow.com',
    phone: '+1 (555) 567-8901',
    licenseNumber: 'CDL-IL-567890',
    carrierMC: 'MC-567890',
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
    email: 'lisa.garcia@fleetflow.com',
    phone: '+1 (555) 678-9012',
    licenseNumber: 'CDL-AZ-678901',
    carrierMC: 'MC-678901',
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

// Memoized components for better performance
const DriverStatsCard = React.memo(
  ({
    label,
    value,
    color,
    icon,
  }: {
    label: string;
    value: number;
    color: string;
    icon: string;
  }) => (
    <div
      className='stats-card'
      style={{
        background: 'white',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center' as const,
        boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        transition: 'all 0.3s ease',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          background: color,
          color: 'white',
          fontSize: '18px',
          fontWeight: 'bold',
          borderRadius: '6px',
          padding: '8px',
          marginBottom: '8px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '2px' }}>
          {icon}
        </div>
        <div>{value}</div>
      </div>
      <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>
        {label}
      </div>
    </div>
  )
);

const DriverRow = React.memo(
  ({
    driver,
    index,
    isExpanded,
    onToggleExpansion,
  }: {
    driver: Driver;
    index: number;
    isExpanded: boolean;
    onToggleExpansion: (id: string) => void;
  }) => {
    const statusStyles = useMemo(() => {
      const styles = {
        Available: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
        'On Duty': { bg: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' },
        Driving: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
        'Off Duty': { bg: 'rgba(234, 179, 8, 0.2)', color: '#eab308' },
        Inactive: {
          bg: 'rgba(255, 255, 255, 0.1)',
          color: 'rgba(255, 255, 255, 0.8)',
        },
      };
      return styles[driver.status] || styles['Inactive'];
    }, [driver.status]);

    const eldStatusStyles = useMemo(() => {
      const styles = {
        Connected: { bg: 'rgba(16, 185, 129, 0.2)', color: '#10b981' },
        Disconnected: { bg: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
        Error: { bg: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
      };
      return styles[driver.eldStatus] || styles['Error'];
    }, [driver.eldStatus]);

    return (
      <React.Fragment key={driver.id}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '70px 1.2fr 100px 80px 90px 80px 80px 80px 90px 80px',
            gap: '8px',
            padding: '10px 12px',
            background:
              index % 2 === 0
                ? 'rgba(255, 255, 255, 0.18)'
                : 'rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            marginBottom: '8px',
            fontSize: '11px',
            transition: 'all 0.3s ease',
            color: 'white',
          }}
        >
          <div
            style={{
              fontWeight: '700',
              color: '#60a5fa',
              fontSize: '12px',
              textAlign: 'center' as const,
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            }}
          >
            {driver.id}
          </div>
          <div style={{ lineHeight: '1.3' }}>
            <div
              style={{
                fontWeight: '600',
                marginBottom: '2px',
                fontSize: '11px',
              }}
            >
              {driver.name}
            </div>
            <a
              href={`mailto:${driver.email}`}
              style={{
                fontSize: '10px',
                color: '#93c5fd',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                fontWeight: '500',
              }}
            >
              {driver.email}
            </a>
          </div>
          <div style={{ fontSize: '10px', textAlign: 'center' as const }}>
            {driver.licenseNumber}
          </div>
          <div
            style={{
              fontSize: '10px',
              textAlign: 'center' as const,
              color: '#fbbf24',
            }}
          >
            {driver.carrierMC}
          </div>
          <div>
            <Tooltip
              content={getTooltipContent('driver', 'status', driver.status)}
              theme='driver'
              position='top'
            >
              <span
                style={{
                  padding: '3px 6px',
                  borderRadius: '6px',
                  fontSize: '9px',
                  fontWeight: '700',
                  background: statusStyles.bg,
                  color: statusStyles.color,
                  textTransform: 'uppercase' as const,
                  cursor: 'help',
                }}
              >
                {driver.status}
              </span>
            </Tooltip>
          </div>
          <div style={{ fontSize: '10px', textAlign: 'center' as const }}>
            {driver.currentLocation || 'Unknown'}
          </div>
          <div style={{ fontSize: '10px', textAlign: 'center' as const }}>
            {driver.assignedTruck || 'Unassigned'}
          </div>
          <div>
            <span
              style={{
                padding: '3px 6px',
                borderRadius: '6px',
                fontSize: '9px',
                fontWeight: '700',
                background: eldStatusStyles.bg,
                color: eldStatusStyles.color,
                textTransform: 'uppercase' as const,
              }}
            >
              {driver.eldStatus}
            </span>
          </div>
          <div
            style={{
              fontWeight: '700',
              color: '#10b981',
              fontSize: '11px',
              textAlign: 'center' as const,
            }}
          >
            {driver.totalMiles.toLocaleString()}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => onToggleExpansion(driver.id)}
              style={{
                padding: '3px 6px',
                background: isExpanded
                  ? 'linear-gradient(135deg, #f7c52d, #f4a832)'
                  : 'rgba(255, 255, 255, 0.1)',
                color: isExpanded ? '#2d3748' : 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '9px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
            >
              📅
            </button>
            <Link href='/scheduling' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  padding: '3px 6px',
                  background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '9px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                📊
              </button>
            </Link>
          </div>
        </div>

        {/* Expanded Schedule Row */}
        {isExpanded && (
          <div
            style={{
              background: '#f8fafc',
              borderRadius: '8px',
              marginTop: '8px',
              marginBottom: '16px',
              padding: '20px',
              border: '1px solid #e2e8f0',
            }}
          >
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
                    console.log(`Schedule created for ${driver.name}`);
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
        )}
      </React.Fragment>
    );
  }
);

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedDrivers, setExpandedDrivers] = useState<Set<string>>(
    new Set()
  );

  const { user } = getCurrentUser();

  // Initialize data once
  useEffect(() => {
    setDrivers(MOCK_DRIVERS);
    setLoading(false);
  }, []);

  // Memoized computed values to prevent unnecessary recalculations
  const stats = useMemo(
    () => ({
      total: drivers.length,
      available: drivers.filter((d) => d.status === 'Available').length,
      onDuty: drivers.filter((d) => d.status === 'On Duty').length,
      driving: drivers.filter((d) => d.status === 'Driving').length,
      offDuty: drivers.filter((d) => d.status === 'Off Duty').length,
      inactive: drivers.filter((d) => d.status === 'Inactive').length,
    }),
    [drivers]
  );

  const filteredDrivers = useMemo(() => {
    if (!searchTerm.trim()) return drivers;

    const search = searchTerm.toLowerCase();
    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(search) ||
        driver.email.toLowerCase().includes(search) ||
        driver.licenseNumber.toLowerCase().includes(search) ||
        driver.phone.includes(searchTerm) ||
        (driver.currentLocation &&
          driver.currentLocation.toLowerCase().includes(search))
    );
  }, [drivers, searchTerm]);

  // Optimized callbacks to prevent unnecessary re-renders
  const toggleDriverExpansion = useCallback((driverId: string) => {
    setExpandedDrivers((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(driverId)) {
        newExpanded.delete(driverId);
      } else {
        newExpanded.add(driverId);
      }
      return newExpanded;
    });
  }, []);

  const toggleAllExpanded = useCallback(() => {
    const allDriverIds = filteredDrivers.map((d) => d.id);
    if (expandedDrivers.size === 0) {
      setExpandedDrivers(new Set(allDriverIds));
    } else {
      setExpandedDrivers(new Set());
    }
  }, [filteredDrivers, expandedDrivers.size]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: '100px',
          textAlign: 'center' as const,
          color: 'white',
        }}
      >
        Loading drivers...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af, #3730a3)',
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
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '8px',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
          >
            👥 DRIVER MANAGEMENT
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.8)',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <DriverStatsCard
            label='Total Drivers'
            value={stats.total}
            color='#3b82f6'
            icon='👥'
          />
          <DriverStatsCard
            label='Available'
            value={stats.available}
            color='#10b981'
            icon='✅'
          />
          <DriverStatsCard
            label='On Duty'
            value={stats.onDuty}
            color='#3b82f6'
            icon='🔵'
          />
          <DriverStatsCard
            label='Driving'
            value={stats.driving}
            color='#f59e0b'
            icon='🚛'
          />
          <DriverStatsCard
            label='Off Duty'
            value={stats.offDuty}
            color='#eab308'
            icon='⏸️'
          />
          <DriverStatsCard
            label='Inactive'
            value={stats.inactive}
            color='#6b7280'
            icon='⚫'
          />
        </div>

        {/* Driver Notes & Communication Hub */}
        <div style={{ marginBottom: '24px' }}>
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
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ position: 'relative' }}>
            <input
              type='text'
              placeholder='Search drivers by name, email, license, phone, location...'
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease',
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

        {/* Navigation Bar */}
        <div
          style={{
            background: 'white',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap' as const,
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              👥 Driver Management
            </h2>
            <span
              style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              ✅ Scheduling Integrated
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link href='/scheduling' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📅 Full Scheduling System
              </button>
            </Link>

            <button
              onClick={toggleAllExpanded}
              style={{
                background: expandedDrivers.size > 0 ? '#f59e0b' : '#10b981',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            {[
              { id: 'all', label: 'All Drivers', icon: '👥' },
              { id: 'available', label: 'Available', icon: '✅' },
              { id: 'driving', label: 'Driving', icon: '🚛' },
              { id: 'off-duty', label: 'Off Duty', icon: '⏸️' },
            ].map((tab) => (
              <button
                key={tab.id}
                style={{
                  background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
                  color: '#2d3748',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '70px 1.2fr 100px 80px 90px 80px 80px 80px 90px 80px',
              gap: '8px',
              padding: '10px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              marginBottom: '10px',
              fontWeight: '700',
              fontSize: '10px',
              textTransform: 'uppercase' as const,
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <div>ID</div>
            <div>Driver</div>
            <div>License</div>
            <div>MC #</div>
            <div>Status</div>
            <div>Location</div>
            <div>Truck</div>
            <div>ELD</div>
            <div>Miles</div>
            <div>Actions</div>
          </div>

          {/* Driver Rows */}
          {filteredDrivers.map((driver, index) => (
            <DriverRow
              key={driver.id}
              driver={driver}
              index={index}
              isExpanded={expandedDrivers.has(driver.id)}
              onToggleExpansion={toggleDriverExpansion}
            />
          ))}

          {/* No drivers message */}
          {filteredDrivers.length === 0 && (
            <div style={{ textAlign: 'center' as const, padding: '48px' }}>
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
                  onClick={clearSearch}
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
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Driver Communication & Alerts Hub */}
        <div
          style={{
            marginBottom: '24px',
            background: 'linear-gradient(90deg, #e0e7ff 0%, #f1f5f9 100%)',
            borderRadius: '18px',
            boxShadow: '0 8px 32px rgba(30,64,175,0.10)',
            border: '1.5px solid #c7d2fe',
            padding: '0',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(90deg, #2563eb 0%, #1e40af 100%)',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 28, color: '#fff' }}>📢</span>
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  color: '#fff',
                  letterSpacing: 0.5,
                }}
              >
                Driver Communication & Alerts Hub
              </span>
            </div>
            {/* Metrics summary */}
            <div style={{ display: 'flex', gap: 18 }}>
              <div
                style={{
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 18 }}>📨</span> 3 Unread
              </div>
              <div
                style={{
                  color: '#fbbf24',
                  fontWeight: 600,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 18 }}>⚠️</span> 1 Urgent
              </div>
              <div
                style={{
                  color: '#a5b4fc',
                  fontWeight: 600,
                  fontSize: 15,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ fontSize: 18 }}>📋</span> 8 Total
              </div>
            </div>
          </div>

          {/* Alerts/Comms List */}
          <div
            style={{
              padding: '24px 32px',
              maxHeight: 220,
              overflowY: 'auto' as const,
              display: 'flex',
              flexDirection: 'column' as const,
              gap: 18,
              background: 'transparent',
            }}
          >
            {/* Sample alerts - these would come from real data */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(90deg, #fef3c7 0%, #fde68a 100%)',
                border: '1.5px solid #fbbf24',
                borderRadius: 12,
                padding: '16px 20px',
                gap: 16,
                boxShadow: '0 2px 8px rgba(251,191,36,0.08)',
              }}
            >
              <img
                src='https://randomuser.me/api/portraits/men/32.jpg'
                alt='avatar'
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  border: '2px solid #fbbf24',
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontWeight: 700, color: '#b45309', fontSize: 15 }}
                >
                  HOS Violation Alert{' '}
                  <span
                    style={{
                      fontWeight: 500,
                      color: '#f59e0b',
                      fontSize: 13,
                      marginLeft: 8,
                    }}
                  >
                    Urgent
                  </span>
                </div>
                <div style={{ color: '#92400e', fontSize: 14 }}>
                  Driver John Smith exceeded daily limit
                </div>
                <div style={{ color: '#b45309', fontSize: 12, marginTop: 2 }}>
                  2 min ago
                </div>
              </div>
              <button
                style={{
                  background: '#fbbf24',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(251,191,36,0.10)',
                  transition: 'background 0.2s',
                }}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom CSS for hover effects */}
      <style jsx>{`
        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
