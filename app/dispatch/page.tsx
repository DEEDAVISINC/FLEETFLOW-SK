'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EnhancedLoadBoard from '../components/EnhancedLoadBoard';
import InvoiceCreationModal from '../components/InvoiceCreationModal';
import StickyNote from '../components/StickyNote-Enhanced';
import UnifiedLiveTrackingWorkflow from '../components/UnifiedLiveTrackingWorkflow';
import { getCurrentUser } from '../config/access';
import {
  ensureUniqueKey,
  getAllInvoices,
  getInvoiceStats,
} from '../services/invoiceService';
import {
  Load,
  getDispatcherLoads,
  getLoadStats,
} from '../services/loadService';

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

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  type: 'load_assignment' | 'dispatch_update' | 'system_alert';
  read: boolean;
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
  avgResponseTime: '3 min',
};

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    message: 'New load FL-001 requires immediate assignment',
    timestamp: '2 minutes ago',
    type: 'load_assignment',
    read: false,
  },
  {
    id: '2',
    message: 'Driver John Smith confirmed load TX-002',
    timestamp: '15 minutes ago',
    type: 'dispatch_update',
    read: false,
  },
  {
    id: '3',
    message: 'System maintenance scheduled for tonight',
    timestamp: '1 hour ago',
    type: 'system_alert',
    read: true,
  },
];

