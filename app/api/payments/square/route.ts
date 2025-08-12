import { NextRequest, NextResponse } from 'next/server';
import SquareService from '../../../services/SquareService';

const squareService = new SquareService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'process-payment':
        return await handleProcessPayment(body);

      case 'create-customer':
        return await handleCreateCustomer(body);

      case 'create-order':
        return await handleCreateOrder(body);

      case 'get-payment':
        return await handleGetPayment(body);

      case 'refund-payment':
        return await handleRefundPayment(body);

      case 'get-locations':
        return await handleGetLocations();

      case 'get-config':
        return await handleGetConfig();

      // Invoice actions
      case 'create-invoice':
        return await handleCreateInvoice(body);

      case 'publish-invoice':
        return await handlePublishInvoice(body);

      case 'get-invoice':
        return await handleGetInvoice(body);

      case 'cancel-invoice':
        return await handleCancelInvoice(body);

      case 'list-invoices':
        return await handleListInvoices(body);

      case 'create-fleetflow-invoice':
        return await handleCreateFleetFlowInvoice(body);

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Square API route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

async function handleProcessPayment(body: any) {
  const {
    amount,
    currency,
    sourceId,
    customerId,
    orderId,
    description,
    metadata,
  } = body;

  if (!amount || !sourceId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Amount and source ID are required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.processPayment({
    amount: Math.round(amount * 100), // Convert to cents
    currency: currency || 'USD',
    sourceId,
    customerId,
    orderId,
    description,
    metadata,
  });

  return NextResponse.json(result);
}

async function handleCreateCustomer(body: any) {
  const { customer } = body;

  if (!customer) {
    return NextResponse.json(
      {
        success: false,
        message: 'Customer data is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.createCustomer(customer);
  return NextResponse.json(result);
}

async function handleCreateOrder(body: any) {
  const { order } = body;

  if (!order || !order.locationId || !order.lineItems) {
    return NextResponse.json(
      {
        success: false,
        message: 'Order with locationId and lineItems is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.createOrder(order);
  return NextResponse.json(result);
}

async function handleGetPayment(body: any) {
  const { paymentId } = body;

  if (!paymentId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Payment ID is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.getPayment(paymentId);
  return NextResponse.json(result);
}

async function handleRefundPayment(body: any) {
  const { paymentId, amount, reason } = body;

  if (!paymentId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Payment ID is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.refundPayment(
    paymentId,
    amount ? Math.round(amount * 100) : undefined, // Convert to cents if provided
    reason
  );
  return NextResponse.json(result);
}

async function handleGetLocations() {
  const result = await squareService.getLocations();
  return NextResponse.json(result);
}

async function handleGetConfig() {
  const config = squareService.getPaymentFormConfig();
  return NextResponse.json({
    success: true,
    config,
  });
}

// ========================================
// INVOICE HANDLER FUNCTIONS
// ========================================

async function handleCreateInvoice(body: any) {
  const { invoiceData } = body;

  if (!invoiceData) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invoice data is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.createInvoice(invoiceData);
  return NextResponse.json(result);
}

async function handlePublishInvoice(body: any) {
  const { invoiceId, version } = body;

  if (!invoiceId || !version) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invoice ID and version are required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.publishInvoice(invoiceId, version);
  return NextResponse.json(result);
}

async function handleGetInvoice(body: any) {
  const { invoiceId } = body;

  if (!invoiceId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invoice ID is required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.getInvoice(invoiceId);
  return NextResponse.json(result);
}

async function handleCancelInvoice(body: any) {
  const { invoiceId, version } = body;

  if (!invoiceId || !version) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invoice ID and version are required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.cancelInvoice(invoiceId, version);
  return NextResponse.json(result);
}

async function handleListInvoices(body: any) {
  const { filters } = body;
  const result = await squareService.listInvoices(filters);
  return NextResponse.json(result);
}

async function handleCreateFleetFlowInvoice(body: any) {
  const {
    customerId,
    invoiceTitle,
    description,
    lineItems,
    dueDate,
    customFields,
  } = body;

  if (!customerId || !invoiceTitle || !lineItems) {
    return NextResponse.json(
      {
        success: false,
        message: 'Customer ID, invoice title, and line items are required',
      },
      { status: 400 }
    );
  }

  const result = await squareService.createFleetFlowInvoice({
    customerId,
    invoiceTitle,
    description: description || `${invoiceTitle} - FleetFlow Services`,
    lineItems,
    dueDate,
    customFields,
  });

  return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'get-config':
        return await handleGetConfig();

      case 'get-locations':
        return await handleGetLocations();

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid action specified',
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Square API GET route error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
