'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AILoadOptimizationPanel from '../components/AILoadOptimizationPanel';
import CompletedLoadsInvoiceTracker from '../components/CompletedLoadsInvoiceTracker';
import DispatchTaskPrioritizationPanel from '../components/DispatchTaskPrioritizationPanel';
import DocumentsPortalButton from '../components/DocumentsPortalButton';

import UnifiedLiveTrackingWorkflow from '../components/UnifiedLiveTrackingWorkflow';
import UnifiedNotificationBell from '../components/UnifiedNotificationBell';
import { getCurrentUser } from '../config/access';
import { schedulingService } from '../scheduling/service';
import { brokerAgentIntegrationService } from '../services/BrokerAgentIntegrationService';
import GoWithFlowAutomationService from '../services/GoWithFlowAutomationService';
import { goWithTheFlowService } from '../services/GoWithTheFlowService';
import { getAllInvoices, getInvoiceStats } from '../services/invoiceService';
import {
  Load,
  getLoadsForTenant,
  getTenantLoadStats,
} from '../services/loadService';
import {
  LoadBoardMetrics,
  UnifiedLoad,
  unifiedLoadBoardService,
} from '../services/unified-loadboard-service';

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

interface ComplianceStatus {
  driverId: string;
  driverName: string;
  hosStatus: 'compliant' | 'warning' | 'violation' | 'unavailable';
  drivingTimeRemaining: number; // hours
  dutyTimeRemaining: number; // hours
  nextRestRequired: string;
  cdlStatus: 'valid' | 'expired' | 'suspended';
  clearinghouseStatus: 'clear' | 'prohibited' | 'pending';
  medicalCertStatus: 'current' | 'expired' | 'expiring_soon';
  lastUpdated: string;
  canReceiveAssignment: boolean;
  complianceScore: number;
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

// Mock compliance data for drivers
const mockComplianceData: ComplianceStatus[] = [
  {
    driverId: 'driver-001',
    driverName: 'John Rodriguez',
    hosStatus: 'compliant',
    drivingTimeRemaining: 8.5,
    dutyTimeRemaining: 11.2,
    nextRestRequired: '2024-01-15T22:00:00Z',
    cdlStatus: 'valid',
    clearinghouseStatus: 'clear',
    medicalCertStatus: 'current',
    lastUpdated: new Date().toISOString(),
    canReceiveAssignment: true,
    complianceScore: 95,
  },
  {
    driverId: 'driver-002',
    driverName: 'Maria Santos',
    hosStatus: 'warning',
    drivingTimeRemaining: 2.1,
    dutyTimeRemaining: 3.5,
    nextRestRequired: '2024-01-15T18:00:00Z',
    cdlStatus: 'valid',
    clearinghouseStatus: 'clear',
    medicalCertStatus: 'current',
    lastUpdated: new Date().toISOString(),
    canReceiveAssignment: true,
    complianceScore: 78,
  },
  {
    driverId: 'driver-003',
    driverName: 'David Thompson',
    hosStatus: 'violation',
    drivingTimeRemaining: 0,
    dutyTimeRemaining: 0,
    nextRestRequired: '2024-01-15T16:00:00Z',
    cdlStatus: 'valid',
    clearinghouseStatus: 'clear',
    medicalCertStatus: 'expiring_soon',
    lastUpdated: new Date().toISOString(),
    canReceiveAssignment: false,
    complianceScore: 45,
  },
  {
    driverId: 'driver-004',
    driverName: 'Lisa Chen',
    hosStatus: 'unavailable',
    drivingTimeRemaining: 0,
    dutyTimeRemaining: 0,
    nextRestRequired: '2024-01-16T06:00:00Z',
    cdlStatus: 'valid',
    clearinghouseStatus: 'clear',
    medicalCertStatus: 'current',
    lastUpdated: new Date().toISOString(),
    canReceiveAssignment: false,
    complianceScore: 88,
  },
];

// Drivers currently on the road
const driversOnTheRoad = [
  {
    id: 'driver-001',
    truckingCompany: 'Rodriguez Transport LLC',
    driverName: 'John Rodriguez',
    mcNumber: 'MC-123456',
    currentLoad: 'FL-001 (Dallas → Phoenix)',
    status: 'En Route',
  },
  {
    id: 'driver-002',
    truckingCompany: 'Santos Logistics Inc',
    driverName: 'Maria Santos',
    mcNumber: 'MC-789012',
    currentLoad: 'FL-002 (Houston → Denver)',
    status: 'Loading',
  },
  {
    id: 'driver-003',
    truckingCompany: 'Thompson Freight Co',
    driverName: 'David Thompson',
    mcNumber: 'MC-345678',
    currentLoad: 'FL-003 (Austin → Seattle)',
    status: 'At Delivery',
  },
];

// Unified Load Board Section Component
const UnifiedLoadBoardSection = () => {
  const [unifiedLoads, setUnifiedLoads] = useState<UnifiedLoad[]>([]);
  const [loadBoardMetrics, setLoadBoardMetrics] =
    useState<LoadBoardMetrics | null>(null);
  const [loadingUnified, setLoadingUnified] = useState(false);
  const [showAllLoads, setShowAllLoads] = useState(false);
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    equipment: '',
    source: 'all',
  });

  // Load unified load board data
  useEffect(() => {
    loadUnifiedData();
  }, []);

  const loadUnifiedData = async () => {
    setLoadingUnified(true);
    try {
      // Get loads from all sources (Phase 1: API Integrations + Phase 3: Partnerships)
      const loads = await unifiedLoadBoardService.getAllLoads(true);
      setUnifiedLoads(loads.slice(0, 12)); // Show top 12 loads initially

      // Get metrics for partnership negotiations
      const metrics = await unifiedLoadBoardService.getLoadBoardMetrics();
      setLoadBoardMetrics(metrics);
    } catch (error) {
      console.error('Failed to load unified load board data:', error);
    } finally {
      setLoadingUnified(false);
    }
  };

  const handleSearchUnified = async () => {
    setLoadingUnified(true);
    try {
      const filteredLoads = await unifiedLoadBoardService.searchLoads({
        origin: filters.origin || undefined,
        destination: filters.destination || undefined,
        equipment: filters.equipment || undefined,
      });
      setUnifiedLoads(filteredLoads.slice(0, 12));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoadingUnified(false);
    }
  };

  const handleContactBroker = async (load: UnifiedLoad) => {
    // Track usage for partnership negotiations (Phase 2)
    await unifiedLoadBoardService.trackLoadBoardUsage({
      loadViewed: load.id,
      source: load.source,
      action: 'contacted',
      userId: getCurrentUser()?.user?.id || 'dispatcher',
    });

    // Contact options: phone first, then email
    if (load.brokerInfo.phone) {
      window.open(`tel:${load.brokerInfo.phone}`, '_blank');
    } else if (load.brokerInfo.email) {
      window.open(
        `mailto:${load.brokerInfo.email}?subject=Load Inquiry - ${load.origin.city} to ${load.destination.city}&body=Hi, I'm interested in your load from ${load.origin.city}, ${load.origin.state} to ${load.destination.city}, ${load.destination.state} for $${load.rate.toLocaleString()}.`,
        '_blank'
      );
    }
  };

  return (
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
      {/* Compact Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px',
        }}
      >
        <h2
          style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            margin: 0,
          }}
        >
          🎯 Unified Load Board ({unifiedLoads.length} loads)
        </h2>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <DocumentsPortalButton variant='compact' />
          <div style={{ display: 'flex', gap: '6px' }}>
            <span
              style={{
                background: '#10b981',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '9px',
              }}
            >
              API INTEGRATIONS
            </span>
            <span
              style={{
                background: '#f59e0b',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '8px',
                fontSize: '9px',
              }}
            >
              TRACKING
            </span>
          </div>
          <span
            style={{
              background: '#6b7280',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '8px',
              fontSize: '9px',
            }}
          >
            PARTNERSHIPS
          </span>
        </div>
      </div>

      {/* Compact Search Filters */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '15px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <input
          type='text'
          placeholder='Origin'
          value={filters.origin}
          onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            width: '120px',
          }}
        />
        <input
          type='text'
          placeholder='Destination'
          value={filters.destination}
          onChange={(e) =>
            setFilters({ ...filters, destination: e.target.value })
          }
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            width: '120px',
          }}
        />
        <select
          value={filters.equipment}
          onChange={(e) =>
            setFilters({ ...filters, equipment: e.target.value })
          }
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            width: '100px',
          }}
        >
          <option value=''>All Equip</option>
          <option value='van'>Van</option>
          <option value='reefer'>Reefer</option>
          <option value='flatbed'>Flatbed</option>
        </select>
        <select
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            background: 'rgba(255, 255, 255, 0.9)',
            fontSize: '12px',
            width: '100px',
          }}
        >
          <option value='all'>All Sources</option>
          <option value='DAT_FREE'>DAT</option>
          <option value='TQL_PARTNER'>TQL</option>
          <option value='LANDSTAR_PARTNER'>Landstar</option>
        </select>
        <button
          onClick={handleSearchUnified}
          disabled={loadingUnified}
          style={{
            background: loadingUnified ? 'rgba(255, 255, 255, 0.3)' : '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: loadingUnified ? 'not-allowed' : 'pointer',
          }}
        >
          {loadingUnified ? '🔄' : '🔍 Search'}
        </button>
        {loadBoardMetrics && (
          <span
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              marginLeft: '10px',
            }}
          >
            {loadBoardMetrics.totalLoads.toLocaleString()} total • $
            {(loadBoardMetrics.averageRate / 1000).toFixed(1)}K avg
          </span>
        )}
      </div>

      {/* Load Board Table - Matching General Loadboard Style */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
        }}
      >
        {/* Table Header */}
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
          <div>🎯 Source</div>
          <div>Load ID</div>
          <div>Route</div>
          <div>Broker</div>
          <div>Rate</div>
          <div>Equipment</div>
          <div>Distance</div>
          <div>Pickup</div>
          <div>🛡️ Risk</div>
        </div>

        {/* Table Body */}
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {unifiedLoads.map((load, index) => (
            <div
              key={load.id}
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '90px 80px 1.5fr 1fr 120px 100px 100px 100px 120px',
                gap: '10px',
                padding: '10px 15px',
                background:
                  index % 2 === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)',
                color: '#e5e7eb',
                fontSize: '12px',
                transition: 'all 0.3s ease',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 4px 12px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  index % 2 === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => handleContactBroker(load)}
            >
              {/* Source Badge */}
              <div
                style={{
                  fontWeight: '700',
                  color:
                    load.sourceStatus === 'partnership' ? '#10b981' : '#6b7280',
                  fontSize: '9px',
                  fontFamily: 'monospace',
                  textAlign: 'center',
                  background:
                    load.sourceStatus === 'partnership'
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(107, 114, 128, 0.1)',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {load.source === 'DAT_FREE'
                  ? 'DAT'
                  : load.source === 'TQL_PARTNER'
                    ? 'TQL'
                    : load.source === 'LANDSTAR_PARTNER'
                      ? 'LDS'
                      : load.source === 'TRUCKSTOP_PUBLIC'
                        ? 'TS'
                        : load.source === '123LOADBOARD'
                          ? '123'
                          : load.source.substring(0, 3)}
              </div>

              {/* Load ID */}
              <div
                style={{
                  fontWeight: '600',
                  color: '#3b82f6',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                }}
              >
                {load.id.substring(load.id.length - 6)}
              </div>

              {/* Route */}
              <div style={{ fontWeight: '600' }}>
                <div style={{ color: '#10b981', marginBottom: '2px' }}>
                  {load.origin.city}, {load.origin.state} →{' '}
                  {load.destination.city}, {load.destination.state}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {load.commodity} • {load.weight.toLocaleString()} lbs
                  {load.hazmat && (
                    <span style={{ color: '#ef4444' }}> • HAZMAT</span>
                  )}
                </div>
              </div>

              {/* Broker */}
              <div>
                <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                  {load.brokerInfo.name.length > 20
                    ? load.brokerInfo.name.substring(0, 20) + '...'
                    : load.brokerInfo.name}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {load.brokerInfo.phone && (
                    <div>📞 {load.brokerInfo.phone}</div>
                  )}
                  {load.brokerInfo.email && (
                    <div>✉️ {load.brokerInfo.email}</div>
                  )}
                  {load.brokerInfo.rating && (
                    <div>⭐ {load.brokerInfo.rating}/5</div>
                  )}
                </div>
              </div>

              {/* Rate */}
              <div>
                <div
                  style={{
                    fontWeight: '700',
                    color: '#10b981',
                    fontSize: '14px',
                  }}
                >
                  ${load.rate.toLocaleString()}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  ${(load.rate / load.miles).toFixed(2)}/mile
                </div>
              </div>

              {/* Equipment */}
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                  }}
                >
                  {load.equipment === 'van'
                    ? 'VAN'
                    : load.equipment === 'reefer'
                      ? 'REF'
                      : load.equipment === 'flatbed'
                        ? 'FLT'
                        : load.equipment === 'stepdeck'
                          ? 'SD'
                          : load.equipment.toUpperCase()}
                </div>
              </div>

              {/* Distance */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600' }}>{load.miles} mi</div>
                {load.deadheadMiles && load.deadheadMiles > 0 && (
                  <div style={{ fontSize: '10px', color: '#f59e0b' }}>
                    +{load.deadheadMiles} DH
                  </div>
                )}
              </div>

              {/* Pickup Date */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: '600' }}>
                  {new Date(load.pickupDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {new Date(load.pickupDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                  })}
                </div>
              </div>

              {/* Risk Level & Actions */}
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {load.riskLevel && (
                  <span
                    style={{
                      background:
                        load.riskLevel === 'low'
                          ? 'rgba(16, 185, 129, 0.2)'
                          : load.riskLevel === 'medium'
                            ? 'rgba(245, 158, 11, 0.2)'
                            : 'rgba(239, 68, 68, 0.2)',
                      color:
                        load.riskLevel === 'low'
                          ? '#10b981'
                          : load.riskLevel === 'medium'
                            ? '#f59e0b'
                            : '#ef4444',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '9px',
                      fontWeight: '700',
                    }}
                  >
                    {load.riskLevel.toUpperCase()}
                  </span>
                )}
                {load.recommendationScore && (
                  <span
                    style={{
                      fontSize: '10px',
                      color: '#9ca3af',
                      fontWeight: '600',
                    }}
                  >
                    {load.recommendationScore}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Loading State */}
        {loadingUnified && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              color: '#6b7280',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid #e5e7eb',
                borderTop: '2px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
            <span style={{ marginLeft: '8px', fontSize: '12px' }}>
              Loading loads...
            </span>
          </div>
        )}

        {/* Empty State */}
        {!loadingUnified && unifiedLoads.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '30px',
              color: '#6b7280',
              fontSize: '14px',
            }}
          >
            No loads found. Try adjusting your search filters.
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div
        style={{
          marginTop: '10px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '10px',
        }}
      >
        Multi-platform aggregation: TQL • Landstar • DAT • Truckstop •
        123LoadBoard • FleetGuard AI Risk Analysis
      </div>
    </div>
  );
};

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
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [loadStatusFilter, setLoadStatusFilter] = useState('All');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Compliance state management
  const [complianceData, setComplianceData] =
    useState<ComplianceStatus[]>(mockComplianceData);
  const [selectedDriverForAssignment, setSelectedDriverForAssignment] =
    useState<string | null>(null);
  const [showComplianceAlert, setShowComplianceAlert] = useState(false);
  const [complianceAlertMessage, setComplianceAlertMessage] = useState('');
  const [selectedLoadForInvoice, setSelectedLoadForInvoice] =
    useState<Load | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoiceStats, setInvoiceStats] = useState({
    counts: { total: 0, pending: 0, sent: 0, paid: 0, overdue: 0 },
    amounts: { total: 0, pending: 0, paid: 0 },
  });

  // Enhanced Invoice Tracking State
  const [completedLoads, setCompletedLoads] = useState<any[]>([]);
  const [selectedInvoiceForViewing, setSelectedInvoiceForViewing] = useState<
    string | null
  >(null);
  const [showInvoiceLifecycleViewer, setShowInvoiceLifecycleViewer] =
    useState(false);

  // Square Accessorial Fee Management State
  const [selectedAccessorialLoad, setSelectedAccessorialLoad] =
    useState<Load | null>(null);
  const [showAccessorialModal, setShowAccessorialModal] = useState(false);
  const [accessorialFees, setAccessorialFees] = useState({
    detention: {
      hours: 0,
      rate: 50,
      location: 'pickup' as 'pickup' | 'delivery',
      total: 0,
    },
    lumper: {
      amount: 0,
      location: 'pickup' as 'pickup' | 'delivery',
      receiptNumber: '',
    },
    other: [] as Array<{ type: string; description: string; amount: number }>,
  });
  // Current driver being viewed in Workflow Center
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);

  // Go with the Flow Automation Service
  const [automationService] = useState(() =>
    GoWithFlowAutomationService.getInstance()
  );
  const [automatedActivities, setAutomatedActivities] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    autoMatchSuccessRate: 94,
    avgResponseTime: 2.3,
    activeBOLWorkflows: 12,
    systemUptime: 99.8,
    totalAutomatedLoads: 847,
    activeDrivers: 24,
  });

  // Real-time Go with the Flow data
  const [goWithFlowData, setGoWithFlowData] = useState({
    loads: [] as any[],
    drivers: [] as any[],
    activityFeed: [] as string[],
    wonMarketplaceLoads: [] as any[],
    marketplaceRevenue: 0,
    loadStats: {
      totalLoads: 0,
      activeLoads: 0,
      completedLoads: 0,
      marketplaceLoads: 0,
      standardLoads: 0,
      pendingLoads: 0,
    },
    marketplaceMetrics: {
      totalExternalLoadsEvaluated: 0,
      externalBidsSubmitted: 0,
      bidAcceptanceRate: 0,
      averageProfitMargin: 0,
      crossDockingOpportunities: 0,
      rightSizedAssetUtilization: 0,
    },
    driverResponseRate: 0,
  });

  // Driver Schedule Modal
  const [showDriverScheduleModal, setShowDriverScheduleModal] = useState(false);
  const [modalDriverData, setModalDriverData] = useState<any>(null);
  const [driverScheduleData, setDriverScheduleData] = useState<any[]>([]);
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(
    null
  );

  // Compliance validation functions
  const validateDriverCompliance = (
    driverId: string
  ): { canAssign: boolean; warnings: string[]; errors: string[] } => {
    const driver = complianceData.find((d) => d.driverId === driverId);
    if (!driver) {
      return {
        canAssign: false,
        warnings: [],
        errors: ['Driver compliance data not found'],
      };
    }

    const warnings: string[] = [];
    const errors: string[] = [];

    // Check HOS compliance
    if (driver.hosStatus === 'violation') {
      errors.push(
        `Driver ${driver.driverName} has HOS violation - cannot receive assignment`
      );
    } else if (driver.hosStatus === 'warning') {
      warnings.push(
        `Driver ${driver.driverName} has limited driving time remaining: ${driver.drivingTimeRemaining}h`
      );
    } else if (driver.hosStatus === 'unavailable') {
      errors.push(
        `Driver ${driver.driverName} is in required rest period until ${new Date(driver.nextRestRequired).toLocaleString()}`
      );
    }

    // Check CDL status
    if (driver.cdlStatus === 'expired') {
      errors.push(
        `Driver ${driver.driverName} has expired CDL - cannot receive assignment`
      );
    } else if (driver.cdlStatus === 'suspended') {
      errors.push(
        `Driver ${driver.driverName} has suspended CDL - cannot receive assignment`
      );
    }

    // Check clearinghouse status
    if (driver.clearinghouseStatus === 'prohibited') {
      errors.push(
        `Driver ${driver.driverName} is prohibited in DOT clearinghouse - cannot receive assignment`
      );
    } else if (driver.clearinghouseStatus === 'pending') {
      warnings.push(
        `Driver ${driver.driverName} has pending clearinghouse status`
      );
    }

    // Check medical certificate
    if (driver.medicalCertStatus === 'expired') {
      errors.push(
        `Driver ${driver.driverName} has expired medical certificate - cannot receive assignment`
      );
    } else if (driver.medicalCertStatus === 'expiring_soon') {
      warnings.push(
        `Driver ${driver.driverName} medical certificate expires soon`
      );
    }

    const canAssign = errors.length === 0 && driver.canReceiveAssignment;
    return { canAssign, warnings, errors };
  };

  const handleDriverAssignment = (driverId: string, loadId: string) => {
    const validation = validateDriverCompliance(driverId);

    if (!validation.canAssign) {
      setComplianceAlertMessage(
        `❌ ASSIGNMENT BLOCKED\n\nCompliance violations prevent assignment:\n${validation.errors.join('\n')}`
      );
      setShowComplianceAlert(true);
      return false;
    }

    if (validation.warnings.length > 0) {
      setComplianceAlertMessage(
        `⚠️ ASSIGNMENT WARNING\n\nProceed with caution:\n${validation.warnings.join('\n')}\n\nContinue with assignment?`
      );
      setShowComplianceAlert(true);
      setSelectedDriverForAssignment(driverId);
      return false; // Wait for user confirmation
    }

    // Assignment approved - proceed normally
    console.log(
      `✅ Assignment approved: Driver ${driverId} assigned to load ${loadId}`
    );
    return true;
  };

  const getComplianceStatusColor = (status: ComplianceStatus['hosStatus']) => {
    switch (status) {
      case 'compliant':
        return '#10b981'; // green
      case 'warning':
        return '#f59e0b'; // amber
      case 'violation':
        return '#ef4444'; // red
      case 'unavailable':
        return '#6b7280'; // gray
      default:
        return '#6b7280';
    }
  };

  useEffect(() => {
    setIsClient(true);
    const { user: currentUser } = getCurrentUser();
    setUser(currentUser);

    // Initialize Go with the Flow automation service
    if (automationService) {
      setAutomatedActivities(automationService.getActivities());
      setSystemStatus(automationService.getSystemStatus());

      // Set up real-time activity updates (in real app, this would be WebSocket)
      const activityInterval = setInterval(() => {
        setAutomatedActivities(automationService.getActivities());
        setSystemStatus(automationService.getSystemStatus());
      }, 2000);

      // Initialize real-time Go with the Flow data
      const updateGoWithFlowData = () => {
        setGoWithFlowData({
          loads: goWithTheFlowService.getAllLoads(),
          drivers: goWithTheFlowService.getAllDrivers(),
          activityFeed: goWithTheFlowService.getActivityFeed(),
          wonMarketplaceLoads: goWithTheFlowService.getWonMarketplaceLoads(),
          marketplaceRevenue: goWithTheFlowService.getMarketplaceRevenue(),
          loadStats: goWithTheFlowService.getLoadStats(),
          marketplaceMetrics: goWithTheFlowService.getMarketplaceMetrics(),
          driverResponseRate: goWithTheFlowService.getDriverResponseRate(),
        });
      };

      // Initial load
      updateGoWithFlowData();

      // Real-time updates every 3 seconds
      const goWithFlowInterval = setInterval(updateGoWithFlowData, 3000);

      return () => {
        clearInterval(activityInterval);
        clearInterval(goWithFlowInterval);
      };
    }

    if (currentUser) {
      // Get loads for this tenant/dispatcher using multi-tenant filtering
      const tenantLoads = getLoadsForTenant();

      // Get agent loads from brokerage system (flows through hierarchy)
      const agentLoads = brokerAgentIntegrationService.getLoadsForDispatch();

      // Convert agent loads to standard Load format and combine
      const convertedAgentLoads: Load[] = agentLoads.map((agentLoad) => ({
        id: agentLoad.id,
        brokerId: agentLoad.brokerageId,
        brokerName: `${agentLoad.agentName} (Agent)`,
        shipperName: agentLoad.shipperName,
        origin: agentLoad.origin,
        destination: agentLoad.destination,
        rate: agentLoad.rate,
        distance: '0 mi', // Will be calculated
        weight: agentLoad.weight,
        equipment: agentLoad.equipment,
        status: agentLoad.status as any,
        pickupDate: agentLoad.pickupDate,
        deliveryDate: agentLoad.deliveryDate,
        createdAt: agentLoad.createdAt,
        updatedAt: agentLoad.createdAt, // Use createdAt as default updatedAt
        loadBoardNumber: agentLoad.loadNumber,
        // Additional fields for agent load tracking
        agentId: agentLoad.agentId,
        agentName: agentLoad.agentName,
        marginPercent: agentLoad.marginPercent,
      }));

      // Combine tenant loads with agent loads
      const allLoads = [...tenantLoads, ...convertedAgentLoads];
      setLoads(allLoads);

      // Get tenant-specific load statistics (now includes agent loads)
      const tenantStats = getTenantLoadStats();
      // Add agent load counts to stats
      const agentLoadStats = {
        total: tenantStats.total + agentLoads.length,
        available:
          tenantStats.available +
          agentLoads.filter((l) => l.status === 'Available').length,
        assigned:
          tenantStats.assigned +
          agentLoads.filter((l) => l.status === 'Assigned').length,
        inTransit:
          tenantStats.inTransit +
          agentLoads.filter((l) => l.status === 'In Transit').length,
        delivered:
          tenantStats.delivered +
          agentLoads.filter((l) => l.status === 'Delivered').length,
        // Include all required stats properties
        broadcasted: tenantStats.broadcasted || 0,
        driverSelected: tenantStats.driverSelected || 0,
        orderSent: tenantStats.orderSent || 0,
        unassigned: tenantStats.unassigned || 0,
      };
      setStats(agentLoadStats);

      // Load invoices
      const allInvoices = getAllInvoices();
      setInvoices(allInvoices);

      const stats = getInvoiceStats();
      setInvoiceStats(stats);

      console.log(
        `🔄 Dispatch Central: Loaded ${tenantLoads.length} tenant loads + ${agentLoads.length} agent loads = ${allLoads.length} total loads`
      );

      // Populate completed loads for invoice tracking
      const completedLoadsData = allLoads
        .filter((load) => load.status === 'Delivered')
        .map((load) => ({
          id: load.id,
          loadBoardNumber: load.loadBoardNumber || '100000',
          route: `${load.origin} → ${load.destination}`,
          completedDate: new Date().toISOString(),
          grossRevenue: load.rate || 0,
          dispatcherFee: Math.round((load.rate || 0) * 0.1), // 10% fee
          netCarrierPayment: Math.round((load.rate || 0) * 0.9),
          carrierName: load.brokerName || 'Unknown Carrier',

          // Invoice Information
          invoiceNumber: `INV-${load.id}-${Date.now().toString().slice(-6)}`,
          invoiceStatus: Math.random() > 0.5 ? 'sent' : 'auto_generated',
          invoiceCreatedAt: new Date().toISOString(),
          paymentDueDate: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(),

          // Document References
          rateConfirmationNumber: `RC-${load.id}-${Date.now().toString().slice(-6)}`,
          bolNumber: `BOL-${load.id}-${Date.now().toString().slice(-6)}`,
          documentsVerified: Math.random() > 0.3,

          // Payment Tracking
          paymentMethod: undefined,
          paymentReference: undefined,
          daysOverdue:
            Math.random() > 0.8
              ? Math.floor(Math.random() * 10) + 1
              : undefined,
        }));

      setCompletedLoads(completedLoadsData);
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

  const handleGenerateRateConfirmation = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `rate-confirmation-${load.id}-${Date.now()}`,
      type: 'rate-confirmation',
      loadId: load.id,
      data: {
        ...load,
        carrierName: load.dispatcherName || 'TBD',
        pickupDate: new Date().toLocaleDateString(),
        deliveryDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with rate confirmation tab
    window.open(`/documents?loadId=${load.id}&tab=rate-confirmation`, '_blank');

    // Show success notification
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `Rate Confirmation generated for Load #${load.id}`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleGenerateBOL = (load: Load) => {
    // Store load data in localStorage for auto-population
    const documentData = {
      id: `bill-of-lading-${load.id}-${Date.now()}`,
      type: 'bill-of-lading',
      loadId: load.id,
      data: {
        ...load,
        weight: load.weight || '40,000 lbs',
        equipment: load.equipment || 'Dry Van',
        pickupDate: new Date().toLocaleDateString(),
        deliveryDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      },
      timestamp: new Date().toISOString(),
      status: 'generated',
    };

    const savedDocs = JSON.parse(
      localStorage.getItem('fleetflow-documents') || '[]'
    );
    savedDocs.push(documentData);
    localStorage.setItem('fleetflow-documents', JSON.stringify(savedDocs));

    // Open documents page with bill of lading tab
    window.open(`/documents?loadId=${load.id}&tab=bill-of-lading`, '_blank');

    // Show success notification
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `Bill of Lading generated for Load #${load.id}`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);
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

  // Square Accessorial Fee Handler
  const handleCreateAccessorialInvoice = async () => {
    if (!selectedAccessorialLoad) return;

    try {
      // Import Square accessorial functions
      const { createAccessorialInvoice } = await import(
        '../services/settlementService'
      );

      // Calculate detention fee total
      const detentionTotal =
        Math.max(0, accessorialFees.detention.hours - 2) *
        accessorialFees.detention.rate;

      // Prepare accessorial data
      const accessorialData = {
        detention:
          detentionTotal > 0
            ? {
                hours: accessorialFees.detention.hours,
                rate: accessorialFees.detention.rate,
                location: accessorialFees.detention.location,
                total: detentionTotal,
              }
            : undefined,
        lumper:
          accessorialFees.lumper.amount > 0
            ? {
                amount: accessorialFees.lumper.amount,
                location: accessorialFees.lumper.location,
                receiptNumber: accessorialFees.lumper.receiptNumber,
              }
            : undefined,
        other:
          accessorialFees.other.length > 0 ? accessorialFees.other : undefined,
      };

      // Create Square invoice for accessorial fees
      const result = await createAccessorialInvoice(
        selectedAccessorialLoad.id,
        (selectedAccessorialLoad as any).brokerId ||
          (selectedAccessorialLoad as any).broker ||
          'default-broker',
        accessorialData
      );

      if (result.success) {
        // Add success notification
        setNotifications((prev) => [
          {
            id: Date.now().toString(),
            message: `✅ Square accessorial invoice created for Load ${selectedAccessorialLoad.id}. Invoice ID: ${result.invoiceId}`,
            timestamp: 'Just now',
            type: 'system_alert',
            read: false,
          },
          ...prev,
        ]);

        // Reset form and close modal
        setAccessorialFees({
          detention: { hours: 0, rate: 50, location: 'pickup', total: 0 },
          lumper: { amount: 0, location: 'pickup', receiptNumber: '' },
          other: [],
        });
        setShowAccessorialModal(false);
        setSelectedAccessorialLoad(null);
      } else {
        // Add error notification
        setNotifications((prev) => [
          {
            id: Date.now().toString(),
            message: `❌ Failed to create accessorial invoice: ${result.error}`,
            timestamp: 'Just now',
            type: 'system_alert',
            read: false,
          },
          ...prev,
        ]);
      }
    } catch (error) {
      console.error('Error creating accessorial invoice:', error);
      setNotifications((prev) => [
        {
          id: Date.now().toString(),
          message: `❌ Error creating accessorial invoice: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: 'Just now',
          type: 'system_alert',
          read: false,
        },
        ...prev,
      ]);
    }
  };

  // Enhanced Invoice Tracking Handlers
  const handleViewInvoice = (invoiceNumber: string) => {
    setSelectedInvoiceForViewing(invoiceNumber);
    setShowInvoiceLifecycleViewer(true);
  };

  const handleCreateInvoiceFromLoad = (loadId: string) => {
    // Find the load and create invoice
    const load = loads.find((l) => l.id === loadId);
    if (load) {
      handleCreateInvoice(load);
    }
  };

  const handleResendInvoice = (invoiceNumber: string) => {
    // Add notification for resending invoice
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `📧 Invoice ${invoiceNumber} resent to carrier`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);
  };

  const handleMarkPaid = (invoiceNumber: string, paymentInfo: any) => {
    // Update invoice status and add notification
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `💰 Invoice ${invoiceNumber} marked as paid - ${paymentInfo.method.toUpperCase()} ${paymentInfo.reference}`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);

    // Update completed loads status
    setCompletedLoads((prev) =>
      prev.map((load) =>
        load.invoiceNumber === invoiceNumber
          ? {
              ...load,
              invoiceStatus: 'paid',
              paidAt: new Date().toISOString(),
              paymentMethod: paymentInfo.method,
              paymentReference: paymentInfo.reference,
            }
          : load
      )
    );
  };

  const handleViewDocuments = (loadId: string, documentType: string) => {
    // Open documents page for the specific load
    window.open(`/documents?loadId=${loadId}&tab=${documentType}`, '_blank');
  };

  const handleSendReminder = () => {
    // Add notification for reminder sent
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        message: `🔔 Payment reminder sent for invoice`,
        timestamp: 'Just now',
        type: 'system_alert',
        read: false,
      },
      ...prev,
    ]);
  };

  // Function to cycle to next driver on the road
  const goToNextDriver = () => {
    setCurrentDriverIndex(
      (prevIndex) => (prevIndex + 1) % driversOnTheRoad.length
    );
  };

  // Open Driver Schedule Modal
  const openDriverScheduleModal = (driver: any) => {
    setModalDriverData(driver);

    // Fetch real schedule data from scheduling service
    const driverSchedules = schedulingService.getSchedules({
      assignedDriverId: driver.id,
    });

    setDriverScheduleData(driverSchedules);
    setShowDriverScheduleModal(true);
  };

  // Get status color and style for schedule status
  const getScheduleStatusStyle = (status: string) => {
    switch (status) {
      case 'Scheduled':
        return { background: '#fef3c7', color: '#92400e' };
      case 'In Progress':
        return { background: '#dcfce7', color: '#166534' };
      case 'Completed':
        return { background: '#dcfce7', color: '#166534' };
      case 'Cancelled':
        return { background: '#fecaca', color: '#991b1b' };
      case 'Delayed':
        return { background: '#fed7d7', color: '#c53030' };
      default:
        return { background: '#e0e7ff', color: '#3730a3' };
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Calculate total weekly hours
  const calculateTotalWeeklyHours = (schedules: any[]) => {
    return schedules.reduce(
      (sum, schedule) => sum + (schedule.estimatedHours || 8),
      0
    );
  };

  // Update schedule status
  const updateScheduleStatus = async (
    scheduleId: string,
    newStatus: string
  ) => {
    try {
      const result = await schedulingService.updateSchedule(scheduleId, {
        status: newStatus as any,
      });
      if (result.success) {
        // Refresh the schedule data
        const updatedSchedules = schedulingService.getSchedules({
          assignedDriverId: modalDriverData.id,
        });
        setDriverScheduleData(updatedSchedules);
      }
    } catch (error) {
      console.error('Error updating schedule status:', error);
    }
  };

  // Handle double-click to start editing
  const handleScheduleDoubleClick = (scheduleId: string) => {
    setEditingScheduleId(scheduleId);
  };

  const currentDriver = driversOnTheRoad[currentDriverIndex];

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
    <>
      {/* CSS Keyframes for driver name glow animation */}
      <style jsx>{`
        @keyframes driverNamePulse {
          0%,
          100% {
            box-shadow:
              0 0 10px rgba(59, 130, 246, 0.4),
              0 0 20px rgba(59, 130, 246, 0.2);
          }
          50% {
            box-shadow:
              0 0 15px rgba(59, 130, 246, 0.6),
              0 0 30px rgba(59, 130, 246, 0.3);
          }
        }
      `}</style>

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
        {/* Header with title and original notification bell */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginBottom: '15px',
          }}
        >
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              color: 'white',
              margin: 0,
            }}
          >
            🚛 DISPATCH CENTRAL
          </h1>

          {/* Unified Notification Bell */}
          <UnifiedNotificationBell
            userId={user?.id || 'dispatch-user'}
            portal='dispatch'
            position='inline'
            size='lg'
            theme='dark'
            showBadge={true}
            showDropdown={true}
            maxNotifications={25}
          />
        </div>
        {/* Personal Controls - Documents, My Portal (Management Only) */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}
        >
          <DocumentsPortalButton variant='small' showText={false} />
          {/* My Portal - Only visible to Management users (MGR department) who can dispatch */}
          {isClient &&
            (user?.departmentCode === 'MGR' ||
              user?.role === 'admin' ||
              user?.role === 'manager') && (
              <Link
                href='/dispatcher-portal'
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 15px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 2px 8px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                👤 My Portal
              </Link>
            )}
        </div>
        <p
          style={{
            fontSize: '1.1rem',
            marginBottom: '15px',
            opacity: 0.9,
          }}
        >
          Professional Load Management & Real-time Dispatch Operations -{' '}
          {user?.name || 'System Admin'}
        </p>
        <p
          style={{
            fontSize: '0.9rem',
            marginBottom: '25px',
            color: 'rgba(139, 92, 246, 0.9)',
            fontWeight: '600',
          }}
        >
          🛡️ Integrated with FACIS™ Security Intelligence & Risk Assessment
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
                  style={{
                    fontSize: '14px',
                    opacity: 0.9,
                    marginBottom: '4px',
                  }}
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
              justifyContent: 'space-between',
            }}
          >
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              {
                id: 'ai-optimization',
                label: '🤖 AI Optimization',
                icon: '🤖',
              },
              { id: 'ai-dock-scheduling', label: '🏭 AI Dock Scheduling', icon: '🏭' },
              { id: 'go-with-flow', label: '⚡ Go With the Flow', icon: '⚡' },
              { id: 'task-priority', label: '🎯 Task Priority', icon: '🎯' },
              { id: 'loads', label: '📋 Load Management', icon: '📋' },
              { id: 'tracking', label: '🗺️ Live Tracking', icon: '🗺️' },
              { id: 'compliance', label: '⚖️ Driver Compliance', icon: '⚖️' },
              { id: 'workflow', label: '🔄 Workflow Center', icon: '🔄' },
              { id: 'invoices', label: '🧾 Invoices', icon: '🧾' },
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
                      e.currentTarget.style.transform =
                        'translateY(0) scale(1)';
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
              <div
                style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
              >
                <input
                  type='text'
                  placeholder='Search dispatches...'
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
                          background:
                            'linear-gradient(135deg, #3b82f6, #2563eb)',
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

          {/* Unified Load Board Aggregator */}
          <UnifiedLoadBoardSection />

          {/* AI Load Optimization Tab */}
          {selectedTab === 'ai-optimization' && (
            <div style={{ marginTop: '25px' }}>
              <AILoadOptimizationPanel
                onOptimizationComplete={(result) => {
                  console.log('Optimization completed:', result);
                  // Could integrate with other dispatch systems here
                }}
                onAssignmentSelected={(assignment) => {
                  console.log('Assignment selected:', assignment);
                  // Could auto-fill load assignment forms here
                }}
              />
            </div>
          )}

          {selectedTab === 'ai-dock-scheduling' && (
            <div style={{ marginTop: '25px' }}>
              {/* AI Dock Scheduling Dashboard */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: '600',
                    margin: 0,
                  }}
                >
                  🏭 AI-Powered Dock Scheduling
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert('🤖 AI is analyzing dock availability and optimizing appointment times...\n\n✅ 3 bottlenecks predicted and resolved!\n📅 12 appointments optimized for maximum efficiency!');
                    }}
                  >
                    🤖 Optimize All Appointments
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert('📊 Bottleneck Analysis:\n\n🚨 High Risk:\n- Dock 3: 85% utilization (11:00 AM - 2:00 PM)\n- Dock 7: 78% utilization (2:00 PM - 4:00 PM)\n\n⚠️ Medium Risk:\n- Dock 1: 65% utilization (9:00 AM - 11:00 AM)\n\n📈 Recommendations:\n- Redistribute 3 appointments from Dock 3\n- Schedule LTL deliveries during off-peak hours');
                    }}
                  >
                    📊 Predict Bottlenecks
                  </button>
                </div>
              </div>

              {/* AI Insights Panel */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '20px',
                  marginBottom: '25px',
                }}
              >
                {/* Real-Time Dock Status */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
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
                    🏭 Real-Time Dock Status
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    {[
                      { dock: 'Dock 1', status: 'Available', utilization: 35, nextAppointment: '10:30 AM', type: 'LTL' },
                      { dock: 'Dock 2', status: 'Loading', utilization: 95, nextAppointment: 'Now', type: 'FTL' },
                      { dock: 'Dock 3', status: 'Critical', utilization: 85, nextAppointment: '11:00 AM', type: 'FTL' },
                      { dock: 'Dock 4', status: 'Available', utilization: 20, nextAppointment: '2:00 PM', type: 'LTL' },
                      { dock: 'Dock 5', status: 'Loading', utilization: 60, nextAppointment: '12:15 PM', type: 'Bulk' },
                      { dock: 'Dock 6', status: 'Available', utilization: 45, nextAppointment: '3:30 PM', type: 'FTL' }
                    ].map((dock, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          background: dock.status === 'Critical' ? 'rgba(239, 68, 68, 0.2)' :
                                     dock.status === 'Loading' ? 'rgba(245, 158, 11, 0.2)' :
                                     'rgba(16, 185, 129, 0.2)',
                          border: `1px solid ${dock.status === 'Critical' ? 'rgba(239, 68, 68, 0.4)' :
                                                dock.status === 'Loading' ? 'rgba(245, 158, 11, 0.4)' :
                                                'rgba(16, 185, 129, 0.4)'}`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          alert(`${dock.dock} Details:\n\n` +
                                `Status: ${dock.status}\n` +
                                `Utilization: ${dock.utilization}%\n` +
                                `Next: ${dock.nextAppointment}\n` +
                                `Type: ${dock.type}\n\n` +
                                `${dock.status === 'Critical' ? '🚨 AI Recommendation: Redistribute 2 appointments to Dock 1 and Dock 4' : 
                                  dock.status === 'Loading' ? '⏳ Estimated completion in 45 minutes' : 
                                  '✅ Optimal for next appointment'}`);
                        }}
                      >
                        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                          {dock.dock}
                        </div>
                        <div style={{ 
                          color: dock.status === 'Critical' ? '#ef4444' :
                                 dock.status === 'Loading' ? '#f59e0b' : '#10b981',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {dock.status}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', marginTop: '4px' }}>
                          {dock.utilization}% utilized
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px' }}>
                          Next: {dock.nextAppointment}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Optimization Stats */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
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
                    📊 AI Performance
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                      { label: 'Appointments Optimized', value: '23', change: '+12%', color: '#10b981' },
                      { label: 'Bottlenecks Prevented', value: '8', change: '+4', color: '#8b5cf6' },
                      { label: 'Average Wait Time', value: '12min', change: '-8min', color: '#06b6d4' },
                      { label: 'Dock Utilization', value: '87%', change: '+15%', color: '#f59e0b' }
                    ].map((stat, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                            {stat.label}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                            Today
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: stat.color, fontSize: '18px', fontWeight: 'bold' }}>
                            {stat.value}
                          </div>
                          <div style={{ color: '#10b981', fontSize: '11px', fontWeight: '600' }}>
                            {stat.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Smart Appointment Queue */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
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
                  📅 AI-Optimized Appointment Queue
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { 
                      time: '10:30 AM', 
                      carrier: 'Swift Transportation', 
                      load: 'FL-2025-007', 
                      dock: '1', 
                      type: 'FTL',
                      priority: 'High',
                      aiStatus: 'Optimized',
                      optimization: 'Moved from Dock 3 to reduce bottleneck'
                    },
                    { 
                      time: '11:15 AM', 
                      carrier: 'YRC Freight', 
                      load: 'FL-2025-012', 
                      dock: '4', 
                      type: 'LTL',
                      priority: 'Medium',
                      aiStatus: 'New',
                      optimization: 'AI scheduled during low-utilization window'
                    },
                    { 
                      time: '12:00 PM', 
                      carrier: 'FedEx Freight', 
                      load: 'FL-2025-015', 
                      dock: '2', 
                      type: 'Express',
                      priority: 'Urgent',
                      aiStatus: 'Priority',
                      optimization: 'Fast-tracked for time-sensitive delivery'
                    },
                    { 
                      time: '1:30 PM', 
                      carrier: 'J.B. Hunt', 
                      load: 'FL-2025-018', 
                      dock: '6', 
                      type: 'FTL',
                      priority: 'Medium',
                      aiStatus: 'Optimized',
                      optimization: 'Adjusted time to maximize dock efficiency'
                    }
                  ].map((appointment, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '100px 1fr 80px 60px 100px 120px',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        alert(`Appointment Details:\n\n` +
                              `Time: ${appointment.time}\n` +
                              `Carrier: ${appointment.carrier}\n` +
                              `Load: ${appointment.load}\n` +
                              `Dock: ${appointment.dock}\n` +
                              `Type: ${appointment.type}\n` +
                              `Priority: ${appointment.priority}\n\n` +
                              `🤖 AI Optimization: ${appointment.optimization}`);
                      }}
                    >
                      <div style={{ color: '#60a5fa', fontSize: '14px', fontWeight: 'bold' }}>
                        {appointment.time}
                      </div>
                      <div>
                        <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                          {appointment.carrier}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
                          Load: {appointment.load}
                        </div>
                      </div>
                      <div style={{ 
                        background: appointment.type === 'Express' ? 'rgba(239, 68, 68, 0.3)' :
                                   appointment.type === 'FTL' ? 'rgba(59, 130, 246, 0.3)' :
                                   'rgba(16, 185, 129, 0.3)',
                        color: appointment.type === 'Express' ? '#ef4444' :
                               appointment.type === 'FTL' ? '#60a5fa' : '#10b981',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        {appointment.type}
                      </div>
                      <div style={{ 
                        color: '#f59e0b',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textAlign: 'center'
                      }}>
                        D{appointment.dock}
                      </div>
                      <div style={{ 
                        background: appointment.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.2)' :
                                   appointment.priority === 'High' ? 'rgba(245, 158, 11, 0.2)' :
                                   'rgba(107, 114, 128, 0.2)',
                        color: appointment.priority === 'Urgent' ? '#ef4444' :
                               appointment.priority === 'High' ? '#f59e0b' : '#9ca3af',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        {appointment.priority}
                      </div>
                      <div style={{ 
                        background: appointment.aiStatus === 'Optimized' ? 'rgba(139, 92, 246, 0.2)' :
                                   appointment.aiStatus === 'Priority' ? 'rgba(239, 68, 68, 0.2)' :
                                   'rgba(16, 185, 129, 0.2)',
                        color: appointment.aiStatus === 'Optimized' ? '#8b5cf6' :
                               appointment.aiStatus === 'Priority' ? '#ef4444' : '#10b981',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textAlign: 'center'
                      }}>
                        🤖 {appointment.aiStatus}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Queue Management Actions */}
                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                  <button
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      alert('🤖 AI Auto-Scheduling Activated!\n\n✅ 5 appointments automatically rescheduled\n📊 Dock utilization optimized to 92%\n⏱️ Average wait time reduced by 18 minutes');
                    }}
                  >
                    🤖 Auto-Schedule Next 10
                  </button>
                  <button
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      alert('📱 Notifications Sent!\n\n✅ SMS sent to 12 carriers with updated appointment times\n📧 Email confirmations dispatched\n🔔 Dock teams notified of schedule changes');
                    }}
                  >
                    📱 Notify All Carriers
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'go-with-flow' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                }}
              >
                <h2
                  style={{
                    color: 'white',
                    fontSize: '22px',
                    fontWeight: '600',
                    margin: 0,
                  }}
                >
                  ⚡ Go With the Flow - Real-Time Load Matching
                </h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert(
                        'Auto-matching enabled! 🚛 FleetFlow will now automatically match urgent loads with nearby drivers.'
                      );
                    }}
                  >
                    🚛 Enable Auto-Matching
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert(
                        '📡 Refreshing online drivers... Found 24 drivers available within 50 miles.'
                      );
                    }}
                  >
                    📡 Refresh Drivers
                  </button>
                </div>
              </div>

              {/* Real-Time Matching Dashboard */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '20px',
                  marginBottom: '30px',
                }}
              >
                {/* Online Drivers Panel */}
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '2px solid rgba(16, 185, 129, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)',
                  }}
                >
                  <h3
                    style={{
                      color: '#ffffff',
                      margin: '0 0 16px 0',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(16, 185, 129, 0.8)',
                    }}
                  >
                    🟢 Online Drivers (24)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        name: 'John Rodriguez',
                        location: 'Dallas, TX',
                        distance: '12 mi',
                        status: 'Available',
                        equipment: 'Dry Van',
                      },
                      {
                        name: 'Maria Santos',
                        location: 'Houston, TX',
                        distance: '45 mi',
                        status: 'Available',
                        equipment: 'Refrigerated',
                      },
                      {
                        name: 'David Thompson',
                        location: 'Austin, TX',
                        distance: '78 mi',
                        status: 'Available',
                        equipment: 'Flatbed',
                      },
                      {
                        name: 'Lisa Chen',
                        location: 'San Antonio, TX',
                        distance: '95 mi',
                        status: 'Available',
                        equipment: 'Dry Van',
                      },
                    ].map((driver, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.2)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          padding: '12px',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: '#ffffff',
                              fontWeight: '700',
                              fontSize: '15px',
                              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            {driver.name}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '13px',
                              fontWeight: '500',
                            }}
                          >
                            {driver.location} • {driver.distance} •{' '}
                            {driver.equipment}
                          </div>
                        </div>
                        <div
                          style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                          }}
                        >
                          {driver.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Urgent Loads Panel */}
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '2px solid rgba(239, 68, 68, 0.6)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                  }}
                >
                  <h3
                    style={{
                      color: '#ffffff',
                      margin: '0 0 16px 0',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(239, 68, 68, 0.8)',
                    }}
                  >
                    🚨 Urgent Loads (8)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        id: 'FL-2401',
                        route: 'Dallas → Phoenix',
                        rate: '$2,800',
                        pickup: '2 hrs',
                        priority: 'CRITICAL',
                      },
                      {
                        id: 'FL-2402',
                        route: 'Houston → Denver',
                        rate: '$3,200',
                        pickup: '4 hrs',
                        priority: 'HIGH',
                      },
                      {
                        id: 'FL-2403',
                        route: 'Austin → Seattle',
                        rate: '$4,500',
                        pickup: '6 hrs',
                        priority: 'HIGH',
                      },
                    ].map((load, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                          border:
                            load.priority === 'CRITICAL'
                              ? '2px solid #ef4444'
                              : '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            {load.id}
                          </div>
                          <div
                            style={{
                              background:
                                load.priority === 'CRITICAL'
                                  ? '#ef4444'
                                  : '#f59e0b',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {load.priority}
                          </div>
                        </div>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                            marginBottom: '4px',
                          }}
                        >
                          {load.route}
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
                              color: '#10b981',
                              fontWeight: '600',
                              fontSize: '13px',
                            }}
                          >
                            {load.rate}
                          </span>
                          <span
                            style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '11px',
                            }}
                          >
                            Pickup in {load.pickup}
                          </span>
                        </div>
                        <button
                          style={{
                            width: '100%',
                            marginTop: '8px',
                            background:
                              'linear-gradient(135deg, #3b82f6, #2563eb)',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            alert(
                              `⚡ Broadcasting ${load.id} to 24 nearby drivers... Expected response in 2-5 minutes.`
                            );
                          }}
                        >
                          ⚡ Instant Match
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Offers Panel */}
                <div
                  style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    border: '2px solid rgba(59, 130, 246, 0.5)',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                  }}
                >
                  <h3
                    style={{
                      color: '#ffffff',
                      margin: '0 0 16px 0',
                      fontSize: '1.2rem',
                      fontWeight: '700',
                      textShadow: '0 2px 4px rgba(59, 130, 246, 0.8)',
                    }}
                  >
                    📡 Active Offers (12)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[
                      {
                        load: 'FL-2401',
                        driver: 'John Rodriguez',
                        expires: '4:32',
                        status: 'Pending',
                      },
                      {
                        load: 'FL-2402',
                        driver: 'Maria Santos',
                        expires: '2:15',
                        status: 'Viewed',
                      },
                      {
                        load: 'FL-2403',
                        driver: 'David Thompson',
                        expires: '6:45',
                        status: 'Pending',
                      },
                    ].map((offer, index) => (
                      <div
                        key={index}
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '8px',
                          }}
                        >
                          <div
                            style={{
                              color: 'white',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            {offer.load} → {offer.driver}
                          </div>
                          <div
                            style={{
                              background:
                                offer.status === 'Viewed'
                                  ? '#f59e0b'
                                  : '#6b7280',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                            }}
                          >
                            {offer.status}
                          </div>
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
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px',
                            }}
                          >
                            Expires in {offer.expires}
                          </span>
                          <button
                            style={{
                              background:
                                'linear-gradient(135deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '10px',
                              fontWeight: '600',
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              alert(`Cancelling offer for ${offer.load}...`);
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Instant Load Broadcaster */}
              <div
                style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  border: '2px solid rgba(139, 92, 246, 0.5)',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
                }}
              >
                <h3
                  style={{
                    color: '#ffffff',
                    margin: '0 0 16px 0',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(139, 92, 246, 0.8)',
                  }}
                >
                  📢 Instant Load Broadcaster
                </h3>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Load ID
                    </label>
                    <input
                      type='text'
                      placeholder='FL-2404'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1f2937',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Route
                    </label>
                    <input
                      type='text'
                      placeholder='Dallas, TX → Phoenix, AZ'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1f2937',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Rate
                    </label>
                    <input
                      type='text'
                      placeholder='$2,800'
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1f2937',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        marginBottom: '8px',
                        display: 'block',
                      }}
                    >
                      Equipment
                    </label>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid rgba(255, 255, 255, 0.4)',
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#1f2937',
                        fontSize: '14px',
                        fontWeight: '500',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <option value='dry-van'>Dry Van</option>
                      <option value='refrigerated'>Refrigerated</option>
                      <option value='flatbed'>Flatbed</option>
                      <option value='step-deck'>Step Deck</option>
                    </select>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'space-between',
                  }}
                >
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert(
                        '⚡ Broadcasting load to 24 online drivers within 50 miles... Drivers will receive instant notifications on their mobile apps.'
                      );
                    }}
                  >
                    ⚡ Broadcast Now
                  </button>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    onClick={() => {
                      alert(
                        '🤖 AI is analyzing driver performance, location, equipment, and preferences to find the best matches...'
                      );
                    }}
                  >
                    🤖 AI Match
                  </button>
                </div>
              </div>

              {/* Real-Time Activity Feed */}
              <div
                style={{
                  background: 'rgba(34, 197, 94, 0.2)',
                  border: '2px solid rgba(34, 197, 94, 0.5)',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.15)',
                }}
              >
                <h3
                  style={{
                    color: '#ffffff',
                    margin: '0 0 16px 0',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    textShadow: '0 2px 4px rgba(34, 197, 94, 0.8)',
                  }}
                >
                  📈 Real-Time Activity Feed
                </h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {[
                    {
                      time: '2:34 PM',
                      action: '✅ John Rodriguez accepted FL-2401 ($2,800)',
                      type: 'success',
                    },
                    {
                      time: '2:32 PM',
                      action: '📡 FL-2401 broadcasted to 12 nearby drivers',
                      type: 'info',
                    },
                    {
                      time: '2:31 PM',
                      action: '⚡ Auto-match triggered for urgent load FL-2401',
                      type: 'warning',
                    },
                    {
                      time: '2:29 PM',
                      action: '🚛 Maria Santos came online in Houston area',
                      type: 'info',
                    },
                    {
                      time: '2:27 PM',
                      action: '❌ David Thompson declined FL-2399',
                      type: 'error',
                    },
                    {
                      time: '2:25 PM',
                      action: '✅ Lisa Chen accepted FL-2398 ($3,400)',
                      type: 'success',
                    },
                    {
                      time: '2:23 PM',
                      action: '📡 FL-2398 broadcasted to 8 nearby drivers',
                      type: 'info',
                    },
                    {
                      time: '2:21 PM',
                      action: '🤖 AI recommended premium rate for FL-2398',
                      type: 'warning',
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom:
                          index < 7
                            ? '1px solid rgba(255, 255, 255, 0.1)'
                            : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background:
                            activity.type === 'success'
                              ? '#22c55e'
                              : activity.type === 'error'
                                ? '#ef4444'
                                : activity.type === 'warning'
                                  ? '#f59e0b'
                                  : '#3b82f6',
                          marginRight: '12px',
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '12px',
                          }}
                        >
                          {activity.time}
                        </div>
                        <div style={{ color: 'white', fontSize: '14px' }}>
                          {activity.action}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketplace Loads - Dispatch Support */}
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '20px',
                  marginTop: '20px',
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
                  <div>
                    <h3
                      style={{
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      🎯 Marketplace Loads - Dispatch Support
                    </h3>
                    <p
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '14px',
                        margin: 0,
                      }}
                    >
                      Monitor and support marketplace bidding operations from Go
                      with the Flow
                    </p>
                  </div>
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.3)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      color: '#10b981',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    {goWithFlowData.wonMarketplaceLoads.length} Active
                    Marketplace Loads
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '20px',
                  }}
                >
                  {/* Left Column - Active Marketplace Loads */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      📋 Won Marketplace Bids
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      {goWithFlowData.wonMarketplaceLoads.map((load, index) => {
                        const assignedDriver = goWithFlowData.drivers.find(
                          (d) => d.id === load.assignedDriverId
                        );
                        const driverName = assignedDriver
                          ? assignedDriver.name
                          : 'Unassigned';
                        const routeText = `${load.origin.address.split(',')[0]} → ${load.destination.address.split(',')[0]}`;
                        const statusText =
                          load.status === 'accepted'
                            ? 'Pickup Scheduled'
                            : load.status === 'in-transit'
                              ? 'In Transit'
                              : load.status === 'offered'
                                ? 'Driver Accepting'
                                : 'Active';
                        const dispatchNote = `5% marketplace fee - Rate: $${load.rate}`;

                        return (
                          <div
                            key={load.id}
                            style={{
                              background: 'rgba(255, 255, 255, 0.08)',
                              borderRadius: '8px',
                              padding: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '4px',
                              }}
                            >
                              <span
                                style={{
                                  color: '#10b981',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                }}
                              >
                                {load.id}
                              </span>
                              <span
                                style={{
                                  background:
                                    statusText === 'In Transit'
                                      ? '#3b82f6'
                                      : '#f59e0b',
                                  color: 'white',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  fontWeight: '600',
                                }}
                              >
                                {statusText}
                              </span>
                            </div>
                            <div
                              style={{
                                color: 'white',
                                fontSize: '13px',
                                marginBottom: '2px',
                              }}
                            >
                              <strong>{driverName}</strong> • {routeText}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '11px',
                                marginBottom: '4px',
                              }}
                            >
                              Won Bid: ${load.rate}
                            </div>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: '11px',
                                fontStyle: 'italic',
                              }}
                            >
                              📝 {dispatchNote}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column - Dispatch Actions */}
                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <h4
                      style={{
                        color: 'white',
                        fontSize: '16px',
                        fontWeight: '600',
                        marginBottom: '12px',
                      }}
                    >
                      🎛️ Dispatch Actions
                    </h4>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '16px',
                      }}
                    >
                      <button
                        style={{
                          background: 'rgba(34, 197, 94, 0.8)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        📞 Contact All Marketplace Drivers
                      </button>
                      <button
                        style={{
                          background: 'rgba(59, 130, 246, 0.8)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        🗺️ View All Marketplace Load Tracking
                      </button>
                      <button
                        style={{
                          background: 'rgba(245, 158, 11, 0.8)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        🚨 Send Support Alert to Drivers
                      </button>
                      <button
                        style={{
                          background: 'rgba(16, 185, 129, 0.8)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onClick={() =>
                          window.open('/go-with-the-flow', '_blank')
                        }
                      >
                        🎯 View Go with the Flow System
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          fontSize: '11px',
                        }}
                      >
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Total Marketplace Revenue:
                        </div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>
                          ${goWithFlowData.marketplaceRevenue.toLocaleString()}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Active Bidding Loads:
                        </div>
                        <div style={{ color: '#3b82f6', fontWeight: '600' }}>
                          {
                            goWithFlowData.marketplaceMetrics
                              .externalBidsSubmitted
                          }{' '}
                          loads
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          Driver Response Rate:
                        </div>
                        <div style={{ color: '#10b981', fontWeight: '600' }}>
                          {goWithFlowData.driverResponseRate}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketplace Activity Feed */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <h4
                    style={{
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      marginBottom: '12px',
                    }}
                  >
                    📡 Live Marketplace Activity
                  </h4>
                  <div
                    style={{
                      maxHeight: '120px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    {goWithFlowData.activityFeed
                      .slice(0, 10)
                      .map((activity, index) => {
                        const timestamp = new Date(
                          Date.now() - index * 60000 * 3
                        ).toLocaleTimeString('en-US', {
                          hour12: false,
                          hour: '2-digit',
                          minute: '2-digit',
                        });

                        return (
                          <div
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              padding: '6px 8px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '6px',
                              fontSize: '12px',
                            }}
                          >
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 0.5)',
                                minWidth: '40px',
                                marginRight: '8px',
                              }}
                            >
                              {timestamp}
                            </span>
                            <span
                              style={{
                                color: 'rgba(255, 255, 255, 0.9)',
                                flex: 1,
                              }}
                            >
                              {activity}
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'task-priority' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                🎯 AI-Powered Task Prioritization
              </h2>
              <DispatchTaskPrioritizationPanel />
            </div>
          )}

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

              {/* Enhanced Completed Loads & Invoice Tracking Section */}
              <CompletedLoadsInvoiceTracker
                loads={completedLoads}
                onViewInvoice={handleViewInvoice}
                onCreateInvoice={handleCreateInvoiceFromLoad}
                onResendInvoice={handleResendInvoice}
                onMarkPaid={handleMarkPaid}
                onViewDocuments={handleViewDocuments}
              />
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
                  🗺️ Live Fleet Tracking
                </h2>
              </div>
              <div
                style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '20px',
                  padding: '30px',
                  minHeight: '400px',
                }}
              >
                <UnifiedLiveTrackingWorkflow />
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
                🔄 Go With The Flow - Workflow Center
              </h2>
            </div>
          )}

          {selectedTab === 'compliance' && (
            <div>
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                📱 Driver OpenELD Compliance Monitoring
              </h2>
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
                🧾 Invoice Management
              </h2>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
