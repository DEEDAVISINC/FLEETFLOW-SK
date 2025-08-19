// 🚛⚡ GO WITH THE FLOW - ADMIN/DISPATCHER API ROUTES
// Admin and dispatcher endpoints for system management

import { NextRequest, NextResponse } from 'next/server';
import { goWithTheFlowService } from '../../../services/GoWithTheFlowService';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'system-overview':
        const metrics = goWithTheFlowService.getSystemMetrics();
        const availableDrivers = goWithTheFlowService.getAvailableDrivers();
        const liveLoads = goWithTheFlowService.getLiveLoads();
        const matchingQueue = goWithTheFlowService.getMatchingQueue();
        const recentActivity = goWithTheFlowService.getRecentActivity();

        return NextResponse.json({
          success: true,
          overview: {
            metrics,
            availableDrivers: availableDrivers.length,
            liveLoads: liveLoads.length,
            matchingQueue: matchingQueue.length,
            recentActivity,
          },
        });

      case 'driver-management':
        const drivers = goWithTheFlowService.getAvailableDrivers();
        return NextResponse.json({
          success: true,
          drivers: drivers.map((driver) => ({
            id: driver.id,
            name: driver.name,
            status: driver.status,
            location: driver.location,
            equipmentType: driver.equipmentType,
            hoursRemaining: driver.hoursRemaining,
            currentLoadId: driver.currentLoadId,
            preferences: driver.preferences,
          })),
          totalDrivers: drivers.length,
        });

      case 'load-management':
        const loads = goWithTheFlowService.getLiveLoads();
        return NextResponse.json({
          success: true,
          loads: loads.map((load) => ({
            id: load.id,
            origin: load.origin,
            destination: load.destination,
            rate: load.rate,
            status: load.status,
            assignedDriverId: load.assignedDriverId,
            urgency: load.urgency,
            equipmentType: load.equipmentType,
            offerExpiresAt: load.offerExpiresAt,
          })),
          totalLoads: loads.length,
        });

      case 'matching-status':
        const queue = goWithTheFlowService.getMatchingQueue();
        return NextResponse.json({
          success: true,
          matchingQueue: queue.map((item) => ({
            loadId: item.load.id,
            loadOrigin: item.load.origin.address,
            loadDestination: item.load.destination.address,
            loadRate: item.load.rate,
            loadUrgency: item.load.urgency,
            potentialDrivers: item.potentialDrivers.length,
          })),
          queueLength: queue.length,
        });

      case 'system-metrics':
        const systemMetrics = goWithTheFlowService.getSystemMetrics();
        return NextResponse.json({
          success: true,
          metrics: systemMetrics,
        });

      case 'activity-feed':
        const activity = goWithTheFlowService.getRecentActivity();
        return NextResponse.json({
          success: true,
          activity,
          count: activity.length,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow Admin API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, driverId, loadId, data } = body;

    switch (action) {
      case 'force-driver-online':
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
            ? `Driver ${driverId} forced online`
            : `Failed to force driver ${driverId} online`,
        });

      case 'force-driver-offline':
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
            ? `Driver ${driverId} forced offline`
            : `Failed to force driver ${driverId} offline`,
        });

      case 'manual-load-assignment':
        if (!driverId || !loadId) {
          return NextResponse.json(
            { error: 'Driver ID and Load ID are required' },
            { status: 400 }
          );
        }

        // This would be a manual assignment bypassing the matching algorithm
        const assignSuccess = goWithTheFlowService.acceptLoad(driverId, loadId);
        return NextResponse.json({
          success: assignSuccess,
          message: assignSuccess
            ? `Load ${loadId} manually assigned to driver ${driverId}`
            : `Failed to assign load ${loadId} to driver ${driverId}`,
        });

      case 'emergency-broadcast':
        if (!data || !data.message) {
          return NextResponse.json(
            { error: 'Broadcast message is required' },
            { status: 400 }
          );
        }

        // This would send an emergency message to all online drivers
        const drivers = goWithTheFlowService.getAvailableDrivers();
        drivers.forEach((driver) => {
          goWithTheFlowService.sendPushNotification(
            driver.id,
            `🚨 EMERGENCY BROADCAST: ${data.message}`
          );
        });

        return NextResponse.json({
          success: true,
          message: `Emergency broadcast sent to ${drivers.length} online drivers`,
          recipientCount: drivers.length,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Go With the Flow Admin API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

















































































