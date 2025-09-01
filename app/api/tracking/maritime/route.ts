import { NextRequest, NextResponse } from 'next/server';
import { portAuthorityService } from '../../../services/PortAuthorityService';

/**
 * Maritime Intelligence API Route
 *
 * Provides NOAD vessel data, port intelligence, and maritime analytics
 * Integrates with USCG NVMC system for real-time maritime intelligence
 *
 * Endpoints:
 * GET /api/tracking/maritime?type=summary - Maritime intelligence summary
 * GET /api/tracking/maritime?type=vessels&port=USLAX - Vessel data for specific port
 * GET /api/tracking/maritime?type=ports - Port intelligence data
 * GET /api/tracking/maritime?type=schedules&port=USLAX - Vessel schedules
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'summary';
    const port = searchParams.get('port');

    console.info(`🚢 Maritime API Request: type=${type}, port=${port}`);

    switch (type) {
      case 'summary':
        const summary =
          await portAuthorityService.getMaritimeIntelligenceSummary();
        return NextResponse.json({
          success: true,
          data: summary,
          timestamp: new Date().toISOString(),
          source: 'USCG_NVMC',
        });

      case 'vessels':
        const vessels = await portAuthorityService.getNOADVesselData(
          port || undefined
        );
        return NextResponse.json({
          success: true,
          data: {
            vessels,
            count: vessels.length,
            port: port || 'all_ports',
          },
          timestamp: new Date().toISOString(),
          source: 'USCG_NVMC',
        });

      case 'ports':
        // Get intelligence for major ports
        const majorPorts = ['USLAX', 'USNYK', 'USMIA', 'USSAV', 'USSEA'];
        const portPromises = majorPorts.map(async (portCode) => {
          try {
            return await portAuthorityService.getEnhancedPortIntelligence(
              portCode
            );
          } catch (error) {
            console.error(
              `Error fetching port intelligence for ${portCode}:`,
              error
            );
            return null;
          }
        });

        const portIntelligence = (await Promise.all(portPromises)).filter(
          Boolean
        );

        return NextResponse.json({
          success: true,
          data: {
            ports: portIntelligence,
            count: portIntelligence.length,
          },
          timestamp: new Date().toISOString(),
          source: 'USCG_NVMC',
        });

      case 'schedules':
        const schedules = await portAuthorityService.getVesselSchedulesNOAD(
          port || undefined
        );
        return NextResponse.json({
          success: true,
          data: {
            schedules,
            count: schedules.length,
            port: port || 'all_ports',
          },
          timestamp: new Date().toISOString(),
          source: 'USCG_NVMC',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid request type',
            validTypes: ['summary', 'vessels', 'ports', 'schedules'],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Maritime Intelligence API Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch maritime intelligence data',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    console.info(`🚢 Maritime API POST Request: action=${action}`);

    switch (action) {
      case 'submit_noad':
        // Submit NOAD notice (for vessel operators)
        const noticeId = `NOAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // In production, this would submit to USCG NVMC API
        console.info('NOAD Notice submitted:', noticeId, data);

        return NextResponse.json({
          success: true,
          data: {
            noticeId,
            status: 'submitted',
            submittedAt: new Date().toISOString(),
          },
          message: 'NOAD notice submitted successfully',
        });

      case 'update_vessel_status':
        // Update vessel status (for real-time tracking)
        const { vesselId, status, location } = data;

        console.info('Vessel status update:', { vesselId, status, location });

        return NextResponse.json({
          success: true,
          data: {
            vesselId,
            status,
            location,
            updatedAt: new Date().toISOString(),
          },
          message: 'Vessel status updated successfully',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            validActions: ['submit_noad', 'update_vessel_status'],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Maritime Intelligence API POST Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process maritime intelligence request',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
