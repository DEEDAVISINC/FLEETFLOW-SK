import {
  WarehouseQuoteRequest,
  warehousingService,
} from '@/app/services/warehousing-service';

export async function POST(request: Request) {
  try {
    const quoteRequest: WarehouseQuoteRequest = await request.json();

    // Generate warehouse quotes
    const quotes = warehousingService.generateWarehouseQuote(quoteRequest);

    return Response.json({
      success: true,
      quotes,
      message: 'Warehouse quotes generated successfully',
    });
  } catch (error) {
    console.error('Warehousing quote generation error:', error);

    return Response.json(
      {
        success: false,
        error: 'Failed to generate warehouse quotes',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'warehouses':
        const warehouses = warehousingService.getAllWarehouses();
        return Response.json({ success: true, warehouses });

      case 'services':
        const services = warehousingService.getAllServices();
        return Response.json({ success: true, services });

      case 'utilization':
        const utilization = warehousingService.getWarehouseUtilization();
        return Response.json({ success: true, utilization });

      case 'pricing':
        const pricing = warehousingService.getServicePricing();
        return Response.json({ success: true, pricing });

      default:
        return Response.json(
          {
            success: false,
            error: 'Invalid action parameter',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Warehousing API error:', error);

    return Response.json(
      {
        success: false,
        error: 'API request failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
