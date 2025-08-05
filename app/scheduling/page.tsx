'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SchedulingTaskPrioritizationPanel from '../components/SchedulingTaskPrioritizationPanel';

// FMCSA Hours of Service Rules
const FMCSA_RULES = {
  maxDrivingHours: 11, // Maximum driving hours per day
  maxOnDutyHours: 14, // Maximum on-duty hours per day
  requiredRest: 10, // Required rest period
  maxWeeklyDriving: 60, // Maximum driving hours per week
  maxWeeklyOnDuty: 70, // Maximum on-duty hours per week
};

// Mock data and types
interface Schedule {
  id: string;
  title: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Delayed';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  startDate: string;
  startTime: string;
  endTime: string;
  origin?: string;
  destination?: string;
  driverName?: string;
  driverId?: string;
  estimatedHours?: number;
  reason?: string;
  fmcsaCompliant: boolean;
  hoursOfService: {
    drivingHours: number;
    onDutyHours: number;
    restHours: number;
    weeklyDriving: number;
    weeklyOnDuty: number;
  };
}

interface DriverAvailability {
  driverId: string;
  name: string;
  status: 'Available' | 'On Duty' | 'Off Duty' | 'Rest Required';
  currentLoad?: string;
  hoursOfService: {
    drivingHours: number;
    onDutyHours: number;
    restHours: number;
    weeklyDriving: number;
    weeklyOnDuty: number;
  };
  fmcsaStatus: 'Compliant' | 'Warning' | 'Violation';
}

interface VehicleAvailability {
  vehicleId: string;
  name: string;
  status: 'Available' | 'In Use' | 'Maintenance';
  currentDriver?: string;
}

// Mock service
const schedulingService = {
  getSchedules: (filter?: any) => {
    return [
      {
        id: 'SCH001',
        title: 'LA to Phoenix Route - $2,850',
        status: 'Scheduled' as const,
        priority: 'High' as const,
        startDate: '2025-01-15',
        startTime: '08:00',
        endTime: '18:00',
        origin: 'Los Angeles, CA',
        destination: 'Phoenix, AZ',
        driverName: 'Mike Johnson',
        driverId: 'DRV001',
        estimatedHours: 10,
        reason: 'Walmart Distribution - Urgent delivery',
        fmcsaCompliant: true,
        hoursOfService: {
          drivingHours: 8,
          onDutyHours: 10,
          restHours: 14,
          weeklyDriving: 45,
          weeklyOnDuty: 55,
        },
      },
      {
        id: 'SCH002',
        title: 'Dallas to Atlanta - $3,200',
        status: 'In Progress' as const,
        priority: 'Medium' as const,
        startDate: '2025-01-14',
        startTime: '06:00',
        endTime: '20:00',
        origin: 'Dallas, TX',
        destination: 'Atlanta, GA',
        driverName: 'Sarah Williams',
        driverId: 'DRV002',
        estimatedHours: 14,
        reason: 'Home Depot Supply - Regular delivery',
        fmcsaCompliant: false,
        hoursOfService: {
          drivingHours: 12,
          onDutyHours: 14,
          restHours: 10,
          weeklyDriving: 62,
          weeklyOnDuty: 72,
        },
      },
      {
        id: 'SCH003',
        title: 'Chicago to Denver - $2,950',
        status: 'Completed' as const,
        priority: 'Low' as const,
        startDate: '2025-01-13',
        startTime: '07:00',
        endTime: '19:00',
        origin: 'Chicago, IL',
        destination: 'Denver, CO',
        driverName: 'John Davis',
        driverId: 'DRV003',
        estimatedHours: 12,
        reason: 'Amazon Logistics - Standard delivery',
        fmcsaCompliant: true,
        hoursOfService: {
          drivingHours: 10,
          onDutyHours: 12,
          restHours: 12,
          weeklyDriving: 48,
          weeklyOnDuty: 58,
        },
      },
    ];
  },
  getDriverAvailability: () => [
    {
      driverId: 'DRV001',
      name: 'Mike Johnson',
      status: 'Available' as const,
      hoursOfService: {
        drivingHours: 0,
        onDutyHours: 0,
        restHours: 24,
        weeklyDriving: 45,
        weeklyOnDuty: 55,
      },
      fmcsaStatus: 'Compliant' as const,
    },
    {
      driverId: 'DRV002',
      name: 'Sarah Williams',
      status: 'On Duty' as const,
      currentLoad: 'SCH002',
      hoursOfService: {
        drivingHours: 12,
        onDutyHours: 14,
        restHours: 10,
        weeklyDriving: 62,
        weeklyOnDuty: 72,
      },
      fmcsaStatus: 'Violation' as const,
    },
    {
      driverId: 'DRV003',
      name: 'John Davis',
      status: 'Rest Required' as const,
      hoursOfService: {
        drivingHours: 10,
        onDutyHours: 12,
        restHours: 12,
        weeklyDriving: 48,
        weeklyOnDuty: 58,
      },
      fmcsaStatus: 'Warning' as const,
    },
    {
      driverId: 'DRV004',
      name: 'Lisa Chen',
      status: 'Available' as const,
      hoursOfService: {
        drivingHours: 0,
        onDutyHours: 0,
        restHours: 24,
        weeklyDriving: 35,
        weeklyOnDuty: 45,
      },
      fmcsaStatus: 'Compliant' as const,
    },
  ],
  getVehicleAvailability: () => [
    { vehicleId: 'VEH001', name: 'Truck 001', status: 'Available' as const },
    {
      vehicleId: 'VEH002',
      name: 'Truck 002',
      status: 'In Use' as const,
      currentDriver: 'Sarah Williams',
    },
    { vehicleId: 'VEH003', name: 'Truck 003', status: 'Available' as const },
    { vehicleId: 'VEH004', name: 'Truck 004', status: 'Maintenance' as const },
  ],
  getScheduleStatistics: () => ({
    totalSchedules: 45,
    inProgressCount: 12,
    completedCount: 28,
    utilizationRate: 87,
    complianceRate: 94,
    onTimePerformance: 96,
    fmcsaViolations: 3,
    driversAvailable: 8,
    vehiclesAvailable: 12,
  }),
};

