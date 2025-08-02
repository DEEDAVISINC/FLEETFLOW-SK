'use client';

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import Link from 'next/link';
import { useState } from 'react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import BLSWorkforceAnalytics from '../components/BLSWorkforceAnalytics';
import BTSIndustryBenchmarking from '../components/BTSIndustryBenchmarking';
import CompetitorIntelligenceWidget from '../components/CompetitorIntelligenceWidget';
import CustomerRetentionWidget from '../components/CustomerRetentionWidget';
import EPASustainabilityAnalytics from '../components/EPASustainabilityAnalytics';

import FinancialDashboard from '../components/FinancialDashboard';
import GovernmentContractIntelligence from '../components/GovernmentContractIntelligence';

import PortAuthorityIntelligence from '../components/PortAuthorityIntelligence';
import SmartTaskPrioritizationWidget from '../components/SmartTaskPrioritizationWidget';
import SpotRateOptimizationWidget from '../components/SpotRateOptimizationWidget';
import VolumeDiscountWidget from '../components/VolumeDiscountWidget';

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
  driverPerformance: {
    name: string;
    score: number;
    loads: number;
    onTime: number;
  }[];
  vehicleUtilization: {
    vehicle: string;
    utilization: number;
    revenue: number;
  }[];
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
  const [selectedPeriod, setSelectedPeriod] = useState<
    'week' | 'month' | 'quarter' | 'year'
  >('month');
  const [selectedMetric, setSelectedMetric] = useState<
    'revenue' | 'loads' | 'efficiency' | 'costs'
  >('revenue');

  // Mock analytics data
  const analyticsData: AnalyticsData = {
    revenue: [
      45000, 52000, 48000, 61000, 58000, 65000, 72000, 68000, 75000, 82000,
      78000, 85000,
    ],
    loads: [45, 52, 48, 61, 58, 65, 72, 68, 75, 82, 78, 85],
    fuelCosts: [
      8500, 9200, 8800, 10500, 9800, 11200, 12000, 11500, 12800, 13200, 12900,
      13500,
    ],
    driverPerformance: [
      { name: 'John Smith', score: 95, loads: 28, onTime: 96 },
      { name: 'Sarah Johnson', score: 92, loads: 25, onTime: 94 },
      { name: 'Mike Wilson', score: 88, loads: 22, onTime: 89 },
      { name: 'Lisa Brown', score: 91, loads: 26, onTime: 92 },
      { name: 'David Garcia', score: 87, loads: 20, onTime: 88 },
    ],
    vehicleUtilization: [
      { vehicle: 'TRK-101', utilization: 85, revenue: 15200 },
      { vehicle: 'TRK-205', utilization: 78, revenue: 12800 },
      { vehicle: 'TRK-150', utilization: 92, revenue: 18500 },
      { vehicle: 'TRK-087', utilization: 71, revenue: 11200 },
      { vehicle: 'TRK-234', utilization: 88, revenue: 16800 },
    ],
    routeEfficiency: [
      { route: 'Atlanta → Miami', profit: 2450, frequency: 12 },
      { route: 'Chicago → Houston', profit: 3200, frequency: 8 },
      { route: 'LA → Phoenix', profit: 1850, frequency: 15 },
      { route: 'Dallas → Denver', profit: 2800, frequency: 10 },
      { route: 'Seattle → Portland', profit: 1650, frequency: 18 },
    ],
    invoiceMetrics: {
      totalInvoiced: 125800,
      totalPaid: 98450,
      totalOutstanding: 27350,
      averagePaymentDays: 18.5,
      overdueAmount: 8200,
      monthlyInvoicing: [
        8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200,
        14800, 16200,
      ],
      paymentTrends: [
        7800, 9200, 8400, 10800, 10200, 11800, 12600, 12200, 13800, 14600,
        14200, 15400,
      ],
    },
    dispatchFeeSummary: {
      totalFees: 125800,
      averageFeePercentage: 9.8,
      monthlyFees: [
        8200, 9500, 8800, 11200, 10800, 12500, 13200, 12800, 14500, 15200,
        14800, 16200,
      ],
      topCarriers: [
        { name: 'Smith Trucking LLC', totalFees: 12450, invoiceCount: 15 },
        { name: 'Johnson Logistics', totalFees: 9800, invoiceCount: 12 },
        { name: 'Wilson Transport', totalFees: 8350, invoiceCount: 18 },
        { name: 'Brown Freight', totalFees: 7200, invoiceCount: 9 },
        { name: 'Garcia Express', totalFees: 6850, invoiceCount: 11 },
      ],
    },
  };

  // Advanced Analytics Data
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week'>(
    'today'
  );

  // Revenue Trending Data
  const revenueData: {
    today: { hour: string; revenue: number; loads: number }[];
    week: { day: string; revenue: number; loads: number }[];
  } = {
    today: [
      { hour: '6AM', revenue: 12000, loads: 8 },
      { hour: '8AM', revenue: 28000, loads: 15 },
      { hour: '10AM', revenue: 45000, loads: 24 },
      { hour: '12PM', revenue: 67000, loads: 32 },
      { hour: '2PM', revenue: 89000, loads: 41 },
      { hour: '4PM', revenue: 112000, loads: 48 },
      { hour: '6PM', revenue: 128000, loads: 52 },
      { hour: '8PM', revenue: 135000, loads: 54 },
    ],
    week: [
      { day: 'Mon', revenue: 145000, loads: 58 },
      { day: 'Tue', revenue: 167000, loads: 62 },
      { day: 'Wed', revenue: 189000, loads: 71 },
      { day: 'Thu', revenue: 156000, loads: 59 },
      { day: 'Fri', revenue: 198000, loads: 76 },
      { day: 'Sat', revenue: 123000, loads: 45 },
      { day: 'Sun', revenue: 87000, loads: 32 },
    ],
  };

  // Performance Heatmap Data
  const performanceRegions = [
    {
      region: 'West Coast',
      performance: 92,
      color: '#10b981',
      loads: 156,
      avgDelay: 2.3,
    },
    {
      region: 'Southwest',
      performance: 88,
      color: '#22c55e',
      loads: 134,
      avgDelay: 3.1,
    },
    {
      region: 'Midwest',
      performance: 85,
      color: '#f59e0b',
      loads: 198,
      avgDelay: 4.2,
    },
    {
      region: 'Southeast',
      performance: 79,
      color: '#f97316',
      loads: 167,
      avgDelay: 5.8,
    },
    {
      region: 'Northeast',
      performance: 94,
      color: '#059669',
      loads: 143,
      avgDelay: 1.9,
    },
    {
      region: 'Mountain',
      performance: 87,
      color: '#84cc16',
      loads: 98,
      avgDelay: 3.7,
    },
  ];

  // Predictive Analytics Data
  const predictiveData = {
    delayPredictions: [
      { route: 'LA → Phoenix', risk: 'Low', probability: 15, eta: '2h 30m' },
      { route: 'NYC → Boston', risk: 'High', probability: 78, eta: '4h 15m' },
      {
        route: 'Chicago → Detroit',
        risk: 'Medium',
        probability: 45,
        eta: '5h 45m',
      },
      { route: 'Miami → Atlanta', risk: 'Low', probability: 22, eta: '8h 30m' },
    ],
    maintenanceAlerts: [
      {
        vehicle: 'Truck #T-456',
        maintenance: 'Oil Change',
        dueIn: '3 days',
        priority: 'Medium',
      },
      {
        vehicle: 'Truck #T-789',
        maintenance: 'Brake Inspection',
        dueIn: '1 day',
        priority: 'High',
      },
      {
        vehicle: 'Truck #T-123',
        maintenance: 'Tire Rotation',
        dueIn: '7 days',
        priority: 'Low',
      },
    ],
    demandForecast: [
      { route: 'West Coast', demand: 'High', trend: 'up', change: '+12%' },
      { route: 'Southeast', demand: 'Medium', trend: 'stable', change: '+2%' },
      { route: 'Northeast', demand: 'High', trend: 'up', change: '+8%' },
      { route: 'Midwest', demand: 'Low', trend: 'down', change: '-5%' },
    ],
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return '#ef4444';
      case 'Medium':
        return '#f59e0b';
      case 'Low':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      case 'stable':
        return '➡️';
      default:
        return '📊';
    }
  };

  const formatRevenue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

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
      },
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
      },
    ],
  };

  // Vehicle Utilization Chart
  const utilizationChartData = {
    labels: analyticsData.vehicleUtilization.map((v) => v.vehicle),
    datasets: [
      {
        data: analyticsData.vehicleUtilization.map((v) => v.utilization),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
        ],
      },
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
      },
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
      },
    ],
  };

  const paymentStatusChartData = {
    labels: ['Paid', 'Outstanding', 'Overdue'],
    datasets: [
      {
        data: [
          analyticsData.invoiceMetrics.totalPaid,
          analyticsData.invoiceMetrics.totalOutstanding -
            analyticsData.invoiceMetrics.overdueAmount,
          analyticsData.invoiceMetrics.overdueAmount,
        ],
        backgroundColor: [
          '#10B981', // Green for paid
          '#F59E0B', // Yellow for outstanding
          '#EF4444', // Red for overdue
        ],
      },
    ],
  };

  const calculateKPIs = () => {
    const totalRevenue = analyticsData.revenue.reduce(
      (sum, val) => sum + val,
      0
    );
    const totalFuelCosts = analyticsData.fuelCosts.reduce(
      (sum, val) => sum + val,
      0
    );
    const totalLoads = analyticsData.loads.reduce((sum, val) => sum + val, 0);
    const avgRevenuePerLoad = totalRevenue / totalLoads;
    const profitMargin = ((totalRevenue - totalFuelCosts) / totalRevenue) * 100;

    // Invoice KPIs
    const collectionRate =
      (analyticsData.invoiceMetrics.totalPaid /
        analyticsData.invoiceMetrics.totalInvoiced) *
      100;
    const overduePercentage =
      (analyticsData.invoiceMetrics.overdueAmount /
        analyticsData.invoiceMetrics.totalOutstanding) *
      100;

    return {
      totalRevenue,
      totalLoads,
      avgRevenuePerLoad,
      profitMargin,
      avgUtilization:
        analyticsData.vehicleUtilization.reduce(
          (sum, v) => sum + v.utilization,
          0
        ) / analyticsData.vehicleUtilization.length,
      collectionRate,
      overduePercentage,
      totalDispatchFees: analyticsData.dispatchFeeSummary.totalFees,
      avgPaymentDays: analyticsData.invoiceMetrics.averagePaymentDays,
    };
  };

  const kpis = calculateKPIs();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        paddingTop: '80px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '24px' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
              border: 'none',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '16px',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>📊</span>
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Analytics Dashboard
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 8px 0',
                  }}
                >
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
                    background:
                      selectedPeriod === period
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Total Revenue
            </h3>
            <div
              style={{ color: '#4ade80', fontSize: '32px', fontWeight: 'bold' }}
            >
              ${kpis.totalRevenue.toLocaleString()}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              +12.5% from last period
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Total Loads
            </h3>
            <div
              style={{ color: '#60a5fa', fontSize: '32px', fontWeight: 'bold' }}
            >
              {kpis.totalLoads}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              +8.3% from last period
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Avg Revenue/Load
            </h3>
            <div
              style={{ color: '#a78bfa', fontSize: '32px', fontWeight: 'bold' }}
            >
              ${Math.round(kpis.avgRevenuePerLoad).toLocaleString()}
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              +5.2% from last period
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Profit Margin
            </h3>
            <div
              style={{ color: '#34d399', fontSize: '32px', fontWeight: 'bold' }}
            >
              {kpis.profitMargin.toFixed(1)}%
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '14px',
                marginTop: '8px',
              }}
            >
              +2.1% from last period
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Revenue & Fuel Costs Chart */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
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
                      labels: { color: 'white' },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Completed Loads Chart */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
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
                      labels: { color: 'white' },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Vehicle Utilization Chart */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
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
                      labels: { color: 'white' },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Invoice Analytics Chart */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
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
                      labels: { color: 'white' },
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Performance Tables */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Driver Performance Table */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              Driver Performance
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Driver
                    </th>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Score
                    </th>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Loads
                    </th>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      On-Time %
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.driverPerformance.map((driver, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          color: 'white',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {driver.name}
                      </td>
                      <td
                        style={{
                          color: '#4ade80',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          fontWeight: '600',
                        }}
                      >
                        {driver.score}
                      </td>
                      <td
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {driver.loads}
                      </td>
                      <td
                        style={{
                          color: '#60a5fa',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          fontWeight: '600',
                        }}
                      >
                        {driver.onTime}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Route Efficiency Table */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '20px',
                fontWeight: '600',
                marginBottom: '20px',
              }}
            >
              Top Routes by Profit
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Route
                    </th>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Profit
                    </th>
                    <th
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        padding: '12px 8px',
                        textAlign: 'left',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      Frequency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.routeEfficiency.map((route, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          color: 'white',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {route.route}
                      </td>
                      <td
                        style={{
                          color: '#4ade80',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                          fontWeight: '600',
                        }}
                      >
                        ${route.profit.toLocaleString()}
                      </td>
                      <td
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          padding: '12px 8px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        }}
                      >
                        {route.frequency}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Advanced Analytics Widgets */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            marginBottom: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '25px',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                color: '#ffffff',
                fontWeight: '700',
                margin: 0,
              }}
            >
              🚀 Advanced Analytics & Predictive Insights
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedTimeRange('today')}
                style={{
                  background:
                    selectedTimeRange === 'today'
                      ? '#3b82f6'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Today
              </button>
              <button
                onClick={() => setSelectedTimeRange('week')}
                style={{
                  background:
                    selectedTimeRange === 'week'
                      ? '#3b82f6'
                      : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                Week
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
              gap: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Revenue Trending Chart */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📈 Revenue Trending
                <span
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  (
                  {selectedTimeRange === 'today'
                    ? 'Hour by Hour'
                    : 'Day by Day'}
                  )
                </span>
              </h3>

              <div style={{ height: '200px', position: 'relative' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'space-between',
                    height: '100%',
                    gap: '4px',
                  }}
                >
                  {revenueData[selectedTimeRange].map((item, index) => {
                    const maxRevenue = Math.max(
                      ...revenueData[selectedTimeRange].map((d) => d.revenue)
                    );
                    const height = (item.revenue / maxRevenue) * 160;
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          flex: 1,
                          gap: '8px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '10px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '500',
                          }}
                        >
                          {formatRevenue(item.revenue)}
                        </div>
                        <div
                          style={{
                            background: `linear-gradient(to top, #3b82f6, #60a5fa)`,
                            width: '100%',
                            height: `${height}px`,
                            borderRadius: '4px 4px 0 0',
                            position: 'relative',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scaleY(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scaleY(1)';
                          }}
                        />
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: '500',
                          }}
                        >
                          {selectedTimeRange === 'today'
                            ? (item as any).hour
                            : (item as any).day}
                        </div>
                        <div
                          style={{
                            fontSize: '9px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {item.loads} loads
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Performance Heatmap */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 20px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🗺️ Regional Performance
                <span
                  style={{
                    fontSize: '12px',
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  (Live Performance Score)
                </span>
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {performanceRegions.map((region, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      border: `1px solid ${region.color}30`,
                      borderLeft: `4px solid ${region.color}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: region.color,
                          borderRadius: '50%',
                        }}
                      />
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {region.region}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          {region.loads} loads • {region.avgDelay}h avg delay
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: region.color,
                          fontSize: '18px',
                          fontWeight: 'bold',
                        }}
                      >
                        {region.performance}%
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '11px',
                        }}
                      >
                        Performance
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Predictive Analytics Dashboard */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Delay Predictions */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🤖 AI Delay Predictions
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {predictiveData.delayPredictions.map((prediction, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      border: `1px solid ${getRiskColor(prediction.risk)}30`,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {prediction.route}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '11px',
                        }}
                      >
                        ETA: {prediction.eta}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: getRiskColor(prediction.risk),
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {prediction.risk} Risk
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '10px',
                        }}
                      >
                        {prediction.probability}% chance
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Maintenance Alerts */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🔧 Predictive Maintenance
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {predictiveData.maintenanceAlerts.map((alert, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      border: `1px solid ${getRiskColor(alert.priority)}30`,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {alert.vehicle}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontSize: '11px',
                        }}
                      >
                        {alert.maintenance}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color: getRiskColor(alert.priority),
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {alert.priority}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '10px',
                        }}
                      >
                        Due in {alert.dueIn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Demand Forecast */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📊 Demand Forecast
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {predictiveData.demandForecast.map((forecast, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <div style={{ fontSize: '16px' }}>
                        {getTrendIcon(forecast.trend)}
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          {forecast.route}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '11px',
                          }}
                        >
                          {forecast.demand} Demand
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          color:
                            forecast.trend === 'up'
                              ? '#22c55e'
                              : forecast.trend === 'down'
                                ? '#ef4444'
                                : '#f59e0b',
                          fontSize: '12px',
                          fontWeight: 'bold',
                        }}
                      >
                        {forecast.change}
                      </div>
                      <div
                        style={{
                          color: 'rgba(255, 255, 255, 0.6)',
                          fontSize: '10px',
                        }}
                      >
                        vs last week
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Markets Intelligence Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>💹</span>
              </div>
              <div>
                <h2
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  Financial Markets Intelligence
                </h2>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0',
                  }}
                >
                  Real-time market data and government intelligence • $8-14M
                  Value Add
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href='https://fred.stlouisfed.org/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                📊 FRED
              </a>
              <a
                href='https://www.usaspending.gov/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                ��️ USAspending
              </a>
              <a
                href='https://www.bts.gov/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                📊 BTS
              </a>
              <a
                href='https://www.bls.gov/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                👥 BLS
              </a>
              <a
                href='https://www.epa.gov/smartway'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                🌿 EPA
              </a>
              <a
                href='https://www.marad.dot.gov/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                🚢 MARAD
              </a>
              <a
                href='https://www.portoflosangeles.org/'
                target='_blank'
                rel='noopener noreferrer'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                ⚓ Port Authority
              </a>
            </div>
          </div>

          {/* Financial Markets Components */}
          <div style={{ marginBottom: '32px' }}>
            <FinancialDashboard />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <GovernmentContractIntelligence />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <BTSIndustryBenchmarking />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <BLSWorkforceAnalytics />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <EPASustainabilityAnalytics />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <PortAuthorityIntelligence />
          </div>

          {/* Competitor Intelligence Widget */}
          <div style={{ marginBottom: '32px' }}>
            <CompetitorIntelligenceWidget />
          </div>

          {/* Customer Retention Widget */}
          <div style={{ marginBottom: '32px' }}>
            <CustomerRetentionWidget />
          </div>

          {/* Spot Rate Optimization Widget */}
          <div style={{ marginBottom: '32px' }}>
            <SpotRateOptimizationWidget />
          </div>

          {/* Smart Task Prioritization Widget */}
          <div style={{ marginBottom: '32px' }}>
            <SmartTaskPrioritizationWidget />
          </div>

          {/* Volume Discount Widget */}
          <div style={{ marginBottom: '32px' }}>
            <VolumeDiscountWidget />
          </div>
        </div>
      </div>
    </div>
  );
}
