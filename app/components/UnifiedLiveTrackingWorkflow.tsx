'use client';

import { useEffect, useState } from 'react';
import {
  LoadWorkflow,
  WorkflowStepId,
  workflowManager,
} from '../../lib/workflowManager';
import { Load } from '../services/loadService';

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
  speed: number;
  heading: number;
}

interface TrackingData {
  loadId: string;
  currentLocation: TrackingLocation;
  status: 'in_transit' | 'at_pickup' | 'at_delivery' | 'delayed' | 'completed';
  eta: string;
  distance: {
    total: number;
    remaining: number;
    traveled: number;
  };
  driver: {
    name: string;
    phone: string;
    id: string;
  };
  vehicle: {
    unit: string;
    make: string;
    model: string;
  };
  milestones: Array<{
    type: 'pickup' | 'checkpoint' | 'delivery';
    location: string;
    expectedTime: string;
    actualTime?: string;
    status: 'pending' | 'completed' | 'delayed';
  }>;
  lastUpdate: string;
}

interface WorkflowStep {
  id: WorkflowStepId;
  name: string;
  status: 'completed' | 'current' | 'pending' | 'error';
  completedAt?: string;
  completedBy?: string;
  data?: any;
  icon: string;
  color: string;
  description: string;
}

interface BOLData {
  bolNumber: string;
  shipperInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  consigneeInfo: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  freightDetails: {
    description: string;
    weight: number;
    pieces: number;
    class: string;
  };
  specialInstructions?: string;
  generatedAt?: string;
  signedBy?: string;
  signatureDate?: string;
}

interface UnifiedLiveTrackingWorkflowProps {
  load?: Load;
  driverId?: string;
  driverName?: string;
  isModal?: boolean;
  onClose?: () => void;
  autoRefresh?: boolean;
}

