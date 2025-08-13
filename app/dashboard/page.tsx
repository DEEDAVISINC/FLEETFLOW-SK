'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [selectedLoad, setSelectedLoad] = useState<string>('');
  const [showLoadDetails, setShowLoadDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Mock loads data
  const loads = [
    {
      id: 'FL-001-ATL-MIA',
      status: 'active',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      driver: 'John Smith',
      truck: 'TRK-045',
      revenue: '$2,850',
      distance: '647 mi',
      eta: '14:30 EST',
      progress: 65,
      commodity: 'Electronics',
      weight: '42,000 lbs',
      priority: 'high',
    },
    {
      id: 'FL-002-CHI-HOU',
      status: 'pending',
      origin: 'Chicago, IL',
      destination: 'Houston, TX',
      driver: 'Sarah Johnson',
      truck: 'TRK-023',
      revenue: '$3,200',
      distance: '1,082 mi',
      eta: '16:45 CST',
      progress: 0,
      commodity: 'Automotive Parts',
      weight: '45,500 lbs',
      priority: 'medium',
    },
    {
      id: 'FL-003-LAX-SEA',
      status: 'delivered',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      driver: 'Mike Davis',
      truck: 'TRK-067',
      revenue: '$2,950',
      distance: '1,135 mi',
      eta: 'Delivered',
      progress: 100,
      commodity: 'Consumer Goods',
      weight: '38,200 lbs',
      priority: 'low',
    },
    {
      id: 'FL-004-NYC-BOS',
      status: 'active',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      driver: 'Lisa Chen',
      truck: 'TRK-089',
      revenue: '$1,450',
      distance: '215 mi',
      eta: '11:20 EST',
      progress: 85,
      commodity: 'Food Products',
      weight: '28,500 lbs',
      priority: 'low',
    },
  ];

  // Real-time alerts state management
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Load SHP-003 Delayed',
      message: 'Mechanical breakdown on I-95. ETA pushed by 4 hours',
      timestamp: '3:45 PM',
      actionRequired: true,
      loadId: 'SHP-003',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Driver Hours Alert',
      message: 'Driver Mike Wilson approaching HOS limit in 2 hours',
      timestamp: '3:40 PM',
      actionRequired: true,
      driverId: 'DRV-789',
    },
    {
      id: 3,
      type: 'info',
      title: 'Load Delivered',
      message: 'SHP-002 successfully delivered to Atlanta, GA',
      timestamp: '3:35 PM',
      actionRequired: false,
      loadId: 'SHP-002',
    },
  ];

  const quickLinks = [
    {
      href: '/dispatch',
      bg: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      emoji: '🚛',
      title: 'Dispatch',
      color: 'white',
    },
    {
      href: '/drivers',
      bg: 'linear-gradient(135deg, #f7c52d, #f4a832)',
      emoji: '👨‍💼',
      title: 'Drivers',
      color: '#2d3748',
    },
    {
      href: '/drivers/dashboard',
      bg: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
      emoji: '🚗',
      title: 'Driver Management Portal',
      color: 'white',
    },
    {
      href: '/vehicles',
      bg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      emoji: '🚚',
      title: 'Fleet',
      color: 'white',
    },
    {
      href: '/broker',
      bg: 'linear-gradient(135deg, #f97316, #ea580c)',
      emoji: '🏢',
      title: 'Broker',
      color: 'white',
    },
    {
      href: '/routes',
      bg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
      emoji: '🗺️',
      title: 'Routes',
      color: 'white',
    },
    {
      href: '/analytics',
      bg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
      emoji: '📊',
      title: 'Analytics',
      color: 'white',
    },
    {
      href: '/accounting',
      bg: 'linear-gradient(135deg, #059669, #047857)',
      emoji: '💰',
      title: 'Finance',
      color: 'white',
    },
    {
      href: '/notes',
      bg: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
      emoji: '🔔',
      title: 'Alerts',
      color: '#2d3748',
    },
    {
      href: '/quoting',
      bg: 'linear-gradient(135deg, #10b981, #059669)',
      emoji: '📋',
      title: 'Quotes',
      color: 'white',
    },
    {
      href: '/compliance',
      bg: 'linear-gradient(135deg, #dc2626, #b91c1c)',
      emoji: '✅',
      title: 'Safety',
      color: 'white',
    },
    {
      href: '/shippers',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      emoji: '🏭',
      title: 'Shippers',
      color: 'white',
    },
    {
      href: '/scheduling',
      bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      emoji: '📅',
      title: 'Schedule',
      color: 'white',
    },
    {
      href: '/ai',
      bg: 'linear-gradient(135deg, #ec4899, #db2777)',
      emoji: '🤖',
      title: 'AI Hub',
      color: 'white',
    },
  ];

  // Clock and animations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return '#dc2626';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getLoadStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'delivered':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        color: 'white',
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Hero Header - Back to original glassmorphism style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              FleetFlow Command Center
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Real-time Fleet Operations Dashboard •{' '}
              {currentTime.toLocaleString()}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <Link href='/dispatch' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                📞 Dispatch Central
              </button>
            </Link>
            <Link href='/tracking' style={{ textDecoration: 'none' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              >
                📍 Live Tracking
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Executive KPIs - Back to original glassmorphism style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {/* Active Loads */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚛</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '5px',
            }}
          >
            247
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Active Loads
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            +12 from yesterday
          </div>
        </div>

        {/* Revenue */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>💰</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '5px',
            }}
          >
            $487,520
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Today's Revenue
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            +15.3% from yesterday
          </div>
        </div>

        {/* Available Drivers */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>👥</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '5px',
            }}
          >
            38
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Available Drivers
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            -3 from yesterday
          </div>
        </div>

        {/* Fleet Utilization */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📊</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '5px',
            }}
          >
            89%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            Fleet Utilization
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            +2.1% from yesterday
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px',
        }}
      >
        {quickLinks.map((link, index) => (
          <Link key={index} href={link.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                background: link.bg,
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>
                {link.emoji}
              </div>
              <div
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: link.color,
                }}
              >
                {link.title}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Real-Time Monitoring & Alerts */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
          }}
        >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#ffffff',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            🚨 Real-time Alerts & Monitoring
          </h2>
          <Link href='/notes' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#2d3748',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
              }}
            >
              View All Alerts
            </button>
          </Link>
        </div>

        {/* Alert Summary Counters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          {/* Critical Alerts */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#ef4444',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'critical').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Critical
            </div>
          </div>

          {/* Warning Alerts */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#f59e0b',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'warning').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Warning
            </div>
          </div>

          {/* Info Alerts */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#3b82f6',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.filter((alert) => alert.type === 'info').length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Info
            </div>
          </div>

          {/* Total Alerts */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {alerts.length}
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Total
            </div>
          </div>

          {/* Notifications Count */}
          <div
            style={{
              background: 'rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '15px',
              textAlign: 'center',
              border: '1px solid rgba(168, 85, 247, 0.3)',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#a855f7',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              15
            </div>
            <div
              style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Notifications
            </div>
          </div>
        </div>

        {/* Recent Alerts Preview */}
        <div style={{ display: 'grid', gap: '15px' }}>
          {alerts.map((alert, index) => (
            <div
              key={index}
              style={{
                background:
                  alert.type === 'critical'
                    ? 'rgba(239, 68, 68, 0.2)'
                    : alert.type === 'warning'
                      ? 'rgba(245, 158, 11, 0.2)'
                      : 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                border: `1px solid ${
                  alert.type === 'critical'
                    ? '#ef4444'
                    : alert.type === 'warning'
                      ? '#f59e0b'
                      : '#3b82f6'
                }`,
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                }}
              >
                {alert.type === 'critical'
                  ? '🚨'
                  : alert.type === 'warning'
                    ? '⚠️'
                    : 'ℹ️'}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '5px',
                  }}
                >
                  {alert.title}
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    marginBottom: '5px',
                  }}
                >
                  {alert.message}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {alert.timestamp}
                </div>
              </div>
              {alert.actionRequired && (
                <button
                  style={{
                    background:
                      alert.type === 'critical'
                        ? '#ef4444'
                        : alert.type === 'warning'
                          ? '#f59e0b'
                          : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Action Required
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Back to Landing Page */}
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link href='/'>
          <button
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            ← Back to Landing Page
          </button>
        </Link>
      </div>
    </div>
  );
}
