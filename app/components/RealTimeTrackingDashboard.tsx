'use client';

import { useEffect, useState } from 'react';
import { Load } from '../services/loadService';

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
  heading: number;
}

interface TrackingData {
  loadId: string;
  currentLocation: TrackingLocation;
  status: 'in_transit' | 'at_pickup' | 'at_delivery' | 'delayed' | 'completed';
  eta: string;
  distance: {
    total: number;
    remaining: number;
    traveled: number;
  };
  driver: {
    name: string;
    phone: string;
    id: string;
  };
  vehicle: {
    unit: string;
    make: string;
    model: string;
  };
  milestones: Array<{
    type: 'pickup' | 'checkpoint' | 'delivery';
    location: string;
    expectedTime: string;
    actualTime?: string;
    status: 'pending' | 'completed' | 'delayed';
  }>;
  lastUpdate: string;
}

interface RealTimeTrackingDashboardProps {
  load: Load;
  isModal?: boolean;
  onClose?: () => void;
}

export default function RealTimeTrackingDashboard({
  load,
  isModal = false,
  onClose,
}: RealTimeTrackingDashboardProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock tracking data (in production, this would come from your tracking API)
  useEffect(() => {
    const initializeTracking = () => {
      setTrackingData({
        loadId: load.id,
        currentLocation: {
          lat: 33.749 + Math.random() * 0.1,
          lng: -84.388 + Math.random() * 0.1,
          timestamp: new Date().toISOString(),
          speed: 65 + Math.random() * 10,
          heading: 45,
        },
        status: load.status === 'In Transit' ? 'in_transit' : 'at_pickup',
        eta: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        distance: {
          total: 647,
          remaining: 423,
          traveled: 224,
        },
        driver: {
          name: 'John Smith',
          phone: '(555) 123-4567',
          id: 'DRV-001',
        },
        vehicle: {
          unit: 'TRK-2024-001',
          make: 'Freightliner',
          model: 'Cascadia',
        },
        milestones: [
          {
            type: 'pickup',
            location: load.origin,
            expectedTime: load.pickupDate,
            actualTime:
              load.status !== 'Available'
                ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                : undefined,
            status: load.status !== 'Available' ? 'completed' : 'pending',
          },
          {
            type: 'checkpoint',
            location: 'Macon, GA',
            expectedTime: new Date(
              Date.now() + 1 * 60 * 60 * 1000
            ).toISOString(),
            status: 'pending',
          },
          {
            type: 'delivery',
            location: load.destination,
            expectedTime: load.deliveryDate,
            status: 'pending',
          },
        ],
        lastUpdate: new Date().toISOString(),
      });
      setIsLoading(false);
    };

    initializeTracking();
  }, [load]);

  // Auto-refresh tracking data - TEMPORARILY DISABLED TO FIX INFINITE RENDER
  // useEffect(() => {
  //   if (!autoRefresh || !trackingData) return;

  //   const interval = setInterval(() => {
  //     setTrackingData(prev => {
  //       if (!prev) return prev;

  //       return {
  //         ...prev,
  //         currentLocation: {
  //           ...prev.currentLocation,
  //           lat: prev.currentLocation.lat + (Math.random() - 0.5) * 0.01,
  //           lng: prev.currentLocation.lng + (Math.random() - 0.5) * 0.01,
  //           timestamp: new Date().toISOString(),
  //           speed: 65 + Math.random() * 10
  //         },
  //         distance: {
  //           ...prev.distance,
  //           remaining: Math.max(0, prev.distance.remaining - Math.random() * 5),
  //           traveled: prev.distance.traveled + Math.random() * 5
  //         },
  //         lastUpdate: new Date().toISOString()
  //       };
  //     });
  //   }, 30000); // Update every 30 seconds

  //   return () => clearInterval(interval);
  // }, [autoRefresh, trackingData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'text-green-600 bg-green-100';
      case 'at_pickup':
        return 'text-blue-600 bg-blue-100';
      case 'at_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'delayed':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_transit':
        return '🚛 In Transit';
      case 'at_pickup':
        return '📦 At Pickup';
      case 'at_delivery':
        return '🏢 At Delivery';
      case 'delayed':
        return '⚠️ Delayed';
      case 'completed':
        return '✅ Completed';
      default:
        return '📍 Unknown';
    }
  };

  const calculateProgress = () => {
    if (!trackingData) return 0;
    return Math.round(
      (trackingData.distance.traveled / trackingData.distance.total) * 100
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-lg border border-red-200 bg-red-50 p-6 text-center'>
        <div className='mb-2 text-lg font-medium text-red-600'>
          ⚠️ Tracking Error
        </div>
        <div className='text-red-700'>{error}</div>
      </div>
    );
  }

  if (!trackingData) {
    return (
      <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center'>
        <div className='mb-2 text-lg font-medium text-yellow-600'>
          📍 No Tracking Data
        </div>
        <div className='text-yellow-700'>
          Tracking has not been initialized for this load.
        </div>
      </div>
    );
  }

  const containerClass = isModal
    ? 'bg-white rounded-lg shadow-xl max-w-6xl mx-auto'
    : 'bg-white rounded-lg shadow-lg';

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className='rounded-t-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='flex items-center gap-2 text-2xl font-bold'>
              📍 Real-time Tracking
            </h2>
            <p className='mt-1 text-blue-100'>
              Load {load.id} - Live Location & Status
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(trackingData.status)}`}
            >
              {getStatusText(trackingData.status)}
            </div>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className='text-white transition-colors hover:text-gray-200'
              >
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className='p-6'>
        {/* Quick Stats */}
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-blue-50 p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600'>
              {calculateProgress()}%
            </div>
            <div className='text-sm text-blue-700'>Complete</div>
          </div>
          <div className='rounded-lg bg-green-50 p-4 text-center'>
            <div className='text-2xl font-bold text-green-600'>
              {Math.round(trackingData.currentLocation.speed)}
            </div>
            <div className='text-sm text-green-700'>mph</div>
          </div>
          <div className='rounded-lg bg-purple-50 p-4 text-center'>
            <div className='text-2xl font-bold text-purple-600'>
              {Math.round(trackingData.distance.remaining)}
            </div>
            <div className='text-sm text-purple-700'>mi remaining</div>
          </div>
          <div className='rounded-lg bg-orange-50 p-4 text-center'>
            <div className='text-2xl font-bold text-orange-600'>
              {new Date(trackingData.eta).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className='text-sm text-orange-700'>ETA</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='mb-6'>
          <div className='mb-2 flex justify-between text-sm text-gray-600'>
            <span>{load.origin}</span>
            <span>{calculateProgress()}% Complete</span>
            <span>{load.destination}</span>
          </div>
          <div className='h-2 w-full rounded-full bg-gray-200'>
            <div
              className='h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500'
              style={{ width: `${calculateProgress()}%` }}
             />
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Map Placeholder */}
          <div className='h-64 rounded-lg bg-gray-100 p-6'>
            <div className='flex h-full items-center justify-center text-gray-500'>
              <div className='text-center'>
                <div className='mb-2 text-4xl'>🗺️</div>
                <div className='font-medium'>Interactive Map</div>
                <div className='text-sm'>
                  Current: {trackingData.currentLocation.lat.toFixed(4)},{' '}
                  {trackingData.currentLocation.lng.toFixed(4)}
                </div>
                <div className='mt-2 text-xs text-gray-400'>
                  In production, integrate with Google Maps, Mapbox, or similar
                </div>
              </div>
            </div>
          </div>

          {/* Driver & Vehicle Info */}
          <div className='space-y-4'>
            <div className='rounded-lg bg-gray-50 p-4'>
              <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                👤 Driver Information
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Name:</span>
                  <span className='font-medium'>
                    {trackingData.driver.name}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Phone:</span>
                  <span className='font-medium text-blue-600'>
                    {trackingData.driver.phone}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Driver ID:</span>
                  <span className='font-medium'>{trackingData.driver.id}</span>
                </div>
              </div>
            </div>

            <div className='rounded-lg bg-gray-50 p-4'>
              <h3 className='mb-3 flex items-center gap-2 font-semibold text-gray-900'>
                🚛 Vehicle Information
              </h3>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Unit:</span>
                  <span className='font-medium'>
                    {trackingData.vehicle.unit}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Make/Model:</span>
                  <span className='font-medium'>
                    {trackingData.vehicle.make} {trackingData.vehicle.model}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Equipment:</span>
                  <span className='font-medium'>{load.equipment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className='mt-6'>
          <h3 className='mb-4 flex items-center gap-2 font-semibold text-gray-900'>
            🎯 Delivery Milestones
          </h3>
          <div className='space-y-3'>
            {trackingData.milestones.map((milestone, index) => (
              <div
                key={index}
                className='flex items-center gap-4 rounded-lg bg-gray-50 p-3'
              >
                <div
                  className={`h-3 w-3 flex-shrink-0 rounded-full ${
                    milestone.status === 'completed'
                      ? 'bg-green-500'
                      : milestone.status === 'delayed'
                        ? 'bg-red-500'
                        : 'bg-gray-300'
                  }`}
                 />
                <div className='flex-1'>
                  <div className='font-medium text-gray-900'>
                    {milestone.type === 'pickup'
                      ? '📦'
                      : milestone.type === 'delivery'
                        ? '🏢'
                        : '📍'}{' '}
                    {milestone.location}
                  </div>
                  <div className='text-sm text-gray-600'>
                    Expected:{' '}
                    {new Date(milestone.expectedTime).toLocaleString()}
                    {milestone.actualTime && (
                      <span className='ml-2 text-green-600'>
                        | Actual:{' '}
                        {new Date(milestone.actualTime).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    milestone.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : milestone.status === 'delayed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {milestone.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className='mt-6 flex items-center justify-between rounded-lg bg-gray-50 p-4'>
          <div className='flex items-center gap-4'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className='h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Auto-refresh
              </span>
            </label>
            <button
              onClick={() => {
                // Force refresh tracking data
                setTrackingData((prev) =>
                  prev
                    ? { ...prev, lastUpdate: new Date().toISOString() }
                    : null
                );
              }}
              className='rounded bg-blue-600 px-3 py-1 text-sm text-white transition-colors hover:bg-blue-700'
            >
              🔄 Refresh Now
            </button>
          </div>
          <div className='text-xs text-gray-500'>
            Last updated: {new Date(trackingData.lastUpdate).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
