'use client';

import { useEffect, useState } from 'react';
import { Load, getLoadsForUser } from '../../services/loadService';

// ============= PHASE 1: ENHANCED KPI CARD COMPONENT =============
interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
  subtitle?: string;
}

const EnhancedKPICard = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  subtitle,
}: KPICardProps) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '24px',
      border: `2px solid ${color}20`,
      position: 'relative',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
    }}
  >
    {/* Animated gradient background */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        zIndex: 0,
      }}
    />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <div>
          <span
            style={{
              color: '#6b7280',
              fontSize: '14px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {title}
          </span>
          {subtitle && (
            <div
              style={{ color: '#9ca3af', fontSize: '12px', marginTop: '2px' }}
            >
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: '32px',
            background: `linear-gradient(135deg, ${color}, ${color}80)`,
            borderRadius: '12px',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px ${color}30`,
          }}
        >
          {icon}
        </div>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <span
          style={{
            color: '#111827',
            fontSize: '36px',
            fontWeight: '800',
            lineHeight: '1',
          }}
        >
          {value}
        </span>
      </div>

      {change && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background:
                trend === 'up'
                  ? '#10b98120'
                  : trend === 'down'
                    ? '#ef444420'
                    : '#6b728020',
              color:
                trend === 'up'
                  ? '#059669'
                  : trend === 'down'
                    ? '#dc2626'
                    : '#6b7280',
              padding: '4px 8px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            <span style={{ fontSize: '16px' }}>
              {trend === 'up' ? '↗️' : trend === 'down' ? '↘️' : '➡️'}
            </span>
            {change}
          </div>
          <span style={{ color: '#9ca3af', fontSize: '12px' }}>
            vs last period
          </span>
        </div>
      )}
    </div>
  </div>
);

// ============= PHASE 2: INTERACTIVE CHARTS & ANALYTICS =============
interface ChartProps {
  data: any[];
  title: string;
  height?: number;
  type?: 'line' | 'bar' | 'pie' | 'area';
}

const AdvancedLineChart = ({ data, title, height = 180 }: ChartProps) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value || d.revenue || 0));
  const minValue = Math.min(...data.map((d) => d.value || d.revenue || 0));
  const range = maxValue - minValue;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 90 + 5; // 5% padding on each side
    const normalizedValue =
      range === 0 ? 50 : ((item.value || item.revenue || 0) - minValue) / range;
    const y = 85 - normalizedValue * 70; // Leave margins
    return {
      x,
      y,
      value: item.value || item.revenue || 0,
      label: item.date || item.label,
    };
  });

  const pathData = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;
  const areaData = `M 5,85 L ${points.map((p) => `${p.x},${p.y}`).join(' L ')} L 95,85 Z`;

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            color: '#111827',
            fontSize: '18px',
            fontWeight: '700',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['7D', '30D', '90D'].map((period, index) => (
            <button
              key={period}
              style={{
                background: index === 1 ? '#3b82f6' : '#f3f4f6',
                color: index === 1 ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (index !== 1) {
                  e.currentTarget.style.background = '#e5e7eb';
                }
              }}
              onMouseLeave={(e) => {
                if (index !== 1) {
                  e.currentTarget.style.background = '#f3f4f6';
                }
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <svg width='100%' height={height} style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient
              id={`areaGradient-${title}`}
              x1='0%'
              y1='0%'
              x2='0%'
              y2='100%'
            >
              <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.4' />
              <stop offset='50%' stopColor='#3b82f6' stopOpacity='0.2' />
              <stop offset='100%' stopColor='#3b82f6' stopOpacity='0' />
            </linearGradient>

            <filter id={`shadow-${title}`}>
              <feDropShadow
                dx='0'
                dy='2'
                stdDeviation='4'
                floodColor='#3b82f6'
                floodOpacity='0.3'
              />
            </filter>

            <filter id={`glow-${title}`}>
              <feGaussianBlur result='coloredBlur' stdDeviation='3' />
              <feMerge>
                <feMergeNode in='coloredBlur' />
                <feMergeNode in='SourceGraphic' />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1='5%'
              y1={`${y}%`}
              x2='95%'
              y2={`${y}%`}
              stroke='#f3f4f6'
              strokeWidth='1'
              strokeDasharray='2,2'
            />
          ))}

          {/* Y-axis labels */}
          {[20, 40, 60, 80].map((y, index) => {
            const value = Math.round(maxValue - (index + 1) * (range / 4));
            return (
              <text
                key={y}
                x='2%'
                y={`${y}%`}
                textAnchor='end'
                dominantBaseline='middle'
                style={{ fontSize: '10px', fill: '#9ca3af', fontWeight: '500' }}
              >
                {value > 1000 ? `${(value / 1000).toFixed(0)}K` : value}
              </text>
            );
          })}

          {/* Area fill */}
          <path d={areaData} fill={`url(#areaGradient-${title})`} />

          {/* Main line */}
          <path
            d={pathData}
            fill='none'
            stroke='#3b82f6'
            strokeWidth='3'
            strokeLinecap='round'
            strokeLinejoin='round'
            filter={`url(#shadow-${title})`}
          />

          {/* Data points with enhanced hover */}
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r={hoveredPoint === index ? '8' : '6'}
                fill='white'
                stroke='#3b82f6'
                strokeWidth='3'
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  filter:
                    hoveredPoint === index ? `url(#glow-${title})` : 'none',
                }}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r='3'
                fill='#3b82f6'
                style={{ pointerEvents: 'none' }}
              />

              {/* Tooltip */}
              {hoveredPoint === index && (
                <g>
                  <rect
                    x={`${point.x - 8}%`}
                    y={`${point.y - 15}%`}
                    width='60'
                    height='24'
                    fill='rgba(0, 0, 0, 0.9)'
                    rx='4'
                    style={{ backdropFilter: 'blur(10px)' }}
                  />
                  <text
                    x={`${point.x}%`}
                    y={`${point.y - 5}%`}
                    textAnchor='middle'
                    fill='white'
                    style={{ fontSize: '11px', fontWeight: '600' }}
                  >
                    ${point.value.toLocaleString()}
                  </text>
                </g>
              )}
            </g>
          ))}
        </svg>

        {/* X-axis labels */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingLeft: '5%',
            paddingRight: '5%',
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: '500',
          }}
        >
          {points.map((point, index) => (
            <span key={index} style={{ textAlign: 'center' }}>
              {point.label
                ? new Date(point.label).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                : `P${index + 1}`}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const InteractiveBarChart = ({ data, title, height = 180 }: ChartProps) => {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((d) => d.value || 0));
  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#84cc16',
  ];

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3
        style={{
          color: '#111827',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '20px',
        }}
      >
        {title}
      </h3>

      <div style={{ position: 'relative' }}>
        <svg width='100%' height={height}>
          <defs>
            {colors.map((color, index) => (
              <linearGradient
                key={index}
                id={`barGradient-${index}`}
                x1='0%'
                y1='0%'
                x2='0%'
                y2='100%'
              >
                <stop offset='0%' stopColor={color} stopOpacity='1' />
                <stop offset='100%' stopColor={color} stopOpacity='0.7' />
              </linearGradient>
            ))}
          </defs>

          <g transform={`translate(40, 20)`}>
            {/* Y-axis grid lines */}
            {[0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = (height - 60) * (1 - ratio);
              return (
                <g key={ratio}>
                  <line
                    x1='0'
                    y1={y}
                    x2='100%'
                    y2={y}
                    stroke='#f3f4f6'
                    strokeWidth='1'
                    strokeDasharray='2,2'
                  />
                  <text
                    x='-10'
                    y={y}
                    textAnchor='end'
                    dominantBaseline='middle'
                    style={{ fontSize: '10px', fill: '#9ca3af' }}
                  >
                    {Math.round(maxValue * ratio)}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {data.map((item, index) => {
              const barWidth = (100 / data.length) * 0.6; // 60% of available space
              const barSpacing = (100 / data.length) * 0.4; // 40% for spacing
              const x = index * (100 / data.length) + barSpacing / 2;
              const barHeight = ((item.value || 0) / maxValue) * (height - 60);
              const y = height - 60 - barHeight;

              return (
                <g key={index}>
                  <rect
                    x={`${x}%`}
                    y={y}
                    width={`${barWidth}%`}
                    height={barHeight}
                    fill={`url(#barGradient-${index % colors.length})`}
                    rx='4'
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform:
                        hoveredBar === index ? 'scaleY(1.05)' : 'scaleY(1)',
                      transformOrigin: 'bottom',
                      filter:
                        hoveredBar === index
                          ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                          : 'none',
                    }}
                    onMouseEnter={() => setHoveredBar(index)}
                    onMouseLeave={() => setHoveredBar(null)}
                  />

                  {/* Value label on hover */}
                  {hoveredBar === index && (
                    <g>
                      <rect
                        x={`${x + barWidth / 4}%`}
                        y={y - 25}
                        width='40'
                        height='20'
                        fill='rgba(0, 0, 0, 0.9)'
                        rx='4'
                      />
                      <text
                        x={`${x + barWidth / 2}%`}
                        y={y - 10}
                        textAnchor='middle'
                        fill='white'
                        style={{ fontSize: '11px', fontWeight: '600' }}
                      >
                        {item.value}
                      </text>
                    </g>
                  )}

                  {/* X-axis labels */}
                  <text
                    x={`${x + barWidth / 2}%`}
                    y={height - 30}
                    textAnchor='middle'
                    style={{
                      fontSize: '10px',
                      fill: '#6b7280',
                      fontWeight: '500',
                    }}
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

const EnhancedPieChart = ({ data, title, height = 180 }: ChartProps) => {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  let currentAngle = 0;
  const radius = 80;
  const centerX = 150;
  const centerY = 150;

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#06b6d4',
    '#f97316',
    '#84cc16',
  ];

  const slices = data.map((item, index) => {
    const percentage = (item.value || 0) / total;
    const angle = percentage * 360;
    const startAngle = (currentAngle - 90) * (Math.PI / 180);
    const endAngle = (currentAngle + angle - 90) * (Math.PI / 180);

    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);

    const largeArc = angle > 180 ? 1 : 0;
    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');

    currentAngle += angle;

    return {
      pathData,
      color: colors[index % colors.length],
      percentage,
      value: item.value,
      label: item.label,
      angle,
      midAngle: (startAngle + endAngle) / 2,
    };
  });

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h3
        style={{
          color: '#111827',
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '20px',
        }}
      >
        {title}
      </h3>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <div style={{ position: 'relative' }}>
          <svg width='300' height='300'>
            <defs>
              {colors.map((color, index) => (
                <filter key={index} id={`shadow-pie-${index}`}>
                  <feDropShadow
                    dx='0'
                    dy='2'
                    stdDeviation='3'
                    floodColor={color}
                    floodOpacity='0.3'
                  />
                </filter>
              ))}
            </defs>

            {slices.map((slice, index) => (
              <g key={index}>
                <path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke='white'
                  strokeWidth='2'
                  filter={`url(#shadow-pie-${index})`}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    transform:
                      hoveredSlice === index ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: `${centerX}px ${centerY}px`,
                  }}
                  onMouseEnter={() => setHoveredSlice(index)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />

                {/* Percentage labels */}
                {slice.percentage > 0.05 && (
                  <text
                    x={centerX + radius * 0.7 * Math.cos(slice.midAngle)}
                    y={centerY + radius * 0.7 * Math.sin(slice.midAngle)}
                    textAnchor='middle'
                    dominantBaseline='middle'
                    fill='white'
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
                    }}
                  >
                    {(slice.percentage * 100).toFixed(0)}%
                  </text>
                )}
              </g>
            ))}

            {/* Center circle for donut effect */}
            <circle
              cx={centerX}
              cy={centerY}
              r='35'
              fill='white'
              stroke='#f3f4f6'
              strokeWidth='2'
            />
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor='middle'
              style={{ fontSize: '14px', fontWeight: '700', fill: '#111827' }}
            >
              Total
            </text>
            <text
              x={centerX}
              y={centerY + 12}
              textAnchor='middle'
              style={{ fontSize: '12px', fill: '#6b7280', fontWeight: '600' }}
            >
              {total.toLocaleString()}
            </text>
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          {slices.map((slice, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: hoveredSlice === index ? '#f9fafb' : 'transparent',
                transform:
                  hoveredSlice === index ? 'translateX(4px)' : 'translateX(0)',
              }}
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  background: slice.color,
                  boxShadow: `0 2px 4px ${slice.color}40`,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#111827',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {slice.label}
                  </span>
                  <span
                    style={{
                      color: '#6b7280',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    {(slice.percentage * 100).toFixed(1)}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2px',
                  }}
                >
                  <span style={{ color: '#9ca3af', fontSize: '13px' }}>
                    {slice.value} units
                  </span>
                  <span
                    style={{
                      color: '#111827',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    ${slice.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Advanced Date Range Picker Component
const AdvancedDateRangePicker = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  const presets = [
    { label: 'Last 7 days', value: '7d', icon: '📅' },
    { label: 'Last 30 days', value: '30d', icon: '📆' },
    { label: 'Last 90 days', value: '90d', icon: '🗓️' },
    { label: 'Last 6 months', value: '6m', icon: '📋' },
    { label: 'Last year', value: '1y', icon: '📊' },
    { label: 'Custom range', value: 'custom', icon: '🎯' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        📅 {presets.find((p) => p.value === value)?.label || 'Select Range'}
        <span style={{ fontSize: '12px' }}>{isOpen ? '▴' : '▾'}</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            overflow: 'hidden',
          }}
        >
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                onChange(preset.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background:
                  value === preset.value
                    ? 'rgba(59, 130, 246, 0.1)'
                    : 'transparent',
                color: value === preset.value ? '#3b82f6' : '#374151',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (value !== preset.value) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== preset.value) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '16px' }}>{preset.icon}</span>
              {preset.label}
              {value === preset.value && (
                <span
                  style={{
                    marginLeft: 'auto',
                    color: '#3b82f6',
                    fontSize: '16px',
                  }}
                >
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface CompletedLoadAnalytics {
  totalCompleted: number;
  totalRevenue: number;
  avgDeliveryTime: number;
  onTimeDeliveryRate: number;
  avgRatePerMile: number;
  topPerformingDrivers: Array<{
    name: string;
    completedLoads: number;
    totalRevenue: number;
    onTimeRate: number;
  }>;
  completionTrends: Array<{
    date: string;
    completed: number;
    revenue: number;
  }>;
  customerAnalytics: Array<{
    brokerName: string;
    loadsCompleted: number;
    totalRevenue: number;
    avgRate: number;
  }>;
  workflowCompliance: {
    photoComplianceRate: number;
    signatureComplianceRate: number;
    avgWorkflowTime: number;
  };
}

export default function BusinessIntelligencePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');
  const [completedLoads, setCompletedLoads] = useState<Load[]>([]);
  const [filteredLoads, setFilteredLoads] = useState<Load[]>([]);
  const [analytics, setAnalytics] = useState<CompletedLoadAnalytics | null>(
    null
  );

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minRevenue, setMinRevenue] = useState('');
  const [maxRevenue, setMaxRevenue] = useState('');

  // ============= PHASE 3: REAL-TIME STATE MANAGEMENT =============
  const [isLiveConnected, setIsLiveConnected] = useState(true);
  const [lastDataUpdate, setLastDataUpdate] = useState(new Date());
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [liveAlerts, setLiveAlerts] = useState([
    {
      id: 1,
      title: 'High Revenue Load Completed',
      message:
        'Load JS-25001-ATLMIA-WMT completed with $8,420 revenue (+15% above target)',
      priority: 'high',
      time: '2 min ago',
      details:
        'Driver: Sarah Johnson, Route: Atlanta → Miami, On-time delivery achieved',
    },
    {
      id: 2,
      title: 'Photo Compliance Alert',
      message: 'Driver missed required pickup photos on Load JS-25002',
      priority: 'medium',
      time: '5 min ago',
      details:
        'Load ID: JS-25002-CHIMIL-TGT, Driver: Mike Chen, Action required',
    },
    {
      id: 3,
      title: 'Route Optimization Success',
      message:
        'AI reduced delivery time by 0.8 days on Chicago-Milwaukee route',
      priority: 'low',
      time: '12 min ago',
      details: 'Saved fuel costs: $142, Improved customer satisfaction score',
    },
  ]);
  const [customWidgets, setCustomWidgets] = useState([
    {
      id: 'w1',
      title: 'Active Loads',
      type: 'metric',
      value: '47',
      subtitle: 'Currently in transit',
      icon: '🚛',
    },
    {
      id: 'w2',
      title: 'Revenue Trend',
      type: 'chart',
      chartType: 'Line',
      icon: '📈',
    },
    {
      id: 'w3',
      title: 'Recent Activity',
      type: 'list',
      items: ['Load completed: $3,200', 'Driver checked in', 'Photo uploaded'],
      icon: '📋',
    },
  ]);

  // Download functionality
  const downloadCSV = () => {
    const headers = [
      'Load ID',
      'Status',
      'Origin',
      'Destination',
      'Revenue',
      'Distance',
      'Weight',
      'Equipment',
      'Pickup Date',
      'Delivery Date',
      'Broker',
      'Shipper',
      'Assigned To',
    ];

    const csvData = filteredLoads.map((load) => [
      load.id,
      load.status,
      load.origin,
      load.destination,
      `$${load.rate.toLocaleString()}`,
      load.distance,
      load.weight,
      load.equipment,
      load.pickupDate,
      load.deliveryDate,
      load.brokerName,
      load.shipperInfo?.companyName || 'N/A',
      load.assignedTo || 'Unassigned',
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `fleetflow-loads-${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadJSON = () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalRecords: filteredLoads.length,
      searchCriteria: {
        query: searchQuery,
        searchType,
        status: statusFilter,
        minRevenue,
        maxRevenue,
      },
      loads: filteredLoads.map((load) => ({
        id: load.id,
        status: load.status,
        origin: load.origin,
        destination: load.destination,
        revenue: load.rate,
        distance: load.distance,
        weight: load.weight,
        equipment: load.equipment,
        pickupDate: load.pickupDate,
        deliveryDate: load.deliveryDate,
        brokerName: load.brokerName,
        shipperCompany: load.shipperInfo?.companyName,
        assignedTo: load.assignedTo,
        createdAt: load.createdAt,
        updatedAt: load.updatedAt,
      })),
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `fleetflow-loads-${new Date().toISOString().split('T')[0]}.json`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>FleetFlow Business Intelligence Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .filters { background: #f5f5f5; padding: 15px; margin-bottom: 20px; border-radius: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .summary { margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FleetFlow™ Business Intelligence Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>

          <div class="filters">
            <h3>Search Criteria</h3>
            <p><strong>Search Query:</strong> ${searchQuery || 'All loads'}</p>
            <p><strong>Search Type:</strong> ${searchType === 'all' ? 'All Fields' : searchType}</p>
            <p><strong>Status Filter:</strong> ${statusFilter === 'all' ? 'All Status' : statusFilter}</p>
            <p><strong>Revenue Range:</strong> ${minRevenue ? `$${minRevenue}` : 'No min'} - ${maxRevenue ? `$${maxRevenue}` : 'No max'}</p>
          </div>

          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Records Found:</strong> ${filteredLoads.length} loads</p>
            <p><strong>Total Revenue:</strong> $${filteredLoads.reduce((sum, load) => sum + load.rate, 0).toLocaleString()}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Load ID</th>
                <th>Status</th>
                <th>Route</th>
                <th>Revenue</th>
                <th>Equipment</th>
                <th>Pickup Date</th>
                <th>Broker</th>
              </tr>
            </thead>
            <tbody>
              ${filteredLoads
                .map(
                  (load) => `
                <tr>
                  <td>${load.id}</td>
                  <td>${load.status}</td>
                  <td>${load.origin} → ${load.destination}</td>
                  <td>$${load.rate.toLocaleString()}</td>
                  <td>${load.equipment}</td>
                  <td>${load.pickupDate}</td>
                  <td>${load.brokerName}</td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  useEffect(() => {
    loadCompletedLoadsData();
  }, [dateRange]);

  // Filter loads based on search criteria
  useEffect(() => {
    let filtered = [...completedLoads];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((load) => {
        switch (searchType) {
          case 'loadNumber':
            return load.id.toLowerCase().includes(query);
          case 'shipperId':
            return (
              load.shipperId?.toLowerCase().includes(query) ||
              load.shipperInfo?.id.toLowerCase().includes(query)
            );
          case 'userId':
            return (
              load.assignedTo?.toLowerCase().includes(query) ||
              load.assignedBy?.toLowerCase().includes(query)
            );
          case 'bol':
            return (load as any).bolNumber?.toLowerCase().includes(query);
          case 'driver':
            return (
              load.assignedTo?.toLowerCase().includes(query) ||
              load.dispatcherName?.toLowerCase().includes(query)
            );
          case 'all':
          default:
            return (
              load.id.toLowerCase().includes(query) ||
              load.brokerId?.toLowerCase().includes(query) ||
              load.shipperId?.toLowerCase().includes(query) ||
              load.assignedTo?.toLowerCase().includes(query) ||
              load.assignedBy?.toLowerCase().includes(query) ||
              (load as any).bolNumber?.toLowerCase().includes(query) ||
              load.brokerName?.toLowerCase().includes(query) ||
              load.shipperInfo?.companyName.toLowerCase().includes(query) ||
              load.origin?.toLowerCase().includes(query) ||
              load.destination?.toLowerCase().includes(query)
            );
        }
      });
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((load) => load.status === statusFilter);
    }

    // Apply revenue range filter
    if (minRevenue || maxRevenue) {
      filtered = filtered.filter((load) => {
        const revenue = load.rate;
        const min = minRevenue ? parseFloat(minRevenue) : 0;
        const max = maxRevenue ? parseFloat(maxRevenue) : Infinity;
        return revenue >= min && revenue <= max;
      });
    }

    setFilteredLoads(filtered);
  }, [
    completedLoads,
    searchQuery,
    searchType,
    statusFilter,
    minRevenue,
    maxRevenue,
  ]);

  // Ensure page can scroll properly
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ============= PHASE 3: REAL-TIME FUNCTIONS =============
  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastDataUpdate(new Date());
      // Simulate occasional disconnection
      if (Math.random() < 0.05) {
        setIsLiveConnected(false);
        setTimeout(() => setIsLiveConnected(true), 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle widget management
  const handleWidgetMove = (widgetId: string) => {
    console.log('Moving widget:', widgetId);
  };

  const handleWidgetResize = (widgetId: string) => {
    console.log('Resizing widget:', widgetId);
  };

  const handleWidgetRemove = (widgetId: string) => {
    setCustomWidgets((widgets: any[]) =>
      widgets.filter((w: any) => w.id !== widgetId)
    );
  };

  const loadCompletedLoadsData = async () => {
    setIsLoading(true);
    try {
      // Option 1: Use API for large datasets (recommended for production)
      // const response = await fetch(`/api/admin/business-intelligence?type=overview&dateRange=${dateRange}`);
      // if (response.ok) {
      //   const result = await response.json();
      //   if (result.success) {
      //     setCompletedLoads(result.data.recentCompletedLoads);
      //     setAnalytics({
      //       totalCompleted: result.data.overview.totalCompleted,
      //       totalRevenue: result.data.overview.totalRevenue,
      //       avgDeliveryTime: result.data.overview.avgDeliveryTime,
      //       onTimeDeliveryRate: result.data.overview.onTimeDeliveryRate,
      //       avgRatePerMile: result.data.overview.avgRatePerMile,
      //       topPerformingDrivers: result.data.topPerformingDrivers,
      //       completionTrends: result.data.revenueTrends,
      //       customerAnalytics: result.data.customerAnalytics,
      //       workflowCompliance: result.data.workflowCompliance
      //     });
      //     return;
      //   }
      // }

      // Option 2: Direct service calls (current implementation)
      // Get all loads and filter completed ones
      const allLoads = getLoadsForUser();
      const completed = allLoads.filter((load) => load.status === 'Delivered');
      setCompletedLoads(completed);

      // Calculate analytics
      const analyticsData = calculateAnalytics(completed);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading completed loads data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (loads: Load[]): CompletedLoadAnalytics => {
    const totalCompleted = loads.length;
    const totalRevenue = loads.reduce((sum, load) => sum + load.rate, 0);

    // Calculate average delivery time (mock data for now)
    const avgDeliveryTime = 2.3; // days

    // Calculate on-time delivery rate (mock data)
    const onTimeDeliveryRate = 94.2; // percentage

    // Calculate average rate per mile
    const avgRatePerMile =
      loads.reduce((sum, load) => {
        const miles = parseFloat(load.distance?.replace(' mi', '') || '100');
        return sum + load.rate / miles;
      }, 0) / totalCompleted || 0;

    // Group by dispatcher/driver for top performers
    const driverPerformance = new Map();
    loads.forEach((load) => {
      const driverName = load.dispatcherName || 'Unknown Driver';
      if (!driverPerformance.has(driverName)) {
        driverPerformance.set(driverName, {
          name: driverName,
          completedLoads: 0,
          totalRevenue: 0,
          onTimeRate: 95, // mock data
        });
      }
      const driver = driverPerformance.get(driverName);
      driver.completedLoads++;
      driver.totalRevenue += load.rate;
    });

    const topPerformingDrivers = Array.from(driverPerformance.values())
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);

    // Generate completion trends (last 30 days)
    const completionTrends = generateCompletionTrends(loads);

    // Customer analytics by broker
    const customerMap = new Map();
    loads.forEach((load) => {
      if (!customerMap.has(load.brokerName)) {
        customerMap.set(load.brokerName, {
          brokerName: load.brokerName,
          loadsCompleted: 0,
          totalRevenue: 0,
          avgRate: 0,
        });
      }
      const customer = customerMap.get(load.brokerName);
      customer.loadsCompleted++;
      customer.totalRevenue += load.rate;
    });

    const customerAnalytics = Array.from(customerMap.values())
      .map((customer) => ({
        ...customer,
        avgRate: customer.totalRevenue / customer.loadsCompleted,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      totalCompleted,
      totalRevenue,
      avgDeliveryTime,
      onTimeDeliveryRate,
      avgRatePerMile,
      topPerformingDrivers,
      completionTrends,
      customerAnalytics,
      workflowCompliance: {
        photoComplianceRate: 97.8,
        signatureComplianceRate: 99.2,
        avgWorkflowTime: 4.2, // hours
      },
    };
  };

  const generateCompletionTrends = (loads: Load[]) => {
    const trends = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Mock data - in real implementation, filter loads by date
      const completed = Math.floor(Math.random() * 10) + 5;
      const revenue = completed * (2000 + Math.random() * 1000);

      trends.push({
        date: dateStr,
        completed,
        revenue,
      });
    }

    return trends;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h2 style={{ color: '#1f2937', marginBottom: '8px' }}>
            Loading Completed Loads Analytics...
          </h2>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Analyzing delivery performance and revenue data
          </p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Error loading analytics data</h2>
        <button onClick={loadCompletedLoadsData}>Retry</button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '40px',
        paddingTop: '100px',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Professional Header */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 10px 0',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              📊 FleetFlow Business Intelligence℠
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
              }}
            >
              Advanced Analytics & Performance Insights •{' '}
              {new Date().toLocaleString()}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <LiveDataStream
              isConnected={isLiveConnected}
              lastUpdate={lastDataUpdate}
            />

            <AdvancedDateRangePicker
              value={dateRange}
              onChange={(value) => setDateRange(value)}
            />
          </div>
        </div>
      </div>

      {/* Advanced Search & Filter Section */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <h3
          style={{
            color: 'white',
            fontSize: '18px',
            margin: '0 0 20px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          🔍 Search & Filter Loads
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          {/* Search Input */}
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Search Query
            </label>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Enter search term...'
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Search Type */}
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Search In
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '14px',
              }}
            >
              <option
                value='all'
                style={{ background: '#1f2937', color: 'white' }}
              >
                All Fields
              </option>
              <option
                value='loadNumber'
                style={{ background: '#1f2937', color: 'white' }}
              >
                Load Number
              </option>
              <option
                value='shipperId'
                style={{ background: '#1f2937', color: 'white' }}
              >
                Shipper ID
              </option>
              <option
                value='userId'
                style={{ background: '#1f2937', color: 'white' }}
              >
                User/Driver ID
              </option>
              <option
                value='bol'
                style={{ background: '#1f2937', color: 'white' }}
              >
                BOL Number
              </option>
              <option
                value='driver'
                style={{ background: '#1f2937', color: 'white' }}
              >
                Driver/Dispatcher
              </option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '14px',
              }}
            >
              <option
                value='all'
                style={{ background: '#1f2937', color: 'white' }}
              >
                All Status
              </option>
              <option
                value='Delivered'
                style={{ background: '#1f2937', color: 'white' }}
              >
                Delivered
              </option>
              <option
                value='In Transit'
                style={{ background: '#1f2937', color: 'white' }}
              >
                In Transit
              </option>
              <option
                value='Assigned'
                style={{ background: '#1f2937', color: 'white' }}
              >
                Assigned
              </option>
            </select>
          </div>

          {/* Revenue Min */}
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Min Revenue ($)
            </label>
            <input
              type='number'
              value={minRevenue}
              onChange={(e) => setMinRevenue(e.target.value)}
              placeholder='0'
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Revenue Max */}
          <div>
            <label
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontWeight: '500',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Max Revenue ($)
            </label>
            <input
              type='number'
              value={maxRevenue}
              onChange={(e) => setMaxRevenue(e.target.value)}
              placeholder='No limit'
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'white',
                fontSize: '14px',
              }}
            />
          </div>
        </div>

        {/* Search Results Summary */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: 'white', fontSize: '14px' }}>
            🎯 Found {filteredLoads.length} of {completedLoads.length} loads
          </span>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Download Options */}
            {filteredLoads.length > 0 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={downloadCSV}
                  style={{
                    background: 'rgba(34, 197, 94, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title='Export to CSV'
                >
                  📊 CSV
                </button>

                <button
                  onClick={downloadJSON}
                  style={{
                    background: 'rgba(59, 130, 246, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title='Export to JSON'
                >
                  📄 JSON
                </button>

                <button
                  onClick={printReport}
                  style={{
                    background: 'rgba(139, 69, 19, 0.8)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  title='Print Report'
                >
                  🖨️ Print
                </button>
              </div>
            )}

            {/* Clear Filters Button */}
            {(searchQuery ||
              statusFilter !== 'all' ||
              minRevenue ||
              maxRevenue) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSearchType('all');
                  setStatusFilter('all');
                  setMinRevenue('');
                  setMaxRevenue('');
                }}
                style={{
                  background: 'rgba(255, 59, 48, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============= PHASE 3: ADVANCED MULTI-FILTER =============*/}
      <AdvancedMultiFilter
        filters={advancedFilters}
        onFiltersChange={setAdvancedFilters}
      />

      {/* Executive KPIs - Compact Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          marginBottom: '20px',
        }}
      >
        {/* Total Revenue */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#10b981',
              marginBottom: '4px',
            }}
          >
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
            }).format(analytics.totalRevenue)}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            Total Revenue
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            +12.3%
          </div>
        </div>

        {/* Completed Loads */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#3b82f6',
              marginBottom: '4px',
            }}
          >
            {analytics.totalCompleted.toLocaleString()}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            Completed Loads
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            +8.1%
          </div>
        </div>

        {/* On-Time Performance */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>⏰</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#f59e0b',
              marginBottom: '4px',
            }}
          >
            {analytics.onTimeDeliveryRate}%
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            On-Time Performance
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            +2.4%
          </div>
        </div>

        {/* Average Rate Per Mile */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📏</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#8b5cf6',
              marginBottom: '4px',
            }}
          >
            ${analytics.avgRatePerMile.toFixed(2)}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            Avg Rate/Mile
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            +5.2%
          </div>
        </div>

        {/* Photo Compliance */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#06b6d4',
              marginBottom: '4px',
            }}
          >
            {analytics.workflowCompliance.photoComplianceRate}%
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            Photo Compliance
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            +1.8%
          </div>
        </div>

        {/* Average Delivery Time */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '18px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
          }}
        >
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚛</div>
          <div
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#ef4444',
              marginBottom: '4px',
            }}
          >
            {analytics.avgDeliveryTime} days
          </div>
          <div
            style={{
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '4px',
            }}
          >
            Avg Delivery Time
          </div>
          <div
            style={{ fontSize: '10px', color: '#10b981', fontWeight: '600' }}
          >
            -0.3 days
          </div>
        </div>
      </div>

      {/* ============= COMPREHENSIVE UNIFIED DASHBOARD GRID ============= */}
      {/* Mixed Layout: KPI Cards, Charts, and Tables */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {/* Revenue Overview KPI */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>💰</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Revenue Overview
            </div>
          </div>
          <div
            style={{
              color: '#10b981',
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '8px',
            }}
          >
            ${analytics.totalRevenue?.toLocaleString() || '2,847,290'}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
            }}
          >
            <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              This Month
            </span>
            <span style={{ color: '#10b981' }}>+18.5%</span>
          </div>
          <div
            style={{
              marginTop: '12px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
            }}
          >
            <div
              style={{
                width: '73%',
                height: '100%',
                background: '#10b981',
                borderRadius: '2px',
              }}
             />
          </div>
        </div>

        {/* Equipment Utilization Mini Chart */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>🚛</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Equipment Mix
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { type: 'Dry Van', percent: 45, color: '#3b82f6' },
              { type: 'Flatbed', percent: 28, color: '#8b5cf6' },
              { type: 'Reefer', percent: 18, color: '#10b981' },
              { type: 'Tanker', percent: 9, color: '#f59e0b' },
            ].map((item) => (
              <div
                key={item.type}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '11px',
                      minWidth: '60px',
                    }}
                  >
                    {item.type}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: '6px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      margin: '0 8px',
                    }}
                  >
                    <div
                      style={{
                        width: `${item.percent}%`,
                        height: '100%',
                        background: item.color,
                        borderRadius: '3px',
                      }}
                     />
                  </div>
                </div>
                <div
                  style={{
                    color: item.color,
                    fontSize: '11px',
                    fontWeight: '600',
                    minWidth: '35px',
                    textAlign: 'right',
                  }}
                >
                  {item.percent}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Routes Table */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>🛣️</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Top Routes
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { route: 'ATL → MIA', loads: 45, avg: '$3,200' },
              { route: 'CHI → DET', loads: 38, avg: '$2,850' },
              { route: 'DAL → HOU', loads: 32, avg: '$2,650' },
              { route: 'LAX → PHX', loads: 28, avg: '$2,400' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '11px',
                    fontWeight: '500',
                  }}
                >
                  {item.route}
                </div>
                <div
                  style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '10px',
                    }}
                  >
                    {item.loads} loads
                  </div>
                  <div
                    style={{
                      color: '#10b981',
                      fontSize: '11px',
                      fontWeight: '600',
                    }}
                  >
                    {item.avg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Dashboard */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>📊</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Fleet Performance
            </div>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#10b981',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                97.3%
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
              >
                On-Time
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#3b82f6',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                6.8
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
              >
                MPG Avg
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#f59e0b',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                4.8★
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
              >
                Rating
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: '#ef4444',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                12.4%
              </div>
              <div
                style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
              >
                Deadhead
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend Mini Chart */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>📈</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              7-Day Trend
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'end',
              gap: '4px',
              height: '60px',
            }}
          >
            {[65, 72, 68, 85, 92, 88, 95].map((height, idx) => (
              <div
                key={idx}
                style={{
                  flex: 1,
                  height: `${height}%`,
                  background: idx === 6 ? '#10b981' : 'rgba(59, 130, 246, 0.6)',
                  borderRadius: '2px',
                }}
               />
            ))}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '8px',
              fontSize: '9px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span style={{ color: '#10b981' }}>Sun</span>
          </div>
        </div>

        {/* Top Customers List */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>🏢</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Top Customers
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {analytics.customerAnalytics.slice(0, 4).map((customer, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][idx]}, ${['#1d4ed8', '#7c3aed', '#059669', '#d97706'][idx]})`,
                      marginRight: '8px',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                    }}
                  >
                    {customer.brokerName?.charAt(0) || idx + 1}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '11px',
                      fontWeight: '500',
                    }}
                  >
                    {customer.brokerName}
                  </div>
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  ${Math.round(customer.totalRevenue / 1000)}K
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Status Board */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>🚨</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              System Status
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              {
                status: 'Fleet Status',
                value: 'OPERATIONAL',
                color: '#10b981',
              },
              { status: 'Fuel Costs', value: 'ELEVATED', color: '#f59e0b' },
              { status: 'Route Delays', value: 'MINIMAL', color: '#10b981' },
              { status: 'Driver Pool', value: 'ADEQUATE', color: '#3b82f6' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 0',
                }}
              >
                <div
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '11px',
                  }}
                >
                  {item.status}
                </div>
                <div
                  style={{
                    color: item.color,
                    fontSize: '10px',
                    fontWeight: '600',
                    padding: '2px 6px',
                    background: `${item.color}20`,
                    borderRadius: '8px',
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load Distribution Pie */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            gridColumn: 'span 1',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <div style={{ fontSize: '20px', marginRight: '8px' }}>📊</div>
            <div
              style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}
            >
              Load Status
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Simple Donut Chart */}
            <div
              style={{ position: 'relative', width: '80px', height: '80px' }}
            >
              <svg
                width='80'
                height='80'
                style={{ transform: 'rotate(-90deg)' }}
              >
                <circle
                  cx='40'
                  cy='40'
                  r='32'
                  fill='none'
                  stroke='rgba(255,255,255,0.1)'
                  strokeWidth='8'
                />
                <circle
                  cx='40'
                  cy='40'
                  r='32'
                  fill='none'
                  stroke='#10b981'
                  strokeWidth='8'
                  strokeDasharray={`${2 * Math.PI * 32 * 0.75} ${2 * Math.PI * 32}`}
                  strokeLinecap='round'
                />
              </svg>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#10b981',
                  fontSize: '14px',
                  fontWeight: '700',
                }}
              >
                75%
              </div>
            </div>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#10b981',
                  }}
                 />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10px',
                  }}
                >
                  Completed (75%)
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                  }}
                 />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10px',
                  }}
                >
                  In Transit (18%)
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                  }}
                 />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '10px',
                  }}
                >
                  Delayed (7%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights & Analytics - Dashboard Style */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '20px',
            fontWeight: '700',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          📈 Performance Insights & Analytics
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Quick Stats */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              🎯 Key Metrics
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Avg Load Value:
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  $
                  {(
                    analytics.totalRevenue / analytics.totalCompleted
                  ).toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Revenue Growth:
                </span>
                <span
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  +12.3%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Load Growth:
                </span>
                <span
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  +8.1%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '14px',
                  }}
                >
                  Efficiency Score:
                </span>
                <span
                  style={{
                    color: '#f59e0b',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  94.2/100
                </span>
              </div>
            </div>
          </div>

          {/* Trends */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              📊 Trend Analysis
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981', fontSize: '16px' }}>↗️</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Revenue trending upward for 6 weeks
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#3b82f6', fontSize: '16px' }}>📈</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Load completions above seasonal average
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>⚡</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Delivery times improving consistently
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#8b5cf6', fontSize: '16px' }}>🎯</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Rate per mile optimization effective
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              💡 AI Recommendations
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#10b981', fontSize: '16px' }}>✅</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Focus on high-value routes (&gt;$3K)
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#3b82f6', fontSize: '16px' }}>🔄</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Optimize dry van utilization
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>⏰</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Reduce avg delivery time by 0.2 days
                </span>
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ color: '#ef4444', fontSize: '16px' }}>📋</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '14px',
                  }}
                >
                  Improve photo compliance to 99%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Top Performing Drivers */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🏆 Top Performing Drivers
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {analytics.topPerformingDrivers.map((driver, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4
                    style={{
                      color: 'white',
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                    }}
                  >
                    #{index + 1} {driver.name}
                  </h4>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {driver.completedLoads} loads • {driver.onTimeRate}% on-time
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatCurrency(driver.totalRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Analytics */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            👥 Top Customers by Revenue
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {analytics.customerAnalytics.slice(0, 5).map((customer, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4
                    style={{
                      color: 'white',
                      margin: '0 0 4px 0',
                      fontSize: '16px',
                    }}
                  >
                    {customer.brokerName}
                  </h4>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      margin: 0,
                      fontSize: '14px',
                    }}
                  >
                    {customer.loadsCompleted} loads • Avg:{' '}
                    {formatCurrency(customer.avgRate)}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: 'bold',
                    }}
                  >
                    {formatCurrency(customer.totalRevenue)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Compliance */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            ✅ Workflow Compliance Analytics
          </h3>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Photo Documentation
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.workflowCompliance.photoComplianceRate}%
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  height: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#10b981',
                    height: '100%',
                    width: `${analytics.workflowCompliance.photoComplianceRate}%`,
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ color: 'white', fontSize: '14px' }}>
                  Digital Signatures
                </span>
                <span
                  style={{
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold',
                  }}
                >
                  {analytics.workflowCompliance.signatureComplianceRate}%
                </span>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '4px',
                  height: '8px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    background: '#3b82f6',
                    height: '100%',
                    width: `${analytics.workflowCompliance.signatureComplianceRate}%`,
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center',
              }}
            >
              <h4 style={{ color: 'white', margin: '0 0 8px 0' }}>
                Average Workflow Completion Time
              </h4>
              <span
                style={{
                  color: '#fbbf24',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                {analytics.workflowCompliance.avgWorkflowTime} hours
              </span>
            </div>
          </div>
        </div>

        {/* Recent Completed Loads */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            padding: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📋 Filtered Load Results
          </h3>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              maxHeight: '600px', // Increased from 400px
              overflowY: 'auto',
            }}
          >
            {filteredLoads.slice(0, 10).map((load) => (
              <div
                key={load.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '16px',
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
                    <h4
                      style={{
                        color: 'white',
                        margin: '0 0 4px 0',
                        fontSize: '14px',
                      }}
                    >
                      {load.id}
                    </h4>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: '0 0 4px 0',
                        fontSize: '12px',
                      }}
                    >
                      {load.origin} → {load.destination}
                    </p>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        margin: 0,
                        fontSize: '12px',
                      }}
                    >
                      {load.brokerName}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatCurrency(load.rate)}
                    </span>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        margin: '4px 0 0 0',
                        fontSize: '12px',
                      }}
                    >
                      {load.distance}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============= PHASE 3: ALERT SYSTEM & CUSTOM WIDGETS =============*/}
      <AlertSystem alerts={liveAlerts} />

      {/* Customizable Dashboard Widgets */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '30px',
          marginBottom: '30px',
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
          <h2
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: '700',
              margin: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            🧩 Custom Dashboard Widgets
          </h2>
          <button
            style={{
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#34d399',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.3)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ➕ Add Widget
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {customWidgets.map((widget) => (
            <DashboardWidget
              key={widget.id}
              widget={widget}
              onMove={handleWidgetMove}
              onResize={handleWidgetResize}
              onRemove={handleWidgetRemove}
            />
          ))}
        </div>

        {/* Widget Configuration Panel */}
        <div
          style={{
            marginTop: '24px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <h4
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
            }}
          >
            🎛️ Widget Configuration
          </h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📊 Add Chart Widget
            </button>
            <button
              style={{
                background: 'rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📈 Add Metric Widget
            </button>
            <button
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              📋 Add List Widget
            </button>
            <button
              style={{
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#22d3ee',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              🎯 Save Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= PHASE 3: REAL-TIME DATA & ADVANCED FEATURES =============
// Real-time Data Stream Component
const LiveDataStream = ({
  isConnected,
  lastUpdate,
}: {
  isConnected: boolean;
  lastUpdate: Date;
}) => {
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '8px 12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: isConnected ? '#10b981' : '#ef4444',
          boxShadow: `0 0 ${pulseAnimation ? '12px' : '4px'} ${isConnected ? '#10b981' : '#ef4444'}`,
          transition: 'all 0.3s ease',
          animation: isConnected ? 'pulse 2s infinite' : 'none',
        }}
      />
      <span
        style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '12px',
          fontWeight: '600',
        }}
      >
        {isConnected ? 'LIVE' : 'OFFLINE'}
      </span>
      <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '11px' }}>
        {lastUpdate.toLocaleTimeString()}
      </span>
    </div>
  );
};

// Advanced Multi-Filter Component
const AdvancedMultiFilter = ({
  filters,
  onFiltersChange,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    {
      name: 'High Value Loads',
      criteria: { minRevenue: '5000', status: 'Completed' },
    },
    {
      name: 'Recent Deliveries',
      criteria: { dateRange: '7d', status: 'Completed' },
    },
    { name: 'Photo Issues', criteria: { photoCompliance: 'low' } },
  ]);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        marginBottom: '24px',
      }}
    >
      {/* Filter Header */}
      <div
        style={{
          padding: '16px 20px',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '16px' }}>🎯</span>
          <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>
            Advanced Filters
          </span>
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              color: '#60a5fa',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '600',
            }}
          >
            {
              Object.keys(filters).filter(
                (key) => filters[key] && filters[key] !== 'all'
              ).length
            }{' '}
            active
          </div>
        </div>
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '14px',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          ▼
        </span>
      </div>

      {/* Expanded Filter Content */}
      {isExpanded && (
        <div
          style={{
            padding: '0 20px 20px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Quick Filter Presets */}
          <div style={{ marginBottom: '20px' }}>
            <h4
              style={{
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
              }}
            >
              📚 Saved Filters
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {savedFilters.map((preset, index) => (
                <button
                  key={index}
                  onClick={() =>
                    onFiltersChange({ ...filters, ...preset.criteria })
                  }
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {/* Advanced Filter Controls */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Revenue Range Slider */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                💰 Revenue Range
              </label>
              <div
                style={{ display: 'flex', gap: '8px', alignItems: 'center' }}
              >
                <input
                  type='range'
                  min='0'
                  max='10000'
                  value={filters.minRevenue || 0}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, minRevenue: e.target.value })
                  }
                  style={{ flex: 1 }}
                />
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '12px',
                    minWidth: '60px',
                  }}
                >
                  ${(filters.minRevenue || 0).toLocaleString()}+
                </span>
              </div>
            </div>

            {/* Load Status Multi-Select */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                📋 Load Status
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['Completed', 'In Transit', 'Delivered', 'Cancelled'].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => {
                        const currentStatuses = filters.statuses || [];
                        const newStatuses = currentStatuses.includes(status)
                          ? currentStatuses.filter((s: string) => s !== status)
                          : [...currentStatuses, status];
                        onFiltersChange({ ...filters, statuses: newStatuses });
                      }}
                      style={{
                        background: filters.statuses?.includes(status)
                          ? '#10b981'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: filters.statuses?.includes(status)
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Equipment Type Filter */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                🚛 Equipment Type
              </label>
              <select
                value={filters.equipmentType || 'all'}
                onChange={(e) =>
                  onFiltersChange({ ...filters, equipmentType: e.target.value })
                }
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  fontSize: '12px',
                  width: '100%',
                }}
              >
                <option value='all' style={{ color: '#1f2937' }}>
                  All Equipment
                </option>
                <option value='dry_van' style={{ color: '#1f2937' }}>
                  Dry Van
                </option>
                <option value='flatbed' style={{ color: '#1f2937' }}>
                  Flatbed
                </option>
                <option value='reefer' style={{ color: '#1f2937' }}>
                  Reefer
                </option>
                <option value='tanker' style={{ color: '#1f2937' }}>
                  Tanker
                </option>
              </select>
            </div>

            {/* Performance Score Filter */}
            <div>
              <label
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                ⭐ Performance Score
              </label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() =>
                      onFiltersChange({ ...filters, minRating: rating })
                    }
                    style={{
                      background:
                        filters.minRating >= rating
                          ? '#f59e0b'
                          : 'rgba(255, 255, 255, 0.1)',
                      color:
                        filters.minRating >= rating
                          ? 'white'
                          : 'rgba(255, 255, 255, 0.5)',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => onFiltersChange({})}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🗑️ Clear All
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                💾 Save Filter
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                ✅ Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alert System Component
const AlertSystem = ({ alerts }: { alerts: any[] }) => {
  const [activeAlert, setActiveAlert] = useState<number | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        width: '320px',
        maxHeight: isMinimized ? '60px' : '400px',
        background: 'rgba(17, 24, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 1000,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Alert Header */}
      <div
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>🚨</span>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
            Live Alerts
          </span>
          {alerts.length > 0 && (
            <div
              style={{
                background: '#ef4444',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700',
                animation: alerts.some((a) => a.priority === 'high')
                  ? 'pulse 1s infinite'
                  : 'none',
              }}
            >
              {alerts.length}
            </div>
          )}
        </div>
        <span
          style={{
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '12px',
            transform: isMinimized ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          ▼
        </span>
      </div>

      {/* Alert List */}
      {!isMinimized && (
        <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {alerts.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                ✅
              </span>
              <span style={{ fontSize: '14px' }}>All systems normal</span>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 16px',
                  borderBottom:
                    index < alerts.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.05)'
                      : 'none',
                  cursor: 'pointer',
                  background:
                    activeAlert === index
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onClick={() =>
                  setActiveAlert(activeAlert === index ? null : index)
                }
              >
                <div
                  style={{ display: 'flex', alignItems: 'start', gap: '12px' }}
                >
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background:
                        alert.priority === 'high'
                          ? '#ef4444'
                          : alert.priority === 'medium'
                            ? '#f59e0b'
                            : '#10b981',
                      marginTop: '6px',
                      boxShadow: `0 0 8px ${alert.priority === 'high' ? '#ef4444' : alert.priority === 'medium' ? '#f59e0b' : '#10b981'}`,
                      animation:
                        alert.priority === 'high'
                          ? 'pulse 1s infinite'
                          : 'none',
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: '4px',
                      }}
                    >
                      <span
                        style={{
                          color: 'white',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {alert.title}
                      </span>
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.5)',
                          fontSize: '11px',
                        }}
                      >
                        {alert.time}
                      </span>
                    </div>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                        margin: '0',
                        lineHeight: '1.4',
                      }}
                    >
                      {alert.message}
                    </p>
                    {activeAlert === index && alert.details && (
                      <div
                        style={{
                          marginTop: '8px',
                          padding: '8px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          color: 'rgba(255, 255, 255, 0.8)',
                        }}
                      >
                        {alert.details}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// Customizable Dashboard Widget
const DashboardWidget = ({
  widget,
  onMove,
  onResize,
  onRemove,
}: {
  widget: any;
  onMove: (id: string) => void;
  onResize: (id: string) => void;
  onRemove: (id: string) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'all 0.3s ease',
        transform: isDragging ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragging
          ? '0 8px 32px rgba(0, 0, 0, 0.2)'
          : '0 4px 16px rgba(0, 0, 0, 0.1)',
      }}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Widget Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px' }}>{widget.icon}</span>
          <span style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
            {widget.title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => onResize(widget.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '12px',
            }}
            title='Resize'
          >
            ⤢
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
              padding: '4px',
              fontSize: '12px',
            }}
            title='Remove'
          >
            ✕
          </button>
        </div>
      </div>

      {/* Widget Content */}
      <div style={{ padding: '16px' }}>
        {widget.type === 'metric' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '4px',
              }}
            >
              {widget.value}
            </div>
            <div
              style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}
            >
              {widget.subtitle}
            </div>
          </div>
        )}
        {widget.type === 'chart' && (
          <div
            style={{
              height: '120px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}
            >
              {widget.chartType} Chart
            </span>
          </div>
        )}
        {widget.type === 'list' && (
          <div style={{ maxHeight: '100px', overflowY: 'auto' }}>
            {widget.items?.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: '4px 0',
                  borderBottom:
                    index < widget.items.length - 1
                      ? '1px solid rgba(255, 255, 255, 0.1)'
                      : 'none',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
