'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamic import for pallet scanning component
const PalletScanningSystem = dynamic(() => import('./PalletScanningSystem'), {
  loading: () => (
    <div className='flex items-center justify-center p-4'>
      <div className='text-center'>
        <div className='mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-500'></div>
        <p className='text-sm text-blue-300'>Loading scanning system...</p>
      </div>
    </div>
  ),
});

interface ExternalLoad {
  id: string;
  origin: { address: string };
  destination: { address: string };
  rate: number;
  urgency: 'low' | 'medium' | 'high';
  status: string;
}

interface BidData {
  loadId: string;
  bidAmount: number;
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

interface MarketplaceMetrics {
  totalExternalLoadsEvaluated: number;
  externalBidsSubmitted: number;
  bidAcceptanceRate: number;
  averageProfitMargin: number;
}

interface WonLoad {
  id: string;
  route: string;
  status: 'won' | 'assigned' | 'in_transit' | 'delivered';
  palletCount: number;
  scanningRequired: boolean;
  assignedAt: Date;
}

export default function MarketplaceIntegration() {
  const [externalLoads, setExternalLoads] = useState<ExternalLoad[]>([]);
  const [activeBids, setActiveBids] = useState<BidData[]>([]);
  const [metrics, setMetrics] = useState<MarketplaceMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wonLoads, setWonLoads] = useState<WonLoad[]>([]);
  const [selectedLoadForScanning, setSelectedLoadForScanning] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchMarketplaceData();
    const interval = setInterval(fetchMarketplaceData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Initialize with mock won loads for MARKETPLACE BIDDING LTL
  useEffect(() => {
    if (wonLoads.length === 0) {
      setWonLoads([
        {
          id: 'MKT-001',
          route: 'Dallas, TX → Houston, TX',
          status: 'assigned',
          palletCount: 3,
          scanningRequired: true,
          assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: 'MKT-002',
          route: 'Austin, TX → San Antonio, TX',
          status: 'won',
          palletCount: 2,
          scanningRequired: true,
          assignedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        },
      ]);
    }
  }, []);

  const fetchMarketplaceData = async () => {
    try {
      // Fetch from Go With The Flow API
      const response = await fetch(
        '/api/go-with-the-flow?action=marketplace-data'
      );
      const data = await response.json();

      if (data.success) {
        setExternalLoads(data.externalLoads || []);
        setActiveBids(data.activeBids || []);
        setMetrics(data.metrics || null);
        setRecentActivity(data.recentActivity || []);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='text-white'>🔄 Loading marketplace integration...</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Metrics Overview */}
      {metrics && (
        <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-4'>
          <div className='rounded-lg bg-blue-500/20 p-4 text-center'>
            <div className='text-2xl font-bold text-white'>
              {metrics.totalExternalLoadsEvaluated}
            </div>
            <div className='text-sm text-blue-200'>Loads Evaluated</div>
          </div>
          <div className='rounded-lg bg-green-500/20 p-4 text-center'>
            <div className='text-2xl font-bold text-white'>
              {metrics.externalBidsSubmitted}
            </div>
            <div className='text-sm text-green-200'>Bids Submitted</div>
          </div>
          <div className='rounded-lg bg-purple-500/20 p-4 text-center'>
            <div className='text-2xl font-bold text-white'>
              {(metrics.bidAcceptanceRate * 100).toFixed(1)}%
            </div>
            <div className='text-sm text-purple-200'>Acceptance Rate</div>
          </div>
          <div className='rounded-lg bg-orange-500/20 p-4 text-center'>
            <div className='text-2xl font-bold text-white'>
              {metrics.averageProfitMargin.toFixed(1)}%
            </div>
            <div className='text-sm text-orange-200'>Profit Margin</div>
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* External Load Opportunities */}
        <div className='rounded-lg bg-white/10 p-6'>
          <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
            🎯 External Load Opportunities
            <span className='rounded-full bg-blue-500 px-2 py-1 text-xs'>
              {externalLoads.length} Active
            </span>
          </h3>

          <div className='max-h-96 space-y-3 overflow-y-auto'>
            {externalLoads.length > 0 ? (
              externalLoads.map((load) => (
                <div
                  key={load.id}
                  className='rounded-lg border border-white/10 bg-white/5 p-4'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='text-lg font-bold text-white'>
                      {load.id}
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${getUrgencyColor(load.urgency)}`}
                    >
                      {load.urgency?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className='mb-2 text-sm text-gray-300'>
                    <div>📍 {load.origin?.address || 'Unknown origin'}</div>
                    <div>
                      📍 {load.destination?.address || 'Unknown destination'}
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='font-bold text-green-400'>
                      ${load.rate?.toLocaleString() || 'TBD'}
                    </div>
                    <div className='text-sm text-yellow-400'>
                      🤖 Auto-Bidding Active
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-8 text-center text-gray-400'>
                No external loads currently available
              </div>
            )}
          </div>
        </div>

        {/* Active Bids */}
        <div className='rounded-lg bg-white/10 p-6'>
          <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
            💰 Active Bids
            <span className='rounded-full bg-green-500 px-2 py-1 text-xs'>
              {activeBids.length} Submitted
            </span>
          </h3>

          <div className='max-h-96 space-y-3 overflow-y-auto'>
            {activeBids.length > 0 ? (
              activeBids.map((bid, index) => (
                <div
                  key={index}
                  className='rounded-lg border border-white/10 bg-white/5 p-4'
                >
                  <div className='mb-2 flex items-start justify-between'>
                    <div className='font-bold text-white'>{bid.loadId}</div>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        bid.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : bid.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {bid.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='font-bold text-green-400'>
                      ${bid.bidAmount?.toFixed(2) || '0.00'}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {bid.submittedAt
                        ? new Date(bid.submittedAt).toLocaleTimeString()
                        : 'Unknown time'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='py-8 text-center text-gray-400'>
                No active bids at the moment
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='rounded-lg bg-white/10 p-6'>
        <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
          📈 Recent Marketplace Activity
          <div className='flex items-center gap-1 text-sm text-green-400'>
            <span className='h-2 w-2 animate-pulse rounded-full bg-green-400'></span>
            LIVE
          </div>
        </h3>

        <div className='max-h-64 space-y-2 overflow-y-auto'>
          {recentActivity.length > 0 ? (
            recentActivity.map((activity, index) => (
              <div
                key={index}
                className='border-b border-white/10 py-1 text-sm text-gray-300 last:border-b-0'
              >
                {activity}
              </div>
            ))
          ) : (
            <div className='py-4 text-center text-gray-400'>
              No recent activity
            </div>
          )}
        </div>
      </div>

      {/* Won Loads & Pallet Scanning Integration */}
      {wonLoads.length > 0 && (
        <div className='mt-6 rounded-lg bg-white/10 p-6'>
          <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
            🏆 Won Loads - MARKETPLACE BIDDING LTL
            <span className='rounded-full bg-green-500 px-2 py-1 text-xs'>
              {wonLoads.length} Active
            </span>
          </h3>

          <div className='space-y-4'>
            {wonLoads.map((load) => (
              <div
                key={load.id}
                className='rounded-lg border border-white/10 bg-white/5 p-4'
              >
                <div className='mb-3 flex items-start justify-between'>
                  <div>
                    <div className='mb-1 flex items-center gap-2'>
                      <span className='text-lg font-bold text-white'>
                        {load.id}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          load.status === 'won'
                            ? 'bg-green-100 text-green-800'
                            : load.status === 'assigned'
                              ? 'bg-blue-100 text-blue-800'
                              : load.status === 'in_transit'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {load.status.toUpperCase()}
                      </span>
                    </div>
                    <div className='mb-2 text-sm text-gray-300'>
                      📍 {load.route}
                    </div>
                    <div className='text-xs text-gray-400'>
                      Assigned: {load.assignedAt.toLocaleString()}
                    </div>
                  </div>
                  <div className='text-right'>
                    <div className='font-medium text-white'>
                      {load.palletCount} pallets
                    </div>
                    <div className='text-xs text-gray-400'>
                      Expected to scan
                    </div>
                  </div>
                </div>

                {/* Scanning Actions */}
                {load.scanningRequired && (
                  <div className='mt-4 space-y-3'>
                    <div className='rounded-lg border border-blue-500/30 bg-blue-500/20 p-3'>
                      <div className='mb-2 flex items-center gap-2'>
                        <span className='text-blue-400'>📦</span>
                        <span className='font-medium text-blue-200'>
                          MARKETPLACE BIDDING Requirement
                        </span>
                      </div>
                      <p className='text-sm text-blue-300'>
                        All MARKETPLACE BIDDING LTL drivers are required to scan
                        pallets in and out at every touchpoint to improve
                        shipment visibility and accuracy.
                      </p>
                    </div>

                    <div className='flex gap-2'>
                      {load.status === 'assigned' && (
                        <button
                          onClick={() => setSelectedLoadForScanning(load.id)}
                          className='flex-1 rounded-lg bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600'
                        >
                          📷 Start Crossdock Scanning
                        </button>
                      )}
                      {load.status === 'in_transit' && (
                        <button
                          onClick={() => setSelectedLoadForScanning(load.id)}
                          className='flex-1 rounded-lg bg-green-500 px-4 py-2 font-medium text-white transition-colors hover:bg-green-600'
                        >
                          🚚 Start Delivery Scanning
                        </button>
                      )}
                      <button
                        onClick={() =>
                          window.open(`tel:1-800-DISPATCH`, '_self')
                        }
                        className='rounded-lg bg-orange-500 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-600'
                      >
                        📞 Dispatch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pallet Scanning Interface for Selected Load */}
      {selectedLoadForScanning && (
        <div className='mt-6 rounded-lg bg-white/10 p-6'>
          <div className='mb-4 flex items-center justify-between'>
            <h3 className='text-xl font-bold text-white'>
              📦 Pallet Scanning - {selectedLoadForScanning}
            </h3>
            <button
              onClick={() => setSelectedLoadForScanning(null)}
              className='text-gray-400 transition-colors hover:text-white'
            >
              ✕ Close
            </button>
          </div>

          <PalletScanningSystem
            loadId={selectedLoadForScanning}
            driverId='DRV-12345' // This would come from authentication
            currentLocation={
              wonLoads.find((l) => l.id === selectedLoadForScanning)?.status ===
              'in_transit'
                ? 'delivery'
                : 'crossdock'
            }
            workflowMode={
              wonLoads.find((l) => l.id === selectedLoadForScanning)?.status ===
              'in_transit'
                ? 'unloading'
                : 'loading'
            }
            onScanComplete={(scan) => {
              console.log('Marketplace pallet scan completed:', scan);
              // Update load status, send notifications, etc.
            }}
            onWorkflowComplete={(summary) => {
              console.log('Marketplace workflow completed:', summary);
              if (summary.status === 'completed') {
                // Update load status
                setWonLoads((prev) =>
                  prev.map((load) =>
                    load.id === selectedLoadForScanning
                      ? {
                          ...load,
                          status:
                            load.status === 'assigned'
                              ? 'in_transit'
                              : 'delivered',
                        }
                      : load
                  )
                );
                setSelectedLoadForScanning(null);
                alert(
                  `✅ ${summary.location === 'crossdock' ? 'Loading' : 'Delivery'} workflow completed!`
                );
              }
            }}
          />
        </div>
      )}

      {/* Real-time Visibility Notice */}
      <div className='mt-6 rounded-lg border border-green-500/30 bg-green-500/20 p-4'>
        <div className='flex items-start gap-3'>
          <span className='text-xl text-green-400'>📊</span>
          <div>
            <h4 className='mb-1 font-medium text-green-200'>
              Real-Time Shipment Visibility
            </h4>
            <p className='text-sm text-green-300'>
              All pallet scans are tracked in real-time, providing customers and
              operations teams with complete visibility into shipment status and
              location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
