import { NextRequest, NextResponse } from 'next/server';
import { contractGenerationService } from '../../../services/ContractGenerationService';

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

    // Track revenue and calculate commission
    await contractGenerationService.trackRevenue(contractId, revenue, transactionId);

    // Calculate commission (5% of revenue)
    const commission = revenue * 0.05;

    // Get updated contract for response
    const contract = await contractGenerationService.getContract(contractId);

    return NextResponse.json({
      success: true,
      revenue,
      commission,
      transactionId,
      contract,
      message: 'Revenue tracked successfully'
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
    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('contractId');
    const tenantId = searchParams.get('tenantId');

    if (!contractId && !tenantId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Either contractId or tenantId is required' 
        },
        { status: 400 }
      );
    }

    if (contractId) {
      // Get revenue tracking for specific contract
      const contract = await contractGenerationService.getContract(contractId);
      
      if (!contract) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Contract not found' 
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        revenueTracking: contract.revenueTracking,
        contract
      });
    } else {
      // Get revenue summary for tenant
      const contracts = await contractGenerationService.getContractsByTenant(tenantId!);
      
      const revenueSummary = contracts.reduce((summary, contract) => {
        summary.totalRevenue += contract.revenueTracking.totalRevenue;
        summary.totalCommission += contract.revenueTracking.commissionEarned;
        summary.activeContracts += contract.status === 'active' ? 1 : 0;
        summary.pendingContracts += contract.status === 'pending_signature' ? 1 : 0;
        return summary;
      }, {
        totalRevenue: 0,
        totalCommission: 0,
        activeContracts: 0,
        pendingContracts: 0,
        totalContracts: contracts.length
      });

      return NextResponse.json({
        success: true,
        revenueSummary,
        contracts: contracts.map(c => ({
          contractId: c.contractId,
          contractNumber: c.contractNumber,
          status: c.status,
          totalRevenue: c.revenueTracking.totalRevenue,
          commissionEarned: c.revenueTracking.commissionEarned,
          nextPaymentDate: c.revenueTracking.nextPaymentDate
        }))
      });
    }

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