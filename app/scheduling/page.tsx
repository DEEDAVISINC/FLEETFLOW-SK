'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar,
  Clock,
  Users,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  BarChart3,
  MapPin,
  Settings,
  Bell,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { schedulingService } from './service';
import { 
  Schedule, 
  ScheduleFilter, 
  ScheduleStatistics,
  DriverAvailability,
  VehicleAvailability
} from './types';

type ViewMode = 'list' | 'weekly' | 'calendar';

export default function SchedulingDashboard() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [drivers, setDrivers] = useState<DriverAvailability[]>([]);
  const [vehicles, setVehicles] = useState<VehicleAvailability[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [filter, setFilter] = useState<ScheduleFilter>({});
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filteredSchedules = schedulingService.getSchedules({
      ...filter,
      searchTerm
    });
    setSchedules(filteredSchedules);
  }, [filter, searchTerm]);

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

  const handleCreateSchedule = async (scheduleData: Partial<Schedule>) => {
    const result = await schedulingService.createSchedule(scheduleData);
    if (result.success) {
      await loadData();
      setShowScheduleForm(false);
      setSelectedSchedule(result.schedule || null);
    }
    return result;
  };

  const handleUpdateSchedule = async (id: string, updates: Partial<Schedule>) => {
    const result = await schedulingService.updateSchedule(id, updates);
    if (result.success) {
      await loadData();
      setSelectedSchedule(result.schedule || null);
    }
    return result;
  };

  const handleDeleteSchedule = async (id: string) => {
    const success = await schedulingService.deleteSchedule(id);
    if (success) {
      await loadData();
      if (selectedSchedule?.id === id) {
        setSelectedSchedule(null);
      }
    }
    return success;
  };

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'Scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Cancelled':
        return 'text-red-600 bg-red-100';
      case 'Delayed':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: Schedule['priority']) => {
    switch (priority) {
      case 'Low':
        return 'text-gray-600';
      case 'Medium':
        return 'text-blue-600';
      case 'High':
        return 'text-orange-600';
      case 'Urgent':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading scheduling system...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #1e40af)',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '12px',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                📅 SCHEDULE MANAGEMENT
              </h1>
              <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>
                Comprehensive schedule management with driver and vehicle integration
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link href="/drivers" style={{ textDecoration: 'none' }}>
                <button style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}>
                  <Users style={{ width: '16px', height: '16px' }} />
                  Driver Management
                </button>
              </Link>
              
              <button
                onClick={() => setShowScheduleForm(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
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
                <Plus style={{ width: '16px', height: '16px' }} />
                New Schedule
              </button>
              
              <button
                onClick={loadData}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
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
                <RefreshCw style={{ width: '16px', height: '16px' }} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {statistics && (
        <div style={{ maxWidth: '1400px', margin: '0 auto 32px auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {[
              { icon: '📅', label: 'Total Schedules', value: statistics.totalSchedules, color: '#3b82f6' },
              { icon: '⏳', label: 'In Progress', value: statistics.inProgressCount, color: '#f59e0b' },
              { icon: '✅', label: 'Completed', value: statistics.completedCount, color: '#10b981' },
              { icon: '📊', label: 'Utilization', value: `${statistics.utilizationRate.toFixed(0)}%`, color: '#8b5cf6' },
              { icon: '🛡️', label: 'Compliance', value: `${statistics.complianceRate.toFixed(0)}%`, color: '#06b6d4' },
              { icon: '⏰', label: 'On Time', value: `${statistics.onTimePerformance.toFixed(0)}%`, color: '#f97316' }
            ].map((stat, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}>
                <div style={{
                  background: stat.color,
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '16px', opacity: 0.9, marginBottom: '4px' }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: '28px' }}>{stat.value}</div>
                </div>
                <div style={{ color: '#374151', fontSize: '14px', fontWeight: '600' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '24px' }}>
          {/* Left Panel - Controls and Filters */}
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Filter style={{ width: '20px', height: '20px' }} />
                Filters & Controls
              </h3>
              
              {/* Search */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ position: 'relative' }}>
                  <Search style={{
                    width: '16px',
                    height: '16px',
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6b7280'
                  }} />
                  <input
                    type="text"
                    placeholder="Search schedules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '10px',
                      paddingBottom: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* View Mode */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  View Mode
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '4px',
                  background: '#f3f4f6',
                  padding: '4px',
                  borderRadius: '8px'
                }}>
                  {['list', 'weekly', 'calendar'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as ViewMode)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: viewMode === mode ? 'white' : 'transparent',
                        color: viewMode === mode ? '#2563eb' : '#6b7280',
                        boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilter({});
                  setSearchTerm('');
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                  color: '#374151',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #e5e7eb, #d1d5db)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6, #e5e7eb)';
                }}
              >
                Clear All Filters
              </button>
            </div>

            {/* Resource Availability Panel */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users style={{ width: '20px', height: '20px' }} />
                Resource Status
              </h3>
              
              {/* Drivers */}
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>Drivers</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {drivers.slice(0, 3).map((driver) => (
                    <div key={driver.driverId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      background: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{driver.name}</span>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: driver.status === 'Available' ? '#dcfce7' : 
                                   driver.status === 'On Duty' ? '#dbeafe' : '#f3f4f6',
                        color: driver.status === 'Available' ? '#166534' :
                               driver.status === 'On Duty' ? '#1e40af' : '#374151'
                      }}>
                        {driver.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>Vehicles</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.vehicleId} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px',
                      background: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <span style={{ fontSize: '14px', fontWeight: '600' }}>{vehicle.name}</span>
                      <span style={{
                        fontSize: '12px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: vehicle.status === 'Available' ? '#dcfce7' :
                                   vehicle.status === 'In Use' ? '#dbeafe' : '#fee2e2',
                        color: vehicle.status === 'Available' ? '#166534' :
                               vehicle.status === 'In Use' ? '#1e40af' : '#dc2626'
                      }}>
                        {vehicle.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                padding: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>
                  Schedule Management
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Manage and monitor all schedules with driver/vehicle integration
                </p>
              </div>
              
              <div>
                {schedules.length === 0 ? (
                  <div style={{
                    padding: '32px',
                    textAlign: 'center'
                  }}>
                    <Calendar style={{
                      width: '48px',
                      height: '48px',
                      color: '#9ca3af',
                      margin: '0 auto 16px auto'
                    }} />
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0 0 8px 0'
                    }}>
                      No schedules found
                    </h3>
                    <p style={{
                      color: '#6b7280',
                      marginBottom: '16px'
                    }}>
                      Create your first schedule to get started
                    </p>
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                      }}
                    >
                      Create Schedule
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {schedules.map((schedule) => (
                      <div 
                        key={schedule.id} 
                        style={{
                          padding: '24px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'rgba(249, 250, 251, 0.5)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '12px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}>
                            <h3 style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#111827',
                              margin: 0
                            }}>
                              {schedule.title}
                            </h3>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: schedule.status === 'Scheduled' ? '#dbeafe' : 
                                         schedule.status === 'In Progress' ? '#fef3c7' :
                                         schedule.status === 'Completed' ? '#dcfce7' :
                                         schedule.status === 'Cancelled' ? '#fee2e2' : '#f3f4f6',
                              color: schedule.status === 'Scheduled' ? '#1e40af' :
                                     schedule.status === 'In Progress' ? '#a16207' :
                                     schedule.status === 'Completed' ? '#166534' :
                                     schedule.status === 'Cancelled' ? '#dc2626' : '#374151'
                            }}>
                              {schedule.status}
                            </span>
                            <span style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: schedule.priority === 'Low' ? '#6b7280' :
                                     schedule.priority === 'Medium' ? '#2563eb' :
                                     schedule.priority === 'High' ? '#f59e0b' :
                                     schedule.priority === 'Urgent' ? '#dc2626' : '#6b7280'
                            }}>
                              {schedule.priority}
                            </span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            <button
                              onClick={() => {
                                setSelectedSchedule(schedule);
                                setShowScheduleForm(true);
                              }}
                              style={{
                                color: '#2563eb',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#dbeafe';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'none';
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              style={{
                                color: '#dc2626',
                                fontSize: '14px',
                                fontWeight: '600',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#fee2e2';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = 'none';
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '16px',
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          <div>
                            <p style={{ margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: '600' }}>Date:</span> {schedule.startDate}
                            </p>
                            <p style={{ margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: '600' }}>Time:</span> {schedule.startTime} - {schedule.endTime}
                            </p>
                            <p style={{ margin: 0 }}>
                              <span style={{ fontWeight: '600' }}>Type:</span> {schedule.scheduleType}
                            </p>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: '600' }}>Driver:</span> {schedule.driverName || 'Not assigned'}
                            </p>
                            <p style={{ margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: '600' }}>Vehicle:</span> {schedule.vehicleName || 'Not assigned'}
                            </p>
                            <p style={{ margin: 0 }}>
                              <span style={{ fontWeight: '600' }}>Duration:</span> {schedule.estimatedHours || 'N/A'} hours
                            </p>
                          </div>
                          <div>
                            <p style={{ margin: '0 0 4px 0' }}>
                              <span style={{ fontWeight: '600' }}>Route:</span> {schedule.origin && schedule.destination ? `${schedule.origin} → ${schedule.destination}` : 'No route specified'}
                            </p>
                            <p style={{ margin: '0 0 8px 0' }}>
                              <span style={{ fontWeight: '600' }}>Distance:</span> {schedule.estimatedDistance || 'N/A'} miles
                            </p>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              {schedule.hosCompliance !== false && (
                                <span style={{
                                  color: '#166534',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                  HOS
                                </span>
                              )}
                              {schedule.licenseVerified !== false && (
                                <span style={{
                                  color: '#166534',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                  License
                                </span>
                              )}
                              {schedule.vehicleInspectionCurrent !== false && (
                                <span style={{
                                  color: '#166534',
                                  fontSize: '12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <CheckCircle style={{ width: '12px', height: '12px' }} />
                                  Inspection
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {schedule.description && (
                          <p style={{
                            marginTop: '12px',
                            fontSize: '14px',
                            color: '#6b7280'
                          }}>
                            {schedule.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 50
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: 0
              }}>
                {selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>
            </div>
            
            <div style={{ padding: '24px' }}>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const scheduleData = {
                  title: formData.get('title') as string,
                  description: formData.get('description') as string,
                  startDate: formData.get('startDate') as string,
                  endDate: formData.get('endDate') as string,
                  startTime: formData.get('startTime') as string,
                  endTime: formData.get('endTime') as string,
                  priority: formData.get('priority') as Schedule['priority'],
                  scheduleType: formData.get('scheduleType') as Schedule['scheduleType'],
                  assignedDriverId: formData.get('assignedDriverId') as string,
                  assignedVehicleId: formData.get('assignedVehicleId') as string,
                  origin: formData.get('origin') as string,
                  destination: formData.get('destination') as string,
                };
                
                if (selectedSchedule) {
                  handleUpdateSchedule(selectedSchedule.id, scheduleData);
                } else {
                  handleCreateSchedule(scheduleData);
                }
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      required
                      defaultValue={selectedSchedule?.title || ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows={3}
                      defaultValue={selectedSchedule?.description || ''}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        outline: 'none',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      required
                      defaultValue={selectedSchedule?.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      required
                      defaultValue={selectedSchedule?.endDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      required
                      defaultValue={selectedSchedule?.startTime || '09:00'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      required
                      defaultValue={selectedSchedule?.endTime || '17:00'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      defaultValue={selectedSchedule?.priority || 'Medium'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Schedule Type
                    </label>
                    <select
                      name="scheduleType"
                      defaultValue={selectedSchedule?.scheduleType || 'Other'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Delivery">Delivery</option>
                      <option value="Pickup">Pickup</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Training">Training</option>
                      <option value="Inspection">Inspection</option>
                      <option value="Break">Break</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Driver
                    </label>
                    <select
                      name="assignedDriverId"
                      defaultValue={selectedSchedule?.assignedDriverId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.driverId} value={driver.driverId}>
                          {driver.name} ({driver.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Assigned Vehicle
                    </label>
                    <select
                      name="assignedVehicleId"
                      defaultValue={selectedSchedule?.assignedVehicleId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                          {vehicle.name} ({vehicle.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      defaultValue={selectedSchedule?.origin || ''}
                      placeholder="Starting location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      defaultValue={selectedSchedule?.destination || ''}
                      placeholder="Ending location"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '24px'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleForm(false);
                      setSelectedSchedule(null);
                    }}
                    style={{
                      padding: '12px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      color: '#374151',
                      background: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '12px 20px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    {selectedSchedule ? 'Update' : 'Create'} Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
