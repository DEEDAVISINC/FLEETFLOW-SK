'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Award,
  BarChart3,
  Bot,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Star,
  Target,
  TrendingUp,
  Truck,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  fleetFlowSmartLoadNetwork,
  type LoadMatchResult,
  type NetworkMetrics,
  type SmartLoad,
} from '../services/FleetFlowSmartLoadNetwork';

export default function SmartLoadNetworkDashboard() {
  const [smartLoads, setSmartLoads] = useState<SmartLoad[]>([]);
  const [networkMetrics, setNetworkMetrics] = useState<NetworkMetrics>({
    totalLoads: 0,
    availableLoads: 0,
    matchedLoads: 0,
    averageRate: 0,
    networkUtilization: 0,
    revenueOpportunity: 0,
    geographicCoverage: { states: 0, cities: 0, corridors: [] },
    equipmentDemand: {},
    serviceCapabilities: {
      crossDocking: 0,
      poolDistribution: 0,
      whiteGlove: 0,
      sameDay: 0,
    },
  });
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<SmartLoad | null>(null);
  const [loadMatches, setLoadMatches] = useState<LoadMatchResult[]>([]);

  useEffect(() => {
    // Load initial data
    loadDashboardData();

    // Set up real-time event listeners
    const handleSmartLoadCreated = (load: SmartLoad) => {
      setRealtimeActivity((prev) => [
        `📦 New Smart Load: ${load.customer.name} - $${load.rate.totalRate} (${load.equipment.type})`,
        ...prev.slice(0, 9),
      ]);
      loadDashboardData();
    };

    const handleLoadMatched = (data: {
      load: SmartLoad;
      matches: LoadMatchResult[];
    }) => {
      setRealtimeActivity((prev) => [
        `🎯 Load matched: ${data.load.id} - ${data.matches.length} drivers available`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleLoadAwarded = (data: {
      loadId: string;
      driverId: string;
      load: SmartLoad;
    }) => {
      setRealtimeActivity((prev) => [
        `✅ Load awarded: ${data.load.customer.name} to driver ${data.driverId} - $${data.load.rate.totalRate}`,
        ...prev.slice(0, 9),
      ]);
      loadDashboardData();
    };

    const handleNetworkOptimized = (data: {
      timestamp: Date;
      totalLoads: number;
      optimizedMatches: number;
    }) => {
      setRealtimeActivity((prev) => [
        `🔄 Network optimized: ${data.optimizedMatches} matches updated`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleMetricsUpdated = (metrics: NetworkMetrics) => {
      setNetworkMetrics(metrics);
    };

    // Subscribe to events
    fleetFlowSmartLoadNetwork.on('smartLoadCreated', handleSmartLoadCreated);
    fleetFlowSmartLoadNetwork.on('loadMatched', handleLoadMatched);
    fleetFlowSmartLoadNetwork.on('loadAwarded', handleLoadAwarded);
    fleetFlowSmartLoadNetwork.on('networkOptimized', handleNetworkOptimized);
    fleetFlowSmartLoadNetwork.on('metricsUpdated', handleMetricsUpdated);

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => {
      fleetFlowSmartLoadNetwork.removeListener(
        'smartLoadCreated',
        handleSmartLoadCreated
      );
      fleetFlowSmartLoadNetwork.removeListener(
        'loadMatched',
        handleLoadMatched
      );
      fleetFlowSmartLoadNetwork.removeListener(
        'loadAwarded',
        handleLoadAwarded
      );
      fleetFlowSmartLoadNetwork.removeListener(
        'networkOptimized',
        handleNetworkOptimized
      );
      fleetFlowSmartLoadNetwork.removeListener(
        'metricsUpdated',
        handleMetricsUpdated
      );
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = () => {
    setSmartLoads(fleetFlowSmartLoadNetwork.getSmartLoads());
    setNetworkMetrics(fleetFlowSmartLoadNetwork.getNetworkMetrics());
  };

  const handleLoadSelect = (load: SmartLoad) => {
    setSelectedLoad(load);
    setLoadMatches(fleetFlowSmartLoadNetwork.getLoadMatches(load.id));
  };

  const handleBidSubmission = (loadId: string, bidAmount: number) => {
    // In real implementation, would select best driver
    const driverId = 'mock-driver-001';
    const success = fleetFlowSmartLoadNetwork.submitBid(
      loadId,
      bidAmount,
      driverId
    );

    if (success) {
      setRealtimeActivity((prev) => [
        `🎉 BID WON: ${loadId} - $${bidAmount}`,
        ...prev.slice(0, 9),
      ]);
    } else {
      setRealtimeActivity((prev) => [
        `❌ Bid lost: ${loadId} - $${bidAmount}`,
        ...prev.slice(0, 9),
      ]);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'same_day':
        return 'bg-red-600';
      case 'white_glove':
        return 'bg-purple-600';
      case 'expedited':
        return 'bg-orange-600';
      default:
        return 'bg-blue-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-600';
      case 'pending_award':
        return 'bg-yellow-600';
      case 'awarded':
        return 'bg-blue-600';
      case 'in_transit':
        return 'bg-purple-600';
      case 'delivered':
        return 'bg-gray-600';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'text-green-400';
    if (risk <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 text-3xl font-bold text-white'>
          🚛 FleetFlow Smart Load Network
        </h2>
        <p className='text-gray-300'>
          AI-Powered Load Matching & Complete 3PL Integration
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-6'>
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Total Loads</p>
                <p className='text-2xl font-bold text-white'>
                  {networkMetrics.totalLoads}
                </p>
              </div>
              <Package className='h-8 w-8 text-blue-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Available Now</p>
                <p className='text-2xl font-bold text-white'>
                  {networkMetrics.availableLoads}
                </p>
              </div>
              <Target className='h-8 w-8 text-green-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Match Rate</p>
                <p className='text-2xl font-bold text-white'>
                  {networkMetrics.networkUtilization.toFixed(0)}%
                </p>
              </div>
              <Zap className='h-8 w-8 text-yellow-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Avg Rate</p>
                <p className='text-2xl font-bold text-white'>
                  ${networkMetrics.averageRate.toLocaleString()}
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-green-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Revenue Opportunity</p>
                <p className='text-2xl font-bold text-white'>
                  ${(networkMetrics.revenueOpportunity / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-purple-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Geographic Reach</p>
                <p className='text-2xl font-bold text-white'>
                  {networkMetrics.geographicCoverage.states} States
                </p>
              </div>
              <MapPin className='h-8 w-8 text-orange-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Available Smart Loads */}
        <div className='xl:col-span-2'>
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Bot className='h-5 w-5 text-green-400' />
                AI-Matched Smart Loads
                <Badge className='ml-auto bg-green-600'>
                  {smartLoads.filter((l) => l.status === 'available').length}{' '}
                  Available
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-96 space-y-3 overflow-y-auto'>
                {smartLoads
                  .filter((l) => l.status === 'available')
                  .map((load) => (
                    <div
                      key={load.id}
                      onClick={() => handleLoadSelect(load)}
                      className='cursor-pointer rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:border-white/20 hover:bg-white/10'
                    >
                      <div className='mb-3 flex items-start justify-between'>
                        <div>
                          <h4 className='font-semibold text-white'>
                            {load.customer.name}
                          </h4>
                          <p className='text-sm text-gray-300'>{load.id}</p>
                          <p className='text-xs text-gray-400'>
                            {load.pickup.city}, {load.pickup.state} →{' '}
                            {load.delivery.city}, {load.delivery.state}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div className='text-xl font-bold text-white'>
                            ${load.rate.totalRate.toLocaleString()}
                          </div>
                          <Badge className={getPriorityColor(load.priority)}>
                            {load.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className='mb-3 grid grid-cols-3 gap-3 text-sm'>
                        <div>
                          <div className='text-gray-300'>Equipment</div>
                          <div className='font-semibold text-white'>
                            {load.equipment.type}
                          </div>
                        </div>
                        <div>
                          <div className='text-gray-300'>Weight</div>
                          <div className='font-semibold text-white'>
                            {(load.cargo.weight / 1000).toFixed(1)}K lbs
                          </div>
                        </div>
                        <div>
                          <div className='text-gray-300'>Win Prob</div>
                          <div className='font-semibold text-green-400'>
                            {load.aiAnalysis.winProbability}%
                          </div>
                        </div>
                      </div>

                      <div className='mb-2 flex items-center gap-2'>
                        <Badge className='bg-blue-700 text-xs'>
                          AI Score: {load.aiAnalysis.demandLevel.toUpperCase()}
                        </Badge>
                        <Badge className='bg-purple-700 text-xs'>
                          Margin: {load.aiAnalysis.profitMargin.toFixed(1)}%
                        </Badge>
                        <Badge
                          className={`text-xs ${getRiskColor(load.aiAnalysis.riskScore)} bg-gray-700`}
                        >
                          Risk: {load.aiAnalysis.riskScore}/10
                        </Badge>
                      </div>

                      {/* AI Analysis Preview */}
                      <div className='rounded bg-blue-600/20 p-2 text-xs'>
                        <div className='flex items-center gap-1 text-blue-400'>
                          <Bot className='h-3 w-3' />
                          <span className='font-semibold'>
                            AI Recommendation
                          </span>
                        </div>
                        <div className='text-white'>
                          Market Rate: $
                          {load.aiAnalysis.marketRate.average.toLocaleString()}{' '}
                          • Bid: $
                          {load.aiAnalysis.recommendedBid.toLocaleString()}
                        </div>
                      </div>

                      {/* Services Offered */}
                      <div className='mt-2 flex flex-wrap gap-1'>
                        {load.services.crossDock && (
                          <Badge className='bg-orange-700 text-xs'>
                            Cross-dock
                          </Badge>
                        )}
                        {load.services.poolDistribution && (
                          <Badge className='bg-purple-700 text-xs'>
                            Pool Distribution
                          </Badge>
                        )}
                        {load.services.whiteGlove && (
                          <Badge className='bg-yellow-700 text-xs'>
                            White Glove
                          </Badge>
                        )}
                        {load.cargo.temperatureControlled && (
                          <Badge className='bg-blue-700 text-xs'>
                            Temp Controlled
                          </Badge>
                        )}
                      </div>

                      {/* Quick Bid Button */}
                      <div className='mt-3 flex gap-2'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBidSubmission(
                              load.id,
                              load.aiAnalysis.recommendedBid
                            );
                          }}
                          className='flex-1 rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700'
                        >
                          Quick Bid $
                          {load.aiAnalysis.recommendedBid.toLocaleString()}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLoadSelect(load);
                          }}
                          className='rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700'
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  ))}

                {smartLoads.filter((l) => l.status === 'available').length ===
                  0 && (
                  <div className='py-8 text-center text-gray-400'>
                    <Package className='mx-auto mb-3 h-12 w-12 opacity-50' />
                    <p>No available loads</p>
                    <p className='text-sm'>
                      Smart loads will appear here automatically
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Network Intelligence & Activity */}
        <div className='space-y-6'>
          {/* Network Intelligence */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <BarChart3 className='h-5 w-5 text-blue-400' />
                Network Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Geographic Coverage */}
              <div className='rounded bg-white/5 p-3'>
                <div className='mb-2 flex items-center gap-2'>
                  <MapPin className='h-4 w-4 text-orange-400' />
                  <span className='font-semibold text-white'>
                    Geographic Coverage
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  <div>
                    <div className='text-gray-300'>States</div>
                    <div className='font-semibold text-white'>
                      {networkMetrics.geographicCoverage.states}
                    </div>
                  </div>
                  <div>
                    <div className='text-gray-300'>Cities</div>
                    <div className='font-semibold text-white'>
                      {networkMetrics.geographicCoverage.cities}
                    </div>
                  </div>
                </div>
                <div className='mt-2 text-xs text-gray-400'>
                  Key Corridors:{' '}
                  {networkMetrics.geographicCoverage.corridors.join(', ')}
                </div>
              </div>

              {/* Equipment Demand */}
              <div className='rounded bg-white/5 p-3'>
                <div className='mb-2 flex items-center gap-2'>
                  <Truck className='h-4 w-4 text-green-400' />
                  <span className='font-semibold text-white'>
                    Equipment Demand
                  </span>
                </div>
                <div className='space-y-2'>
                  {Object.entries(networkMetrics.equipmentDemand)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([equipment, count]) => (
                      <div
                        key={equipment}
                        className='flex items-center justify-between text-sm'
                      >
                        <span className='text-gray-300'>{equipment}</span>
                        <span className='font-semibold text-white'>
                          {count}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Service Capabilities */}
              <div className='rounded bg-white/5 p-3'>
                <div className='mb-2 flex items-center gap-2'>
                  <Award className='h-4 w-4 text-purple-400' />
                  <span className='font-semibold text-white'>
                    Service Capabilities
                  </span>
                </div>
                <div className='grid grid-cols-2 gap-2 text-xs'>
                  <div className='flex justify-between'>
                    <span className='text-gray-300'>Cross-docking</span>
                    <span className='text-white'>
                      {networkMetrics.serviceCapabilities.crossDocking}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-300'>Pool Hubs</span>
                    <span className='text-white'>
                      {networkMetrics.serviceCapabilities.poolDistribution}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-300'>White Glove</span>
                    <span className='text-white'>
                      {networkMetrics.serviceCapabilities.whiteGlove}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-300'>Same Day</span>
                    <span className='text-white'>
                      {networkMetrics.serviceCapabilities.sameDay}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Zap className='h-5 w-5 text-yellow-400' />
                Live Network Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-48 space-y-2 overflow-y-auto'>
                {realtimeActivity.map((activity, index) => (
                  <div
                    key={index}
                    className='rounded border-l-2 border-blue-400 bg-white/5 p-2 text-xs text-gray-300'
                  >
                    {activity}
                  </div>
                ))}

                {realtimeActivity.length === 0 && (
                  <div className='py-4 text-center text-sm text-gray-400'>
                    <Clock className='mx-auto mb-2 h-8 w-8 opacity-50' />
                    <p>Monitoring network activity...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Platform Advantages */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Star className='h-5 w-5 text-yellow-400' />
                Platform Advantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  AI-powered load matching & pricing
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  Complete 3PL services integration
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  Real-time capacity intelligence
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  API-first partner ecosystem
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  Multi-equipment optimization
                </div>
                <div className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle2 className='h-4 w-4 text-green-400' />
                  Automated consolidation & cross-dock
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
