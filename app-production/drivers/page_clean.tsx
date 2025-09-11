'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../config/access';

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
    eldStatus: 'Connected'
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
    eldStatus: 'Connected'
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
    eldStatus: 'Connected'
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
    eldStatus: 'Connected'
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
    eldStatus: 'Disconnected'
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
    eldStatus: 'Connected'
  }
];

export default function DriverManagement() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    onDuty: 0,
    driving: 0,
    offDuty: 0,
    inactive: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { user, permissions } = getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDrivers(MOCK_DRIVERS);
    
    const stats = {
      total: MOCK_DRIVERS.length,
      available: MOCK_DRIVERS.filter(d => d.status === 'Available').length,
      onDuty: MOCK_DRIVERS.filter(d => d.status === 'On Duty').length,
      driving: MOCK_DRIVERS.filter(d => d.status === 'Driving').length,
      offDuty: MOCK_DRIVERS.filter(d => d.status === 'Off Duty').length,
      inactive: MOCK_DRIVERS.filter(d => d.status === 'Inactive').length
    };
    
    setStats(stats);
  };

  const filteredDrivers = drivers.filter(driver => {
    return !searchTerm || 
      driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.phone.includes(searchTerm) ||
      (driver.currentLocation && driver.currentLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver.assignedTruck && driver.assignedTruck.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const getStatusColor = (status: Driver['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'On Duty': return 'bg-blue-100 text-blue-800';
      case 'Driving': return 'bg-orange-100 text-orange-800';
      case 'Off Duty': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEldStatusColor = (status: Driver['eldStatus']) => {
    switch (status) {
      case 'Connected': return 'bg-green-100 text-green-800';
      case 'Disconnected': return 'bg-red-100 text-red-800';
      case 'Error': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800" style={{ paddingTop: '80px' }}>
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="inline-block">
          <button className="group bg-white/20 hover:bg-white/30 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg">
            <span className="mr-2">←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div className="container mx-auto px-6 pb-8">
        {/* Page Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-8">
          <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
            👥 DRIVER MANAGEMENT
          </h1>
          <p className="text-xl text-white/90">
            Driver Fleet Operations & Performance Monitoring - {user.name}
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Drivers', value: stats.total, color: 'from-blue-500 to-blue-600', icon: '👥' },
            { label: 'Available', value: stats.available, color: 'from-green-500 to-green-600', icon: '✅' },
            { label: 'On Duty', value: stats.onDuty, color: 'from-blue-500 to-blue-600', icon: '🔵' },
            { label: 'Driving', value: stats.driving, color: 'from-orange-500 to-orange-600', icon: '🚛' },
            { label: 'Off Duty', value: stats.offDuty, color: 'from-yellow-500 to-yellow-600', icon: '⏸️' },
            { label: 'Inactive', value: stats.inactive, color: 'from-gray-500 to-gray-600', icon: '⚫' }
          ].map((stat, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-1">
              <div className={`bg-gradient-to-r ${stat.color} text-white text-2xl font-bold rounded-lg py-3 mb-3 shadow-md`}>
                <div className="text-sm opacity-90 mb-1">{stat.icon}</div>
                <div>{stat.value}</div>
              </div>
              <div className="text-gray-700 text-sm font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 mb-8 shadow-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search drivers by name, email, license, phone, location, truck..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Driver Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Driver ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name & Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">License</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Truck</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">ELD Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Miles & Rating</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Last Activity</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {driver.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{driver.name}</div>
                      <div className="text-xs text-gray-500">{driver.email}</div>
                      <div className="text-xs text-gray-500">{driver.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getStatusColor(driver.status)}`}>
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{driver.currentLocation || 'Unknown'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{driver.assignedTruck || 'Unassigned'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full shadow-sm ${getEldStatusColor(driver.eldStatus)}`}>
                        {driver.eldStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{driver.totalMiles.toLocaleString()} mi</div>
                      <div className="text-xs text-gray-500">⭐ {driver.rating}/5.0</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{new Date(driver.lastActivity).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500">{new Date(driver.lastActivity).toLocaleTimeString()}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No drivers message */}
          {filteredDrivers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">👥</div>
              <div className="text-gray-600 text-xl mb-2 font-semibold">
                {searchTerm ? 'No drivers found matching your search' : 'No drivers available'}
              </div>
              <div className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'Add drivers to get started'}
              </div>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
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
