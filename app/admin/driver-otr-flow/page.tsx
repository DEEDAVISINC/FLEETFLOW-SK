'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import GlobalNotificationBell from '../../components/GlobalNotificationBell';
import {
  FinancialMarketsService,
  FuelPriceData,
} from '../../services/FinancialMarketsService';
import { iftaService } from '../../services/IFTAService';
import { taxBanditsForm2290Service } from '../../services/TaxBanditsForm2290Service';
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

// Enhanced User Interface for comprehensive header
interface EnhancedDriverUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: {
    type: 'owner_operator' | 'company_driver' | 'fleet_manager' | 'dispatcher';
    permissions: string[];
  };
  tenantId: string;
  tenantName: string;
  companyInfo: {
    mcNumber: string;
    dotNumber: string;
    safetyRating: string;
    insuranceProvider: string;
    operatingStatus: string;
  };
  dispatcher: {
    name: string;
    phone: string;
    email: string;
    department: string;
    availability: string;
    responsiveness: string;
  };
  photos: {
    vehicleEquipment?: string;
    userPhotoOrLogo?: string;
  };
}

// 🚨 TIME-RESTRICTED LOAD ALERT SYSTEM INTERFACES
interface LoadAlert {
  id: string;
  load: {
    id: string;
    origin: string;
    destination: string;
    commodity: string;
    pay: string;
    miles: string;
    rate: string;
    pickupDate: string;
    priority: 'HIGH' | 'URGENT' | 'NORMAL';
    equipment?: string;
    weight?: string;
    distance?: string;
  };
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

// 🗺️ GPS-PROXIMITY LOAD SYSTEM INTERFACES
interface DriverLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
  city?: string;
  state?: string;
}

interface NearbyLoad {
  id: string;
  origin: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  destination: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  commodity: string;
  pay: string;
  rate: string;
  miles: string;
  pickupDate: string;
  deliveryDate?: string;
  equipment: string;
  weight: string;
  priority: 'HIGH' | 'URGENT' | 'NORMAL';
  dispatcherName: string;
  dispatcherId: string;
  brokerId?: string;
  distanceFromDriver: number; // miles
  estimatedPickupTime: string; // ETA to pickup location
  postedAt: Date;
  expiresAt?: Date;
}

interface LoadInterest {
  id: string;
  loadId: string;
  driverId: string;
  driverName: string;
  driverLocation: DriverLocation;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  submittedAt: Date;
  driverMessage?: string;
  dispatcherResponse?: string;
  respondedAt?: Date;
  estimatedArrival: string;
  distanceToLoad: number;
}

// Mock workflow manager
const workflowManager = {
  getActiveWorkflowTasks: (driverId: string): WorkflowTask[] => [
    // ALL WORKFLOW TASKS CLEARED - ORIGINAL DATA REMOVED:
    // Was showing load assignment confirmation, invoice payment alerts, compliance reports
    // L2025-002 Fort Worth → San Antonio ($2,100)
    // Invoice #INV-2024-052 overdue ($285.00)
    // Invoice #INV-2025-001 due Thursday ($455.00)
    // ALL CLEARED FOR DEMO
    // ALL REMAINING WORKFLOW TASKS CLEARED - WAS SHOWING:
    // - New Management-Approved Invoice Available (#INV-2025-002)
    // - Form 2290 Heavy Vehicle Tax Filing Due ($550)
    // - IFTA Q4 2024 Quarterly Return Due ($1,247 tax liability)
    // ALL CLEARED FOR DEMO
  ],
};

