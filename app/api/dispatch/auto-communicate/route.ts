import { NextRequest, NextResponse } from 'next/server';
// TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
// import { automatedCommunicationService } from '../../../services/AutomatedCommunicationService';

export async function POST(request: NextRequest) {
  try {
    // TEMPORARILY DISABLED FOR EMERGENCY DEPLOYMENT
    return NextResponse.json({
      success: true,
      message: 'Auto-communication temporarily disabled for emergency deployment',
      note: 'Feature will be re-enabled after deployment fixes'
    });

    // Create automation trigger
    const trigger = {
      id: `AUTO_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      loadId,
      customerId,
      customerPhone,
      triggerType,
      priority: context.priority || 'medium',
      requiresHuman: false, // Will be determined by service
      context,
    };

    // Execute automated communication with smart escalation
    const result =
      await automatedCommunicationService.executeAutomatedCommunication(
        trigger
      );

    return NextResponse.json({
      success: true,
      result,
      trigger: trigger.id,
      message: result.escalationScheduled
        ? `Escalated to human: ${result.humanAssigned}`
        : `Automated ${result.communicationType} sent successfully`,
    });
  } catch (error) {
    console.error('Automated communication failed:', error);
    return NextResponse.json(
      {
        error: 'Failed to process automated communication',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check escalation rules for a specific situation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const loadId = searchParams.get('loadId');
    const triggerType = searchParams.get('triggerType');

    if (!loadId || !triggerType) {
      return NextResponse.json(
        { error: 'loadId and triggerType are required' },
        { status: 400 }
      );
    }

    // Mock trigger for analysis
    const mockTrigger = {
      id: 'ANALYSIS',
      loadId,
      customerId: 'MOCK_CUSTOMER',
      customerPhone: '+1234567890',
      triggerType,
      priority: 'medium' as const,
      requiresHuman: false,
      context: {},
    };

    // Analyze if human would be required
    const analysis =
      await automatedCommunicationService.detectHumanRequired(mockTrigger);

    return NextResponse.json({
      loadId,
      triggerType,
      analysis,
      recommendation: analysis.requiresHuman
        ? `Human required: ${analysis.reason}`
        : 'Suitable for automation',
    });
  } catch (error) {
    console.error('Escalation analysis failed:', error);
    return NextResponse.json(
      { error: 'Failed to analyze escalation requirements' },
      { status: 500 }
    );
  }
}
