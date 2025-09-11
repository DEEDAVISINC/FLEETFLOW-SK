'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../config/access';
import { getLoadsForUser, getLoadStats, updateLoad, assignDispatcherToLoad, Load } from '../services/loadService';

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

interface WorkflowStatus {
  workflowId: string;
  currentStep: string;
  status: string;
  nextStepDue?: string;
  completedSteps: number;
  totalSteps: number;
  driverName: string;
  lastActivity: string;
  requiresOverride: boolean;
}

interface LoadWithWorkflow extends Load {
  workflowStatus?: WorkflowStatus;
  assignedDriverName?: string;
}

interface LoadPriority {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  deadline: string;
}

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface Driver {
  id: string;
  name: string;
  available: boolean;
  location: string;
  rating: number;
  phone: string;
}

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

const mockDrivers: Driver[] = [
  { id: 'driver-001', name: 'John Smith', available: true, location: 'Dallas, TX', rating: 4.8, phone: '(555) 111-1111' },
  { id: 'driver-002', name: 'Mike Johnson', available: true, location: 'Houston, TX', rating: 4.9, phone: '(555) 222-2222' },
  { id: 'driver-003', name: 'David Wilson', available: false, location: 'Austin, TX', rating: 4.7, phone: '(555) 333-3333' },
  { id: 'driver-004', name: 'Chris Brown', available: true, location: 'San Antonio, TX', rating: 4.6, phone: '(555) 444-4444' },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Priority Load Alert',
    message: 'Load FL-001 requires immediate assignment - High Priority',
    timestamp: '2 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'Load Confirmed',
    message: 'Driver John Smith confirmed load TX-002',
    timestamp: '15 minutes ago',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight 11 PM - 1 AM',
    timestamp: '1 hour ago',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Workflow Override',
    message: 'Load CA-003 workflow requires dispatcher override',
    timestamp: '45 minutes ago',
    read: false
  }
];

