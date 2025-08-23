'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import StickyNote from '../components/StickyNote-Enhanced';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState('last_30_days');
  const chartRef = useRef<HTMLCanvasElement>(null);
  const fuelChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Draw performance chart
    const canvas = chartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a simple line chart
    const data = [65, 75, 80, 85, 82, 88, 92, 89, 95, 90, 87, 91];
    const labels = [
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

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue;

    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
      const y = padding + (i * chartHeight) / 5;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y =
        padding + chartHeight - ((value - minValue) / range) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    ctx.fillStyle = '#667eea';
    data.forEach((value, index) => {
      const x = padding + (index * chartWidth) / (data.length - 1);
      const y =
        padding + chartHeight - ((value - minValue) / range) * chartHeight;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [selectedReport]);

  useEffect(() => {
    // Draw fuel efficiency chart
    const canvas = fuelChartRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const vehicles = [
      'Truck-045',
      'Van-012',
      'Truck-089',
      'Van-023',
      'Truck-156',
    ];
    const efficiency = [8.2, 7.5, 9.1, 6.8, 8.7];

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = chartWidth / vehicles.length - 20;
    const maxValue = Math.max(...efficiency);

    vehicles.forEach((vehicle, index) => {
      const barHeight = (efficiency[index] / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / vehicles.length) + 10;
      const y = padding + chartHeight - barHeight;

      // Draw bar
      ctx.fillStyle = index % 2 === 0 ? '#667eea' : '#764ba2';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Draw value on top
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(efficiency[index].toString(), x + barWidth / 2, y - 5);
    });
  }, [selectedReport]);

  const reportTypes = [
    { id: 'overview', label: 'Fleet Overview', icon: '📊' },
    { id: 'performance', label: 'Performance', icon: '📈' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'fuel', label: 'Fuel Usage', icon: '⛽' },
    { id: 'drivers', label: 'Driver Reports', icon: '👥' },
    { id: 'routes', label: 'Route Analysis', icon: '🗺️' },
  ];

  const kpis = [
    { label: 'Fleet Utilization', value: '87%', change: '+3.2%', trend: 'up' },
    {
      label: 'Average Fuel Efficiency',
      value: '8.2 L/100km',
      change: '-2.1%',
      trend: 'up',
    },
    { label: 'On-Time Delivery', value: '94%', change: '+1.8%', trend: 'up' },
    {
      label: 'Maintenance Costs',
      value: '$23,450',
      change: '-8.5%',
      trend: 'up',
    },
    {
      label: 'Driver Performance',
      value: '4.7/5',
      change: '+0.2',
      trend: 'up',
    },
    { label: 'Vehicle Downtime', value: '3.2%', change: '-1.1%', trend: 'up' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px 20px 20px',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '0 0 24px 0' }}>
        <Link href='/fleetflowdash' style={{ textDecoration: 'none' }}>
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
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
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
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
              📊 Reports & Analytics
            </h1>
            <p
              style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: 0,
              }}
            >
              Comprehensive insights into your fleet performance
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
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
                fontSize: '14px',
              }}
            >
              📄 Export PDF
            </button>
            <button
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
              }}
            >
              📅 Schedule Report
            </button>
          </div>
        </div>

        {/* Report Type Selection */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            <h3
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'white',
                margin: 0,
              }}
            >
              📋 Report Type
            </h3>
            <select
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '12px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1f2937',
                minWidth: '200px',
                cursor: 'pointer',
              }}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value='last_7_days'>Last 7 Days</option>
              <option value='last_30_days'>Last 30 Days</option>
              <option value='last_90_days'>Last 90 Days</option>
              <option value='last_year'>Last Year</option>
              <option value='custom'>Custom Range</option>
            </select>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {reportTypes.map((report) => (
              <button
                key={report.id}
                style={{
                  background:
                    selectedReport === report.id
                      ? 'rgba(255, 255, 255, 0.95)'
                      : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border:
                    selectedReport === report.id
                      ? '2px solid #3b82f6'
                      : '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textAlign: 'left',
                  color: '#1f2937',
                }}
                onClick={() => setSelectedReport(report.id)}
                onMouseOver={(e) => {
                  if (selectedReport !== report.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedReport !== report.id) {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.8)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
                >
                  <span style={{ fontSize: '24px' }}>{report.icon}</span>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '16px' }}>
                      {report.label}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        marginTop: '4px',
                      }}
                    >
                      Detailed analytics and insights
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          {kpis.map((kpi, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 20px rgba(0, 0, 0, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500',
                  }}
                >
                  {kpi.label}
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#10b981',
                    background: '#f0fdf4',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                >
                  {kpi.change}
                </span>
              </div>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                }}
              >
                {kpi.value}
              </div>
            </div>
          ))}
        </div>

        {/* Performance Chart */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            📈 Performance Trends
          </h3>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <canvas
              ref={chartRef}
              width={800}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Fuel Efficiency Chart */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            ⛽ Fuel Efficiency by Vehicle
          </h3>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <canvas
              ref={fuelChartRef}
              width={800}
              height={300}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Fleet Summary Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            marginBottom: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            🚛 Fleet Summary Report
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr
                    style={{
                      borderBottom: '2px solid #e5e7eb',
                    }}
                  >
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Vehicle
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Total Distance
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Fuel Used
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Efficiency
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Uptime
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Maintenance Cost
                    </th>
                    <th
                      style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        fontWeight: '600',
                        color: '#1f2937',
                      }}
                    >
                      Performance Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      vehicle: 'Truck-045',
                      distance: '12,450 km',
                      fuel: '1,021 L',
                      efficiency: '8.2 L/100km',
                      uptime: '97.8%',
                      maintenance: '$2,340',
                      score: 92,
                    },
                    {
                      vehicle: 'Van-012',
                      distance: '8,920 km',
                      fuel: '669 L',
                      efficiency: '7.5 L/100km',
                      uptime: '95.5%',
                      maintenance: '$1,890',
                      score: 89,
                    },
                    {
                      vehicle: 'Truck-089',
                      distance: '15,670 km',
                      fuel: '1,426 L',
                      efficiency: '9.1 L/100km',
                      uptime: '92.3%',
                      maintenance: '$3,120',
                      score: 85,
                    },
                    {
                      vehicle: 'Van-023',
                      distance: '6,780 km',
                      fuel: '461 L',
                      efficiency: '6.8 L/100km',
                      uptime: '99.2%',
                      maintenance: '$980',
                      score: 95,
                    },
                    {
                      vehicle: 'Truck-156',
                      distance: '11,230 km',
                      fuel: '977 L',
                      efficiency: '8.7 L/100km',
                      uptime: '94.1%',
                      maintenance: '$2,560',
                      score: 87,
                    },
                  ].map((row, index) => (
                    <tr
                      key={index}
                      style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <td
                        style={{
                          padding: '16px',
                          fontWeight: '600',
                          color: '#3b82f6',
                        }}
                      >
                        {row.vehicle}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {row.distance}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {row.fuel}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {row.efficiency}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {row.uptime}
                      </td>
                      <td style={{ padding: '16px', color: '#1f2937' }}>
                        {row.maintenance}
                      </td>
                      <td style={{ padding: '16px' }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span style={{ fontWeight: '600', color: '#1f2937' }}>
                            {row.score}
                          </span>
                          <div
                            style={{
                              width: '40px',
                              height: '6px',
                              backgroundColor: '#e5e7eb',
                              borderRadius: '3px',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{
                                width: `${row.score}%`,
                                height: '100%',
                                backgroundColor:
                                  row.score > 90
                                    ? '#10b981'
                                    : row.score > 80
                                      ? '#3b82f6'
                                      : '#f59e0b',
                                borderRadius: '3px',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reports Notes Section */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px',
            }}
          >
            📝 Report Analysis & Notes
          </h3>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <StickyNote
              section='reports'
              entityId='reports-general'
              entityName='Fleet Reports'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
