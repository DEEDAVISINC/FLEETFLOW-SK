import { NextRequest, NextResponse } from 'next/server';
import { salesEmailAutomation } from '../../../services/SalesEmailAutomationService';

// 🎯 SALES EMAIL AUTOMATION API ENDPOINTS
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'engage_lead':
        const leadResult = await salesEmailAutomation.engageNewLead(data.lead);
        return NextResponse.json({
          success: true,
          result: leadResult,
          message: 'Lead engagement email sent successfully',
        });

      case 'schedule_appointment':
        const appointmentResult =
          await salesEmailAutomation.scheduleAppointment(
            data.lead,
            data.preferredTimes
          );
        return NextResponse.json({
          success: true,
          result: appointmentResult,
          message: 'Appointment scheduling email sent successfully',
        });

      case 'qualify_lead':
        const qualification = await salesEmailAutomation.qualifyLead(
          data.leadData
        );
        return NextResponse.json({
          success: true,
          qualification,
          message: 'Lead qualification completed',
        });

      case 'track_performance':
        const metrics = await salesEmailAutomation.trackEmailPerformance(
          data.leadId
        );
        return NextResponse.json({
          success: true,
          metrics,
          message: 'Email performance metrics retrieved',
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Sales email automation error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for email automation status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (leadId) {
      const metrics = await salesEmailAutomation.trackEmailPerformance(leadId);
      return NextResponse.json({
        success: true,
        metrics,
        leadId,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Sales email automation service is operational',
      features: [
        'Lead engagement automation',
        'Appointment scheduling',
        'Lead qualification',
        'Follow-up sequences',
        'Performance tracking',
      ],
    });
  } catch (error) {
    console.error('Sales email automation status error:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}




















