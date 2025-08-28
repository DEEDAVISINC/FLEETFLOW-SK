'use client';

import React, { useEffect, useState } from 'react';
import { contractLifecycleService } from '../services/ContractLifecycleService';
import { vendorManagementService } from '../services/VendorManagementService';

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

  // Real vendor data integration
  useEffect(() => {
    const fetchVendorMetrics = async () => {
      try {
        setLoading(true);

        // Get real analytics from VendorManagementService
        const analytics =
          await vendorManagementService.getVendorPerformanceAnalytics();
        const topVendors = vendorManagementService.getTopPerformingVendors(3);
        const integrationHealth =
          vendorManagementService.getIntegrationHealth();
        const alerts = vendorManagementService.getVendorAlerts();

        // Get contract workflow data
        const workflowSummary = contractLifecycleService.getWorkflowSummary();
        const activeWorkflows = contractLifecycleService.getActiveWorkflows();

        // Format top vendors for display
        const formattedTopVendors = topVendors.map((vendor) => ({
          id: vendor.id,
          name: vendor.name,
          category:
            vendor.category.charAt(0).toUpperCase() +
            vendor.category.slice(1).replace('_', ' '),
          performance: vendor.performance.overall.score,
          spend: vendor.financials.spend.totalAnnual,
          status: vendor.performance.overall.rating,
          contract_expires: new Date(
            vendor.contract.endDate
          ).toLocaleDateString(),
        }));

        // Format integrations for display
        const vendorsList = vendorManagementService.getAllVendors();
        const allIntegrations = vendorsList.flatMap((v) => v.integrations);
        const formattedIntegrations = allIntegrations
          .slice(0, 4)
          .map((integration) => ({
            name: integration.name,
            status: integration.status,
            uptime: integration.uptime,
            cost: integration.monthlyCost,
            lastSync: formatLastSync(integration.lastSync),
          }));

        // Format contract workflow data
        const recentWorkflows = activeWorkflows.slice(0, 5).map((workflow) => {
          const vendor = vendorsList.find((v) => v.id === workflow.vendorId);
          const currentStep = workflow.steps[workflow.currentStepIndex];
          const progress =
            (workflow.currentStepIndex / workflow.steps.length) * 100;

          return {
            id: workflow.id,
            vendorName: vendor?.name || 'Unknown Vendor',
            workflowType: workflow.workflowType
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            status: workflow.status,
            priority: workflow.priority,
            currentStep: currentStep?.name || 'Completed',
            dueDate: workflow.metadata.dueDate,
            progress: Math.round(progress),
          };
        });

        const contractWorkflows = {
          totalWorkflows: workflowSummary.total,
          activeWorkflows: workflowSummary.active,
          completedWorkflows: workflowSummary.completed,
          overdueWorkflows: workflowSummary.overdue,
          byType: workflowSummary.byType,
          recentWorkflows,
        };

        // Calculate trend data (simplified)
        const trends = {
          thisMonth: '+2.8%',
          lastQuarter: '+12.4%',
          yearOverYear: '+24.6%',
        };

        setVendorMetrics({
          totalVendors: analytics.totalVendors,
          activeVendors: analytics.activeVendors,
          averagePerformance: analytics.averagePerformance,
          totalSpend: analytics.totalSpend,
          costSavings: analytics.costSavings,
          vendorSatisfaction: analytics.vendorSatisfaction,
          contractsExpiring: analytics.contractsExpiring,
          riskAssessment: analytics.riskAssessment,
          trends,
          topVendors: formattedTopVendors,
          integrations: formattedIntegrations,
          alerts,
          contractWorkflows,
        });

        // Sync with billing system for latest data
        await vendorManagementService.syncWithBillingSystem();
      } catch (error) {
        console.error('Error fetching vendor metrics:', error);
        // Fallback to basic data if service fails
        setVendorMetrics({
          totalVendors: 0,
          activeVendors: 0,
          averagePerformance: 0,
          totalSpend: 0,
          costSavings: 0,
          vendorSatisfaction: 0,
          contractsExpiring: 0,
          riskAssessment: 'Unknown',
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
      } finally {
        setLoading(false);
      }
    };

    fetchVendorMetrics();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchVendorMetrics();
    }, 30000);

    return () => clearInterval(interval);
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
              🔗 Live Integration Health Dashboard
            </h2>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {vendorMetrics?.integrations?.map(
                (integration: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto auto auto',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 25px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background:
                          integration.status === 'active'
                            ? '#10b981'
                            : integration.status === 'warning'
                              ? '#f59e0b'
                              : '#ef4444',
                        boxShadow: `0 0 10px ${
                          integration.status === 'active'
                            ? '#10b981'
                            : integration.status === 'warning'
                              ? '#f59e0b'
                              : '#ef4444'
                        }`,
                        animation:
                          integration.status === 'active'
                            ? 'pulse 2s infinite'
                            : 'none',
                      }}
                    />
                    <div>
                      <h4
                        style={{
                          fontSize: '1.1rem',
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
                          fontSize: '1.2rem',
                          fontWeight: '700',
                          color:
                            integration.uptime >= 99
                              ? '#10b981'
                              : integration.uptime >= 95
                                ? '#f59e0b'
                                : '#ef4444',
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
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          color:
                            integration.status === 'active'
                              ? '#10b981'
                              : '#f59e0b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {integration.status}
                      </div>
                      <p
                        style={{
                          fontSize: '0.7rem',
                          color: 'rgba(255, 255, 255, 0.6)',
                          margin: 0,
                        }}
                      >
                        Status
                      </p>
                    </div>
                    <button
                      style={{
                        background:
                          integration.status === 'active'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : 'rgba(245, 158, 11, 0.2)',
                        color:
                          integration.status === 'active'
                            ? '#10b981'
                            : '#f59e0b',
                        border: `1px solid ${integration.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        borderRadius: '8px',
                        padding: '0.75rem 1.25rem',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      📊 Monitor
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Enhanced Integration Health Summary */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                marginTop: '2rem',
                backdropFilter: 'blur(10px)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.4rem',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🏥 Integration Health & Performance
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#10b981',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {vendorMetrics?.integrations
                      ? (
                          vendorMetrics.integrations.reduce(
                            (sum: number, i: any) => sum + i.uptime,
                            0
                          ) / vendorMetrics.integrations.length
                        ).toFixed(1)
                      : '0'}
                    %
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Average Uptime
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#3b82f6',
                      marginBottom: '0.5rem',
                    }}
                  >
                    $
                    {vendorMetrics?.integrations
                      ? vendorMetrics.integrations
                          .reduce((sum: number, i: any) => sum + i.cost, 0)
                          .toFixed(2)
                      : '0.00'}
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Total Monthly Cost
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#f59e0b',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {vendorMetrics?.integrations
                      ? vendorMetrics.integrations.filter(
                          (i: any) => i.status !== 'active'
                        ).length
                      : 0}
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Need Attention
                  </p>
                </div>
                <div
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: '12px',
                    padding: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '2rem',
                      fontWeight: '700',
                      color: '#8b5cf6',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {vendorMetrics?.integrations?.length || 0}
                  </div>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: '500',
                    }}
                  >
                    Total Integrations
                  </p>
                </div>
              </div>

              {/* Integration Optimization Recommendations */}
              <div style={{ marginTop: '2rem' }}>
                <h4
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🤖 AI Optimization Recommendations
                </h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <h5 style={{ color: '#10b981', margin: '0 0 0.5rem 0' }}>
                      💡 Integration Consolidation
                    </h5>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Consolidate similar integrations to reduce costs by 25%
                      and improve reliability
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '8px',
                      padding: '1rem',
                    }}
                  >
                    <h5 style={{ color: '#3b82f6', margin: '0 0 0.5rem 0' }}>
                      📈 Performance Optimization
                    </h5>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                      }}
                    >
                      Upgrade underperforming integrations to improve overall
                      system reliability
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Automated Contract Management Tab */}
        {activeTab === 'contracts' && (
          <div>
            <h2
              style={{
                fontSize: '1.8rem',
                fontWeight: '700',
                color: 'white',
                marginBottom: '1.5rem',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🤖 Automated Contract Lifecycle Management
            </h2>

            <div style={{ display: 'grid', gap: '2rem' }}>
              {/* Workflow Summary Dashboard */}
              <div
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  📊 Live Workflow Dashboard
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {vendorMetrics?.contractWorkflows?.totalWorkflows || 0}
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Total Workflows
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#3b82f6',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {vendorMetrics?.contractWorkflows?.activeWorkflows || 0}
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Active Workflows
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#10b981',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {vendorMetrics?.contractWorkflows?.completedWorkflows ||
                        0}
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Completed
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '2.2rem',
                        fontWeight: '700',
                        color: '#ef4444',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {vendorMetrics?.contractWorkflows?.overdueWorkflows || 0}
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        margin: 0,
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Overdue
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Workflows */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  ⚡ Active Contract Workflows
                </h3>

                {vendorMetrics?.contractWorkflows?.recentWorkflows &&
                vendorMetrics.contractWorkflows.recentWorkflows.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {vendorMetrics.contractWorkflows.recentWorkflows.map(
                      (workflow) => (
                        <div
                          key={workflow.id}
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.2s ease',
                            cursor: 'pointer',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-2px)';
                            e.currentTarget.style.boxShadow =
                              '0 8px 25px rgba(0,0,0,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div
                            style={{
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
                                  workflow.status === 'in_progress'
                                    ? '#3b82f6'
                                    : workflow.status === 'completed'
                                      ? '#10b981'
                                      : workflow.status === 'overdue'
                                        ? '#ef4444'
                                        : '#f59e0b',
                                boxShadow: `0 0 10px ${
                                  workflow.status === 'in_progress'
                                    ? '#3b82f6'
                                    : workflow.status === 'completed'
                                      ? '#10b981'
                                      : workflow.status === 'overdue'
                                        ? '#ef4444'
                                        : '#f59e0b'
                                }`,
                                animation:
                                  workflow.status === 'in_progress'
                                    ? 'pulse 2s infinite'
                                    : 'none',
                              }}
                            />

                            <div>
                              <h4
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  color: 'white',
                                  margin: '0 0 0.25rem 0',
                                }}
                              >
                                {workflow.vendorName} - {workflow.workflowType}
                              </h4>
                              <p
                                style={{
                                  fontSize: '0.8rem',
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  margin: 0,
                                }}
                              >
                                Current: {workflow.currentStep}
                              </p>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: '600',
                                  color:
                                    workflow.priority === 'urgent'
                                      ? '#ef4444'
                                      : workflow.priority === 'high'
                                        ? '#f59e0b'
                                        : workflow.priority === 'medium'
                                          ? '#3b82f6'
                                          : '#10b981',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {workflow.priority}
                              </div>
                              <p
                                style={{
                                  fontSize: '0.7rem',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  margin: 0,
                                }}
                              >
                                Priority
                              </p>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '600',
                                  color:
                                    workflow.progress >= 75
                                      ? '#10b981'
                                      : workflow.progress >= 50
                                        ? '#3b82f6'
                                        : '#f59e0b',
                                }}
                              >
                                {workflow.progress}%
                              </div>
                              <div
                                style={{
                                  width: '60px',
                                  height: '4px',
                                  background: 'rgba(255, 255, 255, 0.2)',
                                  borderRadius: '2px',
                                  marginTop: '4px',
                                  overflow: 'hidden',
                                }}
                              >
                                <div
                                  style={{
                                    width: `${workflow.progress}%`,
                                    height: '100%',
                                    background:
                                      workflow.progress >= 75
                                        ? '#10b981'
                                        : workflow.progress >= 50
                                          ? '#3b82f6'
                                          : '#f59e0b',
                                    transition: 'width 0.3s ease',
                                  }}
                                />
                              </div>
                            </div>

                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '500',
                                  color: 'white',
                                }}
                              >
                                {new Date(
                                  workflow.dueDate
                                ).toLocaleDateString()}
                              </div>
                              <p
                                style={{
                                  fontSize: '0.7rem',
                                  color: 'rgba(255, 255, 255, 0.6)',
                                  margin: 0,
                                }}
                              >
                                Due Date
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                      🤖
                    </div>
                    <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                      AI Contract Automation Ready
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      Automated workflows will appear here as contracts approach
                      renewal dates. The system monitors all contracts and
                      initiates workflows automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* Automation Features */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.3rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🎯 AI-Powered Automation Features
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                  }}
                >
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#10b981',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                      }}
                    >
                      🤖 Automated Renewal Workflows
                    </h4>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                        paddingLeft: '1.2rem',
                      }}
                    >
                      <li style={{ marginBottom: '0.5rem' }}>
                        AI performance analysis and recommendations
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Automated stakeholder notifications
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Smart negotiation strategy generation
                      </li>
                      <li>Digital signature workflow orchestration</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#3b82f6',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                      }}
                    >
                      📊 Real-Time Contract Monitoring
                    </h4>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                        paddingLeft: '1.2rem',
                      }}
                    >
                      <li style={{ marginBottom: '0.5rem' }}>
                        Performance tracking & compliance monitoring
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Risk assessment automation
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Cost optimization identification
                      </li>
                      <li>Proactive issue escalation</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#8b5cf6',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                      }}
                    >
                      ⚡ Intelligent Decision Support
                    </h4>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                        paddingLeft: '1.2rem',
                      }}
                    >
                      <li style={{ marginBottom: '0.5rem' }}>
                        AI-powered renewal recommendations
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Alternative vendor analysis
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Financial impact modeling
                      </li>
                      <li>Market benchmarking insights</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                    }}
                  >
                    <h4
                      style={{
                        color: '#f59e0b',
                        margin: '0 0 1rem 0',
                        fontSize: '1.1rem',
                      }}
                    >
                      🔔 Proactive Notifications
                    </h4>
                    <ul
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: 0,
                        fontSize: '0.9rem',
                        paddingLeft: '1.2rem',
                      }}
                    >
                      <li style={{ marginBottom: '0.5rem' }}>
                        Multi-channel alert system (Email, SMS)
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Stakeholder-specific communications
                      </li>
                      <li style={{ marginBottom: '0.5rem' }}>
                        Escalation rule automation
                      </li>
                      <li>Progress tracking & reporting</li>
                    </ul>
                  </div>
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
