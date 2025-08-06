'use client';

import { useEffect, useState } from 'react';

interface MapProps {
  addresses?: string[];
  height?: string;
  zoom?: number;
  mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export default function GoogleMapsEmbed({
  addresses = [],
  height = '400px',
  zoom = 10,
  mapType = 'roadmap',
}: MapProps) {
  const [mapUrl, setMapUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    generateMapUrl();
  }, [addresses, zoom, mapType]);

  const generateMapUrl = () => {
    try {
      if (addresses.length === 0) {
        setMapUrl('');
        return;
      }

      // Google Maps Embed API URL
      const baseUrl = 'https://www.google.com/maps/embed/v1/';

      // You'll need to get a Google Maps API key and add it here
      const apiKey =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
        process.env.GOOGLE_MAPS_API_KEY ||
        'demo-key';

      let url = '';

      if (addresses.length === 1) {
        // Single location - use place mode
        url = `${baseUrl}place?key=${apiKey}&q=${encodeURIComponent(addresses[0])}&zoom=${zoom}&maptype=${mapType}`;
      } else if (addresses.length === 2) {
        // Two locations - use directions mode
        url = `${baseUrl}directions?key=${apiKey}&origin=${encodeURIComponent(addresses[0])}&destination=${encodeURIComponent(addresses[1])}&mode=driving&maptype=${mapType}`;
      } else {
        // Multiple locations - use search mode with waypoints
        const origin = addresses[0];
        const destination = addresses[addresses.length - 1];
        const waypoints = addresses.slice(1, -1).join('|');

        url = `${baseUrl}directions?key=${apiKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}&mode=driving&maptype=${mapType}`;
      }

      // Store both URL and API key for component use
      if (!apiKey || apiKey === 'demo-key') {
        setMapUrl('');
      } else {
        setMapUrl(url);
      }
      setError('');
    } catch (err) {
      setError('Failed to generate map URL');
      console.error('Map URL generation error:', err);
    }
  };

  const openInGoogleMaps = () => {
    if (addresses.length === 0) return;

    let url = 'https://www.google.com/maps/dir/';

    if (addresses.length === 1) {
      url = `https://www.google.com/maps/search/${encodeURIComponent(addresses[0])}`;
    } else {
      url += addresses.map((addr) => encodeURIComponent(addr)).join('/');
    }

    window.open(url, '_blank');
  };

