'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  checkPermission,
  getCurrentUser,
  getSectionPermissions,
} from '../config/access';

export default function PerformancePage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('fleet-overview');
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);

  const { user } = getCurrentUser();
  const sectionPermissions = getSectionPermissions(user);

  // Access control check
  useEffect(() => {
    const checkAccess = () => {
      // Check subscription-based fleet performance permissions
      // Includes role-based access AND subscription plan permissions
      const canAccessFleet =
        // Role-based access for traditional fleet users
        user.role === 'admin' ||
        user.role === 'dispatcher' ||
        user.role === 'driver' ||
        // Subscription-based access for brokers/carriers with fleet plans
        sectionPermissions.fleetFlow?.canViewFleetPerformance ||
        // Fallback permission check
        checkPermission('canViewFleetPerformance');

      if (!canAccessFleet) {
        // Redirect to unauthorized page or dashboard
        router.push('/fleetflowdash');
        return;
      }

      setHasAccess(true);
      setIsCheckingAccess(false);
    };

    checkAccess();
  }, [user, sectionPermissions, router]);

  // Performance metrics data
  const performanceMetrics = {
    totalVehicles: 45,
    activeVehicles: 38,
    maintenanceVehicles: 7,
    totalDrivers: 52,
    activeRoutes: 23,
    fuelEfficiency: 8.2,
    monthlyMileage: 125400,
    maintenanceCosts: 18500,
  };

  useEffect(() => {
    // Only start loading data after access is confirmed
    if (hasAccess && !isCheckingAccess) {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [hasAccess, isCheckingAccess]);

  // Build KPIs from performance data
  const performanceKPIs = [
    {
      title: 'Fleet Utilization',
      value: '84.4',
      unit: '%',
      change: '+2.3%',
      trend: 'up',
      description: 'Percentage of fleet actively generating revenue',
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'On-Time Delivery',
      value: '96.8',
      unit: '%',
      change: '+1.2%',
      trend: 'up',
      description: 'Deliveries completed within scheduled time',
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Average Cost/Mile',
      value: '$1.84',
      unit: '',
      change: '-$0.12',
      trend: 'up',
      description: 'Average operational cost per mile',
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Safety Score',
      value: '98.2',
      unit: '%',
      change: '+0.5%',
      trend: 'up',
      description: 'Overall fleet safety performance',
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
  ];

  const tabOptions = [
    { id: 'fleet-overview', label: '🚛 Fleet Overview', icon: '🚛' },
    { id: 'driver-metrics', label: '👥 Driver Metrics', icon: '👥' },
    { id: 'route-analysis', label: '🗺️ Route Analysis', icon: '🗺️' },
    { id: 'cost-analysis', label: '💰 Cost Analysis', icon: '💰' },
    { id: 'safety-analytics', label: '🛡️ Safety Analytics', icon: '🛡️' },
    { id: 'maintenance-tracking', label: '🔧 Maintenance', icon: '🔧' },
  ];

  // Show loading screen while checking access
  if (isCheckingAccess) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid rgba(255, 255, 255, 0.3)',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px',
            }}
          />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
            🔐 Checking Access Permissions
          </h2>
          <p style={{ opacity: 0.8, fontSize: '1rem' }}>
            Verifying fleet management access...
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if access is denied (shouldn't normally show due to redirect)
  if (!hasAccess) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundImage:
            'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🚫</div>
          <h2
            style={{ fontSize: '2rem', marginBottom: '16px', color: '#ef4444' }}
          >
            Access Denied
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '20px', opacity: 0.9 }}>
            You need fleet management permissions to access the Performance
            Dashboard.
          </p>
          <p style={{ fontSize: '0.9rem', marginBottom: '30px', opacity: 0.7 }}>
            Contact your administrator to request fleet access permissions.
          </p>
          <button
            onClick={() => router.push('/fleetflowdash')}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4338ca 50%, #312e81 75%, #1e1b4b 100%), radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(196, 181, 253, 0.06) 0%, transparent 50%), radial-gradient(circle at 40% 60%, rgba(139, 92, 246, 0.04) 0%, transparent 50%)',
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundRepeat: 'no-repeat',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h1
            style={{
              color: 'white',
              margin: 0,
              fontSize: '2rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #3b82f6, #06b6d4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}
          >
            📊 Performance Dashboard
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Fleet Analytics • Driver Performance • Route Optimization
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: '8px',
            }}
          >
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              ✅ Fleet Active
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(59, 130, 246, 0.3)',
              }}
            >
              🔗 Connected
            </span>
            <span
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#8b5cf6',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: '600',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              📊 Analytics
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div
            style={{
              textAlign: 'right',
              color: 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>
              Last Activity
            </div>
            <div style={{ fontSize: '0.8rem' }}>
              {new Date().toLocaleTimeString()}
            </div>
          </div>
          <button
            onClick={() => router.push('/fleetflowdash')}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Back
          </button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {performanceKPIs.map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 8px 25px ${kpi.background}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60px',
                height: '60px',
                background: kpi.background,
                borderRadius: '0 0 0 60px',
                opacity: 0.3,
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  margin: 0,
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  opacity: 0.9,
                }}
              >
                {kpi.title}
              </h3>
              <span
                style={{
                  background: kpi.background,
                  color: kpi.color,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  border: `1px solid ${kpi.border}`,
                }}
              >
                {kpi.change}
              </span>
            </div>
            <div
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '8px',
                textShadow: `0 0 20px ${kpi.color}33`,
              }}
            >
              {kpi.value}
              {kpi.unit}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                margin: 0,
                fontSize: '0.8rem',
                lineHeight: 1.4,
              }}
            >
              {kpi.description}
            </p>
          </div>
        ))}
      </div>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              background:
                selectedTab === tab.id
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                selectedTab === tab.id ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
              border:
                selectedTab === tab.id
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Performance Guide */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '20px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              color: 'white',
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
            }}
          >
            💼 Performance Dashboard Guide
          </h2>
          <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Master your fleet performance dashboard
          </span>
        </div>

        <p
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '32px',
            fontSize: '1rem',
            lineHeight: 1.6,
          }}
        >
          💡 Start with Fleet Overview and explore your comprehensive
          performance tools for successful fleet operations.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              title: '🚛 Fleet Overview',
              description:
                'Monitor vehicle utilization and manage fleet assignments',
              step: 'Step 1',
            },
            {
              title: '👥 Driver Metrics',
              description: 'Track driver performance and safety records',
              step: 'Step 2',
            },
            {
              title: '🗺️ Route Analysis',
              description: 'Analyze routes for efficiency and optimization',
              step: 'Step 3',
            },
            {
              title: '💰 Cost Analysis',
              description: 'Monitor operational costs and profitability',
              step: 'Step 4',
            },
            {
              title: '🛡️ Safety Analytics',
              description: 'Track safety metrics and incident reports',
              step: 'Step 5',
            },
            {
              title: '🔧 Maintenance',
              description: 'Schedule maintenance and track vehicle health',
              step: 'Step 6',
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedTab(tabOptions[index]?.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <h4
                  style={{
                    color: 'white',
                    margin: 0,
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}
                >
                  {item.title}
                </h4>
                <span
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                  }}
                >
                  {item.step}
                </span>
              </div>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                  fontSize: '0.9rem',
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
