'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StickyNote from '../../components/StickyNote-Enhanced';
import EnhancedLoadBoard from '../../components/EnhancedLoadBoard';
import CreateLoadForm from '../../components/CreateLoadForm';
import { FreightClassCalculator } from '../../components/FreightClassCalculator';
import { getAvailableDispatchers } from '../../config/access';
import { Load } from '../../services/loadService';
import { useShipper } from '../../contexts/ShipperContext';
import AddShipperForm from '../../components/AddShipperForm';

interface BrokerSession {
  id: string;
  brokerCode: string;
  brokerName: string;
  companyName: string;
  email: string;
  role: string;
  loginTime: string;
  isNewRegistration?: boolean;
}

export default function BrokerDashboard() {
  const [selectedTab, setSelectedTab] = useState('shippers');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddShipper, setShowAddShipper] = useState(false);
  const [brokerSession, setBrokerSession] = useState<BrokerSession | null>(null);
  const router = useRouter();
  const availableDispatchers = getAvailableDispatchers();
  const { shippers, setShippers } = useShipper();

  useEffect(() => {
    // Clear any old sessions that might have "Premium Logistics" 
    const session = localStorage.getItem('brokerSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        // Clear session if it contains old hardcoded company names
        if (parsedSession.companyName === 'Premium Logistics' || 
            parsedSession.companyName === 'Premium Freight' ||
            !parsedSession.companyName) {
          localStorage.removeItem('brokerSession');
        }
      } catch (error) {
        localStorage.removeItem('brokerSession');
      }
    }

    // Check if broker is logged in
    const cleanSession = localStorage.getItem('brokerSession');
    if (!cleanSession) {
      // Get current user from access system
      const { user } = require('../../config/access').getCurrentUser();
      if (user.role === 'broker') {
        const demoSession = {
          id: user.id,
          brokerCode: user.brokerId || 'BR001',
          brokerName: user.name,
          companyName: user.companyName || 'Your Company',
          email: user.email,
          role: 'broker',
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('brokerSession', JSON.stringify(demoSession));
        setBrokerSession(demoSession);
      } else {
        router.push('/broker');
      }
      return;
    }

    try {
      const parsedSession = JSON.parse(cleanSession);
      setBrokerSession(parsedSession);
    } catch (error) {
      console.error('Invalid session data');
      localStorage.removeItem('brokerSession');
      router.push('/broker');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('brokerSession');
    // Also clear any other broker-related localStorage items
    Object.keys(localStorage).forEach(key => {
      if (key.includes('broker') || key.includes('session')) {
        localStorage.removeItem(key);
      }
    });
    router.push('/broker');
  };

  const handleLoadCreated = (load: Load) => {
    console.log('New load created:', load);
    setShowCreateForm(false);
    // Refresh the load board by switching tabs and back
    setSelectedTab('bids');
    setTimeout(() => setSelectedTab('loads'), 100);
  };

  // Get shippers assigned to this broker
  const myShippers = shippers.filter(shipper => 
    shipper.assignedBrokerId === brokerSession?.id || 
    shipper.assignedBrokerId === brokerSession?.brokerCode
  );

  if (!brokerSession) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          🔐 Verifying broker credentials...
        </div>
      </div>
    );
  }

  // Find current dispatcher if assigned
  const currentDispatcher = availableDispatchers.find(d => d.id === brokerSession.id.replace('broker-', 'disp-'));

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Navigation Header */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Back to Main Dashboard
          </button>
          
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Broker Profile Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            👤 {brokerSession.brokerName}
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)', 
            margin: '0 0 8px 0' 
          }}>
            Broker at {brokerSession.companyName}
          </p>
          <p style={{ 
            fontSize: '16px', 
            color: 'rgba(255,255,255,0.7)', 
            margin: '0 0 16px 0' 
          }}>
            Code: {brokerSession.brokerCode}
          </p>
          
          {/* Broker Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginTop: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>� Broker</div>
              <div style={{ fontWeight: '600', color: 'white' }}>{brokerSession.brokerName}</div>
              <div style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>{brokerSession.email}</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>🏢 Company</div>
              <div style={{ fontWeight: '600', color: 'white' }}>{brokerSession.companyName}</div>
              <div style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>Brokerage Firm</div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>🏢 My Shippers</div>
              <div style={{ fontWeight: '600', color: 'white', fontSize: '24px' }}>{myShippers.length}</div>
              <div style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>Active Accounts</div>
            </div>

            {currentDispatcher ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>📋 Assigned Dispatcher</div>
                <div style={{ fontWeight: '600', color: 'white' }}>{currentDispatcher.name}</div>
                <div style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>{currentDispatcher.email}</div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255, 193, 7, 0.2)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 193, 7, 0.4)'
              }}>
                <div style={{ fontSize: '14px', color: 'white' }}>⚠️ No Dispatcher Assigned</div>
                <div style={{ fontSize: '12px', opacity: 0.8, color: 'white' }}>Contact management</div>
              </div>
            )}
          </div>
        </div>

        {/* Broker Notes & Communication Hub */}
        <div style={{ marginBottom: '32px' }}>
          <StickyNote 
            section="broker" 
            entityId={`broker-${brokerSession?.brokerCode || 'unknown'}`} 
            entityName={`${brokerSession?.brokerName} (${brokerSession?.companyName})`} 
            entityType="broker"
            isNotificationHub={true}
          />
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            paddingBottom: '16px'
          }}>
            {[
              { id: 'shippers', label: 'My Shippers', icon: '🏢' },
              { id: 'loads', label: 'My Loads', icon: '📦' },
              { id: 'tracking', label: 'Live Tracking', icon: '🗺️' },
              { id: 'bids', label: 'Active Bids', icon: '💰' },
              { id: 'tools', label: 'Broker Tools', icon: '🛠️' },
              { id: 'analytics', label: 'Analytics', icon: '📊' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  background: selectedTab === tab.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (selectedTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseOut={(e) => {
                  if (selectedTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === 'shippers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: '600', 
                  color: 'white',
                  margin: 0
                }}>
                  🏢 My Shippers ({myShippers.length})
                </h2>
                <button
                  onClick={() => setShowAddShipper(true)}
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  ➕ Add New Shipper
                </button>
              </div>

              {myShippers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', color: 'white' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.7 }}>🏢</div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px', opacity: 0.9 }}>No Shippers Yet</h3>
                  <p style={{ opacity: 0.7, marginBottom: '24px' }}>Start building your portfolio by adding your first shipper</p>
                  <button
                    onClick={() => setShowAddShipper(true)}
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    ➕ Add Your First Shipper
                  </button>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: '16px'
                }}>
                  {myShippers.map((shipper) => (
                    <div
                      key={shipper.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      }}
                      onClick={() => router.push('/shippers')}
                    >
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: 'white', 
                        marginBottom: '8px',
                        wordBreak: 'break-word'
                      }}>
                        {shipper.companyName}
                      </h3>
                      <p style={{ 
                        color: 'rgba(255, 255, 255, 0.8)', 
                        fontSize: '14px',
                        marginBottom: '12px'
                      }}>
                        {shipper.contacts?.[0]?.name} • {shipper.contacts?.[0]?.email}
                      </p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.7)'
                      }}>
                        <span>💼 {shipper.totalLoads || 0} loads</span>
                        <span style={{
                          background: shipper.status === 'active' ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 193, 7, 0.3)',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          color: 'white'
                        }}>
                          {shipper.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedTab === 'loads' && (
            <div>
              {/* Create Load Button */}
              <div style={{ marginBottom: '24px' }}>
                <button
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(76, 175, 80, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
                  }}
                >
                  ➕ Create New Load
                </button>
              </div>
              
              {/* Create Load Modal */}
              {showCreateForm && (
                <div style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 50,
                  padding: '16px'
                }}>
                  <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    maxWidth: '1024px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    <CreateLoadForm 
                      onLoadCreated={handleLoadCreated}
                      onCancel={() => setShowCreateForm(false)}
                    />
                  </div>
                </div>
              )}
              
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                padding: '24px'
              }}>
                <EnhancedLoadBoard />
              </div>
            </div>
          )}

          {selectedTab === 'tracking' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px' 
              }}>
                <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                  🗺️ Live Load Tracking
                </h2>
                <Link href="/tracking" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 28px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
                  }}>
                    🚀 Open Full Tracking Dashboard
                  </button>
                </Link>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '32px',
                marginBottom: '24px'
              }}>
                <h3 style={{ color: '#1f2937', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                  📊 Your Shipment Overview
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '20px',
                  marginBottom: '32px'
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(52, 211, 153, 0.3)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>7</div>
                    <div style={{ fontSize: '16px', opacity: 0.9 }}>Active Shipments</div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(96, 165, 250, 0.3)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>4</div>
                    <div style={{ fontSize: '16px', opacity: 0.9 }}>In Transit</div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>2</div>
                    <div style={{ fontSize: '16px', opacity: 0.9 }}>Delivered Today</div>
                  </div>
                  
                  <div style={{
                    background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
                    padding: '20px',
                    borderRadius: '16px',
                    color: 'white',
                    textAlign: 'center',
                    boxShadow: '0 8px 25px rgba(167, 139, 250, 0.3)'
                  }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>97%</div>
                    <div style={{ fontSize: '16px', opacity: 0.9 }}>On-Time Rate</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{ color: '#1f2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                    🚛 Your Recent Shipment Updates
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#1f2937', fontWeight: '700', fontSize: '16px' }}>Load BR-001 • Broker: {brokerSession?.brokerName || 'Your Name'}</span>
                        <span style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>IN TRANSIT</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                        📍 Los Angeles, CA → Chicago, IL
                      </div>
                      <div style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                        Progress: 68% • Speed: 67 mph • ETA: 14 hours
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#1f2937', fontWeight: '700', fontSize: '16px' }}>Load BR-003 • Broker: {brokerSession?.brokerName || 'Your Name'}</span>
                        <span style={{ 
                          background: 'linear-gradient(135d, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>IN TRANSIT</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                        📍 Seattle, WA → Denver, CO
                      </div>
                      <div style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                        Progress: 32% • Speed: 58 mph • ETA: 22 hours
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#1f2937', fontWeight: '700', fontSize: '16px' }}>Load BR-002 • Swift Transport</span>
                        <span style={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>DELIVERED</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '4px' }}>
                        📍 New York, NY → Miami, FL
                      </div>
                      <div style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                        Completed 3 hours ago • On-time delivery ✅
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '20px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontSize: '18px',
                    fontWeight: '700',
                    margin: '0 0 12px 0' 
                  }}>
                    💡 Real-Time Tracking Available
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '15px', margin: 0, lineHeight: 1.5 }}>
                    Click "Open Full Tracking Dashboard" to access the interactive map with live driver locations, 
                    detailed route information, and real-time shipment monitoring for all your loads.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'bids' && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.7 }}>💰</div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
                Active Bids
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px' }}>
                No active bids at the moment
              </p>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                Bids will appear here when carriers respond to your loads
              </p>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '24px' 
              }}>
                📊 Broker Analytics
              </h2>
              
              {/* Quick Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>0</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Total Loads</div>
                </div>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>$0</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Revenue</div>
                </div>
                <div style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(245, 158, 11, 0.3)'
                }}>
                  <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>0%</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Success Rate</div>
                </div>
                <div style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                  <div style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>{myShippers.length}</div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px' }}>Active Shippers</div>
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '16px', opacity: 0.7 }}>📈</div>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '18px', marginBottom: '8px' }}>
                  Analytics will populate as you create loads
                </p>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '14px' }}>
                  Track your performance, revenue, and shipper relationships
                </p>
              </div>
            </div>
          )}

          {selectedTab === 'tools' && (
            <div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: 'white', 
                marginBottom: '24px' 
              }}>
                🛠️ Broker Tools
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                {/* Freight Class Calculator */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <FreightClassCalculator
                    embedded={false}
                    title="Freight Class Calculator"
                  />
                </div>

                {/* Quick Actions */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>
                    ⚡ Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <button
                      onClick={() => router.push('/nmfta')}
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🔍</span>
                      SCAC Code Lookup & Application
                    </button>
                    <button
                      onClick={() => router.push('/broker-operations')}
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>📋</span>
                      RFx Response System
                    </button>
                    <button
                      onClick={() => router.push('/routes')}
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>🗺️</span>
                      Route Optimization
                    </button>
                    <button
                      onClick={() => router.push('/quoting')}
                      style={{
                        padding: '12px 16px',
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <span>💰</span>
                      Quote Generator
                    </button>
                  </div>
                </div>

                {/* Integration Links */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  gridColumn: 'span 2'
                }}>
                  <h3 style={{ color: 'white', marginBottom: '20px', fontSize: '18px' }}>
                    🔗 Integration Links
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        Financial Markets
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Real-time market data
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        EDI Integration
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Direct carrier connections
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🌐</div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        FreightFlow Network
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Access freight networks
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      padding: '16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎯</div>
                      <div style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                        Quantium Route
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                        Advanced optimization
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Shipper Modal */}
        {showAddShipper && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '16px'
          }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              <AddShipperForm 
                onClose={() => setShowAddShipper(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
