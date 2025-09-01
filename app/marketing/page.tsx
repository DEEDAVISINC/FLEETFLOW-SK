'use client';

import { useState } from 'react';
import DigitalMarketingStrategyWidget from '../components/DigitalMarketingStrategyWidget';

const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState('digital-strategy');

  const marketingMetrics = [
    {
      title: 'Active Campaigns',
      value: '6',
      icon: '🚀',
      status: 'success',
      change: '+2',
      description: 'Currently running marketing campaigns',
    },
    {
      title: 'Total Reach',
      value: '567K',
      icon: '👥',
      status: 'success',
      change: '+15%',
      description: 'Monthly audience reach across all platforms',
    },
    {
      title: 'Conversion Rate',
      value: '6.8%',
      icon: '📈',
      status: 'success',
      change: '+1.2%',
      description: 'Average conversion rate across campaigns',
    },
    {
      title: 'Marketing ROI',
      value: '340%',
      icon: '💰',
      status: 'success',
      change: '+25%',
      description: 'Return on marketing investment',
    },
  ];

  const tabs = [
    { id: 'digital-strategy', label: 'Digital Strategy', icon: '📈' },
    { id: 'brand-management', label: 'Brand Management', icon: '🎨' },
    { id: 'lead-generation', label: 'Lead Generation', icon: '🎯' },
    { id: 'referral-program', label: 'Referral Program Design', icon: '🎁' },
    { id: 'analytics', label: 'Marketing Analytics', icon: '📊' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
        padding: '0',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, ""Segoe UI"", Roboto, sans-serif',
      }}
    >
      {/* Marketing Header */}
      <div
        style={{
          background: 'rgba(30, 58, 138, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '32px 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 32px',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 16px 0',
              letterSpacing: '-0.025em',
              textShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
            }}
          >
            📈 Digital Marketing Command Center
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              maxWidth: '800px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Comprehensive online presence management and digital marketing
            strategy platform
          </p>
        </div>
      </div>

      {/* Marketing KPI Dashboard */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 32px 0',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px',
          }}
        >
          {marketingMetrics.map((metric, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(30, 64, 175, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                padding: '24px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    background: 'rgba(59, 130, 246, 0.3)',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.6)',
                  }}
                >
                  {metric.icon}
                </div>
                <div
                  style={{
                    background: 'rgba(74, 222, 128, 0.25)',
                    border: '1px solid rgba(74, 222, 128, 0.5)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#4ade80',
                  }}
                >
                  {metric.change}
                </div>
              </div>
              <h3
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  margin: '0 0 8px 0',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                }}
              >
                {metric.value}
              </h3>
              <h4
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: 'rgba(255, 255, 255, 0.95)',
                  margin: '0 0 8px 0',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {metric.title}
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  margin: 0,
                  lineHeight: '1.4',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px 40px',
        }}
      >
        {/* Marketing Tab Navigation */}
        <div
          style={{
            background: 'rgba(30, 64, 175, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '8px',
            marginBottom: '32px',
            display: 'flex',
            gap: '4px',
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '16px 24px',
                border: 'none',
                borderRadius: '12px',
                background:
                  activeTab === tab.id
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    : 'transparent',
                color:
                  activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow:
                  activeTab === tab.id
                    ? '0 4px 15px rgba(59, 130, 246, 0.3)'
                    : 'none',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            background: 'rgba(30, 64, 175, 0.85)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '16px',
            padding: '40px',
            minHeight: '600px',
          }}
        >
          {activeTab === 'digital-strategy' && (
            <DigitalMarketingStrategyWidget />
          )}

          {activeTab === 'brand-management' && (
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🎨 Brand Management
              </h2>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Brand Management Suite
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                  }}
                >
                  Comprehensive brand identity management, logo guidelines,
                  brand voice consistency, visual asset library, and brand
                  compliance monitoring across all marketing channels.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'lead-generation' && (
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🎯 Lead Generation
              </h2>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎯</div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Advanced Lead Generation
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                  }}
                >
                  AI-powered lead scoring, automated nurture campaigns,
                  multi-channel lead capture, prospect qualification workflows,
                  and integrated CRM pipeline management for maximum conversion
                  rates.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'referral-program' && (
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                🎁 Referral Program Design
              </h2>
              
              {/* Referral Program Overview */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {/* Program Structure */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🏆</div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Reward Structure
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>New Customer Referral</span>
                      <span style={{ color: '#60a5fa', fontWeight: '600' }}>$500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Driver Referral</span>
                      <span style={{ color: '#60a5fa', fontWeight: '600' }}>$1,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Enterprise Partnership</span>
                      <span style={{ color: '#60a5fa', fontWeight: '600' }}>$2,500</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Broker Network</span>
                      <span style={{ color: '#60a5fa', fontWeight: '600' }}>5% Commission</span>
                    </div>
                  </div>
                </div>

                {/* Program Metrics */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>📊</div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Program Performance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Active Referrers</span>
                      <span style={{ color: '#4ade80', fontWeight: '600' }}>1,247</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Monthly Referrals</span>
                      <span style={{ color: '#4ade80', fontWeight: '600' }}>89</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Conversion Rate</span>
                      <span style={{ color: '#4ade80', fontWeight: '600' }}>68%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Avg. Customer Value</span>
                      <span style={{ color: '#4ade80', fontWeight: '600' }}>$15,750</span>
                    </div>
                  </div>
                </div>

                {/* Incentive Tiers */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.15)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🎯</div>
                  <h3
                    style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: 'white',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    Loyalty Tiers
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Bronze (1-5 referrals)</span>
                      <span style={{ color: '#cd7f32', fontWeight: '600' }}>Base Reward</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Silver (6-15 referrals)</span>
                      <span style={{ color: '#c0c0c0', fontWeight: '600' }}>+25% Bonus</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Gold (16-30 referrals)</span>
                      <span style={{ color: '#ffd700', fontWeight: '600' }}>+50% Bonus</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Platinum (31+ referrals)</span>
                      <span style={{ color: '#e5e4e2', fontWeight: '600' }}>+100% Bonus</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Features */}
              <div
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚀</div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Customer Incentive Platform
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                  }}
                >
                  Automated referral tracking, tiered reward systems, digital gift cards, 
                  performance bonuses, loyalty point accumulation, social sharing tools, 
                  gamification elements, and real-time progress dashboards to maximize 
                  customer engagement and program participation.
                </p>
                
                {/* Program Actions */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🎁 Create New Program
                  </button>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    📊 View Analytics
                  </button>
                  <button
                    style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ⚙️ Program Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                📊 Marketing Analytics
              </h2>
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: '600',
                    color: 'white',
                    marginBottom: '16px',
                  }}
                >
                  Marketing Intelligence Dashboard
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxWidth: '600px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                  }}
                >
                  Real-time marketing performance analytics, attribution
                  modeling, customer journey tracking, ROI analysis, predictive
                  insights, and automated reporting for data-driven marketing
                  decisions.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