type ViewMode = 'list' | 'calendar' | 'timeline' | 'task-priority';

export default function SchedulingDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [drivers, setDrivers] = useState<DriverAvailability[]>([]);
  const [vehicles, setVehicles] = useState<VehicleAvailability[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const allSchedules = schedulingService.getSchedules();
      const driverAvailability = schedulingService.getDriverAvailability();
      const vehicleAvailability = schedulingService.getVehicleAvailability();
      const stats = schedulingService.getScheduleStatistics();

      setSchedules(allSchedules);
      setDrivers(driverAvailability);
      setVehicles(vehicleAvailability);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading scheduling data:', error);
    }
    setLoading(false);
  };

  // Filter schedules based on search term
  const filteredSchedules = schedules.filter((schedule) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      schedule.title.toLowerCase().includes(searchLower) ||
      schedule.driverName?.toLowerCase().includes(searchLower) ||
      schedule.origin?.toLowerCase().includes(searchLower) ||
      schedule.destination?.toLowerCase().includes(searchLower) ||
      schedule.status.toLowerCase().includes(searchLower) ||
      schedule.priority.toLowerCase().includes(searchLower)
    );
  });

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'Scheduled':
        return {
          bg: 'rgba(59, 130, 246, 0.2)',
          text: '#3b82f6',
          border: 'rgba(59, 130, 246, 0.3)',
        };
      case 'In Progress':
        return {
          bg: 'rgba(245, 158, 11, 0.2)',
          text: '#f59e0b',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'Completed':
        return {
          bg: 'rgba(16, 185, 129, 0.2)',
          text: '#10b981',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'Cancelled':
        return {
          bg: 'rgba(239, 68, 68, 0.2)',
          text: '#ef4444',
          border: 'rgba(239, 68, 68, 0.3)',
        };
      case 'Delayed':
        return {
          bg: 'rgba(249, 115, 22, 0.2)',
          text: '#f97316',
          border: 'rgba(249, 115, 22, 0.3)',
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.2)',
          text: '#6b7280',
          border: 'rgba(107, 114, 128, 0.3)',
        };
    }
  };

  const getPriorityColor = (priority: Schedule['priority']) => {
    switch (priority) {
      case 'Low':
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' };
      case 'Medium':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3b82f6' };
      case 'High':
        return { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316' };
      case 'Urgent':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.2)', text: '#6b7280' };
    }
  };

  const getFMCSAStatusColor = (status: DriverAvailability['fmcsaStatus']) => {
    switch (status) {
      case 'Compliant':
        return {
          bg: 'rgba(16, 185, 129, 0.2)',
          text: '#10b981',
          icon: <CheckCircle size={12} />,
        };
      case 'Warning':
        return {
          bg: 'rgba(245, 158, 11, 0.2)',
          text: '#f59e0b',
          icon: <AlertTriangle size={12} />,
        };
      case 'Violation':
        return {
          bg: 'rgba(239, 68, 68, 0.2)',
          text: '#ef4444',
          icon: <XCircle size={12} />,
        };
      default:
        return {
          bg: 'rgba(107, 114, 128, 0.2)',
          text: '#6b7280',
          icon: <AlertTriangle size={12} />,
        };
    }
  };

  const checkFMCSACompliance = (
    driver: DriverAvailability,
    newHours: number
  ) => {
    const totalDriving = driver.hoursOfService.drivingHours + newHours;
    const totalOnDuty = driver.hoursOfService.onDutyHours + newHours;

    return {
      compliant:
        totalDriving <= FMCSA_RULES.maxDrivingHours &&
        totalOnDuty <= FMCSA_RULES.maxOnDutyHours &&
        driver.hoursOfService.weeklyDriving + newHours <=
          FMCSA_RULES.maxWeeklyDriving,
      violations: {
        dailyDriving: totalDriving > FMCSA_RULES.maxDrivingHours,
        dailyOnDuty: totalOnDuty > FMCSA_RULES.maxOnDutyHours,
        weeklyDriving:
          driver.hoursOfService.weeklyDriving + newHours >
          FMCSA_RULES.maxWeeklyDriving,
      },
    };
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e40af)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            color: 'white',
          }}
        >
          <RefreshCw
            style={{
              width: '24px',
              height: '24px',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span style={{ fontSize: '18px', fontWeight: '600' }}>
            Loading scheduling system...
          </span>
        </div>
      </div>
    );
  }

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
        style={{ padding: '0 0 24px 0', maxWidth: '1600px', margin: '0 auto' }}
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

      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        {/* Compact Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '8px',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                📅 SCHEDULE MANAGEMENT
                <span
                  style={{
                    background: 'rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                    fontSize: '12px',
                    padding: '4px 8px',
                    borderRadius: '16px',
                    fontWeight: '600',
                    border: '1px solid rgba(16, 185, 129, 0.5)',
                  }}
                >
                  FMCSA Compliant
                </span>
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.9)',
                  margin: 0,
                }}
              >
                Real-time scheduling with Hours of Service compliance
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => setShowScheduleForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(16, 185, 129, 0.3)';
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                New Schedule
              </button>

              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px rgba(139, 92, 246, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
              >
                <Zap style={{ width: '14px', height: '14px' }} />
                Quick Actions
              </button>

              <button
                onClick={loadData}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
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
                <RefreshCw style={{ width: '14px', height: '14px' }} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Compact KPIs */}
        {statistics && (
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
              }}
            >
              {[
                {
                  icon: '📅',
                  label: 'Total',
                  value: statistics.totalSchedules,
                  color: '#3b82f6',
                  trend: '+12%',
                },
                {
                  icon: '⏳',
                  label: 'In Progress',
                  value: statistics.inProgressCount,
                  color: '#f59e0b',
                  trend: '+5%',
                },
                {
                  icon: '✅',
                  label: 'Completed',
                  value: statistics.completedCount,
                  color: '#10b981',
                  trend: '+18%',
                },
                {
                  icon: '📊',
                  label: 'Utilization',
                  value: `${statistics.utilizationRate}%`,
                  color: '#8b5cf6',
                  trend: '+3%',
                },
                {
                  icon: '🛡️',
                  label: 'FMCSA Compliant',
                  value: `${statistics.complianceRate}%`,
                  color: '#06b6d4',
                  trend: '+2%',
                },
                {
                  icon: '⚠️',
                  label: 'Violations',
                  value: statistics.fmcsaViolations,
                  color: '#ef4444',
                  trend: '-1',
                },
                {
                  icon: '👥',
                  label: 'Drivers Available',
                  value: statistics.driversAvailable,
                  color: '#10b981',
                  trend: '+2',
                },
                {
                  icon: '🚛',
                  label: 'Vehicles Available',
                  value: statistics.vehiclesAvailable,
                  color: '#3b82f6',
                  trend: '+1',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 16px rgba(0,0,0,0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div
                    style={{
                      background: stat.color,
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      padding: '8px',
                      marginBottom: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        opacity: 0.9,
                        marginBottom: '2px',
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div style={{ fontSize: '18px' }}>{stat.value}</div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontSize: '8px',
                        padding: '1px 4px',
                        borderRadius: '6px',
                        fontWeight: '600',
                      }}
                    >
                      {stat.trend}
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#374151',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '300px 1fr',
            gap: '20px',
          }}
        >
          {/* Left Panel - Controls and Driver Status */}
          <div>
            {/* View Mode Controls */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Filter style={{ width: '16px', height: '16px' }} />
                View Mode
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px',
                  background: '#f3f4f6',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                {['list', 'calendar', 'timeline', 'task-priority'].map(
                  (mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as ViewMode)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: viewMode === mode ? 'white' : 'transparent',
                        color: viewMode === mode ? '#2563eb' : '#6b7280',
                        boxShadow:
                          viewMode === mode
                            ? '0 1px 3px rgba(0,0,0,0.1)'
                            : 'none',
                      }}
                    >
                      {mode}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Enhanced Schedule Overview Dashboard */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📊 Schedule Overview & Analytics
              </h3>

              {/* Key Metrics Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '8px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>
                    {schedules.length}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>
                    Total Schedules
                  </div>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>
                    {schedules.filter((s) => s.status === 'In Progress').length}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>Active</div>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>
                    $
                    {schedules
                      .reduce(
                        (sum, s) =>
                          sum + (s.estimatedHours ? s.estimatedHours * 50 : 0),
                        0
                      )
                      .toFixed(0)}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>Revenue</div>
                </div>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '600' }}>
                    {schedules.filter((s) => !s.fmcsaCompliant).length}
                  </div>
                  <div style={{ fontSize: '9px', opacity: 0.9 }}>
                    Violations
                  </div>
                </div>
              </div>

              {/* FMCSA Compliance Summary */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '8px',
                  marginBottom: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      color: '#374151',
                    }}
                  >
                    FMCSA Compliance Rules
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    {
                      drivers.filter((d) => d.fmcsaStatus === 'Compliant')
                        .length
                    }
                    /{drivers.length} Compliant
                  </span>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '4px',
                    fontSize: '9px',
                    color: '#6b7280',
                  }}
                >
                  <div>• Max Driving: {FMCSA_RULES.maxDrivingHours}h/day</div>
                  <div>• Max On-Duty: {FMCSA_RULES.maxOnDutyHours}h/day</div>
                  <div>• Required Rest: {FMCSA_RULES.requiredRest}h</div>
                  <div>• Max Weekly: {FMCSA_RULES.maxWeeklyDriving}h</div>
                </div>
              </div>

              {/* Driver Status Overview */}
              <div style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Driver Status & Hours
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  {drivers.map((driver) => {
                    const fmcsaColor = getFMCSAStatusColor(driver.fmcsaStatus);
                    const drivingProgress =
                      (driver.hoursOfService.drivingHours /
                        FMCSA_RULES.maxDrivingHours) *
                      100;
                    const onDutyProgress =
                      (driver.hoursOfService.onDutyHours /
                        FMCSA_RULES.maxOnDutyHours) *
                      100;

                    return (
                      <div
                        key={driver.driverId}
                        style={{
                          background: '#f9fafb',
                          border: '1px solid #e5e7eb',
                          borderRadius: '4px',
                          padding: '6px',
                          transition: 'all 0.2s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = '#f3f4f6';
                          e.currentTarget.style.transform = 'translateX(2px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = '#f9fafb';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '4px',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '10px',
                              fontWeight: '600',
                              color: '#111827',
                            }}
                          >
                            {driver.name}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2px',
                              fontSize: '8px',
                              padding: '1px 4px',
                              borderRadius: '6px',
                              background: fmcsaColor.bg,
                              color: fmcsaColor.text,
                              fontWeight: '600',
                            }}
                          >
                            {fmcsaColor.icon}
                            {driver.fmcsaStatus}
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div style={{ marginBottom: '3px' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '8px',
                              color: '#6b7280',
                              marginBottom: '1px',
                            }}
                          >
                            <span>
                              Driving: {driver.hoursOfService.drivingHours}h
                            </span>
                            <span>{FMCSA_RULES.maxDrivingHours}h max</span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '3px',
                              background: '#e5e7eb',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(drivingProgress, 100)}%`,
                                height: '100%',
                                background:
                                  drivingProgress > 90
                                    ? '#ef4444'
                                    : drivingProgress > 75
                                      ? '#f59e0b'
                                      : '#10b981',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              fontSize: '8px',
                              color: '#6b7280',
                              marginBottom: '1px',
                            }}
                          >
                            <span>
                              On-Duty: {driver.hoursOfService.onDutyHours}h
                            </span>
                            <span>{FMCSA_RULES.maxOnDutyHours}h max</span>
                          </div>
                          <div
                            style={{
                              width: '100%',
                              height: '3px',
                              background: '#e5e7eb',
                              borderRadius: '2px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${Math.min(onDutyProgress, 100)}%`,
                                height: '100%',
                                background:
                                  onDutyProgress > 90
                                    ? '#ef4444'
                                    : onDutyProgress > 75
                                      ? '#f59e0b'
                                      : '#3b82f6',
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            fontSize: '8px',
                            color: '#6b7280',
                            marginTop: '3px',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span>
                            Weekly: {driver.hoursOfService.weeklyDriving}h
                            driving
                          </span>
                          <span>Rest: {driver.hoursOfService.restHours}h</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: '#f0f9ff',
                  border: '1px solid #bae6fd',
                  borderRadius: '6px',
                  padding: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#0369a1',
                    marginBottom: '4px',
                  }}
                >
                  Quick Actions
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '4px',
                  }}
                >
                  <button
                    style={{
                      background: 'white',
                      border: '1px solid #bae6fd',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      fontSize: '8px',
                      color: '#0369a1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f0f9ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    View Violations
                  </button>
                  <button
                    style={{
                      background: 'white',
                      border: '1px solid #bae6fd',
                      borderRadius: '4px',
                      padding: '4px 6px',
                      fontSize: '8px',
                      color: '#0369a1',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f0f9ff';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    Optimize Routes
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div>
            {viewMode === 'list' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {/* Enhanced Schedule List */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      style={{
                        background: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '16px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(0,0,0,0.1)';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.borderColor = '#e5e7eb';
                      }}
                      onClick={() => setSelectedSchedule(schedule)}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                          gap: '12px',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              marginBottom: '4px',
                            }}
                          >
                            <h4
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#111827',
                                margin: 0,
                              }}
                            >
                              {schedule.title}
                            </h4>
                            <span
                              style={{
                                ...getStatusColor(schedule.status),
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                              }}
                            >
                              {schedule.status}
                            </span>
                            <span
                              style={{
                                ...getPriorityColor(schedule.priority),
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '9px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                              }}
                            >
                              {schedule.priority}
                            </span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              fontSize: '11px',
                              color: '#6b7280',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                            >
                              <Clock
                                style={{ width: '10px', height: '10px' }}
                              />
                              {schedule.startTime} - {schedule.endTime}
                            </span>
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                            >
                              <Users
                                style={{ width: '10px', height: '10px' }}
                              />
                              {schedule.driverName || 'Unassigned'}
                            </span>
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                              }}
                            >
                              {schedule.fmcsaCompliant ? (
                                <CheckCircle
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    color: '#10b981',
                                  }}
                                />
                              ) : (
                                <XCircle
                                  style={{
                                    width: '10px',
                                    height: '10px',
                                    color: '#ef4444',
                                  }}
                                />
                              )}
                              FMCSA{' '}
                              {schedule.fmcsaCompliant
                                ? 'Compliant'
                                : 'Violation'}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#6b7280',
                              marginTop: '4px',
                            }}
                          >
                            <strong>Reason:</strong> {schedule.reason}
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#111827',
                            }}
                          >
                            {schedule.startDate}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>
                            {schedule.estimatedHours}h duration
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#10b981',
                            }}
                          >
                            $
                            {schedule.estimatedHours
                              ? (schedule.estimatedHours * 50).toFixed(0)
                              : 'N/A'}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>
                            Cost
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#3b82f6',
                            }}
                          >
                            {schedule.hoursOfService.drivingHours}h
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280' }}>
                            Driving
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button
                            style={{
                              padding: '4px',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#f3f4f6';
                            }}
                          >
                            <Eye
                              style={{
                                width: '12px',
                                height: '12px',
                                color: '#6b7280',
                              }}
                            />
                          </button>
                          <button
                            style={{
                              padding: '4px',
                              background: '#f3f4f6',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.background = '#e5e7eb';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.background = '#f3f4f6';
                            }}
                          >
                            <Edit
                              style={{
                                width: '12px',
                                height: '12px',
                                color: '#6b7280',
                              }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'calendar' && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                  }}
                >
                  📅 Excel-like Calendar View
                </h3>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '16px',
                    fontSize: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px repeat(7, 1fr)',
                      gap: '1px',
                      background: '#e2e8f0',
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        background: '#f1f5f9',
                        padding: '8px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      Driver
                    </div>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                      (day) => (
                        <div
                          key={day}
                          style={{
                            background: '#f1f5f9',
                            padding: '8px',
                            fontWeight: '600',
                            textAlign: 'center',
                          }}
                        >
                          {day}
                        </div>
                      )
                    )}

                    {/* Driver Rows */}
                    {drivers.map((driver) => (
                      <React.Fragment key={driver.driverId}>
                        <div
                          style={{
                            background: 'white',
                            padding: '8px',
                            fontWeight: '600',
                            borderRight: '1px solid #e2e8f0',
                            fontSize: '11px',
                          }}
                        >
                          {driver.name}
                          <div
                            style={{
                              fontSize: '9px',
                              color: '#6b7280',
                              fontWeight: 'normal',
                            }}
                          >
                            {driver.hoursOfService.drivingHours}h driving
                          </div>
                        </div>
                        {Array.from({ length: 7 }, (_, i) => {
                          const daySchedules = schedules.filter(
                            (s) =>
                              s.driverId === driver.driverId &&
                              new Date(s.startDate).getDay() === (i + 1) % 7
                          );
                          return (
                            <div
                              key={i}
                              style={{
                                background: 'white',
                                padding: '4px',
                                minHeight: '40px',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              {daySchedules.map((schedule) => (
                                <div
                                  key={schedule.id}
                                  style={{
                                    background: schedule.fmcsaCompliant
                                      ? '#dcfce7'
                                      : '#fee2e2',
                                    border: `1px solid ${schedule.fmcsaCompliant ? '#10b981' : '#ef4444'}`,
                                    borderRadius: '4px',
                                    padding: '2px 4px',
                                    marginBottom: '2px',
                                    fontSize: '9px',
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => setSelectedSchedule(schedule)}
                                >
                                  <div style={{ fontWeight: '600' }}>
                                    {schedule.title}
                                  </div>
                                  <div
                                    style={{
                                      fontSize: '8px',
                                      color: '#6b7280',
                                    }}
                                  >
                                    {schedule.startTime}-{schedule.endTime}
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'timeline' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  📅 Schedule Timeline View
                </h2>

                {/* Timeline Container */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '16px',
                    padding: '24px',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Timeline Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          color: 'white',
                          fontSize: '18px',
                          fontWeight: '600',
                          margin: 0,
                        }}
                      >
                        Daily Schedule Timeline
                      </h3>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '14px',
                          margin: '4px 0 0 0',
                        }}
                      >
                        Chronological view of all scheduled activities
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '12px',
                        }}
                      >
                        Filter by:
                      </span>
                      <select
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: '6px',
                          color: 'white',
                          padding: '4px 8px',
                          fontSize: '12px',
                        }}
                        onChange={(e) => {
                          // Could implement timeline filtering here
                        }}
                      >
                        <option value='all'>All Activities</option>
                        <option value='high'>High Priority</option>
                        <option value='urgent'>Urgent Only</option>
                        <option value='today'>Today Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Timeline Content */}
                  <div style={{ position: 'relative' }}>
                    {/* Timeline Line */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '20px',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        background:
                          'linear-gradient(to bottom, #3b82f6, #1e40af)',
                        borderRadius: '1px',
                      }}
                    />

                    {/* Timeline Items */}
                    {filteredSchedules
                      .sort((a, b) => {
                        const dateA = new Date(`${a.startDate} ${a.startTime}`);
                        const dateB = new Date(`${b.startDate} ${b.startTime}`);
                        return dateA.getTime() - dateB.getTime();
                      })
                      .map((schedule, index) => {
                        const statusColor = {
                          Scheduled: '#3b82f6',
                          'In Progress': '#f59e0b',
                          Completed: '#10b981',
                          Cancelled: '#ef4444',
                          Delayed: '#f97316',
                        }[schedule.status];

                        const priorityColor = {
                          Low: '#6b7280',
                          Medium: '#f59e0b',
                          High: '#f97316',
                          Urgent: '#ef4444',
                        }[schedule.priority];

                        return (
                          <div
                            key={schedule.id}
                            style={{
                              position: 'relative',
                              marginLeft: '50px',
                              marginBottom: '24px',
                              paddingLeft: '20px',
                            }}
                          >
                            {/* Timeline Dot */}
                            <div
                              style={{
                                position: 'absolute',
                                left: '-35px',
                                top: '8px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: statusColor,
                                border: '3px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: `0 0 10px ${statusColor}40`,
                              }}
                            />

                            {/* Timeline Card */}
                            <div
                              style={{
                                background: 'rgba(255, 255, 255, 0.08)',
                                borderRadius: '12px',
                                padding: '16px',
                                border: `1px solid ${statusColor}40`,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                              }}
                              onClick={() => setSelectedSchedule(schedule)}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background =
                                  'rgba(255, 255, 255, 0.12)';
                                e.currentTarget.style.transform =
                                  'translateX(4px)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background =
                                  'rgba(255, 255, 255, 0.08)';
                                e.currentTarget.style.transform =
                                  'translateX(0)';
                              }}
                            >
                              {/* Card Header */}
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  marginBottom: '12px',
                                }}
                              >
                                <div>
                                  <h4
                                    style={{
                                      color: 'white',
                                      fontSize: '16px',
                                      fontWeight: '600',
                                      margin: '0 0 4px 0',
                                    }}
                                  >
                                    {schedule.title}
                                  </h4>
                                  <div
                                    style={{
                                      display: 'flex',
                                      gap: '8px',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <span
                                      style={{
                                        background: statusColor,
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {schedule.status}
                                    </span>
                                    <span
                                      style={{
                                        background: priorityColor,
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                      }}
                                    >
                                      {schedule.priority}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div
                                    style={{
                                      color: 'white',
                                      fontSize: '14px',
                                      fontWeight: '600',
                                    }}
                                  >
                                    {schedule.startTime} - {schedule.endTime}
                                  </div>
                                  <div
                                    style={{
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      fontSize: '12px',
                                    }}
                                  >
                                    {new Date(
                                      schedule.startDate
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              {/* Card Content */}
                              <div
                                style={{
                                  display: 'flex',
                                  gap: '16px',
                                  marginBottom: '12px',
                                }}
                              >
                                <div style={{ flex: 1 }}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      marginBottom: '4px',
                                    }}
                                  >
                                    <span style={{ fontSize: '12px' }}>🚛</span>
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '13px',
                                      }}
                                    >
                                      {schedule.driverName || 'Unassigned'}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}
                                  >
                                    <span style={{ fontSize: '12px' }}>📍</span>
                                    <span
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '12px',
                                      }}
                                    >
                                      {schedule.origin} → {schedule.destination}
                                    </span>
                                  </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <div
                                    style={{
                                      color: schedule.fmcsaCompliant
                                        ? '#10b981'
                                        : '#ef4444',
                                      fontSize: '12px',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {schedule.fmcsaCompliant
                                      ? '✅ HOS Compliant'
                                      : '⚠️ HOS Warning'}
                                  </div>
                                  {schedule.estimatedHours && (
                                    <div
                                      style={{
                                        color: 'rgba(255, 255, 255, 0.6)',
                                        fontSize: '11px',
                                      }}
                                    >
                                      Est. {schedule.estimatedHours}h
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Card Footer */}
                              {schedule.reason && (
                                <div
                                  style={{
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    fontSize: '12px',
                                    fontStyle: 'italic',
                                    borderTop:
                                      '1px solid rgba(255, 255, 255, 0.1)',
                                    paddingTop: '8px',
                                  }}
                                >
                                  {schedule.reason}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Timeline Summary */}
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(150px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#3b82f6',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          filteredSchedules.filter(
                            (s) => s.status === 'Scheduled'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Scheduled
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          filteredSchedules.filter(
                            (s) => s.status === 'In Progress'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        In Progress
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#10b981',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          filteredSchedules.filter(
                            (s) => s.status === 'Completed'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Completed
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          color: '#ef4444',
                          fontSize: '24px',
                          fontWeight: 'bold',
                        }}
                      >
                        {
                          filteredSchedules.filter(
                            (s) => s.priority === 'Urgent'
                          ).length
                        }
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        Urgent
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'task-priority' && (
              <div>
                <h2
                  style={{
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    marginBottom: '15px',
                  }}
                >
                  🎯 AI-Powered Scheduling Task Prioritization
                </h2>
                <SchedulingTaskPrioritizationPanel />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Detail Modal */}
      {selectedSchedule && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => setSelectedSchedule(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                borderBottom: '2px solid #f3f4f6',
                paddingBottom: '16px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  📋 {selectedSchedule.title}
                  <span
                    style={{
                      ...getStatusColor(selectedSchedule.status),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedSchedule.status}
                  </span>
                  <span
                    style={{
                      ...getPriorityColor(selectedSchedule.priority),
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                    }}
                  >
                    {selectedSchedule.priority}
                  </span>
                </h2>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                  Schedule ID: {selectedSchedule.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedSchedule(null)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#e5e7eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#f3f4f6';
                }}
              >
                <XCircle
                  style={{ width: '20px', height: '20px', color: '#6b7280' }}
                />
              </button>
            </div>

            {/* Modal Content */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '24px',
              }}
            >
              {/* Left Column - Basic Info */}
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                  }}
                >
                  📍 Route Information
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#10b981',
                          borderRadius: '50%',
                        }}
                      ></div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Origin:
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        margin: 0,
                        paddingLeft: '16px',
                      }}
                    >
                      {selectedSchedule.origin || 'Not specified'}
                    </p>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          background: '#ef4444',
                          borderRadius: '50%',
                        }}
                      ></div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Destination:
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        margin: 0,
                        paddingLeft: '16px',
                      }}
                    >
                      {selectedSchedule.destination || 'Not specified'}
                    </p>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <Clock
                        style={{
                          width: '16px',
                          height: '16px',
                          color: '#6b7280',
                        }}
                      />
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Schedule:
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        margin: 0,
                        paddingLeft: '24px',
                      }}
                    >
                      {selectedSchedule.startDate} •{' '}
                      {selectedSchedule.startTime} - {selectedSchedule.endTime}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: '4px 0 0 24px',
                      }}
                    >
                      Duration: {selectedSchedule.estimatedHours} hours
                    </p>
                  </div>

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <Users
                        style={{
                          width: '16px',
                          height: '16px',
                          color: '#6b7280',
                        }}
                      />
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Assigned Driver:
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        margin: 0,
                        paddingLeft: '24px',
                      }}
                    >
                      {selectedSchedule.driverName || 'Unassigned'}
                    </p>
                    {selectedSchedule.driverId && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '4px 0 0 24px',
                        }}
                      >
                        Driver ID: {selectedSchedule.driverId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - FMCSA & Financial */}
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '16px',
                  }}
                >
                  ⚖️ FMCSA Compliance & Financial
                </h3>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {/* FMCSA Status */}
                  <div
                    style={{
                      background: selectedSchedule.fmcsaCompliant
                        ? '#f0fdf4'
                        : '#fef2f2',
                      padding: '16px',
                      borderRadius: '8px',
                      border: `1px solid ${selectedSchedule.fmcsaCompliant ? '#10b981' : '#ef4444'}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      {selectedSchedule.fmcsaCompliant ? (
                        <CheckCircle
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#10b981',
                          }}
                        />
                      ) : (
                        <XCircle
                          style={{
                            width: '16px',
                            height: '16px',
                            color: '#ef4444',
                          }}
                        />
                      )}
                      <strong
                        style={{
                          fontSize: '14px',
                          color: selectedSchedule.fmcsaCompliant
                            ? '#10b981'
                            : '#ef4444',
                        }}
                      >
                        FMCSA{' '}
                        {selectedSchedule.fmcsaCompliant
                          ? 'Compliant'
                          : 'Violation'}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <span style={{ color: '#6b7280' }}>Driving Hours:</span>
                        <span
                          style={{
                            color:
                              selectedSchedule.hoursOfService.drivingHours > 11
                                ? '#ef4444'
                                : '#10b981',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          {selectedSchedule.hoursOfService.drivingHours}h
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>On-Duty Hours:</span>
                        <span
                          style={{
                            color:
                              selectedSchedule.hoursOfService.onDutyHours > 14
                                ? '#ef4444'
                                : '#10b981',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          {selectedSchedule.hoursOfService.onDutyHours}h
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>Rest Hours:</span>
                        <span
                          style={{
                            color:
                              selectedSchedule.hoursOfService.restHours < 10
                                ? '#ef4444'
                                : '#10b981',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          {selectedSchedule.hoursOfService.restHours}h
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>
                          Weekly Driving:
                        </span>
                        <span
                          style={{
                            color:
                              selectedSchedule.hoursOfService.weeklyDriving > 60
                                ? '#ef4444'
                                : '#10b981',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          {selectedSchedule.hoursOfService.weeklyDriving}h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Information */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '12px',
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>💰</div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Financial Details
                      </strong>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <span style={{ color: '#6b7280' }}>
                          Total Load Revenue:
                        </span>
                        <span
                          style={{
                            color: '#10b981',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          $
                          {(() => {
                            // Calculate total revenue from all loads
                            const totalRevenue = schedules.reduce(
                              (sum, schedule) => {
                                // Extract rate from schedule title or use default
                                const rateMatch =
                                  schedule.title.match(/\$(\d+)/);
                                const rate = rateMatch
                                  ? parseInt(rateMatch[1])
                                  : 2850; // Default rate
                                return sum + rate;
                              },
                              0
                            );
                            return totalRevenue.toLocaleString();
                          })()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>
                          Avg Rate per Hour:
                        </span>
                        <span
                          style={{
                            color: '#3b82f6',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          $
                          {(() => {
                            // Calculate average rate per hour across all schedules
                            const totalHours = schedules.reduce(
                              (sum, schedule) =>
                                sum + (schedule.estimatedHours || 0),
                              0
                            );
                            const totalRevenue = schedules.reduce(
                              (sum, schedule) => {
                                const rateMatch =
                                  schedule.title.match(/\$(\d+)/);
                                const rate = rateMatch
                                  ? parseInt(rateMatch[1])
                                  : 2850;
                                return sum + rate;
                              },
                              0
                            );
                            return totalHours > 0
                              ? (totalRevenue / totalHours).toFixed(0)
                              : 'N/A';
                          })()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>
                          Schedule Revenue:
                        </span>
                        <span
                          style={{
                            color: '#f59e0b',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          $
                          {(() => {
                            const rateMatch =
                              selectedSchedule.title.match(/\$(\d+)/);
                            const rate = rateMatch
                              ? parseInt(rateMatch[1])
                              : 2850;
                            return rate.toLocaleString();
                          })()}
                        </span>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>
                          Hours Scheduled:
                        </span>
                        <span
                          style={{
                            color: '#8b5cf6',
                            fontWeight: '600',
                            marginLeft: '8px',
                          }}
                        >
                          {selectedSchedule.estimatedHours || 0}h
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reason */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>📝</div>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>
                        Reason:
                      </strong>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        color: '#374151',
                        margin: 0,
                        paddingLeft: '24px',
                      }}
                    >
                      {selectedSchedule.reason || 'No reason specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '2px solid #f3f4f6',
              }}
            >
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(59, 130, 246, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ✏️ Edit Schedule
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(16, 185, 129, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                📊 View Analytics
              </button>
              <button
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(245, 158, 11, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                onClick={() => {
                  // Close the modal first
                  setSelectedSchedule(null);
                  // Navigate to tracking page with driver info
                  const driverId = selectedSchedule?.driverId || '';
                  const driverName = selectedSchedule?.driverName || '';
                  const scheduleId = selectedSchedule?.id || '';

                  // Store tracking info in sessionStorage for the tracking page
                  sessionStorage.setItem(
                    'trackingInfo',
                    JSON.stringify({
                      driverId,
                      driverName,
                      scheduleId,
                      origin: selectedSchedule?.origin,
                      destination: selectedSchedule?.destination,
                      status: selectedSchedule?.status,
                      startTime: selectedSchedule?.startTime,
                      endTime: selectedSchedule?.endTime,
                    })
                  );

                  // Navigate to tracking page
                  window.location.href = '/tracking';
                }}
              >
                📱 Track Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
