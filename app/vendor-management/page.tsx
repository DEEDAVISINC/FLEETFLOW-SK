'use client';

import React, { useEffect, useState } from 'react';

interface VendorMetrics {
  totalVendors: number;
  activeVendors: number;
  averagePerformance: number;
  totalSpend: number;
  costSavings: number;
  vendorSatisfaction: number;
  contractsExpiring: number;
  riskAssessment: string;
  trends: {
    thisMonth: string;
    lastQuarter: string;
    yearOverYear: string;
  };
  topVendors: Array<{
    id: string;
    name: string;
    category: string;
    performance: number;
    spend: number;
    status: string;
    contract_expires: string;
  }>;
  integrations: Array<{
    name: string;
    status: string;
    uptime: number;
    cost: number;
    lastSync: string;
  }>;
  alerts: Array<{
    id: string;
    type: string;
    message: string;
    severity: string;
    vendor?: string;
  }>;
  contractWorkflows?: {
    totalWorkflows: number;
    activeWorkflows: number;
    completedWorkflows: number;
    overdueWorkflows: number;
    byType: Record<string, number>;
    recentWorkflows: Array<{
      id: string;
      vendorName: string;
      workflowType: string;
      status: string;
      priority: string;
      currentStep: string;
      dueDate: string;
      progress: number;
    }>;
  };
}

const VendorManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vendorMetrics, setVendorMetrics] = useState<VendorMetrics | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Helper function to format last sync time
  const formatLastSync = (timestamp: string): string => {
    const now = new Date();
    const syncTime = new Date(timestamp);
    const diffMinutes = Math.floor(
      (now.getTime() - syncTime.getTime()) / (1000 * 60)
    );

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  // Real vendor data integration - now returns empty data
  useEffect(() => {
    const fetchVendorMetrics = async () => {
      try {
        setLoading(true);
        // Set empty data structure - no mock data
        setVendorMetrics({
          totalVendors: 0,
          activeVendors: 0,
          averagePerformance: 0,
          totalSpend: 0,
          costSavings: 0,
          vendorSatisfaction: 0,
          contractsExpiring: 0,
          riskAssessment: 'Low',
          trends: { thisMonth: '0%', lastQuarter: '0%', yearOverYear: '0%' },
          topVendors: [],
          integrations: [],
          alerts: [],
          contractWorkflows: {
            totalWorkflows: 0,
            activeWorkflows: 0,
            completedWorkflows: 0,
            overdueWorkflows: 0,
            byType: {},
            recentWorkflows: [],
          },
        });
      } catch (error) {
        console.error('Error fetching vendor metrics:', error);
        setVendorMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorMetrics();
  }, []);

  const tabs = [
    {
      id: 'dashboard',
      label: 'Vendor Dashboard',
      icon: '📊',
      color: '#3b82f6',
    },
    {
      id: 'performance',
      label: 'Performance Analytics',
      icon: '📈',
      color: '#10b981',
    },
    {
      id: 'integrations',
      label: 'Third-Party Integrations',
      icon: '🔗',
      color: '#8b5cf6',
    },
    {
      id: 'contracts',
      label: 'Contract Management',
      icon: '📋',
      color: '#dc2626',
    },
    {
      id: 'optimization',
      label: 'Cost Optimization',
      icon: '💰',
      color: '#f59e0b',
    },
    {
      id: 'relationships',
      label: 'Vendor Relations',
      icon: '🤝',
      color: '#14b8a6',
    },
  ];

  const vendorKPIs = [
    {
      title: 'Total Active Vendors',
      value: vendorMetrics?.activeVendors || 0,
      unit: '',
      change: '+0',
      trend: 'up',
      description: 'Currently active vendor partnerships',
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Average Performance',
      value: vendorMetrics?.averagePerformance || 0,
      unit: '%',
      change: '+0%',
      trend: 'up',
      description: 'Composite vendor performance score',
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Total Annual Spend',
      value: (vendorMetrics?.totalSpend || 0) / 1000000,
      unit: 'M',
      change: '+0%',
      trend: 'up',
      description: 'Total vendor spending this year',
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Cost Savings',
      value: vendorMetrics?.costSavings || 0,
      unit: '%',
      change: '+0%',
      trend: 'up',
      description: 'Cost optimization vs previous year',
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
    {
      title: 'Contracts Expiring',
      value: vendorMetrics?.contractsExpiring || 0,
      unit: '',
      change: '0',
      trend: 'down',
      description: 'Contracts expiring in next 90 days',
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.5)',
      border: 'rgba(239, 68, 68, 0.3)',
    },
    {
      title: 'Vendor Satisfaction',
      value: vendorMetrics?.vendorSatisfaction || 0,
      unit: '%',
      change: '+0%',
      trend: 'up',
      description: 'Vendor relationship satisfaction score',
      color: '#14b8a6',
      background: 'rgba(20, 184, 166, 0.5)',
      border: 'rgba(20, 184, 166, 0.3)',
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>🔄 Loading...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #022c22 0%, #044e46 50%, #0a1612 100%)',
        minHeight: '100vh',
        padding: '20px',
        fontFamily: 'system-ui, sans-serif',
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
            🤝 Vendor Management & Third-Party Optimization
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            🔴 Live Data • Real-Time Analytics • AI-Powered Optimization
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
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              ✅ {vendorMetrics?.activeVendors || 0} Active Vendors
            </span>
            <span
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              📊 {vendorMetrics?.averagePerformance || 0}% Performance
            </span>
            <span
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
              }}
            >
              💰 {vendorMetrics?.costSavings || 0}% Cost Savings
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📊 Reports
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {vendorKPIs.map((kpi, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '8px',
              padding: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem',
              }}
            >
              <h3
                style={{
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  color: 'white',
                  margin: 0,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                {kpi.title}
              </h3>
              <div
                style={{
                  fontSize: '12px',
                  color: kpi.trend === 'up' ? '#10b981' : '#ef4444',
                  fontWeight: '600',
                }}
              >
                {kpi.change}
              </div>
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: kpi.color,
                marginBottom: '0.25rem',
              }}
            >
              {typeof kpi.value === 'number' && kpi.value % 1 !== 0
                ? kpi.value.toFixed(1)
                : kpi.value}
              {kpi.unit}
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background:
                activeTab === tab.id
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.2))'
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                activeTab === tab.id ? '#60a5fa' : 'rgba(255, 255, 255, 0.8)',
              border:
                activeTab === tab.id
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(10px)',
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Vendor Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              📊 Vendor Management Dashboard
            </h2>

            {/* Top Vendors */}
            <div style={{ marginBottom: '2rem' }}>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🏆 Top Performing Vendors
              </h3>
              <div
                style={{
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                {vendorMetrics?.topVendors &&
                vendorMetrics.topVendors.length > 0 ? (
                  vendorMetrics.topVendors.map((vendor: any) => (
                    <div
                      key={vendor.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.5rem',
                        }}
                      >
                        <h4
                          style={{
                            fontSize: '1rem',
                            fontWeight: '600',
                            color: 'white',
                            margin: 0,
                          }}
                        >
                          {vendor.name}
                        </h4>
                        <span
                          style={{
                            background:
                              vendor.status === 'excellent'
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'rgba(59, 130, 246, 0.2)',
                            color:
                              vendor.status === 'excellent'
                                ? '#10b981'
                                : '#3b82f6',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                          }}
                        >
                          {vendor.status}
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                          gap: '1rem',
                          fontSize: '0.9rem',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        <div>
                          <strong>Category:</strong> {vendor.category}
                        </div>
                        <div>
                          <strong>Performance:</strong> {vendor.performance}%
                        </div>
                        <div>
                          <strong>Annual Spend:</strong> $
                          {vendor.spend.toLocaleString()}
                        </div>
                        <div>
                          <strong>Contract Expires:</strong>{' '}
                          {vendor.contract_expires}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '60px 40px',
                      textAlign: 'center',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '4rem',
                        marginBottom: '24px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }}
                    >
                      🏆
                    </div>
                    <h3
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '16px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Top Vendors Ready
                    </h3>
                    <p
                      style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '32px',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                      }}
                    >
                      Your top performing vendors will be displayed here once
                      vendor data is connected to your system.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#60a5fa',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        📊 Performance Metrics
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#34d399',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        💰 Cost Analysis
                      </div>
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#fbbf24',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        📋 Contract Status
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Alerts */}
            <div>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                }}
              >
                🚨 Vendor Alerts & Notifications
              </h3>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {vendorMetrics?.alerts && vendorMetrics.alerts.length > 0 ? (
                  vendorMetrics.alerts.map((alert: any) => (
                    <div
                      key={alert.id}
                      style={{
                        background:
                          alert.type === 'warning'
                            ? 'rgba(245, 158, 11, 0.1)'
                            : alert.type === 'success'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : 'rgba(59, 130, 246, 0.1)',
                        border: `1px solid ${
                          alert.type === 'warning'
                            ? 'rgba(245, 158, 11, 0.3)'
                            : alert.type === 'success'
                              ? 'rgba(16, 185, 129, 0.3)'
                              : 'rgba(59, 130, 246, 0.3)'
                        }`,
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                      }}
                    >
                      <span style={{ fontSize: '1.2rem' }}>
                        {alert.type === 'warning'
                          ? '⚠️'
                          : alert.type === 'success'
                            ? '✅'
                            : 'ℹ️'}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: 'white',
                            margin: 0,
                            fontWeight: '500',
                          }}
                        >
                          {alert.message}
                        </p>
                        {alert.vendor && (
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              margin: '0.25rem 0 0 0',
                              fontSize: '0.8rem',
                            }}
                          >
                            Vendor: {alert.vendor}
                          </p>
                        )}
                      </div>
                      <span
                        style={{
                          background:
                            alert.severity === 'high'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : 'rgba(156, 163, 175, 0.2)',
                          color:
                            alert.severity === 'high' ? '#ef4444' : '#9ca3af',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                        }}
                      >
                        {alert.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                      backdropFilter: 'blur(15px)',
                      borderRadius: '20px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '60px 40px',
                      textAlign: 'center',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '4rem',
                        marginBottom: '24px',
                        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                      }}
                    >
                      🚨
                    </div>
                    <h3
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#ffffff',
                        marginBottom: '16px',
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      }}
                    >
                      Alert Center Ready
                    </h3>
                    <p
                      style={{
                        fontSize: '1.2rem',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '32px',
                        lineHeight: '1.6',
                        maxWidth: '600px',
                        margin: '0 auto 32px',
                      }}
                    >
                      Vendor alerts and notifications will appear here when
                      active vendors need attention or action.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#fbbf24',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        ⚠️ Contract Expiry
                      </div>
                      <div
                        style={{
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#f87171',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        🔴 Performance Issues
                      </div>
                      <div
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          color: '#34d399',
                          fontWeight: '600',
                          fontSize: '0.95rem',
                        }}
                      >
                        ✅ Status Updates
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs show standard empty state */}
        {activeTab !== 'dashboard' && (
          <div
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
              backdropFilter: 'blur(15px)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            }}
          >
            <div
              style={{
                fontSize: '4rem',
                marginBottom: '24px',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            >
              {tabs.find((t) => t.id === activeTab)?.icon}
            </div>
            <h3
              style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '16px',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              {tabs.find((t) => t.id === activeTab)?.label} Ready
            </h3>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '32px',
                lineHeight: '1.6',
                maxWidth: '600px',
                margin: '0 auto 32px',
              }}
            >
              This section will display comprehensive{' '}
              {tabs.find((t) => t.id === activeTab)?.label.toLowerCase()} data
              when vendor information is connected to your system.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#60a5fa',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }}
              >
                📊 Analytics
              </div>
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#34d399',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }}
              >
                📈 Reports
              </div>
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  color: '#fbbf24',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                }}
              >
                🔧 Management
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagementPage;
