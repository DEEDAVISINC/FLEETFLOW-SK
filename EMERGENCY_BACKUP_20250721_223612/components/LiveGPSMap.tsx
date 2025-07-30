'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GPSTrackingService } from '../services/gps-tracking';
import { WeatherService } from '../services/weather';

interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: string;
  city?: string;
  state?: string;
  address?: string;
}

interface WeatherData {
  location: {
    city: string;
    state: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    conditions: string;
    icon: string;
    pressure: number;
    dewPoint: number;
    uvIndex: number;
  };
  forecast: Array<{
    date: string;
    high: number;
    low: number;
    conditions: string;
    icon: string;
    precipitation: number;
  }>;
  alerts: Array<{
    id: string;
    title: string;
    description: string;
    severity: 'minor' | 'moderate' | 'severe' | 'extreme';
    startTime: string;
    endTime: string;
    areas: string[];
  }>;
  lastUpdated: string;
}

interface LiveGPSMapProps {
  driverId: string;
  height?: string;
  width?: string;
  autoStartTracking?: boolean;
}

export const LiveGPSMap: React.FC<LiveGPSMapProps> = ({
  driverId,
  height = '400px',
  width = '100%',
  autoStartTracking = true
}) => {
  const [currentLocation, setCurrentLocation] = useState<GPSLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<GPSLocation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  // Check if Google Maps is available
  const isGoogleMapsAvailable = typeof window !== 'undefined' && window.google && window.google.maps;

  useEffect(() => {
    checkGeolocationPermission();
    
    if (autoStartTracking) {
      startTracking();
    }

    // Listen for location updates
    const handleLocationUpdate = (event: any) => {
      const { driverId: updatedDriverId, location } = event.detail;
      if (updatedDriverId === driverId) {
        setCurrentLocation(location);
        setLocationHistory(prev => [...prev.slice(-99), location]); // Keep last 100 locations
        
        // Fetch weather data for new location
        fetchWeatherData(location.latitude, location.longitude);
      }
    };

    const handleLocationError = (event: any) => {
      const { driverId: errorDriverId, error: errorMessage } = event.detail;
      if (errorDriverId === driverId) {
        setError(errorMessage);
      }
    };

    window.addEventListener('locationUpdate', handleLocationUpdate);
    window.addEventListener('locationError', handleLocationError);

    return () => {
      window.removeEventListener('locationUpdate', handleLocationUpdate);
      window.removeEventListener('locationError', handleLocationError);
      stopTracking();
    };
  }, [driverId, autoStartTracking]);

  const checkGeolocationPermission = async () => {
    try {
      if (!navigator.geolocation) {
        setError('Geolocation not supported');
        setHasPermission(false);
        return;
      }

      const permission = await navigator.permissions.query({name: 'geolocation'});
      setHasPermission(permission.state === 'granted');
      
      if (permission.state === 'prompt') {
        setHasPermission(null); // Will be determined when user responds
      }
    } catch (err) {
      console.warn('Permission API not available');
      setHasPermission(null);
    }
  };

  const startTracking = async () => {
    try {
      setError(null);
      const success = await GPSTrackingService.startTracking(driverId);
      if (success) {
        setIsTracking(true);
        
        // Get initial location
        const initialLocation = await GPSTrackingService.getCurrentLocation(driverId);
        if (initialLocation) {
          setCurrentLocation(initialLocation);
          setLocationHistory([initialLocation]);
          
          // Fetch weather data for initial location
          fetchWeatherData(initialLocation.latitude, initialLocation.longitude);
        }
      } else {
        setError('Failed to start GPS tracking');
      }
    } catch (err) {
      setError('Error starting GPS tracking');
      console.error(err);
    }
  };

  const stopTracking = async () => {
    try {
      await GPSTrackingService.stopTracking(driverId);
      setIsTracking(false);
    } catch (err) {
      console.error('Error stopping tracking:', err);
    }
  };

  const requestPermission = async () => {
    try {
      const location = await GPSTrackingService.getCurrentLocation(driverId);
      if (location) {
        setHasPermission(true);
        setCurrentLocation(location);
        if (autoStartTracking) {
          startTracking();
        }
      }
    } catch (err) {
      setError('Location permission denied');
      setHasPermission(false);
    }
  };

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setWeatherLoading(true);
      const weather = await WeatherService.getCurrentWeather(latitude, longitude);
      setWeatherData(weather);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setWeatherLoading(false);
    }
  };

  // Render permission request UI
  if (hasPermission === false) {
    return (
      <div style={{
        height,
        width,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <span style={{ fontSize: '48px', marginBottom: '16px' }}>📍</span>
        <h3 style={{ color: 'white', marginBottom: '16px', textAlign: 'center' }}>
          Location Permission Required
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: '24px' }}>
          To show live GPS tracking, we need access to your location.
        </p>
        <button
          onClick={requestPermission}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.4)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)';
          }}
        >
          Enable Location Tracking
        </button>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div style={{
        height,
        width,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        border: '1px solid rgba(239, 68, 68, 0.4)'
      }}>
        <span style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</span>
        <h3 style={{ color: '#ef4444', marginBottom: '16px', textAlign: 'center' }}>
          GPS Tracking Error
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: '24px' }}>
          {error}
        </p>
        <button
          onClick={startTracking}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
          }}
        >
          Retry GPS Tracking
        </button>
      </div>
    );
  }

  // Render loading state
  if (!currentLocation) {
    return (
      <div style={{
        height,
        width,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255, 255, 255, 0.3)',
          borderTop: '3px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '16px'
        }} />
        <p style={{ color: 'white', textAlign: 'center' }}>
          Getting your location...
        </p>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Render map with location data
  return (
    <div style={{
      height,
      width,
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'relative'
    }}>
      {/* Map Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '600' }}>
          🗺️ Live GPS & Weather
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div style={{
            padding: '4px 8px',
            borderRadius: '12px',
            background: isTracking ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${isTracking ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            fontSize: '12px',
            color: 'white',
            fontWeight: '500'
          }}>
            {isTracking ? '🟢 Live' : '🔴 Stopped'}
          </div>
          <button
            onClick={isTracking ? stopTracking : startTracking}
            style={{
              padding: '4px 8px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '500'
            }}
          >
            {isTracking ? 'Stop' : 'Start'}
          </button>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
              Weather Alert
            </span>
          </div>
          {weatherData.alerts.map(alert => (
            <div key={alert.id} style={{ marginBottom: '4px' }}>
              <div style={{ color: 'white', fontSize: '12px', fontWeight: '500' }}>
                {alert.title}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
                {alert.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map Display */}
      <div style={{
        height: 'calc(100% - 120px)',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Simple map visualization */}
        <div style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(45deg, 
            rgba(34, 197, 94, 0.1) 0%, 
            rgba(59, 130, 246, 0.1) 50%, 
            rgba(168, 85, 247, 0.1) 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* Location marker */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '32px',
            animation: 'pulse 2s infinite'
          }}>
            📍
          </div>
          
          {/* Accuracy circle */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: `${Math.min(currentLocation.accuracy / 10, 100)}px`,
            height: `${Math.min(currentLocation.accuracy / 10, 100)}px`,
            border: '2px solid rgba(34, 197, 94, 0.5)',
            borderRadius: '50%',
            animation: 'pulse 3s infinite'
          }} />
          
          {/* Speed indicator */}
          {currentLocation.speed && currentLocation.speed > 0 && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(245, 158, 11, 0.8)',
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🚛 {Math.round(currentLocation.speed * 2.237)} mph
            </div>
          )}
          
          {/* Weather indicator */}
          {weatherData?.current && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(59, 130, 246, 0.8)',
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span>{weatherData.current.icon}</span>
              <span>{weatherData.current.temperature}°F</span>
            </div>
          )}
          
          {/* Heading indicator */}
          {currentLocation.heading && (
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              background: 'rgba(168, 85, 247, 0.8)',
              padding: '8px 12px',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              🧭 {Math.round(currentLocation.heading)}°
            </div>
          )}
        </div>
        
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(1.1); }
            100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `}</style>
      </div>

      {/* Location & Weather Info */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '12px',
        fontSize: '12px'
      }}>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
            📍 Location
          </div>
          <div style={{ color: 'white', fontWeight: '500' }}>
            {currentLocation.city || 'Unknown'}, {currentLocation.state || 'Unknown'}
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
            🎯 Accuracy
          </div>
          <div style={{ color: 'white', fontWeight: '500' }}>
            ±{Math.round(currentLocation.accuracy)}m
          </div>
        </div>
        <div>
          <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
            🕐 Last Update
          </div>
          <div style={{ color: 'white', fontWeight: '500' }}>
            {new Date(currentLocation.timestamp).toLocaleTimeString()}
          </div>
        </div>
        {weatherData?.current && (
          <>
            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                🌡️ Weather
              </div>
              <div style={{ color: 'white', fontWeight: '500' }}>
                {weatherData.current.temperature}°F - {weatherData.current.conditions}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                💨 Wind
              </div>
              <div style={{ color: 'white', fontWeight: '500' }}>
                {weatherData.current.windSpeed} mph {weatherData.current.windDirection}
              </div>
            </div>
            <div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>
                👁️ Visibility
              </div>
              <div style={{ color: 'white', fontWeight: '500' }}>
                {weatherData.current.visibility} miles
              </div>
            </div>
          </>
        )}
      </div>

      {/* Driving Conditions */}
      {weatherData?.current && (() => {
        const conditions = WeatherService.getDrivingConditions(weatherData.current);
        return (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: conditions.safety === 'good' ? 'rgba(34, 197, 94, 0.2)' : 
                       conditions.safety === 'caution' ? 'rgba(245, 158, 11, 0.2)' : 
                       conditions.safety === 'poor' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            border: `1px solid ${conditions.safety === 'good' ? 'rgba(34, 197, 94, 0.4)' : 
                                conditions.safety === 'caution' ? 'rgba(245, 158, 11, 0.4)' : 
                                conditions.safety === 'poor' ? 'rgba(249, 115, 22, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '16px' }}>
                {conditions.safety === 'good' ? '✅' : 
                 conditions.safety === 'caution' ? '⚠️' : 
                 conditions.safety === 'poor' ? '🚨' : '🛑'}
              </span>
              <span style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}>
                Driving Conditions: {conditions.safety.charAt(0).toUpperCase() + conditions.safety.slice(1)}
              </span>
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px', marginBottom: '8px' }}>
              {conditions.message}
            </div>
            {conditions.recommendations.length > 0 && (
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '11px' }}>
                {conditions.recommendations.map((rec, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>
                    • {rec}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}; 