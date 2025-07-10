'use client'

import { useState, useEffect } from 'react'

interface ConsortiumMetric {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'stable'
  icon: string
}

interface DataInsight {
  category: string
  insight: string
  impact: string
  confidence: number
  timestamp: string
}

export default function DataConsortiumPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'benchmarks' | 'network'>('overview')
  const [isLoading, setIsLoading] = useState(false)

  const consortiumMetrics: ConsortiumMetric[] = [
    { label: 'Network Participants', value: '1,247', change: '+12%', trend: 'up', icon: '🏢' },
    { label: 'Data Points (Daily)', value: '2.4M', change: '+8%', trend: 'up', icon: '📊' },
    { label: 'Market Coverage', value: '84%', change: '+3%', trend: 'up', icon: '🌐' },
    { label: 'Intelligence Quality', value: '96.8%', change: '+1.2%', trend: 'up', icon: '🎯' }
  ]

  const dataInsights: DataInsight[] = [
    {
      category: 'Rate Intelligence',
      insight: 'Cross-country rates increased 5.2% this week, driven by fuel cost fluctuations',
      impact: 'High',
      confidence: 94,
      timestamp: '2 hours ago'
    },
    {
      category: 'Capacity Trends',
      insight: 'Southeast corridor showing 15% capacity shortage - opportunity for premium rates',
      impact: 'Critical',
      confidence: 98,
      timestamp: '4 hours ago'
    },
    {
      category: 'Seasonal Patterns',
      insight: 'Q4 volume surge starting 2 weeks earlier than historical average',
      impact: 'Medium',
      confidence: 87,
      timestamp: '6 hours ago'
    },
    {
      category: 'Compliance Alerts',
      insight: 'New ELD mandate compliance rate at 89% - enforcement increasing',
      impact: 'High',
      confidence: 92,
      timestamp: '8 hours ago'
    }
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
      default: return '➡️'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical': return '#dc2626'
      case 'High': return '#ea580c'
      case 'Medium': return '#d97706'
      case 'Low': return '#059669'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e40af 0%, #3730a3 100%)',
      paddingTop: '80px'
    }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '12px'
            }}>
              <span style={{ fontSize: '32px' }}>🌐</span>
            </div>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 8px 0',
                textShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}>
                Industry Data Consortium
              </h1>
              <p style={{
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 0.9)',
                margin: '0'
              }}>
                Anonymous intelligence sharing network - Bloomberg Terminal for Transportation
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          {[
            { id: 'overview', label: 'Network Overview', icon: '🌐' },
            { id: 'insights', label: 'Market Intelligence', icon: '🧠' },
            { id: 'benchmarks', label: 'Industry Benchmarks', icon: '📊' },
            { id: 'network', label: 'Consortium Network', icon: '🔗' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                border: 'none',
                cursor: 'pointer',
                background: activeTab === tab.id 
                  ? 'rgba(255, 255, 255, 0.25)' 
                  : 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '14px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Consortium Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '32px'
            }}>
              {consortiumMetrics.map((metric, index) => (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span style={{ fontSize: '32px' }}>{metric.icon}</span>
                    <span style={{ fontSize: '20px' }}>{getTrendIcon(metric.trend)}</span>
                  </div>
                  <h3 style={{ color: 'white', fontSize: '14px', fontWeight: '500', margin: '0 0 8px 0', opacity: 0.9 }}>
                    {metric.label}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>
                      {metric.value}
                    </span>
                    <span style={{ 
                      color: metric.trend === 'up' ? '#22c55e' : metric.trend === 'down' ? '#ef4444' : '#6b7280',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Revolutionary Features */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '24px', textAlign: 'center' }}>
                🚀 Revolutionary Industry Features
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '24px'
              }}>
                {[
                  {
                    title: 'Anonymous Intelligence',
                    description: 'Zero-trust data sharing with complete anonymity',
                    icon: '🔒'
                  },
                  {
                    title: 'Real-time Market Data',
                    description: 'Live rates, capacity, and demand intelligence',
                    icon: '📡'
                  },
                  {
                    title: 'Predictive Analytics',
                    description: 'AI-powered market forecasting and trends',
                    icon: '🔮'
                  },
                  {
                    title: 'Benchmarking',
                    description: 'Compare performance against industry standards',
                    icon: '📊'
                  }
                ].map((feature, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '40px', marginBottom: '12px' }}>{feature.icon}</div>
                    <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {feature.title}
                    </h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', lineHeight: '1.5' }}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div>
            {/* Market Intelligence */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
                🧠 Live Market Intelligence
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {dataInsights.map((insight, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div>
                        <span style={{
                          background: getImpactColor(insight.impact),
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {insight.impact}
                        </span>
                        <h3 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '8px 0 4px 0' }}>
                          {insight.category}
                        </h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                          {insight.confidence}% confidence
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                          {insight.timestamp}
                        </div>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', lineHeight: '1.5', margin: 0 }}>
                      {insight.insight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              📊 Industry Benchmarks
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Detailed benchmarking features coming soon. Compare your performance against industry standards.
            </p>
          </div>
        )}

        {activeTab === 'network' && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: '600', marginBottom: '16px' }}>
              🔗 Consortium Network
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px' }}>
              Network visualization and participant management coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
