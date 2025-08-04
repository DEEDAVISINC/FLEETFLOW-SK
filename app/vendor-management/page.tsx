'use client';

import React, { useEffect, useState } from 'react';

const VendorManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vendorMetrics, setVendorMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for vendor management metrics
  useEffect(() => {
    const fetchVendorMetrics = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setVendorMetrics({
          totalVendors: 47,
          activeVendors: 42,
          averagePerformance: 91.3,
          totalSpend: 2847500,
          costSavings: 18.7,
          vendorSatisfaction: 94.2,
          contractsExpiring: 8,
          riskAssessment: 'Low',
          trends: {
            thisMonth: '+2.8%',
            lastQuarter: '+12.4%',
            yearOverYear: '+24.6%',
          },
          topVendors: [
            {
              id: 1,
              name: 'Premium Logistics Solutions',
              category: 'Transportation',
              performance: 97.2,
              spend: 485000,
              status: 'excellent',
              contract_expires: '2025-08-15',
            },
            {
              id: 2,
              name: 'TechFlow Integration Services',
              category: 'Technology',
              performance: 94.8,
              spend: 325000,
              status: 'good',
              contract_expires: '2025-12-01',
            },
            {
              id: 3,
              name: 'Global Fuel Card Solutions',
              category: 'Fuel Management',
              performance: 89.5,
              spend: 892000,
              status: 'good',
              contract_expires: '2025-03-20',
            },
          ],
          integrations: [
            {
              name: 'QuickBooks Online',
              status: 'active',
              uptime: 99.7,
              cost: 89.99,
              lastSync: '2 minutes ago',
            },
            {
              name: 'Fuel Card API',
              status: 'active',
              uptime: 98.2,
              cost: 149.99,
              lastSync: '5 minutes ago',
            },
            {
              name: 'Banking Integration',
              status: 'active',
              uptime: 99.9,
              cost: 199.99,
              lastSync: '1 minute ago',
            },
            {
              name: 'ERP Connector',
              status: 'warning',
              uptime: 94.1,
              cost: 299.99,
              lastSync: '2 hours ago',
            },
          ],
          alerts: [
            {
              id: 1,
              type: 'warning',
              message: 'Global Fuel Card contract expires in 45 days',
              severity: 'high',
              vendor: 'Global Fuel Card Solutions',
            },
            {
              id: 2,
              type: 'info',
              message: 'New vendor evaluation scheduled for next week',
              severity: 'low',
            },
            {
              id: 3,
              type: 'success',
              message: 'Cost optimization target exceeded by 12%',
              severity: 'low',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching vendor metrics:', error);
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
      change: '+3',
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
      change: '+2.1%',
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
      change: '+12.4%',
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
      change: '+4.3%',
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
      change: '-2',
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
      change: '+1.8%',
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
            Enterprise Vendor Portal • Performance Analytics • Cost Optimization
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
              ✅ 42 Active Vendors
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
              📊 91.3% Performance
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
              💰 18.7% Cost Savings
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
          <button
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              color: '#fbbf24',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '8px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
            }}
          >
            🔔 Notifications
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '0.7rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '600',
              }}
            >
              3
            </span>
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
                {vendorMetrics?.topVendors?.map((vendor: any) => (
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
                ))}
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
                {vendorMetrics?.alerts?.map((alert: any) => (
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
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Analytics Tab */}
        {activeTab === 'performance' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              📈 Vendor Performance Analytics
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Performance Scorecard */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  🎯 Performance Scorecard
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      91.3%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Average Performance
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      98.7%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      On-Time Delivery
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      94.2%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Quality Rating
                    </p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#f59e0b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      18.7%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Cost Optimization
                    </p>
                  </div>
                </div>
              </div>

              {/* Benchmarking */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  📊 Industry Benchmarking
                </h3>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  <p>
                    ✅ <strong>Above Industry Average:</strong> Performance
                    (91.3% vs 85.2%), Cost Savings (18.7% vs 12.4%)
                  </p>
                  <p>
                    📈 <strong>Meeting Standards:</strong> Vendor Satisfaction
                    (94.2%), Contract Compliance (96.8%)
                  </p>
                  <p>
                    🎯 <strong>Optimization Opportunities:</strong> Response
                    Time improvement, Risk Assessment automation
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Third-Party Integrations Tab */}
        {activeTab === 'integrations' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              🔗 Third-Party Integration Hub
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {vendorMetrics?.integrations?.map(
                (integration: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto auto',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background:
                          integration.status === 'active'
                            ? '#10b981'
                            : integration.status === 'warning'
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color: 'white',
                          margin: '0 0 0.25rem 0',
                        }}
                      >
                        {integration.name}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.7)',
                          margin: 0,
                        }}
                      >
                        Last sync: {integration.lastSync}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#10b981',
                        }}
                      >
                        {integration.uptime}%
                      </div>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                        }}
                      >
                        Uptime
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#3b82f6',
                        }}
                      >
                        ${integration.cost}
                      </div>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                        }}
                      >
                        Monthly
                      </p>
                    </div>
                    <button
                      style={{
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '6px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                      }}
                    >
                      Manage
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Integration Health Summary */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginTop: '2rem',
              }}
            >
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '1rem',
                }}
              >
                🏥 Integration Health Summary
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  textAlign: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '0.5rem',
                    }}
                  >
                    98.2%
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '0.9rem',
                    }}
                  >
                    Average Uptime
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '0.5rem',
                    }}
                  >
                    $739.96
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '0.9rem',
                    }}
                  >
                    Total Monthly Cost
                  </p>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#f59e0b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    1
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '0.9rem',
                    }}
                  >
                    Needs Attention
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Management Tab */}
        {activeTab === 'contracts' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              📋 Contract Management Center
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Contract Overview */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  📊 Contract Portfolio Overview
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      47
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Total Contracts
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#f59e0b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      8
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Expiring Soon
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      12
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Up for Renewal
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      96.8%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Compliance Rate
                    </p>
                  </div>
                </div>
              </div>

              {/* Contract Actions */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  🎯 Contract Management Actions
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <button
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'left',
                    }}
                  >
                    📝 Create New Contract
                    <p
                      style={{
                        fontSize: '0.8rem',
                        margin: '0.5rem 0 0 0',
                        opacity: 0.8,
                      }}
                    >
                      Set up new vendor agreements
                    </p>
                  </button>
                  <button
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'left',
                    }}
                  >
                    🔄 Review Renewals
                    <p
                      style={{
                        fontSize: '0.8rem',
                        margin: '0.5rem 0 0 0',
                        opacity: 0.8,
                      }}
                    >
                      Process contract renewals
                    </p>
                  </button>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'left',
                    }}
                  >
                    📊 Generate Reports
                    <p
                      style={{
                        fontSize: '0.8rem',
                        margin: '0.5rem 0 0 0',
                        opacity: 0.8,
                      }}
                    >
                      Contract analytics & insights
                    </p>
                  </button>
                  <button
                    style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'left',
                    }}
                  >
                    ⚖️ Compliance Check
                    <p
                      style={{
                        fontSize: '0.8rem',
                        margin: '0.5rem 0 0 0',
                        opacity: 0.8,
                      }}
                    >
                      Verify contract compliance
                    </p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Optimization Tab */}
        {activeTab === 'optimization' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              💰 Cost Optimization Center
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Cost Savings Summary */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  💡 Cost Optimization Results
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      $532K
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Annual Savings
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#f59e0b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      18.7%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Cost Reduction
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      23
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Optimized Contracts
                    </p>
                  </div>
                </div>
              </div>

              {/* Optimization Opportunities */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  🎯 Optimization Opportunities
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                      }}
                    >
                      💰 Fuel Card Consolidation
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Potential savings: $45K annually by consolidating to
                      single provider
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#f59e0b',
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                      }}
                    >
                      📊 Volume Discounts
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Negotiate better rates with high-volume vendors for
                      additional 12% savings
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#3b82f6',
                        margin: '0 0 0.5rem 0',
                        fontSize: '1rem',
                      }}
                    >
                      🤖 Automation Upgrades
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Reduce manual processing costs by $28K through workflow
                      automation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vendor Relations Tab */}
        {activeTab === 'relationships' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              🤝 Vendor Relationship Management
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Relationship Health */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  💚 Relationship Health Score
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      94.2%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Overall Satisfaction
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      2.3
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Avg Response Time (hrs)
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#8b5cf6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      89%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Issue Resolution Rate
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '1.8rem',
                        fontWeight: '700',
                        color: '#f59e0b',
                        marginBottom: '0.5rem',
                      }}
                    >
                      97.1%
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Communication Score
                    </p>
                  </div>
                </div>
              </div>

              {/* Communication Hub */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                  }}
                >
                  📞 Communication Hub
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <button
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    📧 Send Updates
                  </button>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      color: '#3b82f6',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    📋 Schedule Reviews
                  </button>
                  <button
                    style={{
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Track Issues
                  </button>
                  <button
                    style={{
                      background: 'rgba(139, 92, 246, 0.2)',
                      color: '#8b5cf6',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      textAlign: 'center',
                    }}
                  >
                    📊 View History
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorManagementPage;