export default function UnifiedLiveTrackingWorkflow({
  load,
  driverId,
  driverName,
  isModal = false,
  onClose,
  autoRefresh = true,
}: UnifiedLiveTrackingWorkflowProps) {
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [workflow, setWorkflow] = useState<LoadWorkflow | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<
    'combined' | 'tracking' | 'workflow' | 'bol'
  >('combined');
  const [bolData, setBolData] = useState<BOLData | null>(null);
  const [showBOLModal, setShowBOLModal] = useState(false);

  // Workflow step definitions with BOL integration
  const workflowSteps: WorkflowStep[] = [
    {
      id: 'load_assignment_confirmation',
      name: 'Load Assignment Confirmation',
      status: 'pending',
      icon: '✅',
      color: '#3b82f6',
      description: 'Driver confirms load assignment and reviews details',
    },
    {
      id: 'rate_confirmation_review',
      name: 'Rate Confirmation Review',
      status: 'pending',
      icon: '💰',
      color: '#8b5cf6',
      description: 'Driver reviews and confirms rate agreement',
    },
    {
      id: 'rate_confirmation_verification',
      name: 'Rate Confirmation Verification',
      status: 'pending',
      icon: '✍️',
      color: '#06b6d4',
      description: 'Rate confirmation is verified and documented',
    },
    {
      id: 'bol_generation',
      name: 'BOL Generation',
      status: 'pending',
      icon: '📄',
      color: '#10b981',
      description: 'Bill of Lading is automatically generated',
    },
    {
      id: 'bol_receipt_confirmation',
      name: 'BOL Receipt Confirmation',
      status: 'pending',
      icon: '📋',
      color: '#f59e0b',
      description: 'Driver receives and confirms BOL',
    },
    {
      id: 'bol_verification',
      name: 'BOL Verification',
      status: 'pending',
      icon: '✅',
      color: '#84cc16',
      description: 'BOL details are verified for accuracy',
    },
    {
      id: 'pickup_authorization',
      name: 'Pickup Authorization',
      status: 'pending',
      icon: '🟢',
      color: '#f97316',
      description: 'Driver receives pickup authorization',
    },
    {
      id: 'pickup_arrival',
      name: 'Pickup Arrival',
      status: 'pending',
      icon: '📍',
      color: '#ef4444',
      description: 'Driver arrives at pickup location',
    },
    {
      id: 'pickup_completion',
      name: 'Pickup Completion',
      status: 'pending',
      icon: '📦',
      color: '#6366f1',
      description: 'Pickup is completed and BOL is signed',
    },
    {
      id: 'transit_start',
      name: 'Transit Start',
      status: 'pending',
      icon: '🚛',
      color: '#ec4899',
      description: 'Transit journey begins',
    },
    {
      id: 'transit_tracking',
      name: 'Transit Tracking',
      status: 'pending',
      icon: '📱',
      color: '#8b5cf6',
      description: 'Real-time tracking during transit',
    },
    {
      id: 'delivery_arrival',
      name: 'Delivery Arrival',
      status: 'pending',
      icon: '🏁',
      color: '#059669',
      description: 'Driver arrives at delivery location',
    },
    {
      id: 'delivery_completion',
      name: 'Delivery Completion',
      status: 'pending',
      icon: '📸',
      color: '#dc2626',
      description: 'Delivery is completed and documented',
    },
    {
      id: 'pod_submission',
      name: 'POD Submission',
      status: 'pending',
      icon: '📤',
      color: '#7c2d12',
      description: 'Proof of Delivery is submitted',
    },
  ];

  // Initialize tracking data
  useEffect(() => {
    const initializeTracking = () => {
      // Default values for when no load is provided (demo mode)
      const defaultLoad = {
        id: 'DEMO-001',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        pickupDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'In Transit',
      };

      const currentLoad = load || defaultLoad;
      const currentDriverName = driverName || 'Demo Driver';
      const currentDriverId = driverId || 'DRV-001';

      setTrackingData({
        loadId: currentLoad.id,
        currentLocation: {
          lat: 33.749 + Math.random() * 0.1,
          lng: -84.388 + Math.random() * 0.1,
          timestamp: new Date().toISOString(),
          speed: 65 + Math.random() * 10,
          heading: 45,
        },
        status:
          currentLoad.status === 'In Transit' ? 'in_transit' : 'at_pickup',
        eta: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        distance: {
          total: 647,
          remaining: 423,
          traveled: 224,
        },
        driver: {
          name: currentDriverName,
          phone: '(555) 123-4567',
          id: currentDriverId,
        },
        vehicle: {
          unit: 'TRK-2024-001',
          make: 'Freightliner',
          model: 'Cascadia',
        },
        milestones: [
          {
            type: 'pickup',
            location: currentLoad.origin,
            expectedTime: currentLoad.pickupDate,
            actualTime:
              currentLoad.status !== 'Available'
                ? new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                : undefined,
            status:
              currentLoad.status !== 'Available' ? 'completed' : 'pending',
          },
          {
            type: 'checkpoint',
            location: 'Macon, GA',
            expectedTime: new Date(
              Date.now() + 1 * 60 * 60 * 1000
            ).toISOString(),
            status: 'pending',
          },
          {
            type: 'delivery',
            location: currentLoad.destination,
            expectedTime: currentLoad.deliveryDate,
            status: 'pending',
          },
        ],
        lastUpdate: new Date().toISOString(),
      });
    };

    initializeTracking();
  }, [load, driverName, driverId]);

  // Initialize workflow
  useEffect(() => {
    const initializeWorkflow = () => {
      const currentLoadId = load?.id || 'DEMO-001';
      const currentDriverId = driverId || 'DRV-001';

      let currentWorkflow = workflowManager.getWorkflow(currentLoadId);
      if (!currentWorkflow) {
        currentWorkflow = workflowManager.initializeLoadWorkflow(
          currentLoadId,
          currentDriverId,
          'DSP-001'
        );
      }
      setWorkflow(currentWorkflow);
      updateWorkflowStatus(currentWorkflow);
      setIsLoading(false);
    };

    initializeWorkflow();
  }, [load?.id, driverId]);

  // Auto-refresh both tracking and workflow
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Update tracking data
      if (trackingData) {
        setTrackingData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentLocation: {
              ...prev.currentLocation,
              lat: prev.currentLocation.lat + (Math.random() - 0.5) * 0.01,
              lng: prev.currentLocation.lng + (Math.random() - 0.5) * 0.01,
              timestamp: new Date().toISOString(),
              speed: 65 + Math.random() * 10,
            },
            distance: {
              ...prev.distance,
              remaining: Math.max(
                0,
                prev.distance.remaining - Math.random() * 2
              ),
              traveled: prev.distance.traveled + Math.random() * 2,
            },
            lastUpdate: new Date().toISOString(),
          };
        });
      }

      // Update workflow status
      const currentLoadId = load?.id || 'DEMO-001';
      const updatedWorkflow = workflowManager.getWorkflow(currentLoadId);
      if (updatedWorkflow) {
        setWorkflow(updatedWorkflow);
        updateWorkflowStatus(updatedWorkflow);
      }

      setLastUpdate(new Date().toISOString());
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, trackingData, load?.id]);

  const updateWorkflowStatus = (currentWorkflow: LoadWorkflow) => {
    const updatedSteps = workflowSteps.map((step) => {
      const workflowStep = currentWorkflow.steps.find((s) => s.id === step.id);
      if (!workflowStep) return step;

      let status: 'completed' | 'current' | 'pending' | 'error' = 'pending';
      if (workflowStep.completed) {
        status = 'completed';
      } else if (
        currentWorkflow.currentStep ===
        currentWorkflow.steps.findIndex((s) => s.id === step.id)
      ) {
        status = 'current';
      }

      return {
        ...step,
        status,
        completedAt: workflowStep.completedAt,
        completedBy: workflowStep.completedBy,
        data: workflowStep.data,
      };
    });

    const currentStepIndex = updatedSteps.findIndex(
      (step) => step.status === 'current'
    );
    const currentStep =
      currentStepIndex >= 0 ? updatedSteps[currentStepIndex] : null;
    setCurrentStep(currentStep);

    const completedSteps = updatedSteps.filter(
      (step) => step.status === 'completed'
    ).length;
    const totalSteps = updatedSteps.length;
    const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
    setWorkflowProgress(progressPercentage);

    // Auto-generate BOL when rate confirmation is completed
    const rateConfirmationStep = updatedSteps.find(
      (step) => step.id === 'rate_confirmation_verification'
    );
    if (rateConfirmationStep?.status === 'completed' && !bolData) {
      generateBOL();
    }
  };

  const generateBOL = () => {
    const currentLoad = load || {
      id: 'DEMO-001',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
    };
    const currentDriverName = driverName || 'Demo Driver';

    const newBOLData: BOLData = {
      bolNumber: `BOL-${currentLoad.id.replace(/\D/g, '').slice(-6)}-001`,
      shipperInfo: {
        name: 'Shipper Company Inc.',
        address: '123 Shipping Lane',
        city: currentLoad.origin.split(',')[0].trim(),
        state: currentLoad.origin.split(',')[1]?.trim() || 'TX',
        zipCode: '75001',
      },
      consigneeInfo: {
        name: 'Consignee Company LLC',
        address: '456 Delivery Drive',
        city: currentLoad.destination.split(',')[0].trim(),
        state: currentLoad.destination.split(',')[1]?.trim() || 'GA',
        zipCode: '30301',
      },
      freightDetails: {
        description: 'General Freight',
        weight: 20000,
        pieces: 10,
        class: '70',
      },
      specialInstructions: 'Handle with care',
      generatedAt: new Date().toISOString(),
      signedBy: currentDriverName,
      signatureDate: new Date().toISOString(),
    };
    setBolData(newBOLData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_transit':
        return 'text-green-600 bg-green-100';
      case 'at_pickup':
        return 'text-blue-600 bg-blue-100';
      case 'at_delivery':
        return 'text-purple-600 bg-purple-100';
      case 'delayed':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_transit':
        return '🚛 In Transit';
      case 'at_pickup':
        return '📦 At Pickup';
      case 'at_delivery':
        return '🏢 At Delivery';
      case 'delayed':
        return '⚠️ Delayed';
      case 'completed':
        return '✅ Completed';
      default:
        return '📍 Unknown';
    }
  };

  const calculateTrackingProgress = () => {
    if (!trackingData) return 0;
    return Math.round(
      (trackingData.distance.traveled / trackingData.distance.total) * 100
    );
  };

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        padding: '32px',
        color: 'white',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '36px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
              }}
            >
              🎯 Live Tracking & Workflow
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.7)',
                margin: '8px 0 0 0',
              }}
            >
              Load {load?.id || 'DEMO-001'} • Driver:{' '}
              {driverName || 'Demo Driver'}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px 24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Route Progress
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#3b82f6',
                }}
              >
                {trackingData ? calculateTrackingProgress() : 0}%
              </div>
            </div>
            <div
              style={{
                width: '1px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.2)',
              }}
            ></div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Workflow
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#8b5cf6',
                }}
              >
                {workflowProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'combined', label: '📊 Overview', icon: '📊' },
            { id: 'tracking', label: '📍 Live Map', icon: '📍' },
            { id: 'workflow', label: '🔄 Progress', icon: '🔄' },
            { id: 'bol', label: '📄 Documents', icon: '📄' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 24px',
                borderRadius: '12px',
                border:
                  activeTab === tab.id
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                background:
                  activeTab === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.15)',
                color: activeTab === tab.id ? '#1e40af' : 'white',
                backdropFilter: 'blur(10px)',
                transform:
                  activeTab === tab.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow:
                  activeTab === tab.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                    : 'none',
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'combined' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Stats Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            {/* Route Progress Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    Route Progress
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 2px 0',
                    }}
                  >
                    {trackingData ? calculateTrackingProgress() : 0}%
                  </p>
                  <p style={{ color: '#4ade80', fontSize: '10px', margin: 0 }}>
                    {trackingData?.distance.traveled || 0} of{' '}
                    {trackingData?.distance.total || 0} mi
                  </p>
                </div>
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📍</span>
                </div>
              </div>
            </div>

            {/* Miles Remaining Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    Miles Remaining
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 2px 0',
                    }}
                  >
                    {trackingData?.distance.remaining || 0}
                  </p>
                  <p style={{ color: '#4ade80', fontSize: '10px', margin: 0 }}>
                    ETA:{' '}
                    {trackingData
                      ? new Date(trackingData.eta).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '--:--'}
                  </p>
                </div>
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🛣️</span>
                </div>
              </div>
            </div>

            {/* Workflow Progress Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    Workflow Complete
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 2px 0',
                    }}
                  >
                    {workflowProgress}%
                  </p>
                  <p
                    style={{
                      color: '#4ade80',
                      fontSize: '10px',
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentStep
                      ? `Current: ${currentStep.name}`
                      : 'All steps complete'}
                  </p>
                </div>
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🔄</span>
                </div>
              </div>
            </div>

            {/* Driver Status Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '12px',
                      margin: '0 0 4px 0',
                      fontWeight: '500',
                    }}
                  >
                    Driver Status
                  </p>
                  <p
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      margin: '0 0 2px 0',
                    }}
                  >
                    {trackingData?.status === 'in_transit' ? 'Active' : 'Idle'}
                  </p>
                  <p style={{ color: '#4ade80', fontSize: '10px', margin: 0 }}>
                    Speed: {trackingData?.currentLocation.speed || 0} mph
                  </p>
                </div>
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(245, 158, 11, 0.2)',
                    borderRadius: '8px',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '20px' }}>👨‍💼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
            }}
          >
            {/* Live Tracking Panel */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(59, 130, 246, 0.2)',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📍</span>
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: 'white',
                  }}
                >
                  Live Tracking Details
                </h3>
              </div>

              {trackingData && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Current Location */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 12px 0',
                        fontWeight: '500',
                      }}
                    >
                      Current Location
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Speed:
                        </span>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                          }}
                        >
                          {trackingData.currentLocation.speed} mph
                        </div>
                      </div>
                      <div>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Heading:
                        </span>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                          }}
                        >
                          {trackingData.currentLocation.heading}°
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Route Progress
                      </span>
                      <span
                        style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                        }}
                      >
                        {calculateTrackingProgress()}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #3b82f6, #06b6d4)',
                          borderRadius: '4px',
                          width: `${calculateTrackingProgress()}%`,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 12px 0',
                        fontWeight: '500',
                      }}
                    >
                      Vehicle Information
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Unit:
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          TRK-2024-001
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Make/Model:
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          Freightliner Cascadia
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          Last Update:
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: 'white',
                            fontWeight: '500',
                          }}
                        >
                          {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Workflow Progress Panel */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    background: 'rgba(139, 92, 246, 0.2)',
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🔄</span>
                </div>
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    margin: 0,
                    color: 'white',
                  }}
                >
                  Workflow Progress
                </h3>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {/* Overall Progress */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}
                    >
                      Overall Progress
                    </span>
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#8b5cf6',
                      }}
                    >
                      {workflowProgress}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
                        borderRadius: '4px',
                        width: `${workflowProgress}%`,
                        transition: 'width 0.5s ease',
                      }}
                    />
                  </div>
                </div>

                {/* Current Step */}
                {currentStep && (
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        fontSize: '14px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        margin: '0 0 8px 0',
                        fontWeight: '500',
                      }}
                    >
                      CURRENT STEP
                    </h4>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '4px',
                      }}
                    >
                      {currentStep.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.6)',
                      }}
                    >
                      {currentStep.description}
                    </div>
                  </div>
                )}

                {/* BOL Status */}
                {bolData && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>📄</span>
                      <h4
                        style={{
                          fontSize: '14px',
                          color: '#10b981',
                          margin: 0,
                          fontWeight: '500',
                        }}
                      >
                        BOL GENERATED
                      </h4>
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#10b981',
                        marginBottom: '4px',
                      }}
                    >
                      {bolData.bolNumber}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'rgba(16, 185, 129, 0.8)',
                      }}
                    >
                      Generated:{' '}
                      {new Date(bolData.generatedAt!).toLocaleString()}
                    </div>
                  </div>
                )}

                {/* Recent Steps */}
                <div>
                  <h4
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 12px 0',
                      fontWeight: '500',
                    }}
                  >
                    WORKFLOW TIMELINE
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {workflowSteps.slice(0, 4).map((step, index) => (
                      <div
                        key={step.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px',
                          borderRadius: '8px',
                          background:
                            step.status === 'current'
                              ? 'rgba(59, 130, 246, 0.1)'
                              : 'transparent',
                        }}
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            background:
                              step.status === 'completed'
                                ? '#10b981'
                                : step.status === 'current'
                                  ? '#3b82f6'
                                  : 'rgba(255, 255, 255, 0.2)',
                            color:
                              step.status === 'completed' ||
                              step.status === 'current'
                                ? 'white'
                                : 'rgba(255, 255, 255, 0.6)',
                          }}
                        >
                          {step.status === 'completed' ? '✓' : step.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              color: 'white',
                            }}
                          >
                            {step.name}
                          </div>
                          <div
                            style={{
                              fontSize: '10px',
                              color: 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {step.description}
                          </div>
                        </div>
                        {step.status === 'current' && (
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#3b82f6',
                              fontWeight: '500',
                            }}
                          >
                            IN PROGRESS
                          </div>
                        )}
                        {step.status === 'completed' && (
                          <div
                            style={{
                              fontSize: '10px',
                              color: '#10b981',
                              fontWeight: '500',
                            }}
                          >
                            COMPLETED
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Tab */}
      {activeTab === 'tracking' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            minHeight: '500px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🗺️</span>
            </div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: 'white',
              }}
            >
              Live Map View
            </h3>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '32px',
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
            <h4
              style={{ fontSize: '18px', color: 'white', margin: '0 0 8px 0' }}
            >
              Interactive Map Coming Soon
            </h4>
            <p
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                margin: 0,
              }}
            >
              Real-time GPS tracking with route visualization
            </p>
          </div>
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>🔄</span>
            </div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: 'white',
              }}
            >
              Detailed Workflow Steps
            </h3>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {workflowSteps.map((step, index) => (
              <div
                key={step.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    background:
                      step.status === 'completed'
                        ? '#10b981'
                        : step.status === 'current'
                          ? '#3b82f6'
                          : 'rgba(255, 255, 255, 0.2)',
                    color:
                      step.status === 'completed' || step.status === 'current'
                        ? 'white'
                        : 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {step.status === 'completed' ? '✓' : step.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {step.name}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                    }}
                  >
                    {step.description}
                  </div>
                </div>
                <div
                  style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background:
                      step.status === 'completed'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : step.status === 'current'
                          ? 'rgba(59, 130, 246, 0.2)'
                          : 'rgba(255, 255, 255, 0.1)',
                    color:
                      step.status === 'completed'
                        ? '#10b981'
                        : step.status === 'current'
                          ? '#3b82f6'
                          : 'rgba(255, 255, 255, 0.6)',
                  }}
                >
                  {step.status === 'completed'
                    ? 'COMPLETED'
                    : step.status === 'current'
                      ? 'IN PROGRESS'
                      : 'PENDING'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOL Tab */}
      {activeTab === 'bol' && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                padding: '8px',
                background: 'rgba(245, 158, 11, 0.2)',
                borderRadius: '8px',
              }}
            >
              <span style={{ fontSize: '20px' }}>📄</span>
            </div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: 'bold',
                margin: 0,
                color: 'white',
              }}
            >
              Bill of Lading Documents
            </h3>
          </div>

          {bolData ? (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontSize: '18px',
                      color: 'white',
                      margin: '0 0 4px 0',
                    }}
                  >
                    BOL #{bolData.bolNumber}
                  </h4>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: 0,
                    }}
                  >
                    Generated: {new Date(bolData.generatedAt!).toLocaleString()}
                  </p>
                </div>
                <button
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  📄 View Full Document
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
              >
                <div>
                  <h5
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    SHIPPER INFORMATION
                  </h5>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      lineHeight: '1.4',
                    }}
                  >
                    <div>{bolData.shipperInfo.name}</div>
                    <div>{bolData.shipperInfo.address}</div>
                    <div>
                      {bolData.shipperInfo.city}, {bolData.shipperInfo.state}{' '}
                      {bolData.shipperInfo.zipCode}
                    </div>
                  </div>
                </div>
                <div>
                  <h5
                    style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '0 0 8px 0',
                    }}
                  >
                    CONSIGNEE INFORMATION
                  </h5>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'white',
                      lineHeight: '1.4',
                    }}
                  >
                    <div>{bolData.consigneeInfo.name}</div>
                    <div>{bolData.consigneeInfo.address}</div>
                    <div>
                      {bolData.consigneeInfo.city},{' '}
                      {bolData.consigneeInfo.state}{' '}
                      {bolData.consigneeInfo.zipCode}
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <h5
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '0 0 8px 0',
                  }}
                >
                  FREIGHT DETAILS
                </h5>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px',
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Description:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {bolData.freightDetails.description}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Weight:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {bolData.freightDetails.weight} lbs
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      Pieces:
                    </span>
                    <div style={{ color: 'white', fontWeight: '500' }}>
                      {bolData.freightDetails.pieces}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '32px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
              <h4
                style={{
                  fontSize: '16px',
                  color: 'white',
                  margin: '0 0 8px 0',
                }}
              >
                No BOL Generated Yet
              </h4>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  margin: 0,
                }}
              >
                BOL will be automatically generated when rate confirmation is
                verified
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
