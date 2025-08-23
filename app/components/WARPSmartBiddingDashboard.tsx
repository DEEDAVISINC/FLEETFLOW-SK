'use client';

import { Badge } from '@/app/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Progress } from '@/app/components/ui/progress';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  Target,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  warpIntelligentBiddingService,
  type BidEvaluation,
  type WARPLoad,
} from '../services/WARPIntelligentBiddingService';

export default function WARPSmartBiddingDashboard() {
  const [activeLoads, setActiveLoads] = useState<WARPLoad[]>([]);
  const [bidRecommendations, setBidRecommendations] = useState<BidEvaluation[]>(
    []
  );
  const [biddingMetrics, setBiddingMetrics] = useState<any>({});
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);

  useEffect(() => {
    // Initial data load
    loadDashboardData();

    // Set up real-time event listeners
    const handleNewLoad = (load: WARPLoad) => {
      setRealtimeActivity((prev) => [
        `🆕 New WARP load detected: ${load.id} (${load.equipmentType})`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleBidRecommendation = (evaluation: BidEvaluation) => {
      setBidRecommendations((prev) => [evaluation, ...prev.slice(0, 4)]);
      setRealtimeActivity((prev) => [
        `🤖 AI recommends ${evaluation.shouldBid ? 'BIDDING' : 'SKIPPING'} on ${evaluation.loadId} (${evaluation.confidence}% confidence)`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleBidSubmitted = (bidInfo: any) => {
      setRealtimeActivity((prev) => [
        `📤 Bid submitted: ${bidInfo.loadId} at $${bidInfo.bidAmount}`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleBidResult = (result: any) => {
      const emoji = result.result === 'accepted' ? '✅' : '❌';
      setRealtimeActivity((prev) => [
        `${emoji} Bid ${result.result.toUpperCase()}: ${result.loadId}${result.finalRate ? ` at $${result.finalRate}` : ''}`,
        ...prev.slice(0, 9),
      ]);
    };

    // Subscribe to events
    warpIntelligentBiddingService.on('newLoadScraped', handleNewLoad);
    warpIntelligentBiddingService.on(
      'bidRecommendation',
      handleBidRecommendation
    );
    warpIntelligentBiddingService.on('bidSubmitted', handleBidSubmitted);
    warpIntelligentBiddingService.on('bidResult', handleBidResult);

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => {
      warpIntelligentBiddingService.removeListener(
        'newLoadScraped',
        handleNewLoad
      );
      warpIntelligentBiddingService.removeListener(
        'bidRecommendation',
        handleBidRecommendation
      );
      warpIntelligentBiddingService.removeListener(
        'bidSubmitted',
        handleBidSubmitted
      );
      warpIntelligentBiddingService.removeListener(
        'bidResult',
        handleBidResult
      );
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = () => {
    setActiveLoads(warpIntelligentBiddingService.getActiveLoads());
    setBidRecommendations(warpIntelligentBiddingService.getActiveBids());
    setBiddingMetrics(warpIntelligentBiddingService.getBiddingMetrics());
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 text-3xl font-bold text-white'>
          🎯 WARP Smart Bidding
        </h2>
        <p className='text-gray-300'>
          AI-powered intelligent bidding on WARP loads based on real network
          capacity
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Active Loads</p>
                <p className='text-2xl font-bold text-white'>
                  {activeLoads.length}
                </p>
              </div>
              <Truck className='h-8 w-8 text-blue-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Bids Today</p>
                <p className='text-2xl font-bold text-white'>
                  {biddingMetrics.bidsSubmitted || 0}
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
                <p className='text-sm text-gray-300'>Win Rate</p>
                <p className='text-2xl font-bold text-white'>
                  {((biddingMetrics.bidAcceptanceRate || 0) * 100).toFixed(0)}%
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
                <p className='text-sm text-gray-300'>Avg Profit</p>
                <p className='text-2xl font-bold text-white'>
                  {(biddingMetrics.averageProfitMargin || 0).toFixed(1)}%
                </p>
              </div>
              <DollarSign className='h-8 w-8 text-yellow-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Active WARP Loads */}
        <div className='xl:col-span-2'>
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Truck className='h-5 w-5 text-blue-400' />
                Active WARP Loads
                <Badge className='ml-auto bg-blue-600'>
                  {activeLoads.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-96 space-y-4 overflow-y-auto'>
                {activeLoads.map((load) => {
                  const evaluation = bidRecommendations.find(
                    (bid) => bid.loadId === load.id
                  );

                  return (
                    <div
                      key={load.id}
                      className='rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10'
                    >
                      <div className='mb-3 flex items-start justify-between'>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`h-2 w-2 rounded-full ${getUrgencyColor(load.urgency)}`}
                          />
                          <span className='font-semibold text-white'>
                            {load.id}
                          </span>
                          <Badge className='bg-gray-700 text-xs'>
                            {load.equipmentType}
                          </Badge>
                        </div>
                        <div className='text-right'>
                          <div className='font-semibold text-white'>
                            ${load.rateRange?.min}-
                            {load.rateRange?.max || load.suggestedRate}
                          </div>
                          <div className='text-xs text-gray-400'>
                            {load.distance} miles
                          </div>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4 text-sm'>
                        <div>
                          <div className='mb-1 flex items-center gap-1 text-gray-300'>
                            <MapPin className='h-3 w-3' />
                            Pickup
                          </div>
                          <div className='text-white'>
                            {load.origin.city}, {load.origin.state}
                          </div>
                        </div>
                        <div>
                          <div className='mb-1 flex items-center gap-1 text-gray-300'>
                            <MapPin className='h-3 w-3' />
                            Delivery
                          </div>
                          <div className='text-white'>
                            {load.destination.city}, {load.destination.state}
                          </div>
                        </div>
                      </div>

                      {evaluation && (
                        <div className='mt-3 border-t border-white/10 pt-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              {evaluation.shouldBid ? (
                                <CheckCircle2 className='h-4 w-4 text-green-400' />
                              ) : (
                                <AlertCircle className='h-4 w-4 text-red-400' />
                              )}
                              <span
                                className={`text-sm font-medium ${evaluation.shouldBid ? 'text-green-400' : 'text-red-400'}`}
                              >
                                {evaluation.shouldBid
                                  ? 'RECOMMENDED'
                                  : 'NOT RECOMMENDED'}
                              </span>
                            </div>
                            <div className='text-right'>
                              <div
                                className={`text-sm font-semibold ${getConfidenceColor(evaluation.confidence)}`}
                              >
                                {evaluation.confidence}% Confidence
                              </div>
                              {evaluation.shouldBid && (
                                <div className='text-xs text-white'>
                                  Bid: ${evaluation.recommendedBid.toFixed(0)}
                                </div>
                              )}
                            </div>
                          </div>

                          {evaluation.matchedDrivers.length > 0 && (
                            <div className='mt-2 text-xs text-gray-300'>
                              <Users className='mr-1 inline h-3 w-3' />
                              {evaluation.matchedDrivers.length} available
                              driver(s)
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {activeLoads.length === 0 && (
                  <div className='py-8 text-center text-gray-400'>
                    <Truck className='mx-auto mb-3 h-12 w-12 opacity-50' />
                    <p>No active WARP loads available</p>
                    <p className='text-sm'>
                      New loads will appear here automatically
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity & Network Status */}
        <div className='space-y-6'>
          {/* Network Capacity */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Zap className='h-5 w-5 text-yellow-400' />
                Network Capacity
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <div className='mb-2 flex justify-between text-sm'>
                  <span className='text-gray-300'>Network Utilization</span>
                  <span className='text-white'>
                    {((biddingMetrics.networkUtilization || 0) * 100).toFixed(
                      0
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(biddingMetrics.networkUtilization || 0) * 100}
                  className='h-2'
                />
              </div>

              <div className='grid grid-cols-2 gap-2 text-xs'>
                <div className='rounded bg-white/5 p-2'>
                  <div className='text-gray-300'>Online Drivers</div>
                  <div className='font-semibold text-white'>8/9</div>
                </div>
                <div className='rounded bg-white/5 p-2'>
                  <div className='text-gray-300'>Equipment Types</div>
                  <div className='font-semibold text-white'>6 Types</div>
                </div>
              </div>

              <div className='space-y-2'>
                <div className='text-xs text-gray-300'>
                  Available Equipment:
                </div>
                <div className='flex flex-wrap gap-1'>
                  <Badge className='bg-blue-600 text-xs'>Cargo Van (1)</Badge>
                  <Badge className='bg-green-600 text-xs'>Sprinter (1)</Badge>
                  <Badge className='bg-purple-600 text-xs'>Box Truck (1)</Badge>
                  <Badge className='bg-orange-600 text-xs'>Hot Shot (1)</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Clock className='h-5 w-5 text-green-400' />
                Live Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-64 space-y-2 overflow-y-auto'>
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
                    <p>Monitoring for activity...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bidding Strategy Status */}
      <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-white'>
            <Target className='h-5 w-5 text-red-400' />
            Current Bidding Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>Moderate</div>
              <div className='text-sm text-gray-300'>Aggressiveness</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>15%</div>
              <div className='text-sm text-gray-300'>Target Margin</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>250mi</div>
              <div className='text-sm text-gray-300'>Max Distance</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-white'>85%</div>
              <div className='text-sm text-gray-300'>Auto-Bid Threshold</div>
            </div>
          </div>

          <div className='mt-4 rounded-lg border border-blue-600/30 bg-blue-600/20 p-3'>
            <div className='flex items-center gap-2 text-sm text-blue-400'>
              <ArrowRight className='h-4 w-4' />
              <span className='font-semibold'>AI Optimization Active</span>
            </div>
            <p className='mt-1 text-xs text-gray-300'>
              System automatically evaluating loads and submitting
              high-confidence bids based on real driver availability and route
              optimization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
