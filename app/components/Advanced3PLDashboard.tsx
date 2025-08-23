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
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Box,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Package,
  Route,
  Shuffle,
  TrendingUp,
  Truck,
  Warehouse,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  advanced3PLService,
  type BigBulkyFinalMileDelivery,
  type CrossDockFacility,
  type PoolDistributionHub,
  type VendorConsolidationPlan,
} from '../services/Advanced3PLService';

export default function Advanced3PLDashboard() {
  const [crossDockFacilities, setCrossDockFacilities] = useState<
    CrossDockFacility[]
  >([]);
  const [consolidationPlans, setConsolidationPlans] = useState<
    VendorConsolidationPlan[]
  >([]);
  const [poolHubs, setPoolHubs] = useState<PoolDistributionHub[]>([]);
  const [bigBulkyOrders, setBigBulkyOrders] = useState<
    BigBulkyFinalMileDelivery[]
  >([]);
  const [plMetrics, setPlMetrics] = useState<any>({});
  const [realtimeActivity, setRealtimeActivity] = useState<string[]>([]);

  useEffect(() => {
    // Load initial data
    loadDashboardData();

    // Set up real-time event listeners
    const handleConsolidationPlanCreated = (plan: VendorConsolidationPlan) => {
      setRealtimeActivity((prev) => [
        `📦 New consolidation plan: ${plan.customerName} - $${plan.costSavings.savingsAmount} savings`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleBigBulkyScheduled = (delivery: BigBulkyFinalMileDelivery) => {
      setRealtimeActivity((prev) => [
        `🚚 Big & Bulky scheduled: ${delivery.itemType} delivery - ${delivery.equipmentRequirement.vehicleType}`,
        ...prev.slice(0, 9),
      ]);
    };

    const handlePoolDispatched = (data: any) => {
      setRealtimeActivity((prev) => [
        `🚛 Pool dispatched from ${data.hubId}: ${data.shipmentCount} shipments`,
        ...prev.slice(0, 9),
      ]);
    };

    const handleNotificationSent = (notification: any) => {
      setRealtimeActivity((prev) => [
        `📧 Auto notification: ${notification.ruleId}`,
        ...prev.slice(0, 9),
      ]);
    };

    // Subscribe to events
    advanced3PLService.on(
      'consolidationPlanCreated',
      handleConsolidationPlanCreated
    );
    advanced3PLService.on('bigBulkyScheduled', handleBigBulkyScheduled);
    advanced3PLService.on('poolDispatched', handlePoolDispatched);
    advanced3PLService.on('notificationSent', handleNotificationSent);

    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);

    return () => {
      advanced3PLService.removeListener(
        'consolidationPlanCreated',
        handleConsolidationPlanCreated
      );
      advanced3PLService.removeListener(
        'bigBulkyScheduled',
        handleBigBulkyScheduled
      );
      advanced3PLService.removeListener('poolDispatched', handlePoolDispatched);
      advanced3PLService.removeListener(
        'notificationSent',
        handleNotificationSent
      );
      clearInterval(interval);
    };
  }, []);

  const loadDashboardData = () => {
    setCrossDockFacilities(advanced3PLService.getCrossDockFacilities());
    setConsolidationPlans(advanced3PLService.getVendorConsolidationPlans());
    setPoolHubs(advanced3PLService.getPoolDistributionHubs());
    setBigBulkyOrders(advanced3PLService.getBigBulkyOrders());
    setPlMetrics(advanced3PLService.get3PLMetrics());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'loading':
      case 'consolidating':
        return 'bg-blue-500';
      case 'shipped':
      case 'dispatched':
        return 'bg-green-500';
      case 'planning':
      case 'available':
        return 'bg-yellow-500';
      case 'delivered':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h2 className='mb-2 text-3xl font-bold text-white'>
          🏭 Advanced 3PL Services
        </h2>
        <p className='text-gray-300'>
          Full-Stack Freight Solutions Built for Profit and Performance
        </p>
      </div>

      {/* Key Metrics Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-5'>
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Cross-dock Utilization</p>
                <p className='text-2xl font-bold text-white'>
                  {plMetrics.crossDockUtilization?.toFixed(1)}%
                </p>
              </div>
              <Warehouse className='h-8 w-8 text-blue-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Consolidation Savings</p>
                <p className='text-2xl font-bold text-white'>
                  $
                  {(plMetrics.vendorConsolidationSavings || 0).toLocaleString()}
                </p>
              </div>
              <Package className='h-8 w-8 text-green-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Pool Efficiency</p>
                <p className='text-2xl font-bold text-white'>
                  {plMetrics.poolDistributionEfficiency?.toFixed(1)}%
                </p>
              </div>
              <Route className='h-8 w-8 text-purple-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Big & Bulky Orders</p>
                <p className='text-2xl font-bold text-white'>
                  {plMetrics.bigBulkyDeliveryCount || 0}
                </p>
              </div>
              <Box className='h-8 w-8 text-orange-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardContent className='p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-300'>Customer Satisfaction</p>
                <p className='text-2xl font-bold text-white'>
                  {plMetrics.overallCustomerSatisfaction || 0}/5.0
                </p>
              </div>
              <TrendingUp className='h-8 w-8 text-yellow-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-3'>
        {/* Cross-dock Facilities & Vendor Consolidation */}
        <div className='space-y-6 xl:col-span-2'>
          {/* Cross-dock Facilities */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Warehouse className='h-5 w-5 text-blue-400' />
                Cross-dock Facilities
                <Badge className='ml-auto bg-blue-600'>
                  {crossDockFacilities.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {crossDockFacilities.map((facility) => {
                  const utilizationPercent =
                    (facility.capacity.currentPallets /
                      facility.capacity.maxPallets) *
                    100;

                  return (
                    <div
                      key={facility.id}
                      className='rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10'
                    >
                      <div className='mb-3 flex items-start justify-between'>
                        <div>
                          <h4 className='font-semibold text-white'>
                            {facility.name}
                          </h4>
                          <p className='text-sm text-gray-300'>
                            {facility.location.city}, {facility.location.state}
                          </p>
                        </div>
                        <div className='text-right'>
                          <Badge
                            className={`${utilizationPercent > 85 ? 'bg-red-600' : utilizationPercent > 70 ? 'bg-yellow-600' : 'bg-green-600'}`}
                          >
                            {utilizationPercent.toFixed(0)}% Full
                          </Badge>
                        </div>
                      </div>

                      <div className='mb-3'>
                        <div className='mb-1 flex justify-between text-sm'>
                          <span className='text-gray-300'>Capacity</span>
                          <span className='text-white'>
                            {facility.capacity.currentPallets}/
                            {facility.capacity.maxPallets} pallets
                          </span>
                        </div>
                        <Progress value={utilizationPercent} className='h-2' />
                      </div>

                      <div className='grid grid-cols-3 gap-2 text-xs'>
                        <div className='rounded bg-white/5 p-2'>
                          <div className='text-gray-300'>Daily Volume</div>
                          <div className='font-semibold text-white'>
                            {facility.throughputMetrics.dailyVolume}
                          </div>
                        </div>
                        <div className='rounded bg-white/5 p-2'>
                          <div className='text-gray-300'>Avg Dwell Time</div>
                          <div className='font-semibold text-white'>
                            {facility.throughputMetrics.averageDwellTime}h
                          </div>
                        </div>
                        <div className='rounded bg-white/5 p-2'>
                          <div className='text-gray-300'>Turnover Rate</div>
                          <div className='font-semibold text-white'>
                            {facility.throughputMetrics.turnoverRate}/day
                          </div>
                        </div>
                      </div>

                      <div className='mt-3 flex flex-wrap gap-1'>
                        {facility.capabilities.temperatureControlled && (
                          <Badge className='bg-blue-700 text-xs'>
                            Temp Controlled
                          </Badge>
                        )}
                        {facility.capabilities.hazmatCertified && (
                          <Badge className='bg-red-700 text-xs'>
                            Hazmat Certified
                          </Badge>
                        )}
                        <Badge className='bg-gray-700 text-xs'>
                          Security: {facility.capabilities.securityLevel}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Consolidation Plans */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Package className='h-5 w-5 text-green-400' />
                Vendor Consolidation Plans
                <Badge className='ml-auto bg-green-600'>
                  {consolidationPlans.length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-64 space-y-3 overflow-y-auto'>
                {consolidationPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className='rounded-lg border border-white/10 bg-white/5 p-3 transition-colors hover:bg-white/10'
                  >
                    <div className='mb-2 flex items-center justify-between'>
                      <div>
                        <span className='font-semibold text-white'>
                          {plan.customerName}
                        </span>
                        <span className='ml-2 text-xs text-gray-400'>
                          {plan.id}
                        </span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`h-2 w-2 rounded-full ${getStatusColor(plan.status)}`}
                        />
                        <span className='text-xs text-gray-300 capitalize'>
                          {plan.status}
                        </span>
                      </div>
                    </div>

                    <div className='grid grid-cols-2 gap-3 text-sm'>
                      <div>
                        <div className='text-gray-300'>Inbound Shipments</div>
                        <div className='font-semibold text-white'>
                          {plan.inboundShipments.length}
                        </div>
                      </div>
                      <div>
                        <div className='text-gray-300'>Savings</div>
                        <div className='font-semibold text-green-400'>
                          ${plan.costSavings.savingsAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className='text-gray-300'>Total Pallets</div>
                        <div className='font-semibold text-white'>
                          {plan.outboundPlan.consolidatedPallets}
                        </div>
                      </div>
                      <div>
                        <div className='text-gray-300'>Equipment</div>
                        <div className='font-semibold text-white'>
                          {plan.outboundPlan.equipmentType}
                        </div>
                      </div>
                    </div>

                    <div className='mt-2 text-xs text-gray-400'>
                      Cross-dock: {plan.crossDockFacility.name}
                    </div>
                  </div>
                ))}

                {consolidationPlans.length === 0 && (
                  <div className='py-8 text-center text-gray-400'>
                    <Package className='mx-auto mb-3 h-12 w-12 opacity-50' />
                    <p>No active consolidation plans</p>
                    <p className='text-sm'>
                      New plans will appear here automatically
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pool Distribution & Activity */}
        <div className='space-y-6'>
          {/* Pool Distribution Hubs */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Route className='h-5 w-5 text-purple-400' />
                Pool Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {poolHubs.map((hub) => (
                <div key={hub.id} className='rounded bg-white/5 p-3'>
                  <div className='mb-2 flex items-center justify-between'>
                    <span className='font-semibold text-white'>{hub.name}</span>
                    <Badge className='bg-purple-600 text-xs'>
                      {hub.serviceRadius}mi radius
                    </Badge>
                  </div>

                  <div className='mb-3 grid grid-cols-2 gap-2 text-xs'>
                    <div>
                      <div className='text-gray-300'>Current Pool</div>
                      <div className='font-semibold text-white'>
                        {hub.currentPool.shipmentCount} shipments
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-300'>Total Weight</div>
                      <div className='font-semibold text-white'>
                        {(hub.currentPool.totalWeight / 1000).toFixed(1)}K lbs
                      </div>
                    </div>
                  </div>

                  <div className='mb-2 text-xs text-gray-300'>
                    Cutoff: {hub.poolingSchedule.consolidationCutoff} |
                    Departure: {hub.poolingSchedule.departureTime}
                  </div>

                  <div className='space-y-1'>
                    {hub.distributionVehicles.map((vehicle) => (
                      <div
                        key={vehicle.vehicleId}
                        className='flex items-center justify-between rounded bg-white/5 p-2 text-xs'
                      >
                        <div className='flex items-center gap-2'>
                          <Truck className='h-3 w-3' />
                          <span className='text-white'>
                            {vehicle.equipmentType}
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`h-2 w-2 rounded-full ${getStatusColor(vehicle.status)}`}
                          />
                          <span className='text-gray-300 capitalize'>
                            {vehicle.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-2 rounded bg-green-600/20 p-2 text-xs'>
                    <div className='text-green-400'>Performance Metrics</div>
                    <div className='text-white'>
                      {hub.metrics.onTimePerformance.toFixed(1)}% On-Time • $
                      {hub.metrics.costPerDelivery.toFixed(2)}/delivery
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Big & Bulky Orders */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Box className='h-5 w-5 text-orange-400' />
                Big & Bulky Final Mile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='max-h-48 space-y-3 overflow-y-auto'>
                {bigBulkyOrders.map((order) => (
                  <div key={order.id} className='rounded bg-white/5 p-3'>
                    <div className='mb-2 flex items-center justify-between'>
                      <span className='font-semibold text-white'>
                        {order.itemType}
                      </span>
                      <Badge className='bg-orange-600 text-xs'>
                        ${order.pricing.totalRate}
                      </Badge>
                    </div>

                    <div className='mb-2 text-sm text-gray-300'>
                      {order.dimensions.length}"L × {order.dimensions.width}"W ×{' '}
                      {order.dimensions.height}"H
                      <span className='ml-2 text-white'>
                        ({order.dimensions.weight} lbs)
                      </span>
                    </div>

                    <div className='mb-2 text-xs text-white'>
                      Equipment: {order.equipmentRequirement.vehicleType}
                    </div>

                    <div className='flex flex-wrap gap-1'>
                      {order.specialServices.whiteGlove && (
                        <Badge className='bg-blue-700 text-xs'>
                          White Glove
                        </Badge>
                      )}
                      {order.specialServices.insideDelivery && (
                        <Badge className='bg-green-700 text-xs'>
                          Inside Delivery
                        </Badge>
                      )}
                      {order.specialServices.assembly && (
                        <Badge className='bg-purple-700 text-xs'>
                          Assembly
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}

                {bigBulkyOrders.length === 0 && (
                  <div className='py-4 text-center text-sm text-gray-400'>
                    <Box className='mx-auto mb-2 h-8 w-8 opacity-50' />
                    <p>No big & bulky orders</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
            <CardHeader>
              <CardTitle className='flex items-center gap-2 text-white'>
                <Bell className='h-5 w-5 text-green-400' />
                Live 3PL Activity
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
                    <p>Monitoring for 3PL activity...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zone Skipping & ML Forecasting */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Zone Skipping Opportunities */}
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <Shuffle className='h-5 w-5 text-yellow-400' />
              Zone Skipping Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {advanced3PLService.getZoneSkippingRoutes().map((route) => (
                <div key={route.id} className='rounded bg-white/5 p-3'>
                  <div className='mb-3 flex items-center justify-between'>
                    <div>
                      <div className='font-semibold text-white'>
                        {route.originZone}
                      </div>
                      <div className='flex items-center gap-2 text-sm text-gray-300'>
                        <ArrowRight className='h-3 w-3' />
                        {route.destinationZone}
                      </div>
                    </div>
                    <Badge className='bg-yellow-600'>
                      ${route.savings.costReduction} saved
                    </Badge>
                  </div>

                  <div className='grid grid-cols-2 gap-3 text-xs'>
                    <div>
                      <div className='text-gray-300'>Time Savings</div>
                      <div className='font-semibold text-green-400'>
                        {route.savings.timeReduction}h
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-300'>Distance</div>
                      <div className='font-semibold text-white'>
                        {route.directRoute.distance}mi
                      </div>
                    </div>
                  </div>

                  <div className='mt-2 text-xs text-gray-400'>
                    Min Requirements: {route.eligibilityRequirements.minVolume}{' '}
                    pallets,
                    {(route.eligibilityRequirements.minWeight / 1000).toFixed(
                      0
                    )}
                    K lbs
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ML Forecasting & AI Features */}
        <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-white'>
              <BarChart3 className='h-5 w-5 text-blue-400' />
              AI-Driven Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Load Planning Forecast */}
            <div className='rounded bg-white/5 p-3'>
              <div className='mb-2 flex items-center gap-2'>
                <Calendar className='h-4 w-4 text-blue-400' />
                <span className='font-semibold text-white'>
                  Load Planning Forecast
                </span>
              </div>
              <div className='grid grid-cols-2 gap-3 text-sm'>
                <div>
                  <div className='text-gray-300'>Expected Volume</div>
                  <div className='font-semibold text-white'>52 loads/week</div>
                </div>
                <div>
                  <div className='text-gray-300'>Confidence</div>
                  <div className='font-semibold text-green-400'>87-92%</div>
                </div>
              </div>
            </div>

            {/* Right-sized Asset Optimization */}
            <div className='rounded bg-white/5 p-3'>
              <div className='mb-2 flex items-center gap-2'>
                <Zap className='h-4 w-4 text-yellow-400' />
                <span className='font-semibold text-white'>
                  Right-sized Asset Matching
                </span>
              </div>
              <div className='space-y-2 text-xs'>
                <div className='flex justify-between'>
                  <span className='text-gray-300'>Cargo Van Utilization</span>
                  <span className='text-white'>94%</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-300'>Box Truck Efficiency</span>
                  <span className='text-white'>87%</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-300'>Sprinter Van ROI</span>
                  <span className='text-green-400'>+23%</span>
                </div>
              </div>
            </div>

            {/* Automated Notifications */}
            <div className='rounded bg-white/5 p-3'>
              <div className='mb-2 flex items-center gap-2'>
                <Bell className='h-4 w-4 text-green-400' />
                <span className='font-semibold text-white'>
                  Smart Notifications
                </span>
              </div>
              <div className='text-sm text-gray-300'>
                <div className='mb-1 flex items-center gap-2'>
                  <CheckCircle2 className='h-3 w-3 text-green-400' />
                  247 notifications sent today
                </div>
                <div className='mb-1 flex items-center gap-2'>
                  <AlertTriangle className='h-3 w-3 text-yellow-400' />3
                  capacity alerts triggered
                </div>
                <div className='flex items-center gap-2'>
                  <Clock className='h-3 w-3 text-blue-400' />
                  Avg response time: 2.3 min
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integration Status */}
      <Card className='border-white/20 bg-white/10 backdrop-blur-sm'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-white'>
            <Building2 className='h-5 w-5 text-purple-400' />
            Enterprise 3PL Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='rounded-lg border border-blue-600/30 bg-blue-600/20 p-4'>
            <div className='mb-3 flex items-center gap-2 text-blue-400'>
              <CheckCircle2 className='h-5 w-5' />
              <span className='font-semibold'>
                Full-Stack 3PL Services Active
              </span>
            </div>
            <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-3'>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                Vendor Consolidation & Cross-docking
              </div>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                Zone Skipping Optimization
              </div>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                Big & Bulky Final Mile
              </div>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                Pool Distribution Network
              </div>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                AI Load Forecasting
              </div>
              <div className='flex items-center gap-2 text-gray-300'>
                <CheckCircle2 className='h-3 w-3 text-green-400' />
                Automated Notifications
              </div>
            </div>
            <p className='mt-3 text-xs text-gray-300'>
              FleetFlow now offers comprehensive 3PL services competitive with
              UPS Supply Chain Solutions, FedEx Supply Chain, and DHL Supply
              Chain. All services integrated with Go With The Flow network for
              optimal right-sized asset utilization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
