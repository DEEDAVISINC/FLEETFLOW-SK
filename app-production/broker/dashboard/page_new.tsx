'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EnhancedLoadBoard from '../../components/EnhancedLoadBoard';
import CreateLoadForm from '../../components/CreateLoadForm';
import { getAvailableDispatchers } from '../../config/access';
import { Load } from '../../services/loadService';
import { useShipper } from '../../contexts/ShipperContext';
import AddShipperForm from '../../components/AddShipperForm';

interface BrokerSession {
  id: string;
  brokerCode: string;
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
    // Check if broker is logged in
    const session = localStorage.getItem('brokerSession');
    if (!session) {
      // Get current user from access system
      const { user } = require('../../config/access').getCurrentUser();
      if (user.role === 'broker') {
        const demoSession = {
          id: user.id,
          brokerCode: user.brokerId || 'BR001',
          companyName: user.name,
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
      const parsedSession = JSON.parse(session);
      setBrokerSession(parsedSession);
    } catch (error) {
      console.error('Invalid session data');
      router.push('/broker');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('brokerSession');
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
            marginBottom: '12px',
            textShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}>
            🏢 {brokerSession.companyName}
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: 'rgba(255,255,255,0.9)', 
            margin: '0 0 16px 0' 
          }}>
            Broker Portal - Code: {brokerSession.brokerCode}
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
              <div style={{ fontSize: '14px', opacity: 0.8, color: 'white' }}>📧 Contact</div>
              <div style={{ fontWeight: '600', color: 'white' }}>{brokerSession.email}</div>
              <div style={{ fontSize: '12px', opacity: 0.7, color: 'white' }}>Broker Portal Access</div>
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
              { id: 'bids', label: 'Active Bids', icon: '💰' },
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
