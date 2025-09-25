'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import AILoadOptimizationPanel from '../components/AILoadOptimizationPanel';
import CompletedLoadsInvoiceTracker from '../components/CompletedLoadsInvoiceTracker';
import DispatchTaskPrioritizationPanel from '../components/DispatchTaskPrioritizationPanel';
import DocumentsPortalButton from '../components/DocumentsPortalButton';

import DispatchGettingStarted from '../components/DispatchGettingStarted';
import UnifiedLiveTrackingWorkflow from '../components/UnifiedLiveTrackingWorkflow';
import UnifiedNotificationBell from '../components/UnifiedNotificationBell';
import { getCurrentUser } from '../config/access';
import { schedulingService } from '../scheduling/service';
import { brokerAgentIntegrationService } from '../services/BrokerAgentIntegrationService';
import GoWithFlowAutomationService from '../services/GoWithFlowAutomationService';
import { goWithTheFlowService } from '../services/GoWithTheFlowService';
import { getAllInvoices, getInvoiceStats } from '../services/invoiceService';
import { Load } from '../services/loadService';
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

// Dispatcher profile
const dispatcher: DispatcherProfile = {
  id: '',
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  experience: '',
  activeLoads: 0,
  completedLoads: 0,
  efficiency: 0,
  avgResponseTime: '0 min',
};

// Notifications
const mockNotifications: Notification[] = [];

// Compliance data for drivers
const mockComplianceData: ComplianceStatus[] = [];

