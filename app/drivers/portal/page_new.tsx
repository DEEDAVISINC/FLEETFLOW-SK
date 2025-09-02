'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for pallet scanning component
const PalletScanningSystem = dynamic(
  () => import('../../components/PalletScanningSystem'),
  {
    loading: () => (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
          <p className='text-gray-600'>Loading scanning system...</p>
        </div>
      </div>
    ),
  }
);

export default function DriversPortalPage() {
  const [activeTab, setActiveTab] = useState('login');

  const tabs = [
    { id: 'login', label: 'Driver Login' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'marketplace', label: '🎯 Marketplace Bidding' },
    { id: 'pallet-scan', label: '📦 Pallet Scanning' },
    { id: 'routes', label: 'Assigned Routes' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'documents', label: 'Documents' },
    { id: 'performance', label: 'Performance' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      {/* Black Road Lines */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 'calc(40% + 30px)',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '60%',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 'calc(60% + 30px)',
          left: '0',
          right: '0',
          height: '4px',
          background:
            'repeating-linear-gradient(90deg, #000000 0px, #000000 60px, transparent 60px, transparent 120px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '48px',
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            padding: '32px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#2d3748',
              margin: '0 0 12px 0',
              textShadow: '2px 2px 4px rgba(255,255,255,0.5)',
            }}
          >
            🚛 Driver Portal
          </h1>
          <p
            style={{
              fontSize: '20px',
              color: 'rgba(45, 55, 72, 0.8)',
              margin: 0,
              fontWeight: '500',
            }}
          >
            Welcome to your driver dashboard and login center
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginBottom: '24px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
              overflowX: 'auto',
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
                  background:
                    activeTab === tab.id
                      ? 'linear-gradient(135deg, #f7c52d, #f4a832)'
                      : 'transparent',
                  color:
                    activeTab === tab.id ? '#2d3748' : 'rgba(45, 55, 72, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderBottom:
                    activeTab === tab.id
                      ? '3px solid #f7c52d'
                      : '3px solid transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '0 0 20px 20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '32px',
            minHeight: '400px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {activeTab === 'login' && (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                  textAlign: 'center',
                }}
              >
                Driver Login
              </h2>

              {/* Login Form */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '16px',
                  padding: '32px',
                  maxWidth: '500px',
                  margin: '0 auto',
                  width: '100%',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Driver ID / Email
                    </label>
                    <input
                      type='text'
                      placeholder='Enter your driver ID or email'
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px',
                      }}
                    >
                      Password
                    </label>
                    <input
                      type='password'
                      placeholder='Enter your password'
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        fontSize: '16px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)',
                      }}
                    />
                  </div>

                  <button
                    style={{
                      background: 'linear-gradient(135deg, #2d3748, #1a202c)',
                      color: 'white',
                      padding: '16px 24px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 24px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                  >
                    Sign In
                  </button>

                  <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <a
                      href='#'
                      style={{
                        color: '#2d3748',
                        fontSize: '14px',
                        textDecoration: 'none',
                      }}
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                }}
              >
                Driver Dashboard
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Welcome to your personal driver dashboard. Here you can view
                your current assignments, track your performance, and manage
                your schedule.
              </p>
            </div>
          )}

          {activeTab === 'pallet-scan' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <div className='mb-6'>
                <h2 className='mb-2 text-3xl font-bold text-gray-800'>
                  📦 Pallet Scanning System
                </h2>
                <p className='text-gray-600'>
                  Scan pallets at crossdocks and delivery locations for
                  real-time shipment visibility
                </p>
              </div>

              {/* Current Load Selection */}
              <div className='mb-6 rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
                <h3 className='mb-4 text-xl font-semibold text-white'>
                  Select Current Load
                </h3>
                <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <select className='rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-gray-300 focus:border-blue-500 focus:outline-none'>
                    <option value=''>Select Load ID</option>
                    <option value='MKT-001'>MKT-001 - Dallas to Houston</option>
                    <option value='MKT-002'>
                      MKT-002 - Austin to San Antonio
                    </option>
                    <option value='MKT-003'>MKT-003 - Fort Worth to OKC</option>
                  </select>
                  <select className='rounded-lg border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-gray-300 focus:border-blue-500 focus:outline-none'>
                    <option value=''>Current Location</option>
                    <option value='crossdock'>🏭 Crossdock (Loading)</option>
                    <option value='delivery'>📍 Delivery Location</option>
                  </select>
                </div>

                {/* Important Notice */}
                <div className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-4'>
                  <div className='flex items-start gap-3'>
                    <span className='text-xl text-blue-400'>ℹ️</span>
                    <div>
                      <h4 className='mb-2 font-medium text-blue-200'>
                        MARKETPLACE BIDDING Requirement
                      </h4>
                      <p className='text-sm text-blue-300'>
                        All MARKETPLACE BIDDING LTL drivers are required to scan
                        pallets in and out at every touchpoint to improve
                        shipment visibility and accuracy. Scan all pallets into
                        your trailer before departing from crossdocks and scan
                        pallets off at delivery locations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pallet Scanning Component */}
              <div className='rounded-lg bg-white/5 p-6 backdrop-blur-lg'>
                <PalletScanningSystem
                  loadId='MKT-001'
                  driverId='DRV-12345'
                  currentLocation='crossdock'
                  workflowMode='loading'
                  onScanComplete={(scan) => {
                    console.log('Crossdock scan completed:', scan);
                    // Handle scan completion - update load status, send real-time notifications
                  }}
                  onWorkflowComplete={(summary) => {
                    console.log('Crossdock workflow completed:', summary);
                    // Handle workflow completion - notify dispatch, update load status
                    alert(
                      `✅ Crossdock loading completed!\nScanned: ${summary.totalScanned}/${summary.totalExpected} pallets\nReady to depart!`
                    );
                  }}
                />
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                }}
              >
                Assigned Routes
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                View your current and upcoming route assignments, including
                pickup and delivery locations, times, and special instructions.
              </p>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                }}
              >
                Schedule
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Manage your driving schedule, view upcoming shifts, and request
                time off.
              </p>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                }}
              >
                Documents
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Access important documents including your license,
                certifications, safety records, and company policies.
              </p>
            </div>
          )}

          {activeTab === 'marketplace' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: '#2d3748',
                  textAlign: 'center',
                  marginBottom: '32px',
                }}
              >
                🎯 Marketplace Load Opportunities & Bidding
              </h2>

              {/* Live Bidding Activity Dashboard */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                  marginBottom: '32px',
                }}
              >
                {/* Left Column - Available Opportunities */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#2d3748',
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🎯 Available Load Opportunities
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {/* Available loads for bidding */}
                    {[
                      {
                        id: 'MKT-001',
                        route: 'Dallas, TX → Houston, TX',
                        equipment: 'Sprinter Van',
                        rate: '$420',
                        urgency: 'HIGH',
                        aiRecommendation: '87%',
                        status: 'AVAILABLE',
                        timeRemaining: '3h 45min',
                      },
                      {
                        id: 'MKT-002',
                        route: 'Austin, TX → San Antonio, TX',
                        equipment: 'Box Truck (24ft)',
                        rate: '$485',
                        urgency: 'MEDIUM',
                        aiRecommendation: '92%',
                        status: 'AVAILABLE',
                        timeRemaining: '1h 22min',
                      },
                      {
                        id: 'MKT-003',
                        route: 'Fort Worth, TX → Oklahoma City, OK',
                        equipment: 'Cargo Van',
                        rate: '$320',
                        urgency: 'HIGH',
                        aiRecommendation: '78%',
                        status: 'EXPIRING SOON',
                        timeRemaining: '32min',
                      },
                    ].map((load, index) => (
                      <div
                        key={load.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '12px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: '600',
                              color: '#2d3748',
                              fontSize: '14px',
                            }}
                          >
                            {load.id}
                          </span>
                          <span
                            style={{
                              background:
                                load.status === 'AVAILABLE'
                                  ? '#10b981'
                                  : load.status === 'EXPIRING SOON'
                                    ? '#f59e0b'
                                    : '#ef4444',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {load.status}
                          </span>
                        </div>
                        <div style={{ color: '#374151', fontSize: '14px' }}>
                          <strong>{load.route}</strong>
                        </div>
                        <div
                          style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        >
                          {load.equipment} • {load.rate} • {load.urgency}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '8px',
                          }}
                        >
                          <span style={{ color: '#3b82f6' }}>
                            ⏰ {load.timeRemaining} left
                          </span>
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        >
                          🤖 AI Rec: {load.aiRecommendation} match
                        </div>
                        <div
                          style={{
                            marginTop: '12px',
                            display: 'flex',
                            gap: '8px',
                          }}
                        >
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              flex: 1,
                            }}
                            onClick={() =>
                              alert(`Manual bid submission for ${load.id}`)
                            }
                          >
                            🎯 Place Bid
                          </button>
                          <button
                            style={{
                              background: 'rgba(255, 255, 255, 0.6)',
                              color: '#374151',
                              border: '1px solid rgba(255, 255, 255, 0.4)',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                            onClick={() => alert(`View details for ${load.id}`)}
                          >
                            📋 Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column - My Bids */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#2d3748',
                      fontSize: '20px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📊 My Bids & Results
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {/* My submitted bids */}
                    {[
                      {
                        id: 'MKT-001',
                        myBid: '$415',
                        result: 'WON',
                        profitMargin: '16.8%',
                        timestamp: '2 min ago',
                        color: '#10b981',
                        route: 'Dallas → Houston',
                      },
                      {
                        id: 'MKT-002',
                        myBid: '$480',
                        result: 'PENDING',
                        profitMargin: '14.2%',
                        timestamp: '5 min ago',
                        color: '#f59e0b',
                        route: 'Austin → San Antonio',
                      },
                      {
                        id: 'MKT-785',
                        myBid: '$380',
                        result: 'OUTBID',
                        profitMargin: '12.5%',
                        timestamp: '12 min ago',
                        color: '#ef4444',
                        route: 'Houston → Dallas',
                      },
                    ].map((bid, index) => (
                      <div
                        key={bid.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                          borderRadius: '12px',
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontWeight: '600',
                              color: '#2d3748',
                              fontSize: '14px',
                            }}
                          >
                            {bid.id}
                          </span>
                          <span
                            style={{
                              background: bid.color,
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {bid.result}
                          </span>
                        </div>
                        <div style={{ color: '#374151', fontSize: '14px' }}>
                          <span style={{ color: '#2d3748' }}>
                            My Bid: <strong>{bid.myBid}</strong>
                          </span>
                        </div>
                        <div
                          style={{
                            color: '#94a3b8',
                            fontSize: '12px',
                            marginBottom: '4px',
                          }}
                        >
                          {bid.route}
                        </div>
                        <div
                          style={{
                            color: '#94a3b8',
                            fontSize: '12px',
                          }}
                        >
                          {bid.timestamp}
                        </div>
                        <div
                          style={{
                            color: '#10b981',
                            fontSize: '12px',
                            marginTop: '4px',
                            fontWeight: '600',
                          }}
                        >
                          Profit: {bid.profitMargin}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Section - Controls & Activity */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '24px',
                }}
              >
                {/* AI Settings */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#2d3748',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    🎛️ AI Bidding Assistant Settings
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <label
                      style={{
                        display: 'block',
                        color: '#374151',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      AI Recommendation Level
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(255, 255, 255, 0.6)',
                        color: '#374151',
                      }}
                    >
                      <option>Conservative (Show safe bids)</option>
                      <option selected>
                        Balanced (Show good opportunities)
                      </option>
                      <option>Aggressive (Show all opportunities)</option>
                    </select>
                  </div>

                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                    onClick={() =>
                      alert(
                        'AI Assistant settings updated! Recommendations will adjust based on your preferences.'
                      )
                    }
                  >
                    💾 Update AI Settings
                  </button>

                  {/* Performance Stats */}
                  <div
                    style={{
                      marginTop: '24px',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        label: 'My Win Rate',
                        value: '68%',
                        color: '#10b981',
                        icon: '🏆',
                      },
                      {
                        label: 'My Avg Margin',
                        value: '15.8%',
                        color: '#3b82f6',
                        icon: '💰',
                      },
                    ].map((stat, index) => (
                      <div
                        key={stat.label}
                        style={{
                          background: 'rgba(255, 255, 255, 0.4)',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                          {stat.icon}
                        </div>
                        <div
                          style={{
                            color: stat.color,
                            fontSize: '18px',
                            fontWeight: '700',
                          }}
                        >
                          {stat.value}
                        </div>
                        <div
                          style={{
                            color: '#6b7280',
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Feed */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '24px',
                  }}
                >
                  <h3
                    style={{
                      color: '#2d3748',
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '16px',
                      textAlign: 'center',
                    }}
                  >
                    📡 My Bidding Activity Feed
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {/* My activity feed */}
                    {[
                      {
                        time: '14:23',
                        message:
                          '🆕 New opportunity available: MKT-892 (Cargo Van)',
                        type: 'new',
                      },
                      {
                        time: '14:22',
                        message:
                          '✅ Your bid on MKT-001 WON! Load added to your schedule.',
                        type: 'win',
                      },
                      {
                        time: '14:21',
                        message: '📤 You placed a bid on MKT-002 for $480',
                        type: 'bid',
                      },
                      {
                        time: '14:20',
                        message:
                          '🤖 AI found 4 new load opportunities matching your preferences',
                        type: 'eval',
                      },
                      {
                        time: '14:19',
                        message: '🔍 Scanning for new load opportunities...',
                        type: 'scrape',
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.3)',
                          borderRadius: '8px',
                          fontSize: '13px',
                        }}
                      >
                        <span style={{ color: '#374151', flex: 1 }}>
                          {activity.message}
                        </span>
                        <span style={{ color: '#6b7280', minWidth: '45px' }}>
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <h2
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#2d3748',
                  margin: '0 0 24px 0',
                }}
              >
                Performance
              </h2>
              <p style={{ color: '#4a5568', fontSize: '16px' }}>
                Track your driving performance, safety scores, fuel efficiency,
                and delivery metrics.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
