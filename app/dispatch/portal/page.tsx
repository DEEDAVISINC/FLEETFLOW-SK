'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface DispatcherProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  experience: string;
  specialties: string[];
  assignedDrivers: string[];
  loginTime?: string;
}

// Mock dispatcher data - in real app this would come from backend
const mockDispatchers: DispatcherProfile[] = [
  {
    id: 'disp_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@fleetflow.com',
    department: 'Operations',
    experience: '5 years',
    specialties: ['Long Haul', 'Hazmat', 'Expedited'],
    assignedDrivers: ['driver_001', 'driver_002']
  },
  {
    id: 'disp_002', 
    name: 'Mike Chen',
    email: 'mike.chen@fleetflow.com',
    department: 'Regional',
    experience: '3 years',
    specialties: ['Local Delivery', 'LTL', 'Regional'],
    assignedDrivers: ['driver_003']
  },
  {
    id: 'disp_003',
    name: 'Jessica Martinez',
    email: 'jessica.martinez@fleetflow.com', 
    department: 'Emergency',
    experience: '7 years',
    specialties: ['Emergency Response', 'Cross-Country', 'Heavy Haul'],
    assignedDrivers: ['driver_001', 'driver_003']
  }
];

export default function DispatcherPortal() {
  const [currentDispatcher, setCurrentDispatcher] = useState<DispatcherProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Get logged-in dispatcher from session storage
    const dispatcherSession = localStorage.getItem('dispatcherSession');
    if (dispatcherSession) {
      try {
        const sessionData = JSON.parse(dispatcherSession);
        const dispatcher = mockDispatchers.find(d => d.id === sessionData.id);
        if (dispatcher) {
          setCurrentDispatcher({
            ...dispatcher,
            loginTime: sessionData.loginTime
          });
        }
      } catch (error) {
        console.error('Error parsing dispatcher session:', error);
      }
    }
  }, []);

  if (!currentDispatcher) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎯</div>
          <h2>No Dispatcher Session Found</h2>
          <p>Please log in through the dispatcher login page.</p>
          <Link href="/dispatch/login">
            <button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '16px'
            }}>
              Go to Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: '📊 Dashboard', icon: '📊' },
    { id: 'loads', name: '🚛 Load Management', icon: '🚛' },
    { id: 'drivers', name: '👥 Driver Management', icon: '👥' },
    { id: 'workflow', name: '🔄 Workflow Center', icon: '🔄' },
    { id: 'onboarding', name: '🎯 Carrier Onboarding', icon: '🎯' },
    { id: 'addDriver', name: '➕ Add Driver', icon: '➕' },
    { id: 'communication', name: '💬 Communication Hub', icon: '💬' },
    { id: 'analytics', name: '📈 Performance Analytics', icon: '📈' },
    { id: 'emergency', name: '🚨 Emergency Center', icon: '🚨' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentDispatcherId');
    localStorage.removeItem('dispatcherSession');
    window.location.href = '/dispatch/login';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `
        linear-gradient(rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1)),
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
      `,
      paddingTop: '20px'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 24px 32px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#2d3748',
                margin: '0 0 8px 0'
              }}>
                🎯 Dispatcher Portal
              </h1>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(45, 55, 72, 0.8)',
                margin: 0
              }}>
                Welcome back, {currentDispatcher.name} | {currentDispatcher.department} Department
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Link href="/dispatch">
                <button style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#1e40af',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}>
                  🏢 Admin View
                </button>
              </Link>
              
              <button
                onClick={handleLogout}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dispatcher Profile Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>EXPERIENCE</h4>
              <p style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>{currentDispatcher.experience}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>SPECIALTIES</h4>
              <p style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>{currentDispatcher.specialties.join(', ')}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>ASSIGNED DRIVERS</h4>
              <p style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>{currentDispatcher.assignedDrivers.length} Active</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>LAST LOGIN</h4>
              <p style={{ margin: 0, color: '#1f2937', fontWeight: 'bold' }}>
                {currentDispatcher.loginTime ? new Date(currentDispatcher.loginTime).toLocaleString() : 'Current Session'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'rgba(255, 255, 255, 0.5)',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  border: activeTab === tab.id ? 'none' : '1px solid rgba(156, 163, 175, 0.3)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem'
                }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '32px',
          minHeight: '400px'
        }}>
          {activeTab === 'dashboard' && <DashboardContent dispatcher={currentDispatcher} />}
          {activeTab === 'loads' && <LoadManagementContent dispatcher={currentDispatcher} />}
          {activeTab === 'drivers' && <DriverManagementContent dispatcher={currentDispatcher} />}
          {activeTab === 'workflow' && <WorkflowCenterContent dispatcher={currentDispatcher} />}
          {activeTab === 'onboarding' && <CarrierOnboardingContent dispatcher={currentDispatcher} />}
          {activeTab === 'addDriver' && <AddDriverContent dispatcher={currentDispatcher} />}
          {activeTab === 'communication' && <CommunicationHubContent dispatcher={currentDispatcher} />}
          {activeTab === 'analytics' && <PerformanceAnalyticsContent dispatcher={currentDispatcher} />}
          {activeTab === 'emergency' && <EmergencyCenterContent dispatcher={currentDispatcher} />}
        </div>
      </div>
    </div>
  );
}

