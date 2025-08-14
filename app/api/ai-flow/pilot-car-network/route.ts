import { NextRequest, NextResponse } from 'next/server';
import { fleetFlowPilotNetwork } from '../../../services/fleetflow-pilot-car-network';

// GET - Fetch pilot car leads, conversions, and insights
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const type = searchParams.get('type') || 'leads'; // 'leads' | 'conversions' | 'insights'
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'tenantId is required' },
        { status: 400 }
      );
    }

    let data;
    let summary;

    switch (type) {
      case 'leads':
        const leads =
          await fleetFlowPilotNetwork.generatePilotCarLeads(tenantId);
        const limitedLeads = leads.slice(0, limit);

        summary = {
          totalLeads: limitedLeads.length,
          totalPotentialValue: limitedLeads.reduce(
            (sum, lead) => sum + lead.potentialValue,
            0
          ),
          urgentCount: limitedLeads.filter((lead) => lead.priority === 'urgent')
            .length,
          newLeads: limitedLeads.filter((lead) => lead.status === 'new').length,
        };

        data = { leads: limitedLeads, summary };
        break;

      case 'conversions':
        const conversions =
          await fleetFlowPilotNetwork.getPilotCarConversions(tenantId);
        const limitedConversions = conversions.slice(0, limit);

        summary = {
          totalConversions: limitedConversions.length,
          totalRevenue: limitedConversions.reduce(
            (sum, conv) => sum + (conv.actualValue || 0),
            0
          ),
          fleetFlowMargin: limitedConversions.reduce(
            (sum, conv) => sum + conv.pilotCarDetails.fleetFlowMargin,
            0
          ),
          completedCount: limitedConversions.filter(
            (conv) => conv.status === 'completed'
          ).length,
        };

        data = { conversions: limitedConversions, summary };
        break;

      case 'insights':
        data = await fleetFlowPilotNetwork.generateMarketInsights(tenantId);
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data,
      type,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ FleetFlow Pilot Car Network API failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pilot car network data' },
      { status: 500 }
    );
  }
}

// POST - Create pilot car requests and process conversions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json(
        { success: false, error: 'action and data are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'analyze_requirements':
        result = fleetFlowPilotNetwork.analyzePilotCarRequirements(
          data.dimensions
        );
        break;

      case 'find_operators':
        result = await fleetFlowPilotNetwork.findAvailableOperators(
          data.route,
          data.timeline,
          data.requirements
        );
        break;

      case 'request_quote':
        // Generate quote based on requirements
        const analysis = fleetFlowPilotNetwork.analyzePilotCarRequirements(
          data.dimensions
        );
        const operators = await fleetFlowPilotNetwork.findAvailableOperators(
          data.route,
          data.timeline,
          analysis
        );

        result = {
          quoteId: `QUOTE-${Date.now()}`,
          requirements: analysis,
          availableOperators: operators.length,
          estimatedCost: analysis.estimatedCost,
          fleetFlowMargin: Math.round(analysis.estimatedCost * 0.33), // 33% of customer price
          operatorCost: Math.round(analysis.estimatedCost * 0.67), // 67% to operator
          timeline: {
            bookingDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
            serviceDate: data.timeline.pickupDate,
          },
        };
        break;

      case 'book_service':
        result = {
          bookingId: `FF-PILOT-${Date.now()}`,
          confirmationNumber: `FFPC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          operatorAssigned:
            data.selectedOperator || 'Auto-assigned based on availability',
          totalCost: data.quotedPrice,
          status: 'confirmed',
          trackingUrl: `https://fleetflow.app/tracking/pilot/${Date.now()}`,
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      action,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ FleetFlow Pilot Car Network POST failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process pilot car request' },
      { status: 500 }
    );
  }
}

