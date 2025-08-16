'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ClearinghouseStatus from '../components/compliance/ClearinghouseStatus';
import LIInsuranceCard from '../components/compliance/LIInsuranceCard';
import SAFERStatusCard from '../components/compliance/SAFERStatusCard';

interface ComplianceMetric {
  label: string;
  value: string;
  status: 'compliant' | 'warning' | 'critical';
  icon: string;
  description: string;
}

interface ComplianceAlert {
  id: string;
  type: 'expiring' | 'expired' | 'violation' | 'warning';
  title: string;
  description: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface DOTComplianceData {
  carrierId: string;
  dotNumber: string;
  companyName: string;
  safetyRating: 'SATISFACTORY' | 'CONDITIONAL' | 'UNSATISFACTORY' | 'NOT_RATED';
  complianceScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  activeViolations: any[] | number; // Can be array of violations or number
  expiredDocuments?: number;
  driversNeedingAttention?: number;
  vehiclesNeedingInspection?: number;
  // Additional properties from API
  mcNumber?: string;
  powerUnits?: number;
  drivers?: number;
  lastAuditDate?: string;
  nextAuditDue?: string;
  correctedViolations?: any[];
  insuranceStatus?: string;
  mcAuthority?: string;
  requiredDocuments?: any[];
  // Alerts from API response
  alerts?: {
    critical?: string[];
    warnings?: string[];
    upcoming?: string[];
  };
}

export default function CompliancePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    | 'overview'
    | 'vehicles'
    | 'drivers'
    | 'operations'
    | 'clearinghouse'
    | 'safer'
    | 'insurance'
  >('overview');
  const [complianceData, setComplianceData] =
    useState<DOTComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dotNumberSearch, setDotNumberSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load real compliance data
  const fetchComplianceData = async (dotNumber?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/dot/compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getProfile',
          dotNumber: dotNumber || '123456', // Default DOT number for demo
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compliance data');
      }

      const result = await response.json();

