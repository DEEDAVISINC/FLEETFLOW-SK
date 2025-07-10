'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { onboardingIntegration, DriverPortalProfile } from '../../services/onboarding-integration';
import { checkPermission } from '../../config/access';
import DriverTaxDashboard from '../../components/DriverTaxDashboard';
import { driverTaxService } from '../services/DriverTaxService';
import { workflowManager, LoadWorkflow, WorkflowStep } from '../../lib/workflowManager';

const AccessRestricted = () => (
  <div style={{
    background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  }}>
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      borderRadius: '16px',
      padding: '40px 32px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔒</div>
      <h1 style={{ 
        fontSize: '1.8rem', 
        fontWeight: 'bold', 
        color: '#2d3748', 
        marginBottom: '16px' 
      }}>Access Restricted</h1>
      <p style={{ 
        color: 'rgba(45, 55, 72, 0.8)', 
        marginBottom: '16px',
        lineHeight: '1.6'
      }}>
        You need driver portal permissions to access this system.
      </p>
      <button 
        onClick={() => window.history.back()}
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseOver={(e) => (e.target as HTMLElement).style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => (e.target as HTMLElement).style.transform = 'translateY(0)'}
      >
        Go Back
      </button>
    </div>
  </div>
);

// Driver Dashboard View Component
const DriverDashboardView: React.FC<{ driver?: DriverPortalProfile }> = ({ driver }) => {
  const allDrivers = onboardingIntegration.getAllDrivers();
  const demoDriver = driver || allDrivers[0];

  // Get tax alert information
  const driverId = demoDriver ? `driver_${String(allDrivers.indexOf(demoDriver) + 1).padStart(3, '0')}` : '';
  const taxAlerts = driverId ? driverTaxService.getDriverAlerts(driverId) : { urgent: 0, warning: 0, total: 0 };
  const hasUrgentTaxAlerts = driverId ? driverTaxService.hasUrgentAlerts(driverId) : false;

  // Mock load data for this driver with workflow integration
  const mockLoads = [
    {
      id: 'L2025-001',
      pickup: 'Chicago, IL',
      delivery: 'Detroit, MI',
      status: 'In Transit',
      pickupDate: '2025-07-08',
      deliveryDate: '2025-07-09',
      rate: '$1,850',
      workflow: {
        currentStep: 6,
        totalSteps: 12,
        status: 'in_progress',
        nextAction: 'Confirm delivery arrival'
      }
    },
    {
      id: 'L2025-002',
      pickup: 'Detroit, MI',
      delivery: 'Atlanta, GA',
      status: 'Assigned',
      pickupDate: '2025-07-10',
      deliveryDate: '2025-07-11',
      rate: '$2,200',
      workflow: {
        currentStep: 1,
        totalSteps: 12,
        status: 'pending',
        nextAction: 'Confirm load assignment'
      }
    }
  ];

  // Mock active workflow steps
  const mockWorkflowSteps = [
    {
      id: 'load_assignment_confirmation',
      name: 'Load Assignment Confirmation',
      description: 'Confirm receipt and acceptance of load L2025-002',
      required: true,
      completed: false,
      loadId: 'L2025-002',
      urgent: true
    },
    {
      id: 'delivery_arrival',
      name: 'Delivery Arrival',
      description: 'Confirm arrival at Detroit, MI for load L2025-001',
      required: true,
      completed: false,
      loadId: 'L2025-001',
      urgent: false
    },
    {
      id: 'pickup_completion',
      name: 'Upload Pickup Photos',
      description: 'Upload required pickup photos for load L2025-001',
      required: true,
      completed: false,
      loadId: 'L2025-001',
      urgent: false
    }
  ];

  // Mock notifications for this driver including workflow items
  const mockNotifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'Workflow Action Required',
      message: 'Load L2025-002 assignment confirmation needed',
      time: '2 hours ago',
      category: 'workflow'
    },
    {
      id: 2,
      type: 'urgent',
      title: 'IFTA Filing Due',
      message: 'Q4 2024 IFTA filing due in 5 days',
      time: '2 hours ago',
      category: 'tax'
    },
    {
      id: 3,
      type: 'info',
      title: 'Workflow Step Completed',
      message: 'Pickup completion confirmed for load L2025-001',
      time: '1 day ago',
      category: 'workflow'
    },
    {
      id: 4,
      type: 'warning',
      title: 'Document Expiration',
      message: 'Medical certificate expires in 30 days',
      time: '2 days ago',
      category: 'document'
    }
  ];

  if (!demoDriver) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
        <h2 style={{ color: '#2d3748', fontSize: '1.5rem', marginBottom: '16px' }}>
          No Driver Data Available
        </h2>
        <p style={{ color: 'rgba(45, 55, 72, 0.7)' }}>
          Please complete carrier onboarding to create driver accounts.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      {/* Driver Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '3rem' }}>👤</div>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', margin: 0 }}>
              Welcome, {demoDriver.personalInfo.name}
            </h2>
            <p style={{ color: 'rgba(45, 55, 72, 0.7)', margin: 0 }}>
              {demoDriver.employmentInfo.carrierName} • {demoDriver.employmentInfo.role === 'owner_operator' ? 'Owner Operator' : 'Company Driver'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#3b82f6', fontWeight: 'bold' }}>✅</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Account Active</div>
          </div>
          
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 'bold' }}>{mockLoads.filter(l => l.status === 'In Transit' || l.status === 'Assigned').length}</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Active Loads</div>
          </div>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#8b5cf6', fontWeight: 'bold' }}>{mockWorkflowSteps.length}</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Workflow Steps</div>
            {mockWorkflowSteps.some(s => s.urgent) && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold'
              }}>
                !
              </div>
            )}
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#f59e0b', fontWeight: 'bold' }}>{mockNotifications.length}</div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Notifications</div>
          </div>
          
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 'bold' }}>
              {taxAlerts.total}
            </div>
            <div style={{ color: '#2d3748', fontSize: '0.9rem' }}>Tax Alerts</div>
            {hasUrgentTaxAlerts && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                fontWeight: 'bold'
              }}>
                !
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🔔 Notifications
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {mockNotifications.map((notification) => (
            <div key={notification.id} style={{
              background: notification.type === 'urgent' ? 'rgba(239, 68, 68, 0.1)' : 
                         notification.type === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `1px solid ${notification.type === 'urgent' ? '#ef4444' : 
                                 notification.type === 'warning' ? '#f59e0b' : '#3b82f6'}`,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 'bold', color: '#2d3748', marginBottom: '4px' }}>
                  {notification.title}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                  {notification.message}
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(45, 55, 72, 0.5)' }}>
                {notification.time}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Loads Section */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🚛 My Loads
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {mockLoads.map((load) => (
            <div key={load.id} style={{
              border: '1px solid rgba(45, 55, 72, 0.2)',
              borderRadius: '8px',
              padding: '20px',
              background: load.status === 'In Transit' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(59, 130, 246, 0.05)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '4px' }}>
                    Load {load.id}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                    <span style={{
                      background: load.status === 'In Transit' ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.8rem'
                    }}>
                      {load.status}
                    </span>
                    <span>{load.rate}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(45, 55, 72, 0.6)', marginBottom: '2px' }}>Pickup</div>
                  <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{load.pickup}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>{load.pickupDate}</div>
                </div>
                <div style={{ textAlign: 'center', color: '#3b82f6', fontSize: '1.5rem' }}>→</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(45, 55, 72, 0.6)', marginBottom: '2px' }}>Delivery</div>
                  <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{load.delivery}</div>
                  <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>{load.deliveryDate}</div>
                </div>
              </div>
              
              {/* Workflow Progress */}
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#2d3748' }}>🔄 Workflow Progress</span>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(45, 55, 72, 0.6)' }}>
                    Step {load.workflow.currentStep} of {load.workflow.totalSteps}
                  </span>
                </div>
                <div style={{ 
                  background: 'rgba(45, 55, 72, 0.1)', 
                  borderRadius: '4px', 
                  height: '6px', 
                  marginBottom: '8px',
                  position: 'relative'
                }}>
                  <div style={{
                    background: load.workflow.status === 'in_progress' ? '#3b82f6' : '#f59e0b',
                    height: '100%',
                    borderRadius: '4px',
                    width: `${(load.workflow.currentStep / load.workflow.totalSteps) * 100}%`,
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                  <strong>Next:</strong> {load.workflow.nextAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Workflow Steps */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🔄 Workflow Ecosystem - Active Steps
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {mockWorkflowSteps.map((step) => (
            <div key={step.id} style={{
              background: step.urgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
              border: `2px solid ${step.urgent ? '#ef4444' : '#3b82f6'}`,
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ 
                    fontWeight: 'bold', 
                    color: '#2d3748',
                    fontSize: '0.95rem'
                  }}>
                    {step.name}
                  </span>
                  {step.urgent && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '0.7rem',
                      fontWeight: 'bold'
                    }}>
                      URGENT
                    </span>
                  )}
                  <span style={{
                    background: '#6b7280',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '0.7rem'
                  }}>
                    {step.loadId}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                  {step.description}
                </div>
              </div>
              <button style={{
                background: step.urgent ? '#ef4444' : '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}>
                Complete Step
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '16px' }}>
          🚀 Quick Actions
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {[
            { icon: '�', title: 'Workflow Steps', desc: `${mockWorkflowSteps.filter(s => s.urgent).length} urgent steps pending completion`, isHighlighted: mockWorkflowSteps.some(s => s.urgent) },
            { icon: '�📊', title: 'Tax Dashboard', desc: `View IFTA data, tax liability, and filing alerts${taxAlerts.total > 0 ? ` (${taxAlerts.total} alerts)` : ''}`, isHighlighted: taxAlerts.total > 0 },
            { icon: '📋', title: 'View Assigned Loads', desc: 'Check your current and upcoming deliveries' },
            { icon: '📍', title: 'Update Location', desc: 'Share your current location with dispatch' },
            { icon: '📷', title: 'Upload POD', desc: 'Upload proof of delivery documents' },
            { icon: '💬', title: 'Message Dispatch', desc: 'Communicate with your dispatcher' },
            { icon: '📄', title: 'View Documents', desc: 'Access your employment documents' },
            { icon: '⚙️', title: 'Settings', desc: 'Update your profile and preferences' }
          ].map((action, index) => (
            <button
              key={index}
              style={{
                background: action.isHighlighted ? 'rgba(245, 158, 11, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                border: action.isHighlighted ? '2px solid #f59e0b' : '1px solid rgba(45, 55, 72, 0.2)',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (action.isHighlighted) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.2)';
                } else {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(59, 130, 246, 0.1)';
                }
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                if (action.isHighlighted) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(245, 158, 11, 0.1)';
                } else {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.7)';
                }
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {action.isHighlighted && hasUrgentTaxAlerts && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  !
                </div>
              )}
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{action.icon}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '4px' }}>
                {action.title}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(45, 55, 72, 0.7)' }}>
                {action.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tax Dashboard */}
      <DriverTaxDashboard 
        driverId={driverId}
        driverName={demoDriver.personalInfo.name}
      />
    </div>
  );
};

export default function DriverFlow() {
  // Check permissions first
  if (!checkPermission('canViewDriverPortal')) {
    return <AccessRestricted />;
  }

  // Get the current logged-in driver from session storage or URL params
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);

  useEffect(() => {
    // Check for logged-in driver in session storage
    const loggedInDriverData = sessionStorage.getItem('loggedInDriver');
    if (loggedInDriverData) {
      try {
        const driverInfo = JSON.parse(loggedInDriverData);
        setCurrentDriverId(driverInfo.driverId);
      } catch (error) {
        console.error('Error parsing logged-in driver data:', error);
      }
    }

    // Also check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const driverIdFromUrl = urlParams.get('driverId');
    if (driverIdFromUrl) {
      setCurrentDriverId(driverIdFromUrl);
    }
  }, []);

  // Get all drivers and find the current one
  const allDrivers = onboardingIntegration.getAllDrivers();
  
  let demoDriver;
  if (currentDriverId) {
    // If we have a logged-in driver ID, use that specific driver
    demoDriver = allDrivers.find(d => d.driverId === currentDriverId) || allDrivers[0];
    // Update selected index to match the logged-in driver
    const driverIndex = allDrivers.findIndex(d => d.driverId === currentDriverId);
    if (driverIndex !== -1 && selectedDriverIndex !== driverIndex) {
      setSelectedDriverIndex(driverIndex);
    }
  } else {
    // Fall back to demo mode with driver selector
    demoDriver = allDrivers[selectedDriverIndex] || allDrivers[0];
  }

  if (!demoDriver) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #f7c52d, #f4a832)',
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
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>👤</div>
          <h2>No Driver Profile Found</h2>
          <p>Please contact your administrator to set up your driver profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)),
        linear-gradient(135deg, #f7c52d 0%, #f4a832 100%)
      `,
      padding: '80px 20px 20px 20px'
    }}>
      {/* Driver Selection for Demo - Remove in production */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <button style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#2d3748',
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
            }}>
              ← Back to Dashboard
            </button>
          </Link>
          
          {/* Demo Driver Selector or Logout */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {currentDriverId ? (
              // Show logout button for logged-in drivers
              <button
                onClick={() => {
                  sessionStorage.removeItem('loggedInDriver');
                  window.location.href = '/drivers/portal';
                }}
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
            ) : (
              // Show demo driver selector when not logged in
              <select
                value={selectedDriverIndex}
                onChange={(e) => setSelectedDriverIndex(Number(e.target.value))}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#2d3748',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontWeight: '600'
                }}
              >
                {allDrivers.map((driver, index) => (
                  <option key={index} value={index}>
                    Demo as: {driver.personalInfo.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Personal Driver Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '32px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#2d3748',
            margin: '0 0 12px 0',
            textShadow: '2px 2px 4px rgba(255,255,255,0.5)'
          }}>
            🚛 DRIVER FLOW
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(45, 55, 72, 0.8)',
            margin: 0
          }}>
            {currentDriverId ? (
              `Welcome back, ${demoDriver.personalInfo.name}!`
            ) : (
              `Personal portal for ${demoDriver.personalInfo.name} (Demo Mode)`
            )}
          </p>
        </div>

        {/* Individual Driver Dashboard Content */}
        <DriverDashboardView driver={demoDriver} />
      </div>
    </div>
  );
}
