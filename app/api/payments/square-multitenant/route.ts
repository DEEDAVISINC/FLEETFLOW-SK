import { NextRequest, NextResponse } from 'next/server';
import MultiTenantSquareService from '../../../services/MultiTenantSquareService';

const multiTenantSquareService = new MultiTenantSquareService();

/**
 * Extract tenant ID from request
 * In production, this would come from JWT token, session, or headers
 */
function getTenantId(request: NextRequest): string | null {
  // Method 1: From headers
  const tenantIdHeader = request.headers.get('x-tenant-id');
  if (tenantIdHeader) return tenantIdHeader;

  // Method 2: From query parameters (for demo)
  const url = new URL(request.url);
  const tenantIdParam = url.searchParams.get('tenantId');
  if (tenantIdParam) return tenantIdParam;

  // Method 3: From JWT token (recommended for production)
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    try {
      // In production, decode JWT and extract tenant ID
      // const token = authHeader.replace('Bearer ', '');
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // return decoded.tenantId;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
    }
  }

  // Method 4: From cookie (alternative)
  const cookies = request.cookies;
  const tenantIdCookie = cookies.get('tenantId');
  if (tenantIdCookie) return tenantIdCookie.value;

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tenant ID is required for multi-tenant Square operations',
          error: 'TENANT_ID_MISSING',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Ensure tenantId is included in all operations
    body.tenantId = tenantId;

    switch (action) {
      case 'process-payment':
        return await handleProcessPayment(body);

      case 'create-customer':
        return await handleCreateCustomer(body);

      case 'create-invoice':
        return await handleCreateInvoice(body);

      case 'get-invoice':
        return await handleGetInvoice(body);

      case 'list-invoices':
        return await handleListInvoices(body);

      case 'create-fleetflow-invoice':
        return await handleCreateFleetFlowInvoice(body);

      case 'enable-square':
        return await handleEnableSquare(body);

      case 'disable-square':
        return await handleDisableSquare(body);

      case 'get-status':
        return await handleGetStatus(body);

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
    console.error('Multi-tenant Square API route error:', error);
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

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tenant ID is required',
          error: 'TENANT_ID_MISSING',
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'get-status':
        return await handleGetStatus({ tenantId });

      case 'list-invoices':
        return await handleListInvoices({
          tenantId,
          filters: {
            status: searchParams.get('status') || undefined,
            limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
            cursor: searchParams.get('cursor') || undefined,
          },
        });

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
    console.error('Multi-tenant Square API GET route error:', error);
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

// ========================================
// HANDLER FUNCTIONS
// ========================================

async function handleProcessPayment(body: any) {
  const {
    tenantId,
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

  const result = await multiTenantSquareService.processPayment({
    tenantId,
    amount: parseFloat(amount),
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
  const { tenantId, customer } = body;

  if (!customer) {
    return NextResponse.json(
      {
        success: false,
        message: 'Customer data is required',
      },
      { status: 400 }
    );
  }

  const result = await multiTenantSquareService.createCustomer(tenantId, customer);
  return NextResponse.json(result);
}

async function handleCreateInvoice(body: any) {
  const { tenantId, ...invoiceData } = body;

  if (!invoiceData.customerId || !invoiceData.invoiceTitle) {
    return NextResponse.json(
      {
        success: false,
        message: 'Customer ID and invoice title are required',
      },
      { status: 400 }
    );
  }

  const result = await multiTenantSquareService.createInvoice({
    tenantId,
    ...invoiceData,
  });

  return NextResponse.json(result);
}

async function handleGetInvoice(body: any) {
  const { tenantId, invoiceId } = body;

  if (!invoiceId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invoice ID is required',
      },
      { status: 400 }
    );
  }

  const result = await multiTenantSquareService.getInvoice(tenantId, invoiceId);
  return NextResponse.json(result);
}

async function handleListInvoices(body: any) {
  const { tenantId, filters } = body;
  const result = await multiTenantSquareService.listInvoices(tenantId, filters);
  return NextResponse.json(result);
}

async function handleCreateFleetFlowInvoice(body: any) {
  const {
    tenantId,
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

  // First create customer if customerId is empty
  let actualCustomerId = customerId;
  if (!actualCustomerId) {
    const customerResult = await multiTenantSquareService.createCustomer(tenantId, {
      givenName: 'FleetFlow Customer',
      companyName: `Tenant ${tenantId} Customer`,
      emailAddress: 'customer@example.com',
    });

    if (!customerResult.success) {
      return NextResponse.json({
        success: false,
        tenantId,
        error: 'Failed to create customer: ' + customerResult.error,
      });
    }

    actualCustomerId = customerResult.customerId;
  }

  const result = await multiTenantSquareService.createInvoice({
    tenantId,
    customerId: actualCustomerId,
    invoiceTitle,
    description: description || `${invoiceTitle} - FleetFlow Services`,
    lineItems,
    dueDate,
    customFields: [
      { label: 'Tenant ID', value: tenantId },
      { label: 'Platform', value: 'FleetFlow TMS' },
      ...customFields || [],
    ],
  });

  return NextResponse.json(result);
}

async function handleEnableSquare(body: any) {
  const {
    tenantId,
    applicationId,
    accessToken,
    locationId,
    environment,
  } = body;

  if (!applicationId || !accessToken || !locationId) {
    return NextResponse.json(
      {
        success: false,
        message: 'Application ID, access token, and location ID are required',
      },
      { status: 400 }
    );
  }

  const result = await multiTenantSquareService.enableSquareForTenant(tenantId, {
    applicationId,
    accessToken,
    locationId,
    environment: environment || 'sandbox',
  });

  return NextResponse.json({
    ...result,
    tenantId,
  });
}

async function handleDisableSquare(body: any) {
  const { tenantId } = body;

  await multiTenantSquareService.disableSquareForTenant(tenantId);

  return NextResponse.json({
    success: true,
    tenantId,
    message: 'Square disabled successfully',
  });
}

async function handleGetStatus(body: any) {
  const { tenantId } = body;
  const status = multiTenantSquareService.getTenantStatus(tenantId);

  return NextResponse.json({
    success: true,
    tenantId,
    status,
  });
}





























