// Dispatch Fee Collection API Routes
// Handles payment processing for carriers/drivers paying dispatch fees to their companies
// INTEGRATED WITH EXISTING DISPATCH INVOICE SYSTEM

import { NextRequest, NextResponse } from 'next/server';
import {
  DispatchFeeCollectionService,
  type DispatchFeePayment,
} from '../../services/dispatch-fee-collection/DispatchFeeCollectionService';

const dispatchFeeService = new DispatchFeeCollectionService();

// GET - Retrieve dispatch fee payments and metrics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'payments':
        const filters = {
          companyId: searchParams.get('companyId') || undefined,
          carrierId: searchParams.get('carrierId') || undefined,
          driverId: searchParams.get('driverId') || undefined,
          invoiceId: searchParams.get('invoiceId') || undefined,
          status:
            (searchParams.get('status') as DispatchFeePayment['status']) ||
            undefined,
          startDate: searchParams.get('startDate')
            ? new Date(searchParams.get('startDate')!)
            : undefined,
          endDate: searchParams.get('endDate')
            ? new Date(searchParams.get('endDate')!)
            : undefined,
        };

        const payments =
          await dispatchFeeService.getDispatchFeePayments(filters);
        return NextResponse.json({ success: true, data: payments });

      case 'metrics':
        const timeframe =
          (searchParams.get('timeframe') as
            | 'day'
            | 'week'
            | 'month'
            | 'year') || 'month';
        const metrics =
          await dispatchFeeService.getDispatchFeeMetrics(timeframe);
        return NextResponse.json({ success: true, data: metrics });

      case 'config':
        const config = dispatchFeeService.getConfig();
        return NextResponse.json({ success: true, data: config });

      case 'company':
        const companyId = searchParams.get('companyId');
        if (!companyId) {
          return NextResponse.json(
            { success: false, error: 'Company ID required' },
            { status: 400 }
          );
        }
        const company =
          await dispatchFeeService.getDispatchFeeCompany(companyId);
        return NextResponse.json({ success: true, data: company });

      case 'invoice_payment_status':
        const invoiceId = searchParams.get('invoiceId');
        if (!invoiceId) {
          return NextResponse.json(
            { success: false, error: 'Invoice ID required' },
            { status: 400 }
          );
        }
        const paymentStatus =
          await dispatchFeeService.getInvoicePaymentStatus(invoiceId);
        return NextResponse.json({ success: true, data: paymentStatus });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in dispatch fee collection GET:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create dispatch fee payment or company
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'create_payment_from_invoice':
        const { invoiceId, paymentData } = data;
        if (!invoiceId) {
          return NextResponse.json(
            { success: false, error: 'Invoice ID required' },
            { status: 400 }
          );
        }
        const payment = await dispatchFeeService.createPaymentFromInvoice(
          invoiceId,
          paymentData
        );
        return NextResponse.json({ success: true, data: payment });

      case 'process_payment':
        const { paymentId } = data;
        // Implementation would retrieve payment by ID
        const mockPayment: DispatchFeePayment = {
          id: paymentId,
          invoiceId: data.invoiceId,
          loadId: data.loadId,
          carrierId: data.carrierId,
          driverId: data.driverId,
          companyId: data.companyId,
          amount: data.amount,
          feePercentage: data.feePercentage,
          loadAmount: data.loadAmount,
          paymentMethod: data.paymentMethod,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await dispatchFeeService.processPayment(mockPayment);
        return NextResponse.json({ success: true, data: result });

      case 'create_company':
        const company = await dispatchFeeService.createDispatchFeeCompany(data);
        return NextResponse.json({ success: true, data: company });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in dispatch fee collection POST:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update dispatch fee company or configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'update_company':
        const { companyId, updates } = data;
        const updatedCompany =
          await dispatchFeeService.updateDispatchFeeCompany(companyId, updates);
        return NextResponse.json({ success: true, data: updatedCompany });

      case 'update_config':
        dispatchFeeService.updateConfig(data);
        return NextResponse.json({
          success: true,
          message: 'Configuration updated',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in dispatch fee collection PUT:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