      if (result.success) {
        setComplianceData({
          ...result.profile,
          alerts: result.alerts,
        });
      } else {
        throw new Error(result.error || 'Failed to load compliance data');
      }
    } catch (err) {
      console.error('Compliance data fetch error:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to load compliance data'
      );

      // Fallback to mock data for demo
      setComplianceData({
        carrierId: 'CARR-001',
        dotNumber: dotNumber || '123456',
        companyName: 'FleetFlow Transportation LLC',
        safetyRating: 'SATISFACTORY',
        complianceScore: 94,
        riskLevel: 'LOW',
        activeViolations: 2,
        expiredDocuments: 1,
        driversNeedingAttention: 3,
        vehiclesNeedingInspection: 2,
        alerts: {
          critical: ['Mock critical alert'],
          warnings: ['Mock warning alert'],
          upcoming: ['Mock upcoming alert'],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Load compliance data on component mount
  useEffect(() => {
    fetchComplianceData();
  }, []);

  // Generate compliance metrics from real data
  const generateComplianceMetrics = (): ComplianceMetric[] => {
    if (!complianceData) return [];

    // Safely extract metrics from the actual data structure
    const complianceScore = complianceData.complianceScore || 0;
    const safetyRating = complianceData.safetyRating || 'NOT_RATED';

    // Format safety rating for display
    const safetyRatingDisplay =
      safetyRating === 'SATISFACTORY'
        ? 'Satisfactory'
        : safetyRating === 'CONDITIONAL'
          ? 'Conditional'
          : safetyRating === 'UNSATISFACTORY'
            ? 'Unsatisfactory'
            : safetyRating === 'NOT_RATED'
              ? 'Not Rated'
              : safetyRating;

    // Calculate safety rating status
    const safetyRatingStatus =
      safetyRating === 'SATISFACTORY'
        ? 'compliant'
        : safetyRating === 'CONDITIONAL'
          ? 'warning'
          : 'critical';
    const activeViolations = Array.isArray(complianceData.activeViolations)
      ? complianceData.activeViolations.length
      : complianceData.activeViolations || 0;

    // Calculate expired documents from requiredDocuments array
    const expiredDocuments = complianceData.requiredDocuments
      ? complianceData.requiredDocuments.filter(
          (doc) => doc.status !== 'CURRENT'
        ).length
      : 0;

    // Calculate drivers needing attention from alerts (look for driver-related alerts)
    const driversNeedingAttention = complianceData.alerts
      ? [
          ...(complianceData.alerts.critical || []),
          ...(complianceData.alerts.warnings || []),
        ].filter((alert) => alert.toLowerCase().includes('driver')).length
      : 0;

    // Calculate vehicles needing inspection from alerts (look for vehicle-related alerts)
    const vehiclesNeedingInspection = complianceData.alerts
      ? [
          ...(complianceData.alerts.critical || []),
          ...(complianceData.alerts.warnings || []),
        ].filter(
          (alert) =>
            alert.toLowerCase().includes('vehicle') ||
            alert.toLowerCase().includes('inspection')
        ).length
      : 0;

    return [
      {
        label: 'Overall Compliance Score',
        value: `${complianceScore}%`,
        status:
          complianceScore >= 90
            ? 'compliant'
            : complianceScore >= 70
              ? 'warning'
              : 'critical',
        icon: '✅',
        description: 'Fleet-wide compliance rating',
      },
      {
        label: 'Safety Rating',
        value: safetyRatingDisplay,
        status: safetyRatingStatus,
        icon: '🛡️',
        description: 'DOT safety rating status',
      },
      {
        label: 'Active Violations',
        value: activeViolations.toString(),
        status:
          activeViolations === 0
            ? 'compliant'
            : activeViolations <= 2
              ? 'warning'
              : 'critical',
        icon: '⚠️',
        description: 'Current compliance violations',
      },
      {
        label: 'Expired Documents',
        value: expiredDocuments.toString(),
        status:
          expiredDocuments === 0
            ? 'compliant'
            : expiredDocuments <= 1
              ? 'warning'
              : 'critical',
        icon: '📄',
        description: 'Documents requiring renewal',
      },
      {
        label: 'Drivers Needing Attention',
        value: driversNeedingAttention.toString(),
        status:
          driversNeedingAttention === 0
            ? 'compliant'
            : driversNeedingAttention <= 2
              ? 'warning'
              : 'critical',
        icon: '👤',
        description: 'Drivers with compliance issues',
      },
      {
        label: 'Vehicle Inspections Due',
        value: vehiclesNeedingInspection.toString(),
        status:
          vehiclesNeedingInspection === 0
            ? 'compliant'
            : vehiclesNeedingInspection <= 1
              ? 'warning'
              : 'critical',
        icon: '🚛',
        description: 'Vehicles requiring inspection',
      },
    ];
  };

  const complianceMetrics = generateComplianceMetrics();

  // Generate real-time compliance alerts
  const generateComplianceAlerts = (): ComplianceAlert[] => {
    if (!complianceData) return [];

    const alerts: ComplianceAlert[] = [];

    // Use the same safe data extraction as in generateComplianceMetrics
    const activeViolations = Array.isArray(complianceData.activeViolations)
      ? complianceData.activeViolations.length
      : complianceData.activeViolations || 0;

    // Calculate expired documents from requiredDocuments array
    const expiredDocuments = complianceData.requiredDocuments
      ? complianceData.requiredDocuments.filter(
          (doc) => doc.status !== 'CURRENT'
        ).length
      : 0;

    // Calculate drivers needing attention from alerts (look for driver-related alerts)
    const driversNeedingAttention = complianceData.alerts
      ? [
          ...(complianceData.alerts.critical || []),
          ...(complianceData.alerts.warnings || []),
        ].filter((alert) => alert.toLowerCase().includes('driver')).length
      : 0;

    // Calculate vehicles needing inspection from alerts (look for vehicle-related alerts)
    const vehiclesNeedingInspection = complianceData.alerts
      ? [
          ...(complianceData.alerts.critical || []),
          ...(complianceData.alerts.warnings || []),
        ].filter(
          (alert) =>
            alert.toLowerCase().includes('vehicle') ||
            alert.toLowerCase().includes('inspection')
        ).length
      : 0;

    if (activeViolations > 0) {
      alerts.push({
        id: 'violations-alert',
        type: 'violation',
        title: 'Active Violations Require Attention',
        description: `${activeViolations} active violations need immediate resolution`,
        dueDate: 'ASAP',
        priority: 'high',
      });
    }

    if (expiredDocuments > 0) {
      alerts.push({
        id: 'expired-docs-alert',
        type: 'expired',
        title: 'Expired Documents',
        description: `${expiredDocuments} documents have expired and need renewal`,
        dueDate: 'Overdue',
        priority: 'high',
      });
    }

    if (driversNeedingAttention > 0) {
      alerts.push({
        id: 'drivers-alert',
        type: 'warning',
        title: 'Driver Compliance Issues',
        description: `${driversNeedingAttention} drivers require compliance attention`,
        dueDate: 'Within 7 days',
        priority: 'medium',
      });
    }

    if (vehiclesNeedingInspection > 0) {
      alerts.push({
        id: 'vehicle-inspection-alert',
        type: 'expiring',
        title: 'Vehicle Inspections Due',
        description: `${vehiclesNeedingInspection} vehicles need inspection`,
        dueDate: 'Within 30 days',
        priority: 'medium',
      });
    }

    return alerts;
  };

  const complianceAlerts = generateComplianceAlerts();

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchComplianceData(complianceData?.dotNumber);
    setRefreshing(false);
  };

  const handleDOTSearch = async () => {
    if (!dotNumberSearch.trim()) return;
    await fetchComplianceData(dotNumberSearch);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'violation':
        return '🚨';
      case 'expired':
        return '⏰';
      case 'expiring':
        return '⚠️';
      case 'warning':
        return '⚡';
      default:
        return '📋';
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'LOW':
        return '#10b981';
      case 'MEDIUM':
        return '#f59e0b';
      case 'HIGH':
        return '#ef4444';
      case 'CRITICAL':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  // Navigation categories
  const categories = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'vehicles', label: 'Vehicles', icon: '🚛' },
    { id: 'drivers', label: 'Drivers', icon: '👤' },
    { id: 'operations', label: 'Operations', icon: '⚙️' },
    { id: 'clearinghouse', label: 'Clearinghouse', icon: '🏛️' },
    { id: 'safer', label: 'SAFER', icon: '🛡️' },
    { id: 'insurance', label: 'Insurance', icon: '🏥' },
  ];

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: `
          linear-gradient(135deg, #4c1d1d 0%, #3c1515 25%, #5c2424 50%, #3c1515 75%, #2c1111 100%),
          radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.06) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.04) 0%, transparent 50%)
        `,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '80px',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '40px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>
            Loading Compliance Data...
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Fetching real-time compliance information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: `
        linear-gradient(135deg, #4c1d1d 0%, #3c1515 25%, #5c2424 50%, #3c1515 75%, #2c1111 100%),
        radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(220, 38, 38, 0.04) 0%, transparent 50%),
        radial-gradient(circle at 40% 60%, rgba(185, 28, 28, 0.03) 0%, transparent 50%)
      `,
        backgroundSize: '100% 100%, 800px 800px, 600px 600px, 400px 400px',
        backgroundPosition: '0 0, 0 0, 100% 100%, 50% 50%',
        backgroundAttachment: 'fixed',
        paddingTop: '80px',
        position: 'relative',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '20px',
        }}
      >
        {/* Enhanced Header with Real-Time Data */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div
                style={{
                  padding: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '32px' }}>✅</span>
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
                  Compliance Dashboard
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    margin: '0 0 4px 0',
                  }}
                >
                  DOT, FMCSA, and safety compliance monitoring
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(139, 92, 246, 0.9)',
                    margin: '0 0 8px 0',
                    fontWeight: '600',
                  }}
                >
                  🛡️ Powered by FACIS™ (FleetGuard Advanced Carrier
                  Intelligence System)
                </p>
                {complianceData && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.8)',
                    }}
                  >
                    <span>DOT: {complianceData.dotNumber}</span>
                    <span>•</span>
                    <span>{complianceData.companyName}</span>
                    <span>•</span>
                    <span
                      style={{
                        color: getRiskLevelColor(complianceData.riskLevel),
                      }}
                    >
                      Risk Level: {complianceData.riskLevel}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                href='/notifications'
                style={{
                  textDecoration: 'none',
                  color: '#d97706',
                  fontSize: '14px',
                  fontWeight: '600',
                  padding: '12px 24px',
                  border: '2px solid #f59e0b',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  background:
                    'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1))',
                  boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
                }}
              >
                🔔 Notification Hub
              </Link>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  cursor: refreshing ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  opacity: refreshing ? 0.7 : 1,
                }}
              >
                {refreshing ? '🔄 Refreshing...' : '🔄 Refresh'}
              </button>
            </div>
          </div>

          {/* DOT Number Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '20px',
            }}
          >
            <input
              type='text'
              placeholder='Enter DOT Number to search...'
              value={dotNumberSearch}
              onChange={(e) => setDotNumberSearch(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '14px',
              }}
            />
            <button
              onClick={handleDOTSearch}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
              }}
            >
              🔍 Search
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                padding: '12px',
                color: '#fee2e2',
                fontSize: '14px',
                marginBottom: '20px',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Enhanced Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background:
                    selectedCategory === category.id
                      ? 'rgba(255, 255, 255, 0.12)'
                      : 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview View - Enhanced with Real Data */}
        {selectedCategory === 'overview' && (
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
          >
            {/* Compliance Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {complianceMetrics.map((metric, index) => {
                const statusColor = getStatusColor(metric.status);
                return (
                  <div
                    key={index}
                    style={{
                      background: `${statusColor}20`,
                      border: `1px solid ${statusColor}40`,
                      borderRadius: '8px',
                      padding: '16px',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        color: statusColor,
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                      }}
                    >
                      {metric.value}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '12px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {metric.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compliance Alerts */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                }}
              >
                <h3
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: '600',
                    margin: 0,
                  }}
                >
                  Compliance Alerts & Actions Required
                </h3>
                <Link href='/notes' style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid rgba(251, 191, 36, 0.3)',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  >
                    🔔 Notification Hub
                  </button>
                </Link>
              </div>

              {complianceAlerts.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255, 255, 255, 0.7)',
                    padding: '40px',
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                    ✅
                  </div>
                  <div>All compliance requirements are up to date!</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {complianceAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '12px',
                        padding: '20px',
                        border: `1px solid ${getPriorityColor(alert.priority)}30`,
                        borderLeft: `4px solid ${getPriorityColor(alert.priority)}`,
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
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              marginBottom: '8px',
                            }}
                          >
                            <span style={{ fontSize: '24px' }}>
                              {getAlertIcon(alert.type)}
                            </span>
                            <h4
                              style={{
                                color: 'white',
                                fontSize: '18px',
                                fontWeight: '600',
                                margin: 0,
                              }}
                            >
                              {alert.title}
                            </h4>
                          </div>
                          <p
                            style={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '14px',
                              margin: '0 0 8px 0',
                            }}
                          >
                            {alert.description}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '12px',
                                color: 'rgba(255, 255, 255, 0.7)',
                              }}
                            >
                              Due: {alert.dueDate}
                            </span>
                            <span
                              style={{
                                background: getPriorityColor(alert.priority),
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '600',
                              }}
                            >
                              {alert.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <button
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clearinghouse View - Real Component */}
        {selectedCategory === 'clearinghouse' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              🏛️ DOT Clearinghouse Status
            </h2>
            <ClearinghouseStatus
              driverId='DRV-001'
              licenseNumber='WA123456789'
              onRefresh={handleRefresh}
            />
          </div>
        )}

        {/* SAFER View - Real Component */}
        {selectedCategory === 'safer' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '24px',
              }}
            >
              🛡️ SAFER System Status
            </h2>

            {/* SAFER Status KPI */}
            <div
              style={{
                background:
                  complianceData?.safetyRating === 'SATISFACTORY'
                    ? '#22c55e20'
                    : complianceData?.safetyRating === 'CONDITIONAL'
                      ? '#f59e0b20'
                      : '#ef444420',
                border:
                  complianceData?.safetyRating === 'SATISFACTORY'
                    ? '1px solid #22c55e40'
                    : complianceData?.safetyRating === 'CONDITIONAL'
                      ? '1px solid #f59e0b40'
                      : '1px solid #ef444440',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  color:
                    complianceData?.safetyRating === 'SATISFACTORY'
                      ? '#22c55e'
                      : complianceData?.safetyRating === 'CONDITIONAL'
                        ? '#f59e0b'
                        : '#ef4444',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                {complianceData?.safetyRating === 'SATISFACTORY'
                  ? 'SATISFACTORY'
                  : complianceData?.safetyRating === 'CONDITIONAL'
                    ? 'CONDITIONAL'
                    : complianceData?.safetyRating === 'UNSATISFACTORY'
                      ? 'UNSATISFACTORY'
                      : 'NOT RATED'}
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '14px',
                  marginBottom: '4px',
                }}
              >
                DOT Safety Rating
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '12px',
                }}
              >
                DOT #{complianceData?.dotNumber || '123456'}
              </div>
            </div>

            <SAFERStatusCard
              dotNumber={complianceData?.dotNumber || '123456'}
              companyName={
                complianceData?.companyName || 'FleetFlow Transportation LLC'
              }
              onRefresh={handleRefresh}
            />
          </div>
        )}

        {/* Insurance View - Real Component */}
        {selectedCategory === 'insurance' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              🏥 Insurance & Liability Coverage
            </h2>
            <LIInsuranceCard
              ubiNumber={complianceData?.dotNumber || '123456'}
              onRefresh={handleRefresh}
            />
          </div>
        )}

        {/* Other Category Views */}
        {selectedCategory === 'vehicles' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              🚛 Vehicle Compliance
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                margin: 0,
              }}
            >
              Vehicle-specific compliance monitoring and maintenance tracking
            </p>
          </div>
        )}

        {selectedCategory === 'drivers' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              👨‍💼 Driver Compliance
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                margin: 0,
              }}
            >
              Driver certifications, HOS compliance, and training records
            </p>
          </div>
        )}

        {selectedCategory === 'operations' && (
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                color: 'white',
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              ⚙️ Operations Compliance
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '16px',
                margin: 0,
              }}
            >
              Operational procedures, safety protocols, and audit compliance
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
