'use client';

import { useEffect, useState } from 'react';
import type {
  OpenELDComplianceReport,
  OpenELDDevice,
  OpenELDDriver,
  OpenELDDutyStatus,
  OpenELDLogEntry,
} from '../services/openeld-integration';
import { openELDService } from '../services/openeld-integration';

interface OpenELDDashboardProps {
  className?: string;
}

export default function OpenELDDashboard({
  className = '',
}: OpenELDDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'devices' | 'drivers' | 'compliance' | 'logs'
  >('overview');
  const [devices, setDevices] = useState<OpenELDDevice[]>([]);
  const [drivers, setDrivers] = useState<OpenELDDriver[]>([]);
  const [systemHealth, setSystemHealth] = useState<{
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
  } | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [complianceReport, setComplianceReport] =
    useState<OpenELDComplianceReport | null>(null);
  const [dutyLogs, setDutyLogs] = useState<OpenELDDutyStatus[]>([]);
  const [logEntries, setLogEntries] = useState<OpenELDLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedDriver) {
      loadDriverData(selectedDriver);
    }
  }, [selectedDriver]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [devicesData, driversData, healthData] = await Promise.all([
        openELDService.getDevices(),
        openELDService.getDrivers(),
        openELDService.getSystemHealth(),
      ]);

      setDevices(devicesData);
      setDrivers(driversData);
      setSystemHealth(healthData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadDriverData = async (driverId: string) => {
    try {
      const [compliance, logs] = await Promise.all([
        openELDService.checkCompliance(driverId),
        openELDService.getDutyLogs(
          driverId,
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ),
      ]);

      setComplianceReport(compliance);
      setDutyLogs(logs);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load driver data'
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'certified':
      case 'healthy':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'disconnected':
      case 'uncertified':
      case 'critical':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'certified':
      case 'healthy':
        return '🟢';
      case 'warning':
        return '🟡';
      case 'disconnected':
      case 'uncertified':
      case 'critical':
        return '🔴';
      default:
        return '⚪';
    }
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className={`${className} p-6`}>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='mt-4 text-gray-600'>Loading OpenELD Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className} p-6`}>
        <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
          <p className='text-red-800'>Error: {error}</p>
          <button
            onClick={loadDashboardData}
            className='mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${className} overflow-hidden rounded-lg bg-white shadow-lg`}
    >
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-white'>OpenELD Dashboard</h1>
            <p className='text-blue-100'>Open Source ELD Compliance System</p>
          </div>
          <div className='flex items-center space-x-4'>
            <div className='text-right'>
              <div className='text-sm text-white'>System Status</div>
              <div className='flex items-center space-x-2'>
                <span className='text-2xl'>
                  {getStatusIcon(systemHealth?.status || 'unknown')}
                </span>
                <span className='font-semibold text-white capitalize'>
                  {systemHealth?.status || 'unknown'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className='border-b border-gray-200'>
        <nav className='flex space-x-8 px-6'>
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'devices', label: 'Devices', icon: '📱' },
            { id: 'drivers', label: 'Drivers', icon: '👨‍💼' },
            { id: 'compliance', label: 'Compliance', icon: '✅' },
            { id: 'logs', label: 'Activity Logs', icon: '📝' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className='p-6'>
        {activeTab === 'overview' && (
          <div className='space-y-6'>
            {/* System Health Summary */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
              <div className='rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-green-600'>
                      Connected Devices
                    </p>
                    <p className='text-2xl font-bold text-green-900'>
                      {devices.filter((d) => d.status === 'connected').length}
                    </p>
                  </div>
                  <div className='text-3xl'>📱</div>
                </div>
              </div>

              <div className='rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-blue-600'>
                      Certified Drivers
                    </p>
                    <p className='text-2xl font-bold text-blue-900'>
                      {
                        drivers.filter((d) => d.eldStatus === 'certified')
                          .length
                      }
                    </p>
                  </div>
                  <div className='text-3xl'>👨‍💼</div>
                </div>
              </div>

              <div className='rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-6'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm font-medium text-purple-600'>
                      System Health
                    </p>
                    <p className='text-2xl font-bold text-purple-900 capitalize'>
                      {systemHealth?.status || 'unknown'}
                    </p>
                  </div>
                  <div className='text-3xl'>
                    {getStatusIcon(systemHealth?.status || 'unknown')}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className='rounded-lg bg-gray-50 p-6'>
              <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                Recent Activity
              </h3>
              <div className='space-y-3'>
                {devices.slice(0, 3).map((device) => (
                  <div
                    key={device.deviceId}
                    className='flex items-center justify-between rounded border bg-white p-3'
                  >
                    <div className='flex items-center space-x-3'>
                      <span className='text-2xl'>📱</span>
                      <div>
                        <p className='font-medium text-gray-900'>
                          {device.deviceId}
                        </p>
                        <p className='text-sm text-gray-500'>
                          Last sync:{' '}
                          {new Date(device.lastSync).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <span
                        className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                        style={{
                          backgroundColor: getStatusColor(device.status) + '20',
                          color: getStatusColor(device.status),
                        }}
                      >
                        {device.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Issues */}
            {systemHealth && systemHealth.issues.length > 0 && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
                <h3 className='mb-4 text-lg font-semibold text-red-900'>
                  System Issues
                </h3>
                <ul className='space-y-2'>
                  {systemHealth.issues.map((issue, index) => (
                    <li key={index} className='flex items-start space-x-2'>
                      <span className='mt-1 text-red-500'>⚠️</span>
                      <span className='text-red-800'>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'devices' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                ELD Devices
              </h3>
              <button
                onClick={loadDashboardData}
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                Refresh
              </button>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {devices.map((device) => (
                <div
                  key={device.deviceId}
                  className='rounded-lg border bg-gray-50 p-6'
                >
                  <div className='mb-4 flex items-center justify-between'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      {device.deviceId}
                    </h4>
                    <span
                      className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                      style={{
                        backgroundColor: getStatusColor(device.status) + '20',
                        color: getStatusColor(device.status),
                      }}
                    >
                      {device.status}
                    </span>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Serial:</span>
                      <span className='font-mono text-sm'>
                        {device.serialNumber}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Model:</span>
                      <span className='text-sm'>{device.model}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Firmware:</span>
                      <span className='text-sm'>{device.firmwareVersion}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Battery:</span>
                      <span className='text-sm'>
                        {device.diagnostics.batteryLevel}%
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Signal:</span>
                      <span className='text-sm'>
                        {device.diagnostics.signalStrength}%
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 border-t border-gray-200 pt-4'>
                    <p className='text-xs text-gray-500'>
                      Last sync: {new Date(device.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'drivers' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                ELD Drivers
              </h3>
              <button
                onClick={loadDashboardData}
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                Refresh
              </button>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
              {drivers.map((driver) => (
                <div
                  key={driver.driverId}
                  className='rounded-lg border bg-gray-50 p-6'
                >
                  <div className='mb-4 flex items-center justify-between'>
                    <h4 className='text-lg font-semibold text-gray-900'>
                      {driver.driverId}
                    </h4>
                    <span
                      className='inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium'
                      style={{
                        backgroundColor:
                          getStatusColor(driver.eldStatus) + '20',
                        color: getStatusColor(driver.eldStatus),
                      }}
                    >
                      {driver.eldStatus}
                    </span>
                  </div>

                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>License:</span>
                      <span className='font-mono text-sm'>
                        {driver.licenseNumber}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>State:</span>
                      <span className='text-sm'>{driver.licenseState}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Class:</span>
                      <span className='text-sm'>{driver.licenseClass}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Device:</span>
                      <span className='text-sm'>
                        {driver.deviceId || 'Unassigned'}
                      </span>
                    </div>
                  </div>

                  <div className='mt-4 border-t border-gray-200 pt-4'>
                    <p className='text-xs text-gray-500'>
                      Last login: {new Date(driver.lastLogin).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Compliance Monitoring
              </h3>
              <div className='flex space-x-3'>
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className='rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                >
                  <option value=''>Select Driver</option>
                  {drivers.map((driver) => (
                    <option key={driver.driverId} value={driver.driverId}>
                      {driver.driverId} - {driver.licenseNumber}
                    </option>
                  ))}
                </select>
                <button
                  onClick={loadDashboardData}
                  className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
                >
                  Refresh
                </button>
              </div>
            </div>

            {selectedDriver && complianceReport && (
              <div className='space-y-6'>
                {/* Compliance Summary */}
                <div className='rounded-lg bg-gray-50 p-6'>
                  <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                    Compliance Summary
                  </h4>
                  <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {formatDuration(complianceReport.totalHours)}
                      </p>
                      <p className='text-sm text-gray-600'>Total Hours</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {formatDuration(complianceReport.drivingHours)}
                      </p>
                      <p className='text-sm text-gray-600'>Driving</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {formatDuration(complianceReport.onDutyHours)}
                      </p>
                      <p className='text-sm text-gray-600'>On Duty</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {formatDuration(complianceReport.offDutyHours)}
                      </p>
                      <p className='text-sm text-gray-600'>Off Duty</p>
                    </div>
                    <div className='text-center'>
                      <p className='text-2xl font-bold text-gray-900'>
                        {formatDuration(complianceReport.sleeperBerthHours)}
                      </p>
                      <p className='text-sm text-gray-600'>Sleeper</p>
                    </div>
                  </div>

                  <div className='mt-4 flex items-center space-x-2'>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                        complianceReport.compliance.compliant
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {complianceReport.compliance.compliant
                        ? '✅ Compliant'
                        : '❌ Non-Compliant'}
                    </span>
                  </div>
                </div>

                {/* Issues and Recommendations */}
                {complianceReport.compliance.issues.length > 0 && (
                  <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
                    <h4 className='mb-4 text-lg font-semibold text-red-900'>
                      Compliance Issues
                    </h4>
                    <div className='space-y-3'>
                      {complianceReport.compliance.issues.map(
                        (issue, index) => (
                          <div
                            key={index}
                            className='flex items-start space-x-3'
                          >
                            <span className='mt-1 text-red-500'>⚠️</span>
                            <div>
                              <p className='font-medium text-red-800'>
                                {issue}
                              </p>
                              {complianceReport.compliance.recommendations[
                                index
                              ] && (
                                <p className='mt-1 text-sm text-red-700'>
                                  Recommendation:{' '}
                                  {
                                    complianceReport.compliance.recommendations[
                                      index
                                    ]
                                  }
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Duty Logs */}
                <div className='rounded-lg bg-gray-50 p-6'>
                  <h4 className='mb-4 text-lg font-semibold text-gray-900'>
                    Recent Duty Logs
                  </h4>
                  <div className='space-y-3'>
                    {dutyLogs.slice(0, 5).map((log) => (
                      <div
                        key={log.id}
                        className='flex items-center justify-between rounded border bg-white p-3'
                      >
                        <div className='flex items-center space-x-3'>
                          <span className='text-2xl'>📋</span>
                          <div>
                            <p className='font-medium text-gray-900 capitalize'>
                              {log.status.replace('_', ' ')}
                            </p>
                            <p className='text-sm text-gray-500'>
                              {new Date(log.startTime).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className='text-right'>
                          <p className='text-sm font-medium text-gray-900'>
                            {formatDuration(log.duration)}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {log.dataSource}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!selectedDriver && (
              <div className='py-12 text-center'>
                <div className='mb-4 text-4xl'>👨‍💼</div>
                <h3 className='mb-2 text-lg font-medium text-gray-900'>
                  Select a Driver
                </h3>
                <p className='text-gray-500'>
                  Choose a driver from the dropdown above to view their
                  compliance status
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Activity Logs
              </h3>
              <button
                onClick={loadDashboardData}
                className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
              >
                Refresh
              </button>
            </div>

            <div className='rounded-lg bg-gray-50 p-6'>
              <div className='space-y-3'>
                {devices.map((device) => (
                  <div
                    key={device.deviceId}
                    className='rounded-lg border bg-white p-4'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <h4 className='font-semibold text-gray-900'>
                        {device.deviceId}
                      </h4>
                      <span className='text-sm text-gray-500'>
                        {new Date(device.lastSync).toLocaleString()}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-4 text-sm md:grid-cols-4'>
                      <div>
                        <span className='text-gray-600'>Battery:</span>
                        <span className='ml-2 font-medium'>
                          {device.diagnostics.batteryLevel}%
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Signal:</span>
                        <span className='ml-2 font-medium'>
                          {device.diagnostics.signalStrength}%
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Storage:</span>
                        <span className='ml-2 font-medium'>
                          {device.diagnostics.storageUsage}%
                        </span>
                      </div>
                      <div>
                        <span className='text-gray-600'>Temp:</span>
                        <span className='ml-2 font-medium'>
                          {device.diagnostics.temperature}°F
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
