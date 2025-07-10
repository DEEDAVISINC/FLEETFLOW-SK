'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Clean Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-light text-gray-800 mb-3">FleetFlow</h1>
          <p className="text-gray-500 text-lg">Fleet Management Dashboard</p>
          <div className="flex justify-center items-center gap-8 mt-6 text-sm text-gray-400">
            <span>{currentTime.toLocaleTimeString()}</span>
            <span>{currentTime.toLocaleDateString()}</span>
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              System Online
            </span>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-5xl mx-auto">
          
          {/* Dispatch Central */}
          <Link href="/dispatch" className="group">
            <div className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🚛</div>
              <h3 className="text-white font-semibold text-sm mb-1">Dispatch Central</h3>
              <p className="text-blue-100 text-xs">Load Management</p>
            </div>
          </Link>

          {/* Carrier Portal */}
          <Link href="/carriers" className="group">
            <div className="bg-green-500 hover:bg-green-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="text-white font-semibold text-sm mb-1">Carrier Portal</h3>
              <p className="text-green-100 text-xs">Driver Load Board</p>
            </div>
          </Link>

          {/* Broker Box */}
          <Link href="/broker" className="group">
            <div className="bg-orange-500 hover:bg-orange-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="text-white font-semibold text-sm mb-1">Broker Box</h3>
              <p className="text-orange-100 text-xs">Agent Portal</p>
            </div>
          </Link>

          {/* Quoting */}
          <Link href="/quoting" className="group">
            <div className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-white font-semibold text-sm mb-1">Quoting</h3>
              <p className="text-purple-100 text-xs">Rate Calculator</p>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/analytics" className="group">
            <div className="bg-teal-500 hover:bg-teal-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-white font-semibold text-sm mb-1">Analytics</h3>
              <p className="text-teal-100 text-xs">Reports & Data</p>
            </div>
          </Link>

          {/* AI Automation */}
          <Link href="/ai" className="group">
            <div className="bg-indigo-500 hover:bg-indigo-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="text-white font-semibold text-sm mb-1">AI Automation</h3>
              <p className="text-indigo-100 text-xs">Smart Dispatch</p>
            </div>
          </Link>

          {/* Documents */}
          <Link href="/documents" className="group">
            <div className="bg-red-500 hover:bg-red-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="text-white font-semibold text-sm mb-1">Documents</h3>
              <p className="text-red-100 text-xs">BOL & Forms</p>
            </div>
          </Link>

          {/* Training */}
          <Link href="/training" className="group">
            <div className="bg-amber-500 hover:bg-amber-600 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-white font-semibold text-sm mb-1">Training</h3>
              <p className="text-amber-100 text-xs">Learning Center</p>
            </div>
          </Link>

          {/* Fleet Management */}
          <Link href="/fleet" className="group">
            <div className="bg-stone-600 hover:bg-stone-700 transition-all duration-300 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1">
              <div className="text-3xl mb-3">🚐</div>
              <h3 className="text-white font-semibold text-sm mb-1">Fleet Management</h3>
              <p className="text-stone-200 text-xs">Vehicles & Assets</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
