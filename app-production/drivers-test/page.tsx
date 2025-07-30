'use client';

import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../config/access';

export default function DriverManagementTest() {
  const { user } = getCurrentUser();

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
            👥 DRIVER MANAGEMENT TEST
          </h1>
          <p className="text-xl text-white/90">
            Driver Fleet Operations & Performance Monitoring - {user.name}
          </p>
        </div>

        {/* Test Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Drivers', value: 6, color: 'from-blue-500 to-blue-600', icon: '👥' },
            { label: 'Available', value: 1, color: 'from-green-500 to-green-600', icon: '✅' },
            { label: 'On Duty', value: 1, color: 'from-blue-500 to-blue-600', icon: '🔵' },
            { label: 'Driving', value: 2, color: 'from-orange-500 to-orange-600', icon: '🚛' },
            { label: 'Off Duty', value: 1, color: 'from-yellow-500 to-yellow-600', icon: '⏸️' },
            { label: 'Inactive', value: 1, color: 'from-gray-500 to-gray-600', icon: '⚫' }
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

        {/* Test Message */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            🎯 DRIVER MANAGEMENT - GOLD STANDARD TEST
          </h2>
          <p className="text-gray-600 mb-4">
            This test page verifies the DISPATCH CENTRAL gold standard styling is working correctly.
          </p>
          <div className="text-sm text-gray-500">
            If you can see this page with the blue gradient background, white glass-morphism cards, 
            and professional styling, then the system is working correctly.
          </div>
        </div>
      </div>
    </div>
  );
}
