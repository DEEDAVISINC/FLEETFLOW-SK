'use client';

import {
  AlertCircle,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Calculator,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Info,
  LineChart,
  Percent,
  PieChart,
  Receipt,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { BrokerFinancialService } from '../services/BrokerFinancialService';

interface BrokerFinancialDashboardProps {
  brokerId: string;
}

const BrokerFinancialDashboard: React.FC<BrokerFinancialDashboardProps> = ({
  brokerId,
}) => {
  // Add CSS for loading spinner animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'cashflow' | 'profitloss' | 'commissions' | 'expenses'
  >('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const financialService = BrokerFinancialService.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, [brokerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await financialService.getFinancialDashboard(brokerId);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading financial dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return (
          <CheckCircle
            style={{ width: '20px', height: '20px', color: '#10b981' }}
          />
        );
      case 'warning':
        return (
          <AlertTriangle
            style={{ width: '20px', height: '20px', color: '#f59e0b' }}
          />
        );
      case 'error':
        return (
          <AlertCircle
            style={{ width: '20px', height: '20px', color: '#ef4444' }}
          />
        );
      default:
        return (
          <Info style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
        );
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '400px',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(59, 130, 246, 0.3)',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
         />
      </div>
    );
  }

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #10b981',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.9)',
                  marginBottom: '8px',
                }}
              >
                Revenue Growth
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatPercent(dashboardData.kpis.revenueGrowth)}
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
              }}
            >
              <TrendingUp
                style={{ width: '24px', height: '24px', color: '#10b981' }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#10b981',
            }}
          >
            <ArrowUpRight
              style={{ marginRight: '4px', width: '16px', height: '16px' }}
            />
            <span>vs last month</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #3b82f6',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '8px',
                }}
              >
                Profit Margin
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatPercent(dashboardData.kpis.profitMargin)}
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
              }}
            >
              <Percent
                style={{ width: '24px', height: '24px', color: '#3b82f6' }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#3b82f6',
            }}
          >
            <Target
              style={{ marginRight: '4px', width: '16px', height: '16px' }}
            />
            <span>Target: 20%</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #8b5cf6',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '8px',
                }}
              >
                Cash Position
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatCurrency(dashboardData.kpis.cashPosition)}
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '12px',
              }}
            >
              <Banknote
                style={{ width: '24px', height: '24px', color: '#8b5cf6' }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#8b5cf6',
            }}
          >
            <Clock
              style={{ marginRight: '4px', width: '16px', height: '16px' }}
            />
            <span>{dashboardData.kpis.dso} days DSO</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #f97316',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '8px',
                }}
              >
                Operating Ratio
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatPercent(dashboardData.kpis.operatingRatio)}
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(249, 115, 22, 0.2)',
                borderRadius: '12px',
              }}
            >
              <BarChart3
                style={{ width: '24px', height: '24px', color: '#f97316' }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#f97316',
            }}
          >
            <ArrowDownRight
              style={{ marginRight: '4px', width: '16px', height: '16px' }}
            />
            <span>Lower is better</span>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #ec4899',
            padding: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: '8px',
                }}
              >
                ROI
              </p>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: 0,
                }}
              >
                {formatPercent(dashboardData.kpis.roiPercentage)}
              </p>
            </div>
            <div
              style={{
                padding: '12px',
                background: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '12px',
              }}
            >
              <TrendingUp
                style={{ width: '24px', height: '24px', color: '#ec4899' }}
              />
            </div>
          </div>
          <div
            style={{
              marginTop: '16px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: '#ec4899',
            }}
          >
            <Zap
              style={{ marginRight: '4px', width: '16px', height: '16px' }}
            />
            <span>Year-to-date</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <AlertTriangle
              style={{ width: '20px', height: '20px', color: '#f59e0b' }}
            />
          </div>
          Financial Alerts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dashboardData.alerts.map((alert: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                background: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(5px)',
                borderRadius: '12px',
                border: `1px solid ${
                  alert.type === 'success'
                    ? 'rgba(16, 185, 129, 0.3)'
                    : alert.type === 'warning'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : alert.type === 'error'
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(59, 130, 246, 0.3)'
                }`,
                padding: '16px',
              }}
            >
              <div
                style={{
                  padding: '8px',
                  background:
                    alert.type === 'success'
                      ? 'rgba(16, 185, 129, 0.2)'
                      : alert.type === 'warning'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : alert.type === 'error'
                          ? 'rgba(239, 68, 68, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '8px',
                  marginRight: '12px',
                }}
              >
                {getAlertIcon(alert.type)}
              </div>
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'white',
                    margin: 0,
                    marginBottom: '4px',
                  }}
                >
                  {alert.title}
                </h4>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.95)',
                    margin: '4px 0 0 0',
                  }}
                >
                  {alert.message}
                </p>
                {alert.action && (
                  <button
                    style={{
                      marginTop: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#3b82f6',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {alert.action} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCashFlow = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <LineChart
              style={{ width: '20px', height: '20px', color: '#3b82f6' }}
            />
          </div>
          Cash Flow Analysis
        </h3>

        {/* Cash Flow Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#3b82f6',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Current Position
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              {formatCurrency(
                dashboardData.cashFlow.metrics.currentCashPosition
              )}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#10b981',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              30-Day Projection
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              {formatCurrency(
                dashboardData.cashFlow.metrics.projectedCashPosition
              )}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(139, 92, 246, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#8b5cf6',
                margin: 0,
                marginBottom: '8px',
              }}
            >
              Working Capital
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              {formatCurrency(dashboardData.cashFlow.metrics.workingCapital)}
            </p>
          </div>
        </div>

        {/* Cash Flow Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dashboardData.cashFlow.alerts.map((alert: any, index: number) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                padding: '12px 16px',
                border: `1px solid ${
                  alert.type === 'critical'
                    ? 'rgba(239, 68, 68, 0.3)'
                    : alert.type === 'warning'
                      ? 'rgba(245, 158, 11, 0.3)'
                      : 'rgba(59, 130, 246, 0.3)'
                }`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    padding: '6px',
                    background:
                      alert.type === 'critical'
                        ? 'rgba(239, 68, 68, 0.2)'
                        : alert.type === 'warning'
                          ? 'rgba(245, 158, 11, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '6px',
                    marginRight: '12px',
                  }}
                >
                  <AlertTriangle
                    style={{
                      width: '16px',
                      height: '16px',
                      color:
                        alert.type === 'critical'
                          ? '#ef4444'
                          : alert.type === 'warning'
                            ? '#f59e0b'
                            : '#3b82f6',
                    }}
                  />
                </div>
                <span style={{ fontSize: '14px', color: 'white' }}>
                  {alert.message}
                </span>
              </div>
              {alert.amount && (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: alert.amount < 0 ? '#ef4444' : '#10b981',
                  }}
                >
                  {formatCurrency(Math.abs(alert.amount))}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProfitLoss = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #10b981',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Total Revenue
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(dashboardData.profitLoss.summary.totalRevenue)}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #ef4444',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Total Costs
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(dashboardData.profitLoss.summary.totalCosts)}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #3b82f6',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Gross Margin
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatPercent(dashboardData.profitLoss.summary.grossMarginPercent)}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #8b5cf6',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Net Profit
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(dashboardData.profitLoss.summary.netProfit)}
          </p>
        </div>
      </div>

      {/* Lane Profitability */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <BarChart3
              style={{ width: '20px', height: '20px', color: '#3b82f6' }}
            />
          </div>
          Profitability by Lane
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
              >
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Lane
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Revenue
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Costs
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Margin
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Margin %
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Loads
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.profitLoss.byLane.map(
                (lane: any, index: number) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {lane.laneName}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(lane.revenue)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(lane.costs)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(lane.margin)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '600',
                        color:
                          lane.marginPercent > 20
                            ? '#10b981'
                            : lane.marginPercent > 15
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {formatPercent(lane.marginPercent)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {lane.loadCount}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profitability */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <Users
              style={{ width: '20px', height: '20px', color: '#10b981' }}
            />
          </div>
          Customer Profitability
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Customer
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Revenue
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Net Profit
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Margin %
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Credit Rating
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Lifetime Value
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.profitLoss.byCustomer.map(
                (customer: any, index: number) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {customer.customerName}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(customer.totalRevenue)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(customer.netProfit)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '600',
                        color:
                          customer.profitMargin > 20
                            ? '#10b981'
                            : customer.profitMargin > 15
                              ? '#f59e0b'
                              : '#ef4444',
                      }}
                    >
                      {formatPercent(customer.profitMargin)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      <span
                        style={{
                          borderRadius: '16px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            customer.creditRating === 'AAA'
                              ? 'rgba(16, 185, 129, 0.2)'
                              : customer.creditRating === 'AA'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : customer.creditRating === 'A'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : 'rgba(249, 115, 22, 0.2)',
                          color:
                            customer.creditRating === 'AAA'
                              ? '#10b981'
                              : customer.creditRating === 'AA'
                                ? '#3b82f6'
                                : customer.creditRating === 'A'
                                  ? '#f59e0b'
                                  : '#f97316',
                        }}
                      >
                        {customer.creditRating}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(customer.lifetimeValue)}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCommissions = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Commission Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #10b981',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Total Commissions
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(dashboardData.commissions.totalCommissions)}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #3b82f6',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Average Rate
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatPercent(dashboardData.commissions.averageCommissionRate)}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #8b5cf6',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Total Payout
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(
              dashboardData.commissions.payrollSummary.totalPayout
            )}
          </p>
        </div>
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderLeft: '4px solid #f97316',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.95)',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Total Bonuses
          </p>
          <p
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            {formatCurrency(
              dashboardData.commissions.payrollSummary.totalBonuses
            )}
          </p>
        </div>
      </div>

      {/* Broker Commissions Table */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <Calculator
              style={{ width: '20px', height: '20px', color: '#3b82f6' }}
            />
          </div>
          Commission Breakdown
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}
              >
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'left',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Broker
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Gross Revenue
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Rate
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Commission
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Bonus
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'right',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Total Payout
                </th>
                <th
                  style={{
                    padding: '12px 16px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'rgba(255, 255, 255, 0.95)',
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.commissions.brokers.map(
                (broker: any, index: number) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.05)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {broker.brokerName}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(broker.grossRevenue)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatPercent(broker.commissionRate)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(broker.commissionAmount)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(broker.bonusAmount)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'right',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: 'white',
                      }}
                    >
                      {formatCurrency(broker.totalPayout)}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        textAlign: 'center',
                      }}
                    >
                      <button
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3b82f6',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = '#1d4ed8')
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = '#3b82f6')
                        }
                      >
                        Process
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performers */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h3
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '16px',
            margin: '0 0 16px 0',
          }}
        >
          <div
            style={{
              padding: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              borderRadius: '8px',
              marginRight: '12px',
            }}
          >
            <Target
              style={{ width: '20px', height: '20px', color: '#10b981' }}
            />
          </div>
          Top Performers
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          {dashboardData.commissions.topPerformers.map(
            (performer: any, index: number) => (
              <div
                key={index}
                style={{
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <h4
                    style={{
                      fontWeight: '600',
                      color: 'white',
                      margin: 0,
                    }}
                  >
                    {performer.brokerName}
                  </h4>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#10b981',
                    }}
                  >
                    {formatPercent(performer.performance - 100)} over target
                  </span>
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    margin: 0,
                  }}
                >
                  Bonus: {formatCurrency(performer.bonus)}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className='space-y-6'>
      {/* Expense Categories */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
          <PieChart className='mr-2 h-5 w-5 text-blue-500' />
          Expense Breakdown
        </h3>
        <div className='space-y-4'>
          {dashboardData.expenses.categories.map(
            (category: any, index: number) => (
              <div key={index} className='rounded-lg border p-4'>
                <div className='mb-2 flex items-center justify-between'>
                  <h4 className='font-medium text-gray-900'>
                    {category.category}
                  </h4>
                  <div className='flex items-center space-x-4'>
                    <span className='text-sm font-bold text-gray-900'>
                      {formatCurrency(category.amount)}
                    </span>
                    <span className='text-sm text-gray-600'>
                      {formatPercent(category.percentage)}
                    </span>
                    <div
                      className={`flex items-center text-sm ${
                        category.trend === 'up'
                          ? 'text-red-600'
                          : category.trend === 'down'
                            ? 'text-green-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {category.trend === 'up' ? (
                        <TrendingUp className='mr-1 h-4 w-4' />
                      ) : category.trend === 'down' ? (
                        <TrendingDown className='mr-1 h-4 w-4' />
                      ) : (
                        <div className='mr-1 h-4 w-4' />
                      )}
                      {category.trend}
                    </div>
                  </div>
                </div>
                <div className='mb-3 h-2 w-full rounded-full bg-gray-200'>
                  <div
                    className='h-2 rounded-full bg-blue-500'
                    style={{ width: `${category.percentage}%` }}
                   />
                </div>
                <div className='grid grid-cols-2 gap-2 text-sm md:grid-cols-4'>
                  {category.subcategories.map((sub: any, subIndex: number) => (
                    <div key={subIndex} className='text-gray-600'>
                      <span className='font-medium'>{sub.name}:</span>{' '}
                      {formatCurrency(sub.amount)}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Budget Analysis */}
      <div className='rounded-lg bg-white p-6 shadow'>
        <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
          <Target className='mr-2 h-5 w-5 text-purple-500' />
          Budget Analysis
        </h3>
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-blue-50 p-4'>
            <p className='text-sm font-medium text-blue-600'>Total Budget</p>
            <p className='text-xl font-bold text-blue-900'>
              {formatCurrency(
                dashboardData.expenses.budgetAnalysis.totalBudget
              )}
            </p>
          </div>
          <div className='rounded-lg bg-green-50 p-4'>
            <p className='text-sm font-medium text-green-600'>Total Spent</p>
            <p className='text-xl font-bold text-green-900'>
              {formatCurrency(dashboardData.expenses.budgetAnalysis.totalSpent)}
            </p>
          </div>
          <div className='rounded-lg bg-yellow-50 p-4'>
            <p className='text-sm font-medium text-yellow-600'>Remaining</p>
            <p className='text-xl font-bold text-yellow-900'>
              {formatCurrency(
                dashboardData.expenses.budgetAnalysis.remainingBudget
              )}
            </p>
          </div>
          <div className='rounded-lg bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-600'>
              Projected Overrun
            </p>
            <p className='text-xl font-bold text-red-900'>
              {formatCurrency(
                dashboardData.expenses.budgetAnalysis.projectedOverrun
              )}
            </p>
          </div>
        </div>

        {/* Savings Opportunities */}
        <div className='space-y-3'>
          <h4 className='font-medium text-gray-900'>Savings Opportunities</h4>
          {dashboardData.expenses.budgetAnalysis.savingsOpportunities.map(
            (opportunity: any, index: number) => (
              <div
                key={index}
                className='flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3'
              >
                <div>
                  <p className='text-sm font-medium text-gray-900'>
                    {opportunity.category}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {opportunity.recommendation}
                  </p>
                </div>
                <span className='text-sm font-bold text-green-600'>
                  Save {formatCurrency(opportunity.potentialSavings)}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        minHeight: '600px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '32px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
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
            <h1
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '28px',
                fontWeight: 'bold',
                color: 'white',
                margin: 0,
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '12px',
                  marginRight: '16px',
                }}
              >
                <DollarSign
                  style={{ width: '28px', height: '28px', color: '#10b981' }}
                />
              </div>
              Advanced Financial Dashboard
            </h1>
            <p
              style={{
                marginTop: '8px',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                margin: '8px 0 0 0',
              }}
            >
              💹 Comprehensive financial analytics, cash flow forecasting, and
              automated commission processing
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  margin: 0,
                }}
              >
                Last Updated
              </p>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: 'white',
                  margin: '4px 0 0 0',
                }}
              >
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={loadDashboardData}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(59, 130, 246, 0.8)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(59, 130, 246, 1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)')
              }
            >
              <FileText
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              Refresh Data
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ padding: '0 32px' }}>
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            paddingBottom: '16px',
            paddingTop: '16px',
          }}
        >
          {[
            { id: 'overview', label: '📊 Overview', icon: BarChart3 },
            { id: 'cashflow', label: '💰 Cash Flow', icon: LineChart },
            { id: 'profitloss', label: '📈 P&L Analysis', icon: TrendingUp },
            { id: 'commissions', label: '💵 Commissions', icon: Calculator },
            { id: 'expenses', label: '🧾 Expenses', icon: Receipt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background:
                  activeTab === tab.id
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }
              }}
            >
              <tab.icon
                style={{ marginRight: '8px', width: '16px', height: '16px' }}
              />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'cashflow' && renderCashFlow()}
        {activeTab === 'profitloss' && renderProfitLoss()}
        {activeTab === 'commissions' && renderCommissions()}
        {activeTab === 'expenses' && renderExpenses()}
      </div>
    </div>
  );
};

export default BrokerFinancialDashboard;
