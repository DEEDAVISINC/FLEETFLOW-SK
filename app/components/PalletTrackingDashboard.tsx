'use client';

import { useEffect, useState } from 'react';

interface PalletTrackingData {
  palletId: string;
  loadId: string;
  currentLocation: string;
  status:
    | 'crossdock_pending'
    | 'crossdock_scanned'
    | 'in_transit'
    | 'delivery_pending'
    | 'delivery_scanned'
    | 'delivered';
  lastScanTime: Date;
  expectedDelivery: Date;
  driverId: string;
  route: string;
  priority: 'low' | 'medium' | 'high';
}

interface ShipmentStatus {
  loadId: string;
  totalPallets: number;
  scannedPallets: number;
  completionPercentage: number;
  status: 'loading' | 'in_transit' | 'unloading' | 'completed' | 'delayed';
  estimatedArrival: Date;
  lastUpdate: Date;
  issues: string[];
}

interface RealTimeUpdate {
  id: string;
  type: 'scan' | 'location_update' | 'issue' | 'completion';
  message: string;
  timestamp: Date;
  loadId: string;
  palletId?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

export default function PalletTrackingDashboard() {
  const [trackingData, setTrackingData] = useState<PalletTrackingData[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<ShipmentStatus[]>(
    []
  );
  const [realTimeUpdates, setRealTimeUpdates] = useState<RealTimeUpdate[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data initialization
  useEffect(() => {
    const initializeMockData = () => {
      const mockTrackingData: PalletTrackingData[] = [
        {
          palletId: 'PLT-DAL-001',
          loadId: 'MKT-001',
          currentLocation: 'Crossdock - Dallas, TX',
          status: 'crossdock_scanned',
          lastScanTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          expectedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000),
          driverId: 'DRV-12345',
          route: 'Dallas, TX → Houston, TX',
          priority: 'high',
        },
        {
          palletId: 'PLT-DAL-002',
          loadId: 'MKT-001',
          currentLocation: 'Crossdock - Dallas, TX',
          status: 'crossdock_scanned',
          lastScanTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
          expectedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000),
          driverId: 'DRV-12345',
          route: 'Dallas, TX → Houston, TX',
          priority: 'high',
        },
        {
          palletId: 'PLT-DAL-003',
          loadId: 'MKT-001',
          currentLocation: 'In Transit',
          status: 'in_transit',
          lastScanTime: new Date(Date.now() - 30 * 60 * 1000),
          expectedDelivery: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
          driverId: 'DRV-12345',
          route: 'Dallas, TX → Houston, TX',
          priority: 'high',
        },
        {
          palletId: 'PLT-AUS-001',
          loadId: 'MKT-002',
          currentLocation: 'Delivery - San Antonio, TX',
          status: 'delivery_scanned',
          lastScanTime: new Date(Date.now() - 15 * 60 * 1000),
          expectedDelivery: new Date(Date.now() + 1 * 60 * 60 * 1000),
          driverId: 'DRV-67890',
          route: 'Austin, TX → San Antonio, TX',
          priority: 'medium',
        },
        {
          palletId: 'PLT-AUS-002',
          loadId: 'MKT-002',
          currentLocation: 'Delivered',
          status: 'delivered',
          lastScanTime: new Date(Date.now() - 10 * 60 * 1000),
          expectedDelivery: new Date(Date.now() + 1 * 60 * 60 * 1000),
          driverId: 'DRV-67890',
          route: 'Austin, TX → San Antonio, TX',
          priority: 'medium',
        },
      ];

      const mockShipmentStatuses: ShipmentStatus[] = [
        {
          loadId: 'MKT-001',
          totalPallets: 3,
          scannedPallets: 2,
          completionPercentage: 67,
          status: 'in_transit',
          estimatedArrival: new Date(Date.now() + 3.5 * 60 * 60 * 1000),
          lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
          issues: [],
        },
        {
          loadId: 'MKT-002',
          totalPallets: 2,
          scannedPallets: 2,
          completionPercentage: 100,
          status: 'completed',
          estimatedArrival: new Date(Date.now() + 1 * 60 * 60 * 1000),
          lastUpdate: new Date(Date.now() - 10 * 60 * 1000),
          issues: [],
        },
      ];

      const mockUpdates: RealTimeUpdate[] = [
        {
          id: 'update-1',
          type: 'scan',
          message: 'Pallet PLT-DAL-003 scanned at crossdock departure',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          loadId: 'MKT-001',
          palletId: 'PLT-DAL-003',
          severity: 'success',
        },
        {
          id: 'update-2',
          type: 'completion',
          message: 'Load MKT-002 delivery completed successfully',
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          loadId: 'MKT-002',
          severity: 'success',
        },
        {
          id: 'update-3',
          type: 'location_update',
          message: 'Load MKT-001 now in transit to Houston',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          loadId: 'MKT-001',
          severity: 'info',
        },
      ];

      setTrackingData(mockTrackingData);
      setShipmentStatuses(mockShipmentStatuses);
      setRealTimeUpdates(mockUpdates);
      setIsLoading(false);
    };

    initializeMockData();

    // Simulate real-time updates
    const interval = setInterval(() => {
      // Add mock real-time update every 30 seconds
      if (Math.random() > 0.7) {
        const newUpdate: RealTimeUpdate = {
          id: `update-${Date.now()}`,
          type: 'scan',
          message: `Pallet scan update for load MKT-001`,
          timestamp: new Date(),
          loadId: 'MKT-001',
          severity: 'info',
        };
        setRealTimeUpdates((prev) => [newUpdate, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'crossdock_scanned':
      case 'delivery_scanned':
      case 'delivered':
        return 'bg-green-500';
      case 'in_transit':
        return 'bg-blue-500';
      case 'crossdock_pending':
      case 'delivery_pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'crossdock_pending':
        return 'Crossdock Pending';
      case 'crossdock_scanned':
        return 'Crossdock Scanned';
      case 'in_transit':
        return 'In Transit';
      case 'delivery_pending':
        return 'Delivery Pending';
      case 'delivery_scanned':
        return 'Delivery Scanned';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-400 border-red-400';
      case 'medium':
        return 'text-yellow-400 border-yellow-400';
      case 'low':
        return 'text-green-400 border-green-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  const filteredData = trackingData.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const selectedLoadData = selectedLoad
    ? shipmentStatuses.find((s) => s.loadId === selectedLoad)
    : null;

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500'></div>
          <p className='text-gray-600'>Loading pallet tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h2 className='mb-2 text-2xl font-bold text-white'>
              📊 Real-Time Pallet Tracking
            </h2>
            <p className='text-gray-300'>
              Live visibility into all MARKETPLACE BIDDING LTL shipments
            </p>
          </div>
          <div className='flex items-center gap-4'>
            <div className='text-right'>
              <div className='text-2xl font-bold text-white'>
                {trackingData.length}
              </div>
              <div className='text-sm text-gray-400'>Total Pallets</div>
            </div>
            <div className='text-right'>
              <div className='text-2xl font-bold text-green-400'>
                {trackingData.filter((p) => p.status === 'delivered').length}
              </div>
              <div className='text-sm text-gray-400'>Delivered</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className='flex flex-wrap gap-2'>
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            All Status ({trackingData.length})
          </button>
          <button
            onClick={() => setFilterStatus('crossdock_scanned')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filterStatus === 'crossdock_scanned'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Crossdock (
            {
              trackingData.filter((p) => p.status === 'crossdock_scanned')
                .length
            }
            )
          </button>
          <button
            onClick={() => setFilterStatus('in_transit')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filterStatus === 'in_transit'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            In Transit (
            {trackingData.filter((p) => p.status === 'in_transit').length})
          </button>
          <button
            onClick={() => setFilterStatus('delivered')}
            className={`rounded-lg px-4 py-2 font-medium transition-colors ${
              filterStatus === 'delivered'
                ? 'bg-blue-500 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            Delivered (
            {trackingData.filter((p) => p.status === 'delivered').length})
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Pallet Tracking List */}
        <div className='space-y-4 lg:col-span-2'>
          <h3 className='mb-4 text-xl font-bold text-white'>
            📦 Pallet Status Overview
          </h3>

          <div className='max-h-96 space-y-3 overflow-y-auto'>
            {filteredData.map((pallet) => (
              <div
                key={pallet.palletId}
                className='cursor-pointer rounded-lg border border-white/10 bg-white/10 p-4 backdrop-blur-lg transition-colors hover:border-white/20'
                onClick={() => setSelectedLoad(pallet.loadId)}
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-1 flex items-center gap-2'>
                      <span className='text-lg font-bold text-white'>
                        {pallet.palletId}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(pallet.priority)}`}
                      >
                        {pallet.priority.toUpperCase()}
                      </span>
                    </div>
                    <div className='mb-1 text-sm text-gray-300'>
                      🚛 {pallet.route}
                    </div>
                    <div className='text-xs text-gray-400'>
                      Driver: {pallet.driverId}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div
                      className={`inline-block h-3 w-3 rounded-full ${getStatusColor(pallet.status)} mb-2`}
                    ></div>
                    <div className='text-sm font-medium text-white'>
                      {getStatusText(pallet.status)}
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <div className='text-gray-400'>
                    📍 {pallet.currentLocation}
                  </div>
                  <div className='text-gray-400'>
                    🕒 {pallet.lastScanTime.toLocaleTimeString()}
                  </div>
                </div>

                {pallet.status !== 'delivered' && (
                  <div className='mt-2 text-xs text-gray-500'>
                    Expected: {pallet.expectedDelivery.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipment Summary & Real-time Updates */}
        <div className='space-y-6'>
          {/* Shipment Summary */}
          <div className='rounded-lg bg-white/10 p-4 backdrop-blur-lg'>
            <h4 className='mb-4 text-lg font-bold text-white'>
              🚚 Shipment Summary
            </h4>

            {selectedLoadData ? (
              <div className='space-y-3'>
                <div className='text-center'>
                  <div className='mb-1 text-2xl font-bold text-white'>
                    {selectedLoadData.loadId}
                  </div>
                  <div className='text-sm text-gray-400'>Load Progress</div>
                </div>

                <div className='h-3 rounded-full bg-white/20'>
                  <div
                    className='h-3 rounded-full bg-green-500 transition-all duration-300'
                    style={{
                      width: `${selectedLoadData.completionPercentage}%`,
                    }}
                  ></div>
                </div>

                <div className='text-center text-sm text-gray-300'>
                  {selectedLoadData.scannedPallets}/
                  {selectedLoadData.totalPallets} pallets scanned (
                  {selectedLoadData.completionPercentage}%)
                </div>

                <div className='text-center text-xs text-gray-400'>
                  Status:{' '}
                  {selectedLoadData.status.replace('_', ' ').toUpperCase()}
                </div>

                {selectedLoadData.issues.length > 0 && (
                  <div className='mt-3 rounded border border-red-500/30 bg-red-500/20 p-2'>
                    <div className='mb-1 text-xs font-medium text-red-300'>
                      Issues Reported:
                    </div>
                    <ul className='space-y-1 text-xs text-red-400'>
                      {selectedLoadData.issues.map((issue, index) => (
                        <li key={index}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className='py-8 text-center text-gray-400'>
                Select a pallet to view shipment details
              </div>
            )}
          </div>

          {/* Real-time Updates */}
          <div className='rounded-lg bg-white/10 p-4 backdrop-blur-lg'>
            <div className='mb-4 flex items-center gap-2'>
              <h4 className='text-lg font-bold text-white'>⚡ Live Updates</h4>
              <div className='flex items-center gap-1'>
                <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
                <span className='text-xs text-green-400'>LIVE</span>
              </div>
            </div>

            <div className='max-h-64 space-y-3 overflow-y-auto'>
              {realTimeUpdates.map((update) => (
                <div
                  key={update.id}
                  className={`rounded-lg border p-3 text-sm ${
                    update.severity === 'success'
                      ? 'border-green-500/30 bg-green-500/20 text-green-200'
                      : update.severity === 'warning'
                        ? 'border-yellow-500/30 bg-yellow-500/20 text-yellow-200'
                        : update.severity === 'error'
                          ? 'border-red-500/30 bg-red-500/20 text-red-200'
                          : 'border-blue-500/30 bg-blue-500/20 text-blue-200'
                  }`}
                >
                  <div className='mb-1 flex items-start justify-between'>
                    <div className='font-medium'>
                      {update.type === 'scan' && '📷'}
                      {update.type === 'location_update' && '📍'}
                      {update.type === 'issue' && '⚠️'}
                      {update.type === 'completion' && '✅'} {update.loadId}
                    </div>
                    <div className='text-xs opacity-75'>
                      {update.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div className='text-xs opacity-90'>{update.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className='rounded-lg bg-white/10 p-6 backdrop-blur-lg'>
        <h3 className='mb-4 text-xl font-bold text-white'>🔧 System Status</h3>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          <div className='rounded-lg border border-green-500/30 bg-green-500/20 p-4 text-center'>
            <div className='mb-2 text-2xl'>📡</div>
            <div className='font-medium text-green-200'>Real-time Sync</div>
            <div className='text-sm text-green-300'>
              All systems operational
            </div>
          </div>

          <div className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-4 text-center'>
            <div className='mb-2 text-2xl'>📊</div>
            <div className='font-medium text-blue-200'>Data Accuracy</div>
            <div className='text-sm text-blue-300'>
              99.8% scan validation rate
            </div>
          </div>

          <div className='rounded-lg border border-purple-500/30 bg-purple-500/20 p-4 text-center'>
            <div className='mb-2 text-2xl'>🚨</div>
            <div className='font-medium text-purple-200'>Alert System</div>
            <div className='text-sm text-purple-300'>Monitoring active</div>
          </div>
        </div>
      </div>
    </div>
  );
}
