import { NextRequest, NextResponse } from 'next/server';
import AutomotiveRelationshipTracker from '../../services/AutomotiveRelationshipTracker';

// Singleton instance for persistence during development
let relationshipTracker: AutomotiveRelationshipTracker | null = null;

function getRelationshipTracker(): AutomotiveRelationshipTracker {
  if (!relationshipTracker) {
    relationshipTracker = new AutomotiveRelationshipTracker();
  }
  return relationshipTracker;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tracker = getRelationshipTracker();

    switch (action) {
      case 'contacts':
        const priority = searchParams.get('priority') as any;
        const contacts = tracker.getPrioritizedContacts(priority);
        return NextResponse.json({
          success: true,
          data: contacts,
          total: contacts.length,
        });

      case 'metrics':
        const metrics = tracker.getRelationshipMetrics();
        return NextResponse.json({
          success: true,
          data: metrics,
        });

      case 'recommendations':
        const recommendations = tracker.getOutreachRecommendations();
        return NextResponse.json({
          success: true,
          data: recommendations,
        });

      case 'followups':
        const followUps = tracker.getFollowUpContacts();
        return NextResponse.json({
          success: true,
          data: followUps,
          total: followUps.length,
        });

      case 'export':
        const exportData = tracker.exportData();
        return NextResponse.json({
          success: true,
          data: exportData,
          timestamp: new Date().toISOString(),
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action parameter',
            availableActions: [
              'contacts',
              'metrics',
              'recommendations',
              'followups',
              'export',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('🚨 Automotive relationships GET API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve relationship data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    const tracker = getRelationshipTracker();

    switch (action) {
      case 'add_contact':
        const contactId = tracker.addContact(data);
        return NextResponse.json({
          success: true,
          data: { contactId },
          message: 'Contact added successfully',
        });

      case 'record_outreach':
        const campaignId = tracker.recordOutreach(data);
        return NextResponse.json({
          success: true,
          data: { campaignId },
          message: 'Outreach campaign recorded successfully',
        });

      case 'record_response':
        const { campaignId: responseCampaignId, responseData } = data;
        tracker.recordResponse(responseCampaignId, responseData);
        return NextResponse.json({
          success: true,
          message: 'Response recorded successfully',
        });

      case 'create_opportunity':
        const opportunityId = tracker.createOpportunity(data);
        return NextResponse.json({
          success: true,
          data: { opportunityId },
          message: 'Opportunity created successfully',
        });

      case 'sync_rfp_discovery':
        const { userId = 'relationship-sync' } = data;
        const syncResult = await tracker.syncWithRFPDiscovery(userId);
        return NextResponse.json({
          success: true,
          data: syncResult,
          message: 'RFP discovery sync completed successfully',
        });

      case 'bulk_outreach':
        const { campaigns } = data;
        const results = campaigns.map((campaign: any) => {
          try {
            const campaignId = tracker.recordOutreach(campaign);
            return { success: true, campaignId, contactId: campaign.contactId };
          } catch (error) {
            return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
              contactId: campaign.contactId,
            };
          }
        });

        const successCount = results.filter((r: any) => r.success).length;
        const failureCount = results.filter((r: any) => !r.success).length;

        return NextResponse.json({
          success: true,
          data: {
            results,
            summary: {
              total: campaigns.length,
              successful: successCount,
              failed: failureCount,
              successRate: (successCount / campaigns.length) * 100,
            },
          },
          message: `Bulk outreach completed: ${successCount} successful, ${failureCount} failed`,
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action parameter',
            availableActions: [
              'add_contact',
              'record_outreach',
              'record_response',
              'create_opportunity',
              'sync_rfp_discovery',
              'bulk_outreach',
            ],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('🚨 Automotive relationships POST API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process relationship action',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { contactId, updateData } = body;
    const tracker = getRelationshipTracker();

    // Get existing contact
    const contacts = tracker.getPrioritizedContacts();
    const existingContact = contacts.find((c) => c.id === contactId);

    if (!existingContact) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact not found',
        },
        { status: 404 }
      );
    }

    // Update contact (simplified - in production would have proper update method)
    const updatedContact = { ...existingContact, ...updateData };

    // For now, we'll need to access the private contacts map
    // In production, this would be a proper update method
    (tracker as any).contacts.set(contactId, updatedContact);

    return NextResponse.json({
      success: true,
      data: updatedContact,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('🚨 Automotive relationships PUT API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update contact',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
