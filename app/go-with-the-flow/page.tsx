'use client';

import { useEffect, useState } from 'react';

interface DriverLocation {
  driverId: string;
  name: string;
  lat: number;
  lng: number;
  isOnline: boolean;
  equipmentType: string;
  rating: number;
  eta: string;
  distance: string;
}

interface AvailableLoad {
  id: string;
  pickup: string;
  delivery: string;
  rate: string;
  distance: string;
  urgency: 'low' | 'medium' | 'high';
  equipmentType: string;
  weight: number;
  estimatedTime: string;
}

interface LoadOffer {
  id: string;
  loadId: string;
  driverId: string;
  rate: number;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export default function GoWithTheFlowPage() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'dispatch' | 'drivers' | 'shippers' | 'analytics'
  >('dashboard');
  const [onlineDrivers, setOnlineDrivers] = useState<DriverLocation[]>([]);
  const [availableLoads, setAvailableLoads] = useState<AvailableLoad[]>([]);
  const [activeOffers, setActiveOffers] = useState<LoadOffer[]>([]);
  const [systemMetrics, setSystemMetrics] = useState({
    totalDriversOnline: 0,
    activeLoads: 0,
    successRate: 0,
    avgResponseTime: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeActivity, setRealTimeActivity] = useState([
    {
      id: 1,
      message: 'Driver Mike Rodriguez accepted load ATL→MIA',
      time: '2 min ago',
      type: 'success',
    },
    {
      id: 2,
      message: 'New load posted: HOU→DAL ($850)',
      time: '3 min ago',
      type: 'info',
    },
    {
      id: 3,
      message: 'Sarah Johnson went online in Dallas area',
      time: '5 min ago',
      type: 'driver',
    },
    {
      id: 4,
      message: 'Load CHI→DET delivered successfully',
      time: '8 min ago',
      type: 'success',
    },
    {
      id: 5,
      message: 'Emergency load: PHX→LAX (URGENT)',
      time: '10 min ago',
      type: 'urgent',
    },
  ]);
  const [pulseAnimation, setPulseAnimation] = useState(true);

  useEffect(() => {
    // Fetch initial data
    fetchSystemData();

    // Set up real-time updates
    const interval = setInterval(fetchSystemData, 5000);

    // Simulate real-time activity updates
    const activityInterval = setInterval(() => {
      const activities = [
        'Driver John Smith accepted load NYC→BOS',
        'New urgent load posted: MIA→ATL ($1,200)',
        'Driver Lisa Chen completed delivery in Chicago',
        'Load LAX→PHX now in transit',
        'Emergency pickup requested in Houston',
        'Driver Mark Wilson went online in Denver',
        'Load DFW→AUS delivered on time',
        'New shipper registered: ABC Logistics',
      ];

      const newActivity = {
        id: Date.now(),
        message: activities[Math.floor(Math.random() * activities.length)],
        time: 'Just now',
        type: ['success', 'info', 'driver', 'urgent'][
          Math.floor(Math.random() * 4)
        ],
      };

      setRealTimeActivity((prev) => [newActivity, ...prev.slice(0, 9)]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(activityInterval);
    };
  }, []);

  const fetchSystemData = async () => {
    try {
      const [driversRes, loadsRes, metricsRes] = await Promise.all([
        fetch('/api/go-with-the-flow?action=available-drivers'),
        fetch('/api/go-with-the-flow?action=available-loads'),
        fetch('/api/go-with-the-flow?action=system-metrics'),
      ]);

      const drivers = await driversRes.json();
      const loads = await loadsRes.json();
      const metrics = await metricsRes.json();

      if (drivers.success) setOnlineDrivers(drivers.data || []);
      if (loads.success) setAvailableLoads(loads.data || []);
      if (metrics.success)
        setSystemMetrics(
          metrics.data || {
            totalDriversOnline: 0,
            activeLoads: 0,
            successRate: 0,
            avgResponseTime: 0,
            totalRevenue: 0,
          }
        );
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching system data:', error);
      setIsLoading(false);
    }
  };

  const handleRequestTruck = async (requestData: any) => {
    try {
      const response = await fetch('/api/go-with-the-flow/shipper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-truck',
          ...requestData,
        }),
      });
      const result = await response.json();
      if (result.success) {
        alert(
          `Load request submitted! Expected pickup: ${result.data.estimatedArrival}`
        );
        fetchSystemData(); // Refresh data
      }
    } catch (error) {
      console.error('Error requesting truck:', error);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
          color: 'white',
          fontSize: '1.2rem',
        }}
      >
        ⚡ Loading Go With the Flow...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: 'linear-gradient(90deg, #f97316, #ea580c, #f97316)',
            borderRadius: '20px 20px 0 0',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h1
              style={{
                color: 'white',
                fontSize: '2.5rem',
                fontWeight: '700',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              ⚡ Go With the Flow
            </h1>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '1.1rem',
                margin: '0',
              }}
            >
              Real-time freight matching • Advanced logistics platform
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                padding: '12px 16px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow:
                  '0 8px 25px rgba(16, 185, 129, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(0)',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  height: '2px',
                  background:
                    'linear-gradient(90deg, transparent, #34d399, transparent)',
                  animation: 'shimmer 2s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  color: '#34d399',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  animation: 'countUp 0.5s ease-out',
                }}
              >
                {systemMetrics?.totalDriversOnline || 0}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.8rem',
                }}
              >
                Drivers Online
              </div>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '16px',
                padding: '12px 16px',
                textAlign: 'center',
                boxShadow:
                  '0 8px 25px rgba(59, 130, 246, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(0)',
              }}
            >
              <div
                style={{
                  color: '#60a5fa',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                {systemMetrics?.activeLoads || 0}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.8rem',
                }}
              >
                Active Loads
              </div>
            </div>
            <div
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                borderRadius: '16px',
                padding: '12px 16px',
                textAlign: 'center',
                boxShadow:
                  '0 8px 25px rgba(249, 115, 22, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                transform: 'translateZ(0)',
              }}
            >
              <div
                style={{
                  color: '#fb923c',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                }}
              >
                {systemMetrics?.successRate || 0}%
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.8rem',
                }}
              >
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(15px)',
          borderRadius: '16px',
          padding: '8px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          position: 'relative',
        }}
      >
        {[
          {
            key: 'dashboard',
            label: '📊 Flow Board',
            color: '#3b82f6',
            badge: realTimeActivity.filter((a) => a.type === 'urgent').length,
          },
          {
            key: 'dispatch',
            label: '🚛 Dispatch Central Flow',
            color: '#f97316',
          },
          {
            key: 'drivers',
            label: '👨‍💼 Driver Flow',
            color: '#10b981',
            badge: onlineDrivers?.length > 0 ? onlineDrivers.length : undefined,
          },
          { key: 'shippers', label: '📦 Shippers', color: '#8b5cf6' },
          { key: 'analytics', label: '📈 Analytics', color: '#8b5cf6' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background:
                activeTab === tab.key
                  ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)`
                  : `linear-gradient(135deg, ${tab.color}60, ${tab.color}40)`,
              color: 'white',
              border:
                activeTab === tab.key
                  ? `1px solid ${tab.color}`
                  : `1px solid ${tab.color}80`,
              padding: '12px 20px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              flex: 1,
              textAlign: 'center',
              position: 'relative',
              boxShadow:
                activeTab === tab.key
                  ? `0 8px 25px ${tab.color}40, 0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)`
                  : `0 4px 12px ${tab.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
              transform: 'translateZ(0)',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = `linear-gradient(135deg, ${tab.color}80, ${tab.color}60)`;
                e.currentTarget.style.transform =
                  'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${tab.color}30, 0 4px 12px rgba(0, 0, 0, 0.15)`;
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.key) {
                e.currentTarget.style.background = `linear-gradient(135deg, ${tab.color}60, ${tab.color}40)`;
                e.currentTarget.style.transform = 'translateZ(0)';
                e.currentTarget.style.boxShadow = `0 4px 12px ${tab.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
              }
            }}
          >
            {tab.label}
            {tab.badge && tab.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  animation: 'pulse 2s infinite',
                  boxShadow:
                    '0 4px 12px rgba(239, 68, 68, 0.4), 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(15px)',
          borderRadius: '24px',
          padding: '30px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.3), 0 8px 25px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
          minHeight: '600px',
          position: 'relative',
        }}
      >
        {activeTab === 'dashboard' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                marginBottom: '24px',
              }}
            >
              🎯 Live Operations Board
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {/* Live Driver Map */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h3 style={{ color: 'white', marginBottom: '16px' }}>
                  🗺️ Live Driver Locations
                </h3>
                <div
                  style={{
                    height: '200px',
                    background: 'rgba(0,0,0,0.3)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.6)',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                      🗺️
                    </div>
                    <div>Interactive Map Coming Soon</div>
                    <div style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      {onlineDrivers?.length || 0} drivers currently online
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Load Monitor */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 12px 40px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  transform: 'translateZ(0)',
                }}
              >
                <h3 style={{ color: 'white', marginBottom: '16px' }}>
                  📢 Available Load Monitor
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {availableLoads?.slice(0, 3).map((load, index) => (
                    <div
                      key={index}
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.4)',
                        borderRadius: '12px',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        boxShadow:
                          '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                      onClick={() => {
                        alert(
                          `⚡ Broadcasting load to 24 nearby drivers... Expected response in 2-5 minutes.`
                        );
                        const newActivity = {
                          id: Date.now(),
                          message: `Load broadcast initiated: ${load.pickup} → ${load.delivery}`,
                          time: 'Just now',
                          type: 'info',
                        };
                        setRealTimeActivity((prev) => [
                          newActivity,
                          ...prev.slice(0, 9),
                        ]);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(-4px) scale(1.02)';
                        e.currentTarget.style.boxShadow =
                          '0 12px 40px rgba(249, 115, 22, 0.4), 0 6px 20px rgba(0, 0, 0, 0.2)';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(234, 88, 12, 0.2))';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform =
                          'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.background =
                          'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(234, 88, 12, 0.1))';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {load.pickup} → {load.delivery}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {load.equipmentType} •{' '}
                            {load.weight.toLocaleString()} lbs
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#fb923c', fontWeight: '600' }}>
                            {load.rate}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {load.distance}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Offers */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 12px 40px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  position: 'relative',
                  transform: 'translateZ(0)',
                }}
              >
                <h3 style={{ color: 'white', marginBottom: '16px' }}>
                  📋 Active Load Assignments
                </h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {[
                    {
                      driver: 'Mike Rodriguez',
                      load: 'ATL→MIA',
                      rate: '$2,450',
                      status: 'Confirmed',
                    },
                    {
                      driver: 'Sarah Johnson',
                      load: 'HOU→DAL',
                      rate: '$850',
                      status: 'Pending',
                    },
                    {
                      driver: 'David Chen',
                      load: 'CHI→DET',
                      rate: '$1,200',
                      status: 'In Progress',
                    },
                  ].map((offer, index) => (
                    <div
                      key={index}
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
                        border: '1px solid rgba(59, 130, 246, 0.4)',
                        borderRadius: '12px',
                        padding: '16px',
                        boxShadow:
                          '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ color: 'white', fontWeight: '500' }}>
                            {offer.driver}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '0.8rem',
                            }}
                          >
                            {offer.load}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#60a5fa', fontWeight: '600' }}>
                            {offer.rate}
                          </div>
                          <div
                            style={{
                              color: '#fbbf24',
                              fontSize: '0.8rem',
                              fontWeight: '500',
                            }}
                          >
                            {offer.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Real-Time Activity Feed */}
            <div style={{ marginTop: '24px' }}>
              <h3
                style={{
                  color: 'white',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📈 Live Activity Feed
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    animation: pulseAnimation ? 'pulse 2s infinite' : 'none',
                    boxShadow:
                      '0 2px 8px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3)',
                  }}
                />
              </h3>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow:
                    '0 12px 40px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                  maxHeight: '320px',
                  overflowY: 'auto',
                  marginBottom: '24px',
                  position: 'relative',
                  transform: 'translateZ(0)',
                }}
              >
                {realTimeActivity.map((activity, index) => (
                  <div
                    key={activity.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 0',
                      borderBottom:
                        index < realTimeActivity.length - 1
                          ? '1px solid rgba(255,255,255,0.1)'
                          : 'none',
                      animation:
                        index === 0 ? 'slideInRight 0.5s ease-out' : 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background:
                          activity.type === 'success'
                            ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                            : activity.type === 'urgent'
                              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                              : activity.type === 'driver'
                                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                                : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        flexShrink: 0,
                        boxShadow:
                          activity.type === 'success'
                            ? '0 2px 8px rgba(34, 197, 94, 0.4)'
                            : activity.type === 'urgent'
                              ? '0 2px 8px rgba(239, 68, 68, 0.4)'
                              : activity.type === 'driver'
                                ? '0 2px 8px rgba(245, 158, 11, 0.4)'
                                : '0 2px 8px rgba(59, 130, 246, 0.4)',
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '0.9rem',
                          marginBottom: '2px',
                        }}
                      >
                        {activity.message}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ color: 'white', marginBottom: '16px' }}>
                🚀 Quick Actions
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    label: '⚡ Auto-Match Loads',
                    color: '#10b981',
                    action: () => {
                      alert(
                        '🤖 AI Auto-Matching activated! System will automatically match urgent loads with nearby drivers.'
                      );
                      const newActivity = {
                        id: Date.now(),
                        message: 'Auto-matching system activated by dispatcher',
                        time: 'Just now',
                        type: 'success',
                      };
                      setRealTimeActivity((prev) => [
                        newActivity,
                        ...prev.slice(0, 9),
                      ]);
                    },
                  },
                  {
                    label: '📡 Refresh Drivers',
                    color: '#3b82f6',
                    action: () => {
                      alert(
                        '📡 Scanning for online drivers... Found 28 drivers available within 100 miles!'
                      );
                      fetchSystemData();
                    },
                  },
                  {
                    label: '🚨 Emergency Load',
                    color: '#ef4444',
                    action: () => {
                      alert(
                        '🚨 Emergency load broadcast initiated! Notifying all available drivers immediately.'
                      );
                      const newActivity = {
                        id: Date.now(),
                        message:
                          'EMERGENCY: Urgent load broadcast to all drivers',
                        time: 'Just now',
                        type: 'urgent',
                      };
                      setRealTimeActivity((prev) => [
                        newActivity,
                        ...prev.slice(0, 9),
                      ]);
                    },
                  },
                  {
                    label: '📊 Live Dashboard',
                    color: '#8b5cf6',
                    action: () => setActiveTab('analytics'),
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    style={{
                      background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)`,
                      border: `1px solid ${action.color}`,
                      borderRadius: '12px',
                      padding: '16px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: `0 6px 20px ${action.color}30, 0 3px 10px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                      position: 'relative',
                      transform: 'translateZ(0)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(-4px) scale(1.02)';
                      e.currentTarget.style.boxShadow = `0 12px 40px ${action.color}40, 0 6px 20px rgba(0, 0, 0, 0.2)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${action.color}20, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dispatch' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                marginBottom: '24px',
              }}
            >
              🚛 Dispatch Central Flow
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>
              Advanced dispatch operations with live load posting and driver
              coordination.
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                marginBottom: '24px',
              }}
            >
              👨‍💼 Driver Flow
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {onlineDrivers?.map((driver, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow:
                      '0 8px 25px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    position: 'relative',
                    transform: 'translateZ(0)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      {driver.name}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.9rem',
                      }}
                    >
                      {driver.equipmentType} • ⭐ {driver.rating} •{' '}
                      {driver.distance}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        background: driver.isOnline
                          ? 'rgba(16, 185, 129, 0.2)'
                          : 'rgba(239, 68, 68, 0.2)',
                        color: driver.isOnline ? '#34d399' : '#f87171',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      {driver.isOnline ? 'Online' : 'Offline'}
                    </div>
                    <div style={{ color: '#60a5fa', fontSize: '0.9rem' }}>
                      Available: {driver.eta}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shippers' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                marginBottom: '24px',
              }}
            >
              📦 Shipper Portal
            </h2>
            <div style={{ color: 'rgba(255,255,255,0.8)' }}>
              Professional load requests with intelligent matching and
              market-based pricing.
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '1.8rem',
                marginBottom: '24px',
              }}
            >
              📈 Analytics & Insights
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
              }}
            >
              {[
                {
                  label: 'Average Response Time',
                  value: `${systemMetrics?.avgResponseTime || 0}s`,
                  color: '#f97316',
                },
                {
                  label: 'Total Revenue Today',
                  value: `$${(systemMetrics?.totalRevenue || 0).toLocaleString()}`,
                  color: '#10b981',
                },
                {
                  label: 'Match Success Rate',
                  value: `${systemMetrics?.successRate || 0}%`,
                  color: '#22c55e',
                },
                {
                  label: 'Active Drivers',
                  value: (systemMetrics?.totalDriversOnline || 0).toString(),
                  color: '#8b5cf6',
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  style={{
                    background: `linear-gradient(135deg, ${metric.color}20, ${metric.color}10)`,
                    border: `1px solid ${metric.color}40`,
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      color: metric.color,
                      fontSize: '2rem',
                      fontWeight: '700',
                      marginBottom: '8px',
                    }}
                  >
                    {metric.value}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes slideInRight {
          0% {
            transform: translateX(100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes countUp {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
