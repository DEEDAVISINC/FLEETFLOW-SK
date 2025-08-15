// 🚛⚡ GO WITH THE FLOW - DRIVER API ROUTES
// Driver-specific endpoints for mobile app and driver portal

import { NextRequest, NextResponse } from 'next/server';
import { goWithTheFlowService } from '../../../services/GoWithTheFlowService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const driverId = searchParams.get('driverId');

  if (!driverId) {
    return NextResponse.json(
      { error: 'Driver ID is required' },
      { status: 400 }
    );
  }

  try {
    switch (action) {
      case 'dashboard':
        const instantLoads =
          goWithTheFlowService.getInstantLoadsForDriver(driverId);
        const earnings = goWithTheFlowService.getDriverEarnings(driverId);
        const recentActivity = goWithTheFlowService.getRecentActivity();

        return NextResponse.json({
          success: true,
          dashboard: {
            instantLoads,
            earnings,
            recentActivity: recentActivity.slice(0, 5), // Last 5 activities
            loadCount: instantLoads.length,
            status: 'online', // This would come from driver status in real implementation
          },
        });

      case 'earnings':
        const driverEarnings = goWithTheFlowService.getDriverEarnings(driverId);
        return NextResponse.json({
          success: true,
          earnings: driverEarnings,
        });

      case 'instant-loads':
        const loads = goWithTheFlowService.getInstantLoadsForDriver(driverId);
        return NextResponse.json({
          success: true,
          loads,
          count: loads.length,
          message:
            loads.length > 0
              ? `${loads.length} instant load(s) available`
              : 'No loads available right now',
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow Driver API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, driverId, loadId, location, preferences, rating } = body;

    if (!driverId) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'toggle-availability':
        const currentStatus = body.status; // 'online' or 'offline'
        let success;

        if (currentStatus === 'online') {
          success = goWithTheFlowService.goOffline(driverId);
        } else {
          success = goWithTheFlowService.goOnline(driverId);
        }

        return NextResponse.json({
          success,
          newStatus: success
            ? currentStatus === 'online'
              ? 'offline'
              : 'online'
            : currentStatus,
          message: success
            ? `Driver is now ${currentStatus === 'online' ? 'offline' : 'online'}`
            : 'Failed to update driver status',
        });

      case 'update-location':
        if (
          !location ||
          typeof location.lat !== 'number' ||
          typeof location.lng !== 'number'
        ) {
          return NextResponse.json(
            { error: 'Valid location (lat, lng) is required' },
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
            ? 'Location updated successfully'
            : 'Failed to update location',
        });

      case 'accept-load':
        if (!loadId) {
          return NextResponse.json(
            { error: 'Load ID is required' },
            { status: 400 }
          );
        }

        const acceptSuccess = goWithTheFlowService.acceptLoad(driverId, loadId);
        return NextResponse.json({
          success: acceptSuccess,
          message: acceptSuccess
            ? `Load ${loadId} accepted! You're now on-load.`
            : `Failed to accept load ${loadId}. It may have expired.`,
        });

      case 'decline-load':
        if (!loadId) {
          return NextResponse.json(
            { error: 'Load ID is required' },
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

      case 'submit-rating':
        if (!rating || !rating.ratedId || typeof rating.rating !== 'number') {
          return NextResponse.json(
            { error: 'Rating data (ratedId, rating) is required' },
            { status: 400 }
          );
        }

        const ratingSuccess = goWithTheFlowService.rateParty(
          driverId,
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
    console.error('Go With the Flow Driver API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



























































