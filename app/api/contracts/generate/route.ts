import { NextRequest, NextResponse } from 'next/server';
// TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
// import { contractGenerationService, LeadContractData } from '../../../services/ContractGenerationService';

export async function POST(req: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
    return NextResponse.json({
      success: true,
      message:
        'Contract generation temporarily disabled for emergency deployment',
      note: 'Feature will be re-enabled after deployment fixes',
    });

    const {
      leadId,
      brokerId,
      brokerName,
      brokerCompany,
      shipperId,
      shipperName,
      shipperCompany,
      source,
      potentialValue,
      conversionType,
      tenantId,
      contractTerms,
    } = body;

    // Validate required fields
    if (
      !leadId ||
      !brokerId ||
      !brokerName ||
      !brokerCompany ||
      !shipperId ||
      !shipperName ||
      !shipperCompany ||
      !source ||
      !tenantId
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: leadId, brokerId, brokerName, brokerCompany, shipperId, shipperName, shipperCompany, source, tenantId',
        },
        { status: 400 }
      );
    }

    // Prepare contract data
    const contractData: LeadContractData = {
      leadId,
      brokerId,
      brokerName,
      brokerCompany,
      shipperId,
      shipperName,
      shipperCompany,
      source,
      potentialValue: potentialValue || 0,
      conversionType: conversionType || 'quote_accepted',
      tenantId,
      contractTerms: contractTerms || {
        commissionRate: 5.0,
        paymentTerms: 'Net 15 days',
        contractDuration: '1 year with auto-renewal',
        exclusivity: false,
        territory: 'United States',
      },
    };

    // Generate contract
    const contract =
      await contractGenerationService.generateLeadContract(contractData);

    return NextResponse.json({
      success: true,
      contract,
      message: 'Contract generated successfully',
    });
  } catch (error: any) {
    console.error('Contract generation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get('tenantId');
    const contractId = searchParams.get('contractId');

    if (!tenantId) {
      return NextResponse.json(
        {
          success: false,
          error: 'tenantId is required',
        },
        { status: 400 }
      );
    }

    if (contractId) {
      // Get specific contract
      const contract = await contractGenerationService.getContract(contractId);

      if (!contract) {
        return NextResponse.json(
          {
            success: false,
            error: 'Contract not found',
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        contract,
      });
    } else {
      // Get all contracts for tenant
      const contracts =
        await contractGenerationService.getContractsByTenant(tenantId);

      return NextResponse.json({
        success: true,
        contracts,
        count: contracts.length,
      });
    }
  } catch (error: any) {
    console.error('Contract retrieval API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