// Drivers currently on the road
const driversOnTheRoad = [];

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
  const [selectedTab, setSelectedTab] = useState('my-loads');
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
    console.info(
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
    const initializeData = async () => {
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
        // For dispatch agents: Only show loads assigned to this specific agent
        // Get agent loads from brokerage system (filtered by current agent)
        const agentLoads = brokerAgentIntegrationService.getLoadsForDispatch();

        // Filter to only loads assigned to this specific agent
        const myAgentLoads = agentLoads.filter(
          (load) =>
            load.agentId === currentUser.id ||
            load.agentName === currentUser.name
        );

        // Convert agent loads to standard Load format
        const convertedAgentLoads: Load[] = myAgentLoads.map((agentLoad) => ({
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

        setLoads(convertedAgentLoads);

        // Agent-specific statistics (only their assigned loads)
        const agentLoadStats = {
          total: myAgentLoads.length,
          available: myAgentLoads.filter((l) => l.status === 'Available')
            .length,
          assigned: myAgentLoads.filter((l) => l.status === 'Assigned').length,
          inTransit: myAgentLoads.filter((l) => l.status === 'In Transit')
            .length,
          delivered: myAgentLoads.filter((l) => l.status === 'Delivered')
            .length,
          broadcasted: myAgentLoads.filter((l) => l.status === 'Broadcasted')
            .length,
          driverSelected: myAgentLoads.filter(
            (l) => l.status === 'Driver Selected'
          ).length,
          orderSent: myAgentLoads.filter((l) => l.status === 'Order Sent')
            .length,
          unassigned: myAgentLoads.filter((l) => l.status === 'Unassigned')
            .length,
        };
        setStats(agentLoadStats);

        // Load invoices
        const allInvoices = getAllInvoices();
        setInvoices(allInvoices);

        const stats = getInvoiceStats();
        setInvoiceStats(stats);

        console.info(
          `👤 Dispatcher Portal: Loaded ${myAgentLoads.length} agent loads for ${currentUser.name}`
        );

        // Populate completed loads for invoice tracking
        const completedLoadsData = convertedAgentLoads
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
    };

    initializeData();
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

  const sampleLoads = [];

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
            👤 DISPATCHER AGENT PORTAL
          </h1>

          {/* Agent Name Plate */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '12px 20px',
              marginTop: '15px',
              marginBottom: '10px',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>👨‍💼</span>
              <span>Agent: {user?.name || 'John Smith'}</span>
            </div>
          </div>

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

        {/* Getting Started Workflow */}
        <DispatchGettingStarted
          onStepClick={(stepId, tab) => {
            if (tab) {
              setSelectedTab(tab);
              // Scroll to the relevant section
              setTimeout(() => {
                const element = document.getElementById(`tab-${tab}`);
                if (element) {
                  element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }
              }, 100);
            }
          }}
        />

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
              { id: 'my-loads', label: '📋 My Loads', icon: '📋' },
              { id: 'tracking', label: '🗺️ Live Tracking', icon: '🗺️' },
              { id: 'tasks', label: '✅ My Tasks', icon: '✅' },
              { id: 'workflow', label: '🔄 Workflow', icon: '🔄' },
              { id: 'performance', label: '📈 My Performance', icon: '📈' },
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
          {selectedTab === 'my-loads' && (
            <div id='tab-my-loads'>
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                📋 My Assigned Loads
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
                    trend: '+0%',
                    icon: '📋',
                  },
                  {
                    title: 'Available Loads',
                    value: stats.available,
                    color: '#10b981',
                    bgGradient: 'linear-gradient(135deg, #10b981, #059669)',
                    trend: '+0%',
                    icon: '✅',
                  },
                  {
                    title: 'Assigned Loads',
                    value: stats.assigned,
                    color: '#f59e0b',
                    bgGradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    trend: '+0%',
                    icon: '👤',
                  },
                  {
                    title: 'In Transit',
                    value: stats.inTransit,
                    color: '#8b5cf6',
                    bgGradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    trend: '+0%',
                    icon: '🚛',
                  },
                  {
                    title: 'Delivered',
                    value: stats.delivered,
                    color: '#059669',
                    bgGradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    trend: '+0%',
                    icon: '✅',
                  },
                  {
                    title: 'Unassigned',
                    value: stats.unassigned,
                    color: '#ef4444',
                    bgGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    trend: '+0%',
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
                  console.info('Optimization completed:', result);
                  // Could integrate with other dispatch systems here
                }}
                onAssignmentSelected={(assignment) => {
                  console.info('Assignment selected:', assignment);
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
                      alert(
                        '🤖 AI dock optimization ready.\n\nNo appointments to optimize at this time.'
                      );
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
                      alert(
                        '📊 Bottleneck Analysis:\n\nNo bottlenecks detected.\nAll dock utilization is optimal.'
                      );
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
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '12px',
                    }}
                  >
                    {[].map((dock, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '12px',
                          background:
                            dock.status === 'Critical'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : dock.status === 'Loading'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                          border: `1px solid ${
                            dock.status === 'Critical'
                              ? 'rgba(239, 68, 68, 0.4)'
                              : dock.status === 'Loading'
                                ? 'rgba(245, 158, 11, 0.4)'
                                : 'rgba(16, 185, 129, 0.4)'
                          }`,
                          borderRadius: '8px',
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          alert(
                            `${dock.dock} Details:\n\n` +
                              `Status: ${dock.status}\n` +
                              `Utilization: ${dock.utilization}%\n` +
                              `Next: ${dock.nextAppointment}\n` +
                              `Type: ${dock.type}\n\n` +
                              `${
                                dock.status === 'Critical'
                                  ? '🚨 AI Recommendation: Redistribute 2 appointments to Dock 1 and Dock 4'
                                  : dock.status === 'Loading'
                                    ? '⏳ Estimated completion in 45 minutes'
                                    : '✅ Optimal for next appointment'
                              }`
                          );
                        }}
                      >
                        <div
                          style={{
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px',
                          }}
                        >
                          {dock.dock}
                        </div>
                        <div
                          style={{
                            color:
                              dock.status === 'Critical'
                                ? '#ef4444'
                                : dock.status === 'Loading'
                                  ? '#f59e0b'
                                  : '#10b981',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {dock.status}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.8)',
                            fontSize: '11px',
                            marginTop: '4px',
                          }}
                        >
                          {dock.utilization}% utilized
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '10px',
                          }}
                        >
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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    {[
                      {
                        label: 'Appointments Optimized',
                        value: '0',
                        change: '+0%',
                        color: '#10b981',
                      },
                      {
                        label: 'Bottlenecks Prevented',
                        value: '0',
                        change: '+0',
                        color: '#8b5cf6',
                      },
                      {
                        label: 'Average Wait Time',
                        value: '0min',
                        change: '0min',
                        color: '#06b6d4',
                      },
                      {
                        label: 'Dock Utilization',
                        value: '0%',
                        change: '+0%',
                        color: '#f59e0b',
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              color: 'white',
                              fontSize: '14px',
                              fontWeight: '600',
                            }}
                          >
                            {stat.label}
                          </div>
                          <div
                            style={{
                              color: 'rgba(255,255,255,0.7)',
                              fontSize: '12px',
                            }}
                          >
                            Today
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              color: stat.color,
                              fontSize: '18px',
                              fontWeight: 'bold',
                            }}
                          >
                            {stat.value}
                          </div>
                          <div
                            style={{
                              color: '#10b981',
                              fontSize: '11px',
                              fontWeight: '600',
                            }}
                          >
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {[].map((appointment, index) => (
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
                        alert(
                          `Appointment Details:\n\n` +
                            `Time: ${appointment.time}\n` +
                            `Carrier: ${appointment.carrier}\n` +
                            `Load: ${appointment.load}\n` +
                            `Dock: ${appointment.dock}\n` +
                            `Type: ${appointment.type}\n` +
                            `Priority: ${appointment.priority}\n\n` +
                            `🤖 AI Optimization: ${appointment.optimization}`
                        );
                      }}
                    >
                      <div
                        style={{
                          color: '#60a5fa',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {appointment.time}
                      </div>
                      <div>
                        <div
                          style={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: '600',
                          }}
                        >
                          {appointment.carrier}
                        </div>
                        <div
                          style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '12px',
                          }}
                        >
                          Load: {appointment.load}
                        </div>
                      </div>
                      <div
                        style={{
                          background:
                            appointment.type === 'Express'
                              ? 'rgba(239, 68, 68, 0.3)'
                              : appointment.type === 'FTL'
                                ? 'rgba(59, 130, 246, 0.3)'
                                : 'rgba(16, 185, 129, 0.3)',
                          color:
                            appointment.type === 'Express'
                              ? '#ef4444'
                              : appointment.type === 'FTL'
                                ? '#60a5fa'
                                : '#10b981',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        {appointment.type}
                      </div>
                      <div
                        style={{
                          color: '#f59e0b',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        D{appointment.dock}
                      </div>
                      <div
                        style={{
                          background:
                            appointment.priority === 'Urgent'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : appointment.priority === 'High'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)',
                          color:
                            appointment.priority === 'Urgent'
                              ? '#ef4444'
                              : appointment.priority === 'High'
                                ? '#f59e0b'
                                : '#9ca3af',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        {appointment.priority}
                      </div>
                      <div
                        style={{
                          background:
                            appointment.aiStatus === 'Optimized'
                              ? 'rgba(139, 92, 246, 0.2)'
                              : appointment.aiStatus === 'Priority'
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                          color:
                            appointment.aiStatus === 'Optimized'
                              ? '#8b5cf6'
                              : appointment.aiStatus === 'Priority'
                                ? '#ef4444'
                                : '#10b981',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        🤖 {appointment.aiStatus}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Queue Management Actions */}
                <div
                  style={{ marginTop: '15px', display: 'flex', gap: '10px' }}
                >
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
                      alert(
                        '🤖 AI Auto-Scheduling Ready.\n\nNo appointments to reschedule at this time.'
                      );
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
                      alert(
                        '📱 Notification System Ready.\n\nNo notifications to send at this time.'
                      );
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
                        '📡 Driver refresh complete.\n\nNo drivers found at this time.'
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
                    🟢 Online Drivers ({goWithFlowData.drivers.length})
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[].map((driver, index) => (
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
                    🚨 Urgent Loads (
                    {
                      goWithFlowData.loads.filter(
                        (load) =>
                          load.priority === 'URGENT' ||
                          load.priority === 'CRITICAL'
                      ).length
                    }
                    )
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[].map((load, index) => (
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
                              `⚡ Broadcasting ready.\n\nNo drivers found to broadcast to.`
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
                    📡 Active Offers (0)
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {[].map((offer, index) => (
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
                      placeholder='Load ID'
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
                      placeholder='Origin → Destination'
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
                      placeholder='Rate'
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
                        '⚡ Broadcasting ready. No drivers found to broadcast to at this time.'
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
                        '🤖 AI driver matching ready.\n\nNo drivers or loads to match at this time.'
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
                  {[].map((activity, index) => (
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
            <div id='tab-loads'>
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
            <div id='tab-tracking'>
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
            <div id='tab-compliance'>
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

          {/* My Tasks Tab */}
          {selectedTab === 'tasks' && (
            <div id='tab-tasks'>
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                ✅ My Daily Tasks
              </h2>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '15px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  padding: '20px',
                }}
              >
                <h3 style={{ color: 'white', marginBottom: '15px' }}>
                  Today's Priority Tasks
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {loads
                    .filter((load) => load.status !== 'Delivered')
                    .map((load, index) => (
                      <div
                        key={load.id}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '8px',
                          padding: '15px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
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
                            <strong style={{ color: 'white' }}>
                              Load {load.loadBoardNumber}
                            </strong>
                            <div
                              style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '14px',
                              }}
                            >
                              {load.origin} → {load.destination}
                            </div>
                          </div>
                          <div
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              background:
                                load.status === 'Assigned'
                                  ? '#10b981'
                                  : '#f59e0b',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: 'bold',
                            }}
                          >
                            {load.status}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* My Performance Tab */}
          {selectedTab === 'performance' && (
            <div id='tab-performance'>
              <h2
                style={{
                  color: 'white',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  marginBottom: '15px',
                }}
              >
                📈 My Performance
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                    📋
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {loads.filter((l) => l.status === 'Delivered').length}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Loads Completed
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                    🚛
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {loads.filter((l) => l.status === 'In Transit').length}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Active Loads
                  </div>
                </div>

                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '15px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                    ⭐
                  </div>
                  <div
                    style={{
                      color: 'white',
                      fontSize: '24px',
                      fontWeight: 'bold',
                    }}
                  >
                    {loads.filter((l) => l.status === 'Assigned').length}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Pending Assignments
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
