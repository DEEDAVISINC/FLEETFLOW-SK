'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import StickyNote from '../components/StickyNote-Enhanced';
import { getCurrentUser } from '../config/access';
import { getLoadsForUser, getLoadStats, updateLoad, Load } from '../services/loadService';
import InvoiceCreationModal from '../components/InvoiceCreationModal';
import { hasExistingInvoice, getAllInvoices, getInvoiceStats } from '../services/invoiceService';

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
  email: 'sarah.johnson@fleetflow.com',
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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedLoadForInvoice, setSelectedLoadForInvoice] = useState<Load | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceStats, setInvoiceStats] = useState({ counts: { total: 0, pending: 0, sent: 0, paid: 0, overdue: 0 }, amounts: { total: 0, pending: 0, paid: 0 } });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userLoads = getLoadsForUser();
      setLoads(userLoads);
      
      const loadStats = getLoadStats();
      setStats(loadStats);
      
      // Load invoices
      const allInvoices = getAllInvoices();
      setInvoices(allInvoices);
      
      const stats = getInvoiceStats();
      setInvoiceStats(stats);
    }
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleCreateInvoice = (load: Load) => {
    setSelectedLoadForInvoice(load);
    setShowInvoiceModal(true);
  };

  const handleInvoiceCreated = (invoiceId: string) => {
    // Update load status or add notification
    setNotifications(prev => [{
      id: Date.now().toString(),
      message: `Invoice ${invoiceId} created successfully for load ${selectedLoadForInvoice?.id}`,
      timestamp: 'Just now',
      type: 'system_alert',
      read: false
    }, ...prev]);
    
    setShowInvoiceModal(false);
    setSelectedLoadForInvoice(null);
    
    // Refresh invoices
    const allInvoices = getAllInvoices();
    setInvoices(allInvoices);
    
    const stats = getInvoiceStats();
    setInvoiceStats(stats);
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

        {/* Notes & Communication Hub */}
        <div style={{ marginBottom: '32px' }}>
          <StickyNote 
            section="dispatch" 
            entityId="dispatch-central" 
            entityName="Dispatch Central" 
            entityType="dispatcher"
            isNotificationHub={true}
          />
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
              { id: 'tracking', label: '🗺️ Live Tracking', icon: '🗺️' },
              { id: 'invoices', label: '🧾 Invoices', icon: '🧾' },
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
                            
                            {/* Create Invoice Button for loads with assigned drivers */}
                            {(load.status === 'Assigned' || load.status === 'In Transit' || load.status === 'Delivered') && (
                              <div style={{ marginTop: '8px' }}>
                                {hasExistingInvoice(load.id) ? (
                                  <div style={{
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    border: '1px solid #d1d5db',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    display: 'inline-block'
                                  }}>
                                    ✅ Invoice Created
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleCreateInvoice(load)}
                                    style={{
                                      background: '#10b981',
                                      color: 'white',
                                      border: 'none',
                                      padding: '6px 12px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.background = '#059669';
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.background = '#10b981';
                                    }}
                                  >
                                    🧾 Create Invoice
                                  </button>
                                )}
                              </div>
                            )}
                            
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

          {selectedTab === 'tracking' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  🗺️ Live Load Tracking
                </h2>
                <Link href="/tracking" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)'
                  }}>
                    🚀 Open Full Tracking Dashboard
                  </button>
                </Link>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '24px',
                marginBottom: '20px'
              }}>
                <h3 style={{ color: '#1f2937', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  📊 Quick Tracking Overview
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#16a34a', fontSize: '24px', fontWeight: 'bold' }}>5</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Active Shipments</div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#2563eb', fontSize: '24px', fontWeight: 'bold' }}>3</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>In Transit</div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>1</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>Delivered Today</div>
                  </div>
                  
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    textAlign: 'center'
                  }}>
                    <div style={{ color: '#d97706', fontSize: '24px', fontWeight: 'bold' }}>95%</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>On-Time Rate</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <h4 style={{ color: '#1f2937', fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                    🚛 Recent Tracking Updates
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{
                      background: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#1f2937', fontWeight: '600' }}>SHP-001 • Swift Transport</span>
                        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>IN TRANSIT</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                        📍 Las Vegas, NV → Chicago, IL • 65% Complete • 65 mph
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#1f2937', fontWeight: '600' }}>SHP-003 • Mountain Freight</span>
                        <span style={{ color: '#2563eb', fontSize: '12px', fontWeight: '600' }}>IN TRANSIT</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                        📍 Seattle, WA → Denver, CO • 30% Complete • 55 mph
                      </div>
                    </div>
                    
                    <div style={{
                      background: 'white',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#1f2937', fontWeight: '600' }}>SHP-002 • Express Logistics</span>
                        <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>DELIVERED</span>
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>
                        📍 New York, NY → Miami, FL • 100% Complete • Delivered 2h ago
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(79, 70, 229, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(79, 70, 229, 0.2)',
                  textAlign: 'center'
                }}>
                  <p style={{ color: '#4f46e5', fontSize: '16px', fontWeight: '600', margin: '0 0 8px 0' }}>
                    💡 Pro Tip: Access Real-Time Interactive Map
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    Click "Open Full Tracking Dashboard" above to view the interactive map with live driver locations, routes, and detailed shipment information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'invoices' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  🧾 Dispatch Invoices
                </h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    padding: '8px 16px', 
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Total: {invoiceStats.counts.total} | Outstanding: ${invoiceStats.amounts.pending.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Invoice Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                {[
                  { label: 'Total Invoices', value: invoiceStats.counts.total, color: '#3b82f6', amount: invoiceStats.amounts.total },
                  { label: 'Pending', value: invoiceStats.counts.pending, color: '#f59e0b', amount: null },
                  { label: 'Sent', value: invoiceStats.counts.sent, color: '#8b5cf6', amount: null },
                  { label: 'Paid', value: invoiceStats.counts.paid, color: '#10b981', amount: invoiceStats.amounts.paid },
                  { label: 'Overdue', value: invoiceStats.counts.overdue, color: '#ef4444', amount: null }
                ].map((stat, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, marginBottom: '8px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
                      {stat.label}
                    </div>
                    {stat.amount !== null && (
                      <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                        ${stat.amount.toLocaleString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Invoices List */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                {invoices.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                    📋 No invoices created yet. Create invoices for assigned loads to get started.
                  </div>
                ) : (
                  <div>
                    {/* Invoice Table Header */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 100px',
                      gap: '16px',
                      padding: '16px 20px',
                      background: '#f8fafc',
                      borderBottom: '1px solid #e5e7eb',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#6b7280',
                      textTransform: 'uppercase'
                    }}>
                      <div>Invoice ID</div>
                      <div>Load Details</div>
                      <div>Carrier</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>

                    {/* Invoice Rows */}
                    {invoices.map((invoice) => (
                      <div key={invoice.id} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr 1fr 1fr 100px',
                        gap: '16px',
                        padding: '16px 20px',
                        borderBottom: '1px solid #e5e7eb',
                        alignItems: 'center',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {invoice.id}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            Load {invoice.loadId}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {invoice.loadDetails?.origin} → {invoice.loadDetails?.destination}
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                          {invoice.carrierName}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                            ${invoice.dispatchFee.toLocaleString()}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {invoice.feePercentage}% of ${invoice.loadAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div style={{
                            display: 'inline-block',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: invoice.status === 'Pending' ? '#fef3c7' :
                                       invoice.status === 'Sent' ? '#dbeafe' :
                                       invoice.status === 'Paid' ? '#d1fae5' : '#fecaca',
                            color: invoice.status === 'Pending' ? '#92400e' :
                                   invoice.status === 'Sent' ? '#1e40af' :
                                   invoice.status === 'Paid' ? '#065f46' : '#991b1b'
                          }}>
                            {invoice.status}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}>
                            📄 View
                          </button>
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
              
              {/* Link to Compliance Dashboard */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link href="/compliance" style={{ textDecoration: 'none' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    <span>✅</span>
                    View Compliance Dashboard
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Invoice Creation Modal */}
      {showInvoiceModal && selectedLoadForInvoice && (
        <InvoiceCreationModal
          load={selectedLoadForInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedLoadForInvoice(null);
          }}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}
    </div>
  );
}