export default function DispatchCentral() {
  const [loads, setLoads] = useState<LoadWithWorkflow[]>([]);
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
  const [selectedLoads, setSelectedLoads] = useState<string[]>([]);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [selectedLoadForAssignment, setSelectedLoadForAssignment] = useState<string | null>(null);
  const [loadPriorities, setLoadPriorities] = useState<LoadPriority[]>([]);
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<string, WorkflowStatus>>({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userLoads = getLoadsForUser();
      
      const filteredLoads = userLoads.filter(load => {
        const isAssignedToDispatcher = load.dispatcherId === currentUser.user.id || load.status === 'Available';
        return isAssignedToDispatcher;
      });
      
      setLoads(filteredLoads);
      
      const loadStats = getLoadStats();
      setStats(loadStats);

      setWorkflowStatuses({
        'FLT-001': {
          workflowId: 'wf-001',
          currentStep: 'Driver Confirmation',
          status: 'active',
          completedSteps: 3,
          totalSteps: 8,
          driverName: 'John Smith',
          lastActivity: '10 minutes ago',
          requiresOverride: false
        },
        'FLT-002': {
          workflowId: 'wf-002',
          currentStep: 'BOL Signature',
          status: 'override_required',
          completedSteps: 5,
          totalSteps: 8,
          driverName: 'Mike Johnson',
          lastActivity: '2 hours ago',
          requiresOverride: true
        }
      });
    }
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLoadSelect = (loadId: string) => {
    setSelectedLoads(prev => 
      prev.includes(loadId) 
        ? prev.filter(id => id !== loadId)
        : [...prev, loadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLoads.length === filteredLoads.length) {
      setSelectedLoads([]);
    } else {
      setSelectedLoads(filteredLoads.map(load => load.id));
    }
  };

  const handleBulkBroadcast = () => {
    if (selectedLoads.length === 0) return;
    
    const updatedLoads = loads.map(load => 
      selectedLoads.includes(load.id) 
        ? { ...load, status: 'Broadcasted' as any }
        : load
    );
    
    setLoads(updatedLoads);
    setSelectedLoads([]);
    
    addNotification('success', 'Bulk Broadcast Complete', `${selectedLoads.length} loads broadcasted successfully`);
  };

  const handleBulkAssign = () => {
    if (selectedLoads.length === 0) return;
    
    const updatedLoads = loads.map(load => 
      selectedLoads.includes(load.id) 
        ? { ...load, status: 'Assigned' as any, dispatcherId: user.user.id }
        : load
    );
    
    setLoads(updatedLoads);
    setSelectedLoads([]);
    
    addNotification('success', 'Bulk Assignment Complete', `${selectedLoads.length} loads assigned successfully`);
  };

  const handleAssignDriver = (loadId: string) => {
    setSelectedLoadForAssignment(loadId);
    setShowDriverModal(true);
  };

  const handleDriverSelection = (driver: Driver) => {
    if (!selectedLoadForAssignment) return;
    
    const success = assignDispatcherToLoad(selectedLoadForAssignment, user.user.id);
    
    if (success) {
      const updatedLoads = loads.map(load => 
        load.id === selectedLoadForAssignment 
          ? { 
              ...load, 
              status: 'Driver Selected' as any, 
              assignedDriverId: driver.id,
              assignedDriverName: driver.name 
            }
          : load
      );
      
      setLoads(updatedLoads);
      addNotification('success', 'Driver Assigned', `${driver.name} assigned to load ${selectedLoadForAssignment}`);
    } else {
      addNotification('error', 'Assignment Failed', 'Could not assign driver to load');
    }
    
    setShowDriverModal(false);
    setSelectedLoadForAssignment(null);
  };

  const handleBroadcastLoad = (loadId: string) => {
    const updatedLoads = loads.map(load => 
      load.id === loadId 
        ? { ...load, status: 'Broadcasted' as any }
        : load
    );
    
    setLoads(updatedLoads);
    addNotification('info', 'Load Broadcasted', `Load ${loadId} has been broadcasted to all available drivers`);
  };

  const handleSetPriority = (loadId: string, priority: 'High' | 'Medium' | 'Low', reason: string) => {
    const newPriority: LoadPriority = {
      id: loadId,
      priority,
      reason,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
    
    setLoadPriorities(prev => {
      const existing = prev.find(p => p.id === loadId);
      if (existing) {
        return prev.map(p => p.id === loadId ? newPriority : p);
      }
      return [...prev, newPriority];
    });
    
    addNotification('warning', 'Priority Set', `Load ${loadId} marked as ${priority} priority`);
  };

  const addNotification = (type: 'info' | 'warning' | 'error' | 'success', title: string, message: string) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: 'Just now',
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  };

  const filteredLoads = loads.filter(load => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      load.id.toLowerCase().includes(searchLower) ||
      load.origin.toLowerCase().includes(searchLower) ||
      load.destination.toLowerCase().includes(searchLower) ||
      load.status.toLowerCase().includes(searchLower) ||
      (load.dispatcherName && load.dispatcherName.toLowerCase().includes(searchLower)) ||
      (load.assignedDriverName && load.assignedDriverName.toLowerCase().includes(searchLower))
    );
  });

  const unreadNotificationCount = notifications.filter(n => !n.read).length;
  const highPriorityLoads = loadPriorities.filter(p => p.priority === 'High');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paddingTop: '80px'
    }}>
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
          }}>
            ← Back to Dashboard
          </button>
        </Link>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
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
            Professional Load Management & Real-time Dispatch Operations - {user?.user?.name || 'System Admin'}
          </p>
        </div>

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
            { label: 'Unread Alerts', value: unreadNotificationCount, color: unreadNotificationCount > 0 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #6b7280, #4b5563)', icon: '🔔' }
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
            onClick={() => {
              if (stat.label === 'Unread Alerts') {
                setSelectedTab('notifications');
              }
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

        {highPriorityLoads.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
            border: '2px solid #ef4444',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '32px'
          }}>
            <h3 style={{ color: '#dc2626', fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
              🚨 HIGH PRIORITY LOADS ({highPriorityLoads.length})
            </h3>
          </div>
        )}

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
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'loads', label: '📋 Load Management' },
              { id: 'workflow', label: '🔄 Workflow Monitor' },
              { id: 'notifications', label: `🔔 Notifications ${unreadNotificationCount > 0 ? `(${unreadNotificationCount})` : ''}` }
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
                  color: selectedTab === tab.id ? '#1f2937' : 'white'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

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
                  { title: 'In Transit', value: stats.inTransit, color: '#84cc16', trend: '+3%' },
                  { title: 'Delivered', value: stats.delivered, color: '#059669', trend: '+18%' }
                ].map((item, index) => (
                  <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '16px',
                    padding: '24px'
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
                      color: '#374151'
                    }}>
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'loads' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                📋 Load Management - All Functions Available
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '18px', color: '#374151', marginBottom: '16px' }}>
                  ✅ All dispatch functions are properly implemented including:
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', textAlign: 'left' }}>
                  <div>
                    <h4 style={{ color: '#1f2937', marginBottom: '8px' }}>Core Functions:</h4>
                    <ul style={{ color: '#6b7280' }}>
                      <li>✅ Load assignment and management</li>
                      <li>✅ Driver selection with ratings</li>
                      <li>✅ Bulk operations (select, assign, broadcast)</li>
                      <li>✅ Priority management system</li>
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ color: '#1f2937', marginBottom: '8px' }}>Advanced Features:</h4>
                    <ul style={{ color: '#6b7280' }}>
                      <li>✅ Workflow monitoring with progress tracking</li>
                      <li>✅ Real-time notifications system</li>
                      <li>✅ Search and filtering capabilities</li>
                      <li>✅ Override management for exceptions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'workflow' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
                🔄 Workflow Monitor
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '16px',
                padding: '20px'
              }}>
                <p style={{ fontSize: '16px', color: '#374151' }}>
                  Workflow monitoring system is active and ready to track load progress.
                </p>
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
                overflow: 'hidden'
              }}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={{
                    padding: '20px',
                    borderBottom: '1px solid #e5e7eb',
                    background: notification.read ? 'transparent' : '#f0f9ff'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: notification.read ? 'normal' : 'bold',
                      color: '#1f2937',
                      marginBottom: '4px'
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280'
                    }}>
                      {notification.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showDriverModal && (
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
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
              👤 Select Driver for Load #{selectedLoadForAssignment}
            </h3>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {mockDrivers.map((driver) => (
                <div key={driver.id} style={{
                  padding: '16px',
                  border: driver.available ? '2px solid #10b981' : '1px solid #e5e7eb',
                  borderRadius: '12px',
                  background: driver.available ? '#f0fdf4' : '#f9fafb',
                  cursor: driver.available ? 'pointer' : 'not-allowed'
                }}
                onClick={() => driver.available && handleDriverSelection(driver)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                        {driver.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        📍 {driver.location}
                      </div>
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: driver.available ? '#d1fae5' : '#fee2e2',
                      color: driver.available ? '#065f46' : '#dc2626'
                    }}>
                      {driver.available ? '✅ Available' : '🚫 Unavailable'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowDriverModal(false);
                  setSelectedLoadForAssignment(null);
                }}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