// Dashboard Content Component
const DashboardContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      📊 Dashboard Overview
    </h2>
    
    {/* Quick Stats */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
      {[
        { title: 'Active Loads', value: '12', color: '#3b82f6', icon: '🚛' },
        { title: 'Available Drivers', value: '8', color: '#10b981', icon: '👥' },
        { title: 'Pending Workflows', value: '5', color: '#f59e0b', icon: '🔄' },
        { title: 'Emergency Alerts', value: '0', color: '#ef4444', icon: '🚨' }
      ].map((stat, index) => (
        <div key={index} style={{
          background: 'rgba(255, 255, 255, 0.7)',
          border: `2px solid ${stat.color}`,
          borderRadius: '12px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{stat.icon}</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', fontWeight: '600' }}>{stat.title}</div>
        </div>
      ))}
    </div>

    {/* Recent Activity */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid rgba(156, 163, 175, 0.3)'
    }}>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
        🕐 Recent Activity
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { time: '2 min ago', action: 'Load L2025-001 assigned to John Rodriguez', type: 'assignment' },
          { time: '15 min ago', action: 'Workflow step completed: Pickup confirmation', type: 'workflow' },
          { time: '32 min ago', action: 'Driver Maria Santos checked in at Chicago, IL', type: 'location' },
          { time: '1 hour ago', action: 'Emergency dispatch resolved: I-80 accident', type: 'emergency' }
        ].map((activity, index) => (
          <div key={index} style={{
            background: 'rgba(249, 250, 251, 0.8)',
            padding: '12px 16px',
            borderRadius: '8px',
            borderLeft: `4px solid ${
              activity.type === 'assignment' ? '#3b82f6' :
              activity.type === 'workflow' ? '#10b981' :
              activity.type === 'location' ? '#f59e0b' : '#ef4444'
            }`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#374151', fontWeight: '500' }}>{activity.action}</span>
              <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Load Management Content Component
const LoadManagementContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      🚛 Load Management Center
    </h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* Active Loads */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          📋 Active Loads
        </h3>
        {[
          { id: 'L2025-001', driver: 'John Rodriguez', status: 'In Transit', progress: '60%' },
          { id: 'L2025-002', driver: 'Maria Santos', status: 'Assigned', progress: '10%' },
          { id: 'L2025-003', driver: 'David Johnson', status: 'Loading', progress: '35%' }
        ].map((load, index) => (
          <div key={index} style={{
            background: 'rgba(249, 250, 251, 0.8)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{load.id}</span>
              <span style={{ 
                background: load.status === 'In Transit' ? '#dcfce7' : load.status === 'Assigned' ? '#fef3c7' : '#dbeafe',
                color: load.status === 'In Transit' ? '#166534' : load.status === 'Assigned' ? '#92400e' : '#1e40af',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {load.status}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
              Driver: {load.driver}
            </div>
            <div style={{
              background: '#e5e7eb',
              borderRadius: '8px',
              height: '6px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: '#3b82f6',
                height: '100%',
                width: load.progress,
                borderRadius: '8px'
              }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Load Assignment */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          ➕ New Load Assignment
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <select style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem'
          }}>
            <option>Select Available Driver</option>
            <option>John Rodriguez - Available</option>
            <option>Maria Santos - Available</option>
            <option>David Johnson - On Break</option>
          </select>
          
          <input 
            type="text" 
            placeholder="Pickup Location"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem'
            }}
          />
          
          <input 
            type="text" 
            placeholder="Delivery Location"
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem'
            }}
          />
          
          <button style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            🎯 Assign Load
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Driver Management Content Component  
const DriverManagementContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      👥 Driver Management Center
    </h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* Assigned Drivers */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🎯 Your Assigned Drivers
        </h3>
        {[
          { name: 'John Rodriguez', status: 'On Route', location: 'Denver, CO', eta: '2 hours' },
          { name: 'Maria Santos', status: 'Available', location: 'Chicago, IL', eta: 'Ready' },
          { name: 'David Johnson', status: 'Loading', location: 'Phoenix, AZ', eta: '30 min' }
        ].map((driver, index) => (
          <div key={index} style={{
            background: 'rgba(249, 250, 251, 0.8)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{driver.name}</span>
              <span style={{ 
                background: driver.status === 'Available' ? '#dcfce7' : driver.status === 'On Route' ? '#dbeafe' : '#fef3c7',
                color: driver.status === 'Available' ? '#166534' : driver.status === 'On Route' ? '#1e40af' : '#92400e',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                {driver.status}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
              📍 {driver.location}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              🕐 ETA: {driver.eta}
            </div>
          </div>
        ))}
      </div>

      {/* Communication Center */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          💬 Quick Communication
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <select style={{
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem'
          }}>
            <option>Select Driver</option>
            <option>John Rodriguez</option>
            <option>Maria Santos</option>
            <option>David Johnson</option>
          </select>
          
          <textarea 
            placeholder="Type your message..."
            rows={4}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
              resize: 'vertical'
            }}
          />
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flex: 1
            }}>
              📱 Send SMS
            </button>
            <button style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: 'white',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem',
              flex: 1
            }}>
              📞 Call
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Workflow Center Content Component
const WorkflowCenterContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      🔄 Workflow Ecosystem Center
    </h2>
    
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
      {/* Active Workflows */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          ⏳ Pending Workflow Steps
        </h3>
        {[
          { step: 'Load Assignment Confirmation', driver: 'John Rodriguez', load: 'L2025-001', urgent: true },
          { step: 'Pickup Arrival Confirmation', driver: 'Maria Santos', load: 'L2025-002', urgent: false },
          { step: 'POD Upload', driver: 'David Johnson', load: 'L2025-003', urgent: true }
        ].map((workflow, index) => (
          <div key={index} style={{
            background: workflow.urgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 250, 251, 0.8)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '12px',
            border: workflow.urgent ? '2px solid #ef4444' : '1px solid rgba(229, 231, 235, 0.8)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{workflow.step}</span>
              {workflow.urgent && (
                <span style={{ 
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  URGENT
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '4px' }}>
              Driver: {workflow.driver}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Load: {workflow.load}
            </div>
          </div>
        ))}
      </div>

      {/* Workflow Analytics */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid rgba(156, 163, 175, 0.3)'
      }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          📊 Workflow Performance
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { metric: 'On-Time Completion', value: '94%', color: '#10b981' },
            { metric: 'Average Step Time', value: '2.3 hrs', color: '#3b82f6' },
            { metric: 'Bottleneck Steps', value: '3', color: '#f59e0b' },
            { metric: 'Efficiency Score', value: '87%', color: '#8b5cf6' }
          ].map((metric, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(249, 250, 251, 0.8)',
              borderRadius: '8px',
              border: '1px solid rgba(229, 231, 235, 0.8)'
            }}>
              <span style={{ color: '#374151', fontWeight: '500' }}>{metric.metric}</span>
              <span style={{ color: metric.color, fontWeight: 'bold', fontSize: '1.1rem' }}>{metric.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Carrier Onboarding Content Component
const CarrierOnboardingContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => {
  const [onboardingStep, setOnboardingStep] = useState('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<any>(null);

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
        🎯 Carrier Onboarding Center
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        {/* Carrier Search & Verification */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(156, 163, 175, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
            🔍 Carrier Search & Verification
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: '#374151', 
                marginBottom: '8px' 
              }}>
                MC Number or DOT Number
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter MC123456 or DOT123456"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.9rem'
                }}
              />
            </div>
            
            <button style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              🔍 Search FMCSA Database
            </button>
            
            {searchTerm && (
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid #3b82f6',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e40af', fontSize: '0.9rem', fontWeight: '600' }}>
                  ✅ Carrier Found
                </h4>
                <div style={{ fontSize: '0.85rem', color: '#374151', lineHeight: '1.5' }}>
                  <div><strong>Legal Name:</strong> Demo Logistics LLC</div>
                  <div><strong>DBA:</strong> Demo Transport</div>
                  <div><strong>MC Number:</strong> MC123456</div>
                  <div><strong>DOT Number:</strong> DOT789012</div>
                  <div><strong>Safety Rating:</strong> Satisfactory</div>
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '12px',
                  fontSize: '0.9rem'
                }}>
                  ✅ Start Onboarding
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Onboarding Actions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(156, 163, 175, 0.3)'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
            ⚡ Quick Actions
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { action: 'Manual Carrier Entry', desc: 'Add carrier without FMCSA lookup', icon: '📝', color: '#3b82f6' },
              { action: 'Document Upload Center', desc: 'Upload insurance & authority docs', icon: '📄', color: '#10b981' },
              { action: 'Factoring Setup', desc: 'Configure factoring relationships', icon: '💰', color: '#f59e0b' },
              { action: 'Portal Access Setup', desc: 'Create carrier portal accounts', icon: '🔑', color: '#8b5cf6' }
            ].map((item, index) => (
              <button
                key={index}
                style={{
                  background: 'rgba(249, 250, 251, 0.8)',
                  border: `2px solid ${item.color}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLElement).style.background = `rgba(${
                    item.color === '#3b82f6' ? '59, 130, 246' :
                    item.color === '#10b981' ? '16, 185, 129' :
                    item.color === '#f59e0b' ? '245, 158, 11' : '139, 92, 246'
                  }, 0.1)`;
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(249, 250, 251, 0.8)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>{item.action}</div>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>{item.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Onboarding Activity */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid rgba(156, 163, 175, 0.3)',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
            📋 Recent Onboarding Activity
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {[
              { carrier: 'ABC Transport LLC', status: 'In Progress', step: 'Document Review', progress: '75%', dispatcher: 'Sarah Johnson' },
              { carrier: 'XYZ Logistics Inc', status: 'Completed', step: 'Portal Setup', progress: '100%', dispatcher: 'Mike Chen' },
              { carrier: 'Demo Freight Co', status: 'Pending', step: 'FMCSA Verification', progress: '25%', dispatcher: 'Jessica Martinez' }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'rgba(249, 250, 251, 0.8)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(229, 231, 235, 0.8)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.carrier}</span>
                  <span style={{ 
                    background: item.status === 'Completed' ? '#dcfce7' : item.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                    color: item.status === 'Completed' ? '#166534' : item.status === 'In Progress' ? '#1e40af' : '#92400e',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                  Current Step: {item.step}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                  Dispatcher: {item.dispatcher}
                </div>
                <div style={{
                  background: '#e5e7eb',
                  borderRadius: '8px',
                  height: '6px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    background: item.status === 'Completed' ? '#10b981' : item.status === 'In Progress' ? '#3b82f6' : '#f59e0b',
                    height: '100%',
                    width: item.progress,
                    borderRadius: '8px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Driver Content Component
const AddDriverContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      licenseNumber: '',
      licenseState: '',
      licenseExpiration: ''
    },
    employmentInfo: {
      startDate: '',
      role: 'company_driver',
      truckNumber: '',
      trailerNumber: '',
      payRate: '',
      payType: 'per_mile'
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would submit to backend
    alert('Driver added successfully! (Demo mode)');
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
        ➕ Add New Driver
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {/* Personal Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(156, 163, 175, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
              👤 Personal Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  CDL Number *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.licenseNumber}
                  onChange={(e) => handleInputChange('personalInfo', 'licenseNumber', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  CDL State *
                </label>
                <select
                  value={formData.personalInfo.licenseState}
                  onChange={(e) => handleInputChange('personalInfo', 'licenseState', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                >
                  <option value="">Select State</option>
                  <option value="TX">Texas</option>
                  <option value="CA">California</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                  <option value="NY">New York</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  CDL Expiration *
                </label>
                <input
                  type="date"
                  value={formData.personalInfo.licenseExpiration}
                  onChange={(e) => handleInputChange('personalInfo', 'licenseExpiration', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(156, 163, 175, 0.3)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
              💼 Employment Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.employmentInfo.startDate}
                  onChange={(e) => handleInputChange('employmentInfo', 'startDate', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Role *
                </label>
                <select
                  value={formData.employmentInfo.role}
                  onChange={(e) => handleInputChange('employmentInfo', 'role', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="company_driver">Company Driver</option>
                  <option value="owner_operator">Owner Operator</option>
                  <option value="lease_operator">Lease Operator</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Truck Number
                </label>
                <input
                  type="text"
                  value={formData.employmentInfo.truckNumber}
                  onChange={(e) => handleInputChange('employmentInfo', 'truckNumber', e.target.value)}
                  placeholder="e.g., FF-004"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Trailer Number
                </label>
                <input
                  type="text"
                  value={formData.employmentInfo.trailerNumber}
                  onChange={(e) => handleInputChange('employmentInfo', 'trailerNumber', e.target.value)}
                  placeholder="e.g., TRL-004"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Pay Rate *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.employmentInfo.payRate}
                  onChange={(e) => handleInputChange('employmentInfo', 'payRate', e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Pay Type *
                </label>
                <select
                  value={formData.employmentInfo.payType}
                  onChange={(e) => handleInputChange('employmentInfo', 'payType', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="per_mile">Per Mile</option>
                  <option value="per_load">Per Load</option>
                  <option value="hourly">Hourly</option>
                  <option value="salary">Salary</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          padding: '24px',
          background: 'rgba(255, 255, 255, 0.7)',
          borderRadius: '12px',
          border: '1px solid rgba(156, 163, 175, 0.3)'
        }}>
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '16px 32px',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            ➕ Add Driver to System
          </button>
          
          <div style={{ marginTop: '16px', fontSize: '0.9rem', color: '#6b7280' }}>
            Driver will receive welcome email with portal access instructions
          </div>
        </div>
      </form>
    </div>
  );
};

// Communication Hub Content Component
const CommunicationHubContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      💬 Communication Hub
    </h2>
    <div style={{ textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚧</div>
      <h3>Communication Center Coming Soon</h3>
      <p>Advanced messaging, notifications, and driver communication tools are being developed.</p>
    </div>
  </div>
);

// Performance Analytics Content Component
const PerformanceAnalyticsContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      📈 Performance Analytics
    </h2>
    <div style={{ textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📊</div>
      <h3>Analytics Dashboard Coming Soon</h3>
      <p>Detailed performance metrics, KPI tracking, and reporting tools are being developed.</p>
    </div>
  </div>
);

// Emergency Center Content Component
const EmergencyCenterContent = ({ dispatcher }: { dispatcher: DispatcherProfile }) => (
  <div>
    <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '24px' }}>
      🚨 Emergency Response Center
    </h2>
    <div style={{ textAlign: 'center', color: '#6b7280' }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🚨</div>
      <h3>Emergency Management System Coming Soon</h3>
      <p>Emergency response, incident management, and crisis communication tools are being developed.</p>
    </div>
  </div>
);
