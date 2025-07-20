/**
 * Enterprise Fleet Schedule Overview Component
 * Comprehensive dashboard for fleet management and scheduling
 */

'use client';

import React, { useState } from 'react';

interface Driver {
  id: string;
  name: string;
  status: string;
  phone: string;
  email: string;
  currentLocation?: string;
  hoursThisWeek?: number;
  nextStop?: string;
  vehicleCapacity?: number;
  currentLoad?: number;
  weeklyRevenue?: number;
  onTimeDeliveries?: number;
  totalDeliveries?: number;
  safetyScore?: number;
  violationsThisMonth?: number;
  maintenanceDue?: boolean;
  carrierMC?: string;
}

interface DriverScheduleIntegrationProps {
  // For individual driver view (existing usage)
  driverId?: string;
  driverName?: string;
  driverStatus?: string;
  onScheduleCreate?: () => void;
  
  // For fleet overview (new usage)
  drivers?: Driver[];
}

const DriverScheduleIntegration = ({ 
  driverId, 
  driverName, 
  driverStatus,
  onScheduleCreate,
  drivers 
}: DriverScheduleIntegrationProps) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'analytics'>('overview');

  // If drivers array is provided, use fleet overview mode
  if (drivers && drivers.length > 0) {
    // Advanced metrics calculations
    const totalDrivers = drivers.length;
    const activeDrivers = drivers.filter(d => d.status === 'Active').length;
    const onDutyDrivers = drivers.filter(d => d.status === 'On Duty').length;
    const offDutyDrivers = drivers.filter(d => d.status === 'Off Duty').length;
    const totalHours = drivers.reduce((sum, driver) => sum + (driver.hoursThisWeek || 0), 0);
    const avgHoursPerDriver = totalDrivers > 0 ? (totalHours / totalDrivers).toFixed(1) : '0';
    const complianceRate = ((activeDrivers / totalDrivers) * 100).toFixed(1);
    
    // Fleet utilization metrics
    const totalCapacity = drivers.reduce((sum, driver) => sum + (driver.vehicleCapacity || 0), 0);
    const utilizedCapacity = drivers.reduce((sum, driver) => sum + (driver.currentLoad || 0), 0);
    const utilizationRate = totalCapacity > 0 ? ((utilizedCapacity / totalCapacity) * 100).toFixed(1) : '0';

    // Revenue and performance metrics
    const totalRevenue = drivers.reduce((sum, driver) => sum + (driver.weeklyRevenue || 0), 0);
    const avgRevenuePerDriver = totalDrivers > 0 ? (totalRevenue / totalDrivers).toFixed(0) : '0';
    const onTimeDeliveries = drivers.reduce((sum, driver) => sum + (driver.onTimeDeliveries || 0), 0);
    const totalDeliveries = drivers.reduce((sum, driver) => sum + (driver.totalDeliveries || 0), 0);
    const deliverySuccessRate = totalDeliveries > 0 ? ((onTimeDeliveries / totalDeliveries) * 100).toFixed(1) : '0';

    // Safety and compliance metrics
    const safetyScore = drivers.reduce((sum, driver) => sum + (driver.safetyScore || 0), 0) / totalDrivers;
    const violationsThisMonth = drivers.reduce((sum, driver) => sum + (driver.violationsThisMonth || 0), 0);
    const maintenanceAlerts = drivers.filter(d => d.maintenanceDue).length;

    if (!expanded) {
    return (
        <div className="mt-6">
          <button
            onClick={() => setExpanded(true)}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-3"
            style={{
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            <span className="text-lg">Expand All Schedules</span>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
              {totalDrivers} Drivers
            </div>
          </button>
        </div>
      );
    }

    return (
      <div className="mt-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden" style={{
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}>
        {/* Enhanced Header with Navigation */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
      </div>
              <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Fleet Schedule Management</h2>
                  <p className="text-blue-200 text-base">Comprehensive driver scheduling and performance analytics</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800/50 backdrop-blur-sm rounded-xl p-1 border border-slate-700">
                {['overview', 'detailed', 'analytics'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      viewMode === mode
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setExpanded(false)}
                className="bg-slate-800/50 hover:bg-slate-700/50 text-white p-3 rounded-xl transition-all duration-200 border border-slate-700 backdrop-blur-sm"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          {viewMode === 'overview' && (
            <div className="space-y-8">
              {/* Enhanced Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-700 text-sm font-semibold uppercase tracking-wide">Total Drivers</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">{totalDrivers}</p>
                      <p className="text-blue-600 text-sm mt-2 font-medium">{activeDrivers} Active</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
              </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                <div>
                      <p className="text-green-700 text-sm font-semibold uppercase tracking-wide">Fleet Utilization</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">{utilizationRate}%</p>
                      <p className="text-green-600 text-sm mt-2 font-medium">{utilizedCapacity.toLocaleString()} / {totalCapacity.toLocaleString()} tons</p>
                </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
              </div>
            </div>
          </div>

                <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-violet-50 border border-purple-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
        <div>
                      <p className="text-purple-700 text-sm font-semibold uppercase tracking-wide">Weekly Revenue</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">${(totalRevenue / 1000).toFixed(0)}k</p>
                      <p className="text-purple-600 text-sm mt-2 font-medium">${avgRevenuePerDriver} avg/driver</p>
            </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    </div>
                  </div>
                  
                <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 border border-orange-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-700 text-sm font-semibold uppercase tracking-wide">Delivery Success</p>
                      <p className="text-4xl font-bold text-slate-800 mt-2">{deliverySuccessRate}%</p>
                      <p className="text-orange-600 text-sm mt-2 font-medium">{onTimeDeliveries}/{totalDeliveries} on time</p>
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      </div>
                  </div>
                </div>
                  </div>

              {/* Enhanced Driver Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    Driver Status Distribution
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-green-500 rounded-full shadow-lg"></div>
                        <span className="text-base font-semibold text-slate-700">On Duty</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg" style={{ width: `${(onDutyDrivers / totalDrivers) * 100}%` }}></div>
                        </div>
                        <span className="text-lg font-bold text-slate-800 min-w-[3rem]">{onDutyDrivers}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-blue-500 rounded-full shadow-lg"></div>
                        <span className="text-base font-semibold text-slate-700">Active</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full shadow-lg" style={{ width: `${(activeDrivers / totalDrivers) * 100}%` }}></div>
                        </div>
                        <span className="text-lg font-bold text-slate-800 min-w-[3rem]">{activeDrivers}</span>
                  </div>
                </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-4 h-4 bg-gray-500 rounded-full shadow-lg"></div>
                        <span className="text-base font-semibold text-slate-700">Off Duty</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-gray-200 rounded-full h-3 shadow-inner">
                          <div className="bg-gradient-to-r from-gray-500 to-slate-500 h-3 rounded-full shadow-lg" style={{ width: `${(offDutyDrivers / totalDrivers) * 100}%` }}></div>
            </div>
                        <span className="text-lg font-bold text-slate-800 min-w-[3rem]">{offDutyDrivers}</span>
        </div>
          </div>
        </div>
      </div>

                <div className="bg-gradient-to-br from-white to-slate-50 border border-gray-200 rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    Safety & Compliance
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <span className="text-base font-semibold text-slate-700">Safety Score</span>
                      <span className="text-2xl font-bold text-blue-600">{safetyScore.toFixed(1)}/10</span>
          </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <span className="text-base font-semibold text-slate-700">Violations (Month)</span>
                      <span className="text-2xl font-bold text-red-600">{violationsThisMonth}</span>
            </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                      <span className="text-base font-semibold text-slate-700">Maintenance Alerts</span>
                      <span className="text-2xl font-bold text-orange-600">{maintenanceAlerts}</span>
          </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <span className="text-base font-semibold text-slate-700">Compliance Rate</span>
                      <span className="text-2xl font-bold text-green-600">{complianceRate}%</span>
            </div>
          </div>
        </div>
      </div>

              {/* Enhanced Quick Actions */}
              <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Driver</span>
                  </button>
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>Generate Report</span>
                  </button>
                  <button className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Settings</span>
                  </button>
                  <button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>Favorites</span>
                  </button>
            </div>
              </div>
            </div>
          )}

          {viewMode === 'detailed' && (
            <div className="space-y-6">
              {/* Detailed Driver Table */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 bg-slate-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-slate-800">Detailed Driver Schedule</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Current Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hours This Week</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Next Stop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {drivers.map((driver) => (
                        <tr key={driver.id} className="hover:bg-slate-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{driver.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-slate-900">{driver.name}</div>
                                <div className="text-sm text-slate-500">{driver.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              driver.status === 'On Duty' ? 'bg-green-100 text-green-800' :
                              driver.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {driver.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {driver.currentLocation || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {driver.hoursThisWeek || 0}h
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                            {driver.nextStop || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                            <button className="text-green-600 hover:text-green-900 mr-3">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="space-y-6">
              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Weekly Performance Trends</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Average Hours/Driver</span>
                      <span className="text-xl font-semibold text-slate-800">{avgHoursPerDriver}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Total Fleet Hours</span>
                      <span className="text-xl font-semibold text-slate-800">{totalHours}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Revenue per Hour</span>
                      <span className="text-xl font-semibold text-slate-800">${totalHours > 0 ? (totalRevenue / totalHours).toFixed(2) : '0'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">Efficiency Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Fuel Efficiency</span>
                      <span className="text-xl font-semibold text-green-600">8.2 mpg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Idle Time</span>
                      <span className="text-xl font-semibold text-orange-600">12%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-600">Route Optimization</span>
                      <span className="text-xl font-semibold text-blue-600">94%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Advanced Analytics */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Predictive Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
                    <div className="text-base text-slate-600">On-Time Delivery Prediction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">$2.4M</div>
                    <div className="text-base text-slate-600">Projected Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
                    <div className="text-base text-slate-600">Maintenance Alerts (Next 30 days)</div>
                </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // For individual driver view (enhanced functionality)
  const [individualViewMode, setIndividualViewMode] = useState<'overview' | 'detailed' | 'analytics' | 'schedule'>('overview');
  const [scheduleView, setScheduleView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock schedule data for the selected driver
  const [scheduleItems, setScheduleItems] = useState([
    {
      id: '1',
      type: 'pickup',
      location: 'Dallas, TX - Warehouse A',
      startTime: '08:00',
      endTime: '09:30',
      status: 'completed',
      description: 'Pickup 15,000 lbs of electronics',
      priority: 'high',
      estimatedDuration: 90,
      actualDuration: 85,
      notes: 'Loading completed ahead of schedule'
    },
    {
      id: '2',
      type: 'delivery',
      location: 'Houston, TX - Distribution Center',
      startTime: '12:00',
      endTime: '13:00',
      status: 'in-progress',
      description: 'Deliver electronics shipment',
      priority: 'high',
      estimatedDuration: 60,
      notes: 'Traffic delay on I-45'
    },
    {
      id: '3',
      type: 'break',
      location: 'Rest Area - I-45',
      startTime: '14:00',
      endTime: '14:30',
      status: 'upcoming',
      description: '30-minute break',
      priority: 'medium',
      estimatedDuration: 30
    },
    {
      id: '4',
      type: 'pickup',
      location: 'Austin, TX - Manufacturing Plant',
      startTime: '16:00',
      endTime: '17:30',
      status: 'upcoming',
      description: 'Pickup automotive parts',
      priority: 'high',
      estimatedDuration: 90
    },
    {
      id: '5',
      type: 'fuel',
      location: 'San Antonio, TX - Truck Stop',
      startTime: '19:00',
      endTime: '19:30',
      status: 'upcoming',
      description: 'Fuel stop and inspection',
      priority: 'medium',
      estimatedDuration: 30
    }
  ]);

  return (
    <div style={{
      background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      border: '1px solid #d1d5db',
      padding: '0',
      overflow: 'hidden',
    }}>
      {/* Header - Matching All Drivers style but with purple theme */}
      <div style={{
        background: 'linear-gradient(90deg, #7c3aed 0%, #5b21b6 100%)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, color: '#fff' }}>📅</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff', letterSpacing: 0.5 }}>Schedule Management</span>
          <span style={{ color: '#c4b5fd', fontSize: 12 }}>• {driverName}</span>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.1)', borderRadius: 4, padding: 2 }}>
            {['overview', 'schedule', 'detailed'].map((mode) => (
              <button
                key={mode}
                onClick={() => setIndividualViewMode(mode as any)}
                style={{
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: '600',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: individualViewMode === mode ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                  color: individualViewMode === mode ? '#fff' : 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => onScheduleCreate?.()}
            style={{
              padding: '4px 8px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '10px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10 }}>+</span>
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px' }}>
        {individualViewMode === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Compact Status Overview - Matching All Drivers grid style */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: 8,
              marginBottom: 12
            }}>
              <div style={{
                background: 'white',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Status</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>{driverStatus}</div>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Hours</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#3b82f6' }}>42.5h</div>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Deliveries</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b' }}>3/5</div>
              </div>
              
              <div style={{
                background: 'white',
                borderRadius: '6px',
                padding: '8px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Safety</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#10b981' }}>9.2/10</div>
              </div>
            </div>

            {/* Today's Schedule Preview - Matching All Drivers row style */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '70px 1.2fr 100px 80px 90px 80px', 
                gap: 8, 
                padding: '8px 10px', 
                background: 'rgba(124, 58, 237, 0.1)', 
                borderRadius: 6, 
                marginBottom: 8, 
                fontWeight: 700, 
                fontSize: 11, 
                textTransform: 'uppercase', 
                color: '#7c3aed' 
              }}>
                <div>Time</div>
                <div>Description</div>
                <div>Location</div>
                <div>Type</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {scheduleItems.slice(0, 3).map((item) => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '70px 1.2fr 100px 80px 90px 80px',
                    gap: 8,
                    padding: '6px 10px',
                    background: 'white',
                    borderRadius: 6,
                    border: '1px solid #f3f4f6',
                    alignItems: 'center',
                    fontSize: 12
                  }}>
                    <div style={{ fontWeight: '600', color: '#374151' }}>
                      {item.startTime}
                    </div>
                    <div style={{ color: '#374151', fontWeight: '500' }}>
                      {item.description}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 11 }}>
                      {item.location}
                    </div>
                    <div>
                      <span style={{
                        padding: '2px 4px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: '700',
                        background: 'rgba(124, 58, 237, 0.1)',
                        color: '#7c3aed',
                        textTransform: 'uppercase'
                      }}>
                        {item.type}
                      </span>
                    </div>
                    <div>
                      <span style={{
                        padding: '2px 4px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: '700',
                        background: 
                          item.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                          item.status === 'in-progress' ? 'rgba(59, 130, 246, 0.2)' :
                          item.status === 'delayed' ? 'rgba(239, 68, 68, 0.2)' :
                          'rgba(156, 163, 175, 0.2)',
                        color: 
                          item.status === 'completed' ? '#10b981' :
                          item.status === 'in-progress' ? '#3b82f6' :
                          item.status === 'delayed' ? '#ef4444' :
                          '#9ca3af',
                        textTransform: 'uppercase'
                      }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => setIndividualViewMode('schedule')}
                        style={{
                          padding: '2px 4px',
                          background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
                          color: 'white',
                          border: 'none',
                          borderRadius: 3,
                          cursor: 'pointer',
                          fontSize: 10,
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        📅
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {individualViewMode === 'schedule' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Schedule Navigation */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: '700', color: '#374151' }}>Detailed Schedule</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ display: 'flex', background: 'rgba(124, 58, 237, 0.1)', borderRadius: 4, padding: 2 }}>
                    {['daily', 'weekly', 'monthly'].map((view) => (
                      <button
                        key={view}
                        onClick={() => setScheduleView(view as any)}
                        style={{
                          padding: '4px 8px',
                          fontSize: 9,
                          fontWeight: '600',
                          borderRadius: 3,
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: scheduleView === view ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                          color: scheduleView === view ? '#7c3aed' : '#6b7280',
                        }}
                      >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                      </button>
                    ))}
                  </div>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    style={{
                      padding: '4px 8px',
                      border: '1px solid #d1d5db',
                      borderRadius: 4,
                      fontSize: 9,
                      outline: 'none',
                      background: 'white'
                    }}
                  />
                </div>
              </div>

              {/* Schedule Timeline - Matching All Drivers table style */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '60px 1.5fr 120px 80px 90px 80px 80px', 
                gap: 8, 
                padding: '8px 10px', 
                background: 'rgba(124, 58, 237, 0.1)', 
                borderRadius: 6, 
                marginBottom: 8, 
                fontWeight: 700, 
                fontSize: 11, 
                textTransform: 'uppercase', 
                color: '#7c3aed' 
              }}>
                <div>Time</div>
                <div>Description</div>
                <div>Location</div>
                <div>Type</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {scheduleItems.map((item, index) => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1.5fr 120px 80px 90px 80px 80px',
                    gap: 8,
                    padding: '6px 10px',
                    background: 'white',
                    borderRadius: 6,
                    border: '1px solid #f3f4f6',
                    alignItems: 'center',
                    fontSize: 12,
                    position: 'relative'
                  }}>
                    {index > 0 && (
                      <div style={{
                        position: 'absolute',
                        left: 30,
                        top: -4,
                        width: 1,
                        height: 8,
                        background: '#d1d5db'
                      }}></div>
                    )}
                    
                    <div style={{ fontWeight: '600', color: '#374151' }}>
                      {item.startTime}
                    </div>
                    <div style={{ color: '#374151', fontWeight: '500' }}>
                      {item.description}
                    </div>
                    <div style={{ color: '#6b7280', fontSize: 11 }}>
                      {item.location}
                    </div>
                                         <div>
                       <span style={{
                         padding: '2px 4px',
                         borderRadius: 4,
                         fontSize: 10,
                         fontWeight: '700',
                         background: 'rgba(124, 58, 237, 0.1)',
                         color: '#7c3aed',
                         textTransform: 'uppercase'
                       }}>
                         {item.type}
                       </span>
                     </div>
                     <div>
                       <span style={{
                         padding: '2px 4px',
                         borderRadius: 4,
                         fontSize: 10,
                         fontWeight: '700',
                         background: 
                           item.priority === 'urgent' ? 'rgba(239, 68, 68, 0.2)' :
                           item.priority === 'high' ? 'rgba(245, 158, 11, 0.2)' :
                           item.priority === 'medium' ? 'rgba(234, 179, 8, 0.2)' :
                           'rgba(16, 185, 129, 0.2)',
                         color: 
                           item.priority === 'urgent' ? '#ef4444' :
                           item.priority === 'high' ? '#f59e0b' :
                           item.priority === 'medium' ? '#eab308' :
                           '#10b981',
                         textTransform: 'uppercase'
                       }}>
                         {item.priority}
                       </span>
                     </div>
                     <div>
                       <span style={{
                         padding: '2px 4px',
                         borderRadius: 4,
                         fontSize: 10,
                         fontWeight: '700',
                         background: 
                           item.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                           item.status === 'in-progress' ? 'rgba(59, 130, 246, 0.2)' :
                           item.status === 'delayed' ? 'rgba(239, 68, 68, 0.2)' :
                           'rgba(156, 163, 175, 0.2)',
                         color: 
                           item.status === 'completed' ? '#10b981' :
                           item.status === 'in-progress' ? '#3b82f6' :
                           item.status === 'delayed' ? '#ef4444' :
                           '#9ca3af',
                         textTransform: 'uppercase'
                       }}>
                         {item.status}
                       </span>
                     </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                                             <button style={{
                         padding: '2px 4px',
                         background: 'rgba(59, 130, 246, 0.1)',
                         color: '#3b82f6',
                         border: 'none',
                         borderRadius: 3,
                         cursor: 'pointer',
                         fontSize: 10,
                         fontWeight: '600',
                         transition: 'all 0.3s ease'
                       }}>
                         ✏️
                       </button>
                       <button style={{
                         padding: '2px 4px',
                         background: 'rgba(16, 185, 129, 0.1)',
                         color: '#10b981',
                         border: 'none',
                         borderRadius: 3,
                         cursor: 'pointer',
                         fontSize: 10,
                         fontWeight: '600',
                         transition: 'all 0.3s ease'
                       }}>
                         ✓
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other view modes */}
        {(individualViewMode === 'detailed' || individualViewMode === 'analytics') && (
          <div style={{ textAlign: 'center', padding: '24px' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'rgba(124, 58, 237, 0.1)',
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px'
            }}>
              <span style={{ fontSize: 16, color: '#7c3aed' }}>📊</span>
            </div>
            <div style={{ fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 4 }}>Advanced Features</div>
            <div style={{ fontSize: 9, color: '#6b7280' }}>Detailed analytics and advanced scheduling features coming soon.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverScheduleIntegration;
