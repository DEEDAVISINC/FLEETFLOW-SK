// 🚛⚡ GO WITH THE FLOW - API ROUTES
// Uber-like freight matching API endpoints

import { NextRequest, NextResponse } from 'next/server';
import { goWithTheFlowService } from '../../services/GoWithTheFlowService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const driverId = searchParams.get('driverId');

  try {
    switch (action) {
      case 'instant-loads':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Driver ID is required' },
            { status: 400 }
          );
        }
        const instantLoads =
          goWithTheFlowService.getInstantLoadsForDriver(driverId);
        return NextResponse.json({
          success: true,
          loads: instantLoads,
          count: instantLoads.length,
        });

      case 'available-drivers':
        const availableDrivers = goWithTheFlowService.getAvailableDrivers();
        return NextResponse.json({
          success: true,
          drivers: availableDrivers,
          count: availableDrivers.length,
        });

      case 'live-loads':
        const liveLoads = goWithTheFlowService.getLiveLoads();
        return NextResponse.json({
          success: true,
          loads: liveLoads,
          count: liveLoads.length,
        });

      case 'matching-queue':
        const matchingQueue = goWithTheFlowService.getMatchingQueue();
        return NextResponse.json({
          success: true,
          queue: matchingQueue,
          count: matchingQueue.length,
        });

      case 'system-metrics':
        const metrics = goWithTheFlowService.getSystemMetrics();
        return NextResponse.json({
          success: true,
          metrics,
        });

      case 'recent-activity':
        const activity = goWithTheFlowService.getRecentActivity();
        return NextResponse.json({
          success: true,
          activity,
          count: activity.length,
        });

      case 'driver-earnings':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Driver ID is required' },
            { status: 400 }
          );
        }
        const earnings = goWithTheFlowService.getDriverEarnings(driverId);
        return NextResponse.json({
          success: true,
          earnings,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, driverId, loadId, location, loadRequest, rating } = body;

    switch (action) {
      case 'go-online':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Driver ID is required' },
            { status: 400 }
          );
        }
        const onlineSuccess = goWithTheFlowService.goOnline(driverId);
        return NextResponse.json({
          success: onlineSuccess,
          message: onlineSuccess
            ? 'Driver is now online and available for loads'
            : 'Failed to set driver online',
        });

      case 'go-offline':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Driver ID is required' },
            { status: 400 }
          );
        }
        const offlineSuccess = goWithTheFlowService.goOffline(driverId);
        return NextResponse.json({
          success: offlineSuccess,
          message: offlineSuccess
            ? 'Driver is now offline'
            : 'Failed to set driver offline',
        });

      case 'accept-load':
        if (!driverId || !loadId) {
          return NextResponse.json(
            { error: 'Driver ID and Load ID are required' },
            { status: 400 }
          );
        }
        const acceptSuccess = goWithTheFlowService.acceptLoad(driverId, loadId);
        return NextResponse.json({
          success: acceptSuccess,
          message: acceptSuccess
            ? `Load ${loadId} accepted successfully`
            : `Failed to accept load ${loadId}. It may have expired.`,
        });

      case 'decline-load':
        if (!driverId || !loadId) {
          return NextResponse.json(
            { error: 'Driver ID and Load ID are required' },
            { status: 400 }
          );
        }
        const declineSuccess = goWithTheFlowService.declineLoad(
          driverId,
          loadId
        );
        return NextResponse.json({
          success: declineSuccess,
          message: declineSuccess
            ? `Load ${loadId} declined. It will be offered to other drivers.`
            : `Failed to decline load ${loadId}. It may have already expired.`,
        });

      case 'update-location':
        if (!driverId || !location || !location.lat || !location.lng) {
          return NextResponse.json(
            { error: 'Driver ID and location (lat, lng) are required' },
            { status: 400 }
          );
        }
        const locationSuccess = goWithTheFlowService.updateDriverLocation(
          driverId,
          location
        );
        return NextResponse.json({
          success: locationSuccess,
          message: locationSuccess
            ? 'Driver location updated'
            : 'Failed to update driver location',
        });

      case 'request-truck':
        if (!loadRequest) {
          return NextResponse.json(
            { error: 'Load request data is required' },
            { status: 400 }
          );
        }
        const newLoad = goWithTheFlowService.requestTruck(loadRequest);
        return NextResponse.json({
          success: true,
          load: newLoad,
          message: `Load request ${newLoad.id} submitted successfully`,
        });

      case 'rate-party':
        if (!rating || !rating.raterId || !rating.ratedId || !rating.rating) {
          return NextResponse.json(
            { error: 'Rating data (raterId, ratedId, rating) is required' },
            { status: 400 }
          );
        }
        const ratingSuccess = goWithTheFlowService.rateParty(
          rating.raterId,
          rating.ratedId,
          rating.rating,
          rating.comment || ''
        );
        return NextResponse.json({
          success: ratingSuccess,
          message: ratingSuccess
            ? 'Rating submitted successfully'
            : 'Failed to submit rating',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



































































