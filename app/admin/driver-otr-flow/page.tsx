'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import GlobalNotificationBell from '../../components/GlobalNotificationBell';
import {
  FinancialMarketsService,
  FuelPriceData,
} from '../../services/FinancialMarketsService';
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

  // Enhanced user data for comprehensive header
  const currentUser: EnhancedDriverUser = {
    id: 'JR-OO-2025002',
    name: demoDriver.personalInfo?.name || 'John Rodriguez',
    email: demoDriver.personalInfo?.email || 'john.rodriguez@fleetflow.com',
    phone: demoDriver.personalInfo?.phone || '(555) 234-5678',
    role: {
      type: 'owner_operator',
      permissions: ['my_loads_workflow', 'load_board_access'],
    },
    tenantId: 'tenant_fleetflow_transport',
    tenantName: 'FleetFlow Transport LLC',
    companyInfo: {
      mcNumber: 'MC-789456',
      dotNumber: 'DOT-2345678',
      safetyRating: 'Satisfactory',
      insuranceProvider: 'Commercial Transport Insurance',
      operatingStatus: 'Active',
    },
    dispatcher: {
      name: 'Sarah Martinez',
      phone: '+1 (555) 987-6543',
      email: 'dispatch@fleetflow.com',
      department: 'Dispatch Central',
      availability: 'Available 24/7',
      responsiveness: 'Avg Response: 8 mins',
    },
    photos: {
      vehicleEquipment:
        'https://images.unsplash.com/photo-1558618047-f0c1b401b0cf?w=150&h=150&fit=crop&auto=format',
      userPhotoOrLogo:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format',
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
        console.log('Audio notification blocked');
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
    console.log('Load accepted:', alert.load);
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

    console.log('Load alert declined:', alert.load.id);
  };

  const generateDemoAlert = () => {
    const demoLoads = [
      {
        id: 'L2025-004',
        origin: 'Dallas, TX',
        destination: 'Houston, TX',
        commodity: 'Electronics',
        pay: '$1,850',
        miles: '239 mi',
        rate: '$7.74',
        pickupDate: 'Today',
        priority: 'URGENT' as const,
        equipment: 'Dry Van',
        weight: '34,000 lbs',
        distance: '239 mi',
      },
      {
        id: 'L2025-005',
        origin: 'Fort Worth, TX',
        destination: 'Austin, TX',
        commodity: 'General Freight',
        pay: '$1,200',
        miles: '195 mi',
        rate: '$6.15',
        pickupDate: 'Tomorrow',
        priority: 'HIGH' as const,
        equipment: 'Flatbed',
        weight: '28,500 lbs',
        distance: '195 mi',
      },
    ];

    const randomLoad = demoLoads[Math.floor(Math.random() * demoLoads.length)];
    const alertDuration = randomLoad.priority === 'URGENT' ? 900 : 1800; // 15 or 30 minutes

    const newAlert: LoadAlert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      load: randomLoad,
      alertType: 'new_load',
      timeToExpire: alertDuration,
      originalDuration: alertDuration,
      priority: randomLoad.priority === 'URGENT' ? 'high' : 'medium',
      dispatcherName: currentUser.dispatcher.name,
      dispatcherId: 'dispatch-001',
      createdAt: new Date(),
      status: 'active',
      soundAlert: true,
      vibrationAlert: true,
      visualAlert: randomLoad.priority === 'URGENT' ? 'flash' : 'pulse',
      message: `New ${randomLoad.priority.toLowerCase()} priority load available`,
    };

    setLoadAlerts((prev) => [...prev, newAlert]);
    setAlertQueue((prev) => ({
      ...prev,
      totalAlertsToday: prev.totalAlertsToday + 1,
      acceptanceRate:
        prev.totalAlertsToday > 0
          ? Math.round(
              (prev.acceptedAlertsToday / (prev.totalAlertsToday + 1)) * 100
            )
          : 0,
    }));

    // Play sound and vibration
    playAlertSound();
    triggerVibration();
  };

  // 🗺️ GPS LOCATION TRACKING & NEARBY LOADS FUNCTIONS
  const requestLocationPermission = async () => {
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
  };

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
        console.log('Location tracking error:', error.message);
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
    console.log('Interest submitted:', {
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
  React.useEffect(() => {
    if (locationPermission === 'pending') {
      requestLocationPermission();
    }
  }, []);

  // 📊 COMPREHENSIVE BUSINESS METRICS
  const businessMetrics = {
    // Settlement & Payment Tracking
    settlement: {
      pendingPayments: '$8,450',
      lastSettlement: '$12,130',
      settlementDate: 'Jan 15, 2025',
      nextSettlement: 'Jan 22, 2025',
      completedLoads: 47,
      pendingLoads: 3,
      disputedAmount: '$0',
      paymentMethod: 'Direct Deposit',
      averageSettlementTime: '5 days',
    },
    // Detailed Tax Management
    tax: {
      alerts: 1,
      quarterlyDue: 'Q1 2025 - Due Mar 15',
      ytdDeductions: '$18,750',
      estimatedTax: '$6,240',
      mileageDeduction: '$14,040',
      fuelTaxCredits: '$2,450',
      lastFilingDate: 'Dec 15, 2024',
      nextQuarterlyEstimate: '$1,560',
      deductionCategories: {
        fuel: '$8,200',
        maintenance: '$3,400',
        insurance: '$4,200',
        permits: '$1,450',
        other: '$1,500',
      },
    },
    // Pay Period Breakdown
    payPeriod: {
      current: {
        grossPay: '$12,850',
        fuelSurcharge: '$1,240',
        bonuses: '$450',
        detention: '$280',
        deductions: {
          fuel: '$3,200',
          insurance: '$850',
          equipment: '$420',
          permits: '$120',
          other: '$180',
          total: '$4,770',
        },
        netPay: '$9,850',
        period: 'Jan 1-15, 2025',
      },
      lastPeriod: {
        grossPay: '$11,240',
        netPay: '$8,650',
        period: 'Dec 16-31, 2024',
      },
    },
    // Extended Performance Metrics
    performance: {
      safetyScore: 94,
      efficiencyRate: 96,
      onTimeDelivery: 98,
      fuelEfficiency: '7.2 MPG',
      monthlyMiles: '2,340',
      avgMilesPerLoad: '450',
      hoursOfService: '68/70',
      availableHours: '2 hrs',
      inspectionsDue: 'Next: Feb 1',
      CSAScore: 'Satisfactory',
      violations: 0,
      avgDeliveryTime: '2.3 days',
    },
    // Revenue Tracking
    revenue: {
      ytd: '$127,450',
      monthly: '$12,850',
      weekly: '$3,240',
      daily: '$485',
      avgPerLoad: '$2,130',
      topMonth: 'August ($18,950)',
      bestWeek: 'Week 32 ($4,650)',
      revenueGoal: '$150,000',
      progressToGoal: '85%',
    },
  };

  // Performance Metrics (Legacy - keeping for compatibility)
  const performanceMetrics = {
    activeLoads: 1,
    safetyScore: businessMetrics.performance.safetyScore,
    revenueYTD: businessMetrics.revenue.ytd,
    efficiencyRate: businessMetrics.performance.efficiencyRate,
    monthlyMiles: businessMetrics.performance.monthlyMiles,
    taxAlerts: businessMetrics.tax.alerts,
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
    // Traditional Loads (Express Interest)
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
      loadType: 'traditional',
      dispatcherName: 'Sarah Johnson',
      dispatcherId: 'DISP-001',
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
      loadType: 'traditional',
      dispatcherName: 'Mike Davis',
      dispatcherId: 'DISP-002',
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
      loadType: 'traditional',
      dispatcherName: 'Lisa Chen',
      dispatcherId: 'DISP-003',
    },
    // AI-Generated Loads (Quick Bid)
    {
      id: 'AI-MKT-001',
      origin: 'Dallas, TX',
      destination: 'Atlanta, GA',
      commodity: 'Electronics',
      pay: '$3,200',
      miles: '831 mi',
      rate: '$3.85',
      pickupDate: 'Tomorrow 6:00 AM',
      priority: 'HIGH',
      loadType: 'ai_generated',
      aiSource: 'market_demand',
      bidDeadline: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
      minimumBid: 2800,
      suggestedBidRange: [2900, 3100],
      competitorCount: 3,
      aiRecommendation: {
        suggestedBid: 2950,
        winProbability: 78,
        profitabilityScore: 65,
        riskAssessment: 'low',
      },
    },
    {
      id: 'AI-RFX-002',
      origin: 'Houston, TX',
      destination: 'Phoenix, AZ',
      commodity: 'Auto Parts',
      pay: '$2,750',
      miles: '880 mi',
      rate: '$3.12',
      pickupDate: 'Today 4:00 PM',
      priority: 'URGENT',
      loadType: 'ai_generated',
      aiSource: 'freightflow_rfx',
      bidDeadline: new Date(Date.now() + 16 * 60 * 60 * 1000), // 16 hours from now
      minimumBid: 2400,
      suggestedBidRange: [2500, 2700],
      competitorCount: 5,
      dedicatedLane: {
        laneName: 'Houston-Phoenix Automotive',
        frequency: 'weekly',
        contractLength: '6 months',
      },
      aiRecommendation: {
        suggestedBid: 2580,
        winProbability: 62,
        profitabilityScore: 58,
        riskAssessment: 'medium',
      },
    },
    {
      id: 'AI-OPT-003',
      origin: 'San Antonio, TX',
      destination: 'Denver, CO',
      commodity: 'Manufacturing Parts',
      pay: '$2,950',
      miles: '650 mi',
      rate: '$4.54',
      pickupDate: 'Tomorrow 2:00 PM',
      priority: 'HIGH',
      loadType: 'ai_generated',
      aiSource: 'route_optimization',
      bidDeadline: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
      minimumBid: 2600,
      suggestedBidRange: [2700, 2900],
      competitorCount: 2,
      aiRecommendation: {
        suggestedBid: 2800,
        winProbability: 85,
        profitabilityScore: 72,
        riskAssessment: 'low',
      },
    },
  ];

  // Active Loads (Only confirmed/accepted loads)
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
    // L2025-002 (Fort Worth → San Antonio) removed - waiting for confirmation
    // Only confirmed loads should appear in active loads
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

  // Demo: Generate alert every 30 seconds for testing
  useEffect(() => {
    const demoTimer = setInterval(() => {
      if (loadAlerts.length < 3) {
        // Limit to 3 concurrent alerts
        generateDemoAlert();
      }
    }, 30000);

    // Generate first demo alert after 5 seconds
    const initialAlert = setTimeout(() => {
      generateDemoAlert();
    }, 5000);

    return () => {
      clearInterval(demoTimer);
      clearTimeout(initialAlert);
    };
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

  const workflowTasks = workflowManager.getActiveWorkflowTasks(
    demoDriver?.driverId || 'driver-001'
  );

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
                      ></div>
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
                {
                  key: 'business-metrics',
                  label: '📈 Business Metrics',
                  icon: '📈',
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
                          ${fuelPrice?.currentPrice?.toFixed(2) || '3.45'}
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