  if (error) {
    return (
      <div
        className='rounded-lg border border-red-200 bg-red-50 p-4'
        style={{ height }}
      >
        <div className='flex h-full items-center justify-center'>
          <div className='text-center'>
            <span className='text-4xl'>🗺️</span>
            <p className='mt-2 text-red-700'>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mapUrl) {
    return (
      <div
        style={{
          height,
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
          <h3
            style={{
              fontSize: '20px',
              fontWeight: '600',
              color: 'white',
              margin: '0 0 12px 0',
            }}
          >
            Live Fleet Tracking
          </h3>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: '0 0 20px 0',
              lineHeight: '1.4',
            }}
          >
            {addresses.length === 0
              ? 'Fleet locations will appear here when vehicles are active'
              : 'Real-time vehicle tracking with live GPS coordinates'}
          </p>
          {addresses.length > 0 && (
            <button
              onClick={openInGoogleMaps}
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: '0 auto',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(20, 184, 166, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span>🔗</span>
              Open in Google Maps
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className='relative overflow-hidden rounded-lg border border-gray-200'
      style={{ height }}
    >
      <iframe
        src={mapUrl}
        width='100%'
        height='100%'
        style={{ border: 0 }}
        allowFullScreen
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
        title='Google Maps'
      />

      <div className='absolute top-2 right-2 flex gap-2'>
        <button
          onClick={openInGoogleMaps}
          className='flex items-center gap-1 rounded border border-gray-200 bg-white px-3 py-1 text-xs shadow-md hover:bg-gray-50'
          title='Open in Google Maps'
        >
          <span>🔗</span>
          Open
        </button>
      </div>
    </div>
  );
}

// Route Planning Component
interface RoutePlannerProps {
  onRouteCalculated?: (route: RouteInfo) => void;
}

interface RouteInfo {
  distance: string;
  duration: string;
  fuelCost: string;
  tollCost: string;
  optimizedRoute: string[];
}

export function RoutePlanner({ onRouteCalculated }: RoutePlannerProps) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [waypoints, setWaypoints] = useState<string[]>(['']);
  const [vehicleType, setVehicleType] = useState('truck');
  const [fuelPrice, setFuelPrice] = useState('3.50');
  const [mpg, setMpg] = useState('6.5');
  const [calculating, setCalculating] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const updateWaypoint = (index: number, value: string) => {
    const updated = [...waypoints];
    updated[index] = value;
    setWaypoints(updated);
  };

  const calculateRoute = async () => {
    if (!origin || !destination) {
      alert('Please enter origin and destination');
      return;
    }

    setCalculating(true);

    try {
      // Mock route calculation - in production, use Google Maps Directions API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockRoute: RouteInfo = {
        distance: '1,247 miles',
        duration: '19h 32m',
        fuelCost: `$${((1247 / parseFloat(mpg)) * parseFloat(fuelPrice)).toFixed(2)}`,
        tollCost: '$87.50',
        optimizedRoute: [
          origin,
          ...waypoints.filter((w) => w.trim()),
          destination,
        ],
      };

      setRouteInfo(mockRoute);
      onRouteCalculated?.(mockRoute);
    } catch (error) {
      alert('Failed to calculate route. Please try again.');
    } finally {
      setCalculating(false);
    }
  };

  return (
    <div className='route-planner rounded-lg border border-gray-200 bg-white p-4'>
      <div className='mb-4 flex items-center gap-2'>
        <span className='text-2xl'>🗺️</span>
        <h3 className='font-semibold text-gray-900'>Route Planner</h3>
      </div>

      <div className='space-y-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Origin
            </label>
            <input
              type='text'
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder='Starting location'
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Destination
            </label>
            <input
              type='text'
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder='Final destination'
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
          </div>
        </div>

        {waypoints.map((waypoint, index) => (
          <div key={index} className='flex gap-2'>
            <input
              type='text'
              value={waypoint}
              onChange={(e) => updateWaypoint(index, e.target.value)}
              placeholder={`Waypoint ${index + 1}`}
              className='flex-1 rounded border border-gray-300 px-3 py-2 text-sm'
            />
            <button
              onClick={() => removeWaypoint(index)}
              className='rounded bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600'
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addWaypoint}
          className='rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600'
        >
          + Add Waypoint
        </button>

        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Vehicle Type
            </label>
            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            >
              <option value='truck'>Truck</option>
              <option value='van'>Van</option>
              <option value='car'>Car</option>
            </select>
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              Fuel Price ($/gal)
            </label>
            <input
              type='number'
              step='0.01'
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
          </div>

          <div>
            <label className='mb-1 block text-sm font-medium text-gray-700'>
              MPG
            </label>
            <input
              type='number'
              step='0.1'
              value={mpg}
              onChange={(e) => setMpg(e.target.value)}
              className='w-full rounded border border-gray-300 px-3 py-2 text-sm'
            />
          </div>

          <div className='flex items-end'>
            <button
              onClick={calculateRoute}
              disabled={calculating}
              className='w-full rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600 disabled:bg-gray-400'
            >
              {calculating ? 'Calculating...' : 'Calculate'}
            </button>
          </div>
        </div>

        {routeInfo && (
          <div className='rounded-lg border border-green-200 bg-green-50 p-4'>
            <h4 className='mb-2 font-medium text-green-900'>
              Route Information
            </h4>
            <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
              <div>
                <span className='font-medium text-green-700'>Distance:</span>
                <p className='text-green-900'>{routeInfo.distance}</p>
              </div>
              <div>
                <span className='font-medium text-green-700'>Duration:</span>
                <p className='text-green-900'>{routeInfo.duration}</p>
              </div>
              <div>
                <span className='font-medium text-green-700'>Fuel Cost:</span>
                <p className='text-green-900'>{routeInfo.fuelCost}</p>
              </div>
              <div>
                <span className='font-medium text-green-700'>Toll Cost:</span>
                <p className='text-green-900'>{routeInfo.tollCost}</p>
              </div>
            </div>
          </div>
        )}

        {(origin || destination) && (
          <div className='mt-4'>
            <GoogleMapsEmbed
              addresses={[origin, destination].filter(Boolean)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
