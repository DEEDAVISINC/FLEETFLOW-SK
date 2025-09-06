import { NextRequest, NextResponse } from 'next/server';
import DEPOINTELeadIntelligenceService from '../../services/DEPOINTELeadIntelligenceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    const leadService = DEPOINTELeadIntelligenceService.getInstance();

    switch (action) {
      case 'search': {
        const criteria = {
          industry: searchParams.get('industry')?.split(',').filter(Boolean),
          revenue: searchParams.get('revenue')?.split(',').filter(Boolean),
          employees: searchParams.get('employees')?.split(',').filter(Boolean),
          location: searchParams.get('location')?.split(',').filter(Boolean),
          verificationStatus: searchParams
            .get('verificationStatus')
            ?.split(',')
            .filter(Boolean),
          minLeadScore: searchParams.get('minLeadScore')
            ? parseInt(searchParams.get('minLeadScore')!)
            : undefined,
          maxLeadScore: searchParams.get('maxLeadScore')
            ? parseInt(searchParams.get('maxLeadScore')!)
            : undefined,
          buyingSignals: searchParams
            .get('buyingSignals')
            ?.split(',')
            .filter(Boolean),
          equipmentTypes: searchParams
            .get('equipmentTypes')
            ?.split(',')
            .filter(Boolean),
          keywords: searchParams.get('keywords') || undefined,
          assignedTo: searchParams
            .get('assignedTo')
            ?.split(',')
            .filter(Boolean),
        };

        const leads = await leadService.searchLeads(criteria);
        return NextResponse.json({ success: true, data: leads });
      }

      case 'analytics': {
        const analytics = await leadService.getAnalytics();
        return NextResponse.json({ success: true, data: analytics });
      }

      case 'lead': {
        const leadId = searchParams.get('id');
        if (!leadId) {
          return NextResponse.json(
            { error: 'Lead ID required' },
            { status: 400 }
          );
        }

        const lead = await leadService.getLeadById(leadId);
        if (!lead) {
          return NextResponse.json(
            { error: 'Lead not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: lead });
      }

      case 'export': {
        const leadIds =
          searchParams.get('leadIds')?.split(',').filter(Boolean) || [];
        const csvData = await leadService.exportLeads(leadIds);

        return new NextResponse(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="depointe-leads.csv"',
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('DEPOINTE Leads API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...payload } = await request.json();
    const leadService = DEPOINTELeadIntelligenceService.getInstance();

    switch (action) {
      case 'verify': {
        const { leadId } = payload;
        if (!leadId) {
          return NextResponse.json(
            { error: 'Lead ID required' },
            { status: 400 }
          );
        }

        const verificationResult = await leadService.verifyLead(leadId);
        return NextResponse.json({ success: true, data: verificationResult });
      }

      case 'assign': {
        const { leadId, staffMember } = payload;
        if (!leadId || !staffMember) {
          return NextResponse.json(
            { error: 'Lead ID and staff member required' },
            { status: 400 }
          );
        }

        const success = await leadService.assignLead(leadId, staffMember);
        return NextResponse.json({
          success,
          message: success
            ? 'Lead assigned successfully'
            : 'Failed to assign lead',
        });
      }

      case 'enrich': {
        const { leadId } = payload;
        if (!leadId) {
          return NextResponse.json(
            { error: 'Lead ID required' },
            { status: 400 }
          );
        }

        const enrichedLead = await leadService.enrichLeadData(leadId);
        if (!enrichedLead) {
          return NextResponse.json(
            { error: 'Lead not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({ success: true, data: enrichedLead });
      }

      case 'bulk_assign': {
        const { leadIds, staffMember } = payload;
        if (!leadIds?.length || !staffMember) {
          return NextResponse.json(
            { error: 'Lead IDs and staff member required' },
            { status: 400 }
          );
        }

        const results = await Promise.all(
          leadIds.map((leadId: string) =>
            leadService.assignLead(leadId, staffMember)
          )
        );

        const successCount = results.filter(Boolean).length;
        return NextResponse.json({
          success: true,
          message: `${successCount}/${leadIds.length} leads assigned successfully`,
        });
      }

      case 'bulk_verify': {
        const { leadIds } = payload;
        if (!leadIds?.length) {
          return NextResponse.json(
            { error: 'Lead IDs required' },
            { status: 400 }
          );
        }

        const verificationResults = await Promise.all(
          leadIds.map((leadId: string) => leadService.verifyLead(leadId))
        );

        return NextResponse.json({ success: true, data: verificationResults });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('DEPOINTE Leads API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { leadId, updates } = await request.json();

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    const leadService = DEPOINTELeadIntelligenceService.getInstance();
    const lead = await leadService.getLeadById(leadId);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update lead with new data
    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, this would update the database
    // For now, we'll just return the updated lead

    return NextResponse.json({ success: true, data: updatedLead });
  } catch (error) {
    console.error('DEPOINTE Leads Update Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // In a real implementation, this would delete from the database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('DEPOINTE Leads Delete Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}



