'use client';

import { useEffect, useState } from 'react';
import { useFeatureFlag } from '../config/feature-flags';

interface WeatherAlert {
  id: string;
  type: 'storm' | 'tornado' | 'flood' | 'winter' | 'heat' | 'wind';
  severity: 'low' | 'medium' | 'high' | 'extreme';
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
  startTime: string;
  endTime: string;
  affectedRoutes: string[];
  recommendedActions: string[];
}

interface RouteWeatherAnalysis {
  routeId: string;
  origin: string;
  destination: string;
  currentWeather: {
    temperature: number;
    condition: string;
    windSpeed: number;
    visibility: number;
    precipitation: number;
  };
  weatherAlerts: WeatherAlert[];
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  recommendedDelay: number; // minutes
  alternativeRoutes: string[];
  safetyRecommendations: string[];
}

interface WeatherIntegrationConfig {
  enableRealTimeTracking: boolean;
  enableStormAvoidance: boolean;
  enableRouteOptimization: boolean;
  alertThresholds: {
    windSpeed: number;
    visibility: number;
    precipitation: number;
  };
  updateInterval: number; // seconds
}

export default function AdvancedWeatherIntegration() {
  const isEnabled = useFeatureFlag('ADVANCED_WEATHER_INTEGRATION');
  const forceEnabled = true; // TEMP: Force enable for debugging
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
  const [routeAnalysis, setRouteAnalysis] = useState<RouteWeatherAnalysis[]>(
    []
  );
  const [config, setConfig] = useState<WeatherIntegrationConfig>({
    enableRealTimeTracking: true,
    enableStormAvoidance: true,
    enableRouteOptimization: true,
    alertThresholds: {
      windSpeed: 25,
      visibility: 5,
      precipitation: 0.5,
    },
    updateInterval: 300,
  });
  const [loading, setLoading] = useState(false);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simplified data loading - load immediately when mounted and enabled
  useEffect(() => {
    if (mounted && forceEnabled) {
      console.info('Weather component mounted and enabled - loading data...');
      loadWeatherData();
    }
  }, [mounted, forceEnabled]);

  const loadWeatherData = async () => {
    console.info('🌤️ loadWeatherData called');
    setLoading(true);
    try {
      console.info('🌤️ Fetching weather data from /api/weather/current-alerts');
      const response = await fetch('/api/weather/current-alerts');
      console.info('🌤️ Response status:', response.status);
      if (response.ok) {
        const data = await response.json();

        // Set the actual data from API
        if (data.alerts && data.alerts.length > 0) {
          setWeatherAlerts(data.alerts);
        }
        if (data.routeAnalysis && data.routeAnalysis.length > 0) {
          setRouteAnalysis(data.routeAnalysis);
        }
      } else {
        // If API fails, set demo data so component shows something
        setWeatherAlerts([
          {
            id: 'demo-1',
            type: 'storm',
            severity: 'high',
            location: 'Kansas City, MO',
            coordinates: { lat: 39.0997, lng: -94.5786 },
            description: 'Severe thunderstorm warning - Demo data',
            startTime: new Date().toISOString(),
            endTime: new Date(Date.now() + 3600000).toISOString(),
            affectedRoutes: ['route-001'],
            recommendedActions: ['Monitor conditions'],
          },
        ]);
        setRouteAnalysis([
          {
            routeId: 'demo-route',
            origin: 'Chicago, IL',
            destination: 'Kansas City, MO',
            currentWeather: {
              temperature: 75,
              condition: 'Partly Cloudy',
              windSpeed: 12,
              visibility: 8,
              precipitation: 0.1,
            },
            weatherAlerts: [],
            riskLevel: 'medium',
            recommendedDelay: 30,
            alternativeRoutes: ['I-80 via Des Moines'],
            safetyRecommendations: ['Monitor weather conditions'],
          },
        ]);
      }
    } catch (error) {
      console.error('Weather API error:', error);
      // Set demo data on error
      setWeatherAlerts([
        {
          id: 'demo-error',
          type: 'storm',
          severity: 'medium',
          location: 'Demo Location',
          coordinates: { lat: 40.7128, lng: -74.006 },
          description: 'Demo alert - API connection issue',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          affectedRoutes: ['demo-route'],
          recommendedActions: ['Check connection'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      case 'extreme':
        return '#7c2d12';
      default:
        return '#6b7280';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'storm':
        return '⛈️';
      case 'tornado':
        return '🌪️';
      case 'flood':
        return '🌊';
      case 'winter':
        return '❄️';
      case 'heat':
        return '🔥';
      case 'wind':
        return '💨';
      default:
        return '⚠️';
    }
  };

  if (!forceEnabled) {
    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌤️</div>
        <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '12px' }}>
          Advanced Weather Integration
        </h3>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>
          Enable ADVANCED_WEATHER_INTEGRATION=true to access storm avoidance and
          weather routing features
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '32px',
        border: '2px solid rgba(59, 130, 246, 0.6)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🌤️</span>
          </div>
          <div>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              Advanced Weather Integration
            </h2>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.95)',
                margin: '0',
              }}
            >
              Real-time storm avoidance and weather-optimized routing
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
              }}
             />
            <span
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Live Weather Active
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '32px',
          border: '2px solid rgba(59, 130, 246, 0.4)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            flex: '1',
            background:
              activeTab === 'dashboard'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.2)',
            color: activeTab === 'dashboard' ? '#4c1d95' : 'white',
            transform:
              activeTab === 'dashboard' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:
              activeTab === 'dashboard'
                ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                : 'none',
          }}
          onClick={() => setActiveTab('dashboard')}
        >
          <span style={{ marginRight: '8px' }}>📊</span>Weather Dashboard
        </button>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            flex: '1',
            background:
              activeTab === 'alerts'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.2)',
            color: activeTab === 'alerts' ? '#4c1d95' : 'white',
            transform:
              activeTab === 'alerts' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:
              activeTab === 'alerts'
                ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                : 'none',
          }}
          onClick={() => setActiveTab('alerts')}
        >
          <span style={{ marginRight: '8px' }}>⚠️</span>Storm Alerts
        </button>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            flex: '1',
            background:
              activeTab === 'routes'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.2)',
            color: activeTab === 'routes' ? '#4c1d95' : 'white',
            transform:
              activeTab === 'routes' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:
              activeTab === 'routes'
                ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                : 'none',
          }}
          onClick={() => setActiveTab('routes')}
        >
          <span style={{ marginRight: '8px' }}>🗺️</span>Route Analysis
        </button>
        <button
          style={{
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            flex: '1',
            background:
              activeTab === 'settings'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.2)',
            color: activeTab === 'settings' ? '#4c1d95' : 'white',
            transform:
              activeTab === 'settings' ? 'translateY(-2px)' : 'translateY(0)',
            boxShadow:
              activeTab === 'settings'
                ? '0 8px 25px rgba(0, 0, 0, 0.15)'
                : 'none',
          }}
          onClick={() => setActiveTab('settings')}
        >
          <span style={{ marginRight: '8px' }}>⚙️</span>Settings
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Weather Overview Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {
                  weatherAlerts.filter(
                    (alert) =>
                      alert.severity === 'high' || alert.severity === 'extreme'
                  ).length
                }
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Active Alerts
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(16, 185, 129, 0.4)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚛</div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {
                  routeAnalysis.filter((route) => route.riskLevel === 'low')
                    .length
                }
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Safe Routes
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(239, 68, 68, 0.4)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏰</div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {routeAnalysis.reduce(
                  (total, route) => total + route.recommendedDelay,
                  0
                )}
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Total Delay (min)
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔄</div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  marginBottom: '4px',
                }}
              >
                {
                  routeAnalysis.filter(
                    (route) => route.alternativeRoutes.length > 0
                  ).length
                }
              </div>
              <div
                style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Route Changes
              </div>
            </div>
          </div>

          {/* Current Weather Conditions */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(59, 130, 246, 0.4)',
            }}
          >
            <h3
              style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
            >
              Current Weather Conditions
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px',
              }}
            >
              {routeAnalysis.slice(0, 4).map((route, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      marginBottom: '8px',
                    }}
                  >
                    {route.origin} → {route.destination}
                  </div>
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {route.currentWeather.temperature}°F
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {route.currentWeather.condition} | Wind:{' '}
                    {route.currentWeather.windSpeed} mph
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3
            style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
          >
            Active Weather Alerts
          </h3>
          {weatherAlerts.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p>No active weather alerts</p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {weatherAlerts.map((alert, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: `2px solid ${getSeverityColor(alert.severity)}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontSize: '24px' }}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div style={{ flex: '1' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {alert.type.charAt(0).toUpperCase() +
                            alert.type.slice(1)}{' '}
                          Warning
                        </span>
                        <span
                          style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: getSeverityColor(alert.severity),
                            color: 'white',
                          }}
                        >
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {alert.location} •{' '}
                        {new Date(alert.startTime).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.9)',
                      marginBottom: '12px',
                    }}
                  >
                    {alert.description}
                  </p>
                  <div
                    style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}
                  >
                    {alert.recommendedActions.map((action, actionIndex) => (
                      <span
                        key={actionIndex}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                        }}
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3
            style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
          >
            Route Weather Analysis
          </h3>
          {routeAnalysis.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '32px',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
              <p>No routes currently being analyzed</p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              {routeAnalysis.map((route, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: `2px solid ${getSeverityColor(route.riskLevel)}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                          marginBottom: '4px',
                        }}
                      >
                        Route {route.routeId}
                      </div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {route.origin} → {route.destination}
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: getSeverityColor(route.riskLevel),
                          color: 'white',
                        }}
                      >
                        {route.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      marginBottom: '16px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                        }}
                      >
                        Current Weather
                      </div>
                      <div style={{ fontSize: '16px', color: 'white' }}>
                        {route.currentWeather.temperature}°F,{' '}
                        {route.currentWeather.condition}
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                        }}
                      >
                        Wind Speed
                      </div>
                      <div style={{ fontSize: '16px', color: 'white' }}>
                        {route.currentWeather.windSpeed} mph
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                        }}
                      >
                        Visibility
                      </div>
                      <div style={{ fontSize: '16px', color: 'white' }}>
                        {route.currentWeather.visibility} miles
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '4px',
                        }}
                      >
                        Recommended Delay
                      </div>
                      <div style={{ fontSize: '16px', color: 'white' }}>
                        {route.recommendedDelay} minutes
                      </div>
                    </div>
                  </div>

                  {route.weatherAlerts.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                        }}
                      >
                        Weather Alerts
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '8px',
                        }}
                      >
                        {route.weatherAlerts.map((alert, alertIndex) => (
                          <span
                            key={alertIndex}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              background: getSeverityColor(alert.severity),
                              color: 'white',
                            }}
                          >
                            {getAlertIcon(alert.type)} {alert.type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {route.safetyRecommendations.length > 0 && (
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          marginBottom: '8px',
                        }}
                      >
                        Safety Recommendations
                      </div>
                      <ul style={{ margin: '0', paddingLeft: '20px' }}>
                        {route.safetyRecommendations.map((rec, recIndex) => (
                          <li
                            key={recIndex}
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              marginBottom: '4px',
                            }}
                          >
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <h3
            style={{ color: 'white', fontSize: '18px', marginBottom: '16px' }}
          >
            Weather Integration Settings
          </h3>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(59, 130, 246, 0.4)',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}
            >
              Feature Toggles
            </h4>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {Object.entries({
                'Real-time Weather Tracking': config.enableRealTimeTracking,
                'Storm Avoidance': config.enableStormAvoidance,
                'Route Optimization': config.enableRouteOptimization,
              }).map(([label, value]) => (
                <label
                  key={label}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <input
                    type='checkbox'
                    checked={value}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        [label.toLowerCase().replace(/\s+/g, '')]:
                          e.target.checked,
                      }))
                    }
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: '#3b82f6',
                    }}
                  />
                  <span style={{ fontSize: '14px', color: 'white' }}>
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(16, 185, 129, 0.4)',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}
            >
              Alert Thresholds
            </h4>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
                  Wind Speed (mph)
                </label>
                <input
                  type='number'
                  value={config.alertThresholds.windSpeed}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      alertThresholds: {
                        ...prev.alertThresholds,
                        windSpeed: parseInt(e.target.value),
                      },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
                  Visibility (miles)
                </label>
                <input
                  type='number'
                  value={config.alertThresholds.visibility}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      alertThresholds: {
                        ...prev.alertThresholds,
                        visibility: parseInt(e.target.value),
                      },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '8px',
                  }}
                >
                  Precipitation (inches)
                </label>
                <input
                  type='number'
                  step='0.1'
                  value={config.alertThresholds.precipitation}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      alertThresholds: {
                        ...prev.alertThresholds,
                        precipitation: parseFloat(e.target.value),
                      },
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid rgba(139, 92, 246, 0.4)',
            }}
          >
            <h4
              style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}
            >
              Update Frequency
            </h4>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                }}
              >
                Update Interval (seconds)
              </label>
              <input
                type='number'
                value={config.updateInterval}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    updateInterval: parseInt(e.target.value),
                  }))
                }
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
