'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BrokerPerformanceMetrics } from '../../services/BrokerAnalyticsService';

export default function BrokerDashboard() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('quotes-workflow');
  const [isLoading, setIsLoading] = useState(true);
  const [brokerMetrics, setBrokerMetrics] = useState<BrokerPerformanceMetrics | null>(null);

  // Load real broker performance metrics
  useEffect(() => {
    const loadBrokerMetrics = async () => {
      try {
        setIsLoading(true);

        // Import the pre-created broker analytics service instance
        const { brokerAnalyticsService } = await import('../../services/BrokerAnalyticsService');

        // Get real performance metrics
        const metrics = brokerAnalyticsService.getBrokerPerformanceMetrics();
        setBrokerMetrics(metrics);

        console.info('🏢 Broker Dashboard: Loaded real performance metrics:', metrics);
      } catch (error) {
        console.error('🏢 Broker Dashboard: Failed to load metrics:', error);
        // Fallback to empty metrics if service fails
        setBrokerMetrics({
          totalLoads: 0,
          activeLoads: 0,
          completedLoads: 0,
          totalRevenue: 0,
          avgMargin: 0,
          winRate: 0,
          customerCount: 0,
          avgLoadValue: 0,
          monthlyGrowth: 0,
          topCustomers: [],
        } as BrokerPerformanceMetrics);
      } finally {
        setIsLoading(false);
      }
    };

    loadBrokerMetrics();
  }, []);

  // Build KPIs from real data
  const agentKPIs = brokerMetrics ? [
    {
      title: 'Active Customers',
      value: brokerMetrics.customerCount,
      unit: '',
      change: brokerMetrics.customerCount > 0 ? '+1' : '--',
      trend: brokerMetrics.customerCount > 0 ? 'up' : 'neutral',
      description: 'Currently active customer accounts',
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Active Loads',
      value: brokerMetrics.activeLoads,
      unit: '',
      change: brokerMetrics.activeLoads > 0 ? `+${brokerMetrics.activeLoads}` : '--',
      trend: brokerMetrics.activeLoads > 0 ? 'up' : 'neutral',
      description: 'Loads currently in progress',
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Monthly Revenue',
      value: Math.round(brokerMetrics.totalRevenue / 1000), // Convert to K
      unit: 'K',
      change: brokerMetrics.totalRevenue > 0 ? `$${Math.round(brokerMetrics.totalRevenue / 1000)}K` : '--',
      trend: brokerMetrics.totalRevenue > 0 ? 'up' : 'neutral',
      description: 'Revenue generated this month',
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Win Rate',
      value: Math.round(brokerMetrics.winRate),
      unit: '%',
      change: brokerMetrics.winRate > 0 ? `${Math.round(brokerMetrics.winRate)}%` : '--',
      trend: brokerMetrics.winRate > 50 ? 'up' : brokerMetrics.winRate > 0 ? 'neutral' : 'neutral',
      description: 'Load bidding win rate',
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
  ] : [
    // Loading state
    {
      title: 'Active Customers',
      value: '--',
      unit: '',
      change: '--',
      trend: 'neutral',
      description: 'Loading customer data...',
      color: '#10b981',
      background: 'rgba(16, 185, 129, 0.5)',
      border: 'rgba(16, 185, 129, 0.3)',
    },
    {
      title: 'Active Loads',
      value: '--',
      unit: '',
      change: '--',
      trend: 'neutral',
      description: 'Loading load data...',
      color: '#3b82f6',
      background: 'rgba(59, 130, 246, 0.5)',
      border: 'rgba(59, 130, 246, 0.3)',
    },
    {
      title: 'Monthly Revenue',
      value: '--',
      unit: 'K',
      change: '--',
      trend: 'neutral',
      description: 'Loading revenue data...',
      color: '#8b5cf6',
      background: 'rgba(139, 92, 246, 0.5)',
      border: 'rgba(139, 92, 246, 0.3)',
    },
    {
      title: 'Win Rate',
      value: '--',
      unit: '%',
      change: '--',
      trend: 'neutral',
      description: 'Loading performance data...',
      color: '#f59e0b',
      background: 'rgba(245, 158, 11, 0.5)',
      border: 'rgba(245, 158, 11, 0.3)',
    },
  ];

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
            🏢 Brokerage Dashboard
          </h1>
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              margin: '4px 0 0 0',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            Professional Sales Management • Load Optimization • Customer
            Relations
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
              ✅ Broker Active
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
              🆔 Connected
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
              📊 Brokerage
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
            onClick={() => router.push('/broker')}
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
            Logout
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
        {agentKPIs.map((kpi, index) => (
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
        {[
          {
            id: 'quotes-workflow',
            label: 'Quotes & Workflow',
            icon: '💼',
            color: '#8b5cf6',
          },
          {
            id: 'loads-bids',
            label: 'Loads & Bidding',
            icon: '📦',
            color: '#06b6d4',
          },
          {
            id: 'ai-intelligence',
            label: 'AI Intelligence',
            icon: '🤖',
            color: '#ec4899',
          },
          {
            id: 'market-intelligence',
            label: 'Market Intelligence',
            icon: '📈',
            color: '#10b981',
          },
          { id: 'analytics', label: 'Analytics', icon: '📊', color: '#f59e0b' },
          {
            id: 'tasks',
            label: 'Task Management',
            icon: '📋',
            color: '#ef4444',
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background:
                selectedTab === tab.id
                  ? `linear-gradient(135deg, ${tab.color}88, ${tab.color}66)`
                  : 'rgba(255, 255, 255, 0.1)',
              color:
                selectedTab === tab.id ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border:
                selectedTab === tab.id
                  ? `2px solid ${tab.color}`
                  : '1px solid rgba(255, 255, 255, 0.2)',
              transform:
                selectedTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow:
                selectedTab === tab.id ? `0 8px 25px ${tab.color}40` : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          minHeight: '400px',
        }}
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.7 }}>
            🚛
          </div>
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '8px',
            }}
          >
            Welcome to Your Broker Dashboard
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '16px' }}>
            Your superior freight brokerage management platform
          </p>
        </div>
      </div>
    </div>
  );
}
