'use client';

import { useEffect, useState } from 'react';

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

export default function MarketplaceIntegration() {
  const [externalLoads, setExternalLoads] = useState<ExternalLoad[]>([]);
  const [activeBids, setActiveBids] = useState<BidData[]>([]);
  const [metrics, setMetrics] = useState<MarketplaceMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaceData();
    const interval = setInterval(fetchMarketplaceData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
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
    </div>
  );
}
