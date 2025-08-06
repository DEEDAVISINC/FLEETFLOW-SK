'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import GlobalNotificationBell from '../components/GlobalNotificationBell';
import { Load } from '../services/loadService';

// Import comprehensive workflow system (remove duplicate interfaces)
import { LoadWorkflow, workflowManager } from '../../lib/workflowManager';

// Photo configuration for workflows
interface LoadPhotoConfig {
  pickupPhotosRequired: boolean;
  deliveryPhotosRequired: boolean;
  minimumPhotos: number;
  canSkipPhotos: boolean;
  photoTypes?: string[];
}

// 🚨 LOAD ALERT SYSTEM INTERFACES
interface LoadAlert {
  id: string;
  load: Load;
  alertType: 'new_load' | 'urgent_load' | 'replacement_load';
  timeToExpire: number; // seconds remaining
  originalDuration: number; // original alert duration in seconds
  priority: 'high' | 'medium' | 'low';
  dispatcherName: string;
  dispatcherId: string;
  createdAt: Date;
  status: 'active' | 'accepted' | 'expired' | 'declined';
  soundAlert: boolean;
  vibrationAlert: boolean;
  visualAlert: 'flash' | 'pulse' | 'glow';
  message?: string; // Custom message from dispatcher
  acceptedBy?: string; // Driver ID who accepted (if any)
  acceptedAt?: Date;
}

interface AlertQueueManager {
  activeAlerts: LoadAlert[];
  alertHistory: LoadAlert[];
  totalAlertsToday: number;
  acceptedAlertsToday: number;
  acceptanceRate: number;
  averageResponseTime: number; // seconds
}

// User role and portal configuration interfaces
interface UserRole {
  type: 'owner_operator' | 'company_driver' | 'fleet_manager' | 'dispatcher';
  permissions: string[];
  portalSections: string[];
  businessType:
    | 'owner_operator'
    | 'small_fleet'
    | 'company_fleet'
    | 'mixed_operation';
}

interface UnifiedPortalUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  tenantId: string;
  tenantName: string;
  // Company Regulatory Information
  companyInfo: {
    mcNumber: string;
    dotNumber: string;
    safetyRating: string;
    insuranceProvider: string;
    operatingStatus: string;
  };
  // Dispatcher Information
  dispatcher: {
    name: string;
    phone: string;
    email: string;
    department: string;
    availability: string;
    responsiveness: string;
  };
  // Visual Identity
  photos: {
    vehicleEquipment?: string; // URL to vehicle equipment photo
    userPhotoOrLogo?: string; // URL to user photo or company logo
  };
}

interface PortalSection {
  id: string;
  title: string;
  icon: string;
  component: React.ReactNode;
  requiredPermissions: string[];
  allowedRoles: string[];
}

// Mock current user - in production this would come from authentication
const MOCK_USER: UnifiedPortalUser = {
  id: 'JD-OO-2025002',
  name: 'John Davis',
  email: 'john.davis@abctransport.com',
  phone: '+1 (555) 123-4567',
  role: {
    type: 'owner_operator',
    permissions: [
      'my_loads_workflow',
      'document_upload',
      'eld_integration',
      'load_status',
      'load_board_access',
      'bid_management',
      'business_metrics',
      'invoice_management',
      'settlement_reports',
    ],
    portalSections: [
      'dashboard',
      'my_loads',
      'load_board',
      'business',
      'documents',
      'communication',
    ],
    businessType: 'owner_operator',
  },
  tenantId: 'tenant_abc_transport',
  tenantName: 'ABC Transport LLC',
  // Company Regulatory Information
  companyInfo: {
    mcNumber: 'MC-789456',
    dotNumber: 'DOT-2345678',
    safetyRating: 'Satisfactory',
    insuranceProvider: 'Commercial Transport Insurance',
    operatingStatus: 'Active',
  },
  // Dispatcher Information
  dispatcher: {
    name: 'Sarah Martinez',
    phone: '+1 (555) 987-6543',
    email: 'dispatch@abctransport.com',
    department: 'Dispatch Central',
    availability: 'Available 24/7',
    responsiveness: 'Avg Response: 8 mins',
  },
  // Visual Identity
  photos: {
    vehicleEquipment:
      'https://images.unsplash.com/photo-1558618047-f0c1b401b0cf?w=150&h=150&fit=crop&auto=format', // Mock truck photo
    userPhotoOrLogo:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format', // Mock professional headshot
  },
};

