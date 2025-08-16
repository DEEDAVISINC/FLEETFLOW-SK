import { NextRequest, NextResponse } from 'next/server';
import { loadBookingAI } from '../../services/LoadBookingAIService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'opportunities': {
        const minRPM = searchParams.get('minRPM');
        const equipment = searchParams.get('equipment');
        const maxMiles = searchParams.get('maxMiles');
        const source = searchParams.get('source');

        const filters = {
          ...(minRPM && { minRPM: parseFloat(minRPM) }),
          ...(equipment && { equipment: equipment.split(',') }),
          ...(maxMiles && { maxMiles: parseInt(maxMiles) }),
          ...(source && { source: source.split(',') }),
        };

        const opportunities = await loadBookingAI.getLoadOpportunities(filters);
        return NextResponse.json({ success: true, opportunities });
      }

      case 'metrics': {
        const metrics = await loadBookingAI.getBookingMetrics();
        return NextResponse.json({ success: true, metrics });
      }

      case 'settings': {
        const settings = loadBookingAI.getSettings();
        return NextResponse.json({ success: true, settings });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action. Use: opportunities, metrics, or settings',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Load Booking API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...data } = await request.json();

    switch (action) {
      case 'auto-book': {
        const result = await loadBookingAI.autoBookLoads();
        return NextResponse.json({ success: true, result });
      }

      case 'book-load': {
        const { loadId } = data;
        if (!loadId) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load ID is required',
            },
            { status: 400 }
          );
        }

        // Get the load opportunity
        const opportunities = await loadBookingAI.getLoadOpportunities();
        const load = opportunities.find((l) => l.id === loadId);

        if (!load) {
          return NextResponse.json(
            {
              success: false,
              error: 'Load not found',
            },
            { status: 404 }
          );
        }

        const result = await loadBookingAI.bookLoad(load);
        return NextResponse.json({ success: true, result });
      }

      case 'update-settings': {
        const { settings } = data;
        if (!settings) {
          return NextResponse.json(
            {
              success: false,
              error: 'Settings are required',
            },
            { status: 400 }
          );
        }

        loadBookingAI.updateSettings(settings);
        return NextResponse.json({
          success: true,
          message: 'Settings updated successfully',
        });
      }

      default:
        return NextResponse.json(
          {
            success: false,
            error:
              'Invalid action. Use: auto-book, book-load, or update-settings',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI Load Booking API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
