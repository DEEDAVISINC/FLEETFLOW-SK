import { NextRequest, NextResponse } from 'next/server';
import { openELDService } from '../../../services/openeld-integration';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const driverId = searchParams.get('driverId');
    const deviceId = searchParams.get('deviceId');

    switch (action) {
      case 'devices':
        const devices = await openELDService.getDevices();
        return NextResponse.json({ success: true, devices });

      case 'drivers':
        const drivers = await openELDService.getDrivers();
        return NextResponse.json({ success: true, drivers });

      case 'driver':
        if (!driverId) {
          return NextResponse.json(
            { success: false, error: 'Driver ID required' },
            { status: 400 }
          );
        }
        const driver = await openELDService.getDriver(driverId);
        if (!driver) {
          return NextResponse.json(
            { success: false, error: 'Driver not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, driver });

      case 'device':
        if (!deviceId) {
          return NextResponse.json(
            { success: false, error: 'Device ID required' },
            { status: 400 }
          );
        }
        const device = await openELDService.getDevice(deviceId);
        if (!device) {
          return NextResponse.json(
            { success: false, error: 'Device not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, device });

      case 'current-status':
        if (!driverId) {
          return NextResponse.json(
            { success: false, error: 'Driver ID required' },
            { status: 400 }
          );
        }
        const currentStatus =
          await openELDService.getCurrentDutyStatus(driverId);
        return NextResponse.json({ success: true, currentStatus });

      case 'compliance':
        if (!driverId) {
          return NextResponse.json(
            { success: false, error: 'Driver ID required' },
            { status: 400 }
          );
        }
        const compliance = await openELDService.checkCompliance(driverId);
        return NextResponse.json({ success: true, compliance });

      case 'system-health':
        const systemHealth = await openELDService.getSystemHealth();
        return NextResponse.json({ success: true, systemHealth });

      case 'device-diagnostics':
        if (!deviceId) {
          return NextResponse.json(
            { success: false, error: 'Device ID required' },
            { status: 400 }
          );
        }
        const diagnostics = await openELDService.getDeviceDiagnostics(deviceId);
        if (!diagnostics) {
          return NextResponse.json(
            { success: false, error: 'Device diagnostics not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({ success: true, diagnostics });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('OpenELD API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'start-duty':
        const { driverId, status, location } = data;
        if (!driverId || !status || !location) {
          return NextResponse.json(
            {
              success: false,
              error: 'Driver ID, status, and location required',
            },
            { status: 400 }
          );
        }
        const startResult = await openELDService.startDutyStatus(
          driverId,
          status,
          location
        );
        return NextResponse.json({ success: startResult });

      case 'end-duty':
        const {
          driverId: endDriverId,
          status: endStatus,
          location: endLocation,
        } = data;
        if (!endDriverId || !endStatus || !endLocation) {
          return NextResponse.json(
            {
              success: false,
              error: 'Driver ID, status, and location required',
            },
            { status: 400 }
          );
        }
        const endResult = await openELDService.endDutyStatus(
          endDriverId,
          endStatus,
          endLocation
        );
        return NextResponse.json({ success: endResult });

      case 'assign-device':
        const { driverId: assignDriverId, deviceId: assignDeviceId } = data;
        if (!assignDriverId || !assignDeviceId) {
          return NextResponse.json(
            { success: false, error: 'Driver ID and device ID required' },
            { status: 400 }
          );
        }
        const assignResult = await openELDService.assignDeviceToDriver(
          assignDriverId,
          assignDeviceId
        );
        return NextResponse.json({ success: assignResult });

      case 'update-device-location':
        const { deviceId: updateDeviceId, location: updateLocation } = data;
        if (!updateDeviceId || !updateLocation) {
          return NextResponse.json(
            { success: false, error: 'Device ID and location required' },
            { status: 400 }
          );
        }
        const updateResult = await openELDService.updateDeviceLocation(
          updateDeviceId,
          updateLocation
        );
        return NextResponse.json({ success: updateResult });

      case 'sync-device':
        const { deviceId: syncDeviceId } = data;
        if (!syncDeviceId) {
          return NextResponse.json(
            { success: false, error: 'Device ID required' },
            { status: 400 }
          );
        }
        const syncResult = await openELDService.syncDeviceData(syncDeviceId);
        return NextResponse.json({ success: syncResult });

      case 'export-data':
        const { driverId: exportDriverId, startDate, endDate } = data;
        if (!exportDriverId || !startDate || !endDate) {
          return NextResponse.json(
            {
              success: false,
              error: 'Driver ID, start date, and end date required',
            },
            { status: 400 }
          );
        }
        const exportResult = await openELDService.exportELDData(
          exportDriverId,
          startDate,
          endDate
        );
        return NextResponse.json(exportResult);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('OpenELD API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
