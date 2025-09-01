import { NextRequest, NextResponse } from 'next/server';
import { VehicleInspectionService } from '../../services/VehicleInspectionService';

/**
 * 🚗 Vehicle Inspection API Routes
 * Handles CRUD operations for vehicle inspections
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create_inspection':
        return await handleCreateInspection(data);

      case 'update_item':
        return await handleUpdateItem(data);

      case 'complete_inspection':
        return await handleCompleteInspection(data);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Vehicle inspection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const vehicleId = searchParams.get('vehicleId');
    const driverId = searchParams.get('driverId');
    const inspectionId = searchParams.get('inspectionId');

    switch (action) {
      case 'get_vehicle_inspections':
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID required' },
            { status: 400 }
          );
        }
        const vehicleInspections =
          VehicleInspectionService.getVehicleInspections(vehicleId);
        return NextResponse.json({
          success: true,
          inspections: vehicleInspections,
          count: vehicleInspections.length,
        });

      case 'get_driver_inspections':
        if (!driverId) {
          return NextResponse.json(
            { error: 'Driver ID required' },
            { status: 400 }
          );
        }
        const driverInspections =
          VehicleInspectionService.getDriverInspections(driverId);
        return NextResponse.json({
          success: true,
          inspections: driverInspections,
          count: driverInspections.length,
        });

      case 'get_inspection':
        if (!inspectionId) {
          return NextResponse.json(
            { error: 'Inspection ID required' },
            { status: 400 }
          );
        }
        const inspection = VehicleInspectionService.getInspection(inspectionId);
        if (!inspection) {
          return NextResponse.json(
            { error: 'Inspection not found' },
            { status: 404 }
          );
        }
        return NextResponse.json({
          success: true,
          inspection,
        });

      case 'get_stats':
        const stats = VehicleInspectionService.getInspectionStats();
        return NextResponse.json({
          success: true,
          stats,
        });

      case 'get_deficiencies':
        const deficiencies = VehicleInspectionService.getOpenDeficiencies();
        return NextResponse.json({
          success: true,
          deficiencies,
          count: deficiencies.length,
        });

      case 'check_vehicle_safety':
        if (!vehicleId) {
          return NextResponse.json(
            { error: 'Vehicle ID required' },
            { status: 400 }
          );
        }
        const safeToOperate =
          VehicleInspectionService.isVehicleSafeToOperate(vehicleId);
        return NextResponse.json({
          success: true,
          vehicleId,
          safeToOperate,
          message: safeToOperate
            ? 'Vehicle passed recent inspection and is safe to operate'
            : 'Vehicle requires inspection or has safety issues',
        });

      case 'get_inspection_template':
        const inspectionType = searchParams.get('type') as any;
        if (!inspectionType) {
          return NextResponse.json(
            { error: 'Inspection type required' },
            { status: 400 }
          );
        }
        const template =
          VehicleInspectionService.getInspectionTemplate(inspectionType);
        return NextResponse.json({
          success: true,
          template,
          itemCount: template.length,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Vehicle inspection GET API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

async function handleCreateInspection(data: any) {
  const { vehicleId, vehicleVin, driverId, inspectionType, location } = data;

  if (!vehicleId || !vehicleVin || !driverId || !inspectionType || !location) {
    return NextResponse.json(
      {
        error:
          'Missing required fields: vehicleId, vehicleVin, driverId, inspectionType, location',
      },
      { status: 400 }
    );
  }

  try {
    const inspection = await VehicleInspectionService.createInspection(
      vehicleId,
      vehicleVin,
      driverId,
      inspectionType,
      location
    );

    console.info(`✅ Created inspection: ${inspection.id}`);

    return NextResponse.json({
      success: true,
      message: 'Inspection created successfully',
      inspection,
    });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json(
      { error: 'Failed to create inspection', details: error.message },
      { status: 500 }
    );
  }
}

async function handleUpdateItem(data: any) {
  const { inspectionId, itemId, updates } = data;

  if (!inspectionId || !itemId || !updates) {
    return NextResponse.json(
      { error: 'Missing required fields: inspectionId, itemId, updates' },
      { status: 400 }
    );
  }

  try {
    const inspection = await VehicleInspectionService.updateInspectionItem(
      inspectionId,
      itemId,
      updates
    );

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection or item not found' },
        { status: 404 }
      );
    }

    console.info(`✅ Updated inspection item: ${itemId} in ${inspectionId}`);

    return NextResponse.json({
      success: true,
      message: 'Inspection item updated successfully',
      inspection,
    });
  } catch (error) {
    console.error('Error updating inspection item:', error);
    return NextResponse.json(
      { error: 'Failed to update inspection item', details: error.message },
      { status: 500 }
    );
  }
}

async function handleCompleteInspection(data: any) {
  const { inspectionId, inspectorSignature } = data;

  if (!inspectionId || !inspectorSignature) {
    return NextResponse.json(
      { error: 'Missing required fields: inspectionId, inspectorSignature' },
      { status: 400 }
    );
  }

  try {
    const inspection = await VehicleInspectionService.completeInspection(
      inspectionId,
      inspectorSignature
    );

    if (!inspection) {
      return NextResponse.json(
        { error: 'Inspection not found' },
        { status: 404 }
      );
    }

    console.info(
      `✅ Completed inspection: ${inspectionId} with status: ${inspection.overallStatus}`
    );

    // Send notifications based on inspection results
    if (inspection.overallStatus === 'fail' || !inspection.safeToOperate) {
      console.info(
        `🚨 CRITICAL: Vehicle ${inspection.vehicleId} failed inspection - OUT OF SERVICE`
      );
      // Here you would integrate with your notification system
    }

    return NextResponse.json({
      success: true,
      message: 'Inspection completed successfully',
      inspection,
      alerts:
        inspection.overallStatus === 'fail'
          ? [
              'Vehicle failed inspection and is out of service',
              'Immediate maintenance required before operation',
            ]
          : [],
    });
  } catch (error) {
    console.error('Error completing inspection:', error);
    return NextResponse.json(
      { error: 'Failed to complete inspection', details: error.message },
      { status: 500 }
    );
  }
}
