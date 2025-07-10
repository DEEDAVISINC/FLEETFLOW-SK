'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLoadsForUser, Load } from '../services/loadService';
import { workflowManager, WorkflowStepId, LoadWorkflow } from '../../lib/workflowManager';
import { photoUploadService } from '../../lib/photoUploadService';
import SignaturePad from '../../components/SignaturePad';
import BOLComponent from '../../components/BOLComponent';
import BillOfLading from '../../components/BillOfLading';

interface DriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedTruck: string;
  dispatcherName: string;
  dispatcherPhone: string;
  dispatcherEmail: string;
  currentLocation: string;
  eldStatus: 'Connected' | 'Disconnected' | 'Error';
  hoursRemaining: number;
}

interface SMSNotification {
  id: string;
  message: string;
  timestamp: string;
  type: 'load_assignment' | 'dispatch_update' | 'system_alert';
  read: boolean;
}

interface LoadConfirmation {
  loadId: string;
  confirmed: boolean;
  confirmationTime?: string;
  driverSignature?: string;
  photos?: string[];
  notes?: string;
}

interface DeliveryVerification {
  loadId: string;
  pickupPhotos: string[];
  deliveryPhotos: string[];
  receiverSignature?: string;
  receiverName?: string;
  deliveryTime?: string;
  notes?: string;
}

// Mock data
const MOCK_DRIVER: DriverProfile = {
  id: 'DRV-001',
  name: 'John Smith',
  email: 'john.smith@fleetflow.com',
  phone: '+1 (555) 123-4567',
  licenseNumber: 'CDL-TX-123456',
  assignedTruck: 'TRK-001 (Freightliner Cascadia)',
  dispatcherName: 'Sarah Johnson',
  dispatcherPhone: '+1 (555) 987-6543',
  dispatcherEmail: 'sarah.johnson@fleetflow.com',
  currentLocation: 'Dallas, TX',
  eldStatus: 'Connected',
  hoursRemaining: 8.5
};

const MOCK_NOTIFICATIONS: SMSNotification[] = [
  {
    id: 'sms-001',
    message: 'New load assigned: LD-2025-001 - Dallas, TX to Atlanta, GA',
    timestamp: '2025-01-02T10:30:00Z',
    type: 'load_assignment',
    read: false
  },
  {
    id: 'sms-002', 
    message: 'Dispatch Update: Please confirm pickup by 2:00 PM today',
    timestamp: '2025-01-02T09:15:00Z',
    type: 'dispatch_update',
    read: false
  },
  {
    id: 'sms-003',
    message: 'System Alert: ELD sync successful',
    timestamp: '2025-01-02T08:00:00Z',
    type: 'system_alert',
    read: true
  }
];

