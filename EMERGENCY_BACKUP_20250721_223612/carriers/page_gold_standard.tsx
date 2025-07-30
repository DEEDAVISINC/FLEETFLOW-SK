'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLoadsForUser, Load } from '../services/loadService';

export default function CarrierPortal() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load available loads for carriers
    const availableLoads = getLoadsForUser().filter(load => 
      load.status === 'Available' || load.status === 'Draft'
    );
    setLoads(availableLoads);
  }, []);

  // Filter loads based on search
  const filteredLoads = loads.filter(load => {
    return !searchTerm || 
      load.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.brokerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      load.equipment.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleBidOnLoad = (load: Load) => {
    alert(`Bid feature coming soon for load ${load.id}! This will allow carriers to submit competitive bids.`);
  };

  const getStatusColor = (status: Load['status']) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Assigned': return 'bg-yellow-100 text-yellow-800';
      case 'In Transit': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-green-700 to-green-800" style={{ paddingTop: '80px' }}>
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
            🚚 CARRIER PORTAL
          </h1>
          <p className="text-xl text-white/90">
            Available Loads & Freight Opportunities - Book High-Paying Loads
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Available Loads', value: filteredLoads.length, color: 'from-green-500 to-green-600', icon: '📋' },
            { label: 'Avg Rate', value: `$${filteredLoads.length > 0 ? Math.round(filteredLoads.reduce((sum, load) => sum + load.rate, 0) / filteredLoads.length).toLocaleString() : '0'}`, color: 'from-blue-500 to-blue-600', icon: '💰' },
            { label: 'Top Rate', value: `$${Math.max(...filteredLoads.map(load => load.rate), 0).toLocaleString()}`, color: 'from-orange-500 to-orange-600', icon: '🎯' },
            { label: 'Support', value: '24/7', color: 'from-purple-500 to-purple-600', icon: '🕐' }
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
              placeholder="Search loads by ID, origin, destination, equipment, broker..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 shadow-sm"
            />
          </div>
        </div>

        {/* Load Board Table */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Load ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Broker</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rate</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pickup Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoads.map((load) => (
                  <tr key={load.id} className="hover:bg-green-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {load.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-semibold">{load.origin}</div>
                      <div className="text-xs text-gray-500">{load.destination}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {load.equipment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {load.brokerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(load.status)}`}>
                        {load.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-bold text-green-600 text-lg">
                        ${load.rate.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(load.pickupDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleBidOnLoad(load)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300"
                      >
                        Book Load
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredLoads.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-500 text-lg mb-2">📭 No loads available</div>
              <div className="text-gray-400 text-sm">
                Check back later for new freight opportunities
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
