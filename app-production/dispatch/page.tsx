'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import InvoiceCreationModal from '../components/InvoiceCreationModal';
import NotableItem from '../components/NotableItem';
import StickyNote from '../components/StickyNote-Enhanced';
import { InfoTooltip, Tooltip } from '../components/ui/tooltip';
import { getCurrentUser } from '../config/access';
import { getAllInvoices, getInvoiceStats, hasExistingInvoice } from '../services/invoiceService';
import { getDispatcherLoads, getLoadStats, Load } from '../services/loadService';
import { getTooltipContent } from '../utils/tooltipContent';

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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedLoadForInvoice, setSelectedLoadForInvoice] = useState<Load | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceStats, setInvoiceStats] = useState({ counts: { total: 0, pending: 0, sent: 0, paid: 0, overdue: 0 }, amounts: { total: 0, pending: 0, paid: 0 } });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Get loads assigned to this dispatcher from broker board
      const dispatcherLoads = getDispatcherLoads(currentUser.id);
      setLoads(dispatcherLoads);

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
      background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
      padding: '25px',
      paddingTop: '100px',
            color: 'white',
          textAlign: 'center'
        }}>
          <h1 style={{
        fontSize: '2.5rem',
            fontWeight: 'bold',
        marginBottom: '15px',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
        color: 'white'
          }}>
            🚛 DISPATCH CENTRAL
          </h1>

          <p style={{
        fontSize: '1.1rem',
        marginBottom: '25px',
        opacity: 0.9
          }}>
            Professional Load Management & Real-time Dispatch Operations - {user?.name || 'System Admin'}
          </p>

        {/* Quick Stats */}
        <div style={{
          display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px',
        marginBottom: '25px'
        }}>
          {[
            { label: 'Active Loads', value: dispatcher.activeLoads, color: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '📋' },
            { label: 'Efficiency Rate', value: `${dispatcher.efficiency}%`, color: 'linear-gradient(135deg, #10b981, #059669)', icon: '⚡' },
            { label: 'Avg Response', value: dispatcher.avgResponseTime, color: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⏱️' },
            { label: 'Experience', value: dispatcher.experience, color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', icon: '🏆' },
            { label: 'Unread Alerts', value: notifications.filter(n => !n.read).length, color: 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '🔔' }
          ].map((stat, index) => (
            <div key={index} style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            padding: '18px',
              textAlign: 'center',
            border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
              <div style={{
                background: stat.color,
                color: 'white',
              fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '12px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
              }}>
                <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>
                  {stat.icon}
                </div>
                <div>{stat.value}</div>
              </div>
              <div style={{
              fontSize: '13px',
                fontWeight: '600',
              color: 'white'
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Notes & Communication Hub */}
      <div style={{ marginBottom: '20px' }}>
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
        background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
        borderRadius: '12px',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        padding: '15px',
        marginBottom: '20px'
        }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
                padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: selectedTab === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.2)',
                  color: selectedTab === tab.id ? '#1f2937' : 'white',
                  boxShadow: selectedTab === tab.id
                  ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                  : 'none',
                border: selectedTab === tab.id ? '2px solid rgba(255, 255, 255, 0.5)' : '2px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {selectedTab === 'dashboard' && (
            <div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>
                📊 Operations Dashboard
              </h2>
              <div style={{
                display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
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
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  padding: '20px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                >
                    <div style={{
                    fontSize: '28px',
                      fontWeight: 'bold',
                      color: item.color,
                      marginBottom: '8px'
                    }}>
                      {item.value}
                    </div>
                    <div style={{
                    fontSize: '14px',
                      fontWeight: '600',
                    color: 'white',
                      marginBottom: '4px'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                    fontSize: '12px',
                    color: item.trend.includes('+') ? '#22c55e' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {item.trend} from last week
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* General Loadboard - All Brokers */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '15px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
          padding: '20px',
          marginTop: '25px',
          marginBottom: '25px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
              🌐 General Loadboard - All Brokers
            </h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search all loads..."
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                  width: '200px',
                  backdropFilter: 'blur(10px)'
                }}
              />
              <button style={{
                padding: '8px 12px',
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}>
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Loadboard Content */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            {/* Loadboard Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '90px 80px 1.5fr 1fr 120px 100px 100px 100px 120px',
              gap: '10px',
              padding: '12px 15px',
              background: 'rgba(0, 0, 0, 0.6)',
              fontWeight: '700',
              color: '#9ca3af',
              fontSize: '11px',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div>📞 Board #</div>
              <div>Load ID</div>
              <div>Route</div>
              <div>Broker</div>
              <div>Rate</div>
              <div>Status</div>
              <div>Distance</div>
              <div>Type</div>
              <div>Actions</div>
            </div>

            {/* Sample Load Rows - All Brokers */}
            {[
              { id: 'L-001', loadBoardNumber: '1001', origin: 'Los Angeles, CA', destination: 'Phoenix, AZ', broker: 'Mike Johnson', rate: 2800, status: 'Available', distance: '372', type: 'Dry Van', dispatcher: 'Mike Johnson' },
              { id: 'L-002', loadBoardNumber: '1002', origin: 'Chicago, IL', destination: 'Dallas, TX', broker: 'Sarah Wilson', rate: 3200, status: 'Assigned', distance: '925', type: 'Reefer', dispatcher: 'Sarah Wilson' },
              { id: 'L-003', loadBoardNumber: '1003', origin: 'Miami, FL', destination: 'Atlanta, GA', broker: 'Tom Davis', rate: 1800, status: 'In Transit', distance: '661', type: 'Flatbed', dispatcher: 'Tom Davis' },
              { id: 'L-004', loadBoardNumber: '1004', origin: 'Seattle, WA', destination: 'Portland, OR', broker: 'Lisa Chen', rate: 1200, status: 'Available', distance: '173', type: 'Dry Van', dispatcher: 'Lisa Chen' },
              { id: 'L-005', loadBoardNumber: '1005', origin: 'Denver, CO', destination: 'Salt Lake City, UT', broker: 'James Brown', rate: 1500, status: 'Delivered', distance: '371', type: 'Reefer', dispatcher: 'James Brown' },
              { id: 'L-006', loadBoardNumber: '1006', origin: 'Houston, TX', destination: 'New Orleans, LA', broker: 'Maria Garcia', rate: 2200, status: 'Available', distance: '348', type: 'Dry Van', dispatcher: 'Maria Garcia' },
              { id: 'L-007', loadBoardNumber: '1007', origin: 'Detroit, MI', destination: 'Cleveland, OH', broker: 'David Miller', rate: 1600, status: 'Assigned', distance: '169', type: 'Flatbed', dispatcher: 'David Miller' },
              { id: 'L-008', loadBoardNumber: '1008', origin: 'Boston, MA', destination: 'New York, NY', broker: 'Jennifer Lee', rate: 1400, status: 'In Transit', distance: '215', type: 'Dry Van', dispatcher: 'Jennifer Lee' }
            ].map((load, index) => (
              <div key={load.id} style={{
                display: 'grid',
                gridTemplateColumns: '90px 80px 1.5fr 1fr 120px 100px 100px 100px 120px',
                gap: '10px',
                padding: '10px 15px',
                background: index % 2 === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                color: '#e5e7eb',
                fontSize: '12px',
                transition: 'all 0.3s ease',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = index % 2 === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              >
                <div style={{
                  fontWeight: '700',
                  color: '#10b981',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '4px',
                  padding: '2px 4px'
                }}>
                  {load.loadBoardNumber}
                </div>
                <div style={{ fontWeight: '700', color: '#60a5fa' }}>#{load.id}</div>
                <div>
                  <div style={{ fontWeight: '600' }}>{load.origin}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>→ {load.destination}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '500' }}>{load.broker}</div>
                <div className="flex items-center">
                  <span style={{ fontWeight: '700', color: '#22c55e', fontSize: '13px' }}>${load.rate?.toLocaleString()}</span>
                  <InfoTooltip
                    content={getTooltipContent('dispatch', 'rateCalculation')}
                    theme="dispatch"
                  />
                </div>
                <div>
                  <Tooltip
                    content={getTooltipContent('dispatch', 'loadStatus', load.status)}
                    theme="dispatch"
                    position="top"
                  >
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background:
                        load.status === 'Available' ? 'rgba(34, 197, 94, 0.3)' :
                        load.status === 'Assigned' ? 'rgba(245, 158, 11, 0.3)' :
                        load.status === 'In Transit' ? 'rgba(59, 130, 246, 0.3)' :
                        load.status === 'Delivered' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                      color:
                        load.status === 'Available' ? '#22c55e' :
                        load.status === 'Assigned' ? '#f59e0b' :
                        load.status === 'In Transit' ? '#3b82f6' :
                        load.status === 'Delivered' ? '#22c55e' : '#6b7280',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'help'
                    }}>
                      {load.status}
                    </span>
                  </Tooltip>
                </div>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#f59e0b' }}>{load.distance} mi</div>
                <div style={{ fontSize: '11px', fontWeight: '500', color: '#a78bfa' }}>{load.type}</div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button style={{
                    padding: '3px 6px',
                    background: 'rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '9px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}>
                    👁️ View
                  </button>
                  {load.status === 'Available' && (
                    <button style={{
                      padding: '3px 6px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}>
                      📋 Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

          {selectedTab === 'loads' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px'
              }}>
              <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', margin: 0 }}>
                  📋 Load Management
                </h2>
                <input
                  type="text"
                  placeholder="Search loads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                  padding: '15px 20px',
                  borderRadius: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                  width: '300px',
                  backdropFilter: 'blur(10px)'
                  }}
                />
              </div>

              <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}>
                    + Add Load
                  </button>
                  <button style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.3s ease'
                }}>
                    🤖 AI Match
                  </button>
                </div>
              </div>

                {filteredLoads.length === 0 ? (
                  <div style={{
                  padding: '50px',
                    textAlign: 'center',
                  color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px'
                  }}>
                    🚛 No loads available. Ready for new assignments!
                  </div>
                ) : (
                <div>
                  {/* Load Board Header */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1.5fr 1fr 100px 100px 100px 120px',
                    gap: '8px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    fontWeight: '700',
                    color: '#9ca3af',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <div>Load ID</div>
                    <div>Route</div>
                    <div>Dispatcher</div>
                    <div>Rate</div>
                    <div>Status</div>
                    <div>Distance</div>
                    <div>Actions</div>
                  </div>

                  {/* Load Rows */}
                  {filteredLoads.map((load, index) => (
                      <NotableItem
                        key={load.id}
                        subjectId={load.id}
                        subjectType="load"
                        subjectLabel={`Load ${load.id} - ${load.origin} → ${load.destination}`}
                        department="dispatch"
                      >
                        <div style={{
                        display: 'grid',
                        gridTemplateColumns: '80px 1.5fr 1fr 100px 100px 100px 120px',
                        gap: '8px',
                        padding: '8px 12px',
                        background: index % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        color: '#e5e7eb',
                        fontSize: '11px',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                      >
                      <div style={{ fontWeight: '700', color: '#60a5fa' }}>#{load.id}</div>
                      <div>
                        <div style={{ fontWeight: '600' }}>{load.origin}</div>
                        <div style={{ fontSize: '11px', opacity: 0.7 }}>→ {load.destination}</div>
                            </div>
                      <div style={{ fontSize: '12px' }}>{load.dispatcherName || 'Unassigned'}</div>
                      <div style={{ fontWeight: '700', color: '#22c55e', fontSize: '13px' }}>${load.rate?.toLocaleString()}</div>
                      <div>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                              fontWeight: '600',
                          background:
                            load.status === 'Available' ? 'rgba(34, 197, 94, 0.3)' :
                            load.status === 'Assigned' ? 'rgba(245, 158, 11, 0.3)' :
                            load.status === 'In Transit' ? 'rgba(59, 130, 246, 0.3)' :
                            load.status === 'Delivered' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(107, 114, 128, 0.3)',
                          color:
                            load.status === 'Available' ? '#22c55e' :
                            load.status === 'Assigned' ? '#f59e0b' :
                            load.status === 'In Transit' ? '#3b82f6' :
                            load.status === 'Delivered' ? '#22c55e' : '#6b7280',
                          border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                              {load.status}
                        </span>
                            </div>
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#f59e0b' }}>{load.distance} mi</div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                            {(load.status === 'Assigned' || load.status === 'In Transit' || load.status === 'Delivered') && (
                          hasExistingInvoice(load.id) ? (
                            <span style={{
                              background: 'rgba(34, 197, 94, 0.3)',
                              color: '#22c55e',
                              padding: '4px 8px',
                              borderRadius: '8px',
                              fontSize: '10px',
                                    fontWeight: '600',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                                  }}>
                              ✅ Invoice
                            </span>
                                ) : (
                                  <button
                                    onClick={() => handleCreateInvoice(load)}
                                    style={{
                                padding: '3px 6px',
                                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                      color: 'white',
                                      border: 'none',
                                borderRadius: '4px',
                                      cursor: 'pointer',
                                fontSize: '9px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                                    }}
                                  >
                              🧾 Invoice
                                  </button>
                          )
                            )}
                        </div>
                      </div>
                    </NotableItem>
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
              marginBottom: '24px'
              }}>
              <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                  🗺️ Live Load Tracking
                </h2>
                <Link href="/tracking" style={{ textDecoration: 'none' }}>
                  <button style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                  padding: '10px 20px',
                  borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)'
                  }}>
                    🚀 Open Full Tracking Dashboard
                  </button>
                </Link>
              </div>

            {/* Enhanced Summary Row - Matching Main Tracking Page */}
                <div style={{
                  display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: '16px',
              marginBottom: '24px',
                }}>
                  <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  📦
                </div>
                <div style={{
                  color: '#3b82f6',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                  textAlign: 'center'
                }}>
                  12
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Total Shipments
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  🚛
                </div>
                <div style={{
                  color: '#10b981',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                    textAlign: 'center'
                  }}>
                  8
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  In Transit
                </div>
                  </div>

                  <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  ✅
                </div>
                <div style={{
                  color: '#059669',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                  textAlign: 'center'
                }}>
                  3
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Delivered
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  ⚠️
                </div>
                <div style={{
                  color: '#ef4444',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                    textAlign: 'center'
                  }}>
                  1
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Delayed
                </div>
                  </div>

                  <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  💰
                </div>
                <div style={{
                  color: '#8b5cf6',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                  textAlign: 'center'
                }}>
                  $156K
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Total Value
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  🚨
                </div>
                <div style={{
                  color: '#f59e0b',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                    textAlign: 'center'
                  }}>
                  5
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Alerts
                </div>
                  </div>

                  <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                    padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  ⚡
                </div>
                <div style={{
                  color: '#06b6d4',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                  textAlign: 'center'
                }}>
                  65
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  Avg Speed
                </div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '12px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  fontSize: '1rem'
                }}>
                  📊
                </div>
                <div style={{
                  color: '#84cc16',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  marginBottom: '3px',
                    textAlign: 'center'
                  }}>
                  94%
                </div>
                <div style={{
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  On-Time %
                </div>
                  </div>
                </div>

            {/* Shipment Cards - Matching Main Tracking Page Style */}
                <div style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '20px',
              border: '1px solid rgba(148, 163, 184, 0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span>📋 Recent Shipments (3)</span>
              </div>

              <div style={{ padding: '16px 24px', flex: 1 }}>
                <div style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '0 0 12px 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        SHP-001
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        Swift Transport
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{
                        background: '#2563eb',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        IN TRANSIT
                      </div>
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        HIGH
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      From: Los Angeles, CA
                      </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      To: Chicago, IL
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      ETA: 14 hours
                      </div>
                    </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>Progress</span>
                      <span style={{ fontSize: '0.625rem', color: '#1e293b', fontWeight: 600 }}>65%</span>
                      </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(148, 163, 184, 0.3)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '65%',
                        height: '100%',
                        background: '#2563eb',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} />
                      </div>
                    </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Driver: John Smith
                      </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Vehicle: Freightliner Cascadia - #FL001
                      </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      Speed: 67 mph
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '0 0 12px 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        SHP-002
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        Express Logistics
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        DELIVERED
                      </div>
                      <div style={{
                        background: '#f59e0b',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        MEDIUM
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      From: New York, NY
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      To: Miami, FL
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      ETA: Delivered
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>Progress</span>
                      <span style={{ fontSize: '0.625rem', color: '#1e293b', fontWeight: 600 }}>100%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(148, 163, 184, 0.3)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#10b981',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Driver: Sarah Wilson
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Vehicle: Volvo VNL - #VL002
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      Speed: 0 mph
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  margin: '0 0 12px 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div style={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        color: '#1e293b',
                        marginBottom: '4px'
                      }}>
                        SHP-004
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        Southern Express
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        DELAYED
                      </div>
                      <div style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '0.625rem',
                        fontWeight: 600
                      }}>
                        HIGH
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      From: Houston, TX
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      To: Atlanta, GA
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      ETA: Delayed - Est. 2024-01-16
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px'
                    }}>
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>Progress</span>
                      <span style={{ fontSize: '0.625rem', color: '#1e293b', fontWeight: 600 }}>45%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '4px',
                      background: 'rgba(148, 163, 184, 0.3)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: '45%',
                        height: '100%',
                        background: '#ef4444',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Driver: Emily Davis
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginBottom: '2px'
                    }}>
                      Vehicle: Kenworth T680 - #KW004
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#64748b'
                    }}>
                      Speed: 0 mph
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(59, 130, 246, 0.2)',
                  textAlign: 'center'
                }}>
              <p style={{
                color: '#2563eb',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 8px 0'
              }}>
                💡 Real-Time Tracking Available
                  </p>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, lineHeight: 1.4 }}>
                Click "Open Full Tracking Dashboard" to access the interactive map with live driver locations,
                detailed route information, and real-time shipment monitoring for all your loads.
                  </p>
              </div>
            </div>
          )}

          {selectedTab === 'invoices' && (
            <div>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>
                  🧾 Dispatch Invoices
                </h2>

            {/* Invoice Statistics */}
                  <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '15px',
              marginBottom: '20px'
            }}>
                {[
                { label: 'Total Invoices', value: invoiceStats.counts.total, color: '#3b82f6', icon: '📄' },
                { label: 'Pending', value: invoiceStats.counts.pending, color: '#f59e0b', icon: '⏳' },
                { label: 'Sent', value: invoiceStats.counts.sent, color: '#8b5cf6', icon: '📤' },
                { label: 'Paid', value: invoiceStats.counts.paid, color: '#10b981', icon: '✅' },
                { label: 'Overdue', value: invoiceStats.counts.overdue, color: '#ef4444', icon: '⚠️' }
                ].map((stat, index) => (
                  <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                  padding: '15px',
                    textAlign: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  <div style={{
                    background: stat.color,
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    borderRadius: '8px',
                    padding: '8px',
                    marginBottom: '8px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '2px' }}>
                      {stat.icon}
                    </div>
                    <div>{stat.value}</div>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

            {/* Invoice List */}
              <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '20px',
              border: '2px solid rgba(255, 255, 255, 0.3)'
              }}>
              <h3 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                Invoice Management
              </h3>

                {invoices.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🧾</div>
                  <div style={{ fontSize: '16px', marginBottom: '10px' }}>No invoices created yet</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Create invoices for assigned loads to start tracking dispatch fees
                  </div>
                  </div>
                ) : (
                    <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  borderRadius: '10px'
                }}>
                    {invoices.map((invoice) => (
                      <div key={invoice.id} style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '10px',
                      padding: '15px',
                      marginBottom: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      transition: 'all 0.3s ease'
                      }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '8px'
                          }}>
                            <div style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>
                          {invoice.id}
                        </div>
                          <div style={{
                            padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '10px',
                            fontWeight: '600',
                              background: invoice.status === 'Paid' ? 'rgba(34, 197, 94, 0.2)' :
                                         invoice.status === 'Pending' ? 'rgba(245, 158, 11, 0.2)' :
                                         invoice.status === 'Sent' ? 'rgba(139, 92, 246, 0.2)' :
                                         'rgba(239, 68, 68, 0.2)',
                              color: invoice.status === 'Paid' ? '#22c55e' :
                                     invoice.status === 'Pending' ? '#f59e0b' :
                                     invoice.status === 'Sent' ? '#8b5cf6' :
                                     '#ef4444',
                              border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}>
                            {invoice.status}
                          </div>
                        </div>
                          <div style={{
                            fontSize: '14px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            marginBottom: '4px'
                          }}>
                            {invoice.carrierName} • Load {invoice.loadId}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.7)'
                          }}>
                            Due: {new Date(invoice.dueDate).toLocaleDateString()} • Fee: ${invoice.dispatchFee.toFixed(2)}
                          </div>
                        </div>
                        <div style={{
                          fontSize: '18px',
                          fontWeight: 'bold',
                          color: '#10b981'
                          }}>
                          ${invoice.dispatchFee.toFixed(2)}
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
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>
                🔔 Dispatch Notifications
              </h2>
              <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
                overflow: 'hidden',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
              }}>
              {notifications.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: 'rgba(255, 255, 255, 0.8)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔔</div>
                  <div style={{ fontSize: '16px', marginBottom: '10px' }}>No notifications</div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    All caught up! New notifications will appear here
                  </div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div key={notification.id} style={{
                    padding: '18px 22px',
                    borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
                    background: notification.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                  onClick={() => handleMarkAsRead(notification.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.read ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  >
                    {!notification.read && (
                      <div style={{
                        position: 'absolute',
                        top: '18px',
                        left: '8px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: '#ef4444',
                        boxShadow: '0 0 12px rgba(239, 68, 68, 0.8)',
                        border: '2px solid rgba(255, 255, 255, 0.3)'
                      }} />
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginLeft: notification.read ? '0' : '16px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '15px',
                          fontWeight: notification.read ? '400' : '600',
                          color: 'white',
                          marginBottom: '6px',
                          lineHeight: '1.4'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{
                          fontSize: '13px',
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '500'
                        }}>
                          {notification.timestamp}
                        </div>
                      </div>
                      <div style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '600',
                        background: notification.type === 'load_assignment' ? 'rgba(59, 130, 246, 0.2)' :
                                   notification.type === 'dispatch_update' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        color: notification.type === 'load_assignment' ? '#60a5fa' :
                               notification.type === 'dispatch_update' ? '#22c55e' : '#f59e0b',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {notification.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
              </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
                  <button style={{
            background: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
            border: '2px solid white',
            padding: '15px 30px',
            borderRadius: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
                  }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)'
                  }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
          >
            ← Back to Dashboard
                  </button>
                </Link>
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
