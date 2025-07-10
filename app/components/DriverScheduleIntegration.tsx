/**
 * Driver-Schedule Integration Component
 * Provides seamless connection between driver management and scheduling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { schedulingService } from '../scheduling/service';
import { Schedule, DriverAvailability } from '../scheduling/types';

interface DriverScheduleIntegrationProps {
  driverId: string;
  driverName: string;
  driverStatus: string;
  onScheduleCreate?: () => void;
}

export default function DriverScheduleIntegration({ 
  driverId, 
  driverName, 
  driverStatus,
  onScheduleCreate 
}: DriverScheduleIntegrationProps) {
  const [driverSchedules, setDriverSchedules] = useState<Schedule[]>([]);
  const [driverAvailability, setDriverAvailability] = useState<DriverAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  useEffect(() => {
    loadDriverData();
  }, [driverId]);

  const loadDriverData = async () => {
    setLoading(true);
    try {
      // Get driver's schedules
      const schedules = schedulingService.getSchedules({
        assignedDriverId: driverId
      });
      
      // Get driver availability
      const availability = schedulingService.getDriverAvailability(driverId);
      
      setDriverSchedules(schedules);
      setDriverAvailability(availability[0] || null);
    } catch (error) {
      console.error('Error loading driver scheduling data:', error);
    }
    setLoading(false);
  };

  const getUpcomingSchedules = () => {
    const now = new Date();
    return driverSchedules.filter(schedule => {
      const scheduleDate = new Date(`${schedule.startDate} ${schedule.startTime}`);
      return scheduleDate > now && schedule.status !== 'Cancelled';
    }).slice(0, 3);
  };

  const getCurrentSchedule = () => {
    const now = new Date();
    return driverSchedules.find(schedule => {
      const startDate = new Date(`${schedule.startDate} ${schedule.startTime}`);
      const endDate = new Date(`${schedule.endDate} ${schedule.endTime}`);
      return now >= startDate && now <= endDate && schedule.status === 'In Progress';
    });
  };

  const getScheduleStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Delayed': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date} ${time}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentSchedule = getCurrentSchedule();
  const upcomingSchedules = getUpcomingSchedules();

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Schedule Overview</h3>
          </div>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Driver Availability Status */}
        {driverAvailability && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Current Availability</h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                  <span>Hours Remaining: <strong>{driverAvailability.hoursRemaining}h</strong></span>
                  <span>License: <strong className={driverAvailability.licenseStatus === 'Valid' ? 'text-green-600' : 'text-red-600'}>
                    {driverAvailability.licenseStatus}
                  </strong></span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                driverAvailability.status === 'Available' ? 'bg-green-100 text-green-800' :
                driverAvailability.status === 'On Duty' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {driverAvailability.status}
              </div>
            </div>
            
            {/* HOS Compliance Warning */}
            {driverAvailability.hoursRemaining < 8 && (
              <div className="mt-2 flex items-center space-x-2 text-orange-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">Low hours remaining - HOS compliance warning</span>
              </div>
            )}
          </div>
        )}

        {/* Current Schedule */}
        {currentSchedule && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
              <Clock className="w-4 h-4 mr-1 text-yellow-600" />
              Currently Active
            </h4>
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900">{currentSchedule.title}</h5>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getScheduleStatusColor(currentSchedule.status)}`}>
                  {currentSchedule.status}
                </span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {currentSchedule.origin} → {currentSchedule.destination}
                </div>
                <div>
                  <strong>Time:</strong> {formatDateTime(currentSchedule.startDate, currentSchedule.startTime)} - 
                  {formatDateTime(currentSchedule.endDate, currentSchedule.endTime)}
                </div>
                {currentSchedule.vehicleName && (
                  <div><strong>Vehicle:</strong> {currentSchedule.vehicleName}</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Schedules */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-blue-600" />
            Upcoming Schedules
          </h4>
          
          {upcomingSchedules.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No upcoming schedules</p>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Create first schedule
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="border rounded-lg p-3 hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{schedule.title}</h5>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScheduleStatusColor(schedule.status)}`}>
                        {schedule.status}
                      </span>
                      <span className={`text-xs font-medium ${
                        schedule.priority === 'Urgent' ? 'text-red-600' :
                        schedule.priority === 'High' ? 'text-orange-600' :
                        schedule.priority === 'Medium' ? 'text-blue-600' : 'text-gray-600'
                      }`}>
                        {schedule.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <strong>Date:</strong> {formatDateTime(schedule.startDate, schedule.startTime)}
                    </div>
                    {schedule.origin && schedule.destination && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {schedule.origin} → {schedule.destination}
                      </div>
                    )}
                    {schedule.estimatedHours && (
                      <div><strong>Estimated Duration:</strong> {schedule.estimatedHours} hours</div>
                    )}
                  </div>

                  {/* Compliance Indicators */}
                  <div className="flex items-center space-x-3 mt-2">
                    {schedule.hosCompliance !== false && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">HOS Compliant</span>
                      </div>
                    )}
                    {schedule.licenseVerified !== false && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">License Verified</span>
                      </div>
                    )}
                    {schedule.vehicleInspectionCurrent !== false && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs">Vehicle Inspected</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                // Navigate to full scheduling page with driver filter
                window.location.href = `/scheduling?driver=${driverId}`;
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200"
            >
              View All Schedules
            </button>
            <button
              onClick={() => setShowScheduleForm(true)}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
            >
              Create Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Statistics */}
      <div className="bg-gray-50 px-4 py-3 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{driverSchedules.length}</div>
            <div className="text-xs text-gray-600">Total Schedules</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {driverSchedules.filter(s => s.status === 'Completed').length}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {driverSchedules.filter(s => s.status === 'Scheduled').length}
            </div>
            <div className="text-xs text-gray-600">Scheduled</div>
          </div>
        </div>
      </div>

      {/* Simple Schedule Form Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Quick Schedule Creation</h3>
              <p className="text-sm text-gray-600">Create a schedule for {driverName}</p>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const scheduleData = {
                title: formData.get('title') as string,
                startDate: formData.get('date') as string,
                endDate: formData.get('date') as string,
                startTime: formData.get('startTime') as string,
                endTime: formData.get('endTime') as string,
                scheduleType: formData.get('scheduleType') as any,
                assignedDriverId: driverId,
                driverName: driverName,
                origin: formData.get('origin') as string,
                destination: formData.get('destination') as string,
              };
              
              schedulingService.createSchedule(scheduleData).then(() => {
                loadDriverData();
                setShowScheduleForm(false);
                onScheduleCreate?.();
              });
            }} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Delivery to Austin"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    name="scheduleType"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Delivery">Delivery</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Training">Training</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    required
                    defaultValue="09:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    required
                    defaultValue="17:00"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Start location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="End location"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
