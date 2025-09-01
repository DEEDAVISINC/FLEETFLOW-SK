'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { checkPermission } from '../../config/access';
import {
  companyAccountingService,
  type CompanyFinancialData,
} from '../../services/TenantAccountingService';
import UserDataService from '../../services/user-data-service';

// Enhanced User Interface for comprehensive header
interface EnhancedAccountingUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    type:
      | 'accountant'
      | 'finance_manager'
      | 'controller'
      | 'bookkeeper'
      | 'guest';
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
      { key: 'ai-settlement', label: 'AI Settlement', icon: '🤖' },
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

// Enterprise Financial Dashboard - Updated to use tenant data
const OverviewTab = ({
  companyData,
}: {
  companyData: CompanyFinancialData | null;
}) => {
  const [timeframe, setTimeframe] = useState('YTD');

  // Use real company data or fallback to defaults
  const kpiMetrics = companyData
    ? [
        {
          label: 'Revenue (YTD)',
          value: `$${(companyData.kpis.totalRevenue / 1000000).toFixed(1)}M`,
          change: `${companyData.kpis.revenueChange > 0 ? '+' : ''}${companyData.kpis.revenueChange.toFixed(1)}%`,
          trend: companyData.kpis.revenueChange > 0 ? 'up' : 'down',
          previous: `$${((companyData.kpis.totalRevenue * (1 - companyData.kpis.revenueChange / 100)) / 1000000).toFixed(1)}M`,
          target: `$${((companyData.kpis.totalRevenue * 1.2) / 1000000).toFixed(1)}M`,
        },
        {
          label: 'EBITDA Margin',
          value: `${companyData.kpis.ebitdaMargin.toFixed(1)}%`,
          change: `${companyData.kpis.ebitdaChange > 0 ? '+' : ''}${companyData.kpis.ebitdaChange.toFixed(1)}pp`,
          trend: companyData.kpis.ebitdaChange > 0 ? 'up' : 'down',
          previous: `${(companyData.kpis.ebitdaMargin - companyData.kpis.ebitdaChange).toFixed(1)}%`,
          target: `${(companyData.kpis.ebitdaMargin + 2).toFixed(1)}%`,
        },
        {
          label: 'Cash Position',
          value: `$${(companyData.kpis.cashPosition / 1000000).toFixed(1)}M`,
          change: `${companyData.kpis.cashChange > 0 ? '+' : ''}${companyData.kpis.cashChange.toFixed(1)}%`,
          trend: companyData.kpis.cashChange > 0 ? 'up' : 'down',
          previous: `$${((companyData.kpis.cashPosition * (1 - companyData.kpis.cashChange / 100)) / 1000000).toFixed(1)}M`,
          target: `$${((companyData.kpis.cashPosition * 1.5) / 1000000).toFixed(1)}M`,
        },
        {
          label: 'DSO',
          value: `${companyData.kpis.dso} days`,
          change: `${companyData.kpis.dsoChange > 0 ? '+' : ''}${companyData.kpis.dsoChange} days`,
          trend: companyData.kpis.dsoChange < 0 ? 'up' : 'down', // Lower DSO is better
          previous: `${companyData.kpis.dso - companyData.kpis.dsoChange} days`,
          target: `${Math.max(companyData.kpis.dso - 5, 20)} days`,
        },
        {
          label: 'Working Capital',
          value: `$${(companyData.kpis.workingCapital / 1000000).toFixed(1)}M`,
          change: `${companyData.kpis.workingCapitalChange > 0 ? '+' : ''}${companyData.kpis.workingCapitalChange.toFixed(1)}%`,
          trend: companyData.kpis.workingCapitalChange > 0 ? 'up' : 'down',
          previous: `$${((companyData.kpis.workingCapital * (1 - companyData.kpis.workingCapitalChange / 100)) / 1000000).toFixed(1)}M`,
          target: `$${((companyData.kpis.workingCapital * 1.3) / 1000000).toFixed(1)}M`,
        },
        {
          label: 'Collection Rate',
          value: `${companyData.kpis.collectionRate.toFixed(1)}%`,
          change: `${companyData.kpis.collectionRateChange > 0 ? '+' : ''}${companyData.kpis.collectionRateChange.toFixed(1)}%`,
          trend: companyData.kpis.collectionRateChange > 0 ? 'up' : 'down',
          previous: `${(companyData.kpis.collectionRate - companyData.kpis.collectionRateChange).toFixed(1)}%`,
          target: '95.0%',
        },
      ]
    : [
        // Fallback data for loading state
        {
          label: 'Revenue (YTD)',
          value: '$0.0M',
          change: '+0.0%',
          trend: 'up',
          previous: '$0.0M',
          target: '$0.0M',
        },
      ];

  // Use tenant-specific data
  const arAgingData = companyData?.arAging || [
    { bucket: 'Current (0-30)', amount: 0, percentage: 0, count: 0 },
    { bucket: '31-60 days', amount: 0, percentage: 0, count: 0 },
    { bucket: '61-90 days', amount: 0, percentage: 0, count: 0 },
    { bucket: '91-120 days', amount: 0, percentage: 0, count: 0 },
    { bucket: '120+ days', amount: 0, percentage: 0, count: 0 },
  ];

  const recentTransactions = companyData?.recentTransactions || [
    {
      id: 'TXN-000',
      type: 'Wire',
      entity: 'Loading...',
      amount: 0,
      status: 'Loading',
      time: '--:-- EST',
    },
  ];

  const monthlyPnL = companyData?.monthlyPnL || [
    { month: 'Jan', revenue: 0, expenses: 0, netIncome: 0 },
    { month: 'Feb', revenue: 0, expenses: 0, netIncome: 0 },
    { month: 'Mar', revenue: 0, expenses: 0, netIncome: 0 },
    { month: 'Apr', revenue: 0, expenses: 0, netIncome: 0 },
    { month: 'May', revenue: 0, expenses: 0, netIncome: 0 },
    { month: 'Jun', revenue: 0, expenses: 0, netIncome: 0 },
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

// Invoices Tab - Updated to use tenant data
const InvoicesTab = ({
  companyData,
}: {
  companyData: CompanyFinancialData | null;
}) => {
  const [filter, setFilter] = useState('all');

  const invoices = companyData?.invoices || [
    {
      id: 'INV-000',
      client: 'Loading...',
      amount: 0,
      status: 'pending' as const,
      date: '2024-12-01',
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

// AI Settlement Tab
const AISettlementTab = () => {
  const [selectedSettlementView, setSelectedSettlementView] =
    useState('dashboard');
  const [processingInvoices, setProcessingInvoices] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // AI settlement automation data - empty state
  const settlementData = {
    todayProcessed: 0,
    accuracy: 0,
    savedTime: 0,
    discrepanciesFound: 0,
    autoResolvedDiscrepancies: 0,
    pendingReview: 0,
    averageProcessingTime: 'No data',
  };

  const recentInvoices: any[] = [];

  const handleInvoiceUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          alert(
            '🤖 AI Invoice Processing Complete!\n\n✅ 3 invoices processed successfully\n📋 2 auto-approved for payment\n⚠️ 1 flagged for review (rate discrepancy)\n⏱️ Average processing time: 9 seconds'
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            marginBottom: '8px',
          }}
        >
          🤖 AI-Driven Settlement Automation
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px',
            margin: 0,
          }}
        >
          Intelligent invoice processing with OCR, discrepancy detection, and
          automated approvals
        </p>
      </div>

      {/* AI Performance Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px',
        }}
      >
        {[
          {
            label: 'Invoices Processed Today',
            value: settlementData.todayProcessed,
            unit: '',
            color: '#10b981',
            icon: '📋',
          },
          {
            label: 'AI Accuracy Rate',
            value: settlementData.accuracy,
            unit: '%',
            color: '#06b6d4',
            icon: '🎯',
          },
          {
            label: 'Processing Time Saved',
            value: settlementData.savedTime,
            unit: 'hrs',
            color: '#8b5cf6',
            icon: '⏱️',
          },
          {
            label: 'Auto-Resolved Issues',
            value: settlementData.autoResolvedDiscrepancies,
            unit: `/${settlementData.discrepanciesFound}`,
            color: '#f59e0b',
            icon: '🔧',
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '20px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>
              {stat.icon}
            </div>
            <div
              style={{
                color: stat.color,
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '4px',
              }}
            >
              {stat.value}
              {stat.unit}
            </div>
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}
      >
        {/* Invoice Processing Interface */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            📄 AI Invoice Processing Center
          </h3>

          {/* Upload Interface */}
          <div style={{ marginBottom: '25px' }}>
            <div
              style={{
                border: '2px dashed rgba(139, 92, 246, 0.5)',
                borderRadius: '12px',
                padding: '30px',
                textAlign: 'center',
                background: 'rgba(139, 92, 246, 0.1)',
                marginBottom: '15px',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>📁</div>
              <p
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                Drag & Drop Invoices or Click to Upload
              </p>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}
              >
                Supports PDF, PNG, JPG, TIFF formats • AI processes in real-time
              </p>

              {uploadProgress > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '20px',
                      height: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        background: '#10b981',
                        height: '100%',
                        width: `${uploadProgress}%`,
                        borderRadius: '20px',
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      color: '#10b981',
                      fontSize: '12px',
                      marginTop: '5px',
                    }}
                  >
                    🤖 AI Processing: {uploadProgress}% complete
                  </p>
                </div>
              )}

              <button
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 30px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={handleInvoiceUpload}
              >
                🤖 Upload & Process with AI
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  alert(
                    '🔍 OCR Analysis:\n\n✅ Text extracted: 98% accuracy\n📊 Data fields identified: 15/15\n🎯 Confidence score: 95%\n⚡ Processing time: 3.2 seconds'
                  )
                }
              >
                🔍 OCR Analysis
              </button>
              <button
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  alert(
                    '🔍 Discrepancy Check:\n\n⚠️ Found 2 potential issues:\n- Rate variance: $50 (+2.1%)\n- Fuel surcharge missing\n\n🤖 AI Recommendation:\n- Auto-approve rate variance (within 5% threshold)\n- Flag fuel surcharge for manual review'
                  )
                }
              >
                🔧 Check Discrepancies
              </button>
              <button
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={() =>
                  alert(
                    '🤖 Batch Processing Started!\n\n📋 Processing 8 pending invoices...\n⏱️ Estimated completion: 2 minutes\n📊 Expected accuracy: 97%+'
                  )
                }
              >
                ⚡ Batch Process
              </button>
            </div>
          </div>

          {/* Recent Invoices */}
          <h4
            style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              marginBottom: '15px',
            }}
          >
            📋 Recently Processed Invoices
          </h4>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            {recentInvoices.map((invoice, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  alert(
                    `Invoice ${invoice.id} Details:\n\n` +
                      `Carrier: ${invoice.carrier}\n` +
                      `Amount: $${invoice.amount.toLocaleString()}\n` +
                      `AI Confidence: ${invoice.confidence}%\n` +
                      `Processing Time: ${invoice.processingTime}\n\n` +
                      `Status: ${invoice.status}\n` +
                      `${
                        invoice.discrepancies.length > 0
                          ? `Issues: ${invoice.discrepancies.join(', ')}`
                          : 'No issues detected'
                      }\n\n` +
                      `🤖 AI Analysis: ${
                        invoice.confidence >= 95
                          ? 'High confidence - auto-approved'
                          : invoice.confidence >= 85
                            ? 'Medium confidence - standard review'
                            : 'Low confidence - manual review required'
                      }`
                  );
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
                    <div
                      style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: '600',
                      }}
                    >
                      {invoice.id} • {invoice.carrier}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      ${invoice.amount.toLocaleString()} • {invoice.confidence}%
                      confidence • {invoice.processingTime}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        background:
                          invoice.status === 'Auto-Approved'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : invoice.status === 'AI Processed'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : invoice.status === 'Discrepancy Detected'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(239, 68, 68, 0.2)',
                        color:
                          invoice.status === 'Auto-Approved'
                            ? '#10b981'
                            : invoice.status === 'AI Processed'
                              ? '#3b82f6'
                              : invoice.status === 'Discrepancy Detected'
                                ? '#f59e0b'
                                : '#ef4444',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      {invoice.status}
                    </div>
                  </div>
                </div>
                {invoice.discrepancies.length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      color: '#f59e0b',
                    }}
                  >
                    ⚠️ {invoice.discrepancies.join(' • ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insights Panel */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '25px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            🧠 AI Processing Insights
          </h3>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Processing Stats */}
            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                📊 Today&apos;s Performance
              </h4>
              {[
                {
                  metric: 'Average Processing Time',
                  value: '12 seconds',
                  improvement: '-45%',
                },
                {
                  metric: 'Accuracy Rate',
                  value: '99.2%',
                  improvement: '+2.1%',
                },
                {
                  metric: 'Auto-Resolution Rate',
                  value: '85%',
                  improvement: '+12%',
                },
                {
                  metric: 'Manual Review Needed',
                  value: '8.5%',
                  improvement: '-18%',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    {stat.metric}
                  </span>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        color: '#10b981',
                        fontSize: '10px',
                        marginLeft: '5px',
                        fontWeight: '600',
                      }}
                    >
                      {stat.improvement}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Common Issues */}
            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                ⚠️ Common Discrepancies
              </h4>
              {[
                { issue: 'Rate Variances', count: 5, trend: 'stable' },
                {
                  issue: 'Missing Fuel Surcharge',
                  count: 3,
                  trend: 'decreasing',
                },
                {
                  issue: 'Detention Time Disputes',
                  count: 2,
                  trend: 'increasing',
                },
                { issue: 'Accessorial Charges', count: 2, trend: 'stable' },
              ].map((issue, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '12px',
                    }}
                  >
                    {issue.issue}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        color: '#f59e0b',
                        fontSize: '12px',
                        fontWeight: '600',
                      }}
                    >
                      {issue.count}
                    </span>
                    <span
                      style={{
                        color:
                          issue.trend === 'decreasing'
                            ? '#10b981'
                            : issue.trend === 'increasing'
                              ? '#ef4444'
                              : '#6b7280',
                        fontSize: '10px',
                      }}
                    >
                      {issue.trend === 'decreasing'
                        ? '↓'
                        : issue.trend === 'increasing'
                          ? '↑'
                          : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div>
              <h4
                style={{
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '10px',
                }}
              >
                ⚡ Quick Actions
              </h4>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {[
                  { label: 'Review Flagged Items', count: 4, color: '#f59e0b' },
                  { label: 'Approve AI Matches', count: 12, color: '#10b981' },
                  { label: 'Export Reports', count: null, color: '#06b6d4' },
                  { label: 'Train AI Model', count: null, color: '#8b5cf6' },
                ].map((action, index) => (
                  <button
                    key={index}
                    style={{
                      background: `rgba(${
                        action.color === '#f59e0b'
                          ? '245, 158, 11'
                          : action.color === '#10b981'
                            ? '16, 185, 129'
                            : action.color === '#06b6d4'
                              ? '6, 182, 212'
                              : '139, 92, 246'
                      }, 0.2)`,
                      color: action.color,
                      border: 'none',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                    onClick={() => {
                      const messages = {
                        'Review Flagged Items':
                          '📋 4 invoices flagged for review:\n\n• Rate discrepancies: 2\n• Missing documentation: 1\n• Fuel surcharge disputes: 1\n\nOpen review queue?',
                        'Approve AI Matches':
                          '✅ 12 invoices ready for approval:\n\nTotal amount: $28,450\nAverage confidence: 96.2%\nEstimated processing time: 2 minutes\n\nApprove all matches?',
                        'Export Reports':
                          '📊 Settlement Reports Available:\n\n• Daily processing summary\n• AI accuracy metrics\n• Discrepancy analysis\n• Cost savings report\n\nSelect report format?',
                        'Train AI Model':
                          '🤖 AI Model Training:\n\nCurrent accuracy: 99.2%\nTraining data: 15,847 invoices\nLast update: 2 days ago\n\nStart training with recent data?',
                      };
                      alert(
                        messages[action.label as keyof typeof messages] ||
                          'Feature coming soon!'
                      );
                    }}
                  >
                    {action.label} {action.count && `(${action.count})`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
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
  const [companyFinancialData, setCompanyFinancialData] =
    useState<CompanyFinancialData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  const checkAccess = async () => {
    try {
      // First check if user is logged in through user management system
      const userDataService = UserDataService.getInstance();
      const currentUser = userDataService.getCurrentUser();

      if (!currentUser) {
        console.warn(
          'No user logged in. Redirecting to login or using guest mode.'
        );
        // In production, redirect to login page
        // window.location.href = '/login';
      }

      const hasAccess = checkPermission('accounting');
      setAccessGranted(hasAccess);
    } catch (error) {
      console.error('Access check failed:', error);
      setAccessGranted(false);
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyData = async () => {
    try {
      setDataLoading(true);

      // Create a demo subscription for the user if they don't have one
      const userDataService = UserDataService.getInstance();
      const currentUser = userDataService.getCurrentUser();
      if (currentUser) {
        // Import subscription service dynamically to avoid circular dependencies
        const { SubscriptionManagementService } = await import(
          '../../services/SubscriptionManagementService'
        );

        const existingSubscription =
          SubscriptionManagementService.getUserSubscription(currentUser.id);
        if (!existingSubscription) {
          // Create a demo subscription based on user's department
          const demoTierMap: Record<string, string> = {
            MGR: 'enterprise-module', // Enterprise Professional $2,499/month
            DC: 'dispatcher-pro', // Professional Dispatcher $79/month
            BB: 'broker-elite', // Professional Brokerage $249/month
            DM: 'university-access', // FleetFlow University $49/month
          };

          const tierId =
            demoTierMap[currentUser.departmentCode] || 'dispatcher-pro';

          console.info(
            `🎯 Creating demo subscription ${tierId} for ${currentUser.name}`
          );
          await SubscriptionManagementService.createSubscription(
            currentUser.id,
            currentUser.email,
            currentUser.name,
            tierId
          );
        }
      }

      const data = await companyAccountingService.getCompanyFinancialData();
      setCompanyFinancialData(data);
    } catch (error) {
      console.error('Failed to load company financial data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    // Ensure a user is logged in for demo purposes
    const userDataService = UserDataService.getInstance();
    const currentUser = userDataService.getCurrentUser();

    if (!currentUser) {
      // No auto-login - show empty state
      console.info('🔐 No user logged in - showing empty state');
    }

    checkAccess();
    loadCompanyData();
  }, []);

  // Get current logged-in user from user management system
  const userDataService = UserDataService.getInstance();
  const loggedInUser = userDataService.getCurrentUser();

  // Enhanced user data using real user profile
  const currentUser: EnhancedAccountingUser = loggedInUser
    ? {
        id: loggedInUser.id,
        name: loggedInUser.name,
        email: loggedInUser.email,
        phone: loggedInUser.phone,
        role: {
          type: 'accountant',
          permissions: Object.keys(loggedInUser.permissions || {}).filter(
            (key) => loggedInUser.permissions?.[key] === true
          ),
        },
        tenantId: loggedInUser.id,
        tenantName:
          companyFinancialData?.companyName || `${loggedInUser.name}'s Company`,
        companyInfo: companyFinancialData?.companyInfo || {
          taxId: 'Not Configured',
          ein: 'Not Configured',
          fiscalYear: '2024',
          accountingMethod: 'Not Configured',
          operatingStatus: 'Not Configured',
        },
        supervisor: {
          name: 'Not Configured',
          phone: 'Not Configured',
          email: 'Not Configured',
          department: 'Not Configured',
          availability: 'Not Available',
          responsiveness: 'No Data',
        },
        photos: {
          companyLogo: undefined,
          userPhoto: loggedInUser?.profilePhoto || undefined,
        },
      }
    : {
        // Fallback for guest/non-logged in users
        id: 'GUEST-001',
        name: 'Guest User',
        email: 'guest@fleetflow.com',
        phone: '(555) 000-0000',
        role: {
          type: 'guest',
          permissions: [],
        },
        tenantId: 'guest-tenant',
        tenantName: 'Not Configured',
        companyInfo: {
          taxId: 'Not Configured',
          ein: 'Not Configured',
          fiscalYear: '2024',
          accountingMethod: 'Not Configured',
          operatingStatus: 'Not Configured',
        },
        supervisor: {
          name: 'Not Configured',
          phone: 'Not Configured',
          email: 'Not Configured',
          department: 'Not Configured',
          availability: 'Not Available',
          responsiveness: 'No Data',
        },
        photos: {
          companyLogo: undefined,
          userPhoto: undefined,
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
                      User Not Configured •{' '}
                      <span
                        style={{
                          color: '#10b981',
                          fontWeight: '700',
                          textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
                        }}
                      >
                        Not Configured
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
                          Not Configured
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
                onClick={loadCompanyData}
                disabled={dataLoading}
                style={{
                  background: dataLoading
                    ? 'rgba(16, 185, 129, 0.6)'
                    : 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 28px',
                  borderRadius: '16px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: dataLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  opacity: dataLoading ? 0.7 : 1,
                }}
                onMouseOver={(e) => {
                  if (!dataLoading) {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #059669, #047857)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 40px rgba(16, 185, 129, 0.4)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!dataLoading) {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #10b981, #059669)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 32px rgba(16, 185, 129, 0.3)';
                  }
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
                {dataLoading ? '🔄 Loading...' : '🔄 Refresh Company Data'}
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
                $
                {companyFinancialData
                  ? (
                      companyFinancialData.kpis.totalRevenue / 1000
                    ).toLocaleString()
                  : '0'}
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
                $
                {companyFinancialData
                  ? (
                      (companyFinancialData.kpis.totalRevenue * 0.15) /
                      1000
                    ).toLocaleString()
                  : '0'}
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
                {companyFinancialData
                  ? `${companyFinancialData.kpis.collectionRate.toFixed(1)}%`
                  : '0%'}
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
                {companyFinancialData
                  ? companyFinancialData.invoices.length
                  : 0}
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
                {companyFinancialData
                  ? companyFinancialData.invoices.filter(
                      (inv) => inv.status === 'overdue'
                    ).length
                  : 0}
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
                {companyFinancialData
                  ? companyFinancialData.invoices.filter(
                      (inv) => inv.status === 'pending'
                    ).length
                  : 0}
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

            {/* Subscription Revenue Card */}
            {companyFinancialData?.subscription && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#3b82f6',
                    marginBottom: '8px',
                  }}
                >
                  📱 Subscription Revenue
                </div>
                <div
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1e40af',
                    marginBottom: '4px',
                  }}
                >
                  ${companyFinancialData.subscription.monthlyRevenue}/month
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#1e40af',
                    opacity: 0.8,
                  }}
                >
                  {companyFinancialData.subscription.tierName}
                  {companyFinancialData.subscription.trialDaysRemaining && (
                    <span>
                      {' '}
                      • {
                        companyFinancialData.subscription.trialDaysRemaining
                      }{' '}
                      days left in trial
                    </span>
                  )}
                </div>
                <Link
                  href='/subscription-management/subscription-dashboard'
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '6px 12px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '6px',
                    color: '#1e40af',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  Manage Subscription →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* CSS Animation for Spinner */}
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>

        {/* Loading Indicator */}
        {dataLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              margin: '20px 0',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'white',
                fontSize: '16px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(16, 185, 129, 0.3)',
                  borderTop: '2px solid #10b981',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
              Loading company financial data...
            </div>
          </div>
        )}

        {/* Tab Content */}
        {!dataLoading && activeTab === 'overview' && (
          <OverviewTab companyData={companyFinancialData} />
        )}
        {!dataLoading && activeTab === 'invoices' && (
          <InvoicesTab companyData={companyFinancialData} />
        )}
        {!dataLoading && activeTab === 'billing' && <BillingTab />}
        {!dataLoading && activeTab === 'ai-settlement' && <AISettlementTab />}
        {!dataLoading && activeTab === 'reports' && <ReportsTab />}
      </div>
    </div>
  );
}