export default function UnifiedPortal() {
  const [currentUser, setCurrentUser] = useState<UnifiedPortalUser>(MOCK_USER);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [assignedLoads, setAssignedLoads] = useState<Load[]>([]);
  const [availableLoads, setAvailableLoads] = useState<Load[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeWorkflow, setActiveWorkflow] = useState<LoadWorkflow | null>(
    null
  );
  const [workflowHistory, setWorkflowHistory] = useState<LoadWorkflow[]>([]);

  // Separate state for loads waiting for acceptance vs accepted loads
  const [loadsWaitingForAcceptance, setLoadsWaitingForAcceptance] = useState<
    Load[]
  >([]);
  const [acceptedLoads, setAcceptedLoads] = useState<Load[]>([]);

  // 🚨 LOAD ALERT SYSTEM STATE MANAGEMENT
  const [loadAlerts, setLoadAlerts] = useState<LoadAlert[]>([]);
  const [alertQueue, setAlertQueue] = useState<AlertQueueManager>({
    activeAlerts: [],
    alertHistory: [],
    totalAlertsToday: 0,
    acceptedAlertsToday: 0,
    acceptanceRate: 0,
    averageResponseTime: 0,
  });
  const [alertSoundsEnabled, setAlertSoundsEnabled] = useState(true);
  const [alertVibrationEnabled, setAlertVibrationEnabled] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Load assigned loads for driver workflow
        if (
          currentUser.role.permissions.includes('my_loads_workflow') ||
          currentUser.role.permissions.includes('assigned_loads_only')
        ) {
          // Mock loads waiting for acceptance (status: 'Assigned')
          setLoadsWaitingForAcceptance([
            {
              id: 'FL-2025-WAIT-001',
              status: 'Assigned', // Waiting for driver acceptance
              origin: 'Atlanta, GA',
              destination: 'Miami, FL',
              rate: 2850,
              weight: '42,000 lbs',
              equipment: 'Dry Van',
              pickupDate: '2025-01-15',
              deliveryDate: '2025-01-16',
              brokerName: 'ABC Logistics',
              distance: '647 mi',
              brokerId: 'broker_001',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              flowStage: 'dispatch_central',
              dispatcherId: 'dispatcher-001',
              dispatcherName: 'John Dispatcher',
              // Include photo requirements from shipper
              photoConfig: {
                pickupPhotosRequired: true,
                deliveryPhotosRequired: true,
                minimumPhotos: 2,
                canSkipPhotos: false,
                photoTypes: [
                  'loaded_truck',
                  'bill_of_lading',
                  'unloaded_truck',
                  'delivery_receipt',
                ],
                shipperRequirement: true,
                brokerOverride: false,
                specialPhotoInstructions:
                  'High-value cargo - clear photos required',
              },
            },
            {
              id: 'FL-2025-WAIT-002',
              status: 'Assigned', // Waiting for driver acceptance
              origin: 'Chicago, IL',
              destination: 'Houston, TX',
              rate: 3200,
              weight: '35,000 lbs',
              equipment: 'Reefer',
              pickupDate: '2025-01-16',
              deliveryDate: '2025-01-18',
              brokerName: 'Swift Freight',
              distance: '925 mi',
              brokerId: 'broker_002',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              flowStage: 'dispatch_central',
              dispatcherId: 'dispatcher-002',
              dispatcherName: 'Sarah Dispatcher',
              // Photo requirements from different shipper
              photoConfig: {
                pickupPhotosRequired: true,
                deliveryPhotosRequired: false, // Shipper doesn't require delivery photos
                minimumPhotos: 1,
                canSkipPhotos: true, // Shipper allows skipping photos
                photoTypes: ['loaded_truck', 'bill_of_lading'],
                shipperRequirement: true,
                brokerOverride: false,
              },
            },
          ]);

          // Mock accepted loads (already accepted by driver, ready for workflow)
          setAcceptedLoads([
            // Initially empty - loads move here after acceptance
          ]);

          // Keep assignedLoads for backward compatibility (combine both for now)
          setAssignedLoads([
            // This will be updated when loads are accepted
          ]);
        }

        // Load available loads for load board (carriers/owner-operators)
        if (currentUser.role.permissions.includes('load_board_access')) {
          const response = await fetch('/api/carrier-loads');
          if (response.ok) {
            const available = await response.json();
            setAvailableLoads(available);
          }
        }
      } catch (error) {
        console.error('Failed to load portal data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser]);

  // 🚨 COUNTDOWN TIMER MANAGEMENT
  useEffect(() => {
    const alertTimer = setInterval(() => {
      setLoadAlerts(prev => {
        const updatedAlerts = prev.map(alert => {
          if (alert.status === 'active' && alert.timeToExpire > 0) {
            const newTimeToExpire = alert.timeToExpire - 1;
            
            // Warning sounds at specific intervals
            if (newTimeToExpire === 60 || newTimeToExpire === 30 || newTimeToExpire === 10) {
              playAlertSound('urgent_load');
              triggerVibration([100, 50, 100, 50, 100]);
            }
            
            return { ...alert, timeToExpire: newTimeToExpire };
          }
          
          // Expire alert if time runs out
          if (alert.status === 'active' && alert.timeToExpire <= 0) {
            return { ...alert, status: 'expired' as const };
          }
          
          return alert;
        });

        // Move expired alerts to history
        const expiredAlerts = updatedAlerts.filter(a => a.status === 'expired');
        if (expiredAlerts.length > 0) {
          setAlertQueue(prev => ({
            ...prev,
            alertHistory: [...prev.alertHistory, ...expiredAlerts],
          }));
        }

        // Keep only active alerts
        return updatedAlerts.filter(a => a.status === 'active');
      });
    }, 1000); // Update every second

    return () => clearInterval(alertTimer);
  }, [alertSoundsEnabled]);

  // 🚨 SIMULATE INCOMING LOAD ALERTS (Demo Data)
  useEffect(() => {
    // Create first demo alert after 10 seconds
    const firstAlert = setTimeout(() => {
      const demoAlert = createLoadAlert({
        id: `FL-2025-DEMO-${Date.now()}`,
        status: 'Available',
        origin: 'Atlanta, GA',
        destination: 'Miami, FL',
        rate: 2850,
        weight: '42,000 lbs',
        equipment: 'Dry Van',
        pickupDate: new Date().toISOString().split('T')[0],
        deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        brokerName: 'Express Logistics',
        distance: '647 mi',
        brokerId: 'broker_express',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        flowStage: 'broker_board',
        dispatcherId: 'dispatcher-001',
        dispatcherName: 'Sarah Martinez',
      }, 'new_load', 15);

      setLoadAlerts(prev => [...prev, demoAlert]);
      setAlertQueue(prev => ({
        ...prev,
        totalAlertsToday: prev.totalAlertsToday + 1,
        activeAlerts: [...prev.activeAlerts, demoAlert],
      }));

      playAlertSound(demoAlert.alertType);
      triggerVibration([200, 100, 200, 100, 200]);
      
      console.log(`🚨 Demo load alert created: ${demoAlert.alertType}`);
    }, 10000);

    return () => clearTimeout(firstAlert);
  }, []);

  // Check if user has permission for a specific action
  const hasPermission = (permission: string): boolean => {
    return currentUser.role.permissions.includes(permission);
  };

  // Accept a load (move from waiting to accepted)
  const acceptLoad = async (load: Load) => {
    try {
      // Update load status to 'In Transit' (valid Load status)
      const updatedLoad: Load = {
        ...load,
        status: 'In Transit',
        updatedAt: new Date().toISOString(),
      };

      // Move from waiting to accepted
      setLoadsWaitingForAcceptance((prev) =>
        prev.filter((l) => l.id !== load.id)
      );
      setAcceptedLoads((prev) => [...prev, updatedLoad]);
      setAssignedLoads((prev) => [...prev, updatedLoad]);

      console.log('✅ Load accepted:', load.id);

      // Optional: Send notification to dispatcher
      // notifyDispatcher(load.dispatcherId, `Driver accepted load ${load.id}`);
    } catch (error) {
      console.error('❌ Failed to accept load:', error);
      alert('Failed to accept load. Please try again.');
    }
  };

  // Use comprehensive workflow manager instead of simplified system
  const startWorkflow = async (load: Load) => {
    try {
      // Get photo configuration from load data (flows from shipper → broker → driver)
      const photoConfig = load.photoConfig
        ? {
            pickupPhotosRequired: load.photoConfig.pickupPhotosRequired,
            deliveryPhotosRequired: load.photoConfig.deliveryPhotosRequired,
            minimumPhotos: load.photoConfig.minimumPhotos,
            canSkipPhotos: load.photoConfig.canSkipPhotos, // Only photos can be skipped
            photoTypes: load.photoConfig.photoTypes,
          }
        : {
            // Default configuration if not specified
            pickupPhotosRequired: true,
            deliveryPhotosRequired: true,
            minimumPhotos: 2,
            canSkipPhotos: false, // Photos cannot be skipped by default
            photoTypes: [
              'loaded_truck',
              'bill_of_lading',
              'unloaded_truck',
              'delivery_receipt',
            ],
          };

      // Initialize comprehensive 12-step workflow with photo configuration
      const workflow = workflowManager.initializeLoadWorkflow(
        load.id,
        currentUser.id,
        load.dispatcherId || 'dispatcher-001',
        photoConfig
      );

      setActiveWorkflow(workflow);
      setActiveSection('workflow');

      console.log(
        '🚛 Workflow started for load:',
        load.id,
        'with',
        workflow.steps.length,
        'steps',
        '| Photos:',
        photoConfig.pickupPhotosRequired || photoConfig.deliveryPhotosRequired
          ? 'Required'
          : 'Not Required'
      );
    } catch (error) {
      console.error('❌ Failed to start workflow:', error);
      alert('Failed to start workflow. Please try again.');
    }
  };

  // Complete a workflow step using comprehensive system
  const completeWorkflowStep = async (
    stepId: string,
    notes?: string,
    data?: any
  ) => {
    if (!activeWorkflow) return;

    try {
      // Use the correct completeStep signature (stepId, data, completedBy)
      await workflowManager.completeStep(
        stepId as any, // Cast to WorkflowStepId
        data || {},
        currentUser.id
      );

      // Get updated workflow
      const updatedWorkflow = workflowManager.getWorkflow(
        activeWorkflow.loadId
      );

      if (updatedWorkflow) {
        setActiveWorkflow(updatedWorkflow);

        // Check if workflow is completed
        if (updatedWorkflow.status === 'completed') {
          // Add to history
          setWorkflowHistory((prev) => [...prev, updatedWorkflow]);

          // Clear active workflow after a brief delay to show completion
          setTimeout(() => {
            setActiveWorkflow(null);
            setActiveSection('my_loads');
          }, 2000);

          console.log(
            '✅ Workflow completed for load:',
            updatedWorkflow.loadId
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to complete workflow step:', error);
      alert('Failed to complete step. Please try again.');
    }
  };

  // Check if user role can access a section
  const canAccessSection = (sectionId: string): boolean => {
    return currentUser.role.portalSections.includes(sectionId);
  };

  // Get department color based on user role
  const getDepartmentColor = (roleType: string): string => {
    switch (roleType) {
      case 'owner_operator':
      case 'company_driver':
        return '#f4a832'; // Yellow for drivers/owner operators
      case 'dispatcher':
        return '#3b82f6'; // Blue for dispatchers
      case 'broker':
        return '#f97316'; // Orange for brokers
      case 'fleet_manager':
      case 'manager':
        return '#6366f1'; // Purple for management
      default:
        return '#ffffff'; // White as fallback
    }
  };

  // Render vehicle or user photo with fallback to emoji
  const renderVehicleImage = (size: string = '32px') => {
    if (currentUser.photos.vehicleEquipment) {
      return (
        <img
          src={currentUser.photos.vehicleEquipment}
          alt=''
          style={{
            width: size,
            height: size,
            borderRadius: '8px',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      );
    }
    return <span style={{ fontSize: size }}>🚛</span>;
  };

  const renderUserImage = (size: string = '32px') => {
    if (currentUser.photos.userPhotoOrLogo) {
      return (
        <img
          src={currentUser.photos.userPhotoOrLogo}
          alt=''
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid rgba(255, 255, 255, 0.2)',
          }}
        />
      );
    }
    return <span style={{ fontSize: size }}>👨‍💼</span>;
  };

  // 🚨 LOAD ALERT MANAGEMENT FUNCTIONS
  const playAlertSound = (alertType: 'new_load' | 'urgent_load' | 'replacement_load') => {
    if (!alertSoundsEnabled) return;
    try {
      const frequency = alertType === 'urgent_load' ? 800 : alertType === 'new_load' ? 600 : 500;
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.3, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  const triggerVibration = (pattern: number[] = [200, 100, 200]) => {
    if (!alertVibrationEnabled || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  };

  const createLoadAlert = (load: Load, alertType: 'new_load' | 'urgent_load' | 'replacement_load', durationMinutes: number = 15): LoadAlert => {
    const durationSeconds = durationMinutes * 60;
    return {
      id: `alert-${load.id}-${Date.now()}`,
      load,
      alertType,
      timeToExpire: durationSeconds,
      originalDuration: durationSeconds,
      priority: alertType === 'urgent_load' ? 'high' : 'medium',
      dispatcherName: load.dispatcherName || 'Dispatch Central',
      dispatcherId: load.dispatcherId || 'dispatcher-001',
      createdAt: new Date(),
      status: 'active',
      soundAlert: true,
      vibrationAlert: true,
      visualAlert: alertType === 'urgent_load' ? 'flash' : 'pulse',
      message: `New ${alertType.replace('_', ' ')} available: ${load.origin} → ${load.destination}`,
    };
  };

  const acceptLoadAlert = async (alertId: string) => {
    const alert = loadAlerts.find(a => a.id === alertId);
    if (!alert || alert.status !== 'active') return;
    try {
      setLoadAlerts(prev => prev.map(a => 
        a.id === alertId 
          ? { ...a, status: 'accepted', acceptedBy: currentUser.id, acceptedAt: new Date() }
          : a
      ));
      setAcceptedLoads(prev => [...prev, alert.load]);
      setAlertQueue(prev => ({
        ...prev,
        acceptedAlertsToday: prev.acceptedAlertsToday + 1,
        acceptanceRate: prev.totalAlertsToday > 0 ? ((prev.acceptedAlertsToday + 1) / prev.totalAlertsToday) * 100 : 0,
        alertHistory: [...prev.alertHistory, { ...alert, status: 'accepted' }],
      }));
      const workflow = workflowManager.initializeLoadWorkflow(
        alert.load.id,
        currentUser.id,
        alert.dispatcherId,
        alert.load.photoConfig || {
          pickupPhotosRequired: false,
          deliveryPhotosRequired: false,
          minimumPhotos: 0,
          canSkipPhotos: true,
        }
      );
      setActiveWorkflow(workflow);
      playAlertSound('new_load');
      console.log(`✅ Load alert accepted: ${alert.load.id}`);
    } catch (error) {
      console.error('Error accepting load alert:', error);
    }
  };

  const declineLoadAlert = (alertId: string) => {
    const alert = loadAlerts.find(a => a.id === alertId);
    if (!alert) return;
    setLoadAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: 'declined' }
        : a
    ));
    setAlertQueue(prev => ({
      ...prev,
      alertHistory: [...prev.alertHistory, { ...alert, status: 'declined' }],
    }));
    console.log(`❌ Load alert declined: ${alertId}`);
  };

  // 🚨 LOAD ALERT ROW COMPONENT - Linear Grid Loadboard Style
  const LoadAlertRow: React.FC<{ alert: LoadAlert }> = ({ alert }) => {
    const [timeRemaining, setTimeRemaining] = useState(alert.timeToExpire);

    useEffect(() => {
      setTimeRemaining(alert.timeToExpire);
    }, [alert.timeToExpire]);

    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = (): string => {
      if (timeRemaining <= 30) return '#dc2626'; // Red - Very urgent
      if (timeRemaining <= 60) return '#f59e0b'; // Amber - Urgent  
      if (timeRemaining <= 180) return '#eab308'; // Yellow - Warning
      return '#22c55e'; // Green - Safe
    };

    const getRowBackground = (): string => {
      if (alert.alertType === 'urgent_load') return 'rgba(220, 38, 38, 0.1)';
      if (timeRemaining <= 60) return 'rgba(245, 158, 11, 0.1)';
      return 'rgba(255, 255, 255, 0.05)';
    };

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 2fr 2fr 1fr 1fr 1fr 140px',
          gap: '12px',
          padding: '12px 20px',
          background: getRowBackground(),
          borderRadius: '8px',
          marginBottom: '6px',
          color: 'white',
          fontSize: '14px',
          transition: 'all 0.3s ease',
          border: `1px solid ${alert.priority === 'high' ? '#dc2626' : 'rgba(255, 255, 255, 0.1)'}`,
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = alert.alertType === 'urgent_load' 
            ? 'rgba(220, 38, 38, 0.15)' 
            : 'rgba(255, 255, 255, 0.1)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = getRowBackground();
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {/* Time Left Column */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: getTimeColor(),
          color: 'white',
          borderRadius: '6px',
          padding: '4px 8px',
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: 'monospace',
          textAlign: 'center',
        }}>
          {formatTime(timeRemaining)}
        </div>

        {/* Origin Column */}
        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          {alert.load.origin}
        </div>

        {/* Destination Column */}
        <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          {alert.load.destination}
        </div>

        {/* Rate Column */}
        <div style={{ 
          fontWeight: '700', 
          color: '#22c55e', 
          display: 'flex', 
          alignItems: 'center' 
        }}>
          ${alert.load.rate?.toLocaleString()}
        </div>

        {/* Details Column */}
        <div style={{ 
          fontSize: '12px', 
          color: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          lineHeight: '1.3'
        }}>
          <div>{alert.load.distance}</div>
          <div>{alert.load.equipment}</div>
        </div>

        {/* Dispatcher Column */}
        <div style={{ 
          color: '#60a5fa', 
          fontWeight: '600',
          display: 'flex', 
          alignItems: 'center',
          fontSize: '13px'
        }}>
          {alert.dispatcherName}
        </div>

        {/* Action Column */}
        <div style={{ 
          display: 'flex', 
          gap: '4px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => acceptLoadAlert(alert.id)}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ✅ Accept
          </button>
          <button
            onClick={() => declineLoadAlert(alert.id)}
            style={{
              background: 'linear-gradient(135deg, #6b7280, #4b5563)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              flex: 1,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(107, 114, 128, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ⏰ Decline
          </button>
        </div>

        {/* Progress bar at bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div
            style={{
              height: '100%',
              background: getTimeColor(),
              width: `${(timeRemaining / alert.originalDuration) * 100}%`,
              transition: 'all 1s ease',
            }}
          />
        </div>
      </div>
    );
  };

  // Dashboard Component
  const DashboardSection = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 🚨 TIME-RESTRICTED LOAD ALERTS - Priority Section */}
      {loadAlerts.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: 'bold',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              🚨 New Load Alerts
              <span
                style={{
                  background: '#dc2626',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '4px 8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {loadAlerts.length}
              </span>
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setAlertSoundsEnabled(!alertSoundsEnabled)}
                style={{
                  background: alertSoundsEnabled ? '#22c55e' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {alertSoundsEnabled ? '🔊' : '🔇'} Sound
              </button>
              <button
                onClick={() => setAlertVibrationEnabled(!alertVibrationEnabled)}
                style={{
                  background: alertVibrationEnabled ? '#22c55e' : '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                📱 Vibrate
              </button>
            </div>
          </div>

          <div>
            {/* Load Alert Board Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '100px 2fr 2fr 1fr 1fr 1fr 140px',
              gap: '12px',
              padding: '12px 20px',
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '8px',
              marginBottom: '8px',
              fontWeight: '600',
              color: 'white',
              fontSize: '14px'
            }}>
              <div>⏰ Time Left</div>
              <div>📍 Origin</div>
              <div>🏁 Destination</div>
              <div>💰 Rate</div>
              <div>📦 Details</div>
              <div>👤 Dispatcher</div>
              <div>🎯 Action</div>
            </div>

            {/* Load Alert Board Rows */}
            {loadAlerts
              .filter(alert => alert.status === 'active')
              .sort((a, b) => {
                if (a.priority !== b.priority) {
                  return a.priority === 'high' ? -1 : 1;
                }
                return a.timeToExpire - b.timeToExpire;
              })
              .map(alert => (
                <LoadAlertRow key={alert.id} alert={alert} />
              ))}
          </div>
        </div>
      )}

      {/* Alert Queue Stats */}
      {alertQueue.totalAlertsToday > 0 && (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              margin: '0 0 16px 0',
            }}
          >
            📊 Today's Alert Performance
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#60a5fa', fontSize: '24px', fontWeight: 'bold' }}>
                {alertQueue.totalAlertsToday}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Total Alerts
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#22c55e', fontSize: '24px', fontWeight: 'bold' }}>
                {alertQueue.acceptedAlertsToday}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Accepted
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#f59e0b', fontSize: '24px', fontWeight: 'bold' }}>
                {alertQueue.acceptanceRate.toFixed(1)}%
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Acceptance Rate
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#8b5cf6', fontSize: '24px', fontWeight: 'bold' }}>
                {loadAlerts.filter(a => a.status === 'active').length}
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>
                Active Now
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}
      >
        {/* Driver/Owner-Operator Stats */}
        {(hasPermission('my_loads_workflow') ||
          hasPermission('assigned_loads_only')) && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Active Loads
                </p>
                <p
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                  }}
                >
                  {assignedLoads.length}
                </p>
                <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                  Currently assigned
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(244, 168, 50, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {renderVehicleImage('24px')}
              </div>
            </div>
          </div>
        )}

        {/* Load Board Access */}
        {hasPermission('load_board_access') && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Available Loads
                </p>
                <p
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                  }}
                >
                  {availableLoads.length}
                </p>
                <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                  Ready to bid
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(20, 184, 166, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>📋</span>
              </div>
            </div>
          </div>
        )}

        {/* Business Metrics */}
        {hasPermission('business_metrics') && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Monthly Revenue
                </p>
                <p
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                  }}
                >
                  $12,450
                </p>
                <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                  +15% from last month
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(99, 102, 241, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>💰</span>
              </div>
            </div>
          </div>
        )}

        {/* Fleet Management */}
        {hasPermission('all_driver_oversight') && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Active Drivers
                </p>
                <p
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                  }}
                >
                  8
                </p>
                <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                  Fleet management
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>👥</span>
              </div>
            </div>
          </div>
        )}

        {/* Active Loads */}
        {hasPermission('my_loads_workflow') && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
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
              <div>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: '0 0 8px 0',
                    fontWeight: '500',
                  }}
                >
                  Active Loads
                </p>
                <p
                  style={{
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    margin: '0 0 4px 0',
                  }}
                >
                  {acceptedLoads.length}
                </p>
                <p style={{ color: '#4ade80', fontSize: '12px', margin: 0 }}>
                  Accepted & in workflow
                </p>
              </div>
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(244, 168, 50, 0.2)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {renderVehicleImage('24px')}
              </div>
            </div>
          </div>
        )}

        {/* Loads Waiting for Acceptance */}
        {(() => {
          console.log('🔍 Debug - Permission:', hasPermission('my_loads_workflow'), 'Data Length:', loadsWaitingForAcceptance.length, 'Data:', loadsWaitingForAcceptance);
          return null;
        })()}
        {hasPermission('my_loads_workflow') &&
          loadsWaitingForAcceptance.length > 0 && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  🔔 Loads Waiting for Acceptance
                </h3>
                <p
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '14px',
                    margin: 0,
                  }}
                >
                  Dispatcher has assigned these loads - accept to start workflow
                </p>
              </div>

              <div>
                {/* Loads Waiting for Acceptance - Loadboard Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 2fr 2fr 1fr 1fr 1fr 120px',
                  gap: '12px',
                  padding: '12px 20px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  fontWeight: '600',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <div>📋 Load ID</div>
                  <div>📍 Origin</div>
                  <div>🏁 Destination</div>
                  <div>💰 Rate</div>
                  <div>📦 Details</div>
                  <div>👤 Dispatcher</div>
                  <div>🎯 Action</div>
                </div>

                {/* Loads Waiting for Acceptance - Loadboard Rows */}
                {loadsWaitingForAcceptance.map((load) => (
                  <div
                    key={load.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '120px 2fr 2fr 1fr 1fr 1fr 120px',
                      gap: '12px',
                      padding: '12px 20px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      marginBottom: '6px',
                      color: 'white',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Load ID Column */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: '#dc2626',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      justifyContent: 'center',
                    }}>
                      {load.id}
                    </div>

                    {/* Origin Column */}
                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      {load.origin}
                    </div>

                    {/* Destination Column */}
                    <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      {load.destination}
                    </div>

                    {/* Rate Column */}
                    <div style={{ 
                      fontWeight: '700', 
                      color: '#22c55e', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}>
                      ${load.rate ? load.rate.toLocaleString() : 'N/A'}
                    </div>

                    {/* Details Column */}
                    <div style={{ 
                      fontSize: '12px', 
                      color: 'rgba(255, 255, 255, 0.8)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      lineHeight: '1.3'
                    }}>
                      <div>{load.distance}</div>
                      <div>{load.equipment}</div>
                      {load.photoConfig?.pickupPhotosRequired && (
                        <div style={{ color: '#fbbf24', fontSize: '11px' }}>📸 Photos Req</div>
                      )}
                    </div>

                    {/* Dispatcher Column */}
                    <div style={{ 
                      color: '#60a5fa', 
                      fontWeight: '600',
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: '13px'
                    }}>
                      {load.dispatcherName}
                    </div>

                    {/* Action Column */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => acceptLoad(load)}
                        style={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          width: '100%',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        ✅ Accept
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Debug: Show fallback if conditions not met */}
        {(!hasPermission('my_loads_workflow') || loadsWaitingForAcceptance.length === 0) && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                🔔 Loads Waiting for Acceptance (Debug)
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Permission: {hasPermission('my_loads_workflow') ? '✅ Yes' : '❌ No'} | 
                Data Length: {loadsWaitingForAcceptance.length} | 
                {loadsWaitingForAcceptance.length === 0 ? 'No data loaded' : 'Data exists but not showing'}
              </p>
            </div>

            {loadsWaitingForAcceptance.length > 0 && (
              <div>
                <h4 style={{ color: 'white', margin: '0 0 10px 0' }}>Available Data:</h4>
                {loadsWaitingForAcceptance.map((load, index) => (
                  <div key={index} style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '12px', marginBottom: '5px' }}>
                    {load.id}: {load.origin} → {load.destination} (${load.rate ? load.rate.toLocaleString() : 'No rate'})
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            margin: '0 0 24px 0',
          }}
        >
          Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
          }}
        >
          {hasPermission('my_loads_workflow') && (
            <button
              onClick={() => setActiveSection('my_loads')}
              style={{
                padding: '24px',
                background:
                  'linear-gradient(135deg, rgba(244, 168, 50, 0.6), rgba(249, 115, 22, 0.6))',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #f4a832, #f97316)';
                e.currentTarget.style.boxShadow =
                  '0 12px 40px rgba(244, 168, 50, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, rgba(244, 168, 50, 0.6), rgba(249, 115, 22, 0.6))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                {renderVehicleImage('32px')}
              </div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                My Loads
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Manage assigned load workflow
              </p>
            </button>
          )}

          {hasPermission('load_board_access') && (
            <button
              onClick={() => setActiveSection('load_board')}
              style={{
                padding: '24px',
                background:
                  'linear-gradient(135deg, rgba(20, 184, 166, 0.6), rgba(5, 150, 105, 0.6))',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #14b8a6, #059669)';
                e.currentTarget.style.boxShadow =
                  '0 12px 40px rgba(20, 184, 166, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, rgba(20, 184, 166, 0.6), rgba(5, 150, 105, 0.6))';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>📋</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Load Board
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                Browse and bid on available loads
              </p>
            </button>
          )}

          {hasPermission('business_metrics') && (
            <button
              onClick={() => setActiveSection('business')}
              style={{
                padding: '24px',
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #7c3aed, #5b21b6)';
                e.currentTarget.style.boxShadow =
                  '0 12px 40px rgba(99, 102, 241, 0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #6366f1, #4f46e5)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '16px' }}>💼</div>
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  margin: '0 0 8px 0',
                }}
              >
                Business Analytics
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  margin: 0,
                }}
              >
                View performance and revenue insights
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // My Loads Section (Driver Workflow)
  const MyLoadsSection = () => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(244, 168, 50, 0.6), rgba(249, 115, 22, 0.6))',
          color: 'white',
          padding: '20px 32px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '500',
            margin: '0 0 6px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {renderVehicleImage('20px')} My Active Loads
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Driver workflow management & load tracking
        </p>
      </div>

      <div style={{ padding: '32px' }}>
        {acceptedLoads.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '1.2rem' }}>No accepted loads</div>
            <div
              style={{
                fontSize: '0.9rem',
                marginTop: '8px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              Accept loads from the dashboard to start workflows
            </div>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {acceptedLoads.map((load) => (
              <div
                key={load.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        background: '#f4a832',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {load.id}
                    </div>
                    <div
                      style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                      }}
                    >
                      {load.status}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    📍 {load.origin} → {load.destination}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    <span>💰 ${load.rate?.toLocaleString()}</span>
                    <span>📦 {load.weight} lbs</span>
                    <span>🚛 {load.equipment}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(20, 184, 166, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onClick={() => startWorkflow(load)}
                  >
                    📋 Start Workflow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Load Board Section (Carrier Portal)
  const LoadBoardSection = () => (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(20, 184, 166, 0.6), rgba(5, 150, 105, 0.6))',
          color: 'white',
          padding: '20px 32px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '500',
            margin: '0 0 6px 0',
          }}
        >
          📋 Load Board - Available Loads
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
          Browse and bid on available freight loads
        </p>
      </div>

      <div style={{ padding: '32px' }}>
        {availableLoads.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'rgba(255, 255, 255, 0.6)',
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <div style={{ fontSize: '1.2rem' }}>
              No available loads at this time
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                marginTop: '8px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              New loads are posted throughout the day
            </div>
          </div>
        ) : (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {availableLoads.slice(0, 10).map((load) => (
              <div
                key={load.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        background: '#14b8a6',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                      }}
                    >
                      {load.id}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                      }}
                    >
                      {load.brokerName}
                    </div>
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '8px',
                    }}
                  >
                    📍 {load.origin} → {load.destination} • {load.distance}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '8px',
                    }}
                  >
                    <span>📦 {load.weight} lbs</span>
                    <span>🚛 {load.equipment}</span>
                    <span>📅 {load.pickupDate}</span>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #14b8a6, #059669)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: 'white',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '2px',
                      }}
                    >
                      ${load.rate?.toLocaleString()}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '12px',
                      }}
                    >
                      Total Rate
                    </div>
                  </div>
                  {hasPermission('bid_management') && (
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #14b8a6, #059669)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(20, 184, 166, 0.3)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() =>
                        alert(
                          `Bidding on load ${load.id} - Feature coming soon!`
                        )
                      }
                    >
                      💰 Bid on Load
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Business Section (Analytics & Reports)
  const BusinessSection = () => (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '24px',
          }}
        >
          💼 Business Analytics
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Revenue Metrics */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              💰 Revenue Metrics
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  This Month:
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  $12,450
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Last Month:
                </span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  $9,800
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  YTD Total:
                </span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  $145,200
                </span>
              </div>
            </div>
          </div>

          {/* Load Performance */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <h3
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                marginBottom: '16px',
              }}
            >
              📊 Load Performance
            </h3>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Completed Loads:
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>24</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  On-Time Delivery:
                </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>
                  96%
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Avg Rate/Mile:
                </span>
                <span style={{ color: 'white', fontWeight: 'bold' }}>
                  $2.85
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Document Management Section
  const DocumentsSection = () => (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            marginBottom: '24px',
          }}
        >
          📄 Document Management
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🆔</div>
            <div
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              CDL License
            </div>
            <div
              style={{
                color: '#10b981',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              ✅ Valid until 2026
            </div>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              View Document
            </button>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              {renderVehicleImage('48px')}
            </div>
            <div
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Vehicle Registration
            </div>
            <div
              style={{
                color: '#10b981',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              ✅ Current
            </div>
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              View Document
            </button>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛡️</div>
            <div
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginBottom: '8px',
              }}
            >
              Insurance
            </div>
            <div
              style={{
                color: '#f59e0b',
                fontSize: '0.9rem',
                marginBottom: '12px',
              }}
            >
              ⚠️ Expires in 30 days
            </div>
            <button
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.5)',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Renew Insurance
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Communication Section
  const CommunicationSection = () => {
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState([
      {
        id: '1',
        from: 'dispatcher',
        name: currentUser.dispatcher.name,
        message:
          'Good morning! Your route for today has been updated. Please check the My Loads section.',
        timestamp: '2025-01-21 08:30 AM',
        read: true,
      },
      {
        id: '2',
        from: 'driver',
        name: currentUser.name,
        message: 'Message received. ETA to pickup location is 45 minutes.',
        timestamp: '2025-01-21 08:35 AM',
        read: true,
      },
    ]);

    const sendMessage = async () => {
      if (!message.trim()) return;

      const newMessage = {
        id: Date.now().toString(),
        from: 'driver',
        name: currentUser.name,
        message: message.trim(),
        timestamp: new Date().toLocaleString(),
        read: false,
      };

      setMessageHistory((prev) => [...prev, newMessage]);
      setMessage('');

      // Send notification to dispatcher
      await sendDispatcherNotification(newMessage);
    };

    const sendDispatcherNotification = async (msg: any) => {
      try {
        // In production, this would use real notification service
        console.log(
          '📡 Sending notification to dispatcher:',
          currentUser.dispatcher.name
        );
        console.log('📱 Message:', msg.message);

        // Mock SMS to dispatcher
        const smsResponse = await fetch('/api/notifications/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            loadData: {
              id: 'COMM-' + Date.now(),
              origin: 'Driver Portal',
              destination: 'Dispatcher',
              rate: '$0',
              pickupDate: new Date().toLocaleDateString(),
              equipment: 'Communication',
            },
            recipients: [
              {
                id: 'disp-001',
                phone: currentUser.dispatcher.phone,
                name: currentUser.dispatcher.name,
                type: 'dispatcher',
              },
            ],
            notificationType: 'sms',
            messageTemplate: 'custom',
            customMessage: `💬 Message from ${currentUser.name}: ${msg.message}`,
            urgency: 'normal',
          }),
        });

        console.log('✅ Dispatcher notification sent');
      } catch (error) {
        console.error('❌ Failed to send dispatcher notification:', error);
      }
    };

    const makeCall = () => {
      // In production, would integrate with VoIP/calling system
      window.open(`tel:${currentUser.dispatcher.phone}`, '_self');
    };

    return (
      <div style={{ padding: '24px' }}>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '500',
                color: '#2d3748',
                margin: '0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              🔔 Communication Center
            </h2>
            <p
              style={{
                color: '#2d3748',
                opacity: 0.8,
                margin: '6px 0 0 0',
                fontSize: '14px',
              }}
            >
              Connect with dispatch & notification hub
            </p>
          </div>

          {/* Dispatcher Contact Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              >
                <div style={{ fontSize: '32px' }}>
                  {renderUserImage('32px')}
                </div>
                <div>
                  <h3
                    style={{
                      color: 'white',
                      fontSize: '18px',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {currentUser.dispatcher.name}
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    {currentUser.dispatcher.department} •{' '}
                    {currentUser.dispatcher.availability}
                  </p>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '12px',
                      margin: '4px 0 0 0',
                    }}
                  >
                    {currentUser.dispatcher.responsiveness}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={makeCall}
                  style={{
                    background: 'linear-gradient(135deg, #14b8a6, #059669)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  📞 Call Now
                </button>
              </div>
            </div>
          </div>

          {/* Message History */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              maxHeight: '400px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <h4
              style={{ color: 'white', marginBottom: '16px', fontSize: '16px' }}
            >
              Message History
            </h4>
            {messageHistory.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: msg.from === 'driver' ? 'row-reverse' : 'row',
                  marginBottom: '16px',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    background:
                      msg.from === 'driver'
                        ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                        : 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    maxWidth: '70%',
                  }}
                >
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    {msg.message}
                  </div>
                  <div style={{ fontSize: '12px', opacity: 0.7 }}>
                    {msg.name} • {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type your message to dispatcher...'
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '14px',
                resize: 'none',
                minHeight: '60px',
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              style={{
                background: message.trim()
                  ? 'linear-gradient(135deg, #14b8a6, #059669)'
                  : 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                minHeight: '60px',
              }}
            >
              📱 Send SMS
            </button>
          </div>

          {/* Emergency Contact */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '20px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
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
              <span style={{ fontSize: '16px' }}>🚨</span>
              <span
                style={{ color: 'white', fontWeight: '600', fontSize: '14px' }}
              >
                Emergency Contact
              </span>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '12px',
                margin: '0 0 8px 0',
              }}
            >
              For urgent situations requiring immediate assistance
            </p>
            <button
              onClick={() => window.open('tel:+15551234567', '_self')}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              📞 Emergency Dispatch: (555) 123-4567
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Icon mapping for workflow steps
  const getStepIcon = (stepId: string): string => {
    const iconMap: { [key: string]: string } = {
      load_assignment_confirmation: '✓',
      rate_confirmation_review: '💰',
      rate_confirmation_verification: '✅',
      bol_receipt_confirmation: '📄',
      bol_verification: '🔍',
      pickup_authorization: '🔓',
      pickup_arrival: '📍',
      pickup_completion: '📦',
      transit_start: '🚛',
      transit_tracking: '📍',
      delivery_arrival: '🏭',
      delivery_completion: '📋',
      pod_submission: '📝',
    };
    return iconMap[stepId] || '⭕';
  };

  // Workflow Section - Driver Load Management
  const WorkflowSection = () => {
    if (!activeWorkflow) {
      return (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '16px' }}>
            No Active Workflow
          </h2>
          <p
            style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '24px' }}
          >
            Start a workflow from your assigned loads to track progress
          </p>
          <button
            onClick={() => setActiveSection('my_loads')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #f4a832, #f97316)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            View My Loads
          </button>
        </div>
      );
    }

    const currentLoad = assignedLoads.find(
      (load) => load.id === activeWorkflow.loadId
    );
    const currentStep = activeWorkflow.steps[activeWorkflow.currentStep];
    const completedSteps = activeWorkflow.steps.filter(
      (step) => step.completed
    ).length;
    const totalSteps = activeWorkflow.steps.length;
    const progress = (completedSteps / totalSteps) * 100;

    return (
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Workflow Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f4a832, #f97316)',
            color: 'white',
            padding: '24px 32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>
              🚛 Active Workflow
            </h2>
            <button
              onClick={() => {
                setActiveWorkflow(null);
                setActiveSection('my_loads');
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ← Back to Loads
            </button>
          </div>

          {currentLoad && (
            <div style={{ marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>
                {currentLoad.origin} → {currentLoad.destination}
              </h3>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  margin: 0,
                  fontSize: '14px',
                }}
              >
                Load ID: {currentLoad.id} • ${currentLoad.rate.toLocaleString()}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                Progress: {completedSteps} of {totalSteps} steps
              </span>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'white',
                  height: '100%',
                  width: `${progress}%`,
                  borderRadius: '10px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        <div style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {activeWorkflow.steps.map((step, index) => {
              const isCurrentStep = index === activeWorkflow.currentStep;
              const isCompleted = step.completed;
              const isPending = !step.completed;

              return (
                <div
                  key={step.id}
                  style={{
                    background: isCurrentStep
                      ? 'linear-gradient(135deg, rgba(244, 168, 50, 0.2), rgba(249, 115, 22, 0.2))'
                      : isCompleted
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(21, 128, 61, 0.2))'
                        : 'rgba(255, 255, 255, 0.1)',
                    border: isCurrentStep
                      ? '2px solid #f4a832'
                      : isCompleted
                        ? '2px solid #22c55e'
                        : '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '24px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: isCompleted
                          ? '#22c55e'
                          : isCurrentStep
                            ? '#f4a832'
                            : 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      {isCompleted ? '✓' : getStepIcon(step.id)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          color: 'white',
                          margin: '0 0 4px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                        }}
                      >
                        {step.name}{' '}
                        {step.required && (
                          <span style={{ color: '#ef4444' }}>*</span>
                        )}
                      </h4>
                      <p
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          margin: '0 0 8px 0',
                          fontSize: '14px',
                        }}
                      >
                        {step.description}
                      </p>

                      {step.completedAt && (
                        <p
                          style={{
                            color: '#22c55e',
                            margin: 0,
                            fontSize: '12px',
                            fontWeight: '500',
                          }}
                        >
                          Completed:{' '}
                          {new Date(step.completedAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {isCurrentStep && !isCompleted && (
                      <button
                        onClick={() => {
                          const notes = prompt(
                            'Add any notes for this step (optional):'
                          );
                          completeWorkflowStep(step.id, notes || '');
                        }}
                        style={{
                          background:
                            'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        Complete Step
                      </button>
                    )}
                  </div>

                  {/* Remove step.notes since it doesn't exist in WorkflowStep interface */}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Navigation sections based on user role
  const getNavigationSections = (): {
    id: string;
    title: string;
    icon: string;
    color: string;
  }[] => {
    const allSections = [
      { id: 'dashboard', title: 'Dashboard', icon: '🏠', color: '#6366f1' },
      { id: 'my_loads', title: 'My Loads', icon: 'vehicle', color: '#f4a832' },
      { id: 'load_board', title: 'Load Board', icon: '📋', color: '#14b8a6' },
      { id: 'business', title: 'Business', icon: '💼', color: '#3b82f6' },
      { id: 'documents', title: 'Documents', icon: '📄', color: '#f97316' },
      {
        id: 'communication',
        title: 'Communication',
        icon: '🔔',
        color: '#fbbf24',
      },
    ];

    return allSections.filter(
      (section) => section.id === 'dashboard' || canAccessSection(section.id)
    );
  };

  // Render active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'my_loads':
        return <MyLoadsSection />;
      case 'load_board':
        return <LoadBoardSection />;
      case 'business':
        return <BusinessSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'communication':
        return <CommunicationSection />;
      case 'workflow':
        return <WorkflowSection />;
      default:
        return <DashboardSection />;
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #059669, #047857, #0f766e)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ color: 'white', fontSize: '1.2rem' }}>
          Loading portal...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%),
        radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.04) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* Back Button */}
      <div style={{ padding: '16px 24px' }}>
        <Link href='/'>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(10px)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{ marginRight: '8px' }}>←</span>
            Back to Dashboard
          </button>
        </Link>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px 32px',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                }}
              >
                {renderVehicleImage('32px')}
              </div>
              <div>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: 'white',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {currentUser.tenantName}
                </h1>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '16px',
                  }}
                >
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {currentUser.companyInfo.mcNumber}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    {currentUser.companyInfo.dotNumber}
                  </div>
                  <div
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '14px',
                      padding: '4px 12px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      borderRadius: '8px',
                      border: '1px solid rgba(20, 184, 166, 0.3)',
                    }}
                  >
                    {currentUser.companyInfo.operatingStatus}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
                        animation: 'pulse 2s infinite',
                      }}
                     />
                    <span
                      style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '14px',
                      }}
                    >
                      {currentUser.name} •{' '}
                      <span
                        style={{
                          color: getDepartmentColor(currentUser.role.type),
                          fontWeight: '600',
                        }}
                      >
                        {currentUser.role.type
                          .replace('_', ' ')
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </span>
                      •{' '}
                      <span
                        style={{
                          color: 'rgba(255, 255, 255, 0.8)',
                          fontWeight: '600',
                        }}
                      >
                        ID:{' '}
                        <span
                          style={{
                            color: getDepartmentColor(currentUser.role.type),
                            fontWeight: 'bold',
                          }}
                        >
                          {currentUser.id}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
                {/* Dispatcher Information */}
                <div
                  onClick={() => setActiveSection('communication')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '8px 12px',
                    background: 'linear-gradient(135deg, #fef3c7, #fbbf24)',
                    borderRadius: '10px',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #fef9e7, #f59e0b)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(251, 191, 36, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #fef3c7, #fbbf24)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🔔</span>
                    <div>
                      <div
                        style={{
                          color: '#2d3748',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        Dispatcher: {currentUser.dispatcher.name}
                      </div>
                      <div
                        style={{
                          color: 'rgba(45, 55, 72, 0.7)',
                          fontSize: '12px',
                        }}
                      >
                        {currentUser.dispatcher.phone} •{' '}
                        {currentUser.dispatcher.availability}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      color: '#2d3748',
                      fontSize: '12px',
                      padding: '4px 8px',
                      background: 'rgba(45, 55, 72, 0.1)',
                      borderRadius: '6px',
                      border: '1px solid rgba(45, 55, 72, 0.2)',
                    }}
                  >
                    {currentUser.dispatcher.responsiveness}
                  </div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <GlobalNotificationBell
                department={
                  currentUser.role.type === 'owner_operator'
                    ? 'driver'
                    : currentUser.role.type === 'company_driver'
                      ? 'driver'
                      : currentUser.role.type === 'fleet_manager'
                        ? 'admin'
                        : 'dispatcher'
                }
              />
              <button
                style={{
                  background: 'linear-gradient(135deg, #14b8a6, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #059669, #047857)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 25px rgba(0, 0, 0, 0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, #14b8a6, #059669)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🔄 Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {getNavigationSections().map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '16px 24px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background:
                  activeSection === section.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.15)',
                color: activeSection === section.id ? '#1e40af' : 'white',
                backdropFilter: 'blur(10px)',
                border:
                  activeSection === section.id
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.2)',
                transform:
                  activeSection === section.id
                    ? 'translateY(-2px)'
                    : 'translateY(0)',
                boxShadow:
                  activeSection === section.id
                    ? '0 8px 25px rgba(0, 0, 0, 0.2)'
                    : 'none',
              }}
            >
              <span style={{ marginRight: '8px' }}>
                {section.icon === 'vehicle'
                  ? renderVehicleImage('16px')
                  : section.icon}
              </span>
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div>{renderActiveSection()}</div>
      </div>
    </div>
  );
}
