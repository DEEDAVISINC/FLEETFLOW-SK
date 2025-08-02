'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission } from '../../config/access';

// Enhanced User Interface for comprehensive header
interface EnhancedAccountingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    type: 'accountant' | 'finance_manager' | 'controller' | 'bookkeeper';
    permissions: string[];
  };
  tenantId: string;
  tenantName: string;
  companyInfo: {
    taxId: string;
    ein: string;
    fiscalYear: string;
    accountingMethod: string;
    operatingStatus: string;
  };
  supervisor: {
    name: string;
    phone: string;
    email: string;
    department: string;
    availability: string;
    responsiveness: string;
  };
  photos: {
    companyLogo?: string;
    userPhoto?: string;
  };
}

// Enterprise-Grade Tab Navigation
const TabNavigation = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '8px',
      padding: '4px',
      marginBottom: '20px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      gap: '2px',
    }}
  >
    {[
      { key: 'overview', label: 'Dashboard', icon: '📊' },
      { key: 'invoices', label: 'A/R Management', icon: '📋' },
      { key: 'billing', label: 'Billing Operations', icon: '💳' },
      { key: 'reports', label: 'Financial Reports', icon: '📈' },
    ].map((tab) => (
      <button
        key={tab.key}
        onClick={() => setActiveTab(tab.key)}
        style={{
          flex: 1,
          background: activeTab === tab.key ? '#10b981' : 'transparent',
          color: activeTab === tab.key ? 'white' : 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
        onMouseOver={(e) => {
          if (activeTab !== tab.key) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          if (activeTab !== tab.key) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
          }
        }}
      >
        <span style={{ fontSize: '14px' }}>{tab.icon}</span>
        {tab.label}
      </button>
    ))}
  </div>
);

// Modern Metric Card
const MetricCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: string;
  icon: string;
}) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseOver={(e) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLElement).style.background =
        'rgba(255, 255, 255, 0.15)';
    }}
    onMouseOut={(e) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLElement).style.background =
        'rgba(255, 255, 255, 0.1)';
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px',
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      {change && (
        <span
          style={{
            background: change.startsWith('+') ? '#dcfce7' : '#fecaca',
            color: change.startsWith('+') ? '#166534' : '#dc2626',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: '600',
          }}
        >
          {change}
        </span>
      )}
    </div>
    <div
      style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: 'white',
        marginBottom: '4px',
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>
      {title}
    </div>
  </div>
);