export default function AdminDriverOTRFlow() {
  // All React hooks declared at the top
  const [selectedTab, setSelectedTab] = useState<
    | 'dashboard'
    | 'tasks-loads'
    | 'business-metrics'
    | 'notifications'
    | 'profile'
    | 'go-with-the-flow'
    | 'availability'
    | 'openeld'
  >('dashboard');
  const [currentDriverId, setCurrentDriverId] = useState<string | null>(null);
  const [selectedDriverIndex, setSelectedDriverIndex] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [notifications, setNotifications] = useState<DriverNotification[]>([]);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const emergencyButtonRef = useRef<HTMLButtonElement>(null);

  // 🚨 LOAD ALERT SYSTEM STATE MANAGEMENT - DATA CLEARED
  const [loadAlerts, setLoadAlerts] = useState<LoadAlert[]>([]); // CLEARED - NO LOAD ALERTS
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
  const [instantLoads, setInstantLoads] = useState<any[]>([]);
  const [driverStatus, setDriverStatus] = useState<
    'online' | 'offline' | 'on-load'
  >('online');

  // 🏛️ TAXBANDITS FORM 2290 STATE MANAGEMENT
  const [taxFilingStatus, setTaxFilingStatus] = useState<{
    isSubmitting: boolean;
    lastSubmission?: {
      submissionId: string;
      status: string;
      message: string;
      stampedSchedule1Url?: string;
    } | null;
    connectionStatus: { success: boolean; message: string } | null;
  }>({ isSubmitting: false, lastSubmission: null, connectionStatus: null });

  // 🗺️ IFTA QUARTERLY FILING STATE MANAGEMENT
  const [iftaFilingStatus, setIftaFilingStatus] = useState<{
    isSubmitting: boolean;
    lastSubmission?: {
      submissionId: string;
      quarter: string;
      status: string;
      message: string;
      jurisdictions: number;
      totalTaxOwed: number;
      filingDeadline: string;
    } | null;
    connectionStatus: { success: boolean; message: string } | null;
    availableStates: string[];
  }>({
    isSubmitting: false,
    lastSubmission: null,
    connectionStatus: null,
    availableStates: ['CA', 'TX', 'FL', 'GA', 'AZ', 'NY'],
  });

  // 💰 FACTORING & PAYMENT PROCESSING STATE MANAGEMENT
  const [factoringStatus, setFactoringStatus] = useState<{
    isEnabled: boolean;
    currentFactor: {
      name: string;
      rate: number;
      advanceRate: number;
      creditLimit: number;
      availableCredit: number;
      daysToPayment: number;
      status: 'active' | 'pending' | 'suspended';
    } | null;
    pendingInvoices: {
      invoiceId: string;
      amount: number;
      customerName: string;
      loadId: string;
      invoiceDate: string;
      status: 'pending_factor' | 'factored' | 'collecting' | 'paid';
      factorAdvance?: number;
      advanceDate?: string;
    }[];
    paymentMethods: {
      directDeposit: {
        enabled: boolean;
        bankName: string;
        accountNumber: string;
      };
      payCard: { enabled: boolean; cardProvider: string; cardNumber: string };
      check: { enabled: boolean; address: string };
    };
    recentTransactions: {
      transactionId: string;
      type:
        | 'factor_advance'
        | 'settlement'
        | 'expense_deduction'
        | 'dispatch_fee';
      amount: number;
      description: string;
      date: string;
      status: 'completed' | 'pending' | 'failed';
    }[];
  }>({
    isEnabled: true,
    currentFactor: {
      name: 'Demo Factoring Service', // CLEARED FROM: 'TBS Factoring Service'
      rate: 0, // CLEARED FROM: 2.5
      advanceRate: 0, // CLEARED FROM: 95
      creditLimit: 0, // CLEARED FROM: 50000
      availableCredit: 0, // CLEARED FROM: 42350
      daysToPayment: 0, // CLEARED FROM: 1
      status: 'active',
    },
    pendingInvoices: [
      // ALL PENDING INVOICES DATA CLEARED FOR DEMO
      // WAS SHOWING: INV-2025-003 ($2,850) from Walmart Distribution
      // WAS SHOWING: INV-2025-004 ($3,200) from Home Depot Logistics
    ],
    paymentMethods: {
      directDeposit: {
        enabled: true,
        bankName: 'Demo Bank', // CLEARED FROM: 'Wells Fargo'
        accountNumber: '****0000', // CLEARED FROM: '****1234'
      },
      payCard: { enabled: false, cardProvider: '', cardNumber: '' },
      check: { enabled: false, address: '' },
    },
    recentTransactions: [
      // ALL RECENT TRANSACTIONS DATA CLEARED FOR DEMO
      // WAS SHOWING: TXN-2025-0125 Factor advance $3,040 (Home Depot)
      // WAS SHOWING: TXN-2025-0124 Weekly settlement $12,130 (5 loads)
    ],
  });

  // 🗺️ GPS-PROXIMITY LOAD SYSTEM STATE MANAGEMENT
  const [driverLocation, setDriverLocation] = useState<DriverLocation | null>(
    null
  );
  const [nearbyLoads, setNearbyLoads] = useState<NearbyLoad[]>([]);
  const [loadInterests, setLoadInterests] = useState<LoadInterest[]>([]);
  const [locationPermission, setLocationPermission] = useState<
    'granted' | 'denied' | 'pending'
  >('pending');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [fuelPrice, setFuelPrice] = useState<FuelPriceData | null>(null);

  // 🔒 Access Control Check - moved after hooks to comply with Rules of Hooks
  const hasAccess = checkPermission('hasManagementAccess');

  // 🚀 Get Driver Data
  const allDrivers = onboardingIntegration.getAllDrivers();
  const demoDriver = currentDriverId
    ? allDrivers.find((d) => d.driverId === currentDriverId) ||
      allDrivers[selectedDriverIndex]
    : allDrivers[selectedDriverIndex] || {
        driverId: 'driver-001',
        personalInfo: {
          name: 'Demo Driver', // CLEARED FROM: 'John Rodriguez'
          licenseNumber: 'CDL-DEMO-000', // CLEARED FROM: 'CDL-TX-8834592'
          phone: '(000) 000-0000', // CLEARED FROM: '(555) 234-5678'
          email: 'demo@example.com', // CLEARED FROM: 'john.rodriguez@fleetflowapp.com'
        },
        employmentInfo: {
          startDate: 'N/A', // CLEARED FROM: '2023-01-15'
          role: 'Demo Role', // CLEARED FROM: 'OTR Driver'
        },
      };

  // Enhanced user data for comprehensive header - DATA CLEARED
  const currentUser: EnhancedDriverUser = {
    id: 'DEMO-000', // CLEARED FROM: 'JR-OO-2025002'
    name: demoDriver.personalInfo?.name || 'Demo Driver', // CLEARED FROM: 'John Rodriguez'
    email: demoDriver.personalInfo?.email || 'demo@example.com', // CLEARED FROM: 'john.rodriguez@fleetflowapp.com'
    phone: demoDriver.personalInfo?.phone || '(000) 000-0000', // CLEARED FROM: '(555) 234-5678'
    role: {
      type: 'owner_operator',
      permissions: ['my_loads_workflow', 'load_board_access'],
    },
    tenantId: 'tenant_demo',
    tenantName: 'Demo Company LLC', // CLEARED FROM: 'FleetFlow Transport LLC'
    companyInfo: {
      mcNumber: 'MC-000000', // CLEARED FROM: 'MC-789456'
      dotNumber: 'DOT-000000', // CLEARED FROM: 'DOT-2345678'
      safetyRating: 'N/A', // CLEARED FROM: 'Satisfactory'
      insuranceProvider: 'N/A', // CLEARED FROM: 'Commercial Transport Insurance'
      operatingStatus: 'Demo', // CLEARED FROM: 'Active'
    },
    dispatcher: {
      name: 'Demo Dispatcher', // CLEARED FROM: 'Sarah Martinez'
      phone: '+1 (000) 000-0000', // CLEARED FROM: '+1 (555) 987-6543'
      email: 'demo@example.com', // CLEARED FROM: 'dispatch@fleetflowapp.com'
      department: 'Demo Dispatch', // CLEARED FROM: 'Dispatch Central'
      availability: 'N/A', // CLEARED FROM: 'Available 24/7'
      responsiveness: 'N/A', // CLEARED FROM: 'Avg Response: 8 mins'
    },
    photos: {
      vehicleEquipment: '', // CLEARED FROM: Image URL
      userPhotoOrLogo: '', // CLEARED FROM: Image URL
    },
  };

  // Helper Functions
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

  const renderVehicleImage = (size: string = '32px') => {
    if (currentUser.photos.vehicleEquipment) {
      return (
        <Image
          src={currentUser.photos.vehicleEquipment}
          alt=''
          width={32}
          height={32}
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

  // 🚨 LOAD ALERT MANAGEMENT FUNCTIONS
  const playAlertSound = () => {
    if (alertSoundsEnabled) {
      // Create audio notification
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBkOZ3vXNeSsFJYTO8diJOQgZab3t559NEAxOpeDxvmwiBkKX3vTOeywGJIHJ8N+PQAoUXrXo66hVFAlFnt/yukwjCFWr5+6zdSAHbKvn77BdGAg6k9/2z34sBSWAye/hizsIGGm98+eeTBIMUarm7axiGAY+jdrzxnkpBSF+yu7bgyEIGGq+8+aeThILT6zn7adcGAhEq+buqmceB1Sq5uyzcyAGX7Du9qpZFgpEoN/twk0iBFad3/C+ayIHRqTh8btbFgpGn+Hzv2sjBkSb2/K6aCAGPqTd88eJOAQgeb3o7axVEwlUreX5mGUbBj2J2/LGciUGLIHO8diJOgcYarzu66hVFApGnt/yu2whBkOY3fLMeSsFJYNO8diIOQgZab3s56BOEAxOpeDxvmcjBkKY3vTNeSsFJIHK8N+PQAoUXrXo66hVFAlFnt/yuj'
      );
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback for browsers that block autoplay
        console.info('Audio notification blocked');
      });
    }
  };

  const triggerVibration = () => {
    if (alertVibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const acceptLoadAlert = (alertId: string) => {
    const alert = loadAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    // Update alert status
    setLoadAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: 'accepted' as const,
              acceptedBy: currentUser.id,
              acceptedAt: new Date(),
            }
          : a
      )
    );

    // Update alert queue stats
    setAlertQueue((prev) => ({
      ...prev,
      acceptedAlertsToday: prev.acceptedAlertsToday + 1,
      acceptanceRate: Math.round(
        ((prev.acceptedAlertsToday + 1) / prev.totalAlertsToday) * 100
      ),
      alertHistory: [
        ...prev.alertHistory,
        { ...alert, status: 'accepted' as const },
      ],
    }));

    // Add to active loads (this would integrate with your load management system)
    console.info('Load accepted:', alert.load);
  };

  const declineLoadAlert = (alertId: string) => {
    const alert = loadAlerts.find((a) => a.id === alertId);
    if (!alert) return;

    // Update alert status to expired/declined
    setLoadAlerts((prev) => prev.filter((a) => a.id !== alertId));

    // Update alert queue stats
    setAlertQueue((prev) => ({
      ...prev,
      alertHistory: [
        ...prev.alertHistory,
        { ...alert, status: 'declined' as const },
      ],
    }));

    console.info('Load alert declined:', alert.load.id);
  };

  const generateDemoAlert = () => {
    // DEMO LOADS DATA CLEARED - ORIGINAL DATA COMMENTED OUT
    const demoLoads = [
      // ORIGINAL DATA COMMENTED OUT - WAS SHOWING:
      // {
      //   id: 'L2025-004',
      //   origin: 'Dallas, TX',
      //   destination: 'Houston, TX',
      //   commodity: 'Electronics',
      //   pay: '$1,850',
      //   miles: '239 mi',
      //   rate: '$7.74',
      //   pickupDate: 'Today',
      //   priority: 'URGENT' as const,
      //   equipment: 'Dry Van',
      //   weight: '34,000 lbs',
      //   distance: '239 mi',
      // },
      // {
      //   id: 'L2025-005',
      //   origin: 'Fort Worth, TX',
      //   destination: 'Austin, TX',
      //   commodity: 'General Freight',
      //   pay: '$1,200',
      //   miles: '195 mi',
      //   rate: '$6.15',
      //   pickupDate: 'Tomorrow',
      //   priority: 'HIGH' as const,
      //   equipment: 'Flatbed',
      //   weight: '28,500 lbs',
      //   distance: '195 mi',
      // },
    ];

    // DATA CLEARED - NO LONGER GENERATING DEMO ALERTS
    if (demoLoads.length === 0) {
      console.info(
        'Demo alert generation disabled - no demo load data available'
      );
      return;
    }

    // ORIGINAL DEMO ALERT LOGIC COMMENTED OUT - DATA CLEARED:
    // const randomLoad = demoLoads[Math.floor(Math.random() * demoLoads.length)];
    // const alertDuration = randomLoad.priority === 'URGENT' ? 900 : 1800; // 15 or 30 minutes

    // const newAlert: LoadAlert = {
    //   id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    //   load: randomLoad,
    //   alertType: 'new_load',
    //   timeToExpire: alertDuration,
    //   originalDuration: alertDuration,
    //   priority: randomLoad.priority === 'URGENT' ? 'high' : 'medium',
    //   dispatcherName: currentUser.dispatcher.name,
    //   dispatcherId: 'dispatch-001',
    //   createdAt: new Date(),
    //   status: 'active',
    //   soundAlert: true,
    //   vibrationAlert: true,
    //   visualAlert: randomLoad.priority === 'URGENT' ? 'flash' : 'pulse',
    //   message: `New ${randomLoad.priority.toLowerCase()} priority load available`,
    // };

    // setLoadAlerts((prev) => [...prev, newAlert]);
    // setAlertQueue((prev) => ({
    //   ...prev,
    //   totalAlertsToday: prev.totalAlertsToday + 1,
    //   acceptanceRate:
    //     prev.totalAlertsToday > 0
    //       ? Math.round(
    //           (prev.acceptedAlertsToday / (prev.totalAlertsToday + 1)) * 100
    //         )
    //       : 0,
    // }));

    // // Play sound and vibration
    // playAlertSound();
    // triggerVibration();
  };

  // 🗺️ GPS LOCATION TRACKING & NEARBY LOADS FUNCTIONS
  const requestLocationPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setLocationPermission('denied');
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: DriverLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };

        setDriverLocation(newLocation);
        setLocationPermission('granted');
        setIsLoadingLocation(false);

        // Start watching position for continuous updates
        startLocationTracking();
        // Load nearby loads based on new location
        loadNearbyLoads(newLocation);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        setLocationPermission('denied');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  const startLocationTracking = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: DriverLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date(),
        };

        setDriverLocation(newLocation);
        // Reload nearby loads if location changed significantly
        loadNearbyLoads(newLocation);
      },
      (error) => {
        console.info('Location tracking error:', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000, // 10 minutes
      }
    );
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const loadNearbyLoads = (location: DriverLocation) => {
    // Mock nearby loads - in production, this would call your loadboard API
    const mockLoads: NearbyLoad[] = [
      {
        id: 'NL-001',
        origin: {
          address: '1234 Industrial Blvd',
          city: 'Dallas',
          state: 'TX',
          coordinates: { lat: 32.7767, lng: -96.797 },
        },
        destination: {
          address: '5678 Commerce St',
          city: 'Houston',
          state: 'TX',
          coordinates: { lat: 29.7604, lng: -95.3698 },
        },
        commodity: 'Electronics',
        pay: '$2,150',
        rate: '$8.95/mi',
        miles: '240 mi',
        pickupDate: 'Tomorrow 8:00 AM',
        deliveryDate: 'Tomorrow 6:00 PM',
        equipment: 'Dry Van',
        weight: '32,000 lbs',
        priority: 'HIGH',
        dispatcherName: 'Sarah Johnson',
        dispatcherId: 'DISP-001',
        brokerId: 'BRK-001',
        distanceFromDriver: calculateDistance(
          location.latitude,
          location.longitude,
          32.7767,
          -96.797
        ),
        estimatedPickupTime: '2.5 hours',
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      {
        id: 'NL-002',
        origin: {
          address: '9876 Warehouse Dr',
          city: 'Fort Worth',
          state: 'TX',
          coordinates: { lat: 32.7555, lng: -97.3308 },
        },
        destination: {
          address: '4321 Distribution Way',
          city: 'San Antonio',
          state: 'TX',
          coordinates: { lat: 29.4241, lng: -98.4936 },
        },
        commodity: 'General Freight',
        pay: '$1,850',
        rate: '$6.85/mi',
        miles: '270 mi',
        pickupDate: 'Today 2:00 PM',
        deliveryDate: 'Tomorrow 10:00 AM',
        equipment: 'Flatbed',
        weight: '28,500 lbs',
        priority: 'URGENT',
        dispatcherName: 'Mike Davis',
        dispatcherId: 'DISP-002',
        brokerId: 'BRK-002',
        distanceFromDriver: calculateDistance(
          location.latitude,
          location.longitude,
          32.7555,
          -97.3308
        ),
        estimatedPickupTime: '1.8 hours',
        postedAt: new Date(),
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      },
    ];

    // Filter loads within 150 miles
    const nearbyFilteredLoads = mockLoads.filter(
      (load) => load.distanceFromDriver <= 150
    );
    setNearbyLoads(nearbyFilteredLoads);
  };

  // EXPRESS INTEREST WORKFLOW FUNCTIONS
  const expressInterest = (loadId: string) => {
    if (!driverLocation) {
      alert('Location required to express interest');
      return;
    }

    const load = nearbyLoads.find((l) => l.id === loadId);
    if (!load) return;

    const newInterest: LoadInterest = {
      id: `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      loadId,
      driverId: currentUser.id,
      driverName: currentUser.name,
      driverLocation,
      status: 'pending',
      submittedAt: new Date(),
      estimatedArrival: load.estimatedPickupTime,
      distanceToLoad: load.distanceFromDriver,
      driverMessage: `Interested in this load. Currently ${Math.round(load.distanceFromDriver)} miles away, ETA ${load.estimatedPickupTime}.`,
    };

    setLoadInterests((prev) => [...prev, newInterest]);

    // Mock notification to dispatcher
    console.info('Interest submitted:', {
      loadId,
      driverName: currentUser.name,
      distance: load.distanceFromDriver,
      eta: load.estimatedPickupTime,
      message: newInterest.driverMessage,
    });

    // Show confirmation to driver
    alert(
      `Interest expressed for load ${loadId}! Dispatcher ${load.dispatcherName} will be notified.`
    );
  };

  const withdrawInterest = (interestId: string) => {
    setLoadInterests((prev) =>
      prev.filter((interest) => interest.id !== interestId)
    );
    alert('Interest withdrawn successfully.');
  };

  // Initialize location tracking on component mount
  useEffect(() => {
    if (locationPermission === 'pending') {
      requestLocationPermission();
    }
  }, [locationPermission, requestLocationPermission]);

  // 📊 COMPREHENSIVE BUSINESS METRICS - DATA CLEARED
  const businessMetrics = {
    // Settlement & Payment Tracking - DATA CLEARED
    settlement: {
      pendingPayments: '$0', // CLEARED FROM: '$8,450'
      lastSettlement: '$0', // CLEARED FROM: '$12,130'
      settlementDate: 'N/A', // CLEARED FROM: 'Jan 15, 2025'
      nextSettlement: 'N/A', // CLEARED FROM: 'Jan 22, 2025'
      completedLoads: 0, // CLEARED FROM: 47
      pendingLoads: 0, // CLEARED FROM: 3
      disputedAmount: '$0', // CLEARED FROM: '$0' (already 0)
      paymentMethod: 'N/A', // CLEARED FROM: 'Direct Deposit'
      averageSettlementTime: '0 days', // CLEARED FROM: '5 days'
    },
    // Detailed Tax Management - DATA CLEARED
    tax: {
      alerts: 0, // CLEARED FROM: 1
      quarterlyDue: 'N/A', // CLEARED FROM: 'Q1 2025 - Due Mar 15'
      ytdDeductions: '$0', // CLEARED FROM: '$18,750'
      estimatedTax: '$0', // CLEARED FROM: '$6,240'
      mileageDeduction: '$0', // CLEARED FROM: '$14,040'
      fuelTaxCredits: '$0', // CLEARED FROM: '$2,450'
      lastFilingDate: 'N/A', // CLEARED FROM: 'Dec 15, 2024'
      nextQuarterlyEstimate: '$0', // CLEARED FROM: '$1,560'
      deductionCategories: {
        fuel: '$0', // CLEARED FROM: '$8,200'
        maintenance: '$0', // CLEARED FROM: '$3,400'
        insurance: '$0', // CLEARED FROM: '$4,200'
        permits: '$0', // CLEARED FROM: '$1,450'
        other: '$0', // CLEARED FROM: '$1,500'
      },
    },
    // Pay Period Breakdown - DATA CLEARED
    payPeriod: {
      current: {
        grossPay: '$0', // CLEARED FROM: '$12,850'
        fuelSurcharge: '$0', // CLEARED FROM: '$1,240'
        bonuses: '$0', // CLEARED FROM: '$450'
        detention: '$0', // CLEARED FROM: '$280'
        deductions: {
          fuel: '$0', // CLEARED FROM: '$3,200'
          insurance: '$0', // CLEARED FROM: '$850'
          equipment: '$0', // CLEARED FROM: '$420'
          permits: '$0', // CLEARED FROM: '$120'
          other: '$0', // CLEARED FROM: '$180'
          total: '$0', // CLEARED FROM: '$4,770'
        },
        netPay: '$0', // CLEARED FROM: '$9,850'
        period: 'N/A', // CLEARED FROM: 'Jan 1-15, 2025'
      },
      lastPeriod: {
        grossPay: '$0', // CLEARED FROM: '$11,240'
        netPay: '$0', // CLEARED FROM: '$8,650'
        period: 'N/A', // CLEARED FROM: 'Dec 16-31, 2024'
      },
    },
    // Extended Performance Metrics - DATA CLEARED
    performance: {
      safetyScore: 0, // CLEARED FROM: 94
      efficiencyRate: 0, // CLEARED FROM: 96
      onTimeDelivery: 0, // CLEARED FROM: 98
      fuelEfficiency: '0.0 MPG', // CLEARED FROM: '7.2 MPG'
      monthlyMiles: '0', // CLEARED FROM: '2,340'
      avgMilesPerLoad: '0', // CLEARED FROM: '450'
      hoursOfService: '0/70', // CLEARED FROM: '68/70'
      availableHours: '0 hrs', // CLEARED FROM: '2 hrs'
      inspectionsDue: 'N/A', // CLEARED FROM: 'Next: Feb 1'
      CSAScore: 'N/A', // CLEARED FROM: 'Satisfactory'
      violations: 0, // CLEARED FROM: 0 (already 0)
      avgDeliveryTime: '0 days', // CLEARED FROM: '2.3 days'
    },
    // Revenue Tracking - DATA CLEARED
    revenue: {
      ytd: '$0', // CLEARED FROM: '$127,450'
      monthly: '$0', // CLEARED FROM: '$12,850'
      weekly: '$0', // CLEARED FROM: '$3,240'
      daily: '$0', // CLEARED FROM: '$485'
      avgPerLoad: '$0', // CLEARED FROM: '$2,130'
      topMonth: 'N/A', // CLEARED FROM: 'August ($18,950)'
      bestWeek: 'N/A', // CLEARED FROM: 'Week 32 ($4,650)'
      revenueGoal: '$0', // CLEARED FROM: '$150,000'
      progressToGoal: '0%', // CLEARED FROM: '85%'
    },
  };

  // Performance Metrics (Legacy - keeping for compatibility) - DATA CLEARED
  const performanceMetrics = {
    activeLoads: 0, // CLEARED FROM: 1
    safetyScore: businessMetrics.performance.safetyScore, // Now references cleared data (0)
    revenueYTD: businessMetrics.revenue.ytd, // Now references cleared data ('$0')
    efficiencyRate: businessMetrics.performance.efficiencyRate, // Now references cleared data (0)
    monthlyMiles: businessMetrics.performance.monthlyMiles, // Now references cleared data ('0')
    taxAlerts: businessMetrics.tax.alerts, // Now references cleared data (0)
  };

  // Helper function for AI load countdown timers
  const formatTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const timeLeft = deadline.getTime() - now.getTime();

    if (timeLeft <= 0) return 'EXPIRED';

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  // Enhanced Available Loads for Loadboard - Mixed Traditional & AI-Generated
  const availableLoads = [
    // DATA CLEARED
    // ORIGINAL TRADITIONAL LOADS DATA CLEARED - WAS SHOWING:
    // Dallas→Miami Electronics $2,850 (Sarah Johnson)
    // Fort Worth→San Antonio General Freight $2,100 (Mike Davis)
    // Houston→New Orleans Food Products $1,650 (Lisa Chen)
    // ORIGINAL AI-GENERATED LOADS DATA CLEARED - WAS SHOWING:
    // AI marketplace loads, route optimization loads with bid recommendations
    // Dallas→Atlanta Electronics $3,200, Houston→Phoenix Auto Parts $2,750
    // San Antonio→Denver Manufacturing Parts $2,950 with AI win probability data
  ];

  // Active Loads (Only confirmed/accepted loads) - DATA CLEARED
  const activeLoads = [
    // ORIGINAL DATA COMMENTED OUT - WAS SHOWING ACTIVE LOADS:
    // {
    //   id: 'L2025-001',
    //   origin: 'Dallas, TX',
    //   destination: 'Miami, FL',
    //   status: 'In Transit',
    //   pay: '$2,850',
    //   miles: '1,180 mi',
    //   deliveryDate: 'Tomorrow',
    //   progress: 75,
    // },
    // L2025-002 (Fort Worth → San Antonio) removed - waiting for confirmation
    // Only confirmed loads should appear in active loads - ALL DATA CLEARED
  ];

  // Initialize notifications - DATA CLEARED
  useEffect(() => {
    setNotifications([
      // ORIGINAL NOTIFICATIONS COMMENTED OUT - DATA CLEARED:
      // {
      //   id: '1',
      //   message: '🚨 Load assignment confirmation required for L2025-002',
      //   timestamp: '2 hours ago',
      //   read: false,
      // },
      // {
      //   id: '2',
      //   message: '📋 Weekly inspection report submitted successfully',
      //   timestamp: '1 day ago',
      //   read: true,
      // },
      // {
      //   id: '3',
      //   message: '💰 Payment processed: $2,850 for load L2025-001',
      //   timestamp: '2 days ago',
      //   read: false,
      // },
    ]);
  }, []);

  // 🚨 COUNTDOWN TIMER FOR LOAD ALERTS
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadAlerts((prev) =>
        prev
          .map((alert) => {
            if (alert.status === 'active' && alert.timeToExpire > 0) {
              const newTimeToExpire = alert.timeToExpire - 1;

              // Warning sounds at specific intervals
              if (newTimeToExpire === 300 || newTimeToExpire === 60) {
                // 5 min, 1 min warnings
                playAlertSound();
                triggerVibration();
              }

              // Auto-expire alert
              if (newTimeToExpire <= 0) {
                setAlertQueue((queue) => ({
                  ...queue,
                  alertHistory: [
                    ...queue.alertHistory,
                    { ...alert, status: 'expired' as const },
                  ],
                }));
                return {
                  ...alert,
                  status: 'expired' as const,
                  timeToExpire: 0,
                };
              }

              return { ...alert, timeToExpire: newTimeToExpire };
            }
            return alert;
          })
          .filter((alert) => alert.status === 'active')
      ); // Remove expired alerts
    }, 1000);

    return () => clearInterval(timer);
  }, [alertSoundsEnabled, alertVibrationEnabled]);

  // Force clear any existing load alerts on component mount - DATA CLEARING
  useEffect(() => {
    // Ensure all load alerts are cleared on mount
    setLoadAlerts([]);
    console.info('All load alerts have been cleared - dashboard data cleared');
  }, []);

  // Demo: Generate alert every 30 seconds for testing - DISABLED (DATA CLEARED)
  useEffect(() => {
    // DEMO ALERT GENERATION DISABLED - ORIGINAL CODE COMMENTED OUT:
    // const demoTimer = setInterval(() => {
    //   if (loadAlerts.length < 3) {
    //     // Limit to 3 concurrent alerts
    //     generateDemoAlert();
    //   }
    // }, 30000);

    // // Generate first demo alert after 5 seconds
    // const initialAlert = setTimeout(() => {
    //   generateDemoAlert();
    // }, 5000);

    // return () => {
    //   clearInterval(demoTimer);
    //   clearTimeout(initialAlert);
    // };

    console.info(
      'Demo alert generation is disabled - no automatic load alerts will be created'
    );
  }, [loadAlerts.length]);

  // 🛢️ Fetch Live Fuel Prices
  useEffect(() => {
    const financialMarketsService = new FinancialMarketsService();

    const fetchFuelPrice = async () => {
      try {
        const data = await financialMarketsService.getDieselPrice();
        setFuelPrice(data);
      } catch (error) {
        console.error('Error fetching fuel price:', error);
      }
    };

    // Fetch immediately
    fetchFuelPrice();

    // Update every 5 minutes
    const fuelTimer = setInterval(fetchFuelPrice, 5 * 60 * 1000);

    return () => clearInterval(fuelTimer);
  }, []);

  // ⚡ GO WITH THE FLOW - Real-time load updates via API
  useEffect(() => {
    const currentDriverId = 'driver-1'; // For demo, use driver-1 as the current driver

    const loadInstantLoads = async () => {
      try {
        const response = await fetch(
          `/api/go-with-the-flow?action=instant-loads&driverId=${currentDriverId}`
        );
        const data = await response.json();

        if (data.success) {
          setInstantLoads(data.loads);
        } else {
          console.error('Failed to load instant loads:', data.error);
          setInstantLoads([]);
        }
      } catch (error) {
        console.error('Error loading instant loads:', error);
        setInstantLoads([]);
      }
    };

    // Load initial data
    loadInstantLoads();

    // Update every 5 seconds for real-time feel
    const loadTimer = setInterval(loadInstantLoads, 5000);

    return () => {
      clearInterval(loadTimer);
    };
  }, []);

  // 🏛️ TAXBANDITS FORM 2290 FILING FUNCTIONS
  const testTaxBanditsConnection = async () => {
    try {
      const result = await taxBanditsForm2290Service.testConnection();
      setTaxFilingStatus((prev) => ({ ...prev, connectionStatus: result }));
      return result;
    } catch (error) {
      const errorResult = {
        success: false,
        message: `❌ Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      setTaxFilingStatus((prev) => ({
        ...prev,
        connectionStatus: errorResult,
      }));
      return errorResult;
    }
  };

  const submitForm2290Filing = async () => {
    setTaxFilingStatus((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Generate mock vehicle data for demo
      const vehicleData = taxBanditsForm2290Service.generateMockVehicleData();

      // Submit to TaxBandits API
      const result =
        await taxBanditsForm2290Service.submitForm2290(vehicleData);

      setTaxFilingStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        lastSubmission: {
          submissionId: result.submissionId,
          status: result.success ? 'submitted' : 'failed',
          message: result.message,
          stampedSchedule1Url: result.stampedSchedule1Url,
        },
      }));

      if (result.success) {
        alert(
          `✅ Form 2290 successfully submitted!nnSubmission ID: ${result.submissionId}nMessage: ${result.message}`
        );
      } else {
        alert(
          `❌ Form 2290 submission failed:nn${result.message}nnErrors: ${result.errors?.join(', ') || 'None'}`
        );
      }
    } catch (error) {
      setTaxFilingStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        lastSubmission: {
          submissionId: '',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      }));
      alert(
        `❌ Form 2290 filing error:nn${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const checkSubmissionStatus = async (submissionId: string) => {
    try {
      const result =
        await taxBanditsForm2290Service.checkSubmissionStatus(submissionId);

      setTaxFilingStatus((prev) => ({
        ...prev,
        lastSubmission: prev.lastSubmission
          ? {
              ...prev.lastSubmission,
              status: result.status,
              message: result.message,
              stampedSchedule1Url: result.stampedSchedule1Url,
            }
          : null,
      }));

      alert(
        `📊 Submission Status Update:nnStatus: ${result.status}nMessage: ${result.message}`
      );
    } catch (error) {
      alert(
        `❌ Status check error:nn${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  // 🗺️ IFTA QUARTERLY FILING FUNCTIONS
  const testIFTAConnection = async () => {
    try {
      // Test connection with available state portals
      const mockResult = {
        success: true,
        message:
          '✅ IFTA connection successful! Connected to 6 state portals (CA, TX, FL, GA, AZ, NY)',
      };
      setIftaFilingStatus((prev) => ({
        ...prev,
        connectionStatus: mockResult,
      }));
      return mockResult;
    } catch (error) {
      const errorResult = {
        success: false,
        message: `❌ IFTA connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
      setIftaFilingStatus((prev) => ({
        ...prev,
        connectionStatus: errorResult,
      }));
      return errorResult;
    }
  };

  const submitIFTAReturn = async (quarter: string = 'Demo Period') => {
    // CLEARED FROM: 'Q4 2024'
    setIftaFilingStatus((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Generate mock IFTA return data using our service
      const returnData = iftaService.generateMockIFTAData();

      // Submit to multiple state jurisdictions
      const results = await iftaService.submitIFTAReturn(returnData);

      // Check if all submissions were successful
      const allSuccessful = results.every((r) => r.success);
      const totalTaxOwed = results.reduce(
        (sum, r) => sum + r.totalNetAmount,
        0
      );

      setIftaFilingStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        lastSubmission: {
          submissionId: results[0]?.submissionId || `IFTA-${Date.now()}`,
          quarter: quarter,
          status: allSuccessful ? 'submitted' : 'failed',
          message: allSuccessful
            ? 'IFTA return submitted to all jurisdictions'
            : 'Some jurisdictions failed',
          jurisdictions: results.length,
          totalTaxOwed: totalTaxOwed,
          filingDeadline: 'No deadline - Demo mode', // CLEARED FROM: 'January 31, 2025'
        },
      }));

      if (allSuccessful) {
        alert(
          `✅ IFTA ${quarter} return successfully submitted!\n\nJurisdictions: ${results.length}\nTotal Tax Owed: $${totalTaxOwed.toFixed(2)}\nDeadline: Demo mode - No deadline` // CLEARED FROM: January 31, 2025
        );
      } else {
        const errors = results.flatMap((r) => r.errors || []);
        alert(
          `❌ IFTA submission failed:\n\nSome jurisdictions failed\n\nErrors: ${errors.join(', ') || 'None'}`
        );
      }
    } catch (error) {
      setIftaFilingStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        lastSubmission: {
          submissionId: '',
          quarter: quarter,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          jurisdictions: 0,
          totalTaxOwed: 0,
          filingDeadline: 'No deadline - Demo mode', // CLEARED FROM: 'January 31, 2025'
        },
      }));
      alert(
        `❌ IFTA filing error:\n\n${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const checkIFTASubmissionStatus = async (submissionId: string) => {
    try {
      // Mock status check - in production would check real state portal APIs
      const mockResult = {
        success: true,
        status: 'processed',
        message: 'IFTA return processed successfully by all jurisdictions',
      };

      setIftaFilingStatus((prev) => ({
        ...prev,
        lastSubmission: prev.lastSubmission
          ? {
              ...prev.lastSubmission,
              status: mockResult.status,
              message: mockResult.message,
            }
          : null,
      }));

      alert(
        `📊 IFTA Status Update:\n\nStatus: ${mockResult.status}\nMessage: ${mockResult.message}`
      );
    } catch (error) {
      alert(
        `❌ IFTA status check error:\n\n${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  // 💰 FACTORING & PAYMENT PROCESSING FUNCTIONS
  const submitInvoiceForFactoring = async (invoiceId: string) => {
    try {
      setFactoringStatus((prev) => ({
        ...prev,
        pendingInvoices: prev.pendingInvoices.map((inv) =>
          inv.invoiceId === invoiceId
            ? { ...inv, status: 'factored' as const }
            : inv
        ),
      }));

      // Mock factoring submission
      const invoice = factoringStatus.pendingInvoices.find(
        (inv) => inv.invoiceId === invoiceId
      );
      if (invoice && factoringStatus.currentFactor) {
        const advanceAmount =
          invoice.amount * (factoringStatus.currentFactor.advanceRate / 100);

        alert(`✅ Invoice submitted for factoring!

Invoice: ${invoiceId}
Amount: $${invoice.amount.toFixed(2)}
Factor Advance (${factoringStatus.currentFactor.advanceRate}%): $${advanceAmount.toFixed(2)}
Expected Deposit: Within ${factoringStatus.currentFactor.daysToPayment} business day(s)`);

        // Add transaction record
        const newTransaction = {
          transactionId: `TXN-${Date.now()}`,
          type: 'factor_advance' as const,
          amount: advanceAmount,
          description: `Factor advance for ${invoiceId} (${invoice.customerName})`,
          date: new Date().toISOString().split('T')[0],
          status: 'pending' as const,
        };

        setFactoringStatus((prev) => ({
          ...prev,
          recentTransactions: [
            newTransaction,
            ...prev.recentTransactions.slice(0, 9),
          ],
        }));
      }
    } catch (error) {
      alert(
        `❌ Factoring submission error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const updatePaymentMethod = (
    method: 'directDeposit' | 'payCard' | 'check',
    enabled: boolean
  ) => {
    setFactoringStatus((prev) => ({
      ...prev,
      paymentMethods: {
        ...prev.paymentMethods,
        [method]: { ...prev.paymentMethods[method], enabled },
      },
    }));

    alert(
      `${enabled ? '✅ Enabled' : '❌ Disabled'} ${method.replace(/([A-Z])/g, ' $1').toLowerCase()} payment method`
    );
  };

  const requestAdvancePayment = async (amount: number) => {
    try {
      if (!factoringStatus.currentFactor) {
        alert('❌ No active factoring agreement');
        return;
      }

      if (amount > factoringStatus.currentFactor.availableCredit) {
        alert(
          `❌ Advance amount exceeds available credit: $${factoringStatus.currentFactor.availableCredit.toFixed(2)}`
        );
        return;
      }

      // Mock advance request
      const newTransaction = {
        transactionId: `ADV-${Date.now()}`,
        type: 'factor_advance' as const,
        amount: amount,
        description: `Advance payment request`,
        date: new Date().toISOString().split('T')[0],
        status: 'pending' as const,
      };

      setFactoringStatus((prev) => ({
        ...prev,
        currentFactor: prev.currentFactor
          ? {
              ...prev.currentFactor,
              availableCredit: prev.currentFactor.availableCredit - amount,
            }
          : null,
        recentTransactions: [
          newTransaction,
          ...prev.recentTransactions.slice(0, 9),
        ],
      }));

      alert(`✅ Advance payment requested!

Amount: $${amount.toFixed(2)}
Processing time: 1-2 business days
Remaining credit: $${(factoringStatus.currentFactor.availableCredit - amount).toFixed(2)}`);
    } catch (error) {
      alert(
        `❌ Advance request error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const workflowTasks = workflowManager.getActiveWorkflowTasks(
    demoDriver?.driverId || 'driver-001'
  );

  // Access control check - must be after all hooks
  if (!hasAccess) {
    return <AccessRestricted />;
  }

  return (
    <>
      {/* CSS Animations for Load Alerts */}
      <style jsx>{`
        @keyframes flash {
          0%,
          50% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0.5;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.02);
            opacity: 0.9;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
          }
          50% {
            box-shadow:
              0 0 20px rgba(59, 130, 246, 0.8),
              0 0 30px rgba(59, 130, 246, 0.6);
          }
        }

        .alert-flash {
          animation: flash 1s infinite;
        }
        .alert-pulse {
          animation: pulse 2s infinite;
        }
        .alert-glow {
          animation: glow 2s infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
          padding: '20px',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          {/* 🔧 ENHANCED HEADER - Unified Portal Style with Blue Theme */}
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
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '24px' }}
              >
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
              <div
                style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
              >
                {/* Driver Selection Dropdown */}
                {allDrivers.length > 1 && (
                  <select
                    value={selectedDriverIndex}
                    onChange={(e) =>
                      setSelectedDriverIndex(Number(e.target.value))
                    }
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: '600',
                      backdropFilter: 'blur(10px)',
                      marginRight: '12px',
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

                <GlobalNotificationBell department='driver' />
                <button
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
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
                      'linear-gradient(135deg, #2563eb, #1d4ed8)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #3b82f6, #2563eb)';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  🔄 Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* KPI Grid - Separate Section */}
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
                  {
                    workflowTasks.filter((t) => t.priority === 'CRITICAL')
                      .length
                  }
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
                  {alertQueue.acceptanceRate}%
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                  Acceptance Rate
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
                  {alertQueue.totalAlertsToday}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                  Total Alerts Today
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
                  {alertQueue.averageResponseTime}s
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                  Avg Response Time
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
                  {alertQueue.acceptedAlertsToday}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                  Accepted Today
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
                  {loadAlerts.filter((a) => a.status === 'active').length}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9, color: 'white' }}>
                  Active Alerts
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
                  border: '3px solid #fbbf24', // Bright yellow border ring
                  boxShadow:
                    '0 0 0 4px rgba(251, 191, 36, 0.4), 0 8px 32px rgba(220, 38, 38, 0.3)', // Yellow outer glow + original red shadow
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
                      No load assignments - Dashboard cleared for demo
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

          {/* 🚫 LOAD ACCESS RESTRICTION WARNING (if invoices overdue) */}
          {workflowTasks.some(
            (task) => task.type === 'dispatch_invoice_overdue_restricted'
          ) && (
            <div style={{ marginBottom: '25px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  borderRadius: '16px',
                  padding: '20px',
                  border: '3px solid #fbbf24', // Yellow ring around restriction warning
                  boxShadow:
                    '0 0 0 4px rgba(251, 191, 36, 0.4), 0 8px 32px rgba(220, 38, 38, 0.3)',
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
                      🚫 LOAD ACCESS RESTRICTED
                    </h3>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        opacity: 0.9,
                        fontSize: '16px',
                        color: 'white',
                      }}
                    >
                      Overdue dispatch invoice prevents load assignments. Pay
                      immediately to restore access.
                    </p>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        opacity: 0.8,
                        fontSize: '14px',
                        color: '#fbbf24',
                        fontWeight: '600',
                      }}
                    >
                      📋 No invoices - Dashboard cleared for demo
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
                    PAY NOW
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
                {
                  key: 'business-metrics',
                  label: '📈 Business Metrics',
                  icon: '📈',
                },
                {
                  key: 'go-with-the-flow',
                  label: '⚡ Go With the Flow',
                  icon: '⚡',
                },
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

                {/* 🚨 NEW LOAD ALERTS SECTION */}
                {loadAlerts.filter((a) => a.status === 'active').length > 0 && (
                  <div
                    style={{
                      background: 'rgba(220, 38, 38, 0.1)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: '16px',
                      padding: '25px',
                      marginBottom: '25px',
                      border: '2px solid rgba(220, 38, 38, 0.3)',
                      boxShadow: '0 8px 32px rgba(220, 38, 38, 0.2)',
                    }}
                  >
                    <h3
                      style={{
                        margin: '0 0 20px 0',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      🚨 NEW LOAD ALERTS - TIME RESTRICTED
                      <span
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          animation: 'pulse 2s infinite',
                        }}
                      >
                        {loadAlerts.filter((a) => a.status === 'active').length}{' '}
                        ACTIVE
                      </span>
                    </h3>

                    <div
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        overflow: 'hidden',
                        marginBottom: '15px',
                      }}
                    >
                      {/* Alert Header Row */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            '100px 2fr 2fr 1fr 1fr 1fr 140px',
                          gap: '12px',
                          padding: '15px 20px',
                          background: 'rgba(220, 38, 38, 0.3)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: 'white',
                        }}
                      >
                        <div>TIME LEFT</div>
                        <div>PICKUP</div>
                        <div>DELIVERY</div>
                        <div>PAY</div>
                        <div>DETAILS</div>
                        <div>DISPATCHER</div>
                        <div>ACTIONS</div>
                      </div>

                      {/* Alert Rows */}
                      {loadAlerts
                        .filter((alert) => alert.status === 'active')
                        .map((alert) => (
                          <LoadAlertRow
                            key={alert.id}
                            alert={alert}
                            onAccept={acceptLoadAlert}
                            onDecline={declineLoadAlert}
                          />
                        ))}
                    </div>

                    {/* Alert Controls */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                      }}
                    >
                      <button
                        onClick={generateDemoAlert}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          fontSize: '14px',
                        }}
                      >
                        🧪 Generate Demo Alert
                      </button>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'white',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={alertSoundsEnabled}
                          onChange={(e) =>
                            setAlertSoundsEnabled(e.target.checked)
                          }
                        />
                        🔊 Sound Alerts
                      </label>

                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          color: 'white',
                        }}
                      >
                        <input
                          type='checkbox'
                          checked={alertVibrationEnabled}
                          onChange={(e) =>
                            setAlertVibrationEnabled(e.target.checked)
                          }
                        />
                        📳 Vibration
                      </label>
                    </div>
                  </div>
                )}

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
                          minHeight: '80px',
                          color: 'white',
                          background:
                            load.loadType === 'ai_generated'
                              ? 'rgba(139, 92, 246, 0.05)'
                              : 'transparent',
                          transition: 'all 0.3s ease',
                          position: 'relative',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background =
                            load.loadType === 'ai_generated'
                              ? 'rgba(139, 92, 246, 0.1)'
                              : 'rgba(255, 255, 255, 0.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background =
                            load.loadType === 'ai_generated'
                              ? 'rgba(139, 92, 246, 0.05)'
                              : 'transparent';
                        }}
                      >
                        {/* Priority Column with AI Indicators */}
                        <div
                          style={{
                            minWidth: '80px',
                            marginRight: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
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
                              textAlign: 'center',
                              minWidth: '70px',
                            }}
                          >
                            {load.priority}
                          </span>

                          {/* AI Badge */}
                          {load.loadType === 'ai_generated' && (
                            <span
                              style={{
                                background: '#8b5cf6',
                                color: 'white',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '700',
                              }}
                            >
                              🤖 AI
                            </span>
                          )}

                          {/* Countdown Timer for AI Loads */}
                          {load.loadType === 'ai_generated' &&
                            load.bidDeadline && (
                              <div
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  color:
                                    new Date() > load.bidDeadline
                                      ? '#ef4444'
                                      : formatTimeRemaining(
                                            load.bidDeadline
                                          ).includes('h')
                                        ? '#22c55e'
                                        : '#fbbf24',
                                  textAlign: 'center',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  minWidth: '50px',
                                }}
                              >
                                {formatTimeRemaining(load.bidDeadline)}
                              </div>
                            )}
                        </div>

                        {/* Load Details Section */}
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            gap: '30px',
                            alignItems: 'center',
                          }}
                        >
                          {/* Load & Route Info */}
                          <div style={{ minWidth: '250px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '4px',
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: '700',
                                  color: 'white',
                                  fontSize: '16px',
                                }}
                              >
                                {load.id}
                              </span>
                              {/* AI Source Badge */}
                              {load.loadType === 'ai_generated' &&
                                load.aiSource && (
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      color: '#a78bfa',
                                      fontWeight: '600',
                                      background: 'rgba(139, 92, 246, 0.2)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {load.aiSource
                                      .replace('_', ' ')
                                      .toUpperCase()}
                                  </span>
                                )}
                              {/* Dedicated Lane Badge */}
                              {load.loadType === 'ai_generated' &&
                                load.dedicatedLane && (
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      color: '#fbbf24',
                                      fontWeight: '600',
                                      background: 'rgba(251, 191, 36, 0.2)',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    🎯 DEDICATED LANE
                                  </span>
                                )}
                            </div>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                opacity: 0.9,
                                marginBottom: '2px',
                              }}
                            >
                              {load.origin} → {load.destination}
                            </div>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '12px',
                                opacity: 0.7,
                              }}
                            >
                              {load.commodity}
                            </div>
                            {/* Dedicated Lane Details */}
                            {load.loadType === 'ai_generated' &&
                              load.dedicatedLane && (
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#fbbf24',
                                    marginTop: '2px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.dedicatedLane.laneName} •{' '}
                                  {load.dedicatedLane.frequency}
                                </div>
                              )}
                          </div>

                          {/* Pay & Miles */}
                          <div
                            style={{ minWidth: '100px', textAlign: 'center' }}
                          >
                            <div
                              style={{
                                color: '#22c55e',
                                fontSize: '18px',
                                fontWeight: '700',
                                marginBottom: '2px',
                              }}
                            >
                              {load.pay}
                            </div>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '12px',
                                opacity: 0.8,
                              }}
                            >
                              {load.miles}
                            </div>
                          </div>

                          {/* Rate */}
                          <div
                            style={{ minWidth: '80px', textAlign: 'center' }}
                          >
                            <div
                              style={{
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: '600',
                              }}
                            >
                              ${load.rate}/mi
                            </div>
                          </div>

                          {/* Pickup */}
                          <div
                            style={{ minWidth: '100px', textAlign: 'center' }}
                          >
                            <div
                              style={{
                                color: 'white',
                                fontSize: '14px',
                                fontWeight: '600',
                              }}
                            >
                              {load.pickupDate}
                            </div>
                          </div>
                        </div>

                        {/* Actions Column - Different for Traditional vs AI */}
                        <div
                          style={{
                            minWidth: '180px',
                            textAlign: 'center',
                            marginLeft: '20px',
                          }}
                        >
                          {load.loadType === 'traditional' ? (
                            /* Traditional Load - Express Interest Button */
                            <button
                              onClick={() =>
                                alert(
                                  `✋ Express Interest submitted for ${load.id}!\n\nDispatcher ${load.dispatcherName} will be notified of your interest and will respond with approval or load availability status.`
                                )
                              }
                              style={{
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                width: '140px',
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.background = '#16a34a';
                                e.currentTarget.style.transform =
                                  'translateY(-2px)';
                                e.currentTarget.style.boxShadow =
                                  '0 4px 12px rgba(34, 197, 94, 0.3)';
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.background = '#22c55e';
                                e.currentTarget.style.transform =
                                  'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            >
                              ✋ Express Interest
                            </button>
                          ) : (
                            /* AI-Generated Load - Quick Bid Interface */
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                alignItems: 'center',
                              }}
                            >
                              {/* AI Recommendation Display */}
                              {load.aiRecommendation && (
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: '#a78bfa',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    width: '160px',
                                  }}
                                >
                                  <div>
                                    🧠 AI: $
                                    {load.aiRecommendation.suggestedBid.toLocaleString()}
                                  </div>
                                  <div
                                    style={{
                                      color: '#22c55e',
                                      fontSize: '10px',
                                      marginTop: '2px',
                                    }}
                                  >
                                    Win: {load.aiRecommendation.winProbability}%
                                    • Risk:{' '}
                                    {load.aiRecommendation.riskAssessment.toUpperCase()}
                                  </div>
                                </div>
                              )}

                              {/* Quick Bid Button */}
                              <button
                                onClick={() => {
                                  const amount =
                                    load.aiRecommendation?.suggestedBid ||
                                    load.minimumBid ||
                                    0;
                                  const isExpired =
                                    load.bidDeadline &&
                                    new Date() > load.bidDeadline;

                                  if (isExpired) {
                                    alert(
                                      '⏰ Bidding period has expired for this load.'
                                    );
                                    return;
                                  }

                                  alert(
                                    `🎯 Quick Bid Submitted!\n\nLoad: ${load.id}\nBid Amount: $${amount.toLocaleString()}\nCompeting against: ${load.competitorCount} other bidders\n\n✅ Your bid has been submitted to the AI evaluation system. Results will be announced when the 24-hour bidding period ends.`
                                  );
                                }}
                                disabled={
                                  load.bidDeadline &&
                                  new Date() > load.bidDeadline
                                }
                                style={{
                                  background:
                                    load.bidDeadline &&
                                    new Date() > load.bidDeadline
                                      ? '#6b7280'
                                      : '#f97316',
                                  color: 'white',
                                  border: 'none',
                                  padding: '10px 18px',
                                  borderRadius: '8px',
                                  fontSize: '14px',
                                  fontWeight: '700',
                                  cursor:
                                    load.bidDeadline &&
                                    new Date() > load.bidDeadline
                                      ? 'not-allowed'
                                      : 'pointer',
                                  transition: 'all 0.3s ease',
                                  opacity:
                                    load.bidDeadline &&
                                    new Date() > load.bidDeadline
                                      ? 0.6
                                      : 1,
                                  width: '140px',
                                }}
                                onMouseOver={(e) => {
                                  if (
                                    !(
                                      load.bidDeadline &&
                                      new Date() > load.bidDeadline
                                    )
                                  ) {
                                    e.currentTarget.style.background =
                                      '#ea580c';
                                    e.currentTarget.style.transform =
                                      'translateY(-2px)';
                                    e.currentTarget.style.boxShadow =
                                      '0 4px 12px rgba(249, 115, 22, 0.3)';
                                  }
                                }}
                                onMouseOut={(e) => {
                                  if (
                                    !(
                                      load.bidDeadline &&
                                      new Date() > load.bidDeadline
                                    )
                                  ) {
                                    e.currentTarget.style.background =
                                      '#f97316';
                                    e.currentTarget.style.transform =
                                      'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                  }
                                }}
                              >
                                {load.bidDeadline &&
                                new Date() > load.bidDeadline
                                  ? '⏰ Expired'
                                  : '🎯 Quick Bid'}
                              </button>

                              {/* Competitor Count & Bid Range */}
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  width: '160px',
                                  fontSize: '10px',
                                }}
                              >
                                <span
                                  style={{
                                    color: '#ef4444',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.competitorCount} bidders
                                </span>
                                {load.suggestedBidRange && (
                                  <span
                                    style={{ color: 'white', opacity: 0.7 }}
                                  >
                                    $
                                    {load.suggestedBidRange[0].toLocaleString()}
                                    -$
                                    {load.suggestedBidRange[1].toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'business-metrics' && (
              <div>
                {/* 📈 COMPREHENSIVE BUSINESS METRICS SECTION */}
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
                      margin: '0 0 25px 0',
                      fontSize: '22px',
                      fontWeight: 'bold',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    📊 Business Metrics & Performance
                  </h3>

                  {/* Extended Performance Metrics Grid */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4
                      style={{
                        margin: '0 0 15px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#60a5fa',
                      }}
                    >
                      🎯 Extended Performance Metrics
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#60a5fa',
                          }}
                        >
                          {businessMetrics.performance.onTimeDelivery}%
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          On-Time Delivery
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#60a5fa',
                          }}
                        >
                          {businessMetrics.performance.fuelEfficiency}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Fuel Efficiency
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#60a5fa',
                          }}
                        >
                          {businessMetrics.performance.hoursOfService}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Hours of Service
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#60a5fa',
                          }}
                        >
                          {businessMetrics.performance.avgDeliveryTime}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Avg Delivery Time
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {businessMetrics.performance.violations}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Violations
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {businessMetrics.performance.CSAScore}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          CSA Score
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color:
                              (fuelPrice?.priceChange ?? 0) >= 0
                                ? '#ef4444'
                                : '#22c55e',
                          }}
                        >
                          ${fuelPrice?.currentPrice?.toFixed(2) || '0.00'}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            opacity: 0.8,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '2px',
                          }}
                        >
                          🛢️ Diesel{' '}
                          {(fuelPrice?.priceChange ?? 0) >= 0 ? '↗️' : '↘️'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Tracking */}
                  <div style={{ marginBottom: '30px' }}>
                    <h4
                      style={{
                        margin: '0 0 15px 0',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#22c55e',
                      }}
                    >
                      💰 Revenue & Goals Tracking
                    </h4>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: '15px',
                        marginBottom: '15px',
                      }}
                    >
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {businessMetrics.revenue.monthly}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          This Month
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {businessMetrics.revenue.weekly}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          This Week
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#22c55e',
                          }}
                        >
                          {businessMetrics.revenue.avgPerLoad}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Avg per Load
                        </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: '#fbbf24',
                          }}
                        >
                          {businessMetrics.revenue.progressToGoal}
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            opacity: 0.8,
                            color: 'white',
                          }}
                        >
                          Goal Progress
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        padding: '10px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '5px',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'white',
                            opacity: 0.8,
                          }}
                        >
                          Goal: {businessMetrics.revenue.revenueGoal}
                        </span>
                        <span
                          style={{
                            fontSize: '14px',
                            color: '#22c55e',
                            fontWeight: '600',
                          }}
                        >
                          {businessMetrics.revenue.progressToGoal}
                        </span>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '10px',
                          height: '8px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background: '#22c55e',
                            height: '100%',
                            width: businessMetrics.revenue.progressToGoal,
                            borderRadius: '10px',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Settlement, Tax, and Pay Period Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '25px',
                    }}
                  >
                    {/* Settlement Information */}
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#22c55e',
                        }}
                      >
                        💳 Settlement & Payments
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Pending Payments
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            {businessMetrics.settlement.pendingPayments}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Last Settlement
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.settlement.lastSettlement}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Next Settlement
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.settlement.nextSettlement}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Completed Loads
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.settlement.completedLoads}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Avg Settlement Time
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.settlement.averageSettlementTime}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Tax Information */}
                    <div
                      style={{
                        background: 'rgba(251, 191, 36, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(251, 191, 36, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#fbbf24',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        📋 Tax Management
                        {businessMetrics.tax.alerts > 0 && (
                          <span
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '600',
                            }}
                          >
                            {businessMetrics.tax.alerts} Alert
                          </span>
                        )}
                      </h5>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Quarterly Due
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#fbbf24',
                            }}
                          >
                            {businessMetrics.tax.quarterlyDue}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            YTD Deductions
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.tax.ytdDeductions}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Mileage Deduction
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.tax.mileageDeduction}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Fuel Tax Credits
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            {businessMetrics.tax.fuelTaxCredits}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Next Estimate
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.tax.nextQuarterlyEstimate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 🚨 ENHANCED IFTA & TAX DASHBOARD */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1))',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #ef4444',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        🚨 URGENT: IFTA Filing Alert
                        <span
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            animation: 'pulse 2s infinite',
                          }}
                        >
                          0 DAYS LEFT {/* CLEARED FROM: 5 DAYS LEFT */}
                        </span>
                      </h5>

                      <div style={{ marginBottom: '15px' }}>
                        <div
                          style={{
                            fontSize: '14px',
                            color: 'white',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          Demo IFTA filing - No dates configured{' '}
                          {/* CLEARED FROM: Q4 2024 IFTA filing is due in 5 days (January 31, 2025) */}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            marginBottom: '12px',
                          }}
                        >
                          Demo mode - No fuel receipts to process.{' '}
                          {/* CLEARED FROM: Missing fuel receipts detected. Upload required before filing. */}
                        </div>

                        <button
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            marginRight: '10px',
                          }}
                        >
                          🚨 File IFTA Now
                        </button>
                        <button
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                        >
                          📋 Upload Receipts
                        </button>
                      </div>
                    </div>

                    {/* 📊 COMPREHENSIVE IFTA DASHBOARD */}
                    <div
                      style={{
                        background: 'rgba(139, 92, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                        marginBottom: '20px',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#a78bfa',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        📊 IFTA Tax Dashboard
                      </h5>

                      {/* IFTA Summary Cards */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#60a5fa',
                            }}
                          >
                            0 {/* CLEARED FROM: 52,847 */}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            🛣️ Total Miles (YTD)
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#10b981',
                            }}
                          >
                            $0 {/* CLEARED FROM: $18,247 */}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            ⛽ Fuel Purchased (YTD)
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#f59e0b',
                            }}
                          >
                            $0 {/* CLEARED FROM: $3,247 */}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            💰 Tax Liability (YTD)
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#22c55e',
                            }}
                          >
                            $0 {/* CLEARED FROM: $847 */}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            💸 Refunds Received
                          </div>
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '18px', color: '#ef4444' }}>
                            ❌
                          </span>
                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                              }}
                            >
                              IFTA Status
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Action Required
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '18px', color: '#ef4444' }}>
                            ❌
                          </span>
                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                              }}
                            >
                              Fuel Receipts
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Missing Receipts
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '8px',
                            padding: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ fontSize: '18px', color: '#22c55e' }}>
                            ✅
                          </span>
                          <div>
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: 'white',
                              }}
                            >
                              Mileage Logs
                            </div>
                            <div
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 🧾 MANAGEMENT-APPROVED DISPATCH INVOICES */}
                    <div
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #f97316',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#f97316',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        🧾 Management-Approved Dispatch Invoices
                        <span
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            animation: 'pulse 2s infinite',
                          }}
                        >
                          PAY BY THURSDAY
                        </span>
                      </h5>

                      {/* Payment Schedule Warning */}
                      <div
                        style={{
                          background: 'rgba(220, 38, 38, 0.1)',
                          border: '1px solid #dc2626',
                          borderRadius: '8px',
                          padding: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#ef4444',
                            marginBottom: '6px',
                          }}
                        >
                          ⚠️ PAYMENT SCHEDULE & RESTRICTIONS:
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'white',
                            lineHeight: '1.4',
                          }}
                        >
                          • <strong>DUE:</strong> Every Thursday by 11:59 PM
                          <br />• <strong>LATE:</strong> Friday - considered
                          overdue
                          <br />• <strong>RESTRICTION:</strong> No load
                          assignments until paid
                        </div>
                      </div>

                      {/* Invoice Status */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '12px',
                          marginBottom: '20px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#ef4444',
                            }}
                          >
                            $0 {/* CLEARED FROM: $740 */}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            💰 Total Due
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#fbbf24',
                            }}
                          >
                            Thu
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            📅 Due Day
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#dc2626',
                            }}
                          >
                            RESTRICTED
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            🚫 Load Access
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#22c55e',
                            }}
                          >
                            ✅
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            📋 Mgmt Approved
                          </div>
                        </div>
                      </div>

                      {/* Recent Invoices List */}
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          overflow: 'hidden',
                          marginBottom: '15px',
                        }}
                      >
                        {/* Header */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 120px 1fr 100px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            background: 'rgba(249, 115, 22, 0.3)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'white',
                          }}
                        >
                          <div>INVOICE #</div>
                          <div>PERIOD</div>
                          <div>DESCRIPTION</div>
                          <div>AMOUNT</div>
                          <div>STATUS</div>
                        </div>

                        {/* Invoice Rows */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 120px 1fr 100px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '13px',
                            color: 'white',
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#f97316' }}>
                            INV-001
                          </div>
                          <div>Jan 1-7</div>
                          <div>3 loads dispatched (10% fee)</div>
                          <div style={{ fontWeight: '600', color: '#ef4444' }}>
                            $0.00 {/* CLEARED FROM: $455.00 */}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{ color: '#ef4444', fontSize: '12px' }}
                            >
                              ●
                            </span>
                            <span
                              style={{ color: '#ef4444', fontSize: '12px' }}
                            >
                              DUE
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 120px 1fr 100px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '13px',
                            color: 'white',
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#f97316' }}>
                            INV-052
                          </div>
                          <div>Dec 18-24</div>
                          <div>2 loads dispatched + late fee</div>
                          <div style={{ fontWeight: '600', color: '#dc2626' }}>
                            $0.00
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{ color: '#dc2626', fontSize: '12px' }}
                            >
                              ●
                            </span>
                            <span
                              style={{ color: '#dc2626', fontSize: '12px' }}
                            >
                              OVERDUE
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '100px 120px 1fr 100px 120px',
                            gap: '12px',
                            padding: '12px 16px',
                            fontSize: '13px',
                            color: 'white',
                          }}
                        >
                          <div style={{ fontWeight: '600', color: '#f97316' }}>
                            INV-002
                          </div>
                          <div>Jan 8-14</div>
                          <div>4 loads dispatched (10% fee)</div>
                          <div style={{ fontWeight: '600', color: '#f59e0b' }}>
                            $0.00 {/* CLEARED FROM: $380.00 */}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{ color: '#f59e0b', fontSize: '12px' }}
                            >
                              ●
                            </span>
                            <span
                              style={{ color: '#f59e0b', fontSize: '12px' }}
                            >
                              PENDING
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '15px 25px',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        💳 PAY ALL INVOICES - RESTORE LOAD ACCESS ($0){' '}
                        {/* CLEARED FROM: ($740) */}
                      </button>
                    </div>

                    {/* Pay Period Breakdown */}
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 15px 0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#60a5fa',
                        }}
                      >
                        💵 Current Pay Period
                      </h5>
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span
                            style={{
                              fontSize: '12px',
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            {businessMetrics.payPeriod.current.period}
                          </span>
                        </div>
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Gross Pay
                          </span>
                          <span
                            style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              color: '#22c55e',
                            }}
                          >
                            {businessMetrics.payPeriod.current.grossPay}
                          </span>
                        </div>
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Bonuses
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#fbbf24',
                            }}
                          >
                            {businessMetrics.payPeriod.current.bonuses}
                          </span>
                        </div>
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Deductions
                          </span>
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#ef4444',
                            }}
                          >
                            -
                            {businessMetrics.payPeriod.current.deductions.total}
                          </span>
                        </div>
                        <hr
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            margin: '10px 0',
                          }}
                        />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            Net Pay
                          </span>
                          <span
                            style={{
                              fontSize: '20px',
                              fontWeight: 'bold',
                              color: '#fbbf24',
                            }}
                          >
                            {businessMetrics.payPeriod.current.netPay}
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '8px',
                          padding: '10px',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'white',
                            opacity: 0.8,
                            marginBottom: '5px',
                          }}
                        >
                          Last Period:{' '}
                          {businessMetrics.payPeriod.lastPeriod.period}
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
                              color: 'white',
                              opacity: 0.8,
                            }}
                          >
                            Net Pay
                          </span>
                          <span
                            style={{
                              fontSize: '16px',
                              fontWeight: '600',
                              color: 'white',
                            }}
                          >
                            {businessMetrics.payPeriod.lastPeriod.netPay}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 🚛 AUTOMATED TAX FILING INTEGRATION */}
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 70, 229, 0.1))',
                        borderRadius: '12px',
                        padding: '20px',
                        border: '2px solid #6366f1',
                        marginBottom: '20px',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                      }}
                    >
                      <h5
                        style={{
                          margin: '0 0 20px 0',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        🚛 Automated Tax Filing System
                        <span
                          style={{
                            background: '#22c55e',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          API INTEGRATED
                        </span>
                      </h5>

                      {/* Tax Filing Services Grid */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '20px',
                          marginBottom: '20px',
                        }}
                      >
                        {/* Form 2290 Heavy Vehicle Tax */}
                        <div
                          style={{
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid #22c55e',
                            borderRadius: '12px',
                            padding: '20px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '15px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '20px',
                                background: '#22c55e',
                                borderRadius: '8px',
                                padding: '8px',
                              }}
                            >
                              🏛️
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#22c55e',
                                }}
                              >
                                Form 2290 - IRS e-File
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'white',
                                  opacity: 0.8,
                                }}
                              >
                                Heavy Highway Vehicle Tax
                              </div>
                            </div>
                          </div>

                          {/* Tax Status */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '10px',
                              marginBottom: '15px',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: '#22c55e',
                                }}
                              >
                                $0 {/* CLEARED FROM: $550 */}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'white',
                                  opacity: 0.7,
                                }}
                              >
                                Estimated Tax
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: '#fbbf24',
                                }}
                              >
                                0 Vehicles {/* CLEARED FROM: 3 Vehicles */}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'white',
                                  opacity: 0.7,
                                }}
                              >
                                Demo Weight Class{' '}
                                {/* CLEARED FROM: Over 55K lbs */}
                              </div>
                            </div>
                          </div>

                          {/* TaxBandits Connection Test */}
                          <div
                            style={{
                              marginBottom: '10px',
                              textAlign: 'center',
                            }}
                          >
                            <button
                              onClick={testTaxBanditsConnection}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                              }}
                              onMouseOver={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#2563eb')
                              }
                              onMouseOut={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#3b82f6')
                              }
                            >
                              🔗 Test TaxBandits Connection
                            </button>
                            {taxFilingStatus.connectionStatus && (
                              <div
                                style={{
                                  fontSize: '10px',
                                  marginTop: '5px',
                                  color: taxFilingStatus.connectionStatus
                                    .success
                                    ? '#22c55e'
                                    : '#ef4444',
                                }}
                              >
                                {taxFilingStatus.connectionStatus.message}
                              </div>
                            )}
                          </div>
                          {/* File Button */}
                          <button
                            style={{
                              width: '100%',
                              background: '#22c55e',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) =>
                              ((
                                e.target as HTMLButtonElement
                              ).style.background = '#16a34a')
                            }
                            onMouseOut={(e) =>
                              ((
                                e.target as HTMLButtonElement
                              ).style.background = '#22c55e')
                            }
                            onClick={submitForm2290Filing}
                            disabled={taxFilingStatus.isSubmitting}
                          >
                            {taxFilingStatus.isSubmitting
                              ? '⏳ Filing in Progress...'
                              : '🚀 File Form 2290 Now'}
                          </button>

                          {/* Last Filing */}
                          <div
                            style={{
                              marginTop: '10px',
                              fontSize: '11px',
                              color: 'white',
                              opacity: 0.7,
                              textAlign: 'center',
                            }}
                          >
                            {taxFilingStatus.lastSubmission
                              ? `Last submission: ${taxFilingStatus.lastSubmission.submissionId} (${taxFilingStatus.lastSubmission.status}) ${taxFilingStatus.lastSubmission.status === 'submitted' ? '✅' : '❌'}`
                              : 'No recent submissions'}
                          </div>
                        </div>

                        {/* IFTA Quarterly Filing */}
                        <div
                          style={{
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid #a855f7',
                            borderRadius: '12px',
                            padding: '20px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '15px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '20px',
                                background: '#a855f7',
                                borderRadius: '8px',
                                padding: '8px',
                              }}
                            >
                              🗺️
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '700',
                                  color: '#a855f7',
                                }}
                              >
                                IFTA Filing - Demo Period{' '}
                                {/* CLEARED FROM: Q4 2024 */}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: 'white',
                                  opacity: 0.8,
                                }}
                              >
                                International Fuel Tax
                              </div>
                            </div>
                          </div>

                          {/* IFTA Status */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '10px',
                              marginBottom: '15px',
                            }}
                          >
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: '#ef4444',
                                }}
                              >
                                $0 {/* CLEARED FROM: $1,247 */}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'white',
                                  opacity: 0.7,
                                }}
                              >
                                Tax Owed
                              </div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 'bold',
                                  color: '#60a5fa',
                                }}
                              >
                                0 States {/* CLEARED FROM: 8 States */}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'white',
                                  opacity: 0.7,
                                }}
                              >
                                Jurisdictions
                              </div>
                            </div>
                          </div>

                          {/* IFTA Due Date Warning */}
                          <div
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid #ef4444',
                              borderRadius: '8px',
                              padding: '8px',
                              marginBottom: '15px',
                              textAlign: 'center',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#ef4444',
                              }}
                            >
                              ⚠️ DUE: No date set (Demo){' '}
                              {/* CLEARED FROM: January 31, 2025 */}
                            </div>
                            <div
                              style={{
                                fontSize: '10px',
                                color: 'white',
                                opacity: 0.8,
                              }}
                            >
                              0 days remaining (Demo){' '}
                              {/* CLEARED FROM: 5 days remaining */}
                            </div>
                          </div>

                          {/* IFTA Connection Test */}
                          <div
                            style={{
                              marginBottom: '10px',
                              textAlign: 'center',
                            }}
                          >
                            <button
                              onClick={testIFTAConnection}
                              style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                              }}
                              onMouseOver={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#2563eb')
                              }
                              onMouseOut={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#3b82f6')
                              }
                            >
                              🌐 Test IFTA Connection
                            </button>
                            {iftaFilingStatus.connectionStatus && (
                              <div
                                style={{
                                  fontSize: '10px',
                                  marginTop: '5px',
                                  color: iftaFilingStatus.connectionStatus
                                    .success
                                    ? '#22c55e'
                                    : '#ef4444',
                                }}
                              >
                                {iftaFilingStatus.connectionStatus.message}
                              </div>
                            )}
                          </div>

                          {/* File Button */}
                          <button
                            style={{
                              width: '100%',
                              background: '#a855f7',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'background 0.2s',
                            }}
                            onMouseOver={(e) =>
                              ((
                                e.target as HTMLButtonElement
                              ).style.background = '#9333ea')
                            }
                            onMouseOut={(e) =>
                              ((
                                e.target as HTMLButtonElement
                              ).style.background = '#a855f7')
                            }
                            onClick={() => submitIFTAReturn('Demo Period')} // CLEARED FROM: 'Q4 2024'
                            disabled={iftaFilingStatus.isSubmitting}
                          >
                            {iftaFilingStatus.isSubmitting
                              ? '⏳ Filing in Progress...'
                              : '📊 File IFTA Return'}
                          </button>

                          {/* Multi-State Status */}
                          <div
                            style={{
                              marginTop: '10px',
                              fontSize: '11px',
                              color: 'white',
                              opacity: 0.7,
                              textAlign: 'center',
                            }}
                          >
                            CA, TX, FL, GA ready for e-filing
                          </div>
                        </div>
                      </div>

                      {/* Integration Status */}
                      <div
                        style={{
                          background: 'rgba(34, 197, 94, 0.05)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          borderRadius: '8px',
                          padding: '15px',
                          marginBottom: '15px',
                        }}
                      >
                        <h6
                          style={{
                            margin: '0 0 10px 0',
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#22c55e',
                          }}
                        >
                          🔗 API Integration Status
                        </h6>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns:
                              'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '10px',
                            fontSize: '12px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <span style={{ color: '#22c55e' }}>✅</span>
                            <span style={{ color: 'white' }}>
                              IRS e-File (Form 2290)
                            </span>
                          </div>
                          {iftaFilingStatus.lastSubmission ? (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      iftaFilingStatus.lastSubmission.status ===
                                      'submitted'
                                        ? '#22c55e'
                                        : '#ef4444',
                                  }}
                                >
                                  {iftaFilingStatus.lastSubmission.status ===
                                  'submitted'
                                    ? '✅'
                                    : '❌'}
                                </span>
                                <span style={{ color: 'white' }}>
                                  IFTA {iftaFilingStatus.lastSubmission.quarter}{' '}
                                  Filing
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#3b82f6' }}>📊</span>
                                <span style={{ color: 'white' }}>
                                  {
                                    iftaFilingStatus.lastSubmission
                                      .jurisdictions
                                  }{' '}
                                  Jurisdictions Filed
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#f97316' }}>💰</span>
                                <span style={{ color: 'white' }}>
                                  $
                                  {iftaFilingStatus.lastSubmission.totalTaxOwed.toFixed(
                                    2
                                  )}{' '}
                                  Total Tax
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#22c55e' }}>✅</span>
                                <span style={{ color: 'white' }}>
                                  California IFTA Portal
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#fbbf24' }}>🔄</span>
                                <span style={{ color: 'white' }}>
                                  Texas IFTA (Ready)
                                </span>
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ color: '#fbbf24' }}>🔄</span>
                                <span style={{ color: 'white' }}>
                                  Florida IFTA (Ready)
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns:
                            'repeat(auto-fit, minmax(140px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#22c55e',
                            }}
                          >
                            15 min
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            ⚡ Filing Time Saved
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#60a5fa',
                            }}
                          >
                            $500
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            💰 Annual Savings
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#a855f7',
                            }}
                          >
                            24/7
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            🕒 Automated Filing
                          </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: '16px',
                              fontWeight: 'bold',
                              color: '#f59e0b',
                            }}
                          >
                            100%
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              opacity: 0.8,
                              color: 'white',
                            }}
                          >
                            ✅ Compliance Rate
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 💰 FACTORING AND FUNDING DASHBOARD */}
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.1))',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}
                >
                  <h3
                    style={{
                      color: '#22c55e',
                      marginBottom: '20px',
                      fontSize: '18px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    💰 Factoring and Funding
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                      gap: '20px',
                    }}
                  >
                    {/* Current Factor Information */}
                    <div
                      style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(34, 197, 94, 0.2)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#22c55e',
                          marginBottom: '15px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        🏦 Current Factor Agreement
                      </h4>

                      {factoringStatus.currentFactor && (
                        <>
                          <div style={{ marginBottom: '10px' }}>
                            <div
                              style={{
                                fontSize: '12px',
                                color: '#94a3b8',
                                marginBottom: '2px',
                              }}
                            >
                              Factor Company
                            </div>
                            <div style={{ color: 'white', fontWeight: '600' }}>
                              {factoringStatus.currentFactor.name}
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr',
                              gap: '10px',
                            }}
                          >
                            <div>
                              <div
                                style={{ fontSize: '10px', color: '#94a3b8' }}
                              >
                                Rate
                              </div>
                              <div
                                style={{ color: '#22c55e', fontWeight: '600' }}
                              >
                                {factoringStatus.currentFactor.rate}%
                              </div>
                            </div>
                            <div>
                              <div
                                style={{ fontSize: '10px', color: '#94a3b8' }}
                              >
                                Advance Rate
                              </div>
                              <div
                                style={{ color: '#22c55e', fontWeight: '600' }}
                              >
                                {factoringStatus.currentFactor.advanceRate}%
                              </div>
                            </div>
                            <div>
                              <div
                                style={{ fontSize: '10px', color: '#94a3b8' }}
                              >
                                Available Credit
                              </div>
                              <div
                                style={{ color: '#fbbf24', fontWeight: '600' }}
                              >
                                $
                                {factoringStatus.currentFactor.availableCredit.toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{ fontSize: '10px', color: '#94a3b8' }}
                              >
                                Days to Payment
                              </div>
                              <div
                                style={{ color: '#3b82f6', fontWeight: '600' }}
                              >
                                {factoringStatus.currentFactor.daysToPayment}{' '}
                                day(s)
                              </div>
                            </div>
                          </div>

                          <div style={{ marginTop: '15px' }}>
                            <button
                              onClick={() => requestAdvancePayment(1000)}
                              style={{
                                width: '100%',
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'background 0.2s',
                              }}
                              onMouseOver={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#16a34a')
                              }
                              onMouseOut={(e) =>
                                ((
                                  e.target as HTMLButtonElement
                                ).style.background = '#22c55e')
                              }
                            >
                              💳 Request $0 Advance{' '}
                              {/* CLEARED FROM: $1,000 Advance */}
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Pending Invoices */}
                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#3b82f6',
                          marginBottom: '15px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        📋 Pending Invoices
                      </h4>

                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {factoringStatus.pendingInvoices.map(
                          (invoice, index) => (
                            <div
                              key={invoice.invoiceId}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                padding: '10px',
                                marginBottom: '8px',
                                fontSize: '11px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '5px',
                                }}
                              >
                                <span
                                  style={{ color: 'white', fontWeight: '600' }}
                                >
                                  {invoice.invoiceId}
                                </span>
                                <span
                                  style={{
                                    color:
                                      invoice.status === 'factored'
                                        ? '#22c55e'
                                        : invoice.status === 'pending_factor'
                                          ? '#fbbf24'
                                          : '#3b82f6',
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                  }}
                                >
                                  {invoice.status.replace('_', ' ')}
                                </span>
                              </div>
                              <div
                                style={{
                                  color: '#94a3b8',
                                  marginBottom: '3px',
                                }}
                              >
                                {invoice.customerName}
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <span
                                  style={{
                                    color: '#22c55e',
                                    fontWeight: '600',
                                  }}
                                >
                                  ${invoice.amount.toLocaleString()}
                                </span>
                                <span style={{ color: '#94a3b8' }}>
                                  {invoice.invoiceDate}
                                </span>
                              </div>

                              {invoice.status === 'pending_factor' && (
                                <button
                                  onClick={() =>
                                    submitInvoiceForFactoring(invoice.invoiceId)
                                  }
                                  style={{
                                    width: '100%',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    fontSize: '10px',
                                    marginTop: '8px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  💰 Submit for Factoring
                                </button>
                              )}

                              {invoice.status === 'factored' &&
                                invoice.factorAdvance && (
                                  <div
                                    style={{
                                      marginTop: '5px',
                                      fontSize: '10px',
                                      color: '#22c55e',
                                    }}
                                  >
                                    Advance: $
                                    {invoice.factorAdvance.toLocaleString()} (
                                    {invoice.advanceDate})
                                  </div>
                                )}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div
                      style={{
                        background: 'rgba(168, 85, 247, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#a855f7',
                          marginBottom: '15px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        💳 Payment Methods
                      </h4>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div
                          style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          <span>
                            🏦 Direct Deposit:{' '}
                            {factoringStatus.paymentMethods.directDeposit
                              .enabled
                              ? 'ON'
                              : 'OFF'}
                          </span>
                        </div>
                        <div
                          style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          <span>
                            💳 Pay Card:{' '}
                            {factoringStatus.paymentMethods.payCard.enabled
                              ? 'ON'
                              : 'OFF'}
                          </span>
                        </div>
                        <div
                          style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '12px',
                            color: 'white',
                          }}
                        >
                          <span>
                            📮 Check:{' '}
                            {factoringStatus.paymentMethods.check.enabled
                              ? 'ON'
                              : 'OFF'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Recent Transactions */}
                    <div
                      style={{
                        background: 'rgba(249, 115, 22, 0.1)',
                        borderRadius: '8px',
                        padding: '15px',
                        border: '1px solid rgba(249, 115, 22, 0.2)',
                      }}
                    >
                      <h4
                        style={{
                          color: '#f97316',
                          marginBottom: '15px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        📊 Recent Transactions
                      </h4>

                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {factoringStatus.recentTransactions.map(
                          (txn, index) => (
                            <div
                              key={txn.transactionId}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '6px',
                                padding: '8px',
                                marginBottom: '6px',
                                fontSize: '11px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  marginBottom: '3px',
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      txn.type === 'factor_advance'
                                        ? '#22c55e'
                                        : txn.type === 'settlement'
                                          ? '#3b82f6'
                                          : '#f97316',
                                    fontWeight: '600',
                                  }}
                                >
                                  ${txn.amount.toLocaleString()}
                                </span>
                                <span
                                  style={{ color: '#22c55e', fontSize: '9px' }}
                                >
                                  {txn.status.toUpperCase()}
                                </span>
                              </div>
                              <div
                                style={{ color: 'white', marginBottom: '2px' }}
                              >
                                {txn.description}
                              </div>
                              <div
                                style={{ color: '#94a3b8', fontSize: '10px' }}
                              >
                                {txn.date}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
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
                    {workflowTasks
                      .filter(
                        (task) => task.type !== 'load_assignment_confirmation'
                      )
                      .map((task, index) => (
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

                {/* 🗺️ GPS-PROXIMITY NEARBY LOADS SYSTEM */}
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
                  <div style={{ marginBottom: '20px' }}>
                    <h3
                      style={{
                        margin: '0 0 10px 0',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      🗺️ Nearby Loads (150 Mile Radius)
                    </h3>

                    {/* Location Status */}
                    <div style={{ marginBottom: '15px' }}>
                      {locationPermission === 'granted' && driverLocation ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ color: '#22c55e', fontSize: '16px' }}>
                            ✓
                          </span>
                          <span style={{ color: 'white', fontSize: '14px' }}>
                            Location:{' '}
                            {driverLocation.city || 'Current Position'}(
                            {Math.round(driverLocation.accuracy)}m accuracy)
                          </span>
                          <span style={{ color: '#60a5fa', fontSize: '12px' }}>
                            {nearbyLoads.length} loads within 150 miles
                          </span>
                        </div>
                      ) : locationPermission === 'pending' ||
                        isLoadingLocation ? (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ color: '#fbbf24', fontSize: '16px' }}>
                            ⏳
                          </span>
                          <span style={{ color: 'white', fontSize: '14px' }}>
                            Getting your location...
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <span style={{ color: '#ef4444', fontSize: '16px' }}>
                            ⚠
                          </span>
                          <span style={{ color: 'white', fontSize: '14px' }}>
                            Location access required to show nearby loads
                          </span>
                          <button
                            onClick={requestLocationPermission}
                            style={{
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                            }}
                          >
                            Enable Location
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nearby Loads List */}
                  {nearbyLoads.length > 0 ? (
                    <div>
                      {nearbyLoads.map((load) => {
                        const hasInterest = loadInterests.some(
                          (interest) =>
                            interest.loadId === load.id &&
                            interest.status === 'pending'
                        );

                        return (
                          <div
                            key={load.id}
                            style={{
                              background:
                                load.priority === 'URGENT'
                                  ? 'rgba(239, 68, 68, 0.1)'
                                  : 'rgba(59, 130, 246, 0.1)',
                              border: `2px solid ${
                                load.priority === 'URGENT'
                                  ? 'rgba(239, 68, 68, 0.3)'
                                  : 'rgba(59, 130, 246, 0.3)'
                              }`,
                              borderRadius: '12px',
                              padding: '20px',
                              marginBottom: '15px',
                              position: 'relative',
                            }}
                          >
                            {/* Priority Badge */}
                            {load.priority === 'URGENT' && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '10px',
                                  right: '15px',
                                  background: '#ef4444',
                                  color: 'white',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                }}
                              >
                                URGENT
                              </div>
                            )}

                            {/* Load Header */}
                            <div style={{ marginBottom: '15px' }}>
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '15px',
                                  marginBottom: '8px',
                                }}
                              >
                                <h4
                                  style={{
                                    margin: '0',
                                    fontSize: '18px',
                                    fontWeight: '700',
                                    color: 'white',
                                  }}
                                >
                                  {load.id}
                                </h4>
                                <span
                                  style={{
                                    background:
                                      load.priority === 'HIGH'
                                        ? '#f59e0b'
                                        : '#6b7280',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.priority}
                                </span>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '20px',
                                  marginBottom: '10px',
                                }}
                              >
                                <div
                                  style={{
                                    color: '#22c55e',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {load.pay}
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    opacity: 0.8,
                                  }}
                                >
                                  {load.rate} • {load.miles}
                                </div>
                                <div
                                  style={{
                                    color: '#fbbf24',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {Math.round(load.distanceFromDriver)} mi away
                                </div>
                                <div
                                  style={{ color: '#60a5fa', fontSize: '14px' }}
                                >
                                  ETA: {load.estimatedPickupTime}
                                </div>
                              </div>
                            </div>

                            {/* Route Information */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto 1fr',
                                gap: '15px',
                                marginBottom: '15px',
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    color: '#22c55e',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '4px',
                                  }}
                                >
                                  📍 Pickup
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.origin.city}, {load.origin.state}
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.8,
                                  }}
                                >
                                  {load.pickupDate}
                                </div>
                              </div>

                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <div
                                  style={{ color: '#60a5fa', fontSize: '20px' }}
                                >
                                  →
                                </div>
                              </div>

                              <div>
                                <div
                                  style={{
                                    color: '#ef4444',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    marginBottom: '4px',
                                  }}
                                >
                                  🏁 Delivery
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.destination.city},{' '}
                                  {load.destination.state}
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.8,
                                  }}
                                >
                                  {load.deliveryDate || 'TBD'}
                                </div>
                              </div>
                            </div>

                            {/* Load Details */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns:
                                  'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '15px',
                                marginBottom: '15px',
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                              }}
                            >
                              <div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.7,
                                  }}
                                >
                                  Commodity
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.commodity}
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.7,
                                  }}
                                >
                                  Equipment
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.equipment}
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.7,
                                  }}
                                >
                                  Weight
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.weight}
                                </div>
                              </div>
                              <div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '12px',
                                    opacity: 0.7,
                                  }}
                                >
                                  Dispatcher
                                </div>
                                <div
                                  style={{
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                  }}
                                >
                                  {load.dispatcherName}
                                </div>
                              </div>
                            </div>

                            {/* Express Interest Actions */}
                            <div
                              style={{
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center',
                              }}
                            >
                              {hasInterest ? (
                                <>
                                  <button
                                    style={{
                                      background: '#6b7280',
                                      color: 'white',
                                      border: 'none',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      cursor: 'not-allowed',
                                      opacity: 0.7,
                                    }}
                                    disabled
                                  >
                                    ✓ Interest Submitted
                                  </button>
                                  <button
                                    onClick={() => {
                                      const interest = loadInterests.find(
                                        (i) => i.loadId === load.id
                                      );
                                      if (interest)
                                        withdrawInterest(interest.id);
                                    }}
                                    style={{
                                      background: 'transparent',
                                      color: '#ef4444',
                                      border: '1px solid #ef4444',
                                      padding: '8px 16px',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Withdraw Interest
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => expressInterest(load.id)}
                                  style={{
                                    background: '#22c55e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.3s ease',
                                  }}
                                  onMouseOver={(e) => {
                                    e.currentTarget.style.background =
                                      '#16a34a';
                                    e.currentTarget.style.transform =
                                      'translateY(-2px)';
                                  }}
                                  onMouseOut={(e) => {
                                    e.currentTarget.style.background =
                                      '#22c55e';
                                    e.currentTarget.style.transform =
                                      'translateY(0)';
                                  }}
                                >
                                  ✋ Express Interest
                                </button>
                              )}

                              <div
                                style={{
                                  color: 'white',
                                  fontSize: '12px',
                                  opacity: 0.7,
                                  marginLeft: 'auto',
                                }}
                              >
                                Posted:{' '}
                                {new Date(load.postedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : driverLocation ? (
                    <div
                      style={{
                        textAlign: 'center',
                        color: 'white',
                        opacity: 0.7,
                        fontSize: '16px',
                        padding: '40px',
                      }}
                    >
                      No loads found within 150 miles of your current location.
                    </div>
                  ) : null}
                </div>

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

                      <button
                        style={{
                          width: '100%',
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
                  ))}
                </div>
              </div>
            )}

            {/* Go With the Flow Tab */}
            {selectedTab === 'go-with-the-flow' && (
              <div>
                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'white',
                    marginBottom: '20px',
                  }}
                >
                  ⚡ Go With the Flow - Real-Time Load Matching
                </h3>

                {/* Driver Status Panel */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    color: 'white',
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
                    <h4 style={{ fontSize: '20px', margin: 0 }}>
                      Driver Status Dashboard
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      {(['online', 'offline', 'on-load'] as const).map(
                        (status) => (
                          <button
                            key={status}
                            onClick={() => setDriverStatus(status)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '8px',
                              border: 'none',
                              background:
                                driverStatus === status
                                  ? 'rgba(255, 255, 255, 0.9)'
                                  : 'rgba(255, 255, 255, 0.2)',
                              color:
                                driverStatus === status ? '#059669' : 'white',
                              fontWeight: '600',
                              cursor: 'pointer',
                              textTransform: 'capitalize',
                            }}
                          >
                            {status.replace('-', ' ')}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '16px', opacity: 0.9 }}>
                    Current Status:{' '}
                    <strong>
                      {driverStatus.replace('-', ' ').toUpperCase()}
                    </strong>
                    {driverStatus === 'online' && ' - Ready for new loads'}
                    {driverStatus === 'on-load' &&
                      ' - Currently on active load'}
                    {driverStatus === 'offline' && ' - Not available for loads'}
                  </div>
                </div>

                {/* Instant Loads Section */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    borderRadius: '16px',
                    padding: '24px',
                    marginBottom: '24px',
                    color: 'white',
                  }}
                >
                  <h4
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(59, 130, 246, 0.8)',
                      marginBottom: '16px',
                    }}
                  >
                    ⚡ Instant Loads Available
                  </h4>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {instantLoads.length > 0 ? (
                      instantLoads.map((load, index) => (
                        <div
                          key={index}
                          style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          }}
                        >
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: '1fr 1fr 1fr 120px 120px',
                              gap: '16px',
                              alignItems: 'center',
                              marginBottom: '12px',
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {load.origin} → {load.destination}
                              </div>
                              <div
                                style={{ fontSize: '0.85rem', opacity: 0.8 }}
                              >
                                {load.miles} miles
                              </div>
                            </div>
                            <div>
                              <div style={{ fontWeight: '600' }}>
                                {load.commodity}
                              </div>
                              <div
                                style={{ fontSize: '0.85rem', opacity: 0.8 }}
                              >
                                {load.equipment || 'Dry Van'}
                              </div>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: '700',
                                  color: '#22c55e',
                                }}
                              >
                                {load.pay}
                              </div>
                              <div
                                style={{ fontSize: '0.85rem', opacity: 0.8 }}
                              >
                                {load.rate}/mile
                              </div>
                            </div>
                            <button
                              style={{
                                background: '#22c55e',
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                              }}
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    '/api/go-with-the-flow',
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        action: 'accept-load',
                                        driverId: 'driver-1',
                                        loadId: load.id,
                                      }),
                                    }
                                  );
                                  const result = await response.json();

                                  if (result.success) {
                                    alert(
                                      `✅ Load ${load.id} accepted successfully!`
                                    );
                                    // Remove from instant loads
                                    setInstantLoads((prev) =>
                                      prev.filter((l) => l.id !== load.id)
                                    );
                                  } else {
                                    alert(
                                      `❌ Failed to accept load: ${result.error}`
                                    );
                                  }
                                } catch (error) {
                                  alert(`❌ Error accepting load: ${error}`);
                                }
                              }}
                            >
                              Accept
                            </button>
                            <button
                              style={{
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                marginLeft: '8px',
                              }}
                              onClick={async () => {
                                try {
                                  const response = await fetch(
                                    '/api/go-with-the-flow',
                                    {
                                      method: 'POST',
                                      headers: {
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        action: 'decline-load',
                                        driverId: 'driver-1',
                                        loadId: load.id,
                                      }),
                                    }
                                  );
                                  const result = await response.json();

                                  if (result.success) {
                                    alert(`Load ${load.id} declined`);
                                    // Remove from instant loads
                                    setInstantLoads((prev) =>
                                      prev.filter((l) => l.id !== load.id)
                                    );
                                  } else {
                                    alert(
                                      `Failed to decline load: ${result.error}`
                                    );
                                  }
                                } catch (error) {
                                  alert(`Error declining load: ${error}`);
                                }
                              }}
                            >
                              Decline
                            </button>
                          </div>
                          <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                            Pickup: {load.pickupDate} | Priority:{' '}
                            {load.priority || 'NORMAL'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '40px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '12px',
                          border: '2px dashed rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                          🔍
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: '600',
                            marginBottom: '8px',
                          }}
                        >
                          No instant loads available right now
                        </div>
                        <div style={{ fontSize: '14px', opacity: 0.8 }}>
                          We're actively matching loads to your preferences and
                          location...
                        </div>
                        <div
                          style={{
                            fontSize: '12px',
                            marginTop: '8px',
                            opacity: 0.6,
                          }}
                        >
                          Loads update every 5 seconds
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real-Time Matching Engine Status */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <h4 style={{ color: 'white', marginBottom: '16px' }}>
                    🎯 Real-Time Matching Engine
                  </h4>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '16px',
                    }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#3b82f6',
                        }}
                      >
                        {instantLoads.length}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Available Loads
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#10b981',
                        }}
                      >
                        {driverStatus === 'online' ? 'ACTIVE' : 'PAUSED'}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Matching Status
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#f59e0b',
                        }}
                      >
                        5s
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'rgba(255, 255, 255, 0.7)',
                        }}
                      >
                        Update Interval
                      </div>
                    </div>
                  </div>
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
                          Demo Department
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
                          DEMO-VEHICLE
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
    </>
  );
}

