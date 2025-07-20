'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '../config/access';
import { getLoadsForUser, getLoadStats, updateLoad, assignDispatcherToLoad, Load } from '../services/loadService';
import { workflowBackendService } from '../../lib/workflowBackendService';
import { LoadWorkflow } from '../../lib/workflowManager';

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

// Mock drivers for selection
const mockDrivers: Driver[] = [
  { id: 'driver-001', name: 'John Smith', available: true, location: 'Dallas, TX', rating: 4.8, phone: '(555) 111-1111' },
  { id: 'driver-002', name: 'Mike Johnson', available: true, location: 'Houston, TX', rating: 4.9, phone: '(555) 222-2222' },
  { id: 'driver-003', name: 'David Wilson', available: false, location: 'Austin, TX', rating: 4.7, phone: '(555) 333-3333' },
  { id: 'driver-004', name: 'Chris Brown', available: true, location: 'San Antonio, TX', rating: 4.6, phone: '(555) 444-4444' },
];

// Mock notifications
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
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [workflowStatuses, setWorkflowStatuses] = useState<Record<string, WorkflowStatus>>({});

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const userLoads = getLoadsForUser(currentUser);
      
      // Filter loads for dispatcher (assigned to them or available)
      const filteredLoads = userLoads.filter(load => {
        const isAssignedToDispatcher = load.dispatcherId === currentUser.id || load.status === 'Available';
        return isAssignedToDispatcher;
      });
      
      setLoads(filteredLoads);
      
      const loadStats = getLoadStats(filteredLoads);
      setStats(loadStats);

      // Load workflow statuses
      loadWorkflowStatuses(filteredLoads);
    }
  }, []);

  const loadWorkflowStatuses = async (loads: Load[]) => {
    const statuses: Record<string, WorkflowStatus> = {};
    
    for (const load of loads) {
      try {
        const workflows = await workflowBackendService.getActiveWorkflows(load.id);
        if (workflows.length > 0) {
          const workflow = workflows[0];
          statuses[load.id] = {
            workflowId: workflow.id,
            currentStep: workflow.currentStep?.title || 'Not Started',
            status: workflow.status,
            completedSteps: workflow.completedSteps?.length || 0,
            totalSteps: workflow.steps?.length || 0,
            driverName: workflow.driverId ? mockDrivers.find(d => d.id === workflow.driverId)?.name || 'Unknown' : 'Unassigned',
            lastActivity: workflow.updatedAt || 'No activity',
            requiresOverride: workflow.requiresOverride || false
          };
        }
      } catch (error) {
        console.log('No workflow found for load', load.id);
      }
    }
    
    setWorkflowStatuses(statuses);
  };

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
        ? { ...load, status: 'Assigned' as any, dispatcherId: user.id }
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
    
    const success = assignDispatcherToLoad(selectedLoadForAssignment, user.id);
    
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
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
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
                setShowNotificationPanel(true);
              }
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

        {/* High Priority Alerts */}
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
            <div style={{ display: 'grid', gap: '8px' }}>
              {highPriorityLoads.map(priority => (
                <div key={priority.id} style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontWeight: '600', color: '#dc2626' }}>
                    Load #{priority.id} - {priority.reason}
                  </span>
                  <button
                    onClick={() => handleBroadcastLoad(priority.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🚨 URGENT BROADCAST
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
              { id: 'workflow', label: '🔄 Workflow Monitor', icon: '🔄' },
              { id: 'notifications', label: `🔔 Notifications ${unreadNotificationCount > 0 ? `(${unreadNotificationCount})` : ''}`, icon: '🔔' }
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
                  { title: 'Broadcasted', value: stats.broadcasted, color: '#8b5cf6', trend: '+15%' },
                  { title: 'Driver Selected', value: stats.driverSelected, color: '#f97316', trend: '+7%' },
                  { title: 'Order Sent', value: stats.orderSent, color: '#06b6d4', trend: '+10%' },
                  { title: 'In Transit', value: stats.inTransit, color: '#84cc16', trend: '+3%' },
                  { title: 'Delivered', value: stats.delivered, color: '#059669', trend: '+18%' },
                  { title: 'Unassigned', value: stats.unassigned, color: '#ef4444', trend: '-5%' }
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                      width: '250px'
                    }}
                  />
                  {selectedLoads.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleBulkBroadcast}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        📢 Bulk Broadcast ({selectedLoads.length})
                      </button>
                      <button
                        onClick={handleBulkAssign}
                        style={{
                          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                          color: 'white',
                          border: 'none',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        📌 Bulk Assign ({selectedLoads.length})
                      </button>
                    </div>
                  )}
                </div>
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
                  fontSize: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Active Loads ({filteredLoads.length})</span>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <input
                      type="checkbox"
                      checked={selectedLoads.length === filteredLoads.length && filteredLoads.length > 0}
                      onChange={handleSelectAll}
                      style={{ transform: 'scale(1.2)' }}
                    />
                    Select All
                  </label>
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
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {filteredLoads.map((load) => {
                      const priority = loadPriorities.find(p => p.id === load.id);
                      const workflowStatus = workflowStatuses[load.id];
                      
                      return (
                        <div key={load.id} style={{
                          padding: '20px',
                          borderBottom: '1px solid #e5e7eb',
                          transition: 'all 0.3s ease',
                          background: selectedLoads.includes(load.id) ? '#f0f9ff' : 'transparent'
                        }}
                        onMouseOver={(e) => {
                          if (!selectedLoads.includes(load.id)) {
                            e.currentTarget.style.background = '#f9fafb';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!selectedLoads.includes(load.id)) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                            <div style={{ display: 'flex', alignItems: 'start', gap: '12px', flex: 1 }}>
                              <input
                                type="checkbox"
                                checked={selectedLoads.includes(load.id)}
                                onChange={() => handleLoadSelect(load.id)}
                                style={{ marginTop: '4px', transform: 'scale(1.2)' }}
                              />
                              <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <div style={{
                                    fontSize: '18px',
                                    fontWeight: 'bold',
                                    color: '#1f2937'
                                  }}>
                                    Load #{load.id}
                                  </div>
                                  {priority && (
                                    <span style={{
                                      display: 'inline-block',
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '10px',
                                      fontWeight: '600',
                                      background: priority.priority === 'High' ? '#fee2e2' : 
                                                priority.priority === 'Medium' ? '#fef3c7' : '#f3f4f6',
                                      color: priority.priority === 'High' ? '#dc2626' : 
                                             priority.priority === 'Medium' ? '#d97706' : '#6b7280'
                                    }}>
                                      {priority.priority.toUpperCase()} PRIORITY
                                    </span>
                                  )}
                                </div>
                                <div style={{
                                  fontSize: '14px',
                                  color: '#6b7280',
                                  marginBottom: '12px'
                                }}>
                                  📍 {load.origin} → {load.destination}
                                </div>
                                <div style={{ display: 'flex', gap: '16px', fontSize: '14px', marginBottom: '8px' }}>
                                  <span>💰 ${load.rate?.toLocaleString()}</span>
                                  <span>📏 {load.distance} miles</span>
                                  <span>⚖️ {load.weight?.toLocaleString()} lbs</span>
                                </div>
                                {workflowStatus && (
                                  <div style={{
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    background: '#f3f4f6',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    marginTop: '8px'
                                  }}>
                                    🔄 Workflow: {workflowStatus.currentStep} ({workflowStatus.completedSteps}/{workflowStatus.totalSteps} steps)
                                    {workflowStatus.requiresOverride && (
                                      <span style={{ color: '#ef4444', fontWeight: '600', marginLeft: '8px' }}>
                                        ⚠️ Requires Override
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              <div style={{
                                display: 'inline-block',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '600',
                                background: load.status === 'Available' ? '#d1fae5' : 
                                           load.status === 'Assigned' ? '#fef3c7' :
                                           load.status === 'Broadcasted' ? '#e0e7ff' :
                                           load.status === 'Driver Selected' ? '#fed7aa' :
                                           load.status === 'Order Sent' ? '#bae6fd' :
                                           load.status === 'In Transit' ? '#dbeafe' : '#fecaca',
                                color: load.status === 'Available' ? '#065f46' : 
                                       load.status === 'Assigned' ? '#92400e' :
                                       load.status === 'Broadcasted' ? '#3730a3' :
                                       load.status === 'Driver Selected' ? '#c2410c' :
                                       load.status === 'Order Sent' ? '#0369a1' :
                                       load.status === 'In Transit' ? '#1e40af' : '#991b1b'
                              }}>
                                {load.status}
                              </div>
                              
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                {load.status === 'Available' && (
                                  <>
                                    <button
                                      onClick={() => handleAssignDriver(load.id)}
                                      style={{
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      👤 Assign
                                    </button>
                                    <button
                                      onClick={() => handleBroadcastLoad(load.id)}
                                      style={{
                                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      📢 Broadcast
                                    </button>
                                    <button
                                      onClick={() => handleSetPriority(load.id, 'High', 'Urgent delivery required')}
                                      style={{
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      🚨 Priority
                                    </button>
                                  </>
                                )}
                              </div>
                              
                              {(load.dispatcherName || load.assignedDriverName) && (
                                <div style={{
                                  fontSize: '11px',
                                  color: '#6b7280',
                                  textAlign: 'right'
                                }}>
                                  {load.dispatcherName && <div>Dispatcher: {load.dispatcherName}</div>}
                                  {load.assignedDriverName && <div>Driver: {load.assignedDriverName}</div>}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                  Active Workflows ({Object.keys(workflowStatuses).length})
                </div>
                {Object.keys(workflowStatuses).length === 0 ? (
                  <div style={{ 
                    padding: '40px', 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '18px'
                  }}>
                    🔄 No active workflows at this time
                  </div>
                ) : (
                  <div style={{ padding: '20px' }}>
                    {Object.entries(workflowStatuses).map(([loadId, workflow]) => (
                      <div key={loadId} style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '16px',
                        border: workflow.requiresOverride ? '2px solid #ef4444' : '1px solid #e5e7eb'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                          <div>
                            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                              Load #{loadId}
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                              Driver: {workflow.driverName}
                            </p>
                          </div>
                          <div style={{
                            background: workflow.requiresOverride ? '#fee2e2' : '#e0f2fe',
                            color: workflow.requiresOverride ? '#dc2626' : '#0369a1',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {workflow.requiresOverride ? '⚠️ Override Required' : workflow.status}
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>
                            Current Step: <strong>{workflow.currentStep}</strong>
                          </div>
                          <div style={{
                            background: '#e5e7eb',
                            borderRadius: '10px',
                            height: '8px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              background: 'linear-gradient(90deg, #10b981, #059669)',
                              height: '100%',
                              width: `${(workflow.completedSteps / workflow.totalSteps) * 100}%`,
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                            {workflow.completedSteps} of {workflow.totalSteps} steps completed
                          </div>
                        </div>
                        
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          Last Activity: {workflow.lastActivity}
                        </div>
                        
                        {workflow.requiresOverride && (
                          <button
                            onClick={() => addNotification('info', 'Override Processed', `Workflow override approved for load ${loadId}`)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              marginTop: '12px'
                            }}
                          >
                            🔧 Approve Override
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '20px' 
              }}>
                <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                  🔔 Dispatch Notifications
                </h2>
                {unreadNotificationCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Mark All Read
                  </button>
                )}
              </div>
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
                          {notification.title}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {notification.message}
                        </div>
                        <div style={{
                          fontSize: '12px',
                          color: '#9ca3af'
                        }}>
                          {notification.timestamp}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: '600',
                          background: notification.type === 'error' ? '#fee2e2' :
                                     notification.type === 'warning' ? '#fef3c7' :
                                     notification.type === 'success' ? '#d1fae5' : '#dbeafe',
                          color: notification.type === 'error' ? '#dc2626' :
                                 notification.type === 'warning' ? '#d97706' :
                                 notification.type === 'success' ? '#065f46' : '#1e40af'
                        }}>
                          {notification.type.toUpperCase()}
                        </div>
                        {!notification.read && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#3b82f6'
                          }} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Driver Selection Modal */}
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
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
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
                  cursor: driver.available ? 'pointer' : 'not-allowed',
                  opacity: driver.available ? 1 : 0.6
                }}
                onClick={() => driver.available && handleDriverSelection(driver)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                        {driver.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>
                        📍 {driver.location}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280' }}>
                        📞 {driver.phone}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#f59e0b',
                        marginBottom: '4px'
                      }}>
                        ⭐ {driver.rating}/5.0
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