// Enterprise Financial Dashboard
const OverviewTab = () => {
  const [timeframe, setTimeframe] = useState('YTD');

  // Enterprise-level financial metrics
  const kpiMetrics = [
    {
      label: 'Revenue (YTD)',
      value: '$24.7M',
      change: '+15.3%',
      trend: 'up',
      previous: '$21.4M',
      target: '$28.5M',
    },
    {
      label: 'EBITDA Margin',
      value: '23.8%',
      change: '+2.1pp',
      trend: 'up',
      previous: '21.7%',
      target: '25.0%',
    },
    {
      label: 'Cash Position',
      value: '$8.9M',
      change: '-5.2%',
      trend: 'down',
      previous: '$9.4M',
      target: '$12.0M',
    },
    {
      label: 'DSO',
      value: '31 days',
      change: '-3 days',
      trend: 'up',
      previous: '34 days',
      target: '28 days',
    },
    {
      label: 'Working Capital',
      value: '$15.2M',
      change: '+8.7%',
      trend: 'up',
      previous: '$14.0M',
      target: '$18.0M',
    },
    {
      label: 'Burn Rate',
      value: '$1.2M/mo',
      change: '+12.5%',
      trend: 'down',
      previous: '$1.1M/mo',
      target: '$1.0M/mo',
    },
  ];

  const arAgingData = [
    {
      bucket: 'Current (0-30)',
      amount: 12400000,
      percentage: 67.2,
      count: 1847,
    },
    { bucket: '31-60 days', amount: 3200000, percentage: 17.3, count: 423 },
    { bucket: '61-90 days', amount: 1800000, percentage: 9.7, count: 187 },
    { bucket: '91-120 days', amount: 750000, percentage: 4.1, count: 89 },
    { bucket: '120+ days', amount: 320000, percentage: 1.7, count: 34 },
  ];

  const recentTransactions = [
    {
      id: 'TXN-89234',
      type: 'Wire',
      entity: 'Goldman Sachs Group',
      amount: 2450000,
      status: 'Cleared',
      time: '09:23 EST',
    },
    {
      id: 'TXN-89235',
      type: 'ACH',
      entity: 'Microsoft Corporation',
      amount: 875000,
      status: 'Pending',
      time: '09:18 EST',
    },
    {
      id: 'TXN-89236',
      type: 'Check',
      entity: 'JPMorgan Chase',
      amount: 1200000,
      status: 'Cleared',
      time: '08:45 EST',
    },
    {
      id: 'TXN-89237',
      type: 'Wire',
      entity: 'Apple Inc.',
      amount: 3200000,
      status: 'Processing',
      time: '08:12 EST',
    },
    {
      id: 'TXN-89238',
      type: 'ACH',
      entity: 'Berkshire Hathaway',
      amount: 950000,
      status: 'Cleared',
      time: '07:56 EST',
    },
  ];

  const monthlyPnL = [
    { month: 'Jan', revenue: 2100000, expenses: 1680000, netIncome: 420000 },
    { month: 'Feb', revenue: 2350000, expenses: 1740000, netIncome: 610000 },
    { month: 'Mar', revenue: 2180000, expenses: 1820000, netIncome: 360000 },
    { month: 'Apr', revenue: 2670000, expenses: 1950000, netIncome: 720000 },
    { month: 'May', revenue: 2420000, expenses: 1890000, netIncome: 530000 },
    { month: 'Jun', revenue: 2890000, expenses: 2100000, netIncome: 790000 },
  ];

  return (
    <div style={{ padding: '0', margin: '0' }}>
      {/* Enterprise Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              margin: '0 0 4px 0',
            }}
          >
            Financial Operations Center
          </h1>
          <div
            style={{
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            Real-time financial data • Last updated:{' '}
            {new Date().toLocaleString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '12px',
            }}
          >
            <option value='YTD'>Year to Date</option>
            <option value='Q4'>Q4 2024</option>
            <option value='Q3'>Q3 2024</option>
            <option value='MTD'>Month to Date</option>
          </select>
          <button
            style={{
              background: '#10b981',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        {kpiMetrics.map((metric, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '16px',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '4px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {metric.label}
            </div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'white',
                marginBottom: '4px',
              }}
            >
              {metric.value}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: metric.trend === 'up' ? '#10b981' : '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{metric.trend === 'up' ? '↗' : '↘'}</span>
              {metric.change}
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'rgba(255, 255, 255, 0.4)',
                marginTop: '4px',
              }}
            >
              Target: {metric.target}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '24px',
          marginBottom: '24px',
        }}
      >
        {/* A/R Aging Analysis */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                margin: 0,
              }}
            >
              Accounts Receivable Aging
            </h3>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
              }}
            >
              Total Outstanding: $
              {(
                arAgingData.reduce((sum, item) => sum + item.amount, 0) /
                1000000
              ).toFixed(1)}
              M
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {arAgingData.map((bucket, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 0',
                  borderBottom:
                    index < arAgingData.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.8)',
                      minWidth: '100px',
                    }}
                  >
                    {bucket.bucket}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        width: `${bucket.percentage}%`,
                        height: '100%',
                        background:
                          index === 0
                            ? '#10b981'
                            : index === 1
                              ? '#3b82f6'
                              : index === 2
                                ? '#f59e0b'
                                : index === 3
                                  ? '#f97316'
                                  : '#ef4444',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    minWidth: '200px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'white',
                      fontWeight: '500',
                    }}
                  >
                    ${(bucket.amount / 1000000).toFixed(1)}M
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.6)',
                      minWidth: '40px',
                      textAlign: 'right',
                    }}
                  >
                    {bucket.percentage}%
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      minWidth: '60px',
                      textAlign: 'right',
                    }}
                  >
                    {bucket.count} inv
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              margin: '0 0 16px 0',
            }}
          >
            Recent Transactions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentTransactions.map((txn, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderBottom:
                    index < recentTransactions.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      fontWeight: '500',
                    }}
                  >
                    {txn.entity}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    {txn.id} • {txn.type} • {txn.time}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    ${(txn.amount / 1000000).toFixed(1)}M
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color:
                        txn.status === 'Cleared'
                          ? '#10b981'
                          : txn.status === 'Pending'
                            ? '#f59e0b'
                            : '#3b82f6',
                    }}
                  >
                    {txn.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly P&L Chart */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              margin: 0,
            }}
          >
            Monthly P&L Performance
          </h3>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                }}
              />
              <span
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}
              >
                Revenue
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                }}
              />
              <span
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}
              >
                Expenses
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  background: '#3b82f6',
                  borderRadius: '50%',
                }}
              />
              <span
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}
              >
                Net Income
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: '16px',
            height: '200px',
            padding: '20px 0',
          }}
        >
          {monthlyPnL.map((data, index) => {
            const maxValue = Math.max(
              ...monthlyPnL.map((d) => Math.max(d.revenue, d.expenses))
            );
            const revenueHeight = (data.revenue / maxValue) * 180;
            const expenseHeight = (data.expenses / maxValue) * 180;
            const netIncomeHeight = (data.netIncome / maxValue) * 180;

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    gap: '2px',
                    height: '180px',
                  }}
                >
                  <div
                    style={{
                      width: '16px',
                      height: `${revenueHeight}px`,
                      background: '#10b981',
                      borderRadius: '2px 2px 0 0',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                  />
                  <div
                    style={{
                      width: '16px',
                      height: `${expenseHeight}px`,
                      background: '#ef4444',
                      borderRadius: '2px 2px 0 0',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                  />
                  <div
                    style={{
                      width: '16px',
                      height: `${netIncomeHeight}px`,
                      background: '#3b82f6',
                      borderRadius: '2px 2px 0 0',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                  />
                </div>
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '11px',
                    fontWeight: '500',
                  }}
                >
                  {data.month}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Invoices Tab
const InvoicesTab = () => {
  const [filter, setFilter] = useState('all');

  const invoices = [
    {
      id: 'INV-001',
      client: 'ABC Manufacturing',
      amount: 4850,
      status: 'paid',
      date: '2024-12-10',
    },
    {
      id: 'INV-002',
      client: 'Global Electronics',
      amount: 6200,
      status: 'sent',
      date: '2024-12-08',
    },
    {
      id: 'INV-003',
      client: 'DEF Logistics',
      amount: 3750,
      status: 'overdue',
      date: '2024-11-25',
    },
    {
      id: 'INV-004',
      client: 'Fresh Foods Corp',
      amount: 8900,
      status: 'paid',
      date: '2024-12-05',
    },
  ];

  const filteredInvoices =
    filter === 'all'
      ? invoices
      : invoices.filter((inv) => inv.status === filter);

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
          }}
        >
          Invoice Management
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
          }}
        >
          Track and manage all invoices
        </p>
      </div>

      {/* Filter Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          flexWrap: 'wrap',
        }}
      >
        {['all', 'paid', 'sent', 'overdue'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              background:
                filter === status
                  ? 'rgba(255, 255, 255, 0.2)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.85rem',
              fontWeight: '500',
              textTransform: 'capitalize',
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            fontWeight: '600',
            color: 'white',
            fontSize: '0.9rem',
          }}
        >
          <div>Invoice ID</div>
          <div>Client</div>
          <div>Amount</div>
          <div>Status</div>
          <div>Date</div>
        </div>

        {filteredInvoices.map((invoice, index) => (
          <div
            key={invoice.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr',
              padding: '16px 20px',
              borderBottom:
                index < filteredInvoices.length - 1
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : 'none',
              background:
                index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                index % 2 === 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent';
            }}
          >
            <div style={{ color: 'white', fontWeight: '500' }}>
              {invoice.id}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {invoice.client}
            </div>
            <div style={{ color: '#10b981', fontWeight: '600' }}>
              ${invoice.amount.toLocaleString()}
            </div>
            <div>
              <span
                style={{
                  background:
                    invoice.status === 'paid'
                      ? '#dcfce7'
                      : invoice.status === 'overdue'
                        ? '#fecaca'
                        : '#fef3c7',
                  color:
                    invoice.status === 'paid'
                      ? '#166534'
                      : invoice.status === 'overdue'
                        ? '#dc2626'
                        : '#92400e',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                }}
              >
                {invoice.status}
              </span>
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}
            >
              {invoice.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Billing Tab
const BillingTab = () => {
  const billingData = {
    currentPlan: { name: 'Professional Plan', price: 798, status: 'active' },
    usage: { drivers: 47, apiCalls: 2847, dataExports: 12, smsMessages: 156 },
    limits: { drivers: 50, apiCalls: 10000, dataExports: 50, smsMessages: 500 },
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
          }}
        >
          Billing & Usage
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
          }}
        >
          Manage your subscription and monitor usage
        </p>
      </div>

      {/* Current Plan */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
              }}
            >
              {billingData.currentPlan.name}
            </h3>
            <span
              style={{
                background: '#dcfce7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize',
              }}
            >
              {billingData.currentPlan.status}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}
            >
              ${billingData.currentPlan.price}
            </div>
            <div
              style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}
            >
              per month
            </div>
          </div>
        </div>
      </div>

      {/* Usage Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {Object.entries(billingData.usage).map(([key, value]) => (
          <div
            key={key}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {key === 'drivers'
                  ? '👥'
                  : key === 'apiCalls'
                    ? '🔌'
                    : key === 'dataExports'
                      ? '📊'
                      : '💬'}
              </span>
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                }}
              >
                {value}/
                {billingData.limits[key as keyof typeof billingData.limits]}
              </span>
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '4px',
              }}
            >
              {value.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: 'rgba(255, 255, 255, 0.7)',
                textTransform: 'capitalize',
              }}
            >
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reports Tab
const ReportsTab = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');

  const reports = [
    { id: 'revenue', name: 'Revenue Analysis', icon: '💰' },
    { id: 'profitability', name: 'Profitability', icon: '📊' },
    { id: 'cashflow', name: 'Cash Flow', icon: '💧' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 8px 0',
          }}
        >
          Financial Reports
        </h1>
        <p
          style={{
            fontSize: '1.1rem',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: 0,
          }}
        >
          Generate and export comprehensive financial reports
        </p>
      </div>

      {/* Report Selection */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {reports.map((report) => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              style={{
                background:
                  selectedReport === report.id
                    ? 'rgba(255, 255, 255, 0.2)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>{report.icon}</span>
              {report.name}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>
            {reports.find((r) => r.id === selectedReport)?.icon}
          </span>
          <h3
            style={{
              fontSize: '1.3rem',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {reports.find((r) => r.id === selectedReport)?.name}
          </h3>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <MetricCard
            title='Total Revenue'
            value='$247,500'
            change='+12.5%'
            icon='💰'
          />
          <MetricCard
            title='Growth Rate'
            value='8.2%'
            change='+2.1%'
            icon='📈'
          />
          <MetricCard
            title='Average Invoice'
            value='$3,250'
            change='+5.3%'
            icon='📋'
          />
          <MetricCard
            title='Collection Rate'
            value='94.2%'
            change='+1.8%'
            icon='✅'
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
            }}
          >
            📊 Export PDF
          </button>
          <button
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
            }}
          >
            📧 Email Report
          </button>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: '0.9rem',
            }}
          >
            🔄 Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ModernAccountingPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [accessGranted, setAccessGranted] = useState(false);

  const checkAccess = async () => {
    try {
      const hasAccess = checkPermission('accounting');
      setAccessGranted(hasAccess);
    } catch (error) {
      console.error('Access check failed:', error);
      setAccessGranted(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  // Enhanced user data for comprehensive header
  const currentUser: EnhancedAccountingUser = {
    id: 'AC-001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetflow.com',
    phone: '(555) 123-4567',
    role: {
      type: 'accountant',
      permissions: ['view_accounting', 'manage_invoices', 'generate_reports'],
    },
    tenantId: 'tenant_fleetflow_transport',
    tenantName: 'FleetFlow Transport LLC',
    companyInfo: {
      taxId: '12-3456789',
      ein: '12-3456789',
      fiscalYear: '2024',
      accountingMethod: 'Accrual',
      operatingStatus: 'Active',
    },
    supervisor: {
      name: 'Michael Chen',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@fleetflow.com',
      department: 'Finance Department',
      availability: 'Available 9AM-5PM',
      responsiveness: 'Avg Response: 2 hours',
    },
    photos: {
      companyLogo:
        'https://images.unsplash.com/photo-1558618047-f0c1b401b0cf?w=150&h=150&fit=crop&auto=format',
      userPhoto:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face&auto=format',
    },
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>⏳</div>
          <div
            style={{ color: 'white', fontSize: '1.2rem', fontWeight: 'bold' }}
          >
            Loading Accounting Dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!accessGranted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚫</div>
          <h2 style={{ color: 'white', margin: '0 0 16px 0' }}>
            Access Restricted
          </h2>
          <p
            style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '0 0 24px 0' }}
          >
            You need accounting access to view this page.
          </p>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #022c22 0%, #032e2a 25%, #044e46 50%, #042f2e 75%, #0a1612 100%)',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>Back to Dashboard
          </button>
        </Link>
      </div>

      <div
        style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 32px' }}
      >
        {/* 🔧 ENHANCED HEADER - Unified Portal Style with Green Theme */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '32px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow:
              '0 20px 60px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated Background Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 4s infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '150px',
              height: '150px',
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 6s infinite reverse',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div
                style={{
                  padding: '20px',
                  background:
                    'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background:
                      'linear-gradient(90deg, #10b981, #059669, #047857)',
                  }}
                />
                <span style={{ fontSize: '40px', display: 'block' }}>💰</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '42px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 12px 0',
                    textShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    background: 'linear-gradient(135deg, #ffffff, #e5e7eb)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {currentUser.tenantName}
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '18px',
                      fontWeight: '600',
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    Tax ID: {currentUser.companyInfo.taxId}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontSize: '18px',
                      fontWeight: '600',
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    EIN: {currentUser.companyInfo.ein}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      padding: '8px 16px',
                      background:
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(5, 150, 105, 0.3))',
                      borderRadius: '12px',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    {currentUser.companyInfo.operatingStatus}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '32px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '16px',
                        fontWeight: '500',
                      }}
                    >
                      {currentUser.name} •{' '}
                      <span
                        style={{
                          color: '#10b981',
                          fontWeight: '700',
                          textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                        }}
                      >
                        {currentUser.role.type
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      •{' '}
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '600',
                        }}
                      >
                        ID:{' '}
                        <span
                          style={{
                            color: '#10b981',
                            fontWeight: 'bold',
                            textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                          }}
                        >
                          {currentUser.id}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
                {/* Enhanced Supervisor Information */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '16px 20px',
                    background:
                      'linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(251, 191, 36, 0.9))',
                    borderRadius: '16px',
                    border: '2px solid rgba(251, 191, 36, 0.4)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(251, 191, 36, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, rgba(254, 249, 231, 0.95), rgba(245, 158, 11, 0.95))';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(251, 191, 36, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, rgba(254, 243, 199, 0.9), rgba(251, 191, 36, 0.9))';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 32px rgba(251, 191, 36, 0.2)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background:
                        'linear-gradient(90deg, #fbbf24, #f59e0b, #d97706)',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>👔</span>
                    <div>
                      <div
                        style={{
                          color: '#1f2937',
                          fontSize: '16px',
                          fontWeight: '700',
                        }}
                      >
                        Supervisor: {currentUser.supervisor.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(31, 41, 55, 0.8)',
                          fontSize: '14px',
                          fontWeight: '500',
                        }}
                      >
                        {currentUser.supervisor.phone} •{' '}
                        {currentUser.supervisor.availability}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#1f2937',
                      fontSize: '14px',
                      padding: '8px 12px',
                      background: 'rgba(31, 41, 55, 0.1)',
                      borderRadius: '10px',
                      border: '1px solid rgba(31, 41, 55, 0.2)',
                      fontWeight: '600',
                    }}
                  >
                    {currentUser.supervisor.responsiveness}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <button
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #059669, #047857)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow =
                    '0 12px 40px rgba(16, 185, 129, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #10b981, #059669)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 32px rgba(16, 185, 129, 0.3)';
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background:
                      'linear-gradient(90deg, #10b981, #059669, #047857)',
                  }}
                />
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced KPI Grid - Separate Section */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated Background Elements */}
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              right: '-15%',
              width: '150px',
              height: '150px',
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 5s infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '100px',
              height: '100px',
              background:
                'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              animation: 'pulse 7s infinite reverse',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#10b981',
                  textShadow: '0 0 6px rgba(16, 185, 129, 0.3)',
                  marginBottom: '4px',
                }}
              >
                $247,500
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Total Revenue
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                  textShadow: '0 0 6px rgba(251, 191, 36, 0.3)',
                  marginBottom: '4px',
                }}
              >
                $89,200
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Outstanding
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                  textShadow: '0 0 6px rgba(34, 197, 94, 0.3)',
                  marginBottom: '4px',
                }}
              >
                94.2%
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Collection Rate
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                  textShadow: '0 0 6px rgba(96, 165, 250, 0.3)',
                  marginBottom: '4px',
                }}
              >
                47
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Active Invoices
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#a78bfa',
                  textShadow: '0 0 6px rgba(167, 139, 250, 0.3)',
                  marginBottom: '4px',
                }}
              >
                12
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Overdue
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#f87171',
                  textShadow: '0 0 6px rgba(248, 113, 113, 0.3)',
                  marginBottom: '4px',
                }}
              >
                3
              </div>
              <div
                style={{
                  fontSize: '11px',
                  opacity: 0.8,
                  color: 'white',
                  fontWeight: '500',
                }}
              >
                Pending Approval
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Tab Content */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'invoices' && <InvoicesTab />}
        {activeTab === 'billing' && <BillingTab />}
        {activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