export default function DriverPortal() {
  const [driver, setDriver] = useState<DriverProfile>(MOCK_DRIVER);
  const [assignedLoads, setAssignedLoads] = useState<Load[]>([]);
  const [availableLoads, setAvailableLoads] = useState<Load[]>([]);
  const [notifications, setNotifications] = useState<SMSNotification[]>(MOCK_NOTIFICATIONS);
  const [loadConfirmations, setLoadConfirmations] = useState<LoadConfirmation[]>([]);
  const [deliveryVerifications, setDeliveryVerifications] = useState<DeliveryVerification[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'loads' | 'loadboard' | 'documents' | 'notifications'>('dashboard');
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [confirmationPhotos, setConfirmationPhotos] = useState<string[]>([]);
  const [deliveryPhotos, setDeliveryPhotos] = useState<string[]>([]);
  const [pickupPhotos, setPickupPhotos] = useState<string[]>([]);
  const [driverSignature, setDriverSignature] = useState<string>('');
  const [receiverSignature, setReceiverSignature] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // 🔄 Workflow Management State
  const [workflows, setWorkflows] = useState<Map<string, LoadWorkflow>>(new Map());
  const [activeWorkflowModal, setActiveWorkflowModal] = useState<string | null>(null);
  const [workflowStepData, setWorkflowStepData] = useState<Record<string, any>>({});
  const [uploadingFiles, setUploadingFiles] = useState<boolean>(false);
  const [workflowDocuments, setWorkflowDocuments] = useState<Map<string, string[]>>(new Map());
  const [showBOLModal, setShowBOLModal] = useState<boolean>(false);
  const [bolLoad, setBolLoad] = useState<Load | null>(null);

  useEffect(() => {
    // Load driver's assigned loads and available loads
    const allLoads = getLoadsForUser();
    const assigned = allLoads.filter(load => 
      load.status === 'Assigned' && load.dispatcherName === driver.dispatcherName
    );
    const available = allLoads.filter(load => load.status === 'Available');
    
    setAssignedLoads(assigned);
    setAvailableLoads(available);

    // 🔄 Initialize workflows for assigned loads
    const workflowMap = new Map<string, LoadWorkflow>();
    assigned.forEach(load => {
      let workflow = workflowManager.getWorkflow(load.id);
      if (!workflow) {
        workflow = workflowManager.initializeLoadWorkflow(load.id, driver.id, 'DSP-001');
      }
      workflowMap.set(load.id, workflow);
    });
    setWorkflows(workflowMap);
  }, [driver.dispatcherName, driver.id]);

  const getStatusColor = (status: Load['status']) => {
    switch (status) {
      case 'Assigned': return { bg: '#fef3c7', text: '#a16207' };
      case 'In Transit': return { bg: '#dbeafe', text: '#1e40af' };
      case 'Delivered': return { bg: '#dcfce7', text: '#166534' };
      case 'Available': return { bg: '#f0f9ff', text: '#0284c7' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getNotificationIcon = (type: SMSNotification['type']) => {
    switch (type) {
      case 'load_assignment': return '🚛';
      case 'dispatch_update': return '📢';
      case 'system_alert': return '⚠️';
      default: return '📱';
    }
  };

  const handleLoadConfirmation = (load: Load) => {
    setSelectedLoad(load);
    setShowConfirmationModal(true);
  };

  const handleDeliveryComplete = (load: Load) => {
    setSelectedLoad(load);
    setShowDeliveryModal(true);
  };

  const markNotificationRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  // 🔄 Workflow Helper Functions
  const getWorkflowForLoad = (loadId: string): LoadWorkflow | null => {
    return workflows.get(loadId) || null;
  };

  const getNextWorkflowStep = (loadId: string) => {
    const workflow = getWorkflowForLoad(loadId);
    if (!workflow) return null;
    return workflow.steps.find(step => !step.completed);
  };

  const canCompleteWorkflowStep = (loadId: string, stepId: WorkflowStepId): { allowed: boolean; reason?: string } => {
    return workflowManager.canCompleteStep(loadId, stepId);
  };

  const openWorkflowStepModal = (loadId: string, stepId: WorkflowStepId) => {
    const validation = canCompleteWorkflowStep(loadId, stepId);
    if (!validation.allowed) {
      alert(validation.reason || 'Cannot complete this step');
      return;
    }
    setSelectedLoad(assignedLoads.find(load => load.id === loadId) || null);
    setActiveWorkflowModal(stepId);
  };

  const completeWorkflowStep = async (loadId: string, stepId: WorkflowStepId, data: any = {}) => {
    try {
      const success = await workflowManager.completeStep(loadId, stepId, data);
      if (success) {
        // Update local workflows state
        const updatedWorkflow = workflowManager.getWorkflow(loadId);
        if (updatedWorkflow) {
          setWorkflows(prev => new Map(prev.set(loadId, updatedWorkflow)));
        }
        setActiveWorkflowModal(null);
        setWorkflowStepData({});
        
        // Show success message
        alert(`✅ Step "${stepId}" completed successfully!`);
      }
    } catch (error) {
      console.error('Error completing workflow step:', error);
      alert('Error completing step. Please try again.');
    }
  };

  const uploadWorkflowDocument = async (file: File, stepId: string) => {
    try {
      setUploadingFiles(true);
      const result = await photoUploadService.uploadFile(file, {
        category: 'document',
        driverId: driver.id,
        loadId: selectedLoad?.id,
        onProgress: (progress) => {
          console.log(`Upload progress: ${progress.percentage}%`);
        }
      });
      
      // Add to workflow documents
      const key = `${selectedLoad?.id}-${stepId}`;
      setWorkflowDocuments(prev => {
        const existing = prev.get(key) || [];
        return new Map(prev.set(key, [...existing, result.secureUrl]));
      });
      
      return result;
    } catch (error) {
      console.error('Error uploading workflow document:', error);
      throw error;
    } finally {
      setUploadingFiles(false);
    }
  };

  const getWorkflowProgress = (loadId: string): number => {
    const workflow = getWorkflowForLoad(loadId);
    if (!workflow) return 0;
    const completedSteps = workflow.steps.filter(step => step.completed).length;
    return (completedSteps / workflow.steps.length) * 100;
  };

  const getWorkflowStepIcon = (stepId: string, completed: boolean, current: boolean) => {
    const icons = {
      'load_assignment_confirmation': completed ? '✅' : current ? '🔄' : '⏳',
      'rate_confirmation_review': completed ? '✅' : current ? '🔄' : '📋',
      'rate_confirmation_verification': completed ? '✅' : current ? '🔄' : '✍️',
      'bol_receipt_confirmation': completed ? '✅' : current ? '🔄' : '📄',
      'bol_verification': completed ? '✅' : current ? '🔄' : '🔍',
      'pickup_authorization': completed ? '✅' : current ? '🔄' : '🚥',
      'pickup_arrival': completed ? '✅' : current ? '🔄' : '📍',
      'pickup_completion': completed ? '✅' : current ? '🔄' : '📦',
      'transit_start': completed ? '✅' : current ? '🔄' : '🚛',
      'delivery_arrival': completed ? '✅' : current ? '🔄' : '🏢',
      'delivery_completion': completed ? '✅' : current ? '🔄' : '✍️',
      'pod_submission': completed ? '✅' : current ? '🔄' : '📋'
    };
    return icons[stepId as keyof typeof icons] || '❓';
  };

  const getWorkflowStepTitle = (stepId: string | null) => {
    const titles = {
      'load_assignment_confirmation': '✅ Confirm Load Assignment',
      'rate_confirmation_review': '📋 Rate Confirmation Review',
      'rate_confirmation_verification': '✍️ Rate Confirmation Verification',
      'bol_receipt_confirmation': '📄 Bill of Lading Receipt',
      'bol_verification': '🔍 Bill of Lading Verification',
      'pickup_authorization': '🚥 Pickup Authorization',
      'pickup_arrival': '📍 Pickup Arrival',
      'pickup_completion': '📦 Pickup Completion',
      'transit_start': '🚛 Transit Start',
      'delivery_arrival': '🏢 Delivery Arrival',
      'delivery_completion': '✍️ Delivery Completion',
      'pod_submission': '📋 Proof of Delivery Submission'
    };
    return stepId ? titles[stepId as keyof typeof titles] || 'Unknown Step' : 'Unknown Step';
  };

  const getWorkflowStepDescription = (stepId: string | null) => {
    const descriptions = {
      'load_assignment_confirmation': 'Review and confirm receipt of this load assignment',
      'rate_confirmation_review': 'Review the rate confirmation document provided by dispatch',
      'rate_confirmation_verification': 'Verify and sign the rate confirmation details',
      'bol_receipt_confirmation': 'Confirm receipt of Bill of Lading from dispatcher',
      'bol_verification': 'Verify BOL details match load information',
      'pickup_authorization': 'Receive green light to proceed to pickup location',
      'pickup_arrival': 'Confirm arrival at pickup location',
      'pickup_completion': 'Complete loading and document pickup process',
      'transit_start': 'Begin transit to delivery location',
      'delivery_arrival': 'Confirm arrival at delivery location',
      'delivery_completion': 'Complete delivery with receiver signature and documentation',
      'pod_submission': 'Submit complete delivery documentation'
    };
    return stepId ? descriptions[stepId as keyof typeof descriptions] || 'Complete this workflow step' : 'Complete this workflow step';
  };

  const isWorkflowStepValid = (stepId: string | null) => {
    if (!stepId) return false;
    
    switch (stepId) {
      case 'load_assignment_confirmation':
        return workflowStepData.confirmed && workflowStepData.rateAccepted && workflowStepData.signature;
      
      case 'pickup_completion':
        return workflowStepData.loadingComplete && 
               workflowStepData.weightVerified && 
               workflowStepData.sealNumber && 
               workflowStepData.pickupTimestamp && 
               workflowStepData.signature &&
               workflowStepData.pickupPhotos && 
               workflowStepData.pickupPhotos.length >= 2; // Minimum 2 photos required
      
      case 'delivery_completion':
        // Basic requirements
        const basicValid = workflowStepData.unloadingComplete && 
                          workflowStepData.deliveryTimestamp &&
                          workflowStepData.deliveryPhotos && 
                          workflowStepData.deliveryPhotos.length >= 2; // Minimum 2 photos required
        
        // Receiver signature and name requirements (can be overridden)
        if (workflowStepData.overrideApproved) {
          return basicValid && workflowStepData.overrideReason; // Override reason required
        } else {
          return basicValid && workflowStepData.receiverName && workflowStepData.receiverSignature;
        }
      
      default:
        return true; // For now, other steps are automatically valid
    }
  };

  // BOL Helper Functions
  const openBOLModal = (load: Load) => {
    setBolLoad(load);
    setShowBOLModal(true);
  };

  const getBOLData = (loadId: string) => {
    const workflow = getWorkflowForLoad(loadId);
    if (!workflow) return {};

    // Extract signatures and data from completed workflow steps
    const signatures: any = {};
    const stepData: any = {};

    workflow.steps.forEach(step => {
      if (step.completed && step.data) {
        if (step.id === 'load_assignment_confirmation' || step.id === 'pickup_completion') {
          signatures.driverSignature = step.data.signature;
        }
        if (step.id === 'delivery_completion') {
          signatures.receiverSignature = step.data.receiverSignature;
          signatures.receiverName = step.data.receiverName;
        }
        if (step.id === 'pickup_completion') {
          stepData.pickupPhotos = step.data.pickupPhotos;
          stepData.sealNumber = step.data.sealNumber;
          stepData.pickupTimestamp = step.data.pickupTimestamp;
        }
        if (step.id === 'delivery_completion') {
          stepData.deliveryPhotos = step.data.deliveryPhotos;
          stepData.deliveryTimestamp = step.data.deliveryTimestamp;
        }
      }
    });

    return { ...signatures, ...stepData };
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e40af, #1d4ed8, #2563eb)',
      padding: '80px 20px 20px 20px'
    }}>
      {/* Header */}
      <div style={{ padding: '0 0 24px 0', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'inline-block', textDecoration: 'none' }}>
            <button style={{
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
            }}>
              ← Back to Dashboard
            </button>
          </Link>
          
          <div style={{ color: 'white', textAlign: 'right' }}>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>Welcome, {driver.name}</div>
            <div style={{ fontSize: '14px', opacity: 0.8 }}>Driver ID: {driver.id}</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Page Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
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
            🚛 DRIVER PORTAL
          </h1>
          <p style={{
            fontSize: '20px',
            color: 'rgba(255, 255, 255, 0.9)',
            margin: 0
          }}>
            Your complete mobile command center - Loads, Confirmations, and More
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
            { label: 'Assigned Loads', value: assignedLoads.length, color: 'linear-gradient(135deg, #3b82f6, #2563eb)', icon: '📋' },
            { label: 'Hours Remaining', value: `${driver.hoursRemaining}h`, color: 'linear-gradient(135deg, #10b981, #059669)', icon: '⏰' },
            { label: 'Current Location', value: driver.currentLocation, color: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '📍' },
            { label: 'ELD Status', value: driver.eldStatus, color: driver.eldStatus === 'Connected' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #dc2626)', icon: '📡' },
            { label: 'Unread Messages', value: notifications.filter(n => !n.read).length, color: 'linear-gradient(135deg, #a855f7, #9333ea)', icon: '💬' }
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
                <div style={{ fontSize: '12px', opacity: 0.9, marginBottom: '4px' }}>{stat.icon}</div>
                <div style={{ fontSize: '16px' }}>{stat.value}</div>
              </div>
              <div style={{ color: '#374151', fontSize: '12px', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
              { id: 'loads', label: 'My Loads', icon: '📦' },
              { id: 'loadboard', label: 'Load Board', icon: '📋' },
              { id: 'documents', label: 'Documents', icon: '📄' },
              { id: 'notifications', label: 'Messages', icon: '💬' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  background: activeTab === tab.id 
                    ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
                    : 'rgba(156, 163, 175, 0.2)',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: activeTab === tab.id ? '0 4px 15px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(156, 163, 175, 0.3)';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(156, 163, 175, 0.2)';
                  }
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                📊 Driver Dashboard
              </h3>
              
              {/* Driver Profile Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  👤 Driver Information
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <strong>Name:</strong> {driver.name}<br/>
                    <strong>License:</strong> {driver.licenseNumber}<br/>
                    <strong>Phone:</strong> {driver.phone}
                  </div>
                  <div>
                    <strong>Assigned Truck:</strong> {driver.assignedTruck}<br/>
                    <strong>Current Location:</strong> {driver.currentLocation}<br/>
                    <strong>ELD Status:</strong> <span style={{ color: driver.eldStatus === 'Connected' ? '#059669' : '#dc2626' }}>{driver.eldStatus}</span>
                  </div>
                </div>
              </div>

              {/* Dispatcher Info Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '24px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  📞 Your Dispatcher
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <strong>Name:</strong> {driver.dispatcherName}<br/>
                    <strong>Phone:</strong> {driver.dispatcherPhone}<br/>
                    <strong>Email:</strong> {driver.dispatcherEmail}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      📞 Call Dispatcher
                    </button>
                    <button style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}>
                      📧 Send Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                  📈 Recent Activity
                </h4>
                <div style={{ color: '#6b7280' }}>
                  • Load LD-2025-001 confirmed at 10:30 AM<br/>
                  • ELD sync completed at 8:00 AM<br/>
                  • Location updated: Dallas, TX at 9:15 AM<br/>
                  • Dispatcher message received at 9:15 AM
                </div>
              </div>
            </div>
          )}

          {/* My Loads Tab */}
          {activeTab === 'loads' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                🚛 My Assigned Loads
              </h3>
              
              {assignedLoads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  📭 No loads currently assigned
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                  {assignedLoads.map((load) => {
                    const workflow = getWorkflowForLoad(load.id);
                    const progress = getWorkflowProgress(load.id);
                    const nextStep = getNextWorkflowStep(load.id);
                    
                    return (
                      <div key={load.id} style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '24px',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
                      }}>
                        {/* Load Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                          <div>
                            <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>
                              🚛 Load {load.id}
                            </h4>
                            <div style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                              {load.origin} → {load.destination}
                            </div>
                            <div style={{ 
                              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                              padding: '8px 12px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#0369a1',
                              display: 'inline-block'
                            }}>
                              Progress: {Math.round(progress)}% Complete
                            </div>
                          </div>
                          <span style={{
                            background: getStatusColor(load.status).bg,
                            color: getStatusColor(load.status).text,
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {load.status}
                          </span>
                        </div>

                        {/* Workflow Progress Bar */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ 
                            background: '#f3f4f6', 
                            height: '8px', 
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              background: 'linear-gradient(135deg, #10b981, #059669)',
                              height: '100%',
                              width: `${progress}%`,
                              transition: 'width 0.3s ease'
                            }}></div>
                          </div>
                          {nextStep && (
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                              Next: {nextStep.name}
                            </div>
                          )}
                        </div>
                        
                        {/* Load Details */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                          <div>
                            <strong>Rate:</strong> ${load.rate.toLocaleString()}<br/>
                            <strong>Equipment:</strong> {load.equipment}<br/>
                            <strong>Weight:</strong> {load.weight}
                          </div>
                          <div>
                            <strong>Pickup:</strong> {new Date(load.pickupDate).toLocaleDateString()}<br/>
                            <strong>Delivery:</strong> {new Date(load.deliveryDate).toLocaleDateString()}<br/>
                            <strong>Distance:</strong> {load.distance}
                          </div>
                        </div>

                        {/* Workflow Steps */}
                        {workflow && (
                          <div style={{ marginBottom: '20px' }}>
                            <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
                              📋 Workflow Steps
                            </h5>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                              {workflow.steps.map((step, index) => {
                                const isCurrent = !step.completed && index === workflow.currentStep;
                                const canComplete = canCompleteWorkflowStep(load.id, step.id as WorkflowStepId).allowed;
                                
                                return (
                                  <div
                                    key={step.id}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      padding: '8px 12px',
                                      borderRadius: '8px',
                                      background: step.completed 
                                        ? 'linear-gradient(135deg, #d1fae5, #a7f3d0)' 
                                        : isCurrent 
                                          ? 'linear-gradient(135deg, #fef3c7, #fde68a)'
                                          : '#f9fafb',
                                      border: step.completed 
                                        ? '1px solid #10b981' 
                                        : isCurrent 
                                          ? '1px solid #f59e0b'
                                          : '1px solid #e5e7eb',
                                      cursor: isCurrent && canComplete ? 'pointer' : 'default',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => {
                                      if (isCurrent && canComplete) {
                                        openWorkflowStepModal(load.id, step.id as WorkflowStepId);
                                      }
                                    }}
                                    onMouseOver={(e) => {
                                      if (isCurrent && canComplete) {
                                        e.currentTarget.style.transform = 'translateY(-1px)';
                                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                                      }
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.transform = 'translateY(0)';
                                      e.currentTarget.style.boxShadow = 'none';
                                    }}
                                  >
                                    <span style={{ marginRight: '8px', fontSize: '16px' }}>
                                      {getWorkflowStepIcon(step.id, step.completed, isCurrent)}
                                    </span>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                                        {step.name}
                                      </div>
                                      {step.completed && step.completedAt && (
                                        <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                          ✓ {new Date(step.completedAt).toLocaleString()}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {nextStep && (
                            <button
                              onClick={() => openWorkflowStepModal(load.id, nextStep.id as WorkflowStepId)}
                              style={{
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              {getWorkflowStepIcon(nextStep.id, false, true)} {nextStep.name}
                            </button>
                          )}
                          
                          <button 
                            onClick={() => openBOLModal(load)}
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)';
                              e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          >
                            📄 View BOL
                          </button>
                          
                          <button 
                            style={{
                              background: 'rgba(156, 163, 175, 0.2)',
                              color: '#374151',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            � Full Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Load Board Tab */}
          {activeTab === 'loadboard' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                📋 Available Load Board
              </h3>
              
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: 'linear-gradient(135deg, #f9fafb, #f3f4f6)' }}>
                    <tr>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Load ID</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Route</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Equipment</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Rate</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Pickup Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableLoads.map((load, index) => (
                      <tr key={load.id} style={{
                        borderTop: index > 0 ? '1px solid #e5e7eb' : 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                      }}>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 'bold' }}>{load.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          <div>{load.origin}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>{load.destination}</div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>{load.equipment}</td>
                        <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
                          ${load.rate.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '14px' }}>
                          {new Date(load.pickupDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <button style={{
                            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}>
                            Request Load
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                📄 My Documents
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {/* Rate Confirmations */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    💰 Rate Confirmations
                  </h4>
                  <div style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Download your rate confirmation documents for all assigned loads.
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📥 Download All
                  </button>
                </div>

                {/* Bills of Lading */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    📋 Bills of Lading
                  </h4>
                  <div style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Access BOL documents for pickup and delivery verification.
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📥 Download All
                  </button>
                </div>

                {/* Load Confirmations */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    ✅ Load Confirmations
                  </h4>
                  <div style={{ color: '#6b7280', marginBottom: '16px' }}>
                    View all your confirmed load documents and signatures.
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📥 Download All
                  </button>
                </div>

                {/* Driver Documents */}
                <div style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
                    👤 Driver Documents
                  </h4>
                  <div style={{ color: '#6b7280', marginBottom: '16px' }}>
                    Access your license, certifications, and employment documents.
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}>
                    📥 View Documents
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
                💬 SMS Notifications & Messages
              </h3>
              
              <div style={{ display: 'grid', gap: '12px' }}>
                {notifications.map((notification) => (
                  <div key={notification.id} style={{
                    background: notification.read ? 'white' : '#f0f9ff',
                    borderRadius: '12px',
                    padding: '16px',
                    border: `1px solid ${notification.read ? '#e5e7eb' : '#3b82f6'}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => markNotificationRead(notification.id)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{getNotificationIcon(notification.type)}</span>
                        <span style={{
                          background: notification.read ? '#f3f4f6' : '#dbeafe',
                          color: notification.read ? '#6b7280' : '#1e40af',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {notification.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {new Date(notification.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ 
                      color: notification.read ? '#6b7280' : '#111827',
                      fontWeight: notification.read ? 'normal' : '600'
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

      {/* Load Confirmation Modal */}
      {showConfirmationModal && selectedLoad && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                ✅ Confirm Load Assignment
              </h3>
              <button 
                onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationPhotos([]);
                  setDriverSignature('');
                  setNotes('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Load Details */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                Load Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div><strong>Load ID:</strong> {selectedLoad.id}</div>
                <div><strong>Rate:</strong> ${selectedLoad.rate.toLocaleString()}</div>
                <div><strong>Origin:</strong> {selectedLoad.origin}</div>
                <div><strong>Destination:</strong> {selectedLoad.destination}</div>
                <div><strong>Pickup Date:</strong> {new Date(selectedLoad.pickupDate).toLocaleDateString()}</div>
                <div><strong>Equipment:</strong> {selectedLoad.equipment}</div>
              </div>
            </div>

            {/* Photo Upload Section */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                📸 Upload Confirmation Photos
              </h4>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newPhotos = files.map(file => URL.createObjectURL(file));
                    setConfirmationPhotos(prev => [...prev, ...newPhotos]);
                  }}
                  style={{ display: 'none' }}
                  id="confirmation-photos"
                />
                <label htmlFor="confirmation-photos" style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none'
                }}>
                  📷 Take/Upload Photos
                </label>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                  Upload photos of the load, BOL, or vehicle inspection
                </div>
              </div>
              
              {confirmationPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px' }}>
                  {confirmationPhotos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={photo} 
                        alt={`Confirmation ${index + 1}`}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        onClick={() => setConfirmationPhotos(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Digital Signature */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                ✍️ Driver Signature
              </h4>
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '16px',
                background: '#f9fafb'
              }}>
                <canvas
                  id="driver-signature-canvas"
                  width="500"
                  height="150"
                  style={{
                    width: '100%',
                    height: '150px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'crosshair',
                    background: 'white'
                  }}
                  onMouseDown={(e) => {
                    const canvas = e.target as HTMLCanvasElement;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.beginPath();
                      const rect = canvas.getBoundingClientRect();
                      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                      
                      const draw = (e: MouseEvent) => {
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                      };
                      
                      const stopDrawing = () => {
                        canvas.removeEventListener('mousemove', draw);
                        canvas.removeEventListener('mouseup', stopDrawing);
                        setDriverSignature(canvas.toDataURL());
                      };
                      
                      canvas.addEventListener('mousemove', draw);
                      canvas.addEventListener('mouseup', stopDrawing);
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Sign above to confirm load assignment
                  </div>
                  <button
                    onClick={() => {
                      const canvas = document.getElementById('driver-signature-canvas') as HTMLCanvasElement;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.clearRect(0, 0, canvas.width, canvas.height);
                          setDriverSignature('');
                        }
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                📝 Additional Notes (Optional)
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about the load confirmation..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowConfirmationModal(false);
                  setConfirmationPhotos([]);
                  setDriverSignature('');
                  setNotes('');
                }}
                style={{
                  background: 'rgba(156, 163, 175, 0.2)',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedLoad && (driverSignature || confirmationPhotos.length > 0)) {
                    const confirmation: LoadConfirmation = {
                      loadId: selectedLoad.id,
                      confirmed: true,
                      confirmationTime: new Date().toISOString(),
                      driverSignature,
                      photos: confirmationPhotos,
                      notes
                    };
                    
                    setLoadConfirmations(prev => [...prev, confirmation]);
                    
                    // Update load status
                    setAssignedLoads(prev => 
                      prev.map(load => 
                        load.id === selectedLoad.id 
                          ? { ...load, status: 'In Transit' as const }
                          : load
                      )
                    );
                    
                    // Add notification
                    const newNotification: SMSNotification = {
                      id: `sms-${Date.now()}`,
                      message: `Load ${selectedLoad.id} confirmed successfully. Pickup scheduled for ${new Date(selectedLoad.pickupDate).toLocaleDateString()}.`,
                      timestamp: new Date().toISOString(),
                      type: 'system_alert',
                      read: false
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                    
                    setShowConfirmationModal(false);
                    setConfirmationPhotos([]);
                    setDriverSignature('');
                    setNotes('');
                    
                    alert('Load confirmed successfully! You can now proceed to pickup.');
                  } else {
                    alert('Please provide either a signature or upload at least one photo to confirm the load.');
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ✅ Confirm Load
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery Completion Modal */}
      {showDeliveryModal && selectedLoad && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                📸 Complete Delivery
              </h3>
              <button 
                onClick={() => {
                  setShowDeliveryModal(false);
                  setPickupPhotos([]);
                  setDeliveryPhotos([]);
                  setReceiverSignature('');
                  setReceiverName('');
                  setNotes('');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ✕
              </button>
            </div>

            {/* Load Details */}
            <div style={{
              background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                Delivery Details
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                <div><strong>Load ID:</strong> {selectedLoad.id}</div>
                <div><strong>Destination:</strong> {selectedLoad.destination}</div>
                <div><strong>Expected Delivery:</strong> {new Date(selectedLoad.deliveryDate).toLocaleDateString()}</div>
                <div><strong>Current Time:</strong> {new Date().toLocaleString()}</div>
              </div>
            </div>

            {/* Pickup Photos */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                📸 Pickup Verification Photos
              </h4>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newPhotos = files.map(file => URL.createObjectURL(file));
                    setPickupPhotos(prev => [...prev, ...newPhotos]);
                  }}
                  style={{ display: 'none' }}
                  id="pickup-photos"
                />
                <label htmlFor="pickup-photos" style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none'
                }}>
                  📷 Upload Pickup Photos
                </label>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                  Photos of load during pickup (BOL, cargo condition, etc.)
                </div>
              </div>
              
              {pickupPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                  {pickupPhotos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={photo} 
                        alt={`Pickup ${index + 1}`}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        onClick={() => setPickupPhotos(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Delivery Photos */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                📸 Delivery Verification Photos
              </h4>
              <div style={{
                border: '2px dashed #d1d5db',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                marginBottom: '12px'
              }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newPhotos = files.map(file => URL.createObjectURL(file));
                    setDeliveryPhotos(prev => [...prev, ...newPhotos]);
                  }}
                  style={{ display: 'none' }}
                  id="delivery-photos"
                />
                <label htmlFor="delivery-photos" style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none'
                }}>
                  📷 Upload Delivery Photos
                </label>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
                  Photos of delivered cargo, unloading, facility, etc.
                </div>
              </div>
              
              {deliveryPhotos.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', marginBottom: '16px' }}>
                  {deliveryPhotos.map((photo, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img 
                        src={photo} 
                        alt={`Delivery ${index + 1}`}
                        style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <button
                        onClick={() => setDeliveryPhotos(prev => prev.filter((_, i) => i !== index))}
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Receiver Information */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                👤 Receiver Information
              </h4>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                placeholder="Receiver's name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
              />
            </div>

            {/* Receiver Signature */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                ✍️ Receiver Signature
              </h4>
              <div style={{
                border: '1px solid #d1d5db',
                borderRadius: '12px',
                padding: '16px',
                background: '#f9fafb'
              }}>
                <canvas
                  id="receiver-signature-canvas"
                  width="500"
                  height="150"
                  style={{
                    width: '100%',
                    height: '150px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'crosshair',
                    background: 'white'
                  }}
                  onMouseDown={(e) => {
                    const canvas = e.target as HTMLCanvasElement;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                      ctx.beginPath();
                      const rect = canvas.getBoundingClientRect();
                      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                      
                      const draw = (e: MouseEvent) => {
                        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                        ctx.stroke();
                      };
                      
                      const stopDrawing = () => {
                        canvas.removeEventListener('mousemove', draw);
                        canvas.removeEventListener('mouseup', stopDrawing);
                        setReceiverSignature(canvas.toDataURL());
                      };
                      
                      canvas.addEventListener('mousemove', draw);
                      canvas.addEventListener('mouseup', stopDrawing);
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Receiver signature confirming delivery
                  </div>
                  <button
                    onClick={() => {
                      const canvas = document.getElementById('receiver-signature-canvas') as HTMLCanvasElement;
                      if (canvas) {
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.clearRect(0, 0, canvas.width, canvas.height);
                          setReceiverSignature('');
                        }
                      }
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Notes */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '12px' }}>
                📝 Delivery Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any notes about the delivery process, condition, issues, etc..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowDeliveryModal(false);
                  setPickupPhotos([]);
                  setDeliveryPhotos([]);
                  setReceiverSignature('');
                  setReceiverName('');
                  setNotes('');
                }}
                style={{
                  background: 'rgba(156, 163, 175, 0.2)',
                  color: '#374151',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedLoad && receiverSignature && deliveryPhotos.length > 0 && receiverName.trim()) {
                    const deliveryVerification: DeliveryVerification = {
                      loadId: selectedLoad.id,
                      pickupPhotos,
                      deliveryPhotos,
                      receiverSignature,
                      receiverName: receiverName.trim(),
                      deliveryTime: new Date().toISOString(),
                      notes
                    };
                    
                    setDeliveryVerifications(prev => [...prev, deliveryVerification]);
                    
                    // Update load status to delivered
                    setAssignedLoads(prev => 
                      prev.map(load => 
                        load.id === selectedLoad.id 
                          ? { ...load, status: 'Delivered' as const }
                          : load
                      )
                    );
                    
                    // Add success notification
                    const newNotification: SMSNotification = {
                      id: `sms-${Date.now()}`,
                      message: `✅ Load ${selectedLoad.id} delivered successfully to ${selectedLoad.destination}. Delivery confirmed by ${receiverName} at ${new Date().toLocaleString()}.`,
                      timestamp: new Date().toISOString(),
                      type: 'system_alert',
                      read: false
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                    
                    setShowDeliveryModal(false);
                    setPickupPhotos([]);
                    setDeliveryPhotos([]);
                    setReceiverSignature('');
                    setReceiverName('');
                    setNotes('');
                    
                    alert(`Delivery completed successfully! Load ${selectedLoad.id} has been marked as delivered.`);
                  } else {
                    alert('Please provide: receiver name, receiver signature, and at least one delivery photo to complete the delivery.');
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🚚 Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔄 Workflow Step Modals */}
      {activeWorkflowModal && selectedLoad && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Inline Workflow Step Modal */}
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  {getWorkflowStepTitle(activeWorkflowModal)}
                </h3>
                <button 
                  onClick={() => setActiveWorkflowModal(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#6b7280'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <div style={{
                background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <p style={{ margin: 0, color: '#374151' }}>
                  {getWorkflowStepDescription(activeWorkflowModal)}
                </p>
              </div>

              {/* Load Context */}
              <div style={{
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                  Load Context
                </h4>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>
                  <strong>Load:</strong> {selectedLoad.id} | <strong>Route:</strong> {selectedLoad.origin} → {selectedLoad.destination}
                </div>
              </div>

              {/* Step Specific Content */}
              {activeWorkflowModal === 'load_assignment_confirmation' && (
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={workflowStepData.confirmed || false}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, confirmed: e.target.checked }))}
                      style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      I confirm receipt and acceptance of this load assignment <span style={{ color: '#ef4444' }}>*</span>
                    </span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={workflowStepData.rateAccepted || false}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, rateAccepted: e.target.checked }))}
                      style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      I accept the rate of ${selectedLoad.rate.toLocaleString()} <span style={{ color: '#ef4444' }}>*</span>
                    </span>
                  </label>
                  
                  {/* Digital Signature */}
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      ✍️ Digital Signature <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <SignaturePad
                      onSignatureChange={(signature) => setWorkflowStepData(prev => ({ ...prev, signature }))}
                      placeholder="Draw your signature here"
                      width={350}
                      height={120}
                    />
                  </div>
                </div>
              )}

              {/* PICKUP COMPLETION - Enhanced with Required Photos */}
              {activeWorkflowModal === 'pickup_completion' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    border: '1px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                      📸 REQUIRED: Pickup Photos
                    </h4>
                    <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                      You must upload a minimum of 2 photos: loaded truck and bill of lading
                    </p>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={workflowStepData.loadingComplete || false}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, loadingComplete: e.target.checked }))}
                      style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Loading completed successfully <span style={{ color: '#ef4444' }}>*</span>
                    </span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={workflowStepData.weightVerified || false}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, weightVerified: e.target.checked }))}
                      style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Weight verified and documented <span style={{ color: '#ef4444' }}>*</span>
                    </span>
                  </label>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Seal Number <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={workflowStepData.sealNumber || ''}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, sealNumber: e.target.value }))}
                      placeholder="Enter seal number"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Pickup Completion Time <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={workflowStepData.pickupTimestamp || ''}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, pickupTimestamp: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Required Photos Section */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      📸 Required Pickup Photos <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setUploadingFiles(true);
                          try {
                            const uploadPromises = Array.from(files).map(file => uploadWorkflowDocument(file, 'pickup_completion'));
                            const results = await Promise.all(uploadPromises);
                            const photoUrls = results.map(result => result.secureUrl);
                            setWorkflowStepData(prev => ({ 
                              ...prev, 
                              pickupPhotos: [...(prev.pickupPhotos || []), ...photoUrls] 
                            }));
                          } catch (error) {
                            alert('Error uploading photos. Please try again.');
                          } finally {
                            setUploadingFiles(false);
                          }
                        }
                      }}
                      disabled={uploadingFiles}
                      style={{ marginBottom: '12px' }}
                    />
                    {workflowStepData.pickupPhotos && workflowStepData.pickupPhotos.length > 0 && (
                      <div style={{ fontSize: '12px', color: '#059669' }}>
                        ✅ {workflowStepData.pickupPhotos.length} photo(s) uploaded 
                        {workflowStepData.pickupPhotos.length >= 2 ? ' (Requirement met)' : ' (Need minimum 2 photos)'}
                      </div>
                    )}
                    {uploadingFiles && (
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                        📤 Uploading photos...
                      </div>
                    )}
                  </div>

                  {/* Digital Signature */}
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      ✍️ Driver Signature <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <SignaturePad
                      onSignatureChange={(signature) => setWorkflowStepData(prev => ({ ...prev, signature }))}
                      placeholder="Draw your signature here"
                      width={350}
                      height={120}
                    />
                  </div>
                </div>
              )}

              {/* DELIVERY COMPLETION - Enhanced with Required Photos and Receiver Validation */}
              {activeWorkflowModal === 'delivery_completion' && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                    border: '1px solid #f59e0b',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e', marginBottom: '8px' }}>
                      📸 REQUIRED: Delivery Photos & Receiver Signature
                    </h4>
                    <p style={{ fontSize: '14px', color: '#92400e', margin: 0 }}>
                      You must upload minimum 2 photos and obtain receiver name & signature (unless override approved)
                    </p>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                      type="checkbox"
                      checked={workflowStepData.unloadingComplete || false}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, unloadingComplete: e.target.checked }))}
                      style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      Unloading completed successfully <span style={{ color: '#ef4444' }}>*</span>
                    </span>
                  </label>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Receiver Name <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={workflowStepData.receiverName || ''}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, receiverName: e.target.value }))}
                      placeholder="Enter receiver's full name"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Receiver Title/Position
                    </label>
                    <input
                      type="text"
                      value={workflowStepData.receiverTitle || ''}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, receiverTitle: e.target.value }))}
                      placeholder="Enter receiver's title or position"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      color: '#374151',
                      marginBottom: '4px'
                    }}>
                      Delivery Completion Time <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="time"
                      value={workflowStepData.deliveryTimestamp || ''}
                      onChange={(e) => setWorkflowStepData(prev => ({ ...prev, deliveryTimestamp: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Required Photos Section */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      📸 Required Delivery Photos <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) {
                          setUploadingFiles(true);
                          try {
                            const uploadPromises = Array.from(files).map(file => uploadWorkflowDocument(file, 'delivery_completion'));
                            const results = await Promise.all(uploadPromises);
                            const photoUrls = results.map(result => result.secureUrl);
                            setWorkflowStepData(prev => ({ 
                              ...prev, 
                              deliveryPhotos: [...(prev.deliveryPhotos || []), ...photoUrls] 
                            }));
                          } catch (error) {
                            alert('Error uploading photos. Please try again.');
                          } finally {
                            setUploadingFiles(false);
                          }
                        }
                      }}
                      disabled={uploadingFiles}
                      style={{ marginBottom: '12px' }}
                    />
                    {workflowStepData.deliveryPhotos && workflowStepData.deliveryPhotos.length > 0 && (
                      <div style={{ fontSize: '12px', color: '#059669' }}>
                        ✅ {workflowStepData.deliveryPhotos.length} photo(s) uploaded 
                        {workflowStepData.deliveryPhotos.length >= 2 ? ' (Requirement met)' : ' (Need minimum 2 photos)'}
                      </div>
                    )}
                    {uploadingFiles && (
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>
                        📤 Uploading photos...
                      </div>
                    )}
                  </div>

                  {/* Receiver Signature */}
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                      ✍️ Receiver Signature <span style={{ color: '#ef4444' }}>*</span>
                    </h4>
                    <SignaturePad
                      onSignatureChange={(signature) => setWorkflowStepData(prev => ({ ...prev, receiverSignature: signature }))}
                      placeholder="Have receiver draw their signature here"
                      width={350}
                      height={120}
                      disabled={workflowStepData.overrideApproved}
                    />
                    {workflowStepData.overrideApproved && (
                      <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>
                        ⚠️ Signature disabled due to override approval
                      </div>
                    )}
                  </div>

                  {/* Override Section */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
                    border: '1px solid #f87171',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px'
                  }}>
                    <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}>
                      <input
                        type="checkbox"
                        checked={workflowStepData.overrideApproved || false}
                        onChange={(e) => setWorkflowStepData(prev => ({ ...prev, overrideApproved: e.target.checked }))}
                        style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontSize: '14px', color: '#991b1b', fontWeight: '600' }}>
                        Override Required (No receiver signature/name available)
                      </span>
                    </label>
                    
                    {workflowStepData.overrideApproved && (
                      <div>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#991b1b',
                          marginBottom: '4px'
                        }}>
                          Override Reason <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <textarea
                          value={workflowStepData.overrideReason || ''}
                          onChange={(e) => setWorkflowStepData(prev => ({ ...prev, overrideReason: e.target.value }))}
                          placeholder="Explain why receiver signature/name cannot be obtained..."
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #f87171',
                            borderRadius: '8px',
                            fontSize: '14px',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>
                  📝 Additional Notes (Optional)
                </h4>
                <textarea
                  value={workflowStepData.notes || ''}
                  onChange={(e) => setWorkflowStepData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any additional notes or comments..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setActiveWorkflowModal(null)}
                  style={{
                    background: 'rgba(156, 163, 175, 0.2)',
                    color: '#374151',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => completeWorkflowStep(selectedLoad.id, activeWorkflowModal as WorkflowStepId, workflowStepData)}
                  disabled={!isWorkflowStepValid(activeWorkflowModal)}
                  style={{
                    background: isWorkflowStepValid(activeWorkflowModal)
                      ? 'linear-gradient(135deg, #10b981, #059669)' 
                      : '#d1d5db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: isWorkflowStepValid(activeWorkflowModal) ? 'pointer' : 'not-allowed',
                    opacity: isWorkflowStepValid(activeWorkflowModal) ? 1 : 0.6
                  }}
                >
                  ✅ Complete Step
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📄 BOL (Bill of Lading) Modal */}
      {showBOLModal && bolLoad && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '20px',
            maxWidth: '90vw',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            position: 'relative'
          }}>
            {/* Close Button */}
            <button 
              onClick={() => {
                setShowBOLModal(false);
                setBolLoad(null);
              }}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #fca5a5',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#dc2626',
                zIndex: 1001
              }}
            >
              ✕
            </button>

            {/* BOL Component */}
            <BOLComponent
              load={bolLoad}
              driver={driver}
              {...getBOLData(bolLoad.id)}
            />

            {/* Print/Download Actions */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              borderTop: '2px solid #e5e7eb',
              display: 'flex',
              gap: '12px',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => window.print()}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🖨️ Print BOL
              </button>
              
              <button
                onClick={() => {
                  // Future: Generate PDF download
                  alert('PDF download feature coming soon!');
                }}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
