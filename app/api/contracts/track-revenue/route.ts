import { NextRequest, NextResponse } from 'next/server';
// TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
// import { contractGenerationService } from '../../../services/ContractGenerationService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      contractId,
      revenue,
      transactionId,
      invoiceNumber,
      invoiceDate,
      paymentStatus,
      description
    } = body;

    // Validate required fields
    if (!contractId || !revenue || !transactionId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: contractId, revenue, transactionId' 
        },
        { status: 400 }
      );
    }

    // Validate revenue amount
    if (typeof revenue !== 'number' || revenue <= 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Revenue must be a positive number' 
        },
        { status: 400 }
      );
    }

    // TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
    return NextResponse.json({
      success: true,
      message: 'Contract revenue tracking temporarily disabled for emergency deployment',
      note: 'Feature will be re-enabled after deployment fixes'
    });

  } catch (error: any) {
    console.error('Revenue tracking API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
    return NextResponse.json({
      success: true,
      message: 'Contract revenue tracking temporarily disabled for emergency deployment',
      note: 'Feature will be re-enabled after deployment fixes'
    });

  } catch (error: any) {
    console.error('Revenue tracking retrieval API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
} 