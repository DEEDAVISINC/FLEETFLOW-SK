'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { onboardingIntegration } from '../../services/onboarding-integration';

// Access Control
function checkPermission(permission: string): boolean {
  return true; // For demo purposes
}

function AccessRestricted() {
  return (
    <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>
      <h2>🚫 Access Restricted</h2>
      <p>You need management access to view this page.</p>
      <Link href='/'>
        <button
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
          }}
        >
          Back to Dashboard
        </button>
      </Link>
    </div>
  );
}

// Interfaces
interface DriverNotification {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface WorkflowTask {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: Date;
  status: string;
}

// Mock workflow manager
const workflowManager = {
  getActiveWorkflowTasks: (driverId: string): WorkflowTask[] => [
    {
      id: 'wf-001',
      title: 'Load Assignment Confirmation',
      description:
        'Confirm acceptance of load L2025-002: Fort Worth → San Antonio ($2,100)',
      type: 'load_assignment_confirmation',
      priority: 'CRITICAL',
      dueDate: new Date(),
      status: 'pending',
    },
  ],
};

export default function AdminDriverOTRFlow() {
  // All React hooks declared at the top
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState<DriverNotification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const emergencyButtonRef = useRef<HTMLButtonElement>(null);

  // 🔒 Access Control Check
  if (!checkPermission('hasManagementAccess')) {
    return <AccessRestricted />;
  }

  // 🚀 Get Driver Data
  const allDrivers = onboardingIntegration.getAllDrivers();
  const demoDriver = currentDriverId
    ? allDrivers.find((d) => d.driverId === currentDriverId) ||
      allDrivers[selectedDriverIndex]
    : allDrivers[selectedDriverIndex] || {
        driverId: 'driver-001',
        personalInfo: {
          name: 'John Rodriguez',
          licenseNumber: 'CDL-TX-8834592',
          phone: '(555) 234-5678',
          email: 'john.rodriguez@fleetflow.com',
        },
        employmentInfo: {
          startDate: '2023-01-15',
          role: 'OTR Driver',
        },
      };

  // Performance Metrics
  const performanceMetrics = {
    activeLoads: 2,
    safetyScore: 94,
    revenueYTD: '$127,450',
    efficiencyRate: 96,
    monthlyMiles: '2,340',
    taxAlerts: 1,
  };

  // Available Loads for Loadboard
  const availableLoads = [
    {
      id: 'L2025-001',
      origin: 'Dallas, TX',
      destination: 'Miami, FL',
      commodity: 'Electronics',
      pay: '$2,850',
      miles: '1,180 mi',
      rate: '$2.42',
      pickupDate: 'Today',
      priority: 'HIGH',
    },
    {
      id: 'L2025-002',
      origin: 'Fort Worth, TX',
      destination: 'San Antonio, TX',
      commodity: 'General Freight',
      pay: '$2,100',
      miles: '265 mi',
      rate: '$7.92',
      pickupDate: 'Tomorrow',
      priority: 'URGENT',
    },
    {
      id: 'L2025-003',
      origin: 'Houston, TX',
      destination: 'New Orleans, LA',
      commodity: 'Food Products',
      pay: '$1,650',
      miles: '348 mi',
      rate: '$4.74',
      pickupDate: 'Jan 8',
      priority: 'NORMAL',
    },
  ];

  // Active Loads
  const activeLoads = [
    {
      id: 'L2025-001',
      origin: 'Dallas, TX',
      destination: 'Miami, FL',
      status: 'In Transit',
      pay: '$2,850',
      miles: '1,180 mi',
      deliveryDate: 'Tomorrow',
      progress: 75,
    },
    {
      id: 'L2025-002',
      origin: 'Fort Worth, TX',
      destination: 'San Antonio, TX',
      status: 'Available',
      pay: '$2,100',
      miles: '265 mi',
      deliveryDate: 'Jan 8',
      progress: 0,
    },
  ];

  // Initialize notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        message: '🚨 Load assignment confirmation required for L2025-002',
        timestamp: '2 hours ago',
        read: false,
      },
      {
        id: '2',
        message: '📋 Weekly inspection report submitted successfully',
        timestamp: '1 day ago',
        read: true,
      },
      {
        id: '3',
        message: '💰 Payment processed: $2,850 for load L2025-001',
        timestamp: '2 days ago',
        read: false,
      },
    ]);
  }, []);

  const workflowTasks = workflowManager.getActiveWorkflowTasks(
    demoDriver?.driverId || 'driver-001'
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header with KPI Style */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '25px',
            marginBottom: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '25px',
            }}
          >
            <div>
              <h1
                style={{
                  margin: '0',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                🚛 DRIVER OTR FLOW
              </h1>
              <p
                style={{
                  margin: '5px 0 0 0',
                  fontSize: '16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                }}
              >
                Enhanced Driver Portal - {demoDriver.personalInfo?.name}
              </p>
            </div>
            {allDrivers.length > 1 && (
              <select
                value={selectedDriverIndex}
                onChange={(e) => setSelectedDriverIndex(Number(e.target.value))}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {allDrivers.map((driver, index) => (
                  <option
                    key={driver.driverId || index}
                    value={index}
                    style={{ background: '#1e293b', color: 'white' }}
                  >
                    {driver.personalInfo?.name || `Driver ${index + 1}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* KPI Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#dc2626',
                }}
              >
                {workflowTasks.filter((t) => t.priority === 'CRITICAL').length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Critical Actions
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#22c55e',
                }}
              >
                {performanceMetrics.safetyScore}%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Safety Score
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#fbbf24',
                }}
              >
                {performanceMetrics.revenueYTD}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Revenue YTD
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                }}
              >
                {performanceMetrics.efficiencyRate}%
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Efficiency Rate
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#a78bfa',
                }}
              >
                {performanceMetrics.monthlyMiles}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Monthly Miles
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#f87171',
                }}
              >
                {performanceMetrics.taxAlerts}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                Tax Alerts
              </div>
            </div>
          </div>
        </div>

        {/* Critical Load Assignment Alert */}
        {workflowTasks.some(
          (task) => task.type === 'load_assignment_confirmation'
        ) && (
          <div style={{ marginBottom: '25px' }}>
            <div
              style={{
                background: 'linear-gradient(135deg, #dc2626, #ef4444)',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(220, 38, 38, 0.3)',
                animation: 'pulse 2s infinite',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: '0',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: 'white',
                    }}
                  >
                    🚨 LOAD ASSIGNMENT CONFIRMATION REQUIRED
                  </h3>
                  <p
                    style={{
                      margin: '8px 0 0 0',
                      opacity: 0.9,
                      fontSize: '16px',
                      color: 'white',
                    }}
                  >
                    New load L2025-002 assigned: Fort Worth → San Antonio
                    ($2,100)
                  </p>
                </div>
                <button
                  style={{
                    background: 'white',
                    color: '#dc2626',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                >
                  CONFIRM NOW
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ marginBottom: '25px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '16px',
              padding: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              gap: '8px',
            }}
          >
            {[
              { key: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { key: 'tasks-loads', label: '📋 Tasks & Loads', icon: '📋' },
              { key: 'notifications', label: '🔔 Messages', icon: '🔔' },
              { key: 'profile', label: '👤 Profile', icon: '👤' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                style={{
                  flex: 1,
                  background:
                    selectedTab === tab.key
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'transparent',
                  color: 'white',
                  border: 'none',
                  padding: '15px 20px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '20px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {selectedTab === 'dashboard' && (
            <div>
              {/* Quick Stats and Recent Activity */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '25px',
                  marginBottom: '30px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#60a5fa',
                    }}
                  >
                    Quick Stats
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '15px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#fbbf24',
                        }}
                      >
                        {performanceMetrics.revenueYTD}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        YTD Earnings
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#22c55e',
                        }}
                      >
                        {performanceMetrics.safetyScore}%
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Safety
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#a78bfa',
                        }}
                      >
                        {performanceMetrics.monthlyMiles}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Miles
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#60a5fa',
                        }}
                      >
                        {performanceMetrics.activeLoads}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Active Loads
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#34d399',
                    }}
                  >
                    Recent Activity
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Last Login
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        2 hours ago
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Last Load Completed
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        Yesterday
                      </span>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Next Inspection Due
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        15 days
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Available Loads Loadboard */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  🚛 Available Loads
                </h3>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                  }}
                >
                  {/* Header Row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '15px 20px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'white',
                    }}
                  >
                    <div style={{ minWidth: '80px', marginRight: '20px' }}>
                      PRIORITY
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: '30px' }}>
                      <div style={{ minWidth: '250px' }}>LOAD & ROUTE</div>
                      <div style={{ minWidth: '100px', textAlign: 'center' }}>
                        PAY & MILES
                      </div>
                      <div style={{ minWidth: '80px', textAlign: 'center' }}>
                        RATE
                      </div>
                      <div style={{ minWidth: '100px', textAlign: 'center' }}>
                        PICKUP
                      </div>
                    </div>
                    <div
                      style={{
                        minWidth: '150px',
                        textAlign: 'center',
                        marginLeft: '20px',
                      }}
                    >
                      ACTIONS
                    </div>
                  </div>

                  {/* Load Rows */}
                  {availableLoads.map((load, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '15px 20px',
                        borderBottom:
                          index < availableLoads.length - 1
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                        minHeight: '70px',
                        color: 'white',
                      }}
                    >
                      {/* Priority Badge */}
                      <span
                        style={{
                          background:
                            load.priority === 'URGENT'
                              ? '#ef4444'
                              : load.priority === 'HIGH'
                                ? '#f59e0b'
                                : '#34d399',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700',
                          minWidth: '70px',
                          textAlign: 'center',
                          marginRight: '20px',
                        }}
                      >
                        {load.priority}
                      </span>

                      {/* Load Info */}
                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '30px',
                        }}
                      >
                        <div style={{ minWidth: '250px' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              marginBottom: '4px',
                            }}
                          >
                            {load.origin} → {load.destination}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {load.id} • {load.commodity}
                          </div>
                        </div>

                        <div style={{ minWidth: '100px', textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            {load.pay}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            {load.miles}
                          </div>
                        </div>

                        <div style={{ minWidth: '80px', textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#fbbf24',
                            }}
                          >
                            {load.rate}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            per mile
                          </div>
                        </div>

                        <div style={{ minWidth: '100px', textAlign: 'center' }}>
                          <div style={{ fontSize: '14px', fontWeight: '600' }}>
                            {load.pickupDate}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Pickup
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          marginLeft: '20px',
                        }}
                      >
                        <button
                          style={{
                            background:
                              load.priority === 'URGENT'
                                ? '#ef4444'
                                : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          ✅ ACCEPT
                        </button>
                        <button
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px',
                          }}
                        >
                          📋 DETAILS
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'tasks-loads' && (
            <div>
              {/* Critical Workflow Tasks */}
              {workflowTasks.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '25px',
                    marginBottom: '25px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      margin: '0 0 20px 0',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: 'white',
                    }}
                  >
                    ⚡ Critical Actions Required
                  </h3>
                  {workflowTasks.map((task, index) => (
                    <div
                      key={index}
                      style={{
                        background:
                          task.priority === 'CRITICAL'
                            ? 'rgba(220, 38, 38, 0.2)'
                            : 'rgba(59, 130, 246, 0.2)',
                        border: `2px solid ${task.priority === 'CRITICAL' ? 'rgba(220, 38, 38, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '15px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <h4
                            style={{
                              margin: '0',
                              fontSize: '18px',
                              fontWeight: '700',
                              color: 'white',
                            }}
                          >
                            {task.title}
                          </h4>
                          <p
                            style={{
                              margin: '8px 0 0 0',
                              fontSize: '14px',
                              opacity: 0.9,
                              color: 'white',
                            }}
                          >
                            {task.description}
                          </p>
                        </div>
                        <span
                          style={{
                            background:
                              task.priority === 'CRITICAL'
                                ? '#dc2626'
                                : '#3b82f6',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '700',
                          }}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Loads */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  padding: '25px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 20px 0',
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  🚛 Your Active Loads
                </h3>
                {activeLoads.map((load, index) => (
                  <div
                    key={index}
                    style={{
                      background:
                        load.status === 'In Transit'
                          ? 'rgba(34, 197, 94, 0.2)'
                          : 'rgba(59, 130, 246, 0.2)',
                      border: `2px solid ${load.status === 'In Transit' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
                      borderRadius: '12px',
                      padding: '20px',
                      marginBottom: '15px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px',
                      }}
                    >
                      <div>
                        <h4
                          style={{
                            margin: '0',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                          }}
                        >
                          {load.origin} → {load.destination}
                        </h4>
                        <p
                          style={{
                            margin: '4px 0 0 0',
                            fontSize: '14px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Load ID: {load.id}
                        </p>
                      </div>
                      <span
                        style={{
                          background:
                            load.status === 'In Transit'
                              ? '#22c55e'
                              : '#3b82f6',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '16px',
                          fontWeight: '700',
                        }}
                      >
                        {load.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(120px, 1fr))',
                        gap: '20px',
                        marginBottom: '15px',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Pay
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#22c55e',
                          }}
                        >
                          {load.pay}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Miles
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {load.miles}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Delivery
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            color: 'white',
                          }}
                        >
                          {load.deliveryDate}
                        </div>
                      </div>
                    </div>

                    {load.status === 'In Transit' && (
                      <div style={{ marginBottom: '15px' }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                          }}
                        >
                          <span style={{ fontSize: '14px', color: 'white' }}>
                            Progress
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {load.progress}%
                          </span>
                        </div>
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            height: '10px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              background: '#22c55e',
                              height: '100%',
                              width: `${load.progress}%`,
                              borderRadius: '10px',
                              transition: 'width 0.3s ease',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button
                        style={{
                          flex: 1,
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '12px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        📍 TRACK LOAD
                      </button>
                      <button
                        style={{
                          flex: 1,
                          background:
                            load.status === 'Available'
                              ? '#3b82f6'
                              : 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          border:
                            load.status === 'Available'
                              ? 'none'
                              : '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '12px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        {load.status === 'Available'
                          ? '✅ ACCEPT LOAD'
                          : '📞 CALL DISPATCH'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTab === 'notifications' && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                💬 Messages & Notifications
              </h3>
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  style={{
                    background: notification.read
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(59, 130, 246, 0.2)',
                    border: `1px solid ${notification.read ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.3)'}`,
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: '0',
                          fontSize: '16px',
                          fontWeight: notification.read ? 'normal' : '600',
                          color: 'white',
                        }}
                      >
                        {notification.message}
                      </p>
                      <p
                        style={{
                          margin: '8px 0 0 0',
                          fontSize: '12px',
                          opacity: 0.7,
                          color: 'white',
                        }}
                      >
                        {notification.timestamp}
                      </p>
                    </div>
                    {!notification.read && (
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          background: '#3b82f6',
                          borderRadius: '50%',
                          marginLeft: '15px',
                          marginTop: '6px',
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'profile' && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '25px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <h3
                style={{
                  margin: '0 0 20px 0',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                👤 Driver Profile
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '25px',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#60a5fa',
                    }}
                  >
                    Personal Information
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Name
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.personalInfo?.name}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        License Number
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.personalInfo?.licenseNumber}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Phone
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.personalInfo?.phone}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Email
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.personalInfo?.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      margin: '0 0 15px 0',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#34d399',
                    }}
                  >
                    Employment Details
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Department
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        DM - Driver Management
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Start Date
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.employmentInfo?.startDate}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Status
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        {demoDriver.employmentInfo?.role}
                      </div>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '12px',
                          opacity: 0.8,
                          color: 'white',
                        }}
                      >
                        Vehicle Assignment
                      </span>
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: 'white',
                        }}
                      >
                        TRK-001
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href='/' style={{ textDecoration: 'none' }}>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                padding: '15px 30px',
                borderRadius: '15px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        {/* System Status Indicator */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'rgba(34, 197, 94, 0.9)',
            color: 'white',
            padding: '10px 15px',
            borderRadius: '25px',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              background: '#22c55e',
              borderRadius: '50%',
              animation: 'pulse 2s infinite',
            }}
          />
          Enhanced Driver Portal Active • {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
