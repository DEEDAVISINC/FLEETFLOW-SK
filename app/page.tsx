'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Load, getMainDashboardLoads } from './services/loadService';

export default function HomePage() {
  const [selectedLoad, setSelectedLoad] = useState<string>('');
  const [showLoadDetails, setShowLoadDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [loads, setLoads] = useState<Load[]>([]);

  // Initialize time and load data
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load data from shared service
    const dashboardLoads = getMainDashboardLoads();
    setLoads(dashboardLoads);

    return () => clearInterval(timer);
  }, []);

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
      title: 'Driver Management',
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
      href: '/admin/accounting',
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
      href: '/shipper-portal',
      bg: 'linear-gradient(135deg, #667eea, #764ba2)',
      emoji: '🏢',
      title: 'Shipper',
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

  const handleLoadClick = (loadId: string) => {
    setSelectedLoad(loadId);
    setShowLoadDetails(true);
  };

  const selectedLoadData = loads.find((load) => load.id === selectedLoad);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return '#3b82f6';
      case 'Assigned':
        return '#f59e0b';
      case 'In Transit':
        return '#10b981';
      case 'Delivered':
        return '#6366f1';
      default:
        return '#6b7280';
    }
  };

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Professional Header */}
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
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              FleetFlow Command Center℠
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Real-time Fleet Operations Dashboard •{' '}
              {currentTime?.toLocaleString() || '--'}
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

      {/* Executive KPIs */}
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
            {loads.filter((load) => load.status === 'In Transit').length}
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
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +12% from last week
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
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +5% from last month
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
            $2.4M
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            MTD Revenue
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +8% from last month
          </div>
        </div>

        {/* On-Time Delivery */}
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
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>⏰</div>
          <div
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '5px',
            }}
          >
            96.2%
          </div>
          <div
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '5px',
            }}
          >
            On-Time Performance
          </div>
          <div
            style={{ fontSize: '12px', color: '#10b981', fontWeight: '600' }}
          >
            +2.1% from last month
          </div>
        </div>
      </div>

      {/* Quick Links */}
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

      {/* Management Load Overview - Same data as Dispatch Central */}
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
            🌐 Management Load Overview - All Brokers
          </h2>
          <Link href='/dispatch' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
              }}
            >
              View Dispatch Central
            </button>
          </Link>
        </div>

        {/* Load Status Distribution */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          {/* Available Loads */}
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📋</div>
            <div
              style={{
                fontSize: '24px',
                color: '#3b82f6',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'Available').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Available
            </div>
          </div>

          {/* Assigned */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(245, 158, 11, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
            <div
              style={{
                fontSize: '24px',
                color: '#f59e0b',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'Assigned').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Assigned
            </div>
          </div>

          {/* In Transit */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>🚛</div>
            <div
              style={{
                fontSize: '24px',
                color: '#10b981',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'In Transit').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              In Transit
            </div>
          </div>

          {/* Delivered */}
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✅</div>
            <div
              style={{
                fontSize: '24px',
                color: '#6366f1',
                fontWeight: '700',
                marginBottom: '5px',
              }}
            >
              {loads.filter((load) => load.status === 'Delivered').length}
            </div>
            <div
              style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}
            >
              Delivered
            </div>
          </div>
        </div>

        {/* Professional Loadboard - Matching Dispatch Central Format - LIGHTENED */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            overflow: 'hidden',
          }}
        >
          {/* Loadboard Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                '90px 80px 1.5fr 1fr 120px 100px 100px 100px',
              gap: '10px',
              padding: '12px 15px',
              background: 'rgba(255, 255, 255, 0.1)',
              fontWeight: '700',
              color: '#d1d5db',
              fontSize: '11px',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            <div>📞 Board #</div>
            <div>Load ID</div>
            <div>Route</div>
            <div>Broker</div>
            <div>Rate</div>
            <div>Status</div>
            <div>Distance</div>
            <div>Type</div>
          </div>

          {/* Load Rows */}
          {loads.slice(0, 8).map((load, index) => (
            <div
              key={load.id}
              onClick={() => handleLoadClick(load.id)}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '90px 80px 1.5fr 1fr 120px 100px 100px 100px',
                gap: '10px',
                padding: '10px 15px',
                background:
                  index % 2 === 0
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)',
                color: '#f3f4f6',
                fontSize: '12px',
                transition: 'all 0.3s ease',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  index % 2 === 0
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontWeight: '700',
                  color: '#10b981',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {load.loadBoardNumber}
              </div>
              <div
                style={{
                  fontWeight: '700',
                  color: '#60a5fa',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {load.id}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{load.origin}</div>
                <div style={{ fontSize: '11px', opacity: 0.7 }}>
                  → {load.destination}
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>
                {load.brokerName}
              </div>
              <div
                style={{
                  fontWeight: '700',
                  color: '#22c55e',
                  fontSize: '13px',
                }}
              >
                ${load.rate?.toLocaleString()}
              </div>
              <div>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: getStatusColor(load.status),
                    color: 'white',
                  }}
                >
                  {load.status}
                </span>
              </div>
              <div style={{ fontSize: '12px' }}>{load.distance}</div>
              <div style={{ fontSize: '12px' }}>{load.equipment}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: '20px',
            padding: '15px',
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '10px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '10px',
            }}
          >
            Showing {Math.min(8, loads.length)} of {loads.length} total loads
            from all brokers
          </p>
          <Link href='/dispatch' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              View Full Loadboard in Dispatch Central →
            </button>
          </Link>
        </div>
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

      {/* Management Load Details Modal - Information Only */}
      {showLoadDetails && selectedLoadData && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '40px',
              maxWidth: '700px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <h3
                style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                Management Load Overview: {selectedLoadData.id}
              </h3>
              <button
                onClick={() => setShowLoadDetails(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '25px' }}>
              {/* Load Information */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Load Board Number
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#10b981',
                      fontWeight: '700',
                      fontFamily: 'monospace',
                    }}
                  >
                    #{selectedLoadData.loadBoardNumber}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Broker
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.brokerName}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Origin
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.origin}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Destination
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.destination}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Rate
                  </div>
                  <div
                    style={{
                      fontSize: '24px',
                      color: '#10b981',
                      fontWeight: '700',
                    }}
                  >
                    ${selectedLoadData.rate?.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Status
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      color: 'white',
                      fontWeight: '600',
                      background: getStatusColor(selectedLoadData.status),
                      padding: '8px 16px',
                      borderRadius: '8px',
                      display: 'inline-block',
                    }}
                  >
                    {selectedLoadData.status}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Distance
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.distance}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Equipment
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.equipment}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '25px',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Weight
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {selectedLoadData.weight}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Pickup Date
                  </div>
                  <div
                    style={{
                      fontSize: '18px',
                      color: '#ffffff',
                      fontWeight: '600',
                    }}
                  >
                    {new Date(selectedLoadData.pickupDate).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {selectedLoadData.dispatcherName && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '25px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Assigned Dispatcher
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {selectedLoadData.dispatcherName}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.6)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      Delivery Date
                    </div>
                    <div
                      style={{
                        fontSize: '18px',
                        color: '#ffffff',
                        fontWeight: '600',
                      }}
                    >
                      {new Date(
                        selectedLoadData.deliveryDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Management Actions */}
              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  textAlign: 'center',
                }}
              >
                <h4
                  style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '15px',
                  }}
                >
                  Management Actions
                </h4>
                <div
                  style={{
                    display: 'flex',
                    gap: '15px',
                    justifyContent: 'center',
                  }}
                >
                  <Link href='/dispatch' style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      View in Dispatch Central
                    </button>
                  </Link>
                  <Link href='/tracking' style={{ textDecoration: 'none' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      Track Load
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
