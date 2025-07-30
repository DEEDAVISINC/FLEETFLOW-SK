'use client';

import { useEffect, useState } from 'react';

interface TrackingData {
  driverId: string;
  driverName: string;
  vehicleId: string;
  currentLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  destination: {
    lat: number;
    lng: number;
    address: string;
  };
  shipmentInfo: {
    loadId: string;
    origin: string;
    destination: string;
    cargo: string;
    weight: string;
    deliveryTime: string;
  };
  status: 'en_route' | 'loading' | 'unloading' | 'break' | 'delivered';
  speed: number;
  direction: string;
  eta: string;
  milesRemaining: number;
  lastUpdated: string;
  route: { lat: number; lng: number }[];
}

interface LiveTrackingMapProps {
  driverId?: string;
  height?: string;
  showFullDetails?: boolean;
}

export default function LiveTrackingMap({
  driverId,
  height = '500px',
  showFullDetails = true,
}: LiveTrackingMapProps) {
  const [selectedDriver, setSelectedDriver] = useState<string | null>(
    driverId || null
  );
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 }); // Center of US
  const [showLabels, setShowLabels] = useState(false); // Toggle for driver labels

  // Mock tracking data - in real app, this would come from GPS/ELD systems
  const mockTrackingData: TrackingData[] = [
    {
      driverId: 'D001',
      driverName: 'John Smith',
      vehicleId: 'V001',
      currentLocation: {
        lat: 33.749,
        lng: -84.388,
        address: 'Atlanta, GA',
      },
      destination: {
        lat: 25.7617,
        lng: -80.1918,
        address: 'Miami, FL',
      },
      shipmentInfo: {
        loadId: 'LOAD-001',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        cargo: 'Electronics',
        weight: '45,000 lbs',
        deliveryTime: '2024-01-16 14:00',
      },
      status: 'en_route',
      speed: 65,
      direction: 'Southeast',
      eta: '8 hours 30 minutes',
      milesRemaining: 485,
      lastUpdated: new Date().toISOString(),
      route: [
        { lat: 33.749, lng: -84.388 },
        { lat: 33.249, lng: -84.188 },
        { lat: 32.749, lng: -84.088 },
        { lat: 31.749, lng: -83.888 },
        { lat: 30.749, lng: -83.588 },
        { lat: 29.749, lng: -82.888 },
        { lat: 28.749, lng: -82.188 },
        { lat: 27.749, lng: -81.888 },
        { lat: 26.749, lng: -81.188 },
        { lat: 25.7617, lng: -80.1918 },
      ],
    },
    {
      driverId: 'D002',
      driverName: 'Sarah Wilson',
      vehicleId: 'V002',
      currentLocation: {
        lat: 41.8781,
        lng: -87.6298,
        address: 'Chicago, IL',
      },
      destination: {
        lat: 40.7128,
        lng: -74.006,
        address: 'New York, NY',
      },
      shipmentInfo: {
        loadId: 'LOAD-002',
        origin: 'Chicago, IL',
        destination: 'New York, NY',
        cargo: 'Medical Supplies',
        weight: '32,000 lbs',
        deliveryTime: '2024-01-17 10:00',
      },
      status: 'break',
      speed: 0,
      direction: 'East',
      eta: '12 hours 15 minutes',
      milesRemaining: 790,
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      route: [
        { lat: 41.8781, lng: -87.6298 },
        { lat: 41.8781, lng: -86.6298 },
        { lat: 41.8781, lng: -85.6298 },
        { lat: 41.8781, lng: -84.6298 },
        { lat: 41.8781, lng: -83.6298 },
        { lat: 41.8781, lng: -82.6298 },
        { lat: 41.8781, lng: -81.6298 },
        { lat: 41.8781, lng: -80.6298 },
        { lat: 41.8781, lng: -79.6298 },
        { lat: 40.7128, lng: -74.006 },
      ],
    },
    {
      driverId: 'D003',
      driverName: 'Mike Johnson',
      vehicleId: 'V003',
      currentLocation: {
        lat: 32.7767,
        lng: -96.797,
        address: 'Dallas, TX',
      },
      destination: {
        lat: 34.0522,
        lng: -118.2437,
        address: 'Los Angeles, CA',
      },
      shipmentInfo: {
        loadId: 'LOAD-003',
        origin: 'Dallas, TX',
        destination: 'Los Angeles, CA',
        cargo: 'Automotive Parts',
        weight: '48,000 lbs',
        deliveryTime: '2024-01-18 16:00',
      },
      status: 'loading',
      speed: 0,
      direction: 'West',
      eta: '18 hours 45 minutes',
      milesRemaining: 1435,
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      route: [
        { lat: 32.7767, lng: -96.797 },
        { lat: 32.7767, lng: -98.797 },
        { lat: 32.7767, lng: -100.797 },
        { lat: 32.7767, lng: -102.797 },
        { lat: 32.7767, lng: -104.797 },
        { lat: 32.7767, lng: -106.797 },
        { lat: 33.7767, lng: -108.797 },
        { lat: 34.7767, lng: -110.797 },
        { lat: 34.7767, lng: -114.797 },
        { lat: 34.0522, lng: -118.2437 },
      ],
    },
  ];

  useEffect(() => {
    setTrackingData(mockTrackingData);

    // Simulate real-time updates - TEMPORARILY DISABLED TO FIX INFINITE RENDER
    // const interval = setInterval(() => {
    //   setTrackingData(prev => prev.map(driver => ({
    //     ...driver,
    //     speed: driver.status === 'en_route' ? Math.max(45, Math.min(75, driver.speed + (Math.random() - 0.5) * 10)) : 0,
    //     milesRemaining: driver.status === 'en_route' ? Math.max(0, driver.milesRemaining - Math.random() * 2) : driver.milesRemaining,
    //     lastUpdated: new Date().toISOString()
    //   })));
    // }, 5000);

    // return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'en_route':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'loading':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'unloading':
        return 'text-purple-700 bg-purple-50 border-purple-200';
      case 'break':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'delivered':
        return 'text-gray-700 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'en_route':
        return '🚛';
      case 'loading':
        return '📦';
      case 'unloading':
        return '📤';
      case 'break':
        return '⏸️';
      case 'delivered':
        return '✅';
      default:
        return '❓';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'en_route':
        return 'En Route';
      case 'loading':
        return 'Loading';
      case 'unloading':
        return 'Unloading';
      case 'break':
        return 'On Break';
      case 'delivered':
        return 'Delivered';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedDriverData = selectedDriver
    ? trackingData.find((d) => d.driverId === selectedDriver)
    : null;

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-lg'>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-white/20'>
              <span className='text-xl'>🗺️</span>
            </div>
            <div>
              <h2 className='text-2xl font-bold'>Live Load Tracking</h2>
              <p className='text-blue-100'>
                Real-time driver and shipment monitoring
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className='h-3 w-3 animate-pulse rounded-full bg-green-400'></div>
            <span className='text-sm'>Live Updates</span>
          </div>
        </div>
      </div>

      <div className='p-6'>
        {/* Driver Selection */}
        {!driverId && (
          <div className='mb-6'>
            <label className='mb-2 block text-sm font-medium text-gray-700'>
              Select Driver to Track:
            </label>
            <select
              value={selectedDriver || ''}
              onChange={(e) => setSelectedDriver(e.target.value || null)}
              className='w-full rounded-lg border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Drivers Overview</option>
              {trackingData.map((driver) => (
                <option key={driver.driverId} value={driver.driverId}>
                  {driver.driverName} - {driver.shipmentInfo.loadId}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Map Display */}
        <div
          className='relative mb-6 overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100'
          style={{ height }}
        >
          {/* Map SVG Visualization */}
          <svg className='h-full w-full' viewBox='0 0 800 400'>
            {/* US Map Outline */}
            <defs>
              <pattern
                id='mapGrid'
                patternUnits='userSpaceOnUse'
                width='40'
                height='40'
              >
                <path
                  d='M 40 0 L 0 0 0 40'
                  fill='none'
                  stroke='#e0e7ff'
                  strokeWidth='1'
                />
              </pattern>
            </defs>
            <rect width='800' height='400' fill='url(#mapGrid)' />

            {/* State Boundaries (simplified) */}
            <g stroke='#cbd5e1' strokeWidth='1' fill='none'>
              <rect x='50' y='50' width='700' height='300' rx='20' />
              <line x1='200' y1='50' x2='200' y2='350' />
              <line x1='350' y1='50' x2='350' y2='350' />
              <line x1='500' y1='50' x2='500' y2='350' />
              <line x1='650' y1='50' x2='650' y2='350' />
              <line x1='50' y1='150' x2='750' y2='150' />
              <line x1='50' y1='250' x2='750' y2='250' />
            </g>

            {/* Routes and Drivers */}
            {trackingData.map((driver, index) => {
              if (selectedDriver && driver.driverId !== selectedDriver)
                return null;

              // Improved collision avoidance with larger offsets
              const gridSize = 50; // Increased grid size for better spacing
              const offsetX = ((index % 5) - 2) * gridSize; // 5x5 grid pattern
              const offsetY = ((Math.floor(index / 5) % 5) - 2) * gridSize;

              const startX =
                ((driver.shipmentInfo.origin.includes('Atlanta')
                  ? -84.388
                  : driver.shipmentInfo.origin.includes('Chicago')
                    ? -87.6298
                    : -96.797) +
                  120) *
                4;
              const startY =
                ((driver.shipmentInfo.origin.includes('Atlanta')
                  ? 33.749
                  : driver.shipmentInfo.origin.includes('Chicago')
                    ? 41.8781
                    : 32.7767) -
                  25) *
                  -8 +
                400;

              const endX = (driver.destination.lng + 120) * 4;
              const endY = (driver.destination.lat - 25) * -8 + 400;

              // Apply larger offset to current position to prevent overlapping
              const currentX = (driver.currentLocation.lng + 120) * 4 + offsetX;
              const currentY =
                (driver.currentLocation.lat - 25) * -8 + 400 + offsetY;

              return (
                <g key={driver.driverId}>
                  {/* Route Line */}
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke='#3b82f6'
                    strokeWidth='3'
                    strokeDasharray='5,5'
                    opacity='0.6'
                  />

                  {/* Origin Point */}
                  <circle
                    cx={startX}
                    cy={startY}
                    r='8'
                    fill='#10b981'
                    stroke='white'
                    strokeWidth='2'
                  />

                  {/* Destination Point */}
                  <circle
                    cx={endX}
                    cy={endY}
                    r='8'
                    fill='#ef4444'
                    stroke='white'
                    strokeWidth='2'
                  />

                  {/* Current Location (Truck) */}
                  <g transform={`translate(${currentX}, ${currentY})`}>
                    <circle
                      r='12'
                      fill='#1d4ed8'
                      stroke='white'
                      strokeWidth='3'
                      className='animate-pulse'
                    />
                    <text
                      textAnchor='middle'
                      dy='5'
                      fontSize='12'
                      fill='white'
                      fontWeight='bold'
                    >
                      🚛
                    </text>
                  </g>

                  {/* Driver Label with Background - Only show when enabled and for selected driver */}
                  {showLabels &&
                    (selectedDriver === driver.driverId ||
                      (!selectedDriver && trackingData.length <= 2)) && (
                      <g>
                        {/* Larger Label Background */}
                        <rect
                          x={currentX - 40}
                          y={currentY - 40}
                          width='80'
                          height='18'
                          fill='rgba(255, 255, 255, 0.95)'
                          stroke='#d1d5db'
                          strokeWidth='1'
                          rx='9'
                          filter='drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
                        />
                        {/* Driver Name Text */}
                        <text
                          x={currentX}
                          y={currentY - 28}
                          textAnchor='middle'
                          fontSize='10'
                          fill='#1f2937'
                          fontWeight='700'
                          fontFamily='system-ui, sans-serif'
                          filter='drop-shadow(0 1px 1px rgba(255,255,255,0.8))'
                        >
                          {driver.driverName.split(' ')[0]}
                        </text>
                      </g>
                    )}
                </g>
              );
            })}
          </svg>

          {/* Enhanced Legend */}
          <div className='absolute top-4 right-4 max-w-xs rounded-xl border border-gray-200/50 bg-white/95 p-4 shadow-xl backdrop-blur-md'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500'>
                <span className='text-xs font-bold text-white'>📍</span>
              </div>
              <div className='text-sm font-bold text-gray-800'>Map Legend</div>
            </div>

            {/* Location Markers */}
            <div className='mb-4 space-y-2.5'>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center space-x-2'>
                  <div className='h-3 w-3 rounded-full border border-white bg-green-500 shadow-sm'></div>
                  <span className='text-xs font-medium text-gray-700'>
                    Pickup Location
                  </span>
                </div>
                <span className='text-xs font-semibold text-green-600'>
                  START
                </span>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center space-x-2'>
                  <div className='h-3 w-3 rounded-full border border-white bg-red-500 shadow-sm'></div>
                  <span className='text-xs font-medium text-gray-700'>
                    Delivery Location
                  </span>
                </div>
                <span className='text-xs font-semibold text-red-600'>END</span>
              </div>
              <div className='flex items-center justify-between gap-3'>
                <div className='flex items-center space-x-2'>
                  <div className='h-3 w-3 animate-pulse rounded-full border border-white bg-blue-600 shadow-sm'></div>
                  <span className='text-xs font-medium text-gray-700'>
                    Driver Position
                  </span>
                </div>
                <span className='text-xs font-semibold text-blue-600'>
                  LIVE
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <div
                  className='h-0.5 w-8 rounded bg-blue-400 opacity-60'
                  style={{
                    background:
                      'repeating-linear-gradient(to right, #3b82f6 0, #3b82f6 4px, transparent 4px, transparent 8px)',
                  }}
                ></div>
                <span className='text-xs font-medium text-gray-700'>
                  Planned Route
                </span>
              </div>
            </div>

            {/* Driver Status Guide */}
            <div className='border-t border-gray-200 pt-3'>
              <div className='mb-2 text-xs font-semibold text-gray-800'>
                Driver Status
              </div>
              <div className='space-y-1.5'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>🚛</span>
                  <span className='text-xs text-gray-600'>
                    En Route - Driving to destination
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>📦</span>
                  <span className='text-xs text-gray-600'>
                    Loading - Picking up cargo
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>⏸️</span>
                  <span className='text-xs text-gray-600'>
                    Break - DOT required rest
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='text-sm'>✅</span>
                  <span className='text-xs text-gray-600'>
                    Delivered - Load completed
                  </span>
                </div>
              </div>
            </div>

            <div className='mt-3 border-t border-gray-200 pt-2'>
              <div className='flex items-center justify-center gap-1'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                <span className='text-xs font-medium text-gray-600'>
                  Real-time Updates
                </span>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className='absolute right-4 bottom-4 flex flex-col gap-3'>
            <button
              onClick={() => setShowLabels(!showLabels)}
              className='group cursor-pointer rounded-xl border border-gray-200/50 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl'
              title={showLabels ? 'Hide Driver Names' : 'Show Driver Names'}
            >
              <div className='flex items-center gap-2'>
                <span
                  className={`text-lg transition-transform group-hover:scale-110 ${showLabels ? 'text-blue-600' : 'text-gray-400'}`}
                >
                  {showLabels ? '🏷️' : '👁️'}
                </span>
                <span className='text-xs font-medium text-gray-700'>
                  {showLabels ? 'Hide Names' : 'Show Names'}
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                const positions = trackingData.map((s) => s.currentLocation);
                if (positions.length > 0) {
                  // Center map on all drivers
                  setMapCenter({
                    lat:
                      positions.reduce((sum, pos) => sum + pos.lat, 0) /
                      positions.length,
                    lng:
                      positions.reduce((sum, pos) => sum + pos.lng, 0) /
                      positions.length,
                  });
                }
              }}
              className='group cursor-pointer rounded-xl border border-gray-200/50 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl'
              title='Center on All Drivers'
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg text-blue-600 transition-transform group-hover:scale-110'>
                  🎯
                </span>
                <span className='text-xs font-medium text-gray-700'>
                  Center Map
                </span>
              </div>
            </button>

            <button
              onClick={() => setSelectedDriver(null)}
              className='group cursor-pointer rounded-xl border border-gray-200/50 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl'
              title='View All Drivers'
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg text-indigo-600 transition-transform group-hover:scale-110'>
                  👁️
                </span>
                <span className='text-xs font-medium text-gray-700'>
                  Show All
                </span>
              </div>
            </button>

            <button
              onClick={() => {
                // Force refresh tracking data
                setTrackingData((prev) =>
                  prev.map((driver) => ({
                    ...driver,
                    lastUpdated: new Date().toISOString(),
                  }))
                );
              }}
              className='group cursor-pointer rounded-xl border border-gray-200/50 bg-white/95 p-3 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-xl'
              title='Refresh Live Data'
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg text-green-600 transition-transform group-hover:scale-110 group-hover:animate-spin'>
                  🔄
                </span>
                <span className='text-xs font-medium text-gray-700'>
                  Refresh
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Driver Details */}
        {selectedDriverData && showFullDetails && (
          <div className='mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* Shipment Info */}
            <div className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6'>
              <h3 className='mb-4 flex items-center text-lg font-bold text-blue-900'>
                📦 Shipment Details
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Load ID:</span>
                  <span className='font-medium text-blue-900'>
                    {selectedDriverData.shipmentInfo.loadId}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Cargo:</span>
                  <span className='font-medium'>
                    {selectedDriverData.shipmentInfo.cargo}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Weight:</span>
                  <span className='font-medium'>
                    {selectedDriverData.shipmentInfo.weight}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Delivery:</span>
                  <span className='font-medium'>
                    {selectedDriverData.shipmentInfo.deliveryTime}
                  </span>
                </div>
                <div className='mt-4 border-t border-blue-200 pt-3'>
                  <div
                    className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${getStatusColor(selectedDriverData.status)} items-center gap-2`}
                  >
                    <span className='text-lg'>
                      {getStatusIcon(selectedDriverData.status)}
                    </span>
                    <span>{getStatusLabel(selectedDriverData.status)}</span>
                    {selectedDriverData.status === 'en_route' && (
                      <div className='ml-1 h-2 w-2 animate-pulse rounded-full bg-green-400'></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Status */}
            <div className='rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6'>
              <h3 className='mb-4 flex items-center text-lg font-bold text-green-900'>
                🚛 Live Status
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Current Speed:</span>
                  <span className='font-medium text-green-900'>
                    {selectedDriverData.speed} mph
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Direction:</span>
                  <span className='font-medium'>
                    {selectedDriverData.direction}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>ETA:</span>
                  <span className='font-medium'>{selectedDriverData.eta}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Miles Remaining:</span>
                  <span className='font-medium'>
                    {Math.round(selectedDriverData.milesRemaining)} miles
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Last Update:</span>
                  <span className='font-medium'>
                    {formatTime(selectedDriverData.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Drivers Summary */}
        {!selectedDriver && (
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {trackingData.map((driver) => (
              <div
                key={driver.driverId}
                className='cursor-pointer rounded-xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-4 transition-all duration-300 hover:shadow-md'
                onClick={() => setSelectedDriver(driver.driverId)}
              >
                <div className='mb-3 flex items-center justify-between'>
                  <div className='font-bold text-gray-900'>
                    {driver.driverName}
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusColor(driver.status)} flex items-center gap-1.5`}
                  >
                    <span className='text-sm'>
                      {getStatusIcon(driver.status)}
                    </span>
                    {getStatusLabel(driver.status)}
                  </span>
                </div>
                <div className='space-y-2 text-sm text-gray-600'>
                  <div className='flex justify-between'>
                    <span>Load:</span>
                    <span className='font-medium'>
                      {driver.shipmentInfo.loadId}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Speed:</span>
                    <span className='font-medium'>{driver.speed} mph</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>ETA:</span>
                    <span className='font-medium'>{driver.eta}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Remaining:</span>
                    <span className='font-medium'>
                      {Math.round(driver.milesRemaining)} mi
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
