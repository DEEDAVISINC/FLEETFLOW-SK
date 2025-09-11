'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../config/access';
import { getLoadsForUser, getLoadStats, updateLoad, Load } from '../services/loadService';

interface DispatcherProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  experience: string;
  activeLoads: number;
  completedLoads: number;
  efficiency: number;
  avgResponseTime: string;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'load_assignment' | 'dispatch_update' | 'system_alert';
  read: boolean;
}

// Mock dispatcher profile
const dispatcher: DispatcherProfile = {
  id: 'disp-001',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@fleetflowapp.com',
  phone: '(555) 123-4567',
  department: 'Operations',
  role: 'Senior Dispatcher',
  experience: '8 years',
  activeLoads: 12,
  completedLoads: 847,
  efficiency: 96,
  avgResponseTime: '3 min'
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'New load FL-001 requires immediate assignment',
    timestamp: '2 minutes ago',
    type: 'load_assignment',
    read: false
  },
  {
    id: '2',
    message: 'Driver John Smith confirmed load TX-002',
    timestamp: '15 minutes ago',
    type: 'dispatch_update',
    read: false
  },
  {
    id: '3',
    message: 'System maintenance scheduled for tonight',
    timestamp: '1 hour ago',
    type: 'system_alert',
    read: true
  }
];

export default function DispatchCentral() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    broadcasted: 0,
    driverSelected: 0,
    orderSent: 0,
    inTransit: 0,
    delivered: 0,
    unassigned: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userLoads = getLoadsForUser(currentUser);
      setLoads(userLoads);
      
      const loadStats = getLoadStats(userLoads);
      setStats(loadStats);
    }
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const filteredLoads = loads.filter(load => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      load.id.toLowerCase().includes(searchLower) ||
      load.origin.toLowerCase().includes(searchLower) ||
      load.destination.toLowerCase().includes(searchLower) ||
      load.status.toLowerCase().includes(searchLower) ||
      (load.dispatcherName && load.dispatcherName.toLowerCase().includes(searchLower))
    );
  });

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
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚛 DISPATCH CENTRAL
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Professional Load Management & Real-time Dispatch Operations - {user?.name || 'System Admin'}
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Active Loads', value: dispatcher.activeLoads, color: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '📋' },
            { label: 'Efficiency Rate', value: `${dispatcher.efficiency}%`, color: 'linear-gradient(135deg, #10b981, #059669)', icon: '⚡' },
            { label: 'Avg Response', value: dispatcher.avgResponseTime, color: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⏱️' },
            { label: 'Experience', value: dispatcher.experience, color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', icon: '🏆' },
            { label: 'Unread Alerts', value: notifications.filter(n => !n.read).length, color: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔔' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
            }}>
              <div style={{
                background: stat.color,
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '12px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '24px',
          marginBottom: '32px'
        }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'loads', label: '📋 Load Management', icon: '📋' },
              { id: 'notifications', label: '🔔 Notifications', icon: '🔔' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: selectedTab === tab.id 
                    ? 'rgba(255, 255, 255, 0.9)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: selectedTab === tab.id ? '#1f2937' : 'white',
                  boxShadow: selectedTab === tab.id 
                    ? '0 4px 15px rgba(0, 0, 0, 0.1)' 
                    : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === 'dashboard' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                📊 Operations Dashboard
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}>
                {[
                  { title: 'Total Loads', value: stats.total, color: '#3b82f6', trend: '+5%' },
                  { title: 'Available Loads', value: stats.available, color: '#10b981', trend: '+12%' },
                  { title: 'Assigned Loads', value: stats.assigned, color: '#f59e0b', trend: '+8%' },
                  { title: 'In Transit', value: stats.inTransit, color: '#8b5cf6', trend: '+3%' },
                  { title: 'Delivered', value: stats.delivered, color: '#059669', trend: '+15%' },
                  { title: 'Unassigned', value: stats.unassigned, color: '#ef4444', trend: '-2%' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{
                      fontSize: '32px',
                      fontWeight: 'bold',
                      color: item.color,
                      marginBottom: '8px'
                    }}>
                      {item.value}
                    </div>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: item.trend.includes('+') ? '#059669' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {item.trend} from last week
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'loads' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  📋 Load Management
                </h2>
                <input
                  type="text"
                  placeholder="Search loads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    width: '300px'
                  }}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  padding: '20px',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  Active Loads ({filteredLoads.length})
                </div>
                {filteredLoads.length === 0 ? (
                  <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '18px'
                  }}>
                    🚛 No loads available. Ready for new assignments!
                  </div>
                ) : (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {filteredLoads.map((load) => (
                      <div key={load.id} style={{
                        padding: '20px',
                        borderBottom: '1px solid #e5e7eb',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: '18px',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              marginBottom: '8px'
                            }}>
                              Load #{load.id}
                            </div>
                            <div style={{
                              fontSize: '14px',
                              color: '#6b7280',
                              marginBottom: '12px'
                            }}>
                              📍 {load.origin} → {load.destination}
                            </div>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                              <span>💰 ${load.rate?.toLocaleString()}</span>
                              <span>📏 {load.distance} miles</span>
                              <span>⚖️ {load.weight?.toLocaleString()} lbs</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{
                              display: 'inline-block',
                              padding: '6px 12px',
                              borderRadius: '20px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: load.status === 'Available' ? '#d1fae5' : 
                                         load.status === 'Assigned' ? '#fef3c7' :
                                         load.status === 'In Transit' ? '#dbeafe' : '#fecaca',
                              color: load.status === 'Available' ? '#065f46' : 
                                     load.status === 'Assigned' ? '#92400e' :
                                     load.status === 'In Transit' ? '#1e40af' : '#991b1b'
                            }}>
                              {load.status}
                            </div>
                            {load.dispatcherName && (
                              <div style={{
                                fontSize: '12px',
                                color: '#6b7280',
                                marginTop: '4px'
                              }}>
                                Dispatcher: {load.dispatcherName}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                🔔 Dispatch Notifications
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={{
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    background: notification.read ? 'transparent' : '#f0f9ff',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: notification.read ? 'normal' : 'bold',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          {notification.timestamp}
                        </div>
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: '600',
                        background: notification.type === 'load_assignment' ? '#dbeafe' :
                                   notification.type === 'dispatch_update' ? '#d1fae5' : '#fef3c7',
                        color: notification.type === 'load_assignment' ? '#1e40af' :
                               notification.type === 'dispatch_update' ? '#065f46' : '#92400e'
                      }}>
                        {notification.type.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
