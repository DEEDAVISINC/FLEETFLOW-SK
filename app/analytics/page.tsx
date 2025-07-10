'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AnalyticsData {
  revenue: number[];
  loads: number[];
  fuelCosts: number[];
  driverPerformance: { name: string; score: number; loads: number; onTime: number }[];
  vehicleUtilization: { vehicle: string; utilization: number; revenue: number }[];
  routeEfficiency: { route: string; profit: number; frequency: number }[];
  invoiceMetrics: {
    totalInvoiced: number;
    totalPaid: number;
    totalOutstanding: number;
    averagePaymentDays: number;
    overdueAmount: number;
    monthlyInvoicing: number[];
    paymentTrends: number[];
  };
  dispatchFeeSummary: {
    totalFees: number;
    averageFeePercentage: number;
    monthlyFees: number[];
    topCarriers: { name: string; totalFees: number; invoiceCount: number }[];
  };
}

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'loads' | 'efficiency' | 'costs'>('revenue');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    revenue: [45000, 52000, 48000, 61000, 58000, 65000, 72000, 68000, 75000, 82000, 78000, 85000],
    loads: [45, 52, 48, 61, 58, 65, 72, 68, 75, 82, 78, 85],
    fuelCosts: [8500, 9200, 8800, 10500, 9800, 11200, 12000, 11500, 12800, 13200, 12900, 13500],
    driverPerformance: [
      { name: 'John Smith', score: 95, loads: 28, onTime: 96 },
      { name: 'Sarah Johnson', score: 92, loads: 25, onTime: 94 },
      { name: 'Mike Wilson', score: 88, loads: 22, onTime: 89 },
      { name: 'Lisa Brown', score: 91, loads: 26, onTime: 92 },
      { name: 'David Garcia', score: 87, loads: 20, onTime: 88 }
    ],
    vehicleUtilization: [
      { vehicle: 'TRK-101', utilization: 85, revenue: 15200 },
      { vehicle: 'TRK-205', utilization: 78, revenue: 12800 },
      { vehicle: 'TRK-150', utilization: 92, revenue: 18500 },
      { vehicle: 'TRK-087', utilization: 71, revenue: 11200 },
      { vehicle: 'TRK-234', utilization: 88, revenue: 16800 }
    ],
    routeEfficiency: [
      { route: 'Atlanta → Miami', profit: 2450, frequency: 12 },
      { route: 'Chicago → Houston', profit: 3200, frequency: 8 },
      { route: 'LA → Phoenix', profit: 1850, frequency: 15 },
      { route: 'Dallas → Denver', profit: 2800, frequency: 10 },
      { route: 'Seattle → Portland', profit: 1650, frequency: 18 }
    ],
    invoiceMetrics: {
      totalInvoiced: 125800,
      totalPaid: 98450,
      totalOutstanding: 27350,
      averagePaymentDays: 18.5,
      overdueAmount: 8200,
      monthlyInvoicing: [8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200, 14800, 16200],
      paymentTrends: [7800, 9200, 8400, 10800, 10200, 11800, 12600, 12200, 13800, 14600, 14200, 15400]
    },
    dispatchFeeSummary: {
      totalFees: 125800,
      averageFeePercentage: 9.8,
      monthlyFees: [8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200, 14800, 16200],
      topCarriers: [
        { name: 'Smith Trucking LLC', totalFees: 12450, invoiceCount: 15 },
        { name: 'Johnson Logistics', totalFees: 9800, invoiceCount: 12 },
        { name: 'Wilson Transport', totalFees: 8350, invoiceCount: 18 },
        { name: 'Brown Freight', totalFees: 7200, invoiceCount: 9 },
        { name: 'Garcia Express', totalFees: 6850, invoiceCount: 11 }
      ]
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Revenue Chart Data
  const revenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Revenue ($)',
        data: analyticsData.revenue,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Fuel Costs ($)',
        data: analyticsData.fuelCosts,
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      }
    ],
  };

  // Loads Chart Data
  const loadsChartData = {
    labels: months,
    datasets: [
      {
        label: 'Completed Loads',
        data: analyticsData.loads,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      }
    ],
  };

  // Vehicle Utilization Chart
  const utilizationChartData = {
    labels: analyticsData.vehicleUtilization.map(v => v.vehicle),
    datasets: [
      {
        data: analyticsData.vehicleUtilization.map(v => v.utilization),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      }
    ],
  };

  // Invoice Analytics Charts
  const invoiceRevenueChartData = {
    labels: months,
    datasets: [
      {
        label: 'Invoiced Amount ($)',
        data: analyticsData.invoiceMetrics.monthlyInvoicing,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Payments Received ($)',
        data: analyticsData.invoiceMetrics.paymentTrends,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const dispatchFeeChartData = {
    labels: months,
    datasets: [
      {
        label: 'Monthly Dispatch Fees ($)',
        data: analyticsData.dispatchFeeSummary.monthlyFees,
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 1,
      }
    ],
  };

  const paymentStatusChartData = {
    labels: ['Paid', 'Outstanding', 'Overdue'],
    datasets: [
      {
        data: [
          analyticsData.invoiceMetrics.totalPaid,
          analyticsData.invoiceMetrics.totalOutstanding - analyticsData.invoiceMetrics.overdueAmount,
          analyticsData.invoiceMetrics.overdueAmount
        ],
        backgroundColor: [
          '#10B981',  // Green for paid
          '#F59E0B',  // Yellow for outstanding
          '#EF4444',  // Red for overdue
        ],
      }
    ],
  };

  const calculateKPIs = () => {
    const totalRevenue = analyticsData.revenue.reduce((sum, val) => sum + val, 0);
    const totalFuelCosts = analyticsData.fuelCosts.reduce((sum, val) => sum + val, 0);
    const totalLoads = analyticsData.loads.reduce((sum, val) => sum + val, 0);
    const avgRevenuePerLoad = totalRevenue / totalLoads;
    const profitMargin = ((totalRevenue - totalFuelCosts) / totalRevenue) * 100;
    
    // Invoice KPIs
    const collectionRate = (analyticsData.invoiceMetrics.totalPaid / analyticsData.invoiceMetrics.totalInvoiced) * 100;
    const overduePercentage = (analyticsData.invoiceMetrics.overdueAmount / analyticsData.invoiceMetrics.totalOutstanding) * 100;

    return {
      totalRevenue,
      totalLoads,
      avgRevenuePerLoad,
      profitMargin,
      avgUtilization: analyticsData.vehicleUtilization.reduce((sum, v) => sum + v.utilization, 0) / analyticsData.vehicleUtilization.length,
      collectionRate,
      overduePercentage,
      totalDispatchFees: analyticsData.dispatchFeeSummary.totalFees,
      avgPaymentDays: analyticsData.invoiceMetrics.averagePaymentDays
    };
  };

  const kpis = calculateKPIs();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <button style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '16px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px'
              }}>
                <span style={{ fontSize: '32px' }}>📊</span>
              </div>
              <div>
                <h1 style={{
                  fontSize: '36px',
                  fontWeight: 'bold',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
                }}>
                  Analytics Dashboard
                </h1>
                <p style={{
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: '0 0 8px 0'
                }}>
                  Fleet performance insights and business intelligence
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  style={{
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    background: selectedPeriod === period 
                      ? 'rgba(255, 255, 255, 0.25)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Total Revenue
            </h3>
            <div style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}>
              ${kpis.totalRevenue.toLocaleString()}
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '8px' }}>
              +12.5% from last period
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Total Loads
            </h3>
            <div style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}>
              {kpis.totalLoads}
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '8px' }}>
              +8.3% from last period
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Avg Revenue/Load
            </h3>
            <div style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}>
              ${Math.round(kpis.avgRevenuePerLoad).toLocaleString()}
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '8px' }}>
              +5.2% from last period
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              Profit Margin
            </h3>
            <div style={{ color: '#34d399', fontSize: '32px', fontWeight: 'bold' }}>
              {kpis.profitMargin.toFixed(1)}%
            </div>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginTop: '8px' }}>
              +2.1% from last period
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Revenue & Fuel Costs Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Revenue vs Fuel Costs
            </h3>
            <div style={{ height: '300px' }}>
              <Line 
                data={revenueChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white' }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Completed Loads Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Monthly Loads Completed
            </h3>
            <div style={{ height: '300px' }}>
              <Bar 
                data={loadsChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white' }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Vehicle Utilization Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Vehicle Utilization
            </h3>
            <div style={{ height: '300px' }}>
              <Doughnut 
                data={utilizationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Invoice Analytics Chart */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Invoice & Payment Trends
            </h3>
            <div style={{ height: '300px' }}>
              <Line 
                data={invoiceRevenueChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: 'white' }
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '24px'
        }}>
          {/* Driver Performance Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Driver Performance
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Driver
                    </th>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Score
                    </th>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Loads
                    </th>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      On-Time %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.driverPerformance.map((driver, index) => (
                    <tr key={index}>
                      <td style={{ color: 'white', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {driver.name}
                      </td>
                      <td style={{ color: '#4ade80', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: '600' }}>
                        {driver.score}
                      </td>
                      <td style={{ color: 'rgba(255, 255, 255, 0.8)', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {driver.loads}
                      </td>
                      <td style={{ color: '#60a5fa', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: '600' }}>
                        {driver.onTime}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Route Efficiency Table */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              Top Routes by Profit
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Route
                    </th>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Profit
                    </th>
                    <th style={{ color: 'rgba(255, 255, 255, 0.9)', padding: '12px 8px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.routeEfficiency.map((route, index) => (
                    <tr key={index}>
                      <td style={{ color: 'white', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {route.route}
                      </td>
                      <td style={{ color: '#4ade80', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', fontWeight: '600' }}>
                        ${route.profit.toLocaleString()}
                      </td>
                      <td style={{ color: 'rgba(255, 255, 255, 0.8)', padding: '12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        {route.frequency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
