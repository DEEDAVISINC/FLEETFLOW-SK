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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center"">
        <div className="flex items-center space-x-2"">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600"" />
          <span className="text-gray-600"">Loading scheduling system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50"">
      {/* Header */}
      <div className="bg-white shadow-sm border-b"">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"">
          <div className="flex justify-between items-center py-4"">
            <div className="flex items-center space-x-3"">
              <Calendar className="w-8 h-8 text-blue-600"" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900"">
                  Integrated Scheduling System
                </h1>
                <p className="text-sm text-gray-600"">
                  Comprehensive schedule management with driver and vehicle integration
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3"">
              <Link href="/drivers"" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"">
                <Users className="w-4 h-4"" />
                <span>Driver Management</span>
              </Link>
              
              <button
                onClick={() => setShowScheduleForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2""
              >
                <Plus className="w-4 h-4"" />
                <span>New Schedule</span>
              </button>
              
              <button
                onClick={loadData}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center space-x-2""
              >
                <RefreshCw className="w-4 h-4"" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4"">
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <Calendar className="w-5 h-5 text-blue-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">Total Schedules</p>
                  <p className="text-xl font-semibold"">{statistics.totalSchedules}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <Clock className="w-5 h-5 text-yellow-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">In Progress</p>
                  <p className="text-xl font-semibold"">{statistics.inProgressCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">Completed</p>
                  <p className="text-xl font-semibold"">{statistics.completedCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <Users className="w-5 h-5 text-purple-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">Utilization</p>
                  <p className="text-xl font-semibold"">{statistics.utilizationRate.toFixed(0)}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">Compliance</p>
                  <p className="text-xl font-semibold"">{statistics.complianceRate.toFixed(0)}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border p-4"">
              <div className="flex items-center"">
                <BarChart3 className="w-5 h-5 text-orange-600 mr-2"" />
                <div>
                  <p className="text-sm text-gray-600"">On Time</p>
                  <p className="text-xl font-semibold"">{statistics.onTimePerformance.toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6"">
          {/* Left Panel - Controls and Filters */}
          <div className="lg:col-span-1"">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6"">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"">
                <Filter className="w-5 h-5 mr-2"" />
                Filters & Controls
              </h3>
              
              {/* Search */}
              <div className="mb-4"">
                <div className="relative"">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"" />
                  <input
                    type="text""
                    placeholder="Search schedules...""
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                  />
                </div>
              </div>

              {/* View Mode */}
              <div className="mb-4"">
                <label className="block text-sm font-medium text-gray-700 mb-2"">
                  View Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg"">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setViewMode('weekly')}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      viewMode === 'weekly'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                      viewMode === 'calendar'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Calendar
                  </button>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setFilter({});
                  setSearchTerm('');
                }}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm""
              >
                Clear All Filters
              </button>
            </div>

            {/* Resource Availability Panel */}
            <div className="bg-white rounded-lg shadow-sm border p-6"">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"">
                <Users className="w-5 h-5 mr-2"" />
                Resource Status
              </h3>
              
              {/* Drivers */}
              <div className="mb-4"">
                <h4 className="text-sm font-medium text-gray-700 mb-2"">Drivers</h4>
                <div className="space-y-2"">
                  {drivers.slice(0, 3).map((driver) => (
                    <div key={driver.driverId} className="flex items-center justify-between p-2 bg-gray-50 rounded"">
                      <span className="text-sm font-medium"">{driver.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        driver.status === 'Available' ? 'bg-green-100 text-green-800' :
                        driver.status === 'On Duty' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {driver.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vehicles */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2"">Vehicles</h4>
                <div className="space-y-2"">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.vehicleId} className="flex items-center justify-between p-2 bg-gray-50 rounded"">
                      <span className="text-sm font-medium"">{vehicle.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        vehicle.status === 'Available' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'In Use' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {vehicle.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3"">
            <div className="bg-white rounded-lg shadow-sm border"">
              <div className="p-6 border-b"">
                <h2 className="text-lg font-semibold text-gray-900"">Schedule Management</h2>
                <p className="text-sm text-gray-600"">Manage and monitor all schedules with driver/vehicle integration</p>
              </div>
              
              <div className="divide-y"">
                {schedules.length === 0 ? (
                  <div className="p-8 text-center"">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4"" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2"">No schedules found</h3>
                    <p className="text-gray-600 mb-4"">Create your first schedule to get started</p>
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700""
                    >
                      Create Schedule
                    </button>
                  </div>
                ) : (
                  schedules.map((schedule) => (
                    <div key={schedule.id} className="p-6 hover:bg-gray-50"">
                      <div className="flex items-center justify-between mb-3"">
                        <div className="flex items-center space-x-3"">
                          <h3 className="text-lg font-medium text-gray-900"">{schedule.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                            {schedule.status}
                          </span>
                          <span className={`text-sm font-medium ${getPriorityColor(schedule.priority)}`}>
                            {schedule.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2"">
                          <button
                            onClick={() => {
                              setSelectedSchedule(schedule);
                              setShowScheduleForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium""
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium""
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600"">
                        <div>
                          <p><span className="font-medium"">Date:</span> {schedule.startDate}</p>
                          <p><span className="font-medium"">Time:</span> {schedule.startTime} - {schedule.endTime}</p>
                          <p><span className="font-medium"">Type:</span> {schedule.scheduleType}</p>
                        </div>
                        <div>
                          <p><span className="font-medium"">Driver:</span> {schedule.driverName || 'Not assigned'}</p>
                          <p><span className="font-medium"">Vehicle:</span> {schedule.vehicleName || 'Not assigned'}</p>
                          <p><span className="font-medium"">Duration:</span> {schedule.estimatedHours || 'N/A'} hours</p>
                        </div>
                        <div>
                          <p><span className="font-medium"">Route:</span> {schedule.origin && schedule.destination ? `${schedule.origin} → ${schedule.destination}` : 'No route specified'}</p>
                          <p><span className="font-medium"">Distance:</span> {schedule.estimatedDistance || 'N/A'} miles</p>
                          <div className="flex items-center space-x-2 mt-1"">
                            {schedule.hosCompliance !== false && (
                              <span className="text-green-600 text-xs flex items-center"">
                                <CheckCircle className="w-3 h-3 mr-1"" />
                                HOS
                              </span>
                            )}
                            {schedule.licenseVerified !== false && (
                              <span className="text-green-600 text-xs flex items-center"">
                                <CheckCircle className="w-3 h-3 mr-1"" />
                                License
                              </span>
                            )}
                            {schedule.vehicleInspectionCurrent !== false && (
                              <span className="text-green-600 text-xs flex items-center"">
                                <CheckCircle className="w-3 h-3 mr-1"" />
                                Inspection
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {schedule.description && (
                        <p className="mt-3 text-sm text-gray-600"">{schedule.description}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"">
            <div className="p-6 border-b"">
              <h2 className="text-xl font-semibold text-gray-900"">
                {selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>
            </div>
            
            <div className="p-6"">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"">
                  <div className="md:col-span-2"">
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Title
                    </label>
                    <input
                      type="text""
                      name="title""
                      required
                      defaultValue={selectedSchedule?.title || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div className="md:col-span-2"">
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Description
                    </label>
                    <textarea
                      name="description""
                      rows={3}
                      defaultValue={selectedSchedule?.description || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Start Date
                    </label>
                    <input
                      type="date""
                      name="startDate""
                      required
                      defaultValue={selectedSchedule?.startDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      End Date
                    </label>
                    <input
                      type="date""
                      name="endDate""
                      required
                      defaultValue={selectedSchedule?.endDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Start Time
                    </label>
                    <input
                      type="time""
                      name="startTime""
                      required
                      defaultValue={selectedSchedule?.startTime || '09:00'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      End Time
                    </label>
                    <input
                      type="time""
                      name="endTime""
                      required
                      defaultValue={selectedSchedule?.endTime || '17:00'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Priority
                    </label>
                    <select
                      name="priority""
                      defaultValue={selectedSchedule?.priority || 'Medium'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    >
                      <option value="Low"">Low</option>
                      <option value="Medium"">Medium</option>
                      <option value="High"">High</option>
                      <option value="Urgent"">Urgent</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Schedule Type
                    </label>
                    <select
                      name="scheduleType""
                      defaultValue={selectedSchedule?.scheduleType || 'Other'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    >
                      <option value="Delivery"">Delivery</option>
                      <option value="Pickup"">Pickup</option>
                      <option value="Maintenance"">Maintenance</option>
                      <option value="Training"">Training</option>
                      <option value="Inspection"">Inspection</option>
                      <option value="Break"">Break</option>
                      <option value="Other"">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Assigned Driver
                    </label>
                    <select
                      name="assignedDriverId""
                      defaultValue={selectedSchedule?.assignedDriverId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    >
                      <option value=">Select Driver</option>
                      {drivers.map((driver) => (
                        <option key={driver.driverId} value={driver.driverId}>
                          {driver.name} ({driver.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Assigned Vehicle
                    </label>
                    <select
                      name="assignedVehicleId""
                      defaultValue={selectedSchedule?.assignedVehicleId || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    >
                      <option value=">Select Vehicle</option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
                          {vehicle.name} ({vehicle.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Origin
                    </label>
                    <input
                      type="text""
                      name="origin""
                      defaultValue={selectedSchedule?.origin || ''}
                      placeholder="Starting location""
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"">
                      Destination
                    </label>
                    <input
                      type="text""
                      name="destination""
                      defaultValue={selectedSchedule?.destination || ''}
                      placeholder="Ending location""
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500""
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6"">
                  <button
                    type="button""
                    onClick={() => {
                      setShowScheduleForm(false);
                      setSelectedSchedule(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50""
                  >
                    Cancel
                  </button>
                  <button
                    type="submit""
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700""
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
  );
}