// 🚨 LOAD ALERT ROW COMPONENT - Linear Grid Loadboard Style
const LoadAlertRow: React.FC<{
  alert: LoadAlert;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}> = ({ alert, onAccept, onDecline }) => {
  const [timeRemaining, setTimeRemaining] = useState(alert.timeToExpire);

  useEffect(() => {
    setTimeRemaining(alert.timeToExpire);
  }, [alert.timeToExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeRemaining <= 60) return '#ef4444'; // Red - Critical
    if (timeRemaining <= 300) return '#f59e0b'; // Yellow - Warning
    return '#22c55e'; // Green - Safe
  };

  const getRowBackground = () => {
    const baseColor =
      alert.priority === 'high'
        ? 'rgba(239, 68, 68, 0.2)'
        : alert.priority === 'medium'
          ? 'rgba(245, 158, 11, 0.2)'
          : 'rgba(59, 130, 246, 0.2)';

    return `linear-gradient(135deg, ${baseColor}, rgba(255, 255, 255, 0.1))`;
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
      className={`alert-${alert.visualAlert}`}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Time Left Column */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: getTimeColor(),
          fontSize: '16px',
        }}
      >
        {formatTime(timeRemaining)}
      </div>

      {/* Origin Column */}
      <div style={{ fontWeight: '600' }}>
        <div>{alert.load.origin}</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          {alert.load.equipment} • {alert.load.weight}
        </div>
      </div>

      {/* Destination Column */}
      <div style={{ fontWeight: '600' }}>
        <div>{alert.load.destination}</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          {alert.load.commodity}
        </div>
      </div>

      {/* Rate Column */}
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#22c55e',
          fontSize: '16px',
        }}
      >
        {alert.load.pay}
        <div style={{ fontSize: '12px', opacity: 0.8, color: 'white' }}>
          {alert.load.rate}/mi
        </div>
      </div>

      {/* Details Column */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontWeight: '600' }}>{alert.load.miles}</div>
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          {alert.load.pickupDate}
        </div>
      </div>

      {/* Dispatcher Column */}
      <div style={{ fontSize: '12px' }}>
        <div style={{ fontWeight: '600' }}>{alert.dispatcherName}</div>
        <div style={{ opacity: 0.8 }}>{alert.alertType.replace('_', ' ')}</div>
      </div>

      {/* Action Column */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <button
          onClick={() => onAccept(alert.id)}
          style={{
            background: '#22c55e',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#16a34a';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#22c55e';
          }}
        >
          ✅ Accept
        </button>
        <button
          onClick={() => onDecline(alert.id)}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
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
          height: '3px',
          background: 'rgba(255, 255, 255, 0.2)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${((alert.originalDuration - timeRemaining) / alert.originalDuration) * 100}%`,
            background: getTimeColor(),
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
};