export default function DispatchCentral() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    broadcasted: 0,
    driverSelected: 0,
    orderSent: 0,
    inTransit: 0,
    delivered: 0,
    unassigned: 0,
  });
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [user, setUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [loadStatusFilter, setLoadStatusFilter] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedLoadForInvoice, setSelectedLoadForInvoice] =
    useState<Load | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceStats, setInvoiceStats] = useState({
    counts: { total: 0, pending: 0, sent: 0, paid: 0, overdue: 0 },
    amounts: { total: 0, pending: 0, paid: 0 },
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Get loads assigned to this dispatcher from broker board
      const dispatcherLoads = getDispatcherLoads(currentUser.user.id);
      setLoads(dispatcherLoads);

      const loadStats = getLoadStats();
      setStats(loadStats);

      // Load invoices
      const allInvoices = getAllInvoices();
      setInvoices(allInvoices);

      const stats = getInvoiceStats();
      setInvoiceStats(stats);
    }
  }, []);

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
  };

  const handleCreateInvoice = (load: Load) => {
    setSelectedLoadForInvoice(load);
    setShowInvoiceModal(true);
  };

  const handleInvoiceCreated = (invoiceId: string) => {
    // Update load status or add notification
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `Invoice ${invoiceId} created successfully for load ${selectedLoadForInvoice?.id}`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);

    setShowInvoiceModal(false);
    setSelectedLoadForInvoice(null);

    // Refresh invoices
    const allInvoices = getAllInvoices();
    setInvoices(allInvoices);

    const stats = getInvoiceStats();
    setInvoiceStats(stats);
  };

  const filteredLoads = loads.filter((load) => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      load.id.toLowerCase().includes(searchLower) ||
      load.origin.toLowerCase().includes(searchLower) ||
      load.destination.toLowerCase().includes(searchLower) ||
      load.status.toLowerCase().includes(searchLower) ||
      (load.dispatcherName &&
        load.dispatcherName.toLowerCase().includes(searchLower))
    );
  });

  const sampleLoads = [
    {
      id: 'L-001',
      loadBoardNumber: '100001',
      loadIdentifier: 'MJ-25015-LAXPHX-SMP-DVF-001',
      bolNumber: 'BOL-MJ25015-001',
      origin: 'Los Angeles, CA',
      destination: 'Phoenix, AZ',
      broker: 'Mike Johnson',
      rate: 2800,
      status: 'Delivered',
      distance: '372',
      type: 'Dry Van',
      equipment: 'Dry Van 53ft',
      weight: '40,000 lbs',
      dispatcher: 'Mike Johnson',
      pickupDate: '2024-01-15',
      deliveryDate: '2024-01-16',
      serviceLevel: 'Express',
      priorityLevel: 'High',
      loadDescription: {
        commodity: 'Electronics',
        description: 'Consumer electronics - laptops, phones, tablets',
        pieces: 240,
        palletCount: 12,
        packagingType: 'Cartons on pallets',
        poNumber: 'PO-2024-0115',
        specialHandling: 'Handle with care - fragile items',
        weight: '40,000 lbs',
        dimensions: '53ft trailer',
      },
      billingDetails: {
        baseRate: 2800,
        lumperFee: {
          pickup: 125,
          delivery: 150,
        },
        fuelSurcharge: {
          percentage: 10,
          amount: 280,
        },
        detention: 0,
        layover: 0,
        liftgateFee: 75,
        accessorials: [
          { type: 'Liftgate', amount: 75 },
          { type: 'Inside Delivery', amount: 100 },
        ],
        customCharges: [{ name: 'Inside Delivery', amount: 100 }],
        totalAccessorials: 175,
        totalAmount: 3530, // 2800 + 125 + 150 + 280 + 175
        totalRate: 3530,
      },
      customerInfo: {
        name: 'Tech Solutions Inc.',
        address: '123 Business Blvd\nLos Angeles, CA 90210',
        phone: '(555) 123-4567',
        email: 'shipping@techsolutions.com',
        contactPerson: 'Sarah Johnson',
      },
      equipmentDetail: {
        type: 'Dry Van',
        length: '53ft',
        weight: '80,000 lbs GVWR',
        hazmat: false,
        temperature: false,
      },
    },
    {
      id: 'L-002',
      loadBoardNumber: '200002',
      loadIdentifier: 'AJ-25016-CHINYC-BIG-FBL-002',
      origin: 'Chicago, IL',
      destination: 'New York, NY',
      broker: 'Alex Johnson',
      rate: 1800,
      status: 'Assigned',
      distance: '780',
      type: 'Flatbed',
      equipment: 'Flatbed 48ft',
      weight: '35,000 lbs',
      dispatcher: 'Sarah Wilson',
      pickupDate: '2024-01-16',
      deliveryDate: '2024-01-18',
      serviceLevel: 'Standard',
      priorityLevel: 'Medium',
      loadDescription: {
        commodity: 'Steel Coils',
        description: 'Hot rolled steel coils for construction',
        pieces: 8,
        palletCount: 0,
        packagingType: 'Banded coils',
        poNumber: 'PO-2024-0116',
        specialHandling: 'Requires tarps and chains',
        weight: '35,000 lbs',
        dimensions: '48ft flatbed',
      },
      billingDetails: {
        baseRate: 1800,
        lumperFee: {
          pickup: 0,
          delivery: 200,
        },
        fuelSurcharge: {
          percentage: 10,
          amount: 180,
        },
        detention: 100,
        layover: 0,
        accessorials: [
          { type: 'Tarps', amount: 150 },
          { type: 'Chains', amount: 75 },
        ],
        customCharges: [
          { name: 'Tarps', amount: 150 },
          { name: 'Chains', amount: 75 },
        ],
        totalAccessorials: 225,
        totalAmount: 2505, // 1800 + 0 + 200 + 180 + 100 + 225
        totalRate: 2505,
      },
      customerInfo: {
        name: 'Industrial Steel Corp',
        address: '456 Manufacturing St\nChicago, IL 60601',
        phone: '(555) 234-5678',
        email: 'logistics@industrialsteel.com',
        contactPerson: 'Mike Rodriguez',
      },
      equipmentDetail: {
        type: 'Flatbed',
        length: '48ft',
        weight: '80,000 lbs GVWR',
        hazmat: false,
        temperature: false,
      },
    },
    {
      id: 'L-003',
      loadBoardNumber: '300003',
      loadIdentifier: 'BJ-25017-HOUDAL-COO-REF-003',
      origin: 'Houston, TX',
      destination: 'Dallas, TX',
      broker: 'Bob Johnson',
      rate: 3200,
      status: 'In Transit',
      distance: '200',
      type: 'Refrigerated',
      equipment: 'Reefer 53ft',
      weight: '42,000 lbs',
      dispatcher: 'Emily Davis',
      pickupDate: '2024-01-17',
      deliveryDate: '2024-01-17',
      serviceLevel: 'Temperature Controlled',
      priorityLevel: 'High',
      loadDescription: {
        commodity: 'Frozen Foods',
        description: 'Frozen vegetables and prepared meals',
        pieces: 320,
        palletCount: 16,
        packagingType: 'Frozen cartons',
        poNumber: 'PO-2024-0117',
        specialHandling: 'Maintain -10°F throughout transport',
        weight: '42,000 lbs',
        dimensions: '53ft reefer',
      },
      billingDetails: {
        baseRate: 3200,
        lumperFee: {
          pickup: 175,
          delivery: 200,
        },
        fuelSurcharge: {
          percentage: 10,
          amount: 320,
        },
        detention: 0,
        layover: 0,
        accessorials: [
          { type: 'Temperature Monitoring', amount: 100 },
          { type: 'Fuel Reefer', amount: 250 },
        ],
        customCharges: [
          { name: 'Temperature Monitoring', amount: 100 },
          { name: 'Fuel Reefer', amount: 250 },
        ],
        totalAccessorials: 350,
        totalAmount: 4245, // 3200 + 175 + 200 + 320 + 350
        totalRate: 4245,
      },
      customerInfo: {
        name: 'Fresh Foods Distribution',
        address: '789 Cold Storage Way\nHouston, TX 77001',
        phone: '(555) 345-6789',
        email: 'dispatch@freshfoods.com',
        contactPerson: 'Lisa Chen',
      },
      equipmentDetail: {
        type: 'Refrigerated',
        length: '53ft',
        weight: '80,000 lbs GVWR',
        hazmat: false,
        temperature: true,
      },
    },
    {
      id: 'L-004',
      loadBoardNumber: '400004',
      loadIdentifier: 'MJ-25018-MIAORL-FAS-DVF-004',
      bolNumber: 'BOL-MJ25018-004',
      origin: 'Miami, FL',
      destination: 'Orlando, FL',
      broker: 'Mike Johnson',
      rate: 2200,
      status: 'Delivered',
      distance: '120',
      type: 'Dry Van',
      equipment: 'Dry Van 53ft',
      weight: '38,000 lbs',
      dispatcher: 'Sarah Wilson',
      pickupDate: '2024-01-18',
      deliveryDate: '2024-01-18',
      serviceLevel: 'Same Day',
      priorityLevel: 'Urgent',
      loadDescription: {
        commodity: 'Medical Supplies',
        description: 'Hospital medical equipment and supplies',
        pieces: 180,
        palletCount: 9,
        packagingType: 'Medical grade packaging',
        poNumber: 'PO-2024-0118',
        specialHandling: 'Clean transport - medical grade',
        weight: '38,000 lbs',
        dimensions: '53ft dry van',
      },
      billingDetails: {
        baseRate: 2200,
        lumperFee: {
          pickup: 100,
          delivery: 125,
        },
        fuelSurcharge: {
          percentage: 10,
          amount: 220,
        },
        detention: 50,
        layover: 0,
        accessorials: [
          { type: 'Express Service', amount: 300 },
          { type: 'Clean Trailer', amount: 150 },
        ],
        customCharges: [
          { name: 'Express Service', amount: 300 },
          { name: 'Clean Trailer', amount: 150 },
        ],
        totalAccessorials: 450,
        totalAmount: 3145, // 2200 + 100 + 125 + 220 + 50 + 450
        totalRate: 3145,
      },
      customerInfo: {
        name: 'Miami Medical Center',
        address: '321 Hospital Drive\nMiami, FL 33101',
        phone: '(555) 456-7890',
        email: 'procurement@miamimedical.com',
        contactPerson: 'Dr. James Wilson',
      },
      equipmentDetail: {
        type: 'Dry Van',
        length: '53ft',
        weight: '80,000 lbs GVWR',
        hazmat: false,
        temperature: false,
      },
    },
    {
      id: 'L-005',
      loadBoardNumber: '500005',
      loadIdentifier: 'AJ-25019-SEAPOR-HEA-FBL-005',
      origin: 'Seattle, WA',
      destination: 'Portland, OR',
      broker: 'Alex Johnson',
      rate: 2000,
      status: 'Available',
      distance: '400',
      type: 'Flatbed',
      equipment: 'Flatbed 48ft',
      weight: '45,000 lbs',
      dispatcher: 'Emily Davis',
      pickupDate: '2024-01-19',
      deliveryDate: '2024-01-20',
      serviceLevel: 'Standard',
      priorityLevel: 'Medium',
      loadDescription: {
        commodity: 'Lumber',
        description: 'Construction grade lumber and building materials',
        pieces: 120,
        palletCount: 0,
        packagingType: 'Banded lumber stacks',
        poNumber: 'PO-2024-0119',
        specialHandling: 'Requires tarps for weather protection',
        weight: '45,000 lbs',
        dimensions: '48ft flatbed',
      },
      billingDetails: {
        baseRate: 2000,
        lumperFee: {
          pickup: 75,
          delivery: 100,
        },
        fuelSurcharge: {
          percentage: 10,
          amount: 200,
        },
        detention: 0,
        layover: 0,
        accessorials: [
          { type: 'Tarps', amount: 125 },
          { type: 'Straps', amount: 50 },
        ],
        customCharges: [
          { name: 'Tarps', amount: 125 },
          { name: 'Straps', amount: 50 },
        ],
        totalAccessorials: 175,
        totalAmount: 2550, // 2000 + 75 + 100 + 200 + 175
        totalRate: 2550,
      },
      customerInfo: {
        name: 'Pacific Lumber Co.',
        address: '654 Timber Lane\nSeattle, WA 98101',
        phone: '(555) 567-8901',
        email: 'shipping@pacificlumber.com',
        contactPerson: 'Robert Kim',
      },
      equipmentDetail: {
        type: 'Flatbed',
        length: '48ft',
        weight: '80,000 lbs GVWR',
        hazmat: false,
        temperature: false,
      },
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a, #1e40af)',
        padding: '25px',
        paddingTop: '100px',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '15px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          color: 'white',
        }}
      >
        🚛 DISPATCH CENTRAL
      </h1>

      <p
        style={{
          fontSize: '1.1rem',
          marginBottom: '25px',
          opacity: 0.9,
        }}
      >
        Professional Load Management & Real-time Dispatch Operations -{' '}
        {user?.name || 'System Admin'}
      </p>

      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '25px',
        }}
      >
        {[
          {
            label: 'Active Loads',
            value: dispatcher.activeLoads,
            color: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            icon: '📋',
          },
          {
            label: 'Efficiency Rate',
            value: `${dispatcher.efficiency}%`,
            color: 'linear-gradient(135deg, #10b981, #059669)',
            icon: '⚡',
          },
          {
            label: 'Avg Response',
            value: dispatcher.avgResponseTime,
            color: 'linear-gradient(135deg, #f97316, #ea580c)',
            icon: '⏱️',
          },
          {
            label: 'Experience',
            value: dispatcher.experience,
            color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            icon: '🏆',
          },
          {
            label: 'Unread Alerts',
            value: notifications.filter((n) => !n.read).length,
            color: 'linear-gradient(135deg, #ef4444, #dc2626)',
            icon: '🔔',
          },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(20px)',
              borderRadius: '15px',
              padding: '18px',
              textAlign: 'center',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow =
                '0 20px 40px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                background: stat.color,
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '12px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
              }}
            >
              <div
                style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}
              >
                {stat.icon}
              </div>
              <div>{stat.value}</div>
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'white',
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Notes & Communication Hub */}
      <div style={{ marginBottom: '20px' }}>
        <StickyNote
          section='dispatch'
          entityId='dispatch-central'
          entityName='Dispatch Central'
          entityType='dispatcher'
          isNotificationHub={true}
        />
      </div>

      {/* Tabs */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          padding: '15px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '15px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'loads', label: '📋 Load Management', icon: '📋' },
            { id: 'tracking', label: '🗺️ Live Tracking', icon: '🗺️' },
            { id: 'workflow', label: '🔄 Workflow Center', icon: '🔄' },
            { id: 'invoices', label: '🧾 Invoices', icon: '🧾' },
            { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background:
                  selectedTab === tab.id
                    ? 'rgba(255, 255, 255, 0.9)'
                    : 'rgba(255, 255, 255, 0.2)',
                color: selectedTab === tab.id ? '#1f2937' : 'white',
                boxShadow:
                  selectedTab === tab.id
                    ? '0 4px 12px rgba(0, 0, 0, 0.2)'
                    : 'none',
                border:
                  selectedTab === tab.id
                    ? '2px solid rgba(255, 255, 255, 0.5)'
                    : '2px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {selectedTab === 'dashboard' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '15px',
              }}
            >
              📊 Operations Dashboard
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '15px',
              }}
            >
              {[
                {
                  title: 'Total Loads',
                  value: stats.total,
                  color: '#3b82f6',
                  bgGradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
                  trend: '+5%',
                  icon: '📋',
                },
                {
                  title: 'Available Loads',
                  value: stats.available,
                  color: '#10b981',
                  bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
                  trend: '+12%',
                  icon: '✅',
                },
                {
                  title: 'Assigned Loads',
                  value: stats.assigned,
                  color: '#f59e0b',
                  bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  trend: '+8%',
                  icon: '👤',
                },
                {
                  title: 'In Transit',
                  value: stats.inTransit,
                  color: '#8b5cf6',
                  bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  trend: '+3%',
                  icon: '🚛',
                },
                {
                  title: 'Delivered',
                  value: stats.delivered,
                  color: '#059669',
                  bgGradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  trend: '+15%',
                  icon: '✅',
                },
                {
                  title: 'Unassigned',
                  value: stats.unassigned,
                  color: '#ef4444',
                  bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  trend: '-2%',
                  icon: '❌',
                },
              ].map((item, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.8)',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.3)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(-3px) scale(1.01)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 28px rgba(0, 0, 0, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 24px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  {/* Icon in top right */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      fontSize: '18px',
                      opacity: 0.7,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Main value with gradient background */}
                  <div
                    style={{
                      background: item.bgGradient,
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '12px',
                      textAlign: 'center',
                      boxShadow: '0 3px 12px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '28px',
                        fontWeight: '800',
                        color: 'white',
                        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      {item.value}
                    </div>
                  </div>

                  {/* Title */}
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#1f2937',
                      marginBottom: '8px',
                      textAlign: 'center',
                    }}
                  >
                    {item.title}
                  </div>

                  {/* Trend indicator */}
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: item.trend.includes('+')
                        ? 'rgba(34, 197, 94, 0.1)'
                        : 'rgba(239, 68, 68, 0.1)',
                      color: item.trend.includes('+') ? '#16a34a' : '#dc2626',
                      border: `1px solid ${item.trend.includes('+') ? '#22c55e' : '#ef4444'}`,
                    }}
                  >
                    {item.trend.includes('+') ? '↗️' : '↘️'} {item.trend} from
                    last week
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* General Loadboard - All Brokers */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '15px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            padding: '20px',
            marginTop: '25px',
            marginBottom: '25px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '15px',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                margin: 0,
              }}
            >
              🌐 General Loadboard - All Brokers
            </h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type='text'
                placeholder='Search all loads...'
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '12px',
                  width: '200px',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <button
                style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          {/* Loadboard Content */}
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Loadboard Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '90px 80px 1.5fr 1fr 120px 100px 100px 100px 120px',
                gap: '10px',
                padding: '12px 15px',
                background: 'rgba(0, 0, 0, 0.6)',
                fontWeight: '700',
                color: '#9ca3af',
                fontSize: '11px',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <div>📞 Board #</div>
              <div>Load ID</div>
              <div>Route</div>
              <div>Broker</div>
              <div>Rate</div>
              <div>Status</div>
              <div>Distance</div>
              <div>Type</div>
              <div>Actions</div>
            </div>

            {/* Sample Load Rows - All Brokers */}
            {sampleLoads.map((load, index) => (
              <div
                key={load.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '90px 80px 1.5fr 1fr 120px 100px 100px 100px 120px',
                  gap: '10px',
                  padding: '10px 15px',
                  background:
                    index % 2 === 0
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(0, 0, 0, 0.4)',
                  color: '#e5e7eb',
                  fontSize: '12px',
                  transition: 'all 0.3s ease',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 12px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    index % 2 === 0
                      ? 'rgba(0, 0, 0, 0.5)'
                      : 'rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    fontWeight: '700',
                    color: '#10b981',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '4px',
                    padding: '2px 4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {load.loadBoardNumber}
                </div>
                <div
                  style={{
                    fontWeight: '700',
                    color: '#60a5fa',
                    fontSize: '9px',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {load.loadIdentifier}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{load.origin}</div>
                  <div style={{ fontSize: '11px', opacity: 0.7 }}>
                    → {load.destination}
                  </div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '500' }}>
                  {load.broker}
                </div>
                <div
                  style={{
                    fontWeight: '700',
                    color: '#22c55e',
                    fontSize: '13px',
                  }}
                >
                  ${load.rate?.toLocaleString()}
                </div>
                <div>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      background:
                        load.status === 'Available'
                          ? 'rgba(34, 197, 94, 0.3)'
                          : load.status === 'Assigned'
                            ? 'rgba(245, 158, 11, 0.3)'
                            : load.status === 'In Transit'
                              ? 'rgba(59, 130, 246, 0.3)'
                              : load.status === 'Delivered'
                                ? 'rgba(34, 197, 94, 0.3)'
                                : 'rgba(107, 114, 128, 0.3)',
                      color:
                        load.status === 'Available'
                          ? '#22c55e'
                          : load.status === 'Assigned'
                            ? '#f59e0b'
                            : load.status === 'In Transit'
                              ? '#3b82f6'
                              : load.status === 'Delivered'
                                ? '#22c55e'
                                : '#6b7280',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                    }}
                  >
                    {load.status}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#f59e0b',
                  }}
                >
                  {load.distance} mi
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#a78bfa',
                  }}
                >
                  {load.type}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    style={{
                      padding: '3px 6px',
                      background: 'rgba(59, 130, 246, 0.3)',
                      color: '#60a5fa',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '9px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    👁️ View
                  </button>
                  {load.status === 'Available' && (
                    <button
                      style={{
                        padding: '3px 6px',
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '9px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      📋 Assign
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTab === 'loads' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '15px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                📋 Load Management & Invoicing
              </h2>
              <input
                type='text'
                placeholder='Search loads...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  fontSize: '14px',
                  width: '280px',
                  backdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Completed Loads Section - Auto-displayed for invoicing */}
            <div
              style={{
                background:
                  'linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))',
                borderRadius: '16px',
                border: '2px solid rgba(34, 197, 94, 0.4)',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2)',
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
                  <h3
                    style={{
                      color: '#ffffff',
                      fontSize: '20px',
                      fontWeight: '700',
                      margin: '0 0 8px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    ✅ Completed Loads Ready for Invoicing
                  </h3>
                  <p
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: '14px',
                      margin: 0,
                    }}
                  >
                    {
                      sampleLoads.filter((load) => load.status === 'Delivered')
                        .length
                    }{' '}
                    loads completed and ready for invoice creation
                  </p>
                </div>
                <button
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(34, 197, 94, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(34, 197, 94, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(34, 197, 94, 0.4)';
                  }}
                >
                  💰 Create All Invoices
                </button>
              </div>

              {/* Completed Loads Display */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Header for completed loads */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      '100px 120px 1.5fr 1fr 120px 140px 120px',
                    gap: '12px',
                    padding: '16px 20px',
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  <div>📞 Board #</div>
                  <div>Load ID</div>
                  <div>Route</div>
                  <div>Broker</div>
                  <div>Revenue</div>
                  <div>Invoice Status</div>
                  <div>Actions</div>
                </div>

                {/* Completed loads rows */}
                {sampleLoads
                  .filter((load) => load.status === 'Delivered')
                  .map((load, index) => (
                    <div
                      key={load.id}
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          '100px 120px 1.5fr 1fr 120px 140px 120px',
                        gap: '12px',
                        padding: '16px 20px',
                        background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                        color: '#1e293b',
                        fontSize: '13px',
                        transition: 'all 0.3s ease',
                        borderBottom: '1px solid #e2e8f0',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(34, 197, 94, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow =
                          '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          index % 2 === 0 ? '#ffffff' : '#f8fafc';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '700',
                          color: '#10b981',
                          fontSize: '11px',
                          fontFamily: 'monospace',
                          textAlign: 'center',
                          background: 'rgba(16, 185, 129, 0.15)',
                          borderRadius: '6px',
                          padding: '4px 6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {load.loadBoardNumber}
                      </div>
                      <div
                        style={{
                          fontWeight: '600',
                          color: '#3b82f6',
                          fontSize: '10px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {load.loadIdentifier}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {load.origin}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          → {load.destination}
                        </div>
                      </div>
                      <div style={{ fontWeight: '500' }}>{load.broker}</div>
                      <div
                        style={{
                          fontWeight: '700',
                          color: '#059669',
                          fontSize: '15px',
                        }}
                      >
                        ${load.rate?.toLocaleString()}
                      </div>
                      <div>
                        <span
                          style={{
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#d97706',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          ⏳ Pending Invoice
                        </span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '6px',
                          alignItems: 'center',
                        }}
                      >
                        <button
                          onClick={() => handleCreateInvoice(load as any)}
                          style={{
                            padding: '6px 12px',
                            background:
                              'linear-gradient(135deg, #22c55e, #16a34a)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              'translateY(-1px)';
                            e.currentTarget.style.boxShadow =
                              '0 4px 12px rgba(34, 197, 94, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow =
                              '0 2px 8px rgba(34, 197, 94, 0.3)';
                          }}
                        >
                          📋 Submit Fee to Management
                        </button>
                      </div>
                    </div>
                  ))}

                {/* No completed loads message */}
                {sampleLoads.filter((load) => load.status === 'Delivered')
                  .length === 0 && (
                  <div
                    style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: '#64748b',
                      background: '#ffffff',
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                      ✅
                    </div>
                    <div
                      style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '8px',
                      }}
                    >
                      No completed loads yet
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      Completed loads will automatically appear here for
                      invoicing
                    </div>
                  </div>
                )}
              </div>

              {/* Summary stats for completed loads */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginTop: '20px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}
                  >
                    {
                      sampleLoads.filter((load) => load.status === 'Delivered')
                        .length
                    }
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Completed Loads
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}
                  >
                    $
                    {sampleLoads
                      .filter((load) => load.status === 'Delivered')
                      .reduce((sum, load) => sum + (load.rate || 0), 0)
                      .toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Total Revenue
                  </div>
                </div>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#ffffff',
                      marginBottom: '4px',
                    }}
                  >
                    {
                      sampleLoads.filter((load) => load.status === 'Delivered')
                        .length
                    }
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Pending Invoices
                  </div>
                </div>
              </div>
            </div>

            {/* All Loads Section */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
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
                <h3
                  style={{
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    margin: 0,
                  }}
                >
                  📋 All Loads
                </h3>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    + Add Load
                  </button>
                  <button
                    style={{
                      padding: '8px 16px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    🤖 AI Match
                  </button>
                </div>
              </div>

              {filteredLoads.length === 0 ? (
                <div
                  style={{
                    padding: '50px',
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '18px',
                  }}
                >
                  🚛 No loads available. Ready for new assignments!
                </div>
              ) : (
                <div>
                  {/* Replace hardcoded load board with EnhancedLoadBoard */}
                  <EnhancedLoadBoard />
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'tracking' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
              }}
            >
              <h2
                style={{
                  color: 'white',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  margin: 0,
                }}
              >
                🗺️ Live Load Tracking
              </h2>
              <Link href='/tracking' style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  🚀 Open Full Tracking Dashboard
                </button>
              </Link>
            </div>

            {/* Enhanced Summary Row - Matching Main Tracking Page */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8, 1fr)',
                gap: '16px',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  📦
                </div>
                <div
                  style={{
                    color: '#3b82f6',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  12
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Total Shipments
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  🚛
                </div>
                <div
                  style={{
                    color: '#10b981',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  8
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  In Transit
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  ✅
                </div>
                <div
                  style={{
                    color: '#059669',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  3
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Delivered
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  ⚠️
                </div>
                <div
                  style={{
                    color: '#ef4444',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  1
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Delayed
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  💰
                </div>
                <div
                  style={{
                    color: '#8b5cf6',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  $156K
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Total Value
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  🚨
                </div>
                <div
                  style={{
                    color: '#f59e0b',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  5
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Alerts
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  ⚡
                </div>
                <div
                  style={{
                    color: '#06b6d4',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  65
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  Avg Speed
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '12px',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '80px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    fontSize: '1rem',
                  }}
                >
                  📊
                </div>
                <div
                  style={{
                    color: '#84cc16',
                    fontWeight: 800,
                    fontSize: '1.25rem',
                    marginBottom: '3px',
                    textAlign: 'center',
                  }}
                >
                  94%
                </div>
                <div
                  style={{
                    color: '#475569',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textAlign: 'center',
                    lineHeight: '1.2',
                  }}
                >
                  On-Time %
                </div>
              </div>
            </div>

            {/* Shipment Cards - Matching Main Tracking Page Style */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '20px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                overflow: 'hidden',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  padding: '20px 24px',
                  borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                  fontWeight: 700,
                  fontSize: '1.125rem',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>📋 Recent Shipments (3)</span>
              </div>

              <div style={{ padding: '16px 24px', flex: 1 }}>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    margin: '0 0 12px 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#1e293b',
                          marginBottom: '4px',
                        }}
                      >
                        SHP-001
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '4px',
                        }}
                      >
                        Swift Transport
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        IN TRANSIT
                      </div>
                      <div
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        HIGH
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      From: Los Angeles, CA
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      To: Chicago, IL
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      ETA: 14 hours
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Driver: John Smith
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Vehicle: Freightliner Cascadia - #FL001
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      Speed: 67 mph
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    margin: '0 0 12px 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#1e293b',
                          marginBottom: '4px',
                        }}
                      >
                        SHP-002
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '4px',
                        }}
                      >
                        Express Logistics
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        DELIVERED
                      </div>
                      <div
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        MEDIUM
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      From: New York, NY
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      To: Miami, FL
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      ETA: Delivered
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>
                        Progress
                      </span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          color: '#1e293b',
                          fontWeight: 600,
                        }}
                      >
                        100%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(148, 163, 184, 0.3)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#10b981',
                          borderRadius: '2px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Driver: Sarah Wilson
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Vehicle: Volvo VNL - #VL002
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      Speed: 0 mph
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    margin: '0 0 12px 0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          color: '#1e293b',
                          marginBottom: '4px',
                        }}
                      >
                        SHP-004
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748b',
                          marginBottom: '4px',
                        }}
                      >
                        Southern Express
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        DELAYED
                      </div>
                      <div
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '0.625rem',
                          fontWeight: 600,
                        }}
                      >
                        HIGH
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      From: Houston, TX
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      To: Atlanta, GA
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      ETA: Delayed - Est. 2024-01-16
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <span style={{ fontSize: '0.625rem', color: '#64748b' }}>
                        Progress
                      </span>
                      <span
                        style={{
                          fontSize: '0.625rem',
                          color: '#1e293b',
                          fontWeight: 600,
                        }}
                      >
                        45%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(148, 163, 184, 0.3)',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '45%',
                          height: '100%',
                          background: '#ef4444',
                          borderRadius: '2px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Driver: Emily Davis
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        marginBottom: '2px',
                      }}
                    >
                      Vehicle: Kenworth T680 - #KW004
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}
                    >
                      Speed: 0 mph
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                textAlign: 'center',
              }}
            >
              <p
                style={{
                  color: '#2563eb',
                  fontSize: '16px',
                  fontWeight: '600',
                  margin: '0 0 8px 0',
                }}
              >
                💡 Real-Time Tracking Available
              </p>
              <p
                style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                Click "Open Full Tracking Dashboard" to access the interactive
                map with live driver locations, detailed route information, and
                real-time shipment monitoring for all your loads.
              </p>
            </div>
          </div>
        )}

        {selectedTab === 'workflow' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '15px',
              }}
            >
              🔄 Workflow Center
            </h2>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              }}
            >
              <UnifiedLiveTrackingWorkflow />
            </div>
          </div>
        )}

        {selectedTab === 'invoices' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '15px',
              }}
            >
              🧾 Dispatch Invoices
            </h2>

            {/* Invoice Statistics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
              }}
            >
              {[
                {
                  label: 'Total Invoices',
                  value: invoiceStats.counts.total,
                  color: '#3b82f6',
                  icon: '📄',
                },
                {
                  label: 'Pending',
                  value: invoiceStats.counts.pending,
                  color: '#f59e0b',
                  icon: '⏳',
                },
                {
                  label: 'Sent',
                  value: invoiceStats.counts.sent,
                  color: '#8b5cf6',
                  icon: '📤',
                },
                {
                  label: 'Paid',
                  value: invoiceStats.counts.paid,
                  color: '#10b981',
                  icon: '✅',
                },
                {
                  label: 'Overdue',
                  value: invoiceStats.counts.overdue,
                  color: '#ef4444',
                  icon: '⚠️',
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    padding: '15px',
                    textAlign: 'center',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <div
                    style={{
                      background: stat.color,
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      borderRadius: '8px',
                      padding: '8px',
                      marginBottom: '8px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        opacity: 0.9,
                        marginBottom: '2px',
                      }}
                    >
                      {stat.icon}
                    </div>
                    <div>{stat.value}</div>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white',
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Invoice List */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                padding: '20px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <h3
                style={{
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                Invoice Management
              </h3>

              {invoices.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                    🧾
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                    No invoices created yet
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    Create invoices for assigned loads to start tracking
                    dispatch fees
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    borderRadius: '10px',
                  }}
                >
                  {invoices.map((invoice, index) => (
                    <div
                      key={ensureUniqueKey(invoice, index)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        padding: '15px',
                        marginBottom: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              marginBottom: '8px',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: 'white',
                              }}
                            >
                              {invoice.id}
                            </div>
                            <div
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '600',
                                background:
                                  invoice.status === 'Paid'
                                    ? 'rgba(34, 197, 94, 0.2)'
                                    : invoice.status === 'Pending'
                                      ? 'rgba(245, 158, 11, 0.2)'
                                      : invoice.status === 'Sent'
                                        ? 'rgba(139, 92, 246, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                                color:
                                  invoice.status === 'Paid'
                                    ? '#22c55e'
                                    : invoice.status === 'Pending'
                                      ? '#f59e0b'
                                      : invoice.status === 'Sent'
                                        ? '#8b5cf6'
                                        : '#ef4444',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                              }}
                            >
                              {invoice.status}
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: '14px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              marginBottom: '4px',
                            }}
                          >
                            {invoice.carrierName} • Load {invoice.loadId}
                            {invoice.loadBoardNumber && (
                              <span
                                style={{
                                  color: '#10b981',
                                  fontWeight: '600',
                                  marginLeft: '8px',
                                }}
                              >
                                📞 #{invoice.loadBoardNumber}
                              </span>
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: '12px',
                              color: 'rgba(255, 255, 255, 0.7)',
                            }}
                          >
                            Due:{' '}
                            {new Date(invoice.dueDate).toLocaleDateString()} •
                            Fee: ${invoice.dispatchFee.toFixed(2)}
                          </div>
                        </div>
                        <div
                          style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            color: '#10b981',
                          }}
                        >
                          ${invoice.dispatchFee.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'notifications' && (
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '22px',
                fontWeight: 'bold',
                marginBottom: '15px',
              }}
            >
              🔔 Dispatch Notifications
            </h2>
            <div
              style={{
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              }}
            >
              {notifications.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>
                    🔔
                  </div>
                  <div style={{ fontSize: '16px', marginBottom: '10px' }}>
                    No notifications
                  </div>
                  <div style={{ fontSize: '14px', opacity: 0.7 }}>
                    All caught up! New notifications will appear here
                  </div>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      padding: '18px 22px',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
                      background: notification.read
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                    }}
                    onClick={() => handleMarkAsRead(notification.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 8px 20px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = notification.read
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {!notification.read && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '18px',
                          left: '8px',
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: '#ef4444',
                          boxShadow: '0 0 12px rgba(239, 68, 68, 0.8)',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginLeft: notification.read ? '0' : '16px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: '15px',
                            fontWeight: notification.read ? '400' : '600',
                            color: 'white',
                            marginBottom: '6px',
                            lineHeight: '1.4',
                          }}
                        >
                          {notification.message}
                        </div>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontWeight: '500',
                          }}
                        >
                          {notification.timestamp}
                        </div>
                      </div>
                      <div
                        style={{
                          display: 'inline-block',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background:
                            notification.type === 'load_assignment'
                              ? 'rgba(59, 130, 246, 0.2)'
                              : notification.type === 'dispatch_update'
                                ? 'rgba(34, 197, 94, 0.2)'
                                : 'rgba(245, 158, 11, 0.2)',
                          color:
                            notification.type === 'load_assignment'
                              ? '#60a5fa'
                              : notification.type === 'dispatch_update'
                                ? '#22c55e'
                                : '#f59e0b',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {notification.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <Link href='/' style={{ textDecoration: 'none' }}>
          <button
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              color: 'white',
              border: '2px solid white',
              padding: '15px 30px',
              borderRadius: '15px',
              fontSize: '18px',
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

      {/* Invoice Creation Modal */}
      {showInvoiceModal && selectedLoadForInvoice && (
        <InvoiceCreationModal
          load={selectedLoadForInvoice as Load}
          onClose={() => {
            setShowInvoiceModal(false);
            setSelectedLoadForInvoice(null);
          }}
          onInvoiceCreated={handleInvoiceCreated}
        />
      )}
    </div>
  );
}
