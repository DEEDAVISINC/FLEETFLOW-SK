'use client';

import { useEffect, useState } from 'react';
import { CarrierBehaviorAnalyzer } from '../services/carrier-behavior-analyzer';
import { FraudGuardService } from '../services/fraud-guard-service';

interface FraudAlert {
  id: string;
  carrierId: string;
  carrierName: string;
  alertType:
    | 'high_risk'
    | 'suspicious_behavior'
    | 'document_fraud'
    | 'address_fraud';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved';
}

interface RiskMetrics {
  totalCarriers: number;
  highRiskCarriers: number;
  mediumRiskCarriers: number;
  lowRiskCarriers: number;
  criticalRiskCarriers: number;
  fraudDetectionRate: number;
  averageRiskScore: number;
  alertsThisWeek: number;
  resolvedAlerts: number;
}

export default function FleetGuardDashboard() {
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([]);
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    totalCarriers: 0,
    highRiskCarriers: 0,
    mediumRiskCarriers: 0,
    lowRiskCarriers: 0,
    criticalRiskCarriers: 0,
    fraudDetectionRate: 0,
    averageRiskScore: 0,
    alertsThisWeek: 0,
    resolvedAlerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    '24h' | '7d' | '30d' | '90d'
  >('7d');

  // Initialize services
  const fraudGuard = new FraudGuardService();
  const behaviorAnalyzer = new CarrierBehaviorAnalyzer();

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeframe]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load mock data for demonstration
      await loadMockData();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = async () => {
    // Mock fraud alerts
    const mockAlerts: FraudAlert[] = [
      {
        id: '1',
        carrierId: 'MC-123456',
        carrierName: 'Elite Transport LLC',
        alertType: 'high_risk',
        severity: 'high',
        description: 'High fraud risk detected during carrier verification',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'new',
      },
      {
        id: '2',
        carrierId: 'MC-789012',
        carrierName: 'Fast Freight Inc',
        alertType: 'suspicious_behavior',
        severity: 'medium',
        description: 'Unusual submission patterns detected',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'investigating',
      },
      {
        id: '3',
        carrierId: 'MC-345678',
        carrierName: 'Reliable Hauling',
        alertType: 'document_fraud',
        severity: 'critical',
        description: 'Potential document tampering detected',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        status: 'new',
      },
    ];

    setFraudAlerts(mockAlerts);

    // Mock risk metrics
    setRiskMetrics({
      totalCarriers: 156,
      highRiskCarriers: 12,
      mediumRiskCarriers: 23,
      lowRiskCarriers: 115,
      criticalRiskCarriers: 6,
      fraudDetectionRate: 94.2,
      averageRiskScore: 28.5,
      alertsThisWeek: 8,
      resolvedAlerts: 5,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeIcon = (alertType: string) => {
    switch (alertType) {
      case 'high_risk':
        return '🚨';
      case 'suspicious_behavior':
        return '🧠';
      case 'document_fraud':
        return '📄';
      case 'address_fraud':
        return '📍';
      default:
        return '⚠️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white'>
        <h1 className='mb-2 text-3xl font-bold'>🛡️ FleetGuard AI Dashboard</h1>
        <p className='text-blue-100'>
          Advanced fraud detection and carrier risk assessment powered by AI
        </p>
        <p className='mt-2 text-sm font-semibold text-purple-200'>
          Part of FACIS™ (FleetGuard Advanced Carrier Intelligence System)
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-900'>Risk Overview</h2>
        <div className='flex space-x-2 rounded-lg bg-gray-100 p-1'>
          {(['24h', '7d', '30d', '90d'] as const).map((timeframe) => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                selectedTimeframe === timeframe
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {timeframe}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Metrics Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Carriers */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-blue-100 p-2'>
              <span className='text-2xl'>🚛</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Total Carriers
              </p>
              <p className='text-2xl font-bold text-gray-900'>
                {riskMetrics.totalCarriers}
              </p>
            </div>
          </div>
        </div>

        {/* High Risk Carriers */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-orange-100 p-2'>
              <span className='text-2xl'>⚠️</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>High Risk</p>
              <p className='text-2xl font-bold text-orange-600'>
                {riskMetrics.highRiskCarriers}
              </p>
            </div>
          </div>
        </div>

        {/* Critical Risk Carriers */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-red-100 p-2'>
              <span className='text-2xl'>🚨</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>Critical Risk</p>
              <p className='text-2xl font-bold text-red-600'>
                {riskMetrics.criticalRiskCarriers}
              </p>
            </div>
          </div>
        </div>

        {/* Fraud Detection Rate */}
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <div className='flex items-center'>
            <div className='rounded-lg bg-green-100 p-2'>
              <span className='text-2xl'>🎯</span>
            </div>
            <div className='ml-4'>
              <p className='text-sm font-medium text-gray-600'>
                Detection Rate
              </p>
              <p className='text-2xl font-bold text-green-600'>
                {riskMetrics.fraudDetectionRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution Chart */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Risk Distribution
        </h3>
        <div className='grid grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='text-3xl font-bold text-green-600'>
              {riskMetrics.lowRiskCarriers}
            </div>
            <div className='text-sm text-gray-600'>Low Risk</div>
            <div className='mt-2 h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-green-500'
                style={{
                  width: `${(riskMetrics.lowRiskCarriers / riskMetrics.totalCarriers) * 100}%`,
                }}
               />
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-yellow-600'>
              {riskMetrics.mediumRiskCarriers}
            </div>
            <div className='text-sm text-gray-600'>Medium Risk</div>
            <div className='mt-2 h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-yellow-500'
                style={{
                  width: `${(riskMetrics.mediumRiskCarriers / riskMetrics.totalCarriers) * 100}%`,
                }}
               />
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-orange-600'>
              {riskMetrics.highRiskCarriers}
            </div>
            <div className='text-sm text-gray-600'>High Risk</div>
            <div className='mt-2 h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-orange-500'
                style={{
                  width: `${(riskMetrics.highRiskCarriers / riskMetrics.totalCarriers) * 100}%`,
                }}
               />
            </div>
          </div>
          <div className='text-center'>
            <div className='text-3xl font-bold text-red-600'>
              {riskMetrics.criticalRiskCarriers}
            </div>
            <div className='text-sm text-gray-600'>Critical Risk</div>
            <div className='mt-2 h-2 w-full rounded-full bg-gray-200'>
              <div
                className='h-2 rounded-full bg-red-500'
                style={{
                  width: `${(riskMetrics.criticalRiskCarriers / riskMetrics.totalCarriers) * 100}%`,
                }}
               />
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Alerts */}
      <div className='rounded-lg border border-gray-200 bg-white shadow-sm'>
        <div className='border-b border-gray-200 p-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-gray-900'>
              Active Fraud Alerts
            </h3>
            <span className='text-sm text-gray-600'>
              {fraudAlerts.length} active alerts
            </span>
          </div>
        </div>

        <div className='divide-y divide-gray-200'>
          {fraudAlerts.length === 0 ? (
            <div className='p-6 text-center text-gray-500'>
              No active fraud alerts
            </div>
          ) : (
            fraudAlerts.map((alert) => (
              <div
                key={alert.id}
                className='p-6 transition-colors hover:bg-gray-50'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex items-start space-x-4'>
                    <div className='text-2xl'>
                      {getAlertTypeIcon(alert.alertType)}
                    </div>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center space-x-2'>
                        <h4 className='font-medium text-gray-900'>
                          {alert.carrierName}
                        </h4>
                        <span className='text-sm text-gray-500'>
                          ({alert.carrierId})
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getSeverityColor(alert.severity)}`}
                        >
                          {alert.severity}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(alert.status)}`}
                        >
                          {alert.status}
                        </span>
                      </div>
                      <p className='mb-2 text-gray-600'>{alert.description}</p>
                      <div className='flex items-center space-x-4 text-sm text-gray-500'>
                        <span>{formatTimestamp(alert.timestamp)}</span>
                        <span>•</span>
                        <span className='capitalize'>
                          {alert.alertType.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className='flex space-x-2'>
                    <button className='rounded-md bg-blue-100 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-200'>
                      Investigate
                    </button>
                    <button className='rounded-md bg-green-100 px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-200'>
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Performance Metrics
          </h3>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Average Risk Score</span>
              <span className='font-semibold text-gray-900'>
                {riskMetrics.averageRiskScore}/100
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Alerts This Week</span>
              <span className='font-semibold text-gray-900'>
                {riskMetrics.alertsThisWeek}
              </span>
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-gray-600'>Resolved Alerts</span>
              <span className='font-semibold text-gray-900'>
                {riskMetrics.resolvedAlerts}
              </span>
            </div>
          </div>
        </div>

        <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
          <h3 className='mb-4 text-lg font-semibold text-gray-900'>
            Quick Actions
          </h3>
          <div className='space-y-3'>
            <button className='w-full rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'>
              🔍 Run New Carrier Scan
            </button>
            <button className='w-full rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700'>
              📊 Generate Risk Report
            </button>
            <button className='w-full rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700'>
              ⚙️ Update Detection Rules
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
