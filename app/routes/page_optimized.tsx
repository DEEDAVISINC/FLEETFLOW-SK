'use client';

import { useState } from 'react';
import RouteOptimizerDashboard from '../components/RouteOptimizerDashboard';
import StickyNote from '../components/StickyNote';

export default function RoutesPage() {
  const [activeTab, setActiveTab] = useState<'routes' | 'optimizer'>(
    'optimizer'
  );

  return (
    <div className='container py-6'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1
            className='mb-2 text-gray-900'
            style={{ fontSize: '2rem', fontWeight: 'bold' }}
          >
            🗺️ Route Management & Optimization
          </h1>
          <p className='text-gray-600'>
            AI-powered route planning with Google Maps integration
          </p>
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => window.open('http://localhost:3001', '_blank')}
            className='btn btn-secondary'
          >
            🏠 Dashboard
          </button>
          <button className='btn btn-primary'>+ Create Route</button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='mb-6'>
        <nav className='flex space-x-8'>
          <button
            onClick={() => setActiveTab('routes')}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === 'routes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Current Routes
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === 'optimizer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            ⚡ Route Optimizer (NEW!)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'routes' && (
        <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
          <div className='mb-4 text-6xl'>🚛</div>
          <h3 className='mb-2 text-xl font-semibold text-gray-900'>
            Current Routes View
          </h3>
          <p className='mb-6 text-gray-600'>
            This section shows your existing routes and active deliveries.
            <br />
            Click ""Route Optimizer"" above to see the new AI-powered
            optimization features!
          </p>
          <button
            onClick={() => setActiveTab('optimizer')}
            className='rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700'
          >
            Try Route Optimizer →
          </button>
        </div>
      )}

      {activeTab === 'optimizer' && <RouteOptimizerDashboard />}

      {/* Sticky Notes Section */}
      <div className='mt-8'>
        <StickyNote section='routes' entityId='route-optimization' />
      </div>
    </div>
  );
}
